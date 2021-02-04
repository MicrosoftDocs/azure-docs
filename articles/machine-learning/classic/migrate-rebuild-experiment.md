---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Rebuild experiment'
description: Rebuild Studio (classic) experiments in Azure Machine Learning designer
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 02/04/2021
---

# Rebuild a Studio (classic) experiment in Azure Machine Learning

In this article, you learn how to rebuild a Studio (classic) experiment in Azure Machine Learning. For more information on migrating from Studio (classic), see [the migration overview article](migrate-overview.md).

Rebuilding a Studio (classic) **experiment** as an Azure Machine Learning **pipeline** can be broken down into the following steps:

1.  [Migrate the dataset](#migrate-the-dataset).
1.  [Rebuild the pipeline graph](#rebuild-the-pipeline).
1.  [Submit a run and check results](#submit-a-run-and-check-results).

Rebuilding a pipeline is an iterative process, so check results and repeat the process until you're satisfied with the results.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
- A Studio (classic) experiment to migrate.

## Migrate the dataset

There are multiple ways ingest data in Azure Machine Learning. This article shows you the simplest way to migrate a dataset from Studio (classic), which is to download the Studio (classic) dataset and using the data file to create a new dataset in Azure Machine Learning.

To import data directly from cloud sources instead, see the [Migration reference](migrate-reference.md#import-data-from-cloud-sources).

### Download the dataset

You can download the following  Studio (classic) dataset types directly.

* Plain text (.txt)
* Comma-separated values (CSV) with a header (.csv) or without (.nh.csv)
* Tab-separated values (TSV) with a header (.tsv) or without (.nh.tsv)
* Excel file
* Zip file (.zip)

To download datasets directly:
1. Go to your Studio (classic) workspace ([https://studio.azureml.net](https://studio.azureml.net)).
1. In the left navigation bar, select the **Datasets** tab.
1. Select the dataset(s) you want to download.
1. In the bottom action bar, select **Download**.

![Screenshot showing how to download a dataset in Studio (classic)](./media/migrate-rebuild-experiment/download-dataset.png)

For the following data types, you must use the **Convert to CSV** module to download datasets.

* SVMLight data (.svmlight) 
* Attribute Relation File Format (ARFF) data (.arff) 
* R object or workspace file (.RData)
* Dataset type (.data). Dataset type is  Studio(classic) internal data type for module output.

To convert your dataset to a CSV, and download the results:

1. Go to your Studio (classic) workspace ([https://studio.azureml.net](https://studio.azureml.net)).
1. Create a new experiment.
1. Drag and drop the dataset you want to download onto the canvas.
1. Add a **Convert to CSV** module.
1. Connect the **Convert to CSV** input port to the output port of your dataset.
1. Run the experiment.
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

    > [!NOTE]
    > You can also upload ZIP files as datasets. To upload a ZIP file, select **File** for **Dataset type**.

1. **For Datastore and file selection**, select the datastore you want to upload your dataset file to.

    By default, Azure Machine Learning stores the dataset to the default workspace blobstore. For more information on datastores, see [Connect to storage services](../how-to-access-data.md).

1. Set the data parsing settings and schema for your dataset. Then, confirm your settings.

## Rebuild the pipeline

After you upload you your dataset to Azure Machine Learning, you're ready to recreate your experiment. **Azure Machine Learning designer** provides a similar drag-and-drop experience to Studio (classic).

In Azure Machine Learning, the visual graph is called a **pipeline draft**. Once you submit a run from a pipeline draft, it turns into a **pipeline run**. Each pipeline run is recorded and logged in Azure Machine Learning.

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com))
1. In the left navigation pane, select **Designer** > **Easy-to-use prebuilt modules**
    ![Screenshot showing how to create a new pipeline draft.](../media/tutorial-designer-automobile-price-train-score/launch-designer.png)

1. Manually rebuild your experiment with designer modules.
    
    See the [module-mapping table](migrate-reference.md#studio-classic-and-designer-module-mapping) to see the replacement modules. Many of Studio (classic)'s most popular modules have identical versions the designer.

    > [!Important]
    > If your experiment uses the Execute R Script module, you need to perform additional steps to migrate your experiment. For more information, see the [Migration reference](migrate-reference.md#execute-r-script).

1. Adjust parameters.
    
    Select each module and adjust the parameters in the module settings panel to the right. Use the parameters to recreate the functionality of your Studio (classic) experiment. For more information on each module, see the [module reference](../algorithm-module-reference/module-reference.md).

## Submit a run and check results

After you recreate your Studio (classic) experiment, it's time to submit a pipeline run.

A pipeline run executes on a compute target attached to your workspace. You can set a default compute target for the entire pipeline, or you can specify compute targets on a per-module basis.

To set a default compute target for the entire pipeline:
1. Select the **Gear icon** ![Gear icon in the designer](../media/tutorial-designer-automobile-price-train-score/gear-icon.png) next to the pipeline name.
1. Select **Select compute target**.
1. Select an existing compute, or create a new compute by following the on-screen instructions.

Now that your compute target is set, you can submit a pipeline run:

1. At the top of the canvas, select **Submit**.
1. Select **Create new** to create a new experiment.
    > [!NOTE]
    > Experiments organize similar pipeline runs together. If you run a pipeline multiple times, you can select the same experiment for successive runs. This is useful for logging and tracking.
1. Enter an experiment name. Then, select **Submit**.

The first run may take up to 20 minutes. Since the default compute settings have a minimum node size of 0, the designer must allocate resources after being idle. Successive runs take less time, since the nodes are already allocated. To speed up the running time, you can create a compute resources with a minimum node size of 1 or greater.

After the run finishes, you can check the results of each module:

1. Right-click the module whose output you want to see.
1. Select **Visualize**, **View Output**, or **View Log**.

- **Visualize**: Preview the results dataset.
- **View Output**: Open a link to the output storage location. Use this to explore or download the output. 
- **View Log**: View driver and system logs. Use the **70_driver_log** to see information related to your user-submitted script such as errors and exceptions.


## Next steps

In this article, you learned how to rebuild a Studio (classic) experiment in Azure Machine Learning. The next step is to [rebuild a Studio (classic) web service in Azure Machine Learning](migrate-rebuild-web-service.md).


See the other articles in the Studio (classic) migration series:

- [Migration overview](migrate-overview.md)
- [Rebuild a Studio (classic) web service in Azure Machine Learning](migrate-rebuild-web-service.md)
- [Integrate an Azure Machine Learning web service with client apps](migrate-rebuild-integrate-with-client-app.md)
- [Migration reference](migrate-reference.md)
