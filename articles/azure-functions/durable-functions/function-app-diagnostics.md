---
title: Azure Functions app diagnostics 
description: Learn how to use the Azure Functions diagnostic feature in the Azure portal to diagnose problems with Durable Functions.
author: bachuv
ms.topic: concept-article
ms.service: azure-functions
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Azure Functions app diagnostics 

Azure Functions app diagnostics is a useful resource in the Azure portal for monitoring and diagnosing potential issues in your Durable Functions application. It helps diagnose problems and provides potential solutions or relevant documentation to help you resolve issues faster. 

## How to use Azure Functions app diagnostics
 
1. Go to your Function App resource. In the left menu, select **Diagnose and solve problems**. 

2. Search for "Durable Functions" and select the result.

    :::image type="content" source="media/durable-functions-best-practice/search-for-detector.png" alt-text="Screenshot showing how to search for Durable Functions detector.":::

3. You're now inside the Durable Functions detector, which checks for common problems in Durable Functions apps. The detector also provides links to tools and documentation that can help. Review the various insights in the detector to learn about the application's health. For example, the detector reports the Durable Functions extension version your app is using, performance issues, and any errors or warnings. If there are issues, you see suggestions on how to mitigate and resolve them.

    :::image type="content" source="media/durable-functions-best-practice/durable-functions-detector.png" alt-text="Screenshot of Durable Functions detector.":::
 
## Other useful detectors
The left pane lists detectors designed to check for different problems. This section highlights a few.

The *Functions App Down or Report Errors* detector pulls results from different detectors that check key areas of your application that might cause your application to be down or report errors. The following screenshot shows the checks performed and the two issues requiring attention. 

:::image type="content" source="media/durable-functions-best-practice/functions-app-down-report-errors.png" alt-text="Screenshot of Durable Functions App Down or Report Errors detector.":::


Expanding *High CPU Analysis* shows that one app is causing high CPU usage. 

:::image type="content" source="media/durable-functions-best-practice/high-cpu-analysis.png" alt-text="Screenshot of Durable Functions high CPU analysis detector.":::

The following solution is suggested when you select **View Solutions**. If you decide to follow the second option, you can restart your site by selecting the button. 

:::image type="content" source="media/durable-functions-best-practice/high-cpu-solution.png" alt-text="Screenshot of suggested solution from high CPU analysis detector.":::

 
Expanding *Memory Analysis* shows the following warning and graph.

:::image type="content" source="media/durable-functions-best-practice/memory-analysis.png" alt-text="Screenshot of Durable Functions memory analysis detector.":::

The following solution is suggested when you select **View Solutions**. You can scale up by selecting a button. 

:::image type="content" source="media/durable-functions-best-practice/memory-analysis-solution.png" alt-text="Screenshot of suggested solution from memory analysis detector.":::
