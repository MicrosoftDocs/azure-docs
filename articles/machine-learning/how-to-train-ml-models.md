---
title: Train ML models with estimators
titleSuffix: Azure Machine Learning
description: Learn how to perform single-node and distributed training of traditional machine learning and deep learning models using Azure Machine Learning Estimator class
ms.author: maxluk
author: maxluk
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.date: 11/08/2019
ms.custom: seodec18

---

# Train models with Azure Machine Learning using estimator
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

With Azure Machine Learning, you can easily submit your training script to [various compute targets](how-to-set-up-training-targets.md#compute-targets-for-training), using a [RunConfiguration object](how-to-set-up-training-targets.md#whats-a-run-configuration) and a [ScriptRunConfig object](how-to-set-up-training-targets.md#submit). That pattern gives you a lot of flexibility and maximum control.

To facilitate deep learning model training, the Azure Machine Learning Python SDK provides an alternative higher-level abstraction, the estimator class, which allows users to easily construct run configurations. You can create and use a generic [Estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator?view=azure-ml-py) to submit training script using any learning framework you choose (such as scikit-learn) on any compute target you choose, whether it's your local machine, a single VM in Azure, or a GPU cluster in Azure. For PyTorch, TensorFlow and Chainer tasks, Azure Machine Learning also provides respective [PyTorch](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch?view=azure-ml-py), [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py), and [Chainer](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py) estimators to simplify using these frameworks.

## Train with an estimator

Once you've created your [workspace](concept-workspace.md) and set up your [development environment](how-to-configure-environment.md), training a model in Azure Machine Learning involves the following steps:  
1. Create a [remote compute target](how-to-set-up-training-targets.md) (note you can also use local computer as compute target)
2. Upload your [training data](how-to-access-data.md) to datastore (Optional)
3. Create your [training script](tutorial-train-models-with-aml.md#create-a-training-script)
4. Create an `Estimator` object
5. Submit the estimator to an experiment object under the workspace

This article focuses on steps 4-5. For steps 1-3, refer to the [train a model tutorial](tutorial-train-models-with-aml.md) for an example.

### Single-node training

Use an `Estimator` for a single-node training run on remote compute in Azure for a scikit-learn model. You should have already created your [compute target](how-to-set-up-training-targets.md#amlcompute) object `compute_target` and your [datastore](how-to-access-data.md) object `ds`.

```Python
from azureml.train.estimator import Estimator

script_params = {
    # to mount files referenced by mnist dataset
    '--data-folder': ds.as_named_input('mnist').as_mount(),
    '--regularization': 0.8
}

sk_est = Estimator(source_directory='./my-sklearn-proj',
                   script_params=script_params,
                   compute_target=compute_target,
                   entry_script='train.py',
                   conda_packages=['scikit-learn'])
```

This code snippet specifies the following parameters to the `Estimator` constructor.

Parameter | Description
--|--
`source_directory`| Local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute.
`script_params`| Dictionary specifying the command-line arguments to pass to your training script `entry_script`, in the form of `<command-line argument, value>` pairs. To specify a verbose flag in `script_params`, use `<command-line argument, "">`.
`compute_target`| Remote compute target that your training script will run on, in this case an Azure Machine Learning Compute ([AmlCompute](how-to-set-up-training-targets.md#amlcompute)) cluster. (Note even though AmlCompute cluster is the commonly used target, it is also possible to choose other compute target types such as Azure VMs or even local computer.)
`entry_script`| Filepath (relative to the `source_directory`) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder.
`conda_packages`| List of Python packages to be installed via conda needed by your training script.  

The constructor has another parameter called `pip_packages` that you use for any pip packages needed.

Now that you've created your `Estimator` object, submit the training job to be run on the remote compute with a call to the `submit` function on your [Experiment](concept-azure-machine-learning-architecture.md#experiments) object `experiment`. 

```Python
run = experiment.submit(sk_est)
print(run.get_portal_url())
```

> [!IMPORTANT]
> **Special Folders**
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, when you write files to folders named *outputs* and *logs* that are relative to the root directory (`./outputs` and `./logs`, respectively), the files will automatically upload to your run history so that you have access to them once your run is finished.
>
> To create artifacts during training (such as model files, checkpoints, data files, or plotted images) write these to the `./outputs` folder.
>
> Similarly, you can write any logs from your training run to the `./logs` folder. To utilize Azure Machine Learning's [TensorBoard integration](https://aka.ms/aml-notebook-tb) make sure you write your TensorBoard logs to this folder. While your run is in progress, you will be able to launch TensorBoard and stream these logs.  Later, you will also be able to restore the logs from any of your previous runs.
>
> For example, to download a file written to the *outputs* folder to your local machine after your remote training run: 
> `run.download_file(name='outputs/my_output_file', output_file_path='my_destination_path')`

### Distributed training and custom Docker images

There are two additional training scenarios you can carry out with the `Estimator`:
* Using a custom Docker image
* Distributed training on a multi-node cluster

The following code shows how to carry out distributed training for a Keras model. In addition, instead of using the default Azure Machine Learning images, it specifies a custom docker image from Docker Hub `continuumio/miniconda` for training.

You should have already created your [compute target](how-to-set-up-training-targets.md#amlcompute) object `compute_target`. You create the estimator as follows:

```Python
from azureml.train.estimator import Estimator
from azureml.core.runconfig import MpiConfiguration

estimator = Estimator(source_directory='./my-keras-proj',
                      compute_target=compute_target,
                      entry_script='train.py',
                      node_count=2,
                      process_count_per_node=1,
                      distributed_training=MpiConfiguration(),        
                      conda_packages=['tensorflow', 'keras'],
                      custom_docker_image='continuumio/miniconda')
```

The above code exposes the following new parameters to the `Estimator` constructor:

Parameter | Description | Default
--|--|--
`custom_docker_image`| Name of the image you want to use. Only provide images available in public docker repositories (in this case Docker Hub). To use an image from a private docker repository, use the constructor's `environment_definition` parameter instead. [See example](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/how-to-use-estimator/how-to-use-estimator.ipynb). | `None`
`node_count`| Number of nodes to use for your training job. | `1`
`process_count_per_node`| Number of processes (or "workers") to run on each node. In this case, you use the `2` GPUs available on each node.| `1`
`distributed_training`| [MPIConfiguration ](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration?view=azure-ml-py) object for launching distributed training using MPI backend.  | `None`


Finally, submit the training job:
```Python
run = experiment.submit(estimator)
print(run.get_portal_url())
```

## Registering a model

Once you've trained the model, you can save and register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

Running the following code will register the model to your workspace, and will make it available to reference by name in remote compute contexts or deployment scripts. See [`register_model`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#register-model-model-name--model-path-none--tags-none--properties-none--model-framework-none--model-framework-version-none--description-none--datasets-none--sample-input-dataset-none--sample-output-dataset-none--resource-configuration-none----kwargs-) in the reference docs for more information and additional parameters.

```python
model = run.register_model(model_name='sklearn-sample', model_path=None)
```

## GitHub tracking and integration

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. For more information, see [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

## Examples
For a notebook that shows the basics of an estimator pattern, see:
* [how-to-use-azureml/training-with-deep-learning/how-to-use-estimator](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/how-to-use-estimator/how-to-use-estimator.ipynb)

For a notebook that trains a scikit-learn model by using estimator, see:
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/img-classification-part1-training.ipynb)

For notebooks on training models by using deep-learning-framework specific estimators, see:

* [how-to-use-azureml/ml-frameworks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Next steps

* [Track run metrics during training](how-to-track-experiments.md)
* [Train PyTorch models](how-to-train-pytorch.md)
* [Train TensorFlow models](how-to-train-tensorflow.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
* [Create and manage environments for training and deployment](how-to-use-environments.md)