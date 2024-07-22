---
title: Reference guide for security alerts
description: This article links to the various security alerts visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Security alerts - a reference guide

This article provides links to pages listing the security alerts you may receive from Microsoft Defender for Cloud and any enabled Microsoft Defender plans. The alerts displayed in your environment depend on the resources and services you are protecting and your customized configuration.

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

This page also includes a table describing the Microsoft Defender for Cloud kill chain aligned with version 9 of the [MITRE ATT&CK matrix](https://attack.mitre.org/versions/v9/).

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Security alert pages by category

- [Alerts for Windows machines](alerts-windows-machines.md)
- [Alerts for Linux machines](alerts-linux-machines.md)
- [Alerts for DNS](alerts-dns.md)
- [Alerts for Azure VM extensions](alerts-azure-vm-extensions.md)
- [Alerts for Azure App Service](alerts-azure-app-service.md)
- [Alerts for containers - Kubernetes clusters](alerts-containers.md)
- [Alerts for SQL Database and Azure Synapse Analytics](alerts-sql-database-and-azure-synapse-analytics.md)
- [Alerts for open-source relational databases](alerts-open-source-relational-databases.md)
- [Alerts for Resource Manager](alerts-resource-manager.md)
- [Alerts for Azure Storage](alerts-azure-storage.md)
- [Alerts for Azure Cosmos DB](alerts-azure-cosmos-db.md)
- [Alerts for Azure network layer](alerts-azure-network-layer.md)
- [Alerts for Azure Key Vault](alerts-azure-key-vault.md)
- [Alerts for Azure DDoS Protection](alerts-azure-ddos-protection.md)
- [Alerts for Defender for APIs](alerts-defender-for-apis.md)
- [Alerts for AI workloads](alerts-ai-workloads.md)
- [Deprecated security alerts](deprecated-alerts.md)

## MITRE ATT&CK tactics

Understanding the intention of an attack can help you investigate and report the event more easily. To help with these efforts, Microsoft Defender for Cloud alerts include the MITRE tactics with many alerts.

The series of steps that describe the progression of a cyberattack from reconnaissance to data exfiltration is often referred to as a "kill chain".

Defender for Cloud's supported kill chain intents are based on [version 9 of the MITRE ATT&CK matrix](https://attack.mitre.org/versions/v9/) and described in the table below.

| Tactic                   | ATT&CK Version | Description                                                  |
| ------------------------ | -------------- | ------------------------------------------------------------ |
| **PreAttack**            |                | [PreAttack](https://attack.mitre.org/matrices/enterprise/pre/) could be either an attempt to access a certain resource regardless of a malicious intent, or a failed attempt to gain access to a target system to gather information prior to exploitation. This step is usually detected as an attempt, originating from outside the network, to scan the target system and identify an entry point. |
| **Initial Access**       | V7, V9         | Initial Access is the stage where an attacker manages to get a foothold on the attacked resource. This stage is relevant for compute hosts and resources such as user accounts, certificates etc. Threat actors will often be able to control the resource after this stage. |
| **Persistence**          | V7, V9         | Persistence is any access, action, or configuration change to a system that gives a threat actor a persistent presence on that system. Threat actors will often need to maintain access to systems through interruptions such as system restarts, loss of credentials, or other failures that would require a remote access tool to restart or provide an alternate backdoor for them to regain access. |
| **Privilege Escalation** | V7, V9         | Privilege escalation is the result of actions that allow an adversary to obtain a higher level of permissions on a system or network. Certain tools or actions require a higher level of privilege to work and are likely necessary at many points throughout an operation. User accounts with permissions to access specific systems or perform specific functions necessary for adversaries to achieve their objective might also be considered an escalation of privilege. |
| **Defense Evasion**      | V7, V9         | Defense evasion consists of techniques an adversary might use to evade detection or avoid other defenses. Sometimes these actions are the same as (or variations of) techniques in other categories that have the added benefit of subverting a particular defense or mitigation. |
| **Credential Access**    | V7, V9         | Credential access represents techniques resulting in access to or control over system, domain, or service credentials that are used within an enterprise environment. Adversaries will likely attempt to obtain legitimate credentials from users or administrator accounts (local system administrator or domain users with administrator access) to use within the network. With sufficient access within a network, an adversary can create accounts for later use within the environment. |
| **Discovery**            | V7, V9         | Discovery consists of techniques that allow the adversary to gain knowledge about the system and internal network. When adversaries gain access to a new system, they must orient themselves to what they now have control of and what benefits operating from that system give to their current objective or overall goals during the intrusion. The operating system provides many native tools that aid in this post-compromise information-gathering phase. |
| **LateralMovement**      | V7, V9         | Lateral movement consists of techniques that enable an adversary to access and control remote systems on a network and could, but does not necessarily, include execution of tools on remote systems. The lateral movement techniques could allow an adversary to gather information from a system without needing more tools, such as a remote access tool. An adversary can use lateral movement for many purposes, including remote Execution of tools, pivoting to more systems, access to specific information or files, access to more credentials, or to cause an effect. |
| **Execution**            | V7, V9         | The execution tactic represents techniques that result in execution of adversary-controlled code on a local or remote system. This tactic is often used in conjunction with lateral movement to expand access to remote systems on a network. |
| **Collection**           | V7, V9         | Collection consists of techniques used to identify and gather information, such as sensitive files, from a target network prior to exfiltration. This category also covers locations on a system or network where the adversary might look for information to exfiltrate. |
| **Command and Control**  | V7, V9         | The command and control tactic represents how adversaries communicate with systems under their control within a target network. |
| **Exfiltration**         | V7, V9         | Exfiltration refers to techniques and attributes that result or aid in the adversary removing files and information from a target network. This category also covers locations on a system or network where the adversary might look for information to exfiltrate. |
| **Impact**               | V7, V9         | Impact events primarily try to directly reduce the availability or integrity of a system, service, or network; including manipulation of data to impact a business or operational process. This would often refer to techniques such as ransomware, defacement, data manipulation, and others. |

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
