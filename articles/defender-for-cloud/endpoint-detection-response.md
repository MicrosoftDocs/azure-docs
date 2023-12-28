---
title: Manage Endpoint Detection and Response solution 
description: Learn how to identify if an Endpoint Detection and Response solution is installed on your virtual machine. You can also identify if there are any gaps in your security configuration and how to remediate the findings.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 12/27/2023
---

# Manage Endpoint Detection and Response solution 

> [!NOTE]
> As the Log Analytics agent (also known as MMA) is set to retire in [August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/), all Defender for Servers features that currently depend on it, including those described on the [Endpoint protection assessment and recommendations in Microsoft Defender for Cloud](endpoint-protection-recommendations-technical.md) page, will be available through either [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md) or [agentless scanning](concept-agentless-data-collection.md), before the retirement date. For more information about the roadmap for each of the features that are currently rely on Log Analytics Agent, see [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
>
> The process on this page will replace the current configuration and can be used starting today.

Microsoft Defender for Cloud offers security recommendations that assist you in the process of reducing a machine's [attack surface](concept-attack-path.md) allowing the machine to avoid known risks. Defender for Cloud has several recommendations that ensure an Endpoint Detection and Response (EDR) solution is installed and configured securely and according to compliance standards across all of your environments. 

Defender for Cloud allows you to: 

- Identify whether an EDR is installed on your machines.  

- Identify gaps in your security configurations on any of the discovered EDRs.

- Shows you how to remediate gaps in your security configurations.

## Prerequisites

- [Defender for Cloud](connect-azure-subscription.md) enabled on your Azure account.

- Enable either of the following plans on Defender for Cloud:
    - [Defender for Servers Plan 2](tutorial-enable-servers-plan.md)
    - [Defender CSPM](tutorial-enable-cspm-plan.md)

- Enable [agentless scanning for your machines](enable-agentless-scanning-vms.md#enabling-agentless-scanning-for-machines).

## Detect an Endpoint Detection and Response solution

Defender for Cloud offers various recommendation that harden and remediate threats to your environments. The following three recommendations will detect if an Endpoint Detection and Response solution exists on your Azure virtual machines (VM), AWS EC2 instances and GCP VM instances respectively.

- `Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines`
- `Endpoint Detection and Response (EDR) solution should be installed on EC2s`
- `Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP)`

### Detect Endpoint Detection and Response solution on Azure VM

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter `Endpoint Detection and Response (EDR) solution should be installed on virtual machines`.

1. Select the recommendation `Endpoint Detection and Response (EDR) solution should be installed on virtual machines`.

1. 

### Detect Endpoint Detection and Response solution on AWS EC2 instances

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter `Endpoint Detection and Response (EDR) solution should be installed on EC2s`.

1. Select the recommendation `Endpoint Detection and Response (EDR) solution should be installed on EC2s`.

1. 

### Detect Endpoint Detection and Response solution on GCP VM instances

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter `Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP)`.

1. Select the recommendation `Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP)`.

1. 

## Configure an Endpoint Detection and Response solution

Defender for Cloud offers various recommendation that harden and remediate threats to your environments. The following three recommendations will assist you in the configuration of the Endpoint Detection and Response solution that exists on your Azure virtual machines (VM), AWS EC2 instances and GCP VM instances respectively.

- `Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines`
- `Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s`
- `Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines`

### Configure an Endpoint Detection and Response solution on Azure VM

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter `Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines`.

1. Select the recommendation `Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines`.

1. 

### Configure an Endpoint Detection and Response solution on AWS EC2 instances

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter `Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s`.

1. Select the recommendation `Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s`.

1. 

### Configure an Endpoint Detection and Response solution on GCP VM instances

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter `Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines`.

1. Select the recommendation `Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines`.

1. 

## Next steps
