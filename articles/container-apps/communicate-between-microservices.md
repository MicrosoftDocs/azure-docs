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

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build and run a containerized application on your local machine
> * Push the application's container image to Azure Container Registry
> * Deploy the app to an existing Azure Container Apps environment
> * Configure the app to call the first microservice
> * Configure the first microservice's ingress to accept internal traffic only

## Prerequisites

This article directly follows the final steps from [Deploy your code to Azure Container Apps](./quickstart-code-to-cloud.md). See the prerequisites from [Deploy your code to Azure Container Apps](quickstart-code-to-cloud.md#prerequisites) to continue.

[!INCLUDE [container-apps-setup-cli-only.md](../../includes/container-apps-setup-cli-only.md)]

Now Azure CLI setup is validated, you can define the initial environment variables used throughout this article.

If you still have all the variables defined in your shell from the previous quickstart, you can skip the below steps and continue with the [Prepare the GitHub repository](#prepare-the-github-repository) section.

[!INCLUDE [container-apps-code-to-cloud-setup.md](../../includes/container-apps-code-to-cloud-setup.md)]

## Prepare the GitHub repository

Navigate to the [repository for the UI application](https://github.com/azure-samples/containerapps-albumui) and fork the repository.

Select the **Fork** button at the top of the page to fork the repo to your account.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

# [Bash](#tab/bash)

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumui.git code-to-cloud
```

# [PowerShell](#tab/powershell)

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumui.git code-to-cloud
```

---

> [!NOTE]
> If the `clone` command fails, then you probably forgot to first fork the repository.

Next, change the directory into the root of the cloned repo.

```console
cd code-to-cloud
```

---


### Build the frontend application


The sample code for the frontend application is stored in a GitHub repository here.

#### Fork the sample repository

Use the GitHub UI to fork the sample repository into your GitHub account. In this tutorial, you build a container image from the source in the repo.


#### Clone your fork

Open a git bash shell, create a directory on your local system to clone a sample repository and enter the directory. Clone your forked repository and enter the directory containing your local clone.

Clone the repo with `git`, replace **\<your-github-username\>** with your GitHub username:

```console
git clone https://github.com/<your-github-username>/\<your-repostory\>
```

Enter the directory containing the source code:

```console
cd <your-local-repository-directory>
```

### Set environment variables

Set the following environment variables.

>[!NOTE]
> do we want to use the same ACR, resource group and environment that was created in the quickstart?

# [Bash](#tab/bash)

```bash
RESOURCE_GROUP="my-container-apps"
LOCATION="canadacentral"
CONTAINERAPPS_ENVIRONMENT="my-environment"
FRONTEND_NAME=albumsapp-api
ACR_NAME=albumsacr
ACR_LOGIN_SERVER=${ACR_NAME}.azurecr.io
ACR_ADMIN_USERNAME=${ACR_NAME}
CONTAINER_IMAGE_NAME=${ACR_LOGIN_SERVER}/${API_NAME}-${LANGUAGE}:1.0

```

# [PowerShell](#tab/powershell)

>[!NOTE]
> do we want to use the same ACR, resource group and environment that was created in the quickstart?

```powershell
$RESOURCE_GROUP="my-container-apps"
$LOCATION="canadacentral"
$CONTAINERAPPS_ENVIRONMENT="my-environment"
$FRONTEND_NAME="albums-frontend"
$ACR_NAME="albumsacr"
$ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
$ACR_ADMIN_USERNAME=$ACR_NAME
$CONTAINER_IMAGE_NAME="${ACR_LOGIN_SERVER}/${FRONTEND_NAME}-${LANGUAGE}:1.0"
```

---
### Prepare Azure CLI

Sign in to Azure.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzAccount
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [PowerShell](#tab/powershell)

```azurecli
az upgrade
```

---

Next, install the Azure Container Apps extension for the Azure CLI.

# [Bash](#tab/bash)

```azurecli
az extension add \
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.2-py2.py3-none-any.whl 
```

# [PowerShell](#tab/powershell)

```azurecli
az extension add `
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.2-py2.py3-none-any.whl 
```

---

### Register the resource provider namespace

Now that the extension is installed, register the `Microsoft.App` namespace.

> [!NOTE]
> Azure Container Apps resources are in the process of migrating from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

# [PowerShell](#tab/powershell)

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
```

---
<!-- 
## Create an Azure Resource Group

Create a resource group to organize the services related to your new container app.

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

## Create a Azure Container Registry

Create a ACR register then store your credentials in an environment variable.

# [Bash](#tab/bash)

```azurecli
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Standard --location $LOCATION
$ACR_CREDENTIAL=(az acr credential show -n $ACR_NAME)

```

# [PowerShell](#tab/powershell)

```powershell
New-AzContainerRegistry`
    -ResourceGroupName $RESOURCE_GROUP
    -Name $ACR_NAME
    -Sku Standard
    -Location $LOCATION
$ACR_CREDENTIAL=Get-AzContainerRegistryCredential
    -Name $ACR_NAME
```

---
-->

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

Output from the `az acr build` command is similar to the following. You can see the upload of the source code (the "context") to Azure, and the details of the `docker build` operation that the ACR task runs in the cloud. Because ACR tasks use `docker build` to build your images, no changes to your Dockerfiles are required to start using ACR Tasks immediately.

::: zone-end

::: zone pivot="docker-local"

::: zone-end

## Verify your container in ACR

 Your container should be listed in the output of the following command.

# [Bash](#tab/bash)

```azurecli
az acr show --name $ACR_NAME
```

# [PowerShell](#tab/powershell)

```powershell
??? Which powershell command???
```

---

### Build your application locally

>[!NOTE]
> need to add steps for this.

### Build your application using ACR

With ACR you can build a docker container without needing to install Docker locally.  For this example, a docker file is provided for you.

### Example Docker file

<!-- Do we want to detail one or all Dockerfiles? -->

### Build the container with ACR







## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around a group of container apps. Container Apps deployed to the same environment share a virtual network and write logs to the same Log Analytics workspace.

Your container apps are monitored with Azure Log Analytics. A Log Analytics workspace is automatically created when you create the environment.

Create the Container Apps environment.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --location "$LOCATION"
```

---
## Create a container app

Now that you have an environment created, you can create and deploy your container app with the `containerapp create` command.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name front-end-album-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image $CONTAINER_IMAGE_NAME \
  --target-port 80 \
  --ingress 'external' \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENVIRONMENT `
  --image $CONTAINER_IMAGE_NAME `
  --target-port 80 `
  --ingress 'external' `
  --query configuration.ingress.fqdn
```

---

By setting `--ingress` to `external`, you make the container app available to public requests.

## Verify deployment

Get the fqdn from the output of the `az containerapp create` command.

The `az containerapp create` command returned the fully qualified domain name for the container app. Copy this location to a web browser. 

From your web browser browse to:

>[!NOTE]
> should the url change?

`<fqdn>/albums`

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