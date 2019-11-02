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
ms.date: 11/04/2019
# As a data scientist, I want to know what a compute instance is and how to use it for Azure Machine Learning.
---

# What is an Azure Machine Learning compute instance?

An Azure Machine Learning compute instance is a fully managed cloud-based workstation for data scientists. Compute instance makes it  easy to get started with Azure Machine Learning development. Compute instance provides management and enterprise readiness capabilities for IT administrators. 

Compute instance is a hosted PaaS offering that supports the full lifecycle of inner-loop ML development--from model authoring, to model training and model deployment. 

Compute instances are deeply integrated with Azure Machine Learning workspaces and provide a first-class experience for model authoring through integrated notebooks using Azure Machine Learning SDKs for Python and R. Use a compute instance as your fully configured and managed development environment in the cloud.

Instances are available in both Basic and Enterprise edition. Learn more about the [pricing and details for these editions](https://azure.microsoft.com/pricing/details/machine-learning/).

> [!NOTE]
> Compute instances are available only for workspaces with a region of **North Central US** or **UK South**. Use one of these regions to create a compute instance. 


## Why use a compute instance?

A compute instance is a managed virtual machine (VM), optimized to be your machine learning development environment in the cloud. It provides the following benefits:

* **Productive**: Data scientists can build, deploy, and debug models easily using integrated notebooks and the following popular tools in a first-class web UI experience
    * Jupyter
    * JupyterLab
    * RStudio
    * VS Code: interactive debugging connecting to compute instances using VS Code Remote through SSH

* **Collaborative**: Provide your team of data scientists with a collaborative environment. Within the boundaries of a workspace, you can collaboratively debug models, and share notebooks on shared compute instances.
* **Managed and secure**: A compute instance is a managed VM form-factor, which ensures compliance with enterprise security requirements. Similar to Azure Machine Learning compute clusters, the underlying infrastructure is deployed in a subscription owned by Azure Machine Learning.  You don’t have to manage the infrastructure and it also reduces your security footprint. Compute instances  provide robust management policies and secure networking configurations such as:
    * Automated provisioning through Resource Manager templates or Azure Machine Learning SDK.
    * [Role-based access control (RBAC)](/azure/role-based-access-control/overview).     
    * Virtual network support. You can create a compute instance in a virtual network. For more details please refer to virtual network documentation article.
    * SSH policy to enable/disable SSH access
    * Access is secured with HTTPS and Azure Active Directory by default. IT Pros can easily enforce single sign-on and other security features such as multi-factor authentication. 
* **Preconfigured for machine learning**: Save time on setup tasks with pre-configured and up-to-date ML packages, deep learning frameworks, GPU drivers.
* **Fully customizable**: Broad support for Azure VM types including GPUs and persisted low-level customization such as installing packages and drivers makes advanced scenarios a breeze. You retain full access to the hardware capabilities and customize it to your heart’s desire. 

## <a name="contents"></a>Tools and environments

Azure Machine Learning compute instance enables you to author, train, and deploy models in a fully integrated notebook experience in your workspace.

The following tools and environments are installed on the compute instance:-

* CUDA, cuDNN, NVIDIA Drivers
* Intel MPI library
* RStudio Server Open Source Edition
* R kernel
* [Azure Machine Learning SDK for R](https://azure.github.io/azureml-sdk-for-r/reference/index.html)
* Anaconda Python
* Jupyter notebook server and extensions
* JupyterLab notebook IDE and extensions
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
* Automatic configuration to work with your workspace    
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
* Azure CLI
* Docker
* Blob FUSE driver
* Nginx
* Azure Machine Learning Python and R samples

Compute instances are typically used as development environments. They can also be used as a compute target for training and inferencing for development and testing. You can use conda environment azureml_py36 for your development. Compute instances include tutorials and samples to help you explore and learn how to use Azure Machine Learning. The sample notebooks are stored in the Azure Fileshare Storage account of your workspace making them shareable across compute instances. For large tasks, an [Azure Machine Learning compute cluster](how-to-set-up-training-targets.md#amlcompute) with multi-node scaling capabilities is a better compute target choice.

## Sharing

When you create a compute instance, it acts as a shared compute resource for the workspace. Users can collaboratively debug models and share notebooks on the compute instances within the boundaries of the workspace. 

You can share results of machine learning experiments by sending a link to a notebook file. If your colleagues have access to the workspace, they can open the link and see the fully rendered notebook. You can send Jupyter/JupyterLab notebook links and ml.azure.com integrated notebook links.

You can also collaborate on debugging a notebook running on your compute instance on Jupyter/JupyterLab/Integrated Notebook. Your colleagues then execute the code from their own web browser session.  They access the same execution environment (kernel) as yours to help fix issues.

Coediting of notebooks is subject to limitations of Jupyter/JupyterLab. 

Any workspace user who is assigned to a role with the `Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action` permission can access applications including, but not limited to, Jupyter, Jupyter Lab, RStudio on compute instance through given DNS name.

The workspace owner, workspace contributor, and data scientist roles already have this permission. The user who accesses these instances is authenticated with Azure Active Directory (Azure AD) with Multi-Factor Authentication.

Each compute instance uses the workspace’s managed identity, so you can share the compute instance without compromising your credentials or Azure AD tokens.

## Accessing files

Notebooks and R scripts are stored in the default storage account of your workspace in Azure file share.  These files are located under your “User files” directory. This storage makes it easy to share notebooks between compute instances. The storage account also keeps your notebooks safely preserved when you stop or delete a compute instance. 

The Azure file share account of your workspace is mounted as a drive on the compute instance. This drive is the default working directory for Jupyter, Jupyter Labs, and RStudio. 

The files in the file share are accessible from all compute instances in the same workspace. Any changes to these files on the compute instance will be reliably persisted back to the file share. 

You can also clone the latest Azure Machine Learning samples to the user files directory in the workspace file share.

Writing small files can be slower on network drives than writing to the VM itself.  If you are writing many small files, try using a directory directly on the compute instance, such as a `/tmp` directory. Please note these files will not be accessible from other compute instances in the workspace.

## Managing a compute instance

In your workspace in Azure Machine Learning studio, select Compute. The first tab on top is Compute instance. From this tab, you can perform the following actions:

* Create a compute instance. Specify the name, Azure VM type including GPUs, enable/disable SSH access, and configure virtual network settings optionally. You can also create an instance directly from integrated notebooks, Azure portal, Resource Manager template, or Azure Machine Learning SDK. The dedicated cores per region quota which applies to compute instance creation is unified and shared with Azure Machine Learning compute cluster quota. 

* Start a compute instance

* Stop a compute instance (Stopping the compute instance will also stop additional billing charges).

* Delete a compute instance, 

* Access Jupyter, JupyterLab, RStudio, VS Code URIs on the compute instance

* Refresh the compute instances tab

* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number.

* Get details about a specific compute instance such as IP address, and region.

RBAC allows you to control which users in the workspace can create, delete, start, stop a compute instance, or access the applications (Jupyter, JupyterLab, RStudio) on compute instances at the workspace scope.

You can also create an instance
* Directly from the integrated notebooks experience
* In Azure portal
* From a Resource Manager template
* With Azure Machine Learning SDK

The dedicated cores per region quota, which applies to compute instance creation is unified and shared with Azure Machine Learning training cluster quota. 

## Compute Target

Compute instances can be used as a training compute target similar to Azure Machine Learning compute training clusters. Provision a multi-GPU VM to run distributed training jobs using TensorFlow/PyTorch estimators. You can also create a run configuration and use it to run your experiment on compute instance. 
You can use compute instance as a local deployment target for testing/debugging scenarios. 

## <a name="notebookvm"></a>What happened to Notebook VM?

Compute instances are replacing the Notebook VM.  In regions where compute instances are not available yet, you can continue to use Notebook VMs with full functionality and create new Notebook VMs.

Any notebook files stored in the workspace file share and data in workspace data stores will be accessible from a compute instance. However, any custom packages previously installed on a Notebook VM will need to be re-installed on the compute instance. Quota limitations will apply to compute instance creation. 

In regions where compute instances are available, new Notebook VMs cannot be created. However, you can still access and use Notebook VMs you have created, with full functionality. Compute instances can be created in same workspace as the existing Notebook VMs. 


## Next steps

 * [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.
