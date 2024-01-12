---
title: "Microsoft Sentinel migration: Ingest data into target platform | Microsoft Docs"
description: Learn how to ingest historical data into your selected target platform.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Ingest historical data into your target platform

In previous articles, you [selected a target platform](migration-ingestion-target-platform.md) for your historical data. You also selected [a tool to transfer your data](migration-ingestion-tool.md) and stored the historical data in a staging location. You can now start to ingest the data into the target platform. 

This article describes how to ingest your historical data into your selected target platform.

## Export data from the legacy SIEM

In general, SIEMs can export or dump data to a file in your local file system, so you can use this method to extract the historical data. It’s also important to set up a staging location for your exported files. The tool you use to transfer the data ingestion can copy the files from the staging location to the target platform. 

This diagram shows the high-level export and ingestion process.  

:::image type="content" source="media/migration-export-ingest/export-data.png" alt-text="Diagram illustrating steps involved in export and ingestion." lightbox="media/migration-export-ingest/export-data.png" border="false":::

To export data from your current SIEM, see one of the following sections:
- [Export data from ArcSight](migration-arcsight-historical-data.md)
- [Export data from Splunk](migration-splunk-historical-data.md)
- [Export data from QRadar](migration-qradar-historical-data.md)

## Ingest to Azure Data Explorer 

To ingest your historical data into Azure Data Explorer (ADX) (option 1 in the [diagram above](#export-data-from-the-legacy-siem)): 

1. [Install and configure LightIngest](/azure/data-explorer/lightingest) on the system where logs are exported, or install LightIngest on another system that has access to the exported logs. LightIngest supports Windows only. 
1. If you don't have an existing ADX cluster, create a new cluster and copy the connection string. Learn how to [set up ADX](/azure/data-explorer/create-cluster-database-portal).
1. In ADX, create tables and define a schema for the CSV or JSON format (for QRadar). Learn how to create a table and define a schema [with sample data](/azure/data-explorer/ingest-sample-data) or [without sample data](/azure/data-explorer/one-click-table).  
1. [Run LightIngest](/azure/data-explorer/lightingest#run-lightingest) with the folder path that includes the exported logs as the path, and the ADX connection string as the output. When you run LightIngest, ensure that you provide the target ADX table name, that the argument pattern is set to `*.csv`, and the format is set to `.csv` (or `json` for QRadar). 

## Ingest data to Microsoft Sentinel Basic Logs

To ingest your historical data into Microsoft Sentinel Basic Logs (option 2 in the [diagram above](#export-data-from-the-legacy-siem)): 

1. If you don't have an existing Log Analytics workspace, create a new workspace and [install Microsoft Sentinel](quickstart-onboard.md#enable-microsoft-sentinel-).
1. [Create an App registration to authenticate against the API](../azure-monitor/logs/tutorial-logs-ingestion-portal.md#create-azure-ad-application).
1. [Create a data collection endpoint](../azure-monitor/logs/tutorial-logs-ingestion-portal.md#create-data-collection-endpoint). This endpoint acts as the API endpoint that accepts the data.
1. [Create a custom log table](../azure-monitor/logs/tutorial-logs-ingestion-portal.md#create-new-table-in-log-analytics-workspace) to store the data, and provide a data sample. In this step, you can also define a transformation before the data is ingested.
1. [Collect information from the data collection rule](../azure-monitor/logs/tutorial-logs-ingestion-portal.md#collect-information-from-the-dcr) and assign permissions to the rule.
1. [Change the table from Analytics to Basic Logs](../azure-monitor/logs/basic-logs-configure.md).
1. Run the [Custom Log Ingestion script](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/CustomLogsIngestion-DCE-DCR). The script asks for the following details:  
    - Path to the log files to ingest 
    - Microsoft Entra tenant ID 
    - Application ID 
    - Application secret 
    - DCE endpoint 
    - DCR immutable ID 
    - Data stream name from the DCR  

    The script returns the number of events that have been sent to the workspace.

## Ingest to Azure Blob Storage 

To ingest your historical data into Azure Blob Storage (option 3 in the [diagram above](#export-data-from-the-legacy-siem)): 

1. [Install and configure AzCopy](../storage/common/storage-use-azcopy-v10.md) on the system to which you exported the logs. Alternatively, install AzCopy on another system that has access to the exported logs.  
1. [Create an Azure Blob Storage account](../storage/common/storage-account-create.md) and copy the authorized [Microsoft Entra ID](../storage/common/storage-use-azcopy-v10.md#option-1-use-azure-active-directory) credentials or [Shared Access Signature](../storage/common/storage-use-azcopy-v10.md#option-2-use-a-sas-token) token.   
1. [Run AzCopy](../storage/common/storage-use-azcopy-v10.md#run-azcopy) with the folder path that includes the exported logs as the source, and the Azure Blob Storage connection string as the output.

## Next steps

In this article, you learned how to ingest your data into the target platform. 

> [!div class="nextstepaction"]
> [Convert your dashboards to workbooks](migration-convert-dashboards.md)
