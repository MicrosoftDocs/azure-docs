---
title: Why use Azure Virtual Enclaves?
description: Learn why organizations use Azure Virtual Enclaves to create secure, isolated, and governed Azure environments for sensitive workloads.
author: mitchellly-msft
ms.author: mitchellly
ms.topic: overview
ms.date: 06/04/2026
ai-usage: ai-assisted
---

# Why use Azure Virtual Enclaves?

Azure Virtual Enclaves (AVE) helps organizations accelerate the deployment and management of secure, isolated, and governed Azure environments for sensitive workloads. AVE combines managed networking, policy guardrails, logging, and governance controls so teams can focus on mission and application outcomes instead of repeatedly building secure environment foundations from scratch.

> [!IMPORTANT]
> Azure Virtual Enclaves is currently in Preview and is provided without a service-level agreement. At this time, Azure Virtual Enclaves shouldn't be used for production workloads. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. For more information, see [Azure Virtual Enclaves Terms](./preview-terms.md).

## The value of AVE

Azure Virtual Enclaves provides value in several ways:

- **Simplify secure workload connectivity** - Create and manage secure workloads, enclave connectivity, and controlled access to trusted endpoints, destinations, and mission partners.

- **Deploy secure environments faster** - Use platform-managed creation of secure environments, boundary isolation, enclave management, and governance controls to reduce setup time.

- **Support compliance readiness** - Use built-in policy guardrails, managed logging, and compliance telemetry to help maintain a known security posture.

- **Improve operational visibility** - Centralize or isolate logs and monitoring data so teams can review activity and help detect configuration drift.

## Common use cases

Azure Virtual Enclaves is useful when teams need repeatable secure environments with consistent governance and isolation.

### Sensitive research and development

Use AVE to create isolated environments for sensitive research and development projects. These environments help protect data, enforce policy controls, and support collaboration with approved internal or external partners.

### Regulated collaboration

Use AVE to bring multiple teams or organizations together in a governed environment. Communities, enclaves, endpoints, and connections help standardize how workloads communicate with trusted destinations.

### Compliance-driven workloads

Use AVE when workloads require strong isolation, controlled connectivity, auditability, and policy enforcement. AVE helps reduce the operational burden of creating governed Azure environments by providing a managed foundation for secure deployment.

## Key capabilities

Azure Virtual Enclaves includes capabilities that help teams create and manage secure workload environments:

- **Communities** provide a central hub for networking, governance, and monitoring across one or more enclaves. For more information, see [What is a community?](./what-community.md).

- **Enclaves** provide isolated virtual networks for workloads. For more information, see [What is an enclave?](./what-enclave.md).

- **Workloads** organize customer-deployed resources within an enclave boundary. For more information, see [What is a workload?](./what-workload.md).

- **Community endpoints, enclave endpoints, and enclave connections** define and manage allowed network connectivity. For more information, see [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md#virtual-connection-management).

- **Policy guardrails and observability** help teams maintain governance, security, and monitoring across AVE resources.

## Next steps

To learn more about Azure Virtual Enclaves, see:

- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [Azure Virtual Enclaves FAQ](./virtual-enclaves-faq.md)
- [Get started with Azure Virtual Enclaves](./onboard.md)
- [Create a community](./create-community-portal.md)
