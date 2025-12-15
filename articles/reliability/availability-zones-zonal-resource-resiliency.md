---
title: Zonal Resources and Zone Resiliency
description: Learn about zonal deployment scenarios, when to use them, and your responsibilities for making them resilient to availability zone outages in Azure.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: concept-article
ms.date: 11/20/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# Zonal resources and zone resiliency

In Azure, a *zonal* resource is a resource that's pinned to a single zone. Because a zonal resource is in a single availability zone, it isn't zone resilient. If the zone that contains the resource has a problem, the resource is likely to experience downtime.

Some Azure services either require or allow you to deploy zonal resources. You might choose to deploy a resource zonally because of latency considerations or specific service requirements. You might pin individual resources or sets of related resources to a single zone.

This article outlines scenarios where you might choose to deploy zonal resources instead of zone-redundant resources. It also highlights the considerations and responsibilities required to ensure that your solution remains resilient to zone outages.

## Resource deployment types

In Azure, only some deployment types provide zone resiliency. The following table compares three resource deployment types and describes their zone resiliency, zone distribution, configuration options, and recommendations.

| Resource deployment type | Zone resiliency support | Zone distribution | How to configure | Recommendation |
|---|---|---|---|---|
| **Zone-redundant** | Always zone-resilient | Zone-redundant resources are spread across multiple zones and are resilient to zone failures. If a failure occurs in one zone, the service can continue to operate in other zones. | Some zone-redundant resources provide automatic zone redundancy across availability zones, while other resources require you to manually enable zone redundancy. Check your service's [reliability guidance](./overview-reliability-guidance.md) to see what your service requires to enable resiliency. | Always use zone-redundant resources where possible, especially in production deployments. |
| **Zonal** | Not automatic. It's your responsibility to enable zone resiliency if you choose. <br> Zonal resources are isolated from faults in other zones, but a failure of their own zone can cause downtime. | You select the zone for the resource. | If you have multiple resources that need to be *zone-aligned* (placed in the same zone), you must configure the same zone on *each* resource. | Only use zonal resources when there's a [clear need](#when-to-use-a-zonal-deployment). To make your solution zone-resilient, it's your responsibility to design and implement a multiple-zone solution. |
| **Nonzonal (regional)** | None | If the region provides availability zone support, Azure might use any zone in the region. | There's no zone configuration available for nonzonal resources. | Because nonzonal resources can't be made zone resilient, avoid nonzonal deployments for all production workloads in regions that have availability zones. |

For more information about availability zones and resource deployments, see [Availability zones](./availability-zones-overview.md).

## Workloads that combine zone-redundant and zonal resources

Many workloads combine zone-redundant and zonal resources. For example, your workload might include a set of zonal virtual machines (VMs) for your database tier, a zone-redundant web server hosted on Azure App Service, and a zone-redundant load balancer to send traffic to your database VMs.

:::image type="complex" source="./media/availability-zones-zonal-reliability/zonal-zone-redundant.svg" border="false" lightbox="./media/availability-zones-zonal-reliability/zonal-zone-redundant.svg" alt-text="Diagram that shows a solution that includes both zonal VMs and zone-redundant components.":::
   The image shows three availability zones. A zone-redundant web application and a zone-redundant load balancer span all three zones. Each zone contains a database replica and a zonal virtual machine (VM). A dotted arrow labeled customer-configured replication and failover connects all three replicas.
:::image-end:::

When you combine zonal and zone-redundant resources in a workload, consider how each resource and the overall solution behave if an availability zone has a problem. Typically, zone-redundant services automatically recover from zone outages with minimal or no data loss, and Microsoft manages the entire process. For zonal resources, you're responsible for configuring automated failover or doing manual recovery activities. To learn how each service behaves during zone-down scenarios, understand your responsibilities versus Microsoft responsibilities, and monitor the health of services during zone-down events, see your service's reliability guide.

## When to use a zonal deployment

Use zonal resources only when there's a clear need. Typical reasons for a single-zone deployment include cases where a resource must be zonal, a service is available only in a specific zone, or a workload is highly sensitive to inter-zone latency.

> [!IMPORTANT]
> Some Azure services let you choose between zonal and zone-redundant deployments. If you don't have a strong reason to use a zonal deployment, use a zone-redundant deployment.

### Resources that require zonal deployments

A few Azure services only support zonal deployments and don't provide zone-redundant deployments.

[VMs](./reliability-virtual-machines.md#resilience-to-availability-zone-failures) are a zonal resource. You can use virtual machine scale sets to create sets of VMs. Virtual Machine Scale Sets can be made zone-spanning, which means that the VMs in the set are spread across multiple zones. Scale sets are a good way to achieve zone resiliency for many VM-based workloads.
    
> [!TIP]
> If you deploy multiple VMs that do similar functions, we recommend that you use zone-spanning scale sets instead of single-instance VMs that you deploy individually.

Another example is [Azure NetApp Files](./reliability-netapp-files.md#resilience-to-availability-zone-failures), which supports the deployment of volumes into a single zone. The service also provides a way for you to replicate between multiple zonal volumes.

Some services provide options that are available only in specific zones. For example, specific VM types that use advanced graphics processing units (GPUs) might be available only in specific zones within a region, which means that they can't be deployed across multiple zones. To check which regions and zones support the VM types that you need, use the following resources:

- To check the VM types available in each region, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

- To check the supported VM types and sizes within each zone of a specific region, see [Check VM SKU availability](/azure/virtual-machines/linux/create-cli-availability-zone#check-vm-sku-availability).

If the VM type that you need is only available in a single zone within the region that you use, you might consider a zonal deployment for that VM and then find other ways to make the VM resilient to zone outages. But you should continue to ensure that the other parts of your solution are zone-resilient.

For more information, see [Azure services that support availability zones](./availability-zones-service-support.md).

### Inter-zone latency

If you have a workload that's unusually latency-sensitive, you might use zonal resources instead of zone-redundant resources, even if a service supports zone-redundant deployments.

A low-latency network connects availability zones, with inter-zone round-trip latency typically under two milliseconds. For most workloads, inter-zone latency isn't a concern. The resiliency benefits of spreading resources across availability zones are more important than the minimal performance impact of sending traffic between zones. But a few workloads are highly sensitive to inter-zone latency. These workloads might include the following scenarios:

- **Legacy on-premises applications:** Some legacy workloads can contain applications that were originally designed for an on-premises environment. These workloads assume that components, like databases and other applications and services, are colocated on the same host or in close physical proximity.

- **Very high-scale synchronous replication:** Stateful applications and databases occasionally perform very large numbers of writes by using [synchronous replication](./concept-redundancy-replication-backup.md#synchronous-and-asynchronous-replication). Synchronous replication means that data is written to multiple *replicas* before the write operation is considered complete. Distributing replicas across availability zones improves resiliency, but when you use synchronous replication, inter-zone latency can increase the write latency of the workload. This increased latency isn't usually significant, but because of how some applications are designed, it can sometimes become problematic at high scale.

> [!IMPORTANT]
> It's unusual for workloads to be sensitive to inter-zone latency. Don't assume that your workload is affected unless you test the latency for your specific workload and needs.

If you suspect that inter-zone latency is affecting your workload, test its impact in a realistic environment by following these steps for your specific workload:

1. **Define acceptable performance requirements.** Inter-zone traffic adds a small amount of latency, but it's negligible for most workloads. Define what acceptable performance looks like for *your* workload.

1. **Run a performance test within a single availability zone.** Establish a set of baseline performance metrics.

    > [!IMPORTANT]
    > Test your workload, including your applications, protocols, configuration, and Azure region. Use a realistic load. Benchmarks and synthetic tests aren't sufficient because they don't show how your solution actually behaves.

1. **Enable inter-zone replication.** Depending on the components that you use, you might enable zone redundancy or move replicas between zones.

1. **Rerun performance tests.** Collect the same metrics that you collected earlier.

1. **Compare the performance impact against your requirements.** Use your requirements and the performance data to make an informed decision about the trade-off between latency and resiliency to zone outages.

    If the test demonstrates that the latency is unacceptably high for your workload, consider taking the following actions:

    > [!div class="checklist"]
    > - Try using another set of zones. There can be slight variability in the latency between different zones because they can have different physical distances from each other.
    >
    >   > [!TIP]
    >   > If you test across Azure subscriptions, review the [logical to physical zone mapping](./availability-zones-overview.md#physical-and-logical-availability-zones) to ensure that you test the sets of physical zones that you expect.
    >
    > - If there's another Azure region that meets your overall needs for data residency and other factors, try using multiple zones in that region.
    >
    > - Consider whether you can redesign your application to minimize the inter-zone communication required. For example, you might be able to consolidate multiple small database operations into a single operation. This approach can reduce the latency impact on your workload.

    If none of these actions help, consider running the specific workload or components within a single availability zone by using zonal VMs and other supported Azure services. You then take responsibility for making the zonal components resilient to zone outages. Review the rest of this article to understand your responsibilities and some approaches to consider.
 
## Your responsibilities for a zonal deployment

A zonal resource is at risk of downtime when its availability zone experiences an outage. When you deploy a zonal resource, you're responsible for making your workload resilient to zone-level failures.

> [!IMPORTANT]
> Zonal resources are **not** inherently resilient to zone failures. You must design ways to mitigate the risk of a zone failure by developing a plan that includes zone-down scenarios.

To make zonal resources zone-resilient, consider the following responsibilities:

- **Deployment and configuration of multiple resources:** Deploy separate zonal resources manually into different zones or regions. Determine how to keep configuration consistent across each resource. Using infrastructure as code (IaC) is a best practice because it enables rapid deployment of multiple identical resources.

- **Traffic routing and distribution:** You must select a load balancer component, ensure that it's zone-resilient, and configure it to send traffic between the resources in different zones. You typically configure the routing policy (like active-active or active-passive), automated health checks, and failover processes. For more information, see [Load balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

- **Replication or data backup:** For stateful resources, you're responsible for protecting the data that they store and ensuring that it's safely kept in multiple zones. A common approach is to configure replication to another service instance in a different availability zone. In some situations, you might rely on backups instead. But backups require a longer recovery time during a zone failure, which requires you to have a higher *recovery time objective (RTO)*. They also result in more data loss, which requires a higher *recovery point objective (RPO)*.

- **Zone failure detection and response process implementation:** You must determine how to monitor the health of zonal resources, define the conditions that mark them as unhealthy, and trigger response actions like restoring operations in another zone or region.

- **Zone recovery processes:** After the zone recovers, you're responsible for any required recovery actions, like failing back to resources in the primary zone.

## Common approaches for zonal deployment resiliency

To make informed decisions about achieving zone resiliency for your zonal resources, consider the following factors:

- **Review your whole workload.** Understand how each component behaves during zone-down events, including zone-redundant, zonal, and [nonregional resources](./regions-nonregional-services.md). Use the reliability guide for each service to learn how the service works during zone-down scenarios, and how to monitor the health of services for zone-down events.

- **Understand the allowable data loss during a zone failure.** Your RPO specifies how much data loss you can accept.

    Many Azure zone-redundant resources provide an RPO of zero for zone failures, which means that no data loss occurs. They typically achieve this RPO by synchronously replicating all changes across zones.
    
    When you plan a zonal deployment, you must ensure that you can meet your workload's RPO requirements when a zone fails.

- **Understand the allowable downtime during a zone failure.** Your RTO specifies how much downtime you can accept.

    Azure zone-redundant resources typically provide a very low RTO for zone failures and usually require only a few seconds of downtime.
    
    When you plan a zonal deployment, you must ensure that you can meet your workload's RTO requirements. If you have a low RTO, you might need to rely on automated detection and recovery processes. A higher RTO provides more flexibility for your response processes.

- **Understand the cost.** Zonal resources are typically billed individually, so deploying multiple zonal resources can increase your resource cost.

### Design a zonal deployment for resiliency

When you design your zonal deployment for resiliency, consider whether you're using availability zones to achieve *high availability* or *disaster recovery*. The distinction between these concepts is based on your RTO and RPO requirements.

If you have a low RTO and low RPO requirement, you need to treat availability zones as a *high availability* construct. But if your RTO and RPO are higher, you might choose to treat availability zones as a *disaster recovery* construct. For more information, see [Business continuity, high availability, and disaster recovery](./concept-business-continuity-high-availability-disaster-recovery.md). Your [workload tier](/azure/well-architected/design-guides/disaster-recovery) can help you determine your requirements and necessary actions.

#### Design for high availability

Consider deploying your own highly available architecture across multiple zones. A highly available architecture requires automated and frequent data replication across components that are deployed across multiple zones, and automatic failover between those components if a zone failure occurs.

Some applications that you deploy on zonal VMs provide built-in high availability support, like by being replica-aware. For example, if you use SQL Server on Azure VMs, *availability groups* provide traffic routing and failover capabilities. You can select whether you want to use synchronous or asynchronous replication. For more information, see [Business continuity, high availability, and disaster recovery for SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview).

#### Design for disaster recovery

Disaster recovery differs from high availability because greater downtime and data loss are acceptable in a disaster scenario. RTO and RPO are typically measured in hours or longer.

A disaster recovery plan helps you prepare for different scenarios and defines how to respond by using a combination of automated and manual processes.

The following disaster recovery approaches can help when you plan a zonal deployment:

- **Azure Site Recovery zone-to-zone disaster recovery:** This approach is useful when you need disk-level asynchronous replication between VMs in different zones. For more information, see [Enable Azure VM disaster recovery between availability zones](/azure/site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery).

- **Site Recovery region-to-region disaster recovery:** Site Recovery supports region-to-region disaster recovery and relies on asynchronous replication. This approach lets you fail over to a zone in another Azure region instead of another zone in your primary region. For more information, see [Replicate Azure VMs to another Azure region](/azure/site-recovery/azure-to-azure-how-to-enable-replication).

- **Backup-based disaster recovery:** If your solution can tolerate a high RTO and high RPO, consider using backups as a disaster recovery strategy. If the zone experiences an outage, you can then restore backups into another zone or region. You also need to consider whether you precreate the other Azure resources in your solution, or if you create them during the failover process.

    In a zonal architecture, you're often responsible for storing and replicating those backups.

    [Azure Backup](/azure/backup/backup-overview) is a widely used managed backup service. It supports zone-redundant backups and geo-replicated backups across paired Azure regions. Some applications, like [SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/backup-restore), also include built-in application-specific backup features.

## Next step

- [Recommendations for using availability zones and regions in the Azure Well-Architected Framework](/azure/well-architected/reliability/regions-availability-zones)
