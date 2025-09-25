---
title: Deploy an agent-based Windows Hybrid Runbook Worker in Automation
description: This article tells how to deploy an agent-based Hybrid Runbook Worker that you can use to run runbooks on Windows-based machines in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 01/01/2025
ms.topic: how-to
ms.service: azure-automation
ms.author: v-jasmineme
author: jasminemehndir
---

# Deploy an agent-based Windows Hybrid Runbook Worker in Automation

[!INCLUDE [./agent-based-user-hybrid-runbook-worker-retirement.md](./includes/agent-based-user-hybrid-runbook-worker-retirement.md)]


You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on an Azure or non-Azure machine, including servers registered with [Azure Arc-enabled servers](/azure/azure-arc/servers/overview). From the machine or server that's hosting the role, you can run runbooks directly against it and against resources in the environment to manage those local resources.

Azure Automation stores and manages runbooks and then delivers them to one or more chosen machines. For more information, see [Deploy an extension-based Windows or Linux user Hybrid Runbook Worker in Automation](./extension-based-hybrid-runbook-worker-install.md).

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/hybrid-runbook-worker.md#general).
