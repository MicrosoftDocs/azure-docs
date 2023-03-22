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
ms.reviewer: larryfr
ms.date: 11/07/2022
monikerRange: 'azureml-api-2 || azureml-api-1'
#Customer intent: As an IT pro, understand how to enable data protection capabilities, to protect against accidental deletion.
---

# Recover workspace data after accidental deletion with soft delete (Preview)

The soft-delete feature for Azure Machine Learning workspace provides a data protection capability that enables you to attempt recovery of workspace data after accidental deletion. Soft delete introduces a two-step approach in deleting a workspace. When a workspace is deleted, it's first soft deleted. While in soft-deleted state, you can choose to recover or permanently delete a workspace and its data during a data retention period.

> [!IMPORTANT]    
> Workspace soft delete is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.     
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> To enroll your Azure Subscription, see [Register soft-delete on an Azure subscription](#register-soft-delete-on-an-azure-subscription).

## How workspace soft delete works

When a workspace is soft-deleted, data and metadata stored service-side get soft-deleted, but some configurations get hard-deleted. Below table provides an overview of which configurations and objects get soft-deleted, and which are hard-deleted.

> [!IMPORTANT] 
> Soft delete is not supported for workspaces encrypted with customer-managed keys (CMK), and these workspaces are always hard deleted.

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

A default retention period of 14 days holds for deleted workspaces. The retention period indicates how long workspace data remains available after it's deleted. The clock starts on the retention period as soon as a workspace is soft-deleted.

During the retention period, soft-deleted workspaces can be recovered or permanently deleted. Any other operations on the workspace, like submitting a training job,  will fail. You can't reuse the name of a workspace that has been soft-deleted until the retention period has passed. Once the retention period elapses, a soft deleted workspace automatically gets permanently deleted.

> [!TIP]
> During preview of workspace soft-delete, the retention period is fixed to 14 days and can't be modified. 

## Deleting a workspace

The default deletion behavior when deleting a workspace is soft delete. This behavior excludes workspaces that are [encrypted with a customer-managed key](concept-customer-managed-keys.md), which aren't supported for soft delete.

Optionally, you may permanently delete a workspace going to soft delete state first by checking __Delete the workspace permanently__ in the Azure portal. Permanently deleting workspaces can only be done one workspace at time, and not using a batch operation.

Permanently deleting a workspace allows a workspace name to be reused immediately after deletion. This behavior may be useful in dev/test scenarios where you want to create and later delete a workspace. Permanently deleting a workspace may also be required for compliance if you manage highly sensitive data. See [General Data Protection Regulation (GDPR) implications](#general-data-protection-regulation-gdpr-implications) to learn more on how deletions are handled when soft delete is enabled.

:::image type="content" source="./media/concept-soft-delete/soft-delete-permanently-delete.png" alt-text="Screenshot of the delete workspace form in the portal.":::

## Manage soft-deleted workspaces

Soft-deleted workspaces can be managed under the Azure Machine Learning resource provider in the Azure portal. To list soft-deleted workspaces, use the following steps:

1. From the [Azure portal](https://portal.azure.com), select __More services__.  From the __AI + machine learning__ category, select __Azure Machine Learning__.
1. From the top of the page, select __Recently deleted__ to view workspaces that were soft-deleted and are still within the retention period.

    :::image type="content" source="./media/concept-soft-delete/soft-delete-manage-recently-deleted.png" alt-text="Screenshot highlighting the recently deleted link.":::

1. From the recently deleted workspaces view, you can recover or permanently delete a workspace.

    :::image type="content" source="./media/concept-soft-delete/soft-delete-manage-recently-deleted-panel.png" alt-text="Screenshot of the recently deleted workspaces view.":::

## Recover a soft-deleted workspace

When you select *Recover* on a soft-deleted workspace, it initiates an operation to restore the workspace state. The service attempts recreation or reattachment of a subset of resources, including Azure RBAC role assignments. Hard-deleted resources including compute clusters should be recreated by you.

Azure Machine Learning recovers Azure RBAC role assignments for the workspace identity, but doesn't recover role assignments you may have added for users or user groups. It may take up to 15 minutes for role assignments to propagate after workspace recovery.

Recovery of a workspace may not always be possible. Azure Machine Learning stores workspace metadata on [other Azure resources associated with the workspace](concept-workspace.md#associated-resources). In the event these dependent Azure resources were deleted, it may prevent the workspace from being recovered or correctly restored. Dependencies of the Azure Machine Learning workspace must be recovered first, before recovering a deleted workspace. Azure Container Registry isn't a hard requirement required for recovery.

Enable [data protection capabilities on Azure Storage](../storage/blobs/soft-delete-blob-overview.md) to improve chances of successful recovery.

## Permanently delete a soft-deleted workspace

When you select *Permanently delete* on a soft-deleted workspace, it triggers hard deletion of workspace data. Once deleted, workspace data can no longer be recovered. Permanent deletion of workspace data is also triggered when the soft delete retention period expires.

## Register soft-delete on an Azure subscription

During the time of preview, workspace soft delete is enabled on an opt-in basis per Azure subscription. When soft delete is enabled for a subscription, it's enabled for all Azure Machine Learning workspaces in that subscription.

To enable workspace soft delete on your Azure subscription, [register the preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature) in the Azure portal. Select `Workspace soft delete` under the `Microsoft.MachineLearningServices` resource provider. It may take 15 minutes for the UX to appear in the Azure portal after registering your subscription.

Before disabling workspace soft delete on an Azure subscription, purge or recover soft-deleted workspaces. After you disable soft delete on a subscription, workspaces that remain in soft deleted state are automatically purged when the retention period elapses.

## Billing implications

In general, when a workspace is in soft-deleted state, there are only two operations possible: 'permanently delete' and 'recover'. All other operations will fail. Therefore, even though the workspace exists, no compute operations can be performed and hence no usage will occur. When a workspace is soft-deleted, any cost-incurring resources including compute clusters are hard deleted.

## General Data Protection Regulation (GDPR) implications

After soft-deletion, the service keeps necessary data and metadata during the recovery [retention period](#soft-delete-retention-period). From a GDPR and privacy perspective, a request to delete personal data should be interpreted as a request for *permanent* deletion of a workspace and not soft delete.

When the retention period expires, or in case you permanently delete a workspace, data and metadata will be actively deleted. You could choose to permanently delete a workspace at the time of deletion.

For more information, see the [Export or delete workspace data](how-to-export-delete-data.md) article.

## Next steps

+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Export or delete workspace data](how-to-export-delete-data.md)