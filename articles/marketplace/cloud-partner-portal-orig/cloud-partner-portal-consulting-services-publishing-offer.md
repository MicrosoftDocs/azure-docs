---
title: Consulting Services | Microsoft Docs
description: Guide for defining and publishing a consulting service offer.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: dan-wesley
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---


Defining and Publishing your Consulting Services Offer
======================================================

This guide is designed to help you define and publish your consulting
services offer in the Cloud Partner Portal.

Define your Consulting Services Offer
-------------------------------------

Define your packaged consulting service offering. Focus on fixed scope,
fixed duration, estimated, fixed price (or free), and primarily
pre-sales-oriented offerings for a single customer. Select repeatable
packaged engagements that have been popular and effective at driving new
business for you.

Publish a Consulting Service Offer
----------------------------------

The following sections describe the process of publishing your
Consulting Services offer

1.  Create a New offer
2.  Define Offer Settings
3.  Enter Storefront details and whether to publish in Azure
    Marketplace, or in AppSource.
4.  Publish your Offer

### Create a New Offer

To create a new offer, complete the following steps:

1.  On the main menu of the Cloud Partner Portal, select **New offer**.
2.  In the New Offer menu, select **Consulting Service**.

    ![Creating a new Consulting Services offer](media/consulting-services-publishing-offer/cppselectnewconsultingoffer.png)

### Define Offer Settings

On the New Offer screen, the first step is to create the offer identity.
The offer identity consists of three parts:

1.  Offer ID
2.  Publisher ID
3.  Name

Each of these parts are covered in the following sections.

#### Offer ID

This is a unique name you create when you first submit the offer. It
must consist only of lowercase alphanumeric characters, dashes, or
underscores. The ID will be visible in the URL and impacts search engine
results. For example, *yourcompanyname\_exampleservice*

As shown in the example, the offer ID gets appended to the your
publisher ID to create a unique identifier. This is exposed as a
permanent link that can be booked and is indexed by the search engines.

**After an offer is live it can\'t be updated**

#### Publisher ID

This is related to your account. When you are logged in with your
organizational account, your Publisher ID will show up in the dropdown
menu.

#### Name

This is what will show as the offer name on AppSource or Azure
Marketplace.

**Important:** Only enter the name of the actual service here. Do not
include duration and type of service.

The following example by Edgewater Fullscope shows how the offer name is
assembled. The offer name appears like this:

![Creating a new Consulting Services offer](media/consulting-services-publishing-offer/cppsampleconsultingoffer.png)

The Offer name is comprised of four parts:

-   **Duration:**You define this in the Storefront Details tab of the
    editor. Duration can be expressed in Hours, Days, or Weeks.
-   **Type of service:** You define this in the Storefront Details tab
    of the editor. Types of services are Assessment, Briefing,
    Implementation, Proof of concept and Workshop.
-   **Preposition:** Inserted by the reviewer
-   **Name:** This is what you defined in the Offer Settings page.

The following list provides several well-named Offer names:

-   Essentials for Professional Services: 1-Hr Briefing
-   Cloud Migration Platform: 1-Hr Briefing
-   PowerApps and Microsoft Flow: 1-Day Workshop
-   Azure Machine Learning Services: 3-Wk PoC
-   Brick and Click Retail Solution: 1-Hr Briefing
-   Bring your own Data: 1-Wk Workshop
-   Cloud Analytics: 3-Day Workshop
-   Power BI Training: 3-Day Workshop
-   Sales Management Solution: 1-Week Implementation
-   CRM QuickStart: 1-Day Workshop
-   Dynamics 365 for Sales: 2-Day Assessment

After you have completed the **Offer Settings** tab, you can save your
submission. The offer name will now appear above the editor, and you can
find it back in All Offers.

### Enter Storefront Details

Next, you need enter the details for your storefront. The Storefront
Details consists of the following sections:

-   Offer Details
-   Publisher Information
-   Listing Details
-   Marketing Artifacts

#### Offer Details

The offer details section contains the following fields:

-   Offer summary
-   Offer description

##### Offer summary

The Offer summary is a brief description of your offer that appears just
below the offer name. You should use plain text when entering the offer
summary, and it should not have line breaks. The following are good
examples of offer summaries together with their corresponding offer
names:

*Example 1*

-   **Offer name:** Cloud Analytics: 3-day Workshop
-   **Offer summary:** Overview of Microsoft Azure and Power BI,
    assessment of current environment, and mini POC.

*Example 2*

-   **Offer name:** Industrial Azure IoT: 30-Day Proof of Concept
-   **Offer summary:** Create an industrial connected product pilot to
    securely connect equipment in the field to an Azure IoT Hub solution
    with dashboards, reports, and notifications.

*Example 3*

-   **Offer name:** Professional Services: 1-Hr Briefing
-   **Offer summary:** Overview and demo of pre-configured, extended
    Dynamics 365 for Operations solution providing enhanced management
    of projects, billing, and resources for professional services.

*Example 4*

-   **Offer name:** Power BI in Your World: 4-Hr Workshop
-   **Offer summary:** Get up and running with your first dashboard and
    learn best practices. For up to 12 students, conducted onsite.

*Example 5*

-   **Offer name:** Dynamics and Projects: 3-Day Assessment
-   **Offer summary:** Requirements gathering and assessment for ERP
    solution designed for professional services firms and project-driven
    businesses.

##### Offer description

This is a description of the Consulting Service offer. A good offer
description covers exact details of what the engagement will look like
and what will be the end deliverable to the customer. It should clearly
help the customer understand what they get.

Do not include email links or phone numbers for contacting you in your
Offer description. There will be a Contact Me button with your offer
that will upload leads to the lead management target that you identify
on your offer.

You will enter the offer description in Markdown format. If you are not
familiar with Markdown or formatting for HTML, you can review resources
on the [Microsoft docs site](https://docs.microsoft.com/contribute/how-to-write-use-markdown).

Using these formats will ensure your offer has maximum readability for
customers.

Keep your Offer description brief and adhere to the character limit as
users do not like to read a lot of text. You still have the option to
upload marketing brochures, fact sheets, and other documents that
describe your offer in deeper detail.

The following example demonstrates a well composed Offer description and
its related name and summary:

**Offer name:** Cloud Analytics: 3-Day Workshop

**Offer summary:** Overview of Microsoft Azure and Power BI, assessment
of current environment, and mini POC.

**Offer description:** This 3-day workshop is for technical and business
leaders and is held on-site at the client's facility.

***Agenda***

Day 1

-   Focuses on how to secure, scale, and organize data within the
    Microsoft cloud using Azure Data Lake, HDInsight, or Azure SQL Data
    Warehouse.

Day 2

-   Covers how to configure and deploy advanced analytics solutions with
    Microsoft R and Azure Machine Learning.

Day 3

-   Covers how to draw actionable insights and operationalize analytics
    with Power BI, including a collaborative session to co-build a Power
    BI dashboard.

By the end of the workshop, the client will be able to define a
high-level plan and an implementation roadmap for data and analytics
solutions in the Microsoft cloud.

*Sample Markdown file for an offer following this format:*

    This 3-day workshop is for technical and business leaders and is held on-site at the client’s facility.

      ### Agenda

      **Day 1**

      * Focuses on how to secure, scale, and organize data within the Microsoft cloud using Azure Data Lake, HDInsight, or Azure SQL Data Warehouse

      **Day 2**

      * Covers how to configure and deploy advanced analytics solutions with Microsoft R and Azure Machine Learning

      **Day 3**

      * Covers how to draw actionable insights and operationalize analytics with Power BI, including a collaborative session to co-build a Power BI dashboard.


      ### Deliverables
      By the end of the workshop, the client will be able to define a high-level plan and an implementation roadmap for data and analytics solutions in the Microsoft cloud.


#### **Publisher Information**

**MPN ID**

Your 9-digit Microsoft Partner Network (MPN) ID. If you do not have an
MPN ID, you can go to Microsoft Partner Center to acquire one.

**Partner Center ID**

New Partner Center ID, if you have one.

**MPN ID**

Enter a secret key to preview your offer on AppSource before going live.
This is not a password.

#### Listing Details

**Consulting service type**

Microsoft is focusing exclusively on fixed scope, fixed duration,
estimated, or fixed price (or free), and primarily pre-sales-oriented
consulting service offerings for a single customer and, for assessment,
implementation, proof of concept, briefing, or workshop offers,
conducted either onsite or virtually (briefings must be conducted
onsite).

The following five types of offerings are included:

-   **Assessment:** An evaluation of a customer's environment to
    determine applicability of a solution and provide an estimate of
    cost and timing.
-   **Briefing:** An introduction to a solution or a consulting service
    to draw customer interest using frameworks, demos, and customer
    examples. Briefings must be conducted onsite.
-   **Implementation:** A complete installation that results in a fully
    working solution. For this pilot, Microsoft recommends limiting to
    solutions that can be implemented in one week or less.
-   **Proof of concept:** A limited scope implementation to determine if
    a solution will meet a customer's requirements.
-   **Workshop:** An interactive engagement conducted on a customer's
    premises that can include training sessions, briefings, assessments,
    or demos built on the customer's data or environment.

**Country/region availability**

Select the country and region where this consulting service offer will
be available. A single offer cannot be published in multiple countries
or regions. A new offer must be created for each country or region.

**Industries**

Select the industries that your consulting service offer is most
applicable to.

**Duration**

Select a number (for example, 3, 4, etc.) under Duration, and then
select Hour, Day, or Week.

**Primary products**

To publish to Azure Marketplace, select **Azure** as the primary
product, and then select relevant Solution Areas.

To publish to AppSource, select **Dynamics 365**, **Power BI**, or
**PowerApps**as your primary product. You can also select other relevant
Applicable Products, and your consulting service offer will show in
listings that are associated with each of these products on AppSource.

**Relevant Competencies**

Select competencies relevant to this offer to have them displayed along
with the offer details.

#### Marketing Artifacts

**Company logo (.png format, 48 x 48 pixels)**

Upload an image that will appear on the tile of your offer in the offer
gallery view page. The image must be a .png image with a resolution of
48 x 48 pixels.

**Company logo Company logo (.png format, 216 x 216 pixels)**

Upload an image that will appear on your details page of your offer. The
image must be a .png image with a resolution of 216 x 216 pixels.

**Videos (Max 4)**

Upload up to four customer case study videos or customer reference
videos. If you don't have any, upload a video explaining your company's
expertise related to the offer. If you have a Power BI or PowerApps
solution showcase, upload the showcase video here. Video links must be
for YouTube or Vimeo.

**Documents (Max 3)**

Upload the marketing brochure that describes your consulting service
offer in detail. Alternatively, you can also upload company overview,
fact sheets, or case studies.

**Screenshots (Max 5)**

Upload up to five images that provide more information about the offer,
offer deliverables, or your company. For example, a snippet of your
marketing brochure, a relevant slide from a presentation, or an image
showing company momentum or expertise.

### Publish your Offer

After you complete the Offer Settings, Storefront Details, and Contacts,
select **Publish** and provide an email address. When Microsoft is ready
to publish your offer, you will receive an email to preview it before it
goes live. You can return to the portal to check the status of your
offer at any point in time.

Offers might appear in a "Publish canceled" or "Publish failed" status
during the publishing process. This is a normal part of the process, and
allows Microsoft to make edits to your Offer. If you see your offer in
"Publish canceled", leave it in that status.
