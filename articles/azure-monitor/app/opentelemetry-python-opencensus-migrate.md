---
title: Migrating Azure Monitor Application Insights Python from OpenCensus to OpenTelemetry
description: This article provides guidance on how to migrate from the Azure Monitor Application Insights Python SDK and OpenCensus exporter to OpenTelemetry.
ms.topic: conceptual
ms.date: 10/10/2023
ms.devlang: python
ms.custom: devx-track-python
ms.reviewer: mmcc
---
# Migrating from OpenCensus Python SDK and Azure Monitor OpenCensus exporter for Python to Azure Monitor OpenTelemetry Python Distro

> [!NOTE]
> [OpenCensus Python SDK is deprecated](https://opentelemetry.io/blog/2023/sunsetting-opencensus/), but Microsoft supports it until retirement on September 30, 2024. We now recommend the [OpenTelemetry-based Python offering](./opentelemetry-enable.md?tabs=python) and provide [migration guidance](./opentelemetry-python-opencensus-migrate.md?tabs=aspnetcore).

Follow these steps to migrate Python applications to the [Azure Monitor](../overview.md) [Application Insights](./app-insights-overview.md) [OpenTelemetry Distro](./opentelemetry-enable.md?tabs=python).

> [!WARNING]
> - The [OpenCensus "How to Migrate to OpenTelemetry" blog](https://opentelemetry.io/blog/2023/sunsetting-opencensus/#how-to-migrate-to-opentelemetry) is not applicable to Azure Monitor users.
> - The [OpenTelemetry OpenCensus shim](https://pypi.org/project/opentelemetry-opencensus-shim/) is not recommended or supported by Microsoft.
> - The following outlines the only migration plan for Azure Monitor customers.

## Step 1: Uninstall OpenCensus libraries

Uninstall all libraries related to OpenCensus, including all Pypi packages that start with `opencensus-*`.

```
pip freeze | grep opencensus | xargs pip uninstall -y
```

## Step 2: Remove OpenCensus from your code

Remove all instances of the OpenCensus SDK and the Azure Monitor OpenCensus exporter from your code.

Check for import statements starting with `opencensus` to find all integrations, exporters, and instances of OpenCensus API/SDK that must be removed.

The following are examples of import statements that must be removed.

```
from opencensus.ext.azure import metrics_exporter
from opencensus.stats import aggregation as aggregation_module
from opencensus.stats import measure as measure_module

from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

from opencensus.ext.azure.log_exporter import AzureLogHandler
```

## Step 3: Familiarize yourself with OpenTelemetry Python APIs/SDKs

The following documentation provides prerequisite knowledge of the OpenTelemetry Python APIs/SDKs.

 - OpenTelemetry Python [documentation](https://opentelemetry-python.readthedocs.io/en/stable/)
 - Azure Monitor Distro documentation on [configuration](./opentelemetry-configuration.md?tabs=python) and [telemetry](./opentelemetry-add-modify.md?tabs=python)

> [!NOTE]
> OpenTelemetry Python and OpenCensus Python have different API surfaces, autocollection capabilities, and onboarding instructions.

## Step 4: Set up the Azure Monitor OpenTelemetry Distro

Follow the [getting started](./opentelemetry-enable.md?tabs=python#get-started)
page to onboard onto the Azure Monitor OpenTelemetry Distro.

## Changes and limitations

The following changes and limitations may be encountered when migrating from OpenCensus to OpenTelemetry.

### Python < 3.7 support

OpenTelemetry's Python-based monitoring solutions only support Python 3.7 and greater, excluding the previously supported Python versions 2.7, 3.4, 3.5, and 3.6 from OpenCensus. We suggest upgrading for users who are on the older versions of Python since, as of writing this document, those versions have already reached [end of life](https://devguide.python.org/versions/). Users who are adamant about not upgrading may still use the OpenTelemetry solutions, but may find unexpected or breaking behavior that is unsupported. In any case, the last supported version of [opencensus-ext-azure](https://pypi.org/project/opencensus-ext-azure/) always exists, and stills work for those versions, but no new releases are made for that project.

### Configurations

OpenCensus Python provided some [configuration](https://github.com/census-instrumentation/opencensus-python#customization) options related to the collection and exporting of telemetry. You achieve the same configurations, and more, by using the [OpenTelemetry Python](https://opentelemetry-python.readthedocs.io/en/stable/) APIs and SDK. The OpenTelemetry Azure monitor Python Distro is more of a one-stop-shop for the most common monitoring needs for your Python applications. Since the Distro encapsulates the OpenTelemetry APIs/SDk, some configuration for more uncommon use cases may not currently be supported for the Distro. Instead, you can opt to onboard onto the [Azure monitor OpenTelemetry exporter](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry-exporter), which, with the OpenTelemetry APIs/SDKs, should be able to fit your monitoring needs. Some of these configurations include:

- Custom propagators
- Custom samplers
- Adding extra span/log processors/metrics readers

### Cohesion with Azure functions

In order to provide distributed tracing capabilities for Python applications that call other Python applications within an Azure function, the package [opencensus-extension-azure-functions](https://pypi.org/project/opencensus-extension-azure-functions/) was provided to allow for a connected distributed graph.

Currently, the OpenTelemetry solutions for Azure Monitor don't support this scenario. As a workaround, you can manually propagate the trace context in your Azure functions application as shown in the following example.

```python
from opentelemetry.context import attach, detach
from opentelemetry.trace.propagation.tracecontext import \
  TraceContextTextMapPropagator

# Context parameter is provided for the body of the function
def main(req, context):
  functions_current_context = {
    "traceparent": context.trace_context.Traceparent,
    "tracestate": context.trace_context.Tracestate
  }
  parent_context = TraceContextTextMapPropagator().extract(
      carrier=functions_current_context
  )
  token = attach(parent_context)

  ...
  # Function logic
  ...
  detach(token)
```

### Extensions and exporters

The OpenCensus SDK offered ways to collect and export telemetry through OpenCensus integrations and exporters respectively. In OpenTelemetry, integrations are now referred to as instrumentations, whereas exporters have stayed with the same terminology. The OpenTelemetry Python instrumentations and exporters are a superset of what was provided in OpenCensus, so in terms of library coverage and functionality, OpenTelemetry libraries are a direct upgrade. As for the Azure Monitor OpenTelemetry Distro, it comes with some of the popular OpenTelemetry Python [instrumentations](.\opentelemetry-add-modify.md?tabs=python#included-instrumentation-libraries) out of the box so no extra code is necessary. Microsoft fully supports these instrumentations.

As for the other OpenTelemetry Python [instrumentations](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation) that aren't included in this list, users may still manually instrument with them. However, it's important to note that stability and behavior aren't guaranteed or supported in those cases. Therefore, use them at your own discretion.

 If you would like to suggest a community instrumentation library us to include in our distro, post or up-vote an idea in our [feedback community](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0). For exporters, the Azure Monitor OpenTelemetry distro comes bundled with the [Azure Monitor OpenTelemetry exporter](https://pypi.org/project/azure-monitor-opentelemetry-exporter/). If you would like to use other exporters as well, you can use them with the distro, like in this [example](./opentelemetry-configuration.md?tabs=python#enable-the-otlp-exporter).

### TelemetryProcessors

OpenCensus Python telemetry [processors](./api-filtering-sampling.md#opencensus-python-telemetry-processors) are a powerful mechanism in which allowed users to modify their telemetry before they're sent to the exporter. There's no concept of TelemetryProcessors in the OpenTelemetry world, but there are APIs and classes that you can use to replicate the same behavior.

#### Setting Cloud Role Name and Cloud Role Instance

Follow the instructions [here](./opentelemetry-configuration.md?tabs=python#set-the-cloud-role-name-and-the-cloud-role-instance) for how to set cloud role name and cloud role instance for your telemetry. The OpenTelemetry Azure Monitor Distro automatically fetches the values from the environment variables and fills the respective fields.

#### Modifying spans with SpanProcessors

Coming soon.

#### Modifying metrics with Views

Coming soon.

### Performance Counters

The OpenCensus Python Azure Monitor exporter automatically collected system and performance related metrics called [performance counters](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib/opencensus-ext-azure#performance-counters). These metrics appear in `performanceCounters` in your Application Insights instance. In OpenTelemetry, we no longer send these metrics explicitly to `performanceCounters`. Metrics related to incoming/outgoing requests can be found under [standard metrics](./standard-metrics.md). If you would like OpenTelemetry to autocollect system related metrics, you can use the experimental system metrics [instrumentation](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-system-metrics), contributed by the OpenTelemetry Python community. This package is experimental and not officially supported by Microsoft.

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-support.md)]