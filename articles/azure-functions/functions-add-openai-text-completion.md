---
title: 'Tutorial: Add Azure OpenAI text completions to your functions in Visual Studio Code'
description: Learn how to connect Azure Functions to OpenAI by adding an output binding to your Visual Studio Code project.
ms.date: 07/11/2024
ms.topic: tutorial
author: dbandaru
ms.author: dbandaru
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
#customer intent: As an Azure developer, I want learn how to integrate Azure OpenAI capabilities in my function code to leverage AI benefits in my cloud-based code executions. 
---

# Tutorial: Add Azure OpenAI text completion hints to your functions in Visual Studio Code

This article shows you how to add an HTTP endpoint to the function app you created in the previous quickstart article. When triggered, this new HTTP endpoint uses an [Azure OpenAI text completion input binding](functions-bindings-openai-textcompletion-input.md) to get text completion hints from your data model.

During this tutorial, you learn how to accomplish these tasks:  

> [!div class="checklist"]
> * Create resources in Azure OpenAI.
> * Enable managed identity access to your OpenAI resource.
> * Deploy a model in the OpenAI resource.
> * Set access permissions to the model resource.
> * Enable your function app to connect to OpenAI.
> * Add OpenAI bindings to your HTTP triggered function.

## Prerequisites

- Complete the steps in [Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI](create-first-function-azure-developer-cli.md). 

- Obtain access to Azure OpenAI in your Azure subscription. If you haven't already been granted access, complete [this form](https://aka.ms/oai/access) to request access.

## Create your Azure OpenAI resources

Use these steps to create an Azure OpenAI data model:

### [Azure portal](#tab/azure-portal) 

1. In the Azure portal, select **Create a resource** and search for the **Azure OpenAI**. When you locate the service, select **Create**.

1. On the **Create Azure OpenAI** page, provide the following information for the fields on the **Basics** tab:

   | Field | Description |
   |---|---|
   | **Subscription** | Your subscription, which has been onboarded to use Azure OpenAI. |
   | **Resource group** | Use the same same resource group as your existing function app. |
   | **Region** | Ideally, use the same same region where your existing function app is hosted. |
   | **Name** | A descriptive name for your Azure OpenAI Service resource, such as _mySampleOpenAI_. |
   | **Pricing Tier** | The pricing tier for the resource. Currently, only the Standard tier is available for the Azure OpenAI Service. For more info on pricing visit the [Azure OpenAI pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) |

   :::image type="content" source="/azure/ai-services/openai/media/create-resource/create-resource-basic-settings.png" alt-text="Screenshot that shows how to configure an Azure OpenAI resource in the Azure portal.":::

1. Select **Next** twice to accept the default values for both the **Network** and **Tags** tabs. The service you create doesn't have any network restrictions, including from the internet.

1. Select **Next** a final time to move to the final stage in the process: **Review + submit**.

1. Confirm your configuration settings, and select **Create**.

    The Azure portal displays a notification when the new resource is available. Select **Go to resource** in the notification or search for your new Azure OpenAI resource by name. 

1. In the Azure OpenAI resource page for your new resource, select **Click here to view endpoints** under **Essentials** > **Endpoints**. 

1. Copy the **endpoint** URL, which you need to use later.

### [Azure CLI](#tab/azure-cli)

1. Use the command to 

---

Next, you grant access to the user-assigned managed identity to be able to connect to your Azure OpenAI resource.

## 4. Grant user access to Azure OpenAI 

Use these steps to grant access in your new Azure OpenAI resource both to the user-assigned manage identity associated with your app and to your Azure account. 

1. In your Azure OpenAI resource, select **Access control (IAM)** on the left pane.

1. Select **Add** > **Add role assignment**.

1. On the **Role** tab on the next screen, select **Cognitive Services OpenAI User** and then **Next**.

1. On the **Members** tab, select **Assign access to** > **Managed identity** then **Select members**.

1. In the **Select managed identities** pane, select **Managed identity** > **User assigned managed identity**.

1. Choose your user-assigned managed identity from the list and then **Select** > **Review + assign**.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## 5. Deploy a model

Now you can deploy a model. You can select from one of several available models in Azure OpenAI Studio.

To deploy a model, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).

1. In the correct **Subscription** and **Directory**, select the name of the Azure OpenAI resource you created, and select **Use resource**.

1. Under **Shared resources** select **Deployments**.

1. Select **Deploy model** > **Deploy base model**, choose your base model from the list, such as `gpt-4o`, and select **Confirm**. 

    Model availability varies by region. For a list of available models per region, see [Model summary table and region availability](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability).

1. Confirm the **Deployment name** for your model deployment and select **Deploy**. 

    Choose a deployment name carefully. The deployment name is used in your code to call the model by using the client libraries and the REST APIs, so you must save it for use later on.  

    > [!IMPORTANT]
    > When you access the model via the API, you need to refer to the deployment name rather than the underlying model name in API calls, which is one of the key differences between OpenAI and Azure OpenAI. OpenAI only requires the model name. Azure OpenAI always requires deployment name, even when using the model parameter. In our docs, we often have examples where deployment names are represented as identical to model names to help indicate which model works with a particular API endpoint. Ultimately your deployment names can follow whatever naming convention is best for your use case.

You now have everything you need to add Azure OpenAI-based text completion to your function app.

## 6. Update application settings

1. In Visual Studio Code, open the local code project you created when you completed the [previous article](./create-first-function-vs-code-csharp.md).

1. In the local.settings.json file in the project root folder, update the `AzureWebJobsStorage` setting to `UseDevelopmentStorage=true`. You can skip this step if the `AzureWebJobsStorage` setting in *local.settings.json* is set to the connection string for an existing Azure Storage account instead of `UseDevelopmentStorage=true`. 

1. In the local.settings.json file, add these settings values:

    + **`AzureOpenAI__endpoint`**: required by the binding extension. Set this value to the endpoint of the Azure OpenAI resource you created earlier.
    + **`"AzureOpenAI__tenantId"`**: required when running locally to connect to Azure OpenAI with the user-assigned managed identity. Set this value to the **Tenant ID** value you saved earlier.
    + **`AzureOpenAI__clientId`**: required when running locally and in Azure. Set this value to the **Client ID** value you saved earlier. 
    + **`CHAT_MODEL_DEPLOYMENT_NAME`**: used by input binding settings. Set this value to the name you chose for your model deployment.

1. Save the file. When you deploy to Azure, you must also add these settings to your function app. 

:::zone pivot="programming-language-csharp" 
## 7. Register binding extensions

Because you're using an Azure OpenAI output binding, you must have the corresponding bindings extension installed before you run the project. 

Except for HTTP and timer triggers, bindings are implemented as extension packages. To add the Azure OpenAI extension package to your project, run this [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the **Terminal** window:

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.OpenAI --prerelease
```
:::zone-end
:::zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
<!---NOTE: Update this after preview to `## Verify the extension bundle`-->
## 7. Update the extension bundle

To access the preview Azure OpenAI bindings, you must use a preview version of the extension bundle that contains this extension. 

Replace the `extensionBundle` setting in your current `host.json` file with this JSON:

```json
 "extensionBundle": {
   "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
   "version": "[4.*, 5.0.0)"
 }
``` 
:::zone-end
Now, you can use the Azure OpenAI output binding in your project.

## 8. Return text completion from the model

The code you add creates a `whois` HTTP function endpoint in your existing project. In this function, data passed in a URL `name` parameter of a GET request is used to dynamically create a completion prompt. This dynamic prompt is bound to a text completion input binding, which returns a response from the model based on the prompt. The completion from the model is returned in the HTTP response. 
:::zone pivot="programming-language-csharp"  
1. In your existing `HttpExample` class file, add this `using` statement:

    :::code language="csharp" source="~/functions-openai-extension/samples/textcompletion/csharp-ooproc/TextCompletions.cs" range="5" ::: 

1. In the same file, add this code that defines a new HTTP trigger endpoint named `whois`: 

    ```csharp
    [Function(nameof(WhoIs))]
    public IActionResult WhoIs([HttpTrigger(AuthorizationLevel.Function, Route = "whois/{name}")] HttpRequest req,
    [TextCompletionInput("Who is {name}?", ChatModel = "%CHAT_MODEL_DEPLOYMENT_NAME%")] TextCompletionResponse response)
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
1. In Visual Studio Code, Press F1 and in the command palette type `Azure Functions: Create Function...`, select **HTTP trigger**, type the function name `whois`, and press Enter.

1. In the new `whois.js` code file, replace the contents of the file with this code:

    :::code language="javascript" source="~/functions-openai-extension/samples/textcompletion/javascript/src/functions/whois.js" ::: 
  
:::zone-end  
:::zone pivot="programming-language-typescript"  
1. In Visual Studio Code, Press F1 and in the command palette type `Azure Functions: Create Function...`, select **HTTP trigger**, type the function name `whois`, and press Enter.

1. In the new `whois.ts` code file, replace the contents of the file with this code:

    :::code language="typescript" source="~/functions-openai-extension/samples/textcompletion/typescript/src/functions/whois.ts" ::: 
  
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

## 9. Run the function

1. In Visual Studio Code, Press F1 and in the command palette type `Azurite: Start` and press Enter to start the Azurite storage emulator.

1. Press <kbd>F5</kbd> to start the function app project and Core Tools in debug mode.

1. With the Core Tools running, send a GET request to the `whois` endpoint function, with a name in the path, like this URL: 

    `http://localhost:7071/api/whois/<NAME>`

    Replace the `<NAME>` string with the value you want passed to the `"Who is {name}?"` prompt. The `<NAME>` must be the URL-encoded name of a public figure, like `Abraham%20Lincoln`. 

    The response you see is the text completion response from your Azure OpenAI model.

1. After a response is returned, press <kbd>Ctrl + C</kbd> to stop Core Tools.

## 10. Deploy to Azure


## 11. Clean up resources

In Azure, *resources* refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group.

You created resources to complete these quickstarts. You could be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). If you don't need the resources anymore, here's how to delete them:

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

## Related content

+ [Azure OpenAI extension for Azure Functions](functions-bindings-openai.md)
+ [Azure OpenAI extension samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples)
+ [Machine learning and AI](functions-scenarios.md#machine-learning-and-ai)




