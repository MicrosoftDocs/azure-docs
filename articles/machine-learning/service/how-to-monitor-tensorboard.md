---
title: How to monitor experiments with Tensorboard and Azure Machine Learning service
description: 
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: nibaccam
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 06/17/2019

---

# Monitor model performance with TensorBoard and Azure Machine Learning

In this article, you learn how to export your machine learning experiment run histories as TensorBoard logs using the [Azure Machine Learning service SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py). This allows you to visualize and inspect your experiment runs and metrics, so you can tune and retrain your machine learning models.

[TensorBoard](https://www.tensorflow.org/tensorboard/r1/overview) is a suite of web applications for inspecting and understanding your experiment structure and performance.

With the Azure Machine Learning SDK `tensorboard` extra, you can perform the following,    

* Launch Tensorboard from current run histories.

* Convert and export previous experiment run histories and view their performance via TensorBoard.

## Prerequisites

The code in this how-to can be run in either of the following environments: 

* Azure Machine Learning Notebook VM - no downloads or installation necessary

    * Complete the cloud-based notebook quickstart to create a dedicated notebook server pre-loaded with the SDK and the sample repository.

    * In the samples folder on the notebook server, find  two completed and expanded notebooks by navigating to this directory: **how-to-use-azureml > training-with-deep-learning**.
        * export-run-history-to-run-history.ipynb
        * tensorboard.ipynb

* Your own Juptyer notebook server
  * Use the [Create a workspace article](setup-create-workspace.md) to
      * [Install the Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) with the `tensorboard` extra
      * Create a workspace and its configuration file (config.json)

## Launch TensorBoard from run history

With the Azure Machine Learning `tensorboard` extra, you can export and visualize your experiment run history and performance in TensorBoard. This allows you to go back and tune and re-train your models. 

The following code sections set up an experiment, begins the logging process and then exports the experiment logs and run history to TensorBoard for visualizing. 

### Set up experiment

```python
from azureml.core import Workspace, Experiment
import azuremml.core

ws = Workspace.from_config()
experiment_name = 'export-to-tensorboard'
exp = Experiment(ws, experiment_name)
root_run = exp.start_logging()

# load diabetes dataset, a well-known built-in small dataset that comes with scikit-learn

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
### Create experiment and start logging
```python
from tqdm import tqdm
alphas = [.1, .2, .3, .4, .5, .6 , .7]
# try a bunch of alpha values in a Linear Regression (Ridge) mode
for alpha in tqdm(alphas):
  # create a bunch of child runs
  with root_run.child_run("alpha" + str(alpha)) as run
   # More data science stuff
   reg = Ridge(alpha=alpha)
   reg.fit(data["train"]["x"], data["train"]["y"])    
 
   preds = reg.predict(data["test"]["x"])
   mse = mean_squared_error(preds, data["test"]["y"])
   # End train and eval

# log alpha, mean_squared_error and feature names in run history
   root_run.log("alpha", alpha)
   root_run.log("mse", mse)
```

### Export runs to Tensorboard

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

# export run history for the project
export_to_tensorboard(root_run, logdir)

root_run.complete()
```

>[!Note]
 You can also export a particular run to Tensorboard by specifying the name of the run  `export_to_tensorboard(run, logdir)`

### Start and stop TensorBoard 

```python
from azureml.tensorboard import Tensorboard

# The Tensorboard constructor takes an array of runs, so be sure and pass it in as a single-element array here
tb = Tensorboard([], local_root=logdir, port=6006)

# If successful, start() returns a string with the URI of the instance.
tb.start()

# After your job completes, be sure to stop() the streaming otherwise it will continue to run. 
tb.stop()
```

## Export history from previous runs into TensorBoard

This can be done with experiments that were created using deep learning frameworks that natively support TensorBoard outputs, such as PyTorch, TensorFlow or Keras, in TensorBoard. 

PyTorch now supports Tensorboard
PyTorch 1.1

### Convert run histories

all other azure machine learning jobs that track metrics in automl, hyperdrive tuning are now convertible into Tensorboard consumable files.

existing run histories from previous runs

the [export_to_tensorboard()](https://docs.microsoft.com/python/api/azureml-tensorboard/azureml.tensorboard.export?view=azure-ml-py) method. 

The following example takes a scikit learn model and exports the run histories into Tensorboard

Scikit learn models for example do not 


### TensorFlow estimator

With the TensorFlow estimator you don't need to configure directories, all of this is done in the estimator parameters and your training script.

```Python
script_params = {"--log_dir": "./logs"}

# If you want the run to go longer, set --max-steps to a higher number.
# script_params["--max_steps"] = "5000"

pytorch_estimator = PyTorch(source_directory=exp_dir,
                          compute_target=compute_target,
                          entry_script='mnist_with_summaries.py',
                          script_params=script_params)

run = exp.submit(tf_estimator)

runs.append(run)
```
## Next steps

* How to deploy a model
