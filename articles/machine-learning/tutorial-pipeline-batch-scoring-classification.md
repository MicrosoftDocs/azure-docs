---
title: 'Tutorial: ML pipelines for batch scoring'
titleSuffix: Azure Machine Learning
description: In this tutorial, you build a machine learning pipeline to perform batch scoring on an image classification model. Azure Machine Learning allow you to focus on machine learning instead of infrastructure and automation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: trevorbye
ms.author: trbye
ms.reviewer: laobri
ms.date: 03/11/2020
ms.custom: contperfq4, tracking-python
---

# Tutorial: Build an Azure Machine Learning pipeline for batch scoring

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this advanced tutorial, you learn how to build a pipeline in Azure Machine Learning to run a batch scoring job. Machine learning pipelines optimize your workflow with speed, portability, and reuse, so you can focus on machine learning instead of infrastructure and automation. After you build and publish a pipeline, you configure a REST endpoint that you can use to trigger the pipeline from any HTTP library on any platform. 

The example uses a pretrained [Inception-V3](https://arxiv.org/abs/1512.00567) convolutional neural network model implemented in Tensorflow to classify unlabeled images. [Learn more about machine learning pipelines](concept-ml-pipelines.md).

In this tutorial, you complete the following tasks:

> [!div class="checklist"]
> * Configure workspace 
> * Download and store sample data
> * Create dataset objects to fetch and output data
> * Download, prepare, and register the model in your workspace
> * Provision compute targets and create a scoring script
> * Use the `ParallelRunStep` class for async batch scoring
> * Build, run, and publish a pipeline
> * Enable a REST endpoint for the pipeline

If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Prerequisites

* If you don't already have an Azure Machine Learning workspace or notebook virtual machine, complete [Part 1 of the setup tutorial](tutorial-1st-experiment-sdk-setup.md).
* When you finish the setup tutorial, use the same notebook server to open the *tutorials/machine-learning-pipelines-advanced/tutorial-pipeline-batch-scoring-classification.ipynb* notebook.

If you want to run the setup tutorial in your own [local environment](how-to-configure-environment.md#local), you can access the tutorial on [GitHub](https://github.com/Azure/MachineLearningNotebooks/tree/master/tutorials). Run `pip install azureml-sdk[notebooks] azureml-pipeline-core azureml-contrib-pipeline-steps pandas requests` to get the required packages.

## Configure workspace and create a datastore

Create a workspace object from the existing Azure Machine Learning workspace.

- A [workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) is a class that accepts your Azure subscription and resource information. The workspace also creates a cloud resource you can use to monitor and track your model runs. 
- `Workspace.from_config()` reads the `config.json` file and then loads the authentication details into an object named `ws`. The `ws` object is used in the code throughout this tutorial.

```python
from azureml.core import Workspace
ws = Workspace.from_config()
```

## Create a datastore for sample images

On the `pipelinedata` account, get the ImageNet evaluation public data sample from the `sampledata` public blob container. Call `register_azure_blob_container()` to make the data available to the workspace under the name `images_datastore`. Then, set the workspace default datastore as the output datastore. Use the output datastore to score output in the pipeline.

```python
from azureml.core.datastore import Datastore

batchscore_blob = Datastore.register_azure_blob_container(ws, 
                      datastore_name="images_datastore", 
                      container_name="sampledata", 
                      account_name="pipelinedata", 
                      overwrite=True)

def_data_store = ws.get_default_datastore()
```

## Create dataset objects

When building pipelines, `Dataset` objects are used for reading data from workspace datastores, and `PipelineData` objects are used for transferring intermediate data between pipeline steps.

> [!Important]
> The batch scoring example in this tutorial uses only one pipeline step. In use cases that have multiple steps, the typical flow will include these steps:
>
> 1. Use `Dataset` objects as *inputs* to fetch raw data, perform some transformation, and then *output* a `PipelineData` object.
>
> 2. Use the `PipelineData` *output object* in the preceding step as an *input object*. Repeat it for subsequent steps.

In this scenario, you create `Dataset` objects that correspond to the datastore directories for both the input images and the classification labels (y-test values). You also create a `PipelineData` object for the batch scoring output data.

```python
from azureml.core.dataset import Dataset
from azureml.pipeline.core import PipelineData

input_images = Dataset.File.from_files((batchscore_blob, "batchscoring/images/"))
label_ds = Dataset.File.from_files((batchscore_blob, "batchscoring/labels/*.txt"))
output_dir = PipelineData(name="scores", 
                          datastore=def_data_store, 
                          output_path_on_compute="batchscoring/results")
```

Next, register the datasets to the workspace.

```python

input_images = input_images.register(workspace = ws, name = "input_images")
label_ds = label_ds.register(workspace = ws, name = "label_ds")
```

## Download and register the model

Download the pretrained Tensorflow model to use it for batch scoring in a pipeline. First, create a local directory where you store the model. Then, download and extract the model.

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

Next, register the model to your workspace, so you can easily retrieve the model in the pipeline process. In the `register()` static function, the `model_name` parameter is the key you use to locate your model throughout the SDK.

```python
from azureml.core.model import Model
 
model = Model.register(model_path="models/inception_v3.ckpt",
                       model_name="inception",
                       tags={"pretrained": "inception"},
                       description="Imagenet trained tensorflow inception",
                       workspace=ws)
```

## Create and attach the remote compute target

Machine learning pipelines can't be run locally, so you run them on cloud resources or *remote compute targets*. A remote compute target is a reusable virtual compute environment where you run experiments and machine learning workflows. 

Run the following code to create a GPU-enabled [`AmlCompute`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py) target, and then attach it to your workspace. For more information about compute targets, see the [conceptual article](https://docs.microsoft.com/azure/machine-learning/concept-compute-target).


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

To do the scoring, create a batch scoring script called `batch_scoring.py`, and then write it to the current directory. The script takes input images, applies the classification model, and then outputs the predictions to a results file.

The `batch_scoring.py` script takes the following parameters, which get passed from the `ParallelRunStep` you create later:

- `--model_name`: The name of the model being used.
- `--labels_name`: The name of the `Dataset` that holds the `labels.txt` file.

The pipeline infrastructure uses the `ArgumentParser` class to pass parameters into pipeline steps. For example, in the following code, the first argument `--model_name` is given the property identifier `model_name`. In the `init()` function, `Model.get_model_path(args.model_name)` is used to access this property.


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

from azureml.core import Run
from azureml.core.model import Model
from azureml.core.dataset import Dataset

slim = tf.contrib.slim

image_size = 299
num_channel = 3


def get_class_label_dict():
    label = []
    proto_as_ascii_lines = tf.gfile.GFile("labels.txt").readlines()
    for l in proto_as_ascii_lines:
        label.append(l.rstrip())
    return label


def init():
    global g_tf_sess, probabilities, label_dict, input_images

    parser = argparse.ArgumentParser(description="Start a tensorflow model serving")
    parser.add_argument('--model_name', dest="model_name", required=True)
    parser.add_argument('--labels_name', dest="labels_name", required=True)
    args, _ = parser.parse_known_args()

    workspace = Run.get_context(allow_offline=False).experiment.workspace
    label_ds = Dataset.get_by_name(workspace=workspace, name=args.labels_name)
    label_ds.download(target_path='.', overwrite=True)

    label_dict = get_class_label_dict()
    classes_num = len(label_dict)

    with slim.arg_scope(inception_v3.inception_v3_arg_scope()):
        input_images = tf.placeholder(tf.float32, [1, image_size, image_size, num_channel])
        logits, _ = inception_v3.inception_v3(input_images,
                                              num_classes=classes_num,
                                              is_training=False)
        probabilities = tf.argmax(logits, 1)

    config = tf.ConfigProto()
    config.gpu_options.allow_growth = True
    g_tf_sess = tf.Session(config=config)
    g_tf_sess.run(tf.global_variables_initializer())
    g_tf_sess.run(tf.local_variables_initializer())

    model_path = Model.get_model_path(args.model_name)
    saver = tf.train.Saver()
    saver.restore(g_tf_sess, model_path)


def file_to_tensor(file_path):
    image_string = tf.read_file(file_path)
    image = tf.image.decode_image(image_string, channels=3)

    image.set_shape([None, None, None])
    image = tf.image.resize_images(image, [image_size, image_size])
    image = tf.divide(tf.subtract(image, [0]), [255])
    image.set_shape([image_size, image_size, num_channel])
    return image


def run(mini_batch):
    result_list = []
    for file_path in mini_batch:
        test_image = file_to_tensor(file_path)
        out = g_tf_sess.run(test_image)
        result = g_tf_sess.run(probabilities, feed_dict={input_images: [out]})
        result_list.append(os.path.basename(file_path) + ": " + label_dict[result[0]])
    return result_list
```

> [!TIP]
> The pipeline in this tutorial has only one step, and it writes the output to a file. For multi-step pipelines, you also use `ArgumentParser` to define a directory to write output data for input to subsequent steps. For an example of passing data between multiple pipeline steps by using the `ArgumentParser` design pattern, see the [notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/nyc-taxi-data-regression-model-building/nyc-taxi-data-regression-model-building.ipynb).

## Build the pipeline

Before you run the pipeline, create an object that defines the Python environment and creates the dependencies that your `batch_scoring.py` script requires. The main dependency required is Tensorflow, but you also install `azureml-defaults` for background processes. Create a `RunConfiguration` object by using the dependencies. Also, specify Docker and Docker-GPU support.

```python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.runconfig import DEFAULT_GPU_IMAGE

cd = CondaDependencies.create(pip_packages=["tensorflow-gpu==1.13.1", "azureml-defaults"])
env = Environment(name="parallelenv")
env.python.conda_dependencies = cd
env.docker.base_image = DEFAULT_GPU_IMAGE
```

### Create the configuration to wrap the script

Create the pipeline step using the script, environment configuration, and parameters. Specify the compute target you already attached to your workspace.

```python
from azureml.contrib.pipeline.steps import ParallelRunConfig

parallel_run_config = ParallelRunConfig(
    environment=env,
    entry_script="batch_scoring.py",
    source_directory=".",
    output_action="append_row",
    mini_batch_size="20",
    error_threshold=1,
    compute_target=compute_target,
    process_count_per_node=2,
    node_count=1
)
```

### Create the pipeline step

A pipeline step is an object that encapsulates everything you need to run a pipeline, including:

* Environment and dependency settings
* The compute resource to run the pipeline on
* Input and output data, and any custom parameters
* Reference to a script or SDK logic to run during the step

Multiple classes inherit from the parent class [`PipelineStep`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.builder.pipelinestep?view=azure-ml-py). You can choose classes to use specific frameworks or stacks to build a step. In this example, you use the `ParallelRunStep` class to define your step logic by using a custom Python script. If an argument to your script is either an input to the step or an output of the step, the argument must be defined *both* in the `arguments` array *and* in either the `input` or the `output` parameter, respectively. 

In scenarios where there is more than one step, an object reference in the `outputs` array becomes available as an *input* for a subsequent pipeline step.

```python
from azureml.contrib.pipeline.steps import ParallelRunStep

batch_score_step = ParallelRunStep(
    name="parallel-step-test",
    inputs=[input_images.as_named_input("input_images")],
    output=output_dir,
    models=[model],
    arguments=["--model_name", "inception",
               "--labels_name", "label_ds"],
    parallel_run_config=parallel_run_config,
    allow_reuse=False
)
```

For a list of all the classes you can use for different step types, see the [steps package](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps?view=azure-ml-py).

## Submit the pipeline

Now, run the pipeline. First, create a `Pipeline` object by using your workspace reference and the pipeline step you created. The `steps` parameter is an array of steps. In this case, there's only one step for batch scoring. To build pipelines that have multiple steps, place the steps in order in this array.

Next, use the `Experiment.submit()` function to submit the pipeline for execution. You also specify the custom parameter `param_batch_size`. The `wait_for_completion` function outputs logs during the pipeline build process. You can use the logs to see current progress.

> [!IMPORTANT]
> The first pipeline run takes roughly *15 minutes*. All dependencies must be downloaded, a Docker image is created, and the Python environment is provisioned and created. Running the pipeline again takes significantly less time because those resources are reused instead of created. However, total run time for the pipeline depends on the workload of your scripts and the processes that are running in each pipeline step.

```python
from azureml.core import Experiment
from azureml.pipeline.core import Pipeline

pipeline = Pipeline(workspace=ws, steps=[batch_score_step])
pipeline_run = Experiment(ws, 'batch_scoring').submit(pipeline)
pipeline_run.wait_for_completion(show_output=True)
```

### Download and review output

Run the following code to download the output file that's created from the `batch_scoring.py` script. Then, explore the scoring results.

```python
import pandas as pd

batch_run = next(pipeline_run.get_children())
batch_output = batch_run.get_output_data("scores")
batch_output.download(local_path="inception_results")

for root, dirs, files in os.walk("inception_results"):
    for file in files:
        if file.endswith("parallel_run_step.txt"):
            result_file = os.path.join(root, file)

df = pd.read_csv(result_file, delimiter=":", header=None)
df.columns = ["Filename", "Prediction"]
print("Prediction has ", df.shape[0], " rows")
df.head(10)
```

## Publish and run from a REST endpoint

Run the following code to publish the pipeline to your workspace. In your workspace in Azure Machine Learning studio, you can see metadata for the pipeline, including run history and durations. You can also run the pipeline manually from the studio.

Publishing the pipeline enables a REST endpoint that you can use to run the pipeline from any HTTP library on any platform.

```python
published_pipeline = pipeline_run.publish_pipeline(
    name="Inception_v3_scoring", description="Batch scoring using Inception v3 model", version="1.0")

published_pipeline
```

To run the pipeline from the REST endpoint, you need an OAuth2 Bearer-type authentication header. The following example uses interactive authentication (for illustration purposes), but for most production scenarios that require automated or headless authentication, use service principal authentication as [described in this article](how-to-setup-authentication.md).

Service principal authentication involves creating an *App Registration* in *Azure Active Directory*. First, you generate a client secret, and then you grant your service principal *role access* to your machine learning workspace. Use the [`ServicePrincipalAuthentication`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.authentication.serviceprincipalauthentication?view=azure-ml-py) class to manage your authentication flow. 

Both [`InteractiveLoginAuthentication`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.authentication.interactiveloginauthentication?view=azure-ml-py) and `ServicePrincipalAuthentication` inherit from `AbstractAuthentication`. In both cases, use the [`get_authentication_header()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.authentication.abstractauthentication?view=azure-ml-py#get-authentication-header--) function in the same way to fetch the header:

```python
from azureml.core.authentication import InteractiveLoginAuthentication

interactive_auth = InteractiveLoginAuthentication()
auth_header = interactive_auth.get_authentication_header()
```

Get the REST URL from the `endpoint` property of the published pipeline object. You can also find the REST URL in your workspace in Azure Machine Learning studio. 

Build an HTTP POST request to the endpoint. Specify your authentication header in the request. Add a JSON payload object that has the experiment name and the batch size parameter. As noted earlier in the tutorial, `param_batch_size` is passed through to your `batch_scoring.py` script because you defined it as a `PipelineParameter` object in the step configuration.

Make the request to trigger the run. Include code to access the `Id` key from the response dictionary to get the value of the run ID.

```python
import requests

rest_endpoint = published_pipeline.endpoint
response = requests.post(rest_endpoint, 
                         headers=auth_header, 
                         json={"ExperimentName": "batch_scoring",
                               "ParameterAssignments": {"param_batch_size": 50}})
run_id = response.json()["Id"]
```

Use the run ID to monitor the status of the new run. The new run takes another 10-15 min to finish. 

The new run will look similar to the pipeline you ran earlier in the tutorial. You can choose not to view the full output.

```python
from azureml.pipeline.core.run import PipelineRun
from azureml.widgets import RunDetails

published_pipeline_run = PipelineRun(ws.experiments["batch_scoring"], run_id)
RunDetails(published_pipeline_run).show()
```

## Clean up resources

Don't complete this section if you plan to run other Azure Machine Learning tutorials.

### Stop the compute instance

[!INCLUDE [aml-stop-server](../../includes/aml-stop-server.md)]

### Delete everything

If you don't plan to use the resources you created, delete them, so you don't incur any charges:

1. In the Azure portal, in the left menu, select **Resource groups**.
1. In the list of resource groups, select the resource group you created.
1. Select **Delete resource group**.
1. Enter the resource group name. Then, select **Delete**.

You can also keep the resource group but delete a single workspace. Display the workspace properties, and then select **Delete**.

## Next steps

In this machine learning pipelines tutorial, you did the following tasks:

> [!div class="checklist"]
> * Built a pipeline with environment dependencies to run on a remote GPU compute resource.
> * Created a scoring script to run batch predictions by using a pretrained Tensorflow model.
> * Published a pipeline and enabled it to be run from a REST endpoint.

For more examples of how to build pipelines by using the machine learning SDK, see the [notebook repository](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/machine-learning-pipelines).
