---
title: 'Quickstart: Use a sample notebook from the Synapse Analytics gallery'
description: Learn how to use a sample notebook from the Synapse Analytics gallery to explore data and build a machine learning model.
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: quickstart
ms.date: 02/29/2024
author: midesa
ms.author: midesa
ms.custom: mode-other
---

# Quickstart: Use a sample notebook from the Synapse Analytics gallery

In this quickstart, you'll learn how to copy a sample machine learning notebook from the Synapse Analytics gallery into your workspace, modify it, and run it.

## Prerequisites

* [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
* [Spark pool](../get-started-analyze-spark.md) in your Azure Synapse Analytics workspace.

## Copy the notebook to your workspace

1. Open your workspace and select **Learn** from the home page.
1. In the **Knowledge center**, select **Browse gallery**.
1. In the gallery, select **Notebooks**.
1. Find and select a notebook from the gallery.

   :::image type="content" source="media\quickstart-gallery-sample-notebook\gallery-select-ml-notebook.png" alt-text="Select the machine learning sample notebook in the gallery.":::

1. Select **Continue**.
1. On the notebook preview page, select **Open notebook**. The sample notebook is copied into your workspace and opened.

    :::image type="content" source="media\quickstart-gallery-sample-notebook\gallery-open-ml-notebook.png" alt-text="Open the machine learning sample notebook into your workspace.":::

1. In the **Attach to** menu in the open notebook, select your Apache Spark pool.

## Save the notebook

To save your notebook by selecting **Publish** on the workspace command bar.

## Copying the sample notebook

To make a copy of this notebook, click the ellipsis in the top command bar and select **Clone** to create a copy in your workspace or **Export** to download a copy of the notebook (`.ipynb`) file.

:::image type="content" source="media\quickstart-gallery-sample-notebook\copy-notebook.png" alt-text="Make a copy of the notebook with the Export or Clone command.":::

## Clean up resources

To ensure the Spark instance is shut down when you're finished, end any connected sessions (notebooks). The pool shuts down when the **idle time** specified in the Apache Spark pool is reached. You can also select **stop session** from the status bar at the upper right of the notebook.

:::image type="content" source="media\quickstart-gallery-sample-notebook\stop-session.png" alt-text="Stop session.":::

## Next steps

* [Check out more Synapse sample notebooks in GitHub](https://github.com/Azure-Samples/Synapse/tree/main/MachineLearning)
* [Machine learning with Apache Spark](../spark/apache-spark-machine-learning-concept.md)
