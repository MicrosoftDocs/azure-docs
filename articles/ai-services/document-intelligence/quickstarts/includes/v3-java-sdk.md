---
title: "Quickstart: Document Intelligence (formerly Form Recognizer) Java SDK (beta) | v3.1 | v3.0"
titleSuffix: Azure AI services
description: Form and document processing, data extraction, and analysis using Document Intelligence Java client library SDKs v3.1 or v3.0 
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/17/2023
ms.author: lajanuar
---
<!-- markdownlint-disable MD025 -->

[Client library](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-stable&preserve-view=true) | [SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.1.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer/4.1.0) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples#readme)| [Supported REST API versions](../../sdk-overview-v3-1.md)

In this quickstart you'll, use the following features to analyze and extract data and values from forms and documents:

* [**General document**](#general-document-model)—Analyze and extract text, tables, structure, key-value pairs.

* [**Layout**](#layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in documents, without the need to train a model.

* [**Prebuilt Invoice**](#prebuilt-model)—Analyze and extract common fields from specific document types using a pretrained model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. *See* [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using Visual Studio Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (JDK)](/java/openjdk/download#openjdk-17) version 8 or later. For more information, *see* [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk).

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. Later, you paste your key and endpoint into the code:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=quickstart&Section=prerequisites) -->

## Set up

### Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **doc-intel-app**, and navigate to it.

    ```console
    mkdir doc-intel-app && doc-intel-app
    ```

    ```powershell
    mkdir doc-intel-app; cd doc-intel-app
    ```

1. Run the `gradle init` command from your working directory. This command creates essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (doc-intel-app) by selecting **Return** or **Enter**.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=quickstart&Section=create-gradle-project) -->

### Install the client library

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

1. Open the project's *build.gradle.kts* file in your IDE. Copay and past the following code to include the client library as an `implementation` statement, along with the required plugins and settings.

    ```kotlin
    plugins {
        java
        application
    }
    application {
        mainClass.set("DocIntelligence")
    }
    repositories {
        mavenCentral()
    }
    dependencies {
        implementation group: 'com.azure', name: 'azure-ai-formrecognizer', version: '4.1.0'

    }
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with installing the client library.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=quickstart&Section=install-library) -->

## Create a Java application

To interact with the Document Intelligence service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Document Intelligence `endpoint`.

1. From the doc-intel-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

    You create the following directory structure:

    :::image type="content" source="../../media/quickstarts/java-directories-2.png" alt-text="Screenshot of Java directory structure":::

1. Navigate to the `java` directory and create a file named **`DocIntelligence.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item DocIntelligence.java**.

1. Open the `DocIntelligence.java` file and select one of the following code samples to copy and paste into your application:

    * [**General document**](#general-document-model)

    * [**Layout**](#layout-model)

    * [**Prebuilt Invoice**](#prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../ai-services/security-features.md).

## General document model

Extract text, tables, structure, and key-value pairs from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **document file at a URI**. You can use our [sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocumentFromUrl` method and pass `prebuilt-document` as the model Id. The returned value is an `AnalyzeResult` object containing data about the submitted document.
> * We've added the file URI value to the `documentUrl` variable in the main method.

**Add the following code sample to the `DocIntelligence.java` file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```java

import com.azure.ai.formrecognizer.*;

import com.azure.ai.formrecognizer.documentanalysis.models.*;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClient;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClientBuilder;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.polling.SyncPoller;

import java.io.IOException;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

public class FormRecognizer {

  // set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
  private static final String endpoint = "<your-endpoint>";
  private static final String key = "<your-key>";

  public static void main(String[] args) {

    // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
      .credential(new AzureKeyCredential(key))
      .endpoint(endpoint)
      .buildClient();

    // sample document
    String documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf";
    String modelId = "prebuilt-document";
    SyncPoller < OperationResult, AnalyzeResult > analyzeDocumentPoller =
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
        System.out.printf("Line %s is within a bounding polygon %s.%n",
          documentLine.getContent(),
          documentLine.getBoundingPolygon().toString()));

      // words
      documentPage.getWords().forEach(documentWord ->
        System.out.printf("Word %s has a confidence score of %.2f%n.",
          documentWord.getContent(),
          documentWord.getConfidence()));
    });

    // tables
    List < DocumentTable > tables = analyzeResult.getTables();
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
}
```
<!-- markdownlint-disable MD036 -->

**Build and run the application**

Once you've added a code sample to your application, navigate back to your main project directory—**doc-intel-app**.

1. Build your application with the `build` command:

    ```console
    gradle build
    ```

1. Run your application with the `run` command:

    ```console
    gradle run
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=quickstart&Section=build-run-general-document) -->

### General document model output

Here's a snippet of the expected output:

```console
Key content: For the Transition Period From
Key content bounding region: [com.azure.ai.formrecognizer.models.BoundingRegion@14c053c6]
Key content: to Commission File Number
Key content bounding region: [com.azure.ai.formrecognizer.models.BoundingRegion@6c2d4cc6]
Value content: 001-37845
Value content bounding region: [com.azure.ai.formrecognizer.models.BoundingRegion@30865a90]
Key content: (I.R.S. ID)
Key content bounding region: [com.azure.ai.formrecognizer.models.BoundingRegion@6134ac4a]
Value content: 91-1144442
Value content bounding region: [com.azure.ai.formrecognizer.models.BoundingRegion@777c9dc9]
Key content: Securities registered pursuant to Section 12(g) of the Act:
Key content bounding region: [com.azure.ai.formrecognizer.models.BoundingRegion@71b1a49c]
Value content: NONE
```

To view the entire output, visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/v3-java-sdk-general-document-output.md).

## Layout model

Extract text, selection marks, text styles, table structures, and bounding region coordinates from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **document file at a URI**. You can use our [sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocumentFromUrl` method and pass `prebuilt-layout` as the model Id. The returned value is an `AnalyzeResult` object containing data about the submitted document.
> * We've added the file URI value to the `documentUrl` variable in the main method.

**Add the following code sample to the `DocIntelligence.java` file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```java

import com.azure.ai.formrecognizer.*;

import com.azure.ai.formrecognizer.documentanalysis.models.*;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClient;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClientBuilder;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.polling.SyncPoller;

import java.io.IOException;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

public class FormRecognizer {

  // set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
  private static final String endpoint = "<your-endpoint>";
  private static final String key = "<your-key>";

  public static void main(String[] args) {

    // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
      .credential(new AzureKeyCredential(key))
      .endpoint(endpoint)
      .buildClient();

    // sample document
    String documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf";
    String modelId = "prebuilt-layout";

    SyncPoller < OperationResult, AnalyzeResult > analyzeLayoutResultPoller =
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
        System.out.printf("Line %s is within a bounding polygon %s.%n",
          documentLine.getContent(),
          documentLine.getBoundingPolygon().toString()));

      // words
      documentPage.getWords().forEach(documentWord ->
        System.out.printf("Word '%s' has a confidence score of %.2f%n",
          documentWord.getContent(),
          documentWord.getConfidence()));

      // selection marks
      documentPage.getSelectionMarks().forEach(documentSelectionMark ->
        System.out.printf("Selection mark is %s and is within a bounding polygon %s with confidence %.2f.%n",
          documentSelectionMark.getState().toString(),
          documentSelectionMark.getBoundingPolygon().toString(),
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
  // Utility function to get the bounding polygon coordinates
  private static String getBoundingCoordinates(List < Point > boundingPolygon) {
    return boundingPolygon.stream().map(point -> String.format("[%.2f, %.2f]", point.getX(),
      point.getY())).collect(Collectors.joining(", "));
  }
}

```

**Build and run the application**

Once you've added a code sample to your application, navigate back to your main project directory—**doc-intel-app**.

1. Build your application with the `build` command:

    ```console
    gradle build
    ```

1. Run your application with the `run` command:

    ```console
    gradle run
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=quickstart&Section=build-run-layout) -->

### Layout model output

Here's a snippet of the expected output:

```console
  Table 0 has 5 rows and 3 columns.
  Cell 'Title of each class', has row index 0 and column index 0.
  Cell 'Trading Symbol', has row index 0 and column index 1.
  Cell 'Name of exchange on which registered', has row index 0 and column index 2.
  Cell 'Common stock, $0.00000625 par value per share', has row index 1 and column index 0.
  Cell 'MSFT', has row index 1 and column index 1.
  Cell 'NASDAQ', has row index 1 and column index 2.
  Cell '2.125% Notes due 2021', has row index 2 and column index 0.
  Cell 'MSFT', has row index 2 and column index 1.
  Cell 'NASDAQ', has row index 2 and column index 2.
  Cell '3.125% Notes due 2028', has row index 3 and column index 0.
  Cell 'MSFT', has row index 3 and column index 1.
  Cell 'NASDAQ', has row index 3 and column index 2.
  Cell '2.625% Notes due 2033', has row index 4 and column index 0.
  Cell 'MSFT', has row index 4 and column index 1.
  Cell 'NASDAQ', has row index 4 and column index 2.
```

To view the entire output,visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/v3-java-sdk-layout-output.md).

## Prebuilt model

Analyze and extract common fields from specific document types using a prebuilt model. In this example, we analyze an invoice using the **prebuilt-invoice** model.

> [!TIP]
> You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. See [**model data extraction**](../../concept-model-overview.md#model-data-extraction).

> [!div class="checklist"]
>
> * Analyze an invoice using the prebuilt-invoice model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URL value to the `invoiceUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocuments` method and pass `PrebuiltModels.Invoice` as the model Id. The returned value is a `result` object containing data about the submitted document.
> * For simplicity, all the key-value pairs that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../../concept-invoice.md#field-extraction) concept page.

**Add the following code sample to the `DocIntelligence.java` file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```java

import com.azure.ai.formrecognizer.*;

import com.azure.ai.formrecognizer.documentanalysis.models.*;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClient;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClientBuilder;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.polling.SyncPoller;

import java.io.IOException;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

public class FormRecognizer {

  // set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
  private static final String endpoint = "<your-endpoint>";
  private static final String key = "<your-key>";

  public static void main(final String[] args) throws IOException {

    // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
      .credential(new AzureKeyCredential(key))
      .endpoint(endpoint)
      .buildClient();

    // sample document
    String modelId = "prebuilt-invoice";
    String invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

    SyncPoller < OperationResult, AnalyzeResult > analyzeInvoicePoller = client.beginAnalyzeDocumentFromUrl(modelId, invoiceUrl);

    AnalyzeResult analyzeInvoiceResult = analyzeInvoicePoller.getFinalResult();

    for (int i = 0; i < analyzeInvoiceResult.getDocuments().size(); i++) {
      AnalyzedDocument analyzedInvoice = analyzeInvoiceResult.getDocuments().get(i);
      Map < String, DocumentField > invoiceFields = analyzedInvoice.getFields();
      System.out.printf("----------- Analyzing invoice  %d -----------%n", i);
      DocumentField vendorNameField = invoiceFields.get("VendorName");
      if (vendorNameField != null) {
        if (DocumentFieldType.STRING == vendorNameField.getType()) {
          String merchantName = vendorNameField.getValueAsString();
          System.out.printf("Vendor Name: %s, confidence: %.2f%n",
            merchantName, vendorNameField.getConfidence());
        }
      }

      DocumentField vendorAddressField = invoiceFields.get("VendorAddress");
      if (vendorAddressField != null) {
        if (DocumentFieldType.STRING == vendorAddressField.getType()) {
          String merchantAddress = vendorAddressField.getValueAsString();
          System.out.printf("Vendor address: %s, confidence: %.2f%n",
            merchantAddress, vendorAddressField.getConfidence());
        }
      }

      DocumentField customerNameField = invoiceFields.get("CustomerName");
      if (customerNameField != null) {
        if (DocumentFieldType.STRING == customerNameField.getType()) {
          String merchantAddress = customerNameField.getValueAsString();
          System.out.printf("Customer Name: %s, confidence: %.2f%n",
            merchantAddress, customerNameField.getConfidence());
        }
      }

      DocumentField customerAddressRecipientField = invoiceFields.get("CustomerAddressRecipient");
      if (customerAddressRecipientField != null) {
        if (DocumentFieldType.STRING == customerAddressRecipientField.getType()) {
          String customerAddr = customerAddressRecipientField.getValueAsString();
          System.out.printf("Customer Address Recipient: %s, confidence: %.2f%n",
            customerAddr, customerAddressRecipientField.getConfidence());
        }
      }

      DocumentField invoiceIdField = invoiceFields.get("InvoiceId");
      if (invoiceIdField != null) {
        if (DocumentFieldType.STRING == invoiceIdField.getType()) {
          String invoiceId = invoiceIdField.getValueAsString();
          System.out.printf("Invoice ID: %s, confidence: %.2f%n",
            invoiceId, invoiceIdField.getConfidence());
        }
      }

      DocumentField invoiceDateField = invoiceFields.get("InvoiceDate");
      if (customerNameField != null) {
        if (DocumentFieldType.DATE == invoiceDateField.getType()) {
          LocalDate invoiceDate = invoiceDateField.getValueAsDate();
          System.out.printf("Invoice Date: %s, confidence: %.2f%n",
            invoiceDate, invoiceDateField.getConfidence());
        }
      }

      DocumentField invoiceTotalField = invoiceFields.get("InvoiceTotal");
      if (customerAddressRecipientField != null) {
        if (DocumentFieldType.DOUBLE == invoiceTotalField.getType()) {
          Double invoiceTotal = invoiceTotalField.getValueAsDouble();
          System.out.printf("Invoice Total: %.2f, confidence: %.2f%n",
            invoiceTotal, invoiceTotalField.getConfidence());
        }
      }

      DocumentField invoiceItemsField = invoiceFields.get("Items");
      if (invoiceItemsField != null) {
        System.out.printf("Invoice Items: %n");
        if (DocumentFieldType.LIST == invoiceItemsField.getType()) {
          List < DocumentField > invoiceItems = invoiceItemsField.getValueAsList();
          invoiceItems.stream()
            .filter(invoiceItem -> DocumentFieldType.MAP == invoiceItem.getType())
            .map(documentField -> documentField.getValueAsMap())
            .forEach(documentFieldMap -> documentFieldMap.forEach((key, documentField) -> {
              // See a full list of fields found on an invoice here:
              // https://aka.ms/formrecognizer/invoicefields
              if ("Description".equals(key)) {
                if (DocumentFieldType.STRING == documentField.getType()) {
                  String name = documentField.getValueAsString();
                  System.out.printf("Description: %s, confidence: %.2fs%n",
                    name, documentField.getConfidence());
                }
              }
              if ("Quantity".equals(key)) {
                if (DocumentFieldType.DOUBLE == documentField.getType()) {
                  Double quantity = documentField.getValueAsDouble();
                  System.out.printf("Quantity: %f, confidence: %.2f%n",
                    quantity, documentField.getConfidence());
                }
              }
              if ("UnitPrice".equals(key)) {
                if (DocumentFieldType.DOUBLE == documentField.getType()) {
                  Double unitPrice = documentField.getValueAsDouble();
                  System.out.printf("Unit Price: %f, confidence: %.2f%n",
                    unitPrice, documentField.getConfidence());
                }
              }
              if ("ProductCode".equals(key)) {
                if (DocumentFieldType.DOUBLE == documentField.getType()) {
                  Double productCode = documentField.getValueAsDouble();
                  System.out.printf("Product Code: %f, confidence: %.2f%n",
                    productCode, documentField.getConfidence());
                }
              }
            }));
        }
      }
    }
  }
}
```

**Build and run the application**

Once you've added a code sample to your application, navigate back to your main project directory—**doc-intel-app**.

1. Build your application with the `build` command:

    ```console
    gradle build
    ```

1. Run your application with the `run` command:

    ```console
    gradle run
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=quickstart&Section=build-run-prebuilt) -->

### Prebuilt model output

Here's a snippet of the expected output:

```console
  ----------- Analyzing invoice  0 -----------
  Analyzed document has doc type invoice with confidence : 1.00
  Vendor Name: CONTOSO LTD., confidence: 0.92
  Vendor address: 123 456th St New York, NY, 10001, confidence: 0.91
  Customer Name: MICROSOFT CORPORATION, confidence: 0.84
  Customer Address Recipient: Microsoft Corp, confidence: 0.92
  Invoice ID: INV-100, confidence: 0.97
  Invoice Date: 2019-11-15, confidence: 0.97
```

To view the entire output, visit the Azure samples repository on GitHub to view the [prebuilt invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/v3-java-sdk-prebuilt-invoice-output.md)
