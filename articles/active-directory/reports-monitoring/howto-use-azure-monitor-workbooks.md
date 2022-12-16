---
title: Azure Monitor workbooks for Azure Active Directory | Microsoft Docs
description: Learn how to use Azure Monitor workbooks for Azure Active Directory reports.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 12/15/2022
ms.author: sarahlipsey
ms.reviewer: sarbar
---
# How to use Azure Monitor workbooks for Azure Active Directory

When working with workbooks, you can either start with an empty workbook, or use an existing template. Workbook templates enable you to quickly get started using workbooks without needing to build from scratch. 

- **Public templates** published to a [gallery](../../azure-monitor/visualize/workbooks-overview.md#the-gallery) are a good starting point when you're just getting started with workbooks.
- **Private templates** are helpful when you start building your own workbooks and want to save one as a template to serve as the foundation for multiple workbooks in your tenant.

## Prerequisites

To use workbooks, you need an Azure Active Directory tenant with a premium (P1 or P2) license. Learn how to [get a premium license](../fundamentals/active-directory-get-started-premium.md).

To use workbooks, you'll need to have the appropriate roles for the Log Analytics workspace *and* Azure Active Directory. You'll also need to have a Log Analytics workspace set up before you can use workbooks.

- Create a [Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md)
- [Log Analytics Reader](../../azure-monitor/logs/manage-access.md#log-analytics-reader): Can view all monitoring data and configuration settings
- [Log Analytics Contributor](../../azure/azure-monitor/logs/manage-access.md#azure-rbac): Adds the ability to edit configuration settings, run search jobs, and more
- [Access](../../azure-monitor/logs/manage-access.md) to the Log Analytics workspace
- One of the following roles in Azure AD (if you're accessing the workspace through the Azure AD portal)
    - Security Administrator
    - Security Reader
    - Reports Reader
    - Global Administrator
- To access workbooks in Azure Active Directory, you must have access to the underlying [Log Analytics workspace](../../azure-monitor/logs/manage-access.md#azure-rbac) and be assigned to one of the following roles:
    - Global Reader
    - Reports Reader
    - Security Reader
    - Application Administrator 
    - Cloud Application Administrator
    - Company Administrator
    - Security Administrator

## How to access workbooks

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Azure Active Directory** > **Monitoring** > **Workbooks**. 
    - **Workbooks**: All workbooks created in your tenant
    - **Public Templates**: Pre-built workbooks for common or high priority scenarios
    - **My Templates**: Templates you've created
1. Select a report or template from the list.
    - Search for a template by name.
    - Select the **Browse across galleries** to view templates that aren't specific to Azure AD.

    ![Find the Azure Monitor workbooks in Azure AD](./media/howto-use-azure-monitor-workbooks/azure-monitor-workbooks-in-azure-ad.png)

Workbooks may take a few moments to populate. 

## Next steps

* [Create interactive reports by using Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md).
* [Create custom Azure Monitor queries using Azure PowerShell](../governance/entitlement-management-logs-and-reporting.md).