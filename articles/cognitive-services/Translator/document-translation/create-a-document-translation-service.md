---
title: Use Translator for document translation
description: How to create a document translation service using C#, Go, Java, Node.js, or Python platforms
ms.topic: quickstart
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 01/25/2021
---

# Get started with Document Translation

## Prerequisites

To get started, you'll need the following:

1. An active Azure subscription.
If you don't have one, you can [**create a free Azure account**](https://azure.microsoft.com/free/cognitive-services/).
1. A Translator resource. You can [create your Translator resource](../translator-how-to-signup.md) in the Azure portal. **TODO** add #create-your-resource
1. An Azure blob storage account. You can [create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) in the Azure portal.

## Create Azure storage containers

You will need to create two storage containers within your Azure blob storage account. You will upload your documents into a read-only access container and store your translated documents in a write-only access container:

### List and read-only access container

1. [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) in your Azure blog storage account to upload your files.
1. Create a [service shared access signature (SAS)](/rest/api/storageservices/create-service-sas) for your container with  [**list** and **read-only access**](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)

### List and write-only access container

1. Create a second container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) to store your final translated documents.
1. Create a [service shared access signature (SAS)](/rest/api/storageservices/create-service-sas) for your container with  [list and **write-only access**](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob)

## Keys and endpoints

1. If you have created a new resource, after it deploys, select **Go to resource** or go directly to your Document Translation subscription .
1. In the left rail, under *Resource Management*, Select **Keys and Endpoint**.
1. Copy and paste either key and the endpoint in a convenient location, such as *Microsoft Notepad*. You'll paste them into the code below to connect your application to the Document Translation service.

> [!NOTE]
> For the samples below, you will hard-code your keys and endpoint where indicated; remember to remove the key from your code when you're done, and never post it publicly. See [Azure Cognitive Services security](/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp) for ways to securely store and access your credentials.

## Headers

When calling the Document Translation service via REST, the following headers must be included with each request:

|HTTP header|Description|
|---|--|
|Ocp-Apim-Subscription-Key|**Required**: The value is the Azure secret key for your Translator or Cognitive Services resource|
|Ocp-Apim-Subscription-Region|**Required** if using the Cognitive Services resource.</br>**Optional** if using a Translator resource|
|Content-Type|**Required**: Specifies the content type of the payload. Accepted values are application/json or charset=UTF-8.|
|Content-Length|**Required**: the length of the request body.|
|Authorization|**Required** for use with the Cognitive Services subscription if you are passing an authentication token.<br/><br/>The value is the **Bearer token: Bearer**.|

## Submit Document Translation request (POST)

### Submit requests

* Submit a batch document translation request to the translation service
* Each request will consist of multiple inputs.
* Each input will contain both a source and destination container for source and target language pairs.
* The prefix and suffix filter (if supplied) will be used to filter the folders. The prefix will be applied to the sub-path after the container name.
* Glossaries / Translation memory can be supplied and will be applied when the document is being translated. 
* If the file with the same name already exists in the destination, it will be overwritten.
* The `targetUrl` for each target language needs to be unique.

### Request URL

Send a POST request to: endpoint/batches

### Request body

#### inputs array

The body of the request is a JSON array named **inputs**. Each request can consist of multiple inputs and each input will contain both a source and targets container.

#### source object

|property|description|
|---|---|
|**`sourceUrl`**| Container having source documents along with the SAS token with list and read-only access.|
|**`storageSource`**|Type of cloud storage (currently, only ‘AzureBlob’ is supported)   |
|**`filter`**   |Filter definitions:</br>&emsp; &bullet; **prefix**—To filter files and/or folders (optional). </br>&emsp; &bullet; **suffix**—To filter files and/or folders (optional).  |
|**`language`**   | language of source documents  |

#### targets array

&emsp; Multiple targets can be defined.

|property| description |
|---|---|
| **`targetUrl`**  | container for storing translated documents along the SAS token with list and write-only access.|
|**`storageSource`**|Type of cloud storage (currently, only ‘AzureBlob’ is supported)   |
| **`category`**  |Custom model id (optional). A generic translation model is used by default.|
| **`language`**  | Target translation language (optional).|
| **`source`** | source definition  |
| **`glossaries`**  | Multiple glossaries can be defined (optional). </br> If the glossary is invalid or unreachable during translation time. An error will be indicated in the document status.|
|**`glossaryUrl`**  | container having source documents  |
| **`format`**  |**Optional:** Format of glossary file (optional).|
|**`version`** | **Optional:** Version of the format.|

#### sample HTTP request

```http
POST /translator/text/batch/v1.0-preview.1/batches
Host: <TRANSLATOR-SERVICE-ENDPOINT>
Ocp-Apim-Subscription-Key: <TRANSLATOR-SERVICE-KEY>
Content-Type: application/json
Content-Length: 954

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

### Platform setup

### [C](#tab/csharp)

* Create a new project.
* Replace Program.cs with the C# code shown below.
* Set your endpoint. subscription key, and container URL values in Program.cs.
* To process JSON data, add [Newtonsoft.Json package using .NET CLI](https://www.nuget.org/packages/Newtonsoft.Json/).
* Run the program from the project directory.

### [Node.js](#tab/javascript)

* Create a new Node.js project.
* Install the Axios library with `npm i axios`.
* Copy pasted the code below into your project.
* Set your endpoint. subscription key, and container URL values.
* Run the program.
  
### [Java](#tab/java)

* Create a working directory for your project. For example: `mkdir sample-project`.
* Initialize your project with Gradle: `gradle init --type basic`. When prompted to choose a **DSL**, select **Kotlin**.
* Update `build.gradle.kts`. Keep in mind that you'll need to update your `mainClassName` depending on the sample.

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

* Create a Java file and copy in the code from the provided sample. Don't forget to add your subscription key.
* Run the sample: `gradle run`.

### [Python](#tab/python)  

* Create a new project.
* Copy and paste the code from one of the samples into your project.
* Set your endpoint. subscription key, and container URL values.
* Run the program. For example: `python translate.py`.

### [Go](#tab/go)  

* Create a new Go project.
* Add the code provided below.
* Set your endpoint. subscription key, and container URL values.
* Save the file with a '.go' extension.
* Open a command prompt on a computer with Go installed.
* Build the file, for example: 'go build example-code.go'.
* Run the file, for example: 'example-code'.

### Translate documents

> [!IMPORTANT]
> This method requires that you add the `/batches` parameter to each instance of your translator services endpoint.

### [C#](#tab/csharp)

```csharp


    using System;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Text;
    using Newtonsoft.Json;

    class Program
    {

        private static readonly string subscriptionKey = "6d9013264d0746b68b9d61ab0c638c46";

        private static readonly string endpoint = "https://kdoss-cs-mt-global.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches";

        static readonly string json = ("{\"inputs\": [{\"source\": {\"sourceUrl\": \"https://kdossblob.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-01-22T02%3A48%3A41Z&se=2021-02-06T02%3A48%3A00Z&sr=c&sp=rl&sig=FSDuKgTb6PsKmofXgeoyl%2B8X6x8F7kY0HB%2BCuey7kDI%3D\",\"storageSource\": \"AzureBlob\",\"language\": \"en\",\"filter\":{\"prefix\": \"Demo_1/\"} }, \"targets\": [{\"targetUrl\": \"https://kdossblob.blob.core.windows.net/target-es?sv=2019-12-12&st=2021-01-24T03%3A50%3A18Z&se=2021-02-06T03%3A50%3A00Z&sr=c&sp=wl&sig=lMWFWcbVej%2B9ZElii1KqyRxsUeIF5kr7bzaIS5mP8%2Bs%3D\",\"storageSource\": \"AzureBlob\",\"category\": \"general\",\"language\": \"es\"}]}]}");
        
        // Add your location, also known as region. The default is global.
        // This is required if using a Cognitive Services resource.
        //private static readonly string location = "YOUR_TRANSLATOR-RESOURCE_LOCATION";

        static async Task Main(string[] args)
        {

            using HttpClient client = new HttpClient();
            using HttpRequestMessage request = new HttpRequestMessage();
            {
            
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
                // Create the request
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(endpoint);
                request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
                request.Content = content;
                //request.Headers.Add("Ocp-Apim-Subscription-Region", location);

                // Send the request and get response.
                //HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false);
                //// Read response as a string.
                //string result = await response.Content.ReadAsStringAsync();

                var response = await client.SendAsync(request);
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

let subscriptionKey = "6d9013264d0746b68b9d61ab0c638c46";
let endpoint = "https://kdoss-cs-mt-global.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches";

let data = JSON.stringify({"inputs": [
  {
      "source": {
          "sourceUrl": "https://kdossblob.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-01-22T02%3A48%3A41Z&se=2021-02-06T02%3A48%3A00Z&sr=c&sp=rl&sig=FSDuKgTb6PsKmofXgeoyl%2B8X6x8F7kY0HB%2BCuey7kDI%3D",
          "storageSource": "AzureBlob",
          "language": "en",
          "filter":{
              "prefix": "Demo_1/"
          }
      },
      "targets": [
          {
              "targetUrl": "https://kdossblob.blob.core.windows.net/target-es?sv=2019-12-12&st=2021-01-24T03%3A50%3A18Z&se=2021-02-06T03%3A50%3A00Z&sr=c&sp=wl&sig=lMWFWcbVej%2B9ZElii1KqyRxsUeIF5kr7bzaIS5mP8%2Bs%3D",
              "storageSource": "AzureBlob",
              "category": "general",
              "language": "es"}]}]});

// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
//let location = "YOUR_RESOURCE_LOCATION";

let config = {
  method: 'post',
  baseURL: endpoint,
  headers: {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-Type': 'application/json'
    //'Ocp-Apim-Subscription-Region': location,
  },
  data: data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```

### [Python](#tab/python)

```python

import requests

# Add your subscription key and endpoint
subscription_key = "YOUR-TRANSLATOR-SUBSCRIPTION-KEY"
endpoint = "https://YOUR-TRANSLATOR-SERVICE-ENDPOINT/batches"

# Add your location, also known as region. The default is global.
# This is required if using a Cognitive Services resource.
location = "YOUR_TRANSLATOR-RESOURCE_LOCATION"

url = endpoint

payload="{\r\n  \"inputs\": [\r\n  {\r\n  \"source\": {\r\n  \"sourceUrl\": \"https://YOUR-UPLOADED-DOCUMENTS-CONTAINER-URL\",\r\n  \"storageSource\": \"AzureBlob\",\r\n  \"filter\": {\r\n  \"prefix\":  \"News\",\r\n  \"suffix\": \".txt\"\r\n  },\r\n  \"language\": \"en\"\r\n},\r\n  \"targets\": [\r\n  {\r\n  \"targetUrl\": \"https://YOUR-TRANSLATED-DOCUMENTS-CONTAINER-URL\",\r\n  \"storageSource\": \"AzureBlob\",\r\n  \"category\": \"general\",\r\n  \"language\": \"de\"\r\n }\r\n ]  \r\n     }\r\n]  \r\n}"
headers = {
  'Ocp-Apim-Subscription-Key': subscription_key,
  'Ocp-Apim-Subscription-Region': location,
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

### [Java](#tab/java)

```java
import java.io.IOException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class DocTranslation {

private static String subscriptionKey = "YOUR-TRANSLATOR-SUBSCRIPTION-KEY";
private static String endpoint = "https://YOUR-TRANSLATOR-SERVICE-ENDPOINT";

 // Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
    private static String location = "YOUR_TRANSLATOR-RESOURCE_LOCATION";

OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"inputs\": [\r\n  {\r\n  \"source\": {\r\n  \"sourceUrl\": \"https://YOUR-UPLOADED-DOCUMENTS-CONTAINER-URL\",\r\n  \"storageSource\": \"AzureBlob\",\r\n  \"filter\": {\r\n  \"prefix\":  \"News\",\r\n  \"suffix\": \".txt\"\r\n  },\r\n  \"language\": \"en\"\r\n},\r\n  \"targets\": [\r\n  {\r\n  \"targetUrl\": \"https://YOUR-TRANSLATED-DOCUMENTS-CONTAINER-URL\",\r\n  \"storageSource\": \"AzureBlob\",\r\n  \"category\": \"general\",\r\n  \"language\": \"de\"\r\n }\r\n ]  \r\n     }\r\n]  \r\n}");
Request request = new Request.Builder()
  .url("https://kdoss-cs-mt-global.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches")
  .method("POST", body)
  .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey)
  .addHeader("Ocp-Apim-Subscription-Region": location)
  .addHeader("Content-Type", "application/json")
  .build();
Response response = client.newCall(request).execute();
}
```

### [Go](#tab/go)

```go
package main

import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)

func main() {

  subscriptionKey := "YOUR-TRANSLATOR-SUBSCRIPTION-KEY"
  endpoint := "https://YOUR-TRANSLATOR-SERVICE-ENDPOINT"
    // Add your location, also known as region. The default is global.
    // This is required if using a Cognitive Services resource.
    location := "YOUR_TRANSLATOR-RESOURCE_LOCATION";

  url := endpoint
  method := "POST"

  payload := strings.NewReader(`{`+"
"+`
    "inputs": [`+"
"+`
        {`+"
"+`
            "source": {`+"
"+`
                "sourceUrl": "https://YOUR-UPLOADED-DOCUMENTS-CONTAINER-URL",`+"
"+`
                "storageSource": "AzureBlob",`+"
"+`
                "filter": {`+"
"+`
                    "prefix": "News",`+"
"+`
                    "suffix": ".txt"`+"
"+`
                },`+"
"+`
                "language": "en"`+"
"+`
            },`+"
"+`
            "targets": [`+"
"+`
                {`+"
"+`
                    "targetUrl": "https://YOUR-TRANSLATED-DOCUMENTS-CONTAINER-URL",`+"
"+`
                    "storageSource": "AzureBlob",`+"
"+`
                    "category": "general",`+"
"+`
                    "language": "de"`+"
"+`
                }`+"
"+`
            ]`+"
"+`
        }`+"
"+`
    ]`+"
"+`
}`)

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, payload)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("Ocp-Apim-Subscription-Key", "6d9013264d0746b68b9d61ab0c638c46")
  req.Header.Add("Content-Type", "application/json")

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

### Response (POST)

If successful, this method returns a `202 Accepted`  response code and the batch request is created by the service.

The **Operation-Location** header will consist of the URL to check status along with id.

The id is the last parameter in the path and is used for further reference:

* _**Operation-Location endpoint/batches/jobId**_*

*  `https://kdoss-cs-mt-global.cognitiveservices.azure.com//translator/text/batch/v1.0-preview.1/batches/89040540-738b-4440-9a04-7d0c36b923e1

### GET jobs

#### Brief Overview

Returns a list of jobs and the status of all operations.

#### HTTP request

```http
GET //translator/text/batch/v1.0-preview.1/batches/{job Id}
Host: https://YOUR-TRANSLATOR-SERVICE-ENDPOINT
Ocp-Apim-Subscription-Key: YOUR-TRANSLATOR-SUBSCRIPTION-KEY`
```

### GET job status

#### Brief overview

Returns the list of the current job status.

#### HTTP request

```http
GET //translator/text/batch/v1.0-preview.1/batches/{jobId}
Host: https://YOUR-TRANSLATOR-SERVICE-ENDPOINT
Ocp-Apim-Subscription-Key: YOUR-TRANSLATOR-SUBSCRIPTION-KEY
```

#### Response

If successful, this method returns a `200 OK` response code and a JSON object with the following elements:

|Property|value|
|---|---|
|**id**|The job id you provides in the request|
|**createdDateTimeUtc**| Date and time in UTC when the job is created |
|**lastActionDateTimeUtc**| Date and time in UTC when the job status was last modified |
|**status**|Status of the request:|
|**summary**|List of overall status|
||&bullet; **total** —Total number of documents in the job.</br>&bullet; **success**—Number of completed documents.</br>&bullet; **inProgress** —Number of documents in progress.</br>&bullet; **failed** —Number of documents for which translation failed.</br>&bullet; **notYetStarted**—Number of documents pending translation.</br>&bullet; **cancelled** —Number of documents that have been cancelled. |

### GET documents

#### Brief overview

#### HTTP request

#### Response

### GET document status

#### Brief overview

Returns the status of a specific document.

#### HTTP request

```http
GET  //translator/text/batch/v1.0-preview.1/batches/{1d}/documents/{documentId}
Host: https://YOUR-TRANSLATOR-SERVICE-ENDPOINT
Ocp-Apim-Subscription-Key: YOUR-TRANSLATOR-SUBSCRIPTION-KEY
```

#### Response

If successful, this method returns a `200 OK` response code the operation details for the document.

### DELETE a pending job

#### Brief overview

Cancels a currently processing or queued job.

#### Response

All documents for which translation has not yet started will be cancelled, if possible. If successful, this method returns a `200 OK` response code and a JSON object with the following elements:

|Property|value|
|---|---|
|**id**|The job id you provides in the request|
|**createdDateTimeUtc**| Date and time in UTC when the job is created |
|**lastActionDateTimeUtc**| Date and time in UTC when the job status was last modified |
|**status**|Status of the request:|
||&bullet; **total** —Total number of documents in the job.</br>&bullet; **success**—Number of completed documents.</br>&bullet; **inProgress** —Number of documents in progress.</br>&bullet; **failed** —Number of documents for which translation failed.</br>&bullet; **notYetStarted**—Number of documents pending translation.</br>&bullet; **cancelled** —Number of documents that have been cancelled. |

#### HTTP request

```http
DELETE //translator/text/batch/v1.0-preview.1/batches/{jobId}
Host: https://YOUR-TRANSLATOR-SERVICE-ENDPOINT
Ocp-Apim-Subscription-Key: YOUR-TRANSLATOR-SUBSCRIPTION-KEY
```

### GET Storage Sources

#### Brief overview

#### HTTP request

#### Response

### GET Document Formats

#### Brief overview

#### HTTP request

#### Response


### GET Glossary Formats 

#### Brief overview

#### HTTP request

#### Response

## Request Limits

|Attribute | Limit|
|---|---|
|Document size| ≤ 40MB |
|Total number of files.|≤ 1000 |
|Total content size in a batch | ≤ 250 MB|
|Number of target languages in a batch| ≤ 10 |
|Size of Translation memory file| ≤ 10 MB|
