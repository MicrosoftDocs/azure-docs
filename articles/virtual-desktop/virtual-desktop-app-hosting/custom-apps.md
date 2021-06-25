---
title: Azure Virtual Desktop host custom apps - Azure
description: How to serve custom apps with Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: helohr
manager: femila
---
# How to host custom apps with Azure Virtual Desktop

Azure Virtual Desktop can serve multiple types of Windows applications. This article describes which virtualization paths we recommend depending on the app package types you want to host in Azure Virtual Desktop.nd different paths to virtualize them.

Azure Virtual Desktop can host multiple types of Windows applications. We recommend you prepare your apps according to the type of app packages you're using to host your apps. In this article, we'll explain what you need to do for each type of app package. 

>[!NOTE]
>Before you start hosting, we recommend you test your apps to make sure they behave as expected while running on virtual machines. For example, test the app to see if two or more users in the same host pool can launch it on different virtual machines at the same time.

## MSIX

MSIX is the most compatible type of package for custom apps in Azure Virtual Desktop because they can take advantage of the service's built-in [MSIX app attach feature](../app-attach-glossary.md). To learn how to repackage existing Win32 applications in the MSIX format, visit [Repackage your existing Win32 applications to the MSIX format](/windows/application-management/msix-app-packaging-tool).

Once you've packaged your app in the MSIX format, you can use Azure Virtual Desktop’s MSIX app attach feature to deliver your apps to your customers. Learn how to use MISX app attach for your apps at [Set up MSIX app attach with the Azure portal](../app-attach-azure-portal.md).

## Win32 applications

You can also offer Win32 applications to your customers without repackaging them with MSIX by using the following options.

### Include the application as part of the Windows image 

Follow the instructions at [Prepare and customize a master VHD image](../set-up-customize-master-image.md) to include an app as part of the Windows image you use for your virtual machines. More specifically, follow the directions in the [Other applications and registry configuration](../set-up-customize-master-image.md#other-applications-and-registry-configuration) section to install the application for all users.

### Use Microsoft Endpoint Manager to deploy the application at scale

If you use Microsoft Endpoint Manager to manage your session hosts, you can deploy applications by following the instructions in [Windows 10 app deployment by using Microsoft Intune | Microsoft Docs](/mem/intune/apps/apps-windows-10-app-deploy#install-apps-on-windows-10-devices). Make sure you deploy your app in "device context" mode to all session hosts to make sure all users in your deployment can access the application.

### Manual installation

We don't recommend installing apps manually because it requires repeating the process for each session host. This method is more often used by IT professionals for testing purposes.

If you must install your apps manually, you'll need to remote into your session host with a local administrator account after you've set up your Azure Virtual Desktop host pool. After that, install the application like you would on a physical PC. You'll need to repeat this process to install the application on each session host in your host pool.

>[!NOTE]
>If the setup process gives you the option to install the application for all users, select that option.

## Microsoft Store applications

We don't recommend using Microsoft Store apps for Remote App Streaming in Azure Virtual Desktop.
