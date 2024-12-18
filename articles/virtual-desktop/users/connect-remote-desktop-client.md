---
title: Get started with the Remote Desktop client for Azure Virtual Desktop
description: Learn how to connect to Azure Virtual Desktop using the Remote Desktop client.
author: sipastak
ms.topic: how-to
ms.date: 09/17/2024
ms.custom: "se-defect-target"
ms.author: sipastak
---

# Get started with the Remote Desktop client

> [!IMPORTANT]
> To ensure a seamless experience, users are encouraged to download Windows App. Windows App is the gateway to securely connect to any devices or apps across Azure Virtual Desktop, Windows 365, and Microsoft Dev Box. For more information, see [What is Windows App](/windows-app/overview).

The Microsoft Remote Desktop client is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Remote Desktop client.

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

## Prerequisites

Select a tab for the platform you're using.

# [Windows](#tab/windows)

Before you can connect to your devices and apps from Windows, you need:

- Internet access.

- A device running one of the following supported versions of Windows:
  - Windows 11
  - Windows 10
  - Windows Server 2022
  - Windows Server 2019
  - Windows Server 2016
   
   > [!IMPORTANT]
   > - Support for Windows 7 ended on January 10, 2023.
   > - Support for Windows Server 2012 R2 ended on October 10, 2023.

- .NET Framework 4.6.2 or later. You may need to install this on Windows Server 2016, and some versions of Windows 10. To download the latest version, see [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).

- [Download and install the Remote Desktop client](#download-and-install-the-remote-desktop-client-for-windows-msi) using the MSI installer.

### Download and install the Remote Desktop client for Windows (MSI)

Here's how to install the Remote Desktop client for Windows using the MSI installer. If you want to deploy the Remote Desktop client in an enterprise, you can use `msiexec` from the command line to install the MSI file. For more information, see [Enterprise deployment](client-features-windows.md#enterprise-deployment).

1. Download the Remote Desktop client installer, choosing the correct version for your device:

   - [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2139369) *(most common)*
   - [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2139456)
   - [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2139370)

1. Run the installer by double-clicking the file you downloaded.

1. On the welcome screen, select **Next**.

1. To accept the end-user license agreement, check the box for **I accept the terms in the License Agreement**, then select **Next**.

1. For the Installation Scope, select one of the following options:

   - **Install just for you**: Remote Desktop will be installed in a per-user folder and be available just for your user account. You don't need local Administrator privileges.
   - **Install for all users of this machine**: Remote Desktop will be installed in a per-machine folder and be available for all users. You must have local Administrator privileges

1. Select **Install**.

1. Once installation has completed, select **Finish**.

1. If you left the box for **Launch Remote Desktop when setup exits** selected, the Remote Desktop client will automatically open. Alternatively to launch the client after installation, use the Start menu to search for and select **Remote Desktop**.

> [!IMPORTANT]
> If you have the Remote Desktop client (MSI) and the Azure Virtual Desktop app from the Microsoft Store installed on the same device, you may see the message that begins **A version of this application called Azure Virtual Desktop was installed from the Microsoft Store**. Both apps are supported, and you have the option to choose **Continue anyway**, however it could be confusing to use the same remote resource across both apps. We recommend using only one version of the app at a time.

# [macOS](#tab/macos)

Before you can connect to your devices and apps from macOS, you need:

- Internet access.

- A device running macOS 12 or later.

- Download and install the Remote Desktop client from the [Mac App Store](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12).

>[!NOTE]
>- The macOS Remote Desktop client currently isn't distributed in the China region in the App Store.

> [!IMPORTANT]
> In version 11.0.0 and above, the Remote Desktop client has a new name, Windows App. For more information on the Windows App update, see [What is Windows App](/windows-app/overview). If you're using macOS or iOS/iPadOS, you should reference [Get started with Windows App](/windows-app/get-started-connect-devices-desktops-apps) to connect to desktops and apps moving forward.

# [iOS/iPadOS](#tab/ios-ipados)

Before you can connect to your devices and apps from iOS or iPadOS, you need:

- Internet access.

- An iPhone running iOS 16 or later or an iPad running iPadOS 16 or later.

- Download and install the Remote Desktop client from the [App Store](https://apps.apple.com/app/microsoft-remote-desktop/id714464092).

> [!IMPORTANT]
> In version 11.0.0 and above, the Remote Desktop client has a new name, Windows App. For more information on the Windows App update, see [What is Windows App](/windows-app/overview). If you're using macOS or iOS/iPadOS, you should reference [Get started with Windows App](/windows-app/get-started-connect-devices-desktops-apps) to connect to desktops and apps moving forward.

# [Android/Chrome OS](#tab/android)

Before you can connect to your devices and apps from Android or Chrome OS, you need:

- Internet access

- One of the following:
  - Smartphone or tablet running Android 9 or later.
  - Chromebook running Chrome OS 53 or later. Learn more about [Android applications running in Chrome OS](https://www.chromium.org/chromium-os/chrome-os-systems-supporting-android-apps/).

- Download and install the Remote Desktop client from [Google Play](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx).

> [!IMPORTANT]
> The Android client is not available on platforms built on the Android Open Source Project (AOSP) that do not include Google Mobile Services (GMS), the client is only available through the canonical Google Play Store.

# [Web browser](#tab/web)

Before you can access your resources, you'll need to meet the prerequisites:

- Internet access.

- A supported web browser. While any HTML5-capable web browser should work, we officially support the following web browsers and operating systems:

   | Web browser       | Supported operating system       | Notes               |
   |-------------------|----------------------------------|---------------------|
   | Microsoft Edge    | Windows, macOS, Linux, Chrome OS | Version 79 or later |
   | Google Chrome     | Windows, macOS, Linux, Chrome OS | Version 57 or later |
   | Apple Safari      | macOS                            | Version 11 or later |
   | Mozilla Firefox   | Windows, macOS, Linux            | Version 55 or later |

> [!NOTE]
> The Remote Desktop Web client doesn't support mobile web browsers.
>
> As of September 30, 2021, the Remote Desktop Web client no longer supports Internet Explorer. We recommend that you use Microsoft Edge with the Remote Desktop Web client instead. For more information, see our [blog post](https://aka.ms/WVDSupportIE11).


---

## Subscribe to a workspace and connect to your desktops and applications

Select a tab for the platform you're using.

# [Windows](#tab/windows)

### Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop client, you need to subscribe to the workspace by following these steps:

1. Open the **Remote Desktop** app on your device.

1. The first time you subscribe to a workspace, from the **Let's get started** screen, select **Subscribe** or **Subscribe with URL**.

   - If you selected **Subscribe**, sign in with your user account when prompted, for example `user@contoso.com`. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.
   
     If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery, or you're using an Azure environment that isn't Azure cloud, such as Azure for US Government. Try the steps to **Subscribe with URL** instead.
   
   - If you selected **Subscribe with URL**, in the **Email or Workspace URL** box, enter the relevant URL from the following table. After a few seconds, the message **We found Workspaces at the following URLs** should be displayed.

      | Azure environment | Workspace URL |
      |--|--|
      | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
      | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
      | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Select **Next**.

1. Sign in with your user account when prompted. After a few seconds, the workspace should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly and each time you start the client. Resources may be added, changed, or removed based on changes made by your admin.

### Connect to your desktops and applications

To connect to your desktops and applications:

1. Open the **Remote Desktop** client on your device.

1. Double-click one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

### Insider releases

If you want to help us test new builds before they're released, you should download our Insider releases. Organizations can use the Insider releases to validate new versions for their users before they're generally available. For more information, see [Enable Insider releases](client-features-windows.md#enable-insider-releases).

# [macOS](#tab/macos)

### Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop client, you need to subscribe to the workspace by following these steps:

1. Open the **Microsoft Remote Desktop** app on your device.

1. In the Connection Center, select **+**, then select **Add Workspace**.

1. In the **Email or Workspace URL** box, either enter your user account, for example `user@contoso.com`, or the relevant URL from the following table. After a few seconds, the message **A workspace is associated with this URL** should be displayed.

   > [!TIP]
   > If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery. Use one of the following workspace URLs instead.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Select **Add**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically every six hours and each time you start the client. Resources may be added, changed, or removed based on changes made by your admin.

### Connect to your desktops and applications

To connect to your desktops and applications:

1. Open the **Microsoft Remote Desktop** app on your device.

1. Double-click one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

### Beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available. For more information, see [Test the beta client](client-features-macos.md#test-the-beta-client).

> [!IMPORTANT]
> The Remote Desktop client is changing to Windows App. To ensure you can validate the upcoming Windows App update before it's released into the store, the Windows App preview is now available in the [Remote Desktop Beta channels](client-features-macos.md#test-the-beta-client) where you can test the experience of updating from Remote Desktop to Windows App. To learn more about Windows App, see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps).

# [iOS/iPadOS](#tab/ios-ipados)

### Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop client, you need to subscribe to the workspace by following these steps:

1. Open the **RD Client** app on your device.

1. In the Connection Center, tap **+**, then tap **Add Workspace**.

1. In the **Email or Workspace URL** box, either enter your user account, for example `user@contoso.com`, or the relevant URL from the following table. After a few seconds, the message **A workspace is associated with this URL** should be displayed.

   > [!TIP]
   > If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery. Use one of the following workspace URLs instead.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Tap **Next**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly. Resources may be added, changed, or removed based on changes made by your admin.

### Connect to your desktops and applications

To connect to your desktops and applications:

1. Open the **RD Client** app on your device.

1. Tap one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

### Beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available. For more information, see [Test the beta client](client-features-ios-ipados.md#test-the-beta-client).

> [!IMPORTANT]
> The Remote Desktop client is changing to Windows App. To ensure you can validate the upcoming Windows App update before it's released into the store, the Windows App preview is now available in the [Remote Desktop Beta channels](client-features-ios-ipados.md#test-the-beta-client) where you can test the experience of updating from Remote Desktop to Windows App. To learn more about Windows App, see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps).

# [Android/Chrome OS](#tab/android)

### Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop client, you need to subscribe to the workspace by following these steps:

1. Open the **RD Client** app on your device.

1. In the Connection Center, tap **+**, then tap **Add Workspace**.

1. In the **Email or Workspace URL** box, either enter your user account, for example `user@contoso.com`, or the relevant URL from the following table. After a few seconds, the message **A workspace is associated with this URL** should be displayed.

   > [!TIP]
   > If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery. Use one of the following workspace URLs instead.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Tap **Next**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly. Resources may be added, changed, or removed based on changes made by your admin.

### Connect to your desktops and applications

To connect to your desktops and applications:

1. Open the **RD Client** app on your device.

1. Tap one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, and to make sure you trust the remote PC before you connect, depending on how your admin has configured Azure Virtual Desktop.

### Beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available. For more information, see [Test the beta client](client-features-android-chrome-os.md#test-the-beta-client).

# [Web browser](#tab/web)

When you sign in to the Remote Desktop Web client, you'll see your workspaces. A workspace combines all the desktops and applications that have been made available to you by your admin. You sign in by following these steps:

1. Open your web browser.

1. Go to one of the following URLs:

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | [https://client.wvd.microsoft.com/arm/webclient/](https://client.wvd.microsoft.com/arm/webclient/) |
   | Azure cloud (classic) | [https://client.wvd.microsoft.com/webclient/index.html](https://client.wvd.microsoft.com/webclient/index.html) |
   | Azure for US Government | [https://rdweb.wvd.azure.us/arm/webclient/](https://rdweb.wvd.azure.us/arm/webclient/) |
   | Azure operated by 21Vianet | [https://rdweb.wvd.azure.cn/arm/webclient/](https://rdweb.wvd.azure.cn/arm/webclient/) |

1. Sign in with your user account. Once you've signed in successfully, your workspaces should show the desktops and applications that have been made available to you by your admin.

1. Select one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

1. A prompt for **Access local resources** may be displayed asking you to confirm which local resources you want to be available in the remote session. Make your selection, then select **Allow**.

>[!TIP]
>If you've already signed in to the web browser with a different Microsoft Entra account than the one you want to use for Azure Virtual Desktop, you should either sign out or use a private browser window.

---


## Next steps

- To learn more about the features of the Remote Desktop client for Windows, check out [Use features of the Remote Desktop client for Windows when connecting to Azure Virtual Desktop](client-features-windows.md).

- To learn more about the features of the Remote Desktop client for macOS, check out [Use features of the Remote Desktop client for macOS when connecting to Azure Virtual Desktop](client-features-macos.md).

- To learn more about the features of the Remote Desktop client for iOS and iPadOS, check out [Use features of the Remote Desktop client for iOS and iPadOS when connecting to Azure Virtual Desktop](client-features-ios-ipados.md).

- To learn more about the features of the Remote Desktop Web client, check out [Use features of the Remote Desktop Web client when connecting to Azure Virtual Desktop](client-features-web.md).

- To learn more about the features of the Remote Desktop client for Android and Chrome OS, check out [Use features of the Remote Desktop client for Android and Chrome OS when connecting to Azure Virtual Desktop](client-features-android-chrome-os.md).

- If you want to use Teams on Azure Virtual Desktop with media optimization, see [Use Microsoft Teams on Azure Virtual Desktop](../teams-on-avd.md).
