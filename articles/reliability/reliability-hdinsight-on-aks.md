---
title: Reliability in Azure HDInsight on Azure Kubernetes Service
description: Find out about reliability in Azure HDInsight on Azure Kubernetes Service.
author: fengzhou-msft
ms.author: fenzhou
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: hdinsight-aks
ms.date: 04/15/2024
CustomerIntent: As a cloud architect/engineer, I want to understand reliability support for Azure HDInsight on Azure Kubernetes Service so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure HDInsight on Azure Kubernetes Service

This article describes reliability support in [Azure HDInsight on Azure Kubernetes Service (AKS)](../hdinsight-aks/overview.md), and covers both [specific reliability recommendations](#reliability-recommendations) and [disaster recovery and business continuity](#disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]

### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| Availability |:::image type="icon" source="media/icon-recommendation-medium.svg":::| [Default and minimum virtual machine size recommendations](../hdinsight-aks/virtual-machine-recommendation-capacity-planning.md#clusters) |
|  |:::image type="icon" source="media/icon-recommendation-low.svg":::| [Auto Scale HDInsight on AKS Clusters](../hdinsight-aks/hdinsight-on-aks-autoscale-clusters.md) |
| Monitoring |:::image type="icon" source="media/icon-recommendation-low.svg"::: |[How to integrate with Log Analytics](../hdinsight-aks/how-to-azure-monitor-integration.md) |
| |:::image type="icon" source="media/icon-recommendation-low.svg"::: |[Monitoring with Azure Managed Prometheus and Grafana](../hdinsight-aks/monitor-with-prometheus-grafana.md) |
| Security |:::image type="icon" source="media/icon-recommendation-low.svg":::| [Use NSG to restrict traffic to HDInsight on AKS](../hdinsight-aks/secure-traffic-by-nsg.md) |

## Availability zone support

[!INCLUDE [next step](includes/reliability-availability-zone-description-include.md)]

Currently, Azure HDInsight on AKS doesn't support availability zone in its service offerings.

## Disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Currently, Azure HDInsight on AKS CP(Control Plane) service and databases are deployed across regions of Azure. Among these regions, the Azure HDInsight on AKS instances and database instances are isolated. When an outage at region level occurs, one region is down. All the resources in this region, including the RP(Resource Provider) of Azure HDInsight on AKS CP, database of Azure HDInsight on AKS CP and all customer clusters in this region. In this case, we can only wait for the regional outage to end. When the outage is recovered, the Azure HDInsight on AKS service is back and all customer clusters are back, too. It's possible that there may be some problems due to data inconsistency after the outage and needs a manual fix.

### Multi-region disaster recovery

Azure HDInsight on AKS currently doesn't support cross-region failover. Improving business continuity using cross region high availability disaster recovery requires architectural designs of higher complexity and higher cost. Customers may choose to design their own solution to back up key data and job status across different regions.

#### Outage detection, notification, and management

- Use Azure monitoring tools on HDInsight on AKS to detect abnormal behavior in the cluster and set corresponding alert notifications. You can enable Log Analytics in various ways and use managed Prometheus service with Azure Grafana dashboards for monitoring. For more information, see [Azure Monitor integration](../hdinsight-aks/concept-azure-monitor-integration.md).  

- Subscribe to Azure health alerts to be notified about service issues, planned maintenance, health and security advisories for a subscription, service, or region. Health notifications that include the issue cause and resolute ETA help you to better execute failover and failbacks. For more information, see [Manage service health](../hdinsight-aks/service-health.md) and [Azure Service Health documentation](../service-health/index.yml).

### Single-region disaster recovery

Currently, Azure HDInsight on AKS only has one standard service offering and clusters are created in a single-region geography. Customers are responsible for diaster recovery.

### Capacity and proactive disaster recovery resiliency

Azure HDInsight on AKS and its customers operate under the Shared responsibility model, which means that the customer must address DR for the service they deploy and control. To ensure that recovery is proactive, customers should always predeploy secondaries because there's no guarantee of capacity at time of impact for those who haven't preallocated.

Unlike the original version of HDInsight, the Virtual Machines used in HDInsight on AKS clusters require the same Quota as Azure VMs. For more information, see [Capacity planning](../hdinsight-aks/virtual-machine-recommendation-capacity-planning.md#capacity-planning).

## Related content

To learn more about the items discussed in this article, see:

* [What is Azure HDInsight on AKS](../hdinsight-aks/overview.md)
* [Get started with one-click deployment](../hdinsight-aks/get-started.md)


* [Reliability for HDInsight](./reliability-hdinsight.md)
* [Reliability in Azure](./overview.md)
