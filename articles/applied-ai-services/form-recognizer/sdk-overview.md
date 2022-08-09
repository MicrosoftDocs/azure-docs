---
title: About the Form Recognizer SDK?
titleSuffix: Azure Applied AI Services
description: The Form Recognizer software development kit (SDK) exposes Form Recognizer models, features and capabilities, making it easier to develop document-processing applications.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 08/16/2022
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD024 -->

# What is the Form Recognizer SDK?

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to analyze text and structured data from your documents. The Form Recognizer software development kit (SDK) is a set of libraries and tools that enable you easily integrate Form Recognizer models and capabilities into your applications. The SDK is available in C#, Java, JavaScript, and Python programming languages and across platforms.

## Supported languages

Form Recognizer SDK supports the following languages and platforms:

| Programming language | Package| Reference |Platform support |
|----------------------|----------|----------| ----------------|
|[C#](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-csharp#set-up)| [NuGet](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.4)  | [.NET](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet-preview&preserve-view=true) |[Windows, macOS, Linux, Docker](/dotnet.microsoft.com/download)|
|[Java](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-java#set-up) |[Maven](https://search.maven.org/artifact/com.azure/azure-ai-formrecognizer/4.0.0-beta.5/jar) | [Java](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)|[Windows, macOS, Linux](/java/openjdk/install)|
|[JavaScript](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-javascript#set-up)| [npm](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.5)| [Node.js](/javascript/api/@azure/ai-form-recognizer/?view=azure-node-preview&preserve-view=true) | [Browser, Windows, macOS, Linux](https://nodejs.org/en/download/) |
|[Python](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-python#set-up) | |[PyPI](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b5/) [Python](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer?view=azure-python-preview&preserve-view=true) |[Windows, macOS, Linux](/azure/developer/python/configure-local-development-environment?tabs=windows%2Capt%2Ccmd#use-the-azure-cli)

## How to use the Form Recognizer SDK in your applications

1. Install the SDK client package for your programming language. Import that package into your application using a requirement specifier or directive at the top of your application:

### [C#](#tab/csharp)

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

1. Set up authentication for your application. There are two supported methods for authentication:

#### Use your API key from the Azure portal with AzureKeyCredential from azure.core.credentials

### [C#](#tab/csharp)

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

### Use an [Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) token credential from the Azure Identity library to authenticate with Azure Active Directory

### [C#](#tab/csharp)

Authorization is easiest using DefaultAzureCredential. It finds the best credential to use in its running environment. To use the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet):

1. Install the [Azure Identity library for .NET](/dotnet/api/overview/azure/identity-readme):

```console
dotnet add package Azure.Identity
```

```powershell
Install-Package Azure.Identity
```

1. [Register an Azure AD application and create a new service principal](/azure/cognitive-services/authentication?tabs=powershell#assign-a-role-to-a-service-principal)

1. Grant access to Form Recognizer by assigning the `Cognitive Services User` role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`, respectively.

1. Create your `DocumentAnalysisClient` instance including the `DefaultAzureCredential`:

```csharp
string endpoint = "<your-endpoint>";
var client = new DocumentAnalysisClient(new Uri(endpoint), new DefaultAzureCredential());
```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.FormRecognizer_4.0.0-beta.4/sdk/formrecognizer/Azure.AI.FormRecognizer#authenticate-the-client)

### [Java](#tab/java)

Authorization is easiest using DefaultAzureCredential. It finds the best credential to use in its running environment. To use the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable), 

1. Install the [Azure Identity library for Java](/java/api/overview/azure/identity-readme?view=azure-java-stable):

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.5.3</version>
</dependency>
```

1. [Register an Azure AD application and create a new service principal](/azure/cognitive-services/authentication?tabs=powershell#assign-a-role-to-a-service-principal)

1. Grant access to Form Recognizer by assigning the `Cognitive Services User` role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`, respectively.

1. Create your `DocumentAnalysisClient` instance and `TokenCredential` variable:

```java
TokenCredential credential = new DefaultAzureCredentialBuilder().build();
DocumentAnalysisClient documentAnalysisClient = new DocumentAnalysisClientBuilder()
    .endpoint("{your-endpoint}")
    .credential(credential)
    .buildClient();
```

For more information, *see* [Authenticate the client](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/formrecognizer/azure-ai-formrecognizer#authenticate-the-client)

### [JavaScript](#tab/javascript)

Authorization is easiest using DefaultAzureCredential. It finds the best credential to use in its running environment. To use the [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest):

1. Install the [Azure Identity library for JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest):

```javascript
npm install @azure/identity
```

1. [Register an Azure AD application and create a new service principal](/azure/cognitive-services/authentication?tabs=powershell#assign-a-role-to-a-service-principal)

1. Grant access to Form Recognizer by assigning the `Cognitive Services User` role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`, respectively.

1. Create your `DocumentAnalysisClient` instance including the `DefaultAzureCredential`:

```javascript
const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const { DefaultAzureCredential } = require("@azure/identity");

const client = new DocumentAnalysisClient("<your-endpoint>", new DefaultAzureCredential());
```

For more information, *see* [Create and authenticate a client](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/formrecognizer/ai-form-recognizer#create-and-authenticate-a-client).

### [Python](#tab/python)

Authorization is easiest using DefaultAzureCredential. It finds the best credential to use in its running environment. To use the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python):

1. Install the [Azure Identity library for Python](/python/api/overview/azure/identity-readme?view=azure-python):

```python
pip install azure-identity
```

1. Grant access to Form Recognizer by assigning the `Cognitive Services User` role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`, respectively.

1. Create your `DocumentAnalysisClient` instance including the `DefaultAzureCredential`:

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

## Help options

The [Microsoft Q&A](/answers/topics/azure-form-recognizer.html) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-form-recognizer) forums are available for the developer community to ask and answer questions about Azure Cognitive Speech and other services. Microsoft monitors the forums and replies to questions that the community hasn't yet answered. To make sure that we see your question, tag it with 'azure-speech'.