---
title: Create Azure Functions on Linux using a custom image
description: Learn how to create Azure Functions running on a custom Linux image.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 06/25/2019
ms.topic: tutorial
ms.service: azure-functions
ms.custom: mvc
ms.devlang: azure-cli
manager: jeconnoc
---

# Create a function on Linux using a custom image

Azure Functions lets you host your functions on Linux in your own custom container. You can also [host on a default Azure App Service container](functions-create-first-azure-function-azure-cli-linux.md). This functionality requires [the Functions 2.x runtime](functions-versions.md).

In this tutorial, you learn how to deploy your functions to Azure as a custom Docker image. This pattern is useful when you need to customize the built-in container image. You may want to use a custom image when your functions need a specific language version or require a specific dependency or configuration that isn't provided within the built-in image. Supported base images for Azure Functions are found in the [Azure Functions base images repo](https://hub.docker.com/_/microsoft-azure-functions-base). [Python support](functions-reference-python.md) is in preview at this time.

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

The following steps are supported on a Mac, Windows, or Linux computer. 

## Prerequisites

Before running this sample, you must have the following:

* Install [Azure Core Tools version 2.x](functions-run-local.md#v2).

* Install the [Azure CLI]( /cli/azure/install-azure-cli). This article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have.  
You can also use the [Azure Cloud Shell](https://shell.azure.com/bash).

* An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create the local function app project

Run the following command from the command line to create a function app project in the `MyFunctionProj` folder of the current local directory.

```bash
func init MyFunctionProj --docker
```

When you include the `--docker` option, a dockerfile is generated for the project. This file is used to create a custom container in which to run the project. The base image used depends on the worker runtime language chosen.  

When prompted, choose a worker runtime from the following languages:

* `dotnet`: creates a .NET Core class library project (.csproj).
* `node`: creates a JavaScript project.
* `python`: creates a Python project.

[!INCLUDE [functions-python-preview-note](../../includes/functions-python-preview-note.md)]

When the command executes, you see something like the following output:

```output
Writing .gitignore
Writing host.json
Writing local.settings.json
Writing Dockerfile
```

Use the following command to navigate to the new `MyFunctionProj` project folder.

```bash
cd MyFunctionProj
```

[!INCLUDE [functions-create-function-core-tools](../../includes/functions-create-function-core-tools.md)]

[!INCLUDE [functions-run-function-test-local](../../includes/functions-run-function-test-local.md)]

## Build the image from the Docker file

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

When the command executes, you see something like the following output, which in this case is for a JavaScript worker runtime:

```bash
Sending build context to Docker daemon  17.41kB
Step 1/3 : FROM mcr.microsoft.com/azure-functions/node:2.0
2.0: Pulling from azure-functions/node
802b00ed6f79: Pull complete
44580ea7a636: Pull complete
73eebe8d57f9: Pull complete
3d82a67477c2: Pull complete
8bd51cd50290: Pull complete
7bd755353966: Pull complete
Digest: sha256:480e969821e9befe7c61dda353f63298f2c4b109e13032df5518e92540ea1d08
Status: Downloaded newer image for mcr.microsoft.com/azure-functions/node:2.0
 ---> 7c71671b838f
Step 2/3 : ENV AzureWebJobsScriptRoot=/home/site/wwwroot
 ---> Running in ed1e5809f0b7
Removing intermediate container ed1e5809f0b7
 ---> 39d9c341368a
Step 3/3 : COPY . /home/site/wwwroot
 ---> 5e196215935a
Successfully built 5e196215935a
Successfully tagged <docker-id>/mydockerimage:v1.0.0
```

### Test the image locally
Verify that the image you built works by running the Docker image in a local container. Issue the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command and pass the name and tag of the image to it. Be sure to specify the port using the `-p` argument.

```bash
docker run -p 8080:80 -it <docker-ID>/mydockerimage:v1.0.0
```

With the custom image running in a local Docker container, verify the function app and container are functioning correctly by browsing to <http://localhost:8080>.

![Test the function app locally.](./media/functions-create-function-linux-custom-image/run-image-local-success.png)

You can optionally test your function again, this time in the local container using the following URL:

`http://localhost:8080/api/myhttptrigger?name=<yourname>`

After you have verified the function app in the container, stop the execution. Now, you can push the custom image to your Docker Hub account.

## Push the custom image to Docker Hub

A registry is an application that hosts images and provides services image and container services. To share your image, you must push it to a registry. Docker Hub is a registry for Docker images that allows you to host your own repositories, either public or private.

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
fd9e998161c9: Mounted from <docker-id>/mydockerimage
e7796c35add2: Mounted from <docker-id>/mydockerimage
ae9a05b85848: Mounted from <docker-id>/mydockerimage
45c86e20670d: Mounted from <docker-id>/mydockerimage
v1.0.0: digest: sha256:be080d80770df71234eb893fbe4d... size: 1796
```

Now, you can use this image as the deployment source for a new function app in Azure.

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Premium plan

Linux hosting for custom Functions containers supported on [Dedicated (App Service) plans](functions-scale.md#app-service-plan) and [Premium plans](functions-scale.md#premium-plan). This tutorial uses a Premium plan, which can scale as needed. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md).

The following example creates a Premium plan named `myPremiumPlan` in the **Elastic Premium 1** pricing tier (`--sku EP1`), in the West US region (`-location WestUS`), and in a Linux container (`--is-linux`).

```azurecli-interactive
az functionapp plan create --resource-group myResourceGroup --name myPremiumPlan \
--location WestUS --number-of-workers 1 --sku EP1 --is-linux
```

## Create and deploy the custom image

The function app manages the execution of your functions in your hosting plan. Create a function app from a Docker Hub image by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command.

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. As before, `<docker-id>` is your Docker account name.

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myPremiumPlan --deployment-container-image-name <docker-id>/mydockerimage:v1.0.0
```

The _deployment-container-image-name_ parameter indicates the image hosted on Docker Hub to use to create the function app. Use the [az functionapp config container show](/cli/azure/functionapp/config/container#az-functionapp-config-container-show) command to view information about the image used for deployment. Use the [az functionapp config container set](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to deploy from a different image.

## Configure the function app

The function needs the connection string to connect to the default storage account. When you are publishing your custom image to a private container account, you should instead set these application settings as environment variables in the Dockerfile using the [ENV instruction](https://docs.docker.com/engine/reference/builder/#env), or something similar.

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

You can now test your functions running on Linux in Azure.

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

## Enable continuous deployment

One of the benefits of using containers is being able to automatically deploy updates when containers are updated in the registry. Enable continuous deployment with the [az functionapp deployment container config](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-config) command.

```azurecli-interactive
az functionapp deployment container config --enable-cd \
--query CI_CD_URL --output tsv \
--name <app_name> --resource-group myResourceGroup
```

This command returns the deployment webhook URL after continuous deployment is enabled. You can also use the [az functionapp deployment container show-cd-url](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-show-cd-url) command to return this URL. 

Copy the deployment URL and browse to your DockerHub repo, choose the **Webhooks** tab, type a **Webhook name** for the webhook, paste your URL in **Webhook URL**, and then choose the plus sign (**+**).

![Add the webhook in your DockerHub repo](media/functions-create-function-linux-custom-image/dockerhub-set-continuous-webhook.png)  

With the webhook set, any updates to the linked image in DockerHub result in the function app downloading and installing the latest image.

## Enable SSH connections

SSH enables secure communication between a container and a client. With SSH enables, you can connect to your container using Advanced Tools (Kudu). To enable SSH connection to your container, you must configure SSH in your custom image. 

### Add a SSH config file to the project

In the root of your project, create a file named `sshd_config` that contains the following code:

```
#
# /etc/ssh/sshd_config
#

Port 			2222
ListenAddress 		0.0.0.0
LoginGraceTime 		180
X11Forwarding 		yes
Ciphers                 aes128-cbc,3des-cbc,aes256-cbc
MACs                    hmac-sha1,hmac-sha1-96
StrictModes 		yes
SyslogFacility 		DAEMON
PrintMotd 		no
IgnoreRhosts 		no
#deprecated option 
#RhostsAuthentication 	no
RhostsRSAAuthentication yes
RSAAuthentication 	no 
PasswordAuthentication 	yes
PermitEmptyPasswords 	no
PermitRootLogin 	yes
```

### Update the dockerfile 

Add the following code at the end of the dockerfile:

```

```

## Add a Storage binding

### Download the function app settings

In the previous quickstart article, you created a function app in Azure along with the required Storage account. The connection string for this account is stored securely in app settings in Azure. In this article, you write messages to a Storage queue in the same account. To connect to your Storage account when running the function locally, you must download app settings to the local.settings.json file. Run the following the Azure Functions Core Tools command to download settings to local.settings.json, replacing `<APP_NAME>` with the name of your function app from the previous article:

```bash
func azure functionapp fetch-app-settings <APP_NAME>
```

You may be required to sign in to your Azure account.

> [!IMPORTANT]  
> Because it contains secrets, the local.settings.json file never gets published, and it should be excluded from source control.

You need the value `AzureWebJobsStorage`, which is the Storage account connection string. You use this connection to verify that the output binding works as expected.

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

Now, you can add a the Storage output binding to your project.

## Add an output binding

In Functions, each type of binding requires a `direction`, `type`, and a unique `name` to be defined in the function.json file. Depending on the binding type, additional properties may be required. The [queue output configuration](functions-bindings-storage-queue.md#output---configuration) describes the fields required for an Azure Storage queue binding.

To create a binding, you add a binding configuration object to the `function.json` file. Edit the function.json file in your HttpTrigger folder to add an object to the `bindings` array that has the following properties:

| Property | Value | Description |
| -------- | ----- | ----------- |
| **`name`** | `msg` | Name that identifies the binding parameter referenced in your code. |
| **`type`** | `queue` | The binding is an Azure Storage queue binding. |
| **`direction`** | `out` | The binding is an output binding. |
| **`queueName`** | `outqueue` | The name of the queue that the binding writes to. When the *queueName* doesn't exist, the binding creates it on first use. |
| **`connection`** | `AzureWebJobsStorage` | The name of an app setting that contains the connection string for the Storage account. The `AzureWebJobsStorage` setting contains the connection string for the Storage account you created with the function app. |

Your function.json file should now look like the following example:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
  {
      "type": "queue",
      "direction": "out",
      "name": "msg",
      "queueName": "outqueue",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

## Add code that uses the output binding

Once it's configured, you can start using the `name` of the binding to access it as a method attribute in the function signature. In the following example, `msg` is an instance of the [`azure.functions.InputStream class`](/python/api/azure-functions/azure.functions.httprequest).

```python
import logging

import azure.functions as func


def main(req: func.HttpRequest, msg: func.Out[func.QueueMessage]) -> str:

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        msg.set(name)
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
            "Please pass a name on the query string or in the request body",
            status_code=400
        )
```

By using an output binding, you don't have to use the Azure Storage SDK code for authentication, getting a queue reference, or writing data. The Functions runtime and queue output binding do those tasks for you.

## Run the function locally

As before, use the following command to start the Functions runtime locally:

```bash
func host start
```

> [!NOTE]  
> Because the previous article had you enable extension bundles in the host.json, the [Storage binding extension](functions-bindings-storage-blob.md#packages---functions-2x) was downloaded and installed for you during startup, along with the other Microsoft binding extensions.

Copy the URL of your `HttpTrigger` function from the runtime output and paste it into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. You should see the same response in the browser as you did in the previous article.

This time, the output binding also creates a queue named `outqueue` in your Storage account and adds a message with this same string.

Next, you use the Azure CLI to view the new queue and verify that a message was added. You can also view your queue using the [Microsoft Azure Storage Explorer][Azure Storage Explorer] or in the [Azure portal](https://portal.azure.com).

### Set the Storage account connection

Open the local.settings.json file and copy the value of `AzureWebJobsStorage`, which is the Storage account connection string. Set the `AZURE_STORAGE_CONNECTION_STRING` environment variable to the connection string using the following Bash command:

```azurecli-interactive
export AZURE_STORAGE_CONNECTION_STRING=<STORAGE_CONNECTION_STRING>
```

With the connection string set in the `AZURE_STORAGE_CONNECTION_STRING` environment variable, you can access your Storage account without having to provide authentication each time.

### Query the Storage queue

You can use the [`az storage queue list`](/cli/azure/storage/queue#az-storage-queue-list) command to view the Storage queues in your account, as in the following example:

```azurecli-interactive
az storage queue list --output tsv
```

The output from this command includes a queue named `outqueue`, which is the queue that was created when the function ran.

Next, use the [`az storage message peek`](/cli/azure/storage/message#az-storage-message-peek) command to view the messages in this queue, as in the following example.

```azurecli-interactive
echo `echo $(az storage message peek --queue-name outqueue -o tsv --query '[].{Message:content}') | base64 --decode`
```

The string returned should be the same as the message you sent to test the function.

> [!NOTE]  
> The previous example decodes the returned string from base64. This is because the Queue storage bindings write to and read from Azure Storage as [base64 strings](functions-bindings-storage-queue.md#encoding).

Now, it's time to republish the updated function app to Azure.

## Rebuild and republish the updated image

<!-- Steps to rebuild the docker image with the file changes and publish again to DockerHub-->

Again, you can use cURL or a browser to test the deployed function. As before append the query string `&name=<yourname>` to the URL, as in the following example:

```bash
curl https://myfunctionapp.azurewebsites.net/api/httptrigger?code=cCr8sAxfBiow548FBDLS1....&name=<yourname>
```

You can [Examine the Storage queue message](#query-the-storage-queue) to verify that the output binding again generates a new message in the queue.

## Enable Application Insights

The recommended way to monitor the execution of your functions is by integrating your function app with Azure Application Insights. When you create a function app in the Azure portal, this integration is done for you by default. However, when you create your function app by using the Azure CLI, the integration in your function app in Azure isn't done.

To enable Application Insights for your function app:

[!INCLUDE [functions-connect-new-app-insights.md](../../includes/functions-connect-new-app-insights.md)]

To learn more, see [Monitor Azure Functions](functions-monitoring.md).

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a function app and Dockerfile using Core Tools.
> * Build a custom image using Docker.
> * Publish a custom image to a container registry.
> * Create an Azure Storage account.
> * Create a Linux Premium plan.
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app.
> * Enable Application Insights

Learn how to enable continuous integration functionality built into the core App Service platform. You can configure your function app so that the container is redeployed when you update your image in Docker Hub.

> [!div class="nextstepaction"] 
> [Continuous deployment with Web App for Containers](../app-service/containers/app-service-linux-ci-cd.md)
