---
title: 'Publish Solutions to Microsoft Sentinel'
description: This article guides you through the process of publishing solutions to Microsoft Sentinel.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: how-to 
ms.date: 10/08/2024

#CustomerIntent: As a ISV partner, I want to publish my solutions to Azure Marketplace so that customers can find and install the solutions from Sentinel content hub.
---

# Publish solutions to Microsoft Sentinel

[Microsoft’s commercial marketplace](https://azuremarketplace.microsoft.com/home) is an online marketplace for applications and services that lets businesses of all sizes offer solutions to customers around the world. As an independent software vendor (ISV) member of the Partner Program, you can create, publish, and manage your Sentinel solutions in Partner Center. Your solutions are listed together with other Microsoft solutions, connecting you to businesses, organizations, and government agencies around the world. Sentinel solutions published in the marketplace are available to customers in Azure Marketplace and Microsoft Sentinel content hub.

This article walks you through the process of publishing your solutions to Microsoft Sentinel.

## Prerequisites

- **Solution code approved in GitHub**. Ensure that the Microsoft Sentinel team approved your solution and that the code is merged to the main branch of the GitHub repository. Once approved, your solution is available in the GitHub repository for Microsoft Sentinel at "https://github.com/Azure/Azure-Sentinel/tree/\<Your branch\>/Solutions/\<Your Solution Folder\>." If you don't find your solution in the GitHub repository, reach out to the Microsoft Sentinel team for assistance.

- **Solution package created**. Your solution package must be created and uploaded to the GitHub repository and should be available at "https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/\<Your Solution Folder\>/Package" folder with the correct version. The solution package contains the *createUiDefinition.json* and *mainTemplate.json* files which are required for correctly listing solutions in Azure Marketplace and Sentinel content hub.
 
- **Commercial Marketplace account created**. : If your company already has an account, you don’t need to create a new account. The same account can be used for publishing any solutions, including Sentinel. If your company is a first-time publisher to Microsoft commercial marketplace, you need to go through a onetime registration process. Follow [these steps](/partner-center/account-settings/create-account#create-a-partner-center-account-and-enroll-in-the-commercial-marketplace) to sign up for a commercial marketplace account. 

Once you successfully sign up for the commercial marketplace account, a unique Publisher ID is generated and you get access to the authoring and publishing experience in partner center. Using partner center, you can create, certify, and publish your solutions for Microsoft customers. 

[!INCLUDE [reference-to-feature-availability](includes/pre-register.md)]

## Create offer in Partner Center
Follow the below steps to create the offer and configure the top level attributes for your solution in Partner Center.
1. Sign in to [Partner Center](https://partner.microsoft.com/) with your account.
1. Select "Marketplace offers" -
 
:::image type="content" source="media/sentinel-partner-content/partner-center-offers-home.png" alt-text="Screenshot of partner center home page":::   

1. Select "New offer" and then select "Azure application."

:::image type="content" source="media/sentinel-partner-content/partner-center-new-offer.png" alt-text="Screenshot of new offer option in partner center":::   

1. Enter offer ID, offer alias, and select the publisher ID using which you want to publish Sentinel solutions (in case you have multiple accounts). Offer ID and offer alias are only visible to you in your partner center account (not visible to customers). The offer ID is part of the solution URL in Azure Marketplace once your solution is successfully published (ex- https://azuremarketplace.microsoft.com/marketplace/apps/\<*You offer ID*\>?tab=Overview)
    1. **Offer ID entered here should be the same as Offer ID mentioned in the SolutionMetadata.json file in your solution folder in GitHub** - https://github.com/Azure/Azure-Sentinel/blob/\<Your Branch\>/Solutions/\<Your Solution\>/SolutionMetadata.json 
    1. Recommended naming convention for offer ID is azure-sentinel-solution-\<your-solution-name\> (ex- azure-sentinel-solution-ciscoumbrella). 
    
[!INCLUDE [reference-to-feature-availability](includes/partner-cant-change-details.md)]

:::image type="content" source="media/sentinel-partner-content/partner-center-new-azure-application.png" alt-text="Screenshot of offer id and offer name configuration":::   

## Offer setup
Follow the below steps to configure the properties under the *offer setup* tab in Partner Center. This screen shows the selections made during initial offer creation. You can change the offer alias from this page (if needed). 
1. **Offer ID:** The Offer ID is unique to your specific solution. Offer ID on this page is read-only.
1. **Alias:** Although the alias name doesn't appear publicly, alias is used by the Sentinel team to locate your solution. Ensure that the alias name matches exactly with the "Offer Listing" name and the "Plan Listing" name. We strongly recommend listing the solution title as follows:
    1. [Company Name] [Product Name] for Microsoft Sentinel. For example: Cisco Umbrella for Microsoft Sentinel
1. **Test Drive:** Leave "Enable a test drive." unchecked. This feature isn't supported for Sentinel solutions.
1. **Customer Leads:** You can provide connection details to the CRM system where you would receive customer leads. [Learn more about configuring customer leads](/partner-center/marketplace-offers/partner-center-portal/commercial-marketplace-get-customer-leads#connect-to-your-crm-system). This step is optional and can be done after your solution is public.

## Offer Properties
Follow the below steps to configure the properties under the *Properties* tab in Partner Center. 
1. **Primary Category:** Primary category is required to provide better categorization of products in the marketplace. For adding a category, select the "+ Categories" link. **For Sentinel solutions, primary category must be Security.** You can select up to two subcategories for more granular classification of your solution.
1. Leave application type as *Default (Azure Application)*. Make no changes.
1. **Legal:** Here you have three options to choose from - 
    1. Use the standard contract
    1. Provide terms and conditions link
    1. Provide terms and conditions text. 
    
Choose the option that works best for you. If you select the standard contract, the options to share Terms & Conditions are hidden. 

:::image type="content" source="media/sentinel-partner-content/partner-center-offer-properties.png" alt-text="Screenshot of offer properies tab in partner center":::  

[!INCLUDE [reference-to-feature-availability](includes/partner-save-details.md)]

## Offer Listing
Follow the below steps to configure the properties under the *Offer listing* tab in Partner Center. The parameters that you set in this tab define how customers can find your solution and what information they see for your solution. 
1. **Name:** Enter a descriptive name for the offer. This name is used to list the offer in the marketplace.
1. **Search results summary:** A single sentence summarizing the purpose or function of the offer, written in plain text with no line breaks. The summary appears on your offer’s search results page.
1. **Short description:** Provide a two to three line overview of your solution. This text shows up on the solution detail page in marketplace.
1. **Description:** Detailed description of your solution which shows up in both marketplace and in Sentinel’s content hub. Use markup appropriately to convey the right information to customers. In addition to detailed solution description, we recommend including the below details – 
    1. Link to Release notes (in GitHub) which has more details about the current solution. File path - https://github.com/Azure/Azure-Sentinel/blob/\<Your branch\>/\<Your solution\>/ReleaseNotes.md
    1. Type of content included in your solution. For example, **Data Connectors**: 1, **Parsers**: 1, Workbooks: 1, **Analytic Rules**: 10, **Hunting Queries**: 10. 
1. **Search keywords** – You can list upto three search keywords that customers can use to find your solution in the Marketplace. 
    1. You must add the GUID *f1de974b-f438-4719-b423-8bf704ba2aef* as one of your search keywords. **If this keyword is not added, your solution would not show up in Sentinel.** 
    1. We strongly recommend that you include the word Sentinel (can be Sentinel, \<Your product name\> for Sentinel etc.) as one of the search keywords. These keywords are commonly used by customers to find Sentinel solutions in Azure Marketplace.
    1. Here you can use your company name, product name, or any other text that you think is relevant for your solution.
1. **Privacy policy link** – Working link to the privacy policy page of your company that applies to the solution that you're publishing.
1. **Product information links** – By clicking on "Add a link", you can add one or more links that are relevant for your solution. You can add a link to your company page, product details page etc. 
    1. We strongly recommend that you include a link for customers to learn more about Sentinel (text - Microsoft Sentinel, URL - https://aka.ms/azuresentinel) 
1. **Contact information –** 
    1. **Support contact:** Contact info for Microsoft partners to use when customers open support tickets. This information isn't listed in the marketplace. Name, email, phone number, and support website are mandatory.
    1. **Engineering contact -** Contact info for Microsoft to use when there are issues with your offer including certification issues. This information isn't listed in the marketplace. Name, email, and phone number are mandatory.
    1. **Cloud solution provider program contact –** In addition to publishing your offers through commercial marketplace online stores, you can also sell through the Cloud Solution Provider (CSP) program to reach millions of qualified Microsoft customers that the program serves. If you would like to share your solution through the CSP program, you need to provide the contact details that CSP partners can use for support and business issues. This info is only shown to CSP partners. You can learn more about the CSP program here
1. **Marketplace media -**
    1. **Logos** – Upload a logo for your company/product. 
    1. **Screenshots** – Add relevant screenshots of the solution (ex- workbooks) to highlight the usefulness of the solution. Appropriate screenshots enable customers to understand the solution value better.
    1. **Videos** - Add relevant screenshots of the solution. For instance, you can provide a quick overview of the solution and its benefits or have video on how customers can install the solution and get started.
    
## Preview audience
Add at least one Azure Subscription ID. You can enter your own subscription ID or your customer subscription IDs for whom you would like to enable preview access to your solution. Once you select "Go Live" for this offer, this list is ignored, and your solution would be visible to all customers.

- Previews provide an opportunity to test and validate your solution in a real environment before the solution becomes publicly available to all customers.
 
## Technical Configuration
Nothing to add here, you can ignore this section.

## Plan overview
A plan defines an offer's scope and limits, and the associated pricing when applicable. For example, depending on the offer type, you can select regional markets and choose whether a plan is visible to the public or only to a private audience. For Sentinel solution, only one plan is required. Select on the "Create new plan" and enter a plan ID and name. The plan ID should be unique in this offer and would be visible to customers in the product URL in Azure Marketplace (once published)
1. **Plan setup:** 
    1. **Plan type:** Should be "Solution template."
    1. **Azure regions** – Select Azure Global to ensure that customers can deploy your solution in all Azure public regions that have marketplace integration. 
1. **Plan listing**
    1. **Plan name:** Use the name you entered for "Name" in the Offer listing tab. Plan name is visible to customers in Azure Marketplace.
    1. **Plan summary:** Use the details you entered for "Short description" in the Offer listing tab.
    1. **Plan description:** Use the details you entered for "Description" in the Offer listing tab.
1. **Availability:** 
    1. **Plan visibility:** Set plan visibility to Public if you want the plan to be available for everyone in the Azure portal and Azure Marketplace.
    1. **Hide plan:** Leave the check box unchecked. If you check this box, your solution does now show up in Sentinel content hub.
1. Technical configuration: 
    1. **Version:** Enter the version number of the package you're uploading. The version number should be the same as the latest approved package version in GitHub. Package path in GitHub - https://github.com/Azure/Azure-Sentinel/tree/\<Your branch\>/\<Your solution\>/Package 
    1. **Package File (zip):** Upload the matching package zip file with the same version number you entered for version. **Make sure that you always upload the latest approved version.**

Select on "Save draft" before you proceed.

## Co-sell with Microsoft
No changes required; you can ignore this section.

## Resell through CSPs
You can opt whether you want to expand the reach of your solution by offering it through Microsoft’s Cloud Solution Providers (CSP) program. Here you can use from three options which define which of the CSP partners can resell your solution. You can choose any partner, specific list of partners, or you can choose to opt out.

## Review and Publish
After you enter all the details, select on each of the tabs to review your offer for errors/omissions. When you're ready, select on the "Review and publish" from any of the tabs. The review page shows the status of your submission for each of the tabs (Complete, Incomplete). Publish button is enabled only if all the required details are filled out,  that is, status shows as Complete for all tabs. For the pages with status as Incomplete, select on the page link to fill out the missing details and select "Review and publish" again.

In this screenshot, only the Offer setup and Technical configuration pages are fully filled out and the rest have missing details.

:::image type="content" source="media/sentinel-partner-content/partner-center-offers-missing-details.png" alt-text="Screenshot of Review and publish page in Partner center showing missing details":::  

Once you fill out all the details and publish the solution, your solution goes through a series of checks before it goes live in Azure Marketplace and Sentinel content hub.

## Next steps
> [!div class="nextstepaction"]
> [What happens after you publish your solution?](sentinel-solutions-post-publish-tracking.md)