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

![Diagram of hybrid connection high level flow][1]

When your app makes a DNS request that matches a configured hybrid connection endpoint, the outbound TCP traffic will be redirected through the hybrid connection.  

> [!NOTE]
> This means that you should try to always use a DNS name for your hybrid connection. Some client software does not do a DNS lookup if the endpoint uses an IP address instead.
>
>

The Hybrid Connections feature has two types: the Hybrid Connections that are offered as a service under Service Bus Relay, and the older Azure BizTalk Services Hybrid Connections. The latter are referred to as Classic Hybrid Connections in the portal. There is more information about them later in this article.

### App Service Hybrid Connection benefits ###

There are a number of benefits to the Hybrid Connections capability, including:

- Apps can access on-premises systems and services securely.
- The feature does not require an internet-accessible endpoint.
- It is quick and easy to set up. 
- Each Hybrid Connection matches to a single host:port combination, helpful for security.
- It normally does not require firewall holes. The connections are all outbound over standard web ports.
- Because the feature is network level, it is agnostic to the language used by your app and the technology used by the endpoint.
- It can be used to provide access in multiple networks from a single app. 

### Things you cannot do with Hybrid Connections ###

There are a few things you cannot do with Hybrid Connections, including:

- Mounting a drive.
- Using UDP.
- Accessing TCP-based services that use dynamic ports, such as FTP Passive Mode or Extended Passive Mode.
- Supporting LDAP, as it sometimes requires UDP.
- Supporting Active Directory.

## Add and Create Hybrid Connections in your app ##

You can create Hybrid Connections through your App Service app in the Azure portal, or from Azure Relay in the Azure portal. We recommend that you create Hybrid Connections through the App Service app that you wish to use with the hybrid connection. To create a hybrid connection, go to the [Azure portal][portal] and select your app. Select **Networking > Configure your Hybrid Connection endpoints**. From here you can see the hybrid connections that are configured for your app.  

![Screenshot of hybrid connection list][2]

To add a new hybrid connection, select **Add hybrid connection**.  You'll see a list of the hybrid connections that you have already created. To add one or more of them to your app, select the ones you want, and then select **Add selected Hybrid Connection**.  

![Screenshot of hybrid connection portal][3]

If you want to create a new hybrid connection, select **Create new hybrid connection**. Specify the: 

- Endpoint name
- Endpoint hostname
- Endpoint port
- Service Bus namespace you wish to use

![Screenshot of Create new hybrid connection dialog box][4]

Every hybrid connection is tied to a Service Bus namespace, and each Service Bus namespace is in an Azure region. It's important to try and use a Service Bus namespace in the same region as your app, to avoid network induced latency.

If you want to remove your hybrid connection from your app, right click on it, and select **Disconnect**.  

Once a hybrid connection is added to your app, you can see details on it simply by selecting it. 

![Screenshot of Hybrid connections details][5]

### Create a hybrid connection in the Azure Relay portal ###

In addition to the portal experience from within your app, you can also create hybrid connections from within the Azure Relay portal. For a hybrid connection to be used by the Azure App Service, it must:

* Require client authorization.
* Have a metadata item, named endpoint, that contains a host:port combination as the value.

## Hybrid Connections and Azure App Service plans ##

The Hybrid Connections feature is only available in Basic, Standard, Premium, and Isolated pricing SKUs. There are limits tied to the pricing plan.  

> [!NOTE] 
> You can only create new hybrid connections based on Azure Relay. You cannot create new BizTalk Hybrid Connections.
>

| Pricing plan | Number of hybrid connections usable in the plan |
|----|----|
| Basic | 5 |
| Standard | 25 |
| Premium | 200 |
| Isolated | 200 |

Note that the App Service plan shows you how many hybrid connections are being used and by what apps.  

![Screenshot of App Service plan properties][6]

Select the hybrid connection to see details. You can see all the information you saw at the app view, and you can also see how many other apps in the same plan are using that hybrid connection.

There is a limit on the number of hybrid connection endpoints that can be used in an App Service plan. Each hybrid connection used, however, can be used across any number of apps in that plan. For example, a single hybrid connection that is used in five separate apps in an App Service plan counts as one hybrid connection.

There is an additional cost to using hybrid connections. For details, see [Service Bus pricing][sbpricing].

## Hybrid Connection Manager ##

The Hybrid Connections feature requires a relay agent in the network that hosts your hybrid connection endpoint. That relay agent is called the Hybrid Connection Manager (HCM). To download HCM, from your app in the [Azure portal][portal], select **Networking** > **Configure your Hybrid Connection endpoints**.  

This tool runs on Windows Server 2012 and later. Once installed, HCM runs as a service that connects to Azure Service Bus Relay, based on the configured endpoints. The connections from HCM are outbound to Azure over port 443.    

After installing HCM, you can run HybridConnectionManagerUi.exe to use the UI for the tool. This file is in the Hybrid Connection Manager installation directory. In Windows 10, you can also just search for *Hybrid Connection Manager UI* in your search box.  

![Screenshot of Hybrid Connection Manager][7]

When you start the HCM UI, the first thing you see is a table that lists all of the hybrid connections that are configured with this instance of the HCM. If you wish to make any changes, first authenticate with Azure. 

To add one or more hybrid connections to your HCM:

1. Start the HCM UI.
1. Select **Configure another Hybrid Connection**.
![Screenshot of Configure New Hybrid Connections][8]

1. Sign in with your Azure account.
1. Choose a subscription.
1. Select the hybrid connections you want the HCM to relay.
![Screenshot of hybrid connections][9]

1. Select **Save**.

You can now see the hybrid connections you added. You can also select the configured hybrid connection to see details.

![Screenshot of Hybrid Connection Details][10]

To support the hybrid connections it is configured with, HCM requires:

- TCP access to Azure over ports 80 and 443.
- TCP access to the hybrid connection endpoint.
- The ability to do DNS look-ups on the endpoint host and the Service Bus namespace.

HCM supports both new Hybrid Connections, and BizTalk Hybrid Connections.

> [!NOTE]
> Azure Relay relies on Web Sockets for connectivity. This capability is only available on Windows Server 2012 or later. Because of that, HCM is not supported on anything earlier than Windows Server 2012.
>

### Redundancy ###

Each HCM can support multiple hybrid connections. Also, any given hybrid connection can be supported by multiple HCMs. The default behavior is to route traffic across the configured HCMs for any given endpoint. If you want high availability on your hybrid connections from your network, run multiple HCMs on separate machines. 

### Manually add a hybrid connection ###

To enable someone outside of your subscription to host an HCM instance for a given hybrid connection, share the gateway connection string for the hybrid connection with them. You can see this in the properties for a hybrid connection in the [Azure portal][portal]. To use that string, select **Enter Manually** in the HCM, and paste in the gateway connection string.


## Troubleshooting ##

The status of "Connected" means that at least one HCM is configured with that hybrid connection, and is able to reach Azure. If the status for your Hybrid Connection does not say **Connected**, your hybrid connection is not configured on any HCM that has access to Azure.

The primary reason that clients cannot connect to their endpoint is because the endpoint was specified by using an IP address instead of a DNS name. If your app cannot reach the desired endpoint and you used an IP address, switch to using a DNS name that is valid on the host where the HCM is running. Also check that the DNS name resolves properly on the host where the HCM is running. Confirm that there is connectivity from the host where the HCM is running to the hybrid connection endpoint.  

In App Service, the tcpping tool can be invoked from the Advanced Tools (Kudu) console. This tool can tell you if you have access to a TCP endpoint, but it does not tell you if you have access to a hybrid connection endpoint. When you use the tool in the console against a hybrid connection endpoint, you are only confirming that it uses a host:port combination.  

## BizTalk Hybrid Connections ##

The older BizTalk Hybrid Connections capability has been closed to new BizTalk Hybrid Connections. You can continue using your existing BizTalk Hybrid Connections with your apps, but you should migrate to the new Hybrid Connections that use Azure Relay. Among the benefits in the new service over the BizTalk version are:

- No additional BizTalk account is required.
- TLS is version 1.2 instead of version 1.0.
- Communication is over ports 80 and 443, and uses a DNS name to reach Azure, instead of IP addresses and a range of additional other ports.  

To add an existing BizTalk Hybrid Connection to your app, go to your app in the [Azure portal][portal], and select **Networking** > **Configure your Hybrid Connection endpoints**. In the Classic Hybrid Connections table, select **Add Classic Hybrid Connection**. You can then see a list of your BizTalk Hybrid Connections.  


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
