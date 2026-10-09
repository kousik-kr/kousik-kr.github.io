from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

OUT = 'docs/CV.pdf'
NAVY = colors.HexColor('#10233c')
TEAL = colors.HexColor('#087f82')
MUTED = colors.HexColor('#5c6879')

def clean(value):
    return str(value).replace('\u2013','-').replace('\u2014','-').replace('\u2011','-').replace('\u2019',"'").replace('&','&amp;')

s = getSampleStyleSheet()
s.add(ParagraphStyle('Name', parent=s['Title'], fontName='Times-Bold', fontSize=24, leading=27, textColor=NAVY, spaceAfter=3))
s.add(ParagraphStyle('Role', parent=s['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=TEAL, spaceAfter=7))
s.add(ParagraphStyle('Contact', parent=s['Normal'], fontSize=8.5, leading=11, textColor=MUTED, spaceAfter=9))
s.add(ParagraphStyle('H', parent=s['Heading2'], fontName='Times-Bold', fontSize=14, leading=17, textColor=NAVY, spaceBefore=10, spaceAfter=5))
s.add(ParagraphStyle('BodySmall', parent=s['BodyText'], fontSize=8.8, leading=12, textColor=colors.HexColor('#26364c'), spaceAfter=4))

def footer(canvas, doc):
    canvas.saveState(); w, _ = A4
    canvas.setStrokeColor(colors.HexColor('#d9e1e2')); canvas.line(18*mm, 14*mm, w-18*mm, 14*mm)
    canvas.setFont('Helvetica', 7.5); canvas.setFillColor(MUTED)
    canvas.drawString(18*mm, 9*mm, 'Dr. Kousik Kumar Dutta - Academic profile')
    canvas.drawRightString(w-18*mm, 9*mm, str(doc.page)); canvas.restoreState()

story = [
    Paragraph('Dr. Kousik Kumar Dutta', s['Name']),
    Paragraph('Computer Science Researcher | Open to Collaboration', s['Role']),
    Paragraph('kousikkumar95@gmail.com | kousik.21csz0004@iitrpr.ac.in | Rupnagar, Punjab, India | kousik-kr.github.io', s['Contact']),
    Paragraph('Profile', s['H']),
    Paragraph(clean('I am a computer science researcher working on preference-aware routing, time-dependent road networks, and scalable graph algorithms. I completed my PhD defence in Computer Science and Engineering at IIT Ropar in September 2026, after doctoral work on constrained maximization of preferences on time-dependent road networks. My research combines algorithms and systems, with an evolving agenda in database systems, spatial and network data management, scalable computing, and graph query processing. I am open to collaboration on graph algorithms, data systems, transportation networks, and related teaching or research initiatives.'), s['BodySmall']),
    Paragraph('Research directions', s['H']),
    Paragraph('<b>Constrained and Preference-Aware Path Query Processing</b><br/>Efficient approaches for constrained and preference-aware path queries in large transportation networks.', s['BodySmall']),
    Paragraph('<b>Scalable Graph Representations and Path-Closure Processing</b><br/>Graph representations and query-processing techniques for connectivity and path relationships in large networks.', s['BodySmall']),
    Paragraph('<b>GPU-Accelerated Graph Analytics and Query Processing</b><br/>Parallel and hardware-accelerated approaches for large-scale graph workloads.', s['BodySmall']),
    Paragraph('Education', s['H']),
    Paragraph('<b>Doctoral study in Computer Science and Engineering</b> - Indian Institute of Technology Ropar (2021-2026)<br/>Dissertation: Constrained Maximization of Preferences on Time-Dependent Road Networks. Defence completed 16 September 2026. Advisors: Dr. Venkata M. V. Gunturi and Dr. T. V. Kalyan. CGPA 7.92/10.00.', s['BodySmall']),
    Paragraph('<b>MTech, Computer Science and Engineering</b> - Indian Institute of Technology Ropar (2019-2021)<br/>Thesis: A Multi-Threading Algorithm for Constrained Path Optimization on Road Networks. CGPA 8.39/10.00.', s['BodySmall']),
    Paragraph('<b>BTech, Computer Science and Engineering</b> - Kalyani Government Engineering College (2014-2018). CGPA 7.45/10.00.', s['BodySmall']),
    Paragraph('Teaching and service', s['H']),
    Paragraph('Teaching assistantships at IIT Ropar: CS301 Databases, CS305 Software Engineering, and CS509 PG Software Lab (2020-2026). Reviewer for GeoInformatica since 2023. Technical Committee Head for SYNTACS 2026. IEEE TCDE Student Grant recipient for MDM 2026. Institute fellowship, 2021-2026; MHRD GATE Scholarship, 2019-2021; GATE 2019 AIR 644.', s['BodySmall']),
    PageBreak(),
    Paragraph('Selected publications', s['H'])
]
pubs = [
    ('2026','A Parallelizable Algorithm for Constrained Maximization of Preferences in Large Time-Dependent Graphs','GeoInformatica 30, article 19. DOI: 10.1007/s10707-026-00577-z.'),
    ('2026','A User-Configurable Navigation System for Wideness and Turn-Aware Routing','MDM, pp. 339-342. DOI: 10.1109/MDM71479.2026.00050.'),
    ('2025/2026','Interval Based Constrained Path Optimization in Time-Dependent Road Networks','WISE 2025 proceedings, LNCS 16368, pp. 165-176. DOI: 10.1007/978-981-95-7251-9_12.'),
    ('2025','Constrained Path Optimization on Time-Dependent Road Networks','WISE 2024 Posters and Demos Track, LNCS 15463, pp. 274-282. DOI: 10.1007/978-981-96-1483-7_24.'),
    ('2022','A Multi-Threading Algorithm for Constrained Path Optimization Problem on Road Networks','WISE 2022, LNCS 13724, pp. 110-118. DOI: 10.1007/978-3-031-20891-1_9.'),
    ('2021','NEAT Activity Detection Using Smartwatch at Low Sampling Frequency','UIC track, pp. 25-32. DOI: 10.1109/SWC50871.2021.00014.'),
    ('2021','A Fairness Conscious Cache Replacement Policy for Last Level Cache','DATE, pp. 695-700. DOI: 10.23919/DATE51398.2021.9474096.'),
    ('2023','CAMOUFLAGE: An Efficient Mechanism to Hide Congestion in NVM LLC','HiPC 2023 Student Research Symposium extended abstract.')]
for year, title, detail in pubs:
    story.append(Paragraph(f'<font color="#087f82"><b>{clean(year)}</b></font> &nbsp; <b>{clean(title)}</b><br/>{clean(detail)}', s['BodySmall']))
story += [Paragraph('Current manuscripts', s['H']), Paragraph('<b>A Bi-Directional Search for Interval Constrained Path Optimization in Large Time-Dependent Road Networks</b><br/>Knowledge and Information Systems - major revision submitted.', s['BodySmall']), Paragraph('<b>A Decomposition-Based Heuristic for Selective Pickup-Delivery Routing with Non-Additive Loading-Unloading Costs</b><br/>Annals of Operations Research - under review.', s['BodySmall']), Paragraph('Profiles', s['H']), Paragraph('Google Scholar: scholar.google.com/citations?hl=en&amp;user=cVei1KAAAAAJ | DBLP: dblp.org/pid/297/4783.html | ORCID: orcid.org/0000-0003-0779-1354 | GitHub: github.com/kousik-kr', s['BodySmall'])]
SimpleDocTemplate(OUT, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=15*mm, bottomMargin=19*mm, title='Curriculum Vitae - Dr. Kousik Kumar Dutta', author='Dr. Kousik Kumar Dutta').build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
