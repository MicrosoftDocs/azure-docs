---
title: Upgrade host OS for compute cluster and instance 
titleSuffix: Azure Machine Learning
description: Upgrade the host OS for compute cluster and compute instance from Ubuntu 16.04 LTS to 18.04 LTS.
services: machine-learning
author: nishankgu
ms.author: nigup
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 03/03/2021
ms.topic: conceptual
ms.custom: how-to

---

# Upgrade compute instance and compute cluster host OS

Azure Machine Learning __compute cluster__ and __compute instance__ are managed compute infrastructure. As a managed service, Microsoft manages the host OS and the packages and software versions that are installed.

The host OS for compute cluster and compute instance has been Ubuntu 16.04 LTS. On **April 30, 2021**, Ubuntu is ending support for 16.04. Starting on __March 15, 2021__, Microsoft will automatically update the host OS to Ubuntu 18.04 LTS. Updating to 18.04 will ensure continued security updates and support from the Ubuntu community. This update will be rolled out across Azure regions and will be available in all regions by __April 09, 2021__. For more information on Ubuntu ending support for 16.04, see the [Ubuntu release blog](https://wiki.ubuntu.com/Releases).

> [!TIP]
> * The host OS is not the OS version you might specify for an [environment](how-to-use-environments.md) when training or deploying a model. Environments run inside Docker. Docker runs on the host OS.
> * If you are currently using Ubuntu 16.04 based environments for training or deployment, Microsoft recommends that you switch to using Ubuntu 18.04 based images. For more information, see [How to use environments](how-to-use-environments.md) and the [Azure Machine Learning containers repository](https://github.com/Azure/AzureML-Containers/tree/master/base).
> * When using an Azure Machine Learning compute instance based on Ubuntu 18.04, the default Python version is _Python 3.8_.
## Creating new resources

Compute cluster or compute instances created after __April 09, 2021__ use Ubuntu 18.04 LTS as the host OS by default. You cannot select a different host OS.

## Upgrade existing resources

If you have existing compute clusters or compute instances created before __March 15, 2021__, you need to take action to upgrade the host OS to Ubuntu 18.04. Depending on the region you access Azure Machine Learning from, we recommend you take these actions after __April 09, 2021__ to ensure our changes have rolled out to all regions:

* __Azure Machine Learning compute cluster__:

    * If the cluster is configured with __min nodes = 0__, it will automatically be upgraded when all jobs are completed and it reduces to zero nodes.
    * If __min nodes > 0__, temporarily change the minimum nodes to zero and allow the cluster to reduce to zero nodes.

    For more information on changing the minimum nodes, see the [az ml computetarget update amlcompute](https://docs.microsoft.com/cli/azure/ml/computetarget/update#az_ml_computetarget_update_amlcompute) Azure CLI command, or the [AmlCompute.update()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#update-min-nodes-none--max-nodes-none--idle-seconds-before-scaledown-none-) SDK reference.

* __Azure Machine Learning compute instance__: Create a new compute instance (which will use Ubuntu 18.04) and delete the old instance.

    * Any notebook stored in the workspace file share, data stores, of datasets will be accessible from the new compute instance.
    * If you have created custom conda environments, you can export those environments from the existing instance and import on the new instance. For information on conda export and import, see [Conda documentation](https://docs.conda.io/) at docs.conda.io.

    For more information, see the [What is compute instance](concept-compute-instance.md) and [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md) articles

## Check host OS version

For information on checking the host OS version, see the Ubuntu community wiki page on [checking your Ubuntu version](https://help.ubuntu.com/community/CheckingYourUbuntuVersion).

> [!TIP]
> To use the `lsb_release -a` command from the wiki, you can [use a terminal session on a compute instance](how-to-access-terminal.md).
## Next steps

If you have any further questions or concerns, contact us at [ubuntu18azureml@service.microsoft.com](mailto:ubuntu18azureml@service.microsoft.com).
