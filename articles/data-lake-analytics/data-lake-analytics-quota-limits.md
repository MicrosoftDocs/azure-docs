---
title: Azure Data Lake Analytics Quota Limits | Microsoft Docs
description: Learn how to adjust and increase quota limits in Azure Data Lake Analytics (ADLA) accounts.
services: data-lake-analytics
keywords: Azure Data Lake Analytics
documentationcenter: ''
author: omidm1
editor: omidm1


ms.assetid: 49416f38-fcc7-476f-a55e-d67f3f9c1d34
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/18/2017
ms.author: omidm

---
# Azure Data Lake Analytics Quota Limits

Learn how to adjust and increase quota limits in Azure Data Lake Analytics (ADLA) accounts. Knowing these limits may help you understand your U-SQL job behavior. All quota limits are soft, so you can increase the maximum limits by reaching out to us.

## Azure subscriptions limits

**Maximum number of ADLA accounts per subscription:**  5

 This is the maximum number of ADLA accounts you can create per subscription. If you try to create a sixth ADLA account, you will get an error "You have reached the maximum number of Data Lake Analytics accounts allowed (5) in region under subscription name". In this case, either delete any unused ADLA accounts, or reach out to us by [opening a support ticket](#increase-maximum-quota-limits).

## ADLA account limits

**Maximum number of Analytics Units (AUs) per account:** 250

This is the maximum number of AUs that can run concurrently in your account. If your total running AUs across all jobs exceeds this limit, newer jobs are queued automatically. For example:

* If you have only one job running with 250 AUs, when you submit a second job it will wait in the job queue until the first job completes.
* If you already have five jobs running and each is using 50 AUs, when you submit a sixth job that needs 20 AUs it waits in the job queue until there are 20 AUs available.

**Maximum number of concurrent U-SQL jobs per account:** 20

This is the maximum number of jobs that can run concurrently in your account. Above this value, newer jobs are queued automatically.

## Adjust ADLA quota limits per account

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Choose an existing ADLA account.
3. Click **Properties**.
4. Adjust **Parallelism** and **Concurrent Jobs** to suit your needs.

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-quota-limits/data-lake-analytics-quota-properties.png)

## Increase maximum quota limits

1. Open a support request in Azure Portal.

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-quota-limits/data-lake-analytics-quota-help-support.png)

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-quota-limits/data-lake-analytics-quota-support-request.png)
2. Select the issue type **Quota**.
3. Select your **Subscription** (make sure it is not a "trial" subscription).
4. Select quota type **Data Lake Analytics**.

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-quota-limits/data-lake-analytics-quota-support-request-basics.png)

5. In the problem blade, explain your requested increase limit with **Details** of why you need this extra capacity.

    ![Azure Data Lake Analytics portal blade](./media/data-lake-analytics-quota-limits/data-lake-analytics-quota-support-request-details.png)

6. Verify your contact information and create the support request.

Microsoft reviews your request and tries to accommodate your business needs as soon as possible.

## Next steps

* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Manage Azure Data Lake Analytics using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)
* [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)
