---
title: "Tutorial: Learning Multivariate Anomaly Detection in one hour"
titleSuffix: Azure Cognitive Services
description: An end-to-end tutorial of multivariate anomaly detection.
services: cognitive-services
author: juaduan
manager: conhua
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: tutorial
ms.date: 06/27/2021
ms.author: juaduan
---
### Learning Multivariate Anomaly Detection in one hour

Anomaly Detector with Multivariate Anomaly Detection (MVAD) is an advanced AI tool for detecting anomalies from a group of metrics in an **unsupervised** manner.

In general, you could take these steps to use MVAD:

  1. Prepare your data.
  1. Create an Anomaly Detector resource on Azure.
  1. Train an MVAD model.
  1. Inference new data with the trained MVAD model.

In this tutorial, you'll:

> [!div class="checklist"]
> * Understand how to prepare your data in a correct format.
> * Understand how to train and inference with MVAD.
> * Understand the input parameters and how to interpret the output in inference results.

#### Data Preparation

The very first step before using MVAD is preparing your own data. MVAD detects anomalies from a group of metrics, and we call each metric a **variable**.

* Each variable must have two fields, `timestamp` and `value`, and should be stored in a comma-separated values (csv) file.
* The column names of the CSV file should be precisely `timestamp` and `value`, case-sensitive. 
* The name of the csv file will be used as the variable name and should be unique.
* Variables for training and variables for inference should be consistent. For example, if you are using `series_1`, `series_2`, `series_3`, `series_4`, and `series_5` for training, you should provide exactly the same variables for inference.
* Csv files should be compressed into a zip file and uploaded to an Azure blob container. 

A common mistake in data preparation is extra folders in the zip file. For example, assume the name of the zip file is `series.zip`. Then after decompressing the files to a new folder `./series`, the **correct** path to csv files is `./series/series_1.csv` and a **wrong** path could be `./series/foo/bar/series_1.csv`.

The correct example of the directory tree after decompressing the zip file in Windows

```bash
.
└── series
    ├── series_1.csv
    ├── series_2.csv
    ├── series_3.csv
    ├── series_4.csv
    └── series_5.csv
```

An incorrect example of the directory tree after decompressing the zip file in Windows

```bash
.
└── series
    └── series
        ├── series_1.csv
        ├── series_2.csv
        ├── series_3.csv
        ├── series_4.csv
        └── series_5.csv
```

##### Zipping and uploading data

In this section, we share some sample code and tool which you could copy and edit to add into your own application logic which deals with MVAD input data.

###### Compressing csv files in \*nix:

```bash
zip -j series.zip series/*.csv
```

###### Compressing csv files in Windows:

* Navigate *into* the folder with all the csv files
* Select all the csv files you need
* Right click on one of the csv files and select `Send to`
* Select `Compressed (zipped) folder` from the drop-down
* Rename the zip file as needed

###### Python code zipping & uploading data to Azure Blob Storage

You could refer to [this doc](/azure/storage/blobs/storage-quickstart-blobs-portal#upload-a-block-blob) to learn how to upload a file to Azure Blob.

Or, you could refer to the sample code below that can do the zipping and uploading for you. You could copy and save the Python code in this section as a .py file (for example, `zipAndUpload.py`) and run it using command lines like these:

* `python zipAndUpload.py -s "foo\bar" -z test123.zip -c {azure blob connection string} -n container_xxx` This command will compress all the csv files in `foo\bar` into a single zipfile named `test123.zip`. It will upload `test123.zip` to the container `container_xxx` in your blob.
* `python zipAndUpload.py -s "foo\bar" -z test123.zip -c {azure blob connection string} -n container_xxx -r` This command will do the same thing as the above, but it will delete the zipfile `test123.zip` after uploading successfully. 

Arguments:

* `--source-folder`, `-s` path to the source folder containing csv files
* `--zipfile-name`, `-z` name of the zip file
* `--connection-string`, `-c` connection string to your blob
* `--container-name`, `-n`, name of the container
* `--remove-zipfile`, `-r`, if on, remove the zip file


```python
import os
import argparse
import shutil
import sys

from azure.storage.blob import BlobClient
import zipfile


class ZipError(Exception):
    pass


class UploadError(Exception):
    pass


def zip_file(root, name):
    try:
        z = zipfile.ZipFile(name, "w", zipfile.ZIP_DEFLATED)
        for f in os.listdir(root):
            if f.endswith("csv"):
                z.write(os.path.join(root, f), f)
        z.close()
        print("Compress files success!")
    except Exception as ex:
        raise ZipError(repr(ex))


def upload_to_blob(file, conn_str, cont_name, blob_name):
    try:
        blob_client = BlobClient.from_connection_string(conn_str, container_name=cont_name, blob_name=blob_name)
        with open(file, "rb") as f:
            blob_client.upload_blob(f, overwrite=True)
        print("Upload Success!")
    except Exception as ex:
        raise UploadError(repr(ex))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-folder", "-s", type=str, required=True, help="path to source folder")
    parser.add_argument("--zipfile-name", "-z", type=str, required=True, help="name of the zip file")
    parser.add_argument("--connection-string", "-c", type=str, help="connection string")
    parser.add_argument("--container-name", "-n", type=str, help="container name")
    parser.add_argument("--remove-zipfile", "-r", action="store_true", help="whether delete the zip file after uploading")
    args = parser.parse_args()

    try:
        zip_file(args.source_folder, args.zipfile_name)
        upload_to_blob(args.zipfile_name, args.connection_string, args.container_name, args.zipfile_name)
    except ZipError as ex:
        print(f"Failed to compress files. {repr(ex)}")
        sys.exit(-1)
    except UploadError as ex:
        print(f"Failed to upload files. {repr(ex)}")
        sys.exit(-1)
    except Exception as ex:
        print(f"Exception encountered. {repr(ex)}")

    try:
        if args.remove_zipfile:
            os.remove(args.zipfile_name)
    except Exception as ex:
        print(f"Failed to delete zip file. {repr(ex)}")
```


##### Why only accepting zip files for training and inference?

We use zip files because on batch scenarios, we expect that the size of both training and inference data would be very large and cannot be put in the HTTP request body. This allows users to perform batch inference on historical data either for model validation or data analysis. However, this might be somewhat inconvenient for streaming inference and for high frequency data. We have a plan to add a new API specifically designed for streaming inference that users can pass data in the request body.

#### Create an Anomaly Detector resource

* Create an Azure subscription if you don't have one - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, [create an Anomaly Detector resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) in the Azure portal to get your API key and API endpoint.

#### How does MVAD work

An MVAD model takes a segment of variables and decides whether an anomaly has occurred at the last timestamp. For example, the input segment is from `2021-01-01T00:00:00Z` to `2021-01-01T23:59:00Z` (inclusive), the MVAD model will decide whether an anomaly has occurred at `2021-01-02T00:00:00Z`. The length of input segment is computed from the `slidingWindow` parameter whose minimum value is 28 and maximum value is 2880. In the above case, `slidingWindow` is 1440 (60 * 24) if it has minutely granularity. 

Inference is performed in a streaming manner. For example, the inference data is from `2021-01-01T00:00:00Z` to `2021-01-08T00:00:00Z` with minutely granularity and `slidingWindow` is set to 1440 (60 * 24). The MVAD model takes data from `2021-01-01T00:00:00Z` to `2021-01-01T23:59:00Z` as input (length is 1440) and determines whether an anomaly has occurred at `2021-01-02T00:00:00Z`. Then it takes data from `2021-01-01T00:01:00Z` to `2021-01-02T00:00:00Z`  (length is 1440) and outputs the result at `2021-01-02T00:01:00Z`. It moves forward until the last timestamp in the same manner. 

MVAD is an asynchronized service which means that you won't get the model or detection results immediately after you called the APIs. This is because training and inference may take very long time so the results are deferred.

#### Train an MVAD Model

Here is a sample request body and the sample code in Python to train an MVAD model.

```json
// Sample Request Body
{
    "slidingWindow": 200,
    "alignPolicy": {
        "alignMode": "Outer",
        "fillNAMethod": "Linear", 
        "paddingValue": 0
    },
    "source": "YOUR_SAMPLE_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS",
    "startTime": "2021-01-01T00:00:00Z", 
    "endTime": "2021-01-02T12:00:00Z", 
    "displayName": "ContosoModel"
}
```

```python
# Sample Code in Python
########### Python 3.x #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '{API key}',
}

params = urllib.parse.urlencode({})

try:
    conn = http.client.HTTPSConnection('{endpoint}')
    conn.request("POST", "/anomalydetector/v1.1-preview/multivariate/models?%s" % params, "{request body}", headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################
```

Response code `201` indicates a successful request.

##### Parameters

There are three required parameters in the request:

* `source` - This is the link to your zip file located in the Azure Blob Storage with Shared Access Signatures (SAS). It can be generated from Azure portal.
* `startTime` - The start time of data used to train an MVAD model. If it's earlier than the actual earliest timestamp in the data, the actual earliest timestamp will be used as the starting point.
* `endTime` - The end time of data used to train an MVAD model which must be later than or equal to `startTime`. If `endTime` is later than the actual latest timestamp in the data, the actual latest timestamp will be used as the end point.

Other parameters are optional:

* `slidingWindow` - How many data points are used to determine anomalies. If `slidingWindow` is `k`, then at least `k` points should be provided during inference to get valid results. If there are more than `k` points provided, we will compute results for every point starting from the `k`th data point (inclusive). *The default value is 300*.

* `alignMode` - How to align data points. Because each variable may be collected from independent source, the timestamps of different variables may be inconsistent with each other. All the variables must be properly aligned in order to be consumed by MVAD. Here is a simple example showing why alignment is necessary and how aligning works.

  Series 1

  | timestamp | value |
  | --------- | ----- |
  | 12:00:01  | 1.0   |
  | 12:00:35  | 1.5   |
  | 12:01:02  | 0.9   |
  | 12:01:31  | 2.2   |
  | 12:02:08  | 1.3   |

  Series 2

  | timestamp | value |
  | --------- | ----- |
  | 12:00:03  | 2.2   |
  | 12:00:37  | 2.6   |
  | 12:01:09  | 1.4   |
  | 12:01:34  | 1.7   |
  | 12:02:04  | 2.0   |

  We have two series collected from two sensors which send one data point every 30 seconds. However, the sensors are not sending data points at a strict frequency, but sometimes earlier and sometimes later. Because MVAD will take into consideration correlations among different values, timestamps must be properly aligned so that the metrics can correctly reflect the condition of the system. In this example, timestamps of series 1 and series 2 must be properly 'rounded' before alignment.

  Let's see what happens if they're not pre-processed. If we set `alignMode` to be `Outer` (which means union of two sets), the merged table will be

    | timestamp | series 1 | series 2 |
    | --------- | -------- | -------- |
    | 12:00:01  | 1.0      | `nan`    |
    | 12:00:03  | `nan`    | 2.2      |
    | 12:00:35  | 1.5      | `nan`    |
    | 12:00:37  | `nan`    | 2.6      |
    | 12:01:02  | 0.9      | `nan`    |
    | 12:01:09  | `nan`    | 1.4      |
    | 12:01:31  | 2.2      | `nan`    |
    | 12:01:34  | `nan`    | 1.7      |
    | 12:02:04  | `nan`    | 2.0      |
    | 12:02:08  | 1.3      | `nan`    |

    `nan` means missing values. Obviously, the merged table is not the same as expected because series 1 and series 2 interleaves and the MVAD model cannot extract information about correlations of multiple series. If we set `alignMode` to `Inner`, the merged table will be empty as there is no common timestamp in series 1 and series 2.

 Therefore, the timestamps of series 1 and series 2 should be pre-processed (rounded to the nearest 30-second timestamps) and the new series are

Series 1

| timestamp | value |
| --------- | ----- |
| 12:00:00  | 1.0   |
| 12:00:30  | 1.5   |
| 12:01:00  | 0.9   |
| 12:01:30  | 2.2   |
| 12:02:00  | 1.3   |

Series 2

| timestamp | value |
| --------- | ----- |
| 12:00:00  | 2.2   |
| 12:00:30  | 2.6   |
| 12:01:00  | 1.4   |
| 12:01:30  | 1.7   |
| 12:02:00  | 2.0   |

Now the merged table is more reasonable.

| timestamp | series 1 | series 2 |
| --------- | -------- | -------- |
| 12:00:00  | 1.0      | 2.2      |
| 12:00:30  | 1.5      | 2.6      |
| 12:01:00  | 0.9      | 1.4      |
| 12:01:30  | 2.2      | 1.7      |
| 12:02:00  | 1.3      | 2.0      |

Signal values of close timestamps are well aligned and the MVAD model can now extract correlation information.

* `fillNAMethod` - How to fill `nan` in the merged table. There might be still missing values in the merged table and they should be properly handled. We provide several methods to fill up them.
* `paddingValue` - Padding value is used to fill `nan` when `fillNAMethod` is `Fixed`. In other cases it is optional.
* `displayName` - This is an optional parameter which is used to identify models. For example, you can use it to mark parameters, data sources, and any other meta data about the model and its input data.

#### Get Model Status

As the training API is asynchronized, you won't get the model immediately after calling the training API. However, you can query the status of models either by API key, which will list all the models, or by model ID, which will list information about the specific model.

##### List all the models

You may refer to [this page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/ListMultivariateModel) about the request URL and request headers. Notice that we only return 10 models ordered by update time, but you can visit other models by setting the `$skip` and the `$top` parameters in the request URL. For example, if your request URL is `https://{endpoint}/anomalydetector/v1.1-preview/multivariate/models?$skip=10&$top=20`, then we will skip the 10 latest models and return the next 20 models.

A sample response is 

```json
{
	"models": [
         {
             "createdTime":"2020-12-01T09:43:45Z",
             "displayName":"DevOps-Test",
             "lastUpdatedTime":"2020-12-01T09:46:13Z",
             "modelId":"b4c1616c-33b9-11eb-824e-0242ac110002",
             "status":"READY",
             "variablesCount":18
         },
         {
             "createdTime":"2020-12-01T09:43:30Z",
             "displayName":"DevOps-Test",
             "lastUpdatedTime":"2020-12-01T09:45:10Z",
             "modelId":"ab9d3e30-33b9-11eb-a3f4-0242ac110002",
             "status":"READY",
             "variablesCount":18
         }
	],
    "currentCount": 1,
    "maxCount": 50, 
    "nextLink": "<link to more models>"
}
```

The response contains 4 fields, `models`, `currentCount`, `maxCount`, and `nextLink`. 

* `models` contains the created time, last updated time, model ID, display name, variable counts, and the status of each model. 
* `current count ` contains the number of trained multivariate models.
* `maxCount` is the maximum number of models to be trained for this Anomaly Detector resource. 
* `nextLink` could be used to fetch more models.

##### Get models by Model ID

[This page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/GetMultivariateModel) describes the request URL to query model information by model ID. A sample response looks like this

```json
{
        "modelId": "45aad126-aafd-11ea-b8fb-d89ef3400c5f",
        "createdTime": "2020-06-30T00:00:00Z",
        "lastUpdatedTime": "2020-06-30T00:00:00Z",
        "modelInfo": {
          "slidingWindow": 300,
          "alignPolicy": {
            "alignMode": "Outer",
            "fillNAMethod": "Linear",
            "paddingValue": 0
          },
          "source": "<TRAINING_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS>",
          "startTime": "2019-04-01T00:00:00Z",
          "endTime": "2019-04-02T00:00:00Z",
          "displayName": "Devops-MultiAD",
          "status": "READY",
          "errors": [],
          "diagnosticsInfo": {
            "modelState": {
              "epochIds": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
              "trainLosses": [0.6291328072547913, 0.1671326905488968, 0.12354248017072678, 0.1025966405868533, 
                              0.0958492755889896, 0.09069952368736267,0.08686016499996185, 0.0860302299260931,
                              0.0828735455870684, 0.08235538005828857],
              "validationLosses": [1.9232804775238037, 1.0645641088485718, 0.6031560301780701, 0.5302737951278687, 
                                   0.4698025286197664, 0.4395163357257843, 0.4182931482799006, 0.4057914316654053, 
                                   0.4056498706340729, 0.3849248886108984],
              "latenciesInSeconds": [0.3398594856262207, 0.3659665584564209, 0.37360644340515137, 
                                     0.3513407707214355, 0.3370304107666056, 0.31876277923583984, 
                                     0.3283309936523475, 0.3503587245941162, 0.30800247192382812,
                                     0.3327946662902832]
            },
            "variableStates": [
              {
                "variable": "ad_input",
                "filledNARatio": 0,
                "effectiveCount": 1441,
                "startTime": "2019-04-01T00:00:00Z",
                "endTime": "2019-04-02T00:00:00Z",
                "errors": []
              },
              {
                "variable": "ad_ontimer_output",
                "filledNARatio": 0,
                "effectiveCount": 1441,
                "startTime": "2019-04-01T00:00:00Z",
                "endTime": "2019-04-02T00:00:00Z",
                "errors": []
              },
              // More variables
            ]
          }
        }
      }
```

You will receive more detailed information about the model queried. The response contains meta information about the model, its training parameters, and diagnostic information. Diagnostic Information is useful for debugging and tracing training progress. 

* `epochIds` indicates how many epochs the model has been trained out of in total total 100 epochs. For example, if the model is still in the training status, `epochId` might be `[10, 20, 30, 40, 50]` which means that it has completed its 50th training epoch, so there are half way to go.
* `trainLosses` and `validationLosses` are used to check whether the optimization progress converges.
* `latenciesInSeconds` contains the time cost for each epoch and is recorded every 10 epochs. In this example, the 10th epoch takes approximately 0.34 seconds to finish. This would be helpful to estimate the completion time of training.
* `variableStates`  summarizes information about each variable. It tells how many data points are used for each variable and `filledNARatio` tells how many missing points are there. Too many missing data points will deteriorate model performance. 
* If any errors have encountered during data processing,  they will be included in the `errors` field.

#### Inference with MVAD

To perform inference on new data, simply provide the blob source to the zip file containing inferencing data, the start time, and end time. Inference is also asynchronized, so the results are not returned immediately. Notice that you need to save the link to the results in the **response header** containing the **result ID**, so that you may know where to get the results. A response code 201 indicates the success. Failures are usually caused by model issues or data issues. You cannot perform inference if the model is not ready or the data link is invalid. Make sure that the training data and inference data are consistent, which means they should be **exactly** the same time series but with different timestamps. More time series, less time series, or inference with different time series will not pass the data verification phase and errors will occur. Data verification is deferred so that you will get error message when you query the results.

#### Get Inference Results

You need the result ID to get results. Result ID is obtained from the response header when you submit the inference request. [This page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/GetDetectionResult) contains instructions to query the inference results. A sample response looks like this

```json
 {
        "resultId": "663884e6-b117-11ea-b3de-0242ac130004",
        "summary": {
          "status": "READY",
          "errors": [],
          "variableStates": [
            {
              "variable": "ad_input",
              "filledNARatio": 0,
              "effectiveCount": 26,
              "startTime": "2019-04-01T00:00:00Z",
              "endTime": "2019-04-01T00:25:00Z",
              "errors": []
            },
            {
              "variable": "ad_ontimer_output",
              "filledNARatio": 0,
              "effectiveCount": 26,
              "startTime": "2019-04-01T00:00:00Z",
              "endTime": "2019-04-01T00:25:00Z",
              "errors": []
            },
            // more variables
          ],
          "setupInfo": {
            "source": "https://multiadsample.blob.core.windows.net/data/sample_data_2_1000.zip?sp=rl&st=2020-12-04T06:03:47Z&se=2022-12-05T06:03:00Z&sv=2019-12-12&sr=b&sig=AZTbvZ7fcp3MdqGY%2FvGHJXJjUgjS4DneCGl7U5omq5c%3D",
            "startTime": "2019-04-01T00:15:00Z",
            "endTime": "2019-04-01T00:40:00Z"
          }
        },
        "results": [
          {
            "timestamp": "2019-04-01T00:15:00Z",
            "errors": [
              {
                "code": "InsufficientHistoricalData",
                "message": "historical data is not enough."
              }
            ]
          },
          // more results
          {
            "timestamp": "2019-04-01T00:20:00Z",
            "value": {
              "contributors": [],
              "isAnomaly": false,
              "severity": 0,
              "score": 0.17805261260751692
            }
          },
          // more results
          {
            "timestamp": "2019-04-01T00:27:00Z",
            "value": {
              "contributors": [
                {
                  "contributionScore": 0.0007775013367514271,
                  "variable": "ad_ontimer_output"
                },
                {
                  "contributionScore": 0.0007989604079048129,
                  "variable": "ad_series_init"
                },
                {
                  "contributionScore": 0.0008900927229851369,
                  "variable": "ingestion"
                },
                {
                  "contributionScore": 0.008068144477478554,
                  "variable": "cpu"
                },
                {
                  "contributionScore": 0.008222036467507165,
                  "variable": "data_in_speed"
                },
                {
                  "contributionScore": 0.008674941549594993,
                  "variable": "ad_input"
                },
                {
                  "contributionScore": 0.02232242629793674,
                  "variable": "ad_output"
                },
                {
                  "contributionScore": 0.1583773213660846,
                  "variable": "flink_last_ckpt_duration"
                },
                {
                  "contributionScore": 0.9816531517495176,
                  "variable": "data_out_speed"
                }
              ],
              "isAnomaly": true,
              "severity": 0.42135109874230336,
              "score": 1.213510987423033
            }
          },
          // more results
        ]
      }
```

The response contains the result status, variable information, inference parameters, and inference results.

* `variableStates` lists the information of each variable in the inference request.
* `setupInfo` is the request body submitted for this inference.
* `results` contains the detection results. There're three typical types of detection results.
    1. Error code `InsufficientHistoricalData`. This usually happens with the first few timestamps because the model inferences data in a window-based manner and it needs historical data to make a decision. For the first few timestamps, there is insufficient historical data, so inference cannot be performed on them. In this case, the error message can be ignored.
    1. `"isAnomaly": false` indicates the current timestamp is not an anomaly.
        * `severity ` indicates the relative severity of the anomaly and for normal data it is always 0.
        * `score` is the raw output of the model on which the model makes a decision which could be non-zero even for normal data points.
    1. `"isAnomaly": true` indicates an anomaly at the current timestamp.
        * `severity ` indicates the relative severity of the anomaly and for abnormal data it is always greater than 0.
        * `score` is the raw output of the model on which the model makes a decision. `severity` is a derived value from `score`. Every data point has a `score`.
        * `contributors` is a list containing the contribution score of each variable. Higher contribution scores indicate higher possibility of the root cause.

##### What's the difference between `severity` and `score`?

Normally we recommend you use  `severity` as the filter to sift out 'anomalies' that are not so important to your business. Depending on your scenario and data pattern, those anomalies that are less important often have relatively lower `severity` values or standalone (discontinuous) high `severity` values - random spikes.

In cases where you've found a need of more sophisticated rules than thresholds against `severity` or duration of continuous high `severity` values, you may want to use `score` to build more powerful filters.

Understanding how MVAD is using `score` to determine anomalies may help you build those filters:

We consider whether a data point is anomalous from both global and local perspective. If `score` at a timestamp is higher than a certain threshold, then the timestamp is marked as an anomaly. If `score` is lower than the threshold but is relatively higher in a segment, it is also marked as an anomaly.

## Next steps

* [Best practices](../concepts/best-practices-multivariate.md).
* [Quickstarts](../quickstarts/client-libraries-multivariate.md).
