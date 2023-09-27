---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for JavaScript (REST API v2.1)"
description: Use the Document Intelligence SDK for JavaScript (REST API v2.1) to create a forms processing app that extracts key data from documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/21/2023
ms.author: lajanuar
ms.custom: devx-track-js
---
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Document Intelligence REST API version 2.1.

[Reference documentation](/javascript/api/overview/azure/ai-form-recognizer-readme?view=azure-node-latest&preserve-view=true) | [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/formrecognizer/ai-form-recognizer/) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- The latest version of [Visual Studio Code](https://code.visualstudio.com/).
- The latest LTS version of [Node.js](https://nodejs.org/).
- An Azure Storage blob that contains a set of training data. See [Build and train a custom model](../../build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true) for tips and options for putting together your training data set. For this project, you can use the files under the *Train* folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451). Download and extract *sample_data.zip*.
- An Azure AI services or Document Intelligence resource. <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Document Intelligence resource" target="_blank">Create a Document Intelligence resource.</a> You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure Document Intelligence service.

  1. After your resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in this article.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Set up your programming environment

Create an application and install the client library.

### Create a new Node.js application

1. In a console window, create a directory for your app, and navigate to it.

   ```console
   mkdir myapp
   cd myapp
   ```

1. Run the `npm init` command to create a node application with a *package.json* file.

   ```console
   npm init
   ```

### Install the client library

1. Install the `ai-form-recognizer` npm package:

   ```console
   npm install @azure/ai-form-recognizer
   ```

   Your app's *package.json* file is updated with the dependencies.

1. Create a file named *index.js*, open it, and import the following libraries:

   [!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_imports)]

1. Create variables for your resource's Azure endpoint and key.

   [!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_creds)]

> [!IMPORTANT]
> Go to the Azure portal. If the Document Intelligence resource you created in the Prerequisites section deployed successfully, under **Next Steps** select **Go to Resource**. You can find your key and endpoint in **Resource management** under **Keys and Endpoint**.
>
> Remember to remove the key from your code when you're done. Never post it publicly. For production, use secure methods to store and access your credentials. For more information, see [Azure AI services security](../../../../../ai-services/security-features.md).

## Use the Object model

With Document Intelligence, you can create two different client types. The first, `FormRecognizerClient`, queries the service to recognized form fields and content. The second, `FormTrainingClient`, creates and manages custom models to improve recognition.

`FormRecognizerClient` provides the following operations:

- Recognize form fields and content by using custom models trained to analyze your custom forms. These values are returned in a collection of `RecognizedForm` objects.
- Recognize form content, including tables, lines and words, without the need to train a model. Form content is returned in a collection of `FormPage` objects.
- Recognize common fields from US receipts, business cards, invoices, and ID documents by using a pretrained model on the Document Intelligence service.

`FormTrainingClient` provides operations to:

- Train custom models to analyze all fields and values found in your custom forms. A `CustomFormModel` is returned that indicates the form types the model analyzes and the fields that it extracts for each form type. For more information, see the [service's documentation on unlabeled model training](#train-a-model-without-labels).
- Train custom models to analyze specific fields and values you specify by labeling your custom forms. A `CustomFormModel` is returned that indicates the fields the model extracts and the estimated accuracy for each field. For more information, see [Train a model with labels](#train-a-model-with-labels) in this article.
- Manage models created in your account.
- Copy a custom model from one Document Intelligence resource to another.

> [!NOTE]
> Models can also be trained by using a graphical user interface such as the [Sample Labeling Tool](../../../label-tool.md).

## Authenticate the client

Authenticate a client object by using the subscription variables you defined. Use an `AzureKeyCredential` object, so that if needed, you can update the key without creating new client objects. You also create a training client object.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_auth)]

## Get assets for testing

You also need to add references to the URLs for your training and testing data.

1. To retrieve the SAS URL for your custom model training data, go to your storage resource in the Azure portal and select **Data storage** > **Containers**.
1. Navigate to your container, right-click, and select **Generate SAS**.

   Get the SAS for your container, not for the storage account itself.

1. Make sure the **Read**, **Write**, **Delete**, and **List** permissions are selected, and select **Generate SAS token and URL**.
1. Copy the value in the **URL** section to a temporary location. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

Use the sample from and receipt images included in the samples. These images are also available on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/assets). You can use the preceding steps to get the SAS URL of an individual document in blob storage.

## Analyze layout

You can use Document Intelligence to analyze tables, lines, and words in documents, without needing to train a model. For more information about layout extraction, see the [Document Intelligence layout model](../../../concept-layout.md). To analyze the content of a file at a given URI, use the `beginRecognizeContentFromUrl` method.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_getcontent)]

> [!TIP]
> You can also get content from a local file with [FormRecognizerClient](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient) methods, such as `beginRecognizeContent`.

```output
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

This section demonstrates how to analyze and extract common fields from US receipts, using a pretrained receipt model. For more information about receipt analysis, see the [Document Intelligence receipt model](../../../concept-receipt.md).

To analyze receipts from a URI, use the `beginRecognizeReceiptsFromUrl` method. The following code processes a receipt at the given URI and prints the major fields and values to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_receipts)]

> [!TIP]
> You can also analyze local receipt images with [FormRecognizerClient](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient) methods, such as `beginRecognizeReceipts`.

```output
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

This section demonstrates how to analyze and extract common fields from English-language business cards, using a pretrained model. For more information about business card analysis, see the [Document Intelligence business card model](../../../concept-business-card.md).

To analyze business cards from a URL, use the `beginRecognizeBusinessCardsFromURL` method.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_bc)]

> [!TIP]
> You can also analyze local business card images with [FormRecognizerClient](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient) methods, such as `beginRecognizeBusinessCards`.

## Analyze invoices

This section demonstrates how to analyze and extract common fields from sales invoices, using a pretrained model. For more information about invoice analysis, see the [Document Intelligence invoice model](../../../concept-invoice.md).

To analyze invoices from a URL, use the `beginRecognizeInvoicesFromUrl` method.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_invoice)]

> [!TIP]
> You can also analyze local receipt images with [FormRecognizerClient](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient) methods, such as `beginRecognizeInvoices`.

## Analyze ID documents

This section demonstrates how to analyze and extract key information from government-issued identification documents, including worldwide passports and U.S. driver's licenses, by using the Document Intelligence prebuilt ID model. For more information about ID document analysis, see the [Document Intelligence ID document model](../../../concept-id-document.md).

To analyze ID documents from a URL, use the `beginRecognizeIdDocumentsFromUrl` method.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_id)]

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original document. After you train the model, you can test, retrain, and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface (GUI) such as the [Document Intelligence Sample Labeling tool](../../../label-tool.md).

### Train a model without labels

Train custom models to analyze all the fields and values found in your custom forms without manually labeling the training documents.

The following function trains a model on a given set of documents and prints the model's status to the console.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_train)]

Here's the output for a model trained with the training data available from the [JavaScript SDK](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer). This sample result has been truncated for readability.

```output
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

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Document Intelligence Sample Labeling tool](../../../label-tool.md) provides a UI to help you create these label files. After you get them, you can call the `beginTraining` method with the `uselabels` parameter set to `true`.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_trainlabels)]

Here's the output for a model trained with the training data available from the [JavaScript SDK](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples). This sample result has been truncated for readability.

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

This section demonstrates how to extract key/value information and other content from your custom template types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method operation. See the [Train a model](#train-a-model-without-labels) section.

You use the `beginRecognizeCustomFormsFromUrl` method. The returned value is a collection of `RecognizedForm` objects. There's one object for each page in the submitted document.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_analyze)]

> [!TIP]
> You can also analyze local files with [FormRecognizerClient](/javascript/api/@azure/cognitiveservices-formrecognizer/formrecognizerclient) methods, such as `beginRecognizeCustomForms`.

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

## Manage custom models

This section demonstrates how to manage the custom models stored in your account. The following code does all of the model management tasks in a single function, as an example.

### Get number of models

The following code block gets the number of models currently in your account.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_count)]

### Get list of models in account

The following code block provides a full list of available models in your account including information about when the model was created and its current status.

[!code-javascript[](~/cognitive-services-quickstart-code/javascript/FormRecognizer/FormRecognizerQuickstart.js?name=snippet_manage_list)]

The result looks like the following output.

```output
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

The result looks like the following output.

```output
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

The result looks like the following output.

```output
Model with id 789b1b37-4cc3-4e36-8665-9dde68618072 has been deleted
```

## Run the application

Run the application with the `node` command on your project file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../../../../ai-services/multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../../../../ai-services/multi-service-resource.md?pivots=azcli#clean-up-resources)

## Troubleshooting

You can set the following environment variable to see debug logs when using this library.

```console
export DEBUG=azure*
```

For more detailed instructions on how to enable logs, see the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).

## Next steps

For this project, you used the Document Intelligence JavaScript client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build and train a custom model](../../build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true)

- [What is Document Intelligence?](../../../overview.md)

- The sample code from this project can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/FormRecognizerQuickstart.js).
