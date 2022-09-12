---
title: High-performance model serving with Triton (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to deploy your model with NVIDIA Triton Inference Server in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.date: 06/10/2022
ms.topic: how-to
ms.reviewer: larryfr
ms.author: sehan
author: dem108
ms.custom: deploy, devplatv2, devx-track-azurecli, cliv2, event-tier1-build-2022
ms.devlang: azurecli
---

# High-performance serving with Triton Inference Server (Preview)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]



Learn how to use [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) in Azure Machine Learning with [Managed online endpoints](concept-endpoints.md#managed-online-endpoints).

Triton is multi-framework, open-source software that is optimized for inference. It supports popular machine learning frameworks like TensorFlow, ONNX Runtime, PyTorch, NVIDIA TensorRT, and more. It can be used for your CPU or GPU workloads.

In this article, you will learn how to deploy Triton and a model to a managed online endpoint. Information is provided on using both the CLI (command line) and Azure Machine Learning studio.

> [!NOTE]
> * [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) is an open-source third-party software that is integrated in Azure Machine Learning.
> * While Azure Machine Learning online endpoints are generally available, _using Triton with an online endpoint deployment is still in preview_. 

## Prerequisites

[!INCLUDE [basic prereqs](../../includes/machine-learning-cli-prereqs.md)]

* A working Python 3.8 (or higher) environment.

* Access to NCv3-series VMs for your Azure subscription.

    > [!IMPORTANT]
    > You may need to request a quota increase for your subscription before you can use this series of VMs. For more information, see [NCv3-series](../virtual-machines/ncv3-series.md).

[!INCLUDE [clone repo & set defaults](../../includes/machine-learning-cli-prepare.md)]

NVIDIA Triton Inference Server requires a specific model repository structure, where there is a directory for each model and subdirectories for the model version. The contents of each model version subdirectory is determined by the type of the model and the requirements of the backend that supports the model. To see all the model repository structure [https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_repository.md#model-files](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_repository.md#model-files)

The information in this document is based on using a model stored in ONNX format, so the directory structure of the model repository is `<model-repository>/<model-name>/1/model.onnx`. Specifically, this model performs image identification.

## Deploy using CLI (v2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This section shows how you can deploy Triton to managed online endpoint using the Azure CLI with the Machine Learning extension (v2).

> [!IMPORTANT]
> For Triton no-code-deployment, **[testing via local endpoints](how-to-deploy-managed-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.

1. To avoid typing in a path for multiple commands, use the following command to set a `BASE_PATH` environment variable. This variable points to the directory where the model and associated YAML configuration files are located:

    ```azurecli
    BASE_PATH=endpoints/online/triton/single-model
    ```

1. Use the following command to set the name of the endpoint that will be created. In this example, a random name is created for the endpoint:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="set_endpoint_name":::

1. Install Python requirements using the following commands:

    ```azurecli
    pip install numpy
    pip install tritonclient[http]
    pip install pillow
    pip install gevent
    ```

1. Create a YAML configuration file for your endpoint. The following example configures the name and authentication mode of the endpoint. The one used in the following commands is located at `/cli/endpoints/online/triton/single-model/create-managed-endpoint.yml` in the azureml-examples repo you cloned earlier:

    __create-managed-endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/triton/single-model/create-managed-endpoint.yaml":::

1. To create a new endpoint using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="create_endpoint":::

1. Create a YAML configuration file for the deployment. The following example configures a deployment named __blue__ to the endpoint created in the previous step. The one used in the following commands is located at `/cli/endpoints/online/triton/single-model/create-managed-deployment.yml` in the azureml-examples repo you cloned earlier:

    > [!IMPORTANT]
    > For Triton no-code-deployment (NCD) to work, setting **`type`** to **`triton_model​`** is required, `type: triton_model​`. For more information, see [CLI (v2) model YAML schema](reference-yaml-model.md).
    >
    > This deployment uses a Standard_NC6s_v3 VM. You may need to request a quota increase for your subscription before you can use this VM. For more information, see [NCv3-series](../virtual-machines/ncv3-series.md).

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/triton/single-model/create-managed-deployment.yaml":::

1. To create the deployment using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="create_deployment":::

### Invoke your endpoint

Once your deployment completes, use the following command to make a scoring request to the deployed endpoint. 

> [!TIP]
> The file `/cli/endpoints/online/triton/single-model/triton_densenet_scoring.py` in the azureml-examples repo is used for scoring. The image passed to the endpoint needs pre-processing to meet the size, type, and format requirements, and post-processing to show the predicted label. The `triton_densenet_scoring.py` uses the `tritonclient.http` library to communicate with the Triton inference server.

1. To get the endpoint scoring uri, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="get_scoring_uri":::

1. To get an authentication token, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="get_token":::

1. To score data with the endpoint, use the following command. It submits the image of a peacock (https://aka.ms/peacock-pic) to the endpoint:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="check_scoring_of_model":::

    The response from the script is similar to the following text:

    ```
    Is server ready - True
    Is model ready - True
    /azureml-examples/cli/endpoints/online/triton/single-model/densenet_labels.txt
    84 : PEACOCK
    ```

### Delete your endpoint and model

Once you're done with the endpoint, use the following command to delete it:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="delete_endpoint":::

Use the following command to delete your model:

```azurecli
az ml model delete --name $MODEL_NAME --version $MODEL_VERSION
```

## Deploy using Azure Machine Learning studio

This section shows how you can deploy Triton to managed online endpoint using [Azure Machine Learning studio](https://ml.azure.com).

1. Register your model in Triton format using the following YAML and CLI command. The YAML uses a densenet-onnx model from [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/triton/single-model](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/triton/single-model)

    __create-triton-model.yaml__

    ```yml
    name: densenet-onnx-model
    version: 1
    path: ./models
    type: triton_model​
    description: Registering my Triton format model.
    ```

    ```azurecli
    az ml model create -f create-triton-model.yaml
    ```

    The following screenshot shows how your registered model will look on the __Models page__ of Azure Machine Learning studio.

    :::image type="content" source="media/how-to-deploy-with-triton/triton-model-format.png" lightbox="media/how-to-deploy-with-triton/triton-model-format.png" alt-text="Screenshot showing Triton model format on Models page.":::


1. From [studio](https://ml.azure.com), select your workspace and then use either the __endpoints__ or __models__ page to create the endpoint deployment:

    # [Endpoints page](#tab/endpoint)

    1. From the __Endpoints__ page, select **Create**.

        :::image type="content" source="media/how-to-deploy-with-triton/create-option-from-endpoints-page.png" lightbox="media/how-to-deploy-with-triton/create-option-from-endpoints-page.png" alt-text="Screenshot showing create option on the Endpoints UI page.":::

    1. Provide a name and authentication type for the endpoint, and then select __Next__.
    1. When selecting a model, select the Triton model registered previously. Select __Next__ to continue.

    1. When you select a model registered in Triton format, in the Environment step of the wizard, you don't need scoring script and environment.

        :::image type="content" source="media/how-to-deploy-with-triton/ncd-triton.png" lightbox="media/how-to-deploy-with-triton/ncd-triton.png" alt-text="Screenshot showing no code and environment needed for Triton models":::

    1. Complete the wizard to deploy the model to the endpoint.

        :::image type="content" source="media/how-to-deploy-with-triton/review-screen-triton.png" lightbox="media/how-to-deploy-with-triton/review-screen-triton.png" alt-text="Screenshot showing NCD review screen":::

    # [Models page](#tab/models)

    1. Select the Triton model, and then select __Deploy__. When prompted, select __Deploy to real-time endpoint__.

        :::image type="content" source="media/how-to-deploy-with-triton/deploy-from-models-page.png" lightbox="media/how-to-deploy-with-triton/deploy-from-models-page.png" alt-text="Screenshot showing how to deploy model from Models UI.":::

    1. Complete the wizard to deploy the model to the endpoint.

    ---

## Next steps

To learn more, review these articles:

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use managed online endpoints in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints ](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with a managed online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)
