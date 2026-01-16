---
title: Service Policy
description: Complete service policy for Azure CycleCloud. See release types, release cadence, supported Azure CycleCloud versions, how to get support, and more.
services: azure cyclecloud
author: adriankjohnson
ms.topic: concept-article
ms.date: 12/12/2025
ms.author: padmalathas
---

# Azure CycleCloud service policy

This article describes the servicing policy for Azure CycleCloud and what you need to do to keep your system in a supported state.

## Lifecycle policy

Azure CycleCloud follows Microsoft's [Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy).

## Release types

Microsoft manages the end-to-end servicing lifecycle for the Azure CycleCloud software release and update packages. You can download these packages directly from Microsoft. We recommend that Azure CycleCloud operators set maintenance windows when installing releases. Each release updates your Azure CycleCloud installation's version.

There are three types of Azure CycleCloud releases: major, minor, and hotfix.

* **Major release**: These packages include the latest Azure CycleCloud features and functionality. Although we attempt to minimize any breaking changes between major versions, we don't guarantee backwards compatibility between major releases. We make efforts to call out any relevant warnings or details for upgrading.
* **Minor update**: These packages include the latest Azure CycleCloud security updates, bug fixes, and feature updates. We guarantee backwards compatibility within all the minor releases for a given major release.
* **Hotfix**: Occasionally, Microsoft provides Azure CycleCloud hotfixes that address a specific issue or issues that are often preventative or time-sensitive. Microsoft might provide a separate hotfix for each supported version of Azure CycleCloud. Each fix for a specific version is cumulative and includes previous updates for that same version.

For more information about a specific release, see the [product documentation](/azure/cyclecloud/release-notes).

## Azure CycleCloud release cadence

Microsoft plans to release Azure CycleCloud updates every month. However, some months might have multiple updates or no updates.

For information about a specific update, see the release notes for that update in our [product documentation](/azure/cyclecloud/release-notes).

## Supported Azure CycleCloud versions

To continue receiving support, keep your Azure CycleCloud deployment current with either the previous or latest major releases. You can run any minor update version for either major release.

If your Azure CycleCloud installation is behind by more than two major release updates, it's considered out of compliance. You must update it to at least the minimum supported version.

For example, the two most recently updated major releases are:

* Version 8:  8.7.x, 8.8.x

In this example, all versions listed are supported, and earlier versions are out of support.

Azure CycleCloud software update packages are cumulative. If you defer one or more updates, you can install the latest update package to become compliant.

## Keep your system supported

To learn how to upgrade running deployments to a supported version, see the product documentation: [Upgrade Azure CycleCloud](~/articles/cyclecloud/how-to/upgrade-and-migrate.md).

## Get support

Azure CycleCloud follows the same support process as Azure. Enterprise customers can follow the process described in [How to Create an Azure Support Request](/azure/azure-supportability/how-to-create-azure-support-request). For more information, see the [Azure Support FAQs](https://azure.microsoft.com/support/faq/).
