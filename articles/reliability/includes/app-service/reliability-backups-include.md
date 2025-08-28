---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

These capabilities help when it's difficult to redeploy code or when you store state on disk. Most solutions shouldn't rely exclusively on backups. Instead, use the other capabilities in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. Do not use the App Service [backup functionality for linked databases](/azure/app-service/manage-backup#deprecation-of-linked-database-backups). Use the native backup and restore tools of your linked database. For more information, see [Back up and restore your app in App Service](/azure/app-service/manage-backup).
