---
title: Set up Azure Operator Call Protection
description: Start using Azure Operator Call Protection to protect your customers against fraud
author: rcdun
ms.author: rdunstan
ms.service: azure
ms.topic: how-to
ms.date: 01/31/2024
ms.custom:
    - update-for-call-protection-service-slug

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

# Set up Azure Operator Call Protection

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the customer will do. Answer the fundamental "why would I want to do this?" question. Keep it short.

Readers should have a clear idea of what they will do in this article after reading the introduction.

* Introduction immediately follows the H1 text.
* Introduction section should be between 1-3 paragraphs.
* Don't use a bulleted list of article H2 sections.

Example: In this article, you will migrate your user databases from IBM Db2 to SQL Server by using SQL Server Migration Assistant (SSMA) for Db2.

-->

Before you can launch your Azure Operator Call Protection service, you and your onboarding team must:

- Provision your subscribers.
- Test your service.
- Prepare for launch.

In this article, you learn about the steps that you and your Azure Communications Gateway onboarding team must take.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.


<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.

-->

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1.

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

You must have completed the following procedures.

- [Prepare to deploy Azure Communications Gateway](../communications-gateway/prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](../communications-gateway/deploy.md) - with Azure Operator Call Protection enabled

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

## Enable Azure Operator Call Protection

> [!NOTE]
> If you selected Azure Operator Call Protection when you [deployed Azure Communications Gateway](../communications-gateway/deploy.md), skip this step and go to [Provision subscribers](#provision-subscribers).

Navigate to your Azure Communications Gateway resource and find the "Call Protection" tab.
If it is currently set to Disabled, update it to be Enabled and notify your Microsoft onboarding team.

TODO: Replace this picture with the actual one.
![Azure Operator Call Protection on the Azure Communications Gateway resource](media/portal2.png)

## Provision subscribers

[!INCLUDE [operator-call-protection-sub-ucaas-restriction](includes/operator-call-protection-sub-ucaas-restriction.md)]

Enable the Azure Operator Call Protection service on your subscribers by using the [Number Management Portal](../communications-gateway/manage-enterprise-operator-connect.md).

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling & media flows used for call hold and session refresh.

The connection to Azure Operator Call Protection is over SIPREC.  The Call Protection service takes the role of the SIPREC Session Recording Server (SRS).  An element in your network, typically a session border controller (SBC), is set up as a SIPREC Session Recording Client (SRC).

Work with your onboarding team to produce a network architecture plan where an element in your network can act as an SRC for calls being routed to your Azure Operator Call Protection enabled subscribers.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](../communications-gateway/request-changes.md).

## Learn about monitoring Azure Operator Call Protection

Your staff can use a selection of key metrics to monitor Azure Operator Call Protection through your Azure Communications Gateway. These metrics are available to anyone with the Reader role on the subscription for Azure Communications Gateway. See [Monitoring Azure Communications Gateway](../communications-gateway/monitor-azure-communications-gateway.md).

## Next steps

- Learn about [monitoring Azure Operator Call Protection with Azure Communications Gateway](../communications-gateway/monitor-azure-communications-gateway.md).
