---
title: Upgrade App Service Environment v2 to App Service Environment v3
description: Learn how to upgrade your App Service Environment v2 to an App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 10/07/2021
ms.author: jordanselig
---
# Upgrade App Service Environment v2 to App Service Environment v3 

App Service can now upgrade your qualified App Service Environment v2 to an [App Service Environment v3](overview.md). App Service Environment v3 provides many [advantages and feature differences](overview.md#feature-differences) over earlier versions. Make sure to review the [limitations](overview.md#feature-differences) of App Service Environment v3 before upgrading to reduce the risk of an unexpected application issue.

## Supported scenarios

At this time, App Service Environment upgrades to v3 are limited to current environments with the following specifications:

- App Service Environment v2
    - You can find the version of your App Service Environment by navigating to your App Service Environment in the [Azure portal](https://portal.azure.com) and selecting **Configuration** under **Settings** on the left-hand side. You can also use [Azure Resource Explorer](https://resources.azure.com/) and review the value of the `kind` property for your App Service Environment.
    - Both internal and external configurations are supported
- App Service Environment v3 must be available in the region you're using. Review this [list](overview.md#feature-differences) to confirm eligibility.

The following scenarios are currently not supported:

- Any App Service Environment v1
- An internal App Service Environment with a custom domain suffix
- An external App Service Environment with IP SSL addresses
- Zone pinned App Service Environment
- App Service Environment with customized large workers

Additionally, there must be sufficient App Service Environment v3 quota in the region you're using for the upgrade. The upgrade tool in the portal will do this check and all other eligibility checks before allowing you to start the upgrade. The upgrade tool will inform you of the reason for ineligibility if applicable.

> [!NOTE]
> This article will be updated as additional scenarios become supported.
> 

## Overview of upgrade process

The upgrade consists of two steps. During the second step of the upgrade process, the old App Service Environment will become unavailable. This means there will be downtime for your applications if you don't have a failover or standby ready. Also, **the public addresses that are used by the App Service Environment will change**.

Before starting the upgrade, you can update certain features depending on App Service Environment type and availability. The upgrade tool will automatically enable or disable these options for you depending on whether or not they're available. Note that an external App Service Environment cannot be upgraded to an internal App Service Environment v3 and an internal App Service Environment cannot be upgraded to an external App Service Environment v3.

- **App Service Environment Subnet**: The App Service Environment can be upgraded in the same subnet or you can pick a different existing subnet.
- **Zone Redundancy**: An upgraded App Service Environment can be configured with [zone redundancy](zone-redundancy.md) if zone redundancy is available in the selected region. Zone redundancy sets the minimum App Service plan to three instances and a total minimum number of instances to nine.
- **KeyVault**: Not supported at this time. Required for upgrade of an internal App Service Environment with custom domain suffix.

### Step 1 of upgrade

The system is prepared for upgrade. This step doesn't interrupt activity with your existing App Service Environment. It will potentially take 2 hours to complete. When completed, you'll have the new default outbound to the internet public addresses so you can adjust any external firewalls. If applicable, you'll need to configure the subnet, zone redundancy, and KeyVault before starting Step 1.

### Step 2 of upgrade

After Step 1 completes, you have 72 hours to continue to Step 2 or the pre-provisioning work done in Step 1 is eliminated. Step 2 removes the existing App Service Environment and replaces it with the new App Service Environment v3. During this step, the App Service Environment is down as well as all of the apps that are on it. When the upgrade is complete, the apps that were on the original App Service Environment will be running on the new environment. All App Service plans are converted from Isolated to Isolated v2. This step takes a minimum of one hour to complete and requires user confirmation before starting.

## Pricing

There's no cost to upgrade your App Service Environment. You'll stop being charged for your previous App Service Environment as soon as it shuts down and you'll begin being charged for your App Service Environment v3 as soon as it's deployed. For more information about App Service Environment v3 pricing, see [pricing details](overview.md#pricing). make sure you understand how things will change...

## How to upgrade to App Service Environment v3

### Before you upgrade

Ensure you understand how upgrading to an App Service Environment v3 will affect your application. Review the [upgrade process](#overview-of-upgrade-process) to understand the process timeline, where and when you'll need to get involved, and prepare for potential downtime if you don't have a failover or standby environment.

### Upgrading your App Service Environment

...

## Alternatives to upgrading

If you want to upgrade your App Service Environment to v3 but your current environment isn't eligible yet, you can [manually create an App Service Environment v3](creation.md) and deploy your apps on there. Once the new environment is created, you can deploy your apps from scratch using your [deployment method of choice](../deploy-continuous-deployment.md), or use [PowerShell](../app-service-web-app-cloning.md) or the **Clone App** tool found in the App Service portal under **Development Tools** to clone your apps from the old environment to the new one.