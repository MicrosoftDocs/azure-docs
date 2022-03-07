---
title: Enabling data use governance on your Azure Purview sources
description: Step-by-step guide on how to enable data use access for your registered sources.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 2/24/2022
ms.custom:
---

# Enable data use governance on your Azure Purview sources

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Data use governance is a feature within your registered Azure Purview resources that lets Azure Purview administrators manage data use from within Azure Purview.

## Prerequisites

To register a data source, resource group, or subscription in Azure Purview with the *Data use Governance* option set, a user needs to have **either one of the following** IAM role combinations on that resource:

- IAM *Owner*
- Both IAM *Contributor* + IAM *User Access Administrator*

Follow this [guide to configure Azure RBAC role permissions](../role-based-access-control/check-access.md).

## Enable data use governance

To enable data use governance for a resource, the resource will first need to be registered in Azure Purview.
To register a resource, follow the **Prerequisites** and **Register** sections of the [source pages](azure-purview-connector-overview.md) for your resources.

Once you have your resource registered, follow the rest of the steps to enable an individual resource for data use governance.

1. Go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to enable data use governance for.

1. At the top of the source page, select **Edit source**.

1. Enable the data source for data use governance in Azure Purview by setting the **Data use governance** toggle to **Enabled**, as shown in the image below.

:::image type="content" source="./media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Set Data use governance toggle to **Enabled** at the bottom of the menu.":::

## Disable data use governance

To disable data use governance for a source, resource group, or subscription, a user needs to either be a data source **Owner** or an Azure Purview **Data source admin**. Once you have those permissions follow these steps:

1. Go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to disable data use governance for.

1. At the top of the source page, select **Edit source**.

1. Set the **Data use governance** toggle to **Disabled**.

[!INCLUDE [Access policies generic registration](./includes/access-policies-registration-generic.md)]

## Next steps

- [Create data owner policies for your resources](how-to-data-owner-policy-authoring-generic.md)
- [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./tutorial-data-owner-policies-resource-group.md)
- [Enable Azure Purview data owner policies on an Azure Storage account](./tutorial-data-owner-policies-storage.md)
