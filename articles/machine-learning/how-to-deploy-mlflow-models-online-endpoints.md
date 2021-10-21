---
title: Deploy MLflow models to managed online endpoint (preview)
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model as a web service that's automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 11/03/2021
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: deploy, mlflow, devplatv2, no-code-deployment
---

# Deploy MLflow models to managed online endpoint (preview)

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to a [managed online endpoint](concept-endpoints.md#managed-online-endpoints) (preview). When you deploy your MLflow model to a managed online endpoint, it's a no-code-deployment. It doesn't require scoring script and environment. 

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* Install and configure the Azure CLI and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md). 
 
* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md).

* You must have a MLflow model. This document is based on using the sample MLflow models in the [azureml-examples](https://github.com/Azure/azureml-examples) repo. These models are located at [https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow](https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow).

## Deploy using CLI (v2)

This example shows how you can deploy an MLflow model to managed online endpoint using CLI (v2).

> [!TIP]
> This document assumes that you have cloned the [azureml-examples](https://github.com/Azure/azureml-examples) repo to your local machine.

1. From the command-line, change directories to the directory that contains your MLflow model:

    ```
    cd azureml-examples/cli/endpoints/online/mlflow
    ```

1. Create a YAML configuration file for your endpoint. The following example configures the name and authentication mode of the endpoint:

    __create-endpoint.yaml__

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: my-endpoint
    auth_mode: key
    ```

1. To create a new endpoint using the YAML configuration, use the following command:

    ```azurecli
    az ml online-endpoint create -f create-endpoint.yaml
    ```

1. Create a YAML configuration file for the deployment. The following example configures a deployment of the `sklearn-diabetes` model to the endpoint created in the previous step:

    > [!IMPORTANT]
    > For MLflow no-code-deployment (NCD) to work, setting **`model_format`** to **`mlflow`** is mandatory. For more information, [check CLI (v2) model YAML schema](reference-yaml-model.md).

    __sklearn-deployment.yaml__

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: sklearn-deployment
    endpoint_name: my-endpoint
    model:
    local_path: sklearn-diabetes/model
    model_format: mlflow
    instance_type: Standard_F2s_v2
    instance_count: 1
    ```

1. To create the deployment using the YAML configuration, use the following command:

    ```azurecli
    az ml online-deployment create -f sklearn-deployment.yaml
    ```

### Invoke the endpoint

Once your deployment completes, use the following command to make a scoring request to the deployed endpoint:

```azurecli
az ml online-endpoint invoke --name sklearn-deployment --request-file 
```

TODO: what does the response look like?

### Delete endpoint

Once you're done with the endpoint, use the following command to delete it:

```azurecli
az ml online-endpoint delete --name my-endpoint
```

## Deploy using Azure Machine Learning studio

This example shows how you can deploy an MLflow model to managed online endpoint using [Azure Machine Learning studio](https://ml.azure.com).

1. Register your model in MLflow format using the following YAML and CLI command. The YAML uses a scikit-learn MLflow model from [https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow](https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow]).

    __sample-create-mlflow-model.yaml__

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/model.schema.json
    name: sklearn-diabetes-mlflow
    version: 1
    local_path: sklearn-diabetes/model
    model_format: mlflow
    description: Scikit-learn MLflow model.
    ```


    ```azurecli
    az ml model create -f sample-create-mlflow-model.yaml
    ```

2. From [studio](https://ml.azure.com), select your workspace and then use either the __endpoints__ or __models__ page to create the endpoint deployment:

    # [Endpoints page](#tab/endpoint)

    1. From the __Endpoints__ page, Select **+Create (preview)**.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the MLflow model registered previously. Select __Next__ to continue.

    1. When you select a model registered in MLflow format, in the Environment step of the wizard, you don't need scoring script and environment.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models":::

    1. Complete the wizard to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" alt-text="Screenshot showing NCD review screen":::

    # [Models page](#tab/models)

    1. Select the MLflow model, and then select __Deploy__. When prompted, select __Deploy to real-time endpoint (preview)__.

        :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" alt-text="Screenshot showing how to deploy model from Models UI":::

    1. Complete the wizard to deploy the model to the endpoint.

    ---

## Deploy models after a training job

This section helps you understand how to deploy models to managed online endpoint once you have completed your [training job](how-to-train-cli.md).

1. Download the outputs from the training job. The outputs contain the model folder.

    > [!NOTE]
    > If you have used `mlflow.autolog()` in your training script, you will see model artifacts in the job's run history. Azure Machine Learning integrates with MLflow's tracking functionality. You can use `mlflow.autolog()` for several common ML frameworks to log model parameters, performance metrics, model artifacts, and even feature importance graphs.
    >
    > For more information, see [Train models with CLI](how-to-train-cli.md#model-tracking-with-mlflow). Also see the [training job samples](https://github.com/Azure/azureml-examples/tree/cli-preview/cli/jobs/single-step) in the GitHub repository.

    # [Azure Machine Learning studio](#tab/studio)

    :::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/download-output-logs.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/download-output-logs.png" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

    # [CLI](#tab/cli)

    ```azurecli
    az ml job download -n $run_id --outputs
    ```

2. To deploy using the downloaded files, you can use either studio or the Azure command-line interface. Use the model folder from the outputs for deployment:

    * [Deploy using Azure Machine Learning studio](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-azure-machine-learning-studio).
    * [Deploy using Azure Machine Learning CLI (v2)](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-cli-v2).

## Next steps

To learn more, review these articles:

- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [Create and use managed online endpoints (preview) in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [Use batch endpoints (preview) for batch scoring](how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with a managed online endpoint and managed identity (preview)](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)