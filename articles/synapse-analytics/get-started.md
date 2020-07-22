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

# Get Started with Azure Synapse Analytics

This tutorial is a step-by-step guide through the major feature areas of Azure Synapse Analytics. The tutorial is the ideal starting point for someone who wants a guided tour through the key scenarios of Azure Synapse Analytics. After following the steps in the tutorial, you will have a fully functional Synapse workspace in which you can start analyzing data using SQL, SQL on-demand, and Apache Spark.

You will learn to:
* Provision a Synapse workspace in an Azure subscription
* Configure access control on an ADLSGEN2 account so that it seamlessly works with the Synapse workspace
* Load in the NYCTaxi sample data into the Synapse workspace so that it can be used by SQL, SQL on-demand, and Spark
* Edit and run SQL scripts and Synapse Notebooks using Synapse Studio
* Query SQL tables and Spark tables
* Load data from SQL tables into Spark dataframes
* Load data into SQL tables from Spark dataframes
* Explore the contents of an ADLSGEN2 account
* Analyze  parquet datafiles in ADLSGEN2 accounts using Spark and SQL on-demand 
* Build a data pipeline that automatically runs a Synapse notebook every hour

Follow the steps *in order* as shown below and you'll take a tour through many of the capabilities and learn how to exercise its core features.

* [STEP 1 - Create and setup a Synapse workspace](get-started-create-workspace.md)
* [STEP 2 - Analyze using a SQL Pool](get-started-analyze-sql-pool.md)
* [STEP 3 - Analyze using Spark](get-started-analyze-spark.md)
* [STEP 4 - Analyze using SQL on-demand](get-started-analyze-sql-on-demand.md)
* [STEP 5 - Analyze data in a storage account](get-started-analyze-storage.md)
* [STEP 6 - Orchestrate with pipelines](get-started-pipelines.md)
* [STEP 7 - Visualize data with Power BI](get-started-visualize-power-bi.md)
