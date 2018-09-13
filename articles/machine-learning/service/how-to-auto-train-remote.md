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
# Train models automatically in the cloud

Azure Machine Learning can automatically train your model in several different environments. These environments, called compute targets, could be local or in the cloud. 


You easily scale up or scale out your machine learning experiment by adding additional compute targets such as Ubuntu-based Data Science Virtual Machine (DSVM). The DSVM is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured.  

In this article, you learn how to perform automated model selection on the DSVM.  

## How does remote differ from local?

The tutorial "[Automatically train a classification model](tutorial-auto-train-models.md)" teaches you how to use a local target for automated modeling.  The workflow when training locally also applies to  remote targets as well. 

This article explains the code needed to perform automated modeling on a remote DSVM instead.  The workspace object, `ws`, from the tutorial is used throughout the code here.

```python
ws = Workspace.from_config()
```

## Create resource

Create the DSVM in your workspace (`ws`) if it does not already exist. If the DSVM was previously created, this code skips the creation process and loads the existing resource detail into the `dsvm_compute` object.  

**Time estimate**: Creation of the VM takes approximately 5 minutes.

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

You can now use the `dsvm_compute` object as the remote compute target.

DSVM name restrictions include:
+ Must be shorter than 64 characters.  
+ Cannot include any of the following characters: 
  `\` ~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \\\\ | ; : \' \\" , < > / ?.`

>[!Warning]
>If creation fails with a message about Marketplace purchase eligibility:
>    1. Go to the [Azure portal](https://portal.azure.com)
>    1. Start creating a DSVM 
>    1. Select "Want to create programmatically" to enable programmatic creation
>    1. Exist without actually creating the VM
>    1. Rerun the creation code


## Configure resource

Configure the remote resource with the development environment needed to run your training code.  This includes:

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

You can now use the `run_config` object as the target for automatic training. 

## Access data

Provide the remote resource access to your training data.  

To provide access, you must:
+ Create a get_data.py file containing a `get_data()` function 
* Place that file in the root directory of the folder containing your scripts 

You can encapsulate code to read data from a blob storage or local disk in the get_data.py file. In the following code sample, the data comes from the sklearn package.


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

## Configure automatic training

Specify the settings for `AutoMLConfig`.  (See a [full list of parameters]() and their possible values.)

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

## Submit automatic training

Now submit the configuration to automatically select the algorithm, tune, and train the model. (Learn [more information about parameters]() for the `submit` method.)

```python
from azureml.core.experiment import Experiment
experiment=Experiment(ws, 'automl_remote')
remote_run = experiment.submit(automl_config, show_output=True)
```
You will see output similar to this:

    Running on remote compute: mydsvmParent Run ID: AutoML_015ffe76-c331-406d-9bfd-0fd42d8ab7f6
    ***********************************************************************************************
    ITERATION: The iteration being evaluated.
    PIPELINE:  A summary description of the pipeline being evaluated.
    DURATION: Time taken for the current iteration.
    METRIC: The result of computing score on the fitted pipeline.
    BEST: The best observed score thus far.
    ***********************************************************************************************
    
     ITERATION     PIPELINE                               DURATION                METRIC      BEST
             2      Standardize SGD classifier            0.0                      0.954     0.954
             7      Normalizer DT                         0.0                      0.161     0.954
             0      Scale MaxAbs 1 extra trees            0.0                      0.936     0.954
             4      Robust Scaler SGD classifier          0.0                      0.867     0.954
             1      Normalizer kNN                        0.0                      0.984     0.984
             9      Normalizer extra trees                0.0                      0.834     0.984
             5      Robust Scaler DT                      0.0                      0.736     0.984
             8      Standardize kNN                       0.0                      0.981     0.984
             6      Standardize SVM                       2.2                      0.984     0.984
            10      Scale MaxAbs 1 DT                     0.0                      0.077     0.984
            11      Standardize SGD classifier            0.0                      0.863     0.984
             3      Standardize gradient boosting         5.4                      0.971     0.984
            12      Robust Scaler logistic regression     2.0                      0.955     0.984
            14      Scale MaxAbs 1 SVM                    0.0                      0.989     0.989
            13      Scale MaxAbs 1 gradient boosting      3.4                      0.971     0.989
            15      Robust Scaler kNN                     0.0                      0.904     0.989
            17      Standardize kNN                       0.0                      0.974     0.989
            16      Scale 0/1 gradient boosting           2.8                      0.968     0.989
            18      Scale 0/1 extra trees                 0.0                      0.828     0.989
            19      Robust Scaler kNN                     0.0                      0.983     0.989


## Explore results

You can use the same Jupyter widget as the one in [this tutorial](tutorial-auto-train-models.md#explore-the-results) to see a graph and table of results.

```python
from azureml.train.widgets import RunDetails
RunDetails(remote_run).show()
```
Here is a static image of the widget.  In the notebook, you can click on any line in the table to see run properties and output logs for that run.   You can also use the dropdown above the graph to view a graph of each available metric for each iteration.

![widget table](./media/how-to-auto-train-remote/table.png)
![widget plot](./media/how-to-auto-train-remote/plot.png)


Find logs on the DSVM under /tmp/azureml_run/{iterationid}/azureml-logs

The widget displays a URL you can use to see and explore the individual run details.
 

## View status of DSVM
You can iterate through all runs in your experiment and view the DSVM status and run history.

```python
import azureml.core
import pandas as pd
from azureml.core.workspace import Workspace
from azureml.core.history import History
from azureml.core.run import Run
project_name = 'automl-remote' # Ensure this matches your project name

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

## Example

The `automl/03.auto-ml-remote-execution.ipynb` notebook demonstrates concepts in this article.  Get this notebook:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

Learn [how to configure settings for automatic training]().