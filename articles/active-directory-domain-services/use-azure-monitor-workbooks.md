---
title: Use Azure Monitor Workbooks with Azure AD Domain Services | Microsoft Docs
description: Learn how to use Azure Monitor Workbooks to review security audits and understand issues in an Azure Active Directory Domain Services managed domain.
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 03/10/2020
ms.author: iainfou

---
# Review security audit events in Azure AD Domain Services using Azure Monitor Workbooks

To help you understand the health of your Azure Active Directory Domain Services (Azure AD DS) managed domain, security audit events can be enabled. These security audit events can be reviewed using Azure Monitor Workbooks which combine text, analytics queries, Azure Metrics, and parameters into rich interactive reports. Workbook templates for security overview and account activity let you dig into audit events and manage your environment.

This article shows you how to use Azure Monitor Workbooks to review security audit events in Azure AD DS.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].
* Security audit events enabled for your Azure Active Directory Domain Services managed domain.
    * If needed, [enable security audits for Azure Active Directory Domain Services][enable-security-audits].

## Azure Monitor Workbooks overview

When security audit events are turned on in Azure AD DS, it can be hard to analyze and identify issues in the managed domain. Azure Monitor lets you aggregate these security audit events and query the data. With Azure Monitor Workbooks, you can visualize this data to make it quicker and easier to identify issues.

Workbook templates are curated reports that are designed for flexible reuse by multiple users and teams. When you open a workbook template, the data from your Azure Monitor environment is loaded. You can use templates without an impact on other users in your organization, and can save your own workbooks based on the template.

Azure AD DS includes the following two workbook templates:

* Security overview report
* Account activity report

For more information about how to edit and manage workbooks, see [Azure Monitor Workbooks overview](../azure-monitor/platform/workbooks-overview.md).

## Use security overview report workbook

To access the workbook templates, complete the following steps:

1. Search for and select **Azure Active Directory Domain Services** in the Azure portal.
1. Select your managed domain, such as *aaddscontoso.com*
1. From the menu on the left-hand side, choose **Monitoring > Workbooks**

    ![Select the Workbooks menu option in the Azure portal](./media/use-azure-monitor-workbooks/select-workbooks-in-azure-portal.png)

1. Choose the **Security Overview Report**.
1. From the drop-down menus at the top of the workbook, select your Azure subscription and then Azure Monitor workspace. Choose a **Time range**, such as *Last 7 days*.

    ![Select the Workbooks menu option in the Azure portal](./media/use-azure-monitor-workbooks/select-query-filters.png)

    The **Tile view** and **Chart view** options can also be changed to analyze and visualize the data as desired, as shown in the following example:

    ![Example Security Overview Report data visualized in Azure Monitor Workbooks](./media/use-azure-monitor-workbooks/example-security-overview-report.png)

## Use account activity report workbook

## Next steps

If you need to adjust password and lockout policies, see [Password and account lockout policies on managed domains][password-policy].

For problems with users, learn how to troubleshoot [account sign-in problems][troubleshoot-sign-in] or [account lockout problems][troubleshoot-account-lockout].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[enable-security-audits]: security-audit-events.md
[password-policy]: password-policy.md
[troubleshoot-sign-in]: troubleshoot-sign-in.md
[troubleshoot-account-lockout]: troubleshoot-account-lockout.md
