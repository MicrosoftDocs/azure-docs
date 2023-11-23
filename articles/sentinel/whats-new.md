---
title: What's new in Microsoft Sentinel
description: This article describes new features in Microsoft Sentinel from the past few months.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 10/25/2023
---

# What's new in Microsoft Sentinel

This article lists recent features added for Microsoft Sentinel, and new features in related services that provide an enhanced user experience in Microsoft Sentinel.

The listed features were released in the last three months. For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).


> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/sentinel/rss`

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## November 2023

- [Take advantage of Microsoft Defender for Cloud integration with Microsoft 365 Defender (Preview)](#take-advantage-of-microsoft-defender-for-cloud-integration-with-microsoft-365-defender-preview)
- [Near-real-time rules now generally available](#near-real-time-rules-now-generally-available)
- [Elevate your cybersecurity intelligence with enrichment widgets (Preview)](#elevate-your-cybersecurity-intelligence-with-enrichment-widgets-preview)

### Take advantage of Microsoft Defender for Cloud integration with Microsoft 365 Defender (Preview)

Microsoft Defender for Cloud now integrates with Microsoft 365 Defender (this integration is currently **in Preview**). Microsoft Sentinel customers can now take advantage of this integration by ingesting Defender for Cloud alerts and incidents through Microsoft 365 Defender.

To support this integration, Microsoft has added a new **Tenant-based Microsoft Defender for Cloud (Preview)** connector. This connector will allow Defender for Cloud alerts and incidents to be sent to any Microsoft Sentinel customers who have already enabled [Microsoft 365 Defender incident integration](microsoft-365-defender-sentinel-integration.md).

Customers who enable this new tenant-based connector will receive all the alerts in Defender for Cloud incidents, with all their information. with no gaps or empty alerts, customers are advised to connect the new tenant based MDC connector which will bring alerts from all mdc enabled subscriptions of the tenant. 

Customers that do not want to receive MDC incidents through the XDR integration will need to opt-out of the integration through the XDR portal. 

Customers that wish to collect alert from all their MDC enabled subscriptions of the tenant without manual addition of each subscription adding to MDC can enable the tenant based MDC alerts connector with no incidents from XDR enablement.





If you have previously connected your Microsoft Defender XDR incidents connector, connect the new “Tenant-based Microsoft Defender for Cloud (Preview)” connector to synchronize your entire collection of subscriptions with your tenant-based Defender for Cloud incidents streaming through the Microsoft Defender XDR Incidents connector. The connector is available through the Microsoft Defender for Cloud version 3.0.0 solution in the Content Hub. 

If you have not previously synchronized your Defender XDR incidents to Sentinel and would like to benefit from this exciting integration in your Microsoft Sentinel workspace, connect the Defender XDR Incidents and the new “Tenant-based Microsoft Defender for Cloud (Preview)” connector.     

If you previously enabled the legacy subscription-based Microsoft Defender for Cloud alerts connector, you are advised to disconnect to prevent duplications. 








### Near-real-time rules now generally available

Microsoft Sentinel’s [near-real-time analytics rules](detect-threats-built-in.md#nrt) are now generally available (GA). These highly responsive rules provide up-to-the-minute threat detection by running their queries at intervals just one minute apart.

- [Learn more about near-real-time rules](near-real-time-rules.md).
- [Create and work with near-real-time rules](create-nrt-rules.md).

<a name="visualize-data-with-enrichment-widgets-preview"></a>
### Elevate your cybersecurity intelligence with enrichment widgets (Preview)

Enrichment widgets in Microsoft Sentinel are dynamic components designed to provide you with in-depth, actionable intelligence about entities. They integrate external and internal content and data from various sources, offering a comprehensive understanding of potential security threats. These widgets serve as a powerful enhancement to your cybersecurity toolkit, offering both depth and breadth in information analysis.

Widgets are already available in Microsoft Sentinel today (in Preview). They currently appear for IP entities, both on their full [entity pages](entity-pages.md) and on their [entity info panels](incident-investigation.md) that appear in Incident pages. These widgets show you valuable information about the entities, from both internal and third-party sources.

**What makes widgets essential in Microsoft Sentinel?**

- **Real-time updates:** In the ever-evolving cybersecurity landscape, real-time data is of paramount importance. Widgets provide live updates, ensuring that your analysts are always looking at the most recent data.

- **Integration:** Widgets are seamlessly integrated into Microsoft Sentinel data sources, drawing from their vast reservoir of logs, alerts, and intelligence. This integration means that the visual insights presented by widgets are backed by the robust analytical power of Microsoft Sentinel.

In essence, widgets are more than just visual aids. They are powerful analytical tools that, when used effectively, can greatly enhance the speed and efficiency of threat detection, investigation, and response.

- [Enable the enrichment widgets experience in Microsoft Sentinel](enable-enrichment-widgets.md)

## October 2023

- [Microsoft Applied Skill - Configure SIEM security operations using Microsoft Sentinel](#microsoft-applied-skill-available-for-microsoft-sentinel)
- [Changes to the documentation table of contents](#changes-to-the-documentation-table-of-contents)

### Microsoft Applied Skill available for Microsoft Sentinel

This month Microsoft Worldwide Learning announced [Applied Skills](https://techcommunity.microsoft.com/t5/microsoft-learn-blog/announcing-microsoft-applied-skills-the-new-credentials-to/ba-p/3775645) to help you acquire the technical skills you need to reach your full potential. Microsoft Sentinel is included in the initial set of credentials offered! This credential is based on the learning path with the same name.
- **Learning path** - [Configure SIEM security operations using Microsoft Sentinel](/training/paths/configure-security-information-event-management-operations-using-microsoft-sentinel/)
  <br>Learn at your own pace, and the modules require you to have your own Azure subscription.
- **Applied Skill** - [Configure SIEM security operations using Microsoft Sentinel](/credentials/applied-skills/configure-siem-security-operations-using-microsoft-sentinel/)
  <br>A 2 hour assessment is contained in a sandbox virtual desktop. You are provided an Azure subscription with some features already configured.

### Changes to the documentation table of contents

We've made some significant changes in how the Microsoft Sentinel documentation is organized in the table of contents on the left-hand side of the library. Two important things to know:

- Bookmarked links persist. Unless we retire an article, your saved and shared links to Microsoft Sentinel articles still work.
- Articles used to be divided by concepts, how-tos, and tutorials. Now, the articles are organized by lifecycle or scenario with the related concepts, how-tos, and tutorials in those buckets.

We hope these changes to the organization makes your exploration of Microsoft Sentinel documentation more intuitive!

## September 2023

- [Improve SOX compliance with new workbook for SAP](#improve-sox-compliance-with-new-workbook-for-sap)

### Improve SOX compliance with new workbook for SAP

The **SAP Audit Controls workbook** is now provided to you as part of the [Microsoft Sentinel solution for SAP® applications](./sap/solution-overview.md).

This workbook helps you check your SAP® environment's security controls for compliance with your chosen control framework, be it [SOX](https://www.bing.com/search?q=sox+compliance+IT+security&qs=n&form=QBRE&sp=-1&lq=0&pq=sox+compliance+it+security&sc=8-26&sk=&cvid=3ACE338C88CE43368A223D4DB7FC35E6&ghsh=0&ghacc=0&ghpl=), [NIST](https://www.nist.gov/cyberframework/framework), or a custom framework of your choice.

The workbook provides tools for you to assign analytics rules in your environment to specific security controls and control families,  monitor and categorize the incidents generated by the SAP solution-based analytics rules, and report on your compliance.

Learn more about the [**SAP Audit Controls workbook**](./sap/sap-audit-controls-workbook.md).

## August 2023

- [New incident investigation experience is now GA](#new-incident-investigation-experience-is-now-ga)
- [Updated MISP2Sentinel solution utilizes the new upload indicators API.](#updated-misp2sentinel-solution)
- [New and improved entity pages](#new-and-improved-entity-pages)

### New incident investigation experience is now GA

Microsoft Sentinel's comprehensive [incident investigation and case management experience](incident-investigation.md) is now generally available in both commercial and government clouds. This experience includes the revamped incident page, which itself includes displays of the incident's entities, insights, and similar incidents for comparison. The new experience also includes an incident log history and a task list.

Also generally available are the similar incidents widget and the ability to add entities to your threat intelligence list of indicators of compromise (IoCs).

- Learn more about [investigating incidents](investigate-incidents.md) in Microsoft Sentinel.

### Updated MISP2Sentinel solution

The open source threat intelligence sharing platform, MISP, has an updated solution to push indicators to Microsoft Sentinel. This notable solution utilizes the new upload indicators API to take advantage of workspace granularity and align the MISP ingested TI to STIX-based properties.

Learn more about the implementation details from the [MISP blog entry for MISP2Sentinel](https://www.misp-project.org/2023/08/26/MISP-Sentinel-UploadIndicatorsAPI.html/).

### New and improved entity pages

Microsoft Sentinel now provides you enhanced and enriched entity pages and panels, giving you more security information on user accounts, full entity data to enrich your incident context, and a reduction in latency for a faster, smoother experience.

- Read more about these changes in this blog post: [Taking Entity Investigation to the Next Level: Microsoft Sentinel’s Upgraded Entity Pages](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/taking-entity-investigation-to-the-next-level-microsoft-sentinel/ba-p/3878382).

- Learn more about [entities in Microsoft Sentinel](entities.md).

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)
