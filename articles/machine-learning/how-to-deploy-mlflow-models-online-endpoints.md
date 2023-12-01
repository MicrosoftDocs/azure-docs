---
title: Deploy MLflow models to online endpoint
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model as a web service that's automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 03/31/2022
ms.topic: how-to
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, devx-track-azurecli, cliv2, event-tier1-build-2022
---

# Deploy MLflow models to online endpoints

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to an [online endpoint](concept-endpoints.md) for real-time inference. When you deploy your MLflow model to an online endpoint, you don't need to indicate a scoring script or an environment. This characteristic is referred as __no-code deployment__. 

For no-code-deployment, Azure Machine Learning 

* Dynamically installs Python packages provided in the `conda.yaml` file. Hence, dependencies are installed during container runtime.
* Provides a MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * A scoring script to perform inference.

[!INCLUDE [mlflow-model-package-for-workspace-without-egress](includes/mlflow-model-package-for-workspace-without-egress.md)]


## About this example

This example shows how you can deploy an MLflow model to an online endpoint to perform predictions. This example uses an MLflow model based on the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html). This dataset contains ten baseline variables, age, sex, body mass index, average blood pressure, and six blood serum measurements obtained from n = 442 diabetes patients. It also contains the response of interest, a quantitative measure of disease progression one year after baseline (regression).

The model was trained using an `scikit-learn` regressor and all the required preprocessing has been packaged as a pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo, and then change directories to the `cli/endpoints/online` if you are using the Azure CLI or `sdk/endpoints/online` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/online
```

### Follow along in Jupyter Notebooks

You can follow along this sample in the following notebooks. In the cloned repository, open the notebook: [mlflow_sdk_online_endpoints_progresive.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/mlflow_sdk_online_endpoints.ipynb).

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role allowing Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).
- You must have a MLflow model registered in your workspace. Particularly, this example registers a model trained for the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html).

Additionally, you need to:

# [Azure CLI](#tab/cli)

- Install the Azure CLI and the ml extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

# [Python (Azure Machine Learning SDK)](#tab/sdk)

- Install the Azure Machine Learning SDK for Python
    
    ```bash
    pip install azure-ai-ml azure-identity
    ```
    
# [Python (MLflow SDK)](#tab/mlflow)

- Install the MLflow SDK package `mlflow` and the Azure Machine Learning plug-in for MLflow `azureml-mlflow`.

    ```bash
    pip install mlflow azureml-mlflow
    ```

- If you are not running in Azure Machine Learning compute, configure the MLflow tracking URI or MLflow's registry URI to point to the workspace you are working on. See [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md) for more details.

# [Studio](#tab/studio)

There are no more prerequisites when working in Azure Machine Learning studio.

---


### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where we are going to work on.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python (Azure Machine Learning SDK)](#tab/sdk)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we connect to the workspace in which you perform deployment tasks.

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
    from azure.ai.ml.constants import AssetTypes
    from azure.identity import DefaultAzureCredential
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
    ```

1. Configure the deployment client

    ```python
    deployment_client = get_deploy_client(mlflow.get_tracking_uri())    
    ```

# [Studio](#tab/studio)

Navigate to [Azure Machine Learning studio](https://ml.azure.com).

---

### Registering the model

Online Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='sklearn-diabetes'
az ml model create --name $MODEL_NAME --type "mlflow_model" --path "sklearn-diabetes/model"
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

To create a model in Azure Machine Learning, open the Models page in Azure Machine Learning. Select **Register model** and select where your model is located. Fill out the required fields, and then select __Register__.

:::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

---

Alternatively, if your model was logged inside of a run, you can register it directly.

> [!TIP]
> To register the model, you will need to know the location where the model has been stored. If you are using `autolog` feature of MLflow, the path will depend on the type and framework of the model being used. We recommend to check the jobs output to identify which is the name of this folder. You can look for the folder that contains a file named `MLModel`. If you are logging your models manually using `log_model`, then the path is the argument you pass to such method. As an example, if you log the model using `mlflow.sklearn.log_model(my_model, "classifier")`, then the path where the model is stored is `classifier`.

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

1. First. we need to configure the endpoint where the model will be deployed. The following example configures the name and authentication mode of the endpoint:
    
    # [Azure CLI](#tab/cli)
    
    __endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/ncd/create-endpoint.yaml":::

    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    ```python
    endpoint_name = "sklearn-diabetes-" + datetime.datetime.now().strftime("%m%d%H%M%f")

    endpoint = ManagedOnlineEndpoint(
        name=endpoint_name,
        description="An online endpoint to generate predictions for the diabetes dataset",
        auth_mode="key",
        tags={"foo": "bar"},
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    We can configure the properties of this endpoint using a configuration file. In this case, we are configuring the authentication mode of the endpoint to be "key".
    
    ```python
    endpoint_config = {
        "auth_mode": "key",
        "identity": {
            "type": "system_assigned"
        }
    }
    ```

    Let's write this configuration into a `JSON` file:

    ```python
    endpoint_config_path = "endpoint_config.json"
    with open(endpoint_config_path, "w") as outfile:
        outfile.write(json.dumps(endpoint_config))
    ```

    # [Studio](#tab/studio)

    *You will perform this step in the deployment stage.*

1. Let's create the endpoint:
    
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

    *You will perform this step in the deployment stage.*

1. Now, it is time to configure the deployment. A deployment is a set of resources required for hosting the model that does the actual inferencing. 
    
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

    If your endpoint doesn't have egress connectivity, use [model packaging (preview)](how-to-package-models.md) by including the argument `with_package=True`:

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

    To configure the hardware requirements of your deployment, you need to create a JSON file with the desired configuration:

    ```python
    deploy_config = {
        "instance_type": "Standard_F4s_v2",
        "instance_count": 1,
    }
    ```
    
    > [!NOTE]
    > The full specification of this configuration can be found at [Managed online deployment schema (v2)](reference-yaml-deployment-managed-online.md).
    
    Write the configuration to a file:

    ```python
    deployment_config_path = "deployment_config.json"
    with open(deployment_config_path, "w") as outfile:
        outfile.write(json.dumps(deploy_config))
    ```

    # [Studio](#tab/studio)

    *You will perform this step in the deployment stage.*

    ---
    
    > [!NOTE]
    > `scoring_script` and `environment` auto generation are only supported for `pyfunc` model's flavor. To use a different flavor, see [Customizing MLflow model deployments](#customizing-mlflow-model-deployments).

1. Let's create the deployment:
    
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

    1. From the __Endpoints__ page, Select **+Create**.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the MLflow model registered previously. Select __Next__ to continue.
    1. When you select a model registered in MLflow format, in the Environment step of the wizard, you don't need a scoring script or an environment.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models":::

    1. Complete the wizard to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" alt-text="Screenshot showing NCD review screen":::

1. Assign all the traffic to the deployment: So far, the endpoint has one deployment, but none of its traffic is assigned to it. Let's assign it.

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI since we used the `--all-traffic` during creation. If you need to change traffic, you can use the command `az ml online-endpoint update --traffic` as explained at [Progressively update traffic](how-to-deploy-mlflow-models-online-progressive.md#progressively-update-the-traffic).*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint.traffic = { blue_deployment_name: 100 }
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

    *This step in not required in studio since we assigned the traffic during creation.*

1. Update the endpoint configuration:

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI since we used the `--all-traffic` during creation. If you need to change traffic, you can use the command `az ml online-endpoint update --traffic` as explained at [Progressively update traffic](how-to-deploy-mlflow-models-online-progressive.md#progressively-update-the-traffic).*
    
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

    *This step in not required in studio since we assigned the traffic during creation.*

### Invoke the endpoint

Once your deployment completes, your deployment is ready to serve request. One of the easier ways to test the deployment is by using the built-in invocation capability in the deployment client you are using.

**sample-request-sklearn.json**

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/ncd/sample-request-sklearn.json":::

> [!NOTE]
> Notice how the key `input_data` has been used in this example instead of `inputs` as used in MLflow serving. This is because Azure Machine Learning requires a different input format to be able to automatically generate the swagger contracts for the endpoints. See [Differences between models deployed in Azure Machine Learning and MLflow built-in server](how-to-deploy-mlflow-models.md#differences-between-models-deployed-in-azure-machine-learning-and-mlflow-built-in-server) for details about expected input format.

To submit a request to the endpoint, you can do as follows:

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
# Read the sample request we have in the json file to construct a pandas data frame
with open("sample-request-sklearn.json", "r") as f:
    sample_request = json.loads(f.read())
    samples = pd.DataFrame(**sample_request["input_data"])

deployment_client.predict(endpoint=endpoint_name, df=samples)
```

# [Studio](#tab/studio)

MLflow models can use the __Test__ tab to create invocations to the created endpoints. To do that:

1. Go to the __Endpoints__ tab and select the new endpoint created.
1. Go to the __Test__ tab.
1. Paste the content of the file `sample-request-sklearn.json`.
1. Click on __Test__.
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
> For MLflow no-code-deployment, **[testing via local endpoints](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.


## Customizing MLflow model deployments

MLflow models can be deployed to online endpoints without indicating a scoring script in the deployment definition. However, you can opt to customize how inference is executed.

You will typically select this workflow when:

> [!div class="checklist"]
> - The model doesn't have a `PyFunc` flavor on it.
> - You need to customize the way the model is run, for instance, use an specific flavor to load it with `mlflow.<flavor>.load_model()`.
> - You need to do pre/post processing in your scoring routine when it is not done by the model itself.
> - The output of the model can't be nicely represented in tabular data. For instance, it is a tensor representing an image.

> [!IMPORTANT]
> If you choose to indicate an scoring script for an MLflow model deployment, you will also have to specify the environment where the deployment will run.

### Steps

Use the following steps to deploy an MLflow model with a custom scoring script.

1. Identify the folder where your MLflow model is placed.

    a. Go to [Azure Machine Learning portal](https://ml.azure.com).

    b. Go to the section __Models__.

    c. Select the model you are trying to deploy and click on the tab __Artifacts__.

    d. Take note of the folder that is displayed. This folder was indicated when the model was registered.

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-model-folder-name.png" alt-text="Screenshot showing the folder where the model artifacts are placed.":::

1. Create a scoring script. Notice how the folder name `model` you identified before has been included in the `init()` function.

    __score.py__

    :::code language="python" source="~/azureml-examples-main/cli/endpoints/online/ncd/sklearn-diabetes/src/score.py" highlight="14":::

    > [!TIP]
    > The previous scoring script is provided as an example about how to perform inference of an MLflow model. You can adapt this example to your needs or change any of its parts to reflect your scenario.

    > [!WARNING]
    > __MLflow 2.0 advisory__: The provided scoring script will work with both MLflow 1.X and MLflow 2.X. However, be advised that the expected input/output formats on those versions may vary. Check the environment definition used to ensure you are using the expected MLflow version. Notice that MLflow 2.0 is only supported in Python 3.8+.

1. Let's create an environment where the scoring script can be executed. Since our model is MLflow, the conda requirements are also specified in the model package (for more details about MLflow models and the files included on it see The MLmodel format). We are going then to build the environment using the conda dependencies from the file. However, we need also to include the package `azureml-inference-server-http` which is required for Online Deployments in Azure Machine Learning.
    
    The conda definition file looks as follows:

    __conda.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/ncd/sklearn-diabetes/environment/conda.yaml":::

    > [!NOTE]
    > Note how the package `azureml-inference-server-http` has been added to the original conda dependencies file. 

    We will use this conda dependencies file to create the environment:

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

    *This operation is not supported in MLflow SDK*

    # [Studio](#tab/studio)
    
    On [Azure Machine Learning studio portal](https://ml.azure.com), follow these steps:
    
    1. Navigate to the __Environments__ tab on the side menu.
    1. Select the tab __Custom environments__ > __Create__.
    1. Enter the name of the environment, in this case `sklearn-mlflow-online-py37`.
    1. On __Select environment type__ select __Use existing docker image with conda__.
    1. On __Container registry image path__, enter `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04`.
    1. On __Customize__ section copy the content of the file `sklearn-diabetes/environment/conda.yml` we introduced before. 
    1. Click on __Next__ and then on __Create__.
    1. The environment is ready to be used.   

    ---

1. Let's create the deployment now:

    # [Azure CLI](#tab/cli)
    
    Create a deployment configuration file:
    
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

    *This operation is not supported in MLflow SDK*

    # [Studio](#tab/studio)
    
    On [Azure Machine Learning studio portal](https://ml.azure.com), follow these steps:
   
    1. From the __Endpoints__ page, Select **+Create**.
    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the MLflow model registered previously. Select __Next__ to continue.
    1. When you select a model registered in MLflow format, in the Environment step of the wizard, you don't need a scoring script or an environment. However, you can indicate one by selecting the checkbox __Customize environment and scoring script__.

        :::image type="content" source="media/how-to-batch-scoring-script/configure-scoring-script-mlflow.png" lightbox="media/how-to-batch-scoring-script/configure-scoring-script-mlflow.png" alt-text="Screenshot showing how to indicate an environment and scoring script for MLflow models":::
    
    1. Select the environment and scoring script you created before, then select __Next__.
    1. Complete the wizard to deploy the model to the endpoint.

    ---

1. Once your deployment completes, your deployment is ready to serve request. One of the easier ways to test the deployment is by using a sample request file along with the `invoke` method.

    **sample-request-sklearn.json**
    
    :::code language="json" source="~/azureml-examples-main/cli/endpoints/online/ncd/sample-request-sklearn.json":::

    To submit a request to the endpoint, you can do as follows:
    
    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file endpoints/online/mlflow/sample-request-sklearn-custom.json
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name,
        deployment_name=deployment.name,
        request_file="sample-request-sklearn.json",
    )
    ```

    # [Python (MLflow SDK)](#tab/mlflow)

    *This operation is not supported in MLflow SDK*

    # [Studio](#tab/studio)
    
    MLflow models can use the __Test__ tab to create invocations to the created endpoints. To do that:
    
    1. Go to the __Endpoints__ tab and select the new endpoint created.
    1. Go to the __Test__ tab.
    1. Paste the content of the file `sample-request-sklearn.json`.
    1. Click on __Test__.
    1. The predictions will show up in the box on the right.
    
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
    > __MLflow 2.0 advisory__: In MLflow 1.X, the key `predictions` will be missing.


## Clean up resources

Once you're done with the endpoint, you can delete the associated resources:

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

1. Navigate to the __Endpoints__ tab on the side menu.
1. Select the tab __Online endpoints__.
1. Select the endpoint you want to delete.
1. Click on __Delete__.
1. The endpoint all along with its deployments will be deleted.

---

## Next steps

To learn more, review these articles:

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use online endpoints in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [Use batch endpoints for batch scoring](batch-inference/how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with an online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoint deployment](how-to-troubleshoot-managed-online-endpoints.md)
