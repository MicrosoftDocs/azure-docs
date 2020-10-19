---
title: Connect privately to a web app by using Azure Private Endpoint
description: This article explains how to connect privately to a web app by using Azure Private Endpoint.
author: asudbring
ms.assetid: b8c5c7f8-5e90-440e-bc50-38c990ca9f14
ms.topic: how-to
ms.date: 10/07/2020
ms.author: allensu
ms.service: private-link
ms.workload: web

---

# Connect privately to a web app by using Azure Private Endpoint

Azure Private Endpoint is the fundamental building block for Azure Private Link. By using Private Endpoint, you can connect privately to your web app. In this article, you'll learn how to deploy a web app by using Private Endpoint and then connect to the web app from a virtual machine (VM).

For more information, see [Use private endpoints for an Azure web app][privateendpointwebapp].

> [!Note]
> Private Endpoint is available in public regions for PremiumV2-tier, PremiumV3-tier Windows web apps, Linux web apps, and the Azure Functions Premium plan (sometimes referred to as the Elastic Premium plan). 

## Sign in to the Azure portal

Before you begin, sign in to [the Azure portal](https://portal.azure.com).

## Create a virtual network and virtual machine

In this section, you create a virtual network and subnet to host a VM that you'll use to access a web app through a private endpoint.

### Create the virtual network

To create the virtual network and subnet, do the following:

1. On the left pane, select **Create a resource** > **Networking** > **Virtual network**.

1. On the **Create virtual network** pane, select the **Basics** tab, and then enter the information that's shown here:

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Create Virtual Network" pane in the Azure portal.][1]

1. Select the **IP Addresses** tab, and then enter the information that's shown here:

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "IP Addresses" tab on the Create virtual network pane.][2]

1. In the **subnet** section, select **Add Subnet**, enter the information that's shown here, and then select **Add**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Add subnet" pane.][3]

1. Select **Review + create**.

1. After successful validation, select **Create**.

### Create the virtual machine

To create the virtual machine, do the following:

1. In the Azure portal, on the left pane, select **Create a resource** > **Compute** > **Virtual machine**.

1. On the **Create a virtual machine - Basics** pane, enter the information that's shown here:

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Create a virtual machine" pane.][4]

1. Select **Next: Disks**.

1. On the **Disks** pane, keep the default settings, and then select **Next: Networking**.

1. On the **Networking** pane, enter the information that's shown here:

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Networking" tab on the "Create a virtual machine" pane.][5]

1. Select **Review + create**.

1. After successful validation, select **Create**.

## Create a web app and a private endpoint

In this section, you create a private web app that uses a private endpoint.

> [!Note]
> The Private Endpoint feature is available only for the PremiumV2 and PremiumV3 tier.

### Create the web app

1. In the Azure portal, on the left pane, select **Create a resource** > **Web** > **Web App**.

1. On the **Web App** pane, select the **Basics** tab, and then enter the information that's shown here:

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Basics" tab on the "Web App" pane.][6]

1. Select **Review + create**.

1. After successful validation, select **Create**.

### Create the private endpoint

1. In web app properties, under **Settings**, select **Networking**, and then, under **Private Endpoint connections **, select **Configure your private endpoint connections**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Configure your private endpoint connections" link on the web app Networking pane.][7]

1. In the **Private Endpoint connections** wizard, select **Add**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Add button in the "Private Endpoint connections" wizard.][8]

1. Select the correct information in the **Subscription**, **Virtual network**, and **Subnet** drop-down lists, and then select **OK**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Add Private Endpoint" pane.][9]

1. Monitor the progress of the private endpoint creation.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the progress of adding the private endpoint.][10]
   > ![Screenshot of the newly created private endpoint.][11]

## Connect to the VM from the internet

1. In the Azure portal **Search** box, enter **myVm**.
1. Select **Connect**, and then select **RDP**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "RDP" button on the "myVM" pane.][12]

1. On the **Connect with RDP** pane, select **Download RDP file**.  

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Download RDP File" button on the "Connect with RDP" pane.][13]

   Azure creates a Remote Desktop Protocol (RDP) file and downloads it to your computer.   

1. Open the downloaded RDP file.

   a. At the prompt, select **Connect**.  
   b. Enter the username and password you specified when you created the VM.

     > [!Note]
     > To use these credentials, you might need to select **More choices** > **Use a different account**.

1. Select **OK**.

   > [!Note]
   > If you receive a certificate warning during the sign-in process, select **Yes** or **Continue**.

1. When the VM desktop window appears, minimize it to go back to your local desktop.

## Access the web app privately from the VM

In this section, you connect privately to the web app by using the private endpoint.

1. To get the private IP of your private endpoint, in the **Search** box, type **private link** and then, in the results list, select **Private Link**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the "Private Link" link in the search results list.][14]

1. In Private Link Center, on the left pane, select **Private endpoints** to display your private endpoints.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the private endpoints list in Private Link Center.][15]

1. Select the private endpoint that links to your web app and your subnet.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the properties pane for a private endpoint.][16]

1. Copy the private IP of your private endpoint and the fully qualified domain name (FQDN) of your web app. In the preceding example, the private ID is *`webappdemope.azurewebsites.net 10.10.2.4`*.

1. On the **myVM** pane, verify that the web app is inaccessible through the public IP. To do so, open a browser and paste the web app name. The page should display an "Error 403 - Forbidden" message.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of an "Error 403 - Forbidden" error page.][17]

   For the DNS, do either of the following:
 
   - Use the Azure DNS private zone service.  

     a. Create a DNS private zone named *`privatelink.azurewebsites.net`*, and then link it to the virtual network.  
     b. Create the two A records (that is, the app name and the Service Control Manager [SCM] name) with the IP address of your private endpoint.  
     > [!div class="mx-imgBorder"]
     > ![Screenshot of DNS private zone records.][21]  

   - Use the *hosts* file of the VM.  

     a. Create the hosts entry, open File Explorer, and look for the *hosts* file.  
     > [!div class="mx-imgBorder"]
     > ![Screenshot showing the hosts file in File Explorer.][18]  
     b. Add an entry that contains the private IP address and public name of your web app by editing the *hosts* file in a text editor.  
     > [!div class="mx-imgBorder"]
     > ![Screenshot of the text of the hosts file.][19]  
     c. Save the file.

1. In a browser, type the URL of your web app.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of a browser displaying a web app.][20]

You are now accessing your web app through the private endpoint.

## Clean up resources

When you're done using the private endpoint, the web app, and the VM, delete the resource group and all of the resources it contains.

1. In the Azure portal, in the **Search** box, enter **ready-rg**, and then select **ready-rg** in the results list.

1. Select **Delete resource group**.

1. Under **Type the resource group name**, enter **ready-rg**, and then select **Delete**.

## Next steps

In this article, you created a VM on a virtual network, a web app, and a private endpoint. You connected to a VM from the internet and securely communicated to the web app by using Private Link. 

To learn more about Private Endpoint, see [What is Azure Private Endpoint?][privateendpoint].

<!--Image references-->
[1]: ./media/create-private-endpoint-webapp-portal/createnetwork.png
[2]: ./media/create-private-endpoint-webapp-portal/ipaddresses.png
[3]: ./media/create-private-endpoint-webapp-portal/subnet.png
[4]: ./media/create-private-endpoint-webapp-portal/virtual-machine.png
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
[21]: ./media/create-private-endpoint-webapp-portal/dns-private-zone-records.png


<!--Links-->
[privateendpointwebapp]: https://docs.microsoft.com/azure/app-service/networking/private-endpoint
[privateendpoint]: https://docs.microsoft.com/azure/private-link/private-endpoint-overview
