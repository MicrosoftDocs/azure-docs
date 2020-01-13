---
title: Create Azure Functions on Linux using a custom image
description: Learn how to create Azure Functions running on a custom Linux image.
ms.date: 01/10/2020
ms.topic: tutorial
ms.custom: mvc
---

# Create a function on Linux using a custom image

In this tutorial, you create and deploy Python code to Azure Functions as a custom Docker container using a Linux base image. You typically use a custom image when your functions require a specific language version or have a specific dependency or configuration that isn't provided by the built-in image. You can follow this tutorial on any computer running Windows, Mac OS, or Linux.

You can also use a default Azure App Service container as described on [Create your first function hosted on Linux](functions-create-first-azure-function-azure-cli-linux.md). Supported base images for Azure Functions are found in the [Azure Functions base images repo](https://hub.docker.com/_/microsoft-azure-functions-base).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a function app and Dockerfile using the Azure Functions Core Tools.
> * Build a custom image using Docker.
> * Publish a custom image to a container registry.
> * Create supporting resources in Azure for the function app
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app.
> * Enable continuous deployment.
> * Enable SSH connections to the container.
> * Add a Queue storage output binding. 

## Prerequisites

- The [Azure Functions Core Tools](./functions-run-local.md#v2) version 2.7.1846 or a later.
- The [Azure CLI](/cli/azure/install-azure-cli) version 2.0.76 or later. 
- The [Azure Functions 2.x runtime](functions-versions.md).
- A supported language runtime of your choice: [].NET Core (2.2.x or later)](https://dotnet.microsoft.com/download), [Node.js](https://nodejs.org/en/download/), [TypeScript](http://www.typescriptlang.org/#download-links), [Python 3.6](https://www.python.org/downloads/release/python-3610/) or [Python 3.7](https://www.python.org/downloads/release/python-376/), or [PowerShell](/powershell/scripting/install/installing-windows-powershell?view=powershell-7).
- [Docker](https://docs.docker.com/install/)
- A [Docker ID](https://hub.docker.com/signup)
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

### Prerequisite check

1. In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 2.7.1846 or later.
1. Run `az --version` to check that the Azure CLI version is 2.0.76 or later.
1. Run `az login` to sign in to Azure and verify an active subscription.
1. Run `docker login` to sign in to Docker. This command fails if Docker is not running, in which case start docker and retry the command.

## Create and test the local functions project

1. In a terminal or command prompt, create a folder for this tutorial in an appropriate location, then navigate into that folder.

1. Follow the instructions on [Create and activate a virtual environment](functions-create-first-function-python.md#create-and-activate-a-virtual-environment) to create a virtual environment for use with this tutorial.

1. Run the following command for your chosen language to create a function app project in a folder named `LocalFunctionsProject`. The `--docker` option generates a `Dockerfile` for the project, which defines a suitable custom container for use with Azure Functions and the selected runtime.

    # [C#](#tab/csharp)

    ```
    func init LocalFunctionsProject --worker-runtime dotnet --docker
    ```

    # [Node.js (JavaScript)](#tab/nodejs)

    ```
    func init LocalFunctionsProject --worker-runtime node --language javascript --docker
    ```

    # [Node.js (TypeScript)](#tab/typescript)
    
    ```
    func init LocalFunctionsProject --worker-runtime node --language typescript --docker
    ```

    # [Python](#tab/python)

    ```
    func init LocalFunctionsProject --worker-runtime python --docker
    ```

    # [PowerShell](#tab/powershell)

    ```
    func init LocalFunctionsProject --worker-runtime powershell --docker
    ```

    ---

1. Navigate into the project folder:

    ```
    cd LocalFunctionsProject
    ```
    
1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger. `func new` create a subfolder matching the function name that contains a code file appropriate to the project's chosen language and a configuration file named *function.json*.

    ```
    func new --name HttpExample --template "HTTP trigger"
    ```

1. To test the function locally, start the local Azure Functions runtime host in the *LocalFunctionsProject* folder:
   
    # [C#](#tab/csharp)

    ```
    func start --build
    ```

    # [Node.js (JavaScript)](#tab/nodejs)

    ```
    func start
    ```

    # [Node.js (TypeScript)](#tab/typescript)
    
    ```
    npm install
    ```

    ```
    npm start
    ```

    # [Python](#tab/python)

    ```
    func start
    ```

    # [PowerShell](#tab/powershell)

    ```
    func start
    ```

    ---

1. Once you see the `HttpExample` endpoint appear in the output, navigate to `http://localhost:7071/api/HttpExample?name=Azure`. The browser should display a message like "Hello, Azure" (with variations depending on the runtime).

1. Use **Ctrl**-**C** to stop the host.


## Build the container image and test locally

1. (Optional) Examine the *Dockerfile" in the *LocalFunctionsProj* folder. The Dockerfile describes the required environment to run the function app on Linux: 

    # [C#](#tab/csharp)

    ```Dockerfile
    FROM microsoft/dotnet:2.2-sdk AS installer-env

    COPY . /src/dotnet-function-app
    RUN cd /src/dotnet-function-app && \
        mkdir -p /home/site/wwwroot && \
        dotnet publish *.csproj --output /home/site/wwwroot
    
    # To enable ssh & remote debugging on app service change the base image to the one below
    # FROM mcr.microsoft.com/azure-functions/dotnet:2.0-appservice 
    FROM mcr.microsoft.com/azure-functions/dotnet:2.0
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    
    COPY --from=installer-env ["/home/site/wwwroot", "/home/site/wwwroot"]
    ```

    # [Node.js (JavaScript)](#tab/nodejs)

    ```Dockerfile
    # To enable ssh & remote debugging on app service change the base image to the one below
    # FROM mcr.microsoft.com/azure-functions/node:2.0-appservice
    FROM mcr.microsoft.com/azure-functions/node:2.0
    
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    
    COPY . /home/site/wwwroot
    
    RUN cd /home/site/wwwroot && \
    npm install    
    ```

    # [Node.js (TypeScript)](#tab/typescript)
    
    ```Dockerfile
    # To enable ssh & remote debugging on app service change the base image to the one below
    # FROM mcr.microsoft.com/azure-functions/node:2.0-appservice
    FROM mcr.microsoft.com/azure-functions/node:2.0
    
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    
    COPY . /home/site/wwwroot
    
    RUN cd /home/site/wwwroot && \
    npm install    
    ```


    # [Python](#tab/python)

    ```Dockerfile
    # To enable ssh & remote debugging on app service change the base image to the one below
    # FROM mcr.microsoft.com/azure-functions/python:2.0-python3.7-appservice
    FROM mcr.microsoft.com/azure-functions/python:2.0-python3.7
    
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    
    COPY requirements.txt /
    RUN pip install -r /requirements.txt
    
    COPY . /home/site/wwwroot    
    ```

    # [PowerShell](#tab/powershell)

    ```Dockerfile
    # To enable ssh & remote debugging on app service change the base image to the one below
    # FROM mcr.microsoft.com/azure-functions/powershell:2.0-appservice
    FROM mcr.microsoft.com/azure-functions/powershell:2.0
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    
    COPY . /home/site/wwwroot    
    ```

    ---

    > [!NOTE]
    > The complete list of supported base images for Azure Functions can be found in the [Azure Functions base image page](https://hub.docker.com/_/microsoft-azure-functions-base).
    
1. In the *LocalFunctionsProject* folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command, and provide a name, `mydockerimage`, and tag, `v1.0.0`. Replace `<docker-id>` with your Docker Hub account ID. This command builds the Docker image for the container.

    ```
    docker build --tag <docker-id>/mydockerimage:v1.0.0 .
    ```
    
    When the command completes, you can run the new container locally.
    
1. To test the build, run the image in a local container using the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command, supplying the name and tag of the image along with ports argument, `-p 8080:80`:

    ```
    docker run -p 8080:80 -it <docker-ID>/mydockerimage:v1.0.0
    ```
    
1. Once the image is running in a local container, open a browser to `http://localhost:8080`, which should display a placeholder image. The image appears at this point because your function is running in the local container, as it would in Azure, and the which means that it's protected by an access key as defined in *function.json* with the `"authLevel": "function"` property. The container hasn't yet been published to a function app in Azure, however, so the key isn't yet available. If you want to test locally, stop docker, change the authorization property to `"authLevel": "anonymous"`, rebuild the image, and restart docker. Then reset `"authLevel": "function"` in *function.json*. For more information, see [authorization keys](functions-bindings-http-webhook.md#authorization-keys).

    ![Run the function app locally.](./media/functions-create-function-linux-custom-image/run-image-local-success.png)

1. After you have verified the function app in the container, stop docker with **Ctrl**+**C**.

## Push the image to Docker Hub

Docker Hub is a container registry that hosts images and provides image and container services. To share your image, which includes deploying to Azure, you must push it to a registry.

1. If you haven't already signed in to Docker, do so with the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command, replacing `<docker-id>` with your Docker ID. This command prompts you for your password. A "login succeeded" message confirms that you're signed in.

    ```
    docker login --username <docker-id>
    ```
    
1. After you've signed in, push the image to Docker Hub by using the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command, again replacing `<docker-id>` with your Docker ID.

    ```
    docker push <docker-id>/mydockerimage:v1.0.0
    ```
    
## Create supporting Azure resources for your function

To deploy your function code to Azure, you need to create three resources:

- A resource group, which is a logical container for related resources.
- An Azure Storage account, which maintains state and other information about your projects.
- An Azure functions app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

You use Azure CLI commands to create these items. Each command provides JSON output upon completion.

1. If you haven't done so already, sign in to Azure with the [az login](/cli/azure/group#az-login) command:

    ```azurecli
    az login
    ```
    
1. Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named `AzureFunctionsQuickstart-rg` in the `westeurope` region. (You generally create your resource group and resources in a region near you, using an available region from the `az account list-locations` command.)

    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location westeurope
    ```
    
    > [!NOTE]
    > You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `AzureFunctionsQuickstart-rg` with a Windows function app or web app, you must use a different resource group.
    
1. Create a general-purpose storage account in your resource group and region by using the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command. In the following example, replace `<storage_name>` with a globally unique name appropriate to you. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a typical general-purpose account.

    ```azurecli
    az storage account create --name <storage_name> --location westeurope --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
    ```
    
    The storage account incurs only a few USD cents for this tutorial.
    
1. Use the command to create a Premium plan for Azure Functions named `myPremiumPlan` in the **Elastic Premium 1** pricing tier (`--sku EP1`), in the West Europe region (`-location westeurope`, or use a suitable region near you), and in a Linux container (`--is-linux`).

    ```azurecli
    az functionapp plan create --resource-group myResourceGroup --name myPremiumPlan --location westeurope --number-of-workers 1 --sku EP1 --is-linux
    ```   

    Linux hosting for custom Functions containers are supported on [Dedicated (App Service) plans](functions-scale.md#app-service-plan) and [Premium plans](functions-premium-plan.md#features). We use the Premium plan here, which can scale as needed. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md).   

## Create an function app on Azure from the image

A function app on Azure manages the execution of your functions in your hosting plan. In this section, you create a function app from an image on Docker Hub.


 Docker Hub image by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command.

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. As before, `<docker-id>` is your Docker account name.

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myPremiumPlan --deployment-container-image-name <docker-id>/mydockerimage:v1.0.0
```

The _deployment-container-image-name_ parameter indicates the image hosted on Docker Hub to use to create the function app. Use the [az functionapp config container show](/cli/azure/functionapp/config/container#az-functionapp-config-container-show) command to view information about the image used for deployment. Use the [az functionapp config container set](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to deploy from a different image.



1. Create the Functions app using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command. In the following example, replace `<storage_name>` with the name of the account you used in the previous step, and replace `<app_name>` with a globally unique name appropriate to you. The `<app_name>` is also the default DNS domain for the function app.

    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --os-type Linux --consumption-plan-location westeurope --runtime python --name <app_name> --storage-account <storage_name>
    ```
    
    This command creates a function app running the specified language runtime under the [Azure Functions Consumption Plan](functions-scale.md#consumption-plan), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.





## Configure the function app

The function needs the connection string to connect to the default storage account. When you're publishing your custom image to a private container account, you should instead set these application settings as environment variables in the Dockerfile using the [ENV instruction](https://docs.docker.com/engine/reference/builder/#env), or something similar.

In this case, `<storage_name>` is the name of the storage account you created. Get the connection string with the [az storage account show-connection-string](/cli/azure/storage/account) command. Add these application settings in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) command.

```azurecli-interactive
storageConnectionString=$(az storage account show-connection-string \
--resource-group myResourceGroup --name <storage_name> \
--query connectionString --output tsv)

az functionapp config appsettings set --name <app_name> \
--resource-group myResourceGroup \
--settings AzureWebJobsStorage=$storageConnectionString
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
docker build --tag <docker-id>/mydockerimage:v1.0.2
```

Push the updated image back to the repository.

```bash
docker push <docker-id>/mydockerimage:v1.0.2
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
