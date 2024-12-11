---
title: Disaster recovery overview for Microsoft Azure products and services
description: Disaster recovery overview for Microsoft Azure products and services
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 11/30/2024
ms.author: anaharris
ms.custom: subject-reliability
ms.subservice: azure-reliability
---

# What is disaster recovery?

A disaster is a single, major event with a larger and longer-lasting impact than an application can mitigate through the high availability part of its design. Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters. They can also be unrelated to the cloud platform, such as somebody accidentally deleting production data or data corruption due to a ransomware attack. Disasters can result in downtime and data loss.

Regardless of the cause, the best way to respond to a disaster is a well-defined and tested DR plan and an application design that actively supports DR.

> [!NOTE]
> Different organizations might define "disaster" in different ways. For example, a complete region loss is usually considered a disaster. But, if you have a multi-region active/active solution design, you might be able to recover automatically from a region outage with no data loss or downtime, and so you might consider a region loss to be part of your high availability strategy instead. To learn more, see [What is business continuity?](./concept-business-continuity.md).

The information in this article provides a high-level overview of disaster recovery. To learn more, see the [Azure Well-Architected Framework guidance on disaster recovery strategies](/azure/well-architected/reliability/disaster-recovery)

## Recovery objectives

A complete DR plan must specify the following critical business requirements for each process the application implements: 

- **Recovery Point Objective (RPO)** is the maximum duration of acceptable data loss in the event of a disaster. RPO is measured in units of time, not volume, such as "30 minutes of data" or "four hours of data." RPO is about limiting and recovering from data loss, not data theft. 

- **Recovery Time Objective (RTO)** is the maximum duration of acceptable downtime in the event of a disaster, where "downtime" is defined by your specification. For example, if the acceptable downtime duration in a disaster is eight hours, then the RTO is eight hours. 

:::image type="content" source="media/disaster-recovery-rpo-rto.png" alt-text="Screenshot of RTO and RPO durations in hours." border="false":::

While it's tempting to am for an RTO and RPO of zero (no downtime and no data loss in the event of a disaster), in practice it's difficult and costly to implement. It's important for technical and business stakeholders to discuss these requirements together and make a decision about what realistic requirements should be. For more information, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

Each workload should have individual RPO and RTO values by examining disaster-scenario risks and potential recovery strategies. The process of specifying an RPO and RTO effectively creates DR requirements for your application as a result of your unique business concerns (costs, impact, data loss, etc.).

## Design for disaster recovery

Disaster recovery isn't an automatic feature, but must be designed, built, and tested. To support a solid DR strategy, you must design your workload with DR in mind from the ground up. Azure offers services, features, and guidance to help you support your DR needs.

Some Azure services automatically fail over to alternate regions during incidents. Microsoft manages the failover process for those services. However, Microsoft-initiated failover is usually performed as a last resort and after significant time has been spent on recovery attempts. In general, Microsoft's policy is to minimize data loss even if that means a longer recovery time. You shouldn't rely exclusively on Microsoft-initiated failover for your own solutions, especially if you need to minimize your recovery time. If you can, use [customer-initiated failover for services like Azure Storage](/azure/storage/common/storage-initiate-account-failover).

## Build resilient applications  

Disaster scenarios also commonly result in downtime, whether due to large-scale network connectivity problems, datacenter outages, damaged virtual machines (VMs), or corrupted software deployments. In most cases, application recovery involves failover to a separate, working deployment. As a result, it may be necessary to recover processes in another Azure region in the event of a large-scale disaster. Additional considerations may include: recovery locations, number of replicated environments, and how to maintain these environments.

Depending on your application design, you can use several different strategies and Azure features, such as [Azure Site Recovery](/azure/site-recovery/site-recovery-overview), to improve your application's support for process recovery after a disaster. 

## Create disaster recovery plans

Because disasters are, by definition, uncommon, you need to plan how you'll respond if they occur. Create one or more *disaster recovery plans* that contain detailed information about how you expect to respond to different types of disaster. DR plans are sometimes called *playbooks*.

For example, suppose you're creating a disaster recovery plan for a catastrophic loss of an Azure region. The plan might include the following steps:

1. Proactively notify important stakeholders that you are experiencing some downtime, and that (depending on your RPO) you might expect some data loss.
1. Publish information to your users to advise that there's an issue, and that you are preparing to respond.
1. Wait a predefined amount of time to see if the resources in the region can be recovered and for an estimated time for recovery. While you're waiting, prepare to execute the remaining steps in the plan.
1. Scale out your application services in a secondary region to prepare for a large influx of production traffic.
1. Restore your database backups to a database server in the secondary region.
1. Update your DNS records to redirect traffic to the secondary region.

For any actions that require manual intervention, document the steps clearly. Provide well-tested scripts that can execute commands. Remember that, in a disaster scenario, the people executing your plan are likely to be under situational stress, so make the process as straightforward as you can.

### Test your plans through DR drills

It's critical that you validate your plans regularly by performing *DR drills*.

Try to be as comprehensive as possible, including activities like restoring from backups. Not only does regular testing help you to verify that your components are configured correctly, it helps to familiarize your team with the processes so they're used to them and won't be surprised by them if a disaster does strike.

## Decide when to activate a disaster recovery plan

You need to decide whether and when to activate your DR plan, including when there might be uncertainty or ambiguity.

> [!NOTE]
> It's valid to include a "wait and see" step in your disaster recovery plan, if your organization can cope with some downtime for the workload. Many types of unexpected issues are resolved by the platform vendor, and prematurely activating a disaster recovery plan might cause more issues and result in unnecessary data loss. Work with your business stakeholders to decide how much time is reasonable to wait before taking proactive action.

The steps in disaster recovery plans can be complex and might even result in data loss. It's important to be prudent about when to execute a DR plan. Each plan should have a clear set of conditions to validate whether the plan is applicable to that situation.

Sometimes, you might get advanced notice of an impending disaster. For example, if a major weather event is forecast in the region that you host your workloads in, you might receive notice that service disruption is possible or expected. However, Azure is set up to withstand many major weather events and other natural disasters, so don't assume that you'll experience an outage unnecessarily.

Azure publishes guidance about service disruptions, including the resources available to understand whan an incident is happening and its scope, and when and how to contact Azure Support. To learn more, see [What to do during an Azure service disruption](incident-response.md).

> [!IMPORTANT]
> It's also important to understand who makes decisions about failover. For example, if you use Microsoft-managed failover with an Azure Storage acount, it's important to be aware that Microsoft only would initiate failover in an extreme and catastrophic disaster. You should usually use customer-managed failover for storage accounts instead, and incorporate the failover processes into your disaster recovery plans. For more information, see [Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance).

## Next steps

- [Azure Well-Architected Framework guidance on disaster recovery strategies](/azure/well-architected/reliability/disaster-recovery)
- [Cloud Adaption Framework for Azure - Business continuity and disaster recovery](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery)
