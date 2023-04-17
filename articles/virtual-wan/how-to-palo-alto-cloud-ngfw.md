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

Palo Alto Networks Cloud NGFW is a solution that is:
* Highly scalable w
## Before you begin

The steps in this article assume you've already created a Virtual WAN.

To create a new virtual WAN use the steps in the following article:

* [Create a Virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)


## Known Limitations

* Palo Alto Networks Cloud NGFW is only available in the following Azure regions: Central US, East US, East US 2, West Europe and Australia East. Other Azure regions is on the roadmap.
* Palo Alto Networks Cloud NGFW can only be deployed in new Virtual WAN hubs deployed with Azure resource tag **"hubSaaSPreview : true"**. Using existing Virtual Hubs with Palo Alto Networks Cloud NGFW is on the roadmap.
* Palo Alto Networks Cloud NGFW cannot be deployed with Network Virtual Appliances in the Virtual WAN hub.

## Deploy virtual hub
The follow steps describe how to deploy a Virtual Hub that can be used with Palo Alto Networks Cloud NGFW

1. Navigate to your Virutal WAN resource.
1. On the left hand menu, select **Hubs** under connectivity.
1. Click on **New Hub**.
1. Under **Basics** specify a region for your Virtual Hub. Make sure the region is Central US, East US, East US 2, West Europe or Australia East. Additionally, specify a name, address space, Virtual hub capacity and Hub routing preference for your hub.
1. Select the Gateways (Site-to-site VPN, Point-to-site VPN, ExpresRoute) you want to deploy in the Virtual Hub. You can deploy Gateways later if you wish.
1. Apply an Azure Resource tag to your Virtual Hub **"hubSaaSPreview":"true"**. This tag must be specified at hub deployment time  to use Palo Alto Networks Cloud NGFW. 
1. Click **Review + create**.
1. Click **Create**
1. Navigate to your newly created hub and wait for the **Routing Status** to be **Provisioned**. This step can take up to 30 minutes.  

## Deploy Palo Alto Networks Cloud NGFW

1. Navigate to your Virtual Hub and click on **SaaS solutions** under **Third-party providers**.
1. Click **Create SaaS** and select **Palo Alto Networks Cloud NGFW (preview)**.
1. Click **Create**.
1. Provide a name for your Firewall. Make sure the region of the Firewall is the same as the region of your Virtual Hub. For more information on the available configuration options for Palo Alto Networks Cloud NGFW, please see [Palo Alto Networks documentation for Cloud NGFW]().

## Configure Routing

After the Cloud NGFW is succesfully provisioned, you can now configure Virtual WAN to route traffic to your Cloud NGFW. 
1. Navigate to your Virtual Hub and click on **Routing intent and policies** under **Routing**
1. If you want to use Palo Alto Networks Cloud NGFW to inspect oubound Internet traffic (traffic between Virtual Networks or on-premises and the Internet), under **Internet traffic** select **SaaS solution**. For the **Next Hop resource**, select your Cloud NGFW resource.
1. If you want to use Palo Alto Networks Cloud NGFW to inspect private traffic (traffic between Virtual Networks and on-premises), under **Private traffic** select **SaaS solution**. For the **Next Hop resource**, select your Cloud NGFW resource.

## Manage Palo Alto Networks Cloud NGFW

The follow section describes how you  manage your Palo Alto Networks Cloud NGFW (rules, IP addresses, security configurations etc.)

1. Navigate to your Virtual Hub and click on **SaaS solutions**.
1. Click on **Click here** under **Manage SaaS**.
1. For more information on the available configuration options for Palo Alto Networks Cloud NGFW, please see [Palo Alto Networks documentation for Cloud NGFW]().

## Delete Cloud NGFW
The following steps describes how to delete a Cloud NGFW offer:

1. Navigate to your Virtual Hub and click on **SaaS solutions**.
1. Click on **Click here** under **Manage SaaS**.
1. Click on **Delete** in the upper left-hand corner of the page.
1. After the delete operation is succesful, navigate back to your Virtual Hub's **SaaS solutions** page.
1. Click on the line that corresponds to your Cloud NGFW.
1. Click **Delete SaaS** on the on the upper left-hand corner of the page. 

## Troubleshooting

If you are having trouble **creating a Palo Alto Networks Cloud NGFW in Virtual WAN please check the following:

* 


## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).

