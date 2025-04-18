---
title: Troubleshoot Task view with dev box
titleSuffix: Microsoft Dev Box
description: Learn how to troubleshoot issues with removing a stale or inaccessible dev box from Task view in Windows.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/1/2024
ms.topic: troubleshooting-general

#customer intent: As a dev box user, I want to troubleshoot issues with connecting to my dev box by using Task view, so that I can swap between my local machine and my dev box quickly.
---

# Troubleshoot issues with removing stale or inaccessible dev boxes from Task view 

This article shows you how to remove a stale or inaccessible dev box from Task view. You also see how to troubleshoot issues that arise with removing a dev box. 

Task view is a feature in Windows 11 (and Windows 10) that lets you quickly switch between your local machine and your dev boxes. You access it by selecting the Task view button in the taskbar or using the Windows key + Tab keyboard shortcut. In Task view, you see a list of your dev boxes.

## Prerequisites

To complete the steps in this article, you must have:
- Access to a dev box through the developer portal.
- Windows App installed. 
    - If you don't have Windows App installed, see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps?context=/azure/dev-box/context/context&pivots=dev-box).
- A dev box added to Task view
    - If you don't have dev boxes added to Task view, see [Add to Task view](/windows-app/device-actions?tabs=windows#add-to-task-view).

## Troubleshooting Task view

If you added a dev box to Task view but no longer have access to it, you might want to remove it from the Task view.

To remove a dev box from Task view, you can:

- [Remove dev box from Task view in Windows App](#remove-dev-box-from-task-view-in-windows-app)
- [Reinstall Windows App](#reinstall-windows-app)
- [Remove the dev box registry entry](#remove-the-dev-box-registry-entry)

### Remove dev box from Task view in Windows App

1. Open Windows App. 
1. For the dev box you want to configure, select **(...)** > **Remove from Task view**.
 
    :::image type="content" source="media/how-to-troubleshoot-dev-box-task-view/windows-app-options-remove-task-view.png" alt-text="Screenshot of Windows App devices page, with Remove from Task view highlighted." lightbox="media/how-to-troubleshoot-dev-box-task-view/windows-app-options-remove-task-view.png"::: 
 
### Reinstall Windows App

If attempting to remove the stale dev box by selecting the [**Remove from Task view**](#remove-dev-box-from-task-view-in-windows-app) option in Windows App fails, uninstall, and reinstall Windows App.

1. From the Start menu, open **Settings**.
1. Search for and select **Add or remove programs**.
1. Search for **Windows App**.
1. For Windows App, select **(...)** > **Uninstall**. 
1. In the **This app and its related info will be uninstalled** message, select **Uninstall**.

For help reinstalling Windows App see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps?context=/azure/dev-box/context/context&pivots=dev-box).

### Remove the dev box registry entry
 
If the unwanted dev box still shows in Task view after reinstalling Windows App, you can remove it by deleting the registry entry for the stale dev box.

To remove the registry entry:

1. Open the Registry Editor app.
1. Navigate to `Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RemoteSystemProviders\`
1. Open the subfolder that has a title containing "Windows365".
1. Delete the registry key that is titled as your stale dev box. 
1. Restart your local machine.

## Related content

- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)