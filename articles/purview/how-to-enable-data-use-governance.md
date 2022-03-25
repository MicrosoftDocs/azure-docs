---
title: Enabling data use governance on your Azure Purview sources
description: Step-by-step guide on how to enable data use access for your registered sources.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 3/24/2022
ms.custom:
---

# Enable data use governance on your Azure Purview sources

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

*Data use governance* (DUG) is an option in the data source registration in Azure Purview. Its purpose is to make those data sources available in the policy authoring experience of Azure Purview Studio. In other words, access policies can only be written on data sources that have been previously registered and with DUG toggle set to enable. 

## Prerequisites
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

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

## Disable Data use governance

To disable data use governance for a source, resource group, or subscription, a user needs to either be a resource IAM **Owner** or an Azure Purview **Data source admin**. Once you have those permissions follow these steps:

1. Go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to disable data use governance for.

1. At the top of the source page, select **Edit source**.

1. Set the **Data use governance** toggle to **Disabled**.

## Delegation of access control responsibility to Azure Purview
Note: 
1.	Once a resource has been enabled for *Data use Governance*, **any** Azure Purview *policy author* will be able to create access policies against it, and **any** Azure Purview *Data source admin* will be able to publish those policies at **any point afterwards**.
1.	**Any** Azure Purview *root collection admin* can create **new** *Data Source Admin* and *Policy author* roles.

## Additional considerations related to Data use governance
- Make sure you write down the **Name** you use when registering in Azure Purview. You will need it when you publish a policy. The recommended practice is to make the registered name exactly the same as the endpoint name.
- To disable a source for *Data use governance*, remove it first from being bound (i.e. published) in any policy.
- While user needs to have both data source *Owner* and Azure Purview *Data source admin* to enable a source for *Data use governance*, either of those roles can independently disable it.
- Disabling *Data use governance* for a subscription will disable it also for all assets registered in that subscription.

> [!WARNING]
> **Known issues** related to source registration
> - Moving data sources to a different resource group or subscription is not yet supported. If want to do that, de-register the data source in Azure Purview before moving it and then register it again after that happens.
> - Once a subscription gets disabled for *Data use governance* any underlying assets that are enabled for *Data use governance* will be disabled, which is the right behavior. However, policy statements based on those assets will still be allowed after that.

## Data use governance best practices
- We highly encourage registering data sources for *Data use governance* and managing all associated access policies in a single Azure Purview account.
- Should you have multiple Azure Purview accounts, be aware that **all** data sources belonging to a subscription must be registered for *Data use governance* in a single Azure Purview account. That Azure Purview account can be in any subscription in the tenant. The *Data use governance* toggle will become greyed out when there are invalid configurations. Some examples of valid and invalid configurations follow in the diagram below:
    - **Case 1** shows a valid configuration where a Storage account is registered in an Azure Purview account in the same subscription.
    - **Case 2** shows a valid configuration where a Storage account is registered in an Azure Purview account in a different subscription. 
    - **Case 3** shows an invalid configuration arising because Storage accounts S3SA1 and S3SA2 both belong to Subscription 3, but are registered to different Azure Purview accounts. In that case, the *Data use governance* toggle will only enable in the Azure Purview account that wins and registers a data source in that subscription first. The toggle will then be greyed out for the other data source.
- If the *Data use governance* toggle is greyed out and cannot be enabled, hover over it to know the name of the Azure Purview account that has registered the data resource first.

![Diagram shows valid and invalid configurations when using multiple Azure Purview accounts to manage policies.](./media/access-policies-common/valid-and-invalid-configurations.png)

## Next steps

- [Create data owner policies for your resources](how-to-data-owner-policy-authoring-generic.md)
- [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./tutorial-data-owner-policies-resource-group.md)
- [Enable Azure Purview data owner policies on an Azure Storage account](./tutorial-data-owner-policies-storage.md)
