import os
import sys
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

def analyze_document(args):
    endpoint = args[1] if len(args) > 1 else "<your-endpoint>"
    key = args[2] if len(args) > 2 else "<your-key>"
    doc_url = args[3] if len(args) > 3 else "<your-document-url>"
    model_id = "prebuilt-tax.us.w2";

    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    poller = document_analysis_client.begin_analyze_document_from_url(model_id, doc_url)
    result = poller.result()
    for document in result.documents:
        if document.doc_type == "tax.us.w2":
            process_tax_us_w_(document)


def process_tax_us_w_(document):
    print(f"Document: {document.doc_type}")

    w__form_variant_field = document.fields.get("W2FormVariant")
    if w__form_variant_field:
        print(f"    W2FormVariant: Value={w__form_variant_field.value}   Confidence={w__form_variant_field.confidence}")
    
    tax_year_field = document.fields.get("TaxYear")
    if tax_year_field:
        print(f"    TaxYear: Value={tax_year_field.value}   Confidence={tax_year_field.confidence}")
    
    w__copy_field = document.fields.get("W2Copy")
    if w__copy_field:
        print(f"    W2Copy: Value={w__copy_field.value}   Confidence={w__copy_field.confidence}")
    
    employee_field = document.fields.get("Employee")
    if employee_field:
        employee_field_fields = employee_field.value
        
        social_security_number_field = employee_field_fields.get("SocialSecurityNumber")
        if social_security_number_field:
            print(f"    Employee.SocialSecurityNumber: Value={social_security_number_field.value}   Confidence={social_security_number_field.confidence}")
        
        name_field = employee_field_fields.get("Name")
        if name_field:
            print(f"    Employee.Name: Value={name_field.value}   Confidence={name_field.confidence}")
        
        address_field = employee_field_fields.get("Address")
        if address_field:
            print(f"    Employee.Address: Value={address_field.value}   Confidence={address_field.confidence}")
        
    
    control_number_field = document.fields.get("ControlNumber")
    if control_number_field:
        print(f"    ControlNumber: Value={control_number_field.value}   Confidence={control_number_field.confidence}")
    
    employer_field = document.fields.get("Employer")
    if employer_field:
        employer_field_fields = employer_field.value
        
        id_number_field = employer_field_fields.get("IdNumber")
        if id_number_field:
            print(f"    Employer.IdNumber: Value={id_number_field.value}   Confidence={id_number_field.confidence}")
        
        name_field = employer_field_fields.get("Name")
        if name_field:
            print(f"    Employer.Name: Value={name_field.value}   Confidence={name_field.confidence}")
        
        address_field = employer_field_fields.get("Address")
        if address_field:
            print(f"    Employer.Address: Value={address_field.value}   Confidence={address_field.confidence}")
        
    
    wages_tips_and_other_compensation_field = document.fields.get("WagesTipsAndOtherCompensation")
    if wages_tips_and_other_compensation_field:
        print(f"    WagesTipsAndOtherCompensation: Value={wages_tips_and_other_compensation_field.value}   Confidence={wages_tips_and_other_compensation_field.confidence}")
    
    federal_income_tax_withheld_field = document.fields.get("FederalIncomeTaxWithheld")
    if federal_income_tax_withheld_field:
        print(f"    FederalIncomeTaxWithheld: Value={federal_income_tax_withheld_field.value}   Confidence={federal_income_tax_withheld_field.confidence}")
    
    social_security_wages_field = document.fields.get("SocialSecurityWages")
    if social_security_wages_field:
        print(f"    SocialSecurityWages: Value={social_security_wages_field.value}   Confidence={social_security_wages_field.confidence}")
    
    social_security_tax_withheld_field = document.fields.get("SocialSecurityTaxWithheld")
    if social_security_tax_withheld_field:
        print(f"    SocialSecurityTaxWithheld: Value={social_security_tax_withheld_field.value}   Confidence={social_security_tax_withheld_field.confidence}")
    
    medicare_wages_and_tips_field = document.fields.get("MedicareWagesAndTips")
    if medicare_wages_and_tips_field:
        print(f"    MedicareWagesAndTips: Value={medicare_wages_and_tips_field.value}   Confidence={medicare_wages_and_tips_field.confidence}")
    
    medicare_tax_withheld_field = document.fields.get("MedicareTaxWithheld")
    if medicare_tax_withheld_field:
        print(f"    MedicareTaxWithheld: Value={medicare_tax_withheld_field.value}   Confidence={medicare_tax_withheld_field.confidence}")
    
    social_security_tips_field = document.fields.get("SocialSecurityTips")
    if social_security_tips_field:
        print(f"    SocialSecurityTips: Value={social_security_tips_field.value}   Confidence={social_security_tips_field.confidence}")
    
    allocated_tips_field = document.fields.get("AllocatedTips")
    if allocated_tips_field:
        print(f"    AllocatedTips: Value={allocated_tips_field.value}   Confidence={allocated_tips_field.confidence}")
    
    verification_code_field = document.fields.get("VerificationCode")
    if verification_code_field:
        print(f"    VerificationCode: Value={verification_code_field.value}   Confidence={verification_code_field.confidence}")
    
    dependent_care_benefits_field = document.fields.get("DependentCareBenefits")
    if dependent_care_benefits_field:
        print(f"    DependentCareBenefits: Value={dependent_care_benefits_field.value}   Confidence={dependent_care_benefits_field.confidence}")
    
    non_qualified_plans_field = document.fields.get("NonQualifiedPlans")
    if non_qualified_plans_field:
        print(f"    NonQualifiedPlans: Value={non_qualified_plans_field.value}   Confidence={non_qualified_plans_field.confidence}")
    
    additional_info_field = document.fields.get("AdditionalInfo")
    if additional_info_field:
        for index, item in enumerate(additional_info_field.value):
            item_fields = item.value
            
            letter_code_field = item_fields.get("LetterCode")
            if letter_code_field:
                print(f"    AdditionalInfo[{index}].LetterCode: Value={letter_code_field.value}   Confidence={letter_code_field.confidence}")
            
            amount_field = item_fields.get("Amount")
            if amount_field:
                print(f"    AdditionalInfo[{index}].Amount: Value={amount_field.value}   Confidence={amount_field.confidence}")
            
    
    is_statutory_employee_field = document.fields.get("IsStatutoryEmployee")
    if is_statutory_employee_field:
        print(f"    IsStatutoryEmployee: Value={is_statutory_employee_field.value}   Confidence={is_statutory_employee_field.confidence}")
    
    is_retirement_plan_field = document.fields.get("IsRetirementPlan")
    if is_retirement_plan_field:
        print(f"    IsRetirementPlan: Value={is_retirement_plan_field.value}   Confidence={is_retirement_plan_field.confidence}")
    
    is_third_party_sick_pay_field = document.fields.get("IsThirdPartySickPay")
    if is_third_party_sick_pay_field:
        print(f"    IsThirdPartySickPay: Value={is_third_party_sick_pay_field.value}   Confidence={is_third_party_sick_pay_field.confidence}")
    
    other_field = document.fields.get("Other")
    if other_field:
        print(f"    Other: Value={other_field.value}   Confidence={other_field.confidence}")
    
    state_tax_infos_field = document.fields.get("StateTaxInfos")
    if state_tax_infos_field:
        for index, item in enumerate(state_tax_infos_field.value):
            item_fields = item.value
            
            state_field = item_fields.get("State")
            if state_field:
                print(f"    StateTaxInfos[{index}].State: Value={state_field.value}   Confidence={state_field.confidence}")
            
            employer_state_id_number_field = item_fields.get("EmployerStateIdNumber")
            if employer_state_id_number_field:
                print(f"    StateTaxInfos[{index}].EmployerStateIdNumber: Value={employer_state_id_number_field.value}   Confidence={employer_state_id_number_field.confidence}")
            
            state_wages_tips_etc_field = item_fields.get("StateWagesTipsEtc")
            if state_wages_tips_etc_field:
                print(f"    StateTaxInfos[{index}].StateWagesTipsEtc: Value={state_wages_tips_etc_field.value}   Confidence={state_wages_tips_etc_field.confidence}")
            
            state_income_tax_field = item_fields.get("StateIncomeTax")
            if state_income_tax_field:
                print(f"    StateTaxInfos[{index}].StateIncomeTax: Value={state_income_tax_field.value}   Confidence={state_income_tax_field.confidence}")
            
    
    local_tax_infos_field = document.fields.get("LocalTaxInfos")
    if local_tax_infos_field:
        for index, item in enumerate(local_tax_infos_field.value):
            item_fields = item.value
            
            local_wages_tips_etc_field = item_fields.get("LocalWagesTipsEtc")
            if local_wages_tips_etc_field:
                print(f"    LocalTaxInfos[{index}].LocalWagesTipsEtc: Value={local_wages_tips_etc_field.value}   Confidence={local_wages_tips_etc_field.confidence}")
            
            local_income_tax_field = item_fields.get("LocalIncomeTax")
            if local_income_tax_field:
                print(f"    LocalTaxInfos[{index}].LocalIncomeTax: Value={local_income_tax_field.value}   Confidence={local_income_tax_field.confidence}")
            
            locality_name_field = item_fields.get("LocalityName")
            if locality_name_field:
                print(f"    LocalTaxInfos[{index}].LocalityName: Value={locality_name_field.value}   Confidence={locality_name_field.confidence}")
            
    
if __name__ == "__main__":
    analyze_document(sys.argv)