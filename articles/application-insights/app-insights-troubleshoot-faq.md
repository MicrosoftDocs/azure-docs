<properties 
	pageTitle="Troubleshooting and Questions about Application Insights" 
	description="Something in Visual Studio Application Insights unclear or not working? Try here." 
	services="application-insights" 
    documentationCenter=".net"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/09/2015" 
	ms.author="awills"/>
 
# Troubleshooting and Questions - Application Insights for ASP.NET

## Can I use Application Insights with ...?

[See Platforms][platforms]

## Is it free?

* Yes, if you choose the free [pricing tier](app-insights-pricing.md). You get most features and a generous quota of data. 
* You have to provide your credit card data to register with Microsoft Azure, but no charges will be made unless you use another paid-for Azure service, or you explicitly upgrade to a paying tier.
* If your app sends more data than the monthly quota for the free tier, it stops being logged. If that happens, you can either choose to start paying, or wait until the quota is reset at the end of the month.
* Basic usage and session data is not subject to a quota.
* There is also a free 30-day trial, during which you get the Premium features free of charge.
* Each application resource has a separate quota, and you set its pricing tier independently of any others.

#### What do I get if I pay?

* A larger [monthly quota of data](http://azure.microsoft.com/pricing/details/application-insights/).
* Option to pay 'overage' to continue collecting data over the monthly quota. If your data goes over quota, you're charged per Mb.
* [Continuous export](app-insights-export-telemetry.md).

## Adding the SDK

#### <a name="q01"></a>I don't see any option to Add Application Insights to my project in Visual Studio

+ Make sure you have [Visual Studio 2013 Update 3 or later](http://go.microsoft.com/fwlink/?LinkId=397827). It comes pre-installed with Application Insights Tools.
+ Although the tools don't support all types of applications, you can probably still add an Application Insights SDK to your project manually. Use [this procedure][windows]. 


#### <a name="q02"></a>My new web project was created, but adding Application Insights failed.

This can happen if:

* Communication with the Application Insights portal failed; or
* There is some problem with your account;
* You only have [read access to the subscription or group where you were trying to create the new resource](app-insights-resources-roles-access-control.md).

Remedy:

+ Check that you provided login credentials for the right Azure account. In some early versions of the tools, the Microsoft Azure credentials, which you see in the New Project dialog, can be different from the credentials that you see at the top right of Visual Studio.
+ In your browser, check that you have access to the [Azure portal](https://portal.azure.com). Open Settings and see if there is any restriction.
+ [Add Application Insights to your existing project][start]: In Solution Explorer, right click your project and choose "Add Application Insights."
+ If it still isn't working, follow the [manual procedure](app-insights-start-monitoring-app-health-usage.md) to add a resource in the portal and then add the SDK to your project. 

#### <a name="emptykey"></a>I get an error "Instrumentation key cannot be empty"

Looks like something went wrong while you were installing Application Insights or maybe a logging adapter.

In Solution Explorer, right-click `ApplicationInsights.config` and choose **Update Application Insights**. You'll get a dialog that invites you to sign in to Azure and either create an Application Insights resource, or re-use an existing one.


#### <a name="q14"></a>What does Application Insights modify in my project?

The details depend on the type of project. For a web application:


+ Adds these files to your project:

 + ApplicationInsights.config. 
 + ai.js


+ Installs these NuGet packages:

 -  *Application Insights API* - the core API

 -  *Application Insights API for Web Applications* - used to send telemetry from the server

 -  *Application Insights API for JavaScript Applications* - used to send telemetry from the client

    The packages include these assemblies:

 - Microsoft.ApplicationInsights

 - Microsoft.ApplicationInsights.Platform

+ Inserts items into:

 - Web.config

 - packages.config

+ (New projects only - if you [add Application Insights to an existing project][start], you have to do this manually.) Inserts snippets into the client and server code to initialize them with the Application Insights resource ID. For example, in an MVC app, code is inserted into the master page Views/Shared/_Layout.cshtml

####<a name="NuGetBuild"></a> I get "NuGet package(s) are missing" on my build server, though everything builds OK on my dev machines

Please see [NuGet Package Restore](http://docs.nuget.org/Consume/Package-Restore)
and [Automatic Package Restore](http://docs.nuget.org/Consume/package-restore/migrating-to-automatic-package-restore).

####<a name="FailUpdate"></a> I get "project references NuGet package(s) that are missing on my computer" when attempting to build after updating to 0.17 or newer of the NuGet packages.

If you see the error above after updating to the 0.17 or newer NuGet packages, you need to edit the proj file and remove the BCL targets that were left behind.

To do this:

1. Right-click on your project in Solution Explorer and choose Unload Project.
2. Right-click on project again and choose Edit *yourProject.csproj* 
3. Go to the bottom of the project file and remove the BCL targets similar to: 
	```
	<Import Project="..\packages\Microsoft.Bcl.Build.1.0.14\tools\Microsoft.Bcl.Build.targets" Condition="Exists('..\packages\Microsoft.Bcl.Build.1.0.14\tools\Microsoft.Bcl.Build.targets')" />
	  
	  <Target Name="EnsureBclBuildImported" BeforeTargets="BeforeBuild" Condition="'$(BclBuildImported)' == ''">
	  
	    <Error Condition="!Exists('..\packages\Microsoft.Bcl.Build.1.0.14\tools\Microsoft.Bcl.Build.targets')" Text="This project references NuGet package(s) that are missing on this computer. Enable NuGet Package Restore to download them.  For more information, see http://go.microsoft.com/fwlink/?LinkID=317567." HelpKeyword="BCLBUILD2001" />
	    
	    <Error Condition="Exists('..\packages\Microsoft.Bcl.Build.1.0.14\tools\Microsoft.Bcl.Build.targets')" Text="The build restored NuGet packages. Build the project again to include these packages in the build. For more information, see http://go.microsoft.com/fwlink/?LinkID=317568." HelpKeyword="BCLBUILD2002" />
	    
	  </Target>
	  ```
4. Save the file.
5. Right-click on the project and choose Reload *yourProject.csproj*

## How do I upgrade from older SDK versions?

See the [release notes](app-insights-release-notes.md) for the SDK appropriate to your type of application. 


## No data

#### <a name="q03"></a>I added Application Insights successfully and ran my app, but I've never seen data in the portal.

+ On the Overview page, click the Search tile to open Diagnostic Search. Data appears here first.
+ Click the Refresh button. The blade refreshes itself periodically, but you can also do it manually. The refresh interval is longer for larger time ranges.
+ In the Microsoft Azure start board, look at the service status map. If there are some alert indications, wait until they have returned to OK and then close and re-open your Application Insights application blade.
+ Check also [our status blog](http://blogs.msdn.com/b/applicationinsights-status/).

#### No data since I published the app to my server

+ In your firewall, you might have to open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com and f5.services.visualstudio.com.
+ If you have to use a proxy to send out of your corporate network, set [defaultProxy](https://msdn.microsoft.com/library/aa903360.aspx) in Web.config
+ Windows Server 2008: Make sure you have installed the following updates: [KB2468871](https://support.microsoft.com/kb/2468871), [KB2533523](https://support.microsoft.com/kb/2533523), [KB2600217](https://support.microsoft.com/kb/2600217).

#### <a name="q04"></a>I see no data under Usage Analytics for my web site

+ The data comes from scripts in the web pages. If you added Application Insights to an existing web project, [you have to add the scripts by hand][start].
+ Make sure Internet Explorer isn't displaying your site in Compatibility mode.
+ Use the browser's debug feature (F12 on some browsers, then choose Network) to verify that data is being sent to dc.services.visualstudio.com.

#### <a name="q08"></a>Can I use Application Insights to monitor an intranet web server?

Yes, you can monitor health and usage if your server can send data to the public internet. In your firewall, open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com and f5.services.visualstudio.com.

But if you want to run web tests for your service, it must be accessible from the public internet on port 80.

#### Can I monitor an intranet web server that doesn't have access to the public internet?

You would have to arrange a proxy that can relay https POST calls to dc.services.visualstudio.com 

#### I used to see data, but it has stopped

* Check the [status blog](http://blogs.msdn.com/b/applicationinsights-status/).
* Have you hit your monthly quota of data points? Open the Settings/Quota and Pricing to find out. If so, you can upgrade your plan, or pay for additional capacity. See the [pricing scheme](http://azure.microsoft.com/pricing/details/application-insights/).

## Status Monitor doesn't work

See [Troubleshooting Status Monitor](app-insights-monitor-performance-live-website-now.md#troubleshooting). Firewall ports are the most common issue.

## The Portal

#### <a name="q05"></a>I'm looking at the Microsoft Azure Preview start board. How do I find my data in Application Insights?

Either:

* Choose Browse, Application Insights, your project name. If you don't have any projects there, you need to [add Application Insights to your web project in Visual Studio][start].

* In Visual Studio Solution Explorer, right-click your web project and choose Open Application Insights Portal.


#### <a name="update"></a>How can I change which Azure resource my project sends data to?

In Solution Explorer, right-click `ApplicationInsights.config` and choose **Update Application Insights**. You can send the data to an existing or new resource in Azure. The update wizard changes the instrumentation key in ApplicationInsights.config, which determines where the server SDK sends your data. Unless you deselect "Update all," it will also change the key where it appears in your web pages.


#### <a name="q06"></a>On the Microsoft Azure Preview home screen, does that map show the status of my application?

No! It shows the status of the Azure service. To see your web test results, choose Browse > Application Insights > (your application) and then look at the web test results. 



#### <a name="data"></a>How long is data retained in the portal? Is it secure?

Take a look at [Data Retention and Privacy][data].

## Logging

#### <a name="post"></a>How do I see POST data in Diagnostic search?

We don't log POST data automatically, but you can use a TrackTrace call: put the data in the message parameter. This has a longer size limit than the limits on string properties, though you can't filter on it. 

## Security

#### Is my data secure in the portal? How long is it retained?

See [Data Retention and Privacy][data].


## <a name="q17"></a> Have I enabled everything in Application Insights?

<table border="1">
<tr><th>What you should see</th><th>How to get it</th><th>Why you want it</th></tr>
<tr><td>Availability charts</td><td><a href="../app-insights-monitor-web-app-availability/">Web tests</a></td><td>Know your web app is up</td></tr>
<tr><td>Server app perf: response times, ...
</td><td><a href="../app-insights-start-monitoring-app-health-usage/">Add Application Insights to your project</a><br/>or <br/><a href="../app-insights-monitor-performance-live-website-now/">Install AI Status Monitor on server</a> (or write your own code to <a href="../app-insights-api-custom-events-metrics/#track-dependency">track dependencies</a>)</td><td>Detect perf issues</td></tr>
<tr><td>Dependency telemetry</td><td><a href="../app-insights-monitor-performance-live-website-now/">Install AI Status Monitor on server</a></td><td>Diagnose issues with databases or other external components</td></tr>
<tr><td>Get stack traces from exceptions</td><td><a href="../app-insights-search-diagnostic-logs/#exceptions">Insert TrackException calls in your code</a> (but some are reported automatically)</td><td>Detect and diagnose exceptions</td></tr>
<tr><td>Search log traces</td><td><a href="../app-insights-search-diagnostic-logs/">Add a logging adapter</a></td><td>Diagnose exceptions, perf issues</td></tr>
<tr><td>Client usage basics: page views, sessions, ...</td><td><a href="../app-insights-javascript/">JavaScript initializer in web pages</a></td><td>Usage analytics</td></tr>
<tr><td>Client custom metrics</td><td><a href="../app-insights-api-custom-events-metrics/">Tracking calls in web pages</a></td><td>Enhance user experience</td></tr>
<tr><td>Server custom metrics</td><td><a href="../app-insights-api-custom-events-metrics/">Tracking calls in server code</a></td><td>Business intelligence</td></tr>
</table>

If your web service is running in an Azure VM, you can also [get diagnostics][azurediagnostic] there.

## Automation

You can [write a PowerShell script](app-insights-powershell-script-create-resource.md) to create an Application Insights resource.

## More answers

* [Application Insights forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)


<!--Link references-->

[azurediagnostic]: ../insights-how-to-use-diagnostics.md
[data]: app-insights-data-retention-privacy.md
[platforms]: app-insights-platforms.md
[start]: app-insights-get-started.md
[windows]: app-insights-windows-get-started.md

 