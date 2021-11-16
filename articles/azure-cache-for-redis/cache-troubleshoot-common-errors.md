---
title: Troubleshoot common errors using Azure Cache for Redis
titleSuffix: Azure Cache for Redis
description: Learn how to resolve some common problems when using Azure Cache for Redis.
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual 
ms.date: 11/20/2021
ms.custom: template-concept
---

# Other common issues

In this article, we provide some guidance for Azure Cache for Redis problems that don't fall into other, more specific, troubleshooting areas.

## Why am I seeing "Cache is busy processing a previous update request or is undergoing system maintenance. As such, it is currently unable to accept the update request. Please try again later."

This message indicates that a management operation, like scaling or patching, is in progress on your cache. All other management operations are blocked until the ongoing operation is completed. During this time, you can expect your Azure Cache For Redis to be fully functional for client operations.

## Why is my cache in "Failed" state?

Azure Cache For Redis can end up in a *Failed* state if a management operation fails. Despite this state, you can expect your Azure Cache For Redis to be fully functional for client operations. <!-- Where is failed indicated? -->

<!-- Under both these conditions, there is no action to take? -->

## Next steps
<!-- 
Add a context sentence for the following links
Add at 2-3 links
 -->
