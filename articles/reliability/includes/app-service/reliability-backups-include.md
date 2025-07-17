---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---
When you use Basic tier or higher, you can back up your App Service app to a file by using the App Service backup and restore capabilities.

This feature is useful if it's hard to redeploy your code, or if you store state on disk. For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Back up and restore your app in App Service](/azure/app-service/manage-backup).