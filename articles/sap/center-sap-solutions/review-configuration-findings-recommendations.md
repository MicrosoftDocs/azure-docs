---
title: Review configuration findings - Azure Workload Center for SAP
description: Learn how to review configuration findings in Azure Workload Center for SAP and fix deviations with guided Copilot remediation steps.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Review configuration findings and recommendations

## Enable or disable checks by using WVI check templates

Templates define the scope of checks applied to a workload.

- In the **Workload Virtual Instances** option, select your desired WVI.  
:::image type="content" source="media/review-configuration-findings-recommendations/workload-virtual-instances-list-view.png" lightbox="media/review-configuration-findings-recommendations/workload-virtual-instances-list-view.png" alt-text="Screenshot of Workload Virtual Instances list showing CALDOVA_ZP1 with Completed state and HighAvailability type.":::

<!-- -->

- Click on Configuration template option in that WVI, and it shall show the Applicable checks for this WVI. There is also a tab on top if you want to check for non-applicable checks for this WVI.  
:::image type="content" source="media/review-configuration-findings-recommendations/configuration-template-applicable-checks.png" lightbox="media/review-configuration-findings-recommendations/configuration-template-applicable-checks.png" alt-text="Screenshot of Azure configuration template showing applicable checks list with impact levels and categories.":::

- Review the list of all checks. Use the options bar to enable or disable checks. The disabled checks don't run in future runs.

:::image type="content" source="media/review-configuration-findings-recommendations/configuration-template-disable-checks.png" lightbox="media/review-configuration-findings-recommendations/configuration-template-disable-checks.png" alt-text="Screenshot of Azure configuration template showing Disable checks dialog with two selected network checks.":::

## View check run results

The Azure Workload Center for SAP service automatically runs all configuration checks. Results include deviation and no-deviation statuses, drift details, and recommended actions. You can view results per component or for the entire workload. In the portal, results appear under **Configuration Validation** > **Check results**. Through Copilot, the agent can summarize drifts, filter issues by impact, or create remediation plans.

These results are available as part of virtual instance.

:::image type="content" source="media/review-configuration-findings-recommendations/check-results-deviation-status-view.png" lightbox="media/review-configuration-findings-recommendations/check-results-deviation-status-view.png" alt-text="Screenshot of Azure Check results page showing deviation status, impact, and category for SAP workload checks.":::

When you select the resolution for each check, Copilot opens and provides the steps to remediate the deviation.
