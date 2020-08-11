---
title: Create compute resources in studio
titleSuffix: Azure Machine Learning
description: Configure the training environments (compute targets) for machine learning model training. You can easily switch between training environments. Start training locally. If you need to scale out, switch to a cloud-based compute target.
services: machine-learning
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 08/06/2020
ms.topic: conceptual
ms.custom: how-to
---
# Create compute targets for model training and deployment in Azure Machine Learning studio
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

With Azure Machine Learning, you can train your model on a variety of resources or environments, collectively referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.  You can also create compute targets for model deployment as described in ["Where and how to deploy your models"](how-to-deploy-and-where.md).

In this article, you create and manage compute targets with the Azure Machine studio.  You can also create and manage compute targets with:

* [Azure Machine Learning Learning SDK](how-to-create-attach-compute-sdk.md), 
* The [CLI extension](reference-azure-machine-learning-cli.md#resource-management) for Azure Machine Learning
* The [VS Code extension](how-to-manage-resources-vscode.md#compute-clusters) for Azure Machine Learning.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today
* An [Azure Machine Learning workspace](how-to-manage-workspace.md)

## Manage compute targets

You can access the compute targets that are associated with your workspace in the Azure Machine Learning studio.  You can use the studio to:

* [View  compute targets](#portal-view) attached to your workspace
* [Create a compute target](#portal-create) in your workspace
* [Attach a compute target](#portal-reuse) that was created outside the workspace


After a target is created and attached to your workspace, you use it in your [run configuration](how-to-submit-training.md#) with a `ComputeTarget` object: 

```python
from azureml.core.compute import ComputeTarget
myvm = ComputeTarget(workspace=ws, name='my-vm-name')
```

### <a id="portal-view"></a>View compute targets


To see the compute targets for your workspace, use the following steps:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
 
1. Under __Applications__, select __Compute__.

    [![View compute tab](./media/how-to-set-up-training-targets/azure-machine-learning-service-workspace.png)](./media/how-to-set-up-training-targets/azure-machine-learning-service-workspace-expanded.png)

### <a id="portal-create"></a>Create a compute target

Follow the previous steps to view the list of compute targets. Then use these steps to create a compute target: 

1. Select the plus sign (+) to add a compute target.

    ![Add a compute target](./media/how-to-set-up-training-targets/add-compute-target.png) 

1. Enter a name for the compute target. 

1. Select **Machine Learning Compute** as the type of compute to use for __Training__. 

    >[!NOTE]
    >Azure Machine Learning Compute is the only  managed-compute resource you can create in Azure Machine Learning studio.  All other compute resources can be attached after they are created.

1. Fill out the form. Provide values for the required properties, especially **VM Family**, and the **maximum nodes** to use to spin up the compute.  

1. Select __Create__.


1. View the status of the create operation by selecting the compute target from the list:

    ![Select a compute target to view the create operation status](./media/how-to-set-up-training-targets/View_list.png)

1. You then see the details for the compute target: 

    ![View the computer target details](./media/how-to-set-up-training-targets/compute-target-details.png) 

### <a id="portal-reuse"></a>Attach compute targets

To use compute targets created outside the Azure Machine Learning workspace, you must attach them. Attaching a compute target makes it available to your workspace.

Follow the steps described earlier to view the list of compute targets. Then use the following steps to attach a compute target: 

1. Select the plus sign (+) to add a compute target. 
1. Enter a name for the compute target. 
1. Select the type of compute to attach for __Training__:

    > [!IMPORTANT]
    > Not all compute types can be attached from Azure Machine Learning studio. 
    > The compute types that can currently be attached for training include:
    >
    > * A remote VM
    > * Azure Databricks (for use in machine learning pipelines)
    > * Azure Data Lake Analytics (for use in machine learning pipelines)
    > * Azure HDInsight

1. Fill out the form and provide values for the required properties.

    > [!NOTE]
    > Microsoft recommends that you use SSH keys, which are more secure than passwords. Passwords are vulnerable to brute force attacks. SSH keys rely on cryptographic signatures. For information on how to create SSH keys for use with Azure Virtual Machines, see the following documents:
    >
    > * [Create and use SSH keys on Linux or macOS](https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys)
    > * [Create and use SSH keys on Windows](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows)

1. Select __Attach__. 
1. View the status of the attach operation by selecting the compute target from the list.


## Next steps

* Use the compute resource to [submit a training run](how-to-submit-training.md).
* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* Learn how to [efficiently tune hyperparameters](how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [RunConfiguration class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.runconfiguration?view=azure-ml-py) SDK reference.
* [Use Azure Machine Learning with Azure Virtual Networks](how-to-enable-virtual-network.md)
