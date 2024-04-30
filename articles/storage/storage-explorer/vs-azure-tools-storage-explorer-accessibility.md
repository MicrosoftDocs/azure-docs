---
title: Azure Storage Explorer Accessibility
description: Understand accessibility in Azure Storage Explorer. Review what screen readers are available, the zoom capability, high contrast themes, and shortcut keys.
services: storage
author: MrayermannMSFT
manager: jinglouMSFT
ms.assetid: 1ed0f096-494d-49c4-ab71-f4164ee19ec8
ms.service: azure-storage
ms.topic: article
ms.date: 02/20/2018
ms.author: marayerm
---

# Storage Explorer Accessibility

## Screen Readers

Storage Explorer supports the use of a screen reader on Windows and Mac. The following screen readers are recommended for each platform:

Platform | Screen Reader
---------|--------------
Windows  | NVDA
Mac      | Voice Over
Linux    | (screen readers are not supported on Linux)

If you run into an accessibility issue when using Storage Explorer, please [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues).

## Zoom

You can make the text in Storage Explorer larger via zooming in. To zoom in, click on **Zoom In** in the Help menu. You can also use the Help menu to zoom out and reset the zoom level back to the default level.

![Zoom options in the help menu][0]

The zoom setting increases the size of most UI elements. It is recommended to also enable large text and zoom settings for your OS to ensure that all UI elements are properly scaled.

## High Contrast Themes

Storage Explorer has two high contrast themes, **High Contrast Light** and **High Contrast Dark**. You can change your theme by selecting in from the Help > Themes menu.

![Themes sub menu][1]

The theme setting changes the color of most UI elements. It is recommended to also enable your OS' matching high contrast theme to ensure that all UI elements are properly colored.

## Shortcut Keys

### Window Commands

Command       | Keyboard shortcut
--------------|--------------------
New Window    | **Control+Shift+N**
Close Editor  | **Control+F4**
Quit          | **Control+Shift+W**

### Navigation Commands

Command                | Keyboard shortcut
-----------------------|----------------------
Focus Next Panel       | **F6**
Focus Previous Panel   | **Shift+F6**
Explorer               | **Control+Shift+E**
Account Management     | **Control+Shift+A**
Toggle Side Bar        | **Control+B**
Activity Log           | **Control+Shift+L**
Actions and Properties | **Control+Shift+P**
Current Editor         | **Control+Home**
Next Editor            | **Control+Page Down**
Previous Editor        | **Control+Page Up**

### Zoom Commands

Command  | Keyboard shortcut
---------|------------------
Zoom In  | **Control+=**
Zoom Out | **Control+-**

### Blob and File Share Editor Commands

Command | Keyboard shortcut
--------|--------------------
Back    | **Alt+Left Arrow**
Forward | **Alt+Right Arrow**
Up      | **Alt+Up Arrow**

### Editor Commands

Command | Keyboard shortcut
--------|------------------
Copy    | **Control+C**
Cut     | **Control+X**
Paste   | **Control+V**
Refresh  | **Control+R**

### Other Commands

Command                | Keyboard shortcut
-----------------------|------------------
Toggle Developer Tools | **F12**
Reload                 | **Alt+Control+R**

[0]: ./media/vs-azure-tools-storage-explorer-accessibility/Zoom.png
[1]: ./media/vs-azure-tools-storage-explorer-accessibility/HighContrast.png
