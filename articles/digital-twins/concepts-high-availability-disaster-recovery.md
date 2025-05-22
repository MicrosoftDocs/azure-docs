---
title: Azure Digital Twins high availability and disaster recovery
titleSuffix: Azure Digital Twins
description: Learn about high availability and disaster recovery features for Azure Digital Twins.
author: baanders
ms.author: baanders
ms.date: 4/17/2025
ms.topic: conceptual
ms.service: azure-digital-twins
---

# Azure Digital Twins high availability and disaster recovery

This article discusses the High Availability (HA) and Disaster Recovery (DR) features for the Azure Digital Twins service, including intra-region HA and cross region DR. This article also explains how you can monitor your service health.

Considering business continuity and disaster recovery can help you create resilient IoT solutions, and designing for HA and DR can help you define and achieve appropriate uptime goals for your Azure Digital Twins solution.

Azure Digital Twins supports these features:
* *Intra-region HA* – Built-in redundancy to deliver on uptime of the service
* *Cross region DR* – Fail over to an Azure paired region if there's an unexpected data center failure

## Intra-region HA
 
Azure Digital Twins provides *intra-region HA* by implementing redundancies within the service. This functionality is reflected in the [service SLA](https://azure.microsoft.com/support/legal/sla/digital-twins) for uptime. The developers of an Azure Digital Twins solution can take advantage of these HA features without any extra work.

Although Azure Digital Twins offers a high uptime guarantee, transient failures are possible on any distributed computing platform. Appropriate retry policies should be built into the components interacting with your cloud application to handle these transient failures.

## Cross region DR

It's possible, although unlikely, for a data center to experience extended outages because of power failures or other events in the region. During a rare failure event like this, the intra-region HA capability previously described might not be sufficient. Azure Digital Twins addresses this scenario with Microsoft-initiated failover.

*Microsoft-initiated failover* is exercised in rare situations to fail over all the Azure Digital Twins instances from an affected region to the corresponding [paired region](../reliability/cross-region-replication-azure.md). This process is a default option and happens without any intervention from you, meaning that the customer data stored in Azure Digital Twins is replicated by default to the paired region. Microsoft reserves the right to make a determination of when this option is exercised, and this mechanism doesn't involve user consent before the user's instance is failed over.

If it's important for you to keep all data within certain geographical areas, check the location of the [paired region](../reliability/cross-region-replication-azure.md#azure-paired-regions) for the region where you're creating your instance, to ensure that it meets your data residency requirements. For regions with built-in data residency requirements, customer data is always kept within the same region.

>[!NOTE]
> Some Azure services provide another option called *customer-initiated failover*, which enables customers to initiate a failover just for their instance, such as to run a DR drill. Azure Digital Twins doesn't currently support this mechanism.
>
> Other Azure services provide an option for users to configure a different region for failover, as a way to meet data residency requirements. Azure Digital Twins doesn't support this capability. 

## Monitor service health

As Azure Digital Twins instances are failed over and recovered, you can monitor the process using the [Azure Service Health](/azure/service-health/service-health-overview) tool. Service Health tracks the health of your Azure services across different regions and subscriptions, and shares service-impacting communications about outages and downtimes.

During a failover event, Service Health can provide an indication of when your service is down, and when it's back up.

To view Service Health events...
1. Navigate to [Service Health](https://portal.azure.com/?feature.customportal=false#blade/Microsoft_Azure_Health/AzureHealthBrowseBlade/serviceIssues) in the Azure portal (you can use this link or search for it using the portal search bar).
1. Use the left menu to switch to the **Health history** page.
1. Look for an **Issue Name** beginning with **Azure Digital Twins**, and select it.

    :::image type="content" source="media/concepts-high-availability-disaster-recovery/navigate.png" alt-text="Screenshot of the Azure portal showing the 'Health History' page. An issue called 'Azure Digital Twins - West Europe - Mitigated' is highlighted." lightbox="media/concepts-high-availability-disaster-recovery/navigate.png":::

1. For general information about the outage, view the **Summary** tab.

    :::image type="content" source="media/concepts-high-availability-disaster-recovery/summary.png" alt-text="Screenshot of the Azure portal showing the 'Health History' page with the 'Summary' tab highlighted. The tab displays general information." lightbox="media/concepts-high-availability-disaster-recovery/summary.png":::
1. For more information and updates on the issue over time, view the **Issue updates** tab.

    :::image type="content" source="media/concepts-high-availability-disaster-recovery/issue-updates.png" alt-text="Screenshot of the Azure portal showing the 'Health History' page with the 'Issue updates' tab highlighted. The tab displays the status of entries." lightbox="media/concepts-high-availability-disaster-recovery/issue-updates.png":::

The information displayed in this tool isn't specific to one Azure Digital Twins instance. After using Service Health to understand what's going with the Azure Digital Twins service in a certain region or subscription, you can take monitoring a step further by using [Azure Resource Health](how-to-monitor-resource-health.md) to drill down into specific instances and see whether they're affected.

## Next steps 

Read about general best practices for HA/DR in these Azure articles: 
* [Design review checklist for Reliability](/azure/architecture/framework/resiliency/app-design) describes a general framework to help you think about business continuity and disaster recovery. 
* [Recommendations for designing a disaster recovery strategy](/azure/architecture/framework/resiliency/backup-and-recovery) provides architecture guidance on strategies for Azure applications to achieve High Availability (HA) and Disaster Recovery (DR).
