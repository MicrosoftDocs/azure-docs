import os
import sys
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

def analyze_document(args):
    endpoint = args[1] if len(args) > 1 else "<your-endpoint>"
    key = args[2] if len(args) > 2 else "<your-key>"
    doc_url = args[3] if len(args) > 3 else "<your-document-url>"
    model_id = "prebuilt-receipt";

    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    poller = document_analysis_client.begin_analyze_document_from_url(model_id, doc_url)
    result = poller.result()
    for document in result.documents:
        if document.doc_type == "receipt":
            process_receipt(document)
        elif document.doc_type == "receipt.retailMeal":
            process_receipt_retail_meal(document)
        elif document.doc_type == "receipt.creditCard":
            process_receipt_credit_card(document)
        elif document.doc_type == "receipt.gas":
            process_receipt_gas(document)
        elif document.doc_type == "receipt.parking":
            process_receipt_parking(document)
        elif document.doc_type == "receipt.hotel":
            process_receipt_hotel(document)


def process_receipt(document):
    print(f"Document: {document.doc_type}")

    merchant_name_field = document.fields.get("MerchantName")
    if merchant_name_field:
        print(f"    MerchantName: Value={merchant_name_field.value}   Confidence={merchant_name_field.confidence}")
    
    merchant_phone_number_field = document.fields.get("MerchantPhoneNumber")
    if merchant_phone_number_field:
        print(f"    MerchantPhoneNumber: Value={merchant_phone_number_field.value}   Confidence={merchant_phone_number_field.confidence}")
    
    merchant_address_field = document.fields.get("MerchantAddress")
    if merchant_address_field:
        print(f"    MerchantAddress: Value={merchant_address_field.value}   Confidence={merchant_address_field.confidence}")
    
    total_field = document.fields.get("Total")
    if total_field:
        print(f"    Total: Value={total_field.value}   Confidence={total_field.confidence}")
    
    transaction_date_field = document.fields.get("TransactionDate")
    if transaction_date_field:
        print(f"    TransactionDate: Value={transaction_date_field.value}   Confidence={transaction_date_field.confidence}")
    
    transaction_time_field = document.fields.get("TransactionTime")
    if transaction_time_field:
        print(f"    TransactionTime: Value={transaction_time_field.value}   Confidence={transaction_time_field.confidence}")
    
    subtotal_field = document.fields.get("Subtotal")
    if subtotal_field:
        print(f"    Subtotal: Value={subtotal_field.value}   Confidence={subtotal_field.confidence}")
    
    total_tax_field = document.fields.get("TotalTax")
    if total_tax_field:
        print(f"    TotalTax: Value={total_tax_field.value}   Confidence={total_tax_field.confidence}")
    
    tip_field = document.fields.get("Tip")
    if tip_field:
        print(f"    Tip: Value={tip_field.value}   Confidence={tip_field.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            total_price_field = item_fields.get("TotalPrice")
            if total_price_field:
                print(f"    Items[{index}].TotalPrice: Value={total_price_field.value}   Confidence={total_price_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            quantity_field = item_fields.get("Quantity")
            if quantity_field:
                print(f"    Items[{index}].Quantity: Value={quantity_field.value}   Confidence={quantity_field.confidence}")
            
            price_field = item_fields.get("Price")
            if price_field:
                print(f"    Items[{index}].Price: Value={price_field.value}   Confidence={price_field.confidence}")
            
    
def process_receipt_retail_meal(document):
    print(f"Document: {document.doc_type}")

    merchant_name_field = document.fields.get("MerchantName")
    if merchant_name_field:
        print(f"    MerchantName: Value={merchant_name_field.value}   Confidence={merchant_name_field.confidence}")
    
    merchant_phone_number_field = document.fields.get("MerchantPhoneNumber")
    if merchant_phone_number_field:
        print(f"    MerchantPhoneNumber: Value={merchant_phone_number_field.value}   Confidence={merchant_phone_number_field.confidence}")
    
    merchant_address_field = document.fields.get("MerchantAddress")
    if merchant_address_field:
        print(f"    MerchantAddress: Value={merchant_address_field.value}   Confidence={merchant_address_field.confidence}")
    
    total_field = document.fields.get("Total")
    if total_field:
        print(f"    Total: Value={total_field.value}   Confidence={total_field.confidence}")
    
    transaction_date_field = document.fields.get("TransactionDate")
    if transaction_date_field:
        print(f"    TransactionDate: Value={transaction_date_field.value}   Confidence={transaction_date_field.confidence}")
    
    transaction_time_field = document.fields.get("TransactionTime")
    if transaction_time_field:
        print(f"    TransactionTime: Value={transaction_time_field.value}   Confidence={transaction_time_field.confidence}")
    
    subtotal_field = document.fields.get("Subtotal")
    if subtotal_field:
        print(f"    Subtotal: Value={subtotal_field.value}   Confidence={subtotal_field.confidence}")
    
    total_tax_field = document.fields.get("TotalTax")
    if total_tax_field:
        print(f"    TotalTax: Value={total_tax_field.value}   Confidence={total_tax_field.confidence}")
    
    tip_field = document.fields.get("Tip")
    if tip_field:
        print(f"    Tip: Value={tip_field.value}   Confidence={tip_field.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            total_price_field = item_fields.get("TotalPrice")
            if total_price_field:
                print(f"    Items[{index}].TotalPrice: Value={total_price_field.value}   Confidence={total_price_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            quantity_field = item_fields.get("Quantity")
            if quantity_field:
                print(f"    Items[{index}].Quantity: Value={quantity_field.value}   Confidence={quantity_field.confidence}")
            
            price_field = item_fields.get("Price")
            if price_field:
                print(f"    Items[{index}].Price: Value={price_field.value}   Confidence={price_field.confidence}")
            
    
def process_receipt_credit_card(document):
    print(f"Document: {document.doc_type}")

    merchant_name_field = document.fields.get("MerchantName")
    if merchant_name_field:
        print(f"    MerchantName: Value={merchant_name_field.value}   Confidence={merchant_name_field.confidence}")
    
    merchant_phone_number_field = document.fields.get("MerchantPhoneNumber")
    if merchant_phone_number_field:
        print(f"    MerchantPhoneNumber: Value={merchant_phone_number_field.value}   Confidence={merchant_phone_number_field.confidence}")
    
    merchant_address_field = document.fields.get("MerchantAddress")
    if merchant_address_field:
        print(f"    MerchantAddress: Value={merchant_address_field.value}   Confidence={merchant_address_field.confidence}")
    
    total_field = document.fields.get("Total")
    if total_field:
        print(f"    Total: Value={total_field.value}   Confidence={total_field.confidence}")
    
    transaction_date_field = document.fields.get("TransactionDate")
    if transaction_date_field:
        print(f"    TransactionDate: Value={transaction_date_field.value}   Confidence={transaction_date_field.confidence}")
    
    transaction_time_field = document.fields.get("TransactionTime")
    if transaction_time_field:
        print(f"    TransactionTime: Value={transaction_time_field.value}   Confidence={transaction_time_field.confidence}")
    
    subtotal_field = document.fields.get("Subtotal")
    if subtotal_field:
        print(f"    Subtotal: Value={subtotal_field.value}   Confidence={subtotal_field.confidence}")
    
    total_tax_field = document.fields.get("TotalTax")
    if total_tax_field:
        print(f"    TotalTax: Value={total_tax_field.value}   Confidence={total_tax_field.confidence}")
    
    tip_field = document.fields.get("Tip")
    if tip_field:
        print(f"    Tip: Value={tip_field.value}   Confidence={tip_field.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            total_price_field = item_fields.get("TotalPrice")
            if total_price_field:
                print(f"    Items[{index}].TotalPrice: Value={total_price_field.value}   Confidence={total_price_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            quantity_field = item_fields.get("Quantity")
            if quantity_field:
                print(f"    Items[{index}].Quantity: Value={quantity_field.value}   Confidence={quantity_field.confidence}")
            
            price_field = item_fields.get("Price")
            if price_field:
                print(f"    Items[{index}].Price: Value={price_field.value}   Confidence={price_field.confidence}")
            
    
def process_receipt_gas(document):
    print(f"Document: {document.doc_type}")

    merchant_name_field = document.fields.get("MerchantName")
    if merchant_name_field:
        print(f"    MerchantName: Value={merchant_name_field.value}   Confidence={merchant_name_field.confidence}")
    
    merchant_phone_number_field = document.fields.get("MerchantPhoneNumber")
    if merchant_phone_number_field:
        print(f"    MerchantPhoneNumber: Value={merchant_phone_number_field.value}   Confidence={merchant_phone_number_field.confidence}")
    
    merchant_address_field = document.fields.get("MerchantAddress")
    if merchant_address_field:
        print(f"    MerchantAddress: Value={merchant_address_field.value}   Confidence={merchant_address_field.confidence}")
    
    total_field = document.fields.get("Total")
    if total_field:
        print(f"    Total: Value={total_field.value}   Confidence={total_field.confidence}")
    
    transaction_date_field = document.fields.get("TransactionDate")
    if transaction_date_field:
        print(f"    TransactionDate: Value={transaction_date_field.value}   Confidence={transaction_date_field.confidence}")
    
    transaction_time_field = document.fields.get("TransactionTime")
    if transaction_time_field:
        print(f"    TransactionTime: Value={transaction_time_field.value}   Confidence={transaction_time_field.confidence}")
    
    subtotal_field = document.fields.get("Subtotal")
    if subtotal_field:
        print(f"    Subtotal: Value={subtotal_field.value}   Confidence={subtotal_field.confidence}")
    
    total_tax_field = document.fields.get("TotalTax")
    if total_tax_field:
        print(f"    TotalTax: Value={total_tax_field.value}   Confidence={total_tax_field.confidence}")
    
    tip_field = document.fields.get("Tip")
    if tip_field:
        print(f"    Tip: Value={tip_field.value}   Confidence={tip_field.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            total_price_field = item_fields.get("TotalPrice")
            if total_price_field:
                print(f"    Items[{index}].TotalPrice: Value={total_price_field.value}   Confidence={total_price_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            quantity_field = item_fields.get("Quantity")
            if quantity_field:
                print(f"    Items[{index}].Quantity: Value={quantity_field.value}   Confidence={quantity_field.confidence}")
            
            price_field = item_fields.get("Price")
            if price_field:
                print(f"    Items[{index}].Price: Value={price_field.value}   Confidence={price_field.confidence}")
            
    
def process_receipt_parking(document):
    print(f"Document: {document.doc_type}")

    merchant_name_field = document.fields.get("MerchantName")
    if merchant_name_field:
        print(f"    MerchantName: Value={merchant_name_field.value}   Confidence={merchant_name_field.confidence}")
    
    merchant_phone_number_field = document.fields.get("MerchantPhoneNumber")
    if merchant_phone_number_field:
        print(f"    MerchantPhoneNumber: Value={merchant_phone_number_field.value}   Confidence={merchant_phone_number_field.confidence}")
    
    merchant_address_field = document.fields.get("MerchantAddress")
    if merchant_address_field:
        print(f"    MerchantAddress: Value={merchant_address_field.value}   Confidence={merchant_address_field.confidence}")
    
    total_field = document.fields.get("Total")
    if total_field:
        print(f"    Total: Value={total_field.value}   Confidence={total_field.confidence}")
    
    transaction_date_field = document.fields.get("TransactionDate")
    if transaction_date_field:
        print(f"    TransactionDate: Value={transaction_date_field.value}   Confidence={transaction_date_field.confidence}")
    
    transaction_time_field = document.fields.get("TransactionTime")
    if transaction_time_field:
        print(f"    TransactionTime: Value={transaction_time_field.value}   Confidence={transaction_time_field.confidence}")
    
    subtotal_field = document.fields.get("Subtotal")
    if subtotal_field:
        print(f"    Subtotal: Value={subtotal_field.value}   Confidence={subtotal_field.confidence}")
    
    total_tax_field = document.fields.get("TotalTax")
    if total_tax_field:
        print(f"    TotalTax: Value={total_tax_field.value}   Confidence={total_tax_field.confidence}")
    
    tip_field = document.fields.get("Tip")
    if tip_field:
        print(f"    Tip: Value={tip_field.value}   Confidence={tip_field.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            total_price_field = item_fields.get("TotalPrice")
            if total_price_field:
                print(f"    Items[{index}].TotalPrice: Value={total_price_field.value}   Confidence={total_price_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            quantity_field = item_fields.get("Quantity")
            if quantity_field:
                print(f"    Items[{index}].Quantity: Value={quantity_field.value}   Confidence={quantity_field.confidence}")
            
            price_field = item_fields.get("Price")
            if price_field:
                print(f"    Items[{index}].Price: Value={price_field.value}   Confidence={price_field.confidence}")
            
    
def process_receipt_hotel(document):
    print(f"Document: {document.doc_type}")

    merchant_name_field = document.fields.get("MerchantName")
    if merchant_name_field:
        print(f"    MerchantName: Value={merchant_name_field.value}   Confidence={merchant_name_field.confidence}")
    
    merchant_phone_number_field = document.fields.get("MerchantPhoneNumber")
    if merchant_phone_number_field:
        print(f"    MerchantPhoneNumber: Value={merchant_phone_number_field.value}   Confidence={merchant_phone_number_field.confidence}")
    
    merchant_address_field = document.fields.get("MerchantAddress")
    if merchant_address_field:
        print(f"    MerchantAddress: Value={merchant_address_field.value}   Confidence={merchant_address_field.confidence}")
    
    total_field = document.fields.get("Total")
    if total_field:
        print(f"    Total: Value={total_field.value}   Confidence={total_field.confidence}")
    
    arrival_date_field = document.fields.get("ArrivalDate")
    if arrival_date_field:
        print(f"    ArrivalDate: Value={arrival_date_field.value}   Confidence={arrival_date_field.confidence}")
    
    departure_date_field = document.fields.get("DepartureDate")
    if departure_date_field:
        print(f"    DepartureDate: Value={departure_date_field.value}   Confidence={departure_date_field.confidence}")
    
    currency_field = document.fields.get("Currency")
    if currency_field:
        print(f"    Currency: Value={currency_field.value}   Confidence={currency_field.confidence}")
    
    merchant_aliases_field = document.fields.get("MerchantAliases")
    if merchant_aliases_field:
        for index, item in enumerate(merchant_aliases_field.value):
            print(f"    MerchantAliases[{index}]: Value={item.value}   Confidence={item.confidence}")
    
    items_field = document.fields.get("Items")
    if items_field:
        for index, item in enumerate(items_field.value):
            item_fields = item.value
            
            total_price_field = item_fields.get("TotalPrice")
            if total_price_field:
                print(f"    Items[{index}].TotalPrice: Value={total_price_field.value}   Confidence={total_price_field.confidence}")
            
            description_field = item_fields.get("Description")
            if description_field:
                print(f"    Items[{index}].Description: Value={description_field.value}   Confidence={description_field.confidence}")
            
            date_field = item_fields.get("Date")
            if date_field:
                print(f"    Items[{index}].Date: Value={date_field.value}   Confidence={date_field.confidence}")
            
            category_field = item_fields.get("Category")
            if category_field:
                print(f"    Items[{index}].Category: Value={category_field.value}   Confidence={category_field.confidence}")
            
    
if __name__ == "__main__":
    analyze_document(sys.argv)