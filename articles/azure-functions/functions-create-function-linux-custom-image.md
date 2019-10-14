---
title: Create Azure Functions on Linux using a custom image
description: Learn how to create Azure Functions running on a custom Linux image.
author: ggailey777
ms.author: glenga
ms.date: 09/27/2019
ms.topic: tutorial
ms.service: azure-functions
ms.custom: mvc
manager: gwallace                                                                                                            
---

# Create a function on Linux using a custom image

Azure Functions lets you host your functions on Linux in your own custom container. You can also [host on a default Azure App Service container](functions-create-first-azure-function-azure-cli-linux.md). This functionality requires [the Functions 2.x runtime](functions-versions.md).

In this tutorial, you learn how to deploy your functions to Azure as a custom Docker image. This pattern is useful when you need to customize the built-in container image. You may want to use a custom image when your functions need a specific language version or require a specific dependency or configuration that isn't provided within the built-in image. Supported base images for Azure Functions are found in the [Azure Functions base images repo](https://hub.docker.com/_/microsoft-azure-functions-base). 

This tutorial walks you through how to use Azure Functions Core Tools to create a function in a custom Linux image. You publish this image to a function app in Azure, which was created using the Azure CLI. Later, you update your function to connect to Azure Queue storage. You also enable.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a function app and Dockerfile using Core Tools.
> * Build a custom image using Docker.
> * Publish a custom image to a container registry.
> * Create an Azure Storage account.
> * Create a Premium hosting plan.
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app.
> * Enable continuous deployment.
> * Enable SSH connections to the container.
> * Add a Queue storage output binding. 
> * Add Application Insights monitoring.

The following steps are supported on a Mac, Windows, or Linux computer. 

## Prerequisites

Before running this sample, you must have the following:

* Install [Azure Core Tools version 2.x](functions-run-local.md#v2).

* Install the [Azure CLI]( /cli/azure/install-azure-cli). This article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have.  
You can also use the [Azure Cloud Shell](https://shell.azure.com/bash).

* An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [functions-cloud-shell-note](../../includes/functions-cloud-shell-note.md)]

## Create the local project

Run the following command from the command line to create a function app project in the `MyFunctionProj` folder of the current local directory. For a Python project, you [must be running in a virtual environment](functions-create-first-function-python.md#create-and-activate-a-virtual-environment-optional).

```bash
func init MyFunctionProj --docker
```

When you include the `--docker` option, a dockerfile is generated for the project. This file is used to create a custom container in which to run the project. The base image used depends on the worker runtime language chosen.  

When prompted, choose a worker runtime from the following languages:

* `dotnet`: creates a .NET Core class library project (.csproj).
* `node`: creates a JavaScript project.
* `python`: creates a Python project.  

Use the following command to navigate to the new `MyFunctionProj` project folder.

```bash
cd MyFunctionProj
```

[!INCLUDE [functions-create-function-core-tools](../../includes/functions-create-function-core-tools.md)]

[!INCLUDE [functions-run-function-test-local](../../includes/functions-run-function-test-local.md)]

## Build from the Docker file

Take a look at the _Dockerfile_ in the root folder of the project. This file describes the environment that is required to run the function app on Linux. The following example is a Dockerfile that creates a container that runs a function app on the JavaScript (Node.js) worker runtime: 

```Dockerfile
FROM mcr.microsoft.com/azure-functions/node:2.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
COPY . /home/site/wwwroot
```

> [!NOTE]
> The complete list of supported base images for Azure Functions can be found in the [Azure Functions base image page](https://hub.docker.com/_/microsoft-azure-functions-base).

### Run the `build` command

In the root folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command, and provide a name, `mydockerimage`, and tag, `v1.0.0`. Replace `<docker-id>` with your Docker Hub account ID. This command builds the Docker image for the container.

```bash
docker build --tag <docker-id>/mydockerimage:v1.0.0 .
```

When the command completes, you can run the new container locally.

### Run the image locally
Verify that the image you built works by running the Docker image in a local container. Issue the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command and pass the name and tag of the image to it. Be sure to specify the port using the `-p` argument.

```bash
docker run -p 8080:80 -it <docker-ID>/mydockerimage:v1.0.0
```

With the custom image running in a local Docker container, verify the function app and container are functioning correctly by browsing to <http://localhost:8080>.

![Run the function app locally.](./media/functions-create-function-linux-custom-image/run-image-local-success.png)

> [!NOTE]
> At this point, when you try to call your specific HTTP function, you get an HTTP 401 error response. This is because your function runs in the local container as it would in Azure, which means that the function key is required. Because the container hasn't yet been published to a function app, there is no function key available. You'll see later that when you use Core Tools to publish your container, the function keys are shown to you. If you want to test your function running in the local container, you can change the [authorization key](functions-bindings-http-webhook.md#authorization-keys) to `anonymous`. 

After you have verified the function app in the container, stop the execution. Now, you can push the custom image to your Docker Hub account.

## Push to Docker Hub

A registry is an application that hosts images and provides services image and container services. To share your image, you must push it to a registry. Docker Hub is a registry for Docker images that allows you to host your own repositories, either public or private.

Before you can push an image, you must sign in to Docker Hub using the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command. Replace `<docker-id>` with your account name and type in your password into the console at the prompt. For other Docker Hub password options, see the [docker login command documentation](https://docs.docker.com/engine/reference/commandline/login/).

```bash
docker login --username <docker-id>
```

A "login succeeded" message confirms that you're logged in. After you have signed in, you push the image to Docker Hub by using the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command.

```bash
docker push <docker-id>/mydockerimage:v1.0.0
```

After the push succeeds, you can use the image as the deployment source for a new function app in Azure.

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Premium plan

Linux hosting for custom Functions containers supported on [Dedicated (App Service) plans](functions-scale.md#app-service-plan) and [Premium plans](functions-premium-plan.md#features). This tutorial uses a Premium plan, which can scale as needed. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md).

The following example creates a Premium plan named `myPremiumPlan` in the **Elastic Premium 1** pricing tier (`--sku EP1`), in the West US region (`-location WestUS`), and in a Linux container (`--is-linux`).

```azurecli-interactive
az functionapp plan create --resource-group myResourceGroup --name myPremiumPlan \
--location WestUS --number-of-workers 1 --sku EP1 --is-linux
```

## Create an app from the image

The function app manages the execution of your functions in your hosting plan. Create a function app from a Docker Hub image by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command.

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. As before, `<docker-id>` is your Docker account name.

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myPremiumPlan --deployment-container-image-name <docker-id>/mydockerimage:v1.0.0
```

The _deployment-container-image-name_ parameter indicates the image hosted on Docker Hub to use to create the function app. Use the [az functionapp config container show](/cli/azure/functionapp/config/container#az-functionapp-config-container-show) command to view information about the image used for deployment. Use the [az functionapp config container set](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to deploy from a different image.

## Configure the function app

The function needs the connection string to connect to the default storage account. When you're publishing your custom image to a private container account, you should instead set these application settings as environment variables in the Dockerfile using the [ENV instruction](https://docs.docker.com/engine/reference/builder/#env), or something similar.

In this case, `<storage_name>` is the name of the storage account you created. Get the connection string with the [az storage account show-connection-string](/cli/azure/storage/account) command. Add these application settings in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) command.

```azurecli-interactive
storageConnectionString=$(az storage account show-connection-string \
--resource-group myResourceGroup --name <storage_name> \
--query connectionString --output tsv)

az functionapp config appsettings set --name <app_name> \
--resource-group myResourceGroup \
--settings AzureWebJobsDashboard=$storageConnectionString \
AzureWebJobsStorage=$storageConnectionString
```

> [!NOTE]
> If your container is private, you would have to set the following application settings as well  
> - DOCKER_REGISTRY_SERVER_USERNAME  
> - DOCKER_REGISTRY_SERVER_PASSWORD  
>
> You will have to stop and then start your function app for these values to be picked up

## Verify your functions

<!-- we should replace this with a CLI or API-based approach, when we get something better than REST -->

The HTTP-triggered function you created requires a [function key](functions-bindings-http-webhook.md#authorization-keys) when calling the endpoint. At this time, the easiest way to get your function URL, including the key, is from the [Azure portal]. 

> [!TIP]
> You can also obtain your function keys by using the [Key management APIs](https://github.com/Azure/azure-functions-host/wiki/Key-management-API), which requires you to present a [bearer token for authentication](/cli/azure/account#az-account-get-access-token).

Locate your new function app in the [Azure portal] by typing your function app name in the **Search** box at the top of the page and selecting the **App Service** resource.

Select the **MyHttpTrigger** function, select **</> Get function URL** > **default (Function key)** > **Copy**.

![Copy the function URL from the Azure portal](./media/functions-create-function-linux-custom-image/functions-portal-get-url-key.png)

In this URL, the function key is the `code` query parameter. 

> [!NOTE]  
> Because your function app is deployed as a container, you can't make changes to your function code in the portal. You must instead update the project in local container and republish it to Azure.

Paste the function URL into your browser's address bar. Add the query string value `&name=<yourname>` to the end of this URL and press the `Enter` key on your keyboard to execute the request. You should see the response returned by the function displayed in the browser.

The following example shows the response in the browser:

![Function response in the browser.](./media/functions-create-function-linux-custom-image/function-app-browser-testing.png)

The request URL includes a key that is required, by default, to access your function over HTTP. 

## Enable continuous deployment

One of the benefits of using containers is support for continuous deployment. Functions lets you automatically deploy updates when your container is updated in the registry. Enable continuous deployment with the [az functionapp deployment container config](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-config) command.

```azurecli-interactive
az functionapp deployment container config --enable-cd \
--query CI_CD_URL --output tsv \
--name <app_name> --resource-group myResourceGroup
```

This command returns the deployment webhook URL after continuous deployment is enabled. You can also use the [az functionapp deployment container show-cd-url](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-show-cd-url) command to return this URL. 

Copy the deployment URL and browse to your DockerHub repo, choose the **Webhooks** tab, type a **Webhook name** for the webhook, paste your URL in **Webhook URL**, and then choose the plus sign (**+**).

![Add the webhook in your DockerHub repo](./media/functions-create-function-linux-custom-image/dockerhub-set-continuous-webhook.png)  

With the webhook set, any updates to the linked image in DockerHub result in the function app downloading and installing the latest image.

## Enable SSH connections

SSH enables secure communication between a container and a client. With SSH enabled, you can connect to your container using App Service Advanced Tools (Kudu). To make it easy to connect to your container using SSH, Functions provide a base image that has SSH already enabled. 

### Change the base image

In your dockerfile, append the string `-appservice` to the base image in your `FROM` instruction, which for a JavaScript project looks like the following.

```docker
FROM mcr.microsoft.com/azure-functions/node:2.0-appservice
```

The differences in the two base images enable SSH connections into your container. These differences are detailed in [this App Services tutorial](../app-service/containers/tutorial-custom-docker-image.md#enable-ssh-connections).

### Rebuild and redeploy the image

In the root folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command again, as before, replace `<docker-id>` with your Docker Hub account ID. 

```bash
docker build --tag <docker-id>/mydockerimage:v1.0.0 .
```

Push the updated image back to Docker Hub.

```bash
docker push <docker-id>/mydockerimage:v1.0.0
```

The updated image is redeployed to your function app.

### Connect to your container in Azure

In the browser, navigate to the following Advanced Tools (Kudu) `scm.` endpoint for your function app container, replacing `<app_name>` with the name of your function app.

```
https://<app_name>.scm.azurewebsites.net/
```

Sign in to your Azure account, and then select the **SSH** tab to create an SSH connection into your container.

After the connection is established, run the `top` command to view the currently running processes. 

![Linux top command running in an SSH session.](media/functions-create-function-linux-custom-image/linux-custom-kudu-ssh-top.png)

## Write to Queue storage

Functions lets you connect Azure services and other resources to functions without having to write your own integration code. These *bindings*, which represent both input and output, are declared within the function definition. Data from bindings is provided to the function as parameters. A *trigger* is a special type of input binding. Although a function has only one trigger, it can have multiple input and output bindings. To learn more, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

This section shows you how to integrate your function with an Azure Storage queue. The output binding that you add to this function writes data from an HTTP request to a message in the queue.

### Download the function app settings

[!INCLUDE [functions-app-settings-download-local-cli](../../includes/functions-app-settings-download-local-cli.md)]

### Enable extension bundles

Because you are using a Queue storage output binding, you must have the Storage bindings extension installed before you run the project. 


# [JavaScript / Python](#tab/nodejs+python)

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

# [C\#](#tab/csharp)

With the exception of HTTP and timer triggers, bindings are implemented as extension packages. Run the following [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to add the Storage extension package to your project.

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Storage --version 3.0.4
```

> [!TIP]
> When using Visual Studio, you can also use the NuGet package manager to add this package.

---

Now, you can add a Storage output binding to your project.

### Add an output binding

In Functions, each type of binding requires a `direction`, `type`, and a unique `name` to be defined in the function.json file. The way you define these attributes depends on the language of your function app.

# [JavaScript / Python](#tab/nodejs+python)

[!INCLUDE [functions-add-output-binding-json](../../includes/functions-add-output-binding-json.md)]

# [C\#](#tab/csharp)

[!INCLUDE [functions-add-storage-binding-csharp-library](../../includes/functions-add-storage-binding-csharp-library.md)]

---

### Add code that uses the output binding

After the binding is defined, you can use the `name` of the binding to access it as an attribute in the function signature. By using an output binding, you don't have to use the Azure Storage SDK code for authentication, getting a queue reference, or writing data. The Functions runtime and queue output binding do those tasks for you.

# [JavaScript](#tab/nodejs)

[!INCLUDE [functions-add-output-binding-js](../../includes/functions-add-output-binding-js.md)]

# [Python](#tab/python)

[!INCLUDE [functions-add-output-binding-python](../../includes/functions-add-output-binding-python.md)]

# [C\#](#tab/csharp)

[!INCLUDE [functions-add-storage-binding-csharp-library-code](../../includes/functions-add-storage-binding-csharp-library-code.md)]

---

### Update the hosted container

In the root folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command again, and this time update the version in the tag to `v1.0.2`. As before, replace `<docker-id>` with your Docker Hub account ID. 

```bash
docker build --tag <docker-id>/mydockerimage:v1.0.0 .
```

Push the updated image back to the repository.

```bash
docker push <docker-id>/mydockerimage:v1.0.0
```

### Verify the updates in Azure

Use the same URL as before from the browser to trigger your function. You should see the same response. However, this time the string that you pass as the `name` parameter is written to the `outqueue` storage queue.

[!INCLUDE [functions-storage-account-set-cli](../../includes/functions-storage-account-set-cli.md)]

[!INCLUDE [functions-query-storage-cli](../../includes/functions-query-storage-cli.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

Now that you have successfully deployed your custom container to a function app in Azure, consider reading more about the following topics:

+ [Monitoring functions](functions-monitoring.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)

[Azure portal]: https://portal.azure.com
