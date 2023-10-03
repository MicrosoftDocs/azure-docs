---
title: Compare the features of the Remote Desktop clients for Azure Virtual Desktop - Azure Virtual Desktop
description: Compare the features of the Remote Desktop clients when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: conceptual
ms.date: 11/29/2022
ms.author: daknappe
---

# Compare the features of the Remote Desktop clients when connecting to Azure Virtual Desktop

There are some differences between the features of each of the Remote Desktop clients when connecting to Azure Virtual Desktop. Below you can find information about what these differences are.

> [!TIP]
> Some clients and features differ when using Azure Virtual Desktop to using Remote Desktop Services. If you want to see the clients and features for Remote Desktop Services, see [Compare the clients: features](/windows-server/remote/remote-desktop-services/clients/remote-desktop-features) and [Compare the clients: redirections](/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare).

## Features comparison

The following table compares the features of each Remote Desktop client when connecting to Azure Virtual Desktop.

| Feature | Windows Desktop<br />&<br />Azure Virtual Desktop Store app | Remote Desktop app | Android or Chrome OS | iOS or iPadOS | macOS | Web | Description |
|--|--|--|--|--|--|--|--|
| Remote Desktop sessions | X | X | X | X | X | X | Desktop of a remote computer presented in a full screen or windowed mode. |
| Integrated RemoteApp sessions | X |  |  |  | X |  | Individual applications integrated into the local desktop as if they are running locally. |
| Immersive RemoteApp sessions |  | X | X | X |  | X | Individual applications presented in a window or maximized to a full screen. |
| Multiple monitors | 16 monitor limit |  |  |  | 16 monitor limit |  | Enables the remote session to use all local monitors.<br /><br />Each monitor can have a maximum resolution of 8K, with the total resolution limited to 32K. These limits depend on factors such as session host specification and network connectivity. |
| Dynamic resolution | X | X |  |  | X | X | Resolution and orientation of local monitors is dynamically reflected in the remote session. If the client is running in windowed mode, the remote desktop is resized dynamically to the size of the client window. |
| Smart sizing | X | X |  |  | X |  | Remote Desktop in Windowed mode is dynamically scaled to the window's size. |
| Localization | X | X | English only | X |  | X | Client user interface is available in multiple languages. |
| Multi-factor authentication | X | X | X | X | X | X | Supports multi-factor authentication for remote connections. |
| Teams optimization for Azure Virtual Desktop | X |  |  |  | X |  | Media optimizations for Microsoft Teams to provide high quality calls and screen sharing experiences. Learn more at [Use Microsoft Teams on Azure Virtual Desktop](./teams-on-avd.md). |

## Redirections comparison

The following tables compare support for device and other redirections across the different Remote Desktop clients when connecting to Azure Virtual Desktop. Organizations can configure redirections centrally through Azure Virtual Desktop RDP properties or Group Policy.

> [!IMPORTANT]
> You can only enable redirections with binary settings that apply to both to and from the remote machine. One-way blocking of redirections from only one side of the connection is not supported.

### Input redirection

The following table shows which input methods are available for each Remote Desktop client:

| Input | Windows Desktop<br />&<br />Azure Virtual Desktop Store app | Remote Desktop app | Android or Chrome OS | iOS or iPadOS | macOS | Web client |
|--|--|--|--|--|--|--|
| Keyboard | X | X | X | X | X | X |
| Mouse | X | X | X | X | X | X |
| Touch | X | X | X | X |  | X |
| Multi-touch | X | X | X | X |  |  |
| Pen | X |  | X | X\* |  |  |

\* Pen input redirection is not supported when connecting to Windows Server 2012 or Windows Server 2012 R2.

### Port redirection

The following table shows which ports can be redirected for each Remote Desktop client:

| Redirection | Windows Desktop<br />&<br />Azure Virtual Desktop Store app | Remote Desktop app | Android or Chrome OS | iOS or iPadOS | macOS | Web client |
|--|--|--|--|--|--|--|
| Serial port | X |  |  |  |  |  |
| USB | X |  |  |  |  |  |

When you enable USB port redirection, all USB devices attached to USB ports are automatically recognized in the remote session. For devices to work as expected, you must make sure to install their required drivers on both the local device and session host. You will need to make sure the drivers are certified to run in remote scenarios. If you need more information about using your USB device in remote scenarios, talk to the device manufacturer.

### Other redirection (devices, etc.)

The following table shows which other devices can be redirected with each Remote Desktop client:

| Redirection | Windows Desktop<br />&<br />Azure Virtual Desktop Store app | Remote Desktop app | Android or Chrome OS | iOS or iPadOS | macOS | Web client |
|--|--|--|--|--|--|--|
| Cameras | X |  | X | X | X | X (preview) |
| Clipboard | X | X | Text | Text, images | X | Text |
| Local drive/storage | X |  | X | X | X | X\* |
| Location | X (Windows 11 only) |  |  |  |  |  |
| Microphones | X | X | X | X | X | X |
| Printers | X |  |  |  | X\*\* (CUPS only) | PDF print |
| Scanners | X |  |  |  |  |  |
| Smart cards | X |  |  |  | X (Windows sign-in not supported) |  |
| Speakers | X | X | X | X | X | X |
| Third-party virtual channel plugins | X |  |  |  |  |  |
| WebAuthn | X |  |  |  |  |  |

\* Limited to uploading and downloading files through the Remote Desktop Web client.

\*\* For printer redirection, the macOS app supports the Publisher Imagesetter printer driver by default. The app doesn't support the native printer drivers.
