---
title: Monitor and track usage of Azure free services | Microsoft Docs
description: Learn to check usage of free services. Use Azure portal and usage csv.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/25/2017
ms.author: cwatson

---
# Check usage of free services included with your Azure free account 

You are not charged for services included for free with Azure free account, unless you exceed the limits of these services. To remain with the limits, you can either use the Azure portal or your usage file to monitor and track the usage of free services. 

## Check usage on the Azure portal

1.	Log in to the [Azure portal]( http://portal.azure.com).

2.	From left navigation area, select **All services**.

3.	Select **Subscriptions**.

4.	Select the subscription that you created when you signed up for free account.

    ![Screenshot that shows all the subscriptions](./media/billing-check-usage-of-free-services/select-free-account-subscription.png)

5.  The overview section shows you essential information about your subscription such as subscription       ID,         offer type, and subscription name. You can also find information on when your free account          credit          would expire.

    ![Screenshot that shows subscription essential information](./media/billing-check-usage-of-free-services/subscription-essential-information.png)

6.  Scroll down to find information on your current and forecasted cost. The cost includes usage of                     services not included with your free account and usage exceeding the limits of free                                 services. 

    ![Screenshot that shows subscription cost information](./media/billing-check-usage-of-free-services/subscription-cost-information.png)

7.	The final part of the overview section has a table on usage of free services. 

    ![Screenshot that shows usage of free services](./media/billing-check-usage-of-free-services/subscription-usage-free-services.png)

    The table contains the following columns:

* **Meter Name:** Identifies the unit of measure for the meter being consumed. To learn about service to meter                        mapping, see [Understand free service to meter mapping](billing-understand-free-service-meter-mapping.md). 
* **Usage/Limit:** Current month's usage and limit for the meter. You can also find this information in the status bar.
* **Status:** Usage status of the meter. Based on your usage pattern, you can have one of these             statutes.
  * **Not in use:** You have not used the meter or the usage for the meter has not reached the billing system.
  * **Exceeded on \<Date>:** You have exceeded the limit for the meter on \<Date>.
  * **Unlikely to Exceed:** You are unlikely to exceed the limit for the meter.
  * **Exceeds on \<Date>:** You are likely to exceed the limit for the meter on \<Date>.


## Check usage through the usage file

Your usage file provides granular information for your Azure subscription. You can download your monthly and daily usage file from Azure Account Center. To learn how to download the usage file and understand the access required, see [Get Invoice and Usage](billing-download-azure-invoice-daily-usage-date.md). To learn about columns in the usage file, see [Understand terms on your usage](billing-understand-your-usage.md). 

The usage file contains usage information for both free and paid services. Free service meters would have **Free** appended at the end of the meter name. To find free meters, open the file in excel and filter the **Meter Category column** for cells that contain text **- Free** (Use Text Filters &rarr; Contains filter)
&nbsp;

![Screenshot that shows usage of free services](./media/billing-check-usage-of-free-services/free-services-usage-csv.png)


## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
