---
title: "Quickstart: Form Recognizer client library for JavaScript"
description: Use the Form Recognizer client library for JavaScript to create a forms processing app that extracts key/value pairs and table data from your custom documents.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/14/2021
ms.author: lajanuar
ms.custom: "devx-track-js, devx-track-csharp"
---
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->
> [!IMPORTANT]
>
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. See the reference documentation below.

[Reference documentation](../../index.yml) | [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/formrecognizer/ai-form-recognizer/) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org/)
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract *sample_data.zip*).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Form Recognizer resource"  target="_blank">create a Form Recognizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file.

```console
npm init
```

### Install the client library

Install the `ai-form-recognizer` NPM package:

```console
npm install @azure/ai-form-recognizer
```

Your app's `package.json` file will be updated with the dependencies.

Create a file named `index.js`, open it, and import the following libraries:

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/FormRecognizerQuickstart.js), which contains the code examples in this quickstart.

Create variables for your resource's Azure endpoint and key.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_creds)]

> [!IMPORTANT]
> Go to the Azure portal. If the Form Recognizer resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**.
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

## Object model

With Form Recognizer, you can create two different client types. The first, `FormRecognizerClient` is used to query the service to recognized form fields and content. The second, `FormTrainingClient` is used to create and manage custom models that you can use to improve recognition.

### FormRecognizerClient

`FormRecognizerClient` provides operations for:

* Recognizing form fields and content using custom models trained to analyze your custom forms. These values are returned in a collection of `RecognizedForm` objects.
* Recognizing form content, including tables, lines and words, without the need to train a model. Form content is returned in a collection of `FormPage` objects.
* Recognizing common fields from US receipts, business cards, invoices, and identity documents using a pre-trained model on the Form Recognizer service.

### FormTrainingClient

`FormTrainingClient` provides operations for:

* Training custom models to analyze all fields and values found in your custom forms. A `CustomFormModel` is returned indicating the form types the model will analyze, and the fields it will extract for each form type. _See_ the [service's documentation on unlabeled model training](#train-a-model-without-labels) for more details.
* Training custom models to analyze specific fields and values you specify by labeling your custom forms. A `CustomFormModel` is returned indicating the fields the model will extract, as well as the estimated accuracy for each field. See the [service's documentation on labeled model training](#train-a-model-with-labels) for a more detailed explanation of applying labels to a training data set.
* Managing models created in your account.
* Copying a custom model from one Form Recognizer resource to another.

> [!NOTE]
> Models can also be trained using a graphical user interface such as the [Form Recognizer Labeling Tool](../../quickstarts/label-tool.md).

## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for JavaScript:

* [Authenticate the client](#authenticate-the-client)
* [Analyze layout](#analyze-layout)
* [Analyze receipts](#analyze-receipts)
* [Analyze business cards](#analyze-business-cards)
* [Analyze invoices](#analyze-invoices)
* [Analyze identity documents](#analyze-identity-documents)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)

## Authenticate the client

Authenticate a client object using the subscription variables you defined. You'll use an `AzureKeyCredential` object, so that if needed, you can update the API key without creating new client objects. You'll also create a training client object.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_auth)]

## Get assets for testing

You'll also need to add references to the URLs for your training and testing data.

* [!INCLUDE [get SAS URL](../../includes/sas-instructions.md)]

   :::image type="content" source="../../media/quickstarts/get-sas-url.png" alt-text="SAS URL retrieval":::
* Use the sample from and receipt images included in the samples below (also available on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/assets)) or you can use the above steps to get the SAS URL of an individual document in blob storage.

## Analyze layout

You can use Form Recognizer to analyze tables, lines, and words in documents, without needing to train a model. For more information about layout extraction, see the [Layout conceptual guide](../../concept-layout.md). To analyze the content of a file at a given URI, use the `beginRecognizeContentFromUrl` method.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_getcontent)]

> [!TIP]
> You can also get content from a local file. See the [FormRecognizerClient](/javascript/api/@azure/ai-form-recognizer/formrecognizerclient) methods, such as **beginRecognizeContent**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples) for scenarios involving local images.

### Output

```console
Page 1: width 8.5 and height 11 with unit inch
cell [0,0] has text Invoice Number
cell [0,1] has text Invoice Date
cell [0,2] has text Invoice Due Date
cell [0,3] has text Charges
cell [0,5] has text VAT ID
cell [1,0] has text 34278587
cell [1,1] has text 6/18/2017
cell [1,2] has text 6/24/2017
cell [1,3] has text $56,651.49
cell [1,5] has text PT
```

## Analyze receipts

This section demonstrates how to analyze and extract common fields from US receipts, using a pre-trained receipt model. For more information about receipt analysis, see the [Receipts conceptual guide](../../concept-receipts.md).

To analyze receipts from a URI, use the `beginRecognizeReceiptsFromUrl` method. The following code processes a receipt at the given URI and prints the major fields and values to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_receipts)]

> [!TIP]
> You can also analyze local receipt images. See the [FormRecognizerClient](/javascript/api/@azure/ai-form-recognizer/formrecognizerclient) methods, such as **beginRecognizeReceipts**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples) for scenarios involving local images.

### Output

```console
status: notStarted
status: running
status: succeeded
First receipt:
  Receipt Type: 'Itemized', with confidence of 0.659
  Merchant Name: 'Contoso Contoso', with confidence of 0.516
  Transaction Date: 'Sun Jun 09 2019 17:00:00 GMT-0700 (Pacific Daylight Time)', with confidence of 0.985
    Item Name: '8GB RAM (Black)', with confidence of 0.916
    Item Name: 'SurfacePen', with confidence of 0.858
  Total: '1203.39', with confidence of 0.774
```

## Analyze business cards

This section demonstrates how to analyze and extract common fields from English-language business cards, using a pre-trained model. For more information about business card analysis, see the [Business cards conceptual guide](../../concept-business-cards.md).

To analyze business cards from a URL, use the `beginRecognizeBusinessCardsFromURL` method.

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js" id="snippet_bc":::

> [!TIP]
> You can also analyze local business card images. See the [FormRecognizerClient](/javascript/api/@azure/ai-form-recognizer/formrecognizerclient) methods, such as **beginRecognizeBusinessCards**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples) for scenarios involving local images.

## Analyze invoices

This section demonstrates how to analyze and extract common fields from sales invoices, using a pre-trained model. For more information about invoice analysis, see the [Invoice conceptual guide](../../concept-invoices.md).

To analyze invoices from a URL, use the `beginRecognizeInvoicesFromUrl` method.

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js" id="snippet_invoice":::

> [!TIP]
> You can also analyze local business card images. See the [FormRecognizerClient](/javascript/api/@azure/ai-form-recognizer/formrecognizerclient) methods, such as **beginRecognizeInvoices**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples) for scenarios involving local images.

## Analyze identity documents

This section demonstrates how to analyze and extract key information from government-issued identification documents—worldwide passports and U.S. driver's licenses—using the Form Recognizer prebuilt ID model. For more information about invoice analysis, see our [prebuilt identification model conceptual guide](../../concept-identification-cards.md).

To analyze identity documents from a URL use the `beginRecognizeIdDocumentsFromUrl` method.

:::code language="javascript" source="~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js" id="snippet_id":::

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to analyze all the fields and values found in your custom forms without manually labeling the training documents.

The following function trains a model on a given set of documents and prints the model's status to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_train)]

### Output

This is the output for a model trained with the training data available from the [JavaScript SDK](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer). This sample output has been truncated for readability.

```console
training status: creating
training status: ready
Model ID: 9d893595-1690-4cf2-a4b1-fbac0fb11909
Status: ready
Training started on: Thu Aug 20 2020 20:27:26 GMT-0700 (Pacific Daylight Time)
Training completed on: Thu Aug 20 2020 20:27:37 GMT-0700 (Pacific Daylight Time)
We have recognized the following fields
The model found field 'field-0'
The model found field 'field-1'
The model found field 'field-2'
The model found field 'field-3'
The model found field 'field-4'
The model found field 'field-5'
The model found field 'field-6'
The model found field 'field-7'
...
Document name: Form_1.jpg
Document status: succeeded
Document page count: 1
Document errors:
Document name: Form_2.jpg
Document status: succeeded
Document page count: 1
Document errors:
Document name: Form_3.jpg
Document status: succeeded
Document page count: 1
Document errors:
...
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (`\<filename\>.pdf.labels.json`) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these label files. Once you have them, you can call the `beginTraining` method with the `uselabels` parameter set to `true`.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_trainlabels)]

### Output

This is the output for a model trained with the training data available from the [JavaScript SDK](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples). This sample output has been truncated for readability.

```console
training status: creating
training status: ready
Model ID: 789b1b37-4cc3-4e36-8665-9dde68618072
Status: ready
Training started on: Thu Aug 20 2020 20:30:37 GMT-0700 (Pacific Daylight Time)
Training completed on: Thu Aug 20 2020 20:30:43 GMT-0700 (Pacific Daylight Time)
We have recognized the following fields
The model found field 'CompanyAddress'
The model found field 'CompanyName'
The model found field 'CompanyPhoneNumber'
The model found field 'DatedAs'
...
Document name: Form_1.jpg
Document status: succeeded
Document page count: 1
Document errors: undefined
Document name: Form_2.jpg
Document status: succeeded
Document page count: 1
Document errors: undefined
Document name: Form_3.jpg
Document status: succeeded
Document page count: 1
Document errors: undefined
...
```

## Analyze forms with a custom model

This section demonstrates how to extract key/value information and other content from your custom form types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method below. See the [Train a model](#train-a-model-without-labels) section.

You'll use the `beginRecognizeCustomFormsFromUrl` method. The returned value is a collection of `RecognizedForm` objects: one for each page in the submitted document.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_analyze)]

> [!TIP]
> You can also analyze local files. See the [FormRecognizerClient](/javascript/api/@azure/ai-form-recognizer/formrecognizerclient) methods, such as **beginRecognizeCustomForms**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples) for scenarios involving local images.

### Output

```console
status: notStarted
status: succeeded
Forms:
custom:form, page range: [object Object]
Pages:
Page number: 1
Tables
cell (0,0) Invoice Number
cell (0,1) Invoice Date
cell (0,2) Invoice Due Date
cell (0,3) Charges
cell (0,5) VAT ID
cell (1,0) 34278587
cell (1,1) 6/18/2017
cell (1,2) 6/24/2017
cell (1,3) $56,651.49
cell (1,5) PT
Fields:
Field Merchant has value 'Invoice For:' with a confidence score of 0.116
Field CompanyPhoneNumber has value '$56,651.49' with a confidence score of 0.249
Field VendorName has value 'Charges' with a confidence score of 0.145
Field CompanyAddress has value '1 Redmond way Suite 6000 Redmond, WA' with a confidence score of 0.258
Field CompanyName has value 'PT' with a confidence score of 0.245
Field Website has value '99243' with a confidence score of 0.114
Field DatedAs has value 'undefined' with a confidence score of undefined
Field Email has value 'undefined' with a confidence score of undefined
Field PhoneNumber has value 'undefined' with a confidence score of undefined
Field PurchaseOrderNumber has value 'undefined' with a confidence score of undefined
Field Quantity has value 'undefined' with a confidence score of undefined
Field Signature has value 'undefined' with a confidence score of undefined
Field Subtotal has value 'undefined' with a confidence score of undefined
Field Tax has value 'undefined' with a confidence score of undefined
Field Total has value 'undefined' with a confidence score of undefined
```

## Manage your custom models

This section demonstrates how to manage the custom models stored in your account. The following code does all of the model management tasks in a single function, as an example.

### Get number of models

The following code block gets the number of models currently in your account.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_count)]

### Get list of models in account

The following code block provides a full list of available models in your account including information about when the model was created and its current status.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_list)]

### Output

```console
model 0:
{
  modelId: '453cc2e6-e3eb-4e9f-aab6-e1ac7b87e09e',
  status: 'invalid',
  trainingStartedOn: 2020-08-20T22:28:52.000Z,
  trainingCompletedOn: 2020-08-20T22:28:53.000Z
}
model 1:
{
  modelId: '628739de-779c-473d-8214-d35c72d3d4f7',
  status: 'ready',
  trainingStartedOn: 2020-08-20T23:16:51.000Z,
  trainingCompletedOn: 2020-08-20T23:16:59.000Z
}
model 2:
{
  modelId: '789b1b37-4cc3-4e36-8665-9dde68618072',
  status: 'ready',
  trainingStartedOn: 2020-08-21T03:30:37.000Z,
  trainingCompletedOn: 2020-08-21T03:30:43.000Z
}
model 3:
{
  modelId: '9d893595-1690-4cf2-a4b1-fbac0fb11909',
  status: 'ready',
  trainingStartedOn: 2020-08-21T03:27:26.000Z,
  trainingCompletedOn: 2020-08-21T03:27:37.000Z
}
```

### Get list of model IDs by page

This code block provides a paginated list of models and model IDs.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_listpages)]

### Output

```console
model 1: 453cc2e6-e3eb-4e9f-aab6-e1ac7b87e09e
model 2: 628739de-779c-473d-8214-d35c72d3d4f7
model 3: 789b1b37-4cc3-4e36-8665-9dde68618072
```

### Get model by ID

The following function takes a model ID and gets the matching model object. This function isn't called by default.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_getmodel)]

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID. This function deletes the model with the given ID. This function isn't called by default.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_delete)]

### Output

```console
Model with id 789b1b37-4cc3-4e36-8665-9dde68618072 has been deleted
```

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

### Enable logs

You can set the following environment variable to see debug logs when using this library.

```console
export DEBUG=azure*
```

For more detailed instructions on how to enable logs, see the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).

## Next steps

In this quickstart, you used the Form Recognizer JavaScript client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-training-data-set.md)

## See also

* [What is Form Recognizer?](../../overview.md)
* The sample code from this guide can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/FormRecognizerQuickstart.js).
