---
title: Troubleshoot Azure Migration Planner | Microsoft Docs
description: Provides an overview of known issues in Azure Migration Planner, and troubleshooting tips for common errors.
services: migration-planner
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 40faffa3f-1f44-4a72-94bc-457222ed7ac8
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/05/2017
ms.author: raynew

---
# Troubleshoot Migration Planner

[Azure Migration Planner](migration-planner-overview.md) assesses on-premises workloads for migration to Azure. This article provides information about how assessments are calculated.

Use this article to troubleshoot issues when deploying and using Migration Planner.

Post any comments or questions at the bottom of this article.



## Release limitations

Currently the following limitations apply:

- You can only run assessments for on-premises VMware VMs managed by a vCenter server running version 5.5 or 6.0.
- The Migration Planner portal is only available in English
- You can only create a project in West Central US.
- Only Locally Redundant Sotrage (LRS) is supported.
- Offers specified in the assessment settings aren't taken into account when doing an assessment.
- Only US dollars are supported for the assessment currency.
- Only the pay-as-you-go offer is applicable in the assessment settings.


## Common issues

**The collector can't connect to the project using the project ID and key I copied
from the portal**
Make sure you've copied and pasted the right information. To troubleshoot, install the Mirosoft Monitoring Agent as follows:
    1. On the collector VM, install the agent.
    2. In setup, on the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
    3. In **Destination Folder**, keep or modify the default installation folder > **Next**.
    4. In **Agent Setup Options**, select **Azure Log Analytics (OMS)** > **Next**.
    5. Click **Add** to add a new OMS workspace. Paste in project ID and key that you copied
from the portal. Click **Next**.
    6. Check if the agent can connect to the project. If it can't check the values. If it can but the collector can't, contact support.

**I installed the agent as described in the previous issue, but when I connect to the project I get a date and time synchronization error.**
The server clock might be out-of-synchronization with the current time by more than five
minutes. Change the clock time on the collector VM to match the
current time, as follows:

1. Open an admin command prompt on the VM.
2. Run w32tm /tz,  to check the time zone.
3. Run w32tm /resync,  to synchronize the time.


**My project key has “==” symbols towards the end. These are encoded to other
alphanumeric characters by the collector. Is this expected?**
Yes, every project key ends with “==”. The collector
encrypts the project key before processing it.




