---
title: Monitoring overview
description: Learn how you can monitor your app in Azure App Service with various monitoring methods.
keywords: app service, azure app service, monitoring, diagnostic settings, support, web app, troubleshooting, 

ms.topic: article
ms.date: 02/25/2022
ms.author: msangapu

---
# Azure App Service monitoring overview

Azure App Service provides several options for monitoring resources for availability, performance, and operation. This article will provide an overview of the various monitoring methods and examples of when each one can be used.

## Platform metrics and logs

### Azure Monitor

(metrics and logs): Query, audit, and store logs written by your application, and logs/metrics from the App Service Platform.

Azure Monitor is a full stack monitoring service in Azure that provides a complete set of features to monitor your Azure resources in addition to resources in other clouds and on-premises. The Azure Monitor data platform collects data into logs and metrics where they can be analyzed together using a complete set of monitoring tools. App Service monitoring data can be shipped to Azure Monitor through Diagnostic Settings.

### Quotas and alerts

Set resource consumption alerts.

Apps that are hosted in App Service are subject to certain limits on the resources they can use. The limits are defined by the App Service plan that's associated with the app. Metrics for an app or an App Service plan can be hooked up to alerts.   (Include link to metrics article)

### Resource events
View a historical log of events changing your resource.   

Resource events help you understand any changes that were made to your underlying web app resources and take action as necessary. Event examples include scaling of instances, updates to application settings, restarting of the web app, and many more. 


## Application performance management

### (Azure Monitor) Application Insights

Get deep insights into your application performance and usage.

Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your live applications. It will automatically detect performance anomalies, and includes powerful analytics tools to help you diagnose issues and to understand what users actually do with your app.

### App Service Logs

get quick access to output and errors written by your application, and logs from the web server. These are standard output/error logs in addition to web server logs.
Azure provides built-in diagnostics to assist during testing and development to  debug an App Service app.  

## When to use monitoring methods

|Looking for|Monitoring method | Description|
|----------|-----------|------------|
|Platform metrics and logs | Azure Monitor |Azure Monitor Diagnostic Settings can be enabled when you need a full-stack monitoring service to collect, log, and query monitoring data. Diagnostic settings lets you export logs to other services, such as Log Analytics, Storage account, and Event Hub Large amounts of data using SQL-like Kusto can be queried with Log Analytics. 

You can directly capture platform logs in Azure Monitor Logs as configured via Diagnostic Settings, and instrument your app further with the dedicated APM feature (app insights), for additional telemetry and logs from within your apps.        |
|Get deep insights into your application performance and usage. |Azure Monitor Application Insights   |Full-stack service for developers and DevOps professionals to monitor live applications|
|When you want to check the built-in logs during testing and development.|App Service Logs | Get quick access to output and errors written by your application, and logs from the web server. These are standard output/error logs in addition to web server logs.|
|When you want to understand resource limits and configure alerts.|Quotas and alerts||
|When you want to monitor resource changes to your web app and take action as necessary.|Resource events||


## Next steps

