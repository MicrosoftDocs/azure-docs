---

title: Use Azure Monitor workbooks for Azure Active Directory reports | Microsoft Docs
description: Learn how to use Azure Monitor workbooks for Azure Active Directory reports.
services: active-directory
author: MarkusVi
manager: daveba

ms.assetid: 4066725c-c430-42b8-a75b-fe2360699b82
ms.service: active-directory
ms.devlang:
ms.topic: conceptual
ms.tgt_pltfrm:
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/18/2019
ms.author: markvi
ms.reviewer: dhanyahk
---

# How to use Azure Monitor workbooks for Azure Active Directory reports

Do you want to:

- Understand the affect of your [conditional access policies](../conditional-access/overview.md) on your users' sign-in experience?

- Troubleshoot sign-in failures to get a better view of your organization's sign-in health and to resolve issues quickly?

- Know who's using legacy authentications to sign in to your environment? (By [blocking legacy authentication](../conditional-access/block-legacy-authentication.md), you can improve your tenant's protection.)

To help you to find answers to these questions, Active Directory provides workbooks for monitoring. [Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks) combine text, analytics queries, metrics, and parameters into rich interactive reports. 

This article:

- Assumes you're familiar with how to [Create interactive reports with Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks).

- Explains how you can use the Monitor workbooks to understand the affect of your conditional access policies, troubleshoot sign-in failures, and identify legacy authentications.
 


## Prerequisites

To use this feature, you need:

- An Active Directory tenant, with a premium (P1/P2) license. Learn how to [get a premium license](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-get-started-premium).

- A [Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).

## Access workbooks 

To access workbooks:

1. Sign in to your [Azure portal](https://portal.azure.com).

2. On the left navbar, select **Azure Active Directory**.

3. In the **Monitoring** section, select **Insights**. 

    ![Insights](./media/howto-use-azure-monitor-workbooks/41.png)

4. Select a report or template, or on the toolbar select **Open**. 

    ![Gallery](./media/howto-use-azure-monitor-workbooks/42.png)


## Sign-in analysis

To access the sign-in analysis workbook, select **Sign-ins** in the **Usage** section. 

This workbook shows the following sign-in trends:

- All sign-ins

- Success

- Pending user action

- Failure

You can filter each trend by:

- Time range

- Apps

- Users

![Gallery](./media/howto-use-azure-monitor-workbooks/43.png)


For each trend, you get a breakdown by:

- Location

    ![Gallery](./media/howto-use-azure-monitor-workbooks/45.png)

- Device

    ![Gallery](./media/howto-use-azure-monitor-workbooks/46.png)


## Sign-ins using legacy authentication 


To access the sign-ins using [legacy authentication](../conditional-access/block-legacy-authentication.md) workbook, select **Sign-ins using Legacy Authentication** in the **Usage** section. 

This workbook shows the following sign-in trends:

- All sign-ins

- Success


You can filter each trend by:

- Time range

- Apps

- Users

- Protocols 

![Gallery](./media/howto-use-azure-monitor-workbooks/47.png)


For each trend, you get a breakdown by app and protocol.

![Gallery](./media/howto-use-azure-monitor-workbooks/48.png)



## Sign-ins by conditional access 


To access the sign-ins by [conditional access policies](../conditional-access/overview.md) workbook, select **Sign-ins by Conditional Access** in the **Conditional access** section. 

This workbook shows the trend for disabled sign-ins.

You can filter each trend by:

- Time range

- Apps

- Users

![Gallery](./media/howto-use-azure-monitor-workbooks/49.png)


For the disabled sign-ins, you get a breakdown by the conditional access status.

![Conditional access status](./media/howto-use-azure-monitor-workbooks/conditional-access-status.png)








## Sign-ins by grant controls

To access the sign-ins by using [grant controls](../conditional-access/controls.md) workbook, select **Sign-ins by Grant Controls** in the **Conditional access** section. 

This workbook shows the following disabled sign-in trends:

- Require MFA
 
- Require terms of use

- Require privacy statement

- Other


You can filter each trend by:

- Time range

- Apps

- Users

![Gallery](./media/howto-use-azure-monitor-workbooks/50.png)


For each trend, you get a breakdown by app and protocol.

![Gallery](./media/howto-use-azure-monitor-workbooks/51.png)




## Sign-ins failure analysis

Use the **Sign-ins failure analysis** workbook to troubleshoot errors with:

- Sign-ins
- Conditional access policies
- Legacy authentication. 


To access the sign-ins by conditional access data, select **Sign-ins using Legacy Authentication** in the **Troubleshoot** section. 

This workbook shows the following sign-in trends:

- All sign-ins

- Success

- Pending action

- Failure


You can filter each trend by:

- Time range

- Apps

- Users

![Gallery](./media/howto-use-azure-monitor-workbooks/52.png)


To troubleshoot sign-ins, you get a breakdown by:

- Top errors

    ![Gallery](./media/howto-use-azure-monitor-workbooks/53.png)

- Sign-ins waiting on user action

    ![Gallery](./media/howto-use-azure-monitor-workbooks/54.png)






## Next steps

[Create interactive reports with Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks).