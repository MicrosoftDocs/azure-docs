---
title: What are business continuity, high availability, and disaster recovery?
description: Understand business continuity, high availability, and disaster recovery for your Microsoft Azure-based solutions.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 12/10/2024
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# What are business continuity, high availability, and disaster recovery?

*Business continuity* is the state in which your business is able to continue to remain operational, even during a disaster or outage.

Planning for business continuity is about identifying, understanding, classifying, and managing risks. For successful a *business continuity plan*, it is essential to:
 
- **Identify risks** such as network issue, hardware failures, or a region outage.
 
- **Classify risks** as either a day-to-day risk (high availability) or a catastrophic risk (disaster recovery).
 
- **Design for HA or DR to minimize risks** such as using redundancy, backups, or failover.
 
A business continuity plan doesn't only take into consideration the resiliency features of the cloud platform itself, or even the features of your application. Business continuity is achieved by incorporating all aspects of support in your business such as people, business-related manual or automated processes, and other technologies.
 
This article provides a high-level summary of business continuity planning, covering risk identification, classification, and management as it pertains to reliability in the cloud. For detailed guidance on how to architect for business continuity, go to [Azure Well-Architected Framework](/azure/well-architected/).

> [!NOTE]
> Some workloads are *mission-critical*, which means any failures can have severe consequences. If you're designing a mission-critical workload, there are specific things you need to think about when you design your solution and manage your business continuity. For more information, see the [Azure Well-Architected Framework: Mission-critical workloads](/azure/well-architected/mission-critical/mission-critical-overview).

## Business continuity

TODO

### Risks for cloud-based solutions

When you run a solution in the cloud, there are a range of events that can happen. These events can affect the resources that your workload uses. The following table is a non-exhaustive list of example events, ordered by severity:

| Example risk | Description | Regularity (likelihood) |
|---|---|---|
| Transient network issue | A temporary failure in a component of the networking stack, which is recoverable after a short time (usually a few seconds or less). | Regular |
| Virtual machine reboot | A virtual machine that you use, or that a dependent service uses, reboots unexpectedly because it crashes or needs to apply a patch. | Regular |
| Hardware failure | A failure of a hardware node, rack, or cluster within a datacenter. | Occasional |
| Datacenter outage | An outage that affects most or all of a datacenter, such as a power failure, network connectivity problem, or issues with the heating and cooling. | Unusual |
| Region outage | An outage that affects an entire metropolitan area or wider area, such as a major natural disaster. | Very unusual |

There are also risks beyond the cloud platform and infrastructure. Some risks that might traditionally be considered security or operational risks should also be considered reliability risks because they affect the solution's availability. Here are some examples:

| Example risk | Description |
|---|---|
| Data loss or corruption | Data has been deleted, overwritten, or otherwise corrupted by an accident, or from a security breach like a ransomware attack. |
| Failed deployments | A deployment of a new component or version has failed, leaving your solution in an inconsistent state. |
| Denial of service attacks | Your system has been attacked in an attempt to prevent legitimate use of the solution. |
| Rogue administrators | A user with administrative privileges has intentionally performed a damaging action against the system. |
| Unexpected influx of traffic to an application | A spike in traffic has overwhelmed your system resources. |

*Failure mode analysis* (FMA) is the processs of identifying the potential risks and failure modes of your solution. To learn more about failure mode analysis, see [Recommendations for performing failure mode analysis](/azure/well-architected/failure-mode-analysis).

Each risk can be analyzed to understand its likelihood and its severity. Severity needs to include any potential downtime or data loss, as well as whether any aspects of the rest of the solution design that might compensate for negative effects.

### Risk classification
 
A business continuity plan must address both types of risk classification: *high availability risks* and *disaster recovery risks*.

- **High availability risks** are commonplace, planned, and expected, and so should easily be controlled.  For example, in a cloud environment it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so forth. Because these events happen regularly, workloads need to be resilient to them.

- **Disaster recovery risks** are unusual, as they are are the result of a catastrophic and unforeseeable event, such as natural disasters or network attacks. DR processes for dealing with rare disaster risks. Due to the rarity and severity of disaster events, DR planning has different expectations for how long it takes to recover.

High availability and disaster recovery are interrelated, and so it's important to plan strategies for both of them together. There are some risks that may not fit neatly into either classification. The same risk might be classified as HA for one workload and DR for another workload, depending on the business needs and the way the solution is designed. For example, for most solutions an outage of a full Azure region would be considered a disaster. But, if you have a fully active-active multi-region solution design, you might be more resilient to a regional outage and can fail over to use other regions instead. This architecture means a region outage is covered as a high availability concern and not a disaster.

### Risk mitigations

<!-- TODO rewrite this section -->

There are a range of different controls available for each risk. You can decide which controls to apply for your specific situation and needs.

There are multiple ways you can group controls, including:

- **Technical or process.** Technical controls include strategies you can build into your solution's design like redundancy, data replication, failover, and backups. Process controls include triggering a response playbook, or failing back to manual operations.

- **Proactive or reactive.** Some controls are applied proactively when you design the solution, while others are engaged reactively when or after a problem occurs.

- **Automated or manual.** Controls might be fully automated, such as self-healing or automated failover. Other controls might require manual intervention, such as restoring from backup or making an explicit decision to fail over to another instance of the solution.

When you're considering which controls to apply, understand whether they require or assume downtime or data loss. For example, reactive manual controls typically require a human to be notified and then to respond, which takes time. If your solution requires high uptime, you need to control many of the risks by using automated technical controls. To learn more, see [High availability](#high-availability).

<!-- TODO for HA you're going to need to prefer mitigations that can be automated -->

For some risks, you might decide to continue to operate your solution in a *degraded state*. When your solution operates in a degraded state, some components might be disabled or non-functional, but core business operations can continue to be performed. To learn more, see [Recommendations for self-healing and self-preservation](/azure/well-architected/reliability/self-preservation).

> [!TIP]
> Create a *risk register*, which details each risk, its impact, and what you're doing to control it. Review the risk register on a regular basis, and look for new controls that you can apply to improve your responsiveness.

## High availability

High availability (HA) is the state in which a specific workload can maintain uptime on a day-to-day basis, even during transient faults and intermittent failures. For example, in a cloud environment, it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so on. Because these events happen regularly, it's important that each workload is designed and configured for high availability in accordance with the requirements of the specific application and customer expectations.  The HA of each workload contributes to your business continuity plan.
 
Because HA can vary with each workload, it's important to understand the requirements and customer expectations when determining high availability. For example, an application that's used within your organization might require a relatively low level uptime, while a critical financial application might require a much higher uptime. The higher the uptime, the more work you have to do to reach that level of availability.
 
When defining high availability, a workload architect defines:
 
- **Service level objectives (SLO)**, which describe things like the percentage of time the workload should be available to users.
- **Service level indicators** (SLI), which are specific metrics that are used to measure whether the workload is meeting an SLO.
 
It is also important to understand that HA is not measured by the uptime of a single node, but by the overall availability of the entire workload. For more detailed information on how to define and measure high availability, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

### High availability design principles

To achieve high availability, a workload may use include the following design elements:
 
 - **Use services and tiers that support high availability**. For example, Azure offers a variety of services that are designed to be highly available, such as Azure Virtual Machines, Azure App Service, and Azure SQL Database. These services are designed to provide high availability by default, and can be used to build highly available workloads. You might need to select specific tiers of services to achieve high levels of availability.
 - **Redundancy** is the practice of duplicating instances or data to increase the reliability of the workload. For example, a web application might use multiple instances of a web server to ensure that the application remains available even if one instance fails. A database may have a multiple replicas to ensure that the data remains available even if one replica fails. You can choose distribute those replicas or redundant instances around a data center, between availability zones within a region, or even across regions.
 - **Fault tolerance** is the ability of a system to continue operating in the event of a failure. For example, a web application might be designed to continue operating even if a single web server fails. Fault tolerance can be achieved through redundancy, failover, partitioning, and other techniques.
 - **Scalability and elasticity** are the abilities of a system to handle increased load by adding resources. For example, a web application might be designed to automatically add additional web servers as traffic increases. Scalability and elasticity can help a system maintain availability during peak loads. For more information on how to design a scalable and elastic system, see [Scalability and elasticity](/azure/well-architected/reliability/scaling).
 - **Monitoring and alerting** lets you know the health of your system, even when automated mitigations take place. Use Azure Service Health, Azure Resource Health, and Azure Monitor, as well as Scheduled Events for virtual machines. For more information on how to design a reliability monitoring and alerting strategy, see [Monitoring and alerting](/azure/well-architected/reliability/monitoring-alerting-strategy).

<!-- 
 If you have stringent requirements, HA might also include a multi-region active/active design. This is very costly and complex to implement, but if done well it can result in a very resilient solution. Normally, though, regional failures are considered disasters and are part of your disaster recovery planning.
 -->

## Disaster recovery

A *disaster* is a single, generally uncommon, major event that has a larger and longer-lasting impact than an application can mitigate through the high availability aspect of its design.
 
A disaster could be any one of the following events:
 
- A natural disaster such as a hurricane, earthquake, flood, or fire.
- Human error such as accidentally deleting production data, or a misconfigured firewall that exposes sensitive data.
- Ransomware attacks that lead to data corruption, data loss, or service outages.
 
*Disaster recovery (DR)* is not an automatic feature of Azure, although many services do provide features that you can use to support your DR. DR is about understanding what your services support, and planning for and responding to these possible disasters so as to minimize downtime and data loss. Regardless of the cause the disaster, it is important that you create a well-defined and tested DR plan, and an application design that actively supports it.

## Next steps

TODO
