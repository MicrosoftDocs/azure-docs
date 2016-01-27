<properties 
   pageTitle="Configure an application gateway for custom probes using Azure Resource Manager | Microsoft Azure"
   description="This page provides instructions to configure custom probes on Application gateway using Azure  Resource Manager "
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="carmonm"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="11/24/2015"
   ms.author="joaoma"/>

# Health monitoring and custom probes 


Azure Application Gateway monitors the health all resources in its back end pool and automatically removes any resource considered unhealthy from thpool. 

You configure health monitoring by using two types of probes: default health probe and custom probe.

## Default health probe

An application gateway automatically configures a default health probe when you don't set up any custom probe configuration. The monitoring behavior works by making an HTTP request to the IP addresses configured for back end pool, and the port configured in the back end HTTP setting for the application gateway.

For example: You configure your application gateway to use back end servers A, B and C to receive HTTP network traffic on port 80. The default health monitoring tests the three servers every 30 seconds for a healthy HTTP response. A healthy HTTP response has a [status code](https://msdn.microsoft.com/library/aa287675.aspx) between 200 and 399.

If the default probe check fails for server A, the application gateway removes from its back end pool, and network traffic stops flowing to this server. The default probe still continues to check for server A every 30 seconds. When server A responds successfully to one request from a default health probe, it is added back as healthy to the back end pool and traffic starts flowing to the server again.

The default probe uses only the IP addresses to check on the status. If you want to verify health by testing connectivity to a URL, you must use custom probe.


## Custom probe 

Custom probes allow you to have a more granular control over the heath monitoring. When using custom probes you can configure the probe interval check, the URL and path to test, and how many failed responses to accept before marking the back end pool instance as unhealthy.


Custom probe settings:

- **Probe interval** - configures the probe interval checks.
- **Probe timeout** - defines the probe timeout for an HTTP request check.
- **Unhealthy threshold** - specifies how many failed requests is needed to flag the instance as unhealthy.  
- **Host name and path** - If your web site or web farm doesn't have an HTTP response just for the IP address, you need to configure a probe host name and path for a valid healthy HTTP  response. For example: you have a web site http://contoso.com/ but this doesn't yield a valid HTTP response. A host name and path have to be configured to provide the valid healthy HTTP response to validate the web server instance is healthy. In this case, the custom probe can be configured for "http://contoso.com/path/custompath.htm" for probe checks to have successful HTTP response. 



>[AZURE.NOTE] Custom probes can only be configured using PowerShell

