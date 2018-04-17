---
title: About networking in Azure to Azure disaster recovery using Azure Site Recovery  | Microsoft Docs
description: Provides an overview of networking for replication of Azure VMs using Azure Site Recovery.
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 04/17/2018
ms.author: sujayt

---
# About networking in Azure to Azure replication

>[!NOTE]
> Site Recovery replication for Azure virtual machines is currently in preview.

This article provides networking guidance when you're replicating and recovering Azure VMs from one region to another, using [Azure Site Recovery](site-recovery-overview.md).

## Before you start

Learn how Site Recovery provides disaster recovery for [this scenario](azure-to-azure-architecture.md).

## Typical network infrastructure

The following diagram depicts a typical Azure environment, for applications running on Azure VMs:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

If you're using Azure ExpressRoute or a VPN connection from your on-premises network to Azure, the environment looks like this:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment-expressroute.png)

Typically, networks are protected using firewalls and network security groups (NSGs). Firewalls use URL or IP-based whitelisting to control network connectivity. NSGs provide rules that use IP address ranges to control network connectivity.

>[!IMPORTANT]
> Using an authenticated proxy to control network connectivity isn't supported by Site Recovery, and replication can't be enabled.


## Outbound connectivity for URLs

If you are using a URL-based firewall proxy to control outbound connectivity, allow these Site Recovery URLs:


**URL** | **Details**  
--- | ---
*.blob.core.windows.net | Required so that data can be written to the cache storage account in the source region from the VM.
login.microsoftonline.com | Required for authorization and authentication to the Site Recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site Recovery service communication can occur from the VM.
*.servicebus.windows.net | Required so that the Site Recovery monitoring and diagnostics data can be written from the VM.

## Outbound connectivity for IP address ranges

If you are using an IP-based firewall proxy, or NSG rules to control outbound connectivity, these IP ranges need to be allowed.

- All IP address ranges that correspond to the storage accounts in source region
    - You need to create a [Storage service tag](../virtual-network/security-overview.md#service-tags) based NSG rule for the source region.
    - You need to allow these addresses so that data can be written to the cache storage account, from the VM.
- All IP address ranges that correspond to Office 365 [authentication and identity IP V4 endpoints](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).
    - If new address are added to the Office 365 ranges in the future, you need to create new NSG rules.
- Site Recovery service endpoint IP addresses. These are available in an [XML file](https://aka.ms/site-recovery-public-ips) and depend on your target location.
-  You can [download and use this script](https://gallery.technet.microsoft.com/Azure-Recovery-script-to-0c950702), to automatically create the required rules on the NSG.
- We recommend that you create the required NSG rules on a test NSG, and verify that there are no problems before you create the rules on a production NSG.


Site Recovery IP address ranges are as follows:

>
   **Target** | **Site Recovery IP** |  **Site Recovery monitoring IP**
   --- | --- | ---
   East Asia | 52.175.17.132 | 13.94.47.61
   Southeast Asia | 52.187.58.193 | 13.76.179.223
   Central India | 52.172.187.37 | 104.211.98.185
   South India | 52.172.46.220 | 104.211.224.190
   North Central US | 23.96.195.247 | 168.62.249.226
   North Europe | 40.69.212.238 | 52.169.18.8
   West Europe | 52.166.13.64 | 40.68.93.145
   East US | 13.82.88.226 | 104.45.147.24
   West US | 40.83.179.48 | 104.40.26.199
   South Central US | 13.84.148.14 | 104.210.146.250
   Central US | 40.69.144.231 | 52.165.34.144
   East US 2 | 52.184.158.163 | 40.79.44.59
   Japan East | 52.185.150.140 | 138.91.1.105
   Japan West | 52.175.146.69 | 138.91.17.38
   Brazil South | 191.234.185.172 | 23.97.97.36
   Australia East | 104.210.113.114 | 191.239.64.144
   Australia Southeast | 13.70.159.158 | 191.239.160.45
   Canada Central | 52.228.36.192 | 40.85.226.62
   Canada East | 52.229.125.98 | 40.86.225.142
   West Central US | 52.161.20.168 | 13.78.149.209
   West US 2 | 52.183.45.166 | 13.66.228.204
   UK West | 51.141.3.203 | 51.141.14.113
   UK South | 51.140.43.158 | 51.140.189.52
   UK South 2 | 13.87.37.4| 13.87.34.139
   UK North | 51.142.209.167 | 13.87.102.68
   Korea Central | 52.231.28.253 | 52.231.32.85
   Korea South | 52.231.298.185 | 52.231.200.144




## Example NSG configuration

This example shows how to configure NSG rules for a VM to replicate.

- If you're using NSG rules to control outbound connectivity, use "Allow HTTPS outbound" rules to port:443 for all the required IP address ranges.
- The example presumes that the VM source location is "East US" and the target location is "Central US".

### NSG rules - East US

1. Create an outbound HTTPS (443) security rule for "Storage.EastUS" on the NSG as shown in the screenshot below.
      ![storage-tag](./media/azure-to-azure-about-networking/storage-tag.png)
2. Create outbound HTTPS (443) rules for all IP address ranges that correspond to Office 365 [authentication and identity IP V4 endpoints](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).
3. Create outbound HTTPS (443) rules for the Site Recovery IPs that correspond to the target location:

   **Location** | **Site Recovery IP address** |  **Site Recovery monitoring IP address**
    --- | --- | ---
   Central US | 40.69.144.231 | 52.165.34.144

### NSG rules - Central US

These rules are required so that replication can be enabled from the target region to the source region post-failover:

1. Create an outbound HTTPS (443) security rule for "Storage.CentralUS" on the NSG.

2. Create outbound HTTPS (443) rules for all IP address ranges that correspond to Office 365 [authentication and identity IP V4 endpoints](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).

3. Create outbound HTTPS (443) rules for the Site Recovery IPs that correspond to the source location:

   **Location** | **Site Recovery IP address** |  **Site Recovery monitoring IP address**
    --- | --- | ---
   Central US | 13.82.88.226 | 104.45.147.24

## ExpressRoute/VPN

If you have an ExpressRoute or VPN connection between on-premises and Azure location, follow the guidelines in this section.

### Forced tunneling

Typically, you define a default route (0.0.0.0/0) that forces outbound Internet traffic to flow through the on-premises location. We do not recommend this. The replication traffic and Site Recovery service communication should not leave the Azure boundary. The solution is to add user-defined routes (UDRs) for [these IP ranges](#outbound-connectivity-for-azure-site-recovery-ip-ranges) so that the replication traffic doesn’t go on-premises.

### Connectivity

Follow these guidelines for connections between the target location and the on-premises location:
- If your application needs to connect to the on-premises machines or if there are clients that connect to the application from on-premises over VPN/ExpressRoute, ensure that you have at least a [site-to-site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) between your target Azure region and the on-premises datacenter.

- If you expect a lot of traffic to flow between your target Azure region and the on-premises datacenter, you should create another [ExpressRoute connection](../expressroute/expressroute-introduction.md) between the target Azure region and the on-premises datacenter.

- If you want to retain IPs for the virtual machines after they fail over, keep the target region's site-to-site/ExpressRoute connection in a disconnected state. This is to make sure there is no range clash between the source region's IP ranges and target region's IP ranges.

### ExpressRoute configuration
Follow these best practices for ExpressRoute configuration:

- Create an ExpressRoute circuit in both the source and target regions. Then you need to create a connection between:
    - The source virtual network and the on-premises network, via the ExpressRoute circuit in the source region.
    - The target virtual network and the on-premises network, via the ExpressRoute circuit in the target region.


- As part of ExpressRoute standard, you can create circuits in the same geopolitical region. To create ExpressRoute circuits in different geopolitical regions, Azure ExpressRoute Premium is required, which involves an incremental cost. (If you are already using ExpressRoute Premium, there is no extra cost.) For more details, see the [ExpressRoute locations document](../expressroute/expressroute-locations.md#azure-regions-to-expressroute-locations-within-a-geopolitical-region) and [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

- We recommend that you use different IP ranges in source and target regions. The ExpressRoute circuit won't be able to connect with two Azure virtual networks of the same IP ranges at the same time.

- You can create virtual networks with the same IP ranges in both regions and then create ExpressRoute circuits in both regions. In the case of a failover event, disconnect the circuit from the source virtual network, and connect the circuit in the target virtual network.

 >[!IMPORTANT]
 > If the primary region is completely down, the disconnect operation can fail. That will prevent the target virtual network from getting ExpressRoute connectivity.

## Next steps
Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md).
