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
ms.date: 07/27/2021
#Customer intent: As a data scientist, I want to know what a compute instance is and how to use it for Azure Machine Learning.
---

# What is an Azure Machine Learning compute instance?

An Azure Machine Learning compute instance is a managed cloud-based workstation for data scientists.

Compute instances make it easy to get started with Azure Machine Learning development as well as provide management and enterprise readiness capabilities for IT administrators.

Use a compute instance as your fully configured and managed development environment in the cloud for machine learning. They can also be used as a compute target for training and inferencing for development and testing purposes.

For production grade model training, use an [Azure Machine Learning compute cluster](how-to-create-attach-compute-cluster.md) with multi-node scaling capabilities. For production grade model deployment, use [Azure Kubernetes Service cluster](how-to-deploy-azure-kubernetes-service.md).

For compute instance Jupyter functionality to work, ensure that web socket communication is not disabled. Please ensure your network allows websocket connections to *.instances.azureml.net and *.instances.azureml.ms.

## Why use a compute instance?

A compute instance is a fully managed cloud-based workstation optimized for your machine learning development environment. It provides the following benefits:

|Key benefits|Description|
|----|----|
|Productivity|You can build and deploy models using integrated notebooks and the following tools in Azure Machine Learning studio:<br/>-  Jupyter<br/>-  JupyterLab<br/>-  VS Code (preview)<br/>-  RStudio (preview)<br/>Compute instance is fully integrated with Azure Machine Learning workspace and studio. You can share notebooks and data with other data scientists in the workspace.<br/> You can also use [VS Code](https://techcommunity.microsoft.com/t5/azure-ai/power-your-vs-code-notebooks-with-azml-compute-instances/ba-p/1629630) with compute instances.
|Managed & secure|Reduce your security footprint and add compliance with enterprise security requirements. Compute instances  provide robust management policies and secure networking configurations such as:<br/><br/>- Autoprovisioning from Resource Manager templates or Azure Machine Learning SDK<br/>- [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)<br/>- [Virtual network support](./how-to-secure-training-vnet.md#compute-instance)<br/>- SSH policy to enable/disable SSH access<br/>TLS 1.2 enabled |
|Preconfigured&nbsp;for&nbsp;ML|Save time on setup tasks with pre-configured and up-to-date ML packages, deep learning frameworks, GPU drivers.|
|Fully customizable|Broad support for Azure VM types including GPUs and persisted low-level customization such as installing packages and drivers makes advanced scenarios a breeze. |

* The compute instance is also a secure training compute target similar to compute clusters, but it is single node.

* You can [create a compute instance](how-to-create-manage-compute-instance.md?tabs=python#create) yourself, or an administrator can **[create a compute instance on your behalf](how-to-create-manage-compute-instance.md?tabs=python#on-behalf)**.

* You can also **[use a setup script (preview)](how-to-create-manage-compute-instance.md#setup-script)**  for an automated way to customize and configure the compute instance as per your needs.

* To save on costs, **[create  a schedule](how-to-create-manage-compute-instance.md?tabs=azure-studio#schedule-studio)** to automatically start and stop the compute instance (preview).

## <a name="contents"></a>Tools and environments

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Machine Learning compute instance enables you to author, train, and deploy models in a fully integrated notebook experience in your workspace.

You can run Jupyter notebooks in [VS Code](https://techcommunity.microsoft.com/t5/azure-ai/power-your-vs-code-notebooks-with-azml-compute-instances/ba-p/1629630) using compute instance as the remote server with no SSH needed. You can also enable VS Code integration through [remote SSH extension](https://devblogs.microsoft.com/python/enhance-your-azure-machine-learning-experience-with-the-vs-code-extension/).

You can [install packages](how-to-access-terminal.md#install-packages) and [add kernels](how-to-access-terminal.md#add-new-kernels) to your compute instance.

Following tools and environments are already installed on the compute instance:

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

|**PYTHON** tools & environments|Details|
|----|----|
|Anaconda Python||
|Jupyter and extensions||
|Jupyterlab and extensions||
[Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro)</br>from PyPI|Includes most of the azureml extra packages.  To see the full list, [open a terminal window on your compute instance](how-to-access-terminal.md) and run <br/> `conda list -n azureml_py36 azureml*` |
|Other PyPI packages|`jupytext`</br>`tensorboard`</br>`nbconvert`</br>`notebook`</br>`Pillow`|
|Conda packages|`cython`</br>`numpy`</br>`ipykernel`</br>`scikit-learn`</br>`matplotlib`</br>`tqdm`</br>`joblib`</br>`nodejs`</br>`nb_conda_kernels`|
|Deep learning packages|`PyTorch`</br>`TensorFlow`</br>`Keras`</br>`Horovod`</br>`MLFlow`</br>`pandas-ml`</br>`scrapbook`|
|ONNX packages|`keras2onnx`</br>`onnx`</br>`onnxconverter-common`</br>`skl2onnx`</br>`onnxmltools`|
|Azure Machine Learning Python samples||

Python packages are all installed in the **Python 3.8 - AzureML** environment. Compute instance has Ubuntu 18.04 as the base OS.

## Accessing files

Notebooks and R scripts are stored in the default storage account of your workspace in Azure file share.  These files are located under your “User files” directory. This storage makes it easy to share notebooks between compute instances. The storage account also keeps your notebooks safely preserved when you stop or delete a compute instance.

The Azure file share account of your workspace is mounted as a drive on the compute instance. This drive is the default working directory for Jupyter, Jupyter Labs, and RStudio. This means that the notebooks and other files you create in Jupyter, JupyterLab, or RStudio are automatically stored on the file share and available to use in other compute instances as well.

The files in the file share are accessible from all compute instances in the same workspace. Any changes to these files on the compute instance will be reliably persisted back to the file share.

You can also clone the latest Azure Machine Learning samples to your folder under the user files directory in the workspace file share.

Writing small files can be slower on network drives than writing to the compute instance local disk itself.  If you are writing many small files, try using a directory directly on the compute instance, such as a `/tmp` directory. Note these files will not be accessible from other compute instances.

Do not store training data on the notebooks file share. You can use the `/tmp` directory on the compute instance for your temporary data.  However, do not write very large files of data on the OS disk of the compute instance. OS disk on compute instance has 128 GB capacity. You can also store temporary training data on temporary disk mounted on /mnt. Temporary disk size is configurable based on the VM size chosen and can store larger amounts of data if a higher size VM is chosen. You can also mount [datastores and datasets](concept-azure-machine-learning-architecture.md#datasets-and-datastores). Any software packages you install are saved on the OS disk of compute instance. Please note customer managed key encryption is currently not supported for OS disk. The OS disk for compute instance is encrypted with Microsoft-managed keys. 



## Managing a compute instance

In your workspace in Azure Machine Learning studio, select **Compute**, then select **Compute Instance** on the top.

![Manage a compute instance](./media/concept-compute-instance/manage-compute-instance.png)

For more about managing the compute instance, see [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).

### <a name="create"></a>Create a compute instance

As an administrator, you can **[create a compute instance for others in the workspace (preview)](how-to-create-manage-compute-instance.md#on-behalf)**.

You can also **[use a setup script (preview)](how-to-create-manage-compute-instance.md#setup-script)**  for an automated way to customize and configure the compute instance.

To create your a compute instance for yourself, use your workspace in Azure Machine Learning studio, [create a new compute instance](how-to-create-manage-compute-instance.md?tabs=azure-studio#create) from either the **Compute** section or in the **Notebooks** section when you are ready to run one of your notebooks.

You can also create an instance
* Directly from the [integrated notebooks experience](tutorial-train-models-with-aml.md#azure)
* In Azure portal
* From Azure Resource Manager template. For an example template, see the [create an Azure Machine Learning compute instance template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance).
* With [Azure Machine Learning SDK](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/machine-learning/concept-compute-instance.md)
* From the [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md#computeinstance)

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance does not release quota to ensure you will be able to restart the compute instance. Please do not stop the compute instance through the OS terminal by doing a sudo shutdown.

Compute instance comes with P10 OS disk. Temp disk type depends on the VM size chosen. Currently, it is not possible to change the OS disk type.


## Compute target

Compute instances can be used as a [training compute target](concept-compute-target.md#train) similar to Azure Machine Learning compute training clusters.

A compute instance:
* Has a job queue.
* Runs jobs securely in a virtual network environment, without requiring enterprises to open up SSH port. The job executes in a containerized environment and packages your model dependencies in a Docker container.
* Can run multiple small jobs in parallel (preview).  Two jobs per core can run in parallel while the rest of the jobs are queued.
* Supports single-node multi-GPU distributed training jobs

You can use compute instance as a local inferencing deployment target for test/debug scenarios.

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space and get into an unusable state, please clear at least 5 GB disk space on OS disk (mounted on /) through the compute instance terminal by removing files/folders and then do `sudo reboot`. To access the terminal go to compute list page or compute instance details page and click on **Terminal** link. You can check available disk space by running `df -h` on the terminal. Clear at least 5 GB space before doing `sudo reboot`. Please do not stop or restart the compute instance through the Studio until 5 GB disk space has been cleared.

## Next steps

* [Create and manage a compute instance](how-to-create-manage-compute-instance.md)
* [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.
