---
title: Migrate to App Service Environment v3 Without Using the Migration Tool
description: Migrate to App Service Environment v3 Without Using the Migration Tool
author: seligj95
ms.topic: article
ms.date: 11/19/2021
ms.author: jordanselig
---
# Migrate to App Service Environment v3 Without Using the Migration Tool

> [!NOTE]
> The App Service Environment v3 [migration tool](migrate.md) is now available in preview for a set of supported environment configurations. Consider that tool which provides an automated migration path to [App Service Environment v3](overview.md).
>

If you're currently using App Service Environment v1 or v2, you have the opportunity to migrate your workloads to [App Service Environment v3](overview.md). App Service Environment v3 has [advantages and feature differences](overview.md#feature-differences) that provide enhanced support your workloads and reduce overall costs. Consider using the [migration tool](migration.md) if your environment falls into one of the [supported configurations](migrate.md#supported-scenarios). If your environment isn't currently supported by the migration tool, you can wait for support if your scenario is listed in the [upcoming supported scenarios](migrate.md#preview-limitations) or choose to use one of the alternative migration options.

> [!IMPORTANT]
> If your App Service Environment will [not be supported for migration](migrate.md#migration-tool-limitations) with the migration tool, you must use one of the alternative methods to migrate to App Service Environment v3.
>

## Clone your app to an App Service Environment v3

many limitations...
Set up an ASEv3(link)
clone

## Backup your apps and restore them on an App Service Environment v3

backup and restore

## Manually create your apps on an App Service Environment v3

export and use ARM templates
follow same process you used to create apps on old ASE

## Recommendations

manual with app gateway and traffic redirection for testing to ensure functions as intended