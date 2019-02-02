---
title: Collecting data in Azure Security Insights | Microsoft Docs
description: Learn how to collect data in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c3df8afb-90d7-459c-a188-c55ba99e7b92
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/3/2019
ms.author: rkarlin

---
# Collecting data in Azure Security Insights

Azure Security Insights enables seamless data collection from services in the Microsoft ecosystem as well as third party data sources like servers, network equipment and security appliances like firewalls. Security Insights enables data collection in real time to allow for immediate analysis. Data collection methods include agents that are installed directly on monitored event source, collection of data using APIs provided by monitored event source, and real-time Syslog stream collection.


## Global prerequisites

1.  Contributor permissions to Azure subscription

2.  Log Analytics workspace. Learn how to [create a Log Analytics workspace](../log-analytics/log-analytics-quick-create-workspace.md)

3.  Tenant global or security admin permissions (some data sources)

## Enable Security Insights

1. Go into the Azure portal.
2. Select the subscription that you want to use to work with ASI.
3. Search for ASI. 
4. Click **+Add**.
5. Select which workspace you want to use or create a new one. You won't see the ASC default workspaces here, you can't run ASI on them. You can run ASI on more than one workspace, but the data will be isolated to a single workspace.

>[!NOTE] Workspace location
> It's important to understand from a compliance pov that all the data that you stream to ASI will be stored in the geographic location of the workspace.  

6. Click **Add security insights**.


## Connect data sources

ASI creates the connection to services and apps by connecting to the service's event hub and forwarding the events and logs to ASI. For machines and virtual machines, ASI installs an agent that collects the logs and forwards them to ASI. For Firewalls and proxies ASI utilizes a Linux Syslog server on which the agent is installed and from which the agent collects the log files and forwards them to ASI. 
 
1. Click **Data collection**.
2. On the **Sources** tab is that list of what you can connect.<br>
For example, click **Azure Active Directory Logs**. If you connect this data source, you stream all the logs from Azure AD into ASI. Follow the installation instructions or refer to the relevant connection guide for mor information. You can select what type of logs you wan to get - Sign In Logs and or Audit Logs. For Azure AD, it gives you information about what type of licenses you need for this to work. 
At the bottom, ASI provides recommendations for which dashboards you should install for each connector, and which alert rules you should add so that you already [view dashboards](security-insights-qs-get-visibility.md) and [get alerts](security-insights-investigate-threats.md) on the data from this connection.

8. Use the sample query data if you want to start building queries in Log Analytics that run on this data. The samples help by providing you with basic queries including the correct parameter names for data of this type.



> [!BEST PRACTICES]
> We recommend that you connect at least Azure Active Directory, Office 365, Security events (Windows events), firewall logs for the firewalls you have, and Azure Activity.

For information about machines, services, and apps that are natively connected to ASI, see [X](security-insights-connect-aad.md).
For information about other third party machines, services, and apps that can be connected to ASI, see [X](security-insights-connect-cef.md).

ASI collects both [Syslog](security-insights-connect-syslog.md) and [CEF over Syslog](security-insights-connect-cef.md) formatted events. If your solution supports CEF, it is recommended that you save your log events as CEF because of ASI's integration with Log Analytics which parses and normalizes the data best from CEF. In addition, CEF data analyzed with ASI includes Threat Intelligence enrichment.








## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Security Center. To learn more about Security Center, see the following articles:
