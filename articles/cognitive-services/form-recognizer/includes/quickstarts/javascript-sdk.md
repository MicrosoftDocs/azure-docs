---
title: "Quickstart: Form Recognizer client library for JavaScript"
description: In this quickstart, get started with the Form Recognizer client library for JavaScript.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 05/08/2020
ms.author: pafarley
---

[Reference documentation](https://docs.microsoft.com/javascript/api/overview/azure/formrecognizer?view=azure-node-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/formrecognizer/ai-form-recognizer/) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
* The current version of [Node.js](https://nodejs.org/)

## Setting up

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../create-resource.md)]

### Create environment variables

[!INCLUDE [environment-variables](../environment-variables.md)]

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
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
```

Also load the environment variable file.

```javascript
// Load the .env file if it exists
require("dotenv").config();
```

### Install the client library

Install the `ai-form-recognizer` and `dotenv` NPM packages:

```console
npm install @azure/ai-form-recognizer dotenv
```

Your app's `package.json` file will be updated with the dependencies.


<!-- 
    Object model
-->

## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for JavaScript:

* [Authenticate the client](#authenticate-the-client)
* [Recognize form content](#recognize-form-content)
* [Recognize receipts](#recognize-receipts)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)

## Authenticate the client

In the `main` function, create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you'll need to close and reopen the editor, IDE, or shell to access the variable.

```javascript
// You will need to set these environment variables or edit the following values
const endpoint = process.env["FORM_RECOGNIZER_ENDPOINT"] || "<cognitive services endpoint>";
const apiKey = process.env["FORM_RECOGNIZER_KEY"] || "<api key>";
```

Then authenticate a client object using the subscription variables you defined. You'll use an **AzureKeyCredential** object, so that if needed, you can update the API key without creating new client objects. You'll also create a training client object.

```javascript
const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

const trainingClient = client.getFormTrainingClient();
```

### Call client-specific functions

The next block of code in `main` uses the client objects to call functions for each of the major tasks in the Form Recognizer SDK. You'll define these functions later on.

You'll also need to add references to the URLs for your training and testing data.
* To retrieve the SAS URL for your custom model training data, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
* To get a URL of a form to test, you can use the above steps to get the SAS URL of an individual document in blob storage. Or, take the URL of a document located elsewhere.
* Use the above method to get the URL of a receipt image as well, or use the sample image URL provided.

> [!NOTE]
> The code snippets in this guide use remote forms accessed by URLs. If you want to process local form documents instead, see the related methods in the [reference documentation](https://docs.microsoft.com/javascript/api/overview/azure/formrecognizer?view=azure-node-preview).


```javascript
const trainingDataUrl = "<url/path to the labeled training documents>";
const formUrl = "<SAS-URL-of-a-form-in-blob-storage>";
const receiptUrl = "https://docs.microsoft.com/azure/cognitive-services/form-recognizer/media/contoso-allinone.jpg";


// Call Form Recognizer scenarios:
await GetContent(recognizerClient, formUrl);
await AnalyzeReceipt(recognizerClient, receiptUrl);
modelId = await TrainModel(trainingClient, trainingDataUrl);
await AnalyzePdfForm(recognizerClient, modelId, formUrl);
await ManageModels(trainingClient, trainingDataUrl);
```

## Recognize form content

You can use Form Recognizer to recognize tables, lines, and words in documents, without needing to train a model. To recognize the content of a file at a given URI, use the **beginRecognizeContentFromUrl** method.

```javascript
async function GetContent( recognizerClient, invoiceUri)
{
    const poller = await client.beginRecognizeContentFromUrl(invoiceUri);
    await poller.pollUntilDone();
    const response = poller.getResult();
```

The returned value is a collection of **FormPage** objects: one for each page in the submitted document. The following code iterates through these objects and prints the extracted key/value pairs and table data.

```javascript
    for (const page of response.pages) {
    console.log(
        `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
    );
        for (const table of page.tables) {
            for (const row of table.rows) {
                for (const cell of row.cells) {
                    console.log(`cell [${cell.rowIndex},${cell.columnIndex}] has text ${cell.text}`);
                }
            }
        }
    }
}
```

## Recognize receipts

This section demonstrates how to recognize and extract common fields from US receipts, using a pre-trained receipt model.

To recognize receipts from a URI, use the **beginRecognizeReceiptsFromUrl** method. The returned value is a collection of **RecognizedReceipt** objects: one for each page in the submitted document. The following code processes a receipt at the given URI and prints the major fields and values to the console.

```javascript
async function AnalyzeReceipt( client, receiptUri)
{
    const poller = await client.beginRecognizeReceiptsFromUrl(url, {
        includeTextDetails: true,
        onProgress: (state) => {
            console.log(`analyzing status: ${state.status}`);
        }
    });
    await poller.pollUntilDone();
    const response = poller.getResult();


    const usReceipt = response.receipts[0];
    console.log("First receipt:");
    console.log(`Receipt type: ${usReceipt.receiptType}`);
    console.log(
        `Merchant Name: ${usReceipt.merchantName.value} (confidence: ${usReceipt.merchantName.confidence})`
    );
    console.log(
        `Transaction Date: ${usReceipt.transactionDate.value} (confidence: ${usReceipt.transactionDate.confidence})`
    );
    console.log("Receipt items:");
    console.log(`  name\tprice\tquantity\ttotalPrice`);
```

The next block of code iterates through the individual items detected on the receipt and prints their details to the console.

```csharp
    for (const item of usReceipt.items) {
        const name = `${optionalToString(item.name.value)} (confidence: ${optionalToString(
            item.name.confidence
        )})`;
        const price = `${optionalToString(item.price.value)} (confidence: ${optionalToString(
            item.price.confidence
        )})`;
        const quantity = `${optionalToString(item.quantity.value)} (confidence: ${optionalToString(
            item.quantity.confidence
        )})`;
        const totalPrice = `${optionalToString(item.totalPrice.value)} (confidence: ${optionalToString(
            item.totalPrice.confidence
        )})`;
        console.log(`  ${name}\t${price}\t${quantity}\t${totalPrice}`);
    }
```

This function makes use of a helper function `optionalToString`. Define this function at the root of your script:

```javascript
function optionalToString(value) {
  return `${value || "<missing>"}`;
}
```


## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to recognize all the fields and values found in your custom forms without manually labeling the training documents.

The following function trains a model on a given set of documents and prints the model's status to the console. 

```javascript
async function TrainModel(trainingClient, trainingDataUrl)
{
    const poller = await trainingClient.beginTraining(trainingDataUrl, false, {
        onProgress: (state) => {
            console.log(`training status: ${state.status}`);
        }
    });
    await poller.pollUntilDone();
    const response = poller.getResult();
    
    if (!response) {
        throw new Error("Expecting valid response!");
    }
    
    console.log(`Model ID: ${response.modelId}`);
    console.log(`Status: ${response.status}`);
    console.log(`Created on: ${response.createdOn}`);
    console.log(`Last modified: ${response.lastModified}`);
```

The returned **CustomFormModel** object contains information on the form types the model can recognize and the fields it can extract from each form type. The following code block prints this information to the console.

```javascript
    if (response.models) {
        for (const submodel of response.models) {
            // since the training data is unlabeled, we are unable to return the accuracy of this model
            console.log("We have recognized the following fields");
            for (const key in submodel.fields) {
                const field = submodel.fields[key];
                console.log(`The model found field '${field.name}'`);
            }
        }
    }
```

Finally, this method returns the unique ID of the model.

```csharp
    return response.modelId;
}
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these label files. Once you have them, you can call the **beginTraining** method with the *uselabels* parameter set to `true`.

```javascript
async function TrainModelWithLabelsAsync(
    const poller = await trainingClient.beginTraining(trainingDataUrl, true, {
        onProgress: (state) => {
            console.log(`training status: ${state.status}`);
        }
    });
    await poller.pollUntilDone();
    const model = poller.getResult();
    
    return model.modelId;
}
```

## Analyze forms with a custom model

This section demonstrates how to extract key/value information and other content from your custom form types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method below. See the [Train a model](#train-a-model-without-labels) section.

You'll use the **beginRecognizeFormsFromUrl** method. The returned value is a collection of **RecognizedForm** objects: one for each page in the submitted document.

```javascript
// Analyze PDF form document at an accessible URL
async function AnalyzePdfForm(client, modelId, formUrl)
{    
    const poller = await client.beginRecognizeFormsFromUrl(modelId, formUrl, {
        onProgress: (state) => {
            console.log(`status: ${state.status}`);
        }
    });
    await poller.pollUntilDone();
    const response = poller.getResult();
```

The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

```javascript
    console.log("Fields:");
    for (const fieldName in form.fields) {
        // each field is of type FormField
        const field = form.fields[fieldName];
        console.log(
            `Field ${fieldName} has value '${field.value}' with a confidence score of ${field.confidence}`
        );
    }
}
```

## Manage your custom models

This section demonstrates how to manage the custom models stored in your account. The following code does all of the model management tasks in a single function, as an example. Start by copying the function signature below:

```javascript
async function ManageModels(trainingClient, trainingFileUrl)
{
```

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you have saved in your Form Recognizer account and compares it to the account limit.

```csharp
    // First, we see how many custom models we have, and what our limit is
    const accountProperties = await trainingClient.getAccountProperties();
    console.log(
        `Our account has ${accountProperties.count} custom models, and we can have at most ${accountProperties.limit} custom models`
    );
```

### List the models currently stored in the resource account

The following code block lists the current models in your account and prints their details to the console. It also saves a reference to the first model.

```javascript
    // Next, we get a paged async iterator of all of our custom models
    const result = trainingClient.listModels();

    // We could print out information about first ten models
    // and save the first model id for later use
    let i = 0;
    let firstModel;
    for await (const model of result) {
        console.log(`model ${i++}:`);
        console.log(model);
        if (i === 1) {
            firstModel = model;
        }
        if (i > 10) {
            break;
        }
    }
```

### Get a specific model using the model's ID

The following code block uses the model ID saved from the previous section and uses it to retrieve details about the model.

```csharp
    // Now we'll get the first custom model in the paged list
    const model = await trainingClient.getModel(firstModel.modelId);
    console.log(`Model Id: ${model.modelId}`);
    console.log(`Status: ${model.status}`);
    console.log("Documents used in training: [");
    for (const doc of model.trainingDocuments || []) {
        console.log(`  ${doc.documentName}`);
    }
    console.log("]");
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

```
export DEBUG=azure*
```

For more detailed instructions on how to enable logs, see the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).


## Next steps

In this quickstart, you used the Form Recognizer Python client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-training-data-set.md)

* [What is Form Recognizer?](../../overview.md)
* The sample code from this guide (and more) can be found on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples).