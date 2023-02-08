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

In this article, we go over deep learning approaches to forecasting in AutoML. We'll describe basic data assumptions and model structure to help you best apply our models to your problem.  

## ForecastTCN

The following image is a simplified diagram of the ForecastTCN architecture:
:::image type="content" source="media/how-to-auto-train-forecast/tcn-basic.png" alt-text="Diagram showing major components of AutoML's ForecastTCN.":::

We can give a more precise definition of the ForecastTCN architecture in terms of formulas. Let $X$ be an input array of size $\text{number of features} \times \text{receptive field}$. We can divide the rows of $X$ into numeric and categorical arrays, $X = \begin{bmatrix} X_{n} \\ X_{c} \end{bmatrix}$. Then, ForecastTCN is given by,
 
$\begin{align} \notag \begin{split} h_{0} & = \text{premix\_layer}\left(\begin{bmatrix} X_{n} \\ W_{e} X_{c} \end{bmatrix}\right), \\
 h_{k} & = \text{residual\_convolutional\_cell}(h_{k-1}), \hspace{2mm} k \in [1, \ldots, n], \\
f_{q} & = \text{forecast\_head}\left(\begin{bmatrix} h_{1} \\ \vdots \\ h_{n}\end{bmatrix}\right), \hspace{2mm} q \in [10, 25, 50, 75, 90] \end{split} \end{align}$

where $W_{e}$ is an embedding matrix for the categorical features, $h_{k}$ denotes a hidden layer output of size $\text{number of channels} \times \text{receptive field}$, and the $f_{q}$ are forecast outputs, of size $1 \times \text{forecast horizon}$, for given quantiles of the prediction distribution.  
