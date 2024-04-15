---
title: Migrating Azure Monitor Application Insights Node.js from Application Insights 2.X SDK to OpenTelemetry
description: This article provides guidance on how to migrate from the Azure Monitor Application Insights Node.js 2.X SDK to OpenTelemetry.
ms.topic: conceptual
ms.date: 4/12/2024
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Migrating from ApplicationInsights Version 2.X to Azure Monitor OpenTelemetry-based Node.js

This guide provides two options to upgrade from the Azure Monitor Application Insights Node.js 2.X SDK to OpenTelemetry.

* **Clean install** the [Node.js Azure Monitor OpenTelemetry Distro](https://github.com/microsoft/opentelemetry-azure-monitor-js).
    * Remove dependencies on the Application Insights classic API.
    * Familiarize yourself with OpenTelemetry APIs and terms.
    * Position yourself to use all that OpenTelemetry offers now and in the future.
* **Upgrade** to Node.js SDK 3.X.
    * Postpone code changes while preserving compatibility with existing custom events and metrics.
    * Access to richer OpenTelemetry instrumentation libraries.
    * Maintain eligibility for the latest bug and security fixes.

## [Clean install](#tab/cleaninstall)

1. Gain prerequisite knowledge of the OpenTelemetry JavaScript Application Programming Interface (API) and Software Development Kit (SDK).

    * Read [OpenTelemetry JavaScript documentation](https://opentelemetry.io/docs/languages/js/).
    * Review [Configure Azure Monitor OpenTelemetry](opentelemetry-configuration.md?tabs=nodejs).
    * Evaluate [Add, modify, and filter OpenTelemetry](opentelemetry-add-modify.md?tabs=nodejs).

2.  Uninstall the `applicationinsights` dependency from your project.

    ```shell
    npm uninstall applicationinsights
    ```

3. Remove 2.X SDK implementation from your code.

    Remove all Application Insights instrumentation from your code. Delete any sections where the Application Insights client is initialized, modified, or called.

4. Enable Application Insights with the Azure Monitor OpenTelemetry Distro.

    Follow [getting started](opentelemetry-enable.md?tabs=nodejs) to onboard to the Azure Monitor OpenTelemetry Distro.

#### Changes and limitations of the Azure Monitor OpenTelemetry Distro

The APIs from the Application Insights 2.X SDK aren't available in the Azure Monitor OpenTelemetry Distro. You can access these APIs through a nonbreaking upgrade path in the Application Insights 3.X SDK.

## [Upgrade](#tab/upgrade)

1. Upgrade the `applicationinsights` package dependency.

    ```shell
    npm update applicationinsights
    ```

2. Rebuild your application.

3. Test your application.

    To avoid using unsupported configuration options in the Application Insights 3.X SDK, see [Unsupported Properties](https://github.com/microsoft/ApplicationInsights-node.js/tree/beta?tab=readme-ov-file#applicationinsights-shim-unsupported-properties).

    If the SDK logs warnings about unsupported API usage after a major version bump, and you need the related functionality, continue using the Application Insights 2.X SDK.

---

#### Changes and limitations

The following changes and limitations apply to both upgrade paths.

##### Node < 14 support

OpenTelemetry JavaScript's monitoring solutions officially support only Node version 14+. Check the [OpenTelemetry supported runtimes](https://github.com/open-telemetry/opentelemetry-js#supported-runtimes) for the latest updates. Users on older versions like Node 8, previously supported by the ApplicationInsights SDK, can still use OpenTelemetry solutions but can experience unexpected or breaking behavior.

##### Configuration options

The ApplicationInsights SDK version 2.X offers configuration options that aren't available in the Azure Monitor OpenTelemetry Distro or in the major version upgrade to Application Insights 3.X SDK. To find these changes, along with the options we still support, see [SDK configuration documentation](https://github.com/microsoft/ApplicationInsights-node.js/tree/beta?tab=readme-ov-file#applicationinsights-shim-unsupported-properties).

##### Extended metrics

Extended metrics are supported in the Application Insights 2.X SDK; however, support for these metrics ends in both version 3.X of the ApplicationInsights SDK and the Azure Monitor OpenTelemetry Distro.

##### Telemetry Processors

While the Azure Monitor OpenTelemetry Distro and Application Insights 3.X SDK don't support TelemetryProcessors, they do allow you to pass span and log record processors. For more information on how, see [Azure Monitor OpenTelemetry Distro project](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry#modify-telemetry).

This example shows the equivalent of creating and applying a telemetry processor that attaches a custom property in the Application Insights 2.X SDK.

```typescript
const applicationInsights = require("applicationinsights");
applicationInsights.setup("YOUR_CONNECTION_STRING");
applicationInsights.defaultClient.addTelemetryProcessor(addCustomProperty);
applicationInsights.start();

function addCustomProperty(envelope: EnvelopeTelemetry) {
    const data = envelope.data.baseData;
    if (data?.properties) {
        data.properties.customProperty = "Custom Property Value";
    }
    return true;
}
```

This example shows how to modify an Azure Monitor OpenTelemetry Distro implementation to pass a SpanProcessor to the configuration of the distro.

```typescript
import { Context, Span} from "@opentelemetry/api";
import { ReadableSpan, SpanProcessor } from "@opentelemetry/sdk-trace-base";
const { useAzureMonitor } = require("@azure/monitor-opentelemetry");

class SpanEnrichingProcessor implements SpanProcessor {
    forceFlush(): Promise<void> {
        return Promise.resolve();
    }
    onStart(span: Span, parentContext: Context): void {
        return;
    }
    onEnd(span: ReadableSpan): void {
        span.attributes["custom-attribute"] = "custom-value";
    }
    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}

const options = {
    azureMonitorExporterOptions: {
        connectionString: "YOUR_CONNECTION_STRING"
    },
    spanProcessors: [new SpanEnrichingProcessor()],
};
useAzureMonitor(options);
```
