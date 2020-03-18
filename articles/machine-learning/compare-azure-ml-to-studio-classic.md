---
title: Azure Machine Learning vs. Machine Learning Studio (classic)  
description: What's the difference between Azure Machine Learning and Machine Learning Studio (classic)?
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 03/24/2020
---
 
# Azure Machine Learning vs Machine Learning Studio (classic)

Azure Machine Learning provides both SDKs **and** the "drag-and-drop" designer to build machine learning models. Studio (classic) only offers a standalone drag-and-drop experience.

We recommend that new users start with Azure Machine Learning for a wide range of cutting-edge machine learning tools. For more information on what Azure Machine Learning has to offer, see [What is Azure Machine Learning?](overview-what-is-azure-ml.md)

## Quick comparison

| | Azure Machine Learning | Machine Learning Studio (classic) | 
|---| --- | --- |
| Drag and drop interface | Yes - [Azure Machine Learning designer (preview)](concept-designer.md) | Yes | 
| Experiment | Scale with compute target | Scalable (10-GB training data limit) |
| Training compute targets | Supports Azure Machine Learning compute (GPU or CPU) and Notebook VMs.<br/>([Other computes supported in SDK](concept-compute-target.md#train))| Proprietary compute target, CPU support only|
| Inferencing compute targets | Azure Kubernetes Service and AML Compute <br/>([Other computes supported in SDK](how-to-deploy-and-where.md)) | Proprietary web service format, not customizable |
| ML Pipeline | [Supported](concept-ml-pipelines.md) | Not supported |
| MLOps | [Configurable deployment](concept-model-management-and-deployment.md) - model, pipeline, and dataset versioning and tracking | Basic model management and deployment |
| Model format | Standard format depending on training job type | Proprietary format, Studio (classic) only |
| Automated model training and hyperparameter tuning | [Supported in the SDK and visual workspace](concept-automated-ml.md) | No | 


## Migrate from Machine Learning Studio (classic)

Currently, there's no way to migrate Studio (classic) experiments to Azure Machine Learning designer (preview). However, we'll provide a migration path after the designer becomes generally available. Until then, we encourage users to try the designer, which provides a familiar drag-and-drop experience with improved workflow **plus** scalability, version control, and enterprise security.

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

