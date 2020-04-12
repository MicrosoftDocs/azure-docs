---
title: Configure customer leads | Azure Marketplace
description: Configure customer leads in commercial marketplace.
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: dsindona
---

# Customer leads from your marketplace offer

Leads are customers interested in, or deploying your offers from the [Azure Marketplace](https://azuremarketplace.microsoft.com) or from [AppSource](https://appsource.microsoft.com). You will receive customer leads once your offer is published to the marketplace. This article will explain:

* How your marketplace offer generates customers leads, ensuring that you don't miss business opportunities. 
* Connect your CRM to your offer, so you can manage your leads in one central location.
* Understand the lead data we send you, so you can follow up on customers who reached out to you.

## Generate customer leads

Here are places where a lead is generated:

1. When a customer consents to sharing their information after selecting "Contact me" from the marketplace. This lead is an **initial interest** lead, where we share information about the customer who has expressed interest in getting your product. The lead is the top of the acquisition funnel.

      ![Dynamics 365 Contact Me](./media/commercial-marketplace-get-customer-leads/dynamics-365-contact-me.png)

2. When a customer selects "Get it Now" or "Create" (in the [Azure portal](https://portal.azure.com/)) to get your offer, this lead is an **active lead**, where we share information about a customer who has started to deploy your product.

    ![SQL Get it Now](./media/commercial-marketplace-get-customer-leads/sql-get-it-now.png)

    ![Windows Server Create](./media/commercial-marketplace-get-customer-leads/windows-server-create.png)

3. A customer takes a "Test Drive" or starts a "Free Trial" of your offer. Test Drives or free trials are accelerated opportunities for you to share your business instantly with potential customers without any barriers of entry.

    ![Dynamics 365 Test Drive](./media/commercial-marketplace-get-customer-leads/dynamics-365-test-drive.png)

    ![Dynamics 365 Test Drive](./media/commercial-marketplace-get-customer-leads/dynamics-365-free-trial.png)

## Connect to your CRM system

[!INCLUDE [Test drive content](./includes/connect-lead-management.md)]

## Understand lead data

Each lead you receive during the customer acquisition process has data in specific fields. The first field to look out for is the `LeadSource` field, which follows this format: **Source-Action** | **Offer**.

**Sources**: The value for this field is populated based on the marketplace that generated the lead. Possible values are `"AzureMarketplace"`, `"AzurePortal"`, and `"AppSource (SPZA)"`.

**Actions**: The value for this field is populated based on the action the customer took in the marketplace, which generated the lead. 

Possible values are:

- "INS" -- Installation. This action is on Azure Marketplace or
AppSource when a customer buys your product.
- "PLT" -- Stands for Partner Led Trial. This action is on AppSource when a customer uses the Contact me option.
- "DNC" -- Do Not Contact. This action is on AppSource when a
Partner who was cross listed on your app page gets requested to be
contacted. We're sharing the heads up that this customer was cross
listed on your app, but they don't need to be contacted.
- "Create" -- This action is only inside the Azure portal and is generated when a customer purchases your offer to their account.
- "StartTestDrive" -- This action is for only for Test Drives, and is generated when a customer starts their test drive.

**Offers**: You may have multiple offers in the marketplace. The value for this field is populated based on the offer that generated the lead. The Publisher ID and Offer ID are both sent in this field and are values you provided when you published the offer to the marketplace.

The following examples show example values in the expected format `publisherid.offerid`: 

1. `checkpoint.check-point-r77-10sg-byol`
1. `bitnami.openedxcypress`
1. `docusign.3701c77e-1cfa-4c56-91e6-3ed0b622145`

## Customer Info

The customer's information is sent via multiple fields. The following example shows the customer information that's contained in a lead.

- FirstName: John
- LastName: Smith
- Email: jsmith\@microsoft.com
- Phone: 1234567890
- Country: US
- Company: Microsoft
- Title: CTO

>[!Note]
>Not all the data in the previous example is always available for each lead. Because you'll get leads from multiple steps as mentioned in the Customer Leads section, the best way to handle the leads is to de-duplicate the records and personalize the follow-ups. This way each customer is getting an appropriate message, and you're creating a unique relationship.

## Best practices for lead management

1. *Process* - Define a clear sales process, with milestones, KPIs, and clear team ownership.
2. *Qualification* - Define prerequisites, which indicate whether a lead has been fully qualified. Ensure sales or marketing representatives qualify leads carefully before taking them through the full sales process.
3. *Follow up* - Don't forget to follow up, expect the typical transaction to require 5 to 12 follow-up calls
4. *Nurture* - Nurture your leads, in order to get you on the way to a higher profit margin.

## Leads frequently asked questions

### Where can I get help in setting up my lead destination?

You can find documentation [here](#connect-to-your-crm-system) or submit a support ticket through aka.ms/marketplacepublishersupport then select **'offer creation'** → **your type of offer** → **'lead management configuration.'**

### Am I required to configure a lead destination in order to publish an offer on the marketplace?

The answer depends on the type of offer you are publishing. SaaS and Dynamics 365 for Customer Engagement offers to list as 'Contact Me', all Dynamics 365 for Operations offers, all Dynamics 365 Business Central offers, and all Consulting Service offers require a connection to a lead destination. If your offer type was not listed, then it is not required. However, it is recommended you configure a lead destination so you don't miss business opportunities.

### How can I find the test lead?

Search for `"MSFT_TEST"` in your lead destination, here's a sample test lead from Microsoft:

```
company = MSFT_TEST_636573304831318844
country = US
description = MSFT_TEST_636573304831318844
email = MSFT_TEST_636573304831318844@test.com
encoding = UTF-8
encoding = UTF-8
first_name = MSFT_TEST_636573304831318844
last_name = MSFT_TEST_636573304831318844
lead_source = MSFT_TEST_636573304831318844-MSFT_TEST_636573304831318844|<Offer Name>
oid = 00Do0000000ZHog
phone = 1234567890
title = MSFT_TEST_636573304831318844
```

### I have a live offer, but I'm not seeing any leads?

Make sure your connection to the lead destination is valid. We will send you a test lead after you hit publish on your offer in Partner Center. If you see the test lead, then the connection is valid. You can also test your lead connection by trying to acquire the offer preview during the preview step by clicking "get it now", "contacts me" or "free trial" on the listing in the marketplace.

Also, make sure you are looking for the right data. The content in the [Understand lead data](#understand-lead-data) section of this document describes the lead data we send to your lead destination.

### I have configured Azure BLOB as my lead destination, why don't I see the lead?

The Azure Blob lead destination is no longer supported so you are missing any customer leads generated by your offer. Switch to any of the other [lead destination options](./commercial-marketplace-get-customer-leads.md). 

### I received an email from Marketplace, why can't I find the lead in my CRM?

It's possible that the end user's email domain is from .edu. For privacy reasons, we don't pass private identifiable information from .edu domain. Submit a support ticket through aka.ms/marketplacepublishersupport.

### I have configured Azure Table as my lead destination, how can I view the leads?

You can access the lead data stored in the Azure Table from the Azure Portal, or you can download and install [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) for free to view your Azure storage account's tables data.

### I have configured Azure Table as my lead destination, can I get notified whenever a new lead is sent by Marketplace?

Yes, follow the instructions to set up a Microsoft flow that sends an email if a lead is added to the Azure Table on the documentation [here](./commercial-marketplace-lead-management-instructions-azure-table.md).

### I have configured Salesforce as my lead destination, why can't I find the leads?

Check if the "web to lead" form is a mandatory field based on a picklist. If yes, switch over the field to a non-mandatory text field.

### There was an issue with my lead destination, and I missed some leads. Can I have them sent to me in an email?

Due to private identifiable information policies, we cannot share lead information through unsecured email.

### I have configured Azure Table as my lead destination, how much will it cost?

Lead gen data is low (<1 GB for almost all publishers). The cost will depend on number of leads received, if 1,000 leads are received in a month, it costs around 50 cents. For more information about storage pricing, see [storage pricing](https://azure.microsoft.com/pricing/details/storage/).

If your question is still not answered, contact Support through aka.ms/marketplacepublishersupport, then select **'offer creation'** → **your type of offer** → **'lead management configuration.'** 

### I am receiving email notifications when new customer leads are received. How can I configure who to receive these emails?

Access your offer in Partner Center and navigate to the **Offer setup** page -> **Lead Management** -> **Edit**. Update the email addresses under the **Contact email** field.

## Next steps

Once the technical set-up is in place, you should incorporate these leads into your current sales & marketing strategy and operational processes. We are interested in better understanding your overall sales process and want to work closely with you on providing high-quality leads and enough data to make you successful. We welcome your feedback on how we can optimize and enhance the leads we send you with additional data to help make these customers successful. Let us know if you're interested in [providing
feedback](mailto:AzureMarketOnboard@microsoft.com) and suggestions to enable your sales team to be more successful with Marketplace Leads.
