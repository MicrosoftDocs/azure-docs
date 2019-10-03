---
title: Run batch inference on large data 
titleSuffix: Azure Machine Learning service
description: Learn how to get inferences asynchronously on large amounts of data using Azure Machine Learning Batch Inference service. Batch Inference provides parallel processing capabilities out of the box and optimizes for high throughput, fire-and-forget inference for big-data use cases.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial

ms.reviewer: trbye, jmartens, larryfr
ms.author: tracych
author: tracych
ms.date: 10/01/2019
ms.custom: Ignite2019
---

# Run batch inference on large data with Azure Machine Learning service (Preview)

In this article, you learn how to get inferences on large quantities of data asynchronously and in parallel, by using Azure Machine Learning Batch Inference. Batch Inference is a high-performance and high-throughput service for generating inferences and processing data. It provides asynchronous capabilities out of the box and makes it straightforward to scale fire-and-forget inference to large clusters of machines on terabytes of production data. The result is increased development productivity and lowered development cost.

In this how-to you learn the following tasks:

> [!div class="checklist"]
> * Create a remote compute resource
> * Write a custom inference script
> * Create a [machine learning pipeline](concept-ml-pipelines.md) to register a pre-trained image classification model based on the [MNIST](https://publicdataset.azurewebsites.net/dataDetail/mnist/) data set. 
> * Use model to run batch inference on sample images available in your Azure Blob storage account. 

## Prerequisites

* If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree).

* For a guided quickstart, complete the [setup tutorial](tutorial-1st-experiment-sdk-setup.md) if you don't already have an Azure Machine Learning workspace or notebook virtual machine. 

* To manage your own environment and dependencies, see the [how-to](how-to-configure-environment.md) on configuring your own environment. Run `pip install azureml-sdk[notebooks] azureml-pipeline-core azureml-contrib-pipeline-steps` in your environment to download the necessary dependencies.

## Set up machine learning resources

The following steps set up the resources you need to run a batch inference pipeline:

- Create a datastore that points to a blob container containing images to inference.
- Set up data references as inputs and outputs for the batch inference pipeline step.
- Set up compute cluster where the batch inference step will run.

### Create a datastore with sample images

Get the MNIST evaluation set from the public blob container `sampledata` on an account named `pipelinedata`. Create a datastore with the name `mnist_datastore`, which points to this container. In the call to `register_azure_blob_container` below, setting the `overwrite` flag to `True` overwrites any datastore that was created previously with that name. 

This step can be changed to point to your blob container by providing your own `datastore_name`, `container_name`, and `account_name`.

```python
from azureml.core import Datastore
from azureml.core import Workspace

# load workspace auth details from config.json
ws = Workspace.from_config()

mnist_blob = Datastore.register_azure_blob_container(ws, 
                      datastore_name="mnist_datastore", 
                      container_name="sampledata", 
                      account_name="pipelinedata",
                      overwrite=True)
```

Next, specify the workspace default datastore as the output datastore, which you use for inference output.

When you create your workspace, [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) and [Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) are attached to the workspace by default. Azure Files is the default datastore for a workspace, but you can also use Blob storage as a datastore. For more information, see [Azure storage
options](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks).

```python
def_data_store = ws.get_default_datastore()
```

### Configure data inputs and outputs

Now you need to configure data inputs and outputs including the directory containing the input images, the directory where the pre-trained model is stored, the directory containing the labels, and the directory for output.

`Dataset` is a class for exploring, transforming and managing data in Azure Machine Learning. There are two types of Dataset, TabularDataset and FileDataset. In this example, you will use FileDataset as the inputs to batch inference pipeline step (please note FileDataset support in Batch Inference is restricted to Azure blob storage for now). You can also use Dataset as side input to your script, e.g. access labels in your script to labe images.

For more information about Azure Machine Learning datasets, see [create and access datasets (preview)](https://docs.microsoft.com/azure/machine-learning/service/how-to-create-register-datasets).

`PipelineData` objects are used for transferring intermediate data between pipeline steps. In this example, you use it for inference outputs.

```python
from azureml.core.dataset import Dataset

mnist_ds_name = 'mnist_sample_data'

path_on_datastore = mnist_blob.path('mnist/*.png')
input_mnist_ds = Dataset.File.from_files(path=path_on_datastore, validate=False)
registered_mnist_ds = input_mnist_ds.register(ws, mnist_ds_name, create_new_version=True)
named_mnist_ds = registered_mnist_ds.as_named_input(mnist_ds_name)

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

Download the pre-trained image classification model from <https://pipelinedata.blob.core.windows.net/mnist-model/mnist-tf.tar.gz>, and then extract it to the `models` directory.

```python
import os
import tarfile
import urllib.request

model_dir = 'models'
if not os.path.isdir(model_dir):
    os.mkdir(model_dir)

url="https://pipelinedata.blob.core.windows.net/mnist-model/mnist-tf.tar.gz"
response = urllib.request.urlretrieve(url, "model.tar.gz")
tar = tarfile.open("model.tar.gz", "r:gz")
tar.extractall(model_dir)
```

Then register the model with your workspace so it is available to your remote compute resource.

```python
from azureml.core.model import Model

# register downloaded model 
model = Model.register(model_path="models/",
                       model_name="mnist",
                       tags={'pretrained': "mnist"},
                       description="Mnist trained tensorflow model",
                       workspace=ws)
```

## Write your inference script

>[!Warning]
>The following code is only a sample used by the [sample notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/pipeline-batch-scoring/notebooks/contrib/batch_inferencing/file-dataset-image-inference-mnist.ipynb). You’ll need to create your own script for your scenario.

The script **must contain** two functions:
- `init()`: this function should be used for any costly or common preparation for subsequent inference, e.g. load the model into a global object.
- `run(input_data, arguments)`: this function will run for each mini_batch.
    - `input_data`: array of locally-accessible file paths or a Pandas dataframe, a subset of files or rows specified in the inputs list.
    - `arguments`: arguments passed during pipeline run will be passed to this function. 
    - `run method response`: run() method should return an array.

```python
# Snippets from a sample script
# Refer to the accompanying digit_identification.py
# https://github.com/Azure/MachineLearningNotebooks/blob/master/pipeline/digit_identification.py
# for the implementation script

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

Now you have everything you need to build the pipeline.

### Prepare the run environment

First specify the dependencies for your script. You use this object later when you create the pipeline step.

```python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.runconfig import DEFAULT_GPU_IMAGE

batch_conda_deps = CondaDependencies.create(pip_packages=["tensorflow==1.13.1", "pillow", "azure.storage.blob", "pandas"])

batch_env = Environment(name="batch_environment")
batch_env.python.conda_dependencies = batch_conda_deps
batch_env.docker.enabled = True
batch_env.docker.gpu_support = True
batch_env.docker.base_image = DEFAULT_GPU_IMAGE
batch_env.spark.precache_packages = False
```

### Specify the parameters for your batch inference pipeline step

`ParallelRunConfig` is the major configuration for the newly introduced batch inference `ParallelRunStep` within Azure Machine Learning pipeline. You use it to wrap your script and config necessary parameters including all of the following:
- `entry_script`: user script as local file path which will be run in parallel on multiple nodes. If source_directly is present, use relative path, otherwise use any path accessible on machine.
- `mini_batch_size`: size of the mini-batch passed to a single run() call (optional, default value 1).
    - For FileDataset, it's number of files with minimum value of 1. Multiple files can be combined into one mini-batch.
    - For TabularDataset, it's the size of data, e.g. 1024, 1024KB, 10MB, 1GB. The minimum value is 1MB. Please note mini-batch from TabularDataset will never cross file boundaries. For example, if you have number of csv files with various size, the smallest file is 100k and the largest is 10MB. If you set mini_batch_size = 1MB, then file with size smaller than 1MB will be treated as one mini-batch, and file with size larger than 1MB will be split into multiple mini-batches.
- `error_threshold`: the number of record failures for TabularDataset and file failures for FileDataset that should be ignored during processing. If the error count for the entire input goes above this value, then the job will be aborted. Error threshold is for the entire input and not for individual mini-batches sent to run() method. The range is [-1, int.max]. -1 indicates ignoring all failures during processing.
- `output_action`: one of the following values indicate how the output will be organized:
    - `summary_only`: user script will store the output and ParallelRunStep will use the output only for error threshold calculation.
    - `file`: for each input file, there will be a corresponding file with the same name in output folder.
    - `append_row`: for all input files, only one file will be created in output folder appending all outputs separated by line. File name will be parallel_run_step.txt.
- `source_directory`: paths to folders that contains all files to execute on compute target (optional).
- `compute_target`: only AMLCompute is supported.
- `node_count`: number of compute nodes to be used for running user script.
- `process_count_per_node`: number of processes per node.
- `environment`: the Python environment definition. It can be configured to use an existing Python environment or to setup a temp environment for the experiment. The definition is also responsible for setting the required application dependencies (optional).
- `logging_level`: log verbosity. Values in increasing verbosity are: WARNING, INFO, DEBUG, default is INFO (optional).
- `run_invocation_timeout`: run() method invocation timeout in seconds, default value is 30.

```python
from azureml.contrib.pipeline.steps import ParallelRunConfig

parallel_run_config = ParallelRunConfig(
    source_directory=scripts_folder,
    entry_script="digit_identification.py",
    input_format="file",
    mini_batch_size="5kb",
    error_threshold=10,
    output_action="append_row",
    environment=batch_env,
    compute_target=gpu_cluster,
    node_count=4)
```

### Create the pipeline step

Create the pipeline step by using the script, environment configuration, and parameters. Specify the compute target you already attached to your workspace as the target of execution of the script. Use `ParallelRunStep` to create the batch inference pipeline step which takes all the following parameters:
- `name`: name of the step with the following naming restrictions: (unique, 3-32 chars and regex ^\[a-z\]([-a-z0-9]*[a-z0-9])?$
- `models`: zero or more model names already registered in Azure Machine Learning model registry.
- `parallel_run_config`: ParallelRunConfig object as defined above.
- `inputs`: one or more single-typed Azure Machine Learning datasets.
- `output`: PipelineData object corresponding to the output directory.
- `arguments`: list of arguments passed to user script (optional).
- `allow_reuse`: whether the step should reuse previous results when run with the same settings/inputs. If this is false, a new run will always be generated for this step during pipeline execution (optional, default value is True).

```python
from azureml.contrib.pipeline.steps import ParallelRunStep

parallelrun_step = ParallelRunStep(
    name="batch-mnist",
    models=[model],
    parallel_run_config=parallel_run_config,
    inputs=[named_mnist_ds],
    output=output_dir,
    arguments=[],
    allow_reuse=True
)
```

### Run the pipeline

Now, run the pipeline. First, create a `Pipeline` object by using your workspace reference and the pipeline step you created. The steps parameter is an array of steps. In this case, there's only one step for batch scoring. To build pipelines that have multiple steps, place the steps in order in this array.

Next, use the `Experiment.submit()` function to submit the pipeline for execution.

```python
from azureml.pipeline.core import Pipeline
from azureml.core.experiment import Experiment

pipeline = Pipeline(workspace=ws, steps=[parallelrun_step])
pipeline_run = Experiment(ws, 'digit_identification').submit(pipeline)
```

## Monitor the batch inference job

A batch inference job can take a long time to finish. This example monitors progress using a Jupyter widget, but you can also manage the job's progress using:

* The Azure portal 
* Console output from the [`PipelineRun`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.run.pipelinerun?view=azure-ml-py) object

```python
from azureml.widgets import RunDetails
RunDetails(pipeline_run).show()

pipeline_run.wait_for_completion(show_output=True)
```

## Next steps

To see this working end-to-end, try the [batch inference notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/). 

For debugging and troubleshooting guidance for pipelines, see the [how-to](how-to-debug-pipelines.md).

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

