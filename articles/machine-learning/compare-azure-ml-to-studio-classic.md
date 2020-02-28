---
title: Azure Machine Learning vs. Machine Learning Studio (classic)  
description: How Azure Machine Learning is different from Machine Learning Studio (classic)
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 10/29/2019
---

 
# How Azure Machine Learning differs from Machine Learning Studio (classic)

This article compares the features, capabilities, and interface of Azure Machine Learning to Machine Learning Studio (classic). 

## About Machine Learning Studio (classic)
[Machine Learning Studio (classic)](studio/what-is-ml-studio.md) is a collaborative, drag-and-drop visual workspace where you can build, test, and deploy machine learning solutions without needing to write code. It uses prebuilt and preconfigured machine learning algorithms and data-handling modules as well as a proprietary compute platform.

## About Azure Machine Learning

Meanwhile, [Azure Machine Learning](overview-what-is-azure-ml.md) provides both a web interface called the designer (preview) **and** several SDKs and CLI to quickly prep data, train and deploy machine learning models. With Azure Machine Learning you get scale, multiple framework support, advanced ML capabilities like automated machine learning and pipeline support.

Azure Machine Learning designer provides a similar drag-and-drop experience to Studio (classic). However, unlike the proprietary compute platform of Studio (classic), the designer uses your own compute resources, is scalable, and is fully integrated into Azure Machine Learning.  

> [!TIP]
> Customers currently using or evaluating Machine Learning Studio (classic) are encouraged to try [Azure Machine Learning designer](https://docs.microsoft.com/azure/machine-learning/concept-designer) (preview), which provides drag and drop ML modules __plus__ scalability, version control, and enterprise security.

## Comparison: Azure Machine Learning vs. Machine Learning Studio (classic)

Here is a quick comparison.

||  Azure Machine Learning designer|Studio (classic) |
|---| --- | --- |
||The designer is in preview, Azure Machine Learning is GA|Generally available (GA) | 
|Drag-and-drop interface| Yes | Yes|
|Experiment| Scale with compute target|Scale (10GB training data limit) | 
|Modules for interface| [Many popular modules](algorithm-module-reference/module-reference.md) | Many |
|Training compute targets| AML Compute(GPU/CPU)|Proprietary compute target, CPU only|
|Inferencing compute targets| Azure Kubernetes Service for real-time inference <br/>AML Compute for batch inference|Proprietary web service format, not customizable | 
|ML Pipeline| Pipeline authoring <br/> Published pipeline <br/> Pipeline endpoint <br/> [Learn more about ML pipeline](concept-ml-pipelines.md)|Not supported | 
|ML Ops| Configurable deployment, model and pipeline versioning|Basic model management and deployment | 
|Model| Standard format, various depends on the training job|Proprietary, non portable format.| 
|Automated model training|Not yet in the designer, but possible through the interface and SDKs.| No | 

## Get started with Azure Machine Learning

The following resources can help you get started with Azure Machine Learning

- Read the [Azure Machine Learning overview](tutorial-first-experiment-automated-ml.md) 

- [Create your first designer pipeline](tutorial-designer-automobile-price-train-score.md) to predict auto prices.

![Azure Machine Learning designer example](media/concept-designer/designer-drag-and-drop.gif)

## Next steps

In addition to the drag-and-drop capabilities in the designer, Azure Machine Learning has other tools available:  
  + [Use Python notebooks to train & deploy ML models](tutorial-1st-experiment-sdk-setup.md)
  + [Use R Markdown to train & deploy ML models](tutorial-1st-r-experiment.md) 
  + [Use automated machine learning to train & deploy ML models](tutorial-designer-automobile-price-train-score.md) 
  + [Use the machine learning CLI to train and deploy a model](tutorial-train-deploy-model-cli.md)

