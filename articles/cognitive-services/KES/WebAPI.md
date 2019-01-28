---
title: Web API interface - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Use the web API interface to create a rich, semantic search experience in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: cgronlun

ms.service: cognitive-services
ms.component: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# Web API Interface

The model files built by the Knowledge Exploration Service can be hosted and accessed via a set of web APIs.  The APIs may be hosted on the local machine using the [`host_service`](CommandLine.md#host_service-command) command, or may be deployed to an Azure cloud service using the [`deploy_service`](CommandLine.md#deploy_service-command) command.  Both techniques expose the following API endpoints:

* [*interpret*](interpretMethod.md) – Interprets a natural language query string. Returns annotated interpretations to enable rich search-box auto-completion experiences that anticipate what the user is typing.
* [*evaluate*](evaluateMethod.md) – Evaluates and returns the output of a structured query expression.
* [*calchistogram*](calchistogramMethod.md) – Calculates a histogram of attribute values for objects returned by a structured query expression.

Used together, these API methods allow the creation of a rich semantic search experience.  Given a natural language query string, the *interpret* method provides annotated versions of the input query with structured query expressions, based on the underlying grammar and index data.  The *evaluate* method evaluates the structured query expression and returns the matching index objects for display.  The *calchistogram* method computes the attribute value distributions to enable filtering and refinement.

**Example**

In an academic publications domain, if a user types the string "latent s", the *interpret* method can provide a set of ranked interpretations, suggesting that the user might be searching for the keyword "latent semantic analysis", the title "latent structure analysis", or other expressions starting with "latent s".  This information can be used to quickly guide the user to the desired search results.

For this domain, the *evaluate* method can be used to retrieve a set of matching publications from the academic index, and the *calchistogram* method can be used to calculate the distribution of attribute values for the matching publications, which can be used to further filter and refine the search results.

Note that to improve the readability of the examples, the REST API calls contain characters (such as spaces) that have not been URL-encoded. Your code will need to apply the appropriate URL-encodings.
