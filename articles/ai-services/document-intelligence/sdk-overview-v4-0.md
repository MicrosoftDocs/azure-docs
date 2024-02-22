---
title: Document Intelligence (formerly Form Recognizer) SDK target REST API 2023-10-31-preview
titleSuffix: Azure AI services
description: The Document Intelligence 2023-10-31-preview software development kits (SDKs) expose Document Intelligence models, features and capabilities that are in active development for C#, Java, JavaScript, or Python programming language.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - devx-track-python
  - ignite-2023
ms.topic: conceptual
ms.date: 11/21/2023
ms.author: lajanuar
monikerRange: 'doc-intel-4.0.0'
--- 


<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->

# SDK target: REST API 2023-10-31-preview

[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

![Document Intelligence checkmark](media/yes-icon.png) **REST API version 2023-10-31-preview**

Azure AI Document Intelligence is a cloud service that uses machine learning to analyze text and structured data from documents. The Document Intelligence software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Intelligence models and capabilities into your applications. Document Intelligence SDK is available across platforms in C#/.NET, Java, JavaScript, and Python programming languages.

## Supported programming languages

Document Intelligence SDK supports the following languages and platforms:

| Language → Document Intelligence SDK version &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;| Package| Supported API version &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;| Platform support |
|:----------------------:|:----------|:----------| :----------------:|
| [**.NET/C# → 1.0.0-beta.1 (preview)**](/dotnet/api/azure.ai.documentintelligence.documentintelligenceadministrationclient?view=azure-dotnet-preview&preserve-view=true)|[NuGet](https://www.nuget.org/packages/Azure.AI.DocumentIntelligence/1.0.0-beta.1)|[&bullet; 2023-10-31 (preview)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>[&bullet; 2023-07-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> [&bullet; 2022-08-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> [&bullet; v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[&bullet; v2.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) |[Windows, macOS, Linux, Docker](https://dotnet.microsoft.com/download)|
 |[**Java → 1.0.0-beta.1 (preview)**](/java/api/overview/azure/ai-documentintelligence-readme?view=azure-java-preview&preserve-view=true) |[MVN repository](https://mvnrepository.com/artifact/com.azure/azure-ai-documentintelligence/1.0.0-beta.1) |[&bullet; 2023-10-31 (preview)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>[&bullet; 2023-07-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> [&bullet; 2022-08-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> [&bullet; v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[&bullet; v2.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) |[Windows, macOS, Linux](/java/openjdk/install)|
|[**JavaScript → 1.0.0-beta.1 (preview)**](/javascript/api/overview/azure/ai-document-intelligence-rest-readme?view=azure-node-preview&preserve-view=true)| [npm](https://www.npmjs.com/package/@azure-rest/ai-document-intelligence)|[&bullet; 2023-10-31 (preview)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>[&bullet; 2023-07-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> &bullet; [2022-08-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> [&bullet; v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[&bullet; v2.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) | [Browser, Windows, macOS, Linux](https://nodejs.org/en/download/) |
|[**Python → 1.0.0b1 (preview)**](/python/api/overview/azure/ai-documentintelligence-readme?view=azure-python-preview&preserve-view=true) | [PyPI](https://pypi.org/project/azure-ai-documentintelligence/)|[&bullet; 2023-10-31 (preview)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>[&bullet; 2023-07-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> &bullet; [2022-08-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br> [&bullet; v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)</br>[&bullet; v2.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) |[Windows, macOS, Linux](/azure/developer/python/configure-local-development-environment?tabs=windows%2Capt%2Ccmd#use-the-azure-cli)

## Supported Clients

The following tables present the correlation between each SDK version the supported API versions of the Document Intelligence service.

### [C#/.NET](#tab/csharp)

| Language| SDK alias | API version (default) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; | Supported clients|
| :------ | :-----------|:---------- | :-----------------|
 |**.NET/C# 1.0.0-beta.1 (preview)**| v4.0 (preview)| 2023-10-31-preview|**DocumentIntelligenceClient**</br>**DocumentIntelligenceAdministrationClient**|
|**.NET/C# 4.1.0**| v3.1 latest (GA)| 2023-07-31|**DocumentAnalysisClient**</br>**DocumentModelAdministrationClient** |
|**.NET/C# 4.0.0**| v3.0 (GA)| 2022-08-31|  **DocumentAnalysisClient**</br>**DocumentModelAdministrationClient** |
|**.NET/C# 3.1.x**| v2.1 |  v2.1 |  **FormRecognizerClient**</br>**FormTrainingClient** |
|**.NET/C# 3.0.x**| v2.0 | v2.0 |  **FormRecognizerClient**</br>**FormTrainingClient** |

### [Java](#tab/java)

| Language| SDK alias | API version &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; | Supported clients|
| :------ | :-----------|:---------- | :-----------------|
|**Java 1.0.0-beta.1 (preview)**| v4.0 preview| 2023-10-31 (default)|**DocumentIntelligenceClient**</br>**DocumentIntelligenceAdministrationClient**|
|**Java 4.1.0**| v3.1 latest (GA)| 2023-07-31 (default)|**DocumentAnalysisClient**</br>**DocumentModelAdministrationClient** |
|**Java 4.0.0**</br>| v3.0 (GA)| 2022-08-31|  **DocumentAnalysisClient**</br>**DocumentModelAdministrationClient** |
|**Java 3.1.x**| v2.1 |  v2.1 |  **FormRecognizerClient**</br>**FormTrainingClient** |
|**Java 3.0.x**| v2.0| v2.0 |  **FormRecognizerClient**</br>**FormTrainingClient** |

### [JavaScript](#tab/javascript)

| Language| SDK alias | API version (default) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; | Supported clients|
| :------ | :-----------|:---------- | :-----------------|
|**JavaScript 1.0.0-beta.1**| v4.0 (preview)| 2023-10-31 (default)|**DocumentIntelligenceClient**</br>**DocumentIntelligenceAdministrationClient**|
|**JavaScript 5.0.0**| v3.1 latest (GA)| 2023-07-31 (default)|**DocumentAnalysisClient**</br>**DocumentModelAdministrationClient** |
|**JavaScript 4.0.0**</br>| v3.0 (GA)| 2022-08-31|  **DocumentAnalysisClient**</br>**DocumentModelAdministrationClient** |
|**JavaScript 3.1.x**</br>| v2.1 |  v2.1 |  **FormRecognizerClient**</br>**FormTrainingClient** |
|**JavaScript 3.0.x**</br>| v2.0| v2.0 |  **FormRecognizerClient**</br>**FormTrainingClient** |

### [Python](#tab/python)

| Language| SDK alias | API version (default) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; | Supported clients|
| :------ | :-----------|:---------- | :-----------------|
| **Python 1.0.0b1**| v4.0 (preview)| 2023-10-31 (default) |**DocumentIntelligenceClient**</br>**DocumentIntelligenceAdministrationClient**|
| **Python 3.3.0**| v3.1 latest (GA)| 2023-07-31 (default) |  **DocumentAnalysisClient**</br>**DocumentModelAdministrationClient**|
| **Python 3.2.x**| v3.0 (GA)| 2022-08-31|  **DocumentAnalysisClient**</br>**DocumentModelAdministrationClient**|
| **Python 3.1.x**| v2.1 |  v2.1  |  **FormRecognizerClient**</br>**FormTrainingClient** |
| **Python 3.0.0** | v2.0 |  v2.0 |**FormRecognizerClient**</br>**FormTrainingClient** |

---

## Use Document Intelligence SDK in your applications

The Document Intelligence SDK enables the use and management of the Document Intelligence service in your application. The SDK builds on the underlying Document Intelligence REST API allowing you to easily use those APIs within your programming language paradigm. Here's how you use the Document Intelligence SDK for your preferred language:

### 1. Install the SDK client library

### [C#/.NET](#tab/csharp)

```dotnetcli
dotnet add package Azure.AI.DocumentIntelligence --version 1.0.0-beta.1
```

```powershell
Install-Package Azure.AI.FormRecognizer -Version 1.0.0-beta.1
```

### [Java](#tab/java)

```xml
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-documentintelligence</artifactId>
    <version>1.0.0-beta.1</version>
  </dependency>

```

```kotlin
implementation("com.azure:azure-ai-documentintelligence:1.0.0-beta.1")

```

### [JavaScript](#tab/javascript)

```console
npm i @azure-rest/ai-document-intelligence@1.0.0-beta.1
```

### [Python](#tab/python)

```python
pip install azure-ai-documentintelligence==1.0.0b1
```

---

### 2. Import the SDK client library into your application

### [C#/.NET](#tab/csharp)

```csharp
using Azure;
using Azure.AI.DocumentIntelligence;
```

### [Java](#tab/java)

```java
import com.azure.ai.documentintelligence.*;
import com.azure.ai.documentintelligence.models.*;

import com.azure.core.credential.AzureKeyCredential;
```

### [JavaScript](#tab/javascript)

```javascript
const { AzureKeyCredential, DocumentIntelligence } = require("@azure-rest/ai-document-intelligence@1.0.0-beta.1");
```

### [Python](#tab/python)

```python
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential
```

---

### 3. Set up authentication

There are two supported methods for authentication

* Use a [Document Intelligence API key](#use-your-api-key) with AzureKeyCredential from azure.core.credentials.

* Use a [token credential from azure-identity](#use-an-azure-active-directory-azure-ad-token-credential) to authenticate with [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md).

#### Use your API key

Here's where to find your Document Intelligence API key in the Azure portal:

:::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of the keys and endpoint location in the Azure portal.":::

### [C#/.NET](#tab/csharp)

```csharp

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentIntelligenceClient` instance
string key = "<your-key>";
string endpoint = "<your-endpoint>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentIntelligenceClient client = new DocumentIntelligenceClient(new Uri(endpoint), new AzureKeyCredential(key));
```

### [Java](#tab/java)

```java

// create your `DocumentIntelligenceClient` instance and `AzureKeyCredential` variable
DocumentIntelligenceClient documentIntelligenceClient = new DocumentIntelligenceClientBuilder()
    .credential(new AzureKeyCredential("<your-key>"))
    .endpoint("<your-endpoint>")
    .buildClient();
```

### [JavaScript](#tab/javascript)

```javascript

// create your `DocumentIntelligenceClient` instance and `AzureKeyCredential` variable
async function main() {
    const client = DocumentIntelligence(process.env["your-endpoint>"], {
  key: process.env["<your-key>"],
});
```

### [Python](#tab/python)

```python

# create your `DocumentIntelligenceClient` instance and `AzureKeyCredential` variable
    endpoint = "<your-endpoint>"
    credential = AzureKeyCredential("<your-key>")
    document_analysis_client = DocumentIntelligenceClient(endpoint, credential)
```

---

<a name='use-an-azure-active-directory-azure-ad-token-credential'></a>

#### Use a Microsoft Entra token credential

> [!NOTE]
> Regional endpoints do not support Microsoft Entra authentication. Create a [custom subdomain](../../ai-services/authentication.md?tabs=powershell#create-a-resource-with-a-custom-subdomain) for your resource in order to use this type of authentication.

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

1. [Register a Microsoft Entra application and create a new service principal](../../ai-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Document Intelligence by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret in the Microsoft Entra application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentIntelligenceClient`** instance including the **`DefaultAzureCredential`**:

    ```csharp
    string endpoint = "<your-endpoint>";
    var client = new DocumentIntelligenceClient(new Uri(endpoint), new DefaultAzureCredential());
    ```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/documentintelligence/Azure.AI.DocumentIntelligence/README.md#authenticate-the-client)

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

1. [Register a Microsoft Entra application and create a new service principal](../../ai-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Document Intelligence by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Microsoft Entra application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentIntelligenceClient`** instance and **`TokenCredential`** variable:

    ```java
    TokenCredential credential = new DefaultAzureCredentialBuilder().build();
    DocumentIntelligenceClient documentIntelligenceClient = new DocumentIntelligenceClientBuilder()
        .endpoint("{your-endpoint}")
        .credential(credential)
        .buildClient();
    ```

For more information, *see* [Authentication](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-documentintelligence_1.0.0-beta.1/sdk/documentintelligence/azure-ai-documentintelligence/README.md#authentication)

### [JavaScript](#tab/javascript)

Here's how to acquire and use the [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest&preserve-view=true) for JavaScript applications:

1. Install the [Azure Identity library for JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true):

    ```javascript
    npm install @azure/identity
    ```

1. [Register a Microsoft Entra application and create a new service principal](../../ai-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Document Intelligence by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Microsoft Entra application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentIntelligenceClient`** instance including the **`DefaultAzureCredential`**:

    ```javascript
    const { DocumentIntelligenceClient } = require("@azure-rest/ai-document-intelligence@1.0.0-beta.1");
    const { DefaultAzureCredential } = require("@azure/identity");

    const client = new DocumentIntelligenceClient("<your-endpoint>", new DefaultAzureCredential());
    ```

For more information, *see* [Create and authenticate a client](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/documentintelligence/ai-document-intelligence-rest#create-and-authenticate-a-documentintelligenceclient).

### [Python](#tab/python)

Here's how to acquire and use the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true) for Python applications.

1. Install the [Azure Identity library for Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true):

    ```python
    pip install azure-identity
    ```

1. [Register a Microsoft Entra application and create a new service principal](../../ai-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Document Intelligence by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Microsoft Entra application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`DocumentIntelligenceClient`** instance including the **`DefaultAzureCredential`**:

    ```python
    from azure.identity import DefaultAzureCredential
    from azure.ai.documentintelligence import DocumentIntelligenceClient

    credential = DefaultAzureCredential()
    client = DocumentIntelligenceClient(
        endpoint="<your-endpoint>",
        credential=credential
    )
    ```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-python/blob/7c42462ac662522a6fd21b17d2a20f4cd40d0356/sdk/documentintelligence/azure-ai-documentintelligence/README.md#authenticate-the-client)

---

### 4. Build your application

Create a client object to interact with the Document Intelligence SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, try a [quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) in a language of your choice.

## Help options

The [Microsoft Q&A](/answers/tags/440/document-intelligence) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-ai-document-intelligence) forums are available for the developer community to ask and answer questions about Azure AI Document Intelligence and other services. Microsoft monitors the forums and replies to questions that the community has yet to answer. To make sure, use the following tags so that we see your question

* Microsoft Q&A: **`Azure AI Document Intelligence`**.

* Stack Overflow: **`azure-ai-document-intelligence`**

## Next steps

> [!div class="nextstepaction"]
>Explore  [**Document Intelligence REST API 2023-10-31-rest**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) operations.
