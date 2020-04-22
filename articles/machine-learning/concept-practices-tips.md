---
title: Iterating and Evolving Machine Learning Pipelines
titleSuffix: Azure Machine Learning
description: Patterns, practices, and tips for fast development
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: laobri
author: lobrien
ms.date: 03/29/2020
# As a data scientist, I want to rapidly evolve my code in collaboration with my colleagues
---

# Iterating and Evolving Machine Learning Pipelines

Azure Machine Learning pipelines provide an efficient way to modularize your code, reuse results, and optimize your compute resources. Here are some practical tips and practices for working with pipelines.

## Getting started

{>> How do you begin? "Difficult to get started on a new pipeline without referring to an existing notebook"<<}
There are several options for getting started if your are new to pipelines:

* If you learn best by reading and recreating the construction process, the article [Create and run machine learning pipelines with Azure Machine Learning SDK](how-to-create-your-first-pipeline.md) is a good fit 
* If you like learning interactively in a Jupyter notebook, the pipeline developed in the [Azure Machine Learning Pipelines: Getting Started](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/aml-pipelines-getting-started.ipynb) notebook may be right for you
* If you prefer a code-first situation, cloning the [Azure Machine Learning Pipelines Demo](https://github.com/microsoft/aml-pipelines-demo) repo provides a good starting point

After you've familiarized yourself with the general concepts and mechanics of creating a pipeline, you might decide to start from a blank slate. Generally, if you are starting from scratch with your ML solution, you should first develop at least a rough idea of your data preparation needs and know what kind of learning architecture you'll be applying to your problem. Individual pipeline steps are substantially walled-off from each other, so it's generally best to have an understanding of the scope of your data and functions.

Of course, the most straightforward way to begin creating a machine learning pipeline is to start with a monolithic, single-step pipeline. Getting a single `PythonScriptStep` pipeline up and running will get you familiar with the pipeline-iteration process without introducing other complexities. Even a single-step pipeline will allow you to publish it independently, even as you continue to iterate it and build a more complex workflow.

You can create a monolithic `PythonScriptStep` pipeline by using [tk notebook tk](tk does it exist? tk).

On the other hand, having a datastore of raw data that needs to be prepared prior to training is _so_ common that you might start with this basic pipeline: 

[!tk image datastore->prep->train](tk)

You can create a minimal pipeline using this architecture using [tk notebook tk](tk does it exist? tk). 

{>> How do you modularize? "How do you modularize your code for ease-of-use legibility instead of a 600-line pipeline.py scripts?<<}

Pipelines give you a great opportunity to modularize your ML code. However, it has to be kept in mind that moving between pipeline steps is vastly more expensive than a function call. The question you must ask is not so much "Are these functions and data conceptually different than those in this other section?" but "Do I want these functions and data to evolve separately?" or "Is this an expensive computation whose output I can reuse?"

As discussed previously, separating data preparation from training is often one such opportunity. Sometimes data preparation is complex and time-consuming enough that it can be appropriate to break into separate pipeline steps. Other opportunities include post-training testing and analysis. 

## Iterative development

{>> How can you quickly iterate on a single step without having to spin up a new compute? <<}

tk I don't know the answer to this. tk 

{>>How do you collaborate while using pipelines?<<}

Separate pipelines are natural lines along which to split effort. Multiple developers or even multiple teams can work on different steps, so long as the data and arguments flowing between steps are agreed upon. 

## Use pipelines to test techniques in isolation

{>> How do you do A/B testing? <<}

Real-world ML solutions generally involve considerable customization of every step. The raw data often needs to be filtered, transformed, and augmented. The training processes might have several potential architectures and, for deep learning, many possible variations in terms of layer sizes and activation functions. Even with a consistent architecture, hyperparameter search can produce significant wins.

In addition to tools like [AutoML](tk) and [automated hyperparameter search](tk), pipelines can be an important tool for A/B testing solutions. If you have several variants of your pipeline steps, it is easy to generate separate runs trying their variations: 

```python
data_preparation_variants = [data1, data2, data3]
data_augmentation_variants = [aug1, aug2]
architecture_variants = [train1, train2, train3]

# Cartesian product
all_variants = np.array(np.meshgrid(data_preparation_variants,data_augmentation_variants,architecture_variants)).T.reshape(-1,3)

pipelines = [Pipeline(workspace=ws, steps=variant.tolist(), description=str(variant)) for variant in all_variants]

```

