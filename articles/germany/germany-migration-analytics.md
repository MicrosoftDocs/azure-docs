---
title: Migration of analytics resources from Azure Germany to global Azure
description: This article provides help for migrating analytics resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of analytics resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Analytics resources from Azure Germany to global Azure.
  
## Event Hubs

YOu can't migrate Event Hubs from Azure Germany to global Azure directly, since Event Hub services don't provide data export or import capabilities. However, you can export the Event Hub resources [as a template](../azure-resource-manager/resource-manager-export-template-powershell.md). Then adopt the exported template for global Azure and recreate the resources.

> [!NOTE]
> This doesn't copy the data (for example messages), it's only recreating the metadata.

> [!IMPORTANT]
> Change location, Key Vault secrets, certs, and other GUIDs to be consistent with the new region.

### Metadata Event Hubs

- Namespaces
- event hubs
- consumer groups
- Authorization Rules (see also below)

### Next Steps

- Refresh your knowledge about Event Hubs by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/event-hubs/#step-by-step-tutorials).
- check the migration steps for [ServiceBus](./germany-migration-integration.md#service-bus)
- Make yourself familiar how to [export an Anzure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview about [the Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).


### References

- [Event Hubs overview](../event-hubs/event-hubs-about.md)










## HDInsight

HDInsight clusters can be migrated from Azure Germany to global Azure by following these steps:

- Stop HDI cluster
- Migrate the data in the storage to the new region using AzCopy or a similar tool
- Create new Compute resources in Azure global and attach the migrated storage resources as the primary attached storage

For more specialized, long running clusters (Kafka, Spark streaming, Storm, or HBase) it's recommended to orchestrate transition of workloads to the new region.

### Next Steps

- Refresh your knowledge about HDInsight by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/hdinsight/#step-by-step-tutorials).
- [Administer HDInsight using PowerShell](../hdinsight/hdinsight-administer-use-powershell.md) for additional help in [scaling HDInsight clusters](../hdinsight/hdinsight-administer-use-powershell.md#scale-clusters)
- Read how to use [AzCopy](../storage/common/storage-use-azcopy.md).

### References

- [Azure HD Insight Documentation](https://docs.microsoft.com/azure/hdinsight/)







## Stream Analytics

To migrate Stream Analytics services from Azure Germany to Azure global, manually recreate the entire setup in a global Azure region using either the portal or PowerShell. The ingress and egress sources for any Stream Analytics job can be in any region.

### Next Steps

- Refresh your knowledge about Stream Analytics by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/stream-analytics/#step-by-step-tutorials).

### References
- [Stream Analytics overview](../stream-analytics/stream-analytics-introduction.md)
- [Create a Stream Analytics job using PowerShell](../stream-analytics/stream-analytics-quick-create-powershell.md)






## SQL Data Warehouse

To migrate Azure SQL databases, you can use (for smaller workloads) the export function to create a BACPAC file. BaACPAC file is a compressed (zip'ed) file with metadata and data from the SQL Server database. Once created, you can copy it to the target environment (for example with AzCopy) and use the import function to rebuild the database. Be aware of the following considerations (see more in the links provided below):

- For an export to be transactionally consistent, make sure either
  - no write activity is occurring during the export, or
  - you're exporting from a transactionally consistent copy of your Azure SQL database.
- For export to blob storage, the BACPAC file is limited to 200 GB. For a larger BACPAC file, export to local storage.
- If the export operation from Azure SQL Database takes longer than 20 hours, it may be canceled. Look for hints how to increase performance in the links below.

> [!NOTE]
> The connection string will change since the DNS name of the server will change.

### Next Steps

- [Export DB to Bacpac file](../sql-database/sql-database-export.md)
- [Import Bacpac file to a DB](../sql-database/sql-database-import.md)

### References

- [Azure SQL Database documentation](https://docs.microsoft.com/azure/sql-database/)













## Azure Analysis Service

To migrate your models from Azure Germany to global Azure, you can use backup/restore as described [in this document](../analysis-services/analysis-services-backup.md).

If you only want to migrate the model metadata and not the data, an alternative could be to [redeploy the model from SSDT](../analysis-services/analysis-services-deploy.md).

### Next Steps
- [Analysis Service backup](../analysis-services/analysis-services-backup.md)

### References
- [Analysis Services overview](../analysis-services/analysis-services-overview.md)
