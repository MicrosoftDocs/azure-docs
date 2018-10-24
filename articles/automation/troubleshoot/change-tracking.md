---
title: Troubleshooting issues with Azure Change Tracking
description: This article provides information on troubleshooting Change Tracking
services: automation
ms.service: automation
ms.component: change-tracking
author: georgewallace
ms.author: gwallace
ms.date: 10/24/2018
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Change Tracking

## General

### <a name="records-not-showing"></a>Scenario: Change Tracking records are not showing in the Azure Portal

#### Issue

You do not see any Inventory or Change Tracking results for machines that are onboarded for Change Tracking.

#### Cause

This error can be caused by the following reasons:

1. The **Microsoft Monitoring Agent** is not running
2. Communication back to the Automation Account is being blocked.
3. The VM being onboarded may have come from a cloned machine that wasn't sysprepped with the Microsoft Monitoring Agent installed.

#### Resolution

1. Visit, [Network planning](../automation-hybrid-runbook-worker.md#network-planning) to learn about which addresses and ports need to be allowed for Update Management to work.
2. If using a cloned image, sysprep the image first and install the MMA agent after the fact.