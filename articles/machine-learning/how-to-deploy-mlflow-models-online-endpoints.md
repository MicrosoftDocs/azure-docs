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

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to an [online endpoint](concept-endpoints.md) for real-time inference. When you deploy your MLflow model to an online endpoint, it's a no-code-deployment so you don't have to provide a scoring script or an environment. 

You only provide the typical MLflow model folder contents:

* MLmodel file
* `conda.yaml`
* model file(s)

For no-code-deployment, Azure Machine Learning 

* Dynamically installs Python packages provided in the `conda.yaml` file, this means the dependencies are installed during container runtime.
    * The base container image/curated environment used for dynamic installation is `mcr.microsoft.com/azureml/mlflow-ubuntu18.04-py37-cpu-inference` or `AzureML-mlflow-ubuntu18.04-py37-cpu-inference`
* Provides a MLflow base image/curated environment that contains the following items:
    * [`azureml-inference-server-http`](how-to-inference-server-http.md) 
    * [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst)
    * `pandas`
    * The scoring script baked into the image.

## Prerequisites

[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

* You must have a MLflow model. The examples in this article are based on the models from [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/mlflow](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/mlflow).

    * If you don't have an MLflow formatted model, you can [convert your custom ML model to MLflow format](how-to-convert-custom-model-to-mlflow.md).  

[!INCLUDE [clone repo & set defaults](../../includes/machine-learning-cli-prepare.md)]

In this code snippet used in this article, the `ENDPOINT_NAME` environment variable contains the name of the endpoint to create and use. To set this, use the following command from the CLI. Replace `<YOUR_ENDPOINT_NAME>` with the name of your endpoint:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="set_endpoint_name":::

## Deploy using CLI (v2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This example shows how you can deploy an MLflow model to an online endpoint using CLI (v2).

> [!IMPORTANT]
> For MLflow no-code-deployment, **[testing via local endpoints](how-to-deploy-managed-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.

1. Create a YAML configuration file for your endpoint. The following example configures the name and authentication mode of the endpoint:

    __create-endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/create-endpoint.yaml":::

1. To create a new endpoint using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_endpoint":::

1. Create a YAML configuration file for the deployment. The following example configures a deployment of the `sklearn-diabetes` model to the endpoint created in the previous step:

    > [!IMPORTANT]
    > For MLflow no-code-deployment (NCD) to work, setting **`type`** to **`mlflow_model`** is required, `type: mlflow_model​`. For more information, see [CLI (v2) model YAML schema](reference-yaml-model.md).

    __sklearn-deployment.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/mlflow/sklearn-deployment.yaml":::

1. To create the deployment using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="create_sklearn_deployment":::

### Invoke the endpoint

Once your deployment completes, use the following command to make a scoring request to the deployed endpoint. The [sample-request-sklearn.json](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/mlflow/sample-request-sklearn.json) file used in this command is located in the `/cli/endpoints/online/mlflow` directory of the azure-examples repo:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="test_sklearn_deployment":::

**sample-request-sklearn.json**

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/mlflow/sample-request-sklearn.json":::

The response will be similar to the following text:

```json
[ 
  11633.100167144921,
  8522.117402884991
]
```

### Delete endpoint

Once you're done with the endpoint, use the following command to delete it:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-mlflow.sh" ID="delete_endpoint":::

## Deploy using Azure Machine Learning studio

This example shows how you can deploy an MLflow model to an online endpoint using [Azure Machine Learning studio](https://ml.azure.com).

1. Models need to be registered in the Azure Machine Learning workspace to be deployed. Deployment of unregistered models isn't supported. To create a model in Azure Machine Learning, open the Models page in Azure Machine Learning. Select **Register model** and select where your model is located. Fill out the required fields, and then select __Register__.

   :::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

2. To create an endpoint deployment, use either the __endpoints__ or __models__ page:

    # [Endpoints page](#tab/endpoint)

    1. From the __Endpoints__ page, Select **+Create**.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the MLflow model registered previously. Select __Next__ to continue.

    1. When you select a model registered in MLflow format, in the Environment step of the wizard, you don't need a scoring script or an environment.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models":::

    1. Complete the wizard to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" alt-text="Screenshot showing NCD review screen":::

    # [Models page](#tab/models)

    1. Select the MLflow model, and then select __Deploy__. When prompted, select __Deploy to real-time endpoint__.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" alt-text="Screenshot showing how to deploy model from Models UI":::

    1. Complete the wizard to deploy the model to the endpoint.

    ---

## Deploy models after a training job

This section helps you understand how to deploy models to an online endpoint once you've completed your [training job](how-to-train-model.md). Models logged in a run are stored as artifacts. If you have used `mlflow.autolog()` in your training script, you'll see model artifacts generated in the job's output. You can use `mlflow.autolog()` for several common ML frameworks to log model parameters, performance metrics, model artifacts, and even feature importance graphs. 

For more information, see [Train models](how-to-train-model.md). Also see the [training job samples](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/single-step) in the GitHub repository.


1. Models need to be registered in the Azure Machine Learning workspace to be deployed. Deployment of unregistered models isn't supported. You can register the model directly from the job's output using the Azure ML CLI (v2), the Azure ML SDK for Python (v2) or Azure Machine Learning studio. 
   
    > [!TIP]
    > To register the model, you will need to know the location where the model has been stored. If you are using `autolog` feature of MLflow, the path will depend on the type and framework of the model being used. We recommed to check the jobs output to identify which is the name of this folder. You can look for the folder that contains a file named `MLModel`. If you are logging your models manually using `log_model`, then the path is the argument you pass to such method. As an expample, if you log the model using `mlflow.sklearn.log_model(my_model, "classifier")`, then the path where the model is stored is `classifier`.

    # [Azure Machine Learning studio](#tab/studio)

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/mlflow-register-model-output.gif" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

    # [Azure ML CLI (v2)](#tab/cli)
    
    Use the Azure ML CLI v2 to create a model from a training job output. In the following example, a model named `$MODEL_NAME` is registered using the artifacts of a job with ID `$RUN_ID`. The path where the model is stored is `$MODEL_PATH`.

    ```bash
    az ml model create --name $MODEL_NAME --path azureml://jobs/$RUN_ID/outputs/artifacts/$MODEL_PATH
    ```
    
    > [!NOTE]
    > The path `$MODEL_PATH` is the location where the model has been stored in the run.

   # [Azure ML SDK for Python (v2)](#tab/sdk)
   
   ```python
   from azure.ai.ml.entities import Model
   from azure.ai.ml.constants import AssetTypes

   run_model = Model(
       path=f"azureml://jobs/{RUN_ID}/outputs/artifacts/{MODEL_PATH}"
       name="run-model-example",
       description="Model created from run.",
       type=AssetTypes.MLFLOW_MODEL
   )

   ml_client.models.create_or_update(run_model) 
   ```
   
   > [!NOTE]
   > The path `MODEL_PATH` is the location where the model has been stored in the run.

2. To deploy the registered model, you can use either studio or the Azure command-line interface. Use the model folder from the outputs for deployment:

    * [Deploy using Azure Machine Learning studio](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-azure-machine-learning-studio).
    * [Deploy using Azure Machine Learning CLI (v2)](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-cli-v2).

## Next steps

To learn more, review these articles:

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use online endpoints in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [Use batch endpoints for batch scoring](batch-inference/how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with an online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoint deployment](how-to-troubleshoot-managed-online-endpoints.md)
