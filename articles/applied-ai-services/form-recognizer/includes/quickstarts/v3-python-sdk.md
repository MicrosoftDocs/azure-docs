> [!IMPORTANT]
>
> * This quickstart SDK targets REST API version **v3.0**.
>

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/latest/azure.ai.formrecognizer.html) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/formrecognizer/azure-ai-formrecognizer/azure/ai/formrecognizer) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/formrecognizer/azure-ai-formrecognizer/samples)

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to extract and analyze from your documents. You can easily call Form Recognizer models by integrating our client library SDks into your workflows and applications.

### Form Recognizer models

The C# SDK supports the following models and capabilities:

* 🆕General document—Analyze and extract text, tables, structure, key-value pairs and named entities.|
* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Custom—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [**General document**](#try-it-general-document-model)

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Invoice**](#try-it-prebuilt-invoice-model)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [Python 3.x](https://www.python.org/)

  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP] 
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](/azure/active-directory/authentication/overview-authentication).

* After your resource deploys, click **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

Open a terminal window in your local environment and install the Azure Form Recognizer client library for Python with pip:

```console
pip install azure-ai-formrecognizer --pre

```

### Create a new python application

Create a new Python application called **form_recognizer_quickstart.py** in your preferred editor or IDE. Then import the following libraries:

```python
import os
from azure.core.exceptions import ResourceNotFoundError
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
```

### Create variables for your Azure resource endpoint and key

```python
endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"
key = "YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY"
```

### Create your FormRecognizerClient model

```python
document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
```

At this point, your Python application should contain the following lines of code:

```python
import os
from azure.core.exceptions import ResourceNotFoundError
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"
key = "YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY"

document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
```

## **Try It**: General document model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * Add the file URI value to the `formUrl` variable near the top of your file.

### Add the following code to your Python application

```python
formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

def format_bounding_region(bounding_regions):
    if not bounding_regions:
        return "N/A"
    return ", ".join("Page #{}: {}".format(region.page_number, format_bounding_box(region.bounding_box)) for region in bounding_regions)

def format_bounding_box(bounding_box):
    if not bounding_box:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in bounding_box])

document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    with open(path_to_sample_documents, "rb") as f:
        poller = document_analysis_client.begin_analyze_document(
            "formUrl", document=f
        )
    result = poller.result()

    for style in result.styles:
        if style.is_handwritten:
            print("Document contains handwritten content: ")
            print(",".join([result.content[span.offset:span.offset + span.length] for span in style.spans]))

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
                    format_bounding_box(line.bounding_box),
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
                    format_bounding_box(selection_mark.bounding_box),
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
                    format_bounding_box(region.bounding_box),
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
                        format_bounding_box(region.bounding_box),
                    )
                )

    print("----Entities found in document----")
    for entity in result.entities:
        print("Entity of category '{}' with sub-category '{}'".format(entity.category, entity.sub_category))
        print("...has content '{}'".format(entity.content))
        print("...within '{}' bounding regions".format(format_bounding_region(entity.bounding_regions)))
        print("...with confidence {}\n".format(entity.confidence))

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
    print("----------------------------------------")

```

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * Add the file URI value to the `formUrl` variable near the top of your file.

### Add the following code to your Python application

## **Try it**: Prebuilt invoice model

This sample demonstrates how to analyze data from certain types of common documents with pre-trained models, using an invoice as an example.

> [!div class="checklist"]
>
> * For this example, you'll need an **invoice document file at a URI**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * Add the file URI value to the `string fileUri` variable at the top of the Main method.
> * To analyze a given file at a URI, use the `StartAnalyzeDocumentFromUri` method and pass `prebuilt-invoice` as the model ID. The returned value is an `AnalyzeResult` object containing data from the submitted document.

### Choose the prebuilt model ID

You are not limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the IDs of the prebuilt models currently supported by the Form Recognizer service:

* prebuilt-businessCard: extracts text and key information from business cards.
* prebuilt-idDocument: extracts text and key information from driver licenses and international passports. 
* prebuilt-invoice: extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* prebuilt-receipt: extracts text and key information from receipts.

## Run your application

1. Navigate to the folder where you have your **form_recognizer_quickstart.py** file.

1. Type the following in your terminal:

```python
python form_recognizer_quickstart.py
```

Congratulations! In this quickstart, you used the Form Recognizer Python SDK to analyze a variety of forms in different ways. Next, explore the reference documentation to learn moe about Form Recognizer v3.0 API.

## Next steps

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)