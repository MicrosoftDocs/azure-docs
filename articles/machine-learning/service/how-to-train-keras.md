---
title: Train and register Keras models running on TensorFlow
titleSuffix: Azure Machine Learning service
description: This article shows you how to train and register a Keras model running on TensorFlow using Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: maxluk
author: maxluk
ms.reviewer: peterlu
ms.date: 06/07/2019
ms.custom: seodec18
---

# Train and register Keras models at scale with Azure Machine Learning service

This article shows you how to train and register a Keras model built on TensorFlow using Azure Machine Learning service. It uses the popular [MNIST dataset](http://yann.lecun.com/exdb/mnist/) to classify handwritten digits using a deep neural network (DNN) built using the [Keras Python library](https://keras.io) running on top of [TensorFlow](https://www.tensorflow.org/overview).

Keras is a high-level neural network API capable of running top of other popular DNN frameworks to simplify development. With Azure Machine Learning service, you can rapidly scale out training jobs using elastic cloud compute resources. You can also track your training runs, version models, deploy models, and much more.

Whether you're developing a Keras model from the ground-up or you're bringing an existing model into the cloud, Azure Machine Learning service can help you build production-ready models.

## Prerequisites

Run this code on either of these environments:

 - Azure Machine Learning Notebook VM - no downloads or installation necessary

     - Complete the [cloud-based notebook quickstart](quickstart-run-cloud-notebook.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > training-with-deep-learning > train-hyperparameter-tune-deploy-with-keras** folder. 
 
 - Your own Jupyter Notebook server

     - [Install the Azure Machine Learning SDK for Python](setup-create-workspace.md#sdk)
    - [Create a workspace configuration file](setup-create-workspace.md#write-a-configuration-file)
    - [Download the sample script files](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras) `mnist-keras.py` and `utils.py`
     
    You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras/train-hyperparameter-tune-deploy-with-keras.ipynb) of this guide on the GitHub samples page. The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

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

Create an experiment and a folder to hold your training scripts. In this example, create an experiment called "keras-mnist".

```Python
script_folder = './keras-mnist'
os.makedirs(script_folder, exist_ok=True)

exp = Experiment(workspace=ws, name='keras-mnist')
```

### Upload dataset and scripts

The [datastore](how-to-access-data.md) is a place where data can be stored and accessed by mounting or copying the data to the compute target. Each workspace provides a default datastore. Upload the data and training scripts to the datastore so that they can be easily accessed during training.

1. Download the MNIST dataset locally.

    ```Python
    os.makedirs('./data/mnist', exist_ok=True)

    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz', filename = './data/mnist/train-images.gz')
    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz', filename = './data/mnist/train-labels.gz')
    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz', filename = './data/mnist/test-images.gz')
    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz', filename = './data/mnist/test-labels.gz')
    ```

1. Upload the MNIST dataset to the default datastore.

    ```Python
    ds = ws.get_default_datastore()
    ds.upload(src_dir='./data/mnist', target_path='mnist', overwrite=True, show_progress=True)
    ```

1. Upload the Keras training script, `keras_mnist.py`, and the helper file, `utils.py`.

    ```Python
    shutil.copy('./keras_mnist.py', script_folder)
    shutil.copy('./utils.py', script_folder)
    ```

## Create a compute target

Create a compute target for your TensorFlow job to run on. In this example, create a GPU-enabled Azure Machine Learning compute cluster.

```Python
cluster_name = "gpucluster"

try:
    compute_target = ComputeTarget(workspace=ws, name=cluster_name)
    print('Found existing compute target')
except ComputeTargetException:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_NC6', 
                                                           max_nodes=4)

    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
```

For more information on compute targets, see the [what is a compute target](concept-compute-target.md) article.

## Create a TensorFlow estimator and import Keras

The [TensorFlow estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) provides a simple way of launching TensorFlow training jobs on compute target. Since Keras runs on top of TensorFlow, you can use the TensorFlow estimator and import the Keras library using the `pip_packages` argument.

The TensorFlow estimator is implemented through the generic [`estimator`](https://docs.microsoft.com//python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) class, which can be used to support any framework. For more information about training models using the generic estimator, see [train models with Azure Machine Learning using estimator](how-to-train-ml-models.md)

```Python
script_params = {
    '--data-folder': ds.path('mnist').as_mount(),
    '--batch-size': 50,
    '--first-layer-neurons': 300,
    '--second-layer-neurons': 100,
    '--learning-rate': 0.001
}

est = TensorFlow(source_directory=script_folder,
                 entry_script='keras_mnist.py',
                 script_params=script_params,
                 compute_target=compute_target,
                 pip_packages=['keras', 'matplotlib'],
                 use_gpu=True)
```

## Submit a run

The [Run object](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29?view=azure-ml-py) provides the interface to the run history while the job is running and after it has completed.

```Python
run = exp.submit(est)
run.wait_for_completion(show_output=True)
```

As the Run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the TensorFlow estimator. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the entry_script is executed. Outputs from stdout and the ./logs folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The ./outputs folder of the run is copied over to the run history.

## Register the model

Once you've trained the model, you can register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

```Python
model = run.register_model(model_name='keras-dnn-mnist', model_path='outputs/model')
```

You can also download a local copy of the model. This can be useful for doing additional model validation work locally. In the training script, `mnist-keras.py`, a TensorFlow saver object persists the model to a local folder (local to the compute target). You can use the Run object to download a copy from datastore.

```Python
# Create a model folder in the current directory
os.makedirs('./model', exist_ok=True)

for f in run.get_file_names():
    if f.startswith('outputs/model'):
        output_file_path = os.path.join('./model', f.split('/')[-1])
        print('Downloading from {} to {} ...'.format(f, output_file_path))
        run.download_file(name=f, output_file_path=output_file_path)
```

## Next steps

In this article, you trained and registered a Keras model on Azure Machine Learning service. To learn how to deploy a model, continue on to our model deployment article.

> [!div class="nextstepaction"]
> [How and where to deploy models](how-to-deploy-and-where.md)
