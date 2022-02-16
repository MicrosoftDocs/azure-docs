---
title: 'Observabilty'
description: Observability in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: concept
ms.date: 02/11/2022
ms.author: v-bcatherine
---

# Observability in Container Apps

Azure Container Apps together with Azure Monitor and Log Analytics holistic view of the behavior and health of your container apps.  This information helps you understand how your applications are performing and proactively identify issues affecting them and the resources they depend on. 

<!-- Diagram here -->

You can observe:
 
* Container details and state
* Application logs
* Events
* Metrics
* Alerts: User managed setting to receive notifications based on logged events and system thresholds
* Tracing:  

## Container details and state

The details for each container app and individual container are available via the Azure portal and the Azure CLI.  

<!-- Screen shot of azure cli -->
<!-- Question:  can we get the same information from the CLI?  Are there APIs that could be used to programmatically gather this information? -->
## Monitoring Container Apps



### Application Logs

Each Container Apps environment must include a Log Analytics workspace with provides a common log space for each container app in the environment.  
<!-- can Azure Event Hubs we used to forward outside of Azure?  Does Container Apps create Activity, Resource and Platform Logs?  If so what operations are logged?   -->

### Events

### Metrics

### Alerts

### Tracing

## Observability throughout the application lifecycle

Continuous monitoring across each phase of our DevOps and IT operations lifecycles.  Help to continuously ensure the health, performance, and reliability  of your application and infrastructure as it moves from development to production.  Done through Azure Monitor, the unified monitoring solution that provides full-stack observability across applications and infrastructure. 

### Development and Test

### Deployment and Runtime

### Updates and Revisions


*  
