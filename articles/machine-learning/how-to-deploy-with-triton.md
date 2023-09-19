---
title: High-performance model serving with Triton (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to deploy your model with NVIDIA Triton Inference Server in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.date: 06/10/2022
ms.topic: how-to
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.custom: deploy, devplatv2, devx-track-azurecli, cliv2, event-tier1-build-2022, sdkv2, ignite-2022
ms.devlang: azurecli
---

# High-performance serving with Triton Inference Server (Preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn how to use [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) in Azure Machine Learning with [online endpoints](concept-endpoints-online.md).

Triton is multi-framework, open-source software that is optimized for inference. It supports popular machine learning frameworks like TensorFlow, ONNX Runtime, PyTorch, NVIDIA TensorRT, and more. It can be used for your CPU or GPU workloads. No-code deployment for Triton models is supported in both [managed online endpoints and Kubernetes online endpoints](concept-endpoints-online.md#managed-online-endpoints-vs-kubernetes-online-endpoints).

In this article, you will learn how to deploy Triton and a model to a [managed online endpoint](concept-endpoints-online.md#online-endpoints). Information is provided on using the CLI (command line), Python SDK v2, and Azure Machine Learning studio. 

> [!NOTE]
> * [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) is an open-source third-party software that is integrated in Azure Machine Learning.
> * While Azure Machine Learning online endpoints are generally available, _using Triton with an online endpoint/deployment is still in preview_. 

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs](includes/machine-learning-cli-prereqs.md)]

* A working Python 3.8 (or higher) environment. 

* You must have additional Python packages installed for scoring and may install them with the code below. They include:
    * Numpy - An array and numerical computing library 
    * [Triton Inference Server Client](https://github.com/triton-inference-server/client) - Facilitates requests to the Triton Inference Server
    * Pillow - A library for image operations
    * Gevent - A networking library used when connecting to the Triton Server

```azurecli
pip install numpy
pip install tritonclient[http]
pip install pillow
pip install gevent
```

* Access to NCv3-series VMs for your Azure subscription.

    > [!IMPORTANT]
    > You may need to request a quota increase for your subscription before you can use this series of VMs. For more information, see [NCv3-series](../virtual-machines/ncv3-series.md).

NVIDIA Triton Inference Server requires a specific model repository structure, where there is a directory for each model and subdirectories for the model version. The contents of each model version subdirectory is determined by the type of the model and the requirements of the backend that supports the model. To see all the model repository structure [https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_repository.md#model-files](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_repository.md#model-files)

The information in this document is based on using a model stored in ONNX format, so the directory structure of the model repository is `<model-repository>/<model-name>/1/model.onnx`. Specifically, this model performs image identification.

[!INCLUDE [clone repo & set defaults](includes/machine-learning-cli-prepare.md)]

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* A working Python 3.8 (or higher) environment.

* You must have additional Python packages installed for scoring and may install them with the code below. They include:
    * Numpy - An array and numerical computing library 
    * [Triton Inference Server Client](https://github.com/triton-inference-server/client) - Facilitates requests to the Triton Inference Server
    * Pillow - A library for image operations
    * Gevent - A networking library used when connecting to the Triton Server

    ```azurecli
    pip install numpy
    pip install tritonclient[http]
    pip install pillow
    pip install gevent
    ```

* Access to NCv3-series VMs for your Azure subscription.

    > [!IMPORTANT]
    > You may need to request a quota increase for your subscription before you can use this series of VMs. For more information, see [NCv3-series](../virtual-machines/ncv3-series.md).

The information in this article is based on the [online-endpoints-triton.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/triton/single-model/online-endpoints-triton.ipynb) notebook contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste files, clone the repo, and then change directories to the `sdk/endpoints/online/triton/single-model/` directory in the repo:

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/sdk/python/endpoints/online/triton/single-model/
```

# [Studio](#tab/azure-studio)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in [Manage Azure Machine Learning workspaces in the portal, or with the Python SDK](how-to-manage-workspace.md) to create one.

--- 

## Define the deployment configuration

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

This section shows how you can deploy to a managed online endpoint using the Azure CLI with the Machine Learning extension (v2).

> [!IMPORTANT]
> For Triton no-code-deployment, **[testing via local endpoints](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.

1. To avoid typing in a path for multiple commands, use the following command to set a `BASE_PATH` environment variable. This variable points to the directory where the model and associated YAML configuration files are located:

    ```azurecli
    BASE_PATH=endpoints/online/triton/single-model
    ```

1. Use the following command to set the name of the endpoint that will be created. In this example, a random name is created for the endpoint:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="set_endpoint_name":::

1. Create a YAML configuration file for your endpoint. The following example configures the name and authentication mode of the endpoint. The one used in the following commands is located at `/cli/endpoints/online/triton/single-model/create-managed-endpoint.yml` in the azureml-examples repo you cloned earlier:

    __create-managed-endpoint.yaml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/triton/single-model/create-managed-endpoint.yaml":::

1. Create a YAML configuration file for the deployment. The following example configures a deployment named __blue__ to the endpoint defined in the previous step. The one used in the following commands is located at `/cli/endpoints/online/triton/single-model/create-managed-deployment.yml` in the azureml-examples repo you cloned earlier:

    > [!IMPORTANT]
    > For Triton no-code-deployment (NCD) to work, setting **`type`** to **`triton_model​`** is required, `type: triton_model​`. For more information, see [CLI (v2) model YAML schema](reference-yaml-model.md).
    >
    > This deployment uses a Standard_NC6s_v3 VM. You may need to request a quota increase for your subscription before you can use this VM. For more information, see [NCv3-series](../virtual-machines/ncv3-series.md).

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/triton/single-model/create-managed-deployment.yaml":::

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

This section shows how you can define a Triton deployment to deploy to a managed online endpoint using the Azure Machine Learning Python SDK (v2).

> [!IMPORTANT]
> For Triton no-code-deployment, **[testing via local endpoints](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints)** is currently not supported.


1. To connect to a workspace, we need identifier parameters - a subscription, resource group and workspace name. 

    ```python 
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    workspace_name = "<AML_WORKSPACE_NAME>"
    ```

1. Use the following command to set the name of the endpoint that will be created. In this example, a random name is created for the endpoint:

    ```python
    import random

    endpoint_name = f"endpoint-{random.randint(0, 10000)}"
    ```

1. We use these details above in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. Check the [configuration notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace.

    ```python 
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential

    ml_client = MLClient(
        DefaultAzureCredential(),
        subscription_id,
        resource_group,
        workspace_name,
    )
    ```

1. Create a `ManagedOnlineEndpoint` object to configure the endpoint. The following example configures the name and authentication mode of the endpoint. 

    ```python 
    from azure.ai.ml.entities import ManagedOnlineEndpoint

    endpoint = ManagedOnlineEndpoint(name=endpoint_name, auth_mode="key")
    ```

1. Create a `ManagedOnlineDeployment` object to configure the deployment. The following example configures a deployment named __blue__ to the endpoint defined in the previous step and defines a local model inline.

    ```python
    from azure.ai.ml.entities import ManagedOnlineDeployment, Model
    
    model_name = "densenet-onnx-model"
    model_version = 1
    
    deployment = ManagedOnlineDeployment(
        name="blue",
        endpoint_name=endpoint_name,
        model=Model(
            name=model_name, 
            version=model_version,
            path="./models",
            type="triton_model"
        ),
        instance_type="Standard_NC6s_v3",
        instance_count=1,
    )
    ``` 

# [Studio](#tab/azure-studio)

This section shows how you can define a Triton deployment on a managed online endpoint using [Azure Machine Learning studio](https://ml.azure.com).

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

    # [Models page](#tab/models)

    1. Select the Triton model, and then select __Deploy__. When prompted, select __Deploy to real-time endpoint__.

        :::image type="content" source="media/how-to-deploy-with-triton/deploy-from-models-page.png" lightbox="media/how-to-deploy-with-triton/deploy-from-models-page.png" alt-text="Screenshot showing how to deploy model from Models UI.":::

    ---
---


## Deploy to Azure

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

1. To create a new endpoint using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="create_endpoint":::


1. To create the deployment using the YAML configuration, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="create_deployment":::


# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. To create a new endpoint using the `ManagedOnlineEndpoint` object, use the following command:

    ```python 
    endpoint = ml_client.online_endpoints.begin_create_or_update(endpoint)
    ``` 

1. To create the deployment using the `ManagedOnlineDeployment` object, use the following command:

    ```python 
    ml_client.online_deployments.begin_create_or_update(deployment)
    ```

1. Once the deployment completes, its traffic value will be set to `0%`. Update the traffic to 100%. 

    ```python 
    endpoint.traffic = {"blue": 100}
    ml_client.online_endpoints.begin_create_or_update(endpoint)
    ```


# [Studio](#tab/azure-studio)
1. Complete the wizard to deploy to the endpoint.

    :::image type="content" source="media/how-to-deploy-with-triton/review-screen-triton.png" lightbox="media/how-to-deploy-with-triton/review-screen-triton.png" alt-text="Screenshot showing NCD review screen":::

1. Once the deployment completes, its traffic value will be set to `0%`. Update the traffic to 100% from the Endpoint page by clicking `Update Traffic` on the second menu row. 

---

## Test the endpoint

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

Once your deployment completes, use the following command to make a scoring request to the deployed endpoint. 

> [!TIP]
> The file `/cli/endpoints/online/triton/single-model/triton_densenet_scoring.py` in the azureml-examples repo is used for scoring. The image passed to the endpoint needs pre-processing to meet the size, type, and format requirements, and post-processing to show the predicted label. The `triton_densenet_scoring.py` uses the `tritonclient.http` library to communicate with the Triton inference server.

1. To get the endpoint scoring uri, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="get_scoring_uri":::

1. To get an authentication key, use the following command:

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

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. To get the endpoint scoring uri, use the following command:

    ```python 
    endpoint = ml_client.online_endpoints.get(endpoint_name)
    scoring_uri = endpoint.scoring_uri
    ```

1. To get an authentication key, use the following command:
    keys = ml_client.online_endpoints.list_keys(endpoint_name)
    auth_key = keys.primary_key

1. The following scoring code uses the [Triton Inference Server Client](https://github.com/triton-inference-server/client) to submit the image of a peacock to the endpoint. This script is available in the companion notebook to this example - [Deploy a model to online endpoints using Triton](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/triton/single-model/online-endpoints-triton.ipynb).

    ```python
    # Test the blue deployment with some sample data
    import requests
    import gevent.ssl
    import numpy as np
    import tritonclient.http as tritonhttpclient
    from pathlib import Path
    import prepost

    img_uri = "http://aka.ms/peacock-pic"

    # We remove the scheme from the url
    url = scoring_uri[8:]

    # Initialize client handler
    triton_client = tritonhttpclient.InferenceServerClient(
        url=url,
        ssl=True,
        ssl_context_factory=gevent.ssl._create_default_https_context,
    )

    # Create headers
    headers = {}
    headers["Authorization"] = f"Bearer {auth_key}"

    # Check status of triton server
    health_ctx = triton_client.is_server_ready(headers=headers)
    print("Is server ready - {}".format(health_ctx))

    # Check status of model
    model_name = "model_1"
    status_ctx = triton_client.is_model_ready(model_name, "1", headers)
    print("Is model ready - {}".format(status_ctx))

    if Path(img_uri).exists():
        img_content = open(img_uri, "rb").read()
    else:
        agent = f"Python Requests/{requests.__version__} (https://github.com/Azure/azureml-examples)"
        img_content = requests.get(img_uri, headers={"User-Agent": agent}).content

    img_data = prepost.preprocess(img_content)

    # Populate inputs and outputs
    input = tritonhttpclient.InferInput("data_0", img_data.shape, "FP32")
    input.set_data_from_numpy(img_data)
    inputs = [input]
    output = tritonhttpclient.InferRequestedOutput("fc6_1")
    outputs = [output]

    result = triton_client.infer(model_name, inputs, outputs=outputs, headers=headers)
    max_label = np.argmax(result.as_numpy("fc6_1"))
    label_name = prepost.postprocess(max_label)
    print(label_name)
    ``` 

1. The response from the script is similar to the following text:

    ```
    Is server ready - True
    Is model ready - True
    /azureml-examples/sdk/endpoints/online/triton/single-model/densenet_labels.txt
    84 : PEACOCK
    ```

# [Studio](#tab/azure-studio)

Azure Machine Learning studio provides the ability to test endpoints with JSON. However, serialized JSON is not currently included for this example. 

To test an endpoint using Azure Machine Learning studio, click `Test` from the Endpoint page. 

--- 

### Delete the endpoint and model
# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

1. Once you're done with the endpoint, use the following command to delete it:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-triton-managed-online-endpoint.sh" ID="delete_endpoint":::

1. Use the following command to archive your model:

    ```azurecli
    az ml model archive --name $MODEL_NAME --version $MODEL_VERSION
    ```

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. Delete the endpoint. Deleting the endpoint also deletes any child deployments, however it will not archive associated Environments or Models. 

    ```python
    ml_client.online_endpoints.begin_delete(name=endpoint_name)
    ```

1. Archive the model with the following code.

    ```python 
    ml_client.models.archive(name=model_name, version=model_version)
    ```

# [Studio](#tab/azure-studio)

1. From the endpoint's page, click `Delete` in the second row below the endpoint's name. 

1. From the model's page, click `Delete` in the first row below the model's name. 
---


## Next steps

To learn more, review these articles:

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use managed online endpoints in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints ](how-to-safely-rollout-online-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with a managed online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)
