---
title: Monitor Azure Private 5G Core with alerts
description: Guide to creating alerts for packet cores
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 09/14/2023

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a How-to article pattern. See the
[instructions - How-to](../level4/article-how-to-guide.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

How-to is a procedure-based article pattern that show the user how to complete a task in their own environment. A task is a work activity that has a definite beginning and ending, is observable, consist of two or more definite steps, and leads to a product, service, or decision.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "<verb> * <noun>" format for your H1. Pick an H1 that clearly conveys the task the user will complete.

For example: "Migrate data from regular tables to ledger tables" or "Create a new Azure SQL Database".

* Include only a single H1 in the article.
* Don't start with a gerund.
* Don't include "Tutorial" in the H1.

-->

# "Create alerts to track performance of packet cores"

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the customer will do. Answer the fundamental “why would I want to do this?” question. Keep it short.

Readers should have a clear idea of what they will do in this article after reading the introduction.

* Introduction immediately follows the H1 text.
* Introduction section should be between 1-3 paragraphs.
* Don't use a bulleted list of article H2 sections.

Example: In this article, you will migrate your user databases from IBM Db2 to SQL Server by using SQL Server Migration Assistant (SSMA) for Db2.

-->

In this article, you will create an alert for a packet core control/data plane.

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.

-->

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1. 

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

1. Have a packet core control/data plane created correctly
2. Navigate to the packet core control/data plane you want to create an alert for:
  - You can do this by searching for it under **All resources** or from the **Overview** page of the site that contains the packet core you want to add alerts for.

<!-- 4. Task H2s ------------------------------------------------------------------------------

Required: Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a task. Each section is represented as an H2 in the article.

For portal-based procedures, minimize bullets and numbering.

* Each H2 should be a major step in the task.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->

## "Create an alert rule for your packet core control/data plane"
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Navigate to the packet core control/data plane you want to create an alert for:
  - You can do this by searching for it under **All resources** or from the **Overview** page of the site that contains the packet core you want to add alerts for.
1. Select **Alerts** from the **Monitoring** tab on the resource menu.

      :::image type="content" source="alert1.png" alt-text="Screenshot of Azure portal showing packet core control/data plane resource menu.":::

1. Select **Alert Rule** from the **Create** dropdown at the top of the page.

      :::image type="content" source="alert2.png" alt-text="Screenshot of Azure portal showing alerts menu with the create dropdown menu open.":::

1. Select **See all signals** just under the dropdown menu or from inside the dropdown menu.

      :::image type="content" source="alert3.png" alt-text="Screenshot of Azure portal showing alert signal selection menu.":::

1. Select the signal you want the alert to be based on and follow the rest of the create instructions.

<!-- 5. Next step/Related content------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->