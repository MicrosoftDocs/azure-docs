---
title: Run batch predictions on big data 
titleSuffix: Azure Machine Learning
description: Learn how to get inferences asynchronously on large amounts of data by using ParallelRunStep in Azure Machine Learning. ParallelRunStep provides parallel processing capabilities out of the box and optimizes for high-throughput, fire-and-forget inference for big-data use cases.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial

ms.reviewer: trbye, jmartens, larryfr, vaidyas
ms.author: vaidyas
author: vaidya-s
ms.date: 01/15/2020
ms.custom: Ignite2019
---

# Run batch inference on large amounts of data by using Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to process large amounts of data asynchronously and in parallel by using Azure Machine Learning. The ParallelRunStep capability described here is in public preview. It's a high-performance and high-throughput way to generate inferences and processing data. It provides asynchronous capabilities out of the box.

With ParallelRunStep, it's straightforward to scale offline inferences to large clusters of machines on terabytes of production data resulting in improved productivity and optimized cost.

In this article, you learn the following tasks:

> * Create a remote compute resource.
> * Write a custom inference script.
> * Create a [machine learning pipeline](concept-ml-pipelines.md) to register a pre-trained image classification model based on the [MNIST](https://publicdataset.azurewebsites.net/dataDetail/mnist/) dataset. 
> * Use the model to run batch inference on sample images available in your Azure Blob storage account. 

## Prerequisites

* If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of the Azure Machine Learning](https://aka.ms/AMLFree).

* For a guided quickstart, complete the [setup tutorial](tutorial-1st-experiment-sdk-setup.md) if you don't already have an Azure Machine Learning workspace or notebook virtual machine. 

* To manage your own environment and dependencies, see the [how-to guide](how-to-configure-environment.md) on configuring your own environment. Run `pip install azureml-sdk[notebooks] azureml-pipeline-core azureml-contrib-pipeline-steps` in your environment to download the necessary dependencies.

## Set up machine learning resources

The following actions set up the resources that you need to run a batch inference pipeline:

- Create a datastore that points to a blob container that has images to inference.
- Set up data references as inputs and outputs for the batch inference pipeline step.
- Set up a compute cluster to run the batch inference step.

### Create a datastore with sample images

Get the MNIST evaluation set from the public blob container `sampledata` on an account named `pipelinedata`. Create a datastore with the name `mnist_datastore`, which points to this container. In the following call to `register_azure_blob_container`, setting the `overwrite` flag to `True` overwrites any datastore that was created previously with that name. 

You can change this step to point to your blob container by providing your own values for `datastore_name`, `container_name`, and `account_name`.

```python
from azureml.core import Datastore
from azureml.core import Workspace

# Load workspace authorization details from config.json
ws = Workspace.from_config()

mnist_blob = Datastore.register_azure_blob_container(ws, 
                      datastore_name="mnist_datastore", 
                      container_name="sampledata", 
                      account_name="pipelinedata",
                      overwrite=True)
```

Next, specify the workspace default datastore as the output datastore. You'll use it for inference output.

When you create your workspace, [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) and [Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) are attached to the workspace by default. Azure Files is the default datastore for a workspace, but you can also use Blob storage as a datastore. For more information, see [Azure storage options](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks).

```python
def_data_store = ws.get_default_datastore()
```

### Configure data inputs and outputs

Now you need to configure data inputs and outputs, including:

- The directory that contains the input images.
- The directory where the pre-trained model is stored.
- The directory that contains the labels.
- The directory for output.

`Dataset` is a class for exploring, transforming, and managing data in Azure Machine Learning. This class has two types: `TabularDataset` and `FileDataset`. In this example, you'll use `FileDataset` as the inputs to the batch inference pipeline step. 

> [!NOTE] 
> `FileDataset` support in batch inference is restricted to Azure Blob storage for now. 

You can also reference other datasets in your custom inference script. For example, you can use it to access labels in your script for labeling images by using `Dataset.register` and `Dataset.get_by_name`.

For more information about Azure Machine Learning datasets, see [Create and access datasets (preview)](https://docs.microsoft.com/azure/machine-learning/how-to-create-register-datasets).

`PipelineData` objects are used for transferring intermediate data between pipeline steps. In this example, you use it for inference outputs.

```python
from azureml.core.dataset import Dataset

mnist_ds_name = 'mnist_sample_data'

path_on_datastore = mnist_blob.path('mnist/')
input_mnist_ds = Dataset.File.from_files(path=path_on_datastore, validate=False)
registered_mnist_ds = input_mnist_ds.register(ws, mnist_ds_name, create_new_version=True)
named_mnist_ds = registered_mnist_ds.as_named_input(mnist_ds_name)

output_dir = PipelineData(name="inferences", 
                          datastore=def_data_store, 
                          output_path_on_compute="mnist/results")
```

### Set up a compute target

In Azure Machine Learning, *compute* (or *compute target*) refers to the machines or clusters that perform the computational steps in your machine learning pipeline. Run the following code to create a CPU based [AmlCompute](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py) target.

```python
from azureml.core.compute import AmlCompute, ComputeTarget
from azureml.core.compute_target import ComputeTargetException

# choose a name for your cluster
compute_name = os.environ.get("AML_COMPUTE_CLUSTER_NAME", "cpu-cluster")
compute_min_nodes = os.environ.get("AML_COMPUTE_CLUSTER_MIN_NODES", 0)
compute_max_nodes = os.environ.get("AML_COMPUTE_CLUSTER_MAX_NODES", 4)

# This example uses CPU VM. For using GPU VM, set SKU to STANDARD_NC6
vm_size = os.environ.get("AML_COMPUTE_CLUSTER_SKU", "STANDARD_D2_V2")


if compute_name in ws.compute_targets:
    compute_target = ws.compute_targets[compute_name]
    if compute_target and type(compute_target) is AmlCompute:
        print('found compute target. just use it. ' + compute_name)
else:
    print('creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size = vm_size,
                                                                min_nodes = compute_min_nodes, 
                                                                max_nodes = compute_max_nodes)

    # create the cluster
    compute_target = ComputeTarget.create(ws, compute_name, provisioning_config)
    
    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
    
     # For a more detailed view of current AmlCompute status, use get_status()
    print(compute_target.get_status().serialize())
```

## Prepare the model

[Download the pre-trained image classification model](https://pipelinedata.blob.core.windows.net/mnist-model/mnist-tf.tar.gz), and then extract it to the `models` directory.

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

Then register the model with your workspace so it's available to your remote compute resource.

```python
from azureml.core.model import Model

# Register the downloaded model 
model = Model.register(model_path="models/",
                       model_name="mnist",
                       tags={'pretrained': "mnist"},
                       description="Mnist trained tensorflow model",
                       workspace=ws)
```

## Write your inference script

>[!Warning]
>The following code is only a sample that the [sample notebook](https://aka.ms/batch-inference-notebooks) uses. You’ll need to create your own script for your scenario.

The script *must contain* two functions:
- `init()`: Use this function for any costly or common preparation for later inference. For example, use it to load the model into a global object. This function will be called only once at beginning of process.
-  `run(mini_batch)`: The function will run for each `mini_batch` instance.
    -  `mini_batch`: Parallel run step will invoke run method and pass either a list or Pandas DataFrame as an argument to the method. Each entry in min_batch will be - a file path if input is a FileDataset, a Pandas DataFrame if input is a TabularDataset.
    -  `response`: run() method should return a Pandas DataFrame or an array. For append_row output_action, these returned elements are appended into the common output file. For summary_only, the contents of the elements are ignored. For all output actions, each returned output element indicates one successful run of input element in the input mini-batch. User should make sure that enough data is included in run result to map input to run result. Run output will be written in output file and not guaranteed to be in order, user should use some key in the output to map it to input.

```python
# Snippets from a sample script.
# Refer to the accompanying digit_identification.py
# (https://aka.ms/batch-inference-notebooks)
# for the implementation script.

import os
import numpy as np
import tensorflow as tf
from PIL import Image
from azureml.core import Model


def init():
    global g_tf_sess

    # Pull down the model from the workspace
    model_path = Model.get_model_path("mnist")

    # Construct a graph to execute
    tf.reset_default_graph()
    saver = tf.train.import_meta_graph(os.path.join(model_path, 'mnist-tf.model.meta'))
    g_tf_sess = tf.Session()
    saver.restore(g_tf_sess, os.path.join(model_path, 'mnist-tf.model'))


def run(mini_batch):
    print(f'run method start: {__file__}, run({mini_batch})')
    resultList = []
    in_tensor = g_tf_sess.graph.get_tensor_by_name("network/X:0")
    output = g_tf_sess.graph.get_tensor_by_name("network/output/MatMul:0")

    for image in mini_batch:
        # Prepare each image
        data = Image.open(image)
        np_im = np.array(data).reshape((1, 784))
        # Perform inference
        inference_result = output.eval(feed_dict={in_tensor: np_im}, session=g_tf_sess)
        # Find the best probability, and add it to the result list
        best_result = np.argmax(inference_result)
        resultList.append("{}: {}".format(os.path.basename(image), best_result))

    return resultList
```

### How to access other files in source directory in entry_script

If you have another file or folder in the same directory as your entry script, you can reference it by finding the current working directory.

```python
script_dir = os.path.realpath(os.path.join(__file__, '..',))
file_path = os.path.join(script_dir, "<file_name>")
```

## Build and run the pipeline containing ParallelRunStep

Now you have everything you need to build the pipeline.

### Prepare the run environment

First, specify the dependencies for your script. You use this object later when you create the pipeline step.

```python
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.runconfig import DEFAULT_GPU_IMAGE

batch_conda_deps = CondaDependencies.create(pip_packages=["tensorflow==1.13.1", "pillow"])

batch_env = Environment(name="batch_environment")
batch_env.python.conda_dependencies = batch_conda_deps
batch_env.docker.enabled = True
batch_env.docker.base_image = DEFAULT_GPU_IMAGE
batch_env.spark.precache_packages = False
```

### Specify the parameters for your batch inference pipeline step

`ParallelRunConfig` is the major configuration for the newly introduced batch inference `ParallelRunStep` instance within the Azure Machine Learning pipeline. You use it to wrap your script and configure necessary parameters, including all of the following parameters:
- `entry_script`: A user script as a local file path that will be run in parallel on multiple nodes. If `source_directory` is present, use a relative path. Otherwise, use any path that's accessible on the machine.
- `mini_batch_size`: The size of the mini-batch passed to a single `run()` call. (optional; the default value is `10` files for FileDataset and `1MB` for TabularDataset.)
    - For `FileDataset`, it's the number of files with a minimum value of `1`. You can combine multiple files into one mini-batch.
    - For `TabularDataset`, it's the size of data. Example values are `1024`, `1024KB`, `10MB`, and `1GB`. The recommended value is `1MB`. The mini-batch from `TabularDataset` will never cross file boundaries. For example, if you have .csv files with various sizes, the smallest file is 100 KB and the largest is 10 MB. If you set `mini_batch_size = 1MB`, then files with a size smaller than 1 MB will be treated as one mini-batch. Files with a size larger than 1 MB will be split into multiple mini-batches.
- `error_threshold`: The number of record failures for `TabularDataset` and file failures for `FileDataset` that should be ignored during processing. If the error count for the entire input goes above this value, the job will be aborted. The error threshold is for the entire input and not for individual mini-batches sent to the `run()` method. The range is `[-1, int.max]`. The `-1` part indicates ignoring all failures during processing.
- `output_action`: One of the following values indicates how the output will be organized:
    - `summary_only`: The user script will store the output. `ParallelRunStep` will use the output only for the error threshold calculation.
    - `append_row`: For all input files, only one file will be created in the output folder to append all outputs separated by line. The file name will be `parallel_run_step.txt`.
- `source_directory`: Paths to folders that contain all files to execute on the compute target (optional).
- `compute_target`: Only `AmlCompute` is supported.
- `node_count`: The number of compute nodes to be used for running the user script.
- `process_count_per_node`: The number of processes per node.
- `environment`: The Python environment definition. You can configure it to use an existing Python environment or to set up a temporary environment for the experiment. The definition is also responsible for setting the required application dependencies (optional).
- `logging_level`: Log verbosity. Values in increasing verbosity are: `WARNING`, `INFO`, and `DEBUG`. (optional; the default value is `INFO`)
- `run_invocation_timeout`: The `run()` method invocation timeout in seconds. (optional; default value is `60`)

```python
from azureml.contrib.pipeline.steps import ParallelRunConfig

parallel_run_config = ParallelRunConfig(
    source_directory=scripts_folder,
    entry_script="digit_identification.py",
    mini_batch_size="5",
    error_threshold=10,
    output_action="append_row",
    environment=batch_env,
    compute_target=compute_target,
    node_count=4)
```

### Create the pipeline step

Create the pipeline step by using the script, environment configuration, and parameters. Specify the compute target that you already attached to your workspace as the target of execution for the script. Use `ParallelRunStep` to create the batch inference pipeline step, which takes all the following parameters:
- `name`: The name of the step, with the following naming restrictions: unique, 3-32 characters, and regex ^\[a-z\]([-a-z0-9]*[a-z0-9])?$.
- `models`: Zero or more model names already registered in the Azure Machine Learning model registry.
- `parallel_run_config`: A `ParallelRunConfig` object, as defined earlier.
- `inputs`: One or more single-typed Azure Machine Learning datasets.
- `output`: A `PipelineData` object that corresponds to the output directory.
- `arguments`: A list of arguments passed to the user script (optional).
- `allow_reuse`: Whether the step should reuse previous results when run with the same settings/inputs. If this parameter is `False`, a new run will always be generated for this step during pipeline execution. (optional; the default value is `True`.)

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

>[!Note]
> The above step depends on `azureml-contrib-pipeline-steps`, as described in [Prerequisites](#prerequisites). 

### Run the pipeline

Now, run the pipeline. First, create a `Pipeline` object by using your workspace reference and the pipeline step that you created. The `steps` parameter is an array of steps. In this case, there's only one step for batch scoring. To build pipelines that have multiple steps, place the steps in order in this array.

Next, use the `Experiment.submit()` function to submit the pipeline for execution.

```python
from azureml.pipeline.core import Pipeline
from azureml.core.experiment import Experiment

pipeline = Pipeline(workspace=ws, steps=[parallelrun_step])
pipeline_run = Experiment(ws, 'digit_identification').submit(pipeline)
```

## Monitor the parallel run job

A batch inference job can take a long time to finish. This example monitors progress by using a Jupyter widget. You can also manage the job's progress by using:

* Azure Machine Learning Studio. 
* Console output from the [`PipelineRun`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.run.pipelinerun?view=azure-ml-py) object.

```python
from azureml.widgets import RunDetails
RunDetails(pipeline_run).show()

pipeline_run.wait_for_completion(show_output=True)
```

## Next steps

To see this process working end to end, try the [batch inference notebook](https://aka.ms/batch-inference-notebooks). 

For debugging and troubleshooting guidance for ParallelRunStep, see the [how-to guide](how-to-debug-parallel-run-step.md).

For debugging and troubleshooting guidance for pipelines, see the [how-to guide](how-to-debug-pipelines.md).

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

