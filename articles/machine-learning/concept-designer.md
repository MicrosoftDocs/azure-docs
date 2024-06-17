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

# What is Designer (v2) in Azure Machine Learning?

Designer in Azure Machine Learning studio is a drag-and-drop user interface for building machine learning pipelines in Azure Machine Learning workspaces.

> [!IMPORTANT]
> Designer in Azure Machine Learning supports two types of pipelines, which use classic prebuilt (v1) or custom (v2) components. The two component types aren't compatible within pipelines. **This article applies to Designer (v2) with custom components.** 
> 
> - **Custom components (v2)** let you wrap your own code as components, enabling sharing across workspaces and seamless authoring across Azure Machine Learning studio, CLI v2, and SDK v2 interfaces. It's best to use custom components for new projects, because they're compatible with Azure Machine Learning v2 and continue to receive new updates.
> 
> - **Classic prebuilt components (v1)** support typical data processing and machine learning tasks like regression and classification. Azure Machine Learning continues to support the existing classic prebuilt components, but no new classic prebuilt components are being added. For information about classic prebuilt components and the v1 designer, see [Azure Machine Learning designer (v1)](v1/concept-designer.md?view=azureml-api-1&preserve-view=true).

The following animated GIF shows how you can build a pipeline visually in Designer by dragging and dropping assets and connecting them.

:::image type="content" source="./media/concept-designer/designer-drag-and-drop.gif" alt-text="GIF of a building a pipeline in the designer." lightbox= "./media/concept-designer/designer-drag-and-drop.gif":::

## Asset libraries

Designer uses building blocks from Azure Machine Learning asset libraries to create pipelines. The asset libraries include the following pipeline building blocks:

 - [Data](concept-data.md)
 - [Models](how-to-manage-models.md?view=azureml-api-2&preserve-view=true&tabs=cli)
 - [Components](concept-component.md)

The **Data**, **Model**, and **Component** tabs on the left side of Designer show assets in your workspace and in all Azure Machine Learning [registries](./how-to-share-models-pipelines-across-workspaces-with-registries.md) that you have access to.

:::image type="content" source="./media/concept-designer/asset-library.png" alt-text="Screenshot of the asset libraries filtered for one registry." lightbox= "./media/concept-designer/asset-library.png":::

To view assets from specific registries, select the **Registry name** filter. The assets you created in your current workspace are in the **Workspace** registry. The assets provided by Azure Machine Learning are in the **azureml** registry.

To learn how to create data and component assets in your workspace, see the following articles:

- [Create and manage data assets](./how-to-create-data-assets.md)
- [Create and run pipelines using components](./how-to-create-component-pipelines-ui.md)

## Pipelines

You can use Designer to visually build pipelines with your assets. You can either create new pipelines or clone and build on existing pipeline jobs.

### New pipelines

Selecting the **+** symbol under **New pipeline** at the top of the Designer screen creates a new pipeline to build from scratch. Be sure to select the **Custom** option so you can use custom components.

:::image type="content" source="./media/concept-designer/new-pipeline.png" alt-text="Screenshot of selecting new pipeline with custom components." lightbox= "./media/concept-designer/new-pipeline.png":::

The two tabs under **Pipelines** at the bottom of the Designer screen show the existing **Pipeline drafts** and **Pipeline jobs** in your workspace.

### Pipeline drafts

As you build a pipeline, Designer saves your progress as a pipeline draft.

:::image type="content" source="./media/concept-designer/pipeline-draft-and-job.png" alt-text="Screenshot of pipeline draft list." lightbox= "./media/concept-designer/pipeline-draft-and-job.png":::

You can edit a pipeline draft anytime by adding or removing components, configuring compute targets, and setting parameters.

:::image type="content" source="./media/concept-designer/edit-pipeline.png" alt-text="Screenshot of a draft pipeline being edited." lightbox= "./media/concept-designer/edit-pipeline.png":::

A valid pipeline draft has the following characteristics:

- Data assets can connect only to components.
- Components can connect only to either data assets or to other components.
- All required input ports for components must have some connection to the data flow.
- All required parameters for each component must be set.

When you're ready to run your pipeline draft, you save it and submit it as a pipeline job.

### Pipeline jobs

Each time you run a pipeline, the pipeline configuration and results are stored in your workspace as a pipeline job. You can resubmit any past pipeline job, inspect it for troubleshooting or auditing, or clone it to create a new pipeline draft for further editing.

:::image type="content" source="./media/concept-designer/pipeline-job.png" alt-text="Screenshot of pipeline job list." lightbox= "./media/concept-designer/pipeline-job.png":::

You can edit and resubmit your pipelines. After submitting, you can see the lineage between the job you submit and the original job by selecting **Show lineage** on the job detail page.

:::image type="content" source="./media/concept-designer/resubmitted.png" alt-text="Screenshot showing the resubmitted lineage after selecting Show lineage." lightbox= "./media/concept-designer/resubmitted.png":::

### Cloned pipeline jobs

If you want to base a new pipeline on an existing pipeline job in the workspace, you can clone the job into a new pipeline draft to continue editing.

:::image type="content" source="./media/concept-designer/pipeline-clone.png" alt-text="Screenshot of a pipeline job in the workspace with the clone button highlighted." lightbox= "./media/concept-designer/pipeline-clone.png":::
After cloning, you can find out which pipeline job the new pipeline was cloned from by selecting **Show lineage**.

:::image type="content" source="./media/concept-designer/draft-show-lineage.png" alt-text="Screenshot showing the draft lineage after selecting Show lineage." lightbox= "./media/concept-designer/draft-show-lineage.png":::

## Related content

- [Create a pipeline with components (UI)](./how-to-create-component-pipelines-ui.md)
