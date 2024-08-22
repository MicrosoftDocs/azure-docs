---
title: Peripheral and resource redirection over the Remote Desktop Protocol
description: Learn about redirection over the Remote Desktop Protocol, which enables users to share peripherals and resources between their local device and a remote session. It applies to Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and Remote PC connections.
ms.topic: concept-article
author: dknappettmsft
ms.author: daknappe
ms.date: 08/06/2024
---

# Peripheral and resource redirection over the Remote Desktop Protocol

Redirection enables users to share resources and peripherals, such as the clipboard, webcams, USB devices, printers, and more, between their local device (client-side) and a remote session (server-side) over the *Remote Desktop Protocol* (RDP). Redirection aims to provide a seamless remote experience, comparable to the experience using their local device. This experience helps users be more productive and efficient when working remotely. As an administrator, you can configure redirection to help balance between your security requirements and the needs of your users.

This article provides detailed information about redirection methods across difference peripheral classes, redirection classifications, and the supported types of resources and peripherals you can redirect.

## Redirection methods and classifications

RDP leverages two redirection methods to redirect resources and peripherals between the local device and a remote session:

- **High-level redirection**: functions as an intelligent intermediary by intercepting and optimizing all communication for a specific class of peripherals or experience. High-level redirection ensures the best possible performance for remote scenarios, but also relies on peripheral driver and application support.

- **Opaque low-level redirection**: transports the raw communication of a peripheral without any attempt to interpret, understand, throttle, or optimize it for remote scenarios.

   Opaque low-level redirection is used for peripherals that connect via USB where a suitable high-level peripheral reflection redirection solution doesn't exist, and for peripherals that have particular driver or software requirements in the remote session to work properly. USB redirection happens at the port and protocol level using [USB request blocks](/windows-hardware/drivers/usbcon/communicating-with-a-usb-device) (URB). Opaque low-level redirection is also used for peripherals that connect via serial/COM ports.

Within high-level redirection, there are four overarching techniques that are used, which are classified based on the direction of the redirection and the type of resource or peripheral being redirected. The four high-level redirection classifications are:
   
- **Peripheral reflection**: reflects a specific class of peripheral connected to the local device into a remote session. This classification includes input devices, such as keyboard, mouse, touch, pen, and trackpad.

- **Data sharing**: shares and transfers data between the local device and a remote session for the clipboard.

- **State reflection**: reflects the local device state into a remote session, such as its battery status and location.

- **Application splitting**: splits the functionality of an application across the local device and a remote session, such as Microsoft Teams.

The redirection method used can vary based on the peripheral class, such as Windows, macOS, iOS/iPadOS, or Android, and its available resources, peripherals, and capabilities. What redirection is available in a remote session is also dependent on the application used. For a comparison of the support for redirection using Windows App across different platforms, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection).

> [!IMPORTANT]
> You should use high-level redirection whenever possible, as it provides the best performance and user experience. Opaque low-level redirection is effectively a fallback scenario, so performance, reliability, and the supported feature set of such peripherals isn't guaranteed by default.
>
> Some peripherals can't be redirected, such as encrypted USB storage.

### USB redirection comparison

The following table compares redirecting a USB peripheral using opaque low-level USB redirection to redirecting the peripheral using high-level redirection with a supported peripheral class over RDP:

| Opaque low-level USB redirection | High-level redirection |
|--|--|
| Requires the driver for the USB peripheral to be installed in the remote session. Doesn't require the driver to be installed on the local device. | Requires the driver for the peripheral to be installed on the local device. In most cases, it doesn't require the driver to be installed in the remote session. |
| Uses a single redirection method for many peripheral classes. | Uses a specific redirection method for each peripheral class. |
| Forwards USB request blocks to and from the USB peripheral over the RDP connection. | Exposes high-level peripheral functionality in a remote session by using an optimized protocol for the peripheral class. |
| The USB peripheral can't be used on the local device while it's being used in a remote session. It can only be used in one remote session at a time. | The peripheral can be used simultaneously on the local device and in a remote session. |
| Optimized for low latency connections. Variable based on peripheral driver implementation. | Optimized for LAN and WAN connections and is aware of changes in conditions, such as bandwidth and latency. |

### Controlling opaque low-level USB redirection

Redirecting USB peripherals using opaque low-level USB redirection is controlled by the [RDP property](rdp-properties.md) `usbdevicestoredirect:s:<value>`, where *\<value\>* is the *device instance path* in the format `USB\<Vendor ID and Product ID>\<USB instance ID>`.

For some products and services, such as Azure Virtual Desktop, you can control redirection behavior by setting the RDP property value as follows:

- Some USB peripherals might have functions that use opaque low-level USB redirection or high-level redirection. By default, these peripherals are redirected using high-level redirection. You can use the RDP property to force these peripherals to use opaque low-level USB redirection. To use USB audio peripherals with opaque low-level USB redirection, the audio output location must be set to play sounds on the local computer.

- Use [class GUIDs](/windows-hardware/drivers/install/system-defined-device-setup-classes-available-to-vendors) to redirect or not redirect an entire class of USB peripherals. 

- Use the wildcard `*` as the value will redirect most peripherals that don't have high-level redirection mechanisms or drivers installed. Class GUIDs can be used to redirect additional peripherals that aren't matched automatically.

Values can be used on their own, or a combination of these values can be used in conjunction with each other when separated with a semicolon, subject to a processing order. The following table lists the valid values and the processing order:

| Processing order | Value | Description |
|:--:|:--:|--|
| N/A | *No value specified* | Don't redirect any supported USB peripherals using opaque low-level redirection. |
| 1 | `*` | Redirect all peripherals that aren't using high-level redirection. |
| 2 | `{<DeviceClassGUID>}` | Redirect all peripherals that are members of the specified device setup class. |
| 3 | `<USBInstanceID>` | Redirect a USB peripheral specified by the given device instance path. |
| 4 | `<-USBInstanceID>` | Don't redirect a peripheral specified by the given device instance path. |

When constructed as a string in the correct processing order, the syntax is:

```uri
usbdevicestoredirect:s:*;{<DeviceClassGUID>};<USBInstanceID>;<-USBInstanceID>
```

The device instance path for USB devices, is constructed in three sections in the format `USB\<Device ID>\<USB instance ID>`. You can find this value in Device Manager, or by using the [Get-PnpDevice PowerShell cmdlet](/powershell/module/pnpdevice/get-pnpdevice). The three sections in order are:

1. [Bus driver](/windows-hardware/drivers/kernel/bus-drivers) name, in this case *USB*.
1. [Device ID](/windows-hardware/drivers/install/device-ids), which contains the *Vendor ID* (VID) and *Product ID* (PID) of the USB peripheral.
1. [Instance ID](/windows-hardware/drivers/install/instance-ids), which uniquely distinguishes a device from other devices of the same type on a computer.

When specifying USB peripherals to redirect over RDP, you can use the device instance path. When using the device instance path, the value is specific to the port on the local device to which it's connected. For example, a peripheral connected to the first USB port has the device instance path `USB\VID_045E&PID_0779\5&21F6DCD1&0&5`, but connecting the same peripheral to the second USB port has the device instance path `USB\VID_045E&PID_0779\5&21F6DCD1&0&6`. For USB peripherals, specifying the device instance path means the peripheral is only redirected when connected to the same port.

Alternatively you can redirect an entire [device setup class](/windows-hardware/drivers/install/system-defined-device-setup-classes-available-to-vendors) of USB peripherals by using the class GUID. When using the class GUID, all peripherals on the local device that have the corresponding class GUID are redirected, regardless of the port to which they're connected. For example, using the class GUID `{4d36e96c-e325-11ce-bfc1-08002be10318}` redirects all multimedia devices. A list of all the class GUIDs is available at [System-Defined Device Setup Classes Available to Vendors](/windows-hardware/drivers/install/system-defined-device-setup-classes-available-to-vendors).

For some examples of how to use the RDP property, see [usbdevicestoredirect RDP property](redirection-configure-usb.md#usbdevicestoredirect-rdp-property).

## Supported resources and peripherals

The following table lists each supported resource or peripheral class and the recommended redirection method to use for each:

| Resource or peripheral class                                               | Redirection method                 | Predominant data flow direction |
|----------------------------------------------------------------------------|------------------------------------|---------------------------------|
| All-in-one printer/scanner                                                 | Opaque low-level redirection       | Bidirectional                   |
| Audio input - microphone (USB or integrated)                               | High-level - peripheral reflection | Local to remote                 |
| Audio output - speaker (USB or integrated)                                 | High-level - peripheral reflection | Remote to local                 |
| Battery (automatic, not configurable)                                      | High-level - state reflection      | Local to remote                 |
| Biometric reader (only within a session, not during logon)                 | Opaque low-level redirection       | Bidirectional                   |
| Camera/webcam (USB or integrated)                                          | High-level - peripheral reflection | Local to remote                 |
| CD/DVD drive (read-only)                                                   | High-level - peripheral reflection | Local to remote                 |
| Clipboard                                                                  | High-level - data sharing          | Bidirectional                   |
| Keyboard (USB or integrated)                                               | High-level - peripheral reflection | Local to remote                 |
| Local hard drive or USB removable storage                                  | High-level - peripheral reflection | Bidirectional                   |
| Location                                                                   | High-level - state reflection      | Local to remote                 |
| Mouse (USB or integrated)                                                  | High-level - peripheral reflection | Local to remote                 |
| MTP Media Player                                                           | High-level - peripheral reflection | Local to remote                 |
| Multimedia redirection                                                     | High-level - application splitting | Bidirectional                   |
| Pen (USB or integrated)                                                    | High-level - peripheral reflection | Local to remote                 |
| Printer (locally attached or network)                                      | High-level - peripheral reflection | Remote to local                 |
| PTP camera                                                                 | High-level - peripheral reflection | Local to remote                 |
| Scanner                                                                    | Opaque low-level redirection       | Bidirectional                   |
| Serial/COM port                                                            | Opaque low-level redirection       | Bidirectional                   |
| Smart card reader                                                          | High-level - peripheral reflection | Bidirectional                   |
| Touch (USB or integrated)                                                  | High-level - peripheral reflection | Local to remote                 |
| Trackpad (USB or integrated, excluding precision touch pad (PTP) gestures) | High-level - peripheral reflection | Local to remote                 |
| USB to serial adapter                                                      | Opaque low-level redirection       | Bidirectional                   |
| VoIP Telephone/Headset                                                     | Opaque low-level redirection       | Bidirectional                   |
| WebAuthN                                                                   | High-level - peripheral reflection | Bidirectional                   |

> [!NOTE]
> - The following peripheral classes are blocked from redirection:
>
>    - USB network adapters.
>    - USB displays.
>
> - Scanner redirection doesn't include TWAIN support.
>
> - Battery redirection is only available for Azure Virtual Desktop and Windows 365. It's automatically available and not configurable.

The following diagram shows the redirection methods used for each peripheral class:

:::image type="content" source="media/redirection-remote-desktop-protocol/redirection-methods-per-class.svg" alt-text="A diagram showing how different peripheral classes map to the high-level and opaque low-level redirection methods." lightbox="media/redirection-remote-desktop-protocol/redirection-methods-per-class.svg":::

## Configuration priority order

Which device classes are enabled for redirection and how redirections behave are configured by an administrator of a remote session. The behavior can be configured by Microsoft Intune or Group Policy (Active Directory or local) server-side, or specified in an `.rdp` file that is used to connect to a remote session. Azure Virtual Desktop and Remote Desktop Services also have a broker service where RDP properties can be specified instead.

However, certain settings can be overridden on the local device where a more restrictive configuration is required. A more restrictive setting takes precedence wherever it's configured; for example, if an administrator configures the clipboard to be redirected by default for all remote sessions, but the local device is configured to disable clipboard redirection, the clipboard isn't available in the remote session. This provides flexibility in scenarios where a subset of users or devices require more restrictive settings than the default configuration.

## Related content

- [Configure audio and video redirection over the Remote Desktop Protocol](redirection-configure-audio-video.md).
- [Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol](redirection-configure-camera-webcam-video-capture.md).
- [Configure clipboard redirection over the Remote Desktop Protocol](redirection-configure-clipboard.md).
- [Configure fixed, removable, and network drive redirection over the Remote Desktop Protocol](redirection-configure-drives-storage.md).
- [Configure location redirection over the Remote Desktop Protocol](redirection-configure-location.md).
- [Configure Media Transfer Protocol and Picture Transfer Protocol redirection on Windows over the Remote Desktop Protocol](redirection-configure-plug-play-mtp-ptp.md).
- [Configure printer redirection over the Remote Desktop Protocol](redirection-configure-printers.md).
- [Configure serial or COM port redirection over the Remote Desktop Protocol](redirection-configure-serial-com-ports.md).
- [Configure smart card redirection over the Remote Desktop Protocol](redirection-configure-smart-cards.md).
- [Configure USB redirection on Windows over the Remote Desktop Protocol](redirection-configure-usb.md).
- [Configure WebAuthn redirection over the Remote Desktop Protocol](redirection-configure-webauthn.md).
- [Supported RDP properties](rdp-properties.md).
- [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection).
- [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).