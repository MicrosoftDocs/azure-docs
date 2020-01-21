---
title: On-premises data gateway for Azure Analysis Services | Microsoft Docs
description: An On-premises gateway is necessary if your Analysis Services server in Azure will connect to on-premises data sources.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 01/17/2020
ms.author: owend
ms.reviewer: minewiskan
---
# Connecting to on-premises data sources with On-premises data gateway

The on-premises data gateway provides secure data transfer between on-premises data sources and your Azure Analysis Services servers in the cloud. In addition to working with multiple Azure Analysis Services servers in the same region, the latest version of the gateway also works with Azure Logic Apps, Power BI, Power Apps, and Power Automate. While the gateway you install is the same across all of these services, Azure Analysis Services and Logic Apps have some additional steps.

Information provided here is specific to how Azure Analysis Services works with the On-premises Data Gateway. To learn more about the gateway in general and how it works with other services, see [What is an on-premises data gateway?](/data-integration/gateway/service-gateway-onprem).

For Azure Analysis Services, getting setup with the gateway the first time is a four-part process:

- **Download and run setup** - This step installs a gateway service on a computer in your organization. You also sign in to Azure using an account in your [tenant's](/previous-versions/azure/azure-services/jj573650(v=azure.100)#what-is-an-azure-ad-tenant) Azure AD. Azure B2B (guest) accounts are not supported.

- **Register your gateway** - In this step, you specify a name and recovery key for your gateway and select a region, registering your gateway with the Gateway Cloud Service. Your gateway resource can be registered in any region, but we recommend it be in the same region as your Analysis Services servers. 

- **Create a gateway resource in Azure** - In this step, you create a gateway resource in an Azure.

- **Connect your servers to your gateway resource** - Once you have a gateway resource, you can begin connecting your servers to it. You can connect multiple servers and other resources, provided they are in the same region.



## <a name="how-it-works"> </a>How it works
The gateway you install on a computer in your organization runs as a Windows service, **On-premises data gateway**. This local service is registered with the Gateway Cloud Service through Azure Service Bus. You then create an On-premises data gateway resource for your Azure subscription. Your Azure Analysis Services servers are then connected to your Azure gateway resource. When models on your server need to connect to your on-premises data sources for queries or processing, a query and data flow traverses the gateway resource, Azure Service Bus, the local on-premises data gateway service, and your data sources. 

![How it works](./media/analysis-services-gateway/aas-gateway-how-it-works.png)

Queries and data flow:

1. A query is created by the cloud service with the encrypted credentials for the on-premises data source. It's then sent to a queue for the gateway to process.
2. The gateway cloud service analyzes the query and pushes the request to the [Azure Service Bus](https://azure.microsoft.com/documentation/services/service-bus/).
3. The on-premises data gateway polls the Azure Service Bus for pending requests.
4. The gateway gets the query, decrypts the credentials, and connects to the data sources with those credentials.
5. The gateway sends the query to the data source for execution.
6. The results are sent from the data source, back to the gateway, and then onto the cloud service and your server.

## Installing

When installing for an Azure Analysis Services environment, it's important you follow the steps described in [Install and configure on-premises data gateway for Azure Analysis Services](analysis-services-gateway-install.md). This article is specific to Azure Analysis Services. It includes additional steps required to setup an On-premises data gateway resource in Azure, and connect your Azure Analysis Services server to the resource.

## Ports and communication settings

The gateway creates an outbound connection to Azure Service Bus. It communicates on outbound ports: TCP 443 (default), 5671, 5672, 9350 through 9354.  The gateway does not require inbound ports.

You may need to include IP addresses for your data region in your firewall. You can download the [Microsoft Azure Datacenter IP list](https://www.microsoft.com/download/details.aspx?id=41653). This list is updated weekly. The IP Addresses listed in the Azure Datacenter IP list are in CIDR notation. To learn more, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

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
| dc.services.visualstudio.com	|443 |Used by AppInsights to collect telemetry. |

### <a name="force-https"></a>Forcing HTTPS communication with Azure Service Bus

You can force the gateway to communicate with Azure Service Bus by using HTTPS instead of direct TCP; however, doing so can greatly reduce performance. You can modify the *Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config* file by changing the value from `AutoDetect` to `Https`. This file is typically located at *C:\Program Files\On-premises data gateway*.

```
<setting name="ServiceBusSystemConnectivityModeString" serializeAs="String">
    <value>Https</value>
</setting>
```

## Next steps 

The following articles are included in the On-premises data gateway general content that applies to all services the gateway supports:

* [On-premises data gateway FAQ](https://docs.microsoft.com/data-integration/gateway/service-gateway-onprem-faq)   
* [Use the on-premises data gateway app](https://docs.microsoft.com/data-integration/gateway/service-gateway-app)   
* [Tenant level administration](https://docs.microsoft.com/data-integration/gateway/service-gateway-tenant-level-admin)
* [Configure proxy settings](https://docs.microsoft.com/data-integration/gateway/service-gateway-proxy)   
* [Adjust communication settings](https://docs.microsoft.com/data-integration/gateway/service-gateway-communication)   
* [Configure log files](https://docs.microsoft.com/data-integration/gateway/service-gateway-log-files)   
* [Troubleshoot](https://docs.microsoft.com/data-integration/gateway/service-gateway-tshoot)
* [Monitor and optimize gateway performance](https://docs.microsoft.com/data-integration/gateway/service-gateway-performance)
