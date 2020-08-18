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

## Does MSIX app attach use FSLogix?

MSIX app attach doesn't use FSLogix. However, app attach and FSLogix are designed to work together to provide a seamless user experience.

## Can I use MSIX app attach outside of Windows Virtual Desktop?

Yes, MSIX app attach is a feature that's included with Windows 10 Enterprise and can be used outside of Windows Virtual Desktop. However, there's no management plane for MSIX app attach outside of Windows Virtual Desktop.

## How do I get an MSIX package?

Your software vendor will give you an MSIX package. You can also convert non-MSIX packages to MSIX. Learn more at [How to move your existing installers to MSIX](/windows/msix/packaging-tool/create-an-msix-overview#how-to-move-your-existing-installers-to-msix).

## Which operating systems support MSIX app attach?

Windows 10 Enterprise and Windows 10 Enterprise Multi-session.

## Next steps

If you want to learn more about MSIX app attach, check out our [overview](what-is-app-attach.md) [glossary](app-attach-glossary.md). Otherwise, get started with [Set up app attach](app-attach.md).