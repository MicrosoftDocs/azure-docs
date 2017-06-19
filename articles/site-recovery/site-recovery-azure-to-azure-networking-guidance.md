---
title: Azure Site Recovery networking guidance for replicating from Azure to Azure | Microsoft Docs
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
>
> Site Recovery replication for Azure virtual machines is currently in preview.

This article details the networking guidance for Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region. For more about Azure Site Recovery requirements, see the [prerequisites](site-recovery-prereq.md).

## Site Recovery architecture

Site Recovery provides a simple and easy way to replicate applications running on Azure virtual machines to another Azure region so that they can be recovered in the event of a disruption in primary region. You can refer to more details about the [scenario and its architecture in this document](site-recovery-azure-to-azure-architecture.md).

## Prepare your network infrastructure

Below diagram depicts the typical Azure environment for an application running on Azure virtual machines.

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

If you are using ExpressRoute or a VPN connection from on-premises to Azure, the environment would look like below.

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment-expressroute.png)

Typically customers protect their networks using firewalls and/or Network security Groups (NSGs). The firewalls can use either URL-based whitelisting or IP-based whitelisting for controlling network connectivity. NSGs allow rules for using IP ranges to control network connectivity.

>[!IMPORTANT]
>
> If you are using an authenticated proxy to control network connectivity, it is not supported and Site Recovery replication cannot be enabled.

The below network outbound connectivity changes are required from Azure virtual machines for Site Recovery replication to work.

## Outbound connectivity for Azure Site Recovery URLs

If you are using any URL-based firewall proxy to control outbound connectivity, ensure you whitelist all the required Azure Site Recovery service URLs mentioned below.


**URL** | **Purpose**  
--- | ---
*.blob.core.windows.net | Required so that data can be written to the cache storage account in source region from the VM.
login.microsoftonline.com | Required for authorization and authentication to the Site Recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site Recovery service communication can happen from the VM.
*.servicebus.windows.net | Required so that the Site Recovery monitoring and diagnostics data  can be written from the VM.


##Outbound connectivity for Azure Site Recovery IP ranges

If you are using any IP-based firewall proxy or Network Security Group (NSG) rules to control outbound connectivity, below are the IP ranges that need to be white-listed depending on the source location where virtual machines are running and target location where the virtual machines will be replicated to.

>[!NOTE]
>
> You can download and use the [script available here](https://gallery.technet.microsoft.com/Azure-Recovery-script-to-0c950702) to automatically create the required NSG rules on the NSG.

>[!IMPORTANT]
> 1. It is recommended that you create the required NSG rules on a test NSG and verify that everything is fine before you create the rules on a production NSG.
> 2. Ensure that your subscription is whitelisted to create the required number of NSG rules. You can contact support to increase the NSG rule limit in your subscription.

- Ensure that all IP ranges corresponding to the source location are whitelisted. You can get the IP ranges [here](https://www.microsoft.com/download/confirmation.aspx?id=41653). This is required so that data can be written to the cache storage account from the VM.

- Ensure that all IP ranges corresponding to Office 365 [authentication and identity IP V4 endpoints listed here](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity) are whitelisted.

    >[!NOTE]
    > If new IPs get added Office 365 IP ranges in future, you need to create new NSG rules for the same.

- Ensure that you whitelist Site Recovery service endpoint IPs depending on your target location. You can get the IPs in an [XML file here](https://aka.ms/site-recovery-public-ips).


  **Target Location** | **Site Recovery service IPs** |  **Site Recovery monitoring IP**
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

## Sample Network Security Group (NSG) configuration
This section explains in detail steps to be followed to configure NSG rules so that Site Recovery replication can work on the virtual machine. If you are using Network Security Group (NSG) rules to control outbound connectivity, you need to ensure the "Allow HTTPS outbound" rules for all the required IP ranges.

>[!Note]
>
> You can download and use the [script available here](https://gallery.technet.microsoft.com/Azure-Recovery-script-to-0c950702) to automatically create the required NSG rules on the NSG.

For example, if your VM's source location is 'East US' and your replication is target location is 'Central US', you need to follow the below steps.

>[!IMPORTANT]
> 1. It is recommended that you create the required NSG rules on a test NSG and verify that everything is fine before you create the rules on a production NSG.
> 2. Ensure that your subscription is whitelisted to create the required number of NSG rules. You can contact support to increase the NSG rule limit in your subscription.

### NSG rules on 'East US' NSG

1. Create rules corresponding to 'East US' IP ranges. You can get the IP ranges [here](https://www.microsoft.com/download/confirmation.aspx?id=41653). This is required so that data can be written to the cache storage account from the VM.

2. Create rules for all IP ranges corresponding to Office 365 [authentication and identity IP V4 endpoints listed here](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).

3. Create rules corresponding to target location.

**Location** | **Site Recovery service IPs** |  **Site Recovery monitoring IP**
 --- | --- | ---
Central US | 40.69.144.231</br>40.69.167.116 | 52.165.34.144

### NSG rules on 'Central US' NSG

These rules are required so that replication can be enabled from target region to source region post failover.

1. Create rules corresponding to 'Central US' IP ranges. You can get the IP ranges [here](https://www.microsoft.com/download/confirmation.aspx?id=41653. This is required so that data can be written to the cache storage account from the VM.

2. Create rules for all IP ranges corresponding to Office 365 [authentication and identity IP V4 endpoints listed here](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity).

3. Create rules corresponding to source location.

**Location** | **Site Recovery service IPs** |  **Site Recovery monitoring IP**
 --- | --- | ---
East US | 13.82.88.226</br>40.71.38.173 | 104.45.147.24


## Considerations if you already have Azure to on-premises ExpressRoute / VPN configuration

If you have an ExpressRoute or a VPN connection between on-premises and the source location in Azure, follow the guidance below:

### Forced tunneling configuration

- A common customer configuration is to define a default route (0.0.0.0/0) which forces outbound internet traffic to flow through on-premises. This is not ideal as the replication traffic and Site Recovery service communication should not leave Azure boundary. The solution is to add user-defined routes (UDRs) for [IP ranges mentioned here](#outbound-connectivity-for-azure-site-recovery-ip-ranges) so that the replication traffic doesn’t go on-premises.

### Connectivity between target location and on-premises

- If your application needs to connect to the on-premises machines or if there are clients that connect to the application from on-premises over VPN/ExpressRoute, ensure that you have at least ['Site-to-Site' connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) between your target Azure region and on-premises datacenter.

- If a lot of traffic is expected to flow between your target Azure region and on-premises datacenter, then you should pre-create another [ExpressRoute connection](../expressroute/expressroute-introduction.md) between the target Azure region and on-premises datacenter.

- If you want to retain IPs for the virtual machines after they failover, ensure you keep the target region 'Site-to-Site'/'ExpressRoute' connection in a disconnected state. This is to make sure there is no IP range clash between the source region's IP ranges and target region IP ranges

### Best practices for ExpressRoute configuration
- You need to create ExpressRoute circuit in both source and target regions. And, then you need to create a connection between
  - source VNet and the ExpressRoute circuit
  - target VNet and the ExpressRoute circuit

- As part of ExpressRoute standard, you can create circuits in same geo-political region. To create ExpressRoute circuits in different geo-political region ExpressRoute premium is required. This is an incremental cost. But if you are already using ExpressRoute Premium then there is no extra cost. You can refer to [ExpressRoute locations document](../expressroute/expressroute-locations.md#azure-regions-to-expressroute-locations-within-a-geopolitical-region) and [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/) for more details.

- It is recommended to use different IP ranges in source and target regions. ExpressRoute circuit won't be able to connect with two VNETs of same IP ranges at the same time.

- You can create VNets with same IP ranges in both regions and then create ExpressRoute circuits in both regions. And in case of a failover event, disconnect the circuit from source VNet and connect the circuit in target VNet.

 >[!IMPORTANT]
 >
 > If the primary region is completely down, then the disconnect operation can fail. That will prevent target VNet from getting the ExpressRoute connectivity.

## Next steps
- Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md)
