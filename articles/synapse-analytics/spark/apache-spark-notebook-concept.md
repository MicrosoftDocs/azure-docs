---
title: Overview of Azure Synapse Analytics notebooks
description: This article provides an overview of the capabilities available through Azure Synapse Analytics notebooks.
author: midesa
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 11/18/2020
ms.author: midesa
ms.reviewer: sngun 
ms.subservice: spark
---

# Azure Synapse Analytics notebooks

A Synapse Studio notebook is a web interface for you to create files that contain live code, visualizations, and narrative text. Notebooks are a good place to validate ideas and use quick experiments to get insights from your data. 

With an Synapse Studio notebook, you can:

* Get started with zero setup effort.
* Keep data secure with built-in enterprise security features.
* Analyze data across raw formats (CSV, txt, JSON, etc.), processed file formats (parquet, Delta Lake, ORC, etc.), and SQL tabular data files against Spark and SQL.
* Be productive with enhanced authoring capabilities and built-in data visualization.

This section contains articles on mixing languages, creating data visualizations, parameterizing notebooks, building pipelines, and more. It also contains references and tutorials on how you can get started with your notebook development.

## Create, manage, and use notebooks
You can manage notebooks using the Synapse Studio UI. 

To learn more on how you can create and manage notebooks, see the following articles:
  - Manage Notebooks
    - [Create notebooks](./spark/../apache-spark-development-using-notebooks.md#create-a-notebook)
    - [Develop notebooks](./spark/../apache-spark-development-using-notebooks.md#develop-notebooks)
    - [Bring data to a notebook](./spark/../apache-spark-development-using-notebooks.md#bring-data-to-a-notebook)
    - [Use multiple languages using magic commands and temporary tables](./spark/../apache-spark-development-using-notebooks.md#integrate-a-notebook)
    - [Use cell magic commands](./spark/../apache-spark-development-using-notebooks.md#magic-commands)
  - Development
    - [Configure Spark session settings](./spark/../apache-spark-development-using-notebooks.md#spark-session-configuration)
    - [Use Microsoft Spark utilities](./spark/../microsoft-spark-utilities.md)
    - [Visualize data using notebooks and libraries](./spark/../apache-spark-data-visualization.md)
    - [Integrate a notebook into pipelines](./spark/../apache-spark-development-using-notebooks.md#integrate-a-notebook)


## Next steps
Notebooks are also widely used in data preparation, data visualization, machine learning, and other big data scenarios. To learn more about how you can use notebooks for your data analysis and big data scenarios, please visit the following tutorials:
  - [Create a notebook](./spark/../../quickstart-apache-spark-notebook.md)
  - [Create visualizations using Synapse Studio notebooks](./spark/../apache-spark-data-visualization-tutorial.md)
  - [Build machine learning models with Apache Spark MLlib](./spark/../apache-spark-machine-learning-mllib-notebook.md)
  - [Build machine learning models with Azure automated ML](./spark/../apache-spark-azure-machine-learning-tutorial.md)
