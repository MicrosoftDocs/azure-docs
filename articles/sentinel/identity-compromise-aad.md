---
title: Using Microsoft resources to respond to supply chain attacks and systemic identity compromise | Microsoft Docs
description: Learn how to use Microsoft resources to respond to supply chain attacks and systemic identity compromises similar to the SolarWinds attack (Solorigate).
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# Using Azure Active Directory to respond to supply chain attacks and systemic identity threats

Microsoft has published a specific Azure AD workbook in the Azure administration portal to help you assess your organization's Solorigate risk and investigate any Identity-related indicators of compromise (IOCs) related to the attacks. 

- [Access the Microsoft Azure AD Solorigate workbook](#access-the-microsoft-azure-ad-solorigate-workbook)
- [Data shown in the Microsoft Azure AD Solorigate workbook](#data-shown-in-the-microsoft-azure-ad-solorigate-workbook)

> [!NOTE]
> The information in this workbook is also available in Azure AD audit and sign-in logs. The workbook helps to collect and visualize the information in a single view.
>
>This workbook includes an overview of some of the common attack patterns in AAD, not only in Solorigate, and can generally be useful as an investigation aid to ensure that your environment is safe from malicious actors.
>

For more information, see [Solorigate indicators of compromise (IOCs)](#solorigate-indicators-of-compromise-iocs).

## Access the Microsoft Azure AD Solorigate workbook

**Prerequisite**: Your Azure AD sign-in and audit logs must be integrated with Azure Monitor.

Integrating your logs with Azure Monitor enables you to store, query, and visualize your logs using workbooks for up to two years. Only sign-in and audit events created after the integration are stored, so this workbook will not contain any insights prior to the date of integration.

For more information, see [How to integrate activity logs with Log Analytics](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics).

**To access the Azure AD workbook for Solorigate**:
 
1. Sign into the [Azure portal](https://portal.azure.com) and navigate to **Azure Active Directory**.

1. Scroll down the menu on the left, and under **Monitoring**, select **Workbooks**.

1. The **Troubleshoot** area, select the **Sensitive Operations Report**. 

## Data shown in the Microsoft Azure AD Solorigate workbook

In your [workbook](#access-the-microsoft-azure-ad-solorigate-workbook), expand each of the following areas to learn more about activity detected in your tenant:

|Area  |Description  |
|---------|---------|
|**Modified application and service principal credentials/authentication methods**     |   Helps you detect any new credentials that were added to existing applications and service principals. <br><br>These new credentials allow attackers to authenticate as the target application or service principal, granting them access to all resources where it has permissions. <br><br>This area of the workbook displays the following data for your tenant: <br>- **All new credentials added** to applications and service principals, including the credential type <br>- **A list of the top actors**, and the number of credential modifications they performed <br>- **A timeline** for all credential changes <br><br>Use filters to drill down to suspicious actors or modified service principals.    <br><br>For more information, see [Apps & service principals in Azure AD - Microsoft identity platform](/azure/active-directory/develop/app-objects-and-service-principals).  |
|**Modified federation settings**     |   Helps you understand changes performed to existing domain federation trusts, which can help an attacker to gain a long-term foothold in the environment by adding an attacker-controlled SAML IDP as a trusted authentication source. <br><br>This area of the workbook displays the following data for your tenant: <br>- Changes performed to existing domain federation trusts <br>- Any addition of new domains and trusts <br><br>**Important**: Any actions that modify or add domain federation trusts are rare and should be treated as high fidelity to be investigated as soon as possible. <br><br>For more information, see [What is federation with Azure AD?](/azure/active-directory/hybrid/whatis-fed)|
|**Azure AD STS refresh token modifications by service principals and applications other than DirectorySync**     |  Lists any manual modifications made to refresh tokens, which are used to validate identification and obtain access tokens. <br><br>**Tip**: While manual modifications to refresh tokens may be legitimate, they have also been generated as a result of malicious token extensions. We recommend checking any new token validation time periods with high values, and investigating whether the change was legitimate or an attacker's attempt to gain persistence. <br><br>For more information, see [Refresh tokens in Azure AD](/azure/active-directory/develop/active-directory-configurable-token-lifetimes#refresh-tokens).  |
|**New permissions granted to service principals**     |  Helps you investigate any suspicious permissions added to an existing application or service principal. <br><br>Attackers may add permissions to existing applications or service principals when they are unable to find one that already has a highly privileged set of permissions they can use to gain access. <br><br>**Tip**: We recommend that administrators investigate any instances of excessively high permissions, included but not limited to: Exchange Online, Microsoft Graph, or Azure AD Graph <br><br>For more information, see [Microsoft identity platform scopes, permissions, and consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent).       |
|**Directory role and group membership updates for service principals**     |This area of the workbook provides an overview of all changes made to service principal memberships. <br><br>**Tip**: We recommend that you review the information for any additions to highly privileged roles and groups, which is another step an attacker might take in attempting to gain access to an environment.         |
|     |         |

## Next steps
