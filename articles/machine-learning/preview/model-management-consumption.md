---
title: Azure Machine Learning Model Management web service consumption | Microsoft Docs
description: This document describes the steps and concepts involved in consuming web services deployed using model management in Azure Machine Learning.
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/06/2017
---
# Consuming web services
Once you deploy a model as a realtime Web service, you can send it data and get predictions from a variety of platforms and applications. You can send the data to the web service in single or multiple rows.

With the Azure Machine Learning Web service, an external application communicates with a predictive model in real time. A web service call returns prediction results to the external application. To make a Web service call, you pass an API key that is created when you deploy a prediction. 

[!NOTE]: API keys are only available in Cluster deployment mode. Local web services do not have keys.

## Get service information
After the web service has been successfully deployed, use the following command to get the service URL. 

```
az ml service usage realtime -i <service name>
```

Test the service from the CLI, by entering the sample CLI command with the input data:

```
az ml service run realtime -i <service name> -d "Your input data"
```

## Get the service API key
To get the web service key, use the following command:

```
az ml service keys realtime -i <web service id>
```

## Call the service using C#
Use the service URL to send a request from a C# Console App. 

1. In Visual Studio, create a new Console App: 
    * In the menu, click, File -> New -> Project
    * Under Visual Studio C#, click Windows Class Desktop, then select Console App.
2. Enter _MyFirstService_ as the Name of the project, then click OK.
3. In Project References, set references to _System.Net_, and _System.Net.Http_.
4. Click Tools -> NuGet Package Manager -> Package Manager Console, then install the Microsoft.AspNet.WebApi.Client package.
5. Open Program.cs file, and replace the code with the following code.
6. Update the _SERVICE_URL_ and _API_KEY_ parameters with the information from your web service.
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
2. Update the data, url, and api_key parameters
3. Run the code. 

```python
import requests
import json

data = "{\"input_df\": [{\"feature1\": value1, \"feature2\": value2}]}"
body = str.encode(json.dumps(data))

url = 'http://<service ip address>:80/api/v1/service/<service name>/score'
api_key = 'your service key' 
headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

resp = requests.post(url, data, headers=headers)
resp.text
```
