---
title: NAT gateway integration - Azure App Service | Microsoft Docs
description: Describes how NAT gateway integrates with Azure App Service.
services: app-service
author: madsd

ms.assetid: 0a84734e-b5c1-4264-8d1f-77e781b28426
ms.service: app-service
ms.workload: web
ms.topic: article
ms.date: 08/01/2021
ms.author: madsd
ms.custom: seodec18

---

# Virtual Network NAT gateway integration

NAT gateway is a fully managed, highly resilient service, which can be associated with one or more subnets and ensures that all outbound Internet facing traffic will be routed through the gateway. With App Service, there are two important scenarios that you can use NAT gateway for. The NAT gateway gives you a static predictable IP for outbound traffic as it is associated with one or more customer owned Public IPs.
It also significantly increases the available [SNAT ports](/azure/app-service/troubleshoot-intermittent-outbound-connection-errors) in scenarios where you have a high number of concurrent connections to the same public address/port combination.

For more information and pricing. Go to the [NAT gateway overview](/azure/virtual-network/nat-gateway/nat-overview).

:::image type="content" source="./media/nat-gateway-integration/nat-gateway-overview.png" alt-text="Diagram shows internet traffic flowing to a NAT gateway in an Azure Virtual Network.":::

> [!Note] 
> Using NAT gateway with App Service is dependent on regional VNet integration, and therefore require a **Standard** or **Premium** App Service plan.

## Configuring NAT gateway integration

For a walk-through of configuring NAT gateway through the portal, you can follow [this tutorial](/azure/azure-functions/functions-how-to-use-nat-gateway) for Azure Functions. Make sure [Route All](/azure/app-service/web-sites-integrate-with-vnet#routes) is enabled in your application routing settings. Enabling Route All will ensure all public traffic is routed through the VNet integration.

If you prefer using CLI to configure your environment, these are the important commands. As a prerequisite, you should create a Web App with VNet integration configured.

Create Public IP and NAT gateway:

```azurecli-interactive
az network public-ip create --resource-group [myResourceGroup] --name myPublicIP --sku standard --allocation static

az network nat gateway create --resource-group [myResourceGroup] --name myNATgateway --public-ip-addresses myPublicIP --idle-timeout 10
```

Associate the NAT gateway with the VNet integration subnet:

```azurecli-interactive
az network vnet subnet update --resource-group [myResourceGroup] --vnet-name [myVnet] --name [myIntegrationSubnet] --nat-gateway myNATgateway
```

## Next steps
For more information on the NAT gateway, see [NAT gateway documentation](/azure/virtual-network/nat-gateway/nat-overview).

For more information on VNet integration, see [VNet integration documentation](/azure/app-service/web-sites-integrate-with-vnet).
