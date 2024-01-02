---
title: Visualize experiments with TensorBoard
titleSuffix: Azure Machine Learning
description: Launch TensorBoard to visualize experiment job histories and identify potential areas for hyperparameter tuning and retraining.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: amipatel
author: amibp
ms.reviewer: ssalgado
ms.date: 10/21/2021
ms.topic: how-to
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022
---

[//]: # (needs PM review; Do URL Links names change if it includes 'Run')

# Visualize experiment jobs and metrics with TensorBoard and Azure Machine Learning

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, you learn how to view your experiment jobs and metrics in TensorBoard using [the `tensorboard` package](/python/api/azureml-tensorboard/) in the main Azure Machine Learning SDK. Once you've inspected your experiment jobs, you can better tune and retrain your machine learning models.

[TensorBoard](/python/api/azureml-tensorboard/azureml.tensorboard.tensorboard) is a suite of web applications for inspecting and understanding your experiment structure and performance.

How you launch TensorBoard with Azure Machine Learning experiments depends on the type of experiment:
+ If your experiment natively outputs log files that are consumable by TensorBoard, such as PyTorch, Chainer and TensorFlow experiments, then you can [launch TensorBoard directly](#launch-tensorboard) from experiment's job history. 

+ For experiments that don't natively output TensorBoard consumable files, such as like Scikit-learn or Azure Machine Learning experiments, use [the `export_to_tensorboard()` method](#option-2-export-history-as-log-to-view-in-tensorboard) to export the job histories as TensorBoard logs and launch TensorBoard from there. 

> [!TIP]
> The information in this document is primarily for data scientists and developers who want to monitor the model training process. If you are an administrator interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training jobs, or completed model deployments, see [Monitoring Azure Machine Learning](../monitor-azure-machine-learning.md).

## Prerequisites

* To launch TensorBoard and view your experiment job histories, your experiments need to have previously enabled logging to track its metrics and performance.  
* The code in this document can be run in either of the following environments: 
    * Azure Machine Learning compute instance - no downloads or installation necessary
        * Complete [Create resources to get started](../quickstart-create-resources.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
        * In the samples folder on the notebook server, find  two completed and expanded notebooks by navigating to these directories:
            * **SDK v1 > how-to-use-azureml > track-and-monitor-experiments > tensorboard > export-run-history-to-tensorboard > export-run-history-to-tensorboard.ipynb**
            * **SDK v1 > how-to-use-azureml > track-and-monitor-experiments > tensorboard > tensorboard > tensorboard.ipynb**
    * Your own Juptyer notebook server
       * [Install the Azure Machine Learning SDK](/python/api/overview/azure/ml/install) with the `tensorboard` extra
        * [Create an Azure Machine Learning workspace](../quickstart-create-resources.md).  
        * [Create a workspace configuration file](how-to-configure-environment.md).

## Option 1: Directly view job history in TensorBoard

This option works for experiments that natively outputs log files consumable by TensorBoard, such as PyTorch, Chainer, and TensorFlow experiments. If that is not the case of your experiment, use [the `export_to_tensorboard()` method](#option-2-export-history-as-log-to-view-in-tensorboard) instead.

The following example code uses the [MNIST demo experiment](https://raw.githubusercontent.com/tensorflow/tensorflow/r1.8/tensorflow/examples/tutorials/mnist/mnist_with_summaries.py) from TensorFlow's repository in a remote compute target, Azure Machine Learning Compute. Next, we will configure and start a job for training the TensorFlow model, and then
start TensorBoard against this TensorFlow experiment.

### Set experiment name and create project folder

Here we name the experiment and create its folder. 
 
```python
from os import path, makedirs
experiment_name = 'tensorboard-demo'

# experiment folder
exp_dir = './sample_projects/' + experiment_name

if not path.exists(exp_dir):
    makedirs(exp_dir)

```

### Download TensorFlow demo experiment code

TensorFlow's repository has an MNIST demo with extensive TensorBoard instrumentation. We do not, nor need to, alter any of this demo's code for it to work with Azure Machine Learning. In the following code, we download the MNIST code and save it in our newly created experiment folder.

```python
import requests
import os

tf_code = requests.get("https://raw.githubusercontent.com/tensorflow/tensorflow/r1.8/tensorflow/examples/tutorials/mnist/mnist_with_summaries.py")
with open(os.path.join(exp_dir, "mnist_with_summaries.py"), "w") as file:
    file.write(tf_code.text)
```
Throughout the MNIST code file, mnist_with_summaries.py, notice that there are lines that call `tf.summary.scalar()`,  `tf.summary.histogram()`, `tf.summary.FileWriter()` etc. These methods group, log, and tag key metrics of your experiments into job history. The `tf.summary.FileWriter()` is especially important as it serializes the data from your logged experiment metrics, which allows for TensorBoard to generate visualizations off of them.

 ### Configure experiment

In the following, we configure our experiment and set up directories for logs and data. These logs will be uploaded to the job history, which TensorBoard accesses later.

> [!Note]
> For this TensorFlow example, you will need to install TensorFlow on your local machine. Further, the TensorBoard module (that is, the one included with TensorFlow) must be accessible to this notebook's kernel, as the local machine is what runs TensorBoard.

```Python
import azureml.core
from azureml.core import Workspace
from azureml.core import Experiment

ws = Workspace.from_config()

# create directories for experiment logs and dataset
logs_dir = os.path.join(os.curdir, "logs")
data_dir = os.path.abspath(os.path.join(os.curdir, "mnist_data"))

if not path.exists(data_dir):
    makedirs(data_dir)

os.environ["TEST_TMPDIR"] = data_dir

# Writing logs to ./logs results in their being uploaded to the job history,
# and thus, made accessible to our TensorBoard instance.
args = ["--log_dir", logs_dir]

# Create an experiment
exp = Experiment(ws, experiment_name)
```

### Create a cluster for your experiment
We create an AmlCompute cluster for this experiment, however your experiments can be created in any environment and you are still able to launch TensorBoard against the experiment job history. 

```Python
from azureml.core.compute import ComputeTarget, AmlCompute

cluster_name = "cpu-cluster"

cts = ws.compute_targets
found = False
if cluster_name in cts and cts[cluster_name].type == 'AmlCompute':
   found = True
   print('Found existing compute target.')
   compute_target = cts[cluster_name]
if not found:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2', 
                                                           max_nodes=4)

    # create the cluster
    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

compute_target.wait_for_completion(show_output=True, min_node_count=None)

# use get_status() to get a detailed status for the current cluster. 
# print(compute_target.get_status().serialize())
```

### Configure and submit training job

Configure a training job by creating a ScriptRunConfig object.

```Python
from azureml.core import ScriptRunConfig
from azureml.core import Environment

# Here we will use the TensorFlow 2.2 curated environment
tf_env = Environment.get(ws, 'AzureML-TensorFlow-2.2-GPU')

src = ScriptRunConfig(source_directory=exp_dir,
                      script='mnist_with_summaries.py',
                      arguments=args,
                      compute_target=compute_target,
                      environment=tf_env)
run = exp.submit(src)
```

### Launch TensorBoard

You can launch TensorBoard during your run or after it completes. In the following, we create a TensorBoard object instance, `tb`, that takes the experiment job history loaded in the `job`, and then launches TensorBoard with the `start()` method. 
  
The [TensorBoard constructor](/python/api/azureml-tensorboard/azureml.tensorboard.tensorboard) takes an array of jobs, so be sure and pass it in as a single-element array.

```python
from azureml.tensorboard import Tensorboard

tb = Tensorboard([job])

# If successful, start() returns a string with the URI of the instance.
tb.start()

# After your job completes, be sure to stop() the streaming otherwise it will continue to run. 
tb.stop()
```

> [!Note]
> While this example used TensorFlow, TensorBoard can be used as easily with PyTorch or Chainer. TensorFlow must be available on the machine running TensorBoard, but is not necessary on the machine doing PyTorch or Chainer computations. 


## Option 2: Export history as log to view in TensorBoard

The following code sets up a sample experiment, begins the logging process using the Azure Machine Learning job history APIs, and exports the experiment job history into logs consumable by TensorBoard for visualization. 

### Set up experiment

The following code sets up a new experiment and names the job directory `root_run`. 

```python
from azureml.core import Workspace, Experiment
import azureml.core

# set experiment name and job name
ws = Workspace.from_config()
experiment_name = 'export-to-tensorboard'
exp = Experiment(ws, experiment_name)
root_run = exp.start_logging()
```

Here we load the diabetes dataset-- a built-in small dataset that comes with scikit-learn, and split it into test and training sets.

```Python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
X, y = load_diabetes(return_X_y=True)
columns = ['age', 'gender', 'bmi', 'bp', 's1', 's2', 's3', 's4', 's5', 's6']
x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
data = {
    "train":{"x":x_train, "y":y_train},        
    "test":{"x":x_test, "y":y_test}
}
```

### Run experiment and log metrics

For this code, we train a linear regression model and log key metrics, the alpha coefficient, `alpha`, and mean squared error, `mse`, in run history.

```Python
from tqdm import tqdm
alphas = [.1, .2, .3, .4, .5, .6 , .7]
# try a bunch of alpha values in a Linear Regression (aka Ridge regression) mode
for alpha in tqdm(alphas):
  # create child runs and fit lines for the resulting models
  with root_run.child_run("alpha" + str(alpha)) as run:
 
   reg = Ridge(alpha=alpha)
   reg.fit(data["train"]["x"], data["train"]["y"])    
 
   preds = reg.predict(data["test"]["x"])
   mse = mean_squared_error(preds, data["test"]["y"])
   # End train and eval

# log alpha, mean_squared_error and feature names in run history
   root_run.log("alpha", alpha)
   root_run.log("mse", mse)
```

### Export jobs to TensorBoard

With the SDK's [export_to_tensorboard()](/python/api/azureml-tensorboard/azureml.tensorboard.export) method, we can export the job history of our Azure machine learning experiment into TensorBoard logs, so we can view them via TensorBoard.  

In the following code, we create the folder `logdir` in our current working directory. This folder is where we will export our experiment job history and logs from `root_run` and then mark that job as completed. 

```Python
from azureml.tensorboard.export import export_to_tensorboard
import os

logdir = 'exportedTBlogs'
log_path = os.path.join(os.getcwd(), logdir)
try:
    os.stat(log_path)
except os.error:
    os.mkdir(log_path)
print(logdir)

# export job history for the project
export_to_tensorboard(root_run, logdir)

root_run.complete()
```

> [!Note]
> You can also export a particular run to TensorBoard by specifying the name of the run  `export_to_tensorboard(run_name, logdir)`

### Start and stop TensorBoard
Once our job history for this experiment is exported, we can launch TensorBoard with the [start()](/python/api/azureml-tensorboard/azureml.tensorboard.tensorboard#start-start-browser-false-) method. 

```Python
from azureml.tensorboard import Tensorboard

# The TensorBoard constructor takes an array of jobs, so be sure and pass it in as a single-element array here
tb = Tensorboard([], local_root=logdir, port=6006)

# If successful, start() returns a string with the URI of the instance.
tb.start()
```

When you're done, make sure to call the [stop()](/python/api/azureml-tensorboard/azureml.tensorboard.tensorboard#stop--) method of the TensorBoard object. Otherwise, TensorBoard will continue to run until you shut down the notebook kernel. 

```python
tb.stop()
```

## Next steps

In this how-to you, created two experiments and learned how to launch TensorBoard against their job histories to identify areas for potential tuning and retraining. 

* If you are satisfied with your model, head over to our [How to deploy a model](how-to-deploy-and-where.md) article. 
* Learn more about [hyperparameter tuning](../how-to-tune-hyperparameters.md).
