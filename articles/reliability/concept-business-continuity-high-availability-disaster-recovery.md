---
title: What are business continuity, high availability, and disaster recovery?
description: Understand business continuity, high availability, and disaster recovery for your Microsoft Azure-based solutions.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 01/08/2025
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# What are business continuity, high availability, and disaster recovery?

This article defines and describes business continuity and business continuity planning in terms of risk management through high availability and disaster recovery design. 

*Business continuity* is the state in which a business can continue operations during failures, outages, or disasters. Business continuity requires proactive planning, preparation, and the implementation of resilient systems and processes.

Planning for business continuity requires identifying, understanding, classifying, and managing risks. Based on the risks and their likelihoods, design for both *high availability* (HA) and *disaster recovery* (DR). 

*High availability* is about designing a solution to be resilient to day-to-day issues and to meet the business needs for availability. 

*Disaster recovery* is about planning how to deal with catastrophic outages and uncommon risks.

## Business continuity

Software solutions are often tied directly to the success of a business. If a system is unavailable or experiences a serious problem there might be severe consequences, such as:

- Loss of business income, in whole or in part.
- The inability to provide an important service to users.
- Breach of a commitment that's been made to a customer or another party.

Maintaining business continuity requires assessing risks that might cause problems, and controlling them through a variety of approaches. The specific risks and approaches to mitigate them will be different for each organization and workload.

It's critical to have clear business requirements in order to plan for business continuity. It's important to understand and communicate the business expectations, and the consequences of failures, to important stakeholders including those who design, implement, and operate the workload. Those stakeholders then respond by sharing the costs involved in meeting that vision. There's typically a process of negotiation and revisions of that vision based on budget and other constraints.

For more information on the process of defining business continuity expectations as targets, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

### Business continuity planning

For a successful *business continuity plan*, it's essential to:
 
- **Identify risks** to a workload's availability or functionality, such as network issues, hardware failures, human error, or a region outage.
 
- **Classify risks** as either a day-to-day risk, which should be factored into plans for high availability, or a catastrophic or unusual risk, which should be part of disaster recovery planning.
 
- **Design for HA or DR to minimize or mitigate risks** such as by using redundancy, replication, failover, and backups. Consider nontechnical and process-based mitigations and controls, too.
 
A business continuity plan doesn't only take into consideration the resiliency features of the cloud platform itself, or even the features of the application. Business continuity is achieved by incorporating all aspects of support in the business including people, business-related manual or automated processes, and other technologies.

### Risks for cloud-based solutions

When a solution runs in the cloud, there are a range of events that can happen. These events can affect the resources that the workload uses. The following table is a nonexhaustive list of example events, ordered by expected likelihood:

| Example risk | Description | Regularity (likelihood) |
|---|---|---|
| Transient network issue | A temporary failure in a component of the networking stack, which is recoverable after a short time (usually a few seconds or less). | Regular |
| Virtual machine reboot | A reboot of a virtual machine that you use, or that a dependent service uses. Reboots might occur because the virtual machine crashes or needs to apply a patch. | Regular |
| Hardware failure | A failure of a component within a datacenter, such as a hardware node, rack, or cluster. | Occasional |
| Datacenter outage | An outage that affects most or all of a datacenter, such as a power failure, network connectivity problem, or issues with heating and cooling. | Unusual |
| Region outage | An outage that affects an entire metropolitan area or wider area, such as a major natural disaster. | Very unusual |

Business continuity planning isn't just about the cloud platform and infrastructure. You need to consider the risk of human errors, and some risks that might traditionally be considered security or operational risks should also be considered reliability risks because they affect the solution's availability. Here are some examples:

| Example risk | Description |
|---|---|
| Data loss or corruption | Data has been deleted, overwritten, or otherwise corrupted by an accident, or from a security breach like a ransomware attack. |
| Software bug | A deployment of new or updated code introduces a bug that impacts availability or integrity, leaving the workload in a malfunctioning state. |
| Failed deployments | A deployment of a new component or version has failed, leaving the solution in an inconsistent state. |
| Denial of service attacks | The system has been attacked in an attempt to prevent legitimate use of the solution. |
| Rogue administrators | A user with administrative privileges has intentionally performed a damaging action against the system. |
| Unexpected influx of traffic to an application | A spike in traffic has overwhelmed the system's resources. |

*Failure mode analysis* (FMA) is the process of identifying potential ways in which a workload or its components could fail, and how the solution behaves under those situations. To learn more, see [Recommendations for performing failure mode analysis](/azure/well-architected/reliability/failure-mode-analysis).

Each risk should be analyzed to understand its likelihood and its severity. Severity needs to include any potential downtime or data loss, as well as whether any aspects of the rest of the solution design might compensate for negative effects.

### Risk classification
 
Business continuity plans must address both common and uncommon risks.

- *Common risks* are planned and expected. For example, in a cloud environment it's common for there to be *transient failures* including brief network outages, equipment restarts due to patches, timeouts when a service is busy, and so forth. Because these events happen regularly, workloads need to be resilient to them.

  A high availability strategy must consider and control for each risk of this type.

- *Uncommon risks* are generally the result of a catastrophic and unforeseeable event, such as natural disasters or major network attacks.

  Disaster recovery processes deal with these rare risks.

High availability and disaster recovery are interrelated, and so it's important to plan strategies for both of them together.

The same risk might be classified as HA for one workload and DR for another workload, depending on the business needs and the way the solution is designed. For example, for most solutions an outage of a full Azure region would be considered a disaster. But suppose you have designed a solution that uses multiple Azure regions in an active-active configuration with full replication and redundancy. In this situation, you might be more resilient to a regional outage and can automatically fail over to use other regions if a region is lost. This architecture means a region outage is covered as a high availability concern and not a disaster. However, such a design can be costly and complex to build.

### Risk mitigations

There are often several possible controls that can mitigate each risk. Part of business continuity planning is deciding which controls to apply for each specific situation based on the business needs. Many common mitigations are technical in nature and rely on how technology is configured or used. For example, you can build resiliency into a solution's design by using redundancy, data replication, failover, and backups. However, some controls might instead be based around business processes, such as by triggering a response playbook, or falling back to manual operations.

When you're considering which controls to apply, understand whether they require or assume downtime or data loss. For example, some controls require a human to be notified and then to respond, which takes time. If a solution requires high uptime, manual processes are likely to be too slow, and you should control many of the risks by using automated approaches. For more information, see [High availability](#high-availability).

For some risks, you can choose to operate the solution in a *degraded state*. When a solution operates in a degraded state, some components might be disabled or nonfunctional, but core business operations can continue to be performed. To learn more, see [Recommendations for self-healing and self-preservation](/azure/well-architected/reliability/self-preservation).

Risk migration can also come in the form of training and cultural changes. Individuals designing, implementing, operating, and evolving the workload should be competent, encouraged to speak up if they have concerns, and feel a sense of responsibility for the system.
	
Have a formal change control process for anything that would alter the state of the running system. For example, consider implementing the following processes:
	
- Workloads should be subject to rigorous testing commensurate with the criticality of the workload. Test code and component integrations to mitigate the risk associated with change. Every change to a system should undergo testing to help prevent a reliability-impacting change from reaching production.
- Introduce strategic quality gates as part of your workload's safe deployment practices.
- Formalize procedures for ad-hoc production access and data manipulation, because these activities present a high risk of causing reliability incidents. Procedures might include pairing with another engineer, using checklists, and getting peer reviews before executing scripts or applying changes.

## High availability

High availability is the state in which a specific workload can maintain its necessary level of uptime on a day-to-day basis, even during transient faults and intermittent failures. Because these events happen regularly, it's important that each workload is designed and configured for high availability in accordance with the requirements of the specific application and customer expectations. The HA of each workload contributes to your business continuity plan.

Because HA can vary with each workload, it's important to understand the requirements and customer expectations when determining high availability. For example, an application that's used within your organization might require a relatively low level of uptime, while a critical financial application might require a much higher uptime. Even within a workload, different *flows* might have different requirements. For example, in an eCommerce application, flows that support customers browsing and placing orders might be critical, while order fulfillment and back-office processing flows might be lower priority. To learn more about flows, see [Recommendations for identifying and rating flows](/azure/well-architected/reliability/identify-flows).
 
Commonly, uptime is measured based on the number of "nines" in the uptime percentage, such as 99.9% (three nines) or 99.95% (three and a half nines). The higher the uptime requirement, the less tolerance you have for outages, and the more work you have to do to reach that level of availability. Uptime isn't measured by the uptime of a single component like a node, but by the overall availability of the entire workload.

> [!IMPORTANT]
> Don't overengineer your solution to reach higher levels of reliability than are justified. Use business requirements to guide your decisions.

### High availability design elements

To achieve high availability, a workload may include many design elements.

> [!NOTE]
> Some workloads are *mission-critical*, which means any downtime can have severe consequences. If you're designing a mission-critical workload, there are specific things you need to think about when you design your solution and manage your business continuity. For more information, see the [Azure Well-Architected Framework: Mission-critical workloads](/azure/well-architected/mission-critical/mission-critical-overview).

#### Azure services and tiers that support high availability

Many Azure services are designed to be highly available, and can be used to build highly available workloads. Here are some examples:

- Azure Virtual Machine Scale Sets provide high availability for virtual machines (VMs) by automatically creating and managing VM instances, and distributing those VM instances to reduce the likelihood of failures.
- Azure App Service provides high availability through a variety of approaches, including automatically moving workers from an unhealthy node to a healthy node, and by providing capabilities for self-healing from many common fault types.

To understand the capabilities of each Azure service, see its [reliability guide](./overview-reliability-guidance.md). You can then decide which tiers to use, and which capabilities to include in your high availability strategy.
    
Review the service level agreements (SLAs) for each service to understand the expected levels of availability and the conditions you need to meet. You might need to select or avoid specific tiers of services to achieve certain levels of availability. Some services from Microsoft are offered with the understanding that no SLA is provided, such as development or basic tiers, or that the resource could be reclaimed from your running system, such as spot-based offerings. Also, some tiers have added reliability characteristics, such as support for [availability zones](availability-zones-overview.md). 

#### Redundancy

Redundancy is the practice of duplicating instances or data to increase the reliability of the workload. Often you can choose to distribute those replicas or redundant instances around a datacenter (*local redundancy*), between availability zones within a region (*zone redundancy*), or even across regions (*geo-redundancy*). Here are some examples:

- Azure App Service enables you to run multiple instances of your application, to ensure that the application remains available even if one instance fails. If you enable zone redundancy, those instances are spread across multiple availability zones in the Azure region you use.
- Azure Storage provides high availability by automatically replicating data at least three times. You can distribute those replicas across availability zones by enabling zone-redundant storage (ZRS), and in many regions you can also replicate your storage data across regions by using geo-redundant storage (GRS).
- Azure SQL Database has multiple replicas to ensure that the data remains available even if one replica fails.

To learn more about redundancy, see [Recommendations for designing for redundancy](/azure/well-architected/reliability/redundancy) and [Recommendations for using availability zones and regions](/azure/well-architected/reliability/regions-availability-zones).
 
#### Fault tolerance

Fault tolerance is the ability of a system to continue operating, in some defined capacity, in the event of a failure. For example, a web application might be designed to continue operating even if a single web server fails. Fault tolerance can be achieved through redundancy, failover, partitioning, graceful degradation, and other techniques.

Fault tolerance also requires that your applications handle transient faults. When you build your own code, you might need to enable transient fault handling yourself. Some Azure services provide built-in transient fault handling for some situations. For example, by default Azure Logic Apps automatically retries failed requests to other services. To learn more, see [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults).
 
#### Scalability and elasticity

Scalability and elasticity are the abilities of a system to handle increased load by adding and removing resources (scalability), and to do so quickly as your requirements change (elasticity). Scalability and elasticity can help a system maintain availability during peak loads.

Many Azure services support scalability. Here are some examples:

- Azure virtual machine scale sets, Azure API Management, and several other services support Azure Monitor autoscale, which enables you to specify policies like "when my CPU consistently goes above 80%, add another instance".
- Azure Functions can dynamically provision instances to serve your requests.
- Azure Cosmos DB supports autoscale throughput, where the service can automatically manage the resources assigned to your databases based on policies you specify.

Scalability is a key factor to consider during partial or complete malfunction. If a replica or compute instance is unavailable, the remaining components might need to bear more load to handle the load that was previously being handled by the faulted node. Consider *overprovisioning* if your system cannot scale quick enough to handle your expected changes in load.

For more information on how to design a scalable and elastic system, see [Recommendations for designing a reliable scaling strategy](/azure/well-architected/reliability/scaling).

#### Zero-downtime deployment techniques

Zero-downtime deployments enable you to deploy updates and make configuration changes without requiring downtime. Deployments and other changes introduce significant risk of downtime. Achieving high availability requires that you deploy in a controlled way, such as by updating a subset of your resources at a time, controlling the amount of traffic that reaches the new deployment, monitoring for any impact to your users, and rapidly remediating the issue or rolling back to a previous known-good deployment. To learn more about zero-downtime deployment techniques, see [Safe deployment practices](/devops/operate/safe-deployment-practices).

Azure itself uses zero-downtime deployment approaches for our own services. When you build your own applications, you can adopt zero-downtime deployments through a variety of approaches, such as:

- Azure Container Apps provides multiple revisions of your application, which can be used to achieve zero-downtime deployments.
- Azure Kubernetes Service (AKS) supports a variety of zero-downtime deployment techniques.

While zero-downtime deployments are often associated with application deployments, they should also be used for configuration changes too. Here are some ways you can apply configuration changes safely:

- Azure Storage enables you to change your access keys in stages, which prevents downtime during key rotation operations.
= Azure App Configuration provides feature flags, snapshots, and other capabilities to help you to control how configuration changes are applied.

If you decide not to implement zero-downtime deployments, define *maintenance windows* so you can make system changes at a time your users expect.

#### Automated testing

It's important to test your solution's ability to withstand the outages and failures that you consider to be in scope for HA. Many of these failures can be simulated in test environments. *Chaos engineering* involves testing your solution's ability to automatically tolerate or recover from a variety of fault types. Chaos engineering is critical for mature organizations with stringent standards for HA.

To learn more, see [Recommendations for designing a reliability testing strategy](/azure/well-architected/reliability/testing-strategy).

#### Monitoring and alerting

Monitoring lets you know the health of your system, even when automated mitigations take place. Monitoring is critical to understand how your solution is behaving, and to watch for early signals of failures like increased error rates or high resource consumption. Alerts enable you to be proactively notified of important changes in your environment.

Use Azure Service Health, Azure Resource Health, and Azure Monitor, as well as Scheduled Events for virtual machines.

For more information, see [Recommendations for designing a reliable monitoring and alerting strategy](/azure/well-architected/reliability/monitoring-alerting-strategy).

## Disaster recovery

A *disaster* is a distinct, uncommon, major event that has a larger and longer-lasting impact than an application can mitigate through the high availability aspect of its design. Examples of disasters include:
 
- **Natural disasters**, such as hurricanes, earthquakes, floods, or fires.
- **Human errors that result in a major impact**, such as accidentally deleting production data, or a misconfigured firewall that exposes sensitive data.
- **Major security incidents**, like denial of service or ransomware attacks that lead to data corruption, data loss, or service outages.
 
*Disaster recovery* is about planning how you respond to these types of situations.

> [!NOTE]
> You should follow recommended practices across your solution to minimize the likelihood of these events. However, even after careful proactive planning, it's prudent to plan how you would respond to these situations if they arise.

### Disaster recovery requirements

Due to the rarity and severity of disaster events, DR planning brings different expectations for your response. Many organizations accept the fact that, in a disaster scenario, some level of downtime or data loss is unavoidable. A complete DR plan must specify the following critical business requirements for each flow: 

- **Recovery Point Objective (RPO)** is the maximum duration of acceptable data loss in the event of a disaster. RPO is measured in units of time, such as "30 minutes of data" or "four hours of data."

- **Recovery Time Objective (RTO)** is the maximum duration of acceptable downtime in the event of a disaster, where "downtime" is defined by your specification. RTO is also measured in units of time, like "eight hours of downtime."

:::image type="content" source="media/disaster-recovery-rpo-rto.png" alt-text="Screenshot of RTO and RPO durations in hours." border="false":::

Each component or flow in the workload might have individual RPO and RTO values. Examine disaster-scenario risks and potential recovery strategies when deciding on the requirements. The process of specifying an RPO and RTO effectively creates DR requirements for your workload as a result of your unique business concerns (costs, impact, data loss, etc.).

> [!NOTE]
> While it's tempting to aim for an RTO and RPO of zero (no downtime and no data loss in the event of a disaster), in practice it's difficult and costly to implement. It's important for technical and business stakeholders to discuss these requirements together and make a decision about what realistic requirements should be. For more information, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

### Disaster recovery plans

Regardless of the cause of the disaster, it's important that you create a well-defined and testable DR plan. That plan will be used as part of infrastructure and application design to actively support it. You might create multiple DR plans for different types of situations. DR plans often rely on process controls and manual intervention.

DR isn't an automatic feature of Azure. However, many services do provide features and capabilities that you can use to support your DR strategies. You should review the [reliability guides for each Azure service](./overview-reliability-guidance.md) to understand how the service works and its capabilities, and then map those capabilities to your DR plan.

The following sections list some common elements of a disaster recovery plan, and describe how Azure can help you to achieve them.

#### Failover

Some disaster recovery plans involve provisioning a secondary deployment in another location. If a disaster affects the primary deployment of the solution, traffic can be *failed over* to the other site. Failover needs careful planning and implementation. Azure provides a variety of services to assist with failover, such as the following:

- Azure Site Recovery provides automated failover for on-premises environments, and for virtual machine-hosted solutions in Azure in the event of a region failure.
- Azure Front Door and Azure Traffic Manager each enable automated failover between different deployments of your solution, such as in different regions.

#### Backups

Backups involve taking a copy of your data and storing it safely for a defined period of time. Backups help you to recover from disasters when you can't automatically fail over to another replica, or where data corruption has occurred.

Many Azure data and storage services support backups, such as the following:

- Azure Backup provides automated backups for virtual machine disks, storage accounts, AKS, and a variety of other sources.
- Many Azure database services, including Azure SQL Database and Azure Cosmos DB, have an automated backup capability for your databases.
- Azure Key Vault provides features to back up your secrets, certificates, and keys.

Because backups are typically taken infrequently, restoring a backup can result in some data loss. Ensure that the RPO of the workload is aligned with the backup interval.

#### Automated deployments

Infrastructure as code (IaC) assets, such as Bicep files, ARM templates, or Terraform configuration files, can be part of a disaster recovery strategy. If you need to deploy new resources to respond to a disaster, then using IaC can help you to rapidly deploy and configure those resources based on your requirements, and reduce your RTO compared to manually deploying and configuring resources.

#### Testing and drills

It's critical that you routinely validate and test your DR plans, and your wider reliability strategy. By testing your DR plans, you also help to validate that your RTO is feasible, and you can identify opportunities to optimize your processes. To learn more, see [Recommendations for designing a reliability testing strategy](/azure/well-architected/reliability/testing-strategy).

To learn more about disaster recovery planning, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery).

## Related content

- Use the [Azure service reliability guides](./overview-reliability-guidance.md) to understand how each Azure service supports reliability in its design, and to learn about the capabilities you can build into your HA and DR plans.
- Use the [Azure Well-Architected Framework: Reliability pillar](/azure/well-architected/reliability) to learn more about how to design a reliable workload on Azure.
- Use the [Well-Architected Framework perspective on Azure services](/azure/well-architected/service-guides/) to learn more about how to configure each Azure service to meet your requirements for reliability and across the other pillars of the Well-Architected Framework.
