---
title: Configure a virtual network for express injection of Azure-SSIS integration runtime
description: Learn how to configure a virtual network for express injection of Azure-SSIS integration runtime. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 12/16/2022
author: chugugrace
ms.author: chugu 
---

# Express virtual network injection method

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
> [!NOTE]
> Express virtual network injection feature is not supported for SSIS integration runtime in below regions yet:
>
>- Jio India West or Switzerland West
>- US Gov Texas or US Gov Arizona
>- China North 2 or China East 2

When using SQL Server Integration Services (SSIS) in Azure Data Factory (ADF) or Synapse Pipelines, there are two methods for you to join your Azure-SSIS integration runtime (IR) to a virtual network: standard and express. If you use the express method, you need to configure your virtual network to meet these requirements: 

- Make sure that *Microsoft.Batch* is a registered resource provider in Azure subscription that has the virtual network for your Azure-SSIS IR to join. For detailed instructions, see the [Register Azure Batch as a resource provider](azure-ssis-integration-runtime-virtual-network-configuration.md#registerbatch) section.

- Make sure that there's no resource lock in your virtual network.

- Select a proper subnet in the virtual network for your Azure-SSIS IR to join. For more information, see the [Select a subnet](#subnet) section below.

- Make sure that the user creating Azure-SSIS IR is granted the necessary role-based access control (RBAC) permissions to join the virtual network/subnet.  For more information, see the [Select virtual network permissions](#perms) section below.

Depending on your specific scenario, you can optionally configure the following:

- If you want to use a static public IP address for the outbound traffic of your Azure-SSIS IR, see the [Configure a static public IP address](#ip) section below.

- If you want to use your own domain name system (DNS) server in the virtual network, see the [Configure a custom DNS server](#dns) section below.

- If you want to use a network security group (NSG) to limit outbound traffic on the subnet, see the [Configure an NSG](#nsg) section below.

- If you want to use user-defined routes (UDRs) to audit/inspect outbound traffic, see the [Configure UDRs](#udr) section below.

This diagram shows the required connections for your Azure-SSIS IR:

:::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-ssis-ir-express.png" alt-text="Diagram that shows the required connections for your Azure-SSIS IR in express virtual network injection.":::

## <a name="subnet"></a>Select a subnet

To enable express virtual network injection, you must select a proper subnet for your Azure-SSIS IR to join:

- Don't select the GatewaySubnet, since it's dedicated for virtual network gateways.

- Make sure that the selected subnet has available IP addresses for at least two times your Azure-SSIS IR node number. These are required for us to avoid disruptions when rolling out patches/upgrades for your Azure-SSIS IR. Azure also reserves some IP addresses that can’t be used in each subnet. The first and last IP addresses are reserved for protocol compliance, while three more addresses are reserved for Azure services. For more information, see the [Subnet IP address restrictions](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets) section.

- Don't use a subnet that is exclusively occupied by other Azure services (for example, Azure SQL Managed Instance, App Service, and so on).

- The selected subnet must be delegated to *Microsoft.Batch/batchAccounts* service. For more information, see the [Subnet delegation overview](../virtual-network/subnet-delegation-overview.md) article. For detailed instructions, see the [Delegate a subnet to Azure Batch](azure-ssis-integration-runtime-virtual-network-configuration.md#delegatesubnet) section.

## <a name="perms"></a>Select virtual network permissions

To enable express virtual network injection, the user creating Azure-SSIS IR must be granted the necessary RBAC permissions to join the virtual network/subnet. You have two options:

- Use the built-in *Network Contributor* role. This role comes with the _Microsoft.Network/\*_ permission, which has a much larger scope than necessary.

- Create a custom role that includes only the necessary *Microsoft.Network/virtualNetworks/subnets/join/action* permission.

For detailed instructions, see the [Grant virtual network permissions](azure-ssis-integration-runtime-virtual-network-configuration.md#grantperms) section.

## <a name="ip"></a>Configure a static public IP address

If you want to use a static public IP address for the outbound traffic of your Azure-SSIS IR, so you can allow it on your firewalls, you must configure [virtual network network address translation (NAT)](../virtual-network/nat-gateway/nat-overview.md) to set it up.

## <a name="dns"></a>Configure a custom DNS server

If you want to use your own DNS server in the virtual network to resolve your private hostnames, make sure that it can also resolve global Azure hostnames (for example, your Azure Blob Storage named `<your storage account>.blob.core.windows`.).

We recommend you configure your own DNS server to forward unresolved DNS requests to the IP address of Azure recursive resolvers (*168.63.129.16*).

For more information, see the [DNS server name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) section.

At present, for Azure-SSIS IR to use your own DNS server, you need to configure it with a standard custom setup following these steps:

1. Download a custom setup script ([main.cmd](https://expressvnet.blob.core.windows.net/customsetup/main.cmd?sp=r&st=2022-10-24T07:34:04Z&se=2042-10-24T15:34:04Z&spr=https&sv=2021-06-08&sr=b&sig=dfU16IBua6T%2FB2splQS6rZIXmgkSABaFUZd6%2BWF7fnc%3D)) + its associated file ([setupdnsserver.ps1](https://expressvnet.blob.core.windows.net/customsetup/setupdnsserver.ps1?sp=r&st=2022-10-24T07:36:00Z&se=2042-10-24T15:36:00Z&spr=https&sv=2021-06-08&sr=b&sig=TbspnXbFQv3NPnsRkNe7Q84EdLQT2f1KL%2FxqczFtaw0%3D)).

1. Replace “your-dns-server-ip” in main.cmd with the IP address of your own DNS server.

1. Upload main.cmd + setupdnsserver.ps1 into your own Azure Storage blob container for standard custom setup and enter its SAS URI when provisioning Azure-SSIS IR, see the [Customizing Azure-SSIS IR](how-to-configure-azure-ssis-ir-custom-setup.md) article.

> [!NOTE]
> Please use a Fully Qualified Domain Name (FQDN) for your private hostname (for example, use `<your_private_server>.contoso.com` instead of `<your_private_server>`). Alternatively, you can use a standard custom setup on your Azure-SSIS IR to automatically append your own DNS suffix (for example `contoso.com`) to any unqualified single label domain name and turn it into an FQDN before using it in DNS queries, see the [Standard custom setup samples](how-to-configure-azure-ssis-ir-custom-setup.md#standard-custom-setup-samples) section. 

## <a name="nsg"></a>Configure an NSG

If you want to use an NSG on the subnet joined by your Azure-SSIS IR, allow the following outbound traffic: 

| Transport protocol | Source | Source ports | Destination | Destination ports | Comments | 
|--------------------|--------|--------------|-------------|-------------------|----------| 
| TCP | *VirtualNetwork* | * | *DataFactoryManagement* | *443* | Required for your Azure-SSIS IR to access ADF services.<br/><br/>Its outbound traffic uses only ADF public endpoint for now. | 
| TCP | *VirtualNetwork* | * | *Sql/VirtualNetwork* | *1433, 11000-11999* | (Optional) Only required if you use Azure SQL Database server/Managed Instance to host SSIS catalog (SSISDB).<br/><br/>If your Azure SQL Database server/Managed Instance is configured with a public endpoint/virtual network service endpoint, use *Sql* service tag as destination.<br/><br/>If your Azure SQL Database server/Managed Instance is configured with a private endpoint, use *VirtualNetwork* service tag as destination.<br/><br/>If your server connection policy is set to *Proxy* instead of *Redirect*, only port *1433* is required. | 
| TCP | *VirtualNetwork* | * | *Storage/VirtualNetwork* | *443* | (Optional) Only required if you use Azure Storage blob container to store your standard custom setup script/files.<br/><br/>If your Azure Storage is configured with a public endpoint/virtual network service endpoint, use *Storage* service tag as destination.<br/><br/>If your Azure Storage is configured with a private endpoint, use *VirtualNetwork* service tag as destination. | 
| TCP | *VirtualNetwork* | * | *Storage/VirtualNetwork* | *445* | (Optional) Only required if you need to access Azure Files.<br/><br/>If your Azure Storage is configured with a public endpoint/virtual network service endpoint, use *Storage* service tag as destination.<br/><br/>If your Azure Storage is configured with a private endpoint, use *VirtualNetwork* service tag as destination. | 

## <a name="udr"></a>Configure UDRs

If you want to audit/inspect the outbound traffic from your Azure-SSIS IR, you can use [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) to redirect it to an on-premises firewall appliance via [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) forced tunneling that advertises a border gateway protocol (BGP) route *0.0.0.0/0* to the virtual network, to a network virtual appliance (NVA) configured as firewall, or to [Azure Firewall](../firewall/overview.md) service.

Following our guidance in the [Configure an NSG](#nsg) section above, you must implement similar rules on the firewall appliance/service to allow the outbound traffic from your Azure-SSIS IR:

- If you use Azure Firewall:
  - You must open port *443* for outbound TCP traffic with *DataFactoryManagement* service tag as destination.

  - If you use Azure SQL Database server/Managed Instance to host SSISDB, you must open ports *1433, 11000-11999* for outbound TCP traffic with *Sql/VirtualNetwork* service tag as destination.

  - If you use Azure Storage blob container to store your standard custom setup script/files, you must open port *443* for outbound TCP traffic with *Storage/VirtualNetwork* service tag as destination.

  - If you need to access Azure Files, you must open port *445* for outbound TCP traffic with *Storage/VirtualNetwork* service tag as destination.

- If you use other firewall appliance/service:
  - You must open port *443* for outbound TCP traffic with *0.0.0.0/0* or the following Azure environment-specific FQDN as destination:

    | Azure environment | FQDN |
    |-------------------|------|
    | <b>Azure Public</b> | _\*.frontend.clouddatahub.net_ |
    | <b>Azure Government</b> | _\*.frontend.datamovement.azure.us_ |
    | <b>Microsoft Azure operated by 21Vianet</b> | _\*.frontend.datamovement.azure.cn_ |

  - If you use Azure SQL Database server/Managed Instance to host SSISDB, you must open ports *1433, 11000-11999* for outbound TCP traffic with *0.0.0.0/0* or your Azure SQL Database server/Managed Instance FQDN as destination.

  - If you use Azure Storage blob container to store your standard custom setup script/files, you must open port *443* for outbound TCP traffic with *0.0.0.0/0* or your Azure Blob Storage FQDN as destination.

  - If you need to access Azure Files, you must open port *445* for outbound TCP traffic with *0.0.0.0/0* or your Azure Files FQDN as destination.

## Next steps

- [Join Azure-SSIS IR to a virtual network via ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)
- [Join Azure-SSIS IR to a virtual network via Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
