---
title: Visual interface
titleSuffix: Azure Machine Learning service
description: Learn about the terms, concepts, and workflow that make up the visual interface (preview) for Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 05/15/2019
# As a data scientist, I want to understand the big picture about how the visual interface for Azure Machine Learning service works.
---

# What is the visual interface for Azure Machine Learning service? 

The visual interface (preview) for Azure Machine Learning service enables you to prep data, train, test, deploy, manage, and track machine learning models without writing code.

There is no programming required, you visually connect [datasets](#dataset) and [modules](#module) to construct your model.

The visual interface uses your Azure Machine Learning service [workspace](concept-workspace.md) to:

+ Write artifacts of [experiment](#experiment) runs into the workspace.
+ Access [datasets](#dataset).
+ Use the [compute resources](#compute) in the workspace to run the experiment. 
+ Register [models](concept-azure-machine-learning-architecture.md#models).
+ [Deploy](#deployment) models as web services on compute resources in the workspace.

![Overview of the visual interface](media/ui-concept-visual-interface/overview.png)

## Workflow

The visual interface gives you an interactive, visual canvas to quickly build, test, and iterate on a model. 

+ You drag-and-drop [modules](#module) onto the canvas.
+ Connect the modules together to form an [experiment](#experiment).
+ Run the experiment using the compute resource of the Machine Learning Service workspace.
+ Iterate on your model design by editing the experiment and running it again.
+ When you're ready, convert your **training experiment** to a **predictive experiment**.
+ [Deploy](#deployment) the predictive experiment as a web service so that your model can be accessed by others.

## Experiment

Create an experiment from scratch, or use an existing sample experiment as a template.  Each time you run an experiment, artifacts are stored in your workspace.

An experiment consists of datasets and analytical modules, which you connect together to construct a model. Specifically, a valid experiment has these characteristics:

* Datasets may be connected only to modules.
* Modules may be connected to either datasets or other modules.
* All input ports for modules must have some connection to the data flow.
* All required parameters for each module must be set.

For an example of a simple experiment, see [Quickstart: Prepare and visualize data without writing code in Azure Machine Learning](ui-quickstart-run-experiment.md).

For a more complete walkthrough of a predictive analytics solution, see [Tutorial: Predict automobile price with the visual interface](ui-tutorial-automobile-price-train-score.md).

## Dataset

A dataset is data that has been uploaded to the visual interface to use in the modeling process. A number of sample datasets are included for you to experiment with, and you can upload more datasets as you need them.

## Module

A module is an algorithm that you can perform on your data. The visual interface has a number of modules ranging from data ingress functions to training, scoring, and validation processes.

A module may have a set of parameters that you can use to configure the module's internal algorithms. When you select a module on the canvas, the module's parameters are displayed in the Properties pane to the right of the canvas. You can modify the parameters in that pane to tune your model.

![Module properties](media/ui-concept-visual-interface/properties.png)

For some help navigating through the library of machine learning algorithms available, see [Algorithm & module reference overview](../algorithm-module-reference/module-reference.md)

## <a name="compute"></a> Compute resources

Use compute resources from your workspace to run your experiment or host your deployed models as web services. The supported compute targets are:


| Compute target | Training | Deployment |
| ---- |:----:|:----:|
| Azure Machine Learning compute | ✓ | |
| Azure Kubernetes Service | | ✓ |

Compute targets are attached to your Machine Learning [workspace](concept-workspace.md). You manage your compute targets in your workspace in the [Azure portal](https://portal.azure.com).

## Deployment

Once your predictive analytics model is ready, you deploy it as a web service right from the visual interface.

The web services provide an interface between an application and your scoring model. An external application can communicate with the scoring model in real time. A call to a web service returns prediction results to an external application. To make a call to a web service, you pass an API key that was created when you deployed the web service. The web service is based on REST, a popular architecture choice for web programming projects.

To learn how to deploy your model, see [Tutorial: Deploy a machine learning model with the visual interface](ui-tutorial-automobile-price-deploy.md).

## Next steps

* Learn the basics of predictive analytics and machine learning with [Quickstart: Prepare and visualize data without writing code in Azure Machine Learning](ui-quickstart-run-experiment.md).
* Use one of the samples and modify to suite your needs:
    * [Sample 1 - Regression: Predict price](ui-sample-regression-predict-automobile-price-basic.md)
    * [Sample 2 - Regression: Predict price and compare algorithms](ui-sample-regression-predict-automobile-price-compare-algorithms.md)
    * [Sample 3 - Classification: Predict credit risk](ui-sample-classification-predict-credit-risk-basic.md)
    * [Sample 4 - Classification: Predict credit risk (cost sensitive)](ui-sample-classification-predict-credit-risk-cost-sensitive.md)
    * [Sample 5 - Classification: Predict churn, appetency, and up-selling](ui-sample-classification-predict-churn.md)
