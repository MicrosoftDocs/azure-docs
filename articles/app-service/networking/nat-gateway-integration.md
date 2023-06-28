---
title: Azure NAT Gateway integration - Azure App Service | Microsoft Docs
description: Describes how NAT gateway integrates with Azure App Service.
services: app-service
author: madsd

ms.assetid: 0a84734e-b5c1-4264-8d1f-77e781b28426
ms.service: app-service
ms.workload: web
ms.topic: article
ms.date: 04/08/2022
ms.author: madsd
ms.custom: seodec18, devx-track-azurecli 
ms.devlang: azurecli

---

# Azure NAT Gateway integration

Azure NAT gateway is a fully managed, highly resilient service, which can be associated with one or more subnets and ensures that all outbound Internet-facing traffic will be routed through the gateway. With App Service, there are two important scenarios that you can use NAT gateway for. 

The NAT gateway gives you a static predictable public IP for outbound Internet-facing traffic. It also significantly increases the available [SNAT ports](../troubleshoot-intermittent-outbound-connection-errors.md) in scenarios where you have a high number of concurrent connections to the same public address/port combination.

For more information and pricing. Go to the [Azure NAT Gateway overview](../../virtual-network/nat-gateway/nat-overview.md).

:::image type="content" source="./media/nat-gateway-integration/nat-gateway-overview.png" alt-text="Diagram shows Internet traffic flowing to a NAT gateway in an Azure Virtual Network.":::

> [!Note] 
> * Using a NAT gateway with App Service is dependent on virtual network integration, and therefore a supported App Service plan pricing tier is required.
> * When using a NAT gateway together with App Service, all traffic to Azure Storage must be using private endpoint or service endpoint.
> * A NAT gateway cannot be used together with App Service Environment v1 or v2.

## Configuring NAT gateway integration

To configure NAT gateway integration with App Service, you need to complete the following steps:

* Configure regional virtual network integration with your app as described in [Integrate your app with an Azure virtual network](../overview-vnet-integration.md)
* Ensure [Route All](../overview-vnet-integration.md#routes) is enabled for your virtual network integration so the Internet bound traffic will be affected by routes in your virtual network.
* Provision a NAT gateway with a public IP and associate it with the virtual network integration subnet.

Set up Azure NAT Gateway through the portal:

1. Go to the **Networking** UI in the App Service portal and select virtual network integration in the Outbound Traffic section. Ensure that your app is integrated with a subnet and **Route All** has been enabled.
:::image type="content" source="./media/nat-gateway-integration/nat-gateway-route-all-enabled.png" alt-text="Screenshot of Route All enabled for virtual network integration.":::
1. On the Azure portal menu or from the **Home** page, select **Create a resource**. The **New** window appears.
1. Search for "NAT gateway" and select it from the list of results.
1. Fill in the **Basics** information and pick the region where your app is located.
:::image type="content" source="./media/nat-gateway-integration/nat-gateway-create-basics.png" alt-text="Screenshot of Basics tab in Create NAT gateway.":::
1. In the **Outbound IP** tab, create a new or select an existing public IP.
:::image type="content" source="./media/nat-gateway-integration/nat-gateway-create-outbound-ip.png" alt-text="Screenshot of Outbound IP tab in Create NAT gateway.":::
1. In the **Subnet** tab, select the subnet used for virtual network integration.
:::image type="content" source="./media/nat-gateway-integration/nat-gateway-create-subnet.png" alt-text="Screenshot of Subnet tab in Create NAT gateway.":::
1. Fill in tags if needed and **Create** the NAT gateway. After the NAT gateway is provisioned, click on the **Go to resource group** and select the new NAT gateway. You can see the public IP that your app will use for outbound Internet-facing traffic in the Outbound IP blade.
:::image type="content" source="./media/nat-gateway-integration/nat-gateway-public-ip.png" alt-text="Screenshot of Outbound IP blade in the NAT gateway portal."::: 

If you prefer using CLI to configure your environment, these are the important commands. As a prerequisite, you should create an app with virtual network integration configured.

Ensure **Route All** is configured for your virtual network integration:

```azurecli-interactive
az webapp config set --resource-group [myResourceGroup] --name [myWebApp] --vnet-route-all-enabled
```

Create Public IP and NAT gateway:

```azurecli-interactive
az network public-ip create --resource-group [myResourceGroup] --name myPublicIP --sku standard --allocation static

az network nat gateway create --resource-group [myResourceGroup] --name myNATgateway --public-ip-addresses myPublicIP --idle-timeout 10
```

Associate the NAT gateway with the virtual network integration subnet:

```azurecli-interactive
az network vnet subnet update --resource-group [myResourceGroup] --vnet-name [myVnet] --name [myIntegrationSubnet] --nat-gateway myNATgateway
```

## Scaling a NAT gateway

The same NAT gateway can be used across multiple subnets in the same virtual network allowing a NAT gateway to be used across multiple apps and App Service plans.

Azure NAT Gateway supports both public IP addresses and public IP prefixes. A NAT gateway can support up to 16 IP addresses across individual IP addresses and prefixes. Each IP address allocates 64,512 ports (SNAT ports) allowing up to 1M available ports. Learn more in the [Scaling section](../../virtual-network/nat-gateway/nat-gateway-resource.md#scalability) of Azure NAT Gateway.

## Next steps

For more information on Azure NAT Gateway, see [Azure NAT Gateway documentation](../../virtual-network/nat-gateway/nat-overview.md).

For more information on virtual network integration, see [Virtual network integration documentation](../overview-vnet-integration.md).
