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

To make the Azure Virtual Desktop user experience resilient to failure or downtime, every system and component will need to be fault tolerant. Fault tolerance usually requires a duplicate configuration or system in another geographic region that will take over the functions of the primary system, object, or configuration. There are many different types of specific scenarios and technologies that can be incorporated into a disaster recovery strategy or plan; however, this document will focus on BC/DR methods available in Azure today that are currently in use.

## Azure Virtual Desktop infrastructure

To identify and eliminate single points of failure we must understand some of the technologies involved and responsible parties. The Azure Virtual Desktop Service can be divided into two areas of Microsoft managed components versus customer managed technologies. Some pieces of information such as the Azure Virtual Desktop Host Pool, App Group and Workspaces is considered to be metadata and is controlled by Microsoft. This metadata is always available, and no additional configurations are necessary to replicate Azure Virtual Desktop hosts pool data or configurations. This document will focus on providing recommendations for eliminating single points of failure for customer managed components.

| Managed by Microsoft       | Managed by customer  |
|-------------------------|-------------------|
| Load balancer           | Network           |
| Session broker          | Session hosts     |
| Gateway                 | Storage           |
| Diagnostics             | User profile data |
| Cloud identity platform | Identity          |

## Recommended disaster recovery strategy

The recommended strategy for Azure Virtual Desktop BC/DR is to provide geographic resiliency by utilizing multiple Azure regions and deploying resources ideally across paired regions. For Azure region disaster recovery, the best practice recommendation is to spread resources across [Azure region pairs](../best-practices-availability-paired-regions.md). Technologies that provide Azure zone resiliency such as [availability sets](../virtual-machines/availability-set-overview.md) or [availability zone](../availability-zones/az-region.md) can incrementally augment an Azure Virtual Desktop BC/DR strategy, however this document will focus on and recommend Azure region resiliency.

## Recommended diaster recovery methods

The two recommended DR methods are:

- Disaster recovery for [shared host pools](create-host-pools-azure-marketplace.md) is achieved by configuring and deploying Azure resources to multiple regions in an active/passive configuration.

- Disaster recovery for dedicated or personal host pools is achieved by [replicating VMs using Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-how-to-enable-replication) to another region.

## Disaster recovery for shared host pools

A sample multi-region Azure Virtual Desktop configuration is illustrated below. Figure 1 depicts an organization that has deployed an Azure Virtual Desktop shared host pool consisting of multi-session hosts in different regions. Notice two of the hosts in the secondary region are in a passive state, meaning they are turned off or in drain mode. Figure 1 shows redundant session hosts, network connectivity, storage, synchronization, identity source, and user profile data.

Figure 1

In most cases, if a component fails or the primary region is not available, then the only action the customer needs to perform is to turn on the hosts or remove drain mode in the secondary region to be up and running again. This scenario focuses on reducing downtime; however, may incur additional costs due to maintaining additional components for disaster recovery.

| Benefits                                                                                                                                             | Cons                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Less time spent to recover from a disaster i.e., less time spent on provisioning, configuring, integrating, and validating newly deployed resources. | May incur more costs to maintain additional infrastructure such as: storage accounts, hosts, etc. |
| No need to implement complex procedures.                                                                                                             | Must spend more time configuring up front.                                                        |
| Easily test failover.                                                                                                                                | Must maintain additional infrastructure.                                                          |

## Important information for shared host pool recovery

- Having all session hosts online across regions may impact Azure Virtual Desktop user experience since the managed network load balancer does not account for geographic proximity and treats all the hosts in a pool equally.

- Multiple active user sessions across regions with Fslogix cloud cache has the potential to corrupt user profiles and is recommended to limit active Azure Virtual Desktop sessions to a single occurrence. Remote Apps will be evaluated as multi-session occurrences, desktops will be evaluated as single session occurrences, hence active/active host pool configurations should be avoided.

- Keep the VM sizes and configurations homogeneous within an Azure Virtual Desktop pool or the managed network load balancer may not spread the sessions across the hosts properly.

- Monitoring workspace/data may be impacted if a region is not available, and historical monitoring data may be lost in event of a disaster. Recommend a custom export or dump of historical monitoring data.

## Deployment recommendations for host pool recovery

| Technology        | Recommendations                                                                                                                                                                                                                                                                                                                      |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Network           | Create and deploy secondary virtual network in another region and configure [Azure Peering](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering#:~:text=1%20In%20the%20search%20box%20at%20the%20top,the%20peering%20to%20the%20virtual%20network%20you%20selected.) with primary virtual network. |
| Session Hosts     | [Create and deploy Azure Virtual Desktop shared host pool](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace?tabs=azure-portal) with multi-session OS SKU and include VMs from another region.                                                                                                                |
| Storage           | Create storage accounts in multiple regions using premium tier                                                                                                                                                                                                                                                                       |
| User Profile Data | Create separate [Fslogix cloud cache GPOs](https://docs.microsoft.com/en-us/fslogix/configure-cloud-cache-tutorial) pointing at separate Azure Files SMBs locations using Azure storage accounts in different regions.                                                                                                               |
| Identity          | Deploy DCs and identity synchronization across multiple regions.                                                                                                                                                                                                                                                                     |

Additional Recommended Actions
------------------------------

- If any sessions hosts are kept down, recommend bringing online every month for patching.

- Run a controlled failover at least once every 6 months.

## Disaster recovery for personal host pools
=========================================

To prepare for an Azure outage for dedicated hosts pools, you will want to make sure your Azure Virtual Desktop host pool VMs are replicating to a secondary region. With Azure Recovery Services Vault, data can be replicated to a designated secondary region. If your primary region goes down, you can go to your Azure Site Recovery Services Vault to failover and bring resources online in a secondary region.

Figure 2

| Benefits                                                                                                      | Cons                                                                                                                                                  |
|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Less costs and no maintenance required to patch or update since resources are only provisioned when required. | More time may be required to provision, integrate, and validate fail-over infrastructure than pre-staged multi-region disaster recovery architecture. |

## Things to keep in mind for personal host pool recovery

- Dependencies - There may be requirements that the host pool VMs will require to function as expected in the secondary site such as virtual networks, subnets, network security, or VPNs to access a directory such as on-premises Active Directory.

>[!NOTE]
> Use [Azure AD joined VM](deploy-azure-ad-joined-vm.md) to eliminate a few of these dependencies.

- May run into integration, performance, or contention issues for resources if a large-scale disaster is affecting multiple customers/tenants.

- Personal host pools are dedicated to a single user and affinity load balancing rules will direct user sessions back to a particular host. Personal hosts pools have a one-to-one mapping between host to a user and if a host is down then that user will not be able to login until that asset comes back online or the DR plan is initiated.

- Virtual machines within a personal host pool store user profile data on the C: drive. If user profile data is corrupted or not available, recommend initiating BC/DR plan.

- Monitoring workspace/data may be impacted if a region is not available, and historical monitoring data may be lost in event of a disaster. Recommend a custom export or dump of historical monitoring data.

## Recommendations for personal host pool recovery

| Technology        | Recommendations                                                                                                                                                                                                                                                   |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Network           | May want to create and deploy secondary virtual network in another region to follow custom naming convention or custom security requirements outside of Azure Site Recovery default naming scheme.                                                                |
| Session Hosts     | [Enable and configure Azure Site Recovery for VMs.](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-enable-replication) Optionally may want to pre-stage image manually or use Azure Image Builder Service for ongoing provisioning. |
| Storage           | Azure Storage account is not necessary for to store profiles.                                                                                                                                                                                                     |
| User Profile Data | User profile data is locally stored on the C: drive.                                                                                                                                                                                                              |
| Identity          | Deploy DCs and identity synchronization across multiple regions or use Azure Active Directory.                                                                                                                                                                    |

<!---move this and other section into recommendations--->

- We recommend you avoid using FSLogix when using a personal desktop pool configuration.

- Run a [controlled failover](../site-recovery/azure-to-azure-tutorial-dr-drill.md) and [Fail Back](,,/site-recovery/azure-to-azure-tutorial-failback.md) test, at least once every 6 months.

## Next steps

- [Cloud Adoption Framework Azure Virtual Desktop BC/DR Documentation](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery?branch=wvd-scenario)

- [Azure Virtual Desktop Handbook: Disaster Recovery](https://azure.microsoft.com/en-us/resources/azure-virtual-desktop-handbook-disaster-recovery/)
