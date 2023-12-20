---
title: "Quickstart: Document Intelligence (formerly Form Recognizer) Python SDK (beta) | v3.1 | v3.0"
titleSuffix: Azure AI services
description: Form and document processing, data extraction, and analysis using Document Intelligence Python client library SDKs v3.1 or v3.0
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 12/18/2023
ms.author: lajanuar
---
<!-- markdownlint-disable MD025 -->

:::moniker range="doc-intel-4.0.0"
    [**Form Recognizer → to → Document Intelligence migration guide**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/documentintelligence/azure-ai-documentintelligence/MIGRATION_GUIDE.md)
    [Client library](/python/api/overview/azure/ai-documentintelligence-readme?view=azure-python-preview&preserve-view=true) |[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-documentintelligence/latest/index.html) | [REST API reference](https://westus.dev.cognitive.microsoft.com/docs/services/document-intelligence-api-2023-10-31-preview/operations/AnalyzeDocument) | [Package (PyPi)](https://pypi.org/project/azure-ai-documentintelligence/1.0.0b1/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/documentintelligence/azure-ai-documentintelligence/samples) | [Supported REST API versions](../../sdk-overview-v4-0.md#supported-programming-languages)
:::moniker-end

:::moniker range="doc-intel-3.1.0"
    [Client library](/python/api/overview/azure/ai-formrecognizer-readme?view=azure-python&preserve-view=true) |[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/3.3.0/index.html) | [REST API reference](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/3.3.0/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-formrecognizer_3.3.0/sdk/formrecognizer/azure-ai-formrecognizer/samples) | [Supported REST API versions](../../sdk-overview-v3-1.md#supported-programming-languages)
:::moniker-end

:::moniker range="doc-intel-3.0.0"
    [Client library](/python/api/overview/azure/ai-formrecognizer-readme?view=azure-python-previous&preserve-view=true) | [SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/3.2.0b6/index.html) | [REST API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b6/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-formrecognizer_3.2.0b6/sdk/formrecognizer/azure-ai-formrecognizer/samples) | [Supported REST API versions](../../sdk-overview-v3-0.md#supported-programming-languages)
:::moniker-end

In this quickstart you'll, use the following features to analyze and extract data and values from forms and documents:

* [**Layout**](#layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes, and key-value pairs, without the need to train a model.

* [**Prebuilt Invoice**](#prebuilt-model)—Analyze and extract common fields from specific document types using a pretrained model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [Python 3.7 or later](https://www.python.org/)

  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Getting Started with Python in Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial).

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Microsoft Entra authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Set up

Open a terminal window in your local environment and install the Azure AI Document Intelligence client library for Python with pip:

:::moniker range="doc-intel-4.0.0"

```console
pip install azure-ai-documentintelligence==1.0.0b1

```

:::moniker-end

:::moniker range="doc-intel-3.1.0"

```console
pip install azure-ai-formrecognizer==3.3.0
```

:::moniker-end

:::moniker range="doc-intel-3.0.0"

```console

pip install azure-ai-formrecognizer==3.2.0b6

```

:::moniker-end

## Create your Python application

To interact with the Document Intelligence service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Document Intelligence `endpoint`.

1. Create a new Python file called **doc_intel_quickstart.py** in your preferred editor or IDE.

1. Open the **doc_intel_quickstart.py** file and select one of the following code samples to copy and paste into your application:

    * [**Layout**](#layout-model)

    * [**Prebuilt Invoice**](#prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../ai-services/security-features.md).

<!-- markdownlint-disable MD036 -->

## Layout model

Extract text, selection marks, text styles, table structures, and bounding region coordinates from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **document file from a URL**. You can use our [sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * We've added the file URL value to the `formUrl` variable in the `analyze_layout` function.
> * To analyze a given file at a URL, you'll use the `begin_analyze_document_from_url` method and pass in `prebuilt-layout` as the model Id. The returned value is a `result` object containing data about the submitted document.

**Add the following code sample to your doc_intel_quickstart.py application. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

:::moniker range="doc-intel-4.0.0"

```python

# import libraries
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"


def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_intelligence_client.begin_analyze_document_from_url(
        "prebuilt-layout", formUrl
    )
    result = poller.result()

    if any([style.is_handwritten for style in result.styles]):
        print("Document contains handwritten content")
    else:
        print("Document does not contain handwritten content")

    for page in result.pages:
        print(f"----Analyzing layout from page #{page.page_number}----")
        print(
            f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}"
        )

        for line_idx, line in enumerate(page.lines):
            words = get_words(page, line)
            print(
                f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
                f"within bounding polygon '{line.polygon}'"
            )

            for word in words:
                print(
                    f"......Word '{word.content}' has a confidence of {word.confidence}"
                )

        for selection_mark in page.selection_marks:
            print(
                f"Selection mark is '{selection_mark.state}' within bounding polygon "
                f"'{selection_mark.polygon}' and has a confidence of {selection_mark.confidence}"
            )

    for table_idx, table in enumerate(result.tables):
        print(
            f"Table # {table_idx} has {table.row_count} rows and "
            f"{table.column_count} columns"
        )
        for region in table.bounding_regions:
            print(
                f"Table # {table_idx} location on page: {region.page_number} is {region.polygon}"
            )
        for cell in table.cells:
            print(
                f"...Cell[{cell.row_index}][{cell.column_index}] has text '{cell.content}'"
            )
            for region in cell.bounding_regions:
                print(
                    f"...content on page {region.page_number} is within bounding polygon '{region.polygon}'"
                )

    print("----------------------------------------")


if __name__ == "__main__":
    analyze_layout()


```

**Run the application**

Once you've added a code sample to your application, build and run your program:

1. Navigate to the folder where you have your **doc_intel_quickstart.py** file.
1. Type the following command in your terminal:

    ```console
    python doc_intel_quickstart.py
    ```

:::moniker-end

:::moniker range="doc-intel-3.1.0"

```python

# import libraries
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"

def format_polygon(polygon):
    if not polygon:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in polygon])

def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
            "prebuilt-layout", formUrl)
    result = poller.result()

    for idx, style in enumerate(result.styles):
        print(
            "Document contains {} content".format(
                "handwritten" if style.is_handwritten else "no handwritten"
            )
        )

    for page in result.pages:
        print("----Analyzing layout from page #{}----".format(page.page_number))
        print(
            "Page has width: {} and height: {}, measured with unit: {}".format(
                page.width, page.height, page.unit
            )
        )

        for line_idx, line in enumerate(page.lines):
            words = line.get_words()
            print(
                "...Line # {} has word count {} and text '{}' within bounding box '{}'".format(
                    line_idx,
                    len(words),
                    line.content,
                    format_polygon(line.polygon),
                )
            )

            for word in words:
                print(
                    "......Word '{}' has a confidence of {}".format(
                        word.content, word.confidence
                    )
                )

        for selection_mark in page.selection_marks:
            print(
                "...Selection mark is '{}' within bounding box '{}' and has a confidence of {}".format(
                    selection_mark.state,
                    format_polygon(selection_mark.polygon),
                    selection_mark.confidence,
                )
            )

    for table_idx, table in enumerate(result.tables):
        print(
            "Table # {} has {} rows and {} columns".format(
                table_idx, table.row_count, table.column_count
            )
        )
        for region in table.bounding_regions:
            print(
                "Table # {} location on page: {} is {}".format(
                    table_idx,
                    region.page_number,
                    format_polygon(region.polygon),
                )
            )
        for cell in table.cells:
            print(
                "...Cell[{}][{}] has content '{}'".format(
                    cell.row_index,
                    cell.column_index,
                    cell.content,
                )
            )
            for region in cell.bounding_regions:
                print(
                    "...content on page {} is within bounding box '{}'".format(
                        region.page_number,
                        format_polygon(region.polygon),
                    )
                )

    print("----------------------------------------")


if __name__ == "__main__":
    analyze_layout()

```

**Run the application**

Once you've added a code sample to your application, build and run your program:

1. Navigate to the folder where you have your **doc_intel_quickstart.py** file.
1. Type the following command in your terminal:

    ```console
    python doc_intel_quickstart.py
    ```

### Layout model output

Here's a snippet of the expected output:

```console
  ----Analyzing layout from page #1----
  Page has width: 8.5 and height: 11.0, measured with unit: inch
  ...Line # 0 has word count 2 and text 'UNITED STATES' within bounding box '[3.4915, 0.6828], [5.0116, 0.6828], [5.0116, 0.8265], [3.4915, 0.8265]'
  ......Word 'UNITED' has a confidence of 1.0
  ......Word 'STATES' has a confidence of 1.0
  ...Line # 1 has word count 4 and text 'SECURITIES AND EXCHANGE COMMISSION' within bounding box '[2.1937, 0.9061], [6.297, 0.9061], [6.297, 1.0498], [2.1937, 1.0498]'
  ......Word 'SECURITIES' has a confidence of 1.0
  ......Word 'AND' has a confidence of 1.0
  ......Word 'EXCHANGE' has a confidence of 1.0
  ......Word 'COMMISSION' has a confidence of 1.0
  ...Line # 2 has word count 3 and text 'Washington, D.C. 20549' within bounding box '[3.4629, 1.1179], [5.031, 1.1179], [5.031, 1.2483], [3.4629, 1.2483]'
  ......Word 'Washington,' has a confidence of 1.0
  ......Word 'D.C.' has a confidence of 1.0
```

To view the entire output, visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/v3-python-sdk-layout-output.md)

::: moniker-end

:::moniker range="doc-intel-3.0.0"

```python

# import libraries
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"


def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
        "prebuilt-layout", formUrl
    )
    result = poller.result()

    for idx, style in enumerate(result.styles):
        print(
            "Document contains {} content".format(
                "handwritten" if style.is_handwritten else "no handwritten"
            )
        )

    for page in result.pages:
        print("----Analyzing layout from page #{}----".format(page.page_number))
        print(
            "Page has width: {} and height: {}, measured with unit: {}".format(
                page.width, page.height, page.unit
            )
        )

        for line_idx, line in enumerate(page.lines):
            words = line.get_words()
            print(
                "...Line # {} has word count {} and text '{}' within bounding polygon '{}'".format(
                    line_idx,
                    len(words),
                    line.content,
                    format_polygon(line.polygon),
                )
            )

            for word in words:
                print(
                    "......Word '{}' has a confidence of {}".format(
                        word.content, word.confidence
                    )
                )

        for selection_mark in page.selection_marks:
            print(
                "...Selection mark is '{}' within bounding polygon '{}' and has a confidence of {}".format(
                    selection_mark.state,
                    format_polygon(selection_mark.polygon),
                    selection_mark.confidence,
                )
            )

    for table_idx, table in enumerate(result.tables):
        print(
            "Table # {} has {} rows and {} columns".format(
                table_idx, table.row_count, table.column_count
            )
        )
        for region in table.bounding_regions:
            print(
                "Table # {} location on page: {} is {}".format(
                    table_idx,
                    region.page_number,
                    format_polygon(region.polygon),
                )
            )
        for cell in table.cells:
            print(
                "...Cell[{}][{}] has content '{}'".format(
                    cell.row_index,
                    cell.column_index,
                    cell.content,
                )
            )
            for region in cell.bounding_regions:
                print(
                    "...content on page {} is within bounding polygon '{}'".format(
                        region.page_number,
                        format_polygon(region.polygon),
                    )
                )

    print("----------------------------------------")


if __name__ == "__main__":
    analyze_layout()


```

**Run the application**

Once you've added a code sample to your application, build and run your program:

1. Navigate to the folder where you have your **doc_intel_quickstart.py** file.
1. Type the following command in your terminal:

    ```console
    python doc_intel_quickstart.py
    ```

:::moniker-end

___

## Prebuilt model

Analyze and extract common fields from specific document types using a prebuilt model. In this example, we analyze an invoice using the **prebuilt-invoice** model.

> [!TIP]
> You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. See [**model data extraction**](../../concept-model-overview.md#model-data-extraction).

> [!div class="checklist"]
>
> * Analyze an invoice using the prebuilt-invoice model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URL value to the `invoiceUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the `begin_analyze_document_from_url` method and pass `prebuilt-invoice` as the model Id. The returned value is a `result` object containing data about the submitted document.
> * For simplicity, all the key-value pairs that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../../concept-invoice.md#field-extraction) concept page.

**Add the following code sample to your doc_intel_quickstart.py application. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

:::moniker range="doc-intel-4.0.0"

```python

# import libraries
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"

from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient


def analyze_invoice():
    # sample document

    invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"

    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_intelligence_client.begin_analyze_document_from_url(
        "prebuilt-invoice", invoiceUrl
    )
    invoices = poller.result()

    for idx, invoice in enumerate(invoices.documents):
        print(f"--------Analyzing invoice #{idx + 1}--------")
        vendor_name = invoice.fields.get("VendorName")
        if vendor_name:
            print(
                f"Vendor Name: {vendor_name.get('content')} has confidence: {vendor_name.get('confidence')}"
            )
        vendor_address = invoice.fields.get("VendorAddress")
        if vendor_address:
            print(
                f"Vendor Address: {vendor_address.get('content')} has confidence: {vendor_address.get('confidence')}"
            )
        vendor_address_recipient = invoice.fields.get("VendorAddressRecipient")
        if vendor_address_recipient:
            print(
                f"Vendor Address Recipient: {vendor_address_recipient.get('content')} has confidence: {vendor_address_recipient.get('confidence')}"
            )
        customer_name = invoice.fields.get("CustomerName")
        if customer_name:
            print(
                f"Customer Name: {customer_name.get('content')} has confidence: {customer_name.get('confidence')}"
            )
        customer_id = invoice.fields.get("CustomerId")
        if customer_id:
            print(
                f"Customer Id: {customer_id.get('content')} has confidence: {customer_id.get('confidence')}"
            )
        customer_address = invoice.fields.get("CustomerAddress")
        if customer_address:
            print(
                f"Customer Address: {customer_address.get('content')} has confidence: {customer_address.get('confidence')}"
            )
        customer_address_recipient = invoice.fields.get("CustomerAddressRecipient")
        if customer_address_recipient:
            print(
                f"Customer Address Recipient: {customer_address_recipient.get('content')} has confidence: {customer_address_recipient.get('confidence')}"
            )
        invoice_id = invoice.fields.get("InvoiceId")
        if invoice_id:
            print(
                f"Invoice Id: {invoice_id.get('content')} has confidence: {invoice_id.get('confidence')}"
            )
        invoice_date = invoice.fields.get("InvoiceDate")
        if invoice_date:
            print(
                f"Invoice Date: {invoice_date.get('content')} has confidence: {invoice_date.get('confidence')}"
            )
        invoice_total = invoice.fields.get("InvoiceTotal")
        if invoice_total:
            print(
                f"Invoice Total: {invoice_total.get('content')} has confidence: {invoice_total.get('confidence')}"
            )
        due_date = invoice.fields.get("DueDate")
        if due_date:
            print(
                f"Due Date: {due_date.get('content')} has confidence: {due_date.get('confidence')}"
            )
        purchase_order = invoice.fields.get("PurchaseOrder")
        if purchase_order:
            print(
                f"Purchase Order: {purchase_order.get('content')} has confidence: {purchase_order.get('confidence')}"
            )
        billing_address = invoice.fields.get("BillingAddress")
        if billing_address:
            print(
                f"Billing Address: {billing_address.get('content')} has confidence: {billing_address.get('confidence')}"
            )
        billing_address_recipient = invoice.fields.get("BillingAddressRecipient")
        if billing_address_recipient:
            print(
                f"Billing Address Recipient: {billing_address_recipient.get('content')} has confidence: {billing_address_recipient.get('confidence')}"
            )
        shipping_address = invoice.fields.get("ShippingAddress")
        if shipping_address:
            print(
                f"Shipping Address: {shipping_address.get('content')} has confidence: {shipping_address.get('confidence')}"
            )
        shipping_address_recipient = invoice.fields.get("ShippingAddressRecipient")
        if shipping_address_recipient:
            print(
                f"Shipping Address Recipient: {shipping_address_recipient.get('content')} has confidence: {shipping_address_recipient.get('confidence')}"
            )
        print("Invoice items:")
        for idx, item in enumerate(invoice.fields.get("Items").get("valueArray")):
            print(f"...Item #{idx + 1}")
            item_description = item.get("valueObject").get("Description")
            if item_description:
                print(
                    f"......Description: {item_description.get('content')} has confidence: {item_description.get('confidence')}"
                )
            item_quantity = item.get("valueObject").get("Quantity")
            if item_quantity:
                print(
                    f"......Quantity: {item_quantity.get('content')} has confidence: {item_quantity.get('confidence')}"
                )
            unit = item.get("valueObject").get("Unit")
            if unit:
                print(
                    f"......Unit: {unit.get('content')} has confidence: {unit.get('confidence')}"
                )
            unit_price = item.get("valueObject").get("UnitPrice")
            if unit_price:
                unit_price_code = (
                    unit_price.get("valueCurrency").get("currencyCode")
                    if unit_price.get("valueCurrency").get("currencyCode")
                    else ""
                )
                print(
                    f"......Unit Price: {unit_price.get('content')}{unit_price_code} has confidence: {unit_price.get('confidence')}"
                )
            product_code = item.get("valueObject").get("ProductCode")
            if product_code:
                print(
                    f"......Product Code: {product_code.get('content')} has confidence: {product_code.get('confidence')}"
                )
            item_date = item.get("valueObject").get("Date")
            if item_date:
                print(
                    f"......Date: {item_date.get('content')} has confidence: {item_date.get('confidence')}"
                )
            tax = item.get("valueObject").get("Tax")
            if tax:
                print(
                    f"......Tax: {tax.get('content')} has confidence: {tax.get('confidence')}"
                )
            amount = item.get("valueObject").get("Amount")
            if amount:
                print(
                    f"......Amount: {amount.get('content')} has confidence: {amount.get('confidence')}"
                )
        subtotal = invoice.fields.get("SubTotal")
        if subtotal:
            print(
                f"Subtotal: {subtotal.get('content')} has confidence: {subtotal.get('confidence')}"
            )
        total_tax = invoice.fields.get("TotalTax")
        if total_tax:
            print(
                f"Total Tax: {total_tax.get('content')} has confidence: {total_tax.get('confidence')}"
            )
        previous_unpaid_balance = invoice.fields.get("PreviousUnpaidBalance")
        if previous_unpaid_balance:
            print(
                f"Previous Unpaid Balance: {previous_unpaid_balance.get('content')} has confidence: {previous_unpaid_balance.get('confidence')}"
            )
        amount_due = invoice.fields.get("AmountDue")
        if amount_due:
            print(
                f"Amount Due: {amount_due.get('content')} has confidence: {amount_due.get('confidence')}"
            )
        service_start_date = invoice.fields.get("ServiceStartDate")
        if service_start_date:
            print(
                f"Service Start Date: {service_start_date.get('content')} has confidence: {service_start_date.get('confidence')}"
            )
        service_end_date = invoice.fields.get("ServiceEndDate")
        if service_end_date:
            print(
                f"Service End Date: {service_end_date.get('content')} has confidence: {service_end_date.get('confidence')}"
            )
        service_address = invoice.fields.get("ServiceAddress")
        if service_address:
            print(
                f"Service Address: {service_address.get('content')} has confidence: {service_address.get('confidence')}"
            )
        service_address_recipient = invoice.fields.get("ServiceAddressRecipient")
        if service_address_recipient:
            print(
                f"Service Address Recipient: {service_address_recipient.get('content')} has confidence: {service_address_recipient.get('confidence')}"
            )
        remittance_address = invoice.fields.get("RemittanceAddress")
        if remittance_address:
            print(
                f"Remittance Address: {remittance_address.get('content')} has confidence: {remittance_address.get('confidence')}"
            )
        remittance_address_recipient = invoice.fields.get("RemittanceAddressRecipient")
        if remittance_address_recipient:
            print(
                f"Remittance Address Recipient: {remittance_address_recipient.get('content')} has confidence: {remittance_address_recipient.get('confidence')}"
            )

        print("----------------------------------------")


if __name__ == "__main__":
    analyze_invoice()


```

**Run the application**

Once you've added a code sample to your application, build and run your program:

1. Navigate to the folder where you have your **doc_intel_quickstart.py** file.
1. Type the following command in your terminal:

    ```console
    python doc_intel_quickstart.py
    ```

:::moniker-end

:::moniker range="doc-intel-3.1.0"

```python
# import libraries
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"


def format_bounding_region(bounding_regions):
    if not bounding_regions:
        return "N/A"
    return ", ".join(
        "Page #{}: {}".format(region.page_number, format_polygon(region.polygon))
        for region in bounding_regions
    )


def format_polygon(polygon):
    if not polygon:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in polygon])


def analyze_invoice():

    invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
        "prebuilt-invoice", invoiceUrl
    )
    invoices = poller.result()

    for idx, invoice in enumerate(invoices.documents):
        print("--------Recognizing invoice #{}--------".format(idx + 1))
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
            print("...Item #{}".format(idx + 1))
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

        print("----------------------------------------")

if __name__ == "__main__":
    analyze_invoice()


```

**Run the application**

Once you've added a code sample to your application, build and run your program:

1. Navigate to the folder where you have your **doc_intel_quickstart.py** file.
1. Type the following command in your terminal:

    ```console
    python doc_intel_quickstart.py
    ```

### Prebuilt model output

Here's a snippet of the expected output:

```console
  --------Recognizing invoice #1--------
  Vendor Name: CONTOSO LTD. has confidence: 0.919
  Vendor Address: 123 456th St New York, NY, 10001 has confidence: 0.907
  Vendor Address Recipient: Contoso Headquarters has confidence: 0.919
  Customer Name: MICROSOFT CORPORATION has confidence: 0.84
  Customer Id: CID-12345 has confidence: 0.956
  Customer Address: 123 Other St, Redmond WA, 98052 has confidence: 0.909
  Customer Address Recipient: Microsoft Corp has confidence: 0.917
  Invoice Id: INV-100 has confidence: 0.972
  Invoice Date: 2019-11-15 has confidence: 0.971
  Invoice Total: CurrencyValue(amount=110.0, symbol=$) has confidence: 0.97
  Due Date: 2019-12-15 has confidence: 0.973
```

To view the entire output, visit the Azure samples repository on GitHub to view the [prebuilt invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/v3-python-sdk-prebuilt-invoice-output.md)

:::moniker-end

:::moniker range="doc-intel-3.0.0"

```python

# import libraries
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"


def format_polygon(polygon):
    if not polygon:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in polygon])


def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
        "prebuilt-layout", formUrl
    )
    result = poller.result()

    for idx, style in enumerate(result.styles):
        print(
            "Document contains {} content".format(
                "handwritten" if style.is_handwritten else "no handwritten"
            )
        )


for page in result.pages:
    print("----Analyzing layout from page #{}----".format(page.page_number))
    print(
        "Page has width: {} and height: {}, measured with unit: {}".format(
            page.width, page.height, page.unit
        )
    )

    for line_idx, line in enumerate(page.lines):
        words = line.get_words()
        print(
            "...Line # {} has word count {} and text '{}' within bounding polygon '{}'".format(
                line_idx,
                len(words),
                line.content,
                format_polygon(line.polygon),
            )
        )

        for word in words:
            print(
                "......Word '{}' has a confidence of {}".format(
                    word.content, word.confidence
                )
            )

    for selection_mark in page.selection_marks:
        print(
            "...Selection mark is '{}' within bounding polygon '{}' and has a confidence of {}".format(
                selection_mark.state,
                format_polygon(selection_mark.polygon),
                selection_mark.confidence,
            )
        )

for table_idx, table in enumerate(result.tables):
    print(
        "Table # {} has {} rows and {} columns".format(
            table_idx, table.row_count, table.column_count
        )
    )
    for region in table.bounding_regions:
        print(
            "Table # {} location on page: {} is {}".format(
                table_idx,
                region.page_number,
                format_polygon(region.polygon),
            )
        )
    for cell in table.cells:
        print(
            "...Cell[{}][{}] has content '{}'".format(
                cell.row_index,
                cell.column_index,
                cell.content,
            )
        )
        for region in cell.bounding_regions:
            print(
                "...content on page {} is within bounding polygon '{}'".format(
                    region.page_number,
                    format_polygon(region.polygon),
                )
            )

print("----------------------------------------")


if __name__ == "__main__":
    analyze_layout()


```

**Run the application**

Once you've added a code sample to your application, build and run your program:

1. Navigate to the folder where you have your **doc_intel_quickstart.py** file.
1. Type the following command in your terminal:

    ```console
    python doc_intel_quickstart.py
    ```

:::moniker-end
