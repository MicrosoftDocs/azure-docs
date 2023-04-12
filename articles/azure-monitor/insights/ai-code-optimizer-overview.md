---
title: Monitor and analyze runtime behavior with AI Code Optimizer (Preview)
description: Identify and remove CPU and memory bottlenecks using Azure Monitor's AI Code Optimizer feature
ms.topic: conceptual
author: hhunter-ms
ms.author: hannahhunter
ms.date: 04/10/2023
ms.reviewer: ryankahng
---

# Monitor and analyze runtime behavior with AI Code Optimizer (Preview)

AI Code Optimizer, an AI-based service in Azure Application Insights, works in tandem with the Application Insights Profiler to help you help create better and more efficient applications. 

With its advanced AI algorithms, AI Code Optimizer detects CPU and memory usage performance issues at a code level and provides recommendations on how to fix them. AI Code Optimizer identifies these CPU and memory bottlenecks by:

- Analyzing the runtime behavior of your application.
- Comparing the behavior to performance engineering best practices.

With AI Code Optimizer, you can:
- View real-time performance data and insights gathered from your production environment. 
- Make informed decisions about optimizing your code.

## Requirements for using AI Code Optimizer

Before you can use AI Code Optimizer on your application:

- [Enable the Application Insights Profiler](../profiler/profiler-overview.md).
- Verify your application:
  - Is .NET.
  - Uses [Application Insights](../app/app-insights-overview.md).

## Application Insights Profiler vs. AI Code Optimizer

Application Insights Profiler and AI Code Optimizer work together to provide a holistic approach to performance issue detection.

### Application Insights Profiler
[The Profiler](../profiler/profiler-overview.md) focuses on tracing specific requests, down to the millisecond. It provides an excellent "big picture" view of issues within your application and general best practices to address them.

### AI Code Optimizer
AI Code Optimizer analyzes the profiling data collected by the Application Insights Profiler. As the Profiler uploads data to Application Insights, our machine learning model analyzes some of the data to find where the application's code can be optimized. AI Code Optimizer:

- Displays aggregated data gathered over time.
- Connects data with the methods and functions in your application code.
- Narrows down the culprit by finding bottlenecks within the code.

## Cost

While AI Code Optimizer incurs no extra costs, you may encounter [indirect costs associated with Application Insights](/azure/azure-monitor/faq#is-it-free-). 

## Supported regions

AI Code Optimizer is available in the same regions as Application Insights. You can check the available regions using the following command:

```sh
az account list-locations -o table
```

You can set an explicit region using connection strings. [Learn more about connection strings with examples.](../app/sdk-connection-string.md#connection-string-examples)

## Access AI Code Optimizer results

You can access AI Code Optimizer through the **Performance** blade from the left navigation pane and select **AI Code Optimizer (preview)** from the top menu.

:::image type="content" source="./media/ai-code-optimizer-overview/ai-code-optimizer-performance-blade.png" alt-text="Screenshot of AI Code Optimizer located in the Performance blade.":::

### Interpret estimated Memory and CPU percentages

The estimated CPU and Memory are determined based on the amount of activity in your application. In addition to the Memory and CPU percentages, AI Code Optimizer also includes:

- The actual allocation sizes (in bytes)
- A breakdown of the allocated types made within the call

#### Memory
For Memory, the number is just a percentage of all allocations made within the trace. For example, if an issue takes 24% memory, you spent 24% of all your allocations within that call.

#### CPU
For CPU, the percentage is based on the number of CPUs in your machine (four core, eight core, etc.) and the trace time. For example, let's say your trace is 10 seconds long and you have 4 CPUs, you have a total of 40 seconds of CPU time. If the insight says the line of code is using 5% of the CPU, it’s using 5% of 40 seconds, or 2 seconds.

### Filter and sort results

On the AI Code Optimizer page, you can filter the results by:

- Using the search bar to filter by field.
- Setting the time range via the **Time Range** drop-down menu.
- Selecting the corresponding role from the **Role** drop-down menu.

You can also sort columns in the insights results based on:

- Type (memory or CPU).
- Issue frequency within a specific time period (count).
- Corresponding role, if your service has multiple roles (role).

:::image type="content" source="./media/ai-code-optimizer-overview/ai-code-optimizer-filter.png" alt-text="Screenshot of available filters for AI Code Optimizer results.":::

### View insights

After sorting and filtering the AI Code Optimizer results, you can then select each insight to view the following details in a pane:

- Detailed description of the performance bug insight.
- The full call stack.
- Recommendations on how to fix the performance issue.

:::image type="content" source="./media/ai-code-optimizer-overview/ai-code-optimizer-details.png" alt-text="Screenshot of the detail pane for a specific AI Code Optimizer C-P-U result.":::

#### Call stack

In the insights details pane, under the **Call Stack** heading, you can:

- Select **Expand** to view the full call stack surrounding the performance issue
- Select **Copy** to copy the call stack.

:::image type="content" source="./media/ai-code-optimizer-overview/ai-code-optimizer-call-stack-2.png" alt-text="Screenshot of the call stack heading in the detail pane for the specific C-P-U result from earlier.":::

:::image type="content" source="./media/ai-code-optimizer-overview/ai-code-optimizer-call-stack.png" alt-text="Screenshot of the expanded call stack for the specific C-P-U result from earlier.":::

#### Trend impact

You can also view a graph depicting a specific performance issue's impact and threshold. The trend impact results vary depending on the filters you've set. For example, a CPU `String.SubString()` performance issue's insights seen over a seven day time frame may look like:

:::image type="content" source="./media/ai-code-optimizer-overview/ai-code-optimizer-trend-impact.png" alt-text="Screenshot of the C-P-U trend impact over the course of seven days.":::


## Next Steps

Get started with AI Code Optimizer by enabling the following features on your application:
- [Application Insights](../app/create-workspace-resource.md)
- [Application Insights Profiler](../profiler/profiler-overview.md)