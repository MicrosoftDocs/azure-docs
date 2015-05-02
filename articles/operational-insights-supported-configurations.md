<properties 
   pageTitle="Supported configurations for Operational Insights"
   description="Learn about the configurations needed for Operational Insights"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/30/2015"
   ms.author="banders" />

# Supported configurations for Operational Insights

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

What do you need to use Operational Insights? Check out the following information to prepare for Operational Insights.


## Configuration for System Center 2012 Operations Manager

You can use Operational Insights as an attached service in Operations Manager in System Center 2012 R2 or System Center 2012 SP1 R2. This enables you to use the Operations console in Operations Manager to view Operational Insights alerts and configuration information. When you use Operational Insights as an attached service in Operations Manager, the agent communicates directly with the management server, which in turn communicates with the Operational Insights service.

Using Operational Insights as an attached service has the following prerequisites:


- Integration between System Center 2012 SP1 Operations Manager and Operational Insights requires updated management packs that are included in the [Operational Insights Connector for Operations Manager](https://www.microsoft.com/en-us/download/details.aspx?id=38199). You can download and install the management packs from [Operational Insights Connector for Operations Manager](https://www.microsoft.com/en-us/download/details.aspx?id=38199).

- System Center 2012 SP1: Operations Manager Update Rollup 6, although Update Rollup 7 is preferred. This update needs to be applied to the management server, agents, and Operations console for the Operational Insights as an attached service scenario.

- System Center 2012 R2: Operations Manager Update Rollup 2, although Update Rollup 3 is preferred. This update needs to be applied to the management server, agents, and Operations console for the Operational Insights as an attached service scenario.

- To view capacity management data, you must enable Operations Manager connectivity with Virtual Machine Manager (VMM). For additional information about connecting the systems, see [How to connect VMM with Operations Manager](https://technet.microsoft.com/en-us/library/hh882396.aspx).

See [Viewing Operational Insights Alerts](http://go.microsoft.com/fwlink/?LinkID=293793) for installation and configuration instructions.

If you want to view Operational Insights alerts about SharePoint Server 2010, Lync Server 2013, Lync Server 2010, or System Center 2012 SP1 - Virtual Machine Manager, you need to configure a Run As account for those workloads. See the following information:


- [Set the Run As Account For SharePoint](operational-insights-run-as.md)

- [Set the Run As Account for Lync Server](operational-insights-run-as.md)

- [Set the Run As Account for Virtual Machine Manager (VMM)](operational-insights-run-as.md)

### Operations Manager operating systems

Operations Manager agents are supported on a variety of computers. See [System Requirements: System Center 2012 R2 Operations Manager](https://technet.microsoft.com/library/dn249696.aspx) for details about agent support.

### Required software for Operations Manager

To view capacity management data, you must enable Operations Manager connectivity with VMM. For additional information about connecting the systems, see [How to connect VMM with Operations Manager](https://technet.microsoft.com/en-us/library/hh882396.aspx).

## Agents connecting directly to Operational Insights

The agent used to connect directly to the service is the Microsoft Monitoring agent. Its system requirements are listed on the [Microsoft Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=40316&e6b34bbe-475b-1abd-2c51-b5034bcdd6d2=True) page.

## Browsers

You can use any of the following browsers with Operational Insights:

- Windows Internet Explorer 11, Internet Explorer 10, Internet Explorer 9, Internet Explorer 8, or Internet Explorer 7

- Mozilla Firefox 3.5 or later

Regardless of the browser you use, you must also install Microsoft Silverlight 4.

## Technologies you can analyze

Operational Insights Configuration Assessment analyzes the following workloads:

- Windows Server 2012 and Microsoft Hyper-V Server 2012

- Windows Server 2008 and Windows Server 2008 R2, including:
    - Active Directory
	- Hyper-V host
	- General operating system

- SQL Server 2012, SQL Server 2008 R2, SQL Server 2008
    - SQL Server Database Engine

- Microsoft SharePoint 2010

- Microsoft Exchange Server 2010 and Microsoft Exchange Server 2013

- Microsoft Lync Server 2013 and Lync Server 2010

- System Center 2012 SP1 – Virtual Machine Manager

For SQL Server, the following 32-bit and 64-bit editions are supported for analysis:

- SQL Server 2008 and 2008 R2 Enterprise

- SQL Server 2008 and 2008 R2 Standard

- SQL Server 2008 and 2008 R2 Workgroup

- SQL Server 2008 and 2008 R2 Web

- SQL Server 2008 and 2008 R2 Express

In addition, the 32-bit edition of SQL Server is supported when running in the WOW64 implementation.

