---
title: Create your function app resources in Azure using Bicep
description: Create and deploy to Azure a simple HTTP triggered serverless function using Bicep.
author: schaffererin
ms.author: v-eschaffer
ms.date: 05/12/2022
ms.topic: quickstart
ms.service: azure-functions
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm
---

# Quickstart: Create and deploy Azure Functions resources using Bicep

In this article, you use Bicep to create a function that responds to HTTP requests.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

### Azure account

Before you begin, you must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

### Create a local functions project

This article requires a local functions code project to run on the Azure resources that you create. If you don't first create a project to publish, you won't be able to complete the deployment section of this article.

Choose one of the following tabs, follow the link, and complete the section to create a function app in the language of your choice:

# [Visual Studio Code](#tab/visual-studio-code)

Create your local functions project in your chosen language in Visual Studio Code:  

+ [C#](create-first-function-vs-code-csharp.md)
+ [Java](create-first-function-vs-code-java.md)
+ [JavaScript](create-first-function-vs-code-node.md)
+ [PowerShell](create-first-function-vs-code-powershell.md)
+ [Python](create-first-function-vs-code-python.md)
+ [TypeScript](create-first-function-vs-code-typescript.md)

# [Visual Studio](#tab/visual-studio)

[Create your local functions project in Visual Studio](functions-create-your-first-function-visual-studio.md#create-a-function-app-project)

# [Command line](#tab/command-line)

Create your local functions project in your chosen language from the command line:

+ [C#](create-first-function-cli-csharp.md)
+ [Java](create-first-function-cli-java.md)
+ [JavaScript](create-first-function-cli-node.md)
+ [PowerShell](create-first-function-cli-powershell.md)
+ [Python](create-first-function-cli-python.md)
+ [TypeScript](create-first-function-cli-typescript.md)

---

After you've created your project locally, you create the resources required to run your new function in Azure.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.web/function-app-create-dynamic/main.bicep":::

The following four Azure resources are created by this Bicep file:

+ [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage account, which is required by Functions.
+ [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create a serverless Consumption hosting plan for the function app.
+ [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create a function app.
+ [**microsoft.insights/components**](/azure/templates/microsoft.insights/components): create an Application Insights instance for monitoring.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters appInsightsLocation=<app-location>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -appInsightsLocation "<app-location>"
    ```

    ---

    > [!NOTE]
    > Replace **\<app-location\>** with the region for Application Insights, which is usually the same as the resource group.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Next you validate the function app hosting resources you created by publishing your project to Azure and calling the HTTP endpoint of the function.

### Publish the function project to Azure

Use the following steps to publish your project to the new Azure resources:

# [Visual Studio Code](#tab/visual-studio-code)

[!INCLUDE [functions-republish-vscode](../../includes/functions-republish-vscode.md)]

In the output, copy the URL of the HTTP trigger. You use this to test your function running in Azure.

# [Visual Studio](#tab/visual-studio)

1. In **Solution Explorer**, right-click the project and select **Publish**.

1. In **Pick a publish target**, choose **Azure Functions Consumption plan** with **Select existing** and select **Create profile**.

    :::image type="content" source="media/functions-create-first-function-arm/choose-publish-target-visual-studio.png" alt-text="Choose an existing publish target":::

1. Choose your **Subscription**, expand the resource group, select your function app, and select **OK**.

1. After the publish completes, copy the **Site URL**.

    :::image type="content" source="media/functions-create-first-function-arm/publish-summary-site-url.png" alt-text="Copy the site URL from the publish summary":::

1. Append the path `/api/<FUNCTION_NAME>?name=Functions`, where `<FUNCTION_NAME>` is the name of your function. The URL that calls your HTTP trigger function is in the following format:

    `http://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?name=Functions`

You use this URL to test your HTTP trigger function running in Azure.

# [Command line](#tab/command-line)

To publish your local code to a function app in Azure, use the `publish` command:

```cmd
func azure functionapp publish <FUNCTION_APP_NAME>
```

In this example, replace `<FUNCTION_APP_NAME>` with the name of your function app. You may need to sign in again by using `az login`.

In the output, copy the URL of the HTTP trigger. You use this to test your function running in Azure.

---

### Invoke the function on Azure

Paste the URL you copied for the HTTP request into your browser's address bar, make sure that the `name` query string as `?name=Functions` has been appended to the end of this URL, and then execute the request.

You should see a response like:

<pre>Hello Functions!</pre>

## Clean up resources

If you continue to the next step and add an Azure Storage queue output binding, keep all your resources in place as you'll build on what you've already done.

Otherwise, if you no longer need the resources, delete the resource group using the following command:

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

Now that you've publish your first function, learn more by adding an output binding to your function.

# [Visual Studio Code](#tab/visual-studio-code)

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md)

# [Visual Studio](#tab/visual-studio)

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs.md)

# [Command line](#tab/command-line)

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md)

---
