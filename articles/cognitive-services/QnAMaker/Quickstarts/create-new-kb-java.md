---
title: "Quickstart: Create knowledge base - REST, Java - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account..
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 10/05/2018
ms.author: diberry
---

# Quickstart: Create a QnA Maker knowledge base in Java

This quickstart walks you through programmatically creating a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

## Prerequisites

* [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
* [Gson library](https://github.com/google/gson)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-java-repo-note.md)]

## Create a knowledge base file 

Create a file named `create-new-knowledge-base.java`

## Add the required dependencies

At the top of `create-new-knowledge-base.java`, add the following lines to add necessary dependencies to the project:

```java
import java.io.*;
import java.lang.reflect.Type;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/**
 * Gson: https://github.com/google/gson
 * Maven info:
 *    <dependency>
 *      <groupId>com.google.code.gson</groupId>
 *      <artifactId>gson</artifactId>
 *      <version>2.8.5</version>
 *    </dependency>
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
```

## Add the required constants
After the preceding required dependencies, add the required constants to the `CreateKB` class to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key.

```java
public class CreateKB {

    // Replace this with a valid subscription key.
    static String subscriptionKey = "<your-qna-maker-subscription-key>";

    // Components used to create HTTP request URIs for QnA Maker operations.
    static String host = "https://westus.api.cognitive.microsoft.com";
    static String service = "/qnamaker/v4.0";
    static String method = "/knowledgebases/create";

}
```

## Add the KB model definition classes
After the constants, add the following classes and functions inside the `CreateKB` class to serialize the model definition object into JSON.

```java
public static class KB {
    String name;
    Question[] qnaList;
    String[] urls;
    File[] files;
}

public static class Question {
    Integer id;
    String answer;
    String source;
    String[] questions;
    Metadata[] metadata;
}

public static class Metadata {
    String name;
    String value;
}

public static class File {
    String fileName;
    String fileUri;
}

public static KB GetKB () {
    KB kb = new KB ();
    kb.name = "Example Knowledge Base";

    Question q = new Question();
    q.id = 0;
    q.answer = "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa";
    q.source = "Custom Editorial";
    q.questions = new String[]{"How do I programmatically update my Knowledge Base?"};

    Metadata md = new Metadata();
    md.name = "category";
    md.value = "api";
    q.metadata = new Metadata[]{md};

    kb.qnaList = new Question[]{q};
    kb.urls = new String[]{"https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",     "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"};

    return kb;
}
```

## Add supporting functions

Next, add the following supporting functions inside the `CreateKB` class.

1. Add the following function to print out JSON in a readable format:    

```java
public static String PrettyPrint (String json_text) {
    JsonParser parser = new JsonParser();
    JsonElement json = parser.parse(json_text);
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    return gson.toJson(json);
}
```

2. Add the following class to manage the HTTP response:

```java
public static class Response {
    Map<String, List<String>> Headers;
    String Response;

    public Response(Map<String, List<String>> headers, String response) {
        this.Headers = headers;
        this.Response = response;
    }
}
```

3. Add the following method to make a POST request to the QnA Maker APIs. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

```java
public static Response Post (URL url, String content) throws Exception{
    HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
    connection.setRequestMethod("POST");
    connection.setRequestProperty("Content-Type", "application/json");
    connection.setRequestProperty("Content-Length", content.length() + "");
    connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
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
    return new Response (connection.getHeaderFields(), response.toString());
}
```

4. Add the following method to make a GET request to the QnA Maker APIs.

```java
public static Response Get (URL url) throws Exception{
    HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
        connection.setDoOutput(true);
    StringBuilder response = new StringBuilder ();
    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));

    String line;
    while ((line = in.readLine()) != null) {
        response.append(line);
    }
    in.close();
    return new Response (connection.getHeaderFields(), response.toString());
}
```

## Add a method to create the KB
Add the following method to create the KB by calling into the Post method. 

```java
public static Response CreateKB (KB kb) throws Exception {
    URL url = new URL (host + service + method);
    System.out.println ("Calling " + url.toString() + ".");
    String content = new Gson().toJson(kb);
    return Post(url, content);
}
```

This API call returns a JSON response that includes the operation ID. Use the operation ID to determine if the KB is successfully created. 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
}
```

## Add a method to check the creation status
Add the following method to check the creation status. 

```java
public static Response GetStatus (String operation) throws Exception {
    URL url = new URL (host + service + operation);
    System.out.println ("Calling " + url.toString() + ".");
    return Get(url);
}
```

Repeat the call until success or failure: 

```JSON
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:23:08Z",
  "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add a main method
The main method creates the KB, then polls for the status. The_create_ **Operation ID** is returned in the POST response header field **Location**, then used as part of the route in the GET request. **The `while` loop retries the status if it is not completed. 

 

```java 
public static void main(String[] args) {
    try {
        // Send the request to create the knowledge base.
        Response response = CreateKB (GetKB ());

        // Get operation ID
        String operation = response.Headers.get("Location").get(0);

        System.out.println (PrettyPrint (response.Response));

        // Loop until the request is completed.
        Boolean done = false;
        while (!done) {
            // Check on the status of the request.
            response = GetStatus (operation);
            System.out.println (PrettyPrint (response.Response));
            Type type = new TypeToken<Map<String, String>>(){}.getType();
            Map<String, String> fields = new Gson().fromJson(response.Response, type);
            String state = fields.get ("operationState");
            // If the request is still running, the server tells us how
            // long to wait before checking the status again.
            if (state.equals("Running") || state.equals("NotStarted")) {
                String wait = response.Headers.get ("Retry-After").get(0);
                System.out.println ("Waiting " + wait + " seconds...");
                Thread.sleep (Integer.parseInt(wait) * 1000);
            }
            else {
                done = true;
            }
        }
    } catch (Exception e) {
        System.out.println (e);
    }
}
```

## Compile and run the program

1. Make sure the gson library is in the `./libs` directory. At the command-line, compile the file `create-new-knowledge-base.java`:

```bash
javac -cp ".;libs/*" CreateKB.java
```

2. Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```base
java -cp ",;libs/*" CreateKB
```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page.    

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)