---
title: 'App Service outbound traffic control with Azure Firewall'
description: Outbound traffic from App Service to internet, private IP addresses, and Azure services are routed through Azure Firewall. Learn how to control App Service outbound traffic by using Virtual Network integration and Azure Firewall. 
author: cephalin
ms.author: cephalin
ms.topic: article
ms.date: 01/13/2022
---

# Control outbound traffic with Azure Firewall

This article shows you how to lock down the outbound traffic from your App Service app to back-end Azure resources or other network resources with [Azure Firewall](../firewall/overview.md). This configuration helps prevent data exfiltration or the risk of malicious program implantation.

By default, an App Service app can make outbound requests to the public internet (for example, when installing required Node.js packages from NPM.org.). If your app is [integrated with an Azure virtual network](overview-vnet-integration.md), you can control outbound traffic with [network security groups](../virtual-network/network-security-groups-overview.md) to a limited extent, such as the target IP address, port, and protocol. Azure Firewall lets you control outbound traffic at a much more granular level and filter traffic based on real-time threat intelligence from Microsoft Cyber Security. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks (see [Azure Firewall features](../firewall/features.md)).

For detailed network concepts and security enhancements in App Service, see [Networking features](networking-features.md) and [Zero to Hero with App Service, Part 6: Securing your web app](https://azure.github.io/AppService/2020/08/14/zero_to_hero_pt6.html).

## Prerequisites

* [Enable regional virtual network integration](configure-vnet-integration-enable.md) for your app.
* [Verify that **Route All** is enabled](configure-vnet-integration-routing.md). This setting is enabled by default, which tells App Service to route all outbound traffic through the integrated virtual network. If you disable it, only traffic to private IP addresses will be routed through the virtual network.
* If you want to route access to back-end Azure services through Azure Firewall as well, [disable all service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) on the App Service subnet in the integrated virtual network. After Azure Firewall is configured, outbound traffic to Azure Services will be routed through the firewall instead of the service endpoints.

## 1. Create the required firewall subnet

To deploy a firewall into the integrated virtual network, you need a subnet called **AzureFirewallSubnet**.

1. In the [Azure portal](https://portal.azure.com), navigate to the virtual network that's integrated with your app.
1. From the left navigation, select **Subnets** > **+ Subnet**.
1. In **Name**, type **AzureFirewallSubnet**.
1. **Subnet address range**, accept the default or specify a range that's [at least /26 in size](../firewall/firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).
1. Select **Save**.

## 2. Deploy the firewall and get its IP

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, select **Create a resource**.
1. Type *firewall* in the search box and press **Enter**.
1. Select **Firewall** and then select **Create**.
1. On the **Create a Firewall** page, configure the firewall as shown in the following table:

    | Setting | Value |
    | - | - |
    | **Resource group** | Same resource group as the integrated virtual network. |
    | **Name** | Name of your choice |
    | **Region** | Same region as the integrated virtual network. |
    | **Firewall policy** | Create one by selecting **Add new**. |
    | **Virtual network** | Select the integrated virtual network. |
    | **Public IP address** | Select an existing address or create one by selecting **Add new**. |

    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/create-azfw.png" alt-text="Screenshot of creating an Azure Firewall in the Azure portal.":::

1. Click **Review + create**.
1. Select **Create** again. 

    This will take a few minutes to deploy.

1. After deployment completes, go to your resource group, and select the firewall.
1. In the firewall's **Overview** page, copy private IP address. The private IP address will be used as next hop address in the routing rule for the virtual network.
    
    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/firewall-private-ip.png" alt-text="Screenshot of get Azure Firewall private IP address.":::

## 3. Route all traffic to the firewall

When you create a virtual network, Azure automatically creates a [default route table](../virtual-network/virtual-networks-udr-overview.md#default) for each of its subnets and adds system default routes to the table. In this step, you create a user-defined route table that routes all traffic to the firewall, and then associate it with the App Service subnet in the integrated virtual network.

1. On the [Azure portal](https://portal.azure.com) menu, select **All services** or search for and select **All services** from any page.
1. Under **Networking**, select **Route tables**.
1. Select **Add**.
1. Configure the route table like the following example:

    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/create-route-table.png" alt-text="Screenshot of creating a routing route table in Azure portal.":::

    Make sure you select the same region as the firewall you created.

1. Select **Review + create**.
1. Select **Create**.
1. After deployment completes, select **Go to resource**.
1. From the left navigation, select **Routes** > **Add**.
1. Configure the new route as shown in the following table:

    | Setting | Value |
    | - | - |
    | **Address prefix** | *0.0.0.0/0* |
    | **Next hop type** | **Virtual appliance** |
    | **Next hop address** | The private IP address for the firewall that you copied in [2. Deploy the firewall and get its IP](#2-deploy-the-firewall-and-get-its-ip). |

1. From the left navigation, select **Subnets** > **Associate**.
1. In **Virtual network**, select your integrated virtual network.
1. In **Subnet**, select the App Service subnet.

    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/associate-route-table.png" alt-text="Screenshot of associate the route table to the App Service subnet.":::

1. Select **OK**.

## 4. Configure firewall policies

Outbound traffic from your app is now routed through the integrated virtual network to the firewall. To control App Service outbound traffic, add an application rule to firewall policy.

1. Navigate to the firewall's overview page and select its firewall policy.

1. In the firewall policy page, from the left navigation, select **Application Rules** > **Add a rule collection**.
1. In **Rules**, add a network rule with the App Service subnet as the source address, and specify an FQDN destination. In the screenshot below, the destination FQDN is set to `api.my-ip.io`.

    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/config-azfw-policy-app-rule.png" alt-text="Screenshot of configure Azure Firewall policy rule.":::

    > [!NOTE]
    > Instead of specifying the App Service subnet as the source address, you can also use the private IP address of the app in the subnet directly. You can find your app's private IP address in the subnet by using the [`WEBSITE_PRIVATE_IP` environment variable](reference-app-settings.md#networking).

1. Select **Add**.

## 5. Verify the outbound traffic

An easy way to verify your configuration is to use the `curl` command from your app's SCM debug console to verify the outbound connection.

1. In a browser, navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole`.
1. In the console, run `curl -s <protocol>://<fqdn-address>` with a URL that matches the application rule you configured, To continue example in the previous screenshot, you can use **curl -s https://api.my-ip.io/ip**. The following screenshot shows a successful response from the API, showing the public IP address of your App Service app.

    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/verify-outbound-traffic-fw-allow-rule.png" alt-text="Screenshot of verifying the success outbound traffic by using curl command in SCM debug console.":::

1. Run `curl -s <protocol>://<fqdn-address>` again with a URL that doesn't match the application rule you configured. In the following screenshot, you get no response, which indicates that your firewall has blocked the outbound request from the app.

    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/verify-outbound-traffic-fw-no-rule.png" alt-text="Screenshot of sending outbound traffic by using curl command in SCM debug console.":::

> [!TIP]
> Because these outbound requests are going through the firewall, you can capture them in the firewall logs by [enabling diagnostic logging for the firewall](../firewall/firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal) (enable the **AzureFirewallApplicationRule**).
>
> If you run the `curl` commands with diagnostic logs enabled, you can find them in the firewall logs.
>
> 1. In the Azure portal, navigate to your firewall.
> 1. From the left navigation, select **Logs**.
> 1. Close the welcome message by selecting **X**.
> 1. From All Queries, select **Firewall Logs** > **Application rule log data**. 
> 1. Click **Run**. You can see these two access logs in query result.
>
>    :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/azfw-application-log-min.png" alt-text="Screenshot of SCM debug console to verify the failed outbound traffic by using curl command." lightbox="./media/network-secure-outbound-traffic-azure-firewall/azfw-application-log.png":::

## More resources

[Monitor Azure Firewall logs and metrics](../firewall/firewall-diagnostics.md). 
