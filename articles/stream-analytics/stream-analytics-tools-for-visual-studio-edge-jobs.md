---
title: Azure Stream Analytics Edge jobs in Visual Studio
description: Author, debug, and create Azure Stream Analytics jobs for IoT Edge by using Stream Analytics tools for Visual Studio, then deploy them to your devices.
author: spelluru
ms.author: spelluru
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 08/25/2026
ai-usage: ai-assisted

#customer intent: As a Stream Analytics developer, I want to author, debug, and create Stream Analytics Edge jobs in Visual Studio so that I can deploy them to my IoT Edge devices.
---

# Develop Stream Analytics Edge jobs by using Visual Studio tools

In this article, you learn how to use Stream Analytics tools for Visual Studio to author, debug, and create Stream Analytics Edge jobs. After you create and test the job, you go to the Azure portal to deploy it to your devices.

## Prerequisites for developing Edge jobs

You need the following prerequisites to complete the steps in this article:

1. Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/), [Visual Studio 2015](https://www.visualstudio.com/vs/older-downloads/), or [Visual Studio 2013 Update 4](https://www.microsoft.com/download/details.aspx?id=45326). Stream Analytics tools support the Enterprise (Ultimate/Premium), Professional, and Community editions, but not the Express edition.

1. Follow the [installation instructions](stream-analytics-tools-for-visual-studio-install.md) to install Stream Analytics tools for Visual Studio.
 
## Create a Stream Analytics Edge project

Create the Edge project that contains your job definition.

1. From Visual Studio, select **File** > **New** > **Project**. Go to the **Templates** list on the left, and then expand **Azure Stream Analytics** > **Stream Analytics Edge** > **Azure Stream Analytics Edge Application**. Enter a name, location, and solution name for your project, and then select **OK**.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/new-stream-analytics-edge-project.png" alt-text="Screenshot of the New Project dialog box for creating an Azure Stream Analytics Edge application in Visual Studio.":::

1. After Visual Studio creates the project, go to **Solution Explorer** to view the folder hierarchy.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/edge-project-in-solution-explorer.png" alt-text="Screenshot of Solution Explorer showing the folder hierarchy of a Stream Analytics Edge project in Visual Studio.":::

 
## Choose the correct subscription

Connect Visual Studio to the Azure subscription where you want to create the job.

1. From your Visual Studio **View** menu, select **Server Explorer**.

1. Select and hold (or right-click) **Azure**, select **Connect to Microsoft Azure Subscription**, and then sign in with your Azure account.

## Define inputs

Configure the Edge Hub input that the job reads streaming events from.

1. From the **Solution Explorer**, expand the **Inputs** node. You see an input named **EdgeInput.json**. Open it to view its settings.

1. Set Source Type to **Data Stream**. Then set Source to **Edge Hub**, Event Serialization Format to **Json**, and Encoding to **UTF8**. Optionally, rename the **Input Alias**, but leave it as is for this example. If you rename the input alias, use the name you specify when you define the query. Select **Save** to save the settings.
   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/stream-analytics-input-configuration.png" alt-text="Screenshot of the Stream Analytics Edge Hub input configuration settings in Visual Studio.":::
 


## Define outputs

Configure the Edge Hub output that the job writes results to.

1. From the **Solution Explorer**, expand the **Outputs** node. You see an output named **EdgeOutput.json**. Open it to view its settings.

1. Set Sink to **Edge Hub**, set Event Serialization Format to **Json**, set Encoding to **UTF8**, and set Format to **Array**. Optionally, rename the **Output Alias**, but leave it as is for this example. If you rename the output alias, use the name you specify when you define the query. Select **Save** to save the settings.
   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/stream-analytics-output-configuration.png" alt-text="Screenshot of the Stream Analytics Edge Hub output configuration settings in Visual Studio.":::
 
## Review unsupported operations

Stream Analytics jobs deployed in the Stream Analytics IoT Edge environments support most of the [Stream Analytics Query Language reference](/stream-analytics-query/stream-analytics-query-language-reference). However, the following operations aren't supported for Stream Analytics Edge jobs:

1. PARTITION BY
1. TIMESTAMP BY OVER
1. JavaScript UDF
1. User-defined aggregates (UDA)
1. GetMetadataPropertyValue
1. Using more than 14 aggregates in a single step

When you create a Stream Analytics Edge job in the portal, the compiler automatically warns you if you aren't using a supported operator.

## Define the transformation query

From Visual Studio, define the following transformation query in the query editor (the `script.asaql` file).

```sql
SELECT * INTO EdgeOutput
FROM EdgeInput 
```

## Test the job locally

To test the query locally, upload the sample data. To get sample data, download the registration data from the [GitHub repository](https://github.com/Azure/azure-stream-analytics/blob/master/Sample%20Data/Registration.json) and save it to your local computer.

1. To upload sample data, select and hold (or right-click) the **EdgeInput.json** file, and then select **Add Local Input**.

1. In the pop-up window, **Browse** the sample data from your local path and select **Save**.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/stream-analytics-local-input-configuration.png" alt-text="Screenshot of the local input configuration for uploading sample data in Visual Studio.":::

1. Visual Studio automatically adds a file named **local_EdgeInput.json** to your inputs folder.

1. You can either run it locally or submit it to Azure. To test the query, select **Run Locally**.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/stream-analytics-visual-stuidio-run-options.png" alt-text="Screenshot of the Stream Analytics job run options showing Run Locally in Visual Studio.":::

1. The command prompt window shows the status of the job. When the job runs successfully, it creates a folder that looks like `2018-02-23-11-31-42` in your project folder path `Visual Studio 2015\Projects\MyASAEdgejob\MyASAEdgejob\ASALocalRun\2018-02-23-11-31-42`. Go to the folder path to view the results in the local folder.

   You can also sign in to the Azure portal and verify that the job is created. 

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/stream-analytics-job-result-folder.png" alt-text="Screenshot of the Stream Analytics job result folder showing local run output in Visual Studio.":::

## Submit the job to Azure

After you test the query, publish the job to your Azure subscription.

1. Before you submit the job to Azure, connect to your Azure subscription. Open **Server Explorer**, select and hold (or right-click) **Azure**, select **Connect to Microsoft Azure subscription**, and then sign in to your Azure subscription.

1. To submit the job to Azure, go to the query editor and select **Submit to Azure**.

1. A pop-up window opens. Choose to update an existing Stream Analytics Edge job or create a new one. When you update an existing job, it replaces all the job configuration. In this scenario, you publish a new job. Select **Create a New Azure Stream Analytics Job**, enter a name for your job such as **MyASAEdgeJob**, choose the required **Subscription**, **Resource Group**, and **Location**, and then select **Submit**.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/submit-stream-analytics-job-to-azure.png" alt-text="Screenshot of the dialog box for submitting a Stream Analytics Edge job to Azure from Visual Studio.":::
 
   You now have a Stream Analytics Edge job. To learn how to deploy it to your devices, see [Run jobs on IoT Edge](stream-analytics-edge.md).

## Manage the job

Manage the job status and the job diagram from Server Explorer.

1. From **Stream Analytics** in **Server Explorer**, expand the subscription and the resource group where you deployed the Stream Analytics Edge job. You see **MyASAEdgejob** with the status **Created**. Expand your job node, and then open it to view the job.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/server-explorer-options.png" alt-text="Screenshot of Server Explorer showing job management options for a Stream Analytics Edge job.":::

1. In the job view window, you can refresh the job, delete it, and open it in the Azure portal.

   :::image type="content" source="./media/stream-analytics-tools-for-visual-studio-edge-jobs/job-diagram-and-other-options.png" alt-text="Screenshot of the job view window showing the job diagram and other options in Visual Studio.":::

## Related content

* [What is Azure IoT Edge?](../iot-edge/about-iot-edge.md)
* [Deploy Azure Stream Analytics as an IoT Edge module](../iot-edge/tutorial-deploy-stream-analytics.md)
