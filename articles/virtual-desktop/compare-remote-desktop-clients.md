---
title: Compare Remote Desktop app features across platforms and devices
description: Learn about which features of the Remote Desktop app are supported on which platforms and devices for Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and remote PC connections.
ms.topic: concept-article
zone_pivot_groups: remote-desktop-clients
author: dknappettmsft
ms.author: daknappe
ms.date: 01/15/2025
---

# Compare Remote Desktop app features across platforms and devices

> [!TIP]
> This article is shared for services and products that use the Remote Desktop Protocol (RDP) to provide remote access to Windows desktops and apps.
> 
> Use the buttons at the top of this article to select what you want to connect to so the article shows the relevant information.

::: zone pivot="azure-virtual-desktop,remote-desktop-services,remote-pc"
The Remote Desktop app is available on Windows, macOS, iOS and iPadOS, Android and Chrome OS, and in a web browser. However, support for some features differs across these platforms. This article details which features are supported on which platforms.
::: zone-end

::: zone pivot="windows-365"
The Remote Desktop app is available on Windows, macOS, iOS and iPadOS, Android and Chrome OS, and in a web browser. However, support for some features differs across these platforms. This article details which features are supported on which platforms when connecting to a Cloud PC from Windows 365.
::: zone-end

::: zone pivot="dev-box"
The Remote Desktop app is available on Windows, macOS, iOS and iPadOS, Android and Chrome OS, and in a web browser. However, support for some features differs across these platforms. This article details which features are supported on which platforms when connecting to Microsoft Dev Box.
::: zone-end

::: zone pivot="azure-virtual-desktop"
There are three versions of the Remote Desktop app for Windows, which are all supported for connecting to Azure Virtual Desktop:

- Standalone download as an MSI installer. This is the most common version of the Remote Desktop app for Windows and is referred to in this article as **Windows (MSI)**.

- Azure Virtual Desktop app from the Microsoft Store. This is a preview version of the Remote Desktop app for Windows and is referred to in this article as **Windows (AVD Store)**.

- Remote Desktop app from the Microsoft Store. This version is no longer being developed and is referred to in this article as **Windows (RD Store)**.
::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"
There are two versions of the Remote Desktop app for Windows, which are both supported for connecting to Remote Desktop Services and remote PCs:

- Remote Desktop Connection. This is provided in Windows and is referred to in this article as **Windows (MSTSC)**, after the name of the executable file. It also includes the **RemoteApp and Desktop Connections** Control Panel applet.

- Remote Desktop app from the Microsoft Store. This version is no longer being developed and is referred to in this article as **Windows (RD Store)**.
::: zone-end

## Experience

The following table compares which Remote Desktop app experience features are supported on which platforms:

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Appearance (dark or light) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrated apps | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Localization | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Pin to Start Menu | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Search | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| URI schemes | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | ❌ | ❌ | ❌ | ❌ |

1. [ms-rd and ms-avd URI schemes](uri-scheme.md) only.
::: zone-end

::: zone pivot="windows-365"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Appearance (dark or light) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrated apps | ✅ | ❌ | ❌ | ❌ | ❌ |
| Localization | ✅ | ❌ | ✅ | ❌ | ✅ |
| Pin to Start Menu | ❌ | ❌ | ❌ | ❌ | ❌ |
| Search | ❌ | ✅ | ✅ | ✅ | ✅ |
| Windows 365 Boot | ✅ | ❌ | ❌ | ❌ | ❌ |
| Windows 365 Frontline | ✅ | ✅ | ✅ | ✅ | ✅ |
| Windows 365 Switch | ✅ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Appearance (dark or light) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrated apps | ✅ | ❌ | ❌ | ❌ | ❌ |
| Localization | ✅ | ❌ | ✅ | ❌ | ✅ |
| Pin to Start Menu | ❌ | ❌ | ❌ | ❌ | ❌ |
| Search | ❌ | ✅ | ✅ | ✅ | ✅ |

::: zone-end

::: zone pivot="remote-desktop-services"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Appearance (dark or light) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrated apps | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | ❌ | ❌ | ❌ | ❌ |
| Localization | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Pin to Start Menu | <sup>&#8197;&#8197;</sup>✅&sup1; | ✅ | ❌ | ❌ | ❌ | ❌ |
| Search | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| URI schemes | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ |

1. When subscribed to Remote Desktop Services using the **RemoteApp and Desktop Connections** Control Panel applet.
1. [Legacy RDP URI scheme](/windows-server/remote/remote-desktop-services/clients/remote-desktop-uri#ms-rd-uri-scheme) only.
::: zone-end

::: zone pivot="remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Appearance (dark or light) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Localization | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Pin to Start Menu | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Search | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| URI schemes | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ |

1. [Legacy RDP URI scheme](/windows-server/remote/remote-desktop-services/clients/remote-desktop-uri#ms-rd-uri-scheme) only.
::: zone-end

The following table provides a description for each of the experience features:

::: zone pivot="azure-virtual-desktop,remote-desktop-services"

| Feature | Description |
|--|--|
| Appearance (dark or light) | Change the appearance of the Remote Desktop app to be light or dark. |
| Integrated apps | Individual apps using RemoteApp are integrated with the local device as if they're running locally. |
| Localization | User interface available in languages other than *English (United States)*. |
| Pin to Start Menu | Pin your favorite devices and apps to the Windows Start Menu for quick access. |
| Search | Quickly search for devices or apps. |
| Uniform Resource Identifier (URI) schemes | Start the Remote Desktop app or connect to a remote session with specific parameters and values with a URI. |

::: zone-end

::: zone pivot="windows-365"

| Feature | Description |
|--|--|
| Appearance (dark or light) | Change the appearance of Windows App to be light or dark. |
| Localization | User interface available in languages other than *English (United States)*. |
| Pin to home | Pin your favorite Cloud PCs to the **Home** tab for quick access. |
| Pin to taskbar | Pin your favorite Cloud PCs to the **Windows taskbar** for quick access. |
| Search | Quickly search for devices or apps. |
| [Windows 365 Boot](/windows-365/enterprise/windows-365-boot-overview) | Boot directly to a Cloud PC, not the local device. |
| [Windows 365 Frontline](/windows-365/enterprise/introduction-windows-365-frontline) | Share a Cloud PC for shift and part-time workers. |
| [Windows 365 Switch](/windows-365/enterprise/windows-365-switch-overview) | Easily switch between your local device and a Cloud PC with the **Windows 11 Task view**. |

::: zone-end

::: zone pivot="dev-box"

| Feature | Description |
|--|--|
| Appearance (dark or light) | Change the appearance of Windows App to be light or dark. |
| Localization | User interface available in languages other than *English (United States)*. |
| Pin to home | Pin your favorite dev boxes to the **Home** tab for quick access. |
| Pin to taskbar | Pin your favorite dev boxes to the **Windows taskbar** for quick access. |
| Search | Quickly search for devices or apps. |

::: zone-end

::: zone pivot="remote-pc"

| Feature | Description |
|--|--|
| Appearance (dark or light) | Change the appearance of the Remote Desktop app to be light or dark. |
| Localization | User interface available in languages other than *English (United States)*. |
| Pin to Start Menu | Pin your favorite devices and apps to the Windows Start Menu for quick access. |
| Search | Quickly search for devices or apps. |
| Uniform Resource Identifier (URI) schemes | Start the Remote Desktop app or connect to a remote session with specific parameters and values with a URI. |

::: zone-end

## Display

The following table compares which display features are supported on which platforms:

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Dynamic resolution | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| External monitor | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Multiple monitors&sup1; | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Selected monitors | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Smart sizing | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

1. Up to 16 monitors.
::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Dynamic resolution | ✅ | ✅ | ✅ | ✅ | ✅ |
| External monitor | ✅ | ✅ | ✅ | ❌ | ❌ |
| Multiple monitors&sup1; | ✅ | ✅ | ❌ | ❌ | ❌ |
| Selected monitors | ✅ | ❌ | ✅ | ❌ | ❌ |
| Smart sizing | ✅ | ✅ | ❌ | ❌ | ❌ |

1. Up to 16 monitors.
::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Dynamic resolution | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| External monitor | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Multiple monitors&sup1; | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Selected monitors | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Smart sizing | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

1. Up to 16 monitors.
::: zone-end

The following table provides a description for each of the display features:

| Feature | Description |
|--|--|
| Dynamic resolution | The resolution and orientation of local displays is dynamically reflected in the remote session for desktops. If the session is running in *windowed* mode, the desktop is dynamically resized to the size of the window. |
| External display | Enables the use of an external display for a remote session. |
| Multiple displays | Enables the remote session to use all local displays.<br /><br />Each display can have a maximum resolution of 8K, with the total combined resolution limited to 32K. These limits depend on factors such as session host specification and network connectivity. |
| Selected displays | Specifies which local displays to use for the remote session. |
| Smart sizing | A desktop in *windowed* mode is dynamically scaled to the window's size. |

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
## Multimedia

The following table shows which multimedia features are available on each platform:

::: zone-end

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Multimedia redirection | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Teams media optimizations | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Multimedia redirection | ✅ | ❌ | ❌ | ❌ | ❌ |
| Teams media optimizations | ✅ | ✅ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
The following table provides a description for each of the multimedia features:
::: zone-end

::: zone pivot="azure-virtual-desktop"

| Feature | Description |
|--|--|
| [Multimedia redirection](multimedia-redirection-video-playback-calls.md?pivots=azure-virtual-desktop) | Redirect video playback and calls from the desktop or app to the physical machine for faster processing and rendering. |
| [Teams media optimizations](teams-on-avd.md) | Optimized Microsoft Teams calling and meeting experience. |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Description |
|--|--|
| [Multimedia redirection](multimedia-redirection-video-playback-calls.md?pivots=windows-365) | Redirect video playback and calls from the Cloud PC or dev box to the physical machine for faster processing and rendering. |
| [Teams media optimizations](/windows-365/enterprise/teams-on-cloud-pc) | Optimized Microsoft Teams calling and meeting experience. |

::: zone-end

## Redirection

The following sections detail the redirection support available on each platform.

> [!TIP]
> Redirection of some peripheral and resource types needs to be enabled by an administrator before they can be used in a remote session. For more information, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md), where you can also find links in the [Related content](redirection-remote-desktop-protocol.md#related-content) section to articles that explain how to configure redirection for specific peripheral and resource types.

### Device redirection

The following table shows which local devices you can redirect to a remote session on each platform:

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Cameras | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; |
| Local drive/storage | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Microphones | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Printers | ✅ | ✅ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup3; | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&#8308; |
| Scanners&#8309; | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Smart cards | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Speakers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Cameras | ✅ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; |
| Local drive/storage | ✅ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Microphones | ✅ | ✅ | ✅ | ✅ | ✅ |
| Printers | ✅ | <sup>&#8197;&#8197;</sup>✅&sup3; | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&#8308; |
| Scanners&#8309; | ✅ | ❌ | ❌ | ❌ | ❌ |
| Smart cards | ✅ | ✅ | ❌ | ❌ | ❌ |
| Speakers | ✅ | ✅ | ✅ | ✅ | ✅ |

::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Cameras | ✅ | ❌ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; |
| Local drive/storage | ✅ | ❌ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Microphones | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Printers | ✅ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup3; | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&#8308; |
| Scanners&#8309; | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Smart cards | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Speakers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

::: zone-end

1. Camera redirection in a web browser is in preview.
1. Limited to uploading and downloading files through a web browser.
1. The Remote Desktop app on macOS supports the *Publisher Imagesetter* printer driver by default (*Common UNIX Printing System* (CUPS) only). Native printer drivers aren't supported.
1. PDF printing only.
1. High-level redirection of TWAIN scanners isn't supported. You can only redirect USB scanners using opaque low-level redirection. For more information, see [Peripheral and resource redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

The following table provides a description for each type of device you can redirect:

| Device type | Description |
|--|--|
| Cameras | Redirect a local camera to use with apps like Microsoft Teams. |
| Local drive/storage | Access local disk drives in a remote session. |
| Microphones | Redirect a local microphone to use with apps like Microsoft Teams. |
| Printers | Print from a remote session to a local printer. |
| Scanners | Access a local scanner in a remote session. |
| Smart cards | Use smart cards in a remote session. |
| Speakers | Play audio in the remote session or on local device. |

### Input redirection

The following table shows which input methods you can redirect:

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Keyboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keyboard input language | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup1; |
| Keyboard shortcuts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mouse/trackpad | ✅ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup2; | ✅ | ✅ |
| Multi-touch | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Pen | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Touch | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Keyboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keyboard input language | ✅ | ✅ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup1; |
| Keyboard shortcuts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mouse/trackpad | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup2; | ✅ | ✅ |
| Multi-touch | ✅ | ❌ | ✅ | ✅ | ❌ |
| Pen | ✅ | ❌ | ✅ | ✅ | ✅ |
| Touch | ✅ | ❌ | ✅ | ✅ | ✅ |

::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Keyboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keyboard input language | ✅ | ✅ | ✅ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup1; |
| Keyboard shortcuts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mouse/trackpad | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-touch | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Pen | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Touch | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |

::: zone-end

1. Enabled by alternative keyboard layout.

The following table provides a description for each type of input you can redirect:

| Input type | Description |
|--|--|
| Keyboard | Redirect keyboard inputs to the remote session. |
| Mouse/trackpad | Redirect mouse or trackpad inputs to the remote session. |
| Multi-touch | Redirect multiple touches simultaneously to the remote session. |
| Pen | Redirect pen inputs, including pressure, to the remote session. |
| Touch | Redirect touch inputs to the remote session. |

### Port redirection

The following table shows which ports you can redirect:

::: zone pivot="azure-virtual-desktop"

| Port type | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Serial | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| USB | ✅ | ✅ | ❌ | ❌ | ❌ | ❌  |❌ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Port type | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Serial | ✅ | ❌ | ❌ | ❌ | ❌ |
| USB | ✅ | ❌ | ❌ | ❌  |❌ |

::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Serial | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| USB | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

The following table provides a description for each port you can redirect:

| Port type | Description |
|--|--|
| Serial | Redirect serial (COM) ports on the local device to the remote session. |
| USB | Redirect supported USB devices on the local device to the remote session. |

### Other redirection

The following table shows which other features you can redirect:

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Clipboard - bidirectional | ✅ | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Clipboard - unidirectional&sup3; | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Location | <sup>&#8197;&#8197;</sup>✅&#8308; | <sup>&#8197;&#8197;</sup>✅&#8308; | ❌ | ❌ | ✅ | ❌ | ✅ |
| Third-party virtual channel plugins | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Time zone | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebAuthn | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Clipboard - bidirectional | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Clipboard - unidirectional&sup3; | ✅ | ✅ | ✅ | ✅ | ✅ |
| Location | <sup>&#8197;&#8197;</sup>✅&#8308; | ❌ | ✅ | ❌ | ✅ |
| Third-party virtual channel plugins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Time zone | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebAuthn | ✅ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Clipboard - bidirectional | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Clipboard - unidirectional&sup3; | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Location | <sup>&#8197;&#8197;</sup>✅&#8308; | ❌ | ❌ | ✅ | ❌ | ✅ |
| Third-party virtual channel plugins | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Time zone | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebAuthn | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

1. Text and images only.
1. Text only.
1. macOS support is native in the Remote Desktop app. All other platforms require remote session configuration. For more information, see [Configure the clipboard transfer direction and types of data that can be copied](clipboard-transfer-direction-data-types.md).  
1. From a local device running Windows 11 only.

The following table provides a description for each other redirection feature you can redirect:

| Feature | Description |
|--|--|
| Clipboard - bidirectional | Redirect the clipboard on the local device is to the remote session and from the remote session to the local device. |
| Clipboard - unidirectional | Control the direction in which the clipboard can be used and restrict the types of data that can be copied. |
| Location | The location of the local device can be available in the remote session. |
| Third-party virtual channel plugins | Enables third-party virtual channel plugins to extend Remote Desktop Protocol (RDP) capabilities. |
| Time zone | The time zone of the local device can be available in the remote session. |
| WebAuthn | Authentication requests in the remote session can be redirected to the local device allowing the use of security devices such as Windows Hello for Business or a security key. |

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
## Authentication

The following sections detail the authentication support available on each platform and the following table provides a description for each credential type:

| Credential type | Description |
|--|--|
| [Passkeys (FIDO2)](/entra/identity/authentication/concept-authentication-passwordless#passkeys-fido2) | Passkeys provide a standards-based passwordless authentication method that comes in many form factors, including FIDO2 security keys. Passkeys incorporate the web authentication (WebAuthn) standard. |
| [Microsoft Authenticator](/entra/identity/authentication/howto-authentication-passwordless-phone) | The Microsoft Authenticator app helps sign in to Microsoft Entra ID without using a password, or provides an extra verification option for multifactor authentication. Microsoft Authenticator uses key-based authentication to enable a user credential that is tied to a device, where the device uses a PIN or biometric. |
| [Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/#comparing-key-based-and-certificate-based-authentication) | Uses an enterprise managed public key infrastructure (PKI) for issuing and managing end user certificates. |
| [Windows Hello for Business cloud trust](/windows/security/identity-protection/hello-for-business/#comparing-key-based-and-certificate-based-authentication) | Uses Microsoft Entra Kerberos, which enables a simpler deployment when compared to the key trust model. |
| [Windows Hello for Business key trust](/windows/security/identity-protection/hello-for-business/#comparing-key-based-and-certificate-based-authentication) | Uses hardware-bound keys created during the provisioning experience. |

### Cloud service authentication

The authentication to the service, which includes subscribing to your resources and authenticating to the Gateway, is with Microsoft Entra ID. For more information about the service components of Azure Virtual Desktop, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

The following table shows which credential types are available for each platform:

::: zone-end

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Passkeys (FIDO2) | ✅ | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | ✅ |
| Microsoft Authenticator | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Password | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart card with Active Directory Federation Services | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Smart card with Microsoft Entra certificate-based authentication | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Windows Hello for Business certificate trust | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Windows Hello for Business cloud trust | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Windows Hello for Business key trust | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Passkeys (FIDO2) | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | ✅ |
| Microsoft Authenticator | ✅ | ✅ | ✅ | ✅ | ✅ |
| Password | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart card with Active Directory Federation Services | ✅ | ✅ | ❌ | ❌ | ✅ |
| Smart card with Microsoft Entra certificate-based authentication | ✅ | ✅ | ✅ | ❌ | ✅ |
| Windows Hello for Business certificate trust | ✅ | ❌ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Windows Hello for Business cloud trust | ✅ | ❌ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; |
| Windows Hello for Business key trust | ✅ | ❌ | ❌ | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; |

::: zone-end

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
1. Requires macOS client version 10.9.8 or later. Requires iOS client version 10.5.9 or later. For more information, see [Support for FIDO2 authentication with Microsoft Entra ID](/entra/identity/authentication/concept-fido2-compatibility#native-application-support).
1. Available when using a web browser on a local Windows device only.

### Remote session authentication

When connecting to a remote session, there are multiple ways to authenticate. If single sign-on (SSO) is enabled, the credentials used to sign into the cloud service are automatically passed through when connecting to the remote session. The following table shows which types of credential that can be used to authenticate to the remote session if single sign-on is disabled:

::: zone-end

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Passkeys (FIDO2) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Microsoft Authenticator | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Password | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart card | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ |
| Windows Hello for Business certificate trust | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business cloud trust | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business key trust | <sup>&#8197;&#8197;</sup>✅&sup3; | <sup>&#8197;&#8197;</sup>✅&sup3; | ❌ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Passkeys (FIDO2) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Microsoft Authenticator | ❌ | ❌ | ❌ | ❌ | ❌ |
| Password | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart card | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ |
| Windows Hello for Business certificate trust | ✅ | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business cloud trust | ❌ | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business key trust | <sup>&#8197;&#8197;</sup>✅&sup3; | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
1. Requires smart card redirection.
1. Requires smart card redirection with Network Level Authentication (NLA) disabled.
1. Requires a [certificate for Remote Desktop Protocol (RDP) sign-in](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs).

### In-session authentication

The following table shows which types of credential are available when authenticating within a remote session:

::: zone-end

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Passkeys (FIDO2) | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ | ❌ |
| Password | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart card | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | ❌ | ❌ |
| Windows Hello for Business certificate trust | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business cloud trust | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business key trust | <sup>&#8197;&#8197;</sup>✅&sup2; | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Passkeys (FIDO2) | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ |
| Password | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smart card | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ | ❌ | ❌ |
| Windows Hello for Business certificate trust | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business cloud trust | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ |
| Windows Hello for Business key trust | <sup>&#8197;&#8197;</sup>✅&sup2; | ❌ | ❌ | ❌ | ❌ |

::: zone-end

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
1. Requires smart card redirection.
1. Requires WebAuthn redirection.

::: zone-end

::: zone pivot="azure-virtual-desktop,windows-365,dev-box"
## Security

The following table shows which security features are available on each platform:

::: zone-end

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Screen capture protection | ✅ | ✅ |  ❌ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ |
| Watermarking | ✅ | ✅ |  ❌ | ✅ | ✅ | ✅ | ✅ |

1. Requires [Microsoft Intune to configure client device redirection settings](/azure/virtual-desktop/client-device-redirection-intune).

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Screen capture protection | ✅ | ✅ | <sup>&#8197;&#8197;</sup>✅&sup1; | <sup>&#8197;&#8197;</sup>✅&sup1; | ❌ |
| Watermarking | ✅ | ✅ | ✅ | ✅ | ✅ |

1. Requires [Microsoft Intune to configure client device redirection settings](/azure/virtual-desktop/client-device-redirection-intune).

::: zone-end

::: zone pivot="azure-virtual-desktop"
The following table provides a description for each security feature:

| Feature | Description |
|--|--|
| [Screen capture protection](screen-capture-protection.md) | Helps prevent sensitive information in the remote session from being screen captured from the physical device. |
| [Watermarking](watermarking.md) | Helps protect sensitive information from being stolen or altered. |

::: zone-end

::: zone pivot="windows-365,dev-box"
The following table provides a description for each security feature:

| Feature | Description |
|--|--|
| [Screen capture protection](/azure/virtual-desktop/screen-capture-protection?context=%2Fwindows-365%2Fcontext%2Fpr-context) | Helps prevent sensitive information in the remote session from being screen captured from the physical device. |
| [Watermarking](/azure/virtual-desktop/watermarking?context=%2Fwindows-365%2Fcontext%2Fpr-context) | Helps protect sensitive information from being stolen or altered. |

::: zone-end

## Network

The following table shows which network features are available on each platform:

::: zone pivot="azure-virtual-desktop"

| Feature | Windows<br />(MSI) | Windows<br />(AVD Store) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Connection information | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| RDP Shortpath for managed networks | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| RDP Shortpath for public networks | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Private Link | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Windows<br />(MSI) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|
| Connection information | ✅ | ✅ | ❌ | ❌ | ✅ |
| RDP Shortpath for managed networks | ✅ | ✅ | ✅ | ❌ | ❌ |
| RDP Shortpath for public networks | ✅ | ✅ | ✅ | ❌ | ❌ |

::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Windows<br />(MSTSC) | Windows<br />(RD Store) | macOS | iOS/<br />iPadOS | Android/<br />Chrome OS | Web browser |
|--|:-:|:-:|:-:|:-:|:-:|:-:|
| Connection information | ✅ | ❌ | ✅ | ❌ |  | ✅ |

::: zone-end

The following table provides a description for each network feature:

::: zone pivot="azure-virtual-desktop"

| Feature | Description |
|--|--|
| Connection information | See the connection information of the remote session. |
| [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks) | Better connection reliability and more consistent latency through direct UDP-based transport on a private/managed network connection. |
| [RDP Shortpath for public networks](rdp-shortpath.md?tabs=public-networks) | Better connection reliability and more consistent latency through direct UDP-based transport on a public network connection. |
| [Private Link](private-link-overview.md) | Connect a remote session over a private connection. |

::: zone-end

::: zone pivot="windows-365,dev-box"

| Feature | Description |
|--|--|
| Connection information | See the connection information of the remote session. |
| [RDP Shortpath for managed networks](/windows-365/enterprise/rdp-shortpath-private-networks) | Better connection reliability and more consistent latency through direct UDP-based transport on a private/managed network connection. |
| [RDP Shortpath for public networks](/windows-365/enterprise/rdp-shortpath-public-networks) | Better connection reliability and more consistent latency through direct UDP-based transport on a public network connection. |

::: zone-end

::: zone pivot="remote-desktop-services,remote-pc"

| Feature | Description |
|--|--|
| Connection information | See the connection information of the remote session. |

::: zone-end
