<properties 
	pageTitle="Get started with Application Insights for Windows Store and Phone apps" 
	description="Analyze usage and performance of your Windows device app with Application Insights." 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2015-02-10" 
	ms.author="awills"/>

# Application Insights

## Monitor usage and crashes in Windows apps and Windows Phone apps

*Application Insights is in preview.*

Application Insights lets you monitor your published application for:

* **Usage** - Learn how many users you have and what they are doing with your app.
* **Crashes** - Get diagnostic reports of crashes and understand their impact on users.

![](./media/appinsights/appinsights-d018-oview.png)


## <a name="add"></a>1. Add Application Insights

**If you're creating a new Windows Phone 8 or Windows 8.1 project** select Application Insights in the New Project dialog. 

If you're asked to sign in, use the credentials for your Azure account (which is separate from your Visual Studio Online account).

![](./media/appinsights/appinsights-d21-new.png)


**If you already have a project** add Application Insights from Solution Explorer.


![](./media/appinsights/appinsights-d22-add.png)

**If yours is a Windows Universal app** create the app in Visual Studio, and then:

1.  In the [Azure portal][portal], create a new Application Insights resource.
2.  Go to the Properties blade and copy the Instrumentation Key.

In Visual Studio, repeat the following steps for both the Windows Phone project and the Windows project:

1. Right-click the project in Solution Explorer and choose **Manage NuGet Packages**.
2. Select **Online**, **Include prerelease**, and search for "Application Insights".
3. Pick the appropriate package - one of:
       * Application Insights for Windows applications
       * Application Insights for Windows Phone applications
4. Edit ApplicationInsights.config (which has been added by the NuGet install). Insert this just before the closing tag:

    &lt;InstrumentationKey&gt;*the key you copied*&lt;/InstrumentationKey&gt;


## <a name="network"></a>2. Enable network access for your app

If your app doesn't already [request outgoing network access](https://msdn.microsoft.com/library/windows/apps/hh452752.aspx), you'll have to add that to its manifest as a [required capability](https://msdn.microsoft.com/library/windows/apps/br211477.aspx).

## <a name="run"></a>3. Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry. 

In Visual Studio, you'll see a count of the events that have been received.

![](./media/appinsights/appinsights-09eventcount.png)

In debug mode, telemetry is sent as soon as it's generated. In release mode, telemetry is stored on the device and sent only when the app resumes.

## <a name="monitor"></a>4. See monitor data

Open Application Insights from your project.

![Right-click your project and open the Azure portal](./media/appinsights/appinsights-04-openPortal.png)


At first, you'll just see one or two points. For example:

![Click through to more data](./media/appinsights/appinsights-26-devices-01.png)

Click Refresh after a few seconds if you're expecting more data.

Click any chart to see more detail. 


## <a name="deploy"></a>5. Publish your application to Store

[Publish your application](http://dev.windows.com/publish) and watch the data accumulate as users download and use it.


## <a name="usage"></a>Next Steps

[Track usage of your app][windowsUsage]

[Detect and diagnose crashes in your app][windowsCrash]

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


