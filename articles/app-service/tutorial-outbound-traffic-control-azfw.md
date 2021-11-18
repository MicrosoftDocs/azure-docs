---
title: 'Tutorial: App Service outbound traffic control with Azure Firewall'
description: Outbound traffic from App Service to internet, private IP addresses, and Azure services are routed through Azure Firewall. Learn how to control App Service outbound traffic by using Virtual Network integration and Azure Firewall. 
author: madsd
ms.author: madsd
ms.topic: tutorial
ms.date: 10/27/2021
ms.custom: template-tutorial
---

# Tutorial: Control outbound traffic with Azure Firewall

Azure App Service network traffic control has two aspects, namely inbound traffic and outbound traffic. Inbound is the traffic of users accessing your App Service, and outbound is the traffic of your App Service accessing other network resources. For the detailed network concepts and security enhancements, refer to [Networking features - Azure App Service](networking-features.md) and [Zero to Hero with App Service, Part 6: Securing your web app - Azure App Service](https://azure.github.io/AppService/2020/08/14/zero_to_hero_pt6.html).

In many companies, it's required to control the traffic of App Services access to external resources, prevent data exfiltration or the risk of malicious program implantation.

In this tutorial, learn to control App Service outbound traffic with Azure Firewall.

> [!div class="checklist"]
> * Create an Azure Firewall
> * Integrate Azure Firewall with route table (UDR) to traffic control

## Prerequisites

* Enable regional virtual network integration
* Verify **Route All** setting is enabled
* Disable service endpoints on the App Service subnet

### Enable regional virtual network integration
Apps in App Service are hosted on app service plan instances. Regional virtual network integration works by mounting virtual interfaces to the worker roles in the delegated subnet. Regional virtual network integration gives your app access to resources in your virtual network, but it doesn't grant inbound private access to your app from the virtual network. Regional virtual network integration is used only to make outbound calls from your app into your virtual network.

When regional virtual network integration is enabled, your app makes outbound calls through your virtual network. The outbound addresses that are listed in the app properties portal are the addresses still used by your app. If your outbound call is to a resource in the private endpoint integrated virtual network or peered virtual network, the outbound address will be an address from the integration subnet. The private IP assigned to an instance is exposed via the environment variable, `WEBSITE_PRIVATE_IP`.

To enable regional virtual network integration, see [Enable virtual network integration in Azure App Service](configure-vnet-integration-enable.md).

### Verify **Route All** is enabled

When regional virtual network integration is enabled, the **Route All** setting is enabled by default. When all traffic routing is enabled, all outbound traffic is sent into your virtual network. If all traffic routing is not enabled, only private traffic (RFC1918) and service endpoints configured on the integration subnet will be sent into the virtual network and outbound traffic to the internet will go through the same channels as normal.

To verify the **Route All** is enabled in Azure portal. See [Manage Azure App Service virtual network integration routing](configure-vnet-integration-routing.md#configure-in-the-azure-portal).

### Disable service endpoints on the integration subnet

By default, outbound traffic to Azure services will be the same as traffic to the internet. With the setting of service endpoints virtual network integration, it provides a strengthening security, optimizing way to route access to Azure services directly through the Microsoft network backbone. For service endpoint information, refer to  [Azure virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

To route outbound traffic to access Azure Services through Azure Firewall, disable the service endpoints on the App Service subnet.

## Create an Azure Firewall

Azure Firewall is a cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. To learn about Azure Firewall features, see [Azure Firewall features](../firewall/features.md).

* Create an Azure Firewall in the Azure portal.
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/create-azfw.png" alt-text="Screenshot of creating an Azure Firewall in the Azure portal.":::

* Get the private IP address of Azure Firewall

    After Azure Firewall is created, get the private IP address in the overview. The private IP address will be used as next hop address in the routing rule.
    :::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/firewall-private-ip.png" alt-text="Screenshot of get Azure firewall private IP address.":::

## Configure traffic routing to Azure Firewall with route table (UDR)

Azure routes traffic between Azure, on-premises, and Internet resources. Azure automatically creates a route table for each subnet within an Azure virtual network and adds system default routes to the table. To learn about Azure route table, [Azure virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md#default).

To forward App Service outbound traffic to Azure Firewall, add a user-defined route table and associate to the App Service subnet.

### Create a route table

1. Create a route table in the Azure portal
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/create-route-table.png" alt-text="Screenshot of creating a routing route table in Azure portal.":::
1. Add a route with `0.0.0.0/0` as the address prefix, set next hop type to virtual appliance and set Azure Firewall private IP address as next hop address.
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/add-route-rule.png" alt-text="Screenshot of adding a routing rule to a route table.":::
1. Associate the route table to the App Service subnet.
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/associate-route-table.png" alt-text="Screenshot of associate the route table to the App Service subnet.":::

### Configure Azure Firewall policies

To control App Service outbound traffic in Azure Firewall, add an application rule to the Azure Firewall policy.

In **Azure Firewall Policy**> **Application Rules**> **Add a rule collection** to add a network rule that allows the source address as App Service subnet. For testing purpose, we set `api.my-ip.io` as allowed destination FQDN.
    :::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/config-azfw-policy-app-rule.png" alt-text="Screenshot of configure Azure Firewall policy rule.":::

### Verify the outbound traffic

To verify the outbound traffic through Azure Firewall, review the Azure Firewall application rule log. To enable the Azure Firewall diagnostic log, see [Monitor Azure Firewall logs and metrics
](../firewall/firewall-diagnostics.md). 

We can use **curl** command from App Service SCM debug console to verify the outbound connection.

1. Open a browser and connect to the App Service SCM url: `https://<yourappname>.scm.azurewebsites.net`.
1. Open the CMD debug console to verify an outbound connect match with the application rule, Use **curl -s https://api.my-ip.io/api** to get the App Service ip address. In this case, we can get the response from the api service.
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/verify-outbound-traffic-fw-allow-rule.png" alt-text="Screenshot of verifying the success outbound traffic by using curl command in SCM debug console.":::

1. To verify an outbound connect that not matches the application rule. Use **curl -s https://api.ipify.org** to make an outbound connection. In this case, no response from the api service.
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/verify-outbound-traffic-fw-no-rule.png" alt-text="Screenshot of sending outbound traffic by using curl command in SCM debug console.":::

1. Review the Azure Firewall application rule log. We can see these two access logs in query result.
:::image type="content" source="./media/tutorial-outbound-traffic-control-azfw/azfw-application-log.png" alt-text="Screenshot of SCM debug console to verify the failed outbound traffic by using curl command.":::