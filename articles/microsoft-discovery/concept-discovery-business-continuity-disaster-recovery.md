---
title: Business continuity and disaster recovery for Microsoft Discovery
description: Learn how Microsoft Discovery supports business continuity across Azure regions and how to plan replication and failover for customer-managed resources.
author: anzaman
ms.author: alzam
ms.service: azure
ms.date: 08/04/2026
ms.topic: concept-article
---

# Business continuity and disaster recovery for Microsoft Discovery

The Microsoft Discovery service uses a highly available, multiregion architecture to provide resilience against infrastructure and regional failures. It deploys all critical service components redundantly across multiple Azure regions, so it doesn't have single points of failure. You can maintain service availability during a regional outage.

If an Azure region becomes unavailable, you can keep working by accessing a secondary Microsoft Discovery deployment hosted in another Azure region. The service stays operational because it independently deploys compute, networking, and platform components in each region. You can redirect traffic to the secondary deployment, so customer operations continue while the primary region is unavailable.

Microsoft Discovery doesn't automatically replicate customer state between regional deployments. Each deployment operates independently unless you implement replication for your own stateful resources. As a result, investigation history, chat history, uploaded artifacts, and other persisted customer data that you create in the primary region aren't available in the secondary region.

## Recommended BCDR process

To enable business continuity during a regional outage, take the following steps:

1. **Have a secondary environment** available in a separate Azure region. The secondary deployment should mirror the primary deployment, including all Microsoft Discovery infrastructure, agents, tools, models, configurations, and any required integrations. For deployment instructions, see [**Quickstart: Deploy Microsoft Discovery infrastructure**](https://learn.microsoft.com/azure/microsoft-discovery/quickstart-infrastructure?tabs=portal).

    To support disaster recovery, configure the Azure Storage account as Geo-Redundant Storage (GRS) and share it between both deployments so that input and output files are available regardless of which region is active. Similarly, you can share a single Azure Container Registry (ACR) between both environments, but you should configure it with geo-replication to ensure that tool container images are available locally in each deployment region.

1. **Keep the secondary environment synchronized** with the primary environment by ensuring that configuration changes, agent definitions, tools, and application updates are deployed consistently to both regions.
1. **Establish an operational failover procedure.** During a regional outage, instruct users to access the Microsoft Discovery instance hosted in the secondary region. The service continues to operate from the secondary deployment, so users can keep creating new investigations and performing new work.
1. **Understand the data limitations.** Unless you replicate customer-managed stateful resources, historical investigation data, chat history, uploaded files, and other persisted state from the primary region aren't available in the secondary deployment during the outage. Any new data you create while operating in the secondary region stays in that region unless you implement replication or synchronization mechanisms. Input and output files are preserved if a single GRS blob storage is used for the primary and secondary environments.
4. **Protect customer data** by enabling appropriate Azure replication capabilities for all stateful resources. Geo-replication helps ensure that customer data is preserved during a regional outage and can be recovered when the primary region becomes available again.

## Recommended resources for geo-replication

Evaluate geo-replication for the following Azure resources used by your Microsoft Discovery deployment. This approach ensures that no data is lost during an outage and all data is available once the primary region is back up.

- **Azure Blob Storage** – Enable Geo-Redundant Storage (GRS), Read-Access Geo-Redundant Storage (RA-GRS), Geo-Zone-Redundant Storage (GZRS), or Read-Access Geo-Zone-Redundant Storage (RA-GZRS), as appropriate for recovery objectives.
- **Azure Container Registry (ACR)** – Configure geo-replication to ensure container images are available in all deployment regions.
- **Azure Key Vault** – Use Azure Key Vault backup and restore procedures or deploy regionally redundant Key Vaults as part of the disaster recovery strategy, ensuring that secrets, certificates, and keys required by the secondary deployment remain available.

By deploying Microsoft Discovery across multiple Azure regions and implementing geo-replication for all customer-managed stateful resources, your organization can achieve a resilient disaster recovery solution that maintains service availability while minimizing data loss during regional outages.
