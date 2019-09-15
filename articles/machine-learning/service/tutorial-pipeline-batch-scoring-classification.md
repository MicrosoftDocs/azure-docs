---
title: 'Tutorial: Azure ML Pipelines for batch scoring'
titleSuffix: Azure Machine Learning
description: Build an ML pipeline for running batch scoring on an image classification model. Machine learning pipelines optimize your workflow with speed, portability, and reuse so you can focus on your expertise, machine learning, rather than on infrastructure and automation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: trevorbye
ms.author: trbye
ms.reviewer: trbye
ms.date: 09/05/2019
---

# Use Azure Machine Learning Pipelines for batch scoring

In this tutorial, you use Azure Machine Learning pipelines to run a batch scoring, or inference, job. This example job uses the pre-trained [Inception-V3](https://arxiv.org/abs/1512.00567) convolutional neural network Tensorflow model to classify unlabeled images. After building and publishing a pipeline, you'll configure a REST endpoint so you can trigger the pipeline from any HTTP library on any platform.

Machine learning pipelines optimize your workflow with speed, portability, and reuse so you can focus on your expertise, machine learning, rather than on infrastructure and automation. [Learn more about ML pipelines](concept-ml-pipelines.md).

In this tutorial you learn the following tasks:

> [!div class="checklist"]
> * Configure workspace and download sample data
> * Create data objects to fetch and output data
> * Download, prepare, and register the model to your workspace
> * Provision compute targets and create a scoring script
> * Build, run, and publish a pipeline
> * Enable a REST endpoint for the pipeline

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Prerequisites

* Complete [Part 1 of the setup tutorial](tutorial-1st-experiment-sdk-setup.md) if you don't already have an Azure Machine Learning workspace or notebook virtual machine.
* After you complete the setup tutorial, open the **tutorials/tutorial-pipeline-batch-scoring-classification.ipynb** notebook using the same notebook server.

This tutorial is also available on [GitHub](https://github.com/Azure/MachineLearningNotebooks/tree/master/tutorials) if you wish to run it in your own [local environment](how-to-configure-environment.md#local). Run `pip install azureml-sdk[notebooks] azureml-pipeline-core azureml-pipeline-steps pandas requests` to get the required packages.

## Configure workspace and create datastore

Create a workspace object from the existing Azure Machine Learning workspace. 
+ A [Workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) is a class that accepts your Azure subscription and resource information. It also creates a cloud resource to monitor and track your model runs. 

+ `Workspace.from_config()` reads the file **config.json** and loads the authentication details into an object named `ws`. `ws` is used throughout the rest of the code in this tutorial.

```python
from azureml.core import Workspace
ws = Workspace.from_config()
```

### Create a datastore for sample images

Get the ImageNet evaluation public data sample from the public blob container `sampledata` on the account `pipelinedata`. Calling `register_azure_blob_container()` makes the data available to the workspace under the name `images_datastore`. Then specify the workspace default datastore as the output datastore, which you use for scoring output in the pipeline.

```python
from azureml.core.datastore import Datastore

batchscore_blob = Datastore.register_azure_blob_container(ws, 
                      datastore_name="images_datastore", 
                      container_name="sampledata", 
                      account_name="pipelinedata", 
                      overwrite=True)

def_data_store = ws.get_default_datastore()
```

## Create data objects

When building pipelines, `DataReference` objects are used for reading data from workspace datastores, and `PipelineData` objects are used for transferring intermediate data between pipeline steps.

> [!Important]
> This batch scoring example only uses one pipeline step, but in use-cases with multiple steps, the typical flow will include:
>
> 1. Using `DataReference` objects as **inputs** to fetch raw data, performing some transformations, then **outputting** a `PipelineData` object.
>
> 2. Use the previous step's `PipelineData` **output object** as an *input object*, repeated for subsequent steps.

For this scenario you create `DataReference` objects corresponding to the datastore directories for both the input images and the classification labels (y-test values). You also create a `PipelineData` object for the batch scoring output data.

```python
from azureml.data.data_reference import DataReference
from azureml.pipeline.core import PipelineData

input_images = DataReference(datastore=batchscore_blob, 
                             data_reference_name="input_images",
                             path_on_datastore="batchscoring/images",
                             mode="download"
                            )

label_dir = DataReference(datastore=batchscore_blob, 
                          data_reference_name="input_labels",
                          path_on_datastore="batchscoring/labels",
                          mode="download"                          
                         )

output_dir = PipelineData(name="scores", 
                          datastore=def_data_store, 
                          output_path_on_compute="batchscoring/results")
```

## Download and register the model

Download the pre-trained Tensorflow model to use it for batch scoring in the pipeline. First create a local directory where you store the model, then download and extract it.

```python
import os
import tarfile
import urllib.request

if not os.path.isdir("models"):
    os.mkdir("models")
    
response = urllib.request.urlretrieve("http://download.tensorflow.org/models/inception_v3_2016_08_28.tar.gz", "model.tar.gz")
tar = tarfile.open("model.tar.gz", "r:gz")
tar.extractall("models")
```

Now you register the model to your workspace, which allows you to easily retrieve it in the pipeline process. In the `register()` static function, the `model_name` parameter is the key you use to locate your model throughout the SDK.

```python
from azureml.core.model import Model
 
model = Model.register(model_path="models/inception_v3.ckpt",
                       model_name="inception",
                       tags={"pretrained": "inception"},
                       description="Imagenet trained tensorflow inception",
                       workspace=ws)
```

## Create and attach remote compute target

Since ML pipelines cannot be run locally, you need to run them on cloud resources. We refer to these as remote compute targets, which are reusable virtual compute environments in which you run experiments and ML workflows. Run the following code to create a GPU-enabled [`AmlCompute`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py) target, and attach it to your workspace. See the [conceptual article](https://docs.microsoft.com/azure/machine-learning/service/concept-compute-target) for more information on compute targets.


```python
from azureml.core.compute import AmlCompute, ComputeTarget
from azureml.exceptions import ComputeTargetException
compute_name = "gpu-cluster"

# checks to see if compute target already exists in workspace, else create it
try:
    compute_target = ComputeTarget(workspace=ws, name=compute_name)
except ComputeTargetException:
    config = AmlCompute.provisioning_configuration(vm_size="STANDARD_NC6",
                                                   vm_priority="lowpriority", 
                                                   min_nodes=0, 
                                                   max_nodes=1)

    compute_target = ComputeTarget.create(workspace=ws, name=compute_name, provisioning_configuration=config)
    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
```

## Write a scoring script

To do the scoring, you create a batch scoring script `batch_scoring.py`, and write it to the current directory. The script takes input images, applies the classification model, and outputs the predictions to a results file.

The script `batch_scoring.py` takes the following parameters, which get passed from the pipeline step that you create later in this tutorial:

- `--model_name`: the name of the model being used
- `--label_dir` : the directory holding the `labels.txt` file 
- `--dataset_path`: the directory containing the input images
- `--output_dir` : the script will run the model on the data and output a `results-label.txt` to this directory
- `--batch_size` : the batch size used in running the model

The pipelines infrastructure uses the `ArgumentParser` class to pass parameters into pipeline steps. For example, in the code below the first argument `--model_name` is given the property identifier `model_name`. In the `main()` function, this property is accessed using `Model.get_model_path(args.model_name)`.


```python
%%writefile batch_scoring.py

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
parser.add_argument('--label_dir', dest="label_dir", required=True)
parser.add_argument('--dataset_path', dest="dataset_path", required=True)
parser.add_argument('--output_dir', dest="output_dir", required=True)
parser.add_argument('--batch_size', dest="batch_size", type=int, required=True)

args = parser.parse_args()

image_size = 299
num_channel = 3

# create output directory if it does not exist
os.makedirs(args.output_dir, exist_ok=True)


def get_class_label_dict(label_file):
    label = []
    proto_as_ascii_lines = tf.gfile.GFile(label_file).readlines()
    for l in proto_as_ascii_lines:
        label.append(l.rstrip())
    return label


class DataIterator:
    def __init__(self, data_dir):
        self.file_paths = []
        image_list = os.listdir(data_dir)
        self.file_paths = [data_dir + '/' + file_name.rstrip() for file_name in image_list]
        self.labels = [1 for file_name in self.file_paths]

    @property
    def size(self):
        return len(self.labels)

    def input_pipeline(self, batch_size):
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

        image_batch, label_batch = tf.train.batch([images, labels], batch_size=batch_size, capacity=5 * batch_size)
        return image_batch


def main(_):
    label_file_name = os.path.join(args.label_dir, "labels.txt")
    label_dict = get_class_label_dict(label_file_name)
    classes_num = len(label_dict)
    test_feeder = DataIterator(data_dir=args.dataset_path)
    total_size = len(test_feeder.labels)
    count = 0

    # get model from model registry
    model_path = Model.get_model_path(args.model_name)

    with tf.Session() as sess:
        test_images = test_feeder.input_pipeline(batch_size=args.batch_size)
        with slim.arg_scope(inception_v3.inception_v3_arg_scope()):
            input_images = tf.placeholder(tf.float32, [args.batch_size, image_size, image_size, num_channel])
            logits, _ = inception_v3.inception_v3(input_images,
                                                  num_classes=classes_num,
                                                  is_training=False)
            probabilities = tf.argmax(logits, 1)

        sess.run(tf.global_variables_initializer())
        sess.run(tf.local_variables_initializer())
        coord = tf.train.Coordinator()
        threads = tf.train.start_queue_runners(sess=sess, coord=coord)
        saver = tf.train.Saver()
        saver.restore(sess, model_path)
        out_filename = os.path.join(args.output_dir, "result-labels.txt")
        with open(out_filename, "w") as result_file:
            i = 0
            while count < total_size and not coord.should_stop():
                test_images_batch = sess.run(test_images)
                file_names_batch = test_feeder.file_paths[i * args.batch_size:
                                                          min(test_feeder.size, (i + 1) * args.batch_size)]
                results = sess.run(probabilities, feed_dict={input_images: test_images_batch})
                new_add = min(args.batch_size, total_size - count)
                count += new_add
                i += 1
                for j in range(new_add):
                    result_file.write(os.path.basename(file_names_batch[j]) + ": " + label_dict[results[j]] + "\n")
                result_file.flush()
            coord.request_stop()
            coord.join(threads)

        shutil.copy(out_filename, "./outputs/")

if __name__ == "__main__":
    tf.app.run()

```

> [!TIP]
> The pipeline in this tutorial only has one step and writes the output to a file, but for multi-step pipelines, you also use `ArgumentParser` to define a directory to write output data for input to subsequent steps. See the [notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/nyc-taxi-data-regression-model-building/nyc-taxi-data-regression-model-building.ipynb) for an example of passing data between multiple pipeline steps using the `ArgumentParser` design pattern.

## Build and run the pipeline

Before running the pipeline, you create an object that defines the python environment and dependencies needed by your script `batch_scoring.py`. The main dependency required is Tensorflow, but you also install `azureml-defaults` for background processes from the SDK. Create a `RunConfiguration` object using the dependencies, and also specify Docker and Docker-GPU support.

```python
from azureml.core.runconfig import DEFAULT_GPU_IMAGE
from azureml.core.runconfig import CondaDependencies, RunConfiguration

cd = CondaDependencies.create(pip_packages=["tensorflow-gpu==1.13.1", "azureml-defaults"])

amlcompute_run_config = RunConfiguration(conda_dependencies=cd)
amlcompute_run_config.environment.docker.enabled = True
amlcompute_run_config.environment.docker.base_image = DEFAULT_GPU_IMAGE
amlcompute_run_config.environment.spark.precache_packages = False
```

### Parameterize the pipeline

Define a custom parameter for the pipeline to control the batch size. After the pipeline has been published and exposed via a REST endpoint, any configured parameters are also exposed and can be specified in the JSON payload when rerunning the pipeline with an HTTP request.

Create a `PipelineParameter` object to enable this behavior, and define a name and default value.

```python
from azureml.pipeline.core.graph import PipelineParameter
batch_size_param = PipelineParameter(name="param_batch_size", default_value=20)
```

### Create the pipeline step

A pipeline step is an object that encapsulates everything you need for running a pipeline including:

* environment and dependency settings
* the compute resource to run the pipeline on
* input and output data, and any custom parameters
* reference to a script or SDK-logic to run during the step

There are multiple classes that inherit from the parent class [`PipelineStep`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.builder.pipelinestep?view=azure-ml-py) to assist with building a step using certain frameworks and stacks. In this example, you use the [`PythonScriptStep`](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep?view=azure-ml-py) class to define your step logic using a custom python script. Note that if an argument to your script is either an input to the step or output of the step, it must be defined **both** in the `arguments` array, **as well as** in either the `input` or `output` parameter, respectively. 

An object reference in the `outputs` array becomes available as an **input** for a subsequent pipeline step, for scenarios where there is more than one step.

```python
from azureml.pipeline.steps import PythonScriptStep

batch_score_step = PythonScriptStep(
    name="batch_scoring",
    script_name="batch_scoring.py",
    arguments=["--dataset_path", input_images, 
               "--model_name", "inception",
               "--label_dir", label_dir, 
               "--output_dir", output_dir, 
               "--batch_size", batch_size_param],
    compute_target=compute_target,
    inputs=[input_images, label_dir],
    outputs=[output_dir],
    runconfig=amlcompute_run_config
)
```

For a list of all classes for different step types, see the [steps package](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps?view=azure-ml-py).

### Run the pipeline

Now you run the pipeline. First create a `Pipeline` object with your workspace reference and the pipeline step you created. The `steps` parameter is an array of steps, and in this case there is only one step for batch scoring. To build pipelines with multiple steps, you place the steps in order in this array.

Next use the `Experiment.submit()` function to submit the pipeline for execution. You also specify the custom parameter `param_batch_size`. The `wait_for_completion` function will output logs during the pipeline build process, which allows you to see current progress.

> [!IMPORTANT]
> The first pipeline run takes roughly **15 minutes**, as all dependencies must be downloaded, a Docker image is created, and the Python environment is provisioned/created. Running it again takes significantly less time as those resources are reused. However, total run time depends on the workload of your scripts and processes running in each pipeline step.

```python
from azureml.core import Experiment
from azureml.pipeline.core import Pipeline

pipeline = Pipeline(workspace=ws, steps=[batch_score_step])
pipeline_run = Experiment(ws, 'batch_scoring').submit(pipeline, pipeline_parameters={"param_batch_size": 20})
pipeline_run.wait_for_completion(show_output=True)
```

### Download and review output

Run the following code to download the output file created from the `batch_scoring.py` script, then explore the scoring results.

```python
import pandas as pd

step_run = list(pipeline_run.get_children())[0]
step_run.download_file("./outputs/result-labels.txt")

df = pd.read_csv("result-labels.txt", delimiter=":", header=None)
df.columns = ["Filename", "Prediction"]
df.head(10)
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Filename</th>
      <th>Prediction</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>ILSVRC2012_val_00000102.JPEG</td>
      <td>Rhodesian ridgeback</td>
    </tr>
    <tr>
      <td>1</td>
      <td>ILSVRC2012_val_00000103.JPEG</td>
      <td>tripod</td>
    </tr>
    <tr>
      <td>2</td>
      <td>ILSVRC2012_val_00000104.JPEG</td>
      <td>typewriter keyboard</td>
    </tr>
    <tr>
      <td>3</td>
      <td>ILSVRC2012_val_00000105.JPEG</td>
      <td>silky terrier</td>
    </tr>
    <tr>
      <td>4</td>
      <td>ILSVRC2012_val_00000106.JPEG</td>
      <td>Windsor tie</td>
    </tr>
    <tr>
      <td>5</td>
      <td>ILSVRC2012_val_00000107.JPEG</td>
      <td>harvestman</td>
    </tr>
    <tr>
      <td>6</td>
      <td>ILSVRC2012_val_00000108.JPEG</td>
      <td>violin</td>
    </tr>
    <tr>
      <td>7</td>
      <td>ILSVRC2012_val_00000109.JPEG</td>
      <td>loudspeaker</td>
    </tr>
    <tr>
      <td>8</td>
      <td>ILSVRC2012_val_00000110.JPEG</td>
      <td>apron</td>
    </tr>
    <tr>
      <td>9</td>
      <td>ILSVRC2012_val_00000111.JPEG</td>
      <td>American lobster</td>
    </tr>
  </tbody>
</table>
</div>

## Publish and run from REST endpoint

Run the following code to publish the pipeline to your workspace. In your workspace in the portal, you can see metadata for the pipeline including run history and durations. You can also run the pipeline manually from the portal.

Additionally, publishing the pipeline enables a REST endpoint to rerun the pipeline from any HTTP library on any platform.

```python
published_pipeline = pipeline_run.publish_pipeline(
    name="Inception_v3_scoring", description="Batch scoring using Inception v3 model", version="1.0")

published_pipeline
```

To run the pipeline from the REST endpoint, you first need an OAuth2 Bearer-type authentication header. This example uses interactive authentication for illustration purposes, but for most production scenarios requiring automated or headless authentication, use service principle authentication as [described in this notebook](https://aka.ms/pl-restep-auth).

Service principle authentication involves creating an **App Registration** in **Azure Active Directory**, generating a client secret, and then granting your service principal **role access** to your machine learning workspace. You then use the [`ServicePrincipalAuthentication`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.authentication.serviceprincipalauthentication?view=azure-ml-py) class to manage your auth flow. 

Both `InteractiveLoginAuthentication` and `ServicePrincipalAuthentication` inherit from `AbstractAuthentication`, and in both cases you use the `get_authentication_header()` function in the same way to fetch the header.

```python
from azureml.core.authentication import InteractiveLoginAuthentication

interactive_auth = InteractiveLoginAuthentication()
auth_header = interactive_auth.get_authentication_header()
```

Get the REST url from the `endpoint` property of the published pipeline object. You can also find the REST url in your workspace in the portal. Build an HTTP POST request to the endpoint, specifying your authentication header. Additionally, add a JSON payload object with the experiment name and the batch size parameter. As a reminder, the `param_batch_size` is passed through to your `batch_scoring.py` script because you defined it as a `PipelineParameter` object in the step configuration.

Make the request to trigger the run. Access the `Id` key from the response dictionary to get the value of the run id.

```python
import requests

rest_endpoint = published_pipeline.endpoint
response = requests.post(rest_endpoint, 
                         headers=auth_header, 
                         json={"ExperimentName": "batch_scoring",
                               "ParameterAssignments": {"param_batch_size": 50}})
run_id = response.json()["Id"]
```

Use the run ID to monitor the status of the new run. This will take another 10-15 min to run and will look similar to the previous pipeline run, so if you don't need to see another pipeline run, you can skip watching the full output.

```python
from azureml.pipeline.core.run import PipelineRun
from azureml.widgets import RunDetails

published_pipeline_run = PipelineRun(ws.experiments["batch_scoring"], run_id)
RunDetails(published_pipeline_run).show()
```

## Clean up resources

Do not complete this section if you plan on running other Azure Machine Learning tutorials.

### Stop the notebook VM

If you used a cloud notebook server, stop the VM when you are not using it to reduce cost.

1. In your workspace, select **Notebook VMs**.
1. From the list, select the VM.
1. Select **Stop**.
1. When you're ready to use the server again, select **Start**.

### Delete everything

If you don't plan to use the resources you created, delete them, so you don't incur any charges.

1. In the Azure portal, select **Resource groups** on the far left.
1. From the list, select the resource group you created.
1. Select **Delete resource group**.
1. Enter the resource group name. Then select **Delete**.

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this machine learning pipelines tutorial, you did the following tasks:

> [!div class="checklist"]
> * Built a pipeline with environment dependencies to run on a remote GPU compute resource
> * Created a scoring script to run batch predictions with a pre-trained Tensorflow model
> * Published a pipeline and enabled it to be run from a REST endpoint

See the [notebook repository](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/machine-learning-pipelines) for additional examples of building pipelines with the machine learning SDK.
