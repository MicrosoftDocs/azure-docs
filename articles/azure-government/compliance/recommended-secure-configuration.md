---
title: FedRAMP Rev5 Recommended Secure Configuration
description: Azure Response to FedRAMP Rev5 Recommended Secure Configuration
author:      amohad 
ms.author:   atmoha
ms.service: azure-government
ms.topic: article
ms.date:     02/06/2026
---

# Secure Configuration Guide

FedRAMP Rev 5 has mandated the following Secure Configuration Guide requirements for all Cloud Service Providers at [Secure Configuration Guide](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/).

Azure provides the instructions and guidelines for the customers to meet these requirements. Customers are responsible for ensuring that their services are configured appropriately to meet these requirements.

## Recommended secure configuration

This section includes a copy of the [Recommended Secure Configuration](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#recommended-secure-configuration) from the Secure Configuration Guide and the recommendation and instructions for Azure.

### SCG-CSO-RSC 

Providers must create, maintain, and make available recommendations to securely configure their cloud services (this Secure Configuration Guide), which includes at least the following information:

- Required: Instructions on how to securely access, configure, operate, and decommission top-level administrative accounts that control enterprise access to the entire cloud service offering.
- Required: Explanations of security-related settings that can be operated only by top-level administrative accounts and their security implications.
- Recommended: Explanations of security-related settings that can be operated only by privileged accounts and their security implications.

>[!Note]
>- These requirements and recommendations refer to this guidance as a Secure Configuration Guide but cloud service providers may make this guidance available in various appropriate forms that provide the best customer experience.
>
>- This guidance should explain how top-level administrative accounts are named and referred to in the cloud service offering.

### Azure response with recommendation and instructions

Azure supports all the requirements outlined in SCG-CSO-RSC above and the following details.

Azure defines the following top-level administrative accounts.

|     Category                  |     Account   Type                     |     Why   It’s Top‑Level                                           |
|-------------------------------|----------------------------------------|--------------------------------------------------------------------|
|     Tenant‑wide               |     Global Administrator (Microsoft Entra ID)    |     Full identity and directory control                            |
|                               |     Privileged Role Administrator      |     Can assign all privileged roles, including Global Administrator        |
|                               |     Emergency Access Accounts          |     Break‑glass, unrestricted access for outages                   |
|     Enterprise Agreement    |     Enterprise Administrator           |     Controls all Azure accounts and billing under the Enterprise Agreement           |
|                               |     Account Owner                      |     Creates subscriptions; controls subscription‑level admins    |
|     Subscription‑level        |     Service Administrator              |     Full management permissions on each subscription               |


**SCG-CSO-RSC Requirement:** Instructions about how to securely access, configure, operate, and decommission top-level administrative accounts that control enterprise access to the entire cloud service offering. 

Azure publishes authoritative guidance for top-level admin roles via Microsoft Learn (Microsoft Entra documentation), including privileged role definitions, emergency access ("break-glass") account guidance, and FedRAMP High identity access controls. For more information, see [RBAC and Directory Admin Roles](/azure/role-based-access-control/rbac-and-directory-admin-roles).

Microsoft Learn documents the built‑in administrative roles that are authorized to change tenant‑wide security settings, including:

- Global Administrator
- Security Administrator
- Conditional Access Administrator
- Privileged Role Administrator

These roles have the ability to alter authentication requirements, disable protections, and grant or revoke privileged access, making their governance critical.

Azure provides guidance to help customers protect administrator sign-in, enforce MFA, conditional access, and protected admin workstations which detail how to securely access top-level administrative accounts in Azure. For more information, see [Privileged roles and permissions](/entra/identity/role-based-access-control/privileged-roles-permissions).

Azure defines critical roles (Global/Privileged Role Admin), separation of duties, least‑privilege configuration and provides guidance to manage emergency access admin accounts in Entra ID – Guidance on creating and managing highly privileged break-glass global admin accounts (for emergency scenarios) to securely configure top-level administrative accounts with instructions to implement at [Microsoft cloud security benchmark – Privileged access](/security/benchmark/azure/mcsb-privileged-access) and [Azure identity & access security best practices](/azure/security/fundamentals/identity-management-best-practices).

Azure provides operational guardrails for privileged sessions, access reviews, activation workflows, and monitoring to securely operate top-level administrative accounts as well as lifecycle guidance to remove stale assignments and revoke credentials with least standing privilege to securely decommission (retire) top‑level administrative accounts.

Azure documents the impact of enabling MFA, PIM eligibility, conditional access, and session controls for admins to explain security-related settings for top-level administrative accounts.

Azure uses Risk‑based rationale for restricting privileged roles and avoiding persistent elevation to explain security implications of privileged account configuration choices. 

Instructions to implement the above are explained at [Secure access practices for administrators (Entra ID)](/entra/identity/role-based-access-control/security-planning) and [Microsoft cloud security benchmark – Privileged access](/security/benchmark/azure/mcsb-privileged-access)


SCG-CSO-RSC Requirement: Explanations of security-related settings that can be operated only by top-level administrative accounts and their security implications.

SCG-CSO-RSC Recommendation: Explanations of security-related settings that can be operated only by privileged accounts and their security implications.

Microsoft Learn publicly documents tenant‑wide identity and access security settings that are **operated only by top‑level administrative roles** (for example, Global Administrator, Privileged Role Administrator, Conditional Access Administrator). It is important for customers to ensure appropriate configuration as these settings have direct and significant security implications because they control how privileged accounts authenticate, how legacy attack paths are blocked, and how identity risk is mitigated across the tenant. The security settings are described below.

#### 1. Security defaults (tenant‑wide secure‑by‑default controls)

Security Defaults are Microsoft‑recommended tenant‑wide protections that enforce a baseline identity security posture. These controls are **enabled, disabled, and governed by top‑level administrative roles**.

Security Defaults enforce:

- Multifactor authentication (MFA) for administrators
- MFA registration for all users
- Blocking of legacy authentication protocols
- Protection of privileged access to administrative portals

**Microsoft Learn:** [Security defaults in Microsoft Entra ID](/entra/fundamentals/security-defaults)

#### 2. Blocking legacy authentication (tenant‑wide risk reduction)

Legacy authentication protocols (for example, IMAP, POP, SMTP AUTH) do not support modern protections such as MFA and are a primary entry point for account compromise. Microsoft documents blocking legacy authentication as a **critical tenant‑wide security control**.

Only privileged administrators can enforce blocking of legacy authentication through Security Defaults or Conditional Access policies.

Microsoft Learn documents that these controls significantly reduce common identity attacks such as password spray and phishing.

**Microsoft Learn:** [Security defaults in Microsoft Entra ID](/entra/fundamentals/security-defaults)

#### 3. Conditional Access (tenant‑wide policy enforcement engine)

Conditional Access is Microsoft’s primary tenant‑wide policy engine for enforcing:

- MFA for privileged roles
- Risk‑based access controls
- Blocking insecure authentication paths
- Enforcement of Zero Trust principles

Conditional Access policies can only be created and modified by **privileged administrative roles**, and misconfiguration or absence of these policies materially increases identity compromise risk.

**Microsoft Learn:** [Plan a Microsoft Entra multifactor authentication deployment](/entra/identity/authentication/howto-mfa-getstarted)

#### 4. Emergency access ("break‑glass") accounts

Microsoft documents emergency access accounts as highly privileged accounts designed for tenant recovery when normal administrative access is unavailable. These accounts:

- Are configured only by top‑level administrators
- Bypass certain tenant‑wide controls by design
- Require strict monitoring and governance due to elevated risk

**Microsoft Learn:**  [Manage emergency access accounts in Microsoft Entra ID](/entra/identity/role-based-access-control/security-emergency-access)

#### 5. Identity Protection (Tenant‑Wide Risk Policies)

Microsoft Entra ID Protection provides tenant‑wide risk detection and enforcement for:

- Risky users
- Risky sign‑ins
- Automated remediation actions

Privileged administrators configure these policies, which directly protect high‑value and administrative accounts from compromise.

**Microsoft Learn:** [Microsoft Entra ID Protection overview](/entra/id-protection/overview-identity-protection)

More detailed instructions to securely access, configure, operate, and decommission top-level administrative accounts that control enterprise access to the entire cloud service offering are explained the below Microsoft Learn Links

- [Top Level – Microsoft Entra Documentation](/entra/)
- [What is Microsoft Entra Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure)
- [Start using Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-getting-started)
- [Plan a Privileged Identity Management deployment](/entra/id-governance/privileged-identity-management/pim-deployment-plan)
- [Securing Privileged Access](/security/privileged-access-workstations/overview)
- [Configure identity access controls to meet FedRAMP High Impact level](/entra/standards/fedramp-access-controls)
- [More specific guidance on configuring top-level accounts](/entra/identity/role-based-access-control/privileged-roles-permissions)
- [Azure RBAC documentation](/azure/role-based-access-control/best-practices)
- [Emergency Accounts - Manage emergency access accounts in Microsoft Entra ID](/entra/identity/role-based-access-control/security-emergency-access)
- [Conditional Access Overview](/entra/identity/conditional-access/overview)

[Back to the top](#secure-configuration-guide)

## Use instructions

This section includes a copy of the [Use Instructions](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#use-instructions) from the Secure Configuration Guide and a response for Azure.

### SCG-CSO-AUP

Providers must include instructions in the FedRAMP authorization package that explain how to obtain and use the Secure Configuration Guide.

>[!Note] 
>These instructions may appear in a variety of ways; it's up to the provider to do so in the most appropriate and effective ways for their specific customer needs.

### Azure response

Azure supports SCG-CSO-AUP by including Azure's response to the Secure Configuration Guide usage in the FedRAMP authorization packages. Customers can request Azure's FedRAMP authorization package at [Federal Compliance Documentation](/azure/azure-government/compliance/azure-services-in-fedramp-auditscope#federal-compliance-documentation)

[Back to the top](#secure-configuration-guide)

## Public guidance

This section includes a copy of the [Public Guidance](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#public-guidance) from the Secure Configuration Guide and a response for Azure.

### SCG-CSO-PUB

Providers should make the Secure Configuration Guide available publicly.

### Azure response

This article is the Azure Secure Configuration Guide and it is available publicly.

[Back to the top](#secure-configuration-guide)

## Secure defaults

This section includes a copy of the [Secure Defaults](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#secure-defaults) from the Secure Configuration Guide and a response for Azure.

### SCG-CSO-SDF

Providers should set all settings to their recommended secure defaults for top-level administrative accounts and privileged accounts when initially provisioned.

### Azure response

Azure supports SCG-CSO-SDF and applies secure defaults for top-level administrative accounts and privileged accounts at provisioning via policy initiatives, security baselines, and baseline-as-code applied through automation. Azure sets security‑hardened defaults the moment a tenant, subscription, or administrative role is created.

When the tenant is first provisioned Azure enforces the below ensuring newly created admin or high‑privilege accounts never start in a weak or misconfigured state.

- **Privileged Identity Management (PIM)** eligibility, not permanent assignment
- **Multi‑Factor Authentication (MFA)** required for all privileged accounts
- **Conditional Access** controls (device requirements, session controls)
- Configure two break-glass accounts with restricted usage and continuous monitoring
- Alignment to **Azure Policy** + **Defender for Cloud** FedRAMP initiatives

These are Microsoft’s recommended secure defaults for newly created admin or high privilege accounts.

When identities, subscriptions, or resources are created, **Security defaults** + **Conditional Access** give a hardened starting posture; **Azure Policy** applies baseline guardrails at MG/sub scopes so new assets inherit secure defaults automatically.

**Microsoft Learn:** 

- [Security defaults](/entra/fundamentals/security-defaults) 
- [Conditional Access Overview](/entra/identity/conditional-access/overview) 
- [Azure RBAC Overview](/azure/role-based-access-control/overview)
- [Plan CA deployment](/entra/identity/conditional-access/plan-conditional-access) 
- [What is Azure Policy?](/azure/governance/policy/overview) 

[Back to the top](#secure-configuration-guide)

## Enhanced capabilities

The next sections are copied from the [Enhanced Capabilities](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#enhanced-capabilities) in the Secure Configuration Guide and they include a response for Azure.

These recommendations apply to all cloud service offerings in the FedRAMP Marketplace for enhanced capabilities related to the Secure Configuration Guide.

### Comparison capability

This section includes a copy of the [Comparison Capability](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#comparison-capability) from the Secure Configuration Guide and a response for Azure.

#### SCG-ENH-CMP

Providers SHOULD offer the capability to compare all current settings for top-level administrative accounts and privileged accounts to the recommended secure defaults.

#### Azure response

Azure supports SCG-ENH-CMP through built‑in security baseline comparison capabilities across **Microsoft Entra ID** top-level and privileged accounts and tenant‑level security settings.

Azure provides multiple mechanisms that allow customers to compare the current configuration of top-level and privileged identities against Microsoft’s published secure‑by‑default baseline. Azure provides built‑in comparison tools—Secure Score, Microsoft Entra ID Protection, Privileged Identity Management (PIM), Access Reviews, and Defender for Cloud—that continuously evaluate the configuration of all top-level and privileged accounts against Microsoft’s published secure-by-default identity baselines. These services surface deviations, provide gap analyses, and supply prescriptive remediation guidance, allowing customers to easily compare current settings to recommended secure defaults at any time.

#### How Azure fulfills comparison capability

##### 1. Microsoft Entra ID Protection Baseline

- Microsoft publishes secure configuration baselines for identity.
- Microsoft Entra compares current tenant settings—including MFA enforcement, risky sign‑in detection, password protection, and conditional access posture—to Microsoft's recommended defaults.
- Deviations surface as alerts or "unmet recommendations".

**Microsoft Learn:**
  
- [Entra ID Protection documentation hub](/entra/id-protection/)
- [Overview — What is Microsoft Entra ID Protection?](/entra/id-protection/overview-identity-protection)
- [Investigate Risk (Risky users, Risky sign](/entra/id-protection/howto-identity-protection-investigate-risk)[‑](/entra/id-protection/howto-identity-protection-investigate-risk)[ins)](/entra/id-protection/howto-identity-protection-investigate-risk)
- [Risk Detection Types](/entra/id-protection/concept-identity-protection-risks)
  
##### 2. Microsoft Secure Score

Secure Score automatically evaluates:

- Privileged roles assigned
- MFA status for all privileged accounts
- Conditional Access configurations for admins
- Standing vs. Just‑in‑Time privilege (Privileged Identity Management)

Each control includes:

- Recommended default configuration
- Current configuration
- Gap analysis
- Remediation guidance
  
This compares *all current settings* against recommended defaults.  

**Microsoft Learn:** [Microsoft Entra Identity Secure Score](/entra/identity/monitoring-health/concept-identity-secure-score)

##### 3. Microsoft Entra ID Access Reviews

- Reviews can be conducted specifically on:

  - **Global Administrators**
  - **Privileged Role Administrators**
  - **Any highly privileged custom role**
  
- Review results show:

  - Who currently has access
  - Whether access conforms to least privilege and Azure’s recommended defaults
  - Whether administrators maintain unnecessary standing rights
  
**Microsoft Learn:**
    
- [What are Access Reviews?](/entra/id-governance/access-reviews-overview)
- [Manage access with Access Reviews](/entra/id-governance/manage-access-review)
    
##### 4. Privileged Identity Management (PIM) policy comparison

PIM provides a built‑in control comparison:

- Shows whether default protections (approval, MFA-on-activation, time-bound privilege) are enabled.
- Highlights discrepancies between your configuration and Microsoft’s baseline.

**Microsoft Learn:**
  
- [Privileged Identity Management documentation (Microsoft Entra)](/entra/id-governance/privileged-identity-management/pim-how-to-change-default-settings)
- [PIM configuration (What PIM does, how to configure)](/entra/id-governance/privileged-identity-management/pim-configure)
  
##### 5. Baseline comparison by using Defender for Cloud

For hybrid and cloud resources:

- Identity and entitlement management controls map to secure defaults.
- Defender for Cloud surfaces misconfigurations and recommends compliant baseline settings. Azure employs built‑in security baseline comparison capabilities across Microsoft Entra ID privileged accounts and tenant‑level security settings.

**Microsoft Learn:** [Manage security posture with Microsoft Defender for Cloud (official Learn module)](/training/modules/microsoft-defender-cloud-security-posture/)
  
[Back to the top](#secure-configuration-guide)

### Export capability

This section includes a copy of the [Export Capability](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#export-capability) from the Secure Configuration Guide and a response for Azure.

#### SCG-ENH-EXP

Providers should offer the capability to export all security settings in a machine-readable format.

#### Azure response

Azure supports SCG-ENH-EXP requirement through **multiple machine‑readable export paths** by offering **full security configuration export**, all providing **structured JSON** across:

- Identity
- RBAC
- Conditional Access
- PIM
- Access Reviews
- Policy & Compliance
- Defender Secure Score
- Resource configurations
- IaC representations

This enables complete, verifiable evidence trails for:

- Audit
- Compliance
- Drift detection
- Automation pipelines
- Regulatory mapping

The next sections cover different ways to export security settings in machine-readable format.

##### 1. Azure policy — machine‑readable configuration & compliance export

Azure Policy supports exporting:

- Policy Assignments
- Policy Definitions
- Compliance State
- Drift Results
- Export formats: **JSON (REST API, Azure CLI, ARM/Bicep)**

**Microsoft Learn:**

- [Azure Policy overview](/azure/governance/policy/overview)
- [How to get compliance data](/azure/governance/policy/how-to/get-compliance-data)

##### 2. Azure RBAC — role assignments & privileged access (JSON export)

Exportable by using Azure CLI or Microsoft Graph:

- Role assignments
- Principal identities (users, groups, service principals)
- Standing vs. privileged roles (Owner, UAA, etc.)

**Microsoft Learn:** [Role Assignments list](/azure/role-based-access-control/role-assignments-list-cli)

##### 3. Microsoft Entra ID — Identity Security Configuration Export

All identity configurations can be exported in **JSON** by using Microsoft Graph:

- Conditional Access policies
- Authentication strength and MFA settings
- Identity Protection policies
- PIM settings
- Access Reviews configuration

**Microsoft Learn:**

- **Microsoft Entra ID Protection Documentation** [Microsoft Entra ID Protection documentation](/entra/id-protection/) 
- **What is Microsoft Entra ID Protection?** [Overview: Microsoft Entra ID Protection](/entra/id-protection/overview-identity-protection) 
- **Risk Investigation** [Investigate risk with Microsoft Entra ID Protection](/entra/id-protection/howto-identity-protection-investigate-risk) 
- **Risk Detection Types** [Identity Protection risk detections](/entra/id-protection/concept-identity-protection-risks) 

##### 4. Privileged Identity Management (PIM) — machine‑readable role & policy export

PIM exports By using Microsoft Graph (JSON):

- Eligible versus active roles
- Activation history
- MFA and approval requirements
- Privileged Access policies

**Microsoft Learn:**

- [PIM documentation](/entra/id-governance/privileged-identity-management/) 
- [Configure PIM](/entra/id-governance/privileged-identity-management/pim-configure) 

##### 5. Access Reviews — JSON export for Privileged Access Governance

Exportable:

- Review definitions
- Reviewers
- Review decisions
- Remediation actions

**Microsoft Learn:**

- [Access Reviews Overview](/entra/id-governance/access-reviews-overview) 
- [Manage Access Reviews](/entra/id-governance/manage-access-review) 

##### 6. Microsoft Defender for Cloud — posture, recommendations & Secure Score export

Exportable:

- Secure Score
- Resource configurations
- Identity posture
- Regulatory compliance mappings
- Security assessment objects

**Microsoft Learn:** [Manage security posture with Defender for Cloud](/training/modules/microsoft-defender-cloud-security-posture/) 

##### 7. Azure Resource Graph (ARG) — full environment export (JSON)

Export complete resource state:

- Network security group (NSG) rules
- Key Vault access policies
- Storage account configs
- Diagnostic settings
- Any resource’s full properties (ARM schema)

ARG supports export from KQL to JSON.

**Microsoft Learn:** [Azure Resource Graph documentation](/azure/governance/resource-graph/)

##### 8. Infrastructure‑as‑Code (IaC) — full machine‑readable export

Azure supports exporting all deployed resources into:

- ARM Templates (JSON)
- Bicep (JSON‑transpiled)
- Terraform state (JSON)

These provide **100% environment configuration** in machine‑readable form.

**Microsoft Learn:** [ARM template documentation](/azure/azure-resource-manager/templates/)

[Back to the top](#secure-configuration-guide)

### API capability

This section includes a copy of the [API Capability](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#api-capability) from the Secure Configuration Guide and a response for Azure.

#### SCG-ENH-API

Providers should offer the capability to view and adjust security settings via an API or similar capability.

#### Azure response

Azure supports SCG-ENH-API by exposing *all major security configurations* through documented and secure APIs (ARM, Microsoft Graph, Azure Policy, Defender for Cloud APIs, and Azure Resource Graph) that allow organizations to:

- Programmatically **view** all security settings
- Programmatically **modify/enforce** security settings
- Automate governance, remediation, and compliance workflows
- Export full configuration state for audit evidence
- Integrate with Continuous Integration/Continuous Deployment (CI/CD), Security Orchestration, Automation, and Response (SOAR), Security Information and Event Management (SIEM), and Compliance pipelines

The combination of **ARM**, **Microsoft Graph**, **Azure Policy**, **RBAC APIs**, **Defender for Cloud APIs**, and **Azure Resource Graph** ensures **complete transparency, adjustability, and automation** of all security posture components.

The next sections cover each method available to customers.

##### 1. Azure Resource Manager (ARM) — Security Configuration API

Azure Resource Manager (ARM) exposes **every Azure resource’s configuration** (including security settings) by using REST API. This allows programmatic **view** (`GET`) and **adjust** (`PUT/PATCH`) operations for:

- Network Security Group (NSG) rules
- Key Vault access policies
- Storage encryption settings
- Diagnostic settings
- Azure Policy assignments

**Microsoft Learn:** [Azure Resource Manager](/rest/api/resources/)

##### 2. Microsoft Graph API — identity & access security settings

Microsoft Graph exposes the *entire identity security plane*, enabling automation to view/adjust:

- Conditional Access policies
- Authentication strength and MFA policies
- Identity Protection risk policies, risky users, risky sign‑ins
- Privileged Identity Management (PIM) settings
- Access Review definitions, decisions, and remediation actions

**Microsoft Learn:** [Authorization and the Microsoft Graph Security API](/graph/security-authorization)

##### 3. Azure Policy API — Secure defaults, baselines, compliance

Programmatically enforce and adjust secure settings using Policy APIs:

- Assign / unassign policy definitions
- Enforce secure baselines
- Evaluate compliance state
- Detect drift
- Export compliance state (JSON)

**Microsoft Learn:** [Azure Policy documentation](/azure/governance/policy/)

##### 4. Azure RBAC — view & adjust role assignments (JSON export)

Azure exposes all RBAC assignments and allows programmatic adjustments by using Azure CLI (JSON export).

**Microsoft Learn:** [List Azure role assignments using Azure CLI](/azure/role-based-access-control/role-assignments-list-cli)

##### 5. Microsoft Defender for Cloud APIs — Secure Score & recommendations

View and adjust cloud security posture By using APIs:

- Secure Score export
- Recommendations retrieval
- Regulatory compliance mapping
- Automated remediation

**Microsoft Learn:**

- [Manage security posture with Microsoft Defender for Cloud](/training/modules/microsoft-defender-cloud-security-posture/)
- [Interactive security posture guide (Cloud Security Posture UX)](https://thinkcloudly.com/blog/azure/defender-for-cloud-implementation-guide/)

##### 6. Azure Resource Graph — full security inventory (JSON export)

ARG enables querying and exporting:

- RBAC assignments
- NSG exposure
- Encryption settings
- Diagnostic settings
- Identity configurations
- Compliance posture

**Microsoft Learn:** [Azure Resource Graph documentation](/azure/governance/resource-graph/)

##### 7. Integration With CI/CD, SOAR, SIEM & Compliance pipelines (Expanded)

##### Continuous Integration / Continuous Deployment (CI/CD)

Azure’s APIs integrate with:

- GitHub Actions
- Azure DevOps
- GitLab CI

Enables pipelines to:

- Pull security configuration
- Validate RBAC & policy compliance before deployment
- Enforce secure defaults using IaC

##### Security Orchestration Automation & Response (SOAR)

Using Microsoft Sentinel & Defender XDR automation:

- Pull risk events via Graph
- Trigger remediation workflows
- Auto‑adjust Conditional Access / RBAC
- Update policies on drift

##### Security Information & Event Management (SIEM)

Microsoft Sentinel, Splunk, QRadar can ingest:

- RBAC assignment exports
- Identity Protection alerts
- Defender for Cloud posture data

Enables:

- Real‑time misconfiguration detection
- Compliance verification
- Long‑term audit logging

##### Compliance and GRC pipelines

Supports automated:

- Export of configuration evidence
- Comparison with NIST 800‑53, FedRAMP, CIS, ISO 27001
- Drift detection
- Auditor‑ready JSON bundles

[Back to the top](#secure-configuration-guide)

### Machine-readable guidance

This section includes a copy of the [Machine-Readable Guidance](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#machine-readable-guidance) from the Secure Configuration Guide and a response for Azure.

#### SCG-ENH-MRG

Providers should also provide the Secure Configuration Guide in a machine-readable format that can be used by customers or third-party tools to compare against current settings.

#### Azure response

Azure supports SCG-ENH-MRG by providing customers Secure Configuration Guide through multiple Microsoft‑documented APIs and export mechanisms that deliver *JSON‑structured secure configuration data* across identity, RBAC, policy, and security‑posture layers.

The next sections cover the various channels that Azure provides this machine-readable data in.

##### 1. Microsoft Defender for Cloud — secure configuration baselines (machine‑readable JSON)

Azure Defender for Cloud provides:

- Secure Score recommendations (JSON)
- Configuration assessments (JSON)
- Regulatory compliance mappings (JSON)
- Security control baseline definitions (JSON)

These can be exported programmatically and used by comparison tools.

**Microsoft Learn:** 

- [Manage security posture by using Microsoft Defender for Cloud](https://m365corner.com/m365-glossary/privileged-identity-management.html) 
- [Interactive Cloud Security Posture Guide (Cloud Security UX)](https://thinkcloudly.com/blog/azure/defender-for-cloud-implementation-guide/)

##### 2. Azure Policy — secure baseline definitions (JSON)

Azure Policy provides the backbone for Azure secure configuration guides:

- Built‑in secure baseline initiatives (such as Azure Security Benchmark)
- Machine‑readable policy definitions (JSON)
- Machine‑readable compliance state (JSON)
- Drift detection exports

Third‑party engines can run diff/comparison logic on exported JSON.

**Microsoft Learn:** [Azure Policy overview](/azure/governance/policy/overview)

##### 3. Microsoft Entra ID  — identity security baselines (JSON by using Microsoft Graph)

Microsoft Graph exposes **identity security configuration** in machine‑readable JSON:

- Conditional Access policies
- Authentication strength and MFA settings
- Identity Protection risk policies
- Privileged Identity Management (PIM) settings
- Access Reviews definitions

**Microsoft Learn:**

- [Top Level – Microsoft Entra Documentation](/entra/)
- [What is Microsoft Entra ID Protection?](/entra/id-protection/overview-identity-protection)

##### 4. Azure RBAC — Role Assignments (JSON Export)

Azure supports complete JSON export of RBAC access configuration via Azure CLI, Microsoft Graph, or Resource Graph.

- JSON listing of **role assignments**
- JSON mapping of **principals > scopes > roles**
- Used by identity governance and drift/comparison tools

**Microsoft Learn:** [List Azure role assignments using Azure CLI](/azure/role-based-access-control/role-assignments-list-cli)

##### 5. Azure Resource Graph — full machine‑readable security state (JSON)

ARG provides a **tenant‑wide**, machine‑readable export of:

- RBAC assignments
- NSG rules and exposure
- Encryption configuration
- Diagnostic settings
- Policy compliance
- Identity configuration
- VM and resource security metadata

All exportable as **JSON**, ideal for third‑party security baselines and configuration comparison engines.

**Microsoft Learn:** [Azure Resource Graph documentation](/azure/governance/resource-graph/)

##### 6. How third‑party tools compare against Azure machine‑readable guides

Using the machine‑readable feeds of the preceding methods, external tools can:

- Compare actual Azure config versus Secure Configuration Guide JSON
- Detect misconfigurations, drift, or non‑compliant security settings
- Generate auditor‑ready compliance evidence
- Automate remediation workflows

[Back to the top](#secure-configuration-guide)

### Versioning and release history

This section includes a copy of the [Versioning and Release History](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/#versioning-and-release-history) from the Secure Configuration Guide and a response for Azure.

#### SCG-ENH-VRH

Providers should provide versioning and a release history for recommended secure default settings for top-level administrative accounts and privileged accounts as they are adjusted over time.

#### Azure response

Azure supports SCG-ENH-VRH through:

- Versioned security baselines
- Versioned identity and privileged access protections
- Versioned PIM governance settings
- Versioned Secure Score recommendations
- Machine‑readable JSON for comparison tooling
- APIs for change tracking & automated drift detection

With clear change histories, the combination of Microsoft Entra ID Protection, PIM, Azure RBAC JSON exports, Defender for Cloud posture, and Azure Resource Graph delivers a complete versioning story for secure‑default controls.

##### 1. Azure Security Baselines — versioned & change‑tracked

Microsoft publishes **versioned Security Baselines** for Azure and Microsoft cloud services. Each baseline includes:

- Recommended secure default settings
- Version history & changes
- Deprecated controls
- Updated controls

**Microsoft Learn:** [Security Baselines](/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines)

##### 2. Microsoft Entra ID — secure defaults version evolution

Azure (Microsoft Entra ID) maintains evolving **Secure Default** protections for privileged accounts, including:

- MFA for administrators
- Blocking legacy authentication
- Privileged Identity Protection controls
- Updated secure‑by‑default identity posture

**Microsoft Learn**:

- [Demo: Explore Microsoft Entra ID built in roles](https://www.youtube.com/watch?v=QeXKv-N1zgk)
- [Microsoft Entra ID Protection documentation](/entra/id-protection/)
- [Overview of Identity Protection](/entra/id-protection/overview-identity-protection)

These pages collectively document:

- Updated secure defaults
- New risk detection types
- Changes in identity security posture
- Updated admin & privileged account protections

#### 3. Privileged Identity Management (PIM) — policy versioning

PIM provides:

- Versioned policies for privileged access
- MFA requirements
- Approval workflows
- Role activation conditions
- Expiration and justification governance

Each update in PIM documentation reflects secure‑default evolution for privileged accounts.

**Microsoft Learn:** [Privileged Identity Management (PIM) Documentation](/entra/id-governance/privileged-identity-management/)

##### 4. Microsoft Defender for Cloud — versioned secure recommendations

Defender for Cloud maintains:

- Versioned Secure Score recommendations
- Updated regulatory mappings
- Added and deprecated controls
- Evidence export capabilities
- Machine‑readable JSON recommendations

**Microsoft Learn:**

- **Defender for Cloud posture module** [Manage security posture using Microsoft Defender for Cloud](https://m365corner.com/m365-glossary/privileged-identity-management.html)
- **Interactive Cloud Security UX / Guide** [Interactive Cloud Security Posture Guide](https://thinkcloudly.com/blog/azure/defender-for-cloud-implementation-guide/)

##### 5. Machine‑readable versioned JSON for comparisons

Azure provides versioned JSON accessible through:

- [List Azure role assignments using Azure CLI](/azure/role-based-access-control/role-assignments-list-cli)
- [Quickstart: Execute a Resource Graph Query Using Azure CLI](/azure/governance/resource-graph/first-query-azurecli)

ARG enables diffs:

- RBAC changes
- Policy updates
- Diagnostic settings
- Encryption configuration
- Identity settings
- Drift from secure baselines

[Back to the top](#secure-configuration-guide)

## Related content

[Secure Configuration Guide](https://www.fedramp.gov/docs/rev5/balance/secure-configuration-guide/)
