---
title: Load data into Azure storage environments for analytics | Microsoft Docs
description: Move Data to and from Azure Blob Storage
services: machine-learning,storage
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: b8fbef77-3e80-4911-8e84-23dbf42c9bee
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/29/2017
ms.author: bradsev

---
# Load data into storage environments for analytics
The *Team Data Science Process* requires that data be ingested or loaded into appropriate storage environments prior to data analysis. The ingested data will then be cleaned, structured, and visualized. 

Data destinations commonly used for processing include: 

* Azure Blob Storage
* Azure SQL Databases
* SQL Server on Azure VM
* HDInsight (Hadoop)
* Azure Machine Learning

[!INCLUDE [cap-ingest-data-selector](../../includes/cap-ingest-data-selector.md)]

This **menu** links to topics that describe how to ingest data into these target environments where the data is stored and processed.

**Technical and business needs**, as well as the initial **location**, **format** and **size** of your data will determine the target environments into which the data should be ingested. It is not uncommon for a scenario to require data to be moved between several environments to achieve the variety of tasks required to construct a predictive model. This sequence of tasks can include, for example, data exploration, pre-processing, cleaning, down-sampling, and model training.
