---
title: Install on-premises data gateway - Azure Logic Apps
description: Before you can access data on premises from Azure Logic Apps, download and install the on-premises data gateway
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: arthii, LADocs
ms.topic: article
ms.date: 07/01/2019
---

# Install on-premises data gateway for Azure Logic Apps

Before you can connect to on-premises data sources from Azure Logic Apps, download and install the on-premises data gateway on a local computer. The gateway works as a bridge that provides quick data transfer and encryption between data sources on premises (not in the cloud) and your logic apps. You can use the same gateway installation with other cloud services, such as Power BI, Microsoft Flow, PowerApps, and Azure Analysis Services. For information about how to use the gateway with these services, see these articles:

* [Microsoft Power BI on-premises data gateway](https://powerbi.microsoft.com/documentation/powerbi-gateway-onprem/)
* [Microsoft PowerApps on-premises data gateway](https://powerapps.microsoft.com/tutorials/gateway-management/)
* [Microsoft Flow on-premises data gateway](https://flow.microsoft.com/documentation/gateway-manage/)
* [Azure Analysis Services on-premises data gateway](../analysis-services/analysis-services-gateway.md)

This article shows how to download, install, and set up your on-premises data gateway so that you can access on-premises data sources from Azure Logic Apps. You can also learn more about [how the data gateway works](#gateway-cloud-service) later in this topic.

<a name="supported-connections"></a>

The gateway supports [on-premises connectors](../connectors/apis-list.md#on-premises-connectors) in Azure Logic Apps for these data sources:

* BizTalk Server 2016
* File System
* IBM DB2  
* IBM Informix
* IBM MQ
* MySQL
* Oracle Database
* PostgreSQL
* SAP
* SharePoint Server
* SQL Server
* Teradata

Although the gateway alone doesn't incur additional costs, the [Logic Apps pricing model](../logic-apps/logic-apps-pricing.md) applies to these connectors and other operations in Azure Logic Apps.

<a name="requirements"></a>

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

  * You must use the same Azure account to install and to administer the gateway. During installation, you use this Azure account to associate the gateway on your computer with an Azure subscription. Later, you use same Azure account when you create an Azure resource in the Azure portal for your gateway installation. 

  * You must sign in with either a work account or school account, also known as an *organization* account, which looks like `username@contoso.com`. You can't use Azure B2B (guest) accounts or personal Microsoft accounts, such as @hotmail.com or @outlook.com.

    > [!TIP]
    > If you signed up for an Office 365 offering and didn't provide your work email address, 
    > your address might look like `username@domain.onmicrosoft.com`. Your account is stored 
    > within a tenant in an Azure Active Directory (Azure AD). In most cases, the User Principal 
    > Name (UPN) for your Azure AD account is the same as your email address.
    >
    > To use a [Visual Studio Standard subscription](https://visualstudio.microsoft.com/vs/pricing/) that's associated 
    > with a Microsoft account, first [create a tenant in Azure AD](../active-directory/develop/quickstart-create-new-tenant.md), 
    > or use the default directory. Add a user with a password to the directory, then give that user access to your subscription. 
    > You can then sign in during gateway installation with this username and password.

* Here are requirements for your local computer:

  **Minimum requirements**

  * .NET Framework 4.6
  * 64-bit version of Windows 7 or Windows Server 2008 R2 (or later)

  **Recommended requirements**

  * 8-core CPU
  * 8 GB memory
  * 64-bit version of Windows Server 2012 R2 or later
  * Solid-state drive (SSD) storage for spooling

  > [!NOTE]
  > The gateway doesn't support Windows Server 2016 Core.

* **Related considerations**

  * You can install the on-premises data gateway only on a local computer, not a domain controller. However, you don't have to install the gateway on the same computer as your data source. You need only one gateway for all your data sources, so you don't need to install the gateway for each data source.

    > [!TIP]
    > To minimize latency, you can install the gateway as close 
    > as possible to your data source, or on the same computer, 
    > assuming that you have permissions.

  * Install the gateway on a computer that's on a wired network, connected to the internet, always turned on, and doesn't go to sleep. Otherwise, the gateway can't run, and performance might suffer over a wireless network.

  * If you plan to use Windows authentication, make sure that you install the gateway on a computer that's a member of the same Active Directory environment as your data sources.

  * The region that you select for your gateway installation is the same location that you must select when you later create the Azure gateway resource for your logic app. By default, this region is the same location as your Azure AD tenant that manages your Azure account. However, you can change the location during gateway installation.

  * The gateway has two modes: standard mode and personal mode, which applies only to Power BI. You can't have more than one gateway running in the same mode on the same computer.

<a name="install-gateway"></a>

## Install data gateway

1. [Download and run the gateway installer on a local computer](https://aka.ms/on-premises-data-gateway-installer).

1. After the installer opens, select **Next**.

   ![Installer intro](./media/logic-apps-gateway-install/gateway-intro-screen.png)

1. Select **On-premises data gateway (recommended)**, which is standard mode, and then select **Next**.

   ![Select gateway mode](./media/logic-apps-gateway-install/select-gateway-mode.png)

1. Review the minimum requirements, keep the default installation path, accept the terms of use, and then select **Install**.

   ![Review requirements and accept terms of use](./media/logic-apps-gateway-install/accept-terms.png)

1. After the gateway successfully installs, provide the email address for your organization account, and then select **Sign in**, for example:

   ![Sign in with work or school account](./media/logic-apps-gateway-install/sign-in-gateway-install.png)

   You're now signed in to your account.

1. Select **Register a new gateway on this computer** > **Next**. This step registers your gateway installation with the [gateway cloud service](#gateway-cloud-service).

   ![Register gateway](./media/logic-apps-gateway-install/register-gateway.png)

1. Provide this information for your gateway installation:

   * A gateway name that's unique across your Azure AD tenant
   * The recovery key, which must have at least eight characters, that you want to use
   * Confirmation for your recovery key

   ![Set up gateway](./media/logic-apps-gateway-install/set-up-gateway.png)

   > [!IMPORTANT]
   > Save and keep your recovery key in a safe place. 
   > You need this key if you ever want to change the location, 
   > move, recover, or take over a gateway installation.

   Note the option to **Add to an existing gateway cluster**, which you select when you install additional gateways for [high-availability scenarios](#high-availability).

1. Check the region for the gateway cloud service and [Azure Service Bus](https://azure.microsoft.com/services/service-bus/) that's used by your gateway installation. By default, this region is the same location as the Azure AD tenant for your Azure account.

   ![Check region](./media/logic-apps-gateway-install/check-region.png)

1. To accept the default region, select **Configure**. However, if the default region isn't the one that's closest to you, you can change the region.

   *Why change the region for your gateway installation?*

   For example, to reduce latency, you might change your gateway's region to the same region as your logic app. Or, you might select the region closest to your on-premises data source. Your *gateway resource in Azure* and your logic app can have different locations.

   1. Next to the current region, select **Change Region**.

      ![Change region](./media/logic-apps-gateway-install/change-region.png)

   1. On the next page, open the **Select Region** list, select the region you want, and select **Done**.

      ![Select another region](./media/logic-apps-gateway-install/select-region-gateway-install.png)

1. Review the information in the final confirmation window. This example uses the same account for Logic Apps, Power BI, PowerApps, and Microsoft Flow, so the gateway is available for all these services. When you're ready, select **Close**.

   ![Finished gateway](./media/logic-apps-gateway-install/finished-gateway-default-location.png)

1. Now [create the Azure resource for your gateway installation](../logic-apps/logic-apps-gateway-connection.md).

<a name="high-availability"></a>

## High availability support

To avoid single points of failure for on-premises data access, you can have multiple gateway installations (standard mode only) with each on a different computer, and set them up as a cluster or group. That way, if the primary gateway is unavailable, data requests are routed to the second gateway, and so on. Because you can install only one standard gateway on a computer, you must install each additional gateway that's in the cluster on a different computer. All the connectors that work with the on-premises data gateway support high availability. 

* You must already have at least one gateway installation within the same Azure subscription as the primary gateway and the recovery key for that installation.

* Your primary gateway must be running the gateway update from November 2017 or later.

After you set up your primary gateway, when you go to install another gateway, select **Add to an existing gateway cluster**, select the primary gateway, which is the first gateway that you installed, and provide the recovery key for that gateway. For more information, see [High availability clusters for on-premises data gateway](https://docs.microsoft.com/data-integration/gateway/service-gateway-install#add-another-gateway-to-create-a-cluster).

<a name="update-gateway-installation"></a>

## Change location, migrate, restore, or take over existing gateway

If you must change your gateway's location, move your gateway installation to a new computer, recover a damaged gateway, or take ownership for an existing gateway, you need the recovery key that was provided during gateway installation.

1. Run the gateway installer on the computer that has the existing gateway. If you don't have the latest gateway installer, [download the latest gateway version](https://aka.ms/on-premises-data-gateway-installer).

   > [!NOTE]
   > Before you restore the gateway on the computer that has the original gateway installation, 
   > you must first uninstall the gateway on that computer. This action disconnects the original gateway.
   > If you remove or delete a gateway cluster for any cloud service, you can't restore that cluster.

1. After the installer opens, sign in with the same Azure account that was used to install the gateway.

1. Select **Migrate, restore, or takeover an existing gateway** > **Next**, for example:

   ![Select "Migrate, restore, or takeover an existing gateway"](./media/logic-apps-gateway-install/migrate-recover-take-over-gateway.png)

1. Select from the available clusters and gateways, and enter the recovery key for the selected gateway, for example:

   ![Select gateway](./media/logic-apps-gateway-install/select-existing-gateway.png)

1. To change the region, select **Change Region**, and select the new region.

1. When you're ready, select **Configure** so that you can finish your task.

## Configure proxy or firewall

If your work environment requires that traffic goes through a proxy to access the internet, this restriction might prevent the on-premises data gateway from connecting to the gateway cloud service and [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md). For more information, see [Configure proxy settings for the on-premises data gateway](https://docs.microsoft.com/power-bi/service-gateway-proxy).

To check whether your proxy or firewall might block connections, confirm whether your computer can actually connect to the internet and Azure Service Bus. From a PowerShell prompt, run this command:

`Test-NetConnection -ComputerName watchdog.servicebus.windows.net -Port 9350`

> [!NOTE]
> This command only tests network connectivity 
> and connectivity to the Azure Service Bus. 
> The command doesn't do anything with the 
> gateway or the gateway cloud service that 
> encrypts and stores your credentials and gateway details. 
>
> Also, this command is only available on Windows Server 2012 R2 or later, 
> and Windows 8.1 or later. On earlier OS versions, you can use Telnet to 
> test connectivity. Learn more about 
> [Azure Service Bus and hybrid solutions](../service-bus-messaging/service-bus-messaging-overview.md).

Your results should look similar to this example with **TcpTestSucceeded** set to **True**:

```text
ComputerName           : watchdog.servicebus.windows.net
RemoteAddress          : 70.37.104.240
RemotePort             : 5672
InterfaceAlias         : vEthernet (Broadcom NetXtreme Gigabit Ethernet - Virtual Switch)
SourceAddress          : 10.120.60.105
PingSucceeded          : False
PingReplyDetails (RTT) : 0 ms
TcpTestSucceeded       : True
```

If **TcpTestSucceeded** is not set to **True**, your gateway might be blocked by a firewall. If you want to be comprehensive, replace the **ComputerName** and **Port** values with the values listed under [Configure ports](#configure-ports) in this article.

The firewall might also block connections that the Azure Service Bus makes to the Azure datacenters. If this scenario happens, approve (unblock) all the IP addresses for those datacenters in your region. For those IP addresses, [get the Azure IP addresses list here](https://www.microsoft.com/download/details.aspx?id=41653).

<a name="configure-ports"></a>

## Configure ports

The gateway creates an outbound connection to Azure Service Bus and communicates on outbound ports: TCP 443 (default), 5671, 5672, 9350 through 9354. The gateway doesn't require inbound ports. Learn more about [Azure Service Bus and hybrid solutions](../service-bus-messaging/service-bus-messaging-overview.md).

The gateway uses these fully qualified domain names:

| Domain names | Outbound ports | Description |
| ------------ | -------------- | ----------- |
| *.analysis.windows.net | 443 | HTTPS |
| *.core.windows.net | 443 | HTTPS |
| *.frontend.clouddatahub.net | 443 | HTTPS |
| *.login.windows.net | 443 | HTTPS |
| *.microsoftonline-p.com | 443 | Used for authentication depending on configuration. |
| *.msftncsi.com | 443 | Used to test internet connectivity when the gateway is unreachable by the Power BI service. |
| *.servicebus.windows.net | 443, 9350-9354 | Listeners on Service Bus Relay over TCP (requires 443 for Access Control token acquisition) |
| *.servicebus.windows.net | 5671-5672 | Advanced Message Queuing Protocol (AMQP) |
| login.microsoftonline.com | 443 | HTTPS |
||||

In some cases, Azure Service Bus connections are made with IP addresses rather than fully qualified domain names. So, you might want to unblock the IP addresses for your data region in your firewall. To allow access for IP addresses rather than domains, you can download and use the [Microsoft Azure Datacenter IP ranges list](https://www.microsoft.com/download/details.aspx?id=41653). The IP addresses in this list are in [Classless Inter-Domain Routing (CIDR)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

### Force HTTPS communication with Azure Service Bus

Some proxies let traffic through only to ports 80 and 443. By default, communication with Azure Service Bus occurs on ports other than 443. You can force the gateway to communicate with the Azure Service Bus over HTTPS rather than direct TCP, but doing so can greatly reduce performance. For more information, see [Force HTTPS communication with Azure Service Bus](https://docs.microsoft.com/data-integration/gateway/service-gateway-communication#force-https-communication-with-azure-service-bus).

<a name="windows-service-account"></a>

## Windows service account

By default, the gateway installation on your local computer runs as a Windows service account named "On-premises data gateway service". However, the gateway installation uses the `NT SERVICE\PBIEgwService` name for its "Log On As" account credentials and has "Log on as a service" permissions.

> [!NOTE]
> Your Windows service account differs from the account used for connecting to on-premises 
> data sources and from the Azure account that you use when you sign in to cloud services.

<a name="restart-gateway"></a>

## Restart gateway

The data gateway runs as a Window service, so like any other Windows service, you can start and stop the gateway in various ways. For more information, see [Restart an on-premises data gateway](https://docs.microsoft.com/data-integration/gateway/service-gateway-restart).

## Tenant-level administration

To get visibility into all the on-premises data gateways in an Azure AD tenant, global administrators in that tenant can sign in to the [Power Platform Admin center](https://powerplatform.microsoft.com) as a tenant administrator and select the **Data Gateways** option. For more information, see [Tenant-level administration for the on-premises data gateway](https://docs.microsoft.com/data-integration/gateway/service-gateway-tenant-level-admin).

<a name="gateway-cloud-service"></a>

## How the gateway works

The data gateway facilitates quick and secure communication between your logic app, the gateway cloud service, and your on-premises data source. The gateway cloud service encrypts and stores your data source credentials and gateway details. The service also routes queries and their results between your logic app, the on-premises data gateway, and your data source on premises.

The gateway works with firewalls and uses only outbound connections. All traffic originates as secure outbound traffic from the gateway agent. The gateway relays data from on-premises sources on encrypted channels through Azure Service Bus. This service bus creates a channel between the gateway and the calling service, but doesn't store any data. All data that travels through the gateway is encrypted.

![Architecture for on-premises data gateway](./media/logic-apps-gateway-install/how-on-premises-data-gateway-works-flow-diagram.png)

These steps describe what happens when a user in the cloud interacts with an element that's connected to your on-premises data source:

1. The gateway cloud service creates a query, along with the encrypted credentials for the data source, and sends the query to the queue for the gateway to process.

1. The gateway cloud service analyzes the query and pushes the request to the Azure Service Bus.

1. The on-premises data gateway polls the Azure Service Bus for pending requests.

1. The gateway gets the query, decrypts the credentials, and connects to the data source with those credentials.

1. The gateway sends the query to the data source for execution.

1. The results are sent from the data source back to the gateway, and then to the gateway cloud service. The gateway cloud service then uses the results.

<a name="faq"></a>

## Frequently asked questions

### General

**Q**: Do I need a gateway for data sources in the cloud, such as Azure SQL Database? <br/>
**A**: No, the gateway connects to on-premises data sources only.

**Q**: Does the gateway have to be installed on the same machine as the data source? <br/>
**A**: No, the gateway connects to the data source using the provided connection information. Consider the gateway as a client application in this sense. The gateway just needs the capability to connect to the server name that was provided.

<a name="why-azure-work-school-account"></a>

**Q**: Why must I use a work or school account to sign in? <br/>
**A**: You can only use a work or school account when you install the on-premises data gateway. Your sign-in account is stored in a tenant that's managed by Azure Active Directory (Azure AD). Usually, your Azure AD account's user principal name (UPN) matches the email address.

**Q**: Where are my credentials stored? <br/>
**A**: The credentials that you enter for a data source are encrypted and stored in the gateway cloud service. The credentials are decrypted at the on-premises data gateway.

**Q**: Are there any requirements for network bandwidth? <br/>
**A**: Check that your network connection has good throughput. Every environment is different, and the amount of data sent can affect the results. To guarantee a throughput level between your on-premises data source and the Azure datacenters, try [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/). To help gauge your throughput, try an external tool such as Azure Speed Test.

**Q**: What is the latency for running queries to a data source from the gateway? What is the best architecture? <br/>
**A**: To reduce network latency, install the gateway as close to the data source as possible. If you can install the gateway on the actual data source, this proximity minimizes the latency introduced. Also, consider proximity to Azure datacenters. For example, if your service uses the West US datacenter, and you have SQL Server hosted in an Azure VM, then you might want your Azure VM in the West US region too. This proximity minimizes latency and avoids egress charges on the Azure VM.

**Q**: How are results sent back to the cloud? <br/>
**A**: The results are sent through Azure Service Bus.

**Q**: Are there any inbound connections to the gateway from the cloud? <br/>
**A**: No, the gateway uses outbound connections to Azure Service Bus.

**Q**: What if I block outbound connections? What do I need to open? <br/>
**A**: See the ports and hosts that the gateway uses.

**Q**: What is the actual Windows service called? <br/>
**A**: On the Services tab in Task Manager, the service name is "PBIEgwService", or Power BI Enterprise Gateway Service. In the Services console, the service name is "On-premises data gateway service". The Windows service uses "NT SERVICE\PBIEgwService" as the Service SID (SSID).

**Q**: Can the gateway Windows service run with an Azure Active Directory account? <br/>
**A**: No, the Windows service must have a valid Windows account.

### Disaster recovery

**Q**: What options are available for disaster recovery? <br/>
**A**: You can use the recovery key to restore or move a gateway. When you install the gateway, specify the recovery key.

**Q**: What is the benefit of the recovery key? <br/>
**A**: The recovery key provides a way to migrate or recover your gateway settings after a disaster.

## Troubleshooting

This section addresses some common issues you might have while setting up and using the on-premises data gateway.

**Q**: Why did my gateway installation fail? <br/>
**A**: This issue can happen if the anti-virus software on the target computer is outdated. You can either update the anti-virus software or disable the anti-virus software but only during gateway installation, and then enable the software again.

**Q**: Why don't I see my gateway installation when I create the gateway resource in Azure? <br/>
**A**: This issue can happen for these reasons:

* Your gateway installation is already registered and claimed by another gateway resource in Azure. Gateway installations don't appear in the instances list after gateway resources are created for them. To check your gateway registrations in the Azure portal, review all your Azure resources with the **On-premises Data Gateways** type for *all* Azure subscriptions.

* The Azure AD identity for the person who installed the gateway differs from the person who signed in to the Azure portal. Check that you're signed in with the same identity that installed the gateway.

[!INCLUDE [existing-gateway-location-changed](../../includes/logic-apps-existing-gateway-location-changed.md)]

**Q**: Where are the gateway logs? <br/>
**A**: See the [**Logs** section](#logs) later in this article.

**Q**: How can I see what queries are being sent to the on-premises data source? <br/>
**A**: You can enable query tracing, which includes the queries that are sent. Remember to change query tracing back to the original value when done troubleshooting. Leaving query tracing turned on creates larger logs.

You can also look at tools that your data source has for tracing queries. For example, you can use Extended Events or SQL Profiler for SQL Server and Analysis Services.

### Outdated gateway version

Many issues can surface when the gateway version becomes outdated. As good general practice, make sure you have the latest version. If you haven't updated the gateway for a month or longer, you might consider installing the latest version of the gateway, and see if you can reproduce the issue.

### Error: Failed to add user to group. (-2147463168 PBIEgwService Performance Log Users)

You might get this error if you try to install the gateway on a domain controller, which isn't supported. Make sure you deploy the gateway on a machine that isn't a domain controller.

<a name="logs"></a>

### Logs

To help you troubleshoot, always start by collecting and reviewing the gateway logs. You have several ways for collecting the logs, but the simplest option after you install the gateway is through the gateway installer's user interface.

1. On your computer, open the on-premises data gateway installer.

1. On the left menu, select **Diagnostics**.

1. Under **Gateway logs**, select **Export logs**.

   ![Export logs from gateway installer](./media/logic-apps-gateway-install/export-logs.png)

Here are other locations where you can find various logs:

| Log type | Location |
|----------|----------|
| **Installer logs** | %localappdata%\Temp\On-premises_data_gateway_<*yyyymmdd*>.<*number*>.log |
| **Configuration logs** | C:\Users\<*username*>\AppData\Local\Microsoft\On-premises data gateway\GatewayConfigurator<*yyyymmdd*>.<*number*>.log |
| **Enterprise gateway service logs** | C:\Users\PBIEgwService\AppData\Local\Microsoft\On-premises data gateway\Gateway<*yyyymmdd*>.<*number*>.log |
|||

**Event logs**

To find the event logs for the gateway, follow these steps:

1. On the computer with the gateway installation, open the **Event Viewer**.

1. Expand **Event Viewer (Local)** > **Applications and Services Logs**.

1. Select **On-premises data gateway service**.

   ![View event logs for gateway](./media/logic-apps-gateway-install/event-viewer.png)

### Review slow query performance

If you find queries run slowly through the gateway, you can turn on additional logging that outputs queries and their durations. These logs might help you find which queries are slow or long running. To tune query performance, you might have to modify your data source, for example, adjust indexes for SQL Server queries.

To determine the duration for a query, follow these steps:

1. Browse to the same location as the gateway client, which you can usually find here: ```C:\Program Files\On-premises data gateway```

   Otherwise, to find the client location, open the Services console on the same computer, find **On-premises data gateway service**, and view the **Path to executable** property.

1. Open and edit these configuration files as described:

   * **Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config**

     In this file, change the **EmitQueryTraces** value from **false** to **true** so that your gateway can log queries sent from the gateway to a data source:

     ```html
     <setting name="EmitQueryTraces" serializeAs="String">
        <value>true</value>
     </setting>
     ```

     > [!IMPORTANT]
     > Turning on the EmitQueryTraces setting might significantly increase 
     > the log size based on gateway usage. After you finish reviewing the logs, 
     > make sure you reset EmitQueryTraces to **false** again, 
     > rather than leave this setting on for the long term.

   * **Microsoft.PowerBI.DataMovement.Pipeline.Diagnostics.dll.config**

     To have your gateway log verbose entries, including entries that show duration, change the **TracingVerbosity** value from **4** to **5** by performing either step:

     * In this configuration file, change the **TracingVerbosity** value from **4** to **5**

       ```html
       <setting name="TracingVerbosity" serializeAs="String">
          <value>5</value>
       </setting>
       ```

     * Open the gateway installer, select **Diagnostics**, turn on **Additional logging**, and then choose **Apply**:

       ![Turn on additional logging](./media/logic-apps-gateway-install/turn-on-additional-logging.png)

     > [!IMPORTANT]
     > Turning on the TracingVerbosity setting might significantly increase 
     > the log size based on gateway usage. After you finish reviewing the logs, 
     > make sure you turn off **Additional logging** in the gateway installer 
     > or reset TracingVerbosity to **4** again in the configuration file, 
     > rather than leave this setting on for the long term.

1. To find the duration for a query, follow these steps:

   1. [Export](#logs) and open the gateway log.

   1. To find a query, search for an activity type, for example:

      | Activity type | Description |
      |---------------|-------------|
      | MGEQ | Queries that run over ADO.NET |
      | MGEO | Queries that run over OLEDB |
      | MGEM | Queries that run from the Mashup engine |
      |||

   1. Note the second GUID, which is the Request ID.

   1. Continue searching for the activity type until you find an entry named "FireActivityCompletedSuccessfullyEvent" that has a duration in milliseconds. Confirm the entry has the same Request ID, for example:

      ```text
      DM.EnterpriseGateway Verbose: 0 : 2016-09-26T23:08:56.7940067Z DM.EnterpriseGateway    baf40f21-2eb4-4af1-9c59-0950ef11ec4a    5f99f566-106d-c8ac-c864-c0808c41a606    MGEQ    21f96cc4-7496-bfdd-748c-b4915cb4b70c    B8DFCF12 [DM.Pipeline.Common.TracingTelemetryService] Event: FireActivityCompletedSuccessfullyEvent (duration=5004)
      ```

      > [!NOTE]
      > The "FireActivityCompletedSuccessfullyEvent" entry is a verbose entry 
      > and is not logged unless the "TracingVerbosity" setting is at level 5.

### Trace traffic with Fiddler

[Fiddler](https://www.telerik.com/fiddler) is a free tool from Telerik that monitors HTTP traffic. You can review this traffic with the Power BI service from the client machine. This service might show errors and other related information.

## Next steps

* [Connect to on-premises data from logic apps](../logic-apps/logic-apps-gateway-connection.md)
* [Enterprise integration features](../logic-apps/logic-apps-enterprise-integration-overview.md)
* [Connectors for Azure Logic Apps](../connectors/apis-list.md)
