---
title: Deep learning with AutoML forecasting 
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's AutoML uses machine learning to build forecasting models
services: machine-learning
author: ericwrightatwork
ms.author: erwright
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: conceptual
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv2, event-tier1-build-2022
ms.date: 02/06/2023
show_latex: true
---

# Deep learning with AutoML forecasting

This article focuses on the deep learning methods for time series forecasting in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

Deep learning has made a major impact in fields ranging from [language modeling](../cognitive-services/openai/concepts/models.md) to [protein folding](https://www.deepmind.com/research/highlighted-research/alphafold), among many others. Time series forecasting has likewise benefitted from recent advances in deep learning technology. For example, deep learning models feature prominently in the top performing models from the [fourth](https://www.uber.com/blog/m4-forecasting-competition/) and [fifth](https://www.sciencedirect.com/science/article/pii/S0169207021001874) iterations of the high-profile Makridakis forecasting competition. 

## ForecastTCN

:::image type="content" source="media/how-to-auto-train-forecast/tcn-basic.png" alt-text="Diagram showing major components of AutoML's ForecastTCN.":::
