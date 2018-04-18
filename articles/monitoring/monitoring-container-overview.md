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
ms.date: 04/16/2018
ms.author: magoedte
---

# Overview of monitoring Containers in Azure
With Azure, you can effectively monitor and manage your workloads deployed on Azure containers running Kubernetes or Docker. It is important to understand how containers with multiple microservice applications are performing in order to deliver a reliable service at scale.  This article provides a brief overview of the management and monitoring capabilities in Azure to help you understand each and which are appropriate based on your requirements.  

Using [Container Monitoring for AKS](monitoring-container-performance.md), you can view the performance and health of your Linux container infrastructure at a glance and investigate issues quickly.  The telemetry is stored in a Log Analytics workspace and integrated in the Azure portal, where you can explore, filter, and segment aggregated data with dashboards to keep an eye on load, performance, and health.  

For containers running outside of the hosted Azure Kubernetes service, the Log Analytics [Container Solution](../log-analytics/log-analytics-containers.md) helps you view and manage your container hosts.  It helps you view and manage your Docker and Windows container hosts from your Log Analytics workspace, showing you hows which containers are running, what container image they’re running, and where containers are running.  You can view detailed audit information showing commands used with containers, and you can troubleshoot containers by viewing and searching centralized logs without having to remotely view Docker or Windows hosts.
