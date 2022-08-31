import os
import sys
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

def analyze_document(args):
    endpoint = args[1] if len(args) > 1 else "<your-endpoint>"
    key = args[2] if len(args) > 2 else "<your-key>"
    doc_url = args[3] if len(args) > 3 else "<your-document-url>"
    model_id = "prebuilt-businessCard";

    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    poller = document_analysis_client.begin_analyze_document_from_url(model_id, doc_url)
    result = poller.result()
    for document in result.documents:
        if document.doc_type == "businessCard":
            process_business_card(document)


def process_business_card(document):
    print(f"Document: {document.doc_type}")

    contact_names_field = document.fields.get("ContactNames")
    if contact_names_field:
        for index, item in enumerate(contact_names_field.value):
            item_fields = item.value
            
            first_name_field = item_fields.get("FirstName")
            if first_name_field:
                print(f"    ContactNames[{index}].FirstName: Value={first_name_field.value}   Confidence={first_name_field.confidence}")
            
            last_name_field = item_fields.get("LastName")
            if last_name_field:
                print(f"    ContactNames[{index}].LastName: Value={last_name_field.value}   Confidence={last_name_field.confidence}")
            
    
    company_names_field = document.fields.get("CompanyNames")
    if company_names_field:
        for index, item in enumerate(company_names_field.value):
            print(f"    CompanyNames[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    job_titles_field = document.fields.get("JobTitles")
    if job_titles_field:
        for index, item in enumerate(job_titles_field.value):
            print(f"    JobTitles[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    departments_field = document.fields.get("Departments")
    if departments_field:
        for index, item in enumerate(departments_field.value):
            print(f"    Departments[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    addresses_field = document.fields.get("Addresses")
    if addresses_field:
        for index, item in enumerate(addresses_field.value):
            print(f"    Addresses[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    work_phones_field = document.fields.get("WorkPhones")
    if work_phones_field:
        for index, item in enumerate(work_phones_field.value):
            print(f"    WorkPhones[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    mobile_phones_field = document.fields.get("MobilePhones")
    if mobile_phones_field:
        for index, item in enumerate(mobile_phones_field.value):
            print(f"    MobilePhones[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    faxes_field = document.fields.get("Faxes")
    if faxes_field:
        for index, item in enumerate(faxes_field.value):
            print(f"    Faxes[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    other_phones_field = document.fields.get("OtherPhones")
    if other_phones_field:
        for index, item in enumerate(other_phones_field.value):
            print(f"    OtherPhones[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    emails_field = document.fields.get("Emails")
    if emails_field:
        for index, item in enumerate(emails_field.value):
            print(f"    Emails[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    websites_field = document.fields.get("Websites")
    if websites_field:
        for index, item in enumerate(websites_field.value):
            print(f"    Websites[{index}]: Value={item.value}   Confidence={item.confidence}")
    
if __name__ == "__main__":
    analyze_document(sys.argv)