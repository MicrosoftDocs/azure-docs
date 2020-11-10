---
title: "Quickstart: Add a security principal to a role"
description: This article gives an overview of how to add or remove a security principal from a role
author: yarong
ms.author: yarong
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: quickstart
ms.date: 10/21/2020
---

# Quickstart: Add a security principal to a role

In this quickstart, you add a security principal to a data plane role in the Azure portal.

A security principal can be a user, Azure Active Directory group, service principal, or managed identity. Azure Purview uses Azure's role-based access control (RBAC) to manage permissions for security principals. You use the Azure portal to add or remove security principals from [Purview's pre-defined roles](./catalog-permissions.md). 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Add a security principal to a data plane role

To add a security principal to the Data Curator data plane role in an Azure Purview account:

1. Go to the [**Purview accounts**](https://aka.ms/babylonportal) page in the Azure portal.

1. Select the Azure Purview account you want to modify.

1. On the **Purview account** page, select the tab **Access control (IAM)**

1. Click "+ Add"

If upon clicking Add you see two choices showing both marked (disabled) then this means you do not have the right permissions to add anyone to a data plane role on the Azure Purview account. You must find an Owner, User Access Administrator or someone else with role assignment authority on your Azure Purview account. You can look for the right people by selecting "Role assignments" tab and then scrolling down to look for Owner or User Access Administrator and contacting those people.

1. Select "Add role assignment"

1. For the Role type in "Azure Purview Data Curator Role" or "Azure Purview Data Source Administrator Role" depending on what the Service Principal is going to be used for (please see [Catalog Permissions](catalog-permissions.md) for details).
 
1. For "Assign access to" leave the default, "User, group, or service principal"

1. For "Select" enter the name of the user, Azure Active Directory group or service principal you wish to assign and then click on their name in the results pane.

1. Click on "Save"

## Clean up resources

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
