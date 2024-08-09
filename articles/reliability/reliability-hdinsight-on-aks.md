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

Azure HDInsight on AKS supports availability zone by leveraging Azure Kubernetes Service's ability to create zone redundant node pools. You can select which availability zones to deploy the cluster pool and cluster during their creation. Once the cluster pool or cluster is created, you can't change the availability zones.

### Prerequisites

- Availability zones are only supported for cluster pool version >= `1.2` and cluster version >= `1.2.1`.
- Azure HDInsight on AKS only has one default SKU and it supports AZ as long as the Azure region has AZ support.

  Below regions don't support AZ:

  | Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
  |------------------|----------------------|---------------|--------------------|----------------|
  | West US          | Germany North        |               |                    |                |
- Some VM SKUs may not support all availability zones in a region. If you select those SKUs, HDInsight on AKS cluster pools or clusters don't support corresponding availability zones either.

### SLA improvements

There are no increased SLAs for Azure HDInsight on AKS clusters with availability zones enabled.

#### Create a resource with availability zone enabled

- Cluster Pools
  You can select one or more availability zones during cluster pool creation after you select the region.

- Clusters
  You can select one or more availability zones during cluster creation.

### Fault tolerance

To prepare for availability zone failure, it's recommended to over-provision capacity of service to ensure that your cluster can tolerate the loss of capacity from one availability zone down and continue to function without degraded performance during zone-wide outages. For instance, if you enable 3 availability zones, your cluster should tolerate 1/3 of the nodes down (round up to the nearest integer).

### Zone down experience

Azure HDInsight on AKS service is zone redundant. During a zone-wide outage, the customer should expect degradation of performance due to capacity drop. Customers can still create new cluster pools and clusters in the availability zones that are not impacted. Existing clusters can function with reduced capacity. Individual open source workloads recommendations and best practices are provided on the documentation. 

## Disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Azure HDInsight on AKS control plane service and databases are deployed across regions of Azure. Among these regions, the Azure HDInsight on AKS instances and database instances are isolated. When an outage at region level occurs, one region is down. All the resources in this region, including the RP (Resource Provider) of Azure HDInsight on AKS control plane, database of Azure HDInsight on AKS control plane and all customer clusters in this region. In this case, we can only wait for the regional outage to end. When the zonal outage is fully recovered, Azure HDInsight on AKS service is back and all customer clusters are back to normalcy. It's possible you may encounter some problems due to data inconsistency after the outage and may need a manual fix based on your application workloads.

### Multi-region disaster recovery

Azure HDInsight on AKS currently doesn't support cross-region failover. Improving business continuity using cross region high availability disaster recovery requires architectural designs of higher complexity and higher cost. Customers may choose to design their own solution to back up key data and job status across different regions.

#### Outage detection, notification, and management

- Use Azure monitoring tools on HDInsight on AKS to detect abnormal behavior in the cluster and set corresponding alert notifications. You can enable Log Analytics in various ways and use managed Prometheus service with Azure Grafana dashboards for monitoring. For more information, see [Azure Monitor integration](../hdinsight-aks/concept-azure-monitor-integration.md).  

- Subscribe to Azure health alerts to be notified about service issues, planned maintenance, health and security advisories for a subscription, service, or region. Health notifications that include the issue cause and resolute ETA help you to better execute failover and failbacks. For more information, see [Manage service health](../hdinsight-aks/service-health.md) and [Azure Service Health documentation](../service-health/index.yml).

### Single-region disaster recovery

Currently, Azure HDInsight on AKS only has one standard service offering and clusters are created in a single-region geography. Customers are responsible for diaster recovery settings based on the application requirements.

### Capacity and proactive disaster recovery resiliency

Azure HDInsight on AKS and its customers operate under the Shared responsibility model, which means that the customer must address disaster recovery requirements for the service they deploy and control. To ensure that recovery is proactive, customers should always predeploy secondaries because there's no guarantee of capacity at time of impact for those who haven't preallocated.

Unlike HDInsight, the Virtual Machines used in HDInsight on AKS clusters require the same Quota as Azure VMs. For more information, see [Capacity planning](../hdinsight-aks/virtual-machine-recommendation-capacity-planning.md#capacity-planning).

## Related content

To learn more about the items discussed in this article, see:

* [What is Azure HDInsight on AKS](../hdinsight-aks/overview.md)
* [Get started with one-click deployment](../hdinsight-aks/get-started.md)


* [Reliability for HDInsight](./reliability-hdinsight.md)
* [Reliability in Azure](./overview.md)
