---
title: Create your first automated ML classification experiment
titleSuffix: Azure Machine Learning
description: Learn how to train and deploy a classification model with automated machine learning in Azure Machine Learning's workspace landing page (preview).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: tzvikei
author: tsikiksr
ms.reviewer: nibaccam
ms.date: 09/26/2019

# Customer intent: As a non-coding data scientist, I want to use automated machine learning techniques so that I can build a classification model.
---

# Tutorial: Create your first classification model with automated machine learning

In this tutorial, you learn how to create your first automated machine learning experiment through the workspace landing page (preview) without writing a single line of code. This example creates a classification model to predict if a client will subscribe to a fixed term deposit with a financial institution.

With automated machine learning, you can automate away time intensive tasks. Automated machine learning rapidly iterates over many combinations of algorithms and hyperparameters to help you find the best model based on a success metric of your choosing.

In this tutorial, you learn how to do the following tasks:

> [!div class="checklist"]
> * Create an Azure Machine Learning workspace.
> * Run an automated machine learning experiment.
> * View experiment details.
> * Deploy the model.

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLFree).

* Download the [**bankmarketing_train.csv**](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_train.csv) data file. The **y** column indicates if a customer subscribed to a fixed term deposit, which is later identified as the target column for predictions in this tutorial. 

## Create a workspace

An Azure Machine Learning workspace is a foundational resource in the cloud that you use to experiment, train, and deploy machine learning models. It ties your Azure subscription and resource group to an easily consumed object in the service. 

You create a workspace via the Azure portal, a web-based console for managing your Azure resources. 

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

>[!IMPORTANT] 
> Take note of your **workspace** and **subscription**. You'll need these to ensure you create your experiment in the right place. 

## Create and run the experiment

You complete the following experiment set-up and run steps in the workspace landing page, a consolidated interface that includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels. The workspace landing page is not supported on Internet Explorer browsers.

1. Sign in to the [workspace landing page](https://ml.azure.com/workspaceportal/).

1. Select your subscription and the workspace you created.

1. Select **Get started**.

1. In the left pane, select **Automated ML** under the **Author** section.

   Since this is your first automated ML experiment, you'll see the Getting started screen.

   ![Azure Machine Learning studio](media/tutorial-1st-experiment-automated-ml/get-started.png)

1. Select **Create experiment**. 

1. Enter this experiment name: `my-1st-automl-experiment`

1. Select **Create a new compute** and configure your compute target. A compute target is a local or cloud based resource environment used to run your training script or host your service deployment. For this experiment we use a cloud based compute. 

   Field | Description | Value for tutorial
   ----|---|---
   Compute name |A unique name that identifies your compute context.|automl-compute
   Virtual&nbsp;machine&nbsp;size| Select the virtual machine size for your compute.|Standard_DS12_V2
   Min / Max nodes (in Advanced Settings)| To profile data, you must specify 1 or more nodes.|Min nodes: 1<br>Max nodes: 6

   >[!NOTE]
   >For this tutorial, you'll use the default storage account and container created with your new compute. They automatically populate in the form.
    
1. Select **Create** to get the compute target. 

   **This takes a couple minutes to complete.** 

1. After creation, select your new compute target from the drop-down list and select **Next**.

1. Select **Upload from local file** to begin creating a new dataset. 

    1. Select **Browse**.
    
    1. Choose the **bankmarketing_train.csv** file on your local computer. This is the file you downloaded as a [prerequisite](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_train.csv).

    1. Give your dataset a unique name and provide an optional description. 

    1. Select **Next** on the bottom left,  to  upload it to the default container that was automatically set up during your workspace creation. Public preview supports only local file uploads. 
    
       When the upload is complete, the Settings and preview form is pre-populated based on the file type. 
       
    1. Verify that the **Settings and preview** form is populated as follows and select **Next**.
        
        Field|Description| Value for tutorial
        ---|---|---
        File format|Defines the layout and type of data stored in a file.| Delimited
        Delimiter|One or more characters for specifying the boundary between&nbsp; separate, independent regions in plain text or other data streams. |Comma
        Encoding|Identifies what bit to character schema table to use to read your dataset.| UTF-8
        Column headers| Indicates how the headers of the dataset, if any, will be treated.| All files have same headers
        Skip rows | Indicates how many, if any, rows are skipped in the dataset.| None
    
        ![Preview tab configuration](media/tutorial-1st-experiment-automated-ml/schema-tab-config.gif)

1. Select **Classification** as the prediction task.

1. Select **y** as the target column, what you want to predict. This column indicates whether the client subscribed to a term deposit or not.

1. Expand **Advanced Settings** and populate the fields as follows. These settings are to better control the training job. Otherwise, defaults are applied based on experiment selection and data.

   >[!NOTE]
   > In this tutorial, you won't set a metric score or max cores per iterations threshold. Nor will you block algorithms from being tested.
   
   Advanced&nbsp;settings|Description|Value&nbsp;for&nbsp;tutorial
   ------|---------|---
   Primary metric| Evaluation metric that the machine learning algorithm will be measured by.|AUC_weighted
   Exit criteria| If a criteria is met, the training job is stopped. |Training&nbsp;job&nbsp;time: 5 <br> <br> Max&nbsp;#&nbsp;of&nbsp;iterations&#58;10
   Preprocessing| Enables preprocessing done by automated machine learning. This includes automatic data cleansing, preparing, and transformation to generate synthetic features.| Enable
   Validation type | Choose a cross-validation type.|K-fold cross-validation
   Number of validations | Number of tests. | 2 cross-validations 
   Concurrency| The number of max concurrent iterations.|5
   
1. Select **Start** to run the experiment. A screen appears with a status message as the experiment preparation begins.

>[!IMPORTANT]
> Preparation takes **10-15 minutes** to prepare the experiment run. 
> Once running, it takes **2-3 minutes more for each iteration**.  
>
> In production, you'd likely walk away for a bit. But for this tutorial, we suggest you start exploring the iteration results as they complete while the others are still running. 

##  Explore iteration results

As the experiment progresses, the screen updates the **Iteration chart** and **Iteration list** with the different iterations (models) created as they complete. By default, the iterations are ordered by metric score. For this tutorial, the model that scores the highest based on the chosen **AUC_weighted** metric is at the top of the list.

While you wait for all of the experiment iterations to finish, select the **Name** of a completed iteration to explore its performance details. 

The following shows the charts and run metrics generated for each iteration such as, a precision-recall curve, confusion matrix, weighted accuracy scores, etc. 

![Run iteration detail](media/tutorial-1st-experiment-automated-ml/run-detail.gif)

## Deploy the model

Automated machine learning in the workspace landing page allows you to deploy the best model as a web service in a few steps. Deployment is the integration of the model so it can predict on new data and identify potential areas of opportunity. For this experiment, deployment to a web service means that the financial institution now has an iterative and scalable web solution for identifying potential fixed term deposit customers. 

Once the run is complete, navigate back to the **Iteration chart** and **Iterations list** detail page. 

In this experiment context, **VotingEnsemble** is considered the best model, based on the **AUC_weighted** metric.  We deploy this model, but be advised, deployment takes about 20 minutes to complete. The deployment process entails several steps including registering the model, generating resources, and configuring them for the web service.

1. Select the **Deploy Best Model** button in the top-right corner.

1. Populate the **Deploy Best Model** pane as follows:

    Field| Value
    ----|----
    Deployment name| my-automl-deploy
    Deployment description| My first automated machine learning experiment deployment
    Scoring script| Autogenerate
    Environment script| Autogenerate
    
1. Select **Deploy**.  

    A deployment complete message appears when deployment successfully finishes.
    
Now you have an operational web service to generate predictions.

## Clean up resources

Deployment files are larger than data and experiment files, so they cost more to store. Delete only the deployment files to minimize costs to your account, or if you want to keep your workspace and experiment files. Otherwise, delete the entire resource group, if you don't plan to use any of the files.  

### Delete the deployment instance

Delete just the deployment instance from the Azure portal, if you want to keep the resource group and workspace for other tutorials and exploration. 

1. Go to the [Azure portal](https://portal.azure.com//). Navigate to your workspace and  on the left under the **Assets** pane, select **Deployments**. 

1. Select the deployment you want to delete and select **Delete**. 

1. Select **Proceed**.

### Delete the resource group

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this automated machine learning tutorial, you used the workspace landing page to create and deploy a classification model. See these articles for more information and next steps:

> [!div class="nextstepaction"]
> [Consume a web service](how-to-consume-web-service.md)

+ Learn more about [preprocessing](how-to-create-portal-experiments.md#preprocess).
+ Learn more about [data profiling](how-to-create-portal-experiments.md#profile).
+ Learn more about [automated machine learning](concept-automated-ml.md).
+ For more information on classification metrics and charts see the [Understand automated machine learning results](how-to-understand-automated-ml.md#classification) article.

>[!NOTE]
> This Bank Marketing dataset is made available under the [Creative Commons (CCO: Public Domain) License](https://creativecommons.org/publicdomain/zero/1.0/). Any rights in individual contents of the database are licensed under the [Database Contents License](https://creativecommons.org/publicdomain/zero/1.0/) and available on [Kaggle](https://www.kaggle.com/janiobachmann/bank-marketing-dataset). This dataset was originally available within the [UCI Machine Learning Database](https://archive.ics.uci.edu/ml/datasets/bank+marketing).<br><br>
> [Moro et al., 2014] S. Moro, P. Cortez and P. Rita. A Data-Driven Approach to Predict the Success of Bank Telemarketing. Decision Support Systems, Elsevier, 62:22-31, June 2014.
