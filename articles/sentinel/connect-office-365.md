---
title: Connect Office 365 data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Office 365 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: ff7c862e-2e23-4a28-bd18-f2924a30899d
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Office 365 Logs

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream audit logs from [Office 365](https://docs.microsoft.com/office365/admin/admin-home?view=o365-worldwide) into Azure Sentinel with a single click. You can stream audit logs from multiple tenants to a single workspace in Azure Sentinel. The Office 365 activity log connector provides insight into ongoing user activities. You will get information about various user, admin, system, and policy actions and events from Office 365. By connecting Office 365 logs into Azure Sentinel you can use this data to view dashboards, create custom alerts, and improve your investigation process.


## Prerequisites

- You must be a global administrator or security administrator on your tenant
- On your computer, from which you logged into Azure Sentinel to create the connection, make sure that port 4433 is open to web traffic.

## Connect to Office 365

1. In Azure Sentinel, select **Data connectors** and then click the **Office 365** tile.

2. If you have not already enabled it, under **Connection** use the **Enable** button to enable the Office 365 solution. If it was already enabled, it will be identified in the connection screen as already enabled.
1. Office 365 enables you to stream data from multiple tenants to Azure Sentinel. For each tenant you want to connect to, add the tenant under **Connect tenants to Azure Sentinel**. 
1. An Active Directory screen opens. You are prompted to authenticate with a global admin user on each tenant you want to connect to Azure Sentinel, and provide permissions to Azure Sentinel to read its logs. 
5. Under Stream Office 365 activity logs, click **Select** to choose which log types you want to stream to Azure Sentinel. Currently, Azure Sentinel supports Exchange and SharePoint.

4. Click **Apply changes**.

3. To use the relevant schema in Log Analytics for the Office 365 logs, search for **OfficeActivity**.


## Next steps
In this document, you learned how to connect Office 365 to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

