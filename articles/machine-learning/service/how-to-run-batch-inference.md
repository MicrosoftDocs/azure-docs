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

In this article, you'll learn how to get inferences on large quantities of data asynchronously and in parallel, by using the Azure Machine Learning service.

When you don't need to get inferences right away, and you have a large dataset to get inferences for which requires parallel processing, Azure Machine Learning Batch Inference is what you want to use. Batch Inference provides parallelism out of the box, and can scale to perform fire-and-forget inference on terabytes of production data.

>[!TIP]
> If your system requires asynchronous inference and sequential processing is sufficient (to process a single document or small sets of documents sequentially on one compute node), use [Azure Machine Learning pipeline PythonScriptStep](how-to-run-batch-predictions.md).

In the following steps, you create a [machine learning pipeline](concept-ml-pipelines.md) to register a pre-trained image classification model ([Inception-V3](https://arxiv.org/abs/1512.00567)), and use this model to do batch inference on images available in your Azure Blob storage account. These images used for scoring are unlabeled images from the [ImageNet](http://image-net.org/) dataset.

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

- Create a dataset that points to a blob container containing images to score.
- Set up an output directory to store your outputs.
- Set up compute machines or clusters where the batch inference pipeline steps will run.

### Create a dataset to access the datastores

Get the ImageNet evaluation set from the public blob container `sampledata` on an account named `pipelinedata`. Create a datastore with the name `images_datastore`, which points to this container. In the call to `register_azure_blob_container` below, setting the `overwrite` flag to `True` overwrites any datastore that was created previously with that name. Then create input dataset and label dataset from batchscore_blob. For more information about Azure Machine Learning datasets (preview), see [create and access datasets (preview)](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-register-datasets).

This step can be changed to point to your blob container by providing your own `datastore_name`, `container_name`, and `account_name`.

```python
from azureml.core.dataset import Dataset
from azureml.data.datapath import DataPath

account_name = "pipelinedata"
datastore_name="images_datastore"
container_name="sampledata"

batchscore_blob = Datastore.register_azure_blob_container(ws, 
                      datastore_name=datastore_name, 
                      container_name= container_name, 
                      account_name=account_name, 
                      overwrite=True)

input_images_data_path = DataPath(batchscore_blob, 'batchscoring/images/ILSVRC*.JPEG')
input_images_dataset = Dataset.File.from_files(path=input_images_data_path).as_mount().as_named_input('input_images')

label_data_path = DataPath(batchscore_blob, 'batchscoring/labels/labels.txt')
label_dataset = Dataset.File.from_files(path=label_data_path).as_named_input('labels')
```

Next, specify the workspace default datastore as the output datastore, which you use for inference output.

When you create your workspace, [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) and [Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) are attached to the workspace by default. Azure Files is the default datastore for a workspace, but you can also use Blob storage as a datastore. For more information, see [Azure storage
options](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks).

```python
def_data_store = ws.get_default_datastore()
```

### Configure output directory

`PipelineData` objects are used for transferring intermediate data between pipeline steps. Use following code to create a PipelineData object for the batch inference output data.

```python
output_dir = PipelineData(name="scores", 
                          datastore=def_data_store, 
                          output_path_on_compute="batchscoring/results")
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
    
    # For a more detailed view of current Azure Machine Learning Compute  status, use get_status()
    print(gpu_cluster.get_status().serialize())
```

## Prepare the model

Before you can use the pre-trained model, you'll need to download the model and register it with your workspace.

### Download the pre-trained model

Download the pre-trained image classification model (InceptionV3) from <http://download.tensorflow.org/models/inception_v3_2016_08_28.tar.gz>, and then extract it to the `models` directory.

```python
# create directory for model
model_dir = 'models'
if not os.path.isdir(model_dir):
    os.mkdir(model_dir)
```
```python
import tarfile
import urllib.request

url="http://download.tensorflow.org/models/inception_v3_2016_08_28.tar.gz"
response = urllib.request.urlretrieve(url, "model.tar.gz")
tar = tarfile.open("model.tar.gz", "r:gz")
tar.extractall(model_dir)
```

### Register the model

Here's how to register the model:

```python
from azureml.core.model import Model

# register downloaded model 
model = Model.register(model_path = "models/inception_v3.ckpt",
                       model_name = "inception", # this is the name the model is registered as
                       tags = {'pretrained': "inception"},
                       description = "Imagenet trained tensorflow inception",
                       workspace = ws)
# remove the downloaded dir after registration if you wish
shutil.rmtree("models")
```

## Write your scoring script

>[!Warning]
>The following code is only a sample used by the [sample notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/pipeline-batch-scoring/notebooks/contrib/batch_inferencing/batch-parallel-imagenet-with-dataset.ipynb). You’ll need to create your own scoring script for your scenario.

The scoring script should contain two functions:
- `init()`: this function should be used for any costly or common preparation for subsequent inference, e.g. load the model into a global object.
- `run(input_data, arguments)`: this function will run for each mini_batch.
    - `input_data`: array of locally-accessible file paths.
    - `arguments`: arguments passed during pipeline run will be passed to this function. 
    - `run method response`: run() method should return an array.

```python
# Snippets from a sample scoring script
# Refer to the accompanying batch-parallel-imagenet-with-dataset Notebook
# https://github.com/Azure/MachineLearningNotebooks/blob/master/pipeline/batch-parallel-imagenet-with-dataset.ipynb
# for the implementation script

scripts_folder = "Code"

if not os.path.isdir(scripts_folder):
    os.mkdir(scripts_folder)

%%writefile $scripts_folder/batch_scoring.py

import os
import argparse
import datetime
import time
import tensorflow as tf
from math import ceil
import numpy as np
import shutil
from tensorflow.contrib.slim.python.slim.nets import inception_v3
from azureml.core.model import Model

slim = tf.contrib.slim

parser = argparse.ArgumentParser(description="Start a tensorflow model serving")
parser.add_argument('--model_name', dest="model_name", required=True)
parser.add_argument('--proc_unit', dest="proc_unit", type=int, required=True)

args, unknown_args = parser.parse_known_args()

image_size = 299
num_channel = 3


def get_class_label_dict(label_file):
    label = []
    proto_as_ascii_lines = tf.gfile.GFile(label_file).readlines()
    for l in proto_as_ascii_lines:
        label.append(l.rstrip())
    return label


class DataIterator:
    def __init__(self, file_paths):
        self.file_paths = file_paths
        self.labels = [1 for file_name in self.file_paths]

    @property
    def size(self):
        return len(self.labels)

    def input_pipeline(self, proc_unit):
        images_tensor = tf.convert_to_tensor(self.file_paths, dtype=tf.string)
        labels_tensor = tf.convert_to_tensor(self.labels, dtype=tf.int64)
        input_queue = tf.train.slice_input_producer([images_tensor, labels_tensor], shuffle=False)
        labels = input_queue[1]
        images_content = tf.read_file(input_queue[0])

        image_reader = tf.image.decode_jpeg(images_content, channels=num_channel, name="jpeg_reader")
        float_caster = tf.cast(image_reader, tf.float32)
        new_size = tf.constant([image_size, image_size], dtype=tf.int32)
        images = tf.image.resize_images(float_caster, new_size)
        images = tf.divide(tf.subtract(images, [0]), [255])

        image_batch, label_batch = tf.train.batch([images, labels], batch_size=proc_unit, capacity=5 * proc_unit)
        return image_batch

def init():
    global model_path
    global label_dict
    global classes_num
    global probabilities
    global input_images
    global g_tf_sess

    
    print(f'start init, {args.model_name} {args.proc_unit} {args.label_dir}')
    model_path = Model.get_model_path(args.model_name)
    label_file_name = Run.get_context().get_dataset_by_name("labels")
    label_dict = get_class_label_dict(label_file_name)
    classes_num = len(label_dict)
    
    with slim.arg_scope(inception_v3.inception_v3_arg_scope()):
        input_images = tf.placeholder(tf.float32, [args.proc_unit, image_size, image_size, num_channel])
        logits, _ = inception_v3.inception_v3(input_images,
                                              num_classes=classes_num,
                                              is_training=False)
        probabilities = tf.argmax(logits, 1)

    g_tf_sess = tf.Session()
    g_tf_sess.run(tf.global_variables_initializer())
    g_tf_sess.run(tf.local_variables_initializer())
    
    saver = tf.train.Saver()
    saver.restore(g_tf_sess, model_path)

def run(mini_batch):
    try:
        filepaths = mini_batch['filepath'].values.tolist()
        print(f'run method start: {__file__}, run({filepaths})')
        test_feeder = DataIterator(file_paths=filepaths)
        total_size = len(test_feeder.labels)
        count = 0
        labelslist = []

        tf.reset_default_graph()
        with tf.Session(config=tf.ConfigProto(device_count={'GPU': 0})) as sess:
        
            test_images = test_feeder.input_pipeline(batch_size=args.proc_unit)
            tf_coord = tf.train.Coordinator()
            threads = tf.train.start_queue_runners(sess=sess, coord=tf_coord)
            
            i = 0
            while count < total_size and not tf_coord.should_stop():
                print(f'start input data count:{count} total_size:{total_size}')
                start_time = time.time()
                test_images_batch = sess.run(test_images)
                # print duration of test batch, if necessary
                # print("--- test batch duration: %s seconds ---" % (time.time() - start_time))
                file_names_batch = test_feeder.file_paths[i * args.proc_unit:
                                                            min(test_feeder.size, (i + 1) * args.proc_unit)]
                start_time = time.time()
                results = g_tf_sess.run(probabilities, feed_dict={input_images: test_images_batch})
                # print duration of inference session, if necessary
                # print("---predictor data %s seconds ---" % (time.time() - start_time))
                new_add = min(args.proc_unit, total_size - count)
                count += new_add
                i += 1
                for j in range(new_add):
                    labelslist.append(os.path.basename(file_names_batch[j]) + ": " + label_dict[results[j]] + "\n")
            tf_coord.request_stop()
            tf_coord.join(threads)

        return labelslist
    
    except Exception as e:
        print(f'{__file__}:{e}')
        return []
```

## Build and run the batch inference pipeline

You have everything you need to build the pipeline. Let's pull all these together.

### Prepare the run environment

Specify the conda dependencies for your script. You'll need this object later, when you create the pipeline step.

```python
from azureml.pipeline.core.graph import PipelineParameter
proc_unit_param = PipelineParameter(name="param_proc_unit", default_value=20)

from azureml.core import Environment
from azureml.core.runconfig import DEFAULT_GPU_IMAGE

predict_conda_deps = CondaDependencies.create(pip_packages=["tensorflow-gpu==1.13.1", "azureml-defaults", "azure.storage.blob"])

predict_env = Environment(name="predict_environment")
predict_env.python.conda_dependencies = predict_conda_deps
predict_env.docker.enabled = True
predict_env.docker.gpu_support = True
predict_env.docker.base_image = DEFAULT_GPU_IMAGE
predict_env.spark.precache_packages = False

predict_env.python.conda_dependencies.add_pip_package("tensorflow-gpu==1.13.1")
predict_env.python.conda_dependencies.add_pip_package("azureml-defaults")
```

### Specify the parameter for your pipeline

Create the configuration to wrap the scoring script by using `ParallelRunConfig` object containing all the following parameters:
- `entry_script`: scoring script with local file path. If source_directly is present, use relative path, otherwise use any path accessible on machine.
- `mini_batch_size`: number of records scoring script can process in one inference call (optional, default value is 1).
- `error_threshold`: percentage of record failures can be ignored and processing should continue.
- `output_action`: one of the following values:
    - `summary_only`: scoring script will store the output and batch inference will use the output only for error threshold calculation.
    - `file`: for each input file, there will be a corresponding file with the same name in output folder.
    - `append_row`: for all input files, only one file will be created in output folder appending all outputs separated by line. File name will be parallel_run_step.txt.
- `source_directory`: supporting files for scoring (optional).
- `compute_target`: only AMLCompute is supported.
- `node_count`: number of compute nodes to be used.
- `environment` (optional).

```python
parallel_run_config = ParallelRunConfig(
    source_directory=scripts_folder,
    entry_script="batch_scoring.py",
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
- `inputs`: one or more Azure Machine Learning datasets.
- `refs`: one or more side inputs, e.g. labels.
- `output`: PipelineData object corresponding to the output directory.
- `arguments`: list of arguments passed to scoring script (optional).
- `allow_reuse`: if the inputs remain the same as a previous run, it will make the previous run results immediately available (optional, default value is True).

```python
parallelrun_step = ParallelRunStep(
    name="batch-scoring",
    models=[model],
    parallel_run_config=parallel_run_config,
    inputs=[input_images_dataset],
    refs = [label_dataset],
    output=output_dir,
    arguments=["--model_name", "inception",
               "--proc_unit", proc_unit_param,
               "--logging_level", "DEBUG"],
    allow_reuse=True
)
```

### Run the pipeline

At this point you can run the pipeline and examine the output it produced.

```python
pipeline = Pipeline(workspace=ws, steps=[parallelrun_step])
pipeline_run = Experiment(ws, 'batch_scoring').submit(pipeline)
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

