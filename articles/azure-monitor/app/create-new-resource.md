---
title: Create a new Azure Application Insights resource | Microsoft Docs
description: Manually set up Application Insights monitoring for a new live application.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: 878b007e-161c-4e36-8ab2-3d7047d8a92d
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/10/2019
ms.author: mbullwin

---
# Create an Application Insights resource
Azure Application Insights displays data about your application in a Microsoft Azure *resource*. Creating a new resource is therefore part of [setting up Application Insights to monitor a new application][start]. In many cases, creating a resource can be done automatically by the IDE. But in some cases, you create a resource manually - for example, to have separate resources for development and production builds of your application.

After you have created the resource, you get its instrumentation key and use that to configure the SDK in the application. The instrumentation key links the telemetry to the resource.

## Sign up to Microsoft Azure
If you haven't got a [Microsoft account, get one now](https://live.com). (If you use services like Outlook.com, OneDrive, Windows Phone, or XBox Live, you already have a Microsoft account.)

You also need a subscription to [Microsoft Azure](https://azure.com). If your team or organization has an Azure subscription, the owner can add you to it, using your Windows Live ID. You're only charged for what you use. The default basic plan allows for a certain amount of experimental use free of charge.

When you've got access to a subscription, sign in to Application Insights at [https://portal.azure.com](https://portal.azure.com), and use your Live ID to sign in.

## Create an Application Insights resource
In [portal.azure.com](https://portal.azure.com), create an Application Insights resource:

![Click the `+` sign in the upper left corner. Select Developer Tools followed by Application Insights](./media/create-new-resource/new-app-insights.png)

   | Settings        |  Value           | Description  |
   | ------------- |:-------------|:-----|
   | **Name**      | Globally Unique Value | Name that identifies the app you are monitoring. |
   | **Resource Group**     | myResourceGroup      | Name for the new or existing resource group to host App Insights data. |
   | **Location** | East US | Choose a location near you, or near where your app is hosted. |

Enter values into the required fields, and then select **Review + create**.

![Enter values into required fields, and then select "review + create".](./media/create-new-resource/review-create.png)

When your app has been created, a new blade opens. This blade is where you see performance and usage data about your app. 

## Copy the instrumentation key
The instrumentation key identifies the resource that you created. You need it to give to the SDK.

![Click Essentials, click the Instrumentation Key, CTRL+C](./media/create-new-resource/02-props.png)

## Install the SDK in your app
Install the Application Insights SDK in your app. This step depends heavily on the type of your application. 

Use the instrumentation key to configure [the SDK that you install in your application][start].

The SDK includes standard modules that send telemetry without you having to write any code. To track user actions or diagnose issues in more detail, [use the API][api] to send your own telemetry.

## <a name="monitor"></a>See telemetry data
Close the quickstart blade to return to your application blade in the Azure portal.

Click the Search tile to see [Diagnostic Search][diagnostic], where the first events appear. 

If you're expecting more data, click **Refresh** after a few seconds.

## Creating a resource automatically
You can write a [PowerShell script](../../azure-monitor/app/powershell.md) to create a resource automatically.

## Next steps
* [Diagnostic Search](../../azure-monitor/app/diagnostic-search.md)
* [Explore metrics](../../azure-monitor/app/metrics-explorer.md)
* [Write Analytics queries](../../azure-monitor/app/analytics.md)

<!--Link references-->

[api]: ../../azure-monitor/app/api-custom-events-metrics.md
[diagnostic]: ../../azure-monitor/app/diagnostic-search.md
[metrics]: ../../azure-monitor/app/metrics-explorer.md
[start]: ../../azure-monitor/app/app-insights-overview.md