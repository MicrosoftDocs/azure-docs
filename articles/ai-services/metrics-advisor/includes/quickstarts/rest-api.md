---
title: Metrics Advisor REST API quickstart
titleSuffix: Azure AI services
author: mrbullwinkle
manager: nitinme
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 11/04/2022
ms.author: mbullwin
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  
* [Python 3.x](https://www.python.org/)
* Your own SQL database with time series data.

## Set up

The example code for this quickstart will show you how to call the REST API using Python. For specific REST API calls, consult [GitHub Samples](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cognitiveservices/data-plane/MetricsAdvisor/stable/v1.0/examples)

> [!TIP]
> * It may 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Select **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API. 
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. it will look like this:
> * `https://<instance-name>.cognitiveservices.azure.com/`

## Environment variables

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `METRICS_ADVISOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `METRICS_ADVISOR_KEY` | The key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`METRICS_ADVISOR_API_KEY` |The key value can be found under **Settings** >  **API keys** when examining your resource from the [Metrics Advisor portal](https://metricsadvisor.azurewebsites.net/). You can use either `KEY1` or `KEY2`.  |
|`SQL_CONNECTION_STRING` | This quickstart requires you to have your own SQL Database + connection string. An example connection string would look similar to the following example:`Data Source=<Server>;Initial Catalog=<db-name>;User ID=<user-name>;Password=<password>` for more information on constructing SQL connection strings, see the [SQL documentation](../../data-feeds-from-different-sources.md#azure-sql-database--sql-server).  |
|`SQL_QUERY`| Unique query specific to your dataset.|

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx METRICS_ADVISOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
setx METRICS_ADVISOR_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx METRICS_ADVISOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx SQL_CONNECTION_STRING "REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" 
setx SQL_QUERY "REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_CONNECTION_STRING', 'REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_QUERY', 'REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export METRICS_ADVISOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export SQL_CONNECTION_STRING="REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" >> /etc/environment && source /etc/environment
echo export SQL_QUERY="REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" >> /etc/environment && source /etc/environment
```

---

## Create your application

```python
import requests
import json
import time


def add_data_feed(endpoint, subscription_key, api_key):
    url = endpoint + '/dataFeeds'
    data_feed_body = {
        "dataSourceType": "SqlServer",
        "dataFeedName": "test_data_feed_00000001",
        "dataFeedDescription": "",
        "dataSourceParameter": {
            "connectionString": os.environ['SQL_CONNECTION_STRING'],
            "query": os.environ['SQL_QUERY']
        },
        "granularityName": "Daily",
        "granularityAmount": 0,
        "metrics": [
            {
                "metricName": "revenue",
                "metricDisplayName": "revenue",
                "metricDescription": ""
            },
            {
                "metricName": "cost",
                "metricDisplayName": "cost",
                "metricDescription": ""
            }
        ],
        "dimension": [
            {
                "dimensionName": "city",
                "dimensionDisplayName": "city"
            },
            {
                "dimensionName": "category",
                "dimensionDisplayName": "category"
            }
        ],
        "timestampColumn": "timestamp",
        "dataStartFrom": "2020-06-01T00:00:00.000Z",
        "startOffsetInSeconds": 0,
        "maxConcurrency": -1,
        "minRetryIntervalInSeconds": -1,
        "stopRetryAfterInSeconds": -1,
        "allUpIdentification": "__SUM__",
        "needRollup": "AlreadyRollup",
        "fillMissingPointType": "SmartFilling",
        "fillMissingPointValue": 0,
        "viewMode": "Private",
        "admins": [
            "admin@contoso.com"
        ],
        "viewers": [
        ],
        "actionLinkTemplate": ""
    }
    res = requests.post(url, data=json.dumps(data_feed_body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 201:
        raise RuntimeError("add_data_feed failed " + res.text)
    else:
        print("add_data_feed success " + res.text)
    return res.headers['Location']


def check_ingestion_latest_status(endpoint, subscription_key, api_key, datafeed_id):
    url = endpoint + '/dataFeeds/{}/ingestionProgress'.format(datafeed_id)
    res = requests.get(url, headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                     'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("check_ingestion_latest_status failed " + res.text)
    else:
        print("check_ingestion_latest_status success " + res.text)


def check_ingestion_detail_status(endpoint, subscription_key, api_key, datafeed_id, start_time, end_time):
    url = endpoint + '/dataFeeds/{}/ingestionStatus/query'.format(datafeed_id)
    ingestion_detail_status_body = {
      "startTime": start_time,
      "endTime": end_time
    }
    res = requests.post(url, data=json.dumps(ingestion_detail_status_body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("check_ingestion_detail_status failed " + res.text)
    else:
        print("check_ingestion_detail_status success " + res.text)


def create_detection_config(endpoint, subscription_key, api_key, metric_id):
    url = endpoint + '/enrichment/anomalyDetection/configurations'
    detection_config_body = {
        "name": "test_detection_config0000000001",
        "description": "string",
        "metricId": metric_id,
        "wholeMetricConfiguration": {
            "smartDetectionCondition": {
                "sensitivity": 100,
                "anomalyDetectorDirection": "Both",
                "suppressCondition": {
                    "minNumber": 1,
                    "minRatio": 1
                }
            }
        },
        "dimensionGroupOverrideConfigurations": [
        ],
        "seriesOverrideConfigurations": [
        ]
    }
    res = requests.post(url, data=json.dumps(detection_config_body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 201:
        raise RuntimeError("create_detection_config failed " + res.text)
    else:

        print("create_detection_config success " + res.text)
    return res.headers['Location']


def create_web_hook(endpoint, subscription_key, api_key):
    url = endpoint + '/hooks'
    web_hook_body = {
        "hookType": "Webhook",
        "hookName": "test_web_hook000001",
        "description": "",
        "externalLink": "",
        "hookParameter": {
            "endpoint": "https://www.contoso.com",
            "username": "",
            "password": ""
        }
    }
    res = requests.post(url, data=json.dumps(web_hook_body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 201:
        raise RuntimeError("create_web_hook failed " + res.text)
    else:
        print("create_web_hook success " + res.text)
    return res.headers['Location']


def create_alert_config(endpoint, subscription_key, api_key, anomaly_detection_configuration_id, hook_id):
    url = endpoint + '/alert/anomaly/configurations'
    web_hook_body = {
        "name": "test_alert_config00000001",
        "description": "",
        "crossMetricsOperator": "AND",
        "hookIds": [
           hook_id
        ],
        "metricAlertingConfigurations": [
            {
                "anomalyDetectionConfigurationId": anomaly_detection_configuration_id,
                "anomalyScopeType": "All",
                "severityFilter": {
                    "minAlertSeverity": "Low",
                    "maxAlertSeverity": "High"
                },
                "snoozeFilter": {
                    "autoSnooze": 0,
                    "snoozeScope": "Metric",
                    "onlyForSuccessive": True
                },
            }
        ]
    }
    res = requests.post(url, data=json.dumps(web_hook_body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 201:
        raise RuntimeError("create_alert_config failed " + res.text)
    else:
        print("create_alert_config success " + res.text)
    return res.headers['Location']


def query_alert_by_alert_config(endpoint, subscription_key, api_key, alert_config_id, start_time, end_time):
    url = endpoint + '/alert/anomaly/configurations/{}/alerts/query'.format(alert_config_id)
    alerts_body = {
        "startTime": start_time,
        "endTime": end_time,
        "timeMode": "AnomalyTime"
    }
    res = requests.post(url, data=json.dumps(alerts_body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("query_alert_by_alert_config failed " + res.text)
    else:
        print("query_alert_by_alert_config success " + res.text)
    return [item['alertId'] for item in json.loads(res.content)['value']]


def query_anomaly_by_alert(endpoint, subscription_key, api_key, alert_config_id, alert_id):
    url = endpoint + '/alert/anomaly/configurations/{}/alerts/{}/anomalies'.format(alert_config_id, alert_id)
    res = requests.get(url,
                       headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("query_anomaly_by_alert failed " + res.text)
    else:
        print("query_anomaly_by_alert success " + res.text)
    return json.loads(res.content)


def query_incident_by_alert(endpoint, subscription_key, api_key, alert_config_id, alert_id):
    url = endpoint + '/alert/anomaly/configurations/{}/alerts/{}/incidents'.format(alert_config_id, alert_id)
    res = requests.get(url,
                       headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("query_incident_by_alert failed " + res.text)
    else:
        print("query_incident_by_alert success " + res.text)
    return json.loads(res.content)


def query_root_cause_by_incident(endpoint, subscription_key, api_key, detection_config_id, incident_id):
    url = endpoint + '/enrichment/anomalyDetection/configurations/{}/incidents/{}/rootCause'.format(detection_config_id, incident_id)
    res = requests.get(url,
                       headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("query_root_cause_by_incident failed " + res.text)
    else:
        print("query_root_cause_by_incident success " + res.text)
    return json.loads(res.content)


def query_anomaly_by_detection_config(endpoint, subscription_key, api_key, detection_config_id, start_time, end_time):
    url = endpoint + '/enrichment/anomalyDetection/configurations/{}/anomalies/query'.format(detection_config_id)
    body = {
        "startTime": start_time,
        "endTime": end_time,
        "filter": {
            "dimensionFilter": [
            ],
            "severityFilter": {
              "min": "Low",
              "max": "High"
            }
          }
    }
    res = requests.post(url, data=json.dumps(body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("query_anomaly_by_detection_config failed " + res.text)
    else:
        print("query_anomaly_by_detection_config success " + res.text)
    return json.loads(res.content)


def query_incident_by_detection_config(endpoint, subscription_key, api_key, detection_config_id, start_time, end_time):
    url = endpoint + '/enrichment/anomalyDetection/configurations/{}/incidents/query'.format(detection_config_id)
    body = {
        "startTime": start_time,
        "endTime": end_time,
        "filter": {
            "dimensionFilter": [
            ],
        }
    }
    res = requests.post(url, data=json.dumps(body),
                        headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                 'x-api-key': api_key})
    if res.status_code != 200:
        raise RuntimeError("query_incident_by_detection_config failed " + res.text)
    else:
        print("query_incident_by_detection_config success " + res.text)
    return json.loads(res.content)


if __name__ == '__main__':
    # Example endpoint: https://[placeholder].cognitiveservices.azure.com/metricsadvisor/v1.0
    endpoint = os.environ['METRICS_ADVISOR_ENDPOINT'] + "metricsadvisor/v1.0"
    subscription_key = os.environ['METRICS_ADVISOR_KEY']
    api_key = os.environ['METRICS_ADVISOR_API_KEY']

    '''
    First part
    1.onboard datafeed
    2.check datafeed latest status
    3.check datafeed status details
    4.create detection config
    5.create webhook
    6.create alert config
    '''
    datafeed_resource_url = add_data_feed(endpoint, subscription_key, api_key)
    print(datafeed_resource_url)

    # datafeed_id and metrics_id can get from datafeed_resource_url
    datafeed_info = json.loads(requests.get(url=datafeed_resource_url,
                                            headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                                     'x-api-key': api_key}).content)
    print(datafeed_info)
    datafeed_id = datafeed_info['dataFeedId']
    metrics_id = []
    for metrics in datafeed_info['metrics']:
        metrics_id.append(metrics['metricId'])
    time.sleep(60)

    check_ingestion_latest_status(endpoint, subscription_key, api_key, datafeed_id)

    check_ingestion_detail_status(endpoint, subscription_key, api_key, datafeed_id,
                                  "2020-06-01T00:00:00Z", "2020-07-01T00:00:00Z")

    detection_config_resource_url = create_detection_config(endpoint, subscription_key, api_key, metrics_id[0])
    print(detection_config_resource_url)

    # anomaly_detection_configuration_id can get from detection_config_resource_url
    detection_config = json.loads(requests.get(url=detection_config_resource_url,
                                               headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                                        'x-api-key': api_key}).content)
    print(detection_config)
    anomaly_detection_configuration_id = detection_config['anomalyDetectionConfigurationId']

    webhook_resource_url = create_web_hook(endpoint, subscription_key, api_key)
    print(webhook_resource_url)

    # hook_id can get from webhook_resource_url
    webhook = json.loads(requests.get(url=webhook_resource_url,
                                      headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                               'x-api-key': api_key}).content)
    print(webhook)
    hook_id = webhook['hookId']

    alert_config_resource_url = create_alert_config(endpoint, subscription_key, api_key,
                                                    anomaly_detection_configuration_id, hook_id)

    # anomaly_alerting_configuration_id can get from alert_config_resource_url
    alert_config = json.loads(requests.get(url=alert_config_resource_url,
                                           headers={'Ocp-Apim-Subscription-Key': subscription_key,
                                                    'x-api-key': api_key}).content)
    print(alert_config)
    anomaly_alerting_configuration_id = alert_config['anomalyAlertingConfigurationId']
```
