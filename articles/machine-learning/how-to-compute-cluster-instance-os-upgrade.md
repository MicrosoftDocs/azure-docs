---
title: Upgrade host OS for compute cluster and instance 
titleSuffix: Azure Machine Learning
description: Upgrade the host OS for compute cluster and compute instance from Ubuntu 16.04 LTS to 18.04 LTS.
services: machine-learning
author: saachigopal
ms.author: nishankgu
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 03/02/2021
ms.topic: conceptual
ms.custom: how-to

---

# Upgrade compute instance and compute cluster host OS

Azure Machine Learning compute cluster and compute instance are managed compute infrastructure. As a managed service, Microsoft manages the host OS as well as the packages and software versions that are installed.

The host OS for compute cluster and compute instance has been Ubuntu 16.04 LTS. On April 30, 2021, Ubuntu is ending support for 16.04. Microsoft will automatically update the base OS image to Ubuntu 18.04 LTS for continued security updates and support from the Ubuntu community.

> [!TIP]
> The host OS is not the OS version you might specify for the [environment](how-to-use-environments.md) when training or deploying a model. Environments run inside Docker, which is running on the host OS.

## Creating new resources

When creating a new compute cluster or compute instance after TBD date, it will automatically be created with Ubuntu 18.04 as the host OS.

## Upgrade existing resources

If you have computes that were originally created using Ubuntu 16.04 images, __please stop those resources completely, and then start them again__ to upgrade them to Ubuntu 18.04.

See the following links for information on stopping and restarting compute clusters and compute instances:

* __Azure Machine Learning compute cluster__:

    * If the cluster is configured with __min nodes = 0__, it will automatically be upgraded when all jobs are completed and it reduces to 0 nodes.
    * If __min nodes > 0__, temporarily change the minimum nodes to 0 and allow the cluster to reduce to 0 nodes.

    For more information on changing the minimum nodes, see the [az ml computetarget update amlcompute](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/update?view=azure-cli-latest#ext_azure_cli_ml_az_ml_computetarget_update_amlcompute) Azure CLI command, or the [AmlCompute.update()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py#update-min-nodes-none--max-nodes-none--idle-seconds-before-scaledown-none-) SDK reference.

* __Azure Machine Learning compute instance__: Create a new compute instance (which will use Ubuntu 18.04) and delete the old instance.

    * Any notebook stored in the workspace file share, data stores, of datasets will be accessible from the new compute instance.
    * If you have created custom conda environments, you can export those environments from the existing instance and import on the new instance. For information on conda export and import, see [Managing environments](https://docs.conda.io/projects/conda/latest/user-guide/tasks/manage-environments.html) at docs.conda.io.

    For more information on creating and managing a compute instance, see [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).

## Next steps

If you have any further questions or concerns, please contact us at [ubuntu18azureml@service.microsoft.com](mailto:ubuntu18azureml@service.microsoft.com).