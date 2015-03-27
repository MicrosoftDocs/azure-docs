<properties 
	pageTitle="Get started with Application Insights" 
	description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." 
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
	ms.date="03/27/2015" 
	ms.author="awills"/>

# Get started with Visual Studio Application Insights

*Application Insights is in preview.*

Detect issues, solve problems and continuously improve your applications. Quickly diagnose any problems in your live application. Understand what your users do with it.

Configuration is very easy, and you'll see results within minutes.

We currently support ASP.NET and Java web applications, WCF services, Windows Phone and Windows Store apps.

## Get started

Start with any combination, in any order, of the entry points on the left of this map. Follow the path that works for you.

Application Insights works by adding an SDK into your app, which sends telemetry to the [Azure portal](http://portal.azure.com). There are different SDKs for the many combinations of platforms, languages and IDEs that are supported.

You'll need an account in [Microsoft Azure](http://azure.com). You might already have access to a group account through your organization, or you might want to get a Pay-as-you-go account. (While Application Insights is in Preview, it's free.)

What you want | What to do  | What you get
---|---|---
<a href="app-insights-start-monitoring-app-health-usage.md">![](./media/appinsights/appinsights-gs-i-01-perf.png)</a>|[Add Application Insights SDK to your web project][greenbrown]<br/>![](./media/appinsights/appinsights-00arrow.png)  | <a href="app-insights-start-monitoring-app-health-usage.md">![](./media/appinsights/appinsights-gs-r-01-perf.png)</a>
<a href="app-insights-monitor-performance-live-website-now.md">![](./media/appinsights/appinsights-gs-i-04-red2.png)</a><br/><a href="app-insights-monitor-performance-live-website-now.md">![](./media/appinsights/appinsights-gs-i-03-red.png)</a>|[Install Status Monitor on your IIS server][redfield]<br/>![](./media/appinsights/appinsights-00arrow.png) | <a href="app-insights-monitor-performance-live-website-now.md">![](./media/appinsights/appinsights-gs-r-03-red.png)</a>
<a href="insights-perf-analytics.md">![](./media/appinsights/appinsights-gs-i-10-azure.png)</a>|[Enable Insights in your Azure web app][azure]<br/>![](./media/appinsights/appinsights-00arrow.png)  | <a href="insights-perf-analytics.md">![](./media/appinsights/appinsights-gs-r-03-red.png)</a>
<a href="app-insights-java-get-started.md">![](./media/appinsights/appinsights-gs-i-11-java.png)</a>|[Add the SDK to your Java project][java]<br/>![](./media/appinsights/appinsights-00arrow.png)  | <a href="app-insights-java-get-started.md">![](./media/appinsights/appinsights-gs-r-10-java.png)</a>
<a href="app-insights-web-track-usage.md">![](./media/appinsights/appinsights-gs-i-02-usage.png)</a>|[Insert the Application Insights script into your web pages][usage]<br/>![](./media/appinsights/appinsights-00arrow.png)  | <a href="app-insights-web-track-usage.md">![](./media/appinsights/appinsights-gs-r-02-usage.png)</a>
<a href="app-insights-monitor-web-app-availability.md">![](./media/appinsights/appinsights-gs-i-05-avail.png)</a>|[Create web tests][availability]<br/>![](./media/appinsights/appinsights-00arrow.png) | <a href="app-insights-monitor-web-app-availability.md">![](./media/appinsights/appinsights-gs-r-05-avail.png)</a>
<a href="app-insights-windows-get-started.md">![](./media/appinsights/appinsights-gs-i-06-device.png)</a>|[Add Application Insights to your device app project][windows]<br/>![](./media/appinsights/appinsights-00arrow.png) | <a href="app-insights-windows-get-started.md">![](./media/appinsights/appinsights-gs-r-06-device.png)</a>

## Support and feedback

* Questions and Issues:
 * [Troubleshooting][qna]
 * [MSDN Forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)
 * [StackOverflow](http://stackoverflow.com/questions/tagged/ms-application-insights)
* Bugs:
 * [Connect](https://connect.microsoft.com/VisualStudio/Feedback/LoadSubmitFeedbackForm?FormID=6076)
* Suggestions:
 * [User Voice](http://visualstudio.uservoice.com/forums/121579-visual-studio/category/77108-application-insights)
* Document improvements:
 * Discus threads at the bottom of en-us versions of these pages. (In the URL of this and other pages, change `/xx-xx/documentation` to `/en-us/documentation`.)
 


## <a name="video"></a>Videos

#### Introduction

> [AZURE.VIDEO application-insights-for-asp-net]

#### Get started

> [AZURE.VIDEO getting-started-with-application-insights]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


