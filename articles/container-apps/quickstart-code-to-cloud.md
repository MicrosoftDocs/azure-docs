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

This quickstart is the first in a series of articles that walk you through how to leverage core capabilities within Azure Container Apps. The first step is to create a backedend web API for application that returns a static collection of music albums.

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
| Docker engine | Install the Docker Engine. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). <br><br>From your command prompt, type `docker` to ensure Docker is running. |

::: zone-end

[!INCLUDE [container-apps-setup-cli-only.md](../../includes/container-apps-setup-cli-only.md)]

Now Azure CLI setup is validated, define the initial environment variables used throughout this article.

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP_ACA="album-containerapps"
LOCATION_ACA="canadacentral"
ENVIRONMENT_ACA="env-album-containerapps"
API_NAME_ACA="album-api"
GITHUB_USERNAME_ACA="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Now create a unique container registry name.

```azurecli
ACR_NAME_ACA=$GITHUB_USERNAME_ACA"acaalbums"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP_ACA="album-containerapps"
$LOCATION_ACA="canadacentral"
$ENVIRONMENT_ACA="env-album-containerapps"
$API_NAME_ACA="album-api"
$GITHUB_USERNAME_ACA="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Now create a unique container registry name.

```powershell
$ACR_NAME_ACA=$GITHUB_USERNAME_ACA"acaalbums"
```

---

### Set your language preference

Set an environment variable for the language you'll be using. The value can be one of the following values:

- csharp
- go
- javascript
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

Before you run this command, replace `<LANGUAGE_VALUE>` with one of the following values: `csharp`, `go`, `javascript`, or `python`.

Next, set an environment variable for the target port of your application.  If you're using the JavaScript API, the target port should be set to `3000`.  Otherwise, set your target port to `80`.

# [Bash](#tab/bash)

```bash
API_PORT_ACA="<TARGET_PORT>"
```

# [PowerShell](#tab/powershell)

```powershell
$API_PORT_ACA="<TARGET_PORT>"
```

---

Before you run this command, replace `<TARGET_PORT>` with `3000` for node apps, or `80` for all other apps.

## Prepare the GitHub repository

Navigate to the repository for your preferred language and fork the repository. Click the **Fork** button at the top of the page to fork the repo to your account.

- [C#](https://github.com/azure-samples/containerapps-albumapi-csharp)
- [Go](https://github.com/azure-samples/containerapps-albumapi-go)
- [JavaScript](https://github.com/azure-samples/containerapps-albumapi-javascript)
- [Python](https://github.com/azure-samples/containerapps-albumapi-python)

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

# [Bash](#tab/bash)

```git
git clone https://github.com/$GITHUB_USERNAME_ACA/containerapps-albumapi-${LANGUAGE}.git code-to-cloud
```

# [PowerShell](#tab/powershell)

```git
git clone https://github.com/$GITHUB_USERNAME_ACA/containerapps-albumapi-${LANGUAGE}.git code-to-cloud
```

---

Next, change the directory into the root of the cloned repo.

```console
cd code-to-cloud
```

---

## Create an Azure Resource Group

Create a resource group to organize the services related to your container app deployment.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP_ACA \
  --location "$LOCATION_ACA"
```

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name $RESOURCE_GROUP_ACA -Location $LOCATION_ACA
```

---

## Create an Azure Container Registry

Next, create an Azure Container Registry (ACR) registry instance in your new resource group.

# [Bash](#tab/bash)

```azurecli
az acr create \
  --resource-group $RESOURCE_GROUP_ACA \
  --name $ACR_NAME_ACA \
  --sku Basic \
  --admin-enabled true
```

Now store your ACR credentials in an environment variable.

```azurecli
ACR_PASSWORD_ACA=(az acr credential show -n $ACR_NAME_ACA)
```

# [PowerShell](#tab/powershell)

```powershell
$ACA_REGISTRY = New-AzContainerRegistry `
    -ResourceGroupName $RESOURCE_GROUP_ACA `
    -Name $ACR_NAME_ACA `
    -EnableAdminUser `
    -Sku Basic
```

Now store your ACR credentials in an environment variable.

```powershell
$ACR_PASSWORD_ACA=Get-AzContainerRegistryCredential `
    -Registry=$ACA_REGISTRY  `
```

---

Sign in to your container registry.

# [Bash](#tab/bash)

```azurecli
az acr login --name $ACR_NAME_ACA
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzContainerRegistry -Name $ACR_NAME_ACA
```

---

::: zone pivot="acr-remote"

## Build your application

With ACR Tasks, you can build the docker image for the album API without the need to install Docker locally.  You'll find the Dockerfile in the root directory of the GitHub repo which you use to create the container image.

### Build the container with ACR

The following command uses ACR to remotely build the Dockerfile for the album API. The `.` represents the current build context, so run this command at the root of the repository where the Dockerfile is located.

# [Bash](#tab/bash)

```azurecli
az acr build --registry $ACR_NAME_ACA --image $API_NAME_ACA .
```

# [PowerShell](#tab/powershell)

```powershell
az acr build --registry $ACR_NAME_ACA --image $API_NAME_ACA .
```

---

Output from the `az acr build` command shows the upload progress of the source code to Azure and the details of the `docker build` operation.

To verify that your image is now available in ACR, run the command below.

# [Bash](#tab/bash)

```azurecli
az acr manifest list-metadata --registry $ACR_NAME_ACA --name $API_NAME_ACA
```

# [PowerShell](#tab/powershell)

```powershell
Get-AzContainerRegistryManifest -RegistryName $ACR_NAME_ACA `
  -Repository $API_NAME_ACA
```

---

::: zone-end

::: zone pivot="docker-local"

## Build your application

In the below steps, you build your container image locally using Docker. Once the image is built successfully, you push the image to your newly created container registry.

### Build the container with Docker

The following command builds the image using the Dockerfile for the album API. The `.` represents the current build context, so run this command at the root of the repository where the Dockerfile is located.

# [Bash](#tab/bash)

```azurecli
docker build -t $ACR_NAME_ACA.azurecr.io/$API_NAME_ACA
```

# [PowerShell](#tab/powershell)

```powershell
docker build -t $ACR_NAME_ACA.azurecr.io/$API_NAME_ACA
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

First, login to your Azure Container Registry.

# [Bash](#tab/bash)

```azurecli
az acr login --name $ACR_NAME_ACA --password $ACR_PASSWORD_ACA
```

# [PowerShell](#tab/powershell)

```powershell
az acr login --name $ACR_NAME_ACA --password $ACR_PASSWORD_ACA
```

---

Now, push the image to your registry.

# [Bash](#tab/bash)

```azurecli
docker push $ACR_NAME_ACA.azurecr.io/$API_NAME_ACA
```

# [PowerShell](#tab/powershell)

```powershell
docker push $ACR_NAME_ACA.azurecr.io/$API_NAME_ACA
```

---

::: zone-end

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around a group of container apps.

Create the Container Apps environment using the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $ENVIRONMENT_ACA \
  --resource-group $RESOURCE_GROUP_ACA \
  --location "$LOCATION_ACA"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $ENVIRONMENT_ACA `
  --resource-group $RESOURCE_GROUP_ACA `
  --location $LOCATION_ACA
```

---

## Deploy your image to a container app

Now that you have an environment created, you can create and deploy your container app with the `az containerapp create` command.

By setting `--ingress` to `external`, your container app will be accessible from the public internet.

Create and deploy your container app with the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name $API_NAME_ACA \
  --resource-group $RESOURCE_GROUP_ACA \
  --environment $ENVIRONMENT_ACA \
  --image $ACR_NAME_ACA.azurecr.io/$API_NAME_ACA \
  --target-port $API_PORT_ACA \
  --ingress 'external' \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name $API_NAME_ACA `
  --resource-group $RESOURCE_GROUP_ACA `
  --environment $ENVIRONMENT_ACA `
  --image $API_NAME_ACA `
  --target-port $API_PORT_ACA `
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
az group delete --name $RESOURCE_GROUP_ACA
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP_ACA -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

This quickstart is the entrypoint for a set of progressive tutorials that showcase the various features within Azure Container Apps. To continue with the tutorial path, `ADD LINKS`.

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)