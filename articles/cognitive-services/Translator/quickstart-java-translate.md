---
title: "Quickstart: Translate text, Java - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to translate a text string from English to Italian and German using Java and the Translator Text REST API.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 11/30/2018
ms.author: erhopf
---
# Quickstart: Translate text with the Translator Text REST API (Java)

In this quickstart, you'll learn how to translate a text string from English to Italian and German using Java and the Translator Text REST API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

* [JDK 7 or later](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [Gradle](https://gradle.org/install/)
* An Azure subscription key for Translator Text

## Initialize a project with Gradle

Let's start by creating a working directory for this project. From the command line (or terminal), run this command:

```console
mkdir translator-sample
cd translator-sample
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
    mainClassName = "Translate"
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
mkdir -p src/main/java
```

Next, in this folder, create a file named `Translate.java`.

## Import required libraries

Open `Translate.java` and add these import statements:

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;
```

## Add the subscription key and host URL

First, you'll need to create a public class for your project:

```java
public class Translate {
  // All project code goes here...
}
```

Add these lines to the `Translate` class. You'll notice that along with the `api-version`, two additional parameters have been appended to the `url`. These parameters are used to set the translation outputs. In this sample, it's set to German (`de`) and Italian (`it`). Make sure you update the subscription key value.

```java
String subscriptionKey = "ae3194e69b09498ea39245a8e399e6c0";
String url = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=de,it";
```

## Instantiate the HTTP client and build a request

Add this line to the `Translate` class to instantiate the `OkHttpClient`:

```java
// Instantiates the OkHttpClient.
OkHttpClient client = new OkHttpClient();
```

Next, let's build the POST request. Feel free to change the text for translation. The text must be escaped.

```java
// This function performs a POST request.
public String Post() throws IOException {
    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType,
            "[{\n\t\"Text\": \"Welcome to Microsoft Translator. Guess how many languages I speak!\"\n}]");
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
        Translate translateRequest = new Translate();
        String response = translateRequest.Post();
        System.out.println(prettify(response));
    } catch (Exception e) {
        System.out.println(e);
    }
}
```

## Run the sample app

That's it, you're ready to run your sample app. From the command line (or terminal session), navigate to your project directory and run:

```console
gradle build
```

## Sample response

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "translations": [
      {
        "text": "Willkommen bei Microsoft Translator. Erraten Sie, wie viele Sprachen ich spreche!",
        "to": "de"
      },
      {
        "text": "Benvenuti a Microsoft Translator. Indovinate quante lingue parlo!",
        "to": "it"
      }
    ]
  }
]
```

## Next steps

Explore the sample code for this quickstart and others, including transliteration and language identification, as well as other sample Translator Text projects on GitHub.

> [!div class="nextstepaction"]
> [Explore Java examples on GitHub](https://aka.ms/TranslatorGitHub?type=&language=java)

## See also

* [Transliterate text](quickstart-java-transliterate.md)
* [Identify the language by input](quickstart-java-detect.md)
* [Get alternate translations](quickstart-java-dictionary.md)
* [Get a list of supported languages](quickstart-java-languages.md)
* [Determine sentence lengths from an input](quickstart-java-sentences.md)
