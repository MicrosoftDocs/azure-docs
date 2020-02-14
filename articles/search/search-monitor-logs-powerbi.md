---
title: Visualizing Azure Cognitive Search Logs and Metrics with Power BI
description: Visualizing Azure Cognitive Search Logs and Metrics with Power BI

manager: eladz
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/14/2020
---

# Visualizing Azure Cognitive Search Logs and Metrics with Power BI
[Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-what-is-azure-search) allows you to store operation logs and service metrics about your search service in an Azure Storage account. This page provides instructions for how you can visualize that information through a Power BI Template App. The app provides detailed insights about your search service, including information about Search, Indexing, Operations, and Service metrics.

You can find the Power BI Template App **Azure Cognitive Search: Analyze Logs and Metrics** in the [Power BI Apps marketplace](https://appsource.microsoft.com/marketplace/apps).

## How get started with the app
1. Enable diagnostic logging for your search service:
    1. Create or identify an existing [Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) where you can archive the logs
    1. Navigate to your Azure Cognitive Search service in the Azure Portal
    1. Under the Monitoring section on the left column, select **Diagnostic settings**

        ![](media/search-monitor-logs-powerbi/diagnostic-settings.png)

    1. Select **+ Add diagnostic setting**
    1. Check **Archive to a storage Account**, provide your Storage account information, and check **OperationLogs** and **AllMetrics**

        ![](media/search-monitor-logs-powerbi/add-diagnostic-setting.png)
    1. Select **Save**

1. After logging has been enabled, use your search service to start generating logs and metrics. It takes up to an hour before the containers will appear in Blob storage with these logs. You will see a **insights-logs-operationlogs** container for search traffic logs and a **insights-metrics-pt1m** container for metrics.

1. Find the Azure Cognitive Search Power BI App in the [Power BI Apps marketplace](https://appsource.microsoft.com/marketplace/apps) and install it into a new workspace or an existing workspace. The app is called **Azure Cognitive Search: Analyze Logs and Metrics**.

1. After installing the app, select the app from your list of apps in Power BI.

    ![](media/search-monitor-logs-powerbi/azure-search-app.png)

1. Select **Connect** to connect your data

    ![](media/search-monitor-logs-powerbi/get-started-with-new-app.png)

1. Input the name of the storage account that contains your logs and metrics.

    ![](media/search-monitor-logs-powerbi/connect-to-storage-account.png)

1. Select **Key** as the authentication method and provide your storage account key. Select **Private** as the privacy level. Click Sign In and to begin the loading process.

    ![](media/search-monitor-logs-powerbi/connect-to-storage-account-step-two.png)

1. Wait for the data to refresh. This may take some time depending on how much data you have. You can see if the data is still being refreshed based on the below indicator.

    ![](media/search-monitor-logs-powerbi/workspace-view-refreshing.png)

1. Once the data refresh has completed, select **Azure Cognitive Search Report** to view the report.

    ![](media/search-monitor-logs-powerbi/workspace-view-select-report.png)

1. Make sure to refresh the page after opening the report so that it opens with your data.

    ![](media/search-monitor-logs-powerbi/Search.png)

## Troubleshooting
Ensure the storage account name and access key you provided is correct. The storage account name should correspond to the account configured with your search service logs.

## Next steps
[Learn more about Azure Cognitive Search](https://docs.microsoft.com/azure/search/)

[What is Power BI?](https://docs.microsoft.com/power-bi/fundamentals/power-bi-overview)

[Basic concepts for designers in the Power BI service](https://docs.microsoft.com/power-bi/service-basic-concepts)