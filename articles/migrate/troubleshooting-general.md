---
title: Troubleshoot Azure Migration Planner | Microsoft Docs
description: Provides an overview of known issues in Azure Migration Planner, and troubleshooting tips for common errors.
services: migrate
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 40faffa3f-1f44-4a72-94bc-457222ed7ac8
ms.service: migrate
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 10/26/2017
ms.author: raynew

---
# Troubleshoot common issues

[Azure Migrate](migrate-overview.md) assesses on-premises workloads for migration to Azure. Use this article to troubleshoot issues when deploying and using Azure Migrate.


**I can't find Azure Migrate in the Azure Portal.** 

Check you're using the the correct URL. Azure Migrate isn't visible in the regular Azure portal. It's only visible from [https://aka.ms/migrate/prod/](https://aka.ms/migrate/prod/).

**I'm using the correct URL to access Azure Migrate, but I can't find it in a portal search.**

 Make sure you press ‘Enter’ after typing ‘Azure Migrate’ in the marketplace search page. The search doesn't work without. Also, the service is in preview so it will be listed further down in the search results.



**The collector can't connect to the project using the project ID and key I copied from the portal.**

Make sure you've copied and pasted the right information. To troubleshoot, install the Microsoft Monitoring Agent (MMA) as follows:

1. On the collector VM, download the [MMA](https://go.microsoft.com/fwlink/?LinkId=828603).
2. Double-click the downloaded file to start the installation.
3. In setup, on the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
4. In **Destination Folder**, keep or modify the default installation folder > **Next**.
5. In **Agent Setup Options**, select **Azure Log Analytics (OMS)** > **Next**.
6. Click **Add** to add a new OMS workspace. Paste in project ID and key that you copied. Then click **Next**.
7. Verify that the agent can connect to the project. If it can't verify the settings. If it can but the collector can't, contact support.


**I installed the agent as described in the previous issue, but when I connect to the project I get a date and time synchronization error.**
The server clock might be out-of-synchronization with the current time by more than five minutes. Change the clock time on the collector VM to match the current time, as follows:

1. Open an admin command prompt on the VM.
2. Run w32tm /tz,  to check the time zone.
3. Run w32tm /resync,  to synchronize the time.

**My project key has “==” symbols towards the end. These are encoded to other alphanumeric characters by the collector. Is this expected?**

Yes, every project key ends with “==”. The collector encrypts the project key before processing it.



**How do I collect logs on the collector VM?**
Logging is enabled by default. Logs are located as follows:

- C:\Profiler\ProfilerEngineDB.sqlite
- C:\Profiler\Service.log
- C:\Profiler\WebApp.log

To collect Event Tracing for Windows, do the following:

1. On the collector VM, open a PowerShell command window.
2. Run **Get-EventLog -LogName Application | export-csv eventlog.csv**.
