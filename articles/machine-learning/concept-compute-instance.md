---
title: 'What is an Azure Machine Learning compute instance?'
titleSuffix: Azure Machine Learning
description: Learn about the Azure Machine Learning compute instance, a fully managed cloud-based workstation.
services: machine-learning
ms.service: machine-learning
ms.subservice: compute
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.author: vijetaj
author: vijetajo
ms.reviewer: sgilley
ms.date: 01/17/2024
monikerRange: 'azureml-api-2 || azureml-api-1'
#Customer intent: As a data scientist, I want to know what a compute instance is and how to use it for Azure Machine Learning.
---

# What is an Azure Machine Learning compute instance?

An Azure Machine Learning compute instance is a managed cloud-based workstation for data scientists.  Each compute instance has only one owner, although you can share files between multiple compute instances. 

Compute instances make it easy to get started with Azure Machine Learning development and provide management and enterprise readiness capabilities for IT administrators.

Use a compute instance as your fully configured and managed development environment in the cloud for machine learning. They can also be used as a compute target for training and inferencing for development and testing purposes.

For compute instance Jupyter functionality to work, ensure that web socket communication isn't disabled. Ensure your network allows websocket connections to *.instances.azureml.net and *.instances.azureml.ms.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why use a compute instance?

A compute instance is a fully managed cloud-based workstation optimized for your machine learning development environment. It provides the following benefits:

|Key benefits|Description|
|----|----|
|Productivity|You can build and deploy models using integrated notebooks and the following tools in Azure Machine Learning studio:<br/>-  Jupyter<br/>-  JupyterLab<br/>-  VS Code (preview)<br/>Compute instance is fully integrated with Azure Machine Learning workspace and studio. You can share notebooks and data with other data scientists in the workspace.<br/> 
|Managed & secure|Reduce your security footprint and add compliance with enterprise security requirements. Compute instances  provide robust management policies and secure networking configurations such as:<br/><br/>- Autoprovisioning from Resource Manager templates or Azure Machine Learning SDK<br/>- [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)<br/>- [Virtual network support](./how-to-secure-training-vnet.md)<br/> - Azure policy to disable SSH access<br/> - Azure policy to enforce creation in a virtual network <br/> - Auto-shutdown/auto-start based on schedule <br/>- TLS 1.2 enabled |
|Preconfigured&nbsp;for&nbsp;ML|Save time on setup tasks with pre-configured and up-to-date ML packages, deep learning frameworks, GPU drivers.|
|Fully customizable|Broad support for Azure VM types including GPUs and persisted low-level customization such as installing packages and drivers makes advanced scenarios a breeze. You can also use setup scripts to automate customization |

* Secure your compute instance with **[No public IP](./how-to-secure-training-vnet.md)**.
* The compute instance is also a secure training compute target similar to [compute clusters](how-to-create-attach-compute-cluster.md), but it's single node. 
* You can [create a compute instance](how-to-create-compute-instance.md?tabs=python#create) yourself, or an administrator can **[create a compute instance on your behalf](how-to-create-compute-instance.md?tabs=python#create-on-behalf-of)**.
* You can also **[use a setup script](how-to-customize-compute-instance.md)**  for an automated way to customize and configure the compute instance as per your needs.
* To save on costs, **[create  a schedule](how-to-create-compute-instance.md#schedule-automatic-start-and-stop)** to automatically start and stop the compute instance, or [enable idle shutdown](how-to-create-compute-instance.md#configure-idle-shutdown)


## Tools and environments

Azure Machine Learning compute instance enables you to author, train, and deploy models in a fully integrated notebook experience in your workspace.

You can run notebooks from [your Azure Machine Learning workspace](./how-to-run-jupyter-notebooks.md), [Jupyter](https://jupyter.org/), [JupyterLab](https://jupyterlab.readthedocs.io), or [Visual Studio Code](./how-to-launch-vs-code-remote.md). VS Code Desktop can be configured to access your compute instance. Or use VS Code for the Web, directly from the browser, and without any required installations or dependencies.

We recommend you try VS Code for the Web to take advantage of the easy integration and rich development environment it provides.  VS Code for the Web gives you many of the features of VS Code Desktop that you love, including search and syntax highlighting while browsing and editing.  For more information about using VS Code Desktop and VS Code for the Web, see [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md) and [Work in VS Code remotely connected to a compute instance (preview)](how-to-work-in-vs-code-remote.md).

You can [install packages](how-to-access-terminal.md#install-packages) and [add kernels](how-to-access-terminal.md#add-new-kernels) to your compute instance.

The following tools and environments are already installed on the compute instance:

|General tools & environments|Details|
|----|:----:|
|Drivers|`CUDA`</br>`cuDNN`</br>`NVIDIA`</br>`Blob FUSE` |
|Intel MPI library||
|Azure CLI ||
|Azure Machine Learning samples ||
|Docker||
|Nginx||
|NCCL 2.0 ||
|Protobuf||

|**R** tools & environments|Details|
|----|:----:|
|R kernel||

You can [Add RStudio or Posit Workbench (formerly RStudio Workbench)](how-to-create-compute-instance.md#add-custom-applications-such-as-rstudio-or-posit-workbench) when you create the instance.

|**PYTHON** tools & environments |Details|
|----|----|
|Anaconda Python||
|Jupyter and extensions||
|Jupyterlab and extensions||
[Azure Machine Learning SDK <br/> for Python](https://aka.ms/sdk-v2-install) from PyPI|Includes azure-ai-ml and many common azure extra packages.  To see the full list, <br/> [open a terminal window on your compute instance](how-to-access-terminal.md) and run <br/> `conda list -n azureml_py310_sdkv2 ^azure` |
|Other PyPI packages|`jupytext`</br>`tensorboard`</br>`nbconvert`</br>`notebook`</br>`Pillow`|
|Conda packages|`cython`</br>`numpy`</br>`ipykernel`</br>`scikit-learn`</br>`matplotlib`</br>`tqdm`</br>`joblib`</br>`nodejs`|
|Deep learning packages|`PyTorch`</br>`TensorFlow`</br>`Keras`</br>`Horovod`</br>`MLFlow`</br>`pandas-ml`</br>`scrapbook`|
|ONNX packages|`keras2onnx`</br>`onnx`</br>`onnxconverter-common`</br>`skl2onnx`</br>`onnxmltools`|
|Azure Machine Learning Python samples||

The compute instance has Ubuntu as the base OS.

## Accessing files

Notebooks and Python scripts are stored in the default storage account of your workspace in Azure file share.  These files are located under your "User files" directory. This storage makes it easy to share notebooks between compute instances. The storage account also keeps your notebooks safely preserved when you stop or delete a compute instance.

The Azure file share account of your workspace is mounted as a drive on the compute instance. This drive is the default working directory for Jupyter, Jupyter Labs, RStudio, and Posit Workbench. This means that the notebooks and other files you create in Jupyter, JupyterLab, VS Code for Web, RStudio, or Posit are automatically stored on the file share and available to use in other compute instances as well.

The files in the file share are accessible from all compute instances in the same workspace. Any changes to these files on the compute instance will be reliably persisted back to the file share.

You can also clone the latest Azure Machine Learning samples to your folder under the user files directory in the workspace file share.

Writing small files can be slower on network drives than writing to the compute instance local disk itself.  If you're writing many small files, try using a directory directly on the compute instance, such as a `/tmp` directory. Note these files won't be accessible from other compute instances.

Don't store training data on the notebooks file share.  For information on the various options to store data, see [Access data in a job](how-to-read-write-data-v2.md).

You can use the `/tmp` directory on the compute instance for your temporary data.  However, don't write large files of data on the OS disk of the compute instance. OS disk on compute instance has 128-GB capacity. You can also store temporary training data on temporary disk mounted on /mnt. Temporary disk size is based on the VM size chosen and can store larger amounts of data if a higher size VM is chosen. Any software packages you install are saved on the OS disk of compute instance. Note customer managed key encryption is currently not supported for OS disk. The OS disk for compute instance is encrypted with Microsoft-managed keys. 

:::moniker range="azureml-api-1"
You can also mount [datastores and datasets](v1/concept-azure-machine-learning-architecture.md?view=azureml-api-1&preserve-view=true#datasets-and-datastores). 
:::moniker-end
## Create

Follow the steps in [Create resources you need to get started](quickstart-create-resources.md) to create a basic compute instance.  

For more options, see [create a new compute instance](how-to-create-compute-instance.md?tabs=azure-studio#create).

As an administrator, you can **[create a compute instance for others in the workspace](how-to-create-compute-instance.md#create-on-behalf-of)**.

You can also **[use a setup script](how-to-customize-compute-instance.md)** for an automated way to customize and configure the compute instance.

Other ways to create a compute instance:
* Directly from the integrated notebooks experience.
* From Azure Resource Manager template. For an example template, see the [create an Azure Machine Learning compute instance template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance).
* With [Azure Machine Learning SDK](how-to-create-compute-instance.md?tabs=python#create)
* From the [CLI extension for Azure Machine Learning](how-to-create-compute-instance.md?tabs=azure-cli#create)

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance doesn't release quota to ensure you'll be able to restart the compute instance. Don't stop the compute instance through the OS terminal by doing a sudo shutdown.

Compute instance comes with P10 OS disk. Temp disk type depends on the VM size chosen. Currently, it isn't possible to change the OS disk type.


## Compute target

Compute instances can be used as a [training compute target](concept-compute-target.md#training-compute-targets) similar to Azure Machine Learning [compute training clusters](how-to-create-attach-compute-cluster.md).  But a compute instance has only a single node, while a compute cluster can have more nodes.

A compute instance:

* Has a job queue.
* Runs jobs securely in a virtual network environment, without requiring enterprises to open up SSH port. The job executes in a containerized environment and packages your model dependencies in a Docker container.
* Can run multiple small jobs in parallel.  One job per vCPU can run in parallel while the rest of the jobs are queued.
* Supports single-node multi-GPU [distributed training](how-to-train-distributed-gpu.md) jobs

You can use compute instance as a local inferencing deployment target for test/debug scenarios.

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space and get into an unusable state, please clear at least 5 GB disk space on OS disk (mounted on /) through the compute instance terminal by removing files/folders and then do `sudo reboot`. Temporary disk will be freed after restart; you do not need to clear space on temp disk manually. To access the terminal go to compute list page or compute instance details page and click on **Terminal** link. You can check available disk space by running `df -h` on the terminal. Clear at least 5 GB space before doing `sudo reboot`. Please do not stop or restart the compute instance through the Studio until 5 GB disk space has been cleared. Auto shutdowns, including scheduled start or stop as well as idle shutdowns, will not work if the CI disk is full.

## Next steps

* [Create resources you need to get started](quickstart-create-resources.md).
* [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.
