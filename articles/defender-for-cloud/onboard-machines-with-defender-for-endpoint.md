---
title: Onboard non-Azure machines with Defender for Endpoint
description: Learn how to connect your non-Azure machines directly to Microsoft Defender for Cloud with Microsoft Defender for Endpoint.
ms.topic: quickstart
ms.date: 05/29/2023
author: dcurwin
ms.author: dacurwin

---
# Quickstart: Connect your non-Azure machines to Microsoft Defender for Cloud with Defender for Endpoint

Defender for Cloud can monitor the security posture of your non-Azure computers, but first you need to connect them to Azure.

> [!NOTE]
> To connect your non-Azure machines via Azure Arc, see [Connect your non-Azure machines to Microsoft Defender for Cloud with Azure Arc](quickstart-onboard-machines.md).

This tenant-level setting allows you to automatically and natively onboard any non-Azure server running Defender for Endpoint to Defender for Cloud, without any additional agent deployments. This onboarding path is ideal for customers with mixed and hybrid server estate who wish to consolidate server protection under Defender for Servers licensing.

## Availability

| Aspect                          | Details                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| Release state                   | GA                                                           |
| Supported operating systems     | All Windows and Linux server operating systems supported by Defender for Endpoint |
| Required roles and  permissions | To manage this setting you need **Subscription Owner** (on the chosen subscription), and  **AAD Global Administrator** or  **AAD Security Administrator** |
| Environments                    | On-premises servers  <br />Multi-cloud VMs – limited  support |
| Supported plans                 | Defender for Servers P1  <br />Defender for Servers P2 –  limited features |

## How it works

Direct onboarding is a seamless integration between Defender for Endpoint and Defender for Cloud,  that doesn’t require additional software deployment on your servers. Once enabled, it also shows your non-Azure server devices onboarded to Defender for Endpoint in Defender for Cloud, under a designated Azure Subscription you configure (in addition to their regular representation in  the Microsoft 365 Defender portal). The Azure Subscription is used for licensing, billing, data alerts, and data integration  but doesn't allow server management capabilities such as Azure Policy, Extensions, or Guest configuration. To enable server management capabilities, refer to the deployment of Azure Arc.

## Enabling direct onboarding

Enabling direct onboarding is an opt-in setting at the tenant level. It affects both existing and new servers onboarded to Defender for Endpoint in the same Azure AD tenant. Shortly after enabling this setting your server devices will show under the designated subscription. Alerts, software inventory, and vulnerability data will be integrated with Defender for Cloud, in a similar way to how it works with Azure VMs.

Before you begin:

- Make sure you have the required permissions (availability section)

- If you have a Microsoft Defender for Endpoint for Servers license – [make sure to indicate it](faq-defender-for-servers.yml#can-i-get-a-discount-if-i-already-have-a-microsoft-defender-for-endpoint-license-) in Defender for Cloud

- Review the limitations section

### Enabling in the Defender for Cloud portal

1. Go to **Defender for Cloud** > **Environment Settings** > **Direct onboarding**.
2. Switch the **Direct onboarding** toggle to **On**.
3. Select the subscription you would like to use for servers onboarded directly with Defender for Endpoint
4. Select **Save**.

[Screenshot]

You've now successfully enabled direct onboarding on your tenant. After enabling for the first time, it may take up to 24 hours to see your non-Azure servers in your designated subscription.

### Deploying Defender for Endpoint on your servers

Deploying the Defender for Endpoint agent on your on-premises Windows and Linux servers is the same whether you use direct onboarding or not. Refer to the [Defender for Endpoint onboarding guide](/microsoft-365/security/defender-endpoint/onboarding) for further instructions.

## Next steps

This page showed you how to add your non-Azure machines to Microsoft Defender for Cloud. To monitor their status, use the inventory tools as explained in the following page:

- [Explore and manage your resources with asset inventory](asset-inventory.md)
