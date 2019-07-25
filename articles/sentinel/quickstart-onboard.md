---
title: Onboard in Azure Sentinel Preview| Microsoft Docs
description: Learn how to collect data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: d5750b3e-bfbd-4fa0-b888-ebfab7d9c9ae
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/27/2019
ms.author: rkarlin
#As a security operator, connect all my data sources in one place so I can monitor and protect my environment
---
# On-board Azure Sentinel Preview

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this quickstart you will learn how to on-board Azure Sentinel. 

To on-board Azure Sentinel, you first need to enable Azure Sentinel, and then connect your data sources. Azure Sentinel comes with a number of connectors for Microsoft solutions, available out of the box and providing real-time integration, including Microsoft Threat Protection solutions, Microsoft 365 sources, including Office 365, Azure AD, Azure ATP, and Microsoft Cloud App Security, and more. In addition, there are built-in connectors to the broader security ecosystem for non-Microsoft solutions. You can also use common event format, Syslog or REST-API to connect your data sources with Azure Sentinel.  

After you connect your data sources, choose from a gallery of expertly created dashboards that surface insights based on your data. These dashboards can be easily customized to your needs.


## Global prerequisites

- Active Azure Subscription, if you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Log Analytics workspace. Learn how to [create a Log Analytics workspace](../log-analytics/log-analytics-quick-create-workspace.md)

-  To enable Azure Sentinel, you need contributor permissions to the subscription in which the Azure Sentinel workspace resides. 
- To use Azure Sentinel, you need either contributor or reader permissions on the resource group that the workspace belongs to
- Additional permissions may be needed to connect specific data sources
 
## Enable Azure Sentinel <a name="enable"></a>

1. Go into the Azure portal.
2. Make sure that the subscription in which Azure Sentinel is created, is selected. 
3. Search for Azure Sentinel. 
   ![search](./media/quickstart-onboard/search-product.png)

1. Click **+Add**.
1. Select the workspace you want to use or create a new one. You can run Azure Sentinel on more than one workspace, but the data is isolated to a single workspace.

   ![search](./media/quickstart-onboard/choose-workspace.png)

   >[!NOTE] 
   > - **Workspace location**  It's important to understand that all the data you stream to Azure Sentinel is stored in the geographic location of the workspace you selected.  
   > - Default workspaces created by Azure Security Center will not appear in the list; you can't install Azure Sentinel on them.
   > - Azure Sentinel can run on workspaces that are deployed in any of the following regions:  Australia Southeast, Canada Central, Central India, East US, East US 2 EUAP (Canary), Japan East, Southeast Asia, UK South, West Europe, West US 2.

6. Click **Add Azure Sentinel**.
  

## Connect data sources

Azure Sentinel creates the connection to services and apps by connecting to the service and forwarding the events and logs to Azure Sentinel. For machines and virtual machines, you can install the Azure Sentinel agent that collects the logs and forwards them to Azure Sentinel. For Firewalls and proxies, Azure Sentinel utilizes a Linux Syslog server. The agent is installed on it and from which the agent collects the log files and forwards them to Azure Sentinel. 
 
1. Click **Data collection**.
2. There is a tile for each data source you can connect.<br>
For example, click **Azure Active Directory**. If you connect this data source, you stream all the logs from Azure AD into Azure Sentinel. You can select what type of logs you wan to get - sign-in logs and/or audit logs. <br>
At the bottom, Azure Sentinel provides recommendations for which dashboards you should install for each connector so you can immediately get interesting insights across your data. <br> Follow the installation instructions or [refer to the relevant connection guide](connect-data-sources.md) for more information. For information about data connectors, see [Connect Microsoft services](connect-data-sources.md).

After your data sources are connected, your data starts streaming into Azure Sentinel and is ready for you to start working with. You can view the logs in the [built-in dashboards](quickstart-get-visibility.md) and start building queries in Log Analytics to [investigate the data](tutorial-investigate-cases.md).



## Next steps
In this document, you learned about connecting data sources to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
- Stream data from [Common Error Format appliances](connect-common-event-format.md) into Azure Sentinel.
