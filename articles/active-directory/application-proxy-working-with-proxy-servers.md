---
title: Work with existing on-premises proxy servers and Azure AD | Microsoft Docs
description: Covers how to work with existing on-premise Proxy servers.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/12/2017
ms.author: kgremban

---

# Work with existing on-premises proxy servers

This article explains how to configure the Application Proxy connector to work with outbound proxy servers. It is intended for customers with network environments that have existing proxies.

We start by looking at these main deployment scenarios:
* Configuring connectors to bypass your on-premise outbound proxies.
* Configuring connectors to use an outbound proxy to access Azure AD Application Proxy.

For more information about how connectors work, see [How to provide secure remote access to on-premises applications](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-application-proxy-get-started).

## Configure your connectors

The core connector service uses Azure Service Bus to handle some of the underlying communications to the Azure AD Application Proxy service. Service Bus brings with it additional configuration requirements.

For information about resolving Azure AD connectivity problems, see [How to troubleshoot Azure AD Application Proxy connectivity problems](https://blogs.technet.microsoft.com/applicationproxyblog/2015/03/24/how-to-troubleshoot-azure-ad-application-proxy-connectivity-problems). 

## Configure the outbound proxy

If you have an outbound proxy in your environment, ensure that the account doing the install is appropriately configured to use the outbound proxy. As the installer runs in the context of the user doing the install this can be done using Microsoft Edge or other Internet browser. 

To configure the proxy settings using Microsoft Edge, go to Settings, View Advanced Settings, Open Proxy Settings, Manual Proxy Setup. Set "Use a proxy server" to On, check "Don’t use the proxy server for local intranet addresses", and then change the address and port to reflect your local proxy server.

Fill in the necessary proxy settings as shown in the options box below.

 ![AzureAD Bypass local addresses](./media/application-proxy-working-with-proxy-servers/proxy-bypass-local-addresses.png)
 
## Bypass outbound proxies

By default, the underlying OS components used by the connector for making outbound requests automatically attempt to locate a proxy server on the network using Web Proxy Auto-Discovery (WPAD), if it is enabled in the environment.

This typically works by carrying out a DNS lookup for wpad.domainsuffix. If this resolves in DNS, an HTTP request will then be made to the IP address for wpad.dat which will be the proxy configuration script in your environment. The connector will then use this to select an outbound proxy server. However, connector traffic may still not go through, because of additional configuration settings needed on the proxy. 

In the next section, we cover the configuration steps needed on the outbound proxy to make the traffic flow through it. But first, let’s address how you can configure the connector to bypass your on-premises proxy to ensure it uses direct connectivity to the Azure services. This is the recommended way to go (as long as your network policy allows for it), as it means that you have one less configuration to maintain.

To disable outbound proxy usage for the connector, edit the C:\Program Files\Microsoft AAD App Proxy Connector\ApplicationProxyConnectorService.exe.config file and add the [system.net] section shown in the code sample below:

```xml
 <?xml version="1.0" encoding="utf-8" ?>
<configuration>
<system.net>
<defaultProxy enabled="false"></defaultProxy>
</system.net>
 <runtime>
<gcServer enabled="true"/>
  </runtime>
  <appSettings>
<add key="TraceFilename" value="AadAppProxyConnector.log" />
  </appSettings>
</configuration>
```
To ensure that the connector Updater service also bypasses the proxy, make a similar change to the ApplicationProxyConnectorUpdaterService.exe.config file located at C:\Program Files\Microsoft AAD App Proxy Connector Updater\ApplicationProxyConnectorUpdaterService.exe.config.

Please be sure that you make copies of the original files, in the event that you need to revert to the default .config files. 

## Use the outbound proxy server

As mentioned above, in some customer environments there is a requirement for all outbound traffic to go through an outbound proxy without exception. As a result, bypassing the proxy is not an option.

You can configure the connector traffic to go through the outbound proxy as shown below.

 ![AzureAD Bypass local addresses](./media/application-proxy-working-with-proxy-servers/configure-proxy-settings.png)

As a result of having only outbound traffic, there is no need to setup load balancing between the connectors or configure inbound access through your firewalls.

In any case, you will need to perform the following steps:
1. Configure the connector and Updater service to go through the outbound proxy.
2. Configure the proxy settings to permit connections to the Azure AD App proxy service.

### Step 1: Configure the connector and related services to go through the outbound proxy

As covered above, if WPAD is enabled in the environment and configured appropriately, the connector will automatically discover the outbound proxy server and attempt to use it. However, you can explicitly configure the connector to go through an outbound proxy. 

To do so, edit the C:\Program Files\Microsoft AAD App Proxy Connector\ApplicationProxyConnectorService.exe.config file and add the [system.net] section shown in the code sample below:

```xml
 <?xml version="1.0" encoding="utf-8" ?>
<configuration>
<system.net>  
    <defaultProxy>   
      <proxy proxyaddress="http://proxyserver:8080" bypassonlocal="True" usesystemdefault="True"/>   
    </defaultProxy>  
</system.net>
  <runtime>
     <gcServer enabled="true"/>
  </runtime>
  <appSettings>
    <add key="TraceFilename" value="AadAppProxyConnector.log" />
  </appSettings>
</configuration>
```

>[!NOTE]
>Change _proxyserver:8080_ to reflect your local proxy server name or IP address and the port it is listening on.
>

Then you need to configure the connector updater service to use the proxy, by making a similar change to the file located at C:\Program Files\Microsoft AAD App Proxy Connector Updater\ApplicationProxyConnectorUpdaterService.exe.config.

###Step 2: Configure the Proxy to allow traffic from the connector and related services to flow through

There are 4 aspects to consider at the outbound proxy:
* Proxy outbound rules
* Proxy authentication
* Proxy ports
* SSL inspection

#### 2.A: Proxy outbound rules
Allow access to the following endpoints for connector service access:

* *.msappproxy.net 
* *.servicebus.microsoft.net 

For initial registration, allow access to the following end points:

* login.windows.net 
* login.microsoftonline.com. 

The underlying Service Bus control channels used by the connector service additionally require connectivity to specific IP addresses. Note that we are working with the Service Bus team to move to a fully FQDN instead. For now however, there are two options: 
 
* Allow the connector outbound access to all destinations, or
* Allow the connector outbound access to the Azure Datacenter IP Ranges listed at https://www.microsoft.com/en-gb/download/details.aspx?id=41653

>[!NOTE]
>The challenge with using the Azure Datacenter IP Ranges list is that it gets updated weekly, so you will need to put a process in place to ensure your access rules are updated accordingly.
>

#### 2.B: Proxy authentication

Proxy authentication is not currently supported. Our current recommendation is to allow the connector anonymous access to the Internet destinations.

#### 2.C: Proxy ports

The connector makes outbound SSL based connections using the CONNECT method. This essentially sets up a tunnel through the outbound proxy. Some proxy servers by default only allow outbound tunneling to standard SSL ports such as 443. If this is the case, the proxy server will need to be configured to allow tunneling to additional ports.

Configure the proxy server to allow tunneling to non-standard SSL ports 8080, 9090, 9091 and 10100-10120.

>[!NOTE]
>When Service Bus runs over HTTPS, it uses port 443. However, by default, Service Bus will attempt direct TCP connections and will fall back to HTTPS only if direct connectivity fails.> 
> 

To ensure that the Service Bus traffic is also sent through the outbound proxy server you need to ensure that the connector cannot directly connect to the Azure services for ports 9350, 9352 and 5671.

#### 2.D: SSL inspection
Do not use SSL Inspection for the connector traffic as it will cause issues for the connector traffic. 

So that’s it. Now you should see all traffic flowing through the proxy. If you run into issues, the following troubleshooting steps should help.

### Troubleshoot connector Proxy problems and service connectivity issues

The single best way of identifying and troubleshooting connector connectivity issues is to take a Network capture on the connector service while starting the connector service. This can be a daunting task, so let’s look at quick tips on capturing and filtering network traces.

You can use the monitoring tool of your choice. For the purposes of this article, we used Microsoft Network Monitor 3.4, which you can download at https://www.microsoft.com/en-us/download/details.aspx?id=4865.

The examples and filters we use below are specific to Network Monitor, but the principles can be applied to any analysis tool.

### Take a capture using Microsoft Network Monitor

To start a capture, open Network Monitor and click New Capture. Then press the Start button to begin.

 ![AzureAD Network Monitor](./media/application-proxy-working-with-proxy-servers/network-capture.png)

After completing a capture, click the Stop button to end the capture.

### Take a capture of connector traffic

For initial troubleshooting, perform the following steps: 

1. From the services.msc, stop the Microsoft AAD Application Proxy connector service (as show below).
2. Start the Network capture.
3. Start the Microsoft AAD Application Proxy connector service.
4. Stop the Network capture.

 ![AzureAD Network Monitor](./media/application-proxy-working-with-proxy-servers/services-local.png)

### Look at the connector to proxy server requests

Now that you’ve got a network capture, youre ready to filter it. The key to looking at the trace is understanding how to filter the capture.

One filter for this is as follows (where 8080 is the proxy service port): 

(http.Request or http.Response) and tcp.port==8080

If you enter this filter in the Display Filter window and select Apply, it will filter the captured traffic based on the filter.

The above filter will show just the HTTP requests and responses to/from the proxy port. For a connector start-up where the connector is configured to use a proxy server, this would show something like this:

 ![AzureAD Network Monitor](./media/application-proxy-working-with-proxy-servers/http-requests.png)

You now are specifically looking for the CONNECT requests that shows we are talking to the proxy server. Upon success, you will get an HTTP OK (200) response.

If you see other response codes, such as 407 or 502, this indicates that the proxy is requiring authentication or not allowing the traffic for some other reason. At this point you would engage your proxy server support team.

### Identify failed TCP connection attempts

The other common scenario you may be interested in is when the connector is trying to connect directly, but it is failing. 

Another Network Monitor filter that helps you to easily identify this is:

property.TCPSynRetransmit

A SYN packet is the first packet sent to establish a TCP connection. If this doesn’t return a response, then the SYN is reattempted. The above filter allows you to see any re-transmitted SYNs. Then, you can look to see if these correspond to any connector related traffic. 

The following example shows a failed connection attempt to the Service Bus port 9352:

 ![AzureAD Network Monitor](./media/application-proxy-working-with-proxy-servers/failed-connection-attempt.png)

If you see something like the response above, this means that the connector is trying to talk directly to the Azure Service Bus service. If you expect the connector to be making direct connections to the Azure services, then this is a clear indication that you have a network/firewall issue.

>[!NOTE]
>If you are configured to use a proxy server, this may be the Service Bus attempting a direct TCP connection before switching to attempt connecting over HTTPS, so please keep this in mind.
>

Network trace analysis is not for everyone. But it can be a hugely valuable tool to get quick information about what is going on with your network. 

If you continue to struggle with connector connectivity issues, please do create a ticket with our support team, who is happy to assist you with further troubleshooting.

For information about resolving errors  the Application Proxy connector, see [Troubleshoot Application Proxy](https://azure.microsoft.com/en-us/documentation/articles/active-directory-application-proxy-troubleshoot).

## Next Steps

[Understand Azure AD Application Proxy Connectors](application-proxy-understand-connectors.md)<br>
[How to silently install the Azure AD Application Proxy Connector ](active-directory-application-proxy-silent-installation.md)




