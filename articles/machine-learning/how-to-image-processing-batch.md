---
title: "Image processing with batch model deployments"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a model in batch endpoints that process images by using Azure Machine Learning.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.date: 08/20/2024
ms.reviewer: cacrest
ms.custom: devplatv2, update-code, devx-track-azurecli
#customer intent: As a data scientist, I want to use batch model deployments for machine learning, such as classifying images according to a taxonomy.
---

# Image processing with batch model deployments

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

Batch model deployments can be used for processing tabular data, but also any other file type like images. Those deployments are supported in both MLflow and custom models. In this article, you learn how to deploy a model that classifies images according to the ImageNet taxonomy.

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]

## About this sample

The model that this article works with was built using TensorFlow along with the RestNet architecture. For more information, see [Identity Mappings in Deep Residual Networks](https://arxiv.org/abs/1603.05027). You can download [a sample of this model](https://azuremlexampledata.blob.core.windows.net/data/imagenet/model.zip). The model has the following constraints:

- It works with images of size 244x244 (tensors of `(224, 224, 3)`).
- It requires inputs to be scaled to the range `[0,1]`.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo. Change directories to `cli/endpoints/batch/deploy-models/imagenet-classifier` if you're using the Azure CLI or `sdk/python/endpoints/batch/deploy-models/imagenet-classifier` if you're using the SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch/deploy-models/imagenet-classifier
```
### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [imagenet-classifier-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/imagenet-classifier/imagenet-classifier-batch.ipynb).

## Image classification with batch deployments

In this example, you learn how to deploy a deep learning model that can classify a given image according to the [taxonomy of ImageNet](https://image-net.org/).

### Create the endpoint

Create the endpoint that hosts the model:

# [Azure CLI](#tab/cli)

1. Decide on the name of the endpoint:

   ```azurecli
   ENDPOINT_NAME="imagenet-classifier-batch"
   ```

1. Create the following YAML file to define the batch endpoint, named *endpoint.yml*:

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/endpoint.yml":::

   To create the endpoint, run the following code.

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_endpoint" :::

# [Python](#tab/python)

1. Decide on the name of the endpoint:

   ```python
   endpoint_name="imagenet-classifier-batch"
   ```

1. Configure the endpoint:

   ```python
   endpoint = BatchEndpoint(
       name=endpoint_name,
       description="An batch service to perform ImageNet image classification",
   )
   ```

1. To create the endpoint, run the following code:

   ```python
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

---

### Register the model

Model deployments can only deploy registered models. You need to register the model. You can skip this step if the model you're trying to deploy is already registered.

1. Download a copy of the model:

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="download_model" :::

   # [Python](#tab/python)

   ```python
   import os
   import urllib.request
   from zipfile import ZipFile
    
   response = urllib.request.urlretrieve('https://azuremlexampledata.blob.core.windows.net/data/imagenet/model.zip', 'model.zip')
    
   os.mkdirs("imagenet-classifier", exits_ok=True)
   with ZipFile(response[0], 'r') as zip:
     model_path = zip.extractall(path="imagenet-classifier")
   ```

1. Register the model:

   # [Azure CLI](#tab/cli)

   ```azurecli
   MODEL_NAME='imagenet-classifier'
   az ml model create --name $MODEL_NAME --path "model"
   ```

   # [Python](#tab/python)

   ```python
   model_name = 'imagenet-classifier'
   model = ml_client.models.create_or_update(
       Model(name=model_name, path=model_path, type=AssetTypes.CUSTOM_MODEL)
   )
   ```

### Create a scoring script

Create a scoring script that can read the images provided by the batch deployment and return the scores of the model. The following script:

> [!div class="checklist"]
> - Indicates an `init` function that load the model using `keras` module in `tensorflow`.
> - Indicates a `run` function that is executed for each mini-batch the batch deployment provides.
> - The `run` function read one image of the file at a time
> - The `run` method resizes the images to the expected sizes for the model.
> - The `run` method rescales the images to the range `[0,1]` domain, which is what the model expects.
> - It returns the classes and the probabilities associated with the predictions.

**code/score-by-file/batch_driver.py**:

:::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/code/score-by-file/batch_driver.py" :::

> [!TIP]
> Although images are provided in mini-batches by the deployment, this scoring script processes one image at a time. This is a common pattern because trying to load the entire batch and send it to the model at once might result in high-memory pressure on the batch executor (OOM exceptions). However, there are certain cases where doing so enables high throughput in the scoring task. This is the case for batch deployments over GPU hardware where you want to achieve high GPU utilization. For an example of a scoring script that takes advantage of this approach, see [High throughput deployments](#high-throughput-deployments).

> [!NOTE]
> If you are trying to deploy a generative model, which generates files, read how to author a scoring script as explained at [Customize outputs in batch deployments](how-to-deploy-model-custom-output.md).

### Creating the deployment

After you create the scoring script, create a batch deployment for it. Use the following procedure:

1. Ensure that you have a compute cluster created where you can create the deployment. In this example, use a compute cluster named `gpu-cluster`. Although not required, using GPUs speeds up the processing.

1. Indicate over which environment to run the deployment. In this example, the model runs on `TensorFlow`. Azure Machine Learning already has an environment with the required software installed, so you can reuse this environment. You need to add a couple of dependencies in a `conda.yml` file.

   # [Azure CLI](#tab/cli)

   The environment definition is included in the deployment file.

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deployment-by-file.yml" range="7-10":::

   # [Python](#tab/python)

   Get a reference to the environment:

   ```python
   environment = Environment(
       name="tensorflow27-cuda11-gpu",
       conda_file="environment/conda.yml",
       image="mcr.microsoft.com/azureml/curated/tensorflow-2.7-ubuntu20.04-py38-cuda11-gpu:latest",
   )
   ```

1. Create the deployment:

   # [Azure CLI](#tab/cli)

   To create a new deployment under the created endpoint, create a `YAML` configuration like the following example. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deployment-by-file.yml":::
  
   Then, create the deployment with the following command:

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_deployment" :::

   # [Python](#tab/python)

   To create a new deployment with the indicated environment and scoring script, use the following code:

   ```python
   deployment = BatchDeployment(
       name="imagenet-classifier-resnetv2",
       description="A ResNetV2 model architecture for performing ImageNet classification in batch",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="code/score-by-file",
           scoring_script="batch_driver.py",
       ),
       compute=compute_name,
       instance_count=2,
       max_concurrency_per_instance=1,
       mini_batch_size=10,
       output_action=BatchDeploymentOutputAction.APPEND_ROW,
       output_file_name="predictions.csv",
       retry_settings=BatchRetrySettings(max_retries=3, timeout=300),
       logging_level="info",
   )
   ```

   Create the deployment with the following command:

   ```python
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```

1. Although you can invoke a specific deployment inside of an endpoint, you usually want to invoke the endpoint itself, and let the endpoint decide which deployment to use. Such deployment is named the *default* deployment. This approach gives you the possibility of changing the default deployment - and hence changing the model serving the deployment - without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

   # [Azure Machine Learning CLI](#tab/cli)

   ```bash
   az ml batch-endpoint update --name $ENDPOINT_NAME --set defaults.deployment_name=$DEPLOYMENT_NAME
   ```

   # [Azure Machine Learning SDK for Python](#tab/python)

   ```python
   endpoint.defaults.deployment_name = deployment.name
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

Your batch endpoint is ready to be used.  

## Test the deployment

For testing the endpoint, use a sample of 1,000 images from the original ImageNet dataset. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. Upload it to an Azure Machine Learning data store. Create a data asset that can be used to invoke the endpoint for scoring. However, batch endpoints accept data that can be placed in multiple type of locations.

1. Download the associated sample data:

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="download_sample_data" :::

   > [!NOTE]
   > If you don't have `wget` installed locally, install it or use a browser to get the .*zip* file.

   # [Python](#tab/python)

   ```python
   !wget https://azuremlexampledata.blob.core.windows.net/data/imagenet-1000.zip
   !unzip imagenet-1000.zip -d data
   ```

1. Create the data asset from the data downloaded.

   # [Azure CLI](#tab/cli)

   1. Create a data asset definition in a `YAML` file called *imagenet-sample-unlabeled.yml*:

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/imagenet-sample-unlabeled.yml":::

   1. Create the data asset:

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_sample_data_asset" :::

   # [Python](#tab/python)

   1. Specify these values:

   ```python
   data_path = "data"
   dataset_name = "imagenet-sample-unlabeled"

   imagenet_sample = Data(
       path=data_path,
       type=AssetTypes.URI_FOLDER,
       description="A sample of 1000 images from the original ImageNet dataset",
       name=dataset_name,
   )
   ```

   1. Create the data asset.

   ```python
   ml_client.data.create_or_update(imagenet_sample)
   ```

   To get the newly created data asset, use this code:

   ```python
   imagenet_sample = ml_client.data.get(dataset_name, label="latest")
   ```

1. When the data is uploaded and ready to be used, invoke the endpoint:

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="start_batch_scoring_job" :::

   > [!NOTE]
   > If the utility `jq` isn't installed, see [Download jq](https://stedolan.github.io/jq/download/).

   # [Python](#tab/python)

   > [!TIP]
   > [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]

   ```python
   input = Input(type=AssetTypes.URI_FOLDER, path=imagenet_sample.id)
   job = ml_client.batch_endpoints.invoke(
      endpoint_name=endpoint.name,
      input=input,
   )
   ```

   ---

   > [!TIP]
   > You don't indicate the deployment name in the invoke operation. That's because the endpoint automatically routes the job to the default deployment. Since the endpoint only has one deployment, that one is the default one. You can target an specific deployment by indicating the argument/parameter `deployment_name`.

1. A batch job starts as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="show_job_in_studio" :::

   # [Python](#tab/python)

   ```python
   ml_client.jobs.get(job.name)
   ```

1. After the deployment finishes, download the predictions:

   # [Azure CLI](#tab/cli)

   To download the predictions, use the following command:

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="download_outputs" :::

   # [Python](#tab/python)

   ```python
   ml_client.jobs.download(name=job.name, output_name='score', download_path='./')
   ```

1. The predictions look like the following output. The predictions are combined with the labels for the convenience of the reader. To learn more about how to achieve this effect, see the associated notebook.

    ```python
    import pandas as pd
    score = pd.read_csv("named-outputs/score/predictions.csv", header=None,  names=['file', 'class', 'probabilities'], sep=' ')
    score['label'] = score['class'].apply(lambda pred: imagenet_labels[pred])
    score
    ```

    | file                        | class | probabilities | label        |
    |-----------------------------|-------|---------------| -------------|
    | n02088094_Afghan_hound.JPEG | 161   | 0.994745      | Afghan hound |
    | n02088238_basset            | 162   | 0.999397      | basset       |
    | n02088364_beagle.JPEG       | 165   | 0.366914      | bluetick     |
    | n02088466_bloodhound.JPEG   | 164   | 0.926464      | bloodhound   |
    | ...                         | ...   | ...           | ...          |

## High throughput deployments

As mentioned before, the deployment processes one image a time, even when the batch deployment is providing a batch of them. In most cases, this approach is best. It simplifies how the models run and avoids any possible out-of-memory problems. However, in certain other cases, you might want to saturate as much as possible the underlying hardware. This situation is the case GPUs, for instance.

On those cases, you might want to do inference on the entire batch of data. That approach implies loading the entire set of images to memory and sending them directly to the model. The following example uses `TensorFlow` to read batch of images and score them all at once. It also uses `TensorFlow` ops to do any data preprocessing. The entire pipeline happens on the same device being used (CPU/GPU).

> [!WARNING]
> Some models have a non-linear relationship with the size of the inputs in terms of the memory consumption. To avoid out-of-memory exceptions, batch again (as done in this example) or decrease the size of the batches created by the batch deployment.

1. Creating the scoring script. *code/score-by-batch/batch_driver.py*:

   :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/code/score-by-batch/batch_driver.py" :::

   - This script is constructing a tensor dataset from the mini-batch sent by the batch deployment. This dataset is preprocessed to obtain the expected tensors for the model using the `map` operation with the function `decode_img`.
   - The dataset is batched again (16) send the data to the model. Use this parameter to control how much information you can load into memory and send to the model at once. If running on a GPU, you need to carefully tune this parameter to achieve the maximum usage of the GPU just before getting an OOM exception.
   - After predictions are computed, the tensors are converted to `numpy.ndarray`.

1. Create the deployment.

   # [Azure CLI](#tab/cli)

   1. To create a new deployment under the created endpoint, create a `YAML` configuration like the following example. For other properties, see the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md).

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deployment-by-batch.yml":::
  
   1. Create the deployment with the following command:

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_deployment_ht" :::

   # [Python](#tab/python)

   1. To create a new deployment with the indicated environment and scoring script, use the following code:

   ```python
   deployment = BatchDeployment(
       name="imagenet-classifier-resnetv2",
       description="A ResNetV2 model architecture for performing ImageNet classification in batch",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="code/score-by-batch",
           scoring_script="batch_driver.py",
       ),
       compute=compute_name,
       instance_count=2,
       tags={ "device_acceleration": "CUDA", "device_batching": "16" }
       max_concurrency_per_instance=1,
       mini_batch_size=10,
       output_action=BatchDeploymentOutputAction.APPEND_ROW,
       output_file_name="predictions.csv",
       retry_settings=BatchRetrySettings(max_retries=3, timeout=300),
       logging_level="info",
   )
   ```

   1. Create the deployment with the following command:

   ```python
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```

1. You can use this new deployment with the sample data shown before. Remember that to invoke this deployment either indicate the name of the deployment in the invocation method or set it as the default one.

## Considerations for MLflow models processing images

MLflow models in Batch Endpoints support reading images as input data. Since MLflow deployments don't require a scoring script, have the following considerations when using them:

> [!div class="checklist"]
> - Image files supported includes: *.png*, *.jpg*, *.jpeg*, *.tiff*, *.bmp* and *.gif*.
> - MLflow models should expect to recieve a `np.ndarray` as input that matches the dimensions of the input image. In order to support multiple image sizes on each batch, the batch executor invokes the MLflow model once per image file.
> - MLflow models are highly encouraged to include a signature. If they do, it must be of type `TensorSpec`. Inputs are reshaped to match tensor's shape if available. If no signature is available, tensors of type `np.uint8` are inferred.
> - For models that include a signature and are expected to handle variable size of images, include a signature that can guarantee it. For instance, the following signature example allows batches of 3 channeled images.

```python
import numpy as np
import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import Schema, TensorSpec

input_schema = Schema([
  TensorSpec(np.dtype(np.uint8), (-1, -1, -1, 3)),
])
signature = ModelSignature(inputs=input_schema)

(...)

mlflow.<flavor>.log_model(..., signature=signature)
```

You can find a working example in the Jupyter notebook [imagenet-classifier-mlflow.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/imagenet-classifier/imagenet-classifier-mlflow.ipynb). For more information about how to use MLflow models in batch deployments, see [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

## Next steps

- [Deploy MLflow models in batch deployments](how-to-mlflow-batch.md)
- [Deploy language models in batch endpoints](how-to-nlp-processing-batch.md)
