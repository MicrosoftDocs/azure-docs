---
title: 'Tutorial: Get started with Azure Synapse Analytics' 
description: In this tutorial, you'll learn the basic steps to set up and use Azure Synapse Analytics.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: tutorial
ms.date: 05/19/2020 
---


# Orchestrate activities with pipelines

## Overview

You can orchestrate a wide variety of tasks in Azure Synapse.

1. In Synapse Studio, go to the **Orchestrate** hub.
1. Select **+** > **Pipeline** to create a new pipeline.
1. Go to the **Develop** hub and find the notebook you previously created.
1. Drag that notebook into the pipeline.
1. In the pipeline, select **Add trigger** > **New/edit**.
1. In **Choose trigger**, select **New**, and then in **recurrence** set the trigger to run every 1 hour.
1. Select **OK**.
1. Select **Publish All**. The the pipeline runs every hour.
1. To make the pipeline run now, without waiting for the next hour, select **Add trigger** > **New/edit**.

