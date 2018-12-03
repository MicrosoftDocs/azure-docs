---
title: Configure your automated machine learning experiment - Azure Machine Learning
description: Automated machine learning picks an algorithm for you and generates a model ready for deployment. Learn the options that you can use to configure automated machine learning experiments.
author: nacharya1
ms.author: nilesha
ms.reviewer: sgilley 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.date: 12/04/2018
---

# Configure your automated machine learning experiment

Automated machine learning picks an algorithm and hyperparameters for you and generates a model ready for deployment. You can download the  model and further customize it as well. There are several options that you can use to configure automated machine learning experiments. In this guide, learn how to define various configuration settings.

To view examples of an automated machine learning, see [Tutorial: Train a classification model with automated machine learning](tutorial-auto-train-models.md) or [Train models with automated machine learning in the cloud](how-to-auto-train-remote.md).

Configuration options available in automated machine learning:

* Select your experiment type: Classification, Regression or Forecasting
* Data source, formats, and fetch data
* Choose your compute target: local or remote
* Automated machine learning experiment settings
* Run an automated machine learning experiment
* Explore model metrics
* Register and deploy model

## Select your experiment type
Before you begin your experiment, you should determine the kind of machine learning problem you are solving. Automated machine learning supports two categories of supervised learning: Classification and Regression. Automated machine learning supports the following algorithms during the automation and tuning process. As a user, there is no need for you to specify the algorithm.
Classification | Regression |
--|-- |--
[Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)| [Elastic Net](https://scikit-learn.org/stable/modules/linear_model.html#elastic-net)
[Stochastic Gradient Descent (SGD)](https://scikit-learn.org/stable/modules/sgd.html#sgd)|[Light GBM](https://lightgbm.readthedocs.io/en/latest/index.html)
[Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html#bernoulli-naive-bayes)|[Gradient Boosting](https://scikit-learn.org/stable/modules/ensemble.html#regression)
[C-Support Vector Classification (SVC)](https://scikit-learn.org/stable/modules/svm.html#classification)|[Decision Tree](https://scikit-learn.org/stable/modules/tree.html#regression)
[Linear SVC](https://scikit-learn.org/stable/modules/svm.html#classification)|[K Nearest Neighbors](https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors-regression)
[K Nearest Neighbors](https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors)|[LARS Lasso](https://scikit-learn.org/stable/modules/linear_model.html#lars-lasso)
[Decision Tree](https://scikit-learn.org/stable/modules/tree.html#decision-trees)|[Stochastic Gradient Descent (SGD)](https://scikit-learn.org/stable/modules/sgd.html#regression)
[Random Forest](https://scikit-learn.org/stable/modules/ensemble.html#random-forests)|[Random Forest](https://scikit-learn.org/stable/modules/ensemble.html#random-forests)
[Extremely Randomized Trees](https://scikit-learn.org/stable/modules/ensemble.html#extremely-randomized-trees)|[Extremely Randomized Trees](https://scikit-learn.org/stable/modules/ensemble.html#extremely-randomized-trees)
[Gradient Boosting](https://scikit-learn.org/stable/modules/ensemble.html#classification)|
[Light GBM](https://lightgbm.readthedocs.io/en/latest/index.html)|


## Data source and format
Automated machine learning supports data that resides on your local desktop or in the cloud in Azure Blob Storage. The data can be read into scikit-learn supported data formats. You can read the data into:
* Numpy arrays X (features) and y (target variable or also known as label)
* Pandas dataframe 

Examples:

*	Numpy arrays

    ```python
    digits = datasets.load_digits()
    X_digits = digits.data 
    y_digits = digits.target
    ```

*	Pandas dataframe

    ```python
    import pandas as pd
    df = pd.read_csv("https://automldemods.blob.core.windows.net/datasets/PlayaEvents2016,_1.6MB,_3.4k-rows.cleaned.2.tsv", delimiter="\t", quotechar='"') 
    # get integer labels 
    df = df.drop(["Label"], axis=1) 
    df_train, _, y_train, _ = train_test_split(df, y, test_size=0.1, random_state=42)
    ```

## Fetch data for running experiment on remote compute

If you are using a remote compute to run your experiment, the data fetch must be wrapped in a separate python script `get_data()`. This script is run on the remote compute where the automated machine learning experiment is run. `get_data` eliminates the need to fetch the data over the wire for each iteration. Without `get_data`, your experiment will fail when you run on remote compute.

Here is an example of `get_data`:

```python
%%writefile $project_folder/get_data.py 
import pandas as pd 
from sklearn.model_selection import train_test_split 
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

In your `AutoMLConfig` object, you specify the `data_script` parameter and provide the path to the `get_data` script file similar to below:

```python
automl_config = AutoMLConfig(****, data_script=project_folder + "/get_data.py", **** )
```

`get_data` script can return:
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

Use `n_cross_validations` setting to specify the number of cross validations. The training data set will be randomly split into `n_cross_validations` folds of equal size. During each cross validation round, one of the folds will be used for validation of the model trained on the remaining folds. This process repeats for `n_cross_validations` rounds until each fold is used once as validation set. The average scores across all `n_cross_validations` rounds will be reported, and the corresponding model will be retrained on the whole training data set.

### Monte Carlo Cross Validation (a.k.a. Repeated Random Sub-Sampling)

Use `validation_size` to specify the percentage of the training dataset that should be used for validation, and use `n_cross_validations` to specify the number of cross validations. During each cross validation round, a subset of size `validation_size` will be randomly selected for validation of the model trained on the remaining data. Finally, the average scores across all `n_cross_validations` rounds will be reported, and the corresponding model will be retrained on the whole training data set.

### Custom validation dataset

Use custom validation dataset if random split is not acceptable (usually time series data or imbalanced data). You can specify your own validation dataset. The model will be evaluated against the validation dataset specified instead of random dataset.

## Compute to run experiment

Next determine where the model will be trained. An automated machine learning training experiment runs on a compute target that you own and manage. 

Compute options supported are:
*	Your local machine such as a local desktop or laptop – Generally when you have small dataset and you are still in the exploration stage.
*	A remote machine in the cloud – [Azure Machine Learning Managed Compute](concept-azure-machine-learning-architecture.md#managed-and-unmanaged-compute-targets) is a managed service that enables the ability to train machine learning models on clusters of Azure virtual machines.

See the [Github site](https://github.com/Azure/MachineLearningNotebooks/tree/master/automl) for example notebooks with local and remote compute targets.

<a name='configure-experiment'/>

## Configure your experiment settings

There are several options that you can use to configure your automated machine learning experiment. These parameters are set by instantiating an `AutoMLConfig` object.

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
`task`	|Specify the type of machine learning problem. Allowed values are <li>Classification</li><li>Regression</li><li>Forecasting</li>	| None |
`primary_metric` |Metric that you want to optimize in building your model. For example, if you specify accuracy as the primary_metric, automated machine learning looks to find a model with maximum accuracy. You can only specify one primary_metric per experiment. Allowed values are <br/>**Classification**:<br/><li> accuracy  </li><li> AUC_weighted</li><li> precision_score_weighted </li><li> balanced_accuracy </li><li> average_precision_score_weighted </li><br/>**Regression**: <br/><li> normalized_mean_absolute_error </li><li> spearman_correlation </li><li> normalized_root_mean_squared_error </li><li> normalized_root_mean_squared_log_error</li><li> R2_score	 </li> | For Classification: accuracy <br/>For Regression: spearman_correlation <br/> |
`experiment_exit_score` |	You can set a target value for your primary_metric. Once a model is found that meets the primary_metric target, automated machine learning will stop iterating and the experiment terminates. If this value is not set (default), Automated machine learning experiment will continue to run the number of iterations specified in iterations. Takes a double value. If the target never reaches, then Automated machine learning will continue until it reaches the number of iterations specified in iterations.|	None
`iterations` |Maximum number of iterations. Each iteration is equal to a training job that results in a pipeline. Pipeline is data preprocessing and model. To get a high-quality model, use 250 or more	| 100
`Concurrent_iterations`|	Max number of iterations to run in parallel. This setting works only for remote compute.|	1
`max_cores_per_iteration`	| Indicates how many cores on the compute target would be used to train a single pipeline. If the algorithm can leverage multiple cores, then this increases the performance on a multi-core machine. You can set it to -1 to use all the cores available on the machine.|	1
`Iteration_timeout_minutes` |	Limits the amount of time (minutes) a particular iteration takes. If an iteration exceeds the specified amount, that iteration gets canceled. If not set, then the iteration continues to run until it is finished. |	None
`n_cross_validations`	|Number of cross validation splits|	None
`validation_size`	|Size of validation set as percentage of all training sample.|	None
`preprocess` | True/False <br/>True enables experiment to perform preprocessing on the input. Following is a subset of preprocessing<li>Missing Data: Imputes the missing data- Numerical with Average, Text with most occurrence </li><li>Categorical Values: If data type is numeric and number of unique values is less than 5 percent, Converts into one-hot encoding </li><li>Etc. for complete list check [the GitHub repository](https://aka.ms/aml-notebooks)</li><br/>Note : if data is sparse you cannot use preprocess = true |	False |	
`blacklist_algos`	| Automated machine learning experiment has many different algorithms that it tries. Configure to exclude certain algorithms from the experiment. Useful if you are aware that algorithm(s) do not work well for your dataset. Excluding algorithms can save you compute resources and training time.<br/>Allowed values for Classification<br/><li>logistic regression</li><li>SGD classifier</li><li>MultinomialNB</li><li>BernoulliNB</li><li>SVM</li><li>LinearSVM</li><li>kNN</li><li>DT</li><li>RF</li><li>extra trees</li><li>gradient boosting</li><li>lgbm_classifier</li><br/>Allowed values for Regression<br/><li>Elastic net</li><li>Gradient boosting regressor</li><li>DT regressor</li><li>kNN regressor</li><li>Lasso lars</li><li>SGD regressor</li><li>RF regressor</li><li>extra trees regressor</li>|	None
`verbosity`	|Controls the level of logging with INFO being the most verbose and CRITICAL being the least.<br/>Allowed values are:<br/><li>logging.INFO</li><li>logging.WARNING</li><li>logging.ERROR</li><li>logging.CRITICAL</li>	| logging.INFO</li> 
`X`	| All features to train with |	None
`y` |	Label data to train with. For classification, should be an array of integers.|	None
`X_valid`|_Optional_ All features to validate with. If not specified, X is split between train and validate |	None
`y_valid`	|_Optional_ The label data to validate with. If not specified, y is split between train and validate	| None
`sample_weight` |	_Optional_ A weight value for each sample. Use when you would like to assign different weights for your data points | 	None
`sample_weight_valid`	| 	_Optional_ A weight value for each validation sample. If not specified, sample_weight is split between train and validate	| None
`run_configuration` |	RunConfiguration object.  Used for remote runs. |None
`data_script`  |	Path to a file containing the get_data method.  Required for remote runs.	|None
`model_explainability` | _Optional_ Used for feature engineering explainability | False
`enable_ensembling`|Flag to enable an ensembling iteration after all the other iterations complete.|
`ensemble_iterations`|Number of iterations during which we choose a fitted pipeline to be part of the final ensemble.|

## Data pre-processing and featurization

If you use `preprocess=True`, the following data preprocessing steps are performed automatically for you:
1.	Drop high cardinality or no variance features
    * Drop features with no useful information from training and validation sets. These include features with all values missing, same value across all rows or with extremely high cardinality (e.g., hashes, IDs or GUIDs).
1.	Missing value imputation
    *	For numerical features, impute missing values with average of values in the column.
    *	For categorical features, impute missing values with most frequent value.
1.	Generate additional features
    * For DateTime features: Year, Month, Day, Day of week, Day of year, Quarter, Week of the year, Hour, Minute, Second.
    * For Text features: Term frequency based on word unigram, bi-grams, and tri-gram, Count vectorizer.
1.	Transformations and encodings
    * Numeric features with very few unique values transformed into categorical features.
    * Depending on cardinality of categorical features, perform label encoding or (hashing) one-hot encoding.

## Run experiment

Submit the experiment to run and generate a model. Pass the `AutoMLConfig` to the `submit` method to generate the model.

```python
run = experiment.submit(automl_config, show_output=True)
```

>[!NOTE]
>Dependencies are first installed on a new machine.  It may take up to 10 minutes before output is shown.
>Setting `show_output` to `True` results in output being shown on the console.


## Explore model metrics
You can view your results in a widget or inline if you are in a notebook. See [Track and evaluate models](how-to-track-experiments.md#view-run-details) for more details.


### Classification metrics
The following metrics are saved in each iteration for a classification task.

|Primary Metric|Description|Calculation|Extra Parameters
--|--|--|--|--|
AUC_Macro| AUC is the Area under the Receiver Operating Characteristic Curve. Macro is the arithmetic mean of the AUC for each class.  | [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | average="macro"|
AUC_Micro| AUC is the Area under the Receiver Operating Characteristic Curve. Micro is computed globably by combining the true positives and false positives from each class| [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | average="micro"|
AUC_Weighted  | AUC is the Area under the Receiver Operating Characteristic Curve. Weighted is the arithmetic mean of the score for each class, weighted by the number of true instances in each class| [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)|average="weighted"
accuracy|Accuracy is the percent of predicted labels that exactly match the true labels. |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html) |None|
average_precision_score_macro|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Macro is the arithmetic mean of the average precision score of each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="macro"|
average_precision_score_micro|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Micro is computed globally by combing the true positives and false positives at each cutoff|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="micro"|
average_precision_score_weighted|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Weighted is the arithmetic mean of the average precision score for each class, weighted by the number of true instances in each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="weighted"|
balanced_accuracy|Balanced accuracy is the arithmetic mean of recall for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="macro"|
f1_score_macro|F1 score is the harmonic mean of precision and recall. Macro is the arithmetic mean of F1 score for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="macro"|
f1_score_micro|F1 score is the harmonic mean of precision and recall. Micro is computed globally by counting the total true positives, false negatives, and false positives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="micro"|
f1_score_weighted|F1 score is the harmonic mean of precision and recall. Weighted mean by class frequency of F1 score for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="weighted"|
log_loss|This is the loss function used in (multinomial) logistic regression and extensions of it such as neural networks, defined as the negative log-likelihood of the true labels given a probabilistic classifier’s predictions. For a single sample with true label yt in {0,1} and estimated probability yp that yt = 1, the log loss is -log P(yt&#124;yp) = -(yt log(yp) + (1 - yt) log(1 - yp))|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)|None|
norm_macro_recall|Normalized Macro Recall is Macro Recall normalized so that random performance has a score of 0 and perfect performance has a score of 1. This is achieved by norm_macro_recall := (recall_score_macro - R)/(1 - R), where R is the expected value of recall_score_macro for random predictions (i.e., R=0.5 for binary classification and R=(1/C) for C-class classification problems)|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average = "macro" and then (recall_score_macro - R)/(1 - R), where R is the expected value of recall_score_macro for random predictions (i.e., R=0.5 for binary classification and R=(1/C) for C-class classification problems)|
precision_score_macro|Precision is the percent of elements labeled as a certain class that actually are in that class. Macro is the arithmetic mean of precision for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="macro"|
precision_score_micro|Precision is the percent of elements labeled as a certain class that actually are in that class. Micro is computed globally by counting the total true positives and false positives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="micro"|
precision_score_weighted|Precision is the percent of elements labeled as a certain class that actually are in that class. Weighted is the arithmetic mean of precision for each class, weighted by number of true instances in each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="weighted"|
recall_score_macro|Recall is the percent of elements actually in a certain class that are correctly labeled. Macro is the arithmetic mean of recall for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="macro"|
recall_score_micro|Recall is the percent of elements actually in a certain class that are correctly labeled. Micro is computed globally by counting the total true positives, false negatives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="micro"|
recall_score_weighted|Recall is the percent of elements actually in a certain class that are correctly labeled. Weighted is the arithmetic mean of recall for each class, weighted by number of true instances in each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="weighted"|
weighted_accuracy|Weighted accuracy is accuracy where the weight given to each example is equal to the proportion of true instances in that example's true class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)|sample_weight is a vector equal to the proportion of that class for each element in the target|

### Regression metrics
The following metrics are saved in each iteration for a regression task.

|Primary Metric|Description|Calculation|Extra Parameters
--|--|--|--|--|
explained_variance|Explained variance is  the proportion to which a mathematical model accounts for the variation of a given data set. It is the percent decrease in variance of the original data to the variance of the errors. When the mean of the errors is 0, it is equal to explained variance.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.explained_variance_score.html)|None|
r2_score|R2 is the coefficient of determination or the percent reduction in squared errors compared to a baseline model that outputs the mean. When the mean of the errors is 0, it is equal to explained variance.|[Calculation](https://scikit-learn.org/0.16/modules/generated/sklearn.metrics.r2_score.html)|None|
spearman_correlation|Spearman correlation is a nonparametric measure of the monotonicity of the relationship between two datasets. Unlike the Pearson correlation, the Spearman correlation does not assume that both datasets are normally distributed. Like other correlation coefficients, this one varies between -1 and +1 with 0 implying no correlation. Correlations of -1 or +1 imply an exact monotonic relationship. Positive correlations imply that as x increases, so does y. Negative correlations imply that as x increases, y decreases.|[Calculation](https://docs.scipy.org/doc/scipy-0.16.1/reference/generated/scipy.stats.spearmanr.html)|None|
mean_absolute_error|Mean absolute error is the expected value of absolute value of difference between the target and the prediction|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|None|
normalized_mean_absolute_error|Normalized mean absolute error is mean Absolute Error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|Divide by range of the data|
median_absolute_error|Median absolute error is the median of all absolute differences between the target and the prediction. This loss is robust to outliers.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|None|
normalized_median_absolute_error|Normalized median absolute error is median absolute error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|Divide by range of the data|
root_mean_squared_error|Root mean squared error is the square root of the expected squared difference between the target and the prediction|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|None|
normalized_root_mean_squared_error|Normalized root mean squared error is root mean squared error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|Divide by range of the data|
root_mean_squared_log_error|Root mean squared log error is the square root of the expected squared logarithmic error|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|None|
normalized_root_mean_squared_log_error|Noramlized Root mean squared log error is root mean squared log error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|Divide by range of the data||

## Explain the model

Automated machine learning allows you to understand feature importance.  During the training process, you can get global feature importance for the model.  For classification scenarios, you can also get class-level feature importance.  You must provide a validation dataset (X_valid) to get feature importance.

There are two ways to generate feature importance.

*	Once an experiment is complete, you can use `explain_model` method on any iteration.

    ```
    from azureml.train.automl.automlexplainer import explain_model
    
    shap_values, expected_values, overall_summary, overall_imp, per_class_summary, per_class_imp = \
        explain_model(fitted_model, X_train, X_test)
    
    #Overall feature importance
    print(overall_imp)
    print(overall_summary) 
    
    #Class-level feature importance
    print(per_class_imp)
    print(per_class_summary) 
    ```

*	To view feature importance for all iterations, set `model_explainability` flag to `True` in AutoMLConfig.  

    ```
    automl_config = AutoMLConfig(task = 'classification',
                                 debug_log = 'automl_errors.log',
                                 primary_metric = 'AUC_weighted',
                                 max_time_sec = 12000,
                                 iterations = 10,
                                 verbosity = logging.INFO,
                                 X = X_train, 
                                 y = y_train,
                                 X_valid = X_test,
                                 y_valid = y_test,
                                 model_explainability=True,
                                 path=project_folder)
    ```

    Once done, you can use retrieve_model_explanation method to retrieve feature importance for a specific iteration.

    ```
    from azureml.train.automl.automlexplainer import retrieve_model_explanation
    
    shap_values, expected_values, overall_summary, overall_imp, per_class_summary, per_class_imp = \
        retrieve_model_explanation(best_run)
    
    #Overall feature importance
    print(overall_imp)
    print(overall_summary) 
    
    #Class-level feature importance
    print(per_class_imp)
    print(per_class_summary) 
    ```

You can visualize the feature importance chart in your workspace in the Azure portal. The chart is also shown when using the  Jupyter widget in a notebook.  

```python
from azureml.widgets import RunDetails
RunDetails(local_run).show()
```
![feature importance graph](./media/how-to-configure-auto-train/feature-importance.png)

## Next steps

Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).

Learn more about [how to train a classification model with Automated machine learning](tutorial-auto-train-models.md) or [how to train using Automated machine learning on a remote resource](how-to-auto-train-remote.md). 
