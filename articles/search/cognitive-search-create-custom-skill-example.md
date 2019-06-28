---
title: 'Example: Creating an Azure Cognitive Search custom skill with the Bing Entity Search API - Azure Search'
description: Demonstrates using the Bing Entity Search service in a custom skill mapped to a cognitive search indexing pipeline in Azure Search.
manager: pablocas
author: luiscabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: luisca
ms.custom: seodec2018
---

# Example: Create a custom skill using the Bing Entity Search API

In this example, learn how to create a web API custom skill. This skill will accept location, public figures, and organizations, and return descriptions for them. The example uses an [Azure Function](https://azure.microsoft.com/services/functions/) to wrap the [Bing Entity Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-entity-search-api/) so that it implements the custom skill interface.

## Prerequisites

+ Read about [custom skill interface](cognitive-search-custom-skill-interface.md) article if you aren't familiar with the input/output interface that a custom skill should implement.

+ [!INCLUDE [cognitive-services-bing-entity-search-signup-requirements](../../includes/cognitive-services-bing-entity-search-signup-requirements.md)]

+ Install [Visual Studio 2019](https://www.visualstudio.com/vs/) or later, including the Azure development workload.

## Create an Azure Function

Although this example uses an Azure Function to host a web API, it isn't required.  As long as you meet the [interface requirements for a cognitive skill](cognitive-search-custom-skill-interface.md), the approach you take is immaterial. Azure Functions, however, make it easy to create a custom skill.

### Create a function app

1. In Visual Studio, select **New** > **Project** from the File menu.

1. In the New Project dialog, select **Installed**, expand **Visual C#** > **Cloud**, select **Azure Functions**, type a Name for your project, and select **OK**. The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other non-alphanumeric characters.

1. Select **Azure Functions v2 (.NET Core)**. You could also do it with version 1, but the code written below is based on the v2 template.

1. Select the type to be **HTTP Trigger**

1. For Storage Account, you may select **None**, as you won't need any storage for this function.

1. Select **OK** to create the function project and HTTP triggered function.

### Modify the code to call the Bing Entity Search Service

Visual Studio creates a project and in it a class that contains boilerplate code for the chosen function type. The *FunctionName* attribute on the method sets the name of the function. The *HttpTrigger* attribute specifies that the function is triggered by an HTTP request.

Now, replace all of the content of the file *Function1.cs* with the following code:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;

namespace SampleSkills
{
    /// <summary>
    /// Sample custom skill that wraps the Bing entity search API to connect it with a 
    /// cognitive search pipeline.
    /// </summary>
    public static class BingEntitySearch
    {
        #region Credentials
        // IMPORTANT: Make sure to enter your credential and to verify the API endpoint matches yours.
        static readonly string bingApiEndpoint = "https://api.cognitive.microsoft.com/bing/v7.0/entities/";
        static readonly string key = "<enter your api key here>";  
        #endregion

        #region Class used to deserialize the request
        private class InputRecord
        {
            public class InputRecordData
            {
                public string name;
            }

            public string recordId { get; set; }
            public InputRecordData data { get; set; }
        }

        private class WebApiRequest
        {
            public List<InputRecord> values { get; set; }
        }
        #endregion

        #region Classes used to serialize the response

        private class OutputRecord
        {
            public class OutputRecordData
            {
                public string Name;
                public string Description;
                public string ImageUrl;
                public string Url;
                public string LicenseAttribution;
                public Entities Entities { get; set; }
            }

            public class OutputRecordMessage
            {
                public string Message { get; set; }
            }

            public string RecordId { get; set; }
            public OutputRecordData Data { get; set; }
            public List<OutputRecordMessage> Errors { get; set; }
            public List<OutputRecordMessage> Warnings { get; set; }
        }

        private class WebApiResponse
        {
            public List<OutputRecord> values { get; set; }
        }
        #endregion

        #region Classes used to interact with the Bing API
        private class Entities
        {
            public BingEntity[] value { get; set; }
        }

        private class BingEntity
        {
            public class Entitypresentationinfo
            {
                public string EntityScenario { get; set; }
                public string[] EntityTypeHints { get; set; }
                public object EntityTypeDisplayHint { get; set; }
            }

            public class License
            {
                public string Name { get; set; }
                public string Url { get; set; }
            }

            public class Contractualrule
            {
                public string _type { get; set; }
                public string TargetPropertyName { get; set; }
                public bool MustBeCloseToContent { get; set; }
                public License License { get; set; }
                public string LicenseNotice { get; set; }
                public string Text { get; set; }
                public string Url { get; set; }
            }

            public class Provider
            {
                public string _type { get; set; }
                public string Url { get; set; }
            }


            public class ImageClass
            {
                public string Name { get; set; }
                public string ThumbnailUrl { get; set; }
                public Provider[] Provider { get; set; }
                public string HostPageUrl { get; set; }
                public int Width { get; set; }
                public int Height { get; set; }
            }

            public Contractualrule[] contractualRules { get; set; }
            public ImageClass Image { get; set; }
            public string Description { get; set; }
            public string BingId { get; set; }
            public string WebSearchUrl { get; set; }
            public string Name { get; set; }
            public string Url { get; set; }
            public Entitypresentationinfo EntityPresentationInfo { get; set; }
        }
        #endregion

        #region The Azure Function definition

        [FunctionName("EntitySearch")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Entity Search function: C# HTTP trigger function processed a request.");

            var response = new WebApiResponse();
            response.values = new List<OutputRecord>();

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<WebApiRequest>(requestBody);

            // Do some schema validation
            if (data == null)
            {
                return new BadRequestObjectResult("The request schema does not match expected schema.");
            }
            if (data.values == null)
            {
                return new BadRequestObjectResult("The request schema does not match expected schema. Could not find values array.");
            }

            // Calculate the response for each value.
            foreach (var record in data.values)
            {
                if (record == null || record.recordId == null) continue;

                OutputRecord responseRecord = new OutputRecord();
                responseRecord.RecordId = record.recordId;

                try
                {
                    string nameName = record.data.name;
                    responseRecord.Data = GetEntityMetadata(nameName).Result;
                }
                catch (Exception e)
                {
                    // Something bad happened, log the issue.
                    var error = new OutputRecord.OutputRecordMessage
                    {
                        Message = e.Message
                    };

                    responseRecord.Errors = new List<OutputRecord.OutputRecordMessage>();
                    responseRecord.Errors.Add(error);
                }
                finally
                {
                    response.values.Add(responseRecord);
                }
            }

            return (ActionResult)new OkObjectResult(response);
        }

        #endregion

        #region Methods to call the Bing API
        public class RetryHandler : DelegatingHandler
        {
            // Strongly consider limiting the number of retries - "retry forever" is
            // probably not the most user friendly way you could respond to "the
            // network cable got pulled out."
            private const int MaxRetries = 10;

            public RetryHandler(HttpMessageHandler innerHandler)
                : base(innerHandler)
            { }

            protected override async Task<HttpResponseMessage> SendAsync(
                HttpRequestMessage request,
                CancellationToken cancellationToken)
            {
                HttpResponseMessage response = null;
                for (int i = 0; i < MaxRetries; i++)
                {
                    response = await base.SendAsync(request, cancellationToken);
                    if (response.IsSuccessStatusCode)
                    {
                        return response;
                    }

                    //Log.Info("Retrying " + request.RequestUri.ToString());
                    Thread.Sleep(1000);
                }

                return response;
            }
        }

        /// <summary>
        /// Helper function that replaces nulls for empty strings.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static String EmptyOrValue(String value)
        {
            if (value == null) return "";
            return value;
        }

        /// <summary>
        /// Gets metadata for a particular entity based on its name using Bing Entity Search
        /// </summary>
        /// <param name="nameName">The image to extract objects for.</param>
        /// <returns>Asynchronous task that returns objects identified in the image. </returns>
        async static Task<OutputRecord.OutputRecordData> GetEntityMetadata(string nameName)
        {
            var uri = bingApiEndpoint + "?q=" + nameName + "&mkt=en-us&count=10&offset=0&safesearch=Moderate";
            var result = new OutputRecord.OutputRecordData();

            using (var client = new HttpClient(new RetryHandler(new HttpClientHandler())))
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Get;
                request.RequestUri = new Uri(uri);
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();

                result = JsonConvert.DeserializeObject<OutputRecord.OutputRecordData>(responseBody);

                // In addition to the list of entities that could match the name, for simplicity let's return information
                // for the top match as additional metadata at the root object.
                result = AddTopEntityMetadata(result);

                // Do some cleanup on the returned result.
                result.ImageUrl = EmptyOrValue(result.ImageUrl);
                result.Description = EmptyOrValue(result.Description);
                if (result.Name == null) { result.Name = EmptyOrValue(nameName); }
                result.Url = EmptyOrValue(result.Url);
                result.LicenseAttribution = EmptyOrValue(result.LicenseAttribution);
            }

            return result;
        }

        public class CoreData
        {
            public string description;
            public string name;
            public string imageUrl;
            public string url;
            public string licenseAttribution;
        }

        static OutputRecord.OutputRecordData AddTopEntityMetadata(OutputRecord.OutputRecordData rootObject)
        {

            CoreData coreData = new CoreData();

            if (rootObject.Entities != null)
            {
                foreach (BingEntity entity in rootObject.Entities.value)
                {
                    if (entity.EntityPresentationInfo != null)
                    {
                        if (entity.EntityPresentationInfo.EntityTypeHints != null)
                        {
                            if (entity.EntityPresentationInfo.EntityTypeHints[0] != "Person" &&
                                entity.EntityPresentationInfo.EntityTypeHints[0] != "Organization" &&
                                entity.EntityPresentationInfo.EntityTypeHints[0] != "Location"
                                )
                            {
                                continue;
                            }
                        }
                    }

                    if (entity.Description != null && entity.Description != "")
                    {
                        rootObject.Description = entity.Description;
                        rootObject.Name = entity.Name;
                        if (entity.Image != null)
                        {
                            rootObject.ImageUrl = entity.Image.ThumbnailUrl;
                        }

                        if (entity.contractualRules != null)
                        {
                            foreach (var rule in entity.contractualRules)
                            {
                                if (rule.TargetPropertyName == "description")
                                {
                                    rootObject.Url = rule.Url;
                                }

                                if (rule._type == "ContractualRules/LicenseAttribution")
                                {
                                    rootObject.LicenseAttribution = rule.LicenseNotice;
                                }
                            }
                        }

                        return rootObject;
                    }
                }
            }

            return rootObject;
        }
        #endregion
    }
}
```

Make sure to enter your own *key* value in the *TranslateText* method based on the key you got when signing up for the Translate Text API.

This sample includes all necessary code in a single file for convenience. You can find a slightly more structured version of that same skill in [the power skills repository](https://github.com/Azure-Samples/azure-search-power-skills/tree/master/Text/BingEntitySearch).

Of course, you may rename the file from `Function1.cs` to `BingEntitySearch.cs`.

## Test the function from Visual Studio

Press **F5** to run the program and test function behaviors. In this case, we'll use the function below to look up two entities. Use Postman or Fiddler to issue a call like the one shown below:

```http
POST https://localhost:7071/api/EntitySearch
```

### Request body
```json
{
    "values": [
        {
            "recordId": "e1",
            "data":
            {
                "name":  "Pablo Picasso"
            }
        },
        {
            "recordId": "e2",
            "data":
            {
                "name":  "Microsoft"
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
            "recordId": "e1",
            "data": {
                "name": "Pablo Picasso",
                "description": "Pablo Ruiz Picasso was a Spanish painter, sculptor, [...]",
                "imageUrl": "https://www.bing.com/th?id=AMMS_e8c719d1c081e929c60a2f112d659d96&w=110&h=110&c=12&rs=1&qlt=80&cdv=1&pid=16.2",
                "url": "http://en.wikipedia.org/wiki/Pablo_Picasso",
                "licenseAttribution": "Text under CC-BY-SA license",
                "entities": "{...}"
            }
        },
        "..."
    ]
}
```

## Publish the function to Azure

When you're satisfied with the function behavior, you can publish it.

1. In **Solution Explorer**, right-click the project and select **Publish**. Choose **Create New** > **Publish**.

1. If you haven't already connected Visual Studio to your Azure account, select **Add an account....**

1. Follow the on-screen prompts. You're asked to specify a unique name for your app service, the Azure subscription, the resource group, the hosting plan, and the storage account you want to use. You can create a new resource group, a new hosting plan, and a storage account if you don't already have these. When finished, select **Create**

1. After the deployment is complete, notice the Site URL. It is the address of your function app in Azure. 

1. In the [Azure portal](https://portal.azure.com), navigate to the Resource Group, and look for the Translate Function you published. Under the **Manage** section, you should see Host Keys. Select the **Copy** icon for the *default* host key.  

## Test the function in Azure

Now that you have the default host key, test your function as follows:

```http
POST https://[your-entity-search-app-name].azurewebsites.net/api/EntitySearch?code=[enter default host key here]
```

### Request Body
```json
{
    "values": [
        {
            "recordId": "e1",
            "data":
            {
                "name":  "Pablo Picasso"
            }
        },
        {
            "recordId": "e2",
            "data":
            {
                "name":  "Microsoft"
            }
        }
    ]
}
```

This example should produce the same result you saw previously when running the function in the local environment.

## Connect to your pipeline
Now that you have a new custom skill, you can add it to your skillset. The example below shows you how to call the skill to add descriptions to organizations in the document. Replace `[your-entity-search-app-name]` with the name of your app.

```json
{
    "skills": [
      "[... your existing skills remain here]",  
      {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "Our new Bing entity search custom skill",
        "uri": "https://[your-entity-search-app-name].azurewebsites.net/api/Translate?code=[enter default host key here]",
          "context": "/document/organizations",
          "inputs": [
            {
              "name": "name",
              "source": "/document/organizations/*",
              "sourceContext": null,
              "inputs": []
            }
          ],
          "outputs": [
            {
              "name": "description",
              "targetName": "organizationDescription"
            }
          ]
      }
  ]
}
```

Here, we're counting on the built-in [entity recognition skill](cognitive-search-skill-entity-recognition.md) to have enriched the document with the list of organizations.

## Next steps
Congratulations! You've created your first custom enricher. Now you can follow the same pattern to add your own custom functionality. 

+ [Add a custom skill to a cognitive search pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
