---
title: Tutorial - Create an Azure DNS alias record to support domain apex names with Traffic Manager
description: This tutorial shows you how to configure an Azure DNS alias record to support using your domain apex name with Traffic Manager.
services: dns
author: vhorne
ms.service: dns
ms.topic: tutorial
ms.date: 9/25/2018
ms.author: victorh
#Customer intent: As an experienced network administrator I want to configure Azure DNS alias records to use my domain apex name with Traffic Manager.
---

# Tutorial: Configure an alias record to support apex domain names with Traffic Manager 

You can create an alias record for your domain name apex (for example contoso.com) to reference a Traffic Manager profile. So instead of using a redirecting service for this, you can configure Azure DNS to reference a Traffic Manager profile directly from your zone. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a host VM and network infrastructure
> * Create a Traffic Manager profile
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
2. On the upper left in the portal, click **Create a resource**, type *resource group* in the search box, and create a resource group named **RG-DNS-Alias-TM**.
3. Click **Create a resource**, click **Networking**, and then click **Virtual network**.
4. Create a virtual network named **VNet-Servers**, place it in the **RG-DNS-Alias-TM** resource group, and name the subnet **SN-Web**.

## Create two web server virtual machines
1. Click **Create a resource**, click **Windows Server 2016 VM**.
2. Type **Web-01** for the name, and place the VM in the **RG-DNS-Alias-TM** resource group. Type a username, password, and click **OK**.
3. For **Size**, choose a SKU with 8 GB RAM.
4. For **Settings**, select the **VNet-Servers** virtual network, the **SN-Web** subnet.
5. Click **Public IP address**, and under **Assignment**, click **Static** and then click **OK**.
6. For public inbound ports, select **HTTP**, **HTTPS**, and **RDP (3389)** and then click **OK**.
7. One the Summary page, click **Create**.

   This takes a few minutes to complete.
6. Repeat this procedure to create another virtual machine named **Web-02**.

### Add a DNS label
The Public IP addresses need a DNS label to work with Traffic Manager.
1. In the **RG-DNS-Alias-TM** resource group, click the **Web-01-ip** public IP address.
2. Under **Settings**, click **Configuration**.
3. In the DNS name label text box, type **web01pip**.
4. Click **Save**.

Repeat this procedure for the **Web-02-ip** public IP address, using **web02pip** for the DNS name label.

### Install IIS

Install IIS on both **Web-01** and **Web-02**.

1. Connect to **Web-01** and sign in.
2. From the Server Manager Dashboard, click **Add roles and features**.
3. Click **Next** three times, and on the **Server Roles** page select **Web Server (IIS)**.
4. Click **Add Features** and click **Next**.
5. Click **Next** four times and then click **Install**.

   This will take a few minutes to complete.
6. When the installation completes, click **Close**.
7. Open a web browser and browse to **localhost** to verify that the default IIS web page appears.

Repeat this process to install IIS on **Web-02**.


## Create a Traffic Manager profile

Due 

1. Open the **RG-DNS-Alias-TM** resource group and click the **Web-01-ip** Public IP address. Note the IP addess for later use. Repeat for the **Web-02-ip** Public IP address.
1. Click **Create a resource**, click **Networking**, and then click **Traffic Manager profile**.
2. For the name, type **TM-alias-test**, and place it in the **RG-DNS-Alias-TM** resource group.
3. Click **Create**.
4. When deployment completes, click **Go to resource**.
5. On the traffic manager profile page, under **Settings**, click **Endpoints**.
6. Click **Add**.
7. For **Type**, select **External endpoint**, for **Name** type **EP-Web01**.
8. In the **Fully-qualified domain name (FQDN) or IP** text box, type the IP address for **Web-01-ip** that you noted previously.
9. Select the same **Location** as your other resources, and then click **OK**.

Repeat this procedure to add the **Web-02** endpoint, using the IP address you noted previously for **Web-02-ip**.

## Create an alias record

Create an alias record that points to the Traffic Manager profile.

1. Click your Azure DNS zone to open the zone.
2. Click **Record set**.
3. Leave the **Name** text box empty to represent the domain name apex (for example, contoso.com).
4. Leave the **Type** as an **A** record.
5. Click the **Alias Record Set** check box.
6. Click **Choose Azure service** and select the **TM-alias-test** Traffic Manager profile.

## Test the alias record

1. From a web browser, browse to your domain name apex (for example, contoso.com). You should see the IIS default web page. Close the web browser.
2. Shut down the **Web-01** virtual machine, and wait a few minutes for it to completely shut down.
3. Open a new web browser, and browse to your domain name apex again.
4. You should again see the default IIS page again, since Traffic Manager has handled the situation and directed traffic to **Web-02**.

## Clean up resources

When no longer needed, you can delete the **RG-DNS-Alias-TM** resource group to delete all the resources created for this tutorial.

## Next steps

In this tutorial, you've created an alias record to use your apex domain name to reference a Traffic Manager profile. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)
