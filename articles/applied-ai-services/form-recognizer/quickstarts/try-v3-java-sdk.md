---
title: "Quickstart: Form Recognizer Java SDK v3.0 | Preview"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer Java client library SDKs v3.0 (preview)
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 01/28/2022
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021, mode-api
---
<!-- markdownlint-disable MD025 -->

# Get started: Form Recognizer Java SDK v3.0 | Preview

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0-beta.3/index.html) | [Library source code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)

Get started with Azure Form Recognizer using the Java programming language. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract and analyze form fields, text, and tables from your documents. You can easily call Form Recognizer models by integrating our client library SDks into your workflows and applications. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Form Recognizer features and development options, visit our [Overview](../overview.md#form-recognizer-features-and-development-options) page.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [🆕 **General document**](#general-document-model)—Analyze and extract text, tables, structure, key-value pairs, and named entities.

* [**Layout**](#layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.

* [**Prebuilt Invoice**](#prebuilt-model)—Analyze and extract common fields from specific document types using a pre-trained model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. *See* [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using VS Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (JDK)](https://www.oracle.com/java/technologies/downloads/) version 8 or later.

  * [**Gradle**](https://gradle.org/), version 6.8 or later.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. Later, you'll paste your key and endpoint into the code below:

  :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

#### Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **form-recognizer-app**, and navigate to it.

    ```console
    mkdir form-recognizer-app && form-recognizer-app
    ```

1. Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (form-recognizer-app)

#### Install the client library

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

1. Open the project's *build.gradle.kts* file in your IDE. Copay and past the following code to include the client library as an `implementation` statement, along with the required plugins and settings.

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
        implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "4.0.0-beta.3")
    }
    ```

#### Create a Java file

1. From the form-recognizer-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

    You will create the following directory structure:

    :::image type="content" source="../media/quickstarts/java-directories-2.png" alt-text="Screenshot: Java directory structure":::

1. Navigate to the `java` directory and create a file called *FormRecognizer.java*.

    > [!TIP]
    >
    > * You can create a new file using Powershell.
    > * Open a Powershell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item FormRecognizer.java**.

1. Open the `FormRecognizer.java` file in your preferred editor or IDE and add the following   `import` statements:

  ```java
    import com.azure.ai.formrecognizer.*;
    import com.azure.ai.formrecognizer.models.AnalyzeResult;
    import com.azure.ai.formrecognizer.models.DocumentLine;
    import com.azure.ai.formrecognizer.models.AnalyzedDocument;
    import com.azure.ai.formrecognizer.models.DocumentOperationResult;
    import com.azure.ai.formrecognizer.models.DocumentWord;
    import com.azure.ai.formrecognizer.models.DocumentTable;
    import com.azure.core.credential.AzureKeyCredential;
    import com.azure.core.util.polling.SyncPoller;
    
    import java.util.List;
    import java.util.Arrays;
  ```

#### Create the **FormRecognizer** class:

Next, you'll need to create a public class for your project:

```java
public class FormRecognizer {
    // All project code goes here...
}
```

> [!TIP]
> If you would like to try more than one code sample:
>
> * Select one of the sample code blocks below to copy and paste into your application.
> * [**Build and run your application**](#build-and-run-your-application).
> * Comment out that sample code block but keep the set-up code and library directives.
> * Select another sample code block to copy and paste into your application.
> * [**Build and run your application**](#build-and-run-your-application).
> * You can continue to comment out, copy/paste, build, and run the sample blocks of code.

#### Select a code sample to copy and paste into your application's main method:

* [**General document**](#general-document-model)

* [**Layout**](#layout-model)

* [**Prebuilt Invoice**](#prebuilt-model)

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. For more information, see* the Cognitive Services [security](../../../cognitive-services/cognitive-services-security.md).

## General document model

Extract text, tables, structure, key-value pairs, and named entities from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocumentFromUrl` method and pass `prebuilt-document` as the model Id. The returned value is an `AnalyzeResult` object containing data about the submitted document.
> * We've added the file URI value to the `documentUrl` variable in the main method.
> * For simplicity, all the entity fields that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [General document](../concept-general-document.md#named-entity-recognition-ner-categories) concept page.

Add the following code to the `FormRecognizer` class. Make sure you update the key and endpoint variables with values from your Form Recognizer instance in the Azure portal:

```java

    private static final String key = "PASTE_YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY_HERE";
    private static final String endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";

    public static void main(String[] args) {

        DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
            .credential(new AzureKeyCredential(key))
            .endpoint(endpoint)
            .buildClient();

        String documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf";
        String modelId = "prebuilt-document";
        SyncPoller < DocumentOperationResult, AnalyzeResult> analyzeDocumentPoller =
            client.beginAnalyzeDocumentFromUrl(modelId, documentUrl);

        AnalyzeResult analyzeResult = analyzeDocumentPoller.getFinalResult();

           // pages
           analyzeResult.getPages().forEach(documentPage -> {
               System.out.printf("Page has width: %.2f and height: %.2f, measured with unit: %s%n",
                   documentPage.getWidth(),
                   documentPage.getHeight(),
                   documentPage.getUnit());

            // lines
            documentPage.getLines().forEach(documentLine ->
                System.out.printf("Line %s is within a bounding box %s.%n",
                    documentLine.getContent(),
                    documentLine.getBoundingBox().toString()));

            // words
            documentPage.getWords().forEach(documentWord ->
                System.out.printf("Word %s has a confidence score of %.2f%n.",
                    documentWord.getContent(),
                    documentWord.getConfidence()));
        });

        // tables
        List <DocumentTable> tables = analyzeResult.getTables();
        for (int i = 0; i < tables.size(); i++) {
            DocumentTable documentTable = tables.get(i);
            System.out.printf("Table %d has %d rows and %d columns.%n", i, documentTable.getRowCount(),
                documentTable.getColumnCount());
            documentTable.getCells().forEach(documentTableCell -> {
                System.out.printf("Cell '%s', has row index %d and column index %d.%n",
                    documentTableCell.getContent(),
                    documentTableCell.getRowIndex(), documentTableCell.getColumnIndex());
            });
            System.out.println();
        }

        // Entities
        analyzeResult.getEntities().forEach(documentEntity -> {
            System.out.printf("Entity category : %s, sub-category %s%n: ",
                documentEntity.getCategory(), documentEntity.getSubCategory());
            System.out.printf("Entity content: %s%n: ", documentEntity.getContent());
            System.out.printf("Entity confidence: %.2f%n", documentEntity.getConfidence());
        });

        // Key-value pairs
        analyzeResult.getKeyValuePairs().forEach(documentKeyValuePair -> {
            System.out.printf("Key content: %s%n", documentKeyValuePair.getKey().getContent());
            System.out.printf("Key content bounding region: %s%n",
                documentKeyValuePair.getKey().getBoundingRegions().toString());

            if (documentKeyValuePair.getValue() != null) {
                System.out.printf("Value content: %s%n", documentKeyValuePair.getValue().getContent());
                System.out.printf("Value content bounding region: %s%n", documentKeyValuePair.getValue().getBoundingRegions().toString());
            }
        });
    }
```

## Layout model

Extract text, selection marks, text styles, table structures, and bounding region coordinates from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocumentFromUrl` method and pass `prebuilt-layout` as the model Id. The returned value is an `AnalyzeResult` object containing data about the submitted document.
> * We've added the file URI value to the `documentUrl` variable in the main method.

#### Update the **FormRecognizer** class:

Add the following code to the `FormRecognizer` class. Make sure you update the key and endpoint variables with values from your Form Recognizer instance in the Azure portal:

```java
public static void main(String[] args) {

        DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
            .credential(new AzureKeyCredential(key))
            .endpoint(endpoint)
            .buildClient();

        String documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf";
        String modelId = "prebuilt-layout";

        SyncPoller < DocumentOperationResult, AnalyzeResult > analyzeLayoutResultPoller =
            client.beginAnalyzeDocumentFromUrl(modelId, documentUrl);

        AnalyzeResult analyzeLayoutResult = analyzeLayoutResultPoller.getFinalResult();

            // pages
            analyzeLayoutResult.getPages().forEach(documentPage -> {
                System.out.printf("Page has width: %.2f and height: %.2f, measured with unit: %s%n",
                    documentPage.getWidth(),
                    documentPage.getHeight(),
                    documentPage.getUnit());

            // lines
            documentPage.getLines().forEach(documentLine ->
                System.out.printf("Line %s is within a bounding box %s.%n",
                    documentLine.getContent(),
                    documentLine.getBoundingBox().toString()));

            // words
            documentPage.getWords().forEach(documentWord ->
                System.out.printf("Word '%s' has a confidence score of %.2f.%n",
                    documentWord.getContent(),
                    documentWord.getConfidence()));

            // selection marks
            documentPage.getSelectionMarks().forEach(documentSelectionMark ->
                System.out.printf("Selection mark is %s and is within a bounding box %s with confidence %.2f.%n",
                    documentSelectionMark.getState().toString(),
                    documentSelectionMark.getBoundingBox().toString(),
                    documentSelectionMark.getConfidence()));
        });

        // tables
        List < DocumentTable > tables = analyzeLayoutResult.getTables();
        for (int i = 0; i < tables.size(); i++) {
            DocumentTable documentTable = tables.get(i);
            System.out.printf("Table %d has %d rows and %d columns.%n", i, documentTable.getRowCount(),
                documentTable.getColumnCount());
            documentTable.getCells().forEach(documentTableCell -> {
                System.out.printf("Cell '%s', has row index %d and column index %d.%n", documentTableCell.getContent(),
                    documentTableCell.getRowIndex(), documentTableCell.getColumnIndex());
            });
            System.out.println();
        }
    }
```

## Prebuilt model

Extract and analyze data from common document types using a pre-trained model.

##### Choose a prebuilt model ID

You're not limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the model IDs for the prebuilt models currently supported by the Form Recognizer service:

* [**prebuilt-invoice**](../concept-invoice.md): extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* [**prebuilt-receipt**](../concept-receipt.md): extracts text and key information from receipts.
* [**prebuilt-idDocument**](../concept-id-document.md): extracts text and key information from driver licenses and international passports.
* [**prebuilt-businessCard**](../concept-business-card.md): extracts text and key information from business cards.

#### Try the prebuilt invoice model

> [!div class="checklist"]
>
> * We wll analyze an invoice using the prebuilt-invoice model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URL value to the `invoiceUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocuments` method and pass `PrebuiltModels.Invoice` as the model Id. The returned value is a `result` object containing data about the submitted document.
> * For simplicity, all the key-value pairs that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../concept-invoice.md#field-extraction) concept page.

#### Update the **FormRecognizer** class:

Replace the existing FormRecognizer class with the following code (be certain to update the key and endpoint variables with values from your Form Recognizer instance in the Azure portal):

```java

public class FormRecognizer {

    static final String key = "PASTE_YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY_HERE";
    static final String endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";

    public static void main(String[] args) {

        DocumentAnalysisClient documentAnalysisClient = new DocumentAnalysisClientBuilder()
            .credential(new AzureKeyCredential("{key}"))
            .endpoint("{endpoint}")
            .buildClient();

        String invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"
        String modelId = "prebuilt-invoice";

        PollerFlux < DocumentOperationResult, AnalyzeResult > analyzeInvoicePoller = client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", invoiceUrl);

        Mono < AnalyzeResult > analyzeInvoiceResultMono = analyzeInvoicePoller
            .last()
            .flatMap(pollResponse - > {
                if (pollResponse.getStatus().isComplete()) {
                    System.out.println("Polling completed successfully");
                    return pollResponse.getFinalResult();
                } else {
                    return Mono.error(new RuntimeException("Polling completed unsuccessfully with status:" +
                        pollResponse.getStatus()));
                }
            });

        analyzeInvoiceResultMono.subscribe(analyzeInvoiceResult - > {
            for (int i = 0; i < analyzeInvoiceResult.getDocuments().size(); i++) {
                AnalyzedDocument analyzedInvoice = analyzeInvoiceResult.getDocuments().get(i);
                Map < String, DocumentField > invoiceFields = analyzedInvoice.getFields();
                System.out.printf("----------- Analyzing invoice  %d -----------%n", i);
                DocumentField vendorNameField = invoiceFields.get("VendorName");
                if (vendorNameField != null) {
                    if (DocumentFieldType.STRING == vendorNameField.getType()) {
                        String merchantName = vendorNameField.getValueString();
                        System.out.printf("Vendor Name: %s, confidence: %.2f%n",
                            merchantName, vendorNameField.getConfidence());
                    }
                }

                DocumentField vendorAddressField = invoiceFields.get("VendorAddress");
                if (vendorAddressField != null) {
                    if (DocumentFieldType.STRING == vendorAddressField.getType()) {
                        String merchantAddress = vendorAddressField.getValueString();
                        System.out.printf("Vendor address: %s, confidence: %.2f%n",
                            merchantAddress, vendorAddressField.getConfidence());
                    }
                }

                DocumentField customerNameField = invoiceFields.get("CustomerName");
                if (customerNameField != null) {
                    if (DocumentFieldType.STRING == customerNameField.getType()) {
                        String merchantAddress = customerNameField.getValueString();
                        System.out.printf("Customer Name: %s, confidence: %.2f%n",
                            merchantAddress, customerNameField.getConfidence());
                    }
                }

                DocumentField customerAddressRecipientField = invoiceFields.get("CustomerAddressRecipient");
                if (customerAddressRecipientField != null) {
                    if (DocumentFieldType.STRING == customerAddressRecipientField.getType()) {
                        String customerAddr = customerAddressRecipientField.getValueString();
                        System.out.printf("Customer Address Recipient: %s, confidence: %.2f%n",
                            customerAddr, customerAddressRecipientField.getConfidence());
                    }
                }

                DocumentField invoiceIdField = invoiceFields.get("InvoiceId");
                if (invoiceIdField != null) {
                    if (DocumentFieldType.STRING == invoiceIdField.getType()) {
                        String invoiceId = invoiceIdField.getValueString();
                        System.out.printf("Invoice ID: %s, confidence: %.2f%n",
                            invoiceId, invoiceIdField.getConfidence());
                    }
                }

                DocumentField invoiceDateField = invoiceFields.get("InvoiceDate");
                if (customerNameField != null) {
                    if (DocumentFieldType.DATE == invoiceDateField.getType()) {
                        LocalDate invoiceDate = invoiceDateField.getValueDate();
                        System.out.printf("Invoice Date: %s, confidence: %.2f%n",
                            invoiceDate, invoiceDateField.getConfidence());
                    }
                }

                DocumentField invoiceTotalField = invoiceFields.get("InvoiceTotal");
                if (customerAddressRecipientField != null) {
                    if (DocumentFieldType.FLOAT == invoiceTotalField.getType()) {
                        Float invoiceTotal = invoiceTotalField.getValueFloat();
                        System.out.printf("Invoice Total: %.2f, confidence: %.2f%n",
                            invoiceTotal, invoiceTotalField.getConfidence());
                    }
                }

                DocumentField invoiceItemsField = invoiceFields.get("Items");
                if (invoiceItemsField != null) {
                    System.out.printf("Invoice Items: %n");
                    if (DocumentFieldType.LIST == invoiceItemsField.getType()) {
                        List < DocumentField > invoiceItems = invoiceItemsField.getValueList();
                        invoiceItems.stream()
                            .filter(invoiceItem - > DocumentFieldType.MAP == invoiceItem.getType())
                            .map(formField - > formField.getValueMap())
                            .forEach(formFieldMap - > formFieldMap.forEach((key, formField) - > {
                                // See a full list of fields found on an invoice here:
                                // https://aka.ms/formrecognizer/invoicefields
                                if ("Description".equals(key)) {
                                    if (DocumentFieldType.STRING == formField.getType()) {
                                        String name = formField.getValueString();
                                        System.out.printf("Description: %s, confidence: %.2fs%n",
                                            name, formField.getConfidence());
                                    }
                                }
                                if ("Quantity".equals(key)) {
                                    if (DocumentFieldType.FLOAT == formField.getType()) {
                                        Float quantity = formField.getValueFloat();
                                        System.out.printf("Quantity: %f, confidence: %.2f%n",
                                            quantity, formField.getConfidence());
                                    }
                                }
                                if ("UnitPrice".equals(key)) {
                                    if (DocumentFieldType.FLOAT == formField.getType()) {
                                        Float unitPrice = formField.getValueFloat();
                                        System.out.printf("Unit Price: %f, confidence: %.2f%n",
                                            unitPrice, formField.getConfidence());
                                    }
                                }
                                if ("ProductCode".equals(key)) {
                                    if (DocumentFieldType.FLOAT == formField.getType()) {
                                        Float productCode = formField.getValueFloat();
                                        System.out.printf("Product Code: %f, confidence: %.2f%n",
                                            productCode, formField.getConfidence());
                                    }
                                }
                            }));
                    }
                }
            }
        });
    }
}

```

## Build and run your application

Navigate back to your main project directory—**form-recognizer-app**.

1. Build your application with the `build` command:

```console
gradle build
```

1. Run your application with the `run` command:

```console
gradle run
```

That's it, congratulations!

In this quickstart, you used the Form Recognizer Java SDK to analyze various forms and documents in different ways. Next, explore the reference documentation to learn about Form Recognizer API in more depth.

## Next steps

> [!div class="nextstepaction"]
> [REST API v3.0 reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)

> [!div class="nextstepaction"]
> [Form Recognizer Java library reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0-beta.1/index.html)
