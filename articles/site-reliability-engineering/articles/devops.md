---
title: "FAQ: SRE and DevOps | Microsoft Docs"
titleSuffix: Azure
description: "FAQ: Understanding the relationship between SRE and DevOps"
author: dnblankedelman
manager: efreeman
ms.service: site-reliability-engineering
ms.topic: article
ms.date: 04/22/2020
ms.author: dnb

---
# Frequently asked questions: What's the relationship between SRE and DevOps?

There is a set of common questions that come up around the relationship between site reliability engineering and DevOps including "How are they same? How are they different? Can we have both in our organization?". This article attempts to share some of the answers that have been offered by the SRE and DevOps communities that get us closer to an understanding of this relationship.

## How are they the same?

SRE and DevOps are both modern operations practices that were created and developed in response to challenges that included:

- a growing complexity of our production environments and development processes
- increasing business dependency on the continuous functioning of those environments
- the inability to scale the workforce linearly with the size of these environments
- the need to move faster while still retaining operational stability

Both operations practices value attention to subjects that are crucial to dealing with these challenges like monitoring/ observability, automation, documentation, and collaborative software development tools.

There is considerable overlap in tooling and areas of work between SRE and DevOps. As _The Site Reliability Workbook_ puts it, "SRE believes in the same things as DevOps but for slightly different reasons."

## Three different ways to compare the two operations practices

The similarities between SRE and DevOps are clear. Where it gets really interesting is how the two differ or diverge. Here we offer three ways to think about their relationship as a way of bringing some nuance to this question. You may not agree with these answers, but they each provide a good starting place for discussion.

### "class SRE implements interface DevOps"

_The Site Reliability Workbook_ (mentioned in our [resource book list](../resources/books.md)) discusses SRE and DevOps in its first chapter. That chapter uses the phrase "class SRE implements interface DevOps" as its subtitle. This is meant to suggest (using a             phrase aimed at developers) that SRE could be considered a specific implementation of the DevOps philosophy. As the chapter points out, "DevOps is relatively silent on how to run operations at a detailed level" while SRE is considerably more proscriptive in its practices. So one possible answer to the question of how the two relate is SRE could be considered one of many possible implementations of DevOps.

### SRE is to reliability as DevOps is to delivery

This comparison is a little muddied because there are multiple definitions for both SRE and DevOps, but it is still potentially useful. It starts with the question "If you had to distill each operations practice into one or two words that reflect its core concern, what would it be?"

If we use this definition of SRE from the [site reliability engineering hub](../index.yml):

> Site Reliability Engineering is an engineering discipline devoted to helping an organization sustainably achieve the appropriate level of reliability in their systems, services, and products.

then it would be easy to say the word for SRE is "reliability". Having it be right in the middle of the name also offers some excellent evidence for this claim.

If we use this definition of DevOps from the [Azure DevOps Resource center](https://docs.microsoft.com/azure/devops/learn/):

> DevOps is the union of people, process, and products to enable continuous delivery of value to our end users.

then a similar distillation for DevOps could be "delivery".

Hence "SRE is to reliability as DevOps is to delivery".

### Direction of attention

This answer is quoted or slightly paraphrased from a contribution by Thomas Limoncelli to the _Seeking SRE_ book mentioned in our [resource book list](../resources/books.md). He notes that DevOps engineers are largely focusing on the software development lifecycle pipeline with occasional production operations responsibilities while SREs focus on production operations with occasional SDLC pipeline responsibilities.

But more importantly, he also draws a diagram that starts with the software development process on one side and the production operations work on the other. The two are connected by the usual pipeline that is built to take the code from a developer, shepherd it through the desired number of tests and stage and then move that code into production.

Limoncelli notes that DevOps engineers start at the development environment and automate steps towards production. Once complete, they go back to optimize bottlenecks.

SREs, on the other hand, focus on production operations, and reach deep into the pipeline as a means of improving the end result (basically working in the opposite direction).

It is this difference in the direction of the SRE and DevOps focus which can help differentiate them.

## Coexistence in the same organization

The final question we'd like to address is "Can you have both SRE and DevOps in the same organization?"

The answer to this question is an emphatic "yes!".

We hope that the previous answers offer some idea how the two operations practices overlap and, when not overlapping, how they can be complementary in focus. Organizations with an established DevOps practice can experiment with SRE practices on a small scale (for example, trying SLIs and SLOs) without having to commit to creating SRE positions or teams. This is a fairly common SRE adoption pattern.

## Next Steps

Interested in learning more about site reliability engineering or DevOps? Check out our [site reliability engineering hub](../index.yml) and [Azure DevOps Resource center](https://docs.microsoft.com/azure/devops/learn/).
