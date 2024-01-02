---
title: Review cloud security posture in Microsoft Defender for Cloud
description: Learn about cloud security posture in Microsoft Defender for Cloud
ms.date: 11/02/2023
ms.topic: conceptual
---

# Review cloud security posture 

Microsoft Defender for Cloud provides a unified view into the security posture of hybrid cloud workloads with the 
interactive **Overview** dashboard. Select any element on the dashboard to get more information.

:::image type="content" source="./media/overview-page/overview-07-2023.png" alt-text="Screenshot of Defender for Cloud's overview page." lightbox="./media/overview-page/overview-07-2023.png":::

## Metrics


The **top menu bar** offers:

- **Subscriptions** - You can view and filter the list of subscriptions by selecting this button. Defender for Cloud will adjust the display to reflect the security posture of the selected subscriptions.
- **What's new** - Opens the [release notes](release-notes.md) so you can keep up to date with new features, bug fixes, and deprecated functionality.
- **High-level numbers** for the connected cloud accounts, showing the context of the information in the main tiles, and the number of assessed resources, active recommendations, and security alerts. Select the assessed resources number to access [Asset inventory](asset-inventory.md). Learn more about connecting your [AWS accounts](quickstart-onboard-aws.md) and your [GCP projects](quickstart-onboard-gcp.md).

:::image type="content" source="./media/overview-page/top-bar-of-overview-new.png" alt-text="Screenshot of Defender for Cloud's overview page's top bar." lightbox="media/overview-page/top-bar-of-overview-new.png":::

## Feature tiles

The center of the page displays the **feature tiles**, each linking to a high profile feature or dedicated dashboard:

- **Security posture** - Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can understand, at a glance, your current security situation: the higher the score, the lower the identified risk level. [Learn more](secure-score-security-controls.md).
- **Workload protections** - This is the cloud workload protection platform (CWPP) integrated within Defender for Cloud for advanced, intelligent protection of your workloads running on Azure, on-premises machines, or other cloud providers. For each resource type, there's a corresponding Microsoft Defender plan. The tile shows the coverage of your connected resources (for the currently selected subscriptions) and the recent alerts, color-coded by severity. Learn more about [the Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
- **Regulatory compliance** - Defender for Cloud provides insights into your compliance posture based on continuous assessments of your Azure environment. Defender for Cloud analyzes risk factors in your environment according to security best practices. These assessments are mapped to compliance controls from a supported set of standards. [Learn more](regulatory-compliance-dashboard.md).
- **Inventory** - The asset inventory page of Microsoft Defender for Cloud provides a single page for viewing the security posture of the resources you've connected to Microsoft Defender for Cloud. All resources with unresolved security recommendations are shown in the inventory. If you've enabled the integration with Microsoft Defender for Endpoint and enabled Microsoft Defender for Servers, you'll also have access to a software inventory. The tile on the overview page shows you at a glance the total healthy and unhealthy resources (for the currently selected subscriptions). [Learn more](asset-inventory.md).

## Insights

The **Insights** pane offers customized items for your environment including:

- Actionable items to enhance your security.
- Tips to handle alerts and recommendations.
- Recommendations on how to upgrade your service to enhance your environments protections.
- Recent blog posts by Microsoft Defender for Cloud experts.

## Next steps

- [Learn more](concept-cloud-security-posture-management.md) about cloud security posture management.
- [Learn more](security-policy-concept.md) about security standards and
- [Review your asset inventory](asset-inventory.md)

