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

ForecastTCN is a [temporal convolutional network](https://arxiv.org/abs/1803.01271), or TCN, which has a deep neural network architecture specifically designed for time series data. The model uses historical data for a target quantity, along with related features, to make probabilistic forecasts of the target up-to a given horizon. The following image shows an overview the ForecastTCN architecture:
:::image type="content" source="media/how-to-auto-train-forecast/tcn-basic.png" alt-text="Diagram showing major components of AutoML's ForecastTCN.":::

ForecastTCN has three main components: a **pre-mix** layer, a stack of **dilated convolution** layers, and a collection of **forecast head** units that each give a horizon of forecasts for a quantile of the prediction distribution. The pre-mix layer mixes the input time series data into an array of signal **channels** that the convolutional stack will process. The stack processes the channel array sequentially; each layer in the stack processes the output of the previous layer to produce a new channel array. Each channel in this output is a mixture of convolution-filtered signals from the input channels. Finally, the forecast heads coalesce the output signals from the convolution layers and generate forecasts of the target quantity from this latent representation. 

### Dilated causal convolution

The central operation of a TCN is a dilated, causal convolution along the time dimension of an input signal. Intuitively, convolution mixes together values from adjacent time points in the input. The proportions in the mixture are the **kernel**, or the weights, of the convolution while the separation between points in the mixture is the **dilation**. A **causal** convolution is one in which the kernel only mixes input values in the past relative to an output point, preventing time leaks.

Stacking dilated convolutions gives the TCN the ability to model correlations over long durations in the input signals with relatively few kernel parameters. 

:::image type="content" source="media/concept-automl-forecasting-deep-learning/tcn-dilated-conv.png" alt-text="Diagram showing major components of AutoML's ForecastTCN.":::

### Details of the TCN architecture

:::image type="content" source="media/concept-automl-forecasting-deep-learning/tcn-detail.png" alt-text="Diagram showing major components of AutoML's ForecastTCN.":::

The architectural parameters of a ForecastTCN are as follows:
|Parameter|Description|
|--|--|
|$n_{b}$|Number of blocks in the network; also called the _depth_|
|$n_{c}$|Number of cells in each block|
|$n_{\text{ch}}$|Number of channels in each hidden layer|

The maximum number of past observations that a TCN requires to make a forecast is called the _receptive field_. The receptive field is a function of the TCN architecture and is given by,

$\begin{align} \notag t_{\text{rf}} = 4n_{b}\left(2^{n_{c}} - 1\right) + 1.\end{align}$

We can give a more precise definition of the ForecastTCN architecture in terms of formulas. Let $X$ be an input array where each row contains feature values from the input data. We can divide $X$ into numeric and categorical features, $X = \begin{bmatrix} X_{\text{num}} \\ X_{\text{cat}} \end{bmatrix}$. Then, the ForecastTCN is described by,
 
$\begin{align} \notag \begin{split} H_{0} & = \text{pre-mix}\left(\begin{bmatrix} X_{\text{num}} \\ W_{e} X_{\text{cat}} \end{bmatrix}\right), \\ \\
 H_{k} & = H_{k-1} + \text{cell}_{k}(H_{k-1}), \hspace{2mm} k \in [1, \ldots, n_{l}], \\ \\
f_{q} & = \text{forecast\_head}_{q}\left(\begin{bmatrix} H_{1} \\ \vdots \\ H_{n_{l}}\end{bmatrix}\right), \hspace{2mm} q \in [0.1, 0.25, 0.5, 0.75, 0.9] \end{split} \end{align}$

where $W_{e}$ is an embedding matrix for the categorical features, $n_{l} = n_{b}n_{c}$ is the total number of convolutional layers, the $H_{k}$ denote hidden layer outputs, and the $f_{q}$ are forecast outputs for given quantiles of the prediction distribution.

|Variable|Shape|
|--|--|
|$X$|$n_{\text{features}} \times t_{\text{rf}}$
|$H_{i}$|$n_{\text{ch}} \times t_{\text{rf}}$|
|$f_{q}$|$h$|



