---
title: Connect Azure Active Directory data to Azure Sentinel | Microsoft Docs
description: Learn how to collect data from Azure Active Directory, and stream Azure AD sign-in, audit, and provisioning logs into Azure Sentinel.
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
ms.date: 04/21/2021
ms.author: yelevin

---
# Connect Azure Active Directory (Azure AD) data to Azure Sentinel

You can use Azure Sentinel's built-in connector to collect data from [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) and stream it into Azure Sentinel. The connector allows you to stream the following log types:

- [**Sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md), which contain information about [interactive user sign-ins](../active-directory/reports-monitoring/concept-all-sign-ins.md#user-sign-ins) where a user provides an authentication factor.

    The Azure AD connector now includes the following three additional categories of sign-in logs, all currently in **PREVIEW**:
    
    - [**Non-interactive user sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md#non-interactive-user-sign-ins), which contain information about sign-ins performed by a client on behalf of a user without any interaction or authentication factor from the user.
    
    - [**Service principal sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md#service-principal-sign-ins), which contain information about sign-ins by apps and service principals that do not involve any user. In these sign-ins, the app or service provides a credential on its own behalf to authenticate or access resources.
    
    - [**Managed Identity sign-in logs**](../active-directory/reports-monitoring/concept-all-sign-ins.md#managed-identity-for-azure-resources-sign-ins), which contain information about sign-ins by Azure resources that have secrets managed by Azure. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

- [**Audit logs**](../active-directory/reports-monitoring/concept-audit-logs.md), which contain information about system activity relating to user and group management, managed applications, and directory activities.

- [**Provisioning logs**](../active-directory/reports-monitoring/concept-provisioning-logs.md) (also in **PREVIEW**), which contain system activity information about users, groups, and roles provisioned by the Azure AD provisioning service. 

> [!IMPORTANT]
> As indicated above, some of the available log types are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
## Prerequisites

- An Azure Active Directory P1 or P2 license is required to ingest sign-in logs into Azure Sentinel. Any Azure AD license (Free/O365/P1/P2) is sufficient to ingest the other log types. Additional per-gigabyte charges may apply for Azure Monitor (Log Analytics) and Azure Sentinel.

- Your user must be assigned the Azure Sentinel Contributor role on the workspace.

- Your user must be assigned the Global Administrator or Security Administrator roles on the tenant you want to stream the logs from.

- Your user must have read and write permissions to the Azure AD diagnostic settings in order to be able to see the connection status. 

## Connect to Azure Active Directory

1. In Azure Sentinel, select **Data connectors** from the navigation menu.

1. From the data connectors gallery, select **Azure Active Directory** and then select **Open connector page**.

1. Mark the check boxes next to the log types you want to stream into Azure Sentinel (see above), and click **Connect**.

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
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
