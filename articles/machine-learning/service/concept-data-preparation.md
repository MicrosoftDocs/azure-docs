-
title: What is the Azure Data Prep SDK?
description: Learn about the Azure Data Prep SDK
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: cforbe
author: cforbe
ms.date: 08/30/2018
---

# What is the data prep SDK?
 
Having data preparation as part of the ML workflow will allow an easy way to read in data of various formats, transform it to be more usable, and write out the data to be consumed by models or another storage where models read from. 

Models become more accurate when they have access to more clean data. Data can come in different kinds of formats, so having an SDK that can read that data as part of the workflow makes it more efficient. 

Then when it becomes time to clean the data, using transforms makes it simple to add columns, filter out unwanted rows or columns, and impute missing values.

For models to consume the data that has been cleaned, it is easier to be able to access it in known formats like CSV or Parquet files. 

## The steps for data preparation with Azure Machine Learning 
- [Load Data](how-to-load-data.md )
- [Transform Data](how-to-transform-data.md )
- [Write Data](how-to-write-data.md )

## Next Steps
Here is an [example notebook](https://github.com/Microsoft/PendletonDocs/blob/master/Scenarios/GettingStarted/getting-started.ipynb) of data preparation.
