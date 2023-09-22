---
title: Learn about the On-premises data gateway for Azure Analysis Services | Microsoft Docs
description: An On-premises gateway is necessary if your Analysis Services server in Azure will connect to on-premises data sources.
author: minewiskan
ms.service: analysis-services
ms.topic: conceptual
ms.date: 01/27/2023
ms.author: owend
ms.reviewer: minewiskan
---
# Connecting to on-premises data sources with On-premises data gateway

The On-premises data gateway provides secure data transfer between on-premises data sources and your Azure Analysis Services servers in the cloud. In addition to working with multiple Azure Analysis Services servers in the same region, the gateway also works with Azure Logic Apps, Power BI, Power Apps, and Power Automate. While the gateway you install is the same across all of these services, Azure Analysis Services and Logic Apps have some additional steps required for successful installation.

Information provided here is specific to how Azure Analysis Services works with the On-premises data gateway. To learn more about the gateway in general and how it works with other services, see [What is an On-premises data gateway?](/data-integration/gateway/service-gateway-onprem).

For Azure Analysis Services, getting setup with the gateway the first time is a four-part process:

- **Download and run setup** - This step installs a gateway service on a computer in your organization. You also sign in to Azure using an account in your [tenant's](/previous-versions/azure/azure-services/jj573650(v=azure.100)#what-is-an-azure-ad-tenant) Azure AD. Azure B2B (guest) accounts are not supported.

- **Register your gateway** - In this step, you specify a name and recovery key for your gateway and select a region, registering your gateway with the Gateway Cloud Service. Your gateway resource can be registered in any region, but it's recommended it be in the same region as your Analysis Services servers. 

- **Create a gateway resource in Azure** - In this step, you create a gateway resource in Azure.

- **Connect the gateway resource to servers** - Once you have a gateway resource, you can begin connecting your servers to it. You can connect multiple servers and other resources provided they are in the same region.

## Installing

When installing for an Azure Analysis Services environment, it's important you follow the steps described in [Install and configure on-premises data gateway for Azure Analysis Services](analysis-services-gateway-install.md). This article is specific to Azure Analysis Services. It includes additional steps required to setup an On-premises data gateway resource in Azure, and connect your Azure Analysis Services server to the gateway resource.

## Connecting to a gateway resource in a different subscription

It's recommended you create your Azure gateway resource in the same subscription as your server. However, you can configure servers to connect to a gateway resource in another subscription. Connecting to a gateway resource in another subscription isn't supported when configuring existing server settings or creating a new server in the portal, but can be configured by using PowerShell. To learn more, see [Connect gateway resource to server](analysis-services-gateway-install.md#connect-gateway-resource-to-server).

## Ports and communication settings

The gateway creates an outbound connection to Azure Service Bus. It communicates on outbound ports: TCP 443 (default), 5671, 5672, 9350 through 9354.  The gateway doesn't require inbound ports.

You may need to include IP addresses for your data region in your firewall. Download the [Microsoft Azure Datacenter IP list](https://www.microsoft.com/download/details.aspx?id=56519). This list is updated weekly. The IP Addresses listed in the Azure Datacenter IP list are in CIDR notation. To learn more, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

The following are fully qualified domain names used by the gateway.

| Domain names | Outbound ports | Description |
| --- | --- | --- |
| *.powerbi.com |80 |HTTP used to download the installer. |
| *.powerbi.com |443 |HTTPS |
| *.analysis.windows.net |443 |HTTPS |
| *.login.windows.net, login.live.com, aadcdn.msauth.net |443 |HTTPS |
| *.servicebus.windows.net |5671-5672 |Advanced Message Queuing Protocol (AMQP) |
| *.servicebus.windows.net |443, 9350-9354 |Listeners on Service Bus Relay over TCP (requires 443 for Access Control token acquisition) |
| *.frontend.clouddatahub.net |443 |HTTPS |
| *.core.windows.net |443 |HTTPS |
| login.microsoftonline.com |443 |HTTPS |
| *.msftncsi.com |443 |Used to test internet connectivity if the gateway is unreachable by the Power BI service. |
| *.microsoftonline-p.com |443 |Used for authentication depending on configuration. |
| dc.services.visualstudio.com    |443 |Used by AppInsights to collect telemetry. |

## Next steps 

The following articles are included in the On-premises data gateway general content that applies to all services the gateway supports:

* [On-premises data gateway FAQ](/data-integration/gateway/service-gateway-onprem-faq)   
* [Use the on-premises data gateway app](/data-integration/gateway/service-gateway-app)   
* [Tenant level administration](/data-integration/gateway/service-gateway-tenant-level-admin)
* [Configure proxy settings](/data-integration/gateway/service-gateway-proxy)   
* [Adjust communication settings](/data-integration/gateway/service-gateway-communication)   
* [Configure log files](/data-integration/gateway/service-gateway-log-files)   
* [Troubleshoot](/data-integration/gateway/service-gateway-tshoot)
* [Monitor and optimize gateway performance](/data-integration/gateway/service-gateway-performance)
