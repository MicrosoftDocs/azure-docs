---
title: Create and explore experiments in Portal
titleSuffix: Azure Machine Learning service
description: Learn how to create and manage automated machine learning experiments in portal
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: cgronlun
author: tsikiksr
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 05/02/2019

---

# Create and explore automated machine learning experiments in the Azure portal (Preview)

 In this article, you learn how to create, run, and explore automated machine learning experiments in the Azure portal without a single line of code. Automated machine learning automates the process of selecting the best algorithm to use for your specific data, so you can generate a machine learning model quickly. [Learn more about automated machine learning](concept-automated-ml.md).

 If you prefer a more code-based experience, you can also [configure your automated machine learning experiments in Python](how-to-configure-auto-train.md) with the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An Azure Machine Learning service workspace. See [Create an Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/setup-create-workspace).

## Get started

Navigate to the left pane of your workspace. Select Automated Machine Learning under the Authoring (Preview) section.

![Azure portal navigation pane](media/how-to-create-portal-experiments/nav-pane.png)

 If this is your first time doing any experiments with Automated Machine Learning, you'll see the following:

![Azure portal experiment landing page](media/how-to-create-portal-experiments/landing-page.png)

Otherwise, you will see your Automated machine learning dashboard with an overview of all of your automated machine learning experiments, including those created with the SDK. Here you can filter and explore your runs by date, experiment name, and run status.

![Azure portal experiment dashboard](media/how-to-create-portal-experiments/dashboard.png)

## Create an experiment

Select the Create Experiment button to populate the following form.

![Create experiment form](media/how-to-create-portal-experiments/create-exp-name-compute.png)

1. Enter your experiment name.

1. Select a compute for the data profiling and training job. A list of your existing computes is available in the dropdown. To create a new compute, follow the instructions in step 3.

1. Select the Create a new compute button to open the below pane, and configure your compute context for this experiment.

    ![Create new compute for experiment](media/how-to-create-portal-experiments/create-new-compute.png)

    Field|Description
    ---|---
    Compute name| Enter a unique name that identifies your compute context.
    Virtual machine size| Select the virtual machine size for your compute.
    Additional settings| *Min node*: Enter the minimum number of nodes for your compute. The minimum number of nodes for AML compute is 0. To enable data profiling, you must have 1 or more nodes. <br> *Max node*: Enter the maximum number of nodes for your compute. The default is 6 nodes for an AML Compute.

      To start the creation of your new compute, select **Create**. This can take a few moments.

      >[!NOTE]
      > Your compute name will indicate if the compute you select/create is *profiling enabled*. (See 7b for more details on data profiling).

1. Select a storage account for your data. Public preview only supports local file uploads and Azure Blob Storage accounts.

1. Select a storage container.

1. Select a data file from your storage container, or upload a file from your local computer to the container.

    ![Select data file for experiment](media/how-to-create-portal-experiments/select-file.png)

1. Use the preview and profile tabs to further configure your data for this experiment.

    1. On the Preview tab, indicate if your data includes headers, and select the features (columns) for training using the **Included** switch buttons in each feature column.

        ![Data preview](media/how-to-create-portal-experiments/data-preview.png)

    1. On the Profile tab, you can view the [data profile](#profile) by feature, as well as the distribution, type, and summary statistics (mean, median, max/min, and so on) of each.

        ![Data profile tab](media/how-to-create-portal-experiments/data-profile.png)

        >[!NOTE]
        > The following error message will appear if your compute context is **not** profiling enabled: *Data profiling is only available for compute targets that are already running*.

1. Select the training job type: classification, regression, or forecasting.

1. Select target column. The column which you would like to do the predictions on.

1. For forecasting:
    1. Select time column: This column contains the time data to be used.
    1. Select forecast horizon: Indicate how many time units (minutes/hours/days/weeks/months/years) will the model be able to predict to the future. The further the model is required to predict into the future, the less accurate it will become. [Learn more about forecasting and forecast horizon](how-to-auto-train-forecast.md).

1. (Optional) Advanced settings: additional settings you can use to better control the training job.

    Advanced settings|Description
    ------|------
    Primary metric| Main metric used for scoring your model. [Learn more about model metrics](how-to-configure-auto-train.md#explore-model-metrics).
    Exit criteria| When any of these criteria are met, the training job ends before full completion. <br> *Training job time (minutes)*: How long to allow the training job to run.  <br> *Max number of iterations*: Maximum number of pipelines (iterations) to test in the training job. The job will not run more than the specified number of iterations. <br> *Metric score threshold*:  Minimum metric score for all pipelines. This ensures that if you have a defined target metric you want to reach, you do not spend more time on the training job than necessary.
    Preprocessing| Select to enable or disable the preprocessing done by automated machine learning. Preprocessing includes automatic data cleansing, preparing, and transformation to generate synthetic features. [Learn more about preprocessing](#preprocess).
    Validation| Select one of the cross validation options to use in the training job. [Learn more about cross validation](how-to-configure-auto-train.md).
    Concurrency| Select the multi-core limits you would like to use when using multi-core compute.
    Blocked algorithm| Select algorithms you want to exclude from the training job.

   ![Advanced settings form](media/how-to-create-portal-experiments/advanced-settings.png)

> [!NOTE]
> For more information on fields, click the information tool tip.

<a name="profile"></a>

### Data profiling

You can get a vast variety of summary statistics across your data set to verify whether your data set is ML-ready. For non-numeric columns, they include only basic statistics like min, max, and error count. For numeric columns, you can also review their statistical moments and estimated quantiles. Specifically, our data profile includes:

* **Feature**: name of the column which is being summarized.

* **Profile**: an in-line visualization based on the type inferred. For example, strings, booleans, and dates will have value counts, while decimals (numerics) have approximated histograms. This allows you to gain a quick understanding of the distribution of the data.

* **Type distribution**: an in-line value count of types within a column. Nulls are their own type, so this visualization is useful for detecting odd or missing values.

* **Type**: the inferred type of the column. Possible values include: strings, booleans, dates, and decimals.

* **Min**: the minimum value of the column. Blank entries appear for features whose type does not have an inherent ordering (e.g. booleans).

* **Max**: the maximum value of the column. Like "min," blank entries appear for features with irrelevant types.

* **Count**: the total number of missing and non-missing entries in the column.

* **Not missing count**: the number of entries in the column which are not missing. Note that empty strings and errors are treated as values, so they will not contribute to the "not missing count."

* **Quantiles** (at 0.1, 1, 5, 25, 50, 75, 95, 99, and 99.9% intervals): the approximated values at each quantile to provide a sense of the distribution of the data. Blank entries appear for features with irrelevant types.

* **Mean**: the arithmetic mean of the column. Blank entries appear for features with irrelevant types.

* **Standard deviation**: the standard deviation of the column. Blank entries appear for features with irrelevant types.

* **Variance**: the variance of the column. Blank entries appear for features with irrelevant types.

* **Skewness**: the skewness of the column. Blank entries appear for features with irrelevant types.

* **Kurtosis**: the kurtosis of the column. Blank entries appear for features with irrelevant types.

<a name="preprocess"></a>

### Advanced preprocessing

When configuring your experiments, you can enable the advanced setting `Preprocess`. Doing so means that the following data preprocessing and featurization steps are performed automatically.

|Preprocessing&nbsp;steps| Description |
| ------------- | ------------- |
|Drop high cardinality or no variance features|Drop these from training and validation sets, including features with all values missing, same value across all rows or with extremely high cardinality (for example, hashes, IDs, or GUIDs).|
|Impute missing values|For numerical features, impute with average of values in the column.<br/><br/>For categorical features, impute with most frequent value.|
|Generate additional features|For DateTime features: Year, Month, Day, Day of week, Day of year, Quarter, Week of the year, Hour, Minute, Second.<br/><br/>For Text features: Term frequency based on unigrams, bi-grams, and tri-character-grams.|
|Transform and encode |Numeric features with few unique values are transformed into categorical features.<br/><br/>One-hot encoding is performed for low cardinality categorical; for high cardinality, one-hot-hash encoding.|
|Word embeddings|Text featurizer that converts vectors of text tokens into sentence vectors using a pre-trained model. Each word’s embedding vector in a document is aggregated together to produce a document feature vector.|
|Target encodings|For categorical features, maps each category with averaged target value for regression problems, and to the class probability for each class for classification problems. Frequency-based weighting and k-fold cross validation is applied to reduce over fitting of the mapping and noise caused by sparse data categories.|
|Text target encoding|For text input, a stacked linear model with bag-of-words is used to generate the probability of each class.|
|Weight of Evidence (WoE)|Calculates WoE as a measure of correlation of categorical columns to the target column. It is calculated as the log of the ratio of in-class vs out-of-class probabilities. This step outputs one numerical feature column per class and removes the need to explicitly impute missing values and outlier treatment.|
|Cluster Distance|Trains a k-means clustering model on all numerical columns.  Outputs k new features, one new numerical feature per cluster, containing the distance of each sample to the centroid of each cluster.|

## Run experiment and view results

To run the experiment, click Start. The experiment preparing process takes a couple of minutes.

### View experiment details

Once the experiment preparation phase is done, you'll see the Run Detail screen. This gives you a full list of the models created. By default, the model that scores the highest based on your parameters is at the top of the list. As the training job tries out more models, they are added to the iteration list and chart. Use the iteration chart to get a quick comparison of the metrics for the models produced so far.

Training jobs can take a while for each pipeline to finish running.

![Run details dashboard](media/how-to-create-portal-experiments/run-details.png)

### View training run details

Drill down on any of the output models to see training run details, like performance metrics and distribution charts. [Learn more about charts](how-to-track-experiments.md#understanding-automated-ml-charts).

![Iteration details](media/how-to-create-portal-experiments/iteration-details.png)

## Deploy model

Once you have the best model at hand, it is time to deploy it as a web service to predict on new data.

Automated ML helps you with deploying the model without writing code:

1. You have a few options for deployment. 
    1. If you want to deploy the best model based on the metric criteria you set for the experiment, select **Deploy Best Model** from the **Run Detail** page.

        ![Deploy model button](media/how-to-create-portal-experiments/deploy-model-button.png)

    1. If you want to deploy a specific model iteration, drill down on the model to open its specific run detail page and select **Deploy Model**.

        ![Deploy model button](media/how-to-create-portal-experiments/deploy-model-button2.png)

1. First step is to register the model into the service. Select "Register model" and wait for the registration process to complete.

    ![Deploy model blade](media/how-to-create-portal-experiments/deploy-model-blade.png)

1. Once the model is registered, you'll be able to download the scoring script (scoring.py) and the environment script (condaEnv.yml) to be used during deployment.

1. When the scoring script and the environment script are downloaded, go to the **Assets** blade of the left navigation pane and select **Models**.

    ![Navigation pane models](media/how-to-create-portal-experiments/nav-pane-models.png)

1. Select the model you registered, and select "Create image".

    You can identify the model by its description, which will include the run ID, iteration number, in the following format: *<Run_ID>_<Iteration_number>_Model*

    ![Models: Create image](media/how-to-create-portal-experiments/model-create-image.png)

1. Enter a name for the image. 
1. Select the **Browse** button next to the "Scoring File" box to upload the scoring file (scoring.py) you previously downloaded.

1. Select the **Browse** button next to the "Conda File" box to upload the environment file (condaEnv.yml) you previously downloaded.

    You can use your own scoring script and conda file, as well as upload additional files. [Learn more about scoring script](how-to-deploy-and-where.md#script).

      >[!Important]
      > File names must be under 32 characters and must begin and end with alphanumerics. May include dashes, underscores, dots, and alphanumerics between. Spaces are not allowed.

    ![Create image](media/how-to-create-portal-experiments/create-image.png)

1. Select the "Create" button to start the image creation. This will take a few minutes to complete, once done, you will see a message on the top bar.
1. Go to the "Images" tab, check the checkbox next to the image you want to deploy, and select "Create deployment". [Learn more about deployments](how-to-deploy-and-where.md).

    There are 2 options for deployment.
     + Azure Container Instance (ACI) - This is used more for testing purpose rather than operational deployment at scale. Make sure to fill in the values for at least one core for  _CPU Reserve Capacity_, and at least one gigabyte (GB) for _Memory Reserve Capacity_
     + Azure Kubernetes Service (AKS)) - This option is for deployment at scale. You will need to have an AKS based compute ready.

     ![Images: Create deployment](media/how-to-create-portal-experiments/images-create-deployment.png)

1. When done, select **Create**. Deploying the model can take several minutes for each pipeline to finish running.

1. That's it! You have an operational web service to generate predictions.

## Next steps

* [Learn more about automated machine learning](concept-automated-ml.md) and Azure Machine Learning.
* [Learn how to consume a web service](https://docs.microsoft.com/azure/machine-learning/service/how-to-consume-web-service).
