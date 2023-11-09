---
title: Python SDK release notes
titleSuffix: Azure Machine Learning
description: Learn about the latest updates to Azure Machine Learning Python SDK.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: UpdateFrequency5, event-tier1-build-2022, devx-track-python
ms.topic: reference
ms.author: larryfr
author: BlackMist
ms.date: 11/13/2023
---

# Azure Machine Learning Python SDK release notes

In this article, learn about Azure Machine Learning Python SDK releases.  For the full SDK reference content, visit the Azure Machine Learning's [**main SDK for Python**](/python/api/overview/azure/ml/intro) reference page.

__RSS feed__: Get notified when this page is updated by copying and pasting the following URL into your feed reader:
`https://learn.microsoft.com/api/search/rss?search=%22Azure+machine+learning+release+notes%22&locale=en-us`

## 2023-11-13
  + **azureml-automl-core, azureml-automl-runtime, azureml-contrib-automl-dnn-forecasting, azureml-train-automl-client, azureml-train-automl-runtime, azureml-training-tabular**
    +  statsmodels, pandas and scipy were upgraded to versions 1.13, 1.3.5 and 1.10.1 - fbprophet 0.7.1 was replaced by prophet 1.1.4 When loading a model in a local environment, the versions of these packages should match what the model was trained on.
  + **azureml-core, azureml-pipeline-core, azureml-pipeline-steps**
    + AzureML-Pipeline - Add a warning for the `init_scripts` parameter in the Databricks step, alerting you to its upcoming deprecation.
  + **azureml-interpret**
    + updated azureml-interpret package to interpret-community 0.30.*
  + **azureml-mlflow**
    + feat: Add `AZUREML_BLOB_MAX_SINGLE_PUT_SIZE` to control the size in bytes of upload chunks. Lowering this from the default (`64*1024*1024` i.e 64MB) can remedy issues where write operations fail due to time outs.
    + Support for uploading and downloading models from AzureML registries is currently experimental
    + Adding support for users that want to download or upload model from AML registries

## 2023-08-21

### Azure Machine Learning SDK for Python v1.53.0
  + **azureml-automl-core**
    + Support of features/regressors known at the time of forecast in AutoML forecasting TCN models.
  + **azureml-automl-dnn-vision**
    + Enable flags for log_training_metrics and log_validation_loss for automl object detection and instance segmentation
  + **azureml-contrib-automl-dnn-forecasting**
    + Support of features/regressors known at the time of forecast in AutoML forecasting TCN models.
  + **azureml-core**
    + Add appinsights location swap for qatarcentral to point to uaenorth
  + **azureml-mlflow**
    + Fix for loading models with MLflow load_model APIs when passing an AzureML URI
  + **azureml-pipeline-core**
    + Skip child run and log error when load child run failed (e.g. 404) using `PipelineRun.get_pipeline_runs`.
    + `PipelineEndpoint.list` introduces a new int parameter `max_results`, which indicates the maximum size of the returned list. The default value of `max_results` is 100.
  + **azureml-training-tabular**
    + Support of features/regressors known at the time of forecast in AutoML forecasting TCN models.

## 2023-06-26

### Azure Machine Learning SDK for Python v1.52.0
  + **azureml-automl-dnn-vision**
    + The mlflow signature for the runtime (legacy) automl models has changed to accept binary inputs. This enables batch inferencing. The predict function is backwards compatible so users can still send base64 strings as input. The output from the predict function has changed to remove the temporary file name and the empty visualizations and attributions key when model explainability is n...
  + **azureml-contrib-automl-dnn-forecasting**
    + Fixed a bug that caused failures during distributed TCN training when the data consists of a single time series.
  + **azureml-interpret**
    + remove shap pin in azureml-interpret to update to latest in interpret-community
  + **azureml-responsibleai**
    + updated common environment and azureml-responsibleai package to raiwidgets and responsibleai 0.28.0

## 2023-05-20

### Azure Machine Learning SDK for Python v1.51.0
  + **azureml-automl-core**
    + AutoML forecasting task now supports rolling forecast and partial support for quantile forecasts for hierarchical time series (HTS).
    + Disallow using non-tabular datasets to customers for Classification (multi-class and multi-label) scenarios
  + **azureml-automl-dnn-nlp**
    + Disallow using non-tabular datasets to customers for Classification (multi-class and multi-label) scenarios
  + **azureml-contrib-automl-pipeline-steps**
    + AutoML forecasting task now supports rolling forecast and partial support for quantile forecasts for hierarchical time series (HTS).
  + **azureml-fsspec**
    + Replaces all user caused errors in MLTable & FSSpec with a custom UserErrorException imported from azureml-dataprep.
  + **azureml-interpret**
    + updated azureml-interpret package to interpret-community 0.29.*
  + **azureml-pipeline-core**
    + Fix `pipeline_version` not taking effect when calling `pipeline_endpoint.submit()`.
  + **azureml-train-automl-client**
    + AutoML forecasting task now supports rolling forecast and partial support for quantile forecasts for hierarchical time series (HTS).
  + **azureml-train-automl-runtime**
    + AutoML forecasting task now supports rolling forecast and partial support for quantile forecasts for hierarchical time series (HTS).
  + **mltable**
    + More encoding variants like `utf-8` are now supported when loading MLTable files.
    + Replaces all user caused errors in MLTable & FSSpec with a custom UserErrorException imported from azureml-dataprep.

## 2023-04-10

### Azure Machine Learning SDK for Python v1.50.0
  + **azureml-contrib-automl-dnn-forecasting**
    + Added support for forecasting at given quantiles for TCN models.
  + **azureml-responsibleai**
    + updated common environment and azureml-responsibleai package to raiwidgets and responsibleai 0.26.0
  + **azureml-train-automl-runtime**
    + Fix MLTable handling for model test scenario
  + **azureml-training-tabular**
    + Added quantiles as parameter in the forecast_quantile method.


## 2023-03-01

### Announcing end of support for Python 3.7 in Azure Machine Learning SDK v1 packages

+ **Feature deprecation**
  + **Deprecate Python 3.7 as a supported runtime for SDK v1 packages**
    + On December 4, 2023, Azure Machine Learning will officially stop supporting Python 3.7 for SDK v1 packages and deprecate it as a supported runtime. For more details, please read our page on [Azure SDK for Python version support policy](https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy)
    + As of the deprecation date of December 4, 2023, the Azure Machine Learning SDK v1 packages will no longer receive security patches and other updates for the Python 3.7 runtime.
    + The current Python 3.7 versions for Azure Machine Learning SDK v1 still functions. However, in order to continue receiving security updates and remaining qualified for technical assistance, Azure Machine Learning strongly advises that you move your scripts and dependencies to a supported version of the Python runtime.
    + As a runtime for Azure Machine Learning SDK v1 files, we advise using Python version 3.8 or later.
    + Additionally, Python 3.7 based Azure Machine Learning SDK v1 packages no longer qualifies for technical assistance.
    + Use Azure Machine Learning support to get in touch with us if you have any concerns.

## 2023-13-02

### Azure Machine Learning SDK for Python v1.49.0
  + **Breaking changes**
    + Starting with v1.49.0 and above, the following AutoML algorithms won't be supported.
        + Regression: FastLinearRegressor, OnlineGradientDescentRegressor
        + Classification: AveragedPerceptronClassifier.
    +  Use v1.48.0 or below to continue using these algorithms.
  + **Bug fixes and improvements**
      + **azureml-automl-dnn-nlp**
        + Logs to show the final values applied to the model and hyperparameter settings based on both the default values and the user-specified ones.
      + **azureml-contrib-automl-dnn-forecasting**
        + Nonscalar metrics for TCNForecaster now reflects values from the last epoch.
        + Forecast horizon visuals for train-set and test-set are now available while running the TCN training experiment.
        + Runs won't fail anymore because of "Failed to calculate TCN metrics" error. The warning message that says "Forecast Metric calculation resulted in error, reporting back worst scores" will still be logged. Instead we raise exception when we face inf/nan validation loss for more than two times consecutively with a message "Invalid Model, TCN training didn't converge.". The customers need be aware of the fact that loaded models may return nan/inf values as predictions while inferencing after this change.
      + **azureml-core**
        + Azure Machine Learning workspace creation makes use of Log Analytics Based Application Insights in preparation for deprecation of Classic Application Insights. Users wishing to use Classic Application Insights resources can still specify their own to bring when creating an Azure Machine Learning workspace.
      + **azureml-interpret**
        + updated azureml-interpret package to interpret-community 0.28.*
      + **azureml-mlflow**
        + Updating azureml-mlflow client with initial support for MLflow 2.0
      + **azureml-responsibleai**
        + updated azureml-responsibleai package and notebooks to raiwidgets and responsibleai v0.24.0
      + **azureml-sdk**
        + azureml-sdk and azureml-train-automl-client now support Python version 3.10
      + **azureml-train-automl-client**
        + azureml-sdk and azureml-train-automl-client now support Python version 3.10
      + **azureml-train-automl-runtime**
        + Clean up missing y before training
        + Clean up nan or empty values of target column for nonstreaming scenarios
        + Forecast horizon visuals for test-set are now available while running the training experiment.
      + **azureml-train-core**
        + Added the support to customer to provide custom run id for hyperdrive runs
      + **azureml-train-restclients-hyperdrive**
        + Added the support to customer to provide custom run id for hyperdrive runs

## 2022-12-05

### Azure Machine Learning SDK for Python v1.48.0
  + **Breaking changes**
    + Python 3.6 support has been deprecated for Azure Machine Learning SDK packages.

  + **Bug fixes and improvements**
    + **azureml-core**
      + Storage accounts created as a part of workspace creation now set blob public access to be disabled by default
    + **azureml-responsibleai**
      + Updated azureml-responsibleai package and notebooks to raiwidgets and responsibleai packages v0.23.0
      + Added model serializer and pyfunc model to azureml-responsibleai package for saving and retrieving models easily
    + **azureml-train-automl-runtime**
      + Added docstring for ManyModels Parameters and HierarchicalTimeSeries Parameters
      + Fixed bug where generated code doesn't do train/test splits correctly.
      + Fixed a bug that was causing forecasting generated code training jobs to fail.

## 2022-10-25

### Azure Machine Learning SDK for Python v1.47.0
  + **azureml-automl-dnn-nlp**
    + Runtime changes for AutoML NLP to account for fixed training parameters, as part of the newly introduced model sweeping and hyperparameter tuning.
  + **azureml-mlflow**
    + AZUREML_ARTIFACTS_DEFAULT_TIMEOUT can be used to control the timeout for artifact upload
  + **azureml-train-automl-runtime**
    + Many Models and Hierarchical Time Series training now enforces check on timeout parameters to detect conflict before submitting the experiment for run. This prevents experiment failure during the run by raising exception before submitting experiment.
    + Customers can now control the step size while using rolling forecast in Many Models inferences.
    + ManyModels inference with unpartitioned tabular data now supports forecast_quantiles.

## 2022-09-26

### Azure Machine Learning SDK for Python v1.46.0
  + **azureml-automl-dnn-nlp**
    + Customers will no longer be allowed to specify a line in CoNLL, which only comprises with a token. The line must always either be an empty newline or one with exactly one token followed by exactly one space followed by exactly one label.
  + **azureml-contrib-automl-dnn-forecasting**
    + There's a corner case where samples are reduced to 1 after the cross validation split but sample_size still points to the count before the split and hence batch_size ends up being more than sample count in some cases. In this fix we initialize sample_size after the split
  + **azureml-core**
    + Added deprecation warning when inference customers use CLI/SDK v1 model deployment APIs to deploy models and also when Python version is 3.6 and less.
    + The following values of `AZUREML_LOG_DEPRECATION_WARNING_ENABLED` change the behavior as follows:
      + Default - displays the warning when customer uses Python 3.6 and less and for cli/sdk v1.
      + `True` - displays the sdk v1 deprecation warning on azureml-sdk packages.
      + `False` - disables the sdk v1 deprecation warning on azureml-sdk packages.
    + Command to be executed to set the environment variable to disable the deprecation message:
      + Windows - `setx AZUREML_LOG_DEPRECATION_WARNING_ENABLED "False"`
      + Linux - `export AZUREML_LOG_DEPRECATION_WARNING_ENABLED="False"`
  + **azureml-interpret**
    + update azureml-interpret package to interpret-community 0.27.*
  + **azureml-pipeline-core**
    + Fix schedule default time zone to UTC.
    + Fix incorrect reuse when using SqlDataReference in DataTransfer step.
  + **azureml-responsibleai**
    + update azureml-responsibleai package and curated images to raiwidgets and responsibleai v0.22.0
  + **azureml-train-automl-runtime**
    + Fixed a bug in generated scripts that caused certain metrics to not render correctly in ui.
    + Many Models now support rolling forecast for inferencing.
    + Support to return top `N` models in Many models scenario.




## 2022-08-29

### Azure Machine Learning SDK for Python v1.45.0
  + **azureml-automl-runtime**
    + Fixed a bug where the sample_weight column wasn't properly validated.
    + Added rolling_forecast() public method to the forecasting pipeline wrappers for all supported forecasting models. This method replaces the deprecated rolling_evaluation() method.
    + Fixed an issue where AutoML Regression tasks may fall back to train-valid split for model evaluation, when CV would have been a more appropriate choice.
  + **azureml-core**
    + New cloud configuration suffix added, "aml_discovery_endpoint".
    + Updated the vendored azure-storage package from version 2 to version 12.
  + **azureml-mlflow**
    + New cloud configuration suffix added, "aml_discovery_endpoint".
  + **azureml-responsibleai**
    + update azureml-responsibleai package and curated images to raiwidgets and responsibleai 0.21.0
  + **azureml-sdk**
    + The azureml-sdk package now allows Python 3.9.


## 2022-08-01

### Azure Machine Learning SDK for Python v1.44.0

  + **azureml-automl-dnn-nlp**
    + Weighted accuracy and Matthews correlation coefficient (MCC) will no longer be a metric displayed on calculated metrics for NLP Multilabel classification.
  + **azureml-automl-dnn-vision**
    + Raise user error when invalid annotation format is provided
  + **azureml-cli-common**
    + Updated the v1 CLI description
  + **azureml-contrib-automl-dnn-forecasting**
    + Fixed the "Failed to calculate TCN metrics." issues caused for TCNForecaster when different time series in the validation dataset have different lengths.
    + Added auto timeseries ID detection for DNN forecasting models like TCNForecaster.
    + Fixed a bug with the Forecast TCN model where validation data could be corrupted in some circumstances when the user provided the validation set.
  + **azureml-core**
    + Allow setting a timeout_seconds parameter when downloading artifacts from a Run
    + Warning message added - Azure Machine Learning CLI v1 is getting retired on 2025-09-. Users are recommended to adopt CLI v2.
    + Fix submission to non-AmlComputes throwing exceptions.
    + Added docker context support for environments
  + **azureml-interpret**
    + Increase numpy version for AutoML packages
  + **azureml-pipeline-core**
    + Fix regenerate_outputs=True not taking effect when submit pipeline.
  + **azureml-train-automl-runtime**
    + Increase numpy version for AutoML packages
    + Enable code generation for vision and nlp
    + Original columns on which grains are created are added as part of predictions.csv

## 2022-07-21

### Announcing end of support for Python 3.6 in Azure Machine Learning SDK v1 packages

+ **Feature deprecation**
  + **Deprecate Python 3.6 as a supported runtime for SDK v1 packages**
    + On December 05, 2022, Azure Machine Learning will deprecate Python 3.6 as a supported runtime, formally ending our Python 3.6 support for SDK v1 packages.
    + From the deprecation date of December 05, 2022, Azure Machine Learning will no longer apply security patches and other updates to the Python 3.6 runtime used by Azure Machine Learning SDK v1 packages.
    + The existing Azure Machine Learning SDK v1 packages with Python 3.6 still continues to run. However, Azure Machine Learning strongly recommends that you migrate your scripts and dependencies to a supported Python runtime version so that you continue to receive security patches and remain eligible for technical support.
    + We recommend using Python 3.8 version as a runtime for Azure Machine Learning SDK v1 packages.
    + In addition, Azure Machine Learning SDK v1 packages using Python 3.6 is no longer eligible for technical support.
    + If you have any questions, contact us through AML Support.

## 2022-06-27

  + **azureml-automl-dnn-nlp**
    + Remove duplicate labels column from multi-label predictions
  + **azureml-contrib-automl-pipeline-steps**
    + Many Models now provide the capability to generate prediction output in csv format as well. - Many Models predictions now includes column names in the output file in case of **csv** file format.
  + **azureml-core**
    + ADAL authentication is now deprecated and all authentication classes now use MSAL authentication. Install azure-cli>=2.30.0 to utilize MSAL based authentication when using AzureCliAuthentication class.
    + Added fix to force environment registration when `Environment.build(workspace)`. The fix solves confusion of the latest environment built instead of the asked one when environment is cloned or inherited from another instance.
    + SDK warning message to restart Compute Instance before May 31, 2022, if it was created before September 19, 2021
  + **azureml-interpret**
    + Updated azureml-interpret package to interpret-community 0.26.*
    + In the azureml-interpret package, add ability to get raw and engineered feature names from scoring explainer. Also, add example to the scoring notebook to get feature names from the scoring explainer and add documentation about raw and engineered feature names.
  + **azureml-mlflow**
    + azureml-core as a dependency of azureml-mlflow has been removed. - MLflow projects and local deployments require azureml-core and needs to be installed separately.
    + Adding support for creating endpoints and deploying to them via the MLflow client plugin.
  + **azureml-responsibleai**
    + Updated azureml-responsibleai package and environment images to latest responsibleai and raiwidgets 0.19.0 release
  + **azureml-train-automl-client**
    + Now OutputDatasetConfig is supported as the input of the MM/HTS pipeline builder. The mappings are: 1) OutputTabularDatasetConfig -> treated as unpartitioned tabular dataset. 2) OutputFileDatasetConfig -> treated as filed dataset.
  + **azureml-train-automl-runtime**
    + Added data validation that requires the number of minority class samples in the dataset to be at least as much as the number of CV folds requested.
    + Automatic cross-validation parameter configuration is now available for AutoML forecasting tasks. Users can now specify "auto" for n_cross_validations and cv_step_size or leave them empty, and AutoML provides those configurations base on your data. However, currently this feature isn't supported when TCN is enabled.
    + Forecasting Parameters in Many Models and Hierarchical Time Series can now be passed via object rather than using individual parameters in dictionary.
    + Enabled forecasting model endpoints with quantiles support to be consumed in Power BI.
    + Updated AutoML scipy dependency upper bound to 1.5.3 from 1.5.2

## 2022-04-25

### Azure Machine Learning SDK for Python v1.41.0

**Breaking change warning**

This breaking change comes from the June release of `azureml-inference-server-http`. In the `azureml-inference-server-http` June release (v0.9.0), Python 3.6 support is dropped. Since `azureml-defaults` depends on `azureml-inference-server-http`, this change is propagated to `azureml-defaults`. If you aren't using `azureml-defaults` for inference, feel free to use `azureml-core` or any other Azure Machine Learning SDK packages directly instead of install `azureml-defaults`.

  + **azureml-automl-dnn-nlp**
    + Turning on long range text feature by default.
  + **azureml-automl-dnn-vision**
    + Changing the ObjectAnnotation Class type from object to "data object".
  + **azureml-core**
    + This release updates the Keyvault class used by customers to enable them to provide the keyvault content type when creating a secret using the SDK. This release also updates the SDK to include a new function that enables customers to retrieve the value of the content type from a specific secret.
  + **azureml-interpret**
    + updated azureml-interpret package to interpret-community 0.25.0
  + **azureml-pipeline-core**
    + Don't print run detail anymore if `pipeline_run.wait_for_completion` with `show_output=False`
  + **azureml-train-automl-runtime**
    + Fixes a bug that would cause code generation to fail when the azureml-contrib-automl-dnn-forecasting package is present in the training environment.
    + Fix error when using a test dataset without a label column with AutoML Model Testing.

## 2022-03-28

### Azure Machine Learning SDK for Python v1.40.0
  + **azureml-automl-dnn-nlp**
    + We're making the Long Range Text feature optional and only if the customers explicitly opt in for it, using the kwarg "enable_long_range_text"
    + Adding data validation layer for multi-class classification scenario, which applies the same base class as multilabel for common validations, and a derived class for more task specific data validation checks.
  + **azureml-automl-dnn-vision**
    + Fixing KeyError while computing class weights.
  + **azureml-contrib-reinforcementlearning**
    + SDK warning message for upcoming deprecation of RL service
  + **azureml-core**
    + * Return logs for runs that went through our new runtime when calling any of the get logs function on the run object, including `run.get_details`, `run.get_all_logs`, etc.
    + Added experimental method Datastore.register_onpremises_hdfs to allow users to create datastores pointing to on-premises HDFS resources.
    + Updating the CLI documentation in the help command
  + **azureml-interpret**
    + For azureml-interpret package, remove shap pin with packaging update. Remove numba and numpy pin after CE env update.
  + **azureml-mlflow**
    + Bugfix for MLflow deployment client run_local failing when config object wasn't provided.
  + **azureml-pipeline-steps**
    +  Remove broken link of deprecated pipeline EstimatorStep
  + **azureml-responsibleai**
    + update azureml-responsibleai package to raiwidgets and responsibleai 0.17.0 release
  + **azureml-train-automl-runtime**
    + Code generation for automated ML now supports ForecastTCN models (experimental).
    + Models created via code generation now have all metrics calculated by default (except normalized mean absolute error, normalized median absolute error, normalized RMSE, and normalized RMSLE in the case of forecasting models). The list of metrics to be calculated can be changed by editing the return value of `get_metrics_names()`. Cross validation is now used by default for forecasting models created via code generation.
  + **azureml-training-tabular**
    + The list of metrics to be calculated can be changed by editing the return value of `get_metrics_names()`. Cross validation is now used by default for forecasting models created via code generation.
    + Converting decimal type y-test into float to allow for metrics computation to proceed without errors.

## 2022-02-28

### Azure Machine Learning SDK for Python v1.39.0
  + **azureml-automl-core**
    +  Fix incorrect form displayed in PBI for integration with AutoML regression models
    +  Adding min-label-classes check for both classification tasks (multi-class and multi-label). It throws an error for the customer's run if the unique number of classes in the input training dataset is fewer than 2. It is meaningless to run classification on fewer than two classes.
  + **azureml-automl-runtime**
    +  Converting decimal type y-test into float to allow for metrics computation to proceed without errors.
    +  AutoML training now supports numpy version 1.8.
  + **azureml-contrib-automl-dnn-forecasting**
    +  Fixed a bug in the TCNForecaster model where not all training data would be used when cross-validation settings were provided.
    +  TCNForecaster wrapper's forecast method that was corrupting inference-time predictions. Also fixed an issue where the forecast method would not use the most recent context data in train-valid scenarios.
  + **azureml-interpret**
    +  For azureml-interpret package, remove shap pin with packaging update. Remove numba and numpy pin after CE env update.
  + **azureml-responsibleai**
    +  azureml-responsibleai package to raiwidgets and responsibleai 0.17.0 release
  + **azureml-synapse**
    +  Fix the issue that magic widget is disappeared.
  + **azureml-train-automl-runtime**
    +  Updating AutoML dependencies to support Python 3.8. This change breaks compatibility with models trained with SDK 1.37 or below due to newer Pandas interfaces being saved in the model.
    +  AutoML training now supports numpy version 1.19
    +  Fix AutoML reset index logic for ensemble models in automl_setup_model_explanations API
    +  In AutoML, use lightgbm surrogate model instead of linear surrogate model for sparse case after latest lightgbm version upgrade
    +  All internal intermediate artifacts that are produced by AutoML are now stored transparently on the parent run (instead of being sent to the default workspace blob store). Users should be able to see the artifacts that AutoML generates under the `outputs/` directory on the parent run.


## 2022-01-24

### Azure Machine Learning SDK for Python v1.38.0
  + **azureml-automl-core**
    + Tabnet Regressor and Tabnet Classifier support in AutoML
    + Saving data transformer in parent run outputs, which can be reused to produce same featurized dataset, which was used during the experiment run
    + Supporting getting primary metrics for Forecasting task in get_primary_metrics API.
    + Renamed second optional parameter in v2 scoring scripts as GlobalParameters
  + **azureml-automl-dnn-vision**
    + Added the scoring metrics in the metrics UI
  + **azureml-automl-runtime**
    + Bug fix for cases where the algorithm name for NimbusML models may show up as empty strings, either on the ML Studio, or on the console outputs.
  + **azureml-core**
    + Added parameter blobfuse_enabled in azureml.core.webservice.aks.AksWebservice.deploy_configuration. When this parameter is true, models and scoring files are downloaded with blobfuse instead of the blob storage API.
  + **azureml-interpret**
    + Updated azureml-interpret to interpret-community 0.24.0
    + In azureml-interpret update scoring explainer to support latest version of lightgbm with sparse TreeExplainer
    + Update azureml-interpret to interpret-community 0.23.*
  + **azureml-pipeline-core**
    + Add note in pipelinedata, recommend user to use pipeline output dataset instead.
  + **azureml-pipeline-steps**
    + Add `environment_variables` to ParallelRunConfig, runtime environment variables can be passed by this parameter and will be set on the process where the user script is executed.
  + **azureml-train-automl-client**
    + Tabnet Regressor and Tabnet Classifier support in AutoML
  + **azureml-train-automl-runtime**
    + Saving data transformer in parent run outputs, which can be reused to produce same featurized dataset, which was used during the experiment run
  + **azureml-train-core**
    + Enable support for early termination for Bayesian Optimization in Hyperdrive
    + Bayesian and GridParameterSampling objects can now pass on properties


## 2021-12-13

### Azure Machine Learning SDK for Python v1.37.0
+ **Breaking changes**
  + **azureml-core**
    + Starting in version 1.37.0, Azure Machine Learning SDK uses MSAL as the underlying authentication library. MSAL uses Azure Active Directory (Azure AD) v2.0 authentication flow to provide more functionality and increases security for token cache. For more information, see [Overview of the Microsoft Authentication Library (MSAL)](../../active-directory/develop/msal-overview.md).
    + Update AML SDK dependencies to the latest version of Azure Resource Management Client Library for Python (azure-mgmt-resource>=15.0.0,<20.0.0) & adopt track2 SDK.
    + Starting in version 1.37.0, azure-ml-cli extension should be compatible with the latest version of Azure CLI >=2.30.0.
    + When using Azure CLI in a pipeline, like as Azure DevOps, ensure all tasks/stages are using versions of Azure CLI above v2.30.0 for MSAL-based Azure CLI. Azure CLI 2.30.0 is not backward compatible with prior versions and throws an error when using incompatible versions. To use Azure CLI credentials with Azure Machine Learning SDK, Azure CLI should be installed as pip package.

+ **Bug fixes and improvements**
  + **azureml-core**
    + Removed instance types from the attach workflow for Kubernetes compute. Instance types can now directly be set up in the Kubernetes cluster. For more details, please visit aka.ms/amlarc/doc.
  + **azureml-interpret**
    + updated azureml-interpret to interpret-community 0.22.*
  + **azureml-pipeline-steps**
    + Fixed a bug where the experiment "placeholder" might be created on submission of a Pipeline with an AutoMLStep.
  + **azureml-responsibleai**
    + update azureml-responsibleai and compute instance environment to responsibleai and raiwidgets 0.15.0 release
    + update azureml-responsibleai package to latest responsibleai 0.14.0.
  + **azureml-tensorboard**
    + You can now use `Tensorboard(runs, use_display_name=True)` to mount the TensorBoard logs to folders named after the `run.display_name/run.id` instead of `run.id`.
  + **azureml-train-automl-client**
    + Fixed a bug where the experiment "placeholder" might be created on submission of a Pipeline with an AutoMLStep.
    + Update AutoMLConfig test_data and test_size docs to reflect preview status.
  + **azureml-train-automl-runtime**
    + Added new feature that allows users to pass time series grains with one unique value.
    + In certain scenarios, an AutoML model can predict NaNs. The rows that correspond to these NaN predictions is removed from test datasets and predictions before computing metrics in test runs.


## 2021-11-08

### Azure Machine Learning SDK for Python v1.36.0
+ **Bug fixes and improvements**
  + **azureml-automl-dnn-vision**
    + Cleaned up minor typos on some error messages.
  + **azureml-contrib-reinforcementlearning**
    + Submitting Reinforcement Learning runs that use simulators are no longer supported.
  + **azureml-core**
    + Added support for partitioned premium blob.
    + Specifying nonpublic clouds for Managed Identity authentication is no longer supported.
    + User can migrate AKS web service to online endpoint and deployment, which is managed by CLI (v2).
    + The instance type for training jobs on Kubernetes compute targets can now be set via a RunConfiguration property: run_config.kubernetescompute.instance_type.
  + **azureml-defaults**
    + Removed redundant dependencies like gunicorn and werkzeug
  + **azureml-interpret**
    + azureml-interpret package updated to 0.21.* version of interpret-community
  + **azureml-pipeline-steps**
    + Deprecate MpiStep in favor of using CommandStep for running ML training (including distributed training) in pipelines.
  + **azureml-train-automl-rutime**
    + Update the AutoML model test predictions output format docs.
    + Added docstring descriptions for Naive, SeasonalNaive, Average, and SeasonalAverage forecasting model.
    + Featurization summary is now stored as an artifact on the run (check for a file named 'featurization_summary.json' under the outputs folder)
    + Enable categorical indicators support for Tabnet Learner.
    + Add downsample parameter to automl_setup_model_explanations to allow users to get explanations on all data without downsampling by setting this parameter to be false.


## 2021-10-11

### Azure Machine Learning SDK for Python v1.35.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Enable binary metrics calculation
  + **azureml-contrib-fairness**
    + Improve error message on failed dashboard download
  + **azureml-core**
    + Bug in specifying nonpublic clouds for Managed Identity authentication has been resolved.
    + Dataset.File.upload_directory() and Dataset.Tabular.register_pandas_dataframe() experimental flags are now removed.
    + Experimental flags are now removed in partition_by() method of TabularDataset class.
  + **azureml-pipeline-steps**
    + Experimental flags are now removed for the `partition_keys` parameter of the ParallelRunConfig class.
  + **azureml-interpret**
    + azureml-interpret package updated to intepret-community 0.20.*
  + **azureml-mlflow**
    + Made it possible to log artifacts and images with MLflow using subdirectories
  + **azureml-responsibleai**
    + Improve error message on failed dashboard download
  + **azureml-train-automl-client**
    + Added support for computer vision tasks such as Image Classification, Object Detection and Instance Segmentation. Detailed documentation can be found at: [Set up AutoML to train computer vision models with Python (v1)](how-to-auto-train-image-models.md).
    + Enable binary metrics calculation
  + **azureml-train-automl-runtime**
    + Add TCNForecaster support to model test runs.
    + Update the model test predictions.csv output format. The output columns now include the original target values and the features, which were passed in to the test run. This can be turned off by setting `test_include_predictions_only=True` in `AutoMLConfig` or by setting `include_predictions_only=True` in `ModelProxy.test()`. If the user has requested to only include predictions, then the output format looks like (forecasting is the same as regression): Classification => [predicted values] [probabilities] Regression => [predicted values] else (default): Classification => [original test data labels] [predicted values] [probabilities] [features] Regression => [original test data labels] [predicted values] [features] The `[predicted values]` column name = `[label column name] + "_predicted"`. The `[probabilities]` column names = `[class name] + "_predicted_proba"`. If no target column was passed in as input to the test run, then `[original test data labels]` will not be in the output.

## 2021-09-07

### Azure Machine Learning SDK for Python v1.34.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Added support for refitting a previously trained forecasting pipeline.
    + Added ability to get predictions on the training data (in-sample prediction) for forecasting.
  + **azureml-automl-runtime**
    + Add support to return predicted probabilities from a deployed endpoint of an AutoML classifier model.
    + Added a forecasting option for users to specify that all predictions should be integers.
    + Removed the target column name from being part of model explanation feature names for local experiments with training_data_label_column_name
    + as dataset inputs.
    + Added support for refitting a previously trained forecasting pipeline.
    + Added ability to get predictions on the training data (in-sample prediction) for forecasting.
  + **azureml-core**
    + Added support to set stream column type, mount and download stream columns in tabular dataset.
    + New optional fields added to Kubernetes.attach_configuration(identity_type=None, identity_ids=None) which allow attaching KubernetesCompute with either SystemAssigned or UserAssigned identity. New identity fields are included when calling print(compute_target) or compute_target.serialize(): identity_type, identity_id, principal_id, and tenant_id/client_id.
  + **azureml-dataprep**
    + Added support to set stream column type for tabular dataset. added support to mount and download stream columns in tabular dataset.
  + **azureml-defaults**
    + The dependency `azureml-inference-server-http==0.3.1` has been added to `azureml-defaults`.
  + **azureml-mlflow**
    + Allow pagination of list_experiments API by adding `max_results` and `page_token` optional params. For documentation, see MLflow official docs.
  + **azureml-sdk**
    + Replaced dependency on deprecated package(azureml-train) inside azureml-sdk.
    + Add azureml-responsibleai to azureml-sdk extras
  + **azureml-train-automl-client**
    + Expose the `test_data` and `test_size` parameters in `AutoMLConfig`. These parameters can be used to automatically start a test run after the model training phase has been completed. The test run computes predictions using the best model and generates metrics given these predictions.

## 2021-08-24

### Azure Machine Learning Experimentation User Interface
  + **Run Delete**
    + Run Delete is a new functionality that allows users to delete one or multiple runs from their workspace.
    + This functionality can help users reduce storage costs and manage storage capacity by regularly deleting runs and experiments from the UI directly.
  + **Batch Cancel Run**
    + Batch Cancel Run is new functionality that allows users to select one or multiple runs to cancel from their run list.
    + This functionality can help users cancel multiple queued runs and free up space on their cluster.

## 2021-08-18

### Azure Machine Learning Experimentation User Interface
  + **Run Display Name**
    + The Run Display Name is a new, editable and optional display name that can be assigned to a run.
    + This name can help with more effectively tracking, organizing and discovering the runs.
    + The Run Display Name is defaulted to an adjective_noun_guid format (Example: awesome_watch_2i3uns).
    + This default name can be edited to a more customizable name. This can be edited from the Run details page in the Azure Machine Learning studio user interface.

## 2021-08-02

### Azure Machine Learning SDK for Python v1.33.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Improved error handling around XGBoost model retrieval.
    + Added possibility to convert the predictions from float to integers for forecasting and regression tasks.
    + Updated default value for enable_early_stopping in AutoMLConfig to True.
  + **azureml-automl-runtime**
    + Added possibility to convert the predictions from float to integers for forecasting and regression tasks.
    + Updated default value for enable_early_stopping in AutoMLConfig to True.
  + **azureml-contrib-automl-pipeline-steps**
    + Hierarchical timeseries (HTS) is enabled for forecasting tasks through pipelines.
    + Add Tabular dataset support for inferencing
    + Custom path can be specified for the inference data
  + **azureml-contrib-reinforcementlearning**
    + Some properties in `azureml.core.environment.DockerSection` are deprecated, such as `shm_size` property used by Ray workers in reinforcement learning jobs. This property can now be specified in `azureml.contrib.train.rl.WorkerConfiguration` instead.
  + **azureml-core**
    + Fixed a hyperlink in `ScriptRunConfig.distributed_job_config` documentation
    + Azure Machine Learning compute clusters can now be created in a location different from the location of the workspace. This is useful for maximizing idle capacity allocation and managing quota utilization across different locations without having to create more workspaces just to use quota and create a compute cluster in a particular location. For more information, see [Create an Azure Machine Learning compute cluster](how-to-create-attach-compute-cluster.md?tabs=python).
    + Added display_name as a mutable name field of Run object.
    + Dataset from_files now supports skipping of data extensions for large input data
  + **azureml-dataprep**
    + Fixed a bug where to_dask_dataframe would fail because of a race condition.
    + Dataset from_files now supports skipping of data extensions for large input data
  + **azureml-defaults**
    + We're removing the dependency azureml-model-management-sdk==1.0.1b6.post1 from azureml-defaults.
  + **azureml-interpret**
    + updated azureml-interpret to interpret-community 0.19.*
  + **azureml-pipeline-core**
    + Hierarchical timeseries (HTS) is enabled for forecasting tasks through pipelines.
  + **azureml-train-automl-client**
    + Switch to using blob store for caching in Automated ML.
    + Hierarchical timeseries (HTS) is enabled for forecasting tasks through pipelines.
    + Improved error handling around XGBoost model retrieval.
    + Updated default value for enable_early_stopping in AutoMLConfig to True.
  + **azureml-train-automl-runtime**
    + Switch to using blob store for caching in Automated ML.
    + Hierarchical timeseries (HTS) is enabled for forecasting tasks through pipelines.
    + Updated default value for enable_early_stopping in AutoMLConfig to True.


## 2021-07-06

### Azure Machine Learning SDK for Python v1.32.0
+ **Bug fixes and improvements**
  + **azureml-core**
    + Expose diagnose workspace health in SDK/CLI
  + **azureml-defaults**
    + Added `opencensus-ext-azure==1.0.8` dependency to azureml-defaults
  + **azureml-pipeline-core**
    + Updated the AutoMLStep to use prebuilt images when the environment for job submission matches the default environment
  + **azureml-responsibleai**
    + New error analysis client added to upload, download and list error analysis reports
    + Ensure `raiwidgets` and `responsibleai` packages are version synchronized
  + **azureml-train-automl-runtime**
    + Set the time allocated to dynamically search across various featurization strategies to a maximum of one-fourth of the overall experiment timeout


## 2021-06-21

### Azure Machine Learning SDK for Python v1.31.0
+ **Bug fixes and improvements**
  + **azureml-core**
    + Improved documentation for platform property on Environment class
    + Changed default AML Compute node scale down time from 120 seconds to 1800 seconds
    + Updated default troubleshooting link displayed on the portal for troubleshooting failed runs to: https://aka.ms/azureml-run-troubleshooting
  + **azureml-automl-runtime**
    + Data Cleaning: Samples with target values in [None, "", "nan", np.nan] is dropped prior to featurization and/or model training
  + **azureml-interpret**
    + Prevent flush task queue error on remote Azure Machine Learning runs that use ExplanationClient by increasing timeout
  + **azureml-pipeline-core**
    + Add jar parameter to synapse step
  + **azureml-train-automl-runtime**
    + Fix high cardinality guardrails to be more aligned with docs

## 2021-06-07

### Azure Machine Learning SDK for Python v1.30.0
+ **Bug fixes and improvements**
  + **azureml-core**
    + Pin dependency `ruamel-yaml` to < 0.17.5 as a breaking change was released in 0.17.5.
    + `aml_k8s_config` property is being replaced with `namespace`, `default_instance_type`, and `instance_types` parameters for `KubernetesCompute` attach.
    + Workspace sync keys were changed to a long running operation.
  + **azureml-automl-runtime**
    + Fixed problems where runs with big data may fail with `Elements of y_test cannot be NaN`.
  + **azureml-mlflow**
    + MLFlow deployment plugin bugfix for models with no signature.
  + **azureml-pipeline-steps**
    + ParallelRunConfig: update doc for process_count_per_node.
  + **azureml-train-automl-runtime**
    + Support for custom defined quantiles during MM inference
    + Support for forecast_quantiles during batch inference.
  + **azureml-contrib-automl-pipeline-steps**
    + Support for custom defined quantiles during MM inference
    + Support for forecast_quantiles during batch inference.

## 2021-05-25

### Announcing the CLI (v2) for Azure Machine Learning

The `ml` extension to the Azure CLI is the next-generation interface for Azure Machine Learning. It enables you to train and deploy models from the command line, with features that accelerate scaling data science up and out while tracking the model lifecycle. [Install and set up the CLI (v2)](../how-to-configure-cli.md).

### Azure Machine Learning SDK for Python v1.29.0
+ **Bug fixes and improvements**
  + **Breaking changes**
    + Dropped support for Python 3.5.
  + **azureml-automl-runtime**
    + Fixed a bug where the STLFeaturizer failed if the time-series length was shorter than the seasonality. This error manifested as an IndexError. The case is handled now without error, though the seasonal component of the STL just consists of zeros in this case.
  + **azureml-contrib-automl-dnn-vision**
    + Added a method for batch inferencing with file paths.
  + **azureml-contrib-gbdt**
    + The azureml-contrib-gbdt package has been deprecated and might not receive future updates and will be removed from the distribution altogether.
  + **azureml-core**
    + Corrected explanation of parameter create_if_not_exists in Datastore.register_azure_blob_container.
    + Added sample code to DatasetConsumptionConfig class.
    + Added support for step as an alternative axis for scalar metric values in run.log()
  + **azureml-dataprep**
    + Limit partition size accepted in `_with_partition_size()` to 2 GB
  + **azureml-interpret**
    + update azureml-interpret to the latest interpret-core package version
    + Dropped support for SHAP DenseData, which has been deprecated in SHAP 0.36.0.
    + Enable `ExplanationClient` to upload to a user specified datastore.
  + **azureml-mlflow**
    + Move azureml-mlflow to mlflow-skinny to reduce the dependency footprint while maintaining full plugin support
  + **azureml-pipeline-core**
    + PipelineParameter code sample is updated in the reference doc to use correct parameter.


## 2021-05-10

### Azure Machine Learning SDK for Python v1.28.0
+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + Improved AutoML Scoring script to make it consistent with designer
    + Patch bug where forecasting with the Prophet model would throw a "missing column" error if trained on an earlier version of the SDK.
    + Added the ARIMAX model to the public-facing, forecasting-supported model lists of the AutoML SDK. Here, ARIMAX is a regression with ARIMA errors and a special case of the transfer function models developed by Box and Jenkins. For a discussion of how the two approaches are different, see [The ARIMAX model muddle](https://robjhyndman.com/hyndsight/arimax/). Unlike the rest of the multivariate models that use autogenerated, time-dependent features (hour of the day, day of the year, and so on) in AutoML, this model uses only features that are provided by the user, and it makes interpreting coefficients easy.
  + **azureml-contrib-dataset**
    + Updated documentation description with indication that libfuse should be installed while using mount.
  + **azureml-core**
    + Default CPU curated image is now mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04. Default GPU image is now mcr.microsoft.com/azureml/openmpi3.1.2-cuda10.2-cudnn8-ubuntu18.04
    + Run.fail() is now deprecated, use Run.tag() to mark run as failed or use Run.cancel() to mark the run as canceled.
    + Updated documentation with a note that libfuse should be installed when mounting a file dataset.
    + Add experimental register_dask_dataframe() support to tabular dataset.
    + Support DatabricksStep with Azure Blob/ADL-S as inputs/outputs and expose parameter permit_cluster_restart to let customer decide whether AML can restart cluster when i/o access configuration need to be added into cluster
  + **azureml-dataset-runtime**
    + azureml-dataset-runtime now supports versions of pyarrow < 4.0.0
  + **azureml-mlflow**
    + Added support for deploying to Azure Machine Learning via our MLFlow plugin.
  + **azureml-pipeline-steps**
    + Support DatabricksStep with Azure Blob/ADL-S as inputs/outputs and expose parameter permit_cluster_restart to let customer decide whether AML can restart cluster when i/o access configuration need to be added into cluster
  + **azureml-synapse**
    + Enable audience in msi authentication
  + **azureml-train-automl-client**
    + Added changed link for compute target doc


## 2021-04-19

### Azure Machine Learning SDK for Python v1.27.0
+ **Bug fixes and improvements**
  + **azureml-core**
    + Added the ability to override the default timeout value for artifact uploading via the "AZUREML_ARTIFACTS_DEFAULT_TIMEOUT" environment variable.
    + Fixed a bug where docker settings in Environment object on ScriptRunConfig aren't respected.
    + Allow partitioning a dataset when copying it to a destination.
    + Added a custom mode to the OutputDatasetConfig to enable passing created Datasets in pipelines through a link function. These support enhancements made to enable Tabular Partitioning for PRS.
    + Added a new KubernetesCompute compute type to azureml-core.
  + **azureml-pipeline-core**
    + Adding a custom mode to the OutputDatasetConfig and enabling a user to pass through created Datasets in pipelines through a link function. File path destinations support placeholders. These support the enhancements made to enable Tabular Partitioning for PRS.
    + Addition of new KubernetesCompute compute type to azureml-core.
  + **azureml-pipeline-steps**
    + Addition of new KubernetesCompute compute type to azureml-core.
  + **azureml-synapse**
    + Update spark UI url in widget of azureml synapse
  + **azureml-train-automl-client**
    + The STL featurizer for the forecasting task now uses a more robust seasonality detection based on the frequency of the time series.
  + **azureml-train-core**
    + Fixed bug where docker settings in Environment object are not respected.
    + Addition of new KubernetesCompute compute type to azureml-core.


## 2021-04-05

### Azure Machine Learning SDK for Python v1.26.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Fixed an issue where Naive models would be recommended in AutoMLStep runs and fail with lag or rolling window features. These models won't be recommended when target         lags or target rolling window size are set.
    +  Changed console output when submitting an AutoML run to show a portal link to the run.
  + **azureml-core**
    + Added HDFS mode in documentation.
    + Added support to understand File Dataset partitions based on glob structure.
    + Added support for update container registry associated with Azure Machine Learning Workspace.
    + Deprecated Environment attributes under the DockerSection - "enabled", "shared_volume" and "arguments" are a part of DockerConfiguration in RunConfiguration now.
    + Updated Pipeline CLI clone documentation
    + Updated portal URIs to include tenant for authentication
    + Removed experiment name from run URIs to avoid redirects
    + Updated experiment URO to use experiment ID.
    + Bug fixes for attaching remote compute with Azure Machine Learning CLI.
    + Updated portal URIs to include tenant for authentication.
    + Updated experiment URI to use experiment ID.
  + **azureml-interpret**
    + azureml-interpret updated to use interpret-community 0.17.0
  + **azureml-opendatasets**
    + Input start date and end date type validation and error indication if it's not datetime type.
  + **azureml-parallel-run**
    + [Experimental feature] Add `partition_keys` parameter to ParallelRunConfig, if specified, the input dataset(s) would be partitioned into mini-batches by the keys specified by it. It requires all input datasets to be partitioned dataset.
  + **azureml-pipeline-steps**
    + Bugfix - supporting path_on_compute while passing dataset configuration as download.
    + Deprecate RScriptStep in favor of using CommandStep for running R scripts in pipelines.
    + Deprecate EstimatorStep in favor of using CommandStep for running ML training (including distributed training) in pipelines.
  + **azureml-sdk**
    + Update python_requires to < 3.9 for azureml-sdk
  + **azureml-train-automl-client**
    +  Changed console output when submitting an AutoML run to show a portal link to the run.
  + **azureml-train-core**
    + Deprecated DockerSection's 'enabled', 'shared_volume', and 'arguments' attributes in favor of using DockerConfiguration with ScriptRunConfig.
    +  Use Azure Open Datasets for MNIST dataset
    + Hyperdrive error messages have been updated.


## 2021-03-22

### Azure Machine Learning SDK for Python v1.25.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    +  Changed console output when submitting an AutoML run to show a portal link to the run.
  + **azureml-core**
    + Starts to support updating container registry for workspace in SDK and CLI
    + Deprecated DockerSection's 'enabled', 'shared_volume', and 'arguments' attributes in favor of using DockerConfiguration with ScriptRunConfig.
    + Updated Pipeline CLI clone documentation
    + Updated portal URIs to include tenant for authentication
    + Removed experiment name from run URIs to avoid redirects
    + Updated experiment URO to use experiment ID.
    + Bug fixes for attaching remote compute using az CLI
    + Updated portal URIs to include tenant for authentication.
    + Added support to understand File Dataset partitions based on glob structure.
  + **azureml-interpret**
    + azureml-interpret updated to use interpret-community 0.17.0
  + **azureml-opendatasets**
    + Input start date and end date type validation and error indication if it's not datetime type.
  + **azureml-pipeline-core**
    + Bugfix - supporting path_on_compute while passing dataset configuration as download.
  + **azureml-pipeline-steps**
    + Bugfix - supporting path_on_compute while passing dataset configuration as download.
    + Deprecate RScriptStep in favor of using CommandStep for running R scripts in pipelines.
    + Deprecate EstimatorStep in favor of using CommandStep for running ML training (including distributed training) in pipelines.
  + **azureml-train-automl-runtime**
    +  Changed console output when submitting an AutoML run to show a portal link to the run.
  + **azureml-train-core**
    + Deprecated DockerSection's 'enabled', 'shared_volume', and 'arguments' attributes in favor of using DockerConfiguration with ScriptRunConfig.
    + Use Azure Open Datasets for MNIST dataset
    + Hyperdrive error messages have been updated.


## 2021-03-31
### Azure Machine Learning studio Notebooks Experience (March Update)
+ **New features**
  + Render CSV/TSV. Users are able to render and TSV/CSV file in a grid format for easier data analysis.
  + SSO Authentication for Compute Instance. Users can now easily authenticate any new compute instances directly in the Notebook UI, making it easier to authenticate and use Azure SDKs directly in Azure Machine Learning.
  + Compute Instance Metrics. Users are able to view compute metrics like CPU usage and memory via terminal.
  + File Details. Users can now see file details including the last modified time, and file size by clicking the three dots beside a file.

+ **Bug fixes and improvements**
  + Improved page load times.
  + Improved performance.
  + Improved speed and kernel reliability.
  + Gain vertical real estate by permanently moving up Notebook file pane.
  + Links are now clickable in Terminal
  + Improved Intellisense performance


## 2021-03-08

### Azure Machine Learning SDK for Python v1.24.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Removed backwards compatible imports from `azureml.automl.core.shared`. Module not found errors in the `azureml.automl.core.shared` namespace can be resolved by importing from `azureml.automl.runtime.shared`.
  + **azureml-contrib-automl-dnn-vision**
    + Exposed object detection yolo model.
  + **azureml-contrib-dataset**
    + Added functionality to filter Tabular Datasets by column values and File Datasets by metadata.
  + **azureml-contrib-fairness**
    + Include JSON schema in wheel for `azureml-contrib-fairness`
  + **azureml-contrib-mir**
    + With setting show_output to True when deploy models, inference configuration and deployment configuration is replayed before sending the request to server.
  + **azureml-core**
    + Added functionality to filter Tabular Datasets by column values and File Datasets by metadata.
    + Previously, it was possibly for users to create provisioning configurations for ComputeTarget's that didn't satisfy the password strength requirements for the `admin_user_password` field (that is, that they must contain at least 3 of the following: One lowercase letter, one uppercase letter, one digit, and one special character from the following set: ``\`~!@#$%^&*()=+_[]{}|;:./'",<>?``). If the user created a configuration with a weak password and ran a job using that configuration, the job would fail at runtime. Now, the call to `AmlCompute.provisioning_configuration` throws a `ComputeTargetException` with an accompanying error message explaining the password strength requirements.
    + Additionally, it was also possible in some cases to specify a configuration with a negative number of maximum nodes. It's no longer possible to do this. Now, `AmlCompute.provisioning_configuration` throws a `ComputeTargetException` if the `max_nodes` argument is a negative integer.
    + With setting show_output to True when deploy models, inference configuration and deployment configuration is displayed.
    + With setting show_output to True when wait for the completion of model deployment, the progress of deployment operation is displayed.
    + Allow customer specified Azure Machine Learning auth config directory through environment variable: AZUREML_AUTH_CONFIG_DIR
    + Previously, it was possible to create a provisioning configuration with the minimum node count less than the maximum node count. The job would run but fail at runtime. This bug has now been fixed. If you now try to create a provisioning configuration with `min_nodes < max_nodes` the SDK raises a `ComputeTargetException`.
  + **azureml-interpret**
    + fix explanation dashboard not showing aggregate feature importances for sparse engineered explanations
    + optimized memory usage of ExplanationClient in azureml-interpret package
  + **azureml-train-automl-client**
    +  Fixed show_output=False to return control to the user when running using spark.

## 2021-02-28
### Azure Machine Learning studio Notebooks Experience (February Update)
+ **New features**
  + [Native Terminal (GA)](../how-to-access-terminal.md). Users now have access to an integrated terminal and Git operation via the integrated terminal.
  + Notebook Snippets (preview). Common Azure Machine Learning code excerpts are now available at your fingertips. Navigate to the code snippets panel, accessible via the toolbar, or activate the in-code snippets menu using Ctrl + Space.
  + [Keyboard Shortcuts](../how-to-run-jupyter-notebooks.md#useful-keyboard-shortcuts). Full parity with keyboard shortcuts available in Jupyter.
  + Indicate Cell parameters. Shows users which cells in a notebook are parameter cells and can run parameterized notebooks via [Papermill](https://github.com/nteract/papermill) on the Compute Instance.
  + Terminal and Kernel session manager: Users are able to manage all kernels and terminal sessions running on their compute.
  + Sharing Button. Users can now share any file in the Notebook file explorer by right-clicking the file and using the share button.


+ **Bug fixes and improvements**
  + Improved page load times
  + Improved performance
  + Improved speed and kernel reliability
  + Added spinning wheel to show progress for all ongoing [Compute Instance operations](../how-to-run-jupyter-notebooks.md#status-indicators).
  + Right click in File Explorer. Right-clicking any file now opens file operations.


## 2021-02-16

### Azure Machine Learning SDK for Python v1.23.0
+ **Bug fixes and improvements**
  + **azureml-core**
    + [Experimental feature] Add support to link synapse workspace into AML as a linked service
    + [Experimental feature] Add support to attach synapse spark pool into AML as a compute
    + [Experimental feature] Add support for identity based data access. Users can register datastore or datasets without providing credentials. In such case, users' Azure AD token or managed identity of compute target is used for authentication. To learn more, see [Connect to storage by using identity-based data access](./how-to-identity-based-data-access.md).
  + **azureml-pipeline-steps**
    + [Experimental feature] Add support for [SynapseSparkStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.synapsesparkstep)
  + **azureml-synapse**
    + [Experimental feature] Add support of spark magic to run interactive session in synapse spark pool.
+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + In this update, we added holt winters exponential smoothing to forecasting toolbox of AutoML SDK. Given a time series, the best model is selected by [AICc (Corrected Akaike's Information Criterion)](https://otexts.com/fpp3/selecting-predictors.html#selecting-predictors) and returned.
    + AutoML now generates two log files instead of one. Log statements go to one or the other depending on which process the log statement was generated in.
    + Remove unnecessary in-sample prediction during model training with cross-validations. This may decrease model training time in some cases, especially for time-series forecasting models.
  + **azureml-contrib-fairness**
    + Add a JSON schema for the dashboardDictionary uploads.
  + **azureml-contrib-interpret**
    + azureml-contrib-interpret README is updated to reflect that package will be removed in next update after being deprecated since October, use azureml-interpret package instead
  + **azureml-core**
    + Previously, it was possible to create a provisioning configuration with the minimum node count less than the maximum node count. This has now been fixed. If you now try to create a provisioning configuration with `min_nodes < max_nodes` the SDK will raises a `ComputeTargetException`.
    +  Fixes bug in wait_for_completion in AmlCompute, which caused the function to return control flow before the operation was actually complete
    + Run.fail() is now deprecated, use Run.tag() to mark run as failed or use Run.cancel() to mark the run as canceled.
    + Show error message 'Environment name expected str, {} found' when provided environment name isn't a string.
  + **azureml-train-automl-client**
    + Fixed a bug that prevented AutoML experiments performed on Azure Databricks clusters from being canceled.


## 2021-02-09

### Azure Machine Learning SDK for Python v1.22.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Fixed bug where an extra pip dependency was added to the conda yml file for vision models.
  + **azureml-automl-runtime**
    + Fixed a bug where classical forecasting models (for example, AutoArima) could receive training data wherein rows with imputed target values weren't present. This violated the data contract of these models. * Fixed various bugs with lag-by-occurrence behavior in the time-series lagging operator. Previously, the lag-by-occurrence operation didn't mark all imputed rows correctly and so wouldn't always generate the correct occurrence lag values. Also fixed some compatibility issues between the lag operator and the rolling window operator with lag-by-occurrence behavior. This previously resulted in the rolling window operator dropping some rows from the training data that it should otherwise use.
  + **azureml-core**
    + Adding support for Token Authentication by audience.
    + Add `process_count` to [PyTorchConfiguration](/python/api/azureml-core/azureml.core.runconfig.pytorchconfiguration) to support multi-process multi-node PyTorch jobs.
  + **azureml-pipeline-steps**
    + [CommandStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.commandstep) now GA and no longer experimental.
    + [ParallelRunConfig](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallelrunconfig): add argument allowed_failed_count and allowed_failed_percent to check error threshold on mini batch level. Error threshold has three flavors now:
       + error_threshold - the number of allowed failed mini batch items;
       + allowed_failed_count - the number of allowed failed mini batches;
       + allowed_failed_percent- the percent of allowed failed mini batches.

       A job stops if exceeds any of them. error_threshold is required to keep it backward compatibility. Set the value to -1 to ignore it.
    + Fixed whitespace handling in AutoMLStep name.
    + ScriptRunConfig is now supported by HyperDriveStep
  + **azureml-train-core**
    + HyperDrive runs invoked from a ScriptRun is now considered a child run.
    + Add `process_count` to [PyTorchConfiguration](/python/api/azureml-core/azureml.core.runconfig.pytorchconfiguration) to support multi-process multi-node PyTorch jobs.
  + **azureml-widgets**
    + Add widget ParallelRunStepDetails to visualize status of a ParallelRunStep.
    + Allows hyperdrive users to see an axis on the parallel coordinates chart that shows the metric value corresponding to each set of hyperparameters for each child run.


 ## 2021-01-31
### Azure Machine Learning studio Notebooks Experience (January Update)
+ **New features**
  + Native Markdown Editor in Azure Machine Learning. Users can now render and edit markdown files natively in Azure Machine Learning Studio.
  + [Run Button for Scripts (.py, .R and .sh)](../how-to-run-jupyter-notebooks.md#run-a-notebook-or-python-script). Users can easily now run Python, R and Bash script in Azure Machine Learning
  + [Variable Explorer](../how-to-run-jupyter-notebooks.md#explore-variables-in-the-notebook). Explore the contents of variables and data frames in a pop-up panel. Users can easily check data type, size, and contents.
  + [Table of Content](../how-to-run-jupyter-notebooks.md#navigate-with-a-toc). Navigate to sections of your notebook, indicated by Markdown headers.
  + Export your Notebook as Latex/HTML/Py. Create easy-to-share notebook files by exporting to LaTex, HTML, or .py
  + Intellicode. ML-powered results provide an enhanced [intelligent autocompletion experience](/visualstudio/intellicode/overview).

+ **Bug fixes and improvements**
  + Improved page load times
  + Improved performance
  + Improved speed and kernel reliability


 ## 2021-01-25

### Azure Machine Learning SDK for Python v1.21.0
+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Fixed CLI help text when using AmlCompute with UserAssigned Identity
  + **azureml-contrib-automl-dnn-vision**
    + Deploy and download buttons become visible for AutoML vision runs, and models can be deployed or downloaded similar to other AutoML runs. There are two new files (scoring_file_v_1_0_0.py and conda_env_v_1_0_0.yml) which contain a script to run inferencing and a yml file to recreate the conda environment. The 'model.pth' file has also been renamed to use the '.pt' extension.
  + **azureml-core**
    + MSI support for azure-cli-ml
    + User Assigned Managed Identity Support.
    + With this change, the customers should be able to provide a user assigned identity that can be used to fetch the key from the customer key vault for encryption at rest.
    +  fix row_count=0 for the profile of large files - fix error in double conversion for delimited values with white space padding
    + Remove experimental flag for Output dataset GA
    + Update documentation on how to fetch specific version of a Model
    + Allow updating workspace for mixed mode access in private link
    + Fix to remove another registration on datastore for resume run feature
    + Added CLI/SDK support for updating primary user assigned identity of workspace
  + **azureml-interpret**
    + updated azureml-interpret to interpret-community 0.16.0
    + memory optimizations for explanation client in azureml-interpret
  + **azureml-train-automl-runtime**
    + Enabled streaming for ADB runs
  + **azureml-train-core**
    + Fix to remove another registration on datastore for resume run feature
  + **azureml-widgets**
    + Customers shouldn't see changes to existing run data visualization using the widget, and now have support if they optionally use conditional hyperparameters.
    + The user run widget now includes a detailed explanation for why a run is in the queued state.


 ## 2021-01-11

### Azure Machine Learning SDK for Python v1.20.0
+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + framework_version added in OptimizationConfig. It's used when model is registered with framework MULTI.
  + **azureml-contrib-optimization**
    + framework_version added in OptimizationConfig. It's used when model is registered with framework MULTI.
  + **azureml-pipeline-steps**
    + Introducing CommandStep, which would take command to process. Command can include executables, shell commands, scripts, etc.
  + **azureml-core**
    + Now workspace creation supports user assigned identity. Adding the uai support from SDK/CLI
    + Fixed issue on service.reload() to pick up changes on score.py in local deployment.
    + `run.get_details()` has an extra field named "submittedBy", which displays the author's name for this run.
    + Edited Model.register method documentation to mention how to register model from run directly
    + Fixed IOT-Server connection status change handling issue.


## 2020-12-31
### Azure Machine Learning studio Notebooks Experience (December Update)
+ **New features**
  + User Filename search. Users are now able to search all the files saved in a workspace.
  + Markdown Side by Side support per Notebook Cell. In a notebook cell, users can now have the option to view rendered markdown and markdown syntax side-by-side.
  + Cell Status Bar. The status bar indicates what state a code cell is in, whether a cell run was successful, and how long it took to run.

+ **Bug fixes and improvements**
  + Improved page load times
  + Improved performance
  + Improved speed and kernel reliability


## 2020-12-07

### Azure Machine Learning SDK for Python v1.19.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Added experimental support for test data to AutoMLStep.
    + Added the initial core implementation of test set ingestion feature.
    + Moved references to sklearn.externals.joblib to depend directly on joblib.
    + introduce a new AutoML task type of "image-instance-segmentation".
  + **azureml-automl-runtime**
    + Added the initial core implementation of test set ingestion feature.
    + When all the strings in a text column have a length of exactly one character, the TfIdf word-gram featurizer doesn't work because its tokenizer ignores the strings with fewer than two characters. The current code change allows AutoML to handle this use case.
    + introduce a new AutoML task type of "image-instance-segmentation".
  + **azureml-contrib-automl-dnn-nlp**
    + Initial PR for new dnn-nlp package
  + **azureml-contrib-automl-dnn-vision**
    + introduce a new AutoML task type of "image-instance-segmentation".
  + **azureml-contrib-automl-pipeline-steps**
    + This new package is responsible for creating steps required for many models train/inference scenario. - It also moves the train/inference code into azureml.train.automl.runtime package so any future fixes would be automatically available through curated environment releases.
  + **azureml-contrib-dataset**
    + introduce a new AutoML task type of "image-instance-segmentation".
  + **azureml-core**
    + Added the initial core implementation of test set ingestion feature.
    + Fixing the xref warnings for documentation in azureml-core package
    + Doc string fixes for Command support feature in SDK
    + Adding command property to RunConfiguration. The feature enables users to run an actual command or executables on the compute through Azure Machine Learning SDK.
    + Users can delete an empty experiment given the ID of that experiment.
  + **azureml-dataprep**
    + Added dataset support for Spark built with Scala 2.12. This adds to the existing 2.11 support.
  + **azureml-mlflow**
    + AzureML-MLflow adds safe guards in remote scripts to avoid early termination of submitted runs.
  + **azureml-pipeline-core**
    + Fixed a bug in setting a default pipeline for pipeline endpoint created via UI
  + **azureml-pipeline-steps**
    + Added experimental support for test data to AutoMLStep.
  + **azureml-tensorboard**
    + Fixing the xref warnings for documentation in azureml-core package
  + **azureml-train-automl-client**
    + Added experimental support for test data to AutoMLStep.
    + Added the initial core implementation of test set ingestion feature.
    + introduce a new AutoML task type of "image-instance-segmentation".
  + **azureml-train-automl-runtime**
    + Added the initial core implementation of test set ingestion feature.
    + Fix the computation of the raw explanations for the best AutoML model if the AutoML models are trained using validation_size setting.
    + Moved references to sklearn.externals.joblib to depend directly on joblib.
  + **azureml-train-core**
    + HyperDriveRun.get_children_sorted_by_primary_metric() should complete faster now
    + Improved error handling in HyperDrive SDK.
    + Deprecated all estimator classes in favor of using ScriptRunConfig to configure experiment runs. Deprecated classes include:
      + MMLBase
      + Estimator
      + PyTorch
      + TensorFlow
      + Chainer
      + SKLearn
    + Deprecated the use of Nccl and Gloo as valid input types for Estimator classes in favor of using PyTorchConfiguration with ScriptRunConfig.
    + Deprecated the use of Mpi as a valid input type for Estimator classes in favor of using MpiConfiguration with ScriptRunConfig.
    + Adding command property to run configuration. The feature enables users to run an actual command or executables on the compute through Azure Machine Learning SDK.

    +  Deprecated all estimator classes in favor of using ScriptRunConfig to configure experiment runs. Deprecated classes include: + MMLBaseEstimator + Estimator + PyTorch + TensorFlow + Chainer + SKLearn
    + Deprecated the use of Nccl and Gloo as a valid type of input for Estimator classes in favor of using PyTorchConfiguration with ScriptRunConfig.
    + Deprecated the use of Mpi as a valid type of input for Estimator classes in favor of using MpiConfiguration with ScriptRunConfig.

## 2020-11-30
### Azure Machine Learning studio Notebooks Experience (November Update)
+ **New features**
   + Native Terminal. Users now have access to an integrated terminal and Git operation via the [integrated terminal.](../how-to-access-terminal.md)
  + Duplicate Folder
  + Costing for Compute Drop Down
  + Offline Compute Pylance

+ **Bug fixes and improvements**
  + Improved page load times
  + Improved performance
  + Improved speed and kernel reliability
  + Large File Upload. You can now upload file >95 mb

## 2020-11-09

### Azure Machine Learning SDK for Python v1.18.0
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    +  Improved handling of short time series by allowing padding them with Gaussian noise.
  + **azureml-automl-runtime**
    + Throw ConfigException if a DateTime column has OutOfBoundsDatetime value
    + Improved handling of short time series by allowing padding them with Gaussian noise.
    + Making sure that each text column can use char-gram transform with the n-gram range based on the length of the strings in that text column
    + Providing raw feature explanations for best mode for AutoML experiments running on user's local compute
  + **azureml-core**
    + Pin the package: pyjwt to avoid pulling in breaking in versions upcoming releases.
    + Creating an experiment returns the active or last archived experiment with that same given name if such experiment exists or a new experiment.
    + Calling get_experiment by name returns the active or last archived experiment with that given name.
    + Users can't rename an experiment while reactivating it.
    + Improved error message to include potential fixes when a dataset is incorrectly passed to an experiment (for example, ScriptRunConfig).
    + Improved documentation for `OutputDatasetConfig.register_on_complete` to include the behavior of what happens when the name already exists.
    + Specifying dataset input and output names that have the potential to collide with common environment variables now results in a warning
    + Repurposed `grant_workspace_access` parameter when registering datastores. Set it to `True` to access data behind virtual network from Machine Learning studio.
      [Learn more](../how-to-enable-studio-virtual-network.md)
    + Linked service API is refined. Instead of providing resource ID, we have three separate parameters sub_id, rg, and name defined in configuration.
    + In order to enable customers to self-resolve token corruption issues, enable workspace token synchronization to be a public method.
    + This change allows an empty string to be used as a value for a script_param
  + **azureml-train-automl-client**
    +  Improved handling of short time series by allowing padding them with Gaussian noise.
  + **azureml-train-automl-runtime**
    + Throw ConfigException if a DateTime column has OutOfBoundsDatetime value
    + Added support for providing raw feature explanations for best model for AutoML experiments running on user's local compute
    + Improved handling of short time series by allowing padding them with Gaussian noise.
  + **azureml-train-core**
    + This change allows an empty string to be used as a value for a script_param
  + **azureml-train-restclients-hyperdrive**
    + README has been changed to offer more context
  + **azureml-widgets**
    + Add string support to charts/parallel-coordinates library for widget.

## 2020-11-05

### Data Labeling for image instance segmentation (polygon annotation) (preview)

The image instance segmentation (polygon annotations) project type in data labeling is available now, so users can draw and annotate with polygons around the contour of the objects in the images. Users are able assign a class and a polygon to each object which of interest within an image.

Learn more about [image instance segmentation labeling](../how-to-label-data.md).



## 2020-10-26

### Azure Machine Learning SDK for Python v1.17.0
+ **new examples**
  + A new community-driven repository of examples is available at https://github.com/Azure/azureml-examples
+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Fixed an issue where get_output may raise an XGBoostError.
  + **azureml-automl-runtime**
    + Time/calendar based features created by AutoML now have the prefix.
    + Fixed an IndexError occurring during training of StackEnsemble for classification datasets with large number of classes and subsampling enabled.
    + Fixed an issue where VotingRegressor predictions may be inaccurate after refitting the model.
  + **azureml-core**
    + More detail added about relationship between AKS deployment configuration and Azure Kubernetes Service concepts.
    + Environment client labels support. User can label Environments and reference them by label.
  + **azureml-dataprep**
    + Better error message when using currently unsupported Spark with Scala 2.12.
  + **azureml-explain-model**
    + The azureml-explain-model package is officially deprecated
  + **azureml-mlflow**
    + Resolved a bug in mlflow.projects.run against azureml backend where Finalizing state wasn't handled properly.
  + **azureml-pipeline-core**
    + Add support to create, list and get pipeline schedule based one pipeline endpoint.
    +  Improved the documentation of PipelineData.as_dataset with an invalid usage example - Using PipelineData.as_dataset improperly now results in a ValueException being thrown
    + Changed the HyperDriveStep pipelines notebook to register the best model within a PipelineStep directly after the HyperDriveStep run.
  + **azureml-pipeline-steps**
    + Changed the HyperDriveStep pipelines notebook to register the best model within a PipelineStep directly after the HyperDriveStep run.
  + **azureml-train-automl-client**
    + Fixed an issue where get_output may raise an XGBoostError.

### Azure Machine Learning studio Notebooks Experience (October Update)
+ **New features**
  + [Full virtual network support](../how-to-enable-studio-virtual-network.md)
  + [Focus Mode](../how-to-run-jupyter-notebooks.md#focus-mode)
  + Save notebooks Ctrl-S
  + Line Numbers

+ **Bug fixes and improvements**
  + Improvement in speed and kernel reliability
  + Jupyter Widget UI updates

## 2020-10-12

### Azure Machine Learning SDK for Python v1.16.0
+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + AKSWebservice and AKSEndpoints now support pod-level CPU and Memory resource limits. These optional limits can be used by setting `--cpu-cores-limit` and `--memory-gb-limit` flags in applicable CLI calls
  + **azureml-core**
    + Pin major versions of direct dependencies of azureml-core
    + AKSWebservice and AKSEndpoints now support pod-level CPU and Memory resource limits. More information on [Kubernetes Resources and Limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
    + Updated run.log_table to allow individual rows to be logged.
    + Added static method `Run.get(workspace, run_id)` to retrieve a run only using a workspace
    + Added instance method `Workspace.get_run(run_id)` to retrieve a run within the workspace
    + Introducing command property in run configuration, which enables users to submit command instead of script & arguments.
  + **azureml-interpret**
    + fixed explanation client is_raw flag behavior in azureml-interpret
  + **azureml-sdk**
    + `azureml-sdk` officially support Python 3.8.
  + **azureml-train-core**
    + Adding TensorFlow 2.3 curated environment
    + Introducing command property in run configuration, which enables users to submit command instead of script & arguments.
  + **azureml-widgets**
    + Redesigned interface for script run widget.


## 2020-09-28

### Azure Machine Learning SDK for Python v1.15.0
+ **Bug fixes and improvements**
  + **azureml-contrib-interpret**
    + LIME explainer moved from azureml-contrib-interpret to interpret-community package and image explainer removed from azureml-contrib-interpret package
    + visualization dashboard removed from azureml-contrib-interpret package, explanation client moved to azureml-interpret package and deprecated in azureml-contrib-interpret package and notebooks updated to reflect improved API
    + fix pypi package descriptions for azureml-interpret, azureml-explain-model, azureml-contrib-interpret and azureml-tensorboard
  + **azureml-contrib-notebook**
    + Pin nbcovert dependency to < 6 so that papermill 1.x continues to work.
  + **azureml-core**
    + Added parameters to the TensorflowConfiguration and MpiConfiguration constructor to enable a more streamlined initialization of the class attributes without requiring the user to set each individual attribute. Added a PyTorchConfiguration class for configuring distributed PyTorch jobs in ScriptRunConfig.
    + Pin the version of azure-mgmt-resource to fix the authentication error.
    + Support Triton No Code Deploy
    + outputs directories specified in Run.start_logging() are now tracked when using run in interactive scenarios. The tracked files are visible on ML Studio upon calling Run.complete()
    + File encoding can be now specified during dataset creation with `Dataset.Tabular.from_delimited_files` and `Dataset.Tabular.from_json_lines_files` by passing the `encoding` argument. The supported encodings are 'utf8', 'iso88591', 'latin1', 'ascii', utf16', 'utf32', 'utf8bom' and 'windows1252'.
    + Bug fix when environment object isn't passed to ScriptRunConfig constructor.
    + Updated Run.cancel() to allow cancel of a local run from another machine.
  + **azureml-dataprep**
    +  Fixed dataset mount timeout issues.
  + **azureml-explain-model**
    + fix pypi package descriptions for azureml-interpret, azureml-explain-model, azureml-contrib-interpret and azureml-tensorboard
  + **azureml-interpret**
    + visualization dashboard removed from azureml-contrib-interpret package, explanation client moved to azureml-interpret package and deprecated in azureml-contrib-interpret package and notebooks updated to reflect improved API
    + azureml-interpret package updated to depend on interpret-community 0.15.0
    + fix pypi package descriptions for azureml-interpret, azureml-explain-model, azureml-contrib-interpret and azureml-tensorboard
  + **azureml-pipeline-core**
    +  Fixed pipeline issue with `OutputFileDatasetConfig` where the system may stop responding when`register_on_complete` is called with the `name` parameter set to a pre-existing dataset name.
  + **azureml-pipeline-steps**
    + Removed stale databricks notebooks.
  + **azureml-tensorboard**
    + fix pypi package descriptions for azureml-interpret, azureml-explain-model, azureml-contrib-interpret and azureml-tensorboard
  + **azureml-train-automl-runtime**
    + visualization dashboard removed from azureml-contrib-interpret package, explanation client moved to azureml-interpret package and deprecated in azureml-contrib-interpret package and notebooks updated to reflect improved API
  + **azureml-widgets**
    + visualization dashboard removed from azureml-contrib-interpret package, explanation client moved to azureml-interpret package and deprecated in azureml-contrib-interpret package and notebooks updated to reflect improved API

## 2020-09-21

### Azure Machine Learning SDK for Python v1.14.0
+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Grid Profiling removed from the SDK and isn't longer supported.
  + **azureml-accel-models**
    + azureml-accel-models package now supports TensorFlow 2.x
  + **azureml-automl-core**
    + Added error handling in get_output for cases when local versions of pandas/sklearn don't match the ones used during training
  + **azureml-automl-runtime**
    + Fixed a bug where AutoArima iterations would fail with a PredictionException and the message: "Silent failure occurred during prediction."
  + **azureml-cli-common**
    + Grid Profiling removed from the SDK and isn't longer supported.
  + **azureml-contrib-server**
    + Update description of the package for pypi overview page.
  + **azureml-core**
    + Grid Profiling removed from the SDK and is no longer supported.
    + Reduce number of error messages when workspace retrieval fails.
    + Don't show warning when fetching metadata fails
    + New Kusto Step and Kusto Compute Target.
    + Update document for sku parameter. Remove sku in workspace update functionality in CLI and SDK.
    + Update description of the package for pypi overview page.
    + Updated documentation for Azure Machine Learning Environments.
    + Expose service managed resources settings for AML workspace in SDK.
  + **azureml-dataprep**
    + Enable execute permission on files for Dataset mount.
  + **azureml-mlflow**
    + Updated Azure Machine Learning MLflow documentation and notebook samples
    + New support for MLflow projects with Azure Machine Learning backend
    + MLflow model registry support
    + Added Azure RBAC support for AzureML-MLflow operations

  + **azureml-pipeline-core**
    + Improved the documentation of the PipelineOutputFileDataset.parse_* methods.
    + New Kusto Step and Kusto Compute Target.
    + Provided Swaggerurl property for pipeline-endpoint entity via that user can see the schema definition for published pipeline endpoint.
  + **azureml-pipeline-steps**
    + New Kusto Step and Kusto Compute Target.
  + **azureml-telemetry**
    + Update description of the package for pypi overview page.
  + **azureml-train**
    + Update description of the package for pypi overview page.
  + **azureml-train-automl-client**
    + Added error handling in get_output for cases when local versions of pandas/sklearn don't match the ones used during training
  + **azureml-train-core**
    + Update description of the package for pypi overview page.

## 2020-08-31

### Azure Machine Learning SDK for Python v1.13.0
+ **Preview features**
  + **azureml-core**
    With the new output datasets capability, you can write back to cloud storage including Blob, ADLS Gen 1, ADLS Gen 2, and FileShare. You can configure where to output data, how to output data (via mount or upload), whether to register the output data for future reuse and sharing and pass intermediate data between pipeline steps seamlessly. This enables reproducibility, sharing, prevents duplication of data, and results in cost efficiency and productivity gains. [Learn how to use it](/python/api/azureml-core/azureml.data.output_dataset_config.outputfiledatasetconfig)

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Added validated_{platform}_requirements.txt file for pinning all pip dependencies for AutoML.
    + This release supports models greater than 4 Gb.
    + Upgraded AutoML dependencies: `scikit-learn` (now 0.22.1), `pandas` (now 0.25.1), `numpy` (now 1.18.2).
  + **azureml-automl-runtime**
    + Set horovod for text DNN to always use fp16 compression.
    + This release supports models greater than 4 Gb.
    + Fixed issue where AutoML fails with ImportError: can't import name `RollingOriginValidator`.
    + Upgraded AutoML dependencies: `scikit-learn` (now 0.22.1), `pandas` (now 0.25.1), `numpy` (now 1.18.2).
  + **azureml-contrib-automl-dnn-forecasting**
    + Upgraded AutoML dependencies: `scikit-learn` (now 0.22.1), `pandas` (now 0.25.1), `numpy` (now 1.18.2).
  + **azureml-contrib-fairness**
    + Provide a short description for azureml-contrib-fairness.
  + **azureml-contrib-pipeline-steps**
    + Added message indicating this package is deprecated and user should use azureml-pipeline-steps instead.
  + **azureml-core**
    + Added list key command for workspace.
    + Add tags parameter in Workspace SDK and CLI.
    + Fixed the bug where submitting a child run with Dataset fails due to `TypeError: can't pickle _thread.RLock objects`.
    + Adding page_count default/documentation for Model list().
    + Modify CLI&SDK to take adbworkspace parameter and Add workspace adb lin/unlink runner.
    + Fix bug in Dataset.update that caused newest Dataset version to be updated not the version of the Dataset update was called on.
    + Fix bug in Dataset.get_by_name that would show the tags for the newest Dataset version even when a specific older version was retrieved.
  + **azureml-interpret**
    + Added probability outputs to shap scoring explainers in azureml-interpret based on shap_values_output parameter from original explainer.
  + **azureml-pipeline-core**
    + Improved `PipelineOutputAbstractDataset.register`'s documentation.
  + **azureml-train-automl-client**
    + Upgraded AutoML dependencies: `scikit-learn` (now 0.22.1), `pandas` (now 0.25.1), `numpy` (now 1.18.2).
  + **azureml-train-automl-runtime**
    + Upgraded AutoML dependencies: `scikit-learn` (now 0.22.1), `pandas` (now 0.25.1), `numpy` (now 1.18.2).
  + **azureml-train-core**
    + Users must now provide a valid hyperparameter_sampling arg when creating a HyperDriveConfig. In addition, the documentation for HyperDriveRunConfig has been edited to inform users of the deprecation of HyperDriveRunConfig.
    + Reverting PyTorch Default Version to 1.4.
    + Adding PyTorch 1.6 & TensorFlow 2.2 images and curated environment.

### Azure Machine Learning studio Notebooks Experience (August Update)
+ **New features**
  + New Getting started landing Page

+ **Preview features**
    + Gather feature in Notebooks. With the [Gather](../how-to-run-jupyter-notebooks.md#clean-your-notebook-preview) feature, users can now easily clean up notebooks with, Gather uses an automated dependency analysis of your notebook, ensuring the essential code is kept, but removing any irrelevant pieces.

+ **Bug fixes and improvements**
  + Improvement in speed and reliability
  + Dark mode bugs fixed
  + Output Scroll Bugs fixed
  + Sample Search now searches all the content of all the files in the Azure Machine Learning sample notebooks repo
  + Multi-line R cells can now run
  + "I trust contents of this file" is now auto checked after first time
  + Improved Conflict resolution dialog, with new "Make a copy" option

## 2020-08-17

### Azure Machine Learning SDK for Python v1.12.0

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Add image_name and image_label parameters to Model.package() to enable renaming the built package image.
  + **azureml-automl-core**
    + AutoML raises a new error code from dataprep when content is modified while being read.
  + **azureml-automl-runtime**
    + Added alerts for the user when data contains missing values but featurization is turned off.
    + Fixed child runs failures when data contains nan and featurization is turned off.
    + AutoML raises a new error code from dataprep when content is modified while being read.
    + Updated normalization for forecasting metrics to occur by grain.
    + Improved calculation of forecast quantiles when lookback features are disabled.
    + Fixed bool sparse matrix handling when computing explanations after AutoML.
  + **azureml-core**
    + A new method `run.get_detailed_status()` now shows the detailed explanation of current run status. It's currently only showing explanation for `Queued` status.
    + Add image_name and image_label parameters to Model.package() to enable renaming the built package image.
    + New method `set_pip_requirements()` to set the entire pip section in [`CondaDependencies`](/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies) at once.
    + Enable registering credential-less ADLS Gen2 datastore.
    + Improved error message when trying to download or mount an incorrect dataset type.
    + Update time series dataset filter sample notebook with more examples of partition_timestamp that provides filter optimization.
    + Change the sdk and CLI to accept subscriptionId, resourceGroup, workspaceName, peConnectionName as parameters instead of ArmResourceId when deleting private endpoint connection.
    + Experimental Decorator shows class name for easier identification.
    + Descriptions for the Assets inside of Models are no longer automatically generated based on a Run.
  + **azureml-datadrift**
    + Mark create_from_model API in DataDriftDetector as to be deprecated.
  + **azureml-dataprep**
    + Improved error message when trying to download or mount an incorrect dataset type.
  + **azureml-pipeline-core**
    + Fixed bug when deserializing pipeline graph that contains registered datasets.
  + **azureml-pipeline-steps**
    + RScriptStep supports RSection from azureml.core.environment.
    + Removed the passthru_automl_config parameter from the `AutoMLStep` public API and converted it to an internal only parameter.
  + **azureml-train-automl-client**
    + Removed local asynchronous, managed environment runs from AutoML. All local runs run in the environment the run was launched from.
    + Fixed snapshot issues when submitting AutoML runs with no user-provided scripts.
    + Fixed child run failures when data contains nan and featurization is turned off.
  + **azureml-train-automl-runtime**
    + AutoML raises a new error code from dataprep when content is modified while being read.
    + Fixed snapshot issues when submitting AutoML runs with no user-provided scripts.
    + Fixed child run failures when data contains nan and featurization is turned off.
  + **azureml-train-core**
    + Added support for specifying pip options (for example--extra-index-url) in the pip requirements file passed to an [`Estimator`](/python/api/azureml-train-core/azureml.train.estimator.estimator) through `pip_requirements_file` parameter.


## 2020-08-03

### Azure Machine Learning SDK for Python v1.11.0

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Fix model framework and model framework not passed in run object in CLI model registration path
    + Fix CLI amlcompute identity show command to show tenant ID and principal ID
  + **azureml-train-automl-client**
    + Added get_best_child () to AutoMLRun for fetching the best child run for an AutoML Run without downloading the associated model.
    + Added ModelProxy object that allows predict or forecast to be run on a remote training environment without downloading the model locally.
    + Unhandled exceptions in AutoML now point to a known issues HTTP page, where more information about the errors can be found.
  + **azureml-core**
    + Model names can be 255 characters long.
    + Environment.get_image_details() return object type changed. `DockerImageDetails` class replaced `dict`, image details are available from the new class properties. Changes are backward compatible.
    + Fix bug for Environment.from_pip_requirements() to preserve dependencies structure
    + Fixed a bug where log_list would fail if an int and double were included in the same list.
    + While enabling private link on an existing workspace, note that if there are compute targets associated with the workspace, those targets won't work if they are not behind the same virtual network as the workspace private endpoint.
    + Made `as_named_input` optional when using datasets in experiments and added `as_mount` and `as_download` to `FileDataset`. The input name is automatically generated if `as_mount` or `as_download` is called.
  + **azureml-automl-core**
    + Unhandled exceptions in AutoML now point to a known issues HTTP page, where more information about the errors can be found.
    + Added get_best_child () to AutoMLRun for fetching the best child run for an AutoML Run without downloading the associated model.
    + Added ModelProxy object that allows predict or forecast to be run on a remote training environment without downloading the model locally.
  + **azureml-pipeline-steps**
    + Added `enable_default_model_output` and `enable_default_metrics_output` flags to `AutoMLStep`. These flags can be used to enable/disable the default outputs.


## 2020-07-20

### Azure Machine Learning SDK for Python v1.10.0

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + When using AutoML, if a path is passed into the AutoMLConfig object and it does not already exist, it is automatically created.
    + Users can now specify a time series frequency for forecasting tasks by using the `freq` parameter.
  + **azureml-automl-runtime**
    + When using AutoML, if a path is passed into the AutoMLConfig object and it does not already exist, it is automatically created.
    + Users can now specify a time series frequency for forecasting tasks by using the `freq` parameter.
    + AutoML Forecasting now supports rolling evaluation, which applies to the use case that the length of a test or validation set is longer than the input horizon, and known y_pred value is used as forecasting context.
  + **azureml-core**
    + Warning messages are printed if no files were downloaded from the datastore in a run.
    + Added documentation for `skip_validation` to the `Datastore.register_azure_sql_database method`.
    + Users are required to upgrade to sdk v1.10.0 or above to create an auto approved private endpoint. This includes the Notebook resource that is usable behind the VNet.
    + Expose NotebookInfo in the response of get workspace.
    + Changes to have calls to list compute targets and getting compute target succeed on a remote run. Sdk functions to get compute target and list workspace compute targets now works in remote runs.
    + Add deprecation messages to the class descriptions for azureml.core.image classes.
    + Throw exception and clean up workspace and dependent resources if workspace private endpoint creation fails.
    + Support workspace sku upgrade in workspace update method.
  + **azureml-datadrift**
    + Update matplotlib version from 3.0.2 to 3.2.1 to support Python 3.8.
  + **azureml-dataprep**
    + Added support of web url data sources with `Range` or `Head` request.
    + Improved stability for file dataset mount and download.
  + **azureml-train-automl-client**
    + Fixed issues related to removal of `RequirementParseError` from setuptools.
    + Use docker instead of conda for local runs submitted using "compute_target='local'"
    + The iteration duration printed to the console has been corrected. Previously, the iteration duration was sometimes printed as run end time minus run creation time. It has been corrected to equal run end time minus run start time.
    + When using AutoML, if a path is passed into the AutoMLConfig object and it does not already exist, it is automatically created.
    + Users can now specify a time series frequency for forecasting tasks by using the `freq` parameter.
  + **azureml-train-automl-runtime**
    + Improved console output when best model explanations fail.
    + Renamed input parameter to "blocked_models" to remove a sensitive term.
      + Renamed input parameter to "allowed_models" to remove a sensitive term.
    + Users can now specify a time series frequency for forecasting tasks by using the `freq` parameter.


## 2020-07-06

### Azure Machine Learning SDK for Python v1.9.0

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Replaced get_model_path() with AZUREML_MODEL_DIR environment variable in AutoML autogenerated scoring script. Also added telemetry to track failures during init().
    + Removed the ability to specify `enable_cache` as part of AutoMLConfig
    + Fixed a bug where runs may fail with service errors during specific forecasting runs
    + Improved error handling around specific models during `get_output`
    + Fixed call to fitted_model.fit(X, y) for classification with y transformer
    + Enabled customized forward fill imputer for forecasting tasks
    + A new ForecastingParameters class is used instead of forecasting parameters in a dict format
    + Improved target lag autodetection
    + Added limited availability of multi-noded, multi-gpu distributed featurization with BERT
  + **azureml-automl-runtime**
    + Prophet now does additive seasonality modeling instead of multiplicative.
    + Fixed the issue when short grains, having frequencies different from ones of the long grains results in failed runs.
  + **azureml-contrib-automl-dnn-vision**
    + Collect system/gpu stats and log averages for training and scoring
  + **azureml-contrib-mir**
    + Added support for enable-app-insights flag in ManagedInferencing
  + **azureml-core**
    + A validate parameter to these APIs by allowing validation to be skipped when the data source is not accessible from the current compute.
      + TabularDataset.time_before(end_time, include_boundary=True, validate=True)
      + TabularDataset.time_after(start_time, include_boundary=True, validate=True)
      + TabularDataset.time_recent(time_delta, include_boundary=True, validate=True)
      + TabularDataset.time_between(start_time, end_time, include_boundary=True, validate=True)
    + Added framework filtering support for model list, and added NCD AutoML sample in notebook back
    + For Datastore.register_azure_blob_container and Datastore.register_azure_file_share (only options that support SAS token), we have updated the doc strings for the `sas_token` field to include minimum permissions requirements for typical read and write scenarios.
    + Deprecating _with_auth param in ws.get_mlflow_tracking_uri()
  + **azureml-mlflow**
    + Add support for deploying local file:// models with AzureML-MLflow
    + Deprecating _with_auth param in ws.get_mlflow_tracking_uri()
  + **azureml-opendatasets**
    + Recently published Covid-19 tracking datasets are now available with the SDK
  + **azureml-pipeline-core**
    + Log out warning when "azureml-defaults" is not included as part of pip-dependency
    + Improve Note rendering.
    + Added support for quoted line breaks when parsing delimited files to PipelineOutputFileDataset.
    + The PipelineDataset class is deprecated. For more information, see https://aka.ms/dataset-deprecation. Learn how to use dataset with pipeline, see https://aka.ms/pipeline-with-dataset.
  + **azureml-pipeline-steps**
    + Doc updates to azureml-pipeline-steps.
    +  Added support in ParallelRunConfig's `load_yaml()` for users to define Environments inline with the rest of the config or in a separate file
  + **azureml-train-automl-client**.
    + Removed the ability to specify `enable_cache` as part of AutoMLConfig
  + **azureml-train-automl-runtime**
    + Added limited availability of multi-noded, multi-gpu distributed featurization with BERT.
    + Added error handling for incompatible packages in ADB based automated machine learning runs.
  + **azureml-widgets**
    + Doc updates to azureml-widgets.


## 2020-06-22

### Azure Machine Learning SDK for Python v1.8.0

  + **Preview features**
    + **azureml-contrib-fairness**
      The `azureml-contrib-fairness` package provides integration between the open-source fairness assessment and unfairness mitigation package [Fairlearn](https://fairlearn.github.io) and Azure Machine Learning studio. In particular, the package enables model fairness evaluation dashboards to be uploaded as part of an Azure Machine Learning Run and appear in Azure Machine Learning studio

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Support getting logs of init container.
    + Added new CLI commands to manage ComputeInstance
  + **azureml-automl-core**
    + Users are now able to enable stack ensemble iteration for Time series tasks with a warning that it could potentially overfit.
    + Added a new type of user exception  that is raised if the cache store contents have been tampered with
  + **azureml-automl-runtime**
    + Class Balancing Sweeping is no longer enabled if user disables featurization.
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
    + Support user-selected datastore to store profiling data
    + Added expand and page_count property for model list API
    + Fixed bug where removing the overwrite property causes the submitted run to fail with deserialization error.
    + Fixed inconsistent folder structure when downloading or mounting a FileDataset referencing to a single file.
    + Loading a dataset of parquet files to_spark_dataframe is now faster and supports all parquet and Spark SQL datatypes.
    + Support getting logs of init container.
    + AutoML runs are now marked as child run of Parallel Run Step.
  + **azureml-datadrift**
    + Doc improvements to azureml-contrib-notebook package.
  + **azureml-dataprep**
    + Loading a dataset of parquet files to_spark_dataframe is now faster and supports all parquet and Spark SQL datatypes.
    + Better memory handling for OutOfMemory issue for to_pandas_dataframe.
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
    + Users are now able to enable stack ensemble iteration for Time series tasks with a warning that it could potentially overfit.
    + Changed AutoML run behavior to raise UserErrorException if service throws user error
    + Fixes a bug that caused azureml_automl.log to not get generated or be missing logs when performing an AutoML experiment on a remote compute target.
    + For Classification data sets with imbalanced classes, we apply Weight Balancing, if the feature sweeper determines that for subsampled data, Weight Balancing improves the performance of the classification task by a certain threshold.
    + AutoML runs are now marked as child run of Parallel Run Step.
  + **azureml-train-automl-runtime**
    + Changed AutoML run behavior to raise UserErrorException if service throws user error
    + AutoML runs are now marked as child run of Parallel Run Step.


## 2020-06-08

### Azure Machine Learning SDK for Python v1.7.0

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Completed the removal of model profiling from mir contrib by cleaning up CLI commands and package dependencies, Model profiling is available in core.
    + Upgrades the min Azure CLI version to 2.3.0
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
    + Added support of dates before 1677-09-21 or after 2262-04-11 in columns other than date time in the forecasting tasks. Improved error messages.
    + The forecasting parameters documentation was improved. The lag_length parameter was deprecated.
    + Better exception message on featurization step fit_transform() due to custom transformer parameters.
    + Add support for multiple languages for deep learning transformer models such as BERT in automated ML.
    + Cache operations that result in some OSErrors raises user error.
    + Added checks to ensure training and validation data have the same number and set of columns
    + Fixed issue with the autogenerated AutoML scoring script when the data contains quotation marks
    + Enabling explanations for AutoML Prophet and ensemble models that contain Prophet model.
    + A recent customer issue revealed a live-site bug wherein we log messages along Class-Balancing-Sweeping even when the Class Balancing logic isn't properly enabled. Removing those logs/messages with this PR.
  + **azureml-cli-common**
    + Completed the removal of model profiling from mir contrib by cleaning up CLI commands and package dependencies, Model profiling is available in core.
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
    + Add true_ys optional parameter to explanation upload to enable more features in the studio UI
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
    + Enabling explanations for AutoML Prophet and ensemble models that contain Prophet model.
    + Documentation updates to azureml-train-automl-* packages.
  + **azureml-train-core**
    + Supporting TensorFlow version 2.1 in the PyTorch Estimator
    + Improvements to azureml-train-core package.

## 2020-05-26

### Azure Machine Learning SDK for Python v1.6.0

+ **New features**
  + **azureml-automl-runtime**
    + AutoML Forecasting now supports customers forecast beyond the prespecified max-horizon without retraining the model. When the forecast destination is farther into the future than the specified maximum horizon, the forecast() function still makes point predictions out to the later date using a recursive operation mode. For the illustration of the new feature, see the "Forecasting farther than the maximum horizon" section of "forecasting-forecast-function" notebook in [folder](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning)."

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
      + ParallelRunStep does not inject any packages, user needs to include **azureml-core** and **azureml-dataprep[pandas, fuse]** packages in environment definition. If custom docker image is used with user_managed_dependencies, then user need to install conda on the image.

+ **Breaking changes**
  + **azureml-pipeline-steps**
    + Deprecated the use of azureml.dprep.Dataflow as a valid type of input for AutoMLConfig
  + **azureml-train-automl-client**
    + Deprecated the use of azureml.dprep.Dataflow as a valid type of input for AutoMLConfig

+ **Bug fixes and improvements**
  + **azureml-automl-core**
    + Fixed the bug where a warning may be printed during `get_output` that asked user to downgrade client.
    + Updated Mac to rely on cudatoolkit=9.0 as it is not available at version 10 yet.
    + Removing restrictions on prophet and xgboost models when trained on remote compute.
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
    + Removing restrictions on prophet and xgboost models when trained on remote compute.
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
    + Fixed the information provided to the user in profiling failure: included request ID and reworded the message to be more meaningful. Added new profiling workflow to profiling runners
    + Improved error text in Dataset execution failures.
    + Workspace private link CLI support added.
    + Added an optional parameter `invalid_lines` to `Dataset.Tabular.from_json_lines_files` that allows for specifying how to handle lines that contain invalid JSON.
    + We will be deprecating the run-based creation of compute in the next release. We recommend creating an actual Amlcompute cluster as a persistent compute target, and using the cluster name as the compute target in your run configuration. See example notebook here: aka.ms/amlcomputenb
    + Improved error messages in Dataset execution failures.
  + **azureml-dataprep**
    + Made warning to upgrade pyarrow version more explicit.
    + Improved error handling and message returned in failure to execute dataflow.
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
    + Removing restrictions on prophet and xgboost models when trained on remote compute.
    + `azureml-train-automl-runtime` and `azureml-automl-runtime` have updated dependencies for `pytorch`, `scipy`, and `cudatoolkit`. we now support `pytorch==1.4.0`, `scipy>=1.0.0,<=1.3.1`, and `cudatoolkit==10.1.243`.
    + Added functionality to allow users to include lagged features to generate forecasts.
  + **azureml-train-automl-runtime**
    + Improved logging in AutoML
    + Added fine grained error handling for data prep exceptions
    + Removing restrictions on prophet and xgboost models when trained on remote compute.
    + `azureml-train-automl-runtime` and `azureml-automl-runtime` have updated dependencies for `pytorch`, `scipy`, and `cudatoolkit`. we now support `pytorch==1.4.0`, `scipy>=1.0.0,<=1.3.1`, and `cudatoolkit==10.1.243`.
    + Updates to error message to correctly display user error.
    + Support for cv_split_column_names to be used with training_data
  + **azureml-train-core**
    + Added a new set of HyperDrive specific exceptions. azureml.train.hyperdrive now throws detailed exceptions.
  + **azureml-widgets**
    + Azure Machine Learning Widgets is not displaying in JupyterLab


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
    + Speed up Prophet/AutoArima model in AutoML forecasting by enabling parallel fitting for the time series when data sets have multiple time series. In order to benefit from this new feature, you are recommended to set "max_cores_per_iteration = -1" (that is, using all the available cpu cores) in AutoMLConfig.
    + Fix KeyError on printing guardrails in console interface
    + Fixed error message for experimentation_timeout_hours
    + Deprecated TensorFlow models for AutoML.
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
    + Adds a class azureml.contrib.mir.RevisionStatus, which relays information about the currently deployed MIR revision and the most recent version specified by the user. This class is included in the MirWebservice object under 'deployment_status' attribute.
    + Enables update on Webservices of type MirWebservice and its child class SingleModelMirWebservice.
  + **azureml-contrib-reinforcementlearning**
    + Added support for Ray 0.8.3
    + AmlWindowsCompute only supports Azure Files as mounted storage
    + Renamed health_check_timeout to health_check_timeout_seconds
    + Fixed some class/method descriptions.
  + **azureml-core**
    + Enabled WASB -> Blob conversions in Azure Government and China clouds.
    + Fixes bug to allow Reader roles to use az ml run CLI commands to get run information
    + Removed unnecessary logging during Azure Machine Learning Remote Runs with input Datasets.
    + RCranPackage now supports "version" parameter for the CRAN package version.
    + Bug fix: inform clients about partial failure during profiling
    + Added European-style float handling for azureml-core.
    + Enabled workspace private link features in Azure Machine Learning sdk.
    + When creating a TabularDataset using `from_delimited_files`, you can specify whether empty values should be loaded as None or as empty string by setting the boolean argument `empty_as_string`.
    + Added European-style float handling for datasets.
    + Improved error messages on dataset mount failures.
  + **azureml-datadrift**
    + Data Drift results query from the SDK had a bug that didn't differentiate the minimum, maximum, and mean feature metrics, resulting in duplicate values. We have fixed this bug by prefixing target or baseline to the metric names. Before: duplicate min, max, mean. After: target_min, target_max, target_mean, baseline_min, baseline_max, baseline_mean.
  + **azureml-dataprep**
    + Improve handling of write restricted Python environments when ensuring .NET Dependencies required for data delivery.
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
    + Deprecated TensorFlow models for AutoML.
    + Fix users allow listing unsupported algorithms in local mode
    + Doc fixes to AutoMLConfig.
    + Enforcing datatype checks on cv_split_indices input in AutoMLConfig.
    + Fixed issue with AutoML runs failing in show_output
  + **azureml-train-automl-runtime**
    + Fixing a bug in Ensemble iterations that was preventing model download timeout from kicking in successfully.
  + **azureml-train-core**
    + Fix typo in azureml.train.dnn.Nccl class.
    + Supporting PyTorch version 1.5 in the PyTorch Estimator
    + Fix the issue that framework image can't be fetched in Azure Government region when using training framework estimators


## 2020-05-04
**New Notebook Experience**

You can now create, edit, and share machine learning notebooks and files directly inside the studio web experience of Azure Machine Learning. You can use all the classes and methods available in [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro) from inside these notebooks.
To get started, visit the [Run Jupyter Notebooks in your workspace](../how-to-run-jupyter-notebooks.md) article.

**New Features Introduced:**

+ Improved editor (Monaco editor) used by Visual Studio Code
+ UI/UX improvements
+ Cell Toolbar
+ New Notebook Toolbar and Compute Controls
+ Notebook Status Bar
+ Inline Kernel Switching
+ R Support
+ Accessibility and Localization improvements
+ Command Palette
+ More Keyboard Shortcuts
+ Auto save
+ Improved performance and reliability

Access the following web-based authoring tools from the studio:

| Web-based tool | Description |
|---|---|
| Azure Machine Learning Studio Notebooks | First in-class authoring for notebook files and support all operation available in the Azure Machine Learning Python SDK. |

## 2020-04-27

### Azure Machine Learning SDK for Python v1.4.0

+ **New features**
  + AmlCompute clusters now support setting up a managed identity on the cluster at the time of provisioning. Just specify whether you would like to use a system-assigned identity or a user-assigned identity, and pass an identityId for the latter. You can then set up permissions to access various resources like Storage or ACR in a way that the identity of the compute gets used to securely access the data, instead of a token-based approach that AmlCompute employs today. Check out our SDK reference for more information on the parameters.


+ **Breaking changes**
  + AmlCompute clusters supported a Preview feature around run-based creation, that we are planning on deprecating in two weeks. You can continue to create persistent compute targets as always by using the Amlcompute class, but the specific approach of specifying the identifier "amlcompute" as the compute target in run config will not be supported soon.

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
    + Added more telemetry around post-training operations.
    + Speeds up automatic ARIMA training by using conditional sum of squares (CSS) training for series of length longer than 100. The length used is stored as the constant ARIMA_TRIGGER_CSS_TRAINING_LENGTH w/in the TimeSeriesInternal class at /src/azureml-automl-core/azureml/automl/core/shared/constants.py
    + The user logging of forecasting runs was improved, now more information on what phase is currently running is shown in the log
    + Disallowed target_rolling_window_size to be set to values less than 2
  + **azureml-automl-runtime**
    + Improved the error message shown when duplicated timestamps are found.
    + Disallowed target_rolling_window_size to be set to values less than 2.
    + Fixed the lag imputation failure. The issue was caused by the insufficient number of observations needed to seasonally decompose a series. The "de-seasonalized" data is used to compute a partial autocorrelation function (PACF) to determine the lag length.
    + Enabled column purpose featurization customization for forecasting tasks by featurization config. Numerical and Categorical as column purpose for forecasting tasks is now supported.
    + Enabled drop column featurization customization for forecasting tasks by featurization config.
    + Enabled imputation customization for forecasting tasks by featurization config. Constant value imputation for target column and mean, median, most_frequent, and constant value imputation for training data are now supported.
  + **azureml-contrib-pipeline-steps**
    + Accept string compute names to be passed to ParallelRunConfig
  + **azureml-core**
    +  Added Environment.clone(new_name) API to create a copy of Environment object
    +  Environment.docker.base_dockerfile accepts filepath. If able to resolve a file, the content is read into base_dockerfile environment property
    + Automatically reset mutually exclusive values for base_image and base_dockerfile when user manually sets a value in Environment.docker
    + Added user_managed flag in RSection that indicates whether the environment is managed by user or by Azure Machine Learning.
    + Dataset: Fixed dataset download failure if data path containing unicode characters.
    + Dataset: Improved dataset mount caching mechanism to respect the minimum disk space requirement in Azure Machine Learning Compute, which avoids making the node unusable and causing the job to be canceled.
    + Dataset: We add an index for the time series column when you access a time series dataset as a pandas dataframe, which is used to speed up access to time series-based data access.  Previously, the index was given the same name as the timestamp column, confusing users about which is the actual timestamp column and which is the index. We now don't give any specific name to the index since it should not be used as a column.
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
    + Added more telemetry around post-training operations.
    + Fixed the regression in early stopping
    + Deprecated azureml.dprep.Dataflow as a valid type for input data.
    +  Changing default AutoML experiment time-out to six days.
  + **azureml-train-automl-runtime**
    + Added more telemetry around post-training operations.
    + added sparse AutoML end to end support
  + **azureml-opendatasets**
    + Added another telemetry for service monitor.
    + Enable front door for blob to increase stability

## 2020-03-23

### Azure Machine Learning SDK for Python v1.2.0

+ **Breaking changes**
  + Drop support for Python 2.7

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
    + Last version to support Python 2.7

+ **Breaking changes**
  + **Semantic Versioning 2.0.0**
    + Starting with version 1.1 Azure Machine Learning Python SDK adopts [Semantic Versioning 2.0.0](https://semver.org/). All subsequent versions follow new numbering scheme and semantic versioning contract.

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
    + Deployed Azure Machine Learning Webservices now defaults to `INFO` logging. This can be controlled by setting the `AZUREML_LOG_LEVEL` environment variable in the deployed service.
    + Python sdk uses discovery service to use 'api' endpoint instead of 'pipelines'.
    + Swap to the new routes in all SDK calls.
    + Changed routing of calls to the ModelManagementService to a new unified structure.
      + Made workspace update method publicly available.
      + Added image_build_compute parameter in workspace update method to allow user updating the compute for image build.
    + Added deprecation messages to the old profiling workflow. Fixed profiling cpu and memory limits.
    + Added RSection as part of Environment to run R jobs.
    + Added validation to `Dataset.mount` to raise error when source of the dataset is not accessible or does not contain any data.
    + Added `--grant-workspace-msi-access` as another parameter for the Datastore CLI for registering Azure Blob Container that allows you to register Blob Container that is behind a VNet.
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
    + Updated azureml-tensorboard to support TensorFlow 2.0
    + Show correct port number when using a custom TensorBoard port on a Compute Instance
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
    + Deployed Azure Machine Learning Webservices now defaults to `INFO` logging. This can be controlled by setting the `AZUREML_LOG_LEVEL` environment variable in the deployed service.
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
    + Added `--grant-workspace-msi-access` as another parameter for the Datastore CLI for registering Azure Blob Container that allows you to register Blob Container that is behind a VNet
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
    + Updated azureml-tensorboard to support TensorFlow 2.0
  + **azureml-train-automl-client**
    + Fixed FeaturizationConfig overriding issue that filters custom featurization config.
  + **azureml-train-automl-runtime**
    + Moved the `AutoMLStep` in the `azureml-pipeline-steps` package. Deprecated the `AutoMLStep` within `azureml-train-automl-runtime`.
  + **azureml-train-core**
    + Supporting PyTorch version 1.4 in the PyTorch Estimator

## 2020-02-04

### Azure Machine Learning SDK for Python v1.1.0rc0 (Pre-release)

+ **Breaking changes**
  + **Semantic Versioning 2.0.0**
    + Starting with version 1.1 Azure Machine Learning Python SDK adopts [Semantic Versioning 2.0.0](https://semver.org/). All subsequent versions follow new numbering scheme and semantic versioning contract.

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
    + Dataset: usages for file dataset no longer depend on numpy and pandas to be installed in the Python env.
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
  + Workspace: Added the `hbi_workspace` flag for workspaces with sensitive data that enables further encryption and disables advanced diagnostics on workspaces. We also added support for bringing your own keys for the associated Azure Cosmos DB instance, by specifying the `cmk_keyvault` and `resource_cmk_uri` parameters when creating a workspace, which creates an Azure Cosmos DB instance in your subscription while provisioning your workspace. To learn more, see the [Azure Cosmos DB section of data encryption article](../concept-data-encryption.md#azure-cosmos-db).

+ **Bug fixes and improvements**
  + **azureml-automl-runtime**
    + Fixed a regression that caused a TypeError to be raised when running AutoML on Python versions below 3.5.4.
  + **azureml-core**
    + Fixed bug in `datastore.upload_files` were relative path that didn't start with `./` was not able to be used.
    + Added deprecation messages for all Image class code paths
    + Fixed Model Management URL construction for Microsoft Azure operated by 21Vianet.
    + Fixed issue where models using source_dir couldn't be packaged for Azure Functions.    
    + Added an option to [Environment.build_local()](/python/api/azureml-core/azureml.core.environment.environment) to push an image into Azure Machine Learning workspace container registry
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
    + Added CreatedBy information to Model and Service objects. May be accessed through.created_by
    + Fixed ContainerImage.run(), which was not correctly setting up the Docker container's HTTP port.
    + Make `azureml-dataprep` optional for `az ml dataset register` CLI command
    + Fixed a bug where `TabularDataset.to_pandas_dataframe` would incorrectly fall back to an alternate reader and print a warning.
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
    + AutoML now takes into account both true and false classes when calculating averaged scalar metrics for binary classification tasks.
    + Moved Machine learning and training code in AzureML-AutoML-Core to a new package AzureML-AutoML-Runtime.
  + **azureml-contrib-dataset**
    + When calling `to_pandas_dataframe` on a labeled dataset with the download option, you can now specify whether to overwrite existing files or not.
    + When calling `keep_columns` or `drop_columns` that results in a time series, label, or image column being dropped, the corresponding capabilities are dropped for the dataset as well.
    + Fixed an issue with pytorch loader for the object detection task.
  + **azureml-contrib-interpret**
    + Removed explanation dashboard widget from azureml-contrib-interpret, changed package to reference the new one in interpret_community
    + Updated version of interpret-community to 0.2.0
  + **azureml-core**
    + Improve performance of `workspace.datasets`.
    + Added the ability to register Azure SQL Database Datastore using username and password authentication
    + Fix for loading RunConfigurations from relative paths.
    + When calling `keep_columns` or `drop_columns` that results in a time series column being dropped, the corresponding capabilities are dropped for the dataset as well.
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
      + When calling `keep_columns` or `drop_columns` that results in a time series, label, or image column being dropped, the corresponding capabilities are dropped for the dataset as well.
      + Fixed issues with PyTorch loader when calling `dataset.to_torchvision()`.

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + Added Model Profiling to the preview CLI.
    + Fixes breaking change in Azure Storage causing Azure Machine Learning CLI to fail.
    + Added Load Balancer Type to MLC for AKS types
  + **azureml-automl-core**
    + Fixed the issue with detection of maximal horizon on time series, having missing values and multiple grains.
    + Fixed the issue with failures during generation of cross validation splits.
    + Replace this section with a message in markdown format to appear in the release notes: -Improved handling of short grains in the forecasting data sets.
    + Fixed the issue with masking of some user information during logging. -Improved logging of the errors during forecasting runs.
    + Adding psutil as a conda dependency to the autogenerated yml deployment file.
  + **azureml-contrib-mir**
    + Fixes breaking change in Azure Storage causing Azure Machine Learning CLI to fail.
  + **azureml-core**
    + Fixes a bug that caused models deployed on Azure Functions to produce 500 s.
    + Fixed an issue where the amlignore file was not applied on snapshots.
    + Added a new API amlcompute.get_active_runs that returns a generator for running and queued runs on a given amlcompute.
    + Added Load Balancer Type to MLC for AKS types.
    + Added append_prefix bool parameter to download_files in run.py and download_artifacts_from_prefix in artifacts_client. This flag is used to selectively flatten the origin filepath so only the file or folder name is added to the output_directory
    + Fix deserialization issue for `run_config.yml` with dataset usage.
    + When calling `keep_columns` or `drop_columns` that results in a time series column being dropped, the corresponding capabilities are dropped for the dataset as well.
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

The collaborative workspace landing page at [https://ml.azure.com](https://ml.azure.com) has been enhanced and rebranded as the Azure Machine Learning studio.

From the studio, you can train, test, deploy, and manage Azure Machine Learning assets such as datasets, pipelines, models, endpoints, and more.

Access the following web-based authoring tools from the studio:

| Web-based tool | Description |
|-|-|-|
| Notebook VM(preview) | Fully managed cloud-based workstation |
| [Automated machine learning](../tutorial-first-experiment-automated-ml.md) (preview) | No code experience for automating machine learning model development |
| [Designer](concept-designer.md) | Drag-and-drop machine learning modeling tool formerly known as the visual interface |


### Azure Machine Learning designer enhancements

+ Formerly known as the visual interface
+    11 new [modules](../component-reference/component-reference.md) including recommenders, classifiers, and training utilities including feature engineering, cross validation, and data transformation.

### R SDK

Data scientists and AI developers use the [Azure Machine Learning SDK for R](https://github.com/Azure/azureml-sdk-for-r) to build and run machine learning workflows with Azure Machine Learning.

The Azure Machine Learning SDK for R uses the `reticulate` package to bind to the Python SDK. By binding directly to Python, the SDK for R allows you access to core objects and methods implemented in the Python SDK from any R environment you choose.

Main capabilities of the SDK include:

+    Manage cloud resources for monitoring, logging, and organizing your machine learning experiments.
+    Train models using cloud resources, including GPU-accelerated model training.
+    Deploy your models as webservices on Azure Container Instances (ACI) and Azure Kubernetes Service (AKS).

See the [package website](https://azure.github.io/azureml-sdk-for-r) for complete documentation.

### Azure Machine Learning integration with Event Grid

Azure Machine Learning is now a resource provider for Event Grid, you can configure machine learning events through the Azure portal or Azure CLI. Users can create events for run completion, model registration, model deployment, and data drift detected. These events can be routed to event handlers supported by Event Grid for consumption. See machine learning event [schema](../../event-grid/event-schema-machine-learning.md) and [tutorial](../how-to-use-event-grid.md) articles for more details.

## 2019-10-31

### Azure Machine Learning SDK for Python v1.0.72

+ **New features**
  + Added dataset monitors through the [**azureml-datadrift**](/python/api/azureml-datadrift) package, allowing for monitoring time series datasets for data drift or other statistical changes over time. Alerts and events can be triggered if drift is detected or other conditions on the data are met. See [our documentation](how-to-monitor-datasets.md) for details.
  + Announcing two new editions (also referred to as a SKU interchangeably) in Azure Machine Learning. With this release, you can now create either a Basic or Enterprise Azure Machine Learning workspace. All existing workspaces are defaulted to the Basic edition, and you can go to the Azure portal or to the studio to upgrade the workspace anytime. You can create either a Basic or Enterprise workspace from the Azure portal. Read [our documentation](./how-to-manage-workspace.md) to learn more. From the SDK, the edition of your workspace can be determined using the "sku" property of your workspace object.
  + We have also made enhancements to Azure Machine Learning Compute - you can now view metrics for your clusters (like total nodes, running nodes, total core quota) in Azure Monitor, besides viewing Diagnostic logs for debugging. In addition, you can also view currently running or queued runs on your cluster and details such as the IPs of the various nodes on your cluster. You can view these either in the portal or by using corresponding functions in the SDK or CLI.

  + **Preview features**
    + We are releasing preview support for disk encryption of your local SSD in Azure Machine Learning Compute. Raise a technical support ticket to get your subscription allow listed to use this feature.
    + Public Preview of Azure Machine Learning Batch Inference. Azure Machine Learning Batch Inference targets large inference jobs that are not time-sensitive. Batch Inference provides cost-effective inference compute scaling, with unparalleled throughput for asynchronous applications. It is optimized for high-throughput, fire-and-forget inference over large collections of data.
    + [**azureml-contrib-dataset**](/python/api/azureml-contrib-dataset)
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
    + Models can be registered with two new frameworks, Onnx and TensorFlow. - Model registration accepts sample input data, sample output data and resource configuration for the model.
  + **azureml-automl-core**
    + Training an iteration would run in a child process only when runtime constraints are being set.
    + Added a guardrail for forecasting tasks, to check whether a specified max_horizon causes a memory issue on the given machine or not. If it will, a guardrail message is displayed.
    + Added support for complex frequencies like two years and one month. -Added comprehensible error message if frequency cannot be determined.
    + Add azureml-defaults to auto generated conda env to solve the model deployment failure
    + Allow intermediate data in Azure Machine Learning Pipeline to be converted to tabular dataset and used in `AutoMLStep`.
    + Implemented column purpose update for streaming.
    + Implemented transformer parameter update for Imputer and HashOneHotEncoder for streaming.
    + Added the current data size and the minimum required data size to the validation error messages.
    + Updated the minimum required data size for Cross-validation to guarantee a minimum of two samples in each validation fold.
  + **azureml-cli-common**
    + CLI now supports model packaging.
    + Models can be registered with two new frameworks, Onnx and TensorFlow.
    + Model registration accepts sample input data, sample output data and resource configuration for the model.
  + **azureml-contrib-gbdt**
    + fixed the release channel for the notebook
    + Added a warning for non-AmlCompute compute target that we don't support
    + Added LightGMB Estimator to azureml-contrib-gbdt package
  + [**azureml-core**](/python/api/azureml-core)
    + CLI now supports model packaging.
    + Add deprecation warning for deprecated Dataset APIs. See Dataset API change notice at https://aka.ms/tabular-dataset.
    + Change [`Dataset.get_by_id`](/python/api/azureml-core/azureml.core.dataset%28class%29#get-by-id-workspace--id-) to return registration name and version if the dataset is registered.
    + Fix a bug that ScriptRunConfig with dataset as argument cannot be used repeatedly to submit experiment run.
    + Datasets retrieved during a run will be tracked and can be seen in the run details page or by calling [`run.get_details()`](/python/api/azureml-core/azureml.core.run%28class%29#get-details--) after the run is complete.
    + Allow intermediate data in Azure Machine Learning Pipeline to be converted to tabular dataset and used in [`AutoMLStep`](/python/api/azureml-train-automl-runtime/azureml.train.automl.runtime.automlstep).
    + Added support for deploying and packaging supported models (ONNX, scikit-learn, and TensorFlow) without an InferenceConfig instance.
    + Added overwrite flag for service deployment (ACI and AKS) in SDK and CLI. If provided, will overwrite the existing service if service with name already exists. If service doesn't exist, will create new service.
    +  Models can be registered with two new frameworks, Onnx and TensorFlow. Model registration accepts sample input data, sample output data and resource configuration for the model.
    + Added new datastore for Azure Database for MySQL. Added example for using Azure Database for MySQL in DataTransferStep in Azure Machine Learning Pipelines.
    + Added functionality to add and remove tags from experiments Added functionality to remove tags from runs
    + Added overwrite flag for service deployment (ACI and AKS) in SDK and CLI. If provided, will overwrite the existing service if service with name already exists. If service doesn't exist, will create new service.
  + [**azureml-datadrift**](/python/api/azureml-datadrift)
    + Moved from `azureml-contrib-datadrift` into `azureml-datadrift`
    + Added support for monitoring time series datasets for drift and other statistical measures
    + New methods `create_from_model()` and `create_from_dataset()` to the [`DataDriftDetector`](/python/api/azureml-datadrift/azureml.datadrift.datadriftdetector%28class%29) class. The `create()` method is deprecated.
    + Adjustments to the visualizations in Python and UI in the Azure Machine Learning studio.
    + Support weekly and monthly monitor scheduling, in addition to daily for dataset monitors.
    + Support backfill of data monitor metrics to analyze historical data for dataset monitors.
    + Various bug fixes
  + [**azureml-pipeline-core**](/python/api/azureml-pipeline-core)
    + azureml-dataprep is no longer needed to submit an Azure Machine Learning Pipeline run from the pipeline `yaml` file.
  + [**azureml-train-automl**](/python/api/azureml-train-automl-runtime/)
    + Add azureml-defaults to auto generated conda env to solve the model deployment failure
    + AutoML remote training now includes azureml-defaults to allow reuse of training env for inference.
  + **azureml-train-core**
    + Added PyTorch 1.3 support in [`PyTorch`](/python/api/azureml-train-core/azureml.train.dnn.pytorch) estimator

## 2019-10-21

### Visual interface (preview)

+ The Azure Machine Learning visual interface (preview) has been overhauled to run on [Azure Machine Learning pipelines](../concept-ml-pipelines.md). Pipelines (previously known as experiments) authored in the visual interface are now fully integrated with the core Azure Machine Learning experience.
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
      + Added print for the heuristically determined parameters in the forecasting runs.
  + **azureml-contrib-datadrift**
    + Added protection while creating output metrics if dataset level drift is not in the first section.
  + **azureml-contrib-interpret**
    + azureml-contrib-explain-model package has been renamed to azureml-contrib-interpret
  + **azureml-core**
    + Added API to unregister datasets. `dataset.unregister_all_versions()`
    + azureml-contrib-explain-model package has been renamed to azureml-contrib-interpret.
  + **[azureml-core](/python/api/azureml-core)**
    + Added API to unregister datasets. dataset.[unregister_all_versions()](/python/api/azureml-core/azureml.data.abstract_datastore.abstractdatastore#unregister--).
    + Added Dataset API to check data changed time. `dataset.data_changed_time`.
    + Being able to consume `FileDataset` and `TabularDataset` as inputs to `PythonScriptStep`, `EstimatorStep`, and `HyperDriveStep` in Azure Machine Learning Pipeline
    + Performance of `FileDataset.mount` has been improved for folders with a large number of files
    + Being able to consume [FileDataset](/python/api/azureml-core/azureml.data.filedataset) and [TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset) as inputs to [PythonScriptStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep), [EstimatorStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.estimatorstep), and [HyperDriveStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.hyperdrivestep) in the Azure Machine Learning Pipeline.
    + Performance of FileDataset.[mount()](/python/api/azureml-core/azureml.data.filedataset#mount-mount-point-none----kwargs-) has been improved for folders with a large number of files
    + Added URL to known error recommendations in run details.
    + Fixed a bug in run.get_metrics where requests would fail if a run had too many children
    + Fixed a bug in [run.get_metrics](/python/api/azureml-core/azureml.core.run.run#get-metrics-name-none--recursive-false--run-type-none--populate-false-) where requests would fail if a run had too many children
    + Added support for authentication on Arcadia cluster.
    + Creating an Experiment object gets or creates the experiment in the Azure Machine Learning workspace for run history tracking. The experiment ID and archived time are populated in the Experiment object on creation. Example: experiment = Experiment(workspace, "New Experiment") experiment_id = experiment.id archive() and reactivate() are functions that can be called on an experiment to hide and restore the experiment from being shown in the UX or returned by default in a call to list experiments. If a new experiment is created with the same name as an archived experiment, you can rename the archived experiment when reactivating by passing a new name. There can only be one active experiment with a given name. Example: experiment1 = Experiment(workspace, "Active Experiment") experiment1.archive() # Create new active experiment with the same name as the archived. experiment2. = Experiment(workspace, "Active Experiment") experiment1.reactivate(new_name="Previous Active Experiment") The static method list() on Experiment can take a name filter and ViewType filter. ViewType values are "ACTIVE_ONLY", "ARCHIVED_ONLY" and "ALL" Example: archived_experiments = Experiment.list( workspace, view_type="ARCHIVED_ONLY") all_first_experiments = Experiment.list(workspace, name="First Experiment", view_type="ALL")
    + Support using environment for model deployment, and service update
  + **azureml-datadrift**
    + The show attribute of DataDriftDector class don't support optional argument 'with_details' anymore. The show attribute only presents data drift coefficient and data drift contribution of feature columns.
    + DataDriftDetector attribute 'get_output' behavior changes:
      + Input parameter start_time, end_time are optional instead of mandatory;
      + Input specific start_time and/or end_time with a specific run_id in the same invoking results in value error exception because they are mutually exclusive
      + By input specific start_time and/or end_time, only results of scheduled runs are returned;
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
    + Creating an [Experiment](/python/api/azureml-core/azureml.core.experiment.experiment) object gets or creates the experiment in the Azure Machine Learning workspace for run history tracking. The experiment ID and archived time are populated in the Experiment object on creation. Example:

        ```python
        experiment = Experiment(workspace, "New Experiment")
        experiment_id = experiment.id
        ```
        [archive()](/python/api/azureml-core/azureml.core.experiment.experiment#archive--) and [reactivate()](/python/api/azureml-core/azureml.core.experiment.experiment#reactivate-new-name-none-) are functions that can be called on an experiment to hide and restore the experiment from being shown in the UX or returned by default in a call to list experiments. If a new experiment is created with the same name as an archived experiment, you can rename the archived experiment when reactivating by passing a new name. There can only be one active experiment with a given name. Example:

        ```python
        experiment1 = Experiment(workspace, "Active Experiment")
        experiment1.archive()
        # Create new active experiment with the same name as the archived.
        experiment2 = Experiment(workspace, "Active Experiment")
        experiment1.reactivate(new_name="Previous Active Experiment")
        ```
        The static method [list()](/python/api/azureml-core/azureml.core.experiment.experiment#list-workspace--experiment-name-none--view-type--activeonly---tags-none-) on Experiment can take a name filter and ViewType filter. ViewType values are "ACTIVE_ONLY", "ARCHIVED_ONLY" and "ALL". Example:

        ```python
        archived_experiments = Experiment.list(workspace, view_type="ARCHIVED_ONLY")
        all_first_experiments = Experiment.list(workspace, name="First Experiment", view_type="ALL")
        ```
    + Support using environment for model deployment, and service update.
  + **[azureml-datadrift](/python/api/azureml-datadrift)**
    + The show attribute of [DataDriftDetector](/python/api/azureml-datadrift/azureml.datadrift.datadriftdetector.datadriftdetector) class don't support optional argument 'with_details' anymore. The show attribute only presents data drift coefficient and data drift contribution of feature columns.
    + DataDriftDetector function [get_output]python/api/azureml-datadrift/azureml.datadrift.datadriftdetector.datadriftdetector#get-output-start-time-none--end-time-none--run-id-none-) behavior changes:
      + Input parameter start_time, end_time are optional instead of mandatory;
      + Input specific start_time and/or end_time with a specific run_id in the same invoking results in value error exception because they are mutually exclusive;
      + By input specific start_time and/or end_time, only results of scheduled runs are returned;
      + Parameter 'daily_latest_only' is deprecated.
    + Support retrieving Dataset-based Data Drift outputs.
  + **azureml-explain-model**
    + Add support for [ScoringExplainer](/python/api/azureml-interpret/azureml.interpret.scoring.scoring_explainer.scoringexplainer) to be created directly using MimicWrapper
  + **[azureml-pipeline-core](/python/api/azureml-pipeline-core)**
    + Improved performance for large Pipeline creation.
  + **[azureml-train-core](/python/api/azureml-train-core)**
    + Added TensorFlow 2.0 support in [TensorFlow](/python/api/azureml-train-core/azureml.train.dnn.tensorflow) Estimator.
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
    + Added curated environments. These environments have been preconfigured with libraries for common machine learning tasks, and have been prebuild and cached as Docker images for faster execution. They appear by default in Workspace's list of environment, with prefix "AzureML".
    + Added curated environments. These environments have been preconfigured with libraries for common machine learning tasks, and have been prebuild and cached as Docker images for faster execution. They appear by default in [Workspace](/python/api/azureml-core/azureml.core.workspace%28class%29)'s list of environment, with prefix "AzureML".

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
    + Added support for automatic detection of target lags, rolling window size, and maximal horizon. If one of target_lags, target_rolling_window_size or max_horizon is set to 'auto', the heuristics is applied to estimate the value of corresponding parameter based on training data.
    + Fixed forecasting in the case when data set contains one grain column, this grain is of a numeric type and there is a gap between train and test set
    + Fixed the error message about the duplicated index in the remote run in forecasting tasks
    + Fixed forecasting in the case when data set contains one grain column, this grain is of a numeric type and there is a gap between train and test set.
    + Fixed the error message about the duplicated index in the remote run in forecasting tasks.
    + Added a guardrail to check whether a dataset is imbalanced or not. If it is, a guardrail message would be written to the console.
  + **azureml-core**
    + Added ability to retrieve SAS URL to model in storage through the model object. Ex: model.get_sas_url()
    + Introduce `run.get_details()['datasets']` to get datasets associated with the submitted run
    + Add API `Dataset.Tabular.from_json_lines_files` to create a TabularDataset from JSON Lines files. To learn about this tabular data in JSON Lines files on TabularDataset, visit [this article](how-to-create-register-datasets.md) for documentation.
    + Added other VM size fields (OS Disk, number of GPUs) to the supported_vmsizes () function
    + Added more fields to the list_nodes () function to show the run, the private and the public IP, the port etc.
    + Ability to specify a new field during cluster provisioning --remotelogin_port_public_access, which can be set to enabled or disabled depending on whether you would like to leave the SSH port open or closed at the time of creating the cluster. If you do not specify it, the service will smartly open or close the port depending on whether you are deploying the cluster inside a VNet.
  + **azureml-explain-model**
  + **[azureml-core](/python/api/azureml-core/azureml.core)**
    + Added ability to retrieve SAS URL to model in storage through the model object. Ex: model.[get_sas_url()](/python/api/azureml-core/azureml.core.model.model#get-sas-urls--)
    + Introduce run.[get_details](/python/api/azureml-core/azureml.core.run%28class%29#get-details--)['datasets'] to get datasets associated with the submitted run
    + Add API `Dataset.Tabular`.[from_json_lines_files()](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-json-lines-files-path--validate-true--include-path-false--set-column-types-none--partition-format-none-) to create a TabularDataset from JSON Lines files. To learn about this tabular data in JSON Lines files on TabularDataset, visithttps://aka.ms/azureml-data for documentation.
    + Added other VM size fields (OS Disk, number of GPUs) to the [supported_vmsizes()](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#supported-vmsizes-workspace--location-none-) function
    + Added other fields to the [list_nodes()](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#list-nodes--) function to show the run, the private, and the public IP, the port etc.
    + Ability to specify a new field during cluster [provisioning](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#provisioning-configuration-vm-size-----vm-priority--dedicated---min-nodes-0--max-nodes-none--idle-seconds-before-scaledown-none--admin-username-none--admin-user-password-none--admin-user-ssh-key-none--vnet-resourcegroup-name-none--vnet-name-none--subnet-name-none--tags-none--description-none--remote-login-port-public-access--notspecified--)  that can be set to enabled or disabled depending on whether you would like to leave the SSH port open or closed at the time of creating the cluster. If you do not specify it, the service smartly opens or closes the port depending on whether you are deploying the cluster inside a VNet.
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
  + **[azureml-pipeline-core](/python/api/azureml-pipeline-core)**
    + Added a [notebook](https://aka.ms/pl-modulestep) to describe [Module](/python/api/azureml-pipeline-core/azureml.pipeline.core.module%28class%29), [ModuleVersion, and [ModuleStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.modulestep).
  + **[azureml-pipeline-steps](/python/api/azureml-pipeline-steps)**
    + Added [RScriptStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.rscriptstep) to support R script run via AML pipeline.
    + Fixed metadata parameters parsing in [AzureBatchStep that was causing the error message "assignment for parameter SubscriptionId is not specified".
  + **[azureml-train-automl](/python/api/azureml-train-automl-runtime/)**
    + Supported training_data, validation_data, label_column_name, weight_column_name as data input format.
    + Added deprecation message for explain_model() and retrieve_model_explanations().


## 2019-09-16

### Azure Machine Learning SDK for Python v1.0.62

+ **New features**
  + Introduced the `timeseries`  trait on TabularDataset. This trait enables easy timestamp filtering on data a TabularDataset, such as taking all data between a range of time or the most recent data.  https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/timeseries-datasets/tabular-timeseries-dataset-filtering.ipynb for an example notebook.
  + Enabled training with TabularDataset and FileDataset.

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
    + Fixed the bug where `DataReference` name changes when the `DataReference` mode changes (for example, when calling `as_upload`, `as_download`, or `as_mount`).
    + Make `mount_point` and `target_path` optional for `FileDataset.mount` and `FileDataset.download`.
    + Exception that timestamp column cannot be found is thrown out if the time serials-related API is called without fine timestamp column assigned or the assigned timestamp columns are dropped.
    + Time serials columns should be assigned with column whose type is Date, otherwise exception is expected
    + Time serials columns assigning API 'with_timestamp_columns' can take None value fine/coarse timestamp column name, which clears previously assigned timestamp columns.
    + Exception will be thrown out when either coarse grain or fine grained timestamp column is dropped with indication for user that dropping can be done after either excluding timestamp column in dropping list or call with_time_stamp with None value to release timestamp columns
    + Exception will be thrown out when either coarse grain or fine grained timestamp column is not included in keep columns list with indication for user that keeping can be done after either including timestamp column in keep column list or call with_time_stamp with None value to release timestamp columns.
    + Added logging for the size of a registered model.
  + **azureml-explain-model**
    + Fixed warning printed to console when "packaging" Python package is not installed: "Using older than supported version of lightgbm, please upgrade to version greater than 2.2.1"
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

         ```python
        from azureml.train.dnn import TensorFlow, Mpi, ParameterServer
        ```

## 2019-09-09

### New web experience (preview) for Azure Machine Learning workspaces
The new web experience enables data scientists and data engineers to complete their end-to-end machine learning lifecycle from prepping and visualizing data to training and deploying models in a single location.

![Azure Machine Learning workspace UI (preview)](../media/azure-machine-learning-release-notes/new-ui-for-workspaces.jpg)

**Key features:**

Using this new Azure Machine Learning interface, you can now:
+ Manage your notebooks or link out to Jupyter
+ [Run automated ML experiments](../tutorial-first-experiment-automated-ml.md)
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
  + Introduced FileDataset, which references single or multiple files in your datastores or public urls. The files can be of any format. FileDataset provides you with the ability to download or mount the files to your compute.
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

    ```python
    workspace = Workspace.from_config()
    all_datasets = Dataset.get_all(workspace)
    mydata = all_datasets['my-data']
    ```

    + Introduce `parition_format` as argument to `Dataset.Tabular.from_delimited_files` and `Dataset.Tabular.from_parquet.files`. The partition information of each data path is extracted into columns based on the specified format. '{column_name}' creates string column, and '{column_name:yyyy/MM/dd/HH/mm/ss}' creates datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' are used to extract year, month, day, hour, minute, and second for the datetime type. The partition_format should start from the position of first partition key until the end of file path. For example, given the path '../USA/2019/01/01/data.csv' where the partition is by country/region and time, partition_format='/{Country}/{PartitionDate:yyyy/MM/dd}/data.csv' creates string column 'Country' with value 'USA' and datetime column 'PartitionDate' with value '2019-01-01'.
        ```python
        workspace = Workspace.from_config()
        all_datasets = Dataset.get_all(workspace)
        mydata = all_datasets['my-data']
        ```

    + Introduce `partition_format` as argument to `Dataset.Tabular.from_delimited_files` and `Dataset.Tabular.from_parquet.files`. The partition information of each data path is extracted into columns based on the specified format. '{column_name}' creates string column, and '{column_name:yyyy/MM/dd/HH/mm/ss}' creates datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' are used to extract year, month, day, hour, minute, and second for the datetime type. The partition_format should start from the position of first partition key until the end of file path. For example, given the path '../USA/2019/01/01/data.csv' where the partition is by country/region and time, partition_format='/{Country}/{PartitionDate:yyyy/MM/dd}/data.csv' creates string column 'Country' with value 'USA' and datetime column 'PartitionDate' with value '2019-01-01'.
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
    + Created feature to install specific versions of gpu-capable pytorch v1.1.0, :::no-loc text="cuda"::: toolkit 9.0, pytorch-transformers, which is required to enable BERT/ XLNet in the remote Python runtime environment.
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
  + Enabled `TabularDataset` to be consumed by AutomatedML. To learn more about `TabularDataset`, visithttps://aka.ms/azureml/howto/createdatasets.

+ **Bug fixes and improvements**
  + **azure-cli-ml**
    + You can now update the TLS/SSL certificate for the scoring endpoint deployed on AKS cluster both for Microsoft generated and customer certificate.
  + **azureml-automl-core**
    + Fixed an issue in AutoML where rows with missing labels were not removed properly.
    + Improved error logging in AutoML; full error messages will now always be written to the log file.
    + AutoML has updated its package pinning to include `azureml-defaults`, `azureml-explain-model`, and `azureml-dataprep`. AutoML no longer warns on package mismatches (except for `azureml-train-automl` package).
    + Fixed an issue in `timeseries`  where cv splits are of unequal size causing bin calculation to fail.
    + When running ensemble iteration for the Cross-Validation training type, if we ended up having trouble downloading the models trained on the entire dataset, we were having an inconsistency between the model weights and the models that were being fed into the voting ensemble.
    + Fixed the error, raised when training and/or validation labels (y and y_valid) are provided in the form of pandas dataframe but not as numpy array.
    + Fixed the issue with the forecasting tasks when None was encountered in the Boolean columns of input tables.
    + Allow AutoML users to drop training series that's not long enough when forecasting. - Allow AutoML users to drop grains from the test set that does not exist in the training set when forecasting.
  + **azureml-core**
    + Fixed issue with blob_cache_timeout parameter ordering.
    + Added external fit and transform exception types to system errors.
    + Added support for Key Vault secrets for remote runs. Add an `azureml.core.keyvault.Keyvault` class to add, get, and list secrets from the key vault associated with your workspace. Supported operations are:
      + azureml.core.workspace.Workspace.get_default_keyvault()
      + azureml.core.keyvault.Keyvault.set_secret(name, value)
      + azureml.core.keyvault.Keyvault.set_secrets(secrets_dict)
      + azureml.core.keyvault.Keyvault.get_secret(name)
      + azureml.core.keyvault.Keyvault.get_secrets(secrets_list)
      + azureml.core.keyvault.Keyvault.list_secrets()
      + More methods to obtain default keyvault and get secrets during remote run:
      + azureml.core.workspace.Workspace.get_default_keyvault()
      + azureml.core.run.Run.get_secret(name)
      + azureml.core.run.Run.get_secrets(secrets_list)
    + Added other override parameters to submit-hyperdrive CLI command.
    + Improve reliability of API calls be expanding retries to common requests library exceptions.
    + Add support for submitting runs from a submitted run.
    + Fixed expiring SAS token issue in FileWatcher, which caused files to stop being uploaded after their initial token had expired.
    + Supported importing HTTP csv/tsv files in dataset Python SDK.
    + Deprecated the Workspace.setup() method. Warning message shown to users suggests using create() or get()/from_config() instead.
    + Added Environment.add_private_pip_wheel(), which enables uploading private custom Python packages `whl`to the workspace and securely using them to build/materialize the environment.
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
    + Allow AutoML users to drop grains from the test set that does not exist in the training set when forecasting.
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
  + The performance of `read_parquet` has been improved when running in Spark.
  + Fixed an issue where `column_type_builder` failed in a single column with ambiguous date formats.

### Azure portal
+ **Preview Feature**
  + Log and output file streaming is now available for run details pages. The files stream updates in real time when the preview toggle is turned on.
  + Ability to set quota at a workspace level is released in preview. AmlCompute quotas are allocated at the subscription level, but we now allow you to distribute that quota between workspaces and allocate it for fair sharing and governance. Just click on the **Usages+Quotas** blade in the left navigation bar of your workspace and select the **Configure Quotas** tab. You must be a subscription admin to be able to set quotas at the workspace level since this is a cross-workspace operation.

## 2019-08-05

### Azure Machine Learning SDK for Python v1.0.55

+ **New features**
  + Token-based authentication is now supported for the calls made to the scoring endpoint deployed on AKS. We continue to support the current key based authentication and users can use one of these authentication mechanisms at a time.
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
    + Widget changes: Automatically installs with `contrib`, no more `nbextension` install/enable - support explanation with global feature importance (for example, Permutative)
    + Dashboard changes: - Box plots and violin plots in addition to `beeswarm` plot on summary page - Faster rerendering of `beeswarm` plot on 'Top -k' slider change - helpful message explaining how top-k is computed - Useful customizable messages in place of charts when data not provided
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
  + You can now request to execute specific inspectors (for example, histogram, scatter plot, etc.) on specific columns.
  + Added a parallelize argument to `append_columns`. If True, data is loaded into memory but execution runs in parallel; if False, execution is streaming but single-threaded.

## 2019-07-23

### Azure Machine Learning SDK for Python v1.0.53

+ **New features**
  + Automated Machine Learning now supports training ONNX models on the remote compute target
  + Azure Machine Learning now provides ability to resume training from a previous run, checkpoint, or model files.
    + Learn how to [use estimators to resume training from a previous run](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/tensorflow/train-tensorflow-resume-training/train-tensorflow-resume-training.ipynb)

+ **Bug fixes and improvements**
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
    + In forecasting tasks, the `target_lags` parameter now accepts a single integer value or a list of integers. If the integer was provided, only one lag is created. If a list is provided, the unique values of lags is taken. target_lags=[1, 2, 2, 4] creates lags of one, two and four periods.
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
    + Added the ability to attach DBFS datastores in the Azure Machine Learning CLI
    + Fixed the bug with datastore upload where an empty folder is created if `target_path` started with `/`
    + Fixed `deepcopy` issue in ServicePrincipalAuthentication.
    + Added the "az ml environment show" and "az ml environment list" commands to the CLI.
    + Environments now support specifying a base_dockerfile as an alternative to an already-built base_image.
    + The unused RunConfiguration setting auto_prepare_environment has been marked as deprecated.
    + Model description can now be updated after registration
    + Bugfix: Model and Image delete now provides more information about retrieving upstream objects that depend on them if delete fails due to an upstream dependency.
    + Fixed bug that printed blank duration for deployments that occur when creating a workspace for some environments.
    + Improved failure exceptions for workspace creation. Such that users don't see "Unable to create workspace. Unable to find..." as the message and instead see the actual creation failure.
    + Add support for token authentication in AKS webservices.
    + Add `get_token()` method to `Webservice` objects.
    + Added CLI support to manage machine learning datasets.
    + `Datastore.register_azure_blob_container` now optionally takes a `blob_cache_timeout` value (in seconds) which configures blobfuse's mount parameters to enable cache expiration for this datastore. The default is no timeout, such as when a blob is read, it stays in the local cache until the job is finished. Most jobs  prefer this setting, but some jobs need to read more data from a large dataset than will fit on their nodes. For these jobs, tuning this parameter helps them succeed. Take care when tuning this parameter: setting the value too low can result in poor performance, as the data used in an epoch may expire before being used again. All reads are done from blob storage/network rather than the local cache, which negatively impacts training times.
    + Model description can now properly be updated after registration
    + Model and Image deletion now provides more information about upstream objects that depend on them, which causes the delete to fail
    + Improve resource utilization of remote runs using azureml.mlflow.
  + **azureml-explain-model**
    + Fixed transformations argument for LIME explainer for raw feature importance in azureml-contrib-explain-model package
    + add scipy sparse support for LimeExplainer
    + added shape linear explainer wrapper, and another level to tabular explainer for explaining linear models
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
    + Patch bug where mlflow.log_artifacts("my_dir") would save artifacts under `my_dir/<artifact-paths>` instead of `<artifact-paths>`
  + **azureml-opendatasets**
    + Pin `pyarrow` of `opendatasets` to old versions (<0.14.0) because of memory issue newly introduced there.
    + Move azureml-contrib-opendatasets to azureml-opendatasets.
    + Allow open dataset classes to be registered to Azure Machine Learning workspace and use AML Dataset capabilities seamlessly.
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-pipeline-steps**
    + DBFS Datastore is now supported for Inputs and Outputs in DatabricksStep.
    + Updated documentation for Azure Batch Step regarding inputs/outputs.
    + In AzureBatchStep, changed *delete_batch_job_after_finish* default value to *true*.
  + **azureml-telemetry**
    +  Move azureml-contrib-opendatasets to azureml-opendatasets.
    + Allow open dataset classes to be registered to Azure Machine Learning workspace and use AML Dataset capabilities seamlessly.
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-train-automl**
    + Updated documentation on get_output to reflect the actual return type and provide other notes on retrieving key properties.
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
    + This new package allows you to register open datasets as Dataset in Azure Machine Learning workspace, and use whatever functionalities that Dataset offers.
    + It also includes existing capabilities such as consuming open datasets as Pandas/SPARK dataframes, and location joins for some dataset like weather.

+ **Preview features**
    + HyperDriveConfig can now accept pipeline object as a parameter to support hyperparameter tuning using a pipeline.

+ **Bug fixes and improvements**
  + **azureml-train-automl**
    + Fixed the bug about losing columns types after the transformation.
    + Fixed the bug to allow y_query to be an object type containing None(s) at the beginning.
    + Fixed the issue in the Ensemble selection procedure that was unnecessarily growing the resulting ensemble even if the scores remained constant.
    + Fixed the issue with allow list_models and block list_models settings in AutoMLStep.
    + Fixed the issue that prevented the usage of preprocessing when AutoML would have been used in the context of Azure Machine Learning Pipelines.
  + **azureml-opendatasets**
    + Moved azureml-contrib-opendatasets to azureml-opendatasets.
    + Allowed open dataset classes to be registered to Azure Machine Learning workspace and use AML Dataset capabilities seamlessly.
    + Improved NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-explain-model**
    + Updated online documentation for interpretability objects.
    + Added `batch_size` to mimic explainer when `include_local=False`, for streaming global explanations in batches to improve execution time of DecisionTreeExplainableModel for model explainability library.
    + Fixed the issue where `explanation.expected_values` would sometimes return a float rather than a list with a float in it.
    + Added expected values to `automl` output for mimic explainer in explain model library.
    + Fixed permutation feature importance when transformations argument supplied to get raw feature importance.
  + **azureml-core**
    + Added the ability to attach DBFS datastores in the Azure Machine Learning CLI.
    + Fixed the issue with datastore upload where an empty folder is created if `target_path` started with `/`.
    + Enabled comparison of two datasets.
    + Model and Image delete now provides more information about retrieving upstream objects that depend on them if delete fails due to an upstream dependency.
    + Deprecated the unused RunConfiguration setting in auto_prepare_environment.
  + **azureml-mlflow**
    + Improved resource utilization of remote runs that use azureml.mlflow.
    + Improved the documentation of the azureml-mlflow package.
    + Fixed the issue where mlflow.log_artifacts("my_dir") would save artifacts under "my_dir/artifact-paths" instead of "artifact-paths".
  + **azureml-pipeline-core**
    + Parameter hash_paths for all pipeline steps is deprecated and will be removed in future. By default contents of the source_directory is hashed (except files listed in `.amlignore` or `.gitignore`)
    + Continued improving Module and ModuleStep to support compute type-specific modules, to prepare for RunConfiguration integration and other changes to unlock compute type-specific module usage in pipelines.
  + **azureml-pipeline-steps**
    + AzureBatchStep: Improved documentation about inputs/outputs.
    + AzureBatchStep: Changed delete_batch_job_after_finish default value to true.
  + **azureml-train-core**
    + Strings are now accepted as compute target for Automated Hyperparameter Tuning.
    + Deprecated the unused RunConfiguration setting in auto_prepare_environment.
    + Deprecated parameters `conda_dependencies_file_path` and `pip_requirements_file_path` in favor of `conda_dependencies_file` and `pip_requirements_file` respectively.
  + **azureml-opendatasets**
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.

## 2019-04-26

### Azure Machine Learning SDK for Python v1.0.33 released.

+ Azure Machine Learning Hardware Accelerated Models on [FPGAs](how-to-deploy-fpga-web-service.md) is generally available.
  + You can now [use the azureml-accel-models package](how-to-deploy-fpga-web-service.md) to:
    + Train the weights of a supported deep neural network (ResNet 50, ResNet 152, DenseNet-121, VGG-16, and SSD-VGG)
    + Use transfer learning with the supported DNN
    + Register the model with Model Management Service and containerize the model
    + Deploy the model to an Azure VM with an FPGA in an Azure Kubernetes Service (AKS) cluster
  + Deploy the container to an [Azure Stack Edge](../../databox-online/azure-stack-edge-overview.md) server device
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
  + New Holiday detection and featurizer when country/region code is defined in experiment settings

+ Azure Databricks
  + Enabled time series forecasting and model explainabilty/interpretability capability
  + You can now cancel and resume (continue) automated ML experiments
  + Added support for multicore processing

### MLOps
+ **Local deployment & debugging for scoring containers**<br/> You can now deploy an ML model locally and iterate quickly on your scoring file and  dependencies to ensure they behave as expected.

+ **Introduced InferenceConfig & Model.deploy()**<br/> Model deployment now supports specifying a source folder with an entry script, the same as a RunConfig.  Additionally, model deployment has been simplified to a single command.

+ **Git reference tracking**<br/> Customers have been requesting basic Git integration capabilities for some time as it helps maintain a complete audit trail. We have implemented tracking across major entities in Azure Machine Learning for Git-related metadata (repo, commit, clean state). This information will be collected automatically by the SDK and CLI.

+ **Model profiling & validation service**<br/> Customers frequently complain of the difficulty to properly size the compute associated with their inference service. With our model profiling service, the customer can provide sample inputs and we profile across 16 different CPU / memory configurations to determine optimal sizing for deployment.

+ **Bring your own base image for inference**<br/> Another common complaint was the difficulty in moving from experimentation to inference RE sharing dependencies. With our new base image sharing capability, you can now reuse your experimentation base images, dependencies and all, for inference. This should speed up deployments and reduce the gap from the inner to the outer loop.

+ **Improved Swagger schema generation experience**<br/> Our previous swagger generation method was error prone and impossible to automate. We have a new in-line way of generating swagger schemas from any Python function via decorators. We have open-sourced this code and our schema generation protocol is not coupled to the Azure Machine Learning platform.

+ **Azure Machine Learning CLI is generally available (GA)**<br/> Models can now be deployed with a single CLI command. We got common customer feedback that no one deploys an ML model from a Jupyter notebook. The [**CLI reference documentation**](reference-azure-machine-learning-cli.md) has been updated.


## 2019-04-22

Azure Machine Learning SDK for Python v1.0.30 released.

The [`PipelineEndpoint`](/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline_endpoint.pipelineendpoint) was introduced to add a new version of a published pipeline while maintaining same endpoint.

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
  For a list of the versions supported by the latest SDK release, see the [DNN Estimator documentation](/python/api/azureml-train-core/azureml.train.dnn).

## 2019-03-25

### Azure Machine Learning SDK for Python v1.0.21

+ **New features**
  + The *azureml.core.Run.create_children* method allows low-latency creation of multiple child-runs with a single call.

## 2019-03-11

### Azure Machine Learning SDK for Python v1.0.18

 + **Changes**
   + The azureml-tensorboard package replaces azureml-contrib-tensorboard.
   + With this release, you can set up a user account on your managed compute cluster (amlcompute), while creating it. This can be done by passing these properties in the provisioning configuration. You can find more details in the [SDK reference documentation](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#provisioning-configuration-vm-size-----vm-priority--dedicated---min-nodes-0--max-nodes-none--idle-seconds-before-scaledown-none--admin-username-none--admin-user-password-none--admin-user-ssh-key-none--vnet-resourcegroup-name-none--vnet-name-none--subnet-name-none--tags-none--description-none--remote-login-port-public-access--notspecified--).

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
  + Azure Machine Learning now provides first class support for popular DNN framework Chainer. Using [`Chainer`](/python/api/azureml-train-core/azureml.train.dnn.chainer) class users can easily train and deploy Chainer models.
    + Learn how to [run hyperparameter tuning with Chainer using HyperDrive](https://github.com/Azure/MachineLearningNotebooks/blob/b881f78e4658b4e102a72b78dbd2129c24506980/how-to-use-azureml/ml-frameworks/chainer/deployment/train-hyperparameter-tune-deploy-with-chainer/train-hyperparameter-tune-deploy-with-chainer.ipynb)
  + Azure Machine Learning Pipelines added ability to trigger a Pipeline run based on datastore modifications. The pipeline [schedule notebook](https://aka.ms/pl-schedule) is updated to showcase this feature.

+ **Bug fixes and improvements**
  + We have added support in Azure Machine Learning pipelines for setting the source_directory_data_store property to a desired datastore (such as a blob storage) on [RunConfigurations](/python/api/azureml-core/azureml.core.runconfig.runconfiguration) that are supplied to the [PythonScriptStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep). By default Steps use Azure File store as the backing datastore, which may run into throttling issues when a large number of steps are executed concurrently.

### Azure portal

+ **New features**
  + New drag and drop table editor experience for reports. Users can drag a column from the well to the table area where a preview of the table will be displayed. The columns can be rearranged.
  + New Logs file viewer
  + Links to experiment runs, compute, models, images, and deployments from the activities tab

## Next steps

Read the overview for [Azure Machine Learning](../overview-what-is-azure-machine-learning.md).
