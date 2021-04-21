---
title: Create client for model deployed as web service
titleSuffix: Azure Machine Learning
description: Learn how to call a web service endpoint that was generated when a model was deployed from Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 10/12/2020
ms.topic: conceptual
ms.custom: "how-to, devx-track-python, devx-track-csharp"


#Customer intent: As a developer, I need to understand how to create a client application that consumes the web service of a deployed ML model.
---

# Consume an Azure Machine Learning model deployed as a web service


Deploying an Azure Machine Learning model as a web service creates a REST API endpoint. You can send data to this endpoint and receive the prediction returned by the model. In this document, learn how to create clients for the web service by using C#, Go, Java, and Python.

You create a web service when you deploy a model to your local environment, Azure Container Instances, Azure Kubernetes Service, or field-programmable gate arrays (FPGA). You retrieve the URI used to access the web service by using the [Azure Machine Learning SDK](/python/api/overview/azure/ml/intro). If authentication is enabled, you can also use the SDK to get the authentication keys or tokens.

The general workflow for creating a client that uses a machine learning web service is:

1. Use the SDK to get the connection information.
1. Determine the type of request data used by the model.
1. Create an application that calls the web service.

> [!TIP]
> The examples in this document are manually created without the use of OpenAPI (Swagger) specifications. If you've enabled an OpenAPI specification for your deployment, you can use tools such as [swagger-codegen](https://github.com/swagger-api/swagger-codegen) to create client libraries for your service.

## Connection information

> [!NOTE]
> Use the Azure Machine Learning SDK to get the web service information. This is a Python SDK. You can use any language to create a client for the service.

The [azureml.core.Webservice](/python/api/azureml-core/azureml.core.webservice%28class%29) class provides the information you need to create a client. The following `Webservice` properties are useful for creating a client application:

* `auth_enabled` - If key authentication is enabled, `True`; otherwise, `False`.
* `token_auth_enabled` - If token authentication is enabled, `True`; otherwise, `False`.
* `scoring_uri` - The REST API address.
* `swagger_uri` - The address of the OpenAPI specification. This URI is available if you enabled automatic schema generation. For more information, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

There are a several ways to retrieve this information for deployed web services:

# [Python](#tab/python)

* When you deploy a model, a `Webservice` object is returned with information about the service:

    ```python
    service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
    service.wait_for_deployment(show_output = True)
    print(service.scoring_uri)
    print(service.swagger_uri)
    ```

* You can use `Webservice.list` to retrieve a list of deployed web services for models in your workspace. You can add filters to narrow the list of information returned. For more information about what can be filtered on, see the [Webservice.list](/python/api/azureml-core/azureml.core.webservice.webservice.webservice) reference documentation.

    ```python
    services = Webservice.list(ws)
    print(services[0].scoring_uri)
    print(services[0].swagger_uri)
    ```

* If you know the name of the deployed service, you can create a new instance of `Webservice`, and provide the workspace and service name as parameters. The new object contains information about the deployed service.

    ```python
    service = Webservice(workspace=ws, name='myservice')
    print(service.scoring_uri)
    print(service.swagger_uri)
    ```

# [Azure CLI](#tab/azure-cli)

If you know the name of the deployed service, use the [az ml service show](/cli/azure/ml/service#az_ml_service_show) command:

```azurecli
az ml service show -n <service-name>
```

# [Portal](#tab/azure-portal)

From Azure Machine Learning studio, select __Endpoints__, __Real-time endpoints__, and then the endpoint name. In details for the endpoint, the __REST endpoint__ field contains the scoring URI. The __Swagger URI__ contains the swagger URI.

---

The following table shows what these URIs look like:

| URI type | Example |
| ----- | ----- |
| Scoring URI | `http://104.214.29.152:80/api/v1/service/<service-name>/score` |
| Swagger URI | `http://104.214.29.152/api/v1/service/<service-name>/swagger.json` |

> [!TIP]
> The IP address will be different for your deployment. Each AKS cluster will hve it's own IP address that is shared by deployments to that cluster.

### Secured web service

If you secured the deployed web service using a TLS/SSL certificate, you can use [HTTPS](https://en.wikipedia.org/wiki/HTTPS) to connect to the service using the scoring or swagger URI. HTTPS helps secure communications between a client and a web service by encrypting communications between the two. Encryption uses [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security). TLS is sometimes still referred to as *Secure Sockets Layer* (SSL), which was the predecessor of TLS.

> [!IMPORTANT]
> Web services deployed by Azure Machine Learning only support TLS version 1.2. When creating a client application, make sure that it supports this version.

For more information, see [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md).

### Authentication for services

Azure Machine Learning provides two ways to control access to your web services.

|Authentication Method|ACI|AKS|
|---|---|---|
|Key|Disabled by default| Enabled by default|
|Token| Not Available| Disabled by default |

When sending a request to a service that is secured with a key or token, use the __Authorization__ header to pass the key or token. The key or token must be formatted as `Bearer <key-or-token>`, where `<key-or-token>` is your key or token value.

The primary difference between keys and tokens is that **keys are static and can be regenerated manually**, and **tokens need to be refreshed upon expiration**. Key-based auth is supported for Azure Container Instance and Azure Kubernetes Service deployed web-services, and token-based auth is **only** available for Azure Kubernetes Service deployments. For more information on configuring authentication, see [Configure authentication for models deployed as web services](how-to-authenticate-web-service.md).


#### Authentication with keys

When you enable authentication for a deployment, you automatically create authentication keys.

* Authentication is enabled by default when you are deploying to Azure Kubernetes Service.
* Authentication is disabled by default when you are deploying to Azure Container Instances.

To control authentication, use the `auth_enabled` parameter when you are creating or updating a deployment.

If authentication is enabled, you can use the `get_keys` method to retrieve a primary and secondary authentication key:

```python
primary, secondary = service.get_keys()
print(primary)
```

> [!IMPORTANT]
> If you need to regenerate a key, use [`service.regen_key`](/python/api/azureml-core/azureml.core.webservice%28class%29).

#### Authentication with tokens

When you enable token authentication for a web service, a user must provide an Azure Machine Learning JWT token to the web service to access it. 

* Token authentication is disabled by default when you are deploying to Azure Kubernetes Service.
* Token authentication is not supported when you are deploying to Azure Container Instances.

To control token authentication, use the `token_auth_enabled` parameter when you are creating or updating a deployment.

If token authentication is enabled, you can use the `get_token` method to retrieve a bearer token and that tokens expiration time:

```python
token, refresh_by = service.get_token()
print(token)
```

If you have the [Azure CLI and the machine learning extension](reference-azure-machine-learning-cli.md), you can use the following command to get a token:

```azurecli
az ml service get-access-token -n <service-name>
```

> [!IMPORTANT]
> Currently the only way to retrieve the token is by using the Azure Machine Learning SDK or the Azure CLI machine learning extension.

You will need to request a new token after the token's `refresh_by` time. 

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

> [!IMPORTANT]
> The structure of the data needs to match what the scoring script and model in the service expect. The scoring script might modify the data before passing it to the model.

### Binary data

For information on how to enable support for binary data in your service, see [Binary data](how-to-deploy-advanced-entry-script.md#binary-data).

> [!TIP]
> Enabling support for binary data happens in the score.py file used by the deployed model. From the client, use the HTTP functionality of your programming language. For example, the following snippet sends the contents of a JPG file to a web service:
>
> ```python
> import requests
> # Load image data
> data = open('example.jpg', 'rb').read()
> # Post raw data to scoring URI
> res = request.post(url='<scoring-uri>', data=data, headers={'Content-Type': 'application/> octet-stream'})
> ```

### Cross-origin resource sharing (CORS)

For information on enabling CORS support in your service, see [Cross-origin resource sharing](how-to-deploy-advanced-entry-script.md#cors).

## Call the service (C#)

This example demonstrates how to use C# to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/notebook_runner/training_notebook.ipynb) example:

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
            // Set the scoring URI and authentication key or token
            string scoringUri = "<your web service URI>";
            string authKey = "<your key or token>";

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

The results returned are similar to the following JSON document:

```json
[217.67978776218715, 224.78937091757172]
```

## Call the service (Go)

This example demonstrates how to use Go to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/notebook_runner/training_notebook.ipynb) example:

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
// Set to the authentication key or token (if any) for your service
var authKey string = "<your key or token>"

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

The results returned are similar to the following JSON document:

```json
[217.67978776218715, 224.78937091757172]
```

## Call the service (Java)

This example demonstrates how to use Java to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/notebook_runner/training_notebook.ipynb) example:

```java
import java.io.IOException;
import org.apache.http.client.fluent.*;
import org.apache.http.entity.ContentType;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class App {
    // Handle making the request
    public static void sendRequest(String data) {
        // Replace with the scoring_uri of your service
        String uri = "<your web service URI>";
        // If using authentication, replace with the auth key or token
        String key = "<your key or token>";
        try {
            // Create the request
            Content content = Request.Post(uri)
            .addHeader("Content-Type", "application/json")
            // Only needed if using authentication
            .addHeader("Authorization", "Bearer " + key)
            // Set the JSON data as the body
            .bodyString(data, ContentType.APPLICATION_JSON)
            // Make the request and display the response.
            .execute().returnContent();
            System.out.println(content);
        }
        catch (IOException e) {
            System.out.println(e);
        }
    }
    public static void main(String[] args) {
        // Create the data to send to the service
        JSONObject obj = new JSONObject();
        // In this case, it's an array of arrays
        JSONArray dataItems = new JSONArray();
        // Inner array has 10 elements
        JSONArray item1 = new JSONArray();
        item1.add(0.0199132141783263);
        item1.add(0.0506801187398187);
        item1.add(0.104808689473925);
        item1.add(0.0700725447072635);
        item1.add(-0.0359677812752396);
        item1.add(-0.0266789028311707);
        item1.add(-0.0249926566315915);
        item1.add(-0.00259226199818282);
        item1.add(0.00371173823343597);
        item1.add(0.0403433716478807);
        // Add the first set of data to be scored
        dataItems.add(item1);
        // Create and add the second set
        JSONArray item2 = new JSONArray();
        item2.add(-0.0127796318808497);
        item2.add(-0.044641636506989);
        item2.add(0.0606183944448076);
        item2.add(0.0528581912385822);
        item2.add(0.0479653430750293);
        item2.add(0.0293746718291555);
        item2.add(-0.0176293810234174);
        item2.add(0.0343088588777263);
        item2.add(0.0702112981933102);
        item2.add(0.00720651632920303);
        dataItems.add(item2);
        obj.put("data", dataItems);

        // Make the request using the JSON document string
        sendRequest(obj.toJSONString());
    }
}
```

The results returned are similar to the following JSON document:

```json
[217.67978776218715, 224.78937091757172]
```

## Call the service (Python)

This example demonstrates how to use Python to call the web service created from the [Train within notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/notebook_runner/training_notebook.ipynb) example:

```python
import requests
import json

# URL for the web service
scoring_uri = '<your web service URI>'
# If the service is authenticated, set the key or token
key = '<your key or token>'

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
headers = {'Content-Type': 'application/json'}
# If authentication is enabled, set the authorization header
headers['Authorization'] = f'Bearer {key}'

# Make the request and display the response
resp = requests.post(scoring_uri, input_data, headers=headers)
print(resp.text)
```

The results returned are similar to the following JSON document:

```JSON
[217.67978776218715, 224.78937091757172]
```


## Web service schema (OpenAPI specification)

If you used automatic schema generation with your deployment, you can get the address of the OpenAPI specification for the service by using the [swagger_uri property](/python/api/azureml-core/azureml.core.webservice.local.localwebservice#swagger-uri). (For example, `print(service.swagger_uri)`.) Use a GET request or open the URI in a browser to retrieve the specification.

The following JSON document is an example of a schema (OpenAPI specification) generated for a deployment:

```json
{
    "swagger": "2.0",
    "info": {
        "title": "myservice",
        "description": "API specification for Azure Machine Learning myservice",
        "version": "1.0"
    },
    "schemes": [
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "For example: Bearer abc123"
        }
    },
    "paths": {
        "/": {
            "get": {
                "operationId": "ServiceHealthCheck",
                "description": "Simple health check endpoint to ensure the service is up at any given point.",
                "responses": {
                    "200": {
                        "description": "If service is up and running, this response will be returned with the content 'Healthy'",
                        "schema": {
                            "type": "string"
                        },
                        "examples": {
                            "application/json": "Healthy"
                        }
                    },
                    "default": {
                        "description": "The service failed to execute due to an error.",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/score": {
            "post": {
                "operationId": "RunMLService",
                "description": "Run web service's model and get the prediction output",
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "serviceInputPayload",
                        "in": "body",
                        "description": "The input payload for executing the real-time machine learning service.",
                        "schema": {
                            "$ref": "#/definitions/ServiceInput"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The service processed the input correctly and provided a result prediction, if applicable.",
                        "schema": {
                            "$ref": "#/definitions/ServiceOutput"
                        }
                    },
                    "default": {
                        "description": "The service failed to execute due to an error.",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "ServiceInput": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                }
            },
            "example": {
                "data": [
                    [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
                ]
            }
        },
        "ServiceOutput": {
            "type": "array",
            "items": {
                "type": "number",
                "format": "double"
            },
            "example": [
                3726.995
            ]
        },
        "ErrorResponse": {
            "type": "object",
            "properties": {
                "status_code": {
                    "type": "integer",
                    "format": "int32"
                },
                "message": {
                    "type": "string"
                }
            }
        }
    }
}
```

For more information, see [OpenAPI specification](https://swagger.io/specification/).

For a utility that can create client libraries from the specification, see [swagger-codegen](https://github.com/swagger-api/swagger-codegen).


> [!TIP]
> You can retrieve the schema JSON document after you deploy the service. Use the [swagger_uri property](/python/api/azureml-core/azureml.core.webservice.local.localwebservice#swagger-uri) from the deployed web service (for example, `service.swagger_uri`) to get the URI to the local web service's Swagger file.

## Consume the service from Power BI

Power BI supports consumption of Azure Machine Learning web services to enrich the data in Power BI with predictions. 

To generate a web service that's supported for consumption in Power BI, the schema must support the format that's required by Power BI. [Learn how to create a Power BI-supported schema](./how-to-deploy-advanced-entry-script.md#power-bi-compatible-endpoint).

Once the web service is deployed, it's consumable from Power BI dataflows. [Learn how to consume an Azure Machine Learning web service from Power BI](/power-bi/service-machine-learning-integration).

## Next steps

To view a reference architecture for real-time scoring of Python and deep learning models, go to the [Azure architecture center](/azure/architecture/reference-architectures/ai/realtime-scoring-python).
