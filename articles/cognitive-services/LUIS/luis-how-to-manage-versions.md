---
title: Manage versions in LUIS apps in Azure | Microsoft Docs
description: Learn how to manage versions in Language Understanding (LUIS) applications.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 03/29/2017
ms.author: diberry
---

# Manage versions

Each time you work on the model, create a different [version](luis-concept-version.md) of the app. 

## Set active version
To work with versions, open your app by selecting its name on **My Apps** page, and then select **Settings** in the top bar.

![Versions page](./media/luis-how-to-manage-versions/settings.png)

The **Settings** page allows you to configure settings for the entire app including versions, and collaborators. 

## Clone a version
1. On the **Settings** page, after the App Settings and Collaborators sections, find the row with the version you want to clone. Select the ellipsis (***...***) button on the far-right. 

    ![Version row properties](./media/luis-how-to-manage-versions/version-section.png)

2. Select **Clone** from the list.

    ![Version row properties choice](./media/luis-how-to-manage-versions/version-three-dots-modal.png)

3. In the **Clone version** dialog box, type a name for the new version such as "0.2".

   ![Clone Version dialog box](./media/luis-how-to-manage-versions/version-clone-version-dialog.png)
 
 > [!NOTE]
 > Version ID can consist only of characters, digits or '.' and cannot be longer than 10 characters.
 
 A new version with the specified name is created and set as the active version.
 
  ![Version is created and added to the list](./media/luis-how-to-manage-versions/new-version.png)

 > [!NOTE]
 > As shown in the preceding image, a published version is associated with a colored mark, indicating the type of slot where it has been published: Production (green), Staging (red) and both (black). The training and publishing dates are displayed for each published version.

## Set active version
1. On the **Settings** page, in the **Versions** list, select the ellipsis (***...***) button at the far right.

2. From the pop-up list, select **Set as active**.

    ![Set active version](./media/luis-how-to-manage-versions/set-active-version.png)

    The active version is highlighted by a light blue color, as shown in the following screenshot:

    ![The active version](./media/luis-how-to-manage-versions/set-active-version-done.png) 


## Import version
You can import a version from a JSON file. Once you import a version, the new version becomes the active version.

**To import a version:**

1. On the **Settings** page, select **Import new version** button.

    ![Import Button](./media/luis-how-to-manage-versions/import-version.png)

2. Select **browse** and choose the JSON file.

    ![Import version dialog](./media/luis-how-to-manage-versions/import-version-dialog.png)

You only need to set a version ID if the version in the JSON file already exists in the app.

## Export version
You can export a version to a JSON file.

**To export a version:**

1. On the **Settings** page, in the **Versions** list, select the ellipsis (***...***) button at the far right.

2. Select **Export** in the pop-up list of actions and select where you want to save the file.

## Delete a version
You can delete versions, but you have to keep at least one version of the app. You can delete all versions except the active version. 

1. On the **Settings** page, in the **Versions** list, select the ellipsis (***...***) button at the far right.

2. Select **Delete** in the pop-up list of actions and select where you want to save the file.

    ![Delete version confirmation](./media/luis-how-to-manage-versions/delete-menu.png) 


## Rename a version
You can rename versions as long as the version name is not already in use.  

1. On the **Settings** page, in the **Versions** list, select the ellipsis (***...***) button at the far right.

2. Select **Rename** in the pop-up list of actions.

3. Enter the new version name and select **Done**.

    ![Rename version confirmation](./media/luis-how-to-manage-versions/rename-popup.png) 
