---
title: Deploy an agent-based Linux Hybrid Runbook Worker in Automation
description: This article tells how to install an agent-based  Hybrid Runbook Worker to run runbooks on Linux-based machines in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.custom: linux-related-content
ms.date: 04/07/2025
ms.topic: how-to
ms.service: azure-automation
---

# Deploy an agent-based Linux Hybrid Runbook Worker in Automation

[!INCLUDE [./agent-based-user-hybrid-runbook-worker-retirement.md](./includes/agent-based-user-hybrid-runbook-worker-retirement.md)]

You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the Azure or non-Azure machine, including servers registered with [Azure Arc-enabled servers](/azure/azure-arc/servers/overview). From the machine or server that's hosting the role, you can run runbooks directly it and against resources in the environment to manage those local resources.

For the Linux Hybrid Runbook Worker see [Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Automation](./extension-based-hybrid-runbook-worker-install.md)

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

## Prerequisites

Before you start, make sure that you've done the following.

### Network configuration

For networking requirements for the Hybrid Runbook Worker, see [Configuring your network](automation-hybrid-runbook-worker.md#network-planning).

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues - Linux](troubleshoot/hybrid-runbook-worker.md).
