---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for Java (REST API v2.1)"
description: Use the Document Intelligence Java SDK (REST API v2.1) to create a forms processing app that extracts key data from your documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 07/18/2023
ms.custom: devx-track-java
ms.author: lajanuar
---
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> * This project targets Document Intelligence REST API version **2.1**.

[Reference documentation](/java/api/overview/azure/ai-formrecognizer-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of the [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Document Intelligence resource"  target="_blank">create a Document Intelligence resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  * You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. Paste your key and endpoint into the sample code.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true) for tips and options for putting together your training data set. For this project, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract *sample_data.zip*).


## Setting up

### Create a new Gradle project

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

```powershell
    mkdir myapp; cd myapp
   ```

Run the `gradle init` command from your working directory. This command creates essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

### Install the client library

This project uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

In your project's *build.gradle.kts* file, include the client library as an `implementation` statement, along with the required plugins and settings.

```kotlin
plugins {
    java
    application
}
application {
    mainClass.set("FormRecognizer")
}
repositories {
    mavenCentral()
}
dependencies {
    implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "3.1.1")
}
```

### Create a Java file

From your working directory, run the following command:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *FormRecognizer.java*. Open it in your preferred editor or IDE and add the following `import` statements:

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_imports)]

In the application's **FormRecognizer** class, create variables for your resource's key and endpoint.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_creds)]

> [!IMPORTANT]
> Go to the Azure portal. If the Document Intelligence resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**.
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. For more information, *see* Azure AI services [security](../../../../../ai-services/security-features.md).

In the application's **main** method, add calls for the methods used in this project. You define these calls later. You also need to add references to the URLs for your training and testing data.

* To retrieve the SAS URL for your custom model training data, go to your storage resource in the Azure portal and select the **Storage Explorer** tab. Navigate to your container, right-click, and select **Get shared access signature**. It's important to get the SAS for your container, not for the storage account itself. Make sure the **Read**, **Write**, **Delete** and **List** permissions are checked, and select **Create**. Then copy the value in the **URL** section to a temporary location. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

   :::image type="content" source="../../../media/quickstarts/get-sas-url.png" alt-text="Screenshot of SAS URL retrieval.":::

* To get a URL of a form to test, you can use the above steps to get the SAS URL of an individual document in blob storage. Or, take the URL of a document located elsewhere.
* Use the above method to get the URL of a receipt image as well.
<!-- markdownlint-disable MD024 -->

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_mainvars)]

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_maincalls)]

## Object model

With Document Intelligence, you can create two different client types. The first, `FormRecognizerClient` is used to query the service to recognized form fields and content. The second, `FormTrainingClient` is uses to create and manage custom models to improve recognition.

### FormRecognizerClient

`FormRecognizerClient` provides operations for the following tasks:

* Recognize form fields and content, using custom models trained to analyze your custom forms.  These values are returned in a collection of `RecognizedForm` objects. See example [Analyze custom forms](#analyze-forms-with-a-custom-model).
* Recognize form content, including tables, lines and words, without the need to train a model.  Form content is returned in a collection of `FormPage` objects. See example [Analyze layout](#analyze-layout).
* Recognize common fields from US receipts, business cards, invoices, and ID documents using a pre-trained model on the Document Intelligence service.

### FormTrainingClient

`FormTrainingClient` provides operations for:

* Training custom models to analyze all fields and values found in your custom forms.  A `CustomFormModel` is returned indicating the form types the model analyzes, and the fields it extracts for each form type.
* Training custom models to analyze specific fields and values you specify by labeling your custom forms.  A `CustomFormModel` is returned indicating the fields the model extracts and the estimated accuracy for each field.
* Managing models created in your account.
* Copying a custom model from one Document Intelligence resource to another.

> [!NOTE]
> Models can also be trained using a graphical user interface such as the [Document Intelligence Labeling Tool](../../../label-tool.md).

## Authenticate the client

At the top of your **main** method, add the following code. Here, you authenticate two client objects using the subscription variables you defined previously. You use an **AzureKeyCredential** object, so that if needed, you can update the key without creating new client objects.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_auth)]

## Analyze layout

You can use Document Intelligence to analyze tables, lines, and words in documents, without needing to train a model. For more information about layout extraction, see the [Layout conceptual guide](../../../concept-layout.md).

To analyze the content of a file at a given URL, use the **beginRecognizeContentFromUrl** method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_getcontent_call)]

> [!TIP]
> You can also get content from a local file. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeContent**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **FormPage** objects: one for each page in the submitted document. The following code iterates through these objects and prints the extracted key/value pairs and table data.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_getcontent_print)]

### Output

```console
Get form content...
----Recognizing content ----
Has width: 8.500000 and height: 11.000000, measured with unit: inch.
Table has 2 rows and 6 columns.
Cell has text Invoice Number.
Cell has text Invoice Date.
Cell has text Invoice Due Date.
Cell has text Charges.
Cell has text VAT ID.
Cell has text 458176.
Cell has text 3/28/2018.
Cell has text 4/16/2018.
Cell has text $89,024.34.
Cell has text ET.
```

## Analyze receipts

This section demonstrates how to analyze and extract common fields from US receipts, using a pre-trained receipt model. For more information about receipt analysis, see the [Receipts conceptual guide](../../../concept-receipt.md).

To analyze receipts from a URI, use the **beginRecognizeReceiptsFromUrl** method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_receipts_call)]

> [!TIP]
> You can also analyze local receipt images. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeReceipts**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedReceipt** objects: one for each page in the submitted document. The next block of code iterates through the receipts and prints their details to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_receipts_print)]

The next block of code iterates through the individual items detected on the receipt and prints their details to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_receipts_print_items)]

### Output

```console
Analyze receipt...
----------- Recognized Receipt page 0 -----------
Merchant Name: Contoso Contoso, confidence: 0.62
Merchant Address: 123 Main Street Redmond, WA 98052, confidence: 0.99
Transaction Date: 2020-06-10, confidence: 0.90
Receipt Items:
Name: Cappuccino, confidence: 0.96s
Quantity: null, confidence: 0.957s]
Total Price: 2.200000, confidence: 0.95
Name: BACON & EGGS, confidence: 0.94s
Quantity: null, confidence: 0.927s]
Total Price: null, confidence: 0.93
```

## Analyze business cards

This section demonstrates how to analyze and extract common fields from English business cards, using a pre-trained model. For more information about business card analysis, see the [Business cards conceptual guide](../../../concept-business-card.md).

To analyze business cards from a URL, use the `beginRecognizeBusinessCardsFromUrl` method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_bc_call)]

> [!TIP]
> You can also analyze local business card images. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeBusinessCards**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedForm** objects: one for each card in the document. The following code processes the business card at the given URI and prints the major fields and values to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_bc_print)]

## Analyze invoices

This section demonstrates how to analyze and extract common fields from sales invoices, using a pre-trained model. For more information about invoice analysis, see the [Invoice conceptual guide](../../../concept-invoice.md).

To analyze invoices from a URL, use the `beginRecognizeInvoicesFromUrl` method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_invoice_call)]

> [!TIP]
> You can also analyze local invoices. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeInvoices**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedForm** objects: one for each invoice in the document. The following code processes the invoice at the given URI and prints the major fields and values to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_invoice_print)]

## Analyze ID documents

This section demonstrates how to analyze and extract key information from government-issued identification documents—worldwide passports and U.S. driver's licenses—using the Document Intelligence prebuilt ID model. For more information about ID document analysis, see our [prebuilt identification model conceptual guide](../../../concept-id-document.md).

To analyze ID documents from a URI, use the `beginRecognizeIdentityDocumentsFromUrl` method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_id_call)]

> [!TIP]
> You can also analyze local ID document images. See the [FormRecognizerClient](/dotnet/api/azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeIdentityDocuments**. Also, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) for scenarios involving local images.

The following code processes the ID document at the given URI and prints the major fields and values to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_id_print)]

## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test, retrain, and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Document Intelligence Sample Labeling tool](../../../label-tool.md).

### Train a model without labels

Train custom models to analyze all fields and values found in your custom forms without manually labeling the training documents.

The following method trains a model on a given set of documents and prints the model's status to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_train_call)]

The returned **CustomFormModel** object contains information on the form types the model can analyze and the fields it can extract from each form type. The following code block prints this information to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_train_print)]

Finally, this method returns the unique ID of the model.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_train_return)]

### Output

```console
Train Model with training data...
Model Id: 20c3544d-97b4-49d9-b39b-dc32d85f1358
Model Status: ready
Training started on: 2020-08-31T16:52:09Z
Training completed on: 2020-08-31T16:52:23Z

Recognized Fields:
The subModel has form type form-0
The model found field 'field-0' with label: Address:
The model found field 'field-1' with label: Charges
The model found field 'field-2' with label: Invoice Date
The model found field 'field-3' with label: Invoice Due Date
The model found field 'field-4' with label: Invoice For:
The model found field 'field-5' with label: Invoice Number
The model found field 'field-6' with label: VAT ID
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Document Intelligence Sample Labeling tool](../../../label-tool.md) provides a UI to help you create these label files. Once you've them, you can call the **beginTraining** method with the *useTrainingLabels* parameter set to `true`.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_trainlabels_call)]

The returned **CustomFormModel** indicates the fields the model can extract, along with its estimated accuracy in each field. The following code block prints this information to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_trainlabels_print)]

### Output

```console
Train Model with training data...
Model Id: 20c3544d-97b4-49d9-b39b-dc32d85f1358
Model Status: ready
Training started on: 2020-08-31T16:52:09Z
Training completed on: 2020-08-31T16:52:23Z

Recognized Fields:
The subModel has form type form-0
The model found field 'field-0' with label: Address:
The model found field 'field-1' with label: Charges
The model found field 'field-2' with label: Invoice Date
The model found field 'field-3' with label: Invoice Due Date
The model found field 'field-4' with label: Invoice For:
The model found field 'field-5' with label: Invoice Number
The model found field 'field-6' with label: VAT ID
```

## Analyze forms with a custom model

This section demonstrates how to extract key/value information and other content from your custom template types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method operation. See the [Train a model](#train-a-model-without-labels) section.

You use the **beginRecognizeCustomFormsFromUrl** method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_analyze_call)]

> [!TIP]
> You can also analyze a local file. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeCustomForms**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedForm** objects: one for each page in the submitted document. The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_analyze_print)]

### Output

```console
Analyze PDF form...
----------- Recognized custom template info for page 0 -----------
Form type: form-0
Field 'field-0' has label 'Address:' with a confidence score of 0.91.
Field 'field-1' has label 'Invoice For:' with a confidence score of 1.00.
Field 'field-2' has label 'Invoice Number' with a confidence score of 1.00.
Field 'field-3' has label 'Invoice Date' with a confidence score of 1.00.
Field 'field-4' has label 'Invoice Due Date' with a confidence score of 1.00.
Field 'field-5' has label 'Charges' with a confidence score of 1.00.
Field 'field-6' has label 'VAT ID' with a confidence score of 1.00.
```

## Manage custom models

This section demonstrates how to manage the custom models stored in your account. The following code does all of the model management tasks in a single method, as an example. Start by copying the following method signature:

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_manage)]

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you've saved in your Document Intelligence account and compares it to the account limit.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_manage_count)]

#### Output

```console
The account has 12 custom models, and we can have at most 250 custom models
```

### List the models currently stored in the resource account

The following code blocklists the current models in your account and prints their details to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_manage_list)]

#### Output

This response has been truncated for readability.

```console
We have following models in the account:
Model Id: 0b048b60-86cc-47ec-9782-ad0ffaf7a5ce
Model Id: 0b048b60-86cc-47ec-9782-ad0ffaf7a5ce
Model Status: ready
Training started on: 2020-06-04T18:33:08Z
Training completed on: 2020-06-04T18:33:10Z
Custom Model Form type: form-0b048b60-86cc-47ec-9782-ad0ffaf7a5ce
Custom Model Accuracy: 1.00
Field Text: invoice date
Field Accuracy: 1.00
Field Text: invoice number
Field Accuracy: 1.00
...
```

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_manage_delete)]

## Run the application

Navigate back to your main project directory. Then, build the app with the following command:

```console
gradle build
```

Run the application with the `run` goal:

```console
gradle run
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../../../ai-services/multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../../../ai-services/multi-service-resource.md?pivots=azcli#clean-up-resources)

## Troubleshooting

Document Intelligence clients raise `ErrorResponseException` exceptions. For example, if you try to provide an invalid file source URL an `ErrorResponseException` would be raised with an error indicating the failure cause. In the following code snippet, the error is handled gracefully by catching the exception and displaying the additional information about the error.

```java Snippet:FormRecognizerBadRequest
try {
    formRecognizerClient.beginRecognizeContentFromUrl("invalidSourceUrl");
} catch (ErrorResponseException e) {
    System.out.println(e.getMessage());
}
```

### Enable client logging

Azure SDKs for Java offer a consistent logging story to help aid in troubleshooting application errors and speeding up their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. View the [logging wiki](https://github.com/Azure/azure-sdk-for-java/wiki/Logging-with-Azure-SDK) for guidance about enabling logging.

## Next steps

For this project, you used the Document Intelligence Java client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-a-custom-model.md?view=doc-intel-2.1.0&preserve-view=true)

* [What is Document Intelligence?](../../../overview.md)

* The sample code for this project (and more) can be found on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples).
