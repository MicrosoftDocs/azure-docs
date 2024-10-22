---
title: Azure Container Apps planned maintenance (preview)
description: Configure system-level planned maintenance in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 10/22/2024
ms.author: cshoe
---

# Azure Container Apps planned maintenance (preview)

Azure Container Apps is a fully managed platform. Updates are regularly and automatically applied to a Container Apps environment's underlying infrastructure and platform components. These updates include security patches, bug fixes, and new features. While Azure Container Apps is designed to minimize, impact to your applications during updates, there are update scenarios where your app or job replicas may be restarted. You can control when these updates are applied to your environment by configuring maintenance windows.

## How maintenance windows work

You can define a weekly maintenance window for your Azure Container Apps environment. If a maintenance window is configured, regular, noncritical updates are applied during this window.

To define a maintenance window, you specify a day of week, a start time in the UTC time zone, and a duration.

There are some things to note about the planned maintenance feature:

* Container Apps supports one maintenance window configuration with one schedule entry per environment. The minimum duration for a maintenance window is 8 hours.
* Planned maintenance is a best-effort feature. When there are critical updates, Container Apps may apply these updates outside of the maintenance window to ensure the security and reliability of the platform and your applications.
* Replicas running on *consumption workload profiles* may also be restarted outside of the maintenance window during updates to the underlying serverless containers platform.

## Minimize impact to your applications

In many cases, you can minimize the impact of platform updates on your applications by following these practices:

* Create a maintenance window that aligns with your organization's off-peak hours.
* To minimize downtime, follow the guidance for building [reliable Container Apps](https://learn.microsoft.com/en-us/azure/reliability/reliability-azure-container-apps?tabs=azure-cli), including the use of availability zones and multiple replicas.
* Configure your apps and jobs to be stateless so that they can be restarted without data loss.
* When building microservice applications, use the [Retry](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry) and [Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) patterns to handle transient failures.

## Configure a maintenance window
 
```azurecli
TODO
```

## Next steps

* TODO
