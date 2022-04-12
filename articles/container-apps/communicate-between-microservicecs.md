---
title: 'Tutorial: Communication between microservices'
description: Learn how to deploying communicate between microservices deployed in Container Apps.
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

::: zone pivot="acr-remote"

::: zone-end

::: zone pivot="docker-local"

::: zone-end

## Setup


### Build the frontend application

The sample code for the frontend application is stored in a Github repository here.

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

In your bash shell or in a Windows command or PowerShell window set the following environment variables.

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
>[!NOTE]
> shall we use a pivot btween building locally and using ACR build?

### Build your application locally

>[!NOTE]
> need to add steps for this.

### Build your application using ACR

With ACR you can build a docker container without needing to install Docker locally.  For this example, a docker file is provided for you.

### Example Docker file

<!-- Do we want to detail one or all Dockerfiles? -->

### Build the container with ACR

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

```output
Packing source code into tar file to upload...
Sending build context (4.813 KiB) to ACR...
Queued a build with build ID: da1
Waiting for build agent...
2020/11/18 18:31:42 Using acb_vol_01185991-be5f-42f0-9403-a36bb997ff35 as the home volume
2020/11/18 18:31:42 Setting up Docker configuration...
2020/11/18 18:31:43 Successfully set up Docker configuration
2020/11/18 18:31:43 Logging in to registry: myregistry.azurecr.io
2020/11/18 18:31:55 Successfully logged in
Sending build context to Docker daemon   21.5kB
Step 1/5 : FROM node:15-alpine
15-alpine: Pulling from library/node
Digest: sha256:8dafc0968fb4d62834d9b826d85a8feecc69bd72cd51723c62c7db67c6dec6fa
Status: Image is up to date for node:15-alpine
 ---> a56170f59699
Step 2/5 : COPY . /src
 ---> 88087d7e709a
Step 3/5 : RUN cd /src && npm install
 ---> Running in e80e1263ce9a
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN helloworld@1.0.0 No repository field.

up to date in 0.1s
Removing intermediate container e80e1263ce9a
 ---> 26aac291c02e
Step 4/5 : EXPOSE 80
 ---> Running in 318fb4c124ac
Removing intermediate container 318fb4c124ac
 ---> 113e157d0d5a
Step 5/5 : CMD ["node", "/src/server.js"]
 ---> Running in fe7027a11787
Removing intermediate container fe7027a11787
 ---> 20a27b90eb29
Successfully built 20a27b90eb29
Successfully tagged myregistry.azurecr.io/helloacrtasks:v1
2020/11/18 18:32:11 Pushing image: myregistry.azurecr.io/helloacrtasks:v1, attempt 1
The push refers to repository [myregistry.azurecr.io/helloacrtasks]
6428a18b7034: Preparing
c44b9827df52: Preparing
172ed8ca5e43: Preparing
8c9992f4e5dd: Preparing
8dfad2055603: Preparing
c44b9827df52: Pushed
172ed8ca5e43: Pushed
8dfad2055603: Pushed
6428a18b7034: Pushed
8c9992f4e5dd: Pushed
v1: digest: sha256:b038dcaa72b2889f56deaff7fa675f58c7c666041584f706c783a3958c4ac8d1 size: 1366
2020/11/18 18:32:43 Successfully pushed image: myregistry.azurecr.io/helloacrtasks:v1
2020/11/18 18:32:43 Step ID acb_step_0 marked as successful (elapsed time in seconds: 15.648945)
The following dependencies were found:
- image:
    registry: myregistry.azurecr.io
    repository: helloacrtasks
    tag: v1
    digest: sha256:b038dcaa72b2889f56deaff7fa675f58c7c666041584f706c783a3958c4ac8d1
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/node
    tag: 15-alpine
    digest: sha256:8dafc0968fb4d62834d9b826d85a8feecc69bd72cd51723c62c7db67c6dec6fa
  git: {}

Run ID: da1 was successful after 1m9.970148252s
```

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

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around a group of container apps. Container Apps deployed to the same environment share a virtual network and write logs to the same Log Analytics workspace.

Your container apps are monitored with Azure Log Analytics,  A Log Analytics workspace is automatically created when you create the environment.

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

Get the fqdn from the output of the *az containerapp create* command.

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