---
title: "Quickstart: Look up words with bilingual dictionary, Java - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to get alternate translations for a term, and also usage examples of those alternate translations, using Java and the Translator Text API.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/04/2019
ms.author: swmachan
---

# Quickstart: Look up words with bilingual dictionary using Java

In this quickstart, you'll learn how to get alternate translations for a term, and also usage examples of those alternate translations, using Java and the Translator Text API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

>[!TIP]
> If you'd like to see all the code at once, the source code for this sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-Java).

## Prerequisites

* [JDK 7 or later](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [Gradle](https://gradle.org/install/)
* An Azure subscription key for Translator Text

## Initialize a project with Gradle

Let's start by creating a working directory for this project. From the command line (or terminal), run this command:

```console
mkdir alt-translation-sample
cd alt-translation-sample
```

Next, you're going to initialize a Gradle project. This command will create essential build files for Gradle, most importantly, the `build.gradle.kts`, which is used at runtime to create and configure your application. Run this command from your working directory:

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

## Configure the build file

Locate `build.gradle.kts` and open it with your favorite IDE or text editor. Then copy in this build configuration:

```
plugins {
    java
    application
}
application {
    mainClassName = "AltTranslation"
}
repositories {
    mavenCentral()
}
dependencies {
    compile("com.squareup.okhttp:okhttp:2.5.0")
    compile("com.google.code.gson:gson:2.8.5")
}
```

Take note that this sample has dependencies on OkHttp for HTTP requests, and Gson to handle and parse JSON. If you'd like to learn more about build configurations, see [Creating New Gradle Builds](https://guides.gradle.org/creating-new-gradle-builds/).

## Create a Java file

Let's create a folder for your sample app. From your working directory, run:

```console
mkdir -p src\main\java
```

Next, in this folder, create a file named `AltTranslation.java`.

## Import required libraries

Open `AltTranslation.java` and add these import statements:

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import com.squareup.okhttp.*;
```


## Define variables

First, you'll need to create a public class for your project:

```java
public class AltTranslation {
  // All project code goes here...
}
```

Add these lines to the `AltTranslation` class. You'll notice that along with the `api-version`, two additional parameters have been appended to the `url`. These parameters are used to set the translation input and output. In this sample, these are English (`en`) and Spanish (`es`).

```java
String subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
String url = "https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=3.0&from=en&to=es";
```

If you are using a Cognitive Services multi-service subscription, you must also include the `Ocp-Apim-Subscription-Region` in your request parameters. [Learn more about authenticating with the multi-service subscription](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

## Create a client and build a request

Add this line to the `AltTranslation` class to instantiate the `OkHttpClient`:

```java
// Instantiates the OkHttpClient.
OkHttpClient client = new OkHttpClient();
```

Next, let's build the POST request. Feel free to change the text for translation.

```java
// This function performs a POST request.
public String Post() throws IOException {
    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType,
            "[{\n\t\"Text\": \"Pineapples\"\n}]");
    Request request = new Request.Builder()
            .url(url).post(body)
            .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey)
            .addHeader("Content-type", "application/json").build();
    Response response = client.newCall(request).execute();
    return response.body().string();
}
```

## Create a function to parse the response

This simple function parses and prettifies the JSON response from the Translator Text service.

```java
// This function prettifies the json response.
public static String prettify(String json_text) {
    JsonParser parser = new JsonParser();
    JsonElement json = parser.parse(json_text);
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    return gson.toJson(json);
}
```

## Put it all together

The last step is to make a request and get a response. Add these lines to your project:

```java
public static void main(String[] args) {
    try {
        AltTranslation altTranslationRequest = new AltTranslation();
        String response = altTranslationRequest.Post();
        System.out.println(prettify(response));
    } catch (Exception e) {
        System.out.println(e);
    }
}
```

## Run the sample app

That's it, you're ready to run your sample app. From the command line (or terminal session), navigate to the root of your working directory and run:

```console
gradle build
```

When the build completes, run:

```console
gradle run
```

## Sample response

```json
[
  {
    "normalizedSource": "pineapples",
    "displaySource": "pineapples",
    "translations": [
      {
        "normalizedTarget": "piñas",
        "displayTarget": "piñas",
        "posTag": "NOUN",
        "confidence": 0.7016,
        "prefixWord": "",
        "backTranslations": [
          {
            "normalizedText": "pineapples",
            "displayText": "pineapples",
            "numExamples": 5,
            "frequencyCount": 158
          },
          {
            "normalizedText": "cones",
            "displayText": "cones",
            "numExamples": 5,
            "frequencyCount": 13
          },
          {
            "normalizedText": "piña",
            "displayText": "piña",
            "numExamples": 3,
            "frequencyCount": 5
          },
          {
            "normalizedText": "ganks",
            "displayText": "ganks",
            "numExamples": 2,
            "frequencyCount": 3
          }
        ]
      },
      {
        "normalizedTarget": "ananás",
        "displayTarget": "ananás",
        "posTag": "NOUN",
        "confidence": 0.2984,
        "prefixWord": "",
        "backTranslations": [
          {
            "normalizedText": "pineapples",
            "displayText": "pineapples",
            "numExamples": 2,
            "frequencyCount": 16
          }
        ]
      }
    ]
  }
]
```

## Next steps

Take a look at the API reference to understand everything you can do with the Translator Text API.

> [!div class="nextstepaction"]
> [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)

## See also

* [Translate text](quickstart-java-translate.md)
* [Transliterate text](quickstart-java-transliterate.md)
* [Identify the language by input](quickstart-java-detect.md)
* [Get a list of supported languages](quickstart-java-languages.md)
* [Determine sentence lengths from an input](quickstart-java-sentences.md)
