---
title: 'Install Palo Alto Networks Cloud NGFW in a Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Palo Alto Networks Cloud NGFW in a Virtual WAN hub.
services: virtual-wan
author: wtnlee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 05/02/2023
ms.author: wellee

---
# Configure Palo Alto Networks Cloud NGFW in a Virtual WAN hub

Palo Alto Networks Cloud NGFW is a cloud-native software-as-a-service security offering that can be deployed into the Virtual WAN hub as a bump-in-the-wire solution to inspect network traffic.

Palo Alto Networks Cloud NGFW integration with Virtual WAN provides the following benefits to customers:

* **Protect critical workloads** using a highly scalable SaaS security offering that can be injected as a bump-in-the-wire solution in Virtual WAN.
* **Fully managed infrastructure and software** lifecycle using software-as-a-service model.
* **Consumption-based pay-as-you-go** billing.
* **Cloud-native experience** that has a tight integration with Azure to provide end-to-end Firewall management using Azure Portal or Azure API's. Rule and policy management is also optionally  configurable through Palo Alto Network management solution Panorama.
* **Dedicated support channel** between Azure and Palo Alto Networks.
* **One-click routing** to configure Virtual WAN to inspect on-premises, Virtual Network and Internet-outbound traffic using Palo Alto Networks Cloud NGFW.

## Before you begin

The steps in this article assume you've already created a Virtual WAN.

To create a new virtual WAN use the steps in the following article:

* [Create a Virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)


## Known limitations

* Palo Alto Networks Cloud NGFW is only available in the following Azure regions: Central US, East US, East US 2, West Europe and Australia East. Other Azure regions is on the roadmap.
* Palo Alto Networks Cloud NGFW can only be deployed in new Virtual WAN hubs deployed with Azure resource tag **"hubSaaSPreview : true"**. Using existing Virtual Hubs with Palo Alto Networks Cloud NGFW is on the roadmap.
* Palo Alto Networks Cloud NGFW cannot be deployed with Network Virtual Appliances in the Virtual WAN hub.
* To use Palo Alto Networks Cloud NGFW, your entire network (on-premises and Virtual Networks) must be within RFC-1918 (subnets within 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12). This means you may not use a subnet such as 40.0.0.0/24 within your Virtual Network or on-premises.  
* All other limitations in the [Routing Intent and Routing policies limitations section](how-to-routing-policies.md) apply to Palo Alto Networks Cloud NGFW deployments in Virtual WAN.

## Deploy virtual hub
The follow steps describe how to deploy a Virtual Hub that can be used with Palo Alto Networks Cloud NGFW

1. Navigate to your Virutal WAN resource.
1. On the left hand menu, select **Hubs** under connectivity.
1. Click on **New Hub**.
1. Under **Basics** specify a region for your Virtual Hub. Make sure the region is Central US, East US, East US 2, West Europe or Australia East. Additionally, specify a name, address space, Virtual hub capacity and Hub routing preference for your hub.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/create-hub.png" alt-text="Screenshot showing hub creation page. Region selector box is highlighted." lightbox="./media/how-to-palo-alto-cloudngfw/create-hub.png":::
1. Select and configure the Gateways (Site-to-site VPN, Point-to-site VPN, ExpressRoute) you want to deploy in the Virtual Hub. You can deploy Gateways later if you wish.
1. Apply an Azure Resource tag to your Virtual Hub **"hubSaaSPreview":"true"**. This tag must be specified at hub deployment time  to use Palo Alto Networks Cloud NGFW.
        :::image type="content" source="./media/how-to-palo-alto-cloudngfw/apply-tags.png" alt-text="Screenshot showing hub tag creation page." lightbox="./media/how-to-palo-alto-cloudngfw/apply-tags.png":::
1. Click **Review + create**.
1. Click **Create**
1. Navigate to your newly created hub and wait for the **Routing Status** to be **Provisioned**. This step can take up to 30 minutes.  

## Deploy Palo Alto Networks Cloud NGFW

1. Navigate to your Virtual Hub and click on **SaaS solutions** under **Third-party providers**.
1. Click **Create SaaS** and select **Palo Alto Networks Cloud NGFW (preview)**.
1. Click **Create**.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/create-saas.png" alt-text="Screenshot showing SaaS creation page." lightbox="./media/how-to-palo-alto-cloudngfw/create-saas.png":::
1. Provide a name for your Firewall. Make sure the region of the Firewall is the same as the region of your Virtual Hub. For more information on the available configuration options for Palo Alto Networks Cloud NGFW, please see [Palo Alto Networks documentation for Cloud NGFW]().

## Configure Routing

After the Cloud NGFW is succesfully provisioned, you can now configure Virtual WAN to route traffic to your Cloud NGFW. 
1. Navigate to your Virtual Hub and click on **Routing intent and policies** under **Routing**
1. If you want to use Palo Alto Networks Cloud NGFW to inspect oubound Internet traffic (traffic between Virtual Networks or on-premises and the Internet), under **Internet traffic** select **SaaS solution**. For the **Next Hop resource**, select your Cloud NGFW resource.
 :::image type="content" source="./media/how-to-palo-alto-cloudngfw/internet-routing-policy.png" alt-text="Screenshot showing internet routing policy creation." lightbox="./media/how-to-palo-alto-cloudngfw/internet-routing-policy.png":::
1. If you want to use Palo Alto Networks Cloud NGFW to inspect private traffic (traffic between all Virtual Networks and on-premises in your Vitual WAN), under **Private traffic** select **SaaS solution**. For the **Next Hop resource**, select your Cloud NGFW resource.
 :::image type="content" source="./media/how-to-palo-alto-cloudngfw/private-routing-policy.png" alt-text="Screenshot showing private routing policy creation." lightbox="./media/how-to-palo-alto-cloudngfw/private-routing-policy.png":::
## Manage Palo Alto Networks Cloud NGFW

The follow section describes how you  manage your Palo Alto Networks Cloud NGFW (rules, IP addresses, security configurations etc.)

1. Navigate to your Virtual Hub and click on **SaaS solutions**.
1. Click on **Click here** under **Manage SaaS**.
    :::image type="content" source="./media/how-to-palo-alto-cloudngfw/manage-saas.png" alt-text="Screenshot showing how to manage your SaaS solution." lightbox="./media/how-to-palo-alto-cloudngfw/manage-saas.png":::
1. For more information on the available configuration options for Palo Alto Networks Cloud NGFW, please see [Palo Alto Networks documentation for Cloud NGFW]().

## Delete Palo Alto Networks Cloud NGFW

>[!NOTE]
> Note that you cannot delete your Virtual Hub until both the Cloud NGFW and Virtual WAN SaaS solution are deleted.

The following steps describes how to delete a Cloud NGFW offer:

1. Navigate to your Virtual Hub and click on **SaaS solutions**.
1. Click on **Click here** under **Manage SaaS**.
        :::image type="content" source="./media/how-to-palo-alto-cloudngfw/manage-saas.png" alt-text="Screenshot showing how to manage your SaaS solution." lightbox="./media/how-to-palo-alto-cloudngfw/manage-saas.png":::
1. Click on **Delete** in the upper left-hand corner of the page.
1. After the delete operation is successful, navigate back to your Virtual Hub's **SaaS solutions** page.
1. Click on the line that corresponds to your Cloud NGFW and click **Delete SaaS** on the upper left-hand corner of the page. Note that this option will not be available until Step 3 runs to completion. 


## Troubleshooting 

The following section describes common issues seen when using Palo Alto Networks Cloud NGFW in Virtual WAN.


### Troubleshooting Cloud NGFW creation

* Ensure Virtual Hubs are deployed in one of the following regions: Central US, East US, East US 2, West Europe or Australia East. Cloud NGFW will fail in other regions.
* Ensure Virtual Hub was created with the Azure Resource Tag **"hubSaaSPreview" : "true"**. Hubs created without this tag are not eligible to be used with Cloud NGFW. These tags must be specified at hub creation time and cannot be provided after hub deployment which means you will need to create a new Virtual Hub.


### Troubleshooting Routing intent and policies

* For more information about troubleshooting routing intent, please see [Routing Intent documentation](how-to-routing-policies.md). This document describes pre-requisites and common errors associated with configuring routing intent as well as troubleshooting tips.

### Troubleshooting Palo Alto Networks Cloud NGFW configuration

* Reference [Palo Alto Networks documentation]().

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about routing intent, see the [Routing Intent documentation]().
* For more information about Palo Alto Networks Cloud NGFW, see [Palo Alto Networks Cloud NGFW documentation]().

