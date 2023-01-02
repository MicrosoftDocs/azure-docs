---
title: Azure status overview | Microsoft Docs
description: A global view into the health of Azure services
ms.topic: overview
ms.date: 05/26/2022

---
# Azure status overview

[Azure status](https://azure.status.microsoft/) provides you with a global view of the health of Azure services and regions. With Azure status, you can get information on service availability. Azure status is available to everyone to view all services that report their service health, as well as incidents with wide-ranging impact. If you're a current Azure user, however, we strongly encourage you to use the personalized experience in [Azure Service Health](https://aka.ms/azureservicehealth). Azure Service Health includes all outages, upcoming planned maintenance activities, and service advisories.

:::image type="content" source="./media/azure-status-overview/azure-status.PNG" alt-text="Screenshot of top level Azure Status page.":::

This experience was updated on July 25, 2022.  For more information, see [What's New in Azure Service Health](whats-new.md#azure-service-health-portal-experience-update) 

## Azure status updates

The Azure status page gets updated in real time as the health of Azure services change. If you leave the Azure status page open, you can control the rate at which the page refreshes with new data. At the top, you can see the last time the page was updated.

:::image type="content" source="./media/azure-status-overview/update.PNG" alt-text="Screenshot of Azure status refresh page.":::

## Azure status banner

The status banner on the Azure Status page highlights active incidents affecting Azure services.

:::image type="content" source="./media/azure-status-overview/banner.png" alt-text="Screenshot of Azure status banner example":::

## Current Impact tab

Azure status page shows the current impact of an active event on the entirety of Azure. Use [Azure Service Health](service-health-overview.md) to see view other issues that may be impacting your services.  

:::image type="content" source="./media/azure-status-overview/current-impact.png" alt-text="Screenshot of Azure status current impact tab":::

## Azure status history

While the Azure status page always shows the latest health information, you can view older events using the Azure status history page. The history page contains all RCAs for incidents that occurred on November 20th, 2019 or later.  RCAs prior to November 20th, 2019 are not available. From this point forward, the history page will show RCAs up to five years old. 

:::image type="content" source="./media/azure-status-overview/status-history.png" alt-text="Screenshot of Azure status history page":::

## RSS Feed

Azure status also provides [an RSS feed](https://azure.status.microsoft/status/feed/) of changes to the health of Azure services that you can subscribe to.

## When does Azure publish communications to the Status page?
 
Most of our service issue communications are provided as targeted notifications sent directly to impacted customers & partners. These are delivered through [Azure Service Health](https://azure.microsoft.com/features/service-health/) in the Azure portal and trigger any [Azure Service Health alerts](./alerts-activity-log-service-notifications-portal.md?toc=%2fazure%2fservice-health%2ftoc.json) that have been configured. The public Status page is only used to communicate about service issues under three specific scenarios:

- **Scenario 1 - Broad impact involving multiple regions, zones, or services** - A service issue has broad/significant customer impact across multiple services for a full region or multiple regions. We notify you in this case because customer-configured resilience like high availability and/or disaster recovery may not be sufficient to avoid impact.
- **Scenario 2 - Azure portal / Service Health not accessible** - A service issue impedes you from accessing the Azure portal or Azure Service Health and thus impacted our standard outage communications path described earlier. 
- **Scenario 3 - Service Impact, but not sure who exactly is affected yet** - The service issue has broad/significant customer impact but we aren't yet able to confirm which customers, regions, or services are affected. In this case, we aren't able to send targeted communications, so we provide public updates.
 
## When does Azure publish RCAs to the Status History page?

While the [Azure status page](https://azure.status.microsoft/status) always shows the latest health information, you can view older events using the [Azure status history page](https://azure.status.microsoft/status/history/). The history page contains all RCAs (Root Cause Analyses) for incidents that occurred on November 20, 2019 or later and will - from that date forward - provide a 5-year RCA history. RCAs prior to November 20, 2019 aren't available.
 
After June 1st 2022, the [Azure status history page](https://azure.status.microsoft/status/history/) will only be used to provide RCAs for scenario 1 above. We're committed to publishing RCAs publicly for service issues that had the broadest impact, such as those with both a multi-service and multi-region impact. We publish to ensure that all customers and the industry at large can learn from our retrospectives on these issues, and understand what steps we're taking to make such issues less likely and/or less impactful in future. 
 
For scenarios 2 and 3 above - We may communicate publicly on the Status page during impact to work around when our standard, targeted communications aren't able to reach all impacted customers. After the issue is mitigated, we'll conduct a thorough impact analysis to determine exactly which customer subscriptions were impacted. In such scenarios, we'll provide the relevant PIR only to affected customers via [Azure Service Health](https://azure.microsoft.com/features/service-health/) in the Azure portal.


## Next Steps

* Learn how you can get a more personalized view into Azure health with [Service Health](./service-health-overview.md).
* Learn how you can get a more granular view into the health of your specific Azure resources with [Resource Health](./resource-health-overview.md).