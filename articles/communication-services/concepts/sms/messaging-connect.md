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

Welcome to Messaging Connect—the new way to deliver SMS globally with Azure Communication Services.

This is not just a new feature. This is a platform evolution. Messaging Connect is a partner-powered model that dramatically expands Azure’s messaging reach while preserving everything developers love about ACS: unified APIs, strong observability, and deep integration across Microsoft services.

With Messaging Connect, you don’t need to build and maintain separate integrations with providers around the world. Instead, you connect once through Azure Communication Services to access global SMS coverage via trusted partners. Number leasing and compliance are handled through the partner, but everything else—messaging, observability, and AI workflows—stays in your Azure environment, where you already build, monitor, and scale.

This model offers the best of both worlds. You get global coverage, local compliance, and faster provisioning—without giving up the rich analytics, developer experience, and integration surface that Microsoft delivers. Whether you're sending appointment reminders, booking confirmations, or intelligent Copilot prompts, Messaging Connect turns Azure into the central nervous system for SMS engagement at scale.

This is global messaging the Microsoft way—smart, scalable, and ready for what’s next.

## Conceptual Overview

Messaging Connect gives you a way to bring global SMS into your applications using Azure Communication Services.

If you’ve worked with messaging before, you know how complex it can get: different regulations in every region, separate vendors for different markets, and fragmented delivery infrastructure that’s hard to monitor. For that, we are bringing partners and experts in the field who will help you navigate through it. With Messaging Connect, you lease numbers directly from one of our trusted messaging partners and use them through Azure Communication Services (ACS) as if they were native ACS numbers.

The process starts in the Azure portal. When you search for an SMS number type and country, and ACS doesn’t offer direct provisioning, you’ll be guided to connect with a pre-integrated partner. From there, you’re redirected to the partner’s portal to purchase the number. Depending on the country and sender type, you may need to complete registration steps, submit documentation, or wait for approval. Once the partner assigns the number to you, they initiate the sync to Azure. You then return to the Azure portal, where the numbers will appear—ready to use.

:::image type="content" source="./media/mc-provision-concept.png" alt-text="Messaging Connect number provisioning flow in Azure." lightbox="./media/mc-provision-concept.png":::


You can send and receive SMS using the standard ACS SMS APIs. When you send messages, you’ll authenticate with ACS as usual and include a key from your Messaging Connect partner at runtime so we can route your traffic appropriately. Message delivery is handled by the partner, but observability—like delivery receipts, diagnostics, and logging—remains in Azure, alongside your other services.

This model works well in real-world scenarios. For example, if you're a logistics company needing local sender IDs in Brazil and India, Azure Communication Services via Messaging Connect helps you acquire them through a partner and use them via a single Azure Communication Services SMS SDK. If you're building an AI-powered appointment assistant with Copilot Studio, you can use Messaging Connect numbers to send reminders in markets where ACS doesn’t provide direct coverage. If you're managing bookings, alerts, or re-engagement campaigns across dozens of countries, you can use Messaging Connect to reach users globally—while keeping control and insight inside Azure.

:::image type="content" source="./media/mc-runtime-concept.png" alt-text="Runtime architecture using Messaging Connect and ACS API."lightbox="./media/mc-runtime-concept.png":::

### Capabilities

The following table summarizes capabilities available when using Messaging Connect during Public Preview. Some capabilities are provided directly by Azure, others by Messaging Connect partners.

| Capability                          | Supported |
|------------------------------------|-----------|
| Long Codes                         |    ✔️     |
| Dynamic Alphanumeric Sender ID     |    ✔️     |
| Short Codes                        |    ❌     |
| Pre-Registered Alpha Sender ID     |    ❌     |
| Two-way messaging                  |    ✔️     |
| One-way messaging                  |    ✔️     |
| 1:1 (single recipient)             |    ✔️     |
| 1:N (bulk messaging)               |    ✔️     |
| Coverage in 190+ countries         |    ✔️     |
| Delivery Reports (DLRs)            |    ✔️     |
| Event Grid for inbound messages    |    ✔️     |
| Partner-managed Opt Out            |    ✔️     |
| ACS-level blocking (via partner)   |    ✔️     |
| Local regulatory enforcement       |    ✔️     |
| C# SDK                             |    ✔️     |
| JavaScript SDK                     |    ✔️     |
| Python SDK                         |    ❌     |
| Java SDK                           |    ❌     |
| Supported partners                 | Infobip (additional partners coming soon) |
| Automatic Country Sender selection (partner-managed)   | Infobip ✔️  |

> **Note**: Future updates will include support for more SDKs, sender types, and additional partners.

## Authentication: Secure Access with Azure Identity

To send messages through Messaging Connect, your application must authenticate with Azure Communication Services (ACS) using one of the supported identity models. This step verifies that your app has permission to send messages through your ACS resource and ensures your messages are associated with the correct Azure subscription.

ACS supports the following authentication methods:

- Access Key Authentication (Connection strings)
- Microsoft Entra ID Authentication

You’ll authenticate with ACS the same way you would for any other SMS request. Messaging Connect does not change the way authentication works at the platform level—it simply adds a partner-based routing step after your message is validated.

Learn more: [Authenticate to Azure Communication Services](https://learn.microsoft.com/en-us/azure/communication-services/concepts/authentication)

Once authenticated, your application also includes a partner API key at runtime to route the message through the correct Messaging Connect partner. This is part of the message payload and is explained further in the next section.

## How Messaging Connect Validates Your Requests 

Before a message can be sent using Messaging Connect, Azure checks that your request contains the necessary routing information and is correctly authenticated. To do this, your payload must include specific metadata that identifies the Messaging Connect partner and allows ACS to route the message through their infrastructure.

### Required Payload Format

When you send a message using a Messaging Connect number, your request must include a `messagingConnect` object. This object contains the API key provided by the Messaging Connect partner (e.g., Infobip) and the partner’s name. Azure uses this information to authorize the request and determine how to route the message.

```json
{
  "from": "+447700900123",
  "to": ["+14155550100"],
  "message": "Hello from Messaging Connect!",
  "options": {
    "messagingConnect": {
      "apiKey": "your-partner-api-key",
      "partner": "[PARTNER NAME]"
    }
  }
}
```
The `messagingConnect` object is required whenever you use a number provisioned through Messaging Connect. If it’s missing or misconfigured, your message will not be accepted.
Once this metadata is included, Azure performs validation checks in two stages: first, immediately upon receiving your request, and later, after it’s submitted to the partner.

#### 1. Synchronous Validation (Happens Immediately)
This is the first layer of validation, and it happens the moment your message request is received. If something is missing or invalid—such as the partner name, the API key, or the association between the number and your ACS resource—you’ll receive an immediate error response. This prevents messages from being sent incorrectly or routed to the wrong provider.
Common validation outcomes:

| Scenario                                                    | Response                                                                 |
|-------------------------------------------------------------|--------------------------------------------------------------------------|
| Missing `messagingConnect` fields                           | 400 Bad Request with validation details                                  |
| Unauthorized sender number                                  | 401 Unauthorized                                                         |
| Missing `messagingConnect` for Messaging Connect phone number | 400 Bad Request – “MessagingConnect option hasn't been provided.”       |
| Partner mismatch                                            | 400 Bad Request – “MessagingConnect option is not matching with the number information.” |



These errors are returned synchronously in your API response and will also appear in Azure diagnostics and logs.

#### 2. Asynchronous Delivery Errors (Reported Later)

If your request passes synchronous validation, it’s not guaranteed to be handed off to the Messaging Connect partner. There are scenarios where ACS will stop the message before handoff—for example, if the recipient has previously opted out or if there’s a known delivery block from the partner. These situations still result in a delivery report, so you’re always informed of the message outcome.
Once a message is passed to the partner, any downstream delivery failures—like number unreachable, expired validity period, or carrier-level rejection—are also returned asynchronously via delivery reports. You can view delivery statuses in:

- Azure delivery reports <- Event Grid events (if configured)
- Partner documentation for error interpretation

Learn more: [Delivery Reports on Azure Event Grid Events](https://learn.microsoft.com/en-us/azure/event-grid/communication-services-telephony-sms-events)

> [!TIP] 
> To ensure full visibility into your message traffic, we strongly recommend configuring event subscriptions for delivery reports. This allows you to monitor message status, troubleshoot failures, and integrate with your existing telemetry systems.
Learn how to configure SMS events : [Handle SMS events](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/sms/handle-sms-events) 

> [!NOTE]
> If your message fails, check the `messagingConnect` object for accuracy, review the delivery report, and consult partner documentation for downstream error codes.

> [!IMPORTANT]
> Microsoft does not retain any credentials used to access external Messaging Connect partners. Partner API keys are used solely for the purpose of processing an individual message request and are immediately discarded once the request is completed. These credentials are not stored, logged, or persisted in any form.

## Country Availability

Messaging Connect significantly expands the number of countries you can reach with Azure Communication Services—supporting over 190 countries through our global partner network.
During Public Preview, you can acquire and use two types of sender identities from the Messaging Connect Partner:

- Long Codes – Standard local phone numbers or mobile numbers that support two-way SMS. Often known as Virtual Long codes. 
- Dynamic Alphanumeric Sender IDs – One-way, branded senders (e.g., “CONTOSO”) where permitted. You can enable DASID only in non-ACS supported countries.

When you search for a country and number type in the Azure portal, you’ll be offered Messaging Connect as an option if ACS doesn’t support that configuration directly. You’ll then complete the provisioning process through the partner’s portal.

- 🌐 Country availability is determined by the Messaging Connect partner. The number types, compliance requirements, and onboarding steps vary by country and are handled entirely by the Messaging Connect partner (e.g., Infobip).
- 📌 Short codes are not yet supported in Public Preview but are planned for General Availability.

## Global Access with Secure and Compliant Messaging

Messaging Connect is built for global use—whether you're operating from Asia, Africa, South America, or the European Union. This section explains how data flows across regions, how privacy is maintained, and how Azure ensures compliance with residency requirements.

### 1. Message Routing and Data Flow

Messaging Connect separates message delivery (handled by the partner) from processing and observability (handled by Azure). Here’s how it works:

- Outbound messages: You send an SMS using the ACS API and include partner routing info via `messagingConnect` object. Azure logs the message, performs validation, and then routes it to the selected Messaging Connect partner.
- Inbound messages: The partner receives the SMS and forwards it to Azure’s infrastructure. From there, it’s handled just like messages sent to ACS-native numbers—events through Event Grid.

Although the partner handles delivery, Azure provides:

- Delivery receipts and observability- 
- Standard ACS APIs and SDKs
- Transient message processing only—no message content is stored

Azure Communication Services does not retain SMS message content after delivery or failure. Messages and metadata are processed temporarily in memory only as needed for routing and diagnostics.

> [!IMPORTANT]
> Microsoft does not retain any credentials used to access external Messaging Connect partners. Partner API keys are used solely for the purpose of processing an individual message request and are immediately discarded once the request is completed. These credentials are not stored, logged, or persisted in any form.

Learn more: [Data residency and user privacy](https://learn.microsoft.com/en-us/azure/communication-services/concepts/privacy#sms)

### 2. EU Data Boundary (EUDB)

Azure Communication Services guarantees that SMS data within the EUDB is stored in EUDB regions. As of today, we process and store data in the Netherlands, Ireland, or Switzerland regions, ensuring no unauthorized data transfer outside the EEA (European Economic Area). Also, Azure Communication Services employs advanced security measures, including encryption, to protect SMS data both at rest and in transit. Customers can select their preferred data residency within the EUDB, making sure data remains within the designated EU regions.

Learn more: [European Union Data Boundary (EUDB)](https://learn.microsoft.com/en-us/azure/communication-services/concepts/european-union-data-boundary#sms)

### 3.Using Messaging Connect from Anywhere

Messaging Connect is designed for global use. Once you’ve acquired a number through a Messaging Connect partner, you can integrate it into your application using ACS APIs—regardless of where your application is hosted.
That said, some countries may enforce local telecom regulations on how numbers are used, what types of content can be sent, or whether traffic must originate from specific regions. These requirements are handled by the Messaging Connect partner during the number provisioning process.
Delivery routes are optimized by the partner, not by Azure. Messages may be routed through local or regional routing infrastructure, depending on the number type, country regulations, and the Messaging Connect partner account configuration. 




