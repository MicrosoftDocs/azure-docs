---
title: ISV app license management for Dynamics 365 apps on Dataverse and Power Apps - Microsoft AppSource and Azure Marketplace
description: Learn about managing ISV app licenses through Microsoft for Dynamics 365 apps on Dataverse and Power Apps.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: mingshen-ms 
ms.author: mingshen
ms.date: 06/23/2022
---

# ISV app license management for Dynamics 365 apps on Dataverse and Power Apps

Applies to the following offer type:

- Dynamics 365 apps on Dataverse and Power Apps

_ISV app license management_ enables independent software vendors (ISVs) who build solutions using Dynamics 365 suite of products to manage and enforce licenses for their solutions using systems provided by Microsoft. By adopting license management, ISVs can:

- Enable your customers to assign and unassign licenses of ISV products using familiar tools such as Microsoft 365 Admin Center, which customers use to manage Office and Dynamics licenses.
- Have the Power Platform enforce ISV product licenses at runtime to ensure that only licensed users can access your solution.
- Save yourself the effort of building and maintaining your own license management and enforcement system.

ISV app license management currently supports:
- A named user license model. Each license must be assigned to an Azure AD user or Azure AD security group.
- [Enforcement for model-driven apps](/power-apps/maker/model-driven-apps/model-driven-app-overview).

## Prerequisites

To manage your ISV app licenses, you need to comply with the following pre-requisites.

1. Have a valid [Microsoft Cloud Partner Program account](/partner-center/mpn-create-a-partner-center-account).
1. Be signed up for commercial marketplace program. For more information, see [Create a commercial marketplace account in Partner Center](create-account.md).
1. Be signed up for the [ISV Connect program](https://partner.microsoft.com/solutions/business-applications/isv-overview). For more information, see [Microsoft Business Applications Independent Software Vendor (ISV) Connect Program onboarding guide](business-applications-isv-program.md).
1. Your developer team has the development environments and tools required to create Dataverse solutions. Your Dataverse solution must include model-driven applications (currently these are the only type of solution components that are supported through the license management feature).

## High-level process

The process varies depending on whether Microsoft hosts transactions on your behalf (also known as a _transactable offer_) or you only list the offer through the marketplace and host transactions independently.

These steps illustrate the high-level process to manage ISV app licenses:

### Step 1: Create an offer

| Transactable offers | Licensable-only offers |
| ------------ | ------------- |
| The ISV [creates an offer in Partner Center](dynamics-365-customer-engage-offer-setup.md) and chooses to transact through Microsoft’s commerce system and enable Microsoft to manage the licenses of these add-ons. The ISV also defines at least one plan and configures pricing information and availability. The ISV can optionally define a private plan which only specific customers can see and purchase on [Microsoft AppSource](https://appsource.microsoft.com/). | The ISV [creates an offer in Partner Center](dynamics-365-customer-engage-offer-setup.md) and chooses to manage licenses for this offer through Microsoft. This includes defining one or more licensing plans for the offer. |

### Step 2: Add license metadata to solution package

The ISV creates a solution package for the offer that includes license plan information as metadata and uploads it to Partner Center for publication to Microsoft AppSource. To learn more, see [Adding license metadata to your solution](/powerapps/developer/data-platform/appendix-add-license-information-to-your-solution).

### Step 3: Purchase subscription to ISV products

| Transactable offers | Licensable-only offers |
| ------------ | ------------- |
| Customers discover the ISV’s offer in AppSource, purchase a subscription to the offer from AppSource, and get licenses for the ISV app. | - Customers discover the ISV’s offer in AppSource or directly on the ISV’s website. Customers purchase licenses for the plans they want directly from the ISV.<br>- The ISV registers the purchase with Microsoft in Partner Center. As part of [deal registration](/partner-center/register-deals), the ISV will specify the type and quantity of each licensing plan purchased by the customer. |

### Step 4: Manage subscription

| Transactable offers | Licensable-only offers |
| ------------ | ------------- |
| Customers can manage subscriptions for the Apps they purchased in [Microsoft 365 admin center](https://admin.microsoft.com/), just like they normally do for any of their Microsoft Office or Dynamics subscriptions. | ISVs activate and manage deals in Partner Center [deal registration](/partner-center/register-deals) portal |

### Step 5: Assign licenses

Customers can assign licenses of these add-ons in license pages under the billing node in [Microsoft 365 admin center](https://admin.microsoft.com/). Customers can assign licenses to users or groups. Doing so will enable these users to launch the ISV app. Customers can also install the app from [Microsoft 365 admin center](https://admin.microsoft.com/) into their Power Platform environment.

**Licensable-only offers:**
- The license plans will appear in Microsoft 365 Admin Center for the customer to [assign to users or groups](/microsoft-365/commerce/licenses/manage-third-party-app-licenses) in their organization. The customer can also install the application in their tenant via the Power Platform Admin Center.

### Step 6: Power Platform performs license checks

When a user within the customer’s organization tries to run an application, Microsoft checks to ensure that the user has a license before permitting them to run it. If they do not have a license, the user sees a message explaining that they need to contact an administrator for a license.

### Step 7: View reports

ISVs can view information on:
- Orders purchased, renewed, or canceled over time and by geography.

- Provisioned and assigned licenses over a period of time and by geography.

## Enabling app license management through Microsoft

When creating an offer, there are two check boxes on the Offer setup tab used to enable ISV app license management on an offer.

### Enable app license management through Microsoft check box

Here’s how it works:

- After you select the **Enable app license management through Microsoft** box, you can define licensing plans for your offer.
- Customers will see a **Get it now** button on the offer listing page in AppSource. Customers can select this button to contact you to purchase licenses for the app.

> [!NOTE]
> This check box is automatically enabled if you choose to sell your offer through Microsoft and have Microsoft host transactions on your behalf.

### Allow customers to install my app even if licenses are not assigned check box

If you choose to list your offer through the marketplace and process transactions independently, after you select the first box, the **Allow customers to install my app even if licenses are not assigned** box appears. This option is useful if you are employing a “freemium” licensing strategy whereby you want to offer some basic features of your solution for free to all users and charge for premium features. Conversely, if you want to ensure that only tenants who currently own licenses for your product can download it from AppSource, then don’t select this option.

> [!NOTE]
> If you choose this option, you need to configure your solution package to not require a license.

Here’s how it works:

- All AppSource users see the **Get it now** button on the offer listing page along with the **Contact me** button and will be permitted to download and install your offer.
- If you do not select this option, then AppSource checks that the user’s tenant has at least one license for your solution before showing the **Get it now** button. If there is no license in the user’s tenant then only the **Contact Me** button is shown.

For details about configuring an offer, see [How to create a Dynamics 365 apps on Dataverse and Power Apps](dynamics-365-customer-engage-offer-setup.md).

## Offer listing page on AppSource

After your offer is published, the options you chose will drive which buttons appear to a user. This screenshot shows an offer listing page on AppSource with the **Get it now** and **Contact me** buttons.

:::image type="content" source="./media/third-party-license/f365.png" alt-text="Screenshot of an offer listing page on AppSource. The Get it now and Contact me buttons are shown.":::

## Next steps

- [Plan a Dynamics 365 offer](marketplace-dynamics-365.md)
- [Create a Dynamics 365 apps on Dataverse and Power Apps offer](dynamics-365-customer-engage-offer-setup.md)
