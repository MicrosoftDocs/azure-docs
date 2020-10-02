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
ms.date: 08/25/2020
# As a data scientist, I want to know what a compute instance is and how to use it for Azure Machine Learning.
---

# What is an Azure Machine Learning compute instance?

An Azure Machine Learning compute instance is a managed cloud-based workstation for data scientists.

Compute instances make it easy to get started with Azure Machine Learning development as well as provide management and enterprise readiness capabilities for IT administrators.  

Use a compute instance as your fully configured and managed development environment in the cloud for machine learning. They can also be used as a compute target for training and inferencing for development and testing purposes.  

For production grade model training, use an [Azure Machine Learning compute cluster](how-to-create-attach-compute-cluster.md) with multi-node scaling capabilities. For production grade model deployment, use [Azure Kubernetes Service cluster](how-to-deploy-azure-kubernetes-service.md).

## Why use a compute instance?

A compute instance is a fully managed cloud-based workstation optimized for your machine learning development environment. It provides the following benefits:

|Key benefits|Description|
|----|----|
|Productivity|You can build and deploy models using integrated notebooks and the following tools in Azure Machine Learning studio:<br/>-  Jupyter<br/>-  JupyterLab<br/>-  RStudio (preview)<br/>Compute instance is fully integrated with Azure Machine Learning workspace and studio. You can share notebooks and data with other data scientists in the workspace. You can also set up VS Code remote development using [SSH](how-to-set-up-vs-code-remote.md) |
|Managed & secure|Reduce your security footprint and add compliance with enterprise security requirements. Compute instances  provide robust management policies and secure networking configurations such as:<br/><br/>- Autoprovisioning from Resource Manager templates or Azure Machine Learning SDK<br/>- [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview)<br/>- [Virtual network support](how-to-enable-virtual-network.md#compute-instance)<br/>- SSH policy to enable/disable SSH access<br/>TLS 1.2 enabled |
|Preconfigured&nbsp;for&nbsp;ML|Save time on setup tasks with pre-configured and up-to-date ML packages, deep learning frameworks, GPU drivers.|
|Fully customizable|Broad support for Azure VM types including GPUs and persisted low-level customization such as installing packages and drivers makes advanced scenarios a breeze. |

You can [create a compute instance](how-to-create-manage-compute-instance.md?tabs=python#create) yourself, or an administrator can [create a compute instance for you](how-to-create-manage-compute-instance.md?tabs=python#create-on-behalf-of-preview).

## <a name="contents"></a>Tools and environments

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Machine Learning compute instance enables you to author, train, and deploy models in a fully integrated notebook experience in your workspace.

You can [install packages](how-to-create-manage-compute-instance.md#install-packages) and [add kernels](how-to-create-manage-compute-instance.md#add-new-kernels) to your compute instance.  

These tools and environments are already installed on the compute instance: 

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
|RStudio Server Open Source Edition (preview)||
|R kernel||
|Azure Machine Learning SDK for R|[azuremlsdk](https://azure.github.io/azureml-sdk-for-r/reference/index.html)</br>SDK samples|

|**PYTHON** tools & environments|Details|
|----|----|
|Anaconda Python||
|Jupyter and extensions||
|Jupyterlab and extensions||
[Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py&preserve-view=true)</br>from PyPI|Includes most of the azureml extra packages.  To see the full list, [open a terminal window on your compute instance](how-to-run-jupyter-notebooks.md#terminal) and run <br/> `conda list -n azureml_py36 azureml*` |
|Other PyPI packages|`jupytext`</br>`tensorboard`</br>`nbconvert`</br>`notebook`</br>`Pillow`|
|Conda packages|`cython`</br>`numpy`</br>`ipykernel`</br>`scikit-learn`</br>`matplotlib`</br>`tqdm`</br>`joblib`</br>`nodejs`</br>`nb_conda_kernels`|
|Deep learning packages|`PyTorch`</br>`TensorFlow`</br>`Keras`</br>`Horovod`</br>`MLFlow`</br>`pandas-ml`</br>`scrapbook`|
|ONNX packages|`keras2onnx`</br>`onnx`</br>`onnxconverter-common`</br>`skl2onnx`</br>`onnxmltools`|
|Azure Machine Learning Python & R SDK samples||

Python packages are all installed in the **Python 3.6 - AzureML** environment.  

## Accessing files

Notebooks and R scripts are stored in the default storage account of your workspace in Azure file share.  These files are located under your “User files” directory. This storage makes it easy to share notebooks between compute instances. The storage account also keeps your notebooks safely preserved when you stop or delete a compute instance.

The Azure file share account of your workspace is mounted as a drive on the compute instance. This drive is the default working directory for Jupyter, Jupyter Labs, and RStudio. This means that the notebooks and other files you create in Jupyter, JupyterLab, or RStudio are automatically stored on the file share and available to use in other compute instances as well.

The files in the file share are accessible from all compute instances in the same workspace. Any changes to these files on the compute instance will be reliably persisted back to the file share.

You can also clone the latest Azure Machine Learning samples to your folder under the user files directory in the workspace file share.

Writing small files can be slower on network drives than writing to the compute instance local disk itself.  If you are writing many small files, try using a directory directly on the compute instance, such as a `/tmp` directory. Note these files will not be accessible from other compute instances. 

You can use the `/tmp` directory on the compute instance for your temporary data.  However, do not write large files of data on the OS disk of the compute instance.  Use [datastores](concept-azure-machine-learning-architecture.md#datasets-and-datastores) instead. If you have installed JupyterLab git extension, it can also lead to slow down in compute instance performance.

## Compute target

Compute instances can be used as a [training compute target](concept-compute-target.md#train) similar to Azure Machine Learning compute training clusters. 

A compute instance:
* Has a job queue.
* Runs jobs securely in a virtual network environment, without requiring enterprises to open up SSH port. The job executes in a containerized environment and packages your model dependencies in a Docker container.
* Can run multiple small jobs in parallel (preview).  Two jobs per core can run in parallel while the rest of the jobs are queued.
* Supports single-node multi-GPU distributed training jobs

You can use compute instance as a local inferencing deployment target for test/debug scenarios.


## <a name="notebookvm"></a>What happened to Notebook VM?

Compute instances are replacing the Notebook VM.  

Any notebook files stored in the workspace file share and data in workspace data stores will be accessible from a compute instance. However, any custom packages previously installed on a Notebook VM will need to be reinstalled on the compute instance. Quota limitations, which apply to compute clusters creation will apply to compute instance creation as well.

New Notebook VMs cannot be created. However, you can still access and use Notebook VMs you have created, with full functionality. Compute instances can be created in same workspace as the existing Notebook VMs.


## Next steps

* [Create and manage a compute instance](how-to-create-manage-compute-instance.md)
* [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.
