---
title: Run batch predictions on big data 
titleSuffix: Azure Machine Learning
description: Learn how to get inferences asynchronously on large amounts of data by using ParallelRunStep in Azure Machine Learning. ParallelRunStep provides parallel processing capabilities out of the box and optimizes for high-throughput, fire-and-forget inference for big-data use cases.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial

ms.reviewer: trbye, jmartens, larryfr
ms.author: tracych
author: tracychms
ms.date: 06/23/2020
ms.custom: Build2020, tracking-python
---

# Run batch inference on large amounts of data by using Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to run batch inference on large amounts of data asynchronously and in parallel by using Azure Machine Learning. The ParallelRunStep provides parallelism capabilities out of the box.

With ParallelRunStep, it's straightforward to scale offline inferences to large clusters of machines on terabytes of structured or unstructured data with improved productivity and optimized cost.

In this article, you learn the following tasks:

> * Set up machine learning resources.
> * Configure batch inference data inputs and output.
> * Prepare the pre-trained image classification model based on the [MNIST](https://publicdataset.azurewebsites.net/dataDetail/mnist/) dataset. 
> * Write your inference script.
> * Create a [machine learning pipeline](concept-ml-pipelines.md) containing ParallelRunStep and run batch inference on MNIST test images. 
> * Resubmit a batch inference run with new data input and parameters. 

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of the Azure Machine Learning](https://aka.ms/AMLFree).

* For a guided quickstart, complete the [setup tutorial](tutorial-1st-experiment-sdk-setup.md) if you don't already have an Azure Machine Learning workspace. 

* To manage your own environment and dependencies, see the [how-to guide](how-to-configure-environment.md) on configuring your own local environment.

## Set up machine learning resources

The following actions set up the machine learning resources that you need to run a batch inference pipeline:

- Connect to a workspace.
- Create or attach existing compute resource.

### Configure workspace

Create a workspace object from the existing workspace. `Workspace.from_config()` reads the config.json file and loads the details into an object named ws.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
```

> [!IMPORTANT]
> This code snippet expects the workspace configuration to be saved in the current directory or its parent. For more information on creating a workspace, see [Create and manage Azure Machine Learning workspaces](how-to-manage-workspace.md). For more information on saving the configuration to file, see [Create a workspace configuration file](how-to-configure-environment.md#workspace).

### Create a compute target

In Azure Machine Learning, *compute* (or *compute target*) refers to the machines or clusters that perform the computational steps in your machine learning pipeline. Run the following code to create a CPU based [AmlCompute](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py) target.

```python
from azureml.core.compute import AmlCompute, ComputeTarget
from azureml.core.compute_target import ComputeTargetException

# choose a name for your cluster
compute_name = os.environ.get("AML_COMPUTE_CLUSTER_NAME", "cpucluster")
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

## Configure inputs and output

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

### Create the data inputs

The inputs for batch inference are the data that you want to partition for parallel processing. A batch inference pipeline accepts data inputs through [`Dataset`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py).

`Dataset` is for exploring, transforming, and managing data in Azure Machine Learning. There are two types: [`TabularDataset`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py) and [`FileDataset`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.filedataset?view=azure-ml-py). In this example, you'll use `FileDataset` as the inputs. `FileDataset` provides you with the ability to download or mount the files to your compute. By creating a dataset, you create a reference to the data source location. If you applied any subsetting transformations to the dataset, they will be stored in the dataset as well. The data remains in its existing location, so no extra storage cost is incurred.

For more information about Azure Machine Learning datasets, see [Create and access datasets (preview)](https://docs.microsoft.com/azure/machine-learning/how-to-create-register-datasets).

```python
from azureml.core.dataset import Dataset

mnist_ds_name = 'mnist_sample_data'

path_on_datastore = mnist_blob.path('mnist/')
input_mnist_ds = Dataset.File.from_files(path=path_on_datastore, validate=False)
```

In order to use dynamic data inputs when running the batch inference pipeline, you can define the inputs `Dataset` as a [`PipelineParameter`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.pipelineparameter?view=azure-ml-py). You can specify the inputs dataset each time you resubmit a batch inference pipeline run.

```python
from azureml.data.dataset_consumption_config import DatasetConsumptionConfig
from azureml.pipeline.core import PipelineParameter

pipeline_param = PipelineParameter(name="mnist_param", default_value=input_mnist_ds)
input_mnist_ds_consumption = DatasetConsumptionConfig("minist_param_config", pipeline_param).as_mount()
```

### Create the output

[`PipelineData`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) objects are used for transferring intermediate data between pipeline steps. In this example, you use it for inference output.

```python
from azureml.pipeline.core import Pipeline, PipelineData

output_dir = PipelineData(name="inferences", 
                          datastore=def_data_store, 
                          output_path_on_compute="mnist/results")
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

Then register the model with your workspace so it's available to your compute resource.

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
>The following code is only a sample that the [sample notebook](https://aka.ms/batch-inference-notebooks) uses. You'll need to create your own script for your scenario.

The script *must contain* two functions:
- `init()`: Use this function for any costly or common preparation for later inference. For example, use it to load the model into a global object. This function will be called only once at beginning of process.
-  `run(mini_batch)`: The function will run for each `mini_batch` instance.
    -  `mini_batch`: ParallelRunStep will invoke run method and pass either a list or Pandas DataFrame as an argument to the method. Each entry in mini_batch will be - a file path if input is a FileDataset, a Pandas DataFrame if input is a TabularDataset.
    -  `response`: run() method should return a Pandas DataFrame or an array. For append_row output_action, these returned elements are appended into the common output file. For summary_only, the contents of the elements are ignored. For all output actions, each returned output element indicates one successful run of input element in the input mini-batch. Make sure that enough data is included in run result to map input to run output result. Run output will be written in output file and not guaranteed to be in order, you should use some key in the output to map it to input.

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

If you have another file or folder in the same directory as your inference script, you can reference it by finding the current working directory.

```python
script_dir = os.path.realpath(os.path.join(__file__, '..',))
file_path = os.path.join(script_dir, "<file_name>")
```

## Build and run the pipeline containing ParallelRunStep

Now you have everything you need: the data inputs, the model, the output, and your inference script. Let's build the batch inference pipeline containing ParallelRunStep.

### Prepare the environment

First, specify the dependencies for your script. Doing so allows you to install pip packages as well as configure the environment. Always include **azureml-core** and **azureml-dataprep[pandas, fuse]** packages.

If you use a custom docker image (user_managed_dependencies=True), you should also have conda installed.

```python
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.runconfig import DEFAULT_GPU_IMAGE

batch_conda_deps = CondaDependencies.create(pip_packages=["tensorflow==1.13.1", "pillow",
                                                          "azureml-core", "azureml-dataprep[pandas, fuse]"])

batch_env = Environment(name="batch_environment")
batch_env.python.conda_dependencies = batch_conda_deps
batch_env.docker.enabled = True
batch_env.docker.base_image = DEFAULT_GPU_IMAGE
```

### Specify the parameters using ParallelRunConfig

`ParallelRunConfig` is the major configuration for `ParallelRunStep` instance within the Azure Machine Learning pipeline. You use it to wrap your script and configure necessary parameters, including all of the following:
- `entry_script`: A user script as a local file path that will be run in parallel on multiple nodes. If `source_directory` is present, use a relative path. Otherwise, use any path that's accessible on the machine.
- `mini_batch_size`: The size of the mini-batch passed to a single `run()` call. (optional; the default value is `10` files for FileDataset and `1MB` for TabularDataset.)
    - For `FileDataset`, it's the number of files with a minimum value of `1`. You can combine multiple files into one mini-batch.
    - For `TabularDataset`, it's the size of data. Example values are `1024`, `1024KB`, `10MB`, and `1GB`. The recommended value is `1MB`. The mini-batch from `TabularDataset` will never cross file boundaries. For example, if you have .csv files with various sizes, the smallest file is 100 KB and the largest is 10 MB. If you set `mini_batch_size = 1MB`, then files with a size smaller than 1 MB will be treated as one mini-batch. Files with a size larger than 1 MB will be split into multiple mini-batches.
- `error_threshold`: The number of record failures for `TabularDataset` and file failures for `FileDataset` that should be ignored during processing. If the error count for the entire input goes above this value, the job will be aborted. The error threshold is for the entire input and not for individual mini-batch sent to the `run()` method. The range is `[-1, int.max]`. The `-1` part indicates ignoring all failures during processing.
- `output_action`: One of the following values indicates how the output will be organized:
    - `summary_only`: The user script will store the output. `ParallelRunStep` will use the output only for the error threshold calculation.
    - `append_row`: For all inputs, only one file will be created in the output folder to append all outputs separated by line.
- `append_row_file_name`: To customize the output file name for append_row output_action (optional; default value is `parallel_run_step.txt`).
- `source_directory`: Paths to folders that contain all files to execute on the compute target (optional).
- `compute_target`: Only `AmlCompute` is supported.
- `node_count`: The number of compute nodes to be used for running the user script.
- `process_count_per_node`: The number of processes per node. Best practice is to set to the number of GPU or CPU one node has (optional; default value is `1`).
- `environment`: The Python environment definition. You can configure it to use an existing Python environment or to set up a temporary environment. The definition is also responsible for setting the required application dependencies (optional).
- `logging_level`: Log verbosity. Values in increasing verbosity are: `WARNING`, `INFO`, and `DEBUG`. (optional; the default value is `INFO`)
- `run_invocation_timeout`: The `run()` method invocation timeout in seconds. (optional; default value is `60`)
- `run_max_try`: Maximum try count of `run()` for a mini-batch. A `run()` is failed if an exception is thrown, or nothing is returned when `run_invocation_timeout` is reached (optional; default value is `3`). 

You can specify `mini_batch_size`, `node_count`, `process_count_per_node`, `logging_level`, `run_invocation_timeout`, and `run_max_try` as `PipelineParameter`, so that when you resubmit a pipeline run, you can fine tune the parameter values. In this example, you use PipelineParameter for `mini_batch_size` and `Process_count_per_node` and you will change these values when resubmit a run later. 

```python
from azureml.pipeline.core import PipelineParameter
from azureml.pipeline.steps import ParallelRunConfig

parallel_run_config = ParallelRunConfig(
    source_directory=scripts_folder,
    entry_script="digit_identification.py",
    mini_batch_size=PipelineParameter(name="batch_size_param", default_value="5"),
    error_threshold=10,
    output_action="append_row",
    append_row_file_name="mnist_outputs.txt",
    environment=batch_env,
    compute_target=compute_target,
    process_count_per_node=PipelineParameter(name="process_count_param", default_value=2),
    node_count=2)
```

### Create the ParallelRunStep

Create the ParallelRunStep by using the script, environment configuration, and parameters. Specify the compute target that you already attached to your workspace as the target of execution for your inference script. Use `ParallelRunStep` to create the batch inference pipeline step, which takes all the following parameters:
- `name`: The name of the step, with the following naming restrictions: unique, 3-32 characters, and regex ^\[a-z\]([-a-z0-9]*[a-z0-9])?$.
- `parallel_run_config`: A `ParallelRunConfig` object, as defined earlier.
- `inputs`: One or more single-typed Azure Machine Learning datasets to be partitioned for parallel processing.
- `side_inputs`: One or more reference data or datasets used as side inputs without need to be partitioned.
- `output`: A `PipelineData` object that corresponds to the output directory.
- `arguments`: A list of arguments passed to the user script. Use unknown_args to retrieve them in your entry script (optional).
- `allow_reuse`: Whether the step should reuse previous results when run with the same settings/inputs. If this parameter is `False`, a new run will always be generated for this step during pipeline execution. (optional; the default value is `True`.)

```python
from azureml.pipeline.steps import ParallelRunStep

parallelrun_step = ParallelRunStep(
    name="predict-digits-mnist",
    parallel_run_config=parallel_run_config,
    inputs=[input_mnist_ds_consumption],
    output=output_dir,
    allow_reuse=True
)
```
### create and run the pipeline

Now, run the pipeline. First, create a [`Pipeline`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline%28class%29?view=azure-ml-py) object by using your workspace reference and the pipeline step that you created. The `steps` parameter is an array of steps. In this case, there's only one step for batch inference. To build pipelines that have multiple steps, place the steps in order in this array.

Next, use the `Experiment.submit()` function to submit the pipeline for execution.

```python
from azureml.pipeline.core import Pipeline
from azureml.core.experiment import Experiment

pipeline = Pipeline(workspace=ws, steps=[parallelrun_step])
experiment = Experiment(ws, 'digit_identification')
pipeline_run = experiment.submit(pipeline)
```

## Monitor the batch inference job

A batch inference job can take a long time to finish. This example monitors progress by using a Jupyter widget. You can also monitor the job's progress by using:

* Azure Machine Learning Studio. 
* Console output from the [`PipelineRun`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.run.pipelinerun?view=azure-ml-py) object.

```python
from azureml.widgets import RunDetails
RunDetails(pipeline_run).show()

pipeline_run.wait_for_completion(show_output=True)
```

## Resubmit a run with new data inputs and parameters

Since you made the inputs and several configures as `PipelineParameter`, you can resubmit a batch inference run with a different dataset input and fine tune the parameters without having to create an entirely new pipeline. You will use the same datastore but use only a single image as data inputs.

```python
path_on_datastore = mnist_data.path('mnist/0.png')
single_image_ds = Dataset.File.from_files(path=path_on_datastore, validate=False)
single_image_ds._ensure_saved(ws)

pipeline_run_2 = experiment.submit(pipeline, 
                                   pipeline_parameters={"mnist_param": single_image_ds, 
                                                        "batch_size_param": "1",
                                                        "process_count_param": 1}
)

pipeline_run_2.wait_for_completion(show_output=True)
```

## Next steps

To see this process working end to end, try the [batch inference notebook](https://aka.ms/batch-inference-notebooks). 

For debugging and troubleshooting guidance for ParallelRunStep, see the [how-to guide](how-to-debug-parallel-run-step.md).

For debugging and troubleshooting guidance for pipelines, see the [how-to guide](how-to-debug-pipelines.md).

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

