---
title: "Quickstart: Deploy your code to Azure Container Apps"
description: Code to cloud deploying your application to Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: quickstart
ms.date: 04/04/2022
ms.author: v-bcatherine
zone_pivot_groups: container-apps-image-build-type
---

# Quickstart: Deploy your code to Azure Container Apps

This article demonstrates how to deploy to Azure Container Apps from a repository on your machine in the language of your choice.

This quickstart is the first in a series of articles takes you step-by-step in building an application that takes advantage of many features in Azure Container Apps. The first step is to create a basic web API for application that returns a static collection of music albums.

## Prerequisites

To complete this project, you'll need the following items:

::: zone pivot="acr-remote"

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=current) for details. |
| GitHub Account | Sign up for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

::: zone-end

::: zone pivot="docker-local"

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=current) for details. |
| GitHub Account | Sign up for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Docker Engine | Install the Docker Engine. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). <br><br>From your command prompt, type `docker` to ensure the Docker client is running. |

::: zone-end

[!INCLUDE [container-apps-setup-cli-only.md](../../includes/container-apps-setup-cli-only.md)]

Now that you've validated your Azure CLI setup, define the initial environment variables used throughout this article.

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="album-containerapps"
LOCATION="canadacentral"
ENVIRONMENT="env-album-containerapps"
APP_NAME="album-api"
API_IMAGE="latest"
GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Now create a unique container registry name.

```azurecli
ACR_NAME=$GITHUB_USERNAME"acaalbums"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$ACR_NAME="acr-album-containerapps"
$APP_NAME="album-api"
$API_IMAGE="latest"
$GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Now create a unique container registry name.

```powershell
$ACR_NAME=$GITHUB_USERNAME"acaalbums"
```

---

### Set your language preference

Set an environment variable for the language you'll be using. The value can be one of the following values:

- csharp
- go
- node
- python

# [Bash](#tab/bash)

```bash
LANGUAGE="<LANGUAGE_VALUE>"
```

# [PowerShell](#tab/powershell)

```powershell
$LANGUAGE="<LANGUAGE_VALUE>"
```

---

Before you run this command, replace `<LANGUAGE_VALUE>` with one of the following values: `csharp`, `go`, `node`, or `python`.

Next, set an environment variable for the target port of your application.  If you're using the node API image, the target port should be set to `3000`.  Otherwise, set your target port to `80`.

# [Bash](#tab/bash)

```bash
PORT_NUMBER="<TARGET_PORT>"
```

# [PowerShell](#tab/powershell)

```powershell
$PORT_NUMBER="<TARGET_PORT>"
```

---

Before you run this command, replace `<TARGE_PORT>` with `3000` for node apps, or `80` for all other apps.

## Prepare the GitHub repository

Next, fork the repository for your preferred language and then clone the repository to your local machine.

**TODO: Need repo locations from Kendall**

- [C#](https://github.com/Azure-Samples/TODO)
- [Go](https://github.com/Azure-Samples/TODO)
- [node](https://github.com/Azure-Samples/TODO)
- [Python](https://github.com/Azure-Samples/TODO)

Use the following git command to clone your forked repo to your development environment:

# [Bash](#tab/bash)

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-${LANGUAGE}.git
```

# [PowerShell](#tab/powershell)

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-${LANGUAGE}.git
```

---

Next, change the directory into the root of the cloned repo.

```console
cd containerapps-albumapi-${LANGUAGE}
```

---

## Create an Azure Resource Group

Create a resource group to organize the services related to your container app deployment.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name $RESOURCE_GROUP -Location $LOCATION
```

---

## Create an Azure Container Registry

Next, create an Azure Container Registry (ACR) registry instance in your new resource group.

# [Bash](#tab/bash)

```azurecli
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true
```

Now store your ACR credentials in an environment variable.

```azurecli
ACR_CREDENTIALS=(az acr credential show -n $ACR_NAME)
```

# [PowerShell](#tab/powershell)

```powershell
$ACA_REGISTRY = New-AzContainerRegistry `
    -ResourceGroupName $RESOURCE_GROUP `
    -Name $ACR_NAME `
    -EnableAdminUser `
    -Sku Basic
```

Now store your ACR credentials in an environment variable.

```powershell
$ACR_CREDENTIALS=Get-AzContainerRegistryCredential `
    -Registry=$ACA_REGISTRY  `
```

---

Sign in to your container registry.

# [Bash](#tab/bash)

```azurecli
az acr login --name $ACR_NAME
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzContainerRegistry -Name $ACR_NAME
```

---

::: zone pivot="acr-remote"

## Build your application

With ACR Tasks, you can build the docker image for the Album Service app without the need to install Docker locally.  You'll find a dockerfile in the root directory of the GitHub repo.

### Build the container with ACR

The following command uses ACR to remotely build the dockerfile for the Album Service. The `.` represents the current build context, so run this command at the root of the repository where the dockerfile is located.

# [Bash](#tab/bash)

```azurecli
az acr build --registry $ACR_NAME --image $APP_NAME .
```

# [PowerShell](#tab/powershell)

```powershell
az acr build --registry $ACR_NAME --image $APP_NAME .
```

---

Output from the `az acr build` command shows the upload progress of the source code to Azure and the details of the `docker build` operation.

To verify that your image is now available in ACR, run the command below.

# [Bash](#tab/bash)

```azurecli
az acr manifest list-metadata --registry $ACR_NAME --name $APP_NAME
```

# [PowerShell](#tab/powershell)

```powershell
Get-AzContainerRegistryManifest -RegistryName $ACR_NAME `
  -Repository album-api
```

---

::: zone-end

::: zone pivot="docker-local"

## Build your application

To build your application locally, you'll use Docker to build your image.  Then you'll add your container image to your newly created container registry.

### Build the container with Docker

The following command builds the image using the dockerfile for the Album Service. The `.` represents the current build context, so run this command at the root of the repository where the dockerfile is located.

# [Bash](#tab/bash)

```azurecli
docker build -t $API_IMAGE .
```

# [PowerShell](#tab/powershell)

```powershell
docker build -t $API_IMAGE .
```

---

If your image was successfully built, it is listed in the output of the following command:

# [Bash](#tab/bash)

```azurecli
docker images
```

# [PowerShell](#tab/powershell)

```powershell
docker images
```

---

### Push the Docker image to your ACR registry

Now, push the image to your registry.

# [Bash](#tab/bash)

```azurecli
docker push $API_IMAGE
```

# [PowerShell](#tab/powershell)

```powershell
docker push $API_IMAGE
```

---

::: zone-end

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around a group of container apps.

Create the Container Apps environment using the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION
```

---

## Deploy your image to a container app

Now that you have an environment created, you can create and deploy your container app with the `az containerapp create` command.

By setting `--ingress` to `external`, your container app will be accessible to the public internet.

Create and deploy your container app with the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $APP_NAME \
  --target-port $PORT_NUMBER \
  --ingress 'external' \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --environment $ENVIRONMENT `
  --image $APP_NAME `
  --target-port $PORT_NUMBER `
  --ingress 'external' `
  --query configuration.ingress.fqdn
```

---

## Verify deployment

The `az containerapp create` command returns the fully qualified domain name for the container app. Copy this location to a web browser.

From your web browser, navigate to the FQDN on the `/albums` endpoint.

## Save environment variables

If you plan to continue with further tutorials in this series, consider saving the environment variables defined in this article.

Change directory to the root of your repository and run the following script to save your variables to the file, *aca_variables.env*. As you continue on in the series, you can restore the variables as needed in new bash or PowerShell sessions.

# [Bash](#tab/bash)

```azurecli
./save-env.sh
```

# [PowerShell](#tab/powershell)

```powershell
save-env.ps1
```

---

## Clean up resources

If you're not going to continue to the next tutorial, run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

This quickstart is the entrypoint for a set of progressive tutorials that showcase the various features within Azure Container Apps. To continue with the tutorial path, `ADD LINKS`.

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)