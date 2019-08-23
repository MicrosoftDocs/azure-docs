---
title: Deploy ml models to Azure App Service (preview)
titleSuffix: Azure Machine Learning service
description: Learn how to use the Azure Machine Learning service to deploy a model to a Web App in Azure App Service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 07/01/2019


---

# Deploy a machine learning model to Azure App Service (preview)

Learn how to deploy a model from the Azure Machine Learning service as a web app in Azure App Service.

> [!IMPORTANT]
> While both Azure Machine Learning service and Azure App Service are generally available, the ability to deploy a model from the Machine Learning service to App Service is in preview.

With Azure Machine Learning service, you can create Docker images from trained machine learning models. This image contains a web service that receives data, submits it to the model, and then returns the response. Azure App Service can be used to deploy the image, and provides the following features:

* Advanced [authentication](/azure/app-service/configure-authentication-provider-aad) for enhanced security. Authentication methods include both Azure Active Directory and multi-factor auth.
* [Autoscale](/azure/azure-monitor/platform/autoscale-get-started?toc=%2fazure%2fapp-service%2ftoc.json) without having to redeploy.
* [SSL support](/azure/app-service/app-service-web-ssl-cert-load) for secure communications between clients and the service.

For more information on features provided by Azure App Service, see the [App Service overview](/azure/app-service/overview).

> [!IMPORTANT]
> If you need the ability to log the scoring data used with your deployed model, or the results of scoring, you should instead deploy to Azure Kubernetes Service. For more information, see [Collect data on your production models](how-to-enable-data-collection.md).

## Prerequisites

* An Azure Machine Learning service workspace. For more information, see the [Create a workspace](how-to-manage-workspace.md) article.
* A trained machine learning model registered in your workspace. If you do not have a model, use the [Image classification tutorial: train model](tutorial-train-models-with-aml.md) to train and register one.

    > [!IMPORTANT]
    > The code snippets in this article assume that you have set the following variables:
    >
    > * `ws` - Your Azure Machine Learning workspace.
    > * `model` - The registered model that will be deployed.
    > * `inference_config` - The inference configuration for the model.
    >
    > For more information on setting these variables, see [Deploy models with the Azure Machine Learning service](how-to-deploy-and-where.md).

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
    > Another alternative that may work for your scenario is [batch predictions](how-to-run-batch-predictions.md), which does provide access to datastores when scoring.

    For more information on entry scripts, see [Deploy models with the Azure Machine Learning service](how-to-deploy-and-where.md).

* **Dependencies**, such as helper scripts or Python/Conda packages required to run the entry script or model

These entities are encapsulated into an __inference configuration__. The inference configuration references the entry script and other dependencies.

> [!IMPORTANT]
> When creating an inference configuration for use with Azure App Service, you must use an [Environment](https://docs.microsoft.com//python/api/azureml-core/azureml.core.environment%28class%29?view=azure-ml-py) object. The following example demonstrates creating an environment object and using it with an inference configuration:
>
> ```python
> from azureml.core import Environment
> from azureml.core.environment import CondaDependencies
>
> # Create an environment and add conda dependencies to it
> myenv = Environment(name="myenv")
> # Enable Docker based environment
> myenv.docker.enabled = True
> # Build conda dependencies
> myenv.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'])
> ```

For more information on environments, see [Create and manage environments for training and deployment](how-to-use-environments.md).

For more information on inference configuration, see [Deploy models with the Azure Machine Learning service](how-to-deploy-and-where.md).

> [!IMPORTANT]
> When deploying to Azure App Service, you do not need to create a __deployment configuration__.

## Create the image

To create the Docker image that is deployed to Azure App Service, use [Model.package](https://docs.microsoft.com//python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#package-workspace--models--inference-config--generate-dockerfile-false-). The following code snippet demonstrates how to build a new image from the model and inference configuration:

```python
package = Model.package(ws, [model], inference_config)
package.wait_for_creation(show_output=True)
```

When `show_output=True`, the output of the Docker build process is shown. Once the process finishes, the image has been created in the Azure Container Registry for your workspace.

## Deploy image as a web app

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning workspace. From the __Overview__ section, use the __Registry__ link to access the Azure Container Registry for the workspace.

    [![Screenshot of the overview for the workspace](media/how-to-deploy-app-service/workspace-overview.png)](media/how-to-deploy-app-service/workspace-overview-expanded.png)

2. From the Azure Container Registry, select __Repositories__, and then select the __image name__ that you want to deploy. For the version that you want to deploy, select the __...__ entry, and then __Deploy to web app__.

    [![Screenshot of deploying from ACR to a web app](media/how-to-deploy-app-service/deploy-to-web-app.png)](media/how-to-deploy-app-service/deploy-to-web-app-expanded.png)

3. To create the Web App, provide a site name, subscription, resource group, and select the App service plan/location. Finally, select __Create__.

    ![Screenshot of the new web app dialog](media/how-to-deploy-app-service/web-app-for-containers.png)

## Use the Web App

From the [Azure portal](https://portal.azure.com), select the Web App created in the previous step. From the __Overview__ section, copy the __URL__. This value is the __base URL__ of the service.

[![Screenshot of the overview for the web app](media/how-to-deploy-app-service/web-app-overview.png)](media/how-to-deploy-app-service/web-app-overview-expanded.png)

The web service that passes requests to the model is located at `{baseurl}/score`. For example, `https://mywebapp.azurewebsites.net/score`. The following Python code demonstrates how to submit data to the URL and display the response:

```python
import requests
import json

scoring_uri = "https://mywebapp.azurewebsites.net/score"

headers = {'Content-Type':'application/json'}

print(headers)
    
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

* For more information on configuring your Web App, see the [App Service on Linux](/azure/app-service/containers/) documentation.
* For more information on scaling, see [Get started with Autoscale in Azure](/azure/azure-monitor/platform/autoscale-get-started?toc=%2fazure%2fapp-service%2ftoc.json).
* For more information on SSL support, see [Use an SSL certificate in your Azure App Service](/azure/app-service/app-service-web-ssl-cert-load).
* For more information on authentication, see [Configure your App Service app to use Azure Active Directory sign-in](/azure/app-service/configure-authentication-provider-aad).
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)