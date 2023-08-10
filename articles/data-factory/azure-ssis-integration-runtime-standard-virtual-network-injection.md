---
title: Configure a virtual network for standard injection of Azure-SSIS integration runtime
description: Learn how to configure a virtual network for standard injection of Azure-SSIS integration runtime. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 04/12/2023
author: chugugrace
ms.author: chugu 
ms.custom: devx-track-azurepowershell
---

# Standard virtual network injection method

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When using SQL Server Integration Services (SSIS) in Azure Data Factory (ADF) or Synpase Pipelines, there are two methods for you to join your Azure-SSIS integration runtime (IR) to a virtual network: standard and express. If you use the standard method, you need to configure your virtual network to meet these requirements:

- Make sure that *Microsoft.Batch* is a registered resource provider in Azure subscription that has the virtual network for your Azure-SSIS IR to join. For detailed instructions, see the [Register Azure Batch as a resource provider](azure-ssis-integration-runtime-virtual-network-configuration.md#registerbatch) section.

- Make sure that the user creating Azure-SSIS IR is granted the necessary role-based access control (RBAC) permissions to join the virtual network/subnet.  For more information, see the [Select virtual network permissions](#perms) section below.

- Select a proper subnet in the virtual network for your Azure-SSIS IR to join. For more information, see the [Select a subnet](#subnet) section below.

Depending on your specific scenario, you can optionally configure the following:

- If you want to bring your own static public IP (BYOIP) addresses for the outbound traffic of your Azure-SSIS IR, see the [Configure static public IP addresses](#ip) section below.

- If you want to use your own domain name system (DNS) server in the virtual network, see the [Configure a custom DNS server](#dns) section below.

- If you want to use a network security group (NSG) to limit inbound/outbound traffic on the subnet, see the [Configure an NSG](#nsg) section below.

- If you want to use user-defined routes (UDRs) to audit/inspect outbound traffic, see the [Configure UDRs](#udr) section below.

- Make sure the virtual network's resource group (or the public IP addresses' resource group if you bring your own public IP addresses) can create and delete certain Azure network resources. For more information, see [Configure the relevant resource group](#rg). 

- If you customize your Azure-SSIS IR as described in the [Custom setup for Azure-SSIS IR](how-to-configure-azure-ssis-ir-custom-setup.md) article, our internal process to manage its nodes will consume private IP addresses from a predefined range of *172.16.0.0* to *172.31.255.255*. Consequently, please make sure that the private IP address ranges of your virtual and or on-premises networks don't collide with this range.

This diagram shows the required connections for your Azure-SSIS IR:

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-ssis-ir.png" alt-text="Diagram that shows the required connections for your Azure-SSIS IR.":::

## <a name="perms"></a>Select virtual network permissions

To enable standard virtual network injection, the user creating Azure-SSIS IR must be granted the necessary RBAC permissions to join the virtual network/subnet.

- If you're joining your Azure-SSIS IR to an Azure Resource Manager virtual network, you have two options:

  - Use the built-in *Network Contributor* role. This role comes with the _Microsoft.Network/\*_ permission, which has a much larger scope than necessary.

  - Create a custom role that includes only the necessary _Microsoft.Network/virtualNetworks/\*/join/action_ permission. If you also want to bring your own static public IP addresses for Azure-SSIS IR while joining it to an Azure Resource Manager virtual network, please also include the _Microsoft.Network/publicIPAddresses/\*/join/action_ permission in the role.

  - For detailed instructions, see the [Grant virtual network permissions](azure-ssis-integration-runtime-virtual-network-configuration.md#grantperms) section.

- If you're joining your Azure-SSIS IR to a classic virtual network, we recommend that you use the built-in *Classic Virtual Machine Contributor* role. Otherwise, you have to create a custom role that includes the permission to join the virtual network. You also need to assign *MicrosoftAzureBatch* to that built-in/custom role.

## <a name="subnet"></a>Select a subnet

To enable standard virtual network injection, you must select a proper subnet for your Azure-SSIS IR to join:

- Don't select the GatewaySubnet, since it's dedicated for virtual network gateways.

- Make sure that the selected subnet has available IP addresses for at least two times your Azure-SSIS IR node number. These are required for us to avoid disruptions when rolling out patches/upgrades for your Azure-SSIS IR. Azure also reserves some IP addresses that can’t be used in each subnet. The first and last IP addresses are reserved for protocol compliance, while three more addresses are reserved for Azure services. For more information, see the [Subnet IP address restrictions](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets) section.

- Don’t use a subnet that is exclusively occupied by other Azure services (for example, Azure SQL Managed Instance, App Service, and so on). 

## <a name="ip"></a>Configure static public IP addresses

If you want to bring your own static public IP addresses for the outbound traffic of Azure-SSIS IR while joining it to a virtual network, so you can allow them on your firewalls, make sure they meet the following requirements:

- Exactly two unused ones that are not already associated with other Azure resources should be provided. The extra one will be used when we periodically upgrade your Azure-SSIS IR. Note that one public IP address can't be shared among your active Azure-SSIS IRs.

- They should both be static ones of standard type. Refer to the [SKUs of public IP address](../virtual-network/ip-services/public-ip-addresses.md#sku) section for more details.

- They should both have a DNS name. If you haven't provided a DNS name when creating them, you can do so on Azure portal.

  :::image type="content" source="media/ssis-integration-runtime-management-troubleshoot/setup-publicipdns-name.png" alt-text="Azure-SSIS IR":::

- They and the virtual network should be under the same subscription and in the same region.

## <a name="dns"></a>Configure a custom DNS server 

If you want to use your own DNS server in the virtual network to resolve your private hostnames, make sure that it can also resolve global Azure hostnames (for example, your Azure Blob Storage named `<your storage account>.blob.core.windows`.).

We recommend you configure your own DNS server to forward unresolved DNS requests to the IP address of Azure recursive resolvers (*168.63.129.16*).

For more information, see the [DNS server name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) section.

> [!NOTE]
> Please use a Fully Qualified Domain Name (FQDN) for your private hostname (for example, use `<your_private_server>.contoso.com` instead of `<your_private_server>`). Alternatively, you can use a standard custom setup on your Azure-SSIS IR to automatically append your own DNS suffix (for example `contoso.com`) to any unqualified single label domain name and turn it into an FQDN before using it in DNS queries, see the [Standard custom setup samples](how-to-configure-azure-ssis-ir-custom-setup.md#standard-custom-setup-samples) section. 

## <a name="nsg"></a>Configure an NSG

If you want to use an NSG on the subnet joined by your Azure-SSIS IR, allow the following inbound and outbound traffic:

| Direction | Transport protocol | Source | Source ports | Destination | Destination ports | Comments | 
|-----------|--------------------|--------|--------------|-------------|-------------------|----------| 
| Inbound | TCP | *BatchNodeManagement* | * | *VirtualNetwork* | *29876, 29877* (if you join your SSIS IR to an Azure Resource Manager virtual network)<br/><br/>*10100, 20100, 30100* (if you join your SSIS IR to a classic virtual network)| The Data Factory service uses these ports to communicate with your Azure-SSIS IR nodes in the virtual network.<br/><br/>Whether or not you create an NSG on the subnet, Data Factory always configures an NSG on the network interface card (NIC) attached to virtual machines that host your Azure-SSIS IR.<br/><br/>Only inbound traffic from Data Factory IP addresses on the specified ports is allowed by the NIC-level NSG.<br/><br/>Even if you open these ports to internet traffic at the subnet level, traffic from IP addresses that aren't Data Factory IP addresses is still blocked at the NIC level. | 
| Inbound | TCP | *CorpNetSaw* | * | *VirtualNetwork* | *3389* | (Optional) Only required when a Microsoft support engineer asks you to open port *3389* for advanced troubleshooting and can be closed right after troubleshooting.<br/><br/>*CorpNetSaw* service tag permits only secure access workstation (SAW) machines in Microsoft corporate network to access your Azure-SSIS IR via remote desktop protocol (RDP).<br/><br/>This service tag can't be selected from Azure portal and is only available via Azure PowerShell/CLI.<br/><br/>In the NIC-level NSG, port *3389* is open by default, but you can control it with a subnet-level NSG, while outbound traffic on it is disallowed by default on your Azure-SSIS IR nodes using Windows firewall rule. | 

| Direction | Transport protocol | Source | Source ports | Destination | Destination ports | Comments |
|-----------|--------------------|--------|--------------|-------------|-------------------|----------|
| Outbound | TCP | *VirtualNetwork* | * | *AzureCloud* | *443* | Required for your Azure-SSIS IR to access Azure services, such as Azure Storage and Azure Event Hubs. | 
| Outbound | TCP | *VirtualNetwork* | * | *Internet* | *80* | (Optional) Your Azure-SSIS IR uses this port to download a certificate revocation list (CRL) from the Internet.<br/><br/>If you block this traffic, you might experience a performance degradation when starting your Azure-SSIS IR and lose the capability to check CRLs when using certificates, which is not recommended from the security point of view.<br/><br/>If you want to narrow down destinations to certain FQDNs, see the **Configure UDRs** section below | 
| Outbound | TCP | *VirtualNetwork* | * | *Sql/VirtualNetwork* | *1433, 11000-11999* | (Optional) Only required if you use Azure SQL Database server/Managed Instance to host SSIS catalog (SSISDB).<br/><br/>If your Azure SQL Database server/Managed Instance is configured with a public endpoint/virtual network service endpoint, use *Sql* service tag as destination.<br/><br/>If your Azure SQL Database server/Managed Instance is configured with a private endpoint, use *VirtualNetwork* service tag as destination.<br/><br/>If your server connection policy is set to *Proxy* instead of *Redirect*, only port *1433* is required. | 
| Outbound | TCP | *VirtualNetwork* | * | *Storage/VirtualNetwork* | *443* | (Optional) Only required if you use Azure Storage blob container to store your standard custom setup script/files.<br/><br/>If your Azure Storage is configured with a public endpoint/virtual network service endpoint, use *Storage* service tag as destination.<br/><br/>If your Azure Storage is configured with a private endpoint, use *VirtualNetwork* service tag as destination. | 
| Outbound | TCP | *VirtualNetwork* | * | *Storage/VirtualNetwork* | *445* | (Optional) Only required if you need to access Azure Files.<br/><br/>If your Azure Storage is configured with a public endpoint/virtual network service endpoint, use *Storage* service tag as destination.<br/><br/>If your Azure Storage is configured with a private endpoint, use *VirtualNetwork* service tag as destination. | 

## <a name="udr"></a>Configure UDRs

If you want to audit/inspect the outbound traffic from your Azure-SSIS IR, you can use [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) to redirect it to an on-premises firewall appliance via [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) forced tunneling that advertises a border gateway protocol (BGP) route *0.0.0.0/0* to the virtual network, to a network virtual appliance (NVA) configured as firewall, or to [Azure Firewall](../firewall/overview.md) service.

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-ssis-ir-nva.png" alt-text="NVA scenario for Azure-SSIS IR":::

To make it work, you must ensure the following:

- The traffic between Azure Batch management service and your Azure-SSIS IR shouldn't be routed to a firewall appliance/service.

- The firewall appliance/service should allow the outbound traffic required by Azure-SSIS IR.

If the traffic between Azure Batch management service and your Azure-SSIS IR is routed to a firewall appliance/service, it will be broken due to asymmetric routing. UDRs must be defined for this traffic, such that it can go out through the same routes it came in. You can configure UDRs to route the traffic between Azure Batch management service and your Azure-SSIS IR with the next hop type as *Internet*.

For example, if your Azure-SSIS IR is located in *UK South* and you want to inspect the outbound traffic using Azure Firewall, you can first get the IP ranges for *BatchNodeManagement.UKSouth* service tag from the [Service tag IP range download link](https://www.microsoft.com/download/details.aspx?id=56519) or the [Service tag discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises). You can then configure the following UDRs for relevant IP range routes with the next hop type as *Internet* and *0.0.0.0/0* route with the next hop type as *Virtual appliance*.

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azurebatch-udr-settings.png" alt-text="Azure Batch UDR settings":::

> [!NOTE]
> This approach incurs an additional maintenance cost, since you need to regularly check the relevant IP ranges and add UDRs for new ones to avoid breaking your Azure-SSIS IR. We recommend checking them monthly, because when a new IP range appears for the relevant service tag, it will take another month to go into effect. 

You can run following PowerShell script to add UDRs for Azure Batch management service:

```powershell
$Location = "[location of your Azure-SSIS IR]"
$RouteTableResourceGroupName = "[name of Azure resource group that contains your route table]"
$RouteTableResourceName = "[resource name of your route table]"
$RouteTable = Get-AzRouteTable -ResourceGroupName $RouteTableResourceGroupName -Name $RouteTableResourceName
$ServiceTags = Get-AzNetworkServiceTag -Location $Location
$BatchServiceTagName = "BatchNodeManagement." + $Location
$UdrRulePrefixForBatch = $BatchServiceTagName
if ($ServiceTags -ne $null)
{
    $BatchIPRanges = $ServiceTags.Values | Where-Object { $_.Name -ieq $BatchServiceTagName }
    if ($BatchIPRanges -ne $null)
    {
        Write-Host "Start adding UDRs to your route table..."
        for ($i = 0; $i -lt $BatchIPRanges.Properties.AddressPrefixes.Count; $i++)
        {
            $UdrRuleName = "$($UdrRulePrefixForBatch)_$($i)"
            Add-AzRouteConfig -Name $UdrRuleName `
                -AddressPrefix $BatchIPRanges.Properties.AddressPrefixes[$i] `
                -NextHopType "Internet" `
                -RouteTable $RouteTable `
                | Out-Null
            Write-Host "Add $UdrRuleName to your route table..."
        }
        Set-AzRouteTable -RouteTable $RouteTable
    }
}
else
{
    Write-Host "Failed to fetch Azure service tag, please confirm that your location is valid."
}
```

Following our guidance in the [Configure an NSG](#nsg) section above, you must implement similar rules on the firewall appliance/service to allow the outbound traffic from your Azure-SSIS IR:

- If you use Azure Firewall:
  - You must open port *443* for outbound TCP traffic with *AzureCloud* service tag as destination.

  - If you use Azure SQL Database server/Managed Instance to host SSISDB, you must open ports *1433, 11000-11999* for outbound TCP traffic with *Sql/VirtualNetwork* service tag as destination.

  - If you use Azure Storage blob container to store your standard custom setup script/files, you must open port *443* for outbound TCP traffic with *Storage/VirtualNetwork* service tag as destination.

  - If you need to access Azure Files, you must open port *445* for outbound TCP traffic with *Storage/VirtualNetwork* service tag as destination.

- If you use other firewall appliance/service:
  - You must open port *443* for outbound TCP traffic with *0.0.0.0/0* or the following Azure environment-specific FQDNs as destination.

    | Azure environment | FQDN |
    |-------------------|-------|
    | <b>Azure Public</b> | <ul><li><b>Azure Data Factory (Management)</b><ul><li>_\*.frontend.clouddatahub.net_</li></ul></li><li><b>Azure Storage (Management)</b><ul><li>_\*.blob.core.windows.net_</li><li>_\*.table.core.windows.net_</li></ul></li><li><b>Azure Container Registry (Custom Setup)</b><ul><li>_\*.azurecr.io_</li></ul></li><li><b>Event Hubs (Logging)</b><ul><li>_\*.servicebus.windows.net_</li></ul></li><li><b>Microsoft Logging service (Internal Use)</b><ul><li>_gcs.prod.monitoring.core.windows.net_</li><li>_prod.warmpath.msftcloudes.com_</li><li>_azurewatsonanalysis-prod.core.windows.net_</li></ul></li></ul> |
    | <b>Azure Government</b> | <ul><li><b>Azure Data Factory (Management)</b><ul><li>_\*.frontend.datamovement.azure.us_</li></ul></li><li><b>Azure Storage (Management)</b><ul><li>_\*.blob.core.usgovcloudapi.net_</li><li>_\*.table.core.usgovcloudapi.net_</li></ul></li><li><b>Azure Container Registry (Custom Setup)</b><ul><li>_\*.azurecr.us_</li></ul></li><li><b>Event Hubs (Logging)</b><ul><li>_\*.servicebus.usgovcloudapi.net_</li></ul></li><li><b>Microsoft Logging service (Internal Use)</b><ul><li>_fairfax.warmpath.usgovcloudapi.net_</li><li>_azurewatsonanalysis.usgovcloudapp.net_</li></ul></li></ul> |
    | <b>Microsoft Azure operated by 21Vianet</b> | <ul><li><b>Azure Data Factory (Management)</b><ul><li>_\*.frontend.datamovement.azure.cn_</li></ul></li><li><b>Azure Storage (Management)</b><ul><li>_\*.blob.core.chinacloudapi.cn_</li><li>_\*.table.core.chinacloudapi.cn_</li></ul></li><li><b>Azure Container Registry (Custom Setup)</b><ul><li>_\*.azurecr.cn_</li></ul></li><li><b>Event Hubs (Logging)</b><ul><li>_\*.servicebus.chinacloudapi.cn_</li></ul></li><li><b>Microsoft Logging service (Internal Use)</b><ul><li>_mooncake.warmpath.chinacloudapi.cn_</li><li>_azurewatsonanalysis.chinacloudapp.cn_</li></ul></li></ul> |

  - If you use Azure SQL Database server/Managed Instance to host SSISDB, you must open ports *1433, 11000-11999* for outbound TCP traffic with *0.0.0.0/0* or your Azure SQL Database server/Managed Instance FQDN as destination.

  - If you use Azure Storage blob container to store your standard custom setup script/files, you must open port *443* for outbound TCP traffic with *0.0.0.0/0* or your Azure Blob Storage FQDN as destination.

  - If you need to access Azure Files, you must open port *445* for outbound TCP traffic with *0.0.0.0/0* or your Azure Files FQDN as destination.

- If you configure a virtual network service endpoint for Azure Storage/Container Registry/Event Hubs/SQL by enabling *Microsoft.Storage*/*Microsoft.ContainerRegistry*/*Microsoft.EventHub*/*Microsoft.Sql* resources, respectively, in your subnet, all traffic between your Azure-SSIS IR and these services in the same/paired regions will be routed to Azure backbone network instead of your firewall appliance/service.

- You should open port *80* for outbound TCP traffic with the following certificate revocation list (CRL) download sites as destination:

  - *crl.microsoft.com:80*
  - *mscrl.microsoft.com:80*
  - *crl3.digicert.com:80*
  - *crl4.digicert.com:80*
  - *ocsp.digicert.com:80*
  - *cacerts.digicert.com:80*
  
  If you use certificates with different CRLs, you should also add their download sites as destination. For more information, see the [Certificate revocation list](https://social.technet.microsoft.com/wiki/contents/articles/2303.understanding-access-to-microsoft-certificate-revocation-list.aspx) article.

  If you block this traffic, you might experience a performance degradation when starting your Azure-SSIS IR and lose the capability to check CRLs when using certificates, which is not recommended from the security point of view.

If you need not audit/inspect the outbound traffic from your Azure-SSIS IR, you can use UDRs to force all traffic with the next hop type as *Internet*:

- When using Azure ExpressRoute, you can configure a UDR for *0.0.0.0/0* route in your subnet with the next hop type as *Internet*. 

- When using an NVA, you can modify the existing UDR for *0.0.0.0/0* route in your subnet to switch the next hop type from *Virtual appliance* to *Internet*.

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/add-route-for-vnet.png" alt-text="Add a route":::

> [!NOTE]
> Configuring UDRs with the next hop type as *Internet* doesn't mean all traffic will go over the Internet. As long as the destination address belongs to one of Azure services, Azure will route all traffic to that address over Azure backbone network instead of the Internet.

## <a name="rg"></a>Configure the relevant resource group

To enable standard virtual network injection, your Azure-SSIS IR needs to create certain network resources in the same resource group as the virtual network. These resources include:

- An Azure load balancer, with the name _\<Guid\>-azurebatch-cloudserviceloadbalancer_.
- An Azure public IP address, with the name _\<Guid\>-azurebatch-cloudservicepublicip_.
- An NSG, with the name _\<Guid\>-azurebatch-cloudservicenetworksecuritygroup_. 

> [!NOTE]
> You can now bring your own static public IP addresses for Azure-SSIS IR. In this scenario, we'll create the Azure load balancer and NSG in the same resource group as your static public IP addresses instead of the virtual network.

These resources will be created when your Azure-SSIS IR starts. They'll be deleted when your Azure-SSIS IR stops. If you bring your own static public IP addresses for Azure-SSIS IR, they won't be deleted when your Azure-SSIS IR stops. To avoid blocking your Azure-SSIS IR from stopping, don't reuse these resources for other purposes.

Make sure that you have no resource lock in the resource group/subscription to which the virtual network/your static public IP addresses belong. If you configure a read-only/delete lock, starting and stopping your Azure-SSIS IR will fail, or it will stop responding.

Make sure that you have no Azure Policy assignment that prevents the following resources from being created in the resource group/subscription to which the virtual network/your static public IP addresses belong: 

- *Microsoft.Network/LoadBalancers* 
- *Microsoft.Network/NetworkSecurityGroups* 
- *Microsoft.Network/PublicIPAddresses* 

Make sure that the resource quota for your subscription is enough for these resources. Specifically, for each Azure-SSIS IR created in a virtual network, you need to reserve twice the number of these resources, since the extra resources will be used when we periodically upgrade your Azure-SSIS IR.

## <a name="faq"></a>FAQ

- How can I protect the public IP address exposed on my Azure-SSIS IR for inbound connection? Is it possible to remove the public IP address?
 
  Right now, a public IP address will be automatically created when your Azure-SSIS IR joins a virtual network. We do have an NIC-level NSG to allow only Azure Batch management service to inbound-connect to your Azure-SSIS IR. You can also specify a subnet-level NSG for inbound protection.

  If you don't want any public IP address to be exposed, consider [configuring a self-hosted IR as proxy for your Azure-SSIS IR](self-hosted-integration-runtime-proxy-ssis.md) instead of joining your Azure-SSIS IR to a virtual network.
 
- Can I add the public IP address of my Azure-SSIS IR to the firewall's allowlist for my data sources?

  You can now bring your own static public IP addresses for Azure-SSIS IR. In this case, you can add your IP addresses to the firewall's allowlist for your data sources. Alternatively, you can also consider other options below to secure data access from your Azure-SSIS IR depending on your scenario:

  - If your data source is on premises, after connecting a virtual network to your on-premises network and joining your Azure-SSIS IR to the virtual network subnet, you can then add the private IP address range of that subnet to the firewall's allowlist for your data source.

  - If your data source is an Azure service that supports virtual network service endpoints, you can configure a virtual network service endpoint in your virtual network subnet and join your Azure-SSIS IR to that subnet. You can then add a virtual network rule with that subnet to the firewall for your data source.

  - If your data source is a non-Azure cloud service, you can use a UDR to route the outbound traffic from your Azure-SSIS IR to its static public IP address via an NVA/Azure Firewall. You can then add the static public IP address of your NVA/Azure Firewall to the firewall's allowlist for your data source.

  - If none of the above options meets your needs, consider [configuring a self-hosted IR as proxy for your Azure-SSIS IR](self-hosted-integration-runtime-proxy-ssis.md). You can then add the static public IP address of the machine that hosts your self-hosted IR to the firewall's allowlist for your data source.

- Why do I need to provide two static public addresses if I want to bring my own for Azure-SSIS IR?

  Azure-SSIS IR is automatically updated on a regular basis. New nodes are created during upgrade and old ones will be deleted. However, to avoid downtime, the old nodes will not be deleted until the new ones are ready. Thus, your first static public IP address used by the old nodes cannot be released immediately and we need your second static public IP address to create the new nodes.

- I've brought my own static public IP addresses for Azure-SSIS IR, but why it still can't access my data sources?

  Please confirm that the two static public IP addresses are both added to the firewall's allowlist for your data sources. Each time your Azure-SSIS IR is upgraded, its static public IP address is switched between those two brought by you. If you add only one of them to the allowlist, data access for your Azure-SSIS IR will be broken after its upgrade.

  If your data source is an Azure service, please check whether you've configured it with virtual network service endpoints. If that's the case, the traffic from Azure-SSIS IR to your data source will switch to use the private IP addresses managed by Azure services and adding your own static public IP addresses to the firewall's allowlist for your data source won't take effect.

## Next steps

- [Join Azure-SSIS IR to a virtual network via ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)
- [Join Azure-SSIS IR to a virtual network via Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
