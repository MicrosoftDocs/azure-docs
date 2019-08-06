---
title: Tutorial - Azure function trigger for Azure container instances
description: Create an HTTP-triggered serverless PowerShell function to automate creation Azure container instances
services: container-instances
author: dlepow
manager: gwallace

ms.service: container-instances
ms.topic: tutorial
ms.date: 08/06/2019
ms.author: danlep
ms.custom: 
---

# Tutorial: Use an HTTP-triggered Azure function to create a container group

[Azure Functions](../azure-functions/functions-overview.md) is a serverless compute service that can run scripts or code in response to a variety of events, such as an HTTP request or a message in an Azure Storage queue.

In this tutorial, you create an Azure function that takes an HTTP request and triggers deployment of an Azure container instance. This example shows the basics of using Azure Functions to automatically create resources in Azure Container Instances. Modify or extend the example for more complex scenarios or other event triggers. 

You learn how to:

> [!div class="checklist"]
> * Use the [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to create a basic HTTP-triggered PowerShell function locally. Then, deploy it to a function app in Azure.
> * Enable an identity in the function app and give it permissions to create Azure resources.
> * Modify the PowerShell function code to automate deployment of a [container group](container-instances-container-groups.md).
> * Verify the HTTP-triggered deployment of a container instance.

## Prerequisites

See [Create your first PowerShell function in Azure](../azure-functions/functions-create-first-function-powershell.md) for prerequisites to install and use the Azure Functions extension for Visual Studio Code on your OS.

Some steps in this article use the Azure CLI. You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete these steps. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a simple PowerShell function

Follow steps in [Create your first PowerShell function in Azure](../azure-functions/functions-create-first-function-powershell.md) to create a PowerShell function using the HTTP Trigger template, run it locally, and publish the project to a function app in Azure. Use the default Azure function name **HttpTrigger**. This example is a simple HTTP-triggered function that returns some text. In later steps in this article, you modify the function to create a container group.

This article assumes you publish the project using the name *myfunctionapp*, in an Azure resource group automatically named according to the function app name (also *myfunctionapp*). Substitute your unique function app name and resource group name in later steps.



## Enable an Azure-managed identity in the function app

Now enable a system-assigned [managed identity](../app-service/overview-managed-identity.md?toc=/azure/azure-functions/toc.json#adding-a-system-assigned-identity) in your function app. By enabling a managed identity for the function app, the PowerShell host can automatically authenticate using this identity, giving functions permission to take actions on Azure services that the managed identity has been granted access. In this tutorial, you grant the identity permissions to create resources in the function app's resource group. 

First use the [az group show][az-group-show] command to get the Id of the function app's resource group and store it in an environment variable. This example assumes you run the command in a Bash shell.

```azurecli
rgId=$(az group show --name myfunctionapp --query id --output tsv)
```

Run [az functionapp identity app assign][az-functionapp-identity-app-assign] to assign a local identity to the function app and assign a contributor role to the resource group.

```azurecli
az functionapp identity assign --name danlep0805 --resource-group danlep0805 --role contributor --scope $rgId
```

## Update HttpTrigger function code

Update the PowerShell code for your **HttpTrigger** function to create a container group. In file `run.ps1` for the function, find the following code block which is used to display a name value passed as a query string in the function URL:

```powershell
...
if ($name) {
    $status = [HttpStatusCode]::OK
    $body = "Hello $name"
}
...
```

Replace this code with the following code. Here, the name value passed in the query string is used to name a new container group. The group is created using the [New-AzContainerGroup][new-azcontainergroup] cmdlet. Make sure to replace the resource group name *myfunctionapp* with the name of the resource group for your function app:

```powershell
if ($name) {
    $status = [HttpStatusCode]::OK
    New-AzContainerGroup -ResourceGroupName myfunctionapp -Name $name `
        -Image alpine -OsType Linux `
        -Command "echo 'Hello from an Azure container instance triggered by an Azure function'" `
        -RestartPolicy Never
    $body = "Started container group $name"
}
...
```

## Test function app locally

As in the PowerShell quickstart, insert a local breakpoint in the PowerShell script and a `Wait-Debugger` call above it. Ensure that the code runs properly locally before republishing to Azure. For debugging guidance, see [Debug PowerShell Azure Functions locally](../azure/azure-functions/functions-debug-powershell-local.md).


## Update Azure function app deployment

After you've verified that the function runs correctly on your local computer, it's time to publish the project to the existing Function app in Azure.

> [!NOTE]
> Remember to remove any calls to `Wait-Debugger` before you publish your functions to Azure.

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Deploy to function app...`.
2. Select the current working folder to zip and deploy
1. Select the subscription and then the existing function app (*danlep0805*). Confirm that you want to overwrite the previous deployment.

## Verify the deployment

After the deployment completes successfully, get the function URL from the deployment output (can we get this programmatically somehow?).

### Test trigger without passing a name

```bash
curl --verbose "https://danlep0805.azurewebsites.net/api/HttpTrigger?code=alG/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrj3A=="
```

Output:

```
[...]
> GET /api/HttpTrigger?code=alG/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrj3A== HTTP/2
> Host: danlep0805.azurewebsites.net
> User-Agent: curl/7.54.0
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
< HTTP/2 400 
< content-length: 62
< content-type: text/plain; charset=utf-8
< date: Mon, 05 Aug 2019 22:08:15 GMT
< 
* Connection #0 to host danlep0805.azurewebsites.net left intact
Please pass a name on the query string or in the request body.
```

### Test trigger and pass a name of a container group

Passing the name mycontainergroup:

```bash
curl --verbose "https://danlep0805.azurewebsites.net/api/HttpTrigger?code=alG/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrj3A==&name=mycontainergroup"
```

Output:

```
[...]
> GET /api/HttpTrigger?code=alG/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrj3A==&name=tada HTTP/2
> Host: danlep0805.azurewebsites.net
> User-Agent: curl/7.54.0
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
< HTTP/2 200 
< content-length: 28
< content-type: text/plain; charset=utf-8
< date: Mon, 05 Aug 2019 22:15:30 GMT
< 
* Connection #0 to host danlep0805.azurewebsites.net left intact
Started container group mycontainergroup
```


Verify that the container ran with the `az container logs` command:

```azurecli

az container log --resource-group danlep0805 --name mycontainergroup
```

Sample output:

```console
Hello from an Azure container instance triggered by an Azure function
```


## Clean up resources

If you no longer need any of the resources you created in this tutorial series, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the container registry you created, as well as the running container, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you... The following steps were completed:

> [!div class="checklist"]
> * D

You can use an HTTP trigger to build serverless APIs and respond to webhooks. For more information see [Azure Functions HTTP triggers and bindings](../azure-functions/functions-bindings-http-webhook.md).

See the Azure Functions documentation for detailed guidance on creating Azure functions and publishing a functions project to Azure. 

Adding a system-assigned identity to a function: https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?toc=%2fazure%2fazure-functions%2ftoc.json#adding-a-system-

<!-- IMAGES -->


<!-- LINKS - external -->


<!-- LINKS - internal -->

[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-show]: /cli/azure/group#az-group-show
[az-functionapp-identity-app-assign]: /cli/azure/functionapp/identity#az-functionapp-identity-assign
[new-azcontainergroup]: /powershell/module/az.containerinstance/new-azcontainergroup
