---
title: Configure business continuity and disaster recovery (BCDR) on Azure Stack Edge virtual private network (VPN)
description: Describes how to configure BCDR on Azure Stack Edge VPN.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 04/17/2020
ms.author: alkohli
---

# Configure business continuity and disaster recovery for Azure Stack Edge VPN

[!INCLUDE [applies-to-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-pro-r-mini-r-sku.md)]

This article describes how to configure business continuity and disaster recovery (BCDR) on a virtual private network (VPN) configured on an Azure Stack Edge device.

This article applies to both Azure Stack Edge Pro R and Azure Stack Edge Mini R device.

## Configure failover to a paired region

Your Azure Stack Edge device uses other Azure services, for example Azure Storage. You can configure BCDR on any specific Azure service that is used by the Azure Stack Edge device. If an Azure service used by Azure Stack Edge fails over to its paired region, the Azure Stack Edge device will now connect to the new IP addresses and the communication will not be doubly encrypted. 

The Azure Stack Edge device uses split tunneling and all the data and services that are configured in the home region (the region associated with your Azure Stack Edge device) go over the VPN tunnel. If the Azure services fail over to a paired region which is outside of the home region, then the data will no longer go over VPN and hence is not doubly encrypted. 

In this scenario, typically only a handful of Azure services are impacted. To address this issue, the following changes should be made in the Azure Stack Edge VPN configuration:

1. Add the failover Azure service IP range(s) in the inclusive routes for VPN on Azure Stack Edge. The services will then start getting routed through the VPN.

    To add the inclusive routes, you need to download the json file  that has the service specific routes. Make sure to update this file with the new routes.
2. Add the corresponding Azure service IP range(s) in Azure Route table.
3. Add the routes to the firewall.

> [!NOTE]
>
> 1. The failover of an Azure VPN gateway and Azure Virtual Network (VNET) is addressed in section [Recover from an Azure region that failed due to disaster](#recover-from-a-failed-azure-region).
> 2. IP ranges added in the Azure route table could cross the limit of 400. If this occurs, you will need to follow the guidance in section, [Move from one Azure region to another Azure region](#move-from-an-azure-region-to-another).

## Recover from a failed Azure region

In the event that the entire Azure region fails over due to a catastrophic event such as earthquake, all the Azure services in that region including the Azure Stack Edge service will fail over. Since there are multiple services, the inclusive routes could easily range into a few hundreds. Azure has a limitation of 400 routes. 

When the region fails over, the virtual network (Vnet) also fails over to the new region and so does the Virtual network gateway (VPN gateway). To address this change, make the following changes in your Azure Stack Edge VPN configuration:

1. Move your Vnet to the target region. For more information, see: [Move an Azure virtual network to another region via the Azure portal](../virtual-network/move-across-regions-vnet-portal.md).
2. Deploy a new Azure VPN gateway in the target region where you moved the Vnet. For more information, see [Create a virtual network gateway](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#creategw).
3. Update Azure Stack Edge VPN configuration to use the above VPN gateway in the VPN connection and then select the target region to add routes that use the VPN gateway.
4. Update the incoming Azure route table if the client address pool also changes. 

## Move from an Azure region to another

You can move your Azure Stack Edge device from one location to another location. To use a region closest to where your device is deployed, you will need to configure the device for a new home region. Make the following changes:

1. You can update Azure Stack Edge VPN configuration to use a new region's VPN gateway and select the new region to add routes that use VPN gateway.

## Next steps

[Back up your Azure Stack Edge device](azure-stack-edge-gpu-prepare-device-failure.md).