---
title: Join an Azure-SSIS integration runtime to a virtual network
description: Learn how to join an Azure-SSIS integration runtime to an Azure virtual network. 
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 02/01/2020
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: mflasko
---

# Join an Azure-SSIS integration runtime to a virtual network

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When using SQL Server Integration Services (SSIS) in Azure Data Factory, you should join your Azure-SSIS integration runtime (IR) to an Azure virtual network in the following scenarios:

- You want to connect to on-premises data stores from SSIS packages that run on your Azure-SSIS IR without configuring or managing a self-hosted IR as proxy. 

- You want to host SSIS catalog database (SSISDB) in Azure SQL Database with IP firewall rules/virtual network service endpoints or in SQL Managed Instance with private endpoint. 

- You want to connect to Azure resources configured with virtual network service endpoints from SSIS packages that run on your Azure-SSIS IR.

- You want to connect to data stores/resources configured with IP firewall rules from SSIS packages that run on your Azure-SSIS IR.

Data Factory lets you join your Azure-SSIS IR to a virtual network created through the classic deployment model or the Azure Resource Manager deployment model.

> [!IMPORTANT]
> The classic virtual network is being deprecated, so use the Azure Resource Manager virtual network instead.  If you already use the classic virtual network, switch to the Azure Resource Manager virtual network as soon as possible.

The [configuring an Azure-SQL Server Integration Services (SSIS) integration runtime (IR) to join a virtual network](tutorial-deploy-ssis-virtual-network.md) tutorial shows the minimum steps via Azure portal. This article expands on the tutorial and describes all the optional tasks:

- If you are using virtual network (classic).
- If you bring your own public IP addresses for the Azure-SSIS IR.
- If you use your own Domain Name System (DNS) server.
- If you use a network security group (NSG) on the subnet.
- If you use Azure ExpressRoute or a user-defined route (UDR).
- If you use customized Azure-SSIS IR.
- If you use Azure Powershell provisioning.

## Access to on-premises data stores

If your SSIS packages access on-premises data stores, you can join your Azure-SSIS IR to a virtual network that is connected to the on-premises network. Or you can configure and manage a self-hosted IR as proxy for your Azure-SSIS IR. For more information, see [Configure a self-hosted IR as a proxy for an Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/self-hosted-integration-runtime-proxy-ssis). 

When joining your Azure-SSIS IR to a virtual network, remember these important points: 

- If no virtual network is connected to your on-premises network, first create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure a site-to-site [VPN gateway connection](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md) or [ExpressRoute](../expressroute/expressroute-howto-linkvnet-classic.md) connection from that virtual network to your on-premises network. 

- If an Azure Resource Manager virtual network is already connected to your on-premises network in the same location as your Azure-SSIS IR, you can join the IR to that virtual network. 

- If a classic virtual network is already connected to your on-premises network in a different location from your Azure-SSIS IR, you can create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure a [classic-to-Azure Resource Manager virtual network](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) connection. 
 
- If an Azure Resource Manager virtual network is already connected to your on-premises network in a different location from your Azure-SSIS IR, you can first create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure an Azure Resource Manager-to-Azure Resource Manager virtual network connection. 

## Hosting the SSIS catalog in SQL Database

If you host your SSIS catalog in an Azure SQL Database with virtual network service endpoints, make sure that you join your Azure-SSIS IR to the same virtual network and subnet.

If you host your SSIS catalog in SQL Managed Instance with private endpoint, make sure that you join your Azure-SSIS IR to the same virtual network, but in a different subnet than the managed instance. To join your Azure-SSIS IR to a different virtual network than the SQL Managed Instance, we recommend either virtual network peering (which is limited to the same region) or a connection from virtual network to virtual network. For more information, see [Connect your application to Azure SQL Managed Instance](../azure-sql/managed-instance/connect-application-instance.md).

## Access to Azure services

If your SSIS packages access Azure resources that support [virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and you want to secure access to those resources from Azure-SSIS IR, you can join your Azure-SSIS IR to a virtual network subnet configured for virtual network service endpoints and then add a virtual network rule to the relevant Azure resources to allow access from the same subnet.

## Access to data sources protected by IP firewall rule

If your SSIS packages access data stores/resources that allow only specific static public IP addresses and you want to secure access to those resources from Azure-SSIS IR, you can bring your own [public IP addresses](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address) for Azure-SSIS IR while joining it to a virtual network and then add an IP firewall rule to the relevant resources to allow access from those IP addresses.

In all cases, the virtual network can be deployed only through the Azure Resource Manager deployment model.

The following sections provide more details. 

## Virtual network configuration

Set up your virtual network to meet these requirements: 

- Make sure that `Microsoft.Batch` is a registered provider under the subscription of your virtual network subnet that hosts the Azure-SSIS IR. If you use a classic virtual network, also join `MicrosoftAzureBatch` to the Classic Virtual Machine Contributor role for that virtual network. 

- Make sure you have the required permissions. For more information, see [Set up permissions](#perms).

- Select the proper subnet to host the Azure-SSIS IR. For more information, see [Select the subnet](#subnet). 

- If you bring your own public IP addresses for the Azure-SSIS IR, see [Select the static public IP addresses](#publicIP)

- If you use your own Domain Name System (DNS) server on the virtual network, see [Set up the DNS server](#dns_server). 

- If you use a network security group (NSG) on the subnet, see [Set up an NSG](#nsg). 

- If you use Azure ExpressRoute or a user-defined route (UDR), see [Use Azure ExpressRoute or a UDR](#route). 

- Make sure the virtual network's resource group (or the public IP addresses' resource group if you bring your own public IP addresses) can create and delete certain Azure network resources. For more information, see [Set up the resource group](#resource-group). 

- If you customize your Azure-SSIS IR as described in [Custom setup for Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup), your Azure-SSIS IR nodes will get private IP addresses from a predefined range of 172.16.0.0 to 172.31.255.255. So make sure that the private IP address ranges of your virtual or on-premises networks don't collide with this range.

This diagram shows the required connections for your Azure-SSIS IR:

![Azure-SSIS IR](media/join-azure-ssis-integration-runtime-virtual-network/azure-ssis-ir.png)

### <a name="perms"></a> Set up permissions

The user who creates the Azure-SSIS IR must have the following permissions:

- If you're joining your SSIS IR to an Azure Resource Manager virtual network, you have two options:

  - Use the built-in Network Contributor role. This role comes with the _Microsoft.Network/\*_ permission, which has a much larger scope than necessary.

  - Create a custom role that includes only the necessary _Microsoft.Network/virtualNetworks/\*/join/action_ permission. If you also want to bring your own public IP addresses for Azure-SSIS IR while joining it to an Azure Resource Manager virtual network, please also include _Microsoft.Network/publicIPAddresses/*/join/action_ permission in the role.

- If you're joining your SSIS IR to a classic virtual network, we recommend that you use the built-in Classic Virtual Machine Contributor role. Otherwise you have to define a custom role that includes the permission to join the virtual network.

### <a name="subnet"></a> Select the subnet

As you choose a subnet: 

- Don't select the GatewaySubnet to deploy an Azure-SSIS IR. It's dedicated for virtual network gateways. 

- Ensure that the subnet you select has enough available address space for the Azure-SSIS IR to use. Leave available IP addresses for at least two times the IR node number. Azure reserves some IP addresses within each subnet. These addresses can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance, and three more addresses are used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets) 

- Don’t use a subnet that is exclusively occupied by other Azure services (for example, SQL Database SQL Managed Instance, App Service, and so on). 

### <a name="publicIP"></a>Select the static public IP addresses

If you want to bring your own static public IP addresses for Azure-SSIS IR while joining it to a virtual network, make sure they meet the following requirements:

- Exactly two unused ones that are not already associated with other Azure resources should be provided. The extra one will be used when we periodically upgrade your Azure-SSIS IR. Note that one public IP address cannot be shared among your active Azure-SSIS IRs.

- They should both be static ones of standard type. Refer to [SKUs of Public IP Address](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm#sku) for more details.

- They should both have a DNS name. If you have not provided a DNS name when creating them, you can do so on Azure portal.

![Azure-SSIS IR](media/ssis-integration-runtime-management-troubleshoot/setup-publicipdns-name.png)

- They and the virtual network should be under the same subscription and in the same region.

### <a name="dns_server"></a> Set up the DNS server 
If you need to use your own DNS server in a virtual network joined by your Azure-SSIS IR to resolve your private host name, make sure it can also resolve global Azure host names (for example, an Azure Storage blob named `<your storage account>.blob.core.windows.net`). 

One recommended approach is below: 

-   Configure the custom DNS to forward requests to Azure DNS. You can forward unresolved DNS records to the IP address of the Azure recursive resolvers (168.63.129.16) on your own DNS server. 

For more information, see [Name resolution that uses your own DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server). 

> [!NOTE]
> Please use a fully qualified domain name (FQDN) for the your private host name, e.g. use `<your_private_server>.contoso.com` instead of `<your_private_server>`, as Azure-SSIS IR won't automatically append your own DNS suffix.

### <a name="nsg"></a> Set up an NSG
If you need to implement an NSG for the subnet used by your Azure-SSIS IR, allow inbound and outbound traffic through the following ports: 

-   **Inbound requirement of Azure-SSIS IR**

| Direction | Transport protocol | Source | Source port range | Destination | Destination port range | Comments |
|---|---|---|---|---|---|---|
| Inbound | TCP | BatchNodeManagement | * | VirtualNetwork | 29876, 29877 (if you join the IR to a Resource Manager virtual network) <br/><br/>10100, 20100, 30100 (if you join the IR to a classic virtual network)| The Data Factory service uses these ports to communicate with the nodes of your Azure-SSIS IR in the virtual network. <br/><br/> Whether or not you create a subnet-level NSG, Data Factory always configures an NSG at the level of the network interface cards (NICs) attached to the virtual machines that host the Azure-SSIS IR. Only inbound traffic from Data Factory IP addresses on the specified ports is allowed by that NIC-level NSG. Even if you open these ports to internet traffic at the subnet level, traffic from IP addresses that aren't Data Factory IP addresses is blocked at the NIC level. |
| Inbound | TCP | CorpNetSaw | * | VirtualNetwork | 3389 | (Optional) This rule is only required when Microsoft supporter ask customer to open for advanced troubleshooting, and can be closed right after troubleshooting. **CorpNetSaw** service tag permits only secure access workstations on the Microsoft corporate network to use remote desktop. And this service tag can't be selected from portal and is only available via Azure PowerShell or Azure CLI. <br/><br/> At NIC level NSG, port 3389 is open by default and we allow you to control port 3389 at subnet level NSG, meanwhile Azure-SSIS IR has disallowed port 3389 outbound by default at windows firewall rule on each IR node for protection. |
||||||||

-   **Outbound requirement of Azure-SSIS IR**

| Direction | Transport protocol | Source | Source port range | Destination | Destination port range | Comments |
|---|---|---|---|---|---|---|
| Outbound | TCP | VirtualNetwork | * | AzureCloud | 443 | The nodes of your Azure-SSIS IR in the virtual network use this port to access Azure services, such as Azure Storage and Azure Event Hubs. |
| Outbound | TCP | VirtualNetwork | * | Internet | 80 | (Optional) The nodes of your Azure-SSIS IR in the virtual network use this port to download a certificate revocation list from the internet. If you block this traffic, you might experience performance downgrade when start IR and lose capability to check certificate revocation list for certificate usage. If you want to further narrow down destination to certain FQDNs, please refer to **Use Azure ExpressRoute or UDR** section|
| Outbound | TCP | VirtualNetwork | * | Sql | 1433, 11000-11999 | (Optional) This rule is only required when the nodes of your Azure-SSIS IR in the virtual network access an SSISDB hosted by your server. If your server connection policy is set to **Proxy** instead of **Redirect**, only port 1433 is needed. <br/><br/> This outbound security rule isn't applicable to an SSISDB hosted by your SQL Managed Instance in the virtual network or SQL Database configured with private endpoint. |
| Outbound | TCP | VirtualNetwork | * | VirtualNetwork | 1433, 11000-11999 | (Optional) This rule is only required when the nodes of your Azure-SSIS IR in the virtual network access an SSISDB hosted by your SQL Managed Instance in the virtual network or SQL Database configured with private endpoint. If your server connection policy is set to **Proxy** instead of **Redirect**, only port 1433 is needed. |
| Outbound | TCP | VirtualNetwork | * | Storage | 445 | (Optional) This rule is only required when you want to execute SSIS package stored in Azure Files. |
||||||||

### <a name="route"></a> Use Azure ExpressRoute or UDR
If you want to inspect outbound traffic from Azure-SSIS IR, you can route traffic initiated from Azure-SSIS IR to on-premises firewall appliance via [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) force tunneling (advertising a BGP route, 0.0.0.0/0, to the virtual network) or to Network Virtual Appliance (NVA) as a firewall or [Azure Firewall](https://docs.microsoft.com/azure/firewall/) via [UDRs](../virtual-network/virtual-networks-udr-overview.md). 

![NVA scenario for Azure-SSIS IR](media/join-azure-ssis-integration-runtime-virtual-network/azure-ssis-ir-nva.png)

You need to do below things to make whole scenario working
   -   Inbound traffic between Azure Batch management services and the Azure-SSIS IR can't be routed via firewall appliance.
   -   The firewall appliance shall allow outbound traffic required by Azure-SSIS IR.

Inbound traffic between Azure Batch management services and the Azure-SSIS IR can't be routed to firewall appliance otherwise the traffic will be broken due to asymmetric routing problem. Routes must be defined for inbound traffic so the traffic can reply back the same way it came in. You can define specific UDRs to route traffic between Azure Batch management services and the Azure-SSIS IR with next hop type as **Internet**.

For example, if your Azure-SSIS IR is located at `UK South` and you want to inspect outbound traffic through Azure Firewall, you would firstly get an IP range list of service tag `BatchNodeManagement.UKSouth` from the [service tags IP range download link](https://www.microsoft.com/download/details.aspx?id=56519) or through the [Service Tag Discovery API](https://aka.ms/discoveryapi). Then apply the following UDRs of related IP range routes with the next hop type as **Internet** along with the 0.0.0.0/0 route with the next hop type as **Virtual appliance**.

![Azure Batch UDR settings](media/join-azure-ssis-integration-runtime-virtual-network/azurebatch-udr-settings.png)

> [!NOTE]
> This approach incurs an additional maintenance cost. Regularly check the IP range and add new IP ranges into your UDR to avoid breaking the Azure-SSIS IR. We recommend checking the IP range monthly because when the new IP appears in the service tag, the IP will take another month go into effect. 

To make the setup of UDR rules easier, you can run following Powershell script to add UDR rules for Azure Batch management services:
```powershell
$Location = "[location of your Azure-SSIS IR]"
$RouteTableResourceGroupName = "[name of Azure resource group that contains your Route Table]"
$RouteTableResourceName = "[resource name of your Azure Route Table ]"
$RouteTable = Get-AzRouteTable -ResourceGroupName $RouteTableResourceGroupName -Name $RouteTableResourceName
$ServiceTags = Get-AzNetworkServiceTag -Location $Location
$BatchServiceTagName = "BatchNodeManagement." + $Location
$UdrRulePrefixForBatch = $BatchServiceTagName
if ($ServiceTags -ne $null)
{
    $BatchIPRanges = $ServiceTags.Values | Where-Object { $_.Name -ieq $BatchServiceTagName }
    if ($BatchIPRanges -ne $null)
    {
        Write-Host "Start to add rule for your route table..."
        for ($i = 0; $i -lt $BatchIPRanges.Properties.AddressPrefixes.Count; $i++)
        {
            $UdrRuleName = "$($UdrRulePrefixForBatch)_$($i)"
            Add-AzRouteConfig -Name $UdrRuleName `
                -AddressPrefix $BatchIPRanges.Properties.AddressPrefixes[$i] `
                -NextHopType "Internet" `
                -RouteTable $RouteTable `
                | Out-Null
            Write-Host "Add rule $UdrRuleName to your route table..."
        }
        Set-AzRouteTable -RouteTable $RouteTable
    }
}
else
{
    Write-Host "Failed to fetch service tags, please confirm that your Location is valid."
}
```

For firewall appliance to allow outbound traffic, you need to allow outbound to below ports same as requirement in NSG outbound rules.
-   Port 443 with destination as Azure Cloud services.

    If you use Azure Firewall, you can specify network rule with AzureCloud Service Tag. For firewall of the other types, you can either simply allow destination as all for port 443 or allow below FQDNs based on the type of your Azure environment:

    | Azure Environment | Endpoints                                                                                                                                                                                                                                                                                                                                                              |
    |-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Azure Public      | <ul><li><b>Azure Data Factory (Management)</b><ul><li>\*.frontend.clouddatahub.net</li></ul></li><li><b>Azure Storage (Management)</b><ul><li>\*.blob.core.windows.net</li><li>\*.table.core.windows.net</li></ul></li><li><b>Azure Container Registry (Custom Setup)</b><ul><li>\*.azurecr.io</li></ul></li><li><b>Event Hub (Logging)</b><ul><li>\*.servicebus.windows.net</li></ul></li><li><b>Microsoft Logging service (Internal Use)</b><ul><li>gcs.prod.monitoring.core.windows.net</li><li>prod.warmpath.msftcloudes.com</li><li>azurewatsonanalysis-prod.core.windows.net</li></ul></li></ul> |
    | Azure Government  | <ul><li><b>Azure Data Factory (Management)</b><ul><li>\*.frontend.datamovement.azure.us</li></ul></li><li><b>Azure Storage (Management)</b><ul><li>\*.blob.core.usgovcloudapi.net</li><li>\*.table.core.usgovcloudapi.net</li></ul></li><li><b>Azure Container Registry (Custom Setup)</b><ul><li>\*.azurecr.us</li></ul></li><li><b>Event Hub (Logging)</b><ul><li>\*.servicebus.usgovcloudapi.net</li></ul></li><li><b>Microsoft Logging service (Internal Use)</b><ul><li>fairfax.warmpath.usgovcloudapi.net</li><li>azurewatsonanalysis.usgovcloudapp.net</li></ul></li></ul> |
    | Azure China 21Vianet     | <ul><li><b>Azure Data Factory (Management)</b><ul><li>\*.frontend.datamovement.azure.cn</li></ul></li><li><b>Azure Storage (Management)</b><ul><li>\*.blob.core.chinacloudapi.cn</li><li>\*.table.core.chinacloudapi.cn</li></ul></li><li><b>Azure Container Registry (Custom Setup)</b><ul><li>\*.azurecr.cn</li></ul></li><li><b>Event Hub (Logging)</b><ul><li>\*.servicebus.chinacloudapi.cn</li></ul></li><li><b>Microsoft Logging service (Internal Use)</b><ul><li>mooncake.warmpath.chinacloudapi.cn</li><li>azurewatsonanalysis.chinacloudapp.cn</li></ul></li></ul> |

    As for the FQDNs of Azure Storage, Azure Container Registry and Event Hub, you can also choose to enable the following service endpoints for your virtual network so that network traffic to these endpoints goes through Azure backbone network instead of being routed to your firewall appliance:
    -  Microsoft.Storage
    -  Microsoft.ContainerRegistry
    -  Microsoft.EventHub


-   Port 80 with destination as CRL download sites.

    You shall allow below FQDNs which are used as CRL (Certificate Revocation List) download sites of certificates for Azure-SSIS IR management purpose:
    -  crl.microsoft.com:80
    -  mscrl.microsoft.com:80
    -  crl3.digicert.com:80
    -  crl4.digicert.com:80
    -  ocsp.digicert.com:80
    -  cacerts.digicert.com:80
    
    If you are using certificates having different CRL, you are suggested to include them as well. You can read this to understand more on [Certificate Revocation List](https://social.technet.microsoft.com/wiki/contents/articles/2303.understanding-access-to-microsoft-certificate-revocation-list.aspx).

    If you disallow this traffic, you might experience performance downgrade when start Azure-SSIS IR and lose capability to check certificate revocation list for certificate usage which is not recommended from security point of view.

-   Port 1433, 11000-11999 with destination as Azure SQL Database (only required when the nodes of your Azure-SSIS IR in the virtual network access an SSISDB hosted by your server).

    If you use Azure Firewall, you can specify network rule with Azure SQL Service Tag, otherwise you might allow destination as specific azure sql url in firewall appliance.

-   Port 445 with destination as Azure Storage (only required when you execute SSIS package stored in Azure Files).

    If you use Azure Firewall, you can specify network rule with Storage Service Tag, otherwise you might allow destination as specific azure file storage url in firewall appliance.

> [!NOTE]
> For Azure SQL and Storage, if you configure Virtual Network service endpoints on your subnet, then traffic between Azure-SSIS IR and Azure SQL in same region \ Azure Storage in same region or paired region will be routed to Microsoft Azure backbone network directly instead of your firewall appliance.

If you don't need capability of inspecting outbound traffic of Azure-SSIS IR, you can simply apply route to force all traffic to next hop type **Internet**:

-   In an Azure ExpressRoute scenario, you can apply a 0.0.0.0/0 route with the next hop type as **Internet** on the subnet that hosts the Azure-SSIS IR. 
-   In a NVA scenario, you can modify the existing 0.0.0.0/0 route applied on the subnet that hosts the Azure-SSIS IR from the next hop type as **Virtual appliance** to **Internet**.

![Add a route](media/join-azure-ssis-integration-runtime-virtual-network/add-route-for-vnet.png)

> [!NOTE]
> Specify route with next hop type **Internet** doesn't mean all traffic will go over Internet. As long as destination address is for one of Azure's services, Azure routes the traffic directly to the service over Azure's backbone network, rather than routing the traffic to the Internet.

### <a name="resource-group"></a> Set up the resource group

The Azure-SSIS IR needs to create certain network resources under the same resource group as the virtual network. These resources include:
- An Azure load balancer, with the name *\<Guid>-azurebatch-cloudserviceloadbalancer*.
- An Azure public IP address, with the name *\<Guid>-azurebatch-cloudservicepublicip*.
- A network work security group, with the name *\<Guid>-azurebatch-cloudservicenetworksecuritygroup*. 

> [!NOTE]
> You can now bring your own static public IP addresses for Azure-SSIS IR. In this scenario, we will create only the Azure load balancer and network security group under the same resource group as your static public IP addresses instead of the virtual network.

Those resources will be created when your Azure-SSIS IR starts. They'll be deleted when your Azure-SSIS IR stops. If you bring your own static public IP addresses for Azure-SSIS IR, your own static public IP addresses won't be deleted when your Azure-SSIS IR stops. To avoid blocking your Azure-SSIS IR from stopping, don't reuse these network resources in your other resources.

Make sure that you have no resource lock on the resource group/subscription to which the virtual network/your static public IP addresses belong. If you configure a read-only/delete lock, starting and stopping your Azure-SSIS IR will fail, or it will stop responding.

Make sure that you don't have an Azure Policy assignment that prevents the following resources from being created under the resource group/subscription to which the virtual network/your static public IP addresses belong: 
- Microsoft.Network/LoadBalancers 
- Microsoft.Network/NetworkSecurityGroups 
- Microsoft.Network/PublicIPAddresses 

Make sure that the resource quota of your subscription is enough for the above three network resources. Specifically, for each Azure-SSIS IR created in virtual network, you need to reserve two free quotas for each of the above three network resources. The extra one quota will be used when we periodically upgrade your Azure-SSIS IR.

### <a name="faq"></a> FAQ

- How can I protect the public IP address exposed on my Azure-SSIS IR for inbound connection? Is it possible to remove the public IP address?
 
  Right now, a public IP address will be automatically created when your Azure-SSIS IR joins a virtual network. We do have an NIC-level NSG to allow only Azure Batch management services to inbound-connect to your Azure-SSIS IR. You can also specify a subnet-level NSG for inbound protection.

  If you don't want any public IP address to be exposed, consider [configuring a self-hosted IR as proxy for your Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/self-hosted-integration-runtime-proxy-ssis) instead of joining your Azure-SSIS IR to a virtual network, if this applies to your scenario.
 
- Can I add the public IP address of my Azure-SSIS IR to the firewall's allow list for my data sources?

  You can now bring your own static public IP addresses for Azure-SSIS IR. In this case, you can add your IP addresses to the firewall's allow list for your data sources. You can also consider other options below to secure data access from your Azure-SSIS IR depending on your scenario:

  - If your data source is on premises, after connecting a virtual network to your on-premises network and joining your Azure-SSIS IR to the virtual network subnet, you can then add the private IP address range of that subnet to the firewall's allow list for your data source.
  - If your data source is an Azure service that supports virtual network service endpoints, you can configure a virtual network service endpoint on your virtual network subnet and join your Azure-SSIS IR to that subnet. You can then add a virtual network rule with that subnet to the firewall for your data source.
  - If your data source is a non-Azure cloud service, you can use a UDR to route outbound traffic from your Azure-SSIS IR to an NVA/Azure Firewall via a static public IP address. You can then add the static public IP address of your NVA/Azure Firewall to the firewall's allow list for your data source.
  - If none of the above options meets your needs, consider [configuring a self-hosted IR as proxy for your Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/self-hosted-integration-runtime-proxy-ssis). You can then add the static public IP address of the machine that hosts your self-hosted IR to the firewall's allow list for your data source.

- Why do I need to provide two static public addresses if I want to bring my own for Azure-SSIS IR?

  Azure-SSIS IR is automatically updated on a regular basis. New nodes are created during upgrade and old ones will be deleted. However, to avoid downtime, the old nodes will not be deleted until the new ones are ready. Thus, your first static public IP address used by the old nodes cannot be released immediately and we need your second static public IP address to create the new nodes.

- I have brought my own static public IP addresses for Azure-SSIS IR, but why it still cannot access my data sources?

  - Confirm that the two static public IP addresses are both added to the firewall's allow list for your data sources. Each time your Azure-SSIS IR is upgraded, its static public IP address is switched between the two brought by you. If you add only one of them to the allow list, data access for your Azure-SSIS IR will be broken after its upgrade.
  - If your data source is an Azure service, please check whether you have configured it with virtual network service endpoints. If that's the case, the traffic from Azure-SSIS IR to your data source will switch to use the private IP addresses managed by Azure services and adding your own static public IP addresses to the firewall's allow list for your data source will not take effect.

## Azure portal (Data Factory UI)

This section shows you how to join an existing Azure-SSIS IR to a virtual network (classic or Azure Resource Manager) by using the Azure portal and Data Factory UI. 

Before joining your Azure-SSIS IR to the virtual network, you need to properly configure the virtual network. Follow the steps in the section that applies to your type of virtual network (classic or Azure Resource Manager). Then follow the steps in the third section to join your Azure-SSIS IR to the virtual network. 

### Configure an Azure Resource Manager virtual network

Use the portal to configure an Azure Resource Manager virtual network before you try to join an Azure-SSIS IR to it.

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support the Data Factory UI. 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Select **More services**. Filter for and select **Virtual networks**. 

1. Filter for and select your virtual network in the list. 

1. On the **Virtual network** page, select **Properties**. 

1. Select the copy button for **RESOURCE ID** to copy the resource ID for the virtual network to the clipboard. Save the ID from the clipboard in OneNote or a file. 

1. On the left menu, select **Subnets**. Ensure that the number of available addresses is greater than the nodes in your Azure-SSIS IR. 

1. Verify that the Azure Batch provider is registered in the Azure subscription that has the virtual network. Or register the Azure Batch provider. If you already have an Azure Batch account in your subscription, your subscription is registered for Azure Batch. (If you create the Azure-SSIS IR in the Data Factory portal, the Azure Batch provider is automatically registered for you.) 

   1. In the Azure portal, on the left menu, select **Subscriptions**. 

   1. Select your subscription. 

   1. On the left, select **Resource providers**, and confirm that **Microsoft.Batch** is a registered provider. 

   ![Confirmation of "Registered" status](media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png)

   If you don't see **Microsoft.Batch** in the list, to register it, [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in your subscription. You can delete it later. 

### Configure a classic virtual network

Use the portal to configure a classic virtual network before you try to join an Azure-SSIS IR to it. 

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support the Data Factory UI. 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Select **More services**. Filter for and select **Virtual networks (classic)**. 

1. Filter for and select your virtual network in the list. 

1. On the **Virtual network (classic)** page, select **Properties**. 

   ![Classic virtual network resource ID](media/join-azure-ssis-integration-runtime-virtual-network/classic-vnet-resource-id.png)

1. Select the copy button for **RESOURCE ID** to copy the resource ID for the classic network to the clipboard. Save the ID from the clipboard in OneNote or a file. 

1. On the left menu, select **Subnets**. Ensure that the number of available addresses is greater than the nodes in your Azure-SSIS IR. 

   ![Number of available addresses in the virtual network](media/join-azure-ssis-integration-runtime-virtual-network/number-of-available-addresses.png)

1. Join **MicrosoftAzureBatch** to the **Classic Virtual Machine Contributor** role for the virtual network. 

   1. On the left menu, select **Access control (IAM)**, and select the **Role assignments** tab. 

       !["Access control" and "Add" buttons](media/join-azure-ssis-integration-runtime-virtual-network/access-control-add.png)

   1. Select **Add role assignment**.

   1. On the **Add role assignment** page, for **Role**, select **Classic Virtual Machine Contributor**. In the **Select** box, paste **ddbf3205-c6bd-46ae-8127-60eb93363864**, and then select **Microsoft Azure Batch** from the list of search results. 

       ![Search results on the "Add role assignment" page](media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-to-vm-contributor.png)

   1. Select **Save** to save the settings and close the page. 

       ![Save access settings](media/join-azure-ssis-integration-runtime-virtual-network/save-access-settings.png)

   1. Confirm that you see **Microsoft Azure Batch** in the list of contributors. 

       ![Confirm Azure Batch access](media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-in-list.png)

1. Verify that the Azure Batch provider is registered in the Azure subscription that has the virtual network. Or register the Azure Batch provider. If you already have an Azure Batch account in your subscription, your subscription is registered for Azure Batch. (If you create the Azure-SSIS IR in the Data Factory portal, the Azure Batch provider is automatically registered for you.) 

   1. In the Azure portal, on the left menu, select **Subscriptions**. 

   1. Select your subscription. 

   1. On the left, select **Resource providers**, and confirm that **Microsoft.Batch** is a registered provider. 

   ![Confirmation of "Registered" status](media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png)

   If you don't see **Microsoft.Batch** in the list, to register it, [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in your subscription. You can delete it later. 

### Join the Azure-SSIS IR to a virtual network

After you've configured your Azure Resource Manager virtual network or classic virtual network, you can join the Azure-SSIS IR to the virtual network:

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support the Data Factory UI. 

1. In the [Azure portal](https://portal.azure.com), on the left menu, select **Data factories**. If you don't see **Data factories** on the menu, select **More services**, and then in the **INTELLIGENCE + ANALYTICS** section, select **Data factories**. 

   ![List of data factories](media/join-azure-ssis-integration-runtime-virtual-network/data-factories-list.png)

1. Select your data factory with the Azure-SSIS IR in the list. You see the home page for your data factory. Select the **Author & Monitor** tile. You see the Data Factory UI on a separate tab. 

   ![Data factory home page](media/join-azure-ssis-integration-runtime-virtual-network/data-factory-home-page.png)

1. In the Data Factory UI, switch to the **Edit** tab, select **Connections**, and switch to the **Integration Runtimes** tab. 

   !["Integration runtimes" tab](media/join-azure-ssis-integration-runtime-virtual-network/integration-runtimes-tab.png)

1. If your Azure-SSIS IR is running, in the **Integration Runtimes** list, in the **Actions** column, select the **Stop** button for your Azure-SSIS IR. You can't edit your Azure-SSIS IR until you stop it. 

   ![Stop the IR](media/join-azure-ssis-integration-runtime-virtual-network/stop-ir-button.png)

1. In the **Integration Runtimes** list, in the **Actions** column, select the **Edit** button for your Azure-SSIS IR. 

   ![Edit the integration runtime](media/join-azure-ssis-integration-runtime-virtual-network/integration-runtime-edit.png)

1. On the integration runtime setup panel, advance through the **General Settings** and **SQL Settings** sections by selecting the **Next** button. 

1. On the **Advanced Settings** section: 

   1. Select the **Select a VNet for your Azure-SSIS Integration Runtime to join, allow ADF to create certain network resources, and optionally bring your own static public IP addresses** check box. 

   1. For **Subscription**, select the Azure subscription that has your virtual network.

   1. For **Location**, the same location of your integration runtime is selected.

   1. For **Type**, select the type of your virtual network: classic or Azure Resource Manager. We recommend that you select an Azure Resource Manager virtual network, because classic virtual networks will be deprecated soon.

   1. For **VNet Name**, select the name of your virtual network. It should be the same one used for SQL Database with virtual network service endpoints or SQL Managed Instance with private endpoint to host SSISDB. Or it should be the same one connected to your on-premises network. Otherwise, it can be any virtual network to bring your own static public IP addresses for Azure-SSIS IR.

   1. For **Subnet Name**, select the name of subnet for your virtual network. It should be the same one used for SQL Database with virtual network service endpoints to host SSISDB. Or it should be a different subnet from the one used for SQL Managed Instance with private endpoint to host SSISDB. Otherwise, it can be any subnet to bring your own static public IP addresses for Azure-SSIS IR.

   1. Select the **Bring static public IP addresses for your Azure-SSIS Integration Runtime** check box to choose whether you want to bring your own static public IP addresses for Azure-SSIS IR, so you can allow them on the firewall for your data sources.

      If you select the check box, complete the following steps.

      1. For **First static public IP address**, select the first static public IP address that [meets the requirements](#publicIP) for your Azure-SSIS IR. If you don't have any, click **Create new** link to create static public IP addresses on Azure portal and then click the refresh button here, so you can select them.
	  
      1. For **Second static public IP address**, select the second static public IP address that [meets the requirements](#publicIP) for your Azure-SSIS IR. If you don't have any, click **Create new** link to create static public IP addresses on Azure portal and then click the refresh button here, so you can select them.

   1. Select **VNet Validation**. If the validation is successful, select **Continue**. 

   ![Advanced settings with a virtual network](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet.png)

1. On the **Summary** section, review all settings for your Azure-SSIS IR. Then select **Update**.

1. Start your Azure-SSIS IR by selecting the **Start** button in the **Actions** column for your Azure-SSIS IR. It takes about 20 to 30 minutes to start the Azure-SSIS IR that joins a virtual network. 

## Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Define the variables

```powershell
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your data factory name]"
$AzureSSISName = "[your Azure-SSIS IR name]"
# Virtual network info: Classic or Azure Resource Manager
$VnetId = "[your virtual network resource ID or leave it empty]" # REQUIRED if you use SQL Database with IP firewall rules/virtual network service endpoints or SQL Managed Instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR. We recommend an Azure Resource Manager virtual network, because classic virtual networks will be deprecated soon.
$SubnetName = "[your subnet name or leave it empty]" # WARNING: Use the same subnet as the one used for SQL Database with virtual network service endpoints, or a different subnet from the one used for SQL Managed Instance with a private endpoint
# Public IP address info: OPTIONAL to provide two standard static public IP addresses with DNS name under the same subscription and in the same region as your virtual network
$FirstPublicIP = "[your first public IP address resource ID or leave it empty]"
$SecondPublicIP = "[your second public IP address resource ID or leave it empty]"
```

### Configure a virtual network

Before you can join your Azure-SSIS IR to a virtual network, you need to configure the virtual network. To automatically configure virtual network permissions and settings for your Azure-SSIS IR to join the virtual network, add the following script:

```powershell
# Make sure to run this script against the subscription to which the virtual network belongs.
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    # Register to the Azure Batch resource provider
    $BatchApplicationId = "ddbf3205-c6bd-46ae-8127-60eb93363864"
    $BatchObjectId = (Get-AzADServicePrincipal -ServicePrincipalName $BatchApplicationId).Id
    Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
    Start-Sleep -s 10
    }
    if($VnetId -match "/providers/Microsoft.ClassicNetwork/")
    {
        # Assign the VM contributor role to Microsoft.Batch
        New-AzRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
    }
}
```

### Create an Azure-SSIS IR and join it to a virtual network

You can create an Azure-SSIS IR and join it to a virtual network at the same time. For the complete script and instructions, see [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md#use-azure-powershell-to-create-an-integration-runtime).

### Join an existing Azure-SSIS IR to a virtual network

The [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md) article shows you how to create an Azure-SSIS IR and join it to a virtual network in the same script. If you already have an Azure-SSIS IR, follow these steps to join it to the virtual network: 
1. Stop the Azure-SSIS IR. 
1. Configure the Azure-SSIS IR to join the virtual network. 
1. Start the Azure-SSIS IR. 

### Stop the Azure-SSIS IR

You have to stop the Azure-SSIS IR before you can join it to a virtual network. This command releases all of its nodes and stops billing:

```powershell
Stop-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force 
```

### Configure virtual network settings for the Azure-SSIS IR to join

To configure settings for the virtual network that the Azure-SSIS will join, use this script: 

```powershell
# Make sure to run this script against the subscription to which the virtual network belongs.
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    # Register to the Azure Batch resource provider
    $BatchApplicationId = "ddbf3205-c6bd-46ae-8127-60eb93363864"
    $BatchObjectId = (Get-AzADServicePrincipal -ServicePrincipalName $BatchApplicationId).Id
    Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
        Start-Sleep -s 10
    }
    if($VnetId -match "/providers/Microsoft.ClassicNetwork/")
    {
        # Assign VM contributor role to Microsoft.Batch
        New-AzRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
    }
}
```

### Configure the Azure-SSIS IR

To join your Azure-SSIS IR to a virtual network, run the `Set-AzDataFactoryV2IntegrationRuntime` command: 

```powershell
Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -VnetId $VnetId `
    -Subnet $SubnetName

# Add public IP address parameters if you bring your own static public IP addresses
if(![string]::IsNullOrEmpty($FirstPublicIP) -and ![string]::IsNullOrEmpty($SecondPublicIP))
{
    $publicIPs = @($FirstPublicIP, $SecondPublicIP)
    Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
        -DataFactoryName $DataFactoryName `
        -Name $AzureSSISName `
        -PublicIPs $publicIPs
}
```

### Start the Azure-SSIS IR

To start the Azure-SSIS IR, run the following command: 

```powershell
Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force
```

This command takes 20 to 30 minutes to finish.

## Next steps

For more information about Azure-SSIS IR, see the following articles: 
- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-create-azure-ssis-runtime-portal.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database to host the SSIS catalog. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions about using Azure SQL Database with virtual network service endpoints or SQL Managed Instance in a virtual network to host the SSIS catalog. It shows how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to get information about your Azure-SSIS IR. It provides status descriptions for the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding nodes.