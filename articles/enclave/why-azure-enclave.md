---
title: Why Azure Enclave?
description: Learn why organizations use Azure Enclave to create secure, isolated, and governed Azure environments for sensitive workloads.
author: mitchellly-msft
ms.author: mitchellly
ms.topic: overview
ms.date: 06/26/2026
ai-usage: ai-assisted
---

# Why use Azure Enclave?

Azure Enclave helps teams deploy and manage secure Azure environments for sensitive workloads without rebuilding the same foundations each time. Azure Enclave combines managed networking, Azure Policy guardrails, logging and diagnostics, and governance controls so teams can focus on application delivery.

> [!IMPORTANT]
> Azure Enclave is currently in Preview and is provided without a service-level agreement. At this time, Azure Enclave shouldn't be used for production workloads. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. For more information, see [Azure Enclave Terms](./preview-terms.md).

## The value of Azure Enclave

Azure Enclave provides value in several ways:

- **Simplify secure workload connectivity** - Create and manage secure workloads, enclave connectivity, and controlled access to trusted endpoints, destinations, and mission partners.

- **Deploy secure environments faster** - Use platform-managed creation of secure environments, boundary isolation, enclave management, and governance controls to reduce setup time.

- **Support compliance readiness** - Use Azure Policy guardrails, logging and diagnostics, and compliance reporting to help maintain a known security posture.

- **Improve operational visibility** - Centralize or isolate logs and monitoring data so teams can review activity and monitor changes.

## Common use cases

Use Azure Enclave when you need a repeatable foundation for workloads that require isolation, governed connectivity, and shared access across trusted teams or partners.

### Sensitive research and development

Use Azure Enclave to create isolated environments for sensitive research and development projects. These environments help protect data, enforce policy controls, and support collaboration with approved internal or external partners.

### Regulated collaboration

Use Azure Enclave to bring multiple teams or organizations together in a governed environment. Communities, enclaves, endpoints, and connections help standardize how workloads communicate with trusted destinations.

### Compliance-driven workloads

Use Azure Enclave when workloads require strong isolation, controlled connectivity, auditability, and policy enforcement. Azure Enclave helps reduce the operational burden of creating governed Azure environments by providing a managed foundation for secure deployment.

## Key capabilities
Azure Enclave provides capabilities to help you quickly create and manage the secure resources you need for your critical workloads:

- **Communities** provide a central hub for networking, governance, and monitoring across one or more enclaves. For more information, see [What is a community?](./what-community.md).

- **Enclaves** provide isolated virtual networks for workloads. For more information, see [What is an enclave?](./what-enclave.md).

- **Workloads** organize customer-deployed resources within an enclave boundary. For more information, see [What is a workload?](./what-workload.md).

- **Community endpoints, enclave endpoints, and enclave connections** define and manage allowed network connectivity. For more information, see [Community endpoints](./what-community-endpoint.md), [enclave endpoints](./what-enclave-endpoint.md), and [enclave connections](./what-enclave-connection.md).

- **Policy guardrails and observability** help teams maintain governance, security, and monitoring across Azure Enclave resources.

## Next steps

To learn more about Azure Enclave, see:

- [What is Azure Enclave?](./what-azure-enclave.md)
- [Azure Enclave FAQ](./azure-enclave-faq.md)
- [Get started with Azure Enclave](./onboard.md)
- [Create a community](./create-community-portal.md)
