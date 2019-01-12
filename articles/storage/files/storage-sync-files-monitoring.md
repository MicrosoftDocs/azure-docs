---
title: Monitoring Azure File Sync | Microsoft Docs
description: How to monitor Azure File Sync.
services: storage
author: jeffpatt24
ms.service: storage
ms.topic: article
ms.date: 01/11/2019
ms.author: jeffpatt
ms.component: files
---

# Monitoring Azure File Sync

Use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article describes how to monitor your Azure File Sync deployment. Additional monitoring options (like alerts) will be available in future Azure File Sync updates.

The following monitoring options are available currently:

## Azure Portal

Use the portal to view Registered server state and Server endpoint health (sync health).

Registered Server State
- If the Registered server state = Online, the server is successfully communicating with the service.
- If Registered server state = Appears Offline, verify the Storage Sync Monitor (AzureStorageSyncMonitor.exe) process on the server is running. If the server is behind a Firewall or Proxy, configure the firewall and proxy per our [documentation](https://docs.microsoft.com/en-us/azure/storage/files/storage-sync-files-firewall-and-proxy).

Server Endpoint Health 
- The server endpoint health in the portal is based on the sync events that are logged in the Telemetry event log on the server (ID 9102 and 9302). If a sync session fails due a transient error (e.g., error cancelled), sync may still show healthy in the portal as long as the current sync session is making progress (Event ID 9302 is used to determine if files are being applied).
- If the portal shows a sync error due to sync not making progress, check the [Troubleshooting documentation](https://docs.microsoft.com/en-us/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#common-sync-errors) for guidance.
