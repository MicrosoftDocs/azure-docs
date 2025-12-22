---
title: Troubleshoot common Cost Management errors
titleSuffix: Microsoft Cost Management
description: This article describes common Cost Management errors and provides information about solutions.
author: vikramdesai01
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: troubleshooting
ms.date: 07/03/2025
ms.author: vikdesai
---

# Troubleshoot common Cost Management errors

This article describes common errors you might encounter in Cost Management experiences and provides information about self-serve solutions. When you use Cost Management in the Azure portal and encounter an error that you don't understand or can't resolve, find the error code below and try to use the mitigation steps provided to resolve the problem. Use the `More information` link for more detailed guidance.

Here's a list of common error codes with mitigation information.

If the information provided doesn't help you, [Create a support request](#create-a-support-request).

## 400

Error message `400`.
<a name="400"></a>

**Mitigation**

If you're using the [BillingPeriods](/rest/api/consumption/#getting-list-of-billing-periods) API, confirm that you're using a classic pay-as-you-go or EA subscription. The BillingPeriods API doesn't support Microsoft Customer Agreement subscriptions.

Confirm that you're using a supported scope for the specific feature or subscription offer type.

There are many feature-specific errors that use the `400` error code. Refer to the error message and API documentation for specific details. For general information, see [Cost Management APIs](/rest/api/cost-management).

**More information**

For more information about billing periods when transitioning to a Microsoft Customer Agreement, see [Billing period](../understand/mca-understand-your-invoice.md#billing-period).

## 401

Error message `401`.

<a name="401"></a>

**Mitigation**

For an Enterprise Agreement, confirm that the view charges options (Account Owner or Department Administrator) have been enabled.

For a Microsoft Customer Agreement, confirm that the billing account owner has assigned you a role that can view charges.

See [AuthorizationFailed](#AuthorizationFailed).

**More information**

For more information about enterprise agreements, see [Troubleshoot enterprise cost views](../troubleshoot-billing/enterprise-mgmt-grp-troubleshoot-cost-view.md).

For more information about Microsoft Customer Agreements, see [Understand Microsoft Customer Agreement administrative roles in Azure](../manage/understand-mca-roles.md).

## 404

Error message `404`.

<a name="404"></a>

**Mitigation**

Confirm that you're using a supported scope for the specific feature or supported subscription offer type.

Also, see [NotFound](#NotFound).

## 500

Error message `500`.

<a name="500"></a>

**Mitigation**

This message is an internal error. Wait an hour and try again.

Also, see [GatewayTimeout](#GatewayTimeout).

## 503

Error message `503`. 

<a name="503"></a>

**Mitigation**

This message is an internal error. Wait an hour and try again.

When creating or updating exports, you might view the error when the Microsoft.CostManagementExports resource provider is being registered for your subscription. Resource provider registration is usually quick, but at times might take up to five minutes. If you still see the error after more than 10 minutes, [create a support request](#create-a-support-request).

Also, see [GatewayTimeout](#GatewayTimeout).

## AccountCostDisabled

Error message `AccountCostDisabled`.

<a name="AccountCostDisabled"></a>

**Mitigation**

The message indicates that the Enterprise Agreement administrator hasn't enabled Cost Management (view charges) for account owners and subscription users. Contact your administrator.

**More information**

For more information, see [Troubleshoot Azure enterprise cost views](../troubleshoot-billing/enterprise-mgmt-grp-troubleshoot-cost-view.md).

## AuthorizationFailed

Error message `AuthorizationFailed`.

<a name="AuthorizationFailed"></a>

**Mitigation**

Confirm that you have access to the specified scope or object. For example, budget or export.

**More information**

For more information, see [Assign access to Cost Management data](assign-access-acm-data.md)

## BadRequest

Error message `BadRequest`.

<a name="BadRequest"></a>

**Mitigation**

If using the Query or Forecast APIs to retrieve cost data, validate the query body.

If using portal experiences and you see the `object ID cannot be null` error, try refreshing your view.

If using Power BI to pull reservation usage data for more than 3 months, break down the call into 3-month chunks.

Also, see [SubscriptionTypeNotSupported](#SubscriptionTypeNotSupported).

**More information**

For more information about the Query - Usage API body examples, see [Query - Usage](/rest/api/cost-management/query/usage).

For more information about the Forecast - Usage API body examples, see [Forecast - Usage](/rest/api/cost-management/forecast/usage).

For more information about chunking reservation usage calls in Power BI, see [Power BI considerations and limitations](/power-bi/connect-data/desktop-connect-azure-cost-management#considerations-and-limitations).

## BillingAccessDenied

Error message `BillingAccessDenied`.

<a name="BillingAccessDenied"></a>

**Mitigation**

See [AuthorizationFailed](#AuthorizationFailed).

## DepartmentCostDisabled

Error message `DepartmentCostDisabled`.

<a name="DepartmentCostDisabled"></a>

**Mitigation**

The message indicates that the Enterprise Agreement administrator hasn't enabled Cost Management (DA view charges) for department admins. Contact your EA administrator.

**More information**

For more information about troubleshooting disabled costs, see [Troubleshoot Azure enterprise cost views](../troubleshoot-billing/enterprise-mgmt-grp-troubleshoot-cost-view.md).

## DisallowedOperation

Error message `DisallowedOperation`.

<a name="DisallowedOperation"></a>

**Mitigation**

The message indicates that the subscription doesn't have any charges. The type of subscription that you're using isn't allowed to incur charges. Because the subscription can't have any billed charges, it isn't supported by Cost Management.

## FailedDependency

Error message `FailedDependency`.

<a name="FailedDependency"></a>

**Mitigation**

When you are using the Forecast API, the error indicates that either there is not enough data to generate an accurate forecast, or there are multiple currencies that can't be merged.

If you have multiple currencies, filter down only to charges for one of the currencies or request an aggregation of **CostUSD** instead of **Cost**, to get a forecast normalized to USD.

If there's not enough historical data, wait for one week to pass from when you first accrue charges on the scope, to see a forecast.

**More information**

For more information about the API, see [Forecast - Usage](/rest/api/cost-management/forecast/usage).

## GatewayTimeout

Error message `GatewayTimeout`.

<a name="GatewayTimeout"></a>

**Mitigation**

The message is an internal error. Wait an hour and try again.

When querying for cost data using the Query, Forecast, or Publish APIs, consider simplifying your query with less group by columns or using a lower-level scope. Avoid using large management groups with more than 50 subscriptions.

## IndirectCostDisabled

Error message `IndirectCostDisabled`.

<a name="IndirectCostDisabled"></a>

**Mitigation**

The message indicates that your partner hasn't published pricing for the Enterprise Agreement enrollment, which is required to use Cost Management. Contact your partner.

**More information**

For more information, see [Troubleshoot Azure enterprise cost views](../troubleshoot-billing/enterprise-mgmt-grp-troubleshoot-cost-view.md).

## InvalidAuthenticationTokenTenant

Error message `InvalidAuthenticationTokenTenant`.

<a name="InvalidAuthenticationTokenTenant"></a>

**Mitigation**

The subscription you're accessing might have been moved to a different directory.

When using the Azure portal, you might have used a link or saved reference, like a dashboard tile, before the subscription was moved.

Switch to the correct directory that was mentioned in the error message and try again. Don't forget to remove any old references and update any links.

## InvalidGatewayHost

Error message `InvalidGatewayHost`.

<a name="InvalidGatewayHost"></a>

**Mitigation**

The message is an internal error. Try again in five minutes. If the error continues, [create a support request](#create-a-support-request).

## InvalidScheduledActionEmailRecipients

Error message `InvalidScheduledActionEmailRecipients`.

<a name="InvalidScheduledActionEmailRecipients"></a>

**Mitigation**

The message indicates that the scheduled action/email for an alert that you're creating or updating doesn't have any email recipients. When using the Azure portal, press ENTER after specifying an email address to ensure it's saved in the form.

## InvalidView

Error message `InvalidView`.

<a name="InvalidView"></a>

**Mitigation**

The message indicates that the view specified when creating or updating an alert with the ScheduledActions API isn't valid.

When configuring anomaly alerts, make sure you use a kind value of **InsightAlert**.

## MissingSubscription

Error message `MissingSubscription`.

<a name="MissingSubscription"></a>

**Mitigation**

The message indicates that the HTTP request didn't include a valid scope.

If using the Azure portal, [create a support request](#create-a-support-request). The error is likely caused by an internal problem.

## NotFound

Error message `NotFound`.

<a name="NotFound"></a>

**Mitigation**

If using a subscription or resource group, see [SubscriptionNotFound](#SubscriptionNotFound).

If using a management group, see [SubscriptionTypeNotSupported](#SubscriptionTypeNotSupported).

If using Cost Management in the Azure portal, try refreshing the page. The error may be caused by an old reference to a deleted object within the system, like a budget or connector.

For any other case, validate the scope or resource ID.

**More information**

For more information, see [Assign access to Cost Management data](assign-access-acm-data.md).

<a name="RBACAccessDenied"></a>

## RBACAccessDenied

Indicates that the current user/account does not have adequate Role-Based Access Control (RBAC) permission to perform the action.

**Mitigation**

If creating a budget that references an action group (`contactGroups` in the request body), make sure the user/account executing the PUT request has both Cost Management Contributor (or `Microsoft.Consumption/budgets/write`) access as well as Monitoring Reader (or `Microsoft.Insights/actionGroups/read`) access.

For additional mitigation steps, see [AuthorizationFailed](#AuthorizationFailed).

## ReadOnlyDisabledSubscription

Error message `ReadOnlyDisabledSubscription`.

<a name="ReadOnlyDisabledSubscription"></a>

**Mitigation**

The subscription is disabled. You can't create or update Cost Management objects, like budgets and views, for a disabled subscription.

**More information**

For more information, see [Reactivate a disabled Azure subscription](../manage/subscription-disabled.md).

## ResourceGroupNotFound

<a name="ResourceGroupNotFound"></a>

**Mitigation**

The error indicates that a resource group doesn't exist. The resource group might be moved or deleted.

If using the Azure portal, you might see the error when creating budgets or exports. The error is expected, and you can ignore it.

## ResourceRequestsThrottled

Error message `ResourceRequestsThrottled`.

<a name="ResourceRequestsThrottled"></a>

**Mitigation**

The error is caused by excessive use within a short timeframe. Wait five minutes and try again.

**More information**

For more information, see [Data latency and rate limits](manage-automation.md#data-latency-and-rate-limits).

## ServerTimeout

Error message `ServerTimeout`.

<a name="ServerTimeout"></a>

**Mitigation**

For mitigation information, see [GatewayTimeout](#GatewayTimeout).

## SubscriptionNotFound

Error message `SubscriptionNotFound`.

<a name="SubscriptionNotFound"></a>

**Mitigation**

- Validate that the subscription ID is correct.
- Confirm that you have a supported subscription type.

If using Cost Management for a newly created subscription, wait 48 hours and try again.

**More information**

Supported subscription types are shown at [Understand Cost Management data](understand-cost-mgt-data.md).

## SubscriptionTypeNotSupported

Error message `SubscriptionTypeNotSupported`.

<a name="SubscriptionTypeNotSupported"></a>

**Mitigation**

If using a management group, verify that all subscriptions have a supported offer type. Cost Management doesn't support management groups with Microsoft Customer Agreement subscriptions.

**More information**

Supported subscription types are shown at [Understand Cost Management data](understand-cost-mgt-data.md).

## Unauthorized

Error message `Unauthorized`.

<a name="Unauthorized"></a>

**Mitigation**

If using the ExternalBillingAccounts or ExternalSubscriptions APIs, verify that the Microsoft.CostManagement resource providerRP was [registered](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) for your Microsoft Entra instance. 

If you get an `Empty GUID user id` error, update the bearer token associated with the request. You might temporarily see the error in the Azure portal, but it should resolve itself. If you continue to see the error in the Azure portal, refresh your browser.

Also, see [AuthorizationFailed](#AuthorizationFailed).

## Create a support request

If you are facing an error that is not listed above or need more help, submit a [support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) and specify the issue type as **Billing**.

## Next steps

- Read the [Cost Management + Billing frequently asked questions (FAQ)](../cost-management-billing-faq.yml).
