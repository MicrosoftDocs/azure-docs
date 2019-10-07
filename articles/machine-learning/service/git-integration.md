---
title: Git integration for Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning with a Git repository.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jordane
author: jpe316
ms.date: 09/20/2019
ms.custom: seodec18
---
# Git integration for Azure Machine Learning

In this article, you'll learn how to use Azure Machine Learning with **Git repositories.**

The [Azure Machine Learning service](overview-what-is-azure-ml.md) streamlines the building, training, and deployment of machine learning models.

+ For training, it provides support for running experiments locally or remotely. 
+ For every experiment, you can log custom metrics of multiple runs to fine-tune hyperparameters
+ You can also use the Azure Machine Learning service to easily deploy machine learning models for your testing and production needs.

Any time you work from a Git repository, Azure Machine Learning automatically tracks the repository, branch and commit you are currently working at.
This is in addition to the service's built in code snapshotting service.

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. 
For example, the current commit ID for the repository is logged as part of the history. 

This works with runs submitted using an estimator, ML pipeline, or script run. 
It also works for runs submitted from the SDK or Machine Learning CLI.

## Where to see Git repository information.
Git metadata is logged to the backend service whenever you execute a command from a Git repository.
This can be found in the property bag of the entities, in the SDK / CLI / Workspace Portal.

Here is a screenshot showing where Git information is located for a script run experiment in the portal.

## Next steps

* For a walkthrough of how to train with Azure Machine Learning in Visual Studio Code, see [Tutorial: Train models with Azure Machine Learning](tutorial-train-models-with-aml.md).
* For a walkthrough of how to edit, run, and debug code locally, see the [Python hello-world tutorial](https://code.visualstudio.com/docs/Python/Python-tutorial).
