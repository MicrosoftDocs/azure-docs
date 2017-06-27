---
title: Cortana Intelligece AppSource publishing guide | Microsoft Docs
description: As a Microsoft Partner, here are all the steps you need to follow to publish your Cortana Intelligence solution to AppSource.
services: machine-learning
documentationcenter: ''
author: TBD (Anupam's git account name)
manager: jhubbard
editor: cgronlun

ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2017
ms.author: anupams;v-bruham;garye
--- 
# Cortana Intelligece AppSource publishing guide
## Overview
AppSource is the single destination for Business Decision Makers (BDMs) to discover and seamlessly try business solutions/apps built by partners and evaluated by Microsoft.  [Learn](https://youtu.be/hpq_Y9LuIB8) how AppSource works. As a Microsoft Partner, you can really benefit from publishing on AppSource if you have:
- Built an intelligent solution/app using Microsoft’s [Cortana Intelligence services](https://azure.microsoft.com/en-us/suites/cortana-intelligence-suite/?cdn=disable), and
- Your solution/app addresses a specific business problem, and you > have built modules/Intellectual Property that can be reused across customers relatively quickly in a repeatable manner
This document will walk through the steps to get **Partner’s** Cortana Intelligence solution published to AppSource
## Getting Started
1. At [Starter Guide for getting showcased with Microsoft](https://www.microsoftpartnerserverandcloud.com/_layouts/download.aspx?SourceUrl=Hosted%20Documents/Partner%20Community%20Benefits%20Guide%20-%20Cloud%20and%20Enterprise.pdf) to get listed as an Advanced Analytics partner.
1. On AppSource fill up [List an app](https://appsource.microsoft.com/en-us/partners/list-an-app) form. For the question *“Choose the products that your app is built for*”, pick **Other** checkbox and list “Cortana Intelligence” in edit control.
1. Before a Cortana Intelligence app can get onboarded to AppSource, it needs to get certified by Cortana Intelligence’s Partner Solution Technology team. To get that process started, kindly share details about your app by filling in survey form at [https://aka.ms/cisappsrceval](https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Faka.ms%2Fcisappsrceval&data=02%7C01%7CAvi.Bathula%40microsoft.com%7C855e96a2c42245b8b9f208d492f1a9a3%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636295014021859405&sdata=lbPBP%2F8E3lbGYp54eaOdx%2B7%2Fpt2B0StKaLsBmCb7s8U%3D&reserved=0). This site is password protected and the site has instructions on how to get the password.
## Solution Evaluation Criteria
Here is the list of criteria the app needs to meet
1. App needs to address specific business use case problem within a given functional area in a repeatable manner with minimal configurations for predefined value propositions implementable within a short period.
1. Solution should use at least one of the following components
 1. HDInsight
 1. Machine Learning
 1. Data Lake Analytics
 1. Stream Analytics
 1. Cognitive Services
 1. Bot Framework
 1. Microsoft R Server stand alone
 1. R services on SQL 2016 or HDInsight Premium
1. Solution should be generating at least $1K / month / customer using DPOR/CSP.
1. **Solution should use Azure Active Directory federated single sign-on (AAD federated SSO) with consent enabled for user authentication and resource access controls.** To see what it means to be AAD federated SSO enabled, seek to 2min 35 sec in [AppSource trial experience walkthrough](https://na01.safelinks.protection.outlook.com/?url=http%3A%2F%2Faka.ms%2Ftrialexperienceforwebapps&data=02%7C01%7Crwiedower%40newsignature.com%7C5824d64e748d4c3c87a008d47a8b815a%7Ca1a2578a8fd34595bb187d17df8944b0%7C1%7C0%7C636268187003887379&sdata=euPBOag7YGw6bnaSYQJQHAabyPCMeLXp9NfAvx%2BYKZg%3D&reserved=0) video. If your app is not enabled with AAD federated SSO yet, here is some documentation about it.
 - [Step 1](https://identity.microsoft.com/Landing?ru=https://identity.microsoft.com/)
 - [Step 2](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-integrating-applications#adding-an-application) 
 You will need to show to the evaluation team that your solution is AAD federated SSO enabled before your app can be onboarded to AppSource.
1. Use Power BI in your solution and share is Power BI desktop file (PBIX): Optional but highly recommended as it is proven to generate higher number of leads
 1. Ensure all data is imported into the PBIX file
 1. No Externally Referenced Data – we will create the Embedded Report for you.
## DevCenter Account Setup
This is the process of registering your company to become a publisher with Microsoft. If you are already a registered publisher with an existing DevCenter account, you can skip this step.
Below are the key steps to setup a DevCenter account.
1. Create a Microsoft account [here](https://signup.live.com/signup.aspx).
1. Go to the Microsoft DevCenter [registration page](http://go.microsoft.com/fwlink/?LinkId=615100) and click "sign up".
1. When prompted for payment, use the code that we provided to you. If you don’t have one reach out to [appsourcecissupport@microsoft.com](mailto:appsourcecissupport@microsoft.com?subject=Request%20for%20promotion-code%20for%20DevCenter%20account%20setup)
1. Select the [country/region](https://docs.microsoft.com/windows/uwp/publish/account-types-locations-and-fees) in which you live, or where your business is located. **You won't be able to change this later.**
1. Select your [developer account type](https://docs.microsoft.com/windows/uwp/publish/account-types-locations-and-fees) (**For AppSource, you need to select "Company"**). For a company account, be sure to review these [guidelines](https://docs.microsoft.com/windows/uwp/publish/opening-a-developer-account).
1. Enter the contact info you want to use for your developer account.
For detailed step by step instruction on how to setup DevCenter account, see the instructions [here](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-accounts-creation-registration).
## Provide info about your app to be shared with Microsoft Sellers
One of the key value propositions of AppSource for partners is to be able to collaborate with Microsoft Sellers in positioning partner apps in front of potential customers.
Fill up [Partner Solution Info for Microsoft Sellers](https://aka.ms/aapartnerappinfo) and send it to [appsourcecissupport@microsoft.com](mailto:appsourcecissupport@microsoft.com?subject=Request%20publisher%20account%20creation%20for%20%3cPartner%20Name%3e%20and%20whitelist%20owner/contributer%20AAD/MSA%20email%20IDs). This is required step for a Cortana Intelligence app to get approved for publishing.
## Building a compelling customer walkthrough on AppSource
First, take a look at Neal Analytics [Inventory Optimization](https://appsource.microsoft.com/en-us/product/web-apps/neal_analytics.8066ad01-1e61-40cd-bd33-9b86c65fa73a?tab=Overview&tag=CISHome) on AppSource. Every app entry in AppSource has title, summary (100 chars max), description (1300 chars max), images, videos (optional), pdf documents apart from entry point for a trial experience. Partners should leverage all these to build a compelling customer experience.
Partners should think of the content they put on AppSource as an end to end sales orchestration. Customers read the title and description to understand the value proposition and then go through images & videos to understand what the solution is about. Case studies help potential customers see how existing customers are getting value. All these should make the customer feel interested and wanting to know more. Think of these as pitch decks based presentation a good technical sales person would walk the new customers through. The suggested format of description is to break up the text into sub-sections based on value propositions, each with highlighted with a sub-heading. Visitors usually glance over the “offer summary” field and sub-headings to get gist of what the app addresses and why should they consider the app in just a quick glance. So, it is important to get the user’s attention give them a reason to read on to get the specifics.
See what these partners have done.
1. [Neal Analytics Inventory
 Optimization](https://appsource.microsoft.com/en-us/product/web-apps/neal_analytics.8066ad01-1e61-40cd-bd33-9b86c65fa73a?tab=Overview)
1. [Plexure Retail
 Personalization](https://appsource.microsoft.com/en-us/product/web-apps/plexure.c82dc2fc-817b-487e-ae83-1658c1bc8ff2?tab=Overview)
1. [AvePoint Citizen
 Services](https://appsource.microsoft.com/en-us/product/web-apps/avepoint.7738ac97-fd40-4ed3-aaab-327c3e0fe0b3?tab=Overview)
 The final act of sales is to show a demo of the app/solution showing how the value proposition is delivered. That is exactly what a customer trial experience on AppSource is meant for. A good demo will
- Re-summarize the value proposition of the app in short and list out the persona’s within the customer firm who would interact with the solution
- Tell a story and sets the context about a sample customer dealing with specific issues
- Explain how the situation can generally devolve and impact the customer (before) VS what would happen if the solution is in use. This can be shown using PowerBI dashboards etc.
- Summarize how the solution makes it happen – like using any specific Machine Learning algorithms etc.
The content being added in AppSource should be of high quality and stitched up enough that
- a partner’s technical sales folks should be using it for their sales orchestration. Your sales teams using it is a good sign that you can expect MS sales folks also being able to do the same. This will enable customer point of contact to be able to consistently relay the same story to their team mates and higher ups to get budget and approvals before a purchase deal can be done.
- Customer visiting the site organically can go through the content all by themselves and feel excited to respond back to partner communication to move ahead with next steps.
That’s why partners should think of the content they put on AppSource as an end to end sales orchestration. Based on the story line and features to be shown in trial experience, type of offer can be decided.
## Publish your app on the Publishing Portal
See <span id="_Hlk477428070" class="anchor"></span>How to publish a Cortana Intelligence offer via Cloud Partner Portal­ for detailed instructions on how to actually publish your Cortana Intelligence app on AppSource. All the folks who are approved to access (step \# 6) can access the documentation.
If you need information about any of the fields, email <appsourcecissupport@microsoft.com>
## My app is published on AppSource – now what?
Firstly, Congratulations on getting your app published.
The level of returns you get from publishing your app on AppSource heavily depends on how you influence the target audience. See [Growth-Hacking your Cortana Intelligence app on AppSource](http://aka.ms/aagrowthhackguide) for more details of how you can maximize the returns.
 If you have any questions or suggestions, kindly reach out to us at <appsourcecissupport@microsoft.com>.

