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

In this article, learn how to deploy your [MLflow](https://www.mlflow.org) model to managed online endpoint (preview). When you deploy your MLflow model to managed online endpoint, it is a no-code-deployment i.e. it does not require scoring script and environment. 

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* Install and configure the Azure CLI and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md). 
 
* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md).

* MLflow model. Check our [azureml-examples](https://github.com/Azure/azureml-examples) repo for sample MLflow models : [https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow](https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow])

## Deploy using CLI (v2)

This example shows how you can deploy an MLflow model to managed online endpoint using CLI (v2).

```
cd azureml-examples/cli/endpoints/online/mlflow
```

### Create a YAML file for your endpoint and deployment

You can configure your cloud deployment using YAML. Take a look at the sample YAML for this example:

__create-endpoint.yaml__

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: my-endpoint
auth_mode: key
```

```azurecli
az ml online-endpoint create -f create-endpoint.yaml
```

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

```azurecli
az ml online-deployment create -f sklearn-deployment.yaml
```

> [!IMPORTANT]
> For MLflow no-code-deployment (NCD) to work, setting **`model_format`** to **`mlflow`** is mandatory. For more information, [check CLI (v2) model YAML schema](reference-yaml-model.md)

### Invoke the endpoint

Once your deployment completes, see if you can make a scoring request to the deployed endpoint.

```azurecli
az ml online-endpoint invoke --name sklearn-deployment --request-file 
```

### Delete endpoint

Now that you've successfully scored with your endpoint, you can delete it:

```azurecli
az ml online-endpoint delete --name my-endpoint
```

## Deploy using Azure Machine Learning Studio

This example shows how you can deploy an MLflow model to managed online endpoint using [Azure Machine Learning Studio](https://ml.azure.com).

### Register your model in MLflow format

For this example, we are using scikit-learn MLflow model: [https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow](https://github.com/Azure/azureml-examples/cli/endpoints/online/mlflow])

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

### Create endpoint from Endpoints UI

* Select **+Create (preview)** option on Endpoints UI page.

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/create-from-endpoints.png" alt-text="Screenshot showing create option on the Endpoints UI page":::

* When you select a model, registered in MLflow format, in the Environment step of the wizard you would not need scoring script and environment.

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/ncd-wizard.png" alt-text="Screenshot showing no code and environment needed for MLflow models":::

* Complete the wizard to deploy model successfully.

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/review-screen-ncd.png" alt-text="Screenshot showing NCD review screen":::

### Create endpoint from Models UI

* Select the MLflow model you want to deploy.

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/deploy-from-models-ui.png" alt-text="Screenshot showing how to deploy model from Models UI":::

* Complete the wizard to deploy model successfully.

## Deploy models post training job

This section helps you understand how to deploy models to managed online endpoint once you have completed your [training job](how-to-train-cli.md#introducing-jobs).

### 1. Download the outputs from training job

__From Azure Machine Learning studio__

:::image type="content" source="media/how-to-deploy-mlflow-models-online-endpoints/download-output-logs.png" lightbox="media/how-to-deploy-mlflow-models-online-endpoints/download-output-logs.png" alt-text="Screenshot showing how to download Outputs and logs from Experimentation run":::

__Using Azure Machine Learning CLI (v2)__

```azurecli
az ml job download -n $run_id --outputs
```

### 2. Deploy using downloaded files

To deploy using these files, you can use either studio or the Azure command line interface. Use the model folder from outputs for deployment.

* [Azure Machine Learning Studio](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-azure-machine-learning-studio)
* [Azure Machine Learning CLI (v2)](how-to-deploy-mlflow-models-online-endpoints.md#deploy-using-cli-v2)

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