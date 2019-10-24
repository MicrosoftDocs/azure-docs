---
title: Configure a Conditional Access policy in report-only mode - Azure Active Directory
description: 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 10/22/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Configure a Conditional Access policy in report-only mode

To configure a Conditional Access policy in report-only mode:

1. Sign into the **Azure portal** as a Conditional Access administrator, security administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Configure the policy conditions and required grant controls as needed.
1. Under **Enable policy** set the toggle to **Report-only** mode.
1. Select **Save**

> [!TIP]
> You can edit the **Enable policy** state of an existing policy from **On** to **Report-only** but doing so will disable policy enforcement. 

View report-only result in Azure AD Sign-in logs (DOESNT APPEAR TO WORK AS INTENDED I DONT SEE REPORT ONLY POLICIES)

To view the result of a Report-only policy for a particular sign-in:

1. Sign into the **Azure portal** as a reports reader, security reader, security administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Sign-ins**.
1. Select a sign-in or add filters to narrow results.
1. In the **Details** drawer, select the **Conditional Access** tab to view the policies evaluated during sign-in.

## Setup Azure Monitor integration with Azure AD

In order to view the aggregate impact of Conditional Access policies using the new Conditional Access insights workbook, you must integrate Azure Monitor with Azure AD and export the sign-in logs. There are two steps to set this integration up: 

1. [Sign up for an Azure Monitor subscription and create a workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).
1. [Export the Sign-in logs from Azure AD to Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics).

More information about Azure Monitor pricing can be found on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/).

## View Conditional Access Insights Workbook

Once you’ve integrated your Azure AD logs with Azure Monitor, you can monitor the impact of Conditional Access policies using the new Conditional Access insights workbooks.

1. Sign into the **Azure portal** as a security administrator or global administrator.
1. Browse to **Azure Active Directory** > **Workbooks**.
1. Select **Conditional Access Insights**. (I SEE SINGLE POLICY INSIGHTS OR MULITPLE POLICIY INSIGHTS)
1. Select a policy from the **Conditional Access Policy** dropdown. (I ONLY ONLY SEE ENABLED POLCICIES)
1. Select a time range (if the time range exceeds the available dataset, the report will show all available data). Once you have set the **Conditional Access Policy** and **Time Range** parameters, the report will load. 
   1. Optionally, search for individual **Users** or **Apps** to narrow the scope of the report.
1. Select between viewing the data in the time range by the number of users or the number of sign-ins.
1. Depending on the **Data view**, the **Impact Summary** displays the number of users or sign-ins in the scope of the parameters chosen, grouped by Total number, **Success**, **Failure**, **User action required**, and **Not applied**. Select a tile to examine sign-ins of a particular result type. 
1. Scroll down to view the breakdown of sign-ins for each condition
1. View the **Sign-in Details** at the bottom of the report to investigate individual sign-in events filtered by selections above. 

> [!TIP] 
> Need to drill down on a particular query or export the sign-in details? Select the button to the right of any query to open the query up in Log Analytics. Select Export to export to CSV or Power BI.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
