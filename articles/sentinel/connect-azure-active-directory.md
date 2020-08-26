---
title: Connect Azure Active Directory data to Azure Sentinel | Microsoft Docs
description: Learn how to collect data from Azure Active Directory, and stream Azure AD sign-in logs and audit logs into Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 0a8f4a58-e96a-4883-adf3-6b8b49208e6a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/11/2020
ms.author: yelevin

---
# Connect data from Azure Active Directory (Azure AD)



You can use Azure Sentinel's built-in connector to collect data from [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) and stream it into Azure Sentinel. The connector allows you to stream [sign-in logs](../active-directory/reports-monitoring/concept-sign-ins.md) and [audit logs](../active-directory/reports-monitoring/concept-audit-logs.md).

## Prerequisites


- Any Azure AD license (Free/O365/P1/P2) is sufficient to ingest sign-in logs into Azure Sentinel. Additional per-gigabyte charges may apply for Azure Monitor (Log Analytics) and Azure Sentinel.

- Your user must be assigned the Azure Sentinel Contributor role on the workspace.

- Your user must be assigned the Global Administrator or Security Administrator roles on the tenant you want to stream the logs from.

- Your user must have read and write permissions to the Azure AD diagnostic settings in order to be able to see the connection status. 


## Connect to Azure Active Directory

1. In Azure Sentinel, select **Data connectors** from the navigation menu.

1. From the data connectors gallery, select **Azure Active Directory** and then select **Open connector page**.

1. Mark the check boxes next to the logs you want to stream into Azure Sentinel, and click **Connect**.

1. You can select whether you want the alerts from Azure AD to automatically generate incidents in Azure Sentinel. Under **Create incidents** select **Enable** to enable the default analytics rule that creates incidents automatically from alerts generated in the connected security service. You can then edit this rule under **Analytics** and then **Active rules**.

1. To use the relevant schema in Log Analytics for querying Azure AD alerts, type `SigninLogs` or `AuditLogs` in the query window.

## Next steps
In this document, you learned how to connect Azure Active Directory to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
