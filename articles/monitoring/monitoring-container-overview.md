---
title: Monitoring Azure Containers Overview| Microsoft Docs
description: This article provides an overview of the different methods available in Azure to monitor Containers in Azure to quickly understand a clusters health and availability.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: 

ms.assetid: 
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/24/2018
ms.author: magoedte
---

# Overview of monitoring Containers in Azure
With Azure, you can effectively monitor and manage your workloads deployed on Azure containers running Kubernetes or Docker. It is important to understand how containers with multiple microservice applications are performing in order to deliver a reliable service at scale and support your monitoring plan. This article provides a brief overview of the management and monitoring capabilities in Azure to help you understand them, and which are appropriate based on your requirements.

Using [Azure Monitor for containers](monitoring-container-insights-overview.md), you can view the performance and health of your Linux container infrastructure at a glance and investigate issues quickly. The telemetry is stored in a Log Analytics workspace and integrated in the Azure portal, where you can explore, filter, and segment aggregated data with dashboards to keep an eye on load, performance, and health.  

For containers running outside of the hosted Azure Kubernetes service, the Log Analytics [Windows and Docker Container solution](../log-analytics/log-analytics-containers.md) helps you view and manage your Windows and Docker container hosts. From your Log Analytics workspace, you can view inventory details, performance, and events from nodes and containers in the environment. You can view detailed audit information showing commands used with containers, and you can troubleshoot containers by viewing and searching centralized logs without having to remotely access Docker or Windows hosts.

To achieve holistic or end-to-end monitoring of the application, any dependency whether it is an Azure or on-premises resource, should be monitored with Azure Monitor or Log Analytics.  The application layer should be included in order to add an additional layer of health awareness, both at the platform and application level using Application Insights. At the platform level, there are Application Insights SDKs for [Kubernetes]( https://github.com/Microsoft/ApplicationInsights-Kubernetes), [Docker](https://hub.docker.com/r/microsoft/applicationinsights/), and [Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-appinsights). For microservice applications, there is support for [Java](../application-insights/app-insights-java-get-started.md), [Node.js](../application-insights/app-insights-nodejs-quick-start.md), [.Net](../application-insights/app-insights-asp-net.md), [.Net  Core](../application-insights/app-insights-asp-net-core.md), as well as a number of other [languages/frameworks](../application-insights/app-insights-platforms.md). 

Otherwise, issues will go unidentified that could impact the availability of the application and service level targets will not be met.  
