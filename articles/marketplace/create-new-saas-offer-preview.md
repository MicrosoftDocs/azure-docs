---
title: Add a preview audience and technical details for your SaaS offer 
description: How to add a preview audience and technical details for your software  as a service (SaaS) offer in Microsoft Partner Center. 
author: dannyevers 
ms.author: mingshen-ms
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 06/25/2020
---

# Add a preview audience and technical details for your SaaS offer

As you create your software as a service (SaaS) application in Partner Center, you need to define a preview audience who can review your offer listing before it goes live. You’ll then provide the technical details for your SaaS offer. This article explains how to configure a preview audience and technical details.

## Define a preview audience

On the **Preview audience** tab, you can define a limited audience who can review your software as a service (SaaS) offer before you publish it live to the broader marketplace audience.

> [!TIP]
> This tab is not visible if you choose to process transactions independently. If so, go to [Marketing options](create-new-saas-offer-marketing.md).

You can send invites to Microsoft Account (MSA) or Azure Active Directory (AAD) email addresses. Add up to 10 email addresses manually or import up to 20 with a .csv file. If your offer is already live, you can still define a preview audience for testing any changes or updates to your offer.

> [!NOTE]
> The preview audience differs from a private audience. A preview audience is allowed access to your offer prior to being published live in the marketplaces. You may also choose to create a plan and make it available only to a private audience. We’ll show you how to create a private plan later in this article.

**Add email addresses manually**

1. On the **Preview Audience** tab, add a single AAD or MSA email address and an optional description in the boxes provided.
2. To add another email, select the **Add another email** link.
3. Select **Save draft** before continuing to the next tab, **Technical configuration**.
4. Go to [Provide technical details](#provide-technical-details).

**Add email addresses using the CSV file**

1. On the **Preview Audience** tab, select the **Export Audience (csv)** link.
2. Open the .CSV file in an application, such as Microsoft Excel.
3. In the CSV file, in the **ID** column, enter the email addresses you want to add to the preview audience.
4. In the **Description** column, you can optionally add a description for each email address.
5. In the **Type** column, add **MixedAadMsaId** to each row that has an email address.
6. Save the file as a .CSV file.
7. On the **Preview Audience** tab, select the **Import Audience (csv)** link.
8. In the **Confirm** dialog box, select **Yes**.
9. Select the .CSV file and then select **Open**.
10. Select **Save draft** before continuing to the next tab, **Technical configuration**.

## Provide technical details

This section describes how to enter technical details that help the commercial marketplace connect to your solution.

On the **Technical configuration** tab, you'll define the technical details that the commercial marketplace uses to communicate to your SaaS application. This connection enables us to provision your offer for the end customer if they choose to acquire and manage it.

> [!NOTE]
> This tab is not visible if you choose to process transactions independently. If so, go to [Marketing options](create-new-saas-offer-marketing.md).

For details about these settings, see [Technical configuration](plan-saas-offer.md#technical-configuration). 

- **Landing page URL** (required) – Define the SaaS website URL (for example: `https://contoso.com/signup`) that your customers will land on after acquiring your offer from the marketplace and triggering the configuration process from the newly created SaaS subscription.

- **Connection webhook** (required) – For all asynchronous events that Microsoft needs to send to you (for example, SaaS subscription has been cancelled), we require you to provide a connection webhook URL. We will call this URL to notify you of the event. 

- **Azure Active Directory tenant ID** (required) – To find the tenant ID for your Azure Active Directory (AD) app, go to your Azure Active Directory and select **Properties**. Then look for the Directory ID number listed (for example, `50c464d3-4930-494c-963c-1e951d15360e`).

- **Azure Active Directory application ID** (required) – You also need your [application ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in). To get its value, go to your Azure Active Directory and select **App registrations**, then look for the Application ID number listed (for example, `50c464d3-4930-494c-963c-1e951d15360e`).

Select **Save draft** before continuing to the next tab, **Plan overview**.

## Next steps
- If you are selling your SaaS offer through Microsoft, continue to [Create plans for your SaaS offer](create-new-saas-offer-plans.md).
- If you are managing your own commerce transactions, go to [Marketing options for your Saas offer](create-new-saas-offer-marketing.md).
