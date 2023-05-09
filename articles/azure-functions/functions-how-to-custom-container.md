---
title: Working with containers and Azure Functions
description: Learn how to work with your Azure Functions code published as a custom Linux image.
ms.date: 05/05/2023
ms.topic: how-to
---

# Working with containers and Azure Functions

This article shows you the support that Azure Functions provides for working with function apps deployed as containers. Unless otherwise noted, the content applies to all function apps running in containers, regardless of the Azure hosting environment. 

To learn more about deployments to Azure Container Apps, see [Azure Container Apps hosting of Azure Functions](./functions-container-apps-hosting.md). 

## Update an image in the registry

When you make changes to your functions code project, you need to rebuild the container locally and republish the updated image to your chosen container registry. The following command rebuilds the image from the root folder with an updated version number and pushed to your registry:    

# [Azure Container Registry](#tab/acr)

```console
az acr build --registry <REGISTRY_NAME> --image <LOGIN_SERVER>/azurefunctionsimage:v1.0.1 .
```

Replace `<REGISTRY_NAME>` with your Container Registry instance and `<LOGIN_SERVER>` with the login server name.

# [Docker Hub](#tab/docker)

```console
docker build --tag <DOCKER_ID> azurefunctionsimage:v1.0.1 .
docker push <DOCKER_ID> azurefunctionsimage:v1.0.1
```

Replace `<DOCKER_ID>` with your Docker Hub account ID.

---

At this point, you need to update the deployment to use the new image. You should also consider [enabling continuous deployment](#enable-continuous-deployment-to-azure).

## Work with images in Azure Functions

When your function app container is deployed from a registry, Functions maintains information about the source image. Use the following commands to get data about the image or change the deployment image used:

 +  [`az functionapp config container show`](/cli/azure/functionapp/config/container#az-functionapp-config-container-show): returns information about the image used for deployment. 
 +  [`az functionapp config container set`](/cli/azure/functionapp/config/container#az-functionapp-config-container-set): Change the image used for deployment.

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

    This example uses the SSH-enabled version of the Node.js version 18 base image. Visit the [Azure Functions base image repos](https://mcr.microsoft.com/en-us/catalog?search=functions) to verify that you're using the latest version of the SSH-enabled base image.
    
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

## Next steps

The following articles provide more information about deploying and managing containers:

+ [Azure Container Apps hosting of Azure Functions](./functions-container-apps-hosting.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)
