---
# Mandatory fields.
title: High availability and disaster recovery
titleSuffix: Azure Digital Twins
description: Describes the Azure and Azure Digital Twins features that help you to build highly available Azure IoT solutions with disaster recovery capabilities.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/14/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins high availability and disaster recovery

A key area of consideration for resilient IoT solutions is business continuity and disaster recovery. Designing for **High Availability (HA)** and **Disaster Recovery (DR)** can help you define and achieve appropriate uptime goals for your solution.

This article discusses the HA and DR features offered specifically by the Azure Digital Twins service.

Azure Digital Twins supports these feature options:
* *Intra-region HA* – Built-in redundancy to deliver on uptime of the service
* *Cross region DR* – Failover to a geo-paired Azure region in the case of an unexpected data center failure

You can also see the [*Best practices*](#best-practices) section for general Azure guidance about designing for HA/DR.

## Intra-region HA
 
Azure Digital Twins provides intra-region HA by implementing redundancies within the service. This is reflected in the SLA for uptime. **No additional work is required by the developers of an Azure Digital Twins solution to take advantage of these HA features.** Although Azure Digital Twins offers a reasonably high uptime guarantee, transient failures can still be expected, as with any distributed computing platform. Appropriate retry policies should be built in to the components interacting with a cloud application to deal with transient failures.

## Cross region DR

There could be some rare situations when a data center experiences extended outages due to power failures or other events in the region. Such events are rare, and during such failures, the intra region HA capability described above may not help. Azure Digital Twins addresses this with Microsoft-initiated failover.

**Microsoft-initiated failover** is exercised by Microsoft in rare situations to failover all the Azure Digital Twins instances from an affected region to the corresponding geo-paired region. This process is a default option (with no way for users to opt out), and requires no intervention from the user. Microsoft reserves the right to make a determination of when this option will be exercised. This mechanism doesn't involve a user consent before the user's instance is failed over.

>[!NOTE]
> Some Azure services also provide an additional option called **customer-initiated failover**, which enables customers to initiate a failover just for their instance, such as to run a DR drill. This mechanism is currently **not supported** by Azure Digital Twins. 

## Best practices

For best practices on HA/DR, see the following Azure guidance on this topic: 
* The article [*Azure Business Continuity Technical Guidance*](/azure/architecture/framework/resiliency/overview) describes a general framework to help you think about business continuity and disaster recovery. 
* The [*Disaster recovery and high availability for Azure applications*](/azure/architecture/framework/resiliency/backup-and-recovery) paper provides architecture guidance on strategies for Azure applications to achieve High Availability (HA) and Disaster Recovery (DR).

## Next steps 

Read more about getting started with Azure Digital Twins solutions:
 
* [*What is Azure Digital Twins?*](overview.md)
* [*Quickstart: Explore a sample scenario*](quickstart-adt-explorer.md)