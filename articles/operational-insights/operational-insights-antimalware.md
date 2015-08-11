<properties
   pageTitle="Protect servers with antimalware"
   description="Use antimalware to help you protect the servers in your infrastructure from malware"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="" />
<tags
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/05/2015"
   ms.author="banders" />

# Protect servers with antimalware

[AZURE.INCLUDE [operational-insights-note-moms](../../includes/operational-insights-note-moms.md)]

You can use the Antimalware solution in Microsoft Azure Operational Insights to report on the status of antimalware protection in your infrastructure. Installing the solution updates the Operational Insights agent and base configuration for Operational Insights. Antimalware protection status and detected threats on the monitored servers are read, and then the data is sent to the Operational Insights service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. Servers with detected threats and servers with insufficient protection are shown in the **Antimalware** dashboard. By using the information on the **Antimalware** dashboard, you can identify a plan to apply protection to the servers that need it.

## Use Antimalware

Before you can use the antimalware solution in Microsoft Azure Operational Insights, you must have the solution installed. To read more about installing solutions, see [Use the Solutions Gallery to add or remove solutions](operational-insights-setup-workspace.md).

Operational Insights only reports antimalware status for:

- Servers running System Center Endpoint Protection (v4.5.216 or later) or Azure virtual machines with the [antimalware extension](http://go.microsoft.com/fwlink/?linkid=398023)
- Servers with Windows Management Framework 3 (or later) [WMF 3.0](https://support.microsoft.com/en-us/kb/2506143), [WMF 4.0](http://www.microsoft.com/en-us/download/details.aspx?id=40855).

The antimalware solution does not currently report on:

- Computers running Windows Defender on Windows 8, Windows 8.1, Windows 10 or Windows Server 2016
- Servers running Windows Server 2008 and earlier
- Web and Worker roles in Microsoft Azure
- 3rd party antimalware products

You can help us prioritize the addition of new features by voting or adding a new suggestion on our [feedback page](http://feedback.azure.com/forums/267889-azure-operational-insights/category/88093-malware-assessment-solution).

Refer to [Reporting antimalware status for servers not supported by the antimalware solution](#reporting-antimalware-status-for-servers-not-supported-by-the-antimalware-solution) for details on how to build a dashboard to report on all computers.

### To review detected threats for servers

1. On the **Overview** page, click the **Antimalware Assessment** tile.
![Malware Assessment Tile](./media/operational-insights-antimalware/antimalware01.png)
2. On the **Antimalware** dashboard, you will review the **Detected Threats** blade and click a server name with active threats.
![Antimalware Dashboard](./media/operational-insights-antimalware/antimalware02.png)
3. On the **Search** page you can see detailed information about the detected threat. Next to **Threat**, click **View**.
![Search Page](./media/operational-insights-antimalware/antimalware03.png)
4. On the **Search the malware encyclopedia** page, click the malware item to view more details about it.
![Search Page](./media/operational-insights-antimalware/antimalware04.png)
5. On the Microsoft **Malware Protection Center** page for the malware item, review information in the **What to do now** and **Get more help** sections for ways to remove the threat or take other corrective actions. Recommendations are specific to the malware found
![Search Page](./media/operational-insights-antimalware/antimalware05.png)

###To review protection status

1. On the **Antimalware** dashboard, you will review the **Protection Status** blade and click **no real time protection**.
![Search Page](./media/operational-insights-antimalware/antimalware06.png)
2. Search shows a list of servers without protection.
![Search Page](./media/operational-insights-antimalware/antimalware07.png)
3. At this point you now know what servers do not have  realtime protection.

Computers that do not have System Center Endpoint Protection installed (or if SCEP is not detected) will be reported as **no real time protection**.

## Reporting antimalware status for servers not supported by the antimalware solution

You can use event log analysis to report on the antimalware status of computers that are not supported by the antimalware solution. This approach works for computers running Windows Defender, Microsoft Security Essentials or System Center Endpoint Protection.
This also includes web roles, worker roles and virtual machines that are in Azure.

You will need to be collecting information, warning and error events from the Application event log to use these queries.
For computers running in Azure you can use [Azure diagnostics](operational-insights-analyze-data-azure.md) to collect these events.

Using the [dashboard feature](operational-insights-use-dashboards.md) you can visualize the following searches queries that report antimalware status:

Computers with threats detected

`Type:Event Source:"Microsoft Antimalware" EventID:1116`


Computers without a Microsoft antimalware product installed/reporting

`Type=Event Computer NOT IN { Type=Event Source:"Microsoft Antimalware" EventID:2000 | measure count() by Computer } | measure count() by Computer`


Computers with a Microsoft antimalware product installed and reporting

`Type=Event Source:"Microsoft Antimalware" | measure count() as Count by Computer`


Computers with no signature update in the last 24 hours

`Type=Event Source:"Microsoft Antimalware" EventID:2000 | measure max(TimeGenerated) as lastdata by Computer | where lastdata < NOW-24HOURS`


Antimalware error and warning events

`Type=Event Source:"Microsoft Antimalware" EventLevelName <> Information`

[AZURE.INCLUDE [operational-insights-export](../../includes/operational-insights-export.md)]
