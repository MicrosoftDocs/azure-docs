---
title: Ingest Microsoft Defender for Cloud incidents with Microsoft Defender XDR integration
description: Learn how using Microsoft Defender for Cloud's integration with Microsoft Defender XDR lets you ingest Microsoft Defender for Cloud incidents through Microsoft Defender XDR. This lets you add Defender for Cloud incidents to your Microsoft Sentinel incidents queue while seamlessly applying  Defender XDR's strengths to help investigate all your cloud workload security incidents.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 11/28/2023
---

# Ingest Microsoft Defender for Cloud incidents with Microsoft Defender XDR integration

Microsoft Defender for Cloud is now [integrated with Microsoft Defender XDR](../defender-for-cloud/release-notes.md#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview), formerly known as Microsoft 365 Defender. This integration, currently **in Preview**, allows Defender XDR to collect alerts from Defender for Cloud and create Defender XDR incidents from them.

Thanks to this integration, Microsoft Sentinel customers who have enabled [Defender XDR incident integration](microsoft-365-defender-sentinel-integration.md) will now be able to ingest and synchronize Defender for Cloud incidents, with all their alerts, through Microsoft Defender XDR.

To support this integration, Microsoft has added a new **Tenant-based Microsoft Defender for Cloud (Preview)** connector. This connector will allow Microsoft Sentinel customers to receive Defender for Cloud alerts and incidents across their entire tenants, without having to monitor and maintain the connector's enrollment to all their Defender for Cloud subscriptions.

This connector can be used to ingest Defender for Cloud alerts, regardless of whether you have Defender XDR incident integration enabled.

#### Choose how to use this integration

- To take advantage of this integration, enable this new tenant-based connector. You'll receive Defender for Cloud incidents with fully populated alerts from all Defender for Cloud subscriptions in your tenant.

- If you have the legacy subscription-based Defender for Cloud connector and don't connect the new tenant-based one, you may receive Defender for Cloud incidents that contain empty alerts (in the case of a subscription to which the connector isn't enrolled).

- If you only want to continue receiving Defender for Cloud *alerts*, but don't want to receive Defender for Cloud *incidents* through this integration, you'll need to opt-out of the integration in the Microsoft 365 Defender portal. 

- In this scenario, you can still use the new tenant-based connector to collect alerts from all of the Defender for Cloud subscriptions in your tenant, without having to enroll each subscription separately in the connector. Just enable the tenant-based Defender for Cloud connector and set it (in the Microsoft 365 Defender portal) to collect only alerts and not incidents.

#### How to prepare for the integration

If you haven't already enabled [incident integration in your Microsoft 365 Defender connector](connect-microsoft-365-defender.md), do so first.

Then, enable the new **Tenant-based Microsoft Defender for Cloud (Preview)** connector. This connector is available through the **Microsoft Defender for Cloud solution**, version 3.0.0, in the Content Hub. If you have an earlier version of this solution, you can upgrade it in the content hub.

If you had previously enabled the legacy, subscription-based Defender for Cloud connector (which will be displayed as **Subscription-based Microsoft Defender for Cloud (Legacy)** once you've installed the latest version of the Defender for Cloud solution), then you're advised to disable it to prevent duplication of alerts in your logs.

If you have any [Scheduled or Microsoft Security analytics rules](detect-threats-built-in.md) that create incidents from Defender for Cloud alerts, you're encouraged to disable these rules, since you'll be receiving ready-made incidents created by&mdash;and synchronized with&mdash;Microsoft 365 Defender.

If there are specific types of Defender for Cloud alerts for which you don't want to create incidents, you can use automation rules to close these incidents immediately, or you can use the built-in tuning capabilities in the Microsoft 365 Defender portal.
