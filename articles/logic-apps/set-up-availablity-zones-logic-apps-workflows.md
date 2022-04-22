---
title: Set up availability zones for workflow environments
description: For disaster recovery and redundancy, set up availability zones when you create Consumption logic app workflows using multi-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, shahparth, laveeshb, azla
ms.topic: how-to
ms.date: 05/02/2022
ms.custom:
#Customer intent: As a developer, I want to set up protection against regional failures by enabling availability zones for workflows running in Azure Logic Apps.
---

# Protect against failures in Azure regions by setting up availability zones for Consumption logic app workflows (preview)

In each Azure region, *availability zones* are physically separate locations that are tolerant to local failures. Such failures can range from software and hardware failures to events such as earthquakes, floods, and fires. These zones achieve tolerance through the redundancy and logical isolation of Azure services. To provide resiliency and distributed availability, at least three separate availability zones exist in all regions that enable these zones. For more information about availability zones, review [Azure regions and availability zones](../availability-zones/az-overview.md).

In this preview, Azure Logic Apps supports availability zones for Consumption logic app workflows that run in multi-tenant Azure Logic Apps. Currently, you can only enable this functionality when you create your Consumption logic app. After you finish the creation steps, the platform distributes workloads across all three zones without any other setup. Eventually, availability Zone support will be automatically enabled for all existing Consumption logic apps without any other required setup. The Azure Logic Apps platform handles zone distribution. 

Workflow executions are distributed across three zones in any Azure region that's set up with availability zones. This capability is a key requirement for enabling resilient architectures and providing high availability if datacenter failures happen in a region.

## Considerations

* Currently, availability zones are available only in the following regions: Australia East, Brazil South, Canada Central, and France Central

* You can enable availability zones only when you create a Consumption logic app using the Azure portal. You can't enable this functionality for existing logic apps. These opt-in steps are available only specific window.

* Starting May 15, 2022, existing logic app workflows aren't affected.

* 

## Prerequisites

To support the new zones, we will add new inbound and outbound IP addresses for Azure Logic Apps. If you have firewall configurations that allow communication with these Azure Logic Apps IP addresses, you will have to add the new addresses, which will be described in the documentation, Limits and configuration reference for Azure Logic Apps.

## Set up availability zones for new Consumption logic app workflows

1. In the Azure portal, start the process to create a new Consumption logic app.

1. 

## Next steps