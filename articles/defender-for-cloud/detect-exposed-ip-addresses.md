---
title: Detect internet exposed IP addresses
description: Learn how to detect exposed IP addresses with cloud security explorer in Microsoft Defender for Cloud to proactively identify security risks.
ms.topic: how-to
ms.date: 07/03/2024
ms.author: dacurwin
author: dcurwin
ai-usage: ai-assisted
#customer intent: As a security professional, I want to learn how to detect exposed IP addresses with cloud security explorer in Microsoft Defender for Cloud so that I can proactively identify security risks in my cloud environment and improve my security posture.
---

# Detect internet exposed IP addresses

Microsoft Defender for Cloud's provides organizations the capability to perform external attack surface management  (outside-in) scans to improve their security posture through its integration with Defender External Attack Surface Management. Defender for Cloud's external attack surface management scans uses the information provided by the Defender External Attack Surface Management integration to provide actionable recommendations and visualizations of attack paths to reduce the risk of bad actors exploiting internet exposed IP addresses. 

Through the use Defender for Cloud's cloud security explorer, security teams can build queries and proactively hunt for security risks. Security teams can also use the attack path analysis to visualize the potential attack paths that an attacker could use to reach their critical assets. 

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable the Defender Cloud Security Posture Management (CSPM) plan](tutorial-enable-cspm-plan.md).

## Detect internet exposed IP addresses with the cloud security explorer

The cloud security explorer allows you to build queries, such as an outside-in scan, that can proactively hunt for security risks in your environments, including IP addresses that are exposed to the internet. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Cloud security explorer**.

1. In the dropdown menu, search for and select **IP addresses**.

    :::image type="content" source="media/detect-exposed-ip-addresses/search-ip-addresses.png" alt-text="Screenshot that shows where to navigate to in Defender for Cloud to search for and select the IP addresses option." lightbox="media/detect-exposed-ip-addresses/search-ip-addresses.png":::

1. Select **Done**.

1. Select **+**.

1. In the select condition dropdown menu, select **DEASM Findings**.

    :::image type="content" source="media/detect-exposed-ip-addresses/deasm-findings.png" alt-text="Screenshot that shows where to locate the DEASM Findings option." lightbox="media/detect-exposed-ip-addresses/deasm-findings.png":::

1. Select the **+** button.

1. In the select condition dropdown menu, select **Routes traffic to**.

1. In the select resource type dropdown menu, select **Select all**.

    :::image type="content" source="media/detect-exposed-ip-addresses/select-all.png" alt-text="Screenshot that shows where the select all option is located." lightbox="media/detect-exposed-ip-addresses/select-all.png":::

1. Select **Done**.

1. Select the **+** button.

1. In the select condition dropdown menu, select **Routes traffic to**.

1. In the select resource type dropdown menu, select **Virtual machine**.

1. Select **Done**.

1. Select **Search**.

    :::image type="content" source="media/detect-exposed-ip-addresses/search-results.png" alt-text="Screenshot that shows the fully built query and where the search button is located." lightbox="media/detect-exposed-ip-addresses/search-results.png":::

1. Select a result to review the findings.

## Detect exposed IP addresses with attack path analysis

Using the attack path analysis, you can view a visualization of the attack paths that an attacker could use to reach your critical assets.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud** > **Attack path analysis**.

1. Search for **Internet exposed**.

1. Review and select a result.

1. [Remediate the attack path](how-to-manage-attack-path.md#remediate-attack-paths).

## Next step

> [!div class="nextstepaction"]
> [Identify and remediate attack paths](how-to-manage-attack-path.md)
