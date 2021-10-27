---
title: High-performance model serving with Triton (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to deploy your model with NVIDIA Triton Inference Server in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.date: 11/03/2021
ms.topic: how-to
ms.reviewer: larryfr
ms.author: ssambare
author: shivanissambare
ms.custom: deploy, devplatv2
---

# High-performance serving with Triton Inference Server (Preview) 

Learn how to use [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) in Azure Machine Learning with [Managed online endpoints](concept-endpoints.md#managed-online-endpoints).

Triton is multi-framework, open source software that is optimized for inferencing. It supports popular machine learning frameworks like TensorFlow, ONNX Runtime, PyTorch, NVIDIA TensorRT, and more. It can be used for your CPU or GPU workloads.

In this article, you will learn how to deploy Triton model to managed online endpoints using:

1. [Azure Machine Learning CLI (v2)](how-to-deploy-with-triton.md#deploy-using-cli-v2)
1. [Azure Machine Learning studio](how-to-deploy-with-triton.md#deploy-using-azure-machine-learning-studio)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

> [!NOTE]
> [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) is an open-source third-party software that is integrated in Azure Machine Learning.

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* Install and configure the Azure CLI and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md). 
 
* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md).

## Prepare for deployment

TODO : `[!INCLUDE [clone repo & set defaults](../../includes/machine-learning-cli-prepare.md)]`

Since, NVIDIA Triton Inference Server is multi-framework, depending on the model framework, it expects a specific model repository structure. The contents of each model version sub-directory is determined by the type of the model and the requirements of the backend that supports the model. To see all the model repository structure [https://github.com/triton-inference-server/server/blob/main/docs/model_repository.md#model-files](https://github.com/triton-inference-server/server/blob/main/docs/model_repository.md#model-files)

In this sample, we are using ONNX framework, image identification model, so our model repository is in the following format:

```
<model-repository-path>/
    <model-name>/
      1/
        model.onnx
```

## Deploy using CLI (v2)

This example shows how you can deploy a Triton model to managed online endpoint using CLI (v2). 

> [!TIP]
> This section of the document assumes that you have cloned the [azureml-examples](https://github.com/Azure/azureml-examples) repo to your local machine.

Find all the Triton samples at [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/triton](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/triton)

```azurecli
cd endpoints/online/triton/single-model
```

1. Create a YAML configuration file for your endpoint. The following example configures the name and authentication mode of the endpoint:

__create-managed-endpoint.yaml__

TODO: add endpoint YAML here

2. To create a new endpoint using the YAML configuration, use the following command:

```azurecli
az ml online-endpoint create -n $ENDPOINT_NAME -f create-managed-endpoint.yaml
```
3. Create a YAML configuration file for the deployment. The following example configures a deployment of the `blue` model to the endpoint created in the previous step:

    > [!IMPORTANT]
    > For Triton no-code-deployment (NCD) to work, setting **`model_format`** to **`Triton`** is mandatory. For more information, [check CLI (v2) model YAML schema](reference-yaml-model.md).

TODO : add deployment YAML here

4. To create the deployment using the YAML configuration, use the following command:

```azurecli
az ml online-deployment create --name blue --endpoint $ENDPOINT_NAME -f create-managed-deployment.yaml --all-traffic
```
### Invoke your endpoint

Once your deployment completes, use the following command to make a scoring request to the deployed endpoint. The [triton_densenet_scoring.py](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/triton/single-model/triton_densenet_scoring.py) file used in this command is located in the `/cli/endpoints/online/triton/single-model` directory of the azure-examples repo:

1. Get your endpoint scoring uri

```azurecli
scoring_uri=$(az ml online-endpoint show -n $ENDPOINT_NAME --query scoring_uri -o tsv)
scoring_uri=${scoring_uri%/*}
```
2. Get your authentication token

```azurecli
auth_token=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME --query accessToken -o tsv)
```
3. Check scoring of your model

```python
python triton_densenet_scoring.py --base_url=$scoring_uri --token=$auth_token

```

The deployed model is a image identification model, we are passing an image of a peacock : [https://aka.ms/peacock-pic](https://aka.ms/peacock-pic)

TODO: Add response

### Delete your endpoint and model

Once you're done with the endpoint, use the following command to delete it:

```azurecli
az ml online-endpoint delete --name $ENDPOINT_NAME 
```

Use the following command to delete your model:

```azurecli
az ml model delete --name $MODEL_NAME --version $MODEL_VERSION
```

## Deploy using Azure Machine Learning Studio

This example shows how you can deploy a Triton model to managed online endpoint using [Azure Machine Learning studio](https://ml.azure.com).

1. Register your model in Triton model format

Register your model in Triton format using the following YAML and CLI command. The YAML uses a densenet-onnx model from [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/triton/single-model](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/triton/single-model)

__create-triton-model.yaml__

```yml
name: densenet-onnx-model
version: 1
local_path: ./models
model_format: Triton
description: Registering my Triton format model.
```

```azurecli
az ml model create -f create-triton-model.yaml
```

This is how your registered Triton format model will look on the __Models page__ of Azure Machine Learning studio.

:::image type="content" source="media/how-to-deploy-with-triton/triton-model-format.png" lightbox="media/how-to-deploy-with-triton/triton-model-format.png" alt-text="Screenshot showing Triton model format on Models page.":::


2. From [studio](https://ml.azure.com), select your workspace and then use either the __endpoints__ or __models__ page to create the endpoint deployment:

    # [Endpoints page](#tab/endpoint)

    1. From the __Endpoints__ page, Select **+Create (preview)**.

        :::image type="content" source="media/how-to-deploy-with-triton/create-option-from-endpoints-page.png" lightbox="media/how-to-deploy-with-triton/create-option-from-endpoints-page.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the Triton model registered previously. Select __Next__ to continue.

    1. When you select a model registered in Triton format, in the Environment step of the wizard, you don't need scoring script and environment.

        :::image type="content" source="media/how-to-deploy-with-triton/ncd-triton.png" lightbox="media/how-to-deploy-with-triton/ncd-triton.png" alt-text="Screenshot showing no code and environment needed for Triton models":::

    1. Complete the wizard to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-with-triton/review-screen-triton.png" lightbox="media/how-to-deploy-with-triton/review-screen-triton.png" alt-text="Screenshot showing NCD review screen":::

    # [Models page](#tab/models)

    1. Select the Triton model, and then select __Deploy__. When prompted, select __Deploy to real-time endpoint (preview)__.

        :::image type="content" source="media/how-to-deploy-with-triton/deploy-from-models-page.png" lightbox="media/how-to-deploy-with-triton/deploy-from-models-page.png" alt-text="Screenshot showing how to deploy model from Models UI":::

    1. Complete the wizard to deploy the model to the endpoint.

    ---

## Next steps

To learn more, review these articles:

- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [Create and use managed online endpoints (preview) in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with a managed online endpoint and managed identity (preview)](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)