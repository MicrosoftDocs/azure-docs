---
title: Tutorial - Trigger container group by Azure function
description: Create an HTTP-triggered, serverless PowerShell function to automate creation of Azure container instances
ms.topic: tutorial
ms.date: 09/20/2019
ms.custom: 
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

> [!IMPORTANT]
> PowerShell for Azure Functions is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Prerequisites

See [Create your first function in Azure](/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-powershell#configure-your-environment) for prerequisites to install and use Visual Studio Code with the Azure Functions on your OS.

Some steps in this article use the Azure CLI. You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete these steps. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create a basic PowerShell function

Follow steps in [Create your first PowerShell function in Azure](../azure-functions/functions-create-first-function-powershell.md) to create a PowerShell function using the HTTP Trigger template. Use the default Azure function name **HttpTrigger**. As shown in the quickstart, test the function locally, and publish the project to a function app in Azure. This example is a basic HTTP-triggered function that returns a text string. In later steps in this article, you modify the function to create a container group.

This article assumes you publish the project using the name *myfunctionapp*, in an Azure resource group automatically named according to the function app name (also *myfunctionapp*). Substitute your unique function app name and resource group name in later steps.

## Enable an Azure-managed identity in the function app

Now enable a system-assigned [managed identity](../app-service/overview-managed-identity.md?toc=/azure/azure-functions/toc.json#add-a-system-assigned-identity) in your function app. The PowerShell host running the app can automatically authenticate using this identity, enabling functions to take actions on Azure services to which the identity has been granted access. In this tutorial, you grant the managed identity permissions to create resources in the function app's resource group. 

First use the [az group show][az-group-show] command to get the ID of the function app's resource group and store it in an environment variable. This example assumes you run the command in a Bash shell.

```azurecli
rgID=$(az group show --name myfunctionapp --query id --output tsv)
```

Run [az functionapp identity app assign][az-functionapp-identity-app-assign] to assign a local identity to the function app and assign a contributor role to the resource group. This role allows the identity to create additional resources such as container groups in the resource group.

```azurecli
az functionapp identity assign \
  --name myfunctionapp \
  --resource-group myfunctionapp \
  --role contributor --scope $rgID
```

## Modify HttpTrigger function

Modify the PowerShell code for the **HttpTrigger** function to create a container group. In file `run.ps1` for the function, find the following code block. This code displays a name value, if one is passed as a query string in the function URL:

```powershell
[...]
if ($name) {
    $status = [HttpStatusCode]::OK
    $body = "Hello $name"
}
[...]
```

Replace this code with the following example block. Here, if a name value is passed in the query string, it is used to name and create a container group using the [New-AzContainerGroup][new-azcontainergroup] cmdlet. Make sure to replace the resource group name *myfunctionapp* with the name of the resource group for your function app:

```powershell
[...]
if ($name) {
    $status = [HttpStatusCode]::OK
    New-AzContainerGroup -ResourceGroupName myfunctionapp -Name $name `
        -Image alpine -OsType Linux `
        -Command "echo 'Hello from an Azure container instance triggered by an Azure function'" `
        -RestartPolicy Never
    $body = "Started container group $name"
}
[...]
```

This example creates a container group consisting of a single container instance running the `alpine` image. The container runs a single `echo` command and then terminates. In a real-world example, you might trigger creation of one or more container groups for running a batch job.
 
## Test function app locally

Ensure that the function runs properly locally before republishing the function app project to Azure. As shown in the [PowerShell quickstart](../azure-functions/functions-create-first-function-powershell.md), insert a local breakpoint in the PowerShell script and a `Wait-Debugger` call above it. For debugging guidance, see [Debug PowerShell Azure Functions locally](../azure-functions/functions-debug-powershell-local.md).


## Republish Azure function app

After you've verified that the function runs correctly on your local computer, it's time to republish the project to the existing function app in Azure.

> [!NOTE]
> Remember to remove any calls to `Wait-Debugger` before you publish your functions to Azure.

1. In Visual Studio Code, open the Command Palette. Search for and select `Azure Functions: Deploy to function app...`.
1. Select the current working folder to zip and deploy.
1. Select the subscription and then the name of the existing function app (*myfunctionapp*). Confirm that you want to overwrite the previous deployment.

A notification is displayed after your function app is created and the deployment package is applied. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you updated.

## Run the function in Azure

After the deployment completes successfully, get the function URL. For example, use the **Azure: Functions** area in Visual Studio code to copy the **HttpTrigger** function URL, or get the function URL in the [Azure portal](../azure-functions/functions-create-first-azure-function.md#test-the-function).

The function URL includes a unique code and is of the form:

```
https://myfunctionapp.azurewebsites.net/api/HttpTrigger?code=bmF/GljyfFWISqO0GngDPCtCQF4meRcBiHEoaQGeRv/Srx6dRcrk2M==
```

### Run function without passing a name

As a first test, run the `curl` command and pass the function URL without appending a `name` query string. Make sure to include your function's unique code.

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
< date: Mon, 05 Aug 2019 22:08:15 GMT
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
< date: Mon, 05 Aug 2019 22:15:30 GMT
< 
* Connection #0 to host myfunctionapp.azurewebsites.net left intact
Started container group mycontainergroup
```

Verify that the container ran with the [az container logs][az-container-logs] command:

```azurecli
az container logs --resource-group myfunctionapp --name mycontainergroup
```

Sample output:

```console
Hello from an Azure container instance triggered by an Azure function
```

## Clean up resources

If you no longer need any of the resources you created in this tutorial, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the container registry you created, as well as the running container, and all related resources.

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
