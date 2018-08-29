---
title: Set up compute targets for model training with Azure Machine Learning service | Microsoft Docs
description: This article explains how to automatically train your machine learning models on a DSVM remote compute target with Azure Machine Learning service
services: machine-learning
author: nacharya1
ms.author: nilesha
ms.reviewer: sgilley
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/24/2018
#Customer intent: As a professional data scientist, I can use Automated Machine Learning functionality to tune a model on a DSVM remote compute target.
---
# Automatically train a model in the cloud

Azure Machine Learning can automatically train your model in several different environments. These environments, called compute targets, could be local or in the cloud. You easily scale up or scale out your machine learning experiment by adding additional compute targets such as Ubuntu-based Data Science Virtual Machine (DSVM).

In this article, you'll learn about the DSVM compute target and how to use it.  

## How does remote differ from local?

The [Automatically train a classification model](tutorial-auto-train-models.md) tutorial shows how to use a local target for training.  The same workflow applies to training on remote targets as well. 

This article shows additional code necessary to perform automatic training on a DSVM instead of a local computer.  The workspace object, `ws`, from the tutorial is used throughout the code here.

```python
ws = Workspace.from_config()
```

## Create resource

The DSVM is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured.  

Create the DSVM in your workspace (`ws`) if it does not already exist. If already present, the code skips the creation process and loads the resource detail into the `dsvm_compute` object.  

Creation of the VM takes **approximately 5 minutes**.

```python
from azureml.core.compute import DsvmCompute

dsvm_name = 'mydsvm' #Name your DSVM
try:
    dsvm_compute = DsvmCompute(ws, dsvm_name)
    print('found existing dsvm.')
except:
    print('creating new dsvm.')
    dsvm_config = DsvmCompute.provisioning_configuration(vm_size = "Standard_D2_v2")
    dsvm_compute = DsvmCompute.create(ws, name = dsvm_name, provisioning_configuration = dsvm_config)
    dsvm_compute.wait_for_provisioning(show_output = True)
```
The `dsvm_compute` object can now be used to as the remote compute target.

Note:
* The DSVM name must be shorter than 64 characters.  
* The DSVM name may not include any of the following characters: 
    <code>` ~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \\\\ | ; : \' \\" , < > / ?.</code>
* If creation fails with a message about Marketplace purchase eligibility:
    1. Go to the [Azure portal](https://portal.azure.com)
    1. Start creating a DSVM 
    1. Select "Want to create programmatically" to enable programmatic creation
    1. Exist without actually creating the VM
    1. Rerun the creation code


## Configure resource

Configure the remote resource with the environment required to run your training code.  This includes:

* Any required `conda` or `pip` installs
* The compute target (`dsvm_compute`)
* Flag to automatically prepare the remote environment (set to `True`)
* An **aml_config** directory that includes a conda dependency file


```python
# create the directory if necessary
import os 
if not os.path.exists(project_folder): 
    os.makedirs(project_folder) 
    if not os.path.exists(project_folder + "/aml_config"): 
        os.makedirs(project_folder + "/aml_config")

# specify the dependencies
from azureml.core.runconfig import CondaDependencies
cd = CondaDependencies()
cd.add_conda_package(conda_package="numpy") 
cd.add_pip_package(pip_package="azureml-sdk[automl]")

# create the run configuration to use for remote training
from azureml.core.runconfig import RunConfiguration
run_config = RunConfiguration(conda_dependencies=cd) 
# set the target to dsvm_compute created above
run_config.target = dsvm_compute 
run_config.auto_prepare_environment = True 
# save the conda dependencies to the aml_config folder 
run_config.save(path = project_folder, name = dsvm_name)
```
The `run_config` object now can be used as the target for automatic training. 

## Access data

Provide the remote resource access to your training data.  To provide access:

* Create a **get_data.py** file containing a `get_data()` function. 
* Place the file in root directory of the project folder. 

You can encapsulate code to read data either from a blob storage or local disk in this file. In the code below, the data comes from the `sklearn` package.


```python
%%writefile $project_folder/get_data.py

from sklearn import datasets
from scipy import sparse
import numpy as np

def get_data():
    
    digits = datasets.load_digits()
    X_digits = digits.data[10:,:]
    y_digits = digits.target[10:]

    return { "X" : X_digits, "y" : y_digits }
```

## Configure AutoML

Now that the remote resource is ready, specify the settings for `AutoMLConfig`.  (See a [full list of parameters]() and their possible values.)

In the settings, `run_configuration` is set to the `run_config` object, which contains the settings and configuration for the DSVM.  

```python
from azureml.train.automl import AutoMLConfig
import time
import logging

automl_settings = {
    "name": "AutoML_Demo_Experiment_{0}".format(time.time()),
    "max_time_sec": 600,
    "iterations": 20,
    "n_cross_validations": 5,
    "primary_metric": 'AUC_weighted',
    "preprocess": False,
    "concurrent_iterations": 10,
    "verbosity": logging.INFO
}

automl_config = AutoMLConfig(task = 'classification',
                             debug_log = 'automl_errors.log',
                             path=project_folder,
                             run_configuration = run_config,
                             data_script = project_folder + "./get_data.py",
                             **automl_settings
                            )
```

## Automatic training

Now invoke the automatic training.   Call the `submit()` method with `automl_config`  train the model. 

```python
remote_run = experiment.submit(automl_config, show_output=True)
```
(Learn [more information about parameters]() for the `submit` method.)

## Explore results

As in the local compute tutorial, you can use a Jupyter widget to see a graph and table of results.
You can click on a pipeline to see run properties and output logs. 

Logs are also available on the DSVM under /tmp/azureml_run/{iterationid}/azureml-logs

Also notice the widget displays a link at the bottom. This links to a web page to explore the individual run details.
 
```python
from azureml.train.widgets import RunDetails
RunDetails(remote_run).show()
```


## View status of DSVM
You can iterate through all runs in your experiment and view the DSVM status and run history.

```python
import azureml.core
import pandas as pd
from azureml.core.workspace import Workspace
from azureml.core.history import History
from azureml.core.run import Run
project_name = 'automl-remote-dsvm' # Ensure this matches your project name

proj = History(ws, project_name)
summary_df = pd.DataFrame(index = ['Type', 'Status', 'Primary Metric', 'Iterations', 'Compute', 'Name'])
import re
pattern = re.compile('^AutoML_[^_]*$')
all_runs = list(proj.get_runs())
for run in all_runs:
    if(pattern.match(run.id)):
        properties = run.get_properties()
        amlsettings = eval(properties['RawAMLSettingsString'])
        summary_df[run.id] = [amlsettings['task_type'], run.get_details().status, properties['primary_metric'], properties['num_iterations'], properties['target'], amlsettings['name']]
    
from IPython.display import HTML
projname_html = HTML("<h3>{}</h3>".format(proj.name))

from IPython.display import display
display(projname_html)
display(summary_df.T)
```

## Get the notebook
You can [download the full notebook]() that shows remote automatic model training.