---
title: Durable Functions Roslyn Analyzer (C# only)
description: Learn about how to use the Roslyn Analyzer to help adhere to Durable Functions specific code constraints.
author: amdeel
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Durable Functions Rosyln Analyzer (C# only)

The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific [code constraints](./durable-functions-code-constraints.md). This analyzer is enabled by default to check your Durable Functions code and generates warnings and errors when there's any. Note that this analyzer works only if you're using the .NET in-process worker; it doesn't support the isolated-worker now. 

For more detailed information on the analyzer (diagnostic information, releases, bug fixes, etc.), see these [release notes](https://github.com/Azure/azure-functions-durable-extension/releases/tag/Analyzer-v0.2.0).


## Configuration

### Visual Studio

For the best experience, you'll want to enable full solution analysis in your Visual Studio settings. This can be done in Tools -> Options -> Text Editor -> C# -> Advanced -> "Entire solution":

:::image type="content" source="media/durable-functions-best-practice/roslyn-analyzer-1.png" alt-text="Screenshot of configuring Roslyn Analyzer in Visual Studio.":::

Depending on the version of Visual Studio, you may also see "Enable full solution analysis": 

:::image type="content" source="media/durable-functions-best-practice/roslyn-analyzer-2.png" alt-text="Screenshot of configuring Roslyn Analyzer in another version of Visual Studio.":::

For information to disable the analyzer, refer to these [instructions](/visualstudio/code-quality/in-source-suppression-overview.md). 

### Visual Studio Code

Open Settings by clicking the wheel icon on the lower left corner. Search for “rosyln” and “Enable Rosyln Analyzers” should show up as one of the results. Check the enable support box.

:::image type="content" source="media/durable-functions-best-practice/roslyn-analyzer-vscode.png" alt-text="Screenshot of configuring Roslyn Analyzer in Visual Studio Code.":::
