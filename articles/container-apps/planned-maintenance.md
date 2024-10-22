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

Azure Container Apps is a fully managed service where platform and infrastructure updates are regularly and automatically applied to both components and environments. These updates include security patches, bug fixes, and the introduction of new features.

The system is designed to minimize the effect on performance of your apps during updates. There are, however, some scenarios where your app or job replicas could restart during the update process. By defining maintenance windows, you can control when updates are applied to your components and environments.

## How maintenance windows work

You can define a weekly maintenance window for your Azure Container Apps environment. When a maintenance window is configured, regular, noncritical updates are applied during this window.

To define a maintenance window, you specify a day of week, a start time in the UTC time zone, and a duration.

Keep in mind the following considerations:

* Container Apps supports one maintenance window configuration with one schedule entry per environment.

* The minimum duration for a maintenance window is 8 hours.

* Planned maintenance is a best-effort feature. When there are critical updates, Container Apps can apply these updates outside of the maintenance window to ensure the security and reliability of the platform and your applications.

* Replicas running on *consumption workload profiles* might also restart outside of the maintenance window. These updates are applied to the underlying serverless containers platform.

## Minimize impact to your applications

In many cases, you can minimize the impact of platform updates on your applications by following these practices:

* **Timing**: Create a maintenance window that aligns with your organization's off-peak hours.

* **Design**: To minimize downtime, follow the guidance for building [reliable Container Apps](/azure/reliability/reliability-azure-container-apps?tabs=azure-cli), including the use of availability zones and multiple replicas.

* **Data management**: Configure your apps and jobs to be stateless so that they restart without data loss.

* **Reliability**: When building microservice applications, use the [Retry](/azure/architecture/patterns/retry) and [Circuit Breaker](/azure/architecture/patterns/circuit-breaker) patterns to handle transient failures.

## Configure a maintenance window

```azurecli
TODO
```

## Next steps

* TODO
