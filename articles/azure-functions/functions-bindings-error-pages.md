---
title: Azure Functions Binding Error Codes | Microsoft Docs
description: Links to wrapped Azure Service SDKs to better diagnose issues with Bindings in Azure Functions
services: functions
cloud: 
documentationcenter: 
author: syntaxc4
manager: erikre

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: article
ms.date: 01/09/2017
ms.author: cfowler
---

# Azure Functions Binding Error Codes

Azure Function provides a wrapper to common services within Azure. Often times while developing your Functions, you may have errors bubble up from the underlying Azure Services SDKs. The following table is a reference off to the Error Code documentation for the services that we wrap.

## Azure Storage

[!INCLUDE [storage-binding-errors](../../includes/functions-bindings-storage-errors.md)]

## Service Bus

[!INCLUDE [service-bus-errors](../../includes/functions-bindings-service-bus-errors.md)]

## Event Hub

[!INCLUDE [event-hub-errors](../../includes/functions-bindings-event-hub-errors.md)]

## Notification Hub

[!INCLUDE [notification-hub-errors](../../includes/functions-bindings-notification-hub-errors.md)]

## DocumentDB

[!INCLUDE [document-db-errors](../../includes/functions-bindings-document-db-errors.md)]