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
ms.date: 10/24/2022
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

After soft-deletion, the service keeps necessary data and metadata during the recovery [retention period](#soft-delete-retention-period). When the retention period expires, or in case you permanently delete a workspace, data and metadata will be actively deleted.

## Soft-delete retention period

Recently deleted workspaces can be recovered or permanently deleted during the set data retention period. During the data retention period, the following applies:

> [!TIP]
> The default retention period is 14 days, but can be set to a value between 1 and 14 days to meet data residency or other compliance requirements. 

* Soft deleted workspaces can be managed through the Azure portal. 
* After expiry of the retention period, a soft deleted workspace automatically gets hard deleted.
* A data retention period of 14 days is the default, and can be set to a value between 1-14 as a property on the workspace.
* Optionally, you may choose to permanently delete a workspace without going to soft delete state first. Permanently deleting a workspace allows recreation to accommodate for dev/test MLOps scenarios, or to immediately delete highly sensitive data.
* Permanently deleting workspaces can only be done one workspace at time, and not using a batch operation.
* You can't reuse the name of a workspace that has been soft-deleted until the retention period has passed.

## Workspace recovery

The service attempts recreation or reattachment of selected hard-deleted resources including role assignment at the time of workspace recovery. Other hard-deleted resources including compute clusters, should be recreated by you.

## Billing implications

In general, when a workspace is in soft-deleted state, there are only two operations possible: 'permanently delete' and 'recover'. All the other operations will fail. Therefore, even though the object exists, no compute operations can be performed and hence no usage will occur. When a workspace is soft-deleted, cost-incurring resources such as compute clusters are hard deleted.

## General Data Protection Regulation (GDPR) implications

From a GDPR and privacy perspective, a request to delete personal data should be interpreted as a request for *permanent* deletion and not soft delete. For more information, see the [Export or delete workspace data](how-to-export-delete-data.md) article.

## Enroll soft-delete on an Azure subscription

Soft delete is enabled on any workspace in Azure subscriptions that are enrolled for the soft-delete preview capability. During preview, workspaces with customer-managed keys aren't supported for soft-delete.

To enable workspace soft-deletion, [register the preview feature](/azure/azure-resource-manager/management/preview-features?tabs=azure-portal#register-preview-feature) under your Azure Subscription in the Azure portal. Enable `Recover workspace data after accidental deletion with soft delete` under the `Microsoft.MachineLearningServices` resource provider.

## Supporting interfaces

Recently deleted workspaces can be managed from the Azure portal.

### Configure soft delete retention period

The default retention period is 14 days, but can be set to a value between 1 and 14 days to meet data residency or other compliance requirements. To set the retention period from the [Azure portal](https://portal.azure.com), select the workspace and then select properties.

> [!TIP]
> CLI and SDK operations will fail if a value is provided outside of the 1-14 day range.

:::image type="content" source="./media/concept-soft-delete/soft-delete-manage-set-retention-period.png" alt-text="Screenshot of the soft-delete retention period in the portal.":::

### Delete a workspace

The default behavior when deleting a non-CMK workspace is soft-deleted. Optionally, you may choose to permanently delete a non-CMK workspace without going to soft delete state first by checking __Delete the workspace permanently__ in the Azure portal.

> [!TIP]
> Deletion of dependent resources is only possible in combination with permanently deleting a workspace, and fails in case a workspace is not permanently deleted to allow for best changes of recovering workspace data.

:::image type="content" source="./media/concept-soft-delete/soft-delete-permanently-delete.png" alt-text="Screenshot of the delete workspace form in the portal.":::

### List and recover soft-deleted workspaces

Soft-deleted workspaces can be managed under the Azure Machine Learning resource provider in the Azure portal. To list soft-deleted workspaces, use the following steps:

1. From the [Azure portal](https://portal.azure.com), select __More services__.  From the __AI + machine learning__ category, select __Azure Machine Learning__.
1. From the top of the page, select __Recently deleted__ to view workspaces that were soft-deleted and are still within the retention period.

    :::image type="content" source="./media/concept-soft-delete/soft-delete-manage-recently-deleted.png" alt-text="Screenshot highlighting the recently deleted link.":::

1. From the recently deleted workspaces view, you can recover or permanently delete a workspace.

    :::image type="content" source="./media/concept-soft-delete/soft-delete-manage-recently-deleted-panel.png" alt-text="Screenshot of the recently deleted workspaces view.":::


## Next steps

+ [Create and manage a workspace](how-to-manage-workspace.md)
