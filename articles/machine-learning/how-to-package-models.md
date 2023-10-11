---
title: Package a model for online deployment (preview)
titleSuffix: Azure Machine Learning
description:  Learn how you can package a model for online serving using model packages
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/04/2023
ms.topic: how-to
---

# Package a model for online deployment (preview)

Model package is a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Creating packages before deploying models provides robust and reliable deployment and a more efficient MLOps workflow. Packages can be moved across workspaces and even outside of Azure Machine Learning. 

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how to package a model and deploy it to an online endpoint in Azure Machine Learning.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](../how-to-manage-workspace.md) article to create one.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).


## Prepare your system

Follow these steps to prepare your system. 
In this example, you package a model of type **custom** and deploy it to an online endpoint for online inference.

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

# [Studio](#tab/studio)

1. From the left navigation bar, select the option __Notebooks__.
1. Select __Samples__.
1. Navigate to the folder _sdk/python/endpoints/online/deploy-packages_.
1. Find the notebook you want to try out and select __Clone this notebook__.

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

# [Studio](#tab/studio)

Navigate to [Azure Machine Learning studio](https://ml.azure.com).

---

#### Register the model

Model packages require the model to be registered in either your workspace or in an Azure Machine Learning registry. In this example, you already have a local copy of the model in the repository, so you only need to publish the model to the registry in the workspace. You can skip this section if the model you're trying to deploy is already registered.

# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='sklearn-regression'
MODEL_PATH='model'
az ml model create --name $MODEL_NAME --path $MODEL_PATH --type custom_model
```

# [Python](#tab/sdk)

```python
model_name = "sklearn-regression"
model_path = "model"
model = ml_client.models.create_or_update(
    Model(name=model_name, path=model_path, type=AssetTypes.CUSTOM_MODEL)
)
```

# [Studio](#tab/studio)

Create a model in Azure Machine Learning as follows:

- Open the __Models__ page in Azure Machine Learning studio. 
- Select **Register model**.
- Select where your model is located and fill out the required fields.
- Select __Register__.

:::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

---

## Package a custom model

You can create model packages explicitly to allow you to control how the packaging operation is done. Use this workflow when:

> [!div class="checklist"]
> * You want to customize how the model package is created.
> * You want to deploy the model package outside Azure Machine Learning.
> * You want to use model packages in an MLOps workflow.

You can create model packages by specifying the:
- __Model to package__. Each model package can contain only a single model. Azure Machine Learning doesn't support packaging of multiple models under the same model package.
- __Serving technology__ that you want to use to run the model.
- __Base image__ to use for packaging the model.

**Environments** in Azure Machine Learning indicate the base image, and in model packages, this environment is called the __base environment__. For MLflow models, Azure Machine Learning automatically generates the base environment. For custom models, you need to specify the base image.

> [!NOTE]
> __How is the base environment different from the environment you use for model deployment to online and batch endpoints?__
> When you deploy models to endpoints, your environment needs to include the dependencies of the model and the Python packages that are required for managed online endpoints to work. This brings a manual process into the deployment, where you have to combine the requirements of your model with the requirements of the serving platform.  On the other hand, use of model packages removes this friction, since the required packages for the inference server will automatically be injected into the model package at packaging time.

In this section, you create the base environment, package a custom model, and deploy the model package to an online endpoint for inference.

#### Create the base environment

In this section, you create a base environment for the model package, using a base image and the following conda files. The __sklearn-regression-env.yml__ file contains the content of the __conda.yml__ file.

__conda.yaml__

```yaml
name: model-env
channels:
  - conda-forge
dependencies:
  - python=3.9
  - numpy=1.23.5
  - pip=23.0.1
  - scikit-learn=1.2.2
  - scipy=1.10.1
```

@santiagxf: add the code for the YAML here
__sklearn-regression-env.yml__

Create the environment as follows:

# [Azure CLI](#tab/cli)

```azurecli
az ml environment create -f environment/sklearn-regression-env.yml
```

# [Python](#tab/sdk)

```python
base_environment = ml_client.environments.create_or_update(
    Environment(
        name=f"{model_name}-env",
        image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04",
        conda_file="environment/conda.yaml"
    )
)
```

# [Studio](#tab/studio)

1. Navigate to the **Environments** section in the studio.

1. Select the **Custom environments** tab.

1. Select **Create**.

1. Configure the wizard as follows:

    1. For **Name**, enter *sklearn-regression-env*.

    1. For **Select environment source**, select **Use existing docker image with optional conda file**.

    1. Leave **Container registry image path** as the defaults.

1. Select **Next**.

1. For **Customize**, paste the following conda YAML definition:

    ```yml
    name: model-env
    channels:
      - conda-forge
    dependencies:
      - python=3.9
      - numpy=1.23.5
      - pip=23.0.1
      - scikit-learn=1.2.2
      - scipy=1.10.1
      - xgboost==1.3.3
    ``` 

1. Select **Finish**. Now, your environment is ready to be used.

---

#### Create a package for a custom model

You can create model packages in Azure Machine Learning, using the Azure CLI or the Azure Machine Learning SDK for Python. The custom package specification supports the following attributes:

# [Azure CLI](#tab/cli)

| Attribute                               | Type      | Description | Required |
|-----------------------------------------|-----------|-------------|----------|
| `target_environment_name`               | `str`     | The name of the package to create. The result of a package operation is an environment in Azure Machine Learning. | Yes |
| `base_environment_source`               | `object`  | The base image to use to create the package where dependencies for the model are specified. | Yes, unless model is MLflow. |
| `base_environment_source.type`          | `str`     | The type of the base image. Only using another environment as the base image is supported (`type: environment_asset`) is supported.  |  |
| `base_environment_source.resource_id`   | `str`     | The resource ID of the base environment to use. Use format `azureml:<name>:<version>` or a long resource id.   |  |
| `inferencing_server`                    | `object`  | The inferencing server to use. | Yes |
| `inferencing_server.type`               | `azureml_online` <br /> `custom` | Use `azureml_online` for the Azure Machine Learning inferencing server, or `custom` for a custom online server like TensorFlow serving or Torch Serve. | Yes |
| `inferencing_server.code_configuration` | `object`  | The code configuration with the inference routine. It should contain at least one Python file with methods `init` and `run`. | Yes, unless model is MLflow. |
| `model_configuration`                   | `object`  | The model configuration. Use this attribute to control how the model is packaged in the resulting image. | No |
| `model_configuration.mode`              | `download` <br /> `copy` | Indicate how the model would be placed in the package. Possible values are `download` and `copy`. Defaults to `download`. | No  |

# [Python](#tab/sdk)

| Attribute                             | Type                  | Description | Required |
|---------------------------------------|-----------------------|-------------|----------|
| `target_environment_name`             | `str`                 | The name of the package to create. The result of a package operation is an environment in Azure Machine Learning. | Yes |
| `base_environment_source`             | `BaseEnvironment`     | The base image to use to create the package where dependencies for the model are specified. | Yes, unless model type is MLflow. |
| `base_environment_source.type`        | `BaseEnvironmentType` | The type of the base image. Only using another environment (`EnvironmentAsset`) as the base image is supported.  |  |
| `base_environment_source.resource_id` | `str`                 | The resource ID of the base environment to use. Use format `azureml:<name>:<version>` or a long-format resource id. |  |
| `inferencing_server`                  | `AzureMLOnlineInferencingServer` <br /> `CustomOnlineInferenceServer` | The inferencing server to use. Use `AzureMLOnlineInferencingServer` to Azure Machine Learning inferencing server, or `CustomOnlineInferenceServer` for a custom online server like TensorFlow serving, Torch Serve, etc. <br /><br />If set to `AzureMLInferencingServer` and the model type isn't Mlflow, a code configuration section should be specified, containing at least one Python file with methods `init` and `run`. <br /><br />If set to `CustomOnlineInferenceServer`, an online server configuration section should be specified.  | Yes |
| `model_configuration`                 | `ModelConfiguration`  | The model configuration. Use this attribute to control how the model is packaged in the resulting image. | No |
| `model_configuration.mode`            | `ModelInputMode`      | Specify how the model would be placed in the package. Possible values are `ModelInputMode.DOWNLOAD` (default) and `ModelInputMode.COPY`. Downloading the model helps to make packages more lightweight, especially for large models. However, it requires packages to be deployed to Azure Machine Learning. Copying, on the other hand, generates bigger packages as all the artifacts are copied on it, but they can be deployed anywhere. | No |

# [Studio](#tab/studio)

Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

---

To create a model package, create a package specification as follows:

# [Azure CLI](#tab/cli)

__package-moe.yml__

```yml
$schema: http://azureml/sdk-2-0/ModelVersionPackage.json
base_environment_source:
    type: environment_asset
    resource_id: azureml:sklearn-regression-env@latest
target_environment_name: sklearn-regression-online-pkg
inferencing_server: 
    type: azureml_online
    code_configuration:
      code: src
      entry_script: score.py
```

# [Python](#tab/sdk)

To create a model package, create a package specification as follows:

```python
package_config = ModelPackage(
    target_environment_name="sklearn-regression-online-pkg",
    base_environment_source=BaseEnvironment(
        type=BaseEnvironmentType.EnvironmentAsset, 
        resource_id=base_environment.id
    ),
    inferencing_server=AzureMLOnlineInferencingServer(
        code_configuration=CodeConfiguration(
            code='src', 
            scoring_script='score.py'
        )
    ),
)
```

# [Studio](#tab/studio)

Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

---

Start the model package operation:

# [Azure CLI](#tab/cli)

```azurecli
az ml model package -n $MODEL_NAME -l latest --file package-moe.yml
```

# [Python](#tab/sdk)

```python
model_package = ml_client.models.begin_package(model_name, model.version, package_config)
```

# [Studio](#tab/studio)

Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

---

The result of the package operation is an environment.

#### Deploy model packages to online endpoints

Model packages can be deployed directly to online endpoints in Azure Machine Learning. Follow these steps to deploy a package to an online endpoint:

1. Pick a name for an endpoint to host the deployment of the package:

    # [Azure CLI](#tab/cli)

    ```azurecli
    ENDPOINT_NAME = "sklearn-regression-online"
    ```

    # [Python](#tab/sdk)
    
    ```python
    endpoint_name = "sklearn-regression-online"
    ```
    
    # [Studio](#tab/studio)
    
    Deploying custom model packages isn't supported in the studio currently. Use the option [Specify model package before deployment](concept-package-models.md#specify-model-package-before-deployment) to deploy standard model packages from the studio, or use the Azure CLI or Python SDK v2 instead.

1. Create the endpoint:

    # [Azure CLI](#tab/cli)

    ```azurecli
    az ml online-endpoint create -n $ENDPOINT_NAME
    ```

    # [Python](#tab/sdk)
    
    ```python
    endpoint = ManagedOnlineEndpoint(name=endpoint_name)
    endpoint = ml_client.online_endpoints.begin_create_or_update(endpoint).result()
    ```

    # [Studio](#tab/studio)
    
    Deploying custom model packages isn't supported in the studio currently. Use the option [Specify model package before deployment](concept-package-models.md#specify-model-package-before-deployment) to deploy standard model packages from studio, or use the Azure CLI or Python SDK v2 instead.

1. Create the deployment, using the package. Notice how `environment` is configured with the package you've created.

    # [Azure CLI](#tab/cli)

    __deployment.yml__
    
    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: with-package
    endpoint_name: hello-packages
    environment: azureml:sklearn-regression-online-pkg@latest
    instance_type: Standard_DS3_v2
    instance_count: 1
    ```

    # [Python](#tab/sdk)
    
    ```python
    deployment_package = ManagedOnlineDeployment(
        name="with-package",
        endpoint_name=endpoint_name,
        environment=model_package,
        instance_count=1
    )
    ```

    # [Studio](#tab/studio)

    Deploying custom model packages isn't supported in the studio currently. Use the option [Specify model package before deployment](concept-package-models.md#specify-model-package-before-deployment) to deploy standard model packages from the studio, or use the Azure CLI or Python SDK v2 instead.

    ---

    > [!TIP]
    > Notice you don't specify the model or scoring script in this example; they're all part of the package.

1. Start the deployment:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-deployment create -f model-deployment.yml
    ```

    # [Python](#tab/sdk)
    
    ```python
    ml_client.online_deployments.begin_create_or_update(deployment_package).result()
    ```

    # [Studio](#tab/studio)

    Deploying custom model packages isn't supported in the studio currently. Use the option [Specify model package before deployment](concept-package-models.md#specify-model-package-before-deployment) to deploy standard model packages from the studio, or use the Azure CLI or Python SDK v2 instead.

1. At this point, the deployment is ready to be consumed. You can test how it's working by creating a sample request file:

    __sample-request.json__

    ```json
    {
        "data": [
            [1,2,3,4,5,6,7,8,9,10], 
            [10,9,8,7,6,5,4,3,2,1]
        ]
    }
    ```

1. Send the request to the endpoint

    # [Azure CLI](#tab/cli)

    ```azurecli
    az ml online-endpoint invoke -n $ENDPOINT_NAME -d with-package -f sample-request.json
    ```

    # [Python](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name, 
        deployment_name="with-package", 
        request_file="sample-request.json"
    )
    ```

    # [Studio](#tab/studio)

    1. Go to the **Endpoints** section.

    1. Select the endpoint you've created.

    1. Select the **Test** tab.

    1. In the **Input data to test endpoint** section, paste the following content:

        ```json
        {
            "data": [
                [1,2,3,4,5,6,7,8,9,10], 
                [10,9,8,7,6,5,4,3,2,1]
            ]
        }
        ```

    1. Select **Test**. You should see two numeric predictions being generated.

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

Once the connection is created, build the model package as described in the section for [Package a custom model](#package-a-custom-model). In the following example, the **base environment** of the package uses a private feed for the Python dependency `bar`, as specified in the following conda file:

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
    
    ```python
    workspace_client = MLClient.from_config(
        credential=DefaultAzureCredential(), 
    )
    registry_client = MLClient(
        credential=DefaultAzureCredential(), 
        registry_name="azureml"
    )
    ```
    
    # [Studio](#tab/studio)
    
    Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

    
1. Get a reference to the model you want to package:

    # [Azure CLI](#tab/cli)

    ```azurecli
    MODEL_NAME="t5-base"
    MODEL_VERSION=$(az ml model show --name $MODEL_NAME --label latest --registry-name azureml | jq .version -r)
    ```

    # [Python](#tab/sdk)
    
    ```python
    model_name = "t5-base"
    model = registry_client.models.get(name=model_name, label="latest")
    ```
    
    # [Studio](#tab/studio)
    
    Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

    
1. Create a reference to the target workspace for the model package. The model package uses the model in the registry but produces an environment (the packaged model) in the target workspace:

    # [Azure CLI](#tab/cli)

    The following code gets the subscription, resource group name, and workspace name from the default values in the console. Replace them with specific values if needed.

    ```azurecli
    SUBSCRIPTION_ID=$(az account show | jq .tenantId -r)
    RESOURCE_GROUP_NAME=$(az configure --list-defaults | jq '.[] | select(.name == "group") | .value' -r)
    WORKSPACE_NAME=$(az configure --list-defaults | jq '.[] | select(.name == "workspace") | .value' -r)
    MODEL_PACKAGE_NAME="pkg-$MODEL_NAME-$MODEL_VERSION"
    MODEL_PACKAGE_VERSION=$(date +%s)

    TARGET_ENVIRONMENT="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE_NAME/environments/$MODEL_PACKAGE_NAME/versions/$MODEL_PACKAGE_VERSION"
    ```

    # [Python](#tab/sdk)

    The following code gets the subscription, resource group name, and workspace name from the workspace `MLClient`. Replace them with specific values if needed.
    
    ```python
    import time

    model_package_name = f"pkg-{model.name}-{model.version}"
    model_package_version = str(int(time.time()))

    target_environment = f"/subscriptions/{ml_client.subscription_id}/resourceGroups/{ml_client.resource_group_name}/providers/Microsoft.MachineLearningServices/workspaces/{ml_client.workspace_name}/environments/{model_package_name}/versions/{model_package_version}"
    ```
    
    # [Studio](#tab/studio)
    
    Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

    
1. Configure a package specification:

    # [Azure CLI](#tab/cli)
    
    __package.yml__
    
    ```yml
    $schema: http://azureml/sdk-2-0/ModelVersionPackage.json
    target_environment_name: $TARGET_ENVIRONMENT
    inferencing_server: 
        type: azureml_online
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    package_config = ModelPackage(
        target_environment_name=target_environment,
        inferencing_server=AzureMLOnlineInferencingServer(
            code_configuration=CodeConfiguration()
        ),
    )
    ```
    
    # [Studio](#tab/studio)
    
    Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

    
    ---

    > [!NOTE]
    > See how `target_environment_name` now contains the name of a resource.
    
2. Start the operation to create the model package:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml model package --name $MODEL_NAME \
                        --version $MODEL_VERSION \
                        --registry-name azureml \
                        --file package.yml \
                        --set target_environment_name=$TARGET_ENVIRONMENT
    ```

    > [!TIP]
    > Notice use of the command `--set target_environment_name` to dynamically change the property value from the YAML definition.
    
    # [Python](#tab/sdk)
    
    ```python
    model_package = ml_client.models.begin_package(model_name, model.version, package_config)
    ```
    
    # [Studio](#tab/studio)
    
    Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

    
The package is now created in the target workspace and ready to be deployed.

## Package models to deploy outside of Azure Machine Learning

Model packages can be deployed outside of Azure Machine Learning if needed.  To guarantee portability, you only need to ensure that the **model configuration** in your package has the mode set to **copy** so that the model itself is copied inside the generated docker image instead of referenced from the model registry in Azure Machine Learning.

The following code shows how to configure `copy` in a model package:

# [Azure CLI](#tab/cli)

__package-external.yml__

```yml
$schema: http://azureml/sdk-2-0/ModelVersionPackage.json
base_environment_source:
    type: environment_asset
    resource_id: azureml:sklearn-regression-env@latest
target_environment_name: sklearn-regression-docker-pkg
inferencing_server: 
    type: azureml_online
    code_configuration:
        code: src
        entry_script: score.py
model_configuration:
    mode: copy
```

# [Python](#tab/sdk)

```python
package_config = ModelPackage(
    target_environment_name="sklearn-regression-online-pkg",
    base_environment_source=BaseEnvironment(
        type=BaseEnvironmentType.EnvironmentAsset, 
        resource_id=base_environment.id
    ),
    inferencing_server=AzureMLOnlineInferencingServer(
        code_configuration=CodeConfiguration(
            code='src', 
            scoring_script='score.py'
        )
    ),
    model_configuration=ModelConfiguration(mode="copy")
)
```

# [Studio](#tab/studio)

Creating packages in the studio isn't supported currently. Use the Azure CLI or Python SDK v2 instead.

---

## Next step

> [!div class="nextstepaction"]
> [Package and deploy a model to App Service](how-to-package-models-app-service.md)
