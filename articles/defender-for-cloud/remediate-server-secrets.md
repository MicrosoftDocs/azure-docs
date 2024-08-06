---
title: Remediate VM secrets security issues in Microsoft Defender for Cloud
description: Learn how to remediate VM secrets security issues in Microsoft Defender for Cloud.
ms.topic: overview
ms.date: 04/16/2024
---


# Remediate VM secrets issues

Microsoft Defender for Cloud provides secrets scanning for virtual machines (VMs), and for cloud deployments, to reduce lateral movement risk.

This article helps you to identify and remediate security risks with VM secrets.

## Prerequisites

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- [Defender for Cloud](get-started.md) must be available in your Azure subscription.

- At least one of these plans [must be enabled](enable-enhanced-security.md#enable-defender-plans-to-get-the-enhanced-security-features):
  - [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md)
  - [Defender CSPM](concept-cloud-security-posture-management.md)

- [Agentless machine scanning](enable-vulnerability-assessment-agentless.md#enabling-agentless-scanning-for-machines) must be enabled. Learn more about [agentless scanning](concept-agentless-data-collection.md#availability).

## Remediate secrets with attack paths

Attack path analysis is a graph-based algorithm that scans your [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph) to expose exploitable paths that attackers might use to reach high-impact assets. Defender for Cloud provides several attack paths scenarios for VM secrets.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack path**.

    :::image type="content" source="media/secret-scanning/attack-path.png" alt-text="Screenshot that shows how to navigate to your attack path in Defender for Cloud." lightbox="media/secret-scanning/attack-path.png":::

1. Select the relevant attack path.

1. Follow the remediation steps to remediate the attack path.

## Remediate secrets with recommendations

If a secret is found on your resource, that resource triggers an affiliated recommendation that is located under the Remediate vulnerabilities security control on the Recommendations page. Defender for Cloud provides a [number of VM secrets security recommendations](secrets-scanning-servers.md#security-recommendations).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Expand the **Remediate vulnerabilities** security control.

1. Select one of the [relevant recommendations](secrets-scanning-servers.md#security-recommendations).

    - **Azure resources**: `Machines should have secrets findings resolved`
    - **AWS resources**: `EC2 instances should have secrets findings resolved`
    - **GCP resources**: `VM instances should have secrets findings resolved`

        :::image type="content" source="media/secret-scanning/recommendation-findings.png" alt-text="Screenshot that shows either of the two results under the Remediate vulnerabilities security control." lightbox="media/secret-scanning/recommendation-findings.png":::

1. Expand **Affected resources** to review the list of all resources that contain secrets.

1. In the Findings section, select a secret to view detailed information about the secret.

    :::image type="content" source="media/secret-scanning/select-findings.png" alt-text="Screenshot that shows the detailed information of a secret after you selected the secret in the findings section." lightbox="media/secret-scanning/select-findings.png":::

1. Expand **Remediation steps** and follow the listed steps.

1. Expand **Affected resources** to review the resources affected by this secret.

1. (Optional) You can select an affected resource to see the resource's information.

Secrets that don't have a known attack path are referred to as `secrets without an identified target resource`.

## Remediate secrets with cloud security explorer

The [cloud security explorer](concept-attack-path.md#what-is-cloud-security-explorer) enables you to proactively identify potential security risks within your cloud environment. It does so by querying the [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph), which is the context engine of Defender for Cloud. Cloud security explorer provides a [number of query templates](secrets-scanning-servers.md#) for investigating VM secrets issues.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select one of the following templates:

    - **VM with plaintext secret that can authenticate to another VM** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access other VMs or EC2s.
    - **VM with plaintext secret that can authenticate to a storage account** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access storage accounts.
    - **VM with plaintext secret that can authenticate to an SQL database** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access SQL databases.

If you don't want to use any of the available templates, you can also [build your own query](how-to-manage-cloud-security-explorer.md) in the cloud security explorer.

## Remediate secrets in the asset inventory

Your [asset inventory](asset-inventory.md) shows the [security posture](concept-cloud-security-posture-management.md) of the resources you connected to Defender for Cloud. You can view the secrets discovered on a specific machine.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Inventory**.

1. Select the relevant VM.

1. Go to the **Secrets** tab.

1. Review each plaintext secret that appears with the relevant metadata.

1. Select a secret to view extra details of that secret.

Different types of secrets have different sets of additional information. For example, for plaintext SSH private keys, the information includes related public keys (mapping between the private key to the authorized keys’ file we discovered or mapping to a different virtual machine that contains the same SSH private key identifier).
