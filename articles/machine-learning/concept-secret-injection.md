---
title: What is secret injection?
titleSuffix: Azure Machine Learning
# title: #Required; Keep the title body to 60-65 chars max including spaces and brand
# description: #Required; Keep the description within 100- and 165-characters including spaces
description: Learn about online endpoints for real-time inference in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: concept-article
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: ignite-2023
ms.date: 10/16/2023

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Secret injection in online deployments

<!-- 2. Introductory paragraph
----------------------------------------------------------

Required. Lead with a light intro that describes what the article covers. Answer the fundamental "why would I want to know this?" question. Keep it short.

* Answer the fundamental "Why do I want this knowledge?" question.
* Don't start the article with a bunch of notes or caveats.
* Don't link away from the article in the introduction.
* For definitive concepts, it's better to lead with a sentence in the form, "X is a (type of) Y that does Z."

-->

When a user creates a deployment, the user may want to leverage secrets such as API keys to access external services (for example, Azure OpenAI, Azure Cognitive Search etc) from within the deployment. Currently to do this in a secured way, the user needs to directly interact with workspace connections or key vaults within the deployment.

The user would be using Inference Server / scoring script or BYOC (Bring your own container) to implement this interaction to retrieve the credentials. And this user container will run under the endpoint identity. For workspace connection, this means that the endpoint identity needs to have the ListCredentials permission on the workspace connections. For KV, it will be the ReadSecret permission on the workspace key vault.

If the endpoint identity is the user-assigned identity (UAI), user needs to manually assign a role with the required permission to the endpoint identity, which is often times a big administrative burden especially with enterprise customers. If the endpoint identity is the system-assigned identity (SAI), the identity would still need the permission, and currently we do not auto-grant this permission to the SAI.

Even if the endpoint identity has the permission, a user needs to use workspace connection API or key vault API to retrieve the credentials. This logic would be needed in the definition of the deployment.

To improve the experience, we want to provide a way for the user to specify the credentials from workspace connections or key vaults to be injected into the user container of the deployment, without requiring the user to directly interact with workspace connections or key vaults APIs within the deployments.

Further more, for workspace connections, we would like to auto-grant the permission to the endpoint identity so that the user with the right permission is relieved from manually assign the endpoint identity for the permission in the case of system-assigned identity.

## Prerequisites
TODO: [List the prerequisites if appropriate]

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

## [Section 1 heading]
TODO: add your content

## [Section 2 heading]
TODO: add your content

## [Section n heading]
TODO: add your content

<!-- 5. Next step/Related content ------------------------------------------------------------------------ 

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next step

TODO: Add your next step link(s)

> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

<!-- OR -->

## Related content

TODO: Add your next step link(s)

- [Write concepts](article-concept.md)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->


<!-- 6. Next step/Related content ------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related
content. You don't have to use either, but don't use both. For Next step, provide one link to the
next step in a sequence. Use the blue box format For Related content provide 1-3 links. Include some
context so the customer can determine why they would click the link. Add a context sentence for the
following links.

-->

## Next step
TODO: Add your next step link(s)
> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

<!-- OR -->

## Related content
TODO: Add your next step link(s)
- [Write concepts](article-concept.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.

-->