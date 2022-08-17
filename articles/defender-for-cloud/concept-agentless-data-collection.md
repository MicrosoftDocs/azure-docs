---
title: Agentless scanning of cloud machines using Microsoft Defender for Cloud
description: Learn how Defender for Cloud can gather information about your multicloud compute resources without installing an agent on your machines.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 09/15/2022
ms.custom: template-concept
---

# Agentless scanning to collect machine

To collect, such as software inventory and vulnerability assessment, from compute resources you need access to a running operating system. Typically, you install agent and extensions inside the compute resource that can report to the external monitoring system, but agents can have challenges that come from rollout, maintenance, machine uptime, and network connectivity.

Agentless scanning lets you collect all of the information that you need from the OS without agent maintenance and without impact on machine performance. You can even gather information while a machine is shutdown.

## How does agentless scanning work?

When you enable agentless scanning, Defender for Cloud copies a snapshot of your machines to a secured environment. This snapshot contains all of the OS information that we need to create an inventory of the installed software and find vulnerabilities.

We use the same threat detection tools to evaluate the OS in the snapshot as we do for the live OS. Then, we report the results back to your Defender for Cloud console so you can see the data in one place for the agentless and agent-based machines.

## 



## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

- Learn more about how to enable agentless scanning.
- 

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->