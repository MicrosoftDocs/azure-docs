---
title: What's new in Update management center (Preview)
description: Learn about what's new and recent updates in the Update management center (Preview) service.
ms.service: update-management-center
ms.topic: overview
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 03/03/2023
---

# What's new in Update management center (Preview)

[Update management center (preview)](overview.md) helps you manage and govern updates for all your machines. You can monitor Windows and Linux update compliance across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. This article summarizes new releases and features in Update management center (Preview).

## April 2023

### New prerequisite for scheduled patching

A new patch mode - **Azure orchestrated with user managed schedules (Preview)** is introduced as a prerequisite to enable scheduled patching on Azure VMs. The new patch enables the *Azure-orchestrated using Automatic guest patching* and *BypassPlatformSafteyChecksOnUserSchedule* VM properties on your behalf after receiving the consent. [Learn more](prerequsite-for-schedule-patching.md).

> [!IMPORTANT]
> For a seamless scheduled patching experience, we recommend that for all Azure VMs, you update the patch mode to *Azure orchestrated with user managed schedules (preview)*. If you fail to update the patch mode, you can experience a disruption in business continuity because the schedules will fail to patch the VMs.


## November 2022

### New region support

Update management center (Preview) now supports new five regions for Azure Arc-enabled servers. [Learn more](support-matrix.md#supported-regions).

## October 2022

### Improved on-boarding experience

You can now enable periodic assessment for your machines at scale using [Policy](periodic-assessment-at-scale.md) or from the [portal](manage-update-settings.md#configure-settings-on-single-vm).


## Next steps

- [Learn more](support-matrix.md) about supported regions.