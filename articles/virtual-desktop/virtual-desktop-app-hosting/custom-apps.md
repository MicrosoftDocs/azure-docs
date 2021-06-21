---
title: Azure Virtual Desktop serve custom apps - Azure
description: How to serve custom apps with Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: helohr
manager: femila
---
# Serve custom apps with Azure Virtual Desktop

Azure Virtual Desktop can serve multiple types of Windows applications. This article describes which virtualization paths we recommend depending on the app package types you want to host in Azure Virtual Desktop.nd different paths to virtualize them.

## MSIX

We recommend using MSIX packages for your custom apps because of Azure Virtual Desktop's MSIX app attach feature. MSIX app attach makes Azure Virtual Desktop very compatible with MSIX packages. Learn more about how to use MSIX app attach at [Deploy an app using MSIX app attach](deploy-app-attach.md).

## Win32

You can also use Win32 apps by adding them to a custom OS image running on your Azure Virtual Desktop session host. To learn how to create images and add Win32 apps to them, check out these resources:

- [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md), 
- [Create a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md)
- [Prepare and customize a master VHD image](../virtual-desktop/set-up-customize-master-image.md)

You can deploy Win32 apps through InTune, too. Learn how at [Windows 10 app deployment by using Microsoft Intune](https://docs.microsoft.com/en-us/mem/intune/apps/apps-windows-10-app-deploy).

Finally, if you think MSIX app attach compatibility might be an issue, you can convert Win32 apps to MSIX packages. To learn how to convert your Win32 apps, see [Create an MSIX package from an existing installer](/windows/msix/packaging-tool/create-an-msix-overview).
