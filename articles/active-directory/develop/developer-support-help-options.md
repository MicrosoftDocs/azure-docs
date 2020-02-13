---
title: Support and help options for Azure AD app developers | Microsoft Docs
description: Know how to obtain help and support for development-related questions and problems when creating application that integrate with Microsoft identities (Azure Active Directory and Microsoft account)
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
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
> * If you can't find the answer that you need, you may want to ask a question on *Stack Overflow*
> * If you find an issue with one of our authentication libraries, raise a *GitHub* issue
> * Finally, if you need to talk to someone, you might want to open a support request

## Search

If you have a development-related question, you may be able to find the answer in the documentation, [GitHub samples](https://github.com/azure-samples), or answers to [Stack Overflow](https://www.stackoverflow.com) questions.

### Scoped search

For faster results, scope your search to Stack Overflow, the documentation, and the code samples by using the following query in your favorite search engine:

```
{Your Search Terms} (site:stackoverflow.com OR site:docs.microsoft.com OR site:github.com/azure-samples OR site:cloudidentity.com OR site:developer.microsoft.com/graph)
```

Where *{Your Search Terms}* correspond to your search keywords.

## Use the development support tools

| Tool  | Description  |
|---------|---------|
| [jwt.ms](https://jwt.ms) | Paste an ID or access token to decode the claims names and values. |
| [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)| Tool that lets you make requests and see responses against the Microsoft Graph API. |

## Post a question to Stack Overflow

Stack Overflow is the preferred channel for development-related questions. Here, members of the developer community and Microsoft team members are directly involved in helping you to solve your problems.

If you can't find an answer to your question through search, submit a new question to Stack Overflow. Use one of the following tags when asking questions to help the community identify and answer your question more quickly:

|Component/area  | Tags |
|---------|---------|
| ADAL library | [[adal]](https://stackoverflow.com/questions/tagged/adal) |
| MSAL library     | [[msal]](https://stackoverflow.com/questions/tagged/msal) |
| OWIN middleware  | [[azure-active-directory]](https://stackoverflow.com/questions/tagged/azure-active-directory) |
| [Azure B2B](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b)  | [[azure-ad-b2b]](https://stackoverflow.com/questions/tagged/azure-ad-b2b) |
| [Azure B2C](https://azure.microsoft.com/services/active-directory-b2c/)  | [[azure-ad-b2c]](https://stackoverflow.com/questions/tagged/azure-ad-b2c) |
| [Microsoft Graph API](https://developer.microsoft.com/graph/) | [[microsoft-graph]](https://stackoverflow.com/questions/tagged/microsoft-graph) |
| Any other area related to authentication or authorization topics | [[azure-active-directory]](https://stackoverflow.com/questions/tagged/azure-active-directory) |

The following posts from Stack Overflow contain tips on how to ask questions and how to add source code. Follow these guidelines to increase the chances for community members to assess and respond to your question quickly:

* [How do I ask a good question](https://stackoverflow.com/help/how-to-ask)
* [How to create a minimal, complete, and verifiable example](https://stackoverflow.com/help/mcve)

## Create a GitHub issue

If you find a bug or problem related to our libraries, raise an issue in our GitHub repositories. Because our libraries are open source, you can also submit a pull request.

For a list of libraries and their GitHub repositories, see the following:

* [ADAL](active-directory-authentication-libraries.md) libraries and GitHub repositories
* [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angularjs/README.md), [MSAL.Android](https://github.com/AzureAD/microsoft-authentication-library-for-android), and [MSAL.obj_c](https://github.com/AzureAD/microsoft-authentication-library-for-objc) libraries and GitHub repositories

## Open a support request

If you need to talk to someone, you can open a support request. If you are an Azure customer, there are several support options available. To compare plans, see [this page](https://azure.microsoft.com/support/plans/). Developer support is also available for Azure customers. For information on how to purchase Developer support plans, see [this page](https://azure.microsoft.com/support/plans/developer/).

* If you already have an Azure Support Plan, [open a support request here](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

* If you are not an Azure customer, you can also open a support request with Microsoft via [our commercial support](https://support.microsoft.com/en-us/gp/contactus81?Audience=Commercial).

You can also try a [virtual agent](https://support.microsoft.com/contactus/?ws=support) to obtain support or ask questions.
