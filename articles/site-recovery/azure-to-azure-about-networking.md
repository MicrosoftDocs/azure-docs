---
title: About networking in Azure VM disaster recovery with Azure Site Recovery
description: Provides an overview of networking for replication of Azure VMs using Azure Site Recovery.
author: ankitaduttaMSFT
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 09/11/2024
ms.author: ankitadutta
ms.custom: engagement-fy23
---
# About networking in Azure virtual machine disaster recovery



This article provides networking guidance for platform connectivity when you're replicating Azure virtual machines from one region to another, using [Azure Site Recovery](site-recovery-overview.md).

## Before you start

Learn how Site Recovery provides disaster recovery for [this scenario](azure-to-azure-architecture.md).

## Typical network infrastructure

The following diagram depicts a typical Azure environment, for applications running on Azure virtual machines:

![Diagram that depicts a typical Azure environment for applications running on Azure virtual machines.](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

If you're using Azure ExpressRoute or a VPN connection from your on-premises network to Azure, the environment is as follows:

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment-expressroute.png)

Typically, networks are protected using firewalls and network security groups (NSGs). Service tags should be used to control network connectivity. NSGs should allow several service tags to control outbound connectivity.

>[!IMPORTANT]
> Using an authenticated proxy to control network connectivity isn't supported by Site Recovery, and replication can't be enabled.

>[!NOTE]
>- IP address based filtering should not be performed to control outbound connectivity.
>- Azure Site Recovery IP addresses should not be added in Azure Routing table to control outbound connectivity.

## Outbound connectivity for URLs

If you're using a URL-based firewall proxy to control outbound connectivity, allow these Site Recovery URLs:

**URL** | **Details**
--- | ---
*.blob.core.windows.net | Required so that data can be written to the cache storage account in the source region from the virtual machine. If you know all the cache storage accounts for your virtual machines, you can allow access to the specific storage account URLs (Ex: cache1.blob.core.windows.net and cache2.blob.core.windows.net) instead of *.blob.core.windows.net
login.microsoftonline.com | Required for authorization and authentication to the Site Recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site Recovery service communication can occur from the virtual machine.
*.servicebus.windows.net | Required so that the Site Recovery monitoring and diagnostics data can be written from the virtual machine.
*.vault.azure.net | Allows access to enable replication for ADE-enabled virtual machines via portal
*.automation.ext.azure.com | Allows enabling autoupgrade of mobility agent for a replicated item via portal

## Outbound connectivity using Service Tags

Apart from controlling URLs, you can also use service tags to control connectivity. To do so, you must first create a [Network Security Group](../virtual-network/network-security-group-how-it-works.md) in Azure. Once created, you need to use our existing service tags and create an NSG rule to allow access to Azure Site Recovery services. 

The advantages of using service tags to control connectivity, when compared to controlling connectivity using IP addresses, is that there's no hard dependency on a particular IP address to stay connected to our services. In such a scenario, if the IP address of one of our services changes, then the ongoing replication isn't impacted for your machines. Whereas, a dependency on hard coded IP addresses causes the replication status to become critical and put your systems at risk. Moreover, service tags ensure better security, stability and resiliency than hard coded IP addresses.

While using NSG to control outbound connectivity, these service tags need to be allowed.

- For the storage accounts in source region:
    - Create a [Storage service tag](../virtual-network/network-security-groups-overview.md#service-tags) based NSG rule for the source region.
    - Allow these addresses so that data can be written to the cache storage account, from the virtual machine.
- Create a [Microsoft Entra service tag](../virtual-network/network-security-groups-overview.md#service-tags) based NSG rule for allowing access to all IP addresses corresponding to Microsoft Entra ID
- Create an EventsHub service tag-based NSG rule for the target region, allowing access to Site Recovery monitoring.
- Create an Azure Site Recovery service tag-based NSG rule for allowing access to Site Recovery service in any region.
- Create an AzureKeyVault service tag-based NSG rule. This is required only for enabling replication of ADE-enabled virtual machines via portal.
- Create a GuestAndHybridManagement service tag-based NSG rule. This is required only for enabling autoupgrade of mobility agent for a replicated item via portal.
- We recommend that you create the required NSG rules on a test NSG, and verify that there are no problems before you create the rules on a production NSG.

## Example NSG configuration

This example shows how to configure NSG rules for a virtual machine to replicate.

- If you're using NSG rules to control outbound connectivity, use "Allow HTTPS outbound" rules to port:443 for all the required IP address ranges.
- The example presumes that the virtual machine source location is "East US" and the target location is "Central US".

### NSG rules - East US

1. Create an outbound HTTPS (443) security rule for "Storage.EastUS" on the NSG as shown in the following screenshot:

      ![Screenshot shows Add outbound security rule for a network security group for Storage dot East U S.](./media/azure-to-azure-about-networking/storage-tag.png)

2. Create an outbound HTTPS (443) security rule for "AzureActiveDirectory" on the NSG as shown in the following screenshot:

      ![Screenshot shows Add outbound security rule for a network security group for Microsoft Entra ID.](./media/azure-to-azure-about-networking/aad-tag.png)

3. Similar to the security rules, create outbound HTTPS (443) security rule for "EventHub.CentralUS" on the NSG that corresponds to the target location. This allows access to Site Recovery monitoring.

4. Create an outbound HTTPS (443) security rule for "Azure Site Recovery" on the NSG. This allows access to Site Recovery Service in any region.

### NSG rules - Central US

These rules are required so that replication can be enabled from the target region to the source region post-failover:

1. Create an outbound HTTPS (443) security rule for "Storage.CentralUS" on the NSG.

2. Create an outbound HTTPS (443) security rule for "AzureActiveDirectory" on the NSG.

3. Similar to the security rules, create outbound HTTPS (443) security rule for "EventHub.EastUS" on the NSG that corresponds to the source location. This allows access to Site Recovery monitoring.

4. Create an outbound HTTPS (443) security rule for "Azure Site Recovery" on the NSG. This allows access to Site Recovery Service in any region.

## Network virtual appliance configuration

If you're using network virtual appliances (NVAs) to control outbound network traffic from virtual machines, the appliance might get throttled if all the replication traffic passes through the NVA. We recommend creating a network service endpoint in your virtual network for "Storage" so that the replication traffic doesn't go to the NVA.

### Create network service endpoint for Storage

You can create a network service endpoint in your virtual network for "Storage" so that the replication traffic doesn't leave Azure boundary.

- Select your Azure virtual network and select **Service endpoints**.

    ![storage-endpoint](./media/azure-to-azure-about-networking/storage-service-endpoint.png)

- Select **Add** and **Add service endpoints** tab opens.
- Select *Microsoft.Storage* under **Service** and the required subnets under 'Subnets' field and select **Add**.

>[!NOTE]
>If you're using firewall enabled cache storage account or target storage account, ensure you ['Allow trusted Microsoft services'](../storage/common/storage-network-security.md). Also, ensure that you allow access to at least one subnet of source Vnet.


### Forced tunneling

You can override Azure's default system route for the 0.0.0.0/0 address prefix with a [custom route](../virtual-network/virtual-networks-udr-overview.md#custom-routes) and divert VM traffic to an on-premises network virtual appliance (NVA), but this configuration isn't recommended for Site Recovery replication. If you're using custom routes, you should [create a virtual network service endpoint](azure-to-azure-about-networking.md#create-network-service-endpoint-for-storage) in your virtual network for "Storage" so that the replication traffic doesn't leave the Azure boundary.

## Next steps

- Start protecting your workloads by [replicating Azure virtual machines](./azure-to-azure-quickstart.md).
- Learn more about [IP address retention](site-recovery-retain-ip-azure-vm-failover.md) for Azure virtual machine failover.
- Learn more about disaster recovery of [Azure virtual machines with ExpressRoute](azure-vm-disaster-recovery-with-expressroute.md).
