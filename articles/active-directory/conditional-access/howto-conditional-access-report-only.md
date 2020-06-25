---
title: Configure a Conditional Access policy in report-only mode - Azure Active Directory
description: Using report-only mode in Conditional Access to aid in adoption

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/26/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Configure a Conditional Access policy in report-only mode

To configure a Conditional Access policy in report-only mode:

> [!IMPORTANT]
> If your organization has not already, [Set up Azure Monitor integration with Azure AD](#set-up-azure-monitor-integration-with-azure-ad). This process must take place before data will be available to review.

1. Sign into the **Azure portal** as a Conditional Access administrator, security administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Configure the policy conditions and required grant controls as needed.
1. Under **Enable policy** set the toggle to **Report-only** mode.
1. Select **Save**

> [!TIP]
> You can edit the **Enable policy** state of an existing policy from **On** to **Report-only** but doing so will disable policy enforcement. 

View report-only result in Azure AD Sign-in logs.

To view the result of a report-only policy for a particular sign-in:

1. Sign into the **Azure portal** as a reports reader, security reader, security administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Sign-ins**.
1. Select a sign-in or add filters to narrow results.
1. In the **Details** drawer, select the **Report-only** tab to view the policies evaluated during sign-in.

> [!NOTE]
> When downloading the Sign-ins logs, choose JSON format to include Conditional Access report-only result data.

## Set up Azure Monitor integration with Azure AD

In order to view the aggregate impact of Conditional Access policies using the new Conditional Access Insights workbook, you must integrate Azure Monitor with Azure AD and export the sign-in logs. There are two steps to set up this integration: 

1. [Sign up for an Azure Monitor subscription and create a workspace](/azure/azure-monitor/learn/quick-create-workspace).
1. [Export the Sign-in logs from Azure AD to Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics).

More information about Azure Monitor pricing can be found on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). Resources to estimate costs, set a daily cap, or customize the data retention period, can be found in the article, [Manage usage and costs with Azure Monitor Logs](../../azure-monitor/platform/manage-cost-storage.md#estimating-the-costs-to-manage-your-environment).

## View Conditional Access Insights workbook

Once you've integrated your Azure AD logs with Azure Monitor, you can monitor the impact of Conditional Access policies using the new Conditional Access insights workbooks.

1. Sign into the **Azure portal** as a security administrator or global administrator.
1. Browse to **Azure Active Directory** > **Workbooks**.
1. Select **Conditional Access Insights**.
1. Select one or more policies from the **Conditional Access Policy** dropdown. All enabled policies are selected by default.
1. Select a time range (if the time range exceeds the available dataset, the report will show all available data). Once you have set the **Conditional Access Policy** and **Time Range** parameters, the report will load.
   1. Optionally, search for individual **Users** or **Apps** to narrow the scope of the report.
1. Select between viewing the data in the time range by the number of users or the number of sign-ins.
1. Depending on the **Data view**, the **Impact Summary** displays the number of users or sign-ins in the scope of the parameters chosen, grouped by Total number, **Success**, **Failure**, **User action required**, and **Not applied**. Select a tile to examine sign-ins of a particular result type. 
   1. If you have changed the workbook parameters, you can choose to save a copy for future use. Select the save icon at the top of the report and provide a name and location to save to.
1. Scroll down to view the breakdown of sign-ins for each condition.
1. View the **Sign-in Details** at the bottom of the report to investigate individual sign-in events filtered by selections above.

> [!TIP] 
> Need to drill down on a particular query or export the sign-in details? Select the button to the right of any query to open the query up in Log Analytics. Select Export to export to CSV or Power BI.

## Common problems and solutions

### Why are the queries in the workbook failing?

Customers have noticed that queries sometimes fail if the wrong or multiple workspaces are associated with the workbook. To fix this problem, click **Edit** at the top of the workbook and then the Settings gear. Select and then remove workspaces that are not associated with the workbook. There should be only one workspace associated with each workbook.

### Why doesn't the Conditional Access Policies dropdown parameter contain my policies?

The Conditional Access Policies dropdown is populated by querying the most recent sign-ins over a period of 4 hours. If a tenant doesn't have any sign-ins in the past 4 hours, it is possible that the dropdown will be empty. If this delay is a persistent problem, such as in small tenants with infrequent sign-ins, admins can edit the query for the Conditional Access Policies dropdown and extend the time for the query to a time longer than 4 hours.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

For more information about Azure AD workbooks, see the article, [How to use Azure Monitor workbooks for Azure Active Directory reports](../reports-monitoring/howto-use-azure-monitor-workbooks.md).
