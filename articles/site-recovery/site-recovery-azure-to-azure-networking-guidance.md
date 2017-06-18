---
title: Azure Site Recovery networking guidance for replicating virtual machines from Azure to Azure | Microsoft Docs
description: Networking guidance for replicating Azure virtual machines
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/13/2017
ms.author: sujayt

---
# Networking guidance for replicating Azure virtual machines

>[!NOTE]
> Site Recovery replication for Azure virtual machines is currently in preview.

This article details the networking guidance for Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region. For more about Azure Site Recovery requirements, see the [prerequisites](site-recovery-prereq.md) article.

## Site Recovery architecture

Site Recovery provides a simple and easy way to replicate applications running on Azure virtual machines to another Azure region so that they can be recovered if there is a disruption in the primary region. Learn more about [this scenario and Site Recovery architecture](site-recovery-azure-to-azure-architecture.md).

## Your network infrastructure

The following diagram depicts the typical Azure environment for an application running on Azure virtual machines:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

If you are using Azure ExpressRoute or a VPN connection from an on-premises network to Azure, the environment looks like this:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment-expressroute.png)

Typically, customers protect their networks using firewalls and/or network security groups (NSGs). The firewalls can use either URL-based or IP-based whitelisting for controlling network connectivity. NSGs allow rules for using IP ranges to control network connectivity.

>[!IMPORTANT]
> If you are using an authenticated proxy to control network connectivity, it is not supported, and Site Recovery replication cannot be enabled. 

The following sections discuss the network outbound connectivity changes that are required from Azure virtual machines for Site Recovery replication to work.

## Outbound connectivity for Azure Site Recovery URLs

If you are using any URL-based firewall proxy to control outbound connectivity, be sure to whitelist these required Azure Site Recovery service URLs:


**URL** | **Purpose**  
--- | ---
*.blob.core.windows.net | Required so that data can be written to the cache storage account in the source region from the VM.
login.microsoftonline.com | Required for authorization and authentication to the Site Recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site Recovery service communication can occur from the VM.
*.servicebus.windows.net | Required so that the Site Recovery monitoring and diagnostics data can be written from the VM.

## Outbound connectivity for Azure Site Recovery IP ranges

>[!NOTE]
> To automatically create the required NSG rules on the network security group, you can [download and use this script](https://gallery.technet.microsoft.com/Azure-Recovery-script-to-0c950702).

>[!IMPORTANT]
> * We recommend that you create the required NSG rules on a test network security group and verify that there are no problems before you create the rules on a production network security group.
> * To create the required number of NSG rules, ensure that your subscription is whitelisted. Contact support to increase the NSG rule limit in your subscription.

If you are using any IP-based firewall proxy or NSG rules to control outbound connectivity, the following IP ranges need to be whitelisted, depending on the source and target locations of the virtual machines:

- All IP ranges corresponding to the source location. (You can download the [IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653)). Whitelisting is required so that data can be written to the cache storage account from the VM.

- All IP ranges corresponding to Office 365 [authentication and identity IP V4 endpoints](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).

    >[!NOTE]
    > If new IPs get added to Office 365 IP ranges in the future, you need to create new NSG rules.

- Site Recovery service endpoint IPs ([available in an XML file](https://aka.ms/site-recovery-public-ips)), which depend on your target location: 


     **Target location** | **Site Recovery service IPs** |  **Site Recovery monitoring IP**
      --- | --- | ---
     East Asia | 52.175.17.132</br>40.83.121.61 | 13.94.47.61
     Southeast Asia | 52.187.58.193</br>52.187.169.104 | 13.76.179.223
     Central India | 52.172.187.37</br>52.172.157.193 | 104.211.98.185
     South India | 52.172.46.220</br>52.172.13.124 | 104.211.224.190
     North Central US | 23.96.195.247</br>23.96.217.22 | 168.62.249.226
     North Europe | 40.69.212.238</br>13.74.36.46 | 52.169.18.8
     West Europe | 52.166.13.64</br>52.166.6.245 | 40.68.93.145
     East US | 13.82.88.226</br>40.71.38.173 | 104.45.147.24
     West US | 40.83.179.48</br>13.91.45.163 | 104.40.26.199
     South Central US | 13.84.148.14</br>13.84.172.239 | 104.210.146.250
     Central US | 40.69.144.231</br>40.69.167.116 | 52.165.34.144
     East US 2 | 52.184.158.163</br>52.225.216.31 | 40.79.44.59
     Japan East | 52.185.150.140</br>13.78.87.185 | 138.91.1.105
     Japan West | 52.175.146.69</br>52.175.145.200 | 138.91.17.38
     Brazil South | 191.234.185.172</br>104.41.62.15 | 23.97.97.36
     Australia East | 104.210.113.114</br>40.126.226.199 | 191.239.64.144
     Australia Southeast | 13.70.159.158</br>13.73.114.68 | 191.239.160.45
     Canada Central | 52.228.36.192</br>52.228.39.52 | 40.85.226.62
     Canada East | 52.229.125.98</br>52.229.126.170 | 40.86.225.142
     West Central US | 52.161.20.168</br>13.78.230.131 | 13.78.149.209
     West US 2 | 52.183.45.166</br>52.175.207.234 | 13.66.228.204
     UK West | 51.141.3.203</br>51.140.226.176 | 51.141.14.113
     UK South | 51.140.43.158</br>51.140.29.146 | 51.140.189.52

## Sample network security group (NSG) configuration
This section explains the steps to configure NSG rules so that Site Recovery replication can work on a virtual machine. If you are using NSG rules to control outbound connectivity, use "Allow HTTPS outbound" rules for all the required IP ranges.

>[!Note]
> To automatically create the required NSG rules on the network security group, you can [download and use this script](https://gallery.technet.microsoft.com/Azure-Recovery-script-to-0c950702).

For example, if your VM's source location is "East US" and your replication target location is "Central US", follow the steps in the next two sections:

>[!IMPORTANT]
> * We recommend that you create the required NSG rules on a test network security group and verify that there are no problems before you create the rules on a production network security group.
> * To create the required number of NSG rules, ensure that your subscription is whitelisted. Contact support to increase the NSG rule limit in your subscription. 

### NSG rules on East US network security group

* Create rules corresponding to [East US IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653). This is required so that data can be written to the cache storage account from the VM.

* Create rules for all IP ranges corresponding to Office 365 [authentication and identity IP V4 endpoints](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).

* Create rules corresponding to the target location:

   **Location** | **Site Recovery service IPs** |  **Site Recovery monitoring IP**
    --- | --- | ---
   Central US | 40.69.144.231</br>40.69.167.116 | 52.165.34.144

### NSG rules on Central US network security group

These rules are required so that replication can be enabled from the target region to the source region post-failover:

* Rules corresponding to [Central US IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653). These are required so that data can be written to the cache storage account from the VM.

* Rules for all IP ranges corresponding to Office 365 [authentication and identity IP V4 endpoints](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).

* Rules corresponding to the source location:

   **Location** | **Site Recovery service IPs** |  **Site Recovery monitoring IP**
    --- | --- | ---
   East US | 13.82.88.226</br>40.71.38.173 | 104.45.147.24


## Guidelines for existing Azure to on-premises ExpressRoute/VPN configuration

If you have an ExpressRoute or VPN connection between on-premises and the source location in Azure, follow the guidelines in this section.

### Forced tunneling configuration

A common customer configuration is to define a default route (0.0.0.0/0) that forces outbound Internet traffic to flow through the on-premises location. We do not recommend this. The replication traffic and Site Recovery service communication should not leave the Azure boundary. The solution is to add user-defined routes (UDRs) for [these IP ranges](#outbound-connectivity-for-azure-site-recovery-ip-ranges) so that the replication traffic doesn’t go on-premises.

### Connectivity between the target and on-premises location

Follow these guidelines for connections between the target location and the on-premises location:
- If your application needs to connect to the on-premises machines or if there are clients that connect to the application from on-premises over VPN/ExpressRoute, ensure that you have at least a [site-to-site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) between your target Azure region and the on-premises datacenter.

- If you expect a lot of traffic to flow between your target Azure region and the on-premises datacenter, you should create another [ExpressRoute connection](../expressroute/expressroute-introduction.md) between the target Azure region and the on-premises datacenter.

- If you want to retain IPs for the virtual machines after they fail over, keep the target region's site-to-site/ExpressRoute connection in a disconnected state. This is to make sure there is no range clash between the source region's IP ranges and target region's IP ranges.

### Best practices for ExpressRoute configuration
Follow these best practices for ExpressRoute configuration:

- You need to create an ExpressRoute circuit in both the source and target regions. Then you need to create a connection between:
  - The source Virtual Network and the ExpressRoute circuit.
  - The target Virtual Network and the ExpressRoute circuit.

- As part of ExpressRoute standard, you can create circuits in the same geopolitical region. To create ExpressRoute circuits in different geopolitical regions, Azure ExpressRoute Premium is required, which involves an incremental cost. (If you are already using ExpressRoute Premium, there is no extra cost.) For more details, see the [ExpressRoute locations document](../expressroute/expressroute-locations.md#azure-regions-to-expressroute-locations-within-a-geopolitical-region) and [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

- We recommend that you use different IP ranges in source and target regions. The ExpressRoute circuit won't be able to connect with two Azure Virtual Networks of the same IP ranges at the same time.

- You can create Virtual Networks with the same IP ranges in both regions and then create ExpressRoute circuits in both regions. In the case of a failover event, disconnect the circuit from the source Virtual Network, and connect the circuit in the target Virtual Network.

 >[!IMPORTANT]
 > If the primary region is completely down, the disconnect operation can fail. That will prevent the target Virtual Network from getting ExpressRoute connectivity.

## Next steps
Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md).
