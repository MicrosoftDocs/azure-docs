---
title: Azure status overview | Microsoft Docs
description: A global view into the health of Azure services
ms.topic: overview
ms.date: 05/23/2022

---
# Azure status overview

[Azure status](https://status.azure.com/status/) provides you with a global view of the health of Azure services and regions. With Azure status, you can get information on service availability. Azure status is available to everyone to view all services that report their service health, as well as incidents with wide-ranging impact. If you're a current Azure user, however, we strongly encourage you to use the personalized experience in [Azure Service Health](https://aka.ms/azureservicehealth). Azure Service Health includes all outages, upcoming planned maintenance activities, and service advisories.

![Azure status page](./media/azure-status-overview/azure-status.PNG)

## Azure status updates

The Azure status page gets updated in real time as the health of Azure services change. If you leave the Azure status page open, you can control the rate at which the page refreshes with new data. At the top, you can see the last time the page was updated.

![Azure status refresh](./media/azure-status-overview/update.PNG)

## Azure status history

While the Azure status page always shows the latest health information, you can view older events using the [Azure status history page](https://status.azure.com/status/history/). The history page contains all RCAs for incidents that occurred on November 20th, 2019 or later and will - from that date forward - provide a 5-year RCA history. RCAs prior to November 20th, 2019 are not available.

## RSS Feed

Azure status also provides [an RSS feed](https://status.azure.com/status/feed/) of changes to the health of Azure services that you can subscribe to.

## When does Azure publish communications to the Status page?
 
Most of our service issue communications are provided as targeted notifications sent directly to impacted customers & partners. These are delivered through Azure Service Health in the Azure portal and trigger any Azure Service Health alerts that have been configured. The public Status page is only used to communicate about service issues under three specific scenarios:

- If we have evidence that a service issue has broad/significant customer impact across multiple services for a full region or multiple regions. We notify you because in such cases customer-configured resilience like high availability and/or disaster recovery may not be sufficient to avoid impact.
- If we have evidence that a service issue has impacted our standard outage communications path described above - that is, if the issue impedes our customers and partners from accessing the Azure portal or Azure Service Health.
- If we have evidence that a service issue has broad/significant customer impact but we are not yet able to confirm which customers, regions, or services are affected. In this case we are not able to send targeted communications, so we provide public updates.
 
## When does Azure publish Post-Incident Reviews (PIRs) to the Status History page?
 
After June 1st 2022, the Status history page will only be used to provide Post Incident Reviews (PIRs) for the first scenario above. We are committed to publishing PIRs publicly for service issues that had the broadest impact, such as a multi-service, and multi-region issues. We do this to ensure that all customers and the industry at large can learn from our retrospectives on these issues, and understand what steps we are taking to make such issues less likely and/or less impactful in future. 
 
For scenarios 2 and 3 above - We may communicate publicly on the Status page during impact to workaround when our standard, targeted communications are not able to reach all impacted customers. After the issue is mitigated, we will conduct a thorough impact analysis to determine exactly which customer subscriptions were impacted. In such scenarios, we will provide the relevant PIR only to affected customers via Azure Service Health in the Azure portal.


## Next Steps

* Learn how you can get a more personalized view into Azure health with [Service Health](./service-health-overview.md).
* Learn how you can get a more granular view into the health of your specific Azure resources with [Resource Health](./resource-health-overview.md).
