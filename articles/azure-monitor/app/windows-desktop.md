---
title: Monitoring usage and performance for Windows desktop apps
description: Analyze usage and performance of your Windows desktop app with Application Insights.
ms.service:  azure-monitor
ms.subservice: application-insights
ms.topic: conceptual
author: mrbullwinkle
ms.author: mbullwin
ms.date: 10/29/2019

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
using Microsoft.ApplicationInsights;

    public partial class Form1 : Form
    {
        private TelemetryClient tc = new TelemetryClient();
        ...
        private void Form1_Load(object sender, EventArgs e)
        {
            // Alternative to setting ikey in config file:
            tc.InstrumentationKey = "key copied from portal";

            // Set session data:
            tc.Context.Session.Id = Guid.NewGuid().ToString();
            tc.Context.Device.OperatingSystem = Environment.OSVersion.ToString();

            // Log a page view:
            tc.TrackPageView("Form1");
            ...
        }

        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            e.Cancel = true;

            if (tc != null)
            {
                tc.Flush(); // only for desktop apps

                // Allow time for flushing:
                System.Threading.Thread.Sleep(1000);
            }
            base.OnClosing(e);
        }

```

## Override storage of computer name

By default this SDK will collect and store the computer name of the system emitting telemetry. To override collection you need to use a telemetry Initializer:

**Write custom TelemetryInitializer as below.**

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

namespace CustomInitializer.Telemetry
{
    public class MyTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            if (string.IsNullOrEmpty(telemetry.Context.Cloud.RoleName))
            {
                //set custom role name here, you can pass an empty string if needed.
                  telemetry.Context.Cloud.RoleInstance = "Custom RoleInstance";
            }
        }
    }
}
```
Instantiate the initializer in the `Program.cs` `Main()` method below setting the instrumentation key:

```csharp
 using Microsoft.ApplicationInsights.Extensibility;
 using CustomInitializer.Telemetry;

   static void Main()
        {
            TelemetryConfiguration.Active.InstrumentationKey = "{Instrumentation-key-here}";
            TelemetryConfiguration.Active.TelemetryInitializers.Add(new MyTelemetryInitializer());
        }
```

## Next steps
* [Create a dashboard](../../azure-monitor/app/overview-dashboard.md)
* [Diagnostic Search](../../azure-monitor/app/diagnostic-search.md)
* [Explore metrics](../../azure-monitor/app/metrics-explorer.md)
* [Write Analytics queries](../../azure-monitor/app/analytics.md)

