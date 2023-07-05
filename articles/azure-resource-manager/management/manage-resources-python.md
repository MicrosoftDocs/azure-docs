---
title: Manage resources - Python
description: Use Python and Azure Resource Manager to manage your resources. Shows how to deploy and delete resources. 
ms.topic: conceptual
ms.date: 04/21/2023
ms.custom: devx-track-arm-template, devx-track-python
content_well_notification: 
  - AI-contribution
---

# Manage Azure resources by using Python

Learn how to use Azure Python with [Azure Resource Manager](overview.md) to manage your Azure resources. For managing resource groups, see [Manage Azure resource groups by using Python](manage-resource-groups-python.md).

## Deploy resources to an existing resource group

You can deploy Azure resources directly by using Python, or deploy an Azure Resource Manager template (ARM template) to create Azure resources.

### Deploy resources by using Python classes

The following example creates a storage account by using [StorageManagementClient.storage_accounts.begin_create](/python/api/azure-mgmt-storage/azure.mgmt.storage.v2022_09_01.operations.storageaccountsoperations#azure-mgmt-storage-v2022-09-01-operations-storageaccountsoperations-begin-create). The name for the storage account must be unique across Azure.

```python
import os
import random
from azure.identity import AzureCliCredential
from azure.mgmt.storage import StorageManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

random_postfix = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz1234567890', k=13))
storage_account_name = "demostore" + random_postfix

storage_client = StorageManagementClient(credential, subscription_id)

storage_account_result = storage_client.storage_accounts.begin_create(
    "exampleGroup",
    storage_account_name,
    {
        "location": "westus",
        "sku": {
            "name": "Standard_LRS"
        }
    }
)
```

### Deploy a template

To deploy an ARM template, use [ResourceManagementClient.deployments.begin_create_or_update](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update). The following example deploys a [remote template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.storage/storage-account-create). That template creates a storage account.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = input("Enter the resource group name: ")
location = input("Enter the location (i.e. centralus): ")
template_uri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json"

rg_deployment_result = resource_client.deployments.begin_create_or_update(
    resource_group_name,
    "exampleDeployment",
    {
        "properties": {
            "templateLink": {
                "uri": template_uri
            },
            "parameters": {
                "location": {
                    "value": location
                },
            },
            "mode": DeploymentMode.incremental
        }
    }
)
```

### Deploy a resource group and resources

You can create a resource group and deploy resources to the group. For more information, see [Create resource group and deploy resources](../templates/deploy-to-subscription.md#resource-groups).

### Deploy resources to multiple subscriptions or resource groups

Typically, you deploy all the resources in your template to a single resource group. However, there are scenarios where you want to deploy a set of resources together but place them in different resource groups or subscriptions. For more information, see [Deploy Azure resources to multiple subscriptions or resource groups](../templates/deploy-to-resource-group.md).

## Delete resources

The following example shows how to delete a storage account.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.storage import StorageManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

storage_client = StorageManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

storage_account = storage_client.storage_accounts.delete(
    resource_group_name,
    storage_account_name
)
```

For more information about how Azure Resource Manager orders the deletion of resources, see [Azure Resource Manager resource group deletion](delete-resource-group.md).

## Move resources

The following example shows how to move a storage account from one resource group to another resource group.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

src_resource_group_name = "sourceGroup"
dest_resource_group_name = "destinationGroup"
storage_account_name = "demostore"

dest_resource_group = resource_client.resource_groups.get(dest_resource_group_name)

storage_account = resource_client.resources.get(
    src_resource_group_name, "Microsoft.Storage", "", "storageAccounts", storage_account_name, "2022-09-01"
)

move_result = resource_client.resources.begin_move_resources(
    src_resource_group_name,
    {
        "resources": [storage_account.id],
        "targetResourceGroup": dest_resource_group.id,
    }
)
```

For more information, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).

## Lock resources

Locking prevents other users in your organization from accidentally deleting or modifying critical resources, such as Azure subscription, resource group, or resource. 

The following example locks a web site so it can't be deleted.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ManagementLockClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

lock_client = ManagementLockClient(credential, subscription_id)

lock_result = lock_client.management_locks.create_or_update_at_resource_level(
    "exampleGroup",
    "Microsoft.Web",
    "",
    "sites",
    "examplesite",
    "lockSite",
    {
        "level": "CanNotDelete"
    }
)
```

The following script gets all locks for a storage account:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.locks import ManagementLockClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)
lock_client = ManagementLockClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2021-04-01"
)

locks = lock_client.management_locks.list_at_resource_level(
    resource_group_name,
    "Microsoft.Storage",
    "",
    "storageAccounts",
    storage_account_name
)

for lock in locks:
    print(f"Lock Name: {lock.name}, Lock Level: {lock.level}")
```

The following script deletes a lock of a web site:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ManagementLockClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

lock_client = ManagementLockClient(credential, subscription_id)

lock_client.management_locks.delete_at_resource_level(
    "exampleGroup",
    "Microsoft.Web",
    "",
    "sites",
    "examplesite",
    "lockSite"
)
```

For more information, see [Lock resources with Azure Resource Manager](lock-resources.md).

## Tag resources

Tagging helps organizing your resource group and resources logically. For information, see [Using tags to organize your Azure resources](tag-resources-python.md).

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](overview.md).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../templates/syntax.md).
- To learn how to develop templates, see the [step-by-step tutorials](../index.yml).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).
