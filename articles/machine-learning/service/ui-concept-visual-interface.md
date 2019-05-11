---
title: Visual interface
titleSuffix: Azure Machine Learning service
description: Learn about the terms, concepts, and workflow that make up the visual interface (preview) for Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: larryfr
author: Blackmist
ms.date: 04/15/2019
ms.custom: seoapril2019
# As a data scientist, I want to understand the big picture about how Azure Machine Learning service works.
ms.custom: seodec18
---

# What is the visual interface for Azure Machine Learning service? 

The visual interface (preview) for Azure Machine Learning service enables you to prep data, train, test, deploy, manage, and track machine learning models without writing code.

The visual interface uses the compute resources in Azure Machine Learning service to train and deploy the model.

![Overview of the visual interface](media/ui-concept-visual-interface/overview.png)

## Workflow

You typically use data from one or more sources to develop a predictive analysis model.  You transform and analyze the data through various data manipulation and statistical functions, then generate a set of results. This process is an iterative one. Modify the various functions and their parameters until you are satisfied that you have trained an effective model.

The visual interface gives you an interactive, visual workspace to quickly build, test, and iterate on a model. You drag-and-drop **datasets** and analysis **modules** onto an interactive canvas, connecting them together to form an **experiment**. Then run the experiment using the compute resource of the Machine Learning Service workspace. To iterate on your model design, you edit the experiment, save a copy if desired, and run it again. When you're ready, convert your **training experiment** to a **predictive experiment**.   Then  deploy the predictive experiment as a **web service** so that your model can be accessed by others.

There is no programming required, you visually connect datasets and modules to construct your model.

## Experiment

An experiment consists of datasets that provide data to analytical modules, which you connect together to construct a model. Specifically, a valid experiment has these characteristics:

* The experiment contains at least one dataset and one module
* Datasets may be connected only to modules
* Modules may be connected to either datasets or other modules
* All input ports for modules must have some connection to the data flow
* All required parameters for each module must be set

You drag-and-drop the modules from the left pane to the interactive canvas and connect them to build your **training experiment**. Run the experiment to evaluate the performance of the model. To iterate on your model design, edit the experiment, save a copy if desired, and run it again.

When you are ready, covert your **training experiment** to a **predictive experiment**. The predictive experiment generates new predictions by scoring the user's input on your trained model. Then deploy the **predictive experiment** as a **web service** so that your model can be accessed by others.

Create a training experiment from scratch, or use an existing sample experiment as a template.

For an example of a simple experiment, see [Quickstart: Prepare and visualize data without writing code in Azure Machine Learning](ui-quickstart-run-experiment.md).

For a more complete walkthrough of a predictive analytics solution, see [Tutorial: Predict automobile price with the visual interface](ui-tutorial-automobile-price-train-score.md)

## Compute target

A compute target is the compute resource that you use to run your experiment or host your service deployment. The supported compute targets are: 


| Compute target | Training | Deployment |
| ---- |:----:|:----:|
| Azure Machine Learning compute | ✓ | |
| Azure Kubernetes Service | | ✓ |

Compute targets are attached to your Machine Learning [workspace](concept-workspace.md). You manage your compute targets in your workspace in Azure portal.

## Web service

Once your predictive analytics model is ready, you can deploy it as a web service right from the visual interface.

The web services provide an interface between an application and the visual interface workflow scoring model. An external application can communicate with the workflow scoring model in real time. A call to a web service returns prediction results to an external application. To make a call to a web service, you pass an API key that was created when you deployed the web service. The web service is based on REST, a popular architecture choice for web programming projects.

To learn how to deploy your model, see [Tutorial: Deploy a machine learning model with the visual interface](ui-tutorial-automobile-price-deploy.md).

## Datasets

A dataset is data that has been uploaded to the visual interface to use in the modeling process. A number of sample datasets are included for you to experiment with, and you can upload more datasets as you need them.

## Next steps

* Learn the basics of predictive analytics and machine learning with [Quickstart: Prepare and visualize data without writing code in Azure Machine Learning](ui-quickstart-run-experiment.md).
* Use one of the samples and modify to suite your needs:
    * [Sample 1 - Regression: Predict price](ui-sample-regression-predict-automobile-price-basic.md)
    * [Sample 2 - Regression: Predict price and compare algorithms](ui-sample-regression-predict-automobile-price-compare-algorithms.md)
    * [Sample 3 - Classification: Predict credit risk](ui-sample-classification-predict-credit-risk-basic.md)
    * [Sample 4 - Classification: Predict credit risk (cost sensitive)](ui-sample-classification-predict-credit-risk-cost-sensitive.md)
    * [Sample 5 - Classification: Predict churn, appetency, and up-selling](ui-sample-classification-predict-churn.md)
