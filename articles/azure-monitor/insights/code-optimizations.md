---
title: Monitor and analyze runtime behavior with Code Optimizations (Preview)
description: Identify and remove CPU and memory bottlenecks using Azure Monitor's Code Optimizations feature
ms.topic: conceptual
ms.service: azure-monitor
ms.subservice: optimization-insights
author: hhunter-ms
ms.author: hannahhunter
ms.date: 07/24/2023
ms.reviewer: ryankahng
---

# Monitor and analyze runtime behavior with Code Optimizations (Preview)

Code Optimizations, an AI-based service in Azure Application Insights, works in tandem with the Application Insights Profiler to help you help create better and more efficient applications. 

With its advanced AI algorithms, Code Optimizations detects CPU and memory usage performance issues at a code level and provides recommendations on how to fix them. Code Optimizations identifies these CPU and memory bottlenecks by:

- Analyzing the runtime behavior of your application.
- Comparing the behavior to performance engineering best practices.

With Code Optimizations, you can:
- View real-time performance data and insights gathered from your production environment. 
- Make informed decisions about optimizing your code.

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
Code Optimizations analyzes the profiling data collected by the Application Insights Profiler. As the Profiler uploads data to Application Insights, our machine learning model analyzes some of the data to find where the application's code can be optimized. Code Optimizations:

- Displays aggregated data gathered over time.
- Connects data with the methods and functions in your application code.
- Narrows down the culprit by finding bottlenecks within the code.

## Cost

While Code Optimizations incurs no extra costs, you may encounter [indirect costs associated with Application Insights](../best-practices-cost.md#is-application-insights-free). 

## Supported regions

Code Optimizations is available in the same regions as Application Insights. You can check the available regions using the following command:

```sh
az account list-locations -o table
```

You can set an explicit region using connection strings. [Learn more about connection strings with examples.](../app/sdk-connection-string.md#connection-string-examples)

## Access Code Optimizations results

You can access Code Optimizations through the **Performance** blade from the left navigation pane and select **Code Optimizations (preview)** from the top menu.

:::image type="content" source="./media/code-optimizations/code-optimizations-performance-blade.png" alt-text="Screenshot of Code Optimizations located in the Performance blade.":::

### Interpret estimated Memory and CPU percentages

The estimated CPU and Memory are determined based on the amount of activity in your application. In addition to the Memory and CPU percentages, Code Optimizations also includes:

- The actual allocation sizes (in bytes)
- A breakdown of the allocated types made within the call

#### Memory
For Memory, the number is just a percentage of all allocations made within the trace. For example, if an issue takes 24% memory, you spent 24% of all your allocations within that call.

#### CPU
For CPU, the percentage is based on the number of CPUs in your machine (four core, eight core, etc.) and the trace time. For example, let's say your trace is 10 seconds long and you have 4 CPUs, you have a total of 40 seconds of CPU time. If the insight says the line of code is using 5% of the CPU, it’s using 5% of 40 seconds, or 2 seconds.

### Filter and sort results

On the Code Optimizations page, you can filter the results by:

- Using the search bar to filter by field.
- Setting the time range via the **Time Range** drop-down menu.
- Selecting the corresponding role from the **Role** drop-down menu.

You can also sort columns in the insights results based on:

- Type (memory or CPU).
- Issue frequency within a specific time period (count).
- Corresponding role, if your service has multiple roles (role).

:::image type="content" source="./media/code-optimizations/code-optimizations-filter.png" alt-text="Screenshot of available filters for Code Optimizations results.":::

### View insights

After sorting and filtering the Code Optimizations results, you can then select each insight to view the following details in a pane:

- Detailed description of the performance bug insight.
- The full call stack.
- Recommendations on how to fix the performance issue.

:::image type="content" source="./media/code-optimizations/code-optimizations-details.png" alt-text="Screenshot of the detail pane for a specific Code Optimizations C-P-U result.":::

#### Call stack

In the insights details pane, under the **Call Stack** heading, you can:

- Select **Expand** to view the full call stack surrounding the performance issue
- Select **Copy** to copy the call stack.

:::image type="content" source="./media/code-optimizations/code-optimizations-call-stack-2.png" alt-text="Screenshot of the call stack heading in the detail pane for the specific C-P-U result from earlier.":::

:::image type="content" source="./media/code-optimizations/code-optimizations-call-stack.png" alt-text="Screenshot of the expanded call stack for the specific C-P-U result from earlier.":::

#### Trend impact

You can also view a graph depicting a specific performance issue's impact and threshold. The trend impact results vary depending on the filters you've set. For example, a CPU `String.SubString()` performance issue's insights seen over a seven day time frame may look like:

:::image type="content" source="./media/code-optimizations/code-optimizations-trend-impact.png" alt-text="Screenshot of the C-P-U trend impact over the course of seven days.":::


## Next Steps

Get started with Code Optimizations by enabling the following features on your application:
- [Application Insights](../app/create-workspace-resource.md)
- [Application Insights Profiler](../profiler/profiler-overview.md)

Running into issues? Check the [Troubleshooting guide](/troubleshoot/azure/azure-monitor/app-insights/code-optimizations-troubleshooting)