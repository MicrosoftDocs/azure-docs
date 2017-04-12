---
title: Install on-premises data gateway - Azure Logic Apps | Microsoft Docs
description: Access on-premises data from logic apps by installing an on-premises data gateway
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 47e3024e-88a0-4017-8484-8f392faec89d
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 07/05/2016
ms.author: jehollan

---
# Install an on-premises data gateway for Azure Logic Apps

The on-premises data gateway supports these connections:

*   BizTalk Server
*   DB2  
*   File System
*   Informix
*   MQ
*   Oracle Database 
*   SAP Application Server 
*   SAP Message Server
*   SharePoint for HTTP only, not HTTPS
*   SQL Server

For more information about these connections, see 
[Connectors for Azure Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list).

## Installation and configuration

### Requirements

Minimum:

* .NET 4.5 Framework
* 64-bit version of Windows 7 or Windows Server 2008 R2 (or later)

Recommended:

* 8 Core CPU
* 8 GB Memory
* 64-bit version of Windows 2012 R2 (or later)

Related considerations:

* Only install the on-premises data gateway on a local machine.
You can't install the gateway on a domain controller.

* Don't install the gateway on a computer that might turn off, go to sleep, 
or doesn't connect to the Internet because the gateway can't run under those circumstances. 
Also, gateway performance might suffer over a wireless network.

* You can only use a work or school email address in Azure, 
so that you can associate the on-premises data gateway 
with your Azure Active Directory-based account.

	If you are using a Microsoft account, like @outlook.com, 
	you can use your Azure account to 
	[create a work or school email address](../virtual-machines/windows/create-aad-work-id.md#locate-your-default-directory-in-the-azure-classic-portal).

### Install the gateway

1.	[Download installer for the on-premises data gateway here](http://go.microsoft.com/fwlink/?LinkID=820931&clcid=0x409).

2.	Specify **On-premises data gateway** as the mode.

3. Sign in with your Azure work or school account. 

4. Set up a new gateway, or you can migrate, restore, or take over an existing gateway.

	To configure a gateway, provide a name for your gateway and a recovery key, 
	then choose **Configure**.
  
	Specify a recovery key that contains at least eight characters, 
	and keep the key in a safe place. You need this key if you want 
	to migrate, restore, or take over the gateway.

	To migrate, restore, or take over an existing gateway, 
	provide the recovery key that was specified when the gateway was created.

### Restart the gateway

The gateway runs as a Windows service, so like any other Windows service, 
you can start and stop the service in multiple ways. 
For example, you can open a command prompt with elevated permissions 
on the machine where the gateway is running, and run either these commands:

* To stop the service, run this command:
  
    `net stop PBIEgwService`

* To start the service, run this command:
  
    `net start PBIEgwService`

### Configure a firewall or proxy

To provide proxy information for your gateway, see 
[Configure proxy settings](https://powerbi.microsoft.com/documentation/powerbi-gateway-proxy/).

You can verify whether your firewall, or proxy, might block 
connections by running the following command from a PowerShell prompt. 
This command tests connectivity to the Azure Service Bus 
and only network connectivity, so the command doesn't have 
anything to do with the cloud server service or the gateway. 
This test helps determine whether your machine can 
actually connect to the internet.

`Test-NetConnection -ComputerName watchdog.servicebus.windows.net -Port 9350`

The results should look similar to this example. If **TcpTestSucceeded** is not true, you might be blocked by a firewall.

```
ComputerName           : watchdog.servicebus.windows.net
RemoteAddress          : 70.37.104.240
RemotePort             : 5672
InterfaceAlias         : vEthernet (Broadcom NetXtreme Gigabit Ethernet - Virtual Switch)
SourceAddress          : 10.120.60.105
PingSucceeded          : False
PingReplyDetails (RTT) : 0 ms
TcpTestSucceeded       : True
```

If you want to be exhaustive, substitute the **ComputerName** and **Port** values with the values listed under 
[Configure ports](#configure-ports) in this topic.

The firewall might also block connections that the Azure Service Bus makes to the Azure data centers. 
If so, approve (unblock) all the IP addresses for those data centers in your region.
You can get a list of [Azure IP addresses here](https://www.microsoft.com/download/details.aspx?id=41653).

### Configure ports
The gateway creates an outbound connection to Azure Service Bus and communicates on outbound ports: 
TCP 443 (default), 5671, 5672, 9350 through 9354. The gateway doesn't require inbound ports.

Learn more about [hybrid solutions](../service-bus-messaging/service-bus-fundamentals-hybrid-solutions.md).

| DOMAIN NAMES | OUTBOUND PORTS | DESCRIPTION |
| --- | --- | --- |
| *.analysis.windows.net | 443 | HTTPS | 
| *.login.windows.net | 443 | HTTPS | 
| *.servicebus.windows.net | 5671-5672 | Advanced Message Queuing Protocol (AMQP) | 
| *.servicebus.windows.net | 443, 9350-9354 | Listeners on Service Bus Relay over TCP (requires 443 for Access Control token acquisition) | 
| *.frontend.clouddatahub.net | 443 | HTTPS | 
| *.core.windows.net | 443 | HTTPS | 
| login.microsoftonline.com | 443 | HTTPS | 
| *.msftncsi.com | 443 | Used to test internet connectivity when the gateway is unreachable by the Power BI service. | 

If you have to approve IP addresses instead of the domains, 
you can download and use the [Microsoft Azure Datacenter IP ranges list](https://www.microsoft.com/download/details.aspx?id=41653). 
In some cases, the Azure Service Bus connections are made with IP Address rather than fully qualified domain names.

### Sign-in accounts

You can sign in with either a work or school account, which is your organization account. 
If you signed up for an Office 365 offering and didn't supply your actual work email, 
your sign-in address might look like jeff@contoso.onmicrosoft.com. 
Your account, within a cloud service, is stored within a 
tenant in Azure Active Directory (Azure AD). 
Usually, your Azure AD account's UPN matches the email address.

### Windows service account

For the Windows service logon credential, 
the on-premises data gateway is set up to use 
NT SERVICE\PBIEgwService. By default, 
the gateway has the right for "Log on as a service", 
within the context of the machine where you installing the gateway.

This service account isn't same account used for connecting to on-premises data sources, 
nor the work or school account that you use to sign in to cloud services.

## How the gateway works
When others interact with an element that's connected to an on-premises data source:

1. The cloud service creates a query, along with the encrypted credentials for the data source, and sends the query to the queue for the gateway to process.
2. The service analyzes the query and pushes the request to the Azure Service Bus.
3. The on-premises data gateway polls the Azure Service Bus for pending requests.
4. The gateway gets the query, decrypts the credentials, and connects to the data source with those credentials.
5. The gateway sends the query to the data source for execution.
6. The results are sent from the data source, back to the gateway, and then to the cloud service. The service then uses the results.

## Frequently asked questions

### General

**Question**: Do I need a gateway for data sources in the cloud, such as SQL Azure? <br/>
**Answer**: No. A gateway connects to on-premises data sources only.

**Question**: What is the actual Windows service called?<br/>
**Answer**: In Services, the gateway is called Power BI Enterprise Gateway Service.

**Question**: Are there any inbound connections to the gateway from the cloud? <br/>
**Answer**: No. The gateway uses outbound connections to Azure Service Bus.

**Question**: What if I block outbound connections? What do I need to open? <br/>
**Answer**: See the ports and hosts that the gateway uses.

**Question**: Does the gateway have to be installed on the same machine as the data source? <br/>
**Answer**: No. The gateway connects to the data source using the connection information that was provided. 
Consider the gateway as a client application in this sense. 
The gateway just needs the capability to connect to the server name that was provided.

**Question**: What is the latency for running queries to a data source from the gateway? What is the best architecture? <br/>
**Answer**: To reduce network latency, install the gateway as close to the data source as possible. 
If you can install the gateway on the actual data source, this proximity minimizes the latency introduced. 
Consider the data centers too. For example, if your service uses the West US datacenter, 
and you have SQL Server hosted in an Azure VM, your Azure VM should be in the West US too. 
This proximity minimizes latency and avoids egress charges on the Azure VM.

**Question**: Are there any requirements for network bandwidth? <br/>
**Answer**: We recommend that your network connection has good throughput. 
Every environment is different, and the amount of data being sent affects the results. 
Using ExpressRoute could help to guarantee a level of throughput between on-premises and the Azure data centers.

You can use the third-party tool Azure Speed Test app to help gauge your throughput.

**Question**: Can the gateway Windows service run with an Azure Active Directory account? <br/>
**Answer**: No. The Windows service must have a valid Windows account. By default, 
the service runs with the Service SID, NT SERVICE\PBIEgwService.

**Question**: How are results sent back to the cloud? <br/>
**Answer**: Results are sent through the Azure Service Bus.

**Question**: Where are my credentials stored? <br/>
**Answer**: The credentials that you enter for a data source are encrypted and stored in the gateway cloud service. 
The credentials are decrypted at the on-premises gateway.

### High availability/disaster recovery
**Question**: Are there any plans for enabling high availability scenarios with the gateway? <br/>
**Answer**: These scenarios are on the roadmap, but we don't have a timeline yet.

**Question**: What options are available for disaster recovery? <br/>
**Answer**: You can use the recovery key to restore or move a gateway. When you install the gateway, specify the recovery key.

**Question**: What is the benefit of the recovery key? <br/>
**Answer**: The recovery key provides a way to migrate or recover your gateway settings after a disaster.

## Troubleshooting

**Question**: Where are the gateway logs? <br/>
**Answer**: See Tools later in this topic.

**Question**: How can I see what queries are being sent to the on-premises data source? <br/>
**Answer**: You can enable query tracing, which includes the queries that are sent. 
Remember to change query tracing back to the original value when done troubleshooting. 
Leaving query tracing turned on creates larger logs.

You can also look at tools that your data source has for tracing queries. 
For example, you can use Extended Events or SQL Profiler for SQL Server and Analysis Services.

### Update to the latest version

Many issues can surface when the gateway version becomes outdated. 
As good general practice, make sure that you use the latest version. 
If you haven't updated the gateway for a month or longer, 
you might consider installing the latest version of the gateway, 
and see if you can reproduce the issue.

### Error: Failed to add user to group. (-2147463168 PBIEgwService Performance Log Users)

You might get this error if you try to install the gateway on a domain controller, which isn't supported. 
Make sure that you deploy the gateway on a machine that isn't a domain controller.

## Tools
### Collect logs from the gateway configurer

You can collect several logs for the gateway. Always start with the logs!

#### Installer logs

`%localappdata%\Temp\Power_BI_Gateway_–Enterprise.log`

#### Configuration logs

`%localappdata%\Microsoft\Power BI Enterprise Gateway\GatewayConfigurator.log`

#### Enterprise gateway service logs

`C:\Users\PBIEgwService\AppData\Local\Microsoft\Power BI Enterprise Gateway\EnterpriseGateway.log`

#### Event logs

You can find the Data Management Gateway and PowerBIGateway logs under **Application and Services Logs**.

### Fiddler Trace

[Fiddler](http://www.telerik.com/fiddler) is a free tool from Telerik that monitors HTTP traffic. 
You can see this traffic with the Power BI service from the client machine. 
This service might show errors and other related information.

## Next Steps
	
* [Connect to on-premises data from logic apps](../logic-apps/logic-apps-gateway-connection.md)
* [Enterprise integration features](../logic-apps/logic-apps-enterprise-integration-overview.md)
* [Connectors for Azure Logic Apps](../connectors/apis-list.md)
