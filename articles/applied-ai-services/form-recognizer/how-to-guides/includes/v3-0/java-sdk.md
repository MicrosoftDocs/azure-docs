---
title: "Use Form Recognizer SDK for Java (REST API v3.0)"
description: 'Use the Form Recognizer SDK for Java (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/16/2022
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Form Recognizer REST API version **3.0**.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (Maven)](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)| [Supported REST API versions](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. *See* [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using VS Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (JDK)](/java/openjdk/download#openjdk-17) version 8 or later. For more information, *see* [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk).

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. Later, you'll paste your key and endpoint into the code below:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* You'll need a document file at a URL. For this project, you can use the sample forms provided in the table below for each feature:

    **Sample documents**

    | **Feature**   | **{modelID}**   | **{document-url}** |
    | --- | --- |--|
    | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
    | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
    | **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
    | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
    | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
    | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
    | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
    | **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

## Set up

### Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **form-recognizer-app**, and navigate to it.

    ```console
    mkdir form-recognizer-app && form-recognizer-app
    ```

    ```powershell
    mkdir translator-text-app; cd translator-text-app
   ```

1. Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (form-recognizer-app) by selecting **Return** or **Enter**.

### Install the client library

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
        implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "4.0.0")
    }
    ```

## Create a Java application

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

1. From the form-recognizer-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

    You'll create the following directory structure:

    :::image type="content" source="../../media/quickstarts/java-directories-2.png" alt-text="Screenshot: Java directory structure":::

1. Navigate to the `java` directory and create a file named **`FormRecognizer.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item FormRecognizer.java**.

## Read model

The [prebuilt-read](../../../concept-read.md) model is at the core of all Form Recognizer models and can detect lines, words, locations, and languages. Layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.

## Layout model

The [prebuilt-layout](../../../concept-layout.md) model extracts text and text locations, tables, selection marks, and structure information from documents and images.

## General document model

The [prebuilt-document](../../../concept-general-document.md) model extracts key-value pairs, tables, and selection marks from documents and can be used as an alternative to training a custom model without labels.

## W2 model

The [prebuilt-tax.us.w2](../../../concept-w2.md) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

## Invoice model

The [prebuilt-invoice](../../../concept-invoice.md) model extracts key fields and line items from sales invoices of various formats and quality including phone-captured images, scanned documents, and digital PDFs.

## Receipt-model

The [prebuilt-receipt](../../../concept-receipt.md) model extracts key information from printed and handwritten sales receipts.

## ID document model

The [prebuilt-idDocument](../../../concept-id-document.md) model extracts key information from US Drivers Licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident (green) cards.

## Business card model

The [prebuilt-businessCard](../../../concept-business-card.md) model extracts key information from business card images.