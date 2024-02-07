---
title: "Azure Operator Nexus: How to set up the Defender for Cloud security environment"
description: Learn how to enable and configure Defender for Cloud security plan features on your Operator Nexus subscription. 
author: rgendreau
ms.author: rgendreau
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/18/2023
ms.custom: template-how-to
---

# Set up the Defender for Cloud security environment on your Operator Nexus subscription

This guide provides you with instructions on how to enable Microsoft Defender for Cloud and activate and configure some of its enhanced security plan options that can be used to secure your Operator Nexus bare metal compute servers and workloads.

## Before you begin

To aid your understanding of Defender for Cloud and its many security features, there's a wide variety of material available on the [Microsoft Defender for Cloud documentation](/azure/defender-for-cloud/) site that you might find helpful.

## Prerequisites

To successfully complete the actions in this guide:
- You must have an Azure Operator Nexus subscription.
- You must have a deployed Azure Arc-connected Operator Nexus instance running in your on-premises environment.
- You must use an Azure portal user account in your subscription with Owner, Contributor or Reader role.     

## Enable Defender for Cloud

Enabling Microsoft Defender for Cloud on your Operator Nexus subscription is simple and immediately gives you access to its free included security features. To turn on Defender for Cloud:

1. Sign in to [Azure portal](https://portal.azure.com).
2. In the search box at the top, enter “Defender for Cloud.”
3. Select Microsoft Defender for Cloud under Services.

When the Defender for Cloud [overview page](../defender-for-cloud/overview-page.md) opens, you have successfully activated Defender for Cloud on your subscription. The overview page is an interactive dashboard user experience that provides a comprehensive view of your Operator Nexus security posture. It displays security alerts, coverage information, and much more. Using this dashboard, you can assess the security of your workloads and identify and mitigate risks.

After activating Defender for Cloud, you have the option to enable Defender for Cloud’s enhanced security features that provide important server and workload protections:
- [Defender for Servers](../defender-for-cloud/tutorial-enable-servers-plan.md)
- [Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) – made available through Defender for Servers
- [Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md)
 
## Set up a Defender for Servers plan to protect your bare metal servers

To take advantage of the added security protection of your on-premises bare metal machine (BMM) compute servers that's provided by Microsoft Defender for Endpoint, you can enable and configure a [Defender for Servers plan](../defender-for-cloud/plan-defender-for-servers-select-plan.md) on your Operator Nexus subscription.

### Prerequisites

- Defender for Cloud must be enabled on your subscription.

To set up a Defender for Servers plan:
1. [Turn on the Defender for Servers plan feature](../defender-for-cloud/tutorial-enable-servers-plan.md#enable-the-defender-for-servers-plan) under Defender for Cloud.
2. [Select one of the Defender for Servers plans](../defender-for-cloud/tutorial-enable-servers-plan.md#select-a-defender-for-servers-plan).
3. While on the *Defender plans* page, click the Settings link for Servers under the “Monitoring coverage” column. The *Settings & monitoring* page will open.
    * Ensure that **Log Analytics agent/Azure Monitor agent** is set to Off.
    * Ensure that **Endpoint protection** is set to Off.
      :::image type="content" source="media/security/nexus-defender-for-servers-plan-settings.png" alt-text="Screenshot of Defender for Servers plan settings for Operator Nexus." lightbox="media/security/nexus-defender-for-servers-plan-settings.png":::
    * Click Continue to save any changed settings.

### Operator Nexus-specific requirement for enabling Defender for Endpoint
 
> [!IMPORTANT]
> In Operator Nexus, Microsoft Defender for Endpoint is enabled on a per-cluster basis rather than across all clusters at once, which is the default behavior when the Endpoint protection setting is enabled in Defender for Servers. To request Endpoint protection to be turned on in one or more of your on-premises workload clusters you will need to open a Microsoft Support ticket, and the Support team will subsequently perform the enablement actions. You must have a Defender for Servers plan active in your subscription prior to opening a ticket.

Once Defender for Endpoint is enabled by Microsoft Support, its configuration is managed by the platform to ensure optimal security and performance, and to reduce the risk of misconfigurations.

## Set up the Defender for Containers plan to protect your Azure Kubernetes Service cluster workloads

You can protect the on-premises Kubernetes clusters that run your operator workloads by enabling and configuring the [Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) plan on your subscription.

### Prerequisites

- Defender for Cloud must be enabled on your subscription.

To set up the Defender for Containers plan:

1. Turn on the [Defender for Containers plan feature](../defender-for-cloud/tutorial-enable-containers-azure.md#enable-the-defender-for-containers-plan) under Defender for Cloud.
2. While on the *Defender plans* page, click the Settings link for Containers under the “Monitoring coverage” column. The *Settings & monitoring* page will open.
    * Ensure that **DefenderDaemonSet** is set to Off.
    * Ensure that **Azure Policy for Kubernetes** is set to Off.
       :::image type="content" source="media/security/nexus-defender-for-containers-plan-settings.png" alt-text="Screenshot of Defender for Containers plan settings for Operator Nexus." lightbox="media/security/nexus-defender-for-containers-plan-settings.png":::
   * Click Continue to save any changed settings.
