---
title: 'Install Palo Alto Networks Cloud NGFW in a Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Palo Alto Networks Cloud NGFW in a Virtual WAN hub.
services: virtual-wan
author: wtnlee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/31/2023
ms.author: wellee
ms.custom : references_regions

---
# Configure Palo Alto Networks Cloud NGFW in Virtual WAN 


[Palo Alto Networks Cloud Next Generation Firewall (NGFW)](https://aka.ms/pancloudngfwdocs) is a cloud-native software-as-a-service (SaaS) security offering that can be deployed into the Virtual WAN hub as a bump-in-the-wire solution to inspect network traffic. The following document describes some of the key features, critical use cases and how-to associated with using Palo Alto Networks Cloud NGFW in Virtual WAN.

## Background

Palo Alto Networks Cloud NGFW integration with Virtual WAN provides the following benefits to customers:

* **Protect critical workloads** using a highly scalable SaaS security offering that can be injected as a bump-in-the-wire solution in Virtual WAN.
* **Fully managed infrastructure and software lifecycle** under software-as-a-service model.
* **Consumption-based pay-as-you-go** billing.
* **Cloud-native experience** that has a tight integration with Azure to provide end-to-end Firewall management using Azure portal or Azure APIs. Rule and policy management is also optionally  configurable through Palo Alto Network management solution Panorama.
* **Dedicated and streamlined support channel** between Azure and Palo Alto Networks to troubleshoot issues.
* **One-click routing** to configure Virtual WAN to inspect on-premises, Virtual Network and Internet-outbound traffic using Palo Alto Networks Cloud NGFW.

:::image type="content" source="./media/how-to-palo-alto-cloudngfw/deployment-topology.png" alt-text="Screenshot showing hub sample Virtual WAN topology with Cloud NGFW." lightbox="./media/how-to-palo-alto-cloudngfw/deployment-topology.png":::

## Use cases

The following section describes the common security use cases for Palo Alto Networks Cloud NGFW in Virtual WAN. 

### Private (on-premises and virtual network) traffic 

#### East-west traffic inspection

Virtual WAN routes traffic from  Virtual Networks to Virtual Network or from  on-premises (Site-to-site VPN, ExpressRoute, Point-to-site VPN) to on-premises to Cloud NGFW deployed in the hub for inspection.

:::image type="content" source="./media/how-to-palo-alto-cloudngfw/east-west-cloud-ngfw.png" alt-text="Screenshot showing east-west traffic flows with Cloud NGFW." lightbox="./media/how-to-palo-alto-cloudngfw/east-west-cloud-ngfw.png":::

#### North-south traffic inspection

Virtual WAN also routes traffic between  Virtual Networks and on-premises (Site-to-site VPN, ExpressRoute, Point-to-site VPN) to on-premises to Cloud NGFW deployed in the hub for inspection.

:::image type="content" source="./media/how-to-palo-alto-cloudngfw/north-south-cloud-ngfw.png" alt-text="Screenshot showing north-south traffic flows with Cloud NGFW." lightbox="./media/how-to-palo-alto-cloudngfw/north-south-cloud-ngfw.png":::

### Internet edge

>[!NOTE]
> The 0.0.0.0/0 default route does not propagate across hubs. On-premises and Virtual Networks can only use local Cloud NGFW resources to access the Internet. Additionally, for Destination NAT use cases, Cloud NGFW can only forward incoming traffic to local Virtual Networks and on-premises.

#### Internet egress

Virtual WAN can be configured to route internet-bound traffic from Virtual Networks or on-premises to Cloud NGFW for inspection and internet breakout. You can selectively choose which Virtual Network(s) or on-premise(s) learn the default route (0.0.0.0/0) and use Palo Alto Cloud NGFW for internet egress. In this use case, Azure automatically NATs the source IP of your internet-bound packet to the public IPs associated with the Cloud NGFW.

For more information on internet-outbound capabilities and available settings, see [Palo Alto Networks documentation](https://aka.ms/pancloudngfwdocs). 

:::image type="content" source="./media/how-to-palo-alto-cloudngfw/internet-outbound-cloud-ngfw.png" alt-text="Screenshot showing internet-outbound traffic flows with Cloud NGFW." lightbox="./media/how-to-palo-alto-cloudngfw/internet-outbound-cloud-ngfw.png":::

#### Internet ingress (DNAT)

You can also configure Palo Alto Networks for Destination-NAT (DNAT). Destination NAT allows a user to access and communicate with an application hosted on-premises or in an Azure Virtual Network via the public IPs associated with the Cloud NGFW.  

For more information on internet-inbound (DNAT) capabilities and available settings, see [Palo Alto Networks documentation](https://aka.ms/pancloudngfwdocs). 

:::image type="content" source="./media/how-to-palo-alto-cloudngfw/internet-inbound-cloud-ngfw.png" alt-text="Screenshot showing internet-inbound traffic flows with Cloud NGFW." lightbox="./media/how-to-palo-alto-cloudngfw/internet-inbound-cloud-ngfw.png":::

## Before you begin

The steps in this article assume you have already created a Virtual WAN.

To create a new virtual WAN, use the steps in the following article:

* [Create a Virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)

## Known limitations

* Palo Alto Networks Cloud NGFW is only available in the following Azure regions: Central US, East US, East US 2, West US, West US 2, West US 3, North Europe, West Europe, Australia East, Australia Southeast, UK South, UK West, Canada Central and East Asia. Other Azure regions are on the roadmap.
* Palo Alto Networks Cloud NGFW can't be deployed with Network Virtual Appliances in the Virtual WAN hub.
* For routing between Virtual WAN and Palo Alto Networks Cloud NGFW to work properly, your entire network (on-premises and Virtual Networks) must be within RFC-1918 (subnets within 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12). For example, you may not use a subnet such as 40.0.0.0/24 within your Virtual Network or on-premises. Traffic to 40.0.0.0/24 may not be routed properly.  
* All other limitations in the [Routing Intent and Routing policies documentation limitations section](how-to-routing-policies.md) apply to Palo Alto Networks Cloud NGFW deployments in Virtual WAN.

## Register resource provider

To use Palo Alto Networks Cloud NGFW, you must register the **PaloAltoNetworks.Cloudngfw** resource provider to your subscription with an API version that is at minimum **2022-08-29-preview**.

For more information on how to register a Resource Provider to an Azure subscription, see [Azure resource providers and types documentation](../azure-resource-manager/management/resource-providers-and-types.md).

## Deploy virtual hub

The following steps describe how to deploy a Virtual Hub that can be used with Palo Alto Networks Cloud NGFW.

1. Navigate to your Virtual WAN resource.
1. On the left hand menu, select **Hubs** under **Connectivity**.
1. Click on **New Hub**.
1. Under **Basics** specify a region for your Virtual Hub. Make sure the region is Central US, East US, East US 2, West US, West US 2, West US 3, North Europe, West Europe, Australia East, Australia Southeast, UK South, UK West, Canada Central or East Asia. Additionally, specify a name, address space, Virtual hub capacity and Hub routing preference for your hub.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/create-hub.png" alt-text="Screenshot showing hub creation page. Region selector box is highlighted." lightbox="./media/how-to-palo-alto-cloudngfw/create-hub.png":::
1. Select and configure the Gateways (Site-to-site VPN, Point-to-site VPN, ExpressRoute) you want to deploy in the Virtual Hub. You can deploy Gateways later if you wish.
1. Click **Review + create**.
1. Click **Create**
1. Navigate to your newly created hub and wait for the **Routing Status** to be **Provisioned**. This step can take up to 30 minutes.  

## Deploy Palo Alto Networks Cloud NGFW

>[!NOTE]
> You must wait for the routing status of the hub to be "Provisioned" before deploying Cloud NGFW. 
 
1. Navigate to your Virtual Hub and click on **SaaS solutions** under **Third-party providers**.
1. Click **Create SaaS** and select **Palo Alto Networks Cloud NGFW**.
1. Click **Create**.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/create-saas.png" alt-text="Screenshot showing SaaS creation page." lightbox="./media/how-to-palo-alto-cloudngfw/create-saas.png":::
1. Provide a name for your Firewall. Make sure the region of the Firewall is the same as the region of your Virtual Hub. For more information on the available configuration options for Palo Alto Networks Cloud NGFW, see [Palo Alto Networks documentation for Cloud NGFW](https://aka.ms/pancloudngfwdocs).

## Configure Routing

>[!NOTE]
> You can't configure routing intent until the Cloud NGFW is successfully provisioned.

1. Navigate to your Virtual Hub and click on **Routing intent and policies** under **Routing**
1. If you want to use Palo Alto Networks Cloud NGFW to inspect outbound Internet traffic (traffic between Virtual Networks or on-premises and the Internet), under **Internet traffic** select **SaaS solution**. For the **Next Hop resource**, select your Cloud NGFW resource.
 :::image type="content" source="./media/how-to-palo-alto-cloudngfw/internet-routing-policy.png" alt-text="Screenshot showing internet routing policy creation." lightbox="./media/how-to-palo-alto-cloudngfw/internet-routing-policy.png":::
1. If you want to use Palo Alto Networks Cloud NGFW to inspect private traffic (traffic between all Virtual Networks and on-premises in your Virtual WAN), under **Private traffic** select **SaaS solution**. For the **Next Hop resource**, select your Cloud NGFW resource.
 :::image type="content" source="./media/how-to-palo-alto-cloudngfw/private-routing-policy.png" alt-text="Screenshot showing private routing policy creation." lightbox="./media/how-to-palo-alto-cloudngfw/private-routing-policy.png":::

## Manage Palo Alto Networks Cloud NGFW

The following section describes how you can manage your Palo Alto Networks Cloud NGFW (rules, IP addresses, security configurations etc.)

1. Navigate to your Virtual Hub and click on **SaaS solutions**.
1. Click on **Click here** under **Manage SaaS**.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/manage-saas.png" alt-text="Screenshot showing how to manage your SaaS solution." lightbox="./media/how-to-palo-alto-cloudngfw/manage-saas.png":::
1. For more information on the available configuration options for Palo Alto Networks Cloud NGFW, see [Palo Alto Networks documentation for Cloud NGFW](https://aka.ms/pancloudngfwdocs).

## Delete Palo Alto Networks Cloud NGFW

>[!NOTE]
> You can't delete your Virtual Hub until both the Cloud NGFW and Virtual WAN SaaS solution are deleted.

The following steps describe how to delete a Cloud NGFW offer:

1. Navigate to your Virtual Hub and click on **SaaS solutions**.
1. Click on **Click here** under **Manage SaaS**.
        :::image type="content" source="./media/how-to-palo-alto-cloudngfw/manage-saas.png" alt-text="Screenshot showing how to manage your SaaS solution." lightbox="./media/how-to-palo-alto-cloudngfw/manage-saas.png":::
1. Click on **Delete** in the upper left-hand corner of the page.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/delete-ngfw.png" alt-text="Screenshot showing delete Cloud NGFW options." lightbox="./media/how-to-palo-alto-cloudngfw/delete-ngfw.png":::
1. After the delete operation is successful, navigate back to your Virtual Hub's **SaaS solutions** page.
1. Click on the line that corresponds to your Cloud NGFW and click **Delete SaaS** on the upper left-hand corner of the page. This option won't be available until Step 3 runs to completion. 
:::image type="content" source="./media/how-to-palo-alto-cloudngfw/delete-saas.png" alt-text="Screenshot showing how to delete your SaaS solution." lightbox="./media/how-to-palo-alto-cloudngfw/delete-saas.png":::

## Troubleshooting

The following section describes common issues seen when using Palo Alto Networks Cloud NGFW in Virtual WAN.

### Troubleshooting Cloud NGFW creation

* Ensure your Virtual Hubs are deployed in one of the following regions: Central US, East US, East US 2, West US, West US 2, West US 3, North Europe, West Europe, Australia East, Australia Southeast, UK South, UK West, Canada Central and East Asia. Other regions are in the roadmap.
* Ensure the Routing status of the Virtual Hub is "Provisioned." Attempts to create Cloud NGFW prior to routing being provisioned will fail.
* Ensure registration to the **PaloAltoNetworks.Cloudngfw** resource provider is successful.

### Troubleshooting deletion

* A SaaS solution can't be deleted until the linked Cloud NGFW resource is deleted. Therefore, delete the Cloud NGFW resource before deleting the SaaS solution resource.
* A SaaS solution resource that is currently the next hop resource for routing intent can't be deleted. Routing intent must be deleted before the SaaS solution resource can be deleted.
* Similarly, a Virtual Hub resource that has a SaaS solution can't be deleted. The SaaS solution must be deleted before the Virtual Hub is deleted.

### Troubleshooting Routing intent and policies

* Ensure Cloud NGFW deployment is completed successfully before attempting to configure Routing Intent.
* Ensure all your on-premises and Azure Virtual Networks are in RFC1918 (subnets within 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12).
* For more information about troubleshooting routing intent, see [Routing Intent documentation](how-to-routing-policies.md). This document describes pre-requisites,  common errors associated with configuring routing intent and troubleshooting tips.

### Troubleshooting Palo Alto Networks Cloud NGFW configuration

* Reference [Palo Alto Networks documentation](https://aka.ms/pancloudngfwdocs).

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about routing intent, see the [Routing Intent documentation](how-to-routing-policies.md).
* For more information about Palo Alto Networks Cloud NGFW, see [Palo Alto Networks Cloud NGFW documentation](https://aka.ms/pancloudngfwdocs).
