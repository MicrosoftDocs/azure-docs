---
title: Attach and manage a Synapse Spark pool in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to attach and manage Spark pools with Azure Synapse 
author: ynpandey
ms.author: yogipandey
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to 
ms.date: 05/22/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Attach and manage a Synapse Spark pool in Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to attach a [Synapse Spark Pool](../synapse-analytics/spark/apache-spark-concepts.md#spark-pools) in Azure Machine Learning. You can attach a Synapse Spark Pool in Azure Machine Learning in one of these ways:

- Using Azure Machine Learning studio UI
- Using Azure Machine Learning CLI
- Using Azure Machine Learning Python SDK

## Prerequisites
# [Studio UI](#tab/studio-ui)
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- [Create an Azure Synapse Analytics workspace in Azure portal](../synapse-analytics/quickstart-create-workspace.md).
- [Create an Apache Spark pool using the Azure portal](../synapse-analytics/quickstart-create-apache-spark-pool-portal.md).

# [CLI](#tab/cli)
[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- [Create an Azure Synapse Analytics workspace in Azure portal](../synapse-analytics/quickstart-create-workspace.md).
- [Create an Apache Spark pool using the Azure portal](../synapse-analytics/quickstart-create-apache-spark-pool-portal.md).
- [Create an Azure Machine Learning compute instance](./concept-compute-instance.md#create).
- [Install Azure Machine Learning CLI](./how-to-configure-cli.md?tabs=public).

# [Python SDK](#tab/sdk)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- [Create an Azure Synapse Analytics workspace in Azure portal](../synapse-analytics/quickstart-create-workspace.md).
- [Create an Apache Spark pool using the Azure portal](../synapse-analytics/quickstart-create-apache-spark-pool-portal.md).
- [Configure your development environment](./how-to-configure-environment.md), or [create an Azure Machine Learning compute instance](./concept-compute-instance.md#create).
- [Install the Azure Machine Learning SDK for Python](/python/api/overview/azure/ai-ml-readme).

---

## Attach a Synapse Spark pool in Azure Machine Learning
Azure Machine Learning provides multiple options for attaching and managing a Synapse Spark pool.  

# [Studio UI](#tab/studio-ui)

To attach a Synapse Spark Pool using the Studio Compute tab:

:::image type="content" source="media/how-to-manage-synapse-spark-pool/synapse_compute_synapse_spark_pool.png" alt-text="Screenshot showing creation of a new Synapse Spark Pool.":::

1. In the **Manage** section of the left pane, select **Compute**.
1. Select **Attached computes**.
1. On the **Attached computes** screen, select **New**, to see the options for attaching different types of computes.
2. Select **Synapse Spark pool**.

The **Attach Synapse Spark pool** panel will open on the right side of the screen. In this panel:

1. Enter a **Name**, which refers to the attached Synapse Spark Pool inside the Azure Machine Learning.

2. Select an Azure **Subscription** from the dropdown menu.

3. Select a **Synapse workspace** from the dropdown menu.

4. Select a **Spark Pool** from the dropdown menu.

5. Toggle the **Assign a managed identity** option, to enable it.

6. Select a managed **Identity type** to use with this attached Synapse Spark Pool.

7. Select **Update**, to complete the Synapse Spark Pool attach process.

# [CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

With the Azure Machine Learning CLI, we can attach and manage a Synapse Spark pool from the command line interface, using intuitive YAML syntax and commands.

To define an attached Synapse Spark pool using YAML syntax, the YAML file should cover these properties: 

- `name` – name of the attached Synapse Spark pool.

- `type` – set this property to `synapsespark`.

- `resource_id` – this property should provide the resource ID value of the Synapse Spark pool created in the Azure Synapse Analytics workspace. The Azure resource ID includes

  - Azure Subscription ID, 

  - resource Group Name, 

  - Azure Synapse Analytics Workspace Name, and

  - name of the Synapse Spark Pool.

    ```YAML
    name: <ATTACHED_SPARK_POOL_NAME>
  
    type: synapsespark

    resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>
    ```

- `identity` – this property defines the identity type to assign to the attached Synapse Spark pool. It can take one of these values:

    - `system_assigned`
    - `user_assigned`

        ```YAML
        name: <ATTACHED_SPARK_POOL_NAME>
    
        type: synapsespark

        resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>

        identity:
        type: system_assigned
        ```

- For the `identity` type `user_assigned`, you should also provide a list of `user_assigned_identities` values. Each user-assigned identity should be declared as an element of the list, by using the `resource_id` value of the user-assigned identity. The first user-assigned identity in the list will be used for submitting a job by default.

    ```YAML
    name: <ATTACHED_SPARK_POOL_NAME>
  
    type: synapsespark

    resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>

    identity:
      type: user_assigned
      user_assigned_identities:
        - resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<AML_USER_MANAGED_ID>
    ```

The YAML files above can be used in the `az ml compute attach` command as the `--file` parameter. A Synapse Spark pool can be attached to an Azure Machine Learning workspace, in a specified resource group of a subscription, with the `az ml compute attach` command as shown here:

```azurecli
az ml compute attach --file <YAML_SPECIFICATION_FILE_NAME>.yaml --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME>
```

This sample shows the expected output of the above command:

```azurecli
Class SynapseSparkCompute: This is an experimental class, and may change at any time. Please see https://aka.ms/azuremlexperimental for more information.

{
    "auto_pause_settings": {
    "auto_pause_enabled": true,
    "delay_in_minutes": 15
    },
    "created_on": "2022-09-13 19:01:05.109840+00:00",
    "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.MachineLearningServices/workspaces/<AML_WORKSPACE_NAME>/computes/<ATTACHED_SPARK_POOL_NAME>",
    "location": "eastus2",
    "name": "<ATTACHED_SPARK_POOL_NAME>",
    "node_count": 5,
    "node_family": "MemoryOptimized",
    "node_size": "Small",
    "provisioning_state": "Succeeded",
    "resourceGroup": "<RESOURCE_GROUP>",
    "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>",
    "scale_settings": {
    "auto_scale_enabled": false,
    "max_node_count": 0,
    "min_node_count": 0
    },
    "spark_version": "3.2",
    "type": "synapsespark"
}
```

If the attached Synapse Spark pool, with the name specified in the YAML specification file, already exists in the workspace, then `az ml compute attach` command execution updates the existing pool with the information provided in the YAML specification file. You can update the

- identity type
- user assigned identities
- tags

values through YAML specification file.

To display details of an attached Synapse Spark pool, execute the `az ml compute show` command. Pass the name of the attached Synapse Spark pool with the `--name` parameter, as shown: 

```azurecli
az ml compute show --name <ATTACHED_SPARK_POOL_NAME> --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME>
```

This sample shows the expected output of the above command:

```azurecli
<ATTACHED_SPARK_POOL_NAME>
{
    "auto_pause_settings": {
    "auto_pause_enabled": true,
    "delay_in_minutes": 15
    },
    "created_on": "2022-09-13 19:01:05.109840+00:00",
    "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.MachineLearningServices/workspaces/<AML_WORKSPACE_NAME>/computes/<ATTACHED_SPARK_POOL_NAME>",
    "location": "eastus2",
    "name": "<ATTACHED_SPARK_POOL_NAME>",
    "node_count": 5,
    "node_family": "MemoryOptimized",
    "node_size": "Small",
    "provisioning_state": "Succeeded",
    "resourceGroup": "<RESOURCE_GROUP>",
    "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>",
    "scale_settings": {
    "auto_scale_enabled": false,
    "max_node_count": 0,
    "min_node_count": 0
    },
    "spark_version": "3.2",
    "type": "synapsespark"
}
```

To see a list of all computes, including the attached Synapse Spark pools in a workspace, use the `az ml compute list` command. Use the name parameter to pass the name of the workspace, as shown: 

```azurecli
az ml compute list --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME>
```

This sample shows the expected output of the above command:

```azurecli
[
    {
    "auto_pause_settings": {
        "auto_pause_enabled": true,
        "delay_in_minutes": 15
    },
    "created_on": "2022-09-09 21:28:54.871251+00:00",
    "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.MachineLearningServices/workspaces/<AML_WORKSPACE_NAME>/computes/<ATTACHED_SPARK_POOL_NAME>",
    "identity": {
        "principal_id": "<PRINCIPAL_ID>",
        "tenant_id": "<TENANT_ID>",
        "type": "system_assigned"
    },
    "location": "eastus2",
    "name": "<ATTACHED_SPARK_POOL_NAME>",
    "node_count": 5,
    "node_family": "MemoryOptimized",
    "node_size": "Small",
    "provisioning_state": "Succeeded",
    "resourceGroup": "<RESOURCE_GROUP>",
    "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>",
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

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Azure Machine Learning Python SDK provides convenient functions for attaching and managing Synapse Spark pool, using Python code in Azure Machine Learning Notebooks.

To attach a Synapse Compute using Python SDK, first create an instance of [azure.ai.ml.MLClient class](/python/api/azure-ai-ml/azure.ai.ml.mlclient). This provides convenient functions for interaction with Azure Machine Learning services. The following code sample uses `azure.identity.DefaultAzureCredential` for connecting to a workspace in resource group of a specified Azure subscription. In the following code sample, define the `SynapseSparkCompute` with the parameters:
- `name` - user-defined name of the new attached Synapse Spark pool. 
- `resource_id` - resource ID of the Synapse Spark pool created earlier in the Azure Synapse Analytics workspace.

An [azure.ai.ml.MLClient.begin_create_or_update()](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-begin-create-or-update) function call attaches the defined Synapse Spark pool to the Azure Machine Learning workspace.

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import SynapseSparkCompute
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace_name
)

synapse_name = "<ATTACHED_SPARK_POOL_NAME>"
synapse_resource = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>"

synapse_comp = SynapseSparkCompute(name=synapse_name, resource_id=synapse_resource)
ml_client.begin_create_or_update(synapse_comp)
```

To attach a Synapse Spark pool that uses system-assigned identity, pass [IdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.entities.identityconfiguration), with type set to `SystemAssigned`, as the `identity` parameter of the `SynapseSparkCompute` class. This code snippet attaches a Synapse Spark pool that uses system-assigned identity.

```python
# import required libraries
from azure.ai.ml import MLClient
from azure.ai.ml.entities import SynapseSparkCompute, IdentityConfiguration
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace_name
)

synapse_name = "<ATTACHED_SPARK_POOL_NAME>"
synapse_resource = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>"
synapse_identity = IdentityConfiguration(type="SystemAssigned")

synapse_comp = SynapseSparkCompute(
    name=synapse_name, resource_id=synapse_resource, identity=synapse_identity
)
ml_client.begin_create_or_update(synapse_comp)
```

A Synapse Spark pool can also use a user-assigned identity. For a user-assigned identity, you can pass a managed identity definition, using the [IdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.entities.identityconfiguration) class, as the `identity` parameter of the `SynapseSparkCompute` class. For the managed identity definition used in this way, set the `type` to `UserAssigned`. In addition, pass a `user_assigned_identities` parameter. The parameter `user_assigned_identities` is a list of objects of the UserAssignedIdentity class. The `resource_id`of the user-assigned identity populates each `UserAssignedIdentity` class object. This code snippet attaches a Synapse Spark pool that uses a user-assigned identity:

```python
# import required libraries
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    SynapseSparkCompute,
    IdentityConfiguration,
    UserAssignedIdentity,
)
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace_name
)

synapse_name = "<ATTACHED_SPARK_POOL_NAME>"
synapse_resource = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>"
synapse_identity = IdentityConfiguration(
    type="UserAssigned",
    user_assigned_identities=[
        UserAssignedIdentity(
            resource_id="/subscriptions/<SUBSCRIPTION_ID/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<AML_USER_MANAGED_ID>"
        )
    ],
)

synapse_comp = SynapseSparkCompute(
    name=synapse_name, resource_id=synapse_resource, identity=synapse_identity
)
ml_client.begin_create_or_update(synapse_comp)
```

> [!NOTE] 
> The `azure.ai.ml.MLClient.begin_create_or_update()` function attaches a new Synapse Spark pool, if a pool with the specified name does not already exist in the workspace. However, if a Synapse Spark pool with that specified name is already attached to the workspace, a call to the `azure.ai.ml.MLClient.begin_create_or_update()` function will update the existing attached pool with the new identity or identities.

---

## Add role assignments in Azure Synapse Analytics

To ensure that the attached Synapse Spark Pool works properly, assign the [Administrator Role](../synapse-analytics/security/synapse-workspace-synapse-rbac.md#roles) to it, from the Azure Synapse Analytics studio UI. The following steps show how to do it:

1. Open your **Synapse Workspace** in Azure portal.

1. In the left pane, select **Overview**.

    :::image type="content" source="media/how-to-manage-synapse-spark-pool/synapse-workspace-open-synapse-studio.png" alt-text="Screenshot showing Open Synapse Studio.":::
1. Select **Open Synapse Studio**.

1. In the Azure Synapse Analytics studio, select **Manage** in the left pane.

1. Select **Access Control** in the **Security** section of the left pane, second from the left.

1. Select **Add**.

1. The **Add role assignment** panel will open on the right side of the screen. In this panel:

    1. Select **Workspace item** for **Scope**.

    1. In the **Item type** dropdown menu, select **Apache Spark pool**.

    1. In the **Item** dropdown menu, select your Apache Spark pool.

    1. In **Role** dropdown menu, select **Synapse Administrator**.

    1. In the **Select user** search box, start typing the name of your Azure Machine Learning Workspace. It shows you a list of attached Synapse Spark pools. Select your desired Synapse Spark pool from the list.

    1. Select **Apply**.

        :::image type="content" source="media/how-to-manage-synapse-spark-pool/workspace-add-role-assignment.png" alt-text="Screenshot showing Add Role Assignment.":::

## Update the Synapse Spark Pool

# [Studio UI](#tab/studio-ui)

You can manage the attached Synapse Spark pool from the Azure Machine Learning studio UI. Spark pool management functionality includes associated managed identity updates for an attached Synapse Spark pool. You can assign a system-assigned or a user-assigned identity while updating a Synapse Spark pool. You should [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity) in Azure portal, before assigning it to a Synapse Spark pool.

To update managed identity for the attached Synapse Spark pool:

:::image type="content" source="media/how-to-manage-synapse-spark-pool/synapse_compute_update_managed_identity.png" alt-text="Screenshot showing Synapse Spark Pool managed identity update.":::

1. Open the **Details** page for the Synapse Spark pool in the Azure Machine Learning studio.

1. Find the edit icon, located on the right side of the **Managed identity** section.

1. To assign a managed identity for the first time, toggle **Assign a managed identity** to enable it.

1. To assign a system-assigned managed identity:
   1.  Select **System-assigned** as the **Identity type**.
   1.  Select **Update**.

1. To assign a user-assigned managed identity:
   1. Select **User-assigned** as the **Identity type**.
   1. Select an Azure **Subscription** from the dropdown menu.
   1. Type the first few letters of the name of user-assigned managed identity in the box showing text **Search by name**. A list with matching user-assigned managed identity names appears. Select the user-assigned managed identity you want from the list. You can select multiple user-assigned managed identities, and assign them to the attached Synapse Spark pool.
   1. Select **Update**.

# [CLI](#tab/cli)
[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]
Execute the `az ml compute update` command, with appropriate parameters, to update the identity associated with an attached Synapse Spark pool. To assign a system-assigned identity, set the `--identity` parameter in the command to `SystemAssigned`, as shown:

```azurecli
az ml compute update --identity SystemAssigned --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME> --name <ATTACHED_SPARK_POOL_NAME>
```

This sample shows the expected output of the above command:

```azurecli
Class SynapseSparkCompute: This is an experimental class, and may change at any time. Please see https://aka.ms/azuremlexperimental for more information.
{
    "auto_pause_settings": {
    "auto_pause_enabled": true,
    "delay_in_minutes": 15
    },
    "created_on": "2022-09-13 20:02:15.746490+00:00",
    "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.MachineLearningServices/workspaces/<AML_WORKSPACE_NAME>/computes/<ATTACHED_SPARK_POOL_NAME>",
    "identity": {
    "principal_id": "<PRINCIPAL_ID>",
    "tenant_id": "<TENANT_ID>",
    "type": "system_assigned"
    },
    "location": "eastus2",
    "name": "<ATTACHED_SPARK_POOL_NAME>",
    "node_count": 5,
    "node_family": "MemoryOptimized",
    "node_size": "Small",
    "provisioning_state": "Succeeded",
    "resourceGroup": "<RESOURCE_GROUP>",
    "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<AML_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>",
    "scale_settings": {
    "auto_scale_enabled": false,
    "max_node_count": 0,
    "min_node_count": 0
    },
    "spark_version": "3.2",
    "type": "synapsespark"
}
```

To assign a user-assigned identity, set the parameter `--identity` in the command to `UserAssigned`. Additionally, you should pass the resource ID, for the user-assigned identity, using the `--user-assigned-identities` parameter as shown:

```azurecli
az ml compute update --identity UserAssigned --user-assigned-identities /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<AML_USER_MANAGED_ID> --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME> --name <ATTACHED_SPARK_POOL_NAME>
```

This sample shows the expected output of the above command:

```azurecli
Class SynapseSparkCompute: This is an experimental class, and may change at any time. Please see https://aka.ms/azuremlexperimental for more information.
{
  "auto_pause_settings": {
    "auto_pause_enabled": true,
    "delay_in_minutes": 15
  },
  "created_on": "2022-09-13 20:02:15.746490+00:00",
  "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.MachineLearningServices/workspaces/<AML_WORKSPACE_NAME>/computes/<ATTACHED_SPARK_POOL_NAME>",
  "identity": {
    "type": "user_assigned",
    "user_assigned_identities": [
      {
        "client_id": "<CLIENT_ID>",
        "principal_id": "<PRINCIPAL_ID>",
        "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<AML_USER_MANAGED_ID>"
      }
    ]
  },
  "location": "eastus2",
  "name": "<ATTACHED_SPARK_POOL_NAME>",
  "node_count": 5,
  "node_family": "MemoryOptimized",
  "node_size": "Small",
  "provisioning_state": "Succeeded",
  "resourceGroup": "<RESOURCE_GROUP>",
  "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>",
  "scale_settings": {
    "auto_scale_enabled": false,
    "max_node_count": 0,
    "min_node_count": 0
  },
  "spark_version": "3.2",
  "type": "synapsespark"
}
```

> [!NOTE]
> The parameter `--user-assigned-identities` can take a list of resource IDs and assign multiple user-defined identities to an attached Synapse Spark pool. The first user-assigned identity in the list will be used for submitting a job by default.

# [Python SDK](#tab/sdk)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]
To use system-assigned identity, pass `IdentityConfiguration`, with type set to `SystemAssigned`, as the `identity` parameter of the `SynapseSparkCompute` class. This code snippet updates a Synapse Spark pool to use a system-assigned identity:

```python
# import required libraries 
from azure.ai.ml import MLClient
from azure.ai.ml.entities import SynapseSparkCompute, IdentityConfiguration 
from azure.identity import DefaultAzureCredential
    
subscription_id = "<SUBSCRIPTION_ID>" 
resource_group_name = "<RESOURCE_GROUP>" 
workspace_name = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace 
) 

synapse_name = "<ATTACHED_SPARK_POOL_NAME>" 
synapse_resource ="/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>" 
synapse_identity = IdentityConfiguration(type="SystemAssigned") 

synapse_comp = SynapseSparkCompute(name=synapse_name, resource_id=synapse_resource,identity=synapse_identity) ml_client.begin_create_or_update(synapse_comp) 
```

A Synapse Spark pool can also use a user-assigned identity. For a user-assigned identity, you can pass a managed identity definition, using the [IdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.entities.identityconfiguration) class, as the `identity` parameter of the `SynapseSparkCompute` class. For the managed identity definition used in this way, set the `type` to `UserAssigned`. In addition, pass a `user_assigned_identities` parameter. The parameter `user_assigned_identities` is a list of objects of the UserAssignedIdentity class. The `resource_id`of the user-assigned identity populates each `UserAssignedIdentity` class object. This code snippet updates a Synapse Spark pool to use a user-assigned identity:

```python
# import required libraries
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    SynapseSparkCompute,
    IdentityConfiguration,
    UserAssignedIdentity,
)
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace_name
)

synapse_name = "<ATTACHED_SPARK_POOL_NAME>"
synapse_resource = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Synapse/workspaces/<SYNAPSE_WORKSPACE_NAME>/bigDataPools/<SPARK_POOL_NAME>"
synapse_identity = IdentityConfiguration(
    type="UserAssigned",
    user_assigned_identities=[
        UserAssignedIdentity(
            resource_id="/subscriptions/<SUBSCRIPTION_ID/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<AML_USER_MANAGED_ID>"
        )
    ],
)

synapse_comp = SynapseSparkCompute(
    name=synapse_name, resource_id=synapse_resource, identity=synapse_identity
)
ml_client.begin_create_or_update(synapse_comp)
```

> [!NOTE]
> If a pool with the specified name does not already exist in the workspace, the `azure.ai.ml.MLClient.begin_create_or_update()` function will attach a new Synapse Spark pool. However, if a Synapse Spark pool, with the specified name, is already attached to the workspace, an `azure.ai.ml.MLClient.begin_create_or_update()` function call will update the existing attached pool, with the new identity or identities.

---

## Detach the Synapse Spark pool

We might want to detach an attached Synapse Spark pool, to clean up a workspace.

---

# [Studio UI](#tab/studio-ui)

The Azure Machine Learning studio UI also provides a way to detach an attached Synapse Spark pool. Follow these steps to do this:

1. Open the **Details** page for the Synapse Spark pool, in the Azure Machine Learning studio.

1. Select **Detach**, to detach the attached Synapse Spark pool.

# [CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

An attached Synapse Spark pool can be detached by executing the `az ml compute detach` command with name of the pool passed using `--name` parameter as shown here:

```azurecli
az ml compute detach --name <ATTACHED_SPARK_POOL_NAME> --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME>
```

This sample shows the expected output of the above command:

```azurecli 
Are you sure you want to perform this operation? (y/n): y
```

# [Python SDK](#tab/sdk)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

 We'll use an `MLClient.compute.begin_delete()` function call. Pass the `name` of the attached Synapse Spark pool, along with the action `Detach`, to the function. This code snippet detaches a Synapse Spark pool from an Azure Machine Learning workspace:

```python
# import required libraries
from azure.ai.ml import MLClient
from azure.ai.ml.entities import SynapseSparkCompute
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace_name
)

synapse_name = "<ATTACHED_SPARK_POOL_NAME>"
ml_client.compute.begin_delete(name=synapse_name, action="Detach")
```
---

## Serverless Spark compute in Azure Machine Learning

Some user scenarios may require access to a serverless Spark compute, during an Azure Machine Learning job submission, without a need to attach a Spark pool. The Azure Synapse Analytics integration with Azure Machine Learning also provides a serverless Spark compute experience. This allows access to a Spark compute in a job, without a need to attach the compute to a workspace first. [Learn more about the serverless Spark compute experience](interactive-data-wrangling-with-apache-spark-azure-ml.md).

## Next steps

- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning](./interactive-data-wrangling-with-apache-spark-azure-ml.md)

- [Submit Spark jobs in Azure Machine Learning](./how-to-submit-spark-jobs.md)
