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

## Azure Workbooks overview

Azure AD DS includes the following two workbook templates:

* Security overview report
* Account activity report

To access these workbook templates, search for and select **Azure Active Directory Domain Services** in the Azure portal, select your managed domain, then choose **Monitoring > Workbooks**.

-- INSERT IMAGE OF WORKBOOKS IN AZURE PORTAL --

## Use security overview report workbook

## Use account activity report workbook

## Next steps

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[enable-security-audits]: security-audit-events.md
