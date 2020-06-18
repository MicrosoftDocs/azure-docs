---
title: Azure Machine Learning vs. Machine Learning Studio (classic)  
description: What's the difference between Azure Machine Learning and Machine Learning Studio (classic)?
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 03/25/2020
---
 
# Azure Machine Learning vs Machine Learning Studio (classic)

In this article, you learn the difference between Azure Machine Learning and Machine Learning Studio (classic). 

Azure Machine Learning provides Python and R SDKs **and** the "drag-and-drop" designer to build and deploy machine learning models. Studio (classic) only offers a standalone drag-and-drop experience.

We recommend that new users choose Azure Machine Learning for the widest range of cutting-edge machine learning tools.

## Quick comparison

The following table summarizes some of the key differences between Azure Machine Learning and Studio (classic):

| | Machine Learning Studio (classic) | Azure Machine Learning |
|---| --- | --- |
| Drag and drop interface | Supported | Supported - [Azure Machine Learning designer (preview)](concept-designer.md) | 
| Experiment | Scalable (10-GB training data limit) | Scale with compute target |
| Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](concept-compute-target.md#train). Includes GPU and CPU support | 
| Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](concept-compute-target.md#deploy). Includes GPU and CPU support |
| ML Pipeline | Not supported | Build flexible, modular [pipelines](concept-ml-pipelines.md) to automate workflows |
| MLOps | Basic model management and deployment | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, [and more](concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported in the SDK and visual workspace](concept-automated-ml.md) | 
| Data drift detection | Not supported | [Supported in SDK and visual workspace](how-to-monitor-datasets.md) |


## Migrate from Machine Learning Studio (classic)

Currently, there's no way to migrate Studio (classic) assets to Azure Machine Learning designer (preview). Current Studio (classic) users can continue to use their machine learning assets. However, we encourage all users to considering using the designer, which provides a familiar drag-and-drop experience with improved workflow **plus** scalability, version control, and enterprise security.

## Get started with Azure Machine Learning

The following resources can help you get started with Azure Machine Learning. 

- Read the [Azure Machine Learning overview](overview-what-is-azure-ml.md).

- Create your [first experiment with the Python SDK](tutorial-1st-experiment-sdk-setup.md).

- [Create your first designer pipeline](tutorial-designer-automobile-price-train-score.md) to predict auto prices.

![Azure Machine Learning designer example](media/concept-designer/designer-drag-and-drop.gif)

## Next steps

In addition to the drag-and-drop capabilities in the designer, Azure Machine Learning has other tools available:  
  + [Use Python notebooks to train & deploy ML models](tutorial-1st-experiment-sdk-setup.md)
  + [Use R Markdown to train & deploy ML models](tutorial-1st-r-experiment.md) 
  + [Use automated machine learning to train & deploy ML models](tutorial-first-experiment-automated-ml.md)  
  + [Use the machine learning CLI to train and deploy a model](tutorial-train-deploy-model-cli.md)

