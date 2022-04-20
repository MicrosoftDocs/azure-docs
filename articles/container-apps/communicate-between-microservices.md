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

<!--
https://github.com/kendallroden/codetocloud
https://gist.github.com/kendallroden/391a0fb9a67c943902f8c2b49418f152
-->

# Tutorial: Communication between microservices in Azure Container Apps Preview

This tutorial builds on the app in the [Deploy your code to Azure Container Apps](./quickstart-code-to-cloud.md) article and adds a front end microservice to the container app. In this article, you learn how to enable communication between different microservices.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Build and run a containerized application on your local machine
> * Push the application's container image to Azure Container Registry
> * Deploy the app to an existing Azure Container Apps environment
> * Configure the app to call the first microservice
> * Configure the first microservice's ingress to accept internal traffic only

## Prerequisites

This article directly follows the final steps from [Deploy your code to Azure Container Apps](./quickstart-code-to-cloud.md). See the prerequisites from [Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md#prerequisites) to continue.

## Setup

If you still have all the variables defined in your shell from the previous quickstart, you can skip the below steps and continue with the [Prepare the GitHub repository](#prepare-the-github-repository) section.

[!INCLUDE [container-apps-code-to-cloud-setup.md](../../includes/container-apps-code-to-cloud-setup.md)]

## Prepare the GitHub repository

Navigate to the [repository for the UI application](https://github.com/azure-samples/containerapps-albumui) and fork the repository.

Select the **Fork** button at the top of the page to fork the repo to your account.

Use the following git command to clone your forked repo into the *code-to-cloud-ui* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumui.git code-to-cloud-ui
```

> [!NOTE]
> If the `clone` command fails, then you probably forgot to first fork the repository.

Next, change the directory into the root of the cloned repo.

```console
cd code-to-cloud-ui
```

---

### Build the frontend application

# [Bash](#tab/bash)

```bash
FRONTEND_NAME=albumsapp-api
ACR_NAME=albumsacr
ACR_LOGIN_SERVER=$ACR_NAME.azurecr.io
ACR_ADMIN_USERNAME=$ACR_NAME
CONTAINER_IMAGE_NAME=$ACR_LOGIN_SERVER/$API_NAME-$LANGUAGE:1.0
```

# [PowerShell](#tab/powershell)

```powershell
$FRONTEND_NAME="albums-frontend"
$ACR_NAME="albumsacr"
$ACR_LOGIN_SERVER="$ACR_NAME.azurecr.io"
$ACR_ADMIN_USERNAME="$ACR_NAME"
$CONTAINER_IMAGE_NAME="$ACR_LOGIN_SERVER/$API_NAME-$LANGUAGE:1.0"
```

---

### Prepare Azure CLI

If you're not still signed in to Azure, sign in again.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzAccount
```

---

## Build your application

::: zone pivot="acr-remote"

You can build your docker file with the ACR build command.

# [Bash](#tab/bash)

```azurecli
az acr build --registry $ACR_NAME --image $CONTAINER_IMAGE_NAME
```

# [PowerShell](#tab/powershell)

```powershell
az acr build --registry $ACR_NAME --image $CONTAINER_IMAGE_NAME
```

---

::: zone-end

::: zone pivot="docker-local"

### Build your application locally

::: zone-end

## Verify deployment

Your container should be listed in the output of the following command.

# [Bash](#tab/bash)

```azurecli
az acr show --name $ACR_NAME
```

# [PowerShell](#tab/powershell)

```powershell
az acr show --name $ACR_NAME
```

---

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