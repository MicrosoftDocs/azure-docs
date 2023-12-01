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

To support this integration, Microsoft Sentinel has added a new **Tenant-based Microsoft Defender for Cloud (Preview)** connector. This connector will allow Microsoft Sentinel customers to receive Defender for Cloud alerts and incidents across their entire tenants, without having to monitor and maintain the connector's enrollment to all their Defender for Cloud subscriptions.

This connector can be used to ingest Defender for Cloud alerts, regardless of whether you have Defender XDR incident integration enabled.

> [!IMPORTANT]
> The Defender for Cloud integration with Defender XDR, and the Tenant-based Microsoft Defender for Cloud connector, are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

## Choose how to use this integration and the new connector

How you choose to use this integration, and whether you want to ingest complete incidents or just alerts, will depend in large part on what you're already doing with respect to Microsoft Defender XDR incidents.

- If you're already ingesting Defender XDR incidents, or if you're choosing to start doing so now, you're strongly advised to enable this new tenant-based connector. Your Defender XDR incidents will now include Defender for Cloud-based incidents with fully populated alerts from all Defender for Cloud subscriptions in your tenant.

    If, in this situation, you remain with the legacy subscription-based Defender for Cloud connector and don't connect the new tenant-based one, you may receive Defender for Cloud incidents that contain empty alerts (in the case of a subscription to which the connector isn't enrolled).

- If you don't intend to enable [Microsoft Defender XDR incident integration](microsoft-365-defender-sentinel-integration.md), you can still receive Defender for Cloud *alerts*, regardless of which version of the connector you enable. However, the new tenant-based connector still affords you the advantage of not needing the permissions to monitor and maintain your list of Defender for Cloud subscriptions in the connector.

- If you *have* enabled Defender XDR integration, but you only want to receive Defender for Cloud *alerts* but not *incidents*, you can use [automation rules](create-manage-use-automation-rules.md) to immediately close Defender for Cloud incidents as they arrive.

    If that's not an adequate solution, or if you still want to collect alerts from Defender for Cloud on a per-subscription basis, you can completely opt-out of the Defender for Cloud integration in the Microsoft Defender XDR portal, and then use the legacy, subscription-based version of the Defender for Cloud connector to receive those alerts.

## Set up the integration in Microsoft Sentinel

If you haven't already enabled [incident integration in your Microsoft 365 Defender connector](connect-microsoft-365-defender.md), do so first.

Then, enable the new **Tenant-based Microsoft Defender for Cloud (Preview)** connector. This connector is available through the **Microsoft Defender for Cloud solution**, version 3.0.0, in the Content Hub. If you have an earlier version of this solution, you can upgrade it in the content hub.

If you had previously enabled the legacy, subscription-based Defender for Cloud connector (which will be displayed as **Subscription-based Microsoft Defender for Cloud (Legacy)**), then you're advised to disable it to prevent duplication of alerts in your logs.

If you have any [Scheduled or Microsoft Security analytics rules](detect-threats-built-in.md) that create incidents from Defender for Cloud alerts, you're encouraged to disable these rules, since you'll be receiving ready-made incidents created by&mdash;and synchronized with&mdash;Microsoft 365 Defender.

If there are specific types of Defender for Cloud alerts for which you don't want to create incidents, you can use automation rules to close these incidents immediately, or you can use the built-in tuning capabilities in the Microsoft 365 Defender portal.

## Next steps

In this article, you learned how to use Microsoft Defender for Cloud's integration with Microsoft Defender XDR to ingest incidents and alerts into Microsoft Sentinel.

Learn more about the Microsoft Defender for Cloud integration with Microsoft Defender XDR.
- See [Microsoft Defender for Cloud in Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-365-security-center-defender-cloud), and particularly the [Impact to Microsoft Sentinel users](/microsoft-365/security/defender/microsoft-365-security-center-defender-cloud#impact-to-microsoft-sentinel-users) section, from the Microsoft Defender XDR documentation.
- See [Alerts and incidents in Microsoft 365 Defender (Preview)](../defender-for-cloud/concept-integration-365.md) from the Microsoft Defender for Cloud documentation.
