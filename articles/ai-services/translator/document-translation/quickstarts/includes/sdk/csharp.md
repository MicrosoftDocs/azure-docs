---
title: "Quickstart: Document Translation C# SDK"
description: 'Document Translation processing using the C# SDK'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->

## Build your application

There are several tools available for creating, building, and running Translator C#/.NET applications. Here, we guide you through using either the command-line interface (CLI) or Visual Studio. Select one of following tabs to get started:

# [.NET CLI](#tab/dotnet)

## Set up your project

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `batch-document-translation`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```console
dotnet new console -n batch-document-translation
```

Change your directory to the newly created app folder. Build your application with the following command:

```console
dotnet build
```

The build output should contain no warnings or errors.

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

### Install the client library

Within the application directory, install the Document Translation client library for .NET:

```console
dotnet add package Azure.AI.Translation.Document --version 1.0.0
```

### Translate a document or batch files

1. For this project, you need a **source document** uploaded to your **source container**. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.pdf) for this quickstart. The source language is English.

1. From the project directory, open the **Program.cs** file in your preferred editor or IDE. Delete the pre-existing code, including the line `Console.WriteLine("Hello World!")`.

1. In the application's **Program.cs** , create variables for your key and custom endpoint. For more information, *see* [Retrieve your key and custom domain endpoint](../../../quickstarts/document-translation-rest-api.md#retrieve-your-key-and-document-translation-endpoint).

    ```csharp
    private static readonly string endpoint = "<your-document-translation-endpoint>";
    private static readonly string key = "<your-key>";
    ```

1. Call the `StartTranslationAsync` method to Start a translation operation for one or more documents in a single blob container.

1. To call `StartTranslationAsync`, you need to initialize a `DocumentTranslationInput` object that contains the `sourceUri`, `targetUri`, and `targetLanguageCode` parameters:

    * For [**Managed Identity authorization**](../../../how-to-guides/create-use-managed-identities.md) create these variables:

      * **sourceUri**. The URL for the source container containing documents to be translated.
      * **targetUri** The URL for the target container to which the translated documents are written.
      * **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../../../../language-support.md) page.

        To find your source and target URLs, navigate to your storage account in the Azure portal. In the left sidebar, under  **Data storage** , select **Containers** and follow these steps to retrieve your source document(s) and target container URLS.

          |Source|Target|
          |------|-------|
          |1. Select the checkbox next to the source container|1. Select the checkbox next to the target container.|
          | 2. From the main window area, select a file or document(s) for translation.| 2. Select the ellipses located at the right, then choose **Properties**.|
          | 3. The source URL is located at the top of the Properties list.|3. The target URL is located at the top of the Properties list.|

    * For [**Shared Access Signature (SAS) authorization**](../../../how-to-guides/create-sas-tokens.md) create these variables

      * **sourceUri**. The SAS URI, with a SAS token appended as a query string, for the source container containing documents to be translated.
      * **targetUri** The SAS URI, with a SAS token appended as a query string,for the target container to which the translated documents are written.
      * **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../../../../language-support.md) page.

## Code sample

  > [!IMPORTANT]
  > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

**Enter the following code sample into your application's Program.cs file:**

```csharp

using Azure;
using Azure.AI.Translation.Document;
using System;
using System.Threading;
using System.Text;

class Program {

  // create variables for your custom endpoint and resource key
  private static readonly string endpoint = "<your-document-translation-endpoint>";
  private static readonly string key = "<your-key>";

  static async Task Main(string[] args) {

    // create variables for your sourceUrl, targetUrl, and targetLanguageCode
    Uri sourceUri = new Uri("<sourceUrl>");
    Uri targetUri = new Uri("<targetUrl>");
    string targetLanguage = "<targetLanguageCode>"

    // initialize a new instance  of the DocumentTranslationClient object to interact with the Document Translation feature
    DocumentTranslationClient client = new DocumentTranslationClient(new Uri(endpoint), new AzureKeyCredential(key));

    // initialize a new instance of the `DocumentTranslationInput` object to provide the location of input for the translation operation
    DocumentTranslationInput input = new DocumentTranslationInput(sourceUri, targetUri, targetLanguage);

    // initialize a new instance of the DocumentTranslationOperation class to track the status of the translation operation
    DocumentTranslationOperation operation = await client.StartTranslationAsync(input);

    await operation.WaitForCompletionAsync();

    Console.WriteLine($"  Status: {operation.Status}");
    Console.WriteLine($"  Created on: {operation.CreatedOn}");
    Console.WriteLine($"  Last modified: {operation.LastModified}");
    Console.WriteLine($"  Total documents: {operation.DocumentsTotal}");
    Console.WriteLine($"    Succeeded: {operation.DocumentsSucceeded}");
    Console.WriteLine($"    Failed: {operation.DocumentsFailed}");
    Console.WriteLine($"    In Progress: {operation.DocumentsInProgress}");
    Console.WriteLine($"    Not started: {operation.DocumentsNotStarted}");

    await foreach(DocumentStatusResult document in operation.Value) {
      Console.WriteLine($"Document with Id: {document.Id}");
      Console.WriteLine($"  Status:{document.Status}");
      if (document.Status == DocumentTranslationStatus.Succeeded) {
        Console.WriteLine($"  Translated Document Uri: {document.TranslatedDocumentUri}");
        Console.WriteLine($"  Translated to language: {document.TranslatedToLanguageCode}.");
        Console.WriteLine($"  Document source Uri: {document.SourceDocumentUri}");
      } else {
        Console.WriteLine($"  Error Code: {document.Error.Code}");
        Console.WriteLine($"  Message: {document.Error.Message}");
      }
    }
  }
}
```

## Run your application

Once you've added the code sample to your application, run your application from the project directory by typing the following command in your terminal:

```csharp
  dotnet run
```

Here's a snippet of the expected output:

  :::image type="content" source="../../../../media/quickstarts/c-sharp-output-document.png" alt-text="Screenshot of the Visual Studio Code output in the terminal window. ":::

### [Visual Studio](#tab/vs)

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD036 -->

## Set up your C#/.NET environment

For this quickstart, we use the latest version of [Visual Studio](https://visualstudio.microsoft.com/vs/) IDE to build and run the application.

1. Start Visual Studio.

1. On the **Get started** page, choose Create a new project.

    :::image type="content" source="../../../../media/quickstarts/get-started.png" alt-text="Screenshot of Visual Studio 2022 get started window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

     :::image type="content" source="../../../../media/quickstarts/create-project.png" alt-text="Screenshot of Visual Studio 2022 create new project page.":::

1. In the **Configure your new project** dialog window, enter `document-translation-sdk` in the Project name box. Then choose **Next**.

    :::image type="content" source="../../../../media/quickstarts/configure-new-project-document.png" alt-text="Screenshot of Visual Studio 2022 configure new project set-up window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../../../media/quickstarts/additional-information.png" alt-text="Screenshot of Visual Studio 2022 additional information set-up window.":::

## Install the client library with NuGet

1. Right-click on your Translator-text-sdk project and select **Manage NuGet Packages...**
   :::image type="content" source="../../../../media/quickstarts/manage-nuget-package-document.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

1. Select the **Browse** Tab and type **Azure.AI.Translation.Document**.

   :::image type="content" source="../../../../media/quickstarts/select-azure-package-document.png" alt-text="Screenshot of select `prerelease` NuGet package in Visual Studio.":::

1. Select and install the package in your project.

   :::image type="content" source="../../../../media/quickstarts/install-azure-package-document.png" alt-text="Screenshot of install `prerelease` NuGet package in Visual Studio.":::

## Build your C# application

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.WriteLine("Hello World!")`.

1. In the application's **Program.cs** , create variables for your key and custom endpoint. For more information, *see* [Retrieve your key and custom domain endpoint](../../../quickstarts/document-translation-rest-api.md#retrieve-your-key-and-document-translation-endpoint).

  ```csharp
  private static readonly string endpoint = "<your-document-translation-endpoint>";
  private static readonly string key = "<your-key>";
  ```

1. To Start a translation operation for one or more documents in a single blob container, call the `StartTranslationAsync` method.

1. To call `StartTranslationAsync`, you need to initialize a `DocumentTranslationInput`  object that contains the `sourceUri` and `targetUri` parameters:

    * For [**Managed Identity authorization**](../../../how-to-guides/create-use-managed-identities.md) create these variables:

      * **sourceUri**. The URL for the source container containing documents to be translated.
      * **targetUri** The URL for the target container to which the translated documents are written.
      * **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../../../../language-support.md) page.

        To find your source and target URLs, navigate to your storage account in the Azure portal. In the left sidebar, under  **Data storage** , select **Containers** and follow these steps to retrieve your source document(s) and target container URLS.

          |Source|Target|
          |------|-------|
          |1. Select the checkbox next to the source container|1. Select the checkbox next to the target container.|
          | 2. From the main window area, select a file or document(s) for translation.| 2. Select the ellipses located at the right, then choose **Properties**.|
          | 3. The source URL is located at the top of the Properties list.|3. The target URL is located at the top of the Properties list.|

    * For [**Shared Access Signature (SAS) authorization**](../../../how-to-guides/create-sas-tokens.md) create these variables

      * **sourceUri**. The SAS URI, with a SAS token appended as a query string, for the source container containing documents to be translated.
      * **targetUri** The SAS URI, with a SAS token appended as a query string,for the target container to which the translated documents are written.
      * **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../../../../language-support.md) page.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

**Enter the following code sample into your application's Program.cs file:**

```csharp

using Azure;
using Azure.AI.Translation.Document;

class Program {

  // create variables for your custom endpoint and resource key
  private static readonly string endpoint = "<your-document-translation-endpoint>";
  private static readonly string key = "<your-key>";

  static async Task Main(string[] args) {

    // create variables for your sourceUrl, targetUrl, and targetLanguageCode
    Uri sourceUri = new Uri("<sourceUrl>");
    Uri targetUri = new Uri("<targetUrl>");
    string targetLanguage = "<targetLanguageCode>";

    // initialize a new instance  of the DocumentTranslationClient object to interact with the Document Translation feature
    DocumentTranslationClient client = new DocumentTranslationClient(new Uri(endpoint), new AzureKeyCredential(key));

    // initialize a new instance of the `DocumentTranslationInput` object to provide source and target locations and target language for the translation operation
    DocumentTranslationInput input = new DocumentTranslationInput(sourceUri, targetUri, targetLanguage);

    // initialize a new instance of the DocumentTranslationOperation class to track the status of the translation operation
    DocumentTranslationOperation operation = await client.StartTranslationAsync(input);

    await operation.WaitForCompletionAsync();

    Console.WriteLine($"  Status: {operation.Status}");
    Console.WriteLine($"  Created on: {operation.CreatedOn}");
    Console.WriteLine($"  Last modified: {operation.LastModified}");
    Console.WriteLine($"  Total documents: {operation.DocumentsTotal}");
    Console.WriteLine($"    Succeeded: {operation.DocumentsSucceeded}");
    Console.WriteLine($"    Failed: {operation.DocumentsFailed}");
    Console.WriteLine($"    In Progress: {operation.DocumentsInProgress}");
    Console.WriteLine($"    Not started: {operation.DocumentsNotStarted}");

    await foreach(DocumentStatusResult document in operation.Value) {
      Console.WriteLine($"Document with Id: {document.Id}");
      Console.WriteLine($"  Status:{document.Status}");
      if (document.Status == DocumentTranslationStatus.Succeeded) {
        Console.WriteLine($"  Translated Document Uri: {document.TranslatedDocumentUri}");
        Console.WriteLine($"  Translated to language: {document.TranslatedToLanguageCode}.");
        Console.WriteLine($"  Document source Uri: {document.SourceDocumentUri}");
      } else {
        Console.WriteLine($"  Error Code: {document.Error.Code}");
        Console.WriteLine($"  Message: {document.Error.Message}");
      }
    }
  }
}
```

## Run your application

Once you've added the code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../../../media/quickstarts/run-application-document.png" alt-text="Screenshot: run your Visual Studio program.":::

Here's a snippet of the expected output:

  :::image type="content" source="../../../../media/quickstarts/c-sharp-output-document.png" alt-text="Screenshot of the Visual Studio Code output in the terminal window. ":::

---

That's it! You've created a program to translate documents in a storage container using the .NET client library.
