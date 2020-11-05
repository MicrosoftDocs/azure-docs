---
title: "Quickstart: Add a security principal to a role"
description: This article gives an overview of how to add or remove a security principal from a role
author: rogerbu
ms.author: rogerbu
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: quickstart
ms.date: 09/10/2020
---

# Quickstart: Add a security principal to a role

In this quickstart, you add a security principal to a security role in the Azure Purview portal.

A security principal can be a user, Azure Active Directory group, service principal, or managed identity. Azure Purview uses role-based access control (RBAC) to manage permissions for security principals. You use the Azure Purview portal to add or remove them from the following defined security roles: Catalog administrator, Data source administrator, Curator, Contributor, Automated data source process.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Add a security principal to a security role

To add a security principal to a Catalog administrator security role in an Azure Purview account:

1. Go to the [**Purview accounts**](https://aka.ms/babylonportal) page in the Azure portal.

1. Select the Azure Purview account you want to modify.

1. On the **Purview account** page, select **Launch purview account**.

1. Select **Management Center** in the left pane, and then select **Assign roles**.

   :::image type="content" source="./media/add-security-principal/select-assign-roles.png" alt-text="Screenshot showing how to select Management Center and Assign roles.":::

1. From the **Assign roles** window, note which security principals are assigned to each role. 

   Select the up and down arrows (:::image type="content" source="./media/add-security-principal/up-arrow.png" alt-text="Icon of up arrow to select to expand a section." border="false":::) and (:::image type="content" source="./media/add-security-principal/down-arrow.png" alt-text="Icon of down arrow to select to collapse a section." border="false":::) to make it easier to navigate the window by expanding and collapsing sections as needed.

   The window has five sections, one for each role type. The following screenshot shows the five sections in collapsed mode so that their values aren't visible.

   :::image type="content" source="./media/add-security-principal/assign-roles-window.png" alt-text="Screenshot showing the Assign roles windows in collapsed mode.":::

1. Select the **Add user** drop-down list from the top menu, and then select **Catalog administrator**. The **Add user** button is active only for users in the Catalog administrator or Data source administrator roles.

   :::image type="content" source="./media/add-security-principal/select-catalog-administrator.png" alt-text="Screenshot showing how to add a Catalog administrator.":::

1. From the **Add catalog administrator** page, search for the security principal to add to the Catalog administrator role, and then select **Apply**.

   You can add multiple users or Azure Active Directory groups at once. All names must validate against the catalog's Azure tenant's Azure Active Directory.

   :::image type="content" source="./media/add-security-principal/add-catalog-administrator.png" alt-text="Screenshot showing how to add security principals to the Catalog administrator role.":::

## Assign permission to scan content into the catalog

To scan content into the catalog, you must be an Owner or Contributor in the Azure portal as well as a Catalog administrator or Data source administrator in the Azure Data Catalog portal.

The previous section described how to add a security principal to the Catalog administrator role in the Azure Purview portal. This section describes how to assign a security principal to the Contributor role on the catalog in the Azure portal. It's the final step to enable a security principal to scan content.

1. Sign in to the [Azure portal](https://portal.azure.com) and find your catalog resource.

1. From the left pane, select **Access control (IAM)**.

   :::image type="content" source="./media/add-security-principal/select-access-control.png" alt-text="Screenshot showing how to select Access control (IAM).":::

1. Under **Add a role assignment**, select **Add**.

   :::image type="content" source="./media/add-security-principal/select-add-role-assignment.png" alt-text="Screenshot showing how to add a role assignment.":::

1. In the **Add role assignment** dialog box, set the **Role** to **Contributor**.

1. In the **Select** drop-down list, choose the user you want to set up for scanning, and then select **Save**.

   :::image type="content" source="./media/add-security-principal/add-role-assignment-dialog.png" alt-text="Screenshot showing how to set the role assignment to Contributor.":::

## Clean up resources

If you no longer need the role assignment you made for your security principal in the Azure Purview portal, remove it with the following steps:

1. In the Azure Purview portal for your account, select **Management Center** in the left pane, and then select **Assign roles**.

1. In the **Catalog administrator** list, select the name of the security principal that you want to remove, and then select **Remove access** from the top menu.

If you no longer need the role assignment you made in the Azure portal, remove it with the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and find your catalog resource.

1. From the left pane, select **Access control (IAM)**

1. Under **View role assignments**, select **View**.

1. In the list of role assignments, select the assignment you want to remove, and then select **Remove** from the top menu.

## Next steps

In this quickstart, you learned how to add a security principal to an Azure Purview role.

Advance to the next article to learn how to run the starter kit and scan data into the catalog.

> [!div class="nextstepaction"]
> [Run the starter kit and scan data](starter-kit-tutorial-1.md)
