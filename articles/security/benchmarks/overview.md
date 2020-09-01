---
title: Overview of the Azure Security Benchmark
description: Security Benchmark overview
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Overview of the Azure Security Benchmark

The Azure Security Benchmark contains recommendations that help you improve the security of your applications and data on Azure. 

This benchmark focuses on cloud-centric control areas. These controls are consistent with well-known security benchmarks, such as those described by the Center for Internet Security (CIS) Controls Version 7.1 and NIST SP800-53.

The following controls are included in the Azure Security Benchmark:

- **Network security (NS)**: Network security focuses on the recommended common security controls to secure and protect Azure networks. This includes securing virtual network, establishing private connection, preventing and mitigating external attacks, securing DNS, and logging and monitoring Azure network traffic.  

- **[Identity Management (IM)](security-benchmark-v2-identity-access-control.md)**: Identity management focuses on the recommended security controls to establish a secure identity management practice using Azure Active Directory. This includes the use of managed identities (and service principles) for applications, sign sign-on, strong authentications, conditional access, and account anomalies monitoring.  

- **Privileged Access (PA)**: Privileged access focuses on the recommended security controls to manage the privileged access in Azure. This includes limiting privileged roles and accounts, emergency access setup, periodic review and reconciliation of user access, and use of specialized access workstation for privileged tasks.  

- **[Data Protection (DP)](security-benchmark-v2-data-protection.md)**: Data protection focuses on the recommended security controls to discover, label and classify sensitive data assets, using access control, encryption, and audit logging for data protection during its use, storage, and transit in Azure. 

- **Asset Management (AM)**:  Asset Management focuses on the recommended security controls to actively managing (inventory, track, and correct) all Azure resources so that only authorized resources are given access, and unauthorized and unmanaged resources are identified and removed. 

- **Logging and Threat Detection (LT)**: Logging and threat detection focuses on the recommended practices related to enabling, collecting, and storing audit logs for Azure services. This includes the use of Azure services’ native threat detection capability or use Azure Monitor, and Azure Sentinel to build a custom threat detection capability using logs collected from different sources.  

- **Posture and Vulnerability Management (PV)**: Posture and Vulnerability Management focus on the recommended practices in managing Azure security posture related to vulnerability and security configuration management. This includes the vulnerability scanning, penetration testing and remediation, as well as the security configuration tracking, reporting, correction in Azure resources.

- **Endpoint Security (ES)**: Endpoint security focuses on the recommended controls in endpoint detection and response. This includes   automation of malware defense, threat monitoring and analysis in endpoint environment.

- **Backup and Recovery (BR)**: Backup and recovery focuses on the recommended common controls to ensure data and configurations backup at the different service tiers are performed, validated and protected.

- **Incident Response (IR)**: Incident response focuses on activities related to the preparation, detection and analysis, containment and post incident activities in the incident response life cycle. This includes using different services such as Azure Security Center and Sentinel to automate the process.  

- **Governance and Strategy (GS)**: Governance and strategy summarizes the common prerequisite and process level controls at the enterprise level before adopting the technical security controls in Azure. This includes establishing role and responsibilities responsible for the different cloud security functions, policy and procedures required to execute process-oriented controls, and education and awareness for personnel security in an organization.  

You can also download the Azure Security Benchmark v2 excel in spreadsheet format.  

Azure Security Benchmark v1 excel spreadsheet is also available for the previous ASB version.  

## Azure Security Benchmark Recommendations

Each recommendation includes the following information:

- **Azure ID**: The Azure Security Benchmark ID that corresponds to the recommendation. 

- **CIS ID(s)**: The CIS Controls v7.1 control(s) that correspond to this recommendation. 

- **NIST ID(s)**: The NIST 800-53 rev.4 (moderate) security control(s) that correspond to this recommendation 

- **Details**: The rationale for the recommendation and links to guidance on how to implement it. If the recommendation is supported by Azure Security Center, that information will also be listed.

- **Responsibility**: Whether the customer or the service-provider (or both) is (are) responsible for implementing this recommendation. Security responsibilities are shared in the public cloud. Some security controls are only available to the cloud service provider and therefore the provider is responsible for addressing those. These are general observations – for some individual services, the responsibility will be different than what is listed in the Azure Security Benchmark. Those differences are described in the baseline recommendations for the individual service. 

- **Customer Security stakeholders**: The security functions at the customer organization who may be accountable, responsible, or consulted for the respective control. It may be different from organization to organization depending on your company’s security organization structure, and the role and responsibility setup for the Azure security.  

Note: The control mappings between ASB and industry benchmarks (such as NIST and CIST) only indicate a specific Azure feature(s) can be used to fully or partially address a control requirement defined in the NIST or CIST. You should be aware that such implementation does not translate to the full compliance of a control in the corresponding control in CIS or NIST. 

We welcome your detailed feedback and active participation in the Azure Security Benchmark effort. if you would like to provide the Azure Security Benchmark team direct input, please fill out the form at https://aka.ms/AzSecBenchmark 

## Next Steps

- See the first security control: [network security](security-control-network-security.md)
- Read the [Azure Security Benchmark introduction](introduction.md)
- Download the [Azure Security Benchmark v1 excel spreadsheet](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/spreadsheets)
