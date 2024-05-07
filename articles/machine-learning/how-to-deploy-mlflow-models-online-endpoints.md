---
title: Deploy MLflow models to real-time endpoints
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model as a web service that's managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 01/31/2024
ms.topic: how-to
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, devx-track-azurecli, cliv2
---

# Deploy MLflow models to online endpoints

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to an [online endpoint](concept-endpoints.md) for real-time inference. When you deploy your MLflow model to an online endpoint, you don't need to specify a scoring script or an environment—this functionality is known as _no-code deployment_.

For no-code-deployment, Azure Machine Learning:

* Dynamically installs Python packages provided in the `conda.yaml` file. Hence, dependencies get installed during container runtime.
* Provides an MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * A scoring script for inferencing.

[!INCLUDE [mlflow-model-package-for-workspace-without-egress](includes/mlflow-model-package-for-workspace-without-egress.md)]


## About the example

The example shows how you can deploy an MLflow model to an online endpoint to perform predictions. The example uses an MLflow model that's based on the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html). This dataset contains 10 baseline variables: age, sex, body mass index, average blood pressure, and six blood serum measurements obtained from 442 diabetes patients. It also contains the response of interest, a quantitative measure of disease progression one year after baseline.

The model was trained using a `scikit-learn` regressor, and all the required preprocessing has been packaged as a pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo, and then change directories to `cli`, if you're using the Azure CLI. If you're using the Azure Machine Learning SDK for Python, change directories to `sdk/python/endpoints/online/mlflow`.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

### Follow along in Jupyter Notebook

You can follow the steps for using the Azure Machine Learning Python SDK by opening the [Deploy MLflow model to online endpoints](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/mlflow/online-endpoints-deploy-mlflow-model.ipynb) notebook in the cloned repository.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information on roles, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).
- You must have an MLflow model registered in your workspace. This article registers a model trained for the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html) in the workspace.

- Also, you need to:

    # [Azure CLI](#tab/cli)

    - Install the Azure CLI and the `ml` extension to the Azure CLI. For more information on installing the CLI, see [Install and set up the CLI (v2)](how-to-configure-cli.md).

    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    - Install the Azure Machine Learning SDK for Python.

        ```bash
        pip install azure-ai-ml azure-identity
        ```

    # [Python (MLflow SDK)](#tab/mlflow)

    - Install the MLflow SDK package `mlflow` and the Azure Machine Learning plug-in for MLflow `azureml-mlflow`.

        ```bash
        pip install mlflow azureml-mlflow
        ```

    - If you're not running code in the Azure Machine Learning compute, configure the MLflow tracking URI or MLflow's registry URI to point to the Azure Machine Learning workspace you're working on. For more information on how to connect MLflow to the workspace, see [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md).

    # [Studio](#tab/studio)

    No additional prerequisites when working in Azure Machine Learning studio.

---


### Connect to your workspace

First, connect to the Azure Machine Learning workspace where you'll work.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python (Azure Machine Learning SDK)](#tab/sdk)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, connect to the workspace in which you'll perform deployment tasks.

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    Environment,
    CodeConfiguration,
    )
    from azure.identity import DefaultAzureCredential
    from azure.ai.ml.constants import AssetTypes
    ```

2. Configure workspace details and get a handle to the workspace:

    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

# [Python (MLflow SDK)](#tab/mlflow)

1. Import the required libraries

    ```python
    import json
    import mlflow
    import requests
    import pandas as pd
    from mlflow.deployments import get_deploy_client
    from mlflow.tracking import MlflowClient
    ```

1. Initialize the MLflow client

    ```python
    mlflow_client = MlflowClient()
    ```

1. Configure the deployment client

    ```python
    deployment_client = get_deploy_client(mlflow.get_tracking_uri())    
    ```

# [Studio](#tab/studio)

Navigate to [Azure Machine Learning studio](https://ml.azure.com).

---

### Register the model

You can deploy only registered models to online endpoints. In this case, you already have a local copy of the model in the repository, so you only need to publish the model to the registry in the workspace. You can skip this step if the model you're trying to deploy is already registered.

# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='sklearn-diabetes'
az ml model create --name $MODEL_NAME --type "mlflow_model" --path "endpoints/online/ncd/sklearn-diabetes/model"
```

# [Python (Azure Machine Learning SDK)](#tab/sdk)

```python
model_name = 'sklearn-diabetes'
model_local_path = "sklearn-diabetes/model"
model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
)
```

# [Python (MLflow SDK)](#tab/mlflow)

```python
model_name = 'sklearn-diabetes'
model_local_path = "sklearn-diabetes/model"

registered_model = mlflow_client.create_model_version(
    name=model_name, source=f"file://{model_local_path}"
)
version = registered_model.version
```

# [Studio](#tab/studio)

To create a model in Azure Machine Learning studio:

- Open the __Models__ page in the studio.
- Select __Register__ and select where your model is located. For this example, select __From local files__.
- On the __Upload model__ page, select __MLflow__ for the model type.
- Select __Browse__ to select the model folder, then select __Next__.
- Provide a __Name__ for the model on the __Model settings__ page and select __Next__.
- Review the uploaded model fines and model settings on the __Review__ page, then select __Register__.

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/register-model-in-studio.png" alt-text="Screenshot of the UI to register a model." lightbox="media/how-to-deploy-mlflow-models-online-endpoints/register-model-in-studio.png":::

---

#### What if your model was logged inside of a run?

If your model was logged inside of a run, you can register it directly.

To register the model, you need to know the location where it is stored. If you're using MLflow's `autolog` feature, the path to the model depends on the model type and framework. You should check the jobs output to identify the name of the model's folder. This folder contains a file named `MLModel`.

If you're using the `log_model` method to manually log your models, then pass the path to the model as the argument to the method. For example, if you log the model, using `mlflow.sklearn.log_model(my_model, "classifier")`, then the path where the model is stored is called `classifier`.

# [Azure CLI](#tab/cli)

Use the Azure Machine Learning CLI v2 to create a model from a training job output. In the following example, a model named `$MODEL_NAME` is registered using the artifacts of a job with ID `$RUN_ID`. The path where the model is stored is `$MODEL_PATH`.

```bash
az ml model create --name $MODEL_NAME --path azureml://jobs/$RUN_ID/outputs/artifacts/$MODEL_PATH
```

> [!NOTE]
> The path `$MODEL_PATH` is the location where the model has been stored in the run.

# [Python (Azure Machine Learning SDK)](#tab/sdk)

```python
model_name = 'sklearn-diabetes'

ml_client.models.create_or_update(
    Model(
        path=f"azureml://jobs/{RUN_ID}/outputs/artifacts/{MODEL_PATH}"
        name=model_name,
        type=AssetTypes.MLFLOW_MODEL
    )
) 
```

> [!NOTE]
> The path `MODEL_PATH` is the location where the model has been stored in the run.

# [Python (MLflow SDK)](#tab/mlflow)

```python
model_name = 'sklearn-diabetes'

registered_model = mlflow_client.create_model_version(
    name=model_name, source=f"runs://{RUN_ID}/{MODEL_PATH}"
)
version = registered_model.version
```

> [!NOTE]
> The path `MODEL_PATH` is the location where the model has been stored in the run.

# [Studio](#tab/studio)

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

---

## Deploy an MLflow model to an online endpoint

1. Configure the endpoint where the model will be deployed. The following example configures the name and authentication mode of the endpoint:

    # [Azure CLI](#tab/cli)

    Set an endpoint name by running the following command (replace `YOUR_ENDPOINT_NAME` with a unique name):

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-ncd.sh" ID="set_endpoint_name":::

    Configure the endpoint:

    __create-endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/ncd/create-endpoint.yaml":::

    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    ```python
    # Creating a unique endpoint name with current datetime to avoid conflicts
    import datetime

    endpoint_name = "sklearn-diabetes-" + datetime.datetime.now().strftime("%m%d%H%M%f")

    endpoint = ManagedOnlineEndpoint(
        name=endpoint_name,
        description="An online endpoint to generate predictions for the diabetes dataset",
        auth_mode="key",
        tags={"foo": "bar"},
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    You can configure the properties of this endpoint using a configuration file. In this case, you're configuring the authentication mode of the endpoint to be "key".
    
    ```python

    # Creating a unique endpoint name with current datetime to avoid conflicts
    import datetime
    
    endpoint_name = "sklearn-diabetes-" + datetime.datetime.now().strftime("%m%d%H%M%f")

    endpoint_config = {
        "auth_mode": "key",
        "identity": {
            "type": "system_assigned"
        }
    }
    ```

    Write this configuration into a `JSON` file:

    ```python
    endpoint_config_path = "endpoint_config.json"
    with open(endpoint_config_path, "w") as outfile:
        outfile.write(json.dumps(endpoint_config))
    ```

    # [Studio](#tab/studio)

    *You'll perform this step in the deployment stage.*

1. Create the endpoint:
    
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-ncd.sh" ID="create_endpoint":::

    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint)
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    endpoint = deployment_client.create_endpoint(
        name=endpoint_name,
        config={"endpoint-config-file": endpoint_config_path},
    )
    ```

    # [Studio](#tab/studio)

    *You'll perform this step in the deployment stage.*

1. Configure the deployment. A deployment is a set of resources required for hosting the model that does the actual inferencing.
    
    # [Azure CLI](#tab/cli)

    __sklearn-deployment.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/ncd/sklearn-deployment.yaml":::

    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    ```python
    blue_deployment = ManagedOnlineDeployment(
        name="blue",
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_F4s_v2",
        instance_count=1
    )
    ```

    Alternatively, if your endpoint doesn't have egress connectivity, use [model packaging (preview)](how-to-package-models.md) by including the argument `with_package=True`:

    ```python
    blue_deployment = ManagedOnlineDeployment(
        name="blue",
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_F4s_v2",
        instance_count=1,
        with_package=True,
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    blue_deployment_name = "blue"
    ```

    To configure the hardware requirements of your deployment, create a JSON file with the desired configuration:

    ```python
    deploy_config = {
        "instance_type": "Standard_F4s_v2",
        "instance_count": 1,
    }
    ```
    
    > [!NOTE]
    > For details about the full specification of this configuration, see [Managed online deployment schema (v2)](reference-yaml-deployment-managed-online.md).
    
    Write the configuration to a file:

    ```python
    deployment_config_path = "deployment_config.json"
    with open(deployment_config_path, "w") as outfile:
        outfile.write(json.dumps(deploy_config))
    ```

    # [Studio](#tab/studio)

    *You'll perform this step in the deployment stage.*

    ---
    
    > [!NOTE]
    > Autogeneration of the `scoring_script` and `environment` are only supported for `pyfunc` model flavor. To use a different model flavor, see [Customizing MLflow model deployments](#customize-mlflow-model-deployments).

1. Create the deployment:
    
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-ncd.sh" ID="create_sklearn_deployment":::

    If your endpoint doesn't have egress connectivity, use model packaging (preview) by including the flag `--with-package`:

    ```azurecli
    az ml online-deployment create --with-package --name sklearn-deployment --endpoint $ENDPOINT_NAME -f endpoints/online/ncd/sklearn-deployment.yaml --all-traffic
    ```

    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    ```python
    ml_client.online_deployments.begin_create_or_update(blue_deployment)
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    blue_deployment = deployment_client.create_deployment(
        name=blue_deployment_name,
        endpoint=endpoint_name,
        model_uri=f"models:/{model_name}/{version}",
        config={"deploy-config-file": deployment_config_path},
    )    
    ```

    # [Studio](#tab/studio)

    1. From the __Endpoints__ page, Select **Create** from the **Real-time endpoints** tab.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Choose the MLflow model that you registered previously, then select the **Select** button.
    
        > [!NOTE]
        > The configuration page includes a note to inform you that the the scoring script and environment are auto generated for your selected MLflow model.

    1. Select **New** to deploy to a new endpoint.
    1. Provide a name for the endpoint and deployment or keep the default names.
    1. Select __Deploy__ to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/deployment-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/deployment-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models.":::


1. Assign all the traffic to the deployment. So far, the endpoint has one deployment, but none of its traffic is assigned to it.

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI, since you used the `--all-traffic` flag during creation. If you need to change traffic, you can use the command `az ml online-endpoint update --traffic`. For more information on how to update traffic, see [Progressively update traffic](how-to-deploy-mlflow-models-online-progressive.md#progressively-update-the-traffic).*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint.traffic = {"blue": 100}
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    traffic_config = {"traffic": {blue_deployment_name: 100}}
    ```

    Write the configuration to a file:

    ```python
    traffic_config_path = "traffic_config.json"
    with open(traffic_config_path, "w") as outfile:
        outfile.write(json.dumps(traffic_config))
    ```

    # [Studio](#tab/studio)

    *This step in not required in the studio.*

1. Update the endpoint configuration:

    # [Azure CLI](#tab/cli)

    *This step in not required in the Azure CLI, since you used the `--all-traffic` flag during creation. If you need to change traffic, you can use the command `az ml online-endpoint update --traffic`. For more information on how to update traffic, see [Progressively update traffic](how-to-deploy-mlflow-models-online-progressive.md#progressively-update-the-traffic).*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.update_endpoint(
        endpoint=endpoint_name,
        config={"endpoint-config-file": traffic_config_path},
    )
    ```

    # [Studio](#tab/studio)

    *This step in not required in the studio.*

## Invoke the endpoint

Once your deployment is ready, you can use it to serve request. One way to test the deployment is by using the built-in invocation capability in the deployment client you're using. The following JSON is a sample request for the deployment.

**sample-request-sklearn.json**

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/ncd/sample-request-sklearn.json":::

> [!NOTE]
>`input_data` is used in this example, instead of `inputs` that is used in MLflow serving. This is because Azure Machine Learning requires a different input format to be able to automatically generate the swagger contracts for the endpoints. For more information about expected input formats, see [Differences between models deployed in Azure Machine Learning and MLflow built-in server](how-to-deploy-mlflow-models.md#models-deployed-in-azure-machine-learning-vs-models-deployed-in-the-mlflow-built-in-server).

Submit a request to the endpoint as follows:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-ncd.sh" ID="test_sklearn_deployment":::

# [Python (Azure Machine Learning SDK)](#tab/sdk)

```python
ml_client.online_endpoints.invoke(
    endpoint_name=endpoint_name,
    request_file="sample-request-sklearn.json",
)
```

# [Python (MLflow SDK)](#tab/mlflow)

```python
# Read the sample request that's in the json file to construct a pandas data frame
with open("sample-request-sklearn.json", "r") as f:
    sample_request = json.loads(f.read())
    samples = pd.DataFrame(**sample_request["input_data"])

deployment_client.predict(endpoint=endpoint_name, df=samples)
```

# [Studio](#tab/studio)

MLflow models can use the __Test__ tab to create invocations to the created endpoints. To do that:

1. Go to the __Endpoints__ tab and select the endpoint you created.
1. Go to the __Test__ tab.
1. Paste the content of the file `sample-request-sklearn.json`.
1. Select __Test__.
1. The predictions will show up in the box on the right.

---

The response will be similar to the following text:

```json
[ 
  11633.100167144921,
  8522.117402884991
]
```

> [!IMPORTANT]
> For MLflow no-code-deployment, **[testing via local endpoints](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-a-local-endpoint)** is currently not supported.


## Customize MLflow model deployments

You don't have to specify a scoring script in the deployment definition of an MLflow model to an online endpoint. However, you can opt to do so and customize how inference gets executed.

You'll typically want to customize your MLflow model deployment when:

> [!div class="checklist"]
> - The model doesn't have a `PyFunc` flavor on it.
> - You need to customize the way the model is run, for instance, to use a specific flavor to load the model, using `mlflow.<flavor>.load_model()`.
> - You need to do pre/post processing in your scoring routine when it's not done by the model itself.
> - The output of the model can't be nicely represented in tabular data. For instance, it's a tensor representing an image.

> [!IMPORTANT]
> If you choose to specify a scoring script for an MLflow model deployment, you'll also have to specify the environment where the deployment will run.

### Steps

To deploy an MLflow model with a custom scoring script:

1. Identify the folder where your MLflow model is located.

    a. Go to the [Azure Machine Learning studio](https://ml.azure.com).

    b. Go to the __Models__ section.

    c. Select the model you're trying to deploy and go to its __Artifacts__ tab.

    d. Take note of the folder that is displayed. This folder was specified when the model was registered.

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" alt-text="Screenshot showing the folder where the model artifacts are placed.":::

1. Create a scoring script. Notice how the folder name `model` that you previously identified is included in the `init()` function.

    > [!TIP]
    > The following scoring script is provided as an example about how to perform inference with an MLflow model. You can adapt this script to your needs or change any of its parts to reflect your scenario.

    __score.py__

    :::code language="python" source="~/azureml-examples-main/cli/endpoints/online/ncd/sklearn-diabetes/src/score.py" highlight="14":::

    > [!WARNING]
    > __MLflow 2.0 advisory__: The provided scoring script will work with both MLflow 1.X and MLflow 2.X. However, be advised that the expected input/output formats on those versions might vary. Check the environment definition used to ensure you're using the expected MLflow version. Notice that MLflow 2.0 is only supported in Python 3.8+.

1. Create an environment where the scoring script can be executed. Since the model is an MLflow model, the conda requirements are also specified in the model package. For more details about the files included in an MLflow model see [The MLmodel format](concept-mlflow-models.md#the-mlmodel-format). You'll then build the environment using the conda dependencies from the file. However, you need to also include the package `azureml-inference-server-http`, which is required for online deployments in Azure Machine Learning.
    
    The conda definition file is as follows:

    __conda.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/ncd/sklearn-diabetes/environment/conda.yaml":::

    > [!NOTE]
    > The `azureml-inference-server-http` package has been added to the original conda dependencies file.

    You'll use this conda dependencies file to create the environment:

    # [Azure CLI](#tab/cli)
    
    *The environment will be created inline in the deployment configuration.*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```pythonS
    environment = Environment(
        conda_file="sklearn-diabetes/environment/conda.yml",
        image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04:latest",
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    *This operation isn't supported in MLflow SDK*

    # [Studio](#tab/studio)

    1. Go to the __Environments__ tab on the side menu.
    1. Select the tab __Custom environments__ > __Create__.
    1. Enter the name of the environment, in this case `sklearn-mlflow-online-py37`.
    1. For __Select environment source__, choose __Use existing docker image with optional conda file__.
    1. For __Container registry image path__, enter `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04`.
    1. Select __Next__ to go to the __Customize__ section.
    1. Copy the content of the `sklearn-diabetes/environment/conda.yml` file and paste it in the text box. 
    1. Select __Next__ to go to the __Tags__ page, and then __Next__ again.
    1. On the __Review__ page, select __Create__. The environment is ready for use.
    ---

1. Create the deployment:

    # [Azure CLI](#tab/cli)

    Create a deployment configuration file __deployment.yml__:

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: sklearn-diabetes-custom
    endpoint_name: my-endpoint
    model: azureml:sklearn-diabetes@latest
    environment: 
      image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04
      conda_file: sklearn-diabetes/environment/conda.yml
    code_configuration:
      code: sklearn-diabetes/src
      scoring_script: score.py
    instance_type: Standard_F2s_v2
    instance_count: 1
    ```

    Create the deployment:

    ```azurecli
    az ml online-deployment create -f deployment.yml
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    blue_deployment = ManagedOnlineDeployment(
        name="blue",
        endpoint_name=endpoint_name,
        model=model,
        environment=environment,
        code_configuration=CodeConfiguration(
            code="sklearn-diabetes/src",
            scoring_script="score.py"
        ),
        instance_type="Standard_F4s_v2",
        instance_count=1,
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    *This operation isn't supported in MLflow SDK*

    # [Studio](#tab/studio)

    1. From the __Endpoints__ page, Select **+Create**.
    1. Select the MLflow model you registered previously.
    1. Select __More options__ in the endpoint creation wizard to open up advanced options.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/select-advanced-deployment-options.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/select-advanced-deployment-options.png" alt-text="Screenshot showing how to select advanced deployment options when creating an endpoint."::: 

    1. Provide a name and authentication type for the endpoint, and then select __Next__ to see that the model you selected is being used for your deployment.
    1. Select __Next__ to continue to the ___Deployment__ page.
    1. Select __Next__ to go to the __Code + environment__ page. When you select a model registered in MLflow format, you don't need to specify a scoring script or an environment on this page. However, you want to specify one in this section
    1. Select the slider next to __Customize environment and scoring script__.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/configure-scoring-script-mlflow.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/configure-scoring-script-mlflow.png" alt-text="Screenshot showing how to indicate an environment and scoring script for MLflow models.":::

    1. Browse to select the scoring script you created previously.
    1. Select __Custom environments__ for the environment type.
    1. Select the custom environment you created previously, and select __Next__.
    1. Complete the wizard to deploy the model to the endpoint.

    ---

1. Once your deployment completes, it is ready to serve requests. One way to test the deployment is by using a sample request file along with the `invoke` method.

    **sample-request-sklearn.json**
    
    :::code language="json" source="~/azureml-examples-main/cli/endpoints/online/ncd/sample-request-sklearn.json":::

    Submit a request to the endpoint as follows:
    
    # [Azure CLI](#tab/cli)

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-ncd.sh" ID="test_sklearn_deployment":::
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name,
        deployment_name=deployment.name,
        request_file="sample-request-sklearn.json",
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    *This operation isn't supported in MLflow SDK*

    # [Studio](#tab/studio)

    1. Go to the __Endpoints__ tab and select the new endpoint created.
    1. Go to the __Test__ tab.
    1. Paste the content of the `sample-request-sklearn.json` file into the __Input data to test endpoint__ box.
    1. Select __Test__.
    1. The predictions will show up under "Test results" to the right-hand side of the box.

    ---
    
    The response will be similar to the following text:
    
    ```json
    {
      "predictions": [ 
        11633.100167144921,
        8522.117402884991
      ]
    }
    ```

    > [!WARNING]
    > __MLflow 2.0 advisory__: In MLflow 1.X, the `predictions` key will be missing.


## Clean up resources

Once you're done using the endpoint, delete its associated resources:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-ncd.sh" ID="delete_endpoint":::

# [Python (Azure Machine Learning SDK)](#tab/sdk)

```python
ml_client.online_endpoints.begin_delete(endpoint_name)
```

# [Python (MLflow SDK)](#tab/mlflow)

```python
deployment_client.delete_endpoint(endpoint_name)
```

# [Studio](#tab/studio)

1. Go to the __Endpoints__ tab in the studio.
1. Select the __Real-time endpoints__ tab.
1. Select the endpoint you want to delete.
1. Select __Delete__.
1. The endpoint and all its deployments will be deleted.

---

## Related content

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [Troubleshoot online endpoint deployment](how-to-troubleshoot-managed-online-endpoints.md)
