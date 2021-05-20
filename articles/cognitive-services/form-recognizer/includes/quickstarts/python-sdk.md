---
title: "Quickstart: Form Recognizer client library for Python"
description: Use the Form Recognizer client library for Python to create a forms processing app that extracts key/value pairs and table data from your custom documents.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/09/2021
ms.author: lajanuar
---
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->
> [!IMPORTANT]
>
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. See the reference documentation below.

[Reference documentation](/python/api/azure-ai-formrecognizer) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/azure/ai/formrecognizer) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract *sample_data.zip*).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Form Recognizer resource"  target="_blank">create a Form Recognizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Install the client library

After installing Python, you can install the latest version of the Form Recognizer client library with:

#### [v2.1 preview](#tab/preview)

```console
pip install azure-ai-formrecognizer --pre
```

> [!NOTE]
> The Form Recognizer 3.1.0b4 is the latest SDK preview version and reflects _API version 2.1 preview.3_.

#### [v2.0](#tab/ga)

```console
pip install azure-ai-formrecognizer
```

> [!NOTE]
> The Form Recognizer 3.0.0 SDK reflects API v2.0

---

### Create a new python application

Create a new Python application in your preferred editor or IDE. Then import the following libraries.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/FormRecognizerQuickstart.py), which contains the code examples in this quickstart.

Create variables for your resource's Azure endpoint and key.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_creds)]

## Object model

With Form Recognizer, you can create two different client types. The first, `form_recognizer_client` is used to query the service to recognize form fields and content. The second, `form_training_client` is used to create and manage custom models that you can use to improve recognition. 

### FormRecognizerClient

`form_recognizer_client` provides operations for:

* Recognizing form fields and content using custom models trained to analyze your custom forms.
* Recognizing form content, including tables, lines and words, without the need to train a model.
* Recognizing common fields from receipts, using a pre-trained receipt model on the Form Recognizer service.

### FormTrainingClient

`form_training_client` provides operations for:

* Training custom models to analyze all fields and values found in your custom forms. See the [service's documentation on unlabeled model training](#train-a-model-without-labels) for a more detailed explanation of creating a training data set.
* Training custom models to analyze specific fields and values you specify by labeling your custom forms. See the [service's documentation on labeled model training](#train-a-model-with-labels) for a more detailed explanation of applying labels to a training data set.
* Managing models created in your account.
* Copying a custom model from one Form Recognizer resource to another.

> [!NOTE]
> Models can also be trained using a graphical user interface such as the [Form Recognizer Labeling Tool](../../quickstarts/label-tool.md).

## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for Python:
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
#### [v2.1 preview](#tab/preview)

* [Authenticate the client](#authenticate-the-client)
* [Analyze layout](#analyze-layout)
* [Analyze receipts](#analyze-receipts)
* [Analyze business cards](#analyze-business-cards)
* [Analyze invoices](#analyze-invoices)
* [Analyze identity documents](#analyze-identity-documents)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Train a custom model](#train-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)

#### [v2.0](#tab/ga)

* [Authenticate the client](#authenticate-the-client)
* [Analyze layout](#analyze-layout)
* [Analyze receipts](#analyze-receipts)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)

---

## Authenticate the client

Here, you'll authenticate two client objects using the subscription variables you defined above. You'll use an **AzureKeyCredential** object, so that if needed, you can update the API key without creating new client objects.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_auth)]

## Get assets for testing

You'll need to add references to the URLs for your training and testing data.

* [!INCLUDE [get SAS URL](../../includes/sas-instructions.md)]

   :::image type="content" source="../../media/quickstarts/get-sas-url.png" alt-text="SAS URL retrieval":::

* Use the sample form and receipt images included in the samples below (also available on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms) or you can use the above steps to get the SAS URL of an individual document in blob storage. 

> [!NOTE]
> The code snippets in this guide use remote forms accessed by URLs. If you want to process local form documents instead, see the related methods in the [reference documentation](/python/api/azure-ai-formrecognizer) and [samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples).

## Analyze layout

You can use Form Recognizer to analyze tables, lines, and words in documents, without needing to train a model. For more information about layout extraction see the [Layout conceptual guide](../../concept-layout.md).

To analyze the content of a file at a given URL, use the `begin_recognize_content_from_url` method. The returned value is a collection of `FormPage` objects: one for each page in the submitted document. The following code iterates through these objects and prints the extracted key/value pairs and table data.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_getcontent)]

> [!TIP]
> You can also get content from local images. See the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_content`. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

### Output

```console
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

This section demonstrates how to analyze and extract common fields from US receipts, using a pre-trained receipt model. For more information about receipt analysis, see the [Receipts conceptual guide](../../concept-receipts.md). To analyze receipts from a URL, use the `begin_recognize_receipts_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_receipts)]

> [!TIP]
> You can also analyze local receipt images. See the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_receipts`. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

### Output

```console
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

#### [v2.1 preview](#tab/preview)

This section demonstrates how to analyze and extract common fields from English business cards, using a pre-trained model. For more information about business card analysis, see the [Business cards conceptual guide](../../concept-business-cards.md). 

To analyze business cards from a URL, use the `begin_recognize_business_cards_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart-preview.py?name=snippet_bc)]

> [!TIP]
> You can also analyze local business card images. See the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_business_cards`. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

#### [v2.0](#tab/ga)

> [!IMPORTANT]
> This feature isn't available in the selected API version.

---

## Analyze invoices

#### [v2.1 preview](#tab/preview)

This section demonstrates how to analyze and extract common fields from sales invoices, using a pre-trained model. For more information about invoice analysis, see the [Invoice conceptual guide](../../concept-invoices.md). 

To analyze invoices from a URL, use the `begin_recognize_invoices_from_url` method.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart-preview.py?name=snippet_invoice)]

> [!TIP]
> You can also analyze local invoice images. See the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_invoices`. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

#### [v2.0](#tab/ga)

> [!IMPORTANT]
> This feature isn't available in the selected API version.

---

## Analyze identity documents

#### [v2.1 preview](#tab/preview)

This section demonstrates how to analyze and extract key information from government-issued identification documents—worldwide passports and U.S. driver's licenses—using the Form Recognizer prebuilt ID model. For more information about invoice analysis, see our [prebuilt identification model conceptual guide](../../concept-identification-cards.md).

To analyze identity documents from a URL use the `begin_recognize_id_documents_from_url` method.

:::code language="python" source="~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart-preview.py" id="snippet_id":::

> [!TIP]
> You can also analyze identity document images. _See_ the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient?view=azure-python&preserve-view=true#methods) methods, such as `begin_recognize_id_documents` . _See also_ the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

#### [v2.0](#tab/ga)

> [!IMPORTANT]
> This feature isn't available in the selected API version.

---

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to analyze all fields and values found in your custom forms without manually labeling the training documents.

The following code uses the training client with the `begin_training` function to train a model on a given set of documents. The returned `CustomFormModel` object contains information on the form types the model can analyze and the fields it can extract from each form type. The following code block prints this information to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_train)]

### Output

This is the output for a model trained with the training data available from the [Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/training).

```console
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
> To train with labels, you need to have special label information files (`\<filename\>.pdf.labels.json`) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these label files. Once you have them, you can call the `begin_training` function with the *use_training_labels* parameter set to `true`.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_trainlabels)]

### Output

This is the output for a model trained with the training data available from the [Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/training).

```console
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

This section demonstrates how to extract key/value information and other content from your custom form types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method below. See the [Train a model](#train-a-model-without-labels) section.

You'll use the `begin_recognize_custom_forms_from_url` method. The returned value is a collection of `RecognizedForm` objects: one for each page in the submitted document. The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_analyze)]

> [!TIP]
> You can also analyze local images. See the [FormRecognizerClient](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formrecognizerclient) methods, such as `begin_recognize_custom_forms`. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples) for scenarios involving local images.

### Output

Using the model from the previous example, the following output is provided.

```console
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


## Manage your custom models

This section demonstrates how to manage the custom models stored in your account.

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you have saved in your Form Recognizer account and compares it to the account limit.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_count)]


### Output

```console
Our account has 5 custom models, and we can have at most 5000 custom models
```

### List the models currently stored in the resource account

The following code block lists the current models in your account and prints their details to the console. It also saves a reference to the first model.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_list)]


### Output

This is a sample output for the test account.

```console
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


### Output

This is the sample output for the custom model created in the previous example.

```console
Model ID: ae636292-0b14-4e26-81a7-a0bfcbaf7c91
Status: ready
Training started on: 2020-08-20 23:20:56+00:00
Training completed on: 2020-08-20 23:20:57+00:00
```

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID. This code deletes the model used in the previous section.

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerQuickstart.py?name=snippet_manage_delete)]


## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

### General

The Form Recognizer client library will raise exceptions defined in [Azure Core](https://aka.ms/azsdk-python-azure-core).

### Logging

This library uses the [standard logging library](https://docs.python.org/3/library/logging.html) for logging. Basic information about HTTP sessions (URLs, headers, and so on) is logged at the INFO level.

Detailed DEBUG level logging, including request/response bodies and unredacted headers, can be enabled on a client with the `logging_enable` keyword argument:

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerLogging.py?name=snippet_logging)]


Similarly, `logging_enable` can enable detailed logging for a single operation, even when it isn't enabled for the client:

[!code-python[](~/cognitive-services-quickstart-code/python/FormRecognizer/FormRecognizerLogging.py?name=snippet_example)]

## Next steps

In this quickstart, you used the Form Recognizer Python client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-training-data-set.md)

* [What is Form Recognizer?](../../overview.md)
* The sample code from this guide can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/FormRecognizerQuickstart.py).
