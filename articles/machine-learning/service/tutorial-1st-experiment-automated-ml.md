---
title: Create you first automated machine learning experiment
titleSuffix: Azure Machine Learning service
description: Learn how to train and deploy a classification model with automated machine learning in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: tsikiksr
author: tsikiksr
ms.reviewer: nibaccam
ms.date: 07/22/2019

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
    1. Once creation is complete, select your new compute from the dropdown, then select **Next**.

1. For this tutorial, we use the default storage account and container created with your new compute. This automatically populates in the form.

1.  Upload the **bankmarketing_train.csv** file from your local computer to the default container. Public preview only supports local file uploads and Azure Blob Storage accounts. When the upload is complete, select the file from the list. 

    ![Select bankmarketing_train.csv data file for experiment](media/tutorial-1st-experiment-automated-ml/select-data-file.png)

1. Use the preview and profile tabs to further configure your data for this experiment.

    1. On the Preview tab, indicate if your data includes headers, and select the features (columns) for training using the **Included** switch buttons in each feature column. 

        For this example, scroll to the right and **don't include** the **day_of_week** feature.

         ![Ignore feature](media/tutorial-1st-experiment-automated-ml/ignore-feature.png)

     On the Profile tab, you can view the data profile by feature, as well as the distribution, type, and summary statistics (mean, median, max/min, and so on) of each.
        
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

To run the experiment, click **Start**. 

##  View experiment details

The experiment preparing process takes a couple of minutes.

  ![Run preparing](media/tutorial-1st-experiment-automated-ml/run-preparing.png)

Once the experiment preparation phase is done, you'll see the **Run Detail** screen. As the training job tries out different iterations (models), they are added to the iteration list and chart. The iterations list is in order by metric score; by default, the model that scores the highest based on our **AUC_weighted** metric is at the top of the list.

>[!TIP]
> Training jobs can take several minutes for each pipeline to finish running.

![Run details dashboard](media/tutorial-1st-experiment-automated-ml/run-details.png)

## Deploy model

For this experiment the **VotingEnsemble** is considered the best model based on the **AUC_weighted** metric. Now we deploy this model as a web service to predict on new data.

Automated machine learning in the Azure portal makes model deployment possible with one click. 

1. Go back to the **Run Detail** page, select the **Deploy Best Model** button.

1. Populate the **Deploy Best Model** pane as follows,

    Field| Value
    ----|----
    Deployment name| my-automl-deploy
    Deployment description| My first automated machine learning experiment deployment
    Scoring script| Autogenerate
    Environment script| Autogenerate
    
1. Select **Deploy**. Deployment can take about 20 minutes to complete.

1. The following message appears when deployment successfully completes.

    ![Deploy complete](media/tutorial-1st-experiment-automated-ml/deploy-complete-status.png)
    
    That's it! You have an operational web service to generate predictions.

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

### Delete deployment instance

To keep the resource group and workspace for other tutorials and exploration, you can delete only the Azure Container Instance deployment from the Azure portal. 

1. Navigate to the **Assets** pane on the left and select **Deployments**. 

1. Select the deployment you want to delete and select **Delete**. 

1. Select **Proceed**.

## Next steps

In this automated machine learning tutorial, you used the Azure portal to create and deploy a classification model. See these articles for more information and next steps.

+ How to [consume a web service](how-to-consume-web-service.md).
+ Learn more about [preprocessing](how-to-create-portal-experiments.md#preprocess)
+ Learn more about [data profiling](how-to-create-portal-experiments.md#profile)
+ Learn more about [automated machine learning](concept-automated-ml.md)

>[!NOTE]
> This Bank Marketing dataset is made available under the [Creative Commons (CCO: Public Domain) License](https://creativecommons.org/publicdomain/zero/1.0/). Any rights in individual contents of the database are licensed under the [Database Contents License](https://creativecommons.org/publicdomain/zero/1.0/) and is available on [Kaggle](https://www.kaggle.com/janiobachmann/bank-marketing-dataset). This data set is originally available within the [UCI Machine Learning Database](https://archive.ics.uci.edu/ml/datasets/bank+marketing).<br><br>
>  Please cite the following work: <br> [Moro et al., 2014] S. Moro, P. Cortez and P. Rita. A Data-Driven Approach to Predict the Success of Bank Telemarketing. Decision Support Systems, Elsevier, 62:22-31, June 2014.