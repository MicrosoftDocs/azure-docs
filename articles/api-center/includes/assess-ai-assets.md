---
title: Assess AI Assets in Your API Center
description: Learn how to enable AI skill assessments in Azure API Center to evaluate the quality of skills in your plugins. 
ms.service: azure-api-center
ms.topic: include
ms.date: 06/01/2026
ms.author: danlep
author: dlepow
ms.collection: ce-skilling-ai-copilot
---

## Assess AI assets (preview)

API Center can assess the quality of AI assets such as skills and agents registered in your API center. API Center comes with default assessment criteria out of the box, assessing assets across predefined dimensions. Enterprise platform administrators can further extend these defaults by defining custom assessment criteria tailored to their organization's specific standards, compliance requirements, and governance policies. 

To enable automated assessments of AI assets in your inventory:

1. In the [Azure portal](https://portal.azure.com), go to your API center.
1. In the sidebar menu. go to **Governance** > **AI Assessment (preview)**.
1. Select the **Skills** tab to configure assessments for skills, or select the **Agents** tab to configure assessments for agents.
1. In **Assessment status**, select **Enabled**.
1. Enter a **Description** for the assessment.
1. In **Assessment criteria**, do one of the following:
    - Accept the **Default** criteria provided by API Center. Optionally remove default criteria that aren't relevant for your organization. 
    
    The following screenshot shows default criteria for skills:

    :::image type="content" source="media/assess-ai-assets/skill-assessment.png" alt-text="Screenshot of configuration of AI skill assessment in the portal." lightbox="media/assess-ai-assets/skill-assessment.png":::
    - Add one or more custom criteria.
        1. Select **+ Add criteria**. 
        1. Enter a **Name** and optional **Assessment instruction** for the criterion.
        1. Enter **Minimum score** and **Maximum score** values for the score (for example, 1 and 5).
        1. Enter a **Pass threshold** value (for example, 3) that indicates the minimum acceptable score for the criterion.
        1. Enter a **Weight** value that indicates the contribution of the criterion to the total assessment (for example, a weight of 0.3 multiples the score by 0.3, contributing 30% to the total assessment).
        1. Repeat the preceding steps to add more criteria as needed.
1. Select **Save**.

You can then view assessment results in the API Center portal. For example, view assessment results for each skill on the skill details page.

:::image type="content" source="media/assess-ai-assets/assessment-in-portal.png" alt-text="Screenshot of skill assessment in the API Center portal." lightbox="media/assess-ai-assets/assessment-in-portal.png":::