---
title: About the Form Recognizer SDK?
titleSuffix: Azure Applied AI Services
description: The Form Recognizer software development kit (SDK) exposes Form Recognizer models, features and capabilities, making it easier to develop document-processing applications.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 10/14/2022
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->

# What is the Form Recognizer SDK?

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to analyze text and structured data from documents. The Form Recognizer software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Form Recognizer models and capabilities into your applications. Form Recognizer SDK is available across platforms in C#/.NET, Java, JavaScript, and Python programming languages.

## Supported languages

Form Recognizer SDK supports the following languages and platforms:

| Language → SDK version | Package| Azure Form Recognizer SDK |Supported API version| Platform support |
|:----------------------:|:----------|:----------| :----------------|-----------------|
|[.NET/C# → 4.0.0 (latest GA release)](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-csharp#set-up)| [NuGet](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0)  | [Azure SDK for .NET](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.0.0/index.html)|[**v3.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br> [**v2.1**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[**v2.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) |[Windows, macOS, Linux, Docker](https://dotnet.microsoft.com/download)|
|[Java → 4.0.0 (latest GA release)](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-java#set-up) |[Maven](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer) | [Azure SDK for Java](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0/index.html)|[**v3.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br> [**v2.1**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[**v2.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) |[Windows, macOS, Linux](/java/openjdk/install)|
|[JavaScript → 4.0.0 (latest GA release)](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-javascript#set-up)| [npm](https://www.npmjs.com/package/@azure/ai-form-recognizer)| [Azure SDK for JavaScript](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0/index.html) | [**v3.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br> [**v2.1**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[**v2.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) | [Browser, Windows, macOS, Linux](https://nodejs.org/en/download/) |
|[Python → 3.2.0 (latest GA release)](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true?pivots=programming-language-python#set-up) | [PyPI](https://pypi.org/project/azure-ai-formrecognizer/3.2.0/)| [Azure SDK for Python](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/3.2.0/index.html)| [**v3.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br> [**v2.1**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[**v2.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) |[Windows, macOS, Linux](/azure/developer/python/configure-local-development-environment?tabs=windows%2Capt%2Ccmd#use-the-azure-cli)

## Supported Clients

| Language| SDK version | API version | Supported clients|
| :------ | :-----------|:---------- | :-----------------|
|<ul><li> C# /.NET </li><li>Java</li><li>JavaScript</li></ul>| <ul><li>4.0.0 (latest GA release)</li></ul>| <ul><li> v3.0 (default)</li></ul>| <ul><li> **DocumentAnalysisClient**</li><li>**DocumentModelAdministrationClient**</li></ul> |
|<ul><li> C# /.NET </li><li>Java</li><li>JavaScript</li></ul>| <ul><li>4.0.0 (latest GA release)</li></ul>| <ul><li> v2.1</li><li>v2.0</li></ul>  | <ul><li> **FormRecognizerClient**</li><li>**FormTrainingClient**</li></ul> |
|<ul><li> C# /.NET </li><li>Java</li><li>JavaScript</li></ul>| <ul><li>3.1.x</li></ul> | <ul><li> v2.1 (default)</li><li>v2.0</li></ul> | <ul><li> **FormRecognizerClient**</li><li>**FormTrainingClient**</li></ul> |
|<ul><li> C# /.NET </li><li>Java</li><li>JavaScript</li></ul>| <ul><li>3.0.x</li></ul>| <ul><li>v2.0</li></ul> | <ul><li> **FormRecognizerClient**</li><li>**FormTrainingClient**</li></ul> |
|<ul><li> Python</li></ul>| <ul><li>3.2.0 (latest GA release)</li></ul> | <ul><li> v3.0 (default)</li></ul> | <ul><li> **DocumentAnalysisClient**</li><li>**DocumentModelAdministrationClient**</li></ul>|
|<ul><li> Python</li></ul>| <ul><li>3.2.0 (latest GA release)</li></ul> | <ul><li> v2.1</li><li>v2.0</li></ul>  | <ul><li> **FormRecognizerClient**</li><li>**FormTrainingClient**</li></ul> |
|<ul><li> Python </li></ul>| <ul><li>3.1.x</li></ul> | <ul><li> v2.1 (default)</li><li>v2.0</li></ul> |<ul><li>**FormRecognizerClient**</li><li>**FormTrainingClient**</li></ul> |
|<ul><li> Python</li></ul>| <ul><li>3.0.0</li></ul> | <ul><li>v2.0</li></ul>| <ul><li> **FormRecognizerClient**</li><li>**FormTrainingClient**</li></ul> |

## Changelog and release history

#### Form Recognizer SDK September 2022 GA release

This release includes the following updates:

> [!IMPORTANT]
> The `DocumentAnalysisClient` and `DocumentModelAdministrationClient` now target API version v3.0 GA, released 2022-08-31. These clients are no longer supported by API versions 2020-06-30-preview or earlier.

### [**C#**](#tab/csharp)

* **Version 4.0.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/MigrationGuide.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md)

### [**Java**](#tab/java)

* **Version 4.0.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (Maven)**](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/migration-guide.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)

### [**JavaScript**](#tab/javascript)

* **Version 4.0.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/MIGRATION-v3_v4.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0/sdk/formrecognizer/ai-form-recognizer/README.md)

[**Samples**](https://github.com/witemple-msft/azure-sdk-for-js/blob/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4/javascript/README.md)

### [Python](#tab/python)

> [!NOTE]
> Python 3.7 or later is required to use this package.

* **Version 3.2.0 GA (2022-09-08)**
* **Supports REST API v3.0 and v2.0 clients**

[**Package (PyPi)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0/)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

[**Migration guide**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/MIGRATION_GUIDE.md)

[**ReadMe**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md)

---

#### Form Recognizer SDK beta August 2022 preview release

This release includes the following updates:

### [**C#**](#tab/csharp)

**Version 4.0.0-beta.5 (2022-08-09)**
**Supports REST API 2022-06-30-preview clients**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md#400-beta5-2022-08-09)

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.5)

[**SDK reference documentation**](/dotnet/api/overview/azure/ai.formrecognizer-readme?view=azure-dotnet-preview&preserve-view=true)

### [**Java**](#tab/java)

**Version 4.0.0-beta.6 (2022-08-10)**
**Supports REST API 2022-06-30-preview and earlier clients**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md#400-beta6-2022-08-10)

 [**Package (Maven)**](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer)

 [**SDK reference documentation**](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)

### [**JavaScript**](#tab/javascript)

**Version 4.0.0-beta.6 (2022-08-09)**
**Supports REST API 2022-06-30-preview and earlier clients**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0-beta.6/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

 [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.6)

 [**SDK reference documentation**](/javascript/api/overview/azure/ai-form-recognizer-readme?view=azure-node-preview&preserve-view=true)

### [Python](#tab/python)

> [!IMPORTANT]
> Python 3.6 is no longer supported in this release. Use Python 3.7 or later.

**Version 3.2.0b6 (2022-08-09)**
**Supports REST API 2022-06-30-preview and earlier clients**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b6/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

 [**Package (PyPi)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b6/)

 [**SDK reference documentation**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b6/)

---

### Form Recognizer SDK beta June 2022 preview release

This release includes the following updates:

### [**C#**](#tab/csharp)

**Version 4.0.0-beta.4 (2022-06-08)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0-beta.4/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md)

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.4)

[**SDK reference documentation**](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet-preview&preserve-view=true)

### [**Java**](#tab/java)

**Version 4.0.0-beta.5 (2022-06-07)**

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0-beta.5/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

 [**Package (Maven)**](https://search.maven.org/artifact/com.azure/azure-ai-formrecognizer/4.0.0-beta.5/jar)

 [**SDK reference documentation**](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)

### [**JavaScript**](#tab/javascript)

**Version 4.0.0-beta.4 (2022-06-07)**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0-beta.4/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

 [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.4)

 [**SDK reference documentation**](/javascript/api/@azure/ai-form-recognizer/?view=azure-node-preview&preserve-view=true)

### [Python](#tab/python)

**Version 3.2.0b5 (2022-06-07**

 [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b5/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)

 [**Package (PyPi)**](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b5/)

 [**SDK reference documentation**](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer?view=azure-python-preview&preserve-view=true)

---

## Use Form Recognizer SDK in your applications

The Form Recognizer SDK enables the use and management of the Form Recognizer service in your application. The SDK builds on the underlying Form Recognizer REST API allowing you to easily use those APIs within your programming language paradigm. Here's how you use the Form Recognizer SDK for your preferred language:

### 1. Install the SDK client library

### [C#/.NET](#tab/csharp)

```dotnetcli
dotnet add package Azure.AI.FormRecognizer --version 4.0.0-beta.5
```

```powershell
Install-Package Azure.AI.FormRecognizer -Version 4.0.0-beta.5
```

### [Java](#tab/java)

```xml
    <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-formrecognizer</artifactId>
    <version>4.0.0-beta.5</version>
    </dependency>
```

```kotlin
implementation("com.azure:azure-ai-formrecognizer:4.0.0-beta.5")
```

### [JavaScript](#tab/javascript)

```javascript
npm i @azure/ai-form-recognizer@4.0.0-beta.6
```

### [Python](#tab/python)

```python
pip install azure-ai-formrecognizer==3.2.0b6
```

---

### 2. Import the SDK client library into your application

### [C#/.NET](#tab/csharp)

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
```

### [Java](#tab/java)

```java
import com.azure.ai.formrecognizer.*;
import com.azure.ai.formrecognizer.models.*;
import com.azure.ai.formrecognizer.DocumentAnalysisClient.*;

import com.azure.core.credential.AzureKeyCredential;
```

### [JavaScript](#tab/javascript)

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
```

### [Python](#tab/python)

```python
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
```

---

### 3. Set up authentication

There are two supported methods for authentication

* Use a [Form Recognizer API key](#use-your-api-key) with AzureKeyCredential from azure.core.credentials.

* Use a [token credential from azure-identity](#use-an-azure-active-directory-azure-ad-token-credential) to authenticate with [Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md).

#### Use your API key

Here's where to find your Form Recognizer API key in the Azure portal:

:::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of the keys and endpoint location in the Azure portal.":::

### [C#/.NET](#tab/csharp)

```csharp

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string key = "<your-key>";
string endpoint = "<your-endpoint>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);
```

### [Java](#tab/java)

```java

// create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
            .credential(new AzureKeyCredential("<your-key>"))
            .endpoint("<your-endpoint>")
            .buildClient();
```

### [JavaScript](#tab/javascript)

```javascript

// create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
async function main() {
    const client = new DocumentAnalysisClient("<your-endpoint>", new AzureKeyCredential("<your-key>"));
```

### [Python](#tab/python)

```python

# create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    document_analysis_client = DocumentAnalysisClient(endpoint="<your-endpoint>", credential=AzureKeyCredential("<your-key>"))
```

---

#### Use an Azure Active Directory (Azure AD) token credential

> [!NOTE]
> Regional endpoints do not support AAD authentication. Create a [custom subdomain](../../cognitive-services/authentication.md?tabs=powershell#create-a-resource-with-a-custom-subdomain) for your resource in order to use this type of authentication.

Authorization is easiest using the `DefaultAzureCredential`. It provides a default token credential, based upon the running environment, capable of handling most Azure authentication scenarios.

### [C#/.NET](#tab/csharp)

Here's how to acquire and use the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) for .NET applications:

1. Install the [Azure Identity library for .NET](/dotnet/api/overview/azure/identity-readme):

    ```console
        dotnet add package Azure.Identity
    ```

    ```powershell
        Install-Package Azure.Identity
    ```

1. [Register an Azure AD application and create a new service principal](../../cognitive-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Form Recognizer by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret in the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentAnalysisClient`** instance including the **`DefaultAzureCredential`**:

    ```csharp
    string endpoint = "<your-endpoint>";
    var client = new DocumentAnalysisClient(new Uri(endpoint), new DefaultAzureCredential());
    ```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.FormRecognizer_4.0.0-beta.4/sdk/formrecognizer/Azure.AI.FormRecognizer#authenticate-the-client)

### [Java](#tab/java)

Here's how to acquire and use the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable&preserve-view=true) for Java applications:

1. Install the [Azure Identity library for Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true):

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.5.3</version>
    </dependency>
    ```

1. [Register an Azure AD application and create a new service principal](../../cognitive-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Form Recognizer by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentAnalysisClient`** instance and **`TokenCredential`** variable:

    ```java
    TokenCredential credential = new DefaultAzureCredentialBuilder().build();
    DocumentAnalysisClient documentAnalysisClient = new DocumentAnalysisClientBuilder()
        .endpoint("{your-endpoint}")
        .credential(credential)
        .buildClient();
    ```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/formrecognizer/azure-ai-formrecognizer#authenticate-the-client)

### [JavaScript](#tab/javascript)

Here's how to acquire and use the [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest&preserve-view=true) for JavaScript applications:

1. Install the [Azure Identity library for JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true):

    ```javascript
    npm install @azure/identity
    ```

1. [Register an Azure AD application and create a new service principal](../../cognitive-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Form Recognizer by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentAnalysisClient`** instance including the **`DefaultAzureCredential`**:

    ```javascript
    const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
    const { DefaultAzureCredential } = require("@azure/identity");

    const client = new DocumentAnalysisClient("<your-endpoint>", new DefaultAzureCredential());
    ```

For more information, *see* [Create and authenticate a client](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/formrecognizer/ai-form-recognizer#create-and-authenticate-a-client).

### [Python](#tab/python)

Here's how to acquire and use the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true) for Python applications.

1. Install the [Azure Identity library for Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true):

    ```python
    pip install azure-identity
    ```
1. [Register an Azure AD application and create a new service principal](../../cognitive-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Form Recognizer by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentAnalysisClient`** instance including the **`DefaultAzureCredential`**:

    ```python
    from azure.identity import DefaultAzureCredential
    from azure.ai.formrecognizer import DocumentAnalysisClient

    credential = DefaultAzureCredential()
    document_analysis_client = DocumentAnalysisClient(
        endpoint="https://<my-custom-subdomain>.cognitiveservices.azure.com/",
        credential=credential
    )
    ```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-formrecognizer_3.2.0b5/sdk/formrecognizer/azure-ai-formrecognizer#authenticate-the-client)

---

### 4. Build your application

First, you'll create a client object to interact with the Form Recognizer SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, try a [quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) in a language of your choice.

## Help options

The [Microsoft Q&A](/answers/topics/azure-form-recognizer.html) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-form-recognizer) forums are available for the developer community to ask and answer questions about Azure Form Recognizer and other services. Microsoft monitors the forums and replies to questions that the community has yet to answer. To make sure that we see your question, tag it with **`azure-form-recognizer`**.

## Next steps

>[!div class="nextstepaction"]
> [**Try a Form Recognizer quickstart**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [**Explore the Form Recognizer REST API v3.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)