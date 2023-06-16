---
title: View MITRE coverage for your organization from Microsoft Sentinel | Microsoft Docs
description: Learn how to view coverage indicator in Microsoft Sentinel for MITRE tactics that are currently covered, and available to configure, for your organization.
author: austinmccollum
ms.topic: how-to
ms.date: 12/21/2021
ms.author: austinmc
---

# Understand security coverage by the MITRE ATT&CK® framework

> [!IMPORTANT]
> The MITRE page in Microsoft Sentinel is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[MITRE ATT&CK](https://attack.mitre.org/#) is a publicly accessible knowledge base of tactics and techniques that are commonly used by attackers, and is created and maintained by observing real-world observations. Many organizations use the MITRE ATT&CK knowledge base to develop specific threat models and methodologies that are used to verify security status in their environments.

Microsoft Sentinel analyzes ingested data, not only to [detect threats](detect-threats-built-in.md) and help you [investigate](investigate-cases.md), but also to visualize the nature and coverage of your organization's security status.

This article describes how to use the **MITRE** page in Microsoft Sentinel to view the detections already active in your workspace, and those available for you to configure, to understand your organization's security coverage, based on the tactics and techniques from the MITRE ATT&CK® framework.

:::image type="content" source="media/mitre-coverage/mitre-coverage.png" alt-text="Screenshot of the MITRE coverage page with both active and simulated indicators selected.":::

Microsoft Sentinel is currently aligned to The MITRE ATT&CK framework, version 11.

##  View current MITRE coverage

In Microsoft Sentinel, in the **Threat management** menu on the left, select **MITRE**. By default, both currently active scheduled query and near real-time (NRT) rules are indicated in the coverage matrix.

- **Use the legend at the top-right** to understand how many detections are currently active in your workspace for specific technique.

- **Use the search bar at the top-left** to search for a specific technique in the matrix, using the technique name or ID, to view your organization's security status for the selected technique.

- **Select a specific technique** in the matrix to view more details on the right. There, use the links to jump to any of the following locations:

    - Select **View technique details** for more information about the selected technique in the MITRE ATT&CK framework knowledge base.

    - Select links to any of the active items to jump to the relevant area in Microsoft Sentinel.

## Simulate possible coverage with available detections

In the MITRE coverage matrix, *simulated* coverage refers to detections that are available, but not currently configured, in your Microsoft Sentinel workspace. View your simulated coverage to understand your organization's possible security status, were you to configure all detections available to you.

In Microsoft Sentinel, in the **General** menu on the left, select **MITRE**.

Select items in the **Simulate** menu to simulate your organization's possible security status.

- **Use the legend at the top-right** to understand how many detections, including analytics rule templates or hunting queries, are available for you to configure.

- **Use the search bar at the top-left** to search for a specific technique in the matrix, using the technique name or ID, to view your organization's simulated security status for the selected technique.

- **Select a specific technique** in the matrix to view more details on the right. There, use the links to jump to any of the following locations:

    - Select **View technique details** for more information about the selected technique in the MITRE ATT&CK framework knowledge base.

    - Select links to any of the simulation items to jump to the relevant area in Microsoft Sentinel.

    For example, select **Hunting queries** to jump to the **Hunting** page. There, you'll see a filtered list of the hunting queries that are associated with the selected technique, and available for you to configure in your workspace.

## Use the MITRE ATT&CK framework in analytics rules and incidents

Having a scheduled rule with MITRE techniques applied running regularly in your Microsoft Sentinel workspace enhances the security status shown for your organization in the MITRE coverage matrix.

- **Analytics rules**:

    - When configuring analytics rules, select specific MITRE techniques to apply to your rule.
    - When searching for analytics rules, filter the rules displayed by technique to find your rules quicker.

    For more information, see [Detect threats out-of-the-box](detect-threats-built-in.md) and [Create custom analytics rules to detect threats](detect-threats-custom.md).

- **Incidents**:

    When incidents are created for alerts that are surfaced by rules with MITRE techniques configured, the techniques are also added to the incidents.

    For more information, see [Investigate incidents with Microsoft Sentinel](investigate-cases.md).

- **Threat hunting**:

    - When creating a new hunting query, select the specific tactics and techniques to apply to your query.
    - When searching for active hunting queries, filter the queries displayed by tactics by selecting an item from the list above the grid. Select a query to see tactic and technique details on the right.
    - When creating bookmarks, either use the technique mapping inherited from the hunting query, or create your own mapping.

    For more information, see [Hunt for threats with Microsoft Sentinel](hunting.md) and [Keep track of data during hunting with Microsoft Sentinel](bookmarks.md).

## Next steps

For more information, see:

- [MITRE | ATT&CK framework](https://attack.mitre.org/)
- [MITRE ATT&CK for Industrial Control Systems](https://www.mitre.org/news-insights/news-release/mitre-releases-framework-cyber-attacks-industrial-control-systems)
