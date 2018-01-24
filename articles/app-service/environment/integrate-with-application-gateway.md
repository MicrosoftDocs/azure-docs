---
title: Integrating your ILB ASE with an Azure Application Gateway
description: Walkthrough on how to integrate an app in your ILB ASE with your Azure Application Gateway
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
# Integrating your ILB ASE with an Application Gateway #

The [Azure App Service Environment (ASE)](./intro.md) is a deployment of the Azure App Service in the subnet of a customer's Azure Virtual Network. It can be deployed with a public or private endpoint for app access. The deployment of the ASE with a private endpoint is called an ILB ASE.  
The Azure Application Gateway is a virtual appliance that provides layer 7 load balancing, SSL offloading, and WAF protection. It can listen on a public IP address and route traffic to your application endpoint. 
The following information describes how to integrate a WAF configured Application Gateway with an app on an ILB ASE.  

The integration of the Application Gateway with the ILB ASE is at an app level.  When you configure the Application Gateway with your ILB ASE, you are doing it for specific apps in your ILB ASE. This enables hosting secure multi-tenant applications in a single ILB ASE.  

![Application Gateway pointing to app on an ILB ASE][1]

In this walkthrough, you will:

* create an Application Gateway
* configure the Application Gateway to point to an app on your ILB ASE
* configure your app to honor the custom domain name
* edit your public DNS hostname that points to your Application Gateway

To integrate your Application Gateway with your ILB ASE, you need:

* an ILB ASE
* an app running in the ILB ASE
* an internet routable domain name to be used with your app in the ILB ASE
* the ILB address used by your ILB ASE (This is in the ASE portal under **Settings -> IP Addresses**)

	![IP addresses used by your ILB ASE][9]
	
* a public DNS name that is used later to point to your application gateway 

For details on how to create an ILB ASE read the document [Creating and using an ILB ASE][ilbase]

This guide assumes you want an Application Gateway in the same Azure Virtual Network that the ASE is deployed into. Before starting the Application Gateway creation, pick or create a subnet that you will use to host the Application Gateway. You should use a subnet that is not the one named GatewaySubnet, or the subnet used by the ILB ASE.
If you put the Application Gateway in the GatewaySubnet then you will be unable to create a Virtual Network gateway later. You also cannot put it into the subnet used by your ILB ASE as the ASE is the only thing that can be in its subnet.

## Steps to configure ##

1. From within the Azure portal, go to **New > Network > Application Gateway** 
	1. Provide:
		1. Name of the Application Gateway
		1. Select WAF
		1. Select the same subscription used for the ASE VNet
		1. Create or select the resource group
		1. Select the Location the ASE VNet is in

	![New application gateway creation basics][2]	
	1. In the Settings area set:
		1. The ASE VNet
		1. The subnet the Application Gateway needs to be deployed into. Do no use the GatewaySubnet as it will prevent the creation of VPN gateways
		1. Select Public
		1. Select a public IP address. If you do not have one then create one at this time
		1. Configure for HTTP or HTTPS. If configuring for HTTPS you need to provide a PFX certificate
		1. Select Web application fireway settings. Here you can enable the firewall and also set it for either Detection or Prevention as you see fit.

	![New application gateway creation settings][3]
	
	1. In the summary section review, select **Ok**. It can take a little more than 30 minutes for your Application Gateway to complete setup.  

2. After your Application Gateway completes setup, go into your Application Gateway portal. Select **Backend pool**.  Add the ILB address for your ILB ASE.

	![Configure backend pool][4]

3. After the processing completes for configuring your backend pool, select **Health probes**. create a health probe for domain name you want to use for your app. 

	![Configure health probes][5]
	
4. After processing completes for configuring your health probes, select **HTTP settings**.  Edit the existing setting there, select **Use Custom probe**, and pick the probe you configured.

	![Configure HTTP settings][6]
	
5. Go to the Application Gateway **Overview**, and copy the public IP address used for your Application Gateway.  Set that IP address as an A record for your app domain name, or use the DNS name for that address in a CNAME record.  It is easier to select the public IP address and copy it from the Public IP address UI rather than copy it from the link on the Application Gateway Overview section. 

	![Application Gateway portal][7]

6. Set the custom domain name for your app in your ILB ASE.  Go to your app in the portal, and under Settings select **Custom domains**

![Set custom domain name on the app][8]

There is information on setting custom domain names for your web apps here [Setting custom domain names for your web app][custom-domain]. The difference with an app in an ILB ASE and that document, is that there isn't any validation on the domain name.  Since you own the DNS that manages the app endpoints, you can put whatever you want in there. The custom domain name you add in this case does not need to be in your DNS, but it does still need to be configured with your app. 

After setup is completed and you have allowed a short amount of time for your DNS changes to propagate, then you can access your app by the custom domain name you created. 


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
