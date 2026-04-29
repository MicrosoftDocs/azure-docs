---
title: Stripe partner topics with Azure Event Grid - Azure Event Grid | Microsoft Learn
description: Send events from Stripe to Azure services with Azure Event Grid.
ms.topic: concept-article
ms.date: 03/31/2026
ms.service: azure-event-grid
author: robece
ms.author: robece
---

# Stripe partner topics with Azure Event Grid (preview)

Stripe, the financial infrastructure platform for businesses, provides developers and enterprises with the tools they need to accept payments, grow revenue, and accelerate business operations.

By using the Stripe partner topic, you can use events emitted by Stripe's system to accomplish many tasks: automate payment workflows, manage subscription lifecycles, and react to financial signals in real time.

With this integration, you can stream your Stripe payment events with high reliability into Azure. There, you can consume the events by using your favorite Azure resources. By using this integration, you can react to events, gain insights, monitor for payment anomalies, and interact with other powerful data pipelines.

For organizations that use Stripe and Azure, this integration allows you to seamlessly integrate payment data across your entire stack.

> [!NOTE]
> Stripe partner topics for Azure Event Grid are currently in **preview**.

## Available event types

For a full list of available Stripe event types and their descriptions, see the [Stripe API documentation](https://docs.stripe.com/api/events/types).

Common event types include:

| Event type | Description |
|---|---|
| `payment_intent.succeeded` | A payment intent was successfully confirmed and funds captured. |
| `payment_intent.payment_failed` | A payment intent failed to confirm. |
| `charge.refunded` | A charge was refunded, either partially or fully. |
| `charge.failed` | A charge attempt failed. |
| `customer.subscription.created` | A new subscription was created for a customer. |
| `customer.subscription.updated` | A subscription was updated, such as a plan change or quantity adjustment. |
| `customer.subscription.deleted` | A subscription was canceled or ended. |
| `invoice.paid` | An invoice was paid successfully. |
| `invoice.payment_failed` | A payment attempt for an invoice failed. |
| `checkout.session.completed` | A checkout session was completed by the customer. |

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
