---
title: Azure Functions app diagnostics 
description: Learn how to use Azure Functions diagnostic feature on Azure portal to diagnose problems with Durable Functions.
author: bachuv
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Azure Functions app diagnostics 

Azure Functions App Diagnostics is a useful resource in the Azure portal for monitoring and diagnosing potential issues in your Durable Functions application. Not only does it help diagnose problems, but it also provides potential solutions and/or relevant documentation to help you resolve issues faster. 

## How to use Azure Functions app diagnostics
 
1. Go to your Function App resource. In the left menu, select **Diagnose and solve problems**. 

2. Search for “Durable Functions” and select on the result.

    :::image type="content" source="media/durable-functions-best-practice/search-for-detector.png" alt-text="Screenshot showing how to search for Durable Functions detector.":::

3. You're now inside the Durable Functions detector, which checks for common problems Durable Functions apps tend to have. The detector also gives you links to tools and documentation you might find helpful. Go through the various insights in the detector to learn about the application’s health. Some examples of what the detector tells you include the Durable Functions extension version your app is using, performance issues, and any errors or warnings. If there are issues, you'll see suggestions on how to mitigate and resolve them.

    :::image type="content" source="media/durable-functions-best-practice/durable-functions-detector.png" alt-text="Screenshot of Durable Functions detector.":::
 
## Other useful detectors
On the left side of the window, there's a list of detectors designed to check for different problems. This section highlights a few. 

The *Functions App Down or Report Errors* detector pulls results from different detectors checking key areas of your application that may be the cause of your application being down or reporting errors. The screenshot below shows the checks performed (not all 15 are captured in the screenshot) and the two issues requiring attention. 

:::image type="content" source="media/durable-functions-best-practice/functions-app-down-report-errors.png" alt-text="Screenshot of Durable Functions App Down or Report Errors detector.":::


Maximizing *High CPU Analysis* shows that one app is causing high CPU usage. 

:::image type="content" source="media/durable-functions-best-practice/high-cpu-analysis.png" alt-text="Screenshot of Durable Functions high CPU analysis detector.":::

The following is suggested when clicking "View Solutions". If you decide to follow the second option, you can easily restart your site by clicking the button. 

:::image type="content" source="media/durable-functions-best-practice/high-cpu-solution.png" alt-text="Screenshot of suggested solution from high CPU analysis detector.":::

 
Maximizing *Memory Analysis* shows the following warning and graph. (Note that there's more content not captured in the screenshot.)

:::image type="content" source="media/durable-functions-best-practice/memory-analysis.png" alt-text="Screenshot of Durable Functions memory analysis detector.":::

The following is suggested when clicking "View Solutions". You can easily scale up by clicking a button. 

:::image type="content" source="media/durable-functions-best-practice/memory-analysis-solution.png" alt-text="Screenshot of suggested solution from memory analysis detector.":::
