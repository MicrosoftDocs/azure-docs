---
title: How to use the public IP functionality in Virtual WAN
description: This article explains how to use the public IP functionality in Azure Virtual WAN.
ms.topic: how-to
ms.date: 10/30/2020
---
# How to use the public IP functionality in Azure Virtual WAN

Public IP is a new feature in Azure VMware Solution connectivity, and customers can enable public internet access in two ways. 

- Applications can be hosted and published under the Application Gateway load balancer for HTTP/HTTPS traffic.
- Published through public IP features in Azure Virtual WAN.

As a part of Azure VMware Solution private cloud deployment, upon enabling public IP functionality, the required components with automation get created and enabled automatically:

-  Virtual WAN

-  Virtual WAN hub with ExpressRoute connectivity

-  Azure Firewall services with public IP

This article details how you can use the public IP functionality in Virtual WAN to make resources, such as web servers, virtual machines (VMs), and hosts, accessible via a public network.

## Prerequisites

- Azure VMware Solution environment
- A webserver running in Azure VMware Solution environment.
- A new non-overlapping IP range for the Virtual WAN hub deployment, typically a `/24`.

## Reference architecture

:::image type="content" source="media/public-ip-usage/public-ip-architecture-diagram.png" alt-text="Public IP architecture diagram" border="false" lightbox="media/public-ip-usage/public-ip-architecture-diagram.png":::

The architecture diagram shows a customer webserver hosted in the Azure VMware Solution environment and configured with RFC1918 private IP addresses.  This web service is made available to the internet through Virtual WAN public IP functionality.  Public IP is typically a destination NAT translated in Azure Firewall. With DNAT rules, firewall policy translates public IP address requests to a private address (webserver) with a port.

User requests hit the firewall on a public IP that, in turn, is translated to private IP using DNAT rules in the Azure Firewall. The firewall checks the NAT table, and if the request matches an entry, it forwards the traffic to the translated address and port in the Azure VMware Solution environment.

The web server receives the request and replies with the requested information or page to the firewall, and then the firewall forwards the information to the user on the public IP address.

## Test case
In this scenario, you must publish the IIS webserver to the internet. Use the public IP feature in Azure VMware Solution to publish the website on a public IP address.  We will configure NAT rules on the firewall and access Azure VMware Solution resource (VMs with webserver) with public IP.

## Deploy Virtual WAN

1. Sign in to the Azure portal and then search for and select **Azure VMware Solution**.

1. Select the Azure VMware Solution private cloud.

   :::image type="content" source="media/public-ip-usage/avs-private-cloud-resource.png" alt-text="Select the Azure VMware Solution private cloud." border="true" lightbox="media/public-ip-usage/avs-private-cloud-resource.png":::

1. Under **Manage**, select **Connectivity**.

   :::image type="content" source="media/public-ip-usage/avs-private-cloud-manage-menu.png" alt-text="Under Manage, select Connectivity." border="true" lightbox="media/public-ip-usage/avs-private-cloud-manage-menu.png":::

1. Select the **Public IP** tab and then select **Configure**.

   :::image type="content" source="media/public-ip-usage/connectivity-public-ip-tab.png" alt-text="Select the Public IP tab and then select Configure." border="true" lightbox="media/public-ip-usage/connectivity-public-ip-tab.png":::

1. Accept the default values or change them, and then select **Create**.

   - Virtual wide area network resource group

   - Virtual wide area network name

   - Virtual hub address block (using new non-overlapping IP range)

   - Number of public IPs (1-100)

It takes about one hour to complete the deployment of all components. This deployment only has to occur once to support all future public IPs for this Azure VMware Solution environment.  

>[!TIP]
>You can monitor the status from the **Notification** area. 

## View and add public IP addresses

We can check and add more public IP addresses by following the below steps.

1. In the Azure portal, search for and select **Firewall**.

1. Select a deployed firewall and then select **Visit Azure Firewall Manager to configure and manage this firewall**.

   :::image type="content" source="media/public-ip-usage/configure-manage-deployed-firewall.png" alt-text="Select a deployed firewall." border="true" lightbox="media/public-ip-usage/configure-manage-deployed-firewall.png":::

1. Select **Secured virtual hubs** and, from the list, select a virtual hub.

   :::image type="content" source="media/public-ip-usage/select-virtual-hub.png" alt-text="Select Secured virtual hubs and then select a virtual hub from the list." lightbox="media/public-ip-usage/select-virtual-hub.png":::

1. On the virtual hub page, select **Public IP configuration**, and to add more public IP address, then select **Add**. 

   :::image type="content" source="media/public-ip-usage/virtual-hub-page-public-ip-configuration.png" alt-text="On the virtual hub page, select Public IP configuration." border="true" lightbox="media/public-ip-usage/virtual-hub-page-public-ip-configuration.png":::

1. Provide the number of IPs required and select **Add**.

   :::image type="content" source="media/public-ip-usage/add-number-of-ip-addresses-required.png" alt-text="Select Add and provide the number of IP addresses required, and then select Add." border="true":::


## Create firewall policies

Once all components are deployed, you can see them in the added Resource group. The next step is to add a firewall policy.

1. In the Azure portal, search for and select **Firewall**.

1. Select a deployed firewall and then select **Visit Azure Firewall Manager to configure and manage this firewall**.

   :::image type="content" source="media/public-ip-usage/configure-manage-deployed-firewall.png" alt-text="Select a deployed firewall." border="true" lightbox="media/public-ip-usage/configure-manage-deployed-firewall.png":::

1. Select **Azure Firewall Policies** and then select **Create Azure Firewall Policy**.

   :::image type="content" source="media/public-ip-usage/create-firewall-policy.png" alt-text="Select Azure Firewall Policies and then select Create Azure Firewall Policy." border="true" lightbox="media/public-ip-usage/create-firewall-policy.png":::

1. Under the **Basics** tab, provide the required details and select **Next : DNS Settings**. 

1. Under the **DNS** tab, select **Disable**, and then select **Next : Rules**.

1. Select **Add a rule collection**, provide the below details and select **Add** and then select **Next : Threat intelligence**.

   -  Name
   -  Rules collection Type - DNAT
   -  Priority
   -  Rule collection Action – Allow
   -  Name of rule
   -  Source Type- **IPaddress**
   -  Source - **\***
   -  Protocol – **TCP**
   -  Destination port – **80**
   -  Destination Type – **IP Address**
   -  Destination – **Public IP Address**
   -  Translated address – **Azure VMware Solution Web Server private IP Address**
   -  Translated port - **Azure VMware Solution Web Server port**

1. Leave the default value, and then select **Next : Hubs**.

1. Select **Associate virtual hub**.

   :::image type="content" source="media/public-ip-usage/associate-virtual-hubs-azure-firewall-policy.png" alt-text="On the Hubs tab, select Associate virtual hub." border="true" lightbox="media/public-ip-usage/associate-virtual-hubs-azure-firewall-policy.png":::

1. Select a hub from the list and select **Add**.

   :::image type="content" source="media/public-ip-usage/secure-hubs-with-azure-firewall-polcy.png" alt-text="Select a hub from the list and select Add." border="true" lightbox="media/public-ip-usage/secure-hubs-with-azure-firewall-polcy.png":::

1. Select **Next : Tags**. 

1. (Optional) Create name/value pairs to categorize your resources. 

1. Select **Next : Review + create** and then select **Create**.

## Limitations

You can have 100 public IPs per SDDCs.

## Next steps

Learn more about using public IP addresses using [Azure Virtual WAN](../virtual-wan/virtual-wan-about.md).

