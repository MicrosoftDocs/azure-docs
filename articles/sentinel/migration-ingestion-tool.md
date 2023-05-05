---
title: "Microsoft Sentinel migration: Select a data ingestion tool | Microsoft Docs"
description: Select a tool to transfer your historical data to the selected target platform.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Select a data ingestion tool

After you [select a target platform](migration-ingestion-target-platform.md) for your historical data, the next step is to select a tool to transfer your data.

This article describes a set of different tools used to transfer your historical data to the selected target platform. This table lists the tools available for each target platform, and general tools to help you with the ingestion process.

|Azure Monitor Basic Logs/Archive  |Azure Data Explorer  |Azure Blob Storage  |General tools |
|---------|---------|---------|---------|
|• [Azure Monitor custom log ingestion tool](#azure-monitor-custom-log-ingestion-tool)<br>• [Direct API](#direct-api)     |• [LightIngest](#lightingest)<br>• [Logstash](#logstash) |• [Azure Data Factory or Azure Synapse](#azure-data-factory-or-azure-synapse)<br>• [AzCopy](#azcopy)          |• [Azure Data Box](#azure-data-box)<br> • [SIEM data migration accelerator](#siem-data-migration-accelerator) |

## Azure Monitor Basic Logs/Archive 

Before you ingest data to Azure Monitor Basic Logs or Archive, for lower ingestion prices, ensure that the table you're writing to is [configured as Basic Logs](../azure-monitor/logs/basic-logs-configure.md). Review the [Azure Monitor custom log ingestion tool](#azure-monitor-custom-log-ingestion-tool) and the [direct API](#direct-api) method for Azure Monitor Basic Logs. 

### Azure Monitor custom log ingestion tool 

The [custom log ingestion tool](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/CustomLogsIngestion-DCE-DCR) is a PowerShell script that sends custom data to an Azure Monitor Logs workspace. You can point the script to the folder where all your log files reside, and the script pushes the files to that folder. The script accepts a CSV or JSON format for log files. 

### Direct API 

With this option, you [ingest your custom logs into Azure Monitor Logs](../azure-monitor/logs/tutorial-logs-ingestion-portal.md). You ingest the logs with a PowerShell script that uses a REST API. Alternatively, you can use any other programming language to perform the ingestion, and you can use other Azure services to abstract the compute layer, such as Azure Functions or Azure Logic Apps. 

## Azure Data Explorer 

You can [ingest data to Azure Data Explorer](/azure/data-explorer/ingest-data-overview) (ADX) in several ways.

The ingestion methods that ADX accepts are based on different components:
- SDKs for different languages, such as .NET, Go, Python, Java, NodeJS, and APIs.
- Managed pipelines, such as Event Grid or Storage Blob Event Hubs, and Azure Data Factory.
- Connectors or plugins, such as Logstash, Kafka, Power Automate, and Apache Spark.

Review the [LightIngest](#lightingest) and [Logstash](#logstash), two methods that are better tailored to the data migration use case.

### LightIngest

ADX has developed the [LightIngest utility](/azure/data-explorer/lightingest) specifically for the historical data migration use case. You can use LightIngest to copy data from a local file system or Azure Blob Storage to ADX.

Here are a few main benefits and capabilities of LightIngest:

- Because there's no time constraint on ingestion duration, LightIngest is most useful when you want to ingest large amounts of data. 
- LightIngest is useful when you want to query records according to the time they were created, and not the time they were ingested.
- You don't need to deal with complex sizing for LightIngest, because the utility doesn't perform the actual copy. LightIngest informs ADX about the blobs that need to be copied, and ADX copies the data.

If you choose LightIngest, review these tips and best practices.

- To speed up your migration and reduce costs, increase the size of your ADX cluster to create more available nodes for ingestion. Decrease the size once the migration is over.
- For more efficient queries after you ingest the data to ADX, ensure that the copied data uses the timestamp for the original events. The data shouldn't use the timestamp from when the data is copied to ADX. You provide the timestamp to LightIngest as the path of file name as part of the [CreationTime property](/azure/data-explorer/lightingest#how-to-ingest-data-using-creationtime). 
- If your path or file names don't include a timestamp, you can still instruct ADX to organize the data using a [partitioning policy](/azure/data-explorer/kusto/management/partitioningpolicy).

### Logstash 

[Logstash](https://www.elastic.co/products/logstash) is an open source, server-side data processing pipeline that ingests data from many sources simultaneously, transforms the data, and then sends the data to your favorite "stash". Learn how to [ingest data from Logstash to Azure Data Explorer](/azure/data-explorer/ingest-data-logstash). Logstash runs  on Windows, Linux and MacOS Machines.

To optimize performance, [configure the Logstash tier size](https://www.elastic.co/guide/en/logstash/current/deploying-and-scaling.html) according to the events per second. We recommend that you use [LightIngest](#lightingest) wherever possible, because LightIngest relies on the ADX cluster computing to perform the copy. 

## Azure Blob Storage

You can ingest data to Azure Blob Storage in several ways. 
- [Azure Data Factory or Azure Synapse](../data-factory/connector-azure-blob-storage.md)
- [AzCopy](../storage/common/storage-use-azcopy-v10.md)
- [Azure Storage Explorer](/azure/architecture/data-science-process/move-data-to-azure-blob-using-azure-storage-explorer)
- [Python](../storage/blobs/storage-quickstart-blobs-python.md)
- [SSIS](/azure/architecture/data-science-process/move-data-to-azure-blob-using-ssis)

Review the Azure Data Factory (ADF) and Azure Synapse methods, which are better tailored to the data migration use case.

### Azure Data Factory or Azure Synapse

To use the Copy activity in Azure Data Factory (ADF) or Synapse pipelines:
1. Create and configure a self-hosted integration runtime. This component is responsible for copying the data from your on-premises host.
1. Create linked services for the source data store ([filesystem](../data-factory/connector-file-system.md?tabs=data-factory#create-a-file-system-linked-service-using-ui) and the sink data store [blob storage](../data-factory/connector-azure-blob-storage.md?tabs=data-factory#create-an-azure-blob-storage-linked-service-using-ui).
3. To copy the data, use the [Copy data tool](../data-factory/quickstart-hello-world-copy-data-tool.md). Alternatively, you can use method such as PowerShell, Azure portal, a .NET SDK, and so on.

### AzCopy

[AzCopy](../storage/common/storage-use-azcopy-v10.md) is a simple command-line utility that copies files to or from storage accounts. AzCopy is available for Windows, Linux, and macOS. Learn how to [copy on-premises data to Azure Blob storage with AzCopy](../storage/common/storage-use-azcopy-v10.md). 

You can also use these options to copy the data:
- Learn how to [optimize the performance](../storage/common/storage-use-azcopy-optimize.md) of AzCopy.
- Learn how to [configure AzCopy](../storage/common/storage-ref-azcopy-configuration-settings.md). 
- Learn how to use the [copy command](../storage/common/storage-ref-azcopy-copy.md).

## Azure Data Box

In a scenario where the source SIEM doesn't have good connectivity to Azure, ingesting the data using the tools reviewed in this section might be slow or even impossible. To address this scenario, you can use [Azure Data Box](../databox/data-box-overview.md) to copy the data locally from the customer's data center into an appliance, and then ship that appliance to an Azure data center. While Azure Data Box isn't a replacement for AzCopy or LightIngest, you can use this tool to accelerate the data transfer between the customer data center and Azure.

Azure Data Box offers three different SKUs, depending on the amount of data to migrate: 

- [Data Box Disk](../databox/data-box-disk-overview.md) 
- [Data Box](../databox/data-box-overview.md)
- [Data Box Heavy](../databox/data-box-heavy-overview.md)

After you complete the migration, the data is available in a storage account under one of your Azure subscriptions. You can then use [AzCopy](#azcopy), [LightIngest](#lightingest), or [ADF](#azure-data-factory-or-azure-synapse) to ingest data from the storage account. 

## SIEM data migration accelerator

In addition to selecting an ingestion tool, your team needs to invest time in setting up the foundation environment. To ease this process, you can use the [SIEM data migration accelerator](https://aka.ms/siemdatamigration), which automates the following tasks:

- Deploys a Windows virtual machine that will be used to move the logs from the source to the target platform
- Downloads and extracts the following tools into the virtual machine desktop:
    - [LightIngest](#lightingest): Used to migrate data to ADX
    - [Azure Monitor Custom log ingestion tool](#azure-monitor-custom-log-ingestion-tool): Used to migrate data to Log Analytics
    - [AzCopy](#azcopy): Used to migrate data to Azure Blob Storage
- Deploys the target platform that will host your historical logs:
    - Azure Storage account (Azure Blob Storage)
    - Azure Data Explorer cluster and database
    - Azure Monitor Logs workspace (Basic Logs; enabled with Microsoft Sentinel)

To use the SIEM data migration accelerator:

1. From the [SIEM data migration accelerator page](https://aka.ms/siemdatamigration), click **Deploy to Azure** at the bottom of the page, and authenticate.
1. Select **Basics**, select your resource group and location, and then select **Next**.
1. Select **Migration VM**, and do the following: 
    - Type the virtual machine name, username and password.
    - Select an existing vNet or create a new vNet for the virtual machine connection.
    - Select the virtual machine size.
1. Select **Target platform** and do one of the following:
    - Skip this step.
    - Provide the ADX cluster and database name, SKU, and number of nodes.
    - For Azure Blob Storage accounts, select an existing account. If you don't have an account, provide a new account name, type, and redundancy.
    - For Azure Monitor Logs, type the name of the new workspace.

## Next steps

In this article, you learned how to select a tool to ingest your data into the target platform. 

> [!div class="nextstepaction"]
> [Ingest your data](migration-export-ingest.md)
