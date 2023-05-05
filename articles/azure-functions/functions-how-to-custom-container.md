---
title: Working with custom containers and Azure Functions
description: Learn how to work with your Azure Functions code published as a custom Linux image.
ms.date: 05/05/2023
ms.topic: how-to
zone_pivot_groups: programming-languages-set-functions
---

# Working with custom containers and Azure Functions

This article shows you how to work with function apps deployed as custom Linux containers. To learn more about container deployments of Azure Functions, see [Azure Functions Linux container deployment](./functions-containers.md). 

Unless otherwise noted, the content applies to all function apps running in custom containers. 

## Enable continuous deployment to Azure

You can enable Azure Functions to automatically update your deployment of an image whenever you update the image in the registry.

1. Use the following command to enable continuous deployment and to get the webhook URL:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp deployment container config --enable-cd --query CI_CD_URL --output tsv --name <APP_NAME> --resource-group AzureFunctionsContainers-rg
    ```
    
    The [`az functionapp deployment container config`](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-config) command enables continuous deployment and returns the deployment webhook URL. You can retrieve this URL at any later time by using the [`az functionapp deployment container show-cd-url`](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-show-cd-url) command.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    Update-AzFunctionAppSetting -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -AppSetting @{"DOCKER_ENABLE_CI" = "true"}
    Get-AzWebAppContainerContinuousDeploymentUrl -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg
    ```
    
    The `DOCKER_ENABLE_CI` application setting controls whether continuous deployment is enabled from the container repository. The [`Get-AzWebAppContainerContinuousDeploymentUrl`](/powershell/module/az.websites/get-azwebappcontainercontinuousdeploymenturl) cmdlet returns the URL of the deployment webhook.

    ---    

    As before, replace `<APP_NAME>` with your function app name.

1. Copy the deployment webhook URL to the clipboard.

1. Open [Docker Hub](https://hub.docker.com/), sign in, and select **Repositories** on the navigation bar. Locate and select the image, select the **Webhooks** tab, specify a **Webhook name**, paste your URL in **Webhook URL**, and then select **Create**.

    :::image type="content" source="./media/functions-create-function-linux-custom-image/dockerhub-set-continuous-webhook.png" alt-text="Screenshot showing how to add the webhook in your Docker Hub window.":::  

1. With the webhook set, Azure Functions redeploys your image whenever you update it in Docker Hub.

## Enable SSH connections

SSH enables secure communication between a container and a client. With SSH enabled, you can connect to your container using App Service Advanced Tools (Kudu). For easy connection to your container using SSH, Azure Functions provides a base image that has SSH already enabled. You only need to edit your *Dockerfile*, then rebuild, and redeploy the image. You can then connect to the container through the Advanced Tools (Kudu).

1. In your *Dockerfile*, append the string `-appservice` to the base image in your `FROM` instruction, as in the following example:
 
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/node:4-node18-appservice
    ```

    This example uses the SSH-enabled version of the Node.js version 18 base image. Visit the [Azure Functions base image repos](https://mcr.microsoft.com/en-us/catalog?search=functions) to verify that you are using the latest version of the SSH-enabled base image.
    
1. Rebuild the image by using the `docker build` command, replace the `<docker_id>` with your Docker Hub account ID, as in the following example.

    ```console
    docker build --tag <docker_id>/azurefunctionsimage:v1.0.0 .
    ```

1. Push the updated image to Docker Hub, which should take considerably less time than the first push. Only the updated segments of the image need to be uploaded now.

    ```console
    docker push <docker_id>/azurefunctionsimage:v1.0.0
    ```
    
1. Azure Functions automatically redeploys the image to your functions app; the process takes place in less than a minute.

1. In a browser, open `https://<app_name>.scm.azurewebsites.net/` and replace `<app_name>` with your unique name. This URL is the Advanced Tools (Kudu) endpoint for your function app container.

1. Sign in to your Azure account, and then select the **SSH** to establish a connection with the container. Connecting might take a few moments if Azure is still updating the container image.

1. After a connection is established with your container, run the `top` command to view the currently running processes.

    :::image type="content" source="media/functions-create-function-linux-custom-image/linux-custom-kudu-ssh-top.png" alt-text="Screenshot that shows Linux top command running in an SSH session.":::

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Write to Azure Queue Storage

Azure Functions lets you connect your functions to other Azure services and resources without having to write your own integration code. These *bindings*, which represent both input and output, are declared within the function definition. Data from bindings is provided to the function as parameters. A *trigger* is a special type of input binding. Although a function has only one trigger, it can have multiple input and output bindings. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

This section shows you how to integrate your function with an Azure Queue Storage. The output binding that you add to this function writes data from an HTTP request to a message in the queue.

[!INCLUDE [functions-cli-get-storage-connection](../../includes/functions-cli-get-storage-connection.md)]
::: zone-end

::: zone pivot="programming-language-csharp"  
## Register binding extensions
::: zone-end 

[!INCLUDE [functions-register-storage-binding-extension-csharp](../../includes/functions-register-storage-binding-extension-csharp.md)]

[!INCLUDE [functions-add-output-binding-cli](../../includes/functions-add-output-binding-cli.md)]

::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-add-storage-binding-csharp-library](../../includes/functions-add-storage-binding-csharp-library.md)]  
::: zone-end  
::: zone pivot="programming-language-java" 
[!INCLUDE [functions-add-output-binding-java-cli](../../includes/functions-add-output-binding-java-cli.md)]
::: zone-end  

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Add code to use the output binding

With the queue binding defined, you can now update your function to write messages to the queue using the binding parameter.
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [functions-add-output-binding-python](../../includes/functions-add-output-binding-python.md)]
::: zone-end  

::: zone pivot="programming-language-javascript"  
[!INCLUDE [functions-add-output-binding-js](../../includes/functions-add-output-binding-js.md)]
::: zone-end  

::: zone pivot="programming-language-typescript"  
[!INCLUDE [functions-add-output-binding-ts](../../includes/functions-add-output-binding-ts.md)]
::: zone-end  

::: zone pivot="programming-language-powershell"  
[!INCLUDE [functions-add-output-binding-powershell](../../includes/functions-add-output-binding-powershell.md)]  
::: zone-end

::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-add-storage-binding-csharp-library-code](../../includes/functions-add-storage-binding-csharp-library-code.md)]
::: zone-end 

::: zone pivot="programming-language-java"
[!INCLUDE [functions-add-output-binding-java-code](../../includes/functions-add-output-binding-java-code.md)]

[!INCLUDE [functions-add-output-binding-java-test-cli](../../includes/functions-add-output-binding-java-test-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"
## Update the image in the registry

1. In the root folder, run `docker build` again, and this time update the version in the tag to `v1.0.1`. As before, replace `<docker_id>` with your Docker Hub account ID.

    ```console
    docker build --tag <docker_id>/azurefunctionsimage:v1.0.1 .
    ```

1. Push the updated image back to the repository with `docker push`.

    ```console
    docker push <docker_id>/azurefunctionsimage:v1.0.1
    ```

1. Because you configured continuous delivery, updating the image in the registry again automatically updates your function app in Azure.

## View the message in the Azure Storage queue

In a browser, use the same URL as before to invoke your function. The browser must display the same response as before, because you didn't modify that part of the function code. The added code, however, wrote a message using the `name` URL parameter to the `outqueue` storage queue.

[!INCLUDE [functions-add-output-binding-view-queue-cli](../../includes/functions-add-output-binding-view-queue-cli.md)]

::: zone-end

## Next steps

The following articles provide more information about deploying and managing custom containers:

+ [Azure Functions Linux container deployment](./functions-containers.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)
