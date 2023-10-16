---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for Python (REST API v3.0)"
description: 'Use the Document Intelligence SDK for Python (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/21/2023
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Document Intelligence REST API version 3.1.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/3.2.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/3.2.0/) | [Samples](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md) | [Supported REST API versions](../../../sdk-overview-v3-1.md)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- [Python 3.7 or later](https://www.python.org/). Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check whether you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
- The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. See [Getting Started with Python in Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial).
- An Azure AI services or Document Intelligence resource. Create a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a Document Intelligence resource." target="_blank">single-service</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a multiple Document Intelligence resource." target="_blank">multi-service</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
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
  | **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
  | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
  | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
  | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
  | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
  | **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=prerequisites) -->

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Set up your programming environment

Open a console window in your local environment and install the Azure AI Document Intelligence client library for Python with pip:

```console
pip install azure-ai-formrecognizer==3.2.0
```

## Create your Python application

To interact with the Document Intelligence service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your key from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Document Intelligence endpoint.

1. Create a new Python file called *form_recognizer_quickstart.py* in an editor or IDE.

1. Open the *form_recognizer_quickstart.py* file and select one of the following code samples to copy and paste into your application:

   - The [prebuilt-read](#use-the-read-model) model is at the core of all Document Intelligence models and can detect lines, words, locations, and languages. The layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.
   - The [prebuilt-layout](#use-the-layout-model) model extracts text and text locations, tables, selection marks, and structure information from documents and images.
   - The [prebuilt-document](#use-the-general-document-model) model extracts key-value pairs, tables, and selection marks from documents. The model can be used as an alternative to training a custom model without labels.
   - The [prebuilt-tax.us.w2](#use-the-w-2-tax-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.
   - The [prebuilt-invoice](#use-the-invoice-model) model extracts key fields and line items from sales invoices in various formats.
   - The [prebuilt-receipt](#use-the-receipt-model) model extracts key information from printed and handwritten sales receipts.
   - The [prebuilt-idDocument](#use-the-id-document-model) model extracts key information from US Drivers Licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident cards or *green cards*.
   - The [prebuilt-businessCard](#use-the-business-card-model) model extracts key information from business card images.

1. From the command prompt, run the Python code.

   ```python
   python form_recognizer_quickstart.py
   ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=setup) -->

## Use the Read model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

# formatting function
def format_polygon(polygon):
    if not polygon:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in polygon])


def analyze_read():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
        "prebuilt-read", formUrl
    )
    result = poller.result()

    print("Document contains content: ", result.content)

    for idx, style in enumerate(result.styles):
        print(
            "Document contains {} content".format(
                "handwritten" if style.is_handwritten else "no handwritten"
            )
        )

    for page in result.pages:
        print("----Analyzing Read from page #{}----".format(page.page_number))
        print(
            "Page has width: {} and height: {}, measured with unit: {}".format(
                page.width, page.height, page.unit
            )
        )

        for line_idx, line in enumerate(page.lines):
            print(
                "...Line # {} has text content '{}' within bounding box '{}'".format(
                    line_idx,
                    line.content,
                    format_polygon(line.polygon),
                )
            )

        for word in page.words:
            print(
                "...Word '{}' has a confidence of {}".format(
                    word.content, word.confidence
                )
            )

    print("----------------------------------------")


if __name__ == "__main__":
    analyze_read()

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-read) -->

Visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/read-model-output.md).

## Use the Layout model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

# formatting function
def format_polygon(polygon):
    if not polygon:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in polygon])


def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png"

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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-layout) -->

Visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/layout-model-output.md).

## Use the General document model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

# formatting function
def format_bounding_region(bounding_regions):
    if not bounding_regions:
        return "N/A"
    return ", ".join("Page #{}: {}".format(region.page_number, format_polygon(region.polygon)) for region in bounding_regions)

# formatting function
def format_polygon(polygon):
    if not polygon:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in polygon])


def analyze_general_documents():
    # sample document
    docUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    # create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))

    poller = document_analysis_client.begin_analyze_document_from_url(
            "prebuilt-document", docUrl)
    result = poller.result()

    for style in result.styles:
        if style.is_handwritten:
            print("Document contains handwritten content: ")
            print(",".join([result.content[span.offset:span.offset + span.length] for span in style.spans]))

    print("----Key-value pairs found in document----")
    for kv_pair in result.key_value_pairs:
        if kv_pair.key:
            print(
                    "Key '{}' found within '{}' bounding regions".format(
                        kv_pair.key.content,
                        format_bounding_region(kv_pair.key.bounding_regions),
                    )
                )
        if kv_pair.value:
            print(
                    "Value '{}' found within '{}' bounding regions\n".format(
                        kv_pair.value.content,
                        format_bounding_region(kv_pair.value.bounding_regions),
                    )
                )

    for page in result.pages:
        print("----Analyzing document from page #{}----".format(page.page_number))
        print(
            "Page has width: {} and height: {}, measured with unit: {}".format(
                page.width, page.height, page.unit
            )
        )

        for line_idx, line in enumerate(page.lines):
            print(
                "...Line # {} has text content '{}' within bounding box '{}'".format(
                    line_idx,
                    line.content,
                    format_polygon(line.polygon),
                )
            )

        for word in page.words:
            print(
                "...Word '{}' has a confidence of {}".format(
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
                    "...content on page {} is within bounding box '{}'\n".format(
                        region.page_number,
                        format_polygon(region.polygon),
                    )
                )
    print("----------------------------------------")


if __name__ == "__main__":
    analyze_general_documents()

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-general-document) -->

Visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/general-document-model-output.md).

## Use the W-2 tax model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

# formatting function
def format_address_value(address_value):
    return f"\n......House/building number: {address_value.house_number}\n......Road: {address_value.road}\n......City: {address_value.city}\n......State: {address_value.state}\n......Postal code: {address_value.postal_code}"


def analyze_tax_us_w2():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
        "prebuilt-tax.us.w2", formUrl
    )
    w2s = poller.result()

    for idx, w2 in enumerate(w2s.documents):
         print("--------Analyzing US Tax W-2 Form #{}--------".format(idx   1))
        form_variant = w2.fields.get("W2FormVariant")
        if form_variant:
            print(
                "Form variant: {} has confidence: {}".format(
                    form_variant.value, form_variant.confidence
                )
            )
        tax_year = w2.fields.get("TaxYear")
        if tax_year:
            print(
                "Tax year: {} has confidence: {}".format(
                    tax_year.value, tax_year.confidence
                )
            )
        w2_copy = w2.fields.get("W2Copy")
        if w2_copy:
            print(
                "W-2 Copy: {} has confidence: {}".format(
                    w2_copy.value,
                    w2_copy.confidence,
                )
            )
        employee = w2.fields.get("Employee")
        if employee:
            print("Employee data:")
            employee_name = employee.value.get("Name")
            if employee_name:
                print(
                    "...Name: {} has confidence: {}".format(
                        employee_name.value, employee_name.confidence
                    )
                )
            employee_ssn = employee.value.get("SocialSecurityNumber")
            if employee_ssn:
                print(
                    "...SSN: {} has confidence: {}".format(
                        employee_ssn.value, employee_ssn.confidence
                    )
                )
            employee_address = employee.value.get("Address")
            if employee_address:
                print(
                    "...Address: {}\n......has confidence: {}".format(
                        format_address_value(employee_address.value),
                        employee_address.confidence,
                    )
                )
            employee_zipcode = employee.value.get("ZipCode")
            if employee_zipcode:
                print(
                    "...Zipcode: {} has confidence: {}".format(
                        employee_zipcode.value, employee_zipcode.confidence
                    )
                )
        control_number = w2.fields.get("ControlNumber")
        if control_number:
            print(
                "Control Number: {} has confidence: {}".format(
                    control_number.value, control_number.confidence
                )
            )
        employer = w2.fields.get("Employer")
        if employer:
            print("Employer data:")
            employer_name = employer.value.get("Name")
            if employer_name:
                print(
                    "...Name: {} has confidence: {}".format(
                        employer_name.value, employer_name.confidence
                    )
                )
            employer_id = employer.value.get("IdNumber")
            if employer_id:
                print(
                    "...ID Number: {} has confidence: {}".format(
                        employer_id.value, employer_id.confidence
                    )
                )
            employer_address = employer.value.get("Address")
            if employer_address:
                print(
                    "...Address: {}\n......has confidence: {}".format(
                        format_address_value(employer_address.value),
                        employer_address.confidence,
                    )
                )
            employer_zipcode = employer.value.get("ZipCode")
            if employer_zipcode:
                print(
                    "...Zipcode: {} has confidence: {}".format(
                        employer_zipcode.value, employer_zipcode.confidence
                    )
                )
        wages_tips = w2.fields.get("WagesTipsAndOtherCompensation")
        if wages_tips:
            print(
                "Wages, tips, and other compensation: {} has confidence: {}".format(
                    wages_tips.value,
                    wages_tips.confidence,
                )
            )
        fed_income_tax_withheld = w2.fields.get("FederalIncomeTaxWithheld")
        if fed_income_tax_withheld:
            print(
                "Federal income tax withheld: {} has confidence: {}".format(
                    fed_income_tax_withheld.value, fed_income_tax_withheld.confidence
                )
            )
        social_security_wages = w2.fields.get("SocialSecurityWages")
        if social_security_wages:
            print(
                "Social Security wages: {} has confidence: {}".format(
                    social_security_wages.value, social_security_wages.confidence
                )
            )
        social_security_tax_withheld = w2.fields.get("SocialSecurityTaxWithheld")
        if social_security_tax_withheld:
            print(
                "Social Security tax withheld: {} has confidence: {}".format(
                    social_security_tax_withheld.value,
                    social_security_tax_withheld.confidence,
                )
            )
        medicare_wages_tips = w2.fields.get("MedicareWagesAndTips")
        if medicare_wages_tips:
            print(
                "Medicare wages and tips: {} has confidence: {}".format(
                    medicare_wages_tips.value, medicare_wages_tips.confidence
                )
            )
        medicare_tax_withheld = w2.fields.get("MedicareTaxWithheld")
        if medicare_tax_withheld:
            print(
                "Medicare tax withheld: {} has confidence: {}".format(
                    medicare_tax_withheld.value, medicare_tax_withheld.confidence
                )
            )
        social_security_tips = w2.fields.get("SocialSecurityTips")
        if social_security_tips:
            print(
                "Social Security tips: {} has confidence: {}".format(
                    social_security_tips.value, social_security_tips.confidence
                )
            )
        allocated_tips = w2.fields.get("AllocatedTips")
        if allocated_tips:
            print(
                "Allocated tips: {} has confidence: {}".format(
                    allocated_tips.value,
                    allocated_tips.confidence,
                )
            )
        verification_code = w2.fields.get("VerificationCode")
        if verification_code:
            print(
                "Verification code: {} has confidence: {}".format(
                    verification_code.value, verification_code.confidence
                )
            )
        dependent_care_benefits = w2.fields.get("DependentCareBenefits")
        if dependent_care_benefits:
            print(
                "Dependent care benefits: {} has confidence: {}".format(
                    dependent_care_benefits.value,
                    dependent_care_benefits.confidence,
                )
            )
        non_qualified_plans = w2.fields.get("NonQualifiedPlans")
        if non_qualified_plans:
            print(
                "Non-qualified plans: {} has confidence: {}".format(
                    non_qualified_plans.value,
                    non_qualified_plans.confidence,
                )
            )
        additional_info = w2.fields.get("AdditionalInfo")
        if additional_info:
            print("Additional information:")
            for item in additional_info.value:
                letter_code = item.value.get("LetterCode")
                if letter_code:
                    print(
                        "...Letter code: {} has confidence: {}".format(
                            letter_code.value, letter_code.confidence
                        )
                    )
                amount = item.value.get("Amount")
                if amount:
                    print(
                        "...Amount: {} has confidence: {}".format(
                            amount.value, amount.confidence
                        )
                    )
        is_statutory_employee = w2.fields.get("IsStatutoryEmployee")
        if is_statutory_employee:
            print(
                "Is statutory employee: {} has confidence: {}".format(
                    is_statutory_employee.value, is_statutory_employee.confidence
                )
            )
        is_retirement_plan = w2.fields.get("IsRetirementPlan")
        if is_retirement_plan:
            print(
                "Is retirement plan: {} has confidence: {}".format(
                    is_retirement_plan.value, is_retirement_plan.confidence
                )
            )
        third_party_sick_pay = w2.fields.get("IsThirdPartySickPay")
        if third_party_sick_pay:
            print(
                "Is third party sick pay: {} has confidence: {}".format(
                    third_party_sick_pay.value, third_party_sick_pay.confidence
                )
            )
        other_info = w2.fields.get("Other")
        if other_info:
            print(
                "Other information: {} has confidence: {}".format(
                    other_info.value,
                    other_info.confidence,
                )
            )
        state_tax_info = w2.fields.get("StateTaxInfos")
        if state_tax_info:
            print("State Tax info:")
            for tax in state_tax_info.value:
                state = tax.value.get("State")
                if state:
                    print(
                        "...State: {} has confidence: {}".format(
                            state.value, state.confidence
                        )
                    )
                employer_state_id_number = tax.value.get("EmployerStateIdNumber")
                if employer_state_id_number:
                    print(
                        "...Employer state ID number: {} has confidence: {}".format(
                            employer_state_id_number.value,
                            employer_state_id_number.confidence,
                        )
                    )
                state_wages_tips = tax.value.get("StateWagesTipsEtc")
                if state_wages_tips:
                    print(
                        "...State wages, tips, etc: {} has confidence: {}".format(
                            state_wages_tips.value, state_wages_tips.confidence
                        )
                    )
                state_income_tax = tax.value.get("StateIncomeTax")
                if state_income_tax:
                    print(
                        "...State income tax: {} has confidence: {}".format(
                            state_income_tax.value, state_income_tax.confidence
                        )
                    )
        local_tax_info = w2.fields.get("LocalTaxInfos")
        if local_tax_info:
            print("Local Tax info:")
            for tax in local_tax_info.value:
                local_wages_tips = tax.value.get("LocalWagesTipsEtc")
                if local_wages_tips:
                    print(
                        "...Local wages, tips, etc: {} has confidence: {}".format(
                            local_wages_tips.value, local_wages_tips.confidence
                        )
                    )
                local_income_tax = tax.value.get("LocalIncomeTax")
                if local_income_tax:
                    print(
                        "...Local income tax: {} has confidence: {}".format(
                            local_income_tax.value, local_income_tax.confidence
                        )
                    )
                locality_name = tax.value.get("LocalityName")
                if locality_name:
                    print(
                        "...Locality name: {} has confidence: {}".format(
                            locality_name.value, locality_name.confidence
                        )
                    )

                print("----------------------------------------")


if __name__ == "__main__":
    analyze_tax_us_w2()

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-w2-tax) -->

Visit the Azure samples repository on GitHub to view the [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/w2-tax-model-output.md).

## Use the Invoice model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

# formatting function
def format_bounding_region(bounding_regions):
    if not bounding_regions:
        return "N/A"
    return ", ".join("Page #{}: {}".format(region.page_number, format_polygon(region.polygon)) for region in bounding_regions)

# formatting function
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
            "prebuilt-invoice", invoiceUrl)
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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-invoice) -->

Visit the Azure samples repository on GitHub to view the [invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/invoice-model-output.md).

## Use the Receipt model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

def analyze_receipts():
    # sample document
    receiptUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    poller = document_analysis_client.begin_analyze_document_from_url(
        "prebuilt-receipt", receiptUrl, locale="en-US"
    )
    receipts = poller.result()
    for idx, receipt in enumerate(receipts.documents):
         print("--------Analysis of receipt #{}--------".format(idx   1))
        print("Receipt type: {}".format(receipt.doc_type or "N/A"))
        merchant_name = receipt.fields.get("MerchantName")
        if merchant_name:
            print(
                "Merchant Name: {} has confidence: {}".format(
                    merchant_name.value, merchant_name.confidence
                )
            )
        transaction_date = receipt.fields.get("TransactionDate")
        if transaction_date:
            print(
                "Transaction Date: {} has confidence: {}".format(
                    transaction_date.value, transaction_date.confidence
                )
            )
        if receipt.fields.get("Items"):
            print("Receipt items:")
            for idx, item in enumerate(receipt.fields.get("Items").value):
                 print("...Item #{}".format(idx   1))
                item_description = item.value.get("Description")
                if item_description:
                    print(
                        "......Item Description: {} has confidence: {}".format(
                            item_description.value, item_description.confidence
                        )
                    )
                item_quantity = item.value.get("Quantity")
                if item_quantity:
                    print(
                        "......Item Quantity: {} has confidence: {}".format(
                            item_quantity.value, item_quantity.confidence
                        )
                    )
                item_price = item.value.get("Price")
                if item_price:
                    print(
                        "......Individual Item Price: {} has confidence: {}".format(
                            item_price.value, item_price.confidence
                        )
                    )
                item_total_price = item.value.get("TotalPrice")
                if item_total_price:
                    print(
                        "......Total Item Price: {} has confidence: {}".format(
                            item_total_price.value, item_total_price.confidence
                        )
                    )
        subtotal = receipt.fields.get("Subtotal")
        if subtotal:
            print(
                "Subtotal: {} has confidence: {}".format(
                    subtotal.value, subtotal.confidence
                )
            )
        tax = receipt.fields.get("TotalTax")
        if tax:
            print("Total tax: {} has confidence: {}".format(tax.value, tax.confidence))
        tip = receipt.fields.get("Tip")
        if tip:
            print("Tip: {} has confidence: {}".format(tip.value, tip.confidence))
        total = receipt.fields.get("Total")
        if total:
            print("Total: {} has confidence: {}".format(total.value, total.confidence))
        print("--------------------------------------")


if __name__ == "__main__":
    analyze_receipts()

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-receipt) -->

Visit the Azure samples repository on GitHub to view the [receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/receipt-model-output.md).

## Use the ID document model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

def analyze_identity_documents():
# sample document
    identityUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
            "prebuilt-idDocument", identityUrl
        )
    id_documents = poller.result()

    for idx, id_document in enumerate(id_documents.documents):
        print("--------Analyzing ID document #{}--------".format(idx + 1))
        first_name = id_document.fields.get("FirstName")
        if first_name:
            print(
                "First Name: {} has confidence: {}".format(
                    first_name.value, first_name.confidence
                )
            )
        last_name = id_document.fields.get("LastName")
        if last_name:
            print(
                "Last Name: {} has confidence: {}".format(
                    last_name.value, last_name.confidence
                )
            )
        document_number = id_document.fields.get("DocumentNumber")
        if document_number:
            print(
                "Document Number: {} has confidence: {}".format(
                    document_number.value, document_number.confidence
                )
            )
        dob = id_document.fields.get("DateOfBirth")
        if dob:
            print(
                "Date of Birth: {} has confidence: {}".format(dob.value, dob.confidence)
            )
        doe = id_document.fields.get("DateOfExpiration")
        if doe:
            print(
                "Date of Expiration: {} has confidence: {}".format(
                    doe.value, doe.confidence
                )
            )
        sex = id_document.fields.get("Sex")
        if sex:
            print("Sex: {} has confidence: {}".format(sex.value, sex.confidence))
        address = id_document.fields.get("Address")
        if address:
            print(
                "Address: {} has confidence: {}".format(
                    address.value, address.confidence
                )
            )
        country_region = id_document.fields.get("CountryRegion")
        if country_region:
            print(
                "Country/Region: {} has confidence: {}".format(
                    country_region.value, country_region.confidence
                )
            )
        region = id_document.fields.get("Region")
        if region:
            print(
                "Region: {} has confidence: {}".format(region.value, region.confidence)
            )

        print("--------------------------------------")

if __name__ == "__main__":
    analyze_identity_documents()

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-id-document) -->

Visit the Azure samples repository on GitHub to view the [ID document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/id-document-output.md).

## Use the Business card model

```python
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# use your `key` and `endpoint` environment variables
key = os.environ.get('FR_KEY')
endpoint = os.environ.get('FR_ENDPOINT')

def analyze_business_card():
      # sample document
    businessCardUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_analysis_client.begin_analyze_document_from_url(
            "prebuilt-businessCard", businessCardUrl, locale="en-US"
        )
    business_cards = poller.result()

    for idx, business_card in enumerate(business_cards.documents):
        print("--------Analyzing business card #{}--------".format(idx + 1))
        contact_names = business_card.fields.get("ContactNames")
        if contact_names:
            for contact_name in contact_names.value:
                print(
                    "Contact First Name: {} has confidence: {}".format(
                        contact_name.value["FirstName"].value,
                        contact_name.value[
                            "FirstName"
                        ].confidence,
                    )
                )
                print(
                    "Contact Last Name: {} has confidence: {}".format(
                        contact_name.value["LastName"].value,
                        contact_name.value[
                            "LastName"
                        ].confidence,
                    )
                )
        company_names = business_card.fields.get("CompanyNames")
        if company_names:
            for company_name in company_names.value:
                print(
                    "Company Name: {} has confidence: {}".format(
                        company_name.value, company_name.confidence
                    )
                )
        departments = business_card.fields.get("Departments")
        if departments:
            for department in departments.value:
                print(
                    "Department: {} has confidence: {}".format(
                        department.value, department.confidence
                    )
                )
        job_titles = business_card.fields.get("JobTitles")
        if job_titles:
            for job_title in job_titles.value:
                print(
                    "Job Title: {} has confidence: {}".format(
                        job_title.value, job_title.confidence
                    )
                )
        emails = business_card.fields.get("Emails")
        if emails:
            for email in emails.value:
                print(
                    "Email: {} has confidence: {}".format(email.value, email.confidence)
                )
        websites = business_card.fields.get("Websites")
        if websites:
            for website in websites.value:
                print(
                    "Website: {} has confidence: {}".format(
                        website.value, website.confidence
                    )
                )
        addresses = business_card.fields.get("Addresses")
        if addresses:
            for address in addresses.value:
                print(
                    "Address: {} has confidence: {}".format(
                        address.value, address.confidence
                    )
                )
        mobile_phones = business_card.fields.get("MobilePhones")
        if mobile_phones:
            for phone in mobile_phones.value:
                print(
                    "Mobile phone number: {} has confidence: {}".format(
                        phone.content, phone.confidence
                    )
                )
        faxes = business_card.fields.get("Faxes")
        if faxes:
            for fax in faxes.value:
                print(
                    "Fax number: {} has confidence: {}".format(
                        fax.content, fax.confidence
                    )
                )
        work_phones = business_card.fields.get("WorkPhones")
        if work_phones:
            for work_phone in work_phones.value:
                print(
                    "Work phone number: {} has confidence: {}".format(
                        work_phone.content, work_phone.confidence
                    )
                )
        other_phones = business_card.fields.get("OtherPhones")
        if other_phones:
            for other_phone in other_phones.value:
                print(
                    "Other phone number: {} has confidence: {}".format(
                        other_phone.value, other_phone.confidence
                    )
                )

        print("--------------------------------------")

if __name__ == "__main__":
    analyze_business_card()

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=python&Product=FormRecognizer&Page=how-to&Section=run-business-card) -->

Visit the Azure samples repository on GitHub to view the [business card model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/how-to-guide/business-card-model-output.md).
