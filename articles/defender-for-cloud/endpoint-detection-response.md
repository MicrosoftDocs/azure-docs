---
title: Manage Endpoint Detection and Response solution 
description: Learn how to identify if an Endpoint Detection and Response solution is installed on your virtual machine. You can also identify if there are any gaps in your security configuration and how to remediate the findings.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 12/31/2023
---

# Manage Endpoint Detection and Response solution 

> [!NOTE]
> As the Log Analytics agent (also known as MMA) is set to retire in [August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/), all Defender for Servers features that currently depend on it, including those described on the [Endpoint protection assessment and recommendations in Microsoft Defender for Cloud](endpoint-protection-recommendations-technical.md) page, will be available through either [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md) or [agentless scanning](concept-agentless-data-collection.md), before the retirement date. For more information about the roadmap for each of the features that are currently rely on Log Analytics Agent, see [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
>
> The process on this page is the current configuration process and should be used to .

Microsoft Defender for Cloud offers security recommendations that assist you in the process of reducing a machine's [attack surface](concept-attack-path.md) allowing the machine to avoid known risks. Defender for Cloud has several recommendations that ensure an Endpoint Detection and Response (EDR) solution is installed and configured securely and according to compliance standards across all of your environments. 

Defender for Cloud's recommendations allow you to: 

- Identify if an EDR solution is installed on your machines.  

- Identify gaps in your security configurations on any of the discovered EDRs.

- Shows you how to remediate gaps in your security configurations.

## Prerequisites

- [Defender for Cloud](connect-azure-subscription.md) enabled on your Azure account.

- Enable either of the following plans enabled on Defender for Cloud:
    - [Defender for Servers Plan 2](tutorial-enable-servers-plan.md)
    - [Defender CSPM](tutorial-enable-cspm-plan.md)

- Enable [agentless scanning for your machines](enable-agentless-scanning-vms.md#enabling-agentless-scanning-for-machines).

## Detect an Endpoint Detection and Response solution

Defender for Cloud offers various recommendation that harden and remediate threats to your environments. The following three recommendations will detect if an Endpoint Detection and Response solution exists on your Azure virtual machines (VM), AWS EC2 instances and GCP VM instances.

- [Azure VM](#detect-endpoint-detection-and-response-solution-on-azure-vm) -`Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines`
- [AWS  EC2 instances](#detect-endpoint-detection-and-response-solution-on-aws-ec2-instances) -`Endpoint Detection and Response (EDR) solution should be installed on EC2s`
- [GCP VM instances](#detect-endpoint-detection-and-response-solution-on-gcp-vm-instances) -`Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP)`

The following EDR solutions are supported and can be enabled through Defender for Cloud

| EDR solution | Supported platforms | 
|--|--|
| Microsoft Defender for Endpoint for Windows | Windows |
| Microsoft Defender for Endpoint for Linux <sup>[1](#footnote1)</sup> | Linux | 
| Microsoft Defender for Endpoint Unified Solution <sup>[2](#footnote2)</sup>| Windows Server 2012 R2 <br> Windows 2016 |

<sup><a name="footnote1"></a>1</sup>: A Linux machine that has Microsoft Defender for Endpoint enabled, will only appear as healthy if the always-on scanning feature (also known as real-time protection (RTP)) is active. By default, the RTP feature is disabled to avoid clashes with other anti-virus software.

<sup><a name="footnote2"></a>2</sup>: The Defender for Endpoint unified solution on Server 2012 R2 automatically installs Microsoft Defender Antivirus in `Active mode`. For Windows Server 2016, Microsoft Defender Antivirus is built into the operating system.

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

Defender for Cloud offers various recommendation that harden and remediate threats to your environments. The following three recommendations will assist you in the configuration of the Endpoint Detection and Response solution that exists on your Azure VM, AWS EC2 instances and GCP VM instances.

- [Azure VM](#configure-an-endpoint-detection-and-response-solution-on-azure-vm) -`Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines`
- [AWS EC2 instances](#configure-an-endpoint-detection-and-response-solution-on-aws-ec2-instances) - `Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s`
- [GCP VM instances](#configure-an-endpoint-detection-and-response-solution-on-gcp-vm-instances) - `Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines`

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

## Using the fix option

Defender for Cloud includes an option that allows you to `Fix` machines that don't have an EDR installed on them using the fix option. The fix option enables Defender for Endpoint on your machines through the Defender for Cloud portal on your subscription. Defender for Endpoint is included with both Defender for Servers plan 1 and plan 2. 

If your resource is not covered by either of the Defender for Servers plans, the fix will ask you to enable one of the Defender for Servers plans. For pricing information on Defender for Servers, see the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h).

If the Defender for Endpoint integrations are configured correctly on your subscriptions but the Defender for Endpoint extension is not found on the resource, a manual troubleshooting reference will appear as a fix.

Defender for Servers plan 1 includes the Defender for Endpoint agent provisioning feature. However, on the assessment's next check, the machines will be classified as `Not Applicable` due to the discovery assessment only being available as part of agentless scanning in Defender for Servers plan 2.

After the fix process is completed, it can take up to 24 hours until your resources move to the `Healthy resources` tab.

## Next steps
