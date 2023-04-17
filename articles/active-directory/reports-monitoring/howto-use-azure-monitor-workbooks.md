---
title: Azure Monitor workbooks for Azure Active Directory
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

When using Azure Workbooks, you can either start with an empty workbook, or use an existing template. Workbook templates enable you to quickly get started using workbooks without needing to build from scratch. 

- **Public templates** published to a [gallery](../../azure-monitor/visualize/workbooks-overview.md#the-gallery) are a good starting point when you're just getting started with workbooks.
- **Private templates** are helpful when you start building your own workbooks and want to save one as a template to serve as the foundation for multiple workbooks in your tenant.

## Prerequisites

To use Azure Workbooks for Azure AD, you need:
- An Azure Active Directory (Azure AD) tenant with a premium (P1 or P2) license. Learn how to [get a premium license](../fundamentals/active-directory-get-started-premium.md)
- The appropriate roles for the Log Analytics workspace *and* Azure AD
- A Log Analytics workspace

1. Create a [Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md)
    - Access to the Log Analytics workspace is determined by the workspace settings, access to the resources sending the data to the workspace, and the method used to access the workspace.
    - To ensure you have the right access, review the [Manage access to Log Analytics workspaces](../../azure-monitor/logs/manage-access.md?tabs=tabs=portal#azure-rbac) article.

2. Ensure that you have one of the following roles in Azure AD (if you're accessing the workspace through the Azure portal):
    - Security Administrator
    - Security Reader
    - Reports Reader
    - Global Administrator

3. Ensure that you have the one of the following Azure roles for the subscription:
    - Global Reader
    - Reports Reader
    - Security Reader
    - Application Administrator 
    - Cloud Application Administrator
    - Company Administrator
    - Security Administrator
    - For more information on Azure subscription roles, see [Roles, permissions, and security in Azure Monitor](../../azure-monitor/roles-permissions-security.md).

## How to access Azure Workbooks for Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Azure Active Directory** > **Monitoring** > **Workbooks**. 
    - **Workbooks**: All workbooks created in your tenant
    - **Public Templates**: Pre-built workbooks for common or high priority scenarios
    - **My Templates**: Templates you've created
1. Select a report or template from the list. Workbooks may take a few moments to populate. 
    - Search for a template by name.
    - Select the **Browse across galleries** to view templates that aren't specific to Azure AD.

    ![Find the Azure Monitor workbooks in Azure AD](./media/howto-use-azure-monitor-workbooks/azure-monitor-workbooks-in-azure-ad.png)

## Create a new workbook

Workbooks can be created from scratch or from a template. When creating a new workbook, you can add elements as you go or use the **Advanced Editor** option to paste in the JSON representation of a workbook, copied from the [workbooks GitHub repository](https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/schema/workbook.json).

**To create a new workbook from scratch**:
1. Navigate to **Azure AD** > **Monitoring** > **Workbooks**.
1. Select **+ New**.
1. Select an element from the **+ Add** menu.

    For more information on the available elements, see [Creating an Azure Workbook](../../azure-monitor/visualize/workbooks-create-workbook.md).

    ![Screenshot of the Azure Workbooks +Add menu options.](./media/howto-use-azure-monitor-workbooks/create-new-workbook-elements.png)

**To create a new workbook from a template**:
1. Navigate to **Azure AD** > **Monitoring** > **Workbooks**.
1. Select a workbook template from the Gallery.
1. Select **Edit** from the top of the page.
    - Each element of the workbook has its own **Edit** button. 
    - For more information on editing workbook elements, see [Azure Workbooks Templates](../../azure-monitor/visualize/workbooks-templates.md)

1. Select the **Edit** button for any element. Make your changes and select **Done editing**.
        ![Screenshot of a workbook in Edit mode, with the Edit and Done Editing buttons highlighted.](./media/howto-use-azure-monitor-workbooks/edit-buttons.png)
1. When you're done editing the workbook, select the **Save As** to save your workbook with a new name.
1. In the **Save As** window:
    - Provide a **Title**, **Subscription**, **Resource Group** (you must have the ability to save a workbook for the selected Resource Group), and **Location**.
    - Optionally choose to save your workbook content to an [Azure Storage Account](../../azure-monitor/visualize/workbooks-bring-your-own-storage.md).
1. Select the **Apply** button.

## Next steps

* [Create interactive reports by using Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md).
* [Create custom Azure Monitor queries using Azure PowerShell](../governance/entitlement-management-logs-and-reporting.md).