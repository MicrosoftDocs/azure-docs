---
title: "Use Azure AI Translator APIs"
titleSuffix: Azure AI services
description: "Learn to translate text, transliterate text, detect language and more with the Translator service. Examples are provided in C#, Java, JavaScript and Python."
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
ms.devlang: csharp, golang, java, javascript, python
ms.custom: cog-serv-seo-aug-2020, mode-other, devx-track-python
keywords: translator, translator service, translate text, transliterate text, language detection
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

# Use Azure AI Translator APIs

In this how-to guide, you learn to use the [Translator service REST APIs](reference/rest-api-guide.md). You start with basic examples and move onto some core configuration options that are commonly used during development, including:

* [Translation](#translate-text)
* [Transliteration](#transliterate-text)
* [Language identification/detection](#detect-language)
* [Calculate sentence length](#get-sentence-length)
* [Get alternate translations](#dictionary-lookup-alternate-translations) and [examples of word usage in a sentence](#dictionary-examples-translations-in-context)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)

* An Azure AI multi-service or Translator resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or a [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal, to get your key and endpoint. After it deploys, select **Go to resource**.

* You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

* You need the key and endpoint from the resource to connect your application to the Translator service. Later, you paste your key and endpoint into the code samples. You can find these values on the Azure portal **Keys and Endpoint** page:

    :::image type="content" source="media/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../key-vault/general/overview.md). For more information, *see* the Azure AI services [security](../security-features.md).

## Headers

To call the Translator service via the [REST API](reference/rest-api-guide.md), you need to make sure the following headers are included with each request. Don't worry, we include the headers in the sample code in the following sections.

|Header|Value| Condition  |
|--- |:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Translator service key from the Azure portal.|<ul><li>***Required***</li></ul> |
|**Ocp-Apim-Subscription-Region**|The region where your resource was created. |<ul><li>***Required*** when using an Azure AI multi-service or regional (geographic) resource like **West US**.</li><li> ***Optional*** when using a single-service Translator Resource.</li></ul>|
|**Content-Type**|The content type of the payload. The accepted value is **application/json** or **charset=UTF-8**.|<ul><li>***Required***</li></ul>|
|**Content-Length**|The **length of the request** body.|<ul><li>***Optional***</li></ul> |
|**X-ClientTraceId**|A client-generated GUID to uniquely identify the request. You can omit this header if you include the trace ID in the query string using a query parameter named ClientTraceId.|<ul><li>***Optional***</li></ul>

## Set up your application

### [C#](#tab/csharp)

1. Make sure you have the current version of [Visual Studio IDE](https://visualstudio.microsoft.com/vs/).

    > [!TIP]
    >
    > If you're new to Visual Studio, try the [Introduction to Visual Studio](/training/modules/go-get-started/) Learn module.

1. Open Visual Studio.

1. On the Start page, choose **Create a new project**.

    :::image type="content" source="media/quickstarts/start-window.png" alt-text="Screenshot: Visual Studio start window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

    :::image type="content" source="media/quickstarts/create-new-project.png" alt-text="Screenshot: Visual Studio's create new project page.":::

1. In the **Configure your new project** dialog window, enter `translator_text_app` in the Project name box. Leave the "Place solution and project in the same directory" checkbox **unchecked** and select **Next**.

    :::image type="content" source="media/how-to-guides/configure-your-console-app.png" alt-text="Screenshot: Visual Studio's configure new project dialog window.":::

1. In the **Additional information** dialog window, make sure **.NET 6.0 (Long-term support)** is selected. Leave the "Don't use top-level statements" checkbox **unchecked** and select **Create**.

    :::image type="content" source="media/quickstarts/additional-information.png" alt-text="Screenshot: Visual Studio's additional information dialog window.":::

### Install the Newtonsoft.json package with NuGet

1. Right-click on your translator_quickstart project and select **Manage NuGet Packages...** .

    :::image type="content" source="media/how-to-guides/manage-nuget.png" alt-text="Screenshot of the NuGet package search box.":::

1. Select the Browse tab and type Newtonsoft.

    :::image type="content" source="media/quickstarts/newtonsoft.png" alt-text="Screenshot of the NuGet package install window.":::

1. Select install from the right package manager window to add the package to your project.

    :::image type="content" source="media/how-to-guides/install-newtonsoft.png" alt-text="Screenshot of the NuGet package install button.":::

### Build your application

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.WriteLine("Hello World!")`. Copy and paste the code samples into your application's Program.cs file. For each code sample, make sure you update the key and endpoint variables with values from your Azure portal Translator instance.

1. Once you've added a desired code sample to your application, choose the green **start button** next to formRecognizer_quickstart to build and run your program, or press **F5**.

:::image type="content" source="media/how-to-guides/run-program-visual-studio.png" alt-text="Screenshot of the run program button in Visual Studio.":::

### [Go](#tab/go)

You can use any text editor to write Go applications. We recommend using the latest version of [Visual Studio Code and the Go extension](/azure/developer/go/configure-visual-studio-code).

> [!TIP]
>
> If you're new to Go, try the [Get started with Go](/training/modules/go-get-started/) Learn module.

1. If you haven't done so already, [download and install Go](https://go.dev/doc/install).

    * Download the Go version for your operating system.
    * Once the download is complete, run the installer.
    * Open a command prompt and enter the following to confirm Go was installed:

      ```console
            go version
      ```

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **translator-text-app**, and navigate to it.

1. Create a new GO file named **text-translator.go** from the **translator-text-app** directory.

1. Copy and paste the code samples into your **text-translator.go** file. Make sure you update the key variable with the value from your Azure portal Translator instance.

1. Once you've added a code sample to your application, your Go program can be executed in a command or terminal prompt. Make sure your prompt's path is set to the **translator-text-app** folder and use the following command:

      ```console
       go run translation.go
      ```

### [Java](#tab/java)

* You should have the latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. *See* [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using Visual Studio Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (OpenJDK)](/java/openjdk/download#openjdk-17) version 8 or later.

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

### Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **translator-text-app**, and navigate to it.

    ```console
    mkdir translator-text-app && translator-text-app
    ```

   ```powershell
    mkdir translator-text-app; cd translator-text-app
   ```

1. Run the `gradle init` command from the translator-text-app directory. This command creates essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (translator-text-app) by selecting **Return** or **Enter**.

  > [!NOTE]
  > It may take a few minutes for the entire application to be created, but soon you should see several folders and files including `build-gradle.kts`.

1. Update `build.gradle.kts` with the following code:

  ```kotlin
  plugins {
    java
    application
  }
  application {
    mainClass.set("TextTranslator")
  }
  repositories {
    mavenCentral()
  }
  dependencies {
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("com.google.code.gson:gson:2.9.0")
  }
  ```

### Create a Java Application

1. From the translator-text-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

   You create the following directory structure:

    :::image type="content" source="media/quickstarts/java-directories-2.png" alt-text="Screenshot: Java directory structure.":::

1. Navigate to the `java` directory and create a file named **`TranslatorText.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item TranslatorText.java**.
    >
    > * You can also create a new file in your IDE named `TranslatorText.java`  and save it to the `java` directory.

1. Copy and paste the code samples `TranslatorText.java` file. **Make sure you update the key with one of the key values from your Azure portal Translator instance**.

1. Once you've added a code sample to your application, navigate back to your main project directory—**translator-text-app**, open a console window, and enter the following commands:

    1. Build your application with the `build` command:

        ```console
        gradle build
        ```

    1. Run your application with the `run` command:

        ```console
        gradle run
        ```

### [Node.js](#tab/nodejs)

1. If you haven't done so already, install the latest version of [Node.js](https://nodejs.org/en/download/). Node Package Manager (npm) is included with the Node.js installation.

    > [!TIP]
    >
    > If you're new to Node.js, try the [Introduction to Node.js](/training/modules/intro-to-nodejs/) Learn module.

1. In a console window (such as cmd, PowerShell, or Bash), create and navigate to a new directory for your app named `translator-text-app`.

    ```console
        mkdir translator-text-app && cd translator-text-app
    ```

   ```powershell
     mkdir translator-text-app; cd translator-text-app
   ```

1. Run the npm init command to initialize the application and scaffold your project.

    ```console
       npm init
    ```

1. Specify your project's attributes using the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your translator-text-app directory.

1. Open a console window and use npm to install the `axios` HTTP library and `uuid` package:

    ```console
       npm install axios uuid
    ```

1. Create the `index.js` file in the application directory.

     > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item index.js**.
    >
    > * You can also create a new file named `index.js` in your IDE and save it to the `translator-text-app` directory.

1. Copy and paste the code samples into your `index.js` file. **Make sure you update the key variable with the value from your Azure portal Translator instance**.

1. Once you've added the code sample to your application, run your program:

    1. Navigate to your application directory (translator-text-app).

    1. Type the following command in your terminal:

        ```console
        node index.js
        ```

### [Python](#tab/python)

1. If you haven't done so already, install the latest version of [Python 3.x](https://www.python.org/downloads/). The Python installer package (pip) is included with the Python installation.

    > [!TIP]
    >
    > If you're new to Python, try the [Introduction to Python](/training/paths/beginner-python/) Learn module.

1. Open a terminal window and use pip to install the Requests library and uuid0 package:

    ```console
       pip install requests uuid
    ```

    > [!NOTE]
    > We will also use a Python built-in package called json. It's used to work with JSON data.

1. Create a new Python file called **text-translator.py** in your preferred editor or IDE.

1. Add the following code sample to your `text-translator.py` file. **Make sure you update the key with one of the values from your Azure portal Translator instance**.

1. Once you've added a desired code sample to your application, build and run your program:

    1. Navigate to your **text-translator.py** file.

    1. Type the following command in your console:

        ```console
        python text-translator.py
        ```

---

> [!IMPORTANT]
> The samples in this guide require hard-coded keys and endpoints.
> Remember to **remove the key from your code when you're done**, and **never post it publicly**.
> For production, consider using a secure way of storing and accessing your credentials. For more information, *see* [Azure AI services security](../security-features.md).

## Translate text

The core operation of the Translator service is to translate text. In this section, you build a request that takes a single source (`from`) and provides two outputs (`to`). Then we review some parameters that can be used to adjust both the request and the response.

### [C#](#tab/csharp)

```csharp
using System.Text;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
    // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // Input and output languages are defined as parameters.
        string route = "/translate?api-version=3.0&from=en&to=sw&to=it";
        string textToTranslate = "Hello, friend! What did you do today?";
        object[] body = new object[] { new { Text = textToTranslate } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            // location required if you're using a multi-service or regional (not global) resource.
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/translate?api-version=3.0"

     // location, also known as region.
    // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("from", "en")
    q.Add("to", "it")
    q.Add("to", "sw")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Hello friend! What did you do today?"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.IOException;

import com.google.gson.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/translate?api-version=3.0&from=en&to=sw&to=it";
    public String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Hello, friend! What did you do today?\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource. 
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText translateRequest = new TranslatorText();
            String response = translateRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
    const { v4: uuidv4 } = require('uuid');

    let key = "<your-translator-key>";
    let endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
    // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
         // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': ['sw', 'it']
    },
    data: [{
        'text': 'Hello, friend! What did you do today?'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
location = "<YOUR-RESOURCE-LOCATION>"

path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': ['sw', 'it']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
     # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Hello, friend! What did you do today?'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response:

```json
[
   {
      "translations":[
         {
            "text":"Halo, rafiki! Ulifanya nini leo?",
            "to":"sw"
         },
         {
            "text":"Ciao, amico! Cosa hai fatto oggi?",
            "to":"it"
         }
      ]
   }
]
```

You can check the consumption (the number of characters charged) for each request in the [**response headers: x-metered-usage**](reference/v3-0-translate.md#response-headers) field.

## Detect language

If you need translation, but don't know the language of the text, you can use the language detection operation. There's more than one way to identify the source text language. In this section, you learn how to use language detection using the `translate` endpoint, and the `detect` endpoint.

### Detect source language during translation

If you don't include the `from` parameter in your translation request, the Translator service attempts to detect the source text's language. In the response, you get the detected language (`language`) and a confidence score (`score`). The closer the `score` is to `1.0`, means that there's increased confidence that the detection is correct.

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // Output languages are defined as parameters, input language detected.
        string route = "/translate?api-version=3.0&to=en&to=it";
        string textToTranslate = "Halo, rafiki! Ulifanya nini leo?";
        object[] body = new object[] { new { Text = textToTranslate } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            // location required if you're using a multi-service or regional (not global) resource. 
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
    // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/translate?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("to", "en")
    q.Add("to", "it")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Halo rafiki! Ulifanya nini leo?"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.IOException;

import com.google.gson.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/translate?api-version=3.0&to=en&to=it";
    public String url = endpoint.concat(route);

    // location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

     // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Halo, rafiki! Ulifanya nini leo?\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText translateRequest = new TranslatorText();
            String response = translateRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'to': ['en', 'it']
    },
    data: [{
        'text': 'Halo, rafiki! Ulifanya nini leo?'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'to': ['en', 'it']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Halo, rafiki! Ulifanya nini leo?'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response:

```json
[
   {
      "detectedLanguage":{
         "language":"sw",
         "score":0.8
      },
      "translations":[
         {
            "text":"Hello friend! What did you do today?",
            "to":"en"
         },
         {
            "text":"Ciao amico! Cosa hai fatto oggi?",
            "to":"it"
         }
      ]
   }
]
```

### Detect source language without translation

It's possible to use the Translator service to detect the language of source text without performing a translation. To do so, you use the [`/detect`](./reference/v3-0-detect.md) endpoint.

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // Just detect language
        string route = "/detect?api-version=3.0";
        string textToLangDetect = "Hallo Freund! Was hast du heute gemacht?";
        object[] body = new object[] { new { Text = textToLangDetect } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"

    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/detect?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Ciao amico! Cosa hai fatto oggi?"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
         log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.IOException;

import com.google.gson.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/detect?api-version=3.0";
    public String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Hallo Freund! Was hast du heute gemacht?\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText detectRequest = new TranslatorText();
            String response = detectRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/detect',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0'
    },
    data: [{
        'text': 'Hallo Freund! Was hast du heute gemacht?'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/detect'
constructed_url = endpoint + path

params = {
    'api-version': '3.0'
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Hallo Freund! Was hast du heute gemacht?'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

The `/detect` endpoint response includes alternate detections, and indicates if the translation and transliteration are supported for all of the detected languages. After a successful call, you should see the following response:

```json
[
   {
      "language":"de",

      "score":1.0,

      "isTranslationSupported":true,

      "isTransliterationSupported":false
   }
]
```

## Transliterate text

Transliteration is the process of converting a word or phrase from the script (alphabet) of one language to another based on phonetic similarity. For example, you could use transliteration to convert "สวัสดี" (`thai`) to "sawatdi" (`latn`). There's more than one way to perform transliteration. In this section, you learn how to use language detection using the `translate` endpoint, and the `transliterate` endpoint.

### Transliterate during translation

If you're translating into a language that uses a different alphabet (or phonemes) than your source, you might need a transliteration. In this example, we translate "Hello" from English to Thai. In addition to getting the translation in Thai, you get a transliteration of the translated phrase using the Latin alphabet.

To get a transliteration from the `translate` endpoint, use the `toScript` parameter.

> [!NOTE]
> For a complete list of available languages and transliteration options, see [language support](language-support.md).

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // Output language defined as parameter, with toScript set to latn
        string route = "/translate?api-version=3.0&to=th&toScript=latn";
        string textToTransliterate = "Hello, friend! What did you do today?";
        object[] body = new object[] { new { Text = textToTransliterate } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"

    uri := endpoint + "/translate?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("to", "th")
    q.Add("toScript", "latn")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Hello, friend! What did you do today?"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.IOException;

import com.google.gson.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/translate?api-version=3.0&to=th&toScript=latn";
    public String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";


    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Hello, friend! What did you do today?\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText translateRequest = new TranslatorText();
            String response = translateRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'to': 'th',
        'toScript': 'latn'
    },
    data: [{
        'text': 'Hello, friend! What did you do today?'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```Python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'to': 'th',
    'toScript': 'latn'
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Hello, friend! What did you do today?'
}]
request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response. Keep in mind that the response from `translate` endpoint includes the detected source language with a confidence score, a translation using the alphabet of the output language, and a transliteration using the Latin alphabet.

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1
    },
    "translations": [
      {
        "text": "หวัดดีเพื่อน! วันนี้เธอทำอะไรไปบ้าง ",
        "to": "th",
        "transliteration": {
          "script": "Latn",
          "text": "watdiphuean! wannithoethamaraipaiang"
        }
      }
    ]
  }
]
```

### Transliterate without translation

You can also use the `transliterate` endpoint to get a transliteration. When using the transliteration endpoint, you must provide the source language (`language`), the source script/alphabet (`fromScript`), and the output script/alphabet (`toScript`) as parameters. In this example, we're going to get the transliteration for สวัสดีเพื่อน! วันนี้คุณทำอะไร.

> [!NOTE]
> For a complete list of available languages and transliteration options, see [language support](language-support.md).

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // For a complete list of options, see API reference.
        // Input and output languages are defined as parameters.
        string route = "/transliterate?api-version=3.0&language=th&fromScript=thai&toScript=latn";
        string textToTransliterate = "สวัสดีเพื่อน! วันนี้คุณทำอะไร";
        object[] body = new object[] { new { Text = textToTransliterate } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            // location required if you're using a multi-service or regional (not global) resource.
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/transliterate?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("language", "th")
    q.Add("fromScript", "thai")
    q.Add("toScript", "latn")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "สวัสดีเพื่อน! วันนี้คุณทำอะไร"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.IOException;

import com.google.gson.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/transliterate?api-version=3.0&language=th&fromScript=thai&toScript=latn";
    public String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";


    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"สวัสดีเพื่อน! วันนี้คุณทำอะไร\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText transliterateRequest = new TranslatorText();
            String response = transliterateRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/transliterate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'language': 'th',
        'fromScript': 'thai',
        'toScript': 'latn'
    },
    data: [{
        'text': 'สวัสดีเพื่อน! วันนี้คุณทำอะไร'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/transliterate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'language': 'th',
    'fromScript': 'thai',
    'toScript': 'latn'
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'สวัสดีเพื่อน! วันนี้คุณทำอะไร'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response. Unlike the call to the `translate` endpoint, `transliterate` only returns the `text` and the output `script`.

```json
[
   {
      "text":"sawatdiphuean! wannikhunthamarai",

      "script":"latn"
   }
]
```

## Get sentence length

With the Translator service, you can get the character count for a sentence or series of sentences. The response is returned as an array, with character counts for each sentence detected. You can get sentence lengths with the `translate` and `breaksentence` endpoints.

### Get sentence length during translation

You can get character counts for both source text and translation output using the `translate` endpoint. To return sentence length (`srcSenLen` and `transSenLen`) you must set the `includeSentenceLength` parameter to `True`.

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // Include sentence length details.
        string route = "/translate?api-version=3.0&to=es&includeSentenceLength=true";
        string sentencesToCount =
                "Can you tell me how to get to Penn Station? Oh, you aren't sure? That's fine.";
        object[] body = new object[] { new { Text = sentencesToCount } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            // location required if you're using a multi-service or regional (not global) resource.
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/translate?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("to", "es")
    q.Add("includeSentenceLength", "true")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Can you tell me how to get to Penn Station? Oh, you aren't sure? That's fine."},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.IOException;

import com.google.gson.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/translate?api-version=3.0&to=es&includeSentenceLength=true";
    public static String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Can you tell me how to get to Penn Station? Oh, you aren\'t sure? That\'s fine.\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText translateRequest = new TranslatorText();
            String response = translateRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'to': 'es',
        'includeSentenceLength': true
    },
    data: [{
        'text': 'Can you tell me how to get to Penn Station? Oh, you aren\'t sure? That\'s fine.'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'to': 'es',
    'includeSentenceLength': True
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Can you tell me how to get to Penn Station? Oh, you aren\'t sure? That\'s fine.'
}]
request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response. In addition to the detected source language and translation, you get character counts for each detected sentence for both the source (`srcSentLen`) and translation (`transSentLen`).

```json
[
   {
      "detectedLanguage":{
         "language":"en",
         "score":1.0
      },
      "translations":[
         {
            "text":"¿Puedes decirme cómo llegar a Penn Station? Oh, ¿no estás seguro? Está bien.",
            "to":"es",
            "sentLen":{
               "srcSentLen":[
                  44,
                  21,
                  12
               ],
               "transSentLen":[
                  44,
                  22,
                  10
               ]
            }
         }
      ]
   }
]
```

### Get sentence length without translation

The Translator service also lets you request sentence length without translation using the `breaksentence` endpoint.

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // Only include sentence length details.
        string route = "/breaksentence?api-version=3.0";
        string sentencesToCount =
                "Can you tell me how to get to Penn Station? Oh, you aren't sure? That's fine.";
        object[] body = new object[] { new { Text = sentencesToCount } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            // location required if you're using a multi-service or regional (not global) resource.
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/breaksentence?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Can you tell me how to get to Penn Station? Oh, you aren't sure? That's fine."},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import com.squareup.okhttp.*;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/breaksentence?api-version=3.0";
    public String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Can you tell me how to get to Penn Station? Oh, you aren\'t sure? That\'s fine.\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText breakSentenceRequest = new TranslatorText();
            String response = breakSentenceRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/breaksentence',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0'
    },
    data: [{
        'text': 'Can you tell me how to get to Penn Station? Oh, you aren\'t sure? That\'s fine.'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/breaksentence'
constructed_url = endpoint + path

params = {
    'api-version': '3.0'
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Can you tell me how to get to Penn Station? Oh, you aren\'t sure? That\'s fine.'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response. Unlike the call to the `translate` endpoint, `breaksentence` only returns the character counts for the source text in an array called `sentLen`.

```json
[
   {
      "detectedLanguage":{
         "language":"en",
         "score":1.0
      },
      "sentLen":[
         44,
         21,
         12
      ]
   }
]
```

## Dictionary lookup (alternate translations)

With the  endpoint, you can get alternate translations for a word or phrase. For example, when translating the word "sunshine" from `en` to `es`, this endpoint returns "`luz solar`," "`rayos solares`," and "`soleamiento`," "`sol`," and "`insolación`."

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // See many translation options
        string route = "/dictionary/lookup?api-version=3.0&from=en&to=es";
        string wordToTranslate = "sunlight";
        object[] body = new object[] { new { Text = wordToTranslate } };
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            // location required if you're using a multi-service or regional (not global) resource.
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/dictionary/lookup?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("from", "en")
    q.Add("to", "es")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "sunlight"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import com.squareup.okhttp.*;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/dictionary/lookup?api-version=3.0&from=en&to=es";
    public String url = endpoint.concat(route);

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

    // Instantiates the OkHttpClient.
   OkHttpClient client = new OkHttpClient();

   // This function performs a POST request.
   public String Post() throws IOException {
       MediaType mediaType = MediaType.parse("application/json");
       RequestBody body = RequestBody.create(mediaType,
               "[{\"Text\": \"sunlight\"}]");
       Request request = new Request.Builder()
               .url(url)
               .post(body)
               .addHeader("Ocp-Apim-Subscription-Key", key)
               // location required if you're using a multi-service or regional (not global) resource.
               .addHeader("Ocp-Apim-Subscription-Region", location)
               .addHeader("Content-type", "application/json")
               .build();
       Response response = client.newCall(request).execute();
       return response.body().string();
   }

   // This function prettifies the json response.
   public static String prettify(String json_text) {
       JsonParser parser = new JsonParser();
       JsonElement json = parser.parse(json_text);
       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       return gson.toJson(json);
   }

   public static void main(String[] args) {
       try {
           TranslatorText breakSentenceRequest = new TranslatorText();
           String response = breakSentenceRequest.Post();
           System.out.println(prettify(response));
       } catch (Exception e) {
           System.out.println(e);
       }
   }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/dictionary/lookup',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': 'es'
    },
    data: [{
        'text': 'sunlight'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/dictionary/lookup'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': 'es'
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'sunlight'
}]
request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response. Let's examine the response more closely since the JSON is more complex than some of the other examples in this article. The `translations` array includes a list of translations. Each object in this array includes a confidence score (`confidence`), the text optimized for end-user display (`displayTarget`), the normalized text (`normalizedText`), the part of speech (`posTag`), and information about previous translation (`backTranslations`). For more information about the response, see [Dictionary Lookup](reference/v3-0-dictionary-lookup.md)

```json
[
   {
      "normalizedSource":"sunlight",
      "displaySource":"sunlight",
      "translations":[
         {
            "normalizedTarget":"luz solar",
            "displayTarget":"luz solar",
            "posTag":"NOUN",
            "confidence":0.5313,
            "prefixWord":"",
            "backTranslations":[
               {
                  "normalizedText":"sunlight",
                  "displayText":"sunlight",
                  "numExamples":15,
                  "frequencyCount":702
               },
               {
                  "normalizedText":"sunshine",
                  "displayText":"sunshine",
                  "numExamples":7,
                  "frequencyCount":27
               },
               {
                  "normalizedText":"daylight",
                  "displayText":"daylight",
                  "numExamples":4,
                  "frequencyCount":17
               }
            ]
         },
         {
            "normalizedTarget":"rayos solares",
            "displayTarget":"rayos solares",
            "posTag":"NOUN",
            "confidence":0.1544,
            "prefixWord":"",
            "backTranslations":[
               {
                  "normalizedText":"sunlight",
                  "displayText":"sunlight",
                  "numExamples":4,
                  "frequencyCount":38
               },
               {
                  "normalizedText":"rays",
                  "displayText":"rays",
                  "numExamples":11,
                  "frequencyCount":30
               },
               {
                  "normalizedText":"sunrays",
                  "displayText":"sunrays",
                  "numExamples":0,
                  "frequencyCount":6
               },
               {
                  "normalizedText":"sunbeams",
                  "displayText":"sunbeams",
                  "numExamples":0,
                  "frequencyCount":4
               }
            ]
         },
         {
            "normalizedTarget":"soleamiento",
            "displayTarget":"soleamiento",
            "posTag":"NOUN",
            "confidence":0.1264,
            "prefixWord":"",
            "backTranslations":[
               {
                  "normalizedText":"sunlight",
                  "displayText":"sunlight",
                  "numExamples":0,
                  "frequencyCount":7
               }
            ]
         },
         {
            "normalizedTarget":"sol",
            "displayTarget":"sol",
            "posTag":"NOUN",
            "confidence":0.1239,
            "prefixWord":"",
            "backTranslations":[
               {
                  "normalizedText":"sun",
                  "displayText":"sun",
                  "numExamples":15,
                  "frequencyCount":20387
               },
               {
                  "normalizedText":"sunshine",
                  "displayText":"sunshine",
                  "numExamples":15,
                  "frequencyCount":1439
               },
               {
                  "normalizedText":"sunny",
                  "displayText":"sunny",
                  "numExamples":15,
                  "frequencyCount":265
               },
               {
                  "normalizedText":"sunlight",
                  "displayText":"sunlight",
                  "numExamples":15,
                  "frequencyCount":242
               }
            ]
         },
         {
            "normalizedTarget":"insolación",
            "displayTarget":"insolación",
            "posTag":"NOUN",
            "confidence":0.064,
            "prefixWord":"",
            "backTranslations":[
               {
                  "normalizedText":"heat stroke",
                  "displayText":"heat stroke",
                  "numExamples":3,
                  "frequencyCount":67
               },
               {
                  "normalizedText":"insolation",
                  "displayText":"insolation",
                  "numExamples":1,
                  "frequencyCount":55
               },
               {
                  "normalizedText":"sunstroke",
                  "displayText":"sunstroke",
                  "numExamples":2,
                  "frequencyCount":31
               },
               {
                  "normalizedText":"sunlight",
                  "displayText":"sunlight",
                  "numExamples":0,
                  "frequencyCount":12
               },
               {
                  "normalizedText":"solarization",
                  "displayText":"solarization",
                  "numExamples":0,
                  "frequencyCount":7
               },
               {
                  "normalizedText":"sunning",
                  "displayText":"sunning",
                  "numExamples":1,
                  "frequencyCount":7
               }
            ]
         }
      ]
   }
]
```

## Dictionary examples (translations in context)

After you've performed a dictionary lookup, pass the source and translation text to the `dictionary/examples` endpoint, to get a list of examples that show both terms in the context of a sentence or phrase. Building on the previous example, you use the `normalizedText` and `normalizedTarget` from the dictionary lookup response as `text` and `translation` respectively. The source language (`from`) and output target (`to`) parameters are required.

### [C#](#tab/csharp)

```csharp
using System;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

class Program
{
    private static readonly string key = "<YOUR-TRANSLATOR-KEY>";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static readonly string location = "<YOUR-RESOURCE-LOCATION>";

    static async Task Main(string[] args)
    {
        // See examples of terms in context
        string route = "/dictionary/examples?api-version=3.0&from=en&to=es";
        object[] body = new object[] { new { Text = "sunlight",  Translation = "luz solar" } } ;
        var requestBody = JsonConvert.SerializeObject(body);

        using (var client = new HttpClient())
        using (var request = new HttpRequestMessage())
        {
            // Build the request.
            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            // location required if you're using a multi-service or regional (not global) resource.
            request.Headers.Add("Ocp-Apim-Subscription-Region", location);

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
```

### [Go](#tab/go)

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "net/url"
)

func main() {
    key := "<YOUR-TRANSLATOR-KEY>"
    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location := "<YOUR-RESOURCE-LOCATION>"
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/dictionary/examples?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("from", "en")
    q.Add("to", "es")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text        string
        Translation string
    }{
        {
            Text:        "sunlight",
            Translation: "luz solar",
        },
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    // location required if you're using a multi-service or regional (not global) resource.
    req.Header.Add("Ocp-Apim-Subscription-Region", location)
    req.Header.Add("Content-Type", "application/json")

    // Call the Translator Text API
    res, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Fatal(err)
    }

    // Decode the JSON response
    var result interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        log.Fatal(err)
    }
    // Format and print the response to terminal
    prettyJSON, _ := json.MarshalIndent(result, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

### [Java](#tab/java)

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import com.squareup.okhttp.*;

public class TranslatorText {
    private static String key = "<YOUR-TRANSLATOR-KEY>";
    public String endpoint = "https://api.cognitive.microsofttranslator.com";
    public String route = "/dictionary/examples?api-version=3.0&from=en&to=es";
    public String url = endpoint.concat(route);


    // location, also known as region.
   // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    private static String location = "<YOUR-RESOURCE-LOCATION>";

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"sunlight\", \"Translation\": \"luz solar\"}]");
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                // location required if you're using a multi-service or regional (not global) resource.
                .addHeader("Ocp-Apim-Subscription-Region", location)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        return response.body().string();
    }

    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }

    public static void main(String[] args) {
        try {
            TranslatorText dictionaryExamplesRequest = new TranslatorText();
            String response = dictionaryExamplesRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Node.js](#tab/nodejs)

```javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

let key = "<YOUR-TRANSLATOR-KEY>";
let endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using an Azure AI multi-service resource.
let location = "<YOUR-RESOURCE-LOCATION>";

axios({
    baseURL: endpoint,
    url: '/dictionary/examples',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': 'es'
    },
    data: [{
        'text': 'sunlight',
        'translation': 'luz solar'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```

### [Python](#tab/python)

```python
import requests, uuid, json

# Add your key and endpoint
key = "<YOUR-TRANSLATOR-KEY>"
endpoint = "https://api.cognitive.microsofttranslator.com"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.

location = "<YOUR-RESOURCE-LOCATION>"

path = '/dictionary/examples'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': 'es'
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'sunlight',
    'translation': 'luz solar'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
```

---

After a successful call, you should see the following response. For more information about the response, see [Dictionary Lookup](reference/v3-0-dictionary-examples.md)

```json
[
   {
      "normalizedSource":"sunlight",
      "normalizedTarget":"luz solar",
      "examples":[
         {
            "sourcePrefix":"You use a stake, silver, or ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Se usa una estaca, plata, o ",
            "targetTerm":"luz solar",
            "targetSuffix":"."
         },
         {
            "sourcePrefix":"A pocket of ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Una bolsa de ",
            "targetTerm":"luz solar",
            "targetSuffix":"."
         },
         {
            "sourcePrefix":"There must also be ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"También debe haber ",
            "targetTerm":"luz solar",
            "targetSuffix":"."
         },
         {
            "sourcePrefix":"We were living off of current ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Estábamos viviendo de la ",
            "targetTerm":"luz solar",
            "targetSuffix":" actual."
         },
         {
            "sourcePrefix":"And they don't need unbroken ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Y ellos no necesitan ",
            "targetTerm":"luz solar",
            "targetSuffix":" ininterrumpida."
         },
         {
            "sourcePrefix":"We have lamps that give the exact equivalent of ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Disponemos de lámparas que dan el equivalente exacto de ",
            "targetTerm":"luz solar",
            "targetSuffix":"."
         },
         {
            "sourcePrefix":"Plants need water and ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Las plantas necesitan agua y ",
            "targetTerm":"luz solar",
            "targetSuffix":"."
         },
         {
            "sourcePrefix":"So this requires ",
            "sourceTerm":"sunlight",
            "sourceSuffix":".",
            "targetPrefix":"Así que esto requiere ",
            "targetTerm":"luz solar",
            "targetSuffix":"."
         },
         {
            "sourcePrefix":"And this pocket of ",
            "sourceTerm":"sunlight",
            "sourceSuffix":" freed humans from their ...",
            "targetPrefix":"Y esta bolsa de ",
            "targetTerm":"luz solar",
            "targetSuffix":", liberó a los humanos de ..."
         },
         {
            "sourcePrefix":"Since there is no ",
            "sourceTerm":"sunlight",
            "sourceSuffix":", the air within ...",
            "targetPrefix":"Como no hay ",
            "targetTerm":"luz solar",
            "targetSuffix":", el aire atrapado en ..."
         },
         {
            "sourcePrefix":"The ",
            "sourceTerm":"sunlight",
            "sourceSuffix":" shining through the glass creates a ...",
            "targetPrefix":"La ",
            "targetTerm":"luz solar",
            "targetSuffix":" a través de la vidriera crea una ..."
         },
         {
            "sourcePrefix":"Less ice reflects less ",
            "sourceTerm":"sunlight",
            "sourceSuffix":", and more open ocean ...",
            "targetPrefix":"Menos hielo refleja menos ",
            "targetTerm":"luz solar",
            "targetSuffix":", y más mar abierto ..."
         },
         {
            "sourcePrefix":"",
            "sourceTerm":"Sunlight",
            "sourceSuffix":" is most intense at midday, so ...",
            "targetPrefix":"La ",
            "targetTerm":"luz solar",
            "targetSuffix":" es más intensa al mediodía, por lo que ..."
         },
         {
            "sourcePrefix":"... capture huge amounts of ",
            "sourceTerm":"sunlight",
            "sourceSuffix":", so fueling their growth.",
            "targetPrefix":"... capturan enormes cantidades de ",
            "targetTerm":"luz solar",
            "targetSuffix":" que favorecen su crecimiento."
         },
         {
            "sourcePrefix":"... full height, giving more direct ",
            "sourceTerm":"sunlight",
            "sourceSuffix":" in the winter.",
            "targetPrefix":"... altura completa, dando más ",
            "targetTerm":"luz solar",
            "targetSuffix":" directa durante el invierno."
         }
      ]
   }
]
```

## Troubleshooting

### Common HTTP status codes

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful. |
| 400 | Bad Request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long. |
| 401 | Unauthorized | The request isn't authorized. Check to make sure your key or token is valid and in the correct region. *See also* [Authentication](reference/v3-0-reference.md#authentication).|
| 429 | Too Many Requests | You've exceeded the quota or rate of requests allowed for your subscription. |
| 502 | Bad Gateway    | Network or server-side issue. May also indicate invalid headers. |

### Java users

If you're encountering connection issues, it may be that your TLS/SSL certificate has expired. To resolve this issue, install the [DigiCertGlobalRootG2.crt](http://cacerts.digicert.com/DigiCertGlobalRootG2.crt) to your private store.

## Next steps

> [!div class="nextstepaction"]
> [Customize and improve translation](custom-translator/concepts/customization.md)
