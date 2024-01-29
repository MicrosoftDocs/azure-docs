---
title: Manage Endpoint Detection and Response solution 
description: Learn how to identify if an Endpoint Detection and Response solution is installed on your virtual machine. You can also identify if there are any gaps in your security configuration and how to remediate the findings.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 01/29/2024
---

# Manage Endpoint Detection and Response solution 

> [!NOTE]
> The Log Analytics agent (also known as MMA) is set to retire in [August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). All Defender for Servers features that depend on the AMA, including those described on the [Enable Defender for Endpoint (Log Analytics)](endpoint-protection-recommendations-technical.md) page, will be available through either [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md) or [agentless scanning](concept-agentless-data-collection.md), before the retirement date. For more information about the roadmap for each of the features that are currently rely on Log Analytics Agent, see [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).

> [!IMPORTANT]
> Defender for Cloud recommends using the process described on this page to review Endpoint Detection and Response solution installation status and configuration issues within your EDR solution.

Defender for Cloud  recommendations that . 

Microsoft Defender for Cloud provides security recommendations are used to harden and remediate threats to your environments. Remediating these recommendations reduces a machine's [attack surface](concept-attack-path.md) and allows the machine to avoid known risks. 

Defender for Cloud has recommendations that: 

Defender for Cloud's recommendations allow you to: 

- Identify if an Endpoint Detection and Response (EDR) solution is installed on your machines.  

- Identify gaps in the security configurations on any of the discovered EDRs.

- Remediate detected gaps in your security configurations.

By remediating the recommendations that appear in Defender for Cloud, you can ensure that the installed EDR solution is installed and configured securely and according to compliance standards across all of your environments. 

The following EDR solutions are supported and can be enabled through Defender for Cloud

| EDR solution | Supported platforms | 
|--|--|
| Microsoft Defender for Endpoint for Windows | Windows |
| Microsoft Defender for Endpoint for Linux <sup>[1](#footnote1)</sup> | Linux | 
| Microsoft Defender for Endpoint Unified Solution <sup>[2](#footnote2)</sup>| Windows Server 2012 R2 <br> Windows 2016 |

<sup><a name="footnote1"></a>1</sup>: A Linux machine that has Microsoft Defender for Endpoint enabled, will only appear as healthy if the always-on scanning feature (also known as real-time protection (RTP)) is active. By default, the RTP feature is disabled to avoid clashes with other anti-virus software.

<sup><a name="footnote2"></a>2</sup>: The Defender for Endpoint unified solution on Server 2012 R2 automatically installs Microsoft Defender Antivirus in `Active mode`. For Windows Server 2016, Microsoft Defender Antivirus is built into the operating system.

## Prerequisites

- [Defender for Cloud](connect-azure-subscription.md) enabled on your Azure account.

- Enable either of the following plans enabled on Defender for Cloud:
    - [Defender for Servers Plan 2](tutorial-enable-servers-plan.md)
    - [Defender CSPM](tutorial-enable-cspm-plan.md)

- Enable [agentless scanning for your machines](enable-agentless-scanning-vms.md#enabling-agentless-scanning-for-machines).

## Detect an Endpoint Detection and Response solution

The following recommendations appear in Defender for Cloud when an Endpoint Detection and Response solution is not detected on your Azure virtual machines (VM), AWS EC2 instances or GCP VM instances.

- Azure VM - `Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines`
- AWS EC2 instances - `Endpoint Detection and Response (EDR) solution should be installed on EC2s`
- GCP VM instances - `Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP)`

### Detect an EDR solution on your machine

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter the appropriate recommendation.

1. Select the recommendation.

1. [Remediate the recommendation](implement-security-recommendations.md).

After the process is completed, it may take up to 24 hours until your resources move to the ‘healthy resources’ tab 

## Configure an Endpoint Detection and Response solution

The following recommendations appear in Defender for Cloud when an Endpoint Detection and Response solution has misconfigurations on your Azure VM, AWS EC2 instances or GCP VM instances.

- Azure VM - `Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines`
- AWS EC2 instances - `Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s`
- GCP VM instances - `Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines`

### Configure an Endpoint Detection and Response solution on Azure VM

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. In the search field enter the appropriate recommendation.

1. Select the recommendation.

1. [Remediate the recommendation](implement-security-recommendations.md).

After the process is completed, it may take up to 24 hours until your resources move to the ‘healthy resources’ tab 

## Using the fix option

Defender for Cloud includes an option that allows you to `Fix` machines that don't have an EDR installed on them using the fix option. The fix option enables Microsoft Defender for Endpoint on your machines in your subscription. The Defender for Endpoint integration is included with both Defender for Servers Plan 1 and Plan 2.

If your resource is not covered by either of the Defender for Servers plans, the fix will ask you to enable one of the Defender for Servers plans. You can learn about the cost for each plan on the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h).

If the Defender for Endpoint integrations is configured correctly on your subscription, but the Defender for Endpoint extension is not found on the resource, a manual troubleshooting reference will appear as the fix option.

Defender for Servers Plan 1 includes the Defender for Endpoint agent provisioning feature. However, the discovery assessment isonly availble as part of the [agentless scanning](concept-agentless-data-collection.md) feature which is included in Plan 2. If you only have Plan 1 enabled, your resource will appear as `Not Applicable` after you have provisioned it.

After the fix process is completed, it can take up to 24 hours until your resources move to the `Healthy resources` tab.

Learn how to [use the fix option](implement-security-recommendations.md#use-the-fix-option).

## Next steps
