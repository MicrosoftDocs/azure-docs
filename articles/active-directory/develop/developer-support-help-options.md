---
title: Support and help options for Azure Identity developers | Microsoft Docs
description: Know how to obtain help and support for development-related questions and problems when creating application that integrate with Microsoft Azure identities (Azure Active Directory and MSA)
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/27/2017
ms.author: celested
ms.reviewer: andret
ms.custom: aaddev 
---


# Support and help options for developers 

Regardless if you are just starting to integrate with Azure Active Directory, Microsoft identities or Microsoft Graph API, or when you are implementing a new feature to your application, there are times that you need to obtain help from the community or understand the support options that you have as a developer. This article helps you to understand these options, below a summary:

> [!div class="checklist"]
> * Search to check if your problem question has not been answered by the community, or if an existing documentation for the feature you are trying to implement already exists
> * In some cases, you just want to use of our support tools to help you debug a specific your problem
> * If you can't find the answer from what you need, you may want to ask a question on *Stack Overflow*
> * If you find an issue with one of our authentication libraries, raise a *GitHub* issue
> * Finally, if you need to talk to someone, you might want to open a support request


## Search

If you have a development-related question, you may be able to find the answer you need on our documentation, our [github samples](https://github.com/azure-samples), or answers to [Stack Overflow](https://www.stackoverflow.com) questions.

### Scoped Search
For faster results, scope your search to Stack Overflow, our documentation, and our code samples by using the following on your [favorite search engine](https://bing.com):
```
{Your Search Terms} (site:stackoverflow.com OR site:docs.microsoft.com OR site:github.com/azure-samples OR site:cloudidentity.com OR site:developer.microsoft.com/en-us/graph)
```
Where *{Your Search Terms}* is your search keywords.
<br/>

## Use our development support tools

|Tool  |Description  |
|---------|---------|
|[jwt.ms](https://jwt.ms)| Paste an ID or Access tokens to decode the claims names and values |
|[Error code analyzer](https://apps.dev.microsoft.com/portal/tools/errors)| Paste an error code received during sign-in or consent pages to see possible causes and remediations |
|[Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)| Tool that lets you make requests and see responses against the Microsoft Graph API|

<br/>

[![Stack Overflow](./media/developer-support-help-options/stackoverflow-logo.png)](https://www.stackoverflow.com)
## Post a question to Stack Overflow

Stack Overflow is the preferred channel for development-related questions - where both members of community as Microsoft team members are directly involved on helping you to solve your problem.

If you cannot find an answer to your problem via search, submit a new question to Stack Overflow: use one of the following tags when making questions to help the community identify, then answer your question on a timely manner:

|Component/Area  |Tags  |
|---------|---------|
|ADAL library |[[adal]](http://stackoverflow.com/questions/tagged/adal)|
|MSAL library     |[[msal]](http://stackoverflow.com/questions/tagged/msal)|
|OWIN middleware  |[[azure-active-directory]](http://stackoverflow.com/questions/tagged/azure-active-directory)|
|[Azure B2B](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b)  |[[azure-ad-b2b]](http://stackoverflow.com/questions/tagged/azure-ad-b2b)|
|[Azure B2C](https://azure.microsoft.com/services/active-directory-b2c/)  |[[azure-ad-b2c]](http://stackoverflow.com/questions/tagged/azure-ad-b2b)|
|[Microsoft Graph API](https://developer.microsoft.com/graph/) |[[microsoft-graph]](http://stackoverflow.com/questions/tagged/microsoft-graph)
|Any other area related to authentication or authorization topics |[[azure-active-directory]](http://stackoverflow.com/questions/tagged/azure-active-directory)
<br/>
> [!TIP]
> The following posts from Stack Overflow contain tips on how to make questions, and tips on adding source code - following these guidelines may help increase the chances for community members to assess and respond to your question quickly:  
> - [How do I ask a good question](https://stackoverflow.com/help/how-to-ask)
> - [How to create a Minimal, Complete, and Verifiable example](https://stackoverflow.com/help/mcve)

<br/>


[![Stack Overflow](./media/developer-support-help-options/github-logo.png)](https://www.github.com)
## Create a GitHub issue

 If you find a bug or problem related to our libraries, raise an issue on our GitHub repositories. Because our libraries are open source, you are also free to submit a pull request as well. The following article contains a list of libraries and their GitHub repositories:

- [ADAL, MSAL, and Owin middleware](active-directory-authentication-libraries.md) libraries and GitHub repositories

<br/>

## Open a support request

If you need to talk to someone, you can open a support request. If you are an Azure customer, there are several support options available. To compare plans, see [this page](https://azure.microsoft.com/support/plans/). Developer support is also available for Azure customers. For information on how to purchase Developer support plans, see [this page](https://azure.microsoft.com/support/plans/developer/).

- If you already have an Azure Support Plan, [open a support request here](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

- If you are not an Azure customer, you can also open a support request with Microsoft via [our commercial support](https://support.microsoft.com/en-us/gp/contactus81?Audience=Commercial).

You can also try [our virtual agent](https://support.microsoft.com/contactus/?ws=support) to obtain support or ask questions.

### Free chat support for a limited time

You can also use our chat support - which is free for Microsoft Partners for a limited time. If your company is not a Microsoft Partner, you can enroll it for free and obtain other benefits by going [here](https://partners.microsoft.com/PartnerProgram/simplifiedenrollment.aspx).

After enrolling  your company, you can start the chat request [here](https://aka.ms/devchat).