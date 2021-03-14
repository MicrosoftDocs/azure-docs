---
title: Lead management from Microsoft commercial marketplace
description: Learn about generating and receiving customer leads from your Microsoft AppSource and Azure Marketplace offers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: trkeya
ms.author: trkeya
ms.date: 10/01/2020
---

# Customer leads from your commercial marketplace offer

Leads are customers interested in or deploying your offers from [Microsoft AppSource](https://appsource.microsoft.com) and [Azure Marketplace](https://azuremarketplace.microsoft.com). You can receive customer leads after your offer is published to the commercial marketplace. This article explains the following lead management concepts:

* How your commercial marketplace offer generates customer leads to ensure that you don't miss business opportunities. 
* How to connect your customer relationship management (CRM) system to your offer so that you can manage your leads in one central location.
* The lead data we send you so that you can follow up on customers who reached out to you.

## Generate customer leads

Here are places where a lead is generated:

- A customer consents to sharing their information after they select **Contact me** from the commercial marketplace. This lead is an *initial interest* lead. We share information with you about the customer who has expressed interest in getting your product. The lead is the top of the acquisition funnel.

    ![Dynamics 365 Contact Me](./media/commercial-marketplace-get-customer-leads/dynamics-365-contact-me.png)

- A customer selects **Get It Now** (or selects **Create** in the [Azure portal](https://portal.azure.com/)) to get your offer. This lead is an *active* lead. We share information with you about the customer who has started to deploy your product.

    ![SQL Get It Now button](./media/commercial-marketplace-get-customer-leads/sql-get-it-now.png)

    ![Windows Server Create button](./media/commercial-marketplace-get-customer-leads/windows-server-create.png)

- A customer selects **Test Drive** or **Free Trial** to try out your offer. Test drives or free trials are accelerated opportunities for you to share your business instantly with potential customers without any barriers of entry.

    ![Dynamics 365 Test Drive button](./media/commercial-marketplace-get-customer-leads/dynamics-365-test-drive.png)

    ![Dynamics 365 Free Trial button](./media/commercial-marketplace-get-customer-leads/dynamics-365-free-trial.png)

## Connect to your CRM system

[!INCLUDE [Links to lead configuration for different CRM systems](./includes/connect-lead-management.md)]

## Understand lead data

Each lead you receive during the customer acquisition process has data in specific fields. The first field to look out for is the `LeadSource` field, which follows this format: **Source-Action** | **Offer**.

**Sources**: The value for this field is populated based on the marketplace that generated the lead. Possible values are `"AzureMarketplace"`, `"AzurePortal"`, and `"AppSource (SPZA)"`.

**Actions**: The value for this field is populated based on the action the customer took in the marketplace that generated the lead.

Possible values are:

- **"INS"**: Stands for *installation*. This action is in Azure Marketplace or AppSource when a customer acquires your product.
- **"PLT"**: Stands for *partner-led trial*. This action is in AppSource when a customer selects the **Contact me** option.
- **"DNC"**: Stands for *do not contact*. This action is in AppSource when a partner who was cross-listed on your app page gets requested to be contacted. We share a notification that this customer was cross-listed on your app, but they don't need to be contacted.
- **"Create"**: This action is only inside the Azure portal and is generated when a customer purchases your offer to their account.
- **"StartTestDrive"**: This action is only for the **Test Drive** option and is generated when a customer starts their test drive.

**Offers**: You might have multiple offers in the commercial marketplace. The value for this field is populated based on the offer that generated the lead. The publisher ID and offer ID are both sent in this field and are values you provided when you published the offer to the marketplace.

The following examples show values in the expected format `publisherid.offerid`: 

- `checkpoint.check-point-r77-10sg-byol`
- `bitnami.openedxcypress`
- `docusign.3701c77e-1cfa-4c56-91e6-3ed0b622145`

## Customer information

The customer's information is sent via multiple fields. The following example shows the customer information that's contained in a lead:

- FirstName: John
- LastName: Smith
- Email: jsmith\@microsoft.com
- Phone: 1234567890
- Country: US
- Company: Microsoft
- Title: CTO

>[!NOTE]
>Not all the data in the previous example is always available for each lead. Because you'll get leads from multiple steps as mentioned in the "Generate customer leads" section, the best way to handle the leads is to de-duplicate the records and personalize the follow-ups. This way each customer gets an appropriate message, and you create a unique relationship.

## Best practices for lead management

Here are some recommendations for driving leads through your sales cycle:

- **Process**: Define a clear sales process, with milestones, analytics, and clear team ownership.
- **Qualification**: Define prerequisites, which indicate whether a lead was fully qualified. Make sure sales or marketing representatives qualify leads carefully before taking them through the full sales process.
- **Follow-up**: Don't forget to follow up within 24 hours. You will get the lead in your CRM of choice immediately after the customer deploys a test drive; email them within while they are still warm. Request scheduling a phone call to better understand if your product is a good solution for their problem. Expect the typical transaction to require numerous follow-up calls.
- **Nurture**: Nurture your leads to get you on the way to a higher profit margin. Check in, but don't bombard them. We recommend you email leads at least a few times before you close them out; don't give up after the first attempt. Remember, these customers directly engaged with your product and spent time in a free trial; they are great prospects.

After the technical setup is in place, incorporate these leads into your current sales and marketing strategy and operational processes. We're interested in better understanding your overall sales process and want to work closely with you to provide high-quality leads and enough data to make you successful. We welcome your feedback on how we can optimize and enhance the leads we send you with additional data to help make these customers successful. Let us know if you're interested in [providing
feedback](mailto:AzureMarketOnboard@microsoft.com) and suggestions to enable your sales team to be more successful with commercial marketplace leads.

## Next steps

- [Lead management FAQ and troubleshooting](../lead-management-faq.md)