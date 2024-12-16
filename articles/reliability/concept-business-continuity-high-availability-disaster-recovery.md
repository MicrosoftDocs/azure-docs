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

*Business continuity* is the state in which your business is able to continue to remain operational, even during failures, outages, or disasters. You achieve business continuity through proactive planning, preparation, and the implementation of resilient systems and processes.

Planning for business continuity is about identifying, understanding, classifying, and managing risks. Based on the risks and their likelihoods, you can design your solution for *high availability* and *disaster recovery*. High availability is about designing your solution to be resilient to day-to-day issues and to meet your business needs for availability. Disaster recovery is about planning how you deal with catastrophic outages and uncommon risks.

This article describes business continuity, high availability, and disaster recovery and provides links to resources that can help you to design your own strategies for each. For detailed guidance on how to architect for business continuity, go to the [Azure Well-Architected Framework](/azure/well-architected/).

## Business continuity

For a successful *business continuity plan*, it's essential to:
 
- **Identify risks** to your workload's availability or functionality, such as network issues, hardware failures, or a region outage.
 
- **Classify risks** as either a day-to-day risk, which should be factored into plans for high availability, or a catastrophic or unusual risk, which should be part of disaster recovery planning.
 
- **Design for HA or DR to minimize or mitigate risks** such as using redundancy, failover, and backups. You might also consider non-technical and process-based mitigations and controls.
 
A business continuity plan doesn't only take into consideration the resiliency features of the cloud platform itself, or even the features of the application. Business continuity is achieved by incorporating all aspects of support in the business such as people, business-related manual or automated processes, and other technologies.

### Risks for cloud-based solutions

When you run a solution in the cloud, there are a range of events that can happen. These events can affect the resources that the workload uses. The following table is a non-exhaustive list of example events, ordered by expected likelihood:

| Example risk | Description | Regularity (likelihood) |
|---|---|---|
| Transient network issue | A temporary failure in a component of the networking stack, which is recoverable after a short time (usually a few seconds or less). | Regular |
| Virtual machine reboot | A virtual machine that you use, or that a dependent service uses, reboots unexpectedly because it crashes or needs to apply a patch. | Regular |
| Hardware failure | A failure of a component within a datacenter, such as a hardware node, rack, or cluster. | Occasional |
| Datacenter outage | An outage that affects most or all of a datacenter, such as a power failure, network connectivity problem, or issues with the heating and cooling. | Unusual |
| Region outage | An outage that affects an entire metropolitan area or wider area, such as a major natural disaster. | Very unusual |

Business continuity planning isn't just about the cloud platform and infrastructure. You need to consider the risk of human errors, and some risks that might traditionally be considered security or operational risks should also be considered reliability risks because they affect the solution's availability. Here are some examples:

| Example risk | Description |
|---|---|
| Data loss or corruption | Data has been deleted, overwritten, or otherwise corrupted by an accident, or from a security breach like a ransomware attack. |
| Failed deployments | A deployment of a new component or version has failed, leaving the solution in an inconsistent state. |
| Denial of service attacks | The system has been attacked in an attempt to prevent legitimate use of the solution. |
| Rogue administrators | A user with administrative privileges has intentionally performed a damaging action against the system. |
| Unexpected influx of traffic to an application | A spike in traffic has overwhelmed the system's resources. |

*Failure mode analysis* (FMA) is the process of identifying potential ways in which a workload or its components could fail and the ways in which the solution behaves under those situations. To learn more about failure mode analysis, see [Recommendations for performing failure mode analysis](/azure/well-architected/failure-mode-analysis).

Each risk can be analyzed to understand its likelihood and its severity. Severity needs to include any potential downtime or data loss, as well as whether any aspects of the rest of the solution design that might compensate for negative effects.

### Risk classification
 
Business continuity plans must address both common and uncommon risks.

- Some risks are commonplace, planned, and expected. For example, in a cloud environment it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so forth. Because these events happen regularly, workloads need to be resilient to them. A high availability strategy must consider and control for each risk of this type.

- Unusual risks are generally the result of a catastrophic and unforeseeable event, such as natural disasters or major network attacks. Disaster recovery (DR) processes deal with these rare risks.

High availability and disaster recovery are interrelated, and so it's important to plan strategies for both of them together.

The same risk might be classified as HA for one workload and DR for another workload, depending on the business needs and the way the solution is designed. For example, for most solutions an outage of a full Azure region would be considered a disaster. But if you have a fully active-active multi-region solution design, you might be more resilient to a regional outage and can fail over to use other regions instead. This architecture means a region outage is covered as a high availability concern and not a disaster.

### Risk mitigations

There are a range of different controls available for each risk. Part of business continuity planning is deciding which controls to apply for each specific situation based on the business needs. Many common mitigations are technical in nature and rely on technology is configured or used. For example, you can build resiliency into a solution's design by using redundancy, data replication, failover, and backups. However, some controls might instead be based around business processes, such as by triggering a response playbook, or failing back to manual operations.

When you're considering which controls to apply, understand whether they require or assume downtime or data loss. For example, some controls require a human to be notified and then to respond, which takes time. If a solution requires high uptime, manual processes are likely to be too slow, and you should control many of the risks by using automated approaches. For more information, see [High availability](#high-availability).

For some risks, you can choose to operate the solution in a *degraded state*. When a solution operates in a degraded state, some components might be disabled or non-functional, but core business operations can continue to be performed. To learn more, see [Recommendations for self-healing and self-preservation](/azure/well-architected/reliability/self-preservation).

## High availability

High availability (HA) is the state in which a specific workload can maintain the necessary level of uptime on a day-to-day basis, even during transient faults and intermittent failures. For example, in a cloud environment, it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so on. Because these events happen regularly, it's important that each workload is designed and configured for high availability in accordance with the requirements of the specific application and customer expectations. The HA of each workload contributes to your business continuity plan.
 
Because HA can vary with each workload, it's important to understand the requirements and customer expectations when determining high availability. For example, an application that's used within your organization might require a relatively low level of uptime, while a critical financial application might require a much higher uptime. Even within a workload, different *flows* might have different requirements. For example, in an eCommerce application, flows related to customers browsing and placing orders might be critical while order fulfillment and back-office processing flows might be lower priority. To learn more about flows, see [Recommendations for identifying and rating flows](/azure/well-architected/reliability/identify-flows).
 
When a workload architect plans for high availability, they define:
 
- **Service level objectives (SLO)**, which describe things like the percentage of time the workload should be available to users.
- **Service level indicators** (SLI), which are specific metrics that are used to measure whether the workload is meeting an SLO.
 
The higher the uptime requirement, the more work you have to do to reach that level of availability.

> [!TIP]
> Don't overengineer your solution to reach higher levels of reliability than are justified. Use business requirements to guide your decisions.

Uptime isn't measured by the uptime of a single component like a node, but by the overall availability of the entire workload. For more detailed information on how to define and measure high availability, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

### High availability design elements

To achieve high availability, a workload may include the following design elements:
 
 - **Use services and tiers that support high availability**. For example, Azure offers a variety of services that are designed to be highly available, such as Azure Virtual Machine Scale Sets, Azure App Service, and Azure SQL Database. These services are designed to provide high availability by default, and can be used to build highly available workloads.
    
    Review the service level agreements (SLAs) for each service to understand the expected levels of availability. You might need to select specific tiers of services to achieve high levels of availability.
 
 - **Redundancy** is the practice of duplicating instances or data to increase the reliability of the workload. For example, a web application might use multiple instances of a web server to ensure that the application remains available even if one instance fails. A database may have multiple replicas to ensure that the data remains available even if one replica fails.
 
    Often you can choose to distribute those replicas or redundant instances around a datacenter, between availability zones within a region, or even across regions.
 
 - **Fault tolerance** is the ability of a system to continue operating in the event of a failure. For example, a web application might be designed to continue operating even if a single web server fails.
 
    Fault tolerance can be achieved through redundancy, failover, partitioning, and other techniques.
 
 - **Scalability and elasticity** are the abilities of a system to handle increased load by adding resources. For example, a web application might be designed to automatically add additional web servers as traffic increases. Scalability and elasticity can help a system maintain availability during peak loads. For more information on how to design a scalable and elastic system, see [Recommendations for designing a reliable scaling strategy](/azure/well-architected/reliability/scaling).
 
 - **Monitoring and alerting** lets you know the health of your system, even when automated mitigations take place. Use Azure Service Health, Azure Resource Health, and Azure Monitor, as well as Scheduled Events for virtual machines. For more information on how to design a reliability monitoring and alerting strategy, see [Recommendations for designing a reliable monitoring and alerting strategy](/azure/well-architected/reliability/monitoring-alerting-strategy).

To understand the capabilities of each Azure service, see its [reliability guide](./overview-reliability-guidance.md). You can then decide which capabilities to include in your high availability strategy.

> [!NOTE]
> Some workloads are *mission-critical*, which means any downtime can have severe consequences. If you're designing a mission-critical workload, there are specific things you need to think about when you design your solution and manage your business continuity. For more information, see the [Azure Well-Architected Framework: Mission-critical workloads](/azure/well-architected/mission-critical/mission-critical-overview).

## Disaster recovery

A *disaster* is a distinct, uncommon, major event that has a larger and longer-lasting impact than an application can mitigate through the high availability aspect of its design. Examples of disasters include:
 
- **Natural disasters**, such as hurricanes, earthquakes, floods, or fire.
- **Human errors that result in a major impact**, such as accidentally deleting production data, or a misconfigured firewall that exposes sensitive data.
- **Major security incidents**, like denial of service or ransomware attacks that lead to data corruption, data loss, or service outages.
 
*Disaster recovery* is about planning how you respond to these types of situations.

> [!NOTE]
> You should follow recommended practices across your solution to minimize the likelihood of these events. However, even after careful proactive planning, it's prudent to plan how you would respond to these situations if they arise.

### Disaster recovery requirements

Due to the rarity and severity of disaster events, DR planning brings different expectations for your response. Many organizations accept the fact that, in a disaster scenario, some level of downtime or data loss is unavoidable. A complete DR plan must specify the following critical business requirements for each flow: 

- **Recovery Point Objective (RPO)** is the maximum duration of acceptable data loss in the event of a disaster. RPO is measured in units of time, not volume, such as "30 minutes of data" or "four hours of data."

- **Recovery Time Objective (RTO)** is the maximum duration of acceptable downtime in the event of a disaster, where "downtime" is defined by your specification. For example, if the acceptable downtime duration in a disaster is eight hours, then the RTO is eight hours.

:::image type="content" source="media/disaster-recovery-rpo-rto.png" alt-text="Screenshot of RTO and RPO durations in hours." border="false":::

Each workload and flow might have individual RPO and RTO values. Examine disaster-scenario risks and potential recovery strategies when deciding on the requirements. The process of specifying an RPO and RTO effectively creates DR requirements for your application as a result of your unique business concerns (costs, impact, data loss, etc.).

> [!NOTE]
> While it's tempting to aim for an RTO and RPO of zero (no downtime and no data loss in the event of a disaster), in practice it's difficult and costly to implement. It's important for technical and business stakeholders to discuss these requirements together and make a decision about what realistic requirements should be. For more information, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

### Disaster recovery plans

Regardless of the cause of the disaster, it is important that you create a well-defined and tested DR plan, and an application design that actively supports it. You might create multiple DR plans for different types of situations. DR plans often rely on process controls and manual intervention.

DR isn't an automatic feature of Azure. However, many services do provide features and capabilities that you can use to support your DR strategies. You should review the [reliability guides for each Azure service](./overview-reliability-guidance.md) to understand how the service works and its capabilities, and then map those capabilities to your DR plan.

To learn more about disaster recovery planning, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery).
