---
title: Azure Security Center's main dashboard or 'overview' page
description: Learn about the features of the Security Center overview page
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Azure Security Center's overview page

When you open Azure Security Center, the first page to appear is the overview page. 

:::image type="content" source="media/overview-page/overview.png" alt-text="Security Center's overview page":::

Discover and assess the security of your workloads, and identify and mitigate risks, with the Security Center overview page.

The overview provides a unified view into the security posture of your hybrid cloud workloads. Additionally, it shows security alerts, coverage information, and more.


## Features of the overview page

:::image type="content" source="media/overview-page/top-bar-of-overview.png" alt-text="Security Center's overview page's top bar":::

The **top menu bar** offers:
- **Subscriptions** - You can view and filter the list of subscriptions by selecting this button. Security Center will adjust the display to reflect the security posture of the selected subscriptions.
- **What's new** - Opens the [release notes](release-notes.md) so you can keep up to date with new features, bug fixes, and deprecated functionality.
- **High-level numbers** for the connected cloud accounts, to show the context of the information in the main tiles below. As well as the number of active recommendations and alerts.
    Learn more about connecting your [AWS accounts](quickstart-onboard-aws.md) and your [GCP projects](quickstart-onboard-gcp.md).


In the center of the page are **four central tiles**, each linking to a dedicated dashboard for more details:
- **Secure score** - Security Center continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level. [Learn more](secure-score-security-controls.md).
- **Compliance** - Security Center provides insights into your compliance posture based on continuous assessments of your Azure environment. Security Center analyzes risk factors in your hybrid cloud environment according to security best practices. These assessments are mapped to compliance controls from a supported set of standards.[Learn more](security-center-compliance-dashboard.md).
- **Azure Defender** - This is the cloud workload protection platform (CWPP) integrated within Security Center for advanced, intelligent, protection of your Azure and hybrid workloads. The tile shows the coverage of your connected resources (for the currently selected subscriptions) and the recent alerts, color-coded by severity. [Learn more](azure-defender.md).
- **Inventory** - The tile shows the number of unmonitored VMs and a simple barometer of your resources monitored by Security CenterBen . [Learn more](asset-inventory.md).


The **Insights** pane offers customized items for your environment including:
- Your most attacked resources
- Your security controls that have the highest potential to increase your secure score
- The active recommendations with the most resources impacted
- Recent blog posts by Azure Security Center experts

## Next steps

This page introduced the Security Center overview page. For related information, see:

- [Explore and manage your resources with asset inventory and management tools](asset-inventory.md)
- [Secure score in Azure Security Center](secure-score-security-controls.md)