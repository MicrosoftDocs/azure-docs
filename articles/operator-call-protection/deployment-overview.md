---
title: Learn about deploying and setting up Azure Operator Call Protection
description: Understand how to get started with Azure Operator Call Protection to protect your customers against fraud
author: rcdun
ms.author: rdunstan
ms.service: azure
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 01/31/2024
ms.custom:
    - update-for-call-protection-service-slug

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

<!--
Remove all the comments in this template before you sign-off or merge to the  main branch.

This template provides the basic structure of a Concept article pattern. See the [instructions - Concept](../level4/article-concept.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

Concept is an article pattern that defines what something is or explains an abstract idea.

There are several situations that might call for writing a Concept article, including:

* If there's a new idea that's central to a service or product, that idea must be explained so that customers understand the value of the service or product as it relates to their circumstances. A good recent example is the concept of containerization or the concept of scalability.
* If there's optional information or explanations that are common to several Tutorials or How-to guides, this information can be consolidated and single-sourced in a full-bodied Concept article for you to reference.
* If a service or product is extensible, advanced users might modify it to better suit their application. It's better that advanced users fully understand the reasoning behind the design choices and everything else "under the hood" so that their variants are more robust, thereby improving their experience.

-->

<!-- 1. H1
-----------------------------------------------------------------------------

Required. Set expectations for what the content covers, so customers know the content meets their needs. The H1 should NOT begin with a verb.

Reflect the concept that undergirds an action, not the action itself. The H1 must start with:

* "\<noun phrase\> concept(s)", or
* "What is \<noun\>?", or
* "\<noun\> overview"

Concept articles are primarily distinguished by what they aren't:

* They aren't procedural articles. They don't show how to complete a task.
* They don't have specific end states, other than conveying an underlying idea, and don't have concrete, sequential actions for the user to take.

One clear sign of a procedural article would be the use of a numbered list. With rare exception, numbered lists shouldn't appear in Concept articles.

-->

# Overview of deploying Azure Operator Call Protection

<!-- 2. Introductory paragraph
----------------------------------------------------------

Required. Lead with a light intro that describes what the article covers. Answer the fundamental "why would I want to know this?" question. Keep it short.

* Answer the fundamental "Why do I want this knowledge?" question.
* Don't start the article with a bunch of notes or caveats.
* Don't link away from the article in the introduction.
* For definitive concepts, it's better to lead with a sentence in the form, "X is a (type of) Y that does Z."

-->

Azure Operator Call Protection is built on Azure Communications Gateway.
You need to deploy an Azure Communications Gateway resource and enable Azure Operator Call Protection to use this feature.


<!-- 3. Prerequisites --------------------------------------------------------------------

Optional: Make **Prerequisites** your first H2 in the article. Use clear and unambiguous
language and use a unordered list format.

-->

## Prerequisites

[!INCLUDE [operator-call-protection-tsp-restriction](includes/operator-call-protection-tsp-restriction.md)]

<!-- 4. H2s (Article body)
--------------------------------------------------------------------

Required: In a series of H2 sections, the article body should discuss the ideas that explain how "X is a (type of) Y that does Z":

* Give each H2 a heading that sets expectations for the content that follows.
* Follow the H2 headings with a sentence about how the section contributes to the whole.
* Describe the concept's critical features in the context of defining what it is.
* Provide an example of how it's used where, how it fits into the context, or what it does. If it's complex and new to the user, show at least two examples.
* Provide a non-example if contrasting it will make it clearer to the user what the concept is.
* Images, code blocks, or other graphical elements come after the text block it illustrates.
* Don't number H2s.

-->

## Running an Azure Operator Call Protection service

[!INCLUDE [operator-call-protection-ucaas-restriction](includes/operator-call-protection-ucaas-restriction.md)]

The following articles will guide you through the process of deploying an Azure Communications Gateway resource.
When given the option, you must enable the Call Protection settings.

![Enabling Azure Operator Call Protection when creating an Azure Communications Gateway](media/portal3.png)

## Next step

> [!div class="nextstepaction"]
> [Prepare to deploy Operator Call Protection on Azure Communications Gateway](../communications-gateway/prepare-to-deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json)
