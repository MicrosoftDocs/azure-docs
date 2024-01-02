---
title: Train scikit-learn machine learning models (v2)
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning enables you to scale out a scikit-learn training job using elastic cloud compute resources (v2).
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.author: balapv
author: balapv
ms.reviewer: sgilley
ms.date: 09/29/2022
ms.topic: how-to
ms.custom: sdkv2, event-tier1-build-2022
#Customer intent: As a Python scikit-learn developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my machine learning models at scale.
---

# Train scikit-learn models at scale with Azure Machine Learning

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

In this article, learn how to run your scikit-learn training scripts with Azure Machine Learning Python SDK v2.

The example scripts in this article are used to classify iris flower images to build a machine learning model based on scikit-learn's [iris dataset](https://archive.ics.uci.edu/ml/datasets/iris).

Whether you're training a machine learning scikit-learn model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning.

## Prerequisites

You can run the code for this article in either an Azure Machine Learning compute instance, or your own Jupyter Notebook.

 - Azure Machine Learning compute instance
    - Complete [Create resources to get started](quickstart-create-resources.md) to create a compute instance. Every compute instance includes a dedicated notebook server pre-loaded with the SDK and the notebooks sample repository.
    - Select the notebook tab in the Azure Machine Learning studio. In the samples training folder, find a completed and expanded notebook by navigating to this directory: **v2  > sdk > jobs > single-step > scikit-learn > train-hyperparameter-tune-deploy-with-sklearn**.
    - You can use the pre-populated code in the sample training folder to complete this tutorial.

 - Your Jupyter notebook server.
    - [Install the Azure Machine Learning SDK (v2)](https://aka.ms/sdk-v2-install).


## Set up the job

This section sets up the job for training by loading the required Python packages, connecting to a workspace, creating a compute resource to run a command job, and creating an environment to run the job.

### Connect to the workspace

First, you'll need to connect to your Azure Machine Learning workspace. The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

We're using `DefaultAzureCredential` to get access to the workspace. This credential should be capable of handling most Azure SDK authentication scenarios.

If `DefaultAzureCredential` does not work for you, see [`azure-identity reference documentation`](/python/api/azure-identity/azure.identity) or [`Set up authentication`](how-to-setup-authentication.md?tabs=sdk) for more available credentials.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=credential)]

If you prefer to use a browser to sign in and authenticate, you should remove the comments in the following code and use it instead.

```python
# Handle to the workspace
# from azure.ai.ml import MLClient

# Authentication package
# from azure.identity import InteractiveBrowserCredential
# credential = InteractiveBrowserCredential()
```

Next, get a handle to the workspace by providing your Subscription ID, Resource Group name, and workspace name. To find these parameters:

1. Look in the upper-right corner of the Azure Machine Learning studio toolbar for your workspace name.
2. Select your workspace name to show your Resource Group and Subscription ID.
3. Copy the values for Resource Group and Subscription ID into the code.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=ml_client)]

The result of running this script is a workspace handle that you'll use to manage other resources and jobs.

> [!NOTE]
> Creating `MLClient` will not connect the client to the workspace. The client initialization is lazy and will wait for the first time it needs to make a call. In this article, this will happen during compute creation.

### Create a compute resource to run the job

Azure Machine Learning needs a compute resource to run a job. This resource can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

In the following example script, we provision a Linux [`compute cluster`](./how-to-create-attach-compute-cluster.md?tabs=python). You can see the [`Azure Machine Learning pricing`](https://azure.microsoft.com/pricing/details/machine-learning/) page for the full list of VM sizes and prices. We only need a basic cluster for this example; thus, we'll pick a Standard_DS3_v2 model with 2 vCPU cores and 7 GB RAM to create an Azure Machine Learning compute.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=cpu_compute_target)]

### Create a job environment

To run an Azure Machine Learning job, you'll need an environment. An Azure Machine Learning [environment](concept-environments.md) encapsulates the dependencies (such as software runtime and libraries) needed to run your machine learning training script on your compute resource. This environment is similar to a Python environment on your local machine.

Azure Machine Learning allows you to either use a curated (or ready-made) environment or create a custom environment using a Docker image or a Conda configuration. In this article, you'll create a custom environment for your jobs, using a Conda YAML file.

#### Create a custom environment

To create your custom environment, you'll define your Conda dependencies in a YAML file. First, create a directory for storing the file. In this example, we've named the directory `env`.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=make_env_folder)]

Then, create the file in the dependencies directory. In this example, we've named the file `conda.yml`.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=make_conda_file)]

The specification contains some usual packages (such as numpy and pip) that you'll use in your job.

Next, use the YAML file to create and register this custom environment in your workspace. The environment will be packaged into a Docker container at runtime.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=custom_environment)]

For more information on creating and using environments, see [Create and use software environments in Azure Machine Learning](how-to-use-environments.md).

##### [Optional] Create a custom environment with Intel&reg; Extension for Scikit-Learn

Want to speed up your scikit-learn scripts on Intel hardware? Try adding [Intel&reg; Extension for Scikit-Learn](https://www.intel.com/content/www/us/en/developer/tools/oneapi/scikit-learn.html) into your conda yaml file and following the subsequent steps detailed above. We will show you how to enable these optimizations later in this example:
[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=make_sklearnex_conda_file)]

## Configure and submit your training job

In this section, we'll cover how to run a training job, using a training script that we've provided. To begin, you'll build the training job by configuring the command for running the training script. Then, you'll submit the training job to run in Azure Machine Learning.


### Prepare the training script

In this article, we've provided the training script *train_iris.py*. In practice, you should be able to take any custom training script as is and run it with Azure Machine Learning without having to modify your code.

> [!NOTE]
> The provided training script does the following:
> - shows how to log some metrics to your Azure Machine Learning run;
> - downloads and extracts the training data using `iris = datasets.load_iris()`; and
> - trains a model, then saves and registers it.

To use and access your own data, see [how to read and write data in a job](how-to-read-write-data-v2.md) to make data available during training.

To use the training script, first create a directory where you will store the file.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=make_src_folder)]

Next, create the script file in the source directory.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=create_script_file)]

#### [Optional] Enable Intel&reg; Extension for Scikit-Learn optimizations for more performance on Intel hardware

If you have installed Intel&reg; Extension for Scikit-Learn (as demonstrated in the previous section), you can enable the performance optimizations by adding the two lines of code to the top of the script file, as shown below.

To learn more about Intel&reg; Extension for Scikit-Learn, visit the package's [documentation](https://intel.github.io/scikit-learn-intelex/).

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=create_sklearnex_script_file)]

### Build the training job

Now that you have all the assets required to run your job, it's time to build it using the Azure Machine Learning Python SDK v2. For this, we'll be creating a `command`.

An Azure Machine Learning `command` is a resource that specifies all the details needed to execute your training code in the cloud. These details include the inputs and outputs, type of hardware to use, software to install, and how to run your code. The `command` contains information to execute a single command.


#### Configure the command

You'll use the general purpose `command` to run the training script and perform your desired tasks. Create a `Command` object to specify the configuration details of your training job. 

- The inputs for this command include the number of epochs, learning rate, momentum, and output directory.
- For the parameter values:
    - provide the compute cluster `cpu_compute_target = "cpu-cluster"` that you created for running this command;
    - provide the custom environment `sklearn-env` that you created for running the Azure Machine Learning job;
    - configure the command line action itself—in this case, the command is `python train_iris.py`. You can access the inputs and outputs in the command via the `${{ ... }}` notation; and
    - configure the metadata such as the display name and experiment name; where an experiment is a container for all the iterations one does on a certain project. Note that all the jobs submitted under the same experiment name would be listed next to each other in Azure Machine Learning studio.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=job)]

### Submit the job

It's now time to submit the job to run in Azure Machine Learning. This time you'll use `create_or_update` on `ml_client.jobs`. 

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=create_job)]

Once completed, the job will register a model in your workspace (as a result of training) and output a link for viewing the job in Azure Machine Learning studio.

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](concept-train-machine-learning-model.md#understand-what-happens-when-you-submit-a-training-job) or don't include it in the source directory.

### What happens during job execution
As the job is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the environment defined. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress. If a curated environment is specified, the cached image backing that curated environment will be used.

- **Scaling**: The cluster attempts to scale up if the cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder *src* are uploaded to the compute target, data stores are mounted or copied, and the script is executed. Outputs from *stdout* and the *./logs* folder are streamed to the run history and can be used to monitor the run.

## Tune model hyperparameters

Now that you've seen how to do a simple Scikit-learn training run using the SDK, let's see if you can further improve the accuracy of your model. You can tune and optimize our model's hyperparameters using Azure Machine Learning's [`sweep`](/python/api/azure-ai-ml/azure.ai.ml.sweep) capabilities.

To tune the model's hyperparameters, define the parameter space in which to search during training. You'll do this by replacing some of the parameters (`kernel` and `penalty`) passed to the training job with special inputs from the `azure.ml.sweep` package.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=job_for_sweep)]

Then, you'll configure sweep on the command job, using some sweep-specific parameters, such as the primary metric to watch and the sampling algorithm to use.

In the following code we use random sampling to try different configuration sets of hyperparameters in an attempt to maximize our primary metric, `Accuracy`.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=sweep_job)]

Now, you can submit this job as before. This time, you'll be running a sweep job that sweeps over your train job.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=create_sweep_job)]

You can monitor the job by using the studio user interface link that is presented during the job run.


## Find and register the best model

Once all the runs complete, you can find the run that produced the model with the highest accuracy.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=model)]

You can then register this model.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=register_model)]


## Deploy the model

After you've registered your model, you can deploy it the same way as any other registered model in Azure Machine Learning. For more information about deployment, see [Deploy and score a machine learning model with managed online endpoint using Python SDK v2](how-to-deploy-managed-online-endpoint-sdk-v2.md).


## Next steps

In this article, you trained and registered a scikit-learn model, and you learned about deployment options. See these other articles to learn more about Azure Machine Learning.

* [Track run metrics during training](how-to-log-view-metrics.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
