---
title: What is Designer (v2)?
titleSuffix: Azure Machine Learning
description: Learn about the drag-and-drop Designer UI in Machine Learning studio, and how it uses Designer v2 custom components to build and edit machine learning pipelines.
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: lagayhar
ms.reviewer: lagayhar
author: lgayhardt
ms.date: 05/21/2024
ms.custom: designer
---

# What is Designer (v2) in Azure Machine Learning studio?

Designer in Azure Machine Learning studio is a drag-and-drop user interface for building machine learning pipelines in Azure Machine Learning workspaces.

The following animated GIF shows how you can build a pipeline visually in Designer by dragging and dropping building blocks and connecting them.

:::image type="content" source="./media/concept-designer/designer-drag-and-drop.gif" alt-text="GIF of a building a pipeline in the designer." lightbox= "./media/concept-designer/designer-drag-and-drop.gif":::

## Classic prebuilt (v1) or custom (v2) components

Designer supports two types of pipeline components: classic prebuilt (v1) or custom (v2). These two types of components aren't compatible. This article applies to custom components.

- **Classic prebuilt components (v1)** support typical data processing and machine learning tasks like regression and classification. Support continues for existing classic prebuilt components, but no new prebuilt components are being added. For more information about Designer v1, see [Azure Machine Learning designer (v1)](v1/concept-designer.md?view=azureml-api-1&preserve-view=true).

- **Custom components (v2)** let you wrap your own code as components, enabling sharing across workspaces and seamless authoring across Azure Machine Learning studio, CLI v2, and SDK v2 interfaces. It's best to use custom components for new projects, because they're compatible with Azure Machine Learning v2 and continue to receive new updates.

## Assets library

Designer uses building blocks from the Azure Machine Learning asset library to create pipelines. The asset library includes the following pipeline building blocks:

 - [Data](concept-data.md)
 - [Models](how-to-manage-models.md?view=azureml-api-2&preserve-view=true&tabs=cli)
 - [Components](concept-component.md)

The asset libraries on the left side of the designer show both assets you created in your workspace and assets shared in all Azure Machine Learning [registries](./how-to-share-models-pipelines-across-workspaces-with-registries.md) that you have access to.

To see assets from specific registries, select the **Registry name** filter above the asset libraries. The assets you created in your current workspace are in the **Workspace** registry. The assets provided by Azure Machine Learning are in the **azureml** registry.

:::image type="content" source="./media/concept-designer/asset-library.png" alt-text="Screenshot of the asset libraries filtered for one registry." lightbox= "./media/concept-designer/asset-library.png":::

To learn how to create data and component assets in your workspace, see the following articles:

- [How to create data assets](./how-to-create-data-assets.md)
- [How to create components](./how-to-create-component-pipelines-ui.md)

## Pipelines

You can use Designer to visually create pipelines with your assets. When you open Designer, you see two tabs at the bottom of the screen: **Pipeline drafts** and **Pipeline jobs**.

:::image type="content" source="./media/concept-designer/pipeline-draft-and-job.png" alt-text="Screenshot of pipeline draft and pipeline job list." lightbox= "./media/concept-designer/pipeline-draft-and-job.png":::

### Pipeline drafts

As you edit a pipeline, Designer saves your progress as a pipeline draft. You can edit a pipeline draft anytime by adding or removing components, configuring compute targets, and setting parameters.

A valid pipeline draft has the following characteristics:

- Data assets can connect only to components.
- Components can connect only to either data assets or to other components.
- All required input ports for components must have some connection to the data flow.
- All required parameters for each component must be set.

When you're ready to run your pipeline draft, you submit a pipeline job.

### Pipeline jobs

Each time you run a pipeline, the configuration of the pipeline and its results are stored in your workspace as a pipeline job. You can resubmit any past pipeline job, inspect it for troubleshooting or auditing, or clone it to create a new pipeline draft for further editing.

## Ways to build pipelines

In Designer, you can create new pipelines or clone and build on existing workspace pipeline jobs.

### New pipeline from scratch

You can create a new pipeline and build it from scratch. Be sure to select the **Custom component** option when you create the pipeline in Designer.

:::image type="content" source="./media/concept-designer/new-pipeline.png" alt-text="Screenshot of selecting new pipeline with custom components." lightbox= "./media/concept-designer/new-pipeline.png":::

### Clone an existing pipeline job

If you want to base a pipeline on an existing pipeline job in the workspace, you can clone the job into a new pipeline draft to continue editing.

:::image type="content" source="./media/concept-designer/pipeline-clone.png" alt-text="Screenshot of a pipeline job in the workspace with the clone button highlighted." lightbox= "./media/concept-designer/pipeline-clone.png":::
After cloning, you can find out which pipeline job the new pipeline was cloned from by selecting **Show lineage**.

:::image type="content" source="./media/concept-designer/draft-show-lineage.png" alt-text="Screenshot showing the draft lineage after selecting Show lineage." lightbox= "./media/concept-designer/draft-show-lineage.png":::

You can edit your pipeline and resubmit your pipelines. After submitting, you can see the lineage between the job you submit and the original job by selecting **Show lineage** in the job detail page.

## Related content

- [Create a pipeline with components (UI)](./how-to-create-component-pipelines-ui.md)
