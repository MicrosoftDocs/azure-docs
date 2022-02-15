---
title: Azure Virtual Desktop autoscale (preview) glossary - Azure
description: A glossary of terms and concepts for the Azure Virtual Desktop autoscale (preview) feature.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/14/2022
ms.author: helohr
manager: femila
---
# Autoscale (preview) glossary

This article is a list of definitions for key terms and concepts related to the autoscale (preview) feature for Azure Virtual Desktop.

## Autoscale

The autoscale feature is Azure Virtual Desktop’s native scaling service that turns VMs on and off based on the number of sessions on the session hosts in the host pool.

## Scaling tool

Azure Virtual Desktop’s scaling tool uses Azure Automation and Azure Logic Apps to scale the amount of active VMs throughout the day to maximize performance. The scaling tool shuts down and deallocates session host VMs during [off-peak](#off-peak) usage hours, then turns them back on and reallocates them during [peak](#peak) hours.

## Scaling plan

A scaling plan is an Azure Virtual Desktop Azure Resource Manager object that defines the schedules for scaling session hosts in a host pool. You can assign one scaling plan to multiple host pools. Each host pool can only have one scaling plan assigned to it.

## Schedule

Schedules are sub-resources of scaling plans that specify start time, capacity threshold, minimum percentage of hosts, the load-balancing algorithm, and other configuration settings for the different phases of the day.

## Ramp up

The ramp-up phase of a [scaling plan](#scaling-plan) [schedule](#schedule) is usually at the beginning of the work day, when users start to sign in and start their sessions. In this phase, the number of [active user sessions](#active-user-session) should increase at a rapid pace, but not reach the maximum number of active sessions yet.

## Peak

The phase of the schedule where your deployment reaches the maximum number of [active user sessions](#active-user-session) it can handle. In this phase, the number of active sessions are expected to hold steady until the peak ends. New active user sessions can be established during this phase, but at a slower rate than the ramp-up phase.

## Ramp down

The ramp-down phase of a [scaling plan](#scaling-plan) [schedule](#schedule) is at the end of the work day, when users start to sign out and end their sessions for the evening. In this phase, we expect the number of [active user sessions](#active-user-session) to decrease rapidly.

## Off-peak

The off-peak phase of the [scaling plan](#scaling-plan) [schedule](#schedule) is when the deployment reaches the minimum number of[active user sessions](#active-user-session) for the day. During this phase, we don't expect many users to be active, but you may want to keep a small amount of resources on hand to accommodate users who work outside typical working hours.

## Capacity threshold

The capacity threshold is the percentage of a [host pool's capacity](#host-pool-capacity) that, when reached, triggers the scaling process to happen.

For example:

- If the host pool's current capacity is below the threshold and you can turn off virtual machines (VMs) without going over the capacity threshold, then scaling will turn the VMs off.
- If the [host pool capacity](#host-pool-capacity) goes over the capacity threshold, then scaling will keep the VMs on until the host pool goes below the capacity threshold.

## Host pool capacity

Host pool capacity is how many [active sessions](#active-user-session) a host pool can contain. The host pool capacity is the host pool's maximum session limit divided by the number of available session hosts in the host pool.

In other words:

Host pool maximum session limit ÷ number of available session hosts = host pool capacity.

## Used host pool capacity

The used host pool capacity is the amount of [maximum host pool capacity](#host-pool-capacity) that's currently taken up by [active user sessions](#active-user-session).

In other words:

The number of [active](#active-user-session) and [disconnected or inactive user sessions](#disconnected-user-session) ÷ [the host pool's capacity](#host-pool-capacity) = used host pool capacity.

## Scaling action

Scaling actions are when [the autoscale feature](#autoscale) turns VMs on or off.

## Minimum percentage of hosts

The minimum percentage of hosts is the lowest percentage of all session hosts in the host pool that must be active for each phase of the [scaling plan](#scaling-plan) [schedule](#schedule).

## Active user session

A user session is considered "active" when the user signs in and connects to their remote app or desktop resource.

## Disconnected user session

A disconnected user session is an inactive session that the user hasn't signed out of yet. When a user reconnects to their remote resources, they'll be redirected to either their disconnected session or a new session on the session host they were working in. At this point, the disconnected session becomes an [active session](#active-user-session) again.

## Force sign-out ("logoff")

A forced sign-out (sometimes called a "logoff" in certain code text) is when the service ends an [active user session](#active-user-session) without the user's consent.

## Exclusion tag

An exclusion tag is a bit of metadata in the scaling plan that's applied to VMs you want to exclude from scaling actions. [The autoscale feature](#autoscale) only performs scaling actions on VMs without tag names that match the exclusion tag.

## Next steps

- For more information about the autoscale feature, see the [autoscale feature document](autoscale-scaling-plan.md).
- For more information about the scaling script, see the [scaling script document](set-up-scaling-script,md).
