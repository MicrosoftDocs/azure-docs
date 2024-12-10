---
title: References - How to collect call info
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to collect call info.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 05/22/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# How to collect call info
When you report an issue, providing important call information can help us quickly locate the problematic area and gain a deeper understanding of the issue.

* ACS resource ID
* call ID
* participant ID

## How to get ACS resource ID

You can get this information from [https://portal.azure.com](https://portal.azure.com).

:::image type="content" source="./media/get-azure-communication-services-resource-id.png" alt-text="Screenshot of getting ACS resource ID." lightbox="./media/get-azure-communication-services-resource-id.png":::

## How to get call ID and participant ID
The participant ID is important when there are multiple users in the same call.
```typescript
// call ID
call.id
// local participant ID
call.info.participantId

```



