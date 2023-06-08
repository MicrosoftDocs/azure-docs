---
title: Scan for secrets with agentless secret scanning
description: Learn how to scan your server's for secrets with Defender for Server's agentless secret scanning.
ms.topic: overview
ms.date: 06/07/2023
---

# Scan your servers for secrets with agentless secret scanning

If discovered, exposed credentials and secrets in internet-facing workloads can enable attackers to move laterally across networks and search for sensitive data and ways to damage critical information systems.

Defender for Cloud's agentless secret scanning for Virtual Machines (VM) locates plaintext secrets that exist in your environment. If secrets are detected, prioritized and actionable remediation steps will be suggested in order to minimize the risk of lateral movement, with minimal effect on your machine's performance.

Agentless secret scanning can proactively discover the following types of secrets across your environments:
- **Insecure (plaintext) SSH private keys** - Detects Putty and PKCS#8 and PKCS#1 (RSA algorithm). 
- **Plaintext AWS access keys** - CLI & plaintext on many file extensions.
- **Plaintext AWS RDS SQL connection string (SQL PAAS)** - Detects Microsoft SQL server connection string.
- **Plaintext SQL connection strings (SQL PAAS)** - Detects Microsoft SQL server connection string.  
- Plaintext storage account connection strings.  
- Plaintext storage account SAS tokens.

## Prerequisites

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- Access to [Defender for Cloud](get-started.md)

- [Enable](enable-enhanced-security.md#enable-defender-plans-to-get-the-enhanced-security-features) either or both of the following two plans: 
    - [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)
    - [Defender CSPM](concept-cloud-security-posture-management.md)

> [!NOTE]
> If both plans are not enabled, you will only have limited access to the features available from Defender for Server's agentless secret scanning capabilities. Check out [which features are available with each plan](#feature-capability).

- [Enable agentless scanning for machines](enable-vulnerability-assessment-agentless.md#enabling-agentless-scanning-for-machines).

- On Azure environments, your disks can be:
    - Unencrypted 
    - Encrypted disks must be managed using [Azure Storage encryption](../virtual-machines/disk-encryption.md) with platform-managed keys (PMK)

- On AWS environments, your disks must be unencrypted.

- Required roles and permissions:
    - **Azure** - Subscription Owner
    - **AWS** - Administrator Access

## Feature capability

Once you have enabled either or both [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features) and [Defender CSPM](concept-cloud-security-posture-management.md) you will gain access to the agentless secret scanning capabilities. However, if you only enable one of the two plans you will only gain some of the available features. The following table shows which plans enable which features:

| Plan Feature | Defender for servers plan 2 | Defender CSPM |
|--|--|--|
| [Attack path](#remediate-secrets-with-attack-path) | No | Yes |
| Cloud security explorer | No | Yes |
| Recommendations | Yes | Yes |
| Asset Inventory - Secrets | Yes | No |

## Remediate secrets with Attack path

Attack path analysis is a graph-based algorithm that scans your [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph). These scans expose exploitable paths that attackers may use to breach your environment to reach your high-impact assets. Attack path analysis exposes attack paths and suggests recommendations as to how best remediate issues that will break the attack path and prevent successful breach.

Attack path analysis takes into account the contextual information of your environment to identify issues that may compromise it. This analysis assists in prioritizing the riskiest issues for faster remediation.

The attack path page shows an overview of your attack paths, affected resources and a list of active attack paths.

### Azure VM supported attack path scenarios

Agentless secret scanning for Azure VMs supports the following attack path scenarios:

- Exposed Vulnerable VM has an insecure SSH private key that is used to authenticate to a VM. 

- Vulnerable VM has an insecure SSH private key that is used to authenticate to a VM. 

- Exposed Vulnerable VM has insecure secrets that are used to authenticate to a storage account. 

- Vulnerable VM has insecure secrets that are used to authenticate to a storage account. 

- Exposed Vulnerable VM has insecure secrets that are used to authenticate to an SQL server. 

### AWS instances supported attack path scenarios

- Agentless secret scanning for AWS instances supports the following attack path scenarios:

- Exposed Vulnerable EC2 instance has an insecure SSH private key that is used to authenticate to a EC2 instance. 

- Vulnerable EC2 instance has an insecure SSH private key that is used to authenticate to a EC2 instance. 

- Exposed Vulnerable EC2 instance has an insecure secret that are used to authenticate to a storage account. 

- Vulnerable EC2 instances have insecure secrets that are used to authenticate to a storage account. 

- Exposed Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server. 

- Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server. 

**To investigate secrets with Attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack path**.

    :::image type="content" source="media/secret-scanning/attack-path.png" alt-text="Screenshot that shows how to navigate to your attack path in Defender for Cloud.":::

1. Select the relevant attack path.

1. Follow the remediation steps to remediate the attack path.

## Remediate secrets with recommendations

If a secret is found on your resource, that resource will trigger an affiliated recommendation that is located under the Remediate vulnerabilities security control on the recommendations page. Depending on your resources, either or both of the following recommendations will appear:

- **Azure resources**: `Machines should have secrets findings resolved`

- **AWS resources**: `EC2 instances should have secret findings resolved`

**To remediate secrets from the recommendations page**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Expand the **Remediate vulnerabilities** security control.

1. Select either

    - **Azure resources**: `Machines should have secrets findings resolved`

    - **AWS resources**: `EC2 instances should have secret findings resolved`

1. Expand **Affected resources** to review the list of all resources that contain secrets.

1. In the Findings section, select a secret to view detailed information about the secret.

1. Expand **Remediation steps** and follow the listed steps.

1. Expand **Affected resources** to review the resources affected by this secret.

1. (Optional) You can select an affected resource to see that resources information.

Secrets that do not have a known attack path, are referred to as `secrets without an identified target resource`.

## Remediate secrets with cloud security explorer