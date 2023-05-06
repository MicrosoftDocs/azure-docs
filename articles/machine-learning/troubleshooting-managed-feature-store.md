---
title: Troubleshoot managed feature store errors
description: Information required to troubleshoot common errors with the managed feature store in Azure Machine Learning.
author: qjxu
ms.author: qjax
ms.topic: troubleshooting-general 
ms.date: 05/23/2023
---

# Troubleshooting managed feature store

In this article, learn how to troubleshoot common problems you may encounter with the managed feature store in Azure Machine Learning.

## Issues found when creating and updating a feature store

When you create or update a feature store, you may encounter the following issues.

### Throttling Issue

You may hit a throttling issue, receiving a "Too many requests" error.

#### Solution

Create a feature store at a later time, when more resources are available.

### Permission Issue

To create a feature store, you need the `Contributor` and `User Access Administrator` roles.

### Symptom: Updating a feature store multiple times using the CLI results in an error

1. Create a feature store using following command
```yaml
az ml feature-store create --subscription {sub-id} --resource-group {rg} --name {your-featurestore-name}
```
2. Update the feature store using the following command
```yaml
az ml feature-store update --subscription {sub-id} --resource-group {rg} --name {your-featurestore-name} --file \path\featurestore-materialization.yaml
```
3. Update the feature store the second time without changing the UAI in the yaml file
```yaml
az ml feature-store update --subscription {sub-id} --resource-group {rg} --name {your-featurestore-name} --file \path\featurestore-materialization.yaml
```
Error:
```yaml
(InvalidRequestContent) The request content contains duplicate JSON property names creating ambiguity in paths 'identity.userAssignedIdentities['/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{your-uai}']'. Please update the request content to eliminate duplicates and try again.
Code: InvalidRequestContent
Message: The request content contains duplicate JSON property names creating ambiguity in paths 'identity.userAssignedIdentities['/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{your-uai}']'. Please update the request content to eliminate duplicates and try again.
```
#### Solution

The issue is the managed identity ARM id. By default, the managed identity SDK/UI returns an arm id using `resourcegroups` in the URI.
To fix it, replace `resourcegroups` with `resourceGroups` in the managed identity ARM id.
```yaml
$schema: http://azureml/sdk-2-0/Featurestore.json

name: your-featurestore-name

materialization_identity:
    client_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    resource_id: /subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{your-uai}
```

## Issues creating and updating feature sets

### Symptom: Invalid Schema in Feature Set Specification

You develop a feature set in an AzureML Spark notebook using  the following code snippet. If there are invalid schema in the feature set specification YAML, you will see various errors.

```python
from featurestore import FeaturesetSpec
accounts_featureset_spec_path = root_dir + "/featurestore/featuresets/transactions/spec"
# load the featureset spec locally
accounts_featureset_spec = FeaturesetSpec.from_config(accounts_featureset_spec_path)
accounts_df=accounts_featureset_spec.to_spark_dataframe()

display(accounts_df.head(5))
```

### Symptom: Error - Schema check errors, timestamp column

Error message: `azure.ai.ml.exceptions.ValidationException: Schema check errors, timestamp column: timestamp1 is not in output dataframe`

#### Solution
As shown in the error message, the timestamp column, `timestamp1`, does not exist in the source data. Please check the `source` definition in the feature set specification, make sure the `source.timestamp_column` matches what in the source data. 

In the following yaml definition, the `source.timestamp_column.name` is wrong.

```yaml
$schema: http://azureml/sdk-2-0/FeatureSetSpec.json

source:
  type: parquet
  path: abfs://file_system@account_name.dfs.core.windows.net/datasources/transactions-source/*.parquet
  timestamp_column: # name of the column representing the timestamp.
    name: timestamp1
```

### Symptom: Error - Exception: Schema check errors, no index column

Error message: `Exception: Schema check errors, no index column: accountID1 in output dataframe`

#### Solution
As shown in the error message, the index column, `accountID1`, does not exist in the source data. Please check the `index_columns.name` definition, to make sure it matches what in the source data.

In the following yaml definition, the `index_columns.name` is wrong.
```yaml
$schema: http://azureml/sdk-2-0/FeatureSetSpec.json

index_columns:
  - name: accountID1
    type: string
```

#### Symptom: Error - AttributeError: module has no attribute

Error message: `AttributeError: module '7780d27aa8364270b6b61fed2a43b749.transaction_transform' has no attribute 'TransactionFeatureTransformer1'`

##### Solution
As shown in the error message, the `transformer_class`, `TransactionFeatureTransformer1`, defined in the feature set specification does not match what is in the source code.

In the following yaml definition, please check the source code in the path of `feature_transformation_code.path`, make sure the `feature_transformation_code.transformer_class` matches what defined in the source code.
```yaml
$schema: http://azureml/sdk-2-0/FeatureSetSpec.json

feature_transformation_code: 
  path: ./code
  transformer_class: transaction_transform.TransactionFeatureTransformer1 
```

##### Symptom
Error message: `ValidationException: Schema check errors, feature column: transaction_7d_count has data type: ColumnType.long, expected: ColumnType.string`

###### Solution
As shown in the error message, the feature column, `transaction_7d_count`, has invalid data type. What defined in the specification yaml is `string`, however, the data has type of `long`.

In the following yaml definition, the `features.transaction_7d_count.type` needs to change to `long`.
```yaml
$schema: http://azureml/sdk-2-0/FeatureSetSpec.json

features:
  - name: transaction_7d_count
    type: string
    description: 7-day rolling transaction count
```

#### Symptom: Unable to See Data when get_offline_features() is Run in Notebook

You may try the following code snippet in an AzureML Spark notebook, but do not see data:

```python
observation_data_path= "abfs://container@storage.blob.core.windows.net/observation_data/train/*.parquet"
observation_data_df = spark.read.parquet(observation_data_path)
obs_data_timestamp_column = "timestamp"

features = [
    accounts_fset['accountCountry'],
    accounts_fset['accountAge']    
]

training_df = Featurestore.get_offline_features(features, observation_data_df, obs_data_timestamp_column)
display(training_df.head(5))
```

##### Solution

Please check the source_delay and temporal_join_lookback for the feature set, and make sure `temporal_join_lookback > source.source_delay`. In addition, please refer to the [todo: feature-retrieval-concept-todo] for detail.

### Issues with Materialization and Feature Retrieval Job

#### Symptom: Wrong Offline Store Configuration

In materialization job, you may hit below errors.
Error message: 
`Caused by: Status code: -1 error code: null error message: InvalidAbfsRestOperationExceptionjava.net.UnknownHostException: adlgen23.dfs.core.windows.net`

Error message: 
`java.util.concurrent.ExecutionException: Operation failed: "The specifed resource name contains invalid characters.", 400, HEAD, https://{storage}.dfs.core.windows.net/{container-name}/{fs-id}/transactions/1/_delta_log?upn=false&action=getStatus&timeout=90`

##### Solution

The root cause is a wrong offline store target is configured for your feature store. Please check `offline_store.target` and make sure it is a valid Azure lake gen2 storage URI.
```yaml
$schema: http://azureml/sdk-2-0/Featurestore.json

name: your-featuer-store-name

offline_store:
    type: azure_data_lake_gen2
    target: /subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{storage}/blobServices/default/containers/{container-name}

```

#### Issues with Missing Permission

You may encounter different authorization errors in materialization as well as feature retrieval job.

##### Symptom: Missing Permission to Access AzureML Resource

```python
Traceback (most recent call last):
  File "/home/trusted-service-user/cluster-env/env/lib/python3.8/site-packages/azure/ai/ml/_restclient/v2022_12_01_preview/operations/_workspaces_operations.py", line 633, in get
    raise HttpResponseError(response=response, model=error, error_format=ARMErrorFormat)
azure.core.exceptions.HttpResponseError: (AuthorizationFailed) The client 'XXXX' with object id 'XXXX' does not have authorization to perform action 'Microsoft.MachineLearningServices/workspaces/read' over scope '/subscriptions/XXXX/resourceGroups/XXXX/providers/Microsoft.MachineLearningServices/workspaces/XXXX' or the scope is invalid. If access was recently granted, please refresh your credentials.
Code: AuthorizationFailed
```

###### Solution:

1. If it happens to the materialization job, assign `AzureML Data Scientist` role to the User Assigned Identity (UAI) attached to your featurestore.
1. If it happens to the feature retrieval job, assign `AzureML Data Scientist` role to the identity used in the `feature_retrieval` component.
1. If it happens when you run code in an AzureML Spark notebook, it uses your own identity to access AzureML service, assign `AzureML Data Scientist` role to yourself.

`AzureML Data Scientist` is a recommended role. You can create your own custom role with the following actions
- Microsoft.MachineLearningServices/workspaces/datastores/listsecrets/action
- Microsoft.MachineLearningServices/workspaces/featuresets/read
- Microsoft.MachineLearningServices/workspaces/read

##### Symptom: Missing Permission to Read from the Storage

```python
An error occurred while calling o1025.parquet.
: java.nio.file.AccessDeniedException: Operation failed: "This request is not authorized to perform this operation using this permission.", 403, GET, https://{storage}.dfs.core.windows.net/test?upn=false&resource=filesystem&maxResults=5000&directory=datasources&timeout=90&recursive=false, AuthorizationPermissionMismatch, "This request is not authorized to perform this operation using this permission. RequestId:63013315-e01f-005e-577b-7c63b8000000 Time:2023-05-01T22:20:51.1064935Z"
	at org.apache.hadoop.fs.azurebfs.AzureBlobFileSystem.checkException(AzureBlobFileSystem.java:1203)
	at org.apache.hadoop.fs.azurebfs.AzureBlobFileSystem.listStatus(AzureBlobFileSystem.java:408)
	at org.apache.hadoop.fs.Globber.listStatus(Globber.java:128)
	at org.apache.hadoop.fs.Globber.doGlob(Globber.java:291)
	at org.apache.hadoop.fs.Globber.glob(Globber.java:202)
	at org.apache.hadoop.fs.FileSystem.globStatus(FileSystem.java:2124)
```

###### Solution:

- If it happens to the materialization job, assign `Storage Blob Data Reader` role to the User Assigned Identity (UAI) to the storage container used as offline store.
- If it happens to the feature retrieval job, assign `Storage Blob Data Reader` role to the identity used in the spark job.
- If it happens when you run code in an AzureML Spark notebook, it uses your own identity to access AzureML service, assign `Storage Blob Data Reader` role to yourself.

`Storage Blob Data Reader` is the minimum recommended access requirement. You can also assign roles like more privileges like `Storage Blob Data Contributor` or `Storage Blob Data Owner`.

##### Symptom: Missing Permission to Write Data to Offline Store

This happens to the materialization job.

```yaml
An error occurred while calling o1162.load.
: java.util.concurrent.ExecutionException: java.nio.file.AccessDeniedException: Operation failed: "This request is not authorized to perform this operation using this permission.", 403, HEAD, https://featuresotrestorage1.dfs.core.windows.net/offlinestore/fs_xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_fsname/transactions/1/_delta_log?upn=false&action=getStatus&timeout=90
	at com.google.common.util.concurrent.AbstractFuture$Sync.getValue(AbstractFuture.java:306)
	at com.google.common.util.concurrent.AbstractFuture$Sync.get(AbstractFuture.java:293)
	at com.google.common.util.concurrent.AbstractFuture.get(AbstractFuture.java:116)
	at com.google.common.util.concurrent.Uninterruptibles.getUninterruptibly(Uninterruptibles.java:135)
	at com.google.common.cache.LocalCache$Segment.getAndRecordStats(LocalCache.java:2410)
	at com.google.common.cache.LocalCache$Segment.loadSync(LocalCache.java:2380)
	at com.google.common.cache.LocalCache$S
```

###### Solution

Assign `Storage Blob Data Contributor` role to the User Assigned Identity (UAI) attached to your featurestore.
`Storage Blob Data Contributor` is the minimum recommended access requirement. You can also assign roles like more privileges like `Storage Blob Data Owner`.

#### Symptom: Cannot Resolve Feature Retrieval Specification

To use features, you will prepare a feature retrieval spec yaml file. This file is used as an input to the feature retrieval component. You may hit various errors if there are issues in the yaml file.

Invalid feature:
```python
UserError: Feature 'accountAgeaf' not found in this featureset.
```

Invalid feature store URI:
```python
(ResourceNotFound) The Resource 'Microsoft.MachineLearningServices/workspaces/a-featurestore-workspace' under resource group 'a-resource-group' was not found. For more details please go to https://aka.ms/ARMResourceNotFoundFix
Code: ResourceNotFound
```

Invalid feature set:
```python
(UserError) Featureset with name: transactionss and version: 1 not found.
Code: UserError
Message: Featureset with name: transactionss and version: 1 not found.
```

##### Solution:
We recommend to use the utility function to prepare the feature retrieval spec yaml file.

Below is a code snippet to generate feature retrieval spec in an AzureML Spark notebook using `generate_feature_retrieval_spec` utility function. 
```python
from featurestore import Featurestore, FeaturesetSpec, Featureset

# feature store data plane client
featurestore = Featurestore(AzureMLHoboSparkOnBehalfOfCredential(), featurestore_sub_id, featurestore_rg_name, featurestore_name)
accounts_featureset = featurestore.get_featureset("accounts", "1")
transactions_featureset = featurestore.get_featureset("transactions", "1")

features = [
    accounts_featureset['accountAge'],
    transactions_featureset['transaction_amount_7d_sum'],
    transactions_featureset['transaction_amount_3d_sum']
]

feature_retrieval_spec_path = "./project/fraud_model/FeatureRetrievalSpec.yaml"
featurestore.generate_feature_retrieval_spec(feature_retrieval_spec_path, features)
```

#### Symptom: Missing Feature Retrieval Spec with Batch Inference using Model as Input

The batch inference pipeline generally contains two steps: step one is the feature retrieval step to prepare data; step two is the inference step.

When you provide a model as input to the feature retrieval step, it expects the retrival spec yaml file exists under the model artifact folder. If it does not exist, you will see following error in the feature retrieval job.
```python
ValueError: Failed with visit error: Failed with execution error: error in streaming from input data sources
	VisitError(ExecutionError(StreamError(NotFound)))
=> Failed with execution error: error in streaming from input data sources
	ExecutionError(StreamError(NotFound)); Not able to find path: azureml://subscriptions/{sub_id}/resourcegroups/{rg}/workspaces/{ws}/datastores/workspaceblobstore/paths/LocalUpload/{guid}/feature_retrieval_spec.yaml
```

##### Solution:

In your training job, when upload the model, please use following code to write the feature retrieval spec yaml to the model artifact folder.

```python
shutil.copy("path_to_feature_retrieval_spec.yaml", args.model_output)
```

### Issues with Training Job

#### Symptom: No Feature Values in Training Job

If you use the out-of-box feature retrieval component to prepare training data, this component writes the feature retrieval specification yaml file under the output folder, and the feature values (parquet files) under a `data` sub-folder. So in the training step, you should consume data from this `data` sub-folder, and populate the feature retrieval specification yaml to the model output folder.

##### Solution

Assume the retrieval component output folder is passed to the training step as `args.training_data`, following code snippet shows how to read the data and populate the retrieval specification.
```python
# read training data
training_df = pd.read_parquet(os.path.join(args.training_data, "data"))

# perform other training steps

# save the model
pkl_filename = os.path.join(args.model_output, "clf.pkl")
with open(pkl_filename, 'wb') as file:
    pickle.dump(clf, file)

# save the feature_retrieval_spec
shutil.copy(os.path.join(args.training_data, "feature_retrieval_spec.yaml"), args.model_output)
```

### Where to Find Materialization Job Error and Logs

Feature set materialization job and feature retrieval component are implemented as an AzureML spark job. You can follow the instructions to find the error message and logs for troubleshooting.

1. Navigate to the feature store page: https://ml.azure.com/featureStore/{your-feature-store-name}.
2. Go to the `feature set` tab and click on the feature set you are working on and navigate to the feature set detail page.
3. From feature set detail page, click on the `Materialization jobs` tab then click on the failed job to the job details view.
4. On the job detail view, under `Properties` card, it shows job status and error message.
5. In addition, you can go to the `Outputs + logs` tab, then find the `stdout` file from `logs\azureml\driver\stdout` 

