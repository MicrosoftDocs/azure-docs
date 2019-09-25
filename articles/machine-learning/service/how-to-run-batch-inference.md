---
title: Run batch inference on large data 
titleSuffix: Azure Machine Learning service
description: Learn how to get inferences asynchronously on large amounts of data using Azure Machine Learning Batch Inference service. Batch Inference provides parallel processing capabilities out of box and optimizes for high throughput, fire-and-forget inference for a large collection of data.
services: machine-learning
ms.service: machine-learning
ms.subservice: batch inference
ms.topic: tutorial

ms.reviewer: jmartens, larryfr
ms.author: tracych
author: tracych
ms.date: 09/11/2019
ms.custom: 
---
# Run batch inference on large data sets with Azure Machine Learning service (Preview)

In this article, you will learn how to get inferences on large quantities of data asynchronously and in parallel, by using the Azure Machine Learning service.

When you have large dataset to get inference on, you can leverage the parallel processing power of cloud by using Azure Machine Learning Batch Inference capability. Batch Inference provides parallelism out of the box, and can scale to perform fire-and-forget inference on terabytes of production data.

In the following steps, you create a [machine learning pipeline](concept-ml-pipelines.md) to register a pre-trained digit identification model on [MNIST](https://publicdataset.azurewebsites.net/dataDetail/mnist/) dataset using the [Azure ML training with deep learning sample notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow/train-hyperparameter-tune-deploy-with-tensorflow.ipynb), and use this model to do batch inference on MNIST test images available in your Azure Blob storage account. These test images have been converted to PNG. A sample of PNG-converted images were taken from [this repository](https://github.com/myleott/mnist_png).

## Prerequisites

- If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree).

- Configure your development environment to install the Azure Machine Learning SDK. For more information, see [Configure a development environment for Azure Machine Learning](how-to-configure-environment.md).

- Create an Azure Machine Learning workspace that will hold all your pipeline resources. You can use the following code, or for more options, see [Create a workspace configuration file](how-to-configure-environment.md#workspace).

  ```python
    from azureml.core import Workspace
    ws = Workspace.create(name = '<workspace-name>',
                         subscription_id = '<subscription-id>',
                         resource_group = '<resource-group>',
                         location = '<workspace_region>',
                         exist_ok = True)
  ```

## Set up machine learning resources

The following steps set up the resources you need to run a batch inference pipeline:

- Create a datastore that points to a blob container containing images to score.
- Set up data references as inputs and outputs for Batch Inference pipeline steps.
- Set up compute cluster where the batch inference step will run.

### Create a datastore points to a blob container with sample images

Get the MNIST evaluation set from the public blob container `sampledata` on an account named `pipelinedata`. Create a datastore with the name `mnist_datastore`, which points to this container. In the call to `register_azure_blob_container` below, setting the `overwrite` flag to `True` overwrites any datastore that was created previously with that name. 

This step can be changed to point to your blob container by providing your own `datastore_name`, `container_name`, and `account_name`.

```python
account_name = "pipelinedata"
datastore_name="mnist_datastore"
container_name="sampledata"

mnist_blob = Datastore.register_azure_blob_container(ws, 
                      datastore_name=datastore_name, 
                      container_name= container_name, 
                      account_name=account_name,
                      overwrite=True)
```

Next, specify the workspace default datastore as the output datastore, which you use for inference output.

When you create your workspace, [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) and [Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) are attached to the workspace by default. Azure Files is the default datastore for a workspace, but you can also use Blob storage as a datastore. For more information, see [Azure storage
options](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks).

```python
def_data_store = ws.get_default_datastore()
```

### Configure data references

`DataReference` objects are used as data sources in pipeline. The DataReference object points to data that lives in, or is accessible from a data store.
`PipelineData` objects are used for transferring intermediate data between pipeline steps. 
`Dataset` is a resource for exploring, transforming and managing data in Azure Machine Learning. There are two types of Dataset, TabularDataset and FileDataset. In this example, we will use FileDataset. For more information about Azure Machine Learning datasets (preview), see [create and access datasets (preview)](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-register-datasets).

Use following code to create DataReferences objects corresponding to the directory containing the input images, the directory where the pre-trained model is stored, the directory containing the labels, and create a PipelineData object for the batch inference output data.

```python
from azureml.core.dataset import Dataset
from azureml.data.datapath import DataPath

mnist_ds_name = 'mnist_sample_data'

path_on_datastore = mnist_blob.path('mnist/*.png')
input_mnist_ds = Dataset.File.from_files(path=path_on_datastore, validate=False).register(ws, mnist_ds_name, create_new_version=True)

label_dir = DataReference(datastore=mnist_blob, 
                          data_reference_name="input_labels",
                          path_on_datastore="batchscoring/labels",
                          mode="download")
output_dir = PipelineData(name="inferences", 
                          datastore=def_data_store, 
                          output_path_on_compute="mnist/results")
```

### Set up compute target

In Azure Machine Learning, *compute* (or *compute target*) refers to the machines or clusters that perform the computational steps in your machine learning pipeline. Run the following code to create or re-use a GPU-enabled [AmlCompute](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py) target.

```python
# choose a name for your cluster
aml_compute_name = os.environ.get("AML_COMPUTE_NAME", "gpu-cluster")
cluster_min_nodes = os.environ.get("AML_COMPUTE_MIN_NODES", 0)
cluster_max_nodes = os.environ.get("AML_COMPUTE_MAX_NODES", 4)
vm_size = os.environ.get("AML_COMPUTE_SKU", "STANDARD_NC6")
    
try:
    gpu_cluster = AmlCompute(ws, aml_compute_name)
    if gpu_cluster and type(gpu_cluster) is AmlCompute:
        print('found compute target: ' + aml_compute_name)
except ComputeTargetException:
    print('creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size = vm_size, # NC6 is GPU-enabled
                                                                vm_priority = 'lowpriority', # optional
                                                                min_nodes = cluster_min_nodes, 
                                                                max_nodes = cluster_max_nodes)
    gpu_cluster = ComputeTarget.create(ws, aml_compute_name, provisioning_config)
    
    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    gpu_cluster.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
```

## Prepare the model

Before you can use the pre-trained model, you'll need to download the model and register it with your workspace.

### Download the pre-trained model

Download the pre-trained digit identification model from <https://pipelinedata.blob.core.windows.net/mnist-model/mnist-tf.tar.gz>, and then extract it to the `models` directory.

```python
# create directory for model
model_dir = 'models'
if not os.path.isdir(model_dir):
    os.mkdir(model_dir)
```
```python
import tarfile
import urllib.request

url="https://pipelinedata.blob.core.windows.net/mnist-model/mnist-tf.tar.gz"
response = urllib.request.urlretrieve(url, "model.tar.gz")
tar = tarfile.open("model.tar.gz", "r:gz")
tar.extractall(model_dir)
print(os.getcwd())
```

### Register the model

Here's how to register the model with your workspace:

```python
from azureml.core.model import Model

# register downloaded model 
model = Model.register(model_path = "models/",
                       model_name = "mnist", # this is the name the model is registered as
                       tags = {'pretrained': "mnist"},
                       description = "Mnist trained tensorflow model",
                       workspace = ws)
# remove the downloaded dir after registration if you wish
shutil.rmtree("models")
```

## Write your scoring script

>[!Warning]
>The following code is only a sample used by the [sample notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/pipeline-batch-scoring/notebooks/contrib/batch_inferencing/file-dataset-image-inference-mnist.ipynb). You’ll need to create your own scoring script for your scenario.

The scoring script should contain two functions:
- `init()`: this function should be used for any costly or common preparation for subsequent inference, e.g. load the model into a global object.
- `run(input_data, arguments)`: this function will run for each mini_batch.
    - `input_data`: array of locally-accessible file paths or a Pandas dataframe, a subset of files or rows specified in the inputs list.
    - `arguments`: arguments passed during pipeline run will be passed to this function. 
    - `run method response`: run() method should return an array.

```python
# Snippets from a sample scoring script
# Refer to the accompanying file-dataset-image-inference-mnist Notebook
# https://github.com/Azure/MachineLearningNotebooks/blob/master/pipeline/file-dataset-image-inference-mnist.ipynb
# for the implementation script

scripts_folder = "Code"

if not os.path.isdir(scripts_folder):
    os.mkdir(scripts_folder)

%%writefile $scripts_folder/digit_identification.py

# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license.

import os
import numpy as np
import tensorflow as tf
from PIL import Image
from azureml.core import Model


def init():
    global g_tf_sess

    # pull down model from workspace
    model_path = Model.get_model_path("mnist")
    
    # contruct graph to execute
    tf.reset_default_graph()
    saver = tf.train.import_meta_graph(os.path.join(model_path, 'mnist-tf.model.meta'))
    g_tf_sess = tf.Session(config=tf.ConfigProto(device_count={'GPU': 0}))
    saver.restore(g_tf_sess, os.path.join(model_path, 'mnist-tf.model'))


def run(mini_batch):
    print(f'run method start: {__file__}, run({mini_batch})')
    resultList = []
    in_tensor = g_tf_sess.graph.get_tensor_by_name("network/X:0")
    output = g_tf_sess.graph.get_tensor_by_name("network/output/MatMul:0")

    for image in mini_batch:
        # prepare each image
        data = Image.open(image)
        np_im = np.array(data).reshape((1, 784))
        # perform inference
        inference_result = output.eval(feed_dict={in_tensor: np_im}, session=g_tf_sess)
        # find best probability, and add to result list
        best_result = np.argmax(inference_result)
        resultList.append("{}: {}".format(os.path.basename(image), best_result))

    return resultList
```

## Build and run the batch inference pipeline

You have everything you need to build the pipeline. Let's pull all these together.

### Prepare the run environment

Specify the conda dependencies for your script. You'll need this object later, when you create the pipeline step.

```python
from azureml.pipeline.core.graph import PipelineParameter
batch_size_param = PipelineParameter(name="param_batch_size", default_value=20)

from azureml.core import Environment
from azureml.core.runconfig import DEFAULT_GPU_IMAGE

predict_conda_deps = CondaDependencies.create(pip_packages=["tensorflow==1.13.1", "pillow", "azureml-core", "azure.storage.blob", "pandas"])
predict_conda_deps.add_pip_package("azureml-dataprep>=1.1.15")
predict_conda_deps.add_pip_package("azureml-dataprep-native>=13.0.3")

predict_env = Environment(name="predict_environment")
predict_env.python.conda_dependencies = predict_conda_deps
predict_env.docker.enabled = True
predict_env.docker.gpu_support = True
predict_env.docker.base_image = DEFAULT_GPU_IMAGE
predict_env.spark.precache_packages = False
```

### Specify the parameter for your pipeline

Create the configuration to wrap the scoring script by using `ParallelRunConfig` object containing all the following parameters:
- `entry_script`: scoring script with local file path. If source_directly is present, use relative path, otherwise use any path accessible on machine.
- `mini_batch_size`: size of the partition/mini-batch passed to a single run() call. For FileDataset, it's number of files with minimum value of 1. For TabularDatset, it's in bytes with format xMB, and its minimum value is 1MB.
- `error_threshold`: number of record/file failures can be ignored and processing should continue.
- `output_action`: one of the following values:
    - `summary_only`: scoring script will store the output and batch inference will use the output only for error threshold calculation.
    - `file`: for each input file, there will be a corresponding file with the same name in output folder.
    - `append_row`: for all input files, only one file will be created in output folder appending all outputs separated by line. File name will be parallel_run_step.txt.
- `source_directory`: supporting files for scoring (optional).
- `compute_target`: only AMLCompute is supported.
- `node_count`: number of compute nodes to be used.
- `environment` (optional).
- `logging_level`: log verbosity. Values in increasing verbosity are: WARNING, INFO, DEBUG, default is INFO (optional).
- `run_invocation_timeout`: run() method invocation timeout in seconds, default value is 30.

```python
parallel_run_config = ParallelRunConfig(
    source_directory=scripts_folder,
    entry_script="digit_identification.py",
    input_format="file",
    mini_batch_size=80,
    error_threshold=10,
    output_action="append_row",
    environment=predict_env,
    compute_target=gpu_cluster,
    node_count=4)
```

### Create the pipeline step

Create the pipeline step by using the script, environment configuration, and parameters. Specify the compute target you already attached to your workspace as the target of execution of the script. Use `ParallelRunStep` to create the batch inference pipeline step which takes all the following parameters:
- `name`: this name will be used to register batch inference service, has the following naming restrictions: (unique, 3-32 chars and regex ^\[a-z\]([-a-z0-9]*[a-z0-9])?$
- `models`: zero or more model names already registered in Azure Machine Learning model registry.
- `parallel_run_config`: ParallelRunConfig as defined above.
- `inputs`: one or more single-typed Azure Machine Learning datasets.
- `refs`: one or more mixed-typed datasets as side inputs, can be used for lookups or to perform lookup-based joins, e.g. labels.
- `output`: PipelineData object corresponding to the output directory.
- `arguments`: list of arguments passed to scoring script (optional).
- `allow_reuse`: if the inputs remain the same as a previous run, it will make the previous run results immediately available (optional, default value is True).

```python
parallelrun_step = ParallelRunStep(
    name="batch-mnist",
    models=[model],
    parallel_run_config=parallel_run_config,
    inputs=[input_mnist_ds.as_named_input(mnist_ds_name)],
    output=output_dir,
    arguments=[ "--cleanup_leaked_queues", "true" ], # temporary fix, will be defaulted after private preview.
    allow_reuse=True
)
```

### Run the pipeline

At this point you can run the pipeline and examine the output it produced.

```python
pipeline = Pipeline(workspace=ws, steps=[parallelrun_step])
pipeline_run = Experiment(ws, 'digit_identification').submit(pipeline)
```

## Monitor the batch inference job

A batch inference job can take a long time to finish. You can monitor your job's progress from Azure portal, using Azure ML widgets, view console output through SDK, or check out overview.txt in log/azureml directory.

```python
from azureml.widgets import RunDetails
RunDetails(pipeline_run).show()

pipeline_run.wait_for_completion(show_output=True)
```

## Next steps

To see this working end-to-end, try the batch inference notebook in [GitHub](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines). 

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

