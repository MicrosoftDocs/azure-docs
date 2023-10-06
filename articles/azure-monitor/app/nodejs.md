---
title: Monitor Node.js services with Application Insights | Microsoft Docs
description: Monitor performance and diagnose problems in Node.js services with Application Insights.
ms.topic: conceptual
ms.date: 09/12/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Monitor your Node.js services and apps with Application Insights

[Application Insights](./app-insights-overview.md) monitors your components after deployment to discover performance and other issues. You can use Application Insights for Node.js services that are hosted in your datacenter, Azure VMs and web apps, and even in other public clouds.

To receive, store, and explore your monitoring data, include the SDK in your code. Then set up a corresponding Application Insights resource in Azure. The SDK sends data to that resource for further analysis and exploration.

The Node.js client library can automatically monitor incoming and outgoing HTTP requests, exceptions, and some system metrics. Beginning in version 0.20, the client library also can monitor some common [third-party packages](https://github.com/microsoft/node-diagnostic-channel/tree/master/src/diagnostic-channel-publishers#currently-supported-modules), like MongoDB, MySQL, and Redis. All events related to an incoming HTTP request are correlated for faster troubleshooting.

You can use the TelemetryClient API to manually instrument and monitor more aspects of your app and system. We describe the TelemetryClient API in more detail later in this article.

> [!NOTE]
> An [OpenTelemetry-based Node.js offering](opentelemetry-enable.md?tabs=nodejs) is available. [Learn more](opentelemetry-overview.md).

## Get started

Complete the following tasks to set up monitoring for an app or service.

### Prerequisites

Before you begin, make sure that you have an Azure subscription, or [get a new one for free][azure-free-offer]. If your organization already has an Azure subscription, an administrator can follow [these instructions][add-aad-user] to add you to it.

[azure-free-offer]: https://azure.microsoft.com/free/
[add-aad-user]: ../../active-directory/fundamentals/add-users-azure-active-directory.md

### <a name="resource"></a> Set up an Application Insights resource

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Create an [Application Insights resource](create-workspace-resource.md).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### <a name="sdk"></a> Set up the Node.js client library

Include the SDK in your app so that it can gather data.

1. Copy your resource's connection string from your new resource. Application Insights uses the connection string to map data to your Azure resource. Before the SDK can use your connection string, you must specify the connection string in an environment variable or in your code.

   :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows the Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

1. Add the Node.js client library to your app's dependencies via `package.json`. From the root folder of your app, run:

   ```bash
   npm install applicationinsights --save
   ```

    > [!NOTE]
    > If you're using TypeScript, don't install separate "typings" packages. This NPM package contains built-in typings.

1. Explicitly load the library in your code. Because the SDK injects instrumentation into many other libraries, load the library as early as possible, even before other `require` statements.

   ```javascript
   let appInsights = require('applicationinsights');
   ```
1. You also can provide a connection string via the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`, instead of passing it manually to `setup()` or `new appInsights.TelemetryClient()`. This practice lets you keep connection strings out of committed source code, and you can specify different connection strings for different environments. To manually configure, call `appInsights.setup('[your connection string]');`.

    For more configuration options, see the following sections.

    You can try the SDK without sending telemetry by setting `appInsights.defaultClient.config.disableAppInsights = true`.

1. Start automatically collecting and sending data by calling `appInsights.start();`.

> [!NOTE]
> As part of using Application Insights instrumentation, we collect and send diagnostic data to Microsoft. This data helps us run and improve Application Insights. You have the option to disable non-essential data collection. [Learn more](./statsbeat.md).

### <a name="monitor"></a> Monitor your app

The SDK automatically gathers telemetry about the Node.js runtime and some common third-party modules. Use your application to generate some of this data.

Then, in the [Azure portal](https://portal.azure.com) go to the Application Insights resource that you created earlier. In the **Overview timeline**, look for your first few data points. To see more detailed data, select different components in the charts.

To view the topology that's discovered for your app, you can use [Application Map](app-map.md).

#### No data

Because the SDK batches data for submission, there might be a delay before items appear in the portal. If you don't see data in your resource, try some of the following fixes:

* Continue to use the application. Take more actions to generate more telemetry.
* Select **Refresh** in the portal resource view. Charts periodically refresh on their own, but manually refreshing forces them to refresh immediately.
* Verify that [required outgoing ports](./ip-addresses.md) are open.
* Use [Search](./diagnostic-search.md) to look for specific events.
* Check the [FAQ][FAQ].

## Basic usage

For out-of-the-box collection of HTTP requests, popular third-party library events, unhandled exceptions, and system metrics:

```javascript

let appInsights = require("applicationinsights");
appInsights.setup("[your connection string]").start();

```

> [!NOTE]
> If the connection string is set in the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`, `.setup()` can be called with no arguments. This makes it easy to use different connection strings for different environments.

Load the Application Insights library `require("applicationinsights")` as early as possible in your scripts before you load other packages. This step is needed so that the Application Insights library can prepare later packages for tracking. If you encounter conflicts with other libraries doing similar preparation, try loading the Application Insights library afterwards.

Because of the way JavaScript handles callbacks, more work is necessary to track a request across external dependencies and later callbacks. By default, this extra tracking is enabled. Disable it by calling `setAutoDependencyCorrelation(false)` as described in the [SDK configuration](#sdk-configuration) section.

## Migrate from versions prior to 0.22

There are breaking changes between releases prior to version 0.22 and after. These changes are designed to bring consistency with other Application Insights SDKs and allow future extensibility.

In general, you can migrate with the following actions:

- Replace references to `appInsights.client` with `appInsights.defaultClient`.
- Replace references to `appInsights.getClient()` with `new appInsights.TelemetryClient()`.
- Replace all arguments to client.track* methods with a single object containing named properties as arguments. See your IDE's built-in type hinting or [TelemetryTypes](https://github.com/Microsoft/ApplicationInsights-node.js/tree/develop/Declarations/Contracts/TelemetryTypes) for the excepted object for each type of telemetry.

If you access SDK configuration functions without chaining them to `appInsights.setup()`, you can now find these functions at `appInsights.Configurations`. An example is `appInsights.Configuration.setAutoCollectDependencies(true)`. Review the changes to the default configuration in the next section.

## SDK configuration

The `appInsights` object provides many configuration methods. They're listed in the following snippet with their default values.

```javascript
let appInsights = require("applicationinsights");
appInsights.setup("<connection_string>")
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();
```

To fully correlate events in a service, be sure to set `.setAutoDependencyCorrelation(true)`. With this option set, the SDK can track context across asynchronous callbacks in Node.js.

Review their descriptions in your IDE's built-in type hinting or [applicationinsights.ts](https://github.com/microsoft/ApplicationInsights-node.js/blob/develop/applicationinsights.ts) for detailed information and optional secondary arguments.

> [!NOTE]
> By default, `setAutoCollectConsole` is configured to *exclude* calls to `console.log` and other console methods. Only calls to supported third-party loggers (for example, winston and bunyan) will be collected. You can change this behavior to include calls to `console` methods by using `setAutoCollectConsole(true, true)`.

### Sampling

By default, the SDK sends all collected data to the Application Insights service. If you want to enable sampling to reduce the amount of data, set the `samplingPercentage` field on the `config` object of a client. Setting `samplingPercentage` to 100 (the default) means all data will be sent, and 0 means nothing will be sent.

If you're using automatic correlation, all data associated with a single request is included or excluded as a unit.

Add code such as the following to enable sampling:

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("<connection_string>");
appInsights.defaultClient.config.samplingPercentage = 33; // 33% of all telemetry will be sent to Application Insights
appInsights.start();
```

### Multiple roles for multi-component applications

In some scenarios, your application might consist of multiple components that you want to instrument all with the same connection string. You want to still see these components as separate units in the portal, as if they were using separate connection strings. An example is separate nodes on Application Map. You need to manually configure the `RoleName` field to distinguish one component's telemetry from other components that send data to your Application Insights resource.

Use the following code to set the `RoleName` field:

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("<connection_string>");
appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "MyRoleName";
appInsights.start();
```

### Automatic web Instrumentation[Preview]

 Automatic web Instrumentation can be enabled for node server via JavaScript (Web) SDK Loader Script injection by configuration.

```javascript
let appInsights = require("applicationinsights");
appInsights.setup("<connection_string>")
    .enableWebInstrumentation(true)
    .start();
```

or by setting environment variable `APPLICATIONINSIGHTS_WEB_INSTRUMENTATION_ENABLED = true`.

Web Instrumentation is enabled on node server responses when all of the following requirements are met:

- Response has status code `200`.
- Response method is `GET`.
- Server response has `Content-Type` html.
- Server response contains both `<head>` and `</head>` Tags.
- If response is compressed, it must have only one `Content-Encoding` type, and encoding type must be one of `gzip`, `br` or `deflate`.
- Response does not contain current /backup web Instrumentation CDN endpoints.  (current and backup Web Instrumentation CDN endpoints [here](https://github.com/microsoft/ApplicationInsights-JS#active-public-cdn-endpoints))

web Instrumentation CDN endpoint can be changed by setting environment variable `APPLICATIONINSIGHTS_WEB_INSTRUMENTATION_SOURCE = "web Instrumentation CDN endpoints"`.
web Instrumentation connection string can be changed by setting environment variable `APPLICATIONINSIGHTS_WEB_INSTRUMENTATION_CONNECTION_STRING = "web Instrumentation connection string"`

> [!Note] 
> Web Instrumentation may slow down server response time, especially when response size is large or response is compressed. For the case in which some middle layers are applied, it may result in web Instrumentation not working and original response will be returned.

### Automatic third-party instrumentation

To track context across asynchronous calls, some changes are required in third-party libraries, such as MongoDB and Redis. By default, Application Insights uses [`diagnostic-channel-publishers`](https://github.com/Microsoft/node-diagnostic-channel/tree/master/src/diagnostic-channel-publishers) to monkey-patch some of these libraries. This feature can be disabled by setting the `APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL` environment variable.

> [!NOTE]
> By setting that environment variable, events might not be correctly associated with the right operation.

 Individual monkey patches can be disabled by setting the `APPLICATION_INSIGHTS_NO_PATCH_MODULES` environment variable to a comma-separated list of packages to disable. For example, use `APPLICATION_INSIGHTS_NO_PATCH_MODULES=console,redis` to avoid patching the `console` and `redis` packages.

Currently, nine packages are instrumented: `bunyan`,`console`,`mongodb`,`mongodb-core`,`mysql`,`redis`,`winston`,`pg`, and `pg-pool`. For information about exactly which version of these packages are patched, see the [diagnostic-channel-publishers' README](https://github.com/Microsoft/node-diagnostic-channel/blob/master/src/diagnostic-channel-publishers/README.md).

The `bunyan`, `winston`, and `console` patches generate Application Insights trace events based on whether `setAutoCollectConsole` is enabled. The rest generates Application Insights dependency events based on whether `setAutoCollectDependencies` is enabled.

### Live metrics

To enable sending live metrics from your app to Azure, use `setSendLiveMetrics(true)`. Currently, filtering of live metrics in the portal isn't supported.

### Extended metrics

> [!NOTE]
> The ability to send extended native metrics was added in version 1.4.0.

To enable sending extended native metrics from your app to Azure, install the separate native metrics package. The SDK automatically loads when it's installed and start collecting Node.js native metrics.

```bash
npm install applicationinsights-native-metrics
```

Currently, the native metrics package performs autocollection of garbage collection CPU time, event loop ticks, and heap usage:

- **Garbage collection**: The amount of CPU time spent on each type of garbage collection, and how many occurrences of each type.
- **Event loop**: How many ticks occurred and how much CPU time was spent in total.
- **Heap vs. non-heap**: How much of your app's memory usage is in the heap or non-heap.

### Distributed tracing modes

By default, the SDK sends headers understood by other applications or services instrumented with an Application Insights SDK. You can enable sending and receiving of [W3C Trace Context](https://github.com/w3c/trace-context) headers in addition to the existing AI headers. In this way, you won't break correlation with any of your existing legacy services. Enabling W3C headers allows your app to correlate with other services not instrumented with Application Insights but that do adopt this W3C standard.

```Javascript
const appInsights = require("applicationinsights");
appInsights
  .setup("<your connection string>")
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
  .start()
```

## TelemetryClient API

For a full description of the TelemetryClient API, see [Application Insights API for custom events and metrics](./api-custom-events-metrics.md).

You can track any request, event, metric, or exception by using the Application Insights client library for Node.js. The following code example demonstrates some of the APIs that you can use:

```javascript
let appInsights = require("applicationinsights");
appInsights.setup().start(); // assuming connection string in env var. start() can be omitted to disable any non-custom data
let client = appInsights.defaultClient;
client.trackEvent({name: "my custom event", properties: {customProperty: "custom property value"}});
client.trackException({exception: new Error("handled exceptions can be logged with this method")});
client.trackMetric({name: "custom metric", value: 3});
client.trackTrace({message: "trace message"});
client.trackDependency({target:"http://dbname", name:"select customers proc", data:"SELECT * FROM Customers", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
client.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true});

let http = require("http");
http.createServer( (req, res) => {
  client.trackNodeHttpRequest({request: req, response: res}); // Place at the beginning of your request handler
});
```

### Track your dependencies

Use the following code to track your dependencies:

```javascript
let appInsights = require("applicationinsights");
let client = new appInsights.TelemetryClient();

var success = false;
let startTime = Date.now();
// execute dependency call here....
let duration = Date.now() - startTime;
success = true;

client.trackDependency({target:"http://dbname", name:"select customers proc", data:"SELECT * FROM Customers", duration:duration, resultCode:0, success: true, dependencyTypeName: "ZSQL"});;
```

An example utility using `trackMetric` to measure how long event loop scheduling takes:  

```javascript
function startMeasuringEventLoop() {
  var startTime = process.hrtime();
  var sampleSum = 0;
  var sampleCount = 0;

  // Measure event loop scheduling delay
  setInterval(() => {
    var elapsed = process.hrtime(startTime);
    startTime = process.hrtime();
    sampleSum += elapsed[0] * 1e9 + elapsed[1];
    sampleCount++;
  }, 0);

  // Report custom metric every second
  setInterval(() => {
    var samples = sampleSum;
    var count = sampleCount;
    sampleSum = 0;
    sampleCount = 0;

    if (count > 0) {
      var avgNs = samples / count;
      var avgMs = Math.round(avgNs / 1e6);
      client.trackMetric({name: "Event Loop Delay", value: avgMs});
    }
  }, 1000);
}
```

### Add a custom property to all events

Use the following code to add a custom property to all events:

```javascript
appInsights.defaultClient.commonProperties = {
  environment: process.env.SOME_ENV_VARIABLE
};
```

### Track HTTP GET requests

Use the following code to manually track HTTP GET requests:

> [!NOTE]
> All requests are tracked by default. To disable automatic collection, call `.setAutoCollectRequests(false)` before calling `start()`.

```javascript
appInsights.defaultClient.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true});
```

Alternatively, you can track requests by using the `trackNodeHttpRequest` method:

```javascript
var server = http.createServer((req, res) => {
  if ( req.method === "GET" ) {
      appInsights.defaultClient.trackNodeHttpRequest({request:req, response:res});
  }
  // other work here....
  res.end();
});
```

### Track server startup time

Use the following code to track server startup time:

```javascript
let start = Date.now();
server.on("listening", () => {
  let duration = Date.now() - start;
  appInsights.defaultClient.trackMetric({name: "server startup time", value: duration});
});
```

### Flush

By default, telemetry is buffered for 15 seconds before it's sent to the ingestion server. If your application has a short lifespan, such as a CLI tool, it might be necessary to manually flush your buffered telemetry when the application terminates by using `appInsights.defaultClient.flush()`.

If the SDK detects that your application is crashing, it calls flush for you by using `appInsights.defaultClient.flush({ isAppCrashing: true })`. With the flush option `isAppCrashing`, your application is assumed to be in an abnormal state and isn't suitable to send telemetry. Instead, the SDK saves all buffered telemetry to [persistent storage](./data-retention-privacy.md#nodejs) and lets your application terminate. When your application starts again, it tries to send any telemetry that was saved to persistent storage.

### Preprocess data with telemetry processors

You can process and filter collected data before it's sent for retention by using *telemetry processors*. Telemetry processors are called one by one in the order they were added before the telemetry item is sent to the cloud.

```javascript
public addTelemetryProcessor(telemetryProcessor: (envelope: Contracts.Envelope, context: { http.RequestOptions, http.ClientRequest, http.ClientResponse, correlationContext }) => boolean)
```

If a telemetry processor returns `false`, that telemetry item isn't sent.

All telemetry processors receive the telemetry data and its envelope to inspect and modify. They also receive a context object. The contents of this object are defined by the `contextObjects` parameter when calling a track method for manually tracked telemetry. For automatically collected telemetry, this object is filled with available request information and the persistent request content as provided by `appInsights.getCorrelationContext()` (if automatic dependency correlation is enabled).

The TypeScript type for a telemetry processor is:

```javascript
telemetryProcessor: (envelope: ContractsModule.Contracts.Envelope, context: { http.RequestOptions, http.ClientRequest, http.ClientResponse, correlationContext }) => boolean;
```

For example, a processor that removes stacks trace data from exceptions might be written and added as follows:

```javascript
function removeStackTraces ( envelope, context ) {
  if (envelope.data.baseType === "Microsoft.ApplicationInsights.ExceptionData") {
    var data = envelope.data.baseData;
    if (data.exceptions && data.exceptions.length > 0) {
      for (var i = 0; i < data.exceptions.length; i++) {
        var exception = data.exceptions[i];
        exception.parsedStack = null;
        exception.hasFullStack = false;
      }
    }
  }
  return true;
}

appInsights.defaultClient.addTelemetryProcessor(removeStackTraces);
```

## Use multiple connection strings

You can create multiple Application Insights resources and send different data to each by using their respective connection strings.

 For example:

```javascript
let appInsights = require("applicationinsights");

// configure auto-collection under one connection string
appInsights.setup("Connection String A").start();

// track some events manually under another connection string
let otherClient = new appInsights.TelemetryClient("Connection String B");
otherClient.trackEvent({name: "my custom event"});
```

## Advanced configuration options

The client object contains a `config` property with many optional settings for advanced scenarios. To set them, use:

```javascript
client.config.PROPERTYNAME = VALUE;
```

These properties are client specific, so you can configure `appInsights.defaultClient` separately from clients created with `new appInsights.TelemetryClient()`.

| Property                        | Description                                                                                                |
| ------------------------------- |------------------------------------------------------------------------------------------------------------|
| connectionString                | An identifier for your Application Insights resource.                                                      |
| endpointUrl                     | The ingestion endpoint to send telemetry payloads to.                                                      |
| quickPulseHost                  | The Live Metrics Stream host to send live metrics telemetry to.                                            |
| proxyHttpUrl                    | A proxy server for SDK HTTP traffic. (Optional. Default is pulled from `http_proxy` environment variable.)     |
| proxyHttpsUrl                   | A proxy server for SDK HTTPS traffic. (Optional. Default is pulled from `https_proxy` environment variable.)   |
| httpAgent                       | An http.Agent to use for SDK HTTP traffic. (Optional. Default is undefined.)                                   |
| httpsAgent                      | An https.Agent to use for SDK HTTPS traffic. (Optional. Default is undefined.)                                 |
| maxBatchSize                    | The maximum number of telemetry items to include in a payload to the ingestion endpoint. (Default is `250`.)   |
| maxBatchIntervalMs              | The maximum amount of time to wait for a payload to reach maxBatchSize. (Default is `15000`.)               |
| disableAppInsights              | A flag indicating if telemetry transmission is disabled. (Default is `false`.)                                 |
| samplingPercentage              | The percentage of telemetry items tracked that should be transmitted. (Default is `100`.)                      |
| correlationIdRetryIntervalMs    | The time to wait before retrying to retrieve the ID for cross-component correlation. (Default is `30000`.)     |
| correlationHeaderExcludedDomains| A list of domains to exclude from cross-component correlation header injection. (Default. See [Config.ts](https://github.com/Microsoft/ApplicationInsights-node.js/blob/develop/Library/Config.ts).)|

## How do I customize logs collection?

By default, Application Insights Node.js SDK logs at warning level to console.

To spot and diagnose issues with Application Insights, "Self-diagnostics" can be enabled. This means collection of internal logging from the Application Insights Node.js SDK.

The following code demonstrates how to enable debug logging as well as generate telemetry for internal logs.

```
let appInsights = require("applicationinsights");
appInsights.setup("<YOUR_CONNECTION_STRING>")
    .setInternalLogging(true, true) // Enable both debug and warning logging
    .setAutoCollectConsole(true, true) // Generate Trace telemetry for winston/bunyan and console logs
    .start();
    
Logs could be put into local file using APPLICATIONINSIGHTS_LOG_DESTINATION environment variable, supported values are file and file+console, a file named applicationinsights.log will be generated on tmp folder by default, including all logs, /tmp for *nix and USERDIR\\AppData\\Local\\Temp for Windows. Log directory could be configured using APPLICATIONINSIGHTS_LOGDIR environment variable.

process.env.APPLICATIONINSIGHTS_LOG_DESTINATION = "file+console";
process.env.APPLICATIONINSIGHTS_LOGDIR = "C:\\applicationinsights\\logs";

// Application Insights SDK setup....
```

## Troubleshooting

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Next steps

* [Monitor your telemetry in the portal](./overview-dashboard.md)
* [Write Analytics queries over your telemetry](../logs/log-analytics-tutorial.md)

<!--references-->

[FAQ]: ../faq.yml
