---
title: How to monitor multiple Dynatrace resources with Azure Native Dynatrace Service
description: This article describes how to setup Dynatrace to monitor mulitple subscriptions using the Azure portal. 

ms.topic: how-to
ms.date: 08/27/2024

#CustomerIntent: As a web developer, I want use Dynatrace so that I can MSM.
---
You can now monitor all your subscriptions through a single Dynatrace resource using **Monitored Subscriptions**. Your experience is simplified because you don't have to set up a Dynatrace resource in every subscription that you intend to monitor. You can monitor multiple subscriptions by linking them to a single Dynatrace resource that is tied to a Dynatrace environment. This provides a single pane view for all resources across multiple subscriptions.

1. To manage multiple subscriptions that you want to monitor, select **Monitored Subscriptions** in the **Dynatrace environment configurations** section of the Resource menu.

<!-- ![](media/image1.png){width="6.5in" height="2.1666666666666665in"} -->

1. From **Monitored Subscriptions** in the Resource menu, select the **Add Subscriptions**. The **Add Subscriptions** experience that opens and shows the subscriptions you have *Owner* role assigned to and any Dynatrace resource created in those subscriptions that is already linked to the same Dynatrace environment as the current resource.

1. If the subscription you want to monitor has a resource already linked to the same Dynatrace org, we recommend that you delete the Dynatrace resources to avoid shipping duplicate data and incurring double the charges.

1. Select the subscriptions you want to monitor through the Dynatrace resource and select **Add**.

<!-- ![](media/image2.png){width="6.5in" height="3.375in"} -->

1. If the list doesn't get updated automatically, select **Refresh** to view the subscriptions and their monitoring status. You might see an intermediate status of *In Progress* while a subscription gets added. When the subscription is successfully added, you see the status is updated to **Active**. If a subscription fails to get added, **Monitoring Status** shows as **Failed**.

<!-- \<Screenshot TBD\> -->

The set of tag rules for metrics and logs defined for the Dynatrace resource applies to all subscriptions that are added for monitoring. Setting separate tag rules for different subscriptions isn\'t supported. Diagnostics settings are automatically added to resources in the added subscriptions that match the tag rules defined for the Dynatrace resource.

If you have existing Dynatrace resources that are linked to the account for monitoring, you can end up with duplication of logs that can result in added charges. Ensure you delete redundant Dynatrace resources that are already linked to the account. You can view the list of connected resources and delete the redundant ones. We recommend consolidating subscriptions into the same Dynatrace resource where possible.

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "<verb> * <noun>" format for your H1. Pick an H1 that clearly conveys the task the user will complete.

For example: "Migrate data from regular tables to ledger tables" or "Create a new Azure SQL Database".

* Include only a single H1 in the article.
* Don't start with a gerund.
* Don't include "Tutorial" in the H1.

-->

# "<verb> * <noun>"

TODO: Add your heading

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the customer will do. Answer the fundamental “why would I want to do this?” question. Keep it short.

Readers should have a clear idea of what they will do in this article after reading the introduction.

* Introduction immediately follows the H1 text.
* Introduction section should be between 1-3 paragraphs.
* Don't use a bulleted list of article H2 sections.

Example: In this article, you will migrate your user databases from IBM Db2 to SQL Server by using SQL Server Migration Assistant (SSMA) for Db2.

-->

TODO: Add your introductory paragraph

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.

-->

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1. 

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

TODO: List the prerequisites

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

<!-- ## "\<verb\> * \<noun\>" -->

TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps

1. Step 1
1. Step 2
1. Step 3


<!-- 5. Next step/Related content------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next steps

- [Manage the Dynatrace resource](dynatrace-how-to-manage.md)
- Get started with Azure Native Dynatrace Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Dynatrace.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview)
