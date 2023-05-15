---
title: Evaluation of forecasting models
titleSuffix: Azure Machine Learning
description: Learn about different ways to evaluate forecasting models
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

# Evaluation of forecasting models

This article introduces concepts related to model evaluation in forecasting tasks. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

Once you've used AutoML to train and select a best model, the next step is to evaluate its accuracy on a test set held out from the training data. To see how to setup and run forecasting model evaluation in automated machine learning, see our guide on [inference and evaluation components](how-to-auto-train-forecast.md#orchestrating-training-inference-and-evaluation-with-components-and-pipelines). 
  
## Rolling evaluation

 A best practice procedure for evaluating a forecasting model is to roll the trained forecaster forward in time over the test set, averaging error metrics over several prediction windows. This procedure is sometimes called a **backtest**, depending on the context. Ideally, the test set for the evaluation is long relative to the model's forecast horizon. Estimates of forecasting error may otherwise be statistically noisy and, therefore, less reliable.

The following diagram shows a simple example with three forecasting windows:

:::image type="content" source="media/concept-automl-forecasting-evaluation/rolling-eval-diagram.png" alt-text="Diagram demonstrating a rolling forecast on a test set.":::

The diagram illustrates three rolling evaluation parameters:

* The **context length**, or the amount of history that the model requires to make a forecast,
* The **forecast horizon**, which is how far ahead in time the forecaster is trained to predict,
* The **step size**, which is how far ahead in time the rolling window advances on each iteration on the test set.

Importantly, the context advances along with the forecasting window. This means that actual values from the test set are used to make forecasts when they fall within the current context window. The latest date of actual values used for a given forecast window is called the **origin time** of the window. The following table shows an example output from the three-window rolling forecast with a horizon of three days and a step size of one day:

:::image type="content" source="media/concept-automl-forecasting-evaluation/rolling-eval-table.png" alt-text="Example output table from a rolling forecast.":::

Once we have a table like this, we can visualize the forecasts vs. the actuals and compute desired evaluation metrics.

## Recursive forecasting

Another way to generate forecasts is to recursively apply the trained model over a test set. This means that predictions from the model are _fed back as input_ in order to generate predictions for subsequent forecasting windows. The following diagram shows a simple example:

:::image type="content" source="media/concept-automl-forecasting-evaluation/recursive-forecast-diagram.png" alt-text="Diagram demonstrating a recursive forecast on a test set.":::

The recursively generated forecasts are usually different from the rolling forecasts. Particularly, the recursive procedure tends to compound forecasting errors, so the predictions become less accurate as the window advances into the future. However, a recursive forecast may be necessary in production if you need to make predictions farther ahead in time than your model's forecast horizon.

## Next steps

* Learn more about [how to set up AutoML to train a time-series forecasting model](./how-to-auto-train-forecast.md).
* Learn about [how AutoML uses machine learning to build forecasting models](./concept-automl-forecasting-methods.md).
* Read answers to [frequently asked questions](./how-to-automl-forecasting-faq.md) about forecasting in AutoML.