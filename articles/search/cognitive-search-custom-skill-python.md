---
title: 'Custom skill example using Forms Layout (Python)'
titleSuffix: Azure Cognitive Search
description: Demonstrates using the Forms Recognizer in a custom skill mapped to an AI-enriched indexing pipeline in Azure Cognitive Search.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/14/2020
---

# Example: Create a custom skill using Python

In this Azure Cognitive Search skillset example, you will learn how to create a web API custom skill using Python and Visual Studio Code.

The skill is a simple that concatenates two strings, but you can modify it to meet your custom needs.

The example uses an [Azure Function](https://azure.microsoft.com/services/functions/) that implements the [custom skill interface](cognitive-search-custom-skill-interface.md).

## Prerequisites

+ Review [custom skill interface](cognitive-search-custom-skill-interface.md) for an introduction into the input/output interface that a custom skill should implement.

+ [!INCLUDE [cognitive-services-bing-entity-search-signup-requirements](../../includes/cognitive-services-bing-entity-search-signup-requirements.md)]

+ Set up your environment. We followed [this tutorial end-to-end](https://docs.microsoft.com/en-us/azure/python/tutorial-vs-code-serverless-python-01) to set up serverless Azure Function in Python in Visual Studio Code. This tutorial leads you through installation of the following tools and components: 

  + [Python 3.75](https://www.python.org/downloads/release/python-375/)
  + [Visual Studio Code](https://code.visualstudio.com/)
  + [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
  + [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#v2)
  + [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  

## Create an Azure Function

This example uses an Azure Function to demonstrate the concept of hosting a web API, but other approaches are possible. As long as you meet the [interface requirements for a cognitive skill](cognitive-search-custom-skill-interface.md), the approach you take is immaterial. Azure Functions, however, make it easy to create a custom skill.

### Create a function app

The Azure Functions project template in Visual Studio Code creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Create new project...`.

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. For this reason, do not select a project folder that is part of a workspace.

1. Select a language for your function app project. For this tutorial, select **Python**.
1. Select the Python version, (version 3.7.5 is supported by Azure Functions)
1. Select a template for your project's first function. Select **HTTP trigger** to create an HTTP triggered function in the new function app.
1. Provide a function name. In this case, let's use **LayoutExtractor** 
1. Select **Function** as the Authorization level. This means that we will provide a [function key](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys) to call the function's HTTP endpoint. 
1. Select how you would like to open your project. For this step, select **Add to workspace** to create the function app in the current workspace.

Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../articles/azure-functions/functions-host-json.md) and [local.settings.json](../articles/azure-functions/functions-run-local.md#local-settings-file) configuration files, plus any language-specific project files. 

A new HTTP triggered function is also created in the **LayoutExtractor** folder of the function app project. Inside it there will be a file called "\__init__.py", with this content:

```py
import logging

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )

```

Now let's modify that code to follow the [custom skill interface](cognitive-search-custom-skill-interface.md)). Modify the code with the following content:

```py
import logging
import azure.functions as func
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = json.dumps(req.get_json())
    except ValueError:
        return func.HttpResponse(
             "Invalid body",
             status_code=400
        )
    
    if body:
        result = compose_response(body)
        return func.HttpResponse(result, mimetype="application/json")
    else:
        return func.HttpResponse(
             "Invalid body",
             status_code=400
        )


def compose_response(json_data):
    values = json.loads(json_data)['values']
    
    # Prepare the Output before the loop
    results = {}
    results["values"] = []
    
    for value in values:
        output_record = transform_value(value)
        if output_record != None:
            results["values"].append(output_record)
    return json.dumps(results, ensure_ascii=False)

## Perform an operation on a record
def transform_value(value):
    try:
        recordId = value['recordId']
    except AssertionError  as error:
        return None

    # Validate the inputs
    try:         
        assert ('data' in value), "'data' field is required."
        data = value['data']        
        assert ('text1' in data), "'text1' field is required in 'data' object."
        assert ('text2' in data), "'text2' field is required in 'data' object."
    except AssertionError  as error:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "Error:" + error.args[0] }   ]       
            })

    try:                
        concatenated_string = value['data']['text1'] + " " + value['data']['text2']  
        # Here you could do something more interesting with the inputs

    except:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "Could not complete operation for record." }   ]       
            })

    return ({
            "recordId": recordId,
            "data": {
                "text": concatenated_string
                    }
            })
```

The **transform_value** method performs an operation on a single record. You may modify the method to meet your specific needs. Remember to do any necessary input validation and to return any errors and warnings produced if the operation could not be completed for the record.

### Debug your code locally

Visual Studio Code makes it easy to debug the code. Press 'F5' or go to the **Debug** menu and select **Start Debugging**.

You can set any breakpoints on the code by hitting 'F9' on the line of interest.

Once you started debugging, your function will run locally. You can use a tool like Postman or Fiddler to issue the request to localhost. Be sure to take note of the location of your local endpoint on the Terminal window so that you can formulate the request accordingly. 

## Publish your function

Once you are happy with your function, you can publish by clicking on the Azure Tab (Ctrl+Shift+A also opens it), then select **Functions**.

1. In Visual Studio, select **New** > **Project** from the File menu.

1. In the New Project dialog, select **Installed**, expand **Visual C#** > **Cloud**, select **Azure Functions**, type a Name for your project, and select **OK**. The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other non-alphanumeric characters.

1. Select **Azure Functions v2 (.NET Core)**. You could also do it with version 1, but the code written below is based on the v2 template.

1. Select the type to be **HTTP Trigger**

1. For Storage Account, you may select **None**, as you won't need any storage for this function.

1. Select **OK** to create the function project and HTTP triggered function.

### Modify the code to call the Bing Entity Search Service

Visual Studio creates a project and in it, a class that contains boilerplate code for the chosen function type. The *FunctionName* attribute on the method sets the name of the function. The *HttpTrigger* attribute specifies that the function is triggered by an HTTP request.

Now, replace all of the content of the file *Function1.cs* with the following code:

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SampleSkills
{
    /// <summary>
    /// Sample custom skill that wraps the Bing entity search API to connect it with a 
    /// AI enrichment pipeline.
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
                public string Name { get; set; }
            }

            public string RecordId { get; set; }
            public InputRecordData Data { get; set; }
        }

        private class WebApiRequest
        {
            public List<InputRecord> Values { get; set; }
        }
        #endregion

        #region Classes used to serialize the response

        private class OutputRecord
        {
            public class OutputRecordData
            {
                public string Name { get; set; } = "";
                public string Description { get; set; } = "";
                public string Source { get; set; } = "";
                public string SourceUrl { get; set; } = "";
                public string LicenseAttribution { get; set; } = "";
                public string LicenseUrl { get; set; } = "";
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
            public List<OutputRecord> Values { get; set; }
        }
        #endregion

        #region Classes used to interact with the Bing API
        private class BingResponse
        {
            public BingEntities Entities { get; set; }
        }
        private class BingEntities
        {
            public BingEntity[] Value { get; set; }
        }

        private class BingEntity
        {
            public class EntityPresentationinfo
            {
                public string[] EntityTypeHints { get; set; }
            }

            public class License
            {
                public string Url { get; set; }
            }

            public class ContractualRule
            {
                public string _type { get; set; }
                public License License { get; set; }
                public string LicenseNotice { get; set; }
                public string Text { get; set; }
                public string Url { get; set; }
            }

            public ContractualRule[] ContractualRules { get; set; }
            public string Description { get; set; }
            public string Name { get; set; }
            public EntityPresentationinfo EntityPresentationInfo { get; set; }
        }
        #endregion

        #region The Azure Function definition

        [FunctionName("EntitySearch")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Entity Search function: C# HTTP trigger function processed a request.");

            var response = new WebApiResponse
            {
                Values = new List<OutputRecord>()
            };

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<WebApiRequest>(requestBody);

            // Do some schema validation
            if (data == null)
            {
                return new BadRequestObjectResult("The request schema does not match expected schema.");
            }
            if (data.Values == null)
            {
                return new BadRequestObjectResult("The request schema does not match expected schema. Could not find values array.");
            }

            // Calculate the response for each value.
            foreach (var record in data.Values)
            {
                if (record == null || record.RecordId == null) continue;

                OutputRecord responseRecord = new OutputRecord
                {
                    RecordId = record.RecordId
                };

                try
                {
                    responseRecord.Data = GetEntityMetadata(record.Data.Name).Result;
                }
                catch (Exception e)
                {
                    // Something bad happened, log the issue.
                    var error = new OutputRecord.OutputRecordMessage
                    {
                        Message = e.Message
                    };

                    responseRecord.Errors = new List<OutputRecord.OutputRecordMessage>
                    {
                        error
                    };
                }
                finally
                {
                    response.Values.Add(responseRecord);
                }
            }

            return (ActionResult)new OkObjectResult(response);
        }

        #endregion

        #region Methods to call the Bing API
        /// <summary>
        /// Gets metadata for a particular entity based on its name using Bing Entity Search
        /// </summary>
        /// <param name="entityName">The name of the entity to extract data for.</param>
        /// <returns>Asynchronous task that returns entity data. </returns>
        private async static Task<OutputRecord.OutputRecordData> GetEntityMetadata(string entityName)
        {
            var uri = bingApiEndpoint + "?q=" + entityName + "&mkt=en-us&count=10&offset=0&safesearch=Moderate";
            var result = new OutputRecord.OutputRecordData();

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(uri)
            })
            {
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                HttpResponseMessage response = await client.SendAsync(request);
                string responseBody = await response?.Content?.ReadAsStringAsync();

                BingResponse bingResult = JsonConvert.DeserializeObject<BingResponse>(responseBody);
                if (bingResult != null)
                {
                    // In addition to the list of entities that could match the name, for simplicity let's return information
                    // for the top match as additional metadata at the root object.
                    return AddTopEntityMetadata(bingResult.Entities?.Value);
                }
            }

            return result;
        }

        private static OutputRecord.OutputRecordData AddTopEntityMetadata(BingEntity[] entities)
        {
            if (entities != null)
            {
                foreach (BingEntity entity in entities.Where(
                    entity => entity?.EntityPresentationInfo?.EntityTypeHints != null
                        && (entity.EntityPresentationInfo.EntityTypeHints[0] == "Person"
                            || entity.EntityPresentationInfo.EntityTypeHints[0] == "Organization"
                            || entity.EntityPresentationInfo.EntityTypeHints[0] == "Location")
                        && !String.IsNullOrEmpty(entity.Description)))
                {
                    var rootObject = new OutputRecord.OutputRecordData
                    {
                        Description = entity.Description,
                        Name = entity.Name
                    };

                    if (entity.ContractualRules != null)
                    {
                        foreach (var rule in entity.ContractualRules)
                        {
                            switch (rule._type)
                            {
                                case "ContractualRules/LicenseAttribution":
                                    rootObject.LicenseAttribution = rule.LicenseNotice;
                                    rootObject.LicenseUrl = rule.License.Url;
                                    break;
                                case "ContractualRules/LinkAttribution":
                                    rootObject.Source = rule.Text;
                                    rootObject.SourceUrl = rule.Url;
                                    break;
                            }
                        }
                    }

                    return rootObject;
                }
            }

            return new OutputRecord.OutputRecordData();
        }
        #endregion
    }
}
```

Make sure to enter your own *key* value in the `key` constant based on the key you got when signing up for the Bing entity search API.

This sample includes all necessary code in a single file for convenience. You can find a slightly more structured version of that same skill in the [power skills repository](https://github.com/Azure-Samples/azure-search-power-skills/tree/master/Text/BingEntitySearch).

Consider renaming the file from `Function1.cs` to `BingEntitySearch.cs`.

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
                "description": "Pablo Ruiz Picasso was a Spanish painter [...]",
                "source": "Wikipedia",
                "sourceUrl": "http://en.wikipedia.org/wiki/Pablo_Picasso",
                "licenseAttribution": "Text under CC-BY-SA license",
                "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
            },
            "errors": null,
            "warnings": null
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

1. In the [Azure portal](https://portal.azure.com), navigate to the Resource Group, and look for the `EntitySearch` Function you published. Under the **Manage** section, you should see Host Keys. Select the **Copy** icon for the *default* host key.  

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

Now that you have a new custom skill, you can add it to your skillset. The example below shows you how to call the skill to add descriptions to organizations in the document (this could be extended to also work on locations and people). Replace `[your-entity-search-app-name]` with the name of your app.

```json
{
    "skills": [
      "[... your existing skills remain here]",  
      {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "Our new Bing entity search custom skill",
        "uri": "https://[your-entity-search-app-name].azurewebsites.net/api/EntitySearch?code=[enter default host key here]",
          "context": "/document/merged_content/organizations/*",
          "inputs": [
            {
              "name": "name",
              "source": "/document/merged_content/organizations/*"
            }
          ],
          "outputs": [
            {
              "name": "description",
              "targetName": "description"
            }
          ]
      }
  ]
}
```

Here, we're counting on the built-in [entity recognition skill](cognitive-search-skill-entity-recognition.md) to be present in the skillset and to have enriched the document with the list of organizations. For reference, here's an entity extraction skill configuration that would be sufficient in generating the data we need:

```json
{
    "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
    "name": "#1",
    "description": "Organization name extraction",
    "context": "/document/merged_content",
    "categories": [ "Organization" ],
    "defaultLanguageCode": "en",
    "inputs": [
        {
            "name": "text",
            "source": "/document/merged_content"
        },
        {
            "name": "languageCode",
            "source": "/document/language"
        }
    ],
    "outputs": [
        {
            "name": "organizations",
            "targetName": "organizations"
        }
    ]
},
```

## Next steps
Congratulations! You've created your first custom skill. Now you can follow the same pattern to add your own custom functionality. Click the following links to learn more.

+ [Power Skills: a repository of custom skills](https://github.com/Azure-Samples/azure-search-power-skills)
+ [Add a custom skill to an AI enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
