<properties 
	pageTitle="SCOM integration with Application Insights | Microsoft Azure" 
	description="System Center Operations Manager can be used to configure multiple servers for monitoring by Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/11/2016" 
	ms.author="awills"/>
 
# Use SCOM to configure multiple servers for Application Insights

System Center Operations Manager (SCOM) can be used to configure a multi-server web application for monitoring by Visual Studio Application Insights. An SCOM management pack finds the servers where the application is running, installs [Application Insights Status Monitor](app-insights-monitor-performance-live-website-now.md) on those servers, and configures it to monitor the application.

Application Insights is used by developers to monitor the performance and usage of web applications. They can display dashboards showing response times and failure rates for both incoming requests and calls to dependencies. The service automatically alerts them to unusual performance patterns, and they can diagnose problems by investigating individual exception, request and trace data.

## Before you start

We'll assume:

* You're familiar with SCOM, and that you use SCOM 2012 R2 or 2016 to manage a number of IIS web servers.
* You have already installed on your servers a web application that you want to monitor with Application Insights.
* App framework version is .NET 4.5 or later.
* [It doesn't matter whether the app was built with the Application Insights SDK](#sdk).
* You have access to a subscription in [Microsoft Azure](https://azure.com) and can sign in to the [Azure portal](https://portal.azure.com). Your organization may have an subscription, and can add your Microsoft account to it.


## (One time) Install Application Insights management pack

On the machine where you run Operations Manager:

2. Uninstall any old version of the management pack:
 1. In Operations Manager, open Administration, Management Packs. 
 2. Delete the old version.
1. Download and install the management pack from the ??? catalog.
2. Restart Operations Manager.


## Create a management pack

1. In Operations Manager, open **Authoring**, **.NET...with Application Insights**, **Add Monitoring Wizard**, and again choose **.NET...with Application Insights**.

    ![](./media/app-insights-scom/020.png)

2. Name the configuration after your app. (You have to instrument one app at a time.)
    
    ![](./media/app-insights-scom/030.png)

3. On the same wizard page, either create a new management pack, or select a pack that you created for Application Insights earlier.

     (The Application Insights [management pack](https://technet.microsoft.com/library/cc974491.aspx) is a template, from which you create an instance. You can reuse the same instance later.)


    ![In the General Properties tab, type the name of the app. Click New and type a name for a management pack. Click OK, then click Next.](./media/app-insights-scom/040.png)

4. Choose one app that you want to monitor. The search feature will search among apps installed on your servers.

    ![On What to Monitor tab, click Add, type part of the app name, click Search, choose the app, and then Add, OK.](./media/app-insights-scom/050.png)

    The optional Monitoring scope field can be used to specify a subset of your servers, if you don't want to monitor the app in all servers.

5. On the next wizard page, you must first provide your credentials to sign in to Microsoft Azure.

    On this page, you choose the Application Insights resource where you want the telemetry data to be analyzed and displayed. 

 * If the application was configured for Application Insights during development, select its existing resource.
 * Otherwise, create a new resource named for the app. If there are other apps that are components of the same system, put them in the same resource group, to make access to the telemetry easier to manage.

    You can change these settings later.

    ![On Application Insights settings tab, click 'sign in' and provide your Microsoft account credentials for Azure. Then choose a subscription, resource group and resource.](./media/app-insights-scom/060.png)

6. Complete the wizard.

    ![Click Create](./media/app-insights-scom/070.png)
    
If you need to change settings later, re-open the properties of the monitor from the Authoring window

![In Authoring, select .NET Application Performance Monitoring with Application Insights, select your monitor, and click Properties.](./media/app-insights-scom/070.png)

Repeat this procedure for each app that you want to monitor.

## Verify monitoring

The monitor that you have installed will search for your app on every server. Where it finds the app, it will configure Application Insights Status Monitor to monitor the app. If necessary, it will first install Status Monitor on the server.

You can verify which instances of the app it has found:

![In Monitoring, open Application Insights](./media/app-insights-scom/100.png)


## View telemetry in Application Insights

In the [Azure portal](https://portal.azure.com), browse to the resource for your app. You will [see charts showing telemetry](app-insights-dashboards.md) from your app. (If it hasn't shown up on the main page yet, click Live Metrics Stream.)


<a name="sdk"></a>
## Does the app need the Application Insights SDK?

It doesn't matter.

There is an [Application Insights SDK](app-insights-asp-net.md) that can be added to the application at development time. Doing so provides much of the telemetry without any need to instrument the app at runtime, as well as allowing the development team to write custom telemetry.

However, it's still good to instrument the app at runtime - that is, the procedure you're about to follow.

If the app was built with the SDK, then runtime instrumentation adds more telemetry such as performance counters, and in some cases will enable reporting on dependency calls.

If the app wasn't built with the SDK, then runtime instrumentation will provide the standard telemetry that the SDK provides, but without the ability to write custom telemetry or capture log traces.