---
title: Create your first automated machine learning experiment
titleSuffix: Azure Machine Learning service
description: Learn how to train and deploy a classification model with automated machine learning in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: tzvikei
author: tsikiksr
ms.reviewer: nibaccam
ms.date: 08/14/2019

# Customer intent:As a non-coding data scientist, I want to use automated machine learning techniques so that I can build a classification model.
---

# Tutorial: Create your first classification model with automated machine learning

In this tutorial, you learn how to create your first automated machine learning experiment in the Azure portal (preview) without writing a single line of code. This example creates a classification model to predict if a client will subscribe to a fixed term deposit with a financial institution.

With automated machine learning, you can automate away time intensive tasks. Automated machine learning rapidly iterates over many combinations of algorithms and hyperparameters to help you find the best model based on a success metric of your choosing.

In this tutorial, you learn how to do the following tasks:

> [!div class="checklist"]
> * Create an Azure Machine Learning service workspace.
> * Run an automated machine learning experiment.
> * View experiment details.
> * Deploy the model.

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLFree).

* Download the [**bankmarketing_train.csv**](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_train.csv) data file. The **y** column indicates if a customer subscribed to a fixed term deposit, which is later identified as the target column for predictions in this tutorial. 

## Create a workspace

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## Create and run the experiment

These steps walk you through experiment set up from data selection to choosing your primary metric and model type. 

1. Go to the left pane of your workspace. Select **Automated machine learning** under the **Authoring (Preview)** section.
You'll see the **Welcome to Automated Machine Learning** screen, since this is your first experiment with Automated Machine Learning.

    ![Azure portal navigation pane](media/tutorial-1st-experiment-automated-ml/nav-pane.png)

1. Select **Create experiment**. Then enter **my-1st-automl-experiment** as the experiment name.

1. Select **Create a new compute** and configure your compute context for this experiment.

    Field| Value
    ---|---
    Compute name| Enter a unique name that identifies your compute context. For this example, we use **automl-compute**.
    Virtual machine size| Select the virtual machine size for your compute. We use **Standard_DS12_V2**.
    Additional settings| *Min node*: 1. To enable data profiling, you must have one or more nodes. <br> *Max node*: 6. 

    To create your new compute, select **Create**. This takes a few moments. 

    When creation is complete, select your new compute from the drop-down list, and then select **Next**.

    >[!NOTE]
    >For this tutorial, we use the default storage account and container created with your new compute. They automatically populate in the form.

1. Select **Upload** and choose the **bankmarketing_train.csv** file from your local computer to upload it to the default container. Public preview supports only local file uploads and Azure Blob storage accounts. When the upload is complete, select the file from the list. 

1. The **Preview** tab allows us to further configure our data for this experiment.

    On the **Preview** tab, indicate that the data includes headers. The service defaults to include all of the features (columns) for training. For this example, scroll to the right and **Ignore** the **day_of_week** feature.

    ![Preview tab configuration](media/tutorial-1st-experiment-automated-ml/preview-tab-config.gif)

    >[!NOTE]
    > Data profiling is not available with computes that have zero minimum nodes.

1. Select **Classification** as the prediction task.

1. Select **y** as the target column, where we want to do predictions. This column indicates whether the client subscribed to a term deposit or not.

1. Expand **Advanced Settings** and populate the fields as follows.

    Advanced settings|Value
    ------|------
    Primary metric| AUC_weighted 
    Exit criteria| When any of these criteria are met, the training job ends before full completion: <br> *Training job time (minutes)*: 5  <br> *Max number of iterations*: 10 
    Preprocessing| Enables preprocessing done by automated machine learning. This includes automatic data cleansing, preparing, and transformation to generate synthetic features.
    Validation| Select K-fold cross-validation and **2** for the number of cross-validations. 
    Concurrency| Select **5** for the number of max concurrent iterations.

   >[!NOTE]
   > For this experiment, we don't set a metric or max cores per iterations threshold. We also don't block algorithms from being tested.

1. Select **Start** to run the experiment.

   When the experiment starts, you see a blank **Run Detail** screen with the following status at the top.
      
The experiment preparation process takes a couple of minutes. When the process finishes, the status message changes to **Run is Running**.

##  View experiment details

As the experiment progresses, the **Run Detail** screen updates the iteration chart and list with the different iterations (models) that are run. The iterations list is in order by metric score. By default, the model that scores the highest based on our **AUC_weighted** metric is at the top of the list.

>[!TIP]
> Training jobs take several minutes for each pipeline to finish running.

[![Run details dashboard](media/tutorial-1st-experiment-automated-ml/run-details.png)](media/tutorial-1st-experiment-automated-ml/run-details-expanded.png#lightbox)

## Deploy the model

By using automated machine learning in the Azure portal, we can deploy the best model as a web service to predict on new data and identify potential areas of opportunity. For this experiment, deployment means that the financial institution now has an iterative and scalable solution for identifying potential fixed term deposit customers.

In this experiment context, **VotingEnsemble** is considered the best model, based on the **AUC_weighted** metric.  We deploy this model, but be advised, deployment takes about 20 minutes to complete.

1. On the **Run Detail** page, select the **Deploy Best Model** button.

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

1. Go to the **Assets** pane on the left and select **Deployments**. 

1. Select the deployment you want to delete and select **Delete**. 

1. Select **Proceed**.

### Delete the resource group

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this automated machine learning tutorial, you used the Azure portal to create and deploy a classification model. See these articles for more information and next steps:

> [!div class="nextstepaction"]
> [Consume a web service](how-to-consume-web-service.md)

+ Learn more about [preprocessing](how-to-create-portal-experiments.md#preprocess).
+ Learn more about [data profiling](how-to-create-portal-experiments.md#profile).
+ Learn more about [automated machine learning](concept-automated-ml.md).

>[!NOTE]
> This Bank Marketing dataset is made available under the [Creative Commons (CCO: Public Domain) License](https://creativecommons.org/publicdomain/zero/1.0/). Any rights in individual contents of the database are licensed under the [Database Contents License](https://creativecommons.org/publicdomain/zero/1.0/) and available on [Kaggle](https://www.kaggle.com/janiobachmann/bank-marketing-dataset). This dataset was originally available within the [UCI Machine Learning Database](https://archive.ics.uci.edu/ml/datasets/bank+marketing).<br><br>
> Please cite the following work: <br> [Moro et al., 2014] S. Moro, P. Cortez and P. Rita. A Data-Driven Approach to Predict the Success of Bank Telemarketing. Decision Support Systems, Elsevier, 62:22-31, June 2014.
