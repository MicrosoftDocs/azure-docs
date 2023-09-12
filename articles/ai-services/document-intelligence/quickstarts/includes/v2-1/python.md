---
title: "Get started: Document Intelligence (formerly Form Recognizer) client library for Python v2.1"
titleSuffix: Azure AI services
description: Form and document processing, data extraction, and analysis using Document Intelligence Python client library SDKs v2.1
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: includes
ms.date: 07/18/2023
ms.author: lajanuar
---

[Reference documentation](/python/api/azure-ai-formrecognizer) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/azure/ai/formrecognizer) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples)

In this quickstart, you use the following APIs to extract structured data from forms and documents:

* [Layout](#try-it-layout-model)

* [Invoice](#try-it-prebuilt-model)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [Python 3.x](https://www.python.org/)

  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Set up

Open a terminal window in your local environment and install the Azure AI Document Intelligence client library for Python with pip:

```console
pip install azure-ai-formrecognizer

```

### Create a new Python application

Create a new Python application called **form_recognizer_quickstart.py** in your preferred editor or IDE. Then import the following libraries:

```python
import os
from azure.ai.formrecognizer import FormRecognizerClient
from azure.core.credentials import AzureKeyCredential
```

### Create variables for your Azure resource endpoint and key

```python
endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"
key = "YOUR_FORM_RECOGNIZER_KEY"
```

At this point, your Python application should contain the following lines of code:

```python
import os
from azure.core.exceptions import ResourceNotFoundError
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"
key = "YOUR_FORM_RECOGNIZER_KEY"
```

### Select a code sample to copy and paste into your application:

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Invoice**](#try-it-prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../ai-services/security-features.md).

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **document file at a URI**. You can use our [sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * We've added the file URI value to the `formUrl` variable near the top of the file.
> * To analyze a given file at a URI, you'll use the `begin_recognize_content_from_url` method.

### Add the following code to your layout application on the line below the `key` variable

```python

  def format_bounding_box(bounding_box):
    if not bounding_box:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in bounding_box])

 def recognize_content():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    form_recognizer_client = FormRecognizerClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = form_recognizer_client.begin_recognize_content_from_url(formUrl)
    form_pages = poller.result()

    for idx, content in enumerate(form_pages):
        print(
            "Page has width: {} and height: {}, measured with unit: {}".format(
                content.width, content.height, content.unit
            )
        )
        for table_idx, table in enumerate(content.tables):
            print(
                "Table # {} has {} rows and {} columns".format(
                    table_idx, table.row_count, table.column_count
                )
            )
            print(
                "Table # {} location on page: {}".format(
                    table_idx, format_bounding_box(table.bounding_box)
                )
            )
            for cell in table.cells:
                print(
                    "...Cell[{}][{}] has text '{}' within bounding box '{}'".format(
                        cell.row_index,
                        cell.column_index,
                        cell.text,
                        format_bounding_box(cell.bounding_box),
                    )
                )

        for line_idx, line in enumerate(content.lines):
            print(
                "Line # {} has word count '{}' and text '{}' within bounding box '{}'".format(
                    line_idx,
                    len(line.words),
                    line.text,
                    format_bounding_box(line.bounding_box),
                )
            )
            if line.appearance:
                if (
                    line.appearance.style_name == "handwriting"
                    and line.appearance.style_confidence > 0.8
                ):
                    print(
                        "Text line '{}' is handwritten and might be a signature.".format(
                            line.text
                        )
                    )
            for word in line.words:
                print(
                    "...Word '{}' has a confidence of {}".format(
                        word.text, word.confidence
                    )
                )

        for selection_mark in content.selection_marks:
            print(
                "Selection mark is '{}' within bounding box '{}' and has a confidence of {}".format(
                    selection_mark.state,
                    format_bounding_box(selection_mark.bounding_box),
                    selection_mark.confidence,
                )
            )
        print("----------------------------------------")


if __name__ == "__main__":
    recognize_content()
```

## **Try it**: Prebuilt model

This sample demonstrates how to analyze data from certain types of common documents with pretrained models, using an invoice as an example. *See* our prebuilt concept page for a complete list of [**invoice fields**](../../../concept-invoice.md#field-extraction)

> [!div class="checklist"]
>
> * For this example, we wll analyze an invoice document using a prebuilt model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URI value to the ``formUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the ``begin_recognize_invoices_from_url` method.
> * For simplicity, all the fields that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../../../concept-invoice.md#field-extraction) concept page.

### Choose a prebuilt model

You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the prebuilt models currently supported by the Document Intelligence service:

* [**Invoice**](../../../concept-invoice.md): extracts text, selection marks, tables, fields, and key information from invoices.
* [**Receipt**](../../../concept-receipt.md): extracts text and key information from receipts.
* [**ID document**](../../../concept-id-document.md): extracts text and key information from driver licenses and international passports.
* [**Business-card**](../../../concept-business-card.md): extracts text and key information from business cards.

### Add the following code to your prebuilt invoice application below the `key` variable

```python

def recognize_invoice():

    invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"

    form_recognizer_client = FormRecognizerClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = form_recognizer_client.begin_recognize_invoices_from_url(
        invoiceUrl, locale="en-US"
    )
    invoices = poller.result()

    for idx, invoice in enumerate(invoices):
        vendor_name = invoice.fields.get("VendorName")
        if vendor_name:
            print(
                "Vendor Name: {} has confidence: {}".format(
                    vendor_name.value, vendor_name.confidence
                )
            )
        vendor_address = invoice.fields.get("VendorAddress")
        if vendor_address:
            print(
                "Vendor Address: {} has confidence: {}".format(
                    vendor_address.value, vendor_address.confidence
                )
            )
        vendor_address_recipient = invoice.fields.get("VendorAddressRecipient")
        if vendor_address_recipient:
            print(
                "Vendor Address Recipient: {} has confidence: {}".format(
                    vendor_address_recipient.value, vendor_address_recipient.confidence
                )
            )
        customer_name = invoice.fields.get("CustomerName")
        if customer_name:
            print(
                "Customer Name: {} has confidence: {}".format(
                    customer_name.value, customer_name.confidence
                )
            )
        customer_id = invoice.fields.get("CustomerId")
        if customer_id:
            print(
                "Customer Id: {} has confidence: {}".format(
                    customer_id.value, customer_id.confidence
                )
            )
        customer_address = invoice.fields.get("CustomerAddress")
        if customer_address:
            print(
                "Customer Address: {} has confidence: {}".format(
                    customer_address.value, customer_address.confidence
                )
            )
        customer_address_recipient = invoice.fields.get("CustomerAddressRecipient")
        if customer_address_recipient:
            print(
                "Customer Address Recipient: {} has confidence: {}".format(
                    customer_address_recipient.value,
                    customer_address_recipient.confidence,
                )
            )
        invoice_id = invoice.fields.get("InvoiceId")
        if invoice_id:
            print(
                "Invoice Id: {} has confidence: {}".format(
                    invoice_id.value, invoice_id.confidence
                )
            )
        invoice_date = invoice.fields.get("InvoiceDate")
        if invoice_date:
            print(
                "Invoice Date: {} has confidence: {}".format(
                    invoice_date.value, invoice_date.confidence
                )
            )
        invoice_total = invoice.fields.get("InvoiceTotal")
        if invoice_total:
            print(
                "Invoice Total: {} has confidence: {}".format(
                    invoice_total.value, invoice_total.confidence
                )
            )
        due_date = invoice.fields.get("DueDate")
        if due_date:
            print(
                "Due Date: {} has confidence: {}".format(
                    due_date.value, due_date.confidence
                )
            )
        purchase_order = invoice.fields.get("PurchaseOrder")
        if purchase_order:
            print(
                "Purchase Order: {} has confidence: {}".format(
                    purchase_order.value, purchase_order.confidence
                )
            )
        billing_address = invoice.fields.get("BillingAddress")
        if billing_address:
            print(
                "Billing Address: {} has confidence: {}".format(
                    billing_address.value, billing_address.confidence
                )
            )
        billing_address_recipient = invoice.fields.get("BillingAddressRecipient")
        if billing_address_recipient:
            print(
                "Billing Address Recipient: {} has confidence: {}".format(
                    billing_address_recipient.value,
                    billing_address_recipient.confidence,
                )
            )
        shipping_address = invoice.fields.get("ShippingAddress")
        if shipping_address:
            print(
                "Shipping Address: {} has confidence: {}".format(
                    shipping_address.value, shipping_address.confidence
                )
            )
        shipping_address_recipient = invoice.fields.get("ShippingAddressRecipient")
        if shipping_address_recipient:
            print(
                "Shipping Address Recipient: {} has confidence: {}".format(
                    shipping_address_recipient.value,
                    shipping_address_recipient.confidence,
                )
            )
        print("Invoice items:")
        for idx, item in enumerate(invoice.fields.get("Items").value):
            item_description = item.value.get("Description")
            if item_description:
                print(
                    "......Description: {} has confidence: {}".format(
                        item_description.value, item_description.confidence
                    )
                )
            item_quantity = item.value.get("Quantity")
            if item_quantity:
                print(
                    "......Quantity: {} has confidence: {}".format(
                        item_quantity.value, item_quantity.confidence
                    )
                )
            unit = item.value.get("Unit")
            if unit:
                print(
                    "......Unit: {} has confidence: {}".format(
                        unit.value, unit.confidence
                    )
                )
            unit_price = item.value.get("UnitPrice")
            if unit_price:
                print(
                    "......Unit Price: {} has confidence: {}".format(
                        unit_price.value, unit_price.confidence
                    )
                )
            product_code = item.value.get("ProductCode")
            if product_code:
                print(
                    "......Product Code: {} has confidence: {}".format(
                        product_code.value, product_code.confidence
                    )
                )
            item_date = item.value.get("Date")
            if item_date:
                print(
                    "......Date: {} has confidence: {}".format(
                        item_date.value, item_date.confidence
                    )
                )
            tax = item.value.get("Tax")
            if tax:
                print(
                    "......Tax: {} has confidence: {}".format(tax.value, tax.confidence)
                )
            amount = item.value.get("Amount")
            if amount:
                print(
                    "......Amount: {} has confidence: {}".format(
                        amount.value, amount.confidence
                    )
                )
        subtotal = invoice.fields.get("SubTotal")
        if subtotal:
            print(
                "Subtotal: {} has confidence: {}".format(
                    subtotal.value, subtotal.confidence
                )
            )
        total_tax = invoice.fields.get("TotalTax")
        if total_tax:
            print(
                "Total Tax: {} has confidence: {}".format(
                    total_tax.value, total_tax.confidence
                )
            )
        previous_unpaid_balance = invoice.fields.get("PreviousUnpaidBalance")
        if previous_unpaid_balance:
            print(
                "Previous Unpaid Balance: {} has confidence: {}".format(
                    previous_unpaid_balance.value, previous_unpaid_balance.confidence
                )
            )
        amount_due = invoice.fields.get("AmountDue")
        if amount_due:
            print(
                "Amount Due: {} has confidence: {}".format(
                    amount_due.value, amount_due.confidence
                )
            )
        service_start_date = invoice.fields.get("ServiceStartDate")
        if service_start_date:
            print(
                "Service Start Date: {} has confidence: {}".format(
                    service_start_date.value, service_start_date.confidence
                )
            )
        service_end_date = invoice.fields.get("ServiceEndDate")
        if service_end_date:
            print(
                "Service End Date: {} has confidence: {}".format(
                    service_end_date.value, service_end_date.confidence
                )
            )
        service_address = invoice.fields.get("ServiceAddress")
        if service_address:
            print(
                "Service Address: {} has confidence: {}".format(
                    service_address.value, service_address.confidence
                )
            )
        service_address_recipient = invoice.fields.get("ServiceAddressRecipient")
        if service_address_recipient:
            print(
                "Service Address Recipient: {} has confidence: {}".format(
                    service_address_recipient.value,
                    service_address_recipient.confidence,
                )
            )
        remittance_address = invoice.fields.get("RemittanceAddress")
        if remittance_address:
            print(
                "Remittance Address: {} has confidence: {}".format(
                    remittance_address.value, remittance_address.confidence
                )
            )
        remittance_address_recipient = invoice.fields.get("RemittanceAddressRecipient")
        if remittance_address_recipient:
            print(
                "Remittance Address Recipient: {} has confidence: {}".format(
                    remittance_address_recipient.value,
                    remittance_address_recipient.confidence,
                )
            )


if __name__ == "__main__":
    recognize_invoice()

```

## Run your application

1. Navigate to the folder where you have your **form_recognizer_quickstart.py** file.

1. Type the following command in your terminal:

```console
python form_recognizer_quickstart.py
```
