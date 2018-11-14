---

title: Tutorial How to download and use a script to access signin logs | Microsoft Docs
description: Learn how to download and use a PowerShell script to access signin logs.
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 4afe0c73-aee8-47f1-a6cb-2d71fd6719d1
ms.service: active-directory
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 11/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk  

# Customer intent: As an IT administrator, I want to learn how to set up a script to download sign-in activity logs periodically, so that I can indefinitely retain all the sign-ins data in my tenant without manual intervention.

---

# Tutorial: How to download and use a script to access sign-in logs

You can download the sign-in activities data if you want work with it outside the Azure portal. The **Download** option in the Azure portal creates a CSV file of the most recent 5000 records. If you need more flexibility, for instance, to download more than 5000 records at a time, or to download the logs at scheduled intervals, you can use the **Script** button to generate a PowerShell script to download your data.

In this tutorial, you learn how to generate a script to download all the sign-in logs from the last 24 hours and schedule it to run every day. 

## Prerequisites

You need

* An Azure Active Directory tenant with a premium (P1/P2) license. 
* A user, who is in the **global administrator**, **security administrator**, **security reader** or **report reader** role for the tenant. In addition, any user can access their own sign-ins. 
* If you want to run the downloaded script on your Windows 10 machine, [set up the AzureRM module and set execution policy](concept-sign-ins.md#running-the-script-on-a-windows-10-machine).

## Tutorial

1. Navigate to the [Azure portal](https://portal.azure.com) and select your directory.
2. Select **Azure Active Directory** and select **Sign-ins** from the **Monitoring** section. 
3. Use the **Date Range** filter drop-down and select **24 Hours** to get data from the last 24 hours. 
4. Select **Apply** and verify that the filter is applied as expected. 
5. Select **Script** from the top menu to download the Powershell script with the applied filters.

     ![Download script](./media/tutorial-signin-logs-download-script/download-script.png)
     
6. Open the **Task Scheduler** application on your Windows machine and select **Create Basic Task**.
7. Enter a name and description for the task and click **Next**.
8. Select the **Daily** radio button to allow the task to run daily and enter the start date and time.
9. In the action menu, select **Start a program** and select the downloaded script and select **Next**. 
10. Review the scheduled task and select **Finish** to create the task.

     ![Create task](./media/tutorial-signin-logs-download-script/create-task.png)

Now, your task will run every day and save the sign-in records from the last 24 hours into a file of the format **AAD_SignInReport_YYYYMMDD_HHMMSS.csv**. You can also edit the downloaded PowerShell script to save it under a different file name, or to modify the number of records downloaded. 

## Next steps

* [Azure Active Directory report retention policies](reference-reports-data-retention.md)
* [Getting started with the Azure Active Directory reporting API](concept-reporting-api.md)
* [Access the reporting API with certificates](tutorial-access-api-with-certificates.md)
