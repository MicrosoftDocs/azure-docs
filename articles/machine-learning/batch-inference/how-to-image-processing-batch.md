---
title: "Image processing with batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a model in batch endpoints that process images
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2
---

# Image processing with batch deployments

[!INCLUDE [ml v2](../../../includes/machine-learning-dev-v2.md)]

Batch Endpoints can be used for processing tabular data, but also any other file type like images. Those deployments are supported in both MLflow and custom models. In this tutorial, we will learn how to deploy a model that classifies images according to the ImageNet taxonomy.

## About this sample

The model we are going to work with was built using TensorFlow along with the RestNet architecture ([Identity Mappings in Deep Residual Networks](https://arxiv.org/abs/1603.05027)). A sample of this model can be downloaded from `https://azuremlexampledata.blob.core.windows.net/data/imagenet/model.zip`. The model has the following constrains that are important to keep in mind for deployment:

* It works with images of size 244x244 (tensors of `(224, 224, 3)`).
* It requires inputs to be scaled to the range `[0,1]`.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo, and then change directories to the `cli/endpoints/batch` if you are using the Azure CLI or `sdk/endpoints/batch` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch
```

### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [imagenet-classifier-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/imagenet-classifier-batch.ipynb).

## Prerequisites

[!INCLUDE [basic cli prereqs](../../../includes/machine-learning-cli-prereqs.md)]

* You must have a batch endpoint already created. This example assumes the endpoint is named `imagenet-classifier-batch`. If you don't have one, follow the instructions at [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md).
* You must have a compute created where to deploy the deployment. This example assumes the name of the compute is `cpu-cluster`. If you don't, follow the instructions at [Create compute](how-to-use-batch-endpoint.md#create-compute).

## Image classification with batch deployments

In this example, we are going to learn how to deploy a deep learning model that can classify a given image according to the [taxonomy of ImageNet](https://image-net.org/). 

### Registering the model

Batch Endpoint can only deploy registered models so we need to register it. You can skip this step if the model you are trying to deploy is already registered.

1. Downloading a copy of the model:

    # [Azure ML CLI](#tab/cli)
    
    ```azurecli
    wget https://azuremlexampledata.blob.core.windows.net/data/imagenet/model.zip
    mkdir -p imagenet-classifier
    unzip model.zip -d imagenet-classifier
    ```
    
    # [Azure ML SDK for Python](#tab/sdk)

    ```python
    import os
    import requests
    from zipfile import ZipFile
    
    requests.get('https://azuremlexampledata.blob.core.windows.net/data/imagenet/model.zip', allow_redirects=True)
    
    os.mkdirs("imagenet-classifier", exits_ok=True)
    with ZipFile(file, 'r') as zip:
      model_path = zip.extractall(path="imagenet-classifier")
    ```
    
2. Register the model:
   
    # [Azure ML CLI](#tab/cli)

    ```azurecli
    MODEL_NAME='imagenet-classifier'
    az ml model create --name $MODEL_NAME --type "custom_model" --path "imagenet-classifier/model"
    ```

    # [Azure ML SDK for Python](#tab/sdk)

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

__imagenet_scorer.py__

```python
import os
import numpy as np
import pandas as pd
import tensorflow as tf
from os.path import basename
from PIL import Image
from tensorflow.keras.models import load_model


def init():
    global model
    global input_width
    global input_height

    # AZUREML_MODEL_DIR is an environment variable created during deployment
    model_path = os.path.join(os.environ["AZUREML_MODEL_DIR"], "model")

    # load the model
    model = load_model(model_path)
    input_width = 244
    input_height = 244

def run(mini_batch):
    results = []

    for image in mini_batch:
        data = Image.open(image).resize((input_width, input_height)) # Read and resize the image
        data = np.array(data)/255.0 # Normalize
        data_batch = tf.expand_dims(data, axis=0) # create a batch of size (1, 244, 244, 3)

        # perform inference
        pred = model.predict(data_batch)

        # Compute probabilities, classes and labels
        pred_prob = tf.math.reduce_max(tf.math.softmax(pred, axis=-1)).numpy()
        pred_class = tf.math.argmax(pred, axis=-1).numpy()

        results.append([basename(image), pred_class[0], pred_prob])

    return pd.DataFrame(results)
```

> [!TIP]
> Although images are provided in mini-batches by the deployment, this scoring script processes one image at a time. This is a common pattern as trying to load the entire batch and send it to the model at once may result in high-memory pressure on the batch executor (OOM exeptions). However, there are certain cases where doing so enables high throughput in the scoring task. This is the case for instance of batch deployments over a GPU hardware where we want to achieve high GPU utilization. See [High throughput deployments](#high-throughput-deployments) for an example of a scoring script that takes advantage of it.

> [!NOTE]
> If you are trying to deploy a generative model (one that generates files), please read how to author a scoring script as explained at [Deployment of models that produces multiple files](how-to-deploy-model-custom-output.md).

### Creating the deployment

One the scoring script is created, it's time to create a batch deployment for it. Follow the following steps to create it:

1. We need to indicate over which environment we are going to run the deployment. In our case, our model runs on `TensorFlow`. Azure Machine Learning already has an environment with the required software installed, so we can reutilize this environment. We are just going to add a couple of dependencies in a `conda.yml` file.

   # [Azure ML CLI](#tab/cli)
   
   No extra step is required for the Azure ML CLI. The environment definition will be included in the deployment file.
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   Let's get a reference to the environment:
   
   ```python
   environment = Environment(
       conda_file="./imagenet-classifier/environment/conda.yml",
       image="mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cpu-inference:latest",
   )
   ```

1. Now, let create the deployment.

   > [!NOTE]
   > This example assumes you have an endpoint created with the name `imagenet-classifier-batch` and a compute cluster with name `cpu-cluster`. If you don't, please follow the steps in the doc [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md).

   # [Azure ML CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following:
   
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
   endpoint_name: imagenet-classifier-batch
   name: imagenet-classifier-resnetv2
   description: A ResNetV2 model architecture for performing ImageNet classification in batch
   model: azureml:imagenet-classifier@latest
   compute: azureml:cpu-cluster
   environment:
      image: mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cpu-inference:latest
      conda_file: ./imagenet-classifier/environment/conda.yml
   code_configuration:
     code: ./imagenet-classifier/code/
     scoring_script: imagenet_scorer.py
   resources:
     instance_count: 2
   max_concurrency_per_instance: 1
   mini_batch_size: 5
   output_action: append_row
   output_file_name: predictions.csv
   retry_settings:
     max_retries: 3
     timeout: 300
   error_threshold: -1
   logging_level: info
   ```
  
   Then, create the deployment with the following command:
   
   ```azurecli
   DEPLOYMENT_NAME="imagenet-classifier-resnetv2"
   az ml batch-deployment create -f deployment.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   To create a new deployment with the indicated environment and scoring script use the following code:
   
   ```python
   deployment = BatchDeployment(
       name="imagenet-classifier-resnetv2",
       description="A ResNetV2 model architecture for performing ImageNet classification in batch",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="./imagenet-classifier/code/",
           scoring_script="imagenet_scorer.py",
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

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   az ml batch-endpoint update --name $ENDPOINT_NAME --set defaults.deployment_name=$DEPLOYMENT_NAME
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   endpoint.defaults.deployment_name = deployment.name
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

1. At this point, our batch endpoint is ready to be used.  

## Testing out the deployment

For testing our endpoint, we are going to use a sample of 1000 images from the original ImageNet dataset. Batch endpoints can only process data that is located in the cloud and that is accessible from the Azure Machine Learning workspace. In this example, we are going to upload it to an Azure Machine Learning data store. Particularly, we are going to create a data asset that can be used to invoke the endpoint for scoring. However, notice that batch endpoints accept data that can be placed in multiple type of locations.

1. Let's download the associated sample data:

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   wget https://azuremlexampledata.blob.core.windows.net/data/imagenet-1000.zip
   unzip imagenet-1000.zip -d /tmp/imagenet-1000
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   !wget https://azuremlexampledata.blob.core.windows.net/data/imagenet-1000.zip
   !unzip imagenet-1000.zip -d /tmp/imagenet-1000
   ```

2. Now, let's create the data asset from the data just downloaded

   # [Azure ML CLI](#tab/cli)
   
   Create a data asset definition in `YAML`:
   
   __imagenet-sample-unlabeled.yml__
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
   name: imagenet-sample-unlabeled
   description: A sample of 1000 images from the original ImageNet dataset.
   type: uri_folder
   path: /tmp/imagenet-1000
   ```
   
   Then, create the data asset:
   
   ```azurecli
   az ml data create -f imagenet-sample-unlabeled.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   data_path = "/tmp/imagenet-1000"
   dataset_name = "imagenet-sample-unlabeled"

   imagenet_sample = Data(
       path=data_path,
       type=AssetTypes.URI_FOLDER,
       description="A sample of 1000 images from the original ImageNet dataset",
       name=dataset_name,
   )
   ml_client.data.create_or_update(imagenet_sample)
   ```
   
3. Now that the data is uploaded and ready to be used, let's invoke the endpoint:

   # [Azure ML CLI](#tab/cli)
   
   ```azurecli
   JOB_NAME = $(az ml batch-endpoint invoke --name $ENDPOINT_NAME --input azureml:imagenet-sample-unlabeled@latest | jq -r '.name')
   ```
   
   > [!NOTE]
   > The utility `jq` may not be installed on every installation. You can get instructions in [this link](https://stedolan.github.io/jq/download/).
   
   # [Azure ML SDK for Python](#tab/sdk)
   
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

   # [Azure ML CLI](#tab/cli)
   
   ```azurecli
   az ml job show --name $JOB_NAME
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   ml_client.jobs.get(job.name)
   ```

5. Once the deployment is finished, we can download the predictions:

   # [Azure ML CLI](#tab/cli)

   To download the predictions, use the following command:

   ```azurecli
   az ml job download --name $JOB_NAME --output-name score --download-path ./
   ```

   # [Azure ML SDK for Python](#tab/sdk)

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
    | n02088094_Afghan_hound.JPEG | 161   | 0.994745	    | Afghan hound |
    | n02088238_basset            | 162	| 0.999397      | basset       |
    | n02088364_beagle.JPEG       | 165   | 0.366914      | bluetick     |
    | n02088466_bloodhound.JPEG   | 164   | 0.926464	    | bloodhound   |
    | ...                         | ...   | ...           | ...          |
    

## High throughput deployments

As mentioned before, the deployment we just created processes one image a time, even when the batch deployment is providing a batch of them. In most cases this is the best approach as it simplifies how the models execute and avoids any possible out-of-memory problems. However, in certain others we may want to saturate as much as possible the utilization of the underlying hardware. This is the case GPUs for instance.

On those cases, we may want to perform inference on the entire batch of data. That implies loading the entire set of images to memory and sending them directly to the model. The following example uses `TensorFlow` to read batch of images and score them all at once. It also uses `TensorFlow` ops to do any data preprocessing so the entire pipeline will happen on the same device being used (CPU/GPU).

> [!WARNING]
> Some models have a non-linear relationship with the size of the inputs in terms of the memory consumption. Batch again (as done in this example) or decrease the size of the batches created by the batch deployment to avoid out-of-memory exceptions.

__imagenet_scorer_batch.py__

```python
import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model

def init():
    global model
    global input_width
    global input_height

    # AZUREML_MODEL_DIR is an environment variable created during deployment
    model_path = os.path.join(os.environ["AZUREML_MODEL_DIR"], "model")

    # load the model
    model = load_model(model_path)
    input_width = 244
    input_height = 244

def decode_img(file_path):
    file = tf.io.read_file(file_path)
    img = tf.io.decode_jpeg(file, channels=3)
    img = tf.image.resize(img, [input_width, input_height])
    return img/255.

def run(mini_batch):
    images_ds = tf.data.Dataset.from_tensor_slices(mini_batch)
    images_ds = images_ds.map(decode_img).batch(64)

    # perform inference
    pred = model.predict(images_ds)

    # Compute probabilities, classes and labels
    pred_prob = tf.math.reduce_max(tf.math.softmax(pred, axis=-1)).numpy()
    pred_class = tf.math.argmax(pred, axis=-1).numpy()

    return pd.DataFrame([mini_batch, pred_prob, pred_class], columns=['file', 'probability', 'class'])
```

Remarks:
* Notice that this script is constructing a tensor dataset from the mini-batch sent by the batch deployment. This dataset is preprocessed to obtain the expected tensors for the model using the `map` operation with the function `decode_img`.
* The dataset is batched again (16) send the data to the model. Use this parameter to control how much information you can load into memory and send to the model at once. If running on a GPU, you will need to carefully tune this parameter to achieve the maximum utilization of the GPU just before getting an OOM exception.
* Once predictions are computed, the tensors are converted to `numpy.ndarray`.


## Considerations for MLflow models processing images

MLflow models in Batch Endpoints support reading images as input data. Remember that MLflow models don't require a scoring script. Have the following considerations when using them:

> [!div class="checklist"]
> * Image files supported includes: `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp` and `.gif`.
> * MLflow models should expect to recieve a `np.ndarray` as input that will match the dimensions of the input image. In order to support multiple image sizes on each batch, the batch executor will invoke the MLflow model once per image file.
> * MLflow models are highly encouraged to include a signature, and if they do it must be of type `TensorSpec`. Inputs are reshaped to match tensor's shape if available. If no signature is available, tensors of type `np.uint8` are inferred.
> * For models that include a signature and are expected to handle variable size of images, then include a signature that can guarantee it. For instance, the following signature will allow batches of 3 channeled images. Specify the signature when you register the model with `mlflow.<flavor>.log_model(..., signature=signature)`.

```python
import numpy as np
import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import Schema, TensorSpec

input_schema = Schema([
  TensorSpec(np.dtype(np.uint8), (-1, -1, -1, 3)),
])
signature = ModelSignature(inputs=input_schema)
```

For more information about how to use MLflow models in batch deployments read [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

## Next steps

* [Using MLflow models in batch deployments](how-to-mlflow-batch.md)
* [NLP tasks with batch deployments](how-to-nlp-processing-batch.md)
