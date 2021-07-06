---
title: Platforms supported by Azure Security Center | Microsoft Docs
description: This document provides a list of platforms supported by Azure Security Center.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
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

Security Center depends on the [Log Analytics agent](../azure-monitor/agents/agents-overview.md#log-analytics-agent). Ensure your machines are running one of the supported operating systems for this agent as described on the following pages:

* [Log Analytics agent for Windows supported operating systems](../azure-monitor/agents/agents-overview.md#supported-operating-systems)
* [Log Analytics agent for Linux supported operating systems](../azure-monitor/agents/agents-overview.md#supported-operating-systems)

Also ensure your Log Analytics agent is [properly configured to send data to Security Center](security-center-enable-data-collection.md#manual-agent)

To learn more about the specific Security Center features available on Windows and Linux, see [Feature coverage for machines](security-center-services.md).

> [!NOTE]
> Even though Azure Defender is designed to protect servers, most of the capabilities of **Azure Defender for servers** are supported for Windows 10 machines. One feature that isn't currently supported is [Security Center's integrated EDR solution: Microsoft Defender for Endpoint](security-center-wdatp.md).

## Managed virtual machine services <a name="virtual-machine"></a>

Virtual machines are also created in a customer subscription as part of some Azure-managed services as well, such as Azure Kubernetes (AKS), Azure Databricks, and more. Security Center discovers these virtual machines too, and the Log Analytics agent can be installed and configured if a supported OS is available.

## Cloud Services <a name="cloud-services"></a>

Virtual machines that run in a cloud service are also supported. Only cloud services web and worker roles that run in production slots are monitored. To learn more about cloud services, see [Overview of Azure Cloud Services](../cloud-services/cloud-services-choose-me.md).

Protection for VMs residing in Azure Stack Hub is also supported. For more information about Security Center's integration with Azure Stack Hub, see [Onboard your Azure Stack Hub virtual machines to Security Center](quickstart-onboard-machines.md?pivots=azure-portal#onboard-your-azure-stack-hub-vms). 

## Next steps

- Learn how [Security Center collects data using the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Learn how to [plan and understand the design considerations to adopt Azure Security Center](security-center-planning-and-operations-guide.md).