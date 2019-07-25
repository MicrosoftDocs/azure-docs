---
title: Create your first automated machine learning experiment
titleSuffix: Azure Machine Learning service
description: Learn how to train and deploy a classification model with automated machine learning in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: tsikiksr
author: tsikiksr
ms.reviewer: nibaccam
ms.date: 07/23/2019

---

# Tutorial: Train and deploy a classification model with automated machine learning in the Azure portal (Preview)

In this tutorial, you learn how to create your first automated machine learning experiment in the Azure portal. This example  creates a classification model to predict whether or not a client will subscribe to a term deposit with the bank. 

By using the automated machine learning capabilities of the service and the Azure portal, you launch the automated machine learning process, and the algorithm selection and hyperparameter tuning happens for you. The automated machine learning technique iterates over many combinations of algorithms and hyperparameters until it finds the best model based on your criterion, all without you having to write a single line of code.

In this tutorial, you learn the following tasks:

> [!div class="checklist"]
> * Configure an Azure Machine Learning service workspace.
> * Create an experiment.
> * Auto train a classification model.
> * View training run details.
> * Deploy the model.

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* The **bankmarketing_train.csv** data file. Download it [here](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_train.csv).

## Create a workspace

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## Create an experiment

1. Navigate to the left pane of your workspace. Select **Automated Machine Learning** under the **Authoring (Preview)** section.

    ![Azure portal navigation pane](media/tutorial-1st-experiment-automated-ml/nav-pane.png)

    As this is your first experiment with Automated Machine Learning, you'll see the **Welcome to Automated Machine Learning** screen. 

1.  Select **Create Experiment**. Then enter **my-1st-automl-experiment** as the experiment name.

1. Select **Create a new compute** and configure your compute context for this experiment.

    Field| Value
    ---|---
    Compute name| Enter a unique name that identifies your compute context. For this example we use **automl-compute**.
    Virtual machine size| Select the virtual machine size for your compute. We use **Standard_DS12_V2**.
    Additional settings| *Min node*: 1. To enable data profiling, you must have 1 or more nodes. <br> *Max node*: 6. 

    To start the creation of your new compute, select **Create**. This can take a few moments. 

    Once creation is complete, select your new compute from the dropdown, then select **Next**.

1. For this tutorial, we use the default storage account and container created with your new compute. This automatically populates in the form.

1. Select **Upload** to choose the **bankmarketing_train.csv** file from your local computer and upload it to the default container. Public preview only supports local file uploads and Azure Blob Storage accounts. When the upload is complete, select the file from the list. 

    [![Select data file](media/tutorial-1st-experiment-automated-ml/select-data-file.png)](media/tutorial-1st-experiment-automated-ml/select-data-file-expanded.png#lightbox)

1. The **Preview** tab allows us to further configure our data for this experiment.

    On the Preview tab, indicate that the data includes headers. The service defaults to including all of the features (columns) for training. For this example, scroll to the right and **Ignore** the **day_of_week** feature.

    ![Preview tab config](media/tutorial-1st-experiment-automated-ml/preview-tab-config.gif)


    >[!NOTE]
    > Data profiling is not available with computes that have 0 minimum nodes.

1. Select **Classification** as the prediction task.

1. Select **y** as the target column, the column we want to do predictions on. This column indicates if the client subscribed to a term deposit or not.

1. Expand the **Advanced Settings** and populate the fields as follows.

    Advanced settings|Value
    ------|------
    Primary metric| AUC_weighted 
    Exit criteria| When any of these criteria are met, the training job ends before full completion. <br> *Training job time (minutes)*: 5  <br> *Max number of iterations*: 10 
    Preprocessing| Enable preprocessing done by automated machine learning. This includes automatic data cleansing, preparing, and transformation to generate synthetic features.
    Validation| Select K-fold cross validation and 2 for the number of cross validations. 
    Concurrency| Select 5 for the number max concurrent iterations.

   >[!NOTE]
   > For this experiment we don't set a metric or max iterations threshold, and don't block algorithms from being tested.

1. Click **Start** to run the experiment.

   Once the experiment starts, you see a blank **Run Detail** screen with the following status at the top. The experiment preparing process takes a couple of minutes. When the preparation process completes, the status message changes to **Run is Running**.

      ![Run preparing](media/tutorial-1st-experiment-automated-ml/run-preparing.png)

##  View experiment details

As the experiment progresses, the **Run Detail** screen updates the iteration chart and list with the different iterations (models) that are run. The iterations list is in order by metric score, and by default, the model that scores the highest based on our **AUC_weighted** metric is at the top of the list.

>[!TIP]
> Training jobs can take several minutes for each pipeline to finish running.

[![Run details dashboard](media/tutorial-1st-experiment-automated-ml/run-details.png)](media/tutorial-1st-experiment-automated-ml/run-details-expanded.png#lightbox)

## Deploy model

For this experiment the **VotingEnsemble** is considered the best model based on the **AUC_weighted** metric. With automated machine learning in the Azure portal, we can deploy this model as a web service to predict on new data with one click. 

1. On the **Run Detail** page, select the **Deploy Best Model** button.

1. Populate the **Deploy Best Model** pane as follows,

    Field| Value
    ----|----
    Deployment name| my-automl-deploy
    Deployment description| My first automated machine learning experiment deployment
    Scoring script| Autogenerate
    Environment script| Autogenerate
    
1. Select **Deploy**. Deployment can take about 20 minutes to complete.

    The following message appears when deployment successfully completes.

    ![Deploy complete](media/tutorial-1st-experiment-automated-ml/deploy-complete-status.png)
    
    That's it! You have an operational web service to generate predictions.

## Clean up resources

Deployment files are larger than data and experiment files, thus they cost more to store. Delete just the deployment files to minimize costs to your account, and if you want to keep your workspace and experiment files. Otherwise, delete the entire resource group, if you don't plan to use any of the files.  

### Delete deployment instance

Delete just the deployment instance from the Azure portal, if you want to keep the resource group and workspace for other tutorials and exploration. 

1. Navigate to the **Assets** pane on the left and select **Deployments**. 

1. Select the deployment you want to delete and select **Delete**. 

1. Select **Proceed**.

### Delete resource group

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this automated machine learning tutorial, you used the Azure portal to create and deploy a classification model. See these articles for more information and next steps.

+ How to [consume a web service](how-to-consume-web-service.md).
+ Learn more about [preprocessing](how-to-create-portal-experiments.md#preprocess).
+ Learn more about [data profiling](how-to-create-portal-experiments.md#profile).
+ Learn more about [automated machine learning](concept-automated-ml.md).

>[!NOTE]
> This Bank Marketing dataset is made available under the [Creative Commons (CCO: Public Domain) License](https://creativecommons.org/publicdomain/zero/1.0/). Any rights in individual contents of the database are licensed under the [Database Contents License](https://creativecommons.org/publicdomain/zero/1.0/) and is available on [Kaggle](https://www.kaggle.com/janiobachmann/bank-marketing-dataset). This data set is originally available within the [UCI Machine Learning Database](https://archive.ics.uci.edu/ml/datasets/bank+marketing).<br><br>
>  Please cite the following work: <br> [Moro et al., 2014] S. Moro, P. Cortez and P. Rita. A Data-Driven Approach to Predict the Success of Bank Telemarketing. Decision Support Systems, Elsevier, 62:22-31, June 2014.