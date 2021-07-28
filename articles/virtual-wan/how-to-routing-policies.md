---
title: 'How to configure Virtual WAN Hub routing policies'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN routing policies
services: virtual-wan
author: wellee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/0`/2021
ms.author: wellee

---
# How to configure Virtual WAN Hub routing policies

>[!NOTE] 
> Hub Routing Policies are currently in Managed Preview. 
> 
> To obtain access to the preview, please reach out to previewinterhub@microsoft.com with the Virtual WAN ID, Subscription ID and Azure Region you wish to configure Routing Policies in. Please expect a response within 24-48 hours with confirmation of feature enablement.

## Background 

Routing policies allow you to specify how the Virtual WAN hub forwards Internet-bound and Private (Point-to-site, Site-to-site, ExpressRoute and Virtual Network) Traffic. There are two types of Routing Policies, Internet Traffic and Private Traffic Routing Policies. Each Virtual WAN Hub may have at most one Internet Traffic Routing Policy and one Private Traffic Routing Policy, each with a Next Hop resource. 

>[!NOTE]
> In the Managed Preview of Virtual WAN Hub routing policies, the Next Hop resource of a routing policy must be an Azure Firewall deployed in the Virtual WAN Hub. Additionally, inter-hub traffic is only inspected if the Virtual WAN Hubs are in the same region. Inter-region traffic inspection will come at a later date.


* **Internet Traffic Routing Policy**:  When an Internet Traffic Routing Policy is configured on a Virtual WAN hub, all branch (Point-to-site VPN, Site-to-site VPN and ExpressRoute) and Virtual Network connections to that Virtual WAN Hub will forward Internet-bound traffic to the Azure Firewall resource or Third Party Security provider specified as part of the Routing Policy.
 

* **Private Traffic Routing Policy**: When a Private Traffic Routing Policy is configured on a Virtual WAN hub, **all** traffic including inter-hub traffic destined for branches and Virtual Network connected to the Virtual WAN Hub  will be forwarded to the Next Hop Azure Firewall resource specified as pat of the Routing Policy. 

    When Private Traffic Routing Policies are configured on the Virtual WAN Hub,  branch-to-branch, branch-to-virtual network and inter-hub traffic will be sent via Azure Firewall.



## Prerequisites
1. Create a Virtual WAN. Make sure you create at least two Virtual Hubs in the same region. For instance, you may create a Virtual WAN with 2 Virtual Hubs in East US. 
2. Convert your Virtual WAN Hub into a Secured Virtual WAN Hub by deploying an Azure Firewall into the Virtual Hubs in the chosen region. For more information on converting your Virtual WAN Hub to a Secured Virtual WAN Hub, please see this [document](howto-firewall.md).
3. Reach out to **previewinterhub@microsoft.com** with with the **Virtual WAN ID**, **Subscription ID** and **Azure Region** you wish to configure Routing Policies in. Please expect a response within 24-48 hours with confirmation of feature enablement. 
4. Ensure that your Virtual Hubs do **not** have any Custom Route Tables or any static routes in the defaultRouteTable. You will **not** be able to enable routing policies on your deployments if there are Custom Route tables configured or if there are static routes in your Default Route Table. 

## Configuring Routing Policies
1. From the Custom Portal Link provided in your confirmation email, navigate to the Virtual WAN Hub that you want to configure Routing Policies on.
1. Under Security, click **Secured Virtual hub settings** and then **Manage security provider and route settings for this Secured virtual hub in Azure Firewall Manager**
:::image type="content" source="./media/routing-policies/secured-hub-settings.png"alt-text="Screenshot showing architecture with two secured hubs."lightbox="./media/routing-policies/secured-hub-settings.png":::
1. Select the Hub you want to configure your Routing Policies on from the menu.
1. Click on **Security configuration** under **Settings**
1. If you want to configure an Internet Traffic Routing Policy, select **Azure Firewall** from the dropdown for **Internet Traffic**. If not, select **None**
1. If you want to configure a Private Traffic Routing Policy (branch and Virtual Network traffic) via Azure Firewall, select **Azure Firewall** from the dropdown for **Private Traffic**. If not, select **Bypass Azure Firewall**.

:::image type="content" source="./media/routing-policies/configuring-intents.png"alt-text="Screenshot showing architecture with two secured hubs."lightbox="./media/routing-policies/configuring-intents.png":::

7. If you want to configure a Private Traffic Routing Policy and have branches or virtual networks advertising non-IANA RFC1918 Prefixes, click on **Private Traffic Prefixes** and specify the non-IANA RFC1918 prefix ranges in the text box that comes up. Click **Done**. 

:::image type="content" source="./media/routing-policies/private-prefixes.png"alt-text="Screenshot showing architecture with two secured hubs."lightbox="./media/routing-policies/private-prefixes.png":::
1. Select **Inter-hub** to be **Enabled**. Enabling this option ensures your Routing Policies are applied to the Virtual WAN Hub. 
1. Click **Save**. This operation will take around 10 minutes to complete. 
1. Repeat steps 2-8 for other Secured Virtual WAN hubs that you want to configure Routing policies for. 
 
## Routing Policy Configuration Examples 

### All Virtual WAN Hubs are Secured (Deployed with Azure Firewall)

In this scenario, all Virtual WAN hubs are deployed with an Azure Firewall in them. In this scenario, you may configure an Internet Traffic Routing Policy, a Private Traffic Routing Policy or both on each Virtual WAN Hub. 

:::image type="content" source="./media/routing-policies/two-secured-hubs-diagram.png"alt-text="Screenshot showing architecture with two secured hubs."lightbox="./media/routing-policies/two-secured-hubs-diagram.png":::

Consider the following configuration where Hub 1 and Hub 2  have Routing Policies for both Private and Internet Traffic. 
**Hub 1 Configuration:**
* Private Traffic  Policy with Next Hop Hub 1 Azure Firewall
* Internet Traffic Policy with Next Hop Hub 1 Azure Firewall 

**Hub 2 Configuration:**
* Private Traffic  Policy with Next Hop Hub 2 Azure Firewall
* Internet Traffic Policy with Next Hop Hub 2 Azure Firewall 

The following are the traffic flows that result from such a configuration. Note that Internet Traffic must egress through the **local** Azure Firewall as the default route (0.0.0.0/0) does **not** propagate across hubs.

| From |   To |  Hub 1 VNets | Hub 1 Branches | Hub 2 VNets | Hub 2 Branches| Internet|
| -------------- | -------- | ---------- | ---| ---| ---| ---|
| Hub 1 VNets     | &#8594;| Hub 1 AzFW |   Hub 1 AzFW    | Hub 1,2 AzFW | Hub 1,2 AzFW | Hub 1 AzFW |
| Hub 1 Branches   | &#8594;|  Hub 1 AzFW  |   Hub 1 AzFW    | Hub 1,2 AzFW | Hub 1,2 AzFW | Hub 1 AzFW|
| Hub 2 VNets     | &#8594;| Hub 1,2 AzFW |   Hub 1,2 AzFW    | Hub 2 AzFW  | Hub 2 AzFW | Hub 2 AzFW|
| Hub 2 Branches   | &#8594;|   Hub 1,2 AzFW  |    Hub 1,2 AzFW    | Hub 2 AzFW |  Hub 2 AzFW | Hub 2 AzFW|


### Mixture of Secured and Regular Virtual WAN Hubs 

In this scenario, not all Virtual WAN hubs are deployed with an Azure Firewall in them. In this scenario, you may configure an Internet Traffic Routing Policy, a Private Traffic Routing Policy on the secured Virtual WAN Hubs. 

Consider the following configuration where Hub 1 (Normal) and Hub 2 (Secured) are deployed in a Virtual WAN. Hub 2 has Routing Policies for both Private and Internet Traffic. 
**Hub 1 Configuration:**
* N/A (cannot configure policies if hub is Normal)

**Hub 2 Configuration:**
* Private Traffic  Policy with Next Hop Hub 2 Azure Firewall
* Internet Traffic Policy with Next Hop Hub 2 Azure Firewall 


:::image type="content" source="./media/routing-policies/one-secured-one-normal-diagram.png"alt-text="Screenshot showing architecture with one secured hub one normal hub."lightbox="./media/routing-policies/one-secured-one-normal-diagram.png":::


 The following are the traffic flows that result from such a configuration. Note that Branches and Virtual Networks connected to Hub 1 **cannot** access the Internet via Azure Firewall in the Hub because the default route (0.0.0.0/0) does **not** propagate across hubs.

| From |   To |  Hub 1 VNets | Hub 1 Branches | Hub 2 VNets | Hub 2 Branches| Internet |
| -------------- | -------- | ---------- | ---| ---| ---| --- |
| Hub 1 VNets     | &#8594;| Direct |   Direct   | Hub 2 AzFW | Hub 2 AzFW | - |
| Hub 1 Branches   | &#8594;|  Direct |   Direct    | Hub,2 AzFW | Hub 2 AzFW | - |
| Hub 2 VNets     | &#8594;| Hub 2 AzFW |   Hub 2 AzFW    | Hub 2 AzFW  | Hub 2 AzFW | Hub 2 AzFW|
| Hub 2 Branches   | &#8594;|   Hub 2 AzFW  |    Hub 2 AzFW    | Hub 2 AzFW |  Hub 2 AzFW | Hub 2 AzFW|


## Troubleshooting

The following section describes common issues encountered when configuring Routing Policies on your Virtual WAN Hub. Please read the below sections and if your issue is still unresolved, please reach out to previewinterhub@microsoft.com for support. Please expect a response within 24-48 hours. 

### Troubleshooting Configuration Issues
1. Please make sure that you have gotten confirmation from previewinterhub@microsoft.com that access to the managed preview has been granted to your subscription and chosen region. You will **not** be able to configure routing policies without the granted permissions.
2. After enabling the Routing Policy feature please on your deployment, please  ensure you **only** use the custom portal link provided as part of your confirmation email. Please do not use Power-shell, CLI or Rest API calls to manage your Virtual WAN deployments.  This includes creating new Branch (Site-to-site VPN, Point-to-site VPN or ExpressRoute) connections from the custom portal link provided as part of your confirmation email.
3. Ensure that your Virtual Hubs do not have any Custom Route Tables or any static routes in the defaultRouteTable. You will **not** be able to enable routing policies on your deployments if there are Custom Route tables configured or if there are static routes in your defaultRouteTable. 

### Troubleshooting Data path 

1. Currently, using Azure Firewall to inspect inter-hub traffic is only available for Virtual WAN hubs that are deployed in the **same** Azure Region. The ability to inspect inter-hub traffic between **different** Azure Regions will be available at a later date.
1. Currently, Private Traffic Routing Policies do not apply to Encrypted ExpressRoute connections (Site-to-site VPN Tunnel running over ExpressRoute Private connectivity). This will be available at a later date. 
1. You can verify that the Routing Policies have been applied properly by checking the Effective Routes of the DefaultRouteTable. If Private Routing Policies are configured, you should see routes in the DefaultRouteTable for private traffic prefixes with next hop Azure Firewall. If Internet Traffic Routing Policies are configured, you should see a default (0.0.0.0/0) route in the DefaultRouteTable with next hop Azure Firewall.

### Troubleshooting Azure Firewall

1. If you are using non IANA RFC1918 prefixes in your branches/Virtual Networks, please make sure you have specified those prefixes in the "Private Prefixes" text box in Firewall Manager.
1. If you have specified non RFC1918 addresses as part of the **Private Traffic Prefixes** text box in Firewall Manager you may need to configure SNAT policies on your Firewall to disable SNAT for non-RFC1918 private traffic. For more information, please reference the following [document](../firewall/snat-private-range.md). 
1. Consider configuring and viewing Azure Firewall logs to help troubleshoot and analyze your network traffic. For more information on how to set-up monitoring for Azure Firewall, please reference the following [document](../firewall/firewall-diagnostics.md). An overview of the different types of Firewall logs can be found [here](../firewall/logs-and-metrics.md).
1. For more information on Azure Firewall, please review [Azure Firewall Documentation](../firewall/overview.md).



## Frequently Asked Questions

### Why can't I edit the defaultRouteTable from the custom portal link provided by previewinterhub@microsoft.com?

As part of the managed preview of Routing Policies, your Virtual WAN hub routing is managed entirely by Firewall Manager. Additionally, the managed preview of Routing Policies is **not** supported alongside Custom Routing. Custom Routing with Routing Policies will be supported at a later date. 

However, you can still view the Effective Routes of the DefaultRouteTable by navigating to the **Effective Routes** Tab.

### Can I configure a Routing Policy for Private Traffic and also send Internet Traffic (0.0.0.0/0) via a Network Virtual Appliance in a Spoke Virtual Network?

This scenario is not supported in the Managed Preview. However, please reach out to previewinterhub@microsoft.com to express interest in implementing this scenario. 

### Does the default route (0.0.0.0/0) propagate across hubs?

No. Currently, branches and Virtual Networks will egress to the internet using an Azure Firewall deployed inside of the Virtual WAN hub the branches and Virtual Networks are connected to. You cannot configure a connection to access the Internet via the Firewall in a remote hub.

## Next steps

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
