---
title: "Tutorial: Learn Multivariate Anomaly Detection in one hour"
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

# Tutorial: Learn Multivariate Anomaly Detection in one hour

Anomaly Detector with Multivariate Anomaly Detection (MVAD) is an advanced AI tool for detecting anomalies from a group of metrics in an **unsupervised** manner.

In general, you could take these steps to use MVAD:

  1. Create an Anomaly Detector resource that supports MVAD on Azure.
  1. Prepare your data.
  1. Train an MVAD model.
  1. Query the status of your model.
  1. Detect anomalies with the trained MVAD model.
  1. Retrieve and interpret the inference results.

In this tutorial, you'll:

> [!div class="checklist"]
> * Understand how to prepare your data in a correct format.
> * Understand how to train and inference with MVAD.
> * Understand the input parameters and how to interpret the output in inference results.

## 1. Create an Anomaly Detector resource that supports MVAD

* Create an Azure subscription if you don't have one - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, [create an Anomaly Detector resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) in the Azure portal to get your API key and API endpoint.

> [!NOTE]
> During preview stage, MVAD is available in limited regions only. Please bookmark [What's new in Anomaly Detector](../whats-new.md)  to keep up to date with MVAD region roll-outs. You could also file a GitHub issue or contact us at [AnomalyDetector@microsoft.com](mailto:AnomalyDetector@microsoft.com) to request for specific regions.

## 2. Data preparation

Then you need to prepare your training data (and inference data).

[!INCLUDE [mvad-data-schema](../includes/mvad-data-schema.md)]

### Tools for zipping and uploading data

In this section, we share some sample code and tools which you could copy and edit to add into your own application logic which deals with MVAD input data.

#### Compressing CSV files in \*nix

```bash
zip -j series.zip series/*.csv
```

#### Compressing CSV files in Windows

* Navigate *into* the folder with all the CSV files.
* Select all the CSV files you need.
* Right click on one of the CSV files and select `Send to`.
* Select `Compressed (zipped) folder` from the drop-down.
* Rename the zip file as needed.

#### Python code zipping & uploading data to Azure Blob Storage

You could refer to [this doc](../../../storage/blobs/storage-quickstart-blobs-portal.md#upload-a-block-blob) to learn how to upload a file to Azure Blob.

Or, you could refer to the sample code below that can do the zipping and uploading for you. You could copy and save the Python code in this section as a .py file (for example, `zipAndUpload.py`) and run it using command lines like these:

* `python zipAndUpload.py -s "foo\bar" -z test123.zip -c {azure blob connection string} -n container_xxx`

    This command will compress all the CSV files in `foo\bar` into a single zip file named `test123.zip`. It will upload `test123.zip` to the container `container_xxx` in your blob.
* `python zipAndUpload.py -s "foo\bar" -z test123.zip -c {azure blob connection string} -n container_xxx -r` 

    This command will do the same thing as the above, but it will delete the zip file `test123.zip` after uploading successfully. 

Arguments:

* `--source-folder`, `-s`, path to the source folder containing CSV files
* `--zipfile-name`, `-z`, name of the zip file
* `--connection-string`, `-c`, connection string to your blob
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
        print(f"Failed to delete the zip file. {repr(ex)}")
```

## 3. Train an MVAD Model

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
    // This could be your own ZIP file of training data stored on Azure Blob and a SAS url could be used here
    "source": "https://aka.ms/AnomalyDetector/MVADSampleData", 
    "startTime": "2021-01-01T00:00:00Z", 
    "endTime": "2021-01-02T12:00:00Z", 
    "displayName": "Contoso model"
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

[!INCLUDE [mvad-input-params](../includes/mvad-input-params.md)]

## 4. Get model status

As the training API is asynchronous, you won't get the model immediately after calling the training API. However, you can query the status of models either by API key, which will list all the models, or by model ID, which will list information about the specific model.

### List all the models

You may refer to [this page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/ListMultivariateModel) for information about the request URL and request headers. Notice that we only return 10 models ordered by update time, but you can visit other models by setting the `$skip` and the `$top` parameters in the request URL. For example, if your request URL is `https://{endpoint}/anomalydetector/v1.1-preview/multivariate/models?$skip=10&$top=20`, then we will skip the latest 10 models and return the next 20 models.

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
* `currentCount` contains the number of trained multivariate models.
* `maxCount` is the maximum number of models supported by this Anomaly Detector resource.
* `nextLink` could be used to fetch more models.

### Get models by model ID

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

You will receive more detailed information about the queried model. The response contains meta information about the model, its training parameters, and diagnostic information. Diagnostic Information is useful for debugging and tracing training progress.

* `epochIds` indicates how many epochs the model has been trained out of in total 100 epochs. For example, if the model is still in training status, `epochId` might be `[10, 20, 30, 40, 50]` which means that it has completed its 50th training epoch, and there are half way to go.
* `trainLosses` and `validationLosses` are used to check whether the optimization progress converges in which case the two losses should decrease gradually.
* `latenciesInSeconds` contains the time cost for each epoch and is recorded every 10 epochs. In this example, the 10th epoch takes approximately 0.34 seconds. This would be helpful to estimate the completion time of training.
* `variableStates` summarizes information about each variable. It is a list ranked by `filledNARatio` in descending order. It tells how many data points are used for each variable and `filledNARatio` tells how many points are missing. Usually we need to reduce `filledNARatio` as much as possible.
Too many missing data points will deteriorate model accuracy.
* Errors during data processing will be included in the `errors` field.

## 5. Inference with MVAD

To perform inference, simply provide the blob source to the zip file containing the inference data, the start time, and end time.

Inference is also asynchronous, so the results are not returned immediately. Notice that you need to save in a variable the link of the results in the **response header** which contains the `resultId`, so that you may know where to get the results afterwards.

Failures are usually caused by model issues or data issues. You cannot perform inference if the model is not ready or the data link is invalid. Make sure that the training data and inference data are consistent, which means they should be **exactly** the same variables but with different timestamps. More variables, fewer variables, or inference with a different set of variables will not pass the data verification phase and errors will occur. Data verification is deferred so that you will get error message only when you query the results.

## 6. Get inference results

You need the `resultId` to get results. `resultId` is obtained from the response header when you submit the inference request. [This page](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1-preview/operations/GetDetectionResult) contains instructions to query the inference results. 

A sample response looks like this

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
            "source": "https://aka.ms/AnomalyDetector/MVADSampleData",
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
    1. Error code `InsufficientHistoricalData`. This usually happens only with the first few timestamps because the model inferences data in a window-based manner and it needs historical data to make a decision. For the first few timestamps, there is insufficient historical data, so inference cannot be performed on them. In this case, the error message can be ignored.
    1. `"isAnomaly": false` indicates the current timestamp is not an anomaly.
        * `severity ` indicates the relative severity of the anomaly and for normal data it is always 0.
        * `score` is the raw output of the model on which the model makes a decision which could be non-zero even for normal data points.
    1. `"isAnomaly": true` indicates an anomaly at the current timestamp.
        * `severity ` indicates the relative severity of the anomaly and for abnormal data it is always greater than 0.
        * `score` is the raw output of the model on which the model makes a decision. `severity` is a derived value from `score`. Every data point has a `score`.
        * `contributors` is a list containing the contribution score of each variable. Higher contribution scores indicate higher possibility of the root cause. This list is often used for interpreting anomalies as well as diagnosing the root causes.

> [!NOTE]
> A common pitfall is taking all data points with `isAnomaly`=`true` as anomalies. That may end up with too many false positives.
> You should use both `isAnomaly` and `severity` (or `score`) to sift out anomalies that are not severe and (optionally) use grouping to check the duration of the anomalies to suppress random noise. 
> Please refer to the [FAQ](../concepts/best-practices-multivariate.md#faq) in the best practices document for the difference between `severity` and `score`.

## Next steps

* [Best practices: Recommended practices to follow when using the multivariate Anomaly Detector APIs](../concepts/best-practices-multivariate.md)
* [Quickstarts: Use the Anomaly Detector multivariate client library](../quickstarts/client-libraries-multivariate.md)