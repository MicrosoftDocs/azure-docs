---
title: "Azure Functions App Diagnostics for Durable Functions" 
description: "Learn how to use Azure Functions app diagnostics to diagnose and resolve Durable Functions issues in the Azure portal. Discover detectors for CPU, memory, and error analysis."
author: bachuv
ms.topic: how-to
ms.service: azure-functions
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Azure Functions app diagnostics for Durable Functions 

Azure Functions app diagnostics provides built-in detectors in the Azure portal that automatically check your Durable Functions application for extension version issues, high CPU usage, memory pressure, application errors, and more. Each detector identifies problems and suggests fixes you can apply directly in the portal.

## Find the right detector

Use the following table to jump to the detector that matches your symptom:

| Symptom | Detector |
| --- | --- |
| Extension version issues, orchestration performance problems, or general health check | [Durable Functions detector](#durable-functions-detector) |
| App is down, returning errors, or functions aren't triggering | [Functions App Down or Reporting Errors](#functions-app-down-or-reporting-errors) |
| Slow orchestrations or high CPU utilization | [High CPU Analysis](#high-cpu-analysis) |
| Out-of-memory exceptions or high memory consumption | [Memory Analysis](#memory-analysis) |

## Open app diagnostics
 
1. Go to your Function App resource. In the left menu, select **Diagnose and solve problems**. 

1. Search for "Durable Functions" and select the result.

    :::image type="content" source="media/durable-functions-best-practice/search-for-detector.png" alt-text="Screenshot showing how to search for the Durable Functions detector in Azure Functions app diagnostics.":::

## Durable Functions detector

The Durable Functions detector checks for common problems specific to Durable Functions apps. It reports:

- The Durable Functions extension version your app uses and whether an upgrade is available.
- Performance issues, such as slow orchestrations or high queue latency.
- Errors or warnings from recent orchestration executions.

If issues are found, the detector suggests mitigations and links to relevant documentation. 

:::image type="content" source="media/durable-functions-best-practice/durable-functions-detector.png" alt-text="Screenshot of the Durable Functions detector showing extension version, performance issues, and warnings.":::

## Functions App Down or Reporting Errors

The **Functions App Down or Reporting Errors** detector aggregates results from multiple sub-detectors that check key areas of your application, including platform health, app configuration, and dependency availability. Use this detector when your app is unresponsive or returning unexpected errors.

The following screenshot shows the checks performed and two issues that require attention:

:::image type="content" source="media/durable-functions-best-practice/functions-app-down-report-errors.png" alt-text="Screenshot of the Functions App Down or Report Errors detector showing checks and issues requiring attention.":::

## High CPU Analysis

The **High CPU Analysis** detector identifies which apps or processes are consuming excessive CPU. High CPU usage in Durable Functions apps is often caused by large fan-out operations, tight polling loops, or compute-heavy activity functions.

When the detector identifies a high-CPU app, it shows the affected process and CPU percentage:

:::image type="content" source="media/durable-functions-best-practice/high-cpu-analysis.png" alt-text="Screenshot of the high CPU analysis detector showing an app causing high CPU usage.":::

Select **View Solutions** to see recommended actions. Common suggestions include profiling your application to identify the hot path, or restarting the site to recover from a temporary spike:

:::image type="content" source="media/durable-functions-best-practice/high-cpu-solution.png" alt-text="Screenshot of suggested solution from high CPU analysis detector.":::

## Memory Analysis

The **Memory Analysis** detector monitors memory consumption and flags apps that are approaching or exceeding available memory. Durable Functions apps can experience high memory usage when orchestrations process large payloads or when many orchestration instances run concurrently.

When memory usage is elevated, the detector displays a warning along with a memory usage graph over time:

:::image type="content" source="media/durable-functions-best-practice/memory-analysis.png" alt-text="Screenshot of the memory analysis detector showing a warning and memory usage graph.":::

Select **View Solutions** to see recommended actions. Common suggestions include scaling up to a plan with more memory, or optimizing your orchestrations to reduce payload sizes:

:::image type="content" source="media/durable-functions-best-practice/memory-analysis-solution.png" alt-text="Screenshot of suggested solution from memory analysis detector.":::

## Next steps

- [Diagnostics and monitoring for Durable Functions](durable-functions-diagnostics.md)
- [Performance and scale in Durable Functions](durable-functions-perf-and-scale.md)
- [Troubleshooting guide for Durable Functions](durable-functions-troubleshooting-guide.md)
