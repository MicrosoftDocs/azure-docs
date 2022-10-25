---
title: Troubleshoot private plans in the commercial marketplace
description: Troubleshoot private plans in the commercial marketplace
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 04/22/2022
---

# Troubleshooting Private Plans in the commercial marketplace

This topic discusses various issues and solutions when troubleshooting private plans.

## Customer Blockers and Common Solutions

Here 's some common customer-blocking issues and information on how to resolve them.

### How do I control my costs, and understand how much I am spending on marketplace?

- Involve your Microsoft account team for a detailed analysis of your particular environment, Azure subscription hierarchy, and EA setup.
- For more information, see [Cost Management Billing Overview](../cost-management-billing/cost-management-billing-overview.md).

### Azure Administrator

- The Azure Administrator is responsible for controlling users’ Role Based Access Control. They have the ability to grant Marketplace purchase rights, and determine how these rights can be exercised, and into which Azure Subscriptions the user has access control.
- Involve your Microsoft account team for a detailed analysis of your particular environment, Azure subscription hierarchy, and EA setup.
- Microsoft recommends that at least two users carry the Azure Administrator role. Refer to the appropriate documentation
- For more information, see the documentation on [Roles and Security Planning](../active-directory/roles/security-planning.md).

### Marketplace purchases succeeded, but the deployment fails. The error message typically refers to contracts terms and conditions, what else can be going on?

- Azure gives customers a blank slate in terms of Security Policies, and often these policies have unintended consequences, such as blocking the deployment of marketplace resources into a particular Azure Subscription or Resource Group.
- Involve your Microsoft account team for a detailed analysis of your particular environment, Azure subscription hierarchy, and Resource Group policies.
- Upstream policies, implemented at higher levels of the Azure Subscription hierarchy can be hidden. If the policy that is blocking the deployment is not immediately evident, capture the API flow using a HAR file. HAR files provide a trace of the HTTPS calls, and a log of the messages sent and received, during the deployment flow. Analysis of the HAR log will help you and Microsoft identify the ID of the specific policy that is causing the deployment failure.
- Involve your Microsoft account team for a detailed analysis of your particular environment, Azure subscription hierarchy, and EA setup.
- The Azure Administrator has to either add the new Marketplace resource to the list of allowed deployments, or temporarily suspend the policy until the deployment is finalized.

### Marketplace purchase and deployment succeeds, but at a later date, they fail with no indication of the root cause. What else can be going on?

- Remember that automated robots may scan the Azure Subscription for non-authorized resources and delete them automatically. If a Marketplace deployment initially succeeds, and fails at a later stage, investigate these automated security scans, and their logs, for indications of the root cause, and eventual corrective action.

> [!NOTE]
> Microsoft gives customers a blank slate in terms of how to setup your Azure Account Hierarchy, your Tenants, Subscriptions, and Resource Groups.

- Involve your Microsoft account team for a detailed analysis of your particular environment, Azure subscription hierarchy, Tenant IDs, and Resource groups.
- Any user can have access to multiple subscriptions, tenant IDs, and Resource Groups. But only one is needed for the creation and deployment of a Private Plan in Marketplace.
- It is imperative that you provide the ISV with the correct Tenant ID, that is the default for your user. The Tenant ID is associated with a specific EA, and Billing Account, and that’s the entity that will “buy” the Marketplace Private Plan.
- If you cannot “see” a Private Plan, investigate your Azure Subscription Hierarchy, whether the Tenant ID that your user defaults to are the same as what you provided.
- If you want to purchase under a Tenant ID that is not the same as your default Tenant ID, remember to “switch” Tenant IDs in the Azure portal to the Tenant ID that you provided to the ISV.
- For more information, see [Subscription Design Strategies](/azure/cloud-adoption-framework/decision-guides/subscriptions/#subscription-design-strategies) in the Subscription Decision Guide.

### Azure Subscription Hierarchy

While troubleshooting the Azure Subscription Hierarchy, keep these things in mind:

- Can be up to six levels deep
- Security and RG policies propagate down and affect Marketplace deployment, Private Plan audience, automation, etc.
- ISV must ensure the right Subscription is being used by the end user when searching for Private Plans or deploying – users can access multiple subscriptions, and the mapping is non-trivial.

:::image type="content" source="media/troubleshoot-private-plan/azure-subscription-hierarchy.png" alt-text="Displays the Azure subscription hierarchy" lightbox="media/troubleshoot-private-plan/azure-subscription-hierarchy.png":::

## Troubleshooting Checklist

- ISV to ensure the SaaS private plan is using the correct tenant ID for the customer - [How to find your Azure Active Directory tenant ID](../active-directory/fundamentals/active-directory-how-to-find-tenant.md). For VMs use the [Azure Subscription ID.](../azure-portal/get-subscription-tenant-id.md)
- ISV to ensure that the Customer is not buying through a CSP. Private Plans are not available on a CSP-managed subscription.
- ISV to ensure the purchaser tenant ID is always present in the private audience list and isn't removed until the customer SaaS subscription is unsubscribed as this could have potential consequences of managing or sending meter usage for that customer SaaS subscription.
- Customer to ensure customer is logging in with an email ID that is registered under the same tenant ID (use the same user ID they used in step #1 above)
- ISV to ask the customer to find the Private Plan in Azure Marketplace: [Private plans in Azure Marketplace](/marketplace/private-plans)
- Customer to ensure marketplace is enabled - [Azure Marketplace](../cost-management-billing/manage/ea-azure-marketplace.md) – if it is not, the user has to contact their Azure Administrator to enable marketplace, for more information regarding Azure Marketplace, see [Azure Marketplace](../cost-management-billing/manage/ea-azure-marketplace.md).
- (Customer) If the offer is still not visible, it’s possible that the customer has Private Marketplace enabled - Customer to Ask the Azure Administrator to enable the specific Private Plan in Private Marketplace: [Create and manage Private Azure Marketplace collections in the Azure portal](/marketplace/create-manage-private-azure-marketplace-new)
- If the Private Plan is visible, and the deployment fails, the troubleshooting moves to ensuring the customer allows for Marketplace billing:
  - (Customer) The Azure Administrator must follow the instructions in [Azure EA portal administration](../cost-management-billing/manage/ea-portal-administration.md), and discuss with their Microsoft Representative the steps to enable billing for Marketplace
  - (customer) [This documentation](../cost-management-billing/manage/ea-portal-administration.md) explains the details to enable Marketplace billing for customers with an Azure Enterprise Agreement.

### If all else fails, open a ticket and create a HAR file

- If a customer has issues making a purchase on marketplace, a HAR file will be the lifesaver. It’s a type of log generated by the browser, which traces all the calls made between the APIs, using HTTP. Microsoft CSS will require a HAR file before moving forward and troubleshooting.
- How do you create a HAR file?
  - See [Generating a HAR file for troubleshooting](https://support.zendesk.com/hc/en-us/articles/204410413-Generating-a-HAR-file-for-troubleshooting).

## Next steps

- [Create an Azure Support Request](../azure-portal/supportability/how-to-create-azure-support-request.md)
