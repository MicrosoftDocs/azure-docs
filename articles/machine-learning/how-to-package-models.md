---
title: Package a model for deployment (preview)
titleSuffix: Azure Machine Learning
description: Learn how you can package a model and deploy it for online inferencing.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.custom: devx-track-python, update-code
ms.date: 12/08/2023
ms.topic: how-to
---

# Create model packages (preview)

Model package is a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Creating packages before deploying models provides robust and reliable deployment and a more efficient MLOps workflow. Packages can be moved across workspaces and even outside of Azure Machine Learning. 

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how to package a model for deployment.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](how-to-manage-workspace.md)article to create one.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).


## About this example

In this example, you will learn how to package models in Azure Machine Learning.

#### Clone the repository

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

## Package a model

You can create model packages explicitly to allow you to control how the packaging operation is done. Use this workflow when:

> [!div class="checklist"]
> * You want to customize how the model package is created.
> * You want to deploy the model package outside Azure Machine Learning.
> * You want to use model packages in an MLOps workflow.

You can create model packages by specifying the:
- __Model to package__: Each model package can contain only a single model. Azure Machine Learning doesn't support packaging of multiple models under the same model package.
- __Base environment__: Environments are used to indicate the base image, and in Python packages dependencies your model need. For MLflow models, Azure Machine Learning automatically generates the base environment. For custom models, you need to specify it.
- __Serving technology__: The inferencing stack used to run the model.

### Register the model

Model packages require the model to be registered in either your workspace or in an Azure Machine Learning registry. In this example, you already have a local copy of the model in the repository, so you only need to publish the model to the registry in the workspace. You can skip this section if the model you're trying to deploy is already registered.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="register_model" :::

# [Python](#tab/sdk)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=register_model)]
---

#### Create the base environment

Base environments are used to indicate the base image and the model Python package dependencies. Our model requires the following packages to be used as indicated in the conda file:

__conda.yaml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/environment/conda.yaml" :::

> [!NOTE]
> __How is the base environment different from the environment you use for model deployment to online and batch endpoints?__
> When you deploy models to endpoints, your environment needs to include the dependencies of the model and the Python packages that are required for managed online endpoints to work. This brings a manual process into the deployment, where you have to combine the requirements of your model with the requirements of the serving platform.  On the other hand, use of model packages removes this friction, since the required packages for the inference server will automatically be injected into the model package at packaging time.

Create the environment as follows:

# [Azure CLI](#tab/cli)

Create an environment definition:

__sklearn-regression-env.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/environment/sklearn-regression-env.yml" :::

Then create the environment:

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="base_environment" :::

# [Python](#tab/sdk)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=base_environment)]

---

#### Create a package specification

You can create model packages in Azure Machine Learning, using the Azure CLI or the Azure Machine Learning SDK for Python. The custom package specification supports the following attributes:

# [Azure CLI](#tab/cli)

| Attribute                               | Type      | Description | Required |
|-----------------------------------------|-----------|-------------|----------|
| `target_environment`                    | `str`     | The name of the package to create. The result of a package operation is an environment in Azure Machine Learning. | Yes |
| `base_environment_source`               | `object`  | The base image to use to create the package where dependencies for the model are specified. | Yes, unless model is MLflow. |
| `base_environment_source.type`          | `str`     | The type of the base image. Only using another environment as the base image is supported (`type: environment_asset`) is supported.  |  |
| `base_environment_source.resource_id`   | `str`     | The resource ID of the base environment to use. Use format `azureml:<name>:<version>` or a long resource id.   |  |
| `inferencing_server`                    | `object`  | The inferencing server to use. | Yes |
| `inferencing_server.type`               | `azureml_online` <br /> `custom` | Use `azureml_online` for the Azure Machine Learning inferencing server, or `custom` for a custom online server like TensorFlow serving or Torch Serve. | Yes |
| `inferencing_server.code_configuration` | `object`  | The code configuration with the inference routine. It should contain at least one Python file with methods `init` and `run`. | Yes, unless model is MLflow. |
| `model_configuration`                   | `object`  | The model configuration. Use this attribute to control how the model is packaged in the resulting image. | No |
| `model_configuration.mode`              | `download` <br /> `copy` | Indicate how the model would be placed in the package. Possible values are `download` (default) and `copy`. Use `download` when you want the model to be downloaded from the model registry at deployment time. This option create smaller docker images since the model is not included on it. Use `copy` when you want to disconnect the image from Azure Machine Learning. Model will be copied inside of the docker image at package time. `copy` is not supported on private link-enabled workspaces. | No  |

# [Python](#tab/sdk)

| Attribute                             | Type                  | Description | Required |
|---------------------------------------|-----------------------|-------------|----------|
| `target_environment`                  | `str`                 | The name of the package to create. The result of a package operation is an environment in Azure Machine Learning. | Yes |
| `base_environment_source`             | `BaseEnvironment`     | The base image to use to create the package where dependencies for the model are specified. | Yes, unless model type is MLflow. |
| `base_environment_source.type`        | `BaseEnvironmentType` | The type of the base image. Only using another environment (`EnvironmentAsset`) as the base image is supported.  |  |
| `base_environment_source.resource_id` | `str`                 | The resource ID of the base environment to use. Use format `azureml:<name>:<version>` or a long-format resource id. |  |
| `inferencing_server`                  | `AzureMLOnlineInferencingServer` <br /> `CustomOnlineInferenceServer` | The inferencing server to use. Use `AzureMLOnlineInferencingServer` to Azure Machine Learning inferencing server, or `CustomOnlineInferenceServer` for a custom online server like TensorFlow serving, Torch Serve, etc. <br /><br />If set to `AzureMLInferencingServer` and the model type isn't Mlflow, a code configuration section should be specified, containing at least one Python file with methods `init` and `run`. <br /><br />If set to `CustomOnlineInferenceServer`, an online server configuration section should be specified.  | Yes |
| `model_configuration`                 | `ModelConfiguration`  | The model configuration. Use this attribute to control how the model is packaged in the resulting image. | No |
| `model_configuration.mode`            | `ModelInputMode`      | Specify how the model would be placed in the package. Possible values are `ModelInputMode.DOWNLOAD` (default) and `ModelInputMode.COPY`. Use `ModelInputMode.DOWNLOAD` when you want the model to be downloaded from the model registry at deployment time. This option create smaller docker images since the model is not included on it. Use `ModelInputMode.COPY` when you want to disconnect the image from Azure Machine Learning. Model will be copied inside of the docker image at package time. `ModelInputMode.COPY` is not supported on private link-enabled workspaces. | No |

---

1. Create a package specification as follows:

    # [Azure CLI](#tab/cli)
    
    __package-moe.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/package-moe.yml" :::
    
    # [Python](#tab/sdk)
    
    To create a model package, create a package specification as follows:
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=configure_package)]
    
1. Start the model package operation:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/deploy.sh" ID="build_package" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=build_package)]
    
1. The result of the package operation is an environment.


## Package a model that has dependencies in private Python feeds

Model packages can resolve Python dependencies that are available in private feeds. To use this capability, you need to create a connection from your workspace to the feed and specify the credentials. The following Python code shows how you can configure the workspace where you're running the package operation.

```python
from azure.ai.ml.entities import WorkspaceConnection
from azure.ai.ml.entities import SasTokenConfiguration

# fetching secrets from env var to secure access, these secrets can be set outside or source code
python_feed_sas = os.environ["PYTHON_FEED_SAS"]

credentials = SasTokenConfiguration(sas_token=python_feed_sas)

ws_connection = WorkspaceConnection(
    name="<connection_name>",
    target="<python_feed_url>",
    type="python_feed",
    credentials=credentials,
)

ml_client.connections.create_or_update(ws_connection)
```

Once the connection is created, build the model package as described in the section for [Package a model](#package-a-model). In the following example, the **base environment** of the package uses a private feed for the Python dependency `bar`, as specified in the following conda file:

__conda.yml__

```yml
name: foo
channels:
  - defaults
dependencies:
  - python
  - pip
  - pip:
    - --extra-index-url <python_feed_url>
    - bar
```

If you're using an MLflow model, model dependencies are indicated inside the model itself, and hence a **base environment** isn't needed. Instead, specify private feed dependencies when logging the model, as explained in [Logging models with a custom signature, environment or samples](how-to-log-mlflow-models.md#logging-models-with-a-custom-signature-environment-or-samples).

## Package a model that is hosted in a registry

Model packages provide a convenient way to collect dependencies before deployment. However, when models are hosted in registries, the deployment target is usually another workspace. When creating packages in this setup, use the `target_environment_name` property to specify the full location where you want the model package to be created, instead of just its name.

The following code creates a package of the `t5-base` model from a registry:

1. Connect to the registry where the model is located and the workspace in which you need the model package to be created:

    # [Azure CLI](#tab/cli)

    ```azurecli
    az login
    ```

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/registry-model/sdk-deploy-and-test.ipynb?name=configure_registry_client)]

1. Get a reference to the model you want to package. In this case we are packaging the model `t5-base` from `azureml` registry.

    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/registry-model/deploy.sh" ID="get_model" :::

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/registry-model/sdk-deploy-and-test.ipynb?name=get_model)]
    
1. Configure a package specification. Since the model we want to package is MLflow, base environment and scoring script is optional.

    # [Azure CLI](#tab/cli)
    
    __package.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/registry-model/package.yml" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/registry-model/sdk-deploy-and-test.ipynb?name=configure_package)]
    
2. Start the operation to create the model package:

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/registry-model/deploy.sh" ID="build_package" :::

    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/registry-model/sdk-deploy-and-test.ipynb?name=build_package)]
    
1. The package is now created in the target workspace and ready to be deployed.

## Package models to deploy outside of Azure Machine Learning

Model packages can be deployed outside of Azure Machine Learning if needed.  To guarantee portability, you only need to ensure that the **model configuration** in your package has the mode set to `copy` so that the model itself is copied inside the generated docker image instead of referenced from the model registry in Azure Machine Learning.

The following code shows how to configure `copy` in a model package:

# [Azure CLI](#tab/cli)

__package-external.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/custom-model/package-external.yml" highlight="11-12" :::

# [Python](#tab/sdk)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/custom-model/sdk-deploy-and-test.ipynb?name=configure_deployment_copy)]

---


## Next step

* [Package and deploy a model to Online Endpoints](how-to-package-models-moe.md).
* [Package and deploy a model to App Service](how-to-package-models-app-service.md).
