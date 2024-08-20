---
title: Monitor and analyze runtime behavior with Code Optimizations (Preview)
description: Identify and remove CPU and memory bottlenecks using Azure Monitor's Code Optimizations feature
ms.topic: conceptual
ms.service: azure-monitor
ms.subservice: optimization-insights
author: hhunter-ms
ms.author: hannahhunter
ms.date: 06/25/2024
ms.reviewer: ryankahng
ms.collection: ce-skilling-ai-copilot
---

# Monitor and analyze runtime behavior with Code Optimizations (Preview)

Code Optimizations, an AI-based service in Azure Application Insights, works in tandem with the Application Insights Profiler to detect CPU and memory usage performance issues at a code level and provide recommendations on how to fix them. Code Optimizations identifies these CPU and memory bottlenecks by:

- Analyzing the runtime behavior of your application.
- Comparing the behavior to performance engineering best practices.

Make informed decisions and optimize your code using real-time performance data and insights gathered from your production environment.

[You can review your Code Optimizations in the Azure portal.](https://aka.ms/codeoptimizations)

## Demo video

> [!VIDEO https://www.youtube-nocookie.com/embed/eu1P_vLTZO0]

## Requirements for using Code Optimizations

Before you can use Code Optimizations on your application:

- [Enable the Application Insights Profiler](../profiler/profiler-overview.md).
- Verify your application:
  - Is .NET.
  - Uses [Application Insights](../app/app-insights-overview.md).
  - Is collecting profiles.

## Application Insights Profiler vs. Code Optimizations

Application Insights Profiler and Code Optimizations work together to provide a holistic approach to performance issue detection.

### Application Insights Profiler
[The Profiler](../profiler/profiler-overview.md) focuses on tracing specific requests, down to the millisecond. It provides an excellent "big picture" view of issues within your application and general best practices to address them.

### Code Optimizations
[Code Optimizations](https://aka.ms/codeoptimizations) analyzes the profiling data collected by the Application Insights Profiler. As the Profiler uploads data to Application Insights, our machine learning model analyzes some of the data to find where the application's code can be optimized. Code Optimizations:

- Displays aggregated data gathered over time.
- Connects data with the methods and functions in your application code.
- Narrows down the culprit by finding bottlenecks within the code.

## Cost and overhead

Code Optimizations are generated automatically after [Application Insights Profiler is enabled](../profiler/profiler-overview.md#sampling-rate-and-overhead). It incurs no extra cost to you as it analyzes performance issues and generates performance recommendations. Some features (such as code-level fix suggestions) require [Copilot for GitHub](https://docs.github.com/copilot/about-github-copilot/what-is-github-copilot) and/or [Copilot for Azure](../../copilot/overview.md). 

## Supported regions

Code Optimizations is available in the same regions as Application Insights. You can check the available regions using the following command:

```sh
az account list-locations -o table
```

You can set an explicit region using connection strings. [Learn more about connection strings with examples.](../app/sdk-connection-string.md#connection-string-examples)

## Next steps

> [!div class="nextstepaction"]
> [Set up Code Optimizations](set-up-code-optimizations.md)


## Related links

Get started with Code Optimizations by enabling the following features on your application:
- [Application Insights](../app/create-workspace-resource.md)
- [Application Insights Profiler](../profiler/profiler-overview.md)

Running into issues? Check the [Troubleshooting guide](./code-optimizations-troubleshoot.md)