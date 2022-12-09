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

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to an [online endpoint](concept-endpoints.md) for real-time inference. When you deploy your MLflow model to an online endpoint, you don't need to indicate an scoring script or an environment. This characteristic is usually referred as __no-code deployment__. 

For no-code-deployment, Azure Machine Learning 

* Dynamically installs Python packages provided in the `conda.yaml` file, this means the dependencies are installed during container runtime.
* Provides a MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * An scoring script to perform inference.

> [!NOTE]
> For information about inputs format supported and limitation in online endpoints, view [Considerations when deploying to real-time inference](#considerations-when-deploying-to-real-time-inference).

> [!WARNING]
> Azure Machine Learning performs dynamic installation of packages when deploying MLflow models with no-code deployment. As a consequence, deploying MLflow models to online endpoints with no-code deployment in a private network without egress connectivity is not supported by the moment. If your case, either enable egress connectivity or provide an scoring script as indicated at [Customizing MLflow model deployments with a scoring script](#customizing-mlflow-model-deployment-with-a-scoring-script).


## About this example

This example shows how you can deploy an MLflow model to an online endpoint to perform predictions. This example uses an MLflow model based on the [Diabetes dataset](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). This dataset contains ten baseline variables, age, sex, body mass index, average blood pressure, and six blood serum measurements obtained from n = 442 diabetes patients, as well as the response of interest, a quantitative measure of disease progression one year after baseline (regression).

The model has been trained using an `scikit-learn` regressor and all the required preprocessing has been packaged as a pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo and then change directories to the `cli/endpoints/online` if you are using the Azure CLI or `sdk/endpoints/online` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/online
```

## Prerequisites

[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

* You must have a MLflow model registered in your workspace.  Particularly, this examples will register a model trained for the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease).

    * If you don't have an MLflow formatted model, you can [convert your custom ML model to MLflow format](how-to-convert-custom-model-to-mlflow.md).


## Deploy an MLflow model to an online endpoint

Follow these steps to deploy an MLflow model to an online endpoint for running inference over new data:

1. First, let's connect to Azure Machine Learning workspace where we are going to work on.

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


2. Online Endpoint can only deploy registered models. In this case, we already have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you are trying to deploy is already registered.
   
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

3. (Alternatively) If your model was logged inside of a run, you can register it directly.

    > [!TIP]
    > To register the model, you will need to know the location where the model has been stored. If you are using `autolog` feature of MLflow, the path will depend on the type and framework of the model being used. We recommed to check the jobs output to identify which is the name of this folder. You can look for the folder that contains a file named `MLModel`. If you are logging your models manually using `log_model`, then the path is the argument you pass to such method. As an expample, if you log the model using `mlflow.sklearn.log_model(my_model, "classifier")`, then the path where the model is stored is `classifier`.

    # [Azure CLI](#tab/cli)
    
    Use the Azure ML CLI v2 to create a model from a training job output. In the following example, a model named `$MODEL_NAME` is registered using the artifacts of a job with ID `$RUN_ID`. The path where the model is stored is `$MODEL_PATH`.

    ```bash
    az ml model create --name $MODEL_NAME --path azureml://jobs/$RUN_ID/outputs/artifacts/$MODEL_PATH
    ```
    
    > [!NOTE]
    > The path `$MODEL_PATH` is the location where the model has been stored in the run.

    # [Python](#tab/sdk)
   
    ```python
    ml_client.models.create_or_update(
        Model(
            path=f"azureml://jobs/{RUN_ID}/outputs/artifacts/{MODEL_PATH}"
            name="run-model-example",
            description="Model created from run.",
            type=AssetTypes.MLFLOW_MODEL
        )
    ) 
    ```
   
    > [!NOTE]
    > The path `MODEL_PATH` is the location where the model has been stored in the run.

    # [Studio](#tab/studio)

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

3. Configure the endpoint. The following example configures the name and authentication mode of the endpoint:
    
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

    *You will perform this steps in the deployment stage.*

1. Let's create the endpoint:
    
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_endpoint":::

    # [Python](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint).result()
    ```

    # [Studio](#tab/studio)

    *You will perform this steps in the deployment stage.*

1. Create a configuration for the deployment. 
    
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

    *You will perform this steps in the deployment stage.*

1. Let's create the deployment:
    
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_sklearn_deployment":::

    # [Python](#tab/sdk)

    ```python
    ml_client.online_deployments.begin_create_or_update(blue_deployment).result()
    ```

    Once created, we need to set the traffic to this deployment.

    ```python
    endpoint.traffic = {blue_deployment.name: 100}
    ml_client.begin_create_or_update(endpoint).result()
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

---

> [!IMPORTANT]
> For MLflow no-code-deployment, **[testing via local endpoints](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.


### Delete endpoint

Once you're done with the endpoint, use the following command to delete it:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="delete_endpoint":::


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
