---
title: Troubleshoot Azure File Sync | Microsoft Docs
description: Troubleshoot common issues that you might encounter with Azure File Sync, which you can use to transform Windows Server into a quick cache of your Azure file share.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 8/08/2022
ms.author: kendownie
ms.subservice: files 
ms.custom: devx-track-azurepowershell
---

# Troubleshoot Azure File Sync
You can use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. This article is designed to help you troubleshoot and resolve issues that you might encounter with your Azure File Sync deployment. We also describe how to collect important logs from the system if a deeper investigation of the issue is required. If you don't see the answer to your question, you can contact us through the following channels (in escalating order):

- [Microsoft Q&A question page for Azure Files](/answers/products/azure?product=storage).
- [Azure Community Feedback](https://feedback.azure.com/d365community/forum/a8bb4a47-3525-ec11-b6e6-000d3a4f0f84?c=c860fa6b-3525-ec11-b6e6-000d3a4f0f84).
- Microsoft Support. To create a new support request, in the Azure portal, on the **Help** tab, select the **Help + support** button, and then select **New support request**.

## I'm having an issue with Azure File Sync on my server (sync, cloud tiering, etc.). Should I remove and recreate my server endpoint?
[!INCLUDE [storage-sync-files-remove-server-endpoint](../../../includes/storage-sync-files-remove-server-endpoint.md)]

## General troubleshooting first steps
If you encounter issues with Azure File Sync on a server, start by completing the following steps:
1. In Event Viewer, review the telemetry, operational and diagnostic event logs.
    - Sync, tiering, and recall issues are logged in the telemetry, diagnostic and operational event logs under Applications and Services\Microsoft\FileSync\Agent.
    - Issues related to managing a server (for example, configuration settings) are logged in the operational and diagnostic event logs under Applications and Services\Microsoft\FileSync\Management.
2. Verify the Azure File Sync service is running on the server:
    - Open the Services MMC snap-in and verify that the Storage Sync Agent service (FileSyncSvc) is running.
3. Verify the Azure File Sync filter drivers (StorageSync.sys and StorageSyncGuard.sys) are running:
    - At an elevated command prompt, run `fltmc`. Verify that the StorageSync.sys and StorageSyncGuard.sys file system filter drivers are listed.

If the issue is not resolved, run the AFSDiag tool and send its .zip file output to the support engineer assigned to your case for further diagnosis.

To run AFSDiag, perform the steps below:

1. Open an elevated PowerShell window, and then run the following commands (press Enter after each command):

    > [!NOTE]
    >AFSDiag will create the output directory and a temp folder within it prior to collecting logs and will delete the temp folder after execution. Specify an output location which does not contain data.
    
    ```powershell
    cd "c:\Program Files\Azure\StorageSyncAgent"
    Import-Module .\afsdiag.ps1
    Debug-AFS -OutputDirectory C:\output -KernelModeTraceLevel Verbose -UserModeTraceLevel Verbose
    ```

2. Reproduce the issue. When you're finished, enter **D**.
3. A .zip file that contains logs and trace files is saved to the output directory that you specified.

## Common troubleshooting subject areas

For more detailed information, choose the subject area that you'd like to troubleshoot.

- [Agent installation and server registration issues](file-sync-troubleshoot-installation.md)
- [Sync group management (including cloud endpoint and server endpoint creation)](file-sync-troubleshoot-sync-group-management.md)
- [Sync errors](file-sync-troubleshoot-sync-errors.md)
- [Cloud tiering issues](file-sync-troubleshoot-cloud-tiering.md)

Some issues can be related to more than one subject area.

## See also
- [Monitor Azure File Sync](file-sync-monitoring.md)
- [Troubleshoot Azure Files problems in Windows](../files/storage-troubleshoot-windows-file-connection-problems.md)
- [Troubleshoot Azure Files problems in Linux](../files/storage-troubleshoot-linux-file-connection-problems.md)
- [Troubleshoot Azure file shares performance issues](../files/storage-troubleshooting-files-performance.md)
