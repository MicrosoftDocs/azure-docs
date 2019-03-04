---
title: include file
description: include file
services: functions
author: nzthiago
ms.service: azure-functions
ms.topic: include
ms.date: 02/21/2018
ms.author: nzthiago
ms.custom: include file
---
## <a name="timeout"></a>Function app timeout duration 

The timeout duration of a function app is defined by the functionTimeout property in the [host.json](../articles/azure-functions/functions-host-json.md#functiontimeout) project file. The following table shows the default and maximum values for both plans and in both runtime versions:

| Plan | Runtime Version | Default | Maximum |
|------|---------|---------|---------|
| Consumption | 1.x | 5 | 10 |
| Consumption | 2.x | 5 | 10 |
| App Service | 1.x | Unlimited | Unlimited |
| App Service | 2.x | 30 | Unlimited |
