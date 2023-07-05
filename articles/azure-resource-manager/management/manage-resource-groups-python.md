---
title: Manage resource groups - Python
description: Use Python to manage your resource groups through Azure Resource Manager. Shows how to create, list, and delete resource groups.
author: tfitzmac
ms.topic: conceptual
ms.custom: devx-track-arm-template, devx-track-python
ms.date: 02/27/2023
ms.author: tomfitz
content_well_notification: 
  - AI-contribution
---
# Manage Azure resource groups by using Python

Learn how to use Python with [Azure Resource Manager](overview.md) to manage your Azure resource groups.

## Prerequisites

* Python 3.7 or later installed. To install the latest, see [Python.org](https://www.python.org/downloads/)

* The following Azure library packages for Python installed in your virtual environment. To install any of the packages, use `pip install {package-name}`
  * azure-identity
  * azure-mgmt-resource
  * azure-mgmt-storage

  If you have older versions of these packages already installed in your virtual environment, you may need to update them with `pip install --upgrade {package-name}`

* The examples in this article use CLI-based authentication (`AzureCliCredential`). Depending on your environment, you may need to run `az login` first to authenticate.

* An environment variable with your Azure subscription ID. To get your Azure subscription ID, use:

  ```azurecli-interactive
  az account show --name 'your subscription name' --query id -o tsv
  ```

  To set the value, use the option for your environment.

  #### [Windows](#tab/windows)

  ```console
  setx AZURE_SUBSCRIPTION_ID your-subscription-id
  ```

  > [!NOTE]
  > If you only need to access the environment variable in the current running console, you can set the environment variable with `set` instead of `setx`.

  After you add the environment variables, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

  #### [Linux](#tab/linux)

  ```bash
  export AZURE_SUBSCRIPTION_ID=your-subscription-id
  ```

  After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

  #### [macOS](#tab/macos)

  ##### Bash

  Edit your .bash_profile, and add the environment variables:

  ```bash
  export AZURE_SUBSCRIPTION_ID=your-subscription-id
  ```

  After you add the environment variables, run `source ~/.bash_profile` from your console window to make the changes effective.

## What is a resource group?

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to add resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so you can easily deploy, update, and delete them as a group.

The resource group stores metadata about the resources. When you specify a location for the resource group, you're specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

## Create resource groups

To create a resource group, use [ResourceManagementClient.resource_groups.create_or_update](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcegroupsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcegroupsoperations-create-or-update).

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.create_or_update(
    "exampleGroup",
    {
        "location": "westus"
    }
)

print(f"Provisioned resource group with ID: {rg_result.id}")
```

## List resource groups

To list the resource groups in your subscription, use [ResourceManagementClient.resource_groups.list](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcegroupsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcegroupsoperations-list).

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_list = resource_client.resource_groups.list()

for rg in rg_list:
    print(rg.name)
```

To get one resource group, use [ResourceManagementClient.resource_groups.get](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcegroupsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcegroupsoperations-get) and provide the name of the resource group.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.get("exampleGroup")

print(f"Retrieved resource group {rg_result.name} in the {rg_result.location} region with resource ID {rg_result.id}")
```

## Delete resource groups

To delete a resource group, use [ResourceManagementClient.resource_groups.begin_delete](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcegroupsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcegroupsoperations-begin-delete).

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.begin_delete("exampleGroup")
```

For more information about how Azure Resource Manager orders the deletion of resources, see [Azure Resource Manager resource group deletion](delete-resource-group.md).

## Deploy resources

You can deploy Azure resources by using Python classes or by deploying an Azure Resource Manager template (ARM template).

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

### Deploy resources by using an ARM template

To deploy an ARM template, use [ResourceManagementClient.deployments.begin_create_or_update](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update). The following example requires a local template named `storage.json`.

```python
import os
import json
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

with open("storage.json", "r") as template_file:
    template_body = json.load(template_file)

rg_deployment_result = resource_client.deployments.begin_create_or_update(
    "exampleGroup",
    "exampleDeployment",
    {
        "properties": {
            "template": template_body,
            "parameters": {
                "storagePrefix": {
                    "value": "demostore"
                },
            },
            "mode": DeploymentMode.incremental
        }
    }
)
```

The following example shows the ARM template named `storage.json` that you're deploying:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "type": "string",
      "minLength": 3,
      "maxLength": 11
    }
  },
  "variables": {
    "uniqueStorageName": "[concat(parameters('storagePrefix'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[variables('uniqueStorageName')]",
      "location": "eastus",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

For more information about deploying an ARM template, see [Deploy resources with ARM templates and Azure CLI](../templates/deploy-cli.md).

## Lock resource groups

Locking prevents other users in your organization from accidentally deleting or modifying critical resources.

To prevent a resource group and its resources from being deleted, use [ManagementLockClient.management_locks.create_or_update_at_resource_group_level](/python/api/azure-mgmt-resource/azure.mgmt.resource.locks.v2016_09_01.operations.managementlocksoperations#azure-mgmt-resource-locks-v2016-09-01-operations-managementlocksoperations-create-or-update-at-resource-group-level).

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ManagementLockClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

lock_client = ManagementLockClient(credential, subscription_id)

lock_result = lock_client.management_locks.create_or_update_at_resource_group_level(
    "exampleGroup",
    "lockGroup",
    {
        "level": "CanNotDelete"
    }
)
```

To get the locks for a resource group, use [ManagementLockClient.management_locks.list_at_resource_group_level](/python/api/azure-mgmt-resource/azure.mgmt.resource.locks.v2016_09_01.operations.managementlocksoperations#azure-mgmt-resource-locks-v2016-09-01-operations-managementlocksoperations-list-at-resource-group-level).

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ManagementLockClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

lock_client = ManagementLockClient(credential, subscription_id)

lock_result = lock_client.management_locks.get_at_resource_group_level("exampleGroup", "lockGroup")

print(f"Lock {lock_result.name} applies {lock_result.level} lock")
```

To delete a lock on a resource group, use [ManagementLockClient.management_locks.delete_at_resource_group_level](/python/api/azure-mgmt-resource/azure.mgmt.resource.locks.v2016_09_01.operations.managementlocksoperations#azure-mgmt-resource-locks-v2016-09-01-operations-managementlocksoperations-delete-at-resource-group-level).

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ManagementLockClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

lock_client = ManagementLockClient(credential, subscription_id)

lock_client.management_locks.delete_at_resource_group_level("exampleGroup", "lockGroup")
```

For more information, see [Lock resources with Azure Resource Manager](lock-resources.md).

## Tag resource groups

You can apply tags to resource groups and resources to logically organize your assets. For information, see [Using tags to organize your Azure resources](tag-resources.md).

## Export resource groups to templates

To assist with creating ARM templates, you can export a template from existing resources. For more information, see [Use Azure portal to export a template](../templates/export-template-portal.md).

## Manage access to resource groups

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) is the way that you manage access to resources in Azure. For more information, see [Add or remove Azure role assignments using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](overview.md).
- For more information about authentication options, see [Authenticate Python apps to Azure services by using the Azure SDK for Python](/azure/developer/python/sdk/authentication-overview).
