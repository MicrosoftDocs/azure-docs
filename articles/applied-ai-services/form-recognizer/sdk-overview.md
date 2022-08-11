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
<!-- markdownlint-disable MD023 -->

# What is the Form Recognizer SDK?

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to analyze text and structured data from documents. The Form Recognizer software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Form Recognizer models and capabilities into your applications. The SDK is available in C#, Java, JavaScript, and Python programming languages and across platforms.

## Supported languages

Form Recognizer SDK supports the following languages and platforms:

| Programming language | Package| Reference |Platform support |
|:----------------------:|:----------|:----------| :----------------|
|[C#](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-csharp#set-up)| [NuGet](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0-beta.5)  | [.NET](/dotnet/api/azure.ai.formrecognizer?view=azure-dotnet-preview&preserve-view=true) |[Windows, macOS, Linux, Docker](/dotnet.microsoft.com/download)|
|[Java](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-java#set-up) |[Maven](https://search.maven.org/artifact/com.azure/azure-ai-formrecognizer/4.0.0-beta.5/jar) | [Java](/java/api/overview/azure/ai-formrecognizer-readme?view=azure-java-preview&preserve-view=true)|[Windows, macOS, Linux](/java/openjdk/install)|
|[JavaScript](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-javascript#set-up)| [npm](https://www.npmjs.com/package/@azure/ai-form-recognizer/v/4.0.0-beta.6)| [Node.js](/javascript/api/@azure/ai-form-recognizer/?view=azure-node-preview&preserve-view=true) | [Browser, Windows, macOS, Linux](https://nodejs.org/en/download/) |
|[Python](quickstarts/get-started-v3-sdk-rest-api.md?pivots=programming-language-python#set-up) | [PyPI](https://pypi.org/project/azure-ai-formrecognizer/3.2.0b6/)| [Python](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer?view=azure-python-preview&preserve-view=true) |[Windows, macOS, Linux](/azure/developer/python/configure-local-development-environment?tabs=windows%2Capt%2Ccmd#use-the-azure-cli)

## How to use the Form Recognizer SDK in your applications

The SDKS support using and managing the Form Recognizer from your programming language application code. The Form Recognizer SDK builds on the underlying Form Recognizer REST API allowing you to easily use those APIs within your programming language paradigm. Here's how you use the Form Recognizer SDK:

### 1. Install the SDK client package for your programming language

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

### 2. Import your programming language SDK package into your application

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

### 3. Set up authentication for your application

There are two supported methods for authentication

* Use a [Form Recognizer API key](#use-your-api-key-from-the-azure-portal) with AzureKeyCredential from azure.core.credentials.

    :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of the keys and endpoint location in the Azure portal.":::

* Use a [token credential from azure-identity](#use-an-azure-active-directory-azure-ad-token-credential) to authenticate with [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis).

#### Use your API key from the Azure portal

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

### Use an Azure Active Directory (Azure AD)) token credential

> [!NOTE]
> Regional endpoints do not support AAD authentication. Create a [custom subdomain](/azure/cognitive-services/authentication?tabs=powershell#create-a-resource-with-a-custom-subdomain) for your resource in order to use this type of authentication.

Authorization is easiest using DefaultAzureCredential. It provides a default token credential capable of handling most Azure authentication scenarios. It uses an identity-based credential based upon the running environment.

### [C#](#tab/csharp)

Here's how to acquire and use the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) in .NET applications:

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

Here's how to acquire and use the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable) in Java applications.

To use the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable),

1. Install the [Azure Identity library for Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true):

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

Here's how to acquire and use the [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest) in JavaScript applications.

1. Install the [Azure Identity library for JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true):

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

Here's how to acquire and use the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) in Python applications.

1. Install the [Azure Identity library for Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true):

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

#### Write code supported by the Form Recognizer SDK

Your code will first create a client object to interact with Form Recognizer SDK and then call methods on that client object to interact with the service. The SDK provides both synchronous and asynchronous methods. For more insight, try the [quickstart](quickstarts/get-started-v3-sdk-rest-api.md) in a language of your choice.

## Help options

The [Microsoft Q&A](/answers/topics/azure-form-recognizer.html) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-form-recognizer) forums are available for the developer community to ask and answer questions about Azure Cognitive Speech and other services. Microsoft monitors the forums and replies to questions that the community hasn't yet answered. To make sure that we see your question, tag it with 'azure-form-recognizer'.

## Next steps

>[!div class="nextstepaction"]
> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio)

> [!div class="nextstepaction"]
> [Form Recognizer REST API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-06-30-preview/operations/AnalyzeDocument)