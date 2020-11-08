---
title: Windows Virtual Desktop MSIX app attach FAQ - Azure
description: Frequently asked questions about MSIX app attach for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/17/2020
ms.author: helohr
manager: lizross
---

# MSIX app attach FAQ

This article answers frequently asked questions about MSIX app attach for Windows Virtual Desktop.

## What's the difference between MSIX and MSIX app attach?

MSIX is a packaging format for apps, while MSIX app attach is the feature that delivers MSIX packages to your deployment.

## Does MSIX app attach use FSLogix?

MSIX app attach doesn't use FSLogix. However, MSIX app attach and FSLogix are designed to work together to provide a seamless user experience.

## Can I use MSIX app attach outside of Windows Virtual Desktop?

The APIs that power MSIX app attach are available Windows 10 Enterprise. Those APIs can be used outside of Windows Virtual Desktop. However, there's no management plane for MSIX app attach outside of Windows Virtual Desktop.

## How do I get an MSIX package?

Your software vendor will give you an MSIX package. You can also convert non-MSIX packages to MSIX. Learn more at [How to move your existing installers to MSIX](/windows/msix/packaging-tool/create-an-msix-overview#how-to-move-your-existing-installers-to-msix).

## Which operating systems support MSIX app attach?

Windows 10 Enterprise and Windows 10 Enterprise Multi-session, version 2004 or later.

## Is MSIX app attach GA?

MSIX app attach is part of Windows 10 Enterprise and Windows 10 Enterprise Multi-session, version 2004 or later. Both operating systems are currently generally available. 

## Can I use MSIX app attach outside of Windows Virtual Desktop?

MSIX and MSIX app attach APIs are part of Windows 10 Enterprise and Windows 10 Enterprise Multi-session release 2004 or later. Currently, there are no plans to provide management UI for MSIX app attach outside of WVD.

## Can I run two versions of the same application on the same machine and even for the same user?

For two version of the same MSIX applications to run the MSIX package family taht is defined in the appxmanifest.xml must be different.

## When using MSIX app attach should I disable auto-updates?

MSIX app attach does not support auto-update for the MSIX applications.

## How permissions work with MSIX app attach?

All VMs that are part of a host pool that uses MSIX app attach must have read permissions on the file share where MSIX images are stored. If Azure Files is being used both RBAC and NTFS permissions must be granted.

## Can I use MSIX app attach of HTTP/HTTPs?

All VMs that are part of a host pool that uses MSIX app attach must have read permissions on the file share where MSIX images are stored. If Azure Files is being used both RBAC and NTFS permissions must be granted.

## Can I restage the same MSIX application?

Yes. You can restage applications you've already restaged, and this shouldn't cause any errors.

## Does MSIX app attach support self-signed certificates?

Yes, MSIX app attach supports self-signed certificates. You'll need to make sure the certificates are installed under the  Trusted People category.


## Next steps

If you want to learn more about MSIX app attach, check out our [overview](what-is-app-attach.md) and [glossary](app-attach-glossary.md). Otherwise, get started with [Set up app attach](app-attach.md).
