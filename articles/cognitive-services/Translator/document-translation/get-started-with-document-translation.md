---
title: Get started with Document Translation
description: How to create a document translation service using C#, Go, Java, Node.js, or Python progamming languages and platforms
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 02/04/2021
---

# Get started with Document Translation

Document Translation is a cloud-based feature of the [Azure Translator](../translator-info-overview.md) service that enables the translation of whole documents from and to more than 70 languages available in the Translator service. In this article, you'll learn to use Document Translator via your programming language and HTTP REST API methods.

## Prerequisites

To get started, you'll need:

1. An active Azure subscription.
If you don't have one, you can [**create a free Azure account**](https://azure.microsoft.com/free/cognitive-services/).
1. A Translator resource. You can [create your Translator resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.
1. An Azure blob storage account. All access to Azure Storage takes place through a storage account. You can [create an Azure storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the Azure portal.

## Create Azure blob storage containers

You'll need to [create two containers](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) in your Azure blob storage account:

1. **Source container**. The source container is where you'll upload your documents for translation. 
1. **Target container**. The target container is where your translated documents will be stored.  
1. Both the `sourceUrl`  and `targetUrl`   must include a Shared Access Signature(SAS) token. The token can be assigned to your container or specific blobs. Source containers are delegated **list** and **read-only** access. Source container blobs

### Source and target SAS access tokens

* You'll delegate **list** and  **read-only** access tokens for your source container or   **read-only** access for a specific source blob. 
* You'll delegate **list** and **write-only** access for your target container or **write-only** for a specfic target blob  . *See* [Create Shared Access Signature (SAS) tokens in the Azure portal](#create-shared-access-signature-tokens-in-the-azure-portal), below.

## Create Shared Access Signature tokens  in the Azure portal

Your `sourceUrl` and `targetUrl`  must include a Shared Access Signature(SAS) token as part of the query string. You can create SAS tokens for your entire containers or designate specific blobs:

### [Designate SAS access for containers](#tab/container)

* Go to the  [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:  

<!-- markdownlint-disable MD036 -->
**Source container**  

 **Your storage account** → **containers** and select your **source** container by selecting the adjacent box.

* From the left rail menu under **Settings**, select **shared access signature**.

* In the main window, make the following selections:

  * **Allowed services** → select **Blob** and **File** (clear the Queue and Table check boxes).
  * **Allowed resource types** →  select **Service** and **Container**.
  * **Allowed permissions** → select **Read** and **List** only (clear the remaining permissions).
  * Specify the signed key **Start** and **Expiry** times.
  * The optional **Allowed IP addresses** field specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.
  * The optional **Allowed protocols** field specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.
  * Select your **Preferred routing tier**. The default value is Basic.
  * You'll have the option of creating one or two shared access keys.

**Target container**  

 **Your storage account** → **containers** and select your **target** container by selecting the adjacent box.

* From the left rail menu under **Settings**, select **shared access signature**.

* In the main window, make the following selections:

  * **Allowed services** → select **Blob** and **File** (clear the Queue and Table check boxes).
  * **Allowed resource types** →  select **Service** and **Container**.
  * **Allowed permissions** → select **Write** and **List** only (clear the remaining permissions).
  * Specify the signed key **Start** and **Expiry** times.
  * The optional **Allowed IP addresses** field specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.
  * The optional **Allowed protocols** field specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.
  * Select your **Preferred routing tier**. The default value is Basic.
  * You'll have the option of creating one or two shared access keys.

### [Designate SAS access for Blobs](#tab/blob)

Go to the  [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:  

 **Your storage account** → **containers** → **your container** → **your blob**

* Select **Generate SAS** from the menu near the top of the page.
* Select **Signing method** → **User delegation key**.
* For your **Storage** blob, specify **Permissions** → **Read**.
* For your **Target** blob, specify  **Permissions** → **Write**.
* Specify the signed key **Start** and **Expiry** times.
* The optional **Allowed IP addresses** field specifies an IP address or a range of IP addresses from which to accept requests. If the request IP address doesn't match the IP address or address range specified on the SAS token, it won't be authorized.
* The optional **Allowed protocols** field specifies the protocol permitted for a request made with the SAS. The default value is HTTPS.

---

### Keys and endpoints

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.
1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.
1. Copy and paste your key and endpoint in a convenient location, such as *Microsoft Notepad*.
1. You'll paste them into the code below to connect your application to the Document Translation service.

>[!NOTE]
> To access the Document translation service, you must add the additional parameter **batches** to your endpoint URL.
> If you have created a Translator service with Virtual Network support, you must use the custom endpoint associated with your Translator resource to make HTTP requests. You can't use the global translator endpoint `api.cognitive.microsofttranslator.com`  nor use an access token for authentication.

### HTTP headers

The following headers are included with each Document Translator API request:

|HTTP header|Description|
|---|--|
|Ocp-Apim-Subscription-Key|**Required**: The value is the Azure secret key for your Translator or Cognitive Services resource.|
|Ocp-Apim-Subscription-Region|**Required** if you're using the Cognitive Services resource. </br>**Optional** if you're using a Translator resource.|
|Content-Type|**Required**: Specifies the content type of the payload. Accepted values are application/json or charset=UTF-8.|
|Content-Length|**Required**: the length of the request body.|
|Authorization|**Required** for use with the Cognitive Services subscription if you are passing an authentication token. <br/>The value is  **Bearer token: Bearer**.|

## Submit a Document Translation request (POST)

### POST request properties

* A batch document translation request is submitted to your translation service endpoint via a POST request. The request body is a JSON object named `inputs`.
* The `inputs` object contains both a `sourceURL` and `targetURL`  container addresses for your source and target language pairs.
* The `prefix` and `suffix` fields (if supplied) will be used to filter container subdirectories (folders).
* A value for the  `glossaries`  field can be included and will be applied when the document is being translated.
* If the file with the same name already exists in the destination, it will be overwritten.
* The `targetUrl` for each target language needs to be unique.

### POST Request URL

Send a POST request to: **\<Your-Translator-Service-Endpoint>/batches**

### Request body

#### inputs array

The body of the POST request is a JSON array named **inputs**. The inputs array contains a source object and an array of target objects.

#### source object

|property|description|
|---|---|
|**`sourceUrl`**| The URL for the container storing your uploaded source documents and the SAS token with read-only access.|
|**`storageSource`**|The type of cloud storage. Currently, only **"AzureBlob"** is supported. |
|**`filter`**   |Filter definitions:</br>&emsp;&bullet; **prefix**—To filter files and/or folders (optional). </br>&emsp;&bullet; **suffix**—To filter files and/or folders (optional).  |
|**`language`**   | language of source documents  |

#### targets array object

&emsp; Multiple targets can be defined.

|property| description |
|---|---|
| **`targetUrl`**  | The URL for the container storing your translated documents along and the SAS token with write-only access.|
|**`storageSource`**|The type of cloud storage. Currently, only **"AzureBlob"** is supported. |
| **`category`**  |Custom model ID (optional). A generic translation model is used by default.|
| **`language`**  | **Optional:** Target translation language.|
| **`glossaries`**  |**Optional:** Multiple glossaries can be defined. </br> If the glossary is invalid or unreachable during translation time, an error will be indicated in the document status.|
|**`glossaryUrl`**  | If a glossary is included, you'll need to provide the URL for the container storing glossary/dictionary documents.|
| **`format`**  |**Optional:** Format of glossary file (optional).|
|**`version`** | **Optional:** Version of the format.|

#### Sample HTTP request

> [!NOTE]
 The Host for your HTTP request is the Microsoft Translator Base URL. *See* [Host URLs for HTTP requests](#host-urls-for-http-requests).

```http
POST YOUR-ENDPOINT-QUERY-STRING/batches
Host: https://YOUR-RESOURCE-BASE-URL
Ocp-Apim-Subscription-Key: YOUR-RESOURCE-KEY
Content-Type: application/json
Content-Length: YOUR-CONTENT-LENGTH

{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://YOUR-UPLOADED-DOCUMENTS-CONTAINER-URL",
                "storageSource": "AzureBlob",
                "filter": {
                    "prefix": "News",
                    "suffix": ".txt"
                },
                "language": "en"
            },
            "targets": [
                {
                    "targetUrl": "<https://YOUR-TRANSLATED-DOCUMENTS-CONTAINER-URL>",
                    "storageSource": "AzureBlob",
                    "category": "general",
                    "language": "de"
                }
            ]
        }
    ]
}
```

> [!CAUTION]
> For the samples below, you'll hard-code your keys and endpoint where indicated; remember to remove the key from your code when you're done, and never post it publicly. See [Azure Cognitive Services security](/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp) for ways to securely store and access your credentials.

### Platform setup

### [C#](#tab/csharp)

* Create a new project.
* Replace Program.cs with the C# code shown below.
* Set your endpoint. subscription key, and container URL values in Program.cs.
* To process JSON data, add [Newtonsoft.Json package using .NET CLI](https://www.nuget.org/packages/Newtonsoft.Json/).
* Run the program from the project directory.

### [Node.js](#tab/javascript)

* Create a new Node.js project.
* Install the Axios library with `npm i axios`.
* Copy pasted the code below into your project.
* Set your endpoint. subscription key, and container URL values.
* Run the program.

### [Python](#tab/python)  

* Create a new project.
* Copy and paste the code from one of the samples into your project.
* Set your endpoint. subscription key, and container URL values.
* Run the program. For example: `python translate.py`.
  
### [Java](#tab/java)

* Create a working directory for your project. For example:

```powershell
mkdir sample-project
```

* In your project directory, create the following subdirectory structure:  

  src</br>
&emsp; └ main</br>
&emsp;&emsp;&emsp;└ java

```powershell
mkdir -p src/main/java/
```

* Java source files live in src/main/**java**

* In your root directory (*sample-project*),  initialize your project with Gradle: 

```powershell
gradle init --type basic
```

* When prompted to choose a **DSL**, select **Kotlin**.
* Update the `build.gradle.kts`  file. Keep in mind that you'll need to update your `mainClassName` depending on the sample:

  ```java
  plugins {
    java
    application
  }
  application {
    mainClassName = "<NAME OF YOUR CLASS>"
  }
  repositories {
    mavenCentral()
  }
  dependencies {
    compile("com.squareup.okhttp:okhttp:2.5.0")
  }
  ```

* Create a Java file in the **java** directory and copy/paste the code from the provided sample. Don't forget to add your subscription key and endpoint.
*Build and run the sample:

```powershell
gradle build
gradle run
```

### [Go](#tab/go)  

* Create a new Go project.
* Add the code provided below.
* Set your endpoint. subscription key, and container URL values.
* Save the file with a '.go' extension.
* Open a command prompt on a computer with Go installed.
* Build the file, for example: 'go build example-code.go'.
* Run the file, for example: 'example-code'.

---

## Translate documents via HTTP POST

> [!IMPORTANT]
>
>For the **HTTP** code samples, below, you will need to update the following fields:  
>
>> 1. POST
>> 1. HOST
>> 1. Ocp-Apim-Subscription-Key
>> 1. sourceURL
>> 1. targetURL
>
> For the **C#**, **Node.js**, **Python**, **Java**, and **Go** code samples, below, you will need to update the following fields:  
>
>> 1. endpoint
>> 1. resourceKey
>> 1. sourceURL
>> 1. targetURL
>
> * The POST method requires that the `/batches` parameter is included with each instance of your translator services endpoint.
> * The Response Headers `Operation-Location`  field is a URL. The last parameter is the operation's `jobID` :
>

### [C#](#tab/csharp)

```csharp


    using System;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Text;
    using Newtonsoft.Json;

    class Program
    {


        private static readonly string endpoint = "https://YOUR-RESOURCE-ENDPOINT";

        private static readonly string resourceKey = "YOUR-RESOURCE-KEY";

        // Add your location, also known as region. The default is global.
        // This is required if using a Cognitive Services resource.
        private static readonly string location = "YOUR-RESOURCE-LOCATION";

        static readonly string json = ("{\"inputs\": [{\"source\": {\"sourceUrl\": \"https://YOUR-SOURCE-URL-WITH-READ-ACCESS-SAS",\"storageSource\": \"AzureBlob\",\"language\": \"en\",\"filter\":{\"prefix\": \"Demo_1/\"} }, \"targets\": [{\"targetUrl\": \"https://YOUR-TARGET-URL-WITH-WRITE-ACCESS-SAS\",\"storageSource\": \"AzureBlob\",\"category\": \"general\",\"language\": \"es\"}]}]}");
        
        static async Task Main(string[] args)
        {
            
            string route = "/batches";
            using HttpClient client = new HttpClient();
            using HttpRequestMessage request = new HttpRequestMessage();
            {
            
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
                // Create the request
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(endpoint + route);
                request.Headers.Add("Ocp-Apim-Subscription-Key", resourceKey);
                request.Content = content;
                request.Headers.Add("Ocp-Apim-Subscription-Region", location);

                // Send the request and get response.
                HttpResponseMessage  response = await client.SendAsync(request);
                string result = response.Content.ReadAsStringAsync().Result;
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Status code: {response.StatusCode}");
                    Console.WriteLine();
                    Console.WriteLine($"Response Headers:"); 
                    Console.WriteLine(response.Headers);
                }
                else
                    Console.Write("Error");

            }

        }

    }
}
```

### [Node.js](#tab/javascript)

```javascript
const axios = require('axios').default;

let endpoint = "https://YOUR-RESOURCE-ENDPOINT";
let resourceKey = "YOUR-RESOURCE-KEY";

// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
let location = "YOUR_RESOURCE_LOCATION";

let data = JSON.stringify({"inputs": [
  {
      "source": {
          "sourceUrl": "https://YOUR-SOURCE-URL-WITH-READ-ACCESS-SAS",
          "storageSource": "AzureBlob",
          "language": "en",
          "filter":{
              "prefix": "Demo_1/"
          }
      },
      "targets": [
          {
              "targetUrl": "https://YOUR-TARGET-URL-WITH-WRITE-ACCESS-SAS",
              "storageSource": "AzureBlob",
              "category": "general",
              "language": "es"}]}]});

let config = {
  method: 'post',
  baseURL: endpoint,
  url: '/batches', 
  headers: {
    'Ocp-Apim-Subscription-Key': resourceKey,
    'Content-Type': 'application/json'
    //'Ocp-Apim-Subscription-Region': location,
  },
  data: data
};

axios(config)
.then(function (response) {
  let result = { statusText: response.statusText, statusCode: response.status, headers: response.headers };
  console.log()
  console.log(JSON.stringify(result));
})
.catch(function (error) {
  console.log(error);
});
```

### [Python](#tab/python)

```python

import requests

path ='/batches/'
endpoint = "https://YOUR-RESOURCE-ENDPOINT"
constructed_url = endpoint + path
resourceKey =  'YOUR-RESOURCE-KEY'

payload= {
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://YOUR-SOURCE-URL-WITH-READ-ACCESS-SAS",
                "storageSource": "AzureBlob",
                "language": "en",
                "filter":{
                    "prefix": "Demo_1/"
                }
            },
            "targets": [
                {
                    "targetUrl": "https://YOUR-TARGET-URL-WITH-WRITE-ACCESS-SAS",
                    "storageSource": "AzureBlob",
                    "category": "general",
                    "language": "es"
                }
            ]
        }
    ]
}
headers = {
  'Ocp-Apim-Subscription-Key': resourceKey,
  'Content-Type': 'application/json'
}

response = requests.post(url=constructed_url, headers=headers, json=payload)

print(f'response status code: {response.status_code}\nresponse status: {response.reason}\nresponse headers: {response.headers}')
```

### [Java](#tab/java)

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.squareup.okhttp.*;

public class DocumentTranslation {
    String resourceKey = "'YOUR-RESOURCE-KEY'";
    String url = "https://YOUR-RESOURCE-ENDPOINT/batches";

    OkHttpClient client = new OkHttpClient();

    public void post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,  "{ \"inputs\": [ {  \"source\": { \"sourceUrl\": \"https://YOUR-SOURCE-CONTAINER-URL-WITH-READ-ONLY-SAS\", \"storageSource\": \"AzureBlob\",  \"language\": \"en\", \"filter\":{ \"prefix\": \"Demo_1/\" }  },  \"targets\": [ { \"targetUrl\": \"https://YOUR-TARGET-URL-WITH-WRITE-ACCESS-SAS\": \"AzureBlob\", \"category\": \"general\",  \"language\": \"es\" }  ] } ]}");
        Request request = new Request.Builder()
                .url(url).post(body)
                .addHeader("Ocp-Apim-Subscription-Key", resourceKey)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        System.out.println(response.code());
        System.out.println(response.headers());
    }

  public static void main(String[] args) {
        try {
            DocumentTranslation sampleRequest = new DocumentTranslation();
            sampleRequest.post();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

### [Go](#tab/go)

```go

package main

import (
 "bytes"
 "fmt"
"net/http"
)

func main() {
url := "https://YOUR-RESOURCE-ENDPOINT/batches"
resourceKey := "YOUR-RESOURCE-KEY"
method := "POST"

var jsonStr = []byte(`{"inputs":[{"source":{"sourceUrl":"https://YOUR-SOURCE-URL-WITH-READ-ACCESS-SAS","storageSource":"AzureBlob","language":"en","filter":{"prefix":"Demo_1/"}},"targets":[{"targetUrl":"https://YOUR-TARGET-URL-WITH-WRITE-ACCESS-SAS","storageSource":"AzureBlob","category":"general","language":"es"}]}]}`)

req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonStr))
req.Header.Add("Ocp-Apim-Subscription-Key", resourceKey)
req.Header.Add("Content-Type", "application/json")

client := &http.Client{}

if err != nil {
    fmt.Println(err)
    return
  }
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()
  fmt.Println("response status:",  res.Status)
  fmt.Println("response headers",  res.Header)
}
```

---

### Response (POST)

If successful, this method returns a `202 Accepted`  response code and the batch request is created by the service.

The **Operation-Location** header will consist of the `sourceURL` and the `jobID`—the last parameter in the path. The `jobId`  is used for GET and DELETE requests.

>> **Ex:** https://<span></span>your-service-endpoint/batches/**1c74f0e7-3920-4320-8779-2c5309777ft**

## Retrieve job and document status via HTTP GET

### [C#](#tab/csharp)

```csharp
   
using System;
using System.Net.Http;
using System.Threading.Tasks;


class Program
{


    private static readonly string endpoint = "https://YOUR-RESOURCE-ENDPOINT/batches";

    private static readonly string resourceKey = "YOUR-RESOURCE-KEY";

    //// Add your location, also known as region. The default is global.
    //// This is required if using a Cognitive Services resource.
    private static readonly string location = "YOUR-RESOURCE-LOCATION";

    static async Task Main(string[] args)
    {

        using HttpClient client = new HttpClient();

        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "endpoint");
        HttpResponseMessage response = await client.GetAsync("endpoint");
        var content = await client.GetStringAsync("endpoint");
        Console.WriteLine(response.StatusCode);
        Console.WriteLine(content);
    }

}
```

### [Node.js](#tab/javascript)

```javascript

const axios = require('axios');

let resourceKey = "YOUR-RESOURCE-KEY";
let endpoint = "https://YOUR-RESOURCE-ENDPOINT/batches";

let config = {
  method: 'get',
  url: 'resourceKey',
  headers: { 
    'Ocp-Apim-Subscription-Key': 'endpoint'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

```

### [Java](#tab/java)

```java
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

public class DocumentTranslator {

    public static void main(String[] args) throws IOException {
        OkHttpExample1 obj = new OkHttpExample1();
        obj.sendGETSync();
    }

OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
String resourceKey = "YOUR-RESOURCE-KEY";
String endpoint = "https://YOUR-RESOURCE-ENDPOINT/batches"

Request request = new Request.Builder()
  .url(endpoint)
  .method("GET", null)
  .addHeader("Ocp-Apim-Subscription-Key", resourceKey)
  .build();
Response response = client.newCall(request).execute();

```

### [Python](#tab/python)

```python

import requests

url = 'https://YOUR-RESOURCE-ENDPOINT/batches'
resourceKey =  'YOUR-RESOURCE-KEY'

payload={}
headers = {
  'Ocp-Apim-Subscription-Key': 'resourceKey'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

### [Go](#tab/go)

```go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "YOUR-SERVICE-ENDPOINT/batches"
  resourceKey := "YOUR-RESOURCE-KEY"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("Ocp-Apim-Subscription-Key", resourceKey)

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

---

## Document Translation HTTP requests

### Host URLs for HTTP requests

|Description|Azure geography|Base URL (geographical endpoint)|
|:--|:--|:--|
|Azure|Global (non-regional)|api.cognitive.microsofttranslator.com|
|Azure|United States|api-nam.cognitive.microsofttranslator.com|
|Azure|Europe|api-eur.cognitive.microsofttranslator.com|
|Azure|Asia Pacific|api-apc.cognitive.microsofttranslator.com|

### GET Jobs 

#### Brief Overview

Retrieve a list and current status for all jobs in a document translation request.

#### HTTP request

```http
GET /batches/
```

### GET Job Status

#### Brief overview

Retrieve  the current status for a single job and a summary of all jobs in a document translation request.

#### HTTP request

```http
GET /batches/{jobId}
```

### DELETE Job

#### Brief overview

Cancel currently processing or queued job.

#### HTTP request

```http
DELETE /batches/{jobId}/
```

#### Response

If possible, all documents for which translation hasn't started will be canceled.

#### Response: GET Jobs, GET Job Status, and DELETE Job

If successful, these methods return a `200 OK` response code and a JSON object with the following values:

|Property|value|
|---|---|
|**id**|The `jobId` that you provided in the request.|
|**createdDateTimeUtc**| Date and time in UTC when the job is created.|
|**lastActionDateTimeUtc**| Date and time in UTC when the job status was last modified.|
|**status**|Status of the request:|
|**summary**|List of overall status|
||&bullet; **total**—Total number of documents in the job.</br>&bullet; **failed**—Number of documents for which translation failed.</br>&bullet; **success**—Number of completed documents.</br>&bullet; **inProgress**—Number of documents in progress.</br>&bullet; **notYetStarted**—Number of documents pending translation.</br>&bullet; **canceled—Number of documents that have been canceled. |

### GET documents

#### Brief overview

Retrieve the status of all documents in a document translation request.

#### HTTP request

```http
GET /batches/{jobId}/documents/
```

### GET Document Status

#### Brief overview

Retrieve the status of a specific document in a document translation request.

#### HTTP request

```http
GET  /batches/{jobId}/document/{documentId}
```

#### Response: GET Documents and GET Document Status

If successful, these methods return a `200 OK` response code and a JSON object with the following values:

|Property|value|
|---|---|
|**path**|The URL for the target container.|
|**createdDateTimeUtc**| Date and time in UTC when the job is created.|
|**lastActionDateTimeUtc**| Date and time in UTC when the job status was last modified.|
|**status**|Status of the request.|
|**detectedLanguage**|Source document language|
|**to**|Target language|
|**progress**| Progress of the request measured in decimals|
|**id**|The `jobId`  you provided in the request|

### GET Document Formats

#### Brief overview

Retrieve a list of supported document formats.

#### HTTP request

```http
GET /documents/formats/
```

### GET Glossary Formats

#### Brief overview

Retrieve a list of supported glossary formats.

#### HTTP request

```http
GET /glossaries/formats/
```

#### Response: GET Document Formats and GET Glossary Formats

If successful, these methods return a `200 OK` response code and a JSON object with the following values:

|Property|value|
|---|---|
|**format**|Format for the file, i.e., .txt, .docx., etc.|
|**fileExtensions**| List of supported file extensions.|
|**contentType**| List of supported content types.|
|**versions**|List of supported content type versions.|

### GET Storage Sources

#### Brief overview

Retrieve a list of supported storage sources.

#### HTTP request

```http
GET /storagesources/
```

#### Response: GET Storage Sources

|Property|value|
|---|---|
|**value**|List of supported storage sources (currently only AzureBlob is supported by the service).|

## Data Limits

The table below lists the limits for data that you can send to Document Translation. If you need to translate large documents, you can divide the file contents into smaller blobs prior to using the APIs.

|Attribute | Limit|
|---|---|
|Document size| ≤ 40 MB |
|Total number of files.|≤ 1000 |
|Total content size in a batch | ≤ 250 MB|
|Number of target languages in a batch| ≤ 10 |
|Size of Translation memory file| ≤ 10 MB|

## See also

* [Translator v3 API reference](../reference/v3-0-reference.md)
* [Language support](../language-support.md)