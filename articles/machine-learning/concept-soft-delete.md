---
title: 'Workspace soft-delete overview'
titleSuffix: Azure Machine Learning
description: Recover workspace data after accidental deletion with soft delete 
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

Workspace soft delete provides a data protection capability to help attempt recovery of workspace data after accidental deletion of a workspace. Soft delete introduces a two-step approach in deleting a workspace. When a workspace is deleted, it is first soft deleted. While in soft-deleted state, you can choose to recover or permanently delete a workspace and its data during a data retention period.

## Soft-delete behavior

When a workspace is soft-deleted, data and metadata stored service-side get soft-deleted, but some configurations get hard-deleted. Below table provides an overview of which configurations and objects get soft-deleted, and which are hard-deleted.

> [!IMPORTANT] 
> Workspaces encrypted with customer-managed keys (CMK) are not enabled for soft delete and are always hard deleted.

Data / configuration | Soft-deleted | Hard-deleted
---|---|---
Run History | X | 
Models | X | 
Data | X | 
Environments | x | 
Components | X |
Notebooks | X | 
Pipelines | X |
Designer pipelines | X | 
AutoML jobs | X |
Data labeling projects | X | 
Datastores | X | 
Queued or running jobs | | X
Role assignments | | X*
Internal cache | | X 
Compute instance |  | X 
Compute clusters |  | X 
Inference endpoints | | X 
Linked Databricks workspaces | | X*

\* *Microsoft attempts recreation or re-attachment when a workspace is recovered. Recovery is not guaranteed, and a best effort attempt.*

## Soft-delete retention period

Recently deleted workspaces can be recovered or permanently deleted during the set data retention period. During the data retention period, the following applies:

* Soft deleted workspaces can be queried through CLI/SDK/REST API experiences and the Azure Portal. 
* After expiry of the retention period, a soft deleted workspace automatically gets hard deleted.
* A data retention period of 14 days is the default, and can be set to a value between 1-14 as a property on the workspace.
* Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first. Permanently deleting a workspace allows recreation to accomodate for dev/test MLOps scenarios, or to immediately delete highly sensitive data if required.
* Permanently deleting workspaces can only be done one workspace at at time, and not using a batch operation.

## Billing implications

In general, when a workspace is in soft-deleted state, there are only two operations possible: 'permanently delete' and 'recover'. All the other operations will fail. Therefore, even though the object exists, no compute operations can be performed and hence no usage will occur. When a workspace is soft-deleted, cost-incurring resources such as compute clusters are hard deleted.

## Enroll soft-delete on an Azure subscription

Soft delete is enabled on any workspace in Azure subscriptions that are enrolled for the soft-delete preview capability. During preview, workspaces with customer-managed keys are not supported for soft-delete.

To enable soft-delete on your Azure subscription, [register the preview feature](/azure/azure-resource-manager/management/preview-features?tabs=azure-portal#register-preview-feature) under your Azure Subscription in the Azure Portal. Enable `Recover workspace data after accidental deletion with soft delete ` under the `Microsoft.MachineLearningServices` resource provider.

## Supporting interfaces

Recently deleted workspaces can be managed from the Azure Portal, CLI and SDK.

### Azure Portal

### CLI and SDK

#### Configure soft delete retention period

A data retention period for a soft deleted workspace may be specified on storage.

CLI:
```cli
> az ml workspace create --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {WORKSPACE NAME} -f soft-delete.yaml
```

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

SDK:
```python
workspace = Workspace.create(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  name="soft-delete-ws",
  soft_delete_retention_days=14
)
```

> The default retention period is 14 days, but can be set to avalue between 1 and 14 days to meet data residency or other compliance requirements. CLI and SDK operations should fail if a value is provided outside of this range.

#### Soft delete a workspace

Soft delete is the default behavior when deleting a non-CMK workspace.

> Deletion of dependent resources is only possible in combination with permanently deleting a workspace, and fails in case a workspace is not permanently deleted to allow for best changes of recovering workspace data.

CLI:
```cli
az ml workspace delete --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {WORKSPACE NAME}
```

SDK:
```python
workspace.delete(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  delete_dependent_resources=False,
  permanently_delete=False,
  no_wait=False
)
```

#### Permanently delete a workspace

Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first by setting the `permanently_delete` flag. By default, this parameter is set to `false`. Permanently deleting a workspace allows recreation to accomodate for dev/test MLOps scenarios, or to immediately delete highly sensitive data if required.

CLI:
```cli
az ml workspace delete --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {WORKSPACE NAME} --permanently_delete
```

SDK:
```python
workspace.delete(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  delete_dependent_resources=False,
  permanently_delete=True,
  no_wait=False
)
```

#### List workspaces

Soft deleted workspaces should not show in az ml workspace list commands.

#### List soft-deleted workspaces

Soft-deleted workspaces can be listed by subscription, and by resource group. List by subscription allows customers to query soft deleted workspace for which the resource group was deleted as well. 

> Design should be extensible to future interfaces provided by Azure Resource Manager. ARM will expose Microsoft.Resources/deletedResources API, which can be called to list soft deleted workspaces on subscription and resource group level.

Query results must provide subscription, original resource group and original name of the soft deleted resource.

CLI:
```cli
az ml workspace list-deleted --subscription {SUBSCRIPTION ID} --resource_group {RESOURCE GROUP}
```

SDK:
```python
Workspace.list_deleted(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}", # Optional
)
```

#### Get a soft-deleted workspace

Regular `az ml workspace show` should return 404 for soft-deleted workspaces. Instead, soft-deleted workspaces can be shown via a show-deleted call, by providing subscription, original resource group and *original* name of the soft deleted resource. *Original*, since the resource group may have been deleted at this point. This aligns with ARMs future interface, where deleted resources can be queried by original resource URIs.

CLI:
```cli
az ml workspace show-deleted --subscription {SUBSCRIPTION ID} --resource_group --name {WORKSPACE NAME}
```

SDK
```python
workspace.get_deleted(
  name="soft-delete-ws",
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}"
)

```

#### Recover soft-deleted workspace

To recover a deleted workspace, provide subscription id, original resource group and original name of the soft deleted workspace.

CLI:
```cli
az ml workspace recover --subscription {SUBSCRIPTION ID} --resource_group {RESOURCE GROUP} --name {WORKSPACE NAME}
```

SDK:
```python
Workspace.recover(
  subscription_id="{SUBSCRIPTION ID}",
  resource_group="{RESOURCE GROUP}",
  name="soft-delete-ws",
)
```

> Since workspace is already deleted, it cannot be instantiated and recovery may be implemented as a static method.

## Next steps

+ [Create and manage a workspace](how-to-manage-workspace.md)
