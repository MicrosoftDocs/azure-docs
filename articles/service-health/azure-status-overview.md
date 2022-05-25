---
title: Azure status overview | Microsoft Docs
description: A global view into the health of Azure services
ms.topic: overview
ms.date: 05/26/2022

---
# Azure status overview

[Azure status](https://status.azure.com/status/) provides you with a global view of the health of Azure services and regions. With Azure status, you can get information on service availability. Azure status is available to everyone to view all services that report their service health, as well as incidents with wide-ranging impact. If you're a current Azure user, however, we strongly encourage you to use the personalized experience in [Azure Service Health](https://aka.ms/azureservicehealth). Azure Service Health includes all outages, upcoming planned maintenance activities, and service advisories.

![Azure status page](./media/azure-status-overview/azure-status.PNG)

## Azure status updates

The Azure status page gets updated in real time as the health of Azure services change. If you leave the Azure status page open, you can control the rate at which the page refreshes with new data. At the top, you can see the last time the page was updated.

![Azure status refresh](./media/azure-status-overview/update.PNG)

## RSS Feed

Azure status also provides [an RSS feed](https://status.azure.com/status/feed/) of changes to the health of Azure services that you can subscribe to.

## When does Azure publish communications to the Status page?
 
Most of our service issue communications are provided as targeted notifications sent directly to impacted customers & partners. These are delivered through [Azure Service Health](https://azure.microsoft.com/features/service-health/) in the Azure portal and trigger any [Azure Service Health alerts](/azure/service-health/alerts-activity-log-service-notifications-portal?toc=%2Fazure%2Fservice-health%2Ftoc.json) that have been configured. The public Status page is only used to communicate about service issues under three specific scenarios:

- **Scenario 1 - Broad impact involving multiple regions, zones, or services** - A service issue has broad/significant customer impact across multiple services for a full region or multiple regions. We notify you in this case because customer-configured resilience like high availability and/or disaster recovery may not be sufficient to avoid impact.
- **Scenario 2 - Azure portal / Service Health not accessible** - A service issue impedes you from accessing the Azure portal or Azure Service Health and thus impacted our standard outage communications path described earlier. 
- **Scanario 3 - Service Impact, but not sure who exactly is affected yet** - The service issue has broad/significant customer impact but we are not yet able to confirm which customers, regions, or services are affected. In this case we are not able to send targeted communications, so we provide public updates.
 
## When does Azure publish RCAs to the Status History page?

While the [Azure status page](https://status.azure.com/status) always shows the latest health information, you can view older events using the [Azure status history page](https://status.azure.com/status/history/). The history page contains all RCAs (Root Cause Analysis) for incidents that occurred on November 20th, 2019 or later and will - from that date forward - provide a 5-year RCA history. RCAs prior to November 20th, 2019 are not available.
 
After June 1st 2022, the [Azure status history page](https://status.azure.com/status/history/) will only be used to provide RCAs for scenario 1 above. We are committed to publishing RCAs publicly for service issues that had the broadest impact, such as those with both a multi-service and multi-region impact. We do this to ensure that all customers and the industry at large can learn from our retrospectives on these issues, and understand what steps we are taking to make such issues less likely and/or less impactful in future. 
 
For scenarios 2 and 3 above - We may communicate publicly on the Status page during impact to workaround when our standard, targeted communications are not able to reach all impacted customers. After the issue is mitigated, we will conduct a thorough impact analysis to determine exactly which customer subscriptions were impacted. In such scenarios, we will provide the relevant PIR only to affected customers via [Azure Service Health](https://azure.microsoft.com/features/service-health/) in the Azure portal.


## Next Steps

* Learn how you can get a more personalized view into Azure health with [Service Health](./service-health-overview.md).
* Learn how you can get a more granular view into the health of your specific Azure resources with [Resource Health](./resource-health-overview.md).
