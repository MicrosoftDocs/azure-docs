---

title: Use Azure Monitor workbooks for Azure Active Directory reports | Microsoft Docs
description: Learn how to use the Azure Monitor workbooks for Azure Active Directory reports
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

# How to: Use Azure Monitor workbooks for Azure Active Directory reports

Do you want to:

- Understand the impact of your [conditional access policies](../conditional-access/overview.md) on your users' sign in experience?

- Troubleshoot sign-in failures to get a better view of your organization sign-in health as well as resolve issues quickly?

- Know who is using legacy authentications to sign on to your environment? By [blocking legacy authentication](../conditional-access/block-legacy-authentication.md), you can improve your tenant's protection.


[Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks) combine text, Analytics queries, Azure Metrics, and parameters into rich interactive reports. Azure Active Directory provides you with workbooks for monitoring that help you to find answers to the questions above.

This article:

- Assumes that you are familiar with how to [Create interactive reports with Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks).

- Explains how you can use the Azure Monitor workbooks about monitoring to answer the questions above.
 


## Prerequisites

To use this feature, you need:

- An Azure Active Directory tenant, with a premium (P1/P2) license. Learn how to [get a premium license](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-get-started-premium).

- A [Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).

## Access workbooks 

To access workbooks:

1. Sign in to your [Azure portal](https://portal.azure.com).

2. On the left navbar, click **Azure Active Directory**.

3. In the **Monitoring** section, click **Insights**. 

    ![Insights](./media/howto-use-azure-monitor-workbooks/41.png)

4. Click a report or template, or click **Open** in the toolbar. 

    ![Gallery](./media/howto-use-azure-monitor-workbooks/42.png)


## Sign-in analysis

To access the sign-in analysis workbook, click **Sign-ins** in the **Usage** section. 

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


To access the sign-ins using [legacy authentication](../conditional-access/block-legacy-authentication.md) workbook, click **Sign-ins using Legacy Authentication** in the **Usage** section. 

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


To access the sign-ins by [conditional access policies](../conditional-access/overview.md) workbook, click **Sign-ins by Conditional Access** in the **Conditional access** section. 

This workbook shows the trend for disabled sign-ins.

You can filter each trend by:

- Time range

- Apps

- Users

![Gallery](./media/howto-use-azure-monitor-workbooks/49.png)


For the disabled sign-ins, you get a breakdown by the conditional access status.

![Conditional access status](./media/howto-use-azure-monitor-workbooks/conditional-access-status.png)








## Sign-ins by grant controls

To access the sign-ins by [grant controls](../conditional-access/controls.md) workbook, click **Sign-ins by Grant Controls** in the **Conditional access** section. 

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


To access the sign-ins by conditional access data, click **Sign-ins using Legacy Authentication** in the **Troubleshoot** section. 

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

* [Create interactive reports with Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks)