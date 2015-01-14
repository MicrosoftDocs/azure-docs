<properties title="" pageTitle="Integrate Azure Website with Azure VNet" description="Shows you how to connect an Azure Website to a new or existing Azure virtual network" metaKeywords="" services="web-sites, virtual-network" solutions="web,integration,infrastructure" documentationCenter="" authors="cephalin" videoId="" scriptId="" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/24/2014" ms.author="cephalin" />

# Integrate your Azure Website with an Azure Virtual Network #
This document describes the virtual network integration preview feature and shows how to set it up with your Azure Website.  If you are unfamiliar with Azure Virtual Networks, this is a capability that will allow you to build hybrid solutions with your Azure and on-premise resources.  

This integration gives your website access to resources in your virtual network but does not grant access to your website from the virtual network.  Some standard scenarios are where your website needs access to a database or a web services that are running in virtual machines in your VNET or even in your own data center.  It does not allow you to mount a drive.  It also currently does not support enabling integration with authentication systems in your vnet.  The feature is in Preview though and will continue to be improved before reaching GA.

For more details on Azure Virtual Networks see Virtual Network Overview about the use cases and benefits of an Azure Virtual Network.

## Getting Started ##
Here are some things to keep in mind before connecting your site to a virtual network.

1.	Sites can only be connected to a virtual network if they are running on a web hosting plan that’s in the ‘Standard’ pricing tier.  Free, shared, and basic sites cannot connect to a virtual network.
2.	If your target virtual network already exists, it must have point-to-site enabled with a Dynamic routing gateway before it can be connected to a website.  You cannot enable point-to-site VPN if your gateway is configured with Static routing.
3.	You can only have up to 5 networks configured in your web hosting plan.  A website can only be connected to one network at a time.  Those 5 networks can be used by any number of web sites in the same web hosting plan.  

You have the option to connect to a new or existing virtual network.  If you create a new network then a gateway will be pre-configured for you.  Note that creating and configuring a new virtual network will take several minutes.  

If your website is not at a Standard tier then the UI lets you know and gives you access to the pricing tiers should you click it.

![](./media/web-sites-integrate-with-vnet/upgrade-to-standard.png) 

## How the system works ##
Under the covers this feature uses Point-to-Site VPN technology to connect your Azure website to your VNET.  The Azure Websites system architecture is multi-tenant by nature which precludes provisioning websites directly in a VNET as is done with virtual machines.  By building on point-to-site technology we limit network access to just the virtual machine hosting the website.  Access to the network is further restricted on those website hosts so that your websites can only access the networks that you configure them to access.  

The work required to secure your networks to only the websites that need access prevents being able to create SMB connections.  While you can access remote resources this does not include being able to mount a remote drive.

![](./media/web-sites-integrate-with-vnet/how-it-works.png)
 
If you haven’t configured a DNS server with your virtual network you will need to use IP addresses.  Be sure expose the ports for your desired endpoints through your firewall.  When it comes to testing your connection the only method currently available is to use a website or webjob that makes a call to your desired endpoint.  Tools such as ping or nslookup do not currently work through the Kudu console.  This is an area that will be improved in the near future.  

## Connect to a pre-existing network ##
To connect a site to a Virtual Network go to your website’s blade, click the Virtual network tile in the Networking section, and select one of your pre-existing networks.

![](./media/web-sites-integrate-with-vnet/connect-to-existing-vnet.png)
 
The system will then create a certificate to authenticate with your VNET if it is the first website in your subscription to establish a connection to that network.  To see the certificate go to the current portal, navigate to Virtual Networks, select the network and select the Certificates tab.  

In the above image you can see a network named cantConnectVnet that is greyed out and cannot be selected.  There are only a two reasons that this should be the case.  It means that either you do not have point-to-site VPN enabled on your network or you have not provisioned a dynamic routing gateway in your VNET.  When both items are satisfied then you will be able to select the VNET for integration with your website.

## Create and connect to a new VNET ##
In addition to connecting to a pre-existing VNET, you can also create a new VNET from the website UI and automatically connect to it.  To do this follow the same path to reach the Virtual Network UI and select Create new virtual network.  The UI that opens up allows you to name the network, specify the address space and set the addresses for the DNS servers to be used by the virtual network.

![](./media/web-sites-integrate-with-vnet/create-new-vnet.png)
 
The creation of a new virtual network with configured gateways can take up to 30 minutes to complete.  During this time the UI will let you know that it is still working on it and will show the following message.

![](./media/web-sites-integrate-with-vnet/new-vnet-progress.png)

Once the network has been joined to the website, the website will have access to resources in that VNET over TCP or UDP.  If you wish to access resources in your on premise system that are available through Site-to-site VPN to your VNET then you will need to add routes on your own corporate network to allow traffic to go from your network to the Point-to-Site addresses configured in your VNET.

After successfully completing integration, the portal will display basic information about the connection, give a way to disconnect the website from the network and also give you a way to synchronize the certificates used to authenticate the connection.  Synchronization may be required if a certificate has been expired or revoked.  

![](./media/web-sites-integrate-with-vnet/vnet-status-portal.png)

Managing the virtual network connection
You can see a list of all virtual networks currently associated with sites in a web hosting plan by visiting the web hosting plan’s blade.  You can have at most 5 networks associated with a standard web hosting plan.

Should the web hosting plan be scaled into a lower plan such as Free, Shared or Basic then the virtual network connections that are used by the websites in that plan will be disabled.  Should the plan be scaled back up to a Standard plan then those network connections would be re-established.

At this time it is not possible in Azure to take an existing virtual machine and move it into a virtual network.  The virtual machine needs to be provisioned into that virtual network during creation.  

## Accessing on premise resources ##
When working with a VNET that has been configured with Site-to-Site VPN there is an additional step required in order to provide access to your on premise resources from you Azure Website.  Routes need to be added to your on premise network to allow traffic to go from your network to the Point-to-Site addresses configured in your VNET.  To see your IP range for your Point-to-Site connectivity go to the Network area in the current portal as shown here.

![](./media/web-sites-integrate-with-vnet/vpn-to-onpremise.png)

## Certificates ##
In order to establish a secure connection with your VNET, there is an exchange of certificates.  You can see the thumbprint for the public certificate that Azure Websites generates from the current Network portal as shown below.  

![](./media/web-sites-integrate-with-vnet/vpn-to-onpremise-certificate.png)

If the certificates go out of sync for whatever reason, such as accidental deleting it from the Network portal, then connectivity will be broken.  To fix things there is a Sync Connection action in your Websites virtual network UI that will re-establish connectivity.

This action must also be used if you add a DNS to your virtual network or if you add site-to-site VPN to your network.  

![](./media/web-sites-integrate-with-vnet/vnet-sync-connection.png)

## Compare and contrast with Hybrid Connections ##
There is another feature offered by Azure Websites called Hybrid Connections that is similar in some ways to Virtual Network integration.  While there is some use case overlap, neither feature can replace the other.  With Hybrid Connections you can establish connections to multiple application endpoints in a mix of networks.  The Virtual Networks feature connects your website to a VNET which can be connected to your on-premise network.  That works great if your resources are all in the scope of that network.  

Another difference is that you need to install a relay agent for Hybrid Connections to work.  This agent needs to run on a Windows Server instance.  With the Virtual Network feature there is nothing to install and it enables access to remote resources regardless of hosting operating systems.  

There are also pricing tier differences at this time between the two features.  This is because at the least expensive levels the Hybrid Connections feature is extremely useful for dev/test scenarios and only gives access to a small number of endpoints.  The virtual network feature gives you access to everything in the VNET or connected to it.  
