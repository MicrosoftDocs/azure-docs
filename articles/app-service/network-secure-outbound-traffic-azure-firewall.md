---
title: 'Control App Service outbound traffic using Azure Firewall'
description: Learn how to control App Service outbound traffic to internet, private IP addresses, and Azure services by using virtual network integration and Azure Firewall.
author: cephalin
ms.author: cephalin
ms.topic: how-to
ms.date: 07/22/2025
ms.service: azure-app-service
ms.custom: sfi-image-nochange

# Customer intent: As a deployment engineer, I want to control outbound App Service traffic by using Azure Firewall so that I can reduce the risk of data exfiltration and malicious program implantation.   
  
---

# Control outbound traffic with Azure Firewall

This article shows you how to lock down the outbound traffic from your Azure App Service app to back-end Azure resources or other network resources by using [Azure Firewall](/azure/firewall/overview). This configuration helps to prevent data exfiltration and protect your app from malicious program implantation.

By default, an App Service app can make outbound requests to the public internet, for example when installing required Node.js packages from NPM.org. If your app is [integrated with an Azure virtual network](overview-vnet-integration.md), you can use [network security groups](/azure/virtual-network/network-security-groups-overview) to control the target IP addresses, ports, and protocols of outbound traffic.

Azure Firewall can control outbound traffic at a more granular level and lets you filter traffic based on real-time threat intelligence from Microsoft cybersecurity. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. For more information, see [Azure Firewall features](/azure/firewall/features).

Work through the following procedures to set up, deploy, and use Azure Firewall to control outbound traffic from your App Service app. For more information about App Service network concepts and security enhancements, see [Networking features](networking-features.md) and [Zero to Hero with App Service, Part 6: Securing your web app](https://azure.github.io/AppService/2020/08/14/zero_to_hero_pt6.html).

## Prerequisites

Have an App Service app that uses regional virtual network integration. For more information, see [Enable virtual network integration in Azure App Service](configure-vnet-integration-enable.md).

- In the virtual network integration setup, verify that [route all](configure-vnet-integration-routing.md#configure-application-routing) is enabled, which is the default.
- In your app, disable any routing through [service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview), because all outbound traffic is going to route through the firewall.

## 1. Create the required firewall subnets

To deploy a firewall into the integrated virtual network, the virtual network must have a subnet called **AzureFirewallSubnet**. Also, forced tunneling is required by default, so the network must also have a subnet called **AzureFirewallManagementSubnet**. For more information, see [Azure Firewall forced tunneling](/azure/firewall/forced-tunneling).

1. In the [Azure portal](https://portal.azure.com), navigate to the virtual network integrated with your app.
1. On the page for your app's integrated virtual network, select **Subnets** from the left navigation menu.
1. On the **Subnets** page, select **+ Subnet**.
1. On the **Add a subnet** page, for **Subnet purpose**, select **Azure Firewall**.

   The name **AzureFirewallSubnet** and other settings are automatically assigned. Under **IPv4**, make sure the specified range is [at least /26 in size](/azure/firewall/firewall-faq#why-does-azure-firewall-need-a--26-subnet-size).

1. Select **Add**.
1. Repeat the same procedure to add the **AzureFirewallManagementSubnet**, this time selecting **Firewall Management (forced tunneling)** as the **Subnet purpose**.

## 2. Deploy the firewall and get its IP address

1. From the virtual network **Overview** page, select **Firewall** from the left navigation menu.
1. Select **Click here to add a new firewall**.
1. On the **Create a Firewall** page, make sure the **Subscription**, **Resource group**, and **Region** are the same as for the virtual network.
1. For **Name**, provide a name for the firewall.
1. For **Firewall policy**, select **Add new** and provide a name for the policy.
1. For **Choose a virtual network**, select **Use existing** and then select your integrated virtual network.
1. For **Public IP address**, select an existing address or create one by selecting **Add new**.
1. Under **Firewall Management NIC**, select an existing address for **Management public IP address**, or create one by selecting **Add new**.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/create-azfw.png" alt-text="Screenshot of creating an Azure Firewall in the Azure portal.":::

1. Select **Review + create** at the top of the page, and when validation passes, select **Create**. The firewall takes a few minutes to deploy.
1. When deployment completes, select **Go to resource**.
1. On the firewall's **Overview** page, copy the **Private IP address**. You use the private IP address as the next hop address in the routing rule for the virtual network.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/firewall-private-ip.png" alt-text="Screenshot of get Azure Firewall private IP address.":::

## Route all traffic to the firewall

When you create a virtual network, Azure automatically creates a [default route table](/azure/virtual-network/virtual-networks-udr-overview#default) for each of its subnets and adds system default routes to the table. In this step, you create a user-defined route table that routes all traffic to the firewall. You associate the user-defined route table with the App Service subnet in the integrated virtual network.

1. On your app's page in the [Azure portal](https://portal.azure.com) select **Networking** from the left navigation menu.
1. On the **Networking** page, under **Integration subnet configuration** at lower right, select **Not configured** next to **User defined route**.
1. On the **Route tables** page, select **Create**
1. Make sure the subscription and resource group are correct, and select the same **Region** as your firewall.
1. Provide a name for the route table.
1. For **Propagate gateway routes**, select **No**.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/create-route-table.png" alt-text="Screenshot of creating a routing route table in Azure portal.":::

1. Select **Review + create**, and then select **Create**.
1. After deployment completes, select **Go to resource**, or go to your resource group and select the route table from the list of resources.
1. On the route table page, select **Routes** from the left navigation menu.
1. On the **Routes** page, select **Add**, and fill out the **Add route** screen as follows:

   - **Route name**: Provide a name for the route.
   - **Destination type**: Select **IP Addresses**.
   - **Destination IP addresses/CIDR ranges**: Enter *0.0.0.0/0*.
   - **Next hop type**: Select **Virtual appliance**.
   - **Next hop address**: Enter the private IP address for the firewall that you copied previously.
1. Select **Add**.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/azfw-application-log-min.png" alt-text="Screenshot of adding a route to the route table.":::

1. On the route table page, select **Subnets** from the left navigation menu.
1. On the **Subnets** page, select **Associate**.
1. On the **Associate subnet** screen, make sure your app's integrated virtual network and subnet are selected, or select them, and then select **OK**.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/associate-route-table.png" alt-text="Screenshot of associate the route table to the App Service subnet.":::

Outbound traffic from your app is now routed through the integrated virtual network to the firewall.

## Configure firewall policies

To control App Service outbound traffic, add an application rule to firewall policy.

1. On your firewall's **Overview** page, select its firewall policy under **Firewall policy**.
1. On the firewall policy page, select **Application rules** from the left navigation menu.
1. On the **Application rules** page, select **Add a rule collection**.
1. On the **Add a rule collection** screen, enter a **Name** and a **Priority** between 100 and 65000.
1. Under **Rules**, add a network rule with the App Service subnet as the source address, and specify a fully qualified domain name (FQDN) destination. The following example shows a destination FQDN of **api.my-ip.io**.

1. Select **Add**.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/config-azfw-policy-app-rule.png" alt-text="Screenshot of configure Azure Firewall policy rule." lightbox="./media/network-secure-outbound-traffic-azure-firewall/config-azfw-policy-app-rule.png":::

   > [!NOTE]
   > Instead of specifying the App Service subnet as the source address, you can use the private IP address of the app directly. You can find your app's private IP address in the subnet by using the [`WEBSITE_PRIVATE_IP` environment variable](reference-app-settings.md#networking).

## Verify the outbound traffic

An easy way to verify the outbound connection of your configuration is to use the `curl` command from your app's Source Control Manager (SCM), also called Kudu, debug console.

1. In a browser, navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole`.
1. In the console, run `curl -s <protocol>://<fqdn-address>` with a URL that matches the application rule you configured. For example, the following screenshot shows a successful response to `https://api.my-ip.io`.

   :::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/verify-outbound-traffic-fw-allow-rule.png" alt-text="Screenshot of verifying the success outbound traffic by using curl command in SCM debug console.":::

If you run `curl -s <protocol>://<fqdn-address>` with a URL that doesn't match the application rule you configured, you get no response, which indicates that your firewall blocked the outbound request from the app.

### Firewall diagnostic logging

Because outbound requests are going through the firewall, you can capture them in the firewall logs by enabling firewall logging with the **Azure Firewall Application Rule**. For more information, see [Structured Azure Firewall logs](/azure/firewall/firewall-diagnostics#structured-azure-firewall-logs).

If you run the `curl` commands with diagnostic logs enabled, you can find them in the firewall logs.

1. In the Azure portal, navigate to your firewall.
1. Select **Logs** from the left navigation menu.
1. On the **Queries hub** screen, select **Run** in the **Application rule log data** tile.

You can see the two access logs in the query result.

:::image type="content" source="./media/network-secure-outbound-traffic-azure-firewall/azfw-application-log.png" alt-text="Screenshot of SCM debug console to verify the failed outbound traffic by using curl command." lightbox="./media/network-secure-outbound-traffic-azure-firewall/azfw-application-log.png":::

## Related content

[Monitor Azure Firewall logs and metrics](/azure/firewall/firewall-diagnostics)
