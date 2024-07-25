---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for Python (REST API v3.0)"
description: 'Use the Document Intelligence SDK for Python (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 05/23/2024
ms.author: lajanuar
ms.custom: devx-track-csharp, ignite-2023, linux-related-content
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

[Client library](/python/api/overview/azure/ai-documentintelligence-readme?view=azure-python-preview&preserve-view=true) |[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-documentintelligence/latest/index.html) | [REST API reference](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2024-02-29-preview&preserve-view=true&tabs=HTTP) | [Package (PyPi)](https://pypi.org/project/azure-ai-documentintelligence/1.0.0b2/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/documentintelligence/azure-ai-documentintelligence/samples) | [Supported REST API version](../../../sdk-overview-v4-0.md#supported-programming-languages)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- [Python 3.7 or later](https://www.python.org/). Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check whether you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
- The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. See [Getting Started with Python in Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial).
- An Azure AI services or Document Intelligence resource. Create a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a Document Intelligence resource." target="_blank">single-service</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAIServices" title="Create a multiple Document Intelligence resource." target="_blank">multi-service</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure Document Intelligence service.

  1. After your resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in this article.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

- A document file at a URL. For this project, you can use the sample forms provided in the following table for each feature:

  | Feature   | modelID   | document-url |
  | --- | --- |--|
  | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
  | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
  | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
  | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
  | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
  | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |

[!INCLUDE [environment-variables](../set-environment-variables.md)]

## Set up your programming environment

Open a console window in your local environment and install the Azure AI Document Intelligence client library for Python with pip:

```console
pip install azure-ai-documentintelligence==1.0.0b2
```

## Create your Python application

To interact with the Document Intelligence service, you need to create an instance of the `DocumentIntelligenceClient` class. To do so, you create an `AzureKeyCredential` with your key from the Azure portal and a `DocumentIntelligenceClient` instance with the `AzureKeyCredential` and your Document Intelligence endpoint.

1. Create a new Python file called *form_recognizer_quickstart.py* in an editor or IDE.

1. Open the *form_recognizer_quickstart.py* file and select one of the following code samples and copy/paste into your application:

   - The [prebuilt-read](#use-the-read-model) model is at the core of all Document Intelligence models and can detect lines, words, locations, and languages. The layout, general document, prebuilt, and custom models all use the `read` model as a foundation for extracting texts from documents.
   - The [prebuilt-layout](#use-the-layout-model) model extracts text and text locations, tables, selection marks, and structure information from documents and images.
   - The [prebuilt-tax.us.w2](#use-the-w-2-tax-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.
   - The [prebuilt-invoice](#use-the-invoice-model) model extracts key fields and line items from sales invoices in various formats.
   - The [prebuilt-receipt](#use-the-receipt-model) model extracts key information from printed and handwritten sales receipts.
   - The [prebuilt-idDocument](#use-the-id-document-model) model extracts key information from US Drivers Licenses; international passport biographical pages; US state IDs; social security cards; and permanent resident cards.

1. Run the Python code from the command prompt.

   ```python
   python form_recognizer_quickstart.py
   ```

## Use the Read model

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult

# use your `key` and `endpoint` environment variables
key = os.environ.get('DI_KEY')
endpoint = os.environ.get('DI_ENDPOINT')

# helper functions
def get_words(page, line):
    result = []
    for word in page.words:
        if _in_span(word, line.spans):
            result.append(word)
    return result


def _in_span(word, spans):
    for span in spans:
        if word.span.offset >= span.offset and (word.span.offset + word.span.length) <= (span.offset + span.length):
            return True
    return False


def analyze_read():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png"

    client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = client.begin_analyze_document(
        "prebuilt-read", AnalyzeDocumentRequest(url_source=formUrl
    ))
    result: AnalyzeResult = poller.result()

    print("----Languages detected in the document----")
    if result.languages is not None:
        for language in result.languages:
            print(f"Language code: '{language.locale}' with confidence {language.confidence}")

    print("----Styles detected in the document----")
    if result.styles:
        for style in result.styles:
            if style.is_handwritten:
                print("Found the following handwritten content: ")
                print(",".join([result.content[span.offset : span.offset + span.length] for span in style.spans]))
            if style.font_style:
                print(f"The document contains '{style.font_style}' font style, applied to the following text: ")
                print(",".join([result.content[span.offset : span.offset + span.length] for span in style.spans]))

    for page in result.pages:
        print(f"----Analyzing document from page #{page.page_number}----")
        print(f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}")

        if page.lines:
            for line_idx, line in enumerate(page.lines):
                words = get_words(page, line)
                print(
                    f"...Line # {line_idx} has {len(words)} words and text '{line.content}' within bounding polygon '{line.polygon}'"
                )

                for word in words:
                    print(f"......Word '{word.content}' has a confidence of {word.confidence}")

        if page.selection_marks:
            for selection_mark in page.selection_marks:
                print(
                    f"...Selection mark is '{selection_mark.state}' within bounding polygon "
                    f"'{selection_mark.polygon}' and has a confidence of {selection_mark.confidence}"
                )

    if result.paragraphs:
        print(f"----Detected #{len(result.paragraphs)} paragraphs in the document----")
        for paragraph in result.paragraphs:
            print(f"Found paragraph with role: '{paragraph.role}' within {paragraph.bounding_regions} bounding region")
            print(f"...with content: '{paragraph.content}'")

        result.paragraphs.sort(key=lambda p: (p.spans.sort(key=lambda s: s.offset), p.spans[0].offset))
        print("-----Print sorted paragraphs-----")
        for idx, paragraph in enumerate(result.paragraphs):
            print(
                f"...paragraph:{idx} with offset: {paragraph.spans[0].offset} and length: {paragraph.spans[0].length}"
            )

    print("----------------------------------------")


if __name__ == "__main__":
    analyze_read()

```

> [!div class="nextstepaction"]
> [View complete code on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Read_model/sample_analyze_read.py)  [More samples](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Read_model) 

Visit the Azure samples repository on GitHub and view the [`read` model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/read-model-output.md).

## Use the Layout model

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult


# use your `key` and `endpoint` environment variables
key = os.environ.get('DI_KEY')
endpoint = os.environ.get('DI_ENDPOINT')


def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png"

    client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = client.begin_analyze_document(
        "prebuilt-layout", AnalyzeDocumentRequest(url_source=formUrl
    ))
    result: AnalyzeResult = poller.result()

    if result.styles and any([style.is_handwritten for style in result.styles]):
        print("Document contains handwritten content")
    else:
        print("Document does not contain handwritten content")

    for page in result.pages:
        print(f"----Analyzing layout from page #{page.page_number}----")
        print(f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}")

        if page.lines:
            for line_idx, line in enumerate(page.lines):
                words = get_words(page, line)
                print(
                    f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
                    f"within bounding polygon '{line.polygon}'"
                )

                for word in words:
                    print(f"......Word '{word.content}' has a confidence of {word.confidence}")

        if page.selection_marks:
            for selection_mark in page.selection_marks:
                print(
                    f"Selection mark is '{selection_mark.state}' within bounding polygon "
                    f"'{selection_mark.polygon}' and has a confidence of {selection_mark.confidence}"
                )

    if result.tables:
        for table_idx, table in enumerate(result.tables):
            print(f"Table # {table_idx} has {table.row_count} rows and " f"{table.column_count} columns")
            if table.bounding_regions:
                for region in table.bounding_regions:
                    print(f"Table # {table_idx} location on page: {region.page_number} is {region.polygon}")
            for cell in table.cells:
                print(f"...Cell[{cell.row_index}][{cell.column_index}] has text '{cell.content}'")
                if cell.bounding_regions:
                    for region in cell.bounding_regions:
                        print(f"...content on page {region.page_number} is within bounding polygon '{region.polygon}'")

    print("----------------------------------------")



if __name__ == "__main__":
    analyze_layout()

```

> [!div class="nextstepaction"]
> [View complete code on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model/sample_analyze_layout.py) [More samples](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Layout_model)

Visit the Azure samples repository on GitHub and view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/layout-model-output.md).

## Use the W-2 tax model

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult

# use your `key` and `endpoint` environment variables
key = os.environ.get('DI_KEY')
endpoint = os.environ.get('DI_ENDPOINT')

# formatting function
def format_address_value(address_value):
    return f"\n......House/building number: {address_value.house_number}\n......Road: {address_value.road}\n......City: {address_value.city}\n......State: {address_value.state}\n......Postal code: {address_value.postal_code}"


def analyze_tax_us_w2():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png"

    client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = client.begin_analyze_document(
        "prebuilt-tax.us.w2",  AnalyzeDocumentRequest(url_source=formUrl
    ))

    w2s: AnalyzeResult =  poller.result()

        if w2s.documents:
        for idx, w2 in enumerate(w2s.documents):
            print(f"--------Analyzing US Tax W-2 Form #{idx + 1}--------")
            if w2.fields:
                form_variant = w2.fields.get("W2FormVariant")
                if form_variant:
                    print(
                        f"Form variant: {form_variant.get('valueString')} has confidence: " f"{form_variant.confidence}"
                    )
                tax_year = w2.fields.get("TaxYear")
                if tax_year:
                    print(f"Tax year: {tax_year.get('valueString')} has confidence: {tax_year.confidence}")
                w2_copy = w2.fields.get("W2Copy")
                if w2_copy:
                    print(f"W-2 Copy: {w2_copy.get('valueString')} has confidence: {w2_copy.confidence}")
                employee = w2.fields.get("Employee")
                if employee:
                    print("Employee data:")
                    employee_name = employee.get("valueObject").get("Name")
                    if employee_name:
                        f"confidence: {fed_income_tax_withheld.confidence}"
                    )
                social_security_wages = w2.fields.get("SocialSecurityWages")
                if social_security_wages:
                    print(
                        f"Social Security wages: {social_security_wages.get('valueNumber')} has confidence: "
                        f"{social_security_wages.confidence}"
                    )
                social_security_tax_withheld = w2.fields.get("SocialSecurityTaxWithheld")
                if social_security_tax_withheld:
                    print(
                        f"Social Security tax withheld: {social_security_tax_withheld.get('valueNumber')} "
                        f"has confidence: {social_security_tax_withheld.confidence}"
                    )
                medicare_wages_tips = w2.fields.get("MedicareWagesAndTips")
                if medicare_wages_tips:
                    print(
                        f"Medicare wages and tips: {medicare_wages_tips.get('valueNumber')} has confidence: "
                        f"{medicare_wages_tips.confidence}"
                    )
                medicare_tax_withheld = w2.fields.get("MedicareTaxWithheld")
                if medicare_tax_withheld:
                    print(
                        f"Medicare tax withheld: {medicare_tax_withheld.get('valueNumber')} has confidence: "
                        f"{medicare_tax_withheld.confidence}"
                    )
                social_security_tips = w2.fields.get("SocialSecurityTips")
                if social_security_tips:
                    print(
                        f"Social Security tips: {social_security_tips.get('valueNumber')} has confidence: "
                        f"{social_security_tips.confidence}"
                    )
                allocated_tips = w2.fields.get("AllocatedTips")
                if allocated_tips:
                    print(
                        f"Allocated tips: {allocated_tips.get('valueNumber')} has confidence: {allocated_tips.confidence}"
                    )
                verification_code = w2.fields.get("VerificationCode")
                if verification_code:
                    print(
                        f"Verification code: {verification_code.get('valueNumber')} has confidence: {verification_code.confidence}"
                    )
                dependent_care_benefits = w2.fields.get("DependentCareBenefits")
                if dependent_care_benefits:
                    print(
                        f"Dependent care benefits: {dependent_care_benefits.get('valueNumber')} has confidence: {dependent_care_benefits.confidence}"
                    )
                non_qualified_plans = w2.fields.get("NonQualifiedPlans")
                if non_qualified_plans:
                    print(
                        f"Non-qualified plans: {non_qualified_plans.get('valueNumber')} has confidence: {non_qualified_plans.confidence}"
                    )
                additional_info = w2.fields.get("AdditionalInfo")
                if additional_info:
                    print("Additional information:")
                    for item in additional_info.get("valueArray"):
                        letter_code = item.get("valueObject").get("LetterCode")
                        if letter_code:
                            print(
                                f"...Letter code: {letter_code.get('valueString')} has confidence: {letter_code.confidence}"
                            )
                        amount = item.get("valueObject").get("Amount")
                        if amount:
                            print(f"...Amount: {amount.get('valueNumber')} has confidence: {amount.confidence}")
                is_statutory_employee = w2.fields.get("IsStatutoryEmployee")
                if is_statutory_employee:
                    print(
                        f"Is statutory employee: {is_statutory_employee.get('valueString')} has confidence: {is_statutory_employee.confidence}"
                    )
                is_retirement_plan = w2.fields.get("IsRetirementPlan")
                if is_retirement_plan:
                    print(
                        f"Is retirement plan: {is_retirement_plan.get('valueString')} has confidence: {is_retirement_plan.confidence}"
                    )
                third_party_sick_pay = w2.fields.get("IsThirdPartySickPay")
                if third_party_sick_pay:
                    print(
                        f"Is third party sick pay: {third_party_sick_pay.get('valueString')} has confidence: {third_party_sick_pay.confidence}"
                    )
                other_info = w2.fields.get("Other")
                if other_info:
                    print(f"Other information: {other_info.get('valueString')} has confidence: {other_info.confidence}")
                state_tax_info = w2.fields.get("StateTaxInfos")
                if state_tax_info:
                    print("State Tax info:")
                    for tax in state_tax_info.get("valueArray"):
                        state = tax.get("valueObject").get("State")
                        if state:
                            print(f"...State: {state.get('valueString')} has confidence: {state.confidence}")
                        employer_state_id_number = tax.get("valueObject").get("EmployerStateIdNumber")
                        if employer_state_id_number:
                            print(
                                f"...Employer state ID number: {employer_state_id_number.get('valueString')} has "
                                f"confidence: {employer_state_id_number.confidence}"
                            )
                        state_wages_tips = tax.get("valueObject").get("StateWagesTipsEtc")
                        if state_wages_tips:
                            print(
                                f"...State wages, tips, etc: {state_wages_tips.get('valueNumber')} has confidence: "
                                f"{state_wages_tips.confidence}"
                            )
                        state_income_tax = tax.get("valueObject").get("StateIncomeTax")
                        if state_income_tax:
                            print(
                                f"...State income tax: {state_income_tax.get('valueNumber')} has confidence: "
                                f"{state_income_tax.confidence}"
                            )
                local_tax_info = w2.fields.get("LocalTaxInfos")
                if local_tax_info:
                    print("Local Tax info:")
                    for tax in local_tax_info.get("valueArray"):
                        local_wages_tips = tax.get("valueObject").get("LocalWagesTipsEtc")
                        if local_wages_tips:
                            print(
                                f"...Local wages, tips, etc: {local_wages_tips.get('valueNumber')} has confidence: "
                                f"{local_wages_tips.confidence}"
                            )
                        local_income_tax = tax.get("valueObject").get("LocalIncomeTax")
                        if local_income_tax:
                            print(
                                f"...Local income tax: {local_income_tax.get('valueNumber')} has confidence: "
                                f"{local_income_tax.confidence}"
                            )
                        locality_name = tax.get("valueObject").get("LocalityName")
                        if locality_name:
                            print(
                                f"...Locality name: {locality_name.get('valueString')} has confidence: "
                                f"{locality_name.confidence}"
                            )


                print("----------------------------------------")


if __name__ == "__main__":
    analyze_tax_us_w2()

```

> [!div class="nextstepaction"]
> [View complete code on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model/sample_analyze_tax_us_w2.py) [More samples](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model)

Visit the Azure samples repository on GitHub and view the [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/w2-tax-model-output.md).

## Use the Invoice model

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult

# use your `key` and `endpoint` environment variables
key = os.environ.get('DI_KEY')
endpoint = os.environ.get('DI_ENDPOINT')

def analyze_invoice():

    invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"

    client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = client.begin_analyze_document(
        "prebuilt-invoice", AnalyzeDocumentRequest(url_source=formUrl), locale="en-US")

    result: AnalyzeResult = poller.result()

    if invoices.documents:
        for idx, invoice in enumerate(invoices.documents):
            print(f"--------Analyzing invoice #{idx + 1}--------")
            if invoice.fields:
                vendor_name = invoice.fields.get("VendorName")
                if vendor_name:
                    print(f"Vendor Name: {vendor_name.get('content')} has confidence: {vendor_name.get('confidence')}")
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
                if invoice_id:
                    print(f"Invoice Id: {invoice_id.get('content')} has confidence: {invoice_id.get('confidence')}")
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
                    print(f"Due Date: {due_date.get('content')} has confidence: {due_date.get('confidence')}")
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
                items = invoice.fields.get("Items")
                if items:
                    for idx, item in enumerate(items.get("valueArray")):
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
                            print(f"......Unit: {unit.get('content')} has confidence: {unit.get('confidence')}")
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
                            print(f"......Tax: {tax.get('content')} has confidence: {tax.get('confidence')}")
                        amount = item.get("valueObject").get("Amount")
                        if amount:
                            print(f"......Amount: {amount.get('content')} has confidence: {amount.get('confidence')}")
                subtotal = invoice.fields.get("SubTotal")
                if subtotal:
                    print(f"Subtotal: {subtotal.get('content')} has confidence: {subtotal.get('confidence')}")
                total_tax = invoice.fields.get("TotalTax")
                if total_tax:
                    print(f"Total Tax: {total_tax.get('content')} has confidence: {total_tax.get('confidence')}")
                previous_unpaid_balance = invoice.fields.get("PreviousUnpaidBalance")
                if previous_unpaid_balance:
                    print(
                        f"Previous Unpaid Balance: {previous_unpaid_balance.get('content')} has confidence: {previous_unpaid_balance.get('confidence')}"
                    )
                amount_due = invoice.fields.get("AmountDue")
                if amount_due:
                    print(f"Amount Due: {amount_due.get('content')} has confidence: {amount_due.get('confidence')}")
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

> [!div class="nextstepaction"]
> [View complete code on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model/sample_analyze_invoices.py) [More samples](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model)

Visit the Azure samples repository on GitHub and view the [invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/invoice-model-output.md).

## Use the Receipt model

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult

# use your `key` and `endpoint` environment variables
key = os.environ.get('DI_KEY')
endpoint = os.environ.get('DI_ENDPOINT')

def analyze_receipts():
    # sample document
    receiptUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png"

   client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    poller = client.begin_analyze_document(
        "prebuilt-receipt", AnalyzeDocumentRequest(url_source=receiptUrl), locale="en-US"
    )
    receipts: AnalyzeResult = poller.result()

    if receipts.documents:
        for idx, receipt in enumerate(receipts.documents):
            print(f"--------Analysis of receipt #{idx + 1}--------")
            print(f"Receipt type: {receipt.doc_type if receipt.doc_type else 'N/A'}")
            if receipt.fields:
                merchant_name = receipt.fields.get("MerchantName")
                if merchant_name:
                    print(
                        f"Merchant Name: {merchant_name.get('valueString')} has confidence: "
                        f"{merchant_name.confidence}"
                    )
                transaction_date = receipt.fields.get("TransactionDate")
                if transaction_date:
                    print(
                        f"Transaction Date: {transaction_date.get('valueDate')} has confidence: "
                        f"{transaction_date.confidence}"
                    )
                items = receipt.fields.get("Items")
                if items:
                    print("Receipt items:")
                    for idx, item in enumerate(items.get("valueArray")):
                        print(f"...Item #{idx + 1}")
                        item_description = item.get("valueObject").get("Description")
                        if item_description:
                            print(
                                f"......Item Description: {item_description.get('valueString')} has confidence: "
                                f"{item_description.confidence}"
                            )
                        item_quantity = item.get("valueObject").get("Quantity")
                        if item_quantity:
                            print(
                                f"......Item Quantity: {item_quantity.get('valueString')} has confidence: "
                                f"{item_quantity.confidence}"
                            )
                        item_total_price = item.get("valueObject").get("TotalPrice")
                        if item_total_price:
                            print(
                                f"......Total Item Price: {format_price(item_total_price.get('valueCurrency'))} has confidence: "
                                f"{item_total_price.confidence}"
                            )
                subtotal = receipt.fields.get("Subtotal")
                if subtotal:
                    print(
                        f"Subtotal: {format_price(subtotal.get('valueCurrency'))} has confidence: {subtotal.confidence}"
                    )
                tax = receipt.fields.get("TotalTax")
                if tax:
                    print(f"Total tax: {format_price(tax.get('valueCurrency'))} has confidence: {tax.confidence}")
                tip = receipt.fields.get("Tip")
                if tip:
                    print(f"Tip: {format_price(tip.get('valueCurrency'))} has confidence: {tip.confidence}")
                total = receipt.fields.get("Total")
                if total:
                    print(f"Total: {format_price(total.get('valueCurrency'))} has confidence: {total.confidence}")
            print("--------------------------------------")



if __name__ == "__main__":
    analyze_receipts()

```

> [!div class="nextstepaction"]
> [View complete code on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model/sample_analyze_receipts.py) [More samples](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model)

Visit the Azure samples repository on GitHub and view the [receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/receipt-model-output.md).

## Use the ID document model

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult

# use your `key` and `endpoint` environment variables
key = os.environ.get('DI_KEY')
endpoint = os.environ.get('DI_ENDPOINT')

def analyze_identity_documents():
# sample document
    identityUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png"

   client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller =client.begin_analyze_document(
            "prebuilt-idDocument", AnalyzeDocumentRequest(url_source=identityUrl)
        )
     id_documents: AnalyzeResult = poller.result()

    if id_documents.documents:
        for idx, id_document in enumerate(id_documents.documents):
            print(f"--------Analyzing ID document #{idx + 1}--------")
            if id_document.fields:
                first_name = id_document.fields.get("FirstName")
                if first_name:
                    print(f"First Name: {first_name.get('valueString')} has confidence: {first_name.confidence}")
                last_name = id_document.fields.get("LastName")
                if last_name:
                    print(f"Last Name: {last_name.get('valueString')} has confidence: {last_name.confidence}")
                document_number = id_document.fields.get("DocumentNumber")
                if document_number:
                    print(
                        f"Document Number: {document_number.get('valueString')} has confidence: {document_number.confidence}"
                    )
                dob = id_document.fields.get("DateOfBirth")
                if dob:
                    print(f"Date of Birth: {dob.get('valueDate')} has confidence: {dob.confidence}")
                doe = id_document.fields.get("DateOfExpiration")
                if doe:
                    print(f"Date of Expiration: {doe.get('valueDate')} has confidence: {doe.confidence}")
                sex = id_document.fields.get("Sex")
                if sex:
                    print(f"Sex: {sex.get('valueString')} has confidence: {sex.confidence}")
                address = id_document.fields.get("Address")
                if address:
                    print(f"Address: {address.get('valueString')} has confidence: {address.confidence}")
                country_region = id_document.fields.get("CountryRegion")
                if country_region:
                    print(
                        f"Country/Region: {country_region.get('valueCountryRegion')} has confidence: {country_region.confidence}"
                    )
                region = id_document.fields.get("Region")
                if region:
                    print(f"Region: {region.get('valueString')} has confidence: {region.confidence}")


        print("--------------------------------------")

if __name__ == "__main__":
    analyze_identity_documents()

```

> [!div class="nextstepaction"]
> [View complete code on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model/sample_analyze_identity_documents.py) [More samples](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model)

Visit the Azure samples repository on GitHub and view the [ID document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/id-document-output.md).
