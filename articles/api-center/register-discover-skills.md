---
title: Register Skills in Your API Center
description: Learn how to register skills in Azure API Center to create a centralized skills registry for your organization. 
ms.service: azure-api-center
ms.topic: how-to
ms.date: 05/05/2026
ai-usage: ai-assisted


ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
# Customer intent: As an API program manager, I want to register skills in my API Center inventory so developers can discover and use them.
ms.custom:
---

# Register and discover skills in your API inventory

This article describes how to use Azure API Center to register agent [skills](https://agentskills.io/home) as part of your API inventory. Skills are reusable capabilities that AI agents can discover and consume to extend their functionality.

By registering skills in your API center, you create a centralized registry that helps your organization:

- Discover available skills and their capabilities
- Access source code and documentation for the skills

## Prerequisites

- An API center. If you don't have an API center yet, see the quickstart to [Create an API center](set-up-api-center.md).
- One or more skills that you want to register, typically hosted in a source code repository such as GitHub.

## Register a skill

To register a skill in your API center:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API center.
1. In the sidebar menu, under **Inventory**, select **Assets**.
1. Select **+ Register an asset** > **Skill**.

    :::image type="content" source="media/register-discover-skills/register-skill.png" alt-text="Screenshot of registering a skill in the portal.":::
1. In the **Register a skill** form, provide the information in the following table:

    | Field | Description |
    |-------|-------------|
    | **Title** | Enter a descriptive name for the skill (for example, *Code Review Skill*). |
    | **Identification** | API Center automatically generates an identifier based on the title (for example, *code-review-skill*). You can edit this if needed. |
    | **Summary** | Provide a brief one-line description of what the skill does (for example, *Performs automated code reviews using static analysis*). |
    | **Description** | Enter a more detailed description of the skill's capabilities, use cases, and behavior. |
    | **Lifecycle stage** | Select the current stage of the skill's lifecycle from the dropdown menu. |
    | **Source** | |
    | **Source URL** | Enter the Git repository URL for the skill source code (for example, `https://github.com/<org>/<repo>/tree/main/skills/<skill-name>`). |
    | **Compatibility** | Describe the requirements, dependencies, and prerequisites for using the skill (for example, required software or tools like git, docker, programming languages; system requirements; network access requirements; API keys or authentication requirements). |
    | **Allowed tools** | Select **+ Add tool** to specify the APIs or MCP servers from your API inventory that this skill can access. This approach helps ensure proper governance and security by explicitly defining what resources the skill can consume. |
    | **License** | Select **+ Add** to provide licensing information. Enter the license name (for example, *MIT*, *Apache 2.0*, or *Proprietary*), optionally provide a license URL, and add a description if needed to clarify licensing terms or restrictions. |
    | **Contact information** | Select **+ Add** to add contact points for support or inquiries. Enter a contact name or role (for example, *API Team* or *John Smith*), provide contact details such as email address, and optionally add a description to clarify when and why to contact this person or team. |

1. Select **Create** to register the skill in your API center.

After registration, the skill appears in your inventory on the **Inventory** > **Assets** page.

## Update a registered skill

You can update skill information at any time:

1. In your API center, go to **Inventory** > **Assets**.
1. Find and select the skill you want to update.
1. Select **Edit** to modify the skill's properties.
1. Make your changes and select **Save**.

## Synchronize skills from a Git repository

To automate skill registration and keep your inventory up to date, you can integrate a Git repository with your API center. For more information, see [Synchronize API assets from a Git repo](synchronize-assets-git.md).

## Discover skills in the API Center portal

Set up your [API Center portal](set-up-api-center-portal.md) so that developers and other stakeholders in your organization can discover skills in your API inventory. From the API Center portal, users can:

* Browse and filter skills in the inventory.
* View detailed information about each skill.

## Assess AI skills (preview)

API Center comes with default skill assessment criteria out of the box, evaluating skills across four key dimensions, each scored on a 1–5 scale with a default threshold of 3: 

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

        :::image type="content" source="media/register-discover-skills/skill-assessment.png" alt-text="Screenshot of Configuration of AI skill assessment in the portal." lightbox="media/register-discover-skills/skill-assessment.png":::
    - Select **Custom** and then select **+ Add criterion**. 
        1. Provide a **Name** and optional **Assessment instruction** for the criterion.
        1. Enter **Minimum** and **Maximum** values for the score (for example, 1 and 5).
        1. Enter a **Threshold** value (for example, 3) that indicates the minimum acceptable score for the criterion.
        1. Enter a **Weight** value that indicates the contribution of the criterion to the total assessment (for example, a weight of 0.3 multiples the score by 0.3, contributing 30% to the total assessment).
        1. Optionally, add one or more **Score descriptions** to describe what each level of the score represents.
        1. Repeat the preceding steps to add more criteria as needed.
1. Select **Save**.

You can then view assessment results for each skill on the skill details page in the API Center portal. 

:::image type="content" source="media/register-discover-skills/assessment-in-portal.png" alt-text="Screenshot of skill assessment in the API Center portal." lightbox="media/register-discover-skills/assessment-in-portal.png":::

> [!NOTE]
> API Center runs skill assessments approximately once per hour. It can take up to an hour for new or updated skills to be assessed and for the results to appear in the API Center portal.

## Related content

* [Synchronize API assets from a Git repo](synchronize-assets-git.md)
* [Register and discover MCP servers in your API inventory](register-discover-mcp-server.md)
* [Set up your API Center portal](set-up-api-center-portal.md)
* [Key concepts in Azure API Center](key-concepts.md)
