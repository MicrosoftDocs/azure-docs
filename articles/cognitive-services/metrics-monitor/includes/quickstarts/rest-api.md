---
title: Metrics Monitor REST API quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: metrics-advisor
ms.topic: include
ms.date: 08/19/2020
ms.author: aahi
---
    
> [!TIP] 
> Looking for example code that uses the REST API? You can find a Python sample on [GitHub](https://github.com/Azure-Samples/cognitive-services-rest-api-samples/).

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a [Product Name] resource"  target="_blank">create a [Product Name] resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to [Product Name]. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* The current version of [cURL](https://curl.haxx.se/). Several command-line switches are used in the quickstarts, which are noted in the [cURL documentation](https://curl.haxx.se/docs/manpage.html).

> [!CAUTION]
> The following BASH examples use the `\` line continuation character. If you console or terminal uses a different line continuation character, use this character.

## Add a data feed from a sample or data source

To start monitoring your time series data, you need add a data feed. To add a data feed, you need to provide a data schema according to the data source type and parameters. Save the below JSON request body to a file named *body.json*, and run the cURL command.

```json
{
  "dataSourceParameter": {
    "connectionString": "Server=ad-sample.database.windows.net,1433;Initial Catalog=ad-sample;Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
    "query": "select * from adsample2 where Timestamp = @StartTime"
  },
  "datafeedId": "00000000-0000-0000-0000-000000000000",
  "datafeedName": "Datafeed dummy name",
  "metrics": [
    {
      "metricName": "cost",
      "metricDisplayName": "cost",
      "metricDescription": ""
    },
    {
      "metricName": "revenue",
      "metricDisplayName": "revenue",
      "metricDescription": ""
    }
  ],
  "dimension": [
    {
      "dimensionName": "category",
      "dimensionDisplayName": "category"
    },
    {
      "dimensionName": "city",
      "dimensionDisplayName": "city"
    }
  ],
  "dataStartFrom": "2019-10-01T00:00:00.0000000+00:00",
  "dataSourceType": "SqlServer",
  "timestampColumn": "timestamp",
  "startOffsetInSeconds": 86400,
  "maxQueryPerMinute": 30,
  "granularityName": 3,
  "granularityAmount": null,
  "allUpIdentification": "__SUM__",
  "needRollup": "NeedRollup",
  "fillMissingPointType": "PreviousValue",
  "fillMissingPointValue": 0,
  "rollUpMethod": "Sum",
  "stopRetryAfterInSeconds": 604800,
  "rollUpColumns": "",
  "minRetryIntervalInSeconds": 3600,
  "maxConcurrency": 30,
  "datafeedDescription": "",
  "viewMode": "Private",
  "admins": [
    "example@demo.com"
  ],
  "viewers": [ ],
  "creator": "example@demo.com",
  "status": "Active",
  "createdTime": "2020-03-27T14:00:15.0000000+00:00",
  "isAdmin": true,
  "actionLinkTemplate": ""
}
```

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values.

```bash
curl https://REPLACE-WITH-YOUR-ENDPOINT/anomalydetector-ee/v1.0/datafeeds \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-d @body.json
```

## Check ingestion status

After adding data feed, if you want to check the progress of an ingestion job, you can check the status of it. Save the below JSON request body to a file named *body.json*, and run the cURL command.

```json
{
  "startTime": "2020-01-01T00:00:00.0000000+00:00",
  "endTime": "2020-01-04T00:00:00.0000000+00:00"
}
```

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values and size of JSON.


```bash
curl https://REPLACE-WITH-YOUR-ENDPOINT/anomalydetector-ee/v1.0/datafeeds/REPLACE-WITH-YOUR-DATA-FEED-ID/ingestionStatus/query \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-d @body.json
```

#### Example response

```json
{
  "@nextLink": "https://demo.example.com/datafeeds/01234567-8901-2345-6789-012345678901/ingestionStatus/query?$skip=3&$top=1",
  "value": [
    {
      "timestamp": "2020-01-03T00:00:00.0000000+00:00",
      "status": "0",
      "message": ""
    },
    {
      "timestamp": "2020-01-02T00:00:00.0000000+00:00",
      "status": "3",
      "message": ""
    },
    {
      "timestamp": "2020-01-01T00:00:00.0000000+00:00",
      "status": "4",
      "message": "No valid record pulled from source for current timestamp 2020-01-01T00:00:00Z"
    }
  ]
}
```

##	Configure anomaly detection configuration and alert configuration

While a default configuration is automatically applied to each metric, you can tune the detection modes used on your data. Save the below JSON request body to a file named *body.json*, and run the cURL command.

```json
{
  "name": "string",
  "description": "string",
  "metricId": "string",
  "wholeMetricConfiguration": {
    "conditionOperator": "AND",
    "smartDetectionCondition": {
      "sensitivity": 0.0,
      "boundaryVersion": 0,
      "anomalyDetectorDirection": "Both",
      "suppressCondition": {
        "minNumber": 0,
        "minRatio": 0.0
      }
    },
    "hardThresholdCondition": {
      "lowerBound": 0.0,
      "upperBound": 0.0,
      "anomalyDetectorDirection": "Both",
      "suppressCondition": {
        "minNumber": 0,
        "minRatio": 0.0
      }
    },
    "changeThresholdCondition": {
      "changePercentage": 0.0,
      "shiftPoint": 0,
      "anomalyDetectorDirection": "Both",
      "suppressCondition": {
        "minNumber": 0,
        "minRatio": 0.0
      }
    }
  },
  "dimensionGroupOverrideConfigurations": [
    {
      "group": {
        "dimension": {}
      },
      "conditionOperator": "AND",
      "smartDetectionCondition": {
        "sensitivity": 0.0,
        "boundaryVersion": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "hardThresholdCondition": {
        "lowerBound": 0.0,
        "upperBound": 0.0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "changeThresholdCondition": {
        "changePercentage": 0.0,
        "shiftPoint": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      }
    }
  ],
  "seriesOverrideConfigurations": [
    {
      "series": {
        "dimension": {}
      },
      "conditionOperator": "AND",
      "smartDetectionCondition": {
        "sensitivity": 0.0,
        "boundaryVersion": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "hardThresholdCondition": {
        "lowerBound": 0.0,
        "upperBound": 0.0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      },
      "changeThresholdCondition": {
        "changePercentage": 0.0,
        "shiftPoint": 0,
        "anomalyDetectorDirection": "Both",
        "suppressCondition": {
          "minNumber": 0,
          "minRatio": 0.0
        }
      }
    }
  ],
  "favoriteSeries": [
    {
      "dimension": {}
    }
  ]
}
```

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values and size of JSON.

```bash
curl https://REPLACE-WITH-YOUR-ENDPOINT/anomalydetector-ee/v1.0/enrichment/anomalyDetection/configurations \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-d @body.json
```

###	Query anomaly detection results

Use the REST APIs to query anomalies under anomaly detection configuration.In fact, there are various ways to get anomaly detection result. For more diagnostic tools please refer to how-to section. Save the below JSON request body to a file named *body.json*, and run the cURL command.

```json
{
  "startTime": "string",
  "endTime": "string",
  "filter": {
    "dimensionFilter": [
      {
        "dimension": {}
      }
    ],
    "severityFilter": {
      "min": "Low",
      "max": "Low"
    }
  }
}
```

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values and size of JSON. 

```bash
curl https://REPLACE-WITH-YOUR-ENDPOINT/anomalydetector-ee/v1.0/enrichment/anomalyDetection/configurations/{configurationId}/anomalies/query \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-d @body.json
```
