---
title: Hybrid connections 
description: Learn how to create and use hybrid connections in Azure App Service to access resources in disparate networks. 
author: madsd

ms.assetid: 66774bde-13f5-45d0-9a70-4e9536a4f619
ms.topic: article
ms.date: 2/10/2022
ms.author: madsd
ms.custom: "UpdateFrequency3, fasttrack-edit"
---

# Azure App Service Hybrid Connections

Hybrid Connections is both a service in Azure and a feature in Azure App Service. As a service, it has uses and capabilities beyond those that are used in App Service. To learn more about Hybrid Connections and their usage outside App Service, see [Azure Relay Hybrid Connections][HCService].

Within App Service, Hybrid Connections can be used to access application resources in any network that can make outbound calls to Azure over port 443. Hybrid Connections provides access from your app to a TCP endpoint and doesn't enable a new way to access your app. As used in App Service, each Hybrid Connection correlates to a single TCP host and port combination. This enables your apps to access resources on any OS, provided it's a TCP endpoint. The Hybrid Connections feature doesn't know or care what the application protocol is, or what you are accessing. It simply provides network access.  

## How it works ##
Hybrid Connections requires a relay agent to be deployed where it can reach both the desired endpoint as well as to Azure. The relay agent, Hybrid Connection Manager (HCM), calls out to Azure Relay over port 443. From the web app site, the App Service infrastructure also connects to Azure Relay on your application's behalf. Through the joined connections, your app is able to access the desired endpoint. The connection uses TLS 1.2 for security and shared access signature (SAS) keys for authentication and authorization.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-connectiondiagram.png" alt-text="Diagram of Hybrid Connection high-level flow":::

When your app makes a DNS request that matches a configured Hybrid Connection endpoint, the outbound TCP traffic will be redirected through the Hybrid Connection.  

> [!NOTE]
> This means that you should try to always use a DNS name for your Hybrid Connection. Some client software does not do a DNS lookup if the endpoint uses an IP address instead. 
>

### App Service Hybrid Connection benefits ###

There are a number of benefits to the Hybrid Connections capability, including:

- Apps can access on-premises systems and services securely.
- The feature doesn't require an internet-accessible endpoint.
- It's quick and easy to set up. No gateways required.
- Each Hybrid Connection matches to a single host:port combination, helpful for security.
- It normally doesn't require firewall holes. The connections are all outbound over standard web ports.
- Because the feature is network level, it's agnostic to the language used by your app and the technology used by the endpoint.
- It can be used to provide access in multiple networks from a single app. 
- It's supported in GA for Windows apps and Linux apps. It isn't supported for Windows custom containers.

### Things you cannot do with Hybrid Connections ###

Things you cannot do with Hybrid Connections include:

- Mount a drive.
- Use UDP.
- Access TCP-based services that use dynamic ports, such as FTP Passive Mode or Extended Passive Mode.
- Support LDAP, because it can require UDP.
- Support Active Directory, because you cannot domain join an App Service worker. 

## Add and Create Hybrid Connections in your app ##

To create a Hybrid Connection, go to the [Azure portal] and select your app. Select **Networking** > **Configure your Hybrid Connection endpoints**. Here you can see the Hybrid Connections that are configured for your app.  

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-portal.png" alt-text="Screenshot of Hybrid Connection list":::

To add a new Hybrid Connection, select **[+] Add hybrid connection**.  You'll see a list of the Hybrid Connections that you already created. To add one or more of them to your app, select the ones you want, and then select **Add selected Hybrid Connection**.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-addhc.png" alt-text="Screenshot of Hybrid Connection portal":::

If you want to create a new Hybrid Connection, select **Create new hybrid connection**. Specify the: 

- Hybrid Connection name.
- Endpoint hostname.
- Endpoint port.
- Service Bus namespace you want to use.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-createhc.png" alt-text="Screenshot of Create new hybrid connection dialog box":::

Every Hybrid Connection is tied to a Service Bus namespace, and each Service Bus namespace is in an Azure region. It's important to try to use a Service Bus namespace in the same region as your app, to avoid network induced latency.

If you want to remove your Hybrid Connection from your app, right-click it and select **Disconnect**.  

When a Hybrid Connection is added to your app, you can see details on it simply by selecting it. 

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-properties.png" alt-text="Screenshot of Hybrid connections details":::

### Create a Hybrid Connection in the Azure Relay portal ###

In addition to the portal experience from within your app, you can create Hybrid Connections from within the Azure Relay portal. For a Hybrid Connection to be used by App Service, it must:

* Require client authorization.
* Have a metadata item, named endpoint, that contains a host:port combination as the value.

## Hybrid Connections and App Service plans ##

App Service Hybrid Connections are only available in Basic, Standard, Premium, and Isolated pricing SKUs. Hybrid Connections aren't available for function apps in Consumption plans. There are limits tied to the pricing plan.  

| Pricing plan | Number of Hybrid Connections usable in the plan |
|----|----|
| Basic | 5 per plan |
| Standard | 25 per plan |
| Premium (v1-v3) | 220 per app |
| Isolated (v1-v2) | 220 per app |

The App Service plan UI shows you how many Hybrid Connections are being used and by what apps.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-aspproperties.png" alt-text="Screenshot of App Service plan properties":::

Select the Hybrid Connection to see details. You can see all the information that you saw at the app view. You can also see how many other apps in the same plan are using that Hybrid Connection.

There's a limit on the number of Hybrid Connection endpoints that can be used in an App Service plan. Each Hybrid Connection used, however, can be used across any number of apps in that plan. For example, a single Hybrid Connection that is used in five separate apps in an App Service plan counts as one Hybrid Connection.

### Pricing ###

In addition to there being an App Service plan SKU requirement, there's an additional cost to using Hybrid Connections. There's a charge for each listener used by a Hybrid Connection. The listener is the Hybrid Connection Manager. If you had five Hybrid Connections supported by two Hybrid Connection Managers, that would be 10 listeners. For more information, see [Service Bus pricing][sbpricing].

## Hybrid Connection Manager ##

The Hybrid Connections feature requires a relay agent in the network that hosts your Hybrid Connection endpoint. That relay agent is called the Hybrid Connection Manager (HCM). To download HCM, from your app in the [Azure portal], select **Networking** > **Configure your Hybrid Connection endpoints**.

This tool runs on Windows Server 2012 and later. The HCM runs as a service and connects outbound to Azure Relay on port 443.  

After installing HCM, you can run HybridConnectionManagerUi.exe to use the UI for the tool. This file is in the Hybrid Connection Manager installation directory. In Windows 10, you can also just search for *Hybrid Connection Manager UI* in your search box.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-hcm.png" alt-text="Screenshot of Hybrid Connection Manager":::

When you start the HCM UI, the first thing you see is a table that lists all the Hybrid Connections that are configured with this instance of the HCM. If you want to make any changes, first authenticate with Azure. 

To add one or more Hybrid Connections to your HCM:

1. Start the HCM UI.
2. Select **Add a new Hybrid Connection**.
:::image type="content" source="media/app-service-hybrid-connections/hybridconn-hcmadd.png" alt-text="Screenshot of Configure New Hybrid Connections":::

1. Sign in with your Azure account to get your Hybrid Connections available with your subscriptions. The HCM doesn't continue to use your Azure account beyond that. 
1. Choose a subscription.
1. Select the Hybrid Connections that you want the HCM to relay.
:::image type="content" source="media/app-service-hybrid-connections/hybridconn-hcmadded.png" alt-text="Screenshot of Hybrid Connections":::

1. Select **Save**.

You can now see the Hybrid Connections you added. You can also select the configured Hybrid Connection to see details.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-hcmdetails.png" alt-text="Screenshot of Hybrid Connection Details":::

To support the Hybrid Connections it's configured with, HCM requires:

- TCP access to Azure over port 443.
- TCP access to the Hybrid Connection endpoint.
- The ability to do DNS look-ups on the endpoint host and the Service Bus namespace. In other words, the hostname in the Azure relay connection should be resolvable from the machine hosting the HCM.

> [!NOTE]
> Azure Relay relies on Web Sockets for connectivity. This capability is only available on Windows Server 2012 or later. Because of that, HCM is not supported on anything earlier than Windows Server 2012.
>

### Redundancy ###

Each HCM can support multiple Hybrid Connections. Also, any given Hybrid Connection can be supported by multiple HCMs. The default behavior is to route traffic across the configured HCMs for any given endpoint. If you want high availability on your Hybrid Connections from your network, run multiple HCMs on separate machines. The load distribution algorithm used by the Relay service to distribute traffic to the HCMs is random assignment. 

### Manually add a Hybrid Connection ###

To enable someone outside your subscription to host an HCM instance for a given Hybrid Connection, share the gateway connection string for the Hybrid Connection with them. You can see the gateway connection string in the Hybrid Connection properties in the [Azure portal]. To use that string, select **Enter Manually** in the HCM, and paste in the gateway connection string.

:::image type="content" source="media/app-service-hybrid-connections/hybridconn-manual.png" alt-text="Manually add a Hybrid Connection":::

### Upgrade ###

There are periodic updates to the Hybrid Connection Manager to fix issues or provide improvements. When upgrades are released, a popup will show up in the HCM UI. Applying the upgrade will apply the changes and restart the HCM. 

## Adding a Hybrid Connection to your app programmatically ##

There's Azure CLI support for Hybrid Connections. The commands provided operate at both the app and the App Service plan level.  The app level commands are:

```azurecli
az webapp hybrid-connection

Group
    az webapp hybrid-connection : Methods that list, add and remove hybrid-connections from webapps.
        This command group is in preview. It may be changed/removed in a future release.
Commands:
    add    : Add a hybrid-connection to a webapp.
    list   : List the hybrid-connections on a webapp.
    remove : Remove a hybrid-connection from a webapp.
```

The App Service plan commands enable you to set which key a given hybrid-connection will use. There are two keys set on each Hybrid Connection, a primary and a secondary. You can choose to use the primary or secondary key with the below commands. This enables you to switch keys for when you want to periodically regenerate your keys. 

```azurecli
az appservice hybrid-connection --help

Group
    az appservice hybrid-connection : A method that sets the key a hybrid-connection uses.
        This command group is in preview. It may be changed/removed in a future release.
Commands:
    set-key : Set the key that all apps in an appservice plan use to connect to the hybrid-
                connections in that appservice plan.
```

## Secure your Hybrid Connections ##

An existing Hybrid Connection can be added to other App Service Web Apps by any user who has sufficient permissions on the underlying Azure Service Bus Relay. This means if you must prevent others from reusing that same Hybrid Connection (for example when the target resource is a service that doesn't have any additional security measures in place to prevent unauthorized access), you must lock down access to the Azure Service Bus Relay.

Anyone with `Reader` access to the Relay will be able to _see_ the Hybrid Connection when attempting to add it to their Web App in the Azure portal, but they will not be able to _add_ it as they lack the permissions to retrieve the connection string that is used to establish the relay connection. In order to successfully add the Hybrid Connection, they must have the `listKeys` permission (`Microsoft.Relay/namespaces/hybridConnections/authorizationRules/listKeys/action`). The `Contributor` role or any other role that includes this permission on the Relay will allow users to use the Hybrid Connection and add it to their own Web Apps.

## Manage your Hybrid Connections ##

If you need to change the endpoint host or port for a Hybrid Connection, follow the steps below:

1. Remove the Hybrid Connection from the Hybrid Connection Manager on the local machine by selecting the connection and selecting **Remove** at the top left of the Hybrid Connection Details window.
1. Disconnect the Hybrid Connection from your App Service by navigating to **Hybrid Connections** in the App Service **Networking** page.
1. Navigate to the Relay for the endpoint you need to update and select **Hybrid Connections** under **Entities** in the left-hand navigation menu.
1. Select the Hybrid Connection you want to update and select **Properties** under **Settings** in the left-hand navigation menu.
1. Make your changes and hit **Save changes** at the top.
1. Return to the **Hybrid Connections** settings for your App Service and add the Hybrid Connection again. Ensure the endpoint is updated as intended. If you don't see the Hybrid Connection in the list, refresh in 5-10 minutes.
1. Return to the Hybrid Connection Manager on the local machine and add the connection again.

## Troubleshooting ##

The status of "Connected" means that at least one HCM is configured with that Hybrid Connection, and is able to reach Azure. If the status for your Hybrid Connection doesn't say **Connected**, your Hybrid Connection isn't configured on any HCM that has access to Azure. When your HCM shows **Not Connected** there are a few things to check:

* Does your host have outbound access to Azure on port 443? You can test from your HCM host using the PowerShell command *Test-NetConnection Destination -P Port* 
* Is your HCM potentially in a bad state? Try restarting the ‘Azure Hybrid Connection Manager Service" local service.

* Do you have conflicting software installed? Hybrid Connection Manager cannot coexist with Biztalk Hybrid Connection Manager or Service Bus for Windows Server. Hence when installing HCM, any versions of these packages should be removed first.

If your status says **Connected** but your app cannot reach your endpoint then:

* make sure you're using a DNS name in your Hybrid Connection. If you use an IP address then the required client DNS lookup may not happen. If the client running in your web app doesn't do a DNS lookup, then the Hybrid Connection will not work
* check that the DNS name used in your Hybrid Connection can resolve from the HCM host. Check the resolution using *nslookup EndpointDNSname* where EndpointDNSname is an exact match to what is used in your Hybrid Connection definition.
* test access from your HCM host to your endpoint using the PowerShell command *Test-NetConnection EndpointDNSname -P Port*  If you cannot reach the endpoint from your HCM host then check firewalls between the two hosts including any host-based firewalls on the destination host.
* if you're using App Service on Linux, make sure you're not using "localhost" as your endpoint host. Instead, use your machine name if you're trying to create a connection with a resource on your local machine.

In App Service, the **tcpping** command-line tool can be invoked from the Advanced Tools (Kudu) console. This tool can tell you if you have access to a TCP endpoint, but it doesn't tell you if you have access to a Hybrid Connection endpoint. When you use the tool in the console against a Hybrid Connection endpoint, you're only confirming that it uses a host:port combination.  

If you have a command-line client for your endpoint, you can test connectivity from the app console. For example, you can test access to web server endpoints by using curl.

<!--Links-->
[HCService]: /azure/service-bus-relay/relay-hybrid-connections-protocol/
[Azure portal]: https://portal.azure.com/
[oldhc]: /azure/biztalk-services/integration-hybrid-connection-overview/
[sbpricing]: https://azure.microsoft.com/pricing/details/service-bus/
[armclient]: https://github.com/projectkudu/ARMClient/
