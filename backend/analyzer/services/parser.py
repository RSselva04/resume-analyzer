import io
import re

def clean_text(text: str) -> str:
    """Normalize whitespace and remove non-printable characters."""
    if not text:
        return ""
    # Replace multiple spaces with a single space
    text = re.sub(r'[ \t]+', ' ', text)
    # Replace more than 2 consecutive newlines with 2 newlines
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    return text.strip()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF using pdfplumber, falling back to pypdf."""
    extracted_text = []
    
    # Try pdfplumber first (better layout and table preservation)
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
        if extracted_text:
            return clean_text("\n\n".join(extracted_text))
    except Exception as e:
        pass  # Fall back to pypdf

    # Fallback to pypdf
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        return clean_text("\n\n".join(extracted_text))
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX using python-docx."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        
        # Also extract table cells
        for table in doc.tables:
            for row in table.rows:
                row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if row_text:
                    paragraphs.append(" | ".join(row_text))
                    
        return clean_text("\n\n".join(paragraphs))
    except Exception as e:
        raise ValueError(f"Failed to extract text from DOCX: {str(e)}")

def parse_resume_file(uploaded_file) -> str:
    """
    Parse an uploaded Django file object (PDF, DOCX, TXT) and return clean plain text.
    """
    filename = uploaded_file.name.lower()
    content = uploaded_file.read()
    
    # Reset read pointer so Django can save it if needed
    uploaded_file.seek(0)
    
    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(content)
    elif filename.endswith('.docx') or filename.endswith('.doc'):
        text = extract_text_from_docx(content)
    elif filename.endswith('.txt'):
        text = content.decode('utf-8', errors='ignore')
    else:
        raise ValueError("Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
        
    if not text.strip():
        raise ValueError("Could not extract any readable text from the uploaded file. Please ensure it is not a scanned image without OCR.")
        
    return text
