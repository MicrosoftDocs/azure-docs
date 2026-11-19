---
title: Get started with configuration validation
titleSuffix: Azure Workload Center for Oracle
description: Learn how to open the configuration validation results for an Oracle workload in Azure Workload Center for Oracle.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Get started with configuration validation

In this article, you learn how to open the configuration validation results for an Oracle workload. For more information about how checks, templates, and deviations work, see [Configuration validation](configuration-validation.md).

## Prerequisites

- Enroll the Oracle system as a *Workload Virtual Instance (WVI)*.

- The managed identity of the WVI has **Reader** on the resources of the system.

- For operating system checks, the identity has **Virtual Machine Contributor** or the Run Command read and write permissions on the virtual machines (VMs). For details, see [Permissions and prerequisites](get-started-prerequisites-permissions.md).

## Access configuration validation from the portal

1.  In the Azure portal, go to **Azure Workload Center for Oracle**.

2.  On the **Overview** page, the **Configuration checks** card has **View results** and **View drifts**. **View results** opens the check results for all WVIs. **View drifts** opens the agent.

3.  To see the results of one system, select **Workload Virtual Instances**, select the WVI, and then go to **Workload validation**.
