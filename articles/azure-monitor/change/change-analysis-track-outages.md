---
title: "Tutorial: Track a web app outage using Change Analysis"
description: Describes how to identify the root cause of a web app outage using Azure Monitor Change Analysis.
ms.topic: how-to
ms.author: hannahhunter
author: hhunter-ms
ms.date: 11/17/2023
ms.subservice: change-analysis
---

# Tutorial: Track a web app outage using Change Analysis

When your application runs into an issue, you need configurations and resources to triage breaking changes and discover root-cause issues. Change Analysis provides a centralized view of the changes in your subscriptions for up to 14 days prior to provide the history of changes for troubleshooting issues.  

To track an outage, we will: 

> [!div class="checklist"]
> - Clone, create, and deploy a [sample web application](https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample) with a storage account.
> - Enable Change Analysis to track changes for Azure resources and for Azure Web App configurations
> - Troubleshoot a Web App issue using Change Analysis

## Pre-requisites

- Install [.NET 7.0 or above](https://dotnet.microsoft.com/download). 
- Install [the Azure CLI](/cli/azure/install-azure-cli). 

## Set up the test application

### Clone

1. In your preferred terminal, log in to your Azure subscription.

```bash
az login
az account set -s {azure-subscription-id}
```

1. Clone the [sample web application with storage to test Change Analysis](https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample).

```bash
git clone https://github.com/Azure-Samples/changeanalysis-webapp-storage-sample.git
```

1. Change the working directory to the project folder.

```bash
cd changeanalysis-webapp-storage-sample
``` 

### Run the PowerShell script

1. In the project folder, open `Publish-WebApp.ps1`.

1. Edit the `SUBSCRIPTION_ID` and `LOCATION` environment variables.

   | Environment variable | Description |
   | -------------------- | ----------- | 
   | `SUBSCRIPTION_ID`    | Your Azure subscription ID. |
   | `LOCATION`           | The location of the resource group where you'd like to deploy the sample application. |

1. Save your changes.

1. Run the script from the `./changeanalysis-webapp-storage-sample` directory.

```bash
./Publish-WebApp.ps1
```

## Enable Change Analysis

In the Azure portal, [navigate to the Change Analysis standalone UI](./change-analysis-visualizations.md#access-change-analysis-screens). Page loading may take a few minutes as the `Microsoft.ChangeAnalysis` resource provider is registered. 

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

Since the connection string is a secret value, we hide it on the overview page for security purposes. With sufficient permission to read the web app, you can select the change to view details around the old and new values: 

:::image type="content" source="./media/change-analysis/view-change-details.png" alt-text="Screenshot of viewing change details for troubleshooting.":::

The change details pane also shows important information, including who made the change. 

Now that you've discovered the web app in-guest change and understand next steps, you can proceed with troubleshooting the issue. 

## Virtual network changes

Knowing what changed in your application's networking resources is critical due to their effect on connectivity, availability, and performance. Change Analysis supports all network resource changes and captures those changes immediately. Networking changes include:

- Firewalls created or edited
- Network critical changes (for example, blocking port 22 for TCP connections)
- Load balancer changes
- Virtual network changes

The sample application includes a virtual network to make sure the application remains secure. Via the Azure portal, you can view and assess the network changes captured by Change Analysis. 

:::image type="content" source="./media/change-analysis/networking-changes.png" alt-text="Screenshot of Change Analysis capturing networking changes.":::


## Next steps

Learn more about [Change Analysis](./change-analysis.md).
