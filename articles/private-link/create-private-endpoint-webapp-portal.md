---
title: Connect privately to a Web App using Azure Private Endpoint
description: Connect privately to a Web App using Azure Private Endpoint
author: ericgre
ms.assetid: b8c5c7f8-5e90-440e-bc50-38c990ca9f14
ms.topic: article
ms.date: 03/12/2020
ms.author: ericg
ms.service: app-service
ms.workload: web

---

# Connect privately to a Web App using Azure Private Endpoint (Preview)

Azure Private Endpoint is the fundamental building block for Private Link in Azure. It allows you to connect privately to your Web App.
In this Quickstart, you will learn how to deploy a Web App with Private Endpoint and connect to this Web App from a Virtual Machine.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Virtual network and Virtual Machine

In this section, you will create the virtual network and the subnet to host the VM that is used to access your Web App through the Private Endpoint.

### Create the virtual network

In this section, you'll create a virtual network and subnet.

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network** or search for **Virtual network** in the search box.

1. In **Create virtual network**, enter or select this information in the Basics tab:

 ![Create Virtual Network][1]

1. Click **"Next: IP Addresses >"** and enter or select this information:

![Configure IP Addresses][2]

1. In the subnet section, click **"+ Add Subnet"** and enter the following information and click **"Add"**

![Add Subnet][3]

1. Click **"Review + create"**

1. After the validation passed, click **"Create"**

### Create virtual machine

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Compute** > **Virtual machine**

1. In Create a virtual machine - Basics, enter or select this information:

![Virtual Machine basic ][4]

1. Select **"Next: Disks"**

Keep default settings.

1. Select **"Next: Networking"**, select this information:

![Networking ][5]

1. Click **"Review + Create"**

1. When the validation passed message, click **"Create"**

## Create your Web App and Private Endpoint

In this section, you will create a private Web App using a Private Endpoint to it.

> [!Note]
>The Private Endpoint feature is only available for the Premium V2 tier, and the Isolated tier with an external App Service Environment (ASE).

### Web App

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Web** > **Web App**

1. In Create Web App - Basics, enter or select this information:

![Web App basic ][6]

1. Select **"Review + create"**

1. When the validation passed message, click **"Create"**

### Create the Private endpoint

1. In the Web App properties, select **Settings** > **Networking** and click on **"Configure your private endpoint connections"**

![Web App networking][7]

1. In the wizard, click **"+ add"**

![Web App Private Endpoint][8]

1. Fill the subscription, VNet, and Subnet information and click **"OK"**

![Web App Networking][9]

1. Review the creation of the private endpoint

![Review][10]
![Final view of the Private endpoint][11]

## Connect to a VM from the internet

1. In the portal's search bar, enter **myVm**
1. Select the **Connect button**. After selecting the Connect button, Connect to virtual machine opens, select **RDP**

![RDP button][12]

1. Azure creates a Remote Desktop Protocol (.rdp) file and downloads it to your computer after you click on **Download RDP file**

![Download RDP file][13]

1. Open the downloaded.rdp file.

- If prompted, select Connect.
- Enter the username and password you specified when creating the VM.

> [!Note]
> You may need to select More choices > Use a different account, to specify the credentials you entered when you created the VM.

- Select OK.

1. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select Yes or Continue.

1. Once the VM desktop appears, minimize it to go back to your local desktop.

## Access Web App privately from the VM

In this section, you will connect privately to the Web App using the Private Endpoint.

1. Get the private IP of your Private Endpoint, in the search bar type **Private Link**, and select Private Link

![Private Link][14]

1. In the Private Link Center, select **Private Endpoints** to list all your Private Endpoints

![Private Link center][15]

1. Select the Private Endpoint link to your Web App and your subnet

![Private endpoint properties][16]

1. Copy the Private IP of your Private Endpoint and the FQDN of your Web App, in our case webappdemope.azurewebsites.net 10.10.2.4

1. In the myVM, verify that the Web App is not accessible through the public IP. Open a browser and copy the Web App name, you must have a 403 forbidden error page

![Forbidden][17]

> [!Note]
> As this feature is in preview, you need to manually manage the DNS entry.

1. Create the host entry, open file explorer and locate the hosts file

![Hosts file][18]

1. Add an entry with the private IP address and the public name of your Web App by editing the hosts file with notepad

![Hosts content][19]

1. Save the file

1. Open a browser and type the url of your web app

![Web site with PE][20]

1. You are accessing to your Web App through the Private Endpoint

## Clean up resources

When you're done using the Private Endpoint, Web App and the VM, delete the resource group and all of the resources it contains:

1. Enter ready-rg in the Search box at the top of the portal and select ready-rg from the search results.
1. Select Delete resource group.
1. Enter ready-rg for TYPE THE RESOURCE GROUP NAME and select Delete.

## Next steps

In this Quickstart, you created a VM on a virtual network, a Web App, and a Private Endpoint. You connected to a VM from the Internet and securely communicated to the Web App using Private Link. To learn more about Private Endpoint, see [What is Azure Private Endpoint][privateendpoint].

<!--Image references-->
[1]: ./media/create-private-endpoint-webapp-portal/createnetwork.png
[2]: ./media/create-private-endpoint-webapp-portal/ipaddresses.png
[3]: ./media/create-private-endpoint-webapp-portal/subnet.png
[4]: ./media/create-private-endpoint-webapp-portal/virtualmachine.png
[5]: ./media/create-private-endpoint-webapp-portal/vmnetwork.png
[6]: ./media/create-private-endpoint-webapp-portal/webapp.png
[7]: ./media/create-private-endpoint-webapp-portal/webappnetworking.png
[8]: ./media/create-private-endpoint-webapp-portal/webapppe.png
[9]: ./media/create-private-endpoint-webapp-portal/webapppenetwork.png
[10]: ./media/create-private-endpoint-webapp-portal/inprogress.png
[11]: ./media/create-private-endpoint-webapp-portal/webapppefinal.png
[12]: ./media/create-private-endpoint-webapp-portal/rdp.png
[13]: ./media/create-private-endpoint-webapp-portal/rdpdownload.png
[14]: ./media/create-private-endpoint-webapp-portal/pl.png
[15]: ./media/create-private-endpoint-webapp-portal/plcenter.png
[16]: ./media/create-private-endpoint-webapp-portal/privateendpointproperties.png
[17]: ./media/create-private-endpoint-webapp-portal/forbidden.png
[18]: ./media/create-private-endpoint-webapp-portal/explorer.png
[19]: ./media/create-private-endpoint-webapp-portal/hosts.png
[20]: ./media/create-private-endpoint-webapp-portal/webappwithpe.png

<!--Links-->
[privateendpoint]: https://docs.microsoft.com/azure/private-link/private-endpoint-overview
