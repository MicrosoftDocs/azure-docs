---
title: What is the Azure Machine Learning designer?
titleSuffix: Azure Machine Learning
description: Learn what the Azure Machine Learning designer is and what tasks you can use it for. The drag-and-drop UI enables to build machine learning pipeline. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: lagayhar
ms.reviewer: lagayhar
author: lgayhardt
ms.date: 04/26/2023
ms.custom: designer, training
monikerRange: 'azureml-api-2 |'
---

# What is Azure Machine Learning designer? 

Azure Machine Learning designer is a drag-and-drop interface used to build pipeline in Azure Machine Learning. This article describes the tasks you can do in the designer.

The basic building block of pipeline is called component. 

![Azure Machine Learning designer example](./media/concept-designer/designer-drag-and-drop.gif)

The designer uses your Azure Machine Learning [workspace](concept-workspace.md) to organize shared resources such as:

+ [Pipelines](#pipeline)
+ [Data](#data)
+ [Compute resources](#compute)
:::moniker range="azureml-api-2"
+ [Registered models](concept-model-management-and-deployment.md#register-and-track-machine-learning-models)
:::moniker-end
:::moniker range="azureml-api-1"
+ [Registered models](v1/concept-azure-machine-learning-architecture.md#models)
:::moniker-end
+ [Published pipelines](#publish)
+ [Real-time endpoints](#deploy)


## Pipeline

A [pipeline](concept-ml-pipelines.md) consists of data assets and analytical components, which you connect. Pipelines have many uses: you can make a pipeline that trains a single model, or one that trains multiple models. You can create a pipeline that makes predictions in real time or in batch, or make a pipeline that only cleans data. Pipelines let you reuse your work and organize your projects.

### Pipeline draft

As you edit a pipeline in the designer, your progress is saved as a **pipeline draft**. You can edit a pipeline draft at any point by adding or removing components, configuring compute targets, creating parameters, and so on.

A valid pipeline has these characteristics:

* Data assets can only connect to components.
* components can only connect to either data assets or other components.
* All input ports for components must have some connection to the data flow.
* All required parameters for each component must be set.

When you're ready to run your pipeline draft, you submit a pipeline job.

### Pipeline job

Each time you run a pipeline, the configuration of the pipeline and its results are stored in your workspace as a **pipeline job**. You can go back to any pipeline job to inspect it for troubleshooting or auditing. **Clone** a pipeline job to create a new pipeline draft for you to edit.

Pipeline jobs are grouped into experiments to organize job history. You can set the experiment for every pipeline job. 

## Data

A machine learning data asset makes it easy to access and work with your data. Several [sample data assets](samples-designer.md#datasets) are included in the designer for you to experiment with. You can [register](how-to-create-register-datasets.md) more data assets as you need them.

## Component

A component is an algorithm that you can perform on your data. The designer has several components ranging from data ingress functions to training, scoring, and validation processes.

A component may have a set of parameters that you can use to configure the component's internal algorithms. When you select a component on the canvas, the component's parameters are displayed in the Properties pane to the right of the canvas. You can modify the parameters in that pane to tune your model. You can set the compute resources for individual components in the designer. 

:::image type="content" source="./media/concept-designer/properties.png" alt-text="Component properties":::


For some help navigating through the library of machine learning algorithms available, see [Algorithm & component reference overview](component-reference/component-reference.md). For help with choosing an algorithm, see the [Azure Machine Learning Algorithm Cheat Sheet](algorithm-cheat-sheet.md).





