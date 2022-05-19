---
title: Select a data ingestion tool | Microsoft Docs
description: TBD
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Select a data ingestion tool

After you [select a target platform](migration-ingestion-target-platform.md) for your historical data, the next step is to select a tool to transfer your data.

This article describes a set of different tools used to transfer your historical data to the selected target platform.

## Azure Monitor Basic Logs 

Before you ingest data to Azure Monitor Basic logs, for lower ingestion prices, ensure that the table you are writing to is [configured as Basic Logs](../azure-monitor/logs/basic-logs-configure.md#check-table-configuration).  

Review the following sections to select your data ingestion tool.

#### Customlogs 

[Customlogs](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/CustomLogsIngestion-DCE-DCR) is a PowerShell script that sends data to an Azure Monitor Logs workspace. You can point the script to the folder where all your log files reside, and the script pushes the files to that folder. The script accepts either CSV or JSON for log files. 

#### Direct API 

With this option, you [ingest your custom logs into Azure Monitor Logs](../azure-monitor/logs/tutorial-custom-logs.md). You do this with a PowerShell script that uses a REST API to ingest your data. Alternatively, you can use any other programming language to perform the ingestion, and you can use other Azure services to abstract the compute layer, such as Azure Functions or Azure Logic Apps. 

## Azure Data Explorer 

You can [ingest data to Azure Data Explorer](/azure/data-explorer/ingest-data-overview) in several ways.

:::image type="content" source="media/migration-ingestion-tool/adx-ingestion.png" alt-text="Diagram illustrating ADX ingestion options." lightbox="media/migration-ingestion-tool/adx-ingestion.png":::

The ingestion methods that ADX accepts are based on different components:
- SDKs for different languages, such as .NET, Go, Python, Java, NodeJS, and APIs
- Managed pipelines, such as Event Grid or Storage Blob Event Hub, and Azure Data Factory.
- Connectors or plugins, such as Logstash, Kafka, Power Automate, and Apache Spark.

This section reviews two methods that are better tailored to the data migration use case:
- [LightIngest](#lightingest)
- [Logstash](#logstash)

#### LightIngest

ADX has developed the [LightIngest utility](https://docs.microsoft.com/azure/data-explorer/lightingest) specifically for the historical data migration use case. You can copy data to LightIngest using the local filesystem or Azure Blob Storage.

Here are a few main benefits and capabilities of LightIngest:

- Because there is no time constraint on ingestion duration, LightIngest is most useful when you want to ingest large amounts of data. 
- LightIngest is useful when you want to query records according to the time they were created, and not the time they were ingested.
- You do not need to deal with complex sizing for LightIngest, because the utility does not perform the actual copy. LightIngest informs ADX about the blobs that need to be copied, and ADX copies the data.

##### Best practices

To speed up your migration and reduce costs, increase the size of your ADX cluster to create more available nodes for ingestion, and decrease the size once the migration is over.

For more efficient queries after the data is ingested to ADX, ensure that the copied data uses the timestamp for the original events and not the timestamp for the when the data is copied to ADX. You provide the timestamp to LightIngest as the path of file name as part of the [CreationTime property](https://docs.microsoft.com/azure/data-explorer/lightingest#how-to-ingest-data-using-creationtime). 

If your path or file names do not include a timestamp, you can still instruct ADX to organize the data using a [partitioning policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/partitioningpolicy).

#### Logstash 

[Logstash](https://www.elastic.co/products/logstash) is an open source, server-side data processing pipeline that ingests data from many sources simultaneously, transforms the data, and then sends the data to your favorite "stash". Learn how to [ingest data from Logstash to Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/ingest-data-logstash). Logstash runs only on Windows machines.

To optimize performance, [configure the Logstash tier size](https://www.elastic.co/guide/en/logstash/current/deploying-and-scaling.html) according to the events per second. We recommend that you use [LightIngest](#lightingest) wherever possible, because LightIngest relies on the ADX cluster computing to perform the copy. 

#### Azure Blob Storage

You can ingest data to Azure Blob Storage in several ways. 
- [Azure Data Factory or Azure Synapse](/azure/data-factory/connector-azure-blob-storage)
- [AzCopy](/azure/storage/common/storage-use-azcopy-v10)
- [Azure Storage Explorer](/azure/architecture/data-science-process/move-data-to-azure-blob-using-azure-storage-explorer)
- [Python](/azure/storage/blobs/storage-quickstart-blobs-python)
- [SSIS](/azure/architecture/data-science-process/move-data-to-azure-blob-using-ssis)

This section reviews two methods that are better tailored to the data migration use case:
- Azure Data Factory (ADF) or Azure Synapse

##### Azure Data Factory (ADF) or Azure Synapse

To use the Copy activity in Azure Data Factory or Synapse pipelines:
1. Create and configure a self-hosted integration runtime. This component is responsible for copying the data from your on-premises host.
1. Create linked services for the source data store ([filesystem](/azure/data-factory/connector-file-system?tabs=data-factory#create-a-file-system-linked-service-using-ui) and the sink data store ([blob storage](/azure/data-factory/connector-azure-blob-storage?tabs=data-factory#create-an-azure-blob-storage-linked-service-using-ui)).
3. To copy the data, use the [Copy data tool](/azure/data-factory/quickstart-create-data-factory-copy-data-tool). Alternatively, you can use method such as PowerShell, Azure Portal, a .NET SDK, and so on.

##### AzCopy

[AzCopy](/azure/storage/common/storage-use-azcopy-v10) is a simple command-line utility that copies files to or from storage accounts, available for Windows, Linux, and macOS. Learn how to [copy on-premises data to Azure Blob storage with AzCopy](/azure/storage/common/storage-use-azcopy-v10). 

Review these additional options:
- Learn how to [optimize the performance](/azure/storage/common/storage-use-azcopy-optimize?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json) of AzCopy
- Learn how to [configure AzCopy](/azure/storage/common/storage-ref-azcopy-configuration-settings?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json). 
- Learn how to use the [copy command](/azure/storage/common/storage-ref-azcopy-copy?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json).

#### Azure Data Box

In a scenario where the source SIEM does not have good connectivity to Azure, ingesting the data using the tools reviewed in this section might be extremely slow or even impossible. To address this scenario, you can use [Azure Data Box](/azure/databox/) to copy the data locally from the customer's data center into an appliance, and then ship that appliance to an Azure data center. While Azure Data Box is not a replacement for AzCopy or LightIngest, you can use this tool to accelerate the data transfer between the customer data center and Azure.

Azure Data Box offers three different SKUs, depending on the amount of data to migrate: 

- [Data Box Disk](/azure/databox/data-box-disk-overview) 
- [Data Box](/azure/databox/data-box-overview)
- [Data Box Heavy](/azure/databox/data-box-heavy-overview)

After you complete the migration, the data is available in a storage account under one of your Azure subscriptions. You can then use [AzCopy](#azcopy), [LightIngest](#lightingest), or [ADF](#azure-data-factory-adf-or-azure-synapse) to ingest data from the storage account. 

#### SIEM data migration accelerator

In addition to selecting an ingestion tool, your team needs to invest time in setting up the foundation environment. To ease this process, you can use the [SIEM data migration accelerator](http://aka.ms/siemdatamigration), which automates the following tasks:

- Deploys a Windows virtual machine that will be used to move the logs from the source to the target platform
- Downloads and extracts the following tools into the virtual machine desktop:
    - [LightIngest](/azure/data-explorer/lightingest): Used to migrate data to ADX
    - [Azure Monitor Custom log ingestion tool](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/CustomLogsIngestion-DCE-DCR): Used to migrate data to Log Analytics
    - [AzCopy](/azure/storage/common/storage-use-azcopy-v10): Used to migrate data to Azure Blob Storage
- Deploys the target platform that will host your historical logs:
    - Azure Storage account (Azure Blob Storage)
    - Azure Data Explorer cluster and database
    - Azure Monitor Logs workspace (Basic Logs; enabled with Microsoft Sentinel)

To use the SIEM data migration accelerator:

1. [Download the deployment wizard](http://aka.ms/siemdatamigration).
1. Click **Deploy to Azure** button and authenticate.
1. Select **Basics**, select your resource group and location, and select **Next**.
1. Select **Migration VM**, and do the following: 
    - Type the VM name, username and password.
    - Select an existing vNet or create a new vNet for the VM connection.
    - Select the VM size.
1. Select **Target platform** and do the following:
    - (Optional) Select which target platform to create.
    - Provide the ADX cluster and database name, SKU, and number of nodes.
    - For Azure Blob Storage accounts, select an existing account. If you do not have an account, provide a new account name, type, and redundancy.
    - For Azure Monitor Logs, type the name of the new workspace.