---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for Python (REST API v2.1)"
description: Use the Document Intelligence SDK for Python (REST API v2.1) to create a forms processing app that extracts key data from documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/21/2023
ms.author: lajanuar
ms.custom: devx-track-python
---
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Document Intelligence REST API version 2.1.

[Reference documentation](/python/api/azure-ai-formrecognizer) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/azure/ai/formrecognizer) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- [Python 3.x](https://www.python.org/). Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check whether you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
- An Azure Storage blob that contains a set of training data. See [Build and train a custom model](../../build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true) for tips and options for putting together your training data set. For this project, you can use the files under the *Train* folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451). Download and extract *sample_data.zip*.
- A Document Intelligence resource. <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Document Intelligence resource."  target="_blank">Create a Document Intelligence resource </a> in the Azure portal. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

  1. After your resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in this article.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Set up your programming environment

Install the client library and create a Python application.

### Install the client library

- After installing Python, run the following command to install the latest version of the Document Intelligence client library.

  ```console
  pip install azure-ai-formrecognizer 
  ```

### Create a Python application

1. Create a Python application named *form-recognizer.py* in an editor or IDE.
1. Import the following libraries.

   [!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_imports)]

1. Create variables for your resource's Azure endpoint and key.

   [!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_creds)]

## Use the Object model

With Document Intelligence, you can create two different client types. The first, `form_recognizer_client`, queries the service to recognize form fields and content. The second, `form_training_client`, creates and manages custom models to improve recognition.

`form_recognizer_client` provides the following operations:

- Recognize form fields and content by using custom models trained to analyze your custom forms.
- Recognize form content, including tables, lines, and words, without the need to train a model.
- Recognize common fields from receipts by using a pretrained receipt model on the Document Intelligence service.

`form_training_client` provides operations to:

- Train custom models to analyze all fields and values found in your custom forms. See [Train a model without labels](#train-a-model-without-labels) in this article.
- Train custom models to analyze specific fields and values that you specify by labeling your custom forms. See [Train a model with labels](#train-a-model-with-labels) in this article.
- Manage models created in your account.
- Copy a custom model from one Document Intelligence resource to another.

> [!NOTE]
> Models can also be trained using a graphical user interface such as the [Document Intelligence Labeling Tool](../../../label-tool.md).

## Authenticate the client

Authenticate two client objects using the subscription variables you defined previously. Use an `AzureKeyCredential` object, so that if needed, you can update the key without creating new client objects.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_auth)]

## Get assets for testing

You need to add references to the URLs for your training and testing data.

1. To retrieve the SAS URL for your custom model training data, go to your storage resource in the Azure portal and select **Data storage** > **Containers**.
1. Navigate to your container, right-click, and select **Generate SAS**.

   Get the SAS for your container, not for the storage account itself.

1. Make sure the **Read**, **Write**, **Delete**, and **List** permissions are selected, and select **Generate SAS token and URL**.
1. Copy the value in the **URL** section to a temporary location. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

Use the sample form and receipt images included in the samples, which is also available on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms). Alternatively, or you can use the above steps to get the SAS URL of an individual document in blob storage.

> [!NOTE]
> The code snippets in this project use remote forms accessed by URLs. If you want to process local documents instead, see the related methods in the [reference documentation](/python/api/azure-ai-formrecognizer) and [samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples).

## Analyze layout

You can use Document Intelligence to analyze tables, lines, and words in documents, without needing to train a model. For more information about layout extraction, see the [Document Intelligence layout model](../../../concept-layout.md).

To analyze the content of a file at a given URL, use the `begin_recognize_content_from_url` method. The returned value is a collection of `FormPage` objects. There's one object for each page in the submitted document. The following code iterates through these objects and prints the extracted key/value pairs and table data.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_getcontent)]

> [!TIP]
> You can also get content from local images with the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_content`.

```output
Table found on page 1:
Cell text: Invoice Number
Location: [Point(x=0.5075, y=2.8088), Point(x=1.9061, y=2.8088), Point(x=1.9061, y=3.3219), Point(x=0.5075, y=3.3219)]
Confidence score: 1.0

Cell text: Invoice Date
Location: [Point(x=1.9061, y=2.8088), Point(x=3.3074, y=2.8088), Point(x=3.3074, y=3.3219), Point(x=1.9061, y=3.3219)]
Confidence score: 1.0

Cell text: Invoice Due Date
Location: [Point(x=3.3074, y=2.8088), Point(x=4.7074, y=2.8088), Point(x=4.7074, y=3.3219), Point(x=3.3074, y=3.3219)]
Confidence score: 1.0

Cell text: Charges
Location: [Point(x=4.7074, y=2.8088), Point(x=5.386, y=2.8088), Point(x=5.386, y=3.3219), Point(x=4.7074, y=3.3219)]
Confidence score: 1.0
...

```

## Analyze receipts

This section demonstrates how to analyze and extract common fields from US receipts by using a pretrained receipt model. For more information about receipt analysis, see the [Document Intelligence receipt model](../../../concept-receipt.md). To analyze receipts from a URL, use the `begin_recognize_receipts_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_receipts)]

> [!TIP]
> You can also analyze local receipt images with the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_receipts`.

```output
ReceiptType: Itemized has confidence 0.659
MerchantName: Contoso Contoso has confidence 0.516
MerchantAddress: 123 Main Street Redmond, WA 98052 has confidence 0.986
MerchantPhoneNumber: None has confidence 0.99
TransactionDate: 2019-06-10 has confidence 0.985
TransactionTime: 13:59:00 has confidence 0.968
Receipt Items:
...Item #1
......Name: 8GB RAM (Black) has confidence 0.916
......TotalPrice: 999.0 has confidence 0.559
...Item #2
......Quantity: None has confidence 0.858
......Name: SurfacePen has confidence 0.858
......TotalPrice: 99.99 has confidence 0.386
Subtotal: 1098.99 has confidence 0.964
Tax: 104.4 has confidence 0.713
Total: 1203.39 has confidence 0.774
```

## Analyze business cards

This section demonstrates how to analyze and extract common fields from English business cards, using a pretrained model. For more information about business card analysis, see the [Document Intelligence business card model](../../../concept-business-card.md).

To analyze business cards from a URL, use the `begin_recognize_business_cards_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart-preview.py?name=snippet_bc)]

> [!TIP]
 > You can also analyze local business card images with the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_business_cards`.

## Analyze invoices

This section demonstrates how to analyze and extract common fields from sales invoices by using a pretrained model. For more information about invoice analysis, see the [Document Intelligence invoice model](../../../concept-invoice.md).

To analyze invoices from a URL, use the `begin_recognize_invoices_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart-preview.py?name=snippet_invoice)]

> [!TIP]
> You can also analyze local invoice images with the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_invoices`.

## Analyze ID documents

This section demonstrates how to analyze and extract key information from government-issued identification documents, including worldwide passports and U.S. driver's licenses, by using the Document Intelligence prebuilt ID model. For more information about ID document analysis, see the [Document Intelligence ID document model](../../../concept-id-document.md).

To analyze ID documents from a URL, use the `begin_recognize_id_documents_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart-preview.py?name=snippet_id)]

> [!TIP]
> You can also analyze ID document images with the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python&preserve-view=true#methods) methods, such as `begin_recognize_identity_documents`.

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original document. After you train the model, you can test, retrain, and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Document Intelligence Sample Labeling tool](../../../label-tool.md).

### Train a model without labels

Train custom models to analyze all fields and values found in your custom forms without manually labeling the training documents.

The following code uses the training client with the `begin_training` function to train a model on a given set of documents. The returned `CustomFormModel` object contains information on the form types the model can analyze and the fields it can extract from each form type. The following code block prints this information to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_train)]

Here's the output for a model trained with the training data available from the [Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/training).

```output
Model ID: 628739de-779c-473d-8214-d35c72d3d4f7
Status: ready
Training started on: 2020-08-20 23:16:51+00:00
Training completed on: 2020-08-20 23:16:59+00:00

Recognized fields:
The submodel with form type 'form-0' has recognized the following fields: Additional Notes:, Address:, Company Name:, Company Phone:, Dated As:, Details, Email:, Hero Limited, Name:, Phone:, Purchase Order, Purchase Order #:, Quantity, SUBTOTAL, Seattle, WA 93849 Phone:, Shipped From, Shipped To, TAX, TOTAL, Total, Unit Price, Vendor Name:, Website:
Document name: Form_1.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_2.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_3.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_4.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_5.jpg
Document status: succeeded
Document page count: 1
Document errors: []
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. The returned `CustomFormModel` indicates the fields the model can extract, along with its estimated accuracy in each field. The following code block prints this information to the console.

> [!IMPORTANT]
> To train with labels, you need to have special label information files (*\<filename>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Document Intelligence Sample Labeling tool](../../../label-tool.md) provides a UI to help you create these label files. After you get them, you can call the `begin_training` function with the `use_training_labels` parameter set to `true`.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_trainlabels)]

Here's the output for a model trained with the training data available from the [Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/training).

```output
Model ID: ae636292-0b14-4e26-81a7-a0bfcbaf7c91

Status: ready
Training started on: 2020-08-20 23:20:56+00:00
Training completed on: 2020-08-20 23:20:57+00:00

Recognized fields:
The submodel with form type 'form-ae636292-0b14-4e26-81a7-a0bfcbaf7c91' has recognized the following fields: CompanyAddress, CompanyName, CompanyPhoneNumber, DatedAs, Email, Merchant, PhoneNumber, PurchaseOrderNumber, Quantity, Signature, Subtotal, Tax, Total, VendorName, Website
Document name: Form_1.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_2.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_3.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_4.jpg
Document status: succeeded
Document page count: 1
Document errors: []
Document name: Form_5.jpg
Document status: succeeded
Document page count: 1
Document errors: []
```

## Analyze forms with a custom model

This section demonstrates how to extract key/value information and other content from your custom template types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method operation. See the [Train a model](#train-a-model-without-labels) section.

You use the `begin_recognize_custom_forms_from_url` method. The returned value is a collection of `RecognizedForm` objects. There's one object for each page in the submitted document. The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_analyze)]

> [!TIP]
> You can also analyze local images. See the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_custom_forms`. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

The model from the previous example renders the following output:

```output
Form type: form-ae636292-0b14-4e26-81a7-a0bfcbaf7c91
Field 'Merchant' has label 'Merchant' with value 'Invoice For:' and a confidence score of 0.116
Field 'CompanyAddress' has label 'CompanyAddress' with value '1 Redmond way Suite 6000 Redmond, WA' and a confidence score of 0.258
Field 'Website' has label 'Website' with value '99243' and a confidence score of 0.114
Field 'VendorName' has label 'VendorName' with value 'Charges' and a confidence score of 0.145
Field 'CompanyPhoneNumber' has label 'CompanyPhoneNumber' with value '$56,651.49' and a confidence score of 0.249
Field 'CompanyName' has label 'CompanyName' with value 'PT' and a confidence score of 0.245
Field 'DatedAs' has label 'DatedAs' with value 'None' and a confidence score of None
Field 'Email' has label 'Email' with value 'None' and a confidence score of None
Field 'PhoneNumber' has label 'PhoneNumber' with value 'None' and a confidence score of None
Field 'PurchaseOrderNumber' has label 'PurchaseOrderNumber' with value 'None' and a confidence score of None
Field 'Quantity' has label 'Quantity' with value 'None' and a confidence score of None
Field 'Signature' has label 'Signature' with value 'None' and a confidence score of None
Field 'Subtotal' has label 'Subtotal' with value 'None' and a confidence score of None
Field 'Tax' has label 'Tax' with value 'None' and a confidence score of None
Field 'Total' has label 'Total' with value 'None' and a confidence score of None
```

## Manage custom models

This section demonstrates how to manage the custom models stored in your account.

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you saved in your Document Intelligence account and compares it to the account limit.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_count)]

The result looks like the following output.

```console
Our account has 5 custom models, and we can have at most 5000 custom models
```

### List the models currently stored in the resource account

The following code blocklists the current models in your account and prints their details to the console. It also saves a reference to the first model.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_list)]

The result looks like the following output.

Here's a sample output for the test account.

```output
We have models with the following ids:
453cc2e6-e3eb-4e9f-aab6-e1ac7b87e09e
628739de-779c-473d-8214-d35c72d3d4f7
ae636292-0b14-4e26-81a7-a0bfcbaf7c91
b4b5df77-8538-4ffb-a996-f67158ecd305
c6309148-6b64-4fef-aea0-d39521452699
```

### Get a specific model using the model's ID

The following code block uses the model ID saved from the previous section and uses it to retrieve details about the model.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_getmodel)]

Here's the sample output for the custom model created in the previous example.

```output
Model ID: ae636292-0b14-4e26-81a7-a0bfcbaf7c91
Status: ready
Training started on: 2020-08-20 23:20:56+00:00
Training completed on: 2020-08-20 23:20:57+00:00
```

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID. This code deletes the model used in the previous section.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_delete)]

## Run the application

Run the application with the `python` command:

```console
python form-recognizer.py
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../../../../ai-services/multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../../../../ai-services/multi-service-resource.md?pivots=azcli#clean-up-resources)

## Troubleshooting

These issues might be helpful in troubleshooting.

### General

The Document Intelligence client library raises exceptions defined in [Azure Core](https://aka.ms/azsdk-python-azure-core).

### Logging

This library uses the [standard logging library](https://docs.python.org/3/library/logging.html) for logging. Basic information about HTTP sessions, such as URLs and headers, is logged at the INFO level.

Detailed DEBUG level logging, including request/response bodies and unredacted headers, can be enabled on a client with the `logging_enable` keyword argument:

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerLogging.py?name=snippet_logging)]

Similarly, `logging_enable` can enable detailed logging for a single operation, even when it isn't enabled for the client:

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerLogging.py?name=snippet_example)]

## REST samples on GitHub

- Extract text, selection marks, and table structure from documents: [Extract layout data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-layout.md)
- Train custom models and extract custom form data:
  - [Train without labels - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-train-extract.md)
  - [Train with labels - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-labeled-data.md)
- Extract data from invoices: [Extract invoice data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-invoices.md)
- Extract data from sales receipts: [Extract receipt data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-receipts.md)
- Extract data from business cards: [Extract business card data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-business-cards.md)

## Next steps

For this project, you used the Document Intelligence Python client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build and train a custom model](../../build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true)

- [What is Document Intelligence?](../../../overview.md)

- The sample code for this project can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/FormRecognizerQuickstart.py).
