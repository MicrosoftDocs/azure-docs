---
title: "How to use the read model with Python programming language"
description: Use the Form Recognizer prebuilt-read model and Python to extract printed (typeface) and handwritten text from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/09/2022
ms.author: lajanuar
recommendations: false
---

[Reference documentation](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer?view=azure-python&preserve-view=true) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b3/) | [Samples](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [Python 3.7 or later](https://www.python.org/)

  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial)

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

Open a terminal window in your local environment and install the Azure Form Recognizer client library for Python with pip:

```console
pip install azure-ai-formrecognizer==3.2.0
```

## Read Model

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file from a URL**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) for this quickstart.
> * We've added the file URL value to the `formUrl` variable in the `analyze_read` function.
> * To analyze a given file at a URL, you'll use the `begin_analyze_document_from_url` method and pass in `prebuilt-read` as the model Id. The returned value is a `result` object containing data about the submitted document.

1. Create a new Python file called **form_recognizer_quickstart.py** in your preferred editor or IDE.

2. Open the **form_recognizer_quickstart.py** file and copy the following code sample to paste into your application. **Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance**:

```python
# import libraries
import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"

def format_bounding_box(bounding_box):
    if not bounding_box:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in bounding_box])

def analyze_read():
    # sample form document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png"

    # create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    
    poller = document_analysis_client.begin_analyze_document_from_url(
            "prebuilt-read", formUrl)
    result = poller.result()

    print ("Document contains content: ", result.content)
    
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
                    format_bounding_box(line.bounding_box),
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

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. For more information, *see* Cognitive Services [security](../../../../cognitive-services/cognitive-services-security.md).

<!-- markdownlint-disable MD036 -->

3. Once you've added a code sample to your application, navigate to the folder where you have your **form_recognizer_quickstart.py** file.

4. Type the following command in your terminal:
    ```console
    python form_recognizer_quickstart.py
    ```

### Read Model Output

Here's a snippet of the expected output:

```console
Document contains content:  While healthcare is still in the early stages of its Al journey, we
are seeing pharmaceutical and other life sciences organizations
making major investments in Al and related technologies."
.
.
.
----Analyzing Read from page #1----
Page has width: 915.0 and height: 1190.0, measured with unit: pixel
...Line # 0 has text content 'While healthcare is still in the early stages of its Al journey, we' within bounding box '[259.0, 55.0], [816.0, 56.0], [816.0, 79.0], [259.0, 77.0]'
...Line # 1 has text content 'are seeing pharmaceutical and other life sciences organizations' within bounding box '[258.0, 83.0], [825.0, 83.0], [825.0, 106.0], [258.0, 106.0]'
...Line # 2 has text content 'making major investments in Al and related technologies."' within bounding box '[259.0, 112.0], [784.0, 112.0], [784.0, 136.0], [259.0, 136.0]'
.
.
.
...Word 'While' has a confidence of 0.999
...Word 'healthcare' has a confidence of 0.995
...Word 'is' has a confidence of 0.997
```

To view the entire output, visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/v3-python-sdk-read-output.md)

## Next step
Try the layout model, which can extract selection marks and table structures in addition to what the read model offers.

> [!div class="nextstepaction"]
> [Use the Layout Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
