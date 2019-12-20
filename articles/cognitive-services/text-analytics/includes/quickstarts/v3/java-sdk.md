---
title: "Quickstart: Text Analytics client library for Java | Microsoft Docs"
description: Get started with the Text Analytics client library for Java...
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: 
ms.topic: quickstart
ms.date: 12/20/2019
ms.author: aahi
---

# Quickstart: Text Analytics client library for Java

Get started with the Text Analytics client library for Java. Follow these steps to install the package and try out the example code for basic tasks. 

<!--
    These links aren't for the java language, and are included as examples. Include the following single line of links targeting the library's companion content at the bottom of the introduction; make adjustments as necessary, but try not to include any other links or content in the introduction.
-->

[Reference documentation](https://docs.microsoft.com/dotnet/api/Microsoft.Azure.CognitiveServices.AnomalyDetector?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/AnomalyDetector) | [Artifact (Maven)](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customsearch/1.0.2/jar) | [Samples](https://github.com/Azure-Samples/anomalydetector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of the [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.

## Setting up

<!--
Add any extra steps preparing an environment for working with the client library. 
-->

### Create a Text Analytics Azure resource
<!-- NOTE
The below is an "include" file, which is a text file that will be referenced, and rendered on the docs site.
These files are used to display text across multiple articles at once. Consider keeping them in-place for consistency with other articles.
 -->

[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

### Create a new Gradle project

If you're using the command line, use these steps to setup your application.

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts* which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in this build configuration:

```kotlin

```

Create a folder for your sample app. From your working directory, run the following command:

```console
mkdir -p src/main/java
```
<!-- replace <classname> with a descriptive name for your service-->
Navigate to the new folder and create a file called *<classname>.java*. Open it in your preferred editor or IDE and add the following `import` statements:

```java
```

In the application's class, create variables for your resource's key and endpoint. 

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

<!-- Use the below example variable names and example strings, for consistency with the other quickstart variables -->
```csharp
String key = "<replace-with-your-text-analytics-key-here>";
String endpoint = "<replace-with-your-text-analytics-endpoint-here>";
```

In the application's `main` method, create variables for your resource's Azure endpoint and key.
<!-- Use the below example variable names and example strings, for consistency with the other quickstart variables -->
<!-- 
    Be sure the main method calls the example task functions in this quickstart.
-->

```java
static void Main(string[] args)
{
    var client = authenticateClient(key, endpoint);

    sentimentAnalysisExample(client);
    languageDetectionExample(client);
    entityRecognitionExample(client);
    keyPhraseExtractionExample(client);
    Console.Write("Press any key to exit.");
    Console.ReadKey();
}
```

### Install the client library
<!-- remember to replace the code samples and links with ones relevant for the JAVA V3 version -->
This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-textanalytics/).

In your project's *build.gradle.kts* file, be sure to include the client library as an `implementation` statement. 

```kotlin
dependencies {
    compile("com.squareup.okhttp:okhttp:2.5.0")
    compile("com.microsoft....") <!-- Consider highlighting the line containing the library-->
}
```

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages.
    Briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclient?view=azure-dotnet) object that authenticates to Azure using your key, and provides functions to accept text as single strings or as a batch. You can send text to the API synchronously, or asynchronously. The response object will contain the analysis information for each document you send. 

## Code examples

These code snippets show you how to do the following tasks with the [Product Name] client library for Java:
<!-- If you add more code examples, add a link to them here-->
* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)

## Authenticate the client

In a new method, instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials]() object with your key, and use it with your endpoint to create an [ApiClient]() object.

```java

```

## Example task 1
(Example from a different article. See the other languages for specific examples of tasks and text layout): Create a new function called `SentimentAnalysisExample()` that takes the client that you created earlier, and call its [Sentiment()](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.textanalyticsclientextensions.sentiment?view=azure-dotnet) function. The returned [SentimentResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.textanalytics.models.sentimentresult?view=azure-dotnet) object will contain the sentiment `Score` if successful, and an `errorMessage` if not. 

A score that's close to 0 indicates a negative sentiment, while a score that's closer to 1 indicates a positive sentiment.

```java

```

## Example task 2

```java

```

## Run the application

You can build the app with:

```console
gradle build
```

Run the application with the `run` goal:

```console
gradle run
```
