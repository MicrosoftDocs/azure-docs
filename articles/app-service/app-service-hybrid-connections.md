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
ms.date: 10/20/2017
ms.author: ccompy

---

# Azure App Service Hybrid Connections #

Hybrid Connections is both a service in Azure and a feature in the Azure App Service. As a service, it has uses and capabilities beyond those that are used in Azure App Service. To learn more about Hybrid Connections and their usage outside of the Azure App Service, see [Azure Relay Hybrid Connections][HCService].

Within Azure App Service, Hybrid Connections can be used to access application resources in other networks. It provides access from your app to an application endpoint. It does not enable an alternate capability to access your application. As used in App Service, each hybrid connection correlates to a single TCP host and port combination. This means that the hybrid connection endpoint can be on any operating system and any application, provided you are accessing a TCP listening port. The Hybrid Connections feature does not know or care what the application protocol is, or what you are accessing. It is simply providing network access.  


## How it works ##
The Hybrid Connections feature consists of two outbound calls to Azure Service Bus Relay. There is a connection from a library on the host where your app is running in App Service. There is also a connection from the Hybrid Connection Manager (HCM) to Service Bus Relay. The HCM is a relay service that you deploy within the network hosting the resource you are trying to access. 

Through the two joined connections, your app has a TCP tunnel to a fixed host:port combination on the other side of the HCM. The connection uses TLS 1.2 for security and shared access signature (SAS) keys for authentication and authorization.    

![Hybrid connection high level flow][1]

When your app makes a DNS request that matches a configured hybrid connection endpoint, the outbound TCP traffic will be redirected through the hybrid connection.  

> [!NOTE]
> This means that you should try to always use a DNS name for your hybrid connection. Some client software does not do a DNS lookup if the endpoint uses an IP address instead.
>
>

The Hybrid Connections feature has two types: the Hybrid Connections that are offered as a service under Service Bus Relay, and the older Azure BizTalk Services Hybrid Connections. The latter are referred to as Classic Hybrid Connections in the portal. There is more information about them later in this article.

### App Service Hybrid Connection benefits ###

There are a number of benefits to the Hybrid Connections capability, including:

- Apps can securely access on-premises systems and services securely.
- The feature does not require an Internet-accessible endpoint.
- It is quick and easy to set up. 
- Each Hybrid Connection matches to a single host:port combination, which is an excellent security aspect.
- It normally does not require firewall holes as the connections are all outbound over standard web ports.
- Because the feature is network level, it is agnostic to the language used by your app and the technology used by the endpoint.
- It can be used to provide access in multiple networks from a single app. 

### Things you cannot do with Hybrid Connections ###

There are a few things you cannot do with Hybrid Connections, including:

- Mounting a drive
- Using UDP
- Accessing TCP based services that use dynamic ports, such as FTP Passive Mode or Extended Passive Mode
- LDAP support, as it sometimes requires UDP
- Active Directory support

## Adding and Creating a Hybrid Connection in your App ##

Hybrid Connections can be created through your App Service app in the Azure portal or from Azure Relay in the Azure portal.  It is highly recommended that you create Hybrid Connections through the App Service app that you wish to use with the Hybrid Connection.  To create a Hybrid Connection, go to the [Azure portal][portal] and select your app.  Select **Networking > Configure your Hybrid Connection endpoints**.  From here you can see the Hybrid Connections that are configured for your app.  

![Hybrid connection list][2]

To add a new Hybrid Connection, click Add Hybrid Connection.  The UI that opens up lists the Hybrid Connections that you have already created.  To add one or more of them to your app, click on the ones you want and hit **Add selected Hybrid Connection**.  

![Hybrid connection portal][3]

If you want to create a new Hybrid Connection, click **Create new Hybrid Connection**.  From here, you specify the: 

- Endpoint name
- Endpoint hostname
- Endpoint port
- Service Bus namespace you wish to use

![Create a hybrid connection][4]

Every Hybrid Connection is tied to a Service Bus namespace, and each Service Bus namespace is in an Azure region.  It is important to try and use a Service Bus namespace in the same region as your app so as to avoid network induced latency.

If you want to remove your Hybrid Connection from your app, right click on it and select **Disconnect**.  

Once a Hybrid Connection is added to your app, you can see details on it by simply clicking on it. 

![Hybrid Connection details][5]

### Creating a Hybrid Connection in the Azure Relay portal ###

In addition to the portal experience from within your app, there is also an ability to create Hybrid Connections from within the Azure Relay portal. In order for a Hybrid Connection to be used by the Azure App Service it must satisfy two criteria. It must:

* Require Client Authorization
* Have a metadata item named endpoint that contains a host:port combination as the value

## Hybrid Connections and App Service Plans ##

Hybrid Connections are only available in Basic, Standard, Premium, and Isolated pricing SKUs.  There are limits tied to the pricing plan.  

> [!NOTE] 
> You can only create new Hybrid Connections based on Azure Relay. You cannot create new BizTalk Hybrid Connections.
>

| Pricing Plan | Number of Hybrid Connections usable in the plan |
|----|----|
| Basic | 5 |
| Standard | 25 |
| Premium | 200 |
| Isolated | 200 |

Since there are App Service Plan restrictions, there is also UI in the App Service Plan that shows you how many Hybrid Connections are being used and by what apps.  

![App Servie plan level properties][6]

You can see details on your Hybrid Connection by clicking on it.  In the properties shown here, you can see all the information you saw at the app view, and you can also see how many other apps in the same App Service Plan are using that Hybrid Connection.

While there is a limit on the number of Hybrid Connection endpoints that can be used in an App Service Plan, each Hybrid Connection used can be used across any number of apps in that App Service Plan.  In other words, a single Hybrid Connection that is used in 5 separate apps in an App Service Plan counts as 1 Hybrid Connection.

There is an additional cost to using Hybrid Connections.  For details on Hybrid Connection pricing, please go here: [Service Bus pricing][sbpricing].

## Hybrid Connection Manager ##

In order for Hybrid Connections to work, you need a relay agent in the network that hosts your Hybrid Connection endpoint.  That relay agent is called the Hybrid Connection Manager (HCM).  This tool can be downloaded from the **Networking > Configure your Hybrid Connection endpoints** UI available from your app in the [Azure portal][portal].  

This tool runs on Windows server 2012 and later versions of Windows.  Once installed the HCM runs as a service.  This service connects to Azure Service Bus Relay based on the configured endpoints.  The connections from the HCM are outbound to Azure over port 443.    

The HCM has a UI to configure it.  After the HCM is installed, you can bring up the UI by running the HybridConnectionManagerUi.exe that sits in the Hybrid Connection Manager installation directory.  It is also easily reached on Windows 10 by typing *Hybrid Connection Manager UI* in your search box.  

![Hybrid Connection portal][7]

When the HCM UI is started, the first thing you see is a table that lists all of the Hybrid Connections that are configured with this instance of the HCM.  If you wish to make any changes, you will need to authenticate with Azure. 

To add one or more Hybrid Connections to your HCM:

1. Start the HCM UI
1. Click Configure another Hybrid Connection
![Add an HC in the HCM][8]

1. Sign in with your Azure account
1. Choose a subscription
1. Click on the Hybrid Connections you want the HCM to relay
![Select an HC][9]

1. Click Save

At this point, you will see the Hybrid Connections you added.  You can also click on the configured Hybrid Connection and see details about the it.

![HC details][10]

For your HCM to be able to support the Hybrid Connections it is configured with, it needs:

- TCP access to Azure over ports 80 and 443
- TCP access to the Hybrid Connection endpoint
- Ability to do DNS look-ups on the endpoint host and the Azure Service Bus namespace

The HCM supports both new Hybrid Connections, as well as the older BizTalk Hybrid Connections.

> [!NOTE]
> Azure Relay relies on Web Sockets for connectivity. This capability is only available on Windows Server 2012 or newer. Because of that the Hybrid Connection Manager is not supported on anything earlier than Windows Server 2012.
>

### Redundancy ###

Each HCM can support multiple Hybrid Connections.  Also, any given Hybrid Connection can be supported by multiple HCMs.  The default behavior is to round robin traffic across the configured HCMs for any given endpoint.  If you want high availability on your Hybrid Connections from your network, simply instantiate multiple HCMs on separate machines. 

### Manually adding a Hybrid Connection ###

If you wish somebody outside of your subscription to host an HCM instance for a given Hybrid Connection, you can share the gateway connection string for the Hybrid Connection with them.  You can see this in the properties for a Hybrid Connection in the [Azure portal][portal]. To use that string, click the **Enter Manually** button in the HCM and paste in the gateway connection string.


## Troubleshooting ##

The connection status for a Hybrid Connection means that at least one HCM is configured with that Hybrid Conneciton and is able to reach Azure.  If the status for your Hybrid Connection does not say **Connected**, then your Hybrid Connection is not configured on any HCM that has access to Azure.

The primary reason that clients cannot connect to their endpoint is because the endpoint was specified using an IP address instead of a DNS name.  If your app cannot reach the desired endpoint and you used an IP address, switch to using a DNS name that is valid on the host where the HCM is running.  Other things to check are that the DNS name resolves properly on the host where the HCM is running and that there is connectivity from the host where the HCM is running to the Hybrid Connection endpoint.  

There is a tool in App Service that can be invoked from the Advanced Tools (Kudu) console called tcpping.  This tool can tell you if you have access to a TCP endpoint, but it does not tell you if you have access to a Hybrid Connection endpoint.  When used in the console against a Hybrid Connection endpoint, a successful ping will only tell you that you have a Hybrid Connection configured for your app that uses that host:port combination.  

## BizTalk Hybrid Connections ##

The older BizTalk Hybrid Connections capability has been closed off to new BizTalk Hybrid Connections.  You can continue using your existing BizTalk Hybrid Connections with your apps, but should migrate to the new Hybrid Connections that use Azure Relay.  Among the benefits in the new service over the BizTalk version are:

- No additional BizTalk account is required.
- TLS is 1.2 instead of 1.0 as in BizTalk Hybrid Connections.
- Communication is over ports 80 and 443 using a DNS name to reach Azure instead of IP addresses and a range of additional other ports.  

To add an existing BizTalk Hybrid Connection to your app, go to your app in the [Azure portal][portal] and click **Networking > Configure your Hybrid Connection endpoints**.  In the Classic Hybrid Connections table, click **Add Classic Hybrid Connection**.  From here, you will see a list of your BizTalk Hybrid Connections.  


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
