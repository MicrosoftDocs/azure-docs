---
title: View and manage service providers
description: Customers can view info about Azure Lighthouse service providers, service provider offers, and delegated resources in the Azure portal.
ms.date: 03/01/2023
ms.topic: how-to
---

# View and manage service providers

The **Service providers** page in the [Azure portal](https://portal.azure.com) gives customers control and visibility for their service providers who use [Azure Lighthouse](../overview.md). Customers can delegate specific resources, review new or updated offers, remove service provider access, and more.

To access the **Service providers** page in the Azure portal, enter "Service providers" in the search box near the top of the Azure portal. You can also select **All services**, then search for **Azure Lighthouse**, or search for "Azure Lighthouse". From the Azure Lighthouse page, select **View service provider offers**.

> [!NOTE]
> To view the **Service providers** page, a user in the customer's tenant must have the [Reader built-in role](../../role-based-access-control/built-in-roles.md#reader) (or another built-in role which includes Reader access).
>
> To add or update offers, delegate resources, and remove offers, the user must have a role with the `Microsoft.Authorization/roleAssignments/write` permission, such as [Owner](../../role-based-access-control/built-in-roles.md#owner).

Keep in mind that the **Service providers** page only shows information about the service providers that have access to the customer's subscriptions or resource groups through Azure Lighthouse. It doesn't show any information about additional service providers who don't use Azure Lighthouse.

## View service provider details

To view details about the current service providers who use Azure Lighthouse to work on the customer's tenant, select **Service provider offers** on the left side of the **Service providers** page.

For each offer, you'll see the service provider's name and the offer associated with it. You can select an offer to view a description and other details, including the role assignments that the service provider has been granted.

In the **Delegations** column, you can see how many subscriptions and/or resource groups have been delegated to the service provider for that offer. The service provider will be able to access and manage these subscriptions and/or resource groups according to the access levels specified in the offer.

## Add service provider offers

You can add a new service provider offer from the **Service provider offers** page.

To add an offer from the marketplace, select the **Add offer** button in the middle of the page, or select **Add offer** near the top of the page and then choose **Add via marketplace**. If [Managed Service offers](../concepts/managed-services-offers.md) have been published specifically for this customer, select **Private offers** to view them. Select an offer to review details. To add the offer, select **Create**.

To add an offer from a template, select **Add offer** near the top of the page and then choose **Add via marketplace**. This will allow you to upload a template from your service provider and onboard your subscription (or resource group). For more information, see [Deploy in the Azure portal](onboard-customer.md#deploy-in-the-azure-portal).

## Update service provider offers

After a customer has added an offer, a service provider may publish an updated version of the same offer to Azure Marketplace, such as to add a new role definition. If a new version of the offer has been published, the **Service provider offers** page will show an "update" icon in the row for that offer. Select this icon to see the differences between the current version of the offer and the new one.

 ![Update offer icon](../media/update-offer.jpg)

After reviewing the changes, you can choose to update to the new version. The authorizations and other settings specified in the new version will then apply to any subscriptions and/or resource groups that have been delegated for that offer.

## Remove service provider offers

You can remove a service provider offer at any time by selecting the trash can icon in the row for that offer.

After you confirm the deletion, that service provider will no longer have access to the resources that were formerly delegated for that offer.

> [!IMPORTANT]
> If a subscription has two or more offers from the same service provider, removing one of them could cause some service provider users to lose the access granted via the other delegations. This only occurs when the same user and role are included in multiple delegations and then one of the delegations is removed. To fix this, the [onboarding process](onboard-customer.md) should be repeated for the offers that you aren't removing.

## Delegate resources

Before a service provider can access and manage a customer's resources, one or more specific subscriptions and/or resource groups must be delegated. If a customer has added an offer but has not yet delegated any resources, a note will appear at the top of the **Service provider offers** section. The service provider won't be able to work on any resources in the customer's tenant until the delegation is completed.

To delegate subscriptions or resource groups:

1. Check the box for the row containing the service provider, offer, and name. Then select **Delegate resources** at the top of the screen.
1. In the **Offer details** section of the **Delegate resources** page, review the details about the service provider and offer. To review role assignments for the offer, select **Click here to see the details of the selected offer**.
1. In the **Delegate** section, select **Delegate subscriptions** or **Delegate resource groups**.
1. Choose the subscriptions and/or resource groups you'd like to delegate for this offer, then select **Add**.
1. Select the checkbox at the bottom of the page to confirm that you want to grant this service provider access to the resources that you've selected, then select **Delegate**.

## View delegations

Delegations represent an association of specific customer resources (subscriptions and/or resource groups) with role assignments that grant permissions to the service provider for those resources. To view delegation details, select **Delegations** on the left side of the **Service providers** page.

Filters at the top of the page let you sort and group your delegation information. You can also filter by specific service providers, offers, or keywords.

> [!NOTE]
> When [viewing role assignments for the delegated scope in the Azure portal](../../role-based-access-control/role-assignments-list-portal.md#list-role-assignments-at-a-scope) or via APIs, customers won't see role assignments or any users from the service provider tenant who have access through Azure Lighthouse.

## Audit and restrict delegations in your environment

Customers may want to review all subscriptions and/or resource groups that have been delegated to Azure Lighthouse. This is especially useful for those customers with a large number of subscriptions, or who have many users who perform management tasks.

We provide an [Azure Policy built-in policy definition](../../governance/policy/samples/built-in-policies.md#lighthouse) to [audit delegation of scopes to a managing tenant](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Lighthouse/Lighthouse_Delegations_Audit.json). You can assign this policy to a management group that includes all of the subscriptions that you want to audit. When you check for compliance with this policy, any delegated subscriptions and/or resource groups (within the management group to which the policy is assigned) will be shown in a noncompliant state. You can then review the results and confirm that there are no unexpected delegations.

Another [built-in policy definition](../../governance/policy/samples/built-in-policies.md#lighthouse) lets you [restrict delegations to specific managing tenants](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Lighthouse/AllowCertainManagingTenantIds_Deny.json). This policy can be assigned to a management group that includes any subscriptions for which you want to limit delegations. After the policy is deployed, any attempts to delegate a subscription to a tenant outside of the ones you specify will be denied.

For more information about how to assign a policy and view compliance state results, see [Quickstart: Create a policy assignment](../../governance/policy/assign-policy-portal.md).

## Next steps

- Learn more about [Azure Lighthouse](../overview.md).
- Learn how to [audit service provider activity](view-service-provider-activity.md).
- Learn how service providers can [view and manage customers](view-manage-customers.md) on the **My customers** page in the Azure portal.
- Learn how [enterprises managing multiple tenants](../concepts/enterprise.md) can use Azure Lighthouse to consolidate their management experience.
