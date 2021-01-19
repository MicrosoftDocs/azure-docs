---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Rebuild experiment'
description: describe how to rebuild experiment to train a model in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: zhanxia
ms.author: zhanixa
ms.date: 1/19/2020
---

# Rebuild the experiment


Rebuild ML Studio(classic) experiment can be further divided into following steps:

1.  [Migrate the dataset](#migrate-the-dataset)
1.  [Rebuild the graph by drag and drop](#rebuild-the-graph-by-drag-and-drop)
1.  [Submit a run and check result](#submit-a-run-and-check-result)

Usually you will repeat 2-3 many times to build the training pipeline iteratively.



## Migrate the dataset

In short, there are two steps to migrate dataset from ML Studio(classic) to Azure Machine Learning:

- 1. Download the dataset from Studio(classic)
- 2. Create a dataset in Azure Machine Learning

#### Download the dataset

Studio(classic) support several data types. for data types listed below, you can directly download them in DATASETS tab as shown in below screenshot.

* Plain text (.txt)
* Comma-separated values (CSV) with a header (.csv) or without (.nh.csv)
* Tab-separated values (TSV) with a header (.tsv) or without (.nh.tsv)
* Excel file
* Zip file (.zip)

![download-dataset](./media/migrate-to-AML/download-dataset.png)

For other data types (listed below), use the Convert to CSV module to convert the type to CSV first then download the result of Convert to CSV module.

* SVMLight data (.svmlight) 
* Attribute Relation File Format (ARFF) data (.arff) 
* R object or workspace file (.RData)
* Dataset type (.data). Dataset type is  Studio(classic) internal data type for module output.

Below experiment screenshot shows how to convert the type and download.

![download-csv](./media/migrate-to-AML/download-csv.png)

### Create dataset in Azure Machine Learning Studio

With the data files downloaded from previous step, we can register them as dataset in Azure Machine Learning. 

In Azure Machine Learning, there are two concepts related to data: datastores and datasets. Datastores store connection information with original data source service like Blob storage in a secure way. They store connection information, like your subscription ID and token authorization in your Key Vault associated with the workspace, so you can securely access your storage without having to hard code them in your script. Datasets is a reference to the data source location along with a copy of its metadata. Datasets make it easier to access and work with your data with features like versioning and lineage. 


Follow below steps to create a dataset in Azure Machine Learning Studio.

1. Go to Azure Machine Learning Studio (ml.azure.com)
1. Navigate to Datasets tab under Assets
1. Click Create dataset -> From local files
1. Type dataset name and description following the wizard. Select Dataset type as tabular. (except .zip file, select file type for .zip file)
1. For Datastore and file selection section, select the datastore to upload your local files. By default it will select the worksapceblobstore, which is the blob storage associated to the workspace. 
1. For Settings and preview section, set data parsing settings based on your data.
1. For Schema section, you can view the schema of the data and choose columns to include.
1. Confirm details to finish creating the dataset.

    ![create-dataset-from-local](./media/migrate-to-AML/create-dataset-from-local.gif)

After create a dataset, you will be able to see the dataset in designer module palette on the left, under Datasets category.

![dataset in module tree](./media/migrate-to-AML/dataset-module-tree.png)

## Rebuild the graph by drag and drop

ML Studio(classic) allows customer visually connect dataset and modules to create an experiment to train a model. Azure Machine Learning designer provides similar experience. In Azure Machine Learning, the visual graph is called pipeline draft. Customer can submit a run from a pipeline draft, which turns into a pipeline run and the record of each run will be tracked in Azure Machine Learning Studio.  

Go through the [designer-tutorial](../tutorial-designer-automobile-price-train-score.md) before you start rebuild the ML Studio(classic) experiments in designer. The tutorial will give you a good walk-through on how to use designer. 

The process of rebuild the graph can be summarized as following steps:

1. Create a new pipeline in designer
![designer launch](../media/tutorial-designer-automobile-price-train-score/launch-designer.png)

1. Rebuild the graph by drag-n-drop the needed dataset and modules
![designer connect](../media/tutorial-designer-automobile-price-train-score/connect-modules.gif)

1. Set parameters
    1. Set module parameter. Click on a module the module setting panel will pop up on the right. In the setting panel, you can set parameters for the module. Check [module reference](../algorithm-module-reference/module-reference.md) to understand how to use each module. 
    ![module-setting](./media/migrate-to-AML/module-setting.png)
    1. Set compute.  
    
        A pipeline runs on a compute target, which is a compute resource that's attached to your workspace.  You can set a Default compute target for the entire pipeline, which will tell every module to use the same compute target by default. However, you can specify compute targets on a per-module basis. It can be done in the **Run Settings** section in module panel in above screenshot.
    
        To set a default compute for the entire pipeline, select the **Gear icon** ![gear-icon](../media/tutorial-designer-automobile-price-train-score/gear-icon.png) next to the pipeline name to open the run setting panel. Select **Select compute target** in the panel, then select an existing compute or create a new compute following the **Set up compute target** pop up window. You only need to set the default compute target before you run the pipeline for the first time. Later runs will use the default compute target. 
        ![run-setting](./media/migrate-to-AML/run-setting.png) 

## Submit a run and check result

1. At the top of the canvas, select **Submit**.
    ![submit](./media/migrate-to-AML/submit.png)
1. In the **Set up pipeline run** dialog box, select **Create new** to create a new experiment.
    ![create-exp](./media/migrate-to-AML/create-exp.png)
1. Enter a descriptive name for **New experiment Name**.

1. Select **Submit**.

> [!NOTE]
> Experiments group similar pipeline runs together. If you run a pipeline multiple times, you can select the same experiment for successive runs.

After submit a run, the run status will show up at the top right of the canvas and in the right sidebar of each module.

![run status](./media/migrate-to-AML/run-status.png)

If is the first run, it may take up to 20 minutes for your pipeline to finish running. The default compute settings have a minimum node size of 0, which means that the designer must allocate resources after being idle. Repeated pipeline runs will take less time since the compute resources are already allocated. To speed up the running time, you can keep at least one node idle. See how to create compute in [create compute section](#compute-for-training)

After the run finish, you can check the output of each module. Here are a few helpful options if you right-click a module.

![right-click](./media/migrate-to-AML/right-click.png)
 - **Visualize**: Preview the result dataset to help you understand the result of a module.
- **View Output**: Link you to the storage account that stores module's output, in which you can further explore/download the output. 
- **View Log** : View log to understand what happens under the hood. The **70_driver_log** would be the most helpful log in most cases since in contains the information related to customer script. You can drag the right panel to expand the log area or expand into full screen as shown in below gif.
 
    ![view-log](./media/migrate-to-AML/resize-right-panel.gif)


### [to-do] which is better? include the R script/Import data difference here or in the reference? 
> [!TIP]
> The [migration reference article](./migrate-reference.md) call outs the difference of Studio(classic) and designer that you should pay attention to. For example, it includes the module mapping table, the tips to migrate R script.

