---
title: "Quickstart: Form Recognizer client library for Java"
description: In this quickstart, get started with the Form Recognizer client library for Java.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 05/06/2020
ms.author: pafarley
---

[Reference documentation](https://docs.microsoft.com/java/api/overview/azure/formrecognizer?view=azure-java-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
* The current version of the [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.

## Setting up

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../create-resource.md)]

### Create environment variables

[!INCLUDE [environment-variables](../environment-variables.md)]

### Create a new Gradle project


In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts* which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

Create a folder for your sample app. From your working directory, run the following command:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *formrecognizer-quickstart.java*. Open it in your preferred editor or IDE and add the following `import` statements:

```java
import Azure.AI.FormRecognizer;
import Azure.AI.FormRecognizer.Models;

import java.util.concurrent.atomic.AtomicReference;
import com.azure.core.http.rest.PagedIterable;
import com.azure.core.util.Context;
```

In the application's `main` method, create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you'll need to close and reopen the editor, IDE, or shell to access the variable. You'll define the methods later.


```java
public static void Main(string[] args)
{
    String key = System.getenv("FORM_RECOGNIZER_KEY");
    String endpoint = System.getenv("FORM_RECOGNIZER_ENDPOINT");
}
```

### Install the client library

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

In your project's *build.gradle.kts* file, be sure to include the client library as an `implementation` statement. 

```kotlin
dependencies {
    implementation group: 'com.azure', name: 'azure-ai-formrecognizer', version: '1.0.0-beta.1'
}
```

<!-- 
    Object model tbd
-->

## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for Java:

* [Authenticate the client](#authenticate-the-client)
* [Recognize form content](#recognize-form-content)
* [Recognize receipts](#recognize-receipts)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)

## Authenticate the client

Inside the `Main` method, add the following code. Here, you'll authenticate two client objects using the subscription variables you defined above. You'll use an **AzureKeyCredential** object, so that if needed, you can update the API key without creating new client objects.

```java
FormRecognizerClient recognizerClient = new FormRecognizerClientBuilder()
    .credential(new AzureKeyCredential("{key}"))
    .endpoint("{endpoint}")
    .buildClient();
    
FormTrainingClient trainingClient = recognizerClient.getFormTrainingClient();
```

### Call client-specific methods

The next block of code uses the client objects to call methods for each of the major tasks in the Form Recognizer SDK. You'll define these methods later on.

You'll also need to add references to the URLs for your training and testing data. 
* To retrieve the SAS URL for your custom model training data, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
* To get a URL of a form to test, you can use the above steps to get the SAS URL of an individual document in blob storage. Or, take the URL of a document located elsewhere.
* Use the above method to get the URL of a receipt image as well.

> [!NOTE]
> The code snippets in this guide use remote forms accessed by URLs. If you want to process local form documents instead, see the related methods in the [reference documentation](https://docs.microsoft.com/java/api/overview/azure/formrecognizer?view=azure-java-preview).

```java
    string trainingDataUrl = "<SAS-URL-of-your-form-folder-in-blob-storage>";
    string formUrl = "<SAS-URL-of-a-form-in-blob-storage>";
    string receiptUrl = "https://docs.microsoft.com/azure/cognitive-services/form-recognizer/media"
    + "/contoso-allinone.jpg";

    // Call Form Recognizer scenarios:
    System.out.println("Get form content...");
    GetContent(recognizerClient, formUrl);

    System.out.println("Analyze receipt...");
    AnalyzeReceipt(recognizerClient, receiptUrl);

    System.out.println("Train Model with training data...");
    modelId = TrainModel(trainingClient, trainingDataUrl);

    System.out.println("Analyze PDF form...");
    AnalyzePdfForm(recognizerClient, modelId, formUrl);

    System.out.println("Manage models...");
    ManageModels(trainingClient, trainingDataUrl) ;
```


## Recognize form content

You can use Form Recognizer to recognize tables, lines, and words in documents, without needing to train a model.

To recognize the content of a file at a given URI, use the **beginRecognizeContentFromUrl** method.

```java
private static void GetContent(
    FormRecognizerClient recognizerClient, String invoiceUri)
{
    String analyzeFilePath = invoiceUri;
    SyncPoller<OperationResult, IterableStream<FormPage>> recognizeContentPoller =
        recognizerClient.beginRecognizeContentFromUrl(analyzeFilePath);
    
    IterableStream<FormPage> contentResult = recognizeContentPoller.getFinalResult();
```

The returned value is a collection of **FormPage** objects: one for each page in the submitted document. The following code iterates through these objects and prints the extracted key/value pairs and table data.

```java
    contentResult.forEach(formPage -> {
        // Table information
        System.out.println("----Recognizing content ----");
        System.out.printf("Has width: %d and height: %d, measured with unit: %s.%n", formPage.getWidth(),
            formPage.getHeight(),
            formPage.getUnit());
        formPage.getTables().forEach(formTable -> {
            System.out.printf("Table has %d rows and %d columns.%n", formTable.getRowCount(),
                formTable.getColumnCount());
            formTable.getCells().forEach(formTableCell -> {
                System.out.printf("Cell has text %s.%n", formTableCell.getText());
            });
            System.out.println();
        });
    });
}
```

## Recognize receipts

This section demonstrates how to recognize and extract common fields from US receipts, using a pre-trained receipt model.

To recognize receipts from a URI, use the **beginRecognizeReceiptsFromUrl** method. The returned value is a collection of **RecognizedReceipt** objects: one for each page in the submitted document.

```java
private static void AnalyzeReceipt(
    FormRecognizerClient recognizerClient, string receiptUri)
{
    SyncPoller<OperationResult, IterableStream<RecognizedReceipt>> syncPoller =
        formRecognizerClient.beginRecognizeReceiptsFromUrl(receiptUri);
    IterableStream<RecognizedReceipt> receiptPageResults = syncPoller.getFinalResult();
```

The next block of code iterates through the receipts and prints their details to the console.

```java
    receiptPageResults.forEach(recognizedReceipt -> {
        USReceipt usReceipt = ReceiptExtensions.asUSReceipt(recognizedReceipt);
        System.out.printf("Page Number: %d%n", usReceipt.getMerchantName().getPageNumber());
        System.out.printf("Merchant Name: %s, confidence: %.2f%n", usReceipt.getMerchantName().getFieldValue(), usReceipt.getMerchantName().getConfidence());
        System.out.printf("Merchant Address: %s, confidence: %.2f%n", usReceipt.getMerchantAddress().getName(), usReceipt.getMerchantAddress().getConfidence());
        System.out.printf("Merchant Phone Number %s, confidence: %.2f%n", usReceipt.getMerchantPhoneNumber().getFieldValue(), usReceipt.getMerchantPhoneNumber().getConfidence());
        System.out.printf("Total: %s confidence: %.2f%n", usReceipt.getTotal().getName(), usReceipt.getTotal().getConfidence());
```
The next block of code iterates through the individual items detected on the receipt and prints their details to the console.

```java
        System.out.printf("Receipt Items: %n");
        usReceipt.getReceiptItems().forEach(receiptItem -> {
            if (receiptItem.getName() != null) {
                System.out.printf("Name: %s, confidence: %.2f%n", receiptItem.getName().getFieldValue(), receiptItem.getName().getConfidence());
            }
            if (receiptItem.getQuantity() != null) {
                System.out.printf("Quantity: %s, confidence: %.2f%n", receiptItem.getQuantity().getFieldValue(), receiptItem.getQuantity().getConfidence());
            }
            if (receiptItem.getPrice() != null) {
                System.out.printf("Price: %s, confidence: %.2f%n", receiptItem.getPrice().getFieldValue(), receiptItem.getPrice().getConfidence());
            }
            if (receiptItem.getTotalPrice() != null) {
                System.out.printf("Total Price: %s, confidence: %.2f%n", receiptItem.getTotalPrice().getFieldValue(), receiptItem.getTotalPrice().getConfidence());
            }
        });
    });
}
```

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to recognize all fields and values found in your custom forms without manually labeling the training documents.

The following method trains a model on a given set of documents and prints the model's status to the console. 

```java
private static String TrainModel(
    FormRecognizerClient trainingClient, string trainingDataUrl)
{
    String trainingSetSource = "{unlabeled_training_set_SAS_URL}";
    SyncPoller<OperationResult, CustomFormModel> trainingPoller =
        formTrainingClient.beginTraining(trainingSetSource, false);
    
    CustomFormModel customFormModel = trainingPoller.getFinalResult();
    
    // Model Info
    System.out.printf("Model Id: %s%n", customFormModel.getModelId());
    System.out.printf("Model Status: %s%n", customFormModel.getModelStatus());
    System.out.printf("Model created on: %s%n", customFormModel.getCreatedOn());
    System.out.printf("Model last updated: %s%n%n", customFormModel.getLastUpdatedOn());
```
The returned **CustomFormModel** object contains information on the form types the model can recognize and the fields it can extract from each form type. The following code block prints this information to the console.

```java 
    System.out.println("Recognized Fields:");
    // looping through the sub-models, which contains the fields they were trained on
    // Since the given training documents are unlabeled, we still group them but they do not have a label.
    customFormModel.getSubModels().forEach(customFormSubModel -> {
        // Since the training data is unlabeled, we are unable to return the accuracy of this model
        customFormSubModel.getFieldMap().forEach((field, customFormModelField) ->
            System.out.printf("Field: %s Field Label: %s%n",
                field, customFormModelField.getLabel()));
    });
```

Finally, this method returns the unique ID of the model.

```java
    return customFormModel.getModelId();
}
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these label files. Once you have them, you can call the **beginTraining** method with the *uselabels* parameter set to `true`.

```java
private static String TrainModelWithLabels(
    FormRecognizerClient trainingClient, String trainingDataUrl)
{
    // Train custom model
    String trainingSetSource = trainingDataUrl;
    SyncPoller<OperationResult, CustomFormModel> trainingPoller = client.beginTraining(trainingSetSource, true);

    CustomFormModel customFormModel = trainingPoller.getFinalResult();

    // Model Info
    System.out.printf("Model Id: %s%n", customFormModel.getModelId());
    System.out.printf("Model Status: %s%n", customFormModel.getModelStatus());
    System.out.printf("Model created on: %s%n", customFormModel.getCreatedOn());
    System.out.printf("Model last updated: %s%n%n", customFormModel.getLastUpdatedOn());
```

The returned **CustomFormModel** indicates the fields the model can extract, along with its estimated accuracy in each field. The following code block prints this information to the console.

```java
    // looping through the sub-models, which contains the fields they were trained on
    // The labels are based on the ones you gave the training document.
    System.out.println("Recognized Fields:");
    // Since the data is labeled, we are able to return the accuracy of the model
    customFormModel.getSubModels().forEach(customFormSubModel -> {
        System.out.printf("Sub-model accuracy: %.2f%n", customFormSubModel.getAccuracy());
        customFormSubModel.getFieldMap().forEach((label, customFormModelField) ->
            System.out.printf("Field: %s Field Name: %s Field Accuracy: %.2f%n",
                label, customFormModelField.getName(), customFormModelField.getAccuracy()));
    });
    return customFormModel.getModelId();
}
```

## Analyze forms with a custom model

This section demonstrates how to extract key/value information and other content from your custom form types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method below. See the [Train a model](#train-a-model-without-labels) section.

You'll use the **beginRecognizeCustomFormsFromUrl** method. The returned value is a collection of **RecognizedForm** objects: one for each page in the submitted document.

```java
// Analyze PDF form data
private static void AnalyzePdfForm(
    FormRecognizerClient formClient, String modelId, String pdfFormUrl)
{    
    String modelId = modelId;
    SyncPoller<OperationResult, IterableStream<RecognizedForm>> recognizeFormPoller =
        client.beginRecognizeCustomFormsFromUrl(pdfFormUrl, modelId);

    IterableStream<RecognizedForm> recognizedForms = recognizeFormPoller.getFinalResult();
```

The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

```java
    recognizedForms.forEach(form -> {
        System.out.println("----------- Recognized Form -----------");
        System.out.printf("Form type: %s%n", form.getFormType());
        form.getFields().forEach((label, formField) -> {
            System.out.printf("Field %s has value %s with confidence score of %.2f.%n", label,
                formField.getFieldValue(),
                formField.getConfidence());
        });
        System.out.print("-----------------------------------");
    });
}
```

## Manage your custom models

This section demonstrates how to manage the custom models stored in your account. The following code does all of the model management tasks in a single method, as an example. Start by copying the method signature below:

```java
private static void ManageModels(
    FormRecognizerClient trainingClient, String trainingFileUrl)
{
```

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you have saved in your Form Recognizer account and compares it to the account limit.

```java
    AtomicReference<String> modelId = new AtomicReference<>();

    // First, we see how many custom models we have, and what our limit is
    AccountProperties accountProperties = client.getAccountProperties();
    System.out.printf("The account has %s custom models, and we can have at most %s custom models",
        accountProperties.getCount(), accountProperties.getLimit());
```

### List the models currently stored in the resource account

The following code block lists the current models in your account and prints their details to the console.

```java    
    // Next, we get a paged list of all of our custom models
    PagedIterable<CustomFormModelInfo> customModels = client.getModelInfos();
    System.out.println("We have following models in the account:");
    customModels.forEach(customFormModelInfo -> {
        System.out.printf("Model Id: %s%n", customFormModelInfo.getModelId());
        // get custom model info
        modelId.set(customFormModelInfo.getModelId());
        CustomFormModel customModel = client.getCustomModel(customFormModelInfo.getModelId());
        System.out.printf("Model Id: %s%n", customModel.getModelId());
        System.out.printf("Model Status: %s%n", customModel.getModelStatus());
        System.out.printf("Created on: %s%n", customModel.getCreatedOn());
        System.out.printf("Updated on: %s%n", customModel.getLastUpdatedOn());
        customModel.getSubModels().forEach(customFormSubModel -> {
            System.out.printf("Custom Model Form type: %s%n", customFormSubModel.getFormType());
            System.out.printf("Custom Model Accuracy: %.2f%n", customFormSubModel.getAccuracy());
            if (customFormSubModel.getFieldMap() != null) {
                customFormSubModel.getFieldMap().forEach((fieldText, customFormModelField) -> {
                    System.out.printf("Field Text: %s%n", fieldText);
                    System.out.printf("Field Accuracy: %.2f%n", customFormModelField.getAccuracy());
                });
            }

        });
    });
```

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID.

```java
    // Delete Custom Model
    System.out.printf("Deleted model with model Id: %s operation completed with status: %s%n", modelId.get(),
        client.deleteModelWithResponse(modelId.get(), Context.NONE).getStatusCode());
}
```


## Run the application

You can build the app with:

```console
gradle build
```

Run the application with the `run` goal:

```console
gradle run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

From Recognizer clients raise `ErrorResponseException` exceptions. For example, if you try to provide an invalid file source URL an `ErrorResponseException` would be raised with an error indicating the failure cause. In the following code snippet, the error is handled gracefully by catching the exception and display the additional information about the error.

```java Snippet:FormRecognizerBadRequest
try {
    formRecognizerClient.beginRecognizeContentFromUrl("invalidSourceUrl");
} catch (ErrorResponseException e) {
    System.out.println(e.getMessage());
}
```

### Enable client logging
Azure SDKs for Java offer a consistent logging story to help aid in troubleshooting application errors and speeding up their resolution. The logs produced will capture the flow of an application before reaching the terminal state to help locate the root issue. View the [logging wiki](https://github.com/Azure/azure-sdk-for-java/wiki/Logging-with-Azure-SDK) for guidance about enabling logging.

## Next steps

In this quickstart, you used the Form Recognizer Java client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-training-data-set.md)

* [What is Form Recognizer?](../../overview.md)
* The sample code from this guide (and more) can be found on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples).