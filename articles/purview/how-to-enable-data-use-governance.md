---
title: Enabling data use governance on your Azure Purview sources
description: Step-by-step guide on how to enable data use access for your registered sources.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 3/02/2022
ms.custom:
---

# Enable data use governance on your Azure Purview sources

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

*Data use governance* (DUG) is an option in the data source registration in Azure Purview. Its purpose is to make those data sources available in the policy authoring experience of Azure Purview Studio. In other words, access policies can only be written on data sources that have been previously registered and with DUG toggle set to enable. 

## Prerequisites

To enable the *Data use Governance* (DUG) toggle for a data source, resource group, or subscription, the same user needs to have both certain IAM privileges on the resource and certain Azure Purview privileges. 

1) User needs to have **either one of the following** IAM role combinations on the resource:
- IAM *Owner*
- Both IAM *Contributor* + IAM *User Access Administrator*

Follow this [guide to configure Azure RBAC role permissions](../role-based-access-control/check-access.md).

2) In addition, the same user needs to have Azure Purview Data source administrator role at the root collection level. See the guide on [managing Azure Purview role assignments](catalog-permissions.md#assign-permissions-to-your-users).

>[!IMPORTANT]
> - Currently, policy operations are only supported at **root collection level** and not child collection level.

## Enable Data use governance

To enable *Data use governance* for a resource, the resource will first need to be registered in Azure Purview.
To register a resource, follow the **Prerequisites** and **Register** sections of the [source pages](azure-purview-connector-overview.md) for your resources.

Once you have your resource registered, follow the rest of the steps to enable an individual resource for *Data use governance*.

1. Go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source where you want to enable *Data use governance*.

1. At the top of the source page, select **Edit source**.

1. Set the *Data use governance* toggle to **Enabled**, as shown in the image below.

    :::image type="content" source="./media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Set Data use governance toggle to **Enabled** at the bottom of the menu.":::

> [!WARNING]
> **Known issues**
> - Moving data sources to a different resource group or subscription is not yet supported. If want to do that, de-register the data source in Azure Purview before moving it and then register it again after that happens.


## Disable Data use governance

>[!Note]
>If your resource is currently a part of any active access policy, you will not be able to disable data use governance. First [un-publish the policy from the resource](how-to-data-owner-policy-authoring-generic.md#update-or-delete-a-policy), then disable data use governance.

To disable data use governance for a source, resource group, or subscription, a user needs to either be a resource IAM **Owner** or an Azure Purview **Data source admin**. Once you have those permissions follow these steps:

1. Go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to disable data use governance for.

1. At the top of the source page, select **Edit source**.

1. Set the **Data use governance** toggle to **Disabled**.

>[!NOTE]
> Disabling **Data use governance** for a subscription source will disable it also for all assets registered in that subscription.

> [!WARNING]
> **Known issues**
> - Once a subscription gets disabled for *Data use governance* any underlying assets that are enabled for *Data use governance* will be disabled, which is the right behavior. However, policy statements based on those assets will still be allowed after that

## Data use governance best practices

- We highly encourage registering data sources for *Data use governance* and managing all associated access policies in a single Azure Purview account.
- Should you have multiple Azure Purview accounts, be aware that **all** data sources belonging to a subscription must be registered for *Data use governance* in a single Azure Purview account. That Azure Purview account can be in any subscription in the tenant. The *Data use governance* toggle will become greyed out when there are invalid configurations. Some examples of valid and invalid configurations follow in the diagram below:
  - **Case 1** shows a valid configuration where a Storage account is registered in an Azure Purview account in the same subscription.
  - **Case 2** shows a valid configuration where a Storage account is registered in an Azure Purview account in a different subscription.
  - **Case 3** shows an invalid configuration arising because Storage accounts S3SA1 and S3SA2 both belong to Subscription 3, but are registered to different Azure Purview accounts. In that case, the *Data use governance* toggle will only work in the Azure Purview account that wins and registers a data source in that subscription first. The toggle will then be greyed out for the other data source.

    :::image type="content" source="./media/access-policies-common/valid-and-invalid-configurations.png" alt-text="Diagram shows valid and invalid configurations when using multiple Azure Purview accounts to manage policies.":::

## Next steps

- [Create data owner policies for your resources](how-to-data-owner-policy-authoring-generic.md)
- [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./tutorial-data-owner-policies-resource-group.md)
- [Enable Azure Purview data owner policies on an Azure Storage account](./tutorial-data-owner-policies-storage.md)
