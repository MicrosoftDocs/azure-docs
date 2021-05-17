---
title: "Quickstart: Form Recognizer client library for Java"
description: Use the Form Recognizer client library for Java to create a forms processing app that extracts key/value pairs and table data from your custom documents.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/14/2021
ms.custom: devx-track-java
ms.author: lajanuar
---
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->
> [!IMPORTANT]
> The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons.

[Reference documentation](/java/api/overview/azure/ai-formrecognizer-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of the [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Form Recognizer resource"  target="_blank">create a Form Recognizer resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451) (download and extract *sample_data.zip*).

## Setting up

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

### Install the client library

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

In your project's *build.gradle.kts* file, include the client library as an `implementation` statement, along with the required plugins and settings.

#### [v2.1 preview](#tab/preview)

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
    implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "3.1.0-beta.3")
}
```

> [!NOTE]
> The Form Recognizer 3.1.0-beta.3 SDK reflects _API version 2.1-preview.3_.

#### [v2.0](#tab/ga)

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
    implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "3.1.0-beta.3")
}
```

> [!NOTE]
> The Form Recognizer 3.0.0 SDK reflects API v2.1-preview.3

---

### Create a Java file


From your working directory, run the following command:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *FormRecognizer.java*. Open it in your preferred editor or IDE and add the following `import` statements:

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/FormRecognizer.java), which contains the code examples in this quickstart.


In the application's **FormRecognizer** class, create variables for your resource's key and endpoint.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_creds)]

> [!IMPORTANT]
> Go to the Azure portal. If the Form Recognizer resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**.
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

In the application's **main** method, add calls for the methods used in this quickstart. You'll define these later. You'll also need to add references to the URLs for your training and testing data.

* [!INCLUDE [get SAS URL](../../includes/sas-instructions.md)]

   :::image type="content" source="../../media/quickstarts/get-sas-url.png" alt-text="SAS URL retrieval":::
* To get a URL of a form to test, you can use the above steps to get the SAS URL of an individual document in blob storage. Or, take the URL of a document located elsewhere.
* Use the above method to get the URL of a receipt image as well.
<!-- markdownlint-disable MD024 -->
#### [v2.1 preview](#tab/preview)

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_mainvars)]

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_maincalls)]

#### [v2.0](#tab/ga)

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_mainvars)]

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_maincalls)]

---

## Object model

With Form Recognizer, you can create two different client types. The first, `FormRecognizerClient` is used to query the service to recognized form fields and content. The second, `FormTrainingClient` is use to create and manage custom models that you can use to improve recognition.

### FormRecognizerClient

`FormRecognizerClient` provides operations for:

* Recognizing form fields and content, using custom models trained to analyze your custom forms.  These values are returned in a collection of `RecognizedForm` objects. See example [Analyze custom forms](#analyze-forms-with-a-custom-model).
* Recognizing form content, including tables, lines and words, without the need to train a model.  Form content is returned in a collection of `FormPage` objects. See example [Analyze layout](#analyze-layout).
* Recognizing common fields from US receipts, business cards, invoices, and identity documents using a pre-trained model on the Form Recognizer service.

### FormTrainingClient

`FormTrainingClient` provides operations for:

* Training custom models to analyze all fields and values found in your custom forms.  A `CustomFormModel` is returned indicating the form types the model will analyze, and the fields it will extract for each form type.
* Training custom models to analyze specific fields and values you specify by labeling your custom forms.  A `CustomFormModel` is returned indicating the fields the model will extract, as well as the estimated accuracy for each field.
* Managing models created in your account.
* Copying a custom model from one Form Recognizer resource to another.

> [!NOTE]
> Models can also be trained using a graphical user interface such as the [Form Recognizer Labeling Tool](../../quickstarts/label-tool.md).

## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for Java:
<!-- markdownlint-disable MD001 -->
#### [v2.1 preview](#tab/preview)

* [Authenticate the client](#authenticate-the-client)
* [Analyze layout](#analyze-layout)
* [Analyze receipts](#analyze-receipts)
* [Analyze business cards](#analyze-business-cards)
* [Analyze invoices](#analyze-invoices)
* [Analyze identity documents](#analyze-identity-documents)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
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

At the top of your **main** method, add the following code. Here, you'll authenticate two client objects using the subscription variables you defined above. You'll use an **AzureKeyCredential** object, so that if needed, you can update the API key without creating new client objects.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_auth)]

## Analyze layout

You can use Form Recognizer to analyze tables, lines, and words in documents, without needing to train a model. For more information about layout extraction see the [Layout conceptual guide](../../concept-layout.md).

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

This section demonstrates how to analyze and extract common fields from US receipts, using a pre-trained receipt model. For more information about receipt analysis, see the [Receipts conceptual guide](../../concept-receipts.md).

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

#### [v2.1 preview](#tab/preview)

This section demonstrates how to analyze and extract common fields from English business cards, using a pre-trained model. For more information about business card analysis, see the [Business cards conceptual guide](../../concept-business-cards.md).

To analyze business cards from a URL, use the `beginRecognizeBusinessCardsFromUrl` method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_bc_call)]

> [!TIP]
> You can also analyze local business card images. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeBusinessCards**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedForm** objects: one for each card in the document. The following code processes the business card at the given URI and prints the major fields and values to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_bc_print)]

#### [v2.0](#tab/ga)

> [!IMPORTANT]
> This feature isn't available in the selected API version.

---

## Analyze invoices

#### [v2.1 preview](#tab/preview)

This section demonstrates how to analyze and extract common fields from sales invoices, using a pre-trained model. For more information about invoice analysis, see the [Invoice conceptual guide](../../concept-invoices.md).

To analyze invoices from a URL, use the `beginRecognizeInvoicesFromUrl` method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_invoice_call)]

> [!TIP]
> You can also analyze local invoices. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeInvoices**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedForm** objects: one for each invoice in the document. The following code processes the invoice at the given URI and prints the major fields and values to the console.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java?name=snippet_invoice_print)]

#### [v2.0](#tab/ga)

> [!IMPORTANT]
> This feature isn't available in the selected API version.

---

## Analyze identity documents

#### [v2.1 preview](#tab/preview)

This section demonstrates how to analyze and extract key information from government-issued identification documents—worldwide passports and U.S. driver's licenses—using the Form Recognizer prebuilt ID model. For more information about identity document analysis, see our [prebuilt identification model conceptual guide](../../concept-identification-cards.md).

To analyze identity documents from a URI use the `beginRecognizeIdDocumentsFromUrl` method.

:::code language="java" source="~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java" id="snippet_id_call":::

> [!TIP]
> You can also analyze local identity document images. See the [FormRecognizerClient](/dotnet/api/azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeIdDocuments**. Also, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) for scenarios involving local images.

The following code processes the identity document at the given URI and prints the major fields and values to the console.

:::code language="java" source="~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer-preview.java" id="snippet_id_print":::

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

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these label files. Once you have them, you can call the **beginTraining** method with the *useTrainingLabels* parameter set to `true`.

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

This section demonstrates how to extract key/value information and other content from your custom form types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method below. See the [Train a model](#train-a-model-without-labels) section.

You'll use the **beginRecognizeCustomFormsFromUrl** method.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_analyze_call)]

> [!TIP]
> You can also analyze a local file. See the [FormRecognizerClient](/java/api/com.azure.ai.formrecognizer.formrecognizerclient) methods, such as **beginRecognizeCustomForms**. Or, see the sample code on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md) for scenarios involving local images.

The returned value is a collection of **RecognizedForm** objects: one for each page in the submitted document.The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_analyze_print)]


### Output

```console
Analyze PDF form...
----------- Recognized custom form info for page 0 -----------
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

This section demonstrates how to manage the custom models stored in your account. The following code does all of the model management tasks in a single method, as an example. Start by copying the method signature below:

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_manage)]


### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you have saved in your Form Recognizer account and compares it to the account limit.

[!code-java[](~/cognitive-services-quickstart-code/java/FormRecognizer/FormRecognizer.java?name=snippet_manage_count)]


#### Output

```console
The account has 12 custom models, and we can have at most 250 custom models
```

### List the models currently stored in the resource account

The following code block lists the current models in your account and prints their details to the console.

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
