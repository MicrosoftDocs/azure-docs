---
title: Enable disaster recovery for an existing Azure Notification Hubs namespace
description: Learn how to enable disaster recovery or change the disaster recovery region for an existing Azure Notification Hubs namespace in the Azure portal.
services: notification-hubs
author: sethmanheim
ms.author: sethm
ms.date: 08/20/2026
ms.topic: how-to
ms.service: azure-notification-hubs
---

# Enable disaster recovery for an existing Azure Notification Hubs namespace

This article shows how to enable disaster recovery or change the disaster recovery region for an existing Azure Notification Hubs namespace by using the Azure portal.

For reliability concepts, including availability zones and region-wide failure guidance, see [Reliability in Azure Notification Hubs](/azure/reliability/reliability-notification-hubs?toc=/azure/notification-hubs/toc.json).

## Prerequisites

- An existing Azure Notification Hubs namespace.
- Access to the [Azure portal](https://portal.azure.com) with permission to update the namespace.

## Enable disaster recovery on an existing namespace

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open any notification hub in the target Azure Notification Hubs namespace. The disaster recovery setting is configured from the hub, but it applies to the entire namespace.
1. In the resource menu, select **Overview**.
1. Select **Recovery region**.
1. On the **Edit Disaster Recovery** pane, select **Enable disaster recovery**.
1. Choose one of these options for the region you want to use for disaster recovery:

   - **Paired recovery region**
   - **Flexible recovery region**

1. If you selected **Flexible recovery region**, select a recovery region from the list.
1. Select **Save**.

## Verify your configuration

When the update finishes:

- Check that disaster recovery is enabled.
- Check that the selected recovery region appears in the hub's settings.

## Important considerations

- Disaster recovery for Azure Notification Hubs replicates namespace metadata. It doesn't replicate registration data.
- Microsoft manages the failover process.
- Your primary region and current platform support determine the recovery region options.

## Next steps

- Review [Reliability in Azure Notification Hubs](/azure/reliability/reliability-notification-hubs?toc=/azure/notification-hubs/toc.json).
- If needed, review the namespace creation steps in [Create an Azure notification hub in the Azure portal](create-notification-hub-portal.md).
