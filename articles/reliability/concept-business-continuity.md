---
title: What is business continuity?
description: Understand business continuity for your Microsoft Azure-based solutions.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 12/10/2024
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# What is business continuity?

*Business continuity* is the state in which your business is able to continue to remain operational, even during a disaster or outage. 

Planning for business continuity is about identifying, understanding, classifying, and managing risks. For successful a *business continuity plan*, it is essential to:

- **Identify risks** such as network issue, hardware failures, or a region outage. 

- **Classify risks** as either a day-to-day risk (high availability) or a catastrophic risk (disaster recovery).

- **Design for HA or DR to minimize risks** such as using redundancy, backups, or failover.

A business continuity plan doesn't only take into consideration the resiliency features of the cloud platform itself, or even the features of your application. Business continuity is achieved by incorporating all aspects of support in your business such as people, business-related manual or automated processes, and other technologies.

This article provides a high-level summary of business continuity planning, covering risk identification, classification, and management as it pertains to reliability in the cloud. For detailed guidance on how to architect for business continuity , go to [Azure Well-Architected Framework](/azure/well-architected/).

> [!NOTE]
> Some workloads are *mission-critical*, which means any failures can have severe consequences. If you're designing a mission-critical workload, there are specific things you need to think about when you design your solution and manage your business continuity. For more information, see the [Azure Well-Architected Framework: Mission-critical workloads](/azure/well-architected/mission-critical/mission-critical-overview).


## Classification of risks

A business continuity plan must address both types of risk classificaiton: *high availability risks* and *disaster recovery risks*.


- **Disaster recovery risks** are unusual, as they are are the result of a catastrophic and unforeseeable event, such as natural disasters or network attacks. DR processes for dealing with rare disaster risks are different from the day-to-day risks of [high availability](#high-availability-risks). Due to the rarity and severity of disaster events, DR planning has different expectations for how long it takes to recover.

- High availability risks are commonplace, planned, and expected, and so should easily be controlled.  For example, in a cloud environment it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so forth. Because these events happen regularly, workloads need to be resilient to them. 

### High availability 

High availability (HA) is the state in which a specific workload can maintain uptime on a day-to-day basis, even during transient faults and intermittent failures. For example, in a cloud environment, it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so on. Because these events happen regularly, it's important that each workload is designed and configured for high availability in accordance with the requirements of the specific application and customer expectations.  The HA of each workload contributes to your business continuity plan.

Because HA can vary with each workload, it's important to understand the requirements and customer expectations when determining high availability. For example, an application that's used within your organization might require a relatively low level uptime, while a critical financial application might require a much higher uptime. The higher the uptime, the more work you have to do to reach that level of availability. 

When defining high availability, a workload architect defines:

- A **service level objective (SLO)** that describes the percentage of time the workload should be available to users. 
- **Service level indicators** (SLI), which are specific metrics that are used to measure whether the workload is meeting an SLO. 

It is also important to understand that HA is not measured by the uptime of a single node, but by the overall availability of the entire workload. For more detailed information on how to define and measure high availability, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).


## Disaster recovery

A *disaster* is a single, generally uncommon, major event that has a larger and longer-lasting impact than an application can mitigate through the high availability aspect of its design. 

A disaster could be any one of the following events:

- A natural disaster such as a hurricane, earthquake, flood, or fire.
- Human error such as accidentally deleting production data, or a misconfigured firewall that exposes sensitive data.
- Ransomware attacks that lead to data corruption, data loss, or service outages.

*Disaster recovery (DR)* is not an automatic feature of Azure, although many services do provide features that you can use to support your DR. DR is about understanding what your services support, and planning for and responding to these possible disasters so as to minimize downtime and data loss. Regardless of the cause the disaster, it is important that you create a well-defined and tested DR plan, and an application design that actively supports it.

> [!NOTE]
> Different organizations might define *disaster* in different ways. For example, a complete region loss is usually considered a disaster. But, if you have a multi-region active/active solution design, you might be able to recover automatically from a region outage with no data loss or downtime, and so you might consider a region loss to be part of your high availability strategy instead. To learn more, see [What is business continuity?](./concept-business-continuity.md).



## Step 1 - Identify risks

Before you determine which risks are high availability risks and which are disaster recovery risks, you need to identify all the risks that could affect your solution. 

When you run a solution in the cloud, there are a range of events that can happen. These events can affect the resources that your workload uses. The following table is a non-exhaustive list of example events, ordered by severity.  Use the risks listed as a starting point to identify the risks that apply to your solution.

| Example risk | Description | Regularity (likelihood) |
|---|---|---|
| Transient network issue | A temporary failure in a component of the networking stack, which is recoverable after a short time (usually a few seconds or less). | Regular | 
| Virtual machine reboot | A virtual machine that you use, or that a dependent service uses, reboots unexpectedly because it crashes or needs to apply a patch. | Regular | 
| Hardware failure | A failure of a hardware node, rack, or cluster within a datacenter. | Occasional | HA |
| Datacenter outage | An outage that affects most or all of a datacenter, such as a power failure, network connectivity problem, or issues with the heating and cooling. | Unusual | 
| Region outage | An outage that affects an entire metropolitan area or wider area, such as a major natural disaster. | Very unusual | 

You should also consider risks beyond the cloud platform and infrastructure, like the following examples:

| Example risk | Description |
|---|---|
| Data loss or corruption | Data has been deleted, overwritten, or otherwise corrupted by an accident, or from a security breach like a ransomware attack. |
| Failed deployments | A deployment of a new component or version has failed, leaving your solution in an inconsistent state. | 
| Denial of service attacks | Your system has been attacked in an attempt to prevent legitimate use of the solution. | 
| Rogue administrators | A user with administrative privileges has intentionally performed a damaging action against the system. | 
| Unexpected influx of traffic to an application | A spike in traffic has overwhelmed your system resources. | 

<!-- 

It's important that business continuity planning is conducted with a range of stakeholders, with representation from technical and business stakeholders and leadership. Everyone needs to understand that the process involves making explicit decisions about how to respond to different risks, how to categorize them (as HA or DR related) and that each decision has tradeoffs. It also requires looking broadly at your business to understand how a specific workload or application fits into the wider business. By understanding your business well, you can make decisions about how to prioritize your resources, and whether you have opportunities to go beyond technical solutions to manage your risks.
-->

## Risk severity, likelihood, and tradeoff

After you've identified each risk, you'll need to classify each as HA or DR. To classify the risk, you need to first determine:

- **Risk severity**, which is the severity of the risk based on business impact.
- **Risk likelihood**, which is the likelihood of that risk occurring.
- **Risk tradeoff**, which is the tradeoff between the cost of mitigating the risk and the cost of the risk occurring.

The severity, likelihood, and tradeoff of each risk might be unique to your business, or even to the specific workload you're considering. These factors must be informed by your business requirements. For more information on business requirements and how they affect your resiliency, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).


### Risk severity

To determine risk severity, consider the following issues:

- *Could this risk cause downtime?* If yes, is that downtime unacceptable or, if acceptable, how much downtime is acceptable?

- *Could this risk cause data loss?* If yes, is that data loss unacceptable or, if acceptable, how much data loss is acceptable?


### Risk likelihood

To determine risk likelihood, consider the following issues:

- *What's the base level likelihood of risk for this issue?* For cloud platform risks, use the [table in the preceding section](#identify-risks) as a starting point. For other risks, determine the likelihood based on your own historical data if it's available.

- *Is the solution design already robust to this risk?* For example, is the system designed to use [data partitioning](/azure/well-architected/reliability/partition-data), or it is using an approach like the [Bulkhead pattern](/azure/architecture/patterns/bulkhead)?

- *What mitigations have you already applied?* For example, have you protected against rogue administrators by using approaches like just-in-time authorization controls?


### Risk tradeoffs

The risk tables in the previous section include security, operational, and performance risks because they directly affect your solution's reliability. Business continuity planning should encompass all activities and risks that could impact the availability and usability of your solution, ensuring a comprehensive approach to maintaining operations under any circumstances.

For example, a denial of service attack is a security issue that causes problems with your solution's reliability. You might mitigate this kind of risk by using a combination of security controls and resiliency controls.

The [Azure Well-Architected Framework](/azure/well-architected/) describes how these different elements of your solution are interrelated, and provides guidance on making tradeoffs between them.


## Step 2 - Classify risks

The goal of classifying each risk is to determine whether you need to account for the risk in everyday operations (high availability), or if it's associated with an exceptional or catastrophic scenario (disaster).

To make an informed decision about how to classify each risk, you must understand the business requirements of the workload. Consider the following factors:

- The budget available for the solution.
- The ongoing operational model for the solution, such as whether there are people available to respond to an issue at all times.
- The expected uptime for the solution, how that's defined, and [which flows it applies to](/azure/well-architected/reliability/identify-flows).
- How much downtime and data loss is acceptable in a disaster scenario.

It's important to remember that high availability and disaster recovery are tightly interrelated, and so its important to plan strategies for both of them together.  There are some risks that may not fit neatly into either category, and so may require require further negotiation or discussion.

Also, the same risk might be classified as HA for one workload and DR for another workload, depending on the business needs and the way the solution is designed.

For example, for most solutions an outage of a full Azure region would be considered a disaster. But, if you have a fully active-active multi-region solution design, you might be more resilient to a regional outage and can fail over to use other regions instead.

Similarly, requirements can be different for different kinds of situations. If you define a region failure as a disaster, and an availability zone failure (datacenter failure) as something you need to deal with under your high availablity plan, then the downtime and data loss that are acceptable will be different for those events. Similarly, during a disaster you typically don't consider uptime targets, because they are measured within the context of high availability.


## Step 3 - Control each risk

There are a range of different controls available for each risk. You can decide which controls to apply for your specific situation and needs.

There are multiple ways you can group controls, including:

- **Technical or process.** Technical controls include strategies you can build into your solution's design like redundancy, data replication, failover, and backups. Process controls include triggering a response playbook, or failing back to manual operations.

- **Proactive or reactive.** Some controls are applied proactively when you design the solution, while others are engaged reactively when or after a problem occurs.

- **Automated or manual.** Controls might be fully automated, such as self-healing or automated failover. Other controls might require manual intervention, such as restoring from backup or making an explicit decision to fail over to another instance of the solution.

When you're considering which controls to apply, understand whether they require or assume downtime or data loss. For example, reactive manual controls typically require a human to be notified and then to respond, which takes time. If your solution requires high uptime, you need to control many of the risks by using automated technical controls. To learn more, see [What is high availability?](./concept-high-availability.md).

For some risks, you might decide to continue to operate your solution in a *degraded state*. When your solution operates in a degraded state, some components might be disabled or non-functional, but core business operations can continue to be performed. To learn more, see [Recommendations for self-healing and self-preservation](/azure/well-architected/reliability/self-preservation).

> [!TIP]
> Create a *risk register*, which details each risk, its impact, and what you're doing to control it. Review the risk register on a regular basis, and look for new controls that you can apply to improve your responsiveness.


### Design for high availability

To achieve high availability, a workload may use include the following design elements:

 - **Use services and tiers that support high availability**. For example, Azure offers a variety of services that are designed to be highly available, such as Azure Virtual Machines, Azure App Service, and Azure SQL Database. These services are designed to provide high availability by default, and can be used to build highly available workloads. You might need to select specific tiers of services to achieve high levels of availability.
 - **Redundancy** is the practice of duplicating instances or data to increase the reliability of the workload. For example, a web application might use multiple instances of a web server to ensure that the application remains available even if one instance fails. A database may have a multiple replicas to ensure that the data remains available even if one replica fails. You can choose distribute those replicas or redundant instances around a data center, between availability zones within a region, or even across regions.
 - **Fault tolerance** is the ability of a system to continue operating in the event of a failure. For example, a web application might be designed to continue operating even if a single web server fails. Fault tolerance can be achieved through redundancy, failover, and other techniques.
 - **Scalability and elasticity** are the abilities of a system to handle increased load by adding resources. For example, a web application might be designed to automatically add additional web servers as traffic increases. Scalability and elasticity can help a system maintain availability during peak loads. For more information on how to design a scalable and elastic system, see [Scalability and elasticity](/azure/well-architected/reliability/scaling).
 - **Monitoring and alerting** lets you know the health of your system, even when automated mitigations take place. Use Azure Service Health, Azure Resource Health, and Azure Monitor, as well as Scheduled Events for virtual machines. For more information on how to design a reliability monitoring and alerting strategy, see [Monitoring and alerting](/azure/well-architected/reliability/monitoring-alerting-strategy).
 - 

### Design for disaster recovery

Disaster recovery isn't an automatic feature, but must be designed, built, and tested. To support a solid DR strategy, you must design your workload with DR in mind from the ground up. Azure offers services, features, and guidance to help support your DR needs.

In the Azure public cloud platform, resiliency in general is a [shared responsibility](concept-shared-responsibility.md) between Microsoft and you. Because there are different levels of resiliency in each workload that you design and deploy, it's important that you understand who has primary responsibility for each one of those levels from a resiliency perspective. In the case of DR, some Azure services automatically fail over to alternate regions during incidents. Microsoft manages the failover process for those services. However, Microsoft-initiated failover is usually performed as a last resort and after significant time has been spent on recovery attempts. In general, Microsoft's policy is to minimize data loss even if that means a longer recovery time. You shouldn't rely exclusively on Microsoft-initiated failover for your own solutions, especially if you need to minimize your recovery time. If you can, use [customer-initiated failover for services like Azure Storage](/azure/storage/common/storage-initiate-account-failover).

#### Create disaster recovery plans

Because disasters are, by definition, uncommon, you need to plan how you'll respond if they occur. Create one or more *disaster recovery plans* that contain detailed information about how you expect to respond to different types of disaster. DR plans are sometimes called *playbooks*.

For example, suppose you're creating a disaster recovery plan for a catastrophic loss of an Azure region. The plan might include the following steps:

1. Proactively notify important stakeholders that you are experiencing some downtime, and that (depending on your RPO) you might expect some data loss.
1. Publish information to your users to advise that there's an issue, and that you are preparing to respond.
1. Wait a predefined amount of time to see if the resources in the region can be recovered and for an estimated time for recovery. While you're waiting, prepare to execute the remaining steps in the plan.
1. Scale out your application services in a secondary region to prepare for a large influx of production traffic.
1. Restore your database backups to a database server in the secondary region.
1. Update your DNS records to redirect traffic to the secondary region.

For any actions that require manual intervention, document the steps clearly. Provide well-tested scripts that can execute commands. Remember that, in a disaster scenario, the people executing your plan are likely to be under situational stress, so make the process as straightforward as you can.

#### Test your plans through DR drills

It's critical that you validate your plans regularly by performing *DR drills*.

Try to be as comprehensive as possible, including activities like restoring from backups. Not only does regular testing help you to verify that your components are configured correctly, it helps to familiarize your team with the processes so they're used to them and won't be surprised by them if a disaster does strike.

#### Decide when to activate a disaster recovery plan

You need to decide whether and when to activate your DR plan, including when there might be uncertainty or ambiguity.

> [!NOTE]
> It's valid to include a "wait and see" step in your disaster recovery plan, if your organization can cope with some downtime for the workload. Many types of unexpected issues are resolved by the platform vendor, and prematurely activating a disaster recovery plan might cause more issues and result in unnecessary data loss. Work with your business stakeholders to decide how much time is reasonable to wait before taking proactive action.

The steps in disaster recovery plans can be complex and might even result in data loss. It's important to be prudent about when to execute a DR plan. Each plan should have a clear set of conditions to validate whether the plan is applicable to that situation.

Sometimes, you might get advanced notice of an impending disaster. For example, if a major weather event is forecast in the region that you host your workloads in, you might receive notice that service disruption is possible or expected. However, Azure is set up to withstand many major weather events and other natural disasters, so don't assume that you'll experience an outage unnecessarily.

Azure publishes guidance about service disruptions, including the resources available to understand whan an incident is happening and its scope, and when and how to contact Azure Support. To learn more, see [What to do during an Azure service disruption](incident-response.md).



## Next steps

For more information about how to control different levels of risk, see [What is high availability?](./concept-high-availability.md) and [What is disaster recovery?](./concept-disaster-recovery.md).
