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

This quickstart explains how to build your application and deploy it to Azure Container Apps.  It's the first in a series of tutorials that build on the Album Service application that you'll create here.  This Album Service application is a backend API that returns a static collection of music albums.

You'll have the option to choose between several different GitHub repositories, each with a different coding language.

## Prerequisites

To begin, you need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed.

To complete this project, you'll need the following:

| Requirement  | Installation instructions |
|--|--|
| GitHub Account | Sign up for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI |Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Docker Engine |If you choose to build your application locally, you'll need the Docker Engine installed on local host computer. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). |

[!INCLUDE [container-apps-setup-cli-only.md](../../includes/container-apps-setup-cli-only.md)]

Now that you've validated your Azure CLI setup, define the initial environment variables used throughout this article.

# [Bash](#tab/bash)

```azurecli
RG_ACA="album-containerapps"
LOCATION_ACA="canadacentral"
ENV_ACA="env-album-containerapps"
ACR_NAME_ACA="acr-album-containerapps"
APP_NAME_ACA="album-api"
GH_USER_ACA="<YOUR_GITHUB_USERNAME>"
```

# [PowerShell](#tab/powershell)

```powershell
$RG_ACA="album-containerapps"
$LOCATION_ACA="canadacentral"
$ENV_ACA="env-album-containerapps"
$ACR_NAME_ACA="acr-album-containerapps"
$APP_NAME_ACA="album-api"
$GH_USER_ACA="<YOUR_GITHUB_USERNAME>"
```

---

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

### Set your language preference

Set an environment variable for the language you'll be using. The value can be one of the following:

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

Before you run this command, replace `<LANGUAGE_VALUE>` with one of the following values: csharp, go, node, or python.

Next, set an environment variable for the target port of your application.  If you're using the node API image, the target port should be set to `3000`.  Otherwise, set your target port to `80`.

# [Bash](#tab/bash)

```bash
TARGET_PORT_ACA="<TARGET_PORT>"
```

# [PowerShell](#tab/powershell)

```powershell
$TARGET_PORT_ACA="<TARGET_PORT>"
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
git clone https://github.com/$GH_USER_ACA/containerapps-albumapi-${LANGUAGE}.git
```

# [PowerShell](#tab/powershell)

```git
git clone https://github.com/$GH_USER_ACA/containerapps-albumapi-${LANGUAGE}.git
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
  --name $RG_ACA \
  --location "$LOCATION_ACA"

```

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name $RG_ACA -Location $LOCATION_ACA
```

---

## Create an Azure Container Registry

You'll need to create an Azure Container Registry (ACR) registry instance in your new resource group and store your ACR credentials in an environment variable.  You'll, then, use the ACR credentials to log in to the registry.

# [Bash](#tab/bash)

```azurecli
az acr create \
  --resource-group $RG_ACA \
  --name $ACR_NAME_ACA 
  --sku Basic 
  --admin-enabled true

$ACR_PASS_ACA=(az acr credential show -n $ACR_NAME_ACA)
```

# [PowerShell](#tab/powershell)

```powershell
$ACA_REGISTRY = New-AzContainerRegistry `
    -ResourceGroupName $RG_ACA `
    -Name $ACR_NAME_ACA `
    -EnableAdminUser `
    -Sku Basic

$ACR_PASS_ACA=Get-AzContainerRegistryCredential `
    -Registry=$ACA_REGISTRY  `
```

---

Log in to your container registry.

# [Bash](#tab/bash)

```azurecli
az login --name $ACR_NAME_ACA
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzContainerRegistry -Name $ACR_NAME_ACA
```

---

::: zone pivot="acr-remote"

## Build your application

With ACR Tasks, you can build the docker image for the Album Service app without the need to install Docker locally.  You'll find a dockerfile in the root directory of the GitHub repo.

### Build the container with ACR

The following command uses ACR to remotely build the dockerfile for the Album Service. The `.` represents the current build context, so run this command at the root of the repository where the dockerfile is located.

# [Bash](#tab/bash)

```azurecli
az acr build --registry $ACR_NAME_ACA --image $APP_NAME_ACA .
```

# [PowerShell](#tab/powershell)

```powershell
az acr build --registry $ACR_NAME_ACA --image $APP_NAME_ACA .
```

---

Output from the `az acr build` command shows the upload progress of the source code to Azure and the details of the `docker build` operation.

To verify that your image is now available in ACR, run the command below.

# [Bash](#tab/bash)

```azurecli
az acr manifest list-metadata --registry $ACR_NAME_ACA --name $APP_NAME_ACA
```

# [PowerShell](#tab/powershell)

```powershell
Get-AzContainerRegistryManifest -RegistryName $ACR_NAME_ACA `
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

If your image was successfully built, its listed in the output of the following command:

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
  --name $ENV_ACA \
  --resource-group $RG_ACA \
  --location "$LOCATION_ACA"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $ENV_ACA `
  --resource-group $RG_ACA `
  --location $LOCATION_ACA
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
  --resource-group $RG_ACA \
  --environment $ENV_ACA \
  --image $APP_NAME_ACA \
  --target-port $TARGET_PORT_ACA \
  --ingress 'external' \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name my-container-app `
  --resource-group $RG_ACA `
  --environment $ENV_ACA `
  --image $APP_NAME_ACA `
  --target-port $TARGET_PORT_ACA `
  --ingress 'external' `
  --query configuration.ingress.fqdn
```

---

## Verify deployment

The `az containerapp create` command returns the fully qualified domain name for the container app. Copy this location to a web browser.

From your web browser, navigate to the FQDN on the `/albums` endpoint.

## Save environment variables

If plan to continue with the follow-on tutorials, you may want to save the environment variables that were defined in this article.  Change directory to the root of your repository and run the following script.  It will save your variables to the file, *aca_variables.env*, so that you can restore them as needed in new bash or PowerShell sessions.

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
az group delete --name $RG_ACA
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RG_ACA -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

This quickstart is the entrypoint for a set of progressive tutorials that showcase the various features within Azure Container Apps. To continue with the tutorial path, `ADD LINKS`.

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)