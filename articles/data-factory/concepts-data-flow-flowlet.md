---
title: Flowlets in mapping data flows
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn the concepts of Flowlets in mapping data flow
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 01/11/2023
---

# Flowlets in mapping data flow

## What is a flowlet?

 A flowlet is a reusable container of activities that can be created from an existing mapping data flow or started from scratch. By reusing patterns you can prevent logic duplication and apply the same logic across many mapping data flows.
 
 With flowlets you can create logic to do things such as address cleaning or string trimming. You can then map the input and outputs to columns in the calling data flow for a dynamic code reuse experience.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWQK3m]

## Getting started
To create a flowlet, click the new flowlet action from the mapping data flow menu options.

![Screenshot showing how to create a flowlet](./media/data-flow-flowlet/flowlet-new-menu.png)

This will create a new flowlet where you can add in your inputs, outputs, and transformation activities

## Flowlet design surface
The flowlet design surface is similar to the mapping data flow design surface. The primary differences are the input, output, and debugging experiences that are described below.

![Screenshot showing the flowlet design surface and the similarity with mapping data flows.](./media/data-flow-flowlet/flowlet-design.png)

### Flowlet input

The input of a flowlet defines the input columns expected from a calling mapping data flow. That calling mapping data flow will map columns from a stream into the columns you have defined from the input. This allows your flowlet  to perform reusable logic on columns while giving flexibility on the calling mapping data flow for which columns the flowlet applies to.

![Screenshot showing flowlet input configuration properties panel.](./media/data-flow-flowlet/flowlet-input.png)

### Flowlet output

The output of a flowlet defines the output columns that can be expected to emit to the calling mapping data flow. After any transformations are performed in your flowlet the resulting output columns will be sent to the calling mapping data flow.

![Screenshot showing flowlet output configuration properties panel.](./media/data-flow-flowlet/flowlet-output.png)

### Debugging a flowlet
Debugging a flowlet has a couple of differences from the mapping data flow debug experience. 

First, the preview data is only available at the output of the flowlet. To preview data, make sure to select the flowout output and then the Preview Data tab.

![Screenshot showing Preview Data on the output in the flowlet.](./media/data-flow-flowlet/flowlet-debug.png)

Second, because flowlets are dynamically mapped to inputs, in order to debug them flowlets allow users to enter test data to send through the flowlet. Under the debug settings, you should see a grid to fill out with test data that will match the input columns. Note for inputs with a large number of columns you may need to select on the full screen icon.

![Screenshot showing Debug Settings and how to enter test data for debugging.](./media/data-flow-flowlet/flowlet-debug-settings.png)

## Other methods for creating a flowlet
Flowlets can also be created from existing mapping data flows. This allows users to quickly reuse logic already created.

For a single transformation activity, you can right-click the mapping data flow activity and select Create a new flowlet. This will create a flowlet with that activity and in input to match the activity's inputs.

![Screenshot showing creating a flowlet from an existing activity using the right-click menu option.](./media/data-flow-flowlet/flowlet-context-create.png)

If you have mulit-select turned on, you can also select multiple mapping data flow activities. This can be done by either lassoing multiple activities by drawing a rectangle to select them or using shift+select to select multiple activities. Then you will right-click and select Create a new flowlet.

![Screenshot showing multiple selection from existing activities.](./media/data-flow-flowlet/flowlet-context-multi.png)


## Running a flowlet inside of a mapping data flow
Once the flowlet is created, you can run the flowlet from your mapping data flow activity with the flowlet transformation. 

For more information, see [Flowlet transformation in mapping data flow | Microsoft Docs](data-flow-flowlet.md)
