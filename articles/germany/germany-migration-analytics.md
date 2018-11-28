---
title: Migrate Azure analytics resources from Azure Germany to global Azure
description: This article provides information about migrating Azure analytics resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate Azure analytics resources to global Azure

This article has information that can help you migrate Azure analytics resources from Azure Germany to global Azure.
  
## Event Hubs

You can't migrate Azure Event Hubs resources from Azure Germany to global Azure directly. The Event Hubs service doesn't provide data export or import. However, you can export the Event Hubs resources [as a template](../azure-resource-manager/resource-manager-export-template-powershell.md). Then, adapt the exported template for global Azure and re-create the resources.

> [!NOTE]
> Exporting an Event Hubs template doesn't copy data (for example, messages). Exporting a template only re-creates the metadata.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certicates, and other GUIDs to be consistent with the new region.

### Event Hubs metadata

The following metadata elements are re-created when you export an Event Hubs template:

- Namespaces
- Event hubs
- Consumer groups
- Authorization rules

For more information:

- Read the [Event Hubs overview](../event-hubs/event-hubs-about.md).
- Refresh your knowledge by completing the [Event Hubs tutorials](https://docs.microsoft.com/azure/event-hubs/#step-by-step-tutorials).
- Check the migration steps for [Azure Service Bus](./germany-migration-integration.md#service-bus).
- Become familiar with how to [export an Azure Resource Manager template](../azure-resource-manager/resource-manager-export-template.md) or read the overview for [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md).

## HDInsight

To migrate Azure HDInsight clusters from Azure Germany to global Azure:

1. Stop the HDI cluster.
2. Migrate the data in the storage account to the new region by using AzCopy or a similar tool.
3. Create new compute resources in global Azure, and then attach the migrated storage resources as the primary attached storage.

For more specialized, long-running clusters (Kafka, Spark streaming, Storm, or HBase), we recommend that you orchestrate the transition of workloads to the new region.

For more information:

- Review the [Azure HDInsight documentation](https://docs.microsoft.com/azure/hdinsight/).
- Refresh your knowledge by completing [HDInsight tutorials](https://docs.microsoft.com/azure/hdinsight/#step-by-step-tutorials).
- For more help with [scaling HDInsight clusters](../hdinsight/hdinsight-administer-use-powershell.md#scale-clusters), see [Administer HDInsight by using PowerShell](../hdinsight/hdinsight-administer-use-powershell.md).
- Learn how to use [AzCopy](../storage/common/storage-use-azcopy.md).

## Stream Analytics

To migrate Azure Stream Analytics services from Azure Germany to global Azure, manually re-create the entire setup in a global Azure region either in the Azure portal or by using  PowerShell. The ingress and egress sources for any Stream Analytics job can be in any region.

For more information:

- Refresh your knowledge by completing the [Stream Analytics tutorials](https://docs.microsoft.com/azure/stream-analytics/#step-by-step-tutorials).
- Read the [Stream Analytics overview](../stream-analytics/stream-analytics-introduction.md).
- Learn how to [create a Stream Analytics job by using PowerShell](../stream-analytics/stream-analytics-quick-create-powershell.md).

## SQL Data Warehouse

To migrate Azure SQL Database resources, for smaller workloads, you can use the export function to create a BACPAC file. BACPAC file is a compressed (zipped) file that contains metadata and the data from the SQL Server database. After you create the BACPAC file, you can copy it to the target environment (for example, by using AzCopy) and use the import function to rebuild the database. Be aware of the following considerations:

- For an export to be transactionally consistent, make sure that one of the following conditions is true:
  - No write activity occurs during the export.
  - You export from a transactionally consistent copy of your SQL database.
- To export to Azure Blob storage, the BACPAC file size is limited to 200 GB. For a larger BACPAC file, export to local storage.
- If the export operation from Azure SQL Database takes longer than 20 hours, it might be canceled. Look for hints about how to increase performance in the following links.

> [!NOTE]
> The connection string changes after the export operation because the DNS name of the server changes during export.

For more information:

- Learn how to [export a database to a BACPAC file](../sql-database/sql-database-export.md).
- Learn how to [import a BACPAC file to a database](../sql-database/sql-database-import.md).
- Review the [Azure SQL Database documentation](https://docs.microsoft.com/azure/sql-database/).

## Analysis Services

To migrate your Azure Analysis Services models from Azure Germany to global Azure, you can use [backup and restore operations](../analysis-services/analysis-services-backup.md).

If you want to migrate only the model metadata and not the data, an alternative is to [redeploy the model from SQL Server Data Tools](../analysis-services/analysis-services-deploy.md).

For more information:

- Learn about [Analysis Services backup](../analysis-services/analysis-services-backup.md).
- Review the [Analysis Services overview](../analysis-services/analysis-services-overview.md).

