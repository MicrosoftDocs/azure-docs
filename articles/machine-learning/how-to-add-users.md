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
ms.date: 06/24/2022
---

# Add users to your data labeling project

This article shows how to add users to your data labeling project so that they can label data, but not see the rest of your workspace.  You can use these steps to add anyone to your project, whether or not they are from a [data labeling vendor company](how-to-outsource-data-labeling.md).
  
## Prerequisites

* An Azure subscription. If you don't have an Azure subscription [create a free account](https://azure.microsoft.com/free) before you begin.
* An Azure Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md).

You'll need certain permission levels to follow the steps in this article. If you can't follow one of the steps, contact your administrator to get the appropriate permissions.

* To add a guest user, your organization's external collaboration settings must be configured to allow you to invite guests.
* To add a custom role, you must have `Microsoft.Authorization/roleAssignments/write` permissions for your subscription, such as [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../articles/role-based-access-control/built-in-roles.md#owner).
* To add users to your workspace, you must be an **Owner** of the workspace.

## Add custom role

To add a custom role, you must have `Microsoft.Authorization/roleAssignments/write` permissions for your subscription, such as [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md).

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com)
1. Open the menu on the top right and select **View all properties in Azure Portal**.  You'll use Azure portal for all the rest of the steps in this article.
1. Select the **Resource group** link in the middle of the page.
1. On the left, select **Access control (IAM)**.
1. At the top, select **+ Add > Add custom role**.
1. For the **Custom role name**, type the name you want to use.  For example, **Labeler**.
1. In the **Description** box, add a description.  For example, **Labeler access for data labeling projects**.
1. Select **Start from JSON**.
1. At the bottom of the page, select **Next**.
1. Don't do anything for the **Permissions** tab, you'll add permissions in a later step.  Select **Next**.
1. The **Assignable scopes** tab shows your subscription information.  Select **Next**.
1. In the **JSON** tab, above the edit box, select **Edit**.
1. Select lines starting with **"actions:"** and **"notActions:"**.

    :::image type="content" source="media/how-to-add-users/replace-lines.png" alt-text="Create custom role: select lines to replace them in the editor.":::

1. Replace these two lines with the `Actions` and `NotActions` from the appropriate role listed at [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md#data-labeling).  Make sure to copy from `Actions` through the closing bracket, `],`

1. Select **Save** at the top of the edit box to save your changes.

    > [!IMPORTANT]
    > Don't select **Next** until you've saved your edits.

1. After you save your edits, select **Next**.
1. Select **Create** to create the custom role.
1. Select **OK**.


## Add guest user

If your labelers are outside of your organization, you'll now add them so that they can access your workspace.  If labelers are already inside your organization, skip this step.  

To add a guest user, your organization's external collaboration settings must be configured to allow you to invite guests.

1. In [Azure portal](https://portal.azure.com), in the top-left corner, expand the menu and select **Azure Active Directory**.

    :::image type="content" source="media/how-to-add-users/menu-active-directory.png" alt-text="Select Azure Active Directory from the menu.":::

1. On the left, select **Users**.
1. At the top, select **New user**.
1. Select **Invite external user**.
1. Fill in the name and email address for the user.
1. Add a message for the new user.
1. At the bottom of the page, select **Invite**.

    :::image type="content" source="media/how-to-add-users/invite-user.png" alt-text="Invite guest user from Azure Active Directory.":::

Repeat for each of your labelers.  Or use the link at the bottom of the **Invite user** box to invite multiple users in bulk.

> [!TIP]
> Inform your labelers that they'll be receiving this email.  They need to accept the invitation in order to gain access to your project.

## Add users to your workspace

Now that you have your labelers added to the system, you're ready to add them to your workspace.  

To add users to your workspace, you must be an owner of the workspace.

1. In [Azure portal](https://portal.azure.com), in the top search field, type **Machine Learning**.  
1. Select **Machine Learning**.
    :::image type="content" source="media/how-to-manage-workspace/find-workspaces.png" alt-text="Search for Azure Machine Learning workspace.":::

1. Select the workspace that contains your data labeling project.
1. On the left, select **Access control (IAM)**.
1. At the top, select **+ Add > Add role assignment**.

    :::image type="content" source="media/how-to-add-users/add-role-assignment.png" alt-text="Add role assignment from your workspace.":::

1. Select the **Labeler** or **Labeling Team Lead** role in the list.  Use **Search** if necessary to find it.
1. Select **Next**.
1. In the middle of the page, next to **Members**, select the **+ Select members** link.
1. Select each of the users you want to add. Use **Search** if necessary to find them.
1. At the bottom of the page, select the **Select** button.
1. Select **Next**.
1. Verify that the **Role** is correct, and that your users appear in the **Members** list.
1. Select **Review + assign**.

## For your labelers

Your labelers are now all set up to begin labeling in your project.  But they'll still need information from you to access the project.  

If you haven't created your labeling project yet, do so before you contact your labelers.

* [Create an image labeling project](how-to-create-image-labeling-projects.md).
* [Create a text labeling project (preview)](how-to-create-text-labeling-projects.md)

Send the following to your labelers, after filling in your workspace and project names:

1. Accept the invite from **Microsoft Invitations (invites@microsoft.com)**.
1. Follow the steps on the web page after you accept.  Don't worry if at the end you're on a page that says you don't have any apps.
1. Open [Azure Machine Learning studio](https://ml.azure.com).
1. Use the dropdown to select the workspace **\<workspace-name\>**.  
1. Select the **Label data** tool for **\<project-name\>**.
    :::image type="content" source="media/how-to-add-users/label-data.png" alt-text="Screenshot showing the label data tool.":::
1. For more information about how to label data, see [Labeling images and text documents](how-to-label-data.md).

## Next steps

* Learn more about [working with a data labeling vendor company](how-to-outsource-data-labeling.md)
* [Create an image labeling project and export labels](how-to-create-image-labeling-projects.md)
* [Create a text labeling project and export labels (preview)](how-to-create-text-labeling-projects.md)