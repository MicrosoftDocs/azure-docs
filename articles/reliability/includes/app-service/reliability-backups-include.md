---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

These capabilities help when it's difficult to redeploy code or when you store state on disk. Most solutions shouldn't rely exclusively on backups. Instead, use the other capabilities in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't.  

>[!IMPORTANT]
> Starting **March 31, 2028**, Azure App Service custom backups will **no longer support backing up linked databases**. See [Deprecation of linked database backups](#deprecation-of-linked-database-backups) for more information. 
>
>Instead, use the native backup and restore tools of your linked database. For more information, see [Back up and restore your app in App Service](/azure/app-service/manage-backup).
>
