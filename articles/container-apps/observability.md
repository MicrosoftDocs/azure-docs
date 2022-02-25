---
title: 'Observability'
description: Observability in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: concept
ms.date: 02/11/2022
ms.author: v-bcatherine
---

# Observability in Container Apps

Observability features in Azure Container Apps provide a holistic view of the behavior and health of your container apps.  This information helps you understand how your applications are performing so you proactively identify and address issues. 

<!-- Diagram here -->

You can observe:
 
* Container details and state
* Streaming logs
* Console
* Events
* Azure Monitor and metrics
* Alerts: User managed setting to receive notifications based on logged events and system thresholds
* Log Analytics

## Observability features

There are many methods to observe your application. Some features automatically gather information from your container app, and others can be configured or instrumented.

  
### Container details and state

The details for each container app and individual container are available via the Azure portal and the Azure CLI.  

>[!NOTE] Add screen shot for portal
> Add cli command and output

## Streaming Logs

<!-- Screen shot of azure cli -->
<!-- Question:  can we get the same information from the CLI?  Are there APIs that could be used to programmatically gather this information? -->

## Console

You can access your container apps console via bash or sh providing you have them installed in your image.  Console access allows you to work in your container app environment to test and debug your application.  You can connect to the console of each running container revision and replica via the Azure portal.

> [!NOTE] insert image of the port page here
> Add instructions for connecting to and logging into the console.

### Events

What events are available.  Is there a list?  Does the user have to enable them? 

### Azure Monitor and metrics

[Azure Monitor][azure-monitoring] provides insight into the compute resources used by your containers instances. This resource usage data helps you determine the best resource settings for your container groups. Azure Monitor also provides metrics that track network activity in your container instances.  These metrics can be gathered using both and Azure portal and the Azure CLI

This document details gathering Azure Monitor metrics for container instances using both the Azure portal and Azure CLI.

> [!IMPORTANT]
> Azure Monitor metrics in Azure Container Apps are currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

#### Available metrics

Azure Monitor provides the following metrics.  These metrics are available for each individual container and container app.

* CPU usage nanocores
* Memory working set bytes
* Network in bytes
* Network out bytes
* Number of Requests

>[!NOTE] I think that we should link to a separate article,  because there is a lot to our implementation in the metrics blade.  

### Alerts

What are alerts?  Are there any alerts outside of metrics and log analytics?

## Log Analytics

Each Container Apps environment must include a Log Analytics workspace with provides a common log space for each container app in the environment.  
<!-- can Azure Event Hubs we used to forward outside of Azure?  Does Container Apps create Activity, Resource and Platform Logs?  If so what operations are logged?   -->

## Observability throughout the application lifecycle

Container Apps provides continuous monitoring across each phase of our DevOps and IT operations life cycle.  This help to continuously ensure the health, performance, and reliability  of your application and infrastructure as it moves from development to production.  Azure Monitor, the unified monitoring solution, provides full-stack observability across applications and infrastructure. 

### Development and Test

During development and test these observability features are key your DevOps experience.

* Console access via the Azure portal
* Log streaming
* Log Analytics

### Deployment and Runtime

You can monitor the performance and resource utilization and be set up notifications for  important events for your application via:

* Azure Monitor 
* Metrics
* Log Analytics
* Events

### Updates and Revisions

Container Apps supports the monitoring of every active revision.  You can monitor and compare the behavior and performance across revisions through:

* Azure Monitor
* Metrics
* Application Insights 
