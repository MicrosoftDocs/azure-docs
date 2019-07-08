---
title: Monitoring usage and performance for Windows desktop apps
description: Analyze usage and performance of your Windows desktop app with Application Insights.
services: application-insights
documentationcenter: windows
author: mrbullwinkle
manager: carmonm
ms.assetid: 19040746-3315-47e7-8c60-4b3000d2ddc4
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 05/15/2018
ms.author: mbullwin
---
# Monitoring usage and performance in Classic Windows Desktop apps

Applications hosted on premises, in Azure, and in other clouds can all take advantage of Application Insights. The only limitation is the need to [allow communication](../../azure-monitor/app/ip-addresses.md) to the Application Insights service. For monitoring Universal Windows Platform (UWP) applications, we recommend [Visual Studio App Center](../../azure-monitor/learn/mobile-center-quickstart.md).

## To send telemetry to Application Insights from a Classic Windows application
1. In the [Azure portal](https://portal.azure.com), [create an Application Insights resource](../../azure-monitor/app/create-new-resource.md ). For application type, choose ASP.NET app.
2. Take a copy of the Instrumentation Key. Find the key in the Essentials drop-down of the new resource you just created. 
3. In Visual Studio, edit the NuGet packages of your app project, and add Microsoft.ApplicationInsights.WindowsServer. (Or choose Microsoft.ApplicationInsights if you just want the bare API, without the standard telemetry collection modules.)
4. Set the instrumentation key either in your code:
   
    `TelemetryConfiguration.Active.InstrumentationKey = "` *your key* `";`
   
    or in ApplicationInsights.config (if you installed one of the standard telemetry packages):
   
    `<InstrumentationKey>`*your key*`</InstrumentationKey>` 
   
    If you use ApplicationInsights.config, make sure its properties in Solution Explorer are set to **Build Action = Content, Copy to Output Directory = Copy**.
5. [Use the API](../../azure-monitor/app/api-custom-events-metrics.md) to send telemetry.
6. Run your app, and see the telemetry in the resource you created in the Azure portal.

## <a name="telemetry"></a>Example code
```csharp

    public partial class Form1 : Form
    {
        private TelemetryClient tc = new TelemetryClient();
        ...
        private void Form1_Load(object sender, EventArgs e)
        {
            // Alternative to setting ikey in config file:
            tc.InstrumentationKey = "key copied from portal";

            // Set session data:
            tc.Context.User.Id = Environment.UserName;
            tc.Context.Session.Id = Guid.NewGuid().ToString();
            tc.Context.Device.OperatingSystem = Environment.OSVersion.ToString();

            // Log a page view:
            tc.TrackPageView("Form1");
            ...
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            stop = true;
            if (tc != null)
            {
                tc.Flush(); // only for desktop apps

                // Allow time for flushing:
                System.Threading.Thread.Sleep(1000);
            }
            base.OnClosing(e);
        }

```

## Next steps
* [Create a dashboard](../../azure-monitor/app/overview-dashboard.md)
* [Diagnostic Search](../../azure-monitor/app/diagnostic-search.md)
* [Explore metrics](../../azure-monitor/app/metrics-explorer.md)
* [Write Analytics queries](../../azure-monitor/app/analytics.md)

