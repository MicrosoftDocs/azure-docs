---
title: Creating Enterprise Azure Dev/Test subscriptions
description: Create Enterprise and Organizational Azure Dev/Test subscriptions for teams and large organizations.
ms.author: amast
author: joseb-rdc
ms.service: visual-studio-family
ms.subservice: subscriptions
ms.topic: how-to
ms.date: 04/30/2026
ms.custom: devtestoffer
---

# Creating Enterprise and Organization Azure Dev/Test Subscriptions

This Learn document is specific to customers using the Azure Enterprise Agreement billing model, and the actions described apply to users with EA roles such as Account Owners or Enterprise Administrators.

Enterprise Dev/Test Subscriptions are available for team development in large organizations

- For team development in large enterprises  
- Enterprise-wide billing – no separate payments  
- Create an enterprise dev/test subscription in the Azure portal  

## Prerequisites

These prerequisites apply to customers using the Azure Enterprise Agreement (EA) billing model. If your organization uses a different billing model (such as Microsoft Customer Agreement or pay-as-you-go), these roles and steps don't apply.

To create an enterprise Azure dev/test subscription, you must have an account owner role on an Enrollment Account to make the subscription. There are two ways to access this role:  

- The Enterprise Administrator of your enrollment can [make you an account owner](../../cost-management-billing/manage/grant-access-to-create-subscription.md)  
- An existing owner of the account [can grant you access](../../cost-management-billing/manage/grant-access-to-create-subscription.md).  

### Important information before you add Account Owners

An EA Account Owner **can't** use the same sign-in account for the Enterprise Agreement enrollment (in the Azure portal) and other Azure offers. If you're added as an Account Owner and used the same credentials associated with your individual Visual Studio Benefits. In that case, your Visual Studio Subscription is converted to the EA Dev/Test offer.  

> [!NOTE]  
> The first time you sign in as an EA Account Owner, you see a warning message explaining how Azure subscriptions are affected. It's important to review this information carefully. In some cases, subscriptions might be converted to a billable Enterprise Agreement offer, and individual Visual Studio Azure credits associated with the same account might be removed.

### To recover your individual Visual Studio Azure Benefits  

These steps describe common ways to recover access to individual Visual Studio Azure benefits. Depending on your account and subscription configuration, recovery options might vary. For more information about managing Azure subscriptions, billing access, and roles, see [Azure Cost Management and Billing documentation](/azure/cost-management-billing/).

After you authenticate your role as an EA Account Owner, you can either:  

- Remove or move any Azure subscriptions you own  
- Remove your role as Account Owner in the Enterprise Agreement  
- Sign up again for your individual Visual Studio Azure benefits  
- Or remove the subscriber from the Visual Studio Subscriptions Administration site, then reassign the subscription using a different sign-in. After assignment, you can sign up again for individual Visual Studio Azure benefits  

## Create your subscription

To create an Enterprise Dev/Test subscription, you must have appropriate permissions within your Enterprise Agreement enrollment. An Enterprise Administrator or Account Owner can create new subscriptions in the Azure portal.

To create a subscription:
1. Sign in to the [Azure portal]( https://portal.azure.com/)
2. Navigate to **Subscriptions** and select **Add**
3. Select the appropriate **billing account and enrollment account**
4. Choose the **Enterprise Dev/Test offer** (if enabled)
5. Enter the required subscription details and complete creation

For detailed steps and current requirements, see [Create and Enterprise Agreement subscription](/azure/cost-management-billing/manage/create-enterprise-subscription).

## Add your Azure Enterprise Dev/Test Subscription

After you create an Enterprise Dev/Test subscription, you can view and manage it in the Azure portal.
To access your subscription:

1. Sign in to the [Azure portal]( https://portal.azure.com/)
1. Navigate to **Subscriptions**
1. Locate your Enterprise Dev/Test subscription in the list

You can use this subscription to deploy and manage development and testing workloads in accordance with Enterprise Dev/Test usage guidelines.
For more information about managing subscriptions and billing scopes, see [Azure Cost Management and Billing documentation](/azure/cost-management-billing/).

## Related content  

- [Create an Enterprise Agreement subscription](/azure/cost-management-billing/manage/create-enterprise-subscription)
- [Understand Azure Enterprise Agreement roles](/azure/cost-management-billing/manage/understand-ea-roles)
- [Azure Cost Management and Billing documentation](/azure/cost-management-billing/)
