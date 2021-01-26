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
ms.date: 01/20/2021
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

1. Mark the check boxes next to the log types you want to stream into Azure Sentinel, and click **Connect**. These are the log types you can choose from:

    - **Sign-in logs**: Information about the usage of managed applications and user sign-in activities.
    - **Audit logs**: System activity information about user and group management, managed applications, and directory activities.
    - **Non-interactive user sign-in logs**: Information about sign-ins performed by a client on behalf of a user, which don't require any interaction or authentication factor from the user.
    - **Service principal sign-in logs**: Information about sign-ins by apps and service principals that do not involve any user. In these sign-ins, the app or service provides a credential on its own behalf to authenticate or access resources.
    - **Managed Identity sign-in logs**: Sign-ins by Azure resources that have secrets managed by Azure.
    - **Provisioning logs**: System activity information about users, groups, and roles provisioned by the Azure AD provisioning service.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **LogManagement** section, in the following tables:

- `SigninLogs`
- `AuditLogs`
- `AADNonInteractiveUserSignInLogs`
- `AADServicePrincipalSignInLogs`
- `AADManagedIdentitySignInLogs`
- `AADProvisioningLogs`

To query the Azure AD logs, enter the relevant table name at the top of the query window.

## Next steps
In this document, you learned how to connect Azure Active Directory to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
