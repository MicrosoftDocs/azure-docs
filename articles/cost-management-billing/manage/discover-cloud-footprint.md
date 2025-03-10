---
title: Discover your Microsoft cloud footprint FAQ
description: This article helps to answer frequently asked questions that customers have about their Microsoft cloud footprint.
author: bandersmsft
ms.author: banders
ms.date: 01/08/2025
ms.topic: concept-article
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: nicholak
#customer intent: As a billing administrator, I want to understand how to view and manage my Microsoft cloud footprint so that I can effectively oversee my organization's cloud resources and costs.

---

# Discover your Microsoft cloud footprint FAQ

This article helps to answer frequently asked questions that customers have about their Microsoft cloud footprint. Your cloud footprint commonly includes but isn’t limited to, legal entities, billing accounts, and billing profiles, tenants, subscriptions, and so on.

This article provides links to other articles that you can use to determine your entire Microsoft cloud footprint.


## What are common Microsoft customer identifiers and how do I find them?

The following table shows some common identifiers that Microsoft customers have. They’re starting points to help you understand your Microsoft cloud footprint.

| Identifier | Related documentation |
| --- | --- |
| **Tenant ID** | • [What is Microsoft Entra ID?](/entra/fundamentals/whatis) <br>  • [How to find your tenant ID](/entra/fundamentals/how-to-find-tenant) <br>  • [Change your organization's address and technical contact in the Microsoft 365 admin center](/microsoft-365/admin/manage/change-address-contact-and-more#what-do-the-organization-information-fields-mean) |
| **Billing Account ID** |  • [View your billing accounts in Azure portal](view-all-accounts.md)  <br> • [Understand your Microsoft business billing account](/microsoft-365/commerce/manage-billing-accounts) |
| **Subscription ID** |  • [Get subscription and tenant IDs in the Azure portal](/azure/azure-portal/get-subscription-tenant-id) <br> • [What Microsoft business subscriptions do I have?](/microsoft-365/admin/admin-overview/what-subscription-do-i-have) |
| **Agreement ID** | **Microsoft Customer Agreement:** <br> • [Microsoft Customer Agreement documentation](../microsoft-customer-agreement/index.yml) <br><br>**Microsoft Partner Agreement:**   <br> • [The Microsoft Partner Agreement (MPA) for CSP](/partner-center/enroll/microsoft-partner-agreement) <br><br>**Enterprise Agreement:** <br> • [EA Billing administration on the Azure portal](direct-ea-administration.md) |
| **Legal Entity** | It’s your company name, address, phone number, and so on. |
| **Microsoft Partner Network (MPN) ID** | [Add, change, or delete a Microsoft 365 subscription advisor partner](/microsoft-365/admin/misc/add-partner) |
| **Domain name** | [Add and replace your onmicrosoft.com fallback domain in Microsoft 365](/microsoft-365/admin/setup/add-or-replace-your-onmicrosoftcom-domain) |


## Can I view all my accounts across the Microsoft cloud?

No. The ability to view accounts depends on your agreement and who manages it.

### Customer managed or Microsoft managed

Both types of Microsoft Customer Agreement accounts are visible in the Billing account list views in the Microsoft 365 admin center and Azure portal.

With these accounts, customers purchase directly from Microsoft or through a field seller. The customer owns the billing accounts and pays Microsoft directly for the service.

### Partner managed

Billing accounts for the end customer that purchases through a Cloud Solution Provider (CSP) partner aren’t in the list views of Microsoft 365 admin center or Azure portal.

## How do I view my billing account and tenant information?

Azure customers can use the following information to view their billing accounts and tenants:

[Billing accounts and scopes in the Azure portal](view-all-accounts.md). The article provides details about all types of Azure accounts.

Microsoft 365 customers can use the following information to view their billing accounts and tenants:

- [Understand your Microsoft business billing account](/microsoft-365/commerce/manage-billing-accounts)
- [Manage your Microsoft business billing profiles](/microsoft-365/commerce/billing-and-payments/manage-billing-profiles)


## How can I view every billing account created for a tenant?

Global Administrators can view all direct billing accounts at the organization level and can elevate their billing account permissions. Purchases made for individual use by users that aren't administrators are only visible to and managed by the original purchaser.

For more information, see [Elevate access to manage billing accounts](elevate-access-global-admin.md).

## How can I view employees participating in other tenants?

Global Administrators can view log data showing employee activity in other tenants. For more information, see [Cross-tenant access activity workbook](/entra/identity/monitoring-health/workbook-cross-tenant-access-activity).

## How do I view my partner billing information?

As a partner, you can see your partner billing account, billing group, and associated customer information in Azure. This information isn’t currently available in the Microsoft 365 admin center.

- [View your billing accounts in Azure portal](view-all-accounts.md#microsoft-partner-agreement)
- [Get started with your Microsoft Partner Agreement billing account](../understand/mpa-overview.md)

A customer can’t view the billing account or billing group managed by a partner because the partner makes purchases on behalf of their customer.

## How do I view my organization’s billing account and tenant information?

A customer can view their billing accounts and related tenant information in the Azure portal or Microsoft 365 admin center.

Get access to your billing account:

- [Understand your Microsoft business billing account](/microsoft-365/commerce/manage-billing-accounts#assign-billing-account-roles)
- [Billing roles for Microsoft Customer Agreements](understand-mca-roles.md)

After you get access, here’s how you can view the Billing account and related tenant info.

- Customers can view their Azure Billing Accounts and tenants:
  - [View your billing accounts in Azure portal](view-all-accounts.md)

The article provides details about all types of Azure accounts.

- Customers can view their Microsoft 365 billing accounts and tenants:
  - [Understand your Microsoft business billing account](/microsoft-365/commerce/manage-billing-accounts)
  - [Manage your Microsoft business billing profiles](/microsoft-365/commerce/billing-and-payments/manage-billing-profiles)

## How do I manage purchases that I made myself?

Administrators can manage trials and purchases that they made, and self-service purchases and trials made by users that aren't administrators. For more information, see [Manage self-service purchases and trials (for admins)](/microsoft-365/commerce/subscriptions/manage-self-service-purchases-admins).

## How can I get a list of subscriptions and tenants for a billing account?

In the Azure portal, you can view the tenants associated with a subscription on the **Subscriptions** page under **Cost Management + Billing**.

Programmatically, you can use the publicly available API to get billing accounts that returns all associated billing subscriptions. The API also supports an optional header that returns all tenant IDs associated with the billing account. For more information, see [Billing Subscriptions - List By Billing Account](/rest/api/billing/billing-subscriptions/list-by-billing-account).

CLI snippet:

```azurecli
# login 
az login 
# Get BillingAccounts 
az rest --method get --url 	https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2024-04-01
 
 
# Get BillingSubscriptions with provisioning tenant 
az rest --method get --url 	https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountId>/billingSubscriptions?api-version=2024-04-01 --headers x-ms-service-tenant-info=true 
```

Sample call:

```azurecli
az rest --method get --url 'https://management.azure.com/providers/Microsoft.Billing/billingAccounts/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb:bbbbbbbb-1111-2222-3333-cccccccccccc_2019-05-31/billingSubscriptions?api-version=2024-04-01' --headers x-ms-service-tenant-info=true
```

Sample response:

```json
{  
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb:bbbbbbbb-1111-2222-3333-cccccccccccc_2019-05-31/billingSubscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
      "name": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
      "properties": {
        "autoRenew": "Off",
        "billingFrequency": "P1M",
        "billingProfileDisplayName": "Contoso Partner & Field Experiences",
        "billingProfileId": "/providers/Microsoft.Billing/billingAccounts/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb:bbbbbbbb-1111-2222-3333-cccccccccccc_2019-05-31/billingProfiles/CustomerLedAccount_BG3",
        "billingProfileName": "ContosoAccount_BG3",
        "displayName": "Test sub for Ingestion",
        "invoiceSectionDisplayName": "Contoso Ingestion Publishing Service",
        "invoiceSectionId": "/providers/Microsoft.Billing/billingAccounts/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb:bbbbbbbb-1111-2222-3333-cccccccccccc_2019-05-31/billingProfiles/CustomerLedAccount_BG3/invoiceSections/AAAA-BBBB-CCC-DDD",
        "invoiceSectionName": "AAAA-BBBB-CCC-DDD",
        "operationStatus": "None",
        "productCategory": "UsageBased",
        "productType": "Usage based",
        "productTypeId": "DZH318Z0BPS6",
        "provisioningTenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
        "purchaseDate": "2020-10-26T16:55:39.4792007Z",
        "quantity": 1,
        "skuDescription": "Microsoft Azure Plan",
        "skuId": "0001",
        "status": "Active",
        "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
      },
      "type": "Microsoft.Billing/billingAccounts/billingSubscriptions"
    }
}
```

## How can I view the Azure tenant that I'm currently signed in to?

You can view your tenant information in the Azure portal using the information at [Manage Azure portal settings and preferences](/azure/azure-portal/set-preferences).

## How can I organize costs for my billing accounts?

You can organize your invoice for each of your billing accounts using the information in [Organize your invoice based on your needs](mca-section-invoice.md).

## How do I understand different associated tenant types?

When you add an associated billing tenant, you can enable two access settings:

**Billing Management** - Allows billing account owners to assign roles to users in the associated billing tenant. Essentially, it gives them permission to access billing information and make purchasing decisions.

**Provisioning** - Allows the invited tenant’s subscriptions to be billed to the inviting billing account.

- If you want to understand the differences between tenant types in Azure, see [Manage billing across multiple tenants using associated billing tenants](manage-billing-across-tenants.md).
- If you want to understand the differences between tenant types in Microsoft 365, see [Manage billing across multiple tenants in the Microsoft 365 admin center](/microsoft-365/commerce/billing-and-payments/manage-multi-tenant-billing).

## How do I add an associated billing tenant?

For Azure:

1. Sign in to the Azure portal.
2. Search for **Cost Management + Billing**.
3. Select **Access control (IAM)** on the left side of the page.
4. Select **Associated billing tenants** at the top of the page.
5. Select **Add** and provide the tenant ID or domain name for the tenant you want to add. You can also give it a friendly name.
6. Choose one or both options for access settings: Billing management and Provisioning. For more information, see [Manage billing across multiple tenants using associated billing tenants](manage-billing-across-tenants.md).

For Microsoft 365:

1. Sign in to the [Microsoft 365 admin center](https://go.microsoft.com/fwlink/p/?linkid=2024339).
2. Under **Billing** > **Billing Accounts**, select a billing account.
3. Select the **Associated billing tenants** tab.

There you can manage the existing associating billing tenants or add new ones. For more information, see [Manage billing across multiple tenants in the Microsoft 365 admin center](/microsoft-365/commerce/billing-and-payments/manage-multi-tenant-billing).

## How can I see which tenants my users are authenticating to?

You can view tenants with B2B relationships in the [Cross-tenant access activity workbook](/entra/identity/monitoring-health/workbook-cross-tenant-access-activity).

> [!NOTE]
> The tenants that users access by using B2B authentication aren’t necessarily part of your organization.

## How can I identify external Microsoft Entra ID tenants that my users sign into using identities in these tenants?

Customers that use Microsoft Entra Internet Access for Microsoft Services can easily detect external Microsoft Entra ID tenants accessed by their users.

As part of Global Secure Access solution, customers can tunnel all network traffic to Microsoft apps to enforce secure access and advanced controls.

Once enabled, the external tenants that get accessed by onboarded users are easily tracked and shown in the main Global Secure Access dashboard under the Cross Tenant Access widget. Here's a sample screenshot of the Cross Tenant Access widget:

:::image type="content" source="./media/discover-cloud-footprint/cross-tenant-access.png" border="true" alt-text="Screenshot showing the Cross-tenant access widget." lightbox="./media/discover-cloud-footprint/cross-tenant-access.png" :::

For more information about the Global Secure Access solution, see [Global Secure Access dashboard](/entra/global-secure-access/concept-traffic-dashboard).

## How can I take over unmanaged directories owned by my organization?

Review the domains in your registrar that aren’t verified to your tenant. If you can’t register a domain that you reserved in your registrar, it might be associated with an unmanaged directory. Global administrators can claim or take over unmanaged directories (also called _unmanaged tenants_). Members of their organization potentially created them through free sign-up offers. If your registrar shows you pay for a domain that isn’t part of your home tenant, it might be used in an unmanaged directory. For more information, see [Admin takeover of an unmanaged directory](/entra/identity/users/domains-admin-takeover).

## How can I regain access to a tenant owned by my organization?

If you’re locked out of a tenant, you must open a [support ticket](https://support.microsoft.com/topic/global-customer-service-phone-numbers-c0389ade-5640-e588-8b0e-28de8afeb3f2). The Data Protection Team can help you:

- Reset credentials of an administrator account
- Claim ownership of normal tenants

## How can I restrict users in my organization from creating new tenants?

You can enable a tenant-level policy to restrict users from creating new tenants in their organization. For more information, see [Restrict new organization creation, Microsoft Entra tenant policy](/azure/devops/organizations/accounts/azure-ad-tenant-policy-restrict-org-creation).

You can also restrict subscriptions from moving from one tenant to another. It’s a common pattern an employee might take when they create a tenant. For more information, see [Manage Azure subscription policies](manage-azure-subscription-policy.md).

## How can I review audit logs for tenants created by users in my organization?

You can view audit logs in the Microsoft Entra admin center. Events relating to tenant creation are tagged as Directory Management. For more information, see [Microsoft Entra audit log categories and activities](/entra/identity/monitoring-health/reference-audit-activities).

To learn about notifications for audit log events, follow the tutorial in [Enable security notifications for audit log events](/entra/identity/authentication/tutorial-enable-security-notifications-for-audit-logs).

## Related content

- For Azure:
  - [Billing accounts and scopes in the Azure portal](view-all-accounts.md)
- For Microsoft 365:
  -  [Understand your Microsoft business billing account](/microsoft-365/commerce/manage-billing-accounts)
  - [Manage your Microsoft business billing profiles](/microsoft-365/commerce/billing-and-payments/manage-billing-profiles)
