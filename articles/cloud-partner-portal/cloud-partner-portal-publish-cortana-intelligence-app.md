---
title: Publish a Cortana Intelligence app to AppSource? | Microsoft Docs
services: marketplace
author: hiavi
manager: judym
redirect_url: /azure/marketplace/cloud-partner-portal/cloud-partner-portal-publish-cortana-intelligence-app
redirect_document_id: TRUE 
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2017
ms.author: abathula

---
# Publish a Cortana Intelligence app to AppSource?
Step by step guide for publishing a Cortana Intelligence or Microsoft R Services app on AppSource

## 1. Introduction

Thank you for your interest in publishing your Cortana Intelligence /
Microsoft R Solutions app to Microsoft AppSource. Microsoft is excited
to work with our dedicated partners (ISVs / SIs) to provide the premier
place for customers, resellers, and implementation partners to discover
and try business solutions and make the most of their investments. This
guide walks you through each of the steps to get your solution
published.

## 2. Getting started

Follow the instructions

1.  At [Starter Guide for getting showcased with
    Microsoft](https://www.microsoftpartnerserverandcloud.com/_layouts/download.aspx?SourceUrl=Hosted%20Documents/CESIPartnerJourneyOverview_1232017.pdf)
    to get listed as an Advanced Analytics partner.

2.  On AppSource by filling [List an
    app](https://appsource.microsoft.com/partners/list-an-app)
    form.
    - For the question *“Choose the products that your app is built
    for*”, pick **Other** checkbox and list “Cortana Intelligence” in
    edit control.

## 3. Solution evaluation criteria

Here is the list of criteria the app needs to meet

1.  App needs to address specific business use case problem within a
    given functional area in a repeatable manner. With minimal configurations/customizations, it should be able to deliver predefined value proposition within a short period of time.

2.  Solution should use at least one of the following analytics components

    1. HDInsight
    2. Machine Learning
    3. Data Lake Analytics
    4. Stream Analytics
    5. Cognitive Services
    6. Bot Framework
    7. Microsoft R Server stand-alone or R services on SQL 2016/HDInsight Premium

3.  Solution should be generating at least \$1 K / month / customer using
    Digital Partner Of Record (DPOR) or Cloud Solution Provider (CSP) programs.

4.  Solution should use Azure Active Directory federated single sign-on       (AAD federated SSO) with consent enabled for user authentication and      resource access controls. If your app is not already enabled, see

    1. [Getting started](https://identity.microsoft.com/)
    2. [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications#adding-an-application)

5.  Use Power BI in your solution and share is Power BI desktop file
    (PBIX): Optional but highly recommended as it is proven to generate
    higher number of leads

    1. Ensure all data is imported into the PBIX file
    2. No Externally Referenced Data – we create the Embedded Report for you.

## 4. Decide on the type of offer you would like to publish on AppSource

AppSource enables partners to give two types of trial experiences to viewers
1.  Customer led trials, where customers can experience the app all by themselves
    1.  Free trial
        1.  AppSource navigates the user to a URL that you (partner) provide taking the user through AAD federated SSO and provide a time boxed trial experience.
        2.  Expectation here is that your app is a SaaS app with multi-tenancy support to isolate one user’s config/data from other OR the trial experience only gives a subset experience needing only read-only operations.

        Example : See [AFS POP Retail Execution](https://appsource.microsoft.com/product/web-apps/afs.fa9fc926-3bc3-43dd-becd-3ef41b52c10b?tab=Overview), [AvePoint Citizen Services](https://appsource.microsoft.com/product/web-apps/avepoint.7738ac97-fd40-4ed3-aaab-327c3e0fe0b3?tab=Overview) (this app provides a curated experience with clear paths for selected set of user personas) etc.
    2.  Test Drive
        1.  Your (partner) solution or a subset of it can be packaged using Azure Resource Manager templates that AppSource can instantiate and manage in partner Azure subscription with time boxing and maintaining hot/cold pool of instances etc.
        2.  We can provide templates and sample code to help you if you choose to go with this route.
        
        Example: See Neal Analytics [Inventory Optimization](https://appsource.microsoft.com/product/web-apps/neal_analytics.8066ad01-1e61-40cd-bd33-9b86c65fa73a?tab=Overview&tag=CISHome).

2.	Partner led trials, which require customers to fill a contact info form so that partner can follow up and give a demo/trial etc.

See [AppSource trial experience walkthrough](http://aka.ms/trialexperienceforwebapps) video for a high-level overview.

Data clearly shows that customer led trials have a high lead generation potential when compared to partner led trials – think about it, who likes to fill out forms 😊

Decide which type of offer you would want to add to AppSource.

## 5. Getting approved to use Azure Marketplace publishing portal

As of now AAD/MSA email IDs need to be approved before you can access
the Azure Marketplace Publishing Portal to start publishing. Kindly
share the following details to
[appsourcecissupport@microsoft.com](mailto:appsourcecissupport@microsoft.com?subject=Request%20publisher%20account%20creation%20for%20%3cPartner%20Name%3e%20and%20whitelist%20owner/contributer%20AAD/MSA%20email%20IDs)

-   Publisher Display Name: &lt;Name of the firm as it shows up on
    AppSource as app’s publisher&gt;

-   Publisher Unique Name: &lt;unique name using only lower case chars
    and hyphen ‘-‘&gt;

-   WebSite: &lt;Firm’s Website&gt;

-   Owner Email: &lt;AAD/MSA email ID&gt;

-   Contributor2 Email: &lt;AAD/MSA email ID&gt;

 Add more contributors if you need.

## 6. Get info about your company’s lead management

As visitor’s express interest in solutions, these leads are passed
directly into partner’s lead management systems. AppSource supports multiple types of lead management systems (Dynamics CRM, Salesforce, Marketo etc.).

See [AppSource Marketing Lead Management](./cloud-partner-portal-marketing-lead-management.md) for details of the overall process and how can you find the right info to setup AppSource's leads.    

## 7. Publish your app on the publishing portal

If you need information about any of the fields that we skip, email
<appsourcecissupport@microsoft.com>

Follow these steps

1.  Using Google Chrome browser, open [Cloud Partner
    Portal](https://cloudpartner.azure.com)

2.  Sign in with your white listed AAD/MSA email ID

3.  Select New Offer -&gt; Cortana Intelligence

    ![publishaaapp1][1]
4.  Fill details of Offer Settings

    ![publishaaapp2][2]

    1. Offer ID is used to uniquely identify your app on AppSource
       as part of the unique AppSource URL. Example: “appsource-saas-app". It will be visible to customers in places like Azure Resource Manager templates and billing reports. Note that Offer ID & Publisher information cannot be changed once it is saved.

    2. For Offer Name, use your solution’s name. Do not add your
       company name as it is added automatically below the solution
       name

5.  Fill out Technical Info section – most of it is self-explanatory and
    has tool tips with more info.

    1.  Demo videos should be minimally edited recordings of the actual
        solution functionality, highlighting users authenticating using AAD, key aspects of the user-facing functionality and integration with Cortana Intelligence platform.  Demo videos **will not** be made available publicly to customers but are expected to be representative of how the solution *would be* shown to a prospective customer.  As such, they should be scripted and repeatable.

        You can you any screen recording tool that exports a standard video
        format (for example, MPEG) can be used to prepare your demo video. Here are
        the instructions if you have Skype for Business

        1.  [Begin a meeting](https://support.office.com/article/Start-a-Skype-for-Business-conference-call-8dc8ac52-91ac-4db9-8672-11551fdaf997)
        2. [Share your desktop](https://support.office.com/article/Share-your-screen-in-Skype-for-Business-2d436dc9-d092-4ef1-83f1-dd9f7a7cd3fc)
        3. [Begin recording](https://support.office.com/article/Share-sites-or-documents-with-people-outside-your-organization-80e49744-e30f-44db-8d51-16661b1d4232)
        4. After you stop recording, [use the recording manager to publish your recording](https://support.office.com/article/Recording-Manager-save-and-publish-59a3beb7-c700-40cf-ab21-bc82a2b06351)

        You must upload your recorded video to a service that allows you to generate a shared URL.  For example, you can use a [guest link in OneDrive/Sharepoint](https://support.office.com/article/Share-sites-or-documents-with-people-outside-your-organization-80e49744-e30f-44db-8d51-16661b1d4232). 

    2.  See [Advanced Analytics Solution Workflow
    Template](https://partnersprofilesint.blob.core.windows.net/partner-assets/documents/AppSource%20Solution%20Publishing%20Guide%20Docs/Advanced%20Analytics%20Solution%20Workflow%20Template%20V.2017.3.23.pptx) for guidelines when uploading solution architecture diagram

6.  Fill out Storefront Details section

    1.  Note: “Offer Description” & “Terms of use” fields can take html
        content. You can use any online html editors to tweak your html
        content until you get the right look. Offer description should
        very clearly and succinctly give a sales pitch explain the
        business case it solves, ROI a customer would get and any
        collateral supporting the pitch.

    2.  App type: Based on earlier section titled “Decide on the type of offer you would like to          publish on AppSource”, pick the option of
        1.  “Free” if you want to give customers non-timeboxed fully free experience.
        2.  “Trial” if you want to give customers time boxed trial / test drive experience
        3.  “Request a trial” if you want to give customers a partner led trial experience.

    3.  Hide key to test your offer in staging: It is used to create a preview URL for your app          after it is staged and is not a password feel free to keep it simple. Example: “AppSourceHideKey”

    4.  Uploaded images need to be high-quality readable images for the
        offer publish to get approved.

    5.  Case study: Provide a case study/story with following details

        1.  Operationalized customer implementation
        2. Problem Statement clearly defined for actual customer or
            anonymized customer
        3. Steps taken to solve problem
        4. Reference CIS/Microsoft Advance analytics components that
            helped solve the problem.
        5.  Net benefit or ROI of instituting solution
        6. *What is not wanted*: Marketing brochure or video with just
            an explanation of overall platform without the above
            requirements

    6.  Highly recommended as it generates more leads: A video with same
        requirements as case study to be displayed on AppSource. When
        entering the URL for your video, videos can be Youtube videos or
        vimeo videos. Please make sure the videos are in either of these
        formats
        1. https://vimeo.com/########## or
        2. https://www.youtube.com/watch?v=##########

7.  Fill out Contacts section – it will be used to send usage
    notification, market place alerts etc.

8.  Publish your offer. You will receive email notifications as the
    solution moves through the certification process. You can see
    details of status in “Status” tab of the offer publication UI.

    1.  Your solutions will first get staged.
    2.  You can verify your staged content by clicking the AppSource
        link that you will receive by email.
    3.  Make required changes and resubmit. Once you are happy with
        final content, push the app to production.
    4.  At this point, we validate the app's meta data and finally approve your app to be listed on       AppSource or follow up with a reject reason if we reject your app.

[1]: ./media/cloud-partner-portal-publish-cortana-intelligence-app/publishaaapp1.png
[2]: ./media/cloud-partner-portal-publish-cortana-intelligence-app/publishaaapp2.png    