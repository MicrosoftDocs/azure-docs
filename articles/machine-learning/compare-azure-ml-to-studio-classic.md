---
title: What is Azure Machine Learning
description: Overview of Azure Machine Learning - An integrated, end-to-end data science solution for professional data scientists to develop, experiment, and deploy advanced analytics applications at cloud scale.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 10/21/2019
ms.custom: seodec18
---

# How Azure Machine Learning compares to ML Studio

[ML Studio (classic)](/studio/what-is-ml-studio.md) is a collaborative, drag-and-drop visual workspace where you can build, test, and deploy machine learning solutions without needing to write code. It uses prebuilt and preconfigured machine learning algorithms and data-handling modules as well as a proprietary compute platform.

Meanwhile, [**Azure Machine Learning**](/service/overview-what-is-azure-ml.md) provides both a web interface called the designer (preview) and several SDKs and CLI to quickly prep data, train and deploy machine learning models. The designer provides a similar drag-and-drop experience to Studio (classic). However, unlike the proprietary compute platform of Studio (classic), the designer uses your own compute resources, is scalable, and is fully integrated into Azure Machine Learning.

Here is a quick comparison.

|| Studio (classic) | Azure Machine Learning designer|
|---| --- | --- |
|| Generally available (GA) | In preview|
|Drag-and-drop interface| Yes | Yes|
|Experiment| Scale (10GB training data limit) | Scale with compute target|
|Modules for interface| Many | Many popular modules|
|Training compute targets| Proprietary compute target, CPU only|AML Compute(GPU/CPU)<br/> Notebook VMs |
|Inferencing compute targets| Proprietary web service format, not customizable | Azure Kubernetes Service(real-time inferencing) <br/>AML Compute(batch inferencing) |
|ML Pipeline| Not supported | Pipeline authoring <br/> Published pipeline <br/> Pipeline endpoint <br/> [Learn more about ML pipeline](/service/concept-ml-pipelines.md)|
|ML Ops| Basic model management and deployment | Configurable deployment, model and pipeline versioning|
|Model| Proprietary format. Can not be used outside of Studio | Standard format, various depends on the training job|
|Automated model training and hyperparameter tuning | No | Not yet in visual interface. <br/> (Supported in the Python SDK and workspace landing page.) |

Try out the designer (preview) with [Tutorial: Predict automobile price with the visual interface](/service/ui-tutorial-automobile-price-train-score.md).

## Get started with Azure Machine Learning

The following resources can help you get started with Azure Machine Learning

- Read the Azure Machine Learning service overview.

- [Create and deploy your first designer pipeline](/service/tutorial-first-experiment-automated-ml.md) 

## Next steps

In addition to the drag-n-drop capabilities in the designer, Azure Machine Learning has other tools available:  
  + [Use Python notebooks to train & deploy ML models](/service/tutorial-1st-experiment-sdk-setup.md)
  + [Use R Markdown to train & deploy ML models](/service/tutorial-1st-r-experiment.md) 
  + [Use automated machine learning to train & deploy ML models](/service/ui-tutorial-automobile-price-train-score.md) 
  + [Use the machine learning CLI to train and deploy a model](/service/tutorial-train-deploy-model-cli.md)

