---
title: View MITRE coverage for your organization from Microsoft Sentinel | Microsoft Docs
description: Learn how to view coverage indicator in Microsoft Sentinel for MITRE tactics that are currently covered, and available to configure, for your organization.
author: batamig
ms.topic: how-to
ms.date: 12/21/2021
ms.author: bagol
---

# Understand security coverage by the MITRE ATT&CK® framework

[MITRE ATT&CK](https://attack.mitre.org/#) is a publicly accessible knowledge base of tactics and techniques that are commonly used by attackers, and is created and maintained by observing real-world observations. Many organizations use the MITRE ATT&CK knowledge base to develop specific threat models and methodologies that are used to verify security status in their environments.

Microsoft Sentinel analyzes ingested data, not only to [detect threats](detect-threats-built-in.md) help you [investigate](investigate-cases.md), but also to visualize the nature and coverage of your organization's security status.

This article describes how to use the MITRE page in Microsoft Sentinel to view and enhance security coverage in your organization using the tactics and techniques from the MITRE ATT&CK® framework.

##  View current MITRE coverage

In Microsoft Sentinel, in the **General** menu on the left, select **MITRE**. By default, both currently active scheduled query and NRT rules are displayed in the coverage matrix.

- Use the legend on the right to understand how many items are highlighted for a specific technique, currently strengthening your organization's security status.

- Use the search bar on the left to search for a specific technique in the matrix, using the technique name or ID. For example, you may want to understand how your organization's security status for a specific technique.

- Select a specific technique in the matrix to view more details on the right. There, use the links to jump to any of the following locations:

    - Select **View technique details** for more information about the selected technique in the MITRE ATT&CK framework knowledge base.

    - Select links to any of the active items to jump to the relevant area in Microsoft Sentinel.

For example:

:::image type="content" source="media/mitre-coverage/current-coverage.png" alt-text="Screenshot of current MITRE coverage with the Drive-by Compromise technique details displayed.":::

When you have the [Microsoft Defender for IoT](data-connectors-reference.md#microsoft-defender-for-iot) data connector connected, two additional columns are displayed, for <x> and <y>.
## View available configurations for simulated coverage

In the MITRE coverage matrix, *simulated* coverage refers to security coverage for your environment that's possible to configure using Microsoft Sentinel, but currently is not configured.

Select items in the **Simulate** menu to highlight additional content you can configure in your Microsoft Sentinel workspace, such as analytics rules or hunting queries, to enhance your organization's security.


- Use the legend on the right to understand how many items are available for you to configure.

- Select a specific technique in the matrix to view more details on the right. There, use the links to jump to any of the following locations:

    - Select **View technique details** for more information about the selected technique in the MITRE ATT&CK framework knowledge base.

    - Select links to any of the simulation items to jump to the relevant area in Microsoft Sentinel.

For example:

TBD

When you have the [Microsoft Defender for IoT](data-connectors-reference.md#microsoft-defender-for-iot) data connector connected, two additional columns are displayed, for *Inhibit Response Function* and *Impair Process Control*.

## Use the MITRE ATT&CK framework in analytics rules and incidents

Having a scheduled rule with MITRE techniques applied running regularly in your Microsoft Sentinel workspace enhances the security status calculated for your organization in the MITRE coverage matrix.

- When configuring analytics rules, select specific MITRE techniques to apply to your rule.

    For example:

    <!--TBD - and also add this in the other procedures-->

- When searching for analytics rules, filter the rules displayed by technique to find your rules quicker.

- When incidents are created for alerts that are surfaced by rules with MITRE techniques configured, the techniques are also added to the incidents. For example:

    <!--TBD -- >

For more information, see [Detect threats out-of-the-box](detect-threats-built-in.md), [Create custom analytics rules to detect threats](detect-threats-custom.md), and [Investigate incidents with Microsoft Sentinel](investigate-cases.md).
