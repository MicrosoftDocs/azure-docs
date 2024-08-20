---
title: Access a dev box with Task view
titleSuffix: Microsoft Dev Box
description: Learn how to connect to your dev box using Task view in Windows for enhanced multitasking and organization.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/1/2024
ms.topic: how-to

#customer intent: As a dev box user, I want to connect to my dev box with Task view, so that I can swap between my local machine and my dev box quickly.
---

# Connect to a dev box by using task view

This article shows you how to connect to your dev box by using Task view. 

## Prerequisites

To complete the steps in this article, you must have:
- Access to a dev box through the developer portal.
- Windows App installed. 
    - If you don't have Windows App installed, see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps?context=/azure/dev-box/context/context&pivots=dev-box)

## Use Task view

Task view is a feature in Windows 11 (and Windows 10) that enhances multitasking and organization. Task view lets you quickly switch between your local machine and your dev boxes. You access it by selecting the Task view button in the taskbar or using the Windows key + Tab keyboard shortcut. In Task view, you see a list of your dev boxes, and you can easily switch to a different one.

### Add a dev box to Task view

1. Open Windows App. 
1. For the dev box you want to configure, select **(...)** > **Add to Task view**.

    :::image type="content" source="media/how-to-access-dev-box-task-view/windows-app-options-add-task-view.png" alt-text="Screenshot of the dev box tile options menu with Add to task view highlighted." lightbox="media/how-to-access-dev-box-task-view/windows-app-options-add-task-view.png"::: 
 
1. On the taskbar, select Task view.

    :::image type="content" source="media/how-to-access-dev-box-task-view/taskbar-task-view.png" alt-text="Screenshot of the task bar with Task view highlighted." lightbox="media/how-to-access-dev-box-task-view/taskbar-task-view.png"::: 

1. To connect, select your dev box.

    :::image type="content" source="media/how-to-access-dev-box-task-view/task-view-local.png" alt-text="Screenshot of Task view showing the available desktops with the dev box highlighted." lightbox="media/how-to-access-dev-box-task-view/task-view-local.png"::: 

### Switch between machines

1. To switch between your dev box and your local machine, on the taskbar, select Task view, and then select **local desktops**.

    :::image type="content" source="media/how-to-access-dev-box-task-view/task-view-dev-box.png" alt-text="Screenshot of Task view showing the available desktops with Local desktops highlighted." lightbox="media/how-to-access-dev-box-task-view/task-view-dev-box.png"::: 
 
### Remove dev box from Task view

1. Open Windows App. 
1. For the dev box you want to configure, select **(...)** > **Remove from Task view**.
 
    :::image type="content" source="media/how-to-access-dev-box-task-view/windows-app-options-remove-task-view.png" alt-text="Screenshot of Windows App devices page, with Remove from Task view highlighted." lightbox="media/how-to-access-dev-box-task-view/windows-app-options-remove-task-view.png"::: 
 
The dev box is removed from Task view. 

### Troubleshooting Task view

If you added a dev box to Task view but no longer have access to it, you might want to remove it from the Task view. Attempting to remove the stale dev box by selecting the [**Remove from Task view**](#remove-dev-box-from-task-view) option in Windows App might fail.

There are two troubleshooting options for removing a stale dev box from Task view: first, uninstall, and reinstall Windows App.
 
If the unwanted dev box still shows in Task view after reinstalling Windows App, you can remove it by deleting the registry entry for the stale dev box.

To remove the registry entry:

1. Open the Registry Editor app.
1. Navigate to `Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RemoteSystemProviders\`
1. Open the subfolder that has a title containing "Windows365".
1. Delete the registry key that is titled as your stale dev box. 
1. Restart your local machine.

## Related content

- Learn how to [configure multiple monitors in Windows App](/windows-app/device-actions?branch=main&tabs=windows)
- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)