---
title: Azure Functions app diagnostics 
description: Learn how to use Azure Functions diagnostic feature on Azure portal to diagnose problems with Durable Functions.
author: bachuv
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Azure Functions app diagnostics 

Azure Functions App Diagnostics is a useful resource on Azure portal for monitoring and diagnosing potential issues in your Durable Functions application. Not only does it help diagnose problems, but it also provides potential solutions and/or relevant documentations to help you resolve issues faster. 

## How to use Azure Functions app diagnostics
 
1.	Go to your Function App resource. In the left menu, select “Diagnose and solve problems”. 

2.	Search for “Durable Functions” and select on the result.

    :::image type="content" source="media/durable-functions-best-practice/search-for-detector.png" alt-text="Screenshot showing how to search for Durable Functions detector.":::

3.	You're now inside the Durable Functions detector, and as the name suggests, it detects potential problems in your Durable Functions application. Go through the various insights in the detector to learn about the application’s health. Examples of what the detector tells you include: Durable Functions version your app is running on, any errors or warnings, and performance issues. If there are issues, you'll see suggestions on how to mitigate and resolve the issue.

    :::image type="content" source="media/durable-functions-best-practice/durable-functions-detector.png" alt-text="Screenshot of Durable Functions detector.":::
 
 
**Other useful detectors**
- High CPU Analysis

    An example of what this detector would suggest based on CPU analysis.
    
    :::image type="content" source="media/durable-functions-best-practice/high-cpu-analysis.png" alt-text="Screenshot of Durable Functions high CPU analysis detector.":::

- Functions App Down or Report Errors detector
- Memory Analysis
 
