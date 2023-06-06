---
title: Scan for secrets with agentless secret scanning
description: Learn how to scan your server's for secrets with Defender for Server's agentless secret scanning.
ms.topic: overview
ms.date: 06/06/2023
---

# Scan your servers for secrets with agentless secret scanning

If discovered, exposed credentials and secrets in internet-facing workloads can enable attackers to move laterally across networks and search for sensitive data and ways to damage critical information systems.

Defender for Cloud's agentless secret scanning for Virtual Machines (VM) locates plaintext secrets that exist in your environment. If secrets are detected, prioritized and actionable remediation steps will be suggested in order to minimize the risk of lateral movement, with minimal effect on your machine's performance.

Agentless secret scanning can proactively discover the following types of secrets across your environments:
- Insecure (plaintext) SSH private keys 
- Plaintext AWS access keys
- Plaintext AWS RDS SQL connection string
- Plaintext SQL connection strings
- Plaintext storage account connection strings.  
- Plaintext storage account SAS tokens.

## Prerequisites

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- Access to [Defender for Cloud](get-started.md)

- [Enable](enable-enhanced-security.md#enable-defender-plans-to-get-the-enhanced-security-features) either or both of the following two plans: 
    - [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)
    - [Defender CSPM]concept-cloud-security-posture-management

> [NOTE!]
> If both plans are not enabled, you will only have limited access to the features available from Defender for Server's agentless secret scanning capabilities. Check out which features are available with each plan. INSERT THE LINK HERE.

- [Enable agentless scanning for machines](enable-vulnerability-assessment-agentless.md#enabling-agentless-scanning-for-machines).

- On Azure environments, your disks can be:
    - Unencrypted 
    - Encrypted disks must be managed using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK)

- On AWS environments, your disks must be unencrypted.

- Required roles and permissions:
    - **Azure** - Subscription Owner
    - **AWS** - Administrator Access
