---
title: Get started with Azure Cost Management for partners
description: This article explains how partners use Azure Cost Management features and how they enable Cost Management access for their customers.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 10/13/2019
ms.topic: conceptual
ms.service: cost-management
manager: aparnag
ms.custom: secdec18
---

# Get started with Azure Cost Management for partners

Azure Cost Management is natively available for partners who have onboarded their customers to a Microsoft Customer Agreement. This article explains how partners use [Azure Cost Management](https://docs.microsoft.com/azure/cost-management/) features. It also describes how partners enable Cost Management access for their customers. CSP customers can use Cost Management features when enabled by their CSP partner.

CSP partners use Cost Management to:

- Understand invoiced costs and associate the costs to the customer, subscriptions, resource groups, and services.
- Get an intuitive view of Azure costs in [cost analysis](quick-acm-cost-analysis.md) with capabilities to analyze costs by customer, subscription, resource group, resource, meter, service, and many other dimensions.
- View resource costs that have Partner Earned Credit (PEC) applied in Cost Analysis.
- Set up notifications and automation using programmatic [budgets](tutorial-acm-create-budgets.md) and alerts when costs exceed budgets.
- Enable the Azure Resource Manager policy that provides customer access to Cost Management data. Customers can then view consumption cost data for their subscriptions using [pay-as-you-go rates](https://azure.microsoft.com/pricing/calculator/).

All functionality available in Azure Cost Management is also available with REST APIs. Use the APIs to automate cost management tasks.

## How Cost Management uses scopes

Scopes are where you manage billing data, have roles specific to payments, view invoices, and conduct general account management. Billing and account roles are managed separately from scopes used for resource management, which use RBAC. To clearly distinguish the intent of the separate scopes, including the access control differences, they are referred to as billing scopes and RBAC scopes, respectively.

To understand billing scopes and RBAC scopes and how cost management works with scopes, see [Understand and work with scopes](understand-work-scopes.md).

## Manage invoiced costs with billing scopes in the partner tenant

After you've onboarded your customers to a Microsoft Customer Agreement, the following _billing scopes_ are available in your tenant. Use the  scopes to manage costs in Cost Management.

### Billing account scope

Use the billing account scope to view pre-tax costs across all your customers and billing profiles. You can also view invoice costs for consumption-based products for customers on the Microsoft Customer Agreement. Invoice costs are also shown for purchased-based products for customers on the Microsoft Customer Agreement and the CSP offer. Currently, the default currency to view costs in the scope is US dollars. Budgets set for the scope are also in USD.

Regardless of the customer-billed currency, partners use the scope to set budgets and manage costs in USD across their customers, subscriptions, resources, and resource groups.

Partners also filter costs in a specific billing currency across customers in the cost analysis view. Select the **Actual cost** list to view costs in supported customer billing currencies.

![Example showing Actual cost selection for currencies](./media/get-started-partners-cost-management/actual-cost-selector.png)

Use the [amortized cost view](quick-acm-cost-analysis.md#customize-cost-views) in billing scopes to view reserved instance amortized costs across a reservation term.

### Billing profile scope

Use the billing profile scope to view pre-tax costs in the billing currency across all your customers for all products and subscriptions included in an invoice. You can filter costs in a billing profile for a specific invoice using the **InvoiceID** filter. The filter shows the consumption and product purchase costs for a specific invoice. You can also filter the costs for a specific customer on the invoice to see pre-tax costs.

After you onboard customers to a Microsoft Customer Agreement, you receive a customer invoice that shows charges for entitlement and purchased products such as SaaS, Azure Marketplace, and reservations. When billed in the same billing currency, the invoice also shows customer charges that aren't included in the new Microsoft Customer Agreement.

To help reconcile charges against the customer invoice, the billing profile scope enables you to see all costs that accrue for an invoice for your customers. Like the invoice, the scope shows costs for every customer in the new Microsoft Customer Agreement. The scope also shows every charge for customer entitlement products still in the current CSP offer.

The billing profile and billing account scopes are the only ones that show charges for entitlement and purchase-based products.

Billing profiles define the subscriptions that are included in an invoice. Billing profiles are the functional equivalent of an enterprise agreement enrollment. An enrollment is the scope that invoices are generated. Similarly, purchases that aren't usage-based, such as Azure Marketplace and reservations, are only available at the billing profile scope.

Currently, the customer's billing currency is the default currency when viewing costs in the billing profile scope. Budgets set at the billing profile scope are in the in billing currency.

Partners can use the scope to reconcile to invoices. And, they use the scope to set budgets in the billing currency for a:

- Specific filtered invoice
- Customer
- Subscription
- Resource group
- Resource
- Azure service
- Meter
- ResellerMPNID

### Customer scope

Partners use the scope to manage costs associated to customers that are onboarded to the Microsoft Customer Agreement. The scope allows partners to view pre-tax costs for a specific customer. You can also filter the pre-tax costs for a specific subscription, resource group, or resource.

The customer scope doesn't include customers who are on the current CSP offer. Entitlement costs, not Azure usage, for current CSP offer customers are available at the billing account and billing profile scopes when you apply the customer filter.

## Partner access to billing scopes in Cost Management

Only the users with **Global admin** and **Admin agent** roles can manage and view costs for billing accounts, billing profiles, and customers directly in the partner's Azure tenant. For more information about partner center roles, see [Assign users roles and permissions](/partner-center/permissions-overview).

### Enable cost management in the customer tenant

Partners may enable access to Cost Management after customers are onboarded to a Microsoft Customer Agreement. Then partners can then enable a policy allowing customers to view their costs computed at pay-as-you-go retail rates. Costs are shown in the customer's billing currency for their consumed usage at RBAC subscription and resource groups scopes.

When the policy for cost visibility is enabled by the partner, any user with Azure Resource Manager access to the subscription can manage and analyze costs at pay-as-you-go rates. Effectively, resellers and customers that have the appropriate RBAC access to the Azure subscriptions can view cost.

Regardless of the policy, partners can also view the costs if they have access to the subscription and resource group.

### Enable the policy to view Azure usage charges

Partners use the following information to enable to the policy to view Azure usage charges for their customers.

In the Azure portal, sign in to the partner tenant and click **Cost Management + Billing**. Select a billing account and then click **Customers. The list of customers is associated with the billing account.

In the list of customers, select the customer that you want to allow to view costs.

![Select customers in Cost Management](./media/get-started-partners-cost-management/customer-list.png)

Under **Settings**, click **Policies**.

The current cost visibility policy is shown for **Azure Usage** charges associated to the subscriptions for the selected customer.
![Policy to allow customers to view pay-as-you-go charges](./media/get-started-partners-cost-management/cost-management-billing-policies.png)

When the policy is set to **No**, Azure Cost Management isn't available for subscription users associated to the customer. Unless enabled by a partner, the cost visibility policy is disabled by default for all subscription users.

When the cost policy is set to **Yes**, subscription users associated to the customer tenant can see usage charges at pay-as-you go rates.

When the cost visibility policy is enabled, all services that have subscription usage show costs at pay-as-you-go rates. Reservation usage appears with zero charges for actual and amortized costs. Purchases and entitlements are not associated to a specific subscription. So, purchases aren't displayed at the subscription scope.

To view costs for the customer tenant, open Cost Management + Billing and then click Billing accounts. In the list of billing accounts, click a billing account.

![Select a billing account](./media/get-started-partners-cost-management/select-billing-account.png)

Under **Billing**, click **Azure subscriptions**, and then click a customer.

![Select an Azure subscription customer](./media/get-started-partners-cost-management/subscriptions-select-customer.png)

Click **Cost analysis** and start reviewing costs.
Cost analysis, budgets, and alerts are now available for the subscription and resource group RBAC scopes at pay-as-you-go rate-based costs.

![View cost analysis as a customer ](./media/get-started-partners-cost-management/customer-tenant-view-cost-analysis.png)

Amortized views and actual costs for reserved instances in the RBAC scopes show zero charges. Reserved instance costs are only showing in billing scopes where the purchases were made.

## Analyze costs in Cost Analysis

Partners can explore and analyze costs in cost analysis across customers for a specific customer or for an invoice. The filter and group by features allow you to analyze costs by multiple fields, including:

| **Field** | **Description** | **Equivalent column in Partner Center** |
| --- | --- | --- |
| PartnerTenantID | Identifier for the partner's Azure Active Directory tenant | Partner Azure Active Directory TenantID called as Partner ID. In GUID format. |
| PartnerName | Name of the partner Azure Active Directory tenant | Partner name |
| CustomerTenantID | Identifier of the Azure Active Directory tenant of the customer's subscription | Customer's organization ID. For example, Customer Azure Active Directory TenantID. |
| CustomerName | Name of the Azure Active Directory tenant containing the customer's subscription | Customer's organization name, as reported in Partner Center. Important for reconciling the invoice with your system information. |
| ResellerMPNID | MPNID for the reseller associated with the subscription | MPN ID of the reseller of record for the subscription. Not available for current activity. |
| subscription ID | Unique Microsoft-generated identifier for the Azure subscription | N/A |
| subscriptionName | Name of the Azure subscription | N/A |
| billingProfileID | Identifier for the billing profile. It groups costs across invoices in a single billing currency across customers. | MCAPI Partner Billing Group ID. Used in API requests, but not included in responses. |
| invoiceID | Invoice ID on the invoice where the specific transaction appears | Invoice number where the specified transaction appears. |
| resourceGroup | Name of the Azure resource group. Used for resource lifecycle management. | The name of the resource group. |
| partnerEarnedCreditRate | Discount rate applied if there is a partner earned credit (PEC) based on partner admin link access. | The rate of partner earned credit (PEC). For example, 0% or 15%. |
| partnerEarnedCreditApplied | Indicates whether partner earned credit was applied. | N/A |

In the [cost analysis](quick-acm-cost-analysis.md) view, you can also [save views](quick-acm-cost-analysis.md#saving-and-sharing-customized-views) and export data to [CSV and PNG](quick-acm-cost-analysis.md#automation-and-offline-analysis) files.

## View Partner Earned Credit (PEC) resource costs

In Azure Cost Management, partners can cost analysis to view costs that received the PEC benefits.

In the Azure portal, sign in to the partner tenant and select **Cost Management + Billing**. Under **Cost Management**, click **Cost analysis**.

The Cost analysis view shows costs of the billing account for the partner. Select the **Scope** as needed for the partner, a specific customer, or a billing profile to reconcile invoices.

In a donut chart, click the drop-down list and select **PartnerEarnedCreditApplied** to drill into PEC costs.

![Example showing how to view partner-earned credit](./media/get-started-partners-cost-management/cost-analysis-pec1.png)

When the **PartnerEarnedCreditApplied** property is _True_, the associated cost has the benefit of the partner earned admin access.

When the **PartnerEarnedCreditApplied** property is _False_, the associated cost hasn't met the required eligibility for the credit. Or, the service purchased isn't eligible for partner earned credit.

Service usage data normally takes 8-24 hours to appear in Cost Management. For more information, see [Usage data update frequency varies](understand-cost-mgt-data.md#usage-data-update-frequency-varies). PEC credits appear within 48 hours from time of access in Azure Cost Management.


You can also group and filter by the **PartnerEarnedCreditApplied** property using the **Group by** options. Use the options to examine costs that do and don't have PEC.

![Group or filter by partner-earned credit](./media/get-started-partners-cost-management/cost-analysis-pec2.png)

## Cost Management REST APIs

Partners, indirect providers, and customers can use Cost Management APIs described in the following sections for common tasks.

### Azure Cost Management APIs for partners

Partners and users with access to billing scopes in a partner tenant can use the following APIs.

#### To get a list of billing accounts

```
armclient get "providers/Microsoft.billing/billingAccounts?api-version=2019-10-01-preview"
```

#### To get a list of customers

```
armclient get "providers/Microsoft.billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/customers?api-version=2019-10-01-preview"
```
#### To get a list of subscriptions

```
armclient get "/providers/Microsoft.Billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/customers/9553eda2-2bd7-4ae6-a1f8-6a19eb40be22/billingSubscriptions?api-version=2019-10-01-preview"
```

#### To create new subscription

```
armclient post "/providers/Microsoft.Billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/customers/9553eda2-2bd7-4ae6-a1f8-6a19eb40be22/providers/Microsoft.Subscription/createSubscription?api-version=2018-11-01-preview" @createsub.json -verbose
```

#### To get or download usage for Azure services

```
armclient GET /providers/Microsoft.Billing/BillingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/providers/Microsoft.Consumption/usageDetails?api-version=2019-10-01
```

#### To get a list of billing profiles

```
armclient get "providers/Microsoft.Billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/billingProfiles?api-version=2019-10-01-preview
```

#### To get or download the price sheet for consumed Azure services

```
armclient post "/providers/Microsoft.Billing/BillingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/BillingProfiles/JUT6-EU3Q-BG7-TGB/pricesheet/default/download?api-version=2019-10-01-preview&format=csv" -verbose
```

#### To get customer costs for the last two months, sorted by month

```
armclient post providers/microsoft.billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31//providers/microsoft.costmanagement/query?api-version=2019-10-01 @CCMQueryCustomer.json
```

#### To get Azure subscription costs for the last two months, sorted by month

```
armclient post providers/microsoft.billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31//providers/microsoft.costmanagement/query?api-version=2019-10-01 @CCMQuerySubscription.json
```

#### To get daily costs for the current month

```
armclient post providers/microsoft.billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31//providers/microsoft.costmanagement/query?api-version=2019-10-01 @CCMQueryDaily.json
```

#### To get the policy for customers to view costs

```
armclient get "providers/Microsoft.Billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/customers/9553eda2-2bd7-4ae6-a1f8-6a19eb40be22/policies/default?api-version=2019-10-01-preview"
```

#### To set the policy for customers to view costs

```
armclient put "providers/Microsoft.Billing/billingAccounts/99a13315-2f87-5b46-9dbd-606071106352:1d100e69-2833-4677-a5d4-8ad35035d9a3_2019-05-31/customers/9553eda2-2bd7-4ae6-a1f8-6a19eb40be22/policies/default?api-version=2019-10-01-preview" @policy.json
```

### Azure Cost Management APIs for indirect providers

Indirect providers with access to RBAC scopes in a customer tenant can use the following APIs. To get started, log in as user or with a service principal.

#### To get the billing account information

```
armclient get "providers/Microsoft.billing/billingAccounts?api-version=2019-10-01-preview"
```

#### To get a list of customers

```
armclient get "providers/Microsoft.billing/billingAccounts/ec1b88ba-5681-517e-f657-4cc6a4a407cb:52f143a9-6524-4e5e-9d4a-120c7a79ca65_2019-05-31/customers?api-version=2019-10-01-preview"
```

#### To get a list of resellers associated with the customer

```
armclient get "/providers/Microsoft.Billing/billingAccounts/ec1b88ba-5681-517e-f657-4cc6a4a407cb:52f143a9-6524-4e5e-9d4a-120c7a79ca65_2019-05-31/customers/b51df1fa-62fa-4c92-9a74-fe860016d4db?api-version=2019-10-01-preview&$expand=resellers
```

#### To get a list of subscriptions with reseller information

```
armclient get "/providers/Microsoft.Billing/billingAccounts/ec1b88ba-5681-517e-f657-4cc6a4a407cb:52f143a9-6524-4e5e-9d4a-120c7a79ca65_2019-05-31/customers/b51df1fa-62fa-4c92-9a74-fe860016d4db/billingSubscriptions?api-version=2019-10-01-preview
```

#### To create a subscription

```
armclient post "/providers/Microsoft.Billing/billingAccounts/ec1b88ba-5681-517e-f657-4cc6a4a407cb:52f143a9-6524-4e5e-9d4a-120c7a79ca65_2019-05-31/customers/b51df1fa-62fa-4c92-9a74-fe860016d4db/providers/Microsoft.Subscription/createSubscription?api-version=2018-11-01-preview" @createsub_reseller.json
```

### Azure Cost Management APIs for customers

Customers use the following information to access the APIs. To get started, log in as a user.

#### To get or download Azure consumption usage information with retail rates

```
armclient post /subscriptions/66bada28-271e-4b7a-aaf5-c0ead63923d7/providers/microsoft.costmanagement/query?api-version=2019-10-01 @CCMQueryDaily.json
```

## Next steps
- [Start analyzing costs](quick-acm-cost-analysis.md) in Cost Management
- [Create and manage budgets](tutorial-acm-create-budgets) in Cost Management
