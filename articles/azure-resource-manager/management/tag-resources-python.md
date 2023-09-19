---
title: Tag resources, resource groups, and subscriptions with Python
description: Shows how to use Python to apply tags to Azure resources.
ms.topic: conceptual
ms.date: 04/19/2023
ms.custom: devx-track-python
content_well_notification: 
  - AI-contribution
---

# Apply tags with Python

This article describes how to use Python to tag resources, resource groups, and subscriptions. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

## Prerequisites

* Python 3.7 or later installed. To install the latest, see [Python.org](https://www.python.org/downloads/)

* The following Azure library packages for Python installed in your virtual environment. To install any of the packages, use `pip install {package-name}`
  * azure-identity
  * azure-mgmt-resource

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

## Apply tags

Azure Python offers the [ResourceManagementClient.tags.begin_create_or_update_at_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.tagsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-tagsoperations-begin-create-or-update-at-scope) method to apply tags. It replaces all tags on the resource, resource group, or subscription. When you call the command, pass the resource ID of the entity you want to tag.

The following example applies a set of tags to a storage account:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

tags = {
    "Dept": "Finance",
    "Status": "Normal"
}

tag_resource = TagsResource(
    properties={'tags': tags}
)

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2022-09-01"
)

resource_client.tags.begin_create_or_update_at_scope(resource.id, tag_resource)

print(f"Tags {tag_resource.properties.tags} were added to resource with ID: {resource.id}")
```

If you run the command again, but this time with different tags, notice that the earlier tags disappear.

```python
tags = {
    "Team": "Compliance",
    "Environment": "Production"
}
```

To add tags to a resource that already has tags, use [ResourceManagementClient.tags.begin_update_at_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.tagsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-tagsoperations-begin-update-at-scope). On the [TagsPatchResource](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.models.tagspatchresource) object, set the `operation` parameter to `Merge`.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

tags = {
    "Dept": "Finance",
    "Status": "Normal"
}

tag_patch_resource = TagsPatchResource(
    operation="Merge",
    properties={'tags': tags}
)

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2022-09-01"
)

resource_client.tags.begin_update_at_scope(resource.id, tag_patch_resource)

print(f"Tags {tag_patch_resource.properties.tags} were added to existing tags on resource with ID: {resource.id}")
```

Notice that the existing tags grow with the addition of the two new tags.

Each tag name can have only one value. If you provide a new value for a tag, it replaces the old value even if you use the merge operation. The following example changes the `Status` tag from _Normal_ to _Green_.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

tags = {
    "Status": "Green"
}

tag_patch_resource = TagsPatchResource(
    operation="Merge",
    properties={'tags': tags}
)

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2022-09-01"
)

resource_client.tags.begin_update_at_scope(resource.id, tag_patch_resource)

print(f"Tags {tag_patch_resource.properties.tags} were added to existing tags on resource with ID: {resource.id}")
```

When you set the `operation` parameter to `Replace`, the new set of tags replaces the existing tags.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

tags = {
    "Project": "ECommerce",
    "CostCenter": "00123",
    "Team": "Web"
}

tag_patch_resource = TagsPatchResource(
    operation="Replace",
    properties={'tags': tags}
)

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2022-09-01"
)

resource_client.tags.begin_update_at_scope(resource.id, tag_patch_resource)

print(f"Tags {tag_patch_resource.properties.tags} replaced tags on resource with ID: {resource.id}")
```

Only the new tags remain on the resource.

The same commands also work with resource groups or subscriptions. Pass them in the identifier of the resource group or subscription you want to tag. To add a new set of tags to a resource group, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"

tags = {
    "Dept": "Finance",
    "Status": "Normal"
}

tag_resource = TagsResource(
    properties={'tags': tags}
)

resource_group = resource_client.resource_groups.get(resource_group_name)

resource_client.tags.begin_create_or_update_at_scope(resource_group.id, tag_resource)

print(f"Tags {tag_resource.properties.tags} were added to resource group: {resource_group.id}")
```

To update the tags for a resource group, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"

tags = {
    "CostCenter": "00123",
    "Environment": "Production"
}

tag_patch_resource = TagsPatchResource(
    operation="Merge",
    properties={'tags': tags}
)

resource_group = resource_client.resource_groups.get(resource_group_name)

resource_client.tags.begin_update_at_scope(resource_group.id, tag_patch_resource)

print(f"Tags {tag_patch_resource.properties.tags} were added to existing tags on resource group: {resource_group.id}")
```

To update the tags for a subscription, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

tags = {
    "Team": "Web Apps"
}

tag_patch_resource = TagsPatchResource(
    operation="Merge",
    properties={'tags': tags}
)

resource_client.tags.begin_update_at_scope(f"/subscriptions/{subscription_id}", tag_patch_resource)

print(f"Tags {tag_patch_resource.properties.tags} were added to subscription: {subscription_id}")

```

You may have more than one resource with the same name in a resource group. In that case, you can set each resource with the following commands:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"

tags = {
    "Dept": "IT",
    "Environment": "Test"
}

tag_patch_resource = TagsPatchResource(
    operation="Merge",
    properties={'tags': tags}
)

resources = resource_client.resources.list_by_resource_group(resource_group_name, filter="name eq 'sqlDatabase1'")

for resource in resources:
    resource_client.tags.begin_update_at_scope(resource.id, tag_patch_resource)
    print(f"Tags {tag_patch_resource.properties.tags} were added to resource: {resource.id}")
```

## List tags

To get the tags for a resource, resource group, or subscription, use the [ResourceManagementClient.tags.get_at_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.tagsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-tagsoperations-get-at-scope) method and pass the resource ID of the entity.

To see the tags for a resource, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_group_name = "demoGroup"
storage_account_name = "demostorage"

resource_client = ResourceManagementClient(credential, subscription_id)

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2022-09-01"
)

resource_tags = resource_client.tags.get_at_scope(resource.id)
print (resource_tags.properties.tags)
```

To see the tags for a resource group, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group = resource_client.resource_groups.get("demoGroup")

resource_group_tags = resource_client.tags.get_at_scope(resource_group.id)
print (resource_group_tags.properties.tags)
```

To see the tags for a subscription, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

subscription_tags = resource_client.tags.get_at_scope(f"/subscriptions/{subscription_id}")
print (subscription_tags.properties.tags)
```

## List by tag

To get resources that have a specific tag name and value, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resources = resource_client.resources.list(filter="tagName eq 'CostCenter' and tagValue eq '00123'")

for resource in resources:
    print(resource.name)
```

To get resources that have a specific tag name with any tag value, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resources = resource_client.resources.list(filter="tagName eq 'Dept'")

for resource in resources:
    print(resource.name)
```

To get resource groups that have a specific tag name and value, use:

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_groups = resource_client.resource_groups.list(filter="tagName eq 'CostCenter' and tagValue eq '00123'")

for resource_group in resource_groups:
    print(resource_group.name)
```

## Remove tags

To remove specific tags, set `operation` to `Delete`. Pass the resource IDs of the tags you want to delete.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import TagsPatchResource

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "demoGroup"
storage_account_name = "demostore"

tags = {
    "Dept": "IT",
    "Environment": "Test"
}

tag_patch_resource = TagsPatchResource(
    operation="Delete",
    properties={'tags': tags}
)

resource = resource_client.resources.get_by_id(
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}",
    "2022-09-01"
)

resource_client.tags.begin_update_at_scope(resource.id, tag_patch_resource)

print(f"Tags {tag_patch_resource.properties.tags} were removed from resource: {resource.id}")
```

The specified tags are removed.

To remove all tags, use the [ResourceManagementClient.tags.begin_delete_at_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.tagsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-tagsoperations-begin-delete-at-scope) method.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

subscription = resource_client.subscriptions.get(subscription_id)

resource_client.tags.begin_delete_at_scope(subscription.id)
```

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
