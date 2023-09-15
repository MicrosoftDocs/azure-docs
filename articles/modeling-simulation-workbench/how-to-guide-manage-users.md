---
title: Manage users in Azure Modeling and Simulation Workbench
description: In this how-to guide, you learn how to manage users' access to our Modeling and Simulation Workbench.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Owner, I want to manage users who can access a chamber.
---

# Manage users in Azure Modeling and Simulation Workbench

In order for users to access the Azure Modeling and Simulation Workbench chamber, they must be given explicit access. The Workbench uses Azure's built-in role based assignments to manage chamber access – only users with the User Access Administrator can manage role assignments on Azure Resources. In the Workbench, the [IT Admin or Workbench Owner](./concept-user-personas.md)is responsible for managing user access to a chamber.

This article describes how to grant or remove user access to your chamber.

## Prerequisites

- To provision any users within a chamber, those users must exist in your company's Azure AD tenant. If you want to invite a guest to collaborate within your chamber, they must be added to your Azure AD tenant.

- The email alias is used to identify and enable the user's access into the chamber workloads. Each user must have an email account set within their user profile.  The email alias must exactly match the user Azure AD sign in alias. For example, an Azure AD sign in alias of jane.doe@contoso.com must also have email alias of jane.doe@contoso.com.

## Assign user roles

User roles can either be assigned at the resource group level or at the chamber level. Users assigned at the resource group level can see Azure Modeling and Simulation Workbench resources and create workloads with a chamber. Users assigned at the chamber level can perform Azure Modeling and Simulation Workbench operations in Azure portal and access the chamber workloads.

### Assign access to read and create workloads

To allow users to see Azure Modeling and Simulation Workbench resources and to create workloads with a chamber, they need to have Azure roles assigned. These roles should be assigned at the resource group level where the Azure Modeling and Simulation Workbench instance exists. The recommendation to assign these roles at the resource group level is in line with least privilege principles, but these roles can also be assigned at the subscription level.

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | Role             | **Reader**                              |
   | Assign access to | User, group, or service principal       |
   | Members          | \<users Azure account\>                 |

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | Role             | **Classic Storage Account Contributor** |
   | Assign access to | User, group, or service principal       |
   | Members          | \<users Azure account\>                 |

### Assign access to perform workbench operations and access workloads

To allow users to perform Azure Modeling and Simulation Workbench operations in Azure portal and access the chamber workloads, they need to have Azure roles assigned **at the chamber level**. Assigning the role at any other level fails to grant users access to the remote desktop dashboard or chamber workloads. Don't assign both roles to a single user. They should be _either_ Chamber User or Chamber Admin.

   1. Navigate to the chamber you want to allow users to access. You must select and open your chamber, selecting 'myFirstChamber' as an example in following screenshot.

      :::image type="content" source="./media/quickstart-create-portal/chamber-iam-01.png" alt-text="Screenshot of the global search to select your chamber.":::

   1. Confirm you are within the context of your chamber and select **Access control (IAM)** from the left side menu of **your chamber**.

   1. Select **Add** > **Add role assignment**. If you don't have permissions to assign roles, the Add role assignment option is disabled.

      :::image type="content" source="./media/quickstart-create-portal/chamber-iam-02.png" alt-text="Screenshot of the Role assignments page showing where you select the Add role assignment command.":::

   1. The **Add role assignment** pane opens. In the **Role** list, search or scroll to find the roles **Chamber Admin** and **Chamber User**. Choose the role appropriate for the users you're provisioning and select **Next**.

      :::image type="content" source="./media/quickstart-create-portal/chamber-iam-03.png" alt-text="Screenshot of the Add role assignment page showing where you select the Role.":::

   1. Leave the **Assign access to** default **User, group, or service principal**. Select **+ Select members**. In the **Select members** blade on the left side of the screen, search for your security principal by entering a string or scrolling through the list. Select your security principal. Select **Select** to save the selections.

      :::image type="content" source="./media/quickstart-create-portal/chamber-iam-04.png" alt-text="Screenshot of the Add role assignment page showing where you select the security principal.":::

   1. Select **Review + assign** to assign the selected role.

   1. Repeat steps 1-6 to allow more users access to the chamber as **Chamber User** or **Chamber Admin** role.

  > [!NOTE]
  > Allow 5 minutes for the provisioning of the users to propagate throughout the chamber so they have a successful login experience.

## Remove access

When you need to remove user access to your chamber, you need to remove the **Chamber Admin** or **Chamber User** roles assigned to those users.

   1. Navigate to the chamber you want to remove user access from. You must select and open your chamber, selecting 'myFirstChamber' as an example in following screenshot.

      :::image type="content" source="./media/quickstart-create-portal/chamber-iam-01.png" alt-text="Screenshot of the global search to select your chamber.":::

   1. Confirm you are within the context of your chamber and select **Access control (IAM)** from the left side menu of **your chamber**.

   1. Select the checkbox next to any user role assignments you wish to remove, then select the **X Remove** icon.

   1. Select **yes** when prompted to confirm role assignment removal.

   > [!NOTE]
   > This will not immediately interrupt active remote desktop dashboard sessions, but will block future logins. To interrupt or block any active sessions, a connector restart is required. A connector restart will impact all active users and sessions so should be used with caution. It will not stop any active jobs running on the workloads.

## Next steps

To learn how to set up networking for an Azure Modeling and Simulation Workbench chamber, check out [Set up Networking.](./how-to-guide-set-up-networking.md)
