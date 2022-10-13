---
title: 'How to configure Virtual WAN Hub routing policies'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN routing policies
services: virtual-wan
author: wtnlee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/01/2021
ms.author: wellee

---
# How to configure Virtual WAN Hub routing intent and routing policies

>[!NOTE] 
> Hub Routing Intent is currently in gated public preview.
> 
> The preview for Hub Routing Intent impacts routing and route advertisements for **all** connections to the Virtual Hub (Point-to-site VPN, Site-to-site VPN, ExpressRoute, NVA, Virtual Network). 

This preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> 
> To obtain access to the preview, please deploy any Virtual WAN hubs and gateways (Site-to-site VPN Gateways, Point-to-site Gateways and ExpressRouteGateways) and then reach out to previewinterhub@microsoft.com with the Virtual WAN ID, Subscription ID and Azure Region you wish to configure Routing Intent in. Expect a response within 48 business hours (Monday-Friday) with confirmation of feature enablement. Please note that any gateways created after feature enablement will need to be upgraded by the Virtual WAN team.

## Background

Customers using Azure Firewall manager to set up policies for public and private traffic now can set up their networks in a much simpler manner using Routing Intent and Routing Policies.

Routing Intent and Routing policies allow you to specify how the Virtual WAN hub forwards Internet-bound and Private (Point-to-site, Site-to-site, ExpressRoute, Network Virtual Appliances inside the Virtual WAN Hub and Virtual Network) Traffic. There are two types of Routing Policies: Internet Traffic and Private Traffic Routing Policies. Each Virtual WAN Hub may have at most one Internet Traffic Routing Policy and one Private Traffic Routing Policy, each with a single Next Hop resource.

While Private Traffic  includes both branch and Virtual Network address prefixes, Routing Policies considers them as one entity within the Routing Intent Concepts.

>[!NOTE]
> Inter-region traffic **cannot** be inspected by Azure Firewall or NVA. Additionally, configuring both private and internet routing policies is currently **not** supported in most Azure regions. Doing so will put Gateways (ExpressRoute, Site-to-site VPN and Point-to-sive VPN) in a failed state and break connectivity from on-premises branches to Azure. Please ensure you only have one type of routing policy on each Virtual WAN hub. For more information, please contact previewinterhub@microsoft.com.


* **Internet Traffic Routing Policy**:  When an Internet Traffic Routing Policy is configured on a Virtual WAN hub, all branch (User VPN (Point-to-site VPN), Site-to-site VPN, and ExpressRoute) and Virtual Network connections to that Virtual WAN Hub will forward Internet-bound traffic to the Azure Firewall resource, Third-Party Security provider or **Network Virtual Appliance** specified as part of the Routing Policy.

    In other words, when Traffic Routing Policy is configured on a Virtual WAN hub, the Virtual WAN will advertise a **default** route to all spokes, Gateways and Network Virtual Appliances (deployed in the hub or spoke). This includes the **Network Virtual Appliance** that is the next hop for the Itnernet Traffic routing policy.
 
* **Private Traffic Routing Policy**: When a Private Traffic Routing Policy is configured on a Virtual WAN hub, **all** branch and Virtual Network traffic in and out of the Virtual WAN Hub including inter-hub traffic will be forwarded to the Next Hop Azure Firewall resource or Network Virtual Appliance resource that was specified in the Private Traffic Routing Policy. 

    In other words, when a Private Traffic Routing Policy is configured on the Virtual WAN Hub,  all branch-to-branch, branch-to-virtual network, virtual network-to-branch and inter-hub traffic will be sent via Azure Firewall or a Network Virtual Appliance deployed in the Virtual WAN Hub. 


## Key considerations

* You will **not** be able to enable routing policies on your deployments with existing Custom Route tables configured or if there are static routes configured in your Default Route Table.
* Currently, Private Traffic Routing Policies are not supported in Hubs with Encrypted ExpressRoute connections (Site-to-site VPN Tunnel running over ExpressRoute Private connectivity).
* In the gated public preview of Virtual WAN Hub routing policies, inter-hub traffic between hubs in different Azure regions is dropped.
* Routing Intent and Routing Policies currently must be configured via the custom portal link provided in Step 3 of  **Prerequisites**. Routing Intents and Policies are not supported via Terraform, PowerShell, and CLI.


## Prerequisites

1. Create a Virtual WAN. Make sure you create at least two Virtual Hubs if you wish to inspect inter-hub traffic. For instance, you may create a Virtual WAN with two Virtual Hubs in East US. Note that if you only wish to inspect branch-to-branch traffic, you may deploy a single Virtual WAN Hub as opposed to multiple hubs.
2. Convert your Virtual WAN Hub into a Secured Virtual WAN Hub by deploying an Azure Firewall into the Virtual Hubs in the chosen region. For more information on converting your Virtual WAN Hub to a Secured Virtual WAN Hub, please see [How to secure your Virtual WAN Hub](howto-firewall.md).
3. Deploy any Site-to-site VPN, Point-to-site VPN and ExpressRoute Gateways you will use for testing. Reach out to **previewinterhub@microsoft.com**  with the **Virtual WAN Resource ID** and the **Azure Virtual hub Region** you wish to configure Routing Policies in. To locate the Virtual WAN ID, open Azure portal, navigate to your Virtual WAN resource and select Settings > Properties > Resource ID. For example: 
    ```
    /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualWans/<virtualWANname>
    ```
4.  Expect a response within 24-48 hours with confirmation of feature enablement. 
5. Ensure that your Virtual Hubs do **not** have any Custom Route Tables or any  routes you may have added into the defaultRouteTable. You will **not** be able to enable routing policies on your deployments with existing Custom Route tables configured or if there are static routes configured in your Default Route Table. 
6. If you are using an **Azure Firewall** deployed in the Virtual WAN Hub, please reference [Configuring routing policies (through Azure Firewall Manager)](#azurefirewall) to configure routing intent and routing policies. If you are using a **Network Virtual Appliance** deployed in the Virtual WAN Hub, please reference [Configuring routing policies (through Virtual WAN Portal)](#nva) to configure routing intent and routing policies.

## <a name="azurefirewall"></a> Configure routing policies (through Azure Firewall Manager)

1. From the custom portal Link provided in the confirmation email from Step 3 in the **Prerequisites** section, navigate to the Virtual WAN Hub that you want to configure Routing Policies on.
1. Under Security, select **Secured Virtual hub settings** and then **Manage security provider and route settings for this Secured virtual hub in Azure Firewall Manager**
:::image type="content" source="./media/routing-policies/secured-hub-settings.png"alt-text="Screenshot showing how to modify secured hub settings."lightbox="./media/routing-policies/secured-hub-settings.png":::
1. Select the Hub you want to configure your Routing Policies on from the menu.
1. Select **Security configuration** under **Settings**
1. If you want to configure an Internet Traffic Routing Policy, select **Azure Firewall** or the relevant Internet Security provider from the dropdown for **Internet Traffic**. If not, select **None**
1. If you want to configure a Private Traffic Routing Policy (for branch and Virtual Network traffic) via Azure Firewall, select **Azure Firewall** from the dropdown for **Private Traffic**. If not, select **Bypass Azure Firewall**.

    :::image type="content" source="./media/routing-policies/configure-intents.png"alt-text="Screenshot showing how to configure routing policies."lightbox="./media/routing-policies/configure-intents.png":::

7. If you want to configure a Private Traffic Routing Policy and have branches or virtual networks advertising non-IANA RFC1918 Prefixes, select **Private Traffic Prefixes** and specify the non-IANA RFC1918 prefix ranges in the text box that comes up. Select **Done**. 

    :::image type="content" source="./media/routing-policies/private-prefixes.png"alt-text="Screenshot showing how to edit private traffic prefixes."lightbox="./media/routing-policies/private-prefixes.png":::

8. Select **Inter-hub** to be **Enabled**. Enabling this option ensures your Routing Policies are applied to the Routing Intent of this Virtual WAN Hub. 
9. Select **Save**. This operation will take around 10 minutes to complete. 
10. Repeat steps 2-8 for other Secured Virtual WAN hubs that you want to configure Routing policies for.
11. At this point, you are ready to send test traffic. Please make sure your Firewall Policies are configured appropriately to allow/deny traffic based on your desired security configurations. 

## <a name="nva"></a> Configure routing policies for network virtual appliances (through Virtual WAN portal)

>[!NOTE]
> The only Network Virtual Appliance deployed in the Virtual WAN hub compatible with routing intent and routing policies are listed in the [Partners section](about-nva-hub.md) as dual-role connectivity and Next-Generation Firewall solution providers.

1. From the custom portal link provided in the confirmation email from Step 3 in the **Prerequisites** section, navigate to the Virtual WAN hub that you want to configure routing policies on.
1. Under Routing, select **Routing Policies**.

    :::image type="content" source="./media/routing-policies/routing-policies-vwan-ui.png"alt-text="Screenshot showing how to navigate to routing policies."lightbox="./media/routing-policies/routing-policies-vwan-ui.png":::

3. If you want to configure a Private Traffic Routing Policy (for branch and Virtual Network Traffic), select **Network Virtual Appliance** under **Private Traffic** and under **Next Hop Resource** select the Network Virtual Appliance resource you wish to send traffic to. 

    :::image type="content" source="./media/routing-policies/routing-policies-private-nva.png"alt-text="Screenshot showing how to configure NVA private routing policies."lightbox="./media/routing-policies/routing-policies-private-nva.png":::

4. If you want to configure a Private Traffic Routing Policy and have branches or virtual networks using non-IANA RFC1918 Prefixes, select **Additional Prefixes** and specify the non-IANA RFC1918 prefix ranges in the text box that comes up. Select **Done**. 

   > [!NOTE]
   > At this point in time, Routing Policies for **Network Virtual Appliances** do not allow you to edit the RFC1918 prefixes. Virtual WAN will propagate the RFC1918 aggregate prefixes to all spoke Virtual networks, Gateways as well as the **Network Virtual Appliances**. Be mindful of the implications about the propagation of these prefixes into your environment and create the appropriate policies inside your **Network Virtual Appliance** to control routing behavior.  

    :::image type="content" source="./media/routing-policies/private-prefixes-nva.png"alt-text="Screenshot showing how to configure additional private prefixes for NVA  routing policies."lightbox="./media/routing-policies/private-prefixes-nva.png":::

5. If you want to configure a Internet Traffic Routing Policy, under **Internet traffic** select **Network Virtual Appliance** and under **Next Hop Resource** select the Network Virtual Appliance you want to send internet-bound traffic to. 

    :::image type="content" source="./media/routing-policies/public-routing-policy-nva.png"alt-text="Screenshot showing how to configure public routing policies for NVA."lightbox="./media/routing-policies/public-routing-policy-nva.png":::

6. To apply your routing intent and routing policies configuration, click **Save**.

    :::image type="content" source="./media/routing-policies/save-nva.png"alt-text="Screenshot showing how to save routing policies configurations"lightbox="./media/routing-policies/save-nva.png":::

7. Repeat for all hubs you would like to configure routing policies for.

8. At this point, you are ready to send test traffic. Please make sure your Firewall Policies are configured appropriately to allow/deny traffic based on your desired security configurations. 

## Routing policy configuration examples

The following section describes two common scenarios customers of applying Routing Policies to Secured  Virtual WAN hubs.

### All Virtual WAN Hubs are secured (deployed with Azure Firewall or NVA)

In this scenario, all Virtual WAN hubs are deployed with an Azure Firewall or NVA in them. In this scenario, you may configure an Internet Traffic Routing Policy, a Private Traffic Routing Policy or both on each Virtual WAN Hub.

:::image type="content" source="./media/routing-policies/two-secured-hubs-diagram.png"alt-text="Screenshot showing architecture with two secured hubs."lightbox="./media/routing-policies/two-secured-hubs-diagram.png":::

Consider the following configuration where Hub 1 and Hub 2  have Routing Policies for both Private and Internet Traffic. 

**Hub 1 configuration:**
* Private Traffic  Policy with Next Hop Hub 1 Azure Firewall or NVA
* Internet Traffic Policy with Next Hop Hub 1 Azure Firewall or NVA 

**Hub 2 configuration:**
* Private Traffic  Policy with Next Hop Hub 2 Azure Firewall or NVA
* Internet Traffic Policy with Next Hop Hub 2 Azure Firewall or NVA

The following are the traffic flows that result from such a configuration. 

> [!NOTE]
> Internet Traffic must egress through the **local** Azure Firewall as the default route (0.0.0.0/0) does **not** propagate across hubs.

| From |   To |  Hub 1 VNets | Hub 1 branches | Hub 2 VNets | Hub 2 branches| Internet|
| -------------- | -------- | ---------- | ---| ---| ---| ---|
| Hub 1 VNets     | &#8594;| Hub 1 AzFW  or NVA|   Hub 1 AzFW or NVA    | Hub 1 and 2 AzFW  or NVA | Hub 1 and 2 AzFW  or NVA | Hub 1 AzFW  or NVA |
| Hub 1 Branches   | &#8594;|  Hub 1 AzFW   or NVA|   Hub 1 AzFW or NVA    | Hub 1 and 2 AzFW  or NVA | Hub 1 and 2 AzFW  or NVA | Hub 1 AzFW  or NVA|
| Hub 2 VNets     | &#8594;| Hub 1 and 2 AzFW  or NVA|   Hub 1 and 2 AzFW  or NVA    | Hub 2 AzFW  or NVA | Hub 2 AzFW  or NVA| Hub 2 AzFW  or NVA|
| Hub 2 Branches   | &#8594;|   Hub 1 and 2 AzFW  or NVA  |    Hub 1 and 2 AzFW  or NVA   | Hub 2 AzFW  or NVA |  Hub 2 AzFW  or NVA | Hub 2 AzFW  or NVA|


### Mixture of secured and regular Virtual WAN Hubs 

In this scenario, not all Virtual WAN hubs are deployed with an Azure Firewall or Network Virtual Appliances in them. In this scenario, you may configure an Internet Traffic Routing Policy, a Private Traffic Routing Policy on the secured Virtual WAN Hubs. 

Consider the following configuration where Hub 1 (Normal) and Hub 2 (Secured) are deployed in a Virtual WAN. Hub 2 has Routing Policies for both Private and Internet Traffic. 

**Hub 1 Configuration:**
* N/A (cannot configure Routing Policies if hub is not deployed with Azure Firewall or NVA)

**Hub 2 Configuration:**
* Private Traffic  Policy with Next Hop Hub 2 Azure Firewall or NVA
* Internet Traffic Policy with Next Hop Hub 2 Azure Firewall or NVA 


:::image type="content" source="./media/routing-policies/one-secured-one-normal-diagram.png"alt-text="Screenshot showing architecture with one secured hub one normal hub."lightbox="./media/routing-policies/one-secured-one-normal-diagram.png":::


 The following are the traffic flows that result from such a configuration. Branches and Virtual Networks connected to Hub 1 **cannot** access the Internet via Azure Firewall in the Hub because the default route (0.0.0.0/0) does **not** propagate across hubs.

| From |   To |  Hub 1 VNets | Hub 1 branches | Hub 2 VNets | Hub 2 branches| Internet |
| -------------- | -------- | ---------- | ---| ---| ---| --- |
| Hub 1 VNets     | &#8594;| Direct |   Direct   | Hub 2 AzFW  or NVA| Hub 2 AzFW  or NVA | - |
| Hub 1 Branches   | &#8594;|  Direct |   Direct    | Hub 2 AzFW  or NVA | Hub 2 AzFW or NVA | - |
| Hub 2 VNets     | &#8594;| Hub 2 AzFW  or NVA|   Hub 2 AzFW  or NVA    | Hub 2 AzFW   or NVA| Hub 2 AzFW  or NVA| Hub 2 AzFW  or NVA|
| Hub 2 Branches   | &#8594;|   Hub 2 AzFW  or NVA  |    Hub 2 AzFW    | Hub 2 AzFW  or NVA|  Hub 2 AzFW  or NVA | Hub 2 AzFW  or NVA|


## Troubleshooting

The following section describes common issues encountered when you configure Routing Policies on your Virtual WAN Hub.  Read the below sections and if your issue is still unresolved,  reach out to previewinterhub@microsoft.com for support. Expect a response within 48 business hours (Monday through Friday).

### Troubleshooting configuration issues

*  Make sure that you have gotten confirmation from previewinterhub@microsoft.com that access to the gated public preview has been granted to your subscription and chosen region. You will **not** be able to configure routing policies without being granted access to the preview.
* After enabling the Routing Policy feature  on your deployment,  ensure you **only** use the custom portal link provided as part of your confirmation email. Do not use PowerShell, CLI, or REST API calls to manage your Virtual WAN deployments.  This includes creating new Branch (Site-to-site VPN, Point-to-site VPN or ExpressRoute) connections.

    >[!NOTE]
    > If you are using Terraform, routing policies are currently not supported.

*  Ensure that your Virtual Hubs do not have any Custom Route Tables or any static routes in the defaultRouteTable. You will **not** be able to select **Enable interhub** from Firewall Manager on your Virtual WAN Hub if there are Custom Route tables configured or if there are static routes in your defaultRouteTable. 


### Troubleshooting data path 

* Currently, using Azure Firewall to inspect inter-hub traffic is  available for Virtual WAN hubs that are deployed in the **same** Azure Region. Inter-hub inspection for Virtual WAN hubs that are in different Azure regions is available on a limited basis. For a list of available regions, please email previewinterhub@mcirosoft.com.
* Currently, Private Traffic Routing Policies are not supported in Hubs with Encrypted ExpressRoute connections (Site-to-site VPN Tunnel running over ExpressRoute Private connectivity).
* You can verify that the Routing Policies have been applied properly by checking the Effective Routes of the DefaultRouteTable. If Private Routing Policies are configured, you should see routes in the DefaultRouteTable for private traffic prefixes with next hop Azure Firewall. If Internet Traffic Routing Policies are configured, you should see a default (0.0.0.0/0) route in the DefaultRouteTable with next hop Azure Firewall.
* If there are any Site-to-site VPN gateways or Point-to-site VPN gateways created **after** the feature has been confirmed to be enabled on your deployment, you will have to reach out again to previewinterhub@microsoft.com to get the feature enabled. 
* If you are using Private Routing Policies with ExpressRoute, please note that your ExpressRoute circuit cannot advertise exact address ranges for the RFC1918 address ranges (you cannot advertise 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). Please ensure you are advertising more specific subnets (within RFC1918 ranges) as opposed to aggregate supernets. Additionally, if your ExpressRoute circuit is advertising a non-RFC1918 prefix to Azure, please make sure the address ranges that you put in the Private Traffic Prefixes text box are less specific than ExpressRoute advertised routes. For example, if the ExpressRoute Circuit is advertising 40.0.0.0/24 from on-premises, put a a /23 CIDR range or larger in the Private Traffic Prefix text box (example: 40.0.0.0/23).
* Make sure you do not have both private and internet routing policies configured on a single Virtual WAN hub. Configuring both private and internet routing policies on the same hub is currently unsupported and will cause Point-to-site VPN, ExpressRoute and Site-to-site VPN gateways to go into a failed state and interrupt datapath connectivity to Azure. 

### Troubleshooting Azure Firewall

* If you are using non [IANA RFC1918](https://datatracker.ietf.org/doc/html/rfc1918) prefixes in your branches/Virtual Networks, make sure you have specified those prefixes in the "Private Prefixes" text box in Firewall Manager.
* If you have specified non RFC1918 addresses as part of the **Private Traffic Prefixes** text box in Firewall Manager, you may need to configure SNAT policies on your Firewall to disable SNAT for non-RFC1918 private traffic. For more information,  reference the following [document](../firewall/snat-private-range.md). 
* Configure and view Azure Firewall logs to help troubleshoot and analyze your network traffic. For more information on how to set-up monitoring for Azure Firewall,  reference the following [document](../firewall/firewall-diagnostics.md). An overview of the different types of Firewall logs can be found [here](../firewall/logs-and-metrics.md).
* For more information on Azure Firewall,  review [Azure Firewall Documentation](../firewall/overview.md).

## Frequently asked questions

### Why can't I edit the defaultRouteTable from the custom portal link provided by previewinterhub@microsoft.com?

As part of the gated public preview of Routing Policies, your Virtual WAN hub routing is managed entirely by Firewall Manager. Additionally, the managed preview of Routing Policies is **not** supported alongside Custom Routing. Custom Routing with Routing Policies will be supported at a later date. 

However, you can still view the Effective Routes of the DefaultRouteTable by navigating to the **Effective Routes** Tab.

If you have configured private traffic routing policies on your Virtual WAN hub, the Effective Route Table will only contain routes for RFC1918 supernets as well as any additional address prefixes that were specified in the Additional Private Traffic Prefixes text box. 

### Can I configure a Routing Policy for Private Traffic and also send Internet Traffic (0.0.0.0/0) via a Network Virtual Appliance in a Spoke Virtual Network?

This scenario is not supported in the gated public preview. However,  reach out to previewinterhub@microsoft.com to express interest in implementing this scenario. 

### Does the default route (0.0.0.0/0) propagate across hubs?

No. Currently, branches and Virtual Networks will egress to the internet using an Azure Firewall deployed inside of the Virtual WAN hub the branches and Virtual Networks are connected to. You cannot configure a connection to access the Internet via the Firewall in a remote hub.

### Why do I see RFC1918 aggregate prefixes advertised to my on-premises devices?

When Private Traffic Routing Policies are configured, Virtual WAN Gateways will automatically advertise static routes that are in the default route table (RFC1918 prefixes: 10.0.0.0/8,172.16.0.0/12,192.168.0.0/16) in addition to the explicit branch and Virtual Network prefixes.

### Why are my Gateways (Site-to-site VPN, Point-to-site VPN, ExpressRoute) in a failed state?

There is currently a limitation where if Internet and private routing policies are configured concurrently on the same hub, Gateways go into a failed state, meaning your branches cannot communicate with Azure. For more information on when this limitation will be lifted, please contact previewinterhub@microsoft.com.
## Next steps

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
