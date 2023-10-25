---
title: Deploy a machine learning model to Azure Functions with Azure Cache for Redis 
description: In this article, you deploy a model from Azure Machine Learning as a function app in Azure Functions using an Azure Cache for Redis instance. Azure Cache for Redis is performant and scalable – when paired with an Azure Machine Learning model, you gain low latency and high throughput in your application.  
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 06/09/2021
---

# Deploy a machine learning model to Azure Functions with Azure Cache for Redis

In this article, you deploy a model from Azure Machine Learning as a function app in Azure Functions using an Azure Cache for Redis instance.  

Azure Cache for Redis is performant and scalable. When paired with an Azure Machine Learning model, you gain low latency and high throughput in your application. A couple scenarios where a cache is beneficial: when inferencing the data and for the actual model inference results. In either scenario, the meta data or results are stored in-memory, which leads to increased performance.

> [!NOTE]
> While both Azure Machine Learning and Azure Functions are generally available, the ability to package a model from the Machine Learning service for Functions is in preview.  
>

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/).
* An Azure Machine Learning workspace. For more information, see the [Create a workspace](../machine-learning/how-to-manage-workspace.md) article.
* [Azure CLI](/cli/azure/install-azure-cli).
* A trained machine learning model registered in your workspace. If you do not have a model, use the [Image classification tutorial: train model](../machine-learning/tutorial-train-models-with-aml.md) to train and register one.

> [!IMPORTANT]
> The code snippets in this article assume that you have set the following variables:
>
> * `ws` - Your Azure Machine Learning workspace.
> * `model` - The registered model that will be deployed.
> * `inference_config` - The inference configuration for the model.
>
> For more information on setting these variables, see [Deploy models with Azure Machine Learning](../machine-learning/how-to-deploy-managed-online-endpoints.md).

## Create an Azure Cache for Redis instance

You’ll be able to deploy a machine learning model to Azure Functions with any Basic, Standard, or Premium cache instance. To create a cache instance, follow these steps.  

1. Go to the Azure portal homepage or open the sidebar menu, then select **Create a resource**.

1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/cache-private-link/2-select-cache.png" alt-text="Select Azure Cache for Redis.":::

1. On the **New Redis Cache** page, configure the settings for your new cache.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters. The string can contain only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's _host name_ will be _\<DNS name>.redis.cache.windows.net_. |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Location** | Drop down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your cache. |
   | **Pricing tier** | Drop down and select a [Pricing tier](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |

1. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select your connectivity method.

1. Select the **Next: Advanced** tab or select the **Next: Advanced** button on the bottom of the page.

1. In the **Advanced** tab for a basic or standard cache instance, select the enable toggle if you want to enable a non-TLS port.

1. In the **Advanced** tab for premium cache instance, configure the settings for non-TLS port, clustering, and data persistence.

1. Select the **Next: Tags** tab or select the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

## Prepare for deployment

Before deploying, you must define what is needed to run the model as a web service. The following list describes the core items needed for a deployment:

* An **entry script**. This script accepts requests, scores the request using the model, and returns the results.

    > [!IMPORTANT]
    > The entry script is specific to your model; it must understand the format of the incoming request data, the format of the data expected by your model, and the format of the data returned to clients.
    >
    > If the request data is in a format that is not usable by your model, the script can transform it into an acceptable format. It may also transform the response before returning it to the client.
    >
    > By default when packaging for functions, the input is treated as text. If you are interested in consuming the raw bytes of the input (for instance for Blob triggers), you should use [AMLRequest to accept raw data](../machine-learning/v1/how-to-deploy-advanced-entry-script.md#binary-data).

For the run function, ensure it connects to a Redis endpoint.

```python
import json
import numpy as np
import os
import redis
from sklearn.externals import joblib

def init():
    global model
    global azrediscache
    azrediscache = redis.StrictRedis(host='<host_url>', port=6380, password="<access_key>", ssl=True)
    model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), 'sklearn_mnist_model.pkl')
    model = joblib.load(model_path)

@input_schema('data', NumpyParameterType(input_sample))
@output_schema(NumpyParameterType(output_sample))
def run(data):
    try:
        input = azrediscache.get(data)
        result = model.predict(input)
        data = np.array(json.loads(data))
        result = model.predict(data)
        # You can return any data type, as long as it is JSON serializable.
        return result.tolist()
    except Exception as e:
        error = str(e)
        return error
```

For more information on entry script, see [Define scoring code.](../machine-learning/how-to-deploy-managed-online-endpoints.md)

* **Dependencies**, such as helper scripts or Python/Conda packages required to run the entry script or model

These entities are encapsulated into an **inference configuration**. The inference configuration references the entry script and other dependencies.

> [!IMPORTANT]
> When creating an inference configuration for use with Azure Functions, you must use an [Environment](/python/api/azureml-core/azureml.core.environment%28class%29) object. Please note that if you are defining a custom environment, you must add azureml-defaults with version >= 1.0.45 as a pip dependency. This package contains the functionality needed to host the model as a web service. The following example demonstrates creating an environment object and using it with an inference configuration:
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
>                                                            pip_packages=['azureml-defaults', 'redis'])
> inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
> ```

For more information on environments, see [Create and manage environments for training and deployment](../machine-learning/how-to-use-environments.md).

For more information on inference configuration, see [Deploy models with Azure Machine Learning](../machine-learning/how-to-deploy-managed-online-endpoints.md).

> [!IMPORTANT]
> When deploying to Functions, you do not need to create a **deployment configuration**.

## Install the SDK preview package for Functions support

To build packages for Azure Functions, you must install the SDK preview package.

```bash
pip install azureml-contrib-functions
```

## Create the image

To create the Docker image that is deployed to Azure Functions, use [azureml.contrib.functions.package](/python/api/azureml-contrib-functions/azureml.contrib.functions) or the specific package function for the trigger you want to use. The following code snippet demonstrates how to create a new package with an HTTP trigger from the model and inference configuration:

> [!NOTE]
> The code snippet assumes that `model` contains a registered model, and that `inference_config` contains the configuration for the inference environment. For more information, see [Deploy models with Azure Machine Learning](../machine-learning/how-to-deploy-managed-online-endpoints.md).

```python
from azureml.contrib.functions import package
from azureml.contrib.functions import HTTP_TRIGGER
model_package = package(ws, [model], inference_config, functions_enabled=True, trigger=HTTP_TRIGGER)
model_package.wait_for_creation(show_output=True)
# Display the package location/ACR path
print(model_package.location)
```

When `show_output=True`, the output of the Docker build process is shown. Once the process finishes, the image has been created in the Azure Container Registry for your workspace. Once the image has been built, the location in your Azure Container Registry is displayed. The location returned is in the format `<acrinstance>.azurecr.io/package@sha256:<imagename>`.

> [!NOTE]
> Packaging for Functions currently supports HTTP Triggers, Blob triggers and Service bus triggers. For more information on triggers, see [Azure Functions bindings](../azure-functions/functions-bindings-storage-blob-trigger.md#blob-name-patterns).

> [!IMPORTANT]
> Save the location information, as it is used when deploying the image.

## Deploy image as a web app

1. Use the following command to get the login credentials for the Azure Container Registry that contains the image. Replace `<myacr>` with the value returned previously from `package.location`:

    ```azurecli-interactive
    az acr credential show --name <myacr>
    ```

    The output of this command is similar to the following JSON document:

    ```json
    {
    "passwords": [
        {
        "name": "password",
        "value": "abcdefghijklmmopqrstuv1234567890"
        },
        {
        "name": "password2",
        "value": "1234567890abcdefghijklmmopqrstuv"
        }
    ],
    "username": "charlie.roy"
    }
    ```

    Save the value for **username** and one of the **passwords**.

1. If you don't already have a resource group or app service plan to deploy the service, these commands demonstrate how to create both:

    ```azurecli-interactive
    az group create --name myresourcegroup --location "West Europe"
    az appservice plan create --name myplanname --resource-group myresourcegroup --sku B1 --is-linux
    ```

    In this example, a _Linux basic_ pricing tier (`--sku B1`) is used.

    > [!IMPORTANT]
    > Images created by Azure Machine Learning use Linux, so you must use the `--is-linux` parameter.

1. Create the storage account to use for the web job storage and get its connection string. Replace `<webjobStorage>` with the name you want to use.

    ```azurecli-interactive
    az storage account create --name <webjobStorage> --location westeurope --resource-group myresourcegroup --sku Standard_LRS
    ```

    ```azurecli-interactive
    az storage account show-connection-string --resource-group myresourcegroup --name <webJobStorage> --query connectionString --output tsv
    ```

1. To create the function app, use the following command. Replace `<app-name>` with the name you want to use. Replace `<acrinstance>` and `<imagename>` with the values from returned `package.location` earlier. Replace `<webjobStorage>` with the name of the storage account from the previous step:

    ```azurecli-interactive
    az functionapp create --resource-group myresourcegroup --plan myplanname --name <app-name> --deployment-container-image-name <acrinstance>.azurecr.io/package:<imagename> --storage-account <webjobStorage>
    ```

    > [!IMPORTANT]
    > At this point, the function app has been created. However, since you haven't provided the connection string for the HTTP trigger or credentials to the Azure Container Registry that contains the image, the function app is not active. In the next steps, you provide the connection string and the authentication information for the container registry.

1. To provide the function app with the credentials needed to access the container registry, use the following command. Replace `<app-name>` with the name of the function app. Replace `<acrinstance>` and `<imagetag>` with the values from the AZ CLI call in the previous step. Replace `<username>` and `<password>` with the ACR login information retrieved earlier:

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
        "value": "[server-name].azurecr.io"
    },
    {
        "name": "DOCKER_REGISTRY_SERVER_USERNAME",
        "slotSetting": false,
        "value": "[username]"
    },
    {
        "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
        "slotSetting": false,
        "value": null
    },
    {
        "name": "DOCKER_CUSTOM_IMAGE_NAME",
        "value": "DOCKER|[server-name].azurecr.io/package:20190827195524"
    }
    ]
    ```

At this point, the function app begins loading the image.

> [!IMPORTANT]
> It may take several minutes before the image has loaded. You can monitor progress using the Azure portal.

## Test Azure Functions HTTP trigger

We'll now run and test our Azure Functions HTTP trigger.

1. Go to your function app in the Azure portal.
1. Under developer, select **Code + Test**.
1. On the right-hand side, select the **Input** tab.
1. Select on the **Run** button to test the Azure Functions HTTP trigger.

You've now successfully deployed a model from Azure Machine Learning as a function app using an Azure Cache for Redis instance. Learn more about Azure Cache for Redis by navigating to the links in the section below.

## Clean up resources

If you're continuing to the next tutorial, you can keep the resources that you created in this quickstart and reuse them.

Otherwise, if you're finished with the quickstart, you can delete the Azure resources that you created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible. When you delete a resource group, all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually on the left instead of deleting the resource group.

### To delete a resource group

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Resource groups**.

2. In the **Filter by name...** box, type the name of your resource group. On your resource group, in the results list, select **...**, and then select **Delete resource group**.

You're asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and then select **Delete**.

After a few moments, the resource group and all of its resources are deleted.

## Next steps

* Learn more about [Azure Cache for Redis](./cache-overview.md)
* Learn to configure your function app in the [Functions](../azure-functions/functions-create-function-linux-custom-image.md) documentation.
* [API Reference](/python/api/azureml-contrib-functions/azureml.contrib.functions)
* Create a [Python app that uses Azure Cache for Redis](./cache-python-get-started.md)

