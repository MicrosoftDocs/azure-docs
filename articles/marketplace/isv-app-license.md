---
title: ISV app license management - Microsoft AppSource and Azure Marketplace
description: Learn about managing ISV app licenses through Microsoft.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.date: 04/30/2021
---

# ISV app license management

Applies to the following offer type:

- Dynamics 365 for Customer Engagement & Power Apps

_ISV app license management_ enables independent software vendors (ISVs) who build solutions using Dynamics 365 suite of products to manage and enforce licenses for their solutions using systems provided by Microsoft. By adopting this approach you can:

- Enable your customers to assign and unassign your solution’s licenses using familiar tools such as Microsoft 365 Admin Center, which they use to manage Office and Dynamics licenses.
- Have the Power Platform enforce your licenses at runtime to ensure that only licensed users can access your solution.
- Save yourself the effort of building and maintaining your own license management and enforcement system.


> [!NOTE]
> ISV app license management is only available to ISVs participating in the ISV Connect program. Microsoft is not involved in the sale of licenses.

## Prerequisites

To manage your ISV app licenses, you need to comply with the following pre-requisites.

1. Have a valid [Microsoft Partner Network account](/partner-center/mpn-create-a-partner-center-account).
1. Be signed up for commercial marketplace program. For more information, see [Create a commercial marketplace account in Partner Center](create-account.md).
1. Be signed up for the [ISV Connect program](https://partner.microsoft.com/solutions/business-applications/isv-overview). For more information, see [Microsoft Business Applications Independent Software Vendor (ISV) Connect Program onboarding guide](business-applications-isv-program.md).
1. Your developer team has the development environments and tools required to create Dataverse solutions. Your Dataverse solution must include model-driven applications (currently these are the only type of solution components that are supported through the license management feature).

## High-level process

This table illustrates the high-level process to manage ISV app licenses:

| Step | Details |
| ------------ | ------------- |
| Step 1: Create offer | The ISV creates an offer in Partner Center and chooses to manage licenses for this offer through Microsoft. This includes defining one or more licensing plans for the offer. For more information, see [Create a Dynamics 365 for Customer Engagement & Power Apps offer on Microsoft AppSource](dynamics-365-customer-engage-offer-setup.md). |
| Step 2: Update package | The ISV creates a solution package for the offer that includes license plan information as metadata, and uploads it to Partner Center for publication to Microsoft AppSource. To learn more, see [Adding license metadata to your solution](/powerapps/developer/data-platform/appendix-add-license-information-to-your-solution). |
| Step 3: Purchase licenses | Customers discover the ISV’s offer in AppSource or directly on the ISV’s website. Customers purchase licenses for the plans they want directly from the ISV (these offers are not purchasable through AppSource at this time). |
| Step 4: Register deal | The ISV registers the purchase with Microsoft in Partner Center. As part of [deal registration](/partner-center/csp-commercial-marketplace-licensing#register-isv-connect-deal-in-deal-registration), the ISV will specify the type and quantity of each licensing plan purchased by the customer. |
| Step 5: Manage licenses | The license plans will appear in Microsoft 365 Admin Center for the customer to [assign to users or groups](/microsoft-365/commerce/licenses/manage-third-party-app-licenses) in their organization. The customer can also install the application in their tenant via the Power Platform Admin Center. |
| Step 6: Perform license check | When a user within the customer’s organization tries to run an application, Microsoft checks to ensure that user has a license before permitting them to run it. If they don’t have a license, the user sees a message explaining that they need to contact an administrator for a license. |
| Step 7: View reports | ISVs can view information on provisioned and assigned licenses over a period of time and by geography. |
|||

## Enabling app license management through Microsoft

When creating an offer, there are two check boxes on the Offer setup tab used to enable ISV app license management on an offer.

### Enable app license management through Microsoft check box

Here’s how it works:

- After you select the **Enable app license management through Microsoft** box, you can define licensing plans for your offer.
- Customers will see a **Get it now** button on the offer listing page in AppSource. Customers can select this button to contact you to purchase licenses for the app.

### Allow customers to install my app even if licenses are not assigned check box

After you select the first box, the **Allow customers to install my app even if licenses are not assigned** box appears. This option is useful if you are employing a “freemium” licensing strategy whereby you want to offer some basic features of your solution for free to all users and charge for premium features. Conversely, if you want to ensure that only tenants who currently own licenses for your product can download it from AppSource, then don’t select this option.

> [!NOTE]
> If you choose this option, you need to configure your solution package to not require a license.

Here’s how it works:

- All AppSource users see the **Get it now** button on the offer listing page along with the **Contact me** button and will be permitted to download and install your offer.
- If you do not select this option, then AppSource checks that the user’s tenant has at least one license for your solution before showing the **Get it now** button. If there is no license in the user’s tenant then only the **Contact Me** button is shown.

For details about configuring an offer, see [How to create a Dynamics 365 for Customer Engagement & Power App offer](dynamics-365-customer-engage-offer-setup.md).

## Offer listing page on AppSource

After your offer is published, the options you chose will drive which buttons appear to a user. This screenshot shows an offer listing page on AppSource with the **Get it now** and **Contact me** buttons.

:::image type="content" source="./media/third-party-license/f365.png" alt-text="Screenshot of an offer listing page on AppSource. The Get it now and Contact me buttons are shown.":::

***Figure 1: Offer listing page on Microsoft AppSource***

## Next steps

- [Plan a Dynamics 365 offer](marketplace-dynamics-365.md)
- [How to create a Dynamics 365 for Customer Engagement & Power App offer](dynamics-365-customer-engage-offer-setup.md)
