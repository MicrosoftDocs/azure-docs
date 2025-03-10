---
title: 'Tutorial: Get started integrate with pipelines' 
description: In this tutorial, you learn how to integrate pipelines and activities using Synapse Studio.
author: whhender
ms.author: whhender
ms.reviewer: whhender
ms.service: azure-synapse-analytics
ms.subservice: pipeline
ms.topic: tutorial
ms.date: 12/11/2024
---

# Tutorial: Integrate with pipelines

In this tutorial, you learn how to integrate pipelines and activities using Synapse Studio. 

## Create a pipeline and add a notebook activity

1. In Synapse Studio, go to the **Integrate** hub.
1. Select **+** > **Pipeline** to create a new pipeline. Select the new pipeline object to open the Pipeline designer.
1. Under **Activities**, expand the **Synapse** folder, and drag a **Notebook** object into the designer.
1. Select the **Settings** tab of the Notebook activity properties. Use the drop-down list to select a notebook from your current Synapse workspace.

## Schedule the pipeline to run every hour

1. In the pipeline, select **Add trigger** > **New/edit**.
1. In **Choose trigger**, select **New**, and set the **Recurrence** to "every 1 hour".
1. Select **OK**.
1. Select **Publish All**.

## Forcing a pipeline to run immediately

Once the pipeline is published, you might want to run it immediately without waiting for an hour to pass.

1. Open the pipeline.
1. Select **Add trigger** > **Trigger now**.
1. Select **OK**.

## Monitor pipeline execution

1. Go to the **Monitor** hub.
1. Select **Pipeline runs** to monitor pipeline execution progress.
1. In this view, you can switch between tabular **List** display a graphical **Gantt** chart.
1. Select a pipeline name to see the status of activities in that pipeline.

## Next step

> [!div class="nextstepaction"]
> [Visualize data with Power BI](get-started-visualize-power-bi.md)
