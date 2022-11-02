---
title: Managing the SaaS subscription life cycle | Microsoft commercial marketplace
description: Learn how to manage the SaaS subscription life cycle by using the fulfillment APIs version 2.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 03/07/2022
author: arifgani
ms.author: argani
---

# Managing the SaaS subscription life cycle

The commercial marketplace manages the entire life cycle of a SaaS subscription after its purchase by the end user. It uses the landing page, Fulfillment APIs, Operations APIs, and the webhook as a mechanism to drive the actual SaaS subscription activation, usage, updates, and cancellation. The end user's bill is based on the state of the SaaS subscription that Microsoft maintains.

## States of a SaaS subscription

The following diagram shows the states of a SaaS subscription and the applicable actions.

[ ![Diagram showing the life cycle of a software as a service subscription in the marketplace.](./media/saas-subscription-lifecycle-api-v2.png) ](./media/saas-subscription-lifecycle-api-v2.png#lightbox)

### Purchased but not yet activated (*PendingFulfillmentStart*)

After an end user or cloud solution provider (CSP) purchases a SaaS offer in the commercial marketplace, the publisher is notified of the purchase. The publisher can then create and configure a new SaaS account on the publisher side for the end user.

For account creation to happen:

1. The customer selects the **Configure account now** button that's available for a SaaS offer after its successful purchase in Microsoft AppSource or the Azure portal. Alternatively, the customer can use the **Configure now** button in the email that they will receive shortly after the purchase.
2. Microsoft then notifies the partner about the purchase by opening the landing page URL with the token parameter (the purchase identification token from the commercial marketplace) in the new browser tab.

An example of such call is `https://contoso.com/signup?token=<blob>`, but the landing page URL for this SaaS offer in Partner Center is configured as `https://contoso.com/signup`. This token provides the publisher with an ID that uniquely identifies the SaaS purchase and the customer.

[!INCLUDE [pound-sign-note](../includes/pound-sign-note.md)]

> [!IMPORTANT]
> The landing page URL must be up and running all day, every day, and ready to receive new calls from Microsoft at all times. If the landing page becomes unavailable, customers won't be able to sign up for the SaaS service and start using it.

Next, the publisher must pass the *token* back to Microsoft by calling the [SaaS Resolve API](pc-saas-fulfillment-subscription-api.md#resolve-a-purchased-subscription), and entering the token as the value of the `x-ms-marketplace-token header` parameter. As the result of the Resolve API call, the token is exchanged for details of the SaaS purchase such as the unique ID of the purchase, purchased offer ID, and purchased plan ID.

On the landing page, the customer should be signed in to the new or existing SaaS account via Azure Active Directory (Azure AD) single sign-on (SSO).

>[!NOTE]
>The publisher won't be notified of the SaaS purchase until the customer initiates the configuration process from the Microsoft side.

The publisher should implement SSO to provide the user experience required by Microsoft for this flow. Make sure to use the multitenant Azure AD application and allow both work and school accounts or personal Microsoft accounts when configuring SSO. This requirement applies only to the landing page, for users who are redirected to the SaaS service when already signed in with Microsoft credentials. SSO isn't required for all sign-ins to the SaaS service.

> [!NOTE]
>If SSO requires that an administrator must grant permission to an app, the description of the offer in Partner Center must disclose that admin-level access is required. This disclosure is to comply with [commercial marketplace certification policies](/legal/marketplace/certification-policies#10003-authentication-options).

After sign in, the customer should complete the SaaS configuration on the publisher side. Then the publisher must call the [Activate Subscription API](pc-saas-fulfillment-subscription-api.md#activate-a-subscription) to send a signal to Azure Marketplace that the provisioning of the SaaS account is complete.
This action will start the customer's billing cycle. If the Activate Subscription API call is not successful, the customer isn't billed for the purchase.

[ ![Diagram showing the A P I calls for a provisioning scenario.](./media/saas-update-api-v2-calls-from-saas-service-a.png) ](./media/saas-update-api-v2-calls-from-saas-service-a.png#lightbox)

### Active (*Subscribed*)

*Active (Subscribed)* is the steady state of a provisioned SaaS subscription. After the Microsoft side has processed the [Activate Subscription API](pc-saas-fulfillment-subscription-api.md#activate-a-subscription) call, the SaaS subscription is marked as *Subscribed*. The customer can now use the SaaS service on the publisher's side and will be billed.

When a SaaS subscription is already active, the customer can select **Manage SaaS experience** from the Azure portal or Microsoft 365 Admin Center. This action also causes Microsoft to call the **landing page URL** with the *token* parameter, as happens in the Activate flow. The publisher should distinguish between new purchases and the management of existing SaaS accounts, and handle this landing page URL call accordingly.

### Being updated (*Subscribed*)

This action means that an update to an existing active SaaS subscription is being processed by both Microsoft and the publisher. Such an update can be initiated by:

- The customer from the commercial marketplace.
- The CSP from the commercial marketplace.
- The customer from the publisher's SaaS site (but not for CSP-made purchases).

Two types of updates are available for a SaaS subscription:

- Update plan when the customer chooses another plan for the subscription.
- Update quantity when the customer changes the number of purchased seats for the subscription.

Only an active subscription can be updated. While the subscription is being updated, its state remains Active on the Microsoft side.

#### Update initiated from the commercial marketplace

In this flow, the customer changes the subscription plan or quantity of seats from the Azure portal or Microsoft 365 Admin Center.

1. After an update is entered, Microsoft will call the publisher's webhook URL, configured in the **Connection webhook** field on the _Technical configuration_ page in Partner Center, with an appropriate value for *action* and other relevant parameters.
1. The publisher side should make the required changes to the SaaS service, and notify Microsoft when finished by calling the [Update Status of Operation API](pc-saas-fulfillment-operations-api.md#update-the-status-of-an-operation).
1. If the patch is sent with *fail* status, the update process won't finish on the Microsoft side. The SaaS subscription will keep the existing plan and quantity of seats.

> [!NOTE]
> The publisher should invoke PATCH to [update the Status of Operation API](pc-saas-fulfillment-operations-api.md#update-the-status-of-an-operation) with a Failure/Success response *within a 10-second time window* after receiving the webhook notification. If PATCH of operation status is not received within the 10 seconds, the change plan is *automatically patched as Success*.

The sequence of API calls for an update scenario that's initiated from the commercial marketplace is shown in the following diagram.

![Diagram showing the A P I calls for a marketplace initiated update.](./media/saas-update-status-api-v2-calls-marketplace-side.png)

#### Update initiated from the publisher

In this flow, the customer changes the subscription plan or quantity of seats purchased from the SaaS service itself. 

1. Before making the requested change on the publisher side, the publisher code must call the [Change Plan API](pc-saas-fulfillment-subscription-api.md#change-the-plan-on-the-subscription) or the [Change Quantity API](pc-saas-fulfillment-subscription-api.md#change-the-quantity-of-seats-on-the-saas-subscription) or both.

1. Microsoft will apply the change to the subscription, and then notify the publisher via **Connection webhook** to apply the same change.

1. Only then should the publisher make the required change to the SaaS subscription, and notify Microsoft when the change is done by calling [Update Status of Operation API](pc-saas-fulfillment-operations-api.md#update-the-status-of-an-operation).

The sequence of API calls for an update scenario that's initiated from the publisher side is shown in the following diagram.

![Diagram showing the A P I calls for a publisher side initiated update.](./media/saas-update-status-api-v2-calls-publisher-side.png)

### Suspended (*Suspended*)

This state indicates that a customer's payment for the SaaS service was not received. Microsoft will notify the publisher of this change in the SaaS subscription status. The notification is done via a call to webhook with the *action* parameter set to *Suspended*.

The publisher might or might not make changes to the SaaS service on the publisher side. We recommend that the publisher makes this information available to the suspended customer and limits or blocks the customer's access to the SaaS service. There's a probability that the payment will never be received.

> [!NOTE]
> Microsoft gives the customer a 30-day grace period before automatically canceling the subscription. After the 30-day grace period is over the webhook will receive an `Unsubscribe` action.

When a subscription is in the *Suspended* state:

* The partner or ISV must keep the SaaS account in a recoverable state, so that full functionality can be restored without any loss of data or settings.
* The partner or ISV should expect a request to reinstate the subscription, if the payment is received during the grace period, or a request to de-provision the subscription at the end of the grace period. Both requests will be sent via the webhook mechanism.

The subscription state is changed to Suspended on Microsoft side before the publisher takes any action. Only Active subscriptions can be suspended.

### Reinstated (*Suspended*)

This action indicates that the customer's payment instrument has become valid again, a payment has been made for the SaaS subscription, and the subscription is being reinstated. In this case: 

1. Microsoft calls webhook with an *action* parameter set to the *Reinstate* value.
1. The publisher makes sure that the subscription is fully operational again on the publisher side.
1. The publisher calls the [Patch Operation API](pc-saas-fulfillment-operations-api.md#update-the-status-of-an-operation) with success status.
1. The Reinstate process is successful and the customer is billed again for the SaaS subscription. 

If the patch is sent with *fail* status, the reinstatement process won't finish on the Microsoft side and the subscription will remain *Suspended*.

Only a suspended subscription can be reinstated. The suspended SaaS subscription remains in a *Suspended* state while it's being reinstated. After this operation has finished, the subscription's status will become *Active*.

### Renewed (*Subscribed*)

The SaaS subscription is automatically renewed by Microsoft at the end of the subscription term of a month or a year. The default for the auto-renewal setting is *true* for all SaaS subscriptions. Active SaaS subscriptions will continue to be renewed with a regular cadence. Microsoft provides inform-only webhook notifications for renew events. A customer can turn off automatic renewal for a SaaS subscription via the Microsoft 365 Admin Portal. In this case, the SaaS subscription will be automatically canceled at the end of the current billing term. Customers can also cancel the SaaS subscription at any time.

Only active subscriptions are automatically renewed. Subscriptions stay active during the renewal process, and if automatic renewal succeeds. After renewal, the start and end dates of the subscription term are updated to the new term's dates.

If an auto-renewal fails because of an issue with payment, the subscription will become *Suspended* and the publisher will be notified.

### Canceled (*Unsubscribed*)

Subscriptions reach this state in response to an explicit customer or CSP action by the cancellation of a subscription from the publisher site, the Azure portal, or Microsoft 365 Admin Center. A subscription can also be canceled implicitly, as a result of nonpayment of dues, after being in the *Suspended* state for 30 days.

After the publisher receives a cancellation webhook call, they should retain customer data for recovery on request for at least seven days. Only then can customer data be deleted.

A SaaS subscription can be canceled at any point in its life cycle. After a subscription is canceled, it can't be reactivated.

## Next steps

- [SaaS fulfillment Subscription APIs v2](pc-saas-fulfillment-subscription-api.md)
- [SaaS fulfillment operations APIs v2](pc-saas-fulfillment-operations-api.md)

**Video tutorials**

- [Building a Simple SaaS Publisher Portal in .NET](https://go.microsoft.com/fwlink/?linkid=2196257)
- [Using the SaaS Offer REST Fulfillment API](https://go.microsoft.com/fwlink/?linkid=2196320)
