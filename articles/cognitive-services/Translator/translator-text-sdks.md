---
title: Azure Text Translation SDKs 
titleSuffix: Azure Applied AI Services
description: Azure Text Translation software development kits (SDKs) expose Text Translation features and capabilities, using C#, Java, JavaScript, and Python programming language.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 04/27/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->

# Azure Text Translation SDK (preview)

Azure Text Translation is a cloud-based REST API feature of the Azure Translator service. The Text Translation API enables quick and accurate source-to-target text translations in real time. The Text Translation software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Text Translation REST API capabilities into your applications. Text Translation SDK is available across platforms in C#/.NET, Java, JavaScript, and Python programming languages.

## Supported languages

Text Translation SDK supports the following languages and platforms:

| Language → SDK version | Package|Client library| Supported API version|
|:----------------------:|:----------|:----------|:-------------|
|[.NET/C# → 1.0.0-beta.1](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.Translation.Text/1.0.0-beta.1/index.html)|[NuGet](https://www.nuget.org/packages/Azure.AI.Translation.Text/1.0.0-beta.1)|[Azure SDK for .NET](/dotnet/api/overview/azure/ai.translation.text-readme?view=azure-dotnet-preview)|Translator v3.0|
|[Java → 1.0.0-beta.1](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-translation-text/1.0.0-beta.1/index.html) → ]|[MVN repository](https://mvnrepository.com/artifact/com.azure/azure-ai-translation-text/1.0.0-beta.1)|[Azure SDK for Java](/java/api/overview/azure/ai-translation-text-readme?view=azure-java-preview)|Translator v3.0|
|[JavaScript → 1.0.0-beta.1](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-cognitiveservices-translatortext/1.0.0/index.html)|[npm](https://www.npmjs.com/package/@azure-rest/ai-translation-text/v/1.0.0-beta.1)|[Azure SDK for JavaScript](/javascript/api/overview/azure/text-translation?view=azure-node-preview) |Translator v3.0 |
|[Python → 1.0.0b1](/python/api/azure-ai-translation-text/azure.ai.translation.text?view=azure-python-preview&preserve-view=true)|[PyPi](https://pypi.org/project/azure-ai-translation-text/1.0.0b1/)| [Azure SDK for Python]() |Translator v3.0|

## Changelog and release history

This section provides a version-based description of Text Translation feature and capability releases, changes, updates, and enhancements.

#### Translator Text SDK April 2023 preview release

This release includes the following updates:

### [**C#**](#tab/csharp)

* **Version 1.0.0-beta.1 (2023-04-17)**
* **Targets Text Translation v3.0**
* **Initial version release**

[**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.Translation.Text/1.0.0-beta.1)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/translation/Azure.AI.Translation.Text/CHANGELOG.md#100-beta1-2023-04-17)

[**README**](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/translation/Azure.AI.Translation.Text#readme)

[**Samples**](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/translation/Azure.AI.Translation.Text/samples)

### [**Java**](#tab/java)

* **Version 1.0.0-beta.1 (2023-04-18)**
* **Targets Text Translation v3.0**
* **Initial version release**

[**Package (MVN)**](https://mvnrepository.com/artifact/com.azure/azure-ai-translation-text/1.0.0-beta.1)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/translation/azure-ai-translation-text/CHANGELOG.md#100-beta1-2023-04-18)

[**README**](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/translation/azure-ai-translation-text#readme)

[**Samples**](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/translation/azure-ai-translation-text#next-steps)

### [**JavaScript**](#tab/javascript)

* **Version 1.0.0-beta.1 (2023-04-18)**
* **Targets Text Translation v3.0**
* **Initial version release**

[**Package (npm)**](https://www.npmjs.com/package/@azure-rest/ai-translation-text/v/1.0.0-beta.1)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/translation/ai-translation-text-rest/CHANGELOG.md#100-beta1-2023-04-18)

[**README**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/translation/ai-translation-text-rest/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/translation/ai-translation-text-rest/samples/v1-beta)

### [**Python**](#tab/python)

* **Version 1.0.0b1 (2023-04-19)**
* **Targets Text Translation v3.0**
* **Initial version release**

[**Package (PyPi)**](https://pypi.org/project/azure-ai-translation-text/1.0.0b1/)

[**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/translation/azure-ai-translation-text/CHANGELOG.md#100b1-2023-04-19)

[**README**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/translation/azure-ai-translation-text/README.md)

[**Samples**](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/translation/azure-ai-translation-text/samples)

---

## Use Text Translation SDK in your applications

The Text Translation SDK enables the use and management of the Text Translation service in your application. The SDK builds on the underlying Text Translation REST API allowing you to easily use those APIs within your programming language paradigm. Here's how you use the Text Translation SDK for your preferred language:

### 1. Install the SDK client library

### [C#/.NET](#tab/csharp)

```dotnetcli
dotnet add package Azure.AI.Translation.Text --version 1.0.0-beta.1
```

```powershell
Install-Package Azure.AI.Translation.Text -Version 1.0.0-beta.1
```

### [Java](#tab/java)

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-translation-text</artifactId>
    <version>1.0.0-beta.1</version>
</dependency>
```

```kotlin
implementation("com.azure:azure-ai-translation-text:1.0.0-beta.1")
```

### [JavaScript](#tab/javascript)

```javascript
npm i @azure-rest/ai-translation-text@1.0.0-beta.1
```

### [Python](#tab/python)

```python
pip install azure-ai-translation-text==1.0.0b1
```

---

### 2. Import the SDK client library into your application

### [C#/.NET](#tab/csharp)

```csharp
using Azure;
using Azure.AI.Translation.Text;
```

### [Java](#tab/java)

```java
import com.azure.ai.translation.text.models.*;
import com.azure.ai.translation.text.models.Translation;

import com.azure.core.credential.AzureKeyCredential;
```

### [JavaScript](#tab/javascript)

```javascript
const { TranslatorCredential, TextTranslationClient } = require("@azure-rest/ai-translation-text");
```

### [Python](#tab/python)

```python
from azure.core.credentials import TextTranslationClient
from azure-ai-translation-text import TextTranslationClient
```

---

### 3. Authenticate the client 

Interaction with the Translator service using the client library begins with creating an instance of the `TextTranslationClient`class. You will need your API key and region to instantiate a client object.
The Text Translation API key is found in the Azure portal:

:::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of the keys and endpoint location in the Azure portal.":::

### [C#/.NET](#tab/csharp)

**Using a regional endpoint**

```csharp

Uri endpoint = new("<your-endpoint>);
string key = "<your-key>";
string region = "<region>";
AzureKeyCredential credential = new(key);
TextTranslationClient client = new(credential, region);
```

**Using the global endpoint**

```csharp
Uri endpoint = new("<your-endpoint>");
string key = "<your-key>";
string region = "<region>";
AzureKeyCredential credential = new(key);
TextTranslationClient client = new(credential, endpoint);
```

### [Java](#tab/java)

**Using a regional endpoint**

```java

String apiKey = System.getenv("TEXT_TRANSLATOR_API_KEY");
String region = System.getenv("TEXT_TRANSLATOR_API_REGION");
AzureKeyCredential credential = new AzureKeyCredential(apiKey);

TextTranslationClient client = new TextTranslationClientBuilder()
.credential(credential)
.region(region)
.buildClient();

```

**Using the global endpoint**

```java

TextTranslationClient client = new TextTranslationClientBuilder()
            .credential(new AzureKeyCredential("<your-key>"))
            .endpoint("<your-endpoint>")
            .buildClient();
```

### [JavaScript](#tab/javascript)

**Using a regional endpoint**

```javascript
const translateCredential = new TranslatorCredential(apiKey, region);
const translationClient = TextTranslationClient(endpoint, translateCredential);
```

**Using the global endpoint**

```javascript

const endpoint = "<your-endpoint>";
const apiKey = "<your-key>";
const region = "<region>";

const translateCredential = {key: apiKey, region: region};

const translationClient = new TextTranslationClient(endpoint, translateCredential"));

```

### [Python](#tab/python)

```python

  translator_credential = TranslatorCredential("<apiKey>", "<region>")
  text_translator_client = TextTranslationClient(endpoint="<endpoint>", credential=translator_credential)
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

1. Grant access to Text Translation by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret in the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`TextTranslationClient`** instance including the **`DefaultAzureCredential`**:

    ```csharp
    string endpoint = "<your-endpoint>";
    var client = new TextTranslationClient(new Uri(endpoint), new DefaultAzureCredential());
    ```

For more information, *see* [Authenticate the client]())

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

1. Grant access to Text Translation by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`TextTranslationClient`** instance and **`TokenCredential`** variable:

    ```java
    TokenCredential credential = new DefaultAzureCredentialBuilder().build();
    TextTranslationClient TextTranslationClient = new TextTranslationClientBuilder()
        .endpoint("{your-endpoint}")
        .credential(credential)
        .buildClient();
    ```

For more information, *see* [Authenticate the client]()

### [JavaScript](#tab/javascript)

Here's how to acquire and use the [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest&preserve-view=true) for JavaScript applications:

1. Install the [Azure Identity library for JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true):

    ```javascript
    npm install @azure/identity
    ```

1. [Register an Azure AD application and create a new service principal](../../cognitive-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Text Translation by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`TextTranslationClient`** instance including the **`DefaultAzureCredential`**:

    ```javascript
    const { TextTranslationClient } = require("@azure/ai-translation-text");
    const { DefaultAzureCredential } = require("@azure/identity");

    const client = new TextTranslationClient("<your-endpoint>", new DefaultAzureCredential());
    ```

For more information, *see* [Create and authenticate a client]().

### [Python](#tab/python)

Here's how to acquire and use the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true) for Python applications.

1. Install the [Azure Identity library for Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true):

    ```python
    pip install azure-identity
    ```

1. [Register an Azure AD application and create a new service principal](../../cognitive-services/authentication.md?tabs=powershell#assign-a-role-to-a-service-principal).

1. Grant access to Text Translation by assigning the **`Cognitive Services User`** role to your service principal.

1. Set the values of the client ID, tenant ID, and client secret of the Azure AD application as environment variables: **`AZURE_CLIENT_ID`**, **`AZURE_TENANT_ID`**, and **`AZURE_CLIENT_SECRET`**, respectively.

1. Create your **`TextTranslationClient`** instance including the **`DefaultAzureCredential`**:

    ```python
    from azure.identity import DefaultAzureCredential
    from azure.ai.translation-text import TextTranslationClient

    credential = DefaultAzureCredential()
    text_translation_client = TextTranslationClient(
        endpoint="https://<my-custom-subdomain>.cognitiveservices.azure.com/",
        credential=credential
    )
    ```

For more information, *see* [Authenticate the client]()

---

### 4. Build your application

Create a client object to interact with the Text Translation SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, try the Text Translation [quickstart]() in a language of your choice.

## Help options

The [Microsoft Q&A](/answers/tags/132/azure-translator) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-text-translation) forums are available for the developer community to ask and answer questions about Azure Text Translation and other services. Microsoft monitors the forums and replies to questions that the community has yet to answer. To make sure that we see your question, tag it with **`azure-text-translation`**.

## Next steps

>[!div class="nextstepaction"]
> [**Text Translation v3.0 reference guide**](/reference/rest-api-guide.md)

>[!div class="nextstepaction"]
> [**Text Translation v3.0 REST APIs**](/reference/rest-api-guide.md)
