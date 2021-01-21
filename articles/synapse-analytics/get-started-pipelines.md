---
title: 'Tutorial: Get started to integrate with pipelines' 
description: In this tutorial, you'll learn how to integrate pipelines and activities using Synapse Studio.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: pipeline
ms.topic: tutorial
ms.date: 12/31/2020
---

# Integrate with pipelines

In this tutorial, you'll learn how to integrate pipelines and activities using Synapse Studio. 

## Overview

You can integrate a wide variety of tasks in Azure Synapse.

1. In Synapse Studio, go to the **Integrate** hub.
1. Select **+** > **Pipeline** to create a new pipeline. Click on the new pipeline object to open the Pipeline designer.
1. Under **Activities**, expand the **Synapse** folder, and drag a **Notebook** object into the designer.
1. Select the **Settings** tab of the Notebook activity properties. Use the drop-down list to select any notebook from your current Synapse workspace. 
1. In the pipeline, select **Add trigger** > **New/edit**.
1. In **Choose trigger**, select **New**, and set the **Recurrence** to "every 1 hour".
1. Select **OK**. 
1. Select **Publish All**. 


## Monitor pipeline

1. Once the pipeline is published, to make the pipeline run immediately, without waiting for the next hour, select **Add trigger** > **Trigger now**.
1. In Synapse Studio, go to the **Monitor** hub, and select **Pipeline runs** to monitor pipeline execution progress.



## Next steps

> [!div class="nextstepaction"]
> [Visualize data with Power BI](get-started-visualize-power-bi.md)
