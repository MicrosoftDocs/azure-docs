---
ROBOTS: NOINDEX
title: Analyze Azure CDN usage patterns
description: This article describes the different types of analysis reports available for Azure CDN products.
services: cdn
author: halkazwini
ms.author: halkazwini
manager: KumudD
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/31/2025
---

# Analyze Azure CDN usage patterns

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

After you enable CDN for your application, you can monitor CDN usage, check the health of your delivery, and troubleshoot potential issues. Azure CDN provides these capabilities in the following ways:

## Raw logs for Azure CDN from Microsoft

With a Standard Microsoft profile, you can enable raw logs and select to stream logs to:

- Azure Storage
- Event hubs
- Azure Log Analytics

With Azure Log Analytics you can view monitoring metrics, and set up alerts.

For more information, see [Azure CDN HTTP raw logs](monitoring-and-access-log.md).

## Core analytics via Azure diagnostic logs

Core analytics is available for content delivery network endpoints for all pricing tiers. Azure Diagnostics logs allow core analytics to be exported to Azure Storage, Event Hubs, or Azure Monitor logs. Azure Monitor logs offers a solution with graphs that are user-configurable and customizable. For more information about Azure diagnostic logs, see [Azure diagnostic logs](cdn-azure-diagnostic-logs.md).

## Next steps

In this article, you learned about the different options for analysis reports for Azure CDN.

For more information on Azure CDN and the other Azure services mentioned in this article, see:

- [What is Azure Content Delivery Network?](cdn-overview.md)
- [Azure Content Delivery Network HTTP raw logs](monitoring-and-access-log.md)
