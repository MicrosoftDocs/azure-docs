---
title: Get started with Document Translation
description: How to create a Document Translation service using C#, Go, Java, Node.js, or Python programming languages and platforms
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 02/09/2021
---

# Get started with Document Translation (Preview)

 In this article, you'll learn to use Document Translation with HTTP REST API methods. Document Translation is a cloud-based feature of the [Azure Translator](../translator-info-overview.md) service.  The Document Translation API enables the translation of whole documents while preserving source document structure and text formatting.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Translator**](https://ms.portal.azure.com/#create/Microsoft) service resource (**not** a Cognitive Services multi-service resource). *See* [Create a new Azure  resource](../../cognitive-services-apis-create-account.md#create-a-new-azure-cognitive-services-resource).  
* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). All access to Azure Storage takes place through a storage account.

## Get your subscription key

Requests to the Translator service require a read-only key for authenticating access.

1. If you've created a new resource, after it deploys, select **Go to resource**. If you have an existing Document Translation resource, navigate directly to your resource page.
1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.
1. Copy and paste your subscription key in a convenient location, such as *Microsoft Notepad*.
1. You'll paste it into the code below to authenticate your request to the Document Translation service.

> [!IMPORTANT]
> You won't use the endpoint found on the Keys and Endpoint page for Document Translation. Instead, you will use a custom endpoint for Document Translation requests. *See* [Set your custom endpoint](#set-your-custom-endpoint), below.

## Create your custom endpoint

All API requests to the Document Translation service require a **custom endpoint** URL. **You can't use the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation**.

### Custom endpoint for Document Translation

* The custom endpoint URL is formatted with your resource name, hostname, and Translator subdirectories.

* The **NAME-OF-YOUR-RESOURCE** (also called *custom domain name*) parameter is the value that you entered in the **Name** field when you created your Translator resource.

![Image of the Azure portal, create resource, instant details, name field](../media/instance-details-azure-portal.png)

**Document Translation custom endpoint**:

```http
https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1
```

## Create Azure blob storage containers

You'll need to  [create containers](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) in your storage account for source, target, and optional glossary files

1. **A source container**. This container is where you upload your files for translation (required).
1. **A target container**. This container is where your translated files will be stored (required).  
1. **A glossary container**. This container is where you upload your glossary files (optional).

### Source and target SAS access tokens for blob storage

The `sourceUrl` , `targetUrl` , and optional `glossaryUrl`  must include a Shared Access Signature(SAS) token, appended as a query string. The token can be assigned to your container or specific blobs.

* Your source container or source blob must have designated  **read** and **list** access.
* Your target container or target blob must have designated  **write** and **list** access.
* Your glossary container or glossary blob must have designated  **read** and **list** access.

 *See* [Create SAS tokens with Azure Storage Explorer](create-sas-azure-storage-explorer.md) and [Create SAS tokens in the Azure portal](create-sas-azure-portal.md).

> [!TIP]
>
> * If you're translating **multiple** files (blobs) in an operation, **delegate SAS access at the  container level**.  
> * If you're translating a **single** file (blob) in an operation, **delegate SAS access at the blob level**.  
>

### HTTP headers

The following headers are included with each Document Translator API request:

|HTTP header|Description|
|---|--|
|Ocp-Apim-Subscription-Key|**Required**: The value is the Azure subscription key for your Translator or Cognitive Services resource.|
|Content-Type|**Required**: Specifies the content type of the payload. Accepted values are application/json or charset=UTF-8.|
|Content-Length|**Required**: the length of the request body.|

## Submit a Document Translation request (POST)

A batch Document Translation request is submitted to your Translator service endpoint via a POST request.

### POST request properties

* The POST request body is a JSON object named `inputs`.
* The `inputs` object contains both  `sourceURL` and `targetURL`  container addresses for your source and target language pairs and can optionally contain a `glossaryURL` container address.
* The `prefix` and `suffix` fields (optional) will be used to filter documents in the container including folders.
* A value for the  `glossaries`  field (optional) will be applied when the document is being translated.
* The `targetUrl` for each target language must be unique.

>[!NOTE]
> If a file with the same name already exists in the destination, it will be overwritten.

### POST Request URL and method

The POST request URL is formatted with your custom endpoint appended with the `/batches` method.

```http
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
```

#### Request body

#### Inputs array

The body of the POST request is a JSON array named **inputs**. The inputs array contains a **source** object and an array of **target** objects.

#### Source object

|property|description|
|---|---|
|**`sourceUrl`**| The URL for the container storing your uploaded source files and the SAS token with read-only access.|
|**`storageSource`**|The type of cloud storage. Currently, only **"AzureBlob"** is supported. |
|**`language`**   | Language of source files  |
|**`filter`**   |**Optional**: Filter definitions:</br>&emsp;&bullet; **prefix**—used to filter blobs by the first parameter of file location path (optional). </br>&emsp;&bullet; **suffix**—To filter blobs by file type  (optional).  |

#### Targets array object

&emsp; Multiple targets can be defined.

|property| description |
|---|---|
| **`targetUrl`**  | The URL for the container storing your translated documents along and the SAS token with write-only access.|
|**`storageSource`**|The type of cloud storage. Currently, only **"AzureBlob"** is supported. |
| **`category`**  |**Optional:** Custom model ID. A general translation model is used by default.|
| **`language`**  | Target translation language.|
| **`glossaries`**  |**Optional:** Multiple glossaries can be defined. </br> If the glossary is invalid or unreachable during translation time, an error will be indicated in the document status.|
|**`glossaryUrl`**  | If a glossary is included, you'll need to provide the URL for the glossary blob.|
| **`format`**  |**Optional:** Format of glossary file.|
|**`version`** | **Optional:** Version of the format.|

### Sample HTTP request

#### Request and URL

```http
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
```

#### Request headers

```http
Ocp-Apim-Subscription-Key: <YOUR-SUBSCRIPTION-KEY>
Content-Type: application/json
Content-Length: <YOUR-CONTENT-LENGTH>
```
<!-- markdownlint-disable MD024 -->
#### Request body

```http

{
    "inputs": [
        {
            "source": {
                "sourceUrl": "<https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS>",
                "storageSource": "AzureBlob",
                "filter": {
                    "prefix": "News",
                    "suffix": ".txt"
                },
                "language": "en"
            },
            "targets": [
                {
                    "targetUrl": "<https://YOUR-SOURCE-URL-WITH-WRITE-LIST-ACCESS-SAS>",
                    "storageSource": "AzureBlob",
                    "category": "general",
                    "language": "de"
                }
            ]
        }
    ]
}
```

#### Response: 202 Accepted

### Sample HTTP request with glossaryURL

#### Request and URL

```http
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
```

#### Request headers

```http
Ocp-Apim-Subscription-Key: <YOUR-SUBSCRIPTION-KEY>
Content-Type: application/json
Content-Length: <YOUR-CONTENT-LENGTH>
```

#### Request body

```http

{​​​​​​​​
"inputs": [
        {​​​​​​​​
"source": {​​​​​​​​
"sourceUrl": "<https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS>",
"storageSource": "AzureBlob",
"filter": {​​​​​​​​
"prefix": "simple",
"suffix": ".docx"
                }​​​​​​​​,
"language": "en"
            }​​​​​​​​,
"targets": [
                {​​​​​​​​
"targetUrl": "<https://YOUR-SOURCE-URL-WITH-WRITE-LIST-ACCESS-SAS>",
"storageSource": "AzureBlob",
"category": "general",
"language": "ta",
"glossaries": [
                        {​​​​​​​​
"glossaryUrl": "<https://YOUR-GLOSSARY-URL-WITH-READ-LIST-ACCESS-SAS>",
"format": "xliff",
"version": "1.2"
                        }​​​​​​​​
                    ]
                }​​​​​​​​
            ]
        }​​​​​​​​
    ]
}​​​​​​​​

```

## Platform setup

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
* Set your endpoint, subscription key, and container URL values.
* Run the program.

### [Python](#tab/python)  

* Create a new project.
* Copy and paste the code from one of the samples into your project.
* Set your endpoint, subscription key, and container URL values.
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

* Java source files (for example, _sample.java_) live in src/main/**java**.

* In your root directory (for example, *sample-project*),  initialize your project with Gradle:

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
    mainClassName = "{NAME OF YOUR CLASS}"
  }
  repositories {
    mavenCentral()
  }
  dependencies {
    compile("com.squareup.okhttp:okhttp:2.5.0")
  }
  ```

* Create a Java file in the **java** directory and copy/paste the code from the provided sample. Don't forget to add your subscription key and endpoint.
*Build and run the sample from the root directory:

```powershell
gradle build
gradle run
```

### [Go](#tab/go)  

* Create a new Go project.
* Add the code provided below.
* Set your endpoint, subscription key, and container URL values.
* Save the file with a '.go' extension.
* Open a command prompt on a computer with Go installed.
* Build the file, for example: 'go build example-code.go'.
* Run the file, for example: 'example-code'.

---

## Translate documents via HTTP POST

> [!IMPORTANT]
>
> * For the code samples, below, you may need to update the following fields, depending upon the operation:  
>
>> 1. `endpoint`
>> 1. `subscriptionKey`
>> 1. `sourceURL`
>> 1. `targetURL`
>> 1. `glossaryURL`
>> 1. `id`  (job ID)
>>
> * You can find the job `id`  in the The POST method's  response Header `Operation-Location`  URL value. The last parameter of the URL is the operation's job **`id`**.  
> * You can also use a GET Jobs request to retrieve the  job `id`  for a Document Translation operation.
> * For the samples below, you'll hard-code your key and endpoint where indicated; remember to remove the key from your code when you're done, and never post it publicly.  
>
> See [Azure Cognitive Services security](/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp) for ways to securely store and access your credentials.

### [C#](#tab/csharp)

```csharp


    using System;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Text;
    

    class Program
    {

        static readonly string route = "/batches";

        private static readonly string endpoint = "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1";

        private static readonly string subscriptionKey = "<YOUR-SUBSCRIPTION-KEY>";

        static readonly string json = ("{\"inputs\": [{\"source\": {\"sourceUrl\": \"https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS",\"storageSource\": \"AzureBlob\",\"language\": \"en\",\"filter\":{\"prefix\": \"Demo_1/\"} }, \"targets\": [{\"targetUrl\": \"https://YOUR-TARGET-URL-WITH-WRITE-LIST-ACCESS-SAS\",\"storageSource\": \"AzureBlob\",\"category\": \"general\",\"language\": \"es\"}]}]}");
        
        static async Task Main(string[] args)
        {
            using HttpClient client = new HttpClient();
            using HttpRequestMessage request = new HttpRequestMessage();
            {
            
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(endpoint + route);
                request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
                request.Content = content;
                
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

let endpoint = 'https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1';
let route = '/batches';
let subscriptionKey = '<YOUR-SUBSCRIPTION-KEY>';

let data = JSON.stringify({"inputs": [
  {
      "source": {
          "sourceUrl": "https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS",
          "storageSource": "AzureBlob",
          "language": "en",
          "filter":{
              "prefix": "Demo_1/"
          }
      },
      "targets": [
          {
              "targetUrl": "https://YOUR-TARGET-URL-WITH-WRITE-LIST-ACCESS-SAS",
              "storageSource": "AzureBlob",
              "category": "general",
              "language": "es"}]}]});

let config = {
  method: 'post',
  baseURL: endpoint,
  url: route,
  headers: {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-Type': 'application/json'
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

endpoint = "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1"
subscriptionKey =  '<YOUR-SUBSCRIPTION-KEY>'
path = '/batches'
constructed_url = endpoint + path

payload= {
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS",
                "storageSource": "AzureBlob",
                "language": "en",
                "filter":{
                    "prefix": "Demo_1/"
                }
            },
            "targets": [
                {
                    "targetUrl": "https://YOUR-TARGET-URL-WITH-WRITE-LIST-ACCESS-SAS",
                    "storageSource": "AzureBlob",
                    "category": "general",
                    "language": "es"
                }
            ]
        }
    ]
}
headers = {
  'Ocp-Apim-Subscription-Key': subscriptionKey,
  'Content-Type': 'application/json'
}

response = requests.post(constructed_url, headers=headers, json=payload)

print(f'response status code: {response.status_code}\nresponse status: {response.reason}\nresponse headers: {response.headers}')
```

### [Java](#tab/java)

```java
import java.io.*;
import java.net.*;
import java.util.*;
import com.squareup.okhttp.*;

public class DocumentTranslation {
    String subscriptionKey = "'<YOUR-SUBSCRIPTION-KEY>'";
    String endpoint = "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1";
    String path = endpoint + "/batches";

    OkHttpClient client = new OkHttpClient();

    public void post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,  "{\n \"inputs\": [\n {\n \"source\": {\n \"sourceUrl\": \"https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS\",\n \"filter\": {\n  \"prefix\": \"Demo_1\"\n  },\n  \"language\": \"en\",\n \"storageSource\": \"AzureBlob\"\n  },\n \"targets\": [\n {\n \"targetUrl\": \"https://YOUR-TARGET-URL-WITH-WRITE-LIST-ACCESS-SAS\",\n \"category\": \"general\",\n\"language\": \"fr\",\n\"storageSource\": \"AzureBlob\"\n }\n ],\n \"storageType\": \"Folder\"\n }\n  ]\n}");
        Request request = new Request.Builder()
                .url(path).post(body)
                .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey)
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
endpoint := "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1"
subscriptionKey := "<YOUR-SUBSCRIPTION-KEY>"
uri := endpoint + "/batches"
method := "POST"

var jsonStr = []byte(`{"inputs":[{"source":{"sourceUrl":"https://YOUR-SOURCE-URL-WITH-READ-LIST-ACCESS-SAS","storageSource":"AzureBlob","language":"en","filter":{"prefix":"Demo_1/"}},"targets":[{"targetUrl":"https://YOUR-TARGET-URL-WITH-WRITE-LIST-ACCESS-SAS","storageSource":"AzureBlob","category":"general","language":"es"}]}]}`)

req, err := http.NewRequest(method, endpoint, bytes.NewBuffer(jsonStr))
req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
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

If successful, the POST method returns a `202 Accepted`  response code and the batch request is created by the service.

## Get file formats via HTTP GET

### [C#](#tab/csharp)

```csharp
   
using System;
using System.Net.Http;
using System.Threading.Tasks;


class Program
{


    private static readonly string endpoint = "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1";

    static readonly string route = "/documents/formats";

    private static readonly string subscriptionKey = "<YOUR-SUBSCRIPTION-KEY>";

    static async Task Main(string[] args)
    {

        HttpClient client = new HttpClient();
            using HttpRequestMessage request = new HttpRequestMessage();
            {
                request.Method = HttpMethod.Get;
                request.RequestUri = new Uri(endpoint + route);
                request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);


                HttpResponseMessage response = await client.SendAsync(request);
                string result = response.Content.ReadAsStringAsync().Result;

                Console.WriteLine($"Status code: {response.StatusCode}");
                Console.WriteLine($"Response Headers: {response.Headers}");
                Console.WriteLine();
                Console.WriteLine(result);
            }
}
```

### [Node.js](#tab/javascript)

```javascript

const axios = require('axios');

let endpoint = 'https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1';
let subscriptionKey = '<YOUR-SUBSCRIPTION-KEY>';
let route = '/documents/formats';

let config = {
  method: 'get',
  url: endpoint + route,
  headers: { 
    'Ocp-Apim-Subscription-Key': subscriptionKey
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
import java.io.*;
import java.net.*;
import java.util.*;
import com.squareup.okhttp.*;

public class GetJobs {

    String subscriptionKey = "<YOUR-SUBSCRIPTION-KEY>";
    String endpoint = "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1";
    String url = endpoint + "/documents/formats";
    OkHttpClient client = new OkHttpClient();

    public void get() throws IOException {
        Request request = new Request.Builder().url(
                url).method("GET", null).addHeader("Ocp-Apim-Subscription-Key", subscriptionKey).build();
        Response response = client.newCall(request).execute(); 
            System.out.println(response.body().string());
        }

    public static void main(String[] args) throws IOException {
        try{
            GetJobs jobs = new GetJobs();
            jobs.get();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}

```

### [Python](#tab/python)

```python

import http.client

host = '<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com'
parameters = '//translator/text/batch/v1.0-preview.1/documents/formats'
subscriptionKey =  '<YOUR-SUBSCRIPTION-KEY>'
conn = http.client.HTTPSConnection(host)
payload = ''
headers = {
  'Ocp-Apim-Subscription-Key': subscriptionKey
}
conn.request("GET", parameters , payload, headers)
res = conn.getresponse()
data = res.read()
print(res.status)
print()
print(data.decode("utf-8"))
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

  endpoint := "https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1"
  subscriptionKey := "<YOUR-SUBSCRIPTION-KEY>"
  uri := endpoint + "/documents/formats"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, uri, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)

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
  fmt.Println(res.StatusCode)
  fmt.Println(string(body))
}
```

---

### Response (GET)

If successful, the GET method returns a `200 OK`  response code.

## Document Translation HTTP requests

### GET Storage Sources

#### Brief overview

Retrieve a list of supported storage sources.

#### HTTP request

```http
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/storagesources/
```

#### Response: GET Storage Sources

If successful, the GET method returns a `200 OK`  response code and the following value:
|Property|value|
|---|---|
|**value**|List of supported storage sources (currently only AzureBlob is supported by the service).|

### GET File Formats

#### Brief overview

Retrieve a list of supported file formats.

#### HTTP request

```http
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/documents/formats/
```

#### Response: GET File Formats

If successful, this method returns a `200 OK` response code and a JSON object with the following values:

|Property|value|
|---|---|
|**format**|The file format.|
|**fileExtensions**| List of supported file extensions.|
|**contentType**| List of supported content types.|
|**versions**|List of supported content type versions.|

### GET Glossary Formats

#### Brief overview

Retrieve a list of supported glossary formats.

#### HTTP request

```http
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/glossaries/formats/
```

#### Response: GET Glossary Formats

If successful, this method returns a `200 OK` response code and a JSON object with the following values:

|Property|value|
|---|---|
|**format**|The file format.|
|**fileExtensions**| List of supported file extensions.|
|**contentType**| List of supported content types.|
|**versions**|List of supported content type versions.|

### POST Job

#### Brief overview

Submit a batch Document Translation request to the translation service.

#### HTTP request

```http
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
```

#### Response: POST Job

If successful, these methods return a `202 Accepted`  response code.

### GET Job Status

#### Brief overview

Get the current status for a single job and a summary of all jobs in a Document Translation request.
<!-- markdownlint-disable MD024 -->

#### HTTP request

```http
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}
```

### GET Jobs

#### Brief Overview

Retrieve a list and current status for all jobs in a Document Translation request.

#### HTTP request

```http
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
```

### DELETE Job

#### Brief overview

Cancel currently processing or queued job.

#### HTTP request

```http
DELETEhttps://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}/
```

#### Response

If possible, all documents for which translation hasn't started will be canceled.

#### Response: GET Job Status, GET Jobs, and DELETE Job

If successful, these methods return a `200 OK` response code and a JSON object with the following values:

|Property|value|
|---|---|
|**id**|The job `id`  that you provided in the request.|
|**createdDateTimeUtc**| Date and time in UTC when the job is created.|
|**lastActionDateTimeUtc**| Date and time in UTC when the job status was last modified.|
|**status**|Status of the request:|
|**summary**|List of overall status|
||&bullet; **total**—Total number of documents in the job.</br>&bullet; **failed**—Number of documents for which translation failed.</br>&bullet; **success**—Number of completed documents.</br>&bullet; **inProgress**—Number of documents in progress.</br>&bullet; **notYetStarted**—Number of documents pending translation.</br>&bullet; **canceled—Number of documents that have been canceled. |

### GET Document Status

#### Brief overview

Retrieve the status of a specific document in a Document Translation request.

#### HTTP request

```http
GET  https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}/document/{documentId}/
```


### GET documents

#### Brief overview

Retrieve the status of all documents in a Document Translation request.

#### HTTP request

```http
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}/documents/
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
|**id**|The job Id you provided in the request|

## Content Limits

The table below lists the limits for data that you send to Document Translation.

|Attribute | Limit|
|---|---|
|Document size| ≤ 40 MB |
|Total number of files.|≤ 1000 |
|Total content size in a batch | ≤ 250 MB|
|Number of target languages in a batch| ≤ 10 |
|Size of Translation memory file| ≤ 10 MB|

> [!NOTE]
> The above content limits are subject to change prior to the public release.

## Learn more

* [Translator v3 API reference](../reference/v3-0-reference.md)
* [Language support](../language-support.md)
* [Subscriptions in Azure API Management](/azure/api-management/api-management-subscriptions).
>
>
