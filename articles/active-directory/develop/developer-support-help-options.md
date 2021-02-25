---
title: Support and help options for Azure AD app developers
description: Know how to obtain help and support for development-related questions and problems when creating application that integrate with Microsoft identities (Azure Active Directory and Microsoft account)
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/23/2019
ms.author: ryanwi
ms.reviewer: jmprieur, saeeda
ms.custom: aaddev
---

# Support and help options for developers

If you're just starting to integrate with Azure Active Directory (Azure AD), Microsoft identities, or Microsoft Graph API, or when you're implementing a new feature to your application, there are times when you need to obtain help from the community or understand the support options that you have as a developer. This article helps you to understand these options, including:

> [!div class="checklist"]
> * How to search whether your question hasn't been answered by the community, or if an existing documentation for the feature you're trying to implement already exists
> * In some cases, you just want to use our support tools to help you debug a specific problem
> * If you can't find the answer that you need, you may want to ask a question on *Microsoft Q&A*
> * If you find an issue with one of our authentication libraries, raise a *GitHub* issue
> * Finally, if you need to talk to someone, you might want to open a support request

## Search

If you have a development-related question, you may be able to find the answer in the documentation, [GitHub samples](https://github.com/azure-samples), or answers to [Microsoft Q&A](/answers/products/) questions.

### Scoped search

For faster results, scope your search to [Microsoft Q&A](/answers/products/)the documentation, and the code samples by using the following query in your favorite search engine:

```
{Your Search Terms} (site:http://www.docs.microsoft.com/answers/products/ OR site:docs.microsoft.com OR site:github.com/azure-samples OR site:cloudidentity.com OR site:developer.microsoft.com/graph)
```

Where *{Your Search Terms}* correspond to your search keywords.

## Use the development support tools

| Tool  | Description  |
|---------|---------|
| [jwt.ms](https://jwt.ms) | Paste an ID or access token to decode the claims names and values. |
| [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)| Tool that lets you make requests and see responses against the Microsoft Graph API. |

## Post a question to Microsoft Q&A

[Microsoft Q&A](/answers/products/) is the preferred channel for development-related questions. Here, members of the developer community and Microsoft team members are directly involved in helping you to solve your problems.

If you can't find an answer to your question through search, submit a new question to [Microsoft Q&A](/answers/products/) . Use one of the following tags when asking questions to help the community identify and answer your question more quickly:

|Component/area  | Tags |
|---------|---------|
| ADAL library | [[adal]](/answers/topics/azure-ad-adal-deprecation.html) |
| MSAL library     | [[msal]](/answers/topics/azure-ad-msal.html) |
| OWIN middleware  | [[azure-active-directory]](/answers/topics/azure-active-directory.html) |
| [Azure B2B](../external-identities/what-is-b2b.md)  | [[azure-ad-b2b]](/answers/topics/azure-ad-b2b.html) |
| [Azure B2C](https://azure.microsoft.com/services/active-directory-b2c/)  | [[azure-ad-b2c]](/answers/topics/azure-ad-b2c.html) |
| [Microsoft Graph API](https://developer.microsoft.com/graph/) | [[azure-ad-graph]](/answers/topics/azure-ad-graph.html) |
| Any other area related to authentication or authorization topics | [[azure-active-directory]](/answers/topics/azure-active-directory.html) |

The following posts from [Microsoft Q&A](/answers/products/) contain tips on how to ask questions and how to add source code. Follow these guidelines to increase the chances for community members to assess and respond to your question quickly:

* [How do I ask a good question](/answers/articles/24951/how-to-write-a-quality-question.html)
* [How to create a minimal, complete, and verifiable example](/answers/articles/24907/how-to-write-a-quality-answer.html)

## Create a GitHub issue

If you find a bug or problem related to our libraries, raise an issue in our GitHub repositories. Because our libraries are open source, you can also submit a pull request.

For a list of libraries and their GitHub repositories, see the following:

* [Azure Active Directory Authentication Library (ADAL)](../azuread-dev/active-directory-authentication-libraries.md) libraries and GitHub repositories
* [Microsoft Authentication Library (MSAL)](reference-v2-libraries.md) libraries and GitHub repositories

## Open a support request

If you need to talk to someone, you can open a support request. If you are an Azure customer, there are several support options available. To compare plans, see [this page](https://azure.microsoft.com/support/plans/). Developer support is also available for Azure customers. For information on how to purchase Developer support plans, see [this page](https://azure.microsoft.com/support/plans/developer/).

* If you already have an Azure Support Plan, [open a support request here](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

* If you are not an Azure customer, you can also open a support request with Microsoft via [our commercial support](https://support.serviceshub.microsoft.com/supportforbusiness).

You can also try a [virtual agent](https://support.microsoft.com/contactus/?ws=support) to obtain support or ask questions.