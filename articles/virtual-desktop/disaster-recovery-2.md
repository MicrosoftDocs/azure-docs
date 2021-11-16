---
title: Azure Virtual Desktop disaster recovery plan
description: Make a disaster recovery plan for your Azure Virtual Desktop deployment to protect your data.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 10/09/2020
ms.author: helohr
manager: femila
---

# Azure Virtual Desktop disaster recovery

Azure Virtual Desktop has experienced tremendous growth as a remote and hybrid work solution. Today, when customers deploy Azure Virtual Desktop, resources are usually deployed to a single region to address immediate requirements. The urgency to adapt to remote work needs are forcing many organizations to focus on speed of deployment and reduced costs. As the global pandemic continues, customers continue to leverage and expand Azure Virtual Desktop for their remote work force placing a greater need on availability and resiliency. Customers want to minimize disruptions and ensure their users can access Azure Virtual Desktop in the event of a disaster. Business continuity and disaster recovery are critical elements required by many customers to ensure business productivity and meet compliance regulations. This document will provide recommendations, best practices, and deployment steps to prepare for BC/DR.

<!--Why are we changing the intro? We don't need to advertise Virtual Desktop if the people coming here have already bought it. Also, we're going to need to immediately update this thing as soon as the pandemic ends-->

## Disaster recovery basics

To prevent system outages or downtime, every system and component in your Azure Virtual Desktop deployment must be fault-tolerant. Fault tolerance is when you have a duplicate configuration or system in another geographic region that takes over for the primary system, object, or configuration in the event of an outage. There are many different methods you can use to set up fault tolerance, but this article will focus on disaster recovery methods currently available in Azure.

## Azure Virtual Desktop infrastructure

In order to figure out which areas need to be made fault-tolerant, we need to know who's responsible for maintaining those areas. You can divide responsibility in the Azure Virtual Desktop service into two areas: Microsoft-managed and customer-managed. Metadata like the host pools, app groups, and workspaces is controlled by Microsoft. The metadata is always available, and doesn't require extra setup by the customer to replicate host pool data or configurations. Meanwhile, customer-managed areas involve settings and configurations that are only available in the customer's deployment. The following table gives a clearer idea of which areas are managed by which party.

| Managed by Microsoft       | Managed by customer  |
|-------------------------|-------------------|
| Load balancer           | Network           |
| Session broker          | Session hosts     |
| Gateway                 | Storage           |
| Diagnostics             | User profile data |
| Cloud identity platform | Identity          |

In this article, we're going to focus on customer-managed components, as these are settings you can configure yourself.

## Recommended disaster recovery strategy

The Azure Virtual Desktop disaster recovery strategy we recommend is providing geographic resiliency by deploying resources across multiple paired Azure regions. Spreading resources across [Azure region pairs](../best-practices-availability-paired-regions.md) ensures that even if more than one area goes down, your important data will remain safe in another region. [Availability sets](../virtual-machines/availability-set-overview.md) and [availability zones](../availability-zones/az-region.md) can also increase the overall fault tolerance of your Azure Virtual Desktop deployment, but this article will focus more on Azure region resiliency.

## Recommended diaster recovery methods

The two disaster recovery methods we recommend are:

- Configuring and deploying Azure resources across multiple regions in either active or passive configuration as [shared host pools](create-host-pools-azure-marketplace.md).

- Using dedicated or personal host pools to [replicate VMs using Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-how-to-enable-replication) to another region.

## Disaster recovery for shared host pools

<!--I'm not sure if having a section that's totally dependent on a big, complicated graphic is accessible. Can we rethink this section and the other one that's dependent on a graphic?--->

A sample multi-region Azure Virtual Desktop configuration is illustrated below. Figure 1 depicts an organization that has deployed an Azure Virtual Desktop shared host pool consisting of multi-session hosts in different regions. Notice two of the hosts in the secondary region are in a passive state, meaning they are turned off or in drain mode. Figure 1 shows redundant session hosts, network connectivity, storage, synchronization, identity source, and user profile data.

Figure 1

In most cases, if a component fails or the primary region is not available, then the only action the customer needs to perform is to turn on the hosts or remove drain mode in the secondary region to be up and running again. This scenario focuses on reducing downtime; however, may incur additional costs due to maintaining additional components for disaster recovery.

| Benefits     | Potential issues |
|--------------|---------|
| Less time spent to recover from a disaster i.e., less time spent on provisioning, configuring, integrating, and validating newly deployed resources. | May incur more costs to maintain additional infrastructure such as: storage accounts, hosts, etc. |
| No need to implement complex procedures.     | Must spend more time configuring up front.  |
| Easily test failover.   | Must maintain additional infrastructure.  |

## Important information for shared host pool recovery

When using this disaster recovery strategy, it's important to keep the following things in mind:

- Having multiple session hosts online across many regions can impact user experience. The managed network load balancer doesn't account for geographic proximity, instead treating all hosts in a host pool equally.

- Having multiple active user sessions across regions in the FSLogix cloud cache can corrupt user profiles. We recommend you limit active Azure Virtual Desktop sessions within the cache to one. The service evaluates RemoteApps as multi-session occurrences, and desktops as single-session occurrences, which means you should avoid active or active host pool configurations.

- Make sure that you configure your virtual machines (VMs) exactly the same way within your host pool. Also, make sure all VMs within your host pool are the same size. If your VMs aren't the same, the managed network load balancer may not spread the sessions across the session hosts evenly.

- Region availability affects data or workspace monitoring. If a region isn't available, the service may lose all historical monitoring data during a disaster. We recommend using a custom export or dump of historical monitoring data.

- We recommend you update your session hosts at least once every month. This recommendation applies to session hosts you keep turned off for extended periods of time.

- Test your deployment by running a controlled failover at least once every six months.

The following table lists deployment recommendations for host pool disaster recovery strategies:

| Technology        | Recommendations  |
|-------------------|-----------|
| Network           | Create and deploy a secondary virtual network in another region and configure [Azure Peering](../virtual-network/virtual-network-manage-peering.md) with your primary virtual network. |
| Session hosts     | [Create and deploy an Azure Virtual Desktop shared host pool](create-host-pools-azure-marketplace.md) with multi-session OS SKU and include VMs from another region. |
| Storage           | Create storage accounts in multiple regions using premium-tier accounts.  |
| User profile data | Create separate [FSLogix cloud cache GPOs](/fslogix/configure-cloud-cache-tutorial) pointing at separate Azure Files SMB locations using Azure storage accounts in different regions.   |
| Identity          | Deploy DCs and identity synchronization across multiple regions. |

<!---What does DC stand for?--->

## Disaster recovery for personal host pools

<!---See comments about "figure 1" section. Is there a way we can make this more accessible to visually impaired readers?--->

To prepare for an Azure outage for dedicated hosts pools, you will want to make sure your Azure Virtual Desktop host pool VMs are replicating to a secondary region. With Azure Recovery Services Vault, data can be replicated to a designated secondary region. If your primary region goes down, you can go to your Azure Site Recovery Services Vault to failover and bring resources online in a secondary region.

Figure 2

| Benefits | Potential issues     |
|-----------|------------|
| Less costs and no maintenance required to patch or update since resources are only provisioned when required. | More time may be required to provision, integrate, and validate fail-over infrastructure than pre-staged multi-region disaster recovery architecture. |

<!--We can't do a one-row table.--->

## Important information about personal host pool recovery

When using this disaster recovery strategy, it's important to keep the following things in mind:

- There may be requirements that the host pool VMs need to function in the secondary site, such as virtual networks, subnets, network security, or VPNs to access a directory such as on-premises active directory.

    >[!NOTE]
    > Using an [Azure Active Directory (AD)-joined VM](deploy-azure-ad-joined-vm.md) fulfills some of these requirements automatically.

- You may experience integration, performance, or contention issues for resources if a large-scale disaster affects multiple customers or tenants.

- Personal host pools are dedicated to one user, which means affinity load load balancing rules direct all user sessions back to a specific host. This one-to-one mapping between user and host means that if a host is down, the user won't be able to sign in until the asset comes back online or disaster recovery starts.

- VMs in a personal host pool store user profile on drive C. If user profile data is corrupted or unavailable, we recommend starting your disaster recovery plan.

- Region availability affects data or workspace monitoring. If a region isn't available, the service may lose all historical monitoring data during a disaster. We recommend using a custom export or dump of historical monitoring data.

- We recommend you avoid using FSLogix when using a personal host pool configuration.

- Run [controlled failover](../site-recovery/azure-to-azure-tutorial-dr-drill.md) and [failback](,,/site-recovery/azure-to-azure-tutorial-failback.md) tests at least once every six months.

The following table lists deployment recommendations for host pool disaster recovery strategies:

| Technology        | Recommendations  |
|-------------------|------------|
| Network           | Create and deploy a secondary virtual network in another region to follow custom naming convention or custom security requirements outside of the Azure Site Recovery default naming scheme.  |
| Session hosts     | [Enable and configure Azure Site Recovery for VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md). Optionally, you can pre-stage an image manually or use the Azure Image Builder service for ongoing provisioning. |
| Storage           | Creating an Azure Storage account is optional to store profiles.  |
| User Profile Data | User profile data is locally stored on drive C. |
| Identity          | Deploy DCs and identity synchronization across multiple regions or use Azure Active Directory.|

<!---What are DCs?--->

## Next steps

For more in-depth information about disaster recovery in Azure, check out these articles:

- [Cloud Adoption Framework Azure Virtual Desktop business continuity and disaster recovery documentation](../cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery.md)

- [Azure Virtual Desktop Handbook: Disaster Recovery](https://azure.microsoft.com/en-us/resources/azure-virtual-desktop-handbook-disaster-recovery/)
