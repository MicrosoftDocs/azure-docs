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

A scaling plan is an Azure Virtual Desktop Azure Resource Manager object that defines the schedules for scaling session hosts in a host pool. You can assign one scaling plan to multiple host pools. Each host pool can only have one scaling plan assigned to it.

## Schedule

Schedules are sub-resources of scaling plans that specify start time, capacity threshold, minimum percentage of hosts, the load-balancing algorithm, and other configuration settings for the different phases of the day.

## Ramp up

The ramp-up phase of a scaling plan schedule is usually at the beginning of the work day, when users start to sign in and start their sessions. In this phase, the number of active user sessions should increase at a rapid pace, but not reach the maximum number of active sessions yet.

## Peak

The phase of the schedule where your deployment reaches the maximum number of active sessions it can handle. In this phase, the number of active sessions are expected to hold steady until the peak ends. New active user sessions can be established during this phase, but at a slower rate than the ramp-up phase.

## Ramp down

The ramp-down phase of the scaling plan schedule is at the end of hte work day, when users start to sign out and end their sessions for the evening. In this phase, we expect the number of active user sessions to decrease rapidly.

## Off peak

The off-peak phase of the scaling plan schedule is when the deployment reaches the minimum number of active user sessions for the day. During this phase, we don't expect many users to be active, but you may want to keep a small amount of resources on hand to accomodate users who work outside typical working hours.

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
