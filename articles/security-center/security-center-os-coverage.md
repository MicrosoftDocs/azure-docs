---
title: Platforms supported by Azure Security Center | Microsoft Docs
description: This document provides a list of platforms supported by Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 70c076ef-3ad4-4000-a0c1-0ac0c9796ff1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/31/2020
ms.author: memildin
---
# Supported platforms 

This page shows the platforms and environments supported by Azure Security Center.

## Combinations of environments <a name="vm-server"></a>

Azure Security Center supports virtual machines and servers on different types of hybrid environments:

* Only Azure
* Azure and on-premises
* Azure and other clouds
* Azure, other clouds, and on-premises

For an Azure environment activated on an Azure subscription, Azure Security Center will automatically discover IaaS resources that are deployed within the subscription.

## Supported operating systems

Security Center depends on the [Log Analytics Agent](../azure-monitor/platform/agents-overview.md#log-analytics-agent). Ensure your machines are running one of the supported operating systems for this agent as described on the following pages:

* [Log Analytics agent for Windows supported operating systems](../azure-monitor/platform/log-analytics-agent.md#supported-windows-operating-systems)
* [Log Analytics agent for Linux supported operating systems](../azure-monitor/platform/log-analytics-agent.md#supported-linux-operating-systems)

Also ensure your Log Analytics agent is [properly configured to send data to Security Center](security-center-enable-data-collection.md#manual-agent)

> [!TIP]
> To learn more about the specific Security Center features available on Windows and Linux, see [Feature coverage for machines](security-center-services.md).

## Managed virtual machine services <a name="virtual-machine"></a>

Virtual machines are also created in a customer subscription as part of some Azure-managed services as well, such as Azure Kubernetes (AKS), Azure Databricks, and more. Security Center discovers these virtual machines too, and the Log Analytics agent can be installed and configured if a supported OS is available.

## Cloud Services <a name="cloud-services"></a>

Virtual machines that run in a cloud service are also supported. Only cloud services web and worker roles that run in production slots are monitored. To learn more about cloud services, see [Overview of Azure Cloud Services](../cloud-services/cloud-services-choose-me.md).

Protection for VMs residing in Azure Stack is also supported. For more information about Security Center's integration with Azure Stack, see [Onboard your Azure Stack virtual machines to Security Center](https://docs.microsoft.com/azure/security-center/quick-onboard-azure-stack).

## Next steps

- Learn how [Security Center collects data using the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Learn how to [plan and understand the design considerations to adopt Azure Security Center](security-center-planning-and-operations-guide.md).