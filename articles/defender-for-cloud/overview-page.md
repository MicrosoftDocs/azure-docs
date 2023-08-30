---
title: Main overview page
description: Learn about the features of the Defender for Cloud overview page
ms.date: 07/20/2023
ms.topic: conceptual
ms.custom: ignite-2022
---

# Microsoft Defender for Cloud's overview page

Microsoft Defender for Cloud's overview page is an interactive dashboard that provides a unified view into the security posture of your hybrid cloud workloads. Additionally, it shows security alerts, coverage information, and more.  

You can select any element on the page to get more detailed information.

:::image type="content" source="./media/overview-page/overview-07-2023.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview-07-2023.png":::

## Features of the overview page

:::image type="content" source="./media/overview-page/top-bar-of-overview-new.png" alt-text="Screenshot of Defender for Cloud's overview page's top bar." lightbox="media/overview-page/top-bar-of-overview-new.png":::

### Metrics

The **top menu bar** offers:

- **Subscriptions** - You can view and filter the list of subscriptions by selecting this button. Defender for Cloud will adjust the display to reflect the security posture of the selected subscriptions.
- **What's new** - Opens the [release notes](release-notes.md) so you can keep up to date with new features, bug fixes, and deprecated functionality.
- **High-level numbers** for the connected cloud accounts, showing the context of the information in the main tiles, and the number of assessed resources, active recommendations, and security alerts. Select the assessed resources number to access [Asset inventory](asset-inventory.md). Learn more about connecting your [AWS accounts](quickstart-onboard-aws.md) and your [GCP projects](quickstart-onboard-gcp.md).

### Feature tiles

The center of the page displays the **feature tiles**, each linking to a high profile feature or dedicated dashboard:

- **Security posture** - Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can understand, at a glance, your current security situation: the higher the score, the lower the identified risk level. [Learn more](secure-score-security-controls.md).
- **Workload protections** - This is the cloud workload protection platform (CWPP) integrated within Defender for Cloud for advanced, intelligent protection of your workloads running on Azure, on-premises machines, or other cloud providers. For each resource type, there's a corresponding Microsoft Defender plan. The tile shows the coverage of your connected resources (for the currently selected subscriptions) and the recent alerts, color-coded by severity. Learn more about [the Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
- **Regulatory compliance** - Defender for Cloud provides insights into your compliance posture based on continuous assessments of your Azure environment. Defender for Cloud analyzes risk factors in your environment according to security best practices. These assessments are mapped to compliance controls from a supported set of standards. [Learn more](regulatory-compliance-dashboard.md).
- **Inventory** - The asset inventory page of Microsoft Defender for Cloud provides a single page for viewing the security posture of the resources you've connected to Microsoft Defender for Cloud. All resources with unresolved security recommendations are shown in the inventory. If you've enabled the integration with Microsoft Defender for Endpoint and enabled Microsoft Defender for Servers, you'll also have access to a software inventory. The tile on the overview page shows you at a glance the total healthy and unhealthy resources (for the currently selected subscriptions). [Learn more](asset-inventory.md).

### Insights

The **Insights** pane offers customized items for your environment including:

- Actionable items to enhance your security.
- Tips to handle alerts and recommendations.
- Recommendations on how to to upgrade your service to enhance your environments protections.
- Recent blog posts by Microsoft Defender for Cloud experts.

## Next steps

This page introduced the Defender for Cloud overview page. For related information, see:

- [Explore and manage your resources with asset inventory and management tools](asset-inventory.md)
- [Secure score in Microsoft Defender for Cloud](secure-score-security-controls.md)
