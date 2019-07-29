---
title: About networking in Azure to Azure disaster recovery using Azure Site Recovery  | Microsoft Docs
description: Provides an overview of networking for replication of Azure VMs using Azure Site Recovery.
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 3/29/2019
ms.author: sutalasi

---
# About networking in Azure to Azure replication



This article provides networking guidance when you're replicating and recovering Azure VMs from one region to another, using [Azure Site Recovery](site-recovery-overview.md).

## Before you start

Learn how Site Recovery provides disaster recovery for [this scenario](azure-to-azure-architecture.md).

## Typical network infrastructure

The following diagram depicts a typical Azure environment, for applications running on Azure VMs:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

If you're using Azure ExpressRoute or a VPN connection from your on-premises network to Azure, the environment is as follows:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment-expressroute.png)

Typically, networks are protected using firewalls and network security groups (NSGs). Firewalls use URL or IP-based whitelisting to control network connectivity. NSGs provide rules that use IP address ranges to control network connectivity.

>[!IMPORTANT]
> Using an authenticated proxy to control network connectivity isn't supported by Site Recovery, and replication can't be enabled.


## Outbound connectivity for URLs

If you are using a URL-based firewall proxy to control outbound connectivity, allow these Site Recovery URLs:


**URL** | **Details**  
--- | ---
*.blob.core.windows.net | Required so that data can be written to the cache storage account in the source region from the VM. If you know all the cache storage accounts for your VMs, you can whitelist the specific storage account URLs (Ex: cache1.blob.core.windows.net and cache2.blob.core.windows.net) instead of *.blob.core.windows.net
login.microsoftonline.com | Required for authorization and authentication to the Site Recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site Recovery service communication can occur from the VM. You can use the corresponding 'Site Recovery IP' if your firewall proxy supports IPs.
*.servicebus.windows.net | Required so that the Site Recovery monitoring and diagnostics data can be written from the VM. You can use the corresponding 'Site Recovery Monitoring IP' if your firewall proxy supports IPs.

## Outbound connectivity for IP address ranges

If you are using an IP-based firewall proxy, or NSG rules to control outbound connectivity, these IP ranges need to be allowed.

- All IP address ranges that correspond to the storage accounts in source region
    - Create a [Storage service tag](../virtual-network/security-overview.md#service-tags) based NSG rule for the source region.
    - Allow these addresses so that data can be written to the cache storage account, from the VM.
- Create a [Azure Active Directory (AAD) service tag](../virtual-network/security-overview.md#service-tags) based NSG rule for allowing access to all IP addresses corresponding to AAD
    - If new addresses are added to the Azure Active Directory (AAD) in the future, you need to create new NSG rules.
- Site Recovery service endpoint IP addresses - available in an [XML file](https://aka.ms/site-recovery-public-ips) and depend on your target location.
- We recommend that you create the required NSG rules on a test NSG, and verify that there are no problems before you create the rules on a production NSG.


Site Recovery IP address ranges are as follows:

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
   Korea South | 52.231.198.185 | 52.231.200.144
   France Central | 52.143.138.106 | 52.143.136.55
   France South | 52.136.139.227 |52.136.136.62
   Australia central| 20.36.34.70 | 20.36.46.142
   Australia Central 2| 20.36.69.62 | 20.36.74.130
   South Africa West | 102.133.72.51 | 102.133.26.128
   South Africa North | 102.133.160.44 | 102.133.154.128
   US Gov Virginia | 52.227.178.114 | 23.97.0.197
   US Gov Iowa | 13.72.184.23 | 23.97.16.186
   US Gov Arizona | 52.244.205.45 | 52.244.48.85
   US Gov Texas | 52.238.119.218 | 52.238.116.60
   US DoD East | 52.181.164.103 | 52.181.162.129
   US DoD Central | 52.182.95.237 | 52.182.90.133
## Example NSG configuration

This example shows how to configure NSG rules for a VM to replicate.

- If you're using NSG rules to control outbound connectivity, use "Allow HTTPS outbound" rules to port:443 for all the required IP address ranges.
- The example presumes that the VM source location is "East US" and the target location is "Central US".

### NSG rules - East US

1. Create an outbound HTTPS (443) security rule for "Storage.EastUS" on the NSG as shown in the screenshot below.

      ![storage-tag](./media/azure-to-azure-about-networking/storage-tag.png)

2. Create an outbound HTTPS (443) security rule for "AzureActiveDirectory" on the NSG as shown in the screenshot below.

      ![aad-tag](./media/azure-to-azure-about-networking/aad-tag.png)

3. Create outbound HTTPS (443) rules for the Site Recovery IPs that correspond to the target location:

   **Location** | **Site Recovery IP address** |  **Site Recovery monitoring IP address**
    --- | --- | ---
   Central US | 40.69.144.231 | 52.165.34.144

### NSG rules - Central US

These rules are required so that replication can be enabled from the target region to the source region post-failover:

1. Create an outbound HTTPS (443) security rule for "Storage.CentralUS" on the NSG.

2. Create an outbound HTTPS (443) security rule for "AzureActiveDirectory" on the NSG.

3. Create outbound HTTPS (443) rules for the Site Recovery IPs that correspond to the source location:

   **Location** | **Site Recovery IP address** |  **Site Recovery monitoring IP address**
    --- | --- | ---
   Central US | 13.82.88.226 | 104.45.147.24

## Network virtual appliance configuration

If you are using network virtual appliances (NVAs) to control outbound network traffic from VMs, the appliance might get throttled if all the replication traffic passes through the NVA. We recommend creating a network service endpoint in your virtual network for "Storage" so that the replication traffic does not go to the NVA.

### Create network service endpoint for Storage
You can create a network service endpoint in your virtual network for "Storage" so that the replication traffic does not leave Azure boundary.

- Select your Azure virtual network and click on 'Service endpoints'

    ![storage-endpoint](./media/azure-to-azure-about-networking/storage-service-endpoint.png)

- Click 'Add' and 'Add service endpoints' tab opens
- Select 'Microsoft.Storage' under 'Service' and the required subnets under 'Subnets' field and click 'Add'

>[!NOTE]
>Do not restrict virtual network access to your storage accounts used for ASR. You should allow access from 'All networks'

### Forced tunneling

You can override Azure's default system route for the 0.0.0.0/0 address prefix with a [custom route](../virtual-network/virtual-networks-udr-overview.md#custom-routes) and divert VM traffic to an on-premises network virtual appliance (NVA), but this configuration is not recommended for Site Recovery replication. If you're using custom routes, you should [create a virtual network service endpoint](azure-to-azure-about-networking.md#create-network-service-endpoint-for-storage) in your virtual network for "Storage" so that the replication traffic does not leave the Azure boundary.

## Next steps
- Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md).
- Learn more about [IP address retention](site-recovery-retain-ip-azure-vm-failover.md) for Azure virtual machine failover.
- Learn more about disaster recovery of [Azure virtual machines with ExpressRoute](azure-vm-disaster-recovery-with-expressroute.md).
