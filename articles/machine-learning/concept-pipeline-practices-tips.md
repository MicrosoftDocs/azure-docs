---
title: Iterating and evolving machine learning pipelines
titleSuffix: Azure Machine Learning
description: Patterns, practices, and tips for fast development
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: laobri
author: lobrien
ms.date: 05/01/2020
# As a data scientist, I want to rapidly evolve my code in collaboration with my colleagues
---

# Iterating and evolving machine learning pipelines

Azure Machine Learning pipelines provide an efficient way to modularize your code, reuse results, and optimize your compute resources. Here are some practical tips and practices for working with pipelines.

## How do you get started with pipelines?

There are several options for getting started if your are new to pipelines:

* If you learn best by reading and recreating the construction process, the article [Create and run machine learning pipelines with Azure Machine Learning SDK](how-to-create-your-first-pipeline.md) is a good fit 
* If you like learning interactively in a Jupyter notebook, the pipeline developed in the [Azure Machine Learning Pipelines: Getting Started](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/aml-pipelines-getting-started.ipynb) notebook may be right for you
* If you prefer a code-first situation, cloning the [Azure Machine Learning Pipelines Demo](https://github.com/microsoft/aml-pipelines-demo) repo provides a good starting point

## How do you modularize pipeline code? 

Modules and the `ModuleStep` class give you a great opportunity to modularize your ML code. However, it has to be kept in mind that moving between pipeline steps is vastly more expensive than a function call. The question you must ask isn't so much "Are these functions and data conceptually different than the ones in this other section?" but "Do I want these functions and data to evolve separately?" or "Is this computation expensive and can I reuse its output?" For more information, see thisn'tebook [How to create Module, ModuleVersion, and use them in a pipeline with ModuleStep](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/aml-pipelines-how-to-use-modulestep.ipynb).

As discussed previously, separating data preparation from training is often one such opportunity. Sometimes data preparation is complex and time-consuming enough that you might break the process into separate pipeline steps. Other opportunities include post-training testing and analysis. 

## How do you speed pipeline iteration? 

Common techniques for quickly iterating pipelines include: 

- Cloning the pipeline (making a copy) and rerunning the pipeline quickly
- Keeping the compute instance running, so as to avoid startup time
- Configuring data and steps to allow reuse will allow the pipeline to skip recalculating unchanging data

When you want to quickly iterate, you can clone your pipeline, making a pipeline, and rerun the pipeline. Another helpful technique is If you keep your Compute warm, you won't incur the cost of spinning up the new compute. If you set up the Step to allow reuse of the result of a run, then the repeated execution will reuse results where possible (when there are no change in the Steps).

## How do you collaborate using ML pipelines? 

Separate pipelines are natural lines along which to split effort. Multiple developers or even multiple teams can work on different steps, so long as the data and arguments flowing between steps are agreed upon. 

During active development, you can retrieve `PipelineRun` and `StepRun` run results from the workspace, use these objects to download final and intermediate output, and use those artifacts for your own modularized work.

## Use pipelines to test techniques in isolation

Real-world ML solutions generally involve considerable customization of every step. Raw data often needs to be prepared in some way: filtered, transformed, and augmented. The training processes might have several potential architectures and, for deep learning, many possible variations for layer sizes and activation functions. Even with a consistent architecture, hyperparameter search can produce significant wins.

In addition to tools like [AutoML](concept-automated-ml.md) and [automated hyperparameter search](how-to-tune-hyperparameters.md), pipelines can be an important tool for A/B testing solutions. If you have several variants of your pipeline steps, it's easy to generate separate runs trying their variations: 

```python
data_preparation_variants = [data1, data2, data3]
data_augmentation_variants = [aug1, aug2]
architecture_variants = [train1, train2, train3]

# Cartesian product
all_variants = np.array(np.meshgrid(data_preparation_variants,data_augmentation_variants,architecture_variants)).T.reshape(-1,3)

pipelines = [Pipeline(workspace=ws, steps=variant.tolist(), description=str(variant)) for variant in all_variants]

```

