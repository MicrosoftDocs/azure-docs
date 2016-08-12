<properties 
	pageTitle="SCOM integration with Application Insights | Microsoft Azure" 
	description="If you're an SCOM user, monitor performance and diagnose issues with Application Insights. Comprehensive dashboards, smart alerts, powerful diagnostic tools and analysis queries." 
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
	ms.date="08/12/2016" 
	ms.author="awills"/>
 
# Application Performance Monitoring using Application Insights for SCOM

If you use System Center Operations Manager (SCOM) to manage your servers, you can monitor performance and diagnose performance issues with the help of [Visual Studio Application Insights](app-insights-asp-net.md). Application Insights monitors your web application's incoming requests, outgoing REST and SQL calls, exceptions, and log traces. It provides dashboards with metric charts and smart alerts, as well as powerful diagnostic search and analytical queries over this telemetry. 

You can switch on Application Insights monitoring by using an SCOM management pack.

## Before you start

We'll assume:

* You're familiar with SCOM, and that you use SCOM 2012 R2 or 2016 to manage your IIS web servers.
* You have already installed on your servers a web application that you want to monitor with Application Insights.
* App framework version is .NET 4.5 or later.
* You have access to a subscription in [Microsoft Azure](https://azure.com) and can sign in to the [Azure portal](https://portal.azure.com). Your organization may have an subscription, and can add your Microsoft account to it.

(The development team might build the [Application Insights SDK](app-insights-asp-net.md) into the web app. This gives them greater flexibility in writing custom telemetry. However, this doesn't matter: you can follow the steps described here either with or without the SDK built in.)

## (One time) Install Application Insights management pack

On the machine where you run Operations Manager:

2. Uninstall any old version of the management pack:
 1. In Operations Manager, open Administration, Management Packs. 
 2. Delete the old version.
1. Download and install the management pack from the catalog.
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
    
Repeat this procedure for each app that you want to monitor.

If you need to change settings later, re-open the properties of the monitor from the Authoring window.

![In Authoring, select .NET Application Performance Monitoring with Application Insights, select your monitor, and click Properties.](./media/app-insights-scom/080.png)

## Verify monitoring

The monitor that you have installed will search for your app on every server. Where it finds the app, it will configure Application Insights Status Monitor to monitor the app. If necessary, it will first install Status Monitor on the server.

You can verify which instances of the app it has found:

![In Monitoring, open Application Insights](./media/app-insights-scom/100.png)


## View telemetry in Application Insights

In the [Azure portal](https://portal.azure.com), browse to the resource for your app. You will [see charts showing telemetry](app-insights-dashboards.md) from your app. (If it hasn't shown up on the main page yet, click Live Metrics Stream.)


## Next steps

* [Set up a dashboard](app-insights-dashboards.md) to bring together the most important charts monitoring this and other apps.
* [Learn about metrics](app-insights-metrics-explorer.md)
* [Set up alerts](app-insights-alerts.md)
* [Diagnosing performance issues](app-insights-detect-triage-diagnose.md)
* [Powerful Analytics queries](app-insights-analytics.md)
* [Availability web tests](app-insights-monitor-web-app-availability.md)
