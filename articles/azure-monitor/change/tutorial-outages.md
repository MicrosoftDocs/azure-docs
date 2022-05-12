---
title: Tutorial - Track a web app outage using Change Analysis
description: Tutorial on how to identify the root cause of a web app outage using Azure Monitor Change Analysis.
ms.topic: tutorial
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.reviewer: cawa
ms.date: 05/12/2022
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell
---

# Tutorial: Track a web app outage using Change Analysis

When issues happen, one of the first things to check is what changed in application, configuration and resources to triage and root cause issues. Change Analysis provides a centralized view of the changes in your subscriptions for up to the past 14 days to provide the history of changes for troubleshooting issues.  

In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Enable Change Analysis to track changes for Azure resources and for Azure Web App configurations
> * Troubleshoot a Web App issue using Change Analysis

## Pre-requisites

An Azure Web App with a Storage account dependency. Follow instructions at [ChangeAnalysis-webapp-storage-sample](https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample) if you haven't already deployed one. 

## Enable Change Analysis

In the Azure portal, navigate to theChange Analysis service home page.  

If this is your first time using Change Analysis service, the page may take up to a few minutes to register the `Microsoft.ChangeAnalysis` resource provider in your selected subscriptions.

:::image type="content" source="./media/change-analysis/change-analysis-blade.png" alt-text="Screenshot of Change Analysis in Azure portal.":::

Once the Change Analysis page loads, you can see resource changes in your subscriptions. To view detailed web app in-guest change data:

- Select **Enable now** from the banner, or 
- Select **Configure** from the top menu.

In the web app in-guest enablement pane, select the web app you'd like to enable: 

:::image type="content" source="./media/change-analysis/enablement-pane.png" alt-text="Screenshot of Change Analysis enablement pane.":::

Now Change Analysis is fully enabled to track both resources and web app in-guest changes. 

## Simulate a web app outage

In a typical team environment, multiple developers can work on the same application without notifying the other developers. Simulate this scenario and make a change to the web app setting: 

```azurecli
az webapp config appsettings set -g {resourcegroup_name} -n {webapp_name} --settings AzureStorageConnection=WRONG_CONNECTION_STRING 
```

Visit the web app URL to view the following error: 

:::image type="content" source="./media/change-analysis/outage-example.png" alt-text="Screenshot of simulated web app outage.":::

## Troubleshoot the outage using Change Analysis

In the Azure portal, navigate to the Change Analysis overview page. Since you've triggered a web app outage, you'll see an entry of change for `AzureStorageConnection`:

:::image type="content" source="./media/change-analysis/entry-of-outage.png" alt-text="Screenshot of outage entry on the Change Analysis pane.":::

Since the connection string is a secret value, we hide this on the overview page for security purposes. With sufficient permission to read the web app, you can select the change to view details around the old and new values: 

:::image type="content" source="./media/change-analysis/view-change-details.png" alt-text="Screenshot of viewing change details for troubleshooting.":::

The change details blade also shows important information, including who made the change. 

Now that you've discovered the web app in-guest change and understand next steps, you can proceed with troubleshooting the issue. 

## Next steps

Learn more about [Change Analysis](./change-analysis.md). 