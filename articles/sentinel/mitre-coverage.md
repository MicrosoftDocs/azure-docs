---
title: View MITRE coverage for your organization from Microsoft Sentinel | Microsoft Docs
description: Learn how to view coverage indicator in Microsoft Sentinel for MITRE tactics that are currently covered, and available to configure, for your organization.
author: batamig
ms.topic: how-to
ms.date: 12/21/2021
ms.author: bagol
---

# Understand security coverage by the MITRE ATT&CK® framework

[MITRE ATT&CK](https://attack.mitre.org/#) is a publicly accessible knowledge base of tactics and techniques that are commonly used by attackers, and is created and maintained by observing real-world observations. Many organizations use the MITRE ATT&CK knowledge base to develop specific threat models and methodologies to use when verifying security in their environments.

Microsoft Sentinel analyzes ingested data, not only to surface alerts and help you investigate, but also to display your overall security coverage and highlight additional configurations for you to enhance that security coverage.

This article describes how to use the MITRE coverage page in Microsoft Sentinel to view and enhance security coverage in your organization using the tactics and techniques from the MITRE ATT&CK® framework.

##  View current MITRE coverage

In Microsoft Sentinel, in the **General** menu on the left, select **MITRE**. By default, both currently active scheduled query and NRT rules are displayed in the coverage matrix.

- Use the legend on the right to understand how many products are indicated for a specific technique.

- Use the search bar on the left to search for a specific technique in the matrix, using the technique name or ID.

- Select a specific technique in the matrix to view more details on the right. There, use the links to jump to any of the following locations:

    - Select **View technique details** for more information about the selected technique in the MITRE ATT&CK framework knowledge base.
    - Select links to any of the active products to jump to those items inside Microsoft Sentinel.

For example:

:::image type="content" source="media/mitre-coverage/current-coverage.png" alt-text="Screenshot of current MITRE coverage with the Drive-by Compromise technique details displayed.":::

## View available configurations for simulated coverage

In the MITRE coverage matrix, *simulated* coverage refers to security coverage for your environment that's possible to configure using Microsoft Sentinel, but currently is not configured.

Use this 