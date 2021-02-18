---
title: Overview of the Azure Security Benchmark V2
description: Azure Security Benchmark V2 overview
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 09/11/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Overview of the Azure Security Benchmark (V2)

The Azure Security Benchmark (ASB) provides prescriptive best practices and recommendations to help improve the security of workloads, data, and services on Azure.

This benchmark is part of a set of holistic security guidance that also includes:

- **Cloud Adoption Framework** – Guidance on security, including [strategy](/azure/cloud-adoption-framework/strategy/define-security-strategy), [roles and responsibilities](/azure/cloud-adoption-framework/organize/cloud-security), [Azure Top 10 Security Best Practices](/azure/cloud-adoption-framework/get-started/security#step-1-establish-essential-security-practices), and [reference implementation](/azure/cloud-adoption-framework/ready/enterprise-scale/).
- **Azure Well-Architected Framework** – Guidance on [securing your workloads](/assessments/?mode=pre-assessment&session=local) on Azure.
- **Microsoft Security Best Practices** – [recommendations](/security/compass/microsoft-security-compass-introduction) with examples on Azure.

 The Azure Security Benchmark focuses on cloud-centric control areas. These controls are consistent with well-known security benchmarks, such as those described by the Center for Internet Security (CIS) Controls Version 7.1 and National Institute of Standards and Technology (NIST) SP 800-53.
The following controls are included in the Azure Security Benchmark:

| ASB Control Domains | Description 
|--|--|
| [Network&nbsp;security&nbsp;(NS)](security-controls-v2-network-security.md) | Network Security covers controls to secure and protect Azure networks, including securing virtual networks, establishing private connections, preventing and mitigating external attacks, and securing DNS. |
| [Identity&nbsp;Management&nbsp;(IM)](security-controls-v2-identity-management.md) | Identity Management covers controls to establish a secure identity and access controls using Azure Active Directory, including the use of single sign-on, strong authentications, managed identities (and service principles) for applications, conditional access, and account anomalies monitoring. |
| [Privileged&nbsp;Access&nbsp;(PA)](security-controls-v2-privileged-access.md) | Privileged Access covers controls to protect privileged access to your Azure tenant and resources, including a range of controls to protect your administrative model, administrative accounts, and privileged access workstations against deliberate and inadvertent risk. |
| [Data&nbsp;Protection&nbsp;(DP)](security-controls-v2-data-protection.md) | Data Protection covers control of data protection at rest, in transit, and via authorized access mechanisms, including discover, classify, protect, and monitor sensitive data assets using access control, encryption, and logging in Azure. |
| [Asset&nbsp;Management&nbsp;(AM)](security-controls-v2-asset-management.md) | Asset Management covers controls to ensure security visibility and governance over Azure resources, including recommendations on permissions for security personnel, security access to asset inventory, and managing approvals for services and resources (inventory, track, and correct). |
| [Logging&nbsp;and&nbsp;Threat&nbsp;Detection (LT)](security-controls-v2-logging-threat-detection.md) | Logging and Threat Detection covers controls for detecting threats on Azure and enabling, collecting, and storing audit logs for Azure services, including enabling detection, investigation, and remediation processes with controls to generate high-quality alerts with native threat detection in Azure services; it also includes collecting logs with Azure Monitor, centralizing security analysis with Azure Sentinel, time synchronization, and log retention. |
| [Incident&nbsp;Response&nbsp;(IR)](security-controls-v2-incident-response.md) | Incident Response covers controls in incident response life cycle - preparation, detection and analysis, containment, and post-incident activities, including using Azure services such as Azure Security Center and Sentinel to automate the incident response process. |
| [Posture&nbsp;and&nbsp;Vulnerability&nbsp;Management&nbsp;(PV)](security-controls-v2-posture-vulnerability-management.md) | Posture and Vulnerability Management focuses on controls for assessing and improving Azure security posture, including vulnerability scanning, penetration testing and remediation, as well as security configuration tracking, reporting, and correction in Azure resources. |
| [Endpoint&nbsp;Security&nbsp;(ES)](security-controls-v2-endpoint-security.md) | Endpoint Security covers controls in endpoint detection and response, including use of endpoint detection and response (EDR) and anti-malware service for endpoints in Azure environments. |
| [Backup&nbsp;and&nbsp;Recovery&nbsp;(BR)](security-controls-v2-backup-recovery.md) | Backup and Recovery covers controls to ensure that data and configuration backups at the different service tiers are performed, validated, and protected. |
| [Governance&nbsp;and&nbsp;Strategy&nbsp;(GS)](security-controls-v2-governance-strategy.md) | Governance and Strategy provides guidance for ensuring a coherent security strategy and documented governance approach to guide and sustain security assurance, including establishing roles and responsibilities for the different cloud security functions, unified technical strategy, and supporting policies and standards. |

## Azure Security Benchmark Recommendations

Each recommendation includes the following information:

- **Azure ID**: The Azure Security Benchmark ID that corresponds to the recommendation.
- **CIS Controls v7.1 ID(s)**: The CIS Controls v7.1 control(s) that correspond to this recommendation.
- **NIST SP 800-53 r4 ID(s)**: The NIST SP 800-53 r4 (moderate) control(s) that correspond to this recommendation.
- **Details**: The rationale for the recommendation and links to guidance on how to implement it. If the recommendation is supported by Azure Security Center, that information will also be listed.
- **Responsibility**: Whether the customer, the service-provider, or both are responsible for implementing this recommendation. Security responsibilities are shared in the public cloud. Some security controls are only available to the cloud service provider and therefore the provider is responsible for addressing those. These are general observations – for some individual services, the responsibility will be different from what is listed in the Azure Security Benchmark. Those differences are described in the baseline recommendations for the individual service.
- **Customer Security Stakeholders**: [The security functions](/azure/cloud-adoption-framework/organize/cloud-security#security-functions) at the customer organization who may be accountable, responsible, or consulted for the respective control. It may be different from organization to organization depending on your company’s security organization structure, and the roles and responsibilities you set up related to Azure security.

> [!NOTE]
> The control mappings between ASB and industry benchmarks (such as NIST and CIS) only indicate that a specific Azure feature can be used to fully or partially address a control requirement defined in NIST or CIS. You should be aware that such implementation does not necessarily translate to the full compliance of the corresponding control in CIS or NIST.

We welcome your detailed feedback and active participation in the Azure Security Benchmark effort. If you would like to provide the Azure Security Benchmark team direct input, fill out the form at https://aka.ms/AzSecBenchmark

## Download

You can download the Azure Security Benchmark in [spreadsheet format](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Security%20Benchmark).

## Next steps 
- See the first security control: [Network security](security-control-network-security.md)
- Read the [Azure Security Benchmark introduction](introduction.md)
- Learn the [Azure Security Fundamentals](../fundamentals/index.yml)