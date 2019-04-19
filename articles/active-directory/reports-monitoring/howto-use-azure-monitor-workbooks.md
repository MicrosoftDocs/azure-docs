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

[Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks) combine text, Analytics queries, Azure Metrics, and parameters into rich interactive reports. Azure Active Directory provides workbooks that help you gain insights into your environment.

This article:

- Assumes that you are familiar with how to [Create interactive reports with Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks).

- Explains how you can use the Azure Monitor workbooks about monitoring.
 


## Prerequisites

To use this feature, you need:

1. An Azure Active Directory tenant, with a premium (P1/P2) license. Learn how to [get a premium license](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-get-started-premium).
2. A [Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).

## Access workbooks about monitoring  

To Access workbooks about monitoring:

1. Sign in to your [Azure portal](https://portal.azure.com).

2. On the left navbar, click **Azure Active Directory**.

3. In the **Monitoring** section, click **Insights**. 

    ![Insights](./media/howto-use-azure-monitor-workbooks/41.png)

4. Click a report or template, or click **Open** in the toolbar. 

    ![Gallery](./media/howto-use-azure-monitor-workbooks/42.png)


## Sign-in analysis

To access the sign-in analysis data, click **Sign-ins** in the **Usage** section. 

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


To access the sign-ins data, click **Sign-ins using Legacy Authentication** in the **Usage** section. 

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


To access the sign-ins by conditional access data, click **Sign-ins using Legacy Authentication** in the **Conditional access** section. 

This workbook shows the trend for disabled sign-ins.

You can filter each trend by:

- Time range

- Apps

- Users

![Gallery](./media/howto-use-azure-monitor-workbooks/49.png)


For each trend, you get a breakdown by app and protocol.

![Gallery](./media/howto-use-azure-monitor-workbooks/48.png)








## Sign-ins by grant controls

To access the sign-ins by conditional access data, click **Sign-ins using Legacy Authentication** in the **Conditional access** section. 

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


For troubleshooting sign-ins, you get a breakdown by:

- Top errors

    ![Gallery](./media/howto-use-azure-monitor-workbooks/53.png)

- Sign-ins waiting on user action

    ![Gallery](./media/howto-use-azure-monitor-workbooks/54.png)






## Next steps

* [Create interactive reports with Azure Monitor workbooks](https://docs.microsoft.com/azure/azure-monitor/app/usage-workbooks)