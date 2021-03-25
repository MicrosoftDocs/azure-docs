---
title: Create automated ML classification models
titleSuffix: Azure Machine Learning
description: Learn how to train & deploy classification models with Azure Machine Learning's automated machine learning (automated ML)  interface.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: cartacioS
ms.author: sacartac
ms.reviewer: nibaccam
ms.date: 12/21/2020
ms.custom: automl
# Customer intent: As a non-coding data scientist, I want to use automated machine learning techniques so that I can build a classification model.
---

# Tutorial: Create a classification model with automated ML in Azure Machine Learning

In this tutorial, you learn how to create a simple classification model without writing a single line of code using automated machine learning in the Azure Machine Learning studio. This classification model predicts if a client will subscribe to a fixed term deposit with a financial institution.

With automated machine learning, you can automate away time intensive tasks. Automated machine learning rapidly iterates over many combinations of algorithms and hyperparameters to help you find the best model based on a success metric of your choosing.

For a time-series forecasting example, see [Tutorial: Demand forecasting & AutoML](tutorial-automated-ml-forecast.md).

You won't write any code in this tutorial, you'll use the studio interface to perform training.  For a code first experience, follow the [Tutorial: Use automated machine learning to predict taxi fares](tutorial-auto-train-models.md).

In this tutorial, you learn how to do the following tasks:

> [!div class="checklist"]
> * Create an Azure Machine Learning workspace.
> * Run an automated machine learning experiment.
> * View experiment details.
> * Deploy the model.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree).

* Download the [**bankmarketing_train.csv**](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_train.csv) data file. The **y** column indicates if a customer subscribed to a fixed term deposit, which is later identified as the target column for predictions in this tutorial. 

## Create a workspace

An Azure Machine Learning workspace is a foundational resource in the cloud that you use to experiment, train, and deploy machine learning models. It ties your Azure subscription and resource group to an easily consumed object in the service. 

There are many [ways to create a workspace](how-to-manage-workspace.md). In this tutorial, you create a workspace via the Azure portal, a web-based console for managing your Azure resources.

[!INCLUDE [aml-create-portal](../../includes/aml-create-in-portal.md)]

>[!IMPORTANT] 
> Take note of your **workspace** and **subscription**. You'll need these to ensure you create your experiment in the right place. 

## Get started in Azure Machine Learning studio

You complete the following experiment set-up and run steps  via the Azure Machine Learning studio at https://ml.azure.com, a consolidated web interface that includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels. The studio is not supported on Internet Explorer browsers.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).

1. Select your subscription and the workspace you created.

1. Select **Get started**.

1. In the left pane, select **Automated ML** under the **Author** section.

   Since this is your first automated ML experiment, you'll see an empty list and links to documentation.

   ![Get started page](./media/tutorial-first-experiment-automated-ml/get-started.png)

1. Select **+New automated ML run**. 

## Create and load dataset

Before you configure your experiment, upload your data file to your workspace in the form of an Azure Machine Learning dataset. Doing so, allows you to ensure that your data is formatted appropriately for your experiment.

1. Create a new dataset by selecting **From local files** from the  **+Create dataset** drop-down. 

    1. On the **Basic info** form, give your dataset a name and provide an optional description. The automated ML interface currently only supports TabularDatasets, so the dataset type should default to *Tabular*.

    1. Select **Next** on the bottom left

    1. On the **Datastore and file selection** form, select the default datastore that was automatically set up during your workspace creation, **workspaceblobstore (Azure Blob Storage)**. This is where you'll upload your data file to make it available to your workspace.

    1. Select **Browse**.
    
    1. Choose the **bankmarketing_train.csv** file on your local computer. This is the file you downloaded as a [prerequisite](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_train.csv).

    1. Give your dataset a unique name and provide an optional description. 

    1. Select **Next** on the bottom left, to  upload it to the default container that was automatically set up during your workspace creation.  
    
       When the upload is complete, the Settings and preview form is pre-populated based on the file type. 
       
    1. Verify that the **Settings and preview** form is populated as follows and select **Next**.
        
        Field|Description| Value for tutorial
        ---|---|---
        File format|Defines the layout and type of data stored in a file.| Delimited
        Delimiter|One or more characters for specifying the boundary between&nbsp; separate, independent regions in plain text or other data streams. |Comma
        Encoding|Identifies what bit to character schema table to use to read your dataset.| UTF-8
        Column headers| Indicates how the headers of the dataset, if any, will be treated.| All files have same headers
        Skip rows | Indicates how many, if any, rows are skipped in the dataset.| None

    1. The **Schema** form allows for further configuration of your data for this experiment. For this example, select the toggle switch for the **day_of_week**, so as to not include it. Select **Next**.
         ![Schema form](./media/tutorial-first-experiment-automated-ml/schema-tab-config.gif)
    1. On the **Confirm details** form, verify the information matches what was previously  populated on the **Basic info, Datastore and file selection** and **Settings and preview** forms.
    
    1. Select **Create** to complete the creation of your dataset.
    
    1. Select your dataset once it appears in the list.
    
    1. Review the **Data preview**  to ensure you didn't include **day_of_week** then, select **Close**.

    1. Select  **Next**.

## Configure run

After you load and configure your data, you can set up your experiment. This setup includes experiment design tasks such as, selecting the size of your compute environment and specifying what column you want to predict. 

1. Select the **Create new** radio button.

1. Populate the **Configure Run** form as follows:
    1. Enter this experiment name: `my-1st-automl-experiment`

    1. Select **y** as the target column, what you want to predict. This column indicates whether the client subscribed to a term deposit or not.
    
    1. Select **+Create a new compute** and configure your compute target. A compute target is a local or cloud-based resource environment used to run your training script or host your service deployment. For this experiment, we use a cloud-based compute. 
        1. Populate the **Virtual Machine** form to set up your compute.

            Field | Description | Value for tutorial
            ----|---|---
            Virtual&nbsp;machine&nbsp;priority |Select what priority your experiment should have| Dedicated
            Virtual&nbsp;machine&nbsp;type| Select the virtual machine type for your compute.|CPU (Central Processing Unit)
            Virtual&nbsp;machine&nbsp;size| Select the virtual machine size for your compute. A list of recommended sizes is provided based on your data and experiment type. |Standard_DS12_V2
        
        1. Select **Next** to populate the **Configure settings form**.
        
            Field | Description | Value for tutorial
            ----|---|---
            Compute name |	A unique name that identifies your compute context. | automl-compute
            Min / Max nodes| To profile data, you must specify 1 or more nodes.|Min nodes: 1<br>Max nodes: 6
            Idle seconds before scale down | Idle time before  the cluster is automatically scaled down to the minimum node count.|120 (default)
            Advanced settings | Settings to configure and authorize a virtual network for your experiment.| None               

        1. Select **Create** to create your compute target. 

            **This takes a couple minutes to complete.** 

             ![Settings page](./media/tutorial-first-experiment-automated-ml/compute-settings.png)

        1. After creation, select your new compute target from the drop-down list.

    1. Select **Next**.

1. On the **Task type and settings** form, complete the setup for your automated ML experiment by specifying the machine learning task type and configuration settings.
    
    1.  Select **Classification** as the machine learning task type.

    1. Select **View additional configuration settings** and populate the fields as follows. These settings are to better control the training job. Otherwise, defaults are applied based on experiment selection and data.

        Additional&nbsp;configurations|Description|Value&nbsp;for&nbsp;tutorial
        ------|---------|---
        Primary metric| Evaluation metric that the machine learning algorithm will be measured by.|AUC_weighted
        Explain best model| Automatically shows explainability on the best model created by automated ML.| Enable
        Blocked algorithms | Algorithms you want to exclude from the training job| None
        Exit criterion| If a criteria is met, the training job is stopped. |Training&nbsp;job&nbsp;time (hours): 1 <br> Metric&nbsp;score&nbsp;threshold: None
        Validation | Choose a cross-validation type and number of tests.|Validation type:<br>&nbsp;k-fold&nbsp;cross-validation <br> <br> Number of validations: 2
        Concurrency| The maximum number of parallel iterations executed per iteration| Max&nbsp;concurrent&nbsp;iterations: 5
        
        Select **Save**.
    
1. Select **Finish** to run the experiment. The **Run Detail**  screen opens with the **Run status** at the top as the experiment preparation begins. This status updates as the experiment progresses. Notifications also appear in the top right corner of the studio, to inform you of the status of your experiment.

>[!IMPORTANT]
> Preparation takes **10-15 minutes** to prepare the experiment run.
> Once running, it takes **2-3 minutes more for each iteration**.  <br> <br>
> In production, you'd likely walk away for a bit. But for this tutorial, we suggest you start exploring the tested algorithms on the **Models** tab as they complete while the others are still running. 

##  Explore models

Navigate to the **Models** tab to see the algorithms (models) tested. By default, the models are ordered by metric score as they complete. For this tutorial, the model that scores the highest based on the chosen **AUC_weighted** metric is at the top of the list.

While you wait for all of the experiment models to finish, select the **Algorithm name** of a completed model to explore its performance details. 

The following navigates through the **Details** and the **Metrics** tabs to view the selected model's properties, metrics, and performance charts. 

![Run iteration detail](./media/tutorial-first-experiment-automated-ml/run-detail.gif)

## Model explanations

While you wait for the models to complete, you can also take a look at model explanations and see which data features (raw or engineered) influenced a particular model's predictions. 

These model explanations can be generated on demand, and are summarized in the model explanations dashboard  that's part of the **Explanations (preview)** tab.

To generate model explanations, 
 
1. Select **Run 1** at the top to navigate back to the **Models** screen. 
1. Select the **Models** tab.
1. For this tutorial, select the first **MaxAbsScaler, LightGBM** model.
1. Select the **Explain model** button at the top. On the right, the **Explain model** pane appears. 
1. Select the **automl-compute** that you created previously. This compute cluster initiates a child run to generate the model explanations.
1. Select **Create** at the bottom. A green success message appears towards the top of your screen. 
    >[!NOTE]
    > The explainability run takes about 2-5 minutes to complete.
1. Select the **Explanations (preview)** button. This tab populates once the explainability run completes.
1. On the left hand side, expand the pane and select the row that says **raw** under **Features**. 
1. Select the **Aggregate feature importance** tab on the right. This chart shows which data features influenced the predictions of the selected model. 

    In this example, the *duration* appears to have the most influence on the predictions of this model.
    
    ![Model explanation dashboard](media/tutorial-first-experiment-automated-ml/model-explanation-dashboard.png)

## Deploy the best model

The automated machine learning interface allows you to deploy the best model as a web service in a few steps. Deployment is the integration of the model so it can predict on new data and identify potential areas of opportunity. 

For this experiment, deployment to a web service means that the financial institution now has an iterative and scalable web solution for identifying potential fixed term deposit customers. 

Check to see if your experiment run is complete. To do so,  navigate back to the parent run page by selecting **Run 1** at the top of your screen. A **Completed** status is shown on the top left of the screen. 

Once the experiment run is complete, the **Details** page is populated with a **Best model summary** section. In this experiment context, **VotingEnsemble** is considered the best model, based on the **AUC_weighted** metric.  

We deploy this model, but be advised, deployment takes about 20 minutes to complete. The deployment process entails several steps including registering the model, generating resources, and configuring them for the web service.

1. Select **VotingEnsemble** to open the model-specific page.

1. Select the **Deploy** button in the top-left.

1. Populate the **Deploy a model** pane as follows:

    Field| Value
    ----|----
    Deployment name| my-automl-deploy
    Deployment description| My first automated machine learning experiment deployment
    Compute type | Select Azure Compute Instance (ACI)
    Enable authentication| Disable. 
    Use custom deployments| Disable. Allows for the default driver file (scoring script) and environment file to be auto-generated. 
    
    For this example, we use the defaults provided in the *Advanced* menu. 

1. Select **Deploy**.  

    A green success message appears at the top of the **Run** screen, and in the **Model summary** pane, a status message appears under **Deploy status**. Select **Refresh** periodically to check the deployment status.
    
Now you have an operational web service to generate predictions. 

Proceed to the [**Next Steps**](#next-steps) to learn more about how to consume your new web service, and test your predictions using Power BI's built in Azure Machine Learning support.

## Clean up resources

Deployment files are larger than data and experiment files, so they cost more to store. Delete only the deployment files to minimize costs to your account, or if you want to keep your workspace and experiment files. Otherwise, delete the entire resource group, if you don't plan to use any of the files.  

### Delete the deployment instance

Delete just the deployment instance from Azure Machine Learning at https:\//ml.azure.com/, if you want to keep the resource group and workspace for other tutorials and exploration. 

1. Go to [Azure Machine Learning](https://ml.azure.com/). Navigate to your workspace and  on the left under the **Assets** pane, select **Endpoints**. 

1. Select the deployment you want to delete and select **Delete**. 

1. Select **Proceed**.

### Delete the resource group

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

In this automated machine learning tutorial, you used Azure Machine Learning's automated ML interface to create and deploy a classification model. See these articles for more information and next steps:

> [!div class="nextstepaction"]
> [Consume a web service](/power-bi/connect-data/service-aml-integrate?context=azure%2fmachine-learning%2fcontext%2fml-context)

+ Learn more about [automated machine learning](concept-automated-ml.md).
+ For more information on classification metrics and charts, see the [Understand automated machine learning results](how-to-understand-automated-ml.md) article.
+ Learn more about [featurization](how-to-configure-auto-features.md#featurization).
+ Learn more about [data profiling](how-to-connect-data-ui.md#profile).


>[!NOTE]
> This Bank Marketing dataset is made available under the [Creative Commons (CCO: Public Domain) License](https://creativecommons.org/publicdomain/zero/1.0/). Any rights in individual contents of the database are licensed under the [Database Contents License](https://creativecommons.org/publicdomain/zero/1.0/) and available on [Kaggle](https://www.kaggle.com/janiobachmann/bank-marketing-dataset). This dataset was originally available within the [UCI Machine Learning Database](https://archive.ics.uci.edu/ml/datasets/bank+marketing).<br><br>
> [Moro et al., 2014] S. Moro, P. Cortez and P. Rita. A Data-Driven Approach to Predict the Success of Bank Telemarketing. Decision Support Systems, Elsevier, 62:22-31, June 2014.
