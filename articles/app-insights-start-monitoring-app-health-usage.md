<properties title="Application Insights" pageTitle="Application Insights - start monitoring your app's health and usage" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2014-09-24" ms.author="awills" />

# Application Insights - Start monitoring your app's health and usage

*Application Insights is in preview.*

Application Insights lets you monitor your live application for:

* **Availability** - We'll test your URLs every few minutes from around the world.
* **Performance**  - Detect and diagnose perf issues and exceptions.
* **Usage** - Find out what users are doing with your app, so that you can make it better for them.

Configuration is very easy, and you'll see results in minutes. We currently support ASP.NET web apps (on your own servers or on Azure).

You'll need an account in [Microsoft Azure](http://azure.com) (there's a free trial period).

There are two ways to get started with Application Insights:

* (Recommended) [Add Application Insights to your project in Visual Studio](#add) to monitor application performance and usage.
* [Install an agent on your server without redeploying][redfield] - Monitor a live website without redeploying it or touching your source code. This gives you performance and exception monitoring. You can add usage monitoring later.

>[WACOM.NOTE] There's an [older version of Application Insights](http://msdn.microsoft.com/en-us/library/dn481095.aspx) in Visual Studio Online, which supports a broader range of application types. We're rebuilding it from the ground up as part of Microsoft Azure, and it's the new version that you're reading about here.


## <a name="add"></a>Add Application Insights to your project

You need [Visual Studio 2013 Update 3](http://go.microsoft.com/fwlink/?linkid=397827&clcid=0x409) (or later).

### If it's a new project...

When you create a new project in Visual Studio 2013, make sure Application Insights is selected. 


![Create an ASP.NET project](./media/appinsights/appinsights-01-vsnewp1.png)

If this is your first time, you'll be asked login or sign up to Microsoft Azure Preview. (It's separate from your Visual Studio Online account.)

Use **Configure settings** if you want the Azure resource to have a different name than your project, or if you want the resource to appear under the same group as a different project. 

*No Application Insights option? Check you're using Visual Studio 2013 Update 3, that Application Insights Tools are enabled in Extensions and Updates, and that you're creating a web, Windows Store, or Windows Phone project.*

### ... or if it's an existing project

Right click the project in Solution Explorer, and choose Add Application Insights.

![Choose Add Application Insights](./media/appinsights/appinsights-03-addExisting.png)

*There's one more step if you want to set up web usage analytics, but let's see some data first...*


### <a name="run"></a>2. Run your project

Run your application with F5 and try it out - open different pages.

In Visual Studio, you'll see a count of the events that have been received.

![](./media/appinsights/appinsights-09eventcount.png)

### <a name="monitor"></a>3. See monitor data

Open Application Insights from your project.

![Right-click your project and open the Azure portal](./media/appinsights/appinsights-04-openPortal.png)


Look for data in the **Application health** tiles. At first, you'll just see one or two points. For example:

![Click through to more data](./media/appinsights/appinsights-41firstHealth.png)

Click any tile to see more detail. You can change what you see in the reports. [Learn more about configuring Application Health reports.][perf]


### <a name="webclient"></a>4. Set up web usage analytics

If you added Application Insights to an *existing* web project, you won't see anything yet in the Usage analytics tiles. There's one more step you need.

In Application Insights, choose Quick start, Instrument your website. 

![In your project in Application Insights, click Quick start, Instrument your website, and copy the code](./media/appinsights/appinsights-06webcode.png)

Copy the JavaScript code into the web pages that you want to monitor, just before the closing &lt;/head&gt; tag. In an ASP.NET project, a good way to monitor all the pages is to put the code in the master page, usually called `_SiteLayout` or `Views\Shared\_Layout`. Notice that the code contains the Application Insights key of your application.

Run your application again and you'll see data in **Usage analytics**.

![Click through to more data](./media/appinsights/appinsights-05-usageTiles.png)

[Click through charts to see more detail.][perf]

### <a name="deploy"></a>5. Deploy your application

Deploy your application and watch the data accumulate.



Once you have a live application, [set up web tests][availability] to make sure it stays live. 

![Example application monitor in Application Insights](./media/appinsights/appinsights-00-appblade.png)

### Want to change the name of your application in the portal?

You can change the resource to which your project sends telemetry. 

(The 'resource' is the named Application Insights blade where your results appear. You can put more than one resource into a group - for example if you have several projects that form part of one business application.) 

In Solution Explorer, right-click ApplicationInsights.config, and choose **Update Application Insights**. This opens a wizard where you can choose a different existing resource, or create a new one.

Afterwards, go back to the portal and delete the old resource.

## <a name="video"></a>Videos

### Introduction

> [AZURE.VIDEO application-insights-introduction]

### Get started

> [AZURE.VIDEO getting-started-with-application-insights]

## <a name="next"></a>Next steps

[Track usage of your web app][usage]

[Monitor performance in web applications][perf]

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]


## Learn more

* [Application Insights - get started][start]
* [Monitor a live web server now][redfield]
* [Monitor performance in web applications][perf]
* [Search diagnostic logs][diagnostic]
* [Availability tracking with web tests][availability]
* [Track usage][usage]
* [Q & A and troubleshooting][qna]

<!--Link references-->


[start]: ../app-insights-start-monitoring-app-health-usage/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[perf]: ../app-insights-web-monitor-performance/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-web-track-usage/
[qna]: ../app-insights-troubleshoot-faq/
