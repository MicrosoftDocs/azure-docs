---
title: Microsoft Entra Permissions Management glossary
description: Microsoft Entra Permissions Management glossary
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: conceptual
ms.date: 06/16/2023
ms.author: jfields
---

# The Microsoft Entra Permissions Management glossary

This glossary provides a list of some of the commonly used cloud terms in Microsoft Entra Permissions Management. These terms help Permissions Management users navigate through cloud-specific terms and cloud-generic terms.

## Commonly used acronyms and terms

| Term                  | Definition                                          |
|-----------------------|-----------------------------------------------------|
| ACL                  | Access control list. A list of files or resources that contain information about which users or groups have permission to access those resources or modify those files.    |
| ARN                  | Azure Resource Notification    |
| Authorization System                   | CIEM supports AWS accounts, Azure Subscriptions, GCP projects as the Authorization systems     |
| Authorization System Type                  | Any system which provides the authorizations by assigning the permissions to the identities, resources. CIEM supports AWS, Azure, GCP as the Authorization System Types     |
| Cloud security        | A form of cybersecurity that protects data stored online on cloud computing platforms from theft, leakage, and deletion. Includes firewalls, penetration testing, obfuscation, tokenization, virtual private networks (VPN), and avoiding public internet connections.     |
| Cloud storage         | A service model in which data is maintained, managed, and backed up remotely. Available to users over a network.                |
| CIAM                 | Cloud Infrastructure Access Management     |
| CIEM                 | Cloud Infrastructure Entitlement Management. The next generation of solutions for enforcing least privilege in the cloud. It addresses cloud-native security challenges of managing identity access management in cloud environments.      |
| CIS                  | Cloud infrastructure security      |
| CWP                  | Cloud Workload Protection. A workload-centric security solution that targets the unique protection requirements of workloads in modern enterprise environments. |
| CNAPP                | Cloud-Native Application Protection. The convergence of cloud security posture management (CSPM), cloud workload protection (CWP), cloud infrastructure entitlement management (CIEM), and cloud applications security broker (CASB). An integrated security approach that covers the entire lifecycle of cloud-native applications. |
| CSPM                 | Cloud Security Posture Management. Addresses risks of compliance violations and misconfigurations in enterprise cloud environments. Also focuses on the resource level to identify deviations from best practice security settings for cloud governance and compliance.      |
| CWPP                  | Cloud Workload Protection Platform    |
| Data Collector | Virtual entity which stores the data collection configuration |
| Delete task          | A high-risk task that allows users to permanently delete a resource.     |
| ED | Enterprise directory |
| Entitlement          | An abstract attribute that represents different forms of user permissions in a range of infrastructure systems and business applications.|
| Entitlement management     | Technology that grants, resolves, enforces, revokes, and administers fine-grained access entitlements (that is, authorizations, privileges, access rights, permissions and rules). Its purpose is to execute IT access policies to structured/unstructured data, devices, and services. It can be delivered by different technologies, and is often different across platforms, applications, network components, and devices. |
| High-risk task       | A task in which a user can cause data leakage, service disruption, or service degradation.     |
| Hybrid cloud          | Sometimes called a cloud hybrid. A computing environment that combines an on-premises data center (a private cloud) with a public cloud. It allows data and applications to be shared between them.                |
| hybrid cloud storage    | A private or public cloud used to store an organization's data.    |
| ICM                     | Incident Case Management                     |
| IDS                    | Intrusion Detection Service                    |
| Identity analytics    | Includes basic monitoring and remediation, dormant and orphan account detection and removal, and privileged account discovery. |
| Identity lifecycle management | Maintain digital identities, their relationships with the organization, and their attributes during the entire process from creation to eventual archiving, using one or more identity life cycle patterns. |
| IGA                   | Identity governance and administration. Technology solutions that conduct identity management and access governance operations. IGA includes the tools, technologies, reports, and compliance activities required for identity lifecycle management. It includes every operation from account creation and termination to user provisioning, access certification, and enterprise password management. It looks at automated workflow and data from authoritative sources capabilities, self-service user provisioning, IT governance, and password management. |
| ITSM                     | Information Technology Security Management. Tools that enable IT operations organizations (infrastructure and operations managers), to better support the production environment. Facilitate the tasks and workflows associated with the management and delivery of quality IT services.      |
| JEP | Just Enough Permissions |
| JIT                    | Just in Time access can be seen as a way to enforce the principle of least privilege to ensure users and non-human identities are given the minimum level of privileges. It also ensures that privileged activities are conducted in accordance with an organization's Identity Access Management (IAM), IT Service Management (ITSM), and Privileged Access Management (PAM) policies, with its entitlements and workflows. JIT access strategy enables organizations to maintain a full audit trail of privileged activities so they can easily identify who or what gained access to which systems, what they did at what time, and for how long.     |
| Least privilege        | Ensures that users only gain access to the specific tools they need to complete a task.  |
| Multi-tenant            | A single instance of the software and its supporting infrastructure serves multiple customers. Each customer shares the software application and also shares a single database.                    |
| OIDC                    | OpenID Connect. An authentication protocol that verifies user identity when a user is trying to access a protected HTTPS end point. OIDC is an evolutionary development of ideas implemented earlier in OAuth. |
| PAM                   | Privileged access management. Tools that offer one or more of these features: discover, manage, and govern privileged accounts on multiple systems and applications; control access to privileged accounts, including shared and emergency access; randomize, manage, and vault credentials (password, keys, etc.) for administrative, service, and application accounts; single sign-on (SSO) for privileged access to prevent credentials from being revealed; control, filter, and orchestrate privileged commands, actions, and tasks; manage and broker credentials to applications, services, and devices to avoid exposure; and monitor, record, audit, and analyze privileged access, sessions, and actions. |
| PASM                  | Privileged accounts are protected by vaulting their credentials. Access to those accounts is then brokered for human users, services, and applications. Privileged session management (PSM) functions establish sessions with possible credential injection and full session recording. Passwords and other credentials for privileged accounts are actively managed and changed at definable intervals or upon the occurrence of specific events. PASM solutions may also provide application-to-application password management (AAPM) and zero-install remote privileged access features for IT staff and third parties that don't require a VPN.  |
| PEDM                  | Specific privileges are granted on the managed system by host-based agents to logged-in users. PEDM tools provide host-based command control (filtering); application allow, deny, and isolate controls; and/or privilege elevation. The latter is in the form of allowing particular commands to be run with a higher level of privileges. PEDM tools execute on the actual operating system at the kernel or process level. Command control through protocol filtering is explicitly excluded from this definition because the point of control is less reliable. PEDM tools may also provide file integrity monitoring features. |
| Permission            | Rights and privileges. Details given by users or network administrators that define access rights to files on a network. Access controls attached to a resource dictating which identities can access it and how. Privileges are attached to identities and are the ability to perform certain actions. An identity having the ability to perform an action on a resource.              |
| POD                    | Permission on Demand. A type of JIT access that allows the temporary elevation of permissions, enabling identities to access resources on a by-request, timed basis.      |
| Permissions creep index (PCI)    | A number from 0 to 100 that represents the incurred risk of users with access to high-risk privileges. PCI is a function of users who have access to high-risk privileges but aren't actively using them.    |
| Policy and role management | Maintain rules that govern automatic assignment and removal of access rights. Provides visibility of access rights for selection in access requests, approval processes, dependencies, and incompatibilities between access rights, and more. Roles are a common vehicle for policy management. |
| Privilege             | The authority to make changes to a network or computer. Both people and accounts can have privileges, and both can have different levels of privilege.        |
| Privileged account    | A login credential to a server, firewall, or other administrative account. Often referred to as admin accounts. Comprised of the actual username and password; these two things together make up the account. A privileged account is allowed to do more things than a normal account. |
| Public Cloud            | Computing services offered by third-party providers over the public Internet, making them available to anyone who wants to use or purchase them. They may be free or sold on-demand, allowing customers to pay only per usage for the CPU cycles, storage, or bandwidth they consume.                |
| Resource              | Any entity that uses compute capabilities can be accessed by users and services to perform actions. |
| Role                    | An IAM identity that has specific permissions. Instead of being uniquely associated with one person, a role is intended to be assumable by anyone who needs it. A role doesn't have standard long-term credentials such as a password or access keys associated with.                  |
| SCIM                    | System for Cross–domain Identity Management |
| SIEM                    | Security Information and Event Management. Technology that supports threat detection, compliance and security incident management through the collection and analysis (both near real time and historical) of security events, as well as a wide variety of other event and contextual data sources. The core capabilities are a broad scope of log event collection and management, the ability to analyze log events and other data across disparate sources, and operational capabilities (such as incident management, dashboards, and reporting).      |
| SOAR                  | Security orchestration, automation and response (SOAR). Technologies that enable organizations to take inputs from various sources (mostly from security information and event management [SIEM] systems) and apply workflows aligned to processes and procedures. These workflows can be orchestrated via integrations with other technologies and automated to achieve the desired outcome and greater visibility. Other capabilities include case and incident management features; the ability to manage threat intelligence, dashboards and reporting; and analytics that can be applied across various functions. SOAR tools significantly enhance security operations activities like threat detection and response by providing machine-powered assistance to human analysts to improve the efficiency and consistency of people and processes.    |
| Super user / Super identity     | A powerful account used by IT system administrators that can be used to make configurations to a system or application, add or remove users, or delete data.  |
| Tenant                | A dedicated instance of the services and organization data stored within a specific default location.                  |
| UUID                    | Universally unique identifier. A 128-bit label used for information in computer systems. The term globally unique identifier (GUID) is also used.|
| Zero trust security    | The three foundational principles: explicit verification, breach assumption, and least privileged access.|
| ZTNA                   | Zero trust network access. A product or service that creates an identity- and context-based, logical access boundary around an application or set of applications. The applications are hidden from discovery, and access is restricted via a trust broker to a set of named entities. The broker verifies the identity, context and policy adherence of the specified participants before allowing access and prohibits lateral movement elsewhere in the network. It removes application assets from public visibility and significantly reduces the surface area for attack.|

## Next steps

- For an overview of Permissions Management, see [What's Microsoft Entra Permissions Management?](overview.md).
