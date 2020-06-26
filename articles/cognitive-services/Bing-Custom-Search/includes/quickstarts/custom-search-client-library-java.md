---
title: Bing Custom Search Java client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 02/27/2020
ms.author: aahi
---

Get started with the Bing Custom Search client library for Java. Follow these steps to install the package and try out the example code for basic tasks. The Bing Custom Search API enables you to create tailored, ad-free search experiences for topics that you care about. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master/Search/BingCustomSearch)

Use the Bing Custom Search client library for Java to:

* Find search results on the web, from your Bing Custom Search instance. 

[Reference documentation](https://docs.microsoft.com/java/api/overview/azure/cognitiveservices/client/bingcustomsearch?view=azure-java-stable) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Search.BingCustomSearch) | [Artifact (Maven)](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customsearch/) | [Samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* The current version of the [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html).
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](../../quick-start.md) for more information.

[!INCLUDE [cognitive-services-bing-custom-search-prerequisites](~/includes/cognitive-services-bing-custom-search-signup-requirements.md)]

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `AZURE_BING_CUSTOM_SEARCH_API_KEY`.

### Create a new Gradle project

> [!TIP]
> If you're not using Gradle, you can find the client library details for other dependency managers on the [Maven Central Repository](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-textanalytics/).

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command creates essential build files for Gradle, including a *build.gradle.kts* file that is used at runtime to configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

## Install the client library 

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in this build configuration. Be sure to include the client library under `dependencies`:

```kotlin
plugins {
    java
    application
}
application {
    mainClassName = "main.java.BingCustomSearchSample"
}
repositories {
    mavenCentral()
}
dependencies {
    compile("org.slf4j:slf4j-simple:1.7.25")
    compile("com.microsoft.azure.cognitiveservices:azure-cognitiveservices-customsearch:1.0.2")
}
```

Create a folder for your sample app. From your working directory, run the following command:

```console
mkdir src/main/java
```

Navigate to the new folder and create a file called *BingCustomSearchSample.java*. Open it and add the following `import` statements:


[!code-java[import statements](~/cognitive-services-java-sdk-samples/Search/BingCustomSearch/src/main/java/BingCustomSearchSample.java?name=imports)]

Create a class named `BingCustomSearchSample`

```java
public class BingCustomSearchSample {
}
```

In the class, create a `main` method and a variable for your resource's key. If you created the environment variable after you launched the application, close and reopen the editor, IDE, or shell running it to access the variable. You will define the methods later.

[!code-java[main method](~/cognitive-services-java-sdk-samples/Search/BingCustomSearch/src/main/java/BingCustomSearchSample.java?name=main)]

## Object model

The Bing Custom Search client is a [BingCustomSearchAPI](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.bingcustomsearchapi?view=azure-java-stable) object that's created from the [BingCustomSearchManager](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.bingcustomsearchmanager?view=azure-java-stable) object's [authenticate()](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.bingcustomsearchmanager.authenticate) method. You can send a search request using the client's [BingCustomInstances.search()](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.bingcustominstances.search?view=azure-java-stable#com_microsoft_azure_cognitiveservices_search_customsearch_BingCustomInstances_search__) method.

The API response is a [SearchResponse](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.models.searchresponse?view=azure-java-stable) object containing information on the search query, and search results.

## Code examples

These code snippets show you how to do the following tasks with the Bing Custom Search client library for Java:

* [Authenticate the client](#authenticate-the-client)
* [Get search results from your custom search instance](#get-search-results-from-your-custom-search-instance)

## Authenticate the client

Your main method should include a [BingCustomSearchManager](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.bingcustomsearchapi?view=azure-java-stable) object that takes your key, and calls its `authenticate()`.

```java
BingCustomSearchAPI client = BingCustomSearchManager.authenticate(subscriptionKey);
```

## Get search results from your custom search instance

Use the client's [BingCustomInstances.search()](https://docs.microsoft.com/java/api/com.microsoft.azure.cognitiveservices.search.customsearch.bingcustominstances.search?view=azure-java-stable#com_microsoft_azure_cognitiveservices_search_customsearch_BingCustomInstances_search__) function to send a search query to your custom instance. Set the `withCustomConfig` to your custom configuration ID, or default to `1`. After getting a response from the API, check if any search results were found. If so, get the first search result by calling the response's `webPages().value().get()` function and print the result's name, and URL. 

[!code-java[call the custom search API](~/cognitive-services-java-sdk-samples/Search/BingCustomSearch/src/main/java/BingCustomSearchSample.java?name=runSample)]

## Run the application

Build the app with the following command from your project's main directory:

```console
gradle build
```

Run the application with the `run` goal:

```console
gradle run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web app](../../tutorials/custom-search-web-page.md)
