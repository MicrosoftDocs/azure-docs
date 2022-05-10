---
title: 'Tutorial: Communication between microservices'
description: Learn how to communicate between microservices deployed in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: tutorial
ms.date: 04/12/2022
ms.author: cshoe
zone_pivot_groups: container-apps-image-build-type
---

# Tutorial: Communication between microservices in Azure Container Apps Preview

This tutorial builds on the app deployed in the [Deploy your code to Azure Container Apps](./quickstart-code-to-cloud.md) article and adds a front end microservice to the container app. In this article, you learn how to enable communication between different microservices.

The following screenshot shows the UI application added in this article.

:::image type="content" source="media/communicate-between-microservices/azure-container-apps-album-ui.png" alt-text="Screenshot of album list UI microservice.":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Deploy a front-end application to Azure Container Apps
> * Link the front-end app to the API endpoint deployed in the previous quickstart
> * Verify both container apps communicate together

## Prerequisites

This article directly follows the final steps from [the "code to cloud" quickstart](./quickstart-code-to-cloud.md). See the prerequisites from [Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md#prerequisites) to continue.

## Setup

If you still have all the variables defined and authenticated sessions in your shell from the quickstart, you can skip the following steps and go directly to the [Prepare the GitHub repository](#prepare-the-github-repository) section.

[!INCLUDE [container-apps-code-to-cloud-setup.md](../../includes/container-apps-code-to-cloud-setup.md)]

Sign in to the Azure CLI.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzAccount
```

---

::: zone pivot="docker-local"

# [Bash](#tab/bash)

```azurecli
az acr login --name $ACR_NAME
```

# [PowerShell](#tab/powershell)

```powershell
az acr login --name $ACR_NAME
```

---

::: zone-end

# [Bash](#tab/bash)

Next, store your ACR password in an environment variable.

```azurecli
ACR_PASSWORD=$(az acr credential show -n $ACR_NAME --query passwords[0].value)
```

# [PowerShell](#tab/powershell)

Next, store your ACR password in an environment variable.

```powershell
$ACR_PASSWORD=(Get-AzContainerRegistryCredential `
 -ResourceGroupName $RESOURCE_GROUP `
 -Name $ACR_NAME | Select -Property Password).Password
```

---

## Prepare the GitHub repository

1. In a new browser tab, navigate to the [repository for the UI application](https://github.com/azure-samples/containerapps-albumui) and fork the repository.

    Select the **Fork** button at the top of the page to fork the repo to your account. Follow the prompts from GitHub to fork the repository and return here once the operation is complete.

1. If your terminal is still in the *code-to-cloud\src* folder, back out to the parent folder.

    ```console
    cd ../..
    ```

1. Use the following git command to clone your forked repo into the *code-to-cloud-ui* folder:

    ```git
    git clone https://github.com/$GITHUB_USERNAME/containerapps-albumui.git code-to-cloud-ui
    ```

    > [!NOTE]
    > If the `clone` command fails, then you probably forgot to first fork the repository.

1. Next, change the directory into the root of the cloned repo.

    ```console
    cd code-to-cloud-ui/src
    ```

## Build the frontend application

1. Create the following variables to help you deploy your new container app.

    # [Bash](#tab/bash)

    ```bash
    FRONTEND_NAME=albumapp-ui
    CONTAINER_IMAGE_NAME=$ACR_NAME.azurecr.io/$FRONTEND_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $FRONTEND_NAME="albumapp-ui"
    $CONTAINER_IMAGE_NAME="$ACR_NAME.azurecr.io/$FRONTEND_NAME"
    ```

    ---

::: zone pivot="acr-remote"

1. You can build your Dockerfile with the ACR build command.

    # [Bash](#tab/bash)

    ```azurecli
    az acr build --registry $ACR_NAME --image $CONTAINER_IMAGE_NAME .
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az acr build --registry $ACR_NAME --image $CONTAINER_IMAGE_NAME .
    ```

    ---

    Output from the `az acr build` command shows the upload progress of the source code to Azure and the details of the `docker build` operation.

1. To verify that your image is now available in ACR, run the command below.

    # [Bash](#tab/bash)

    ```azurecli
    az acr manifest list-metadata \
      --registry $ACR_NAME \
      --name $FRONTEND_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    Get-AzContainerRegistryManifest `
      -RegistryName $ACR_NAME `
      -Repository $CONTAINER_IMAGE_NAME
    ```

::: zone-end

::: zone pivot="docker-local"

1. The following command builds the image using the Dockerfile for the UI application. The `.` represents the current build context, so run this command at the root of the repository where the Dockerfile is located.

    # [Bash](#tab/bash)

    ```azurecli
    docker build -t $CONTAINER_IMAGE_NAME .
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker build -t $CONTAINER_IMAGE_NAME .
    ```

    ---

1. If your image was successfully built, it's listed in the output of the following command:

    # [Bash](#tab/bash)

    ```azurecli
    docker images
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker images
    ```

    ---

## Push the Docker image to your ACR registry

1. First, sign in to your Azure Container Registry.

    # [Bash](#tab/bash)

    ```azurecli
    az acr login --name $ACR_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az acr login --name $ACR_NAME
    ```

    ---

1. Now, push the image to your registry.

    # [Bash](#tab/bash)

    ```azurecli
    docker push $CONTAINER_IMAGE_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker push $CONTAINER_IMAGE_NAME
    ```

    ---

::: zone-end

## Communicate between container apps

In the previous quickstart, the album API was deployed by creating a container app and enabling external ingress. Making the container app set to *external* meant that the endpoint's URL is publicly available.

Now you can configure the front-end application to call the API endpoint by going through the following steps:

* Query the API application for its fully qualified domain name (FQDN)
* Pass the API FQDN to `az containerapp create` so the UI app can use the API endpoint location.

The [UI application](https://github.com/Azure-Samples/containerapps-albumui) uses this location during as it sets up the reference to the album API. The following code listing is an excerpt of the code used in the *routes > index.js* file.

```javascript
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  params: {},
  timeout: process.env.TIMEOUT || 5000,
});
```

Notice how the the `baseURL` property get its value from the `API_BASE_URL` environment variable.

Next, you'll query for the API endpoint address to pass to the UI application when you create a the new container app instance.

# [Bash](#tab/bash)

```azurecli
API_ENDPOINT=$(az containerapp show --resource-group $RESOURCE_GROUP --name $API_NAME --query properties.configuration.ingress.fqdn -o tsv)
```

# [PowerShell](#tab/powershell)

```powershell
$API_ENDPOINT=$(az containerapp show --resource-group $RESOURCE_GROUP --name $API_NAME --query properties.configuration.ingress.fqdn -o tsv)
```

---

Now that you have set the `API_ENDPOINT` variable with the FQDN of the API endpoint, you can now pass it to the UI application to link the two together.

## Deploy front-end application

Create and deploy your container app with the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name $FRONTEND_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $CONTAINER_IMAGE_NAME \
  --target-port 3000 \
  --env-vars API_BASE_URL=https://$API_ENDPOINT \
  --ingress 'external' \
  --registry-password $ACR_PASSWORD \
  --registry-username $ACR_NAME \
  --registry-server $ACR_NAME.azurecr.io \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name $FRONTEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --environment $ENVIRONMENT `
  --image $API_NAME `
  --env-vars API_BASE_URL=https://$API_ENDPOINT `
  --target-port 3000 `
  --ingress 'external' `
  --registry-password $ACR_PASSWORD `
  --registry-username $ACR_NAME `
  --registry-server $ACR_NAME.azurecr.io `
  --query configuration.ingress.fqdn
```

---

By adding the argument `--env-vars "API_BASE_URL=https://$API_ENDPOINT"` to `az containerapp create`, you define an environment variable for your front-end application. With this syntax, the environment variable named `API_BASE_URL` is set to the API's FQDN.

## View website

The `az containerapp create` CLI command returns the fully qualified domain name (FQDN) of your new container app. Open this location in a browser, and you're presented with a web application that resembles the following screenshot.

:::image type="content" source="media/communicate-between-microservices/azure-container-apps-album-ui.png" alt-text="Screenshot of album list UI microservice.":::

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)