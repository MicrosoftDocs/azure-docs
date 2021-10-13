---
title: Join an Azure-SSIS integration runtime to a virtual network
description: Learn how to join an Azure-SSIS integration runtime to an Azure virtual network. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/16/2021
author: swinarko
ms.author: sawinark 
ms.custom: devx-track-azurepowershell
---

# Join an Azure-SSIS integration runtime to a virtual network

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

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
- If you use Azure PowerShell provisioning.

## Access to on-premises data stores

If your SSIS packages access on-premises data stores, you can join your Azure-SSIS IR to a virtual network that is connected to the on-premises network. Or you can configure and manage a self-hosted IR as proxy for your Azure-SSIS IR. For more information, see [Configure a self-hosted IR as a proxy for an Azure-SSIS IR](./self-hosted-integration-runtime-proxy-ssis.md). 

When joining your Azure-SSIS IR to a virtual network, remember these important points: 

- If no virtual network is connected to your on-premises network, first create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure a site-to-site [VPN gateway connection](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md) or [ExpressRoute](../expressroute/expressroute-howto-linkvnet-classic.md) connection from that virtual network to your on-premises network. 

- If an Azure Resource Manager virtual network is already connected to your on-premises network in the same location as your Azure-SSIS IR, you can join the IR to that virtual network. 

- If a classic virtual network is already connected to your on-premises network in a different location from your Azure-SSIS IR, you can create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure a [classic-to-Azure Resource Manager virtual network](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) connection. 
 
- If an Azure Resource Manager virtual network is already connected to your on-premises network in a different location from your Azure-SSIS IR, you can first create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure an [Azure Resource Manager-to-Azure Resource Manager virtual network](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) connection. 

## Hosting the SSIS catalog in SQL Database

If you host your SSIS catalog in an Azure SQL Database with virtual network service endpoints, make sure that you join your Azure-SSIS IR to the same virtual network and subnet.

If you host your SSIS catalog in SQL Managed Instance with private endpoint, make sure that you join your Azure-SSIS IR to the same virtual network, but in a different subnet than the managed instance. To join your Azure-SSIS IR to a different virtual network than the SQL Managed Instance, we recommend either virtual network peering (which is limited to the same region) or a connection from virtual network to virtual network. For more information, see [Connect your application to Azure SQL Managed Instance](../azure-sql/managed-instance/connect-application-instance.md).

## Access to Azure services

If your SSIS packages access Azure resources that support [virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and you want to secure access to those resources from Azure-SSIS IR, you can join your Azure-SSIS IR to a virtual network subnet configured for virtual network service endpoints and then add a virtual network rule to the relevant Azure resources to allow access from the same subnet.

## Access to data sources protected by IP firewall rule

If your SSIS packages access data stores/resources that allow only specific static public IP addresses and you want to secure access to those resources from Azure-SSIS IR, you can associate [public IP addresses](../virtual-network/virtual-network-public-ip-address.md) with Azure-SSIS IR while joining it to a virtual network and then add an IP firewall rule to the relevant resources to allow access from those IP addresses. There are two alternative ways to do this: 

- When you create Azure-SSIS IR, you can bring your own public IP addresses and specify them via the [Azure Data Factory Studio UI](join-azure-ssis-integration-runtime-virtual-network-ui.md) or [Azure PowerShell SDK](join-azure-ssis-integration-runtime-virtual-network-powershell.md). Only the outbound internet connectivity of Azure-SSIS IR will use your provided public IP addresses and other devices in the subnet will not use them.
- You can also setup [Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) for the subnet that Azure-SSIS IR will join and all outbound connectivity in this subnet will use your specified public IP addresses.

In all cases, the virtual network can be deployed only through the Azure Resource Manager deployment model.

## Next steps

- [Azure-SSIS integration runtime virtual network configuration details](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Join an Azure-SSIS integration runtime to a virtual network with the Azure Data Factory Studio UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)
- [Join an Azure-SSIS integration runtime to a virtual network with Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 
- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](./tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database to host the SSIS catalog. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions about using Azure SQL Database with virtual network service endpoints or SQL Managed Instance in a virtual network to host the SSIS catalog. It shows how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to get information about your Azure-SSIS IR. It provides status descriptions for the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding nodes.
