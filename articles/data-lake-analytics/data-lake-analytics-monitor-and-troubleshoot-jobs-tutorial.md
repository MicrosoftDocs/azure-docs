---
title: Monitor Azure Data Lake Analytics - Azure portal
description: This article describes how to use the Azure portal to troubleshoot Azure Data Lake Analytics jobs.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: troubleshooting
ms.date: 01/20/2023
---
# Monitor jobs in Azure Data Lake Analytics using the Azure portal

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

## To see all the jobs

1. From the Azure portal, select **Microsoft Azure** in the upper left corner.

2. Select the tile with your Data Lake Analytics account name.  The job summary is shown on the **Job Management** tile.

   ![Azure Data Lake Analytics job management](./media/data-lake-analytics-monitor-and-troubleshoot-tutorial/data-lake-analytics-job-management.png)

    The job Management gives you a glance of the job status. Notice there is a failed job.
3. Select the **Job Management** tile to see the jobs. The jobs are categorized in **Running**, **Queued**, and **Ended**. You shall see your failed job in the **Ended** section. It shall be first one in the list. When you have many jobs, you can select **Filter** to help you to locate jobs.

   ![Azure Data Lake Analytics filter jobs](./media/data-lake-analytics-monitor-and-troubleshoot-tutorial/data-lake-analytics-filter-jobs.png)

4. Select the failed job from the list to open the job details:

   ![Azure Data Lake Analytics failed job](./media/data-lake-analytics-monitor-and-troubleshoot-tutorial/data-lake-analytics-failed-job.png)

    Notice the **Resubmit** button. After you fix the problem, you can resubmit the job.

5. Select highlighted part from the previous screenshot to open the error details.  You shall see something like:

   ![Azure Data Lake Analytics failed job details](./media/data-lake-analytics-monitor-and-troubleshoot-tutorial/data-lake-analytics-failed-job-details.png)

   It tells you the source folder isn't found.

6. Select **Duplicate Script**.

7. Update the **FROM** path to: `/Samples/Data/SearchLog.tsv`

8. Select **Submit Job**.

## Next steps

* [Azure Data Lake Analytics overview](data-lake-analytics-overview.md)
* [Get started with Azure Data Lake Analytics using Azure PowerShell](data-lake-analytics-get-started-powershell.md)
* [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md)
