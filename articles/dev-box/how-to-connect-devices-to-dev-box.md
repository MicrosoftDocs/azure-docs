---  
title: How to connect Android devices to a dev box
description: Learn how to connect Android devices to a dev box for efficient testing and debugging, enhancing your app development workflow and productivity.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 12/11/2024

#customer intent: As a developer, I want to connect Android devices to my dev box so that I can develop apps for Android.

---

# Connect Android devices to a dev box

Connecting Android devices to a dev box enhances your app development process by allowing you to test and debug directly on physical devices. This article provides step-by-step instructions to help you connect your Android devices to a dev box, streamlining your development workflow.

## Prerequisites

- Access to a dev box
- A client computer to connect to the dev box from

## Prepare your client computer

To connect Android devices to your dev box, you first connect the devices to client computer you use to connect to the dev box.

### Connect Android devices

Connect your Android device to the client computer you'll use to connect to your dev box.

1. To open Device Manager, from the search box on the taskbar, run `devmgmt.msc`.
1. Check that your device displays like one of the following options:
    - Device name: Universal Serial Bus / Pixel 6
    - Android Device / Android Composite Android Debug Bridge (ADB) Interface
1. Uninstall nonstandard devices and drivers and restart your computer.
1. In Device manager, verify your Android device displays.

> [!CAUTION]
> Some devices like Samsung might not connect if the ADB interface device exists on the computer you connect from. To resolve this issue, uninstall the device.

### Configure USB redirection

Configure following Local Group Policy settings to allow USB redirection on your client computer. 

1. To open Local Group Policy Editor, from a cmd window, run `gpedit.msc`.
1. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Redirection**.
1. Enable **Allow RDP redirection of other supported RemoteFX USB devices from this computer** for **Administrators and Users**.
1. To apply the policy changes, from a cmd window, run `gpupdate /force`.
1. Restart your computer.

## Prepare your dev box

When your Android devices are connected to your client computer, you can configure your dev box to access them by enabling USB redirection.

### Configure USB redirection

Configure following Local Group Policy settings to allow USB redirection on your dev box. 

1. To open Local Group Policy Editor, from a cmd window, run `gpedit.msc`.
1. Open **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection**.
1. Set **Do not allow supported Plug and Play device redirection** to **Disabled**.
1. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Device Redirection**.
1. Enable **Allow RDP redirection of other supported RemoteFX USB devices from this computer** for **Administrators and Users**.
1. To apply the policy changes, from a cmd window, run `gpupdate /force`.
1. Restart your computer.

## Troubleshoot ADB Connection Issues

If the Android device isn't accessible to ADB, check the latest device drivers are installed and the device displays in Device Manager. 

Perform the following steps on your dev box:

1. To open Device Manager, from the search box on the taskbar, run `devmgmt.msc`.
1. Ensure the Google USB driver is installed and the device appears as [**Android Device \ Android Composite ADB Interface**](https://developer.android.com/studio/run/win-usb). 
    - Devices from other manufacturers might not display in Device manager. 
    - If your device is from another manufacturer, check [Install a USB driver](https://developer.android.com/studio/run/oem-usb#InstallingDriver) for manufacturer specific drivers. The goal is to make the ADB interface device show up in Device Manager. 
    - The device name can vary from manufacturer to manufacturer, such as "Samsung Android Phone \ Samsung Android ADB Interface" or "Android Device \ Android Composite ADB Interface".  
1. Restart your computer. 

## Related content

- [Microsoft Dev Box: Frequently asked questions](dev-box-faq.yml)