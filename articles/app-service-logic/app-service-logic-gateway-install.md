<properties
   pageTitle="Logic Apps install on-premises data gateway  | Microsoft Azure"
   description="Information on how to install the on-premises data gateway for use in a logic app."
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="07/05/2016"
   ms.author="jehollan"/>

# Install the on-premises data gateway for Logic Apps

## Installation and Configuration

### Prerequisites

Minimum:

* .NET 4.5 Framework
* 64-bit version of Windows 7 or Windows Server 2008 R2 (or later)

Recommended:

* 8 Core CPU
* 8 GB Memory
* 64-bit version of Windows 2012 R2 (or later)

Related considerations:

* You can't install a gateway on a domain controller.
* You shouldn't install a gateway on a computer, such a laptop, that may be turned off, asleep, or not connected to the Internet because the gateway can't run under any of those circumstances. In addition, gateway performance might suffer over a wireless network.

### Install a gateway

You can get the [installer for the on-premises data gateway here](http://go.microsoft.com/fwlink/?LinkID=820931&clcid=0x409).

Specify **On-premises data gateway** as the mode, sign in with your work or school account, and then either configure a new gateway or migrate, restore, or take over an existing gateway.

* To configure a gateway, type a **name** for it and a **recovery key**, and then click or tap **Configure**.

    Specify a recovery key that contains at least eight characters, and keep it in a safe place. You'll need this key if you want to migrate, restore, or take over its gateway.

* To migrate, restore, or take over an existing gateway, provide the recovery key that was specified when the gateway was created.

### Restart the gateway

The gateway runs as a Windows service and, as with any other Windows service, you can start and stop it in multiple ways. For example, you can open a command prompt with elevated permissions on the machine where the gateway is running, and then run either of these commands:

* To stop the service, run this command:

    `net stop PBIEgwService`

* To start the service, run this command:

    `net start PBIEgwService`

### Configure a firewall or proxy

For information about how to provide proxy information for your gateway, see [Configure proxy settings](https://powerbi.microsoft.com/en-us/documentation/powerbi-gateway-proxy/).

You can verify whether your firewall, or proxy, may be blocking connections by running the following command from a PowerShell prompt. This will test connectivity to the Azure Service Bus. This only tests network connectivity and doesn't have anything to do with the cloud server service or the gateway. It helps to determine whether your machine can actually get out to the internet.

`Test-NetConnection -ComputerName watchdog.servicebus.windows.net -Port 9350`

The results should look similar to this example. If **TcpTestSucceeded** is not true, you may be blocked by a firewall.

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

If you want to be exhaustive, substitute the **ComputerName** and **Port** values with those listed under [Configure ports](#configure-ports) later in this topic.

The firewall may also be blocking the connections that the Azure Service Bus makes to the Azure data centers. If that is the case, you'll want to whitelist (unblock) all of the IP addresses for your region for those data centers. You can get a list of [Azure IP addresses here](https://www.microsoft.com/download/details.aspx?id=41653).

### Configure ports

The gateway creates an outbound connection to Azure Service Bus. It communicates on outbound ports: TCP 443 (default), 5671, 5672, 9350 thru 9354. The gateway doesn't require inbound ports.

Learn more about [hybrid solutions](../service-bus/service-bus-fundamentals-hybrid-solutions.md).

| DOMAIN NAMES | OUTBOUND PORTS | DESCRIPTION |
| ----- | ------ | ------ |
| *.analysis.windows.net | 443 | HTTPS |
| *.login.windows.net | 443 | HTTPS |
| *.servicebus.windows.net |5671-5672 | Advanced Message Queuing Protocol (AMQP) |
| *.servicebus.windows.net | 443, 9350-9354 | Listeners on Service Bus Relay over TCP (requires 443 for Access Control token acquisition) |
| *.frontend.clouddatahub.net | 443 | HTTPS |
| *.core.windows.net | 443 | HTTPS |
| login.microsoftonline.com | 443 | HTTPS |
| *.msftncsi.com | 443 | Used to test internet connectivity if the gateway is unreachable by the Power BI service. |

If you need to white list IP addresses instead of the domains, you can download and use the [Microsoft Azure Datacenter IP ranges list](https://www.microsoft.com/download/details.aspx?id=41653). In some cases, the Azure Service Bus connections will be made with IP Address instead of the fully qualified domain names.

### Sign-in account

Users will sign in with either a work or school account. This is your organization account. If you signed up for an Office 365 offering and didn’t supply your actual work email, it may look like jeff@contoso.onmicrosoft.com. Your account, within a cloud service, is stored within a tenant in Azure Active Directory (AAD). In most cases, your AAD account’s UPN will match the email address.

### Windows Service account

The on-premises data gateway is configured to use NT SERVICE\PBIEgwService for the Windows service logon credential. By default, it has the right of Log on as a service. This is in the context of the machine on which you're installing the gateway.

This isn't the account used to connect to on-premises data sources or the work or school account with which you sign in to cloud services.

##Frequently asked questions

### General

**Question**: What data sources does the gateway support?<br/>
**Answer**: As of this writing, SQL Server.

**Question**: Do I need a gateway for data sources in the cloud, such as SQL Azure? <br/>
**Answer**: No. A gateway connects to on-premises data sources only.

**Question**: What is the actual Windows service called?<br/>
**Answer**: In Services, the gateway is called Power BI Enterprise Gateway Service.

**Question**: Are there any inbound connections to the gateway from the cloud? <br/>
**Answer**: No. The gateway uses outbound connections to Azure Service Bus.

**Question**: What if I block outbound connections? What do I need to open? <br/>
**Answer**: See the ports and hosts that the gateway uses.


**Question**: Does the gateway have to be installed on the same machine as the data source? <br/>
**Answer**: No. The gateway will connect to the data source using the connection information that was provided. Think of the gateway as a client application in this sense. 
It will just need to be able to connect to the server name that was provided.


**Question**: What is the latency for running queries to a data source from the gateway? What is the best architecture? <br/>
**Answer**: To reduce network latency, install the gateway as close to the data source as possible. If you can install the gateway on the actual data source, it will minimize the latency introduced. Consider the data centers as well. For example, if your service is using the West US data center and you have SQL Server hosted in an Azure VM, you'll want to have the Azure VM in West US as well. This will minimize latency and avoid egress charges on the Azure VM.


**Question**: Are there any requirements for network bandwidth? <br/>
**Answer**: It is recommended to have good throughput for your network connection. Every environment is different, and the amount of data being sent will affect the results. Using ExpressRoute could help to guarantee a level of throughput between on-premises and the Azure data centers.

You can use the third-party tool Azure Speed Test app to help gauge what your throughput is.


**Question**: Can the gateway Windows service run with an Azure Active Directory account? <br/>
**Answer**: No. The Windows service must have a valid Windows account. By default, it will run with the Service SID, NT SERVICE\PBIEgwService.


**Question**: How are results sent back to the cloud? <br/>
**Answer**: This is done by way of the Azure Service Bus. For more information, see how it works.


**Question**: Where are my credentials stored? <br/>
**Answer**: The credentials that you enter for a data source are stored encrypted in the gateway cloud service. The credentials are decrypted at the gateway on-premises.

### High availability/disaster recovery

**Question**: Are there any plans for enabling high availability scenarios with the gateway? <br/>
**Answer**: This is on the roadmap, but we don’t have a timeline yet.


**Question**: What options are available for disaster recovery? <br/>
**Answer**: You can use the recovery key to restore or move a gateway. When you install the gateway, specify the recovery key.


**Question**: What is the benefit of the recovery key? <br/>
**Answer**: It provides a way to migrate or recover your gateway settings after a disaster.

### Troubleshooting

**Question**: Where are the gateway logs? <br/>
**Answer**: See Tools later in this topic.


**Question**: How can I see what queries are being sent to the on-premises data source? <br/>
**Answer**: You can enable query tracing, which will include the queries being sent. Remember to change it back to the original value when done troubleshooting. Leaving query tracing enabled will cause the logs to be larger.

You can also look at tools that your data source has for tracing queries. For example, you can use Extended Events or SQL Profiler for SQL Server and Analysis Services.

## How the gateway works

When a user interacts with an element that's connected to an on-premises data source:

1. The cloud service creates a query, along with the encrypted credentials for the data source, and sends the query to the queue for the gateway to process.
1. The service analyzes the query and pushes the request to the Azure Service Bus.
1. The on-premises data gateway polls the Azure Service Bus for pending requests.
1. The gateway gets the query, decrypts the credentials, and connects to the data source(s) with those credentials.
1. The gateway sends the query to the data source for execution.
1. The results are sent from the data source back to the gateway and then onto the cloud service. The service then uses the results.

## Troubleshooting

### Update to the latest version

A lot of issues can surface when the gateway version is out of date.  It is a good general practice to make sure you are on the latest version.  If you haven't updated the gateway for a month, or longer, you may want to consider installing the latest version of the gateway and see if you can reproduce the issue.

### Error: Failed to add user to group. (-2147463168 PBIEgwService Performance Log Users )

You may receive this error if you are trying to install the gateway on a domain controller, which isn't supported. You'll need to deploy the gateway on a machine that isn't a domain controller.

## Tools

### Collecting logs from the gateway configurator

You can collect several logs for the gateway. Always start with the logs!

#### Installer logs

`%localappdata%\Temp\Power_BI_Gateway_–Enterprise.log`

#### Configuration logs

`%localappdata%\Microsoft\Power BI Enterprise Gateway\GatewayConfigurator.log`

#### Enterprise gateway service logs

`C:\Users\PBIEgwService\AppData\Local\Microsoft\Power BI Enterprise Gateway\EnterpriseGateway.log`

#### Event logs

The Data Management Gateway and PowerBIGateway logs are present under **Application and Services Logs**.

### Fiddler Trace

[Fiddler](http://www.telerik.com/fiddler) is a free tool from Telerik that monitors HTTP traffic.  You can see the back and forth with the Power BI service from the client machine. This may show errors and other related information.

## Next Steps
- [Create an on-premises connection to Logic Apps](app-service-logic-gateway-connection.md)
- [Enterprise integration features](app-service-logic-enterprise-integration-overview.md)
- [Logic Apps connectors](../connectors/apis-list.md)