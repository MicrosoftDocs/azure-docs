---
title: Integrate an Azure Function with an Azure Virtual Network
description: Shows you how to connect a Function in Azure App Service to a new or existing Azure virtual network
services: functions
author: alkarche
manager: jehollan
ms.service: azure-functions
ms.topic: article
ms.date: 12/03/2018
ms.author: alkarche

---
# Integrate an Azure Functions with an Azure Virtual Network
This article shows you how to use Azure Functions to connect to resources in an Azure VNET. For this tutorial we will be deploying a wordpress site on a VM in a private, non-internet accessible, VNET. We will then deploy a Function with access to both the internet and the VNET and access resources off of the wordpress site deployed inside the VNET.
For more information on how the system works, troubleshooting, and advanced configuration, see the resource Integrate your app with an Azure Virtual Network. Azure Functions in the dedicated plan have the same hosting capabilities as web apps, so all the functionality and limitations in that document apply to Functions as well.

## Goal Topology
 ![VNet Integration UI][1]

## Createing a VM inside of a VNET

To start off, we will create a pre-configured VM running Wordpress inside of a VNET. Wordpress on a VM was chosen because it is one of the least expensive resources that can be deployed inside of a VNET.

1.	Go to the Azure Portal
1.	Open the “Create a resource” window
1.	Search for “Wordpress LEMP7 Max Performance on CentOS” and open the creation blade
    1.	http://jetware.io/appliances/jetware/wordpress4_lemp7-170526/profile?us=azure
1.	In the creation blade enter the following information
    1.	Create a new resource group for this VM to make cleaning up your resources easier at the end of the tutorial. I named my Resource Group “Function-VNET-Tutorial”
    1.	Give your virtual machine a unique name. I named mine “VNET-Wordpress”
    1.	Select the region closest to you
    1.	Select your size as B1s (1 vcpu, 1 GB memory)
    1.	For your administrator account, choose “password” and enter a unique username and password. For this tutorial, you will not need to log in to your VM unless you need to troubleshoot.
    1. ![5]
1. Move to the networking tab and enter the following information
    1.	Create a new virtual network
    1.	Enter in your desired private address range and subnet within that address range. For this example, I opted to use the 10.10.0.0/16 network with a subnet of 10.10.1.0/24. This is overprovisioned, as I have 10’s of thousands of unused addresses, but this makes it very easy for me to calculate which subnets are available in the 10.10.0.0/16 network.
    1.	![6]
    1. Back in the Networking tab, set your Public IP to "None." This will deploy your VM with access to only your VNET.
    1. ![7]
6.	Create your VM. This will take approximately 5 minutes.
You will now have a wordpress site deployed entirely within your virtual network. This site is not accessible from the public internet.
Create a Function connected to your VNET
	Normal instructions for creating a dedicated Function
## Connect your Function App to your VNET
1.	In your new Function App, select Platform features > Networking
1.	Configure VNET Integration
1. ![8]
1. ![9]
1. ![10]


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

<!--Links-->
[VNETOverview]: http://azure.microsoft.com/documentation/articles/virtual-networks-overview/ 
