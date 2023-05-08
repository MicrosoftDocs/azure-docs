---
title: Deep learning with AutoML forecasting 
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's AutoML uses deep learning to forecast time series values
services: machine-learning
author: ericwrightatwork
ms.author: erwright
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: conceptual
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv2, event-tier1-build-2022
ms.date: 02/24/2023
show_latex: true
---

# Deep learning with AutoML forecasting

This article focuses on the deep learning methods for time series forecasting in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

Deep learning has made a major impact in fields ranging from [language modeling](../cognitive-services/openai/concepts/models.md) to [protein folding](https://www.deepmind.com/research/highlighted-research/alphafold), among many others. Time series forecasting has likewise benefitted from recent advances in deep learning technology. For example, deep neural network (DNN) models feature prominently in the top performing models from the [fourth](https://www.uber.com/blog/m4-forecasting-competition/) and [fifth](https://www.sciencedirect.com/science/article/pii/S0169207021001874) iterations of the high-profile Makridakis forecasting competition.

In this article, we'll describe the structure and operation of the TCNForecaster model in AutoML to help you best apply the model to your scenario. 

## Introduction to TCNForecaster

TCNForecaster is a [temporal convolutional network](https://arxiv.org/abs/1803.01271), or TCN, which has a DNN architecture specifically designed for time series data. The model uses historical data for a target quantity, along with related features, to make probabilistic forecasts of the target up to a specified forecast horizon. The following image shows the major components of the TCNForecaster architecture:

:::image type="content" source="media/how-to-auto-train-forecast/tcn-basic.png" alt-text="Diagram showing major components of AutoML's TCNForecaster.":::

TCNForecaster has the following main components: 

* A **pre-mix** layer that mixes the input time series and feature data into an array of signal **channels** that the convolutional stack will process.
* A stack of **dilated convolution** layers that processes the channel array sequentially; each layer in the stack processes the output of the previous layer to produce a new channel array. Each channel in this output contains a mixture of convolution-filtered signals from the input channels. 
* A collection of **forecast head** units that coalesce the output signals from the convolution layers and generate forecasts of the target quantity from this latent representation. Each head unit produces forecasts up to the horizon for a quantile of the prediction distribution.

### Dilated causal convolution

The central operation of a TCN is a dilated, causal [convolution](https://en.wikipedia.org/wiki/Cross-correlation) along the time dimension of an input signal. Intuitively, convolution mixes together values from nearby time points in the input. The proportions in the mixture are the **kernel**, or the weights, of the convolution while the separation between points in the mixture is the **dilation**. The output signal is generated from the input by sliding the kernel in time along the input and accumulating the mixture at each position. A **causal** convolution is one in which the kernel only mixes input values in the past relative to each output point, preventing the output from "looking" into the future.

Stacking dilated convolutions gives the TCN the ability to model correlations over long durations in input signals with relatively few kernel weights. For example, the following image shows three stacked layers with a two-weight kernel in each layer and exponentially increasing dilation factors:

:::image type="content" source="media/concept-automl-forecasting-deep-learning/tcn-dilated-conv.png" alt-text="Diagram showing stacked, dilated convolution layers.":::

The dashed lines show paths through the network that end on the output at a time $t$. These paths cover the last eight points in the input, illustrating that each output point is a function of the eight most relatively recent points in the input. The length of history, or "look back," that a convolutional network uses to make predictions is called the **receptive field** and it is determined completely by the TCN architecture.

### TCNForecaster architecture

The core of the TCNForecaster architecture is the stack of convolutional layers between the pre-mix and the forecast heads. The stack is logically divided into repeating units called **blocks** that are, in turn, composed of **residual cells**. A residual cell applies causal convolutions at a set dilation along with normalization and nonlinear activation. Importantly, each residual cell adds its output to its input using a so-called residual connection. These connections [have been shown to benefit DNN training](https://arxiv.org/abs/1512.03385), perhaps because they facilitate more efficient information flow through the network. The following image shows the architecture of the convolutional layers for an example network with two blocks and three residual cells in each block:

:::image type="content" source="media/concept-automl-forecasting-deep-learning/tcn-detail.png" alt-text="Diagram showing block and cell structure for TCNForecaster convolutional layers.":::

The number of blocks and cells, along with the number of signal channels in each layer, control the size of the network.  The architectural parameters of TCNForecaster are summarized in the following table:

|Parameter|Description|
|--|--|
|$n_{b}$|Number of blocks in the network; also called the _depth_|
|$n_{c}$|Number of cells in each block|
|$n_{\text{ch}}$|Number of channels in the hidden layers|

The **receptive field** depends on the depth parameters and is given by the formula,

$t_{\text{rf}} = 4n_{b}\left(2^{n_{c}} - 1\right) + 1.$

We can give a more precise definition of the TCNForecaster architecture in terms of formulas. Let $X$ be an input array where each row contains feature values from the input data. We can divide $X$ into numeric and categorical feature arrays, $X_{\text{num}}$ and  $X_{\text{cat}}$. Then, the TCNForecaster is given by the formulas,
 
:::image type="content" source="media/concept-automl-forecasting-deep-learning/tcn-equations.png" alt-text="Equations describing TCNForecaster operations.":::

where $W_{e}$ is an [embedding](https://huggingface.co/blog/getting-started-with-embeddings) matrix for the categorical features, $n_{l} = n_{b}n_{c}$ is the total number of residual cells, the $H_{k}$ denote hidden layer outputs, and the $f_{q}$ are forecast outputs for given quantiles of the prediction distribution. To aid  understanding, the dimensions of these variables are in the following table:

|Variable|Description|Dimensions|
|--|--|--|
|$X$|Input array|$n_{\text{input}} \times t_{\text{rf}}$
|$H_{i}$|Hidden layer output for $i=0,1,\ldots,n_{l}$|$n_{\text{ch}} \times t_{\text{rf}}$|
|$f_{q}$|Forecast output for quantile $q$|$h$|

In the table, $n_{\text{input}} = n_{\text{features}} + 1$, the number of predictor/feature variables plus the target quantity. The forecast heads generate all forecasts up to the maximum horizon, $h$, in a single pass, so TCNForecaster is a [direct forecaster](./concept-automl-forecasting-methods.md).

## TCNForecaster in AutoML

TCNForecaster is an optional model in AutoML. To learn how to use it, see [enable deep learning](./how-to-auto-train-forecast.md#enable-deep-learning).

In this section, we'll describe how AutoML builds TCNForecaster models with your data, including explanations of data preprocessing, training, and model search. 

### Data preprocessing steps

AutoML executes several preprocessing steps on your data to prepare for model training. The following table describes these steps in the order they're performed:

|Step|Description|
|--|--|
Fill missing data|[Impute missing values and observation gaps](./concept-automl-forecasting-methods.md#missing-data-handling) and optionally [pad or drop short time series](./how-to-auto-train-forecast.md#short-series-handling)|
|Create calendar features|Augment the input data with [features derived from the calendar](./concept-automl-forecasting-calendar-features.md) like day of the week and, optionally, holidays for a specific country/region.|
|Encode categorical data|[Label encode](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html) strings and other categorical types; this includes all [time series ID columns](./how-to-auto-train-forecast.md#configuration-settings).|
|Target transform|Optionally apply the natural logarithm function to the target depending on the results of certain statistical tests.|
|Normalization|[Z-score normalize](https://en.wikipedia.org/wiki/Standard_score) all numeric data; normalization is performed per feature and per time series group, as defined by the [time series ID columns](./how-to-auto-train-forecast.md#configuration-settings).

These steps are included in AutoML's transform pipelines, so they are automatically applied when needed at inference time. In some cases, the inverse operation to a step is included in the inference pipeline. For example, if AutoML applied a $\log$ transform to the target during training, the raw forecasts are exponentiated in the inference pipeline.  

### Training

The TCNForecaster follows DNN training best practices common to other applications in images and language. AutoML divides preprocessed training data into **examples** that are shuffled and combined into **batches**. The network processes the batches sequentially, using back propagation and stochastic gradient descent to optimize the network weights with respect to a **loss function**. Training can require many passes through the full training data; each pass is called an **epoch**.

The following table lists and describes input settings and parameters for TCNForecaster training:

|Training input|Description|Value|
|--|--|--|
|Validation data|A portion of data that is held out from training to guide the network optimization and mitigate over fitting.| [Provided by the user](./how-to-auto-train-forecast.md#training-and-validation-data) or automatically created from training data if not provided.|
|Primary metric|Metric computed from median-value forecasts on the validation data at the end of each training epoch; used for early stopping and model selection.|[Chosen by the user](./how-to-auto-train-forecast.md#configure-experiment); normalized root mean squared error or normalized mean absolute error.|
|Training epochs|Maximum number of epochs to run for network weight optimization.|100; automated early stopping logic may terminate training at a smaller number of epochs. 
|Early stopping patience|Number of epochs to wait for primary metric improvement before training is stopped.|20|
|Loss function|The objective function for network weight optimization.|[Quantile loss](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_pinball_loss.html) averaged over 10th, 25th, 50th, 75th, and 90th percentile forecasts.|
|Batch size|Number of examples in a batch. Each example has dimensions $n_{\text{input}} \times t_{\text{rf}}$ for input and $h$ for output.|Determined automatically from the total number of examples in the training data; maximum value of 1024.|
|Embedding dimensions|Dimensions of the embedding spaces for categorical features.|Automatically set to the fourth root of the number of distinct values in each feature, rounded up to the closest integer. Thresholds are applied at a minimum value of 3 and maximum value of 100.
|Network architecture*|Parameters that control the size and shape of the network: depth, number of cells, and number of channels.|Determined by [model search](#model-search).|
|Network weights|Parameters controlling signal mixtures, categorical embeddings, convolution kernel weights, and mappings to forecast values.|Randomly initialized, then optimized with respect to the loss function.
|Learning rate*|Controls how much the network weights can be adjusted in each iteration of gradient descent; [dynamically reduced](https://pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ReduceLROnPlateau.html) near convergence.|Determined by model search.|
|Dropout ratio*|Controls the degree of [dropout regularization](https://en.wikipedia.org/wiki/Dilution_(neural_networks)) applied to the network weights.|Determined by model search.|

Inputs marked with an asterisk (*) are determined by a hyper-parameter search that is described in the next section.    

### Model search

AutoML uses model search methods to find values for the following hyper-parameters:

* Network depth, or the number of [convolutional blocks](#tcnforecaster-architecture),
* Number of cells per block,
* Number of channels in each hidden layer,
* Dropout ratio for network regularization,
* Learning rate.

Optimal values for these parameters can vary significantly depending on the problem scenario and training data, so AutoML trains several different models within the space of hyper-parameter values and picks the best one according to the primary metric score on the validation data.

The model search has two phases:

1. AutoML performs a search over 12 "landmark" models. The landmark models are static and chosen to reasonably span the hyper-parameter space.
2. AutoML continues searching through the hyper-parameter space using a random search.
  
The search terminates when stopping criteria are met. The stopping criteria depend on the [forecast training job configuration](./how-to-auto-train-forecast.md#configure-experiment), but some examples include time limits, limits on number of search trials to perform, and early stopping logic when the validation metric is not improving.
 
## Next steps

* Learn how to [set up AutoML to train a time-series forecasting model](./how-to-auto-train-forecast.md).
* Learn about [forecasting methodology in AutoML](./concept-automl-forecasting-methods.md).
* Browse [frequently asked questions about forecasting in AutoML](./how-to-automl-forecasting-faq.md).

