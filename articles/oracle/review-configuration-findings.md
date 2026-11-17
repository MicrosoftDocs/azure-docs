---
title: Review configuration findings and manage checks
titleSuffix: Azure Workload Center for Oracle
description: Learn how to review configuration check results and enable or disable checks for an Oracle workload.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Review configuration findings and manage checks

Use Azure Workload Center for Oracle to review configuration validation findings for a *Workload Virtual Instance (WVI)* or across your workloads. In this article, you learn how to enable or disable checks, investigate deviations, and get resolution steps from the Azure Copilot Run Oracle Agent. You review and apply the recommended changes yourself.

## Enable or disable checks in the configuration template

The configuration template defines which checks run for a WVI.

1.  Open the WVI and select **Workload validation** \> **Configuration template**.

2.  On the **Applicable checks** tab, review the checks that run for this WVI. Each row shows the description, state, type, impact level, and category. The **Not applicable checks** tab lists the checks that don't apply to this workload.

3.  Select one or more checks, and then select **Enable** or **Disable**. Disabled checks don't run in later evaluations.

:::image type="content" source="media/review-configuration-findings/configuration-template-checks.png" alt-text="Screenshot that shows the Configuration template page with the Applicable checks tab and the Enable and Disable buttons." lightbox="media/review-configuration-findings/configuration-template-checks.png":::

## View check results for a WVI

1.  Open the WVI and select **Workload validation** \> **Check results**. The tiles show the resources with deviations, the results by status (Deviation, No Deviation, Failed, Skipped), and the deviations by impact.

:::image type="content" source="media/review-configuration-findings/check-results-list.png" alt-text="Screenshot that shows the Check results page of a WVI with the summary tiles and the list of check results." lightbox="media/review-configuration-findings/check-results-list.png":::

2.  Hover over a check name to see a summary card with the status, impact, resource, and remediation action.

3.  Select the check name, or **View Details** on the card. The page shows the check details, the cause, and the remediation action. **Evaluation run time** is the time of the latest evaluation. The tabs show other resources in the WVI and other WVIs that have the same deviation.

:::image type="content" source="media/review-configuration-findings/check-result-details.png" alt-text="Screenshot that shows the details of a check result with the check details, the cause, and the remediation action." lightbox="media/review-configuration-findings/check-result-details.png":::

## Get resolution steps from the agent

On the detail page of a check result, select **Click here for more suggestions**.

:::image type="content" source="media/review-configuration-findings/resolution-steps-prompt.png" alt-text="Screenshot that shows the Run Oracle Agent pane opened from a check result with a prompt for resolution steps." lightbox="media/review-configuration-findings/resolution-steps-prompt.png":::

Copilot opens the Azure Copilot Run Oracle Agent with a question about that deviation. The agent returns workload-aware resolution steps. You review and apply the changes yourself.

:::image type="content" source="media/review-configuration-findings/resolution-steps-answer.png" alt-text="Screenshot that shows the Run Oracle Agent answer with the resolution steps and the actions it completed." lightbox="media/review-configuration-findings/resolution-steps-answer.png":::

Some pages also show Copilot suggested prompts next to the page title, for example "Identify non-compliant Virtual Instances in my environment". Select a prompt to ask the agent that question.

## View results for all WVIs

1.  In Azure Workload Center for Oracle, select **Workload validation** > **Check results**. Filter by subscription, Virtual Instance, status, and impact.

2.  Select **Configuration templates** to see each template, its number of checks, the WVIs that it covers, and its status.

3.  Select **Configuration checks** to see all checks that are available for Oracle workloads.
