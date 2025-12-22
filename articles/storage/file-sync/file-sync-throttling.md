---
title: Azure File Sync Throttling Limits
description: Understand how Azure File Sync implements throttling on key APIs for individual resources and within a storage sync service.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 10/21/2025
ms.author: kendownie
# Customer intent: "As an IT administrator, I want to understand Azure File Sync throttling behavior so I can avoid throttling and maintain optimal performance for my file shares."
---

# Understand Azure File Sync throttling

Azure File Sync now implements throttling on key APIs. This article explains how throttling works for Azure File Sync, and lists the throttling limits.

## Azure Resource Manager (ARM) throttling behavior

Azure Resource Manager [implements throttling](/azure/azure-resource-manager/management/request-limits-and-throttling) at two levels: subscription and tenant. If requests are within the limits for these levels, they are routed to the resource provider.

## Azure File Sync throttling behavior

Azure File Sync uses the Microsoft.StorageSync resource provider, which applies its own throttling limits.

Azure File Sync enforces throttling in two ways:

- **At the scope of individual resource types**, such as storage sync service, registered server, sync group, cloud endpoint, or server endpoint. If too many operations are performed on a specific resource such as a server endpoint, further actions on that resource are temporarily blocked until the enforcement period expires.

- **Using the storage sync service resource as a scope.** Excessive operations across resources within a storage sync service will result in a temporary block on all resources under that service until the enforcement period expires.

## Per-resource limits

The following table lists the per-resource limits for Azure File Sync.

| Operation type                              | Examples                                                                 | Limit | Enforcement length | Refill rate      |
|---------------------------------------------|--------------------------------------------------------------------------|-------|-------------------|------------------|
| PUT requests                               | Creating a server endpoint                                               | 12    | 3 minutes         | 4 tokens/min     |
| PATCH requests                             | Enabling/disabling tiering on a server endpoint, or updating tiering policies | 12    | 3 minutes         | 4 tokens/min     |
| DELETE requests                            | Deleting a server endpoint                                               | 12    | 3 minutes         | 4 tokens/min     |
| GET requests                               | Browsing a server endpoint resource in the Azure portal                  | 400   | 3 minutes         | ~2 tokens/s      |
| GET list requests                          | Browsing the list of server endpoints under a sync group in the Azure portal | 1,800  | 3 minutes         | ~10 tokens/s     |

## Storage sync service limits

The following table lists the per-storage sync service limits for Azure File Sync.

| Operation type   | Examples                                              | Threshold | Enforcement length | Refill rate         |
|------------------|------------------------------------------------------|-----------|--------------------|---------------------|
| PUT requests     | Creating resources under a storage sync service       | 450       | 3 minutes          | 25 tokens per 10s   |
| PATCH requests   | Updating resources under a storage sync service       | 450       | 3 minutes          | 25 tokens per 10s   |
| DELETE requests  | Deleting resources under a storage sync service       | 450       | 3 minutes          | 25 tokens per 10s   |
| GET requests     | Getting individual resources under a storage sync service | 10,000    | 3 minutes          | ~55 tokens/s        |
| GET list requests| Getting lists of resources by resource type under a storage sync service | 12,000    | 3 minutes          | ~66 tokens/s        |

## Frequently asked questions about throttling

The following are common questions about throttling in Azure File Sync.

### What's the reasoning behind these limits?

Most customers only run a few PUT/PATCH/DELETE operations at a time, such as setting up resources or adjusting settings. That’s why limits on actions like creating, updating, or deleting resources are set fairly low.

### Do I need to worry about day-to-day operations like browsing and reading files?

You can freely browse and read your resources in the Azure portal or programmatically. The limits for GET and GET list operations are generous, so you shouldn’t run into issues during normal use.

### What happens if you hit a throttling limit?

If you reach a throttling limit, further actions on that resource or within that storage sync service will be temporarily paused. Once the enforcement period ends, you can continue as normal.
