---
title: Create, list, update and delete Microsoft Purview DevOps policies (preview)
description: Step-by-step guide on provisioning access through Microsoft Purview DevOps policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 11/16/2022
ms.custom:
---
# Create, list, update and delete Microsoft Purview DevOps policies

[DevOps policies](concept-policies-devops.md) are a type of Microsoft Purview access policies. They allow you to manage access to system metadata on data sources that have been registered for *Data use management* in Microsoft Purview. These policies are configured directly in the Microsoft Purview governance portal, and after being saved they get automatically published and then get enforced by the data source.

This how-to guide covers how to provision access from Microsoft Purview to SQL-type data sources via *SQL Performance Monitoring* or *SQL Security Auditing* actions. Microsoft Purview access policies apply to Azure AD Accounts only.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

### Data source configuration
Before authoring policies in the Microsoft Purview policy portal, you'll need to configure the data sources so that they can enforce those policies.

1. Follow any policy-specific prerequisites for your source. Check the [Microsoft Purview supported data sources table](./microsoft-purview-connector-overview.md) and select the link in the **Access Policy** column for sources where access policies are available. Follow any steps listed in the Access policy or Prerequisites sections.
1. Register the data source in Microsoft Purview. Follow the **Prerequisites** and **Register** sections of the [source pages](./microsoft-purview-connector-overview.md) for your resources.
1. [Enable the "Data use management" toggle on the data source](how-to-enable-data-use-management.md). Additional permissions for this step are described in the linked document.


## Create a new DevOps policy
To create a new DevOps policy, ensure first that you have the Microsoft Purview Policy author role at **root collection level**. Check the section on managing Microsoft Purview role assignments in this [guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Select the **New Policy** button in the policy page. After that, the policy detail page will open.
![Screenshot shows to enter SQL DevOps policies to create.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-create.png)

1.  Select the **Data source type** and then one of the listed data sources under **Data source name**. Then click on **Select**. This will take you back to the New Policy experience
![Screenshot shows to select a data source for policy.](./media/how-to-policies-devops-authoring-generic/select-a-data-source.png)

1. Select one of two roles, *SQL Performance monitor* or *SQL Security auditor*. Then select **Add/remove subjects**. This will open the Subject window. Type the name of an Azure AD principal (user, group or service principal) in the **Select subjects** box. Note that Microsoft 365 groups are not supported. Keep adding or removing subjects until you are satisfied. Select **Save**. This will take you back to the prior window.
![Screenshot shows to select role and subject for policy.](./media/how-to-policies-devops-authoring-generic/select-role-and-subjects.png)

1. Select **Save** to save the policy. A policy has been created and automatically published. Enforcement will start at the data source within 5 minutes.

## List DevOps policies
To update a DevOps policy, ensure first that you have one of the following Microsoft Purview roles at **root collection level**: Policy author, Data source admin, Data curator or Data reader. Check the section on managing Microsoft Purview role assignments in this [guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. If any DevOps policies have been created they will be listed as shown in the following screenshot
![Screenshot shows to enter SQL DevOps policies to list.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-list.png)


## Update a DevOps policy
To update a DevOps policy, ensure first that you have the Microsoft Purview Policy author role at **root collection level**. Check the section on managing Microsoft Purview role assignments in this [guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Enter the policy detail for one of the policies by selecting it from its Data resource path as shown in the following screenshot
![Screenshot shows to enter SQL DevOps policies to update.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-update.png)

1. In the policy detail page, select **Edit**.

1. Continue same as with step 5 and 6 of the policy create.

## Delete a DevOps policy
To delete a DevOps policy, ensure first that you have the Microsoft Purview Policy author role at **root collection level**. Check the section on managing Microsoft Purview role assignments in this [guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **DevOps policies**.

1. Check one of the policies and then select **Delete** as shown in the following screenshot:
![Screenshot shows to enter SQL DevOps policies to delete.](./media/how-to-policies-devops-authoring-generic/enter-devops-policies-to-delete.png)

## Next steps
Check the blog, related videos and documents
* Blog: [Microsoft Purview DevOps policies enable at scale access provisioning for IT operations](https://techcommunity.microsoft.com/t5/microsoft-purview-blog/microsoft-purview-devops-policies-enable-at-scale-access/ba-p/3604725)
* Video: [Pre-requisite for policies: The "Data use management" option](https://youtu.be/v_lOzevLW-Q)
* Video: [Microsoft Purview DevOps policies on data sources and resource groups](https://youtu.be/YCDJagrgEAI)
* Video: [Reduce the effort with Microsoft Purview DevOps policies on resource groups](https://youtu.be/yMMXCeIFCZ8)
* Document: [Microsoft Purview DevOps policies on Arc-enabled SQL Server](./how-to-policies-devops-arc-sql-server.md)
* Document: [Microsoft Purview DevOps policies on Azure SQL DB](./how-to-policies-devops-azure-sql-db.md)