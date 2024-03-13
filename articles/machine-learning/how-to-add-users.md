---
title: Add users to your data labeling project
title.suffix: Azure Machine Learning
description: Add users to your data labeling project so that they can label data, but not see the rest of your workspace.
author: kvijaykannan 
ms.author: vkann 
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 03/12/2024
# customer intent: As a data labeling project manager, I want to add users to my data labeling project so that they can label data, but with restricted permissions.
---

# Add users to your data labeling project

This article shows how to add users to your data labeling project so that they can label data, but can't see the rest of your workspace. These steps can add anyone to your project, whether or not they are from a [data labeling vendor company](how-to-outsource-data-labeling.md).
  
## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
* An Azure Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md).

You need certain permission levels to follow the steps in this article. If you can't follow one of the steps because of a permissions issue, contact your administrator to request the appropriate permissions.

* To add a guest user, your organization's external collaboration settings needs the correct configuration to allow you to invite guests.
* To add a custom role, you must have `Microsoft.Authorization/roleAssignments/write` permissions for your subscription - for example, [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../articles/role-based-access-control/built-in-roles.md#owner).
* To add users to your workspace, you must be an **Owner** of the workspace.

## Add custom role

When you add a user to your project, you assign them a role to define their level of access. Before you add users, define the roles you want to use.

There is a built-in role for data labeling, scoped only to labeling data. If you want to use the built-in role for all your labelers, skip this section and proceed to [add guest user](#add-guest-user).  

The following custom roles give other levels of access for a data labeling project. Define all the roles you want to use before moving on to add the users.

 To add a custom role, you must have `Microsoft.Authorization/roleAssignments/write` permissions for your subscription - for example, [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md).

1. Access the resource group for your workspace in the Azure portal. 
    1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
    1. Open the menu on the top right, and select **View all properties in Azure Portal**. You use the Azure portal for the remaining steps in this section.
    1. Select the **Resource group** link in the middle of the page.
1. Add a custom role
    1. On the left, select **Access control (IAM)**.
    1. At the top, select **+ Add > Add custom role**.
    1. For the **Custom role name**, type the name you want to use. For example, **Labeling team lead**.
    1. In the **Description** box, add a description. For example, **Team leader for labeling projects**.
    1. Select **Start from JSON**.
    1. Ignore the **Select a file** entry, even though it is starred.  You'll create the JSON in a future step.
    1. At the bottom of the page, select **Next**.
1. Skip tabs.
    1. Don't do anything for the **Permissions** tab. You add permissions in a later step. Select **Next**.
    1. The **Assignable scopes** tab shows your subscription information. Select **Next**.
1. Edit the JSON definition.
    1. In the **JSON** tab, above the edit box, select **Edit**.
    1. Select lines starting with **"actions:"** and **"notActions:"**.

        :::image type="content" source="media/how-to-add-users/replace-lines.png" alt-text="Create custom role: select lines to replace them in the editor.":::

    1. Replace these two lines with the `Actions` and `NotActions` from the appropriate role in the following tabs. Make sure to copy from `Actions` through the closing bracket, `],`.

        [!INCLUDE [custom-role-data-labeling](includes/custom-role-data-labeling.md)]

    1. Select **Save** at the top of the edit box to save your changes.

    > [!IMPORTANT]
    > Don't select **Next** until you've saved your edits.

1. After you save your edits, select **Next**.
1. Select **Create** to create the custom role.
1. Select **OK**.

## Add guest user

If your labelers are outside of your organization, add them, so they can access your workspace. If labelers are already inside your organization, skip this step and proceed to [add users to your workspace](#add-users-to-your-workspace).

To add a guest user, your organization's external collaboration settings need the correct configuration to allow you to invite guests.

1. In [Azure portal](https://portal.azure.com), in the top-left corner, expand the menu and select **Microsoft Entra ID**.

    :::image type="content" source="media/how-to-add-users/menu-active-directory.png" alt-text="Select Microsoft Entra ID from the menu.":::

1. On the left, select **Users**.
1. At the top, select **New user**.
1. Select **Invite external user**.
1. Fill in the name and email address for the user.
1. Add a message for the new user.
1. At the bottom of the page, select **Invite**.

    :::image type="content" source="media/how-to-add-users/invite-user.png" alt-text="Invite guest user from Microsoft Entra ID.":::

Repeat these steps for each of the guest users. Or use the link at the bottom of the **Invite user** box to invite multiple users in bulk.

> [!TIP]
> Inform your labelers that they will receive an email. They must accept the invitation in order to gain access to your project.

## Add users to your workspace

Once you have the appropriate users in your system and the role(s) defined, add the users to your workspace so that they can access your data labeling project.

To add users to your workspace, you must be an owner of the workspace.

1. Access your workspace in the Azure portal. 
    1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
    1. Open the menu on the top right, and select **View all properties in Azure Portal**. You use the Azure portal for the remaining steps in this section.
1. On the left, select **Access control (IAM)**.
1. At the top, select **+ Add > Add role assignment**.

    :::image type="content" source="media/how-to-add-users/add-role-assignment.png" alt-text="Add role assignment from your workspace.":::

1. Select the role you want to use from the list. Use **Search** if necessary to find it.
1. Select **Next**.
1. In the middle of the page, next to **Members**, select the **+ Select members** link.
1. Select each of the users you want to add. Use **Search** if necessary to find them.
1. At the bottom of the page, select the **Select** button.
1. Select **Next**.
1. Verify that the **Role** is correct, and that your users appear in the **Members** list.
1. Select **Review + assign**.

## For your labelers

Once labelers have been added as users in the workspace, they can begin labeling in your project. However, they still need information from you to access the project.

Be sure to create your labeling project before you contact your labelers.

* [Create an image labeling project](how-to-create-image-labeling-projects.md).
* [Create a text labeling project (preview)](how-to-create-text-labeling-projects.md)

Send the following information to your labelers, after you fill in your workspace and project names:

1. Accept the invite from **Microsoft Invitations (invites@microsoft.com)**.
1. Follow the steps on the web page after you accept. Don't worry if, at the end, you find yourself on a page that says you don't have any apps.
1. Open [Azure Machine Learning studio](https://ml.azure.com).
1. Use the dropdown to select the workspace **\<workspace-name\>**.
1. Select the **Label data** tool for **\<project-name\>**.
    :::image type="content" source="media/how-to-add-users/label-data.png" alt-text="Screenshot shows the label data tool in a project.":::
1. For more information about how to label data, see [Labeling images and text documents](how-to-label-data.md).

## Related content

* Learn more about [working with a data labeling vendor company](how-to-outsource-data-labeling.md)
* [Create an image labeling project and export labels](how-to-create-image-labeling-projects.md)
* [Create a text labeling project and export labels (preview)](how-to-create-text-labeling-projects.md)
