---
title: Observability in Azure Container Apps
description: Monitor your running app in Azure Container Apps
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/29/2022
ms.author: v-wellsjason
---

# Observability in Azure Container Apps

Azure Container Apps provides several built-in observability features that together give you a holistic view of your container app’s health throughout its application lifecycle.  These features help you monitor and diagnose the state of your app to improve performance and respond to trends and critical problems.

These features include:

|Feature  |Description  |
|---------|---------|
|[Log streaming](log-streaming.md) | View streaming system and console logs from a container in near real-time. |
|[Container console](container-console.md) | Connect to the Linux console in your containers to debug your application from inside the container. |
|[Azure Monitor metrics](metrics.md)| View and analyze your application's compute and network usage through metric data. |
|[Application logging](logging.md) | Monitor, analyze and debug your app using log data.|
|[Azure Monitor Log Analytics](log-monitoring.md) | Run queries to view and analyze your app's system and application logs. |
|[Azure Monitor alerts](alerts.md) | Create and manage alerts to notify you of events and conditions based on metric and log data.|

>[!NOTE]
> While not a built-in feature, [Azure Monitor Application Insights](../azure-monitor/app/app-insights-overview.md) is a powerful tool to monitor your web and background applications.  Although Container Apps doesn't support the Application Insights auto-instrumentation agent, you can instrument your application code using Application Insights SDKs.  

## Application lifecycle observability

With Container Apps observability features, you can monitor your app throughout the development-to-production lifecycle. The following sections describe the most effective monitoring features for each phase.

### Development and test

During the development and test phase, real-time access to your containers' application logs and console is critical for debugging issues.  Container Apps provides: 

- [Log streaming](log-streaming.md): View real-time log streams from your containers.
- [Container console](container-console.md): Access the container console to debug your application.

### Deployment

Once you deploy your container app, continuous monitoring helps you quickly identify problems that may occur around error rates, performance, and resource consumption.

Azure Monitor gives you the ability to track your app with the following features:

- [Azure Monitor metrics](metrics.md): Monitor and analyze key metrics.
- [Azure Monitor alerts](alerts.md): Receive alerts for critical conditions.
- [Azure Monitor Log Analytics](log-monitoring.md): View and analyze application logs.

### Maintenance

Container Apps manages updates to your container app by creating [revisions](revisions.md).  You can run multiple revisions concurrently in blue green deployments or to perform A/B testing.  These observability features will help you monitor your app across revisions:

- [Azure Monitor metrics](metrics.md): Monitor and compare key metrics for multiple revisions.
- [Azure Monitor alerts](alerts.md): Receive individual alerts per revision.
- [Azure Monitor Log Analytics](log-monitoring.md): View, analyze and compare log data for multiple revisions.

## Next steps

> [!div class="nextstepaction"]
> [Health probes in Azure Container Apps](health-probes.md)
