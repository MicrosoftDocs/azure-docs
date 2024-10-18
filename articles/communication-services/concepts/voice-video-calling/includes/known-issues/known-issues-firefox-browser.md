---
title: Azure Communication Services - known issues - Firefox
description: Learn more about known issues on Azure Communication Service calling when using a Firefox desktop browser experience
author: sloanster
services: azure-communication-services
 
ms.author: micahvivion
ms.date: 02/24/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to
---

## Firefox Desktop

### Speaker enumeration and selection unavailable in Firefox through Communication Services device manager
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** If you're using Firefox, your app can't enumerate or select speakers through the Communication Services device manager.<br>
**Workaround:** In this scenario, you must select devices via the operating system.<br>

### Virtual cameras aren't currently supported
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Virtual cameras aren't currently supported when making Firefox desktop audio\video calls.<br>