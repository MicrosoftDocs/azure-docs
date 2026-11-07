---
ms.assetid: 
title: include file
description: include file with notes on end of life information for Windows Servers and Windows.
author: Jeronika-MS
ms.author: v-gajeronika
ms.date: 10/14/2026
ms.topic:  include
ms.service: azure-site-recovery

---

>[!NOTE]
>Starting March 1, 2027, ASR will block new replications for the following Windows operating systems that have reached end of support (EOS): <br>
>- Windows 7 SP1 and later
>- Windows 8 / Windows 8.1
>- Windows 10
>- Windows Server 2008 / 2008 R2
>- Windows Server 2012 / 2012 R2
>
>Existing protected virtual machines running on these operating systems will not be forcibly disabled or shut down. However, ASR will not provide support or investigation for issues with replication, failover failures, and more post 1st March 2027. For virtual machines already identified with these operating systems, ASR will set the failover health to `Warning` after March 1 until you upgrade to a supported operating system.
>
>It is recommend that you identify protected machines running on the preceding operating systems and plan a transition to a Windows version that is supported by both Windows and ASR. ASR supports Windows OS upgrades without requiring replication to be disabled. To update the OS to a supported version, follow the steps in [Windows In-Place Upgrades](/azure/virtual-machines/windows-in-place-upgrade#perform-in-place-upgrade-to-windows-server-2016-2019-2022-or-2025).