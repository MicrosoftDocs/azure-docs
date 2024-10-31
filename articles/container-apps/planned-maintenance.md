---
title: Azure Container Apps planned maintenance (preview)
description: Configure system-level planned maintenance in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 10/31/2024
ms.author: cshoe
---

# Azure Container Apps planned maintenance (preview)

Azure Container Apps is a fully managed service where platform and infrastructure updates are regularly and automatically applied to both components and environments.

The Container Apps update system is designed to minimize the effect on performance of your apps during updates. By defining maintenance windows, you can designate the most advantageous times for your application.

Depending on the type of update, you can choose to define a maintenance window that controls when noncritical updates are applied to your Container Apps environment.

The following table describes the difference between the timing in how *critical* and *noncritical* updates are applied to your environment.

| Update type | Description | Timing |
|---|---|---|
| Critical | Urgent fixes that include updates essential to the security and stability of your app. | Anytime |
| Noncritical | Routine security patches, bug fixes, and the introduction of new features. | If a planned maintenance window is defined, then updates only happen during that time span.<br><br>If a maintenance window isn't configured, then updates can be applied at any time. |

## How maintenance windows work

To control when noncritical updates are applied, you can define a weekly maintenance window for your Azure Container Apps environment. When you define a maintenance window, you specify a day of the week, a start time in the UTC format, and a duration.

Keep in mind the following considerations:

* You can only have one maintenance window per environment.

* The minimum duration for a maintenance window is 8 hours.

* Planned maintenance is a best-effort feature. When there are critical updates, Container Apps can apply these updates outside of the maintenance window to ensure the security and reliability of the platform and your applications.

* Support for maintenance windows is supported in all environments except for consumption workload profiles.

## Minimize impact to your applications

In many cases, you can minimize the impact of platform updates on your applications by following these practices:

* **Timing**: Create a maintenance window that aligns with your organization's off-peak hours.

* **Design**: To minimize downtime, follow the guidance for building [reliable Container Apps](/azure/reliability/reliability-azure-container-apps?tabs=azure-cli), including the use of availability zones and multiple replicas.

* **Data management**: Configure your apps and jobs to be stateless so that they restart without data loss.

* **Reliability**: When building microservice applications, use the [Retry](/azure/architecture/patterns/retry) and [Circuit Breaker](/azure/architecture/patterns/circuit-breaker) patterns to handle transient failures.

## Add a window

You can add a maintenance window to an environment with the `maintenance-config add` command.

Before running this command, make sure to replace the placeholders surrounded by `<>` with your own values.

```azurecli
az containerapp env maintenance-config add \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --weekday Monday \
  --start-hour-utc 1
  --duration 8
```

Times in UTC format are expressed using the 24-hour time format. For instance, if you want your start hour to be 1:00 pm, then your `start-hour-utc` value is `13`.

## Update a window

You can update the maintenance window for an environment with the `maintenance-config update` command.

Before running this command, make sure to replace the placeholders surrounded by `<>` with your own values.

```azurecli
az containerapp env maintenance-config update \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \ 
  --weekday Monday \
  --start-hour-utc 1 \
  --duration 9 
```

Times in UTC format are expressed using the 24-hour time format. For instance, if you want your start hour to be 1:00 pm, then your `start-hour-utc` value is `13`.

## View the window configuration

You can view an environment's maintenance window with the `maintenance-config show` command.

```azurecli
az containerapp env maintenance-config show \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME>
```

## Delete a window

To delete an environment's maintenance window, use the `maintenance-config delete` command.

```azurecli
az containerapp env maintenance-config delete \
  --resource-group <RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME>
```

## Considerations

Maintenance windows are free during preview.

## Next steps

> [!div class="nextstepaction"]
> [Observability overview](./observability.md)
