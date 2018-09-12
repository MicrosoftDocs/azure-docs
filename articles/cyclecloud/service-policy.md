---
title: Azure CycleCloud Service Policy | Microsoft Docs
description: Complete service policy for Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: resource
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Azure CycleCloud Service Policy

This article describes the servicing policy for Azure CycleCloud, and what you must do to keep your system in a supported state.

## Lifecycle Policy

Azure CycleCloud follows Microsoft’s [Modern Lifecycle Policy](https://support.microsoft.com/en-us/help/30881/modern-lifecycle-policy).

## Release Types

Microsoft is responsible for the end-to-end servicing lifecycle for the Azure CycleCloud software release and update packages, which can be downloaded directly from Microsoft. We recommend Azure CycleCloud Operators set maintenance windows when installing releases. Releases update your Azure CycleCloud installation’s version.

There are three types of Azure CycleCloud release: major, minor, and hotfix.

* **Major Release**: These packages include the latest Azure CycleCloud features and functionality. Although we attempt to minimize any breaking changes between major versions, we do not guarantee backwards compatibility between major releases. We will make efforts to call out any relevant warnings or details for upgrading.
* **Minor Update**: These packages can include the latest Azure CycleCloud security updates, bug fixes, and feature updates. We guarantee backwards compatibility within all the minor releases for a given major release.
* **Hotfix**: Occasionally, Microsoft provides Azure CycleCloud hotfixes that address a specific issue or issues that are often preventative or time-sensitive. A separate hotfix may be provided for each supported version of Azure CycleCloud as appropriate. Each fix for a specific iteration is cumulative and includes the previous updates for that same version.

For more information about a specific release, see the [product documentation](https://docs.microsoft.com/en-us/azure/cyclecloud/release-notes).

## Azure CycleCloud Release Cadence

Microsoft expects to release Azure CycleCloud updates on a monthly cadence. However, it’s possible to have multiple, or no update releases in a month.

For information about a specific update see the release notes for that update in our [product documentation](https://docs.microsoft.com/en-us/azure/cyclecloud/release-notes).

## Supported Azure CycleCloud Versions

To continue to receive support, you must keep your Azure CycleCloud deployment current to either the previous or latest major releases, running any minor update version for either major release.

If your Azure CycleCloud installation is behind by more than two major release updates, it's considered out of compliance and must be updated to at least the minimum supported version.

For example, if the previous and current major releases are versions 6 and 7, and the three most recent update versions are:

* Version 6:  6.8.0, 6.7.0, 6.6.0
* Version 7:  7.2.0, 7.1.1, 7.0.0

In this example, all versions listed above would be supported, but 5.x.x - and all prior versions - would be out of support. Additionally, when version 8.x.x is released, version 6.x would transition to legacy/unsupported.

Azure CycleCloud software update packages are cumulative. If you decide to defer one or more updates, you may install the latest update package to become compliant.

## Keeping Your System Supported

See product documentation to learn how to upgrade running deployments to a supported version: [Upgrade Azure CycleCloud](~/cyclecloud-references/upgrade-and-migrate.md).

## Get Support

Azure CycleCloud follows the same support process as Azure. Enterprise customers can follow the process described in [How to Create an Azure Support Request](https://docs.microsoft.com/en-us/azure/azure-supportability/how-to-create-azure-support-request). For more information, see the [Azure Support FAQs](https://azure.microsoft.com/en-us/support/faq/).
