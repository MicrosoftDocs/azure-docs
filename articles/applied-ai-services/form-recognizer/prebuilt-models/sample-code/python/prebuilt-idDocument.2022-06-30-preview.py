import os
import sys
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

def analyze_document(args):
    endpoint = args[1] if len(args) > 1 else "<your-endpoint>"
    key = args[2] if len(args) > 2 else "<your-key>"
    doc_url = args[3] if len(args) > 3 else "<your-document-url>"
    model_id = "prebuilt-idDocument";

    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    poller = document_analysis_client.begin_analyze_document_from_url(model_id, doc_url)
    result = poller.result()
    for document in result.documents:
        if document.doc_type == "idDocument.driverLicense":
            process_id_document_driver_license(document)
        elif document.doc_type == "idDocument.passport":
            process_id_document_passport(document)


def process_id_document_driver_license(document):
    print(f"Document: {document.doc_type}")

    country_region_field = document.fields.get("CountryRegion")
    if country_region_field:
        print(f"    CountryRegion: Value={country_region_field.value}   Confidence={country_region_field.confidence}")
    
    region_field = document.fields.get("Region")
    if region_field:
        print(f"    Region: Value={region_field.value}   Confidence={region_field.confidence}")
    
    document_number_field = document.fields.get("DocumentNumber")
    if document_number_field:
        print(f"    DocumentNumber: Value={document_number_field.value}   Confidence={document_number_field.confidence}")
    
    document_discriminator_field = document.fields.get("DocumentDiscriminator")
    if document_discriminator_field:
        print(f"    DocumentDiscriminator: Value={document_discriminator_field.value}   Confidence={document_discriminator_field.confidence}")
    
    first_name_field = document.fields.get("FirstName")
    if first_name_field:
        print(f"    FirstName: Value={first_name_field.value}   Confidence={first_name_field.confidence}")
    
    last_name_field = document.fields.get("LastName")
    if last_name_field:
        print(f"    LastName: Value={last_name_field.value}   Confidence={last_name_field.confidence}")
    
    address_field = document.fields.get("Address")
    if address_field:
        print(f"    Address: Value={address_field.value}   Confidence={address_field.confidence}")
    
    date_of_birth_field = document.fields.get("DateOfBirth")
    if date_of_birth_field:
        print(f"    DateOfBirth: Value={date_of_birth_field.value}   Confidence={date_of_birth_field.confidence}")
    
    date_of_expiration_field = document.fields.get("DateOfExpiration")
    if date_of_expiration_field:
        print(f"    DateOfExpiration: Value={date_of_expiration_field.value}   Confidence={date_of_expiration_field.confidence}")
    
    date_of_issue_field = document.fields.get("DateOfIssue")
    if date_of_issue_field:
        print(f"    DateOfIssue: Value={date_of_issue_field.value}   Confidence={date_of_issue_field.confidence}")
    
    eye_color_field = document.fields.get("EyeColor")
    if eye_color_field:
        print(f"    EyeColor: Value={eye_color_field.value}   Confidence={eye_color_field.confidence}")
    
    hair_color_field = document.fields.get("HairColor")
    if hair_color_field:
        print(f"    HairColor: Value={hair_color_field.value}   Confidence={hair_color_field.confidence}")
    
    height_field = document.fields.get("Height")
    if height_field:
        print(f"    Height: Value={height_field.value}   Confidence={height_field.confidence}")
    
    weight_field = document.fields.get("Weight")
    if weight_field:
        print(f"    Weight: Value={weight_field.value}   Confidence={weight_field.confidence}")
    
    sex_field = document.fields.get("Sex")
    if sex_field:
        print(f"    Sex: Value={sex_field.value}   Confidence={sex_field.confidence}")
    
    endorsements_field = document.fields.get("Endorsements")
    if endorsements_field:
        print(f"    Endorsements: Value={endorsements_field.value}   Confidence={endorsements_field.confidence}")
    
    restrictions_field = document.fields.get("Restrictions")
    if restrictions_field:
        print(f"    Restrictions: Value={restrictions_field.value}   Confidence={restrictions_field.confidence}")
    
    vehicle_classifications_field = document.fields.get("VehicleClassifications")
    if vehicle_classifications_field:
        print(f"    VehicleClassifications: Value={vehicle_classifications_field.value}   Confidence={vehicle_classifications_field.confidence}")
    
def process_id_document_passport(document):
    print(f"Document: {document.doc_type}")

    machine_readable_zone_field = document.fields.get("MachineReadableZone")
    if machine_readable_zone_field:
        machine_readable_zone_field_fields = machine_readable_zone_field.value
        
        first_name_field = machine_readable_zone_field_fields.get("FirstName")
        if first_name_field:
            print(f"    MachineReadableZone.FirstName: Value={first_name_field.value}   Confidence={first_name_field.confidence}")
        
        last_name_field = machine_readable_zone_field_fields.get("LastName")
        if last_name_field:
            print(f"    MachineReadableZone.LastName: Value={last_name_field.value}   Confidence={last_name_field.confidence}")
        
        document_number_field = machine_readable_zone_field_fields.get("DocumentNumber")
        if document_number_field:
            print(f"    MachineReadableZone.DocumentNumber: Value={document_number_field.value}   Confidence={document_number_field.confidence}")
        
        country_region_field = machine_readable_zone_field_fields.get("CountryRegion")
        if country_region_field:
            print(f"    MachineReadableZone.CountryRegion: Value={country_region_field.value}   Confidence={country_region_field.confidence}")
        
        nationality_field = machine_readable_zone_field_fields.get("Nationality")
        if nationality_field:
            print(f"    MachineReadableZone.Nationality: Value={nationality_field.value}   Confidence={nationality_field.confidence}")
        
        date_of_birth_field = machine_readable_zone_field_fields.get("DateOfBirth")
        if date_of_birth_field:
            print(f"    MachineReadableZone.DateOfBirth: Value={date_of_birth_field.value}   Confidence={date_of_birth_field.confidence}")
        
        date_of_expiration_field = machine_readable_zone_field_fields.get("DateOfExpiration")
        if date_of_expiration_field:
            print(f"    MachineReadableZone.DateOfExpiration: Value={date_of_expiration_field.value}   Confidence={date_of_expiration_field.confidence}")
        
        sex_field = machine_readable_zone_field_fields.get("Sex")
        if sex_field:
            print(f"    MachineReadableZone.Sex: Value={sex_field.value}   Confidence={sex_field.confidence}")
        
    
if __name__ == "__main__":
    analyze_document(sys.argv)