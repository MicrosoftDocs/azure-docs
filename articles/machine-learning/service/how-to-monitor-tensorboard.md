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

# Export run history to Tensorboard

In this article, you learn how to export your machine learning experiment run histories as TensorBoard logs using the [Azure Machine Learning service SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py). This allows you to visualize and inspect your experiment runs and graphs so you can tune and retrain your machine learning models.

Another way to visualixze and consume how to 
There are two functionalities that are made available with the tensorboard extra. 

1) exporting existing run histories of previously run experiments 
py torch

natively output into a tensorboard functionaloty and visualizations
deep learning popular deep learning 

set up less experience

pyTorch 1.1 writer
 and tensorflow 

scikit learn models into Tensorboard

2) all other azure machine learning jobs that track metrics in azure storage 
automl 
hyperdrive tuning 
are now convertible into Tensorboard
 
[TensorBoard](https://www.tensorflow.org/tensorboard/r1/overview) is a suite of web applications for inspecting and understand your TensorFlow runs and graphs.

## Prerequisites

* Use the Create a workspace article to
  * [Install the Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) with the `tensorboard` extra
  * Create a workspace and its configuration file (config.json)

## Local experiment and export to run history
### Create experiment
You can create your own experiment and log those runs and export that run history to view in Tensorboard so you can monitor its performance and go back and tune and re-train your models.

```python
from os import path, makedirs
experiment_name = 'tensorboard-demo'
# experiment folder
exp_dir = './sample_projects/' + experiment_name
if not path.exists(exp_dir):
    makedirs(exp_dir)
# runs we started in this session, for the finale
runs = []
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

# or export a particular run
# export_to_tensorboard(run, logdir)
root_run.complete()
```

### TensorFlow estimator

With the TensorFlow estimator you don't need to configure directories, all of this is done in the estimator parameters and your training script.

```Python
script_params = {"--log_dir": "./logs"}

# If you want the run to go longer, set --max-steps to a higher number.
# script_params["--max_steps"] = "5000"

tf_estimator = TensorFlow(source_directory=exp_dir,
                          compute_target=compute_target,
                          entry_script='mnist_with_summaries.py',
                          script_params=script_params)

run = exp.submit(tf_estimator)

runs.append(run)
```

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

existing use


## Next steps

* How to deploy a model
