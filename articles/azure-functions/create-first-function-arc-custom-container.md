---
title: 'Quickstart: Create a function app on Azure Arc in a custom container'
description: Get started with Azure Functions on Azure Arc by deploying your first function app in a custom Linux container.
ms.topic: quickstart
ms.date: 05/11/2021
---

# Create your first function on Azure Arc using a custom container (preview)

In this quickstart, you create an Azure Functions project running in a custom container and deploy it to an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md) from your Docker Hub account. To learn more, see [App Service, Functions, and Logic Apps on Azure Arc](../app-service/overview-arc-integration.md). This scenario only supports function apps running on Linux.   

> [!NOTE]
> Support for running functions on an Azure Arc-enabled Kubernetes cluster is currently in preview.  

## Prerequisites

On your local computer:

# [C\#](#tab/csharp)

+ [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)
+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.0.3245 or later.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.
+ [Docker](https://docs.docker.com/install/)  
+ [Docker ID](https://hub.docker.com/signup)

# [JavaScript](#tab/nodejs)

+ [Node.js](https://nodejs.org/) version 12. Node.js version 10 is also supported.
+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.0.3245 or later.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.
+ [Docker](https://docs.docker.com/install/)  
+ [Docker ID](https://hub.docker.com/signup)

# [Python](#tab/python)

+ [Python versions that are supported by Azure Functions](supported-languages.md#languages-by-runtime-version)
+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.0.3245 or later.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.
+ [Docker](https://docs.docker.com/install/)  
+ [Docker ID](https://hub.docker.com/signup)

---

[!INCLUDE [functions-arc-create-environment](../../includes/functions-arc-create-environment.md)]

[!INCLUDE [app-service-arc-cli-install-extensions](../../includes/app-service-arc-cli-install-extensions.md)]

## Create the local function project

In Azure Functions, a function project is the context for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

    # [C\#](#tab/csharp)

    ```console
    func init LocalFunctionProj --dotnet --docker
    ```
    # [JavaScript](#tab/nodejs)

    ```console
    func init LocalFunctionProj --javascript --docker
    ```

    # [Python](#tab/python)

    Python requires a virtual environment, the commands for which differ between bash and a Windows command line.
    
     + Bash: 

        ```bash
        python -m venv .venv
        source .venv/bin/activate
        ```
    
     + Command line:

        ```cmd
        py -m venv .venv
        .venv\scripts\activate
        ```  

    Now, you create the project inside the virtual environment. 
    
    ```console
    func init LocalFunctionProj --python --docker
    ```
    ---

    The `--docker` option generates a `Dockerfile` for the project, which defines a suitable custom container for use with Azure Functions and the selected runtime.

1. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```

    This folder contains the Dockerfile other files for the project, including configurations files named [local.settings.json](functions-develop-local.md#local-settings-file) and [host.json](functions-host-json.md). By default, the *local.settings.json* file is excluded from source control in the *.gitignore* file. This exclusion is because the file can contain secrets that are downloaded from Azure.

1. Open the generated `Dockerfile` and locate the `3.0` tag for the base image. If there's a `3.0` tag, replace it with a `3.0.15885` tag. For example, in a JavaScript application, the Docker file should be modified to have `FROM mcr.microsoft.com/azure-functions/node:3.0.15885`. This version of the base image supports deployment to an Azure Arc-enabled Kubernetes cluster. 

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```  

## Build the container image and test locally

The Dockerfile in the project root describes the minimum required environment to run the function app in a container. The complete list of supported base images for Azure Functions can be found in the [Azure Functions base image page](https://hub.docker.com/_/microsoft-azure-functions-base).

1. In the root project folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command, and provide a name, `azurefunctionsimage`, and tag, `v1.0.0`.   

    The following command builds the Docker image for the container.

    ```console
    docker build --tag <DOCKER_ID>/azurefunctionsimage:v1.0.0 .
    ```

    In this example, replace `<DOCKER_ID>` with your Docker Hub account ID. When the command completes, you can run the new container locally.
    
1. To test the build, run the image in a local container using the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command, with the adding the ports argument, `-p 8080:80`.

    ```console
    docker run -p 8080:80 -it <docker_id>/azurefunctionsimage:v1.0.0
    ```

    Again, replace `<DOCKER_ID` with your Docker ID and adding the ports argument, `-p 8080:80`

1. After the image is running in a local container, browse to `http://localhost:8080/api/HttpExample?name=Functions`, which should display the same "hello" message as before. Because the HTTP triggered function uses anonymous authorization, you can still call the function even though it's running in the container. Function access key settings are enforced when running locally in a container. If you have problems calling the function, make sure that [access to the function](functions-bindings-http-webhook-trigger.md#authorization-keys) is set to anonymous.  

After you've verified the function app in the container, stop docker with **Ctrl**+**C**.

## Push the image to Docker Hub

Docker Hub is a container registry that hosts images and provides image and container services. To share your image, which includes deploying to Azure, you must push it to a registry.

1. If you haven't already signed in to Docker, do so with the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command, replacing `<docker_id>` with your Docker ID. This command prompts you for your username and password. A "Login Succeeded" message confirms that you're signed in.

    ```console
    docker login
    ```
    
1. After you've signed in, push the image to Docker Hub by using the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command, again replacing `<docker_id>` with your Docker ID.

    ```console
    docker push <docker_id>/azurefunctionsimage:v1.0.0
    ```

1. Depending on your network speed, pushing the image the first time might take a few minutes (pushing subsequent changes is much faster). While you're waiting, you can proceed to the next section and create Azure resources in another terminal.

[!INCLUDE [functions-arc-get-custom-location](../../includes/functions-arc-get-custom-location.md)]

## Create Azure resources 

Before you can deploy your container to your new App Service Kubernetes environment, you need to create two more resources:

- A [Storage account](../storage/common/storage-account-create.md), which is currently required by tooling and isn't part of the environment.
- A function app, which provides the context for running your container. The function app runs in the App Service Kubernetes environment and maps to your local function project. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

> [!NOTE]
> Function apps run in an App Service Kubernetes environment on a Dedicated (App Service) plan. When you create your function app without an existing plan, a plan is created for you.  

### Create Storage account

Use the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command to create a general-purpose storage account in your resource group and region:

```azurecli
az storage account create --name <STORAGE_NAME> --location westeurope --resource-group myResourceGroup --sku Standard_LRS
```

> [!NOTE]  
> A storage account is currently required by Azure Functions tooling. 

In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements). The `--location` value is a standard Azure region. 

### Create the function app

Run the [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command to create a new function app in the environment.

# [C\#](#tab/csharp)  
```azurecli
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 3 --runtime dotnet --deployment-container-image-name <DOCKER_ID>/azurefunctionsimage:v1.0.0
```

# [JavaScript](#tab/nodejs)  
```azurecli
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 3 --runtime node --runtime-version 12 --deployment-container-image-name <DOCKER_ID>/azurefunctionsimage:v1.0.0
```

# [Python](#tab/python)  
```azurecli
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 3 --runtime python --runtime-version 3.8 --deployment-container-image-name <DOCKER_ID>/azurefunctionsimage:v1.0.0
```
---

In this example, replace `<CUSTOM_LOCATION_ID>` with the ID of the custom location you determined for the App Service Kubernetes environment. Also, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, `<APP_NAME>` with a globally unique name appropriate to you, and `<DOCKER_ID>` with your Docker Hub ID. 

The *deployment-container-image-name* parameter specifies the image to use for the function app. You can use the [az functionapp config container show](/cli/azure/functionapp/config/container#az_functionapp_config_container_show) command to view information about the image used for deployment. You can also use the [az functionapp config container set](/cli/azure/functionapp/config/container#az_functionapp_config_container_set) command to deploy from a different image.

When you first create the function app, it pulls the initial image from your Docker Hub. You can also [Enable continuous deployment to Azure](functions-create-function-linux-custom-image.md#enable-continuous-deployment-to-azure) from  Docker Hub.  

To learn how to enable SSH in the image, see [Enable SSH connections](functions-create-function-linux-custom-image.md#enable-ssh-connections).

### Set required app settings

Run the following commands to create an app setting for the storage account connection string:

```azurecli-interactive
storageConnectionString=$(az storage account show-connection-string --resource-group AzureFunctionsContainers-rg --name <STORAGE_NAME> --query connectionString --output tsv)
az functionapp config appsettings set --name <app_name> --resource-group AzureFunctionsContainers-rg --settings AzureWebJobsStorage=$storageConnectionString
```

This code must be run either in Cloud Shell or in Bash on your local computer. Replace `<STORAGE_NAME>` with the name of the storage account and `<APP_NAME>` with the function app name.  

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

## Next steps

Now that you have your function app running in a container an Azure Arc-enabled App Service Kubernetes environment, you can connect it to Azure Storage by adding a Queue Storage output binding.

# [C\#](#tab/csharp)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-csharp)

# [JavaScript](#tab/nodejs)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-javascript)

# [Python](#tab/python)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python)

---
