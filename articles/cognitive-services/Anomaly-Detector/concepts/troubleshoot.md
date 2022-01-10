---
title: Troubleshooting the Anomaly Detector Multivariate API
titleSuffix: Azure Cognitive Services
description: Learn how to remediate common error codes when using the Anomaly Detector API
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: conceptual
ms.date: 04/01/2021
ms.author: mbullwin
keywords: anomaly detection, machine learning, algorithms
---

# Troubleshooting the multivariate API

This article provides guidance on how to troubleshoot and remediate common error messages when using the multivariate API.

## Multivariate error codes

### Common Errors

| Error Code                 | HTTP Error Code | Error Message                                  | Comment                                                      |
| -------------------------- | --------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `SubscriptionNotInHeaders` | 400             | apim-subscription-id is not found in headers | Please add your APIM subscription ID in the header. Example header: `{"apim-subscription-id": <Your Subscription ID>}` |
| `FileNotExist`             | 400             | File \<source> does not exist.                  | Please check the validity of your blob shared access signature (SAS). Make sure that it has not expired. |
| `InvalidBlobURL`           | 400             |                                                | Your blob shared access signature (SAS) is not a valid SAS.                            |
| `StorageWriteError`        | 403             |                                                | This error is possibly caused by permission issues. Our service is not allowed to write the data to the blob encrypted by a Customer Managed Key (CMK). Either remove CMK or grant access to our service again. Please refer to [this page](../../encryption/cognitive-services-encryption-keys-portal.md) for more details. |
| `StorageReadError`         | 403             |                                                | Same as `StorageWriteError`.                                 |
| `UnexpectedError`          | 500             |                                                | Please contact us with detailed error information. You could take the support options from [this document](../../cognitive-services-support-options.md?context=%2fazure%2fcognitive-services%2fanomaly-detector%2fcontext%2fcontext) or email us at [AnomalyDetector@microsoft.com](mailto:AnomalyDetector@microsoft.com)           |


### Train a Multivariate Anomaly Detection Model

| Error Code               | HTTP Error Code | Error Message                                                | Comment                                                      |
| ------------------------ | --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `TooManyModels`          | 400             | This subscription has reached the maximum number of models.  | Each APIM subscription ID is allowed to have 300 active models. Please delete unused models before training a new model |
| `TooManyRunningModels`   | 400             | This subscription has reached the maximum number of running models. | Each APIM subscription ID is allowed to train 5 models concurrently. Please train a new model after previous models have completed their training process. |
| `InvalidJsonFormat`      | 400             | Invalid json format.                                         | Training request is not a valid JSON.                        |
| `InvalidAlignMode`       | 400             | The `'alignMode'` field must be one of the following: `'Inner'` or `'Outer'` . | Please check the value of `'alignMode'` which should be either `'Inner'` or `'Outer'` (case sensitive). |
| `InvalidFillNAMethod`    | 400             | The `'fillNAMethod'` field must be one of the following:  `'Previous'`, `'Subsequent'`, `'Linear'`, `'Zero'`, `'Fixed'`, `'NotFill'` and it cannot be `'NotFill'` when `'alignMode'` is `'Outer'`. | Please check the value of `'fillNAMethod'`. You may refer to [this section](./best-practices-multivariate.md#optional-parameters-for-training-api) for more details. |
| `RequiredPaddingValue`   | 400             | The `'paddingValue'` field is required in the request when `'fillNAMethod'` is `'Fixed'`. | You need to provide a valid padding value when `'fillNAMethod'` is `'Fixed'`. You may refer to [this section](./best-practices-multivariate.md#optional-parameters-for-training-api) for more details. |
| `RequiredSource`         | 400             | The `'source'` field is required in the request.             | Your training request has not specified a value for the `'source'` field. Example: `{"source": <Your Blob SAS>}`. |
| `RequiredStartTime`      | 400             | The `'startTime'` field is required in the request.          | Your training request has not specified a value for the `'startTime'` field. Example: `{"startTime": "2021-01-01T00:00:00Z"}`. |
| `InvalidTimestampFormat` | 400             | Invalid Timestamp format. `<timestamp>` is not a valid format. | The format of timestamp in the request body is not correct. You may try `import pandas as pd; pd.to_datetime(timestamp)` to verify. |
| `RequiredEndTime`        | 400             | The `'endTime'` field is required in the request.            | Your training request has not specified a value for the `'startTime'` field. Example: `{"endTime": "2021-01-01T00:00:00Z"}`. |
| `InvalidSlidingWindow`   | 400             | The `'slidingWindow'` field must be an integer between 28 and 2880. | `'slidingWindow'` must be an integer between 28 and 2880 (inclusive). |

### Get Multivariate Model with Model ID

| Error Code      | HTTP Error Code | Error Message             | Comment                                                      |
| --------------- | --------------- | ------------------------- | ------------------------------------------------------------ |
| `ModelNotExist` | 404             | The model does not exist. | The model with corresponding model ID does not exist. Please check the model ID in the request URL. |

### List Multivariate Models

| Error Code      | HTTP Error Code | Error Message             | Comment                                                      |
| --------------- | --------------- | ------------------------- | ------------------------------------------------------------ |
|`InvalidRequestParameterError`| 400             | Invalid values for $skip or $top … | Please check whether the values for the two parameters are numerical. $skip and $top are used to list the models with pagination. Because the API only returns 10 most recently updated models, you could use $skip and $top to get models updated earlier. | 

### Anomaly Detection with a Trained Model

| Error Code        | HTTP Error Code | Error Message                                                | Comment                                                      |
| ----------------- | --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `ModelNotExist`   | 404             | The model does not exist.                                    | The model used for inference does not exist. Please check the model ID in the request URL. |
| `ModelFailed`     | 400             | Model failed to be trained.                                  | The model is not successfully trained. Please get detailed information by getting the model with model ID. |
| `ModelNotReady`   | 400             | The model is not ready yet.                                  | The model is not ready yet. Please wait for a while until the training process completes. |
| `InvalidFileSize` | 413             | File \<file> exceeds the file size limit (\<size limit> bytes). | The size of inference data exceeds the upper limit (2GB currently). Please use less data for inference. |

### Get Detection Results

| Error Code       | HTTP Error Code | Error Message              | Comment                                                      |
| ---------------- | --------------- | -------------------------- | ------------------------------------------------------------ |
| `ResultNotExist` | 404             | The result does not exist. | The result per request does not exist. Either inference has not completed or result has expired (7 days). |

### Data Processing Errors

The following error codes do not have associated HTTP Error codes.

| Error Code             | Error Message                                                | Comment                                                      |
| ---------------------  | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `NoVariablesFound`     | No variables found. Please check that your files are organized as per instruction. | No csv files could be found from the data source. This is typically caused by wrong organization of files. Please refer to the sample data for the desired structure. |
| `DuplicatedVariables`  | There are multiple variables with the same name.             | There are duplicated variable names.                         |
| `FileNotExist`         | File \<filename> does not exist.                              | This error usually happens during inference. The variable has appeared in the training data but is missing in the inference data. |
| `RedundantFile`        | File \<filename> is redundant.                                | This error usually happens during inference. The variable was not in the training data but appeared in the inference data. |
| `FileSizeTooLarge`     | The size of file \<filename> is too large.                    | The size of the single csv file \<filename> exceeds the limit. Please train with less data. |
| `ReadingFileError`     | Errors occurred when reading \<filename>. \<error messages>    | Failed to read the file \<filename>. You may refer to \<error messages> for more details or verify with `pd.read_csv(filename)` in a local environment. |
| `FileColumnsNotExist`  | Columns timestamp or value in file \<filename> do not exist.  | Each csv file must have two columns with names **timestamp** and **value** (case sensitive). |
| `VariableParseError`   | Variable \<variable> parse \<error message> error.             | Cannot process the \<variable> due to runtime errors. Please refer to the \<error message> for more details or contact us with the \<error message>. |
| `MergeDataFailed`      | Failed to merge data. Please check data format.              | Data merge failed. This is possibly due to wrong data format, organization of files, etc. Please refer to the sample data for the current file structure. |
| `ColumnNotFound`       | Column \<column> cannot be found in the merged data.          | A column is missing after merge. Please verify the data.     |
| `NumColumnsMismatch`   | Number of columns of merged data does not match the number of variables. | Please verify the data.                                      |
| `TooManyData`          | Too many data points. Maximum number is 1000000 per variable.       | Please reduce the size of input data.                        |
| `NoData`               | There is no effective data                                   | There is no data to train/inference after processing. Please check the start time and end time. |
| `DataExceedsLimit`     | The length of data whose timestamp is between `startTime` and `endTime` exceeds limit(\<limit>). | The size of data after processing exceeds the limit. (Currently no limit on processed data.) |
| `NotEnoughInput`       | Not enough data. The length of data is \<data length>, but the minimum length should be larger than sliding window which is \<sliding window size>. | The minimum number of data points for inference is the size of sliding window. Try to provide more data for inference. |