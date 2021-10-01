> [!IMPORTANT]
>
> * This quickstart SDK targets REST API version **v3.0**.
>

[Reference documentation](/python/api/azure-ai-formrecognizer) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/azure/ai/formrecognizer) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples)

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to extract and analyze form fields, text, and tables in form documents. The Python SDK supports the following models and capabilities:

### Form Recognizer models

* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Document—Analyze and extract text, tables, structure, key-value pairs and named entities.|
* Custom forms—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [**Layout API**](#layout-api-analyze-form-and-document-content)

* [**Invoice model**](#prebuilt-model-analyze-invoice-document-content)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [Python 3.x](https://www.python.org/)

  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

* Once you have your Azure subscription, [create a Form Recognizer resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.

  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.

  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

  * An **image of or URL for a form document**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.

  * An **image of or URL for an invoice document**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.

## Layout API: analyze form and document content

### Analyze form content from a given file

Copy and paste the full code sample below to recognize the content from a given file. You'll use the `begin_recognize_content` method.

```python

# coding: utf-8

# -------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
# --------------------------------------------------------------------------

TODO
```

## Prebuilt model: analyze invoice document content

### Analyze invoice from a given image

Copy and paste the full code sample below to recognize the content from a give invoice at a URI. You'll use the `begin_recognize_invoices` method. See our invoice model documentation for a list of [all supported fields](../../concept-v3-prebuilt.md) returned by the service and corresponding types.

```python
# coding: utf-8

# -------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
# --------------------------------------------------------------------------

TODO
```

Congratulations! In this quickstart, you used the Form Recognizer Python SDK to analyze forms in different ways. Next, explore the reference documentation to learn about Form Recognizer API in more depth.

## Next steps

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)