---
title: How to add a preview audience for your SaaS offer in the Microsoft commercial marketplace
description: How to add a preview audience for your software as a service (SaaS) offer in Microsoft Partner Center. 
author: mingshen-ms
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 09/02/2020
---

# How to add a preview audience for your SaaS offer

As you create your software as a service (SaaS) offer in Partner Center, you need to define a preview audience who can review your offer listing before it goes live. This article explains how to configure a preview audience.

> [!NOTE]
> If you choose to process transactions independently, you will not see this option. Instead, skip to [How to market your SaaS offer](create-new-saas-offer-marketing.md).

## Define a preview audience

On the **Preview audience** tab, you can define a limited audience who can review your SaaS offer before you publish it live to the broader marketplace audience. You can send invites to Microsoft Account (MSA) or Azure Active Directory (Azure AD) email addresses. Add a minimum of one and up to 10 email addresses manually or import up to 20 with a .csv file. You can update the preview audience list at any time.

> [!NOTE]
> A preview audience differs from a private audience. A preview audience is allowed access to your offer before it’s published live in the online stores. You may also choose to create a plan and make it available only to a private audience. Private plans are explained in [How to create plans for your SaaS offer](create-new-saas-offer-plans.md).

### Add email addresses manually

1. On the **Preview Audience** page, add a single Azure AD or MSA email address and an optional description in the boxes provided.
1. To add another email address, select the **Add another email** link.
1. Select **Save draft** before continuing to the next tab: **Technical configuration**.
1. Continue to [How to add technical details for your SaaS offer](create-new-saas-offer-technical.md).

### Add email addresses using the CSV file

1. On the **Preview Audience** page, select the **Export Audience (csv)** link.
1. Open the .CSV file in an application, such as Microsoft Excel.
1. In the .CSV file, in the **ID** column, enter the email addresses you want to add to the preview audience.
1. In the **Description** column, you can optionally add a description for each email address.
1. In the **Type** column, add **MixedAadMsaId** to each row that has an email address.
1. Save the file as a .CSV file.
1. On the **Preview Audience** page, select the **Import Audience (csv)** link.
1. In the **Confirm** dialog box, select **Yes**.
1. Select the .CSV file and then select **Open**.
1. Select **Save draft** before continuing to the next tab: **Technical configuration**.

## Next steps

- [How to add technical details for your SaaS offer](create-new-saas-offer-technical.md)
