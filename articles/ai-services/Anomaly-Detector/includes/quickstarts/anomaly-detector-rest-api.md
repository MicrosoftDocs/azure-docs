---
author: mrbullwinkle
ms.service: azure-ai-anomaly-detector
ms.topic: include
ms.date: 10/06/2022
ms.author: mbullwin
ms.custom: engagement-fy23
---

In this quickstart, you learn how to detect anomalies in a batch of time series data using the Anomaly Detector service and cURL.

For a high-level look at Anomaly Detector concepts, see the [overview](../../overview.md) article.

## Prerequisites

* An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* A valid JSON file of time series data to test for anomalies. If you don't have your own file, you can create a sample.json file from the <a href="https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect" target="_blank">Request body sample</a>

## Retrieve key and endpoint

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `ANOMALY_DETECTOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `ANOMALY_DETECTOR_API_KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

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

## Detect anomalies

At a command prompt, run the following command. You'll need to insert the following values into the command.
- Your Anomaly detector service subscription key.
- Your Anomaly detector endpoint address. 
- A valid JSON file of time series data to test for anomalies. If you don't have your own file, you can create a sample.json file from the [Request body sample](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect).

```cmd
curl -v POST "%ANOMALY_DETECTOR_ENDPOINT%/anomalydetector/v1.0/timeseries/entire/detect"
-H "Content-Type: application/json"
-H "Ocp-Apim-Subscription-Key: %ANOMALY_DETECTOR_API_KEY%"
-d "@path_to_sample_file.json" 
```

An example of the full command as a single line:

```cmd
curl -v POST "%ANOMALY_DETECTOR_ENDPOINT%/anomalydetector/v1.0/timeseries/entire/detect" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: %ANOMALY_DETECTOR_API_KEY%" -d "@c:\test\rest.json"
```

Alternatively if you're running the cURL command from a Bash shell your command would be slightly different:

```bash
curl -v POST "$ANOMALY_DETECTOR_ENDPOINT/anomalydetector/v1.0/timeseries/entire/detect" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: $ANOMALY_DETECTOR_API_KEY" -d "@c:\test\rest.json"
```

If you used the sample data from the pre-requisites, you should receive a response 200 with the following results:

```json
{
  "expectedValues": [
    827.7940908243968,
    798.9133774671927,
    888.6058431807189,
    900.5606407986661,
    962.8389426378304,
    933.2591606306954,
    891.0784104799666,
    856.1781601363697,
    809.8987227908941,
    807.375129007505,
    764.3196682448518,
    803.933498594564,
    823.5900620883058,
    794.0905641334288,
    883.164245249282,
    894.8419000690953,
    956.8430591101258,
    927.6285055190114,
    885.812983784303,
    851.6424797402517,
    806.0927886943216,
    804.6826815312029,
    762.74070738882,
    804.0251702513732,
    825.3523662579559,
    798.0404188724976,
    889.3016505577698,
    902.4226124345937,
    965.867078532635,
    937.3200495736695,
    896.1720524711102,
    862.0087368413656,
    816.4662342097423,
    814.4297745524709,
    771.8614479159354,
    811.859271346729,
    831.8998279215521,
    802.947544797165,
    892.5684407435083,
    904.5488214533809,
    966.8527063844707,
    937.3168391003043,
    895.180003672544,
    860.3649596356635,
    814.1707285969043,
    811.9054862686213,
    769.1083769610742,
    809.2328084659704
  ],
  "upperMargins": [
    41.389704541219835,
    39.94566887335964,
    44.43029215903594,
    45.02803203993331,
    48.14194713189152,
    46.66295803153477,
    44.55392052399833,
    42.808908006818484,
    40.494936139544706,
    40.36875645037525,
    38.215983412242586,
    40.196674929728196,
    41.17950310441529,
    39.70452820667144,
    44.1582122624641,
    44.74209500345477,
    47.84215295550629,
    46.38142527595057,
    44.290649189215145,
    42.58212398701258,
    40.30463943471608,
    40.234134076560146,
    38.137035369441,
    40.201258512568664,
    41.267618312897795,
    39.90202094362488,
    44.46508252788849,
    45.121130621729684,
    48.29335392663175,
    46.86600247868348,
    44.80860262355551,
    43.100436842068284,
    40.82331171048711,
    40.721488727623544,
    38.593072395796774,
    40.59296356733645,
    41.5949913960776,
    40.14737723985825,
    44.62842203717541,
    45.227441072669045,
    48.34263531922354,
    46.86584195501521,
    44.759000183627194,
    43.01824798178317,
    40.70853642984521,
    40.59527431343106,
    38.45541884805371,
    40.46164042329852
  ],
  "lowerMargins": [
    41.389704541219835,
    39.94566887335964,
    44.43029215903594,
    45.02803203993331,
    48.14194713189152,
    46.66295803153477,
    44.55392052399833,
    42.808908006818484,
    40.494936139544706,
    40.36875645037525,
    38.215983412242586,
    40.196674929728196,
    41.17950310441529,
    39.70452820667144,
    44.1582122624641,
    44.74209500345477,
    47.84215295550629,
    46.38142527595057,
    44.290649189215145,
    42.58212398701258,
    40.30463943471608,
    40.234134076560146,
    38.137035369441,
    40.201258512568664,
    41.267618312897795,
    39.90202094362488,
    44.46508252788849,
    45.121130621729684,
    48.29335392663175,
    46.86600247868348,
    44.80860262355551,
    43.100436842068284,
    40.82331171048711,
    40.721488727623544,
    38.593072395796774,
    40.59296356733645,
    41.5949913960776,
    40.14737723985825,
    44.62842203717541,
    45.227441072669045,
    48.34263531922354,
    46.86584195501521,
    44.759000183627194,
    43.01824798178317,
    40.70853642984521,
    40.59527431343106,
    38.45541884805371,
    40.46164042329852
  ],
  "isAnomaly": [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ],
  "isPositiveAnomaly": [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ],
  "isNegativeAnomaly": [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ],
  "period": 12
}

```

For more information, see the [Anomaly Detection REST reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect).


[!INCLUDE [anomaly-detector-next-steps](../quickstart-cleanup-next-steps.md)]
