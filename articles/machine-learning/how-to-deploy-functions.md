---
title: Deploy ml models to Azure Functions Apps (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning to deploy a model to an Azure Functions App.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: vaidyas
author: vaidyas
ms.reviewer: larryfr
ms.date: 11/22/2019


---

# Deploy a machine learning model to Azure Functions (preview)
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to deploy a model from Azure Machine Learning as a function app in Azure Functions.

> [!IMPORTANT]
> While both Azure Machine Learning and Azure Functions are generally available, the ability to package a model from the Machine Learning service for Functions is in preview.

With Azure Machine Learning, you can create Docker images from trained machine learning models. Azure Machine Learning now has the preview functionality to build these machine learning models into function apps, which can be [deployed into Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-deployment-technologies#docker-container).

## Prerequisites

* An Azure Machine Learning workspace. For more information, see the [Create a workspace](how-to-manage-workspace.md) article.
* The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
* A trained machine learning model registered in your workspace. If you do not have a model, use the [Image classification tutorial: train model](tutorial-train-models-with-aml.md) to train and register one.

    > [!IMPORTANT]
    > The code snippets in this article assume that you have set the following variables:
    >
    > * `ws` - Your Azure Machine Learning workspace.
    > * `model` - The registered model that will be deployed.
    > * `inference_config` - The inference configuration for the model.
    >
    > For more information on setting these variables, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

## Prepare for deployment

Before deploying, you must define what is needed to run the model as a web service. The following list describes the basic items needed for a deployment:

* An __entry script__. This script accepts requests, scores the request using the model, and returns the results.

    > [!IMPORTANT]
    > The entry script is specific to your model; it must understand the format of the incoming request data, the format of the data expected by your model, and the format of the data returned to clients.
    >
    > If the request data is in a format that is not usable by your model, the script can transform it into an acceptable format. It may also transform the response before returning to it to the client.
    >
    > By default when packaging for functions, the input is treated as text. If you are interested in consuming the raw bytes of the input (for instance for Blob triggers), you should use [AMLRequest to accept raw data](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-and-where#binary-data).


* **Dependencies**, such as helper scripts or Python/Conda packages required to run the entry script or model

These entities are encapsulated into an __inference configuration__. The inference configuration references the entry script and other dependencies.

> [!IMPORTANT]
> When creating an inference configuration for use with Azure Functions, you must use an [Environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment%28class%29?view=azure-ml-py) object. Please note that if you are defining a custom environment, you must add azureml-defaults with version >= 1.0.45 as a pip dependency. This package contains the functionality needed to host the model as a web service. The following example demonstrates creating an environment object and using it with an inference configuration:
>
> ```python
> from azureml.core.environment import Environment
> from azureml.core.conda_dependencies import CondaDependencies
>
> # Create an environment and add conda dependencies to it
> myenv = Environment(name="myenv")
> # Enable Docker based environment
> myenv.docker.enabled = True
> # Build conda dependencies
> myenv.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'],
>                                                            pip_packages=['azureml-defaults'])
> inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
> ```

For more information on environments, see [Create and manage environments for training and deployment](how-to-use-environments.md).

For more information on inference configuration, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

> [!IMPORTANT]
> When deploying to Functions, you do not need to create a __deployment configuration__.

## Install the SDK preview package for functions support

To build packages for Azure Functions, you must install the SDK preview package.

```bash
pip install azureml-contrib-functions
```

## Create the image

To create the Docker image that is deployed to Azure Functions, use [azureml.contrib.functions.package](https://docs.microsoft.com/python/api/azureml-contrib-functions/azureml.contrib.functions?view=azure-ml-py) or the specific package function for the trigger you are interested in using. The following code snippet demonstrates how to create a new package with a blob trigger from the model and inference configuration:

> [!NOTE]
> The code snippet assumes that `model` contains a registered model, and that `inference_config` contains the configuration for the inference environment. For more information, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

```python
from azureml.contrib.functions import package
from azureml.contrib.functions import BLOB_TRIGGER
blob = package(ws, [model], inference_config, functions_enabled=True, trigger=BLOB_TRIGGER, input_path="input/{blobname}.json", output_path="output/{blobname}_out.json")
blob.wait_for_creation(show_output=True)
# Display the package location/ACR path
print(blob.location)
```

When `show_output=True`, the output of the Docker build process is shown. Once the process finishes, the image has been created in the Azure Container Registry for your workspace. Once the image has been built, the location in your Azure Container Registry is displayed. The location returned is in the format `<acrinstance>.azurecr.io/package@sha256:<hash>`.

> [!NOTE]
> Packaging for functions currently supports HTTP Triggers, Blob triggers and Service bus triggers. For more information on triggers, see [Azure Functions bindings](https://docs.microsoft.com/azure/azure-functions/functions-bindings-storage-blob?tabs=csharp#trigger---blob-name-patterns).

> [!IMPORTANT]
> Save the location information, as it is used when deploying the image.

## Deploy image as a web app

1. Use the following command to get the login credentials for the Azure Container Registry that contains the image. Replace `<acrinstance>` with the value returned previously from `package.location`: 

    ```azurecli-interactive
    az acr credential show --name <myacr>
    ```

    The output of this command is similar to the following JSON document:

    ```json
    {
    "passwords": [
        {
        "name": "password",
        "value": "Iv0lRZQ9762LUJrFiffo3P4sWgk4q+nW"
        },
        {
        "name": "password2",
        "value": "=pKCxHatX96jeoYBWZLsPR6opszr==mg"
        }
    ],
    "username": "myml08024f78fd10"
    }
    ```

    Save the value for __username__ and one of the __passwords__.

1. If you do not already have a resource group or app service plan to deploy the service, the following commands demonstrate how to create both:

    ```azurecli-interactive
    az group create --name myresourcegroup --location "West Europe"
    az appservice plan create --name myplanname --resource-group myresourcegroup --sku EP1 --is-linux
    ```

    In this example, a _Linux Premium_ pricing tier (`--sku EP1`) is used.

    > [!IMPORTANT]
    > Images created by Azure Machine Learning use Linux, so you must use the `--is-linux` parameter.

1. Create the storage account to use for the web job storage and get it's connection string. Replace `<webjobStorage>` with the name you want to use.

    ```azurecli-interactive
    az storage account create --name triggerStorage --location westeurope --resource-group myresourcegroup --sku Standard_LRS
    ```
    ```azurecli-interactive
    az storage account show-connection-string --resource-group myresourcegroup --name <webJobStorage> --query connectionString --output tsv
    ```

1. To create the function app, use the following command. Replace `<app-name>` with the name you want to use. Replace `<acrinstance>` and `<imagename>` with the values from returned `package.location` earlier. Replace Replace `<webjobStorage>` with the name of the storage account from the previous step:

    ```azurecli-interactive
    az functionapp create --resource-group myresourcegroup --plan myplanname --name <app-name> --deployment-container-image-name <acrinstance>.azurecr.io/package:<imagename> --storage-account <webjobStorage>
    ```

    > [!IMPORTANT]
    > At this point, the function app has been created. However, since you haven't provided the connection string for the blob trigger or credentials to the Azure Container Registry that contains the image, the function app is not active. In the next steps, you provide the connection string and the authentication information for the container registry. 

1. Create the storage account to use for the blob trigger storage and get it's connection string. Replace `<triggerStorage>` with the name you want to use.

    ```azurecli-interactive
    az storage account create --name triggerStorage --location westeurope --resource-group myresourcegroup --sku Standard_LRS
    ```
    ```azurecli-interactive
    az storage account show-connection-string --resource-group myresourcegroup --name <triggerStorage> --query connectionString --output tsv
    ```
    Record this connection string to provide to the function app. We will use it later when we ask for `<triggerConnectionString>`

1. Create the containers for the input and output in the storage account. Replace `<triggerConnectionString>` with the connection string returned earlier:

    ```azurecli-interactive
    az storage container create -n input --connection-string <triggerConnectionString>
    ```
    ```azurecli-interactive
    az storage container create -n output --connection-string <triggerConnectionString>
    ```

1. To associate the trigger connection string with the function app, use the following command. Replace `<app-name>` with the name of the function app. Replace `<triggerConnectionString>` with the connection string returned earlier:

    ```azurecli-interactive
    az functionapp config appsettings set --name <app-name> --resource-group myresourcegroup --settings "TriggerConnectionString=<triggerConnectionString>"
    ```
1. You will need to retrieve the tag associated with the created container using the following command. Replace `<username>` with the username returned earlier from the container registry:

    ```azurecli-interactive
    az acr repository show-tags --repository package --name <username> --output tsv
    ```
    Save the value returned, it will be used as the `imagetag` in the next step.

1. To provide the function app with the credentials needed to access the container registry, use the following command. Replace `<app-name>` with the name you want to use. Replace `<acrinstance>` and `<imagetag>` with the values from the AZ CLI call in the previous step. Replace `<username>` and `<password>` with the ACR login information retrieved earlier:

    ```azurecli-interactive
    az functionapp config container set --name <app-name> --resource-group myresourcegroup --docker-custom-image-name <acrinstance>.azurecr.io/package:<imagetag> --docker-registry-server-url https://<acrinstance>.azurecr.io --docker-registry-server-user <username> --docker-registry-server-password <password>
    ```

    This command returns information similar to the following JSON document:

    ```json
    [
    {
        "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
        "slotSetting": false,
        "value": "false"
    },
    {
        "name": "DOCKER_REGISTRY_SERVER_URL",
        "slotSetting": false,
        "value": "https://myml08024f78fd10.azurecr.io"
    },
    {
        "name": "DOCKER_REGISTRY_SERVER_USERNAME",
        "slotSetting": false,
        "value": "myml08024f78fd10"
    },
    {
        "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
        "slotSetting": false,
        "value": null
    },
    {
        "name": "DOCKER_CUSTOM_IMAGE_NAME",
        "value": "DOCKER|myml08024f78fd10.azurecr.io/package:20190827195524"
    }
    ]
    ```

At this point, the function app begins loading the image.

> [!IMPORTANT]
> It may take several minutes before the image has loaded. You can monitor progress using the Azure Portal.

## Next steps

* Learn to configure your Functions App in the [Functions](/azure/azure-functions/functions-create-function-linux-custom-image) documentation.
* Learn more about Blob storage triggers [Azure Blob storage bindings](https://docs.microsoft.com/azure/azure-functions/functions-bindings-storage-blob).
* [Deploy your model to Azure App Service](how-to-deploy-app-service.md).
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [API Reference](https://docs.microsoft.com/python/api/azureml-contrib-functions/azureml.contrib.functions?view=azure-ml-py)