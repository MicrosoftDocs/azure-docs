---
title: Statsbeat in Application Insights | Microsoft Docs
description: Statistics about Application Insights SDKs and Auto-Instrumentation
ms.topic: conceptual
ms.date: 08/24/2022
ms.custom: references_regions
ms.reviwer: heya
---

# Statsbeat in Application Insights

Statsbeat collects essential and nonessential [custom metrics](../essentials/metrics-custom-overview.md) about Application Insights SDKs and autoinstrumentation. Statsbeat serves three benefits for Azure Monitor Application Insights customers:
-	Service health and reliability (outside-in monitoring of connectivity to ingestion endpoint)
-	Support diagnostics (self-help insights and CSS insights)
-	Product improvement (insights for design optimizations)

Statsbeat data is stored in a Microsoft data store. It doesn't affect customers' overall monitoring volume and cost.

Statsbeat doesn't support [Azure Private Link](../../automation/how-to/private-link-security.md).

## What data does Statsbeat collect?

Statsbeat collects essential and nonessential metrics.

## Supported languages

| C#                        | Java            | JavaScript                | Node.js         | Python          |
|---------------------------|-----------------|---------------------------|-----------------|-----------------|
| Currently not supported   | Supported       | Currently not supported   | Supported       | Supported       |

## Supported EU regions

#### [Java](#tab/eu-java)

Statsbeat supports EU Data Boundary for Application Insights resources in the following regions:

| Geo name                  | Region name            |
|---------------------------|------------------------|
| Europe                    | North Europe           |
| Europe                    | West Europe            |
| France                    | France Central         | 
| France                    | France South           | 
| Germany                   | Germany West Central   | 
| Norway                    | Norway East            | 
| Norway                    | Norway West            | 
| Sweden                    | Sweden Central         | 
| Switzerland               | Switzerland North      |
| Switzerland               | Switzerland West       | 
| United Kingdom            | United Kingdom South   |
| United Kingdom            | United Kingdom West    |

#### [Node](#tab/eu-node)

Statsbeat supports EU Data Boundary for Application Insights resources in the following regions:

| Geo name                  | Region name            |
|---------------------------|------------------------|
| Europe                    | North Europe           |
| Europe                    | West Europe            |
| France                    | France Central         | 
| France                    | France South           | 
| Germany                   | Germany West Central   | 
| Norway                    | Norway East            | 
| Norway                    | Norway West            | 
| Sweden                    | Sweden Central         | 
| Switzerland               | Switzerland North      |
| Switzerland               | Switzerland West       |
| United Kingdom            | United Kingdom South   |
| United Kingdom            | United Kingdom West    |

#### [Python](#tab/eu-python)

Statsbeat supports EU Data Boundary for Application Insights resources in the following regions:

| Geo name                  | Region name            |
|---------------------------|------------------------|
| Europe                    | North Europe           |
| Europe                    | West Europe            |
| France                    | France Central         | 
| France                    | France South           | 
| Germany                   | Germany West Central   | 
| Norway                    | Norway East            | 
| Norway                    | Norway West            | 
| Sweden                    | Sweden Central         | 
| Switzerland               | Switzerland North      |
| Switzerland               | Switzerland West       |
| United Kingdom            | United Kingdom South   |
| United Kingdom            | United Kingdom West    |

---

### Essential Statsbeat

#### Network Statsbeat

|Metric name|Unit|Supported dimensions|
|-----|-----|-----|
|Request Success Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`, `Endpoint`, `Host`|
|Requests Failure Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`, `Endpoint`, `Host`, `Status Code`|
|Request Duration|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`, `Endpoint`, `Host`|
|Retry Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`, `Endpoint`, `Host`, `Status Code`|
|Throttle Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`, `Endpoint`, `Host`, `Status Code`|
|Exception Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`, `Endpoint`, `Host`, `Exception Type`|

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

#### Attach Statsbeat

|Metric name|Unit|Supported dimensions|
|-----|-----|-----|
|Attach|Count| `Resource Provider`, `Resource Provider Identifier`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`|

#### Feature Statsbeat

|Metric name|Unit|Supported dimensions|
|-----|-----|-----|
|Feature|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Feature`, `Type`, `Operating System`, `Language`, `Version`|

### Nonessential Statsbeat

Track the Disk I/O failure when you use disk persistence for reliable telemetry.

|Metric name|Unit|Supported dimensions|
|-----|-----|-----|
|Read Failure Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`|
|Write Failure Count|Count| `Resource Provider`, `Attach Type`, `Instrumentation Key`, `Runtime Version`, `Operating System`, `Language`, `Version`|

### Configure Statsbeat

#### [Java](#tab/java)

To disable nonessential Statsbeat, add the following configuration to your config file:

```json
{
  "preview": {
    "statsbeat": {
        "disabled": "true"
    }
  }
}
```

You can also disable this feature by setting the environment variable `APPLICATIONINSIGHTS_STATSBEAT_DISABLED` to `true`. This setting then takes precedence over `disabled`, which is specified in the JSON configuration.

#### [Node](#tab/node)

Not supported yet.

#### [Python](#tab/python)

Statsbeat is enabled by default. It can be disabled by setting the environment variable <code class="notranslate">APPLICATIONINSIGHTS_STATSBEAT_DISABLED_ALL</code> to <code class="notranslate">true</code>.

Metrics are sent to the following locations, to which outgoing connections must be opened in firewalls.

|Location           |URL |
|---------|---------|
|Europe             |<code class="notranslate">westeurope-5.in.applicationinsights.azure.com</code>         |
|Outside Europe     |<code class="notranslate">westus-0.in.applicationinsights.azure.com</code>         |

---
