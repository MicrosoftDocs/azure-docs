---
title: Disaster recovery guidance for Azure Data Lake Analytics
description: Learn how to plan disaster recovery for your Azure Data Lake Analytics accounts.
services: data-lake-analytics
author: MikeRys
ms.author: mrys
ms.reviewer: jasonwhowell
ms.service: data-lake-analytics
ms.topic: conceptual
ms.date: 06/03/2019
---
# Disaster recovery guidance for Azure Data Lake Analytics

Azure Data Lake Analytics is an on-demand analytics job service that simplifies big data. Instead of deploying, configuring, and tuning hardware, you write queries to transform your data and extract valuable insights. The analytics service can handle jobs of any scale instantly by setting the dial for how much power you need. You only pay for your job when it is running, making it cost-effective. This article provides guidance on how to protect your jobs from rare region-wide outages or accidental deletions.

## Disaster recovery guidance

When using Azure Data Lake Analytics, it's critical for you to prepare your own disaster recovery plan. This article helps guide you to build a disaster recovery plan. There are additional resources that can help you create your own plan:
- [Failure and disaster recovery for Azure applications](/azure/architecture/reliability/disaster-recovery)
- [Azure resiliency technical guidance](/azure/architecture/checklist/resiliency-per-service)

## Best practices and scenario guidance

You can run a recurring U-SQL job in an ADLA account in a region that reads and writes U-SQL tables as well as unstructured data.  Prepare for a disaster by taking these steps:

1. Create ADLA and ADLS accounts in the secondary region that will be used during an outage.

   > [!NOTE]
   > Since account names are globally unique, use a consistent naming scheme that indicates which account is secondary.

2. For unstructured data, reference [Disaster recovery guidance for data in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-disaster-recovery-guidance.md)

3. For structured data stored in ADLA tables and databases, create copies of the metadata artifacts such as databases, tables, table-valued functions, and assemblies. You need to periodically resync these artifacts when changes happen in production. For example, newly inserted data has to be replicated to the secondary region by copying the data and inserting into the secondary table.

   > [!NOTE]
   > These object names are scoped to the secondary account and are not globally unique, so they can have the same names as in the primary production account.

During an outage, you need to update your scripts so the input paths point to the secondary endpoint. Then the users submit their jobs to the ADLA account in the secondary region. The output of the job will then be written to the ADLA and ADLS account in the secondary region.

## Next steps

[Disaster recovery guidance for data in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-disaster-recovery-guidance.md)
