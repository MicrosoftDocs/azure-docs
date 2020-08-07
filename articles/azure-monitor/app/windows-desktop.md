---
title: Monitoring usage and performance for Windows desktop apps
description: Analyze usage and performance of your Windows desktop app with Application Insights.
ms.topic: conceptual
ms.date: 06/11/2020

---

# Monitoring usage and performance in Classic Windows Desktop apps

Applications hosted on premises, in Azure, and in other clouds can all take advantage of Application Insights. The only limitation is the need to [allow communication](../../azure-monitor/app/ip-addresses.md) to the Application Insights service. For monitoring Universal Windows Platform (UWP) applications, we recommend [Visual Studio App Center](../../azure-monitor/learn/mobile-center-quickstart.md).

## To send telemetry to Application Insights from a Classic Windows application
1. In the [Azure portal](https://portal.azure.com), [create an Application Insights resource](../../azure-monitor/app/create-new-resource.md ). 
2. Take a copy of the Instrumentation Key.
3. In Visual Studio, edit the NuGet packages of your app project, and add Microsoft.ApplicationInsights.WindowsServer. (Or choose Microsoft.ApplicationInsights if you just want the base API, without the standard telemetry collection modules.)
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

By default this SDK will collect and store the computer name of the system emitting telemetry.

Computer name is used by Application Insights [Legacy Enterprise (Per Node) pricing tier](https://docs.microsoft.com/azure/azure-monitor/app/pricing#legacy-enterprise-per-node-pricing-tier) for internal billing purposes. By default if you use a telemetry initializer to override `telemetry.Context.Cloud.RoleInstance`, a separate property `ai.internal.nodeName` will be sent which will still contain the computer name value. This value will not be stored with your Application Insights telemetry, but is used internally at ingestion to allow for backwards compatibility with the legacy node-based billing model.

If you are on the [Legacy Enterprise (Per Node) pricing tier](https://docs.microsoft.com/azure/azure-monitor/app/pricing#legacy-enterprise-per-node-pricing-tier) and simply need to override storage of the computer name, use a telemetry Initializer:

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
            if (string.IsNullOrEmpty(telemetry.Context.Cloud.RoleInstance))
            {
                // Set custom role name here. Providing an empty string will result
                // in the computer name still be sent via this property.
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
            //...
        }
```

## Override transmission of computer name

If you aren't on the [Legacy Enterprise (Per Node) pricing tier](https://docs.microsoft.com/azure/azure-monitor/app/pricing#legacy-enterprise-per-node-pricing-tier) and wish to completely prevent any telemetry containing computer name from being sent, you need to use a telemetry processor.

### Telemetry processor

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;


namespace WindowsFormsApp2
{
    public class CustomTelemetryProcessor : ITelemetryProcessor
    {
        private readonly ITelemetryProcessor _next;

        public CustomTelemetryProcessor(ITelemetryProcessor next)
        {
            _next = next;
        }

        public void Process(ITelemetry item)
        {
            if (item != null)
            {
                item.Context.Cloud.RoleInstance = string.Empty;
            }

            _next.Process(item);
        }
    }
}
```

Instantiate the telemetry processor in the `Program.cs` `Main()` method below setting the instrumentation key:

```csharp
using Microsoft.ApplicationInsights.Extensibility;

namespace WindowsFormsApp2
{
    static class Program
    {
        static void Main()
        {
            TelemetryConfiguration.Active.InstrumentationKey = "{Instrumentation-key-here}";
            var builder = TelemetryConfiguration.Active.DefaultTelemetrySink.TelemetryProcessorChainBuilder;
            builder.Use((next) => new CustomTelemetryProcessor(next));
            builder.Build();
            //...
        }
    }
}

```

> [!NOTE]
> While you can technically use a telemetry processor as described above even if you are on the [Legacy Enterprise (Per Node) pricing tier](https://docs.microsoft.com/azure/azure-monitor/app/pricing#legacy-enterprise-per-node-pricing-tier), this will result in the potential for over-billing due to the inability to properly distinguish nodes for per node pricing.

## Next steps
* [Create a dashboard](../../azure-monitor/app/overview-dashboard.md)
* [Diagnostic Search](../../azure-monitor/app/diagnostic-search.md)
* [Explore metrics](../../azure-monitor/platform/metrics-charts.md)
* [Write Analytics queries](../../azure-monitor/app/analytics.md)

