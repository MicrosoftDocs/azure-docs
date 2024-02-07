---
title: What is the Azure Machine Learning designer(v1)?
titleSuffix: Azure Machine Learning
description: Learn what the Azure Machine Learning designer is and what tasks you can use it for. The drag-and-drop UI enables model training and deployment. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: lagayhar
ms.reviewer: lagayhar
author: lgayhardt
ms.date: 05/25/2023
ms.custom: UpdateFrequency5, designer, training
---

# What is Azure Machine Learning designer (v1)? 

Azure Machine Learning designer is a drag-and-drop interface used to train and deploy models in Azure Machine Learning. This article describes the tasks you can do in the designer.

>[!Note]
> Designer supports two types of components, classic prebuilt components（v1） and custom components(v2). These two types of components are NOT compatible. 
>
>Classic prebuilt components provide prebuilt components majorly for data processing and traditional machine learning tasks like regression and classification. This type of component continues to be supported but will not have any new components added. 
>
>Custom components allow you to wrap your own code as a component. It supports sharing components across workspaces and seamless authoring across Studio, CLI v2, and SDK v2 interfaces. 
>
>For new projects, we highly suggest you use custom component, which is compatible with AzureML V2 and will keep receiving new updates. 
>
>This article applies to classic prebuilt components and not compatible with CLI v2 and SDK v2.

 - To get started with the designer, see [Tutorial: Train a no-code regression model](tutorial-designer-automobile-price-train-score.md). 
 - To learn about the components available in the designer, see the [Algorithm and component reference](../algorithm-module-reference/module-reference.md).

:::image type="content" source="../media/concept-designer/designer-drag-and-drop.gif" alt-text="GIF of a building a pipeline in the designer." lightbox= "../media/concept-designer/designer-drag-and-drop.gif":::

The designer uses your Azure Machine Learning [workspace](../concept-workspace.md) to organize shared resources such as:

+ [Pipelines](#pipeline)
+ [Data](#data)
+ [Compute resources](#compute)
+ [Registered models](concept-azure-machine-learning-architecture.md#models)
+ [Published pipelines](#publish)
+ [Real-time endpoints](#deploy)

## Model training and deployment

Use a visual canvas to build an end-to-end machine learning workflow. Train, test, and deploy models all in the designer:

+ Drag-and-drop [data assets](#data) and [components](#component) onto the canvas.
+ Connect the components to create a [pipeline draft](#pipeline-draft).
+ Submit a [pipeline run](#pipeline-job) using the compute resources in your Azure Machine Learning workspace.
+ Convert your **training pipelines** to **inference pipelines**.
+ [Publish](#publish) your pipelines to a REST **pipeline endpoint** to submit a new pipeline that runs with different parameters and data assets.
    + Publish a **training pipeline** to reuse a single pipeline to train multiple models while changing parameters and data assets.
    + Publish a **batch inference pipeline** to make predictions on new data by using a previously trained model.
+ [Deploy](#deploy) a **real-time inference pipeline** to an online endpoint to make predictions on new data in real time.

:::image type="content" source="../media/concept-designer/designer-workflow-diagram.png" alt-text="Workflow diagram for training, batch inference, and real-time inference in the designer.":::

## Pipeline

A [pipeline](../concept-ml-pipelines.md) consists of data assets and analytical components, which you connect. Pipelines have many uses: you can make a pipeline that trains a single model, or one that trains multiple models. You can create a pipeline that makes predictions in real time or in batch, or make a pipeline that only cleans data. Pipelines let you reuse your work and organize your projects.

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

:::image type="content" source="../media/concept-designer/properties.png" alt-text="Screenshot showing the component properties.":::


For some help navigating through the library of machine learning algorithms available, see [Algorithm & component reference overview](../component-reference/component-reference.md). For help with choosing an algorithm, see the [Azure Machine Learning Algorithm Cheat Sheet](algorithm-cheat-sheet.md).

## <a name="compute"></a> Compute resources

Use compute resources from your workspace to run your pipeline and host your deployed models as online endpoints or pipeline endpoints (for batch inference). The supported compute targets are:

| Compute target | Training | Deployment |
| ---- |:----:|:----:|
| Azure Machine Learning compute | ✓ | |
| Azure Kubernetes Service | | ✓ |

Compute targets are attached to your [Azure Machine Learning workspace](../concept-workspace.md). You manage your compute targets in your workspace in the [Azure Machine Learning studio](https://ml.azure.com).

## Deploy

To perform real-time inferencing, you must deploy a pipeline as an [online endpoint](../concept-endpoints-online.md). The online endpoint creates an interface between an external application and your scoring model. A call to an online endpoint returns prediction results to the application in real time. To make a call to an online endpoint, you pass the API key that was created when you deployed the endpoint. The endpoint is based on REST, a popular architecture choice for web programming projects.

Online endpoints must be deployed to an Azure Kubernetes Service cluster.

To learn how to deploy your model, see [Tutorial: Deploy a machine learning model with the designer](tutorial-designer-automobile-price-deploy.md).

## Publish

You can also publish a pipeline to a **pipeline endpoint**. Similar to an online endpoint, a pipeline endpoint lets you submit new pipeline jobs from external applications using REST calls. However, you cannot send or receive data in real time using a pipeline endpoint.

Published pipelines are flexible, they can be used to train or retrain models, [perform batch inferencing](how-to-run-batch-predictions-designer.md), process new data, and much more. You can publish multiple pipelines to a single pipeline endpoint and specify which pipeline version to run.

A published pipeline runs on the compute resources you define in the pipeline draft for each component.

The designer creates the same [PublishedPipeline](/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.publishedpipeline) object as the SDK.

## Next steps

* Learn the fundamentals of predictive analytics and machine learning with [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)
* Learn how to modify existing [designer samples](samples-designer.md) to adapt them to your needs.
