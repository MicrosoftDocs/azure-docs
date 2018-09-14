---
title: Configure your automatic Machine Learning experiment in Azure Machine Learning
description: Learn how to define configuration settings to automatically train a machine learning model in Azure Machine Learning
services: machine-learning
author: nacharya1
ms.author: nilesha
ms.reviewer: sgilley
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/24/2018
---

# Configure your automated Machine Learning experiment

Automated Machine Learning (ML) picks an algorithm for you and generates a model ready for deployment. The model can be downloaded to be further customized as well. There are several options that you can use to configure automated ML experiments. In this guide, you will learn how to define various configuration settings.

To view examples of an automated ML, see [Tutorial: Automatically train a classification model](tutorial-auto-train-models.md) or [Train models automatically in the cloud](how-to-auto-train-remote.md).

Configuration options available in automated ML:

* Select your experiment type, e.g.,  Classification, Regression 
* Data source, formats, and fetch data
* Choose your compute target (local or remote)
* `AutoML` experiment settings
* Run `AutoML` experiment
* Explore model metrics
* Register and deploy model

## Select your experiment type
Before you begin your experiment, you should determine the kind of Machine Learning problem you are solving. Automated ML supports two categories of supervised learning: Classification and Regression. Automated ML supports the following algorithms during the automation and tuning process. As a user, there is no need for you to specify the algorithm.
Classification | Regression
--|--
sklearn.linear_model.LogisticRegression	| sklearn.linear_model.ElasticNet
sklearn.linear_model.SGDClassifier	| sklearn.ensemble.GradientBoostingRegressor
sklearn.naive_bayes.BernoulliNB | sklearn.tree.DecisionTreeRegressor
sklearn.naive_bayes.MultinomialNB | sklearn.neighbors.KNeighborsRegressor
sklearn.svm.SVC | sklearn.linear_model.LassoLars
sklearn.svm.LinearSVC |	sklearn.linear_model.SGDRegressor
sklearn.calibration.CalibratedClassifierCV |	sklearn.ensemble.RandomForestRegressor
sklearn.neighbors.KNeighborsClassifier |	sklearn.ensemble.ExtraTreesRegressor
sklearn.tree.DecisionTreeClassifier |	lightgbm.LGBMRegressor
sklearn.ensemble.RandomForestClassifier	|
sklearn.ensemble.ExtraTreesClassifier	|
sklearn.ensemble.GradientBoostingClassifier	|
lightgbm.LGBMClassifier	|


## Data source and format for `AutoML` experiment
`AutoML` supports data that resides on your local desktop or in the cloud in Azure Blob Storage. The data can be read into scikit-learn supported data formats. You can read the data into 1) Numpy arrays X (features) and y (target variable or also known as label) or 2) Pandas dataframe. 

Examples:

1.	Numpy arrays

    ```python
    digits = datasets.load_digits()
    X_digits = digits.data 
    y_digits = digits.target
    ```

2.	Pandas dataframe

    ```python
    Import pandas as pd
    df = pd.read_csv("https://automldemods.blob.core.windows.net/datasets/PlayaEvents2016,_1.6MB,_3.4k-rows.cleaned.2.tsv", delimiter="\t", quotechar='"') 
    # get integer labels 
    le = LabelEncoder() 
    le.fit(df["Label"].values) 
    y = le.transform(df["Label"].values) 
    df = df.drop(["Label"], axis=1) 
    df_train, _, y_train, _ = train_test_split(df, y, test_size=0.1, random_state=42)
    ```

## Fetch data for running experiment on remote compute

If you are using a remote compute to run your AutoML experiment, the data fetch must be wrapped in a separate python script `GetData()`. This script is run on the remote compute where the AutoML experiment is run. `GetData` eliminates the need to fetch the data over the wire for each iteration. Without `GetData`, your experiment will fail when you run on remote compute.

Here is an example of `GetData`:

```python
%%writefile $project_folder/get_data.py 
import pandas as pd 
from sklearn.model_selection 
import train_test_split 
from sklearn.preprocessing import LabelEncoder 
def get_data(): # Burning man 2016 data 
    df = pd.read_csv("https://automldemods.blob.core.windows.net/datasets/PlayaEvents2016,_1.6MB,_3.4k-rows.cleaned.2.tsv", delimiter="\t", quotechar='"') 
    # get integer labels 
    le = LabelEncoder() 
    le.fit(df["Label"].values) 
    y = le.transform(df["Label"].values) 
    df = df.drop(["Label"], axis=1) 
    df_train, _, y_train, _ = train_test_split(df, y, test_size=0.1, random_state=42) 
    return { "X" : df, "y" : y }
```

In your `AutoMLConfig` object, you specify the `data_script` parameter and provide the path to the `GetData` script file similar to below:

```python
automl_config = AutoMLConfig(****, data_script=project_folder + "./get_data.py", **** )
```

`GetData` script can return the following:
Key	| Type |	Mutually Exclusive with	| Description
---|---|---|---
X |	Pandas Dataframe or Numpy Array	| data_train, label, columns |	All features to train with
y |	Pandas Dataframe or Numpy Array |	label	| Label data to train with. For classification, should be an array of integers.
X_valid	| Pandas Dataframe or Numpy Array	| data_train, label	| _Optional_ All features to validate with. If not specified, X is split between train and validate
y_valid |	Pandas Dataframe or Numpy Array	| data_train, label	| _Optional_ The label data to validate with. If not specified, y is split between train and validate
sample_weight |	Pandas Dataframe or Numpy Array |	data_train, label, columns|	_Optional_ A weight value for each sample. Use when you would like to assign different weights for your data points 
sample_weight_valid	| Pandas Dataframe or Numpy Array |	data_train, label, columns |	_Optional_ A weight value for each validation sample. If  not specified, sample_weight is split between train and validate
data_train |	Pandas Dataframe |	X, y, X_valid, y_valid |	All data (features+label) to train with
label |	string	| X, y, X_valid, y_valid |	Which column in data_train represents the label
columns	| Array of strings	||	_Optional_ Whitelist of columns to use for features
cv_splits_indices	| Array of integers	||	_Optional_ List of indexes to split the data for cross validation

## Train and validation data

You can specify separate train and validation set either through get_data() or directly in the `AutoMLConfig`  method.

## Cross validation split options

### K-Folds Cross Validation

Use `n_cross_validations` setting to specify the number of cross validations. The training data set will be randomly split into `n_cross_validations` folds of equal size. During each cross validation round, one of the folds will be used for validation of the model trained on the remaining folds. This process repeats for `n_cross_validations` rounds until each fold is used once as validation set. Finally, the average scores across all `n_cross_validations` rounds will be reported, and the corresponding model will be retrained on the whole training data set.

### Monte Carlo Cross Validation (a.k.a. Repeated Random Sub-Sampling)

Use `validation_size` to specify the percentage of the training dataset that should be used for validation, and use `n_cross_validations` to specify the number of cross validations. During each cross validation round, a subset of size `validation_size` will be randomly selected for validation of the model trained on the remaining data. Finally, the average scores across all `n_cross_validations` rounds will be reported, and the corresponding model will be retrained on the whole training data set.

### Custom validation dataset

Use custom validation dataset if random split is not acceptable (usually time series data or imbalanced data). With this, you can specify your own validation dataset. The model will be evaluated against the validation dataset specified instead of random dataset.

## Compute to run experiment

Next determine where the model will be trained. An automated ML training experiment runs on a compute target that you own and manage. 

Compute options supported are:
1.	Your local machine such as a local desktop or laptop – Generally when you have small dataset and you are still in the exploration stage.
2.	A remote machine in the cloud – [Azure Data Science Virtual Machine](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/) running Linux – You have a large dataset and want to scale up to a large machine that is available in the Azure Cloud. 
3.	Azure Batch AI cluster –  A managed cluster that you can set up to scale out and run AutoML iterations in parallel. 


## Configure your experiment settings

There are several knobs that you can use to configure your AutoML experiment. These parameters are set by instantiating an `AutoMLConfig` object.

Some examples include:

1.	Classification experiment using AUC weighted as the primary metric with a max time of 12,000 seconds per iteration, with the experiment to end after 50 iterations and 2 cross validation folds.

    ```python
    automl_classifier = AutoMLConfig(
        task='classification',
        primary_metric='AUC_weighted',
        max_time_sec=12000,
        iterations=50,
        X=X, 
        y=y,
        n_cross_validations=2)
    ```
2.	Below is an example of a regression experiment set to end after 100 iterations, with each iteration lasting up to 600 seconds with 5 validation cross folds.

    ````python
    automl_regressor = AutoMLConfig(
        task='regression',
        max_time_sec=600,
        iterations=100,
        primary_metric='r2_score',
        X=X, 
        y=y,
        n_cross_validations=5)
    ````

This table lists parameter settings available for your experiment and their default values.

Property |	Description	| Default Value
--|--|--
`task` (Required)	|Specify the type of Machine Learning problem. Allowed values are <li>Classification</li><li>Regression</li>	|
`primary_metric` (Required) |Metric that you want to optimize in building your model. For example, if you specify accuracy as the primary_metric, AutoML looks to find a model with maximum accuracy. You can only specify one primary_metric per experiment. Allowed values are <br/>**Classification**:<br/><li> accuracy </li><li>AUC_macro</li><li> AUC_weighted </li><li> weighted_accuracy </li><li> norm_macro_recall </li><li> balanced_accuracy </li><li> average_precision_score_weighted </li><br/>**Regression**: <br/><li> root_mean_squared_error </li><li> Spearman_correlation </li><li> Normalized_root_mean_squared_error </li><li> R2_score	 </li><li> For Classification: accuracy  </li><li> For Regression: root_mean_squared_error </li> |
`exit_score` |	You can set a target value for your primary_metric. Once a model is found that meets the primary_metric target, AutoML will stop iterating and the experiment terminates. If this value is not set (default), AutoML experiment will continue to run the number of iterations specified in iterations. Takes a double value. If the target never reaches, then AutoML will continue until it reaches the number of iterations specified in iterations.|	None
`iterations` |Maximum number of iterations. Each iteration is equal to a training job that results in a pipeline. Pipeline is data preprocessing and model. Recommended value to get a high-quality model is 500 or above.	| 25
`Concurrent_iterations`|	Max number of iterations to be run in parallel. This setting works only for remote compute.|	1
`max_cores_per_iteration`	| Indicates how many cores on the compute target would be used to train a single pipeline. If the algorithm can leverage multiple cores, then this increases the performance on a multi-core machine. You can set it to -1 to use all the cores available on the machine.|	1
`max_time_sec` |	Limits the amount of time (seconds) a particular iteration takes. If an iteration exceeds the specified amount, that iteration gets canceled. If not set, then the iteration continues to run until it is finished. |	None
`n_cross_validations`	|Number of cross validation splits|	None
`validation_size`	|Size of validation set as percentage of all training sample.|	None
`preprocess` | True/False <br/>True enables experiment to perform preprocessing on the input. AutoML performs the following preprocessing<li>Missing Data: Imputes the missing data</li><li>Categorical Values: Converts into one-hot encoding </li><li>Feature Extraction:<li><br/>Note : if data is sparse you cannot use preprocess = true	False |	
`blacklist_algos`	| AutoML experiment has many different algorithms that it tries. Configure AutoML to exclude certain algorithms from the experiment. Useful if you are aware that algorithm(s) do not work well for your dataset. Excluding algorithms can save you compute resources and training time.<br/>Allowed values for Classification<br/><li>logistic regression</li><li>SGD classifier</li><li>MultinomialNB</li><li>BernoulliNB</li><li>SVM</li><li>LinearSVM</li><li>kNN</li><li>DT</li><li>RF</li><li>extra trees</li><li>gradient boosting</li><li>lgbm_classifier</li><br/>Allowed values for Regression<br/><li>Elastic net</li><li>Gradient boosting regressor</li><li>DT regressor</li><li>kNN regressor</li><li>Lasso lars</li><li>SGD regressor</li><li>RF regressor</li><li>extra trees regressor</li>|	None
`verbosity`	|Controls the level of logging with INFO being the most verbose and CRITICAL being the least.<br/>Allowed values are:<br/><li>logging.INFO</li><li>logging.WARNING</li><li>logging.ERROR</li><li>logging.CRITICAL</li>	| logging.INFO</li> 
`X`	| All features to train with |	None
`y` |	Label data to train with. For classification, should be an array of integers.|	None
`X_valid`|_Optional_ All features to validate with. If not specified, X is split between train and validate |	None
`y_valid`	|_Optional_ The label data to validate with. If not specified, y is split between train and validate	| None
`sample_weight` |	_Optional_ A weight value for each sample. Use when you would like to assign different weights for your data points | 	None
`sample_weight_valid`	| 	_Optional_ A weight value for each validation sample. If not specified, sample_weight is split between train and validate	| None
`run_configuration` |	RunConfiguration object.  Used for remote runs. |None
`data_script`  |	Path to a file containing the get_data method.  Required for remote runs.	|None


## Run `AutoML` experiment

Next, we can initiate the experiment to run and generate a model for us. Pass the `AutoMLConfig` to the `submit` method to generate the model.

```python
run = experiment.submit(automl_config, show_output=True)
```

>[!NOTE]
>Dependencies are first installed on a new DSVM.  It may take up to 10 minutes before output is shown.
>Setting `show_output` to True results in output being shown on the console.


## Explore model metrics
You can view your results in a widget or inline if you are in a notebook. See details to “Track and evaluate models”. (ensure AML content contains relevant information to AutoML)

The following metrics are saved in each iteration
* AUC_macro
* AUC_micro
* AUC_weighted
* AUC_weighted_max
* accuracy
* average_precision_score_macro
* average_precision_score_micro
* average_precision_score_weighted
* balanced_accuracy
* f1_score_macro
* f1_score_micro
* f1_score_weighted
* log_loss
* norm_macro_recall
* precision_score_macro
* precision_score_micro
* precision_score_weighted
* recall_score_macro
* recall_score_micro
* recall_score_weighted
* weighted_accuracy

## Next steps

Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).
