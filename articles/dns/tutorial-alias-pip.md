---
title: 'Tutorial: Create an Azure DNS alias record to refer to an Azure public IP address'
description: This tutorial shows you how to configure an Azure DNS alias record to reference an Azure public IP address.
services: dns
author: rohinkoul
ms.service: dns
ms.topic: tutorial
ms.date: 04/19/2021
ms.author: rohink
#Customer intent: As an experienced network administrator, I want to configure Azure an DNS alias record to refer to an Azure public IP address.
---

# Tutorial: Configure an alias record to refer to an Azure public IP address 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a network infrastructure.
> * Create a web server virtual machine with a public IP.
> * Create an alias record that points to the public IP.
> * Test the alias record.


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

For instructions to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

The example domain used for this tutorial is contoso.com, but use your own domain name.

## Create the network infrastructure
First, create a virtual network and a subnet to place your web servers in.
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Create a resource** from the left panel of the Azure portal. Enter *resource group* in the search box, and create a resource group named **RG-DNS-Alias-pip**.
3. Select **Create a resource** > **Networking** > **Virtual network**.
4. Create a virtual network named **VNet-Server**. Place it in the **RG-DNS-Alias-pip** resource group, and name the subnet **SN-Web**.

## Create a web server virtual machine
1. Select **Create a resource** > **Windows Server 2016 VM**.
2. Enter **Web-01** for the name, and place the VM in the **RG-DNS-Alias-TM** resource group. Enter a username and password, and select **OK**.
3. For **Size**, select an SKU with 8-GB RAM.
4. For **Settings**, select the **VNet-Servers** virtual network and the **SN-Web** subnet. For public inbound ports, select **HTTP (80)** > **HTTPS (443)** > **RDP (3389)**, and then select **OK**.
5. On the **Summary** page, select **Create**.

This deployment takes a few minutes to complete. The virtual machine will have an attached NIC with a basic dynamic public IP called Web-01-ip. The public IP will change every time the virtual machine is restarted.

### Install IIS

Install IIS on **Web-01**.

1. Connect to **Web-01**, and sign in.
2. On the **Server Manager** dashboard, select **Add roles and features**.
3. Select **Next** three times. On the **Server Roles** page, select **Web Server (IIS)**.
4. Select **Add Features**, and then select **Next**.
5. Select **Next** four times, and then select **Install**. This procedure takes a few minutes to finish.
6. After the installation finishes, select **Close**.
7. Open a web browser. Browse to **localhost** to verify that the default IIS web page appears.

## Create an alias record

Create an alias record that points to the public IP address.

1. Select your Azure DNS zone to open the zone.
2. Select **Record set**.
3. In the **Name** text box, select **web01**.
4. Leave the **Type** as an **A** record.
5. Select the **Alias Record Set** check box.
6. Select **Choose Azure service**, and then select the **Web-01-ip** public IP address.

## Test the alias record

1. In the **RG-DNS-Alias-pip** resource group, select the **Web-01** virtual machine. Note the public IP address.
1. From a web browser, browse to the fully qualified domain name for the Web01-01 virtual machine. An example is **web01.contoso.com**. You now see the IIS default web page.
2. Close the web browser.
3. Stop the **Web-01** virtual machine, and then restart it.
4. After the virtual machine restarts, note the new public IP address for the virtual machine.
5. Open a new browser. Browse again to the fully qualified domain name for the Web01-01 virtual machine. An example is **web01.contoso.com**.

This procedure succeeds because you used an alias record to point to the public IP address resource, not a standard A record.

## Clean up resources

When you no longer need the resources created for this tutorial, delete the **RG-DNS-Alias-pip** resource group.


## Next steps

In this tutorial, you created an alias record to refer to an Azure public IP address. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)
