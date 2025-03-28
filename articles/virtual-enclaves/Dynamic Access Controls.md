---
title: Dynamic Access Controls
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Dynamic Access Controls in Azure Virtual Enclaves

This document details how **Microsoft Entra ID** (formerly Azure Active Directory), **Personnel Portal**, and **Conditional Access capabilities** interact with Azure Virtual Enclaves (AVE) to establish secure, dynamic access controls. These integrations enable organizations to enforce zero-trust policies, govern access to sensitive enclave resources, and maintain compliance with security and regulatory requirements.

---

## Identity and Access in Azure Virtual Enclaves

### Azure Virtual Enclaves Overview
Azure Virtual Enclaves (AVE) provide isolated, zero-trust environments for hosting sensitive workloads. Enclaves are organized within **Communities**, which serve as central hubs for governance, networking, and monitoring. 

Access to AVE resources is managed through:
- **Role-Based Access Control (RBAC)** using Microsoft Entra ID.
- **Personnel Portal** for dynamic role assignments and access request management.
- **Microsoft Entra ID Private Access** for secure connections to internal resources.
- **Microsoft Entra ID Internet Access** for secure access to external, internet-facing services.
- **Conditional Access policies** that evaluate access requests and enforce risk-based decisions.

---

### 2. **Secure Access with Microsoft Entra ID Private Access**
Microsoft Entra ID Private Access secures connectivity to internal resources within AVE:
- **Zero-Trust Network Access**: Enforces identity-based policies for private resource access within an enclave.
- **Integrated with Conditional Access**: Access is granted only after verifying device compliance, user identity, and session risk.
- **Isolated Connections**: Ensures traffic to AVE resources remains isolated from public networks.

#### Example: Secure Developer Access
1. A developer requests access to a workload in an enclave via Entra ID Private Access.
2. Conditional Access evaluates the request:
   - The request originates from a compliant, managed device.
   - Multi-factor authentication (MFA) is successful.
3. The developer is granted secure, private access to the workload.

---

### 3. **Internet Access with Microsoft Entra ID Internet Access**
Microsoft Entra ID Internet Access protects and governs user access to internet-facing resources:
- **Policy Enforcement**: Enforces Conditional Access policies for internet-based AVE workloads.
- **Real-Time Monitoring**: Tracks and logs access to external services for security and compliance.
- **Granular Controls**: Restricts internet access based on user roles and resource sensitivity.

#### Example: Controlled Internet Access for Secure Workloads
1. A workload in an AVE enclave requires outbound connectivity to an external API.
2. Entra ID Internet Access validates the session and ensures compliance with policies, such as encryption and secure routing.
3. Access is monitored and logged to ensure compliance with organizational standards.

---

### 5. **Built-In Approval Workflows in AVE (Public Preview)**
AVE’s public preview introduces built-in approval workflows for access management:
- Administrators can define granular approval rules for resource access.
- Integration with Personnel Portal streamlines approval processes.
- Approved access is automatically logged in the AVE monitoring system.

#### Example: Emergency Access for Incident Response
1. A security analyst requests emergency access to investigate a breach in an enclave.
2. The request is routed to an approver defined in the AVE workflow.
3. After approval, the analyst is granted temporary access to sensitive logs and resources.

---

## Use Cases

### 1. **Research and Development in a Secure Environment**
Organizations working on confidential projects can:
- Use dynamic role assignments in Personnel Portal to grant project-specific access to researchers.
- Enforce Conditional Access policies to ensure only compliant devices are used.
- Leverage Entra ID Private Access to keep sensitive workloads isolated from public networks.

### 2. **Highly Regulated Industries**
Industries like finance or healthcare can:
- Deploy sensitive workloads in AVE to maintain strict isolation.
- Leverage PIM for temporary access to critical resources, ensuring minimal exposure.
- Use Entra ID Internet Access to monitor and control interactions with external APIs or services.

### 3. **Incident Response and Forensics**
During a security incident:
- Analysts can request temporary access to enclave logs or forensic data.
- Approval workflows ensure that only authorized personnel gain access.
- All actions are logged for compliance and post-incident review.

---

## Resources to Learn More

- [Azure Virtual Enclaves Documentation](https://learn.microsoft.com/en-us/azure/virtual-enclaves)
- [Microsoft Entra ID Overview](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis)
- [Azure Conditional Access](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview)
- [Privileged Identity Management](https://learn.microsoft.com/en-us/azure/active-directory/privileged-identity-management/pim-configure)
- [Microsoft Entra ID Private Access](https://learn.microsoft.com/en-us/azure/active-directory/entra-private-access/overview)
- [Microsoft Entra ID Internet Access](https://learn.microsoft.com/en-us/azure/active-directory/entra-internet-access/overview)
- [Azure Monitor for Logging and Diagnostics](https://learn.microsoft.com/en-us/azure/azure-monitor/overview)

---

By leveraging Microsoft Entra ID, Personnel Portal, and Conditional Access, Azure Virtual Enclaves provide a comprehensive framework for managing access to sensitive resources. These integrations ensure workloads are secured through zero-trust principles, dynamic access controls, and compliance-driven governance.
