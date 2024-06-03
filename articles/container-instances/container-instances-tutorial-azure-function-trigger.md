---
title: Tutorial - Trigger container group by Azure function
description: Create an HTTP-triggered, serverless PowerShell function to automate creation of Azure Container Instances
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
ms.custom: devx-track-azurepowershell
---

# Tutorial: Use an HTTP-triggered Azure function to create a container group

[Azure Functions](../azure-functions/functions-overview.md) is a serverless compute service that can run scripts or code in response to a variety of events, such as an HTTP request, a timer, or a message in an Azure Storage queue.

In this tutorial, you create an Azure function that takes an HTTP request and triggers deployment of a [container group](container-instances-container-groups.md). This example shows the basics of using Azure Functions to automatically create resources in Azure Container Instances. Modify or extend the example for more complex scenarios or other event triggers.

You learn how to:

> [!div class="checklist"]
> * Use Visual Studio Code with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to create a basic HTTP-triggered PowerShell function.
> * Enable an identity in the function app and give it permissions to create Azure resources.
> * Modify and republish the PowerShell function to automate deployment of a single-container container group.
> * Verify the HTTP-triggered deployment of the container.

## Prerequisites

See [Create your first function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?pivots=programming-language-powershell#configure-your-environment) for prerequisites to install and use Visual Studio Code with the Azure Functions extension on your OS.

Additional steps in this article use Azure PowerShell. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install] and [Sign into Azure](/powershell/azure/get-started-azureps#sign-in-to-azure).

## Create a basic PowerShell function

Follow steps in [Create your first PowerShell function in Azure](../azure-functions/create-first-function-vs-code-csharp.md?pivots=programming-language-powershell) to create a PowerShell function using the HTTP Trigger template. Use the default Azure function name **HttpTrigger**. As shown in the quickstart, test the function locally, and publish the project to a function app in Azure. This example is a basic HTTP-triggered function that returns a text string. In later steps in this article, you modify the function to create a container group.

This article assumes you publish the project using the name *myfunctionapp*, in an Azure resource group automatically named according to the function app name (also *myfunctionapp*). Substitute your unique function app name and resource group name in later steps.

## Enable an Azure-managed identity in the function app

The following commands enable a system-assigned [managed identity](../app-service/overview-managed-identity.md?toc=/azure/azure-functions/toc.json#add-a-system-assigned-identity) in your function app. The PowerShell host running the app can automatically authenticate to Azure using this identity, enabling functions to take actions on Azure services to which the identity is granted access. In this tutorial, you grant the managed identity permissions to create resources in the function app's resource group.

[Add an identity](../app-service/overview-managed-identity.md?tabs=ps%2Cdotnet) to the function app:

```azurepowershell-interactive
Update-AzFunctionApp -Name myfunctionapp `
    -ResourceGroupName myfunctionapp `
    -IdentityType SystemAssigned
```

Assign the identity the contributor role scoped to the resource group:

```azurepowershell-interactive
$SP=(Get-AzADServicePrincipal -DisplayName myfunctionapp).Id
$RG=(Get-AzResourceGroup -Name myfunctionapp).ResourceId
New-AzRoleAssignment -ObjectId $SP -RoleDefinitionName "Contributor" -Scope $RG
```

## Modify HttpTrigger function

Modify the PowerShell code for the **HttpTrigger** function to create a container group. In file `run.ps1` for the function, find the following code block. This code displays a name value, if one is passed as a query string in the function URL:

```azurepowershell-interactive
[...]
if ($name) {
    $body = "Hello, $name. This HTTP triggered function executed successfully."
}
[...]
```

Replace this code with the following example block. Here, if a name value is passed in the query string, it's used to name and create a container group using the [New-AzContainerGroup][new-azcontainergroup] cmdlet. Make sure to replace the resource group name *myfunctionapp* with the name of the resource group for your function app:

```azurepowershell-interactive
[...]
if ($name) {
    New-AzContainerGroup -ResourceGroupName myfunctionapp -Name $name `
        -Image alpine -OsType Linux `
        -Command "echo 'Hello from an Azure container instance triggered by an Azure function'" `
        -RestartPolicy Never
    if ($?) {
        $body = "This HTTP triggered function executed successfully. Started container group $name"
    }
    else  {
        $body = "There was a problem starting the container group."
    }
[...]
```

This example creates a container group consisting of a single container instance running the `alpine` image. The container runs a single `echo` command and then terminates. In a real-world example, you might trigger creation of one or more container groups for running a batch job.

## Test function app locally

Ensure that the function runs locally before republishing the function app project to Azure. When run locally, the function doesn't create Azure resources. However, you can test the function flow with and without passing a name value in a query string. To debug the function, see [Debug PowerShell Azure Functions locally](../azure-functions/functions-debug-powershell-local.md).

## Republish Azure function app

After you've verified that the function runs locally, republish the project to the existing function app in Azure.

1. In Visual Studio Code, open the Command Palette. Search for and select `Azure Functions: Deploy to Function App...`.
1. Select the current working folder to zip and deploy.
1. Select the subscription and then the name of the existing function app (*myfunctionapp*). Confirm that you want to overwrite the previous deployment.

A notification is displayed after your function app is created and the deployment package is applied. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you updated.

## Run the function in Azure

After the deployment completes successfully, get the function URL. For example, use the **Azure: Functions** area in Visual Studio Code to copy the **HttpTrigger** function URL, or get the function URL in the [Azure portal](../azure-functions/functions-get-started.md).

The function URL is of the form:

```config
https://myfunctionapp.azurewebsites.net/api/HttpTrigger
```

### Run function without passing a name

As a first test, run the `curl` command and pass the function URL without appending a `name` query string.

```bash
curl --verbose "https://myfunctionapp.azurewebsites.net/api/HttpTrigger"
```

The function returns status code 200 and the text `This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response`:

```
[...]
> GET /api/HttpTrigger? HTTP/1.1
> Host: myfunctionapp.azurewebsites.net
> User-Agent: curl/7.64.1
> Accept: */*
>
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
< HTTP/1.1 200 OK
< Content-Length: 135
< Content-Type: text/plain; charset=utf-8
< Request-Context: appId=cid-v1:d0bd0123-f713-4579-8990-bb368a229c38
< Date: Wed, 10 Jun 2020 17:50:27 GMT
<
* Connection #0 to host myfunctionapp.azurewebsites.net left intact
This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.* Closing connection 0
```

### Run function and pass the name of a container group

Now run the `curl` command and append the name of a container group (*mycontainergroup*) as a query string `?name=mycontainergroup`:

```bash
curl --verbose "https://myfunctionapp.azurewebsites.net/api/HttpTrigger?name=mycontainergroup"
```

The function returns status code 200 and triggers the creation of the container group:

```
[...]
> GET /api/HttpTrigger1?name=mycontainergroup HTTP/1.1
> Host: myfunctionapp.azurewebsites.net
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Length: 92
< Content-Type: text/plain; charset=utf-8
< Request-Context: appId=cid-v1:d0bd0123-f713-4579-8990-bb368a229c38
< Date: Wed, 10 Jun 2020 17:54:31 GMT
<
* Connection #0 to host myfunctionapp.azurewebsites.net left intact
This HTTP triggered function executed successfully. Started container group mycontainergroup* Closing connection 0
```

Verify that the container ran with the [Get-AzContainerInstanceLog][get-azcontainerinstancelog] command:

```azurecli-interactive
Get-AzContainerInstanceLog -ResourceGroupName myfunctionapp `
  -ContainerGroupName mycontainergroup
```

Sample output:

```output
Hello from an Azure container instance triggered by an Azure function
```

## Clean up resources

If you no longer need any of the resources you created in this tutorial, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the function app you created, as well as the running container, and all related resources.

```azurecli-interactive
az group delete --name myfunctionapp
```

## Next steps

In this tutorial, you created an Azure function that takes an HTTP request and triggers deployment of a container group. You learned how to:

> [!div class="checklist"]
> * Use Visual Studio Code with the Azure Functions extension to create a basic HTTP-triggered PowerShell function.
> * Enable an identity in the function app and give it permissions to create Azure resources.
> * Modify the PowerShell function code to automate deployment of a single-container container group.
> * Verify the HTTP-triggered deployment of the container.

For a detailed example to launch and monitor a containerized job, see the blog post [Event-Driven Serverless Containers with PowerShell Azure Functions and Azure Container Instances](https://dev.to/azure/event-driven-serverless-containers-with-powershell-azure-functions-and-azure-container-instances-e9b) and accompanying [code sample](https://github.com/anthonychu/functions-powershell-run-aci).

See the [Azure Functions documentation](../azure-functions/index.yml) for detailed guidance on creating Azure functions and publishing a functions project.

<!-- IMAGES -->


<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[azure-powershell-install]: /powershell/azure/install-az-ps
[new-azcontainergroup]: /powershell/module/az.containerinstance/new-azcontainergroup
[get-azcontainerinstancelog]: /powershell/module/az.containerinstance/get-azcontainerinstancelog
