---
title: Windows Virtual Desktop MSIX app attach FAQ - Azure
description: Frequently asked questions about MSIX app attach for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/17/2020
ms.author: helohr
manager: femila
---

# MSIX app attach FAQ

This article answers frequently asked questions about MSIX app attach for Windows Virtual Desktop.

## What's the difference between MSIX and MSIX app attach?

MSIX is a packaging format for apps, while MSIX app attach is the feature that delivers MSIX packages to your deployment.

## Does MSIX app attach use FSLogix?

MSIX app attach doesn't use FSLogix. However, MSIX app attach and FSLogix are designed to work together to provide a seamless user experience.

## Can I use the MSIX app attach outside of Windows Virtual Desktop?

The APIs that power MSIX app attach are available for Windows 10 Enterprise. These APIs can be used outside of Windows Virtual Desktop. However, there's no management plane for MSIX app attach outside of Windows Virtual Desktop.

## How do I get an MSIX package?

Your software vendor will give you an MSIX package. You can also convert non-MSIX packages to MSIX. Learn more at [How to move your existing installers to MSIX](/windows/msix/packaging-tool/create-an-msix-overview#how-to-move-your-existing-installers-to-msix).

## Which operating systems support MSIX app attach?

Windows 10 Enterprise and Windows 10 Enterprise Multi-session, version 2004 or later.

## Is MSIX app attach currently generally available?

MSIX app attach is part of Windows 10 Enterprise and Windows 10 Enterprise Multi-session, version 2004 or later. Both operating systems are currently generally available. 

## Can I use MSIX app attach outside of Windows Virtual Desktop?

MSIX and MSIX app attach APIs are part of Windows 10 Enterprise and Windows 10 Enterprise Multi-session, version 2004 and later. We currently don't provide management software for MSIX app attach outside of Windows Virtual Desktop.

## Can I run two versions of the same application at the same time?

For two version of the same MSIX applications to run simultaneously, the MSIX package family defined in the appxmanifest.xml file must be different for each app.

## Should I disable auto-update when using MSIX app attach?

Yes. MSIX app attach doesn't support auto-update for MSIX applications.

## How do permissions work with MSIX app attach?

All virtual machines (VMs) in a host pool that uses MSIX app attach must have read permissions on the file share where the MSIX images are stored. If it also uses Azure Files, they'll need to be granted both role-based access control (RBAC) and New Technology File System (NTFS) permissions.

## Can I use MSIX app attach for HTTP or HTTPs?

Using MSIX app attach over HTTP or HTTPs is currently not supported.

## Can I restage the same MSIX application?

Yes. You can restage applications you've already restaged, and this shouldn't cause any errors.

## Does MSIX app attach support self-signed certificates?

Yes. You need to install the self-signed certificate on all the session host VMs where MSIX app attach is used to host the self-signed application.

## What applications can I repackage to MSIX?

Each application uses different features of the OS, programming languages, and frameworks. To repackage your application, follow the directions in [How to move your existing installers to MSIX](/windows/msix/packaging-tool/create-an-msix-overview#how-to-move-your-existing-installers-to-msix). You can find a list of the things you need in order to repackage an application at [Prepare to package a desktop application](/windows/msix/desktop/desktop-to-uwp-prepare). 

Certain applications can't be application layered, which means they can't be repackaged into an MSIX file. Here's a list of the applications that can't be repackaged:

- Drivers 
- Active-X or Silverlight
- VPN clients
- Antivirus programs

## Next steps

If you want to learn more about MSIX app attach, check out our [overview](what-is-app-attach.md) and [glossary](app-attach-glossary.md). Otherwise, get started with [Set up app attach](app-attach.md).
