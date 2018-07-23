---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating analytics resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Analytics

## Event Hubs

Please follow the instrauctions given at [Integration - ServiceBus](./germany-migration-integration#servicebus)

## HDInsight

HDInsight clusters can be migrated to a new region by following these steps:

- Stop HDI cluster
- Migrate the data in WASB to the new region using AzCopy or similar tool
- Create new Compute resources in new region and attach the migrated WASB resources as the primary attached storage

For more specialized, long running clusters (e.g. Kafka, Spark streaming, Storm or HBase) it is recommended to orchestrate transition of workloads the new Region.

### Links
- [Administer HDInsight using PowerShell](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-administer-use-powershell?toc=%2Fen-us%2Fazure%2Fhdinsight%2Fspark%2FTOC.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
- for additional help in [scaling HDI clusters](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-administer-use-powershell?toc=%2Fen-us%2Fazure%2Fhdinsight%2Fspark%2FTOC.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json#scale-clusters)
- using [AzCopy](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy).

## Stream Analytics

Please manually recreate the entire setup in a public Azure region of your choice using either Portal or PowerShell. The ingress and egress sources for any Stream Analytics job can be in any region.

### Links

- [Create a Stream Analytics job using PowerShell](../stream-analytics/stream-analytics-quick-create-powershell.md)

# Azure SQL DW

This topic is already covered under [Databases](./germany-migration-databases#sql-data-warehouse)

# Azure Analysis Service

You can use backup/restore to migrate your models. There is [some pretty good documentation available](../analysis-services/analysis-services-backup.md).

If you only want to migrate the model metadata (and not the data), an alternative could be to [redeploy the model from SSDT](../analysis-services/analysis-services-deploy.md).
