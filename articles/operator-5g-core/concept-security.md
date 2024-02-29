---
title: Security in Azure Operator 5G Core Preview
description: Review the security features embedded in Azure Operator 5G Core Preview
author: SarahBoris
ms.author: sboris
ms.service: azure-operator-5g-core
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 02/21/2024
---

# Security in Azure Operator 5G Core Preview

Microsoft is built on Zero Trust security, including Azure Operator 5G Core Preview. Rather than assuming that everything behind the corporate firewall is safe, Zero Trust assumes an open environment where trust must always be validated. Zero Trust is equally applied to all workload environments, both on Nexus and on Azure. 

 Zero Trust follows Azure Operator 5G Core from development through deployment and monitoring.  

## Development

Azure Operator 5G Core software development incorporates processes and tools to ensure the software is secure and hardened to vulnerability. Security during development addresses the different product dimensions of application, container/VM, orchestration, and communication in the following ways:  

- Vulnerability scanning is performed at multiple stages in the development process (source scans, build scans, image scans) with multiple ADO tools.
- Regular checkpoints are set on threat modeling, privacy, and crypto reviews.  
- Penetration testing is performed during development. 

## Deployment
Azure Operator 5G Core is deployed based on a security blueprint that ensures the solution is hardened from external and internal attacks on the network. Security during deployment provides: 

- Secure access to software repositories. 
- Least access privilege based on Role-based Access Control (RBAC) methodology. 
- Centralized Identity / Privilege Management using Microsoft Entra ID. 
- Secure transport to Azure through Express Route.  
- Encryption of traffic within the NFs and between NFs (3GPP). 
- Secure storage of data at rest. 

## Monitoring
Security monitoring of the application occurs through a combination of native alerting from the NF and Azure security applications. It includes: 

- Security Logging - Visibility for actions internal to the application. 
- Microsoft Defender – Optional protection from cyber threats and vulnerabilities. 

## Related content
- [What is Azure Operator 5G Core Preview?](overview-product.md)
- [Observability and analytics in Azure Operator 5G Core Preview](concept-observability-analytics.md)