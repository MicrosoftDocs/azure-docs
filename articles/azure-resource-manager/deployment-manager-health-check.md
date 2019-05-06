---
title: Introduce health integration rollout to Azure Deployment Manager
description: Describes how to deploy a service over many regions with Azure Deployment Manager. It shows safe deployment practices to verify the stability of your deployment before rolling out to all regions.
services: azure-resource-manager
documentationcenter: na
author: mumian

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/06/19
ms.author: jgao

---

# Introduce health integration rollout to Azure Deployment Manager

[Azure Deployment Manager](./deployment-manager-overview.md) allows you to perform staged rollouts of Azure Resource Manager resources. The resources are deployed region by region in an ordered fashion. The integrated health check of Azure Deployment Manager can monitor rollouts, and automatically stop problematic rollouts, that allows you to troubleshoot and reduce the scale of the impact. This feature can reduce service unavailability caused by regressions in updates.

## Health monitoring providers

In order to make health integration as easy as possible, Microsoft has been working with some of the top service health monitoring companies to provide you with a simple copy/paste solution to integrate health checks with your deployments. If you’re not already using a health monitor, these are great solutions to start with. 

|-----|------|------|
| ![azure deployment manager health monitor provider datadog](./media/deployment-manager-health-check/azure-deployment-manager-health-monitor-provider-datadog.svg) | ![azure deployment manager health monitor provider site24x7](./media/deployment-manager-health-check/azure-deployment-manager-health-monitor-provider-site24x7.svg) | ![azure deployment manager health monitor provider wavefront](./media/deployment-manager-health-check/azure-deployment-manager-health-monitor-provider-wavefront.svg) |
|Datadog, the leading monitoring and analytics platform for modern cloud environments. See [how Datadog integrates with Azure Deployment Manager]().|The All-in-One Monitoring Solution. See [how Site24x7 integrates with Azure Deployment Manager](https://www.site24x7.com/azure/adm.html).| bla, bla, bla. See [how Wavefront integrates with Azure Deployment Manager]().|

## How service health is determined

Health monitoring providers offer several mechanisms for monitoring services and alerting you of any service health issues. [Azure Monitor](/services/monitor/) is an example of such offering. Azure Monitor can be used to create alerts when certain thresholds are exceeded. For example, your memory and CPU utilization spike beyond expected levels when you deploy a new update to your service. When notified, you can take corrective actions.

These health providers typically offer REST APIs so that the status of your service’s monitors can be examined programmatically. The REST APIs can either come back with a simple healthy/unhealthy signal (usually determined by the HTTP response code), and or with detailed information about the signals it is receiving.

The new *healthCheck* step in Azure Deployment Manager allows you to declare HTTP codes that indicate a healthy service, or, for more complex REST results, you can even specify regular expressions that, if they match, indicate a healthy response. To make this even easier to use, Microsoft is working closely with the top health monitoring providers to pre-author these HTTP codes and regular expressions, so that if you use one of these providers you can simply copy/paste this part of the healthCheck step.

The flow to getting setup with Azure Deployment Manager health checks:

1. Create your health monitors via a health service provider of your choice.
1. Create one or more healthCheck steps as part of your Azure Deployment Manager rollout.
1. Fill out the healthCheck steps with the following information:

    a. The URI for the REST API for your health monitors (as defined by your health service provider).
    a. Authentication information. Currently only API-key style authentication is supported.
    a. [HTTP status codes](https://www.wikipedia.org/wiki/List_of_HTTP_status_codes) or regular expressions that define a healthy response.	Note that you may provide regular expressions which ALL must match for the response to be considered healthy, or you may provide expressions of which ANY must match for the response to be considered healthy. Both methods are supported.

1. Invoke the healthCheck steps at the appropriate time in your Azure Deployment Manager rollout.

To walk through an example, see [Tutorial: Use health check in Azure Deployment Manager](./deployment-manager-health-check.md).

## Phases of a health check

At this point Azure Deployment Manager knows how to query for the health of your service and at what phases in your rollout to do so. However, Azure Deployment Manager also allows for deep configuration of the timing of these checks. A healthCheck step is executed in 3 sequential phases, all of which have configurable durations: 

1. Wait

    a. After a deployment operation is completed, VMs may be rebooting, re-configuring based on new data, or even being started for the first time. It also takes time for services to start emitting health signals to be aggregated by the health monitoring provider into something useful. During this tumultuous process, it may not make sense to check for service health since the update has not yet reached a steady state. Indeed, the service may be oscillating between healthy and unhealthy states as the resources settle. 
    b. During the Wait phase, service health is not monitored. This is used to allow the deployed resources the time to bake before beginning the health check process. 
1. Elastic

    a. Since it is impossible to know in all cases how long resources will take to bake before they become stable, the Elastic phase allows for a flexible time period between when the resources are potentially unstable and when they are required to maintain a healthy steady state.
    b. When the Elastic phase begins, Azure Deployment Manager begins polling the provided REST endpoint for service health periodically. The polling interval is configurable. 
    c. If the health monitor comes back signals indicating that the service is unhealthy, these signals are ignored, the Elastic phase continues, and polling continues. 
    d. As soon as the health monitor comes back with signals indicating that the service is healthy, the Elastic phase ends and the HealthyState phase begins. 
    e. Thus, the duration specified for the Elastic phase is the maximum amount of time that can be spent polling for service health before a healthy response is considered mandatory. 
1. HealthyState

    a. During the HealthyState phase, service health is continually polled at the same interval as the Elastic phase. 
    b. The service is expected to maintain healthy signals from the health monitoring provider for the entire specified duration. 
    c. If at any point an unhealthy response is detected, Azure Deployment Manager will stop the entire rollout and return the REST response carrying the unhealthy service signals. 
    d. Once the HealthyState duration has ended, the healthCheck is complete, and deployment continues to the next step.


## Next steps

In this article, you learned about how to integrate health check in Azure Deployment Manager. Proceed to the next article to learn how to deploy with Deployment Manager.

> [!div class="nextstepaction"]
> [Tutorial: integrate health check in Azure Deployment Manager](./deployment-manager-tutorial-health-check.md)