---
title: Process real-time events using Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a real-time event processing project to a Flex Consumption plan on Azure."
ms.date: 03/31/2026
ms.topic: quickstart
ai-usage: ai-assisted
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy an Event Hubs triggered function for real-time event processing to a new function app in the Flex Consumption plan in Azure.
---

# Quickstart: Process real-time events by using Azure Functions

In this article, you use the Azure Developer CLI (`azd`) to create an Event Hubs trigger function for real-time event processing in Azure Functions. After verifying the code locally, you deploy it to a new serverless function app running in a Flex Consumption plan in Azure.

The project source uses `azd` to create the function app and related resources and to deploy your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

By default, the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, which means you can complete this article and only incur a small cost of a few USD cents or less in your Azure account.
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> While [processing Event Hubs messages](./functions-bindings-event-hubs.md) is supported for all languages, this quickstart scenario currently only has examples for C#, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Prerequisites
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
::: zone-end  
::: zone pivot="programming-language-typescript"
+ [Node.js 22](https://nodejs.org/) or later  
::: zone-end  
::: zone pivot="programming-language-python" 
+ [Python 3.11](https://www.python.org/) or later
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
+ [Azurite storage emulator](../storage/common/storage-use-azurite.md)

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)

+ [Azure CLI](/cli/azure/install-azure-cli)

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Initialize the project

Use the `azd init` command to create a local Azure Functions code project from a template.
::: zone-end 
::: zone pivot="programming-language-csharp"  
In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
```console
azd init --template functions-quickstart-dotnet-azd-eventhub -e eventhub-dotnet
```

This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-eventhub) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 
::: zone-end  
::: zone pivot="programming-language-typescript"  
In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
```console
azd init --template functions-quickstart-typescript-azd-eventhub -e eventhub-ts
```

This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-eventhub) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure.
::: zone-end  
::: zone pivot="programming-language-python"  
In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
```console
azd init --template functions-quickstart-python-azd-eventhub -e eventhub-py
```
    
This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-azd-eventhub) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure.

## Create and activate a virtual environment

In the root folder, run these commands to create and activate a virtual environment named `.venv`:

### [Linux/macOS](#tab/linux)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

If Python doesn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

### [Windows (bash)](#tab/windows-bash)

```bash
py -m venv .venv
source .venv/scripts/activate
```

### [Windows (Cmd)](#tab/windows-cmd)

```shell
py -m venv .venv
.venv\scripts\activate
```

---

::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Create Azure resources

Before you can run your function locally, you need to create an Event Hubs namespace and hub in Azure. Use `azd provision` to create these resources and configure your local settings by adding the required *local.settings.json* file.

1. Run the following command to sign in to Azure:

    ```console
    azd auth login
    ```

    Follow the prompts to authenticate by using your Azure account.

1. From the root folder, run the following command to create your Azure resources:

    ```console
    azd provision
    ```

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which you create your resources.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown. |
    | _vnetEnabled_ | Use a value of `False` to avoid the extra overhead of creating virtual network resources. |

    The `azd provision` command creates the required Azure resources, including an Event Hubs namespace and hub, a Flex Consumption function app, Application Insights, and a storage account. It also configures your *local.settings.json* file with the Event Hubs connection information.

## Run in your local environment  
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"
1. In a separate terminal window, start the Azurite storage emulator:

    ```console
    azurite
    ```

    The local Functions host process uses the Azurite emulator for the internal storage connection (`AzureWebJobsStorage`) required by the runtime.
::: zone-end  
::: zone pivot="programming-language-csharp"
2. To start the function app, run these commands in a terminal or command prompt to navigate to the `src` project folder and start the function app:

    ```console
    cd src
    func start
    ```

::: zone-end  
::: zone pivot="programming-language-python"
2. To start the function app, run this command in a terminal or command prompt:

    ```console
    func start
    ```

::: zone-end  
::: zone pivot="programming-language-typescript"  
2. To install dependencies and start the function app, run these commands in a terminal or command prompt:
 
    ```console
    cd src
    npm install
    npm start  
    ```

::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"  
3. If prompted, allow Core Tools (func.exe) to be called through the firewall.

4. When the Functions host starts in your local project folder, it writes information about your functions to the terminal output. 

    This sample includes a Timer trigger function that automatically generates news articles every 10 seconds and sends them to Event Hubs. The Event Hubs trigger function then processes these events and performs sentiment analysis and engagement tracking.

    You see output similar to this example:

    <pre>
    [2026-03-02T22:37:30.151Z] Executing 'Functions.EventHubsTrigger'
    [2026-03-02T22:37:30.159Z] Trigger Details: PartitionId: 24, OffsetString: 0, EnqueueTimeUtc: 2026-03-02T22:37:29.1790000+00:00, SequenceNumber: 0, Count: 1, Offset: 0, PartionId: 24
    [2026-03-02T22:37:30.169Z] ⭐ High-engagement article NEWS-20260302-0580CB82 (Views: 6123, Sentiment: 0.57) featured!
    [2026-03-02T22:37:30.174Z] 🔥 Viral article: NEWS-20260302-0580CB82 - 6,123 views
    [2026-03-02T22:37:30.181Z] 🌟 Featured article: NEWS-20260302-0580CB82
    [2026-03-02T22:37:30.185Z] ✅ Successfully processed article NEWS-20260302-0580CB82 - 'Technology Breakthrough in Renewable Energy Technology' by Sarah Johnson
    [2026-03-02T22:37:30.191Z] 📰 Processed 1 news articles, 0 failed in batch of 1
    [2026-03-02T22:37:30.196Z] 📊 NEWS BATCH SUMMARY: 1 articles | Total Views: 6,123 | Avg Views: 6,123 | Avg Sentiment: 0.57 | Status: [Featured: 1]
    [2026-03-02T22:37:30.200Z] 📂 Top Categories: [Health: 1] | Top Sources: [Innovation Weekly: 1]
    [2026-03-02T22:37:30.204Z] 🔥 Viral articles in batch: 1
    [2026-03-02T22:37:30.207Z] Executed 'Functions.EventHubsTrigger' (Succeeded, Duration=55ms)
    </pre>

5. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.
6. Close the window in which Azurite is running.
::: zone-end  
::: zone pivot="programming-language-python"  
7. Run `deactivate` to shut down the virtual environment.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"  
## Review the code (optional)

You can review the code that defines the Event Hubs trigger function:
::: zone-end      
::: zone pivot="programming-language-csharp"  
:::code language="csharp" source="~/functions-event-hub-azd-dotnet/src/EventHubsTrigger.cs" range="1-51" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-eventhub).
::: zone-end  
::: zone pivot="programming-language-typescript" 
:::code language="typescript" source="~/functions-event-hub-azd-typescript/src/functions/EventHubsTrigger.ts" range="1-43" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-eventhub).
::: zone-end  
::: zone pivot="programming-language-python" 
:::code language="python" source="~/functions-event-hub-azd-python/function_app.py" range="1-12,85-130" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-python-azd-eventhub).
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
After you verify your function locally, it's time to publish it to Azure. 

## Deploy to Azure
 
This project is configured to use the `azd up` command to deploy your code to a new function app in a Flex Consumption plan in Azure. Since you already provisioned resources, this command deploys your code to the existing function app.

>[!TIP]
>This project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex Consumption plan that follows best practices.

From the repository root folder, run the following command to deploy your code project to the function app in Azure:

```console
azd deploy
```

The deployment packages your code and deploys it to the function app. When the command finishes, you see links to the resources you created.

## Verify deployment

After deployment finishes, your Event Hubs trigger function automatically starts processing events as they arrive in the event hub.

1. In the [Azure portal](https://portal.azure.com), go to your new function app.

1. Select **Log stream** from the left menu to monitor your function executions in real-time.

1. You see log entries that show your Event Hubs trigger function processing events generated by the Timer trigger.

[!INCLUDE [functions-scenario-redeploy-cleanup](../../includes/functions-scenario-redeploy-cleanup.md)]
::: zone-end

## Related articles

+ [Event Hubs trigger for Azure Functions](functions-bindings-event-hubs-trigger.md)
+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
