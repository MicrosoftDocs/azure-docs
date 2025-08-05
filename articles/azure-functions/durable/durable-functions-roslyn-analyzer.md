---
title: Durable Functions Roslyn Analyzer (C# only)
description: Learn about how to use the Roslyn Analyzer to help adhere to Durable Functions specific code constraints.
author: amdeel
ms.topic: conceptual
ms.date: 08/05/2025
ms.author: azfuncdf
---

# Durable Functions Rosyln Analyzer (C# only)

The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific [code constraints](./durable-functions-code-constraints.md). This analyzer is *enabled by default* to check your Durable Functions code and generate warnings and errors when there's any. 

## .NET isolated analyzer

Find information (improvements, releases, bug fixes, etc.) about the Roslyn Analyzer for the NET isolated model on [the durabletask-dotnet release notes page](https://github.com/microsoft/durabletask-dotnet/releases).

A list of shipped analyzer rules can be found in the [analyzer release notes](https://github.com/microsoft/durabletask-dotnet/blob/main/src/Analyzers/AnalyzerReleases.Shipped.md).

> [!NOTE]
> The .NET Isolated Roslyn Analyzer is only available starting from [Microsoft.Azure.Functions.Worker.Extensions.DurableTask v1.6.0](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/1.6.0).

## .NET in-process analyzer

Information regarding the Roslyn Analyzer for the **in-process** model can be found on the [Analyzer v0.2.0 release page](https://github.com/Azure/azure-functions-durable-extension/releases/tag/Analyzer-v0.2.0).

The following sections provide configuration instructions for more detailed analysis when using the .NET in-process analyzer. 

### Visual Studio

For the best experience, you'll want to enable full solution analysis in your Visual Studio settings. This can be done by going to **Tools** -> **Options** -> **Text Editor** -> **C#** -> **Advanced** -> **"Entire solution"**:

:::image type="content" source="media/durable-functions-best-practice/roslyn-analyzer-1.png" alt-text="Screenshot of configuring Roslyn Analyzer in Visual Studio.":::

Depending on the version of Visual Studio, you may also see "Enable full solution analysis": 

:::image type="content" source="media/durable-functions-best-practice/roslyn-analyzer-2.png" alt-text="Screenshot of configuring Roslyn Analyzer in another version of Visual Studio.":::

To disable the analyzer, refer to these [instructions](/visualstudio/code-quality/in-source-suppression-overview). 

### Visual Studio Code

Open **Settings** by clicking the wheel icon on the lower left corner, then search for “rosyln”. “Enable Rosyln Analyzers” should show up as one of the results. Check the enable support box.

:::image type="content" source="media/durable-functions-best-practice/roslyn-analyzer-vs-code.png" alt-text="Screenshot of configuring Roslyn Analyzer in Visual Studio Code.":::
::: zone-end
