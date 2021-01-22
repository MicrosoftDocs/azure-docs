---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Rebuild experiment'
description: describe how to rebuild experiment to train a model in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 1/19/2020
---

# Rebuild a Studio (classic) experiment in Azure Machine Learning

In this article, you learn how to rebuild a Studio (classic) experiment in Azure Machine Learning. For more information on migrating from Studio (classic), see [the migration overview article](migrate-overview.md).


Rebuilding a Studio (classic) experiment as an Azure Machine Learning pipeline can be broken down into four steps:

1.  [Migrate the dataset](#migrate-the-dataset).
1.  [Rebuild the pipeline graph](#rebuild-the-pipeline).
1.  [Set the compute target](#set-the-compute-target).
1.  [Submit a run and check results](#submit-a-run-and-check-results).

Rebuilding a pipeline is an iterative process, so it's important to check results and repeat the process until you're satisfied with the results.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
- A Studio (classic) experiment to migrate.

## Migrate the dataset

There are multiple ways ingest data in Azure Machine Learning. The simplest way to migrate an existing dataset from Studio (classic) is by downloading the Studio (classic) dataset and using the data file to create a new dataset in Azure Machine Learning.

For more information on importing data directly from cloud sources, see [TODO].

### Download the dataset

For the following Studio (classic) data types, you can directly download datasets.

* Plain text (.txt)
* Comma-separated values (CSV) with a header (.csv) or without (.nh.csv)
* Tab-separated values (TSV) with a header (.tsv) or without (.nh.tsv)
* Excel file
* Zip file (.zip)

To directly download datasets:
1. In the left navigation bar, select the **Datasets** tab.
1. Select the dataset(s) you want to download.
1. In the bottom action bar, select **Download**.

![Screenshot showing how to download a dataset in Studio (classic)](./media/migrate-rebuild-experiment/download-dataset.png)

For the following data types, use the **Convert to CSV** module first, then download the dataset.

* SVMLight data (.svmlight) 
* Attribute Relation File Format (ARFF) data (.arff) 
* R object or workspace file (.RData)
* Dataset type (.data). Dataset type is  Studio(classic) internal data type for module output.

To convert your dataset to a CSV and download the results:

1. In a new experiment, drag and drop the dataset onto the canvas.
1. Add the **Convert to CSV** module.
1. Connect the **Convert to CSV** input port to the output port of your dataset.
1. Run the experiment
1. Right-click the **Convert to CSV** module.
1. Select **Results dataset** > **Download**

![Screenshot showing how to setup a convert to CSV pipeline](./media/migrate-rebuild-experiment/csv-download-dataset.png)

### Create a dataset in Azure Machine Learning

After you download the data file, you can register the dataset in Azure Machine Learning:

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com)).
1. In the left navigation pane, select the **Datasets** tab.
1. Select **Create dataset** > **From local files**.
    ![Screenshot showing the datasets tab and the button for creating a local file](./media/migrate-rebuild-experiment/register-dataset.png)
1. Enter a name and description.
1. For **Dataset type**, select **Tabular**.
1. **For Datastore and file selection**, select the datastore that will store your local file.
    By default, Azure Machine Learning stores the dataset to the default workspace blobstore. For more information on datastores, see [Connect to storage services](../how-to-access-data.md).
1. Set the data parsing settings and schema for your dataset. Then, confirm your settings.

    

## Rebuild the pipeline

Azure Machine Learning designer provides a similar drag-and-drop experience to Studio (classic). Use the designer to rebuild your experiments as pipelines drafts.

In Azure Machine Learning, the visual graph is called a pipeline draft. Once you submit a run from a pipeline draft, it turns into a pipeline run. Each pipeline run is recorded and logged in Azure Machine Learning.

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com))
1. In the left navigation pane, select **Designer** > **Easy-to-use prebuilt modules**
    ![Screenshot showing how to create a new pipeline draft.](../media/tutorial-designer-automobile-price-train-score/launch-designer.png)

1. Manually rebuild your experiment using the designer modules.
    
    See the the [module-mapping table](migrate-reference.md#studio-classic-and-designer-module-mapping) to see if replacement modules are available in the designer. Many of Studio (classic)'s most popular modules have identical versions the designer.

    > [!Important]
    > If your experiment uses the Execute R Script module, additional steps are required to migrate your experiment. For more information, see [TODO].

1. Set parameters.
    
    Select each module and adjust the parameters in the module settings panel to the right. Use the parameters to recreate the functionality of your Studio (classic) experiment. For more information on each module, see the [module reference](../algorithm-module-reference/module-reference.md).

## Set the compute target

A pipeline runs on a compute target that's attached to your workspace. You can set a default compute target for the entire pipeline, or you can specify compute targets on a per-module basis.

To set a default compute for the entire pipeline:
1. Select the **Gear icon** ![Gear icon in the designer](../media/tutorial-designer-automobile-price-train-score/gear-icon.png) next to the pipeline name.
1. Select **Select compute target**.
1. Select an existing compute, or create a new compute by following the on screen instructions.

    You only need to set the default compute target the first time you run it. Later runs will use the default compute target. 

![run-setting](./media/migrate-to-AML/run-setting.png) 

## Submit a run and check results

Now, it's time to submit a pipeline run of your pipeline draft.

1. At the top of the canvas, select **Submit**.
1. Select **Create new** to create a new experiment, or use an existing experiment.
    > [!NOTE]
    > Experiments organize similar pipeline runs together. If you run a pipeline multiple times, you can select the same experiment for successive runs. This is useful for logging and tracking.
1. Enter an experiment name. Then, select **Submit**.

The first run may take up to 20 minutes for your pipeline to complete. Since the default compute settings have a minimum node size of 0, the designer must allocate resources after being idle. Repeated runs will take less time, since the compute resources are already allocated. To speed up the running time, you can keep at least one node idle.

After the run finishes, you can check the results of each module:

1. Right-click the module whose output you want to see.
1. Select Visualize, View Output, or View Log to see more.

![Screenshow showing options when you right click a module in the designer.](./media/migrate-to-AML/right-click.png)
- **Visualize**: Preview the results dataset.
- **View Output**: Open a link to the output storage location. Use this to explore or download the output. 
- **View Log** : View driver and system logs. Use the **70_driver_log** to see information related to your user-submitted script.


### [to-do] which is better? include the R script/Import data difference here or in the reference? 
> [!TIP]
> The [migration reference article](./migrate-reference.md) call outs the difference of Studio(classic) and designer that you should pay attention to. For example, it includes the module mapping table, the tips to migrate R script.

