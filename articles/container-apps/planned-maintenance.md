---
title: Azure Container Apps planned maintenance (preview)
description: Configure system-level planned maintenance in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 10/25/2024
ms.author: cshoe
---

# Azure Container Apps planned maintenance (preview)

Azure Container Apps is a fully managed service where platform and infrastructure updates are regularly and automatically applied to both components and environments.

| Update type | Description | Timing |
|---|---|---|
| Critical | Urgent updates include changes essential to the security and stability of your app. | Anytime |
| Noncritical | Security patches, bug fixes, and the introduction of new features. | During your planned maintenance window, or anytime if a window isn't configured. |

With maintenance windows, the system is designed to minimize the effect on performance of your apps during updates. There are, however, some scenarios where your app or job replicas could restart during the update process. By defining maintenance windows, you can control when updates are applied to your components and environments.

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

## Add a maintenance window

You can add a maintenance window to an environment with the `maintenanceconfiguration add` command.

```azurecli
az containerapp env maintenanceconfiguration add  \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --weekday Monday \
  --start-hour-utc 1  
  --duration 8 
```

## Update a maintenance window

You can update the maintenance window for an environment with the `maintenanceconfiguration update` command.

```azurecli
az containerapp env maintenanceconfiguration update \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \ 
  --weekday Monday \
  -- start-hour-utc 1 \
  --duration 9 
```

## View the configured window

You can view an environment's maintenance window with the `maintenanceconfiguration show` command.

```azurecli
az containerapp env maintenanceconfiguration show \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME>
```

## Delete a maintenance window

To delete an environment's maintenance window, use the `maintenanceconfiguration delete` command.

```azurecli
az containerapp env maintenanceconfiguration delete 
  --resource-group <RESOURCE_GROUP>  
  --environment <ENVIRONMENT_NAME>
```

## View results of maintenance actions

TODO: query that indicates start, end, and success of scheduled maintenance

## Considerations

Maintenance windows are free during preview

## Next steps

* TODO
