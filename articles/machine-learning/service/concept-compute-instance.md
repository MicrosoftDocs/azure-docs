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

A compute instance is a managed virtual machine (VM), optimized to be your machine learning development environment in the cloud. It provides the following benefits:

* Productive: Data scientists can build and deploy models easily using integrated notebooks and popular tools such as 
    * Jupyter
    * JupyterLab
    * RStudio
    * VS Code 
* Collaborative: Provide your team of data scientists with a collaborative environment. Within the boundaries of a workspace, you can collaboratively debug models,  and share notebooks on shared compute instances.
* Managed: A compute instance is a managed VM form-factor, which ensures compliance with enterprise security requirements. Similar to Azure Machine Learning compute clusters, the underlying infrastructure is deployed in a subscription owned by Azure Machine Learning.  You don’t have to manage the infrastructure reducing your security footprint. Compute instances  provide robust management policies such as:
    * automated provisioning through Resource Manager templates or Azure Machine Learning.
    * SDK and [role-based access control (RBAC)](/azure/role-based-access-control/overview). 
* Secure: A compute instance supports secure networking configurations such as 
    * virtual network support
    * SSH policy. 
* Preconfigured for machine learning: Save time on setup tasks with all the tools and environments pre-configured and up-to-date.
* Fully customizable: Broad support for Azure VM types including GPUs and persisted low-level customization such as installing packages makes advanced scenarios a breeze.


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
* [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) from PyPI:
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

Compute instances are typically used as development environments.  They can also be used as a compute target for training and inferencing for development and testing.  For large tasks, an [Azure Machine Learning compute cluster](how-to-set-up-training-targets.md#amlcompute) with multi-node scaling capabilities is a better compute target choice.

## Sharing

When you create a compute instance, it acts as a shared compute resource for the workspace. Users can collaboratively debug models and share notebooks on the compute instances within the boundaries of the workspace. 

You can share results of machine learning experiments by sending a link to a notebook file. If your colleagues have access to the workspace, they can open the link and see the fully rendered notebook. 

You can also get help debugging a notebook running on your compute instance on Jupyter/JupyterLab/Integrated Notebook. Your colleagues then execute the code from their own web browser session.  They access the same execution environment as yours to help fix issues.

Coediting of notebooks is subject to limitations of Jupyter/JupyterLab.  You will find a better coediting experience using integrated notebooks.

Any workspace user who is assigned to a role with the `Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action` permission can access Jupyter, JupyterLab, and RStudio server instances and the notebook links on the compute instance.

The workspace owner, workspace contributor, and data scientist roles already have this permission. The user who accesses these instances is authenticated with Azure Active Directory (Azure AD) with Multi-Factor Authentication.

Each compute instance uses the workspace’s managed identity, so you can share the compute instance without compromising your credentials or Azure AD tokens.

## Accessing files

Notebooks and R scripts are stored in the default storage account of your workspace in Azure file share.  These files are located under your “User files” directory. This storage makes it easy to share notebooks between compute instances. The storage account also keeps your notebooks safely preserved when you stop or delete a compute instance. 

The Azure file share account of your workspace is mounted as a drive on the compute instance. This drive is the default working directory for Jupyter, Jupyter Labs, and RStudio. 

The files in the file share are accessible from all compute instances in the same workspace. Any changes to these files on the compute instance will be reliably persisted back to the file share. 

You can also clone the latest Azure Machine Learning samples to the user files directory in the workspace file share

Writing small files can be slower on network drives than writing to the VM itself.  If you are writing many small files, try using a directory directly on the compute instance, such as a `/tmp` directory.


## Managing a compute instance

Select **Compute** in your workspace in [Azure Machine Learning studio](https://machine learning.azure.com) to manage your compute instances:

* Create a compute instance. Specify the name, Azure VM type including GPUs, enable/disable SSH access, and configure virtual network settings optionally. 
* Start a compute instance
* Stop a compute instance
* Delete a compute instance
* Access Jupyter, JupyterLab, RStudio URIs on the compute instance
* Refresh the compute instances tab
* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number.
* Get details about a specific compute instance such as IP address, and region.

RBAC allows you to control which users in the workspace can create, delete, start, stop a compute instance, or access the applications (Jupyter, JupyterLab, RStudio) on compute instances at the workspace scope.

You can also create an instance
* Directly from the integrated notebooks experience
* In Azure portal
* From a Resource Manager template
* With Azure Machine Learning SDK

The dedicated cores per region quota, which applies to compute instance creation is unified and shared with Azure Machine Learning compute cluster quota. 

## Compute Target

Compute instances can be used as a training compute target similar to Azure Machine Learning compute clusters. Provision a multi-GPU VM to run distributed training jobs using TensorFlow/PyTorch estimators. Create a run configuration and use it to run your experiment on compute instance.

Use a compute instance as a local deployment target for testing/debugging scenarios.

## NotebookVM

Compute instances refreshes and replaces the NotebookVMs. You can still access and fully use any NotebookVMs you have created. However, you will not be able to create new NotebookVMs.


## Next steps
 * [Tutorial: Get started with Azure Machine Learning and its R SDK](tutorial-1st-experiment-R-set-up.md) shows how to create  a compute instance and launch RStudio.
 * [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.
