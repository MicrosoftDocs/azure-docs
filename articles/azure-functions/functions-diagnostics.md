---
title: Azure Functions diagnostics Overview
description: Learn how you can troubleshoot issues with your function app with Azure Functions diagnostics.
author: yunjchoi

ms.topic: article
ms.date: 11/01/2019
ms.author: yunjchoi
ms.custom: na
# Customer intent: As a developer, I want help diagnosing my function apps so I can more quickly get them back up and running when problems occur.
---
# Azure Functions diagnostics overview

When you’re running a function app, you want to be prepared for any issues that may arise, from 4xx errors to trigger failures. Azure Functions diagnostics is an intelligent and interactive experience to help you troubleshoot your function app with no configuration or extra cost. When you do run into issues with your function app, Azure Functions diagnostics points out what’s wrong. It guides you to the right information to more easily and quickly troubleshoot and resolve the issue. This article shows you the basics of how to use Azure Functions diagnostics to more quickly diagnose and solve common function app issues.

## Start Azure Functions diagnostics

To start Azure Functions diagnostics:

1. Navigate to your function app in the [Azure portal](https://portal.azure.com).
1. Select **Diagnose and solve problems** to open Azure Functions diagnostics.
1. Choose a category that best describes the issue of your function app by using the keywords in the homepage tile. You can also type a keyword that best describes your issue in the search bar. For example, you could type `execution` to see a list of diagnostic reports related to your function app execution and open them directly from the homepage.

   :::image type="content" source="./media/functions-diagnostics/functions-app-search-azure-functions-diagnostics.png" alt-text="Search for Azure Functions diagnostics." border="true":::

## Use the Interactive interface

Once you select a homepage category that best aligns with your function app's problem, Azure Functions diagnostics' interactive interface, named Genie, can guide you through diagnosing and solving problem of your app. You can use the tile shortcuts provided by Genie to view the full diagnostic report of the problem category that you're interested in. The tile shortcuts provide you a direct way of accessing your diagnostic metrics.

:::image type="content" source="./media/functions-diagnostics/genie.png" alt-text="Genie is Azure Functions diagnostics' interface." border="false":::

After selecting a tile, you can see a list of topics related to the issue described in the tile. These topics provide snippets of notable information from the full report. Select any of these topics to investigate the issues further. Also, you can select **View Full Report** to explore all the topics on a single page.

:::image type="content" source="./media/functions-diagnostics/preview-of-diagnostic-report.png" alt-text="Preview of diagnostic report" border="false":::

## View a diagnostic report

After you choose a topic, you can view a diagnostic report specific to your function app. Diagnostic reports use status icons to indicate if there are any specific issues with your app. You see detailed description of the issue, recommended actions, related-metrics, and helpful docs. Customized diagnostic reports are generated from a series of checks run on your function app. Diagnostic reports can be a useful tool for pinpointing problems in your function app and guiding you towards resolving the issue.

## Find the problem code

For script-based functions, you can use **Function Execution and Errors** under **Function App Down or Reporting Errors** to narrow down on the line of code causing exceptions or errors. You can use this tool for getting to the root cause and fixing issues from a specific line of code. This option isn't available for precompiled C# and Java functions.

:::image type="content" source="./media/functions-diagnostics/diagnostic-report-on-function-execution-errors.png" alt-text="Diagnostic report on function execution errors" border="false":::

:::image type="content" source="./media/functions-diagnostics/function-exception.png" alt-text="View of exception details." border="false":::

## Next steps

You can ask questions or provide feedback on Azure Functions diagnostics at [UserVoice](https://feedback.azure.com/d365community/forum/9df02822-f224-ec11-b6e6-000d3a4f0da0). Include `[Diag]` in the title of your feedback.

> [!div class="nextstepaction"]
> [Monitor your function apps](functions-monitoring.md)
