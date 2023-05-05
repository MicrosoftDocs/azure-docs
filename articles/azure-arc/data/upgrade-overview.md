---
title: Overview - upgrade Azure Arc-enabled data services
description: Explains how to upgrade Azure Arc-enabled data controller, and other data services.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 08/15/2022
ms.topic: conceptual
---

# Upgrade Azure Arc-enabled data services

This article describes the paths and options to upgrade Azure Arc-enabled data controller and data services.

## Supported versions

Each release contains an image tag. Use the image tag to identify when Microsoft released the component. Microsoft supports the component for one full year after the release. 

Identify your current version by image tag. The image tag version scheme is:
- `<Major>.<Minor>.<optional:revision>_<date>`.
- `<date>` identifies the year, month, and day of the release. The pattern is: YYYY-MM-DD. 

For example, a complete image tag for the release in June 2022 is: `v1.8.0_2022-06-06`.

The example image released on June 6, 2022. 

Microsoft supports this release through June 5, 2023.

> [!NOTE]
> The latest current branch version is always in the **Full Support** servicing phase. This support statement means that if you encounter a code defect that warrants a critical update, you must have the latest current branch version installed in order to receive a fix.

## Upgrade path

Upgrades are limited to the next incremental minor or major version. For example:

- Supported version upgrades:
    - 1.1 -> 1.2
    - 1.3 -> 2.0
- Unsupported version upgrades:
    - 1.1 -> 1.4 Not supported because one or more minor versions are skipped.

## Upgrade order

Upgrade the data controller before you upgrade any data service. Azure Arc-enabled SQL Managed Instance is an example of a data service.

A data controller may be up to one version ahead of a data service. A data service major version may not be one version ahead, or more than one version behind a data controller. 

The following list displays supported and unsupported configurations, based on image tag.

- Supported configurations.
   - Data controller and data service at same version:
      - Data controller: `v1.9.0_2022-07-12`
      - Data service: `v1.9.0_2022-07-12`
   - Data controller ahead of data service by one version:
      - Data controller: `v1.9.0_2022-07-12`
      - Data service: `v1.8.0_2022-06-14`

- Unsupported configurations:
   - Data controller behind data service:
      - Data controller: `v1.8.0_2022-06-14`
      - Data service: `v1.9.0_2022-07-12`
   - Data controller ahead of data service by more than one version:
      - Data controller: `v1.9.0_2022-07-12`
      - Data service: `v1.6.0_2022-05-02`

## Schedule maintenance

The upgrade will cause a service interruption (downtime).

The amount of time to upgrade the data service depends on the service tier.

The data controller upgrade does not cause application downtime. 

- General Purpose: A single replica is not available during the upgrade.
- Business Critical: A SQL managed instance incurs a brief service interruption (downtime) once during an upgrade. After the data controller upgrades a secondary replica, the service fails over to an upgraded replica. The controller then upgrades the previous primary replica.

> [!TIP]
> Upgrade the data services during scheduled maintenance time. 

### Automatic upgrades

When a SQL managed instance `desiredVersion` is set to `auto`, the data controller will automatically upgrade the managed instance. 