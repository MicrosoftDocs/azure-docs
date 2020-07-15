---
title: Load data into Azure Storage environments - Team Data Science Process
description: Learn about how to ingest data into various target environments where the data is stored and processed.
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Load data into storage environments for analytics

The Team Data Science Process requires that data be ingested or loaded into the most appropriate way in each stage. Data destinations can include Azure Blob Storage, SQL Azure databases, SQL Server on Azure VM, HDInsight (Hadoop), Synapse Analytics, and Azure Machine Learning. 

The following articles describe how to ingest data into various target environments where the data is stored and processed.

* To/From [Azure Blob Storage](move-azure-blob.md)
* To [SQL Server on Azure VM](move-sql-server-virtual-machine.md)
* To [Azure SQL Database](move-sql-azure.md)
* To [Hive tables](move-hive-tables.md)
* To [SQL partitioned tables](parallel-load-sql-partitioned-tables.md)
* From [On-premises SQL Server](move-sql-azure-adf.md)

Technical and business needs, as well as the initial location, format, and size of your data will determine the best data ingestion plan. It is not uncommon for a best plan to have several steps. This sequence of tasks can include, for example, data exploration, pre-processing, cleaning, down-sampling, and model training.  Azure Data Factory is a recommended Azure resource to orchestrate data movement and transformation.
