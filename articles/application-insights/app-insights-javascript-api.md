<properties 
	pageTitle="Application Insights SDK JavaScript API" 
	description="Reference doc" 
	services="application-insights" 
    documentationCenter=".net"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/21/2015" 
	ms.author="awills"/>
 

# Application Insights SDK JavaScript API

The JavaScript SDK is loaded into your web page when you set up [web page tracking](app-insights-javascript.md) in [Application Insights](https://azure.microsoft.com/services/application-insights/).

[Overview of the API and examples](app-insights-api-custom-events-metrics.md)

## class AppInsights

The shop front for the SDK that sends telemetry to Application Insights.

In a web page where you have [set up web page tracking](app-insights-javascript.md), you can use the instance `appInsights`. For example:
    
    appInsights.trackPageView("page1");



### trackPageView

    trackPageView(name?: string, url?: string, properties?:{[string]:string}, measurements?: {[string]:number})

Logs that a page or similar container was displayed to the user. 

 | | 
---|---|---
`name` | `? string` | The name used to identify the page in the portal. Defaults to the document title.
`url` | `? string` |  A relative or absolute URL that identifies the page or similar item. Defaults to the window location.
`properties` |  `? {[string]:string}` | Additional data used to filter pages and metrics in the portal. Defaults to empty.
`measurements` | `? {[string]:number}` | Metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.


### trackEvent

    trackEvent(name: string, properties?: {[string]:string}, measurements?: {[string]:string})

Log a user action or other occurrence.

In the portal, you can select events by name, and [display charts that count them or display associated measurements](app-insights-metrics-explorer.md).

You can also search and [display individual events](app-insights-diagnostic-search.md).

 | | 
---|---|---
 `name` | `string` | Identifies the event. Events with the same name are counted and can be charted in [Metric Explorer](app-insights-metrics-explorer.md).
`properties` |  `? {[string]:string}` | Additional data used to filter pages and metrics in the portal. Defaults to empty.
`measurements` | `? {[string]:number}` | Metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.


### trackMetric

    trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number)


Log a numeric value that is not associated with a specific event. Typically used to send regular reports of performance indicators. 

In the portal, you can select metrics by name to [chart their values over time](app-insights-metrics-explorer.md). You can't search or view individual trackMetric calls.

To send a single measurement, use just the first two parameters. If you take measurements very frequently, you can reduce the telemetry bandwidth by aggregating multiple measurements and sending the resulting average at intervals.

 | | 
---|---|---
`name` | `string` |    A string that identifies the metric. In the portal, you can select metrics for display by name.
`average` | ` number` | Either a single measurement, or the average of several measurements.
`sampleCount` | `? number` | Count of measurements represented by the average. Defaults to 1.
`min` | `? number` | The smallest measurement in the sample. Defaults to the average.
`max` | `? number` | The largest measurement in the sample. Defaults to the average.

### trackException

    trackException(exception: Error, handledAt?: string, properties?: Object, measurements?: Object)

Log an exception you have caught. (Exceptions caught by the browser are also logged.)

In the portal, you can [search on exception type and view](app-insights-diagnostic-search.md) the type, message, and stack trace of individual instances. 

 | | 
---|---|---
`exception` | `Error` |  An Error from a catch clause.  
`handledAt` | `? string` | Defaults to "unhandled".
`properties` |  `? {[string]:string}` | Additional data used to filter pages and metrics in the portal. Defaults to empty.
`measurements` | `? {[string]:number}` | Metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.

### trackTrace

    trackTrace(message: string, properties?: Object, measurements?: Object)

Log a diagnostic event such as entering or leaving a method.

In the portal, you can search on message content and [display individual trackTrace events](app-insights-diagnostic-search.md).
(Unlike `trackEvent`, you can't filter on the message content in the portal.)

 | | 
---|---|---
`message` | `string` | Diagnostic data. Can be much longer than a name.

### flush

    flush()

Immediately send all queued telemetry.

Use this on window closing.


### config

    config: IConfig

Values that control how the telemetry data is sent.

    interface IConfig {
        instrumentationKey: string;
        endpointUrl: string;
        accountId: string;
        appUserId: string;
        sessionRenewalMs: number; // 30 mins. 
        sessionExpirationMs: number; // 24h. 
        maxPayloadSizeInBytes: number; // 200k
        maxBatchSizeInBytes: number; // 100k
        maxBatchInterval: number; // 15000
        enableDebug: boolean;
        autoCollectErrors: boolean; // true
        disableTelemetry: boolean; // false
        verboseLogging: boolean;
        diagnosticLogInterval: number; // 10 000
    }

Set these values in [the snippet](app-insights-javascript-api.md) that you insert in your web pages.
Look for this line, and add more items:

    })({
      instrumentationKey: "000...000"
    });

### context

    context: TelemetryContext

Information that the SDK attempts to extract from the environment about the device, location, and user.


## class TelemetryContext




        /**
         * Details of the app you're monitoring.
         */
        public application: Context.Application;

        /**
         * The device the app is running on.
         */
        public device: Context.Device;

        /**
         * The user currently signed in.
         */
        public user: Context.User;

        /**
         * The user session. A session represents a series
         * of user actions. A session starts with a user action.
         * It ends when there is no user activity for 
         * sessionRenewalMs, 
         * or if it lasts longer than sessionExpirationMs.
         */
        public session: Context.Session;

        /**
         * The geographical location of the user's device,
         * if available.
         */
        public location: Context.Location;

        /**
         * Represents the user request. Operation id is used
         * to tie together related events in diagnostic search.
         */
        public operation: Context.Operation;

        /**
         * Default measurements to be attached by default to
         * all events.
         */
        public measurements: any;

        /**
         * Default properties to be attached by default to
         * all events. 
         */
        public properties: any;

        /**
         * Send telemetry object to the endpoint.
         * Returns telemetryObject.
         */
        public track(envelope: Telemetry.Common.Envelope) ;


## Open source code

Read or contribute to the [code for the SDK](https://github.com/Microsoft/ApplicationInsights-js).
