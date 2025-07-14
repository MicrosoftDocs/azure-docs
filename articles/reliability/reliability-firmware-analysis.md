---
title: Reliability in firmware analysis
description: Find out about reliability in firmware analysis, including availability zones and multi-region deployments.
author: karengu0
ms.author: karenguo
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure
ms.date: 7/11/2025

---

# Reliability in firmware analysis

This article describes reliability support in firmware analysis, covering intra-regional resiliency via [availability zones](#availability-zone-support) and information on [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]


## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]


## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Firmware analysis is zone-redundant, which means that it automatically replicates across multiple [availability zones](../reliability/availability-zones-overview.md). This setup enhances the resiliency of the service by providing high availability. If there's a failure in one zone, the service can continue to operate seamlessly from another zone. 

Microsoft manages setup and configuration for zone redundancy in firmware analysis. You don't need to perform any more configuration to enable this zone redundancy. Microsoft ensures that the service is configured to provide the highest level of availability and reliability.

### Regions supported

The following list of regions support availability zones in firmware analysis:


| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| East US          | West Europe          |               |                    |                |


### Cost

There's no extra cost to use zone redundancy for firmware analysis.

### Configure availability zone support

**New resources:**  When you create firmware analysis resource (a workspace) in Azure, it automatically includes zone-redundancy by default. There's no need for you to perform any more configuration. 


### Zone-down experience

During a zone-wide outage, you don't need to take any action to fail over to a healthy zone. The service automatically self-heals and rebalances itself to take advantage of the healthy zone automatically.

**Detection and response:**  Because firmware analysis detects and responds automatically to failures in an availability zone, you don't need to do anything to initiate an availability zone failover.


## Multi-region support

Firmware analysis does not support multi-region failovers, as we have one region per geography.


### Region down experience

During a region outage, Microsoft adheres to the Recovery Time Objective (RTO) to recover the service. During this time, the customer can expect some service interruption until the service is fully recovered.  

In a complete region loss scenario, you can expect a manual recovery from Microsoft. 


For firmware analysis, Recovery Time Objective (RTO) is approximately 24 hours. For Recovery Point Objective (RPO), you can expect less than 15 minutes.


## Service-level agreement (SLA)

The service-level agreement (SLA) for firmware analysis describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).


## Related content


- [What is firmware analysis?](../firmware-analysis/overview-firmware-analysis.md) 

- [Reliability in Azure](/azure/reliability/overview)
