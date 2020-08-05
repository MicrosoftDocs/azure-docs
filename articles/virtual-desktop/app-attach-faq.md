---
title: Windows Virtual Desktop MSIX app attach FAQ - Azure
description: Frequently asked questions about MSIX app attach for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/05/2020
ms.author: helohr
manager: lizross
---

# MSIX app attach FAQ

This article answers frequently asked questions about MSIX app attach for Windows Virtual Desktop.

### Does MSIX app attach use FSLogix?

No, MSIX app attach does not use FSLogix. However, the two are aimed to work together to provide seamless user experience.

### Can I use MSIX app attach outside of Windows Virtual Desktop?**

Yes, MSIX app attach is feature that comes in Windows 10 Enterprise and can be used outside of Windows Virtual Desktop. However, there is no management plane for MSIX app attach outside of Windows Virtual Desktop.

### How do I get an MSIX package?

Your software vendor delivers a MSIX package for you. As a secondary option there is a path to take non-MSIX packages and convert them to MSIX. More information [here](/windows/msix/packaging-tool/create-an-msix-overview#how-to-move-your-existing-installers-to-msix).

### Which operating systems support MSIX app attach?

Windows 10 Enterprise and Windows 10 Enterprise for Multi-Session