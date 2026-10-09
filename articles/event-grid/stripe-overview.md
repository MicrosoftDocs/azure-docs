---
title: Stripe partner topics with Azure Event Grid - Azure Event Grid | Microsoft Learn
description: Send events from Stripe to Azure services with Azure Event Grid.
ms.topic: concept-article
ms.date: 03/31/2026
ms.service: azure-event-grid
author: robece
ms.author: robece
---

# Stripe partner topics with Azure Event Grid

Stripe provides businesses with tools to accept payments and manage financial operations. By using a Stripe partner topic, you can send Stripe events to Azure services to automate payment workflows, manage subscriptions, monitor financial activity, and synchronize data.

Azure Event Grid routes these events to services such as Azure Functions, Azure Logic Apps, Azure Monitor, and Microsoft Fabric.

## Choose an event format

Stripe supports two event formats:

- **Thin events** contain the event type, resource ID, and other event metadata. Your application can use this information to retrieve the latest resource state from the Stripe API. Thin event notifications are unversioned, so you can upgrade your Stripe API version without changing your event destination configuration. Use thin events for new applications.
- **Snapshot events** contain the complete Stripe `Event` object, including a point-in-time snapshot of the related resource. Snapshot event payloads use the API version configured for the event destination. Use snapshot events for existing or third-party integrations that depend on receiving resource data in the pushed event payload.

Choose the event format when you configure your Stripe event destination. You can then select the event types that you want Stripe to send.

## Available event types

The available event types depend on the event format:

- For thin events, see the [thin event catalog](https://docs.stripe.com/api/v2/core/events/event-types).
- For snapshot events, see the [snapshot event catalog](https://docs.stripe.com/api/events/types).

Subscribe only to the event types that your application processes. Limiting the selected event types reduces unnecessary traffic and processing. Common thin event types include:

| Event type | Description |
|---|---|
| `v1.payment_intent.succeeded` | A payment intent succeeded. |
| `v1.payment_intent.payment_failed` | A payment intent failed. |
| `v1.charge.refunded` | A charge was partially or fully refunded. |
| `v1.customer.subscription.created` | A subscription was created. |
| `v1.customer.subscription.updated` | A subscription changed. |
| `v1.customer.subscription.deleted` | A subscription ended. |
| `v1.invoice.paid` | An invoice was paid. |
| `v1.invoice.payment_failed` | An invoice payment failed. |
| `v1.checkout.session.completed` | A customer completed a Checkout Session. |

Note: Thin event notifications contain identifiers and event metadata. Retrieve the related resource from the Stripe API when your application needs its latest state.

## Event delivery behavior

Stripe delivers events asynchronously. Your application might receive the same event more than once, and events might not arrive in the order in which they occurred.

Use the event ID to identify events that you've already processed, and make your event handlers idempotent so that repeated delivery doesn't repeat an operation. When event order matters, retrieve the latest resource state from the Stripe API before taking action.

## Use cases

### Automate payment fulfillment

Reacting immediately to successful payments is critical for delivering a great customer experience. Use Stripe events with Azure Functions and Azure Logic Apps to trigger order processing, provision digital goods, or send confirmation receipts as soon as a `payment_intent.succeeded` or `checkout.session.completed` event arrives.

### Manage subscription lifecycles

Subscription businesses need to respond to plan changes, renewals, and cancellations in real time. Use `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted` events to synchronize entitlements, update user permissions, and trigger onboarding or offboarding workflows across your systems.

### Handle failed payments and recover revenue

Failed payments represent lost revenue. React to `invoice.payment_failed` and `payment_intent.payment_failed` events to automatically trigger retry logic, notify customers through Azure Communication Services, or escalate to a support workflow before churn occurs.

### Financial reconciliation and reporting

Keeping accurate financial records is essential for compliance and business operations. Stream `charge.*` and `invoice.*` events into Azure Synapse Analytics or Microsoft Fabric Real-Time Intelligence to build real-time reconciliation pipelines, audit logs, and revenue dashboards without custom data extraction tooling.

### Monitor for fraud and anomalies

Combining payment monitoring with incident response procedures is important for protecting a distributed commerce system. Route Stripe events to Azure Monitor or Microsoft Sentinel to detect unusual payment patterns, flag high-risk transactions, and trigger automated responses to potential fraud signals.

### Synchronize customer data

Maintaining a consistent view of your customers across business systems is critical for delivering personalized experiences. Use `customer.*` events to keep your CRM, data warehouse, and marketing platforms in sync with the latest customer profile and payment status information from Stripe.

## Next steps

- [Subscribe to Stripe events](subscribe-to-stripe-events.md)
- [Azure Event Grid partner topics overview](partner-events-overview.md)
- [Stripe events documentation](https://docs.stripe.com/event-destinations)
