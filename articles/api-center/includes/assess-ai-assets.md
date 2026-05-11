
---
title: Assess AI Skills in Your API Center
description: Learn how to enable AI skill assessments in Azure API Center to evaluate the quality of skills in your plugins. 
ms.service: azure-api-center
ms.topic: how-to
ms.date: 05/08/2026

## Assess AI skills (preview)

For skills registered in your API center, API Center can assess skill quality. API Center comes with default skill assessment criteria out of the box, assessing skills across four key dimensions, each scored on a 1–5 scale with a default threshold of 3: 

| Criterion | Description |
|-----------|-------------|
| Documentation clarity | Evaluates how clearly a skill's purpose and behavior are communicated. |
| Help completeness | Assesses whether the output serves as a comprehensive standalone reference. |
| Discoverability | Measures how easily functionality can be navigated and found. |
| Safe usage | Evaluates whether sufficient guidance is provided for safe operation. | 

Enterprise platform administrators can further extend these defaults by defining custom assessment criteria tailored to their organization's specific standards, compliance requirements, and governance policies. 

To enable automated quality assessments of skills in your inventory:

1. In the [Azure portal](https://portal.azure.com), go to your API center.
1. In the sidebar menu. go to **Governance** > **AI Assessment (preview)**.
1. In **Assessment status**, select **Enabled**.
1. Enter a **Description** for the assessment.
1. In **Assessment criteria**, do one of the following:
    - Select the **Default** criteria described previously.

        :::image type="content" source="media/assess-ai-assets/skill-assessment.png" alt-text="Screenshot of Configuration of AI skill assessment in the portal." lightbox="media/assess-ai-assets/skill-assessment.png":::
    - Select **Custom** and then select **+ Add criterion**. 
        1. Provide a **Name** and optional **Assessment instruction** for the criterion.
        1. Enter **Minimum** and **Maximum** values for the score (for example, 1 and 5).
        1. Enter a **Threshold** value (for example, 3) that indicates the minimum acceptable score for the criterion.
        1. Enter a **Weight** value that indicates the contribution of the criterion to the total assessment (for example, a weight of 0.3 multiples the score by 0.3, contributing 30% to the total assessment).
        1. Optionally, add one or more **Score descriptions** to describe what each level of the score represents.
        1. Repeat the preceding steps to add more criteria as needed.
1. Select **Save**.

You can then view assessment results for each skill on the skill details page in the API Center portal. 

:::image type="content" source="media/assess-ai-assets/assessment-in-portal.png" alt-text="Screenshot of skill assessment in the API Center portal." lightbox="media/assess-ai-assets/assessment-in-portal.png":::