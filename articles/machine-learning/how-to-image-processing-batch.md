---
title: "Image processing with batch model deployments"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a model in batch endpoints that process images
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2, devx-track-azurecli
---

# Image processing with batch model deployments

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

Batch model deployments can be used for processing tabular data, but also any other file type like images. Those deployments are supported in both MLflow and custom models. In this tutorial, we will learn how to deploy a model that classifies images according to the ImageNet taxonomy.

## About this sample

The model we are going to work with was built using TensorFlow along with the RestNet architecture ([Identity Mappings in Deep Residual Networks](https://arxiv.org/abs/1603.05027)). A sample of this model can be downloaded from [here](https://azuremlexampledata.blob.core.windows.net/data/imagenet/model.zip). The model has the following constrains that is important to keep in mind for deployment:

* It works with images of size 244x244 (tensors of `(224, 224, 3)`).
* It requires inputs to be scaled to the range `[0,1]`.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo, and then change directories to the `cli/endpoints/batch/deploy-models/imagenet-classifier` if you are using the Azure CLI or `sdk/python/endpoints/batch/deploy-models/imagenet-classifier` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch/deploy-models/imagenet-classifier
```

### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [imagenet-classifier-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/imagenet-classifier/imagenet-classifier-batch.ipynb).

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]


## Image classification with batch deployments

In this example, we are going to learn how to deploy a deep learning model that can classify a given image according to the [taxonomy of ImageNet](https://image-net.org/). 

### Create the endpoint

First, let's create the endpoint that will host the model:

# [Azure CLI](#tab/cli)

Decide on the name of the endpoint:

```azurecli
ENDPOINT_NAME="imagenet-classifier-batch"
```

The following YAML file defines a batch endpoint:

__endpoint.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/endpoint.yml":::

Run the following code to create the endpoint.

:::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_endpoint" :::

# [Python](#tab/python)

Decide on the name of the endpoint:

```python
endpoint_name="imagenet-classifier-batch"
```

Configure the endpoint:

```python
endpoint = BatchEndpoint(
    name=endpoint_name,
    description="An batch service to perform ImageNet image classification",
)
```

Run the following code to create the endpoint:

```python
ml_client.batch_endpoints.begin_create_or_update(endpoint)
```

---

### Registering the model

Model deployments can only deploy registered models so we need to register it. You can skip this step if the model you are trying to deploy is already registered.

1. Downloading a copy of the model:

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
    
2. Register the model:
   
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

### Creating a scoring script

We need to create a scoring script that can read the images provided by the batch deployment and return the scores of the model. The following script:

> [!div class="checklist"]
> * Indicates an `init` function that load the model using `keras` module in `tensorflow`.
> * Indicates a `run` function that is executed for each mini-batch the batch deployment provides.
> * The `run` function read one image of the file at a time
> * The `run` method resizes the images to the expected sizes for the model.
> * The `run` method rescales the images to the range `[0,1]` domain, which is what the model expects.
> * It returns the classes and the probabilities associated with the predictions.

__code/score-by-file/batch_driver.py__

:::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/code/score-by-file/batch_driver.py" :::

> [!TIP]
> Although images are provided in mini-batches by the deployment, this scoring script processes one image at a time. This is a common pattern as trying to load the entire batch and send it to the model at once may result in high-memory pressure on the batch executor (OOM exeptions). However, there are certain cases where doing so enables high throughput in the scoring task. This is the case for instance of batch deployments over a GPU hardware where we want to achieve high GPU utilization. See [High throughput deployments](#high-throughput-deployments) for an example of a scoring script that takes advantage of it.

> [!NOTE]
> If you are trying to deploy a generative model (one that generates files), please read how to author a scoring script as explained at [Deployment of models that produces multiple files](how-to-deploy-model-custom-output.md).

### Creating the deployment

One the scoring script is created, it's time to create a batch deployment for it. Follow the following steps to create it:

1. Ensure you have a compute cluster created where we can create the deployment. In this example we are going to use a compute cluster named `gpu-cluster`. Although it's not required, we use GPUs to speed up the processing.

1. We need to indicate over which environment we are going to run the deployment. In our case, our model runs on `TensorFlow`. Azure Machine Learning already has an environment with the required software installed, so we can reutilize this environment. We are just going to add a couple of dependencies in a `conda.yml` file.

   # [Azure CLI](#tab/cli)
   
   The environment definition will be included in the deployment file.
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deployment-by-file.yml" range="7-10":::
   
   # [Python](#tab/python)
   
   Let's get a reference to the environment:
   
   ```python
   environment = Environment(
       name="tensorflow27-cuda11-gpu",
       conda_file="environment/conda.yml",
       image="mcr.microsoft.com/azureml/curated/tensorflow-2.7-ubuntu20.04-py38-cuda11-gpu:latest",
   )
   ```

1. Now, let create the deployment.

   # [Azure CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deployment-by-file.yml":::
  
   Then, create the deployment with the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_deployment" :::
   
   # [Python](#tab/python)
   
   To create a new deployment with the indicated environment and scoring script use the following code:
   
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
   
   Then, create the deployment with the following command:
   
   ```python
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```

1. Although you can invoke a specific deployment inside of an endpoint, you will usually want to invoke the endpoint itself, and let the endpoint decide which deployment to use. Such deployment is named the "default" deployment. This gives you the possibility of changing the default deployment - and hence changing the model serving the deployment - without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

   # [Azure Machine Learning CLI](#tab/cli)
   
   ```bash
   az ml batch-endpoint update --name $ENDPOINT_NAME --set defaults.deployment_name=$DEPLOYMENT_NAME
   ```
   
   # [Azure Machine Learning SDK for Python](#tab/python)
   
   ```python
   endpoint.defaults.deployment_name = deployment.name
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

1. At this point, our batch endpoint is ready to be used.  

## Testing out the deployment

For testing our endpoint, we are going to use a sample of 1000 images from the original ImageNet dataset. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. In this example, we are going to upload it to an Azure Machine Learning data store. Particularly, we are going to create a data asset that can be used to invoke the endpoint for scoring. However, notice that batch endpoints accept data that can be placed in multiple type of locations.

1. Let's download the associated sample data:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="download_sample_data" :::
   
   # [Python](#tab/python)
   
   ```python
   !wget https://azuremlexampledata.blob.core.windows.net/data/imagenet-1000.zip
   !unzip imagenet-1000.zip -d data
   ```

2. Now, let's create the data asset from the data just downloaded

   # [Azure CLI](#tab/cli)
   
   Create a data asset definition in `YAML`:
   
   __imagenet-sample-unlabeled.yml__
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/imagenet-sample-unlabeled.yml":::
   
   Then, create the data asset:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_sample_data_asset" :::
   
   # [Python](#tab/python)
   
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
   
   Then, create the data asset:
   
   ```python
   ml_client.data.create_or_update(imagenet_sample)
   ```
   
   To get the newly created data asset, use:
   
   ```python
   imagenet_sample = ml_client.data.get(dataset_name, label="latest")
   ```
   
3. Now that the data is uploaded and ready to be used, let's invoke the endpoint:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="start_batch_scoring_job" :::
   
   > [!NOTE]
   > The utility `jq` may not be installed on every installation. You can get instructions in [this link](https://stedolan.github.io/jq/download/).
   
   # [Python](#tab/python)

   > [!NOTE]
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
   > Notice how we are not indicating the deployment name in the invoke operation. That's because the endpoint automatically routes the job to the default deployment. Since our endpoint only has one deployment, then that one is the default one. You can target an specific deployment by indicating the argument/parameter `deployment_name`.

4. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="show_job_in_studio" :::
   
   # [Python](#tab/python)
   
   ```python
   ml_client.jobs.get(job.name)
   ```

5. Once the deployment is finished, we can download the predictions:

   # [Azure CLI](#tab/cli)

   To download the predictions, use the following command:

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="download_outputs" :::

   # [Python](#tab/python)

   ```python
   ml_client.jobs.download(name=job.name, output_name='score', download_path='./')
   ```

6. The output predictions will look like the following. Notice that the predictions have been combined with the labels for the convenience of the reader. To know more about how to achieve this see the associated notebook.

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

As mentioned before, the deployment we just created processes one image a time, even when the batch deployment is providing a batch of them. In most cases this is the best approach as it simplifies how the models execute and avoids any possible out-of-memory problems. However, in certain others we may want to saturate as much as possible the utilization of the underlying hardware. This is the case GPUs for instance.

On those cases, we may want to perform inference on the entire batch of data. That implies loading the entire set of images to memory and sending them directly to the model. The following example uses `TensorFlow` to read batch of images and score them all at once. It also uses `TensorFlow` ops to do any data preprocessing so the entire pipeline will happen on the same device being used (CPU/GPU).

> [!WARNING]
> Some models have a non-linear relationship with the size of the inputs in terms of the memory consumption. Batch again (as done in this example) or decrease the size of the batches created by the batch deployment to avoid out-of-memory exceptions.

1. Creating the scoring script:

    __code/score-by-batch/batch_driver.py__
    
    :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/code/score-by-batch/batch_driver.py" :::

    > [!TIP]
    > * Notice that this script is constructing a tensor dataset from the mini-batch sent by the batch deployment. This dataset is preprocessed to obtain the expected tensors for the model using the `map` operation with the function `decode_img`.
    > * The dataset is batched again (16) send the data to the model. Use this parameter to control how much information you can load into memory and send to the model at once. If running on a GPU, you will need to carefully tune this parameter to achieve the maximum utilization of the GPU just before getting an OOM exception.
    > * Once predictions are computed, the tensors are converted to `numpy.ndarray`.

1. Now, let create the deployment.

   # [Azure CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deployment-by-batch.yml":::
  
   Then, create the deployment with the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/imagenet-classifier/deploy-and-run.sh" ID="create_deployment_ht" :::
   
   # [Python](#tab/python)
   
   To create a new deployment with the indicated environment and scoring script use the following code:
   
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
   
   Then, create the deployment with the following command:
   
   ```python
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```

1. You can use this new deployment with the sample data shown before. Remember that to invoke this deployment you should either indicate the name of the deployment in the invocation method or set it as the default one.

## Considerations for MLflow models processing images

MLflow models in Batch Endpoints support reading images as input data. Since MLflow deployments don't require a scoring script, have the following considerations when using them:

> [!div class="checklist"]
> * Image files supported includes: `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp` and `.gif`.
> * MLflow models should expect to recieve a `np.ndarray` as input that will match the dimensions of the input image. In order to support multiple image sizes on each batch, the batch executor will invoke the MLflow model once per image file.
> * MLflow models are highly encouraged to include a signature, and if they do it must be of type `TensorSpec`. Inputs are reshaped to match tensor's shape if available. If no signature is available, tensors of type `np.uint8` are inferred.
> * For models that include a signature and are expected to handle variable size of images, then include a signature that can guarantee it. For instance, the following signature example will allow batches of 3 channeled images.

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

You can find a working example in the Jupyter notebook [imagenet-classifier-mlflow.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/imagenet-classifier/imagenet-classifier-mlflow.ipynb). For more information about how to use MLflow models in batch deployments read [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

## Next steps

* [Using MLflow models in batch deployments](how-to-mlflow-batch.md)
* [NLP tasks with batch deployments](how-to-nlp-processing-batch.md)
