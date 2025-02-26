---
title: What to do during an Azure service disruption
description: Understand what to do in an Azure service disruption, how to prioritize business continuity, consider your disaster recovery plan, and contact Azure support.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.custom: subject-reliability
ms.date: 12/03/2024
ms.author: anaharris
---

# What to do during an Azure service disruption

At Microsoft, we work hard to make sure that our services are always available to you when you need them. However, unplanned service disruptions do occur. This article explains what happens when they do.

Microsoft provides a Service Level Agreement (SLA) for many of its services as a commitment for uptime and connectivity. The SLA for individual Azure services can be found at [Azure Service Level Agreements](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Understand incident scope

When there's an incident, if you understand the scope of that incident, you can determine the best course of action. 

To understand the scope of an incident, follow these steps:

1. Go to [Azure Service Health](/azure/service-health/overview), which provides:

    - **Information on issues or events** that might be impacting your services.

    - **[Automatic incident update alerts](/azure/service-health/alerts-activity-log-service-notifications-portal)**, so that you can be notified of any incident status updates automatically.  When Microsoft understands the scope of an incident, we update the incident status. You can configure these status updates to go to an Azure Monitor action group, which can send alerts to a variety of places like an email address or to your own incident management system.

1. If you have issues accessing the Azure portal, go to [Azure status](https://azure.status.microsoft/).

    > [!NOTE]
    > [Azure status](https://azure.status.microsoft/) only shows widespread issues that [meet certain criteria](https://aka.ms/StatusPageCriteria).  Because the Azure Status page doesn't know which subscriptions and tenants you manage, it cannot provide an accurate view of smaller issues that may be impacting your services.

1. If there are issues with the status page, check for posts from [@AzureSupport](https://x.com/azuresupport) on the social platform X.

### Availability zone and datacenter incidents

Many issues are limited to a single [availability zone](availability-zones-overview.md). Availability zones represent datacenters, or groups of datacenters, that are isolated from other availability zones in the same region. When an availability zone experiences an issue, the impact you see depends on the way a service is deployed:

- *Zonal services* that are pinned to the affected availability zone might be affected.
- *Zone-redundant services* are unlikely to be affected. You shouldn't need to take any remediation action for zone-redundant resources.
- *Regional (non-zonal) services* might be affected because they may use the affected availability zone.

To learn more about availability zone support in Azure services and the differences between zonal, zone-redundant, and regional (non-zonal) services, see [Azure services with availability zone support](./availability-zones-service-support.md).

If there are any concerns with zonal or regional resources deployed in the affected availability zone, consider initiating your [business continuity](#prioritize-business-continuity) and [disaster recovery](#consider-your-disaster-recovery-plan) (BC/DR) plans.

#### Logical vs. physical availability zones

Each Azure subscription sees a different list of availability zones. The *logical* zones used by each subscription may correspond to different *physical* zones. You can map between your logical zones and the physical zones to confirm which resources run in the affected physical availability zone. For more information, see [physical and logical availability zones](availability-zones-overview.md#physical-and-logical-availability-zones).

### Region-wide incidents

Occasionally, issues affect an entire region. Region-wide issues can happen when a region doesn't have availability zones. When a region-wide incident occurs, you may need to consider [initiating your disaster recovery plan](#consider-your-disaster-recovery-plan). You plan might include failing over to another region.

## Prioritize business continuity

When faced with an incident, the top priority is to keep your business operations running. Too much focus on isolating or fixing the cause of an issue can divert your attention from restoring your solution's operations and maintaining business continuity.

The following factors present situations where you don't necessarily need to do anything in order to preserve business continuity:

- *The actual impact* of the issue on your production resources, and on your users or workloads. For example, an issue that occurs outside of standard business hours might not require you to do anything immediately.

- *The scope of the incident.* For issues isolated to a single availability zone, you might not need to do anything if you're using zone-redundant resources or if the resources you use are in an unaffected physical availability zone.

- *The estimated resolution time*, if it's available. Microsoft strives to provide clear timelines for recovery as soon as we can. If your recovery procedures take a significant period of time to operate, consider whether the issue is expected to be resolved by the time they're completed.

- *The service level objectives (SLOs)* established with your impacted workload's users, if you have them. SLOs are there to guide decision making in this kind of situation. For example, in some situations you may be able to switch to manual operations until your services are healthy, and this decision might be reflected in your SLO for the system. To learn more about SLOs and how to define them, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics) in the Azure Well-Architected Framework.

However, if business continuity requires some form of action, and you do have a disaster recovery plan in place, then your next step is to consider whether to initiate that plan. 

## Consider your disaster recovery plan

A disaster recovery plan explains what you expect to do in the event of a major incident. Disaster recovery plans commonly include actions like the following:

- For an isolated outage within an availability zone, scale out the resource if you can.
- For an availability zone outage when you use zonal services, deploy into another availability zone and fail over to another availability zone.
- For an availability zone outage when you use zone-redundant services, you might not need to do anything. If you observe performance problems, consider scaling out your resource so the instances in the remaining zones can process the influx in traffic they receive.
- For a regional outage, deploy into another region and fail over.

> [!IMPORTANT]
> Don't take any actions without thinking them through. Rushed decisions can sometimes make things worse. If you've already developed a disaster recovery plan that covers the scenario, it's usually better to use that instead of creating a plan in the moment.

Failover can be a complex process. You should only trigger a failover when you can justify the costs and risks. In some situations it might result in data loss, such as if recent changes weren't replicated between regions before any downtime started. You also might experience downtime, especially if you need to redirect traffic to a deployment in a different region. Depending on the way your solution is designed, you might need to update DNS records and wait for them to propagate.

### Microsoft-initiated failover

Some Azure services automatically fail over to alternate regions during incidents. Microsoft manages the failover process for those services. However, Microsoft-initiated failover is usually performed as a last resort and after significant time has been spent on recovery attempts. In general, Microsoft's policy is to minimize data loss even if that means a longer recovery time. You shouldn't rely exclusively on Microsoft-initiated failover for your own solutions, especially if you need to minimize your recovery time. If you can, use [customer-initiated failover for services like Azure Storage](/azure/storage/common/storage-initiate-account-failover).

## Azure support

If the service incident is already being communicated in [Azure Service Health](/azure/service-health/overview), then all the latest information is provided there, and there's no need to open a support request.

However, you might consider opening a support case when:

- You're seeing issues that aren't covered in the incident description on the [Azure Service Health](/azure/service-health/overview).

- You need assistance from Microsoft as part of your recovery efforts.

    > [!TIP]
    > If you're affected by a service disruption, you'll be able to raise a free support ticket for up to 72 hours after the issue is mitigated to assist with any steps that you may need to take for recovery.

When opening a support case, clearly explain the resources that are affected and the impact of the issue. Specify the Azure subscription ID and the region that's experiencing an issue. Set the severity of the support case based on the impact to your business. Be aware that many customers might be reactively contacting Azure support during an Azure service disruption outside of these outlined conditions. This added load on Azure support resources could unfortunately delay addressing your support needs.

## After an incident

1. To understand what Microsoft learned from the incident, read the Post Incident Review (PIR) from the Health history pane of [Azure Service Health](/azure/service-health/overview), or through customer-configured Service Health alerts. Different incidents might get different types of PIRs. Preliminary PIRs are typically published a few days after an incident, and more comprehensive PIRs follow a few weeks later.

1. For major incidents that were listed on our public status page, join an Azure Incident Retrospective livestream to get any questions answered, or [watch the recording](https://aka.ms/air/videos).

1. If you think you may be eligible for an SLA credit, [create a new support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) with a problem type of "Refund Request" – and include the incident Tracking ID.

1. Consider what you can learn from the incident to improve your own resiliency and processes. Consider questions like:

    - How well did your disaster recovery plan work? Are there any improvements you could make? For more information, see the [Azure Well-Architected Framework guidance on disaster recovery strategies](/azure/well-architected/reliability/disaster-recovery).

    - Was your response to the incident appropriate for its severity? If not, are there ways you could be better informed and make better decisions about what to do?

    - Are there [Azure service reliability guides](./overview-reliability-guidance.md) for the services you use? Reliability guides provide information on how many Azure services can be configured to meet your resiliency requirements.

    - Is there a design tradeoff you can make to improve your resiliency in the future for this type of issue? For more information, see the [reliability pillar of the Azure Well-Architected Framework](/azure/well-architected/reliability/).

    - Is the SLO or SLA offered to your users still appropriate now that you've experienced this unplanned outage? Now is a good time to revisit the commitments you're making to your user base to align expectations with what you learned from this incident.
    
    - Should you configure [Azure Service Health alerts](/azure/service-health/alerts-activity-log-service-notifications-portal) to be automatically notified of any future incidents?

1. If you have feedback on how we can improve our incident response, please let us know through your assigned Microsoft representative, or through [the Azure feedback site](https://feedback.azure.com/forums/34192--general-feedback).
