---
title: Deploy ml models to Azure App Service (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning to deploy a model to a Web App in Azure App Service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 08/27/2019


---

# Deploy a machine learning model to Azure App Service (preview)
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to deploy a model from Azure Machine Learning as a web app in Azure App Service.

> [!IMPORTANT]
> While both Azure Machine Learning and Azure App Service are generally available, the ability to deploy a model from the Machine Learning service to App Service is in preview.

With Azure Machine Learning, you can create Docker images from trained machine learning models. This image contains a web service that receives data, submits it to the model, and then returns the response. Azure App Service can be used to deploy the image, and provides the following features:

* Advanced [authentication](/azure/app-service/configure-authentication-provider-aad) for enhanced security. Authentication methods include both Azure Active Directory and multi-factor auth.
* [Autoscale](/azure/azure-monitor/platform/autoscale-get-started?toc=%2fazure%2fapp-service%2ftoc.json) without having to redeploy.
* [SSL support](/azure/app-service/configure-ssl-certificate-in-code) for secure communications between clients and the service.

For more information on features provided by Azure App Service, see the [App Service overview](/azure/app-service/overview).

> [!IMPORTANT]
> If you need the ability to log the scoring data used with your deployed model, or the results of scoring, you should instead deploy to Azure Kubernetes Service. For more information, see [Collect data on your production models](how-to-enable-data-collection.md).

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

    > [!IMPORTANT]
    > The Azure Machine Learning SDK does not provide a way for the web service access your datastore or data sets. If you need the deployed model to access data stored outside the deployment, such as in an Azure Storage account, you must develop a custom code solution using the relevant SDK. For example, the [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python).
    >
    > Another alternative that may work for your scenario is [batch predictions](how-to-use-parallel-run-step.md), which does provide access to datastores when scoring.

    For more information on entry scripts, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

* **Dependencies**, such as helper scripts or Python/Conda packages required to run the entry script or model

These entities are encapsulated into an __inference configuration__. The inference configuration references the entry script and other dependencies.

> [!IMPORTANT]
> When creating an inference configuration for use with Azure App Service, you must use an [Environment](https://docs.microsoft.com//python/api/azureml-core/azureml.core.environment%28class%29?view=azure-ml-py) object. Please note that if you are defining a custom environment, you must add azureml-defaults with version >= 1.0.45 as a pip dependency. This package contains the functionality needed to host the model as a web service. The following example demonstrates creating an environment object and using it with an inference configuration:
>
> ```python
> from azureml.core.environment import Environment
> from azureml.core.conda_dependencies import CondaDependencies
> from azureml.core.model import InferenceConfig
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
> When deploying to Azure App Service, you do not need to create a __deployment configuration__.

## Create the image

To create the Docker image that is deployed to Azure App Service, use [Model.package](https://docs.microsoft.com//python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#package-workspace--models--inference-config-none--generate-dockerfile-false-). The following code snippet demonstrates how to build a new image from the model and inference configuration:

> [!NOTE]
> The code snippet assumes that `model` contains a registered model, and that `inference_config` contains the configuration for the inference environment. For more information, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

```python
from azureml.core import Model

package = Model.package(ws, [model], inference_config)
package.wait_for_creation(show_output=True)
# Display the package location/ACR path
print(package.location)
```

When `show_output=True`, the output of the Docker build process is shown. Once the process finishes, the image has been created in the Azure Container Registry for your workspace. Once the image has been built, the location in your Azure Container Registry is displayed. The location returned is in the format `<acrinstance>.azurecr.io/package:<imagename>`. For example, `myml08024f78fd10.azurecr.io/package:20190827151241`.

> [!IMPORTANT]
> Save the location information, as it is used when deploying the image.

## Deploy image as a web app

1. Use the following command to get the login credentials for the Azure Container Registry that contains the image. Replace `<acrinstance>` with th e value returned previously from `package.location`:

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
    az appservice plan create --name myplanname --resource-group myresourcegroup --sku B1 --is-linux
    ```

    In this example, a __Basic__ pricing tier (`--sku B1`) is used.

    > [!IMPORTANT]
    > Images created by Azure Machine Learning use Linux, so you must use the `--is-linux` parameter.

1. To create the web app, use the following command. Replace `<app-name>` with the name you want to use. Replace `<acrinstance>` and `<imagename>` with the values from returned `package.location` earlier:

    ```azurecli-interactive
    az webapp create --resource-group myresourcegroup --plan myplanname --name <app-name> --deployment-container-image-name <acrinstance>.azurecr.io/package:<imagename>
    ```

    This command returns information similar to the following JSON document:

    ```json
    {
    "adminSiteName": null,
    "appServicePlanName": "myplanname",
    "geoRegion": "West Europe",
    "hostingEnvironmentProfile": null,
    "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myplanname",
    "kind": "linux",
    "location": "West Europe",
    "maximumNumberOfWorkers": 1,
    "name": "myplanname",
    < JSON data removed for brevity. >
    "targetWorkerSizeId": 0,
    "type": "Microsoft.Web/serverfarms",
    "workerTierName": null
    }
    ```

    > [!IMPORTANT]
    > At this point, the web app has been created. However, since you haven't provided the credentials to the Azure Container Registry that contains the image, the web app is not active. In the next step, you provide the authentication information for the container registry.

1. To provide the web app with the credentials needed to access the container registry, use the following command. Replace `<app-name>` with the name you want to use. Replace `<acrinstance>` and `<imagename>` with the values from returned `package.location` earlier. Replace `<username>` and `<password>` with the ACR login information retrieved earlier:

    ```azurecli-interactive
    az webapp config container set --name <app-name> --resource-group myresourcegroup --docker-custom-image-name <acrinstance>.azurecr.io/package:<imagename> --docker-registry-server-url https://<acrinstance>.azurecr.io --docker-registry-server-user <username> --docker-registry-server-password <password>
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

At this point, the web app begins loading the image.

> [!IMPORTANT]
> It may take several minutes before the image has loaded. To monitor progress, use the following command:
>
> ```azurecli-interactive
> az webapp log tail --name <app-name> --resource-group myresourcegroup
> ```
>
> Once the image has been loaded and the site is active, the log displays a message that states `Container <container name> for site <app-name> initialized successfully and is ready to serve requests`.

Once the image is deployed, you can find the hostname by using the following command:

```azurecli-interactive
az webapp show --name <app-name> --resource-group myresourcegroup
```

This command returns information similar to the following hostname - `<app-name>.azurewebsites.net`. Use this value as part of the __base url__ for the service.

## Use the Web App

The web service that passes requests to the model is located at `{baseurl}/score`. For example, `https://<app-name>.azurewebsites.net/score`. The following Python code demonstrates how to submit data to the URL and display the response:

```python
import requests
import json

scoring_uri = "https://mywebapp.azurewebsites.net/score"

headers = {'Content-Type':'application/json'}

test_sample = json.dumps({'data': [
    [1,2,3,4,5,6,7,8,9,10],
    [10,9,8,7,6,5,4,3,2,1]
]})

response = requests.post(scoring_uri, data=test_sample, headers=headers)
print(response.status_code)
print(response.elapsed)
print(response.json())
```

## Next steps

* Learn to configure your Web App in the [App Service on Linux](/azure/app-service/containers/) documentation.
* Learn more about scaling in [Get started with Autoscale in Azure](/azure/azure-monitor/platform/autoscale-get-started?toc=%2fazure%2fapp-service%2ftoc.json).
* [Use an SSL certificate in your Azure App Service](/azure/app-service/configure-ssl-certificate-in-code).
* [Configure your App Service app to use Azure Active Directory sign-in](/azure/app-service/configure-authentication-provider-aad).
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
