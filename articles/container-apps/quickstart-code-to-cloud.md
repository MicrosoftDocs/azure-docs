---
title: "Quickstart: Build and deploy your container app from a repository in Azure Container Apps"
description: Build your container app from a local or GitHub source repository and deploy in Azure Container Apps.
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: quickstart
ms.date: 02/09/2023
ms.author: v-bcatherine
zone_pivot_groups: container-apps-image-build-from-repo
---


# Quickstart: Build and deploy your container app from a repository in Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from a source repository using the programming language of your choice.

In this quickstart, you create a backend web API service that returns a static collection of music albums.  After this completing this quickstart, you can continue to [Tutorial: Communication between microservices in Azure Container Apps](communicate-between-microservices.md) to learn how to deploy a front end application that calls the API.

The following screenshot shows the output from the album API service you'll deploy.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Prerequisites

To complete this project, you need the following items:


::: zone pivot="local-build"

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

::: zone-end

::: zone pivot="github-build"

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

::: zone-end

[!INCLUDE [container-apps-setup-cli-only.md](../../includes/container-apps-setup-cli-only.md)]

Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

::: zone pivot="local-build"

# [Bash](#tab/bash)

Define the following variables in your bash shell.

```azurecli
RESOURCE_GROUP="album-containerapps"
LOCATION="canadacentral"
ENVIRONMENT="env-album-containerapps"
API_NAME="album-api"
FRONTEND_NAME="album-ui"
GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```azurecli
ACR_NAME="acaalbums"$GITHUB_USERNAME
```

# [PowerShell](#tab/powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
$FRONTEND_NAME="album-ui"
$GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```powershell
$ACR_NAME="acaalbums"+$GITHUB_USERNAME
```

---

::: zone-end
::: zone pivot="github-build"

# [Bash](#tab/bash)

Define the following variables in your bash shell.

```azurecli
RESOURCE_GROUP="album-containerapps"
LOCATION="canadacentral"
ENVIRONMENT="env-album-containerapps"
API_NAME="album-api"
```

# [PowerShell](#tab/powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
```

---

::: zone-end

## Prepare the GitHub repository

In a browser window, go to the GitHub repository for your preferred language and fork the repository.

# [C#](#tab/csharp)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-csharp) to fork the repo to your account.

::: zone pivot="local-build"

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-csharp.git code-to-cloud
```

::: zone-end

# [Go](#tab/go)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-go) to fork the repo to your account.

::: zone pivot="local-build"

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-go.git code-to-cloud
```

::: zone-end

# [JavaScript](#tab/javascript)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-javascript) to fork the repo to your account.

::: zone pivot="local-build"

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-javascript.git code-to-cloud
```

:::zone-end

# [Python](#tab/python)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-python) to fork the repo to your account.

::: zone pivot="local-build"

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-python.git code-to-cloud
```

::: zone-end

---

::: zone pivot="local-build"

## Build and deploy the container app

Build and deploy your first container app from your local git repository with the `containerapp up` command. This command will:

- Create the resource group
- Create an Azure Container Registry
- Build the container image and push it to the registry
- Create the Container Apps environment with a Log Analytics workspace
- Create and deploy the container app using a public container image

The `up` command uses the Docker file in the root of the repository to build the container image.  The target port is defined by the EXPOSE instruction in the Docker file.  A Docker file isn't required to build a container app. 

# [Bash](#tab/bash)

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --source code-to-cloud/src
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --source code-to-cloud/src
```

---

::: zone-end
::: zone pivot="github-build"

## Build and deploy the container app

Build and deploy your first container app from your forked GitHub repository with the `containerapp up` command. This command will:

- Create the resource group
- Create an Azure Container Registry
- Build the container image and push it to the registry
- Create the Container Apps environment with a Log Analytics workspace
- Create and deploy the container app using a public container image
- Create a GitHub Action workflow to build and deploy the container app

The `up` command uses the Docker file in the root of the repository to build the container image. The target port is defined by the EXPOSE instruction in the Docker file.  A Docker file isn't required to build a container app. 

Replace the `<YOUR_GITHUB_REPOSITORY_NAME>` with your GitHub repository name in the form of `https://github.com/<owner>/<repository-name>` or `<owner>/<repository-name>`.

# [Bash](#tab/bash)

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./src \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --context-path ./src `
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

Using the URL and the user code displayed in the terminal, go to the GitHub device activation page in a browser and enter the user code to the page.  Follow the prompts to authorize the Azure CLI to access your GitHub repository.  

::: zone-end

The `up` command creates a GitHub Action workflow in your repository *.github/workflows* folder. The workflow is triggered to build and deploy your container app when you push changes to the repository.

---

## Verify deployment

Copy the FQDN to a web browser.  From your web browser, go to the `/albums` endpoint of the FQDN.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Clean up resources

If you're not going to continue on to the [Deploy a frontend](communicate-between-microservices.md) tutorial, you can remove the Azure resources created during this quickstart with the following command.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If the group contains resources outside the scope of this quickstart, they are also deleted.

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
> [Tutorial: Communication between microservices](communicate-between-microservices.md)
> [Deploy Azure Container Apps with the az containerapp up command](containerapp-up.md)