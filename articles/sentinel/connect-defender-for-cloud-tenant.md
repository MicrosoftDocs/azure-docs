---
title: Ingest tenant-wide Microsoft Defender for Cloud alerts into Microsoft Sentinel
description: Learn how to ingest Microsoft Defender for Cloud security alerts throughout your whole tenant into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/22/2023
---

# Ingest tenant-wide Microsoft Defender for Cloud alerts to Microsoft Sentinel

[Microsoft Defender for Cloud](../defender-for-cloud/index.yml)'s integrated cloud workload protections allow you to detect and quickly respond to threats across hybrid and multi-cloud workloads.

The **Tenant-based Microsoft Defender for Cloud (Preview) connector** allows you to ingest [alerts from Defender for Cloud](../defender-for-cloud/alerts-reference.md) into Microsoft Sentinel, so you can view, analyze, and respond to Defender alerts, and the incidents they generate, in a broader organizational threat context.

While [Microsoft Defender for Cloud Defender plans](../defender-for-cloud/defender-for-cloud-introduction.md#protect-cloud-workloads) are enabled per subscription, this *tenant-based data connector* is enabled or disabled once, over all the subscriptions in your tenant. The legacy version of this connector, also enabled on a per-workload subscription basis, is still available as the **Subscription-based Microsoft Defender for Cloud connector**.

> [!IMPORTANT]
> The Tenant-based Microsoft Defender for Cloud connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Defender for Cloud integration with Microsoft Defender XDR

Defender for Cloud is now [integrated with Microsoft Defender XDR](../defender-for-cloud/release-notes.md#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview)., formerly Microsoft 365 Defender (also in PREVIEW). If you have [Defender XDR incident integration enabled](microsoft-365-defender-sentinel-integration.md) in Microsoft Sentinel, you'll now [receive Defender for Cloud incidents](ingest-defender-for-cloud-incidents.md) through Defender XDR, which means they'll benefit from the same bi-directional synchronization as all other Defender XDR incidents.

## Prerequisites

- You must have read and write permissions or the **Contributor** role on your Microsoft Sentinel workspace.

- You must have the **Global Admin** role in your Microsoft Entra ID tenant. Since this connector works at the tenant level, you need not have any particular permissions or role on the subscriptions that correspond to the workloads you are monitoring with Defender for Cloud.

- Install the solution for **Microsoft Defender for Cloud** from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

    - If the solution is already installed, verify that it's version 3.0.0 or greater, otherwise reinstall it to get the newest versions of the connector.

## Connect to Microsoft Defender for Cloud

...coming soon...

## Find and analyze your data

...coming soon...

## Next steps

In this document, you learned how to connect Microsoft Defender for Cloud to Microsoft Sentinel and synchronize alerts between them. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- Write your own rules to [detect threats](detect-threats-custom.md).
