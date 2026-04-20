---
title: WhatsApp usernames and business-scoped user IDs (BSUID)
titleSuffix: An Azure Communication Services concept document
description: Learn about WhatsApp usernames and business-scoped user IDs (BSUIDs) and how they affect messaging in Azure Communication Services.
author: gelli
services: azure-communication-services
ms.author: gelli
ms.date: 04/01/2026
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# WhatsApp usernames and business-scoped user IDs (BSUID)

WhatsApp is launching usernames in 2026. Usernames are an optional feature that allows WhatsApp users to display a username instead of their phone number. To support this change, Meta introduces a new identifier called the **business-scoped user ID (BSUID)** that uniquely identifies a WhatsApp user within a specific business portfolio.

This article explains what BSUIDs are, how they affect Azure Communication Services Advanced Messaging, and how to prepare your integration.

## What is a BSUID?

A business-scoped user ID (BSUID) is a unique, opaque identifier that Meta assigns to a WhatsApp user within a specific business portfolio. BSUIDs are:

- **Automatically generated** by Meta for each user-portfolio pair.
- **Prefixed with a country code**: The format is `{ISO 3166 alpha-2 country code}.{up to 128 alphanumeric characters}`, for example, `US.13491208655302741918`.
- **Unique per business portfolio**: A BSUID is scoped to an individual business portfolio. The same WhatsApp user has a different BSUID for each business portfolio they interact with.
- **Stable across username changes**: If a user changes their username, their BSUID remains the same.
- **Regenerated on phone number change**: If a user changes their phone number, a new BSUID is generated.

> [!IMPORTANT]
> When using BSUIDs in API requests, use the entire BSUID value including the country code and period. Omitting or modifying any part of the BSUID causes the request to fail.

## Impact on outbound messages

> [!NOTE]
> Sending messages to BSUIDs will be available starting in June 2026, when Meta rolls out the WhatsApp username feature to end users. Until then, the `to` field only supports phone numbers.

The existing `to` field in the Send Notification API now accepts either a phone number or a BSUID. The service automatically detects the format and routes accordingly. No new fields are needed.

**Send to a phone number (existing behavior):**

```json
{
  "channelRegistrationId": "<channel-registration-id>",
  "to": ["+14255550199"],
  "kind": "text",
  "content": "Hello!"
}
```

**Send to a BSUID:**

```json
{
  "channelRegistrationId": "<channel-registration-id>",
  "to": ["US.13491208655302741918"],
  "kind": "text",
  "content": "Hello!"
}
```

## Impact on inbound messages

When a WhatsApp user sends a message to your business, the [AdvancedMessageReceived](../../../../event-grid/communication-services-advanced-messaging-events.md#microsoftcommunicationadvancedmessagereceived-event) event now includes a new `fromBSUID` field containing the sender's BSUID.

If the user has adopted a username and their phone number isn't available, the existing `from` field may be empty. Both fields coexist when the phone number is available.

**Phone number available:**

```json
"data": {
  "from": "14255551234",
  "fromBSUID": "US.13491208655302741918",
  "to": "{channel-id}",
  "content": "Hi there!",
  "channelType": "whatsapp",
  "messageType": "text"
}
```

**Phone number hidden (username adopted):**

```json
"data": {
  "from": "",
  "fromBSUID": "US.13491208655302741918",
  "to": "{channel-id}",
  "content": "Hi there!",
  "channelType": "whatsapp",
  "messageType": "text"
}
```

> [!CAUTION]
> The `from` field may now be empty or null. Do not assume this field always contains a phone number.

## Impact on event subjects

The `subject` field in Event Grid events for `AdvancedMessageReceived` uses the format `advancedMessage/sender/{sender@id}/recipient/{channel-id}`. When a WhatsApp user hides their phone number, the `{sender@id}` portion of the subject now contains the sender's BSUID instead of their phone number.

> [!WARNING]
> **Breaking change:** If you have Event Grid subscriptions with subject filters based on the sender's phone number, those filters won't match events from users who have adopted a WhatsApp username and hidden their phone number. Update your subject filters and any webhook automation code that parses the event subject to account for BSUID values.

**Subject with phone number:**

```
advancedMessage/sender/14255551234/recipient/11111111-1111-1111-1111-111111111111
```

**Subject with BSUID (phone number hidden):**

```
advancedMessage/sender/US.13491208655302741918/recipient/11111111-1111-1111-1111-111111111111
```

## Impact on delivery status events

The [AdvancedMessageDeliveryStatusUpdated](../../../../event-grid/communication-services-advanced-messaging-events.md#microsoftcommunicationadvancedmessagedeliverystatusupdated-event) event now includes a new `toBSUID` field containing the recipient's BSUID.

If the message was sent to a BSUID, the existing `to` field may be empty.

**Sent to a phone number:**

```json
"data": {
  "from": "{channel-id}",
  "to": "14255550199",
  "toBSUID": "US.13491208655302741918",
  "status": "Delivered",
  "channelType": "whatsapp",
  "messageId": "22222222-2222-2222-2222-222222222222"
}
```

**Sent to a BSUID:**

```json
"data": {
  "from": "{channel-id}",
  "to": "",
  "toBSUID": "US.13491208655302741918",
  "status": "Delivered",
  "channelType": "whatsapp",
  "messageId": "22222222-2222-2222-2222-222222222222"
}
```

## Phone number availability rules

When a WhatsApp user adopts a username, their phone number may no longer appear in webhook payloads. However, the phone number is still included when any of the following conditions are met:

- You messaged or called the user's phone number **within the last 30 days**.
- You received a message or call from the user's phone number **within the last 30 days**.
- The user is in your **Contact Book**.

> [!NOTE]
> The 30-day lookback is evaluated **per business phone number**, not per portfolio. If you message a user from one business phone number, webhooks from a different business phone number in your portfolio won't include the user's phone number unless that specific number also had recent interaction.

### Contact Book

Meta provides a Contact Book feature that automatically stores WhatsApp user contact information (phone number and BSUID mappings) from interactions. Key details:

- The Contact Book is provided and hosted by Meta. It is by default enabled. No integration work is required.
- It's scoped to the business portfolio level.
- Only interactions that occur **after** the Contact Book launches are captured. Prior interactions aren't retroactively stored.


## Limitations

- **Authentication templates**: One-tap, zero-tap, and copy code authentication templates still require phone numbers. BSUIDs can't be used for these template types.
- **Portfolio scoping**: BSUIDs are scoped to individual business portfolios and can't be used across different portfolios.
- **Contact Book**: Only captures interactions after launch. No retroactive data.

## How to prepare

> [!WARNING]
> **Breaking change:** The `from` and `to` fields in Advanced Messaging events may now be empty or null. Any code that assumes these fields always contain a phone number will break. You must update your event handlers to use the new `fromBSUID` and `toBSUID` fields.

To prepare your integration for WhatsApp usernames and BSUIDs:

1. **Stop assuming `from` and `to` always contain phone numbers.** Review any logic that parses, validates, or formats these fields as E.164 numbers. These fields may now be empty or null.

2. **Process `fromBSUID` and `toBSUID` fields.** Update your event handlers to read the new BSUID fields in [AdvancedMessageReceived](../../../../event-grid/communication-services-advanced-messaging-events.md#microsoftcommunicationadvancedmessagereceived-event) and [AdvancedMessageDeliveryStatusUpdated](../../../../event-grid/communication-services-advanced-messaging-events.md#microsoftcommunicationadvancedmessagedeliverystatusupdated-event) events.

3. **Update outbound messaging logic.** When replying to a username-only user, use the BSUID from the `fromBSUID` field as the `to` value in your send request. Sending to BSUIDs will be available starting in June 2026.

4. **Review Event Grid subject filters.** If you have webhook subscriptions that filter on the event `subject` (for example, filtering by a specific sender phone number), update those filters to also handle BSUID values. The sender portion of the subject may now contain a BSUID instead of a phone number.

## Key timeline

| Date | Milestone |
|------|-----------|
| March 31, 2026 | BSUIDs begin appearing in production webhook payloads |
| Early April 2026 | Contact Book feature launches |
| June 2026 | Sending messages to BSUIDs available in production; WhatsApp begins rolling out usernames to end users |

## Related content

- [Advanced Messaging for WhatsApp overview](whatsapp-overview.md)
- [Handle Advanced Messaging events](../../../quickstarts/advanced-messaging/whatsapp/handle-advanced-messaging-events.md)
- [Advanced Messaging event schemas](../../../../event-grid/communication-services-advanced-messaging-events.md)
- [Send WhatsApp template messages](template-messages.md)
- [Meta: Business-scoped user IDs](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-scoped-user-ids/)
