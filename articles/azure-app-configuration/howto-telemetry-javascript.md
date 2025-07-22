---
title:  Enable telemetry for feature flags in a Node.js application
titleSuffix: Azure App Configuration
description: Learn how to use telemetry in Node.js for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 06/25/2025
---

# Enable telemetry for feature flags in a Node.js application

In this tutorial, you use telemetry in your Node.js application to track feature flag evaluations and custom events. Telemetry allows you to make informed decisions about your feature management strategy. You utilize the feature flag with telemetry enabled created in the [overview for enabling telemetry for feature flags](./howto-telemetry.md). Before proceeding, ensure that you create a feature flag named *Greeting* in your Configuration store with telemetry enabled. This tutorial builds on top of the tutorial for [using variant feature flags in a Node.js application](./howto-variant-feature-flags-javascript.md).

## Prerequisites

- The variant feature flag with telemetry enabled from [Enable telemetry for feature flags](./howto-telemetry.md).
- The application from [Use variant feature flags in a Node.js application](./howto-variant-feature-flags-javascript.md).

## Add telemetry to your Node.js application

1. Install the following packages.

    ```bash
    npm install @microsoft/feature-management-applicationinsights-node
    ```

1. Open `server.js` and add the following code in the beginning to connect to Application Insights to publish telemetry.

    ```js
    const appInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    const applicationInsights = require("applicationinsights");
    applicationInsights.setup(appInsightsConnectionString).start();

    const express = require("express");
    const server = express();
    // existing code ...
    ```

1. Add the following import.

    ```js
    const { createTelemetryPublisher, trackEvent } = require("@microsoft/feature-management-applicationinsights-node");
    ```

1. Create and register the telemetry publisher when initializing the `FeatureManager`.

    ```js
    // existing code ...
    const featureFlagProvider = new ConfigurationMapFeatureFlagProvider(appConfig);
    const publishTelemetry = createTelemetryPublisher(applicationInsights.defaultClient);
    featureManager = new FeatureManager(featureFlagProvider, {
        onFeatureEvaluated: publishTelemetry
    });
    // existing code ...
    ```

    The `publishTelemetry` callback will send telemetry data each time a feature flag is evaluated.

1. Track custom events for user interactions. Modify the `/api/like` endpoint to send telemetry data to Application Insights whenever a user likes content. This helps you analyze which feature variants perform better.

    ```js
    server.post("/api/like", (req, res) => {
        const { UserId } = req.body;
        if (UserId === undefined) {
            return res.status(400).send({ error: "UserId is required" });
        }
        trackEvent(applicationInsights.defaultClient, UserId, { name: "Liked" });
        res.status(200).send();
    });
    ```

## Run the application

1. Application insights requires a connection string to connect to your Application Insights resource. Set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable to the connection string for your Application Insights resource.

    ```cmd
    setx APPLICATIONINSIGHTS_CONNECTION_STRING "applicationinsights-connection-string"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:APPLICATIONINSIGHTS_CONNECTION_STRING = "applicationinsights-connection-string"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export APPLICATIONINSIGHTS_CONNECTION_STRING='applicationinsights-connection-string'
    ```

## Collect telemetry

Deploy your application to begin collecting telemetry from your users. To test its functionality, you can simulate user activity by creating many test users. Each user will experience a different variant of greeting messages, and they can interact with the application by clicking the heart button to like a quote. As your user base grows, you can monitor the increasing volume of telemetry data collected in Azure App Configuration. Additionally, you can drill down into the data to analyze how each variant of the feature flag influences user behavior.
- [Review telemetry results in App Configuration](./howto-telemetry.md#review-telemetry-results-in-azure-app-configuration).

## Additional resources

- [Quote of the Day sample](https://github.com/Azure-Samples/quote-of-the-day-javascript)
- For the full feature rundown of the JavaScript feature management library you can refer to the [JavaScript Feature Management reference documentation](./feature-management-javascript-reference.md)
