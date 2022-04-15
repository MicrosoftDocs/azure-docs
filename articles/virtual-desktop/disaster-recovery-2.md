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

Azure Virtual Desktop has grown tremendously as a remote and hybrid work solution in recent years. Because so many users now work remotely, organizations require solutions with high deployment speed and reduced costs. Users also need to have a remote work environment with guaranteed availability and resiliency, with minimal disruptions and the ability to access their virtual machines even during disasters. This document describes recommendations for business continuity and disaster recovery.

## Disaster recovery basics

To prevent system outages or downtime, every system and component in your Azure Virtual Desktop deployment must be fault-tolerant. Fault tolerance is when you have a duplicate configuration or system in another geographic region that takes over for the primary system, object, or configuration in the event of an outage, or is running in an active-active configuration, which reduces the impact of a localized outage. There are many different methods you can use to set up fault tolerance, but this article will focus on disaster recovery methods currently available in Azure.

## Azure Virtual Desktop infrastructure

In order to figure out which areas need to be made fault-tolerant, we need to know who's responsible for maintaining those areas. You can divide responsibility in the Azure Virtual Desktop service into two areas: Microsoft-managed and customer-managed. Metadata like the host pools, app groups, and workspaces is controlled by Microsoft. The metadata is always available and doesn't require extra setup by the customer to replicate host pool data or configurations. We've designed the gateway infrastructure that connects people to their session hosts to be a global, high-resilience service managed by Microsoft. Meanwhile, customer-managed areas involve the virtual machines (VMs) used in Azure Virtual Desktop and the settings and configurations unique to the customer's deployment. The following table gives a clearer idea of which areas are managed by which party.

| Managed by Microsoft    | Managed by customer |
|-------------------------|-------------------|
| Load balancer           | Network           |
| Session broker          | Session hosts     |
| Gateway                 | Storage           |
| Diagnostics             | User profile data |
| Cloud identity platform | Identity          |

In this article, we're going to focus on customer-managed components, as these are settings you can configure yourself.

## Recommended disaster recovery strategy

In this section, we'll discuss actions and design principles you should consider to protect your Azure Virtual Desktop workloads and avoid undertaking huge recovery efforts in the event outages or full-blown disasters. For smaller outages, following certain smaller steps can help prevent them from becoming bigger disasters. Understanding the various terminology can help before moving to the implementation.

When you design a disaster recovery strategy, you should keep the following three things in mind:

- High Availability (HA): distributing infrastructure so smaller, more localized outages don't interrupt your entire deployment. Designing with HA in mind can minimize outage impact and avoid the need for disaster recovery.
- Business continuity: how an organization can keep operating during outages of any size.
- Disaster recovery: the process of getting back to operation in the event of a full outage.

Azure has many built-in, free-of-charge features that can deliver HA at a number of levels. The first feature is [availability sets](../virtual-machines/availability-set-overview.md), which distribute VMs across different fault and update domains within Azure. Next are [availability zones](../availability-zones/az-region.md), which are physically isolated and geographically distributed collections of data centers that can significantly reduce the impact of an outage. Finally, distributing session hosts across multiple Azure regions provides even more geographical distribution, which further reduces outage impact. All three features provide a certain level of protection within Azure Virtual Desktop, and you should carefully consider them along with any cost implications.

In summary, the disaster recovery strategy we recommend for Azure Virtual Desktop is to deploy resources across multiple availability zones within a region. If you need more protection, you can also deploy resources across multiple [paired Azure regions](../best-practices-availability-paired-regions.md).

## Recommended diaster recovery methods

The disaster recovery methods we recommend are:

- COnfiguring and deploying Azure resources across multiple availability zones.

- Configuring and deploying Azure resources across multiple regions in either active or passive configuration as [shared host pools](create-host-pools-azure-marketplace.md).

- Using dedicated or personal host pools to [replicate VMs using Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-how-to-enable-replication) to another region.

- Configuring a separate "disaster recovery" host pool in the secondary region and using FSLogix Cloud Cache to replicate the user profile, which you can switch users over to in the event of a disaster.

## Disaster recovery for shared host pools

Disaster recovery in a shared host pool involves dividing up existing resources into a primary and secondary region. Normally, your organization would do all its work in the primary region, but in the event of a disaster, all it takes to switch over to the secondary region is to turn off the resources in the primary region and turn on the ones in the secondary one.

The following diagram shows an example of a deployment with redundant infrastructure in a secondary region. "Redundant" means that a copy of the original infrastructure exists in this other region, and is standard in deployments to provide resiliency for all components. Beneath a single Azure Active Directory, there are two regions: West US and East US. Each region has two session hosts running a multi-session operating system (OS), An account controller running Azure AD Connect, a Domain controller, a Profiles with Azure Files Premium, a storage account, and a virtual network (VNET). In the primary region, West US, all resources are turned on. In the secondary region, East US, the session hosts in the host pool are either turned off or in drain mode, and the account controller is in staging mode. The two VNETs in both regions are connected by peering.

Figure 1

<!--Alt text: A diagram of a deployment using the recommended personal host pool disaster recovery strategy described in the previous paragraph. On the left is the primary region in West US with the host pool with two personal hosts, a domain and account controller, a profile storage with Azure Files Premium, a Storage account, and a VNET labeled "Infra1." The right sde is the secondary region in East US, which is a mirror image of the primary region. The host pools and profiles in both regions are connected by two rectangles labeled "AVD Host Pool 1" and "Cloud Cache FSLogix GPO." The two VNETs are connected by a line labeled "VNET Peering." Above both rectangles is a blue triangle logo labeled "Azure Active Directory," which is connected by a line to the account controller.-->

In most cases, if a component fails or the primary region is not available, then the only action the customer needs to perform is to turn on the hosts or remove drain mode in the secondary region to be up and running again. This scenario focuses on reducing downtime. However, a redundancy-based disaster recovery plan may cost more due to having to maintain those extra components in the secondary region.

| Benefits     | Potential issues |
|--------------|---------|
| Less time spent to recover from a disaster i.e., less time spent on provisioning, configuring, integrating, and validating newly deployed resources. | May incur more costs to maintain additional infrastructure such as: storage accounts, hosts, etc. |
| No need to implement complex procedures.     | Must spend more time configuring up front.  |
| Easily test failover.   | Must maintain additional infrastructure.  |

## Important information for shared host pool recovery

When using this disaster recovery strategy, it's important to keep the following things in mind:

- Having multiple session hosts online across many regions can impact user experience. The managed network load balancer doesn't account for geographic proximity, instead treating all hosts in a host pool equally.

- Having multiple active user sessions across regions in the FSLogix cloud cache can corrupt user profiles. We recommend you limit active Azure Virtual Desktop sessions within the cache to one. The service evaluates RemoteApps as multi-session occurrences, and desktops as single-session occurrences, which means you should avoid active or active host pool configurations.

- Make sure that you configure your virtual machines (VMs) exactly the same way within your host pool. Also, make sure all VMs within your host pool are the same size. If your VMs aren't the same, the managed network load balancer will distribute user connections evenly across all available VMs. This means the smaller VMs may become resource-constrained earlier than expected compared to larger VMs, resulting in a negative user experience.

- Region availability affects data or workspace monitoring. If a region isn't available, the service may lose all historical monitoring data during a disaster. We recommend using a custom export or dump of historical monitoring data.

- We recommend you update your session hosts at least once every month. This recommendation applies to session hosts you keep turned off for extended periods of time.

- Test your deployment by running a controlled failover at least once every six months.

The following table lists deployment recommendations for host pool disaster recovery strategies:

| Technology        | Recommendations  |
|-------------------|-----------|
| Network           | Create and deploy a secondary virtual network in another region and configure [Azure Peering](../virtual-network/virtual-network-manage-peering.md) with your primary virtual network. |
| Session hosts     | [Create and deploy an Azure Virtual Desktop shared host pool](create-host-pools-azure-marketplace.md) with multi-session OS SKU and include VMs from other availability zones and another region. |
| Storage           | Create storage accounts in multiple regions using premium-tier accounts.  |
| User profile data | Create separate [FSLogix cloud cache GPOs](/fslogix/configure-cloud-cache-tutorial) pointing at separate Azure Files SMB locations using Azure storage accounts in different regions.   |
| Identity          | Active Directory Domain Controllers from the same directory. |

## Disaster recovery for personal host pools

For personal host pools, your disaster recovery strategy should involve replicating your resources to a secondary region using Azure Recovery Services Vault. If your primary region goes down in the event of a disaster, Azure Recovery Services Vault can failover and turn on the resources in your secondary region.

For example, let's say we have a deployment with a primary region in the West US and a secondary region in the East US. The two regions are connected by Azure AD Join, but are otherwise not connected directly to each other. The primary region has two personal host pools, each with their own local disk user profile data, and their own VNET that's not paired with anything. In the event of a disaster, Azure Backup Vault would failover ot the secondary region in East US using Azure AD Joined. Unlike the primary region, the secondary region doesn't have local machines or disks, but instead does everything virtually through the cloud. During the failover, Azure Site Recovery Vault would take the data from the Azure Backup Vault cloud and use it to create two VMs that are copies of the original session hosts, including the local disk's user profile data. The secondary region has its own independent VNET, so the VNET going offline in the primary region won't affect functionality.

The following diagram shows the example deployment we just described.

Figure 2

<!--Alt text: A diagram of a deployment using the recommended personal host pool disaster recovery strategy described in the previous paragraph. On the left is the primary region in West US with the host pool with two personal hosts, two local disk user profile data icons, a VNET, and an Azure Backup Vault. On the right is the secondary region, with Azure Site Recovery Vault, two replicated VMs, and two local disk user profile data icons that are grayed out and transparent, indicating that they're absent from this region. It also has its own VNET. Between the two regions is the blue triangle Azure logo labeled "Azure AD Joined."-->

| Benefits | Potential issues     |
|-----------|------------|
| Less costs and no maintenance required to patch or update since resources are only provisioned when required. | More time may be required to provision, integrate, and validate failover infrastructure than pre-staged multi-region disaster recovery architecture. |

<!--We can't do a one-row table.--->

## Important information about personal host pool recovery

When using this disaster recovery strategy, it's important to keep the following things in mind:

- There may be requirements that the host pool VMs need to function in the secondary site, such as virtual networks, subnets, network security, or VPNs to access a directory such as on-premises active directory.

    >[!NOTE]
    > Using an [Azure Active Directory (AD)-joined VM](deploy-azure-ad-joined-vm.md) fulfills some of these requirements automatically.

- You may experience integration, performance, or contention issues for resources if a large-scale disaster affects multiple customers or tenants.

- Personal host pools use VMs that are dedicated to one user, which means affinity load load balancing rules direct all user sessions back to a specific host. This one-to-one mapping between user and host means that if a host is down, the user won't be able to sign in until the asset comes back online or disaster recovery starts.

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
| Identity          | Active Directory Domain Controllers from the same directory across multiple regions.|

## Next steps

For more in-depth information about disaster recovery in Azure, check out these articles:

- [Cloud Adoption Framework Azure Virtual Desktop business continuity and disaster recovery documentation](../cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery.md)

- [Azure Virtual Desktop Handbook: Disaster Recovery](https://azure.microsoft.com/en-us/resources/azure-virtual-desktop-handbook-disaster-recovery/)
