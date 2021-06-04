---
title: 'Quickstart: Use a sample notebook from the Synapse Analytics gallery'
description: Learn how to use a sample notebook from the Synapse Analytics gallery to explore data and build a machine learning model.
services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: quickstart
ms.reviewer: 

ms.date: 06/03/2021
author: garyericson
ms.author: garye
---

# Quickstart: Use a sample notebook from the Synapse Analytics gallery

In this quickstart, you'll learn how to copy a sample machine learning notebook from the Synapse Analytics gallery into your workspace, modify it, and run it.
The sample notebook ingests an Open Dataset of NYC Taxi trips and uses visualization to help you prepare the data. It then trains a model to predict whether there will be a tip on a given trip.

## Prerequisites

* [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
* Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a Spark pool in Azure Synapse](../get-started-analyze-spark.md).

## Copy the notebook to your workspace

1. Open your workspace and select **Learn** from the home page.
1. Click **Browse gallery** from the Knowledge center.
1. Click **Notebooks** in the Gallery.
1. Find and select the notebook "Data Exploration and ML Modeling - NYC taxi predict using Spark MLib".
1. Click **Continue**.
1. Click **Open notebook**. The sample notebook is copied into your workspace and opened.
1. In the **Attach to** menu, select your Apache Spark pool.

## Run the notebook

The notebook is divided into multiple cells that each perform a specific function.
You can run each step separately, or select **Run all** to have the steps run sequentially.

1. Import PySpark functions that you'll be using.
1. Ingest data from the Azure Open Dataset NycTlcYellow into a local dataframe for processing. The sample notebook extracts data within a specific time period - you can modify the start and end dates to get different data.
1. Downsample the dataset to make development faster. You can modify this step to change the sample size or the sampling seed.
1. Display charts to view the data. This can give you an idea what data prep might be needed before creating the model.
1. Do data prep and featurization by filtering out outlier data discovered through visualization and creating some useful derived variables.
1. Do more data prep and featurization by dropping unneeded columns and creating some additional features.
1. Convert string variables to numbers that the Logistic Regression model will need.
1. Split the data into separate testing and training data sets. You can modify the fraction and randomizing seed used to split the data.
1. Train a Logistic Regression model and display its "Area under ROC" metric to see how well the model is working. This step also saves the trained model in case you want to use it elsewhere.
1. Plot the model's ROC curve to further evaluate the model.

Remember to save your notebook by selecting **Publish** on the workspace command bar.

## Using the sample notebook

This notebook demonstrates the basic steps used in creating a model: data import, data prep, model training and testing, and evaluation. You can use this sample as a starting point for creating a model with your own data.

To create a copy of the notebook, right-click the notebook and select **Clone** to create a copy in your workspace or **Export** to download a copy of the notebook file.

## Clean up resources

To ensure the Spark instance is shut down, end any connected sessions(notebooks). The pool shuts down when the **idle time** specified in the Apache Spark pool is reached. You can also select **stop session** from the status bar at the upper right of the notebook.

![screenshot-showing-stop-session](./media/tutorial-build-applications-use-mmlspark/stop-session.png)

## Next steps

* [Check out more Synapse sample notebooks](https://github.com/Azure-Samples/Synapse/tree/main/MachineLearning)
* [Machine learning with Apache Spark](../spark/apache-spark-machine-learning-concept.md)
