---
title: Tutorial - Trigger container group by Azure function
description: Create an HTTP-triggered, serverless PowerShell function to automate creation of Azure container instances
ms.topic: tutorial
ms.date: 06/08/2020
ms.custom: 
---

# Tutorial: Use an HTTP-triggered Azure function to create a container group

[Azure Functions](../azure-functions/functions-overview.md) is a serverless compute service that can run scripts or code in response to a variety of events, such as an HTTP request, a timer, or a message in an Azure Storage queue.

In this tutorial, you create an Azure function that takes an HTTP request and triggers deployment of a [container group](container-instances-container-groups.md). This example shows the basics of using Azure Functions to automatically create resources in Azure Container Instances. Modify or extend the example for more complex scenarios or other event triggers. 

You learn how to:

> [!div class="checklist"]
> * Create a basic HTTP-triggered PowerShell function.
> * Enable an identity in the function app and give it permissions to create Azure resources.
> * Modify and republish the PowerShell function to automate deployment of a single-container container group.
> * Verify the HTTP-triggered deployment of the container.

## Prerequisites

See [Quickstart: Create a function in Azure that responds to HTTP requests](../azure-functions/functions-create-first-azure-function-azure-cli.md?tabs=bash%2Cbrowser&pivots=programming-language-powershell) for prerequisites to use command-line tools to create a PowerShell function on your OS.

Some steps in this article use the Azure CLI. You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete these steps. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a basic PowerShell function

Follow the steps in [Quickstart: Create a function in Azure that responds to HTTP requests](../azure-functions/functions-create-first-azure-function-azure-cli.md?tabs=bash%2Cbrowser&pivots=programming-language-powershell) to create a function project and a PowerShell function using the HTTP Trigger template. Use the default Azure function name **HttpTrigger**. 

As shown in the quickstart, test the function locally, and then use the Azure CLI to create resources and publish the project to a function app in Azure. The example is a basic HTTP-triggered function that returns a text string. In later steps in this article, you modify the function to create a container group.

This tutorial assumes you publish the project using the name *myfunctionapp*, in an Azure resource group named *myfunctionapp-rg*. Substitute your unique function app name and resource group name in later steps.

## Enable an Azure-managed identity in the function app

Enable a system-assigned [managed identity](../app-service/overview-managed-identity.md?toc=/azure/azure-functions/toc.json#add-a-system-assigned-identity) in your function app. The PowerShell host running the app can automatically authenticate using this identity, enabling functions to take actions on Azure services to which the identity has been granted access. In this tutorial, you grant the managed identity permissions to create resources in the function app's resource group. 

First use the [az group show][az-group-show] command to get the ID of the function app's resource group and store it in an environment variable. This example assumes you run the command in a Bash shell.

```azurecli
rgID=$(az group show --name myfunctionapp-rg --query id --output tsv)
```

Run [az functionapp identity app assign][az-functionapp-identity-app-assign] to assign a local identity to the function app and assign it a contributor role to the resource group. This role allows the identity to create additional resources such as container groups in the resource group.

```azurecli
az functionapp identity assign \
  --name myfunctionapp \
  --resource-group myfunctionapp-rg \
  --role contributor --scope $rgID
```

## Update function app 

Update the function app to use an HTTP trigger to run the [New-AzContainerGroup][new-azcontainergroup] cmdlet. In response to the trigger, the function creates a new Azure container group.

### Update dependencies

The function app you created is set up with [managed dependencies](../azure-functions/functions-reference-powershell.md#dependency-management) enabled by default. With dependency management enabled, the `requirements.psd1` file in the project automatically downloads required PowerShell modules. To use cmdlets in  the Azure PowerShell (Az) module, update the `requirements.pds1` file to contain the following content:

```
@{
    Az = '2.*'
}
```

### Modify HttpTrigger function

Modify the PowerShell code for the **HttpTrigger** function to create a container group. In file `run.ps1` for the function, find the following code block. This code displays a name value, if one is passed as a query string in the function URL:

```powershell
[...]
if ($name) {
    $status = [HttpStatusCode]::OK
    $body = "Hello $name"
}
[...]
```

Replace this code with the following example block. Here, if a name value is passed in the query string, it is used to name and create a container group using the [New-AzContainerGroup][new-azcontainergroup] cmdlet. Make sure to replace the resource group name *myfunctionapp-rg* with the name of the resource group for your function app:

```powershell
[...]
if ($name) {
    $status = [HttpStatusCode]::OK
    New-AzContainerGroup -ResourceGroupName myfunctionapp-rg -Name $name `
        -Image alpine -OsType Linux `
        -Command "echo 'Hello from an Azure container instance triggered by an Azure function'" `
        -RestartPolicy Never
    $body = "Started container group $name"
}
[...]
```

This example creates a container group consisting of a single container instance running the `alpine` image. The container runs a single `echo` command and then terminates. In a real-world example, you might trigger creation of one or more container groups for running a batch job.

## Republish Azure function app

1. Run `func start` to ensure that the function [runs locally](../azure-functions/functions-create-first-azure-function-azure-cli.md?tabs=bash%2Cbrowser&pivots=programming-language-powershell#run-the-function-locally) on your local computer. Because the function triggers creation of Azure resources, it doesn't create the resources when you run locally. To debug the function, see [Debug PowerShell Azure Functions locally](../azure-functions/functions-debug-powershell-local/azure-functions/functions-debug-powershell-local.md).

1. Run `func azure functionapp publish` to [redeploy the project](../azure-functions/functions-create-first-azure-function-azure-cli.md?tabs=bash%2Cbrowser&pivots=programming-language-powershell#deploy-the-function-project-to-azure) to Azure.

```
func azure functionapp publish myfunctionapp
```

In the command output, note the **httpTrigger** function URL. The function URL includes a unique code and is of the form:

```
https://myfunctionapp.azurewebsites.net/api/HttpTrigger?code=bmF/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrk2M==
```

### Run function without passing a name

As a first test, run the `curl` command and pass the function URL without appending a `name` query string. Make sure to include your function's unique code. For example:

```bash
curl --verbose "https://myfunctionapp.azurewebsites.net/api/HttpTrigger?code=bmF/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrk2M=="
```

The function returns status code 400 and the text `Please pass a name on the query string or in the request body`:

```
[...]
> GET /api/HttpTrigger?code=bmF/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrk2M== HTTP/2
> Host: myfunctionapp.azurewebsites.net
> User-Agent: curl/7.54.0
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
< HTTP/2 400 
< content-length: 62
< content-type: text/plain; charset=utf-8
< date: Mon, 08 Jun 2020 19:08:15 GMT
< 
* Connection #0 to host myfunctionapp.azurewebsites.net left intact
Please pass a name on the query string or in the request body.
```

### Run function and pass the name of a container group

Now run the `curl` command by appending the name of a container group (*mycontainergroup*) as a query string `&name=mycontainergroup`:

```bash
curl --verbose "https://myfunctionapp.azurewebsites.net/api/HttpTrigger?code=bmF/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrk2M==&name=mycontainergroup"
```

The function returns status code 200 and triggers the creation of the container group:

```
[...]
> GET /api/HttpTrigger?ode=bmF/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrk2M==&name=mycontainergroup HTTP/2
> Host: myfunctionapp.azurewebsites.net
> User-Agent: curl/7.54.0
> Accept: */*
> 
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
< HTTP/2 200 
< content-length: 28
< content-type: text/plain; charset=utf-8
< date: Mon, 08 Jun 2020 19:15:30 GMT
< 
* Connection #0 to host myfunctionapp.azurewebsites.net left intact
Started container group mycontainergroup
```

Verify that the container ran with the [az container logs][az-container-logs] command:

```azurecli
az container logs \
  --resource-group myfunctionapp-rg \
  --name mycontainergroup
```

Sample output:

```console
Hello from an Azure container instance triggered by an Azure function
```

## Clean up resources

If you no longer need any of the resources you created in this tutorial, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the Azure function app, the container group, and all related resources.

```azurecli-interactive
az group delete --name myfunctionapp
```

## Next steps

In this tutorial, you created an Azure function that takes an HTTP request and triggers deployment of a container group. You learned how to:

> [!div class="checklist"]
> * Create a basic HTTP-triggered PowerShell function.
> * Enable an identity in the function app and give it permissions to create Azure resources.
> * Modify the PowerShell function code to automate deployment of a single-container container group.
> * Verify the HTTP-triggered deployment of the container.

For a detailed example to launch and monitor a containerized job, see the blog post [Event-Driven Serverless Containers with PowerShell Azure Functions and Azure Container Instances](https://dev.to/azure/event-driven-serverless-containers-with-powershell-azure-functions-and-azure-container-instances-e9b) and accompanying [code sample](https://github.com/anthonychu/functions-powershell-run-aci).

See the [Azure Functions documentation](/azure/azure-functions/) for detailed guidance on creating Azure functions and publishing a functions project. 

<!-- IMAGES -->


<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->

[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-show]: /cli/azure/group#az-group-show
[az-group-delete]: /cli/azure/group#az-group-delete
[az-functionapp-identity-app-assign]: /cli/azure/functionapp/identity#az-functionapp-identity-assign
[new-azcontainergroup]: /powershell/module/az.containerinstance/new-azcontainergroup
[az-container-logs]: /cli/azure/container#az-container-logs
