---
title: Package and deploy models outside Azure Machine Learning
titleSuffix: Azure Machine Learning
description:  Learn how you can package a model for online serving using model packages
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/04/2023
ms.topic: how-to
---

# Package and deploy models outside Azure Machine Learning

Model packages is a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Packages can be moved across workspaces and even outside of Azure Machine Learning. In this article you learn how package a model and deploy it to an Azure App Service.

To learn more about model packages in general, read [Model packages for deployment](package.models.md)

## Prerequisites

Follow these steps to prepare your environment:

### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where we are going to work on.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/sdk)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we connect to the workspace in which you perform deployment tasks.

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
    from azure.ai.ml.constants import AssetTypes
    from azure.identity import DefaultAzureCredential
    ```

2. If you are running in a Compute Instance in Azure Machine Learning, create an `MLClient` as follows:

    ```python
    ml_client = MLClient.from_config(DefaultAzureCredential())
    ```

    Otherwise, configure workspace details and get a handle to the workspace:

    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

# [Studio](#tab/studio)

Navigate to [Azure Machine Learning studio](https://ml.azure.com).

---


### Registering the model

In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='heart-classifier-mlflow'
MODEL_PATH='model'
az ml model create --name $MODEL_NAME --path $MODEL_PATH --type mlflow_model
```

# [Python](#tab/sdk)

```python
model_name = "heart-classifier-mlflow"
model_path = "model"
model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_path, type=AssetTypes.MLFLOW_MODEL)
)
```

# [Studio](#tab/studio)

To create a model in Azure Machine Learning, open the Models page in Azure Machine Learning. Select **Register model** and select where your model is located. Fill out the required fields, and then select __Register__.

:::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

---


## Creating a portable model package

1. To create a model package, we need to create a package specification. For a full specification about all the options when creating packages see [Package a model for online deployment](how-to-package-models.md).

    # [Azure CLI](#tab/cli)
    
    __package-docker.yml__
    
    ```yml
    $schema: http://azureml/sdk-2-0/ModelVersionPackage.json
    target_environment_name: heart-classifier-mlflow-pkg
    inferencing_server: 
        type: azureml_online
    model_configuration:
        mode: copy
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    package_config = ModelPackage(
        target_environment_name="heart-classifier-mlflow-pkg",
        inferencing_server=AzureMLOnlineInferencingServer(),
        model_configuration=ModelConfiguration(mode="copy")
    )
    ```
    
    # [Studio](#tab/studio)
    
    TODO
    
    ---
    
    > [!TIP]
    > Notice that we have indicated **model configuration** using *copy* for the property **mode**. This guarantees all the model artifacts are copied inside of the generated docker image instead of downloaded from Azure Machine Learning model registry, allowing true portability outside of Azure Machine Learning.

1. Let's start the package operation:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml model package -n $MODEL_NAME -l latest --file package-docker.yml
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    model_package = ml_client.models.begin_package(model_name, model.version, package_config)
    ```
    
    # [Studio](#tab/studio)
    
    TODO
    
    ---
    
    The result of the package operation is an environment.

## Deploy a model package to Azure App Service

TODO

## Next steps

* [Model packages for deployment](package-models.md)


