## GET status of Document Translation Jobs

This request will return the status for each job ("NotStarted", "Succeeded", "Cancelled", "Failed") and the current progress of all documents included in the translation operation.

> [!IMPORTANT]
> This method requires that you add the `/batches` parameter to your translator services endpoint.

#### Sample HTTP resquest

```http
GET https://YOUR-TRANSLATOR-SERVICE-ENDPOINT/batches HTTP/1.1
Host: YOUR-TRANSLATOR-SERVICE-DOMAIN-NAME
Ocp-Apim-Subscription-Key: YOUR-TRANSLATOR-SUBSCRIPTION-KEY
```

* If you have a custom domain, the Host value will be:  
 `<your-custom-domain>.cognitiveservices.azure.com/`

#### Sample HTTP response

```http
{
    "value": [
            {
            "id": "89040540-738b-4440-9a04-7d0c36b923e1",
            "createdDateTimeUtc": "2021-01-22T23:11:05.1262994Z",
            "lastActionDateTimeUtc": "2021-01-22T23:20:33.1248097Z",
            "status": "Succeeded",
            "summary": {
                "total": 2,
                "failed": 0,
                "success": 2,
                "inProgress": 0,
                "notYetStarted": 0,
                "cancelled": 0
            }
        },
                {
            "id": "13a5e074-b237-48b8-b12a-fab47b0ffd77",
            "createdDateTimeUtc": "2021-01-12T22:44:19.0361061Z",
            "lastActionDateTimeUtc": "2021-01-12T22:44:55.7744257Z",
            "status": "Running",
            "summary": {
                "total": 1,
                "failed": 0,
                "success": 0,
                "inProgress": 1,
                "notYetStarted": 0,
                "cancelled": 0
            }
        }
}
```

### [C](#tab/csharp)

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;

    class Program
    {
        static async Task Main(string[] args)
        {
            // create the request
           HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "https://YOUR-TRANSLATOR-SERVICE-ENDPOINT/batches"  );

            // add required HTTP headers
           request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
           request.Headers.Add("Ocp-Apim-Subscription-Region", location); 

           // send request
            using HttpResponse  httpResponse = await HttpClient.SendAsync(request);
            //retrieve response
            string response = await httpResponse.Content.ReadAsStringAsync();
            Console.WriteLine(response);
        }
    }
```

### [Node.js](#tab/javascript)  

```javascript

const axios = require('axios');

var config = {
  method: 'get',
  url: 'https://YOUR-TRANSLATOR-SERVICE-ENDPOINT/batches',
  headers: { 
      'Ocp-Apim-Subscription-Key': 'YOUR-TRANSLATOR-SUBSCRIPTION-KEY',
      'Ocp-Apim-Subscription-Region': location,
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

### [Python](#tab/python)  

```python
import requests

# Add your subscription key and endpoint
subscription_key = "YOUR_TRANSLATOR-SUBSCRIPTION_KEY"
endpoint = "https://YOUR-TRANSLATOR-SERVICE-ENDPOINT/batches"

# Add your location, also known as region. The default is global.
# This is required if using a Cognitive Services resource.
location = "YOUR_TRANSLATOR-RESOURCE_LOCATION"

url = endpoint

payload={}
headers = {
  'Ocp-Apim-Subscription-Key': subscription_key,
  'Ocp-Apim-Subscription-Region': location
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

```

### [Java](#tab/java)  

```java
import java.io.IOException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class DocTranslationGet {

private static String subscriptionKey = "YOUR-TRANSLATOR-SUBSCRIPTION-KEY";
private static String endpoint = "https://YOUR-TRANSLATOR-SERVICE-ENDPOINT/batches";

OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url(endpoint)
  .method("GET", null)
  .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey)
  .addHeader("Ocp-Apim-Subscription-Region": location)
  .build();
Response response = client.newCall(request).execute();
}
```

### [Go](#tab/go)

```go
package main

import (
  "fmt"
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
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("Ocp-Apim-Subscription-Key", subscriptionKey)
  req.Header.Add("Ocp-Apim-Subscription-Region", location)

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