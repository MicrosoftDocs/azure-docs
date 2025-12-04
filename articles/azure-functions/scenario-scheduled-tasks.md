---
title: Run scheduled tasks using Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a scheduled task project to a Flex Consumption plan on Azure."
ms.date: 12/01/2025
ms.topic: quickstart
ai-usage: ai-assisted
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy scheduled tasks using Timer triggers to a new function app in the Flex Consumption plan in Azure.
---

# Quickstart: Run scheduled tasks using Azure Functions

In this article, you use the Azure Developer CLI (`azd`) to create a Timer trigger function to run a scheduled task in Azure Functions. After verifying the code locally, you deploy it to a new serverless function app you create running in a Flex Consumption plan in Azure Functions.

The project source uses `azd` to create the function app and related resources and to deploy your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

By default, the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, which means you can complete this article and only incur a small cost of a few USD cents or less in your Azure account.
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> While [running scheduled tasks](./functions-bindings-timer.md) is supported for all languages, this quickstart scenario currently only has examples for C#, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Prerequisites
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
::: zone-end  
<!--- replace after Java gets added:
::: zone pivot="programming-language-java"  
+ [Java 17 Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure)
    + If you use another [supported version of Java](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version), you must update the project configuration. 
    + Set the `JAVA_HOME` environment variable to the install location of the correct version of the Java Development Kit (JDK).
::: zone-end  -->
::: zone pivot="programming-language-typescript"
+ [Node.js 22](https://nodejs.org/) or above  
::: zone-end  
::: zone pivot="programming-language-python" 
+ [Python 3.11](https://www.python.org/) or above

+ [Azurite storage emulator](../storage/common/storage-use-azurite.md)
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Initialize the project

Use the `azd init` command to create a local Azure Functions code project from a template.
::: zone-end 
::: zone pivot="programming-language-csharp"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-dotnet-azd-timer -e scheduled-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-timer) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Run this command to navigate to the app folder:

    ```console
    cd src
    ```

1. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
            "TIMER_SCHEDULE": "*/30 * * * * *"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-typescript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-typescript-azd-timer -e scheduled-ts
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-timer) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "TIMER_SCHEDULE": "*/30 * * * * *"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-python"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-python-azd-timer -e scheduled-py
    ```
        
    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-azd-timer) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "python",
            "TIMER_SCHEDULE": "*/30 * * * * *"
        }
    }
    ```

    This file is required when running locally.

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
## Run in your local environment  
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python" 
1. Run this command from your app folder in a terminal or command prompt:

    ```console
    func start
    ``` 
::: zone-end  
<!--- Replace this when Java support is added
::: zone pivot="programming-language-java" 
1. Run this command from your app folder in a terminal or command prompt:
 
    ```console
    mvn clean package
    mvn azure-functions:run
    ```
::: zone-end -->  
<!--- Replace this when JavaScript support is added
::: zone pivot="programming-language-javascript"  
1. Run this command from your app folder in a terminal or command prompt:

    ```console
    npm install
    func start  
    ```
::: zone-end -->  
::: zone pivot="programming-language-typescript"  
1. Run this command from your app folder in a terminal or command prompt:
 
    ```console
    npm install
    npm start  
    ```
::: zone-end  
<!--- Replace this when PowerShell support is added
::: zone pivot="programming-language-powershell"  
1. Run this command from your app folder in a terminal or command prompt:

   
    ::: zone pivot="programming-language-powershell"  
    ```console
    func start
    ```
::: zone-end -->  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
2. When the Functions host starts in your local project folder, it writes information about your Timer triggered function to the terminal output. You should see your Timer triggered function execute based on the schedule defined in your code.

    The default schedule is `*/30 * * * * *`, which runs every 30 seconds.

3. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.
::: zone-end 
::: zone pivot="programming-language-python"
4. Run `deactivate` to shut down the virtual environment.
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Review the code (optional)

You can review the code that defines the Timer trigger function:
::: zone-end      
::: zone pivot="programming-language-csharp"  
:::code language="csharp" source="~/functions-azd-timer-dotnet/src/timerFunction.cs" range="1-6,10-18,29-43" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-timer).
::: zone-end  
::: zone pivot="programming-language-typescript" 
:::code language="typescript" source="~/functions-azd-timer-typescript/src/src/functions/timerFunction.ts" range="1-2,12-24" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-timer).
::: zone-end  
::: zone pivot="programming-language-python" 
:::code language="python" source="~/functions-azd-timer-python/src/function_app.py" range="1-13,25-30" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-python-azd-timer).
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
After you verify your function locally, it's time to publish it to Azure. 

## Deploy to Azure
 
This project is configured to use the `azd up` command to deploy your code to a new function app in a Flex Consumption plan in Azure.

>[!TIP]
>This project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices.

1. Run this command to have `azd` create the required Azure resources in Azure and deploy your code project to the new function app:

    ```console
    azd up
    ```

    The root folder contains the `azure.yaml` definition file required by `azd`. 

    If you're not already signed in, you're asked to authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    
    The `azd up` command uses your response to these prompts with the Bicep configuration files to complete these deployment tasks:

    + Create and configure these required Azure resources (equivalent to `azd provision`):

        + Flex Consumption plan and function app
        + Azure Storage (required) and Application Insights (recommended)
        + Access policies and roles for your account
        + Service-to-service connections using managed identities (instead of stored connection strings)
        + Virtual network to securely run both the function app and the other Azure resources

    + Package and deploy your code to the deployment container (equivalent to `azd deploy`). The app is then started and runs in the deployed package. 

    After the command completes successfully, you see links to the resources you created. 

## Verify deployment

After deployment completes, your Timer trigger function automatically starts running in Azure based on its schedule.

1. In the [Azure portal](https://portal.azure.com), go to your new function app.

1. Select **Log stream** from the left menu to monitor your function executions in real-time.

1. You should see log entries that show your Timer trigger function executing according to its schedule.

## Redeploy your code

Run the `azd up` command as many times as you need to both provision your Azure resources and deploy code updates to your function app. 

>[!NOTE]
>Deployed code files are always overwritten by the latest deployment package.

Your initial responses to `azd` prompts and any environment variables generated by `azd` are stored locally in your named environment. Use the `azd env get-values` command to review all of the variables in your environment that were used when creating Azure resources. 

## Clean up resources

When you're done working with your function app and related resources, use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```console
azd down --no-prompt
```

>[!NOTE]  
>The `--no-prompt` option instructs `azd` to delete your resource group without a confirmation from you. 
>
>This command doesn't affect your local code project. 
::: zone-end

## Related articles

+ [Timer trigger for Azure Functions](functions-bindings-timer.md)
+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
