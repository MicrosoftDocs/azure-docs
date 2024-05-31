---
title: 'Tutorial: Connect to OpenAI from Azure Functions in Visual Studio Code'
description: Learn how to connect Azure Functions to OpenAI by adding an output binding to your Visual Studio Code project.
ms.date: 5/30/2024
ms.topic: tutorial
author: dbandaru
ms.author: dbandaru
zone_pivot_groups: programming-languages-set-functions
#customer intent: As an Azure developer, I want learn how to integrate Azure OpenAI capabilities in my function code to leverage AI benefits in my colud-based code executions. 
---

# Tutorial: Connect to OpenAI from Azure Functions using Visual Studio Code

This article shows you how to use Visual Studio Code to connect Azure OpenAI to the function you created in the previous quickstart article. The output binding that you add to this HTTP trigger function {{does somethign cool}}.

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

> [!div class="checklist"]
> * Create resources in Azure OpenAI.
> * Deploy a model in OpenAI the resource.
> * Set access permissions to the model resource.
> * Enable your function app to connect to OpenAI.
> * Add OpenAI bindings to your HTTP triggered function.

## Prerequisites
:::zone pivot="programming-language-csharp"  
* Complete the steps in [part 1 of the Visual Studio Code quickstart](create-first-function-vs-code-csharp.md).
:::zone-end  
:::zone pivot="programming-language-java"  
* Complete the steps in [part 1 of the Visual Studio Code quickstart](create-first-function-vs-code-java.md).
:::zone-end  
:::zone pivot="programming-language-javascript"  
* Complete the steps in [part 1 of the Visual Studio Code quickstart](create-first-function-vs-code-node.md).
:::zone-end  
:::zone pivot="programming-language-typescript"  
* Complete the steps in [part 1 of the Visual Studio Code quickstart](create-first-function-vs-code-typescript.md).
:::zone-end 
:::zone pivot="programming-language-python" 
* Complete the steps in [part 1 of the Visual Studio Code quickstart](create-first-function-vs-code-python.md).
:::zone-end  
:::zone pivot="programming-language-powershell" 
* Complete the steps in [part 1 of the Visual Studio Code quickstart](create-first-function-vs-code-powershell.md).
:::zone-end 
* Obtain access to Azure OpenAI in your Azure subscription. If you haven't already been granted access, complete [this form](https://aka.ms/oai/access) to request access.
:::zone pivot="programming-language-csharp"  
* Install [.NET Core CLI tools](/dotnet/core/tools/?tabs=netcore2x).
:::zone-end  
## 1. Create your Azure OpenAI resources

The following steps show how to create an Azure OpenAI data model in the Azure portal. 

1. Sign in with your Azure subscription in the Azure portal.

1. Select **Create a resource** and search for the **Azure OpenAI**. When you locate the service, select **Create**.

1. On the **Create Azure OpenAI** page, provide the following information for the fields on the **Basics** tab:

   | Field | Description |
   |---|---|
   | **Subscription** | Your subscription, which has been onboarded to use Azure OpenAI. |
   | **Resource group** | The resource group you created for the function app in the previous article. |
   | **Region** | Ideally, the same location as the function app. |
   | **Name** | A descriptive name for your Azure OpenAI Service resource, such as _mySampleOpenAI_. |
   | **Pricing Tier** | The pricing tier for the resource. Currently, only the Standard tier is available for the Azure OpenAI Service. For more info on pricing visit the [Azure OpenAI pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) |

   :::image type="content" source="../ai-services/openai/media/create-resource/create-resource-basic-settings.png" alt-text="Screenshot that shows how to configure an Azure OpenAI resource in the Azure portal.":::

1. Select **Next** twice to accept the default values for both the **Network** and **Tags** tabs. The service you create doesn't have any network restrictions, including from the internet.

1. Select **Next** a final time to move to the final stage in the process: **Review + submit**.

1. Confirm your configuration settings, and select **Create**.

The Azure portal displays a notification when the new resource is available.

## 2. Deploy a model

Now you can deploy a model. You can select from one of several available models in Azure OpenAI Studio.

To deploy a model, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).

1. Choose the subscription and the Azure OpenAI resource you created, and select **Use resource**.

1. Under **Management** select **Deployments**.

1. Select **Create new deployment** and configure the following fields:

    | Field | Description |
    |---|---|
    | **Select a model** | Model availability varies by region. For a list of available models per region, see [Model summary table and region availability](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability). |
    | **Deployment name** | Choose a name carefully. The deployment name is used in your code to call the model by using the client libraries and the REST APIs. |

    > [!IMPORTANT]
    > When you access the model via the API, you need to refer to the deployment name rather than the underlying model name in API calls, which is one of the key differences between OpenAI and Azure OpenAI. OpenAI only requires the model name. Azure OpenAI always requires deployment name, even when using the model parameter. In our docs, we often have examples where deployment names are represented as identical to model names to help indicate which model works with a particular API endpoint. Ultimately your deployment names can follow whatever naming convention is best for your use case.

1. Leave the **Advanced options** set to the defaults, and select **Create**.

    The deployments table shows a new entry that corresponds to your newly created model.

1. After the deployment completes, navigate to the Azure OpenAI resource page in the Azure portal, and select **Click here to view endpoints** under **Essentials**. Copy the **endpoint** URL and the **keys**. Save these values, you need them later.

## 3. Update application settings

Now that you have the credentials to connect to your model in Azure OpenAI, you need to set these access credentials in application settings.

1. In Visual Studio Code, open the code project you created when you completed the [previous article](./create-first-function-vs-code-csharp.md) and add these values to the local.settings.json file:


    + **`AZURE_OPENAI_ENDPOINT`**: required by the binding extension. Set this value to the endpoint of the Azure OpenAI resource you created earlier.
    + **`AZURE_OPENAI_KEY`**: required by the binding extension. Set this value to the key for the Azure OpenAI resource.
    + **`CHAT_MODEL_DEPLOYMENT_NAME`**: used to define the input binding. Set this value to `gpt-3.5-turbo`, unless you used a different name for your model deployment.

1. Save the file. When you deploy to Azure, you must also add these settings to your function app. 

:::zone pivot="programming-language-csharp" 
## 4. Register binding extensions

Because you're using an Azure OpenAI output binding, you must have the corresponding bindings extension installed before you run the project. 

Except for HTTP and timer triggers, bindings are implemented as extension packages. To add the Azure OpenAI extension package to your project, run this [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the **Terminal** window:

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.OpenAI --prerelease
```
:::zone-end
:::zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
<!---NOTE: Update this after preview to `## Verify the extension bundle`-->
## 4. Update the extension bundle

To access the preview Azure OpenAI bindings, you must use a preview version of the extension bundle that contains this extension. 

Replace the contents of your current `host.json` file with this JSON:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
``` 
:::zone-end
Now, you can use the Azure OpenAI output binding to your project.

## 5. Return text completion from the model

The code you add creates a `whois` HTTP function endpoint in your existing project. In this function, data passed in a URL `name` parameter of a GET request is used to dynamically create a completion prompt. This dynamic prompt is bound to a text completion input binding, which returns a response from the model based on the prompt. The completion from the model is returned in the HTTP response. 
:::zone pivot="programming-language-csharp"  
1. In your existing `HttpExample` class file, add this `using` statement:

    :::code language="csharp" source="~/functions-openai-extension/samples/textcompletion/csharp-ooproc/TextCompletions.cs" range="5" ::: 

1. In the same file, add this code that defines a new HTTP trigger endpoint named `whois`: 

    ```csharp
    [Function(nameof(WhoIs))]
    public IActionResult WhoIs([HttpTrigger(AuthorizationLevel.Function, Route = "whois/{name}")] HttpRequest req,
    [TextCompletionInput("Who is {name}?", Model = "%CHAT_MODEL_DEPLOYMENT_NAME%")] TextCompletionResponse response)
    {
        if(!String.IsNullOrEmpty(response.Content))
        {
            return new OkObjectResult(response.Content);
        }
        else
        {
            return new NotFoundObjectResult("Something went wrong.");
        }
    }
    ```

:::zone-end  
:::zone pivot="programming-language-java"  
1. Update the `pom.xml` project file to add this reference to the `properties` collection:

    :::code language="xml" source="~/functions-openai-extension/samples/textcompletion/java/pom.xml" range="18" ::: 

1. In the same file, add this dependency to the `dependencies` collection: 

    :::code language="xml" source="~/functions-openai-extension/samples/textcompletion/java/pom.xml" range="29-33" ::: 

1. In the existing `Function.java` project file, add these `import` statements:

    :::code language="java" source="~/functions-openai-extension/samples/textcompletion/java/src/main/java/com/azfs/TextCompletions.java" range="19-20" ::: 

1. In the same file, add this code that defines a new HTTP trigger endpoint named `whois`: 

    :::code language="java" source="~/functions-openai-extension/samples/textcompletion/java/src/main/java/com/azfs/TextCompletions.java" range="31-46" ::: 

:::zone-end  
:::zone pivot="programming-language-javascript"  
1. In Visual Studio Code, Press F1 and in the command palette type `Azure Functions: Create Function...`, select **HTTP trigger**, type the function name `whois`, select **Anonymous**, and press Enter.

1. In the new `whois.js` code file, replace the contents of the file with this code:

    ```javascript
    const { app } = require('@azure/functions');

    const openAICompletionInput = app.generic({
        prompt: 'Who is {name}?',
        maxTokens: '100',
        type: 'textCompletion',
        model: '%CHAT_MODEL_DEPLOYMENT_NAME%'
    });
    app.http('whois', {
        methods: ['GET'],
        route: 'whois/{name}',
        authLevel: 'anonymous',
        extraInputs: [openAICompletionInput],
        handler: async (request, context) => {
            var response = context.extraInputs.get(openAICompletionInput);
            return { body: response.content.trim() };
        }
    });
    ```
  
:::zone-end  
:::zone pivot="programming-language-typescript"  
1. In Visual Studio Code, Press F1 and in the command palette type `Azure Functions: Create Function...`, select **HTTP trigger**, type the function name `whois`, select **Anonymous**, and press Enter.

1. In the new `whois.ts` code file, replace the contents of the file with this code:

    :::code language="typescript" source="~/functions-openai-extension/samples/textcompletion/nodejs/src/functions/whois.ts" ::: 
  
:::zone-end  
:::zone pivot="programming-language-python" 
1. In the existing `function_app.py` project file, add this `import` statement:

    :::code language="python" source="~/functions-openai-extension/samples/textcompletion/python/function_app.py" range="1" ::: 

1. In the same file, add this code that defines a new HTTP trigger endpoint named `whois`: 
    :::code language="python" source="~/functions-openai-extension/samples/textcompletion/python/function_app.py" range="7-18" ::: 
 
:::zone-end  
:::zone pivot="programming-language-powershell" 
1. In Visual Studio Code, Press F1 and in the command palette type `Azure Functions: Create Function...`, select **HTTP trigger**, type the function name `whois`, select **Anonymous**, and press Enter.

1. Open the new `whois/function.json` code file and replace its contents with this code, which adds a definition for the `TextCompletionResponse` input binding:

    :::code language="json" source="~/functions-openai-extension/samples/textcompletion/powershell/WhoIs/function.json" ::: 
  
1. Replace the content of the `whois/run.ps1` code file with this code, which returns the input binding response:

    :::code language="powershell" source="~/functions-openai-extension/samples/textcompletion/powershell/WhoIs/run.ps1" ::: 
  
:::zone-end 

## 6. Run the function

<!--- 1. Install and start Azurite for local development storage. For instructions on how to work with Azurite: https://learn.microsoft.com/azure/storage/common/storage-use-azurite
-->

1. As in the previous article, press <kbd>F5</kbd> to start the function app project and Core Tools.

1. With the Core Tools running, send a GET request to the `whois` endpoint function, with a name in the path, like this URL: 

    `http://localhost:7071/api/whois/<NAME>`

    Replace the `<NAME>` string with the value you want passed to the `"Who is {name}?"` prompt. 

    The response you see is the text completion response from your Azure OpenAI model.

1. After a response is returned, press <kbd>Ctrl + C</kbd> to stop Core Tools.

<!-- enable managed identities
## 8. Set access permissions 
{{move this info into the main article}}
[create Azure OpenAI resources and to deploy models](../ai-services/openai/how-to/role-based-access-control.md).

## 9. Deploy to Azure
-->

## Clean up resources

In Azure, *resources* refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group.

You created resources to complete these quickstarts. You could be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). If you don't need the resources anymore, here's how to delete them:

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

## Related content

+ [Azure OpenAI extension for Azure Functions](functions-bindings-openai.md)
+ [Azure OpenAI extension samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples)
+ [Machine learning and AI](functions-scenarios.md#machine-learning-and-ai)




