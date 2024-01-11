---
title: Security in AO5GC
description: Review the security features embedded in AO5GC
author: HollyCl
ms.author: HollyCl
ms.service: operator-5g-core
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 01/08/2024
---

# Security in Azure Operator 5G Core
Microsoft is built on Zero Trust Security – including AO5GC. Instead of assuming everything behind the corporate firewall is safe, Zero Trust assumes an open environment where trust must always be validated. Zero Trust is equally applied to all workload environment – Nexus and Azure.

Zero Trust follows AO5GC from Development -> Deployment -> Monitoring. 

## Development
AO5GC software development incorporates both process and tools to ensure the software is secure, hardened to vulnerability, is always security current. Security addresses the different product dimensions of application, container/VM, orchestration, and communication.
   
- Vulnerability scanning is performed at multiple stages in the development process (source scans, build scans, image scans) with multiple ADO tools. 
- Regular checkpoints on threat modeling, privacy, and crypto reviews 
- Pen Testing

## Deployment
- AO5GC is deployed based on a security blueprint that ensures the solution is hardened from external and internal attacks on the network.
- Secure access to software repository
- Least access privilege / Role based Access Control methodology.
- Centralized Identify / Privilege Management via Microsoft Entra ID.
- Secure transport to Azure through Express Route 
- Encryption of traffic within the NFs – and between NFs (3GPP)
- Secure Storage of Data at Rest

## Monitoring
Security monitoring of the application is through a combination of native alerting from the NF and Azure security applications.

- Security Logging. Visibility to actions internal to the application.
- Microsoft Defender. Protect the solution from cyber threats and vulnerabilities.
- Microsoft Sentinel. Tools to holistically view the network for attack detection, threat visibility, proactive hunting, and threat response.

## Related content
-[Build a 5G Core network](concept-build-5g-core-network.md)
