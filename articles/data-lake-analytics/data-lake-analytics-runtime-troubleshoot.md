---
title: How to troubleshoot the U-SQL runtime failures
description: 'Learn how to troubleshoot U-SQL runtime failures.'
services: data-lake-analytics
author: guyhay
ms.author: guyhay
ms.reviewer: jasonwhowell
ms.service: data-lake-analytics
ms.topic: conceptual
ms.workload: big-data
ms.date: 10/10/2019
---
# Learn how to troubleshoot U-SQL runtime failures due to runtime changes

The Azure Data Lake U-SQL version runtime, including the compiler, optimizer, and job manager, is what processes your U-SQL code.  New versions of the U-SQL runtime are released on a regular basis and include both minor updates and security fixes.

## U-SQL runtime version

You can choose either the default runtime when submitting U-SQL jobs from either Visual Studio, the ADL SDK, or the Azure Data Lake Analytics portal; or a custom runtime version.

You can also see the history of which runtime version your past jobs have used in the Azure portal.  

### Monitor jobs

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **View All Jobs**. A list of all the active and recently finished jobs in the account is shown.
3. Optionally, click **Filter** to help you find the jobs by **Time Range**, **Job Name**, and **Author** values. 

The following are the available runtime versions.

- release_20190318_adl_3394512_2
- release_20190318_adl_5832669
- release_20190703_adl_4713356

## See also

- [Azure Data Lake Analytics overview](data-lake-analytics-overview.md)
- [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md)