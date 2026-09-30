---
title: Configure Azure NAT Gateway Integration
description: Configure Azure NAT Gateway integration with Azure App Service and Azure Virtual Network by following steps for the Azure portal or by using the Azure CLI.
services: app-service
author: seligj95
ms.assetid: 0a84734e-b5c1-4264-8d1f-77e781b28426
ms.service: azure-app-service
ms.topic: how-to
ms.date: 03/26/2026
ms.author: jordanselig
ms.devlang: azurecli
ms.custom:
  - devx-track-azurecli
  - sfi-image-nochange
#customer intent: As an App Service developer, I want to configure Azure NAT Gateway integration with Azure App Service, so I can route outbound internet-facing traffic for my app through an Azure virtual network.
---

# Configure Azure NAT Gateway integration

Azure NAT Gateway is a fully managed, highly resilient service that ensures all outbound internet-facing traffic routes through a network address translation (NAT) gateway within Azure Virtual Network. You can associate your NAT gateway with one or more subnets in your Azure virtual network and provide robust support for your App Service application.

There are two important scenarios for using Azure NAT Gateway with App Service:

- A NAT gateway gives you a static, predictable public IP address for outbound internet-facing traffic to your app within the virtual network.
- A NAT gateway significantly increases the available source network address translation (SNAT) ports in scenarios where you have a high number of concurrent connections to the same public address/port combination. For more information, see [Troubleshoot intermittent outbound connection errors in Azure App Service](./troubleshoot-intermittent-outbound-connection-errors.md).

The following diagram shows internet traffic from an app flowing to a NAT gateway in an Azure virtual network:

:::image type="content" source="./media/overview-nat-gateway-integration/nat-gateway-overview.png" border="false" alt-text="Diagram that shows internet traffic from an app flowing to a NAT gateway in a virtual network.":::

This article describes how to configure Azure NAT Gateway integration with Azure App Service and Azure Virtual Network. Follow steps in the Azure portal or use the Azure CLI.

## Prerequisites

- An App Service app with regional virtual network integration. You can follow the steps in [Prepare app with virtual network integration](#prepare-app-with-virtual-network-integration) in this article.

- The virtual network integration must route all internet-bound traffic (application and configuration). For more information, see [Integrate your app with an Azure virtual network > Routes](./overview-vnet-integration.md#routes).

### Important considerations for integration

Review the following important considerations about Azure NAT Gateway integration:

- Whether you can use a NAT gateway with App Service is dependent on virtual network integration. You must have a supported pricing tier in an App Service plan.

- When you use a NAT gateway together with App Service, all traffic to Azure Storage must use private endpoints or service endpoints.

- Azure NAT Gateway is supported for App Service Environment v3 only.

## Prepare app with virtual network integration

Confirm your app is integrated with a virtual network and subnet, as described in [Integrate your app with an Azure virtual network](./overview-vnet-integration.md). Verify the network integration is enabled to route all application and configuration traffic.

# [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your app, and select **Settings** > **Networking**.
   
1. In the **Outbound traffic configuration** section, confirm the **Virtual network integration** option is set to the desired virtual network and subnet for the integration:

   :::image type="content" source="./media/overview-nat-gateway-integration/confirm-outbound-traffic.png" border="false" alt-text="Screenshot that shows virtual network integration enabled for the app in the Azure portal.":::

   The **Virtual network integration** option value is a link to the integrated network.
   
   To view the details for the integrated network, select the link:

   :::image type="content" source="./media/overview-nat-gateway-integration/view-network-integration-details.png" alt-text="Screenshot that shows how to select the virtual network and subnet link in the Azure portal.":::  

1. (As needed) If the **Virtual network integration** option isn't set, select the **Not configured** link:

   :::image type="content" source="./media/overview-nat-gateway-integration/configure-outbound-traffic.png" alt-text="Screenshot that shows how to configure virtual network integration for an app in the Azure portal.":::      

   1. In the **Virtual Network Integration** page, select **Add virtual network integration**:

      :::image type="content" source="./media/overview-nat-gateway-integration/add-virtual-network-integration.png" alt-text="Screenshot that shows how to select the 'Add virtual network integration' option in the Azure portal.":::  

   1. In the **Add virtual network integration** pane, select your **Subscription**, **Virtual Network**, and **Subnet**.

   1. Select **Connect**.

   The page refreshes to show the integration details for the new network connection.

1. In the details view for the virtual network integration, confirm all traffic routes are enabled (each checkbox is selected):

   - In the **Application routing** section, enable the **Outbound internet traffic** option.

   - In the **Configuration routing** section, enable the **Container image pull**, **Content storage**, and **Backup/restore** options.

   If you make changes, select **Apply**.

   :::image type="content" source="./media/overview-nat-gateway-integration/enable-all-traffic-routes.png" alt-text="Screenshot that shows how to ensure all traffic routes are enabled for the integration in the Azure portal."::: 

For detailed steps, see [Configure application routing](./configure-vnet-integration-routing.md#configure-application-routing).

# [Azure CLI](#tab/azure-cli)

In the following commands, replace the `<placeholder>` parameter values with the information for your app and configuration.

1. Prepare an App Service app, virtual network, and subnet.

1. Enable virtual network integration for the app:

   ```azurecli-interactive
   az webapp vnet-integration add --resource-group <resource-group-name> --name <app-name> --vnet <virtual-network-name> --subnet <subnet-name>
   ```

1. Ensure the virtual network integration enables all route traffic with the `vnet-route-all-enabled` flag:

   ```azurecli-interactive
   az webapp config set --resource-group <resource-group-name> --name <app-name> --vnet-route-all-enabled
   ```

---

## Create and configure an Azure NAT gateway

Create the NAT gateway with a public IP address and associate it with the subnet for virtual network integration.

Review the available [Azure NAT Gateway SKUs](/azure/nat-gateway/nat-sku) and select the best plan for your configuration.

# [Azure portal](#tab/azure-portal)

1. In the Azure portal **Home** page, select **+ Create a resource**.

1. In the **Create a resource** page, search for **NAT gateway**.
   
1. Locate the **NAT gateway** card for the Azure Service, and select **Create** > **NAT gateway**.

1. In the **Create network address translation (NAT) gateway** pane, configure the settings on the **Basics** tab:

   - Select the **Subscription** to use for the new gateway.
   - Select an existing **Resource group** for the new gateway, or create a new one.
   - Enter a unique **NAT gateway name**.
   - Select the **Region** where your app is located.
   - Select the **SKU** for the NAT gateway resource. To use IPv4 IP addresses, select **Standard**. To use IPv4 or IPv6 IP addresses, select **Standard V2**.
   - Enter the **TCP idle timeout** value. The allowable range is 4 to 120 minutes.

   :::image type="content" source="./media/overview-nat-gateway-integration/nat-gateway-create-basics.png" alt-text="Screenshot of the Basics tab for creating a NAT gateway in the Azure portal.":::

1. On the **Outbound IP** tab, select the public IP address to use for the gateway connection.

   Select the checkbox for an existing address in the **Public IP address** or **Public IP prefix** list.
   
   :::image type="content" source="./media/overview-nat-gateway-integration/nat-gateway-create-outbound-ip.png" alt-text="Screenshot of the Outbound IP tab for creating a NAT gateway in the Azure portal.":::

   You can also create a new IP address or IP prefix for the connection:

   1. Select the **+ Add public IP addresses or prefixes** link.

   1. In the **Manage public IP addresses and prefixes** pane, select the **Create a public IP address** link.

      1. In the **Add a public IP address** dialog, enter a unique **Name** for the IP address.
      
      1. Select the **IP version**.
      
      1. Select **OK**.

      :::image type="content" source="./media/overview-nat-gateway-integration/create-ip-address.png" alt-text="Screenshot that shows how to create a new public IP address in the Azure portal.":::

   1. Select the **Create a new public IP prefix** link.

      1. In the **Add a public IP prefix** dialog, enter a unique **Name** for the IP prefix.
      
      1. Select the **IP version** and choose the **Prefix size**.
      
      1. Select **OK**.

      :::image type="content" source="./media/overview-nat-gateway-integration/create-ip-prefix.png" alt-text="Screenshot that shows how to create a new public IP prefix in the Azure portal.":::

   1. In the **Manage public IP addresses and prefixes** pane, select **Save**.

1. On the **Networking** tab, select the **Virtual network** for virtual network integration, and then select the **Specific subnets** within the selected virtual network:

   :::image type="content" source="./media/overview-nat-gateway-integration/nat-gateway-create-networking.png" alt-text="Screenshot of the Networking tab for creating a NAT gateway in the Azure portal.":::

1. Select **Review + Create**, and then select **Create**.

1. When the NAT gateway is ready, select **Go to resource group**. 

1. In the **Overview** page for your new NAT gateway, select **Settings** > **Outbound IP**.

   The page shows the public IP address that your app uses for outbound internet-facing traffic.

   :::image type="content" source="./media/overview-nat-gateway-integration/nat-gateway-outbound-addresses.png" alt-text="Screenshot of the Outbound IP pane for a NAT gateway in the Azure portal.":::

# [Azure CLI](#tab/azure-cli)

In the following commands, replace the `<placeholder>` parameter values with the information for your app and configuration.

1. Create a public IP address for the connection:

   ```azurecli-interactive
   az network public-ip create --resource-group <resource-group-name> --name <public-ip-address-name> --sku standard --allocation static
   ```

1. Create a NAT gateway:

   ```azurecli-interactive
   az network nat gateway create --resource-group <resource-group-name> --name <nat-gateway-name> --public-ip-addresses <public-ip-address-name> --idle-timeout 10
   ```

1. Associate the NAT gateway with the subnet for virtual network integration:

   ```azurecli-interactive
   az network vnet subnet update --resource-group <resource-group-name> --vnet-name <virtual-network-name> --name <integration-subnet-name> --nat-gateway <nat-gateway-name>
   ```

---

## Scale your NAT gateway

You can use the same NAT gateway across multiple subnets in the same virtual network. This approach enables you to use a NAT gateway across multiple apps and App Service plans.

Azure NAT Gateway supports both public IP addresses and public IP prefixes. A NAT gateway can support up to 16 IP addresses across individual IP addresses and prefixes. Each IP address allocates 64,512 ports (SNAT ports), which allow up to 1 million available ports. For more information, see [Azure NAT Gateway resource](/azure/nat-gateway/nat-gateway-resource).

## Related content

- [Azure NAT Gateway documentation](/azure/nat-gateway/)
- [Integrate your app with an Azure virtual network](./overview-vnet-integration.md).
