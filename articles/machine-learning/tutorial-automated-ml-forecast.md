---
title: Foreacast bike sharing demand with automated ML experiment
titleSuffix: Azure Machine Learning
description: Learn how to train and deploy a demand forecasting with automated machine learning in Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: sacartac
ms.reviewer: nibaccam
author: cartacioS
ms.date: 01/27/2020

# Customer intent: As a non-coding data scientist, I want to use automated machine learning to build a demand forecasting model with built in holiday featurization.
---

# Tutorial: Forecast bike sharing demand with automated machine learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-enterprise-sku.md)]

In this tutorial, you use automated machine learning, or automated ML, in the Azure Machine Learning studio to create a demand forecasting model for a bike sharing service.

In this tutorial, you learn how to do the following tasks:

> [!div class="checklist"]
> * Create an experiment in an Azure Machine Learning workspace.
> * Configure a remote run of automated ML for a time-series model with lag and holiday features.
> * View the engineered names for featurized data and featurization summary for all raw features.
> * Evaluate the fitted model using a rolling test.

## Prerequisites

* [Create an Enterprise edition workspace](how-to-manage-workspace.md) if you don't already have an Azure Machine Learning workspace. 
    * Automated machine learning in the Azure Machine Learning studio is only avaialble for Enterprise edition workspaces. 
* Download the [bike-no.csv]() data file

## Set up experiment

Complete the following experiment set-up and run steps in Azure Machine Learning studio, a consolidated interface that includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels. The studio is not supported on Internet Explorer browsers.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).

1. Select your subscription and the workspace you created.

1. Select **Get started**.

1. In the left pane, select **Automated ML** under the **Author** section.

1. Select **+New automated ML run**. 

## Create and load dataset

1. On the **Select dataset** form, select **From local files** from the  **+Create dataset** drop-down. 

    1. On the **Basic info** form, give your dataset a name and provide an optional description. The dataset type  should default to **Tabular**, since automated ML in Azure Machine Learning studio currently only supports TabularDatasets.
    
    1. Select **Next** on the bottom left

    1. On the **Datastore and file selection** form, select the default datastore that was automatically set up during your workspace creation, **workspaceblobstore (Azure Blob Storage)**. This is the storage location for your soon to be uploaded data file. 

    1. Select **Browse**. 
    
    1. Choose the **bike-no.csv** file on your local computer. This is the file you downloaded as a [prerequisite](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-bike-share/bike-no.csv).

    1. Select **Next**

       When the upload is complete, the Settings and preview form is pre-populated based on the file type. 
       
    1. Verify that the **Settings and preview** form is populated as follows and select **Next**.
        
        Field|Description| Value for tutorial
        ---|---|---
        File format|Defines the layout and type of data stored in a file.| Delimited
        Delimiter|One or more characters for specifying the boundary between&nbsp; separate, independent regions in plain text or other data streams. |Comma
        Encoding|Identifies what bit to character schema table to use to read your dataset.| UTF-8
        Column headers| Indicates how the headers of the dataset, if any, will be treated.| Use headers from the first file
        Skip rows | Indicates how many, if any, rows are skipped in the dataset.| None

    1. The **Schema** form allows for further configuration of your data for this experiment. 
    
        1. For this example, choose to ignore the **Casual** and **Registered** columns. These columns are a breakdown of the  **cnt** column so, therefore unneccessary.
        
        1. Select **Next**.

    1. On the **Confirm details** form, verify the information matches what was previously  populated on the **Basic info** and **Settings and preview** forms.
    1. Select **Create** to complete the creation of your dataset.

    1. Select your dataset once it appears in the list.

    1. Select  **Next**.

## Configure experiment run

1. Populate the **Configure Run** form as follows:
    1. Enter an experiment name: `automl-bikeshare`

    1. Select **cnt** as the target column, what you want to predict. This column indicates the number of total rentals.

    1. Select **Create a new compute** and configure your compute target. Automated ML only supports Azure Machine Learning compute. 

        Field | Description | Value for tutorial
        ----|---|---
        Compute name |A unique name that identifies your compute context.|bike-compute
        Virtual&nbsp;machine&nbsp;size| Select the virtual machine size for your compute.|Standard_DS12_V2
        Min / Max nodes (in Advanced Settings)| To profile data, you must specify 1 or more nodes.|Min nodes: 1<br>Max nodes: 6
  
        1. Select **Create** to get the compute target. 

            **This takes a couple minutes to complete.** 

        1. After creation, select your new compute target from the drop-down list.

    1. Select **Next**.

## Select task type and settings

1. On the **Task type and settings** form, select **Forecasting** as the machine learning task type.

    1. Select **View additional configuration settings** and populate the fields as follows. These settings are to better control the training job. Otherwise, defaults are applied based on experiment selection and data.

  
        Additional&nbsp;configurations|Description|Value&nbsp;for&nbsp;tutorial
        ------|---------|---
        Primary metric| Evaluation metric that the machine learning algorithm will be measured by.|Normalized root mean squared error
        Automatic featurization| Enables preprocessing. This includes automatic data cleansing, preparing, and transformation to generate synthetic features.| Enable
        Explain best model (preview)| Automatically shows explainability on the best model created by automated ML.| Enable
        Blocked algorithms | Algorithms you want to exclude from the training job| Extreme Random Trees
        Additional forecasting settings| Settings |Forecast horizon: 14 <br> Forecast&nbsp;target&nbsp;lags: None <br> Target&nbsp;rolling&nbsp;window&nbsp;size: None
        Exit criterion| If a criteria is met, the training job is stopped. |Training&nbsp;job&nbsp;time (hours): 3 <br> Metric&nbsp;score&nbsp;threshold: None
        Validation | Choose a cross-validation type and number of tests.|Validation type:<br>&nbsp;k-fold&nbsp;cross-validation <br> <br> Number of validations: 3
        Concurrency| The maximum number of parallel iterations executed and cores used per iteration| Max&nbsp;concurrent&nbsp;iterations: 4
        
        Select **OK**.

## Run experiment

1. Select **Create** to run the experiment. The **Run Details**  screen opens with the **Run status** at the top next to the run number. This status updates as the experiment progresses.

>[!IMPORTANT]
> Preparation takes **10-15 minutes** to prepare the experiment run.
> Once running, it takes **2-3 minutes more for each iteration**.  <br>
> In production, you'd likely walk away for a bit. But for this tutorial, we suggest you start exploring the tested algorithms on the **Models** tab as they complete while the others are still running. 

##  Explore models

Navigate to the **Models** tab to see the algorithms (models) tested. By default, the models are ordered by metric score as they complete. For this tutorial, the model that scores the highest based on the chosen **Normalized root mean squared error** metric is at the top of the list.

While you wait for all of the experiment models to finish, select the **Algorithm name** of a completed model to explore its performance details. 

The following navigates through the **Model details** and the **Visualizations** tabs to view the selected model's properties, metrics and performance charts. 

![Run iteration detail](./media/tutorial-first-experiment-automated-ml/run-detail.gif)


## Deploy the model

Automated machine learning in Azure Machine Learning studio allows you to deploy the best model as a web service in a few steps. Deployment is the integration of the model so it can predict on new data and identify potential areas of opportunity. 

For this experiment, deployment to a web service means that the financial institution now has an iterative and scalable web solution for forecasting bikeshare customer demand. 

Once the run is complete, navigate back to the **Run Detail** page and select the **Models** tab. Select **Refresh**. 

In this experiment context, **StackEnsemble** is considered the best model, based on the **Normalized root mean squared error** metric.  We deploy this model, but be advised, deployment takes about 20 minutes to complete. The deployment process entails several steps including registering the model, generating resources, and configuring them for the web service.

1. Select the **Deploy Best Model** button in the bottom-left corner.

1. Populate the **Deploy a model** pane as follows:

    Field| Value
    ----|----
    Deployment name| my-automl-deploy
    Deployment description| My first automated machine learning experiment deployment
    Compute type | Select Azure Compute Instance (ACI)
    Enable authentication| Disable. 
    Use custom deployments| Disable. Allows for the default driver file (scoring script) and environment file to be autogenerated. 
    
    For this example, we use the defaults provided in the *Advanced* menu. 

1. Select **Deploy**.  

    A green success message appears at the top of the **Run** screen, and 
    in the **Recommended model** pane, a status message appears under **Deploy status**. Select **Refresh** periodically to check the deployment status.
    
Now you have an operational web service to generate predictions. 

Proceed to the [**Next Steps**](#next-steps) to learn more about how to consume your new web service, and test your predictions using Power BI's built in Azure Machine Learning support.

## Clean up resources

Deployment files are larger than data and experiment files, so they cost more to store. Delete only the deployment files to minimize costs to your account, or if you want to keep your workspace and experiment files. Otherwise, delete the entire resource group, if you don't plan to use any of the files.  

### Delete the deployment instance

Delete just the deployment instance from the Azure Machine Learning studio, if you want to keep the resource group and workspace for other tutorials and exploration. 

1. Go to the [Azure Machine Learning studio](https://ml.azure.com/). Navigate to your workspace and  on the left under the **Assets** pane, select **Endpoints**. 

1. Select the deployment you want to delete and select **Delete**. 

1. Select **Proceed**.

### Delete the resource group

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

In this automated machine learning tutorial, you used Azure Machine Learning studio to create and deploy a demand forecasting model. See these articles for more information and next steps:

> [!div class="nextstepaction"]
> [Consume a web service](how-to-consume-web-service.md#consume-the-service-from-power-bi)


>[!NOTE]
> This bike share dataset has been modified for this tutorial. This dataset was made available as part of a [Kaggle competition](https://www.kaggle.com/c/bike-sharing-demand/data) and was originally available via [Capital Bikeshare](https://www.capitalbikeshare.com/system-data). It can also be found within the [UCI Machine Learning Database](http://archive.ics.uci.edu/ml/datasets/Bike+Sharing+Dataset).<br><br>
> Source: Fanaee-T, Hadi, and Gama, Joao, Event labeling combining ensemble detectors and background knowledge, Progress in Artificial Intelligence (2013): pp. 1-15, Springer Berlin Heidelberg.
