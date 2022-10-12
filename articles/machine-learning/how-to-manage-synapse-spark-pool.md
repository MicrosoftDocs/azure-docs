---
title: Attach and manage a Synapse Spark pool in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to attach and manage Spark pools with Azure Synapse 
author: samkemp
ms.author: samkemp
ms.reviewer: scottpolly
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to 
ms.date: 09/30/2022
ms.custom: template-how-to 
---

# Attach and manage a Synapse Spark pool in Azure Machine Learning

The Azure Machine Learning integration with Azure Synapse Analytics (preview) allows you to attach an Apache Spark pool backed by Azure Synapse for machine learning at scale, all within the same Python notebook that you use for training your machine learning models.

In this article, you will learn how to attach a [Synapse Spark Pool](../synapse-analytics/spark/apache-spark-concepts.md#spark-pools) in Azure Machine Learning. You can attach a Synapse Spark Pool in Azure Machine Learning using one of the following ways:

- Using Azure Machine Learning Studio UI
- Using Azure Machine Learning CLI
- Using Azure Machine Learning Python SDK

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription [create a free account](https://azure.microsoft.com/free) before you begin
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md)
- [Create an Azure Synapse Analytics workspace in Azure Portal](./quickstart-create-resources.md)
- [Create Apache Spark pool using the Azure portal](../synapse-analytics/quickstart-create-workspace.md)
- [Configure your development environment](./how-to-configure-environment.md) or [create an Azure Machine Learning compute instance](./concept-compute-instance.md#create)
- [Install the Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/installv2)
- [Install Azure Machine Learning CLI](./how-to-configure-cli.md?tabs=public)

## Attach a Synapse Spark pool
Azure Machine Learning provides multiple options for attaching and managing a Synapse Spark pool.  

# [Studio UI](#tab/studio-ui)

To attach a Synapse Spark Pool using the Studio Compute tab: 

* In the **Manage** section of the left pane, select **Compute**
* Select **Attached computes**

:::image type="content" source="media/how-to-manage-synapse-spark-pool/studio-ui-attach-computes.png" alt-text="Screenshot showing how to attach a Spark pool in the studio ui.":::
* On the **Attached computes** screen, select **New** to see the options for attaching different types of computes
* Select **Synapse Spark pool (preview)**

The **Attach Synapse Spark pool (preview)** dialog will open on the right side of the screen. In this dialog:

1. Enter a **Name**, which will be used for referring to the attached Synapse Spark Pool inside the Azure Machine Learning

1. Select an Azure **Subscription** from the dropdown menu

1. Select a **Synapse workspace** from the dropdown menu

1. Select a **Spark Pool** from the dropdown menu

1. Toggle the **Assign a managed identity** option to enable it

1. Select a managed **Identity type** to use with this attached Synapse Spark Pool

1. Click **Update** to complete the process of attaching the Synapse Spark Pool

# [Notebooks](#tab/notebooks)

To attach a Synapse Spark Pool using Notebooks UI: 

* In the **Author** section of the left pane, select **Notebooks**

* Click the ellipses (…) next to the **Compute selection** menu

* Select **Create compute**

* Select **New Synapse Spark pool (preview)**

The **Attach Synapse Spark pool (preview)** dialog will open on the right side of the screen. In this dialog:

1. Enter a **Name**, which will be used for referring to the attached Synapse Spark Pool inside the Azure Machine Learning

1. Select an Azure **Subscription** from the dropdown menu

1. Select a **Synapse workspace** from the dropdown menu

1. Select a **Spark Pool** from the dropdown menu

1. Toggle the **Assign a managed identity option** to enable it

1. Select a managed **Identity type** to use with this attached Synapse Spark pool

1. Click **Update** to complete the process of attaching the Synapse Spark pool

# [CLI](#tab/cli)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Azure Machine Learning CLI provides ability to attach and manage a Synapse Spark pool from the command line interface, using intuitive YAML syntax and commands.

To define an attached Synapse Spark pool using YAML syntax 

   **Placeholder for link to YAML/CLI Developer Documentation, if available**

these properties should be defined in the YAML file: 

* name – name of the attached Synapse Spark pool

* type – this property should be set to *synapsespark*

* resource_id – this property should provide the resource ID value of the Synapse Spark pool created in the Azure Synapse Analytics workspace. The Azure resource ID includes

- Azure Subscription ID, 

- Resource Group Name, 

- Azure Synapse Analytics Workspace Name

- Name of the Synapse Spark Pool

    ```yaml
    # attached-spark.yaml
    name: my-spark-pool
  
    type: synapsespark

    resource_id: /subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool
    ```

* identity – this property defines the type of identity that should be assigned to the attached Synapse Spark pool. It can take one of these values:

    - system_assigned
    - user_assigned

    ```yaml
    # attached-spark-system-identity.yaml
    name: my-spark-pool
  
    type: synapsespark

    resource_id: /subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool

    identity:
      type: system_assigned
    ```
- For the type **user_assigned**, a list of user_assigned_identities should also be provided. Each user-assigned identity should be declared as an element of the list by using the resource_id of the user-assigned identity. The first user-assigned identity in the list will be used for submitting a job by default.

    ```yml
    # attached-spark-user-identity.yaml
    name: my-spark-pool
  
    type: synapsespark

    resource_id: /subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool

    identity:
      type: user_assigned
      user_assigned_identities:
        - resource_id: /subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/yogi-managed-id
    ```

The YAML files above can be used in az ml compute attach command as the **--file parameter**. A Synapse Spark pool can be attached to an Azure Machine Learning workspace in a specified resource group of a subscription by using the **az ml compute attach** command as shown below: 

   **Place relevant material here or below this point**

```yml
    azureuser@yogi-aml-compute:~/cloudfiles/code/Users/yogipandey/aml_spark$ az ml compute attach --file attached-spark.yaml --subscription 6560575d-fa06-4e7d-95fb-f962e74efd7a -g yogi-res-group -w yogi-aml-ws
    Class SynapseSparkCompute: This is an experimental class, and may change at any time. Please see https://aka.ms/azuremlexperimental for more information.

    {
      "auto_pause_settings": {
        "auto_pause_enabled": true,
        "delay_in_minutes": 15
      },
      "created_on": "2022-09-13 19:01:05.109840+00:00",
      "id": "/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.MachineLearningServices/workspaces/yogi-aml-ws/computes/my-spark-pool",
      "location": "eastus2",
      "name": "my-spark-pool",
      "node_count": 5,
      "node_family": "MemoryOptimized",
      "node_size": "Small",
      "provisioning_state": "Succeeded",
      "resourceGroup": "yogi-res-group",
      "resource_id": "/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool",
      "scale_settings": {
        "auto_scale_enabled": false,
        "max_node_count": 0,
        "min_node_count": 0
      },
      "spark_version": "3.2",
      "type": "synapsespark"
    }

    ```

If the attached Synapse Spark pool, with the name specified in the YAML file, already exists in the workspace, then **az ml compute attach** command execution will update the existing pool with the information provided in the YAML file. Update the

* identity type
* user assigned identities
* tags

values through YAML file definitions.

Details of an attached Synapse Spark pool can be displayed by executing the **az ml compute show** command, with name of the pool passed, using the **--name** parameter, as shown: 

```yml
    azureuser@yogi-aml-compute:~/cloudfiles/code/Users/yogipandey/aml_spark$ az ml compute show --name my-spark-pool
    {
      "auto_pause_settings": {
      "auto_pause_enabled": true,
      "delay_in_minutes": 15
      },
      "created_on": "2022-09-13 19:01:05.109840+00:00",
      "id": "/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.MachineLearningServices/workspaces/yogi-aml-ws/computes/my-spark-pool",
      "location": "eastus2",
      "name": "my-spark-pool",
      "node_count": 5,
      "node_family": "MemoryOptimized",
      "node_size": "Small",
      "provisioning_state": "Succeeded",
      "resourceGroup": "yogi-res-group",
      "resource_id": "/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool",
      "scale_settings": {
        "auto_scale_enabled": false,
        "max_node_count": 0,
        "min_node_count": 0
      },
      "spark_version": "3.2",
      "type": "synapsespark"
    }
    ```

To see a list of all computes, including attached Synapse Spark pools in a workspace, hte **az ml compute list** command can be used, with the name of the workspace passed, using parameter **-w** as shown: 

   ```yml
   azureuser@yogi-aml-compute:~/cloudfiles/code/Users/yogipandey/aml_spark$ az ml compute list -w yogi-aml-ws
    [
      {
        "auto_pause_settings": {
          "auto_pause_enabled": true,
          "delay_in_minutes": 15
        },
        "created_on": "2022-09-09 21:28:54.871251+00:00",
        "id": "/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.MachineLearningServices/workspaces/yogi-aml-ws/computes/yogi-spark-pool",
        "identity": {
          "principal_id": "86e761a6-87f2-4ea1-9ef5-8ce708f0c332",
          "tenant_id": "72f988bf-86f1-41af-91ab-2d7cd011db47",
          "type": "system_assigned"
        },
        "location": "eastus2",
        "name": "yogi-spark-pool",
        "node_count": 5,
        "node_family": "MemoryOptimized",
        "node_size": "Small",
        "provisioning_state": "Succeeded",
        "resourceGroup": "yogi-res-group",
        "resource_id": "/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool",
        "scale_settings": {
          "auto_scale_enabled": false,
          "max_node_count": 0,
          "min_node_count": 0
        },
        "spark_version": "3.2",
        "type": "synapsespark"
      },
      ...
    ]
   ```

# [Python SDK](#tab/sdk)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Azure Machine Learning Python SDK (preview) provides convenient functions for attaching and managing Synapse Spark pool using Python code in Azure Machine Learning Notebooks

   **Placeholder for link to SDK Developer Documentation, if available**

The first step in the process of attaching a Synapse Compute using Python SDK is creating an instance of [azure.ai.ml.MLClient class](/python/api/azure-ai-ml/azure.ai.ml.mlclient), which provides convenient functions for interacting with Azure Machine Learning services. The following code sample uses DefaultAzureCredential for connecting to a workspace in resource group of a specified Azure subscription. The SynapseSparkCompute is defined using a name and resource_id of the Synapse Spark pool created in the Azure Synapse Analytics workspace. An [azure.ai.ml.MLClient.begin_create_or_update()](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-begin-create-or-update) function call attaches the defined Synapse Spark pool to the Azure Machine Learning workspace.

```yml
    # import required libraries 
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import SynapseSparkCompute 
    from azure.identity import DefaultAzureCredential
     
    subscription_id = "6560575d-fa06-4e7d-95fb-f962e74efd7a" 
    resource_group = "yogi-res-group" 
    workspace = "yogi-aml-ws"
    
    ml_client = MLClient(
      DefaultAzureCredential(), subscription_id, resource_group, workspace 
    )
    
    synapse_name = "my-spark-pool" 
    synapse_resource ="/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool" 
    
    synapse_comp = SynapseSparkCompute(name=synapse_name, resource_id=synapse_resource) 
    ml_client.begin_create_or_update(synapse_comp)

    ```

To attach a Synapse Spark pool that uses system-assigned identity, [IdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.entities.identityconfiguration) with type set to SystemAssigned can be passed as the identity parameter of SynapseSparkCompute class. Following code snippet attaches a Synapse Spark pool that uses system-assigned identity.

```yml
    # import required libraries 
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import SynapseSparkCompute, IdentityConfiguration 
    from azure.identity import DefaultAzureCredential
     
    subscription_id = "6560575d-fa06-4e7d-95fb-f962e74efd7a" 
    resource_group = "yogi-res-group" 
    workspace = "yogi-aml-ws"
    
    ml_client = MLClient(
        DefaultAzureCredential(), subscription_id, resource_group, workspace 
    ) 
    
    synapse_name = "my-spark-pool" 
    synapse_resource ="/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool" 
    synapse_identity = IdentityConfiguration(type="SystemAssigned") 
    
    synapse_comp = SynapseSparkCompute(name=synapse_name, resource_id=synapse_resource,identity=synapse_identity) ml_client.begin_create_or_update(synapse_comp) 
    
    ```

To attach a Synapse Spark pool that uses system-assigned identity, [IdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.entities.identityconfiguration) with type set to **SystemAssigned** can be passed as the identity parameter of SynapseSparkCompute class. This code snippet attaches a Synapse Spark pool that uses system-assigned identity:

   ```yml
   # import required libraries 
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import SynapseSparkCompute, IdentityConfiguration 
    from azure.identity import DefaultAzureCredential
     
    subscription_id = "6560575d-fa06-4e7d-95fb-f962e74efd7a" 
    resource_group = "yogi-res-group" 
    workspace = "yogi-aml-ws"
    
    ml_client = MLClient(
        DefaultAzureCredential(), subscription_id, resource_group, workspace 
    ) 
    
    synapse_name = "my-spark-pool" 
    synapse_resource ="/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool" 
    synapse_identity = IdentityConfiguration(type="SystemAssigned") 
    
    synapse_comp = SynapseSparkCompute(name=synapse_name, resource_id=synapse_resource,identity=synapse_identity) ml_client.begin_create_or_update(synapse_comp) 

   ```

Alternatively, a Synapse Spark pool can use a user-assigned identity. For user-assigned identity, a managed identity definition using [IdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.entities.identityconfiguration) class, with type set to **UserAssigned**, can be passed as the identity parameter of SynapseSparkCompute class. Additionally, the parameter **user_assigned_identities**, should also be passed. This parameter is a list of objects of the [UserAssignedIdentity](/python/api/azure-ai-ml/azure.ai.ml.entities.userassignedidentity) class. Each object of this class is populated with the **resource_id** of the user-assigned identity. This code snippet attaches a Synapse Spark pool that uses user-assigned identity:

```yaml
    # import required libraries 
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import SynapseSparkCompute, IdentityConfiguration, UserAssignedIdentity 
    from azure.identity import DefaultAzureCredential
     
    subscription_id = "6560575d-fa06-4e7d-95fb-f962e74efd7a" 
    resource_group = "yogi-res-group" 
    workspace = "yogi-aml-ws"
    
    ml_client = MLClient(
        DefaultAzureCredential(), subscription_id, resource_group, workspace 
    ) 
    
    synapse_name = "my-spark-pool" 
    synapse_resource ="/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourceGroups/yogi-res-group/providers/Microsoft.Synapse/workspaces/yogi-synapse-ws/bigDataPools/yogisparkpool" 
    synapse_identity = IdentityConfiguration(type="UserAssigned",user_assigned_identities= [UserAssignedIdentity(resource_id="/subscriptions/6560575d-fa06-4e7d-95fb-f962e74efd7a/resourcegroups/yogi-res-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/yogi-managed-id")])
    
    synapse_comp = SynapseSparkCompute(name=synapse_name, resource_id=synapse_resource,identity=synapse_identity)
    ml_client.begin_create_or_update(synapse_comp) 

    ```

Note that the azure.ai.ml.MLClient.begin_create_or_update() function attaches a new Synapse Spark pool, if a pool with the specified name does not already exist in the workspace. However, if a Synapse Spark pool with that specified name is already attached to the workspace, a call to the azure.ai.ml.MLClient.begin_create_or_update() function will update the existing attached pool with the new identity or identities.

---

## Add role assignment in Azure Synapse Analytics

To ensure that the attached Synapse Spark Pool functions properly, assign the [Administrator Role](../synapse-analytics/security/synapse-workspace-synapse-rbac.md#roles) to it, from the Azure Synapse Analytics studio UI. This role assignment can be done in the following steps:

* Open your **Synapse Workspace** in Azure portal

* In the left pane, select **Overview**

* Select **Open Synapse Studio**

* In the Azure Synapse Analytics studio, select **Manage** in the left pane

* Select **Access Control** in the **Security** section of the second from the left pane

* Select **Add**

* The **Add role assignment** dialog will open on the right side of the screen. In this dialog:

    1. Select **Workspace item** for **Scope**

    1. In the **Item type** dropdown menu, select **Apache Spark pool**

    1. In the **Item** dropdown menu, select your Apache Spark pool

    1. In **Role** dropdown menu, select **Synapse Administrator**

    1. In the **Select user** search box, start typing the name of your Azure Machine Learning Workspace. It will show you a list of attached Synapse Spark pools. Select your desired Synapse Spark pool from the list

    1. CLick **Apply**

## Update the Synapse Spark pool

Manage the attached Synapse Spark pool from the Azure Machine Learning Studio UI. Spark pool management functionality includes associated managed identity updates for an attached Synapse Spark pool. You can assign a system-assigned or a user-assigned identity while updating a Synapse Spark pool. You should [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity) in Azure portal before assigning it to a Synapse Spark pool.

To update managed identity for the attached Synapse Spark pool:

* Open the **Details** page for the Synapse Spark pool in the Azure Machine Learning Studio

* Locate edit icon located on the right side of **Managed identity** section

* If assigning a managed identity for the first time, toggle **Assign a managed identity** to enable it

* To assign a system-assigned managed identity, select **System-assigned** as the **Identity type**

* Click **Update**

* To assign a user-assigned managed identity, select **User-assigned** as the **Identity type**

* Select an Azure Subscription from the dropdown menu

* Type the first few letters of the name of user-assigned managed identity in the box with text Search by name. A list with matching user-assigned managed identity will appear. Select desired user-assigned managed identity from the list. You can select more than one user-assigned managed identities and assign them to the attached Synapse Spark pool

* Click **Update**

## Detach the Synapse Spark pool

Sometimes we might want to detach an attached Synapse Spark pool, to clean up a workspace. An MLClient.compute.begin_delete() function call will do this for us. Pass the name of the attached Synapse Spark pool, along with the action Detach, to the function. This code snippet detaches a Synapse Spark pool from an Azure Machine Learning workspace:

```yml
  # import required libraries 
  from azure.ai.ml import MLClient
  from azure.ai.ml.entities import SynapseSparkCompute
  from azure.identity import DefaultAzureCredential

  subscription_id = "6560575d-fa06-4e7d-95fb-f962e74efd7a" 
  resource_group = "yogi-res-group" 
  workspace = "yogi-aml-ws" 

  ml_client = MLClient(
      DefaultAzureCredential(), subscription_id, resource_group, workspace 
  )

  synapse_name = "my-spark-pool" 
  ml_client.compute.begin_delete(name=synapse_name, action="Detach")

```

---

# [Studio UI](#tab/studio-ui)

The Azure Machine Learning Studio UI also provides a way to detach an attached Synapse Spark pool. To do this:

* Open the Details page for the Synapse Spark pool in the Azure Machine Learning Studio

* Select **Detach** to detach the attached Synapse Spark pool

  ** Yogi's document had an image here **

# [Notebooks](#tab/notebooks)

# [CLI](#tab/cli)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

An attached pool to an Azure Machine Learning workspace in a specified resource group of a subscription can be detached by executing az ml compute detach command along with name of the pool passed using --name parameter as following:

# [Python SDK](#tab/sdk)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

This can be done by MLClient.compute.begin_delete() function call by passing the name of the attached Synapse Spark pool along with the action Detach. Following code snippet detaches a Synapse Spark pool from an Azure Machine Learning workspace:
---

## Next steps
<!-- Add a context sentence for the following links -->
<!--
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
-->