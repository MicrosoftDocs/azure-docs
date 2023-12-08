---
title: Deploy model packages to online endpoints (preview)
titleSuffix: Azure Machine Learning
description: Learn how you can package a model and deploy it for online inferencing to online endpoints.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 12/08/2023
ms.topic: how-to
---

# Deploy model packages to online endpoints (preview)

Model package is a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Creating packages before deploying models provides robust and reliable deployment and a more efficient MLOps workflow. Packages can be moved across workspaces and even outside of Azure Machine Learning. Learn more about [Model packages (preview)](concept-package-models.md) 

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how to package a model and deploy it to an online endpoint in Azure Machine Learning.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](how-to-manage-workspace.md)article to create one.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).


## About this example

In this example, you package a model of type **custom** and deploy it to an online endpoint for online inference.

The example in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, first clone the repo and then change directories to the folder:

# [Azure CLI](#tab/cli)

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

# [Python](#tab/sdk)

```azurecli
!git clone https://github.com/Azure/azureml-examples --depth 1
!cd azureml-examples/sdk/python
```

---

This section uses the example in the folder **endpoints/online/deploy-packages/custom-model**.

#### Connect to your workspace

Connect to the Azure Machine Learning workspace where you'll do your work.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/sdk)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, you connect to the workspace in which you perform deployment tasks.

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
    from azure.ai.ml.constants import AssetTypes
    from azure.identity import DefaultAzureCredential
    ```

2. If you're running in a compute instance in Azure Machine Learning, create an `MLClient` as follows:

    ```python
    ml_client = MLClient.from_config(DefaultAzureCredential())
    ```

    Otherwise, configure your workspace details and get a handle to the workspace:

    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

---

## Package the model

You can create model packages explicitly to allow you to control how the packaging operation is done. You can create model packages by specifying the:

- __Model to package__: Each model package can contain only a single model. Azure Machine Learning doesn't support packaging of multiple models under the same model package.
- __Base environment__: Environments are used to indicate the base image, and in Python packages dependencies your model need. For MLflow models, Azure Machine Learning automatically generates the base environment. For custom models, you need to specify it.
- __Serving technology__: The inferencing stack used to run the model.

> [!TIP]
> If your model is MLflow, you don't need to create the model package manually. We can automatically package before deployment. See [Deploy MLflow models to online endpoints](how-to-deploy-mlflow-models-online-endpoints.md).


1. Model packages require the model to be registered in either your workspace or in an Azure Machine Learning registry. In this example, you already have a local copy of the model in the repository, so you only need to publish the model to the registry in the workspace. You can skip this section if the model you're trying to deploy is already registered.

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="register_model" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=register_model)]
    
1. Our model requires the following packages to run and we have them specified in a conda file:

    __conda.yaml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/environment/conda.yaml" :::
    
    > [!NOTE]
    > Notice how only model's requirements are indicated in the conda YAML. Any package required for the inferencing server will be included by the package operation.

    > [!TIP]
    > If your model requires packages hosted in private feeds, you can configure your package to include them. Read [Package a model that has dependencies in private Python feeds](how-to-package-models.md#package-a-model-that-has-dependencies-in-private-python-feeds).

1. Create a base environment that contains the model requirements and a base image. Only dependencies required by your model are indicated in the base environment. For MLflow models, base environment is optional in which case Azure Machine Learning autogenerates it for you.

    # [Azure CLI](#tab/cli)
    
    Create a base environment definition:
    
    __sklearn-regression-env.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/environment/sklearn-regression-env.yml" :::
    
    Then create the environment as follows:
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="base_environment" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=base_environment)]
    
    ---
    
1. Create a package specification:

    # [Azure CLI](#tab/cli)
    
    __package-moe.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/package-moe.yml" :::
    
    # [Python](#tab/sdk)
    
    To create a model package, create a package specification as follows:
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=configure_package)]
    
    ---
    
1. Start the model package operation:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="build_package" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=build_package)]
    
    ---
    
1. The result of the package operation is an environment.

## Deploy the model package

Model packages can be deployed directly to online endpoints in Azure Machine Learning. Follow these steps to deploy a package to an online endpoint:

1. Pick a name for an endpoint to host the deployment of the package and create it:

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="endpoint_name" :::

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="create_endpoint" :::

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=create_endpoint)]

1. Create the deployment, using the package. Notice how `environment` is configured with the package you've created.

    # [Azure CLI](#tab/cli)

    __deployment.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deployment.yml" highlight="4" :::

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=configure_deployment)]

    ---

    > [!TIP]
    > Notice you don't specify the model or scoring script in this example; they're all part of the package.

1. Start the deployment:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="create_deployment" :::

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=create_deployment)]

1. At this point, the deployment is ready to be consumed. You can test how it's working by creating a sample request file:

    __sample-request.json__

    :::code language="json" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/sample-request.json" :::

1. Send the request to the endpoint

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="test_deployment" :::

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=test_deployment)]


## Next step

> [!div class="nextstepaction"]
> [Package and deploy a model to App Service](how-to-package-models-app-service.md)
