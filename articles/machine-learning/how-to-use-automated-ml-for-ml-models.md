---
title: Set up AutoML with the studio UI
titleSuffix: Azure Machine Learning
description: Learn how to set up AutoML training jobs without a single line of code with Azure Machine Learning automated ML in the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
author: manashgoswami 
ms.author: magoswam
ms.reviewer: ssalgado 
ms.date: 11/15/2021
ms.topic: how-to
ms.custom: automl, FY21Q4-aml-seo-hack, contperf-fy21q4, event-tier1-build-2022, ignite-2022
---

# Set up no-code AutoML training with the studio UI 

In this article, you learn how to set up AutoML training jobs without a single line of code using Azure Machine Learning automated ML in the [Azure Machine Learning studio](overview-what-is-azure-machine-learning.md#studio).

Automated machine learning, AutoML, is a process in which the best machine learning algorithm to use for your specific data is selected for you. This process enables you to generate machine learning models quickly. [Learn more about how Azure Machine Learning implements automated machine learning](concept-automated-ml.md).
 
For an end to end example, try the [Tutorial: AutoML- train no-code classification models](tutorial-first-experiment-automated-ml.md). 

For a Python code-based experience, [configure your automated machine learning experiments](how-to-configure-auto-train.md) with the Azure Machine Learning SDK.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* An Azure Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md). 

## Get started

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com). 

1. Select your subscription and workspace. 

1. Navigate to the left pane. Select **Automated ML** under the **Author** section.

[![Azure Machine Learning studio navigation pane](media/how-to-use-automated-ml-for-ml-models/nav-pane.png)](media/how-to-use-automated-ml-for-ml-models/nav-pane-expanded.png)

 If this is your first time doing any experiments, you'll see an empty list and links to documentation. 

Otherwise, you'll see a list of your recent automated  ML experiments, including those created with the SDK. 

## Create and run experiment

1. Select **+ New automated ML job** and populate the form.

1. Select a data asset from your storage container, or create a new data asset. Data asset can be created from local files, web urls, datastores, or Azure open datasets. Learn more about [data asset creation](how-to-create-data-assets.md).  

    >[!Important]
    > Requirements for training data:
    >* Data must be in tabular form.
    >* The value you want to predict (target column) must be present in the data.

    1. To create a new dataset from a file on your local computer, select **+Create dataset** and then select **From local file**. 

    1. In the **Basic info** form, give your dataset a unique name and provide an optional description. 

    1. Select **Next** to open the **Datastore and file selection form**. On this form you select where to upload your dataset; the default storage container that's automatically created with your workspace, or choose a storage container that you want to use for the experiment. 
    
        1. If your data is behind a virtual network, you need to enable the **skip the validation** function to ensure that the workspace can access your data. For more information, see [Use Azure Machine Learning studio in an Azure virtual network](how-to-enable-studio-virtual-network.md). 
    
    1. Select **Browse** to upload the data file for your dataset. 

    1. Review the **Settings and preview** form for accuracy. The form is intelligently populated based on the file type. 

        Field| Description
        ----|----
        File format| Defines the layout and type of data stored in a file.
        Delimiter| One or more characters for specifying the boundary between separate, independent regions in plain text or other data streams.
        Encoding| Identifies what bit to character schema table to use to read your dataset.
        Column headers| Indicates how the headers of the dataset, if any, will be treated.
        Skip rows | Indicates how many, if any, rows are skipped in the dataset.
    
        Select **Next**.

    1. The **Schema** form is intelligently populated based on the selections in the **Settings and preview** form. Here configure the data type for each column, review the column names, and select which columns to **Not include** for your experiment. 
            
        Select **Next.**

    1. The **Confirm details** form is a summary of the information previously populated in the **Basic info** and **Settings and preview** forms. You also have the option to create a data profile for your dataset using a profiling enabled compute. Learn more about [data profiling](v1/how-to-connect-data-ui.md#profile).

        Select **Next**.
1. Select your newly created dataset once it appears. You are also able to view a preview of the dataset and sample statistics. 

1. On the **Configure job** form, select **Create new** and enter **Tutorial-automl-deploy** for the experiment name.

1. Select a target column; this is the column that you would like to do predictions on.

1. Select a compute type for the data profiling and training job. You can select a [compute cluster](concept-compute-target.md#azure-machine-learning-compute-managed) or [compute instance](concept-compute-instance.md). 
    
1. Select a compute from the dropdown list of your existing computes.  To create a new compute, follow the instructions in step 8.

1. Select **Create a new compute** to configure your compute context for this experiment.

    Field|Description
    ---|---
    Compute name| Enter a unique name that identifies your compute context.
    Virtual machine priority| Low priority virtual machines are cheaper but don't guarantee the compute nodes. 
    Virtual machine type| Select CPU or GPU for virtual machine type.
    Virtual machine size| Select the virtual machine size for your compute.
    Min / Max nodes| To profile data, you must specify 1 or more nodes. Enter the maximum number of nodes for your compute. The default is 6 nodes for an AzureML Compute.
    Advanced settings | These settings allow you to configure a user account and existing virtual network for your experiment. 
    
    Select **Create**. Creation of a new compute can take a few minutes.

    >[!NOTE]
    > Your compute name will indicate if the compute you select/create is *profiling enabled*. (See the section [data profiling](v1/how-to-connect-data-ui.md#profile) for more details).

    Select **Next**.

1. On the **Task type and settings** form, select the task type: classification, regression, or forecasting. See [supported task types](concept-automated-ml.md#when-to-use-automl-classification-regression-forecasting-computer-vision--nlp) for more information.

    1. For **classification**, you can also enable deep learning.
    
        If deep learning is enabled, validation is limited to _train_validation split_. [Learn more about validation options](how-to-configure-cross-validation-data-splits.md).

    1. For **forecasting** you can, 
    
        1. Enable deep learning.
    
        1. Select *time column*: This column contains the time data to be used.

        1. Select *forecast horizon*: Indicate how many time units (minutes/hours/days/weeks/months/years) will the model be able to predict to the future. The further the model is required to predict into the future, the less accurate it becomes. [Learn more about forecasting and forecast horizon](how-to-auto-train-forecast.md).

1. (Optional) View addition configuration settings: additional settings you can use to better control the training job. Otherwise, defaults are applied based on experiment selection and data. 

    Additional configurations|Description
    ------|------
    Primary metric| Main metric used for scoring your model. [Learn more about model metrics](how-to-configure-auto-train.md#primary-metric).
    Explain best model | Select to enable or disable, in order to show explanations for the recommended best model. <br> This functionality is not currently available for [certain forecasting algorithms](how-to-machine-learning-interpretability-automl.md#interpretability-during-training-for-the-best-model). 
    Blocked algorithm| Select algorithms you want to exclude from the training job. <br><br> Allowing algorithms is only available for [SDK experiments](how-to-configure-auto-train.md#supported-algorithms). <br> See the [supported algorithms for each task type](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels).
    Exit criterion| When any of these criteria are met, the training job is stopped. <br> *Training job time (hours)*: How long to allow the training job to run. <br> *Metric score threshold*:  Minimum metric score for all pipelines. This ensures that if you have a defined target metric you want to reach, you do not spend more time on the training job than necessary.
    Concurrency| *Max concurrent iterations*: Maximum number of pipelines (iterations) to test in the training job. The job will not run more than the specified number of iterations. Learn more about how automated ML performs [multiple child jobs on clusters](how-to-configure-auto-train.md#multiple-child-runs-on-clusters).

1. (Optional) View featurization settings: if you choose to enable **Automatic featurization** in the **Additional configuration settings** form, default featurization techniques are applied. In the **View featurization settings** you can change these defaults and customize accordingly. Learn how to [customize featurizations](#customize-featurization). 

    ![Screenshot shows the Select task type dialog box with View featurization settings called out.](media/how-to-use-automated-ml-for-ml-models/view-featurization-settings.png)


1. The **[Optional] Validate and test** form allows you to do the following. 

    1. Specify the type of validation to be used for your training job. [Learn more about cross validation](how-to-configure-cross-validation-data-splits.md#prerequisites). 
    
        1. Forecasting tasks only supports k-fold cross validation.
    
    1. Provide a test dataset (preview) to evaluate the recommended model that automated ML generates for you at the end of your experiment. When you provide test data, a test job is automatically triggered at the end of your experiment. This test job is only job on the best model that was recommended by automated ML. Learn how to get the [results of the remote test job](#view-remote-test-job-results-preview).
    
        >[!IMPORTANT]
        > Providing a test dataset to evaluate generated models is a preview feature. This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time.
        
        * Test data is considered a separate from training and validation, so as to not bias the results of the test job of the recommended model. [Learn more about bias during model validation](concept-automated-ml.md#training-validation-and-test-data).
        * You can either provide your own test dataset or opt to use a percentage of your training dataset. Test data must be in the form of an [Azure Machine Learning TabularDataset](./v1/how-to-create-register-datasets.md#tabulardataset).         
        * The schema of the test dataset should match the training dataset. The target column is optional, but if no target column is indicated no test metrics are calculated.
        * The test dataset should not be the same as the training dataset or the validation dataset.
        * Forecasting jobs do not support train/test split.
        
        ![Screenshot shows the form where to select validation data and test data](media/how-to-use-automated-ml-for-ml-models/validate-test-form.png)
        
## Customize featurization

In the **Featurization** form, you can enable/disable automatic featurization and customize the automatic featurization settings for your experiment. To open this form, see step 10 in the [Create and run experiment](#create-and-run-experiment) section. 

The following table summarizes the customizations currently available via the studio. 

Column| Customization
---|---
Included | Specifies which columns to include for training.
Feature type| Change the value type for the selected column.
Impute with| Select what value to impute missing values with in your data.

![Azure Machine Learning studio custom featurization](media/how-to-use-automated-ml-for-ml-models/custom-featurization.png)

## Run experiment and view results

Select **Finish** to run your experiment. The experiment preparing process can take up to 10 minutes. Training jobs can take an additional 2-3 minutes more for each pipeline to finish running.

> [!NOTE]
> The algorithms automated ML employs have inherent randomness that can cause slight variation in a recommended model's final metrics score, like accuracy. Automated ML also performs operations on data such as train-test split, train-validation split or cross-validation when necessary. So if you run an experiment with the same configuration settings and primary metric multiple times, you'll likely see variation in each experiments final metrics score due to these factors. 

### View experiment details

The **Job Detail** screen opens to the **Details** tab. This screen shows you a summary of the experiment job including a status bar at the top next to the job number. 

The **Models** tab contains a list of the models created ordered by the metric score. By default, the model that scores the highest based on the chosen metric is at the top of the list. As the training job tries out more models, they are added to the list. Use this to get a quick comparison of the metrics for the models produced so far.

![Job detail](./media/how-to-use-automated-ml-for-ml-models/explore-models.gif)

### View training job details

Drill down on any of the completed models to see training job details. On the **Model** tab view details like a model summary and the hyperparameters used for the selected model. 

[![Hyperparameter details](media/how-to-use-automated-ml-for-ml-models/hyperparameter-button.png)](media/how-to-use-automated-ml-for-ml-models/hyperparameter-details.png)

 You can also see model specific performance metric charts on the **Metrics** tab. [Learn more about charts](how-to-understand-automated-ml.md).

![Iteration details](media/how-to-use-automated-ml-for-ml-models/iteration-details-expanded.png)

On the Data transformation tab, you can see a diagram of what data preprocessing, feature engineering, scaling techniques and the machine learning algorithm that were applied to generate this model.

>[!IMPORTANT]
> The Data transformation tab is in preview. This capability should be considered [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) and may change at any time.

![Data transformation](./media/how-to-use-automated-ml-for-ml-models/data-transformation.png)

## View remote test job results (preview)

If you specified a test dataset or opted for a train/test split during your experiment setup-- on the **Validate and test** form, automated ML automatically tests the recommended model by default. As a result, automated ML calculates test metrics to determine the quality of the recommended model and its predictions. 

>[!IMPORTANT]
> Testing your models with a test dataset to evaluate generated models is a preview feature. This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time.

> [!WARNING]
> This feature is not available for the following automated ML scenarios
>  * [Computer vision tasks](how-to-auto-train-image-models.md)
>  * [Many models and hiearchical time series forecasting training (preview)](how-to-auto-train-forecast.md)
>  * [Forecasting tasks where deep learning neural networks (DNN) are enabled](how-to-auto-train-forecast.md#enable-deep-learning)
>  * [Automated ML jobs from local computes or Azure Databricks clusters](how-to-configure-auto-train.md#compute-to-run-experiment)

To view the test job metrics of the recommended model,
 
1. Navigate to the **Models** page, select the best model. 
1. Select the **Test results (preview)** tab. 
1. Select the job you want, and view the **Metrics** tab.
    ![Test results tab of automatically tested, recommended model](./media/how-to-use-automated-ml-for-ml-models/test-best-model-results.png)
    
To view the test predictions used to calculate the test metrics, 

1. Navigate to the bottom of the page and select the link under **Outputs dataset** to open the dataset. 
1. On the **Datasets** page, select the **Explore** tab to view the predictions from the test job.
    1. Alternatively, the prediction file can also be viewed/downloaded from the **Outputs + logs** tab, expand the **Predictions** folder to locate your `predicted.csv` file.

Alternatively, the predictions file can also be viewed/downloaded from the Outputs + logs tab, expand Predictions folder to locate your predictions.csv file.

The model test job generates the predictions.csv file that's stored in the default datastore created with the workspace. This datastore is visible to all users with the same subscription. Test jobs are not recommended for scenarios if any of the information used for or created by the test job needs to remain private.

## Test an existing automated ML model (preview)

>[!IMPORTANT]
> Testing your models with a test dataset to evaluate generated models is a preview feature. This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time.

> [!WARNING]
> This feature is not available for the following automated ML scenarios
>  * [Computer vision tasks](how-to-auto-train-image-models.md)
>  * [Many models and hiearchical time series forecasting training (preview)](how-to-auto-train-forecast.md)
>  * [Forecasting tasks where deep learning neural networks (DNN) are enabled](how-to-auto-train-forecast.md#enable-deep-learning)
>  * [Automated ML runs from local computes or Azure Databricks clusters](how-to-configure-auto-train.md#compute-to-run-experiment)

After your experiment completes, you can test the model(s) that automated ML generates for you. If you want to test a different automated ML generated model, not the recommended model, you can do so with the following steps. 

1. Select an existing automated ML experiment job.  
1. Navigate to the **Models** tab of the job and select the completed model you want to test.
1. On the model **Details** page, select the **Test model(preview)** button to open the **Test model** pane.
1. On the **Test model** pane, select the compute cluster and a test dataset you want to use for your test job. 
1. Select the **Test** button. The schema of the test dataset should match the training dataset, but the **target column** is optional.
1. Upon successful creation of model test job, the **Details** page displays a success message. Select the **Test results** tab to see the progress of the job.

1. To view the results of the test job, open the **Details** page and follow the steps in the [view results of the remote test job](#view-remote-test-job-results-preview) section. 

    ![Test model form](./media/how-to-use-automated-ml-for-ml-models/test-model-form.png)
    

## Model explanations (preview)

To better understand your model, you can see which data features (raw or engineered) influenced the model's predictions with the model explanations dashboard. 

The model explanations dashboard provides an overall analysis of the trained model along with its predictions and explanations. It also lets you drill into an individual data point and its individual feature importance. [Learn more about the explanation dashboard visualizations](how-to-machine-learning-interpretability-aml.md#visualizations).

To get explanations for a particular model, 

1. On the **Models** tab, select the model you want to understand. 
1. Select the **Explain model** button, and provide a compute that can be used to generate the explanations.
1. Check the **Child jobs** tab for the status. 
1. Once complete, navigate to the **Explanations (preview)** tab which contains the explanations dashboard. 

    ![Model explanation dashboard](media/how-to-use-automated-ml-for-ml-models/model-explanation-dashboard.png)

## Edit and submit jobs (preview)

>[!IMPORTANT]
> The ability to copy, edit and submit a new experiment based on an existing experiment is a preview feature. This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time.

In scenarios where you would like to create a new experiment based on the settings of an existing experiment, automated ML provides the option to do so with the **Edit and submit** button in the studio UI.  

This functionality is limited to experiments initiated from the studio UI and requires the data schema for the new experiment to match that of the original experiment. 

The **Edit and submit** button opens the **Create a new Automated ML job** wizard with the data, compute and experiment settings pre-populated. You can go through each form and edit selections as needed for your new experiment. 

## Deploy your model

Once you have the best model at hand, it is time to deploy it as a web service to predict on new data.

>[!TIP]
> If you are looking to deploy a model that was generated via the `automl` package with the Python SDK, you must [register your model](./v1/how-to-deploy-and-where.md) to the workspace. 
>
> Once you're model is registered, find it in the studio by selecting **Models** on the left pane. Once you open your model, you can select the **Deploy** button at the top of the screen, and then follow the instructions as described in **step 2** of the **Deploy your model** section.

Automated ML helps you with deploying the model without writing code:

1. You have a couple options for deployment. 

    + Option 1: Deploy the best model, according to the metric criteria you defined. 
        1. After the experiment is complete, navigate to the parent job page by selecting **Job 1** at the top of the screen. 
        1.  Select the model listed in the **Best model summary** section. 
        1. Select **Deploy** on the top left of the window. 

    + Option 2: To deploy a specific model iteration from this experiment.
        1. Select the desired model from the **Models** tab
        1. Select **Deploy** on the top left of the window.

1. Populate the **Deploy model** pane.

    Field| Value
    ----|----
    Name| Enter a unique name for your deployment.
    Description| Enter a description to better identify what this deployment is for.
    Compute type| Select the type of endpoint you want to deploy: [*Azure Kubernetes Service (AKS)*](../aks/intro-kubernetes.md) or [*Azure Container Instance (ACI)*](../container-instances/container-instances-overview.md).
    Compute name| *Applies to AKS only:* Select the name of the AKS cluster you wish to deploy to.
    Enable authentication | Select to allow for token-based or key-based authentication.
    Use custom deployment assets| Enable this feature if you want to upload your own scoring script and environment file. Otherwise, automated ML provides these assets for you by default. [Learn more about scoring scripts](./v1/how-to-deploy-and-where.md).

    >[!Important]
    > File names must be under 32 characters and must begin and end with alphanumerics. May include dashes, underscores, dots, and alphanumerics between. Spaces are not allowed.

    The *Advanced* menu offers default deployment features such as [data collection](how-to-enable-app-insights.md) and resource utilization settings. If you wish to override these defaults do so in this menu.

1. Select **Deploy**. Deployment can take about 20 minutes to complete.
    Once deployment begins, the **Model summary** tab appears. See the deployment progress under the **Deploy status** section. 

Now you have an operational web service to generate predictions! You can test the predictions by querying the service from [Power BI's built in Azure Machine Learning support](/power-bi/connect-data/service-aml-integrate?context=azure%2fmachine-learning%2fcontext%2fml-context).

## Next steps

* [Learn how to consume a web service](v1/how-to-consume-web-service.md).
* [Understand automated machine learning results](how-to-understand-automated-ml.md).
* [Learn more about automated machine learning](concept-automated-ml.md) and Azure Machine Learning.
