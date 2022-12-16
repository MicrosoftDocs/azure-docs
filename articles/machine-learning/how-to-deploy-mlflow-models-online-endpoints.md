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
ms.devlang: azurecli
---

# Deploy MLflow models to online endpoints

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning CLI extension you are using:"]
> * [v1](./v1/how-to-deploy-mlflow-models.md)
> * [v2 (current version)](how-to-deploy-mlflow-models-online-endpoints.md)

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to an [online endpoint](concept-endpoints.md) for real-time inference. When you deploy your MLflow model to an online endpoint, you don't need to indicate a scoring script or an environment. This characteristic is usually referred as __no-code deployment__. 

For no-code-deployment, Azure Machine Learning 

* Dynamically installs Python packages provided in the `conda.yaml` file, this means the dependencies are installed during container runtime.
* Provides a MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * A scoring script to perform inference.

> [!WARNING]
> __Workspaces without public network access:__ Azure Machine Learning performs dynamic installation of packages when deploying MLflow models with no-code deployment. As a consequence, deploying MLflow models to online endpoints with no-code deployment in a private network without egress connectivity is not supported by the moment. If that's your case, either enable egress connectivity or indicate the environment to use in the deployment as explained in [Customizing MLflow model deployments](#customizing-mlflow-model-deployments).


## About this example

This example shows how you can deploy an MLflow model to an online endpoint to perform predictions. This example uses an MLflow model based on the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html). This dataset contains ten baseline variables, age, sex, body mass index, average blood pressure, and six blood serum measurements obtained from n = 442 diabetes patients, as well as the response of interest, a quantitative measure of disease progression one year after baseline (regression).

The model has been trained using an `scikit-learn` regressor and all the required preprocessing has been packaged as a pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo and then change directories to the `cli/endpoints/online` if you are using the Azure CLI or `sdk/endpoints/online` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/online
```

## Prerequisites

[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

* You must have a MLflow model registered in your workspace.  Particularly, this example will register a model trained for the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html).


### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where we are going to work on.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/sdk)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.

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

# [Studio](#tab/studio)

Navigate to [Azure Machine Learning Studio](https://ml.azure.com).

---

### Registering the model

Online Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='sklearn-diabetes'
az ml model create --name $MODEL_NAME --type "mlflow_model" --path "sklearn-diabetes/model"
```

# [Python](#tab/sdk)

```python
model_name = 'sklearn-diabetes'
model_local_path = "sklearn-diabetes/model"
model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
)
```

# [Studio](#tab/studio)

To create a model in Azure Machine Learning, open the Models page in Azure Machine Learning. Select **Register model** and select where your model is located. Fill out the required fields, and then select __Register__.

:::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

---

Alternatively, if your model was logged inside of a run, you can register it directly.

> [!TIP]
> To register the model, you will need to know the location where the model has been stored. If you are using `autolog` feature of MLflow, the path will depend on the type and framework of the model being used. We recommend to check the jobs output to identify which is the name of this folder. You can look for the folder that contains a file named `MLModel`. If you are logging your models manually using `log_model`, then the path is the argument you pass to such method. As an example, if you log the model using `mlflow.sklearn.log_model(my_model, "classifier")`, then the path where the model is stored is `classifier`.

# [Azure CLI](#tab/cli)

Use the Azure ML CLI v2 to create a model from a training job output. In the following example, a model named `$MODEL_NAME` is registered using the artifacts of a job with ID `$RUN_ID`. The path where the model is stored is `$MODEL_PATH`.

```bash
az ml model create --name $MODEL_NAME --path azureml://jobs/$RUN_ID/outputs/artifacts/$MODEL_PATH
```

> [!NOTE]
> The path `$MODEL_PATH` is the location where the model has been stored in the run.

# [Python](#tab/sdk)

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

# [Studio](#tab/studio)

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

---

## Deploy an MLflow model to an online endpoint

1. First. we need to configure the endpoint where the model will be deployed. The following example configures the name and authentication mode of the endpoint:
    
    # [Azure CLI](#tab/cli)
    
    __endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/create-endpoint.yaml":::

    # [Python](#tab/sdk)

    ```python
    endpoint_name = "sklearn-diabetes-" + datetime.datetime.now().strftime("%m%d%H%M%f")

    endpoint = ManagedOnlineEndpoint(
        name=endpoint_name,
        description="An online endpoint to generate predictions for the diabetes dataset",
        auth_mode="key",
        tags={"foo": "bar"},
    )
    ```

    # [Studio](#tab/studio)

    *You will perform this step in the deployment stage.*

1. Let's create the endpoint:
    
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_endpoint":::

    # [Python](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint)
    ```

    # [Studio](#tab/studio)

    *You will perform this step in the deployment stage.*

1. Now, it is time to configure the deployment. A deployment is a set of resources required for hosting the model that does the actual inferencing. 
    
    # [Azure CLI](#tab/cli)

    __sklearn-deployment.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/sklearn-deployment.yaml":::

    # [Python](#tab/sdk)

    ```python
    blue_deployment = ManagedOnlineDeployment(
        name="blue",
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_F4s_v2",
        instance_count=1
    )
    ```

    # [Studio](#tab/studio)

    *You will perform this step in the deployment stage.*

    ---
    
    > [!NOTE]
    > `scoring_script` and `environment` auto generation are only supported for `pyfunc` model's flavor. To use a different flavor, see [Customizing MLflow model deployments](#customizing-mlflow-model-deployments).

1. Let's create the deployment:
    
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_sklearn_deployment":::

    # [Python](#tab/sdk)

    ```python
    ml_client.online_deployments.begin_create_or_update(blue_deployment)
    ```

    Once created, we need to set the traffic to this deployment.

    ```python
    endpoint.traffic = {blue_deployment.name: 100}
    ml_client.begin_create_or_update(endpoint)
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

### Invoke the endpoint

Once your deployment completes, your deployment is ready to serve request. One of the easier ways to test the deployment is by using a sample request file along with the `invoke` method.

**sample-request-sklearn.json**

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/mlflow/sample-request-sklearn.json":::

> [!NOTE]
> Notice how the key `input_data` has been used in this example instead of `inputs` as used in MLflow serving. This is because Azure Machine Learning requires a different input format to be able to automatically generate the swagger contracts for the endpoints. See [Considerations when deploying to real time inference](how-to-deploy-mlflow-models.md#considerations-when-deploying-to-real-time-inference) for details about expected input format.

To submit a request to the endpoint, you can do as follows:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="test_sklearn_deployment":::

# [Python](#tab/sdk)

```python
ml_client.online_endpoints.invoke(
    endpoint_name=endpoint_name,
    deployment_name=deployment.name,
    request_file="sample-request-sklearn.json",
)
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

MLflow models can be deployed to online endpoints without indicating a scoring script in the deployment definition. However, you can opt in to indicate it to customize how inference is executed.

You will typically select this workflow when:

> [!div class="checklist"]
> - You need to customize the way the model is run, for instance, use an specific flavor to load it with `mlflow.<flavor>.load_model()`.
> - You need to do pre/pos processing in your scoring routine when it is not done by the model itself.
> - The output of the model can't be nicely represented in tabular data. For instance, it is a tensor representing an image.
> - Your endpoint is under a private link-enabled workspace.

> [!IMPORTANT]
> If you choose to indicate an scoring script for an MLflow model deployment, you will also have to specify the environment where the deployment will run.

> [!WARNING]
> Customizing the scoring script for MLflow deployments is only available from the Azure CLI or SDK for Python. If you are creating a deployment using [Azure ML studio](https://ml.azure.com), please switch to the CLI or the SDK.

### Steps

Use the following steps to deploy an MLflow model with a custom scoring script.

1. Create a scoring script:

    __score.py__

    ```python
    import logging
    import mlflow
    import os
    from io import StringIO
    from mlflow.pyfunc.scoring_server import infer_and_parse_json_input, predictions_to_json

    def init():
        global model
        global input_schema
        # The path 'model' corresponds to the path where the MLflow artifacts where stored when
        # registering the model using MLflow format.
        model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), 'model')
        model = mlflow.pyfunc.load_model(model_path)
        input_schema = model.metadata.get_input_schema()
    
    def run(raw_data):
        json_data = json.loads(raw_data)
        if "input_data" not in json_data.keys():
            raise Exception("Request must contain a top level key named 'input_data'")
        
        serving_input = json.dumps(json_data["input_data"])
        data = infer_and_parse_json_input(raw_data, input_schema)
        result = model.predict(data)
        
        result = StringIO()
        predictions_to_json(raw_predictions, result)
        return result.getvalue()
    ```

    > [!TIP]
    > The previous scoring script is provided as an example about how to perform inference of an MLflow model. You can adapt this example to your needs or change any of its parts to reflect your scenario.

    > [!WARNING]
    > __MLflow 2.0 advisory__: The provided scoring script will work with both MLflow 1.X and MLflow 2.X. However, be advised that the expected input/output formats on those versions may vary. Check the environment definition used to ensure you are using the expected MLflow version. Notice that MLflow 2.0 is only supported in Python 3.8+.

1. Let's create an environment where the scoring script can be executed. Since our model is MLflow, the conda requirements are also specified in the model package (for more details about MLflow models and the files included on it see The MLmodel format). We are going then to build the environment using the conda dependencies from the file. However, we need also to include the package `azureml-inference-server-http` which is required for Online Deployments in Azure Machine Learning.
    
    The conda definition file looks as follows:

    __conda.yml__

    ```yml
    channels:
    - conda-forge
    dependencies:
    - python=3.7.11
    - pip
    - pip:
      - mlflow
      - scikit-learn==0.24.1
      - cloudpickle==2.0.0
      - psutil==5.8.0
      - pandas==1.3.5
      - azureml-inference-server-http
    name: mlflow-env
    ```

    > [!NOTE]
    > Note how the package `azureml-inference-server-http` has been added to the original conda dependencies file. 

    We will use this conda dependencies file to create the environment:

    # [Azure CLI](#tab/cli)
    
    *The environment will be created inline in the deployment configuration.*
    
    # [Python](#tab/sdk)
    
    ```python
    environment = Environment(
        conda_file="sklearn-diabetes/environment/conda.yml",
        image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest",
    )
    ```

    # [Studio](#tab/studio)
    
    On [Azure ML studio portal](https://ml.azure.com), follow these steps:
    
    1. Navigate to the __Environments__ tab on the side menu.
    1. Select the tab __Custom environments__ > __Create__.
    1. Enter the name of the environment, in this case `sklearn-mlflow-online-py37`.
    1. On __Select environment type__ select __Use existing docker image with conda__.
    1. On __Container registry image path__, enter `mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04`.
    1. On __Customize__ section copy the content of the file `sklearn-diabetes/environment/conda.yml` we introduced before. 
    1. Click on __Next__ and then on __Create__.
    1. The environment is ready to be used.   

    ---

1. Let's create the deployment now:

    # [Azure CLI](#tab/cli)
    
    Create a deployment configuration file:
    
    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: sklearn-diabetes-custom
    endpoint_name: my-endpoint
    model: azureml:sklearn-diabetes@latest
    environment: 
      image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04
      conda_file: mlflow/sklearn-diabetes/environment/conda.yml
    code_configuration:
      source: mlflow/sklearn-diabetes/src
      scoring_script: score.py
    instance_type: Standard_F2s_v2
    instance_count: 1
    ```
    
    Create the deployment:
    
    ```azurecli
    az ml online-deployment create -f deployment.yml
    ```
    
    # [Python](#tab/sdk)
    
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

    # [Studio](#tab/studio)
    
    > [!IMPORTANT]
    > You can't create custom MLflow deployments in Online Endpoints using the Azure Machine Learning portal. Switch to [Azure ML CLI](?tabs=azure-cli) or the [Azure ML SDK for Python](?tabs=python).

    ---

1. Once your deployment completes, your deployment is ready to serve request. One of the easier ways to test the deployment is by using a sample request file along with the `invoke` method.

    **sample-request-sklearn.json**
    
    :::code language="json" source="~/azureml-examples-main/cli/endpoints/online/mlflow/sample-request-sklearn.json":::

    To submit a request to the endpoint, you can do as follows:
    
    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file endpoints/online/mlflow/sample-request-sklearn-custom.json
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name,
        deployment_name=deployment.name,
        request_file="sample-request-sklearn.json",
    )
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

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="delete_endpoint":::

# [Python](#tab/sdk)
    
```python
ml_client.online_endpoints.begin_delete(endpoint_name)
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
