---
title: Connect Office 365 logs to Azure Sentinel | Microsoft Docs
description: Learn how to connect Office 365 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/21/2020
ms.author: yelevin

---
# Connect Office 365 Logs to Azure Sentinel

The [Office 365](https://docs.microsoft.com/office/) log connector brings into Azure Sentinel information on ongoing user and admin activities in **Exchange** and **SharePoint** (including **OneDrive**). This information includes details of actions such as file downloads, access requests sent, changes to group events, and mailbox operations, as well as the details of the user who performed the actions. Connecting Office 365 logs to Azure Sentinel enables you to view and analyze this data in your workbooks, query it to create custom alerts, and incorporate it to improve your investigation process, giving you more insight into your Office 365 security.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must be a global administrator or security administrator on your tenant.

- Your Office 365 deployment must be on the same tenant as your Azure Sentinel workspace.

> [!IMPORTANT]
> - In order for the connector to be able to access data through the Office 365 Management Activity API, you must have **unified audit logging** enabled on your Office 365 deployment. Depending on the type of Office 365 / Microsoft 365 license you have, it may or may not be enabled by default. Consult the [Office 365 Security and Compliance Center](https://docs.microsoft.com/office365/servicedescriptions/office-365-platform-service-description/office-365-securitycompliance-center) to check the status of unified audit logging according to your license type.
> - You can also manually enable, disable, and check the current status of Office 365 unified audit logging. For instructions, see [Turn Office 365 audit log search on or off](https://docs.microsoft.com/office365/securitycompliance/turn-audit-log-search-on-or-off).
> - For more information, see the [Office 365 Management Activity API reference](https://docs.microsoft.com/office/office-365-management-api/office-365-management-activity-api-reference).


   > [!NOTE]
   > As noted above, and as you'll see on the connector page under **Data types**, the Azure Sentinel Office 365 connector currently supports the ingestion of audit logs only from Microsoft Exchange and SharePoint (including OneDrive). However, there are some external solutions if you're interested in bringing [data from Teams](https://techcommunity.microsoft.com/t5/azure-sentinel/protecting-your-teams-with-azure-sentinel/ba-p/1265761) or [other Office data](https://techcommunity.microsoft.com/t5/azure-sentinel/ingesting-office-365-alerts-with-graph-security-api/ba-p/984888) into Azure Sentinel. 

## Enable the Office 365 log connector

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** list, click **Office 365**, and then the **Open connector page** button on the lower right.

1. Under the section labeled **Configuration**, mark the check boxes of the Office 365 activity logs you want to connect to Azure Sentinel, and click **Apply Changes**. 

   > [!NOTE]
   > If you had previously connected multiple tenants to Azure Sentinel, using an older version of the Office 365 connector which supported this, you will be able to view and modify which logs you collect from each tenant. You will not be able to add additional tenants, but you can remove previously added tenants.

1. To query Office 365 log data in Log Analytics, type `OfficeActivity` in the first line of the query window.

## Next steps
In this document, you learned how to connect Office 365 to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](tutorial-detect-threats-built-in.md) or [custom](tutorial-detect-threats-custom.md) rules.

