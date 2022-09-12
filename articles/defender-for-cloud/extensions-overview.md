---
title: Overview of the extensions that collect data from your workloads
description: Learn about the extensions that collect data from your workloads to let you protect your workloads with Microsoft Defender for Cloud.
author: bmansheim
ms.author: benmansheim
ms.topic: conceptual
ms.date: 09/12/2022
---

# How does Defender for Cloud collect data?

Defender for Cloud collects data from your Azure virtual machines (VMs), virtual machine scale sets, IaaS containers, and non-Azure (including on-premises) machines to monitor for security vulnerabilities and threats. 

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat protection. Data collection is only needed for compute resources such as VMs, virtual machine scale sets, IaaS containers, and non-Azure computers. 

You can benefit from Microsoft Defender for Cloud even if you don’t provision agents. However, you'll have limited security and the capabilities listed above aren't supported.  

Data is collected using:

- The **Log Analytics agent**, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, and logged in user.
- **Security extensions**, such as the [Azure Policy Add-on for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md), which can also provide data to Defender for Cloud regarding specialized resource types.

## Why use Defender for Cloud to deploy monitoring extensions?

The security of your workloads depends on the data that the monitoring extensions collects. The extensions ensure security coverage for all supported resources.

To save you the process of manually installing the extensions, such as [the manual installation of the Log Analytics agent](extensions-log-analytics-agent.md#manual-agent-provisioning), Defender for Cloud reduces management overhead by installing all required extensions on existing and new machines. 

## How do monitoring extensions work?

Defender for Cloud assigns the appropriate **Deploy if not exists** policy to the workloads in the subscription. This policy type ensures the extension is provisioned on all existing and future resources of that type.

> [!TIP]
> Learn more about Azure Policy effects including **Deploy if not exists** in [Understand Azure Policy effects](../governance/policy/concepts/effects.md).

## Next steps

Learn more about the monitoring extensions:

- [Azure Monitor Agent](extensions-azure-monitor-agent.md)
- [Log Analytics agent](extensions-log-analytics-agent.md)
- [Microsoft Defender for Endpoint](extensions-defender-for-endpoint.md)
- [Vulnerability assessment](extensions-vulnerability-assessment.md)
- [Defender for Containers](extensions-defender-for-containers.md)
- [Guest Configuration](extensions-guest-configuration.md)