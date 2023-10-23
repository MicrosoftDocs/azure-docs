---
title: Troubleshoot the Anomaly Detector multivariate API
titleSuffix: Azure AI services
description: Learn how to remediate common error codes when you use the Azure AI Anomaly Detector multivariate API.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: troubleshooting
ms.date: 04/01/2021
ms.author: mbullwin
keywords: anomaly detection, machine learning, algorithms
---

# Troubleshoot the multivariate API

[!INCLUDE [Deprecation announcement](../includes/deprecation.md)]

This article provides guidance on how to troubleshoot and remediate common error messages when you use the Azure AI Anomaly Detector multivariate API.

## Multivariate error codes

The following tables list multivariate error codes.

### Common errors

| Error code                 | HTTP error code | Error message                                  | Comment                                                      |
| -------------------------- | --------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `SubscriptionNotInHeaders` | 400             | apim-subscription-id is not found in headers. | Add your APIM subscription ID in the header. An example header is `{"apim-subscription-id": <Your Subscription ID>}`. |
| `FileNotExist`             | 400             | File \<source> does not exist.                  | Check the validity of your blob shared access signature. Make sure that it hasn't expired. |
| `InvalidBlobURL`           | 400             |                                                | Your blob shared access signature isn't a valid shared access signature.                            |
| `StorageWriteError`        | 403             |                                                | This error is possibly caused by permission issues. Our service isn't allowed to write the data to the blob encrypted by a customer-managed key. Either remove the customer-managed key or grant access to our service again. For more information, see [Configure customer-managed keys with Azure Key Vault for Azure AI services](../../encryption/cognitive-services-encryption-keys-portal.md). |
| `StorageReadError`         | 403             |                                                | Same as `StorageWriteError`.                                 |
| `UnexpectedError`          | 500             |                                                |  Contact us with detailed error information. You could take the support options from [Azure AI services support and help options](../../cognitive-services-support-options.md?context=%2fazure%2fcognitive-services%2fanomaly-detector%2fcontext%2fcontext) or email us at [AnomalyDetector@microsoft.com](mailto:AnomalyDetector@microsoft.com).           |

### Train a multivariate anomaly detection model

| Error code               | HTTP error code | Error message                                                | Comment                                                      |
| ------------------------ | --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `TooManyModels`          | 400             | This subscription has reached the maximum number of models.  | Each APIM subscription ID is allowed to have 300 active models. Delete unused models before you train a new model. |
| `TooManyRunningModels`   | 400             | This subscription has reached the maximum number of running models. | Each APIM subscription ID is allowed to train five models concurrently. Train a new model after previous models have completed their training process. |
| `InvalidJsonFormat`      | 400             | Invalid JSON format.                                         | Training request isn't a valid JSON.                        |
| `InvalidAlignMode`       | 400             | The `'alignMode'` field must be one of the following: `'Inner'` or `'Outer'` . | Check the value of `'alignMode'`, which should be either `'Inner'` or `'Outer'` (case sensitive). |
| `InvalidFillNAMethod`    | 400             | The `'fillNAMethod'` field must be one of the following:  `'Previous'`, `'Subsequent'`, `'Linear'`, `'Zero'`, `'Fixed'`, `'NotFill'`. It cannot be `'NotFill'` when `'alignMode'` is `'Outer'`. | Check the value of `'fillNAMethod'`. For more information, see [Best practices for using the Anomaly Detector multivariate API](./best-practices-multivariate.md#optional-parameters-for-training-api). |
| `RequiredPaddingValue`   | 400             | The `'paddingValue'` field is required in the request when `'fillNAMethod'` is `'Fixed'`. | You need to provide a valid padding value when `'fillNAMethod'` is `'Fixed'`. For more information, see [Best practices for using the Anomaly Detector multivariate API](./best-practices-multivariate.md#optional-parameters-for-training-api). |
| `RequiredSource`         | 400             | The `'source'` field is required in the request.             | Your training request hasn't specified a value for the `'source'` field. An example is `{"source": <Your Blob SAS>}`. |
| `RequiredStartTime`      | 400             | The `'startTime'` field is required in the request.          | Your training request hasn't specified a value for the `'startTime'` field. An example is `{"startTime": "2021-01-01T00:00:00Z"}`. |
| `InvalidTimestampFormat` | 400             | Invalid timestamp format. The `<timestamp>` format is not a valid format. | The format of timestamp in the request body isn't correct. Try `import pandas as pd; pd.to_datetime(timestamp)` to verify. |
| `RequiredEndTime`        | 400             | The `'endTime'` field is required in the request.            | Your training request hasn't specified a value for the `'startTime'` field. An example is `{"endTime": "2021-01-01T00:00:00Z"}`. |
| `InvalidSlidingWindow`   | 400             | The `'slidingWindow'` field must be an integer between 28 and 2880. | The `'slidingWindow'` field must be an integer between 28 and 2880 (inclusive). |

### Get a multivariate model with a model ID

| Error code      | HTTP error code | Error message             | Comment                                                      |
| --------------- | --------------- | ------------------------- | ------------------------------------------------------------ |
| `ModelNotExist` | 404             | The model does not exist. | The model with corresponding model ID doesn't exist. Check the model ID in the request URL. |

### List multivariate models

| Error code      | HTTP error code | Error message             | Comment                                                      |
| --------------- | --------------- | ------------------------- | ------------------------------------------------------------ |
|`InvalidRequestParameterError`| 400             | Invalid values for $skip or $top. | Check whether the values for the two parameters are numerical. The values $skip and $top are used to list the models with pagination. Because the API only returns the 10 most recently updated models, you could use $skip and $top to get models updated earlier. |

### Anomaly detection with a trained model

| Error code        | HTTP error code | Error message                                                | Comment                                                      |
| ----------------- | --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `ModelNotExist`   | 404             | The model does not exist.                                    | The model used for inference doesn't exist. Check the model ID in the request URL. |
| `ModelFailed`     | 400             | Model failed to be trained.                                  | The model isn't successfully trained. Get detailed information by getting the model with model ID. |
| `ModelNotReady`   | 400             | The model is not ready yet.                                  | The model isn't ready yet. Wait for a while until the training process completes. |
| `InvalidFileSize` | 413             | File \<file> exceeds the file size limit (\<size limit> bytes). | The size of inference data exceeds the upper limit, which is currently 2 GB. Use less data for inference. |

### Get detection results

| Error code       | HTTP error code | Error message              | Comment                                                      |
| ---------------- | --------------- | -------------------------- | ------------------------------------------------------------ |
| `ResultNotExist` | 404             | The result does not exist. | The result per request doesn't exist. Either inference hasn't completed or the result has expired. The expiration time is seven days. |

### Data processing errors

The following error codes don't have associated HTTP error codes.

| Error code             | Error message                                                | Comment                                                      |
| ---------------------  | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `NoVariablesFound`     | No variables found. Check that your files are organized as per instruction. | No CSV files could be found from the data source. This error is typically caused by incorrect organization of files. See the sample data for the desired structure. |
| `DuplicatedVariables`  | There are multiple variables with the same name.             | There are duplicated variable names.                         |
| `FileNotExist`         | File \<filename> does not exist.                              | This error usually happens during inference. The variable has appeared in the training data but is missing in the inference data. |
| `RedundantFile`        | File \<filename> is redundant.                                | This error usually happens during inference. The variable wasn't in the training data but appeared in the inference data. |
| `FileSizeTooLarge`     | The size of file \<filename> is too large.                    | The size of the single CSV file \<filename> exceeds the limit. Train with less data. |
| `ReadingFileError`     | Errors occurred when reading \<filename>. \<error messages>    | Failed to read the file \<filename>. For more information, see the \<error messages> or verify with `pd.read_csv(filename)` in a local environment. |
| `FileColumnsNotExist`  | Columns timestamp or value in file \<filename> do not exist.  | Each CSV file must have two columns with the names **timestamp** and **value** (case sensitive). |
| `VariableParseError`   | Variable \<variable> parse \<error message> error.             | Can't process the \<variable> because of runtime errors. For more information, see the \<error message> or contact us with the \<error message>. |
| `MergeDataFailed`      | Failed to merge data. Check data format.              | Data merge failed. This error is possibly because of the wrong data format or the incorrect organization of files. See the sample data for the current file structure. |
| `ColumnNotFound`       | Column \<column> cannot be found in the merged data.          | A column is missing after merge. Verify the data.     |
| `NumColumnsMismatch`   | Number of columns of merged data does not match the number of variables. | Verify the data.                                      |
| `TooManyData`          | Too many data points. Maximum number is 1000000 per variable.       | Reduce the size of input data.                        |
| `NoData`               | There is no effective data.                                   | There's no data to train/inference after processing. Check the start time and end time. |
| `DataExceedsLimit`.     | The length of data whose timestamp is between `startTime` and `endTime` exceeds limit(\<limit>). | The size of data after processing exceeds the limit. Currently, there's no limit on processed data. |
| `NotEnoughInput`       | Not enough data. The length of data is \<data length>, but the minimum length should be larger than sliding window, which is \<sliding window size>. | The minimum number of data points for inference is the size of the sliding window. Try to provide more data for inference. |
