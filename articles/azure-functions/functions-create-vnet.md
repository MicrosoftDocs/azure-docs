---
title: Integrate Azure Functions with an Azure Virtual Network
description: A step by step tutorial showing you how to connect a Function to an Azure virtual network
services: functions
author: alexkarcher-msft
manager: jehollan
ms.service: azure-functions
ms.topic: article
ms.date: 4/11/2019
ms.author: alkarche

---
# Integrate a function app with an Azure virtual network

This tutorial shows you how to use Azure Functions to connect to resources in an Azure VNET.

For this tutorial we will be deploying a WordPress site on a VM in a private, non-internet accessible, VNET. We will then deploy a Function with access to both the internet and the VNET. We will use that Function to access resources from the WordPress site deployed inside the VNET.

For more information on how the system works, troubleshooting, and advanced configuration, see the document [Integrate your app with an Azure Virtual Network](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet). Azure Functions in the Premium plan have the same hosting capabilities as web apps, so all the functionality and limitations in that document apply to Functions as well.

## Topology

 ![VNet Integration UI][1]

## Creating a VM inside of a VNET

To start off, we will create a pre-configured VM running Wordpress inside of a VNET. 

Wordpress on a VM was chosen because it is one of the least expensive resources that can be deployed inside of a VNET. Note that this scenario can also work with any resource in a VNET, such as REST APIs, App Service environments, and other Azure services.

1. Go to the Azure portal
2. Add a new resource by opening the “Create a resource” blade
3. Search for “[WordPress LEMP7 Max Performance on CentOS](https://jetware.io/appliances/jetware/wordpress4_lemp7-170526/profile?us=azure)” and open its creation blade 
4. In the creation blade configure the VM with the following information:
    1. Create a new resource group for this VM to make cleaning up the resources easier at the end of the tutorial. I named my Resource Group “Function-VNET-Tutorial”
    1. Give the virtual machine a unique name. I named mine “VNET-Wordpress”
    1. Select the region closest to you
    1. Select the size as B1s (1 vcpu, 1 GB memory)
    1. For the administrator account, choose password authentication and enter a unique username and password. For this tutorial, you will not need to sign in to the VM unless you need to troubleshoot.
    
        ![Create VM Basics tab](./media/functions-create-vnet/create-vm-1.png)

1. Move to the networking tab and enter the following information:
    1.	Create a new virtual network
    1.	Enter in your desired private address range and subnet within that address range. The subnet size will determine how many VMs you can use in the App Service plan. If IP addressing and subnetting are new to you, there is a [document covering the basics](https://support.microsoft.com/en-us/help/164015/understanding-tcp-ip-addressing-and-subnetting-basics). IP addressing and subnetting are important in this scenario, so I'd recommend reading a few articles and watching a few videos online until it makes sense. 
        1. For this example, I opted to use the 10.10.0.0/16 network with a subnet of 10.10.1.0/24. I chose to overprovision and use a /16 subnet because it is easy to calculate which subnets are available in the 10.10.0.0/16 network.
        
        <img src="./media/functions-create-vnet/create-vm-2.png" width="700">

1. Back in the Networking tab, set the Public IP to "None." This will deploy the VM with access to only the VNET.
       
    <img src="./media/functions-create-vnet/create-vm-2-1.png" width="700">

7. Create the VM. This will take approximately 5 minutes.
8. Once the VM is created, visit its networking tab and note the Private IP address for later. The VM should not have a public IP.

    ![14]

You will now have a wordpress site deployed entirely within your virtual network. This site is not accessible from the public internet.

## Create a Premium plan Function App

The next step is to create a function app in a premium plan. The premium plan is a new offering that brings serverless scale with all of the benefits of a dedicated App Service Plan. Consumption plan function apps do not support VNet integration.

[!INCLUDE [functions-premium-create](../../includes/functions-premium-create.md)]  

## Connect your Function App to your VNET

With a WordPress site hosing files from within your VNET, you can now connect the function app to the VNET.

1.	In the portal for the Function App from the previous step select **Platform features**, then select **Networking**

    <img src="./media/functions-create-vnet/networking-0.png" width="850">

1.	Select **Click to configure** under VNet Integration

    ![Configure network feature status](./media/functions-create-vnet/Networking-1.png)

1. In the VNET integration page, select **Add VNet (preview)**

    <img src="./media/functions-create-vnet/networking-2.png" width="600"> 
    
1.  Create a new subnet for your Function and App Service plan to use. Note that the subnet size will restrict the total number of VMs you can add to your app service plan. Your VNET will automatically route traffic between the subnets in your VNET, so it does not matter that your Function is in a different subnet from your VM. 
    
    <img src="./media/functions-create-vnet/networking-3.png" width="600">

## Create a Function that accesses a resource in your VNET

The Function App can now access the VNET with our wordpress site, so we're going to use the function to access that file and serve it back to the user. For this example we'll use a wordpress site as the API, and a Function Proxy as the calling Functions because they are both easy to set up and visualize. You could just as easily use any other API deployed within a VNET, and another Function with code making API calls to that API deployed within your VNET. A SQL server deployed within your VNET is a perfect example.

1. In the portal, open the Function App from the previous step
1. Create a Proxy by selecting  **Proxies** > **+**

    <img src="./media/functions-create-vnet/new-proxy.png" width="250">

1. Configure the Proxy name and route. I chose /plant as my route.
1. Fill in your wordpress site's IP from earlier and set the Backend URL to `http://{YOUR VM IP}/wp-content/themes/twentyseventeen/assets/images/header.jpg`
    
    <img src="./media/functions-create-vnet/create-proxy.png" width="900">

Now, if you attempt to visit your backend URL directly by pasting it into a new browser tab, the page should time out. This is to be expected, as your wordpress site is connected to only your VNET and not the internet. If you paste your Proxy URL into the browser you should see a beautiful plant picture, pulled from your Wordpress site inside your VNET. 

Your Function App is connected to both the Internet and your VNET. The proxy is receiving a request over the public internet, and then acting as a simple HTTP proxy to forward that request along into the virtual network. The proxy then relays the response back to you over the public internet. 

<img src="./media/functions-create-vnet/plant.png" width="900">

## Next Steps

Functions running in a Premium plan share the same underlying App Service infrastructure as Web Apps on PV2 plans. This means that all of the documentation for Web Apps applies to your Premium plan functions.

1. [Learn more about the networking options in functions here](./functions-networking-options.md)
1. [Read the Functions networking FAQ here](./functions-networking-faq.md)
1. [Learn more about VNETs in Azure](../virtual-network/virtual-networks-overview.md)
1. [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
1. [Connect to individual on-premises resources without firewall changes using Hybrid Connections](../app-service/app-service-hybrid-connections.md)
1. [Learn more about Function Proxies](./functions-proxies.md)

<!--Image references-->
[1]: ./media/functions-create-vnet/topology.png
[2]: ./media/functions-create-vnet/create-function-app.png
[3]: ./media/functions-create-vnet/create-app-service-plan.png
[4]: ./media/functions-create-vnet/configure-vnet.png
[5]: ./media/functions-create-vnet/create-vm-1.png
[6]: ./media/functions-create-vnet/create-vm-2.png
[7]: ./media/functions-create-vnet/create-vm-2-1.png
[8]: ./media/functions-create-vnet/networking-1.png
[9]: ./media/functions-create-vnet/networking-2.png
[10]: ./media/functions-create-vnet/networking-3.png
[11]: ./media/functions-create-vnet/new-proxy.png
[12]: ./media/functions-create-vnet/create-proxy.png
[14]: ./media/functions-create-vnet/vm-networking.png
