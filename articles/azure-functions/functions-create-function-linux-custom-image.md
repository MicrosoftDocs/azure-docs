---
title: Create a function on Linux using a custom image (preview) | Microsoft Docs 
description: Learn how to create Azure Functions running on a custom Linux image.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 11/15/2017
ms.topic: tutorial
ms.service: azure-functions
ms.custom: mvc
ms.devlang: azure-cli
manager: jeconnoc
---

# Create a function on Linux using a custom image (preview)

Azure Functions lets you host your functions on Linux in your own custom container. You can also [host on a default Azure App Service container](functions-create-first-azure-function-azure-cli-linux.md). This functionality is currently in preview and requires [the Functions 2.0 runtime](functions-versions.md).

In this tutorial, you learn how to deploy a function app as a custom Docker image. This pattern is useful when you need to customize the built-in App Service container image. You may want to use a custom image when your functions need a specific language version or require a specific dependency or configuration that isn't provided within the built-in image.

This tutorial walks you through how to use Azure Functions to create and push a custom image to Docker Hub. You then use this image as the deployment source for a function app that runs on Linux. You use Docker to build and push the image. You use the Azure CLI to create a function app and deploy the image from Docker Hub. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a custom image using Docker.
> * Publish a custom image to a container registry. 
> * Create an Azure Storage account. 
> * Create a Linux App Service plan. 
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app. 

The following steps are supported on a Mac, Windows, or Linux computer.  

## Prerequisites

To complete this tutorial, you need:

* [Git](https://git-scm.com/downloads)
* An active [Azure subscription](https://azure.microsoft.com/pricing/free-trial/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* [Docker](https://docs.docker.com/install/)
* A [Docker Hub account](https://docs.docker.com/docker-id/)

[!INCLUDE [Free trial note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine, then change to the directory that contains the sample code.

```bash
git clone https://github.com/Azure-Samples/functions-linux-custom-image.git --config core.autocrlf=input
cd functions-linux-custom-image
```

## Build the image from the Docker file

In this Git repository, take a look at the _Dockerfile_. This file describes the environment that is required to run the function app on Linux. 

```docker
# Base the image on the built-in Azure Functions Linux image.
FROM microsoft/azure-functions-runtime:2.0.0-jessie
ENV AzureWebJobsScriptRoot=/home/site/wwwroot

# Add files from this repo to the root site folder.
COPY . /home/site/wwwroot 
```
>[!NOTE]
> When hosting an image in a private container registry, you should add the connection settings to the function app by using **ENV** variables in the Dockerfile. Because this tutorial cannot guarantee that you use a private registry, the connection settings are [added after the deployment by using the Azure CLI](#configure-the-function-app) as a security best practice.   

### Run the Build command
To build the Docker image, run the `docker build` command, and provide a name, `mydockerimage`, and tag, `v1.0.0`. Replace `<docker-id>` with your Docker Hub account ID.

```bash
docker build --tag <docker-id>/mydockerimage:v1.0.0 .
```

The command produces output similar to the following:

```bash
Sending build context to Docker daemon  169.5kB
Step 1/3 : FROM microsoft/azure-functions-runtime:v2.0.0-jessie
v2.0.0-jessie: Pulling from microsoft/azure-functions-runtime
b178b12f7913: Pull complete
2d9ce077a781: Pull complete
4775d4ba55c8: Pull complete
Digest: sha256:073f45fc167b3b5c6642ef4b3c99064430d6b17507095...
Status: Downloaded newer image for microsoft/azure-functions-runtime:v2.0.0-jessie
 ---> 217799efa500
Step 2/3 : ENV AzureWebJobsScriptRoot /home/site/wwwroot
 ---> Running in 528fa2077d17
 ---> 7cc6323b8ae0
Removing intermediate container 528fa2077d17
Step 3/3 : COPY . /home/site/wwwroot
 ---> 5bdac9878423
Successfully built 5bdac9878423
Successfully tagged ggailey777/mydockerimage:v1.0.0
```

### Test the image locally
Verify that the built image works by running the Docker image in a local container. Issue the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command and pass the name and tag of the image to it. Be sure to specify the port using the `-p` argument.

```bash
docker run -p 8080:80 -it <docker-ID>/mydockerimage:v1.0.0
```

With the custom image running in a local Docker container, verify the function app and container are functioning correctly by browsing to <http://localhost:8080>.

![Test the function app locally.](./media/functions-create-function-linux-custom-image/run-image-local-success.png)

After you have verified the function app in the container, stop the execution. Now, you can push the custom image to your Docker Hub account.

## Push the custom image to Docker Hub

A registry is an application that hosts images and provides services image and container services. In order to share your image, you must push it to a registry. Docker Hub is a registry for Docker images that allows you to host your own repositories, either public or private. 

Before you can push an image, you must sign in to Docker Hub using the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command. Replace `<docker-id>` with your account name and type in your password into the console at the prompt. For other Docker Hub password options, see the [docker login command documentation](https://docs.docker.com/engine/reference/commandline/login/).

```bash
docker login --username <docker-id> 
```

A "login succeeded" message confirms that you are logged in. After you have signed in, you push the image to Docker Hub by using the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command.

```bash
docker push <docker-id>/mydockerimage:v1.0.0
```

Verify that the push succeeded by examining the command's output.

```bash
The push refers to a repository [docker.io/<docker-id>/mydockerimage:v1.0.0]
24d81eb139bf: Pushed
fd9e998161c9: Mounted from microsoft/azure-functions-runtime
e7796c35add2: Mounted from microsoft/azure-functions-runtime
ae9a05b85848: Mounted from microsoft/azure-functions-runtime
45c86e20670d: Mounted from microsoft/azure-functions-runtime
v1.0.0: digest: sha256:be080d80770df71234eb893fbe4d... size: 2422
```
Now, you can use this image as the deployment source for a new function app in Azure. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0.21 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux App Service plan

Linux hosting for Functions is currently not supported on consumption plans. You must run on a Linux App Service plan. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md). 

[!INCLUDE [app-service-plan-no-h](../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]


## Create and deploy the custom image

The function app hosts the execution of your functions. Create a function app from a Docker Hub image by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command. 

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. As before, `<docker-id>` is your Docker account name.

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myAppServicePlan --deployment-container-image-name <docker-id>/mydockerimage:v1.0.0 
```
After the function app has been created, the Azure CLI shows information similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "containerSize": 1536,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "quickstart.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "quickstart.azurewebsites.net",
    "quickstart.scm.azurewebsites.net"
  ],
   ....
    // Remaining output has been truncated for readability.
}
```

The _deployment-container-image-name_ parameter indicates the image hosted on Docker Hub to use to create the function app. 


## Configure the function app

The function needs the connection string to connect to the default storage account. When you are publishing your custom image to a private container account, you should instead set these application settings as environment variables in the Dockerfile using the [ENV instruction](https://docs.docker.com/engine/reference/builder/#env), or equivalent. 

In this case, `<storage_account>` is the name of the storage account you created. Get the connection string with the [az storage account show-connection-string](/cli/azure/storage/account#show-connection-string) command. Add these application settings in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) command.

```azurecli-interactive
storageConnectionString=$(az storage account show-connection-string \
--resource-group myResourceGroup --name <storage_account> \
--query connectionString --output tsv)

az functionapp config appsettings set --name <function_app> \
--resource-group myResourceGroup \
--settings AzureWebJobsDashboard=$storageConnectionString \
AzureWebJobsStorage=$storageConnectionString
```

You can now test your functions running on Linux in Azure.

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Build a custom image using Docker.
> * Publish a custom image to a container registry. 
> * Create an Azure Storage account. 
> * Create a Linux App Service plan. 
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app.

Learn how to enable continuous integration functionality built into the core App Service platform. You can configure your function app so that the container is redeployed when you update your image in Docker Hub.

> [!div class="nextstepaction"] 
> [Continuous deployment with Web App for Containers](../app-service/containers/app-service-linux-ci-cd.md)
