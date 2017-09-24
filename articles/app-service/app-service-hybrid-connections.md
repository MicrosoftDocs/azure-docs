---
title: "Azure App Service Hybrid Connections | Microsoft Docs" 
description: "How to create and use Hybrid Connections to access resources in disparate networks" 
services: app-service
documentationcenter: ''
author: ccompy
manager: stefsch
editor: ''

ms.assetid: 66774bde-13f5-45d0-9a70-4e9536a4f619
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/22/2017
ms.author: ccompy

---

# Azure App Service Hybrid Connections #

## Overview ##

Hybrid Connections is both a service in Azure as well as a feature in the Azure App Service.  As a service it has use and capabilities beyond those that are leveraged in the Azure App Service.  To learn more about Hybrid Connections and their usage outside of the Azure App Service you can start here, [Azure Relay Hybrid Connections][HCService]

Within the Azure App Service, hybrid connections can be used to access application resources in other networks. It provides access FROM your app TO an application endpoint.  It does not enable an alternative capability to access your application.  As used in the App Service, each hybrid connection correlates to a single TCP host and port combination.  This means that the hybrid connection endpoint can be on any operating system and any application provided you are hitting a TCP listening port. Hybrid connections does not know or care what the application protocol is or what you are accessing.  It is simply providing network access.  


## How it works ##
The hybrid connections feature consists of two outbound calls to Service Bus Relay.  There is a connection from a library on the host where your app is running in the app service and then there is a connection from the Hybrid Connection Manager(HCM) to Service Bus relay.  The HCM is a relay service that you deploy within the network hosting 

Through the two joined connections your app has a TCP tunnel to a fixed host:port combination on the other side of the HCM.  The connection uses TLS 1.2 for security and SAS keys for authentication/authorization.    

![][1]

When your app makes a DNS request that matches a configure Hybrid Connection endpoint, then the outbound TCP traffic will be redirected down the hybrid connection.  

> [!NOTE]
> This means that you should try to always use a DNS name for your Hybrid Connection.  Some client software does not do a DNS lookup if the endpoint uses an IP address instead.
>
>

There are two types of hybrid connections, the new hybrid connections that are offered as a service under Azure Relay and the older BizTalk Hybrid Connections.  The older BizTalk Hybrid Connections are referred to as Classic Hybrid Connections in the portal.  There is more information later in this document about them.

### App Service hybrid connection benefits ###

There are a number of benefits to the hybrid connections capability including

- Apps can securely access on premises systems and services securely
- the feature does not require an internet accessible endpoint
- it is quick and easy to set up  
- each hybrid connection matches to a single host:port combination which is an excellent security aspect
- it normally does not require firewall holes as the connections are all outbound over standard web ports
- because the feature is network level that also means that it is agnostic to the language used by your app and the technology used by the endpoint
- it can be used to provide access in multiple networks from a single app 

### Things you cannot do with Hybrid Connections ###

There are a few things you cannot do with hybrid connections and they include:

- mounting a drive
- using UDP
- accessing TCP based services that use dynamic ports such as FTP Passive Mode or Extended Passive Mode
- LDAP support, as it sometimes requires UDP
- Active Directory support

## Adding and Creating a Hybrid Connection in your App ##

Hybrid Connections can be created through the app portal or from the Hybrid Connection service portal.  It is highly recommended that you use the app portal to create the Hybrid Connections you wish to use with your app.  To create a Hybrid Connection go to the [Azure portal][portal] and go into the UI for your app.  Select **Networking > Configure your hybrid connection endpoints**.  From here you can see the Hybrid Connections that are configured with your app  

![][2]

To add a new Hybrid Connection, click Add Hybrid Connection.  The UI that opens up lists the Hybrid Connections that you have already created.  To add one or more of them to your app, click on the ones you want and hit **Add selected hybrid connection**.  

![][3]

If you want to create a new Hybrid Connection, click **Create new hybrid connection**.  From here you specify the: 

- endpoint name
- endpoint hostname
- endpoint port
- servicebus namespace you wish to use

![][4]

Every hybrid connection is tied to a service bus namespace and each service bus namespace is in an Azure region.  It is important to try and use a service bus namespace in the same region as your app so as to avoid network induced latency.

If you want to remove your hybrid connection from your app, right click on it and select **Disconnect**.  

Once a hybrid connection is added to your web app, you can see details on it by simply clicking on it.  

![][5]

## Hybrid Connections and App Service Plans ##

The only hybrid connections you can now make are the new hybrid connections.  They are only available in Basic, Standard, Premium and Isolated pricing SKUs.  There are limits tied to the pricing plan.  

| Pricing Plan | Number of hybrid connections usable in the plan |
|----|----|
| Basic | 5 |
| Standard | 25 |
| Premium | 200 |
| Isolated | 200 |

Since there are App Service Plan restrictions there is also UI in the App Service Plan that shows you how many hybrid connections are being used and by what apps.  

![][6]

Just as with the app view, you can see details on your hybrid connection by clicking on it.  In the properties shown here you can see all the information you had at the app view but can also see how many other apps in the same App Service Plan are using that hybrid connection.

![][7]

While there is a limit on the number of hybrid connection endpoints that can be used in an App Service Plan, each hybrid connection used can be used across any number of apps in that App Service Plan.  That is to say that if I had 1 hybrid connection that I used in 5 separate apps in my App Service Plan, that is still just 1 hybrid connection.

There is an additional cost to hybrid connections beyond being only usable in a Basic, Standard, Premium or Isolated SKU.  For details on hybrid connection pricing please go here: [Service Bus pricing][sbpricing].

## Hybrid Connection Manager ##

In order for hybrid connections to work you need a relay agent in the network that hosts your hybrid connection endpoint.  That relay agent is called the Hybrid Connection Manager (HCM).  This tool can be downloaded from the **Networking > Configure your hybrid connection endpoints** UI available from your app in the [Azure portal][portal].  

This tool runs on Windows server 2008 R2 and later versions of Windows.  Once installed the HCM runs as a service.  This service connects to Azure servicebus relay based on the configured endpoints.  The connections from the HCM are outbound to ports 80 and 443.    

The HCM has a UI to configure it.  After the HCM is installed you can bring up the UI by running the HybridConnectionManagerUi.exe that sits in the Hybrid Connection Manager installation directory.  It is also easily reached on Windows 10 by typing *Hybrid Connection Manager UI* in your search box.  

When the HCM UI is started, the first thing you see is a table that lists all of the hybrid connections that are configured with this instance of the HCM.  If you wish to make any changes you will need to authenticate with Azure. 

To add one or more Hybrid Connections to your HCM:

1. Start the HCM UI
1. Click Configure another hybrid connection
![][8]

1. Sign in with your Azure account
1. Choose a subscription
1. Click on the hybrid connections you want this HCM to relay
![][9]

1. Click Save

At this point you will see the hybrid connections you added.  You can also click on the configured hybrid connection and see details about the connection.

![][10]

For your HCM to be able to support the hybrid connections it is configured with, it needs:

- TCP access to Azure over ports 80 and 443
- TCP access to the hybrid connection endpoint
- ability to do DNS look ups on the endpoint host and the azure servicebus namespace

The HCM supports both new hybrid connections as well as the older BizTalk hybrid connections.

### Redundancy ###

Each HCM can support multiple hybrid connections.  Also, any given hybrid connection can be supported by multiple HCMs.  The default behavior is to round robin traffic across the configured HCMs for any given endpoint.  If you want high availability on your hybrid connections from your network, simply instantiate multiple HCMs on separate machines. 

### Manually adding a hybrid connection ###

If you wish somebody outside of your subscription to host an HCM instance for a given hybrid connection, you can share with them the gateway connection string for the hybrid connection.  You can see this in the properties for a hybrid connection in the [Azure portal][portal]. To use that string, click the **Configure manually** button in the HCM and paste in the gateway connection string.


## Troubleshooting ##

When your hybrid connection is set up with a running application and there is at least one HCM that has that hybrid connection configured, then the status will say **Connected** in the portal.  If it does not say **Connected** then it means that either your app is down or your HCM cannot connect out to Azure on ports 80 or 443.  

The primary reason that clients cannot connect to their endpoint is because the endpoint was specified using an IP address instead of a DNS name.  If your app cannot reach the desired endpoint and you used an IP address, switch to using a DNS name that is valid on the host where the HCM is running.  Other things to check are that the DNS name resolves properly on the host where the HCM is running and that there is connectivity from the host where the HCM is running to the hybrid connection endpoint.  

There is a tool in the App Service that can be invoked from the console called tcpping.  This tool can tell you if you have access to a TCP endpoint but does not tell you if you have access to a hybrid connection endpoint.  When used in the console against a hybrid connection endpoint, a successful ping will only tell you that you have a hybrid connection configured for your app that uses that host:port combination.  

## BizTalk Hybrid Connections ##

The older BizTalk Hybrid Connections capability has been closed off to further BizTalk Hybrid Connection creations.  You can continue using your preexisting BizTalk Hybrid Connections with your apps but should migrate to the new service.  Among the benefits in the new service over the BizTalk version are:

- no additional BizTalk account is required
- TLS is 1.2 instead of 1.0 as in BizTalk Hybrid Connections
- Communication is over ports 80 and 443 using a DNS name to reach Azure instead of IP addresses and a range of additional other ports.  

To add a BizTalk hybrid connection to your app, go to your app in the [Azure portal][portal] and click **Networking > Configure your hybrid connection endpoints**.  In the Classic hybrid connections table click **Add classic hybrid connection**.  From here you will see a list of your BizTalk hybrid connections.  


<!--Image references-->
[1]: ./media/app-service-hybrid-connections/hybridconn-connectiondiagram.png
[2]: ./media/app-service-hybrid-connections/hybridconn-portal.png
[3]: ./media/app-service-hybrid-connections/hybridconn-addhc.png
[4]: ./media/app-service-hybrid-connections/hybridconn-createhc.png
[5]: ./media/app-service-hybrid-connections/hybridconn-properties.png
[6]: ./media/app-service-hybrid-connections/hybridconn-aspproperties.png
[7]: ./media/app-service-hybrid-connections/hybridconn-hcm.png
[8]: ./media/app-service-hybrid-connections/hybridconn-hcmadd.png
[9]: ./media/app-service-hybrid-connections/hybridconn-hcmadded.png
[10]: ./media/app-service-hybrid-connections/hybridconn-hcmdetails.png

<!--Links-->
[HCService]: http://docs.microsoft.com/azure/service-bus-relay/relay-hybrid-connections-protocol/
[portal]: http://portal.azure.com/
[oldhc]: http://docs.microsoft.com/azure/biztalk-services/integration-hybrid-connection-overview/
[sbpricing]: http://azure.microsoft.com/pricing/details/service-bus/

