const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const port = Number(process.env.PORT || 3000);

function ensureDataDir() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return [];
    }
}

function writeJsonFile(filePath, value) {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    });
    response.end(JSON.stringify(payload));
}

function getRequestBody(request) {
    return new Promise((resolve, reject) => {
        let raw = '';

        request.on('data', chunk => {
            raw += chunk;
            if (raw.length > 1_000_000) {
                request.destroy();
                reject(new Error('Request body too large'));
            }
        });

        request.on('end', () => {
            if (!raw) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(raw));
            } catch {
                reject(new Error('Invalid JSON body'));
            }
        });

        request.on('error', reject);
    });
}

function validatePayload(payload, requiredFields) {
    return requiredFields.filter(field => !String(payload[field] || '').trim());
}

function appendRecord(fileName, record) {
    ensureDataDir();
    const filePath = path.join(dataDir, fileName);
    const existing = readJsonFile(filePath);
    existing.unshift(record);
    writeJsonFile(filePath, existing);
}

const server = http.createServer(async (request, response) => {
    if (request.method === 'OPTIONS') {
        sendJson(response, 204, {});
        return;
    }

    if (request.url === '/api/messages' && request.method === 'POST') {
        try {
            const body = await getRequestBody(request);
            const missing = validatePayload(body, ['name', 'email', 'subject', 'message']);
            if (missing.length > 0) {
                sendJson(response, 400, { message: `Missing fields: ${missing.join(', ')}` });
                return;
            }

            appendRecord('messages.json', {
                ...body,
                createdAt: new Date().toISOString(),
                type: 'message'
            });

            sendJson(response, 201, { message: 'Message submitted successfully.' });
        } catch (error) {
            sendJson(response, 500, { message: error.message || 'Could not save message.' });
        }
        return;
    }

    if (request.url === '/api/appointments' && request.method === 'POST') {
        try {
            const body = await getRequestBody(request);
            const missing = validatePayload(body, ['name', 'email', 'date', 'time', 'mode', 'subject']);
            if (missing.length > 0) {
                sendJson(response, 400, { message: `Missing fields: ${missing.join(', ')}` });
                return;
            }

            appendRecord('appointments.json', {
                ...body,
                createdAt: new Date().toISOString(),
                type: 'appointment'
            });

            sendJson(response, 201, { message: 'Appointment request submitted successfully.' });
        } catch (error) {
            sendJson(response, 500, { message: error.message || 'Could not save appointment request.' });
        }
        return;
    }

    const requestPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
    const filePath = path.resolve(rootDir, `.${decodeURIComponent(requestPath)}`);
    const rootPath = path.resolve(rootDir);

    if (!filePath.startsWith(rootPath + path.sep) && filePath !== rootPath) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.json': 'application/json; charset=utf-8'
        }[ext] || 'application/octet-stream';

        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
    });
});

server.listen(port, () => {
    console.log(`Portfolio backend running at http://localhost:${port}`);
});