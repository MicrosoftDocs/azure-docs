---
title: Overview Page
description: Learn how to configure and deploy customizable security baselines for continuous compliance monitoring across Azure and Arc-enabled machines using Azure Policy and Machine Configuration.
ms.date: 11/07/2025
ms.topic: conceptual
---

# Security Baselines Overview

Customizable security baselines built on Azure Policy and Machine Configuration enable organizations to assess, monitor, and continuously improve server compliance against trusted industry benchmarks.

This capability introduces *audit* baselines for both Windows and Linux, empowering customers to align security posture with internal compliance frameworks and regulatory standards. By passing custom baseline parameter input directly into Azure Policy, you can now represent organization-specific controls at scale.

These baselines deliver a cloud-native governance experience for both Azure machines and non-Azure machines connected through [Azure Arc][01]. This includes machines that run on-premises, in other public clouds, or at the edge. Together, Policy and Machine Configuration establish a unified control plane for compliance visibility. This approach enables you to assess, monitor, and enforce consistent security standards across your entire estate, regardless of location or platform. This approach reflects Microsoft's Secure by Design and Secure by Default principles. It helps ensure robust security and compliance everywhere your workloads run.

## Key Scenarios

### Baseline Customization
Create tailored baselines using the *Modify Settings* wizard under **Policy \> Machine Configuration**. Administrators can enable, exclude, or adjust rules from industry benchmarks (such as CIS Benchmarks or Microsoft baselines) to match internal standards. Each customization builds a downloadable JSON file that captures configuration intent—a reusable artifact compatible for policy-as-code workflows.

### Assign Audit Policies

Azure Policy deploys your customized baseline parameters across Azure and Arc-connected machines. When you assign an audit policy, Azure Policy:
- Evaluates configuration states against selected benchmarks
- Reports compliance in real time
- Surfaces findings across Azure Policy, Azure Resource Graph (ARG), and the Guest Assignments view

### Integration and Automation  
Integrate baselines into CI/CD pipelines or configuration management workflows. Each baseline produces a declarative settings catalog (JSON) that can be version-controlled and deployed using CLI, ARM, or Bicep templates—ensuring reproducible compliance configurations across environments.

## Supported Standards

| **Standard** | **Description** |
|----|----|
| [**Center for Internet Security (CIS) Linux Benchmarks**][09] | Official CIS Benchmarks for all [Azure endorsed Linux distributions][02] in parity with what is published on the [CIS website][03]. |
| [**Azure Compute Security Baseline for Windows**][10] | Applies customized values for Windows Server 2022 and Windows Server 2025. |
| [**Azure Compute Security Baseline for Linux**][11] | Enforces consistent security controls aligned with Azure Compute guidance. |


## Availability

All public Azure regions are supported.

> [!NOTE]
> Support for Azure Government and Sovereign Clouds is not supported for Public Preview.

## Getting Started

### Process Overview

The end-to-end experience for configuring Customizable Security Baselines follows these high-level steps:

1.  **Select a baseline** from the *Machine Configuration* blade under Azure Policy.

2.  **Modify settings**—enable, exclude, or parameterize rules to match your internal requirements.

3.  **Download the JSON file** representing your configured baseline.

4.  **Assign the baseline policy** using the Azure portal, CLI, or CI/CD integration.

5.  **Review compliance results** through Azure Policy, Azure Resource Graph, or the Guest Assignments page.

### Prerequisites

- Azure Machine Configuration prerequisite policy initiative must be deployed. The capability enables Guest Configuration policies and installs the required extension on virtual machines (VMs).

- An Azure subscription or management group containing supported Windows and Linux VMs.

- Sufficient permissions to create and assign custom policy definitions (Owner or Resource Policy Contributor roles).

## Next Steps

- [Deploy a baseline policy assignment][04]
- [Specify custom parameters for baseline policy][05]
- [Understand the baseline JSON format][06]
- [View Machine Configuration compliance reporting][07]
- [Discover and assign built-in Machine Configuration policies][08]

<!-- Link reference definitions -->
[01]: /azure/azure-arc/servers/overview
[02]: /azure/virtual-machines/linux/endorsed-distros
[03]: https://www.cisecurity.org/
[04]: ./deploy-a-baseline-policy-assignment.md
[05]: ./specify-custom-parameters-for-baseline-policy.md
[06]: ./understand-baseline-settings-parameter.md
[07]: ../view-compliance.md
[08]: ../assign-built-in-policies.md
[09]: ../../../policy/samples/guest-configuration-baseline-cis-linux.md
[10]: ../../../policy/samples/guest-configuration-baseline-windows-server-2025.md
[11]: ../../../policy/samples/guest-configuration-baseline-linux.md
