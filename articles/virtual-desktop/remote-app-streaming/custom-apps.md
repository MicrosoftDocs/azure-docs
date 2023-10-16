---
title: Azure Virtual Desktop host custom apps - Azure
description: How to serve custom apps with Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---
# How to host custom apps with Azure Virtual Desktop

Azure Virtual Desktop can host multiple types of Windows applications. We recommend you prepare your apps according to the type of app packages you plan to deploy your apps with. In this article, we'll explain what you need to do for each type of app package. 

>[!NOTE]
>We recommend you host your apps on a multi-session host. We also recommend that you test your apps to make sure they behave as expected while running on your multi-session host. For example, run a test to see if two or more users on the same session host can successfully run the app at the same time.

## MSIX

MSIX is the recommended type of package for custom apps in Azure Virtual Desktop because they can take advantage of the service's built-in [MSIX app attach feature](../what-is-app-attach.md). To learn how to repackage existing Win32 applications in the MSIX format, visit [Repackage your existing Win32 applications to the MSIX format](/windows/application-management/msix-app-packaging-tool).

Once you've packaged your app in the MSIX format, you can use Azure Virtual Desktop’s MSIX app attach feature to deliver your apps to your customers. Learn how to use MSIX app attach for your apps at [Deploy apps with MSIX app attach](msix-app-attach.md).

## Other options for Win32 applications

You can also offer Win32 applications to your users without repackaging them in MSIX format by using the following options.

### Include the application manually on session hosts

Follow the instructions at [Prepare and customize a master VHD image](../set-up-customize-master-image.md) to include an app as part of the Windows image you use for your virtual machines. More specifically, follow the directions in the [Other applications and registry configuration](../set-up-customize-master-image.md#other-applications-and-registry-configuration) section to install the application for all users.

### Use Microsoft Intune to deploy the application at scale

If you use Microsoft Intune to manage your session hosts, you can deploy applications by following the instructions in [Install apps on Windows 10 devices](/mem/intune/apps/apps-windows-10-app-deploy#install-apps-on-windows-10-devices). Make sure you deploy your app in "device context" mode to all session hosts to make sure all users in your deployment can access the application.

### Manual installation

We don't recommend installing apps manually because it requires repeating the process for each session host. This method is more often used by IT professionals for testing purposes.

If you must install your apps manually, you'll need to remote into your session host with an administrator account after you've set up your Azure Virtual Desktop host pool. After that, install the application like you would on a physical PC. You'll need to repeat this process to install the application on each session host in your host pool.

>[!NOTE]
>If the setup process gives you the option to install the application for all users, select that option.

## Microsoft Store applications

We don't recommend using Microsoft Store apps for RemoteApp streaming in Azure Virtual Desktop at this time.

## Next steps

To learn how to package and deploy apps using MSIX app attach, see [Deploy apps with MSIX app attach](msix-app-attach.md).