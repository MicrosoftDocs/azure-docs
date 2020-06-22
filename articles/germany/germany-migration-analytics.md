---
title: Migrate Azure analytics resources, Azure Germany to global Azure
description: This article provides information about migrating your Azure analytics resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 12/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate analytics resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.


This article has information that can help you migrate Azure analytics resources from Azure Germany to global Azure.
  
## Event Hubs

You can't directly migrate Azure Event Hubs resources from Azure Germany to global Azure. The Event Hubs service doesn't have data export or import capabilities. However, you can export Event Hubs resources [as a template](../azure-resource-manager/templates/export-template-portal.md). Then, adapt the exported template for global Azure and re-create the resources.

> [!NOTE]
> Exporting an Event Hubs template doesn't copy data (for example, messages). Exporting a template only re-creates Event Hubs metadata.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

### Event Hubs metadata

The following metadata elements are re-created when you export an Event Hubs template:

- Namespaces
- Event hubs
- Consumer groups
- Authorization rules

For more information:

- Review the [Event Hubs overview](../event-hubs/event-hubs-about.md).
- Refresh your knowledge by completing the [Event Hubs tutorials](https://docs.microsoft.com/azure/event-hubs).
- Check the migration steps for [Azure Service Bus](./germany-migration-integration.md#service-bus).
- Become familiar with how to [export Azure Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md) or read the overview of [Azure Resource Manager](../azure-resource-manager/management/overview.md).

## HDInsight

To migrate Azure HDInsight clusters from Azure Germany to global Azure:

1. Stop the HDInsight cluster.
2. Migrate the data in the Azure Storage account to the new region by using AzCopy or a similar tool.
3. Create new compute resources in global Azure, and then attach the migrated storage resources as the primary attached storage.

For more specialized, long-running clusters (Kafka, Spark streaming, Storm, or HBase), we recommend that you orchestrate the transition of workloads to the new region.

For more information:

- Review the [Azure HDInsight documentation](https://docs.microsoft.com/azure/hdinsight/).
- Refresh your knowledge by completing the [HDInsight tutorials](https://docs.microsoft.com/azure/hdinsight).
- For help with [scaling HDInsight clusters](../hdinsight/hdinsight-administer-use-powershell.md#scale-clusters), see [Administer HDInsight by using PowerShell](../hdinsight/hdinsight-administer-use-powershell.md).
- Learn how to use [AzCopy](../storage/common/storage-use-azcopy.md).

## Stream Analytics

To migrate Azure Stream Analytics services from Azure Germany to global Azure, manually re-create the entire setup in a global Azure region either by using the Azure portal or by using PowerShell. Ingress and egress sources for a Stream Analytics job can be in any region.

For more information:

- Refresh your knowledge by completing the [Stream Analytics tutorials](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-manage-job).
- Review the [Stream Analytics overview](../stream-analytics/stream-analytics-introduction.md).
- Learn how to [create a Stream Analytics job by using PowerShell](../stream-analytics/stream-analytics-quick-create-powershell.md).

## SQL Database

To migrate smaller Azure SQL Database workloads, use the export function to create a BACPAC file. A BACPAC file is a compressed (zipped) file that contains metadata and the data from the SQL Server database. After you create the BACPAC file, you can copy the file to the target environment (for example, by using AzCopy) and use the import function to rebuild the database. Be aware of the following considerations:

- For an export to be transactionally consistent, make sure that one of the following conditions is true:
  - No write activity occurs during the export.
  - You export from a transactionally consistent copy of your SQL database.
- To export to Azure Blob storage, the BACPAC file size is limited to 200 GB. For a larger BACPAC file, export to local storage.
- If the export operation from SQL Database takes longer than 20 hours, the operation might be canceled. Check the following articles for tips about how to increase performance.

> [!NOTE]
> The connection string changes after the export operation because the DNS name of the server changes during export.

For more information:

- Learn how to [export a database to a BACPAC file](../azure-sql/database/database-export.md).
- Learn how to [import a BACPAC file to a database](../azure-sql/database/database-import.md).
- Review the [Azure SQL Database documentation](https://docs.microsoft.com/azure/sql-database/).

## Analysis Services

To migrate your Azure Analysis Services models from Azure Germany to global Azure, use [backup and restore operations](../analysis-services/analysis-services-backup.md).

If you want to migrate only the model metadata and not the data, an alternative is to [redeploy the model from SQL Server Data Tools](../analysis-services/analysis-services-deploy.md).

For more information:

- Learn about [Analysis Services backup and restore](../analysis-services/analysis-services-backup.md).
- Review the [Analysis Services overview](../analysis-services/analysis-services-overview.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
