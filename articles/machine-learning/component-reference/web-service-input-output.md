---
title: "Web Service Input/Output: Component reference"
description: Learn how to use the web service components in Azure Machine Learning designer to manage inputs and outputs.
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/13/2020
---
# Web Service Input and Web Service Output components

This article describes the Web Service Input and Web Service Output components in Azure Machine Learning designer.

The Web Service Input component can only connect to an input port with the type **DataFrameDirectory**. The Web Service Output component can only be connected from an output port with the type **DataFrameDirectory**. You can find the two components in the component tree, under the **Web Service** category. 

The Web Service Input component indicates where user data enters the pipeline. The Web Service Output component indicates where user data is returned in a real-time inference pipeline.

## How to use Web Service Input and Output

When you [create a real-time inference pipeline](../v1/tutorial-designer-automobile-price-deploy.md#create-a-real-time-inference-pipeline) from your training pipeline, the Web Service Input and Web Service Output components will be automatically added to show where user data enters the pipeline and where data is returned. 

> [!NOTE]
> Automatically generating a real-time inference pipeline is a rule-based, best-effort process. There's no guarantee of correctness. 

You can manually add or remove the Web Service Input and Web Service Output components to satisfy your requirements. Make sure that your real-time inference pipeline has at least one Web Service Input component and one Web Service Output component. If you have multiple Web Service Input or Web Service Output components, make sure they have unique names. You can enter the name in the right panel of the component.

You can also manually create a real-time inference pipeline by adding Web Service Input and Web Service Output components to your unsubmitted pipeline.

> [!NOTE]
> The pipeline type will be determined the first time you submit it. Be sure to add Web Service Input and Web Service Output components before you submit for the first time.

The following example shows how to manually create real-time inference pipeline from the Execute Python Script component. 

![Example](media/module/web-service-input-output-example.png)
   
After you submit the pipeline and the run finishes successfully, you can [deploy the real-time endpoint](../v1/tutorial-designer-automobile-price-deploy.md#deploy-the-real-time-endpoint).
   
> [!NOTE]
>  In the preceding example, **Enter Data Manually** provides the data schema for web service input and is necessary for deploying the real-time endpoint. Generally, you should always connect a component or dataset to the port where **Web Service Input** is connected to provide the data schema.
   
## Next steps
Learn more about [deploying the real-time endpoint](../v1/tutorial-designer-automobile-price-deploy.md#deploy-the-real-time-endpoint).

See the [set of components available](component-reference.md) to Azure Machine Learning.
