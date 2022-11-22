---
title: "Quickstart: Build and deploy your container app from a repository in Azure Container Apps"
description: Build your container app from a local or GitHub source repository and deploy in Azure Container Apps.
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: quickstart
ms.date: 11/20/2022
ms.author: v-bcatherine
zone_pivot_groups: container-apps-image-build-from-repo
---

# Quickstart: Build and deploy your container app from a repository in Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from a source repository using the programming language of your choice.

The first step is to create a back end web API service that returns a static collection of music albums.

The following screenshot shows the output from the album API deployed in this quickstart.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Prerequisites

To complete this project, you'll need the following items:


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

Navigate to the repository for your preferred language and fork the repository.

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
  --source .
```

# [Azure PowerShell](#tab/powershell)

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --source .

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

# [Azure PowerShell](#tab/powershell)

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --context-path ./src `
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

---

::: zone-end

You will be prompted to enter the user code to login your device to GitHub.  The URI for device activation and the user code will be displayed in the terminal.  Go to the device activation page and then copy the user code from the terminal and paste it in the browser.  The browser will prompt you to login to GitHub and authorize the Azure CLI to access your GitHub account.  

The `up` command will create a GitHub Action workflow in your repository.  The workflow will build and deploy the container app to Azure Container Apps.  The workflow will be triggered when you push changes to the repository.  The workflow is located in the `.github/workflows` folder in your repository.

## Verify deployment

The `az containerapp create` command returns the fully qualified domain name (FQDN) for the container app. Copy the FQDN to a web browser.

From your web browser, navigate to the `/albums` endpoint of the FQDN.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Clean up resources

If you're not going to continue on to the [Communication between microservices](communicate-between-microservices.md) tutorial, you can remove the Azure resources created during this quickstart. Run the following command to delete the resource group along with all the resources created in this quickstart.

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