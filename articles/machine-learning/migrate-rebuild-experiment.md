---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Rebuild experiment'
description: Rebuild Studio (classic) experiments in Azure Machine Learning designer.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio-classic
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 03/08/2021
---

# Rebuild a Studio (classic) experiment in Azure Machine Learning

In this article, you learn how to rebuild a Studio (classic) experiment in [Azure Machine Learning](../index.yml). For more information on migrating from Studio (classic), see [the migration overview article](migrate-overview.md).

Studio (classic) **experiments** are similar to **pipelines** in Azure Machine Learning. However, in Azure Machine Learning pipelines are built on the same back-end that powers the SDK. This means that you have two options for machine learning development: the drag-and-drop designer or code-first SDKs.

For more information on building pipelines with the SDK, see [What are Azure Machine Learning pipelines](../concept-ml-pipelines.md#building-pipelines-with-the-python-sdk).


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
- A Studio (classic) experiment to migrate.
- [Upload your dataset](migrate-register-dataset.md) to Azure Machine Learning.

## Rebuild the pipeline

After you [migrate your dataset to Azure Machine Learning](migrate-register-dataset.md), you're ready to recreate your experiment.

In Azure Machine Learning, the visual graph is called a **pipeline draft**. In this section, you recreate your classic experiment as a pipeline draft.

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com))
1. In the left navigation pane, select **Designer** > **Easy-to-use prebuilt modules**
    ![Screenshot showing how to create a new pipeline draft.](../media/tutorial-designer-automobile-price-train-score/launch-designer.png)

1. Manually rebuild your experiment with designer modules.
    
    Consult the [module-mapping table](migrate-overview.md#studio-classic-and-designer-module-mapping) to find replacement modules. Many of Studio (classic)'s most popular modules have identical versions in the designer.

    > [!Important]
    > If your experiment uses the Execute R Script module, you need to perform additional steps to migrate your experiment. For more information, see [Migrate R Script modules](migrate-execute-r-script.md).

1. Adjust parameters.
    
    Select each module and adjust the parameters in the module settings panel to the right. Use the parameters to recreate the functionality of your Studio (classic) experiment. For more information on each module, see the [module reference](../algorithm-module-reference/module-reference.md).

## Submit a run and check results

After you recreate your Studio (classic) experiment, it's time to submit a **pipeline run**.

A pipeline run executes on a **compute target** attached to your workspace. You can set a default compute target for the entire pipeline, or you can specify compute targets on a per-module basis.

Once you submit a run from a pipeline draft, it turns into a **pipeline run**. Each pipeline run is recorded and logged in Azure Machine Learning.

To set a default compute target for the entire pipeline:
1. Select the **Gear icon** ![Gear icon in the designer](../media/tutorial-designer-automobile-price-train-score/gear-icon.png) next to the pipeline name.
1. Select **Select compute target**.
1. Select an existing compute, or create a new compute by following the on-screen instructions.

Now that your compute target is set, you can submit a pipeline run:

1. At the top of the canvas, select **Submit**.
1. Select **Create new** to create a new experiment.
    
    Experiments organize similar pipeline runs together. If you run a pipeline multiple times, you can select the same experiment for successive runs. This is useful for logging and tracking.
1. Enter an experiment name. Then, select **Submit**.

    The first run may take up to 20 minutes. Since the default compute settings have a minimum node size of 0, the designer must allocate resources after being idle. Successive runs take less time, since the nodes are already allocated. To speed up the running time, you can create a compute resources with a minimum node size of 1 or greater.

After the run finishes, you can check the results of each module:

1. Right-click the module whose output you want to see.
1. Select either **Visualize**, **View Output**, or **View Log**.

    - **Visualize**: Preview the results dataset.
    - **View Output**: Open a link to the output storage location. Use this to explore or download the output. 
    - **View Log**: View driver and system logs. Use the **70_driver_log** to see information related to your user-submitted script such as errors and exceptions.

> [!IMPORTANT]
> Designer modules use open source Python packages, compared to C# packages in Studio (classic). As a result, module output may vary slightly between the designer and Studio (classic). 


## Next steps

In this article, you learned how to rebuild a Studio (classic) experiment in Azure Machine Learning. The next step is to [rebuild web services in Azure Machine Learning](migrate-rebuild-web-service.md).


See the other articles in the Studio (classic) migration series:

1. [Migration overview](migrate-overview.md).
1. [Migrate dataset](migrate-register-dataset.md).
1. **Rebuild a Studio (classic) training pipeline**.
1. [Rebuild a Studio (classic) web service](migrate-rebuild-web-service.md).
1. [Integrate an Azure Machine Learning web service with client apps](migrate-rebuild-integrate-with-client-app.md).
1. [Migrate Execute R Script](migrate-execute-r-script.md).
