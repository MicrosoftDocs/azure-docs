---
title: Azure and Dynamics 365 consulting service offer - Enter Storefront Details | Microsoft Docs
description: Guide for defining storefront details in an Azure or Dynamics 365 consulting service offer in the Cloud Partner Portal.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: qianw211
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: pbutlerm
---

# Storefront Details tab

Next, you need to enter the details for your storefront. The **Storefront
Details** consists of the following sections:

-   Offer Details
-   Publisher Information
-   Listing Details
-   Marketing Artifacts

![Creating a new consulting service offer - Storefront Details tab](media/consultingoffer-storefront-details.png)

## Offer details

The offer details section contains the following fields:

-   Offer summary
-   Offer description

### Offer summary

The Offer summary is a brief description of your offer that appears just
below the offer name. Use plain text when entering the offer
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

### Offer description

Enter the description of the consulting service offer here. A good offer
description covers exact details of what the engagement will look like
and what will be the end deliverable to the customer. It should clearly
help the customer understand what they get. Your offer description needs
to include how your offering relates to the Microsoft product for which
you are offering consulting services.

Do not include email links or phone numbers for contacting you in your
Offer description. There will be a **Contact Me** button with your offer
that will upload leads to the lead management target that you identify
on your offer.

You will enter the offer description in Markdown format. If you are not
familiar with Markdown or formatting for HTML, you can review resources
on the [How to use Markdown for writing Docs](https://docs.microsoft.com/contribute/how-to-write-use-markdown).

Using these formats will ensure your offer has maximum readability for
customers.

Keep your Offer description brief and adhere to the character limit as
users do not like to read long text. You still have the option to
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
    with Power BI, including a collaborative session to cobuild a Power
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


## Publisher information

**MPN ID**

Your 9-digit Microsoft Partner Network (MPN) ID. If you do not have an
MPN ID, you can go to Microsoft Partner Center to acquire one.

**Partner Center ID**

New Partner Center ID, if you have one.

**MPN ID**

Enter a secret key to preview your offer on AppSource before going live.
This identifier is not a password.

## Listing details

**consulting service type**

Microsoft is focusing exclusively on fixed scope, fixed duration,
estimated, or fixed price (or free), and primarily pre-sales-oriented
consulting service offerings for a single customer and, for assessment,
implementation, proof of concept, briefing, or workshop offers,
conducted either onsite or virtually. The AppSource consulting services 
marketplace does not support listings for managed or subscription services.

>[!Note]
>AppSource consulting services are not the appropriate marketplace for subscription or on-demand trainings.

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

>[!Note]
>AppSource consulting services are currently live in the United States, United Kingdom, and Canada. You can submit an offer for a country that is not yet live and it will be reviewed and prepared to go live. A minimum number of offers ready to go live are needed to open a new country, so offers for countries that are not live are encouraged.

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
**PowerApps** as your primary product. You can also select other relevant
Applicable Products, and your consulting service offer will show in
listings that are associated with each of these products on AppSource.

**Relevant competencies**

Select competencies relevant to this offer to have them displayed along
with the offer details.

## Marketing artifacts

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
fact sheets, or case studies. Be sure your documents use the current
names of featured products, and do not feature Microsoft competing products.

**Screenshots (Max 5)**

Upload up to five images that provide more information about the offer,
offer deliverables, or your company. For example, a snippet of your
marketing brochure, a relevant slide from a presentation, or an image
showing company momentum or expertise.

## Next steps

You're now ready to [publish your consulting services](./cpp-consulting-service-publish-offer.md) offer.