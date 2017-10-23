---
title: Support and help options for Azure Identity developers | Microsoft Docs
description: Know how to obtain help and support for development-related questions and problems when creating application that integrate with Microsoft Azure identities (Azure Active Directory and MSA)
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/13/2017
ms.author: andret
ms.custom: aaddev 

---


# Support and help options for developers 

Regardless if you are just starting to integrate with Azure Active Directory, Microsoft identities or Microsoft Graph API, or when you are implementing a new feature to your application, there are times that you need to obtain help from the community or understand the support options that you have as a developer. This article helps you to understand these options, below a summary:

- You may want to search to check if your problem question has not been answered by the community, or if an existing documentation for the feature you are trying to implement already exists
- In some cases, you just want to use of our support tools to help you debug a specific your problem
- If you can't find the answer from what you need, you may want to ask a question on *Stack Overflow*
- If you find an issue with one of our authentication libraries, raise a *GitHub* issue
- Finally, if you need to talk to someone, you might want to open a support request


## Search

If you have a development-related question, you may be able to find the answer you need on our documentation, our [github samples](https://github.com/azure-samples), or [Stack Overflow](https://www.stackoverflow.com).

Type your problem, question or error on the following search box to search on Stack Overflow, our documentation, and our code samples:
<br/><br/>
<div>
<form method="get" class="clearFilter" action="http://www.bing.com/search" target="_blank">
<input aria-label="Bing scoped search" type="search" placeholder="Bing scoped search" name="q" size="22" style="box-sizing: border-box;font-size: 0.87rem;height: 22px;line-height: 1.8; padding: 0 10px;">
<a title="Clear Filter" class="clearInput" href="#"><span class="visually-hidden">Clear Filter</span></a>
<input type="submit" value="Search" />
<input type="hidden" name="q1" value="(site:stackoverflow.com OR site:docs.microsoft.com OR site:github.com/azure-samples OR site:cloudidentity.com OR site:developer.microsoft.com/en-us/graph)" /></td></tr>
</form>
</div>

## Use our development support tools

|Tool  |Description  |
|---------|---------|
|[jwt.ms](https://jwt.ms)| Paste an ID or Access tokens to decode the claims names and values |
|[Error code analyzer](https://apps.dev.microsoft.com/portal/tools/errors)| Paste an error code received during sign-in or consent pages to see possible causes and remediations |
|[Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)| Tool that lets you make requests and see responses against the Microsoft Graph API|

<br/>
[![Stack Overflow](media/active-directory-develop-help-support/stackoverflow-logo.png)](https://www.stackoverflow.com)
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


[![Stack Overflow](media/active-directory-develop-help-support/github-logo.png)](https://www.github.com)
## Create a GitHub issue

 If you find a bug or problem related to our libraries, please raise an issue on our GitHub repositories. Because our libraries are open source, you are also free to submit a pull request as well. The following article contains a list of libraries and their GitHub repositories:

- [ADAL, MSAL, and Owin middleware](active-directory-authentication-libraries.md) libraries and GitHub repositories

<br/>
<svg xmlns="http://www.w3.org/2000/svg" class="" role="presentation" aria-hidden="true" viewBox="0 0 40 40" focusable="false" style="height:40 px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg"><g><path class="msportalfx-svg-c15" d="M 34.256 14.928 a 9.066 9.066 0 1 1 -18.132 -0.002 a 9.066 9.066 0 0 1 18.132 0.002 M 31.818 27.1 l -6.628 9.287 l -6.628 -9.287 H 9.001 V 50 H 41.38 V 27.1 Z" /><path class="msportalfx-svg-c01" opacity="0.2" d="M 16.126 14.928 c 0 4.931 3.939 8.935 8.843 9.054 l 2.277 -17.875 a 9.03 9.03 0 0 0 -2.055 -0.243 a 9.063 9.063 0 0 0 -9.065 9.064 M 18.564 27.1 H 9 V 50 h 12.696 l 2.002 -15.703 Z" /><path class="msportalfx-svg-c05" d="M 39.966 24.14 h -6.881 v -3.33 h 3.552 v -5.827 c 0 -6.426 -5.228 -11.654 -11.654 -11.654 S 13.329 8.557 13.329 14.983 v 1.665 h -3.33 v -1.665 C 9.999 6.722 16.721 0 24.982 0 s 14.983 6.722 14.983 14.983 v 9.157 Z" /><path class="msportalfx-svg-c01" opacity="0.2" d="M 24.982 0 C 16.721 0 9.999 6.722 9.999 14.983 v 1.665 h 3.33 v -1.665 c 0 -6.426 5.228 -11.654 11.654 -11.654 c 0.964 0 1.896 0.131 2.793 0.352 l 0.416 -3.327 A 15.028 15.028 0 0 0 24.982 0 Z" /></g></svg>

## Open a support request

If you need to talk to someone, you can open a support request. If you are an Azure customer, there are several support options available. To compare plans, see [this page](https://azure.microsoft.com/support/plans/). Developer support is also available for Azure customers. For information on how to purchase Developer support plans, see [this page](https://azure.microsoft.com/support/plans/developer/).

- If you already have an Azure Support Plan, [open a support request here](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

- If you are not an Azure customer, you can also open a support request with Microsoft via [our commercial support](https://support.microsoft.com/en-us/gp/contactus81?Audience=Commercial).

You can also try [our virtual agent](https://support.microsoft.com/contactus/?ws=support) to obtain support or ask questions.

### Free chat support for a limited time

You can also use our chat support - which is free for Microsoft Partners for a limited time. If your company is not a Microsoft Partner, you can enroll it for free and obtain other benefits by going [here](https://partners.microsoft.com/PartnerProgram/simplifiedenrollment.aspx).

After enrolling  your company, you can start the chat request [here](https://aka.ms/devchat).