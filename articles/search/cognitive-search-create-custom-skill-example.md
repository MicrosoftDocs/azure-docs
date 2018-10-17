---
title: 'Example: Create a custom skill in cognitive search pipeline (Azure Search) | Microsoft Docs'
description: Demonstrates using the Text Translate API in custom skill mapped to a cognitive search indexing pipeline in Azure Search.
manager: pablocas
author: luiscabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 06/29/2018
ms.author: luisca
---

# Example: Create a custom skill using the Text Translate API

In this example, learn how to create a web API custom skill that accepts text in any language and translates it to English. The example uses an [Azure Function](https://azure.microsoft.com/services/functions/) to wrap the [Translate Text API](https://azure.microsoft.com/services/cognitive-services/translator-text-api/) so that it implements the custom skill interface.

## Prerequisites

+ Read about [custom skill interface](cognitive-search-custom-skill-interface.md) article if you are not familiar with the input/output interface that a custom skill should implement.

+ [Sign up for the Translator Text API](../cognitive-services/translator/translator-text-how-to-signup.md), and get an API key to consume it.

+ Install [Visual Studio 2017 version 15.5](https://www.visualstudio.com/vs/) or later, including the Azure development workload.

## Create an Azure Function

Although this example uses an Azure Function to host a web API, it is not required.  As long as you meet the [interface requirements for a cognitive skill](cognitive-search-custom-skill-interface.md), the approach you take is immaterial. Azure Functions, however, make it easy to create a custom skill.

### Create a function app

1. In Visual Studio, select **New** > **Project** from the File menu.

1. In the New Project dialog, select **Installed**, expand **Visual C#** > **Cloud**, select **Azure Functions**, type a Name for your project, and select **OK**. The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other nonalphanumeric characters.

1. Select **Azure Functions v2 (.Net Core)**. You could also do it with version 1, but the code written below is based on the v2 template.

1. Select the type to be **HTTP Trigger**

1. For Storage Account, you may select **None**, as you won't need any storage for this function.

1. Select **OK** to create the function project and HTTP triggered function.

### Modify the code to call the Translate Cognitive Service

Visual Studio creates a project and in it a class that contains boilerplate code for the chosen function type. The *FunctionName* attribute on the method sets the name of the function. The *HttpTrigger* attribute specifies that the function is triggered by an HTTP request.

Now, replace all of the content of the file *Function1.cs* with the following code:

```csharp
using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;

namespace TranslateFunction
{
    // This function will simply translate messages sent to it.
    public static class Function1
    {
        static string path = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "<enter your api key here>";

        #region classes used to serialize the response
        private class WebApiResponseError
        {
            public string message { get; set; }
        }

        private class WebApiResponseWarning
        {
            public string message { get; set; }
        }

        private class WebApiResponseRecord
        {
            public string recordId { get; set; }
            public Dictionary<string, object> data { get; set; }
            public List<WebApiResponseError> errors { get; set; }
            public List<WebApiResponseWarning> warnings { get; set; }
        }

        private class WebApiEnricherResponse
        {
            public List<WebApiResponseRecord> values { get; set; }
        }
        #endregion

        [FunctionName("Translate")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]HttpRequest req,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            string recordId = null;
            string originalText = null;
            string toLanguage = null;
            string translatedText = null;

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            // Validation
            if (data?.values == null)
            {
                return new BadRequestObjectResult(" Could not find values array");
            }
            if (data?.values.HasValues == false || data?.values.First.HasValues == false)
            {
                // It could not find a record, then return empty values array.
                return new BadRequestObjectResult(" Could not find valid records in values array");
            }

            recordId = data?.values?.First?.recordId?.Value as string;
            originalText = data?.values?.First?.data?.text?.Value as string;
            toLanguage = data?.values?.First?.data?.language?.Value as string;

            if (recordId == null)
            {
                return new BadRequestObjectResult("recordId cannot be null");
            }

            translatedText = TranslateText(originalText, toLanguage).Result;
	    
            // Put together response.
            WebApiResponseRecord responseRecord = new WebApiResponseRecord();
            responseRecord.data = new Dictionary<string, object>();
            responseRecord.recordId = recordId;
            responseRecord.data.Add("text", translatedText);

            WebApiEnricherResponse response = new WebApiEnricherResponse();
            response.values = new List<WebApiResponseRecord>();
            response.values.Add(responseRecord);

            return (ActionResult)new OkObjectResult(response);
        }


        /// <summary>
        /// Use Cognitive Service to translate text from one language to antoher.
        /// </summary>
        /// <param name="originalText">The text to translate.</param>
        /// <param name="toLanguage">The language you want to translate to.</param>
        /// <returns>Asynchronous task that returns the translated text. </returns>
        async static Task<string> TranslateText(string originalText, string toLanguage)
        {
            System.Object[] body = new System.Object[] { new { Text = originalText } };
            var requestBody = JsonConvert.SerializeObject(body);

            var uri = $"{path}&to={toLanguage}";

            string result = "";

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();

                dynamic data = JsonConvert.DeserializeObject(responseBody);
                result = data?.First?.translations?.First?.text?.Value as string;

            }
            return result;
        }
    }
}
```

Make sure to enter your own *key* value in the *TranslateText* method based on the key you got when signing up for the Translate Text API.

This example is a simple enricher that only works on one record at a time. This fact becomes important later, when setting the batch size for the skillset.

## Test the function from Visual Studio

Press **F5** to run the program and test function behaviors. In this case we'll use the function below to translate a text in Spanish to English. Use Postman or Fiddler to issue a call like the one shown below:

```http
POST https://localhost:7071/api/Translate
```
### Request body
```json
{
   "values": [
        {
        	"recordId": "a1",
        	"data":
	        {
	           "text":  "Este es un contrato en Inglés",
	           "language": "en"
	        }
        }
   ]
}
```
### Response
You should see a response similar to the following example:

```json
{
    "values": [
        {
            "recordId": "a1",
            "data": {
                "text": "This is a contract in English"
            },
            "errors": null,
            "warnings": null
        }
    ]
}
```

## Publish the function to Azure

When you are satisfied with the function behavior, you can publish it.

1. In **Solution Explorer**, right-click the project and select **Publish**. Choose **Create New** > **Publish**.

1. If you haven't already connected Visual Studio to your Azure account, select **Add an account....**

1. Follow the on-screen prompts. You are asked to specify the Azure account, the resource group, the hosting plan, and the storage account you want to use. You can create a new resource group, a new hosting plan, and a storage account if you don't already have these. When finished, select **Create**

1. After the deployment is complete, note the Site URL. It is the address of your function app in Azure. 

1. In the [Azure portal](https://portal.azure.com), navigate to the Resource Group, and look for the Translate Function you published. Under the **Manage** section, you should see Host Keys. Select the **Copy** icon for the *default* host key.  

## Update SSL Settings

All Azure Functions created after June 30th, 2018 have disabled TLS 1.0, which is not currently compatible with custom skills.

1. In the [Azure portal](https://portal.azure.com), navigate to the Resource Group, and look for the Translate Function you published. Under the **Platform features** section, you should see SSL.

1. After selecting SSL, you should change the **Minimum TLS version** to 1.0. TLS 1.2 functions are not yet supported as custom skills.

## Test the function in Azure

Now that you have the default host key, test your function as follows:

```http
POST https://translatecogsrch.azurewebsites.net/api/Translate?code=[enter default host key here]
```
### Request Body
```json
{
   "values": [
        {
        	"recordId": "a1",
        	"data":
	        {
	           "text":  "Este es un contrato en Inglés",
	           "language": "en"
	        }
        }
   ]
}
```

This should produce a similar result to the one you saw previously when running the function in the local environment.

## Connect to your pipeline
Now that you have a new custom skill, you can add it to your skillset. The example below shows you how to call the skill. Because the skill doesn't handle batches, add an instruction for maximum batch size to be just ```1``` to send documents one at a time.

```json
{
    "skills": [
      ...,  
      {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "Our new translator custom skill",
        "uri": "http://translatecogsrch.azurewebsites.net/api/Translate?code=[enter default host key here]",
        "batchSize":1,
        "context": "/document",
        "inputs": [
          {
            "name": "text",
            "source": "/document/content"
          },
          {
            "name": "language",
            "source": "/document/destinationLanguage"
          }
        ],
        "outputs": [
          {
            "name": "text",
            "targetName": "translatedText"
          }
        ]
      }
  ]
}
```

## Next Steps
Congratulations! You have created your first custom enricher. Now you can follow the same pattern to add your own custom functionality. 

+ [Add a custom skill to a cognitive search pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
