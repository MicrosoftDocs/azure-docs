---
title: Platforms supported by Microsoft Defender for Cloud
description: This document provides a list of platforms supported by Microsoft Defender for Cloud.
ms.topic: overview
ms.custom: ignite-2022
ms.date: 11/09/2021
---
# Supported platforms 

This page shows the platforms and environments supported by Microsoft Defender for Cloud.

<a name="vm-server"></a>

## Combinations of environments

Microsoft Defender for Cloud supports virtual machines and servers on different types of hybrid environments:

* Only Azure
* Azure and on-premises
* Azure and other clouds
* Azure, other clouds, and on-premises

For an Azure environment activated on an Azure subscription, Microsoft Defender for Cloud will automatically discover IaaS resources that are deployed within the subscription.

## Supported operating systems

Defender for Cloud depends on the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md). Ensure your machines are running one of the supported operating systems for this agent as described on the following pages:

* [Log Analytics agent for Windows supported operating systems](../azure-monitor/agents/agents-overview.md#supported-operating-systems)
* [Log Analytics agent for Linux supported operating systems](../azure-monitor/agents/agents-overview.md#supported-operating-systems)

Also ensure your Log Analytics agent is [properly configured to send data to Defender for Cloud](working-with-log-analytics-agent.md#manual-agent)

To learn more about the specific Defender for Cloud features available on Windows and Linux, see [Feature coverage for machines](supported-machines-endpoint-solutions-clouds-containers.md).

> [!NOTE]
> Even though **Microsoft Defender for Servers** is designed to protect servers, most of its features are supported for Windows 10 machines. One feature that isn't currently supported is [Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

<a name="virtual-machine"></a>

## Managed virtual machine services

Virtual machines are also created in a customer subscription as part of some Azure-managed services as well, such as Azure Kubernetes (AKS), Azure Databricks, and more. Defender for Cloud discovers these virtual machines too, and the Log Analytics agent can be installed and configured if a supported OS is available.

<a name="cloud-services"></a>

## Cloud Services

Virtual machines that run in a cloud service are also supported. Only cloud services web and worker roles that run in production slots are monitored. To learn more about cloud services, see [Overview of Azure Cloud Services](../cloud-services/cloud-services-choose-me.md).

## Next steps

- Learn how [Defender for Cloud collects data using the Log Analytics Agent](monitoring-components.md#log-analytics-agent).
- Learn how [Defender for Cloud manages and safeguards data](data-security.md).
- Learn how to [plan and understand the design considerations to adopt Microsoft Defender for Cloud](security-center-planning-and-operations-guide.md).
