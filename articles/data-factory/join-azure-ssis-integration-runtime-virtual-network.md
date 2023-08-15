---
title: Join Azure-SSIS integration runtime to a virtual network
description: Learn how to join Azure-SSIS integration runtime to a virtual network. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/20/2023
author: chugugrace
ms.author: chugu 
---

# Join Azure-SSIS integration runtime to a virtual network

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

When using SQL Server Integration Services (SSIS) in Azure Data Factory (ADF), you should join your Azure-SSIS integration runtime (IR) to a virtual network in the following scenarios:

- You want to access on-premises data stores/resources from SSIS packages that run on your Azure-SSIS IR without configuring and managing a self-hosted IR as proxy.

- You want to use Azure SQL Database server configured with a private endpoint/IP firewall rule/virtual network service endpoint or Azure SQL Managed Instance that joins a virtual network to host SSIS catalog database (SSISDB).

- You want to access Azure data stores/resources configured with a private endpoint/IP firewall rule/virtual network service endpoint from SSIS packages that run on your Azure-SSIS IR.

- You want to access other cloud data stores/resources configured with an IP firewall rule from SSIS packages that run on your Azure-SSIS IR.

ADF lets you join your Azure-SSIS IR to a virtual network created through Azure Resource Manager or classic deployment model.

> [!IMPORTANT]
> The classic virtual network is being deprecated, so use the Azure Resource Manager virtual network instead. If you already use the classic virtual network, switch to the Azure Resource Manager virtual network as soon as possible.

The [Configure Azure-SSIS IR to join a virtual network](tutorial-deploy-ssis-virtual-network.md) tutorial shows the minimum steps with express virtual network injection method via Azure portal/ADF UI. This article and other ones like the [Configure a virtual network to inject Azure-SSIS IR](azure-ssis-integration-runtime-virtual-network-configuration.md) article expand on the tutorial and describe all optional steps:

- If you use the standard virtual network injection method.
- If you use the classic virtual network.
- If you bring your own static public IP (BYOIP) addresses for Azure-SSIS IR.
- If you use your own domain name system (DNS) server.
- If you use a network security group (NSG).
- If you use user-defined routes (UDRs).
- If you use customized Azure-SSIS IR.
- If you use Azure PowerShell to provision your Azure-SSIS IR.

## Access to on-premises data stores

If your SSIS packages access on-premises data stores, you can join your Azure-SSIS IR to a virtual network that is connected to the on-premises network. Alternatively, you can configure and manage a self-hosted IR as proxy for your Azure-SSIS IR. For more information, see [Configure a self-hosted IR as proxy for Azure-SSIS IR](self-hosted-integration-runtime-proxy-ssis.md). 

When joining your Azure-SSIS IR to a virtual network, remember these important points: 

- If no virtual network is connected to your on-premises network, first create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure a site-to-site [VPN gateway connection](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md) or [Azure ExpressRoute](../expressroute/expressroute-howto-linkvnet-classic.md) connection from that virtual network to your on-premises network. 

- If an Azure Resource Manager virtual network is already connected to your on-premises network in the same location as your Azure-SSIS IR, you can join your IR to that virtual network. 

- If a classic virtual network is already connected to your on-premises network in a different location from your Azure-SSIS IR, you can create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure a [classic-to-Azure Resource Manager virtual network](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) connection. 
 
- If an Azure Resource Manager network is already connected to your on-premises network in a different location from your Azure-SSIS IR, you can first create an [Azure Resource Manager virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network) for your Azure-SSIS IR to join. Then configure an [Azure Resource Manager-to-Azure Resource Manager virtual network](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) connection. 

## Hosting SSISDB in Azure SQL Database server or Managed instance

If you host SSISDB in Azure SQL Database server configured with a virtual network service endpoint, make sure that you join your Azure-SSIS IR to the same virtual network and subnet.

If you host SSISDB in Azure SQL Managed Instance that joins a virtual network, make sure that you join your Azure-SSIS IR to the same virtual network, but in a different subnet than the managed instance. To join your Azure-SSIS IR to a different virtual network than the managed instance, we recommend either virtual network peering (which is limited to the same region) or virtual network-to-virtual network connection. For more information, see [Connect your application to Azure SQL Managed Instance](/azure/azure-sql/managed-instance/connect-application-instance).

## Access to Azure data stores

If your SSIS packages access Azure data stores/resources that support [virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and you want to secure access to those resources from Azure-SSIS IR, you can join your Azure-SSIS IR to a virtual network subnet configured for virtual network service endpoints and then add a virtual network rule on the firewall of relevant resources to allow access from the same subnet.

## Access to other cloud data stores

If your SSIS packages access other cloud data stores/resources that allow only specific static public IP addresses and you want to secure access to those resources from Azure-SSIS IR, you can associate [public IP addresses](../virtual-network/virtual-network-public-ip-address.md) with your Azure-SSIS IR while joining it to a virtual network and then add an IP firewall rule on the firewall of relevant resources to allow access from those IP addresses. There are two options to do this: 

- When creating Azure-SSIS IR, you can bring your own static public IP addresses and associate them with your Azure-SSIS IR via [ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md) or [Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md). Only the outbound internet connectivity from your Azure-SSIS IR will use these public IP addresses and other resources in the subnet won't use them.

- You can also configure a [virtual network network address translation (NAT)](../virtual-network/nat-gateway/nat-overview.md) in the subnet that your Azure-SSIS IR joins and all outbound internet connectivity from this subnet will use a specified public IP address.

In all cases, the virtual network can only be deployed through Azure Resource Manager deployment model.

## Next steps

- [Configure a virtual network to inject Azure-SSIS IR](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md)
- [Standard virtual network injection method](azure-ssis-integration-runtime-standard-virtual-network-injection.md)
- [Join Azure-SSIS IR to a virtual network via ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)
- [Join Azure-SSIS IR to a virtual network via Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
