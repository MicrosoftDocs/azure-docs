---
title: Forecasting at scale
titleSuffix: Azure Machine Learning
description: Learn about different ways to scale forecasting model training
services: machine-learning
author: ericwrightatwork
ms.author: erwright
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: conceptual
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv2, event-tier1-build-2022
ms.date: 05/12/2023
show_latex: true
---

# Forecasting at scale

This article is about training forecasting models on large quantities of historical data. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

Time series data can be large due to a large number of series in the data, a large number of historical observations, or both. **Many models** and hierarchical time series, or **HTS**, are scaling solutions for the former scenario, where the data consists of a large number of time series. Here, it can be beneficial for model accuracy and scalability to partition the data into groups and train a large number of independent models in parallel on the groups. Conversely, there are scenarios where one or a small number of high-capacity models is better. **Distributed DNN training** targets this case. We'll review concepts around these scenarios in the remainder of the article. 

## Many models

The many models [components](concept-component.md) in AutoML enable you to train and manage millions of models in parallel. For example, suppose you have historical sales data for a large number of stores. You can use many models to launch parallel AutoML training jobs for each store, as in the following diagram:  

:::image type="content" source="./media/how-to-auto-train-forecast/many-models.svg" alt-text="Diagram showing the AutoML many models workflow.":::

The many models training component applies AutoML's [model sweeping and selection](concept-automl-forecasting-sweeping.md) independently to each store in this example. This model independence aids scalability and can benefit model accuracy especially when the stores have diverging sales dynamics. However, a single model approach may yield more accurate forecasts when there are common sales dynamics. See the [distributed DNN training](#distributed-dnn-training) section for more details on that case.

You can configure the data partitioning, the [AutoML settings](how-to-auto-train-forecast.md#configure-experiment) for the models, and the degree of parallelism for many models training jobs. For examples, see our guide on [many models components](how-to-auto-train-forecast.md#forecasting-at-scale-many-models).        

## Hierarchical time series forecasting

In most applications, customers have a need to understand their forecasts at a macro and micro level of the business; whether that is predicting sales of products at different geographic locations, or understanding the expected workforce demand for different organizations at a company. The ability to train a machine learning model to intelligently forecast on hierarchy data is essential. 

A hierarchical time series is a structure in which the series have nested attributes. Geographic or product catalog attributes are natural examples. The following example shows data with unique attributes that form a hierarchy. Our hierarchy is defined by: the product type such as headphones or tablets, the product category which splits product types into accessories and devices, and the region the products are sold in. 

![Example raw data table for hierarchical data](./media/how-to-auto-train-forecast/hierarchy-data-table.svg)
 
To further visualize this, the leaf levels of the hierarchy contain all the time series with unique combinations of attribute values. Each higher level in the hierarchy considers one less dimension for defining the time series and aggregates each set of child nodes from the lower level into a parent node.
 
![Hierarchy visual for data](./media/how-to-auto-train-forecast/data-tree.svg)

The hierarchical time series solution is built on top of the Many Models Solution and share a similar configuration setup.

## Distributed DNN training 