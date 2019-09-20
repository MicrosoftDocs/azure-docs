---
title: Azure Service Bus Resource Manager exceptions | Microsoft Docs
description: List of Service Bus exceptions surfaced by Azure Resource Manager (ARM) and suggested actions.
services: service-bus-messaging
documentationcenter: na
author: axisc
manager: timlt
editor: spelluru

ms.assetid: 3d8526fe-6e47-4119-9f3e-c56d916a98f9
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/26/2019
ms.author: aschhab

---

# Service Bus Resource Manager exceptions

This article lists exceptions generated when interacting with Azure Service Bus using Azure Resource Manager (ARM) - via templates or direct calls.

## Exception Categories

## Error: Bad Request

"Bad Request" implies that the request received by the Resource Manager failed validation.

| Error code | Error sub-code | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Bad Request | 40000 | | TODO - these errors are caused due to operations done on the Basic tier. Add appropriate message | | 

## Error: Not found

## Error code: 400

## Error code: 429
| Error code | Error sub-code | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| 429 | 50004 | SubCode=50004. The request was terminated because the namespace *your namespace* is being throttled. | This error condition is hit when the concurrent receives requests count exceeding the limit. <br/>The request was terminated. | Wait for a few seconds and try again. <br/> <br/> Please learn more about the [quotas](service-bus-quotas) and [ARM request limits](../azure-resource-manager/resource-manager-request-limits)|
| 429 | 40901 | SubCode=40901. Another conflicting operation is in progress. | Another conflicting operation is in progress on the same resource/entity | Wait for the current in-progress operation to complete before trying again. |