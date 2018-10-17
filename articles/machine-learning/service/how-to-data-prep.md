---
title: Prepare data with the Machine Learning Data Prep SDK for Python - Azure
description: Learn how to use the Azure Machine Learning Data Prep SDK for Python to load data of various formats, transform it to be more usable, and write that data to a location for your models to access.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: cforbe
author: cforbe
manager: cgronlun
ms.reviewer: jmartens
ms.date: 09/24/2018
---

# Prepare data for modeling with Azure Machine Learning
 
Data preparation is an important part of a machine learning workflow. Your models will be more accurate and efficient if they have access to clean data in a format that is easier to consume. 

You can prepare your data in Python using the [Azure Machine Learning Data Prep SDK](https://docs.microsoft.com/python/api/overview/azure/dataprep?view=azure-dataprep-py). 

## Data preparation pipeline

The main data preparation steps are:

1. [Load data](how-to-load-data.md), which can be in various formats
2. [Transform](how-to-transform-data.md) it into a more usable structure
3. [Write](how-to-write-data.md)  that data to a location accessible to your models

![Data preparation process](./media/concept-data-preparation/data-prep-process.png)

## Next steps
Review an [example notebook](https://github.com/Microsoft/MSDataPrepDocs/blob/master/Scenarios/GettingStarted/getting-started.ipynb) of data preparation using the Azure Machine Learning Data Prep SDK.
