---
title: Third-party app license management through Microsoft
description: Learn about managing third-party app licenses through Microsoft.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.date: 04/30/2021
---

# Third-party app license management through Microsoft

> [!IMPORTANT]
> This capability is currently in Public Preview.

Applies to the following offer type:

- Dynamics 365 for Customer Engagement & Power Apps

_Third-party app license management through Microsoft_ enables independent software vendors (ISVs) who build solutions using Dynamics 365 suite of products to manage their licenses in Partner Center to monetize their apps. Managing your app licenses through Microsoft helps you to enforce licensing on your apps without having to understand the licensing stack or manage a high scale licensing solution.

> [!NOTE]
> Third-party app license management through Microsoft is only available to ISVs participating in the ISV Connect program and supports only non-transact offers.

## Prerequisites

To manage your app licenses through Microsoft, you need to comply with the following pre-requisites.

1. Have a valid [Microsoft Partner Network account](/partner-center/mpn-create-a-partner-center-account).
1. Be signed up for commercial marketplace program. For more information, see [Create a commercial marketplace account in Partner Center](create-account.md).
1. Be signed up for the [ISV Connect program](https://partner.microsoft.com/solutions/business-applications/isv-overview). For more information, see [Microsoft Business Applications Independent Software Vendor (ISV) Connect Program onboarding guide](business-applications-isv-program.md).
1. Your developer team has the development environments and tools required to create Dataverse solutions.

## High-level process

The following list illustrates the high-level process to manage third-party apps through Microsoft:

1. The ISV creates a licensable offer in the commercial marketplace program in Partner Center and publishes the offer to Microsoft AppSource.
1. Customers interested in purchasing licenses from the ISV contact the ISV through AppSource, entering their information for a lead.
1. The ISV sells licenses to customers outside of the Microsoft system. This means that Microsoft is not involved in the transaction.
1. After a sale is made, the ISV registers the deal in Partner Center.
1. The customer assigns licenses to their users in Microsoft 365 admin center.
1. The customer installs the app and runs it in Microsoft Power Platform.
1. The ISV monitors app usage in Partner Center.

## Enabling app license management through Microsoft

When creating an offer, there are two check boxes used to enable app license management on an offer:

- The first box is called **Enable app license management through Microsoft**. If this box is selected, then customers will see a **Get it now** button on the offer listing page in AppSource. Customers can select this button to contact you to purchase licenses for the app. When you select this box, a second box appears.
- The second box is called **Allow customers to install my app even if licenses are not assigned**. Selecting this box enables customers to use the base features of the app without a license. To allow customers to install your app without a license, you need to configure your solution package to not require a license.

When only the first check box is selected, customers will see the **Contact Me** button on the offer listing page in AppSource. When both check boxes are selected, customers will see both the **Get it now** and the **Contact me** buttons. Users who want to try your free installation option can select **Get It Now**, which brings them to the Power Platform Admin Center, where they can install the app. Users can still select **Contact Me** if they have questions, or if they want to upgrade to a paid plan.

For more information about configuring an offer, see [How to create a Dynamics 365 for Customer Engagement & Power App offer](dynamics-365-customer-engage-offer-setup.md).

## Listing page on AppSource

After your offer is published, the listing option(s) you chose for your offer appears as a button in the upper-left corner of your offer’s listing page. A listing page for an offer that’s enabled for app management through Microsoft can have one or both of the following buttons:

- **Get it now**: This button is shown if an app license not required.
- **Contact me**: This button is shown if an app license required.

This screenshot shows an offer listing page on AppSource with the **Get it now** and **Contact me** buttons.

:::image type="content" source="./media/third-party-license/f365.png" alt-text="Screenshot of an offer listing page on AppSource. The Get it now and Contact me buttons are shown.":::

***Figure 1: Offer listing page on Microsoft AppSource***

## Next steps

- [Plan a Dynamics 365 offer](marketplace-dynamics-365.md)
- [How to create a Dynamics 365 for Customer Engagement & Power App offer](dynamics-365-customer-engage-offer-setup.md)
