---
title: Check the Last Sync Time property for a storage account 
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/09/2019
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

You can check the **Last Sync Time** property for your storage account. **Last Sync Time** is a GMT date/time value. All primary writes made before the **Last Sync Time** have been successfully written to the secondary location, meaning that they are available to be read from the secondary location. Primary writes after the **Last Sync Time** may or may not be available for reads yet. You can query this value using PowerShell, Azure CLI, or one of the Azure Storage client libraries. For more information, see **Getting the last sync time** in [Designing highly available applications using read-access geo-redundant storage](storage-designing-ha-apps-with-ragrs.md#getting-the-last-sync-time).