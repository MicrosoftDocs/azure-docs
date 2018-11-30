---
title: "Quickstart: Translate text, Java - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you translate text from one language to another using the Translator Text API with Java.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 06/21/2018
ms.author: erhopf
---
# Quickstart: Translate text with the Translator Text REST API (Java)

In this quickstart, you'll learn how to translate a text string from English to Italian and German using Java and the Translator Text REST API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

* [JDK 7 or later](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [Gradle](https://gradle.org/install/)
* An Azure subscription key for Translator Text

## Create a project with Gradle

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

## Configure your build file

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
    compile("com.google.code.gson:gson:2.8.5")
}
```

If you'd like to learn more about Gradle builds, see [Creating New Gradle Builds](https://guides.gradle.org/creating-new-gradle-builds/).



## Translate request

The following code translates source text from one language to another using the [Translate](./reference/v3-0-translate.md) method.

1. Create a new Java project in your favorite code editor.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as Translate.java.
2. Run:
    javac Translate.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
    java -cp .;gson-2.8.1.jar Translate
*/

public class Translate {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
    static String subscriptionKey = "ENTER KEY HERE";

    static String host = "https://api.cognitive.microsofttranslator.com";
    static String path = "/translate?api-version=3.0";

    // Translate to German and Italian.
    static String params = "&to=de&to=it";

    static String text = "Hello world!";

    public static class RequestBody {
        String Text;

        public RequestBody(String text) {
            this.Text = text;
        }
    }

    public static String Post (URL url, String content) throws Exception {
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Content-Length", content.length() + "");
        connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
        connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
        connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        byte[] encoded_content = content.getBytes("UTF-8");
        wr.write(encoded_content, 0, encoded_content.length);
        wr.flush();
        wr.close();

        StringBuilder response = new StringBuilder ();
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        String line;
        while ((line = in.readLine()) != null) {
            response.append(line);
        }
        in.close();

        return response.toString();
    }

    public static String Translate () throws Exception {
        URL url = new URL (host + path + params);

        List<RequestBody> objList = new ArrayList<RequestBody>();
        objList.add(new RequestBody(text));
        String content = new Gson().toJson(objList);

        return Post(url, content);
    }

    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            String response = Translate ();
            System.out.println (prettify (response));
        }
        catch (Exception e) {
            System.out.println (e);
        }
    }
}
```

## Translate response

A successful response is returned in JSON as shown in the following example:

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "translations": [
      {
        "text": "Hallo Welt!",
        "to": "de"
      },
      {
        "text": "Salve, mondo!",
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
