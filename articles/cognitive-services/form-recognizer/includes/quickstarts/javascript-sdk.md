---
title: "Quickstart: Form Recognizer client library for JavaScript"
description: Use the Form Recognizer client library for JavaScript to create a forms processing app that extracts key/value pairs and table data from your custom documents.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/21/2020
ms.author: pafarley
ms.custom: "devx-track-js, devx-track-csharp"
---

> [!IMPORTANT]
> * The Form Recognizer SDK currently targets v2.0 of the From Recognizer service.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. See the reference documentation below. 

[Reference documentation](https://docs.microsoft.com/azure/cognitive-services/form-recognizer/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/formrecognizer/ai-form-recognizer/) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Form Recognizer resource"  target="_blank">create a Form Recognizer resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
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

Create a file named `index.js`, open it, and import the following libraries:

```javascript
const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
```

### Install the client library

Install the `ai-form-recognizer` NPM package:

```console
npm install @azure/ai-form-recognizer
```

Your app's `package.json` file will be updated with the dependencies.

## Object model 

With Form Recognizer, you can create two different client types. The first, `FormRecognizerClient` is used to query the service to recognized form fields and content. The second, `FormTrainingClient` is use to create and manage custom models that you can use to improve recognition. 

### FormRecognizerClient
`FormRecognizerClient` provides operations for:

 * Recognizing form fields and content using custom models trained to recognize your custom forms. These values are returned in a collection of `RecognizedForm` objects.
 * Recognizing form content, including tables, lines and words, without the need to train a model. Form content is returned in a collection of `FormPage` objects.
 * Recognizing common fields from receipts, using a pre-trained receipt model on the Form Recognizer service. These fields and meta-data are returned in a collection of `RecognizedReceipt`.

### FormTrainingClient
`FormTrainingClient` provides operations for:

* Training custom models to recognize all fields and values found in your custom forms. A `CustomFormModel` is returned indicating the form types the model will recognize, and the fields it will extract for each form type. See the [service's documentation on unlabeled model training](#train-a-model-without-labels) for a more detailed explanation of creating a training data set.
* Training custom models to recognize specific fields and values you specify by labeling your custom forms. A `CustomFormModel` is returned indicating the fields the model will extract, as well as the estimated accuracy for each field. See the [service's documentation on labeled model training](#train-a-model-with-labels) for a more detailed explanation of applying labels to a training data set.
* Managing models created in your account.
* Copying a custom model from one Form Recognizer resource to another.

> [!NOTE]
> Models can also be trained using a graphical user interface such as the [Form Recognizer Labeling Tool](https://docs.microsoft.com/azure/cognitive-services/form-recognizer/quickstarts/label-tool).


## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for JavaScript:

* [Authenticate the client](#authenticate-the-client)
* [Recognize form content](#recognize-form-content)
* [Recognize receipts](#recognize-receipts)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)

## Authenticate the client

In your app create variables for your resource's Azure endpoint and key. 

```javascript
// You will need to set these environment variables or edit the following values
const endpoint = "<paste-your-form-recognizer-endpoint-here>";
const apiKey = "<paste-your-form-recognizer-key-here>";
```

Then authenticate a client object using the subscription variables you defined. You'll use an `AzureKeyCredential` object, so that if needed, you can update the API key without creating new client objects. You'll also create a training client object.

```javascript
const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
```

## Get assets for testing

The code snippets in this guide use remote forms accessed by URLs. If you want to process local form documents instead, see the related methods in the [reference documentation](https://docs.microsoft.com/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer) and [samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples).

You'll also need to add references to the URLs for your training and testing data.
* To retrieve the SAS URL for your custom model training data, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
* Use the sample from and receipt images included in the samples below (also available on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms) or you can use the above steps to get the SAS URL of an individual document in blob storage. 

> [!NOTE]
> The code snippets in this guide use remote forms accessed by URLs. If you want to process local form documents instead, see the related methods in the [reference documentation](https://docs.microsoft.com/azure/cognitive-services/form-recognizer/).

## Recognize form content

You can use Form Recognizer to recognize tables, lines, and words in documents, without needing to train a model. To recognize the content of a file at a given URI, use the `beginRecognizeContentFromUrl` method.

```javascript
async function recognizeContent() {
    const formUrl = "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/forms/Invoice_1.pdf";
    const poller = await client.beginRecognizeContentFromUrl(formUrl);
    const pages = await poller.pollUntilDone();

    if (!pages || pages.length === 0) {
        throw new Error("Expecting non-empty list of pages!");
    }

    for (const page of pages) {
        console.log(
            `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
        );
        for (const table of page.tables) {
            for (const cell of table.cells) {
                console.log(`cell [${cell.rowIndex},${cell.columnIndex}] has text ${cell.text}`);
            }
        }
    }
}

recognizeContent().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

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

## Recognize receipts

This section demonstrates how to recognize and extract common fields from US receipts, using a pre-trained receipt model.

To recognize receipts from a URI, use the `beginRecognizeReceiptsFromUrl` method. The following code processes a receipt at the given URI and prints the major fields and values to the console.

```javascript
async function recognizeReceipt() {
    receiptUrl = "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/receipt/contoso-receipt.png";
    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    const poller = await client.beginRecognizeReceiptsFromUrl(receiptUrl, {
        onProgress: (state) => { console.log(`status: ${state.status}`); }
    });

    const receipts = await poller.pollUntilDone();

    if (!receipts || receipts.length <= 0) {
        throw new Error("Expecting at lease one receipt in analysis result");
    }

    const receipt = receipts[0];
    console.log("First receipt:");
    const receiptTypeField = receipt.fields["ReceiptType"];
    if (receiptTypeField.valueType === "string") {
        console.log(`  Receipt Type: '${receiptTypeField.value || "<missing>"}', with confidence of ${receiptTypeField.confidence}`);
    }
    const merchantNameField = receipt.fields["MerchantName"];
    if (merchantNameField.valueType === "string") {
        console.log(`  Merchant Name: '${merchantNameField.value || "<missing>"}', with confidence of ${merchantNameField.confidence}`);
    }
    const transactionDate = receipt.fields["TransactionDate"];
    if (transactionDate.valueType === "date") {
        console.log(`  Transaction Date: '${transactionDate.value || "<missing>"}', with confidence of ${transactionDate.confidence}`);
    }
    const itemsField = receipt.fields["Items"];
    if (itemsField.valueType === "array") {
        for (const itemField of itemsField.value || []) {
            if (itemField.valueType === "object") {
                const itemNameField = itemField.value["Name"];
                if (itemNameField.valueType === "string") {
                    console.log(`    Item Name: '${itemNameField.value || "<missing>"}', with confidence of ${itemNameField.confidence}`);
                }
            }
        }
    }
    const totalField = receipt.fields["Total"];
    if (totalField.valueType === "number") {
        console.log(`  Total: '${totalField.value || "<missing>"}', with confidence of ${totalField.confidence}`);
    }
}

recognizeReceipt().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

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

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to recognize all the fields and values found in your custom forms without manually labeling the training documents.

The following function trains a model on a given set of documents and prints the model's status to the console. 

```javascript
async function trainModel() {

    const containerSasUrl = "<SAS-URL-of-your-form-folder-in-blob-storage>";
    const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));

    const poller = await trainingClient.beginTraining(containerSasUrl, false, {
        onProgress: (state) => { console.log(`training status: ${state.status}`); }
    });
    const model = await poller.pollUntilDone();

    if (!model) {
        throw new Error("Expecting valid training result!");
    }

    console.log(`Model ID: ${model.modelId}`);
    console.log(`Status: ${model.status}`);
    console.log(`Training started on: ${model.trainingStartedOn}`);
    console.log(`Training completed on: ${model.trainingCompletedOn}`);

    if (model.submodels) {
        for (const submodel of model.submodels) {
            // since the training data is unlabeled, we are unable to return the accuracy of this model
            console.log("We have recognized the following fields");
            for (const key in submodel.fields) {
                const field = submodel.fields[key];
                console.log(`The model found field '${field.name}'`);
            }
        }
    }
    // Training document information
    if (model.trainingDocuments) {
        for (const doc of model.trainingDocuments) {
            console.log(`Document name: ${doc.name}`);
            console.log(`Document status: ${doc.status}`);
            console.log(`Document page count: ${doc.pageCount}`);
            console.log(`Document errors: ${doc.errors}`);
        }
    }
}

trainModel().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

### Output

This is the output for a model trained with the training data available from the [Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/training).This sample output has been truncated for readability.

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

```javascript
async function trainModelLabels() {

    const containerSasUrl = "<SAS-URL-of-your-form-folder-in-blob-storage>";
    const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));

    const poller = await trainingClient.beginTraining(containerSasUrl, true, {
        onProgress: (state) => { console.log(`training status: ${state.status}`); }
    });
    const model = await poller.pollUntilDone();

    if (!model) {
        throw new Error("Expecting valid training result!");
    }

    console.log(`Model ID: ${model.modelId}`);
    console.log(`Status: ${model.status}`);
    console.log(`Training started on: ${model.trainingStartedOn}`);
    console.log(`Training completed on: ${model.trainingCompletedOn}`);

    if (model.submodels) {
        for (const submodel of model.submodels) {
            // since the training data is unlabeled, we are unable to return the accuracy of this model
            console.log("We have recognized the following fields");
            for (const key in submodel.fields) {
                const field = submodel.fields[key];
                console.log(`The model found field '${field.name}'`);
            }
        }
    }
    // Training document information
    if (model.trainingDocuments) {
        for (const doc of model.trainingDocuments) {
            console.log(`Document name: ${doc.name}`);
            console.log(`Document status: ${doc.status}`);
            console.log(`Document page count: ${doc.pageCount}`);
            console.log(`Document errors: ${doc.errors}`);
        }
    }
}

trainModelLabels().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

### Output 

This is the output for a model trained with the training data available from the [Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/training).This sample output has been truncated for readability.

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

```javascript
async function recognizeCustom() {
    // Model ID from when you trained your model.
    const modelId = "<modelId>";
    const formUrl = "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/forms/Invoice_1.pdf";

    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    const poller = await client.beginRecognizeCustomForms(modelId, formUrl, {
        onProgress: (state) => { console.log(`status: ${state.status}`); }
    });
    const forms = await poller.pollUntilDone();

    console.log("Forms:");
    for (const form of forms || []) {
        console.log(`${form.formType}, page range: ${form.pageRange}`);
        console.log("Pages:");
        for (const page of form.pages || []) {
            console.log(`Page number: ${page.pageNumber}`);
            console.log("Tables");
            for (const table of page.tables || []) {
                for (const cell of table.cells) {
                    console.log(`cell (${cell.rowIndex},${cell.columnIndex}) ${cell.text}`);
                }
            }
        }

        console.log("Fields:");
        for (const fieldName in form.fields) {
            // each field is of type FormField
            const field = form.fields[fieldName];
            console.log(
                `Field ${fieldName} has value '${field.value}' with a confidence score of ${field.confidence}`
            );
        }
    }
}

recognizeCustom().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

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

### Get list of models in account

The following code block provides a full list of available models in your account including information about when the model was created and it's current status.

```javascript
async function listModels() {
    const client = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));

    // returns an async iteratable iterator that supports paging
    const result = client.listCustomModels();
    let i = 0;
    for await (const modelInfo of result) {
        console.log(`model ${i++}:`);
        console.log(modelInfo);
    }
}

listModels().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

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

### Get list of model IDs

This code block provides a list of models and model IDs.

```javascript
async function listModelIds(){
    const client = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
    // using `iter.next()`
    i = 1;
    let iter = client.listCustomModels();
    let modelItem = await iter.next();
    while (!modelItem.done) {
        console.log(`model ${i++}: ${modelItem.value.modelId}`);
        modelItem = await iter.next();
    }
}
```

### Output

```console
model 1: 453cc2e6-e3eb-4e9f-aab6-e1ac7b87e09e
model 2: 628739de-779c-473d-8214-d35c72d3d4f7
model 3: 789b1b37-4cc3-4e36-8665-9dde68618072
```

### Get list of model IDs by page

This code block provides a paginated list of models and model IDs.

```javascript
async function listModelsByPage(){
    const client = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
    // using `byPage()`
    i = 1;
    for await (const response of client.listCustomModels().byPage()) {
        for (const modelInfo of response.modelList) {
            console.log(`model ${i++}: ${modelInfo.modelId}`);
        }
    }
}

listModelsByPage().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

### Output

```console
model 1: 453cc2e6-e3eb-4e9f-aab6-e1ac7b87e09e
model 2: 628739de-779c-473d-8214-d35c72d3d4f7
model 3: 789b1b37-4cc3-4e36-8665-9dde68618072
```

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID. This code deletes the model used in the previous section.

```javascript
    await client.deleteModel(firstModel.modelId);
    try {
        const deleted = await trainingClient.deleteModel(firstModel.modelId);
        console.log(deleted);
    } catch (err) {
        // Expected
        console.log(`Model with id ${firstModel.modelId} has been deleted`);
    }
}
```

### Output

```console
Model with id 789b1b37-4cc3-4e36-8665-9dde68618072 has been deleted
```

## Run the application

You can run the application at any time with any number of functions you've read about in this quickstart with this command:

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

```
export DEBUG=azure*
```

For more detailed instructions on how to enable logs, see the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).

## Next steps

In this quickstart, you used the Form Recognizer Python client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-training-data-set.md)

## See also

* [What is Form Recognizer?](../../overview.md)
