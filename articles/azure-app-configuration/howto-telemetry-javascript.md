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

1. Run the application, [see step 2 of Use variant feature flags](./howto-variant-feature-flags-python.md#build-and-run-the-app). You can simulate user activity on the application where some users are served different variants that they may or may not like.

## Next steps

 - Now that you have set up your app and have some user activity on it, you can [review feature flag telemetry in the Azure Portal](./howto-telemetry.md#review-telemetry-for-feature-flag).

## Additional resources

- [Quote of the Day sample](https://github.com/Azure-Samples/quote-of-the-day-javascript)
- For the full feature rundown of the JavaScript feature management library you can refer to the [JavaScript Feature Management reference documentation](./feature-management-javascript-reference.md)
