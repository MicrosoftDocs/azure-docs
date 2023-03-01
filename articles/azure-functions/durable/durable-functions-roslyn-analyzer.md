---
title: Durable Functions Roslyn Analyzer (C# only)
description: Learn about how to use the Roslyn Analyzer to help adhere to Durable Functions specific code constraints.
author: amdeel
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Durable Functions Rosyln Analyzer (C# only)

The Durable Functions Roslyn Analyzer is a live code analyzer that guides C# users to adhere to Durable Functions specific [code constraints](./durable-functions-code-constraints.md). When you enable this analyzer, it checks your Durable Functions code by default and produces custom diagnostics. For more information about the analyzer (diagnostic information, releases, bug fixes, etc.), refer to [GitHub releases page](https://github.com/Azure/azure-functions-durable-extension/releases?q=roslyn+analyzer&expanded=true). 


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
