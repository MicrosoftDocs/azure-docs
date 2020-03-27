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

Azure Machine Learning pipelines provide an efficient way to modularize your code, reuse results, and optimize your compute resources. Here are some practical tips and practices for moving your machine learning code into pipelines. tk more needed here tk

## H2
{>> How do you begin? "Difficult to get started on a new pipeline without referring to an existing notebook"<<}
Generally, pipeline projects do not start from a blank slate. If you are starting from scratch with your ML solution, you should develop at least a rough idea of your data preparation needs and know what kind of learning architecture you'll be applying to your problem. Individual pipeline steps are substantially walled-off from each other, so it's generally best to have an understanding of the scope of your data and functions.

Of course, the most straightforward pay to begin creating a machine learning pipeline is to start with a monolithic, single-step pipeline. Getting a single `PythonScriptStep` pipeline up and running will get you familiar with the pipeline-iteration process without introducing other complexities. One important advantage of a monolithic initial project is that you can troubleshoot the environment and compute configuration in a single place. Locking down the Python libraries and versions in a single place can save you headaches later. See tk environment article tk. 

You can create a monolithic `PythonScriptStep` pipeline by using [tk notebook tk](tk does it exist? tk).

On the other hand, having a datastore of raw data that needs to be prepared prior to training is _so_ common that you might start with this basic pipeline: 

[!tk image datastore->prep->train](tk)

You can create a minimal pipeline using this architecture using [tk notebook tk](tk does it exist? tk). 

{>> How do you modularize? "How do you modularize your code for ease-of-use legibility instead of a 600-line pipeline.py scripts?<<}

Pipelines give you a great opportunity to modularize your ML code. However, it has to be kept in mind that moving between pipeline steps is vastly more expensive than a function call. The question you must ask is not so much "Are these functions and data conceptually different than those in this other section?" but "Do I want these functions and data to evolve separately?" or "Is this an expensive computation whose output I can reuse?"

As discussed previously, separating data preparation from training is often one such opportunity. Sometimes data preparation is complex and time-consuming enough that it can be appropriate to break into separate pipeline steps. Other opportunities include post-training testing and analysis. 

## H2

{>> How can you quickly iterate on a single step without having to spin up a new compute? <<}

tk I don't know the answer to this. tk 

{>>How do you collaborate while using pipelines?<<}

Separate pipelines are natural lines along which to split effort. 

## H2

{>> How do you do A/B testing? <<}