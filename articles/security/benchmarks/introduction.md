---
title: Azure Security Benchmark Introduction
description: Security Benchmark introduction
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure security benchmark introduction

New services and features are released daily in Azure, developers are rapidly publishing new cloud applications built on these services, and attackers are always seeking new ways to exploit misconfigured resources. The cloud moves fast, developers move fast, and attackers are always on the move. How do you keep up and make sure that your cloud deployments are secure? How are security practices for cloud systems different from on-premises systems? How do you monitor for consistency across many independent development teams?

Microsoft has found that using *security benchmarks* can help you quickly secure cloud deployments. Benchmark recommendations from your cloud service provider give you a starting point for selecting specific security configuration settings in your environment and allow you to quickly reduce risk to your organization.

The Azure Security Benchmark includes a collection of high-impact security recommendations you can use to help secure the services you use in Azure:

- **Security controls**: These recommendations are generally applicable across your Azure tenant and Azure services. Each recommendation identifies a list of stakeholders that are typically involved in planning, approval, or implementation of the benchmark. 
- **Service baselines**: These apply the controls to individual Azure services to provide recommendations on that service’s security configuration.

## Implement the Azure Security Benchmark
- **Plan** your Azure Security Benchmark implementation by reviewing the [documentation](overview.md) for the enterprise controls and service-specific baselines to plan your control framework and how it maps to guidance like CIS (Controls v7.1) and NIST (SP 800-53) framework.
- **Monitor** your compliance with Azure Security Benchmark status (and other control sets) using the Azure Security Center [regulatory compliance dashboard](../../security-center/security-center-compliance-dashboard.md).
- **Establish guardrails** to automate secure configurations and enforce compliance with Azure Security Benchmark (and other requirements in your organization) with Azure Blueprints and Azure Policy.
 
Note that the Azure Security Benchmark v2 is aligned with [Microsoft Security Best Practices](/security/compass/microsoft-security-compass-introduction) (formerly Azure Security Compass) so that the Azure Security Benchmark provides a single consolidated view of Microsoft’s Azure security recommendations.

## Common Use Cases

Azure Security Benchmark is frequently used to address these common challenges for customers or service partners who are:
- New to Azure and are looking for security best practices to ensure a secure deployment.
- Improving security posture of existing Azure deployments to prioritize top risks and mitigations.
- Approving Azure services for use by technology and business use to meet specific security guidelines.
- Meeting regulatory requirements for customers who are from government or highly-regulated industries like finance and healthcare (or service vendors who need to build systems for these customers). These customers need to ensure their configuration of Azure meets the security capabilities specified in an industry framework such as CIS, NIST, or PCI. Azure Security Benchmark provides an efficient approach with the controls already pre-mapped to these industry benchmarks.

## Terminology

The terms "control", "benchmark", and "baseline" are used often in the Azure Security Benchmark documentation and it's important to understand how Azure uses those terms.


| Term | Description | Example |
|--|--|--|
| Control | A control is a high-level description of a feature or activity that needs to be addressed and is not specific to a technology or implementation. | Data Protection is one of the security controls. This control contains specific actions that must be addressed to help ensure data is protected. |
| Benchmark | A benchmark contains security recommendations for a specific technology, such as Azure. The recommendations are categorized by the control to which they belong. | The Azure Security Benchmark comprises the security recommendations specific to the Azure platform |
| Baseline | A baseline is the implementation of the benchmark on the individual Azure service. Each organization decides benchmark recommendation and corresponding configurations are needed in the Azure implementation scope. | The Contoso company looks to enabling Azure SQL security features by following the configuration recommended in Azure SQL security baseline.

We welcome your feedback on the Azure Security Benchmark! We encourage you to provide comments in the feedback area below. If you prefer to share your input more privately with the Azure Security Benchmark team, you are welcome to fill out the form at https://aka.ms/AzSecBenchmark
