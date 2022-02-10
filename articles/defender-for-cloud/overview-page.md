---
title: Microsoft Defender for Cloud's main dashboard or 'overview' page
description: Learn about the features of the Defender for Cloud overview page
ms.date: 11/09/2021
ms.topic: overview
---

# Microsoft Defender for Cloud's overview page

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

When you open Microsoft Defender for Cloud, the first page to appear is the overview page.

This interactive dashboard provides a unified view into the security posture of your hybrid cloud workloads. Additionally, it shows security alerts, coverage information, and more.

You can select any element on the page to get more detailed information.

:::image type="content" source="./media/overview-page/overview.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview.png":::

## Features of the overview page

:::image type="content" source="./media/overview-page/top-bar-of-overview.png" alt-text="Screenshot of Defender for Cloud's overview page's top bar.":::

### Metrics

The **top menu bar** offers:

- **Subscriptions** - You can view and filter the list of subscriptions by selecting this button. Defender for Cloud will adjust the display to reflect the security posture of the selected subscriptions.
- **What's new** - Opens the [release notes](release-notes.md) so you can keep up to date with new features, bug fixes, and deprecated functionality.
- **High-level numbers** for the connected cloud accounts, to show the context of the information in the main tiles below. As well as the number of assessed resources, active recommendations, and security alerts. Select the assessed resources number to access [Asset inventory](asset-inventory.md). Learn more about connecting your [AWS accounts](quickstart-onboard-aws.md) and your [GCP projects](quickstart-onboard-gcp.md).

### Feature tiles

In the center of the page are the **feature tiles**, each linking to a high profile feature or dedicated dashboard:

- **Secure score** - Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level. [Learn more](secure-score-security-controls.md).
- **Workload protections** - This is the cloud workload protection platform (CWPP) integrated within Defender for Cloud for advanced, intelligent protection of your workloads running on Azure, on-premises machines, or other cloud providers. For each resource type, there's a corresponding Microsoft Defender plan. The tile shows the coverage of your connected resources (for the currently selected subscriptions) and the recent alerts, color-coded by severity. Learn more about [the enhanced security features](enhanced-security-features-overview.md).
- **Regulatory compliance** - Defender for Cloud provides insights into your compliance posture based on continuous assessments of your Azure environment. Defender for Cloud analyzes risk factors in your environment according to security best practices. These assessments are mapped to compliance controls from a supported set of standards. [Learn more](regulatory-compliance-dashboard.md).
- **Firewall Manager** - This tile shows the status of your hubs and networks from [Azure Firewall Manager](../firewall-manager/overview.md).
- **Inventory** - The asset inventory page of Microsoft Defender for Cloud provides a single page for viewing the security posture of the resources you've connected to Microsoft Defender for Cloud. All resources with unresolved security recommendations are shown in the inventory. If you've enabled the integration with Microsoft Defender for Endpoint and enabled Microsoft Defender for servers, you'll also have access to a software inventory. The tile on the overview page shows you at a glance the total healthy and unhealthy resources (for the currently selected subscriptions). [Learn more](asset-inventory.md).
- **Information protection** - A graph on this tile shows the resource types that have been scanned by [Azure Purview](../purview/overview.md), found to contain sensitive data, and have outstanding recommendations and alerts. Follow the **scan** link to access the Azure Purview accounts and configure new scans, or select any other part of the tile to open the [asset inventory](asset-inventory.md) and view your resources according to your Azure Purview data sensitivity classifications. [Learn more](information-protection.md).

### Insights

The **Insights** pane offers customized items for your environment including:

- Your most attacked resources
- Your [security controls](secure-score-security-controls.md) that have the highest potential to increase your secure score
- The active recommendations with the most resources impacted
- Recent blog posts by Microsoft Defender for Cloud experts

## Next steps

This page introduced the Defender for Cloud overview page. For related information, see:

- [Explore and manage your resources with asset inventory and management tools](asset-inventory.md)
- [Secure score in Microsoft Defender for Cloud](secure-score-security-controls.md)
