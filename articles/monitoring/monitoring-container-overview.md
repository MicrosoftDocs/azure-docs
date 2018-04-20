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
ms.date: 04/19/2018
ms.author: magoedte
---

# Overview of monitoring Containers in Azure
With Azure, you can effectively monitor and manage your workloads deployed on Azure containers running Kubernetes or Docker. It is important to understand how containers with multiple microservice applications are performing in order to deliver a reliable service at scale and support your monitoring plan. This article provides a brief overview of the management and monitoring capabilities in Azure to help you understand each and which are appropriate based on your requirements.

Using [Container Monitoring for AKS](monitoring-container-performance.md), you can view the performance and health of your Linux container infrastructure at a glance and investigate issues quickly. The telemetry is stored in a Log Analytics workspace and integrated in the Azure portal, where you can explore, filter, and segment aggregated data with dashboards to keep an eye on load, performance, and health.  

For containers running outside of the hosted Azure Kubernetes service, the Log Analytics [Container Solution](../log-analytics/log-analytics-containers.md) helps you view and manage your Windows and Docker container hosts. From your Log Analytics workspace, it shows you which containers are running, what container image they’re running, and where containers are running.  You can view detailed audit information showing commands used with containers, and you can troubleshoot containers by viewing and searching centralized logs without having to remotely view Docker or Windows hosts.

Once you have configured container monitoring, you should consider including any other application component dependencies (that is, Azure resources) to avoid any monitoring gaps with the application and verify you are able to meet operating and service availability requirements.  

It is important to monitor the application running on one or more containers to identify issues that impact usability and responsiveness for users accessing those applications.  This can be accomplished with [Application Insights](../application-insights/app-insights-overview.md) and deliver end-to-end monitoring of application health.  