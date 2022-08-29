---
title: Implement a retry policy for Azure Storage services
description: Learn about retry policies and how to implement them for Azure Storage services. This article helps you set up a retry policy for blob storage requests using the .NET v12 SDK. 
author: pauljewellmsft
ms.author: pauljewell
ms.service: storage
ms.topic: how-to
ms.date: 08/23/2022
ms.custom: template-how-to
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a how-to article.
See the [how-to guidance](contribute-how-to-write-howto.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Implement a retry policy for Azure Storage services

Any application that runs in the cloud or communicates with remote services and resources must be able to handle transient faults. It's common for cloud applications and services to experience faults due to a momentary loss of network connectivity, a request timeout when a service or resource is busy, or a number of other factors. Developers should build applications to handle transient faults transparently to improve stability and resiliency. 

This article shows you how to set up a basic retry strategy for an application that connects to Azure blob storage. This strategy is one element to consider as part of a broader retry policy for your application.

<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## [Section 1 heading]
Retry policies are configured programmatically. 
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- For architectural guidance and general best practices around retry policies, please see [Transient fault handling](/azure/architecture/best-practices/transient-faults).
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
