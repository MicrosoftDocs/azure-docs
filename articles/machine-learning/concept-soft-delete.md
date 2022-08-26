---
title: 'Workspace soft-deletion'
titleSuffix: Azure Machine Learning
description: Soft-delete allows you to recover workspace data after accidental deletion 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: 
ms.topic: conceptual
ms.author: deeikele
author: deeikele
ms.date: 08/25/2022
#Customer intent: As an IT pro, understand how to enable data protection capabilities, to protect against accidental deletion.
---

# Recover workspace data after accidental deletion with soft delete (Preview)

The soft-delete feature for Azure Machine Learning workspace provides a data protection capability that enables you to attempt recovery of workspace data after accidental deletion. Soft delete introduces a two-step approach in deleting a workspace. When a workspace is deleted, it's first soft deleted. While in soft-deleted state, you can choose to recover or permanently delete a workspace and its data during a data retention period.

## Soft-delete behavior

When a workspace is soft-deleted, data and metadata stored service-side get soft-deleted, but some configurations get hard-deleted. Below table provides an overview of which configurations and objects get soft-deleted, and which are hard-deleted.

> [!IMPORTANT] 
> Workspaces encrypted with customer-managed keys (CMK) are not enabled for soft delete and are always hard deleted.

Data / configuration | Soft-deleted | Hard-deleted
---|---|---
Run History | ✓ | 
Models | ✓ | 
Data | ✓ | 
Environments | ✓ | 
Components | ✓ |
Notebooks | ✓ | 
Pipelines | ✓ |
Designer pipelines | ✓ | 
AutoML jobs | ✓ |
Data labeling projects | ✓ | 
Datastores | ✓ | 
Queued or running jobs | | ✓
Role assignments | | ✓*
Internal cache | | ✓ 
Compute instance |  | ✓ 
Compute clusters |  | ✓ 
Inference endpoints | | ✓ 
Linked Databricks workspaces | | ✓*

\* *Microsoft attempts recreation or reattachment when a workspace is recovered. Recovery isn't guaranteed, and a best effort attempt.*

## Soft-delete retention period

Recently deleted workspaces can be recovered or permanently deleted during the set data retention period. During the data retention period, the following applies:

* Soft deleted workspaces can be queried through CLI/SDK/REST API experiences and the Azure portal. 
* After expiry of the retention period, a soft deleted workspace automatically gets hard deleted.
* A data retention period of 14 days is the default, and can be set to a value between 1-14 as a property on the workspace.
* Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first. Permanently deleting a workspace allows recreation to accommodate for dev/test MLOps scenarios, or to immediately delete highly sensitive data.
* Permanently deleting workspaces can only be done one workspace at time, and not using a batch operation.
* You can't reuse the name of a workspace that has been soft-deleted until the retention period has passed.

## Workspace recovery

After a workspace is deleted, the service keeps necessary data and metadata during the recovery retention period. The service attempts recreation or reattachment of selected hard-deleted resources including role assignment at the time of workspace recovery. Other hard-deleted resources including compute clusters, should be recreated by you.

## Billing implications

In general, when a workspace is in soft-deleted state, there are only two operations possible: 'permanently delete' and 'recover'. All the other operations will fail. Therefore, even though the object exists, no compute operations can be performed and hence no usage will occur. When a workspace is soft-deleted, cost-incurring resources such as compute clusters are hard deleted.

## Enroll soft-delete on an Azure subscription

Soft delete is enabled on any workspace in Azure subscriptions that are enrolled for the soft-delete preview capability. During preview, workspaces with customer-managed keys aren't supported for soft-delete.

To enable workspace soft-deletion, [register the preview feature](/azure/azure-resource-manager/management/preview-features?tabs=azure-portal#register-preview-feature) under your Azure Subscription in the Azure portal. Enable `Recover workspace data after accidental deletion with soft delete` under the `Microsoft.MachineLearningServices` resource provider.

## Supporting interfaces

Recently deleted workspaces can be managed from the Azure portal, CLI and SDK.

### Configure soft delete retention period

The default retention period is 14 days, but can be set to a value between 1 and 14 days to meet data residency or other compliance requirements. 

> [!TIP]
> CLI and SDK operations will fail if a value is provided outside of the 1-14 day range.

# [Azure portal](#tab/portal)

*Add screenshot*

# [Azure CLI](#tab/cli)

```azurecli
az ml workspace create --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {WORKSPACE NAME} -f soft-delete.yaml
```

The following YAML describes the contents of the `soft-delete.yaml` parameter to the previous command.

```yaml
#source ../configs/workspace/soft-delete.yaml
name: soft-delete-ws
location: EastUS
display_name: soft-delete-workspace
description: A workspace with configured retention period for soft delete

data_retention:
  soft_delete_retention_days: 14

tags:
  purpose: testing
  team: ws-management
```

# [Python SDK](#tab/sdk)

```python
workspace = Workspace.create(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  name="soft-delete-ws",
  soft_delete_retention_days=14
)
```

---


### Delete a workspace

The default behavior when deleting a non-CMK workspace is soft-deleted. Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first.

> [!TIP]
> Deletion of dependent resources is only possible in combination with permanently deleting a workspace, and fails in case a workspace is not permanently deleted to allow for best changes of recovering workspace data.

# [Azure portal](#tab/portal)

Check the 'permanently delete' flag at time of workspace deletion.

*Add screenshot*

# [Azure CLI](#tab/cli)

Soft delete is the default behavior when deleting a non-CMK workspace.


```azurecli
az ml workspace delete --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {WORKSPACE NAME}
```

Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first by setting the `permanently_delete` flag. By default, this parameter is set to `false`. Permanently deleting a workspace allows recreation to accommodate for dev/test MLOps scenarios, or to immediately delete highly sensitive data.

```azurecli
az ml workspace delete --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {WORKSPACE NAME} --permanently_delete
```


# [Python SDK](#tab/sdk)

```python
workspace.delete(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  delete_dependent_resources=False,
  permanently_delete=False,
  no_wait=False
)
```

Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first by setting the `permanently_delete` flag. By default, this parameter is set to `false`. Permanently deleting a workspace allows recreation to accommodate for dev/test MLOps scenarios, or to immediately delete highly sensitive data.

```python
workspace.delete(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  delete_dependent_resources=False,
  permanently_delete=True,
  no_wait=False
)
```

---


### List and recover soft-deleted workspaces

# [Azure portal](#tab/portal)

Soft-deleted workspaces can be managed under the Azure Machine Learning resource provider in the Azure portal. Select 'recently deleted' to list soft-deleted workspaces by subscription. From this view, you can recover or permanently delete a workspace.

*Add screenshot*

# [Azure CLI](#tab/cli)

Soft-deleted workspaces can be listed by subscription, and by resource group. List by subscription allows customers to query soft deleted workspace for which the resource group was deleted as well. 

__List soft-deleted workspaces__

```azurecli
az ml workspace list-deleted --subscription {SUBSCRIPTION ID} --resource_group {RESOURCE GROUP}
```

__Show soft-deleted workspaces__

The `az ml workspace show` will return a 404 for soft-deleted workspaces. Instead, soft-deleted workspaces can be shown via a show-deleted call, by providing subscription, original resource group and *original* name of the soft deleted resource. *Original*, since the resource group may have been deleted at this point.

```azurecli
az ml workspace show-deleted --subscription {SUBSCRIPTION ID} --resource_group --name {WORKSPACE NAME}
```

__Recover deleted workspaces__

To recover a deleted workspace, provide subscription ID, original resource group and original name of the soft deleted workspace.

```azurecli
az ml workspace recover --subscription {SUBSCRIPTION ID} --resource_group {RESOURCE GROUP} --name {WORKSPACE NAME}
```

# [Python SDK](#tab/sdk)

Soft-deleted workspaces can be listed by subscription, and by resource group. List by subscription allows customers to query soft deleted workspace for which the resource group was deleted as well. 

__List soft-deleted workspaces__

```python
Workspace.list_deleted(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}", # Optional
)
```

__Show soft-deleted workspaces__

Soft-deleted workspaces can be shown via the `get-deleted` method, by providing subscription, original resource group and *original* name of the soft deleted resource. *Original*, since the resource group may have been deleted at this point.

```python
workspace.get_deleted(
  name="soft-delete-ws",
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}"
)
```

To recover a deleted workspace, provide subscription ID, original resource group and original name of the soft deleted workspace.

```python
Workspace.recover(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  name="soft-delete-ws",
)
```

> [!TIP]
> Since the workspace is already deleted, it cannot be instantiated and recovery may be implemented as a static method.

---

## Next steps

+ [Create and manage a workspace](how-to-manage-workspace.md)
