---
title: Manage users in Azure Modeling and Simulation Workbench
description: In this how-to guide, you learn how to manage users' access to Azure Modeling and Simulation Workbench.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Workbench Owner in Azure Modeling and Simulation Workbench, I want to manage users who can access a chamber.
---

# Manage users in Azure Modeling and Simulation Workbench

For users to access an Azure Modeling and Simulation Workbench chamber, they need explicit access. Azure Modeling and Simulation Workbench uses the built-in role-based assignments in Azure to manage chamber access. Only the User Access Administrator can manage role assignments on Azure resources. In Azure Modeling and Simulation Workbench, the [IT Admin or Workbench Owner](./concept-user-personas.md) is responsible for managing user access to a chamber.

This article describes how to grant or remove user access to your chamber.

## Prerequisites

- To provision users in a chamber, make sure that those users exist in your company's Microsoft Entra tenant. If you want to invite guests to collaborate in your chamber, you must add them to your Microsoft Entra tenant.

- You use email aliases to identify and enable users' access to the chamber workloads. Each user must have an email account set in the user profile. The email alias must exactly match the user's Microsoft Entra sign-in alias. For example, a Microsoft Entra sign-in alias of jane.doe@contoso.com must also have email alias of jane.doe@contoso.com.

## Assign user roles

You can assign user roles at either of these levels:

- Users assigned at the *resource group level* can see Azure Modeling and Simulation Workbench resources and create workloads in a chamber.
- Users assigned at the *chamber level* can perform Azure Modeling and Simulation Workbench operations in the Azure portal and access the chamber workloads.

### Assign access to read and create workloads

To allow users to see Azure Modeling and Simulation Workbench resources and to create workloads in a chamber, you need to assign Azure roles to them. Assign these roles at the resource group level, where the Azure Modeling and Simulation Workbench instance exists. The recommendation to assign these roles at the resource group level is in line with least-privilege principles, but you can also assign these roles at the subscription level.

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | **Role**             | **Reader**                              |
   | **Assign access to** | **User, group, or service principal**       |
   | **Members**          | \<user's Azure account\>                 |

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | **Role**             | **Classic Storage Account Contributor** |
   | **Assign access to** | **User, group, or service principal**       |
   | **Members**          | \<user's Azure account\>                 |

### Assign access to perform workbench operations and access workloads

To allow users to perform Azure Modeling and Simulation Workbench operations in the Azure portal and access the chamber workloads, assign them Azure roles assigned *at the chamber level*. Assigning the roles at any other level fails to grant users access to the remote desktop dashboard or chamber workloads.

Don't assign both roles to a single user. The user should be *either* a Chamber User or a Chamber Admin.

1. Go to the chamber that you want to allow users to access. Select **Chamber (preview)**, and then select and open your chamber. The following screenshot shows an example chamber named **myFirstChamber**.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-01.png" alt-text="Screenshot of the global search to select a chamber.":::

1. Confirm that you're within the context of your chamber and select **Access control (IAM)** from the left menu.

1. Select **Add** > **Add role assignment**. If you don't have permissions to assign roles, the **Add role assignment** option is unavailable.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-02.png" alt-text="Screenshot that shows selections for adding a role assignment.":::

1. The **Add role assignment** pane opens. In the **Role** list, search or scroll to find the roles **Chamber Admin** and **Chamber User**. Choose the role that's appropriate for the users you're provisioning, and then select **Next**.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-03.png" alt-text="Screenshot of the Add role assignment page showing where you select the Role.":::

1. Leave the **Assign access to** default of **User, group, or service principal**. Choose **+ Select members**. On the **Select members** panel, search for your security principal by entering a string or scrolling through the list. Select your security principal, and then choose **Select**.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-04.png" alt-text="Screenshot of the pane for adding a role assignment and selecting a security principal.":::

1. Select **Review + assign** to assign the selected role.

1. Repeat steps 1 to 6 to allow more users access to the chamber as the Chamber User or Chamber Admin role.

   > [!NOTE]
   > Allow five minutes for the provisioning of the users to propagate throughout the chamber, so they have a successful login experience.

## Remove access

When you want to remove user access to your chamber, you need to remove the Chamber Admin or Chamber User roles assigned to those users:

1. Go to the chamber where you want to remove user access. Select **Chamber (preview)**, and then select and open your chamber. The following screenshot shows an example chamber named **myFirstChamber**.

   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-01.png" alt-text="Screenshot of the global search to select your chamber.":::

1. Confirm that you're within the context of your chamber and select **Access control (IAM)** from the left menu.

1. Select the checkbox next to any user role assignments that you want to remove, and then select the **X Remove** icon.

1. When you're prompted to confirm role assignment removal, select **Yes**.

> [!NOTE]
> This procedure won't immediately interrupt active remote desktop dashboard sessions, but it will block future logins. To interrupt or block any active sessions, you must restart the connector. A connector restart will affect all active users and sessions, so use it with caution. It won't stop any active jobs that are running on the workloads.

## Next steps

To learn how to set up networking for an Azure Modeling and Simulation Workbench chamber, see [Set up networking](./how-to-guide-set-up-networking.md).
