---
title: Consume web service deployments - Azure Machine Learning
description: Learn how to consume a web service created by deploying an Azure Machine Learning model. Deploying an Azure Machine Learning model creates a web service that exposes a REST API. You can create clients for this API using the programming language of your choice. In this document, learn how to access the API using Python and C#.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: larryfr
ms.date: 10/30/2018
---

# Create a client for an Azure ML model deployed as a web service

Deploying an Azure Machine Learning model as a web service creates a REST API. You can send data to this API and receive the prediction returned by the model.

## Get the REST API information

The REST API information can be retrieved using the Azure Machine Learning SDK. The [`Webservice`](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py) class provides the information necessary to create a client for the REST API exposed by the web service. The following `Webservice` properties that are useful when creating a client application:

* `auth_enabled` - If authentication is enabled, `True`; otherwise, `False`.
* `scoring_uri` - The REST API address.
* `swagger_uri` - The address used to retrieve the Swagger information for the service. This information is useful if you are using the [Swagger tools](https://swagger.io/tools/) or other utility that requires a Swagger information.

There are a three ways to retrieve this information for a service:

> [!NOTE]
> The Azure Machine Learning SDK is a Python package. While it is used to retrieve information about the web services, you can use any language to create a REST client for the service.

* When you deploy a model, a `Webservice` object is returned with this information:

    ```python
    service = Webservice.deploy_from_model(name='myservice',
                                           deployment_config=myconfig,
                                           models=[model],
                                           image_config=image_config,
                                           workspace=ws)
    print(service.scoring_uri)
    ```

* You can use `Webservice.list` to retrieve a list of deployed web services for models in your workspace.

    ```python
    services = Webservice.list(ws)
    print(services[0].scoring_uri)
    ```

* If you know the name of the deployed service, you can create a new instance of `Webservice` and provide the workspace and service name as parameters.

    ```python
    service = Webservice(workspace=ws, name='myservice')
    print(service.scoring_uri)
    ```

### Authentication key

If authentication is enabled, you can use the `get_keys` method to retrieve a primary and secondary authentication key:

```python
primary, secondary = service.get_keys()
print(primary)
```

> [!IMPORTANT]
> If you need to regenerate a key, use [`service.regen_key`](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#regen-key).

## Request data

The REST API expects the body of the request to be a JSON document with the following structure:

```json
{
    "data":
        [
            <model-specific-data-structure>
        ]
}
```

The structure of the data needs to match what the scoring script for the service expects. The script might modify the data before passing it to the model, or it might pass it directly to the model. 

For example, the `scoring.py` file in the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/01.getting-started/01.train-within-notebook) example creates a Numpy array from the data and passes it to the model. In this case, the model expects an array of 10 values. The following JSON document is an example of the data this model expects:

```json
{
    "data": 
        [
            [
                0.0199132141783263, 
                0.0506801187398187, 
                0.104808689473925, 
                0.0700725447072635, 
                -0.0359677812752396, 
                -0.0266789028311707, 
                -0.0249926566315915, 
                -0.00259226199818282, 
                0.00371173823343597, 
                0.0403433716478807
            ]
        ]
}
``` 

## Call the service (C#)

This example demonstrates how to use C# to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/01.getting-started/01.train-within-notebook) example:

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace MLWebServiceClient
{
    // The data structure expected by the service
    internal class InputData
    {
        [JsonProperty("data")]
        // The service used by this example expects an array containing
        //   one or more arrays of doubles
        internal double[,] data;
    }
    class Program
    {
        static void Main(string[] args)
        {
            // Set the scoring URI and authentication key
            string scoringUri = "<your web service URI>";
            string authKey = "<your key>";

            // Set the data to be sent to the service.
            // In this case, we are sending two sets of data to be scored.
            InputData payload = new InputData();
            payload.data = new double[,] {
                {
                    0.0199132141783263,
                    0.0506801187398187,
                    0.104808689473925,
                    0.0700725447072635,
                    -0.0359677812752396,
                    -0.0266789028311707,
                    -0.0249926566315915,
                    -0.00259226199818282,
                    0.00371173823343597,
                    0.0403433716478807
                },
                {
                    -0.0127796318808497, 
                    -0.044641636506989, 
                    0.0606183944448076, 
                    0.0528581912385822, 
                    0.0479653430750293, 
                    0.0293746718291555, 
                    -0.0176293810234174, 
                    0.0343088588777263, 
                    0.0702112981933102, 
                    0.00720651632920303
                }
            };

            // Create the HTTP client
            HttpClient client = new HttpClient();
            // Set the auth header. Only needed if the web service requires authentication.
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authKey);

            // Make the request
            try {
                var request = new HttpRequestMessage(HttpMethod.Post, new Uri(scoringUri));
                request.Content = new StringContent(JsonConvert.SerializeObject(payload));
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var response = client.SendAsync(request).Result;
                // Display the response from the web service
                Console.WriteLine(response.Content.ReadAsStringAsync().Result);
            }
            catch (Exception e)
            {
                Console.Out.WriteLine(e.Message);
            }
        }
    }
}
```

The results returned are similar to the following text:

```text
[217.67978776218715, 224.78937091757172]
```

## Call the service (Go)

This example demonstrates how to use Go to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/01.getting-started/01.train-within-notebook) example:

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Features for this model are an array of decimal values
type Features []float64

// The web service input can accept multiple sets of values for scoring
type InputData struct {
	Data []Features `json:"data",omitempty`
}

// Define some example data
var exampleData = []Features{
	[]float64{
		0.0199132141783263, 
		0.0506801187398187, 
		0.104808689473925, 
		0.0700725447072635, 
		-0.0359677812752396, 
		-0.0266789028311707, 
		-0.0249926566315915, 
		-0.00259226199818282, 
		0.00371173823343597, 
		0.0403433716478807,
	},
	[]float64{
		-0.0127796318808497, 
		-0.044641636506989, 
		0.0606183944448076, 
		0.0528581912385822, 
		0.0479653430750293, 
		0.0293746718291555, 
		-0.0176293810234174, 
		0.0343088588777263, 
		0.0702112981933102, 
		0.00720651632920303,
	},
}

// Set to the URI for your service
var serviceUri string = "<your web service URI>"
// Set to the authentication key (if any) for your service
var authKey string = "<your key>"

func main() {
	// Create the input data from example data
	jsonData := InputData{
		Data: exampleData,
	}
	// Create JSON from it and create the body for the HTTP request
	jsonValue, _ := json.Marshal(jsonData)
	body := bytes.NewBuffer(jsonValue)

	// Create the HTTP request
	client := &http.Client{}
	request, err := http.NewRequest("POST", serviceUri, body)
	request.Header.Add("Content-Type", "application/json")

	// These next two are only needed if using an authentication key
	bearer := fmt.Sprintf("Bearer %v", authKey)
	request.Header.Add("Authorization", bearer)

	// Send the request to the web service
	resp, err := client.Do(request)
	if err != nil {
		fmt.Println("Failure: ", err)
	}

	// Display the response received
	respBody, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(respBody))
}
```

The results returned are similar to the following text:

```text
[217.67978776218715, 224.78937091757172]
```

## Call the service (Python)

This example demonstrates how to use Python to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/01.getting-started/01.train-within-notebook) example:

```python
import requests
import requests
import json

# URL for the web service
scoring_uri = '<your web service URI>'
# If the service is authenticated, set the key
key = '<your key>'

# Two sets of data to score, so we get two results back
data = {"data": 
            [
                [
                    0.0199132141783263, 
                    0.0506801187398187, 
                    0.104808689473925, 
                    0.0700725447072635, 
                    -0.0359677812752396, 
                    -0.0266789028311707, 
                    -0.0249926566315915, 
                    -0.00259226199818282, 
                    0.00371173823343597, 
                    0.0403433716478807
                ],
                [
                    -0.0127796318808497, 
                    -0.044641636506989, 
                    0.0606183944448076, 
                    0.0528581912385822, 
                    0.0479653430750293, 
                    0.0293746718291555, 
                    -0.0176293810234174, 
                    0.0343088588777263, 
                    0.0702112981933102, 
                    0.00720651632920303]
            ]
        }
# Convert to JSON string
input_data = json.dumps(data)

# Set the content type
headers = { 'Content-Type':'application/json' }
# If authentication is enabled, set the authorization header
headers['Authorization']=f'Bearer {key}'

# Make the request and display the response
resp = requests.post(scoring_uri, input_data, headers = headers)
print(resp.text)

```

The results returned are similar to the following text:

```text
[217.67978776218715, 224.78937091757172]
```

## Next steps

Now that you have learned how to create a client for a deployed model, learn how to [Deploy a model to an IoT Edge device](how-to-deploy-to-iot.md).