---
title: "Quickstart: Azure Cognitive Services Translator"
titleSuffix: Azure Cognitive Services
description: "Learn to translate text with the Translator service. Examples are provided in C#, Go, Java, JavaScript and Python."
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/06/2022
ms.author: lajanuar
ms.devlang: csharp, golang, java, javascript, python
---

# Quickstart: Azure Cognitive Services Translator

In this quickstart, you learn to use the Translator service to [translate text](reference/v3-0-translate.md) using the programming language of your choice and the REST API.

## Prerequisites

To get started, you'll need an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* Once you have your Azure subscription, create a [Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.

* After your resource deploys, select **Go to resource** and retrieve your key and endpoint.

  * You need the key and endpoint from the resource to connect your application to the Translator service. You'll paste your key and endpoint into the code later in the quickstart. You can find these values on the Azure portal **Keys and Endpoint** page:

    :::image type="content" source="media/quickstarts/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

* Use the free pricing tier (F0) to try the service and upgrade later to a paid tier for production.

## Headers

To call the Translator service via the [REST API](reference/rest-api-guide.md), you'll need to include the following headers with each request. Don't worry, we'll include the headers for you in the sample code for each programming language.

For more information on Translator authentication options, *see* the [Translator v3 reference](/azure/cognitive-services/translator/reference/v3-0-reference#authentication) guide.

|Header|Value| Condition  |
|--- |:--- |:---|
|**Ocp-Apim-Subscription-Key** |Your Translator service key from the Azure portal.|<ul><li>***Required***</li></ul> |
|**Content-Type**|The content type of the payload. The accepted value is **application/json** or **charset=UTF-8**.|<ul><li>***Required***</li></ul>|
|**Content-Length**|The **length of the request** body.|<ul><li>***Optional***</li></ul> |
|**X-ClientTraceId**|A client-generated GUID to uniquely identify the request. You can omit this header if you include the trace ID in the query string using a query parameter named ClientTraceId.|<ul><li>***Optional***</li></ul>
|||

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and **never** post it publicly. For production, use secure methods to store and access your credentials. For more information, *see* Cognitive Services [security](../../cognitive-services/cognitive-services-security.md).

## Translate text

The core operation of the Translator service is translating text. In this quickstart, you'll build a request using a programming language of your choice that takes a single source (`from`) and provides two outputs (`to`). Then we'll review some parameters that can be used to adjust both the request and the response.

### [C#: Visual Studio](#tab/csharp)

### Set up

1. Make sure you have the current version of [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)

1. Open Visual Studio.

1. On the Start page, choose **Create a new project**.

    :::image type="content" source="media/quickstarts/start-window.png" alt-text="Screenshot: Visual Studio start window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

    :::image type="content" source="media/quickstarts/create-new-project.png" alt-text="Screenshot: Visual Studio's create new project page.":::

1. In the **Configure your new project** dialog window, enter `translator_quickstart` in the Project name box. Leave the "Place solution and project in the same directory" checkbox **unchecked** and select **Next**.

    :::image type="content" source="media/quickstarts/configure-new-project.png" alt-text="Screenshot: Visual Studio's configure new project dialog window.":::

1. In the **Additional information** dialog window, make sure **.NET 6.0 (Long-term support)** is selected. Leave the "Don't use top-level statements" checkbox **unchecked** and select **Create**.

    :::image type="content" source="media/quickstarts/additional-information.png" alt-text="Screenshot: Visual Studio's additional information dialog window.":::

### Install the Newtonsoft.json package with NuGet

1. Right-click on your translator_quickstart project and select Manage NuGet Packages... .

    :::image type="content" source="media/quickstarts/manage-nuget.png" alt-text="{Screenshot of the NuGet package search box.}":::

1. Select the Browse tab and type Newtonsoft.json.

    :::image type="content" source="media/quickstarts/newtonsoft.png" alt-text="{Screenshot of the NuGet package install window.}":::

1. Select install from the right package manager window to add the package to your project.

    :::image type="content" source="media/quickstarts/install-newtonsoft.png" alt-text="Screenshot of the NuGet package install button.":::

### Build your application

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.Writeline("Hello World!")`. Copy and paste the code sample into your application's Program.cs file. Make sure you update the key and endpoint variables with values from your Translator instance in the Azure portal:

```csharp
using System.Text;
using Newtonsoft.Json;

class Program
{
    private static readonly string key = "<your-translator-key>";
    private static readonly string endpoint = "<your-translator-endpoint>";

    static async Task Main(string[] args)
    {
        // Input and output languages are defined as parameters.
        string route = "/translate?api-version=3.0&from=en&to=de&to=zu";
        string textToTranslate = "I would really like to drive your car around the block a few times.";
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

            // Send the request and get response.
            HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
            // Read response as a string.
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}

```

### Run your C# application

Once you've added a code sample to your application, choose the green Start button next to formRecognizer_quickstart to build and run your program, or press F5.

:::image type="content" source="media/quickstarts/run-program-visual-studio.png" alt-text="Screenshot of the rum program button in Visual Studio.":::

### [Go](#tab/go)

### Set up your Go environment

* You can use any text editor to write Go applications. We recommend using the latest version of [Visual Studio Code and the Go extension](/azure/developer/go/configure-visual-studio-code).

> [!TIP]
>
> If you're new to Go, try the [**Get started with Go**](/learn/modules/go-get-started/) learning module.

1. Install Go

* In your favorite web browser, go to the Go [download and install page](https://go.dev/doc/install])
* Download the version for your operating system.
* Once the download is complete, run the installer.
* Open a command prompt and enter the following to confirm Go was installed:

```console
  go version
```

1. [Set-up your Go development environment](https://go.dev/doc/editors) with your preferred IDE.

1. Create a new folder and Go file:

* Create a new folder named **translator-app**.
 *Create a new file named **translation.go** inside the **translator-app** folder
* Copy and paste the code sample into your **translation.go** file. Make sure you update the key and endpoint variables with values from your Translator instance in the Azure portal:

```go
package main

import (
    "fmt"
    "strings"
    "net/http"
    "io/ioutil"
)

func main() {

    key := "<your-translator-key>"
    
    endpoint :="<your translator-endpoint>"

    url := endpoint + "translate?api-version=3.0&from=en&to=zu"

    payload := strings.NewReader("[\r\n    {\"Text\":\"I would really like to drive your car around the block a few times.\"}\r\n]")

    req, _ := http.NewRequest("POST", url, payload)

    req.Header.Add("content-type", "application/json")
    req.Header.Add("ocp-apim-subscription-key", key)

    res, _ := http.DefaultClient.Do(req)

    defer res.Body.Close()
    body, _ := ioutil.ReadAll(res.Body)

    fmt.Println(string(body))

}
```

### Run your Go application

Once you've added a code sample to your application, your Go program can be executed in a command or terminal prompt. Make sure your prompt's path is set to the **translator-app** folder and use the following command:

```console
 go run trnslation.go
```

### [Java](#tab/java)

### Set up your Java environment

* You should have the latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. *See* [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using VS Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (OpenJDK)](/java/openjdk/download#openjdk-17) version 8 or later.

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

### Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **translator-text-app**, and navigate to it.

    ```console
    mkdir translator-text-app && translator-text-app
    ```

1. Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (translator-text-app)

1. Update `build.gradle.kts` with the following code:

  ```kotlin
  plugins {
    java
    application
  }
  application {
    mainClass.set("TranslatorText")
  }
  repositories {
    mavenCentral()
  }
  dependencies {
    compile("com.squareup.okhttp:okhttp:2.5.0")
    compile("com.google.code.gson:gson:2.8.5")
  }
  ```

### Create a Java Application

* Create a Java file and copy in the code from the provided sample. Don't forget to add your key.
* Run the sample: `gradle run`.

1. From the form-recognizer-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

   You'll create the following directory structure:

    :::image type="content" source="media/quickstarts/java-directories-2.png" alt-text="Screenshot: Java directory structure":::

1. Navigate to the `java` directory and create a file named **`TranslatorText.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item TranslatorText.java**.

1. Open the `TranslatorText.java` file and copy in the code from the provided sample.

### [Node.js](#tab/nodejs)

* Create a new project in your favorite IDE or editor.
* Copy the code from one of the samples into your project.
* Set your key.
* Run the program. For example: `node Translate.js`.



### [Python](#tab/python)

* Create a new project in your favorite IDE or editor.
* Copy the code from one of the samples into your project.
* Set your key.
* Run the program. For example: `python translate.py`.



---



# [C#](#tab/csharp)

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json; // Install Newtonsoft.Json with NuGet

[TODO]Newtonsoft.Json latest stable

class Program
{
    private static readonly string key = "YOUR-KEY";
    private static readonly string endpoint = "https://api.cognitive.microsofttranslator.com/";

    // Add your location, also known as region. The default is global.
    // This is required if using a Cognitive Services resource.
    private static readonly string location = "YOUR_RESOURCE_LOCATION";

    static async Task Main(string[] args)
    {
        // Input and output languages are defined as parameters.
        string route = "/translate?api-version=3.0&from=en&to=de&to=it";
        string textToTranslate = "Hello, world!";
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


# [Go](#tab/go)

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
    key := "YOUR-KEY"
    // Add your location, also known as region. The default is global.
    // This is required if using a Cognitive Services resource.
    location := "YOUR_RESOURCE_LOCATION";
    endpoint := "https://api.cognitive.microsofttranslator.com/"
    uri := endpoint + "/translate?api-version=3.0"

    // Build the request URL. See: https://go.dev/pkg/net/url/#example_URL_Parse
    u, _ := url.Parse(uri)
    q := u.Query()
    q.Add("from", "en")
    q.Add("to", "de")
    q.Add("to", "it")
    u.RawQuery = q.Encode()

    // Create an anonymous struct for your request body and encode it to JSON
    body := []struct {
        Text string
    }{
        {Text: "Hello, world!"},
    }
    b, _ := json.Marshal(body)

    // Build the HTTP POST request
    req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(b))
    if err != nil {
        log.Fatal(err)
    }
    // Add required headers to the request
    req.Header.Add("Ocp-Apim-Subscription-Key", key)
    req.Header.Add("Ocp-Apim-Subscription-Region", region)
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



# [Java](#tab/java)

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import com.squareup.okhttp.*;

public class Translate {
    private static String key = "YOUR_KEY";

    // Add your location, also known as region. The default is global.
    // This is required if using a Cognitive Services resource.
    private static String location = "YOUR_RESOURCE_LOCATION";

    HttpUrl url = new HttpUrl.Builder()
        .scheme("https")
        .host("api.cognitive.microsofttranslator.com")
        .addPathSegment("/translate")
        .addQueryParameter("api-version", "3.0")
        .addQueryParameter("from", "en")
        .addQueryParameter("to", "de")
        .addQueryParameter("to", "it")
        .build();

    // Instantiates the OkHttpClient.
    OkHttpClient client = new OkHttpClient();

    // This function performs a POST request.
    public String Post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,
                "[{\"Text\": \"Hello World!\"}]");
        Request request = new Request.Builder().url(url).post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
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
            Translate translateRequest = new Translate();
            String response = translateRequest.Post();
            System.out.println(prettify(response));
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```


# [Node.js](#tab/nodejs)

```Javascript
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

var key = "YOUR_KEY";
var endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
var location = "YOUR_RESOURCE_LOCATION";

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': ['de', 'it']
    },
    data: [{
        'text': 'Hello World!'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})
```




# [Python](#tab/python)
```python
import requests, uuid, json

# Add your key and endpoint
key = "YOUR_KEY"
endpoint = "https://api.cognitive.microsofttranslator.com"

# Add your location, also known as region. The default is global.
# This is required if using a Cognitive Services resource.
location = "YOUR_RESOURCE_LOCATION"

path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': ['de', 'it']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Hello World!'
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
            "text":"Ich würde wirklich gerne ein paar Mal mit Ihrem Auto um den Block fahren.",
            "to":"de"
         },
         {
            "text":"Ngingathanda ngempela ukushayela imoto yakho izikhathi ezimbalwa.",
            "to":"zu"
         }
      ]
   }
]

```

## Next steps

> [!div class="nextstepaction"]
> [How to use Text Translation APIs](use-text-translation-apis.md)
