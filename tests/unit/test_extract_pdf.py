import pytest
import os
from api.index import extract_text_from_pdf

def test_extract_text_from_pdf(tmp_path):
    # Create a dummy PDF file for testing
    import string
    from fpdf import FPDF
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="This is a test CV for text extraction.", ln=1, align="C")
    
    test_pdf_path = tmp_path / "test_cv.pdf"
    pdf.output(str(test_pdf_path))
    
    with open(test_pdf_path, "rb") as f:
        file_content = f.read()
        
    text = extract_text_from_pdf(file_content)
    
    assert text is not None
    assert type(text) is str
    assert len(text) > 0
    assert "This is a test CV" in text
