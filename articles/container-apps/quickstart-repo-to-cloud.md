---
title: "Quickstart: Build and deploy from a repository to Azure Container Apps"
description: Build your container app from a code repository and deploy in Azure Container Apps using az containerapp up.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.topic: quickstart
ms.date: 01/26/2024
ms.author: cshoe
zone_pivot_groups: container-apps-code-to-cloud-segmemts
---


# Quickstart: Build and deploy from a repository to Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from a GitHub repository using the programming language of your choice. In this quickstart, you create a sample microservice, which represents a backend web API service that returns a static collection of music albums.

This sample application is available in two versions. One version includes a container, where the source contains a Dockerfile. The other version has no Dockerfile. Select the version that best reflects your source code. If you're new to containers, select the **No  Dockerfile** option at the top.

> [!NOTE]
> You can also build and deploy this sample application from your local filesystem. For more information, see [Build from local source code and deploy your application in Azure Container Apps](quickstart-code-to-cloud.md).

The following screenshot shows the output from the album API service you deploy.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::


## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

## Create environment variables

Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

# [Bash](#tab/bash)

Define the following variables in your bash shell.

```azurecli
export RESOURCE_GROUP="album-containerapps"
export LOCATION="canadacentral"
export ENVIRONMENT="env-album-containerapps"
export API_NAME="album-api"
export GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

::: zone pivot="with-dockerfile"
Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```azurecli
export ACR_NAME="acaalbums"$GITHUB_USERNAME
```
::: zone-end

# [Azure PowerShell](#tab/azure-powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
$GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

::: zone pivot="with-dockerfile"
Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```powershell
$ACR_NAME="acaalbums"+$GITHUB_USERNAME
```
::: zone-end


---



## Prepare the GitHub repository

::: zone pivot="with-dockerfile"

In a browser window, go to the GitHub repository for your preferred language and fork the repository. 

# [C#](#tab/csharp)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-csharp) to fork the repo to your account. Then copy the repo URL to use it
in the next step.


# [Java](#tab/java)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-java) to fork the repo to your account. Then copy the repo URL to use it
in the next step.


# [JavaScript](#tab/javascript)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-javascript) to fork the repo to your account. Then copy the repo URL to use it
in the next step.


# [Python](#tab/python)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-python) to fork the repo to your account. Then copy the repo URL to use it
in the next step.


# [Go](#tab/go)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-go) to fork the repo to your account. Then copy the repo URL to use it
in the next step.

::: zone-end


::: zone pivot="without-dockerfile"

In a browser window, go to the GitHub repository for your preferred language and fork the repository **including branches**. 

# [C#](#tab/csharp)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-csharp) to fork the repo to your account. Uncheck "Copy the `main` branch only"
to also fork the `buildpack` branch.


# [Java](#tab/java)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-java) to fork the repo to your account. Uncheck "Copy the `main` branch only"
to also fork the `buildpack` branch.


# [JavaScript](#tab/javascript)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-javascript) to fork the repo to your account. Uncheck "Copy the `main` branch only"
to also fork the `buildpack` branch.


# [Python](#tab/python)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-python) to fork the repo to your account. Uncheck "Copy the `main` branch only"
to also fork the `buildpack` branch.


# [Go](#tab/go)

Azure Container Apps cloud build doesn't currently support Buildpacks for Go.

::: zone-end


---

## Build and deploy the container app

Build and deploy your first container app from your forked GitHub repository with the `containerapp up` command. This command will:

::: zone pivot="with-dockerfile"
- Create the resource group
- Create the Container Apps environment with a Log Analytics workspace
- Create an Azure Container Registry
- Create a GitHub Action workflow to build and deploy the container app
::: zone-end

::: zone pivot="without-dockerfile"
- Create the resource group
- Create the Container Apps environment with a Log Analytics workspace
- Automatically create a default registry as part of your environment
- Create a GitHub Action workflow to build and deploy the container app
::: zone-end

When you push new code to the repository, the GitHub Action will:

::: zone pivot="with-dockerfile"
- Build the container image and push it to the Azure Container Registry
- Deploy the container image to the created container app

The `up` command uses the Dockerfile in the root of the repository to build the container image. The `EXPOSE` instruction in the Dockerfile defines the target port.  A Docker file isn't required to build a container app.
::: zone-end

::: zone pivot="without-dockerfile"
- Automatically detect the language and runtime
- Build the image using the appropriate Buildpack
- Push the image into the Azure Container Apps default registry

The container app needs to be accessible to ingress traffic. Ensure to expose port 8080 to listen for incoming requests.
::: zone-end

::: zone pivot="with-dockerfile"
In the following command, replace the `<YOUR_GITHUB_REPOSITORY_NAME>` with your GitHub repository name in the form of `https://github.com/<OWNER>/<REPOSITORY-NAME>` or `<OWNER>/<REPOSITORY-NAME>`.
::: zone-end

::: zone pivot="without-dockerfile"
In the following command, replace the `<YOUR_GITHUB_REPOSITORY_NAME>` with your GitHub repository name in the form of `https://github.com/<OWNER>/<REPOSITORY-NAME>` or `<OWNER>/<REPOSITORY-NAME>`. Use the `--branch buildpack` option to point to the sample source without a Dockerfile.
::: zone-end

# [Bash](#tab/bash)

::: zone pivot="with-dockerfile"

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./src \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

::: zone-end
::: zone pivot="without-dockerfile"

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./src \
  --ingress external \
  --target-port 8080 \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
  --branch buildpack
  --
```

::: zone-end


# [Azure PowerShell](#tab/azure-powershell)

::: zone pivot="with-dockerfile"

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --context-path ./src `
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

::: zone-end
::: zone pivot="without-dockerfile"

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --context-path ./src `
    --ingress external `
    --target-port 8080 `
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
    --branch buildpack
```

::: zone-end


---

Using the URL and the user code displayed in the terminal, go to the GitHub device activation page in a browser and enter the user code to the page.  Follow the prompts to authorize the Azure CLI to access your GitHub repository.  

The `up` command creates a GitHub Action workflow in your repository's *.github/workflows* folder. The workflow is triggered to build and deploy your container app when you push changes to the repository.

---

## Verify deployment

Copy the domain name returned by the `containerapp up` to a web browser.  From your web browser, go to the `/albums` endpoint of the URL.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Clean up resources

If you're not going to continue on to the [Deploy a frontend](communicate-between-microservices.md) tutorial, you can remove the Azure resources created during this quickstart with the following command.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If the group contains resources outside the scope of this quickstart, they are also deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az group delete --name $RESOURCE_GROUP
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

After completing this quickstart, you can continue to [Tutorial: Communication between microservices in Azure Container Apps](communicate-between-microservices.md) to learn how to deploy a front end application that calls the API.

> [!div class="nextstepaction"]
> [Tutorial: Communication between microservices](communicate-between-microservices.md)
