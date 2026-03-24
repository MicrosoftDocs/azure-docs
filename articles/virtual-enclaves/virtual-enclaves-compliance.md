---
title: Azure Virtual Enclaves Compliance Mapping
description: Review Azure Virtual Enclaves features and how they map to different compliance frameworks.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.date: 12/6/2025
---


# Azure Virtual Enclaves Security Features and Compliance Mapping

Azure Virtual Enclaves (AVE) provide an isolated, zero-trust environment designed for workloads requiring heightened security and compliance. AVE enhances security through **network isolation**, **policy guardrails**, **identity enforcement**, **continuous monitoring**, and **encryption**. These capabilities reduce the attack surface, enforce compliance controls, and provide telemetry for ongoing monitoring—critical for meeting common compliance control requirements.

## Feature: Network Isolation & Segmentation

AVE creates a dedicated network boundary using **Virtual Networks**, **Azure Firewall**, and **Private Link**, ensuring workloads are logically separated from external traffic. This prevents unauthorized access and enforces strict communication paths.

### Related NIST SP 800‑171 Controls
- **3.13.1** – Monitor and control communications at system boundaries
- **3.13.2** – Separate user functionality from system management
- **3.1.11** – Authorize remote access
- **3.1.20** – Limit external connections

**Evidence Links:**
- [Firewall overview](/azure/firewall/overview)
- [Azure Policy Initiative for NIST SP 800‑171](/azure/governance/policy/samples/nist-sp-800-171-r2)

## Feature: Identity & Access Management

AVE enforces zero-trust principles with **Microsoft Entra ID**, **Role-Based Access Control (RBAC)**, and **Privileged Identity Management (PIM)**. These capabilities ensure least privilege, strong authentication, and controlled elevation of rights.

### Related NIST SP 800‑171 Controls
- **3.1.1** – Limit system access to authorized users
- **3.1.2** – Limit access to types of transactions/functions
- **3.5.2** – Authenticate users and devices
- **3.5.8** – Non-privileged account authentication

**Evidence Links:**
- [RBAC overview](/azure/role-based-access-control/overview)
- [Azure Policy Definition: Use Managed Identity for Function Apps](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0da106f2-4ca3-48e8-bc85-c638fe6aea8f)
AVE integrates **Azure Policy** and **Guest Configuration** to enforce compliance baselines and prevent insecure configurations. These guardrails help maintain consistent security posture across enclave resources.

### Related NIST SP 800‑171 Controls
- **3.4.1** – Establish and maintain baseline configurations
- **3.4.6** – Employ least functionality
- **3.4.7** – Implement security configuration settings

**Evidence Links:**
- [Azure Policy Samples for NIST SP 800‑171](/azure/governance/policy/samples/nist-sp-800-171-r2)
- [GitHub PolicySet Definition](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/NIST_SP_800-171_R2.json)

## Feature: Continuous Monitoring & Auditing

AVE uses **Azure Monitor**, **Microsoft Defender for Cloud**, and **Microsoft Sentinel** for centralized logging, alerting, and compliance dashboards. These tools provide visibility into security events and support incident response.

### Related NIST SP 800‑171 Controls
- **3.3.1** – Create and retain audit records
- **3.3.4** – Review and alert on audit events
- **3.6.1** – Establish incident response capability
- **3.11.2** – Scan for vulnerabilities

**Evidence Links:**
- [Azure Monitor Overview](/azure/azure-monitor/overview)
- [Azure Sentinel](/azure/sentinel/)

## Feature: Encryption & Data Protection

AVE enforces **TLS/IPsec** for data in transit and **Azure Storage encryption** for data at rest, meeting cryptographic standards required for sensitive workloads.

### Related NIST SP 800‑171 Controls
- **3.13.6** – Encrypt CUI on networks
- **3.13.11** – Employ FIPS-validated cryptography
- **3.8.1** – Protect CUI on media

**Evidence Links:**
- [Azure Encryption Overview](/azure/security/fundamentals/encryption-overview)
- [Azure Policy for Security](/azure/governance/policy/overview)

## Additional Resources
- [Azure Policy Initiative for NIST SP 800‑171 Rev. 2](/azure/governance/policy/samples/nist-sp-800-171-r2)
- [GitHub PolicySet Definition](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/NIST_SP_800-171_R2.json)
