---
title: 'Tutorial: Communication between microservices in Azure Container Apps'
description: Learn how to communicate between microservices deployed in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: tutorial
ms.date: 05/13/2022
ms.author: cshoe
zone_pivot_groups: container-apps-image-build-type
---

# Tutorial: Communication between microservices in Azure Container Apps

Azure Container Apps exposes each container app through a domain name if [ingress](ingress.md) is enabled. Ingress endpoints for container apps within an external environment can be either publicly accessible or only available to other container apps in the same [environment](environment.md).

Once you know the fully qualified domain name for a given container app, you can make direct calls to the service from other container apps within the shared environment.

In this tutorial, you deploy a second container app that makes a direct service call to the API deployed in the [Deploy your code to Azure Container Apps](./quickstart-code-to-cloud.md) quickstart.

The following screenshot shows the UI microservice deploys to container apps at the end of this article.

:::image type="content" source="media/communicate-between-microservices/azure-container-apps-album-ui.png" alt-text="Screenshot of album list UI microservice.":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Deploy a front end application to Azure Container Apps
> * Link the front end app to the API endpoint deployed in the previous quickstart
> * Verify the frontend app can communicate with the back end API

## Prerequisites

In the [code to cloud quickstart](./quickstart-code-to-cloud.md), a back end web API is deployed to return a list of music albums. If you haven't deployed the album API microservice, return to [Quickstart: Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md) to continue.

## Setup

If you're still authenticated to Azure and still have the environment variables defined from the quickstart, you can skip the following steps and go directly to the [Prepare the GitHub repository](#prepare-the-github-repository) section.

[!INCLUDE [container-apps-code-to-cloud-setup.md](../../includes/container-apps-code-to-cloud-setup.md)]

Sign in to the Azure CLI.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```powershell
az login
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

## Prepare the GitHub repository

1. In a new browser tab, navigate to the [repository for the UI application](https://github.com/azure-samples/containerapps-albumui) and select the **Fork** button at the top of the page to fork the repo to your account.

    Follow the prompts from GitHub to fork the repository and return here once the operation is complete.

1. Navigate to the parent of the *code-to-cloud* folder. If you're still in the *code-to-cloud/src* directory, you can use the below command to return to the parent folder.

    ```console
    cd ../..
    ```

1. Use the following git command to clone your forked repo into the *code-to-cloud-ui* folder:

    ```git
    git clone https://github.com/$GITHUB_USERNAME/containerapps-albumui.git code-to-cloud-ui
    ```

    > [!NOTE]
    > If the `clone` command fails, check that you have successfully forked the repository.

1. Next, change the directory into the *src* folder of the cloned repo.

    ```console
    cd code-to-cloud-ui/src
    ```

## Build the front end application

::: zone pivot="acr-remote"

# [Bash](#tab/bash)

```azurecli
az acr build --registry $ACR_NAME --image albumapp-ui .
```

# [PowerShell](#tab/powershell)

```powershell
az acr build --registry $ACR_NAME --image albumapp-ui .
```

---

Output from the `az acr build` command shows the upload progress of the source code to Azure and the details of the `docker build` operation.

::: zone-end

::: zone pivot="docker-local"

1. The following command builds a container image for the album UI and tags it with the fully qualified name of the ACR login server. The `.` at the end of the command represents the docker build context, meaning this command should be run within the *src* folder where the Dockerfile is located.

    # [Bash](#tab/bash)

    ```azurecli
    docker build --tag $ACR_NAME.azurecr.io/albumapp-ui . 
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker build --tag $ACR_NAME.azurecr.io/albumapp-ui . 
    ```

    ---

## Push the image to your ACR registry

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
     docker push $ACR_NAME.azurecr.io/albumapp-ui 
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker push $ACR_NAME.azurecr.io/albumapp-ui 
    ```

    ---

::: zone-end

## Communicate between container apps

In the previous quickstart, the album API was deployed by creating a container app and enabling external ingress. Setting the container app's ingress to *external* made its HTTP endpoint URL publicly available.

Now you can configure the front end application to call the API endpoint by going through the following steps:

* Query the API application for its fully qualified domain name (FQDN).
* Pass the API FQDN to `az containerapp create` as an environment variable so the UI app can set the base URL for the album API call within the code.

The [UI application](https://github.com/Azure-Samples/containerapps-albumui) uses the endpoint provided to invoke the album API. The following code is an excerpt from the code used in the *routes > index.js* file.

```javascript
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  params: {},
  timeout: process.env.TIMEOUT || 5000,
});
```

Notice how the `baseURL` property gets its value from the `API_BASE_URL` environment variable.

Run the following command to query for the API endpoint address.

# [Bash](#tab/bash)

```azurecli
API_BASE_URL=$(az containerapp show --resource-group $RESOURCE_GROUP --name $API_NAME --query properties.configuration.ingress.fqdn -o tsv)
```

# [PowerShell](#tab/powershell)

```powershell
$API_BASE_URL=$(az containerapp show --resource-group $RESOURCE_GROUP --name $API_NAME --query properties.configuration.ingress.fqdn -o tsv)
```

---

Now that you have set the `API_BASE_URL` variable with the FQDN of the album API, you can provide it as an environment variable to the frontend container app.

## Deploy front end application

Create and deploy your container app with the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name $FRONTEND_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_NAME.azurecr.io/albumapp-ui  \
  --target-port 3000 \
  --env-vars API_BASE_URL=https://$API_BASE_URL \
  --ingress 'external' \
  --registry-server $ACR_NAME.azurecr.io \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name $FRONTEND_NAME `
  --resource-group $RESOURCE_GROUP `
  --environment $ENVIRONMENT `
  --image $ACR_NAME.azurecr.io/albumapp-ui  `
  --env-vars API_BASE_URL=https://$API_BASE_URL `
  --target-port 3000 `
  --ingress 'external' `
  --registry-server "$ACR_NAME.azurecr.io"  `
  --query configuration.ingress.fqdn
```

---

By adding the argument `--env-vars "API_BASE_URL=https://$API_ENDPOINT"` to `az containerapp create`, you define an environment variable for your front end application. With this syntax, the environment variable named `API_BASE_URL` is set to the API's FQDN.

## View website

The `az containerapp create` CLI command returns the fully qualified domain name (FQDN) of your album UI container app. Open this location in a browser to navigate to the web application resembling the following screenshot.

:::image type="content" source="media/communicate-between-microservices/azure-container-apps-album-ui.png" alt-text="Screenshot of album list UI microservice.":::

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
az group delete --name $RESOURCE_GROUP
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
