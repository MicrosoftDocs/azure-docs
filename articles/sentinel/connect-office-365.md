---
title: Connect Office 365 data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Office 365 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/12/2020
ms.author: yelevin

---
# Connect data from Office 365 Logs



You can stream audit logs from [Office 365](https://docs.microsoft.com/office365/admin/admin-home?view=o365-worldwide) into Azure Sentinel with a single click. You can stream audit logs from your Office 365 into your Azure Sentinel workspace on the same tenant. The Office 365 activity log connector provides insight into ongoing user activities. You will get information about various user, admin, system, and policy actions and events from Office 365. By connecting Office 365 logs into Azure Sentinel you can use this data to view dashboards, create custom alerts, and improve your investigation process.

> [!IMPORTANT]
> If you have an E3 license, before you can access data through the Office 365 Management Activity API, you must enable unified audit logging for your Office 365 organization. You do this by turning on the Office 365 audit log. For instructions, see [Turn Office 365 audit log search on or off](https://docs.microsoft.com/office365/securitycompliance/turn-audit-log-search-on-or-off). See [Office 365 management Activity API reference](https://docs.microsoft.com/office/office-365-management-api/office-365-management-activity-api-reference), for more information.

## Prerequisites

- You must be a global administrator or security administrator on your tenant.
- Your tenant must have unified auditing enabled. Tenants with Office 365 E3 or E5 licenses have unified auditing enabled by default. <br>If your tenant does not have one of these licenses, you must enable unified auditing on your tenant using one of these methods:
    - [Using the Set-AdminAuditLogConfig cmdlet](https://docs.microsoft.com/powershell/module/exchange/policy-and-compliance-audit/set-adminauditlogconfig?view=exchange-ps) and enable the parameter “UnifiedAuditLogIngestionEnabled”).
    - [Using the Security & Compliance Center UI](https://docs.microsoft.com/office365/securitycompliance/search-the-audit-log-in-security-and-compliance#before-you-begin).

## Connect to Office 365

1. In Azure Sentinel, select **Data connectors** and then click the **Office 365** tile.

2. If you have not already enabled it, you can do so by going to **Data Connectors** blade and selecting **Office 365** connector. Here you can click the **Open Connector Page** and under configuration section labeled **Configuration** select all the Office 365 activity logs you want to connect to Azure Sentinel. 
   > [!NOTE]
   > If you already connected multiple tenants in a previously supported version of the Office 365 connector in Azure Sentinel, you will be able to view and modify which logs you collect from each tenant. You will not be able to add additional tenants, but you can remove previously added tenants.
3. To use the relevant schema in Log Analytics for the Office 365 logs, search for **OfficeActivity**.


## Next steps
In this document, you learned how to connect Office 365 to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

