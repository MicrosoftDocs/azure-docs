---
title: Metrics Monitor Java quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 07/30/2020
ms.author: aahi
---

[Reference documentation](https://docs.microsoft.com/dotnet/api/Microsoft.Azure.CognitiveServices.AnomalyDetector?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/AnomalyDetector) | [Artifact (Maven)](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customsearch/1.0.2/jar) | [Samples](https://github.com/Azure-Samples/anomalydetector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to Metrics Advisor. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
    
## Setting up

### Create a new Gradle project

This quickstart uses the Gradle dependency manager. You can find more client library information on the [Maven Central Repository](https://search.maven.org/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-textanalytics/).

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts* which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

### Install the client library

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in this build configuration. Be sure to include the project dependencies.

```kotlin
dependencies {
    compile("com.squareup.okhttp:okhttp:2.5.0")
    compile("com.microsoft....") <!-- Consider highlighting the line containing the library-->
}
```

### Create a Java file

Create a folder for your sample app. From your working directory, run the following command:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *<classname>.java*. Open it in your preferred editor or IDE and add the following `import` statements:

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](), which contains the code examples in this quickstart.

```java
```

In the application's `[classname]` class, create variables for your resource's key and endpoint.

> [!IMPORTANT]
> Go to the Azure portal. If the Metrics Advisor resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

```java
private static String KEY = "<replace-with-your-metrics-advisor-key-here>";
private static String ENDPOINT = "<replace-with-your-metrics-advisor-endpoint-here>";
```

in the application’s `main()` method, add calls for the methods used in this quickstart. You’ll create these later.

```java
static void Main(string[] args){

    // You will create the below methods later in the quickstart
    exampleTask1();
}
```


## Object model

## Code examples

These code snippets show you how to do the following tasks with the Metrics Advisor client library for Java:

* [Authenticate the client](#)
* [Check ingestion status](#)
* [Setup detection configuration and alert configuration](#)
* [Query anomaly detection results](#)
* [Diagnose Anomalies](#)

### Authenticate the client

In a new method, instantiate a client with your endpoint and key. Create an object with your key, and use it with your endpoint to create an [ApiClient]() object.

```java

```

### Add a data feed from a sample or data source

### Check ingestion status

###	Setup detection configuration and alert configuration

###	Query anomaly detection results

###	Diagnose anomalies

You can build the app with:

```console
gradle build
```

Run the application with the `run` goal:

```console
gradle run
```
