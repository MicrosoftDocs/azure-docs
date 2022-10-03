---
title: "Document Translation C#/.NET or Python client library"
titleSuffix: Azure Cognitive Services
description: Use the Translator C#/.NET or Python client library (SDK) for cloud-based batch document translation service and process
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 06/13/2022
ms.author: lajanuar
---

# Document Translation client-library SDKs
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD001 -->
[Document Translation](overview.md) is a cloud-based feature of the [Azure Translator](../translator-overview.md) service. You can translate entire documents or process batch document translations in various file formats while preserving original document structure and format. In this article, you'll learn how to use the Document Translation service C#/.NET and Python client libraries. For the REST API, see our [Quickstart](get-started-with-document-translation.md) guide.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource). Choose **Global** unless your business or application requires a specific region. Select the **Standard S1** pricing tier to get started (document translation is not supported for the free tier).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll [**create containers**](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) in your Azure blob storage account for your source and target files:

  * **Source container**. This container is where you upload your files for translation (required).
  * **Target container**. This container is where your translated files will be stored (required).

* You also need to create Shared Access Signature (SAS) tokens for your source and target containers. The `sourceUrl`  and `targetUrl` , must include a Shared Access Signature (SAS) token, appended as a query string. The token can be assigned to your container or specific blobs. *See* [**Create SAS tokens for Document Translation process**](create-sas-tokens.md).

  * Your **source** container or blob must have designated  **read** and **list** access.
  * Your **target** container or blob must have designated  **write** and **list** access.

For more information, *see* [Create SAS tokens](create-sas-tokens.md).

## Client libraries

### [C#/.NET v1.0.0 (GA)](#tab/csharp)

| [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.Translation.Document)| [Client library](/dotnet/api/overview/azure/AI.Translation.Document-readme) |  [REST API](reference/rest-api-guide.md) | [Product documentation](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.Translation.Document/1.0.0/index.html) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Translation.Document_1.0.0/sdk/translation/Azure.AI.Translation.Document/samples) |

### Set up your project

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `batch-document-translation`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*.

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

Within the application directory, install the Document Translation client library for .NET using one of the following methods:

#### **.NET CLI**

```console
dotnet add package Azure.AI.Translation.Document --version 1.0.0
```

#### **NuGet Package Manager**

```console
Install-Package Azure.AI.Translation.Document -Version 1.0.0
```

#### **NuGet PackageReference**

```xml
<ItemGroup>
    <!-- ... -->
<PackageReference Include="Azure.AI.Translation.Document" Version="1.0.0" />
    <!-- ... -->
</ItemGroup>
```

From the project directory, open the Program.cs file in your preferred editor or IDE. Add the following using directives:

```csharp
using Azure;
using Azure.AI.Translation.Document;

using System;
using System.Threading;
```

In the application's **Program** class, create variables for your key and custom endpoint. For details, *see* [Custom domain name and key](get-started-with-document-translation.md#your-custom-domain-name-and-key)

```csharp
private static readonly string endpoint = "<your custom endpoint>";
private static readonly string key = "<your key>";
```

### Translate a document or batch files

* To Start a translation operation for one or more documents in a single blob container, you'll call the `StartTranslationAsync` method.

* To call `StartTranslationAsync`, you need to initialize a `DocumentTranslationInput`  object that contains the following parameters:

* **sourceUri**. The SAS URI for the source container containing documents to be translated.
* **targetUri** The SAS URI for the target container to which the translated documents will be written.
* **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../language-support.md) page.

```csharp

public void StartTranslation() {
  Uri sourceUri = new Uri("<sourceUrl>");
  Uri targetUri = new Uri("<targetUrl>");

  DocumentTranslationClient client = new DocumentTranslationClient(new Uri(endpoint), new AzureKeyCredential(key));

  DocumentTranslationInput input = new DocumentTranslationInput(sourceUri, targetUri, "es")

  DocumentTranslationOperation operation = await client.StartTranslationAsync(input);

  await operation.WaitForCompletionAsync();

  Console.WriteLine($ "  Status: {operation.Status}");
  Console.WriteLine($ "  Created on: {operation.CreatedOn}");
  Console.WriteLine($ "  Last modified: {operation.LastModified}");
  Console.WriteLine($ "  Total documents: {operation.DocumentsTotal}");
  Console.WriteLine($ "    Succeeded: {operation.DocumentsSucceeded}");
  Console.WriteLine($ "    Failed: {operation.DocumentsFailed}");
  Console.WriteLine($ "    In Progress: {operation.DocumentsInProgress}");
  Console.WriteLine($ "    Not started: {operation.DocumentsNotStarted}");

  await foreach(DocumentStatusResult document in operation.Value) {
    Console.WriteLine($ "Document with Id: {document.DocumentId}");
    Console.WriteLine($ "  Status:{document.Status}");
    if (document.Status == TranslationStatus.Succeeded) {
      Console.WriteLine($ "  Translated Document Uri: {document.TranslatedDocumentUri}");
      Console.WriteLine($ "  Translated to language: {document.TranslatedTo}.");
      Console.WriteLine($ "  Document source Uri: {document.SourceDocumentUri}");
    }
    else {
      Console.WriteLine($ "  Error Code: {document.Error.ErrorCode}");
      Console.WriteLine($ "  Message: {document.Error.Message}");
    }
  }
}
```

That's it! You've created a program to translate documents in a storage container using the .NET client library.

### [Python v1.0.0 (GA)](#tab/python)

| [Package (PyPI)](https://pypi.org/project/azure-ai-translation-document/) |  [Client library](/python/api/overview/azure/ai-translation-document-readme?view=azure-python&preserve-view=true) |  [REST API](reference/rest-api-guide.md) | [Product documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-translation-document/latest/azure.ai.translation.document.html) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-translation-document_1.0.0/sdk/translation/azure-ai-translation-document/samples) |

### Set up your project

### Install the client library

If you haven't done so, install [Python](https://www.python.org/downloads/) and then install the latest version of the Translator client library:

```console
pip install azure-ai-translation-document==1.0.0
```

### Create your application

Create a new Python application in your preferred editor or IDE. Then import the following libraries.

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.translation.document import DocumentTranslationClient
```

Create variables for your resource key, custom endpoint, sourceUrl, and targetUrl. For
more information, *see*  [Custom domain name and key](get-started-with-document-translation.md#your-custom-domain-name-and-key)

```python
key = "<your-key>"
endpoint = "<your-custom-endpoint>"
sourceUrl = "<your-container-sourceUrl>"
targetUrl = "<your-container-targetUrl>"
```

### Translate a document or batch files

```python
client = DocumentTranslationClient(endpoint, AzureKeyCredential(key))

poller = client.begin_translation(sourceUrl, targetUrl, "fr")
result = poller.result()

print("Status: {}".format(poller.status()))
print("Created on: {}".format(poller.details.created_on))
print("Last updated on: {}".format(poller.details.last_updated_on))
print("Total number of translations on documents: {}".format(poller.details.documents_total_count))

print("\nOf total documents...")
print("{} failed".format(poller.details.documents_failed_count))
print("{} succeeded".format(poller.details.documents_succeeded_count))

for document in result:
    print("Document ID: {}".format(document.id))
    print("Document status: {}".format(document.status))
    if document.status == "Succeeded":
        print("Source document location: {}".format(document.source_document_url))
        print("Translated document location: {}".format(document.translated_document_url))
        print("Translated to language: {}\n".format(document.translated_to))
    else:
        print("Error Code: {}, Message: {}\n".format(document.error.code, document.error.message))
```

That's it! You've created a program to translate documents in a storage container using the Python client library.

---

### Next step

> [!div class="nextstepaction"]
 > [**Try the REST API quickstart**](get-started-with-document-translation.md)
