---
title: 'Quickstart: Use a sample notebook from the Synapse Analytics gallery'
description: Learn how to use a sample notebook from the Synapse Analytics gallery to explore data and build a machine learning model.
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: quickstart
ms.reviewer: 
ms.date: 06/11/2021
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.custom: mode-other
---

# Quickstart: Use a sample notebook from the Synapse Analytics gallery

In this quickstart, you'll learn how to copy a sample machine learning notebook from the Synapse Analytics gallery into your workspace, modify it, and run it.
The sample notebook ingests an Open Dataset of NYC Taxi trips and uses visualization to help you prepare the data. It then trains a model to predict whether there will be a tip on a given trip.

This notebook demonstrates the basic steps used in creating a model: **data import**, **data prep**, **model training**, and **evaluation**. You can use this sample as a starting point for creating a model with your own data.

## Prerequisites

* [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
* [Spark pool](../get-started-analyze-spark.md) in your Azure Synapse Analytics workspace.

## Copy the notebook to your workspace

1. Open your workspace and select **Learn** from the home page.
1. In the **Knowledge center**, select **Browse gallery**.
1. In the gallery, select **Notebooks**.
1. Find and select the notebook "Data Exploration and ML Modeling - NYC taxi predict using Spark MLib".

   :::image type="content" source="media\quickstart-gallery-sample-notebook\gallery-select-ml-notebook.png" alt-text="Select the machine learning sample notebook in the gallery.":::

1. Select **Continue**.
1. On the notebook preview page, select **Open notebook**. The sample notebook is copied into your workspace and opened.

    :::image type="content" source="media\quickstart-gallery-sample-notebook\gallery-open-ml-notebook.png" alt-text="Open the machine learning sample notebook into your workspace.":::

1. In the **Attach to** menu in the open notebook, select your Apache Spark pool.

## Run the notebook

The notebook is divided into multiple cells that each perform a specific function.
You can manually run each cell, running cells sequentially, or select **Run all** to run all the cells.

Here are descriptions for each of the cells in the notebook:

1. Import PySpark functions that the notebook uses.
1. **Ingest Date** - Ingest data from the Azure Open Dataset **NycTlcYellow** into a local dataframe for processing. The code extracts data within a specific time period - you can modify the start and end dates to get different data.
1. Downsample the dataset to make development faster. You can modify this step to change the sample size or the sampling seed.
1. **Exploratory Data Analysis** - Display charts to view the data. This can give you an idea what data prep might be needed before creating the model.
1. **Data Prep and Featurization** - Filter out outlier data discovered through visualization and create some useful derived variables.
1. **Data Prep and Featurization Part 2** - Drop unneeded columns and create some additional features.
1. **Encoding** - Convert string variables to numbers that the Logistic Regression model is expecting.
1. **Generation of Testing and Training Data Sets** - Split the data into separate testing and training data sets. You can modify the fraction and randomizing seed used to split the data.
1. **Train the Model** - Train a Logistic Regression model and display its "Area under ROC" metric to see how well the model is working. This step also saves the trained model in case you want to use it elsewhere.
1. **Evaluate and Visualize** - Plot the model's ROC curve to further evaluate the model.

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
