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

Azure Functions in the Consumption plan have a default timeout of 5 minutes, and a maximum configurable timeout of 10 minutes for both 1.x and 2.x runtime versions.

Azure Functions on an App Service Plan have an unlimited default and unlimited maximum timeout for the 1.x runtime; and a 30 minutes default and unlimited maximum timeout for the 2.x runtime.

| Plan | Runtime Version | Default | Maximum |
|------|---------|---------|---------|
| Consumption | 1.x | 5 | 10 |
| Consumption | 2.x | 5 | 10 |
| App Service | 1.x | Unlimited | Unlimited |
| App Service | 2.x | 30 | Unlimited |


The timeout value can be changed for the Function App by changing the property functionTimeout in the [host.json](../articles/azure-functions/functions-host-json.md#functiontimeout) project file for both runtime versions.
