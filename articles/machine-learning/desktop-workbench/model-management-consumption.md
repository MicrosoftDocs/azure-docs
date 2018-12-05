---
title: Azure Machine Learning Model Management web service consumption | Microsoft Docs
description: This document describes the steps and concepts involved in consuming web services deployed using model management in Azure Machine Learning.
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: hjerez
ms.reviewer: jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/06/2017

ROBOTS: NOINDEX
---

# Consuming web services

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


Once you deploy a model as a realtime web service, you can send it data and get predictions from a variety of platforms and applications. The realtime web service exposes a REST API for getting predictions. You can send data to the web service in the single or multi-row format to get one or more predictions at a time.

With the [Azure Machine Learning Web service](model-management-service-deploy.md), an external application synchronously communicates with a predictive model by making HTTP POST call to the service URL. To make a web service call, the client application needs to specify the API key that is created when you deploy a prediction, and put the request data into the POST request body.

> [!NOTE]
> Note that API keys are only available in the cluster deployment mode. Local web services do not have keys.

## Service deployment options
Azure Machine Learning Web services can be deployed to the cloud-based clusters for both production and test scenarios, and to local workstations using docker engine. The functionality of the predictive model in both cases remains the same. Cluster-based deployment provides scalable and performant solution based on Azure Container Services, while the local deployment can be used for debugging. 

The Azure Machine Learning CLI and API provides convenient commands for creating and managing compute environments for service deployments using the ```az ml env``` option. 

## List deployed services and images
You can list the currently deployed services and Docker images using CLI command ```az ml service list realtime -o table```. Note that this command always works in the context of the current compute environment. It would not show services that are deployed in an environment that is not set to be the current. To set the environment use ```az ml env set```. 

## Get service information
After the web service has been successfully deployed, use the following command to get the service URL and other details for calling the service endpoint. 

```
az ml service usage realtime -i <web service id>
```

This command prints out the service URL, required request headers, swagger URL, and sample data for calling the service if the service API schema was provided at the deployment time.

You can test the service directly from the CLI without composing an HTTP request, by entering the sample CLI command with the input data:

```
az ml service run realtime -i <web service id> -d "Your input data"
```

## Get the service API key
To get the web service key, use the following command:

```
az ml service keys realtime -i <web service id>
```
When creating HTTP request, use the key in the authorization header: "Authorization": "Bearer <key>"

## Get the service Swagger description
If the service API schema was supplied, the service endpoint would expose a Swagger document at ```http://<ip>/api/v1/service/<service name>/swagger.json```. The Swagger document can be used to automatically generate the service client and explore the expected input data and other details about the service.

## Get service logs
To understand the service behavior and diagnose problems, there are several ways to retrieve the service logs:
- CLI command ```az ml service logs realtime -i <service id>```. This command works in both cluster and local modes.
- If the service logging was enabled at deployment, the service logs will also be sent to AppInsight. The CLI command ```az ml service usage realtime -i <service id>``` shows the AppInsight URL. Note that the AppInsight logs may be delayed by 2-5 mins.
- Cluster logs can be viewed through Kubernetes console that is connected when you set the current cluster environment with ```az ml env set```
- Local docker logs are available through the docker engine logs when the service is running locally.

## Call the service using C#
Use the service URL to send a request from a C# Console App. 

1. In Visual Studio, create a new Console App: 
    * In the menu, click, File -> New -> Project
    * Under Visual Studio C#, click Windows Class Desktop, then select Console App.
2. Enter `MyFirstService` as the Name of the project, then click OK.
3. In Project References, set references to `System.Net`, and `System.Net.Http`.
4. Click Tools -> NuGet Package Manager -> Package Manager Console, then install the **Microsoft.AspNet.WebApi.Client** package.
5. Open **Program.cs** file, and replace the code with the following code:
6. Update the `SERVICE_URL` and `API_KEY` parameters with the information from your web service.
7. Run the project.

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace MyFirstService
{
    class Program
    {
        // Web Service URL (update it with your service url)
        private const string SERVICE_URL = "http://<service ip address>:80/api/v1/service/<service name>/score";
        private const string API_KEY = "your service key";

        static void Main(string[] args)
        {
            Program.PostRequest();
            Console.ReadLine();
        }

        private static void PostRequest()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(SERVICE_URL);
            //For local web service, comment out this line.
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", API_KEY);

            var inputJson = new List<RequestPayload>();
            RequestPayload payload = new RequestPayload();
            List<InputDf> inputDf = new List<InputDf>();
            inputDf.Add(new InputDf()
            {
                feature1 = value1,
                feature2 = value2,
            });
            payload.Input_df_list = inputDf;
            inputJson.Add(payload);

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, string.Empty);
                request.Content = new StringContent(JsonConvert.SerializeObject(payload));
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var response = client.SendAsync(request).Result;

                Console.Write(response.Content.ReadAsStringAsync().Result);
            }
            catch (Exception e)
            {
                Console.Out.WriteLine(e.Message);
            }
        }
        public class InputDf
        {
            public double feature1 { get; set; }
            public double feature2 { get; set; }
        }
        public class RequestPayload
        {
            [JsonProperty("input_df")]
            public List<InputDf> Input_df_list { get; set; }
        }
    }
}
```

## Call the web service using Python
Use Python to send a request to your real-time web service. 

1. Copy the following code sample to a new Python file.
2. Update the data, url, and api_key parameters. For local web services, remove the 'Authorization' header.
3. Run the code. 

```python
import requests
import json

data = "{\"input_df\": [{\"feature1\": value1, \"feature2\": value2}]}"
body = str.encode(json.dumps(data))

url = 'http://<service ip address>:80/api/v1/service/<service name>/score'
api_key = 'your service key' 
headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

resp = requests.post(url, body, headers=headers)
resp.text
```
