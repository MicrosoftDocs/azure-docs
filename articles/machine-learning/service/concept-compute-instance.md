---
title: 'What is an Azure Machine Learning compute instance?'
titleSuffix: Azure Machine Learning
description: Learn about the Azure Machine Learning compute instance, a fully managed cloud-based workstation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 10/08/2019
# As a data scientist, I want to know what a compute instance is and how to use it for Azure Machine Learning.
---

# What is an Azure Machine Learning compute instance?

An Azure Machine Learning compute instance is a fully managed cloud-based workstation.  It's easy to get started with Azure Machine Learning. Enjoy the management and enterprise readiness capabilities of this compute resource. Use a compute instance as your fully configured and managed development environment in the cloud.

## Why use a compute instance?

A compute instance is a single managed VM, optimized to be your development environment in the cloud.  

* Collaborative: Provide your team of data scientists with a collaborative environment. Within the boundaries of a workspace, you can work on shared data, shared notebooks, and collaboratively debug models on shared compute instances.

* Managed: A managed VM with restricted end-user controls.  

* Secure: Support for secure networking configurations such as virtual network support and SSH policy. Robust management policies such as OS updates, automated provisioning, [role-based access control (RBAC)](/azure/role-based-access-control/overview), and disk encryption.

* Preconfigured for ML:  Pre-configured and up-to-date ML packages, GPU drivers, and everything you need to save time on setup tasks.

* Fully customizable: Broad support for Azure VM types including GPUs and persisted low-level customization makes advanced scenarios a breeze.

## <a name="contents"></a>Tools and environments

Azure Machine Learning compute instance enables you to author, train, and deploy models in a [fully integrated notebook experience](tutorial-1st-experiment-R-set-up.md) in your workspace.

These tools and environments are installed on the compute instance:

* CUDA, cuDNN, NVIDIA Drivers
* Intel MPI library
* RStudio Server Open Source Edition
* R kernel
* [Azure Machine Learning SDK for R](https://azure.github.io/azureml-sdk-for-r/reference/index.html)
* Anaconda Python
* Jupyter and extensions
* Jupyterlab and extensions
* Deep learning packages:
    * `PyTorch`
    * `TensorFlow`
    * `Keras`
    * `Horovod`
    * `MLFlow`
    * `pandas-ml`
    * `scrapbook`
* Conda packages:
    * `cython`
    * `numpy`
    * `ipykernel`
    * `scikit-learn`
    * `matplotlib`
    * `tqdm`
    * `joblib`
    * `nodejs`
* [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)from PyPI including:
    * `azureml-sdk[notebooks,contrib,automl,explain]`
    * `azureml-contrib-datadrift`
    * `azureml-telemetry`
    * `azureml-tensorboard`
    * `azureml-contrib-opendatasets`
    * `azureml-opendatasets`
    * `azureml-contrib-reinforcementlearning`
* Other PyPI packages:
    * `jupytext`
    * `jupyterlab-git`
    * `tensorboard`
    * `nbconvert`
* [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli)
* Docker
* Blob FUSE driver
* Nginx
* Azure Machine Learning samples

Compute instances are typically used as development environments.  However, they can also be used as a compute target for training and inferencing for development and testing.  For large tasks, an [Azure Machine Learning compute cluster](how-to-set-up-training-targets.md#amlcompute) with multi-node scaling capabilities is a better compute target choice.

## Accessing files

The Azure File Share account of your workspace is mounted as a drive on the compute instance.  The mounted drive is the default working directory for Jupyter, Jupyter Labs, and RStudio, which allows the files to be available from all compute instances.  However, writing small files is  much slower on the network drives than writing to the VM itself.  We recommended using a directory on the compute instance, such as a `/tmp` directory, when you  write small files.

The mounted drive makes files  shareable across VMs. When run, they also have access to the data stores and compute resources of your workspace.

## Sharing

When you create a compute instance, you control whether the resource can be shared. Each shared compute instance has its own managed identity, so you can share access without compromising your credentials. Each person who accesses the instance signs in with their own identity.  

## Managing a compute instance

In your workspace in [Azure Machine Learning studio](https://ml.azure.com), use the **Compute** section for the following actions on your compute instance:
* Create
* Refresh
* Start
* Stop
* Restart
* Delete  

You can also create an instance anywhere you need to select one for use in the studio.


## Next steps
 * [Tutorial: Get started with Azure Machine Learning and its R SDK](tutorial-1st-experiment-R-set-up.md) shows how to create and use a compute instance.
