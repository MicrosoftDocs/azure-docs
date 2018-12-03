---
title: Integrate an Azure Function with an Azure Virtual Network
description: Shows you how to connect a Function in Azure App Service to a new or existing Azure virtual network
services: functions
author: alexkarcher-msft
manager: jehollan
ms.service: azure-functions
ms.topic: article
ms.date: 12/03/2018
ms.author: alkarche

---
# Integrate an Azure Functions with an Azure Virtual Network
This article shows you how to use Azure Functions to connect to resources in an Azure VNET. 

For this tutorial we will be deploying a wordpress site on a VM in a private, non-internet accessible, VNET. We will then deploy a Function with access to both the internet and the VNET. We will use that Function to access resources from the wordpress site deployed inside the VNET.

For more information on how the system works, troubleshooting, and advanced configuration, see the document [Integrate your app with an Azure Virtual Network](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet). Azure Functions in the dedicated plan has the same hosting capabilities as web apps, so all the functionality and limitations in that document apply to Functions as well.

## Goal Topology
 ![VNet Integration UI][1]

## Creating a VM inside of a VNET

To start off, we will create a pre-configured VM running Wordpress inside of a VNET. 

Wordpress on a VM was chosen because it is one of the least expensive resources that can be deployed inside of a VNET. Note that this scenario can also work with any resource in a VNET including REST APIs, other Azure Services, App Service environments, etc.

1.	Go to the Azure portal
1.	Add a new resource by opening the “Create a resource” blade
1.	Search for “[Wordpress LEMP7 Max Performance on CentOS](http://jetware.io/appliances/jetware/wordpress4_lemp7-170526/profile?us=azure)” and open its creation blade 
1.	In the creation blade configure the VM with the following information:
    1.	Create a new resource group for this VM to make cleaning up the resources easier at the end of the tutorial. I named my Resource Group “Function-VNET-Tutorial”
    1.	Give the virtual machine a unique name. I named mine “VNET-Wordpress”
    1.	Select the region closest to you
    1.	Select the size as B1s (1 vcpu, 1 GB memory)
    1.	For the administrator account, choose password authentification and enter a unique username and password. For this tutorial, you will not need to sign in to the VM unless you need to troubleshoot.
    1. ![5]
1. Move to the networking tab and enter the following information:
    1.	Create a new virtual network
    1.	Enter in your desired private address range and subnet within that address range. The subnet size will determine how many VMs you can use in the App Service plan. If IP addressing and subnetting are new to you, there is a [document covering the basics](https://support.microsoft.com/en-us/help/164015/understanding-tcp-ip-addressing-and-subnetting-basics). IP addressing and subnetting are important in this scenario, so I'd recommend reading a few articles and watching a few videos online until it makes sense. 
        1. For this example, I opted to use the 10.10.0.0/16 network with a subnet of 10.10.1.0/24. I chose to overprovision and use a /16 subnet because it is easy to calculate which subnets are available in the 10.10.0.0/16 network.
        1. ![6]
    1. Back in the Networking tab, set the Public IP to "None." This will deploy the VM with access to only the VNET.
    1. ![7]
6. Create the VM. This will take approximately 5 minutes.
7. Once the VM is created, visit its networking tab and note the Private IP address for later. The VM should not have a public IP.
    ![14]

You will now have a wordpress site deployed entirely within your virtual network. This site is not accessible from the public internet.

## Create a Dedicated Function App

The next step is to create a Function App inside of a standard or higher App Service Plan. Note that consumption plan Function apps do not support VNET integration.

1. Go to the Azure portal
1. Add a new resource by opening the “Create a resource” blade
1. Select "Serverless Function App"
1. Enter all of your normal information into the creation blade, with one exception:
    1. Select a standard or higher App Service Plan level.
    1. ![2]
1. My completed creating blade looked like the following.
1. ![3]

## Connect your Function App to your VNET

Now we have a wordpress site hosing many files from within a VNET, and will now need to connect the Function app to that VNET.

1.	In the portal for the Function App from the previous step select **Platform features**, then select **Networking**
1.	Select **Click to configure** under VNet Integration
1. ![8]
1. In the VNET integration page, select **Add VNet (preview)**
1. ![9]
    1. Create a new subnet for your Function and App Service plan to use. Note that the subnet size will restrict the total number of VMs you can add to your app service plan. Your VNET will automatically route traffic between the subnets in your VNET, so it does not matter that your Function is in a different subnet from your VM. 
    1. ![10]

## Create a Function that accesses a resource in your VNET

The Function App can now access the VNET with our wordpress site, so we're going to use the function to access that file and serve it back to the user. For this example we'll use a wordpress site as the API, and a Function Proxy as the calling Functions because they are both easy to set up and visualize. You could just as easily use any other API deployed within a VNET, and another Function with code making API calls to that API deployed within your VNET. A SQL server deployed within your VNET is a perfect example.

1. In the portal, open the Function App from the previous step
1. Create a Proxy by selecting  **Proxies** > **+**
    1. ![11]
1. Configure the Proxy name and route. I chose /plant as my route.
1. Fill in your wordpress site's IP from earlier and set the Backend URL to `http://{YOUR VM IP}/wp-content/themes/twentyseventeen/assets/images/header.jpg`
    1. ![12]

Now, if you attempt to visit your backend URL directly by pasting it into a new browser tab, the page should time out. This is to be expected, as your wordpress site is connected to only your VNET and not the internet. If you paste your Proxy URL into the browser you should see a beautiful plant picture, pulled from your Wordpress site inside your VNET. 

Your Function App is connected to both the Internet and your VNET. The proxy is receiving a request over the public internet, and then acting as a simple HTTP proxy to forward that request along into the virtual network. The proxy then relays the response back to you over the public internet. 

![13]

## Next Steps

Azure Functions running on App Service plans are running on the same service as web apps, so all of the documnention for Web Apps will apply to dedicated Functions.

1. [Learn more about VNET integration with App Service / Functions here](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)
1. [Learn more about VNETs in Azure](http://azure.microsoft.com/documentation/articles/virtual-networks-overview/)
1. [Enable for networking features and control with App Service Environments](https://docs.microsoft.com/azure/app-service/environment/intro)
1. [Connect to individual on-premises resources without firewall changes using Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections)
1. [Learn more about Function Proxies](https://review.docs.microsoft.com/azure/azure-functions/functions-proxies)

<!--Image references-->
[1]: ./media/functions-create-vnet/topology.png
[2]: ./media/functions-create-vnet/Create-Function-App.png
[3]: ./media/functions-create-vnet/Create-App-Service-Plan.PNG
[4]: ./media/functions-create-vnet/configure-VNET.png
[5]: ./media/functions-create-vnet/create-VM-1.png
[6]: ./media/functions-create-vnet/create-VM-2.png
[7]: ./media/functions-create-vnet/create-VM-2.1.png
[8]: ./media/functions-create-vnet/Networking-1.png
[9]: ./media/functions-create-vnet/Networking-2.png
[10]: ./media/functions-create-vnet/Networking-3.png
[11]: ./media/functions-create-vnet/New-Proxy.png
[12]: ./media/functions-create-vnet/Create-Proxy.png
[13]: ./media/functions-create-vnet/Plant.png
[14]: ./media/functions-create-vnet/VM-Networking.png