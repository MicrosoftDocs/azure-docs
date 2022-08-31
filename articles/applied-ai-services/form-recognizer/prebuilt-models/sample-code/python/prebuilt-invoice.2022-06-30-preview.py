import os
import sys
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

def analyze_document(args):
    endpoint = args[1] if len(args) > 1 else "<your-endpoint>"
    key = args[2] if len(args) > 2 else "<your-key>"
    doc_url = args[3] if len(args) > 3 else "<your-document-url>"
    model_id = "prebuilt-invoice";

    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    poller = document_analysis_client.begin_analyze_document_from_url(model_id, doc_url)
    result = poller.result()
    for document in result.documents:
        if document.doc_type == "invoice":
            process_invoice(document)


def process_invoice(document):
    print(f"Document: {document.doc_type}")

    customer_name_field = document.fields.get("CustomerName")
    if customer_name_field:
        print(f"    CustomerName: Value={customer_name_field.value}   Confidence={customer_name_field.confidence}")
    
    customer_id_field = document.fields.get("CustomerId")
    if customer_id_field:
        print(f"    CustomerId: Value={customer_id_field.value}   Confidence={customer_id_field.confidence}")
    
    purchase_order_field = document.fields.get("PurchaseOrder")
    if purchase_order_field:
        print(f"    PurchaseOrder: Value={purchase_order_field.value}   Confidence={purchase_order_field.confidence}")
    
    invoice_id_field = document.fields.get("InvoiceId")
    if invoice_id_field:
        print(f"    InvoiceId: Value={invoice_id_field.value}   Confidence={invoice_id_field.confidence}")
    
    invoice_date_field = document.fields.get("InvoiceDate")
    if invoice_date_field:
        print(f"    InvoiceDate: Value={invoice_date_field.value}   Confidence={invoice_date_field.confidence}")
    
    due_date_field = document.fields.get("DueDate")
    if due_date_field:
        print(f"    DueDate: Value={due_date_field.value}   Confidence={due_date_field.confidence}")
    
    vendor_name_field = document.fields.get("VendorName")
    if vendor_name_field:
        print(f"    VendorName: Value={vendor_name_field.value}   Confidence={vendor_name_field.confidence}")
    
    vendor_address_field = document.fields.get("VendorAddress")
    if vendor_address_field:
        print(f"    VendorAddress: Value={vendor_address_field.value}   Confidence={vendor_address_field.confidence}")
    
    vendor_address_recipient_field = document.fields.get("VendorAddressRecipient")
    if vendor_address_recipient_field:
        print(f"    VendorAddressRecipient: Value={vendor_address_recipient_field.value}   Confidence={vendor_address_recipient_field.confidence}")
    
    customer_address_field = document.fields.get("CustomerAddress")
    if customer_address_field:
        print(f"    CustomerAddress: Value={customer_address_field.value}   Confidence={customer_address_field.confidence}")
    
    customer_address_recipient_field = document.fields.get("CustomerAddressRecipient")
    if customer_address_recipient_field:
        print(f"    CustomerAddressRecipient: Value={customer_address_recipient_field.value}   Confidence={customer_address_recipient_field.confidence}")
    
    billing_address_field = document.fields.get("BillingAddress")
    if billing_address_field:
        print(f"    BillingAddress: Value={billing_address_field.value}   Confidence={billing_address_field.confidence}")
    
    billing_address_recipient_field = document.fields.get("BillingAddressRecipient")
    if billing_address_recipient_field:
        print(f"    BillingAddressRecipient: Value={billing_address_recipient_field.value}   Confidence={billing_address_recipient_field.confidence}")
    
    shipping_address_field = document.fields.get("ShippingAddress")
    if shipping_address_field:
        print(f"    ShippingAddress: Value={shipping_address_field.value}   Confidence={shipping_address_field.confidence}")
    
    shipping_address_recipient_field = document.fields.get("ShippingAddressRecipient")
    if shipping_address_recipient_field:
        print(f"    ShippingAddressRecipient: Value={shipping_address_recipient_field.value}   Confidence={shipping_address_recipient_field.confidence}")
    
    sub_total_field = document.fields.get("SubTotal")
    if sub_total_field:
        print(f"    SubTotal: Value={sub_total_field.value}   Confidence={sub_total_field.confidence}")
    
    total_tax_field = document.fields.get("TotalTax")
    if total_tax_field:
        print(f"    TotalTax: Value={total_tax_field.value}   Confidence={total_tax_field.confidence}")
    
    invoice_total_field = document.fields.get("InvoiceTotal")
    if invoice_total_field:
        print(f"    InvoiceTotal: Value={invoice_total_field.value}   Confidence={invoice_total_field.confidence}")
    
    amount_due_field = document.fields.get("AmountDue")
    if amount_due_field:
        print(f"    AmountDue: Value={amount_due_field.value}   Confidence={amount_due_field.confidence}")
    
    previous_unpaid_balance_field = document.fields.get("PreviousUnpaidBalance")
    if previous_unpaid_balance_field:
        print(f"    PreviousUnpaidBalance: Value={previous_unpaid_balance_field.value}   Confidence={previous_unpaid_balance_field.confidence}")
    
    remittance_address_field = document.fields.get("RemittanceAddress")
    if remittance_address_field:
        print(f"    RemittanceAddress: Value={remittance_address_field.value}   Confidence={remittance_address_field.confidence}")
    
    remittance_address_recipient_field = document.fields.get("RemittanceAddressRecipient")
    if remittance_address_recipient_field:
        print(f"    RemittanceAddressRecipient: Value={remittance_address_recipient_field.value}   Confidence={remittance_address_recipient_field.confidence}")
    
    service_address_field = document.fields.get("ServiceAddress")
    if service_address_field:
        print(f"    ServiceAddress: Value={service_address_field.value}   Confidence={service_address_field.confidence}")
    
    service_address_recipient_field = document.fields.get("ServiceAddressRecipient")
    if service_address_recipient_field:
        print(f"    ServiceAddressRecipient: Value={service_address_recipient_field.value}   Confidence={service_address_recipient_field.confidence}")
    
    service_start_date_field = document.fields.get("ServiceStartDate")
    if service_start_date_field:
        print(f"    ServiceStartDate: Value={service_start_date_field.value}   Confidence={service_start_date_field.confidence}")
    
    service_end_date_field = document.fields.get("ServiceEndDate")
    if service_end_date_field:
        print(f"    ServiceEndDate: Value={service_end_date_field.value}   Confidence={service_end_date_field.confidence}")
    
    total_v_a_t_field = document.fields.get("TotalVAT")
    if total_v_a_t_field:
        print(f"    TotalVAT: Value={total_v_a_t_field.value}   Confidence={total_v_a_t_field.confidence}")
    
    vendor_tax_id_field = document.fields.get("VendorTaxId")
    if vendor_tax_id_field:
        print(f"    VendorTaxId: Value={vendor_tax_id_field.value}   Confidence={vendor_tax_id_field.confidence}")
    
    customer_tax_id_field = document.fields.get("CustomerTaxId")
    if customer_tax_id_field:
        print(f"    CustomerTaxId: Value={customer_tax_id_field.value}   Confidence={customer_tax_id_field.confidence}")
    
    payment_term_field = document.fields.get("PaymentTerm")
    if payment_term_field:
        print(f"    PaymentTerm: Value={payment_term_field.value}   Confidence={payment_term_field.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            amount_field = item_fields.get("Amount")
            if amount_field:
                print(f"    Items[{index}].Amount: Value={amount_field.value}   Confidence={amount_field.confidence}")
            
            date_field = item_fields.get("Date")
            if date_field:
                print(f"    Items[{index}].Date: Value={date_field.value}   Confidence={date_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            quantity_field = item_fields.get("Quantity")
            if quantity_field:
                print(f"    Items[{index}].Quantity: Value={quantity_field.value}   Confidence={quantity_field.confidence}")
            
            product_code_field = item_fields.get("ProductCode")
            if product_code_field:
                print(f"    Items[{index}].ProductCode: Value={product_code_field.value}   Confidence={product_code_field.confidence}")
            
            tax_field = item_fields.get("Tax")
            if tax_field:
                print(f"    Items[{index}].Tax: Value={tax_field.value}   Confidence={tax_field.confidence}")
            
            unit_field = item_fields.get("Unit")
            if unit_field:
                print(f"    Items[{index}].Unit: Value={unit_field.value}   Confidence={unit_field.confidence}")
            
            unit_price_field = item_fields.get("UnitPrice")
            if unit_price_field:
                print(f"    Items[{index}].UnitPrice: Value={unit_price_field.value}   Confidence={unit_price_field.confidence}")
            
            v_a_t_field = item_fields.get("VAT")
            if v_a_t_field:
                print(f"    Items[{index}].VAT: Value={v_a_t_field.value}   Confidence={v_a_t_field.confidence}")
            
    
if __name__ == "__main__":
    analyze_document(sys.argv)