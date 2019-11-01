---
title: Train deep learning neural network with Chainer 
titleSuffix: Azure Machine Learning
description: Learn how to run your PyTorch training scripts at enterprise scale using Azure Machine Learning's Chainer estimator class.  The example script classifies handwritten digit images to build a deep learning neural network using the Chainer Python library running on top of numpy. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: maxluk
author: maxluk
ms.reviewer: sdgilley
ms.date: 08/02/2019
#Customer intent: As a Python Chainer developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my deep learning models at scale. 
---

# Train and register Chainer models at scale with Azure Machine Learning
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, learn how to run your [Chainer](https://chainer.org/) training scripts at enterprise scale using Azure Machine Learning's [Chainer estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py) class. 
The example training script in this article uses the popular [MNIST dataset](http://yann.lecun.com/exdb/mnist/) to classify handwritten digits using a deep neural network (DNN) built using the Chainer Python library running on top of [numpy](https://www.numpy.org/).

Whether you're training a deep learning Chainer model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning. 

Learn more about [deep learning vs machine learning](concept-deep-learning-vs-machine-learning.md).

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Prerequisites

Run this code on either of these environments:

- Azure Machine Learning compute instance - no downloads or installation necessary

    - Complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples deep learning folder on the notebook server, find a completed notebook and files in the **how-to-use-azureml > ml-frameworks > chainer > deployment > train-hyperparameter-tune-deploy-with-chainer** folder.  The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

- Your own Jupyter Notebook server

    - [Install the Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).
    - [Create a workspace configuration file](how-to-configure-environment.md#workspace).
    - Download the sample script file [chainer_mnist.py](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-chainer/chainer_mnist.py).
     - You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/chainer/deployment/train-hyperparameter-tune-deploy-with-chainer/train-hyperparameter-tune-deploy-with-chainer.ipynb) of this guide on GitHub samples page. The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

## Set up the experiment

This section sets up the training experiment by loading the required python packages, initializing a workspace, creating an experiment, and uploading the training data and training scripts.

### Import packages

First, import the azureml.core Python library and display the version number.

```
# Check core SDK version number
import azureml.core

print("SDK version:", azureml.core.VERSION)
```

### Initialize a workspace

The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) object.

Create a workspace object by reading the `config.json` file created in the [prerequisites section](#prerequisites):

```Python
ws = Workspace.from_config()
```

### Create a project directory
Create a directory that will contain all the necessary code from your local machine that you will need access to on the remote resource. This includes the training script and any additional files your training script depends on.

```
import os

project_folder = './chainer-mnist'
os.makedirs(project_folder, exist_ok=True)
```

### Prepare training script

In this tutorial, the training script **chainer_mnist.py** is already provided for you. In practice, you should be able to take any custom training script as is and run it with Azure ML without having to modify your code.

To use Azure ML's tracking and metrics capabilities, add a small amount of Azure ML code inside your training script.  The training script **chainer_mnist.py** shows how to log some metrics to your Azure ML run using the `Run` object within the script.

The provided training script uses example data from the chainer `datasets.mnist.get_mnist` function.  For your own data, you may need to use steps such as [Upload dataset and scripts](how-to-train-keras.md#data-upload) to make data available during training.

Copy the training script **chainer_mnist.py** into your project directory.

```
import shutil

shutil.copy('chainer_mnist.py', project_folder)
```

### Create a deep learning experiment

Create an experiment. In this example, create an experiment called "chainer-mnist".

```
from azureml.core import Experiment

experiment_name = 'chainer-mnist'
experiment = Experiment(ws, name=experiment_name)
```


## Create or get a compute target

You need a [compute target](concept-compute-target.md) for training your model. In this example, you use Azure ML managed compute (AmlCompute) for your remote training compute resource.

**Creation of AmlCompute takes approximately 5 minutes**. If the AmlCompute with that name is already in your workspace, this code skips the creation process.  

```Python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# choose a name for your cluster
cluster_name = "gpu-cluster"

try:
    compute_target = ComputeTarget(workspace=ws, name=cluster_name)
    print('Found existing compute target.')
except ComputeTargetException:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_NC6', 
                                                           max_nodes=4)

    # create the cluster
    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

    compute_target.wait_for_completion(show_output=True)

# use get_status() to get a detailed status for the current cluster. 
print(compute_target.get_status().serialize())
```

For more information on compute targets, see the [what is a compute target](concept-compute-target.md) article.

## Create a Chainer estimator

The [Chainer estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py) provides a simple way of launching Chainer training jobs on your compute target.

The Chainer estimator is implemented through the generic [`estimator`](https://docs.microsoft.com//python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) class, which can be used to support any framework. For more information about training models using the generic estimator, see [train models with Azure Machine Learning using estimator](how-to-train-ml-models.md)

```Python
from azureml.train.dnn import Chainer

script_params = {
    '--epochs': 10,
    '--batchsize': 128,
    '--output_dir': './outputs'
}

estimator = Chainer(source_directory=project_folder, 
                    script_params=script_params,
                    compute_target=compute_target,
                    pip_packages=['numpy', 'pytest'],
                    entry_script='chainer_mnist.py',
                    use_gpu=True)
```

## Submit a run

The [Run object](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29?view=azure-ml-py) provides the interface to the run history while the job is running and after it has completed.

```Python
run = exp.submit(est)
run.wait_for_completion(show_output=True)
```

As the Run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the Chainer estimator. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the entry_script is executed. Outputs from stdout and the ./logs folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The ./outputs folder of the run is copied over to the run history.

## Save and register the model

Once you've trained the model, you can save and register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).


After the model training has completed, register the model to your workspace with the following code.  

```Python
model = run.register_model(model_name='chainer-dnn-mnist', model_path='outputs/model.npz')
```

> [!TIP]
> If you receive an error that the model is not found, give it a minute and try again.  Sometimes there is a slight lag between the end of the training run and the availability of the model in the outputs directory.

You can also download a local copy of the model. This can be useful for doing additional model validation work locally. In the training script, `chainer_mnist.py`, a saver object persists the model to a local folder (local to the compute target). You can use the Run object to download a copy from datastore.

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

In this article, you trained and registered a deep learning, neural network using Chainer on Azure Machine Learning. To learn how to deploy a model, continue on to our  [model deployment](how-to-deploy-and-where.md) article.

* [Tune hyperparameters](how-to-tune-hyperparameters.md)

* [Track run metrics during training](how-to-track-experiments.md)

* [View our reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
