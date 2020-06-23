---
title: What's new in the release?
titleSuffix: Azure Machine Learning
description: Learn about the latest updates to Azure Machine Learning and the machine learning and data prep Python SDKs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: jmartens
author: j-martens
ms.date: 03/10/2020
---

# Azure Machine Learning release notes

In this article, learn about Azure Machine Learning releases.  For the full SDK reference content,  visit the Azure Machine Learning's [**main SDK for Python**](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) reference page.

See [the list of known issues](resource-known-issues.md) to learn about known bugs and workarounds.

## 2020-06-22

### Azure Machine Learning SDK for Python v1.8.0
  
  + **Preview features**
    + **azureml-contrib-fairness**
    	The `azureml-contrib-fairness` package provides integration between the open source fairness assessment and unfairness mitigation package [Fairlearn](https://fairlearn.github.io) and Azure Machine Learning studio. In particular, the package enables model fairness evaluation dashboards to be uploaded as part of an AzureML Run and appear in Azure Machine Learning studio

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Support getting logs of init container.
    + Added new CLI commands to manage ComputeInstance
  + **azureml-automl-core**
    + Users are now able to enable stack ensemble iteration for Timeseries tasks with a warning that it could potentially overfit.
    + Added a new type of user exception `azureml.automl.core.shared.exceptions.CacheStoreCorruptedException` which is raised if the cache store contents have been tampered with
  + **azureml-automl-runtime**
    + Class Balancing Sweeping will no longer be enabled if user disables featurization.  
  + **azureml-contrib-itp**
    + CmAks compute type is supported. You can attach your own AKS cluster to the workspace for training job.
  + **azureml-contrib-notebook**
    + Doc improvements to azureml-contrib-notebook package.
  + **azureml-contrib-pipeline-steps**
    + Doc improvements to azureml-contrib--pipeline-steps package.
  + **azureml-core**
    + Add set_connection, get_connection, list_connections, delete_connection functions for customer to operate on workspace connection resource
    + Documentation updates to azureml-coore/azureml.exceptions package.
    + Documentation updates to azureml-core package.
    + Doc updates to ComputeInstance class.
    + Doc improvements to azureml-core/azureml.core.compute package.
    + Doc improvements for webservice-related classes in azureml-core.
    + Support user selected datastore to store profiling data
    + Added expand and page_count property for model list API
    + Fixed bug where removing the overwrite property will cause the submitted run to fail with deserialization error.
    + Fixed inconsistent folder structure when downloading or mounting a FileDataset referencing to a single file.
    + Loading a dataset of parquet files to_spark_dataframe is now faster and supports all parquet and Spark SQL datatypes.
    + Support getting logs of init container.
    + AutoML runs are now marked as child run of Parallel Run Step.
  + **azureml-datadrift**
    + Doc improvements to azureml-contrib-notebook package.
  + **azureml-dataprep**
    + Loading a dataset of parquet files to_spark_dataframe is now faster and supports all parquet and Spark SQL datatypes.
    + Better memory handling in case of OutOfMemory issue for to_pandas_dataframe.
  + **azureml-interpret**
    + Upgraded azureml-interpret to use interpret-community version 0.12.*
  + **azureml-mlflow**
    + Doc improvements to azureml-mlflow.
    + Adds support for AML model registry with MLFlow.
  + **azureml-opendatasets**
    + Added support for Python 3.8
  + **azureml-pipeline-core**
    + Updated `PipelineDataset`'s documentation to make it clear it is an internal class.
    + ParallelRunStep updates to accept multiple values for one argument, for example: "--group_column_names", "Col1", "Col2", "Col3"
    + Removed the passthru_automl_config requirement for intermediate data usage with AutoMLStep in Pipelines.
  + **azureml-pipeline-steps**
    + Doc improvements to azureml-pipeline-steps package.
    + Removed the passthru_automl_config requirement for intermediate data usage with AutoMLStep in Pipelines.
  + **azureml-telemetry**
    + Doc improvements to azureml-telemetry.
  + **azureml-train-automl-client**
    + Fixed a bug where `experiment.submit()` called twice on an `AutoMLConfig` object resulted in different behavior.
    + Users are now able to enable stack ensemble iteration for Timeseries tasks with a warning that it could potentially overfit.
    + Changed AutoML run behavior to raise UserErrorException if service throws user error
    + Fixes a bug that caused azureml_automl.log to not get generated or be missing logs when performing an AutoML experiment on a remote compute target.
    + For Classification data sets with imbalanced classes, we will apply weight balancing, if the feature sweeper find it to be better than the baseline
    + AutoML runs are now marked as child run of Parallel Run Step.
  + **azureml-train-automl-runtime**
    + Changed AutoML run behavior to raise UserErrorException if service throws user error
    + AutoML runs are now marked as child run of Parallel Run Step.

  
## 2020-06-08

### Azure Machine Learning SDK for Python v1.7.0

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Completed the removal of model profiling from mir contrib by cleaning up cli commands and package dependencies, Model profiling is available in core.
    + Upgrades the min Azure Cli version to 2.3.0
  + **azureml-automl-core**
    + Better exception message on featurization step fit_transform() due to custom transformer parameters.
    + Add support for multiple languages for deep learning transformer models such as BERT in automated ML.
    + Remove deprecated lag_length parameter from documentation.
    + The forecasting parameters documentation was improved. The lag_length parameter was deprecated.
  + **azureml-automl-runtime**
    + Fixed the error raised when one of categorical columns is empty in forecast/test time.
    + Fix the run failures happening when the lookback features are enabled and the data contain short grains.
    + Fixed the issue with duplicated time index error message when lags or rolling windows were set to 'auto'.
    + Fixed the issue with Prophet and Arima models on data sets, containing the lookback features.
    + Added support of dates before 1677-09-21 or after 2262-04-11 in columns other then date time in the forecasting tasks. Improved error messages.
    + The forecasting parameters documentation was improved. The lag_length parameter was deprecated.
    + Better exception message on featurization step fit_transform() due to custom transformer parameters.
    + Add support for multiple languages for deep learning transformer models such as BERT in automated ML.
    + Cache operations that result in some OSErrors will raise user error.
    + Added checks to ensure training and validation data have the same number and set of columns
    + Fixed issue with the autogenerated AutoML scoring script when the data contains quotation marks
    + Enabling explanations for AutoML Prophet and ensembled models that contain Prophet model.
    + A recent customer issue revealed a live-site bug wherein we log messages along Class-Balancing-Sweeping even when the Class Balancing logic isn't properly enabled. Removing those logs/messages with this PR.
  + **azureml-cli-common**
    + Completed the removal of model profiling from mir contrib by cleaning up cli commands and package dependencies, Model profiling is available in core.
  + **azureml-contrib-reinforcementlearning**
    + Load testing tool
  + **azureml-core**
    + Documentation changes on Script_run_config.py
    + Fixes a bug with printing the output of run submit-pipeline CLI
    + Documentation improvements to azureml-core/azureml.data
    + Fixes issue retrieving storage account using hdfs getconf command
    + Improved register_azure_blob_container and register_azure_file_share documentation
  + **azureml-datadrift**
    + Improved implementation for disabling and enabling dataset drift monitors
  + **azureml-interpret**
    + In explanation client, remove NaNs or Infs prior to json serialization on upload from artifacts
    + Update to latest version of interpret-community to improve out of memory errors for global explanations with many features and classes
    + Add true_ys optional parameter to explanation upload to enable additional features in the studio UI
    + Improve download_model_explanations() and list_model_explanations() performance
    + Small tweaks to notebooks, to aid with debugging
  + **azureml-opendatasets**
    + azureml-opendatasets needs azureml-dataprep version 1.4.0 or higher. Added warning if lower version is detected
  + **azureml-pipeline-core**
    + This change allows user to provide an optional runconfig to the moduleVersion when calling module.Publish_python_script.
    + Enable node account can be a pipeline parameter in ParallelRunStep in azureml.pipeline.steps
  + **azureml-pipeline-steps**
    + This change allows user to provide an optional runconfig to the moduleVersion when calling module.Publish_python_script.
  + **azureml-train-automl-client**
    + Add support for multiple languages for deep learning transformer models such as BERT in automated ML.
    + Remove deprecated lag_length parameter from documentation.
    + The forecasting parameters documentation was improved. The lag_length parameter was deprecated.
  + **azureml-train-automl-runtime**
    + Enabling explanations for AutoML Prophet and ensembled models that contain Prophet model.
    + Documentation updates to azureml-train-automl-* packages.
  + **azureml-train-core**
    + Supporting TensorFlow version 2.1 in the PyTorch Estimator
    + Improvements to azureml-train-core package.
  
## 2020-05-26

### Azure Machine Learning SDK for Python v1.6.0

+ **New features**
  + **azureml-automl-runtime**
    + AutoML Forecasting now supports customers forecast beyond the pre-specified max-horizon without retraining the model. When the forecast destination is farther into the future than the specified maximum horizon, the forecast() function will still make point predictions out to the later date using a recursive operation mode. For the illustration of the new feature, please see the "Forecasting farther than the maximum horizon" section of "forecasting-forecast-function" notebook in [folder](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning)."
  
  + **azureml-pipeline-steps**
    + ParallelRunStep is now released and is part of **azureml-pipeline-steps** package. Existing ParallelRunStep in **azureml-contrib-pipeline-steps** package is deprecated. Changes from public preview version:
      + Added `run_max_try` optional configurable parameter to control max call to run method for any given batch, default value is 3.
      + No PipelineParameters are autogenerated anymore. Following configurable values can be set as PipelineParameter explicitly.
        + mini_batch_size
        + node_count
        + process_count_per_node
        + logging_level
        + run_invocation_timeout
        + run_max_try
      + Default value for process_count_per_node is changed to 1. User should tune this value for better performance. Best practice is to set as the number of GPU or CPU node has.
      + ParallelRunStep does not inject any packages, user needs to include **azureml-core** and **azureml-dataprep[pandas, fuse]** packages in environment definition. If custom docker image is used with user_managed_dependencies then user need to install conda on the image.
      
+ **Breaking changes**
  + **azureml-pipeline-steps**
    + Deprecated the use of azureml.dprep.Dataflow as a valid type of input for AutoMLConfig
  + **azureml-train-automl-client**
    + Deprecated the use of azureml.dprep.Dataflow as a valid type of input for AutoMLConfig

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Fixed the bug where a warning may be printed during `get_output` that asked user to downgrade client.
    + Updated Mac to rely on cudatoolkit=9.0 as it is not available at version 10 yet.
    + Removing restrictions on phrophet and xgboost models when trained on remote compute.
    + Improved logging in AutoML
    + The error handling for custom featurization in forecasting tasks was improved.
    + Added functionality to allow users to include lagged features to generate forecasts.
    + Updates to error message to correctly display user error.
    + Support for cv_split_column_names to be used with training_data
    + Update logging the exception message and traceback.
  + **azureml-automl-runtime**
    + Enable guardrails for forecasting missing value imputations.
    + Improved logging in AutoML
    + Added fine grained error handling for data prep exceptions
    + Removing restrictions on phrophet and xgboost models when trained on remote compute.
    + `azureml-train-automl-runtime` and `azureml-automl-runtime` have updated dependencies for `pytorch`, `scipy`, and `cudatoolkit`. we now support `pytorch==1.4.0`, `scipy>=1.0.0,<=1.3.1`, and `cudatoolkit==10.1.243`.
    + The error handling for custom featurization in forecasting tasks was improved.
    + The forecasting data set frequency detection mechanism was improved.
    + Fixed issue with Prophet model training on some data sets.
    + The auto detection of max horizon during the forecasting was improved.
    + Added functionality to allow users to include lagged features to generate forecasts.
    +  Adds functionality in the forecast function to enable providing forecasts beyond the trained horizon without retraining the forecasting model.
    + Support for cv_split_column_names to be used with training_data
  + **azureml-contrib-automl-dnn-forecasting**
    + Improved logging in AutoML
  + **azureml-contrib-mir**
    + Added support for Windows services in ManagedInferencing
    + Remove old MIR workflows such as attach MIR compute, SingleModelMirWebservice class - Clean out model profiling placed in contrib-mir package
  + **azureml-contrib-pipeline-steps**
    + Minor fix for YAML support
    + ParallelRunStep is released to General Availability - azureml.contrib.pipeline.steps has a deprecation notice and is move to azureml.pipeline.steps
  + **azureml-contrib-reinforcementlearning**
    + RL Load testing tool
    + RL estimator has smart defaults
  + **azureml-core**
    + Remove old MIR workflows such as attach MIR compute, SingleModelMirWebservice class - Clean out model profiling placed in contrib-mir package
    + Fixed the information provided to the user in case of profiling failure: included request id and reworded the message to be more meaningful. Added new profiling workflow to profiling runners
    + Significantly Improved error text in case of Dataset execution failures.
    + Workspace private link CLI support added.
    + Added an optional parameter `invalid_lines` to `Dataset.Tabular.from_json_lines_files` that allows for specifying how to handle lines that contain invalid JSON.
    + We will be deprecating the run-based creation of compute in the next release. We recommend creating an actual Amlcompute cluster as a persistent compute target, and using the cluster name as the compute target in your run configuration. See example notebook here: aka.ms/amlcomputenb
    + Significantly improved error messages in case of Dataset execution failures.
  + **azureml-dataprep**
    + Made warning to upgrade pyarrow version more explicit.
    + Improved error handling and message returned in case of failure to execute dataflow.
  + **azureml-interpret**
    + Documentation updates to azureml-interpret package.
    + Fixed interpretability packages and notebooks to be compatible with latest sklearn update
  + **azureml-opendatasets**
    + return None when there is no data returned.
    + Improve the performance of to_pandas_dataframe.
  + **azureml-pipeline-core**
    + Quick fix for ParallelRunStep where loading from YAML was broken
    + ParallelRunStep is released to General Availability - azureml.contrib.pipeline.steps has a deprecation notice and is move to azureml.pipeline.steps - new features include: 1. Datasets as PipelineParameter 2. New parameter run_max_retry 3. Configurable append_row output file name
  + **azureml-pipeline-steps**
    + Deprecated azureml.dprep.Dataflow as a valid type for input data.
    + Quick fix for ParallelRunStep where loading from YAML was broken
    + ParallelRunStep is released to General Availability - azureml.contrib.pipeline.steps has a deprecation notice and is move to azureml.pipeline.steps - new features include:
      + Datasets as PipelineParameter
      + New parameter run_max_retry
      + Configurable append_row output file name
  + **azureml-telemetry**
    + Update logging the exception message and traceback.
  + **azureml-train-automl-client**
    + Improved logging in AutoML
    + Updates to error message to correctly display user error.
    + Support for cv_split_column_names to be used with training_data
    + Deprecated azureml.dprep.Dataflow as a valid type for input data.
    + Updated Mac to rely on cudatoolkit=9.0 as it is not available at version 10 yet.
    + Removing restrictions on phrophet and xgboost models when trained on remote compute.
    + `azureml-train-automl-runtime` and `azureml-automl-runtime` have updated dependencies for `pytorch`, `scipy`, and `cudatoolkit`. we now support `pytorch==1.4.0`, `scipy>=1.0.0,<=1.3.1`, and `cudatoolkit==10.1.243`.
    + Added functionality to allow users to include lagged features to generate forecasts.
  + **azureml-train-automl-runtime**
    + Improved logging in AutoML
    + Added fine grained error handling for data prep exceptions
    + Removing restrictions on phrophet and xgboost models when trained on remote compute.
    + `azureml-train-automl-runtime` and `azureml-automl-runtime` have updated dependencies for `pytorch`, `scipy`, and `cudatoolkit`. we now support `pytorch==1.4.0`, `scipy>=1.0.0,<=1.3.1`, and `cudatoolkit==10.1.243`.
    + Updates to error message to correctly display user error.
    + Support for cv_split_column_names to be used with training_data
  + **azureml-train-core**
    + Added a new set of HyperDrive specific exceptions. azureml.train.hyperdrive will now throw detailed exceptions.
  + **azureml-widgets**
    + AzureML Widgets is not displaying in JupyterLab
  

## 2020-05-11

### Azure Machine Learning SDK for Python v1.5.0

+ **New features**
  + **Preview features**
    + **azureml-contrib-reinforcementlearning**
        + Azure Machine Learning is releasing preview support for reinforcement learning using the [Ray](https://ray.io) framework. The `ReinforcementLearningEstimator` enables training of reinforcement learning agents across GPU and CPU compute targets in Azure Machine Learning.

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Fixes an accidentally left behind warning log in my previous PR. The log was used for debugging and accidentally was left behind.
    + Bug fix: inform clients about partial failure during profiling
  + **azureml-automl-core**
    + Speed up Prophet/AutoArima model in AutoML forecasting by enabling parallel fitting for the time series when data sets have multiple time series. In order to benefit from this new feature, you are recommended to set "max_cores_per_iteration = -1" (i.e., using all the available cpu cores) in AutoMLConfig.
    + Fix KeyError on printing guardrails in console interface
    + Fixed error message for experimentation_timeout_hours
    + Deprecated Tensorflow models for AutoML.
  + **azureml-automl-runtime**
    + Fixed error message for experimentation_timeout_hours
    + Fixed unclassified exception when trying to deserialize from cache store
    + Speed up Prophet/AutoArima model in AutoML forecasting by enabling parallel fitting for the time series when data sets have multiple time series.
    + Fixed the forecasting with enabled rolling window on the data sets where test/prediction set does not contain one of grains from the training set.
    + Improved handling of missing data
    + Fixed issue with prediction intervals during forecasting on data sets, containing time series, which are not aligned in time.
    + Added better validation of data shape for the forecasting tasks.
    + Improved the frequency detection.
    + Created better error message if the cross validation folds for forecasting tasks cannot be generated.
    + Fix console interface to print missing value guardrail correctly.
    + Enforcing datatype checks on cv_split_indices input in AutoMLConfig.
  + **azureml-cli-common**
    + Bug fix: inform clients about partial failure during profiling
  + **azureml-contrib-mir**
    + Adds a class azureml.contrib.mir.RevisionStatus which relays information about the currently deployed MIR revision and the most recent version specified by the user. This class is included in the MirWebservice object under 'deployment_status' attribute.
    + Enables update on Webservices of type MirWebservice and its child class SingleModelMirWebservice.
  + **azureml-contrib-reinforcementlearning**
    + Added support for Ray 0.8.3
    + AmlWindowsCompute only supports Azure Files as mounted storage
    + Renamed health_check_timeout to health_check_timeout_seconds
    + Fixed some class/method descriptions.
  + **azureml-core**
    + Enabled WASB -> Blob conversions in USGovernment and China clouds.
    + Fixes bug to allow Reader roles to use az ml run CLI commands to get run information
    + Removed unnecessary logging during Azure ML Remote Runs with input Datasets.
    + RCranPackage now supports "version" parameter for the CRAN package version.
    + Bug fix: inform clients about partial failure during profiling
    + Added European-style float handling for azureml-core.
    + Enabled workspace private link features in Azure ml sdk.
    + When creating a TabularDataset using `from_delimited_files`, you can specify whether empty values should be loaded as None or as empty string by setting the boolean argument `empty_as_string`.
    + Added European-style float handling for datasets.
    + Improved error messages on dataset mount failures.
  + **azureml-datadrift**
    + Data Drift results query from the SDK had a bug that didn't differentiate the minimum, maximum, and mean feature metrics, resulting in duplicate values. We have fixed this bug by prefixing target or baseline to the metric names. Before: duplicate min, max, mean. After: target_min, target_max, target_mean, baseline_min, baseline_max, baseline_mean.
  + **azureml-dataprep**
    + Improve handling of write restricted python environments when ensuring .NET Dependencies required for data delivery.
    + Fixed Dataflow creation on file with leading empty records.
    + Added error handling options for `to_partition_iterator` similar to `to_pandas_dataframe`.
  + **azureml-interpret**
    + Reduced explanation path length limits to reduce likelihood of going over Windows limit
    + Bugfix for sparse explanations created with the mimic explainer using a linear surrogate model.
  + **azureml-opendatasets**
    + Fix issue of MNIST's columns are parsed as string, which should be int.
  + **azureml-pipeline-core**
    + Allowing the option to regenerate_outputs when using a module that is embedded in a ModuleStep.
  + **azureml-train-automl-client**
    + Deprecated Tensorflow models for AutoML.
    + Fix users whitelisting unsupported algorithms in local mode
    + Doc fixes to AutoMLConfig.
    + Enforcing datatype checks on cv_split_indices input in AutoMLConfig.
    + Fixed issue with AutoML run failing in show_output
  + **azureml-train-automl-runtime**
    + Fixing a bug in Ensemble iterations that was preventing model download timeout from kicking in successfully.
  + **azureml-train-core**
    + Fix typo in azureml.train.dnn.Nccl class.
    + Supporting PyTorch version 1.5 in the PyTorch Estimator
    + Fix the issue that framework image can't be fetched in Fairfax region when using training framework estimators

  
## 2020-05-04
**New Notebook Experience**

You can now create, edit, and share machine learning notebooks and files directly inside the studio web experience of Azure Machine Learning. You can use all the classes and methods available in [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) from inside these notebooks
Get started [here](https://docs.microsoft.com/azure/machine-learning/how-to-run-jupyter-notebooks)

**New Features Introduced:**

+ Improved editor (Monaco editor) used by VS Code 
+ UI/UX improvements
+ Cell Toolbar
+ New Notebook Toolbar and Compute Controls
+ Notebook Status Bar 
+ Inline Kernel Switching
+ R Support
+ Accessibility and Localization improvements
+ Command Palette
+ Additional Keyboard Shortcuts
+ Autosave
+ Improved performance and reliability

Access the following web-based authoring tools from the studio:
	
| Web-based tool  | 	Description  | Edition | 
|---|---|---|
| Azure ML Studio Notebooks	  |  	First in-class authoring for notebook files and support all operation available in the Azure ML Python SDK. | Basic & Enterprise  |   

## 2020-04-27

### Azure Machine Learning SDK for Python v1.4.0

+ **New features**
  + AmlCompute clusters now support setting up a managed identity on the cluster at the time of provisioning. Just specify whether you would like to use a system-assigned identity or a user-assigned identity, and pass an identityId in the case of the latter. You can then set up permissions to access various resources like Storage or ACR in a way that the identity of the compute gets used to securely access the data, instead of a token-based approach that AmlCompute employs today. Check out our SDK reference for more information on the parameters.
  

+ **Breaking changes**
  + AmlCompute clusters supported a Preview feature around run-based creation, that we are planning on deprecating in two weeks. You can continue to create persistent compute targets as always by using the Amlcompute class, but the specific approach of specifying the identifier "amlcompute" as the compute target in run config will not be supported in the near future. 

+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + Enable support for unhashable type when calculating number of unique values in a column.
  + **azureml-core**
    + Improved stability when reading from Azure Blob Storage using a TabularDataset.
    + Improved documentation for the `grant_workspace_msi` parameter for `Datastore.register_azure_blob_store`.
    + Fixed bug with `datastore.upload` to support the `src_dir` argument ending with a `/` or `\`.
    + Added actionable error message when trying to upload to an Azure Blob Storage datastore that does not have an access key or SAS token.
  + **azureml-interpret**
    + Added upper bound to file size for the visualization data on uploaded explanations.
  + **azureml-train-automl-client**
    + Explicitly checking for label_column_name & weight_column_name parameters for AutoMLConfig to be of type string.
  + **azureml-contrib-pipeline-steps**
    + ParallelRunStep now supports dataset as pipeline parameter. User can construct pipeline with sample dataset and can change input dataset of the same type (file or tabular) for new pipeline run.

  
## 2020-04-13

### Azure Machine Learning SDK for Python v1.3.0

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Added additional telemetry around post-training operations.
    + Speeds up automatic ARIMA training by using conditional sum of squares (CSS) training for series of length longer than 100. Note that the length used is stored as the constant ARIMA_TRIGGER_CSS_TRAINING_LENGTH w/in the TimeSeriesInternal class at /src/azureml-automl-core/azureml/automl/core/shared/constants.py
    + The user logging of forecasting runs was improved, now more information on what phase is currently running will be shown in the log
    + Disallowed target_rolling_window_size to be set to values less than 2
  + **azureml-automl-runtime**
    + Improved the error message shown when duplicated timestamps are found.
    + Disallowed target_rolling_window_size to be set to values less than 2.
    + Fixed the lag imputation failure. The issue was caused by the insufficient number of observations needed to seasonally decompose a series. The "de-seasonalized" data is used to compute a partial autocorrelation function (PACF) to determine the lag length.
    + Enabled column purpose featurization customization for forecasting tasks by featurization config. Numerical and Categorical as column purpose for forecasting tasks are now supported.
    + Enabled drop column featurization customization for forecasting tasks by featurization config.
    + Enabled imputation customization for forecasting tasks by featurization config. Constant value imputation for target column and mean, median, most_frequent, and constant value imputation for training data are now supported.
  + **azureml-contrib-pipeline-steps**
    + Accept string compute names to be passed to ParallelRunConfig
  + **azureml-core**
    +  Added Environment.clone(new_name) API to create a copy of Environment object
    +  Environment.docker.base_dockerfile accepts filepath. If able to resolve a file, the content will be read into base_dockerfile environment property
    + Automatically reset mutually exclusive values for base_image and base_dockerfile when user manually sets a value in Environment.docker
    + Added user_managed flag in RSection that indicates whether the environment is managed by user or by AzureML.
    + Dataset: Fixed dataset download failure if data path containing unicode characters.
    + Dataset: Improved dataset mount caching mechanism to respect the minimum disk space requirement in Azure Machine Learning Compute, which avoids making the node unusable and causing the job to be canceled.
    + Dataset: We add an index for the time series column when you access a time series dataset as a pandas dataframes, which are used to speed up access to time series based data access.  Previously, the index was given the same name as the timestamp column, confusing users about which is the actual timestamp column and which is the index. We now don't give any specific name to the index since it should not be used as a column. 
    + Dataset: Fixed dataset authentication issue in sovereign cloud.
    + Dataset: Fixed `Dataset.to_spark_dataframe` failure for datasets created from Azure PostgreSQL datastores.
  + **azureml-interpret**
    + Added global scores to visualization if local importance values are sparse
    + Updated azureml-interpret to use interpret-community 0.9.*
    + Fixed issue with downloading explanation that had sparse evaluation data
    + Added support of sparse format of the explanation object in AutoML
  + **azureml-pipeline-core**
    + Support ComputeInstance as compute target in pipelines
  + **azureml-train-automl-client**
    + Added additional telemetry around post-training operations.
    + Fixed the regression in early stopping
    + Deprecated azureml.dprep.Dataflow as a valid type for input data.
    +  Changing default AutoML experiment time out to six days.
  + **azureml-train-automl-runtime**
    + Added additional telemetry around post-training operations.
    + added sparse AutoML e2e support
  + **azureml-opendatasets**
    + Added additional telemetry for service monitor.
    + Enable front door for blob to increase stability 

## 2020-03-23

### Azure Machine Learning SDK for Python v1.2.0

+ **Breaking changes**
  + Drop support for python 2.7

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Adds "--subscription-id" to `az ml model/computetarget/service` commands in the CLI
    + Adding support for passing customer-managed key(CMK) vault_url, key_name and key_version for ACI deployment
  + **azureml-automl-core** 
    + Enabled customized imputation with constant value for both X and y data forecasting tasks.
    + Fixed the issue in with showing error messages to user.    
  + **azureml-automl-runtime**
    + Fixed the issue in with forecasting on the data sets, containing grains with only one row
    + Decreased the amount of memory required by the forecasting tasks.
    + Added better error messages if time column has incorrect format.
    + Enabled customized imputation with constant value for both X and y data forecasting tasks.
  + **azureml-core**
    + Added support for loading ServicePrincipal from environment variables: AZUREML_SERVICE_PRINCIPAL_ID, AZUREML_SERVICE_PRINCIPAL_TENANT_ID, and AZUREML_SERVICE_PRINCIPAL_PASSWORD
    + Introduced a new parameter `support_multi_line` to `Dataset.Tabular.from_delimited_files`: By default (`support_multi_line=False`), all line breaks, including those in quoted field values, will be interpreted as a record break. Reading data this way is faster and more optimized for parallel execution on multiple CPU cores. However, it may result in silently producing more records with misaligned field values. This should be set to `True` when the delimited files are known to contain quoted line breaks.
    + Added the ability to register ADLS Gen2 in the Azure Machine Learning CLI
    + Renamed parameter 'fine_grain_timestamp' to 'timestamp' and parameter 'coarse_grain_timestamp' to 'partition_timestamp' for the with_timestamp_columns() method in TabularDataset to better reflect the usage of the parameters.
    + Increased max experiment name length to 255.
  + **azureml-interpret**
    + Updated azureml-interpret to interpret-community 0.7.*
  + **azureml-sdk**
    + Changing to dependencies with compatible version Tilde for the support of patching in pre-release and stable releases.


## 2020-03-11

### Azure Machine Learning SDK for Python v1.1.5

+ **Feature deprecation**
  + **Python 2.7**
    + Last version to support python 2.7

+ **Breaking changes**
  + **Semantic Versioning 2.0.0**
    + Starting with version 1.1 Azure ML Python SDK adopts Semantic Versioning 2.0.0. [Read more here](https://semver.org/). All subsequent versions will follow new numbering scheme and semantic versioning contract. 

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Change the endpoint CLI command name from 'az ml endpoint aks' to 'az ml endpoint real time' for consistency.
    + update CLI installation instructions for stable and experimental branch CLI
    + Single instance profiling was fixed to produce a recommendation and was made available in core sdk.
  + **azureml-automl-core**
    + Enabled the Batch mode inference (taking multiple rows once) for AutoML ONNX models
    + Improved the detection of frequency on the data sets, lacking data or containing irregular data points
    + Added the ability to remove data points not complying with the dominant frequency.
    + Changed the input of the constructor to take a list of options to apply the imputation options for corresponding columns.
    + The error logging has been improved.
  + **azureml-automl-runtime**
    + Fixed the issue with the error thrown if the grain was not present in the training set appeared in the test set
    + Removed the y_query requirement during scoring on forecasting service
    + Fixed the issue with forecasting when the data set contains short grains with long time gaps.
    + Fixed the issue when the auto max horizon is turned on and the date column contains dates in form of strings. Proper conversion and error messages were added for when conversion to date is not possible
    + Using native NumPy and SciPy for serializing and deserializing intermediate data for FileCacheStore (used for local AutoML runs)
    + Fixed a bug where failed child runs could get stuck in Running state.
    + Increased speed of featurization.
    + Fixed the frequency check during scoring, now the forecasting tasks do not require strict frequency equivalence between train and test set.
    + Changed the input of the constructor to take a list of options to apply the imputation options for corresponding columns.
    + Fixed errors related to lag type selection.
    + Fixed the unclassified error raised on the data sets, having grains with the single row
    + Fixed the issue with frequency detection slowness.
    + Fixes a bug in AutoML exception handling that caused the real reason for training failure to be replaced by an AttributeError.
  + **azureml-cli-common**
    + Single instance profiling was fixed to produce a recommendation and was made available in core sdk.
  + **azureml-contrib-mir**
    + Adds functionality in the MirWebservice class to retrieve the Access Token
    + Use token auth for MirWebservice by default during MirWebservice.run() call - Only refresh if call fails
    + Mir webservice deployment now requires proper Skus [Standard_DS2_v2, Standard_F16, Standard_A2_v2] instead of [Ds2v2, A2v2, and F16] respectively.
  + **azureml-contrib-pipeline-steps**
    + Optional parameter side_inputs added to ParallelRunStep. This parameter can be used to mount folder on the container. Currently supported types are DataReference and PipelineData.
    + Parameters passed in ParallelRunConfig can be overwritten by passing pipeline parameters now. New pipeline parameters supported aml_mini_batch_size, aml_error_threshold, aml_logging_level, aml_run_invocation_timeout (aml_node_count and aml_process_count_per_node are already part of earlier release).
  + **azureml-core**
    + Deployed AzureML Webservices will now default to `INFO` logging. This can be controlled by setting the `AZUREML_LOG_LEVEL` environment variable in the deployed service.
    + Python sdk uses discovery service to use 'api' endpoint instead of 'pipelines'.
    + Swap to the new routes in all SDK calls.
    + Changed routing of calls to the ModelManagementService to a new unified structure.
      + Made workspace update method publicly available.
      + Added image_build_compute parameter in workspace update method to allow user updating the compute for image build.
    + Added deprecation messages to the old profiling workflow. Fixed profiling cpu and memory limits.
    + Added RSection as part of Environment to run R jobs.
    + Added validation to `Dataset.mount` to raise error when source of the dataset is not accessible or does not contain any data.
    + Added `--grant-workspace-msi-access` as an additional parameter for the Datastore CLI for registering Azure Blob Container that will allow you to register Blob Container that is behind a VNet.
    + Single instance profiling was fixed to produce a recommendation and was made available in core sdk.
    + Fixed the issue in aks.py _deploy.
    + Validates the integrity of models being uploaded to avoid silent storage failures.
    + User may now specify a value for the auth key when regenerating keys for webservices.
    + Fixed bug where uppercase letters cannot be used as dataset's input name.
  + **azureml-defaults**
    + `azureml-dataprep` will now be installed as part of `azureml-defaults`. It is no longer required to install data prep[fuse] manually on compute targets to mount datasets.
  + **azureml-interpret**
    + Updated azureml-interpret to interpret-community 0.6.*
    + Updated azureml-interpret to depend on interpret-community 0.5.0
    + Added azureml-style exceptions to azureml-interpret
    + Fixed DeepScoringExplainer serialization for keras models
  + **azureml-mlflow**
    + Add support for sovereign clouds to azureml.mlflow
  + **azureml-pipeline-core**
    + Pipeline batch scoring notebook now uses ParallelRunStep
    + Fixed a bug where PythonScriptStep results could be incorrectly reused despite changing the arguments list
    + Added the ability to set columns' type when calling the parse_* methods on `PipelineOutputFileDataset`
  + **azureml-pipeline-steps**
    + Moved the `AutoMLStep` to the `azureml-pipeline-steps` package. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
    + Added documentation example for dataset as PythonScriptStep input
  + **azureml-tensorboard**
    + updated azureml-tensorboard to support tensorflow 2.0
    + Show correct port number when using a custom Tensorboard port on a Compute Instance
  + **azureml-train-automl-client**
    + Fixed an issue where certain packages may be installed at incorrect versions on remote runs.
    + fixed FeaturizationConfig overriding issue that filters custom featurization config.
  + **azureml-train-automl-runtime**
    + Fixed the issue with frequency detection in the remote runs
    + Moved the `AutoMLStep` in the `azureml-pipeline-steps` package. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
  + **azureml-train-core**
    + Supporting PyTorch version 1.4 in the PyTorch Estimator
  
## 2020-03-02

### Azure Machine Learning SDK for Python v1.1.2rc0 (Pre-release)

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Enabled the Batch mode inference (taking multiple rows once) for AutoML ONNX models
    + Improved the detection of frequency on the data sets, lacking data or containing irregular data points
    + Added the ability to remove data points not complying with the dominant frequency.
  + **azureml-automl-runtime**
    + Fixed the issue with the error thrown if the grain was not present in the training set appeared in the test set
    + Removed the y_query requirement during scoring on forecasting service
  + **azureml-contrib-mir**
    + Adds functionality in the MirWebservice class to retrieve the Access Token
  + **azureml-core**
    + Deployed AzureML Webservices will now default to `INFO` logging. This can be controlled by setting the `AZUREML_LOG_LEVEL` environment variable in the deployed service.
    + Fix iterating on `Dataset.get_all` to return all datasets registered with the workspace.
    + Improve error message when invalid type is passed to `path` argument of dataset creation APIs.
    + Python sdk uses discovery service to use 'api' endpoint instead of 'pipelines'.
    + Swap to the new routes in all SDK calls
    + Changes routing of calls to the ModelManagementService to a new unified structure
      + Made workspace update method publicly available.
      + Added image_build_compute parameter in workspace update method to allow user updating the compute for image build
    +  Added deprecation messages to the old profiling workflow. Fixed profiling cpu and memory limits
  + **azureml-interpret**
    + update azureml-interpret to interpret-community 0.6.*
  + **azureml-mlflow**
    + Add support for sovereign clouds to azureml.mlflow
  + **azureml-pipeline-steps**
    + Moved the `AutoMLStep` to the `azureml-pipeline-steps package`. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
  + **azureml-train-automl-client**
    + Fixed an issue where certain packages may be installed at incorrect versions on remote runs.
  + **azureml-train-automl-runtime**
    + Fixed the issue with frequency detection in the remote runs
    + Moved the `AutoMLStep` to the `azureml-pipeline-steps package`. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
  + **azureml-train-core**
    + Moved the `AutoMLStep` to the `azureml-pipeline-steps package`. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.

## 2020-02-18

### Azure Machine Learning SDK for Python v1.1.1rc0 (Pre-release)

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Single instance profiling was fixed to produce a recommendation and was made available in core sdk.
  + **azureml-automl-core**
    + The error logging has been improved.
  + **azureml-automl-runtime**
    + Fixed the issue with forecasting when the data set contains short grains with long time gaps.
    + Fixed the issue when the auto max horizon is turned on and the date column contains dates in form of strings. We added proper conversion and sensible error if conversion to date is not possible
    + Using native NumPy and SciPy for serializing and deserializing intermediate data for FileCacheStore (used for local AutoML runs)
    + Fixed a bug where failed child runs could get stuck in Running state.
  + **azureml-cli-common**
    + Single instance profiling was fixed to produce a recommendation and was made available in core sdk.
  + **azureml-core**
    + Added `--grant-workspace-msi-access` as an additional parameter for the Datastore CLI for registering Azure Blob Container that will allow you to register Blob Container that is behind a VNet
    + Single instance profiling was fixed to produce a recommendation and was made available in core sdk.
    + Fixed the issue in aks.py _deploy
    + Validates the integrity of models being uploaded to avoid silent storage failures.
  + **azureml-interpret**
    + added azureml-style exceptions to azureml-interpret
    + fixed DeepScoringExplainer serialization for keras models
  + **azureml-pipeline-core**
    + Pipeline batch scoring notebook now uses ParallelRunStep
  + **azureml-pipeline-steps**
    + Moved the `AutoMLStep` in the `azureml-pipeline-steps` package. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
  + **azureml-contrib-pipeline-steps**
    + Optional parameter side_inputs added to ParallelRunStep. This parameter can be used to mount folder on the container. Currently supported types are DataReference and PipelineData.
  + **azureml-tensorboard**
    + updated azureml-tensorboard to support tensorflow 2.0
  + **azureml-train-automl-client**
    + fixed FeaturizationConfig overriding issue that filters custom featurization config.
  + **azureml-train-automl-runtime**
    + Moved the `AutoMLStep` in the `azureml-pipeline-steps` package. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
  + **azureml-train-core**
    + Supporting PyTorch version 1.4 in the PyTorch Estimator
  
## 2020-02-04

### Azure Machine Learning SDK for Python v1.1.0rc0 (Pre-release)

+ **Breaking changes**
  + **Semantic Versioning 2.0.0**
    + Starting with version 1.1 Azure ML Python SDK adopts Semantic Versioning 2.0.0. [Read more here](https://semver.org/). All subsequent versions will follow new numbering scheme and semantic versioning contract. 
  
+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + Increased speed of featurization.
    + Fixed the frequency check during scoring, now in the forecasting tasks we do not require strict frequency equivalence between train and test set.
  + **azureml-core**
    + User may now specify a value for the auth key when regenerating keys for webservices.
  + **azureml-interpret**
    + Updated azureml-interpret to depend on interpret-community 0.5.0
  + **azureml-pipeline-core**
    + Fixed a bug where PythonScriptStep results could be incorrectly reused despite changing the arguments list
  + **azureml-pipeline-steps**
    + Added documentation example for dataset as PythonScriptStep input
  + **azureml-contrib-pipeline-steps**
    + Parameters passed in ParallelRunConfig can be overwritten by passing pipeline parameters now. New pipeline parameters supported aml_mini_batch_size, aml_error_threshold, aml_logging_level, aml_run_invocation_timeout (aml_node_count and aml_process_count_per_node are already part of earlier release).
  
## 2020-01-21

### Azure Machine Learning SDK for Python v1.0.85

+ **New features**
  + **azureml-core**
    + Get the current core usage and quota limitation for AmlCompute resources in a given workspace and subscription
  
  + **azureml-contrib-pipeline-steps**
    + Enable user to pass tabular dataset as intermediate result from previous step to parallelrunstep

+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + Removed the requirement of y_query column in the request to the deployed forecasting service. 
    + The 'y_query' was removed from the Dominick's Orange Juice notebook service request section.
    + Fixed the bug preventing forecasting on the deployed models, operating on data sets with date time columns.
    + Added Matthews Correlation Coefficient as a classification metric, for both binary and multiclass classification.
  + **azureml-contrib-interpret**
    + Removed text explainers from azureml-contrib-interpret as text explanation has been moved to the interpret-text repo that will be released soon.
  + **azureml-core**
    + Dataset: usages for file dataset no longer depend on numpy and pandas to be installed in the python env.
    + Changed LocalWebservice.wait_for_deployment() to check the status of the local Docker container before trying to ping its health endpoint, greatly reducing the amount of time it takes to report a failed deployment.
    + Fixed the initialization of an internal property used in LocalWebservice.reload() when the service object is created from an existing deployment using the LocalWebservice() constructor.
    + Edited error message for clarification.
    + Added a new method called get_access_token() to AksWebservice that will return AksServiceAccessToken object, which contains access token, refresh after timestamp, expiry on timestamp and token type. 
    + Deprecated existing get_token() method in AksWebservice as the new method returns all of the information this method returns.
    + Modified output of az ml service get-access-token command. Renamed token to accessToken and refreshBy to refreshAfter. Added expiryOn and tokenType properties.
    + Fixed get_active_runs
  + **azureml-explain-model**
    + updated shap to 0.33.0 and interpret-community to 0.4.*
  + **azureml-interpret**
    + updated shap to 0.33.0 and interpret-community to 0.4.*
  + **azureml-train-automl-runtime**
    + Added Matthews Correlation Coefficient as a classification metric, for both binary and multiclass classification.
    + Deprecate preprocess flag from code and replaced with featurization -featurization is on by default

## 2020-01-06

### Azure Machine Learning SDK for Python v1.0.83

+ **New features**
  + Dataset: Add two options `on_error` and `out_of_range_datetime` for `to_pandas_dataframe` to fail when data has error values instead of filling them with `None`.
  + Workspace: Added the `hbi_workspace` flag for workspaces with sensitive data that enables further encryption and disables advanced diagnostics on workspaces. We also added support for bringing your own keys for the associated Cosmos DB instance, by specifying the `cmk_keyvault` and `resource_cmk_uri` parameters when creating a workspace, which creates a Cosmos DB instance in your subscription while provisioning your workspace. [Read more here.](https://docs.microsoft.com/azure/machine-learning/concept-enterprise-security#azure-cosmos-db)

+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + Fixed a regression that caused a TypeError to be raised when running AutoML on Python versions below 3.5.4.
  + **azureml-core**
    + Fixed bug in `datastore.upload_files` where relative path that didn't start with `./` was not able to be used.
    + Added deprecation messages for all Image class codepaths
    + Fixed Model Management URL construction for Azure China 21Vianet region.
    + Fixed issue where models using source_dir couldn't be packaged for Azure Functions.    
    + Added an option to [Environment.build_local()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) to push an image into AzureML workspace container registry
    + Updated the SDK to use new token library on Azure synapse in a back compatible manner.
  + **azureml-interpret**
    + Fixed bug where None was returned when no explanations were available for download. Now raises an exception, matching behavior elsewhere.
  + **azureml-pipeline-steps**
    + Disallowed passing `DatasetConsumptionConfig`s to `Estimator`'s `inputs` parameter when the `Estimator` will be used in an `EstimatorStep`.
  + **azureml-sdk**
    + Added AutoML client to azureml-sdk package, enabling remote AutoML runs to be submitted without installing the full AutoML package.
  + **azureml-train-automl-client**
    + Corrected alignment on console output for AutoML runs
    + Fixed a bug where incorrect version of pandas may be installed on remote amlcompute.

## 2019-12-23

### Azure Machine Learning SDK for Python v1.0.81

+ **Bug fixes and improvements**
  + **azureml-contrib-interpret**
    + defer shap dependency to interpret-community from azureml-interpret
  + **azureml-core**
    + Compute target can now be specified as a parameter to the corresponding deployment config objects. This is specifically the name of the compute target to deploy to, not the SDK object.
    + Added CreatedBy information to Model and Service objects. May be accessed through <var>.created_by
    + Fixed ContainerImage.run(), which was not correctly setting up the Docker container's HTTP port.
    + Make `azureml-dataprep` optional for `az ml dataset register` CLI command
    + Fixed a bug where `TabularDataset.to_pandas_dataframe` would incorrectly fall back to an alternate reader and print out a warning.
  + **azureml-explain-model**
    + defer shap dependency to interpret-community from azureml-interpret
  + **azureml-pipeline-core**
    + Added new pipeline step `NotebookRunnerStep`, to run a local notebook as a step in pipeline.
    + Removed deprecated get_all functions for PublishedPipelines, Schedules, and PipelineEndpoints
  + **azureml-train-automl-client**
    + Started deprecation of data_script as an input to AutoML.


## 2019-12-09

### Azure Machine Learning SDK for Python v1.0.79

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Removed featurizationConfig to be logged
      + Updated logging to log "auto"/"off"/"customized" only.
  + **azureml-automl-runtime**
    + Added support for pandas. Series and pandas. Categorical for detecting column data type. Previously only supported numpy.ndarray
      + Added related code changes to handle categorical dtype correctly.
    + The forecast function interface was improved: the y_pred parameter was made optional. -The docstrings were improved.
  + **azureml-contrib-dataset**
    + Fixed a bug where labeled datasets could not be mounted.
  + **azureml-core**
    + Bug fix for `Environment.from_existing_conda_environment(name, conda_environment_name)`. User can create an instance of Environment that is exact replica of the local environment
    + Changed time series-related Datasets methods to `include_boundary=True` by default.
  + **azureml-train-automl-client**
    + Fixed issue where validation results are not printed when show output is set to false.


## 2019-11-25

### Azure Machine Learning SDK for Python v1.0.76

+ **Breaking changes**
  + Azureml-Train-AutoML upgrade issues
    + Upgrading to azureml-train-automl>=1.0.76 from azureml-train-automl<1.0.76 can cause partial installations, causing some AutoML imports to fail. To resolve this, you can run the setup script found at https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/automl_setup.cmd. Or if you are using pip directly you can:
      + "pip install --upgrade azureml-train-automl"
      + "pip install --ignore-installed azureml-train-automl-client"
    + or you can uninstall the old version before upgrading
      + "pip uninstall azureml-train-automl"
      + "pip install azureml-train-automl"

+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + AutoML will now take into account both true and false classes when calculating averaged scalar metrics for binary classification tasks.
    + Moved Machine learning and training code in AzureML-AutoML-Core to a new package AzureML-AutoML-Runtime.
  + **azureml-contrib-dataset**
    + When calling `to_pandas_dataframe` on a labeled dataset with the download option, you can now specify whether to overwrite existing files or not.
    + When calling `keep_columns` or `drop_columns` that results in a time series, label, or image column being dropped, the corresponding capabilities will be dropped for the dataset as well.
    + Fixed an issue with pytorch loader for the object detection task.
  + **azureml-contrib-interpret**
    + Removed explanation dashboard widget from azureml-contrib-interpret, changed package to reference the new one in interpret_community
    + Updated version of interpret-community to 0.2.0
  + **azureml-core**
    + Improve performance of `workspace.datasets`.
    + Added the ability to register Azure SQL Database Datastore using username and password authentication
    + Fix for loading RunConfigurations from relative paths.
    + When calling `keep_columns` or `drop_columns` that results in a time series column being dropped, the corresponding capabilities will be dropped for the dataset as well.
  + **azureml-interpret**
    + updated version of interpret-community to 0.2.0
  + **azureml-pipeline-steps**
    + Documented supported values for `runconfig_pipeline_params` for Azure machine learning pipeline steps.
  + **azureml-pipeline-core**
    + Added CLI option to download output in json format for Pipeline commands.
  + **azureml-train-automl**
    + Split AzureML-Train-AutoML into two packages, a client package AzureML-Train-AutoML-Client and an ML training package AzureML-Train-AutoML-Runtime
  + **azureml-train-automl-client**
    + Added a thin client for submitting AutoML experiments without needing to install any machine learning dependencies locally.
    + Fixed logging of automatically detected lags, rolling window sizes and maximal horizons in the remote runs.
  + **azureml-train-automl-runtime**
    + Added a new AutoML package to isolate machine learning and runtime components from the client.
  + **azureml-contrib-train-rl**
    + Added reinforcement learning support in SDK.
    + Added AmlWindowsCompute support in RL SDK.


## 2019-11-11

### Azure Machine Learning SDK for Python v1.0.74

  + **Preview features**
    + **azureml-contrib-dataset**
      + After importing azureml-contrib-dataset, you can call `Dataset.Labeled.from_json_lines` instead of `._Labeled` to create a labeled dataset.
      + When calling `to_pandas_dataframe` on a labeled dataset with the download option, you can now specify whether to overwrite existing files or not.
      + When calling `keep_columns` or `drop_columns` that results in a time series, label, or image column being dropped, the corresponding capabilities will be dropped for the dataset as well.
      + Fixed issues with PyTorch loader when calling `dataset.to_torchvision()`.

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Added Model Profiling to the preview CLI.
    + Fixes breaking change in Azure Storage causing AzureML CLI to fail.
    + Added Load Balancer Type to MLC for AKS types
  + **azureml-automl-core**
    + Fixed the issue with detection of maximal horizon on time series, having missing values and multiple grains.
    + Fixed the issue with failures during generation of cross validation splits.
    + Replace this section with a message in markdown format to appear in the release notes: -Improved handling of short grains in the forecasting data sets.
    + Fixed the issue with masking of some user information during logging. -Improved logging of the errors during forecasting runs.
    + Adding psutil as a conda dependency to the autogenerated yml deployment file.
  + **azureml-contrib-mir**
    + Fixes breaking change in Azure Storage causing AzureML CLI to fail.
  + **azureml-core**
    + Fixes a bug that caused models deployed on Azure Functions to produce 500s.
    + Fixed an issue where the amlignore file was not applied on snapshots.
    + Added a new API amlcompute.get_active_runs that returns a generator for running and queued runs on a given amlcompute.
    + Added Load Balancer Type to MLC for AKS types.
    + Added append_prefix bool parameter to download_files in run.py and download_artifacts_from_prefix in artifacts_client. This flag is used to selectively flatten the origin filepath so only the file or folder name is added to the output_directory
    + Fix deserialization issue for `run_config.yml` with dataset usage.
    + When calling `keep_columns` or `drop_columns` that results in a time series column being dropped, the corresponding capabilities will be dropped for the dataset as well.
  + **azureml-interpret**
    + Updated interpret-community version to 0.1.0.3
  + **azureml-train-automl**
    + Fixed an issue where automl_step might not print validation issues.
    + Fixed register_model to succeed even if the model's environment is missing dependencies locally.
    + Fixed an issue where some remote runs were not docker enabled.
    + Add logging of the exception that is causing a local run to fail prematurely.
  + **azureml-train-core**
    + Consider resume_from runs in the calculation of automated hyperparameter tuning best child runs.
  + **azureml-pipeline-core**
    + Fixed parameter handling in pipeline argument construction.
    + Added pipeline description and step type yaml parameter.
    + New yaml format for Pipeline step and added deprecation warning for old format.



## 2019-11-04

### Web experience

The collaborative workspace landing page at [https://ml.azure.com](https://ml.azure.com) has been enhanced and rebranded as the Azure Machine Learning studio (preview).

From the studio, you can train, test, deploy, and manage Azure Machine Learning assets such as datasets, pipelines, models, endpoints, and more.

Access the following web-based authoring tools from the studio:

| Web-based tool | Description | Edition |
|-|-|-|
| Notebook VM(preview) | Fully managed cloud-based workstation | Basic & Enterprise |
| [Automated machine learning](tutorial-first-experiment-automated-ml.md) (preview) | No code experience for automating machine learning model development | Enterprise |
| [Designer](concept-designer.md) (preview) | Drag-and-drop machine learning modeling tool formerly known as the designer | Enterprise |


### Azure Machine Learning designer enhancements

+ Formerly known as the visual interface 
+    11 new [modules](algorithm-module-reference/module-reference.md) including recommenders, classifiers, and training utilities including feature engineering, cross validation, and data transformation.

### R SDK 
 
Data scientists and AI developers use the [Azure Machine Learning SDK for R](tutorial-1st-r-experiment.md) to build and run machine learning workflows with Azure Machine Learning.

The Azure Machine Learning SDK for R uses the `reticulate` package to bind to the Python SDK. By binding directly to Python, the SDK for R allows you access to core objects and methods implemented in the Python SDK from any R environment you choose.

Main capabilities of the SDK include:

+    Manage cloud resources for monitoring, logging, and organizing your machine learning experiments.
+    Train models using cloud resources, including GPU-accelerated model training.
+    Deploy your models as webservices on Azure Container Instances (ACI) and Azure Kubernetes Service (AKS).

See the [package website](https://azure.github.io/azureml-sdk-for-r) for complete documentation.

### Azure Machine Learning integration with Event Grid 

Azure Machine Learning is now a resource provider for Event Grid, you can configure machine learning events through the Azure portal or Azure CLI. Users can create events for run completion, model registration, model deployment and data drift detected. These events can be routed to event handlers supported by Event Grid for consumption. See machine learning event [schema](https://docs.microsoft.com/azure/event-grid/event-schema-machine-learning) and [tutorial](how-to-use-event-grid.md) articles for more details.

## 2019-10-31

### Azure Machine Learning SDK for Python v1.0.72

+ **New features**
  + Added dataset monitors through the [**azureml-datadrift**](https://docs.microsoft.com/python/api/azureml-datadrift) package, allowing for monitoring time series datasets for data drift or other statistical changes over time. Alerts and events can be triggered if drift is detected or other conditions on the data are met. See [our documentation](https://aka.ms/datadrift) for details.
  + Announcing two new editions (also referred to as a SKU interchangeably) in Azure Machine Learning. With this release, you can now create either a Basic or Enterprise Azure Machine Learning workspace. All existing workspaces will be defaulted to the Basic edition, and you can go to the Azure portal or to the studio to upgrade the workspace anytime. You can create either a Basic or Enterprise workspace from the Azure portal. Please read [our documentation](https://docs.microsoft.com/azure/machine-learning/how-to-manage-workspace) to learn more. From the SDK, the edition of your workspace can be determined using the "sku" property of your workspace object.
  + We have also made enhancements to Azure Machine Learning Compute - you can now view metrics for your clusters (like total nodes, running nodes, total core quota) in Azure Monitor, besides viewing Diagnostic logs for debugging. In addition, you can also view currently running or queued runs on your cluster and details such as the IPs of the various nodes on your cluster. You can view these either in the portal or by using corresponding functions in the SDK or CLI.

  + **Preview features**
    + We are releasing preview support for disk encryption of your local SSD in Azure Machine Learning Compute. Please raise a technical support ticket to get your subscription whitelisted to use this feature.
    + Public Preview of Azure Machine Learning Batch Inference. Azure Machine Learning Batch Inference targets large inference jobs that are not time-sensitive. Batch Inference provides cost-effective inference compute scaling, with unparalleled throughput for asynchronous applications. It is optimized for high-throughput, fire-and-forget inference over large collections of data.
    + [**azureml-contrib-dataset**](https://docs.microsoft.com/python/api/azureml-contrib-dataset)
        + Enabled functionalities for labeled dataset
        ```Python
        import azureml.core
        from azureml.core import Workspace, Datastore, Dataset
        import azureml.contrib.dataset
        from azureml.contrib.dataset import FileHandlingOption, LabeledDatasetTask

        # create a labeled dataset by passing in your JSON lines file
        dataset = Dataset._Labeled.from_json_lines(datastore.path('path/to/file.jsonl'), LabeledDatasetTask.IMAGE_CLASSIFICATION)

        # download or mount the files in the `image_url` column
        dataset.download()
        dataset.mount()

        # get a pandas dataframe
        from azureml.data.dataset_type_definitions import FileHandlingOption
        dataset.to_pandas_dataframe(FileHandlingOption.DOWNLOAD)
        dataset.to_pandas_dataframe(FileHandlingOption.MOUNT)

        # get a Torchvision dataset
        dataset.to_torchvision()
        ```

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + CLI now supports model packaging.
    + Added dataset CLI. For more information: `az ml dataset --help`
    + Added support for deploying and packaging supported models (ONNX, scikit-learn, and TensorFlow) without an InferenceConfig instance.
    + Added overwrite flag for service deployment (ACI and AKS) in SDK and CLI. If provided, will overwrite the existing service if service with name already exists. If service doesn't exist, will create new service.
    + Models can be registered with two new frameworks, Onnx and Tensorflow. - Model registration accepts sample input data, sample output data and resource configuration for the model.
  + **azureml-automl-core**
    + Training an iteration would run in a child process only when runtime constraints are being set.
    + Added a guardrail for forecasting tasks, to check whether a specified max_horizon will cause a memory issue on the given machine or not. If it will, a guardrail message will be displayed.
    + Added support for complex frequencies like two years and one month. -Added comprehensible error message if frequency cannot be determined.
    + Add azureml-defaults to auto generated conda env to solve the model deployment failure
    + Allow intermediate data in Azure Machine Learning Pipeline to be converted to tabular dataset and used in `AutoMLStep`.
    + Implemented column purpose update for streaming.
    + Implemented transformer parameter update for Imputer and HashOneHotEncoder for streaming.
    + Added the current data size and the minimum required data size to the validation error messages.
    + Updated the minimum required data size for Cross-validation to guarantee a minimum of two samples in each validation fold.
  + **azureml-cli-common**
    + CLI now supports model packaging.
    + Models can be registered with two new frameworks, Onnx and Tensorflow.
    + Model registration accepts sample input data, sample output data and resource configuration for the model.
  + **azureml-contrib-gbdt**
    + fixed the release channel for the notebook
    + Added a warning for non-AmlCompute compute target that we don't support
    + Added LightGMB Estimator to azureml-contrib-gbdt package
  + [**azureml-core**](https://docs.microsoft.com/python/api/azureml-core)
    + CLI now supports model packaging.
    + Add deprecation warning for deprecated Dataset APIs. See Dataset API change notice at https://aka.ms/tabular-dataset.
    + Change [`Dataset.get_by_id`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29#get-by-id-workspace--id-) to return registration name and version if the dataset is registered.
    + Fix a bug that ScriptRunConfig with dataset as argument cannot be used repeatedly to submit experiment run.
    + Datasets retrieved during a run will be tracked and can be seen in the run details page or by calling [`run.get_details()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29#get-details--) after the run is complete.
    + Allow intermediate data in Azure Machine Learning Pipeline to be converted to tabular dataset and used in [`AutoMLStep`](/python/api/azureml-train-automl-runtime/azureml.train.automl.runtime.automlstep).
    + Added support for deploying and packaging supported models (ONNX, scikit-learn, and TensorFlow) without an InferenceConfig instance.
    + Added overwrite flag for service deployment (ACI and AKS) in SDK and CLI. If provided, will overwrite the existing service if service with name already exists. If service doesn't exist, will create new service.
    +  Models can be registered with two new frameworks, Onnx and Tensorflow. Model registration accepts sample input data, sample output data and resource configuration for the model.
    + Added new datastore for Azure Database for MySQL. Added example for using Azure Database for MySQL in DataTransferStep in Azure Machine Learning Pipelines.
    + Added functionality to add and remove tags from experiments Added functionality to remove tags from runs
    + Added overwrite flag for service deployment (ACI and AKS) in SDK and CLI. If provided, will overwrite the existing service if service with name already exists. If service doesn't exist, will create new service.
  + [**azureml-datadrift**](https://docs.microsoft.com/python/api/azureml-datadrift)
    + Moved from `azureml-contrib-datadrift` into `azureml-datadrift`
    + Added support for monitoring time series datasets for drift and other statistical measures
    + New methods `create_from_model()` and `create_from_dataset()` to the [`DataDriftDetector`](https://docs.microsoft.com/python/api/azureml-datadrift/azureml.datadrift.datadriftdetector(class)) class. The `create()` method will be deprecated.
    + Adjustments to the visualizations in Python and UI in the Azure Machine Learning studio.
    + Support weekly and monthly monitor scheduling, in addition to daily for dataset monitors.
    + Support backfill of data monitor metrics to analyze historical data for dataset monitors.
    + Various bug fixes
  + [**azureml-pipeline-core**](https://docs.microsoft.com/python/api/azureml-pipeline-core)
    + azureml-dataprep is no longer needed to submit an Azure Machine Learning Pipeline run from the pipeline `yaml` file.
  + [**azureml-train-automl**](/python/api/azureml-train-automl-runtime/)
    + Add azureml-defaults to auto generated conda env to solve the model deployment failure
    + AutoML remote training now includes azureml-defaults to allow reuse of training env for inference.
  + **azureml-train-core**
    + Added PyTorch 1.3 support in [`PyTorch`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch) estimator

## 2019-10-21

### Visual interface (preview)

+ The Azure Machine Learning visual interface (preview) has been overhauled to run on [Azure Machine Learning pipelines](concept-ml-pipelines.md). Pipelines (previously known as experiments) authored in the visual interface are now fully integrated with the core Azure Machine Learning experience.
  + Unified management experience with SDK assets
  + Versioning and tracking for visual interface models, pipelines, and endpoints
  + Redesigned UI
  + Added batch inference deployment
  + Added Azure Kubernetes Service (AKS) support for inference compute targets
  + New Python-step pipeline authoring workflow
  + New [landing page](https://ml.azure.com) for visual authoring tools

+ **New modules**
  + Apply math operation
  + Apply SQL transformation
  + Clip values
  + Summarize data
  + Import from SQL Database

## 2019-10-14

### Azure Machine Learning SDK for Python v1.0.69

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Limiting model explanations to best run rather than computing explanations for every run. Making this behavior change for local, remote and ADB.
    + Added support for on-demand model explanations for UI
    + Added psutil as a dependency of `automl` and included psutil as a conda dependency in amlcompute.
    + Fixed the issue with heuristic lags and rolling window sizes on the forecasting data sets some series of which can cause linear algebra errors
      + Added print out for the heuristically determined parameters in the forecasting runs.
  + **azureml-contrib-datadrift**
    + Added protection while creating output metrics if dataset level drift is not in the first section.
  + **azureml-contrib-interpret**
    + azureml-contrib-explain-model package has been renamed to azureml-contrib-interpret
  + **azureml-core**
    + Added API to unregister datasets. `dataset.unregister_all_versions()`
    + azureml-contrib-explain-model package has been renamed to azureml-contrib-interpret.
  + **[azureml-core](https://docs.microsoft.com/python/api/azureml-core)**
    + Added API to unregister datasets. dataset.[unregister_all_versions()](https://docs.microsoft.com/python/api/azureml-core/azureml.data.abstract_datastore.abstractdatastore#unregister--).
    + Added Dataset API to check data changed time. `dataset.data_changed_time`.
    + Being able to consume `FileDataset` and `TabularDataset` as inputs to `PythonScriptStep`, `EstimatorStep`, and `HyperDriveStep` in Azure Machine Learning Pipeline
    + Performance of `FileDataset.mount` has been improved for folders with a large number of files
    + Being able to consume [FileDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.filedataset) and [TabularDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset) as inputs to [PythonScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep), [EstimatorStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.estimatorstep), and [HyperDriveStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.hyperdrivestep) in the Azure Machine Learning Pipeline.
    + Performance of FileDataset.[mount()](https://docs.microsoft.com/python/api/azureml-core/azureml.data.filedataset#mount-mount-point-none----kwargs-) has been improved for folders with a large number of files
    + Added URL to known error recommendations in run details.
    + Fixed a bug in run.get_metrics where requests would fail if a run had too many children
    + Fixed a bug in [run.get_metrics](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run#get-metrics-name-none--recursive-false--run-type-none--populate-false-) where requests would fail if a run had too many children
    + Added support for authentication on Arcadia cluster.
    + Creating an Experiment object gets or creates the experiment in the Azure Machine Learning workspace for run history tracking. The experiment ID and archived time are populated in the Experiment object on creation. Example: experiment = Experiment(workspace, "New Experiment") experiment_id = experiment.id archive() and reactivate() are functions that can be called on an experiment to hide and restore the experiment from being shown in the UX or returned by default in a call to list experiments. If a new experiment is created with the same name as an archived experiment, you can rename the archived experiment when reactivating by passing a new name. There can only be one active experiment with a given name. Example: experiment1 = Experiment(workspace, "Active Experiment") experiment1.archive() # Create new active experiment with the same name as the archived. experiment2. = Experiment(workspace, "Active Experiment") experiment1.reactivate(new_name="Previous Active Experiment") The static method list() on Experiment can take a name filter and ViewType filter. ViewType values are "ACTIVE_ONLY", "ARCHIVED_ONLY" and "ALL" Example: archived_experiments = Experiment.list(workspace, view_type="ARCHIVED_ONLY") all_first_experiments = Experiment.list(workspace, name="First Experiment", view_type="ALL")
    + Support using environment for model deploy, and service update
  + **azureml-datadrift**
    + The show attribute of DataDriftDector class won't support optional argument 'with_details' anymore. The show attribute will only present data drift coefficient and data drift contribution of feature columns.
    + DataDriftDetector attribute 'get_output' behavior changes:
      + Input parameter start_time, end_time are optional instead of mandatory;
      + Input specific start_time and/or end_time with a specific run_id in the same invoking will result in value error exception because they are mutually exclusive
      + By input specific start_time and/or end_time, only results of scheduled runs will be returned;
      + Parameter 'daily_latest_only' is deprecated.
    + Support retrieving Dataset-based Data Drift outputs.
  + **azureml-explain-model**
    + Renames AzureML-explain-model package to AzureML-interpret, keeping the old package for backwards compatibility for now
    + fixed `automl` bug with raw explanations set to classification task instead of regression by default on download from ExplanationClient
    + Add support for `ScoringExplainer` to be created directly using `MimicWrapper`
  + **azureml-pipeline-core**
    + Improved performance for large Pipeline creation
  + **azureml-train-core**
    + Added TensorFlow 2.0 support in TensorFlow Estimator
  + **azureml-train-automl**
    + Creating an [Experiment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment) object gets or creates the experiment in the Azure Machine Learning workspace for run history tracking. The experiment ID and archived time are populated in the Experiment object on creation. Example:

        ```py
        experiment = Experiment(workspace, "New Experiment")
        experiment_id = experiment.id
        ```
        [archive()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment#archive--) and [reactivate()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment#reactivate-new-name-none-) are functions that can be called on an experiment to hide and restore the experiment from being shown in the UX or returned by default in a call to list experiments. If a new experiment is created with the same name as an archived experiment, you can rename the archived experiment when reactivating by passing a new name. There can only be one active experiment with a given name. Example:

        ```py
        experiment1 = Experiment(workspace, "Active Experiment")
        experiment1.archive()
        # Create new active experiment with the same name as the archived.
        experiment2 = Experiment(workspace, "Active Experiment")
        experiment1.reactivate(new_name="Previous Active Experiment")
        ```
        The static method [list()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment#list-workspace--experiment-name-none--view-type--activeonly---tags-none-) on Experiment can take a name filter and ViewType filter. ViewType values are "ACTIVE_ONLY", "ARCHIVED_ONLY" and "ALL". Example:

        ```py
        archived_experiments = Experiment.list(workspace, view_type="ARCHIVED_ONLY")
        all_first_experiments = Experiment.list(workspace, name="First Experiment", view_type="ALL")
        ```
    + Support using environment for model deploy, and service update.
  + **[azureml-datadrift](https://docs.microsoft.com/python/api/azureml-datadrift)**
    + The show attribute of [DataDriftDetector](https://docs.microsoft.com/python/api/azureml-datadrift/azureml.datadrift.datadriftdetector.datadriftdetector) class won't support optional argument 'with_details' anymore. The show attribute will only present data drift coefficient and data drift contribution of feature columns.
    + DataDriftDetector function [get_output]https://docs.microsoft.com/python/api/azureml-datadrift/azureml.datadrift.datadriftdetector.datadriftdetector#get-output-start-time-none--end-time-none--run-id-none-) behavior changes:
      + Input parameter start_time, end_time are optional instead of mandatory;
      + Input specific start_time and/or end_time with a specific run_id in the same invoking will result in value error exception because they are mutually exclusive;
      + By input specific start_time and/or end_time, only results of scheduled runs will be returned;
      + Parameter 'daily_latest_only' is deprecated.
    + Support retrieving Dataset-based Data Drift outputs.
  + **azureml-explain-model**
    + Renames AzureML-explain-model package to AzureML-interpret, keeping the old package for backwards compatibility for now.
    + fixed AutoML bug with raw explanations set to classification task instead of regression by default on download from ExplanationClient.
    + Add support for [ScoringExplainer](/python/api/azureml-interpret/azureml.interpret.scoring.scoring_explainer.scoringexplainer?view=azure-ml-py) to be created directly using MimicWrapper
  + **[azureml-pipeline-core](https://docs.microsoft.com/python/api/azureml-pipeline-core)**
    + Improved performance for large Pipeline creation.
  + **[azureml-train-core](https://docs.microsoft.com/python/api/azureml-train-core)**
    + Added TensorFlow 2.0 support in [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow) Estimator.
  + **[azureml-train-automl](/python/api/azureml-train-automl-runtime/)**
    + The parent run will no longer be failed when setup iteration failed, as the orchestration already takes care of it.
    + Added local-docker and local-conda support for AutoML experiments
    + Added local-docker and local-conda support for AutoML experiments.


## 2019-10-08

### New web experience (preview) for Azure Machine Learning workspaces

The Experiment tab in the [new workspace portal](https://ml.azure.com) has been updated so data scientists can monitor experiments in a more performant way. You can explore the following features:
+ Experiment metadata to easily filter and sort your list of experiments
+ Simplified and performant experiment details pages that allow you to visualize and compare your runs
+ New design to run details pages to understand and monitor your training runs

## 2019-09-30

### Azure Machine Learning SDK for Python v1.0.65

  + **New features**
    + Added curated environments. These environments have been pre-configured with libraries for common machine learning tasks, and have been pre-build and cached as Docker images for faster execution. They appear by default in Workspace's list of environment, with prefix "AzureML".
    + Added curated environments. These environments have been pre-configured with libraries for common machine learning tasks, and have been pre-build and cached as Docker images for faster execution. They appear by default in [Workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace%28class%29)'s list of environment, with prefix "AzureML".

  + **azureml-train-automl**
  + **[azureml-train-automl](/python/api/azureml-train-automl-runtime/)**
    + Added the ONNX conversion support for the ADB and HDI

+ **Preview features**
  + **azureml-train-automl**
  + **[azureml-train-automl](/python/api/azureml-train-automl-runtime/)**
    + Supported BERT and BiLSTM as text featurizer (preview only)
    + Supported featurization customization for column purpose and transformer parameters (preview only)
    + Supported raw explanations when user enables model explanation during training (preview only)
    + Added Prophet for `timeseries` forecasting as a trainable pipeline (preview only)

  + **azureml-contrib-datadrift**
    + Packages relocated from azureml-contrib-datadrift to azureml-datadrift; the `contrib` package will be removed in a future release

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Introduced FeaturizationConfig to AutoMLConfig and AutoMLBaseSettings
    + Introduced FeaturizationConfig to [AutoMLConfig](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig) and AutoMLBaseSettings
      + Override Column Purpose for Featurization with given column and feature type
      + Override transformer parameters
    + Added deprecation message for explain_model() and retrieve_model_explanations()
    + Added Prophet as a trainable pipeline (preview only)
    + Added deprecation message for explain_model() and retrieve_model_explanations().
    + Added Prophet as a trainable pipeline (preview only).
    + Added support for automatic detection of target lags, rolling window size and maximal horizon. If one of target_lags, target_rolling_window_size or max_horizon is set to 'auto', the heuristics will be applied to estimate the value of corresponding parameter based on training data.
    + Fixed forecasting in the case when data set contains one grain column, this grain is of a numeric type and there is a gap between train and test set
    + Fixed the error message about the duplicated index in the remote run in forecasting tasks
    + Fixed forecasting in the case when data set contains one grain column, this grain is of a numeric type and there is a gap between train and test set.
    + Fixed the error message about the duplicated index in the remote run in forecasting tasks.
    + Added a guardrail to check whether a dataset is imbalanced or not. If it is, a guardrail message would be written to the console.
  + **azureml-core**
    + Added ability to retrieve SAS URL to model in storage through the model object. Ex: model.get_sas_url()
    + Introduce `run.get_details()['datasets']` to get datasets associated with the submitted run
    + Add API `Dataset.Tabular.from_json_lines_files` to create a TabularDataset from JSON Lines files. To learn about this tabular data in JSON Lines files on TabularDataset, please visit https://aka.ms/azureml-data for documentation.
    + Added additional VM size fields (OS Disk, number of GPUs) to the supported_vmsizes () function
    + Added additional fields to the list_nodes () function to show the run, the private and the public IP, the port etc.
    + Ability to specify a new field during cluster provisioning --remotelogin_port_public_access which can be set to enabled or disabled depending on whether you would like to leave the SSH port open or closed at the time of creating the cluster. If you do not specify it, the service will smartly open or close the port depending on whether you are deploying the cluster inside a VNet.
  + **azureml-explain-model**
  + **[azureml-core](https://docs.microsoft.com/python/api/azureml-core/azureml.core)**
    + Added ability to retrieve SAS URL to model in storage through the model object. Ex: model.[get_sas_url()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model#get-sas-urls--)
    + Introduce run.[get_details](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29#get-details--)['datasets'] to get datasets associated with the submitted run
    + Add API `Dataset.Tabular`.[from_json_lines_files()](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-json-lines-files-path--validate-true--include-path-false--set-column-types-none--partition-format-none-) to create a TabularDataset from JSON Lines files. To learn about this tabular data in JSON Lines files on TabularDataset, please visit https://aka.ms/azureml-data for documentation.
    + Added additional VM size fields (OS Disk, number of GPUs) to the [supported_vmsizes()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#supported-vmsizes-workspace--location-none-) function
    + Added additional fields to the [list_nodes()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#list-nodes--) function to show the run, the private and the public IP, the port etc.
    + Ability to specify a new field during cluster [provisioning](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#provisioning-configuration-vm-size-----vm-priority--dedicated---min-nodes-0--max-nodes-none--idle-seconds-before-scaledown-none--admin-username-none--admin-user-password-none--admin-user-ssh-key-none--vnet-resourcegroup-name-none--vnet-name-none--subnet-name-none--tags-none--description-none--remote-login-port-public-access--notspecified--) `--remotelogin_port_public_access` which can be set to enabled or disabled depending on whether you would like to leave the SSH port open or closed at the time of creating the cluster. If you do not specify it, the service will smartly open or close the port depending on whether you are deploying the cluster inside a VNet.
  + **azureml-explain-model**
    + Improved documentation for Explanation outputs in the classification scenario.
    + Added the ability to upload the predicted y values on the explanation for the evaluation examples. Unlocks more useful visualizations.
    + Added explainer property to MimicWrapper to enable getting the underlying MimicExplainer.
  + **azureml-pipeline-core**
    + Added notebook to describe Module, ModuleVersion, and ModuleStep
  + **azureml-pipeline-steps**
    + Added RScriptStep to support R script run via AML pipeline.
    + Fixed metadata parameters parsing in AzureBatchStep that was causing the error message "assignment for parameter SubscriptionId is not specified."
  + **azureml-train-automl**
    + Supported training_data, validation_data, label_column_name, weight_column_name as data input format
    + Added deprecation message for explain_model() and retrieve_model_explanations()
  + **[azureml-pipeline-core](https://docs.microsoft.com/python/api/azureml-pipeline-core)**
    + Added a [notebook](https://aka.ms/pl-modulestep) to describe [Module](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.module(class)), [ModuleVersion, and [ModuleStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.modulestep).
  + **[azureml-pipeline-steps](https://docs.microsoft.com/python/api/azureml-pipeline-steps)**
    + Added [RScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.rscriptstep) to support R script run via AML pipeline.
    + Fixed metadata parameters parsing in [AzureBatchStep that was causing the error message "assignment for parameter SubscriptionId is not specified".
  + **[azureml-train-automl](/python/api/azureml-train-automl-runtime/)**
    + Supported training_data, validation_data, label_column_name, weight_column_name as data input format.
    + Added deprecation message for [explain_model()](/python/api/azureml-train-automl-runtime/azureml.train.automl.runtime.automlexplainer#explain-model-fitted-model--x-train--x-test--best-run-none--features-none--y-train-none----kwargs-) and [retrieve_model_explanations()](/python/api/azureml-train-automl-runtime/azureml.train.automl.runtime.automlexplainer#retrieve-model-explanation-child-run-).


## 2019-09-16

### Azure Machine Learning SDK for Python v1.0.62

+ **New features**
  + Introduced the `timeseries`  trait on TabularDataset. This trait enables easy timestamp filtering on data a TabularDataset, such as taking all data between a range of time or the most recent data. To learn about this the `timeseries`  trait on TabularDataset, please visit https://aka.ms/azureml-data for documentation or https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/timeseries-datasets/tabular-timeseries-dataset-filtering.ipynb for an example notebook.
  + Enabled training with TabularDataset and FileDataset. Please visit https://aka.ms/dataset-tutorial for an example notebook.

  + **azureml-train-core**
      + Added `Nccl` and `Gloo` support in PyTorch estimator

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Deprecated the AutoML setting 'lag_length' and the LaggingTransformer.
    + Fixed correct validation of input data if they are specified in a Dataflow format
    + Modified the fit_pipeline.py to generate the graph json and upload to artifacts.
    + Rendered the graph under `userrun` using `Cytoscape`.
  + **azureml-core**
    + Revisited the exception handling in ADB code and make changes to as per new error handling
    + Added automatic MSI authentication for Notebook VMs.
    + Fixes bug where corrupt or empty models could be uploaded because of failed retries.
    + Fixed the bug where `DataReference` name changes when the `DataReference` mode changes (e.g. when calling `as_upload`, `as_download`, or `as_mount`).
    + Make `mount_point` and `target_path` optional for `FileDataset.mount` and `FileDataset.download`.
    + Exception that timestamp column cannot be found will be throw out if the time serials-related API is called without fine timestamp column assigned or the assigned timestamp columns are dropped.
    + Time serials columns should be assigned with column whose type is Date, otherwise exception is expected
    + Time serials columns assigning API 'with_timestamp_columns' can take None value fine/coarse timestamp column name, which will clear previously assigned timestamp columns.
    + Exception will be thrown out when either coarse grain or fine grained timestamp column is dropped with indication for user that dropping can be done after either excluding timestamp column in dropping list or call with_time_stamp with None value to release timestamp columns
    + Exception will be thrown out when either coarse grain or fine grained timestamp column is not included in keep columns list with indication for user that keeping can be done after either including timestamp column in keep column list or call with_time_stamp with None value to release timestamp columns.
    + Added logging for the size of a registered model.
  + **azureml-explain-model**
    + Fixed warning printed to console when "packaging" python package is not installed: "Using older than supported version of lightgbm, please upgrade to version greater than 2.2.1"
    + Fixed download model explanation with sharding for global explanations with many features
    + Fixed mimic explainer missing initialization examples on output explanation
    + Fixed immutable error on set properties when uploading with explanation client using two different types of models
    + Added a get_raw param to scoring explainer.explain() so one scoring explainer can return both engineered and raw values.
  + **azureml-train-automl**
    + Introduced public APIs from AutoML for supporting explanations from `automl` explain SDK - Newer way of supporting AutoML explanations by decoupling AutoML featurization and explain SDK - Integrated raw explanation support from azureml explain SDK for AutoML models.
    + Removing azureml-defaults from remote training environments.
    + Changed default cache store location from FileCacheStore based one to AzureFileCacheStore one for AutoML on Azure Databricks code path.
    + Fixed correct validation of input data if they are specified in a Dataflow format
  + **azureml-train-core**
    + Reverted source_directory_data_store deprecation.
    + Added ability to override azureml installed package versions.
    + Added dockerfile support in `environment_definition` parameter in estimators.
    + Simplified distributed training parameters in estimators.

         ```py
        from azureml.train.dnn import TensorFlow, Mpi, ParameterServer
        ```

## 2019-09-09

### New web experience (preview) for Azure Machine Learning workspaces
The new web experience enables data scientists and data engineers to complete their end-to-end machine learning lifecycle from prepping and visualizing data to training and deploying models in a single location.

![Azure Machine Learning workspace UI (preview)](./media/azure-machine-learning-release-notes/new-ui-for-workspaces.jpg)

**Key features:**

Using this new Azure Machine Learning interface, you can now:
+ Manage your notebooks or link out to Jupyter
+ [Run automated ML experiments](tutorial-first-experiment-automated-ml.md)
+ [Create datasets from local files, datastores, & web files](how-to-create-register-datasets.md)
+ Explore & prepare datasets for model creation
+ Monitor data drift for your models
+ View recent resources from a dashboard

At the time, of this release, the following browsers are supported: Chrome, Firefox, Safari, and Microsoft Edge Preview.

**Known issues:**

1. Refresh your browser if you see "Something went wrong! Error loading chunk files" when deployment is in progress.

1. Can't delete or rename file in Notebooks and Files. During Public Preview, you can use Jupyter UI or Terminal in Notebook VM to perform update file operations. Because it is a mounted network file system all changes, you make on Notebook VM are immediately reflected in the Notebook Workspace.

1. To SSH into the Notebook VM:
   1. Find the SSH keys that were created during VM setup. Or, find the keys in the Azure Machine Learning workspace > open Compute tab > locate Notebook VM in the list > open its properties: copy the keys from the dialog.
   1. Import those public and private SSH keys to your local machine.
   1. Use them to SSH into the Notebook VM.

## 2019-09-03
### Azure Machine Learning SDK for Python v1.0.60

+ **New features**
  + Introduced FileDataset, which references single or multiple files in your datastores or public urls. The files can be of any format. FileDataset provides you with the ability to download or mount the files to your compute. To learn about FileDataset, please visit https://aka.ms/file-dataset.
  + Added Pipeline Yaml Support for PythonScript Step, Adla Step, Databricks Step, DataTransferStep, and AzureBatch Step

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + AutoArima is now a suggestable pipeline for preview only.
    + Improved error reporting for forecasting.
    + Improved the logging by using custom exceptions instead of generic in the forecasting tasks.
    + Removed the check on max_concurrent_iterations to be less than total number of iterations.
    + AutoML models now return AutoMLExceptions
    + This release improves the execution performance of automated machine learning local runs.
  + **azureml-core**
    + Introduce Dataset.get_all(workspace), which returns a dictionary of `TabularDataset` and `FileDataset` objects keyed by their registration name.

    ```py
    workspace = Workspace.from_config()
    all_datasets = Dataset.get_all(workspace)
    mydata = all_datasets['my-data']
    ```

    + Introduce `parition_format` as argument to `Dataset.Tabular.from_delimited_files` and `Dataset.Tabular.from_parquet.files`. The partition information of each data path will be extracted into columns based on the specified format. '{column_name}' creates string column, and '{column_name:yyyy/MM/dd/HH/mm/ss}' creates datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' are used to extract year, month, day, hour, minute, and second for the datetime type. The partition_format should start from the position of first partition key until the end of file path. For example, given the path '../USA/2019/01/01/data.csv' where the partition is by country and time, partition_format='/{Country}/{PartitionDate:yyyy/MM/dd}/data.csv' creates string column 'Country' with value 'USA' and datetime column 'PartitionDate' with value '2019-01-01'.
        ```py
        workspace = Workspace.from_config()
        all_datasets = Dataset.get_all(workspace)
        mydata = all_datasets['my-data']
        ```

    + Introduce `partition_format` as argument to `Dataset.Tabular.from_delimited_files` and `Dataset.Tabular.from_parquet.files`. The partition information of each data path will be extracted into columns based on the specified format. '{column_name}' creates string column, and '{column_name:yyyy/MM/dd/HH/mm/ss}' creates datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' are used to extract year, month, day, hour, minute, and second for the datetime type. The partition_format should start from the position of first partition key until the end of file path. For example, given the path '../USA/2019/01/01/data.csv' where the partition is by country and time, partition_format='/{Country}/{PartitionDate:yyyy/MM/dd}/data.csv' creates string column 'Country' with value 'USA' and datetime column 'PartitionDate' with value '2019-01-01'.
    + `to_csv_files` and `to_parquet_files` methods have been added to `TabularDataset`. These methods enable conversion between a `TabularDataset` and a `FileDataset` by converting the data to files of the specified format.
    + Automatically log into the base image registry when saving a Dockerfile generated by Model.package().
    + 'gpu_support' is no longer necessary; AML now automatically detects and uses the nvidia docker extension when it is available. It will be removed in a future release.
    + Added support to create, update, and use PipelineDrafts.
    + This release improves the execution performance of automated machine learning local runs.
    + Users can query metrics from run history by name.
    + Improved the logging by using custom exceptions instead of generic in the forecasting tasks.
  + **azureml-explain-model**
    + Added feature_maps parameter to the new MimicWrapper, allowing users to get raw feature explanations.
    + Dataset uploads are now off by default for explanation upload, and can be re-enabled with upload_datasets=True
    + Added "is_law" filtering parameters to explanation list and download functions.
    + Adds method `get_raw_explanation(feature_maps)` to both global and local explanation objects.
    + Added version check to lightgbm with printed warning if below supported version
    + Optimized memory usage when batching explanations
    + AutoML models now return AutoMLExceptions
  + **azureml-pipeline-core**
    + Added support to create, update, and use PipelineDrafts - can be used to maintain mutable pipeline definitions and use them interactively to run
  + **azureml-train-automl**
    + Created feature to install specific versions of gpu-capable pytorch v1.1.0, :::no-loc text="cuda"::: toolkit 9.0, pytorch-transformers, which is required to enable BERT/ XLNet in the remote python runtime environment.
  + **azureml-train-core**
    + Early failure of some hyperparameter space definition errors directly in the sdk instead of server side.

### Azure Machine Learning Data Prep SDK v1.1.14
+ **Bug fixes and improvements**
  + Enabled writing to ADLS/ADLSGen2 using raw path and credentials.
  + Fixed a bug that caused `include_path=True` to not work for `read_parquet`.
  + Fixed `to_pandas_dataframe()` failure caused by exception "Invalid property value: hostSecret".
  + Fixed a bug where files could not be read on DBFS in Spark mode.

## 2019-08-19

### Azure Machine Learning SDK for Python v1.0.57
+ **New features**
  + Enabled `TabularDataset` to be consumed by AutomatedML. To learn more about `TabularDataset`, please visit https://aka.ms/azureml/howto/createdatasets.

+ **Bug fixes and improvements**
  + **automl-client-core-nativeclient**
    + Fixed the error, raised when training and/or validation labels (y and y_valid) are provided in the form of pandas dataframe but not as numpy array.
    + Updated interface to create a `RawDataContext` to only require the data and the `AutoMLBaseSettings` object.
    +  Allow AutoML users to drop training series that are not long enough when forecasting. - Allow AutoML users to drop grains from the test set that does not exist in the training set when forecasting.
  + **azure-cli-ml**
    + You can now update the TLS/SSL certificate for the scoring endpoint deployed on AKS cluster both for Microsoft generated and customer certificate.
  + **azureml-automl-core**
    + Fixed an issue in AutoML where rows with missing labels were not removed properly.
    + Improved error logging in AutoML; full error messages will now always be written to the log file.
    + AutoML has updated its package pinning to include `azureml-defaults`, `azureml-explain-model`, and `azureml-dataprep`. AutoML will no longer warn on package mismatches (except for `azureml-train-automl` package).
    + Fixed an issue in `timeseries`  where cv splits are of unequal size causing bin calculation to fail.
    + When running ensemble iteration for the Cross-Validation training type, if we ended up having trouble downloading the models trained on the entire dataset, we were having an inconsistency between the model weights and the models that were being fed into the voting ensemble.
    + Fixed the error, raised when training and/or validation labels (y and y_valid) are provided in the form of pandas dataframe but not as numpy array.
    + Fixed the issue with the forecasting tasks when None was encountered in the Boolean columns of input tables.
    + Allow AutoML users to drop training series that are not long enough when forecasting. - Allow AutoML users to drop grains from the test set that does not exist in the training set when forecasting.
  + **azureml-core**
    + Fixed issue with blob_cache_timeout parameter ordering.
    + Added external fit and transform exception types to system errors.
    + Added support for Key Vault secrets for remote runs. Add a azureml.core.keyvault.Keyvault class to add, get, and list secrets from the keyvault associated with your workspace. Supported operations are:
      + azureml.core.workspace.Workspace.get_default_keyvault()
      + azureml.core.keyvault.Keyvault.set_secret(name, value)
      + azureml.core.keyvault.Keyvault.set_secrets(secrets_dict)
      + azureml.core.keyvault.Keyvault.get_secret(name)
      + azureml.core.keyvault.Keyvault.get_secrets(secrets_list)
      + azureml.core.keyvault.Keyvault.list_secrets()
    + Additional methods to obtain default keyvault and get secrets during remote run:
      + azureml.core.workspace.Workspace.get_default_keyvault()
      + azureml.core.run.Run.get_secret(name)
      + azureml.core.run.Run.get_secrets(secrets_list)
    + Added additional override parameters to submit-hyperdrive CLI command.
    + Improve reliability of API calls be expanding retries to common requests library exceptions.
    + Add support for submitting runs from a submitted run.
    + Fixed expiring SAS token issue in FileWatcher, which caused files to stop being uploaded after their initial token had expired.
    + Supported importing HTTP csv/tsv files in dataset python SDK.
    + Deprecated the Workspace.setup() method. Warning message shown to users suggests using create() or get()/from_config() instead.
    + Added Environment.add_private_pip_wheel(), which enables uploading private custom python packages `whl`to the workspace and securely using them to build/materialize the environment.
    + You can now update the TLS/SSL certificate for the scoring endpoint deployed on AKS cluster both for Microsoft generated and customer certificate.
  + **azureml-explain-model**
    + Added parameter to add a model ID to explanations on upload.
    + Added `is_raw` tagging to explanations in memory and upload.
    + Added pytorch support and tests for azureml-explain-model package.
  + **azureml-opendatasets**
    + Support detecting and logging auto test environment.
    + Added classes to get US population by county and zip.
  + **azureml-pipeline-core**
    + Added label property to input and output port definitions.
  + **azureml-telemetry**
    + Fixed an incorrect telemetry configuration.
  + **azureml-train-automl**
    + Fixed the bug where on setup failure, error was not getting logged in "errors" field for the setup run and hence was not stored in parent run "errors".
    + Fixed an issue in AutoML where rows with missing labels were not removed properly.
    + Allow AutoML users to drop training series that are not long enough when forecasting.
    + Allow AutoML users to drop grains from the test set that do not exist in the training set when forecasting.
    + Now AutoMLStep passes through `automl` config to backend to avoid any issues on changes or additions of new config parameters.
    + AutoML Data Guardrail is now in public preview. User will see a Data Guardrail report (for classification/regression tasks) after training and also be able to access it through SDK API.
  + **azureml-train-core**
    + Added torch 1.2 support in PyTorch Estimator.
  + **azureml-widgets**
    + Improved confusion matrix charts for classification training.

### Azure Machine Learning Data Prep SDK v1.1.12
+ **New features**
  + Lists of strings can now be passed in as input to `read_*` methods.

+ **Bug fixes and improvements**
  + The performance of `read_parquet` has been significantly improved when running in Spark.
  + Fixed an issue where `column_type_builder` failed in case of a single column with ambiguous date formats.

### Azure portal
+ **Preview Feature**
  + Log and output file streaming is now available for run details pages. The files will stream updates in real time when the preview toggle is turned on.
  + Ability to set quota at a workspace level is released in preview. AmlCompute quotas are allocated at the subscription level, but we now allow you to distribute that quota between workspaces and allocate it for fair sharing and governance. Just click on the **Usages+Quotas** blade in the left navigation bar of your workspace and select the **Configure Quotas** tab. Note that you must be a subscription admin to be able to set quotas at the workspace level since this is a cross-workspace operation.

## 2019-08-05

### Azure Machine Learning SDK for Python v1.0.55

+ **New features**
  + Token-based authentication is now supported for the calls made to the scoring endpoint deployed on AKS. We will continue to support the current key based authentication and users can use one of these authentication mechanisms at a time.
  + Ability to register a blob storage that is behind the virtual network (VNet) as a datastore.

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Fixes a bug where validation size for CV splits is small and results in bad predicted vs. true charts for regression and forecasting.
    + The logging of forecasting tasks on the remote runs improved, now user is provided with comprehensive error message if the run was failed.
    + Fixed failures of `Timeseries` if preprocess flag is True.
    + Made some forecasting data validation error messages more actionable.
    + Reduced memory consumption of AutoML runs by dropping and/or lazy loading of datasets, especially in between process spawns
  + **azureml-contrib-explain-model**
    + Added model_task flag to explainers to allow user to override default automatic inference logic for model type
    + Widget changes: Automatically installs with `contrib`, no more `nbextension` install/enable - support explanation with just global feature importance (eg Permutative)
    + Dashboard changes: - Box plots and violin plots in addition to `beeswarm` plot on summary page - Much faster rerendering of `beeswarm` plot on 'Top -k' slider change - helpful message explaining how top-k is computed - Useful customizable messages in place of charts when data not provided
  + **azureml-core**
    + Added Model.package() method to create Docker images and Dockerfiles that encapsulate models and their dependencies.
    + Updated local webservices to accept InferenceConfigs containing Environment objects.
    + Fixed Model.register() producing invalid models when '.' (for the current directory) is passed as the model_path parameter.
    + Add Run.submit_child, the functionality mirrors Experiment.submit while specifying the run as the parent of the submitted child run.
    + Support configuration options from Model.register in Run.register_model.
    + Ability to run JAR jobs on existing cluster.
    + Now supporting instance_pool_id and cluster_log_dbfs_path parameters.
    + Added support for using an Environment object when deploying a Model to a Webservice. The Environment object can now be provided as a part of the InferenceConfig object.
    + Add appinsifht mapping for new regions - centralus - westus - northcentralus
    + Added documentation for all the attributes in all the Datastore classes.
    + Added blob_cache_timeout parameter to `Datastore.register_azure_blob_container`.
    + Added save_to_directory and load_from_directory methods to azureml.core.environment.Environment.
    + Added the "az ml environment download" and "az ml environment register" commands to the CLI.
    + Added Environment.add_private_pip_wheel method.
  + **azureml-explain-model**
    + Added dataset tracking to Explanations using the Dataset service (preview).
    + Decreased default batch size when streaming global explanations from 10k to 100.
    + Added model_task flag to explainers to allow user to override default automatic inference logic for model type.
  + **azureml-mlflow**
    + Fixed bug in mlflow.azureml.build_image where nested directories are ignored.
  + **azureml-pipeline-steps**
    + Added ability to run JAR jobs on existing Azure Databricks cluster.
    + Added support instance_pool_id and cluster_log_dbfs_path parameters for DatabricksStep step.
    + Added support for pipeline parameters in DatabricksStep step.
  + **azureml-train-automl**
    + Added `docstrings` for the Ensemble related files.
    + Updated docs to more appropriate language for `max_cores_per_iteration` and `max_concurrent_iterations`
    + The logging of forecasting tasks on the remote runs improved, now user is provided with comprehensive error message if the run was failed.
    + Removed get_data from pipeline `automlstep` notebook.
    + Started support `dataprep` in `automlstep`.

### Azure Machine Learning Data Prep SDK v1.1.10

+ **New features**
  + You can now request to execute specific inspectors (e.g. histogram, scatter plot, etc.) on specific columns.
  + Added a parallelize argument to `append_columns`. If True, data will be loaded into memory but execution will run in parallel; if False, execution will be streaming but single-threaded.

## 2019-07-23

### Azure Machine Learning SDK for Python v1.0.53

+ **New features**
  + Automated Machine Learning now supports training ONNX models on the remote compute target
  + Azure Machine Learning now provides ability to resume training from a previous run, checkpoint, or model files.
    + Learn how to [use estimators to resume training from a previous run](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/tensorflow/training/train-tensorflow-resume-training/train-tensorflow-resume-training.ipynb)

+ **Bug fixes and improvements**
  + **automl-client-core-nativeclient**
    + Fix the bug about loosing columns types after the transformation (bug linked);
    + Allow y_query to be an object type containing None(s) at the begin (#459519).
  + **azure-cli-ml**
    + CLI commands "model deploy" and "service update" now accept parameters, config files, or a combination of the two. Parameters have precedence over attributes in files.
    + Model description can now be updated after registration
  + **azureml-automl-core**
    + Update NimbusML dependency to 1.2.0 version (current latest).
    + Adding support for NimbusML estimators & pipelines to be used within AutoML estimators.
    + Fixing a bug in the Ensemble selection procedure that was unnecessarily growing the resulting ensemble even if the scores remained constant.
    + Enable reuse of some featurizations across CV Splits for forecasting tasks. This speeds up the run-time of the setup run by roughly a factor of n_cross_validations for expensive featurizations like lags and rolling windows.
    + Addressing an issue if time is out of pandas supported time range. We now raise a DataException if time is less than pd.Timestamp.min or greater than pd.Timestamp.max
    + Forecasting now allows different frequencies in train and test sets if they can be aligned. For example,  "quarterly starting in January" and at "quarterly starting in October" can be aligned.
    + The property "parameters" was added to the TimeSeriesTransformer.
    + Remove old exception classes.
    + In forecasting tasks, the `target_lags` parameter now accepts a single integer value or a list of integers. If the integer was provided, only one lag will be created. If a list is provided, the unique values of lags will be taken. target_lags=[1, 2, 2, 4] will create lags of one, 2 and 4 periods.
    + Fix the bug about losing columns types after the transformation (bug linked);
    + In `model.forecast(X, y_query)`, allow y_query to be an object type containing None(s) at the begin (#459519).
    + Add expected values to `automl` output
  + **azureml-contrib-datadrift**
    +  Improvements to example notebook including switch to azureml-opendatasets instead of azureml-contrib-opendatasets and performance improvements when enriching data
  + **azureml-contrib-explain-model**
    + Fixed transformations argument for LIME explainer for raw feature importance in azureml-contrib-explain-model package
    + Added segmentations to image explanations in image explainer for the AzureML-contrib-explain-model package
    + Add scipy sparse support for LimeExplainer
    + Added `batch_size` to mimic explainer when `include_local=False`, for streaming global explanations in batches to improve execution time of DecisionTreeExplainableModel
  + **azureml-contrib-featureengineering**
    + Fix for calling set_featurizer_timeseries_params(): dict value type change and null check - Add notebook for `timeseries`  featurizer
    + Update NimbusML dependency to 1.2.0 version (current latest).
  + **azureml-core**
    + Added the ability to attach DBFS datastores in the AzureML CLI
    + Fixed the bug with datastore upload where an empty folder is created if `target_path` started with `/`
    + Fixed `deepcopy` issue in ServicePrincipalAuthentication.
    + Added the "az ml environment show" and "az ml environment list" commands to the CLI.
    + Environments now support specifying a base_dockerfile as an alternative to an already-built base_image.
    + The unused RunConfiguration setting auto_prepare_environment has been marked as deprecated.
    + Model description can now be updated after registration
    + Bugfix: Model and Image delete now provides more information about retrieving upstream objects that depend on them if delete fails due to an upstream dependency.
    + Fixed bug that printed blank duration for deployments that occur when creating a workspace for some environments.
    + Improved workspace create failure exceptions. Such that users don't see "Unable to create workspace. Unable to find..." as the message and instead see the actual creation failure.
    + Add support for token authentication in AKS webservices.
    + Add `get_token()` method to `Webservice` objects.
    + Added CLI support to manage machine learning datasets.
    + `Datastore.register_azure_blob_container` now optionally takes a `blob_cache_timeout` value (in seconds) which configures blobfuse's mount parameters to enable cache expiration for this datastore. The default is no timeout, i.e. when a blob is read, it will stay in the local cache until the job is finished. Most jobs will prefer this setting, but some jobs need to read more data from a large dataset than will fit on their nodes. For these jobs, tuning this parameter will help them succeed. Take care when tuning this parameter: setting the value too low can result in poor performance, as the data used in an epoch may expire before being used again. This means that all reads will be done from blob storage (i.e. the network) rather than the local cache, which negatively impacts training times.
    + Model description can now properly be updated after registration
    + Model and Image deletion now provides more information about upstream objects that depend on them, which causes the delete to fail
    + Improve resource utilization of remote runs using azureml.mlflow.
  + **azureml-explain-model**
    + Fixed transformations argument for LIME explainer for raw feature importance in azureml-contrib-explain-model package
    + add scipy sparse support for LimeExplainer
    + added shape linear explainer wrapper, as well as another level to tabular explainer for explaining linear models
    + for mimic explainer in explain model library, fixed error when include_local=False for sparse data input
    + add expected values to `automl` output
    + fixed permutation feature importance when transformations argument supplied to get raw feature importance
    + added `batch_size` to mimic explainer when `include_local=False`, for streaming global explanations in batches to improve execution time of DecisionTreeExplainableModel
    + for model explainability library, fixed blackbox explainers where pandas dataframe input is required for prediction
    + Fixed a bug where `explanation.expected_values` would sometimes return a float rather than a list with a float in it.
  + **azureml-mlflow**
    + Improve performance of mlflow.set_experiment(experiment_name)
    + Fix bug in use of InteractiveLoginAuthentication for mlflow tracking_uri
    + Improve resource utilization of remote runs using azureml.mlflow.
    + Improve the documentation of the azureml-mlflow package
    + Patch bug where mlflow.log_artifacts("my_dir") would save artifacts under "my_dir/<artifact-paths>" instead of "<artifact-paths>"
  + **azureml-opendatasets**
    + Pin `pyarrow` of `opendatasets` to old versions (<0.14.0) because of memory issue newly introduced there.
    + Move azureml-contrib-opendatasets to azureml-opendatasets.
    + Allow open dataset classes to be registered to Azure Machine Learning workspace and leverage AML Dataset capabilities seamlessly.
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-pipeline-steps**
    + DBFS Datastore is now supported for Inputs and Outputs in DatabricksStep.
    + Updated documentation for Azure Batch Step with regards to inputs/outputs.
    + In AzureBatchStep, changed *delete_batch_job_after_finish* default value to *true*.
  + **azureml-telemetry**
    +  Move azureml-contrib-opendatasets to azureml-opendatasets.
    + Allow open dataset classes to be registered to Azure Machine Learning workspace and leverage AML Dataset capabilities seamlessly.
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-train-automl**
    + Updated documentation on get_output to reflect the actual return type and provide additional notes on retrieving key properties.
    + Update NimbusML dependency to 1.2.0 version (current latest).
    + add expected values to `automl` output
  + **azureml-train-core**
    + Strings are now accepted as compute target for Automated Hyperparameter Tuning
    + The unused RunConfiguration setting auto_prepare_environment has been marked as deprecated.

### Azure Machine Learning Data Prep SDK v1.1.9

+ **New features**
  + Added support for reading a file directly from an http or https url.

+ **Bug fixes and improvements**
  + Improved error message when attempting to read a Parquet Dataset from a remote source (which is not currently supported).
  + Fixed a bug when writing to Parquet file format in ADLS Gen 2, and updating the ADLS Gen 2 container name in the path.

## 2019-07-09

### Visual Interface
+ **Preview features**
  + Added "Execute R script" module in visual interface.

### Azure Machine Learning SDK for Python v1.0.48

+ **New features**
  + **azureml-opendatasets**
    + **azureml-contrib-opendatasets** is now available as **azureml-opendatasets**. The old package can still work, but we recommend you using **azureml-opendatasets** moving forward for richer capabilities and improvements.
    + This new package allows you to register open datasets as Dataset in Azure Machine Learning workspace, and leverage whatever functionalities that Dataset offers.
    + It also includes existing capabilities such as consuming open datasets as Pandas/SPARK dataframes, and location joins for some dataset like weather.

+ **Preview features**
    + HyperDriveConfig can now accept pipeline object as a parameter to support hyperparameter tuning using a pipeline.

+ **Bug fixes and improvements**
  + **azureml-train-automl**
    + Fixed the bug about losing columns types after the transformation.
    + Fixed the bug to allow y_query to be an object type containing None(s) at the beginning.
    + Fixed the issue in the Ensemble selection procedure that was unnecessarily growing the resulting ensemble even if the scores remained constant.
    + Fixed the issue with whitelist_models and blacklist_models settings in AutoMLStep.
    + Fixed the issue that prevented the usage of preprocessing when AutoML would have been used in the context of Azure ML Pipelines.
  + **azureml-opendatasets**
    + Moved azureml-contrib-opendatasets to azureml-opendatasets.
    + Allowed open dataset classes to be registered to Azure Machine Learning workspace and leverage AML Dataset capabilities seamlessly.
    + Improved NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-explain-model**
    + Updated online documentation for interpretability objects.
    + Added `batch_size` to mimic explainer when `include_local=False`, for streaming global explanations in batches to improve execution time of DecisionTreeExplainableModel for model explainability library.
    + Fixed the issue where `explanation.expected_values` would sometimes return a float rather than a list with a float in it.
    + Added expected values to `automl` output for mimic explainer in explain model library.
    + Fixed permutation feature importance when transformations argument supplied to get raw feature importance.
  + **azureml-core**
    + Added the ability to attach DBFS datastores in the AzureML CLI.
    + Fixed the issue with datastore upload where an empty folder is created if `target_path` started with `/`.
    + Enabled comparison of two datasets.
    + Model and Image delete now provides more information about retrieving upstream objects that depend on them if delete fails due to an upstream dependency.
    + Deprecated the unused RunConfiguration setting in auto_prepare_environment.
  + **azureml-mlflow**
    + Improved resource utilization of remote runs that use azureml.mlflow.
    + Improved the documentation of the azureml-mlflow package.
    + Fixed the issue where mlflow.log_artifacts("my_dir") would save artifacts under "my_dir/artifact-paths" instead of "artifact-paths".
  + **azureml-pipeline-core**
    + Parameter hash_paths for all pipeline steps is deprecated and will be removed in future. By default contents of the source_directory is hashed (except files listed in .amlignore or .gitignore)
    + Continued improving Module and ModuleStep to support compute type-specific modules, to prepare for RunConfiguration integration and other changes to unlock compute type-specific module usage in pipelines.
  + **azureml-pipeline-steps**
    + AzureBatchStep: Improved documentation with regards to inputs/outputs.
    + AzureBatchStep: Changed delete_batch_job_after_finish default value to true.
  + **azureml-train-core**
    + Strings are now accepted as compute target for Automated Hyperparameter Tuning.
    + Deprecated the unused RunConfiguration setting in auto_prepare_environment.
    + Deprecated parameters `conda_dependencies_file_path` and `pip_requirements_file_path` in favor of `conda_dependencies_file` and `pip_requirements_file` respectively.
  + **azureml-opendatasets**
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.

### Azure Machine Learning Data Prep SDK v1.1.8

+ **New features**
 + Dataflow objects can now be iterated over, producing a sequence of records. See documentation for `Dataflow.to_record_iterator`.
  + Dataflow objects can now be iterated over, producing a sequence of records. See documentation for `Dataflow.to_record_iterator`.

+ **Bug fixes and improvements**
 + Increased the robustness of DataPrep SDK.
 + Improved handling of pandas DataFrames with non-string Column Indexes.
 + Improved the performance of `to_pandas_dataframe` in Datasets.
 + Fixed a bug where Spark execution of Datasets failed when run in a multi-node environment.
  + Increased the robustness of DataPrep SDK.
  + Improved handling of pandas DataFrames with non-string Column Indexes.
  + Improved the performance of `to_pandas_dataframe` in Datasets.
  + Fixed a bug where Spark execution of Datasets failed when run in a multi-node environment.

## 2019-07-01

### Azure Machine Learning Data Prep SDK v1.1.7

We reverted a change that improved performance, as it was causing issues for some customers using Azure Databricks. If you experienced an issue on Azure Databricks, you can upgrade to version 1.1.7 using one of the methods below:
1. Run this script to upgrade: `%sh /home/ubuntu/databricks/python/bin/pip install azureml-dataprep==1.1.7`
2. Recreate the cluster, which will install the latest Data Prep SDK version.

## 2019-06-25

### Azure Machine Learning SDK for Python v1.0.45

+ **New features**
  + Add decision tree surrogate model to mimic explainer in azureml-explain-model package
  + Ability to specify a CUDA version to be installed on Inferencing images. Support for CUDA 9.0, 9.1, and 10.0.
  + Information about Azure ML training base images are now available at [Azure ML Containers GitHub Repository](https://github.com/Azure/AzureML-Containers) and [DockerHub](https://hub.docker.com/_/microsoft-azureml)
  + Added CLI support for pipeline schedule. Run "az ml pipeline -h" to learn more
  + Added custom Kubernetes namespace parameter to AKS webservice deployment configuration and CLI.
  + Deprecated hash_paths parameter for all pipeline steps
  + Model.register now supports registering multiple individual files as a single model with use of the `child_paths` parameter.

+ **Preview features**
    + Scoring explainers can now optionally save conda and pip information for more reliable serialization and deserialization.
    + Bug Fix for Auto Feature Selector.
    + Updated mlflow.azureml.build_image to the new api, patched bugs exposed by the new implementation.

+ **Bug fixes and improvements**
  + Removed `paramiko` dependency from azureml-core. Added deprecation warnings for legacy compute target attach methods.
  + Improve performance of run.create_children
  + In mimic explainer with binary classifier, fix the order of probabilities when teacher probability is used for scaling shape values.
  + Improved error handling and message for Automated machine learning.
  + Fixed the iteration timeout issue for Automated machine learning.
  + Improved the time-series transformation performance for Automated machine learning.

## 2019-06-24

### Azure Machine Learning Data Prep SDK v1.1.6

+ **New features**
  + Added summary functions for top values (`SummaryFunction.TOPVALUES`) and bottom values (`SummaryFunction.BOTTOMVALUES`).

+ **Bug fixes and improvements**
  + Significantly improved the performance of `read_pandas_dataframe`.
  + Fixed a bug that would cause `get_profile()` on a Dataflow pointing to binary files to fail.
  + Exposed `set_diagnostics_collection()` to allow for programmatic enabling/disabling of the telemetry collection.
  + Changed the behavior of `get_profile()`. NaN values are now ignored for Min, Mean, Std, and Sum, which aligns with the behavior of Pandas.


## 2019-06-10

### Azure Machine Learning SDK for Python v1.0.43

+ **New features**
  + Azure Machine Learning now provides first-class support for popular machine learning and data analysis framework Scikit-learn. Using [`SKLearn` estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.sklearn.sklearn?view=azure-ml-py), users can easily train and deploy Scikit-learn models.
    + Learn how to [run hyperparameter tuning with Scikit-learn using HyperDrive](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/scikit-learn/training/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-deploy-with-sklearn.ipynb).
  + Added support for creating ModuleStep in pipelines along with Module and ModuleVersion classes to manage reusable compute units.
  + ACI webservices now support persistent scoring_uri through updates. The scoring_uri will change from IP to FQDN. The Dns Name Label for FQDN can be configured by setting the dns_name_label on deploy_configuration.
  + Automated machine learning new features:
    + STL featurizer for forecasting
    + KMeans clustering is enabled for feature sweeping
  + AmlCompute Quota approvals just became faster! We have now automated the process to approve your quota requests within a threshold. For more information on how quotas work, learn [how to manage quotas](https://docs.microsoft.com/azure/machine-learning/how-to-manage-quotas).

+ **Preview features**
    + Integration with [MLflow](https://mlflow.org) 1.0.0 tracking through azureml-mlflow package ([example notebooks](https://aka.ms/azureml-mlflow-examples)).
    + Submit Jupyter notebook as a run. [API Reference Documentation](https://docs.microsoft.com/python/api/azureml-contrib-notebook/azureml.contrib.notebook?view=azure-ml-py)
    + Public Preview of [Data Drift Detector](https://docs.microsoft.com/python/api/azureml-datadrift/azureml.datadrift.datadriftdetector(class)) through azureml-contrib-datadrift package ([example notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/monitor-models/data-drift)). Data Drift is one of the top reasons where model accuracy degrades over time. It happens when data served to model in production is different from the data that the model was trained on. AML Data Drift detector helps customer to monitor data drift and sends alert whenever drift is detected.

+ **Breaking changes**

+ **Bug fixes and improvements**
  + RunConfiguration load and save supports specifying a full file path with full back-compat for previous behavior.
  + Added caching in ServicePrincipalAuthentication, turned off by default.
  + Enable logging of multiple plots under the same metric name.
  + Model class now properly importable from azureml.core (`from azureml.core import Model`).
  + In pipeline steps, `hash_path` parameter is now deprecated. New behavior is to hash complete source_directory, except files listed in .amlignore or .gitignore.
  + In pipeline packages, various `get_all` and `get_all_*` methods have been deprecated in favor of `list` and `list_*`, respectively.
  + azureml.core.get_run no longer requires classes to be imported before returning the original run type.
  + Fixed an issue where some calls to WebService Update did not trigger an update.
  + Scoring timeout on AKS webservices should be between 5 ms and 300000 ms. Max allowed scoring_timeout_ms for scoring requests has been bumped from 1 min to 5 min.
  + LocalWebservice objects now have `scoring_uri` and `swagger_uri` properties.
  + Moved outputs directory creation and outputs directory upload out of the user process. Enabled run history SDK to run in every user process. This should resolve some synchronization issues experienced by distributed training runs.
  + The name of the azureml log written from the user process name will now include process name (for distributed training only) and PID.

### Azure Machine Learning Data Prep SDK v1.1.5

+ **Bug fixes and improvements**
  + For interpreted datetime values that have a 2-digit year format, the range of valid years has been updated to match Windows May Release. The range has been changed from 1930-2029 to 1950-2049.
  + When reading in a file and setting `handleQuotedLineBreaks=True`, `\r` will be treated as a new line.
  + Fixed a bug that caused `read_pandas_dataframe` to fail in some cases.
  + Improved performance of `get_profile`.
  + Improved error messages.

## 2019-05-28

### Azure Machine Learning Data Prep SDK v1.1.4

+ **New features**
  + You can now use the following expression language functions to extract and parse datetime values into new columns.
    + `RegEx.extract_record()` extracts datetime elements into a new column.
    + `create_datetime()` creates datetime objects from separate datetime elements.
  + When calling `get_profile()`, you can now see that quantile columns are labeled as (est.) to clearly indicate that the values are approximations.
  + You can now use ** globbing when reading from Azure Blob Storage.
    + e.g. `dprep.read_csv(path='https://yourblob.blob.core.windows.net/yourcontainer/**/data/*.csv')`

+ **Bug fixes**
  + Fixed a bug related to reading a Parquet file from a remote source (Azure Blob).

## 2019-05-14

### Azure Machine Learning SDK for Python v1.0.39
+ **Changes**
  + Run configuration auto_prepare_environment option is being deprecated, with auto prepare becoming the default.

## 2019-05-08

### Azure Machine Learning Data Prep SDK v1.1.3

+ **New features**
  + Added support to read from a PostgresSQL database, either by calling read_postgresql or using a Datastore.
    + See examples in how-to guides:
      + [Data Ingestion notebook](https://aka.ms/aml-data-prep-ingestion-nb)
      + [Datastore notebook](https://aka.ms/aml-data-prep-datastore-nb)

+ **Bug fixes and improvements**
  + Fixed issues with column type conversion:
  + Now correctly converts a boolean or numeric column to a boolean column.
  + Now does not fail when attempting to set a date column to be date type.
  + Improved JoinType types and accompanying reference documentation. When joining two dataflows, you can now specify one of these types of join:
    + NONE, MATCH, INNER, UNMATCHLEFT, LEFTANTI, LEFTOUTER, UNMATCHRIGHT, RIGHTANTI, RIGHTOUTER, FULLANTI, FULL.
  + Improved data type inferencing to recognize more date formats.

## 2019-05-06

### Azure portal

In Azure portal, you can now:
+ Create and run automated ML experiments
+ Create a Notebook VM to try out sample Jupyter notebooks or your own.
+ Brand new Authoring section (Preview) in the Azure Machine Learning workspace, which includes Automated Machine Learning, Visual Interface and Hosted Notebook VMs
    + Automatically create a model using Automated machine learning
    + Use a drag and drop Visual Interface to run experiments
    + Create a Notebook VM to explore data, create models, and deploy services.
+ Live chart and metric updating in run reports and run details pages
+ Updated file viewer for logs, outputs, and snapshots in Run details pages.
+ New and improved report creation experience in the Experiments tab.
+ Added ability to download the config.json file from the Overview page of the Azure Machine Learning workspace.
+ Support Azure Machine Learning workspace creation from the Azure Databricks workspace.

## 2019-04-26

### Azure Machine Learning SDK for Python v1.0.33
+ **New features**
  + The _Workspace.create_ method now accepts default cluster configurations for CPU and GPU clusters.
  + If Workspace creation fails, depended resources are cleaned.
  + Default Azure Container Registry SKU was switched to basic.
  + Azure Container Registry is created lazily, when needed for run or image creation.
  + Support for Environments for training runs.

### Notebook Virtual Machine 

Use a Notebook VM as a secure, enterprise-ready hosting environment for Jupyter notebooks in which you can program machine learning experiments, deploy models as web endpoints and perform all other operations supported by Azure Machine Learning SDK using Python. It provides several capabilities:
+ [Quickly spin up a preconfigured notebook VM](tutorial-1st-experiment-sdk-setup.md) that has the latest version of Azure Machine Learning SDK and related packages.
+ Access is secured through proven technologies, such as HTTPS, Azure Active Directory authentication and authorization.
+ Reliable cloud storage of notebooks and code in your Azure Machine Learning Workspace blob storage account. You can safely delete your notebook VM without losing your work.
+ Preinstalled sample notebooks to explore and experiment with Azure Machine Learning features.
+ Full customization capabilities of Azure VMs, any VM type, any packages, any drivers. 

## 2019-04-26

### Azure Machine Learning SDK for Python v1.0.33 released.

+ Azure ML Hardware Accelerated Models on [FPGAs](how-to-deploy-fpga-web-service.md) is generally available.
  + You can now [use the azureml-accel-models package](how-to-deploy-fpga-web-service.md) to:
    + Train the weights of a supported deep neural network (ResNet 50, ResNet 152, DenseNet-121, VGG-16, and SSD-VGG)
    + Use transfer learning with the supported DNN
    + Register the model with Model Management Service and containerize the model
    + Deploy the model to an Azure VM with an FPGA in an Azure Kubernetes Service (AKS) cluster
  + Deploy the container to an [Azure Data Box Edge](https://docs.microsoft.com/azure/databox-online/data-box-edge-overview) server device
  + Score your data with the gRPC endpoint with this [sample](https://github.com/Azure-Samples/aml-hardware-accelerated-models)

### Automated Machine Learning

+ Feature sweeping to enable dynamically adding :::no-loc text="featurizers"::: for performance optimization. New :::no-loc text="featurizers":::: work embeddings, weight of evidence, target encodings, text target encoding, cluster distance
+ Smart CV to handle train/valid splits inside automated ML
+ Few memory optimization changes and runtime performance improvement
+ Performance improvement in model explanation
+ ONNX model conversion for local run
+ Added Subsampling support
+ Intelligent Stopping when no exit criteria defined
+ Stacked ensembles

+ Time Series Forecasting
  + New predict forecast function
  + You can now use rolling-origin cross validation on time series data
  + New functionality added to configure time series lags
  + New functionality added to support rolling window aggregate features
  + New Holiday detection and featurizer when country code is defined in experiment settings

+ Azure Databricks
  + Enabled time series forecasting and model explainabilty/interpretability capability
  + You can now cancel and resume (continue) automated ML experiments
  + Added support for multicore processing

### MLOps
+ **Local deployment & debugging for scoring containers**<br/> You can now deploy an ML model locally and iterate quickly on your scoring file and  dependencies to ensure they behave as expected.

+ **Introduced InferenceConfig & Model.deploy()**<br/> Model deployment now supports specifying a source folder with an entry script, the same as a RunConfig.  Additionally, model deployment has been simplified to a single command.

+ **Git reference tracking**<br/> Customers have been requesting basic Git integration capabilities for some time as it helps maintain an end-to-end audit trail. We have implemented tracking across major entities in Azure ML for Git-related metadata (repo, commit, clean state). This information will be collected automatically by the SDK and CLI.

+ **Model profiling & validation service**<br/> Customers frequently complain of the difficulty to properly size the compute associated with their inference service. With our model profiling service, the customer can provide sample inputs and we will profile across 16 different CPU / memory configurations to determine optimal sizing for deployment.

+ **Bring your own base image for inference**<br/> Another common complaint was the difficulty in moving from experimentation to inference RE sharing dependencies. With our new base image sharing capability, you can now reuse your experimentation base images, dependencies and all, for inference. This should speed up deployments and reduce the gap from the inner to the outer loop.

+ **Improved Swagger schema generation experience**<br/> Our previous swagger generation method was error prone and impossible to automate. We have a new in-line way of generating swagger schemas from any Python function via decorators. We have open-sourced this code and our schema generation protocol is not coupled to the Azure ML platform.

+ **Azure ML CLI is generally available (GA)**<br/> Models can now be deployed with a single CLI command. We got common customer feedback that no one deploys an ML model from a Jupyter notebook. The [**CLI reference documentation**](https://aka.ms/azmlcli) has been updated.


## 2019-04-22

Azure Machine Learning SDK for Python v1.0.30 released.

The [`PipelineEndpoint`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline_endpoint.pipelineendpoint?view=azure-ml-py) was introduced to add a new version of a published pipeline while maintaining same endpoint.

## 2019-04-17

### Azure Machine Learning Data Prep SDK v1.1.2

Note: Data Prep Python SDK will no longer install `numpy` and `pandas` packages. See [updated installation instructions](https://github.com/Microsoft/AMLDataPrepDocs).

+ **New features**
  + You can now use the Pivot transform.
    + How-to guide: [Pivot notebook](https://aka.ms/aml-data-prep-pivot-nb)
  + You can now use regular expressions in native functions.
    + Examples:
      + `dflow.filter(dprep.RegEx('pattern').is_match(dflow['column_name']))`
      + `dflow.assert_value('column_name', dprep.RegEx('pattern').is_match(dprep.value))`
  + You can now use `to_upper` and `to_lower` functions in expression language.
  + You can now see the number of unique values of each column in a data profile.
  + For some of the commonly used reader steps, you can now pass in the `infer_column_types` argument. If it is set to `True`, Data Prep will attempt to detect and automatically convert column types.
    + `inference_arguments` is now deprecated.
  + You can now call `Dataflow.shape`.

+ **Bug fixes and improvements**
  + `keep_columns` now accepts an additional optional argument `validate_column_exists`, which checks if the result of `keep_columns` will contain any columns.
  + All reader steps (which read from a file) now accept an additional optional argument `verify_exists`.
  + Improved performance of reading from pandas dataframe and getting data profiles.
  + Fixed a bug where slicing a single step from a Dataflow failed with a single index.

## 2019-04-15

### Azure portal
  + You can now resubmit an existing Script run on an existing remote compute cluster.
  + You can now run a published pipeline with new parameters on the Pipelines tab.
  + Run details now supports a new Snapshot file viewer. You can view a snapshot of the directory when you submitted a specific run. You can also download the notebook that was submitted to start the run.
  + You can now cancel parent runs from the Azure portal.

## 2019-04-08

### Azure Machine Learning SDK for Python v1.0.23

+ **New features**
  + The Azure Machine Learning SDK now supports Python 3.7.
  + Azure Machine Learning DNN Estimators now provide built-in multi-version support. For example,
  `TensorFlow` estimator now accepts a `framework_version` parameter, and users can specify
  version '1.10' or '1.12'. For a list of the versions supported by your current SDK release, call
  `get_supported_versions()` on the desired framework class (for example, `TensorFlow.get_supported_versions()`).
  For a list of the versions supported by the latest SDK release, see the [DNN Estimator documentation](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn?view=azure-ml-py).

### Azure Machine Learning Data Prep SDK v1.1.1

+ **New features**
  + You can read multiple Datastore/DataPath/DataReference sources using read_* transforms.
  + You can perform the following operations on columns to create a new column: division, floor, modulo, power, length.
  + Data Prep is now part of the Azure ML diagnostics suite and will log diagnostic information by default.
    + To turn this off, set this environment variable to true: DISABLE_DPREP_LOGGER

+ **Bug fixes and improvements**
  + Improved code documentation for commonly used classes and functions.
  + Fixed a bug in auto_read_file that failed to read Excel files.
  + Added option to overwrite the folder in read_pandas_dataframe.
  + Improved performance of dotnetcore2 dependency installation, and added support for Fedora 27/28 and Ubuntu 1804.
  + Improved the performance of reading from Azure Blobs.
  + Column type detection now supports columns of type Long.
  + Fixed a bug where some date values were being displayed as timestamps instead of Python datetime objects.
  + Fixed a bug where some type counts were being displayed as doubles instead of integers.


## 2019-03-25

### Azure Machine Learning SDK for Python v1.0.21

+ **New features**
  + The *azureml.core.Run.create_children* method allows low-latency creation of multiple child runs with a single call.

### Azure Machine Learning Data Prep SDK v1.1.0

+ **Breaking changes**
  + The concept of the Data Prep Package has been deprecated and is no longer supported. Instead of persisting multiple Dataflows in one Package, you can persist Dataflows individually.
    + How-to guide: [Opening and Saving Dataflows notebook](https://aka.ms/aml-data-prep-open-save-dataflows-nb)

+ **New features**
  + Data Prep can now recognize columns that match a particular Semantic Type, and split accordingly. The STypes currently supported include: email address, geographic coordinates (latitude & longitude), IPv4 and IPv6 addresses, US phone number, and US zip code.
    + How-to guide: [Semantic Types notebook](https://aka.ms/aml-data-prep-semantic-types-nb)
  + Data Prep now supports the following operations to generate a resultant column from two numeric columns: subtract, multiply, divide, and modulo.
  + You can call `verify_has_data()` on a Dataflow to check whether the Dataflow would produce records if executed.

+ **Bug fixes and improvements**
  + You can now specify the number of bins to use in a histogram for numeric column profiles.
  + The `read_pandas_dataframe` transform now requires the DataFrame to have string- or byte- typed column names.
  + Fixed a bug in the `fill_nulls` transform, where values were not correctly filled in if the column was missing.

## 2019-03-11

### Azure Machine Learning SDK for Python v1.0.18

 + **Changes**
   + The azureml-tensorboard package replaces azureml-contrib-tensorboard.
   + With this release, you can set up a user account on your managed compute cluster (amlcompute), while creating it. This can be done by passing these properties in the provisioning configuration. You can find more details in the [SDK reference documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#provisioning-configuration-vm-size-----vm-priority--dedicated---min-nodes-0--max-nodes-none--idle-seconds-before-scaledown-none--admin-username-none--admin-user-password-none--admin-user-ssh-key-none--vnet-resourcegroup-name-none--vnet-name-none--subnet-name-none--tags-none--description-none--remote-login-port-public-access--notspecified--).

### Azure Machine Learning Data Prep SDK v1.0.17

+ **New features**
  + Now supports adding two numeric columns to generate a resultant column using the expression language.

+ **Bug fixes and improvements**
  + Improved the documentation and parameter checking for random_split.

## 2019-02-27

### Azure Machine Learning Data Prep SDK v1.0.16

+ **Bug fix**
  + Fixed a Service Principal authentication issue that was caused by an API change.

## 2019-02-25

### Azure Machine Learning SDK for Python v1.0.17

+ **New features**

  + Azure Machine Learning now provides first class support for popular DNN framework Chainer. Using [`Chainer`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py) class users can easily train and deploy Chainer models.
    + Learn how to [run distributed training with ChainerMN](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/chainer/training/distributed-chainer/distributed-chainer.ipynb)
    + Learn how to [run hyperparameter tuning with Chainer using HyperDrive](https://github.com/Azure/MachineLearningNotebooks/blob/b881f78e4658b4e102a72b78dbd2129c24506980/how-to-use-azureml/ml-frameworks/chainer/deployment/train-hyperparameter-tune-deploy-with-chainer/train-hyperparameter-tune-deploy-with-chainer.ipynb)
  + Azure Machine Learning Pipelines added ability to trigger a Pipeline run based on datastore modifications. The pipeline [schedule notebook](https://aka.ms/pl-schedule) is updated to showcase this feature.

+ **Bug fixes and improvements**
  + We have added support in Azure Machine Learning pipelines for setting the source_directory_data_store property to a desired datastore (such as a blob storage) on [RunConfigurations](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.runconfiguration?view=azure-ml-py) that are supplied to the [PythonScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep?view=azure-ml-py). By default Steps use Azure File store as the backing datastore, which may run into throttling issues when a large number of steps are executed concurrently.

### Azure portal

+ **New features**
  + New drag and drop table editor experience for reports. Users can drag a column from the well to the table area where a preview of the table will be displayed. The columns can be rearranged.
  + New Logs file viewer
  + Links to experiment runs, compute, models, images, and deployments from the activities tab

### Azure Machine Learning Data Prep SDK v1.0.15

+ **New features**
  + Data Prep now supports writing file streams from a dataflow. Also provides the ability to manipulate the file stream names to create new file names.
    + How-to guide: [Working With File Streams notebook](https://aka.ms/aml-data-prep-file-stream-nb)

+ **Bug fixes and improvements**
  + Improved performance of t-Digest on large data sets.
  + Data Prep now supports reading data from a DataPath.
  + One hot encoding now works on boolean and numeric columns.
  + Other miscellaneous bug fixes.

## 2019-02-11

### Azure Machine Learning SDK for Python v1.0.15

+ **New features**
  + Azure Machine Learning Pipelines added AzureBatchStep ([notebook](https://aka.ms/pl-azbatch)), HyperDriveStep (notebook), and time-based scheduling functionality ([notebook](https://aka.ms/pl-schedule)).
  +  DataTranferStep updated to work with Azure SQL Database and Azure database for PostgreSQL ([notebook](https://aka.ms/pl-data-trans)).

+ **Changes**
  + Deprecated `PublishedPipeline.get_published_pipeline` in favor of `PublishedPipeline.get`.
  + Deprecated `Schedule.get_schedule` in favor of `Schedule.get`.

### Azure Machine Learning Data Prep SDK v1.0.12

+ **New features**
  + Data Prep now supports reading from Azure SQL Database using Datastore.

+ **Changes**
  + Improved the memory performance of certain operations on large data.
  + `read_pandas_dataframe()` now requires `temp_folder` to be specified.
  + The `name` property on `ColumnProfile` has been deprecated - use `column_name` instead.

## 2019-01-28

### Azure Machine Learning SDK for Python v1.0.10

+ **Changes**:
  + Azure ML SDK no longer has azure-cli packages as dependency. Specifically, azure-cli-core and azure-cli-profile dependencies have been removed from azureml-core. These are the  user impacting changes:
      + If you are performing "az login" and then using azureml-sdk, the SDK will do the browser or device code login one more time. It won't use any credentials state created by "az login".
    + For Azure CLI authentication, such as using "az login", use _azureml.core.authentication.AzureCliAuthentication_ class. For Azure CLI authentication, do  _pip install azure-cli_ in the Python environment where you have installed azureml-sdk.
    + If you are doing "az login" using a service principal for automation, we recommend using _azureml.core.authentication.ServicePrincipalAuthentication_ class, as azureml-sdk won't use credentials state created by Azure CLI.

+ **Bug fixes**: This release mostly contains minor bug fixes

### Azure Machine Learning Data Prep SDK v1.0.8

+ **Bug fixes**
  + Improved the performance of getting data profiles.
  + Fixed minor bugs related to error reporting.

### Azure portal: new features
+ New drag and drop charting experience for reports. Users can drag a column or attribute from the well to the chart area where the system will automatically select an appropriate chart type for the user based on the type of data. Users can change the chart type to other applicable types or add additional attributes.

    Supported Chart Types:
    - Line Chart
    - Histogram
    - Stacked Bar Chart
    - Box Plot
    - Scatter Plot
    - Bubble Plot
+ The portal now dynamically generates reports for experiments. When a user submits a run to an experiment, a report will automatically be generated with logged metrics and graphs to allow comparison across different runs.

## 2019-01-14

### Azure Machine Learning SDK for Python v1.0.8

+ **Bug fixes**: This release mostly contains minor bug fixes

### Azure Machine Learning Data Prep SDK v1.0.7

+ **New features**
  + Datastore improvements (documented in [Datastore how-to-guide](https://aka.ms/aml-data-prep-datastore-nb))
    + Added ability to read from and write to Azure File Share and ADLS Datastores in scale-up.
    + When using Datastores, Data Prep now supports using service principal authentication instead of interactive authentication.
    + Added support for wasb and wasbs urls.

## 2019-01-09

### Azure Machine Learning Data Prep SDK v1.0.6

+ **Bug fixes**
  + Fixed bug with reading from public readable Azure Blob containers on Spark

## 2018-12-20

### Azure Machine Learning SDK for Python v1.0.6
+ **Bug fixes**: This release mostly contains minor bug fixes

### Azure Machine Learning Data Prep SDK v1.0.4

+ **New features**
  + `to_bool` function now allows mismatched values to be converted to Error values. This is the new default mismatch behavior for `to_bool` and `set_column_types`, whereas the previous default behavior was to convert mismatched values to False.
  + When calling `to_pandas_dataframe`, there is a new option to interpret null/missing values in numeric columns as NaN.
  + Added ability to check the return type of some expressions to ensure type consistency and fail early.
  + You can now call `parse_json` to parse values in a column as JSON objects and expand them into multiple columns.

+ **Bug fixes**
  + Fixed a bug that crashed `set_column_types` in Python 3.5.2.
  + Fixed a bug that crashed when connecting to Datastore using an AML image.

+ **Updates**
  * [Example Notebooks](https://aka.ms/aml-data-prep-notebooks) for getting started tutorials, case studies, and how-to guides.

## 2018-12-04: General Availability

Azure Machine Learning is now generally available.

### Azure Machine Learning Compute
With this release, we are announcing a new managed compute experience through the [Azure Machine Learning Compute](how-to-set-up-training-targets.md#amlcompute). This compute target replaces Azure Batch AI compute for Azure Machine Learning.

This compute target:
+ Is used for model training and batch inference/scoring
+ Is single- to multi-node compute
+ Does the cluster management and job scheduling for the user
+ Autoscales by default
+ Support for both CPU and GPU resources
+ Enables use of low-priority VMs for reduced cost

Azure Machine Learning Compute can be created in Python, using Azure portal, or the CLI. It must be created in the region of your workspace, and cannot be attached to any other workspace. This compute target uses a Docker container for your run, and packages your dependencies to replicate the same environment across all your nodes.

> [!Warning]
> We recommend creating a new workspace to use Azure Machine Learning Compute. There is a remote chance that users trying to create Azure Machine Learning Compute from an existing workspace might see an error. Existing compute in your workspace should continue to work unaffected.

### Azure Machine Learning SDK for Python v1.0.2
+ **Breaking changes**
  + With this release, we are removing support for creating a VM from Azure Machine Learning. You can still attach an existing cloud VM or a remote on-premises server.
  + We are also removing support for BatchAI, all of which should be supported through Azure Machine Learning Compute now.

+ **New**
  + For machine learning pipelines:
    + [EstimatorStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.estimator_step.estimatorstep?view=azure-ml-py)
    + [HyperDriveStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.hyper_drive_step.hyperdrivestep?view=azure-ml-py)
    + [MpiStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.mpi_step.mpistep?view=azure-ml-py)


+ **Updated**
  + For machine learning pipelines:
    + [DatabricksStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricks_step.databricksstep?view=azure-ml-py) now accepts runconfig
    + [DataTransferStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.data_transfer_step.datatransferstep?view=azure-ml-py) now copies to and from a SQL datasource
    + Schedule functionality in SDK to create and update schedules for running published pipelines

<!--+ **Bugs fixed**-->

### Azure Machine Learning Data Prep SDK v0.5.2
+ **Breaking changes**
  * `SummaryFunction.N` was renamed to `SummaryFunction.Count`.

+ **Bug Fixes**
  * Use the latest AML Run Token when reading from and writing to datastores on remote runs. Previously, if the AML Run Token is updated in Python, the Data Prep runtime will not be updated with the updated AML Run Token.
  * Additional clearer error messages
  * to_spark_dataframe() will no longer crash when Spark uses `Kryo` serialization
  * Value Count Inspector can now show more than 1000 unique values
  * Random Split no longer fails if the original Dataflow doesn't have a name

+ **More information**
  * [Azure Machine Learning Data Prep SDK](https://aka.ms/data-prep-sdk)

### Docs and notebooks
+ ML Pipelines
  + New and updated notebooks for getting started with pipelines, batch scoping,  and style transfer examples: https://aka.ms/aml-pipeline-notebooks
  + Learn how to [create your first pipeline](how-to-create-your-first-pipeline.md)
  + Learn how to [run batch predictions using pipelines](how-to-use-parallel-run-step.md)
+ Azure Machine Learning compute target
  + [Sample notebooks](https://aka.ms/aml-notebooks) are now updated to use the new managed compute.
  + [Learn about this compute](how-to-set-up-training-targets.md#amlcompute)

### Azure portal: new features
+ Create and manage [Azure Machine Learning Compute](how-to-set-up-training-targets.md#amlcompute) types in the portal.
+ Monitor quota usage and [request quota](how-to-manage-quotas.md) for Azure Machine Learning Compute.
+ View Azure Machine Learning Compute cluster status in real time.
+ Virtual network support was added for Azure Machine Learning Compute and Azure Kubernetes Service creation.
+ Rerun your published pipelines with existing parameters.
+ New [automated machine learning charts](how-to-understand-automated-ml.md) for classification models (lift, gains, calibration, feature importance chart with model explainability) and regression models (residuals and feature importance chart with model explainability).
+ Pipelines can be viewed in Azure portal




## 2018-11-20

### Azure Machine Learning SDK for Python v0.1.80

+ **Breaking changes**
  * *azureml.train.widgets* namespace has moved to *azureml.widgets*.
  * *azureml.core.compute.AmlCompute* deprecates the following classes - *azureml.core.compute.BatchAICompute* and *azureml.core.compute.DSVMCompute*. The latter class will be removed in subsequent releases. The AmlCompute class has an easier definition now, and simply needs a vm_size and the max_nodes, and will automatically scale your cluster from 0 to the max_nodes when a job is submitted. Our [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training) have been updated with this information and should give you usage examples. We hope you like this simplification and lots of more exciting features to come in a later release!

### Azure Machine Learning Data Prep SDK v0.5.1

Learn more about the Data Prep SDK by reading [reference docs](https://aka.ms/data-prep-sdk).
+ **New Features**
   * Created a new DataPrep CLI to execute DataPrep packages and view the data profile for a dataset or dataflow
   * Redesigned SetColumnType API to improve usability
   * Renamed smart_read_file to auto_read_file
   * Now includes skew and kurtosis in the Data Profile
   * Can sample with stratified sampling
   * Can read from zip files that contain CSV files
   * Can split datasets row-wise with Random Split (for example, into test-train sets)
   * Can get all the column data types from a dataflow or a data profile by calling `.dtypes`
   * Can get the row count from a dataflow or a data profile by calling `.row_count`

+ **Bug Fixes**
   * Fixed long to double conversion
   * Fixed assert after any add column
   * Fixed an issue with FuzzyGrouping, where it would not detect groups in some cases
   * Fixed sort function to respect multi-column sort order
   * Fixed and/or expressions to be similar to how `pandas` handles them
   * Fixed reading from dbfs path
   * Made error messages more understandable
   * Now no longer fails when reading on remote compute target using an AML token
   * Now no longer fails on Linux DSVM
   * Now no longer crashes when non-string values are in string predicates
   * Now handles assertion errors when Dataflow should fail correctly
   * Now supports dbutils mounted storage locations on Azure Databricks

## 2018-11-05

### Azure portal
The Azure portal for Azure Machine Learning has the following updates:
  * A new **Pipelines** tab for published pipelines.
  * Added support for attaching an existing HDInsight cluster as a compute target.

### Azure Machine Learning SDK for Python v0.1.74

+ **Breaking changes**
  * *Workspace.compute_targets, datastores, experiments, images, models, and *webservices* are properties instead of methods. For example, replace *Workspace.compute_targets()* with *Workspace.compute_targets*.
  * *Run.get_context* deprecates *Run.get_submitted_run*. The latter method will be removed in subsequent releases.
  * *PipelineData* class now expects a datastore object as a parameter rather than datastore_name. Similarly, *Pipeline* accepts default_datastore rather than default_datastore_name.

+ **New features**
  * The Azure Machine Learning Pipelines [sample notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines) now uses MPI steps.
  * The RunDetails widget for Jupyter notebooks is updated to show a visualization of the pipeline.

### Azure Machine Learning Data Prep SDK v0.4.0

+ **New features**
  * Type Count added to Data Profile
  * Value Count and Histogram is now available
  * More percentiles in Data Profile
  * The Median is available in Summarize
  * Python 3.7 is now supported
  * When you save a dataflow that contains datastores to a DataPrep package, the datastore information will be persisted as part of the DataPrep package
  * Writing to datastore is now supported

+ **Bug fixed**
  * 64-bit unsigned integer overflows are now handled properly on Linux
  * Fixed incorrect text label for plain text files in smart_read
  * String column type now shows up in metrics view
  * Type count now is fixed to show ValueKinds mapped to single FieldType instead of individual ones
  * Write_to_csv no longer fails when path is provided as a string
  * When using Replace, leaving "find" blank will no longer fail

## 2018-10-12

### Azure Machine Learning SDK for Python v0.1.68

+ **New features**
  * Multi-tenant support when creating new workspace.

+ **Bugs fixed**
  * You no longer need to pin the pynacl library version when deploying web service.

### Azure Machine Learning Data Prep SDK v0.3.0

+ **New features**
  * Added method transform_partition_with_file(script_path), which allows users to pass in the path of a Python file to execute

## 2018-10-01

### Azure Machine Learning SDK for Python v0.1.65
[Version 0.1.65](https://pypi.org/project/azureml-sdk/0.1.65) includes new features, more documentation, bug fixes, and more [sample notebooks](https://aka.ms/aml-notebooks).

See [the list of known issues](resource-known-issues.md) to learn about known bugs and workarounds.

+ **Breaking changes**
  * Workspace.experiments, Workspace.models, Workspace.compute_targets, Workspace.images, Workspace.web_services return dictionary, previously returned list. See [azureml.core.Workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py) API documentation.

  * Automated Machine Learning removed normalized mean square error from the primary metrics.

+ **HyperDrive**
  * Various HyperDrive bug fixes for Bayesian, Performance improvements for get Metrics calls.
  * Tensorflow 1.10 upgrade from 1.9
  * Docker image optimization for cold start.
  * Jobs now report correct status even if they exit with error code other than 0.
  * RunConfig attribute validation in SDK.
  * HyperDrive run object supports cancel similar to a regular run: no need to pass any parameters.
  * Widget improvements for maintaining state of drop-down values for distributed runs and HyperDrive runs.
  * TensorBoard and other log files support fixed for Parameter server.
  * Intel(R) MPI support on service side.
  * Bugfix to parameter tuning for distributed run fix during validation in BatchAI.
  * Context Manager now identifies the primary instance.

+ **Azure portal experience**
  * log_table() and log_row() are supported in Run details.
  * Automatically create graphs for tables and rows with 1, 2 or 3 numerical columns and an optional categorical column.

+ **Automated Machine Learning**
  * Improved error handling and documentation
  * Fixed run property retrieval performance issues.
  * Fixed continue run issue.
  * Fixed :::no-loc text="ensembling"::: iteration issues.
  * Fixed training bug on macOS that caused the system to stop responding.
  * Downsampling macro average PR/ROC curve in custom validation scenario.
  * Removed extra index logic.
  * Removed filter from get_output API.

+ **Pipelines**
  * Added a method Pipeline.publish() to publish a pipeline directly, without requiring an execution run first.
  * Added a method PipelineRun.get_pipeline_runs() to fetch the pipeline runs that were generated from a published pipeline.

+ **Project Brainwave**
  * Updated support for new AI models available on FPGAs.

### Azure Machine Learning Data Prep SDK v0.2.0
[Version 0.2.0](https://pypi.org/project/azureml-dataprep/0.2.0/) includes following features and bug fixes:

+ **New features**
  * Support for one-hot encoding
  * Support for quantile transform

+ **Bug fixed:**
  * Works with any Tornado version, no need to downgrade your Tornado version
  * Value counts for all values, not just the top three

## 2018-09 (Public preview refresh)

A new, refreshed release of Azure Machine Learning: Read more about this release: https://azure.microsoft.com/blog/what-s-new-in-azure-machine-learning-service/


## Next steps

Read the overview for [Azure Machine Learning](overview-what-is-azure-ml.md).
