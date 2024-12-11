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

Business continuity, as its name implies, is about how your business can continue to remain operational - even in the face of problems or disasters. Business continuity planning involves identifying and managing risks that might impede your operations, ensuring that you can continue operating during adverse events. It's also about a lot more than just the cloud platform you run on: it involves a combination of people, process, and technology working together.

This article provides a high-level summary of business continuity planing and risk management as it pertains to reliability in the cloud. For more detailed guidance, refer to the [Azure Well-Architected Framework](/azure/well-architected/).

> [!NOTE]
> Some workloads are *mission-critical*, which means any failures can have severe consequences. If you're designing a mission-critical workload, there are specific things you need to think about when you design your solution and manage your business continuity. For more information, see the [Azure Well-Architected Framework: Mission-critical workloads](/azure/well-architected/mission-critical/mission-critical-overview).

## Risk management

Planning for business continuity is fundamentally about identifying, understanding, classifying, and managing risks.

Some risks are commonplace, planned, and expected. They should be well controlled. Typically these risks fall into the realm of *high availability* (HA), which is about how you maintain operations on a day-to-day basis even with intermittent failures or *blips*. For example, in a cloud environment it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so forth. Because these events happen regularly, you need to be resilient to them. There are a range of approaches you can use to achieve that resiliency.

In contrast, other risks are unusual and might happen as a result of catastrophic and unforeseeable events. These events are often called *disasters*, and your ability to manage these events and their associated risks and effects is called *disaster recovery* (DR). It's common to have different processes in place for dealing with disasters compared to day-to-day events, and to have different expectations for how long it takes to recover and what effects you might experience.

HA and DR are tightly interrelated, and you should consider and plan strategies for both of them together. It's also common to have some risks that might not fit neatly into either category, and that might require negotiation or discussion.

It's important that business continuity planning is conducted with a range of stakeholders, with representation from technical and business stakeholders and leadership. Everyone needs to understand that the process involves making explicit decisions about how to respond to different risks, and that each decision has tradeoffs. It also requires looking broadly at your business to understand how a specific workload or application fits into the wider business. By understanding your business well, you can make decisions about how to prioritize your resources, and whether you have opportunities to go beyond technical solutions to manage your risks.

## Identify the risks

When you run a solution in the cloud, there are a range of events that can happen. These events can affect the resources that your workload uses. The following table is a non-exhaustive list of example events, ordered by severity:

| Example risk | Description | Regularity (likelihood) |
|---|---|---|
| Transient network issue | A temporary failure in a component of the networking stack, which is recoverable after a short time (usually a few seconds or less). | Regular |
| Virtual machine reboot | A virtual machine that you use, or that a dependent service uses, reboots unexpectedly because it crashes or needs to apply a patch. | Regular |
| Hardware failure | A failure of a hardware node, rack, or cluster within a datacenter. | Occasional |
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

Use the risks listed as a starting point to identify the risks that apply to your solution.

> [!NOTE]
> The tables includes security, operational, and performance risks because they directly affect your solution's reliability. Business continuity planning should encompass all activities and risks that could impact the availability and usability of your solution, ensuring a comprehensive approach to maintaining operations under any circumstances.
>
> For example, a denial of service attack is a security issue that causes problems with your solution's reliability. You might mitigate this kind of risk by using a combination of security controls and resiliency controls.
>
> The [Azure Well-Architected Framework](/azure/well-architected/) describes how these different elements of your solution are interrelated, and provides guidance on making tradeoffs between them.

## Understand each risk

After you've identified each risk, strive to understand the risk sufficiently that you can make an informed decision about whether and how to control it.

Determine the severity of the risk based on its business impact. Consider the following issues:

- Could this risk cause downtime? If yes, is that downtime unacceptable?
- Could this risk cause data loss? If yes, is that data loss unacceptable?

You should also determine the likelihood of the risk occuring. Consider the following issues:

- What's the base level of risk for this issue? For cloud platform risks, use the table in the preceding section as a starting point. For other risks, determine the likelihood based on your own historical data if it's available.
- Is the solution design already robust to this risk? For example, is the system designed to use [data partitioning](/azure/well-architected/reliability/partition-data), or it is using an approach like the [Bulkhead pattern](/azure/architecture/patterns/bulkhead)?
- What mitigations have you already applied? For example, have you protected against rogue administrators by using approaches like just-in-time authorization controls?

The likelihood and severity of each risk might be unique to your business, or even to the specific workload you're considering. These factors must be informed by your business requirements. For more information on business requirements and how they affect your resiliency, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

## Classify each risk

The goal of classifying each risk is to determine whether you need to account for the risk in everyday operations (high availability), or if it's associated with an exceptional or catastrophic scenario (disaster).

To make an informed decision about how to classify each risk, you must understand the business requirements of the workload. Consider the following factors:

- The budget available for the solution.
- The ongoing operational model for the solution, such as whether there are people available to respond to an issue at all times.
- The expected uptime for the solution, how that's defined, and [which flows it applies to](/azure/well-architected/reliability/identify-flows).
- How much downtime and data loss is acceptable in a disaster scenario.

The same risk might be classified as HA for one workload and DR for another workload, depending on the business needs and the way the solution is designed.

For example, for most solutions an outage of a full Azure region would be considered a disaster. But, if you have a fully active-active multi-region solution design, you might be more resilient to a regional outage and can fail over to use other regions instead.

Similarly, requirements can be different for different kinds of situations. If you define a region failure as a disaster, and an availability zone failure (datacenter failure) as something you need to deal with under your high availablity plan, then the downtime and data loss that are acceptable will be different for those events. Similarly, during a disaster you typically don't consider uptime targets, because they are measured within the context of high availability.

## Control each risk

There are a range of different controls available for each risk. You can decide which controls to apply for your specific situation and needs.

There are multiple ways you can group controls, including:

- **Technical or process.** Technical controls include strategies you can build into your solution's design like redundancy, data replication, failover, and backups. Process controls include triggering a response playbook, or failing back to manual operations.

- **Proactive or reactive.** Some controls are applied proactively when you design the solution, while others are engaged reactively when or after a problem occurs.

- **Automated or manual.** Controls might be fully automated, such as self-healing or automated failover. Other controls might require manual intervention, such as restoring from backup or making an explicit decision to fail over to another instance of the solution.

When you're considering which controls to apply, understand whether they require or assume downtime or data loss. For example, reactive manual controls typically require a human to be notified and then to respond, which takes time. If your solution requires high uptime, you need to control many of the risks by using automated technical controls. To learn more, see [What is high availability?](./concept-high-availability.md).

For some risks, you might decide to continue to operate your solution in a *degraded state*. When your solution operates in a degraded state, some components might be disabled or non-functional, but core business operations can continue to be performed. To learn more, see [Recommendations for self-healing and self-preservation](/azure/well-architected/reliability/self-preservation).

> [!TIP]
> Create a *risk register*, which details each risk, its impact, and what you're doing to control it. Review the risk register on a regular basis, and look for new controls that you can apply to improve your responsiveness.

## Next steps

For more information about how to control different levels of risk, see [What is high availability?](./concept-high-availability.md) and [What is disaster recovery?](./concept-disaster-recovery.md).
