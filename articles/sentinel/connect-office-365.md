---
title: Connect Office 365 data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Office 365 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/23/2019
ms.author: rkarlin

---
# Connect data from Office 365 Logs



You can stream audit logs from [Office 365](https://docs.microsoft.com/office365/admin/admin-home?view=o365-worldwide) into Azure Sentinel with a single click. You can stream audit logs from multiple tenants to a single workspace in Azure Sentinel. The Office 365 activity log connector provides insight into ongoing user activities. You will get information about various user, admin, system, and policy actions and events from Office 365. By connecting Office 365 logs into Azure Sentinel you can use this data to view dashboards, create custom alerts, and improve your investigation process.

> [!IMPORTANT]
> If you have an E3 license, before you can access data through the Office 365 Management Activity API, you must enable unified audit logging for your Office 365 organization. You do this by turning on the Office 365 audit log. For instructions, see [Turn Office 365 audit log search on or off](https://docs.microsoft.com/office365/securitycompliance/turn-audit-log-search-on-or-off). See [Office 365 management Activity API reference](https://docs.microsoft.com/office/office-365-management-api/office-365-management-activity-api-reference), for more information.

## Prerequisites

- You must be a global administrator or security administrator on your tenant
- On your computer, from which you logged into Azure Sentinel to create the connection, make sure that port 4433 is open to web traffic. This port can be closed again after the connection is successfully made.
- If your tenant does not have an Office 365 E3 or Office 365 E5 license, you must enable unified auditing on your tenant using one of these processes:
    - [Using the Set-AdminAuditLogConfig cmdlet](https://docs.microsoft.com/powershell/module/exchange/policy-and-compliance-audit/set-adminauditlogconfig?view=exchange-ps) and enable the parameter “UnifiedAuditLogIngestionEnabled”).
    - [Or using the Security & Compliance Center UI](https://docs.microsoft.com/office365/securitycompliance/search-the-audit-log-in-security-and-compliance#before-you-begin).

## Connect to Office 365

1. In Azure Sentinel, select **Data connectors** and then click the **Office 365** tile.

2. If you have not already enabled it, you can do so by going to **Data Connectors** blade and selecting **Office 365** connector. Here you can click the **Open Connector Page** and under configuration section labelled **Enable the Office 365 solution on your workspace** use the **Install solution** button to enable it. If it was already enabled, it will be identified in the connection screen as already enabled.
1. Office 365 enables you to stream data from multiple tenants to Azure Sentinel. For each tenant you want to connect to, add the tenant under **Connect tenants to Azure Sentinel**. 
1. An Active Directory screen opens. You are prompted to authenticate with a global admin user on each tenant you want to connect to Azure Sentinel, and provide permissions to Azure Sentinel to read its logs. 
5. Under the tenant list you would see the Azure AD directory ID (tenant ID) and two checkboxes for Exchange and Sharepoint logs . You can select any or all the listed services which you would like to ingest in Sentinel. Currently, Azure Sentinel supports Exchange and SharePoint logs within existing Office365 services.

4. Once you have selected the services (Exchange, sharepoint etc. ) you can click save on the tenant addition frame on the page. 

3. To use the relevant schema in Log Analytics for the Office 365 logs, search for **OfficeActivity**.


## Next steps
In this document, you learned how to connect Office 365 to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

