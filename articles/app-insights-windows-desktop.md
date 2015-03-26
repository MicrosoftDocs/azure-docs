<properties 
	pageTitle="Get started with Application Insights for Windows desktop apps" 
	description="Analyze usage and performance of your Windows app with Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="keboyd"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/20/2015" 
	ms.author="awills"/>

# Application Insights

## Monitor usage and performance in Windows desktop applications

*Application Insights is in preview.*

Application Insights lets you monitor your deployed application for:

* **Usage** - Learn how many users you have and what they are doing with your app.
* **Performance issues and exceptions** - Monitor performance and understand its impact on users.

In Windows Desktop applications, you have to use the API to send telemetry to the Application Insights portal. There is no automatic telemetry.

## <a name="add"></a> Create an Application Insights resource


1.  In the [Azure portal][portal], create a new Application Insights resource. For application type, choose Windows Store application. 

    ![Click New, Application Insights](./media/app-insights-windows-get-started/01-new.png)

    (Your choice of application type sets the content of the Overview blade and the properties available in [metric explorer][metrics]. You could choose ASP.NET app instead, for example if you want to call TrackRequest() to simulate server request telemetry.)

2.  Take a copy of the Instrumentation Key.

    ![Click Properties, select the key, and press ctrl+C](./media/app-insights-windows-get-started/02-props.png)

## <a name="sdk"></a>Install the SDK in your application


1. In Visual Studio, edit the NuGet packages of your desktop app project.
    ![Right-click the project and select Manage Nuget Packages](./media/app-insights-windows-get-started/03-nuget.png)

2. Install the Application Insights SDK core.

    ![Select **Online**, **Include prerelease**, and search for "Application Insights"](./media/app-insights-windows-get-started/04-ai-nuget.png)

    (As an alternative, you could choose Application Insights SDK for Web Apps. This provides some built-in performance counter telemetry. However, you'll see repeated trace messages in [diagnostic search][diagnostic] as the component complains that it can't find a web app.)

3. Edit ApplicationInsights.config (which has been added by the NuGet install). Insert this just before the closing tag:

    &lt;InstrumentationKey&gt;*the key you copied*&lt;/InstrumentationKey&gt;

    If you installed the Web Apps SDK, you might also want to comment out some of the web telemetry modules.

## <a name="telemetry"></a>Insert telemetry calls

Create a `TelemetryClient` instance and then [use it to send telemetry][track].

For example, in a Windows Forms application, you could write:

    public partial class Form1 : Form
    {
        private TelemetryClient tc = new TelemetryClient();
        ...
        private void Form1_Load(object sender, EventArgs e)
        {
            tc.TrackPageView("Form1");
            ...
        }


Use any of the [Application Insights API][track] to send telemetry. In Windows Desktop applications, no telemetry is sent automatically. Typically you'd use:

* TrackPageView(pageName) on switching forms, pages, or tabs
* TrackEvent(eventName) for other user actions
* TrackTrace(logEvent) for [diagnostic logging][diagnostic]
* TrackException(exception) in catch clauses
* TrackMetric(name, value) in a background task to send regular reports of metrics not attached to specific events.

To see counts of users and sessions, set a context initializer:

    class TelemetryInitializer: IContextInitializer
    {
        public void Initialize(TelemetryContext context)
        {
            context.User.Id = Environment.UserName;
            context.Session.Id = DateTime.Now.ToFileTime().ToString();
            context.Session.IsNewSession = true;
        }
    }

    static class Program
    {
        ...
        static void Main()
        {
            TelemetryConfiguration.Active.ContextInitializers.Add(
                new TelemetryInitializer());
            ...



## <a name="run"></a>Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry. 

In Visual Studio, you'll see a count of the events that have been sent.

![](./media/appinsights/appinsights-09eventcount.png)



## <a name="monitor"></a>See monitor data

Return to your application blade in the Azure portal.

The first events will appear in Diagnostic Search. 

Click Refresh after a few seconds if you're expecting more data.

Return to the Overview blade to see charts. (You won't see data for Crashes.) Click any chart to see more detail.


## <a name="deploy"></a>Release your application to users

[Publish your application](http://dev.windows.com/publish) and watch the data accumulate as users download and use it.


## <a name="usage"></a>Next Steps

[Track usage of your app][track]

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


