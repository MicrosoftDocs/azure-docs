---
title: Messaging Connect overview
titleSuffix: An Azure Communication Services article
description: This article describes Azure Communication Services Messaging Connect concepts.
author: dbasantes
manager: darmour
services: azure-communication-services

ms.author: dbasantes
ms.date: 07/15/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---

# Messaging Connect

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

## Introduction

Welcome to Messaging Connect, a new way to deliver Short Message Service (SMS) globally with Azure Communication Services. It integrates trusted partners so you can lease numbers and meet local regulatory requirements while continuing to use the familiar Azure Communication Services: single API endpoint, strong observability, and deep integration across Microsoft services. Whether you're sending appointment reminders, booking confirmations, or intelligent Copilot prompts, Messaging Connect helps you reach users globally with less complexity.

Instead of building and maintaining separate integrations with multiple providers, you connect once through Azure Communication Services and route traffic to global partners. The partner handles number leasing and compliance. Messaging, observability, and AI workflows remain inside your Azure environment where you already build, monitor, and scale.

Value at a glance:

- Global reach across 190+ countries

- Local compliance and faster provisioning through partners

- Simple to use Azure Communication Services APIs/SDKs, diagnostics, and Event Grid observability

- Separation of duties: Microsoft provides the developer platform; partners deliver and provision numbers

## Conceptual Overview

Global SMS is inherently complex: regulations differ by country, sender types vary, and delivery routes are fragmented. Messaging Connect integrates pre-approved partners so you can acquire compliant sender identities and route traffic without leaving the Azure Communication Services developer experience.

Provisioning flow (high level):

1. In the Azure portal, go to the Messaging Connect blade

2. Select your Messaging Connect partner.

3. You’re redirected to the partner's portal to purchase/configure SMS capable phone numbers, complete any required registrations, and await approval.

4. The partner syncs approved numbers back to your Azure Communication Services resource.

5. The number appears in the Azure portal and is ready for use with Azure Communication Services SMS APIs.

:::image type="content" source="./media/message-connect-provision-concept.png" alt-text="Diagram showing Messaging Connect number provisioning flow in Azure." lightbox="./media/message-connect-provision-concept.png":::

You can send and receive SMS using the standard Azure Communication Services SMS APIs. When you send messages, you authenticate with Azure as usual and include a key from your Messaging Connect partner at runtime so we can route your traffic appropriately. The partner handles message delivery, while observability—like delivery receipts, diagnostics, and logging—remains in Azure with your other services.

This model works well in real-world scenarios. You can use Messaging Connect to reach users worldwide—whether you're building an AI-powered assistant with Copilot Studio, managing logistics that require local sender IDs in Brazil and India, or coordinating campaigns across dozens of countries. Azure Communication Services, via Messaging Connect, enables you to acquire the right sender identities through a trusted partner and use them with your preferred Azure Communication Services SMS SDK—while keeping full control and observability in Azure.

:::image type="content" source="./media/message-connect-send-receive-sms.png" alt-text="Diagram showing the architecture using Messaging Connect and ACS API."lightbox="./media/message-connect-send-receive-sms.png":::

### Capabilities

The following table summarizes capabilities available when using Messaging Connect during Public Preview. Some capabilities are provided directly by Azure, others by Messaging Connect partners.

| Capability                          | Supported |
|------------------------------------|-----------|
| Supported partners                 | Infobip (more partners coming soon) |
| Long Codes                         |    ✔️     |
| Dynamic Alphanumeric Sender ID     |    ✔️     |
| Short Codes                        |    ❌ (coming soon)     |
| Pre-Registered Alpha Sender ID (partner-managed)    |    ✔️    |
| Two-way messaging                  |    ✔️     |
| One-way messaging                  |    ✔️     |
| 1:1 (single recipient)             |    ✔️     |
| 1:N (bulk messaging)               |    ✔️     |
| Coverage in 190+ countries         |    ✔️     |
| Delivery Reports (DLRs)            |    ✔️     |
| Event Grid for inbound messages    |    ✔️     |
| Partner-managed Opt Out            |    ✔️     |
| Local regulatory enforcement       |    ✔️     |
| C# SDK                             |    ✔️     |
| JavaScript SDK                     |    ✔️     |
| Python SDK                         |    ❌ (coming soon)    |
| Java SDK                           |    ❌ (coming soon)    |
| Automatic Country Sender selection (partner-managed)   | Infobip ✔️  |

### 🌐 Country Availability

Messaging Connect significantly expands the number of countries you can reach with Azure Communication Services—supporting over 190 countries through our global partner network.
During Public Preview, you can acquire and use two types of sender identities from the Messaging Connect Partner:

- Long Codes – Standard local phone numbers or mobile numbers that support two-way SMS. Often known as Virtual Long codes. 
- Dynamic Alphanumeric Sender IDs – One-way, branded senders (for example, “CONTOSO”) where permitted. You can enable DASID only in non-Azure Communication Services supported countries.

When you search for a country and number type in the Azure portal, you're offered Messaging Connect as an option if Azure Communication Services doesn’t support that configuration directly. You then complete the provisioning process through the partner’s portal.

The Messaging Connect partner determines country availability. The Messaging Connect partner (for example, Infobip) handles number types, compliance requirements, and onboarding steps, which vary by country. 


| Partner | Global reach | Supported countries |
|---------|----------------------|---------|
| Infobip | Connected to 800+ carriers in 200+ countries, Infobip supports short codes, long codes (VLNs), and alphanumeric senders. One-way SMS is available in nearly all markets; two-way in 100+ countries.| [View Infobip Coverage](https://www.infobip.com/docs/essentials/getting-started/sms-coverage-and-connectivity). |

### Authentication: Secure Access with Azure Identity

To send messages through Messaging Connect, your application must authenticate with Azure Communication Services using one of the supported identity models. This step verifies that your app has permission to send messages through your Azure Communication Services resource and ensures your messages are associated with the correct Azure subscription.

Azure Communication Services supports the following authentication methods:

- Access Key Authentication (Connection strings)
- Microsoft Entra ID Authentication

You authenticate with Azure Communication Services the same way you would for any other SMS request. Messaging Connect doesn't change the way authentication works at the platform level—it simply adds a partner-based routing step after your message is validated.

Learn more: [Authenticate to Azure Communication Services](../../concepts/authentication.md)

Once authenticated, your application also includes a partner API key at runtime to route the message through the correct Messaging Connect partner. This partner API key is part of the message payload and is explained further in the next section.

### How Messaging Connect Validates Your Requests 

Before a message can be sent using Messaging Connect, Azure checks that your request contains the necessary routing information and is correctly authenticated. To perform this step, your payload must include specific metadata that identifies the Messaging Connect partner and allows Azure Communication Services to route the message through their infrastructure.

#### Required Payload Format

When you send a message using a Messaging Connect number, your request must include a `messagingConnect` object. This object contains the API key provided by the Messaging Connect partner (for example, Infobip) and the partner’s name. Azure uses this information to authorize the request and determine how to route the message.

```json
{
  "from": "+447700900123",
  "to": ["+447700900456"],
  "message": "Hello from Messaging Connect!",
  "options": {
    "messagingConnect": {
      "apiKey": "your-partner-api-key",
      "partner": "[PARTNER NAME]"
    }
  }
}
```
The `messagingConnect` object is required whenever you use a number provisioned through Messaging Connect. If it’s missing or misconfigured, Azure Communication Services rejects the message.
Once this metadata is included, Azure Communication Services performs validation checks in two stages: first, Azure Communication Services validates your request as soon as it’s received, and then again after submitting it to the partner.

##### Synchronous Validation
This first layer of validation happens as soon as Azure Communication Services receives your message request. If something is missing or invalid—such as the partner name, the API key, or the association between the number and your Azure Communication Services resource—you receive an immediate error response. This check prevents messages from being sent incorrectly or routed to the wrong partner.

**Common validation outcomes:**

| Scenario                                                    | Response                                                                 |
|-------------------------------------------------------------|--------------------------------------------------------------------------|
| Missing `messagingConnect` fields                           | 400 Bad Request with validation details                                  |
| Unauthorized sender number                                  | 401 Unauthorized                                                         |
| Missing `messagingConnect` for Messaging Connect phone number | 400 Bad Request – “MessagingConnect option isn't provided”       |
| Partner mismatch                                            | 400 Bad Request – “MessagingConnect option isn't matching with the number information.” |



These errors return synchronously in your API response and also appear in Azure diagnostics and logs.

##### Asynchronous Delivery Errors

Even if your request passes synchronous validation, Azure Communication Services might still not hand it off to the Messaging Connect partner. In some cases, Azure Communication Services stops the message before handoff—for example, if the recipient previously opted out or there's a known delivery block from the partner. These situations still result in a delivery report, so you’re always informed of the message outcome.
Once a message is passed to the partner, any downstream delivery failures—like number unreachable, expired validity period, or carrier-level rejection—are also returned asynchronously via delivery reports. You can view delivery statuses in your delivery reports from Azure Event Grid events (if configured).

Learn more: [Delivery Reports on Azure Event Grid Events](../../../event-grid/communication-services-telephony-sms-events.md)

> [!TIP] 
> To ensure full visibility into your message traffic, we strongly recommend configuring event subscriptions for delivery reports. This setup lets you monitor message status, troubleshoot failures, and integrate with your existing telemetry systems.
Learn how to configure SMS events: [Handle SMS events](../../quickstarts/sms/handle-sms-events.md) 

> [!NOTE]
> If your message fails, check the `messagingConnect` object for accuracy, review the delivery report, and consult partner documentation for downstream error codes.

> [!IMPORTANT]
> Microsoft doesn't retain any credentials used to access external Messaging Connect partners. Partner API keys are used only to process each message request and are immediately discarded after the request is complete. These credentials aren't stored, logged, or persisted in any form.

### Global Access with Secure and Compliant Messaging

Messaging Connect is built for global use—whether you're operating from Asia, Africa, South America, or the European Union. This section explains how data flows across regions, how privacy is maintained, and how Azure ensures compliance with residency requirements.

#### Message Routing and Data Flow

Messaging Connect separates message delivery (handled by the partner) from processing and observability (handled by Azure). Here’s how it works:

- Outbound messages: You send an SMS using the Azure Communication Services API and include partner routing info via `messagingConnect` object. Azure logs the message, performs validation, and then routes it to the selected Messaging Connect partner.
- Inbound messages: The partner receives the SMS and forwards it to Azure’s infrastructure. From there, Azure Communication Services handles the message like any sent to Azure Communication Services-native numbers—triggering events through Event Grid.

Although the partner handles delivery, Azure provides:

- Delivery receipts and observability
- Standard Azure Communication Services APIs and SDKs
- Transient message processing only—no message content is stored

Azure Communication Services doesn't retain SMS message content after delivery or failure. Messages and metadata are processed temporarily in memory only as needed for routing and diagnostics.

> [!IMPORTANT]
> Microsoft doesn't retain any credentials used to access external Messaging Connect partners. Partner API keys are used only to process each message request and are immediately discarded after the request is complete. These credentials aren't stored, logged, or persisted in any form.

Learn more: [Data residency and user privacy](../privacy.md#sms)

#### EU Data Boundary (EUDB)

Azure Communication Services guarantees that SMS data within the EUDB is stored in EUDB regions. As of today, we process and store data in the Netherlands, Ireland, or Switzerland regions, ensuring no unauthorized data transfer outside the EEA (European Economic Area). Also, Azure Communication Services employs advanced security measures, including encryption, to protect SMS data both at rest and in transit. Customers can select their preferred data residency within the EUDB, making sure data remain within the designated EU regions.

Learn more: [European Union Data Boundary (EUDB)](../european-union-data-boundary.md#sms)

#### Using Messaging Connect from Anywhere

Messaging Connect is designed for global use. After you acquire a number through a Messaging Connect partner, you integrate it into your application using Azure Communication Services APIs—regardless of where it's hosted.
However, some countries enforce local telecom rules on number usage, allowed content types, or traffic origination requirements. The Messaging Connect partner manages these requirements during the number provisioning process.
The partner, not Azure Communication Services, optimizes delivery routes. Depending on the number type, local rules, and partner setup, messages may route through local or regional infrastructure.

### Opt-out Management

Opt-out and opt-in compliance is a critical part of SMS messaging, particularly in regulated markets. With Messaging Connect, this responsibility is shared among you (the customer), the partner (for example, Infobip), and Microsoft, with each playing a distinct role.

#### Key Responsibilities

- The partner (for example, Infobip) supports detection of opt-out and opt-in keywords like "STOP" or "START," but the behavior isn't automatic.
> [!NOTE]
> You must explicitly configure these keywords through the partner's portal.
Infobip can maintain a blocklist of opted-out users, but you're expected to manage your own list—especially if opt-outs happen through other channels (for example, email or web forms).
- Confirmation messages such as “you're unsubscribed” aren't sent by default. If desired, you must configure them explicitly with the partner or implement them in your own application.
- You, the customer, are responsible for ensuring your messaging experience complies with local regulations, including opt-out handling, keyword configuration, and end-user consent management.
- Azure Communication Services doesn't process opt-out keywords or sends any automated responses. However, Microsoft does maintain a set of predefined opt-out keywords for observability.

#### What Azure Communication Services Does

By default, Azure Communication Services detects standard Opt-in/out keywords: START and UNSTOP are recognized as Opt-In triggers, while STOP, ARRET, QUIT, END, REVOKE, OPT OUT, CANCEL, and UNSUBSCRIBE are recognized as Opt-out commands. When an incoming message matches one of these keywords exactly, Azure Communication Services automatically processes the request and update the user’s opt-in status in our database accordingly.

### Pricing and Billing

Messaging Connect uses a dual-fee model to separate Microsoft’s platform usage from the partner’s delivery and leasing services.

#### What You Pay Microsoft

You pay a platform fee to use Azure Communication Services APIs and infrastructure for Messaging Connect. This covers message processing, diagnostics, delivery tracking, and API-level observability.

- Azure charges a $0.0025 platform fee for each SMS send request submitted—regardless of whether the message is ultimately delivered by the partner. Microsoft doesn't charge for delivery. 
- This fee is Azure Prepayment (aka Monetary Commit) and MACC-eligible (Microsoft Azure Consumption Commitment) and appears as part of your normal Azure invoice.

The Messaging Connect partner, not Microsoft, handles message delivery.

#### What You Pay the Partner

You pay the Messaging Connect partner directly for:

- Phone number leasing (monthly or annually)
- Per-message delivery fees, which vary by country and route

The partner defines commercial terms and support levels. By default, the Messaging Connect partner (for example, Infobip) bills you directly for delivery and number leasing fees. These charges don't appear on your Azure invoice unless you explicitly set up Marketplace billing.
There are no subscription restrictions. You can use Messaging Connect with any Azure subscription type, including Pay-as-you-go and Enterprise Agreements. Unlike Microsoft's direct SMS offers, Messaging Connect isn't a telecom service—it's a developer platform model.

| Partner | Delivery fee model | Pricing details |
|---------|----------------------|---------|
| Infobip | Pay-as-you-go pricing model for SMS.| [View Infobip SMS rates](https://www.infobip.com/sms/pricing) |

#### Optional: Consolidated Billing via Azure Marketplace

If you prefer to consolidate charges into your Azure invoice, you can request that the partner offer Messaging Connect through the Azure Marketplace.
Here’s how the Marketplace flow works:
1.	You ask the partner (Infobip) to submit a private offer via Azure Marketplace.
2.	Your Azure administrator accepts the offer in the Azure portal.
3.	Each month, the partner sends usage data to Microsoft.
4.	Microsoft bills you on behalf of the partner (a pass-through charge).

This setup simplifies procurement and allows Messaging Connect usage to count toward your Azure MACC commitment.

Learn more: [Azure Marketplace](/marketplace/azure-marketplace-overview)

> [!TIP] 
> Whether you choose Partner or Marketplace billing, the technical experience in Azure remains exactly the same.

## Developer Experience

### Get a Phone Number with Messaging Connect

Messaging Connect introduces a new provisioning model: instead of getting numbers directly from Microsoft, you acquire them through a trusted partner—starting with Infobip—and then connect them to your Azure Communication Services resource.
This process lets you access SMS numbers in over 190 countries while the partner handles local compliance, documentation, and approval flows. 

> [!TIP]
> If you’re new to Azure Communication Services, we recommend starting with the [Create a Communication Services resource](../../quickstarts/create-communication-resource.md) guide to get set-up and ready to onboard SMS with Messaging Connect.

Let's go step-by-step:

1. **Choose your Messaging Connect Partner**

   In the Azure portal, in your Communication Services resource, go to the **Messaging Connect** blade and choose a partner from the list. Accept the terms. You're redirected to the partner’s website to complete the number acquisition.

 :::image type="content" source="./media/message-connect-provision-number-2.png" alt-text="Screenshot showing messaging connect blade." lightbox="./media/message-connect-provision-number-2.png"::: 

 :::image type="content" source="./media/message-connect-provision-number-3.png" alt-text="screenshot showing messaging connect partners." lightbox="./media/message-connect-provision-number-3.png"::: 


2. **Acquire the number on the partner’s portal**

   To purchase the number, follow the prompts provided by the Messaging Connect partner. Depending on the country, you may need to upload supporting documents or complete identity verification. Once approved, the number is assigned to your partner account.

   :::image type="content" source="./media/message-connect-provision-number-4.png" alt-text="Screen showing partner portal with numbers purchased." lightbox="./media/message-connect-provision-number-4.png":::

> [!TIP]
> Need help configuring the Infobip side?
> Follow the official guide to connect your Azure Communication Services resource to Infobip and provision SMS numbers:  
> [SMS for Microsoft Azure Communication Services – Messaging Connect](https://www.infobip.com/docs/integrations/microsoft-azure-acs-messaging-connect)

3. **Return to the Azure portal**

   Once the partner confirms that your numbers are provisioned, they trigger the sync with Azure Communication Services. After the sync is complete, the numbers automatically appear in your ACS resource—ready to use with the ACS SMS API, just like any number provisioned directly through Azure Communication Services. No extra setup is needed on your side.

   :::image type="content" source="./media/message-connect-provision-number-6.png" alt-text="Screenshot showing provisioned numbers in Azure portal." lightbox="./media/message-connect-provision-number-6.png":::

   > [!NOTE]
   > The Messaging Connect partner sets the approval and activation timeline, which varies by country and number type. Messaging Connect doesn't currently support instant provisioning, and Microsoft isn't involved in the vetting or approval process.

**Important notes:**

- Microsoft doesn't manage compliance or vetting for Messaging Connect numbers. The partner handles this process entirely.
- Each partner has different provisioning flows and service-level agreements (SLAs) depending on the region and local telecom regulations.
- Numbers acquired through Messaging Connect appear in the Azure portal with an "Operator Name" label so you can distinguish them from Azure Communication Services-managed numbers.
- To send messages with these numbers, don’t forget to include the `MessagingConnect` object in your API request.


### SMS SDK Tutorial 

> [!NOTE]
> The following API and SDK versions are supported during the Messaging Connect Public Preview:
>
> - **API version:** `2025-05-29-preview`
> - **JavaScript SDK:** [`1.2.0-beta.4`](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/communication/communication-sms/CHANGELOG.md)
> - **.NET SDK:** [`1.1.0-beta.3`](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/communication/Azure.Communication.Sms/CHANGELOG.md)

Messaging Connect builds on the existing SMS capabilities of Azure Communication Services. It uses the same SMS APIs and SDKs, so if you're already familiar with sending messages using ACS—especially if you completed the [Send SMS Quickstart](../../quickstarts/sms/send.md)—you’re nearly there. Just make sure to use the `Send SMS with options` method and include the `MessagingConnect` object in the options field.

If you're new to Azure Communication Services, start by completing the [Send SMS Quickstart](../../quickstarts/sms/send.md) to set up authentication, create your `SmsClient`, and understand the basic structure of a send request. Be sure to include the `MessagingConnect` object in your request.

This object contains:
- The partner name (for example, "infobip")
- The partner API key you received after acquiring the number

Your Azure Communication Services token continues to authorize the request to Azure, and the partner key tells Azure Communication Services how to route the message.

> [!TIP]  
> **How to Get Your Partner API Key from Infobip**  
> To send messages with Messaging Connect, you need an Infobip API key:  
> 1. Sign in to the [Infobip Portal](https://portal.infobip.com/dev/api-keys) using your Infobip credentials.  
> 2. Select **Create New API Key**.  
> 3. Under **API Scopes**, enable: `sms:message:send`.  
> 4. Save your API key in a secure location. You use it in your Azure Communication Services API call.

The following examples show how to send a message with Messaging Connect using C# and JavaScript.

**C# Example**

```csharp
smsClient.Send(
    from: "<YOUR-ACS-NUMBER>",
    to: ["<RECIPIENT-NUMBER>"],
    message: $"Hello from Azure Communication Services!",
    options: new SmsSendOptions(true)
    {
        MessagingConnect = new MessagingConnectOptions("<YOUR-INFOBIP-API-KEY>", "infobip")
    });
```

**JavaScript Example**

```javascript
await smsClient.send(
    {
      from: "<YOUR-ACS-NUMBER>",
      to: ["<RECIPIENT-NUMBER>"],
      message: "Hello from Azure Communication Services! JS SDK is working!",
    },
    {
        enableDeliveryReport: true, // Optional: Enable delivery reports
        messagingConnect: {
          apiKey: "<YOUR-INFOBIP-API-KEY>",
          partner: "infobip"
      }
  });
```

> [!TIP]
> If you're using a Messaging Connect number but don’t include the messagingConnect object, the request fails with a validation error. For a list of possible validation errors and responses, [jump to the validation outcomes table](#synchronous-validation).

**SMS Error Codes**

When you send SMS messages through Messaging Connect, you may encounter error codes—either as part of synchronous validation (immediate API response) or in asynchronous delivery reports.
Azure Communication Services uses the same error model across all SMS traffic, including Messaging Connect.

Learn more: [See full list of SMS error codes](../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md)

## Messaging Connect Partner Directory

Messaging Connect works through direct integrations with trusted global SMS providers. These partners handle number provisioning, compliance, delivery, and opt-out enforcement—while Azure provides the developer platform, observability, and message orchestration.
The following table lists the currently supported partners. More partners will be added over time to provide broader coverage and redundancy.

| Partner | Brief Description | Country/region availability | Pricing |
|---------|-------------------|-----------------------------|---------|
| Infobip | Global communications platform with direct connections to over 800 carriers in more than 200 countries and territories. Infobip supports all sender types including short codes, long codes (virtual long codes or VLNs), and alphanumeric (alphas). [More info](https://www.infobip.com/docs/sms/get-started/senders-and-numbers) | One-way messaging is available for virtually all networks in all countries and territories. Two-way messaging is supported in over 100 countries. [Country coverage](https://www.infobip.com/docs/essentials/getting-started/sms-coverage-and-connectivity) | Infobip offers a flexible pay-as-you-go pricing model for SMS. [View rates](https://www.infobip.com/sms/pricing). For custom pricing, [contact sales](https://www.infobip.com/contact). |


> [!IMPORTANT]
> Messaging Connect partners are selected based on global reach, regulatory expertise, reliability, and strong integration with Microsoft’s ecosystem.

## Next Steps

> [!div class="nextstepaction"]
> [Send SMS messages](../../quickstarts/sms/send.md)
