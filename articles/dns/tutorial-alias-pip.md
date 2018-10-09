---
title: Tutorial - Create an Azure DNS alias record to refer to an Azure Public IP address.
description: This tutorial shows you how to configure an Azure DNS alias record to reference an Azure Public IP address.
services: dns
author: vhorne
ms.service: dns
ms.topic: tutorial
ms.date: 9/25/2018
ms.author: victorh
#Customer intent: As an experienced network administrator I want to configure Azure an DNS alias record to refer to an Azure Public IP address.
---

# Tutorial: Configure an alias record to refer to an Azure Public IP address 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a network infrastructure
> * Create a web server virtual machine
> * Create an alias record
> * Test the alias record


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain, including the ability to set the name server (NS) records for the domain.

For instructions to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

The example domain used for this tutorial is contoso.com, but you should use your own domain name.

## Create the network infrastructure
First, create a VNet and a subnet to place your web servers in.
1. Sign in to the Azure portal at http://portal.azure.com.
2. On the upper left in the portal, click **Create a resource**, type *resource group* in the search box, and create a resource group named **RG-DNS-Alias-pip**.
3. Click **Create a resource**, click **Networking**, and then click **Virtual network**.
4. Create a virtual network named **VNet-Server**, place it in the **RG-DNS-Alias-pip** resource group, and name the subnet **SN-Web**.

## Create a web server virtual machine
1. Click **Create a resource**, click **Windows Server 2016 VM**.
2. Type **Web-01** for the name, and place the VM in the **RG-DNS-Alias-TM** resource group. Type a username, password, and click **OK**.
3. For **Size**, choose a SKU with 8 GB RAM.
4. For **Settings**, select the **VNet-Servers** virtual network, the **SN-Web** subnet. For public inbound ports, select **HTTP**, **HTTPS**, and **RDP (3389)** and then click **OK**.
5. One the Summary page, click **Create**.

   This takes a few minutes to complete.

### Install IIS

Install IIS on **Web-01**.

1. Connect to **Web-01** and sign in.
2. From the Server Manager Dashboard, click **Add roles and features**.
3. Click **Next** three times, and on the **Server Roles** page select **Web Server (IIS)**.
4. Click **Add Features** and click **Next**.
5. Click **Next** four times and then click **Install**.

   This will take a few minutes to complete.
6. When the installation completes, click **Close**.
7. Open a web browser and browse to **localhost** to verify that the default IIS web page appears.

## Create an alias record

Create an alias record that points to the public IP address.

1. Click your Azure DNS zone to open the zone.
2. Click **Record set**.
3. In the **Name** text box **web01**.
4. Leave the **Type** as an **A** record.
5. Click the **Alias Record Set** check box.
6. Click **Choose Azure service** and select the **Web-01-ip** public IP address.

## Test the alias record

1. In the **RG-DNS-Alias-pip** resource group, click the **Web-01** virtual machine. Note the public IP address.
1. From a web browser, browse to the fully qualified domain name for Web01-01 virtual machine. For example: **web01.contoso.com**. You should see the IIS default web page.
2. Close the web browser.
3. Stop the **Web-01** virtual machine, and then restart it.
4. When it restarts, note the new public IP address for the virtual machine.
5. Open a new browser and browse again to the fully qualified domain name for Web01-01 virtual machine. For example: **web01.contoso.com**.
6. This should still succeed, since you used an alias record to point to the public IP address resource, and not a standard A record.

## Clean up resources

When no longer needed, you can delete the **RG-DNS-Alias-pip** resource group to delete all the resources created for this tutorial.


## Next steps

In this tutorial, you've created an alias record to refer to an Azure Public IP address. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)
