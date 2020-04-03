---
title: Create a consulting service offer in Partner Center - Azure Marketplace
description: Learn how to publish a consulting service offer to either Azure Marketplace or AppSource using Partner Center.
author: anbene
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 03/26/2020
---

# Consulting service creation overview

> [!IMPORTANT]
> We're moving the management of your Consulting service offers from Cloud Partner Portal to Partner Center. Until your offers are migrated, please follow the instructions in [Azure and Dynamics 365 consulting service offer](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/consulting-services/cloud-partner-portal-consulting-services-publishing-offer) for Cloud Partner Portal to manage your offers.

This article describes how to publish a consulting service offer to either [Azure Marketplace](https://azuremarketplace.microsoft.com/) or [AppSource](https://appsource.microsoft.com/). List consulting service offers based on Microsoft [Dynamics 365](https://dynamics.microsoft.com/) and Power Platform on AppSource. List consulting service offers based on Microsoft Azure on Azure Marketplace.

## Publishing benefits

Benefits of publishing to the commercial marketplace:

- Promote your company by using the Microsoft brand.
- Potentially reach more than 100 million Office 365 and Dynamics 365 users on AppSource and more than 200,000 organizations through Azure Marketplace.
- Receive high-quality leads from these marketplaces.
- Have your services promoted by the Microsoft field and telesales teams

## Requirements

### Business requirements

For offers where Azure is selected as the primary product, your offer must list at least one of the following fully earned competencies:

- Application Development
- Application Integration
- Application Lifecycle Management
- Cloud Platform
- Data Analytics
- Data Center
- Data Platform
- DevOps

For offers with one of the following options selected as the primary product, you must meet the respective eligibility requirements listed or have a co-sell offer for the primary product that the service offering is related to.

**Customer Engagement Applications**

- **Applies to**: Dynamics 365 Sales, Dynamics 365 Marketing, Dynamics 365 Customer Service, Dynamics 365 Field Service, Dynamics 365 Human Resources

- **Criteria**: Must be Gold or Silver certified in the [Cloud Business Applications competency](https://partner.microsoft.com/membership/cloud-business-applications-competency) for Customer Engagement option.

**Finance and Operations Applications**

- **Applies to**: Dynamics 365 Finance, Dynamics 365 Operations, Dynamics 365 Commerce, Dynamics 365 Human Resources, Dynamics 365 Project Service Automation

- **Criteria**: Must be Gold or Silver certified in the [Cloud Business Applications competency](https://partner.microsoft.com/membership/cloud-business-applications-competency) for Unified Operations option.

**Dynamics 365 Customer Insights**

- **Criteria**: Must have at least one successful in-production implementation of [Dynamics 365 Customer Insights](https://dynamics.microsoft.com/ai/customer-insights/) with at least five measures and five segments.

**Dynamics 365 Business Central**

- **Criteria**: Must be Gold or Silver certified in the [Enterprise Resource Planning competency](https://partner.microsoft.com/membership/enterprise-resource-planning-competency) and serve at least three customers or have published a Business Central application in Microsoft AppSource.

**Power BI**

- **Criteria**: Must be listed on the [Power BI partner showcase](https://powerbi.microsoft.com/partner-showcase/).

**Power Apps**

- **Criteria**: Must be eligible for Advanced Benefits in the [Power Apps Partnership](https://aka.ms/PowerAppsPartner) program.

For details on meeting these prerequisites, see the [Consulting service prerequisites](consulting-service-prerequisites.md).

### Logistical requirements

To create a consulting service offer in either Azure Marketplace or AppSource consulting services, you must first [have a publisher account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account), and your account must be enrolled in the commercial marketplace program.

## Create a new consulting service offer in Partner Center

After meeting the requirements described above, follow these steps to create a consulting service offer.

1. Log in to [Partner Center](https://partner.microsoft.com), and then select **Dashboard** from the top menu.
2. In the left-nav bar, select **Commercial Marketplace**, then select **Overview**.

    :::image type="content" source="media/cs-menu-overview.png" alt-text="Illustrates the menu for commercial marketplace":::

3. Select **+ New Offer**, then select **Consulting service**.

    :::image type="content" source="media/cs-menu-newoffer.png" alt-text="Illustrates the button to create a new offer.":::

4. Enter an **Offer ID**. This is a unique identifier for each offer in your account.

    - This ID is visible to customers in the web address for the marketplace offer.
    - Use only lowercase letters, numbers, dashes, and underscores, but no spaces. The length is limited to 50 characters. For example, if you enter **test-offer-1**, the offer URL will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
    - The Offer ID can&#39;t be changed after you select **Create**.

5. Enter an **Offer alias**. This is the name used to refer to the offer in Partner Center.

    - This name isn&#39;t used in the marketplace. It&#39;s different from the offer name and other values that are shown to customers. You can use this field to assign a name to the offer that is more useful to you for identifying the offer internally; it is not shown to customers.
    - The offer alias can&#39;t be changed after you select **Create**.

After you enter these two values, select **Create** to continue to the **Offer setup** page.

## Offer setup

After you enter an Offer ID and Offer alias, Partner Center creates a draft offer and displays the **Offer setup** page. Follow these steps to set up your offer.

### Connect lead management

When publishing your offer to the marketplace with Partner Center, you _must_ connect it to a Customer Relationship Management (CRM) or marketing automation system. This let you receive customer contact information as soon as someone expresses interest in or uses your product.

1. Select **Connect** to specify where you want us to send customer leads. Partner Center supports the following systems:

    - [Dynamics 365](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics) for Customer Engagement
    - [Marketo](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-marketo)
    - [Salesforce](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce)

    > [!NOTE]
    > If your CRM system isn&#39;t listed above, use [Azure Table](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table) or [Https Endpoint](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-https) to store customer lead data, then export the data to your CRM system.

2. Connect your offer to the lead destination when publishing in Partner Center.
3. Confirm that the connection to the lead destination is configured properly. After you publish it in Partner Center, we&#39;ll validate the connection and send you a test lead. While you preview the offer before it goes live, you can also test your lead connection by trying to purchase the offer yourself in the preview environment.
4. Make sure the connection to the lead destination stays updated so you don&#39;t lose any leads.

Here are some additional lead management resources:

- [Lead management overview](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-get-customer-leads)
- [Lead management FAQs](https://docs.microsoft.com/azure/marketplace/lead-management-for-cloud-marketplace#frequently-asked-questions)
- [Common lead configuration errors](https://docs.microsoft.com/azure/marketplace/lead-management-for-cloud-marketplace#common-lead-configuration-errors-during-publishing-on-cloud-partner-portal)
- [Lead Management Overview](https://assetsprod.microsoft.com/mpn/cloud-marketplace-lead-management.pdf) PDF (Make sure your pop-up blocker is turned off)

Select **Save draft** before continuing to the next section, Properties.

### Properties

This page lets you set the primary product that your consulting service offer best covers, set a consulting service type, and choose applicable products.

1. Select a **Primary product** from the drop-down list.
2. Select a **Consulting service type** from the drop-down list:

    - **Assessment** : An evaluation of a customer&#39;s environment to determine the applicability of a solution and provide an estimate of cost and timing.
    - **Briefing** : An introduction to a solution or a consulting service to draw customer interest by using frameworks, demos, and customer examples.
    - **Implementation** : A complete installation that results in a fully working solution. Limit to solutions that can be implemented in two weeks or less.
    - **Proof of concept** : A limited-scope implementation to determine whether a solution meets customer requirements.
    - **Workshop** : An interactive engagement conducted on a customer&#39;s premises. It can involve training, briefings, assessments, or demos built on the customer&#39;s data or environment.

1. If you selected a primary product of **Azure**, select up to three **Solution Areas**. These make it easier for customers in Azure Marketplace to find your offer. If you didn&#39;t choose Azure, skip this step.
2. If you selected a primary product _other_ than Azure, select up to three **Applicable products**. These make it easier for customers in AppSource to find your offer. For details, see [Microsoft AppSource Consulting Service Listing Guidelines](https://go.microsoft.com/fwlink/?LinkId=828734&amp;clcid=0x409) (PDF).
3. Select up to six **Industries** that your offer applies to. This will make it easier for customers to find your offer.
4. Add up to three **Competencies** that your company has earned to display on your consulting service offer listing. At least one competency is required except for Azure Expert MSP&#39;s and Azure Networking MSP&#39;s.

Select **Save draft** before continuing to the next section, Offer listing.

## Offer listing

Here you&#39;ll define the offer details that are displayed in the marketplace. This includes the offer name, description, images, and so on. Be sure to follow the policies detailed on [Microsoft&#39;s policy page](https://docs.microsoft.com/legal/marketplace/certification-policies#800-consulting-services) while configuring this offer.

> [!NOTE]
> Offer details aren&#39;t required to be in English if the offer description begins with the phrase, &quot;This application is available only in [non-English language].&quot; It&#39;s also okay to provide a Useful Link to offer content in a language that&#39;s different from the one used in the Offer listing details.

### Name

The name you enter here displays as the title of your offering. This field is pre-filled with the text you entered in the **Offer alias** box when you created the offer. You can change this name later.

The name:

- Can be trademarked (and you may include trademark or copyright symbols).
- Can&#39;t be more than 50 characters long.
- Can&#39;t include emojis.

### Search results summary

Provide a short description of your offer. This can be up to 100 characters long and is used in marketplace search results.

### Description

Provide a longer description of your offer, up to 3,000 characters. This is displayed to customers in the marketplace listing overview.

Include one or more of the following in your description:

- The value and key benefits your offer provides
- Category or industry associations, or both
- In-app purchase opportunities
- Any required disclosures

Here are some tips for writing your description:

- Clearly describe the value of your offer in the first few sentences of your description. Include the following items:
  - Description of the offer.
  - The type of user that benefits from the offer.
  - Customer needs or issues the offer addresses.
- Remember that the first few sentences might be displayed in search results.
- Don&#39;t rely on features and functionality to sell your product. Instead, focus on the value your offer provides.
- Try to use industry-specific vocabulary or benefit-based wording.

To make your description more engaging, use the rich text editor to format your description. The rich text editor lets you add numbers, bullets, bold, italics, and indents to make your description more readable.

:::image type="content" source="media/cs-rich-text-editor.png" alt-text="Illustrates the rich text editor to write the offer description." border="false":::

### Keywords

Enter up to three search keywords that are relevant to your primary product and consulting service. These will make it easier to find your offer.

### Duration

Set the expected duration of this engagement with your customer.

### Contact Information

You must provide the name, email, and phone number for a **Primary** and **Secondary contact**. This information isn&#39;t shown to customers. It is available to Microsoft and may be provided to Cloud Solution Provider (CSP) partners.

### Supporting documents

Add up to three (but at least one) supporting PDF documents for your offer.

### Marketplace images

Provide logos and images to use with your offer. All images must be in .png format. Blurry images will be rejected.

#### Store logos

Provide .png files of your offer&#39;s logo in each of the following pixel sizes:

- **Small (48 x 48)**
- **Large (216 x 216)**

All logos are required and are used in different places in the marketplace listing.

#### Screenshots (optional)

Add up to five screenshots that show how your offer works. Each must be 1280 x 720 pixels in size and in .png format.

#### Videos (optional)

Add up to four videos that demonstrate your offer. Enter the video&#39;s name, its web address (URL), and a thumbnail .png image of the video at 1280 x 720 pixels in size.

Select **Save draft** before continuing to the next section, Pricing and availability.

## Pricing and availability

Here you'll define elements such as pricing, market, and a private key.

1. **Market**: Set the market your offer will be available in. You may only select one market per offer.
    1. For the United States or Canada markets, select **Edit states** (or **provinces**) to specify where your offer will be available.
2. **Preview Audience**: Configure the **Hide Key** used to set the private audience for your offer.
3. **Pricing**: Specify whether your offer is a **Free** or **Paid** offer.

    > [!NOTE]
    > Consulting Service offers are for the listing only. Any transactions will happen directly, outside of the commercial marketplace.

4. For a paid offer, specify the **Price and currency** and whether the price is **Fixed** or **Estimated**. If Estimated, you must specify in the description what factors will affect the price.
5. Select **Save draft**.

## Review and publish

After you've completed all the required sections of the offer, you can submit your offer to review and publish.

1. When you're ready to publish your consulting service offer, click **Review and publish**.
2. Review the details on the final submission page.
3. If necessary, write a note to the certification team if you believe any of the details of your offer require explanation.
4. When you're ready, select **Submit**.
5. The **Offer overview** page shows what publishing stage your offer is in.

For more information about how long you can expect your offer to be in each publishing stage, see [Check the publishing status of your Commercial Marketplace offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/publishing-status).

## Update your existing consulting service offers

- [Update an existing offer in the commercial marketplace](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer)
