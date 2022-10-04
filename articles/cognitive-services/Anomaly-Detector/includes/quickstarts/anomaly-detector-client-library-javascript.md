---
title: Anomaly Detector JavaScript client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 10/04/2022
ms.author: mbullwin
ms.custom: devx-track-js
---

<a href="https://go.microsoft.com/fwlink/?linkid=2090788" target="_blank">Library reference documentation</a> |<a href="https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector" target="_blank">Library source code</a> | <a href="https://www.npmjs.com/package/%40azure/ai-anomaly-detector" target="_blank">Package (npm)</a> |<a href="https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/AnomalyDetector" target="_blank">Find the sample code on GitHub</a>

Get started with the Anomaly Detector client library for JavaScript. Follow these steps to install the package start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for JavaScript to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

## Prerequisites

* An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
* The current version of <a href="https://nodejs.org/" target="_blank">Node.js</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button.
    * You'll need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file.

```console
npm init
```

### Install the client library

Install the required npm packages:

```console
 npm install csv-parse
 npm install @azure/core-auth
 npm install @azure/ai-anomaly-detector
```

Your app's `package.json` file will be updated with the dependencies.

## Retrieve key and endpoint

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `ANOMALY_DETECTOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `ANOMALY_DETECTOR_API_KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`DATA_PATH` | This quickstart uses the `request-data.csv` file that can be downloaded from our [GitHub sample data](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv). Example path: `c:\\test\\request-data.csv`  |

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx ANOMALY_DETECTOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx ANOMALY_DETECTOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export ANOMALY_DETECTOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export ANOMALY_DETECTOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

---

### Download sample data

This quickstart uses the `request-data.csv` file that can be downloaded from our [GitHub sample data](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv)

 You can also download the sample data by running:

```cmd
curl "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv" --output request-data.csv
```

## Detect anomalies

Create a file named `index.js` and replace with the following code:

```javascript
// <imports>
'use strict'

const fs = require('fs');
const parse = require("csv-parse/lib/sync");
const { AnomalyDetectorClient } = require('@azure/ai-anomaly-detector');
const { AzureKeyCredential } = require('@azure/core-auth');

let CSV_FILE = './request-data.csv'; //this assumes your datafile is in the same directory as your index.js file

// Authentication variables
let key = process.env.ANOMALY_DETECTOR_API_KEY;
let endpoint = process.env.ANOMALY_DETECTOR_ENDPOINT;

// Points array for the request body
let points = [];


let anomalyDetectorClient = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(key));

function readFile() {
    let input = fs.readFileSync(CSV_FILE).toString();
    let parsed = parse(input, { skip_empty_lines: true });
    parsed.forEach(function (e) {
        points.push({ timestamp: new Date(e[0]), value: parseFloat(e[1]) });
    });
}
readFile()

async function batchCall() {
    // Create request body for API call
    let body = { series: points, granularity: 'daily' }
    // Make the call to detect anomalies in whole series of points
    await anomalyDetectorClient.detectEntireSeries(body)
        .then((response) => {
            console.log("Batch (entire) anomaly detection):")
            for (let item = 0; item < response.isAnomaly.length; item++) {
                if (response.isAnomaly[item]) {
                    console.log("An anomaly was detected from the series, at row " + item)
                }
            }
        }).catch((error) => {
            console.log(error)
        })

}
batchCall()

async function lastDetection() {

    let body = { series: points, granularity: 'daily' }
    // Make the call to detect anomalies in the latest point of a series
    await anomalyDetectorClient.detectLastPoint(body)
        .then((response) => {
            console.log("Latest point anomaly detection:")
            if (response.isAnomaly) {
                console.log("The latest point, in row " + points.length + ", is detected as an anomaly.")
            } else {
                console.log("The latest point, in row " + points.length + ", is not detected as an anomaly.")
            }
        }).catch((error) => {
            console.log(error)
        })
}
lastDetection()

async function changePointDetection() {

    let body = { series: points, granularity: 'daily' }
    // get change point detect results
    await anomalyDetectorClient.detectChangePoint(body)
        .then((response) => {
            if (
                response.isChangePoint.some(function (changePoint) {
                    return changePoint === true;
                })
            ) {
                console.log("Change points were detected from the series at index:");
                response.isChangePoint.forEach(function (changePoint, index) {
                    if (changePoint === true) {
                        console.log(index);
                    }
                });
            } else {
                console.log("There is no change point detected from the series.");
            }
        }).catch((error) => {
            console.log(error)
        })
}
changePointDetection();
```

### Detect anomalies in the entire dataset

In the code above, we call the Anomaly Detector API three times. The first call is to detect anomalies through the entire time series as a batch with the client's [entireDetect()](/javascript/api/@azure/cognitiveservices-anomalydetector/anomalydetectorclient#entiredetect-request--msrest-requestoptionsbase-) method. We store the returned [EntireDetectResponse](/javascript/api/@azure/cognitiveservices-anomalydetector/entiredetectresponse) object. Then we iterate through the response's `isAnomaly` list, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

The second call determines if your latest data point is an anomaly using the client's [lastDetect()](/javascript/api/@azure/cognitiveservices-anomalydetector/anomalydetectorclient#lastdetect-request--msrest-requestoptionsbase-) method, and store the returned [LastDetectResponse](/javascript/api/@azure/cognitiveservices-anomalydetector/lastdetectresponse) object. The response's `isAnomaly` value is a boolean that specifies that point's anomaly status.  

The final call detects change points in the time series with the client's [detectChangePoint()](https://go.microsoft.com/fwlink/?linkid=2090788) method. Store the returned [ChangePointDetectResponse](https://go.microsoft.com/fwlink/?linkid=2090788) object. Iterate through the response's `isChangePoint` list, and print the index of any `true` values. These values correspond to the indices of trend change points, if any were found.

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You also may want to consider [deleting the environment variables](/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.2#using-the-environment-provider-and-item-cmdlets&preserve-view=true) you created if you no longer intend to use them.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)
