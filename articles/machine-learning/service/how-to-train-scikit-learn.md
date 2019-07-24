---
title: Train and register scikit-learn models
titleSuffix: Azure Machine Learning service
description: This article shows you how to train and register a scikit-learn model using Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: maxluk
author: maxluk
ms.date: 06/30/2019
ms.custom: seodec18
---

# Train and register Scikit-learn models at scale with Azure Machine Learning service

This article shows you how to train and register a Scikit-learn model using Azure Machine Learning service. It uses the popular [Iris dataset](https://archive.ics.uci.edu/ml/datasets/iris) to classify iris flower images with the custom [scikit-learn](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.sklearn.sklearn?view=azure-ml-py) class.

Scikit-learn is an open-source computational framework commonly used for machine learning. With Azure Machine Learning service, you can rapidly scale out open-source training jobs using elastic cloud compute resources. You can also track your training runs, version models, deploy models, and much more.

Whether you're developing a Scikit-learn model from the ground-up or you're bringing an existing model into the cloud, Azure Machine Learning service can help you build production-ready models.

## Prerequisites

Run this code on either of these environments:
 - Azure Machine Learning Notebook VM - no downloads or installation necessary

    - Complete the [cloud-based notebook quickstart](quickstart-run-cloud-notebook.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > training > train-hyperparameter-tune-deploy-with-sklearn** folder.

 - Your own Jupyter Notebook server

    - [Install the Azure Machine Learning SDK for Python](setup-create-workspace.md#sdk)
    - [Create a workspace configuration file](setup-create-workspace.md#write-a-configuration-file)
    - [Download the sample script file](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/train-hyperparameter-tune-deploy-with-sklearn) `train_iris.py`
    - You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-hyperparameter-tune-deploy-with-keras/train-hyperparameter-tune-deploy-with-sklearn.ipynb) of this guide on the GitHub samples page. The notebook includes an expanded section covering intelligent hyperparameter tuning and retrieving the best model by primary metrics.

## Set up the experiment

This section sets up the training experiment by loading the required python packages, initializing a workspace, creating an experiment, and uploading the training data and training scripts.

### Import packages

First, import the necessary Python libraries.

```Python
import os
import urllib
import shutil
import azureml

from azureml.core import Experiment
from azureml.core import Workspace, Run

from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException
```

### Initialize a workspace

The [Azure Machine Learning service workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
ws = Workspace.from_config()
```

### Create an experiment

Create an experiment and a folder to hold your training scripts. In this example, create an experiment called "sklearn-iris".

```Python
project_folder = './sklearn-iris'
os.makedirs(project_folder, exist_ok=True)

exp = Experiment(workspace=ws, name='sklearn-iris')
```

### Upload dataset and scripts

The [datastore](how-to-access-data.md) is a place where data can be stored and accessed by mounting or copying the data to the compute target. Each workspace provides a default datastore. Upload the data and training scripts to the datastore so that they can be easily accessed during training.

1. Create the directory for your data.

    ```Python
    os.makedirs('./data/iris', exist_ok=True)
    ```

1. Upload the iris dataset to the default datastore.

    ```Python
    ds = ws.get_default_datastore()
    ds.upload(src_dir='./data/iris', target_path='iris', overwrite=True, show_progress=True)
    ```

1. Upload the Scikit-learn training script, `train_iris.py`.

    ```Python
    shutil.copy('./train_iris.py', project_folder)
    ```

## Create or get a compute target

Create a compute target for your Scikit-learn job to run on. Scikit learn only supports single node, CPU computing.

The following code, creates an Azure Machine Learning managed compute (AmlCompute) for your remote training compute resource. Creation of AmlCompute takes approximately 5 minutes. If the AmlCompute with that name is already in your workspace, this code will skip the creation process.

```Python
cluster_name = "cpu-cluster"

try:
    compute_target = ComputeTarget(workspace=ws, name=cluster_name)
    print('Found existing compute target')
except ComputeTargetException:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2', 
                                                           max_nodes=4)

    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
```

For more information on compute targets, see the [what is a compute target](concept-compute-target.md) article.

## Create a Scikit-learn estimator

The [Scikit-learn estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) provides a simple way of launching a Scikit-learn training job on a compute target. It is implemented through the [`SKLearn`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.sklearn.sklearn?view=azure-ml-py) class, which can be used to support single-node CPU training.

If your training script needs additional pip or conda packages to run, you can have the packages installed on the resulting docker image by passing their names through the `pip_packages` and `conda_packages` arguments.

```Python
from azureml.train.sklearn import SKLearn

script_params = {
    '--kernel': 'linear',
    '--penalty': 1.0,
}

estimator = SKLearn(source_directory=project_folder, 
                    script_params=script_params,
                    compute_target=compute_target,
                    entry_script='train_iris.py'
                    pip_packages=['joblib']
                   )
```

## Submit a run

The [Run object](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29?view=azure-ml-py) provides the interface to the run history while the job is running and after it has completed.

```Python
run = experiment.submit(estimator)
run.wait_for_completion(show_output=True)
```

As the Run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the TensorFlow estimator. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the entry_script is executed. Outputs from stdout and the ./logs folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The ./outputs folder of the run is copied over to the run history.

## Save and register the model

Once you've trained the model, you can save and register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

Add the following code to your training script, train_iris.py, to save the model. 

``` Python
import joblib

joblib.dump(svm_model_linear, 'model.joblib')
```

Register the model to your workspace with the following code.

```Python
model = run.register_model(model_name='sklearn-iris', model_path='model.joblib')
```

## Next steps

In this article, you trained and registered a Scikit-learn model on Azure Machine Learning service.

* To learn how to deploy a model, continue on to our [model deployment](how-to-deploy-and-where.md) article.

* [Tune hyperparameters](how-to-tune-hyperparameters.md)

* [Track run metrics during training](how-to-track-experiments.md)