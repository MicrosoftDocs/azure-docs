---
title: On-premises data gateway
description: An On-premises gateway is necessary if your Analysis Services server in Azure will connect to on-premises data sources.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 04/30/2019
ms.author: owend
ms.reviewer: minewiskan
---
# Connecting to on-premises data sources with On-premises Data Gateway
The on-premises data gateway provides secure data transfer between on-premises data sources and your Azure Analysis Services servers in the cloud. In addition to working with multiple Azure Analysis Services servers in the same region, the latest version of the gateway also works with Azure Logic Apps, Power BI, Power Apps, and Microsoft Flow. You can associate multiple services in the same subscription and same region with a single gateway. 

Getting setup with the gateway the first time is a four-part process:

- **Download and run setup** - This step installs a gateway service on a computer in your organization. You also sign in to Azure using an account in your [tenant's](/previous-versions/azure/azure-services/jj573650(v=azure.100)#what-is-an-azure-ad-tenant) Azure AD. Azure B2B (guest) accounts are not supported.

- **Register your gateway** - In this step, you specify a name and recovery key for your gateway and select a region, registering your gateway with the Gateway Cloud Service. Your gateway resource can be registered in any region, but we recommend it be in the same region as your Analysis Services servers. 

- **Create a gateway resource in Azure** - In this step, you create a gateway resource in your Azure subscription.

- **Connect your servers to your gateway resource** - Once you have a gateway resource in your subscription, you can begin connecting your servers to it. You can connect multiple servers and other resources, provided they are in the same subscription and same region.

To get started right away, see [Install and configure on-premises data gateway](analysis-services-gateway-install.md).

## <a name="how-it-works"> </a>How it works
The gateway you install on a computer in your organization runs as a Windows service, **On-premises data gateway**. This local service is registered with the Gateway Cloud Service through Azure Service Bus. You then create a gateway resource Gateway Cloud Service for your Azure subscription. Your Azure Analysis Services servers are then connected to your gateway resource. When models on your server need to connect to your on-premises data sources for queries or processing, a query and data flow traverses the gateway resource, Azure Service Bus, the local on-premises data gateway service, and your data sources. 

![How it works](./media/analysis-services-gateway/aas-gateway-how-it-works.png)

Queries and data flow:

1. A query is created by the cloud service with the encrypted credentials for the on-premises data source. It's then sent to a queue for the gateway to process.
2. The gateway cloud service analyzes the query and pushes the request to the [Azure Service Bus](https://azure.microsoft.com/documentation/services/service-bus/).
3. The on-premises data gateway polls the Azure Service Bus for pending requests.
4. The gateway gets the query, decrypts the credentials, and connects to the data sources with those credentials.
5. The gateway sends the query to the data source for execution.
6. The results are sent from the data source, back to the gateway, and then onto the cloud service and your server.

## <a name="windows-service-account"> </a>Windows Service account
The on-premises data gateway is configured to use *NT SERVICE\PBIEgwService* for the Windows service logon credential. By default, it has the right of Logon as a service; in the context of the machine that you are installing the gateway on. This credential is not the same account used to connect to on-premises data sources or your Azure account.  

If you encounter issues with your proxy server due to authentication, you may want to change the Windows service account to a domain user or managed service account.

## <a name="ports"> </a>Ports
The gateway creates an outbound connection to Azure Service Bus. It communicates on outbound ports: TCP 443 (default), 5671, 5672, 9350 through 9354.  The gateway does not require inbound ports.

We recommend you whitelist the IP addresses for your data region in your firewall. You can download the [Microsoft Azure Datacenter IP list](https://www.microsoft.com/download/details.aspx?id=41653). This list is updated weekly.

> [!NOTE]
> The IP Addresses listed in the Azure Datacenter IP list are in CIDR notation. To learn more, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).
>
>

The following are the fully qualified domain names used by the gateway.

| Domain names | Outbound ports | Description |
| --- | --- | --- |
| *.powerbi.com |80 |HTTP used to download the installer. |
| *.powerbi.com |443 |HTTPS |
| *.analysis.windows.net |443 |HTTPS |
| *.login.windows.net |443 |HTTPS |
| *.servicebus.windows.net |5671-5672 |Advanced Message Queuing Protocol (AMQP) |
| *.servicebus.windows.net |443, 9350-9354 |Listeners on Service Bus Relay over TCP (requires 443 for Access Control token acquisition) |
| *.frontend.clouddatahub.net |443 |HTTPS |
| *.core.windows.net |443 |HTTPS |
| login.microsoftonline.com |443 |HTTPS |
| *.msftncsi.com |443 |Used to test internet connectivity if the gateway is unreachable by the Power BI service. |
| *.microsoftonline-p.com |443 |Used for authentication depending on configuration. |

### <a name="force-https"></a>Forcing HTTPS communication with Azure Service Bus
You can force the gateway to communicate with Azure Service Bus by using HTTPS instead of direct TCP; however, doing so can greatly reduce performance. You can modify the *Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config* file by changing the value from `AutoDetect` to `Https`. This file is typically located at *C:\Program Files\On-premises data gateway*.

```
<setting name="ServiceBusSystemConnectivityModeString" serializeAs="String">
    <value>Https</value>
</setting>
```

## Tenant level administration 

There is currently no single place where tenant administrators  can manage all the gateways that other users have installed and configured.  If you’re a tenant administrator, it's recommended you ask users in your organization to add you as an administrator to every gateway they install. This allows you to manage all the gateways in your organization through the Gateway Settings page or through [PowerShell commands](https://docs.microsoft.com/power-bi/service-gateway-high-availability-clusters#powershell-support-for-gateway-clusters). 


## <a name="faq"></a>Frequently asked questions

### General

**Q**: Do I need a gateway for data sources in the cloud, such as Azure SQL Database? <br/>
**A**: No. A gateway is necessary for connecting to on-premises data sources only.

**Q**: Does the gateway have to be installed on the same machine as the data source? <br/>
**A**: No. The gateway just needs the capability to connect to the server, typically on the same network.

<a name="why-azure-work-school-account"></a>

**Q**: Why do I need to use a work or school account to sign in? <br/>
**A**: You can only use an organizational work or school account when you install the on-premises data gateway. And, that account must be in the same tenant as the subscription you are configuring the gateway resource in. 
Your sign-in account is stored in a tenant that's managed by Azure Active Directory (Azure AD). 
Usually, your Azure AD account's user principal name (UPN) matches the email address.

**Q**: Where are my credentials stored? <br/>
**A**: The credentials that you enter for a data source are encrypted and stored in the Gateway Cloud Service. 
The credentials are decrypted at the on-premises data gateway.

**Q**: Are there any requirements for network bandwidth? <br/>
**A**: It's recommended your network connection has good throughput. 
Every environment is different, and the amount of data being sent affects the results. 
Using ExpressRoute could help to guarantee a level of throughput between on-premises and the Azure datacenters.
You can use the third-party tool Azure Speed Test app to help gauge your throughput.

**Q**: What is the latency for running queries to a data source from the gateway? What is the best architecture? <br/>
**A**: To reduce network latency, install the gateway as close to the data source as possible. 
If you can install the gateway on the actual data source, this proximity minimizes the latency introduced. 
Consider the datacenters too. For example, if your service uses the West US datacenter, 
and you have SQL Server hosted in an Azure VM, your Azure VM should be in the West US too. 
This proximity minimizes latency and avoids egress charges on the Azure VM.

**Q**: How are results sent back to the cloud? <br/>
**A**: Results are sent through the Azure Service Bus.

**Q**: Are there any inbound connections to the gateway from the cloud? <br/>
**A**: No. The gateway uses outbound connections to Azure Service Bus.

**Q**: What if I block outbound connections? What do I need to open? <br/>
**A**: See the ports and hosts that the gateway uses.

**Q**: What is the actual Windows service called?<br/>
**A**: In Services, the gateway is called On-premises data gateway service.

**Q**: Can the gateway Windows service run with an Azure Active Directory account? <br/>
**A**: No. The Windows service must have a valid Windows account. By default, 
the service runs with the Service SID, NT SERVICE\PBIEgwService.

**Q**: How do I takeover a gateway? <br/>
**A**: To takeover a gateway (by running Setup/Change in Control Panel > Programs), you need to be an Owner for the gateway resource in Azure and have the recovery key. Gateway resource Owners are configurable in Access Control.

### <a name="high-availability"></a>High availability and disaster recovery

**Q**: How can we have high-availability?  
**A**: You can install a gateway on another computer to create a cluster. To learn more, see [High availability clusters for On-premises data gateway](https://docs.microsoft.com/power-bi/service-gateway-high-availability-clusters) in the Power BI Gateway docs.

**Q**: What options are available for disaster recovery? <br/>
**A**: You can use the recovery key to restore or move a gateway. 
When you install the gateway, specify the recovery key.

**Q**: What is the benefit of the recovery key? <br/>
**A**: The recovery key provides a way to migrate or recover your gateway settings after a disaster.

## <a name="troubleshooting"> </a>Troubleshooting

**Q**: Why don't I see my gateway in the list of gateway instances when trying to create the gateway resource in Azure? <br/>
**A**: There are two possible reasons. First is a resource is already created for the gateway in the current or some other subscription. To eliminate that possibility, enumerate resources of the type **On-premises Data Gateways** from the portal. Make sure to select all the subscriptions when enumerating all the resources. Once the resource is created, the gateway does not appear in the list of gateway instances in the Create Gateway Resource portal experience. The second possibility is that the Azure AD identity of the user who installed the gateway is different from the user signed in to Azure portal. To resolve, sign in to the portal using the same  account as the user who installed the gateway.

**Q**: How can I see what queries are being sent to the on-premises data source? <br/>
**A**: You can enable query tracing, which includes the queries that are sent. 
Remember to change query tracing back to the original value when done troubleshooting. 
Leaving query tracing turned on creates larger logs.

You can also look at tools that your data source has for tracing queries. 
For example, you can use Extended Events or SQL Profiler for SQL Server and Analysis Services.

**Q**: Where are the gateway logs? <br/>
**A**: See Logs later in this article.

### <a name="update"></a>Update to the latest version

Many issues can surface when the gateway version becomes outdated. 
As good general practice, make sure that you use the latest version. 
If you haven't updated the gateway for a month or longer, 
you might consider installing the latest version of the gateway, 
and see if you can reproduce the issue.

### Error: Failed to add user to group. (-2147463168 PBIEgwService Performance Log Users)

You might get this error if you try to install the gateway on a domain controller, which isn't supported. 
Make sure that you deploy the gateway on a machine that isn't a domain controller.

## <a name="logs"></a>Logs

Log files are an important resource when troubleshooting.

#### Enterprise gateway service logs

`C:\Users\PBIEgwService\AppData\Local\Microsoft\On-premises data gateway\<yyyyymmdd>.<Number>.log`

#### Configuration logs

`C:\Users\<username>\AppData\Local\Microsoft\On-premises data gateway\GatewayConfigurator.log`

#### Event logs

You can find the Data Management Gateway and PowerBIGateway logs under **Application and Services Logs**.

## Next steps
* [Install and configure on-premises data gateway](analysis-services-gateway-install.md).   
* [Manage Analysis Services](analysis-services-manage.md)
* [Get data from Azure Analysis Services](analysis-services-connect.md)
