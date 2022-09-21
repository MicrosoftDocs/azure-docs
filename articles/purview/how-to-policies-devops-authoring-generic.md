---
title: Provision access for DevOps actions (preview)
description: Step-by-step guide on provisioning access through Microsoft Purview DevOps policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 08/22/2022
ms.custom:
---
# Provision access to Azure SQL DB for DevOps actions (preview)

> [!IMPORTANT]
> This feature is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This how-to guide shows how to provision access from Microsoft Purview to system metadata (e.g. DMVs and DMFs) via *SQL Performance Monitoring* or *SQL Security Auditing* actions. Microsoft Purview access policies apply to Azure AD Accounts only.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create a new, or use an existing Microsoft Purview account. You can [follow our quick-start guide to create one](https://docs.microsoft.com/azure/purview/./create-catalog-portal).
- Create a new, or use an existing resource group, and place new data sources under it. [Follow this guide to create a new resource group](https://docs.microsoft.com/azure/purview/../azure-resource-manager/management/manage-resource-groups-portal)

### Data source configuration
Before authoring policies in the Microsoft Purview policy portal, you'll need to configure the data sources so that they can enforce those policies.

1. Follow any policy-specific prerequisites for your source. Check the [Microsoft Purview supported data sources table](https://docs.microsoft.com/azure/purview/./microsoft-purview-connector-overview.md) and select the link in the **Access Policy** column for sources where access policies are available. Follow any steps listed in the Access policy or Prerequisites sections.
1. Register the data source in Microsoft Purview. Follow the **Prerequisites** and **Register** sections of the [source pages](https://docs.microsoft.com/azure/purview/./microsoft-purview-connector-overview.md) for your resources.
1. [Enable the Data use management toggle on the data source](how-to-enable-data-use-management.md). Additional permissions for this step are described in the linked document.


## Create a new DevOps policy
This section describes the steps to create a new DevOps policy in Microsoft Purview.

Ensure you have the Microsoft Purview Policy Author permission as described [here](https://docs.microsoft.com/en-us/azure/purview/how-to-policies-data-owner-authoring-generic#permissions-for-policy-authoring-and-publishing)


1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Select the **New Policy** button in the policy page. After that, the policy detail page will open.
![Screenshot shows to enter SQL DevOps policies to create](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-create.png)

1.  Select the **Data source type** and then one of the listed data sources under **Data source name**. Then click on **Select**. This will take you back to the New Policy experience
![Screenshot shows to select a data source for policy](./media/how-to-policies-devops-authoring-generic/select-a-data-source.png)

1. Select one of two roles, *SQL Performance monitor* or *SQL Security auditor*. Then select **Add/remove subjects**. This will open the Subject window. Type the name of an Azure AD principal (user, group or service principal) in the **Select subjects** box. Keep adding or removing subjects until you are satisfied. Select **Save**. This will take you back to the prior window.
![Screenshot shows to select a data source for policy](./media/how-to-policies-devops-authoring-generic/select-role-and-subjects.png)

1. Select **Save** to save the policy. A policy has been created and automatically published. Enforcement will start at the data source within 5 minutes.

## List DevOps policies
This section describes the steps to list DevOPs policies in Microsoft Purview.

Ensure you have the the Microsoft Purview permissions as described [here](https://docs.microsoft.com/en-us/azure/purview/how-to-policies-data-owner-authoring-generic#permissions-for-policy-authoring-and-publishing)

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. If any DevOps policies have been created they will be listed as shown in the following screenshot
![Screenshot shows to enter SQL DevOps policies to list](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-list.png)


## Update a DevOps policy
This section describes the steps to update a DevOPs policies in Microsoft Purview.

Ensure you have the Microsoft Purview Policy Author permission as described [here](https://docs.microsoft.com/en-us/azure/purview/how-to-policies-data-owner-authoring-generic#permissions-for-policy-authoring-and-publishing)

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Enter the policy detail for one of the policies by selecting it from its Data resource path as shown in the following screenshot
![Screenshot shows to enter SQL DevOps policies to list](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-update.png)

1. In the policy detail page, select **Edit**.

1. Continue same as with step 5 and 6 of the policy create.

## Delete a DevOps policy
This section describes the steps to delete a DevOPs policies in Microsoft Purview.

Ensure you have the Microsoft Purview Policy Author permission as described [here](https://docs.microsoft.com/en-us/azure/purview/how-to-policies-data-owner-authoring-generic#permissions-for-policy-authoring-and-publishing)

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Check one of the policies and then select **Delete** as shown in the following screenshot:
![Screenshot shows to enter SQL DevOps policies to list](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-delete.png)

## Next steps
Check the blog
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
