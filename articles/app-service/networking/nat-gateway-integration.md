---
title: Azure NAT Gateway integration - Azure App Service | Microsoft Learn
description: Learn how Azure NAT Gateway integrates with Azure App Service.
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

Azure NAT Gateway is a fully managed, highly resilient service that can be associated with one or more subnets. It ensures that all outbound internet-facing traffic is routed through a network address translation (NAT) gateway. With Azure App Service, there are two important scenarios where you can use a NAT gateway.

The NAT gateway gives you a static, predictable public IP address for outbound internet-facing traffic. It also significantly increases the available [source network address translation (SNAT) ports](../troubleshoot-intermittent-outbound-connection-errors.md) in scenarios where you have a high number of concurrent connections to the same public address/port combination.

:::image type="content" source="./media/nat-gateway-integration/nat-gateway-overview.png" alt-text="Diagram that shows internet traffic flowing to a NAT gateway in an Azure virtual network.":::

Here are important considerations about Azure NAT Gateway integration:

* Using a NAT gateway with App Service is dependent on virtual network integration, so it requires a supported pricing tier in an App Service plan.
* When you're using a NAT gateway together with App Service, all traffic to Azure Storage must use private endpoints or service endpoints.
* You can't use a NAT gateway together with App Service Environment v1 or v2.

For more information and pricing, see the [Azure NAT Gateway overview](../../virtual-network/nat-gateway/nat-overview.md).

## Configure NAT gateway integration

To configure NAT gateway integration with App Service, first complete the following tasks:

* Configure regional virtual network integration with your app, as described in [Integrate your app with an Azure virtual network](../overview-vnet-integration.md).
* Ensure that [Route All](../overview-vnet-integration.md#routes) is enabled for your virtual network integration, so routes in your virtual network affect the internet-bound traffic.
* Provision a NAT gateway with a public IP address and associate it with the subnet for virtual network integration.

Then, set up Azure NAT Gateway through the Azure portal:

1. In the Azure portal, go to **App Service** > **Networking**. In the **Outbound Traffic** section, select **Virtual network integration**. Ensure that your app is integrated with a subnet and that **Route All** is enabled.

   :::image type="content" source="./media/nat-gateway-integration/nat-gateway-route-all-enabled.png" alt-text="Screenshot of the Route All option enabled for virtual network integration.":::
1. On the Azure portal menu or from the home page, select **Create a resource**. The **New** window appears.
1. Search for **NAT gateway** and select it from the list of results.
1. Fill in the **Basics** information and choose the region where your app is located.

   :::image type="content" source="./media/nat-gateway-integration/nat-gateway-create-basics.png" alt-text="Screenshot of the Basics tab on the page for creating a NAT gateway.":::
1. On the **Outbound IP** tab, create a public IP address or select an existing one.

   :::image type="content" source="./media/nat-gateway-integration/nat-gateway-create-outbound-ip.png" alt-text="Screenshot of the Outbound IP tab on the page for creating a NAT gateway.":::
1. On the **Subnet** tab, select the subnet that you use for virtual network integration.

   :::image type="content" source="./media/nat-gateway-integration/nat-gateway-create-subnet.png" alt-text="Screenshot of the Subnet tab on the page for creating a NAT gateway.":::
1. Fill in tags if needed, and then select **Create**. After the NAT gateway is provisioned, select **Go to resource group**, and then select the new NAT gateway. The **Outbound IP** pane shows the public IP address that your app will use for outbound internet-facing traffic.

   :::image type="content" source="./media/nat-gateway-integration/nat-gateway-public-ip.png" alt-text="Screenshot of the Outbound IP pane for a NAT gateway in the Azure portal.":::

If you prefer to use the Azure CLI to configure your environment, these are the important commands. As a prerequisite, create an app with virtual network integration configured.

1. Ensure that **Route All** is configured for your virtual network integration:

   ```azurecli-interactive
   az webapp config set --resource-group [myResourceGroup] --name [myWebApp] --vnet-route-all-enabled
   ```

1. Create a public IP address and a NAT gateway:

   ```azurecli-interactive
   az network public-ip create --resource-group [myResourceGroup] --name myPublicIP --sku standard --allocation static

   az network nat gateway create --resource-group [myResourceGroup] --name myNATgateway --public-ip-addresses myPublicIP --idle-timeout 10
   ```

1. Associate the NAT gateway with the subnet for virtual network integration:

   ```azurecli-interactive
   az network vnet subnet update --resource-group [myResourceGroup] --vnet-name [myVnet] --name [myIntegrationSubnet] --nat-gateway myNATgateway
   ```

## Scale a NAT gateway

You can use the same NAT gateway across multiple subnets in the same virtual network. That approach allows you to use a NAT gateway across multiple apps and App Service plans.

Azure NAT Gateway supports both public IP addresses and public IP prefixes. A NAT gateway can support up to 16 IP addresses across individual IP addresses and prefixes. Each IP address allocates 64,512 ports (SNAT ports), which allows up to 1 million available ports. Learn more in [Azure NAT Gateway resource](../../virtual-network/nat-gateway/nat-gateway-resource.md#scalability).

## Next steps

For more information on Azure NAT Gateway, see the [Azure NAT Gateway documentation](../../virtual-network/nat-gateway/nat-overview.md).

For more information on virtual network integration, see the [documentation about virtual network integration](../overview-vnet-integration.md).
