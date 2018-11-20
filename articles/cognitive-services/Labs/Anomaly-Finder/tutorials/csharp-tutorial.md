---
title: "Tutorial: Anomaly Detection, C#"
titlesuffix: Azure Cognitive Services
description: Explore a C# app that uses the Anomaly Detection API. Send original data points to API and get the expected value and anomaly points.
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.component: anomaly-detection
ms.topic: tutorial
ms.date: 05/01/2018
ms.author: chliang
---

# Tutorial: Anomaly Detection with C# application

[!INCLUDE [PrivatePreviewNote](../../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

Explore a basic Windows application that uses Anomaly Detection API to detect anomalies from the input. 
The example submits the time series data to the Anomaly Detection API with your subscription key, then gets all the anomaly points and expected value for each data point from the API.

## Prerequisites

### Platform requirements

The example has been developed for the .NET Framework using [Visual Studio 2017, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs). 

### Subscribe to Anomaly Detection and get a subscription key 

[!INCLUDE [GetSubscriptionKey](../includes/get-subscription-key.md)]

## Get and use the example

You can clone the Anomaly Detection example application to your computer from [Github](https://github.com/MicrosoftAnomalyDetection/csharp-sample.git). 
<a name="Step1"></a>
### Install the example

In your GitHub Desktop, open Sample\AnomalyDetectionSample.sln.

<a name="Step2"></a>
### Build the example

Press Ctrl+Shift+B, or click Build on the ribbon menu, then select Build Solution.

<a name="Step3"></a>
### Run the example

1. After the build is completed, press **F5** or click **Start** on the ribbon menu to run the example.
2. Locate the Anomaly Detection user interface window with the text edit box reading "{your_subscription_key}".
3. Replace the request.json file, which contains the sample data, with your own data, then click "Send" button. Microsoft receives the data you upload and use them to detect any anomaly points among then. The data you load will not be persisted in Microsoft's server. To detect the anomaly point again, you need upload the data once again.
4. If the data is good, you will find the anomaly detection result in "Response" field. If any error occurs, the error information will be shown in the Response field as well.

<a name="Review"></a>
### Read the result

[!INCLUDE [diagrams](../includes/diagrams.md)]

<a name="Review"></a>
### Review and learn

Now that you have a running application, let's review how the example app integrates with Cognitive Services technology. This step will make it easier to either continue building onto this app or develop your own app using Microsoft Anomaly Detection.

This example app makes use of the Anomaly Detection Restful API endpoint.

Reviewing how the Restful API gets used in the example application, let's look at a code snippet from **AnomalyDetectionClient.cs**. The file contains code comments indicating “KEY SAMPLE CODE STARTS HERE” and “KEY SAMPLE CODE ENDS HERE” to help you locate the code snippets reproduced below.

```csharp
			// ----------------------------------------------------------------------
	        // KEY SAMPLE CODE STARTS HERE
	        // Set http request header
	        // ---------------------------------------------------------------------- 
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
			// ----------------------------------------------------------------------
            // KEY SAMPLE CODE ENDS HERE 
            // ----------------------------------------------------------------------

```
### **Request**
The code snippet below shows how to use the HttpClient to submit your subscription key and data points to the endpoint of the Anomaly Detection API.

```csharp
	public async Task<string> Request(string baseAddress, string endpoint, string subscriptionKey, string requestData)
    {
        using (HttpClient client = new HttpClient { BaseAddress = new Uri(baseAddress) })
        {
	    	// ----------------------------------------------------------------------
	        // KEY SAMPLE CODE STARTS HERE
	        // Set http request header
	        // ---------------------------------------------------------------------- 
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
			// ----------------------------------------------------------------------
            // KEY SAMPLE CODE ENDS HERE 
            // ----------------------------------------------------------------------

			// ----------------------------------------------------------------------
	        // KEY SAMPLE CODE STARTS HERE
	        // Build the request content
	        // ---------------------------------------------------------------------- 
            var content = new StringContent(requestData, Encoding.UTF8, "application/json");
			// ----------------------------------------------------------------------
            // KEY SAMPLE CODE ENDS HERE 
            // ----------------------------------------------------------------------

			// ----------------------------------------------------------------------
	        // KEY SAMPLE CODE STARTS HERE
	        // Send the request content with POST method.
	        // ---------------------------------------------------------------------- 
            var res = await client.PostAsync(endpoint, content);
            // ----------------------------------------------------------------------
            // KEY SAMPLE CODE ENDS HERE 
            // ----------------------------------------------------------------------
            if (res.IsSuccessStatusCode)
            {
                return await res.Content.ReadAsStringAsync();
            }
            else
            {
                return $"ErrorCode: {res.StatusCode}";
            }
        }
    }
```

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://dev.labs.cognitive.microsoft.com/docs/services/anomaly-detection/operations/post-anomalydetection)
