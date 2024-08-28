---
title: Supported RDP properties
description: Learn about the supported RDP properties you can set to customize the behavior of a remote session, such as for device redirection, display settings, session behavior, and more.
ms.topic: reference
author: dknappettmsft
ms.author: daknappe
ms.date: 08/07/2024
---

# Supported RDP properties

[!INCLUDE [include-rdp-shared-article-no-zone-pivot](includes/include-rdp-shared-article-no-zone-pivot.md)]

The Remote Desktop Protocol (RDP) has a number of properties you can set to customize the behavior of a remote session, such as for device redirection, display settings, session behavior, and more.

The following sections contain each RDP property available and lists its syntax, description, supported values, the default value, and connections to which services and products you can use them with.

How you use these RDP properties depends on the service or product you're using:

| Product | Configuration point |
|--|--|
| Azure Virtual Desktop | Host pool RDP properties. To learn more, see [Customize RDP properties for a host pool](customize-rdp-properties.md). |
| Remote Desktop Services | Session collection RDP properties |
| Remote PC connections | The `.rdp` file you use to connect to a remote PC. |

> [!NOTE]
> For each RDP property, replace `<value>` with an allowed value for that property.

## Connections

Here are the RDP properties that you can use to configure connections.

### `alternate full address`

- **Syntax**: `alternate full address:s:<value>`
- **Description**: Specifies an alternate name or IP address of the remote computer.
- **Supported values**:
  - A valid hostname, IPv4 address, or IPv6 address.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services
   - Remote PC connections

### `alternate shell`

- **Syntax**: `alternate shell:s:<value>`
- **Description**: Specifies a program to be started automatically in a remote session as the shell instead of explorer.
- **Supported values**:
  - A valid path to an executable file, such as `C:\Program Files\MyApp\myapp.exe`.
- **Default value**: None.
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `authentication level`

- **Syntax**: `authentication level:i:<value>`
- **Description**: Defines the server authentication level settings.
- **Supported values**:
  - `0`: If server authentication fails, connect to the computer without warning.
  - `1`: If server authentication fails, don't establish a connection.
  - `2`: If server authentication fails, show a warning, and choose to connect or refuse the connection.
  - `3`: No authentication requirement specified.
- **Default value**: `3`
- **Applies to**:
   - Remote Desktop Services
   - Remote PC connections

### `disableconnectionsharing`

- **Syntax**: `disableconnectionsharing:i:<value>`
- **Description**: Determines whether the client reconnects to any existing disconnected session or initiate a new connection when a new connection is launched.
- **Supported values**:
  - `0`: Reconnect to any existing session.
  - `1`: Initiate new connection.
- **Default value**: `0`
- **Applies to**:
   - Remote Desktop Services

### `domain`

- **Syntax**: `domain:s:<value>`
- **Description**: Specifies the name of the Active Directory domain in which the user account that will be used to sign in to the remote computer is located.
- **Supported values**:
  - A valid domain name, such as `CONTOSO`.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services
   - Remote PC connections

### `enablecredsspsupport`

- **Syntax**: `enablecredsspsupport:i:<value>`
- **Description**: Determines whether the client will use the Credential Security Support Provider (CredSSP) for authentication if it's available.
- **Supported values**:
  - `0`: RDP won't use CredSSP, even if the operating system supports CredSSP.
  - `1`: RDP will use CredSSP if the operating system supports CredSSP.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `enablerdsaadauth`

- **Syntax**: `enablerdsaadauth:i:<value>`
- **Description**: Determines whether the client will use Microsoft Entra ID to authenticate to the remote PC. When used with Azure Virtual Desktop, this provides a single sign-on experience. This property replaces the property [`targetisaadjoined`](#targetisaadjoined).
- **Supported values**:
  - `0`: Connections won't use Microsoft Entra authentication, even if the remote PC supports it.
  - `1`: Connections will use Microsoft Entra authentication if the remote PC supports it.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `full address`

- **Syntax**: `full address:s:<value>`
- **Description**: Specifies the hostname or IP address of the remote computer that you want to connect to.. This is the only mandatory property in a `.rdp` file.
- **Supported values**:
  - A valid hostname, IPv4 address, or IPv6 address.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services
   - Remote PC connections

### `gatewaycredentialssource`

- **Syntax**: `gatewaycredentialssource:i:<value>`
- **Description**: Specifies the authentication method used for Remote Desktop gateway connections.
- **Supported values**:
  - `0`: Ask for password (NTLM).
  - `1`: Use smart card.
  - `2`: Use the credentials for the currently signed in user.
  - `3`: Prompt the user for their credentials and use basic authentication.
  - `4`: Allow user to select later.
  - `5`: Use cookie-based authentication.
- **Default value**: `0`
- **Applies to**:
   - Remote Desktop Services

### `gatewayhostname`

- **Syntax**: `gatewayhostname:s:<value>`
- **Description**: Specifies the host name of a Remote Desktop gateway.
- **Supported values**:
  - A valid hostname, IPv4 address, or IPv6 address.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services

### `gatewayprofileusagemethod`

- **Syntax**: `gatewayprofileusagemethod:i:<value>`
- **Description**: Specifies whether to use the default Remote Desktop gateway settings.
- **Supported values**:
  - `0`: Use the default profile mode, as specified by the administrator.
  - `1`: Use explicit settings, as specified by the user.
- **Default value**: `0`
- **Applies to**:
   - Remote Desktop Services

### `gatewayusagemethod`

- **Syntax**: `gatewayusagemethod:i:<value>`
- **Description**: Specifies whether to use a Remote Desktop gateway for the connection.
- **Supported values**:
  - `0`: Don't use a Remote Desktop gateway.
  - `1`: Always use a Remote Desktop gateway.
  - `2`: Use a Remote Desktop gateway if a direct connection can't be made to the RD Session Host.
  - `3`: Use the default Remote Desktop gateway settings.
  - `4`: Don't use a Remote Desktop gateway, bypass gateway for local addresses.<br />Setting this property value to `0` or `4` are effectively equivalent, but `4` enables the option to bypass local addresses.
- **Default value**: `0`
- **Applies to**:
   - Remote Desktop Services

### `kdcproxyname`

- **Syntax**: `kdcproxyname:s:<value>`
- **Description**: Specifies the fully qualified domain name of a KDC proxy.
- **Supported values**:
  - A valid path to a KDC proxy server, such as `kdc.contoso.com`.
- **Default value**: None.
- **Applies to**:
   - Azure Virtual Desktop. For more information, see [Configure a Kerberos Key Distribution Center proxy](key-distribution-center-proxy.md).

### `promptcredentialonce`

- **Syntax**: `promptcredentialonce:i:<value>`
- **Description**: Determines whether a user's credentials are saved and used for both the Remote Desktop gateway and the remote computer.
- **Supported values**:
  - `0`: Remote session doesn't use the same credentials.
  - `1`: Remote session does use the same credentials.
- **Default value**: `1`
- **Applies to**:
   - Remote Desktop Services

### `targetisaadjoined`

- **Syntax**: `targetisaadjoined:i:<value>`
- **Description**: Allows connections to Microsoft Entra joined session hosts using a username and password. This property is only applicable to non-Windows clients and local Windows devices that aren't joined to Microsoft Entra. It is being replaced by the property [`enablerdsaadauth`](#enablerdsaadauth).
- **Supported values**:
  - `0`: Connections to Microsoft Entra joined session hosts will succeed for Windows devices that [meet the requirements](/azure/virtual-desktop/deploy-azure-ad-joined-vm#connect-using-the-windows-desktop-client), but other connections will fail.
  - `1`: Connections to Microsoft Entra joined hosts will succeed but are restricted to entering user name and password credentials when connecting to session hosts.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop. For more information, see [Microsoft Entra joined session hosts in Azure Virtual Desktop](azure-ad-joined-session-hosts.md#connect-using-legacy-authentication-protocols).

### `username`

- **Syntax**: `username:s:<value>`
- **Description**: Specifies the name of the user account that will be used to sign in to the remote computer.
- **Supported values**:
  - Any valid username.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services

## Session behavior

Here are the RDP properties that you can use to configure session behavior.

### `autoreconnection enabled`

- **Syntax**: `autoreconnection enabled:i:<value>`
- **Description**: Determines whether the local device will automatically try to reconnect to the remote computer if the connection is dropped, such as when there's a network connectivity interruption.
- **Supported values**:
  - `0`: The local device doesn't automatically try to reconnect.
  - `1`: The local device automatically tries to reconnect.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `bandwidthautodetect`

- **Syntax**: `bandwidthautodetect:i:<value>`
- **Description**: Determines whether or not to use automatic network bandwidth detection.
- **Supported values**:
  - `0`: Don't use automatic network bandwidth detection.
  - `1`: Use automatic network bandwidth detection.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `compression`

- **Syntax**: `compression:i:<value>`
- **Description**: Determines whether bulk compression is enabled when transmitting data to the local device.
- **Supported values**:
  - `0`: Disable bulk compression.
  - `1`: Enable RDP bulk compression.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `networkautodetect`

- **Syntax**: `networkautodetect:i:<value>`
- **Description**: Determines whether automatic network type detection is enabled.
- **Supported values**:
  - `0`: Disable automatic network type detection.
  - `1`: Enable automatic network type detection.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `videoplaybackmode`

- **Syntax**: `videoplaybackmode:i:<value>`
- **Description**: Determines whether the connection will use RDP-efficient multimedia streaming for video playback.
- **Supported values**:
  - `0`: Don't use RDP efficient multimedia streaming for video playback.
  - `1`: Use RDP-efficient multimedia streaming for video playback when possible.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

## Device redirection

Here are the RDP properties that you can use to configure device redirection. To learn more, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

### `audiocapturemode`

- **Syntax**: `audiocapturemode:i:<value>`
- **Description**: Indicates whether audio input redirection is enabled.
- **Supported values**:
  - `0`: Disable audio capture from a local device.
  - `1`: Enable audio capture from a local device and redirect it to a remote session.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure audio and video redirection over the Remote Desktop Protocol](redirection-configure-audio-video.md#configure-audio-capture-redirection).

### `audiomode`

- **Syntax**: `audiomode:i:<value>`
- **Description**: Determines whether the local or remote machine plays audio.
- **Supported values**:
  - `0`: Play sounds on the local device.
  - `1`: Play sounds in a remote session.
  - `2`: Don't play sounds.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure audio and video redirection over the Remote Desktop Protocol](redirection-configure-audio-video.md#configure-audio-output-redirection).

### `camerastoredirect`

- **Syntax**: `camerastoredirect:s:<value>`
- **Description**: Configures which cameras to redirect. This setting uses a semicolon-delimited list of `KSCATEGORY_VIDEO_CAMERA` interfaces of cameras enabled for redirection.
- **Supported values**:
  - `*`: Redirect all cameras.
  - `\\?\usb#vid_0bda&pid_58b0&mi`: Specifies a list of cameras by device instance path, such as this example.
  - `-`: Exclude a specific camera by prepending the symbolic link string.
- **Default value**: None.
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol](redirection-configure-camera-webcam-video-capture.md).

### `devicestoredirect`

- **Syntax**: `devicestoredirect:s:<value>`
- **Description**: Determines which peripherals that use the Media Transfer Protocol (MTP) or Picture Transfer Protocol (PTP), such as a digital camera, are redirected from a local Windows device to a remote session.
- **Supported values**:
  - `*`: Redirect all supported devices, including ones that are connected later.
  - `\\?\usb#vid_0bda&pid_58b0&mi`: Specifies a list of MTP or PTP peripherals by device instance path, such as this example.
  - `DynamicDevices`: Redirect all supported devices that are connected later.
- **Default value**: `*`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure Media Transfer Protocol and Picture Transfer Protocol redirection on Windows over the Remote Desktop Protocol](redirection-configure-plug-play-mtp-ptp.md).

### `drivestoredirect`

- **Syntax**: `drivestoredirect:s:<value>`
- **Description**: Determines which fixed, removable, and network drives on the local device will be redirected and available in a remote session.
- **Supported values**:
  - *Empty*: Don't redirect any drives.
  - `*`: Redirect all drives, including drives that are connected later.
  - `DynamicDrives`: Redirect any drives that are connected later.
  - `drivestoredirect:s:C\:;E\:;`: Redirect the specified drive letters for one or more drives, such as this example.
- **Default value**: `*`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure fixed, removable, and network drive redirection over the Remote Desktop Protocol](redirection-configure-drives-storage.md).

### `encode redirected video capture`

- **Syntax**: `encode redirected video capture:i:<value>`
- **Description**: Enables or disables encoding of redirected video.
- **Supported values**:
  - `0`: Disable encoding of redirected video.
  - `1`: Enable encoding of redirected video.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol](redirection-configure-camera-webcam-video-capture.md).

### `keyboardhook`

- **Syntax**: `keyboardhook:i:<value>`
- **Description**: Determines whether Windows key combinations (<kbd>Windows</kbd>, <kbd>Alt</kbd>+<kbd>Tab</kbd>) are applied to a remote session.
- **Supported values**:
  - `0`: Windows key combinations are applied on the local device.
  - `1`: (Desktop sessions only) Windows key combinations are applied on the remote computer when in focus.
  - `2`: (Desktop sessions only) Windows key combinations are applied on the remote computer in full screen mode only.
  - `3`: (RemoteApp sessions only) Windows key combinations are applied on the RemoteApp when in focus. We recommend you use this value only when publishing the Remote Desktop Connection app (`mstsc.exe`) from the host pool on Azure Virtual Desktop. This value is only supported when using the [Windows client](/azure/virtual-desktop/users/connect-windows).
- **Default value**: `2`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `redirectclipboard`

- **Syntax**: `redirectclipboard:i:<value>`
- **Description**: Determines whether to redirect the clipboard.
- **Supported values**:
  - `0`: Clipboard on local device isn't available in remote session.
  - `1`: Clipboard on local device is available in remote session.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure clipboard redirection over the Remote Desktop Protocol](redirection-configure-clipboard.md).

### `redirectcomports`

- **Syntax**: `redirectcomports:i:<value>`
- **Description**: Determines whether serial or COM ports on the local device are redirected to a remote session.
- **Supported values**:
  - `0`: Serial or COM ports on the local device aren't available in a remote session.
  - `1`: Serial or COM ports on the local device are available in a remote session.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure serial or COM port redirection over the Remote Desktop Protocol](redirection-configure-serial-com-ports.md).

### `redirected video capture encoding quality`

- **Syntax**: `redirected video capture encoding quality:i:<value>`
- **Description**: Controls the quality of encoded video.
- **Supported values**:
  - `0`: High compression video. Quality may suffer when there's a lot of motion.
  - `1`: Medium compression.
  - `2`: Low compression video with high picture quality.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol](redirection-configure-camera-webcam-video-capture.md).

### `redirectlocation`

- **Syntax**: `redirectlocation:i:<value>`
- **Description**: Determines whether the location of the local device is redirected to a remote session.
- **Supported values**:
  - `0`: A remote session uses the location of the remote computer or virtual machine.
  - `1`: A remote session uses the location of the local device.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure location redirection over the Remote Desktop Protocol](redirection-configure-location.md).

### `redirectprinters`

- **Syntax**: `redirectprinters:i:<value>`
- **Description**: Determines whether printers available on the local device are redirected to a remote session.
- **Supported values**:
  - `0`: The printers on the local device aren't redirected to a remote session.
  - `1`: The printers on the local device are redirected to a remote session.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure printer redirection over the Remote Desktop Protocol](redirection-configure-printers.md).

### `redirectsmartcards`

- **Syntax**: `redirectsmartcards:i:<value>`
- **Description**: Determines whether smart card devices on the local device will be redirected and available in a remote session.
- **Supported values**:
  - `0`: Smart cards on the local device aren't redirected to a remote session.
  - `1`: Smart cards on the local device are redirected a remote session.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure smart card redirection over the Remote Desktop Protocol](redirection-configure-smart-cards.md).

### `redirectwebauthn`

- **Syntax**: `redirectwebauthn:i:<value>`
- **Description**: Determines whether WebAuthn requests from a remote session are redirected to the local device allowing the use of local authenticators (such as Windows Hello for Business and security keys).
- **Supported values**:
  - `0`: WebAuthn requests from a remote session aren't sent to the local device for authentication and must be completed in the remote session.
  - `1`: WebAuthn requests from a remote session are sent to the local device for authentication.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure WebAuthn redirection over the Remote Desktop Protocol](redirection-configure-webauthn.md).

### `usbdevicestoredirect`

- **Syntax**: `usbdevicestoredirect:s:<value>`
- **Description**: Determines which supported USB devices on the client computer are redirected using opaque low-level redirection to a remote session.
- **Supported values**:
  - `*`: Redirect all USB devices that aren't already redirected by high-level redirection.
  - `{*Device Setup Class GUID*}`: Redirect all devices that are members of the specified device setup class.
  - `*USBInstanceID*`: Redirect a specific USB device identified by the instance ID.
- **Default value**: `*`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

To learn how to use this property, see [Configure USB redirection on Windows over the Remote Desktop Protocol](redirection-configure-usb.md).

## Display settings

Here are the RDP properties that you can use to configure display settings.

### `desktop size id`

- **Syntax**: `desktop size id:i:<value>`
- **Description**: Specifies the dimensions of a remote session desktop from a set of predefined options. This setting is overridden if [`desktopheight`](#desktopheight) and [`desktopwidth`](#desktopwidth) are specified.
- **Supported values**:
  - `0`: 640×480
  - `1`: 800×600
  - `2`: 1024×768
  - `3`: 1280×1024
  - `4`: 1600×1200
- **Default value**: None. Match the local device.
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `desktopheight`

- **Syntax**: `desktopheight:i:<value>`
- **Description**: Specifies the resolution height (in pixels) of a remote session.
- **Supported values**:
  - Numerical value between `200` and `8192`.
- **Default value**: None. Match the local device.
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `desktopwidth`

- **Syntax**: `desktopwidth:i:<value>`
- **Description**: Specifies the resolution width (in pixels) of a remote session.
- **Supported values**:
  - Numerical value between `200` and `8192`.
- **Default value**: None. Match the local device.
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `dynamic resolution`

- **Syntax**: `dynamic resolution:i:<value>`
- **Description**: Determines whether the resolution of a remote session is automatically updated when the local window is resized.
- **Supported values**:
  - `0`: Session resolution remains static during the session.
  - `1`: Session resolution updates as the local window resizes.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `maximizetocurrentdisplays`

- **Syntax**: `maximizetocurrentdisplays:i:<value>`
- **Description**: Determines which display a remote session uses for full screen on when maximizing. Requires [`use multimon`](#use-multimon) set to `1`. Only available on Windows App for Windows and the Remote Desktop app for Windows.
- **Supported values**:
  - `0`: Session is full screen on the displays initially selected when maximizing.
  - `1`: Session dynamically is full screen on the displays the session window spans when maximizing.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `screen mode id`

- **Syntax**: `screen mode id:i:<value>`
- **Description**: Determines whether a remote session window appears full screen when you launch the connection.
- **Supported values**:
  - `1`: A remote session appears in a window.
  - `2`: A remote session appears full screen.
- **Default value**: `2`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `selectedmonitors`

- **Syntax**: `selectedmonitors:s:<value>`
- **Description**: Specifies which local displays to use in a remote session. The selected displays must be contiguous. Requires [`use multimon`](#use-multimon) set to `1`. Only available on Windows App for Windows, the Remote Desktop app for Windows, and the inbox Remote Desktop Connection app on Windows.
- **Supported values**:
  - A comma separated list of machine-specific display IDs. You can retrieve available IDs by running `mstsc.exe /l` from the command line. The first ID listed is set as the primary display in a remote session.
- **Default value**: None. All displays are used.
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `singlemoninwindowedmode`

- **Syntax**: `singlemoninwindowedmode:i:<value>`
- **Description**: Determines whether a multi display remote session automatically switches to single display when exiting full screen. Requires [`use multimon`](#use-multimon) set to **1**. Only available on Windows App for Windows and the Remote Desktop app for Windows.
- **Supported values**:
  - `0`: A remote session retains all displays when exiting full screen.
  - `1`: A remote session switches to a single display when exiting full screen.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `smart sizing`

- **Syntax**: `smart sizing:i:<value>`
- **Description**: Determines whether the local device scales the content of the remote session to fit the window size.
- **Supported values**:
  - `0`: The local window content doesn't scale when resized.
  - `1`: The local window content does scale when resized.
- **Default value**: `0`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

### `use multimon`

- **Syntax**: `use multimon:i:<value>`
- **Description**: Determines whether the remote session will use one or multiple displays from the local device.
- **Supported values**:
  - `0`: A remote session uses a single display.
  - `1`: A remote session uses multiple displays.
- **Default value**: `1`
- **Applies to**:
   - Azure Virtual Desktop
   - Remote Desktop Services
   - Remote PC connections

## RemoteApp

Here are the RDP properties that you can use to configure RemoteApp behavior for Remote Desktop Services.

### `remoteapplicationcmdline`

- **Syntax**: `remoteapplicationcmdline:s:<value>`
- **Description**: Optional command line parameters for the RemoteApp.
- **Supported values**:
  - Valid command-line parameters for the application.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationexpandcmdline`

- **Syntax**: `remoteapplicationexpandcmdline:i:<value>`
- **Description**: Determines whether environment variables contained in the RemoteApp command line parameters should be expanded locally or remotely.
- **Supported values**:
  - `0`: Environment variables should be expanded to the values of the local device.
  - `1`: Environment variables should be expanded to the values of the remote session.
- **Default value**: `1`
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationexpandworkingdir`

- **Syntax**: `remoteapplicationexpandworkingdir:i:<value>`
- **Description**: Determines whether environment variables contained in the RemoteApp working directory parameter should be expanded locally or remotely.
- **Supported values**:
  - `0`: Environment variables should be expanded to the values of the local device.
  - `1`: Environment variables should be expanded to the values of the remote session.<br />The RemoteApp working directory is specified through the shell working directory parameter.
- **Default value**: `1`
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationfile`

- **Syntax**: `remoteapplicationfile:s:<value>`
- **Description**: Specifies a file to be opened in the remote session by the RemoteApp. For local files to be opened, you must also enable [drive redirection](#drivestoredirect) for the source drive.
- **Supported values**:
  - A valid file path in the remote session.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationicon`

- **Syntax**: `remoteapplicationicon:s:<value>`
- **Description**: Specifies the icon file to be displayed in Windows App or the Remote Desktop app while launching a RemoteApp. If no file name is specified, the client will use the standard Remote Desktop icon. Only `.ico` files are supported.
- **Supported values**:
  - A valid file path to an `.ico` file.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationmode`

- **Syntax**: `remoteapplicationmode:i:<value>`
- **Description**: Determines whether a connection is started as a RemoteApp session.
- **Supported values**:
  - `0`: Don't launch a RemoteApp session.
  - `1`: Launch a RemoteApp session.
- **Default value**: `1`
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationname`

- **Syntax**: `remoteapplicationname:s:<value>`
- **Description**: Specifies the name of the RemoteApp in Windows App or the Remote Desktop app while starting the RemoteApp.
- **Supported values**:
  - A valid application display name, for example `Microsoft Excel`.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services

### `remoteapplicationprogram`

- **Syntax**: `remoteapplicationprogram:s:<value>`
- **Description**: Specifies the alias or executable name of the RemoteApp.
- **Supported values**:
  - A valid application name or alias, for example `EXCEL`.
- **Default value**: None.
- **Applies to**:
   - Remote Desktop Services
