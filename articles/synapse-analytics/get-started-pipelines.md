---
title: 'Tutorial: Get started orchestrate with pipelines' 
description: In this tutorial, you'll learn how orchestrate pipelines and activities using Synapse Studio.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: pipeline
ms.topic: tutorial
ms.date: 10/16/2020 
---

# Orchestrate with pipelines

In this tutorial, you'll learn how orchestrate pipelines and activities using Synapse Studio. 

## Overview

You can orchestrate a wide variety of tasks in Azure Synapse.

1. In Synapse Studio, go to the **Integrate** hub.
1. Select **+** > **Pipeline** to create a new pipeline.
1. Go to the **Develop** hub and select one of the notebooks you previously created.
1. Drag that notebook into the pipeline.
1. In the pipeline, select **Add trigger** > **New/edit**.
1. In **Choose trigger**, select **New**, and set the **Recurrence** to "every 1 hour".
1. Select **OK**. 
1. Select **Publish All**.
1. To make the pipeline run immediately, without waiting for the next hour, select **Add trigger** > **Trigger now**.



## Next steps

> [!div class="nextstepaction"]
> [Visualize data with Power BI](get-started-visualize-power-bi.md)
                                 
