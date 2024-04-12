---
title: Onboard non-Azure machines with Defender for Endpoint
description: Learn how to connect your non-Azure machines directly to Microsoft Defender for Cloud with Microsoft Defender for Endpoint.
ms.topic: quickstart
ms.date: 06/29/2023
author: dcurwin
ms.author: dacurwin

---

# Connect your non-Azure machines to Microsoft Defender for Cloud with Defender for Endpoint

Defender for Cloud allows you to directly onboard your non-Azure servers by deploying the Defender for Endpoint agent. This provides protection for both your cloud and non-cloud assets under a single, unified offering.

> [!NOTE]
> To connect your non-Azure machines via Azure Arc, see [Connect your non-Azure machines to Microsoft Defender for Cloud with Azure Arc](quickstart-onboard-machines.md).

This tenant-level setting allows you to automatically and natively onboard any non-Azure server running Defender for Endpoint to Defender for Cloud, without any extra agent deployments. This onboarding path is ideal for customers with mixed and hybrid server estate who wish to consolidate server protection under Defender for Servers.

## Availability

| Aspect                          | Details                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| Release state                   | GA                                                           |
| Supported operating systems     | All [Windows](/microsoft-365/security/defender-endpoint/minimum-requirements#supported-windows-versions) and [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux#system-requirements) **Server** operating systems supported by Defender for Endpoint |
| Required roles and  permissions | To manage this setting, you need **Subscription Owner** (on the chosen subscription), and  **Microsoft Entra Global Administrator** or  **Microsoft Entra Security Administrator** |
| Environments                    | On-premises servers  <br />Multicloud VMs – limited  support (see limitations section)|
| Supported plans                 | Defender for Servers P1  <br />Defender for Servers P2 –  limited features (see limitations section) |

## How it works

Direct onboarding is a seamless integration between Defender for Endpoint and Defender for Cloud that doesn’t require extra software deployment on your servers. Once enabled, it also shows your non-Azure server devices onboarded to Defender for Endpoint in Defender for Cloud, under a designated Azure Subscription you configure (in addition to their regular representation in  the Microsoft Defender Portal). The Azure Subscription is used for licensing, billing, alerts, and security insights but doesn't provide server management capabilities such as Azure Policy, Extensions, or Guest configuration. To enable server management capabilities, refer to the deployment of Azure Arc.

## Enabling direct onboarding

Enabling direct onboarding is an opt-in setting at the tenant level. It affects both existing and new servers onboarded to Defender for Endpoint in the same Microsoft Entra tenant. Shortly after you enable this setting, your server devices will show under the designated subscription. Alerts, software inventory, and vulnerability data are integrated with Defender for Cloud, in a similar way to how it works with Azure VMs.

Before you begin:

- Make sure you have the [required permissions](#availability)
- If you have a Microsoft Defender for Endpoint for Servers license on your tenant, [make sure to indicate it](faq-defender-for-servers.yml#can-i-get-a-discount-if-i-already-have-a-microsoft-defender-for-endpoint-license-) in Defender for Cloud
- Review the [limitations section](#current-limitations)

### Enabling in the Defender for Cloud portal

1. Go to **Defender for Cloud** > **Environment Settings** > **Direct onboarding**.
1. Switch the **Direct onboarding** toggle to **On**.
1. Select the subscription you would like to use for servers onboarded directly with Defender for Endpoint.
1. Select **Save**.

:::image type="content" source="media/onboard-machines-with-defender-for-endpoint/onboard-with-defender-for-endpoint.png" alt-text="Screenshot of Onboard non-Azure servers with Defender for Endpoint.":::

You now successfully enabled direct onboarding on your tenant. After you enable it for the first time, it might take up to 24 hours to see your non-Azure servers in your designated subscription.

### Deploying Defender for Endpoint on your servers

Deploying the Defender for Endpoint agent on your on-premises Windows and Linux servers is the same whether you use direct onboarding or not. Refer to the [Defender for Endpoint onboarding guide](/microsoft-365/security/defender-endpoint/onboarding) for further instructions.

## Current limitations

- **Plan support**: Direct onboarding provides access to all Defender for Servers Plan 1 features. However, certain features in Plan 2 still require the deployment of the Azure Monitor Agent, which is only available with Azure Arc on non-Azure machines. If you enable Plan 2 on your designated subscription, machines onboarded directly with Defender for Endpoint have access to all Defender for Servers Plan 1 features and the Defender Vulnerability Management Addon features included in Plan 2.
- **Multi-cloud support**: You can directly onboard VMs in AWS and GCP using the Defender for Endpoint agent. However, if you plan to simultaneously connect your AWS or GCP account to Defender for Servers using multicloud connectors, it's currently still recommended to deploy Azure Arc.
- **Simultaneous onboarding limited support**: For servers simultaneously onboarded using multiple methods (for example, direct onboarding combined with Log Analytics workspace-based onboarding), Defender for Cloud makes every effort to correlate them into a single device representation. However, devices using older versions of Defender for Endpoint might face certain limitations. In some instances, this could result in overcharges. We generally advise using the latest agent version. Specifically, for this limitation, ensure your Defender for Endpoint agent versions meet or exceed these minimum versions:

  |Operating System|Minimum agent version|
  | -------- | -------- |
  |Windows 2019| 10.8555|
  |Windows 2012 R2, 2016 (modern, unified agent)|10.8560|
  |Linux|30.101.23052.009|

## Next steps

This page showed you how to add your non-Azure machines to Microsoft Defender for Cloud. To monitor their status, use the inventory tools as explained in the following page:

- [Explore and manage your resources with asset inventory](asset-inventory.md)
