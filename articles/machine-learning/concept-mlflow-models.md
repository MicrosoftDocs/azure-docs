---
title: From artifacts to models in MLflow
titleSuffix: Azure Machine Learning
description: Learn about how MLflow uses the concept of models instead of artifacts to represents your trained models and enable a streamlined path to deployment.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.service: machine-learning
ms.subservice: mlops
ms.date: 07/8/2022
ms.topic: conceptual
ms.custom: devx-track-python, cliv2, sdkv2
---

# From artifacts to models in MLflow

The following article explains the differences between an artifact and a model in MLflow and how to transition from one to the other. It also explains how to start logging your trained models (or artifacts) as MLflow models depending on the characteristics of the assets you are dealing with and how they are supported in MLflow.

## What's the difference between an artifact and a model?

### Artifacts

Any file generated (and captured) from an experiment's run or job is an artifact. It may represent a model serialized as a Pickle file, the weights of a PyTorch or TensorFlow model, or even a text file containing the coefficients of a linear regression. Other artifacts can have nothing to do with the model itself, but they can contain configuration to run the model, pre-processing information, sample data, etc. As you can see, an artifact can come in any format. 

You can log artifacts in MLflow in the same way you log a file with Azure ML SDK v1:

### Models

A model in MLflow is also an artifact, as it matches the definition we introduced above. However, we make stronger assumptions about this type of artifacts. Such assumptions allow us to create a clear contract between the saved artifacts and what they mean. When you log your models as artifacts (simple files), you need to know what the model builder meant for each of them in order to know how to load it. When you log your models as a Model entity, you should be able to tell what it is based on the contract we just mentioned.
