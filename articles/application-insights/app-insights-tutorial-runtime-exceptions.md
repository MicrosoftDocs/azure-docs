---
title: Diagnose run-time exceptions using Azure Application Insights | Microsoft Docs
description: Tutorial to find and diagnose run-time exceptions in your application using Azure Application Insights.
services: application-insights
keywords:
author: bwren
ms.author: bwren
ms.date: 09/18/2017
ms.service: application-insights
ms.custom: mvc
ms.topic: article
manager: carmonm
---

# Find and diagnose run-time exceptions with Azure Application Insights

Azure Application Insights collects telemetry from your application to help identify and diagnose run-time exceptions.  This tutorial takes you through this process with your application.  You learn how to:

> [!div class="checklist"]
> * Modify your project to enable exception tracking
> * Identify exceptions for different components of your application
> * View details of an exception
> * Download a snapshot of the exception to Visual Studio for debugging
> * Analyze details of failed requests using query language
> * Create a new work item to correct the faulty code


## Prerequisites

To complete this tutorial:

- Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
	- ASP.NET and web development
	- Azure development
- Download and install the [Visual Studio Snapshot Debugger](http://aka.ms/snapshotdebugger).
- Deploy a .NET application to Azure and [enable the Application Insights SDK](app-insights-asp-net.md). 

## Analyze failures
Application Insights collects any failures in your application and lets you view their frequency across different operations to help you focus your efforts on those with the highest impact.  You can then drill down on details of these failures to identify root cause.   

1. Log in to the Azure portal, select **Application Insights**, and then select your subscription.  
1. To open the **Failures** blade either select **Failures** under the **Investigate** menu or click the **Failed requests** graph.

	![Failed requests](media/app-insights-tutorial-runtime-exceptions/failed-requests.png)

2. The **Failed requests** blade shows the count of failed requests and the number of users affected for each operation for the application.  By sorting this information by user you can identify those failures that most impact users.  In this example, the **GET Employees/Create** and **GET Customers/Details** are likely candidates to investigate because of their large number of failures and impacted users.  Selecting an operation shows further information about this operation in the right blade.

	![Failed requests blade](media/app-insights-tutorial-runtime-exceptions/failed-requests-blade.png)

3. Reduce the time window to zoom in on the period where the failure rate shows a spike.

	![Failed requests window](media/app-insights-tutorial-runtime-exceptions/failed-requests-window.png)

4. Click **View Details** to see the details for the operation.  This includes a Gannt chart that shows two failed dependencies which collectively took almost half of a second to complete.  You can find out more about analyzing performance issues by completing the tutorial [Find and diagnose performance issues with Azure Application Insights]().

	![Failed requests details](media/app-insights-tutorial-runtime-exceptions/failed-requests-details.png)

5. The operations detail also shows a FormatException which appears to have caused the failure.  Click on the exception or on the **Top 3 exception types** count to view its details.  You can see that it's due to an invalid zip code.

	![Exception details](media/app-insights-tutorial-runtime-exceptions/failed-requests-exception.png)



## Identify failing code
The Snapshot Debugger collects snapshots of the most frequent exceptions in your application to assist you in diagnosing its root cause in production.  You can view debug snapshots in the portal to see the call stack and inspect variables at each call stack frame. You can then debug the source code by downloading the snapshot and opening it in Visual Studio 2017.

1. In the properties of the exception, click on **Open debug snapshot**.
2. The **Debug Snapshot** blade opens with the call stack for the request.  Click on any method to view the values of all local variables at the time of the request.  Starting from the top method in this example, we can see local variables that have no value.

	![Debug snapshot](media/app-insights-tutorial-runtime-exceptions/debug-snapshot-01.png)

4. The first call that has valid values is **ValidZipCode**, and we can see that a zip code was provided with letters that isn't able to be translated into an integer.  This appears to be the error in the code that needs to be corrected.

	![Debug snapshot](media/app-insights-tutorial-runtime-exceptions/debug-snapshot-02.png)

5. To download this snapshot into Visual Studio where we can locate the actual code that needs to be corrected, click **Download Snapshot**.
6. The snapshot is loaded into Visual Studio.
7. You can now run a debug session in Visual Studio that quickly identifies the line of code that caused the exception.

	![Exception in code](media/app-insights-tutorial-runtime-exceptions/exception-code.png)


## Use analytics data
All data collected by Application Insights is stored in Azure Log Analytics, which provides a rich query language that allows you to analyze the data in a variety of ways.  We can use this data to analyze the requests that generated the exception we're researching. 

8. Click on the CodeLens information above the code to view telemetry provided by Application Insights.

	![Code](media/app-insights-tutorial-runtime-exceptions/codelens.png)

9. Click **Analyze impact** to open Application Insights Analytics.  It's populated with several queries that provide details on failed requests such as impacted users, browsers, and regions.<br><br>![Analytics](media/app-insights-tutorial-runtime-exceptions/analytics.png)<br>

## Add work item
If you connect Application Insights to a tracking system such as Visual Studio Team Services or GitHub, you can create a work item directly from Application Insights.

1. Return to the **Exception Properties** blade in Application Insights.
2. Click **+ New Work Item**.
3. The **New Work Item** blade opens with details about the exception already populated.  You can add any additional information before saving it.

	![New Work Item](media/app-insights-tutorial-runtime-exceptions/new-work-item.png)

## Next steps
Now that you've learned how to identify run-time exceptions, advance to the next tutorial to learn how to identify and diagnose performance issues.

> [!div class="nextstepaction"]
> [Identify performance issues]()