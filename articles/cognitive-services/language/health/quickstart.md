---
title: "Quickstart: Use the Health API"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to using the Health API, one of the features of the Language services from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 06/11/2021
ms.author: aahi
keywords: text mining, NER, PII, text analytics
zone_pivot_groups: programming-languages-text-analytics       
---

# Quickstart: Use the Health API

Use this article to get started with performing NER and PII using the Language Services client library and REST API. Follow these steps to try out examples code for mining text:

* Named Entity Recognition
* Personally Identifying Information

> [!IMPORTANT]
> The code in this article uses basic examples and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the samples linked below.
::: zone pivot="programming-language-csharp"

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.1.0-beta.7) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Text Analytics resource with the standard (S) pricing tier.

::: zone-end

::: zone pivot="programming-language-java"

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.1.0-beta.7) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (JDK) with version 8 or above
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Text Analytics resource with the standard (S) pricing tier.

::: zone-end

::: zone pivot="programming-language-javascript"

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.1.0-beta.7) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org/).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Text Analytics resource with the standard (S) pricing tier.

::: zone-end

::: zone pivot="programming-language-python"

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.1.0-beta.7) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Text Analytics resource with the standard (S) pricing tier.

::: zone-end

::: zone pivot="rest-api"

* The current version of [cURL](https://curl.haxx.se/).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Text Analytics resource"  target="_blank">create a Text Analytics resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Text Analytics API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!NOTE]
> * The following BASH examples use the `\` line continuation character. If your console or terminal uses a different line continuation character, use that character.
> * You can find language specific samples on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code).
> * Go to the Azure portal and find the key and endpoint for the Text Analytics resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**. Then replace the strings in the code below with your key and endpoint.
To call the Text Analytics API, you need the following information:

|parameter  |Description  |
|---------|---------|
|`-X POST <endpoint>`     | Specifies your endpoint for accessing the API.        |
|`-H Content-Type: application/json`     | The content type for sending JSON data.          |
|`-H "Ocp-Apim-Subscription-Key:<key>`    | Specifies the key for accessing the API.        |
|`-d <documents>`     | The JSON containing the documents you want to send.         |

The following cURL commands are executed from a BASH shell. Edit these commands with your own resource name, resource key, and JSON values.

::: zone-end

## Setting up

::: zone pivot="programming-language-csharp"

Using the Visual Studio IDE, create a new .NET Core console app. This will create a "Hello World" project with a single C# source file: *program.cs*.

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `TBD`. Select version `x.y.z`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).


> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/TextAnalytics/program.cs), which contains the code examples in this quickstart.
::: zone-end

::: zone pivot="programming-language-java"

Create a Maven project in your preferred IDE or development environment. Then add the following dependency to your project's *pom.xml* file. You can find the implementation syntax [for other build tools](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.1.0-beta.7) online.

```xml
<dependencies>
     <dependency>
        <groupId>com.azure</groupId>
        <artifactId>TBD</artifactId>
        <version>x.y.z</version>
    </dependency>
</dependencies>
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/TextAnalytics/TextAnalyticsSamples.java), which contains the code examples in this quickstart. 

::: zone-end

::: zone pivot="programming-language-javascript"

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp 

cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```
### Set up your application

Install the `@azure/TBD` NPM packages:

```console
npm install --save @azure/TBD@x.y.z
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/TextAnalytics/text-analytics-v3-client-library.js), which contains the code examples in this quickstart. 
::: zone-end

::: zone pivot="programming-language-python"

After installing Python, you can install the client library with:

```console
pip install azure-ai-TBD==x.y.z
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/TextAnalytics/python-v3-client-library.py), which contains the code examples in this quickstart. 
::: zone-end

::: zone pivot="rest-api"

1. Copy the command into a text editor.
2. Make the following changes in the command where needed:
    1. Replace the value `<your-text-analytics-key-here>` with your key.
    2. Replace the first part of the request URL `<your-text-analytics-endpoint-here>` with the your own endpoint URL.
3. Open a command prompt window.
4. Paste the command from the text editor into the command prompt window, and then run the command.



::: zone-end

## Code example

::: zone pivot="programming-language-csharp"

## Named Entity Recognition

```csharp
TBD
```

## Personally Identifying Information (PII)

```csharp
TBD
```

::: zone-end

::: zone pivot="programming-language-java"

```java
TBD
```

::: zone-end

::: zone pivot="programming-language-javascript"

```javascript
TBD
```
::: zone-end

::: zone pivot="programming-language-python"

```python
TBD
```
::: zone-end

::: zone pivot="rest-api"


> [!NOTE]
> The below example includes a request for the Opinion Mining feature of Sentiment Analysis using the `opinionMining=true` parameter, which provides granular information about assessments (adjectives) related to targets (nouns) in the text.
```bash
TBD
```

If you send a JSON document in the body of your request using the REST API, it should have an ID, language, and the text of the document:

```json
TBD
``` 

### JSON response

```json
TBD
``` 

::: zone-end

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

TBD