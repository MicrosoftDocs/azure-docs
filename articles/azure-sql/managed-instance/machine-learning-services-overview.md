---
title: Machine Learning Services in Azure SQL Managed Instance
description: This article provides an overview or Machine Learning Services in Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: machine-learning
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: garyericson
ms.author: garye
ms.reviewer: mathoma, davidph
manager: cgronlun
ms.date: 03/17/2021
---

# Machine Learning Services in Azure SQL Managed Instance

Machine Learning Services is a feature of Azure SQL Managed Instance that provides in-database machine learning, supporting both Python and R scripts. The feature includes Microsoft Python and R packages for high-performance predictive analytics and machine learning. The relational data can be used in scripts through stored procedures, T-SQL script containing Python or R statements, or Python or R code containing T-SQL.

## What is Machine Learning Services?

Machine Learning Services in Azure SQL Managed Instance lets you execute Python and R scripts in-database. You can use it to prepare and clean data, do feature engineering, and train, evaluate, and deploy machine learning models within a database. The feature runs your scripts where the data resides and eliminates transfer of the data across the network to another server.

Use Machine Learning Services with R/Python support in Azure SQL Managed Instance to:

- **Run R and Python scripts to do data preparation and general purpose data processing** - You can now bring your R/Python scripts to Azure SQL Managed Instance where your data lives, instead of having to move data out to some other server to run R and Python scripts. You can eliminate the need for data movement and associated problems related to latency, security, and compliance.

- **Train machine learning models in database** - You can train models using any open source algorithms. You can easily scale your training to the entire dataset rather than relying on sample datasets pulled out of the database.

- **Deploy your models and scripts into production in stored procedures** - The scripts and trained models can be operationalized simply by embedding them in T-SQL stored procedures. Apps connecting to Azure SQL Managed Instance can benefit from predictions and intelligence in these models by just calling a stored procedure. You can also use the native T-SQL PREDICT function to operationalize models for fast scoring in highly concurrent real-time scoring scenarios.

Base distributions of Python and R are included in Machine Learning Services. You can install and use open-source packages and frameworks, such as PyTorch, TensorFlow, and scikit-learn, in addition to the Microsoft packages 
[revoscalepy](/sql/machine-learning/python/ref-py-revoscalepy) and 
[microsoftml](/sql/machine-learning/python/ref-py-microsoftml) for Python, and 
 [RevoScaleR](/sql/machine-learning/r/ref-r-revoscaler), 
[MicrosoftML](/sql/machine-learning/r/ref-r-microsoftml), 
      [olapR](/sql/machine-learning/r/ref-r-olapr), and 
  [sqlrutils](/sql/machine-learning/r/ref-r-sqlrutils) for R.

## How to enable Machine Learning Services

You can enable Machine Learning Services in Azure SQL Managed Instance by enabling extensibility with the following SQL commands (SQL Managed Instance will restart and be unavailable for a few seconds):

```sql
sp_configure 'external scripts enabled', 1;
RECONFIGURE WITH OVERRIDE;
```

For details on how this command affects SQL Managed Instance resources, see [Resource Governance](machine-learning-services-differences.md#resource-governance).

### Enable Machine Learning Services in a failover group

In a [failover group](failover-group-add-instance-tutorial.md), system databases are not replicated to the secondary instance (see [Limitations of failover groups](../database/auto-failover-group-overview.md#limitations-of-failover-groups) for more information).

If the Managed Instance you're using is part of a failover group, do the following:

- Run the `sp_configure` and `RECONFIGURE` commands on each instance of the failover group to enable Machine Learning Services.

- Install the R/Python libraries on a user database rather than the master database.

## Next steps

- See the [key differences from SQL Server Machine Learning Services](machine-learning-services-differences.md).
- To learn how to use Python in Machine Learning Services, see [Run Python scripts](/sql/machine-learning/tutorials/quickstart-python-create-script?context=/azure/azure-sql/managed-instance/context/ml-context&view=azuresqldb-mi-current&preserve-view=true).
- To learn how to use R in Machine Learning Services, see [Run R scripts](/sql/machine-learning/tutorials/quickstart-r-create-script?context=/azure/azure-sql/managed-instance/context/ml-context&view=azuresqldb-mi-current&preserve-view=true).
- For more information about machine learning on other SQL platforms, see the [SQL machine learning documentation](/sql/machine-learning/index).
