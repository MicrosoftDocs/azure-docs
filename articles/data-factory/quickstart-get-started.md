---
title: Get Started and Try Out Your First Data Factory Pipeline
description: Get started with your first data factory to copy data from one Azure Blob Storage folder to another.
author: whhender
ms.subservice: data-movement
ms.devlang: bicep
ms.topic: get-started
ms.date: 02/13/2025
ms.author: whhender
ms.reviewer: xupzhou
ms.custom: subject-armqs
---

# Get started with Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Welcome to Azure Data Factory! This article helps you create your first data factory and pipeline within five minutes.

The Azure Resource Manager template (ARM template) in this article creates and configures everything you need. Then you can go to your demo data factory and trigger the pipeline, which moves some sample data from one Azure Blob Storage folder to another.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Video summary

The following video provides a walkthrough of the sample in this article:

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=0550df36-bfe6-407b-b00b-1b60fa700e94]

## Step 1: Use the demo to create resources

In this demo scenario, you use the [copy activity](copy-activity-overview.md) in a data factory to copy a blob named moviesDB2.csv from an input folder in Azure Blob Storage to an output folder. In a real-world scenario, this copy operation could be between any of the many supported data sources and sinks available in the service. It could also involve transformations in the data.

1. Select the following button.

   [![Try your first data factory demo](./media/quickstart-get-started/try-it-now.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-get-started%2Fazuredeploy.json)

   Selecting the button creates the following Azure resources:

   - An Azure Data Factory account
   - A data factory that contains a pipeline with one copy activity
   - An Azure Blob Storage account with [moviesDB2.csv](https://raw.githubusercontent.com/kromerm/adfdataflowdocs/master/sampledata/moviesDB2.csv) uploaded into an input folder as a source
   - A linked service to connect the data factory to Blob Storage

1. You're directed to the configuration page to deploy the template. On this page:

   1. For **Resource group**, select **Create new** to create a resource group. You can leave all the other values with their defaults.

   1. Select **Review + create**, and then select **Create** to deploy the resources.

   :::image type="content" source="media/quickstart-get-started/deploy-template.png" alt-text="Screenshot of the page for deploying a template for the creation of resources.":::

> [!NOTE]
> The user who deploys the template needs to assign a role to a managed identity. This step requires permissions that can be granted through the Owner, User Access Administrator, or Managed Identity Operator role.

All the resources in this demo are created in the new resource group, so you can easily clean them up later.

## Step 2: Review deployed resources

1. In the message that shows successful completion of your deployment, select **Go to resource group**.

   :::image type="content" source="media/quickstart-get-started/deployment-complete.png" alt-text="Screenshot of the Azure portal page that shows successful deployment of the demo template.":::

1. The resource group includes the new data factory, Blob Storage account, and managed identity that the deployment created. Select the data factory in the resource group to view it.

   :::image type="content" source="media/quickstart-get-started/resource-group-contents.png" alt-text="Screenshot of the contents of the resource group created for the demo, with the data factory highlighted.":::

1. Select the **Launch studio** button.

   :::image type="content" source="media/quickstart-get-started/launch-adf-studio.png" alt-text="Screenshot of the Azure portal that shows details for the newly created data factory, with the button for opening Azure Data Factory Studio highlighted.":::

1. In Azure Data Factory Studio:

   1. Select the **Author** tab <img src="media/quickstart-get-started/author-button.png" alt="Author tab"/>.
   1. Select the pipeline that the template created.
   1. Check the source data by selecting **Open**.

   :::image type="content" source="media/quickstart-get-started/view-pipeline.png" alt-text="Screenshot of Azure Data Factory Studio that shows the pipeline created by the template.":::

1. In the source dataset, select **Browse** to view the input file created for the demo.

   :::image type="content" source="media/quickstart-get-started/source-dataset-browse.png" alt-text="Screenshot of the source dataset, with the Browse button highlighted.":::

   Note the moviesDB2.csv file, which was already uploaded into the input folder.

   :::image type="content" source="media/quickstart-get-started/input-contents.png" alt-text="Screenshot of the contents of the input folder, showing the input file used in the demo.":::

## Step 3: Trigger the demo pipeline to run

1. Select **Add trigger**, and then select **Trigger now**.

   :::image type="content" source="media/quickstart-get-started/trigger-now.png" alt-text="Screenshot of the button for the triggering the demo pipeline to run.":::
1. On the right pane, under **Pipeline run**, select **OK**.

## Monitor the pipeline

1. Select the **Monitor** tab <img src="media/quickstart-get-started/monitor-button.png" alt="Monitor tab"/>. This tab provides an overview of your pipeline runs, including the start time and status.
  
   :::image type="content" source="media/quickstart-get-started/monitor-overview.png" alt-text="Screenshot of the tab for monitoring pipeline runs in a data factory.":::

1. In this quickstart, the pipeline has only one activity type: **Copy data**. Select the pipeline name to view the details of the copy activity's run results.

   :::image type="content" source="media/quickstart-get-started/copy-activity-run-results.png" alt-text="Screenshot of the run results of a copy activity on the tab for monitoring a data factory.":::

1. Select the **Details** icon to display the detailed copy process. In the results, the **Data read** and **Data written** sizes are the same, and one file was read and written. This information proves that all the data was successfully copied to the destination.

   :::image type="content" source="media/quickstart-get-started/copy-activity-detailed-run-results.png" alt-text="Screenshot of detailed run results for a copy activity.":::

## Clean up resources

You can clean up all the resources that you created in this article in either of two ways:

- You can [delete the entire Azure resource group](../azure-resource-manager/management/delete-resource-group.md), which includes all the resources created in it.
- If you want to keep some resources intact, go to the resource group and delete only the specific resources that you want to remove.

  For example, if you're using this template to create a data factory for use in another tutorial, you can delete the other resources but keep only the data factory.

## Related content

In this article, you created a data factory that contained a pipeline with a copy activity. To learn more about Azure Data Factory, continue on to the following article and training module:

- [Quickstart: Use the copy data tool in the Azure Data Factory Studio to copy data](quickstart-hello-world-copy-data-tool.md)
- [Training module: Introduction to Azure Data Factory](/learn/modules/intro-to-azure-data-factory/)
