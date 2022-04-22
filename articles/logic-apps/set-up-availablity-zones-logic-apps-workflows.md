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

In each Azure region, *availability zones* are physically separate locations that are tolerant to local failures. Such failures can range from software and hardware failures to events such as earthquakes, floods, and fires. These zones achieve tolerance through the redundancy and logical isolation of Azure services.

To provide resiliency and distributed availability, at least three separate availability zones exist in any Azure region that supports and enables these zones. The Azure Logic Apps platform distributes these zones and logic app workloads across these zones. This capability is a key requirement for enabling resilient architectures and providing high availability if datacenter failures happen in a region. For more information about availability zones, review [Azure regions and availability zones](../availability-zones/az-overview.md).

This article provides a brief overview about how availability zones work in Azure Logic Apps, considerations for using availability zones, and how to enable this capability for your logic app.

## Considerations

* During public preview, Azure Logic Apps supports availability zones *only for new Consumption logic app workflows* that run in multi-tenant Azure Logic Apps. You can enable this capability *only when you create* a Consumption logic app using the Azure portal. You have the option to enable this capability only for a limited time.

* Currently, you can enable availability zones only for the following Azure regions: Australia East, Brazil South, Canada Central, and France Central.

* You can't enable availability zones for already existing Consumption logic app workflows. Until mid-May 2022, existing Consumption logic app workflows are unaffected by availability zones. However, starting mid-May 2022, existing Consumption logic app workflows gradually move to using availability zones in phases based on Azure region.

* New IP addresses that support availability zones are now available for Azure Logic Apps, managed connectors, and custom connectors. If you have a firewall or restricted environment, you have to allow traffic to pass through these IP addresses used by Azure Logic Apps, managed connectors, and custom connectors.

## Prerequisites

* 

## Set up availability zones for new Consumption logic app workflows

1. In the Azure portal, start the process to create a new Consumption logic app.

1. 

## Next steps