---
title: Anomaly Detector JavaScript client library quickstart
titleSuffix: Azure AI services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/14/2023
ms.author: mbullwin
ms.custom: devx-track-js
---

<a href="https://go.microsoft.com/fwlink/?linkid=2090788" target="_blank">Library reference documentation</a> |<a href="https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector" target="_blank">Library source code</a> | <a href="https://www.npmjs.com/package/%40azure/ai-anomaly-detector" target="_blank">Package (npm)</a> |<a href="https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/AnomalyDetector" target="_blank">Find the sample code on GitHub</a>

Get started with the Anomaly Detector client library for JavaScript. Follow these steps to install the package, and start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting model on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for JavaScript to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

## Prerequisites

* An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
* The current version of <a href="https://nodejs.org/" target="_blank">Node.js</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button.
    * You'll need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll use the key and endpoint to create environment variables.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Create a `package.json` file with the following contents:

```json
{
  "dependencies": {
    "@azure/ai-anomaly-detector": "next",
    "@azure-rest/ai-anomaly-detector": "next",
    "@azure/core-auth": "^1.3.0",
    "csv-parse": "^5.3.0"
  }
}
```

### Install the client library

Install the required npm packages by running the following from the same directory as your package.json file:

```console
npm install
```

## Retrieve key and endpoint

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `ANOMALY_DETECTOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `ANOMALY_DETECTOR_API_KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`datapath` | This quickstart uses the `request-data.csv` file that can be downloaded from our [GitHub sample data](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv).

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
const AnomalyDetector = require("@azure-rest/ai-anomaly-detector").default,
  { isUnexpected } = require("@azure-rest/ai-anomaly-detector");
const { AzureKeyCredential } = require("@azure/core-auth");

const { parse } = require("csv-parse/sync");
const fs = require("fs");

// You will need to set this environment variables or edit the following values
const apiKey = process.env["ANOMALY_DETECTOR_API_KEY"] || "";
const endpoint = process.env["ANOMALY_DETECTOR_ENDPOINT"] || "";
const timeSeriesDataPath = "./request-data.csv";

function read_series_from_file(path) {
  let result = Array();
  let input = fs.readFileSync(path).toString();
  let parsed = parse(input, { skip_empty_lines: true });
  parsed.forEach(function (e) {
    result.push({ timestamp: new Date(e[0]), value: Number(e[1]) });
  });
  return result;
}

async function main() {
  // create client
  const credential = new AzureKeyCredential(apiKey);
  const client = AnomalyDetector(endpoint, credential);

  // construct request
  const options = {
    body: {
      granularity: "daily",
      imputeMode: "auto",
      maxAnomalyRatio: 0.25,
      sensitivity: 95,
      series: read_series_from_file(timeSeriesDataPath),
    },
    headers: { "Content-Type": "application/json" },
  };

  // get last detect result
  const result = await client.path("/timeseries/entire/detect").post(options);
  if (isUnexpected(result)) {
    throw result;
  }

  if (result.body.isAnomaly) {
    result.body.isAnomaly.forEach(function (anomaly, index) {
      if (anomaly === true) {
        console.log(index);
      }
    });
  } else {
    console.log("There is no anomaly detected from the series.");
  }

}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };
```

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

### Output

```console
Anomalies were detected from the series at index:
3
18
21
22
23
24
25
28
29
30
31
32
35
44
```

### Understanding your results

In the code above, we call the Anomaly Detector API to detect anomalies through the entire time series as a batch with the client's [detectEntireSeries()](/javascript/api/@azure/ai-anomaly-detector/anomalydetectorclient?view=azure-node-preview#@azure-ai-anomaly-detector-anomalydetectorclient-detectentireseries&preserve-view=true) method. We store the returned [AnomalyDetectorDetectEntireSeriesResponse](/javascript/api/@azure/ai-anomaly-detector/anomalydetectordetectentireseriesresponse?view=azure-node-preview&preserve-view=true) object. Then we iterate through the response's `isAnomaly` list, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You also may want to consider [deleting the environment variables](/powershell/module/microsoft.powershell.core/about/about_environment_variables#using-the-environment-provider-and-item-cmdlets) you created if you no longer intend to use them.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)
