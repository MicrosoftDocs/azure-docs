---
title: Azure Event Hubs - Resource Manager exceptions | Microsoft Docs
description: List of Azure Event Hubs exceptions surfaced by Azure Resource Manager and suggested actions.
services: service-bus-messaging
documentationcenter: na
author: spelluru
editor: spelluru

ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/08/2019
ms.author: spelluru

---

# Azure Event Hubs - Resource Manager exceptions
This article lists exceptions generated when interacting with Azure Event Hubs using Azure Resource Manager - via templates or direct calls.

> [!IMPORTANT]
> This document is frequently updated. Please check back for updates.

The following sections provide various exceptions/errors that are surfaced through Azure Resource Manager.

## Error code: Conflict

| Error code | Error subcode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Conflict | 40300 | The maximum number of resources of type EventHub has been reached or exceeded. Actual: #, Max allowed: # | The namespace has reached its [quota](event-hubs-quotas.md) for the number of Event Hubs it can contain. | Delete any unused or extraneous event hubs from the namespace or consider upgrading to a [dedicated cluster](event-hubs-dedicated-overview.md). |
| Conflict | none | Disaster recovery (DR) config can't be deleted because replication is in progress. Fail over or break pairing before attempting to delete the DR Config. | [GeoDR replication](event-hubs-geo-dr.md) is in progress, so the config can't be deleted at this time. | To unblock deletion of the config, either wait until replication has completed, trigger a failover, or break the GeoDR pairing. |
| Conflict | none | Namespace update failed with conflict in backend. | Another operation is currently being done on this namespace. | Wait until the current operation completes, and then retry. |

## Error code: 429

| Error code | Error subcode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| 429 | none | Namespace provisioning in transition | Another operation is currently being done on this namespace. | Wait until the current operation completes, and then retry. |
| 429 | none | Disaster recovery operation in progress. | A [GeoDR](event-hubs-geo-dr.md) operation is currently being done on this namespace or pairing. | Wait until the current GeoDR operation completes, and then retry. |

## Error code: BadRequest

| Error code | Error subcode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| BadRequest | 40000 | PartitionCount can't be changed for an event hub. | Basic or standard tier of Azure Event Hubs doesn't support changing partitions. | Create a new event hub with the wanted number of partitions in your basic or standard tier namespace. Partition scale-out is supported for [dedicated clusters](event-hubs-dedicated-overview.md). |
| BadRequest | 40000 | The value '#' for MessageRetentionInDays isn't valid for the Basic tier. the value can't exceed '1' day(s). | Basic tier Event Hubs namespaces only support message retention of up to 1 day. | If more than one day of message retention is wanted, [create a standard Event Hubs namespace](event-hubs-create.md). | 
| BadRequest | none | The specified name isn't available. | Namespace names must be unique, and the specified name is already taken. | If you're the owner of the existing namespace with the specified name, you can delete it, which will cause data loss. Then, try again with the same name. If the namespace isn't safe to delete (or you aren't the owner), choose another namespace name. |
| BadRequest | none | The specified subscription has reached its quota of namespaces. | Your subscription has reached the [quota](event-hubs-quotas.md) for the number of namespaces it can hold. | Consider deleting unused namespaces in this subscription, creating another subscription, or upgrading to a [dedicated cluster](event-hubs-dedicated-overview.md). |
| BadRequest | none | Can't update a namespace that is secondary | The namespace can't be updated because it's the secondary namespace in a [GeoDR pairing](event-hubs-geo-dr.md). | If appropriate, make the change to the primary namespace in this pairing instead. Otherwise break the GeoDR pairing to make the change. |
| BadRequest | none | Can't set Auto-Inflate in basic SKU | Auto-Inflate can't be enabled on basic tier Event Hubs namespaces. | To [enable Auto Inflate](event-hubs-auto-inflate.md) on a namespace, make sure it's of standard tier. |
| BadRequest | none | There isn't enough capacity to create the namespace. Contact your Event Hubs administrator. | The selected region is at capacity and more namespaces can't be created. | Select another region to house your namespace. |
| BadRequest | none | The operation can't be done on entity type 'ConsumerGroup' because the namespace 'namespace name' is using 'Basic' tier.  | Basic tier Event Hubs namespaces have a [quota]((event-hubs-quotas.md#event-hubs-basic-and-standard---quotas-and-limits) of one consumer group (the default). Creating more consumer groups isn't supported. | Continue using the default consumer group ($Default), or if more are needed, consider using a standard tier Event Hubs namespace instead. | 
| BadRequest | none | The namespace 'namespace name' doesn't exist. | The namespace provided couldn't be found. | Double check that the namespace name is correct and can be found in your subscription. If it isn't, [create an Event Hubs namespace](event-hubs-create.md). | 
| BadRequest | none | The location property of the resource doesn't match its containing Namespace. | Creating an event hub in a specific region failed because it didn't match the region of the namespace. | Try creating the event hub in the same region as the namespace. | 

## Error code: Internal server error

| Error code | Error subcode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Internal Server Error | none | Internal Server Error. | The Event Hubs service had an internal error. | Retry the failing operation. If the operation continues to fail, contact support. |