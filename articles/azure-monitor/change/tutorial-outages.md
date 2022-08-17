---
title: Tutorial - Track a web app outage using Change Analysis
description: Tutorial on how to identify the root cause of a web app outage using Azure Monitor Change Analysis.
ms.topic: tutorial
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.reviewer: cawa
ms.date: 08/04/2022
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell
---

# Tutorial: Track a web app outage using Change Analysis

When issues happen, one of the first things to check is what changed in application, configuration and resources to triage and root cause issues. Change Analysis provides a centralized view of the changes in your subscriptions for up to the past 14 days to provide the history of changes for troubleshooting issues.  

In this tutorial, you will: 

> [!div class="checklist"]
> - Clone, create, and deploy a [sample web application](https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample) with a storage account.
> - Enable Change Analysis to track changes for Azure resources and for Azure Web App configurations
> - Troubleshoot a Web App issue using Change Analysis

## Pre-requisites

- Install [.NET 5.0 or above](https://dotnet.microsoft.com/download). 
- Install [the Azure CLI](/cli/azure/install-azure-cli). 

## Set up the test application

### Clone

1. In your preferred terminal, log in to your Azure subscription.

```bash
az login
az account set --s {azure-subscription-id}
```

1. Clone the [sample web application with storage to test Change Analysis](https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample).

```bash
git clone https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample.git
```

1. Change the working directory to the project folder.

```bash
cd changeanalysis-webapp-storage-sample
``` 

### Create and deploy

1. Create and deploy the web application.

```bash
az webapp up --name {webapp_name} --sku S2 --location eastus
```

1. Make a note of the resource group created, if you'd like to deploy your storage account in the same resource group.

1. Create the storage account.

```bash
az storage account create --name {storage_name} --resource-group {resourcegroup_name} --sku Standard_RAGRS --https-only
```

1. Show your new storage account connection string.

```bash
az storage account show-connection-string -g {resourcegroup_name} -n {storage_name}
```

1. Connect the web application to the storage account through **App Settings**.

```bash
az webapp config appsettings set -g {resourcegroup_name} -n {webapp_name} --settings AzureStorageConnection={storage_connectionstring_from_previous_step}
```

## Enable Change Analysis

In the Azure portal, [navigate to the Change Analysis standalone UI](./change-analysis-visualizations.md). This may take a few minutes as the `Microsoft.ChangeAnalysis` resource provider is registered. 

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