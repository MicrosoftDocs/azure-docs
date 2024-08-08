---
title: 'Connect to a dev box by using the Windows App'
titleSuffix: Microsoft Dev Box
description: Step-by-step guide to connect to your dev box using the Windows App, configure multiple monitors and quickly switch between machines by using Task view.
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/15/2024
ms.topic: how-to

#customer intent: As a dev box user, I want to be aware of the features of Windows App, so I can decide if I want to use it to connect to my dev boxes.
---

# Connect to a dev box by using the Windows App

This article shows you how to connect to your dev box by using the Windows App. You learn how to install the Windows App, connect to a dev box, and configure multiple monitors. You also learn how to access your dev box through Windows Task view.

The Windows App securely connects you to your Dev Box, and enables you to quickly switch between multiple dev boxes. 


## Prerequisites

- To complete the steps in this article, you must have access to a dev box through the developer portal.

## Install the Windows App

The Windows App might be pre-installed on your computer. If not, you can download and install it from the Microsoft Store:

1. From the Start menu, open Microsoft Store.
1. In the search bar at the top-right, enter *Windows App*, and then press ENTER.
1. From the search results, select **Windows App**.
1. Select **Get**.
 
   :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/microsoft-store-windows-app.png" alt-text="Screenshot of the Microsoft Store Windows App page, with Get highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/microsoft-store-windows-app.png"::: 
 

## Connect to a dev box

The Windows App shows all your available virtual desktops, including your dev boxes. To connect to a dev box by using the Windows App:

1. Once installed, select **Open** in the Microsoft Store. Alternatively, find the app in the Start menu.
1. Agree to the license terms.
1. Read the Welcome screens, and select **Next**, **Next**, and then **Done** to progress.
1. Select **Go to devices**.
 
    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-home.png" alt-text="Screenshot of the Windows App home page." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-home.png"::: 
 
1. On the dev box you want to connect to, select **Connect**.
 
    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-connect.png" alt-text="Screenshot of the Windows App devices page, with Connect highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-connect.png"::: 
 
## Configure multiple monitors

Making the most of your multiple monitors can enhance your productivity. In the Windows App, you can configure your dev box to use all available displays, a single display, or select displays.

1. Open the Windows App. 
1. For the dev box you want to configure, select **(...)** > **Settings**.

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-options-settings.png" alt-text="Screenshot of the dev box options menu with Settings highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-options-settings.png"::: 
 
1. On the settings pane, turn off **Use default settings**. 

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-default-settings.png" alt-text="Screenshot of the dev box display settings with Default settings off highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-default-settings.png"::: 
 
1. In **Display Settings**, in the **Display configuration** list, select the displays to use and configure the options:
 
   | Value | Description | Options |
   |---|---|---|
   | All displays | Remote desktop uses all available displays. | - Use only a single display when in windowed mode. <br> - Fit the remote session to the window. |
   | Single display | Remote desktop uses a single display. | - Start the session in full screen mode. <br> - Fit the remote session to the window. <br> - Update the resolution on when a window is resized. |
   | Select displays | Remote Desktop uses only the monitors you select. | - Maximize the session to the current displays. <br> - Use only a single display when in windowed mode. <br> - Fit the remote connection session to the window. |

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-display-settings.png" alt-text="Screenshot of the dev box display settings with all display settings highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-display-settings.png"::: 

1. Close the **Display** pane.
1. On the dev box tile, select **Connect**.

## Use Task view

Task view is a feature in Windows 11 (and Windows 10) that enhances multitasking and organization. Task view lets you quickly switch between your local machine and your dev boxes. You access it by selecting the Task view button in the taskbar or using the Windows key + Tab keyboard shortcut. In Task view, you see a list of your dev boxes, and you can easily switch to a different one.

### Add a dev box to Task view

1. Open the Windows App. 
1. For the dev box you want to configure, select **(...)** > **Add to Task view**.

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-options-add-task-view.png" alt-text="Screenshot of the dev box tile options menu with Add to task view highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-options-add-task-view.png"::: 
 
1. On the taskbar, select Task view.

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/taskbar-task-view.png" alt-text="Screenshot of the task bar with Task view highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/taskbar-task-view.png"::: 

1. To connect, select your dev box.

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/task-view-local.png" alt-text="Screenshot of Task view showing the available desktops with the dev box highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/task-view-local.png"::: 

### Switch between machines

1. To switch between your dev box and your local machine, on the taskbar, select Task view, and then select **local desktops**.

    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/task-view-dev-box.png" alt-text="Screenshot of Task view showing the available desktops with Local desktops highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/task-view-dev-box.png"::: 
 
### Remove dev box from Task view

1. Open the Windows App. 
1. For the dev box you want to configure, select **(...)** > **Remove from Task view**.
 
    :::image type="content" source="media/how-to-connect-to-dev-box-with-windows-app/windows-app-options-remove-task-view.png" alt-text="Screenshot of the Windows App devices page, with Remove from Task view highlighted." lightbox="media/how-to-connect-to-dev-box-with-windows-app/windows-app-options-remove-task-view.png"::: 
 
The dev box is removed from Task view. 

### Troubleshooting Task view

If you added a dev box to Task view but no longer have access to it, you might want to remove it from the Task view. Attempting to remove the stale dev box by selecting the [**Remove from Task view**](#remove-dev-box-from-task-view) option in the Windows App might fail.

There are two troubleshooting options for removing a stale dev box from Task view: first, uninstall and reinstall the Windows App.
 
If the unwanted dev box still shows in Task view after reinstalling the Windows App, you can remove it by deleting the registry entry for the stale dev box.

To remove the registry entry:

1. Open the Registry Editor app.
1. Navigate to `Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RemoteSystemProviders\`
1. Open the subfolder that has a title containing "Windows365".
1. Delete the registry key that is titled as your stale dev box. 
1. Restart your local machine.

## Related content

- Learn how to [configure multiple monitors](./tutorial-configure-multiple-monitors.md) for your Remote Desktop client.
- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)