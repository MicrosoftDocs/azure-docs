---
title: 'Custom skill example (Python)'
titleSuffix: Azure Cognitive Search
description: For Python developers, learn the tools and techniques for building a custom skill using Azure Functions and Visual Studio Code. Custom skills contain user-defined models or logic that you can add to a skillset for AI-enriched indexing in Azure Cognitive Search.

author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/22/2022
ms.custom: vscode-azure-extension-update-completed
---

# Example: Create a custom skill using Python

In this Azure Cognitive Search skillset example, you'll learn how to create a web API custom skill using Python and Visual Studio Code. The example uses an [Azure Function](https://azure.microsoft.com/services/functions/) that implements the [custom skill interface](cognitive-search-custom-skill-interface.md).

The custom skill is simple by design (it concatenates two strings) so that you can focus on the pattern. Once you succeed with a simple skill, you can branch out with more complex scenarios.

## Prerequisites

+ Review the [custom skill interface](cognitive-search-custom-skill-interface.md) to review the inputs and outputs that a custom skill should implement.

+ Set up your environment. We followed [Quickstart: Create a function in Azure with Python using Visual Studio Code](/azure/python/tutorial-vs-code-serverless-python-01) to set up serverless Azure Function using Visual Studio Code and Python extensions. The quickstart leads you through installation of the following tools and components: 

  + [Python 3.75 or later](https://www.python.org/downloads/release/python-375/)
  + [Visual Studio Code](https://code.visualstudio.com/)
  + [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
  + [Azure Functions Core Tools](../azure-functions/functions-run-local.md#v2)
  + [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

## Create an Azure Function

This example uses an Azure Function to demonstrate the concept of hosting a web API, but other approaches are possible. As long as you meet the [interface requirements for a cognitive skill](cognitive-search-custom-skill-interface.md), the approach you take is immaterial. Azure Functions, however, make it easy to create a custom skill.

### Create a project for the function

The Azure Functions project template in Visual Studio Code creates a local project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Create new project...`.
1. Choose a directory location for your project workspace and choose **Select**. Don't use a project folder that is already part of another workspace.
1. Select a language for your function app project. For this tutorial, select **Python**.
1. Select the Python version (version 3.7.5 is supported by Azure Functions).
1. Select a template for your project's first function. Select **HTTP trigger** to create an HTTP triggered function in the new function app.
1. Provide a function name. In this case, let's use **Concatenator** 
1. Select **Function** as the Authorization level. You'll use a [function access key](../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) to call the function's HTTP endpoint. 
1. Specify how you would like to open your project. For this step, select **Add to workspace** to create the function app in the current workspace.

Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../azure-functions/functions-host-json.md) and [local.settings.json](../azure-functions/functions-develop-local.md#local-settings-file) configuration files, plus any language-specific project files. 

A new HTTP triggered function is also created in the **Concatenator** folder of the function app project. Inside it there will be a file called "\_\_init__.py", with this content:

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

Now let's modify that code to follow the [custom skill interface](cognitive-search-custom-skill-interface.md)). Replace the default code with the following content:

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

The **transform_value** method performs an operation on a single record. You can modify the method to meet your specific needs. Remember to do any necessary input validation and to return any errors and warnings if the operation can't be completed.

### Debug your code locally

Visual Studio Code makes it easy to debug the code. Press 'F5' or go to the **Debug** menu and select **Start Debugging**.

You can set any breakpoints on the code by hitting 'F9' on the line of interest.

Once you started debugging, your function will run locally. You can use a tool like Postman or Fiddler to issue the request to localhost. Note the location of your local endpoint on the Terminal window. 

## Create a function app in Azure

When you're satisfied with the function behavior, you can publish it. So far you've been working locally. In this section, you'll create a function app in Azure and then deploy the local project to the app you created.

### Create the app from Visual Studio Code

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select **Create Function App in Azure**.

1. If you have multiple active subscriptions, select the subscription for this app.

1. Enter a globally unique name for the function app. Type a name that is valid for a URL.

1. Select a runtime stack and choose the language version on which you've been running locally.

1. Select a location for your app. If possible, choose the same region that also hosts your search service.

It takes a few minutes to create the app. When it's ready, you'll see the new app under **Resources** and **Function App** of the active subscription.

### Deploy to Azure

1. Still in Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select **Deploy to Function App...**.

1. Select the function app you created. 

1. Confirm that you want to continue, and then select **Deploy**. You can monitor the deployment status in the output window.

1. Switch to the [Azure portal](https://portal.azure.com), navigate to **All Resources**. Search for the function app you deployed using the globally unique name you provided in a previous step.

   > [!TIP]
   > You can also right-click the function app in Visual Studio Code and select **Open in Portal**.

1. In the portal, on the left, select **Functions**, and then select the function you created.

1. In the function's overview page, select **Get Function URL** in the command bar the top. This will allow you to copy the URL to call the function.

   :::image type="content" source="media/cognitive-search-custom-skill-python/get-function-url.png" alt-text="Screenshot of the Get Function URL command in Azure portal." border="true":::

## Test the function in Azure

Using the default host key and URL that you copied, test your function from within Azure portal.

1. On the left, under Developer, select **Code + Test**.

1. Select **Test/Run** in the command bar.

1. For input, use **Post**, the default key, and then paste in the request body:

    ```json
    {
        "values": [
            {
                "recordId": "e1",
                "data":
                {
                    "text1":  "Hello",
                    "text2":  "World"
                }
            },
            {
                "recordId": "e2",
                "data": "This is an invalid input"
            }
        ]
    }
    ```

1. Select **Run**.

   :::image type="content" source="media/cognitive-search-custom-skill-python/test-run-function.png" alt-text="Screenshot of the input specification." border="true":::

This example should produce the same result you saw previously when running the function in the local environment.

## Add to a skillset

Now that you have a new custom skill, you can add it to your skillset. The example below shows you how to call the skill to concatenate the Title and the Author of the document into a single field, which we call merged_title_author. 

Replace `[your-function-url-here]` with the URL of your new Azure Function.

```json
{
    "skills": [
      "[... other existing skills in the skillset are here]",  
      {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "Our new search custom skill",
        "uri": "https://[your-function-url-here]",        
          "context": "/document/merged_content/organizations/*",
          "inputs": [
            {
              "name": "text1",
              "source": "/document/metadata_title"
            },
            {
              "name": "text2",
              "source": "/document/metadata_author"
            },
          ],
          "outputs": [
            {
              "name": "text",
              "targetName": "merged_title_author"
            }
          ]
      }
  ]
}
```

Remember to add an "outputFieldMapping" in the indexer definition to send "merged_title_author" to a "fullname" field in the search index.

```json
"outputFieldMappings": [
    {
        "sourceFieldName": "/document/content/merged_title_author",
        "targetFieldName": "fullname"
    }
]
```

## Next steps

Congratulations! You've created your first custom skill. Now you can follow the same pattern to add your own custom functionality. Select the following links to learn more.

+ [Power Skills: a repository of custom skills](https://github.com/Azure-Samples/azure-search-power-skills)
+ [Add a custom skill to an AI enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)