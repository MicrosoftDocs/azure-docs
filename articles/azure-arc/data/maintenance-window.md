---
title: Maintenance window - Azure Arc-enabled data services
description: Article describes how to set a maintenance window
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: devx-track-azurecli
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 03/31/2022
ms.topic: how-to
---

# Maintenance window - Azure Arc-enabled data services

Configure a maintenance window on a data controller to define a time period for upgrades. In this time period, the Arc-enabled SQL Managed Instances on that data controller which have the `desiredVersion` property set to `auto` will be upgraded.

During setup, specify a duration, recurrence, and start date and time. After the maintenance window starts, it will run for the period of time set in the duration. The instances attached to the data controller will begin upgrades (in parallel). At the end of the set duration, any upgrades that are in progress will continue to completion. Any instances that did not begin upgrading in the window will begin upgrading in the following recurrence.

## Prerequisites

An Azure Arc-enabled SQL Managed Instance with the [`desiredVersion` property set to `auto`](upgrade-sql-managed-instance-auto.md).

## Limitations

The maintenance window duration can be from 2 hours to 8 hours.

Only one maintenance window can be set per data controller.

## Configure a maintenance window

The maintenance window has these settings:

- Duration - The length of time the window will run, expressed in hours and minutes (HH:mm).
- Recurrence - how often the window will occur. All words are case sensitive and must be capitalized. You can set weekly or monthly windows.
    - Weekly
        - [Week | Weekly][day of week]
        - Examples:
            - `--recurrence "Week Thursday"`
            - `--recurrence "Weekly Saturday"`
	- Monthly
		- [Month | Monthly] [First | Second | Third | Fourth | Last] [day of week]
		- Examples:
			- `--recurrence "Month Fourth Saturday"`
			- `--recurrence "Monthly Last Monday"`
	- If recurrence isn't specified, it will be a one-time maintenance window.
- Start - the date and time the first window will occur, in the format `YYYY-MM-DDThh:mm` (24-hour format).
	- Example:
		- `--start "2022-02-01T23:00"`
- Time Zone - the [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) associated with the maintenance window.

#### CLI

To create a maintenance window, use the following command:

```cli
az arcdata dc update --maintenance-start <date and time> --maintenance-duration <time> --maintenance-recurrence <interval> --maintenance-time-zone <time zone> --k8s-namespace <namespace> --use-k8s
```

Example:

```cli
az arcdata dc update --maintenance-start "2022-01-01T23:00" --maintenance-duration 3:00 --maintenance-recurrence "Monthly First Saturday" --maintenance-time-zone US/Pacific --k8s-namespace arc --use-k8s
```

## Monitor the upgrades

During the maintenance window, you can view the status of upgrades.

```kubectl
kubectl -n <namespace> get sqlmi -o yaml 
```

The `status.runningVersion` and `status.lastUpdateTime` fields will show the latest version and when the status changed.

## View existing maintenance window

You can view the maintenance window in the `datacontroller` spec. 

```kubectl
kubectl describe datacontroller -n <namespace>
```

Output:

```text
Spec:  
  Settings:
    Maintenance:
      Duration:    3:00
      Recurrence:  Monthly First Saturday
      Start:       2022-01-01T23:00
      Time Zone:   US/Pacific
```

## Failed upgrades

There is no automatic rollback for failed upgrades. If an instance failed to upgrade automatically, manual intervention will be needed to pin the instance to its current running version, using `az sql mi-arc update`. After the issue is resolved, the version can be set back to "auto".

```cli
az sql mi-arc upgrade --name <instance name> --desired-version <version> 
```

Example:
```cli
az sql mi-arc upgrade --name sql01 --desired-version v1.2.0_2021-12-15
```

## Disable maintenance window

When the maintenance window is disabled, automatic upgrades will not run. 

```cli
az arcdata dc update --maintenance-enabled false --k8s-namespace <namespace> --use-k8s
```

Example:

```cli
az arcdata dc update --maintenance-enabled false --k8s-namespace arc --use-k8s
```

## Enable maintenance window

When the maintenance window is enabled, automatic upgrades will resume. 

```cli
az arcdata dc update --maintenance-enabled true --k8s-namespace <namespace> --use-k8s
```

Example:

```cli
az arcdata dc update --maintenance-enabled true --k8s-namespace arc --use-k8s
```

## Change maintenance window options 

The update command can be used to change any of the options. In this example, I will update the start time.

```cli
az arcdata dc update --maintenance-start <date and time> --k8s-namespace arc --use-k8s
```

Example:

```cli
az arcdata dc update --maintenance-start "2022-04-15T23:00" --k8s-namespace arc --use-k8s
```

## Next steps

[Enable automatic upgrades of a SQL Managed Instance](upgrade-sql-managed-instance-auto.md)
