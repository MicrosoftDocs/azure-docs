---
title: Azure Text Translation SDKs 
titleSuffix: Azure AI services
description: Azure Text Translation software development kits (SDKs) expose Text Translation features and capabilities, using C#, Java, JavaScript, and Python programming language.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.custom: devx-track-python
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->

# Azure Text Translation SDK (preview)

> [!IMPORTANT]
>
> * The Translator text SDKs are currently available in public preview. Features, approaches and processes may change, prior to General Availability (GA), based on user feedback.

Azure Text Translation is a cloud-based REST API feature of the Azure AI Translator service. The Text Translation API enables quick and accurate source-to-target text translations in real time. The Text Translation software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Text Translation REST API capabilities into your applications. Text Translation SDK is available across programming platforms in C#/.NET, Java, JavaScript, and Python.

## Supported languages

Text Translation SDK supports the programming languages and platforms:

| Language → SDK version | Package|Client library| Supported API version|
|:----------------------:|:----------|:----------|:-------------|
|[.NET/C# → 1.0.0-beta.1](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.Translation.Text/1.0.0-beta.1/index.html)|[NuGet](https://www.nuget.org/packages/Azure.AI.Translation.Text/1.0.0-beta.1)|[Azure SDK for .NET](/dotnet/api/overview/azure/ai.translation.text-readme?view=azure-dotnet-preview&preserve-view=true)|Translator v3.0|
|[Java&#x2731; → 1.0.0-beta.1](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-translation-text/1.0.0-beta.1/index.html)|[MVN repository](https://mvnrepository.com/artifact/com.azure/azure-ai-translation-text/1.0.0-beta.1)|[Azure SDK for Java](/java/api/overview/azure/ai-translation-text-readme?view=azure-java-preview&preserve-view=true)|Translator v3.0|
|[JavaScript → 1.0.0-beta.1](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-cognitiveservices-translatortext/1.0.0/index.html)|[npm](https://www.npmjs.com/package/@azure-rest/ai-translation-text/v/1.0.0-beta.1)|[Azure SDK for JavaScript](/javascript/api/overview/azure/text-translation?view=azure-node-preview&preserve-view=true) |Translator v3.0 |
|**Python → 1.0.0b1**|[PyPi](https://pypi.org/project/azure-ai-translation-text/1.0.0b1/)|[Azure SDK for Python](/python/api/azure-ai-translation-text/azure.ai.translation.text?view=azure-python-preview&preserve-view=true) |Translator v3.0|

&#x2731; The Azure Text Translation SDK for Java is tested and supported on Windows, Linux, and macOS platforms. It isn't tested on other platforms and doesn't support Android deployments.

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

The Text Translation SDK enables the use and management of the Text Translation service in your application. The SDK builds on the underlying Text Translation REST API allowing you to easily use those APIs within your programming language paradigm. Here's how you use the Text Translation SDK for your preferred programming language:

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
import java.util.List;
import java.util.ArrayList;
import com.azure.ai.translation.text.models.*;
import com.azure.ai.translation.text.TextTranslationClientBuilder;
import com.azure.ai.translation.text.TextTranslationClient;

import com.azure.core.credential.AzureKeyCredential;
```

### [JavaScript](#tab/javascript)

```javascript
const {TextTranslationClient } = require("@azure-rest/ai-translation-text").default;
```

### [Python](#tab/python)

```python
from azure.core.credentials import TextTranslationClient
from azure-ai-translation-text import TextTranslationClient
```

---

### 3. Authenticate the client

Interaction with the Translator service using the client library begins with creating an instance of the `TextTranslationClient`class. You need your API key and region to instantiate a client object.
The Text Translation API key is found in the Azure portal:

:::image type="content" source="media/keys-and-endpoint-text-sdk.png" alt-text="Screenshot of the keys and endpoint location in the Azure portal.":::

### [C#/.NET](#tab/csharp)

**Using the global endpoint (default)**

```csharp
string key = "<your-key>";

AzureKeyCredential credential = new(key);
TextTranslationClient client = new(credential);
```

**Using a regional endpoint**

```csharp

Uri endpoint = new("<your-endpoint>");
string key = "<your-key>";
string region = "<region>";

AzureKeyCredential credential = new(key);
TextTranslationClient client = new(credential, region);
```

### [Java](#tab/java)

**Using the global endpoint (default)**

```java

String apiKey = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(apiKey);

TextTranslationClient client = new TextTranslationClientBuilder()
            .credential(credential)
            .buildClient();
```

**Using a regional endpoint**

```java
String apiKey = "<your-key>";
String endpoint = "<your-endpoint>";
String region = "<region>";

AzureKeyCredential credential = new AzureKeyCredential(apiKey);

TextTranslationClient client = new TextTranslationClientBuilder()
.credential(credential)
.region(region)
.endpoint(endpoint)
.buildClient();

```

### [JavaScript](#tab/javascript)

```javascript

const TextTranslationClient = require("@azure-rest/ai-translation-text").default,

const apiKey = "<your-key>";
const endpoint = "<your-endpoint>";
const region = "<region>";

```

### [Python](#tab/python)

```python

from azure.ai.translation.text import TextTranslationClient, TranslatorCredential
from azure.ai.translation.text.models import InputTextItem
from azure.core.exceptions import HttpResponseError

key = "<your-key>"
endpoint = "<your-endpoint>"
region = "<region>"


credential = TranslatorCredential(key, region)
text_translator = TextTranslationClient(endpoint=endpoint, credential=credential)
```

---

### 4. Build your application

### [C#/.NET](#tab/csharp)

Create a client object to interact with the Text Translation SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, *see* the Text Translation [sample repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/translation/Azure.AI.Translation.Text/samples) for .NET/C#.

### [Java](#tab/java)

Create a client object to interact with the Text Translation SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, *see* the Text Translation [sample repository](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/translation/azure-ai-translation-text/src/samples/java/com/azure/ai/translation/text) for Java.

### [JavaScript](#tab/javascript)

Create a client object to interact with the Text Translation SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, *see* the Text Translation [sample repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/translation/ai-translation-text-rest/samples/v1-beta) for JavaScript or TypeScript.

### [Python](#tab/python)

Create a client object to interact with the Text Translation SDK, and then call methods on that client object to interact with the service. The SDKs provide both synchronous and asynchronous methods. For more insight, *see* the Text Translation [sample repository](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/translation/azure-ai-translation-text/samples) for Python.

---

## Help options

The [Microsoft Q&A](/answers/tags/132/azure-translator) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-text-translation) forums are available for the developer community to ask and answer questions about Azure Text Translation and other services. Microsoft monitors the forums and replies to questions that the community has yet to answer. To make sure that we see your question, tag it with **`azure-text-translation`**.

## Next steps

>[!div class="nextstepaction"]
> [**Text Translation quickstart**](quickstart-text-sdk.md)

>[!div class="nextstepaction"]
> [**Text Translation v3.0 reference guide**](reference/v3-0-reference.md)
