---
title: Link your partner ID to track your impact on delegated resources
description: Associate your partner ID to receive partner earned credit (PEC) on customer resources you manage through Azure Lighthouse.
ms.date: 05/23/2023
ms.topic: how-to
---

# Link your partner ID to track your impact on delegated resources 

If you're a member of the [Microsoft Cloud Partner Program](https://partner.microsoft.com/), you can link your partner ID with the credentials used to manage delegated customer resources. This link allows Microsoft to identify and recognize partners who drive Azure customer success. It also allows [CSP (Cloud Solution Provider)](/partner-center/csp-overview) partners to receive [partner earned credit (PEC)](/partner-center/partner-earned-credit) for customers who have [signed the Microsoft Customer Agreement (MCA)](/partner-center/confirm-customer-agreement) and are [under the Azure plan](/partner-center/azure-plan-get-started).

To earn recognition for Azure Lighthouse activities, you'll need to [link your partner ID](../../cost-management-billing/manage/link-partner-id.md) with at least one user account in your managing tenant, and ensure that the linked account has access to each of your onboarded subscriptions.

## Associate your partner ID when you onboard new customers

Use the following process to link your partner ID (and enable partner earned credit, if applicable). You'll need to know your [partner ID](/partner-center/partner-center-account-setup#locate-your-partnerid) to complete these steps. Be sure to use the **Associated Partner ID** shown on your partner profile.

For simplicity, we recommend creating a service principal account in your tenant, linking it to your **Associated Partner ID**, then granting it an [Azure built-in role that is eligible for PEC](/partner-center/azure-roles-perms-pec) to every customer that you onboard.

1. [Create a service principal user account](../../active-directory/develop/howto-authenticate-service-principal-powershell.md) in your managing tenant. For this example, we'll use the name *Provider Automation Account* for this service principal account.
1. Using that service principal account, [link to your Associated Partner ID](../../cost-management-billing/manage/link-partner-id.md#link-to-a-partner-id) in your managing tenant. You only need to do this one time.
1. When you onboard a customer [using ARM templates](onboard-customer.md) or [Managed Service offers](publish-managed-services-offers.md), be sure to include at least one authorization which includes the Provider Automation Account as a user with an [Azure built-in role that is eligible for PEC](/partner-center/azure-roles-perms-pec). This role must be granted as a permanent assignment, not as a just-in-time [eligible authorization](create-eligible-authorizations.md), in order for PEC to apply.

By following these steps, every customer tenant you manage will be associated with your partner ID. The Provider Automation Account does not need to authenticate or perform any actions in the customer tenant.

:::image type="content" source="../media/lighthouse-pal.jpg" alt-text="Diagram showing the partner ID linking process with Azure Lighthouse.":::

## Add your partner ID to previously onboarded customers

If you have already onboarded a customer, you may not want to perform another deployment to add your Provider Automation Account service principal. Instead, you can link your **Associated Partner ID** with a user account which already has access to work in that customer's tenant. Be sure that the account has been granted an [Azure built-in role that is eligible for PEC](/partner-center/azure-roles-perms-pec) as a permanent role assignment.

Once the account has been [linked to your Associated Partner ID](../../cost-management-billing/manage/link-partner-id.md#link-to-a-partner-id) in your managing tenant, you will be able to track recognition for your impact on that customer.

## Confirm partner earned credit

You can [view PEC details in the Azure portal](/partner-center/partner-earned-credit-explanation#use-acm-to-view-your-partner-earned-credit) and confirm which costs have received the benefit of PEC. Remember that PEC only applies to CSP customers who have signed the MCA and are under the Azure plan.

If you have followed the steps above, and do not see the expected association, [open a support request in the Azure portal](../../azure-portal/supportability/how-to-create-azure-support-request.md).

You can also use the [Partner Center SDK](/partner-center/develop/get-invoice-unbilled-consumption-lineitems) and filter on `rateOfPartnerEarnedCredit` to automate PEC verification for a subscription.

## Next steps

- Learn more about the [Microsoft Cloud Partner Program](/partner-center/mpn-overview).
- Learn [how PEC is calculated and paid](/partner-center/partner-earned-credit-explanation).
- [Onboard customers](onboard-customer.md) to Azure Lighthouse.
