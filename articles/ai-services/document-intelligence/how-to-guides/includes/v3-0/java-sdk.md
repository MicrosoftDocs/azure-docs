---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for Java (REST API v3.0)"
description: 'Use the Document Intelligence SDK for Java (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/21/2023
ms.author: lajanuar
ms.custom:
  - devx-track-csharp
  - ignite-2023
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!NOTE]
>
> This project targets Document Intelligence REST API version 3.1.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Package (Maven)](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)| [Supported REST API versions](../../../sdk-overview-v3-1.md)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. See [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  - Visual Studio Code offers a *Coding Pack for Java* for Windows and macOS. The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  - If you're using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

  If you aren't using Visual Studio Code, make sure you have the following installed in your development environment:

  - A [**Java Development Kit** (JDK)](/java/openjdk/download#openjdk-17) version 8 or later. For more information, see [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk).
  - [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

- An Azure AI services or Document Intelligence resource. Create a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a Document Intelligence resource." target="_blank">single-service</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a multiple Document Intelligence resource." target="_blank">multi-service</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

  > [!TIP]
  > Create an Azure AI services resource if you plan to access multiple Azure AI services by using a single endpoint and key. For Document Intelligence access only, create a Document Intelligence resource. You need a single-service resource if you intend to use [Microsoft Entra authentication](../../../../../active-directory/authentication/overview-authentication.md).

- The key and endpoint from the resource you create to connect your application to the Azure Document Intelligence service.

  1. After your resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in this article.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

- A document file at a URL. For this project, you can use the sample forms provided in the following table for each feature:

  | Feature   | modelID   | document-url |
  | --- | --- |--|
  | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
  | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
  | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
  | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
  | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
  | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=prerequisites) -->

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Set up your programming environment

To set up your programming environment, create a Gradle project and install the client library.

### Create a Gradle project

1. In a console window, create a directory for your app called *form-recognizer-app* and navigate to it.

   ```console
   mkdir form-recognizer-app
   cd form-recognizer-app
   ```

1. Run the `gradle init` command from your working directory. This command creates essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select *Kotlin*.

1. Select **Enter** to accept the default project name, *form-recognizer-app*.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue creating a gradle project.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=create-gradle-project) -->

### Install the client library

This article uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

1. Open the project's *build.gradle.kts* file in your IDE. Copy and paste the following code to include the client library as an `implementation` statement, along with the required plugins and settings.

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
        implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "4.0.0")
    }
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue installing the client library.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=install-client-library.) -->

## Create a Java application

To interact with the Document Intelligence service, create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Document Intelligence `endpoint`.

1. From the *form-recognizer-app* directory, run the following command:

   ```console
   mkdir -p src/main/java
   ```

   You create the following directory structure:

   :::image type="content" source="../../../media/quickstarts/java-directories-2.png" alt-text="Screenshot of Java directory structure":::

1. Navigate to the `java` directory and create a file named *FormRecognizer.java*.

   > [!TIP]
   >
   > You can create a new file by using PowerShell. Open a PowerShell window in your project directory by holding down the **Shift** key and right-clicking the folder, then type the following command: *New-Item FormRecognizer.java*.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue creating the Java application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=create-java-app) -->

1. Open the *FormRecognizer.java* file and select one of the following code samples to copy and paste into your application:

   - The [prebuilt-read](#use-the-read-model) model is at the core of all Document Intelligence models and can detect lines, words, locations, and languages. The layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.
   - The [prebuilt-layout](#use-the-layout-model) model extracts text and text locations, tables, selection marks, and structure information from documents and images.
   - The [prebuilt-tax.us.w2](#use-the-w-2-tax-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.
   - The [prebuilt-invoice](#use-the-invoice-model) model extracts key fields and line items from sales invoices in various formats.
   - The [prebuilt-receipt](#use-the-receipt-model) model extracts key information from printed and handwritten sales receipts.
   - The [prebuilt-idDocument](#use-the-id-document-model) model extracts key information from US Drivers Licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident cards or *green cards*.

1. Type the following commands:

   ```console
   gradle build
   gradle -PmainClass=FormRecognizer run
   ```

## Use the Read model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

//sample document
String documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png";

String modelId = "prebuilt-read";

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
    System.out.printf("Word '%s' has a confidence score of %.2f.%n",
      documentWord.getContent(),
      documentWord.getConfidence()));
});
}
}
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-read) -->

Visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/read-model-output.md).

## Use the Layout model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

//sample document
String layoutDocumentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png";
String modelId = "prebuilt-layout";

SyncPoller < OperationResult, AnalyzeResult > analyzeLayoutResultPoller =
  client.beginAnalyzeDocumentFromUrl(modelId, layoutDocumentUrl);

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
    System.out.printf("Selection mark is '%s' and is within a bounding polygon %s with confidence %.2f.%n",
      documentSelectionMark.getSelectionMarkState().toString(),
      getBoundingCoordinates(documentSelectionMark.getBoundingPolygon()),
      documentSelectionMark.getConfidence()));
});

// tables
List < DocumentTable > tables = analyzeLayoutResult.getTables();
for (int i = 0; i < tables.size(); i++) {
  DocumentTable documentTables = tables.get(i);
  System.out.printf("Table %d has %d rows and %d columns.%n", i, documentTables.getRowCount(),
    documentTables.getColumnCount());
  documentTables.getCells().forEach(documentTableCell -> {
    System.out.printf("Cell '%s', has row index %d and column index %d.%n", documentTableCell.getContent(),
      documentTableCell.getRowIndex(), documentTableCell.getColumnIndex());
  });
  System.out.println();
}

}

// Utility function to get the bounding polygon coordinates.
private static String getBoundingCoordinates(List < Point > boundingPolygon) {
  return boundingPolygon.stream().map(point -> String.format("[%.2f, %.2f]", point.getX(),
    point.getY())).collect(Collectors.joining(", "));
}

}
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-layout) -->

Visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/layout-model-output.md).

## Use the General document model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

//sample document
String generalDocumentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf";
String modelId = "prebuilt-document";
SyncPoller < OperationResult, AnalyzeResult > analyzeDocumentPoller =
  client.beginAnalyzeDocumentFromUrl(modelId, generalDocumentUrl);

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
List < DocumentTable > tab_les = analyzeResult.getTables();
for (int i = 0; i < tab_les.size(); i++) {
  DocumentTable documentTable = tab_les.get(i);
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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-general-document) -->

Visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/general-document-model-output.md).

## Use the W-2 tax model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

// sample document
String w2Url = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png";
String modelId = "prebuilt-tax.us.w2";

SyncPoller < OperationResult, AnalyzeResult > analyzeW2Poller =
  client.beginAnalyzeDocumentFromUrl(modelId, w2Url);

AnalyzeResult analyzeTaxResult = analyzeW2Poller.getFinalResult();

for (int i = 0; i < analyzeTaxResult.getDocuments().size(); i++) {
  AnalyzedDocument analyzedTaxDocument = analyzeTaxResult.getDocuments().get(i);
  Map < String, DocumentField > taxFields = analyzedTaxDocument.getFields();
  System.out.printf("----------- Analyzing Document  %d -----------%n", i);
  DocumentField w2FormVariantField = taxFields.get("W2FormVariant");
  if (w2FormVariantField != null) {
    if (DocumentFieldType.STRING == w2FormVariantField.getType()) {
      String merchantName = w2FormVariantField.getValueAsString();
      System.out.printf("Form variant: %s, confidence: %.2f%n",
        merchantName, w2FormVariantField.getConfidence());
    }
  }

  DocumentField employeeField = taxFields.get("Employee");
  if (employeeField != null) {
    System.out.println("Employee Data: ");
    if (DocumentFieldType.MAP == employeeField.getType()) {
      Map < String, DocumentField > employeeDataFieldMap = employeeField.getValueAsMap();
      DocumentField employeeName = employeeDataFieldMap.get("Name");
      if (employeeName != null) {
        if (DocumentFieldType.STRING == employeeName.getType()) {
          String employeesName = employeeName.getValueAsString();
          System.out.printf("Employee Name: %s, confidence: %.2f%n",
            employeesName, employeeName.getConfidence());
        }
      }
      DocumentField employeeAddrField = employeeDataFieldMap.get("Address");
      if (employeeAddrField != null) {
        if (DocumentFieldType.STRING == employeeAddrField.getType()) {
          String employeeAddress = employeeAddrField.getValueAsString();
          System.out.printf("Employee Address: %s, confidence: %.2f%n",
            employeeAddress, employeeAddrField.getConfidence());
        }
      }
    }
  }

  DocumentField employerField = taxFields.get("Employer");
  if (employerField != null) {
    System.out.println("Employer Data: ");
    if (DocumentFieldType.MAP == employerField.getType()) {
      Map < String, DocumentField > employerDataFieldMap = employerField.getValueAsMap();
      DocumentField employerNameField = employerDataFieldMap.get("Name");
      if (employerNameField != null) {
        if (DocumentFieldType.STRING == employerNameField.getType()) {
          String employerName = employerNameField.getValueAsString();
          System.out.printf("Employer Name: %s, confidence: %.2f%n",
            employerName, employerNameField.getConfidence());
        }
      }

      DocumentField employerIDNumberField = employerDataFieldMap.get("IdNumber");
      if (employerIDNumberField != null) {
        if (DocumentFieldType.STRING == employerIDNumberField.getType()) {
          String employerIdNumber = employerIDNumberField.getValueAsString();
          System.out.printf("Employee ID Number: %s, confidence: %.2f%n",
            employerIdNumber, employerIDNumberField.getConfidence());
        }
      }
    }
  }

  DocumentField taxYearField = taxFields.get("TaxYear");
  if (taxYearField != null) {
    if (DocumentFieldType.STRING == taxYearField.getType()) {
      String taxYear = taxYearField.getValueAsString();
      System.out.printf("Tax year: %s, confidence: %.2f%n",
        taxYear, taxYearField.getConfidence());
    }
  }

  DocumentField taxDateField = taxFields.get("TaxDate");
  if (taxDateField != null) {
    if (DocumentFieldType.DATE == taxDateField.getType()) {
      LocalDate taxDate = taxDateField.getValueAsDate();
      System.out.printf("Tax Date: %s, confidence: %.2f%n",
        taxDate, taxDateField.getConfidence());
    }
  }

  DocumentField socialSecurityTaxField = taxFields.get("SocialSecurityTaxWithheld");
  if (socialSecurityTaxField != null) {
    if (DocumentFieldType.DOUBLE == socialSecurityTaxField.getType()) {
      Double socialSecurityTax = socialSecurityTaxField.getValueAsDouble();
      System.out.printf("Social Security Tax withheld: %.2f, confidence: %.2f%n",
        socialSecurityTax, socialSecurityTaxField.getConfidence());
    }
  }
}
}
}
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-w2-tax) -->

Visit the Azure samples repository on GitHub to view the [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/w2-tax-model-output.md).

## Use the Invoice model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

// sample document
String invoiceUrl = "https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf";
String modelId = "prebuilt-invoice";

SyncPoller < OperationResult, AnalyzeResult > analyzeInvoicesPoller =
  client.beginAnalyzeDocumentFromUrl(modelId, invoiceUrl);

AnalyzeResult analyzeInvoiceResult = analyzeInvoicesPoller.getFinalResult();

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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-invoice) -->

Visit the Azure samples repository on GitHub to view the [invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/invoice-model-output.md).

## Use the Receipt-model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

String receiptUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png";
String modelId = "prebuilt-receipt";

SyncPoller < OperationResult, AnalyzeResult > analyzeReceiptPoller =
  client.beginAnalyzeDocumentFromUrl(modelId, receiptUrl);

AnalyzeResult receiptResults = analyzeReceiptPoller.getFinalResult();

for (int i = 0; i < receiptResults.getDocuments().size(); i++) {
  AnalyzedDocument analyzedReceipt = receiptResults.getDocuments().get(i);
  Map < String, DocumentField > receiptFields = analyzedReceipt.getFields();
  System.out.printf("----------- Analyzing receipt info %d -----------%n", i);
  DocumentField merchantNameField = receiptFields.get("MerchantName");
  if (merchantNameField != null) {
    if (DocumentFieldType.STRING == merchantNameField.getType()) {
      String merchantName = merchantNameField.getValueAsString();
      System.out.printf("Merchant Name: %s, confidence: %.2f%n",
        merchantName, merchantNameField.getConfidence());
    }
  }

  DocumentField merchantPhoneNumberField = receiptFields.get("MerchantPhoneNumber");
  if (merchantPhoneNumberField != null) {
    if (DocumentFieldType.PHONE_NUMBER == merchantPhoneNumberField.getType()) {
      String merchantAddress = merchantPhoneNumberField.getValueAsPhoneNumber();
      System.out.printf("Merchant Phone number: %s, confidence: %.2f%n",
        merchantAddress, merchantPhoneNumberField.getConfidence());
    }
  }

  DocumentField merchantAddressField = receiptFields.get("MerchantAddress");
  if (merchantAddressField != null) {
    if (DocumentFieldType.STRING == merchantAddressField.getType()) {
      String merchantAddress = merchantAddressField.getValueAsString();
      System.out.printf("Merchant Address: %s, confidence: %.2f%n",
        merchantAddress, merchantAddressField.getConfidence());
    }
  }

  DocumentField transactionDateField = receiptFields.get("TransactionDate");
  if (transactionDateField != null) {
    if (DocumentFieldType.DATE == transactionDateField.getType()) {
      LocalDate transactionDate = transactionDateField.getValueAsDate();
      System.out.printf("Transaction Date: %s, confidence: %.2f%n",
        transactionDate, transactionDateField.getConfidence());
    }
  }

  DocumentField receiptItemsField = receiptFields.get("Items");
  if (receiptItemsField != null) {
    System.out.printf("Receipt Items: %n");
    if (DocumentFieldType.LIST == receiptItemsField.getType()) {
      List < DocumentField > receiptItems = receiptItemsField.getValueAsList();
      receiptItems.stream()
        .filter(receiptItem -> DocumentFieldType.MAP == receiptItem.getType())
        .map(documentField -> documentField.getValueAsMap())
        .forEach(documentFieldMap -> documentFieldMap.forEach((key, documentField) -> {
          if ("Name".equals(key)) {
            if (DocumentFieldType.STRING == documentField.getType()) {
              String name = documentField.getValueAsString();
              System.out.printf("Name: %s, confidence: %.2fs%n",
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
          if ("Price".equals(key)) {
            if (DocumentFieldType.DOUBLE == documentField.getType()) {
              Double price = documentField.getValueAsDouble();
              System.out.printf("Price: %f, confidence: %.2f%n",
                price, documentField.getConfidence());
            }
          }
          if ("TotalPrice".equals(key)) {
            if (DocumentFieldType.DOUBLE == documentField.getType()) {
              Double totalPrice = documentField.getValueAsDouble();
              System.out.printf("Total Price: %f, confidence: %.2f%n",
                totalPrice, documentField.getConfidence());
            }
          }
        }));
    }
  }
}
}
}
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-receipt) -->

Visit the Azure samples repository on GitHub to view the [receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/receipt-model-output.md).

## Use the ID document model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

//sample document
String licenseUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png";
String modelId = "prebuilt-idDocument";

SyncPoller < OperationResult, AnalyzeResult > analyzeIdentityDocumentPoller = client.beginAnalyzeDocumentFromUrl(modelId, licenseUrl);

AnalyzeResult identityDocumentResults = analyzeIdentityDocumentPoller.getFinalResult();

for (int i = 0; i < identityDocumentResults.getDocuments().size(); i++) {
  AnalyzedDocument analyzedIDDocument = identityDocumentResults.getDocuments().get(i);
  Map < String, DocumentField > licenseFields = analyzedIDDocument.getFields();
  System.out.printf("----------- Analyzed license info for page %d -----------%n", i);
  DocumentField addressField = licenseFields.get("Address");
  if (addressField != null) {
    if (DocumentFieldType.STRING == addressField.getType()) {
      String address = addressField.getValueAsString();
      System.out.printf("Address: %s, confidence: %.2f%n",
        address, addressField.getConfidence());
    }
  }

  DocumentField countryRegionDocumentField = licenseFields.get("CountryRegion");
  if (countryRegionDocumentField != null) {
    if (DocumentFieldType.STRING == countryRegionDocumentField.getType()) {
      String countryRegion = countryRegionDocumentField.getValueAsCountry();
      System.out.printf("Country or region: %s, confidence: %.2f%n",
        countryRegion, countryRegionDocumentField.getConfidence());
    }
  }

  DocumentField dateOfBirthField = licenseFields.get("DateOfBirth");
  if (dateOfBirthField != null) {
    if (DocumentFieldType.DATE == dateOfBirthField.getType()) {
      LocalDate dateOfBirth = dateOfBirthField.getValueAsDate();
      System.out.printf("Date of Birth: %s, confidence: %.2f%n",
        dateOfBirth, dateOfBirthField.getConfidence());
    }
  }

  DocumentField dateOfExpirationField = licenseFields.get("DateOfExpiration");
  if (dateOfExpirationField != null) {
    if (DocumentFieldType.DATE == dateOfExpirationField.getType()) {
      LocalDate expirationDate = dateOfExpirationField.getValueAsDate();
      System.out.printf("Document date of expiration: %s, confidence: %.2f%n",
        expirationDate, dateOfExpirationField.getConfidence());
    }
  }

  DocumentField documentNumberField = licenseFields.get("DocumentNumber");
  if (documentNumberField != null) {
    if (DocumentFieldType.STRING == documentNumberField.getType()) {
      String documentNumber = documentNumberField.getValueAsString();
      System.out.printf("Document number: %s, confidence: %.2f%n",
        documentNumber, documentNumberField.getConfidence());
    }
  }

  DocumentField firstNameField = licenseFields.get("FirstName");
  if (firstNameField != null) {
    if (DocumentFieldType.STRING == firstNameField.getType()) {
      String firstName = firstNameField.getValueAsString();
      System.out.printf("First Name: %s, confidence: %.2f%n",
        firstName, documentNumberField.getConfidence());
    }
  }

  DocumentField lastNameField = licenseFields.get("LastName");
  if (lastNameField != null) {
    if (DocumentFieldType.STRING == lastNameField.getType()) {
      String lastName = lastNameField.getValueAsString();
      System.out.printf("Last name: %s, confidence: %.2f%n",
        lastName, lastNameField.getConfidence());
    }
  }

  DocumentField regionField = licenseFields.get("Region");
  if (regionField != null) {
    if (DocumentFieldType.STRING == regionField.getType()) {
      String region = regionField.getValueAsString();
      System.out.printf("Region: %s, confidence: %.2f%n",
        region, regionField.getConfidence());
    }
  }
}
}
}
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-id-document) -->

Visit the Azure samples repository on GitHub to view the [ID document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/id-document-output.md).

## Use the Business card model

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
  //use your `key` and `endpoint` environment variables
  private static final String key = System.getenv("FR_KEY");
  private static final String endpoint = System.getenv("FR_ENDPOINT");

  public static void main(final String[] args) {

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();

//sample document
String businessCardUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg";
String modelId = "prebuilt-businessCard";

SyncPoller < OperationResult, AnalyzeResult > analyzeBusinessCardPoller = client.beginAnalyzeDocumentFromUrl(modelId, businessCardUrl);

AnalyzeResult businessCardPageResults = analyzeBusinessCardPoller.getFinalResult();

for (int i = 0; i < businessCardPageResults.getDocuments().size(); i++) {
  System.out.printf("--------Analyzing business card %d -----------%n", i);
  AnalyzedDocument analyzedBusinessCard = businessCardPageResults.getDocuments().get(i);
  Map < String, DocumentField > businessCardFields = analyzedBusinessCard.getFields();
  DocumentField contactNamesDocumentField = businessCardFields.get("ContactNames");
  if (contactNamesDocumentField != null) {
    if (DocumentFieldType.LIST == contactNamesDocumentField.getType()) {
      List < DocumentField > contactNamesList = contactNamesDocumentField.getValueAsList();
      contactNamesList.stream()
        .filter(contactName -> DocumentFieldType.MAP == contactName.getType())
        .map(contactName -> {
          System.out.printf("Contact name: %s%n", contactName.getContent());
          return contactName.getValueAsMap();
        })
        .forEach(contactNamesMap -> contactNamesMap.forEach((key, contactName) -> {
          if ("FirstName".equals(key)) {
            if (DocumentFieldType.STRING == contactName.getType()) {
              String firstName = contactName.getValueAsString();
              System.out.printf("\tFirst Name: %s, confidence: %.2f%n",
                firstName, contactName.getConfidence());
            }
          }
          if ("LastName".equals(key)) {
            if (DocumentFieldType.STRING == contactName.getType()) {
              String lastName = contactName.getValueAsString();
              System.out.printf("\tLast Name: %s, confidence: %.2f%n",
                lastName, contactName.getConfidence());
            }
          }
        }));
    }
  }

  DocumentField jobTitles = businessCardFields.get("JobTitles");
  if (jobTitles != null) {
    if (DocumentFieldType.LIST == jobTitles.getType()) {
      List < DocumentField > jobTitlesItems = jobTitles.getValueAsList();
      jobTitlesItems.forEach(jobTitlesItem -> {
        if (DocumentFieldType.STRING == jobTitlesItem.getType()) {
          String jobTitle = jobTitlesItem.getValueAsString();
          System.out.printf("Job Title: %s, confidence: %.2f%n",
            jobTitle, jobTitlesItem.getConfidence());
        }
      });
    }
  }

  DocumentField departments = businessCardFields.get("Departments");
  if (departments != null) {
    if (DocumentFieldType.LIST == departments.getType()) {
      List < DocumentField > departmentsItems = departments.getValueAsList();
      departmentsItems.forEach(departmentsItem -> {
        if (DocumentFieldType.STRING == departmentsItem.getType()) {
          String department = departmentsItem.getValueAsString();
          System.out.printf("Department: %s, confidence: %.2f%n",
            department, departmentsItem.getConfidence());
        }
      });
    }
  }

  DocumentField emails = businessCardFields.get("Emails");
  if (emails != null) {
    if (DocumentFieldType.LIST == emails.getType()) {
      List < DocumentField > emailsItems = emails.getValueAsList();
      emailsItems.forEach(emailsItem -> {
        if (DocumentFieldType.STRING == emailsItem.getType()) {
          String email = emailsItem.getValueAsString();
          System.out.printf("Email: %s, confidence: %.2f%n", email, emailsItem.getConfidence());
        }
      });
    }
  }

  DocumentField websites = businessCardFields.get("Websites");
  if (websites != null) {
    if (DocumentFieldType.LIST == websites.getType()) {
      List < DocumentField > websitesItems = websites.getValueAsList();
      websitesItems.forEach(websitesItem -> {
        if (DocumentFieldType.STRING == websitesItem.getType()) {
          String website = websitesItem.getValueAsString();
          System.out.printf("Web site: %s, confidence: %.2f%n",
            website, websitesItem.getConfidence());
        }
      });
    }
  }

  DocumentField mobilePhones = businessCardFields.get("MobilePhones");
  if (mobilePhones != null) {
    if (DocumentFieldType.LIST == mobilePhones.getType()) {
      List < DocumentField > mobilePhonesItems = mobilePhones.getValueAsList();
      mobilePhonesItems.forEach(mobilePhonesItem -> {
        if (DocumentFieldType.PHONE_NUMBER == mobilePhonesItem.getType()) {
          String mobilePhoneNumber = mobilePhonesItem.getValueAsPhoneNumber();
          System.out.printf("Mobile phone number: %s, confidence: %.2f%n",
            mobilePhoneNumber, mobilePhonesItem.getConfidence());
        }
      });
    }
  }

  DocumentField otherPhones = businessCardFields.get("OtherPhones");
  if (otherPhones != null) {
    if (DocumentFieldType.LIST == otherPhones.getType()) {
      List < DocumentField > otherPhonesItems = otherPhones.getValueAsList();
      otherPhonesItems.forEach(otherPhonesItem -> {
        if (DocumentFieldType.PHONE_NUMBER == otherPhonesItem.getType()) {
          String otherPhoneNumber = otherPhonesItem.getValueAsPhoneNumber();
          System.out.printf("Other phone number: %s, confidence: %.2f%n",
            otherPhoneNumber, otherPhonesItem.getConfidence());
        }
      });
    }
  }

  DocumentField faxes = businessCardFields.get("Faxes");
  if (faxes != null) {
    if (DocumentFieldType.LIST == faxes.getType()) {
      List < DocumentField > faxesItems = faxes.getValueAsList();
      faxesItems.forEach(faxesItem -> {
        if (DocumentFieldType.PHONE_NUMBER == faxesItem.getType()) {
          String faxPhoneNumber = faxesItem.getValueAsPhoneNumber();
          System.out.printf("Fax phone number: %s, confidence: %.2f%n",
            faxPhoneNumber, faxesItem.getConfidence());
        }
      });
    }
  }

  DocumentField addresses = businessCardFields.get("Addresses");
  if (addresses != null) {
    if (DocumentFieldType.LIST == addresses.getType()) {
      List < DocumentField > addressesItems = addresses.getValueAsList();
      addressesItems.forEach(addressesItem -> {
        if (DocumentFieldType.STRING == addressesItem.getType()) {
          String address = addressesItem.getValueAsString();
          System.out
            .printf("Address: %s, confidence: %.2f%n", address, addressesItem.getConfidence());
        }
      });
    }
  }

  DocumentField companyName = businessCardFields.get("CompanyNames");
  if (companyName != null) {
    if (DocumentFieldType.LIST == companyName.getType()) {
      List < DocumentField > companyNameItems = companyName.getValueAsList();
      companyNameItems.forEach(companyNameItem -> {
        if (DocumentFieldType.STRING == companyNameItem.getType()) {
          String companyNameValue = companyNameItem.getValueAsString();
          System.out.printf("Company name: %s, confidence: %.2f%n", companyNameValue,
            companyNameItem.getConfidence());
        }
      });
    }
  }
}
}
}
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=java&Product=FormRecognizer&Page=how-to&Section=run-business-card) -->

Visit the Azure samples repository on GitHub to view the [business card model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/how-to-guide/business-card-model-output.md).
