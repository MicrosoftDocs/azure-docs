---
title: Tutorial - Create an Azure DNS alias record to support domain apex names with Traffic Manager
description: This tutorial shows you how to configure an Azure DNS alias record to support using your domain apex name with Traffic Manager.
services: dns
author: vhorne
ms.service: dns
ms.topic: tutorial
ms.date: 9/25/2018
ms.author: victorh
#Customer intent: As an experienced network administrator, I want to configure Azure DNS alias records to use my domain apex name with Traffic Manager.
---

# Tutorial: Configure an alias record to support apex domain names with Traffic Manager 

You can create an alias record for your domain name apex to reference an Azure Traffic Manager profile. An example is contoso.com. Instead of using a redirecting service, you configure Azure DNS to reference a Traffic Manager profile directly from your zone. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a host VM and network infrastructure.
> * Create a Traffic Manager profile.
> * Create an alias record.
> * Test the alias record.


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

For instructions on how to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

The example domain used for this tutorial is contoso.com, but use your own domain name.

## Create the network infrastructure
First, create a virtual network and a subnet to place your web servers in.
1. Sign in to the Azure portal at https://portal.azure.com.
2. In the upper left in the portal, select **Create a resource**. Enter *resource group* in the search box, and create a resource group named **RG-DNS-Alias-TM**.
3. Select **Create a resource** > **Networking** > **Virtual network**.
4. Create a virtual network named **VNet-Servers**. Place it in the **RG-DNS-Alias-TM** resource group, and name the subnet **SN-Web**.

## Create two web server virtual machines
1. Select **Create a resource** > **Windows Server 2016 VM**.
2. Enter **Web-01** for the name, and place the VM in the **RG-DNS-Alias-TM** resource group. Enter a username and a password, and select **OK**.
3. For **Size**, select an SKU with 8-GB RAM.
4. For **Settings**, select the **VNet-Servers** virtual network and the **SN-Web** subnet.
5. Select **Public IP address**. Under **Assignment**, select **Static**, and then select **OK**.
6. For public inbound ports, select **HTTP** > **HTTPS** > **RDP (3389)**, and then select **OK**.
7. On the **Summary** page, select **Create**. This procedure takes a few minutes to finish.

Repeat this procedure to create another virtual machine named **Web-02**.

### Add a DNS label
The public IP addresses need a DNS label to work with Traffic Manager.
1. In the **RG-DNS-Alias-TM** resource group, select the **Web-01-ip** public IP address.
2. Under **Settings**, select **Configuration**.
3. In the DNS name label text box, enter **web01pip**.
4. Select **Save**.

Repeat this procedure for the **Web-02-ip** public IP address by using **web02pip** for the DNS name label.

### Install IIS

Install IIS on both **Web-01** and **Web-02**.

1. Connect to **Web-01**, and sign in.
2. On the **Server Manager** dashboard, select **Add roles and features**.
3. Select **Next** three times. On the **Server Roles** page, select **Web Server (IIS)**.
4. Select **Add Features**, and select **Next**.
5. Select **Next** four times. Then select **Install**. This procedure takes a few minutes to finish.
6. When the installation finishes, select **Close**.
7. Open a web browser. Browse to **localhost** to verify that the default IIS web page appears.

Repeat this procedure to install IIS on **Web-02**.


## Create a Traffic Manager profile

1. Open the **RG-DNS-Alias-TM** resource group, and select the **Web-01-ip** Public IP address. Note the IP address for later use. Repeat this step for the **Web-02-ip** public IP address.
1. Select **Create a resource** > **Networking** > **Traffic Manager profile**.
2. For the name, enter **TM-alias-test**. Place it in the **RG-DNS-Alias-TM** resource group.
3. Select **Create**.
4. After deployment finishes, select **Go to resource**.
5. On the Traffic Manager profile page, under **Settings**, select **Endpoints**.
6. Select **Add**.
7. For **Type**, select **External endpoint**, and for **Name**, enter **EP-Web01**.
8. In the **Fully qualified domain name (FQDN) or IP** text box, enter the IP address for **Web-01-ip** that you noted previously.
9. Select the same **Location** as your other resources, and then select **OK**.

Repeat this procedure to add the **Web-02** endpoint by using the IP address you noted previously for **Web-02-ip**.

## Create an alias record

Create an alias record that points to the Traffic Manager profile.

1. Select your Azure DNS zone to open the zone.
2. Select **Record set**.
3. Leave the **Name** text box empty to represent the domain name apex. An example is contoso.com.
4. Leave the **Type** as an **A** record.
5. Select the **Alias Record Set** check box.
6. Select **Choose Azure service**, and select the **TM-alias-test** Traffic Manager profile.

## Test the alias record

1. From a web browser, browse to your domain name apex. An example is contoso.com. You see the IIS default web page. Close the web browser.
2. Shut down the **Web-01** virtual machine. Wait a few minutes for it to completely shut down.
3. Open a new web browser, and browse to your domain name apex again.
4. You see the IIS default web page again, because Traffic Manager handled the situation and directed traffic to **Web-02**.

## Clean up resources

When you no longer need the resources created for this tutorial, delete the **RG-DNS-Alias-TM** resource group.

## Next steps

In this tutorial, you created an alias record to use your apex domain name to reference a Traffic Manager profile. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Host load-balanced web apps at the zone apex](./dns-alias-appservice.md)
