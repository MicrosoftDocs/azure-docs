---
title: "Quickstart: Add users to Modeling and Simulation Workbench"
description: "Add users to a Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: quickstart
ms.date: 09/25/2024

#customer intent: As a administrator, I want to add users so that they can begin using the Modeling and Simulation Workbench.

---

# Quickstart: Add users to Modeling and Simulation Workbench

After you have created a Modeling and Simulation Workbench, you will need to add users and assign roles.  In this quickstart, you will learn to create users with the correct Azure Entra role assignments to enable them to do tasks.

If you don't have a service subscription, [create a free
trial account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

[!INCLUDE [prerequisite-account-sub](includes/prerequisite-account-sub.md)]

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

* Users to be added must already exist in your company's Microsoft Entra ID tenant. If you want to invite guests to collaborate in your chamber, you must add them to your Microsoft Entra ID tenant.

* Email fields for users must be populated in the Microsoft Entra ID user profile. The email alias must exactly match the user's Microsoft Entra sign-in alias. For example, a Microsoft Entra sign-in alias of <jane.doe@contoso.com> must also have email alias of <jane.doe@contoso.com>.

## Add users

Users are added to chambers as either *Chamber Admin* or *Chamber User* roles. You can learn more about [user personas in Modeling and Simulation Workbench](concept-user-personas.md) to pick the most fitting role.

If the user is not already an **Owner** of either the subscription or the resource group, they must be assigned the following roles in addition to a chamber role.  Microsoft recommends using least privilege to protect your environment assigning the lowest level of privilege needed to effectively perform their task.

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

1. Navigate to the Resource Group where the workbench is deployed.
1. Select **Access Control (IAM)** from the left menu.
1. From the roles screen, select **Add** > **Add role assignment**.
   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-02.png" alt-text="Screenshot that shows selections for adding a role assignment.":::
1. The **Add role assignment** pane opens. In the **Role** list, search for or scroll to find the **Reader** role. Select **Next**.
   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-03.png" alt-text="Screenshot of the Add role assignment page showing where you select the Role.":::
1. Leave the **Assign access to** as the default of **User, group, or service principal**. Choose **+ Select members**.
1. On the **Select members** panel, search for and click on the users to be added, and then choose **Select**.
   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-04.png" alt-text="Screenshot of the pane for adding a role assignment and selecting a security principal.":::
1. Select **Review + assign** to assign the selected role.
1. Repeat these same steps, but assign the **Classic Storage Account Contributor** role for the same users.

### Assign Chamber Admin or Chamber User role

Users must also be assigned a role at the chamber level which grants them access to onyl that chamber. Chamber roles differentiate a normal user to one with `sudo` privileges. **Chamber Admin** has `sudo` privileges in all virtual machines (VM) in the chamber, whereas **Chamber User** does not.

1. Navigate to the chamber where the role is to be assigned. Be sure you are at the chamber level, as chamber roles do not inherit.
1. Select **Access Control (IAM)** from the left menu.
1. From the roles screen, select **Add** > **Add role assignment**.
   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-02.png" alt-text="Screenshot that shows selections for adding a role assignment.":::
1. The **Add role assignment** pane opens. In the **Role** list, search for or scroll to find either the **Chamber User** or the **Chamber Admin** role. Select **Next**.
   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-03.png" alt-text="Screenshot of the Add role assignment page showing where you select the Role.":::
1. Leave the **Assign access to** as the default of **User, group, or service principal**. Choose **+ Select members**.
1. On the **Select members** panel, search for and click on the users to be added, and then choose **Select**.
   :::image type="content" source="./media/quickstart-create-portal/chamber-iam-04.png" alt-text="Screenshot of the pane for adding a role assignment and selecting a security principal.":::
1. Select **Review + assign** to assign the selected role.

   > [!NOTE]
   > Allow at least five minutes for the provisioning of the users to propagate throughout the chamber, so they have a successful login experience.

## Next step

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)
