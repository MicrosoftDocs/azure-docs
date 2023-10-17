---
title: Metrics Advisor JavaScript quickstart
titleSuffix: Azure AI services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.topic: include
ms.date: 11/04/2022
ms.author: mbullwin
---

[Reference documentation](/java/api/overview/azure/ai-metricsadvisor-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/metricsadvisor/ai-metrics-advisor/README.md) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-metrics-advisor) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/metricsadvisor/ai-metrics-advisor/samples/v1/javascript)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [Node.js](https://nodejs.org/)
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  
* Your own SQL database with time series data.
  
> [!TIP]
> * You can find JavaScript Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/metricsadvisor/ai-metrics-advisor/samples/v1/javascript).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Select **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API. 
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
> * `https://<instance-name>.cognitiveservices.azure.com/`

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

Install the `@azure/ai-metrics-advisor` npm package:

```console
npm install @azure/ai-metrics-advisor
```

Your app's `package.json` file will be updated with the dependencies.

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

Create a file named `index.js` and copy the following code:

```javascript
/**
 *  @summary This sample demonstrates how to get started by creating a data feed, checking ingestion status,
 * creating detection and alerting configurations, and querying for alerts and anomalies.
 */

// Load the .env file if it exists
const dotenv = require("dotenv");
dotenv.config();

const {
  MetricsAdvisorKeyCredential,
  MetricsAdvisorAdministrationClient,
  MetricsAdvisorClient
} = require("@azure/ai-metrics-advisor");

async function main() {
  // You will need to set these environment variables or edit the following values
  const endpoint = process.env["METRICS_ADVISOR_ENDPOINT"] || "<service endpoint>";
  const subscriptionKey = process.env["METRICS_ADVISOR_KEY"] || "<subscription key>";
  const apiKey = process.env["METRICS_ADVISOR_API_KEY"] || "<api key>";
  const sqlServerConnectionString =
    process.env["SQL_SERVER_CONNECTION_STRING"] ||
    "<connection string to SQL Server>";
  const sqlServerQuery =
    process.env["SQL_SERVER_QUERY"] || "<SQL Server query to retrive data>";

  const credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);

  const client = new MetricsAdvisorClient(endpoint, credential);
  const adminClient = new MetricsAdvisorAdministrationClient(endpoint, credential);

  const created = await createDataFeed(adminClient, sqlServerConnectionString, sqlServerQuery);
  console.log(`Data feed created: ${created.id}`);
  console.log("  metrics: ");
  console.log(created.schema.metrics);

  console.log("Waiting for a minute before checking ingestion status...");
  await delay(60 * 1000);

  try {
    await checkIngestionStatus(
      adminClient,
      created.id,
      new Date(Date.UTC(2020, 8, 1)),
      new Date(Date.UTC(2020, 8, 12))
    );

    const metricId = created.schema.metrics[0].id;
    const detectionConfig = await configureAnomalyDetectionConfiguration(adminClient, metricId);
    console.log(`Detection configuration created: ${detectionConfig.id}`);

    const hook = await createWebhookHook(adminClient);
    console.log(`Webhook hook created: ${hook.id}`);

    const alertConfig = await configureAlertConfiguration(adminClient, detectionConfig.id, [
      hook.id
    ]);
    console.log(`Alert configuration created: ${alertConfig.id}`);

    // you can use alert configuration created in above step to query the alert.
    const alerts = await queryAlerts(
      client,
      alertConfig.id,
      new Date(Date.UTC(2020, 8, 1)),
      new Date(Date.UTC(2020, 8, 12))
    );

    if (alerts.length > 1) {
      // query anomalies using an alert id.
      await queryAnomaliesByAlert(client, alerts[0]);
    } else {
      console.log("No alerts during the time period");
    }
  } finally {
    console.log(`Deleting the data feed '${created.id}`);
    await adminClient.deleteDataFeed(created.id);
  }
}

async function createDataFeed(adminClient, sqlServerConnectionString, sqlServerQuery) {
  console.log("Creating Datafeed...");
  const dataFeed = {
    name: "test_datafeed_" + new Date().getTime().toString(),
    source: {
      dataSourceType: "SqlServer",
      connectionString: sqlServerConnectionString,
      query: sqlServerQuery,
      authenticationType: "Basic"
    },
    granularity: {
      granularityType: "Daily"
    },
    schema: {
      metrics: [
        {
          name: "revenue",
          displayName: "revenue",
          description: "Metric1 description"
        },
        {
          name: "cost",
          displayName: "cost",
          description: "Metric2 description"
        }
      ],
      dimensions: [
        { name: "city", displayName: "city display" },
        { name: "category", displayName: "category display" }
      ],
      timestampColumn: undefined
    },
    ingestionSettings: {
      ingestionStartTime: new Date(Date.UTC(2020, 5, 1)),
      ingestionStartOffsetInSeconds: 0,
      dataSourceRequestConcurrency: -1,
      ingestionRetryDelayInSeconds: -1,
      stopRetryAfterInSeconds: -1
    },
    rollupSettings: {
      rollupType: "AutoRollup",
      rollupMethod: "Sum",
      rollupIdentificationValue: "__SUM__"
    },
    missingDataPointFillSettings: {
      fillType: "SmartFilling"
    },
    accessMode: "Private",
    admins: ["xyz@microsoft.com"]
  };
  const result = await adminClient.createDataFeed(dataFeed);

  return result;
}

async function checkIngestionStatus(adminClient, datafeedId, startTime, endTime) {
  // This shows how to use for-await-of syntax to list status
  console.log("Checking ingestion status...");
  const listIterator = adminClient.listDataFeedIngestionStatus(datafeedId, startTime, endTime);
  for await (const status of listIterator) {
    console.log(`  [${status.timestamp}] ${status.status} - ${status.message}`);
  }
}

async function configureAnomalyDetectionConfiguration(adminClient, metricId) {
  console.log(`Creating an anomaly detection configuration on metric '${metricId}'...`);
  const anomalyConfig = {
    name: "test_detection_configuration" + new Date().getTime().toString(),
    metricId,
    wholeSeriesDetectionCondition: {
      smartDetectionCondition: {
        sensitivity: 100,
        anomalyDetectorDirection: "Both",
        suppressCondition: {
          minNumber: 1,
          minRatio: 1
        }
      }
    },
    description: "Detection configuration description"
  };
  return await adminClient.createDetectionConfig(anomalyConfig);
}

async function createWebhookHook(adminClient) {
  console.log("Creating a webhook hook");
  const hook = {
    hookType: "Webhook",
    name: "web hook " + new Date().getTime().toString(),
    description: "description",
    hookParameter: {
      endpoint: "https://httpbin.org/post",
      username: "user",
      password: "pass"
      // certificateKey: "k",
      // certificatePassword: "kp"
    }
  };

  return await adminClient.createHook(hook);
}

async function configureAlertConfiguration(adminClient, detectionConfigId, hookIds) {
  console.log("Creating a new alerting configuration...");
  const anomalyAlert = {
    name: "test_alert_config_" + new Date().getTime().toString(),
    crossMetricsOperator: "AND",
    metricAlertConfigurations: [
      {
        detectionConfigurationId: detectionConfigId,
        alertScope: {
          scopeType: "All"
        },
        alertConditions: {
          severityCondition: {
            minAlertSeverity: "Medium",
            maxAlertSeverity: "High"
          }
        },
        snoozeCondition: {
          autoSnooze: 0,
          snoozeScope: "Metric",
          onlyForSuccessive: true
        }
      }
    ],
    hookIds,
    description: "Alerting config description"
  };
  return await adminClient.createAlertConfig(anomalyAlert);
}

async function queryAlerts(client, alertConfigId, startTime, endTime) {
  console.log(`Listing alerts for alert configuration '${alertConfigId}'`);
  // This shows how to use `for-await-of` syntax to list alerts
  console.log("  using for-await-of syntax");
  let alerts = [];
  const listIterator = client.listAlerts(alertConfigId, startTime, endTime, "AnomalyTime");
  for await (const alert of listIterator) {
    alerts.push(alert);
    console.log("    Alert");
    console.log(`      id: ${alert.id}`);
    console.log(`      timestamp: ${alert.timestamp}`);
    console.log(`      created on: ${alert.createdOn}`);
  }
  // alternatively we could list results by pages
  console.log(`  by pages`);
  const iterator = client
    .listAlerts(alertConfigId, startTime, endTime, "AnomalyTime")
    .byPage({ maxPageSize: 2 });

  let result = await iterator.next();
  while (!result.done) {
    console.log("    -- Page -- ");
    for (const item of result.value) {
      console.log(`      id: ${item.id}`);
      console.log(`      timestamp: ${item.timestamp}`);
      console.log(`      created on: ${item.createdOn}`);
    }
    result = await iterator.next();
  }

  return alerts;
}

async function queryAnomaliesByAlert(client, alert) {
  console.log(
    `Listing anomalies for alert configuration '${alert.alertConfigId}' and alert '${alert.id}'`
  );
  const listIterator = client.listAnomaliesForAlert(alert);
  for await (const anomaly of listIterator) {
    console.log(
      `  Anomaly ${anomaly.severity} ${anomaly.status} ${anomaly.seriesKey.dimension} ${anomaly.timestamp}`
    );
  }
}

async function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

main()
  .then((_) => {
    console.log("Succeeded");
  })
  .catch((err) => {
    console.log("Error occurred:");
    console.log(err);
  });
```


### Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```
