---
title: Collecting data in Azure Sentinel | Microsoft Docs
description: Learn how to collect data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: d5750b3e-bfbd-4fa0-b888-ebfab7d9c9ae
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# Collect data in Azure Sentinel

Azure Sentinel enables seamless data collection from services in the Microsoft ecosystem, apps, and servers, as well as on-premises solutions like security appliances, including firewalls and proxies - whether they reside on-premises, in Azure, or in other clouds. Azure Sentinel enables data collection in real time to allow for immediate analysis. Azure Sentinel includes service-to-service integration with Microsoft 365 sources, including Azure AD, and Microsoft Cloud App Security. Data collection methods include agents that are installed directly on monitored event source, collection of data using APIs provided by monitored event source, and real-time Syslog stream collection.


## Global prerequisites

1.  Log Analytics workspace. Learn how to [create a Log Analytics workspace](../log-analytics/log-analytics-quick-create-workspace.md)

2. Contributor permissions to your Log Analytics workspace
3.  Tenant global or security admin permissions (some data sources)

## Enable Azure Sentinel

1. Go into the Azure portal.
2. Make sure that the subscription in which Azure Sentinel is created, is selected. 
3. Search for Azure Sentinel. 
4. Click **+Add**.
5. Select which workspace you want to use or create a new one. You can run Azure Sentinel on more than one workspace, but the data will be isolated to a single workspace.

>[!NOTE] 
> - **Workspace location**  It's important to understand that all the data that you stream to Azure Sentinel will be stored in the geographic location of the workspace you selected.  
> - You won't see the ASC default workspaces here, you can't run Azure Sentinel on them.

6. Click **Add security insights**.


## Connect data sources

Azure Sentinel creates the connection to services and apps by connecting to the service and forwarding the events and logs to Azure Sentinel. For machines and virtual machines, Azure Sentinel installs an agent that collects the logs and forwards them to Azure Sentinel. For Firewalls and proxies, Azure Sentinel utilizes a Linux Syslog server on which the agent is installed and from which the agent collects the log files and forwards them to Azure Sentinel. 
 
1. Click **Data collection**.
2. The **Sources** tab provides a list of what you can connect.<br>
For example, click **Azure Active Directory**. If you connect this data source, you stream all the logs from Azure AD into Azure Sentinel. Follow the installation instructions or refer to the relevant connection guide for more information. You can select what type of logs you wan to get - Sign-in logs and or Audit logs. For Azure AD, it gives you information about what type of licenses you need for this to work. 
At the bottom, Azure Sentinel provides recommendations for which dashboards you should install for each connector, and which alert rules you should add so that you already [view dashboards](sentinel-qs-get-visibility.md) and [get alerts](tutorial-detect-threats.md) on the data from this connection.

8. Use the sample query data if you want to start building queries in Log Analytics that run on this data. The samples help by providing you with basic queries including the correct parameter names for data of this type.


For information about machines, services, and apps that are natively connected to Azure Sentinel, see [X](sentinel-connect-aad.md).
For information about other on-premises machines, services, and apps that can be connected to Azure Sentinel, see [X](sentinel-connect-cef.md).

Azure Sentinel also collects [Syslog](sentinel-connect-syslog.md) and [CEF over Syslog](sentinel-connect-cef.md) formatted events. If your solution supports CEF, it is recommended that you save your log events as CEF because of Azure Sentinel's integration with Log Analytics, which parses and normalizes the data best from CEF. In addition, CEF data analyzed with Azure Sentinel includes Threat Intelligence enrichment from Microsoft Threat Intelligence feeds.








## Next steps
In this document, you learned about connecting data sources to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
