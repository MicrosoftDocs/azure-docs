---
title: Create a linked service with Synapse and Azure Machine Learning workspaces (deprecated)
titleSuffix: Azure Machine Learning
description: Learn how to link Azure Synapse and Azure Machine Learning workspaces, and attach Apache Spark pools for a unified data wrangling experience. 
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: franksolomon
ms.date: 11/04/2022
ms.custom: UpdateFrequency5, devx-track-python, data4ml, synapse-azureml, contperf-fy21q4, sdkv1, event-tier1-build-2022
#Customer intent: As a workspace administrator, I want to link Azure Synapse workspaces and Azure Machine Learning workspaces and attach Apache Spark pools for a unified data wrangling experience.
---

# Link Azure Synapse Analytics and Azure Machine Learning workspaces and attach Apache Spark pools(deprecated)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

> [!WARNING]
> The Azure Synapse Analytics integration with Azure Machine Learning available in Python SDK v1 is deprecated. Users can continue using Synapse workspace registered with Azure Machine Learning as a linked service. However, a new Synapse workspace can no longer be registered with Azure Machine Learning as a linked service. We recommend using Managed (Automatic) Synapse compute and attached Synapse Spark pools available in CLI v2 and Python SDK v2. Please see [https://aka.ms/aml-spark](https://aka.ms/aml-spark) for more details.

In this article, you learn how to create a linked service that links your [Azure Synapse Analytics](../../synapse-analytics/overview-what-is.md) workspace and [Azure Machine Learning workspace](../concept-workspace.md). 

With your Azure Machine Learning workspace linked with your Azure Synapse workspace, you can attach an Apache Spark pool, powered by Azure Synapse Analytics, as a dedicated compute for data wrangling at scale or conduct model training all from the same Python notebook.

You can link your ML workspace and Synapse workspace via the [Python SDK](#link-sdk) or the [Azure Machine Learning studio](#link-studio).

You can also link workspaces and attach a Synapse Spark pool with a single [Azure Resource Manager (ARM) template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-linkedservice-create/azuredeploy.json).

## Prerequisites

* [Create an Azure Machine Learning workspace](../quickstart-create-resources.md).

* [Create a Synapse workspace in Azure portal](../../synapse-analytics/quickstart-create-workspace.md).

* [Create Apache Spark pool using Azure portal, web tools, or Synapse Studio](../../synapse-analytics/quickstart-create-apache-spark-pool-studio.md)

* Install the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro)

* Access to the [Azure Machine Learning studio](https://ml.azure.com/).

<a name="link-sdk"></a>
## Link workspaces with the Python SDK

> [!IMPORTANT]
> To link to the Synapse workspace successfully, you must be granted the **Owner** role of the Synapse workspace. Check your access in the [Azure portal](https://portal.azure.com/).
>
> If you are not an **Owner** and are only a **Contributor** to the Synapse workspace, you can only use existing linked services. See how to [Retrieve and use an existing linked service](#get-an-existing-linked-service).

The following code employs the [`LinkedService`](/python/api/azureml-core/azureml.core.linked_service.linkedservice) and [`SynapseWorkspaceLinkedServiceConfiguration`](/python/api/azureml-core/azureml.core.linked_service.synapseworkspacelinkedserviceconfiguration) classes to,

* Link your machine learning workspace, `ws` with your Azure Synapse workspace.
* Register your Synapse workspace with Azure Machine Learning as a linked service.

``` python
import datetime  
from azureml.core import Workspace, LinkedService, SynapseWorkspaceLinkedServiceConfiguration

# Azure Machine Learning workspace
ws = Workspace.from_config()

#link configuration 
synapse_link_config = SynapseWorkspaceLinkedServiceConfiguration(
    subscription_id=ws.subscription_id,
    resource_group= 'your resource group',
    name='mySynapseWorkspaceName')

# Link workspaces and register Synapse workspace in Azure Machine Learning
linked_service = LinkedService.register(workspace = ws,              
                                            name = 'synapselink1',    
                                            linked_service_config = synapse_link_config)
```

> [!IMPORTANT] 
> A managed identity, `system_assigned_identity_principal_id`, is created for each linked service. This managed identity must be granted the **Synapse Apache Spark Administrator** role of the Synapse workspace before you start your Synapse session. [Assign the Synapse Apache Spark Administrator role to the managed identity in the Synapse Studio](../../synapse-analytics/security/how-to-manage-synapse-rbac-role-assignments.md).
>
> To find the `system_assigned_identity_principal_id` of a specific linked service, use `LinkedService.get('<your-mlworkspace-name>', '<linked-service-name>')`.

### Manage linked services

View all the linked services associated with your machine learning workspace.

```python
LinkedService.list(ws)
```

To unlink your workspaces, use the `unregister()` method

``` python
linked_service.unregister()
```

<a name="link-studio"></a>
## Link workspaces via studio

Link your machine learning workspace and Synapse workspace via the Azure Machine Learning studio with the following steps: 

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com/).
1. Select **Linked Services** in the **Manage** section of the left pane.
1. Select **Add integration**.
1. On the **Link workspace** form, populate the fields

    |Field| Description    
    |---|---
    |Name| Provide a name for your linked service. This name is what will be used to reference to this particular linked service.
    |Subscription name | Select the name of your subscription that's associated with your machine learning workspace. 
    |Synapse workspace | Select the Synapse workspace you want to link to.
    
1. Select **Next** to open the **Select Spark pools (optional)** form. On this form, you select which Synapse Spark pool to attach to your workspace

1. Select **Next** to open the **Review** form and check your selections.
1. Select **Create** to complete the linked service creation process.

## Get an existing linked service

Before you can attach a dedicated compute for data wrangling, you must have an ML workspace that's linked to an Azure Synapse Analytics workspace, this is referred to as a linked service. 

To retrieve and use an existing linked service, requires **User or Contributor** permissions to the **Azure Synapse Analytics workspace**.

This example retrieves an existing linked service, `synapselink1`, from the workspace, `ws`, with the [`get()`](/python/api/azureml-core/azureml.core.linkedservice#get-workspace--name-) method.
```python
from azureml.core import LinkedService

linked_service = LinkedService.get(ws, 'synapselink1')
```

## Attach Synapse Spark pool as a compute

Once you retrieve the linked service, attach a Synapse Apache Spark pool as a dedicated compute resource for your data wrangling tasks. 

You can attach Apache Spark pools via,
* Azure Machine Learning studio
* [Azure Resource Manager (ARM) templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-linkedservice-create/azuredeploy.json)
* The Azure Machine Learning Python SDK 

### Attach a pool via the studio
Follow these steps: 

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com/).
1. Select **Linked Services** in the **Manage** section of the left pane.
1. Select your Synapse workspace.
1. Select **Attached Spark pools** on the top left. 
1. Select **Attach**. 
1. Select your Apache Spark pool from the list and provide a name.  
    1. This list identifies the available Synapse Spark pools that can be attached to your compute. 
    1. To create a new Synapse Spark pool, see [Create Apache Spark pool with the Synapse Studio](../../synapse-analytics/quickstart-create-apache-spark-pool-portal.md)
1. Select **Attach selected**. 

### Attach a pool with the Python SDK

You can also employ the **Python SDK** to attach an Apache Spark pool. 

The follow code, 
1. Configures the [`SynapseCompute`](/python/api/azureml-core/azureml.core.compute.synapsecompute) with,

   1. The [`LinkedService`](/python/api/azureml-core/azureml.core.linkedservice), `linked_service` that you either created or retrieved in the previous step. 
   1. The type of compute target you want to attach, `SynapseSpark`
   1. The name of the Apache Spark pool. This must match an existing Apache Spark pool that is in your Azure Synapse Analytics workspace.
   
1. Creates a machine learning [`ComputeTarget`](/python/api/azureml-core/azureml.core.computetarget) by passing in, 
   1. The machine learning workspace you want to use, `ws`
   1. The name you'd like to refer to the compute within the Azure Machine Learning workspace. 
   1. The attach_configuration you specified  when configuring your Synapse Compute.
       1. The call to ComputeTarget.attach() is asynchronous, so the sample blocks until the call completes.

```python
from azureml.core.compute import SynapseCompute, ComputeTarget

attach_config = SynapseCompute.attach_configuration(linked_service, #Linked synapse workspace alias
                                                    type='SynapseSpark', #Type of assets to attach
                                                    pool_name=synapse_spark_pool_name) #Name of Synapse spark pool 

synapse_compute = ComputeTarget.attach(workspace= ws,                
                                       name= synapse_compute_name, 
                                       attach_configuration= attach_config
                                      )

synapse_compute.wait_for_completion()
```

Verify the Apache Spark pool is attached.

```python
ws.compute_targets['Synapse Spark pool alias']
```

## Next steps

* [How to data wrangle with Azure Synapse (preview)](how-to-data-prep-synapse-spark-pool.md).
* [How to use Apache Spark in your machine learning pipeline with Azure Synapse (preview)](how-to-use-synapsesparkstep.md)
* [Train a model](how-to-set-up-training-targets.md).
* [How to securely integrate Azure Synapse and Azure Machine Learning workspaces](../how-to-private-endpoint-integration-synapse.md).