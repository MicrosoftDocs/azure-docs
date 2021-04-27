---
title: Create a linked service with Synapse and Azure Machine Learning workspaces (preview)
titleSuffix: Azure Machine Learning
description: Learn how to link Azure Synapse and Azure Machine Learning workspaces for a unified data wrangling experience. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: nibaccam
author: nibaccam
ms.reviewer: nibaccam
ms.date: 03/08/2021
ms.custom: devx-track-python, data4ml, synapse-azureml


# Customer intent: As a workspace administrator, I want to link Azure Synapse workspaces and Azure Machine Learning workspaces for a unified data wrangling experience.
---

# Link Azure Synapse Analytics and Azure Machine Learning workspaces (preview)

In this article, you learn how to create a linked service that links your [Azure Synapse Analytics](/azure/synapse-analytics/overview-what-is) workspace and [Azure Machine Learning workspace](concept-workspace.md).

With your Azure Machine Learning workspace linked with your Azure Synapse workspace, you can attach an Apache Spark pool as a dedicated compute for data wrangling at scale or conduct model training all from the same Python notebook.

You can link your ML workspace and Synapse workspace via the [Python SDK](#link-sdk) or the [Azure Machine Learning studio](#link-studio).

You can also link workspaces and attach a Synapse Spark pool with a single [Azure Resource Manager (ARM) template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-machine-learning-linkedservice-create/azuredeploy.json).

>[!IMPORTANT]
> The Azure Machine Learning and Azure Synapse integration is in public preview. The functionalities presented from the `azureml-synapse` package are [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview features, and may change at any time.

## Prerequisites

* [Create an Azure Machine Learning workspace](how-to-manage-workspace.md?tabs=python).

* [Create a Synapse workspace in Azure portal](/azure/synapse-analytics/quickstart-create-workspace).

* [Create Apache Spark pool using Azure portal, web tools or Synapse Studio](/azure/synapse-analytics/quickstart-create-apache-spark-pool-studio)

* Install the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro)

* Access to the [Azure Machine Learning studio](https://ml.azure.com/).

<a name="link-sdk"></a>
## Link workspaces with the Python SDK

> [!IMPORTANT]
> To link to the Synapse workspace successfully, you must be granted the **Owner** role of the Synapse workspace. Check your access in the [Azure portal](https://ms.portal.azure.com/).
>
> If you are not an **Owner** and are only a **Contributor** to the Synapse workspace, you can only use existing linked services. See how to [Retrive and use an existing linked service](how-to-data-prep-synapse-spark-pool.md#get-an-existing-linked-service).

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
> A managed identity, `system_assigned_identity_principal_id`, is created for each linked service. This managed identity must be granted the **Synapse Apache Spark Administrator** role of the Synapse workspace before you start your Synapse session. [Assign the Synapse Apache Spark Administrator role to the managed identity in the Synapse Studio](../synapse-analytics/security/how-to-manage-synapse-rbac-role-assignments.md).
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

## Next steps

* [Attach Synapse Spark pools for data preparation with Azure Synapse (preview)](how-to-data-prep-synapse-spark-pool.md).
* [How to use Apache Spark in your machine learning pipeline with Azure Synapse (preview)](how-to-use-synapsesparkstep.md)
* [Train a model](how-to-set-up-training-targets.md).
