---
title: Azure Virtual Desktop Autoscale (preview) glossary - Azure
description: A glossary of terms and concepts for the Azure Virtual Desktop autoscale (preview) feature.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/11/2022
ms.author: helohr
manager: femila
---
# Autoscale (preview) glossary

This article is a list of definitions for key terms and concepts related to the autoscale (preview) feature for Azure Virtual Desktop.

## Autoscale

Autoscale is Azure Virtual Desktop’s native scaling service that turns VMs on and off based on the number of sessions on the session hosts in the host pool.

## Scaling tool

Azure Virtual Desktop’s scaling tool uses Azure Automation and Azure Logic Apps to scale the amount of active VMs throughout the day to maximize performance. The scaling tool shuts down and deallocates session host VMs during off-peak usage hours, then turns them back on and reallocates them during peak hours.

## Scaling plan

an Azure Virtual Desktop ARM object that defines the schedules for scaling session hosts in a host pool. One scaling plan can be assigned to multiple host pools. One host pool can only have a single scaling plan associated with it.

## Schedule

a sub resource of a scaling plan that specifies the start time, capacity threshold, minimum percentage of hosts, load balancing algorithm, and other scaling configurations for the different phases of the selected day(s).

## Ramp up

the phase of a scaling plan schedule where users are starting to login and launch user sessions at the beginning of the workday. In this phase, it is expected that the number of user sessions will increase at a rapid pace. Maximum session concurrency is not expected to be reached in this phase.

## Peak

the phase of a scaling plan schedule where the maximum user session concurrency is expected to be reached. In this phase, users are expected to be steadily working. There may be new user sessions established during this time, but it will be at a slower pace than in the ramp up phase.

## Ramp down

the phase of a scaling plan schedule where users are starting to
logout of their user sessions at the end of the workday. In this phase, it is
expected that the number of user sessions will decrease at a rapid pace.

## Off peak

the phase of a scaling plan schedule where the minimum user
session concurrency is expected to be reached. In this phase, very few users are
expected to be working, but minimal resources may be kept on to accommodate
users working outside of working hours.

## Capacity threshold

the percentage of host pool capacity that is used to
determine when to trigger a scaling action. If the host pool capacity is below
the capacity threshold and VM(s) can be turned off without exceeding the
capacity threshold, those VM(s) will be turned off. If the host pool capacity
exceeds the capacity threshold, VM(s) will be turned on until the host pool
capacity is below the capacity threshold.

## Host pool capacity

the host pool’s max session limit \* the number of
available (on) session hosts in the host pool

## Used host pool capacity

the number of active and disconnected user
sessions / the host pool capacity

## Scaling action

the action Autoscale takes to turn VMs on or turn VMs off

## Minimum percentage of hosts

the lowest percentage of all session hosts in
the host pool that must be on in each phase of a scaling plan schedule.

## Active user session

the type of user session that users have when they log
in and connect to their remote app or desktop resource.

## Disconnected user session

an inactive user session that has not been
logged off. If a user has a disconnected user session, when they reconnect to
their desktop or remote app, they will be redirected to their disconnected
session on whatever session host it was on previously. At this point, the
disconnected session becomes an active session.

## Force sign-out ("logoff")

 – a mechanism to remove a user session without the user’s
consent.

## Exclusion tag

a property of a scaling plan that indicates the name of a
tag that’ll be applied to VMs you want to exclude from scaling actions.
Autoscale only performs scaling actions on VMs that don’t have a tag name
matching the scaling plan exclusion tag.

## Next steps

- For more information about the autoscale feature, see the [autoscale feature document](autoscale-scaling-plan.md).
- For more information about the scaling script, see the [scaling script document](set-up-scaling-script,md).
