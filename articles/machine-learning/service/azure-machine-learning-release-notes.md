---
title: What's new in the release?
titleSuffix: Azure Machine Learning service
description: Learn about the latest updates to Azure Machine Learning service and the machine learning and data prep Python SDKs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: larryfr
author: Blackmist
ms.date: 05/14/2019
ms.custom: seodec18
---

# Azure Machine Learning service release notes

In this article, learn about the Azure Machine Learning service releases.  For a full description of each SDK, visit the reference docs for:
+ The Azure Machine Learning's [**main SDK for Python**](https://aka.ms/aml-sdk)
+ The Azure Machine Learning [**Data Prep SDK**](https://aka.ms/data-prep-sdk)

See [the list of known issues](resource-known-issues.md) to learn about known bugs and workarounds.

## 2019-07-09

### Visual Interface
+ **Preview features**
  + Added "Execute R script" module in visual interface.

### Azure Machine Learning SDK for Python v1.0.48

+ **New features**
  + **azureml-opendatasets**
    + **azureml-contrib-opendatasets** is now available as **azureml-opendatasets**. The old package can still work, but we recommend you using **azureml-opendatasets** moving forward for richer capabilities and improvements.
    + This new package allows you to register open datasets as Dataset in AML workspace, and leverage whatever functionalities that Dataset offers.
    + It also includes existing capabilities such as consuming open datasets as Pandas/SPARK dataframes, and location joins for some dataset like weather.

+ **Preview features**
    + HyperDriveConfig can now accept pipeline object as a parameter to support hyperparameter tuning using a pipeline.

+ **Bug fixes and improvements**
  + **azureml-train-automl**
    + Fixed the bug about losing columns types after the transformation.
    + Fixed the bug to allow y_query to be an object type containing None(s) at the beginning. 
    + Fixed the issue in the Ensemble selection procedure which was unnecessarily growing the resulting ensemble even if the scores remained constant.
    + Fixed the issue with whitelist_models and blacklist_models settings in AutoMLStep.
    + Fixed the issue that prevented the usage of preprocessing when AutoML would have been used in the context of Azure ML Pipelines.
  + **azureml-opendatasets**
    + Moved azureml-contrib-opendatasets to azureml-opendatasets.
    + Allowed open dataset classes to be registered to AML workspace and leverage AML Dataset capabilities seamlessly.
    + Improved NoaaIsdWeather enrich performance in non-SPARK version significantly.
  + **azureml-explain-model**
    + Updated online documentation for interpretability objects.
    + Added batch_size to mimic explainer when include_local=False for streaming global explanations in batches to improve execution time of DecisionTreeExplainableModel.
    + Fixed the issue where `explanation.expected_values` would sometimes return a float rather than a list with a float in it.
    + Added expected values to automl output for mimic explainer in explain model library.
    + Fixed permutation feature importance when transformations argument supplied to get raw feature importance.
    + Added batch_size to mimic explainer when include_local=False for streaming global explanations in batches to improve execution time of DecisionTreeExplainableModel for model explainability library.
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
  + **azureml-dataprep**
    + Dataflow objects can now be iterated over producing a sequence of records.
    + Fixed the issue where `Dataflow.read_pandas_dataframe` would fail when the `in_memory` argument is set to True.
    + Improved handling of pandas DataFrames with non-string Column Indexes.
    + Exposed `set_diagnostics_collection()` to allow for programmatic enabling/disabling of the telemetry collection.
    + Added topValues and bottomValues summarize.
  + **azureml-pipeline-core**
    + Parameter hash_paths for all pipeline steps is deprecated and will be removed in future. By default contents of the source_directory is hashed (except files listed in .amlignore or .gitignore)
    + Continuing improving Module and ModuleStep to support compute type specific modules, in preparation for RunConfiguration integration and further changes to unlock their usage in pipelines.
  + **azureml-pipeline-steps**
    + AzureBatchStep: Improved documentation with regards to inputs/outputs.
    + AzureBatchStep: Changed delete_batch_job_after_finish default value to true.
  + **azureml-train-core**
    + Strings are now accepted as compute target for Automated Hyperparameter Tuning.
    + Deprecated the unused RunConfiguration setting in auto_prepare_environment.
    + Deprecated parameters `conda_dependencies_file_path` and `pip_requirements_file_path` in favor of `conda_dependencies_file` and `pip_requirements_file` respectively.
  + **azureml-opendatasets**
    + Improve NoaaIsdWeather enrich performance in non-SPARK version significantly.
    
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

+ **Breaking changes**

+ **Bug fixes and improvements**
  + Removed paramiko dependency from azureml-core. Added deprecation warnings for legacy compute target attach methods.
  + Improve performance of run.create_children
  + In mimic explainer with binary classifier, fix the order of probabilities when teacher probability is used for scaling shap values
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
    + Learn how to [run hyperparameter tuning with Scikit-learn using HyperDrive](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-deploy-with-sklearn.ipynb).
  + Added support for creating ModuleStep in pipelines along with Module and ModuleVersion classes to manage reusable compute units.
  + ACI webservices now support persistent scoring_uri through updates. The scoring_uri will change from IP to FQDN. The Dns Name Label for FQDN can be configured by setting the dns_name_label on deploy_configuration. 
  + Automated machine learning new features:
    + STL featurizer for forecasting
    + KMeans clustering is enabled for feature sweeping
  + AmlCompute Quota approvals just became faster! We have now automated the process to approve your quota requests within a threshold. For more information on how quotas work, learn [how to manage quotas](https://docs.microsoft.com/azure/machine-learning/service/how-to-manage-quotas).

+ **Preview features**
    + Integration with [MLflow](https://mlflow.org) 1.0.0 tracking through azureml-mlflow package ([example notebooks](https://aka.ms/azureml-mlflow-examples)).
    + Submit Jupyter notebook as a run. [API Reference Documentation](https://docs.microsoft.com/python/api/azureml-contrib-notebook/azureml.contrib.notebook?view=azure-ml-py)
    + Public Preview of [Data Drift Detector](https://docs.microsoft.com/python/api/azureml-contrib-datadrift/azureml.contrib.datadrift?view=azure-ml-py) through azureml-contrib-datadrift package ([example notebooks](https://aka.ms/azureml-datadrift-example)). Data Drift is one of the top reasons where model accuracy degrades over time. It happens when data served to model in production is different from the data that the model was trained on. AML Data Drift detector helps customer to monitor data drift and sends alert whenever drift is detected. 

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
  + Scoring timeout on AKS webservices should be between 5ms and 300000ms. Max allowed scoring_timeout_ms for scoring requests has been bumped from 1 min to 5 min.
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
+ Brand new Authoring section (Preview) in the Machine Learning service workspace, which includes Automated Machine Learning, Visual Interface and Hosted Notebook VMs
	+ Automatically create a model using Automated machine learning 
	+ Use a drag and drop Visual Interface to run experiments
	+ Create a Notebook VM to explore data, create models, and deploy services.
+ Live chart and metric updating in run reports and run details pages
+ Updated file viewer for logs, outputs, and snapshots in Run details pages.
+ New and improved report creation experience in the Experiments tab. 
+ Added ability to download the config.json file from the Overview page of the Azure Machine Learning service workspace.
+ Support Machine Learning service workspace creation from Azure Databricks workspace 

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
+ [Quickly spin up a preconfigured notebook VM](quickstart-run-cloud-notebook.md) that has the latest version of Azure Machine Learning SDK and related packages.
+ Access is secured through proven technologies, such as HTTPS, Azure Active Directory authentication and authorization.
+ Reliable cloud storage of notebooks and code in your Azure Machine Learning Workspace blob storage account. You can safely delete your notebook VM without losing your work.
+ Preinstalled sample notebooks to explore and experiment with Azure Machine Learning service features.
+ Full customization capabilities of Azure VMs, any VM type, any packages, any drivers. 

## 2019-04-26

### Azure Machine Learning SDK for Python v1.0.33 released.

+ Azure ML Hardware Accelerated Models on [FPGAs](concept-accelerate-with-fpgas.md) is generally available.
  + You can now [use the azureml-accel-models package](how-to-deploy-fpga-web-service.md) to:
    + Train the weights of a supported deep neural network (ResNet 50, ResNet 152, DenseNet-121, VGG-16, and SSD-VGG)
    + Use transfer learning with the supported DNN
    + Register the model with Model Management Service and containerize the model
    + Deploy the model to an Azure VM with an FPGA in an Azure Kubernetes Service (AKS) cluster
  + Deploy the container to an [Azure Data Box Edge](https://docs.microsoft.com/azure/databox-online/data-box-edge-overview) server device
  + Score your data with the gRPC endpoint with this [sample](https://github.com/Azure-Samples/aml-hardware-accelerated-models)

### Automated Machine Learning

+ Feature sweeping to enable dynamically adding featurizers for performance optimization. New featurizers: work embeddings, weight of evidence, target encodings, text target encoding, cluster distance
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

The [`PipelineEndpoint`](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline_endpoint.pipelineendpoint?view=azure-ml-py) was introduce to add a new version of a published pipeline while maintaining same endpoint.

## 2019-04-17

### Azure Machine Learning Data Prep SDK v1.1.2

Note: Data Prep Python SDK will no longer install `numpy` and `pandas` packages. See [updated installation instructions](https://aka.ms/aml-data-prep-installation).

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
   + With this release, you can set up a user account on your managed compute cluster (amlcompute), while creating it. This can be done by passing these properties in the provisioning configuration. You can find more details in the [SDK reference documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py#provisioning-configuration-vm-size-----vm-priority--dedicated---min-nodes-0--max-nodes-none--idle-seconds-before-scaledown-none--admin-username-none--admin-user-password-none--admin-user-ssh-key-none--vnet-resourcegroup-name-none--vnet-name-none--subnet-name-none--tags-none--description-none-).

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
    + Learn how to [run distributed training with ChainerMN](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/distributed-chainer/distributed-chainer.ipynb)
    + Learn how to [run hyperparameter tuning with Chainer using HyperDrive](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-chainer/train-hyperparameter-tune-deploy-with-chainer.ipynb)
  + Azure Machine Learning Pipelines added ability trigger a Pipeline run based on datastore modifications. The pipeline [schedule notebook](https://aka.ms/pl-schedule) is updated to showcase this feature.

+ **Bug fixes and improvements**
  + We have added support Azure Machine Learning Pipelines for setting the source_directory_data_store property to a desired datastore (such as a blob storage) on [RunConfigurations](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.runconfiguration?view=azure-ml-py) that are supplied to the [PythonScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep?view=azure-ml-py). By default Steps use Azure File store as the backing datastore, which may run into throttling issues when a large number of steps are executed concurrently.

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
  +  DataTranferStep updated to work with Azure SQL Server and Azure database for PostgreSQL ([notebook](https://aka.ms/pl-data-trans)).

+ **Changes**
  + Deprecated `PublishedPipeline.get_published_pipeline` in favor of `PublishedPipeline.get`.
  + Deprecated `Schedule.get_schedule` in favor of `Schedule.get`.

### Azure Machine Learning Data Prep SDK v1.0.12

+ **New features**
  + Data Prep now supports reading from an Azure SQL database using Datastore.
 
+ **Changes**
  + Improved the memory performance of certain operations on large data.
  + `read_pandas_dataframe()` now requires `temp_folder` to be specified.
  + The `name` property on `ColumnProfile` has been deprecated - use `column_name` instead.

## 2019-01-28

### Azure Machine Learning SDK for Python v1.0.10

+ **Changes**: 
  + Azure ML SDK no longer has azure-cli packages as dependency. Specifically, azure-cli-core and azure-cli-profile dependencies have been removed from azureml-core. These are the  user impacting changes:
  	+ If you are performing "az login" and then using azureml-sdk, the SDK will do the browser or device code log in one more time. It won't use any credentials state created by "az login".
	+ For Azure CLI authentication, such as using "az login", use _azureml.core.authentication.AzureCliAuthentication_ class. For Azure CLI authentication, do  _pip install azure-cli_ in the Python environment where you have installed azureml-sdk.
	+ If you are doing "az login" using a service principal for automation, we recommend using _azureml.core.authentication.ServicePrincipalAuthentication_ class, as azureml-sdk won't use credentials state created by azure CLI. 

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

Azure Machine Learning service is now generally available.

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
  * Use latest AML Run Token when reading from and writing to datastores on remote runs. Previously, if the AML Run Token is updated in Python, the Data Prep runtime will not be updated with the updated AML Run Token.
  * Additional clearer error messages
  * to_spark_dataframe() will no longer crash when Spark uses `Kryo` serialization
  * Value Count Inspector can now show more than 1000 unique values
  * Random Split no longer fails if the original Dataflow doesn’t have a name  

+ **More information**
  * [Azure Machine Learning Data Prep SDK](https://aka.ms/data-prep-sdk)

### Docs and notebooks
+ ML Pipelines
  + New and updated notebooks for getting started with pipelines, batch scoping,  and style transfer examples: https://aka.ms/aml-pipeline-notebooks
  + Learn how to [create your first pipeline](how-to-create-your-first-pipeline.md)
  + Learn how to [run batch predictions using pipelines](how-to-run-batch-predictions.md)
+ Azure Machine Learning compute target
  + [Sample notebooks](https://aka.ms/aml-notebooks) are now updated to use the new managed compute.
  + [Learn about this compute](how-to-set-up-training-targets.md#amlcompute)

### Azure portal: new features
+ Create and manage [Azure Machine Learning Compute](how-to-set-up-training-targets.md#amlcompute) types in the portal.
+ Monitor quota usage and [request quota](how-to-manage-quotas.md) for Azure Machine Learning Compute.
+ View Azure Machine Learning Compute cluster status in real time.
+ Virtual network support was added for Azure Machine Learning Compute and Azure Kubernetes Service creation.
+ Rerun your published pipelines with existing parameters.
+ New [automated machine learning charts](how-to-track-experiments.md#auto) for classification models (lift, gains, calibration, feature importance chart with model explainability) and regression models (residuals and feature importance chart with model explainability). 
+ Pipelines can be viewed in Azure portal




## 2018-11-20

### Azure Machine Learning SDK for Python v0.1.80

+ **Breaking changes** 
  * *azureml.train.widgets* namespace has moved to *azureml.widgets*.
  * *azureml.core.compute.AmlCompute* deprecates the following classes - *azureml.core.compute.BatchAICompute* and *azureml.core.compute.DSVMCompute*. The latter class will be removed in subsequent releases. The AmlCompute class has an easier definition now, and simply needs a vm_size and the max_nodes, and will automatically scale your cluster from 0 to the max_nodes when a job is submitted. Our [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/training) have been updated with this information and should give you usage examples. We hope you like this simplification and lots of more exciting features to come in a later release!

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
   * Now no longer fails when reading on remote compute target using AML token
   * Now no longer fails on Linux DSVM
   * Now no longer crashes when non-string values are in string predicates
   * Now handles assertion errors when Dataflow should fail correctly
   * Now supports dbutils mounted storage locations on Azure Databricks

## 2018-11-05

### Azure portal 
The Azure portal for the Azure Machine Learning service has the following updates:
  * A new **Pipelines** tab for published pipelines.
  * Added support for attaching an existing HDInsight cluster as a compute target.

### Azure Machine Learning SDK for Python v0.1.74

+ **Breaking changes** 
  * *Workspace.compute_targets, datastores, experiments, images, models, and *webservices* are properties instead of methods. For example, replace *Workspace.compute_targets()* with *Workspace.compute_targets*.
  * *Run.get_context* deprecates *Run.get_submitted_run*. The latter method will be removed in subsequent releases.
  * *PipelineData* class now expects a datastore object as a parameter rather than datastore_name. Similarly, *Pipeline* accepts default_datastore rather than default_datastore_name.

+ **New features**
  * The Azure Machine Learning Pipelines [sample notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/pipeline/pipeline-mpi-batch-prediction.ipynb) now uses MPI steps.
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
  * When using Replace, leaving “find” blank will no longer fail 

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
  * Fixed ensembling iteration issues.
  * Fixed training hanging bug on MAC OS.
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

Read the overview for [Azure Machine Learning service](../service/overview-what-is-azure-ml.md).
