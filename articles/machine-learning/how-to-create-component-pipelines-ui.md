---
title: Create and run component-based ML pipelines (UI)
titleSuffix: Azure Machine Learning
description: Create and run machine learning pipelines using the Azure Machine Learning studio UI. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: keli19
author: likebupt
ms.reviewer: lagayhar
ms.date:  05/10/2022
ms.topic: how-to
ms.custom: devplatv2, designer, event-tier1-build-2022, ignite-2022
---

# Create and run machine learning pipelines using components with the Azure Machine Learning studio

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In this article, you'll learn how to create and run [machine learning pipelines](concept-ml-pipelines.md) by using the Azure Machine Learning studio and [Components](concept-component.md). You can create pipelines without using components, but components offer better amount of flexibility and reuse. Azure ML Pipelines may be defined in YAML and [run from the CLI](how-to-create-component-pipelines-cli.md), [authored in Python](how-to-create-component-pipeline-python.md), or composed in Azure ML Studio Designer with a drag-and-drop UI. This document focuses on the AzureML studio designer UI.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace[Create workspace resources](quickstart-create-resources.md).

* [Install and set up the Azure CLI extension for Machine Learning](how-to-configure-cli.md).

* Clone the examples repository:

    ```azurecli-interactive
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli/jobs/pipelines-with-components/
    ```

## Register component in your workspace

>[!Note]
> Designer supports two type of components, classic prebuilt components and custom components. These two types of components are not compatible.  
>
>Classic prebuilt components provides prebuilt components majorly for data processing and traditional machine learning tasks like regression and classification. This type of component continues to be supported but will not have any new components added.
>
>
>Custom components allow you to provide your own code as a component. It supports sharing across workspaces and seamless authoring across Studio, CLI, and SDK interfaces.
>
>This article applies to custom components. 

To build pipeline using components in UI, you need to register components to your workspace first. You can use CLI or SDK to register components to your workspace, so that you can share and reuse the component within the workspace. Registered components support automatic versioning so you can update the component but assure that pipelines that require an older version will continue to work.  

In the example below take using CLI for example. If you want to learn more about how to build a component, see [Create and run pipelines using components with  CLI](how-to-create-component-pipelines-cli.md).

1. From the `cli/jobs/pipelines-with-components/basics` directory of the [`azureml-examples` repository](https://github.com/Azure/azureml-examples), navigate to the `1b_e2e_registered_components` subdirectory.

1. Register the components to AzureML workspace using following commands. Learn more about [ML components](concept-component.md).

    ```CLI
    az ml component create --file train.yml
    az ml component create --file score.yml
    az ml component create --file eval.yml
    ```

1. After register component successfully, you can see your component in the studio UI.

:::image type="content" source="./media/how-to-create-component-pipelines-ui/component-page.png" alt-text="Screenshot showing registered component in component page." lightbox ="./media/how-to-create-component-pipelines-ui/component-page.png":::

## Create pipeline using registered component

1. Create a new pipeline in the designer.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/new-pipeline.png" alt-text="Screenshot showing creating new pipeline in designer homepage." lightbox ="./media/how-to-create-component-pipelines-ui/new-pipeline.png":::

1. Set the default compute target of the pipeline. 

    Select the **Gear icon** ![Screenshot of the gear icon that is in the UI.](./media/tutorial-designer-automobile-price-train-score/gear-icon.png) at the top right of the canvas to open the **Settings** pane. Select the default compute target for your pipeline.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/set-default-compute.png" alt-text="Screenshot showing setting default compute for the pipeline." lightbox ="./media/how-to-create-component-pipelines-ui/set-default-compute.png":::

    > [!Important]
    > Attached compute is not supported, use [compute instances or clusters](concept-compute-target.md#azure-machine-learning-compute-managed) instead.

1. In asset library, you can see **Data assets** and **Components** tabs. Switch to **Components** tab, you can see the components registered from previous section.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/asset-library.png" alt-text="Screenshot showing registered component in asset library." lightbox ="./media/how-to-create-component-pipelines-ui/asset-library.png":::

    Drag the components and drop on the canvas. By default it will use the default version of the component, and you can change to a specific version in the right pane of component if your component has multiple versions.
    
      :::image type="content" source="./media/how-to-create-component-pipelines-ui/change-component-version.png" alt-text="Screenshot showing changing version of component." lightbox ="./media/how-to-create-component-pipelines-ui/change-component-version.png":::
    
1. Connect the upstream component output ports to the downstream component input ports.

1. Select one component, you'll see a right pane where you can configure the component.

    For components with primitive type inputs like number, integer, string and boolean, you can change values of such inputs in the component detailed pane.

    You can also change the output settings and compute target where this component run in the right pane.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/component-parameter.png" alt-text="Screenshot showing component parameter settings." lightbox ="./media/how-to-create-component-pipelines-ui/component-parameter.png":::

> [!NOTE]
> Currently registered components and the designer built-in components cannot be used together.

## Submit pipeline

1. Select submit, and fill in the required information for your pipeline job.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/submit-pipeline.png" alt-text="Screenshot of set up pipeline job with submit highlighted." lightbox ="./media/how-to-create-component-pipelines-ui/submit-pipeline.png":::

1. After submit successfully, you'll see a job detail page link in the left page. Select **Job detail** to go to pipeline job detail page for checking status and debugging.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/submission-list.png" alt-text="Screenshot showing the submitted jobs list." lightbox ="./media/how-to-create-component-pipelines-ui/submission-list.png":::

    > [!NOTE]
    > The **Submitted jobs** list only contains pipeline jobs submitted during an active session. A page reload will clear out the content.

## Next steps

- Use [these Jupyter notebooks on GitHub](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components) to explore machine learning pipelines further
- Learn [how to use CLI v2 to create pipeline using components](how-to-create-component-pipelines-cli.md).
- Learn [how to use SDK v2 to create pipeline using components](how-to-create-component-pipeline-python.md)
