---
title: Protect your storage accounts with the Microsoft Defender for Storage plan
description: Learn how to enable the Defender for Storage on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 08/21/2023
---

# Deploy Microsoft Defender for Storage

Microsoft Defender for Storage is an Azure-native solution offering an advanced layer of intelligence for threat detection and mitigation in storage accounts, powered by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684), Microsoft Defender Antimalware technologies, and Sensitive Data Discovery. With protection for Azure Blob Storage, Azure Files, and Azure Data Lake Storage services, it provides a comprehensive alert suite, near real-time Malware Scanning (add-on), and sensitive data threat detection (no extra cost), allowing quick detection, triage, and response to potential security threats with contextual information. It helps prevent the three major impacts on your data and workload: malicious file uploads, sensitive data exfiltration, and data corruption.

With Microsoft Defender for Storage, organizations can customize their protection and enforce consistent security policies by enabling it on subscriptions and storage accounts with granular control and flexibility.

   > [!TIP] 
   > If you're currently using Microsoft Defender for Storage classic, consider [migrating to the new plan](defender-for-storage-classic-migrate.md), which offers several benefits over the classic plan.

## Availability

| Aspect | Details |
|---------|---------|
|Release state: | General Availability (GA) |
| Feature availability: |- Activity monitoring (security alerts) – General Availability (GA)<br>- Malware Scanning – General Availability (GA)<br>- Sensitive data threat detection (Sensitive Data Discovery) – Preview<br><br>Visit the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud) to learn more. |
|Required roles and permissions: | For Malware Scanning and sensitive data threat detection at subscription and storage account levels, you need Owner roles (subscription owner/storage account owner) or specific roles with corresponding data actions. To enable Activity Monitoring, you need 'Security Admin' permissions. Read more about the required permissions. |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds*<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government (only activity monitoring support on the classic plan)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts        |

*Azure DNS Zone is not supported for Malware Scanning and sensitive data threat detection.

## Prerequisites for Malware scanning
To enable and configure Malware Scanning, you must have Owner roles (such as Subscription Owner or Storage Account Owner) or specific roles with the necessary data actions. Learn more about the [required permissions](support-matrix-defender-for-storage.md).

## Set up and configure Microsoft Defender for Storage

To enable and configure Microsoft Defender for Storage and ensure maximum protection and cost optimization, the following configuration options are available:

- Enable/disable Microsoft Defender for Storage at the subscription and storage account levels.
- Enable/disable the Malware Scanning or sensitive data threat detection configurable features.
- Set a monthly cap ("capping") on the Malware Scanning per storage account per month to control costs (default value is 5,000GB).
- Configure methods to set up response to malware scanning results.
- Configure methods for saving malware scanning results logging.

> [!TIP]
> The Malware Scanning feature has advanced configurations to help security teams support different workflows and requirements.

- [Override subscription-level settings to configure specific storage accounts](advanced-configurations-for-malware-scanning.md#override-defender-for-storage-subscription-level-settings) with custom configurations that differ from the settings configured at the subscription level.

There are several ways to enable and configure Defender for Storage: using the [Azure built-in policy](defender-for-storage-policy-enablement.md) (the recommended method), programmatically using Infrastructure as Code templates, including [Terraform](defender-for-storage-infrastructure-as-code-enablement.md?tabs=enable-subscription#terraform-template), [Bicep](defender-for-storage-infrastructure-as-code-enablement.md?tabs=enable-subscription#bicep-template), and [ARM](defender-for-storage-infrastructure-as-code-enablement.md?tabs=enable-subscription#azure-resource-manager-template) templates, using the [Azure portal](defender-for-storage-azure-portal-enablement.md?tabs=enable-subscription), or directly with the [REST API](defender-for-storage-rest-api-enablement.md?tabs=enable-subscription).

Enabling Defender for Storage via a policy is recommended because it facilitates enablement at scale and ensures that a consistent security policy is applied across all existing and future storage accounts within the defined scope (such as entire management groups). This keeps the storage accounts protected with Defender for Storage according to the organization's defined configuration.

> [!NOTE]
> To prevent migrating back to the legacy classic plan, make sure to disable the old Defender for Storage policies. Look for and disable policies named ``Configure Azure Defender for Storage to be enabled``, ``Azure Defender for Storage should be enabled``, or ``Configure Microsoft Defender for Storage to be enabled (per-storage account plan)`` or deny policies that prevent the disablement of the classic plan.

## Next steps

- Learn how to [enable and Configure the Defender for Storage plan at scale with an Azure built-in policy](defender-for-storage-policy-enablement.md).



