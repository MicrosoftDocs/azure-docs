---
title: Integrate your ILB App Service Environment with an application gateway
description: Walkthrough on how to integrate an app in your ILB App Service Environment with an application gateway
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: a6a74f17-bb57-40dd-8113-a20b50ba3050
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/17/2017
ms.author: ccompy
---
# Integrate your ILB App Service Environment with an application gateway #

The [App Service Environment for PowerApps](./intro.md) is a deployment of Azure App Service in the subnet of a customer's Azure virtual network. It can be deployed with a public or private endpoint for app access. The deployment of the App Service Environment with a private endpoint (that is, an internal load balancer) is called an ILB App Service Environment.  

Azure Application Gateway is a virtual appliance that provides layer 7 load balancing, SSL offloading, and web application firewall (WAF) protection. It can listen on a public IP address and route traffic to your application endpoint. 

The following information describes how to integrate a WAF-configured application gateway with an app in an ILB App Service Environment.  

The integration of the application gateway with the ILB App Service Environment is at an app level. When you configure the application gateway with your ILB App Service Environment, you're doing it for specific apps in your ILB App Service Environment. This technique enables hosting secure multitenant applications in a single ILB App Service Environment.  

![Application gateway pointing to app on an ILB App Service Environment][1]

In this walkthrough, you will:

* Create an application gateway.
* Configure the application gateway to point to an app in your ILB App Service Environment.
* Configure your app to honor the custom domain name.
* Edit the public DNS host name that points to your application gateway.

## Prerequisites

To integrate your application gateway with your ILB App Service Environment, you need:

* An ILB App Service Environment.
* An app running in the ILB App Service Environment.
* An internet routable domain name to be used with your app in the ILB App Service Environment.
* The ILB address that your ILB App Service Environment uses. This information is in the App Service Environment portal under **Settings** > **IP Addresses**:

	![Example list of IP addresses used by the ILB App Service Environment][9]
	
* A public DNS name that is used later to point to your application gateway. 

For details on how to create an ILB App Service Environment, see [Creating and using an ILB App Service Environment][ilbase].

This article assumes that you want an application gateway in the same Azure virtual network where the App Service Environment is deployed. Before you start to create the application gateway, pick or create a subnet that you will use to host the gateway. 

You should use a subnet that is not the one named GatewaySubnet. If you put the application gateway in GatewaySubnet, you'll be unable to create a virtual network gateway later. 

You also cannot put the gateway in the subnet that your ILB App Service Environment uses. The App Service Environment is the only thing that can be in this subnet.

## Configuration steps ##

1. In the Azure portal, go to **New** > **Network** > **Application Gateway**.

2. In the **Basics** area:

   a. For **Name**, enter the name of the application gateway.

   b. For **Tier**, select **WAF**.

   c. For **Subscription**, select the same subscription that the App Service Environment virtual network uses.

   d. For **Resource group**, create or select the resource group.

   e. For **Location**, select the location of the App Service Environment virtual network.

   ![New application gateway creation basics][2]

3. In the **Settings** area:

   a. For **Virtual network**, select the App Service Environment virtual network.

   b. For **Subnet**, select the subnet where the application gateway needs to be deployed. Do not use GatewaySubnet, because it will prevent the creation of VPN gateways.

   c. For **IP address type**, select **Public**.

   d. For **Public IP address**, select a public IP address. If you don't have one, create one now.

   e. For **Protocol**, select **HTTP** or **HTTPS**. If you're configuring for HTTPS, you need to provide a PFX certificate.

   f. For **Web application firewall**, you can enable the firewall and also set it for either **Detection** or **Prevention** as you see fit.

   ![New application gateway creation settings][3]
	
4. In the **Summary** section, review the settings and select **OK**. Your application gateway can take a little more than 30 minutes to complete setup.  

5. After your application gateway completes setup, go to your application gateway portal. Select **Backend pool**. Add the ILB address for your ILB App Service Environment.

   ![Configure backend pool][4]

6. After the process of configuring your back-end pool is completed, select **Health probes**. Create a health probe for the domain name that you want to use for your app. 

   ![Configure health probes][5]
	
7. After the process of configuring your health probes is completed, select **HTTP settings**. Edit the existing settings, select **Use Custom probe**, and pick the probe that you configured.

   ![Configure HTTP settings][6]
	
8. Go to the application gateway's **Overview** section, and copy the public IP address that your application gateway uses. Set that IP address as an A record for your app domain name, or use the DNS name for that address in a CNAME record. It's easier to select the public IP address and copy it from the public IP address's UI rather than copy it from the link in the application gateway's **Overview** section. 

   ![Application gateway portal][7]

9. Set the custom domain name for your app in your ILB App Service Environment. Go to your app in the portal, and under **Settings**, select **Custom domains**.

   ![Set custom domain name on the app][8]

There is information on setting custom domain names for your web apps in the article [Setting custom domain names for your web app][custom-domain]. But for an app in an ILB App Service Environment, there isn't any validation on the domain name. Because you own the DNS that manages the app endpoints, you can put whatever you want in there. The custom domain name that you add in this case does not need to be in your DNS, but it does still need to be configured with your app. 

After setup is completed and you have allowed a short amount of time for your DNS changes to propagate, you can access your app by using the custom domain name that you created. 


<!--IMAGES-->
[1]: ./media/integrate-with-application-gateway/appgw-highlevel.png
[2]: ./media/integrate-with-application-gateway/appgw-createbasics.png
[3]: ./media/integrate-with-application-gateway/appgw-createsettings.png
[4]: ./media/integrate-with-application-gateway/appgw-backendpool.png
[5]: ./media/integrate-with-application-gateway/appgw-healthprobe.png
[6]: ./media/integrate-with-application-gateway/appgw-httpsettings.png
[7]: ./media/integrate-with-application-gateway/appgw-publicip.png
[8]: ./media/integrate-with-application-gateway/appgw-customdomainname.png
[9]: ./media/integrate-with-application-gateway/appgw-iplist.png

<!--LINKS-->
[appgw]: http://docs.microsoft.com/azure/application-gateway/application-gateway-introduction
[custom-domain]: ../app-service-web-tutorial-custom-domain.md
[ilbase]: ./create-ilb-ase.md
